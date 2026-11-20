import { expect, test, type Browser, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, userId } from './workshop-guests.shared'
import { resting, slateKey, workshopReady, workshopStatus } from './app-native-workshop.shared'
import { drawnWords, freshContext, harness, harnessOn, hasRoom, roomOf, storedWords, traceSockets } from './app-trade-harness.shared'

/**
 * trade-attack (2026-11-20): hostile cases for "a trade is server-authoritative". Same record as
 * app-trade-reload.spec.ts (server once, every screen draws what it holds, no id twice), plus:
 * - every screen draws each note where the server stores it (positions agree within 2 px), and
 *   cards in the same lanes;
 * - more items than Delta (Gamma) where a case touches them.
 * Optional: SLATEBOX_OLD_APP_URL, the previous release (app 0d21a5c7 + engine dd8d585) serving the
 * same Mongo and relay (a rolling deploy).
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const oldOrigin = process.env.SLATEBOX_OLD_APP_URL ? new URL(process.env.SLATEBOX_OLD_APP_URL) : null
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
test.skip(!harnessOn, 'Needs the trade harness (SLATEBOX_TRADE_HARNESS=1).')
test.setTimeout(1_200_000)

const board: Workshop = {
  version: 1, title: 'Trade attack check',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next', capacity: 1 }, { id: 'later', label: 'Later' }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'gamma', label: 'Gamma', laneId: 'now' }, { id: 'delta', label: 'Delta', laneId: 'now' },
    { id: 'beta', label: 'Beta', laneId: 'next' },
  ],
}

async function ready(page: Page) { await dismissWelcome(page); await workshopReady(page); await page.waitForTimeout(1500) }
const traces: ReturnType<typeof traceSockets>[] = []
const letGo = () => { for (const t of traces) t.mark() }
async function carry(page: Page, id: string, to: { x: number; y: number }, steps = 12) {
  const from = await resting(page, id)
  const left = Math.max(from.x, 4), right = Math.min(from.x + from.width, page.viewportSize()!.width - 4)
  expect(right - left, id + ' is on screen to be grabbed').toBeGreaterThan(8)
  await page.mouse.move((left + right) / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps })
  letGo()
  await page.mouse.up()
}
/** A quick carry that does not wait for the note to rest (for edits right after a trade). */
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
const cardIdOn = (page: Page, w: string) => page.evaluate(w => [...document.querySelectorAll('#slateCanvas [data-node-id^="card-"]')]
  .find(el => (el.getAttribute('aria-label') ?? '').startsWith(w + ', in '))?.getAttribute('data-node-id') ?? undefined, w)

/** shareAs (workshop-guests.shared) without its check that the link is on SLATEBOX_APP_URL: the old release's link is on its own origin. */
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

async function setUp(browser: Browser, at: URL = origin): Promise<Two> {
  traces.length = 0
  const ctxA = await browser.newContext({ viewport: { width: 1360, height: 900 } })
  const a = await ctxA.newPage(); traces.push(traceSockets(a, 'A'))
  await a.goto(new URL('/new/workshop' + encodeWorkshopFragment(board), at).href)
  await a.waitForURL(/\/canvas\/[a-f0-9]{10}$/, { timeout: 60_000 })
  await expect.poll(() => userId(a), { timeout: 30_000 }).toBeTruthy()
  await ready(a)
  const link = await shareAs(a, 'edit')
  const b = await join(browser, link)
  return { browser, a, b, key: slateKey(a), link }
}
async function join(browser: Browser, link: URL, at: URL = origin) {
  const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } })
  const b = await ctx.newPage(); traces.push(traceSockets(b, 'B'))
  await b.goto(new URL(link.pathname + link.search + link.hash, at).href)
  await dismissWelcome(b)
  await workshopReady(b)
  await workshopStatus(b).getByRole('button', { name: 'Join to edit', exact: true }).click()
  await expect.poll(() => userId(b), { timeout: 30_000 }).toBeTruthy()
  await b.waitForTimeout(1000)
  return b
}

async function look(browser: Browser, link: URL, relay: boolean, words: string[]) {
  const context = await freshContext(browser, relay)
  try {
    const page = await context.newPage()
    await page.goto(link.href)
    await ready(page)
    if (relay) await hasRoom(page) // trade-close: a fresh joiner is read once it has the room
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

/** Where the server stores each note with these words: id@x,y (as drawnWords). */
async function storedAt(page: Page, key: string, w: string) {
  const slate = await getSlate(page, key)
  return (slate.nodes ?? []).filter((n: any) => n.options?.text === w).map((n: any) => n.options.id + '@' + Math.round(n.options.xPos ?? n.options.x) + ',' + Math.round(n.options.yPos ?? n.options.y))
}

const problems: string[] = []
/**
 * Settle, then record every view of every word. Soft-expects for each word: the server holds it
 * once (`once`), every screen draws the notes the server holds (by id) and as many cards, no id
 * twice; and the positions and lanes of every screen agree with the fresh joiner's.
 */
async function record(t: Two, stage: string, opts: { words?: string[]; pages?: Page[]; once?: boolean } = {}) {
  const words = opts.words ?? ['Delta']
  const pages = opts.pages ?? [t.a, t.b]
  await t.b.waitForTimeout(5000)
  const live = pages.filter(p => !p.isClosed())
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
  console.log('ATTACK ' + JSON.stringify(row))
  const before = test.info().errors.length
  for (const w of words) {
    const s = server[w]
    if (opts.once !== false) expect.soft(s.notes.length + s.cards.length, `${stage} [${w}]: the server holds it exactly once`).toBe(1)
    const want = { notes: [...s.notes].sort(), cards: s.cards.length }
    const views: [string, any][] = [...screens.map((v, i) => ['screen ' + i, v[w]] as [string, any]), ['fresh joiner', fresh[w]]]
    for (const [who, v] of views) {
      expect.soft({ notes: ids(v.notes), cards: v.cards.length }, `${stage} [${w}]: ${who} draws what the server holds`).toEqual(want)
      expect.soft(v.dupIds, `${stage} [${w}]: ${who} draws no id twice`).toEqual([])
    }
    // Positions: every screen draws each note where the server stores it, cards in the same lanes.
    for (const [who, v] of views) {
      expect.soft(near(v.notes, s.at), `${stage} [${w}]: ${who} draws the notes where the server stores them (${v.notes} vs ${s.at})`).toBe(true)
      expect.soft(lanes(v.cards), `${stage} [${w}]: ${who} draws the cards in the fresh joiner's lanes`).toEqual(lanes(fresh[w].cards))
    }
  }
  if (test.info().errors.length > before) problems.push(stage)
  return row
}

async function reopen(page: Page) { await page.reload(); await ready(page) }
async function tab(t: Two) {
  const page = await t.a.context().newPage(); traces.push(traceSockets(page, 'tab'))
  await page.goto(t.a.url())
  await ready(page)
  return page
}
async function asNote(t: Two, w = 'Delta', id = 'delta', dy = 200) {
  await carry(t.a, 'card-' + id, await offBoard(t.a, dy))
  await t.a.waitForTimeout(4000)
  expect((await storedWords(t.a, t.key, w)).notes).toEqual([id])
}
async function undo(page: Page) { await page.keyboard.press('ControlOrMeta+z') }
async function redo(page: Page) { await page.keyboard.press('ControlOrMeta+Shift+z') }
async function blankClick(page: Page) { await page.mouse.click(5, 300) }

test.afterAll(() => { console.log('ATTACK-PROBLEMS ' + JSON.stringify(problems)) })

// ─── 1. Undo of one's own trade, then the page goes away 0-200 ms later ──────────────────────────
for (const how of ['reload', 'close'] as const) {
  test(`undo of a trade, page ${how === 'reload' ? 'reloaded' : 'closed'} 0/60/150 ms after the undo, both directions`, async ({ browser }) => {
    const t = await setUp(browser)
    for (const ms of [0, 60, 150]) {
      for (const dir of ['card->note', 'note->card'] as const) {
        // Make the trade on a page that will undo it, settle, then undo and leave.
        const page = how === 'reload' ? t.a : await tab(t)
        const stored = await storedWords(t.a, t.key, 'Delta')
        const isNote = stored.notes.length > 0
        if ((dir === 'card->note') === isNote) {
          // Put Delta in the state this direction starts from.
          if (isNote) await carry(page, stored.notes[0], await laneSpot(page, 'later'))
          else await carry(page, (await cardIdOn(page, 'Delta'))!, await offBoard(page))
          await page.waitForTimeout(4000)
        }
        if (dir === 'card->note') await carry(page, (await cardIdOn(page, 'Delta'))!, await offBoard(page))
        else await carry(page, (await noteIdOn(page, 'Delta'))!, await laneSpot(page, 'later'))
        await page.waitForTimeout(3000)
        await blankClick(page)
        await undo(page)
        if (ms) await page.waitForTimeout(ms)
        if (how === 'reload') await reopen(page); else { await page.close(); await t.a.waitForTimeout(300) }
        if (how === 'reload') { /* A reloaded */ } else await reopen(t.a)
        await record(t, `undo ${dir}, ${how} ${ms} ms after the undo`)
      }
    }
  })
}

// ─── 2. B undoes an unrelated step of B's own right as A trades ───────────────────────────────────
test('B undoes an ordinary step of its own 0/150/400/900 ms after A trades Delta (both directions)', async ({ browser }) => {
  const t = await setUp(browser)
  await asNote(t, 'Gamma', 'gamma', 380)
  await asNote(t, 'Delta', 'delta', 200)
  await reopen(t.b)
  for (const ms of [0, 150, 400, 900]) {
    for (const dir of ['note->card', 'card->note'] as const) {
      // B's own step: move the Gamma note a little.
      const g = (await noteIdOn(t.b, 'Gamma'))!
      await quickCarry(t.b, g, 30, 18)
      await t.b.waitForTimeout(3500)
      if (dir === 'note->card') await carry(t.a, (await noteIdOn(t.a, 'Delta'))!, await laneSpot(t.a, 'later'))
      else await carry(t.a, (await cardIdOn(t.a, 'Delta'))!, await offBoard(t.a))
      if (ms) await t.b.waitForTimeout(ms)
      await blankClick(t.b)
      await undo(t.b)
      await record(t, `B undoes 1 step ${ms} ms after A's ${dir}`, { words: ['Delta', 'Gamma'] })
    }
  }
})

// ─── 3. A trade, then an ordinary edit of the traded note within 50 ms, then leave ────────────────
test('card → note, then the new note moved within 50 ms, then the page reloaded 0/300/1000 ms later', async ({ browser }) => {
  const t = await setUp(browser)
  for (const ms of [0, 300, 1000]) {
    // From a card each time.
    const n = await noteIdOn(t.a, 'Delta')
    if (n) { await carry(t.a, n, await laneSpot(t.a, 'later')); await t.a.waitForTimeout(4000) }
    await carry(t.a, (await cardIdOn(t.a, 'Delta'))!, await offBoard(t.a))
    await t.a.waitForTimeout(30)
    await quickCarry(t.a, 'delta', 0, 90)
    if (ms) await t.a.waitForTimeout(ms)
    await reopen(t.a)
    await record(t, `card->note, moved within 50 ms, reload ${ms} ms later`)
  }
})

test('note → card, then another note moved within 50 ms, tab closed 0/300 ms later', async ({ browser }) => {
  const t = await setUp(browser)
  await asNote(t, 'Gamma', 'gamma', 380)
  for (const ms of [0, 300]) {
    if (!(await noteIdOn(t.a, 'Delta'))) { await carry(t.a, (await cardIdOn(t.a, 'Delta'))!, await offBoard(t.a)); await t.a.waitForTimeout(4000) }
    const page = await tab(t)
    await carry(page, (await noteIdOn(page, 'Delta'))!, await laneSpot(page, 'later'))
    await page.waitForTimeout(30)
    await quickCarry(page, (await noteIdOn(page, 'Gamma'))!, 40, 0)
    if (ms) await page.waitForTimeout(ms)
    await page.close()
    await reopen(t.a)
    await record(t, `note->card + Gamma moved within 50 ms, tab closed ${ms} ms later`, { words: ['Delta', 'Gamma'] })
  }
})

// ─── 4. Two trades of the same item back to back, then leave ──────────────────────────────────────
test('card → note → card within ~300 ms, then tab closed 0/500 ms later', async ({ browser }) => {
  const t = await setUp(browser)
  for (const ms of [0, 500]) {
    const page = await tab(t)
    await carry(page, (await cardIdOn(page, 'Delta'))!, await offBoard(page), 4)
    await page.waitForTimeout(60)
    const from = await page.locator('#slateCanvas [data-node-id="delta"]').first().boundingBox()
    const to = await laneSpot(page, 'later')
    await page.mouse.move(from!.x + 20, from!.y + from!.height / 2); await page.mouse.down(); await page.mouse.move(to.x, to.y, { steps: 4 }); await page.mouse.up()
    if (ms) await page.waitForTimeout(ms)
    await page.close()
    await reopen(t.a)
    await record(t, `card->note->card back to back, tab closed ${ms} ms later`)
  }
})

// ─── 5. The trading page loses its network right after the trade ─────────────────────────────────
for (const after of ['online', 'closed'] as const) {
  test(`network drop 0/100/300 ms after a trade, then ${after === 'online' ? 'back online after 4 s' : 'closed while offline'}`, async ({ browser }) => {
    const t = await setUp(browser)
    for (const ms of [0, 100, 300]) {
      for (const dir of ['card->note', 'note->card'] as const) {
        void dir
        const page = await tab(t)
        const cdp = await page.context().newCDPSession(page)
        await cdp.send('Network.enable')
        const isNote = !!(await noteIdOn(page, 'Delta'))
        const realDir = isNote ? 'note->card' : 'card->note'
        if (isNote) await carry(page, (await noteIdOn(page, 'Delta'))!, await laneSpot(page, 'later'))
        else await carry(page, (await cardIdOn(page, 'Delta'))!, await offBoard(page))
        if (ms) await page.waitForTimeout(ms)
        await cdp.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
        await page.waitForTimeout(4000)
        if (after === 'online') { await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 }); await page.waitForTimeout(6000) }
        await page.close()
        await reopen(t.a)
        await record(t, `${realDir}, network dropped ${ms} ms after, then ${after}`)
      }
    }
  })
}

// ─── 6. B moves the note during the window after A's trade, A's tab gone early ───────────────────
test('card → note in a tab closed before its answer; B moves the new note as soon as it sees it', async ({ browser }) => {
  const t = await setUp(browser)
  for (const round of [1, 2]) {
    if (await noteIdOn(t.a, 'Delta')) { await carry(t.a, (await noteIdOn(t.a, 'Delta'))!, await laneSpot(t.a, 'later')); await t.a.waitForTimeout(4000) }
    const page = await tab(t)
    await carry(page, (await cardIdOn(page, 'Delta'))!, await offBoard(page))
    await page.waitForTimeout(60)
    await harness('/hold?which=app&ms=4000')
    await page.waitForTimeout(200)
    await page.close()
    await expect.poll(() => noteIdOn(t.b, 'Delta'), { timeout: 10_000, intervals: [50] }).toBeTruthy()
    await quickCarry(t.b, 'delta', 0, 120)
    await record(t, `card->note, tab closed before its answer, B moves it at once (round ${round})`)
  }
})

// ─── 7. Relay restarts 0/150/500 ms after a trade, the trader stays, then reloads ────────────────
test('relay restart 0/150/500 ms after a trade, trader stays open, then everyone reloads', async ({ browser }) => {
  const t = await setUp(browser)
  for (const ms of [0, 150, 500]) {
    for (const dir of ['card->note', 'note->card'] as const) {
      const isNote = !!(await noteIdOn(t.a, 'Delta'))
      if (isNote) await carry(t.a, (await noteIdOn(t.a, 'Delta'))!, await laneSpot(t.a, 'later'))
      else await carry(t.a, (await cardIdOn(t.a, 'Delta'))!, await offBoard(t.a))
      if (ms) await t.a.waitForTimeout(ms)
      await harness('/relay/restart')
      await record(t, `${isNote ? 'note->card' : 'card->note'}, relay restarted ${ms} ms after (live)`)
      void dir
    }
  }
  await reopen(t.a); await reopen(t.b)
  await record(t, 'relay restarts: after both reload')
})

// ─── 8. Two people at once ────────────────────────────────────────────────────────────────────────
test('two people: A and B take the same Delta card off at once and both reload at once; then both drop the note on lanes and both close/reload', async ({ browser }) => {
  const t = await setUp(browser)
  for (const round of [1, 2, 3]) {
    if (await noteIdOn(t.a, 'Delta')) { await carry(t.a, (await noteIdOn(t.a, 'Delta'))!, await laneSpot(t.a, 'later')); await t.a.waitForTimeout(4000) }
    const [aTo, bTo] = [await offBoard(t.a, 260), await offBoard(t.b, 120)]
    await Promise.all([carry(t.a, 'card-delta', aTo), carry(t.b, 'card-delta', bTo)])
    await Promise.all([reopen(t.a), reopen(t.b)])
    await record(t, `round ${round}: same card off by both, both reload at once`)
    const [aL, bL] = [await laneSpot(t.a, 'later'), await laneSpot(t.b, 'now')]
    const [an, bn] = [await noteIdOn(t.a, 'Delta'), await noteIdOn(t.b, 'Delta')]
    if (an && bn) {
      await Promise.all([carry(t.a, an, aL), carry(t.b, bn, bL)])
      await t.b.waitForTimeout(round * 100)
      await Promise.all([reopen(t.a), reopen(t.b)])
      await record(t, `round ${round}: same note to two lanes by both, both reload ${round * 100} ms later`)
    }
  }
})

test('two people: A trades Delta while B trades Gamma, both pages leave the moment their saves leave', async ({ browser }) => {
  const t = await setUp(browser)
  await asNote(t, 'Gamma', 'gamma', 380)
  for (const round of [1, 2]) {
    const pa = await tab(t)
    const pb = await t.b.context().newPage(); traces.push(traceSockets(pb, 'tabB')); await pb.goto(t.b.url()); await ready(pb)
    const dId = await noteIdOn(pa, 'Delta'), gId = await noteIdOn(pb, 'Gamma')
    await Promise.all([
      dId ? carry(pa, dId, await laneSpot(pa, 'later')) : carry(pa, (await cardIdOn(pa, 'Delta'))!, await offBoard(pa, 200)),
      gId ? carry(pb, gId, await laneSpot(pb, 'later')) : carry(pb, (await cardIdOn(pb, 'Gamma'))!, await offBoard(pb, 380)),
    ])
    await pa.waitForTimeout(60)
    await harness('/hold?which=app&ms=4000')
    await pa.waitForTimeout(200)
    await Promise.all([pa.close(), pb.close()])
    await record(t, `round ${round}: A trades Delta, B trades Gamma, both tabs closed before answers`, { words: ['Delta', 'Gamma'] })
  }
})

test('two people: A trades Delta, B undoes its own move of Delta right after (A\'s trade lands on B\'s undo)', async ({ browser }) => {
  const t = await setUp(browser)
  await asNote(t, 'Delta', 'delta', 200)
  await reopen(t.b)
  for (const ms of [0, 200, 600]) {
    if (!(await noteIdOn(t.b, 'Delta'))) { await carry(t.a, (await cardIdOn(t.a, 'Delta'))!, await offBoard(t.a)); await t.a.waitForTimeout(4000) }
    await quickCarry(t.b, 'delta', 25, 25)
    await t.b.waitForTimeout(3500)
    await carry(t.a, 'delta', await laneSpot(t.a, 'later'))
    if (ms) await t.a.waitForTimeout(ms)
    await blankClick(t.b); await undo(t.b)
    await record(t, `A note->card, B undoes its move of Delta ${ms} ms later`)
    await blankClick(t.b); await redo(t.b)
    await record(t, `... then B redoes`)
  }
})

// ─── 9. The previous release at the same time (rolling deploy: old app + old engine, same Mongo + relay)
test('previous release beside this one: A (new) note → card, O (old) card → note, A edits, everyone reloads', async ({ browser }) => {
  test.skip(!oldOrigin, 'SLATEBOX_OLD_APP_URL not set')
  const t = await setUp(browser)
  await asNote(t, 'Delta', 'delta', 200)
  const o = await join(browser, t.link, oldOrigin!)
  await o.waitForTimeout(1500)
  await carry(t.a, 'delta', await laneSpot(t.a, 'later'))
  await t.a.waitForTimeout(4000)
  await record(t, 'new A: note->card', { pages: [t.a, t.b, o] })
  await carry(o, (await cardIdOn(o, 'Delta'))!, await offBoard(o))
  await o.waitForTimeout(4000)
  await record(t, 'old O: card->note', { pages: [t.a, t.b, o] })
  // An ordinary edit by A: Gamma off the lanes, then a move of it.
  await carry(t.a, 'card-gamma', await offBoard(t.a, 380))
  await t.a.waitForTimeout(3000)
  await quickCarry(t.a, 'gamma', 30, 0)
  await t.a.waitForTimeout(3000)
  await record(t, 'new A edits Gamma after the old trade', { pages: [t.a, t.b, o], words: ['Delta', 'Gamma'] })
  await reopen(t.a); await reopen(t.b)
  await record(t, 'after A and B reload', { pages: [t.a, t.b, o], words: ['Delta', 'Gamma'] })
})

test('a slate made by the previous release, with a half trade from it, opened by this release', async ({ browser }) => {
  test.skip(!oldOrigin, 'SLATEBOX_OLD_APP_URL not set')
  // Made and traded on the old release: the staging half trade (note -> card, page reloaded before its answer).
  const t = await setUp(browser, oldOrigin!)
  await carry(t.a, 'card-delta', await offBoard(t.a))
  await t.a.waitForTimeout(4000)
  await carry(t.a, 'delta', await laneSpot(t.a, 'later'))
  await t.a.waitForTimeout(80)
  await harness('/hold?which=app&ms=4000') // no effect on the old app (no proxy); the reload is immediate
  await t.a.reload()
  await t.a.waitForTimeout(3000)
  const oldLink = t.link
  // Now everyone is on the new release.
  await t.a.context().close(); await t.b.context().close()
  traces.length = 0
  const link = new URL(oldLink.pathname + oldLink.search + oldLink.hash, origin)
  const a = await join(browser, link)
  const b = await join(browser, link)
  const t2: Two = { browser, a, b, key: t.key, link }
  await t2.a.waitForTimeout(1500)
  await record(t2, 'pre-release slate with an old half trade, opened by this release', { once: true })
  // A new trade on it.
  const n = await noteIdOn(b, 'Delta')
  if (n) await carry(b, n, await laneSpot(b, 'later')); else await carry(b, (await cardIdOn(b, 'Delta'))!, await offBoard(b))
  await b.waitForTimeout(250)
  await reopen(b)
  await record(t2, 'pre-release slate: a trade on this release, reload 250 ms later')
})

// ─── Rates of the two main findings, each on a fresh slate ───────────────────────────────────────
for (const n of [1, 2, 3]) {
  test(`rate ${n}: card → note, undo, tab closed at once; then B makes an ordinary edit (does the server keep Delta?)`, async ({ browser }) => {
    const t = await setUp(browser)
    await asNote(t, 'Gamma', 'gamma', 380)
    const page = await tab(t)
    await carry(page, 'card-delta', await offBoard(page))
    await page.waitForTimeout(3000)
    await blankClick(page)
    await undo(page)
    await page.close()
    await reopen(t.a)
    await record(t, `rate ${n}: undo card->note, tab closed at once`)
    await quickCarry(t.b, 'gamma', 30, 0)
    await t.b.waitForTimeout(3000)
    await reopen(t.a)
    const row = await record(t, `rate ${n}: ... then B moves Gamma`, { words: ['Delta', 'Gamma'] })
    console.log('RATE-UNDO ' + n + ' server Delta ' + JSON.stringify(row.server.Delta.notes) + ' ' + JSON.stringify(row.server.Delta.cards))
  })
  test(`rate ${n}: card → note, the new note moved within 50 ms, trader stays open`, async ({ browser }) => {
    const t = await setUp(browser)
    await carry(t.a, 'card-delta', await offBoard(t.a))
    await t.a.waitForTimeout(30)
    await quickCarry(t.a, 'delta', 0, 90)
    await record(t, `rate ${n}: card->note, moved within 50 ms, trader open`)
    await reopen(t.b)
    await record(t, `rate ${n}: ... after B reloads`)
  })
}

// Control for "B undoes … after A trades": the same timing with A's trade replaced by an ordinary
// move of the Delta note (no trade). Divergence here too means the fault predates trades.
test('control: B undoes an ordinary step of its own 0/150/400/900 ms after A moves the Delta note (no trade)', async ({ browser }) => {
  const t = await setUp(browser)
  await asNote(t, 'Gamma', 'gamma', 380)
  await asNote(t, 'Delta', 'delta', 200)
  await reopen(t.b)
  for (const ms of [0, 150, 400, 900, 0, 150, 400, 900]) {
    const g = (await noteIdOn(t.b, 'Gamma'))!
    await quickCarry(t.b, g, 30, 18)
    await t.b.waitForTimeout(3500)
    await quickCarry(t.a, 'delta', 20, ms % 2 ? 10 : -10)
    if (ms) await t.b.waitForTimeout(ms)
    await blankClick(t.b)
    await undo(t.b)
    await record(t, `control: B undoes 1 step ${ms} ms after A moves Delta`, { words: ['Delta', 'Gamma'] })
  }
})
