import { expect, test } from '@playwright/test'

test('a trial moves by pointer or keyboard and exports into the native canvas', async ({ page }) => {
  await page.goto('/tests/fixtures/workshop.html')
  await page.locator('summary').click()
  const trial = page.getByLabel('Move Test bearing sensors on line four')
  const box = await page.locator('#choice-sensors').boundingBox()
  expect(box).toBeTruthy()
  const x = box!.x + 25, y = box!.y + 20
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 244, y, { steps: 16 })
  await page.mouse.up()
  await expect(trial).toHaveValue('pilot')
  await expect(page.getByLabel('Move Stage a spare drive at the north mill').locator('option[value=pilot]')).toHaveCount(0)
  await trial.focus()
  await page.keyboard.press('g')
  await expect(trial).toHaveValue('evidence')
  await page.getByRole('button', { name: 'Open in canvas' }).click()
  await expect(page.locator('#slate [data-node-id="card-sensors"]')).toBeVisible()
  await expect(page.locator('#slate [data-node-id="card-sensors"]')).toContainText('bearing')
})
