import { expect, test, type Page } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true })

async function openBoard(page: Page, scale = 0.63) {
  await page.goto('/test.html')
  await page.evaluate(async scale => {
    const {Slate} = await import('/src/index.ts')
    const stage = document.createElement('div')
    stage.style.cssText = `position:fixed;left:10px;top:80px;width:560px;height:430px;transform-origin:top left;transform:scale(${scale});background:white`
    document.body.replaceChildren(stage)
    const slate = new Slate(stage, {
      viewPort: { originalWidth: 560, originalHeight: 430 },
      showZoom: false, showBirdsEye: false, showMultiSelect: false,
      events: {isReadOnly: () => (window as any).readonly === true},
    })
    ;(window as any).touchBoard = slate
    const rain = slate.addNode({id:'rain', x:48, y:34, width:146, height:64, text:'Rain on copper'})
    await rain.ready
  }, scale)
}

async function outsideDot(page: Page, offset = 12) {
  const selected = () => page.evaluate(() => (window as any).touchBoard.getSelectedNodes().map((n:any) => n.id))
  if (!(await selected()).includes('rain')) await page.locator('[data-node-id="rain"]').first().tap()
  await expect.poll(selected).toEqual(['rain'])
  // Hover can keep the previous node's dots visible during the selection change.
  // Wait for the selected node's own plug to settle before using its coordinates.
  const hit = await page.waitForFunction(offset => {
    const source = (window as any).touchBoard.getNode('rain')
    const dot = source.connectionHandles.bottom?.node
    if (!dot || !source.isConnectionHandlesEnabled()) return
    const r = dot.getBoundingClientRect()
    if (!r.width) return
    const x = r.left + r.width / 2 + offset, y = r.top + r.height / 2
    return {x, y, width:r.width, hit:document.elementFromPoint(x,y)?.tagName}
  }, offset)
  const point = await hit.jsonValue()
  expect(point.width / 2).toBeLessThan(Math.abs(offset))
  expect(point.hit).toBe('svg')
  return { x: point.x, y: point.y }
}

async function nameNewChild(page: Page) {
  const child = page.locator('g[data-node-id]:not([data-node-id="rain"])').first()
  await expect(child).toBeVisible()
  await expect(child.locator('text').first()).toHaveText('')
  const id = await child.getAttribute('data-node-id')
  await expect.poll(() => page.evaluate(() => (window as any).touchBoard.getNode('rain').relationships.associations.map((a: any) => a.childId))).toEqual([id])
  await child.tap()
  await child.tap()
  const editor = page.locator('.sb-inline-editor')
  await editor.fill('Whisper cue')
  await editor.press('Enter')
  await expect(child).toHaveAttribute('aria-label', 'Whisper cue')
}

test('off-center touch creates a blank connected child; the same mouse point and read-only touch do not', async ({page}) => {
  await openBoard(page)
  const point = await outsideDot(page)
  const artwork = () => page.evaluate(() => JSON.parse((window as any).touchBoard.exportJSON()).nodes)
  const before = await artwork()
  await page.mouse.click(point.x, point.y)
  expect(await artwork()).toEqual(before)
  const target = await outsideDot(page)
  await page.evaluate(() => { (window as any).readonly = true })
  await page.touchscreen.tap(target.x, target.y)
  expect(await page.evaluate(() => (window as any).touchBoard.getAllNodes().length)).toBe(1)
  await page.evaluate(() => { (window as any).readonly = false })
  const tap = await outsideDot(page)
  await page.touchscreen.tap(tap.x, tap.y)
  await nameNewChild(page)
})

test('at normal scale, adjacent artwork owns its touch and remaining empty space still connects', async ({page}) => {
  await openBoard(page, 1)
  const point = await outsideDot(page)
  // Place a second editable shape directly inside the touch margin, clear of the visible plug.
  await page.evaluate(async ({x,y}) => {
    const slate = (window as any).touchBoard
    const loc = slate.canvas.point(x - 2, y - 10)
    await slate.addNode({id:'neighbor', text:'Nearby note', x:loc.x, y:loc.y, width:90, height:36}).ready
  }, point)
  await page.touchscreen.tap(point.x + 1, point.y)
  await expect.poll(() => page.evaluate(() => (window as any).touchBoard.getSelectedNodes().map((n:any) => n.id))).toEqual(['neighbor'])
  expect(await page.evaluate(() => (window as any).touchBoard.getAllNodes().length)).toBe(2)
  const safe = await outsideDot(page, -12)
  await page.touchscreen.tap(safe.x, safe.y)
  await expect.poll(() => page.evaluate(() => (window as any).touchBoard.getAllNodes().length)).toBe(3)
})

test('off-center touch drag onto empty canvas creates a child at the drop', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'Native touch drag is driven through Chromium input')
  await openBoard(page)
  const {x,y} = await outsideDot(page)
  const session = await page.context().newCDPSession(page)
  const contact = (x: number, y: number) => [{x, y, radiusX: 1, radiusY: 1}]
  await session.send('Input.dispatchTouchEvent', {type:'touchStart', touchPoints:contact(x,y)})
  for (let i = 1; i <= 8; i++) {
    await session.send('Input.dispatchTouchEvent', {type:'touchMove', touchPoints:contact(x+i*13,y+i*12)})
  }
  await session.send('Input.dispatchTouchEvent', {type:'touchEnd', touchPoints:[]})
  const child = page.locator('g[data-node-id]:not([data-node-id="rain"])').first()
  await expect(child).toBeVisible()
  const bounds = (await child.boundingBox())!
  expect(Math.abs(bounds.x + bounds.width/2 - (x+104))).toBeLessThan(4)
  expect(Math.abs(bounds.y + bounds.height/2 - (y+96))).toBeLessThan(4)
  await nameNewChild(page)
})
