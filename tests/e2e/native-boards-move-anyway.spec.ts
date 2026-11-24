import { expect, test, type Page } from '@playwright/test'

/**
 * Moving a card anyway on every smart component (owner, 2026-11-23: "dropping the card where it shouldn't go should be
 * possible with a confirmation ... standard in the smart components"), with the engine alone: a pipeline, a budget, a
 * launch plan and a nested board. A drop the rules refuse goes back with the refusal, then the host is asked with the
 * rule's sentence; Move anyway makes the one edit with override (one change, so one undo step), marked on the card with
 * who and when, and the numbers the board computes follow; Cancel leaves everything as it was.
 *
 * Fixture: tests/fixtures/native-boards.html?board=…&confirm (a host dialog; cards moved anyway are marked "Sam").
 */

async function open(page: Page, query: string) {
  await page.goto('/tests/fixtures/native-boards.html?' + query)
  await page.waitForFunction(() => (window as any).boards?.ready === true)
  await page.waitForTimeout(200)
}
const box = (page: Page, id: string) => page.evaluate(key => (window as any).boards.box(key) as { x: number; y: number; width: number; height: number }, id)
const center = async (page: Page, id: string) => { const b = await box(page, id); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }
const value = (page: Page) => page.evaluate(() => (window as any).boards.board.value)
const card = async (page: Page, id: string) => (await value(page)).cards.find((item: any) => item.id === id)
const changes = (page: Page) => page.evaluate(() => (window as any).boards.log.changes.map((c: any) => c.change))
const text = (page: Page, id: string) => page.evaluate(key => (window as any).boards.text(key) as string | null, id)
const dialog = (page: Page) => page.getByRole('alertdialog', { name: 'Move anyway?' })
const layer = (page: Page, role: string) => page.locator(`#slate [data-board-layer="${role}"]`)

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 14 })
  await page.waitForTimeout(60)
  await page.mouse.up()
}

test.describe('desktop, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('pipeline: a deal dropped two stages on asks; Move anyway moves it, the forecast follows, the full stage says it is over; back again clears the mark', async ({ page }) => {
    await open(page, 'board=pipeline&confirm')
    const column = await box(page, 'column-proposal')
    await drag(page, await center(page, 'card-northwind'), { x: column.x + column.width / 2, y: column.y + column.height - 30 })
    // Every rule the move breaks: a stage skipped, and Proposal at its limit.
    await expect(dialog(page)).toContainText('Move Northwind to Proposal anyway? Deals move one stage at a time. Northwind is in Lead, so Qualified comes first. Proposal already holds 3 of 3 deals.')
    // Nothing moved until the person says so.
    expect((await card(page, 'northwind')).laneId).toBe('lead')
    await dialog(page).getByRole('button', { name: 'Move anyway' }).click()
    await expect.poll(async () => (await card(page, 'northwind')).laneId).toBe('proposal')
    expect((await card(page, 'northwind')).override).toMatchObject({ by: 'Sam', from: 'lead', sentence: expect.stringMatching(/^Deals move one stage at a time/) })
    // One change, one edit: one undo step for the host.
    // The sentence the person agreed to goes with it, so the server asks again if its board would break something else.
    expect((await changes(page)).at(-1)).toEqual({ cardId: 'northwind', laneId: 'proposal', override: true, reason: 'Deals move one stage at a time. Northwind is in Lead, so Qualified comes first. Proposal already holds 3 of 3 deals.', edits: [{ kind: 'move_card', card: { id: 'northwind' }, lane: { id: 'proposal' }, override: true }] })
    await expect.poll(() => text(page, 'caption-proposal')).toMatch(/^4 deals · .* · 60%\nover its limit of 3$/)
    await expect.poll(() => text(page, 'card-northwind')).toMatch(/^Northwind\n\$40k\nMoved anyway by Sam · \d+ [A-Z][a-z]{2}$/)
    // An ordinary move back is a legal one, and takes the mark with it.
    const lead = await box(page, 'column-lead')
    await drag(page, await center(page, 'card-northwind'), { x: lead.x + lead.width / 2, y: lead.y + lead.height - 30 })
    await expect.poll(async () => (await card(page, 'northwind')).laneId).toBe('lead')
    expect((await card(page, 'northwind')).override).toBeUndefined()
    await expect.poll(() => text(page, 'caption-proposal')).not.toContain('over its limit')
  })

  test('pipeline: Cancel leaves the deal and saves nothing', async ({ page }) => {
    await open(page, 'board=pipeline&confirm')
    const column = await box(page, 'column-proposal')
    await drag(page, await center(page, 'card-northwind'), { x: column.x + column.width / 2, y: column.y + column.height - 30 })
    await dialog(page).getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog(page)).toHaveCount(0)
    await page.waitForTimeout(300)
    expect((await card(page, 'northwind')).laneId).toBe('lead')
    expect(await changes(page)).toEqual([])
  })

  test('budget: a line item dropped on a team without the money asks; moved anyway, the team says it is over budget', async ({ page }) => {
    await open(page, 'board=budget&confirm')
    const design = await box(page, 'column-design')
    await drag(page, await center(page, 'card-ads'), { x: design.x + design.width / 2, y: design.y + design.height - 30 })
    await expect(dialog(page)).toContainText('Move Launch ads to Design anyway? Design has $30k left. Launch ads costs $150k.')
    await dialog(page).getByRole('button', { name: 'Move anyway' }).click()
    await expect.poll(async () => (await card(page, 'ads')).laneId).toBe('design')
    await expect.poll(() => text(page, 'caption-design')).toBe('$150k · $270k committed\nover budget by $120k')
    await expect(layer(page, 'header')).toHaveText('$1.2M · 1 team over budget')
    await expect.poll(() => text(page, 'card-ads')).toMatch(/Moved anyway by Sam/)
    // The envelope still adds up: the board stays readable.
    expect(await page.evaluate(() => { const b = (window as any).boards; try { b.validateWorkshop(b.board.value); return true } catch { return false } })).toBe(true)
  })

  test('launch plan: a bar slid past launch asks; moved anyway, the plan finishes late and the bar is drawn in red', async ({ page }) => {
    await open(page, 'board=launch-plan&confirm')
    const bar = await box(page, 'card-qa')
    const day = bar.width / 2
    const from = await center(page, 'card-qa')
    await drag(page, from, { x: from.x + 4 * day, y: from.y })
    await expect(dialog(page)).toContainText('Move QA to start day 14 anyway? That ends on day 16, after launch on day 14.')
    await dialog(page).getByRole('button', { name: 'Move anyway' }).click()
    await expect.poll(async () => (await card(page, 'qa')).lag).toBe(4)
    expect((await card(page, 'qa')).override).toMatchObject({ by: 'Sam', was: { lag: 0, duration: 2 } })
    expect((await changes(page)).at(-1).edits).toEqual([{ kind: 'set_task', card: { id: 'qa' }, lag: 4, override: true }])
    await expect(page.locator('#slate [data-board-layer="header"]')).toContainText('Done day 16 · launch day 14')
    await expect(page.locator('#slate [data-board-layer="mark-qa"]')).toContainText('Moved anyway by Sam')
  })

  test('launch plan: a bar slid well before what it waits on asks; moved anyway, the wait is drawn broken and the finish comes in', async ({ page }) => {
    await open(page, 'board=launch-plan&confirm')
    const bar = await box(page, 'card-build')
    const day = bar.width / 6
    const from = await center(page, 'card-build')
    await drag(page, from, { x: from.x - 3 * day, y: from.y })
    await expect(dialog(page)).toContainText('Move Build to start day 1 anyway? Build waits on Design: it starts day 4 at the earliest.')
    await dialog(page).getByRole('button', { name: 'Move anyway' }).click()
    await expect.poll(async () => (await card(page, 'build')).lag).toBe(-3)
    await expect(page.locator('#slate [data-board-layer="broken-design-build"]')).toHaveCount(1)
    await expect(page.locator('#slate [data-board-layer="header"]')).toContainText('Done day 9')
  })

  test('nested board: a solution dropped on the outcome asks; nested anyway, it sits under it, marked', async ({ page }) => {
    await open(page, 'board=nest&confirm')
    await drag(page, await center(page, 'card-csv-import'), await center(page, 'card-outcome'))
    await expect(dialog(page)).toContainText('Move CSV import under Activation to 40% anyway? Solutions sit under an opportunity.')
    await dialog(page).getByRole('button', { name: 'Move anyway' }).click()
    await expect.poll(async () => (await card(page, 'csv-import')).parentId).toBe('outcome')
    expect((await card(page, 'csv-import')).override).toMatchObject({ by: 'Sam', sentence: 'Solutions sit under an opportunity.', was: { parentId: 'slow-onboarding' } })
    await expect.poll(() => text(page, 'card-csv-import')).toMatch(/Moved anyway by Sam/)
  })

  test('without a host that confirms, a refused drop on a business board is only refused (as it always was)', async ({ page }) => {
    await open(page, 'board=pipeline')
    const column = await box(page, 'column-proposal')
    await drag(page, await center(page, 'card-northwind'), { x: column.x + column.width / 2, y: column.y + column.height - 30 })
    await page.waitForTimeout(400)
    expect((await card(page, 'northwind')).laneId).toBe('lead')
    await expect(page.getByRole('alertdialog')).toHaveCount(0)
  })

  test('keyboard on a pipeline: Right toward a full stage asks about that stage; without a host it is said and passed over', async ({ page }) => {
    await open(page, 'board=pipeline&confirm')
    const acme = await center(page, 'card-acme')
    await page.mouse.click(acme.x, acme.y)
    await page.waitForTimeout(250)
    await page.keyboard.press('ArrowRight')
    await expect(dialog(page)).toContainText('Move Acme to Proposal anyway? Proposal already holds 3 of 3 deals.')
    await expect(dialog(page).getByRole('button', { name: 'Move anyway' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect.poll(async () => (await card(page, 'acme')).laneId).toBe('proposal')
    expect((await changes(page)).at(-1).edits).toEqual([{ kind: 'move_card', card: { id: 'acme' }, lane: { id: 'proposal' }, override: true }])

    await open(page, 'board=pipeline')
    const again = await center(page, 'card-acme')
    await page.mouse.click(again.x, again.y)
    await page.waitForTimeout(250)
    await page.keyboard.press('ArrowRight')
    // Proposal is full and Won is two stages on: said, then the first stage that takes it (Lost).
    await expect.poll(() => page.evaluate(() => (window as any).boards.log.said.at(-1))).toMatch(/^Acme can't go in Proposal: Proposal already holds 3 of 3 deals\. Acme to Lost: .*Press Enter to move it, Escape to cancel\.$/)
    await page.keyboard.press('Escape')
    expect((await card(page, 'acme')).laneId).toBe('qualified')
  })
})
