import { expect, test, type Browser, type Page } from '@playwright/test'
import { encodeWorkshopFragment, releasePlan, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { announced, conversation, messageBox, note, openConversation, resting, slateKey, starter, storedWorkshop, workshopReady, workshopStatus } from './app-native-workshop.shared'

/**
 * Boards S2b (owner addenda, 2026-11-22) in the real Meteor app with the local engine:
 * 1. Notes ALWAYS convert on boards, a map's own included: a note dropped on a station is a card there, free of the
 *    paths (the token stays the only piece they constrain); off the map it is the note again.
 * 2. A map's paths are fixed outside focus (no grips; a tap picks one and the bar offers "Change this board");
 *    editable in focus (a click removes one, a step's grip draws one, a path's end grip moves it) and in the chat
 *    ("connect Option B to Decide", "remove the path from Option A"): one undo per change, live on another page.
 * 3. A customer go-live in focus: its span's ends say what they are; "make this a 3-week plan", "start on 1 Dec"
 *    and "move go-live to 23 Dec" in the chat; one undo; finger-sized on a phone, and a pan never moves them.
 * SLATEBOX_SHOTS: keep a picture of each step there.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const decision: Workshop = { version: 1, title: 'Decision path', lanes: [
  { id: 'question', label: 'The question', station: { column: 0, row: 0, next: ['option-a', 'option-b'], outcome: 'Say what you are deciding.' } },
  { id: 'option-a', label: 'Option A', station: { column: 1, row: 0, next: ['decide'], outcome: 'Weigh the first option.' } },
  { id: 'option-b', label: 'Option B', station: { column: 1, row: 1, next: [], outcome: 'Weigh the second option.' } },
  { id: 'decide', label: 'Decide', station: { column: 2, row: 0, next: [], outcome: 'Write down what you chose and why.' } },
], cards: [{ id: 'token', label: 'Our choice', laneId: 'question' }] }

type Box = { x: number; y: number; width: number; height: number }
const centre = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
const shot = async (page: Page, name: string) => {
  if (!process.env.SLATEBOX_SHOTS) return
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${process.env.SLATEBOX_SHOTS}/${name}-${page.viewportSize()?.width}.png` })
}
const focusChip = (page: Page) => conversation(page).locator('[data-board-focus]')
const grips = (page: Page) => page.locator('#slateCanvas [data-node-id^="handle-_link-"], #slateCanvas [data-node-id^="handle-_route-"]')
const paths = async (page: Page) => (await storedWorkshop(page, slateKey(page))).lanes.flatMap((l: any) => l.station.next.map((n: string) => l.id + '>' + n)).join(' ')
const undo = (page: Page) => workshopStatus(page).getByRole('button', { name: 'Undo last change', exact: true }).click()

async function open(page: Page, path: string) {
  await page.goto(new URL(path, origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  await workshopReady(page)
  await page.waitForTimeout(3500) // past the page's own framing of a new board
  return (await userId(page))!
}
/** A point a third of the way along a map path's hit area, on screen. */
const onPath = (page: Page, key: string) => page.locator(`#slateCanvas [data-board-link="${key}"]`).evaluate(el => {
  const path = el as SVGPathElement
  const at = path.getPointAtLength(path.getTotalLength() / 3)
  const p = new DOMPoint(at.x, at.y).matrixTransform(path.getScreenCTM()!)
  return { x: p.x, y: p.y }
})
/** A point low in a step's column, clear of its header and its cards. */
async function inStep(page: Page, laneId: string) {
  const column = await resting(page, 'column-' + laneId)
  return { x: column.x + column.width / 2, y: column.y + column.height - 16 }
}
async function carry(page: Page, id: string, to: { x: number; y: number }) {
  const from = centre(await resting(page, id))
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 14 })
  await page.waitForTimeout(80)
  await page.mouse.up()
}
/** A note made as a person makes one: a double-click on open canvas below the map, its words typed. */
async function addNote(page: Page, text: string) {
  const spot = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('#slateCanvas [data-node-id]')].map(n => n.getBoundingClientRect())
    const canvas = document.querySelector('#slateCanvas')!.getBoundingClientRect()
    return { x: Math.min(...boxes.map(r => r.left)) + 100, y: Math.min(Math.max(...boxes.map(r => r.bottom)) + 90, canvas.bottom - 70) }
  })
  const before = await page.evaluate(() => (window as any).slate.v2.freeNodes().map((n: any) => n.id))
  await page.mouse.dblclick(spot.x, spot.y)
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  await page.waitForTimeout(500)
  return page.evaluate(known => (window as any).slate.v2.freeNodes().map((n: any) => n.id).find((id: string) => !known.includes(id)) as string, before)
}
async function preview(page: Page, message: string, keep = true) {
  await messageBox(page).fill(message)
  await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
  if (keep) await conversation(page).getByRole('button', { name: 'Keep changes', exact: true }).click({ timeout: 30000 })
}

test.describe('a map, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('a note dropped on a station is a card there; paths are fixed outside focus and changed in focus, in the chat and live', async ({ page, browser }) => {
    test.setTimeout(300_000)
    let id: string | null = null
    try {
      id = await open(page, '/new/workshop' + encodeWorkshopFragment(decision))
      const key = slateKey(page)
      // Room below the map for a note.
      await page.evaluate(() => { const v2 = (window as any).slate.v2; v2.panBy({ x: 0, y: -120 / (v2.getZoom?.() || 1) }) })
      const idea = await addNote(page, 'Ask legal')
      await carry(page, idea, await inStep(page, 'option-b'))
      await expect.poll(async () => (await storedWorkshop(page, key)).cards.find((c: any) => c.id === idea)).toMatchObject({ label: 'Ask legal', laneId: 'option-b', free: true })
      await expect(announced(page)).toContainText('Ask legal is now a card in Option B')
      await shot(page, 's2b-1-note-on-station')
      // The paths never constrain it: Option B leads nowhere, and the card goes to The question all the same.
      await carry(page, 'card-' + idea, await inStep(page, 'question'))
      await expect.poll(async () => (await storedWorkshop(page, key)).cards.find((c: any) => c.id === idea)?.laneId).toBe('question')

      // Outside focus: no grips; a click picks a path and the bar offers "Change this board".
      await expect(grips(page)).toHaveCount(0)
      // Once the card has settled in its new step, as a person would look before the next thing.
      await page.waitForTimeout(1500)
      await page.mouse.click(900, 200)
      const first = await onPath(page, 'question>option-a')
      await page.mouse.click(first.x, first.y)
      const bar = page.locator('[data-board-path]')
      await expect(bar).toBeVisible()
      await expect(bar).toContainText('Path · The question to Option A')
      await shot(page, 's2b-2-path-picked')
      expect(await paths(page)).toBe('question>option-a question>option-b option-a>decide')
      await bar.getByRole('button', { name: 'Change this board' }).click()
      await expect(focusChip(page)).toContainText('Editing: Decision path')
      await expect(page.locator('#slateCanvas [data-node-id="handle-_link-option-b"]')).toBeVisible()
      await expect(starter(page, 'Remove the path from Option A')).toBeVisible()

      // A second page on the same slate sees each change live.
      const other = await page.context().newPage()
      await other.setViewportSize({ width: 1440, height: 900 })
      await other.goto(page.url())
      await workshopReady(other)
      const seen = () => other.evaluate(() => {
        const ids = [...document.querySelectorAll('#slateCanvas [data-board-link]')].map(el => el.getAttribute('data-board-link'))
        return ids.sort().join(' ')
      })
      await expect.poll(seen).toBe('option-a>decide question>option-a question>option-b')

      // In focus a click removes a path: one change, one undo.
      await page.waitForTimeout(1500)
      const cut = await onPath(page, 'option-a>decide')
      await page.mouse.click(cut.x, cut.y)
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b')
      await expect.poll(seen).toBe('question>option-a question>option-b')
      await shot(page, 's2b-3-path-removed-in-focus')
      await undo(page)
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b option-a>decide')

      // A step's grip, dropped on another step, draws a path there.
      await carry(page, 'handle-_link-option-b', await inStep(page, 'decide'))
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b option-a>decide option-b>decide')
      await expect.poll(seen).toBe('option-a>decide option-b>decide question>option-a question>option-b')
      // A path's end grip moves it: Option A to Option B instead of Decide, one change.
      await carry(page, 'handle-_route-option-a~decide', await inStep(page, 'option-b'))
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b option-a>option-b option-b>decide')
      await shot(page, 's2b-4-path-rerouted')
      await undo(page)
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b option-a>decide option-b>decide')

      // In words: "remove the path from Option A", then the owner's "connect Option B to Decide" once it is gone.
      await preview(page, 'remove the path from Option B')
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b option-a>decide')
      await preview(page, 'connect Option B to Decide')
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b option-a>decide option-b>decide')
      await preview(page, 'remove the path from Option A')
      await expect.poll(() => paths(page)).toBe('question>option-a question>option-b option-b>decide')
      await expect.poll(seen).toBe('option-b>decide question>option-a question>option-b')
      await shot(page, 's2b-5-chat-paths')

      // Leaving focus: the grips go; the paths are fixed again.
      await conversation(page).getByRole('button', { name: 'Stop editing this board' }).click()
      await expect(grips(page)).toHaveCount(0)
      await expect(page.locator('#slateCanvas [data-board-link="option-b>decide"]')).toHaveAttribute('data-board-pick', '')
      await other.close()

      // Off the map the card is the note again.
      await page.mouse.click(5, 300)
      await carry(page, 'card-' + idea, { x: 120, y: 820 })
      await expect.poll(async () => (await storedWorkshop(page, key)).cards.map((c: any) => c.id)).toEqual(['token'])
      await expect(note(page, idea)).toBeVisible()
    } finally { await removeTestGuest(page, id) }
  })
})

/** The words of a note on the canvas (not a card). */
const noteText = (page: Page, id: string) => page.evaluate(id => (window as any).slate.v2.freeNodes().find((n: any) => n.id === id)?.options?.text ?? null, id)

test.describe('notes on a full step and on a release plan, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('a note dropped on a full map step is a card there (the limit counts tokens), said on the board', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      // Decide holds one token, and the token is there.
      const full: Workshop = { ...decision, lanes: decision.lanes.map(lane => lane.id === 'decide' ? { ...lane, capacity: 1 } : lane),
        cards: [{ id: 'token', label: 'Our choice', laneId: 'decide' }] }
      id = await open(page, '/new/workshop' + encodeWorkshopFragment(full))
      const key = slateKey(page)
      await page.evaluate(() => { const v2 = (window as any).slate.v2; v2.panBy({ x: 0, y: -120 / (v2.getZoom?.() || 1) }) })
      const idea = await addNote(page, 'Ask legal')
      await carry(page, idea, await inStep(page, 'decide'))
      await expect.poll(async () => (await storedWorkshop(page, key)).cards.find((c: any) => c.id === idea)).toMatchObject({ label: 'Ask legal', laneId: 'decide', free: true })
      await expect(announced(page)).toContainText('Ask legal is now a card in Decide. 1 of 1 · 1 card.')
      await expect(note(page, idea)).toHaveCount(0)
      await expect(note(page, 'card-' + idea)).toBeVisible()
      await shot(page, 's2b-11-note-on-full-step')
    } finally { await removeTestGuest(page, id) }
  })

  test('a note with points on a release plan saves them: “Audit log · 3 points” is 3 points stored, and comes back off the plan with them', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      id = await open(page, '/new/workshop' + encodeWorkshopFragment(releasePlan))
      const key = slateKey(page)
      await page.evaluate(() => { const v2 = (window as any).slate.v2; v2.panBy({ x: 0, y: -120 / (v2.getZoom?.() || 1) }) })
      const idea = await addNote(page, 'Audit log · 3 points')
      await carry(page, idea, await inStep(page, 'backlog'))
      await expect.poll(async () => (await storedWorkshop(page, key)).cards.find((c: any) => c.id === idea)).toMatchObject({ label: 'Audit log', laneId: 'backlog', points: 3 })
      // A reload draws what was saved.
      await page.reload()
      await workshopReady(page)
      await page.waitForTimeout(2500)
      await expect(note(page, 'card-' + idea)).toContainText('3 points')
      await shot(page, 's2b-12-release-points-saved')
      // Off the plan: the note again, its points written on it.
      await page.mouse.click(5, 300)
      await carry(page, 'card-' + idea, { x: 120, y: 820 })
      await expect.poll(async () => (await storedWorkshop(page, key)).cards.some((c: any) => c.id === idea)).toBe(false)
      await expect.poll(() => noteText(page, idea)).toBe('Audit log · 3 points')
    } finally { await removeTestGuest(page, id) }
  })
})

/** A guest's new slate with a customer go-live, added the way the library adds it, put in focus by the gear's starter. */
async function goLiveInFocus(page: Page) {
  await page.goto(new URL('/new', origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await dismissWelcome(page)
  await expect.poll(() => userId(page)).toBeTruthy()
  const panel = await openConversation(page)
  await panel.getByRole('textbox').fill('Add a customer go-live')
  await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
  await panel.getByRole('button', { name: 'Keep changes', exact: true }).click({ timeout: 30000 })
  await expect(note(page, 'card-configure')).toBeVisible({ timeout: 60000 })
  await dismissWelcome(page)
  await workshopReady(page)
  await page.waitForTimeout(1500)
  await openConversation(page)
  await starter(page, 'Change this board').click()
  await expect(focusChip(page)).toContainText('Editing: Customer go-live')
  return (await userId(page))!
}

test.describe('a customer go-live in focus, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('its span’s ends say what they are; the chat moves go-live, the first day and the span; one undo each; go-live dragged', async ({ page }) => {
    test.setTimeout(300_000)
    let guest: string | null = null
    try {
      guest = await goLiveInFocus(page)
      const stored = () => storedWorkshop(page, slateKey(page))
      const layer = (role: string) => page.locator(`#slateCanvas [data-board-layer="${role}"]`)
      await expect(layer('span-start')).toHaveText(/^Starts Mon \d+ \w+$/)
      await expect(layer('span-end')).toHaveText(/^Go-live Fri \d+ \w+$/)
      await shot(page, 's2b-6-go-live-focus')
      const first = (await stored()).clock.origin as string
      const date = (days: number) => new Date(Date.parse(first + 'T00:00:00Z') + days * 864e5)
      const short = (d: Date) => d.getUTCDate() + ' ' + d.toLocaleString('en-GB', { month: 'short', timeZone: 'UTC' })

      // "Make this a 3-week plan": go-live on the third Friday (day 18), the header says so live.
      await preview(page, 'make this a 3-week plan')
      await expect.poll(async () => (await stored()).launch.day).toBe(18)
      await expect(layer('header')).toContainText('go-live Fri ' + short(date(18)))
      await expect(layer('span-end')).toHaveText('Go-live Fri ' + short(date(18)))
      await shot(page, 's2b-7-three-week-plan')
      await undo(page)
      await expect.poll(async () => (await stored()).launch.day).toBe(25)

      // "Move go-live to <the Wednesday after>": day 30.
      await preview(page, 'move go-live to ' + short(date(30)))
      await expect.poll(async () => (await stored()).launch.day).toBe(30)
      await undo(page)
      await expect.poll(async () => (await stored()).launch.day).toBe(25)

      // "Start on <the Monday after>": the plan's first day moves; go-live keeps its date.
      await preview(page, 'start on ' + short(date(7)))
      await expect.poll(async () => (await stored()).clock.origin).toBe(date(7).toISOString().slice(0, 10))
      await expect(layer('span-start')).toHaveText('Starts Mon ' + short(date(7)))
      await undo(page)
      await expect.poll(async () => (await stored()).clock.origin).toBe(first)

      // Too short: refused in the board's sentence, with the earliest go-live that fits.
      await messageBox(page).fill('make this a 2-week plan')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      await expect(conversation(page)).toContainText('The earliest go-live that fits is')

      // The go-live grip dragged a week earlier: one change; the header follows while it is held.
      const canvasBox = (await page.locator('#slateCanvas').boundingBox())!
      const at = centre(await resting(page, 'handle-launch'))
      await page.evaluate(dx => { const v2 = (window as any).slate.v2; v2.panBy({ x: dx / (v2.getZoom?.() || 1), y: 0 }) }, at.x - (canvasBox.x + canvasBox.width / 3))
      await page.waitForTimeout(300)
      const day = (await resting(page, 'card-configure')).width / 7
      const grip = centre(await resting(page, 'handle-launch'))
      await page.mouse.move(grip.x, grip.y)
      await page.mouse.down()
      await page.mouse.move(grip.x - 7 * day, grip.y, { steps: 16 })
      await expect(layer('header')).toContainText('go-live Fri ' + short(date(18)))
      await shot(page, 's2b-8-go-live-held')
      await page.mouse.up()
      await expect.poll(async () => (await stored()).launch.day).toBe(18)
      await undo(page)
      await expect.poll(async () => (await stored()).launch.day).toBe(25)
    } finally { await removeTestGuest(page, guest) }
  })
})

test.describe('on a phone', () => {
  test('a tap on a map’s path offers “Change this board”; a go-live in focus has finger-sized span grips a pan never moves', async ({ browser, browserName }) => {
    test.skip(browserName !== 'chromium', 'Uses a trusted Chromium touch sequence.')
    test.setTimeout(300_000)
    const page = await (browser as Browser).newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
    let guest: string | null = null
    try {
      guest = await open(page, '/new/workshop' + encodeWorkshopFragment(decision))
      const close = page.getByRole('complementary', { name: 'Ask Slatebox' }).getByRole('button', { name: /^Close/ })
      if (await close.isVisible()) await close.click()
      await page.waitForTimeout(800)
      const spot = await onPath(page, 'question>option-a')
      await page.touchscreen.tap(spot.x, spot.y)
      const bar = page.locator('[data-board-path]')
      await expect(bar).toBeVisible()
      await expect(bar.getByRole('button', { name: 'Change this board' })).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      await shot(page, 's2b-9-phone-path-picked')
      // In focus, fitted to the phone (about half size), the map's grips and its paths' hit areas are a finger's size on screen.
      await bar.getByRole('button', { name: 'Change this board' }).click()
      await expect(focusChip(page)).toContainText('Editing: Decision path')
      await page.waitForTimeout(1500)
      await expect.poll(() => grips(page).count()).toBeGreaterThan(0)
      for (const name of ['handle-_link-question', 'handle-_link-decide', 'handle-_route-question~option-a']) {
        await expect.poll(async () => { const grip = await resting(page, name); return Math.min(grip.width, grip.height) }, { message: name }).toBeGreaterThanOrEqual(40)
      }
      const thickness = await page.locator('#slateCanvas [data-board-link="question>option-a"]').evaluate(el => {
        const path = el as SVGPathElement
        return Number(path.getAttribute('stroke-width')) * Math.hypot(path.getScreenCTM()!.a, path.getScreenCTM()!.b)
      })
      expect(thickness).toBeGreaterThanOrEqual(40)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      await shot(page, 's2b-9b-phone-map-focus-grips')
      await removeTestGuest(page, guest)
      guest = null

      // In focus the chat stays open (closing it leaves focus); the board is fitted above it.
      guest = await goLiveInFocus(page)
      await page.waitForTimeout(1500)
      for (const name of ['handle-_first', 'handle-launch']) {
        const grip = await resting(page, name)
        expect(Math.min(grip.width, grip.height), name).toBeGreaterThanOrEqual(40)
      }
      await expect(page.locator('#slateCanvas [data-board-layer="span-end"]')).toBeAttached()
      await shot(page, 's2b-10-phone-go-live-focus')
      // A finger across empty canvas pans; the span stays as it was.
      const before = await storedWorkshop(page, slateKey(page))
      const canvas = (await page.locator('#slateCanvas').boundingBox())!
      const device = await page.context().newCDPSession(page)
      // A spot of empty canvas the panel does not cover: no note, grip or panel under the finger.
      const from = await page.evaluate(({ x, y, w, h }) => {
        for (let py = y + h - 20; py > y + 20; py -= 12) for (let px = x + 20; px < x + w - 20; px += 24) {
          const hit = document.elementFromPoint(px, py)
          if (hit?.closest('#slateCanvas') && !hit.closest('[data-node-id], [data-board-link]')) return { x: px, y: py }
        }
        return null
      }, { x: canvas.x, y: canvas.y, w: canvas.width, h: canvas.height })
      expect(from, 'empty canvas to pan').toBeTruthy()
      await device.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [from!] })
      for (let i = 1; i <= 10; i++) await device.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from!.x - 12 * i, y: from!.y - 6 * i }] })
      await device.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForTimeout(800)
      const after = await storedWorkshop(page, slateKey(page))
      expect([after.clock.origin, after.launch.day]).toEqual([before.clock.origin, before.launch.day])
    } finally {
      await removeTestGuest(page, guest)
      await page.close()
    }
  })
})
