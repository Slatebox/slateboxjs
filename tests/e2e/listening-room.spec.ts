import {expect, test} from '@playwright/test'

test('the horn previews and commits a continuous mix, with keyboard, cancellation and read-only playback', async ({page}) => {
  await page.setViewportSize({width:390,height:750})
  await page.goto('/tests/fixtures/listening-room.html')
  const stage = page.getByRole('slider',{name:'Listening horn'})
  const svg = stage.locator('svg')
  await expect.poll(async () => (await svg.boundingBox())?.width).toBeLessThan(390)
  const box = (await svg.boundingBox())!
  const x = (world:number) => box.x + world * box.width/640
  const y = box.y + 222 * box.width/640
  const caption = page.getByLabel('Sound caption')
  const saved = page.getByLabel('Saved mix')
  async function grab() {
    await page.mouse.move(x(169), y); await page.mouse.down()
    await page.mouse.move(x(190), y, {steps:4})
    await page.mouse.move(x(336), y, {steps:12})
    await expect(caption).toHaveText('Rain and glass chimes overlap.')
    await expect(saved).toHaveText('0.15')
  }
  await grab()
  await page.keyboard.press('Escape'); await page.mouse.up()
  await expect(caption).toHaveText('Rain ticks on the copper roof.')
  await expect(saved).toHaveText('0.15')
  await grab()
  await page.mouse.move(x(465),y,{steps:10}); await page.mouse.up()
  const committed = Number(await saved.textContent())
  expect(committed).toBeGreaterThan(.7); expect(committed).toBeLessThan(.98)
  await expect(caption).toHaveText('Glass chimes ring, then fade.')
  await stage.press('Home'); await stage.press('ArrowRight')
  await expect(saved).toHaveText('0.01')
  await page.getByRole('button',{name:'Blend both'}).press('Enter')
  await page.getByRole('button',{name:'Rename materials'}).click()
  await expect(caption).toHaveText('Seashells and River bells overlap.')
  await page.getByRole('button',{name:'Listen to River bells'}).click()
  await expect(caption).toHaveText('You hear River bells.')
  await page.getByRole('button',{name:'Toggle read-only'}).click()
  await expect(page.getByRole('button',{name:'Blend both'})).toHaveCount(0)
  await stage.press('Home')
  await expect(saved).toHaveText('1')
  await page.getByRole('button',{name:'Enable sound'}).click()
  await expect(page.getByRole('button',{name:'Mute sound'})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Mute sound'}).click()
  await expect(page.getByRole('button',{name:'Enable sound'})).toHaveAttribute('aria-pressed','false')
})

test('touch moves the horn at a phone width', async ({browser, browserName}) => {
  test.skip(browserName !== 'chromium', 'Touch input uses Chromium DevTools Protocol')
  const context = await browser.newContext({hasTouch:true,viewport:{width:390,height:750}})
  try {
    const page = await context.newPage()
    await page.goto('/tests/fixtures/listening-room.html')
    const svg = page.getByRole('slider').locator('svg')
    await expect.poll(async () => (await svg.boundingBox())?.width).toBeLessThan(390)
    const bounds = (await svg.boundingBox())!
    const cdp = await context.newCDPSession(page)
    const touch = async (type: 'touchStart' | 'touchMove' | 'touchEnd', x?: number) => {
      const touchPoints = x === undefined ? [] : [{x:bounds.x+bounds.width*x/640,y:bounds.y+bounds.width*222/640}]
      await cdp.send('Input.dispatchTouchEvent',{type,touchPoints})
    }
    await touch('touchStart',169); await touch('touchMove',187); await touch('touchMove',315)
    await expect(page.getByLabel('Sound caption')).toHaveText('Rain and glass chimes overlap.')
    await expect(page.getByLabel('Saved mix')).toHaveText('0.15')
    await touch('touchMove',514); await touch('touchEnd')
    await expect(page.getByLabel('Sound caption')).toHaveText('Glass chimes ring, then fade.')
    expect(Number(await page.getByLabel('Saved mix').textContent())).toBeGreaterThan(.68)
  } finally { await context.close() }
})
