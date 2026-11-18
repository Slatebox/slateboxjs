import {test, expect} from '@playwright/test'

test('author a print and return destination, then run the same dialog in view-only mode', async ({page}) => {
  await page.goto('/tests/fixtures/focus-darkroom.html')
  await page.getByRole('button', {name: 'Open Silk moth'}).click()
  await page.getByRole('button', {name: 'Rename print'}).click()
  await page.getByLabel('Print name').fill('Night & day')
  await page.getByRole('button', {name: 'Save name'}).click()
  await expect(page.getByRole('dialog', {name: 'Night & day'})).toBeVisible()
  await page.getByRole('button', {name: 'Close viewer'}).click()
  const opener = page.getByRole('button', {name: 'Open Night & day'})
  await expect(opener).toBeFocused()
  await page.getByRole('button', {name: 'Wire first print'}).click()
  await page.getByLabel('View only').check()
  await expect(page.getByRole('button', {name: /Wire/})).toHaveCount(0)
  const point = async (selector: string) => {
    const b = await page.locator(selector).boundingBox()
    return {x: b!.x + b!.width / 2, y: b!.y + b!.height / 2}
  }
  const start = await point('#focus-ring'), end = await point('#opener-jack')
  await page.mouse.move(start.x, start.y)
  await page.mouse.down()
  await page.mouse.move(end.x, end.y, {steps:12})
  await page.mouse.up()
  await expect(page.getByLabel('Return path')).toHaveText('Every viewer returns to the first print.')
  await opener.press('Enter')
  await expect(page.getByRole('dialog', {name:'Night & day'})).toBeVisible()
  await expect(page.getByRole('button', {name:'Rename print'})).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', {name:'Open Fern'})).toBeFocused()
  await expect(page.getByLabel('Focus result')).toHaveText('Focus jumped to Fern. You opened Night & day.')
})
