import { expect, test, type Page } from '@playwright/test'

/**
 * Boards S2b (owner addenda, 2026-11-22) on a map, with the engine alone:
 * 1. Notes ALWAYS convert: a note dropped on a station is a card there; the paths never constrain it (the token
 *    stays the only piece they do); off the map it is the note again. A board that truly keeps its own cards
 *    says so on the board.
 * 2. A map's paths are fixed outside focus (no grips; a click picks the path, for the host's "Change this
 *    board"); in focus a click removes one, a step's grip draws one, a path's end grip moves it. One change each.
 *
 * Fixture (tests/fixtures/native-workshop.html?map): Refund request → Finance approves → Issue refund, a token
 * at Refund request, and the ordinary note "plain".
 */

async function open(page: Page, kind = 'map') {
  await page.goto('/tests/fixtures/native-workshop.html?' + kind)
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.waitForTimeout(150)
}
const box = (page: Page, id: string) => page.evaluate(key => (window as any).native.box(key), id) as Promise<{ x: number; y: number; width: number; height: number } | null>
const cards = (page: Page) => page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId + (c.free ? '(free)' : '')).join(' ') as string)
const paths = (page: Page) => page.evaluate(() => (window as any).native.board.value.lanes.flatMap((l: any) => l.station.next.map((n: string) => l.id + '>' + n)).join(' ') as string)
const live = (page: Page) => page.locator('#slate [aria-live]')
async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column!.x + column!.width / 2, y: column!.y + column!.height * 0.8 }
}
async function drag(page: Page, id: string, to: { x: number; y: number }) {
  const from = await resting(page, id)
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
  await page.mouse.up()
}
/** A point a third of the way along a path's hit area, on screen (its far end holds the path's end grip in focus). */
async function onPath(page: Page, key: string) {
  return page.locator(`#slate [data-board-link="${key}"]`).evaluate(el => {
    const path = el as SVGPathElement
    const at = path.getPointAtLength(path.getTotalLength() / 3)
    const p = new DOMPoint(at.x, at.y).matrixTransform(path.getScreenCTM()!)
    return { x: p.x, y: p.y }
  })
}
async function resting(page: Page, id: string) {
  let last = await box(page, id)
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100)
    const next = await box(page, id)
    if (last && next && Math.abs(next.x - last.x) < 0.5 && Math.abs(next.y - last.y) < 0.5) return next
    last = next
  }
  throw new Error(id + ' never came to rest')
}

test('a note dropped on a station is a card there; it goes to any station; the token still follows the paths; off the map it is the note', async ({ page }) => {
  await open(page)
  await drag(page, 'plain', await inLane(page, 'finance'))
  await expect.poll(() => cards(page)).toBe('token@request plain@finance(free)')
  await expect(live(page)).toContainText('is now a card in Finance approves')
  // Issue refund is not on a path from Finance approves for the token; the card goes there all the same.
  await page.waitForTimeout(400)
  await drag(page, 'card-plain', await inLane(page, 'request'))
  await expect.poll(() => cards(page)).toBe('token@request plain@request(free)')
  // The token: Issue refund can't be reached from Refund request.
  await drag(page, 'card-token', await inLane(page, 'refund'))
  await page.waitForTimeout(400)
  expect(await cards(page)).toBe('token@request plain@request(free)')
  // Off the map: the note again, with its shape.
  await drag(page, 'card-plain', { x: 40, y: 40 })
  await expect.poll(() => cards(page)).toBe('token@request')
  await expect.poll(() => page.evaluate(() => (window as any).native.slate.nodes.one('plain')?.options.shape)).toBe('roundedrectangle')
  // The token never leaves.
  await drag(page, 'card-token', { x: 40, y: 400 })
  await expect(live(page)).toContainText('The token stays on the map.')
  expect(await cards(page)).toBe('token@request')
})

test('a startup experience that keeps its own cards says so on the board: the note is never silently ignored', async ({ page }) => {
  await open(page, 'interview')
  await drag(page, 'plain', await inLane(page, 'interviews'))
  await expect(live(page)).toContainText('This workshop keeps the cards it came with: its cards are its interviews.')
  expect(await page.evaluate(() => (window as any).native.log.refusals.at(-1).reason)).toMatch(/^This workshop keeps the cards it came with/)
  await expect.poll(() => page.evaluate(() => (window as any).native.slate.nodes.one('caption-interviews')?.options.text)).toContain('keeps the cards it came with')
})

test('a map’s paths are fixed outside focus and picked by a click; in focus a click removes one, a grip draws one, an end grip moves one', async ({ page }) => {
  await open(page)
  const log = () => page.evaluate(() => (window as any).native.log)
  // Outside focus: no grips, and a click on a path picks it (the host offers "Change this board").
  await expect(page.locator('#slate [data-node-id^="handle-_"]')).toHaveCount(0)
  const first = await onPath(page, 'request>finance')
  await page.mouse.click(first.x, first.y)
  await expect.poll(async () => (await log()).selections.at(-1)).toEqual({ path: { from: 'request', to: 'finance' } })
  expect(await paths(page)).toBe('request>finance finance>refund')
  await expect(live(page)).toContainText('change this board to edit them')
  // A click on empty canvas ends the pick.
  await page.mouse.click(30, 700)
  await expect.poll(async () => (await log()).selections.at(-1)).toBeNull()

  // In focus: the grips, and a click on a path removes it, as one change of the path edits.
  await page.evaluate(() => (window as any).native.board.setFocused(true))
  await expect(page.locator('#slate [data-node-id="handle-_link-refund"]')).toBeVisible()
  await expect(page.locator('#slate [data-node-id="handle-_route-request~finance"]')).toBeVisible()
  const remove = await onPath(page, 'finance>refund')
  await page.mouse.click(remove.x, remove.y)
  await expect.poll(() => paths(page)).toBe('request>finance')
  expect((await log()).changes.at(-1).change.edits).toEqual([{ kind: 'disconnect_stations', from: { id: 'finance' }, to: { id: 'refund' } }])

  // A step's grip dropped on another step opens a path there.
  await page.waitForTimeout(300)
  await drag(page, 'handle-_link-refund', await inLane(page, 'request'))
  await expect.poll(() => paths(page)).toBe('request>finance refund>request')
  expect((await log()).changes.at(-1).change.edits).toEqual([{ kind: 'connect_stations', from: { id: 'refund' }, to: { id: 'request' } }])

  // A path's end grip dropped on another step moves the path there: one change.
  await page.waitForTimeout(300)
  await drag(page, 'handle-_route-request~finance', await inLane(page, 'refund'))
  await expect.poll(() => paths(page)).toBe('request>refund refund>request')
  expect((await log()).changes.at(-1).change.edits).toEqual([
    { kind: 'disconnect_stations', from: { id: 'request' }, to: { id: 'finance' } }, { kind: 'connect_stations', from: { id: 'request' }, to: { id: 'refund' } }])

  // A grip dropped where the map can't take it holds and says why; nothing changes.
  await page.waitForTimeout(300)
  await drag(page, 'handle-_link-request', await inLane(page, 'refund'))
  await expect(live(page)).toContainText('Refund request already leads to Issue refund.')
  expect(await paths(page)).toBe('request>refund refund>request')

  // Out of focus again: the grips go, and the paths are fixed.
  await page.evaluate(() => (window as any).native.board.setFocused(false))
  await expect(page.locator('#slate [data-node-id^="handle-_"]')).toHaveCount(0)
  await expect(page.locator('#slate [data-board-link="request>refund"]')).toHaveAttribute('data-board-pick', '')
})
