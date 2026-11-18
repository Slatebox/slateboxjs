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

test('linked budget previews the candidate before release, supports cancel and undo', async ({page}) => {
  await page.goto('/tests/fixtures/workshop.html')
  const budget = page.getByLabel('Quarterly budget')
  const commits = page.getByLabel('Committed decisions')
  await expect(budget).toHaveText('1 of 2 pilots funded')
  async function previewPilot() {
    const card = await page.locator('#choice-sensors').boundingBox()
    const x = card!.x + 25, y = card!.y + 20
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 244, y, { steps: 12 })
    await expect(budget).toHaveText('2 of 2 pilots funded')
    await expect(commits).toHaveText('0')
  }
  await previewPilot()
  await page.keyboard.press('Escape')
  await page.mouse.up()
  await expect(budget).toHaveText('1 of 2 pilots funded')
  await expect(commits).toHaveText('0')
  await previewPilot()
  await page.mouse.up()
  await expect(commits).toHaveText('1')
  await expect(budget).toHaveText('2 of 2 pilots funded')
  await page.getByRole('button', {name: 'Undo decision'}).click()
  await expect(budget).toHaveText('1 of 2 pilots funded')
})

test('touch previews a legal decision, rolls back a cancelled contact, and commits on release', async ({browserName, browser, baseURL}) => {
  test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch and touchcancel events')
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 900, height: 700 } })
  try {
    const page = await context.newPage()
    const device = await context.newCDPSession(page)
    await page.goto('/tests/fixtures/workshop.html')
    const budget = page.getByLabel('Quarterly budget')
    const commits = page.getByLabel('Committed decisions')
    for (const type of ['touchCancel', 'touchEnd'] as const) {
      const bounds = await page.locator('#choice-sensors').boundingBox()
      const x = bounds!.x + 25, y = bounds!.y + 20
      await device.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]})
      for (const dx of [12, 112, 244]) await device.send('Input.dispatchTouchEvent', {
        type: 'touchMove', touchPoints: [{x: x + dx, y}],
      })
      await expect(budget).toHaveText('2 of 2 pilots funded')
      await expect(commits).toHaveText('0')
      await device.send('Input.dispatchTouchEvent', {type, touchPoints: []})
      await expect(budget).toHaveText(type === 'touchCancel' ? '1 of 2 pilots funded' : '2 of 2 pilots funded')
      await expect(commits).toHaveText(type === 'touchCancel' ? '0' : '1')
    }
  } finally { await context.close() }
})

test('removing edit permission discards a pending candidate and disables every input', async ({page}) => {
  await page.goto('/tests/fixtures/workshop.html')
  const budget = page.getByLabel('Quarterly budget')
  const rect = await page.locator('#choice-sensors').boundingBox()
  const x = rect!.x + 25, y = rect!.y + 20
  await page.mouse.move(x, y); await page.mouse.down()
  await page.mouse.move(x + 244, y, {steps: 15})
  await expect(budget).toHaveText('2 of 2 pilots funded')
  // A remote role change can arrive while the pointer stays down.
  await page.getByLabel('View only').evaluate((input: HTMLInputElement) => input.click())
  await expect(budget).toHaveText('1 of 2 pilots funded')
  await page.mouse.up()
  await page.mouse.move(x, y); await page.mouse.down()
  await page.mouse.move(x + 244, y, {steps: 15}); await page.mouse.up()
  await expect(page.getByLabel('Committed decisions')).toHaveText('0')
  await page.locator('summary').click()
  await expect(page.getByLabel('Move Test bearing sensors on line four')).toBeDisabled()

  await page.goto('/tests/fixtures/workshop.html?map')
  await page.getByLabel('View only').check()
  await expect(page.getByRole('button', {name:'Last rider → Market St lift'})).toBeDisabled()
  await expect(page.locator('.workshop-outcomes')).toContainText('Last rider')
})

for (const width of [320, 960]) {
  test(`fitted lanes preserve readable field notes and legal drop targets at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height:900})
    await page.goto('/tests/fixtures/workshop.html?fit')
    const board = page.getByRole('region', {name:'Choose the two recordings for the evening broadcast'})
    const cards = board.locator('g[id^="choice-"]')
    await expect(cards).toHaveCount(3)
    const right = board.locator('#heading-pilot rect')
    await expect.poll(async () => {
      const bounds = await right.boundingBox()
      return (bounds?.x ?? width) + (bounds?.width ?? width)
    }).toBeLessThanOrEqual(width)
    for (const card of await cards.all()) {
      const readable = await card.evaluate(group => {
        const bounds = group.querySelector('rect')!.getBoundingClientRect()
        return [...group.querySelectorAll('text')].every(text => {
          const line = text.getBoundingClientRect()
          return parseFloat(getComputedStyle(text).fontSize) >= 13 &&
            line.left >= bounds.left && line.right <= bounds.right &&
            line.top >= bounds.top && line.bottom <= bounds.bottom
        })
      })
      expect(readable).toBe(true)
    }
    const rain = board.locator('#choice-rain')
    const source = (await rain.boundingBox())!
    const dest = (await right.boundingBox())!
    await page.mouse.move(source.x+20,source.y+20)
    await page.mouse.down()
    await page.mouse.move(dest.x+20,source.y+20,{steps:12})
    await expect(page.getByLabel('Quarterly budget')).toHaveText('1 of 2 pilots funded')
    await page.mouse.up()
    await expect.poll(async () => Math.abs((await rain.boundingBox())!.x-dest.x)).toBeLessThan(1)
    await board.locator('summary').click()
    const train = board.getByRole('combobox', {name:/Move A driver/})
    await train.focus()
    await page.keyboard.press('o')
    await expect(train).toHaveValue('pilot')
    await expect(board.locator('#heading-pilot')).toContainText('2 of 2 slots')
    await expect(board.getByRole('combobox', {name:/Move Birdsong/}).locator('option[value="pilot"]')).toHaveCount(0)
    const bird = (await board.locator('#choice-birds').boundingBox())!
    await page.mouse.move(bird.x+20,bird.y+20)
    await page.mouse.down()
    await page.mouse.move(dest.x+20,bird.y+20,{steps:12})
    await page.mouse.up()
    await expect(page.getByLabel('Committed decisions')).toHaveText('2')
    await expect(board.getByRole('combobox', {name:/Move Birdsong/})).toHaveValue('notes')
  })
}
