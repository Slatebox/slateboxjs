import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { announced, note, openConversation, resting, slateKey, storedWorkshop, workshopReady, workshopStatus, canvasUndo } from './app-native-workshop.shared'

/**
 * A budget's total in the real Meteor app (the owner, 2026-11-22: "change the total too"): the envelope's outer
 * edges dragged with a real mouse. The end edge out grows the total (the last team gains it), in shrinks it; the
 * start edge out grows it at the first team; past what the teams keep it is refused with the smallest total that
 * fits. One undo per drag; a key moves it a step; the inner dividers still move money between teams.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates a disposable guest and slate; local app only.')

type Box = { x: number; y: number; width: number; height: number }
const centre = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
const shot = async (page: Page, name: string) => {
  if (!process.env.SLATEBOX_SHOTS) return
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${process.env.SLATEBOX_SHOTS}/budget-${name}-${page.viewportSize()?.width}.png` })
}

async function mouseDrag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 16 })
  await page.waitForTimeout(80)
  await page.mouse.up()
}

test.describe('a budget’s total at its envelope’s edges', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('laptop: the end edge out grows it, in shrinks it; the start edge out grows it at the first team; too small is refused; one undo each; a key moves it a step', async ({ page }) => {
    test.setTimeout(240_000)
    let guest: string | null = null
    try {
      await page.goto(new URL('/new?empty=1', origin).href)
      await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
      await dismissWelcome(page)
      await expect.poll(() => userId(page)).toBeTruthy()
      guest = (await userId(page))!
      const panel = await openConversation(page)
      await panel.getByRole('textbox').fill('Split a 1.2M budget across Product, Sales and Design; Product at least 300k; with Contractor 45k in Product, Hires 320k in Sales, Research panel 370k in Design')
      await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
      await panel.getByRole('button', { name: 'Keep changes', exact: true }).click({ timeout: 30000 })
      await expect(note(page, 'column-design')).toBeVisible({ timeout: 60000 })
      const close = page.getByRole('complementary', { name: 'Ask Slatebox' }).getByRole('button', { name: /^Close/ })
      if (await close.isVisible()) await close.click()
      await dismissWelcome(page)
      await workshopReady(page)

      const stored = () => storedWorkshop(page, slateKey(page))
      const total = async () => (await stored()).budget.total as number
      const allocation = async (id: string) => (await stored()).lanes.find((lane: { id: string }) => lane.id === id).allocation as number
      const header = page.locator('#slateCanvas [data-board-layer="header"]')
      expect(await total()).toBe(1200000)
      await expect(header).toHaveText('$1.2M · balanced')
      const product = await allocation('product'), design = await allocation('design')
      /** Screen pixels a dollar is, from the envelope as drawn. */
      const perDollar = async () => {
        const first = await resting(page, 'column-product'), last = await resting(page, 'column-design')
        return (last.x + last.width - first.x) / (await total())
      }
      /** An edge's grip brought to the middle of the canvas, clear of the edge pan. */
      const middle = async (name: string) => {
        const canvas = (await page.locator('#slateCanvas').boundingBox())!
        const at = centre(await resting(page, name))
        await page.evaluate(dx => { const slate = (window as any).slate.v2; slate.panBy({ x: dx / (slate.getZoom?.() || 1), y: 0 }) }, at.x - (canvas.x + canvas.width / 2))
        await page.waitForTimeout(300)
        return centre(await resting(page, name))
      }
      const undo = () => canvasUndo(page).click()
      await shot(page, '1-before')

      // The end edge out by $50k: the total grows, Design (the last team) gains it.
      let grip = await middle('handle-_last')
      await mouseDrag(page, grip, { x: grip.x + 50000 * (await perDollar()), y: grip.y })
      await expect.poll(total).toBe(1250000)
      expect(await allocation('design')).toBe(design + 50000)
      await expect(header).toHaveText('$1.25M · balanced')
      await expect(announced(page)).toContainText('The budget is now $1.25M')
      await shot(page, '2-end-out')
      await undo()
      await expect.poll(total).toBe(1200000)

      // The end edge in by $20k: it shrinks, at Design.
      grip = await middle('handle-_last')
      await mouseDrag(page, grip, { x: grip.x - 20000 * (await perDollar()), y: grip.y })
      await expect.poll(total).toBe(1180000)
      expect(await allocation('design')).toBe(design - 20000)
      await undo()
      await expect.poll(total).toBe(1200000)

      // The start edge out (left) by $50k: it grows at Product.
      grip = await middle('handle-_first')
      await mouseDrag(page, grip, { x: grip.x - 50000 * (await perDollar()), y: grip.y })
      await expect.poll(total).toBe(1250000)
      expect(await allocation('product')).toBe(product + 50000)
      await shot(page, '3-start-out')
      await undo()
      await expect.poll(total).toBe(1200000)

      // Far in: below what the teams keep. Refused with the smallest total that fits; nothing changes.
      grip = await middle('handle-_last')
      await mouseDrag(page, grip, { x: grip.x - 700000 * (await perDollar()), y: grip.y })
      await expect(announced(page)).toContainText('The smallest total that fits is')
      await page.waitForTimeout(600)
      expect(await total()).toBe(1200000)

      // A key: Left on the end edge takes a step off.
      grip = centre(await resting(page, 'handle-_last'))
      await page.mouse.click(grip.x, grip.y)
      await page.waitForTimeout(500)
      await page.keyboard.press('ArrowLeft')
      await expect.poll(total).toBe(1195000)
      await expect(header).toHaveText('$1.195M · balanced')
    } finally { await removeTestGuest(page, guest) }
  })
})
