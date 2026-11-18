import { expect, type Page } from '@playwright/test'

export async function expectWorkshopSlide(page: Page, heading: string, cards: string[], nodeIds: string[]) {
  const presentation = page.getByRole('region', { name: 'Decision presentation' })
  await expect(presentation.getByRole('heading', { name: heading })).toBeVisible()
  await expect(presentation.getByRole('listitem')).toHaveText(cards)
  const surface = presentation.locator('.workshop-slide-art')
  await expect(surface.locator('svg [data-node-id]').first()).toBeAttached()
  await expect.poll(() => surface.evaluate((element, expected) => {
    const graphic = element.querySelector('svg')
    const active = [...graphic!.querySelectorAll<SVGGraphicsElement>('[data-node-id]')]
      .filter(node => Number(getComputedStyle(node).opacity) > 0.95)
    const ids = active.map(node => node.dataset.nodeId).sort()
    if (ids.join('|') !== [...expected].sort().join('|')) return false
    const bounds = element.getBoundingClientRect()
    // Firefox includes the unclipped nested SVG viewport in a group's DOMRect.
    // Measure the painted shape and its label, which must both fit on screen.
    const rects = active.flatMap(node => [...node.querySelectorAll('[data-node-background-path], text')]
      .map(art => art.getBoundingClientRect()))
    if (!active.every(node => node.querySelector('[data-node-background-path]') && node.querySelector('text'))) return false
    if (!rects.every(r => r.width > 2 && r.height > 2 && r.left >= bounds.left - 2 && r.right <= bounds.right + 2 &&
      r.top >= bounds.top - 2 && r.bottom <= bounds.bottom + 2)) return false
    const left = Math.min(...rects.map(r => r.left)), right = Math.max(...rects.map(r => r.right))
    const top = Math.min(...rects.map(r => r.top)), bottom = Math.max(...rects.map(r => r.bottom))
    return Math.abs((left + right - bounds.left - bounds.right) / 2) < 3 && Math.abs((top + bottom - bounds.top - bounds.bottom) / 2) < 3
  }, nodeIds)).toBe(true)
}
