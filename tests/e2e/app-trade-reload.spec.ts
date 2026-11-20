import { expect, test, type Browser, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, shareAs, userId } from './workshop-guests.shared'
import { resting, slateKey, workshopReady, workshopStatus } from './app-native-workshop.shared'
import { drawnWords, freshContext, harness, harnessOn, roomOf, storedWords, throttle, traceSockets } from './app-trade-harness.shared'

/**
 * A note and a card trading places must leave one thing behind, the same for the server, every
 * open screen and everyone who joins later, even when the page that made the trade reloads or is
 * closed a moment after, on a slow link, through a relay with hosted latency.
 *
 * Staging (test.slatebox.com, 2026-11-19, engine dd8d585 / app 0d21a5c7) failed these 5 runs in 5.
 * They run only on the trade harness (tests/harness/trade/harness.mjs: the production relay behind
 * a 150-400 ms latency proxy, the local app behind a 40-90 ms one), and each step logs the server's
 * stored slate, the relay's room, both screens, a fresh joiner, and a fresh joiner kept off the relay
 * (what the stored slate alone draws).
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
test.skip(!harnessOn, 'Needs the trade harness (SLATEBOX_TRADE_HARNESS=1): the production relay behind a latency proxy.')
test.setTimeout(420_000)

const board: Workshop = {
  version: 1, title: 'Trade reload check',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next', capacity: 1 }, { id: 'later', label: 'Later' }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'gamma', label: 'Gamma', laneId: 'now' }, { id: 'delta', label: 'Delta', laneId: 'now' },
    { id: 'beta', label: 'Beta', laneId: 'next' },
  ],
}
const WORDS = 'Delta'

async function ready(page: Page) { await dismissWelcome(page); await workshopReady(page); await page.waitForTimeout(1500) }
async function carry(page: Page, id: string, to: { x: number; y: number }) {
  const from = await resting(page, id)
  // Grab the part of the note that is on screen: a note let go left of the board sits partly off it.
  const left = Math.max(from.x, 4), right = Math.min(from.x + from.width, page.viewportSize()!.width - 4)
  expect(right - left, id + ' is on screen to be grabbed').toBeGreaterThan(8)
  await page.mouse.move((left + right) / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
  letGo()
  await page.mouse.up()
}
const laneSpot = async (page: Page, laneId: string) => { const c = await resting(page, 'column-' + laneId); return { x: c.x + c.width / 2, y: c.y + c.height - 24 } }
const offBoard = async (page: Page, dy = 200) => { const c = await resting(page, 'column-now'); return { x: c.x - 160, y: c.y + dy } }
/** The Delta note on this page (the first, if a page wrongly shows two). */
const noteIdOn = (page: Page) => page.evaluate(w => (window as any).slate.v2.freeNodes().find((n: any) => n.options.text === w)?.id as string | undefined, WORDS)
const cardIdOn = (page: Page) => page.evaluate(w => [...document.querySelectorAll('#slateCanvas [data-node-id^="card-"]')]
  .find(el => (el.getAttribute('aria-label') ?? '').startsWith(w + ', in '))?.getAttribute('data-node-id') ?? undefined, WORDS)

interface Two { browser: Browser; a: Page; b: Page; key: string; link: URL }

/** Socket traces of every page that makes trades, logged and cleared at each record. */
const traces: ReturnType<typeof traceSockets>[] = []
const traceOf = new Map<Page, ReturnType<typeof traceSockets>>()
const traced = (page: Page, who: string) => { const t = traceSockets(page, who); traces.push(t); traceOf.set(page, t); return page }
/** The moment a trade is let go: the traces count from here. */
const letGo = () => { for (const t of traces) t.mark() }

async function setUp(browser: Browser): Promise<Two> {
  const ctxA = await browser.newContext({ viewport: { width: 1360, height: 900 } })
  traces.length = 0
  const a = traced(await ctxA.newPage(), 'A')
  await a.goto(new URL('/new/workshop' + encodeWorkshopFragment(board), origin).href)
  await a.waitForURL(/\/canvas\/[a-f0-9]{10}$/, { timeout: 60_000 })
  await expect.poll(() => userId(a), { timeout: 30_000 }).toBeTruthy()
  await ready(a)
  const link = await shareAs(a, 'edit')
  const ctxB = await browser.newContext({ viewport: { width: 1360, height: 900 } })
  const b = await ctxB.newPage()
  await b.goto(link.href)
  await dismissWelcome(b)
  await workshopReady(b)
  await workshopStatus(b).getByRole('button', { name: 'Join to edit', exact: true }).click()
  await expect.poll(() => userId(b), { timeout: 30_000 }).toBeTruthy()
  await b.waitForTimeout(1000)
  return { browser, a, b, key: slateKey(a), link }
}

async function look(browser: Browser, link: URL, relay: boolean) {
  const context = await freshContext(browser, relay)
  try {
    const page = await context.newPage()
    await page.goto(link.href)
    await ready(page)
    await page.waitForTimeout(500)
    return await drawnWords(page, WORDS)
  } finally { await context.close() }
}

const ids = (notes: string[]) => notes.map(n => n.split('@')[0]).sort()

/**
 * Wait for things to settle, then record the server, the room, A, B, a fresh joiner, and a fresh
 * joiner kept off the relay. Softly expects: exactly one Delta on the server, and every screen
 * drawing what the server holds (the same notes by id, the same number of cards), with no id twice.
 */
async function record(t: Two, stage: string, aPage: Page = t.a) {
  await t.b.waitForTimeout(5000)
  const server = await storedWords(aPage, t.key, WORDS)
  const A = await drawnWords(aPage, WORDS), B = await drawnWords(t.b, WORDS)
  const fresh = await look(t.browser, t.link, true)
  const storedOnly = await look(t.browser, t.link, false)
  const room = await roomOf(server.slateId)
  const tracked = new Set(['delta', 'card-delta', ...server.notes, ...ids(A.notes), ...ids(B.notes), ...ids(fresh.notes)])
  const roomDelta = room.filter(e => e.id && tracked.has(e.id)).map(e => e.type + ':' + e.id + '@' + e.t)
  const sockets = traces.flatMap(t => t.events).sort((x, y) => parseInt(x) - parseInt(y))
  const row = { stage, sockets, server: { notes: server.notes, cards: server.cards, baseline: server.baseline }, room: { size: room.length, delta: roomDelta }, A, B, fresh, storedOnly }
  console.log('TRADE ' + JSON.stringify(row))
  const want = { notes: [...server.notes].sort(), cards: server.cards.length }
  expect.soft(server.notes.length + server.cards.length, stage + ': the server holds Delta exactly once').toBe(1)
  for (const [who, v] of [['A', A], ['B', B], ['fresh joiner', fresh]] as const) {
    expect.soft({ notes: ids(v.notes), cards: v.cards.length }, stage + ': ' + who + ' draws what the server holds').toEqual(want)
    expect.soft(v.dupIds, stage + ': ' + who + ' draws no id twice').toEqual([])
  }
  return row
}

async function reopen(page: Page) { await page.reload(); await ready(page) }
async function tab(t: Two, slow: boolean) {
  const page = traced(await t.a.context().newPage(), slow ? 'slowTab' : 'tab')
  await page.goto(t.a.url())
  await ready(page)
  if (slow) await throttle(page)
  return page
}

/**
 * When the page that made a trade goes away (reloaded or closed):
 * - 'sent': the moment its creativeSlates.play call leaves, with the harness holding back what the
 *   server sends on the open sockets, so the server takes the trade but its answer never reaches
 *   the page (the window staging hit 5 times in 5, where the answer took longer than the reload);
 * - a number: that many ms after the drop (natural timing; whether the window is hit depends on
 *   the round trip, and the socket trace in the log says which it was).
 */
type When = 'sent' | number
async function trade(page: Page, id: string, to: () => Promise<{ x: number; y: number }>, when: When) {
  const sent = traceOf.get(page)!.sent('creativeSlates.play')
  await carry(page, id, await to())
  if (when === 'sent') {
    await Promise.race([sent, page.waitForTimeout(10_000).then(() => { throw new Error('the trade\'s save never left ' + id) })])
    // The server takes it; its answer is held back on the open sockets until the page has gone.
    const { held } = await harness('/hold?which=app&ms=4000')
    expect(held, 'sockets held').toBeGreaterThan(0)
  } else if (when) await page.waitForTimeout(when)
}
const label = (when: When) => (when === 'sent' ? 'the moment its save leaves' : when ? when + ' ms later' : 'at once')
const toCanvas = (page: Page) => () => offBoard(page)
const toLater = (page: Page) => () => laneSpot(page, 'later')

/** Delta as a note on the canvas, settled everywhere: its arrival is in the room and stored. */
async function deltaAsNote(t: Two) {
  await carry(t.a, 'card-delta', await offBoard(t.a))
  await t.a.waitForTimeout(4000)
  const row = await record(t, 'settled: Delta is a note')
  expect(row.server.notes).toEqual(['delta'])
}

test('card → note, reload 200 ms later on a slate whose room never had Delta: everyone agrees (guard; staging passed it)', async ({ browser }) => {
  const t = await setUp(browser)
  await trade(t.a, 'card-delta', toCanvas(t.a), 200)
  await reopen(t.a)
  await record(t, 'card->note, reload 200 ms later')
})

for (const when of ['sent', 0, 200] as When[]) {
  test(`note → card, reload ${label(when)}: the old note is gone for everyone`, async ({ browser }) => {
    const t = await setUp(browser)
    await deltaAsNote(t)
    await trade(t.a, 'delta', toLater(t.a), when)
    await reopen(t.a)
    await record(t, `note->card, reload ${label(when)}`)
    await reopen(t.b)
    await record(t, `note->card, reload ${label(when)}; then B reloads`)
  })
}

test('card → note after a round trip (the room holds the note\'s removal), tab closed the moment its save leaves: the note stays for everyone', async ({ browser }) => {
  const t = await setUp(browser)
  await deltaAsNote(t)
  await carry(t.a, 'delta', await laneSpot(t.a, 'later'))
  await t.a.waitForTimeout(4000)
  await record(t, 'settled: Delta is a card again')
  const page = await tab(t, false)
  await trade(page, 'card-delta', toCanvas(page), 'sent')
  await page.close()
  await reopen(t.a)
  await record(t, 'card->note, tab closed the moment its save leaves')
})

test('note → card in a tab closed the moment its save leaves, then card → note in a new tab closed 200 ms later: one Delta, no new id', async ({ browser }) => {
  const t = await setUp(browser)
  await deltaAsNote(t)
  let page = await tab(t, false)
  await trade(page, 'delta', toLater(page), 'sent')
  await page.close()
  await reopen(t.a)
  await record(t, 'note->card, tab closed the moment its save leaves')
  page = await tab(t, false)
  const cid = await cardIdOn(page)
  expect(cid, 'the new tab draws the Delta card').toBeTruthy()
  await trade(page, cid!, toCanvas(page), 200)
  await page.close()
  await reopen(t.a)
  await record(t, 'card->note, tab closed 200 ms later')
})

test('slow network (DevTools throttling): card → note, tab closed 200 ms later, then note → card closed 100 ms later', async ({ browser }) => {
  const t = await setUp(browser)
  await deltaAsNote(t)
  await carry(t.a, 'delta', await laneSpot(t.a, 'later'))
  await t.a.waitForTimeout(4000)
  let page = await tab(t, true)
  await trade(page, 'card-delta', toCanvas(page), 200)
  await page.close()
  await reopen(t.a)
  await record(t, 'slow: card->note, tab closed 200 ms later')
  const nid = await noteIdOn(t.a)
  if (nid) {
    page = await tab(t, true)
    await trade(page, nid, toLater(page), 100)
    await page.close()
    await reopen(t.a)
    await record(t, 'slow: note->card, tab closed 100 ms later')
  }
})

test('the staging sequence (check 3r): reload, tab close, then both again on a slow network', async ({ browser }) => {
  const t = await setUp(browser)
  await carry(t.a, 'card-delta', await offBoard(t.a)); await t.a.waitForTimeout(200); await reopen(t.a)
  await record(t, 'a-reload card->note')
  let nid = await noteIdOn(t.a)
  if (nid) { await carry(t.a, nid, await laneSpot(t.a, 'later')); await reopen(t.a) }
  await record(t, 'b-reload note->card')
  for (const slow of [false, true]) {
    const p = slow ? 'slow-' : ''
    await reopen(t.a)
    let cid = await cardIdOn(t.a)
    if (!cid) { nid = await noteIdOn(t.a); if (nid) { await carry(t.a, nid, await laneSpot(t.a, 'later')); await t.a.waitForTimeout(3000); cid = await cardIdOn(t.a) } }
    if (cid) { const page = await tab(t, slow); await carry(page, cid, await offBoard(page)); await page.waitForTimeout(200); await page.close() }
    await reopen(t.a); await record(t, p + 'tabclose card->note')
    nid = await noteIdOn(t.a)
    if (nid) { const page = await tab(t, slow); await carry(page, nid, await laneSpot(page, 'later')); await page.waitForTimeout(slow ? 100 : 0); await page.close() }
    await reopen(t.a); await record(t, p + 'tabclose note->card')
  }
})

test('a relay restart loses the room: the stored slate alone still draws the last trade (guard)', async ({ browser }) => {
  const t = await setUp(browser)
  await deltaAsNote(t)
  await carry(t.a, 'delta', await laneSpot(t.a, 'later'))
  await t.a.waitForTimeout(4000)
  await harness('/relay/restart')
  await reopen(t.a); await reopen(t.b)
  await record(t, 'after a relay restart')
})
