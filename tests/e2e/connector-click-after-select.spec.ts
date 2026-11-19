import { test, expect, type Page } from '@playwright/test'

// A selected note's connectors can be pressed the moment the note is selected (they are put away
// only once a drag moves). Pressing one creates a connected note and selects it. The click that
// selected the parent is a drag that never moved, and its end is settled a moment later: on a
// slow device that moment came after the new note was selected, and it selected the parent again,
// so the name typed next went to the new note while the parent showed as selected.

async function openBoard(page: Page) {
  await page.goto('/test.html')
  await page.evaluate(async () => {
    const { Slate } = await import('/src/index.ts')
    const host = document.createElement('div')
    host.id = 'board'
    host.style.cssText = 'position:fixed;left:0;top:0;width:900px;height:560px;background:white'
    document.body.replaceChildren(host)
    const w = window as any
    const board = new Slate(host, {
      viewPort: { originalWidth: 900, originalHeight: 560 },
      showBirdsEye: false, showZoom: false, showMultiSelect: false,
      events: {},
    })
    w.board = board
    const root = board.addNode({ id: 'root', x: 140, y: 230, width: 110, height: 64, text: 'Field recording' })
    await root.ready
    await new Promise(resolve => setTimeout(resolve, 250))
  })
}

const selectedIds = (page: Page) => page.evaluate(() => (window as any).board.getSelectedNodes().map((n: any) => n.id))

/** A slow device: the short timers that settle the end of a press run late. */
const slowShortTimers = (page: Page) => page.evaluate(() => {
  const w = window as any
  const original = w.setTimeout.bind(w)
  w.setTimeout = (fn: any, ms?: number, ...rest: any[]) => original(fn, typeof ms === 'number' && ms > 0 && ms <= 20 ? 400 : ms, ...rest)
})

for (const touch of [false, true]) {
  test(`pressing a connector straight after selecting a note leaves the new note selected (${touch ? 'touch' : 'mouse'})`, async ({ browser }) => {
    const context = await browser.newContext(touch ? { hasTouch: true, isMobile: true, viewport: { width: 900, height: 700 } } : { viewport: { width: 900, height: 700 } })
    const page = await context.newPage()
    try {
      await openBoard(page)
      await slowShortTimers(page)
      const box = (await page.locator('[data-node-id="root"]').boundingBox())!
      const at = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
      if (touch) await page.touchscreen.tap(at.x, at.y)
      else await page.mouse.click(at.x, at.y)
      await expect.poll(() => selectedIds(page)).toEqual(['root'])

      // The connector below, as soon as it can be pressed.
      const dot = await (await page.waitForFunction(() => {
        const source = (window as any).board.getNode('root')
        const node = source.connectionHandles?.bottom?.node as SVGCircleElement | undefined
        if (!node || !source.isConnectionHandlesEnabled()) return
        const r = node.getBoundingClientRect()
        if (!r.width) return
        const x = r.left + r.width / 2, y = r.top + r.height / 2
        return document.elementFromPoint(x, y) === node ? { x, y } : undefined
      }, undefined, { polling: 'raf' })).jsonValue() as { x: number; y: number }
      if (touch) await page.touchscreen.tap(dot.x, dot.y)
      else await page.mouse.click(dot.x, dot.y)

      await expect.poll(() => page.evaluate(() => (window as any).board.nodes.allNodes.length)).toBe(2)
      const child = await page.evaluate(() => (window as any).board.nodes.allNodes.find((n: any) => n.id !== 'root').id)
      await page.waitForTimeout(800) // past the late end of the first press
      expect(await selectedIds(page)).toEqual([child])
    } finally {
      await context.close()
    }
  })
}
