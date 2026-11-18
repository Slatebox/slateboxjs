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

test('authored placement outcomes follow held, canceled, committed and undone moves', async ({page}) => {
  await page.goto('/tests/fixtures/workshop.html?signals')
  await page.locator('#choice-sensors').dblclick()
  await expect(page.getByLabel('Selected object')).toHaveText('sensors')
  const state = page.getByRole('region',{name:'Placement outcomes'})
  const commits = page.getByLabel('Committed decisions')
  const ready = 'The instruments are ready.', waiting = 'The instruments are waiting.'
  await expect(state).toContainText(waiting)
  const box = (await page.locator('#choice-sensors').boundingBox())!
  const x=box.x+25, y=box.y+20
  await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+244,y,{steps:12})
  await expect(state).toContainText(ready)
  await expect(commits).toHaveText('0')
  await page.keyboard.press('Escape'); await page.mouse.up()
  await expect(state).toContainText(waiting)
  await page.mouse.move(x,y); await page.mouse.down(); await page.mouse.move(x+244,y,{steps:12}); await page.mouse.up()
  await expect(state).toContainText(ready)
  await expect(commits).toHaveText('1')
  await page.getByRole('button',{name:'Undo decision'}).click()
  await expect(state).toContainText(waiting)
  await page.getByText('Move a card by name').click()
  const select = page.getByRole('combobox').first()
  await select.selectOption('pilot')
  await expect(state).toContainText(ready)
  await page.keyboard.press('Escape')
  await expect(state).toContainText(waiting)
  await select.selectOption('pilot')
  await page.getByRole('button',{name:'Apply move'}).click()
  await expect(state).toContainText(ready)
  await expect(commits).toHaveText('2')
})

test('station headers open their editor from pointer and keyboard while token movement stays independent', async ({page}) => {
  await page.goto('/tests/fixtures/workshop.html?map')
  const selected = page.getByLabel('Selected object')
  const platform = page.getByRole('button', {name:'Edit Last train', exact:true})
  const stairs = page.getByRole('button', {name:'Edit East stairs', exact:true})
  await platform.click()
  await expect(selected).toHaveText('station:platform')
  await stairs.focus()
  await stairs.press('Space')
  await expect(selected).toHaveText('station:stairs')
  await platform.focus()
  await platform.press('Enter')
  await expect(selected).toHaveText('station:platform')
  const card = (await page.locator('#choice-rider').boundingBox())!
  const from = (await platform.boundingBox())!, to = (await stairs.boundingBox())!
  const x = card.x + card.width / 2, y = card.y + card.height / 2
  await page.mouse.move(x, y); await page.mouse.down()
  await page.mouse.move(x + to.x - from.x, y + to.y - from.y, {steps:12}); await page.mouse.up()
  await expect(page.getByLabel('Committed decisions')).toHaveText('1')
  await expect(selected).toHaveText('station:platform')
  await page.getByLabel('View only').check()
  await expect(page.getByRole('button', {name:/^Edit /})).toHaveCount(0)
})

test('a phone tap selects a station without moving its token', async ({browser, baseURL}) => {
  const context = await browser.newContext({baseURL, hasTouch:true, viewport:{width:390,height:844}})
  try {
    const page = await context.newPage()
    await page.goto('/tests/fixtures/workshop.html?map')
    await page.getByRole('button', {name:'Edit Last train', exact:true}).tap()
    await expect(page.getByLabel('Selected object')).toHaveText('station:platform')
    await expect(page.getByLabel('Committed decisions')).toHaveText('0')
  } finally { await context.close() }
})


test('an empty fitted board anchors card creation and lane editing by keyboard or pointer', async ({page}) => {
  await page.setViewportSize({width:320,height:780})
  await page.goto('/tests/fixtures/workshop.html?author')
  await expect(page.locator('summary')).toHaveCount(0)
  const lane = page.getByRole('button',{name:'Edit Lane 2'})
  await lane.press('Space')
  await expect(page.getByLabel('Selected object')).toHaveText('lane:lane-2')
  const add = page.getByRole('button',{name:'Add card to Lane 2'})
  await add.press('Enter')
  await expect(page.locator('#choice-card-1')).toContainText('Wind chimes')
  await page.getByRole('button',{name:'Add card to Lane 1'}).click()
  await expect(page.locator('#choice-card-2')).toContainText('Wind chimes')
  await page.locator('summary').click()
  await expect(page.getByLabel('Move Wind chimes').first()).toHaveValue('lane-2')
  await page.getByLabel('View only').check()
  await expect(add).toHaveCount(0)
  await expect(lane).toHaveCount(0)
})

test('releasing over a forbidden lane cannot commit the adjacent legal lane', async ({page}) => {
  await page.goto('/tests/fixtures/workshop.html')
  await page.locator('summary').click()
  const card = page.getByLabel('Move Measure cooling losses at shift change')
  await expect(card).toHaveValue('evidence')
  const source = (await page.locator('#choice-cooling').boundingBox())!
  const forbidden = (await page.locator('#heading-proposed').boundingBox())!
  await page.mouse.move(source.x + 24, source.y + 20)
  await page.mouse.down()
  await page.mouse.move(forbidden.x + 24, source.y + 20, {steps:20})
  await expect(page.getByLabel('Quarterly budget')).toHaveText('1 of 2 pilots funded')
  await page.mouse.up()
  await expect(card).toHaveValue('evidence')
  await expect(page.getByLabel('Committed decisions')).toHaveText('0')
})
