import { expect, test, type Page } from '@playwright/test'

/**
 * The birdseye's viewport rectangle is the top layer of the minimap: on a
 * workshop slate the lane thumbnails sit under it, never over it, and a press
 * anywhere inside it drags the view even where a lane lies underneath.
 * (Owner report 2026-11-21: the lanes covered the rectangle and blocked it.)
 */

async function open(page: Page) {
  await page.goto('/tests/fixtures/native-workshop.html')
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.waitForFunction(() => (window as any).native.slate.birdsEye?.isEnabled?.() === true)
  // Bring the viewport over the board, then let the minimap's debounced refresh
  // (the path every note change, workshop re-render and remote change takes) run.
  await page.evaluate(async () => {
    const { slate } = (window as any).native
    const lane = slate.nodes.one('column-now').options
    slate.panZoom.pan({ x: lane.x - 40, y: lane.y - 40 })
    slate.notifyNodeChanged()
    await new Promise(resolve => setTimeout(resolve, 700))
  })
}

type Rect = { x: number; y: number; width: number; height: number }

/** Points inside the viewport rectangle that also lie on a lane thumbnail, and what is hit there. */
async function overlap(page: Page) {
  return page.evaluate(() => {
    const be = (window as any).native.slate.birdsEye
    const indicator = be.viewportIndicator.node as SVGElement
    const mini = be.miniCanvas.node as SVGSVGElement
    const r = indicator.getBoundingClientRect()
    const lanes: DOMRect[] = []
    for (const [id, shape] of be.nodeShapes as Map<string, any>) {
      if (String(id).startsWith('column-')) lanes.push((shape.node as SVGElement).getBoundingClientRect())
    }
    const points: { x: number; y: number; hitsIndicator: boolean; hit: string }[] = []
    for (let i = 1; i < 10; i++) {
      for (let j = 1; j < 10; j++) {
        const x = r.x + (r.width * i) / 10
        const y = r.y + (r.height * j) / 10
        if (!lanes.some(l => x > l.x + 1 && x < l.right - 1 && y > l.y + 1 && y < l.bottom - 1)) continue
        const el = document.elementFromPoint(x, y)
        // Only the minimap's own picture is in question: skip spots clipped off the
        // minimap (a phone shrinks its box) or under a separate control laid over it.
        if (!el || !mini.contains(el)) continue
        points.push({ x, y, hitsIndicator: el === indicator, hit: el ? el.tagName + (el === indicator ? '#indicator' : '') : 'none' })
      }
    }
    return { indicator: { x: r.x, y: r.y, width: r.width, height: r.height } as Rect, points, lanes: lanes.length }
  })
}

const pan = (page: Page) => page.evaluate(() => (window as any).native.slate.panZoom.getPan() as { x: number; y: number })
const scale = (page: Page) => page.evaluate(() => (window as any).native.slate.birdsEye.scale as number)

for (const width of [1440, 390]) {
  test.describe(`birdseye viewport is the top layer at ${width}px`, () => {
    test.use({ viewport: { width, height: width > 500 ? 900 : 844 } })

    test('a lane under the viewport rectangle never covers it, and a mouse drag there moves the view', async ({ page }, info) => {
      await open(page)
      const before = await overlap(page)
      expect(before.lanes).toBeGreaterThan(0)
      expect(before.points.length).toBeGreaterThan(0)
      await page.locator('.slateboxjs-birdseye').screenshot({ path: info.outputPath(`birdseye-${width}.png`) })
      // Everywhere a lane lies under the rectangle, the rectangle is what is hit.
      expect(before.points.filter(p => !p.hitsIndicator).map(p => p.hit)).toEqual([])

      // Drag from a spot where a lane lies underneath: the view follows the drag.
      const p = before.points[Math.floor(before.points.length / 2)]
      const start = await pan(page)
      const k = await scale(page)
      await page.mouse.move(p.x, p.y)
      await page.mouse.down()
      await page.mouse.move(p.x + 12, p.y + 6, { steps: 4 })
      await page.mouse.up()
      const end = await pan(page)
      expect(end.x - start.x).toBeCloseTo(12 / k, -1)
      expect(end.y - start.y).toBeCloseTo(6 / k, -1)

      // Still on top after the board changes again (a note added, a re-render).
      await page.evaluate(async () => {
        const { slate } = (window as any).native
        slate.addNode({ id: 'late', x: slate.nodes.one('column-later').options.x + 20, y: slate.nodes.one('column-later').options.y + 60, width: 140, height: 60, text: 'Late' })
        await new Promise(resolve => setTimeout(resolve, 700))
        slate.birdsEye.refresh()
      })
      const after = await overlap(page)
      expect(after.points.filter(q => !q.hitsIndicator).map(q => q.hit)).toEqual([])
    })

    test('a touch drag inside the rectangle over a lane moves the view', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'touch is driven through the Chrome DevTools Protocol')
      await open(page)
      const { points } = await overlap(page)
      expect(points.length).toBeGreaterThan(0)
      const p = points[Math.floor(points.length / 2)]
      const start = await pan(page)
      const k = await scale(page)
      const cdp = await page.context().newCDPSession(page)
      const touch = (type: string, x: number, y: number) =>
        cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] } as any)
      await touch('touchStart', p.x, p.y)
      for (let i = 1; i <= 4; i++) await touch('touchMove', p.x + i * 3, p.y + i * 1.5)
      await touch('touchEnd', p.x + 12, p.y + 6)
      const end = await pan(page)
      expect(end.x - start.x).toBeCloseTo(12 / k, -1)
      expect(end.y - start.y).toBeCloseTo(6 / k, -1)
    })
  })
}
