import {resumeArchivedDraft} from './workshop-archive.shared'
import { editObject } from './workshop-edit.shared'
import { expect, test } from '@playwright/test'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

test('author a branching concept map, follow a consequence, present and reopen the private model', async ({ page }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true', 'Requires the hosted whiteboard app')
  await resumeArchivedDraft(page, origin, 'lanes')
  await resumeArchivedDraft(page, origin,'map')
  await expect(page).toHaveURL(/format=map&resume=tab/)
  await expect(page.getByRole('heading', {level: 1})).toHaveText(/last train/)
  await expect(page.locator('main textarea:visible, main input:visible')).toHaveCount(0)
  const generationGate = await page.evaluate(async () => {
    try {
      await (window as any).Meteor.callAsync('workshops.draft', 'Map a night shift transfer with branching exits.', 'map')
      return 'generated'
    } catch (error: any) { return error.error }
  })
  expect(generationGate).toBe('plan-required')
  await editObject(page, 'title', () => page.getByLabel('Board title').fill('Night shift route review'))
  await editObject(page, 'lane:lift', () => page.getByLabel('On arrival at Market St lift').fill('The lift gives the rider a step-free route.'))
  const paths = page.getByRole('group', { name: 'Paths from Last train' })
  await page.locator('#heading-platform text').first().dblclick()
  await paths.getByRole('checkbox', { name: 'East stairs' }).uncheck()
  await page.getByRole('button', {name:'Save changes'}).click()
  await page.getByText('More board options').click()
  await page.getByRole('button', { name: 'Edit map JSON' }).click()
  const editor = page.getByRole('dialog', { name: 'Edit map structure' })
  const source = editor.getByLabel('Map JSON')
  const model = JSON.parse(await source.inputValue())
  expect(model.lanes[0].station.next).toEqual(['lift'])
  const newStation = { id: 'depot', label: 'Depot', station: { row: 2, column: 2, next: [], outcome: 'Dispatch records the arrival.' } }
  model.lanes.push(newStation)
  model.lanes.find((lane: {id: string}) => lane.id === 'lift').station.next.push('depot')
  model.cards.push({ id: 'dispatch', label: 'Dispatcher', laneId: 'depot' })
  await source.fill('{"version":1}')
  await editor.getByRole('button', { name: 'Apply map JSON' }).click()
  await expect(editor.getByRole('alert')).toBeVisible()
  await source.fill(JSON.stringify(model))
  await editor.getByRole('button', { name: 'Apply map JSON' }).click()
  await expect(editor).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Last rider → East stairs' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Last rider → Market St lift' }).click()
  await expect(page.locator('.workshop-outcomes')).toContainText('The lift gives the rider a step-free route.')
  await page.getByRole('button', { name: 'Last rider → Depot' }).click()
  await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Depot')
  await page.reload()
  await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Depot')
  await page.getByRole('button', { name: 'Present', exact: true }).click()
  const player = page.getByRole('region', { name: 'Decision presentation' })
  await expect(player.locator('svg [data-node-id="lane-platform"]').first()).toBeAttached()
  for (let index = 0; index < 4; index++) await player.getByRole('button', { name: 'Next station' }).click()
  await expect(player.getByRole('heading', { name: 'Depot' })).toBeVisible()
  await expect(player.getByText('Dispatch records the arrival.', { exact: true }).last()).toBeVisible()
  await expect(player.getByRole('listitem')).toHaveText(['Last rider', 'Dispatcher'])
  await player.getByRole('button', { name: 'Back to board' }).click()
  await resumeArchivedDraft(page, origin, 'lanes')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/field trials/)
  await resumeArchivedDraft(page, origin, 'map')
  await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Depot')
  if (!['test.slatebox.com', 'localhost', '127.0.0.1'].includes(new URL(origin).hostname)) return

  await page.getByRole('button', { name: 'Open editable canvas' }).click()
  await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/, { timeout: 45000 })
  await expect(page.locator('header').getByText('Private', { exact: true })).toBeVisible()
  await expect(page.locator('#slateCanvas [data-node-id="lane-depot"]').first()).toBeVisible()
  await resumeArchivedDraft(page, origin, 'map')
  await page.getByRole('button', { name: 'Night shift route review' }).click()
  await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Depot')
  await page.getByText('More board options').click()
  await page.getByRole('button', { name: 'Edit map JSON' }).click()
  const restored = JSON.parse(await page.getByLabel('Map JSON').inputValue())
  expect(restored.lanes).toEqual(model.lanes)
  expect(restored.cards).toEqual(model.cards.map((card: { id: string }) => card.id === 'rider' ? { ...card, laneId: 'depot' } : card))
})

test('a phone shows the complete starter map and keeps pointer moves aligned', async ({ page }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true', 'Requires the hosted whiteboard app')
  await page.setViewportSize({ width: 390, height: 760 })
  await resumeArchivedDraft(page, origin, 'map')
  const drawing = page.locator('.workshop-drawing svg').first()
  await expect(drawing).toBeVisible()
  await expect.poll(() => drawing.evaluate(svg =>
    svg.getBoundingClientRect().width <= svg.parentElement!.clientWidth + 1)).toBe(true)
  const token = (await page.locator('#choice-rider rect').boundingBox())!
  const station = (await page.locator('#heading-lift').boundingBox())!
  await page.mouse.move(token.x + 25, token.y + 12)
  await page.mouse.down()
  await page.mouse.move(station.x + 25, station.y + station.height * .7, { steps: 20 })
  await page.mouse.up()
  await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Market St lift')
})
