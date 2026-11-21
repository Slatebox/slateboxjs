import { expect, test, type Browser, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, userId } from './workshop-guests.shared'
import { resting, slateKey, workshopReady, workshopStatus } from './app-native-workshop.shared'
import { drawnWords, freshContext, harness, harnessOn, hasRoom, roomOf, storedWords, traceSockets } from './app-trade-harness.shared'

/**
 * staging-2 (2026-11-20), on the trade harness:
 *
 * F4 phantom: B moves Gamma; A drops the Delta note on a lane (note -> card); B presses Ctrl+Z at
 * the same instant. On staging, 2 of 5 runs at 0 ms left every screen and every fresh joiner with
 * Delta twice (the card and a note `delta`), the server holding only the card; it survived reloads,
 * and A's next card -> note got a new id. Here: the same steps, B's undo 0-50 ms after A lets go.
 * Each step is recorded as app-trade-attack.spec.ts records it (server once, every view draws what
 * the server holds, at its position, no id twice). Then any Delta note B draws is edited (moved):
 * the server must still hold Delta once, as the card. Then A takes the card off: the note must get
 * the card's own id.
 *
 * Race: A and B take the same card off at once and both reload. On staging 1 of 5 runs drew the
 * note at B's drop everywhere while the server stored A's.
 *
 * Latency: staging's relay answers in tens of milliseconds and a trade's method takes longer, so
 * B's undo can reach A before A's answer. These cases set the harness to that: relay 15-40 ms,
 * app 120-200 ms each way (the defaults are put back after each test).
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
test.skip(!harnessOn, 'Needs the trade harness (SLATEBOX_TRADE_HARNESS=1).')
test.setTimeout(600_000)

const board: Workshop = {
  version: 1, title: 'Trade phantom check',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next', capacity: 1 }, { id: 'later', label: 'Later' }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'gamma', label: 'Gamma', laneId: 'now' }, { id: 'delta', label: 'Delta', laneId: 'now' },
    { id: 'beta', label: 'Beta', laneId: 'next' },
  ],
}

async function ready(page: Page) { await dismissWelcome(page); await workshopReady(page); await page.waitForTimeout(1500) }
const traces: ReturnType<typeof traceSockets>[] = []
const letGo = () => { for (const t of traces) t.mark() }
/** Carry `id` to `to` and hold it there, not yet let go. */
async function carryHeld(page: Page, id: string, to: { x: number; y: number }, steps = 12) {
  const from = await resting(page, id)
  const left = Math.max(from.x, 4), right = Math.min(from.x + from.width, page.viewportSize()!.width - 4)
  expect(right - left, id + ' is on screen to be grabbed').toBeGreaterThan(8)
  await page.mouse.move((left + right) / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps })
}
async function carry(page: Page, id: string, to: { x: number; y: number }, steps = 12) {
  await carryHeld(page, id, to, steps)
  letGo()
  await page.mouse.up()
}
async function quickCarry(page: Page, id: string, dx: number, dy: number) {
  const box = await page.locator(`#slateCanvas [data-node-id="${id}"]`).first().boundingBox()
  expect(box, id + ' drawn').toBeTruthy()
  const x = Math.max(box!.x, 4) + Math.min(box!.width, 40) / 2, y = box!.y + box!.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 4 })
  await page.mouse.up()
}
const laneSpot = async (page: Page, laneId: string) => { const c = await resting(page, 'column-' + laneId); return { x: c.x + c.width / 2, y: c.y + c.height - 24 } }
const offBoard = async (page: Page, dy = 200) => { const c = await resting(page, 'column-now'); return { x: c.x - 160, y: c.y + dy } }
const noteIdOn = (page: Page, w: string) => page.evaluate(w => (window as any).slate.v2.freeNodes().find((n: any) => n.options.text === w)?.id as string | undefined, w)

async function shareAs(page: Page, permission: 'read' | 'edit') {
  await page.getByRole('button', { name: 'Share', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Share this slate' })
  const unlisted = dialog.getByRole('button', { name: /^Unlisted/ })
  if (await unlisted.getAttribute('aria-expanded') !== 'true') await unlisted.click()
  const region = dialog.getByRole('region', { name: /Unlisted/ })
  await region.getByRole('combobox', { name: 'Link permission' }).click()
  await page.getByRole('option', { name: permission, exact: true }).click()
  const commit = region.getByRole('button', { name: /^(Create link|Apply access)$/ })
  if (await commit.count()) await commit.click()
  const link = region.getByRole('textbox', { name: 'Invitation link' })
  await expect(link).toBeVisible()
  const url = new URL(await link.inputValue())
  await dialog.getByRole('button', { name: 'Done', exact: true }).click()
  return url
}

interface Two { browser: Browser; a: Page; b: Page; key: string; link: URL }

async function setUp(browser: Browser): Promise<Two> {
  traces.length = 0
  const ctxA = await browser.newContext({ viewport: { width: 1360, height: 900 } })
  const a = await ctxA.newPage(); traces.push(traceSockets(a, 'A'))
  await a.goto(new URL('/new/workshop' + encodeWorkshopFragment(board), origin).href)
  await a.waitForURL(/\/canvas\/[a-f0-9]{10}$/, { timeout: 60_000 })
  await expect.poll(() => userId(a), { timeout: 30_000 }).toBeTruthy()
  await ready(a)
  const link = await shareAs(a, 'edit')
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } })
  const b = await ctx.newPage(); traces.push(traceSockets(b, 'B'))
  await b.goto(new URL(link.pathname + link.search + link.hash, origin).href)
  await dismissWelcome(b)
  await workshopReady(b)
  await workshopStatus(b).getByRole('button', { name: 'Join to edit', exact: true }).click()
  await expect.poll(() => userId(b), { timeout: 30_000 }).toBeTruthy()
  await b.waitForTimeout(1000)
  return { browser, a, b, key: slateKey(a), link }
}

async function look(browser: Browser, link: URL, relay: boolean, words: string[]) {
  const context = await freshContext(browser, relay)
  try {
    const page = await context.newPage()
    await page.goto(link.href)
    await ready(page)
    if (relay) await hasRoom(page)
    await page.waitForTimeout(500)
    const out: Record<string, Awaited<ReturnType<typeof drawnWords>>> = {}
    for (const w of words) out[w] = await drawnWords(page, w)
    return out
  } finally { await context.close() }
}
const ids = (notes: string[]) => notes.map(n => n.split('@')[0]).sort()
const lanes = (cards: string[]) => cards.map(c => c.split('@')[1]).sort()
const near = (a: string[], b: string[]) => {
  const pa = a.map(n => n.split('@')).sort(), pb = b.map(n => n.split('@')).sort()
  if (pa.length !== pb.length) return false
  return pa.every(([id, xy], i) => {
    const [x, y] = xy.split(',').map(Number), [id2, xy2] = pb[i]; const [x2, y2] = xy2.split(',').map(Number)
    return id === id2 && Math.abs(x - x2) <= 2 && Math.abs(y - y2) <= 2
  })
}
async function storedAt(page: Page, key: string, w: string) {
  const slate = await getSlate(page, key)
  return (slate.nodes ?? []).filter((n: any) => n.options?.text === w).map((n: any) => n.options.id + '@' + Math.round(n.options.xPos ?? n.options.x) + ',' + Math.round(n.options.yPos ?? n.options.y))
}

/** Settle, then record every view (as app-trade-attack.spec.ts does), with soft expectations. */
async function record(t: Two, stage: string, words = ['Delta', 'Gamma']) {
  await t.b.waitForTimeout(5000)
  const live = [t.a, t.b].filter(p => !p.isClosed())
  const fresh = await look(t.browser, t.link, true, words)
  const storedOnly = await look(t.browser, t.link, false, words)
  const asker = live[0]
  const server: Record<string, any> = {}
  for (const w of words) server[w] = { ...(await storedWords(asker, t.key, w)), at: await storedAt(asker, t.key, w) }
  const room = await roomOf(server[words[0]].slateId)
  const screens: Record<string, any>[] = []
  for (const p of live) { const v: Record<string, any> = {}; for (const w of words) v[w] = await drawnWords(p, w); screens.push(v) }
  const trades = (await getSlate(asker, t.key)).creative?.trades ?? {}
  const sockets = traces.flatMap(t => t.events).sort((x, y) => parseInt(x) - parseInt(y))
  const row = { stage, sockets, trades: Object.fromEntries(Object.entries(trades).map(([k, v]: any) => [k, v.r + v.as])),
    room: room.filter(e => e.id || e.key.startsWith('trade:')).map(e => e.type + ':' + (e.id ?? e.key) + '@' + e.t), server, screens, fresh, storedOnly }
  console.log('PHANTOM ' + JSON.stringify(row))
  for (const w of words) {
    const s = server[w]
    expect.soft(s.notes.length + s.cards.length, `${stage} [${w}]: the server holds it exactly once`).toBe(1)
    const want = { notes: [...s.notes].sort(), cards: s.cards.length }
    const views: [string, any][] = [...screens.map((v, i) => [['A', 'B'][i], v[w]] as [string, any]), ['fresh joiner', fresh[w]]]
    for (const [who, v] of views) {
      expect.soft({ notes: ids(v.notes), cards: v.cards.length }, `${stage} [${w}]: ${who} draws what the server holds`).toEqual(want)
      expect.soft(v.dupIds, `${stage} [${w}]: ${who} draws no id twice`).toEqual([])
      expect.soft(near(v.notes, s.at), `${stage} [${w}]: ${who} draws the notes where the server stores them (${v.notes} vs ${s.at})`).toBe(true)
      expect.soft(lanes(v.cards), `${stage} [${w}]: ${who} draws the cards in the fresh joiner's lanes`).toEqual(lanes(fresh[w].cards))
    }
  }
  return row
}

async function reopen(page: Page) { await page.reload(); await ready(page) }
async function asNote(t: Two, w: string, id: string, dy: number) {
  await carry(t.a, 'card-' + id, await offBoard(t.a, dy))
  await t.a.waitForTimeout(4000)
  expect((await storedWords(t.a, t.key, w)).notes).toEqual([id])
}
async function blankClick(page: Page) { await page.mouse.click(5, 300) }

/** Staging's timing: the room is fast, the server's answer slower. */
async function stagingLatency() {
  await harness('/latency?which=relay&min=15&max=40')
  await harness('/latency?which=app&min=120&max=200')
}
async function defaultLatency() {
  await harness('/latency?which=relay&min=150&max=400')
  await harness('/latency?which=app&min=40&max=90')
}

// ─── F4: B's undo at the instant A's note -> card lands ───────────────────────────────────────────
const sweep = (process.env.SLATEBOX_PHANTOM_SWEEP ?? '0,0,0,0,0,10,20,30,40,50').split(',').map(Number)
sweep.forEach((ms, run) => {
  test(`F4 phantom: B undoes its Gamma move ${ms} ms after A drops the Delta note on a lane (run ${run + 1})`, async ({ browser }) => {
    const t = await setUp(browser)
    try {
      await asNote(t, 'Gamma', 'gamma', 380)
      await asNote(t, 'Delta', 'delta', 200)
      await reopen(t.b)
      await stagingLatency()
      const g = (await noteIdOn(t.b, 'Gamma'))!
      await quickCarry(t.b, g, 30, 18)
      await t.b.waitForTimeout(3000)
      // B's pointer is off the notes, ready; A carries Delta to Later and lets go; B undoes `ms` later.
      await blankClick(t.b)
      await carryHeld(t.a, 'delta', await laneSpot(t.a, 'later'))
      letGo()
      await Promise.all([
        t.a.mouse.up(),
        (async () => { if (ms) await t.b.waitForTimeout(ms); await t.b.keyboard.press('ControlOrMeta+z') })(),
      ])
      await record(t, `F4 ${ms} ms: B's undo, A's note->card`)

      // Editing a Delta note B draws (the phantom, if there is one) must not put a second Delta on the server.
      const phantom = await noteIdOn(t.b, 'Delta')
      if (phantom) {
        await quickCarry(t.b, phantom, 40, 30)
        await t.b.waitForTimeout(4000)
      }
      const stored = await storedWords(t.a, t.key, 'Delta')
      expect.soft({ notes: stored.notes, cards: stored.cards.length }, `F4 ${ms} ms: after B edits any Delta note it draws (${phantom ?? 'none'}), the server holds Delta once, as the card`).toEqual({ notes: [], cards: 1 })

      await reopen(t.a); await reopen(t.b)
      await record(t, `F4 ${ms} ms: ... after B's edit, A and B reload`)

      // A takes the card off: the note is the card's own id, everywhere.
      await carry(t.a, 'card-delta', await offBoard(t.a, 200))
      await t.a.waitForTimeout(4000)
      expect.soft((await storedWords(t.a, t.key, 'Delta')).notes, `F4 ${ms} ms: A's next card->note keeps the card's id`).toEqual(['delta'])
      await record(t, `F4 ${ms} ms: ... then A's card->note`)
    } finally { await defaultLatency() }
  })
})

// ─── Race: both take the same card off at once, both reload ──────────────────────────────────────
const raceRuns = Number(process.env.SLATEBOX_PHANTOM_RACE_RUNS ?? 5)
for (let run = 1; run <= raceRuns; run++) {
  test(`race: A and B take the same Delta card off at once, both reload (run ${run})`, async ({ browser }) => {
    const t = await setUp(browser)
    try {
      await stagingLatency()
      const [aTo, bTo] = [await offBoard(t.a, 260), await offBoard(t.b, 120)]
      await Promise.all([carryHeld(t.a, 'card-delta', aTo), carryHeld(t.b, 'card-delta', bTo)])
      letGo()
      await Promise.all([t.a.mouse.up(), t.b.mouse.up()])
      await Promise.all([reopen(t.a), reopen(t.b)])
      await record(t, `race ${run}: same card off by both, both reload`, ['Delta'])
    } finally { await defaultLatency() }
  })
}
