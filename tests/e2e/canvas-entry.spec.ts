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
