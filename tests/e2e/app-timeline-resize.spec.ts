import { expect, test, type Browser, type Page } from '@playwright/test'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { announced, note, openConversation, resting, slateKey, storedWorkshop, workshopReady, workshopStatus } from './app-native-workshop.shared'

/**
 * A customer go-live in the real Meteor app, made by a guest from the library's phrase: a task's bar is
 * resized by its grips with a real pointer, on a laptop and with a finger on a phone. The owner's case:
 * Configure takes 5 days and should take 3. Its end grip, dragged back two days (a weekend is drawn but
 * not counted), makes it 3; the tasks that wait on it move up; one undo puts back 5; the same drag again
 * is what a reload shows. On a phone a finger drags the grip; a finger across empty canvas only pans.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates a disposable guest and slate; local app only.')

type Box = { x: number; y: number; width: number; height: number }
/** With SLATEBOX_SHOTS set, keep a picture of each step there. */
const shot = async (page: Page, name: string) => {
  if (!process.env.SLATEBOX_SHOTS) return
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${process.env.SLATEBOX_SHOTS}/timeline-${name}-${page.viewportSize()?.width}.png` })
}
const centre = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
const task = async (page: Page, id: string) => (await storedWorkshop(page, slateKey(page))).cards.find((card: { id: string }) => card.id === id)
/** The words a bar note shows ("Configure · 5d"), however the note wraps them. */
const words = (page: Page, id: string) => note(page, 'card-' + id).evaluate(element => (element.textContent ?? '').replace(/\s+/g, ' ').trim())

/** A guest's new slate with a customer go-live on it, added the way the library adds it. */
async function goLive(page: Page) {
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
  return (await userId(page))!
}

/** A calendar day of the grid on screen: Configure (Fri to Thu over a weekend) is 7 calendar days wide. */
async function day(page: Page) {
  return (await resting(page, 'card-configure')).width / 7
}

async function mouseDrag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 16 })
  await page.waitForTimeout(80)
  await page.mouse.up()
}

async function fingerDrag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...from, id: 1 }] })
  for (let i = 1; i <= 12; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * i / 12, y: from.y + (to.y - from.y) * i / 12, id: 1 }] })
    await page.waitForTimeout(20)
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
}

test.describe('a task’s bar resized by its grips', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('laptop: Configure’s end grip dragged from 5 days to 3; what waits on it moves up; one undo; a reload keeps 3', async ({ page }) => {
    test.setTimeout(240_000)
    let guest: string | null = null
    try {
      guest = await goLive(page)
      expect(await task(page, 'configure')).toMatchObject({ duration: 5 })
      await expect.poll(() => words(page, 'configure')).toBe('Configure · 5d')
      const width = await day(page)
      const trainBefore = await resting(page, 'card-train')

      // No grips until the task is under the pointer; then both edges show one.
      const grips = page.locator('#slateCanvas [data-board-layer^="grip-"]')
      await expect(grips).toHaveCount(0)
      await page.mouse.move(centre(await resting(page, 'card-configure')).x, centre(await resting(page, 'card-configure')).y)
      await expect(page.locator('#slateCanvas [data-board-layer="grip-start-configure"]')).toBeAttached()
      await expect(page.locator('#slateCanvas [data-board-layer="grip-end-configure"]')).toBeAttached()
      await expect(note(page, 'handle-configure')).toHaveCSS('cursor', 'ew-resize')
      await shot(page, '1-grips-on-hover')

      // The end grip, two calendar days back (Thu to Tue): 3 working days.
      const grip = centre(await resting(page, 'handle-configure'))
      await mouseDrag(page, grip, { x: grip.x - 2 * width, y: grip.y })
      await expect.poll(async () => (await task(page, 'configure')).duration).toBe(3)
      expect((await task(page, 'configure')).lag ?? 0).toBe(0)
      await expect.poll(() => words(page, 'configure')).toBe('Configure · 3d')
      await shot(page, '2-three-days')
      // Train admins waits on Configure: it now starts two calendar days earlier.
      await expect.poll(async () => Math.round(((await resting(page, 'card-train')).x - trainBefore.x) / width)).toBe(-2)

      // One drag is one undo step.
      await workshopStatus(page).getByRole('button', { name: 'Undo last change', exact: true }).click()
      await expect.poll(async () => (await task(page, 'configure')).duration).toBe(5)
      await expect.poll(() => words(page, 'configure')).toBe('Configure · 5d')

      // The same drag again; a reload opens it as saved.
      const again = centre(await resting(page, 'handle-configure'))
      await mouseDrag(page, again, { x: again.x - 2 * width, y: again.y })
      await expect.poll(async () => (await task(page, 'configure')).duration).toBe(3)
      await page.reload()
      await dismissWelcome(page)
      await workshopReady(page)
      await expect.poll(() => words(page, 'configure')).toBe('Configure · 3d')
      expect((await task(page, 'configure')).duration).toBe(3)

      // Past go-live the drop is refused in the board's own sentence, and the bar goes back.
      const late = centre(await resting(page, 'handle-configure'))
      await mouseDrag(page, late, { x: late.x + 15 * width, y: late.y })
      await expect(announced(page)).toContainText('go-live is Fri')
      await shot(page, '3-refused-past-go-live')
      await page.waitForTimeout(600)
      expect((await task(page, 'configure')).duration).toBe(3)

      // The start grip moves the start and keeps the end: Friday to Monday is one working day later.
      const trainKept = await resting(page, 'card-train')
      const start = centre(await resting(page, 'handle-_start-configure'))
      await mouseDrag(page, start, { x: start.x + 3 * width, y: start.y })
      await expect.poll(async () => { const t = await task(page, 'configure'); return [t.lag, t.duration] }).toEqual([1, 2])
      // Its end, and so what waits on it, stays where it was.
      expect(Math.round(((await resting(page, 'card-train')).x - trainKept.x) / width)).toBe(0)
    } finally { await removeTestGuest(page, guest) }
  })
})

test.describe('go-live moved by its grip', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('laptop: go-live dragged right past the chart’s end by 3 days lands on Monday (weekends don’t count); one undo; a key moves it a working day', async ({ page }) => {
    test.setTimeout(240_000)
    let guest: string | null = null
    try {
      guest = await goLive(page)
      const header = page.locator('#slateCanvas [data-board-layer="header"]')
      const lineDay = async () => (await storedWorkshop(page, slateKey(page))).launch.day
      // The sample's go-live is the fourth Friday, at the chart's right edge.
      expect(await lineDay()).toBe(25)
      await expect(header).toContainText('go-live Fri')
      // Bring go-live to the middle of the canvas: held near the canvas's edge the view pans with the grip (and the line goes on with it).
      const canvasBox = (await page.locator('#slateCanvas').boundingBox())!
      const at = centre(await resting(page, 'handle-launch'))
      await page.evaluate(dx => { const slate = (window as any).slate.v2; slate.panBy({ x: dx / (slate.getZoom?.() || 1), y: 0 }) }, at.x - (canvasBox.x + canvasBox.width / 2))
      await page.waitForTimeout(300)
      const width = await day(page)
      const grip = centre(await resting(page, 'handle-launch'))
      expect(Math.abs(grip.x - (canvasBox.x + canvasBox.width / 2))).toBeLessThan(40)
      await shot(page, '7-go-live-before')

      // Three calendar days right, past what was drawn: Friday to Monday.
      await mouseDrag(page, grip, { x: grip.x + 3 * width, y: grip.y })
      await expect.poll(lineDay).toBe(28)
      await expect(header).toContainText('go-live Mon')
      await expect(announced(page)).toContainText('Go-live is now Mon')
      await shot(page, '8-go-live-later')

      // One drag is one undo step.
      await workshopStatus(page).getByRole('button', { name: 'Undo last change', exact: true }).click()
      await expect.poll(lineDay).toBe(25)
      await expect(header).toContainText('go-live Fri')

      // Earlier than the tasks end: refused in the board's sentence, with the earliest go-live that fits.
      const back = centre(await resting(page, 'handle-launch'))
      await mouseDrag(page, back, { x: back.x - 13 * (await day(page)), y: back.y })
      await expect(announced(page)).toContainText('The earliest go-live that fits is')
      await page.waitForTimeout(600)
      expect(await lineDay()).toBe(25)

      // A key moves it a working day: Right from Friday is Monday.
      const line = centre(await resting(page, 'handle-launch'))
      await page.mouse.click(line.x, line.y)
      await page.waitForTimeout(500)
      await page.keyboard.press('ArrowRight')
      await expect.poll(lineDay).toBe(28)
      await expect(announced(page)).toContainText('Go-live is now Mon')
      await expect(header).toContainText('go-live Mon')
    } finally { await removeTestGuest(page, guest) }
  })
})

test.describe('the owner’s phrases in the chat', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('with Configure selected, “change this to 3 days” makes it 3 days, never a card called “3 days”; “Make this 3 days” is offered', async ({ page }) => {
    test.setTimeout(240_000)
    let guest: string | null = null
    try {
      guest = await goLive(page)
      await note(page, 'card-configure').click()
      const panel = await openConversation(page)
      await expect(panel.getByRole('status').filter({ hasText: 'Selected card · Configure' })).toBeVisible()
      await expect(panel.getByRole('group', { name: 'Starter messages' }).getByRole('button').first()).toHaveText('Make this 3 days')
      await panel.getByRole('textbox').fill('change this to 3 days')
      await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
      await expect(panel).toContainText('“Configure” now takes 3 days.')
      await panel.getByRole('button', { name: 'Keep changes', exact: true }).click()
      await expect.poll(async () => (await task(page, 'configure')).duration).toBe(3)
      expect((await task(page, 'configure')).label).toBe('Configure')
      await expect.poll(() => words(page, 'configure')).toBe('Configure · 3d')
      await panel.getByRole('textbox').fill('change the duration to 4 days')
      await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
      await expect(panel).toContainText('“Configure” now takes 4 days.')
      await expect(panel).not.toContainText('There is no lane')
      await shot(page, '6-chat-duration')
    } finally { await removeTestGuest(page, guest) }
  })
})

test.describe('on a phone', () => {
  test('a finger drags Configure’s end grip from 5 days to 3; a finger on empty canvas only pans', async ({ browser, browserName }) => {
    test.skip(browserName !== 'chromium', 'Uses a trusted Chromium touch sequence.')
    test.setTimeout(240_000)
    const page = await (browser as Browser).newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
    let guest: string | null = null
    try {
      guest = await goLive(page)
      // The conversation covers a phone's canvas: close it to reach the board.
      const close = page.getByRole('complementary', { name: 'Ask Slatebox' }).getByRole('button', { name: /^Close/ })
      if (await close.isVisible()) await close.click()
      await workshopReady(page)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      // Every bar shows its grips on a phone, and each grip is a finger's size.
      await expect(page.locator('#slateCanvas [data-board-layer="grip-end-configure"]')).toBeAttached()
      const handle = await resting(page, 'handle-configure')
      expect(Math.min(handle.width, handle.height)).toBeGreaterThanOrEqual(24)
      await shot(page, '4-phone-grips')

      // A pan across empty canvas changes nothing.
      const canvas = (await page.locator('#slateCanvas').boundingBox())!
      const board = await storedWorkshop(page, slateKey(page))
      const below = { x: canvas.x + canvas.width / 2, y: canvas.y + canvas.height - 40 }
      await fingerDrag(page, below, { x: below.x - 120, y: below.y - 60 })
      await page.waitForTimeout(600)
      expect((await storedWorkshop(page, slateKey(page))).cards).toEqual(board.cards)

      const width = (await resting(page, 'card-configure')).width / 7
      const grip = centre(await resting(page, 'handle-configure'))
      await fingerDrag(page, grip, { x: grip.x - 2 * width, y: grip.y })
      await expect.poll(async () => (await task(page, 'configure')).duration).toBe(3)
      expect((await task(page, 'configure')).label).toBe('Configure')
      await shot(page, '5-phone-three-days')
    } finally {
      await removeTestGuest(page, guest)
      await page.close()
    }
  })
})
