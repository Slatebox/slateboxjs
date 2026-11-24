import { expect, test, type Page } from '@playwright/test'

/**
 * Moving a card anyway (owner, 2026-11-23: "dropping the card where it shouldn't go should be possible with a
 * confirmation ... standard in the smart components"), with the engine alone. A drop the rules refuse goes back
 * with the refusal, then the host is asked (confirmOverride) with the rule's sentence: "Move anyway" moves it, marked
 * with who and when on the card, and onChange hears `override: true`; "Cancel" leaves it where it was.
 *
 * Fixture (tests/fixtures/native-workshop.html?map&confirm): Refund request → Finance approves → Issue refund, the
 * token at Refund request; ?lanes&confirm: Now and Later (holds 1), Gamma allowed only in Now.
 */

const dialog = (page: Page) => page.getByRole('alertdialog', { name: 'Move anyway?' })
async function open(page: Page, kind: string) {
  await page.goto('/tests/fixtures/native-workshop.html?' + kind)
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.waitForTimeout(150)
}
const box = (page: Page, id: string) => page.evaluate(key => (window as any).native.box(key), id) as Promise<{ x: number; y: number; width: number; height: number } | null>
const cards = (page: Page) => page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string)
const changes = (page: Page) => page.evaluate(() => (window as any).native.log.changes.map((c: any) => c.change))
async function resting(page: Page, id: string) {
  let last = await box(page, id)
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100)
    const next = await box(page, id)
    if (last && next && Math.abs(next.x - last.x) < 0.5 && Math.abs(next.y - last.y) < 0.5) return next
    last = next
  }
  throw new Error(id + ' never came to rest')
}
async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column!.x + column!.width / 2, y: column!.y + column!.height * 0.8 }
}
async function drag(page: Page, id: string, to: { x: number; y: number }) {
  const from = await resting(page, id)
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
  await page.mouse.up()
}

test('a map: the token dropped on a step with no path asks, and Move anyway moves it, marked on the card', async ({ page }) => {
  await open(page, 'map&confirm')
  await drag(page, 'card-token', await inLane(page, 'refund'))
  const dialog = page.getByRole('alertdialog', { name: 'Move anyway?' })
  await expect(dialog).toContainText("Move Team to Issue refund anyway? Issue refund can't be reached from Refund request.")
  // The card went back first: nothing moved until the person says so.
  expect(await cards(page)).toBe('token@request')
  await dialog.getByRole('button', { name: 'Move anyway' }).click()
  await expect.poll(() => cards(page)).toBe('token@refund')
  const override = await page.evaluate(() => (window as any).native.board.value.cards[0].override)
  expect(override).toMatchObject({ by: 'Sam', sentence: "Issue refund can't be reached from Refund request.", from: 'request' })
  expect((await changes(page)).at(-1)).toEqual({ cardId: 'token', laneId: 'refund', override: true, reason: "Issue refund can't be reached from Refund request." })
  // Visible on the card: who moved it anyway.
  await expect.poll(() => page.evaluate(() => (window as any).native.at('card-token')?.text)).toMatch(/^Team\nMoved anyway by Sam · \d+ [A-Z][a-z]{2}$/)
  await expect(page.locator('#slate [aria-live]')).toContainText('Team moved to Issue refund anyway.')
})

test('a map: Cancel leaves the token where it was, and nothing is saved', async ({ page }) => {
  await open(page, 'map&confirm')
  await drag(page, 'card-token', await inLane(page, 'refund'))
  const dialog = page.getByRole('alertdialog', { name: 'Move anyway?' })
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await expect(dialog).toHaveCount(0)
  await page.waitForTimeout(300)
  expect(await cards(page)).toBe('token@request')
  expect(await changes(page)).toEqual([])
  // The refusal itself was still said, as before.
  expect(await page.evaluate(() => (window as any).native.log.refusals.at(-1).reason)).toBe("Issue refund can't be reached from Refund request.")
})

test('a lane board: a full lane and a lane the card may not go in both ask; a legal drop never does', async ({ page }) => {
  await open(page, 'lanes&confirm')
  await drag(page, 'card-alpha', await inLane(page, 'later'))
  await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
  expect(await page.evaluate(() => (window as any).native.log.asks.length)).toBe(0)
  // Later holds 1: Beta asks.
  await drag(page, 'card-beta', await inLane(page, 'later'))
  const dialog = page.getByRole('alertdialog', { name: 'Move anyway?' })
  await expect(dialog).toContainText('Move Beta to Later anyway?')
  await dialog.getByRole('button', { name: 'Move anyway' }).click()
  await expect.poll(() => cards(page)).toBe('alpha@later beta@later gamma@now')
  // Gamma may go only in Now: asks too, and Cancel keeps it there.
  await drag(page, 'card-gamma', await inLane(page, 'later'))
  await expect(dialog).toContainText("Move Gamma to Later anyway? This card can't go in Later.")
  await dialog.getByRole('button', { name: 'Cancel' }).click()
  await page.waitForTimeout(300)
  expect(await cards(page)).toBe('alpha@later beta@later gamma@now')
})

test('without a host that confirms, a refused drop is only refused (as it always was)', async ({ page }) => {
  await open(page, 'map')
  await drag(page, 'card-token', await inLane(page, 'refund'))
  await page.waitForTimeout(400)
  expect(await cards(page)).toBe('token@request')
  await expect(page.getByRole('alertdialog')).toHaveCount(0)
})

test('keyboard: Right toward a lane the card may not go in asks, never skips it; Escape cancels and the focus comes back; Enter moves it anyway', async ({ page }) => {
  await open(page, 'lanes&confirm')
  const live = page.locator('#slate [aria-live]')
  const card = await resting(page, 'card-gamma')
  await page.mouse.click(card!.x + card!.width / 2, card!.y + card!.height / 2)
  await page.waitForTimeout(250)
  const focused = await page.evaluate(() => document.activeElement?.tagName ?? null)
  // Gamma may go only in Now: Right asks about Later (the next lane), with the rule.
  await page.keyboard.press('ArrowRight')
  await expect(dialog(page)).toContainText("Move Gamma to Later anyway? This card can't go in Later.")
  await expect(live).toContainText("Gamma can't move to Later by this board's rules. This card can't go in Later. Move it anyway?")
  // The dialog takes the keyboard: Move anyway has the focus.
  await expect(dialog(page).getByRole('button', { name: 'Move anyway' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toHaveCount(0)
  // Cancelled: nothing moved, nothing saved, and the focus is back where the keys were.
  expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
  expect(await changes(page)).toEqual([])
  expect(await page.evaluate(() => document.activeElement?.tagName ?? null)).toBe(focused)
  // The card is still selected. Right again passes over the lane it declined, saying why (Later is the last lane, so
  // the card stays); the press after asks again, and Enter on Move anyway moves it, marked.
  await page.keyboard.press('ArrowRight')
  await expect(live).toContainText("This card can't go in Later.")
  await expect(dialog(page)).toHaveCount(0)
  await page.keyboard.press('ArrowRight')
  await expect(dialog(page)).toHaveCount(1)
  await page.keyboard.press('Enter')
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@later')
  expect((await changes(page)).at(-1)).toEqual({ cardId: 'gamma', laneId: 'later', override: true, reason: "This card can't go in Later." })
  expect(await page.evaluate(() => (window as any).native.board.value.cards[2].override)).toMatchObject({ by: 'Sam', from: 'now' })
})


test('keyboard: a lane past one the person declined is still reached: Cancel, then Right again passes over the full lane', async ({ page }) => {
  await open(page, 'wip&confirm')
  const live = page.locator('#slate [aria-live]')
  const card = await resting(page, 'card-alpha')
  await page.mouse.click(card!.x + card!.width / 2, card!.y + card!.height / 2)
  await page.waitForTimeout(250)
  // Doing is at its limit: Right asks.
  await page.keyboard.press('ArrowRight')
  await expect(dialog(page)).toContainText('Move Alpha to Doing anyway?')
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toHaveCount(0)
  // Right again: no second dialog; Doing is passed over, said aloud, and Done is on show.
  await page.keyboard.press('ArrowRight')
  await expect(dialog(page)).toHaveCount(0)
  await expect(live).toContainText("Alpha can't go in Doing")
  await expect(live).toContainText('Alpha to Done')
  await page.keyboard.press('Enter')
  await expect.poll(() => cards(page)).toBe('alpha@done beta@doing')
  expect((await changes(page)).at(-1)).toMatchObject({ cardId: 'alpha', laneId: 'done' })
  expect((await changes(page)).at(-1).override).toBeUndefined()
})
