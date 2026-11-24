import { test, expect, type Page } from '@playwright/test'

/**
 * slateboxjs/canvas (src/canvas.ts), the entry a page loads first to draw slates (the site's replays, an embed):
 * a read-only slate draws without fetching the parts that wait for a person. The line tool loads when a line is
 * first drawn and the bird's-eye view only when the slate asks for it, and both then work as in the main entry.
 * The dev server serves each source module on its own, so what the page fetched is what the entry needed.
 */
const fetched = (page: Page) => page.evaluate(() => performance.getEntriesByType('resource').map(entry => new URL(entry.name).pathname))
const open = async (page: Page, query = '') => {
  await page.goto('/tests/fixtures/canvas-entry.html' + query)
  await expect(page.locator('body')).toHaveAttribute('data-drawn', 'true', { timeout: 30000 })
  await expect(page.locator('#slate [data-node-id]').first()).toBeVisible()
}

test('a read-only slate draws without the line tool, the overview or the v1 facade', async ({ page }) => {
  await open(page)
  const loaded = await fetched(page)
  expect(loaded.some(path => path.endsWith('/src/core/Slate.ts')), 'the canvas itself loaded').toBe(true)
  for (const part of ['/src/core/LineTool.ts', '/src/core/BirdsEye.ts', '/src/compat-facade.ts', '/src/operations/apply-json.ts']) {
    expect(loaded.filter(path => path.endsWith(part)), part + ' was fetched with a read-only slate').toEqual([])
  }
  expect(await page.evaluate(() => (window as any).slate.birdsEye ?? null)).toBeNull()
})

test('it draws a slate exactly as the main entry does: the same notes, the same lines', async ({ page }) => {
  const drawn = async (query: string) => {
    await open(page, query)
    return page.evaluate(() => {
      const slate = (window as any).slate
      const lines = slate.nodes.allNodes.reduce((sum: number, node: any) => sum + (node.relationships?.associations?.length ?? 0), 0)
      const svg = document.querySelector('#slate svg')!
      return { notes: document.querySelectorAll('#slate [data-node-id]').length, lines, paths: svg.querySelectorAll('path').length, markup: svg.innerHTML.length }
    })
  }
  const main = await drawn('?entry=main'), canvas = await drawn('')
  expect(main.lines, 'the sample slate has lines').toBeGreaterThan(0)
  expect(canvas).toEqual(main)
})

test('the line tool loads on first use on an editable slate, and runs as in the main entry', async ({ page }) => {
  await open(page, '?edit=1')
  expect((await fetched(page)).some(path => path.endsWith('/src/core/LineTool.ts')), 'an editable slate loads the line tool only when a line is drawn').toBe(false)
  const from = await page.evaluate(() => (window as any).slate.nodes.allNodes[0].options.id)
  await page.evaluate(id => { (window as any).drawing = (window as any).slate.startLineFrom(id) }, from)
  await expect.poll(() => page.evaluate(() => (window as any).slate.isDrawingLine())).toBe(true)
  expect((await fetched(page)).some(path => path.endsWith('/src/core/LineTool.ts')), 'the line tool loads when a line is first drawn').toBe(true)
  // The tool is really running: its dashed preview is drawn, and Escape ends it as it always has.
  await expect(page.locator('#slate .line-tool-preview')).toHaveCount(1)
  await page.keyboard.press('Escape')
  expect(await page.evaluate(() => (window as any).drawing)).toEqual({ result: 'cancelled' })
  expect(await page.evaluate(() => (window as any).slate.isDrawingLine())).toBe(false)
  await expect(page.locator('#slate .line-tool-preview')).toHaveCount(0)
})

test('a slate that asks for the bird\'s-eye view gets it, loaded for it', async ({ page }) => {
  await open(page, '?overview=1')
  await expect.poll(() => page.evaluate(() => Boolean((window as any).slate.birdsEye?.isEnabled?.())), { timeout: 10000 }).toBe(true)
  expect((await fetched(page)).some(path => path.endsWith('/src/core/BirdsEye.ts'))).toBe(true)
})

test('a read-only slate never fetches the right-click menu or the video paste; an editable one gets them, and undo and its keys', async ({ page }) => {
  await open(page)
  const readOnly = await fetched(page)
  for (const part of ['/src/core/ContextMenu.ts', '/src/core/MediaInput.ts']) {
    expect(readOnly.filter(path => path.endsWith(part)), part + ' was fetched with a read-only slate').toEqual([])
  }
  // A host listening before the history arrives hears it once it does (onUndoRedo calls at once with the state).
  await page.addInitScript(() => {
    const wait = () => {
      // (window.slate is the page's #slate element until the fixture sets the Slate)
      const slate = (window as any).slate
      if (typeof slate?.onUndoRedo !== 'function') return void setTimeout(wait, 0)
      ;(window as any).heard = []
      ;(window as any).earlyHistory = Boolean(slate.undoRedo)
      slate.onUndoRedo((state: any) => (window as any).heard.push(state.canUndo))
    }
    wait()
  })
  await open(page, '?edit=1')
  await expect.poll(() => page.evaluate(() => {
    const slate = (window as any).slate
    return Boolean(slate.undoRedo && slate.keyboard && slate.contextMenu && slate.mediaInput)
  }), { timeout: 10000 }).toBe(true)
  expect(await page.evaluate(() => (window as any).heard.length), 'the early listener heard the history arrive').toBeGreaterThan(0)
  // A restyle is one step, and Ctrl+Z (the keyboard, fetched as the slate started) takes it back.
  const color = () => page.evaluate(() => (window as any).slate.nodes.allNodes[0].options.backgroundColor)
  const before = await color()
  await page.evaluate(() => {
    const slate = (window as any).slate, id = slate.nodes.allNodes[0].options.id
    const pkgs = [{ type: 'onNodeColorChanged', data: { id, color: '#ff7755' } }]
    slate.collab.invoke(pkgs)
    slate.collab.send(pkgs)
  })
  await expect.poll(() => page.evaluate(() => (window as any).slate.canUndo()), { timeout: 5000 }).toBe(true)
  expect(await color()).not.toEqual(before)
  expect(await page.evaluate(() => (window as any).heard.includes(true)), 'the early listener heard the step').toBe(true)
  await page.mouse.click(5, 5)
  await page.keyboard.press('Control+Z')
  await expect.poll(color).toEqual(before)
})
