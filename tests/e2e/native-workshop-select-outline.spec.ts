import { expect, test, type Page } from '@playwright/test'

/**
 * The selection outline surrounds what is selected, wherever it now rests. A note dropped on
 * a lane becomes a card that glides into its slot and is selected on the way: its outline
 * comes to rest with it, the size of the card, and it is the same selection a card clicked
 * directly has (an outline, no resize or rotate handles). A card taken off the lanes is a
 * note with a note's outline and handles. Undo, redo, a group drop, and someone else
 * trading the note this person has selected never leave an outline round empty canvas.
 *
 * Fixture (tests/fixtures/native-workshop.html): the ordinary note "plain" beside lanes Now
 * and Later; Later holds one card; Alpha, Beta and Gamma start in Now, and Gamma may never
 * leave it.
 */

const shots = process.env.SELECT_OUTLINE_SHOTS

type Box = { x: number; y: number; width: number; height: number }

async function open(page: Page, query = '') {
  await page.goto('/tests/fixtures/native-workshop.html' + query)
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.waitForTimeout(150)
}

const box = (page: Page, id: string) =>
  page.evaluate(key => (window as any).native.box(key) as Box | null, id)
const cards = (page: Page) =>
  page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string)
const selected = (page: Page) =>
  page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id) as string[])
const client = (page: Page, world: { x: number; y: number }) =>
  page.evaluate(point => (window as any).native.slate.worldToClient(point) as { x: number; y: number }, world)

/** Every painted selection outline on the slate: the single-note outline and the group box. */
const outlines = (page: Page) => page.evaluate(() =>
  [...document.querySelectorAll('#slate .svg_select_shape, #slate rect[stroke-dasharray="5,5"], #slate rect[stroke-dasharray="5 5"]')]
    .filter(el => (el as SVGGraphicsElement).getBoundingClientRect().width > 0)
    .map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height } }))
/** How many resize and rotate handles are showing. */
const handles = (page: Page) => page.evaluate(() =>
  [...document.querySelectorAll('#slate .svg_select_handle, #slate .svg_select_handle_rot')]
    .filter(el => (el as HTMLElement).style.display !== 'none' && (el as SVGGraphicsElement).getBoundingClientRect().width > 0).length)

async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column!.x + column!.width / 2, y: column!.y + column!.height * 0.85 }
}

async function drag(page: Page, id: string, to: { x: number; y: number }) {
  const from = await box(page, id)
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
  await page.mouse.up()
}

/** The box of a note once it has stopped moving (two equal readings a tenth of a second apart). */
async function resting(page: Page, id: string) {
  let last = await box(page, id)
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100)
    const next = await box(page, id)
    if (last && next && Math.abs(next.x - last.x) < 0.01 && Math.abs(next.y - last.y) < 0.01) return next
    last = next
  }
  throw new Error(id + ' never came to rest')
}

/** The one outline showing lines up with `id`'s box, to within a few pixels on every side. */
async function outlineFits(page: Page, id: string) {
  const at = await resting(page, id)
  // Long enough for anything that would put the outline right to have run.
  await page.waitForTimeout(250)
  const shown = await outlines(page)
  expect(shown, 'one outline is showing').toHaveLength(1)
  const [outline] = shown
  for (const side of ['x', 'y', 'width', 'height'] as const) {
    expect(Math.abs(outline[side] - at![side]), `outline ${side} ${outline[side]} vs ${id} ${at![side]}`).toBeLessThan(4)
  }
}

/** No outline is left showing anywhere but round what is selected. */
async function noStrandedOutline(page: Page) {
  await page.waitForTimeout(400)
  const ids = await selected(page)
  // Nothing that has left the slate is still selected.
  for (const id of ids) expect(await box(page, id), id + ' is selected but is not on the slate').not.toBeNull()
  if (ids.length === 1) return outlineFits(page, ids[0])
  if (ids.length === 0) expect(await outlines(page)).toEqual([])
}

/** At a phone's width the board is fitted to the screen: put the ordinary note just under it, on screen. */
async function plainUnderBoard(page: Page) {
  await page.evaluate(() => {
    const { slate, board } = (window as any).native
    const b = board.bounds
    slate.nodes.one('plain').position(b.x + 10, b.y + b.height + 40)
  })
  await page.waitForTimeout(100)
}

for (const view of [{ name: 'desktop', width: 1440, height: 900, query: '' }, { name: 'phone', width: 390, height: 844, query: '?fitwidth' }]) {
  test.describe(`at ${view.width} wide`, () => {
    test.use({ viewport: { width: view.width, height: view.height } })

    test('a note dropped on a lane is a card whose outline rests round the card, as when a card is clicked', async ({ page }) => {
      await open(page, view.query)
      if (view.query) await plainUnderBoard(page)
      await drag(page, 'plain', await inLane(page, 'now'))
      await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
      await expect.poll(() => selected(page)).toEqual(['card-plain'])
      await outlineFits(page, 'card-plain')
      const afterDrop = await handles(page)
      if (shots) await page.screenshot({ path: `${shots}/${view.name}-${view.width}-note-to-card.png` })

      // The same selection a card has when it is clicked directly.
      await page.mouse.click(5, 5)
      await expect.poll(() => selected(page)).toEqual([])
      await page.locator('#slate [data-node-id="card-alpha"]').click()
      await expect.poll(() => selected(page)).toEqual(['card-alpha'])
      await outlineFits(page, 'card-alpha')
      expect(afterDrop).toBe(await handles(page))
    })
  })
}

test.describe('at 1440 wide', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('a card taken off the lanes is a note with a note\'s outline and handles, round the note', async ({ page }) => {
    await open(page)
    await drag(page, 'card-alpha', await client(page, { x: 60, y: 420 }))
    await expect.poll(() => cards(page)).toBe('beta@now gamma@now')
    await expect.poll(() => selected(page)).toEqual(['alpha'])
    await outlineFits(page, 'alpha')
    expect(await handles(page)).toBeGreaterThan(0)
    if (shots) await page.screenshot({ path: `${shots}/desktop-1440-card-to-note.png` })
  })

  test('undo and redo of a trade leave no outline round empty canvas', async ({ page }) => {
    await open(page)
    await page.waitForTimeout(700)
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await outlineFits(page, 'card-plain')
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    await noStrandedOutline(page)
    await page.keyboard.press('ControlOrMeta+y')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await noStrandedOutline(page)
  })

  test('several notes dropped on a lane together: the card selected has its outline round it', async ({ page }) => {
    await open(page, '?defaultnote')
    await page.evaluate(() => {
      const { slate } = (window as any).native
      slate.selectNodes([slate.nodes.one('plain'), slate.nodes.one('default')])
    })
    await expect.poll(() => selected(page)).toEqual(['plain', 'default'])
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now default@now')
    await expect.poll(() => selected(page)).toEqual(['card-plain'])
    await outlineFits(page, 'card-plain')
    await resting(page, 'card-default')
    if (shots) await page.screenshot({ path: `${shots}/desktop-1440-group-drop.png` })
  })

  test('someone else makes the selected note a card: no outline is left where the note was', async ({ page }) => {
    await open(page)
    await page.locator('#slate [data-node-id="plain"]').click()
    await expect.poll(() => selected(page)).toEqual(['plain'])
    await outlineFits(page, 'plain')
    // What this screen hears of their trade: the note left the drawing, and the board has the card.
    await page.evaluate(async () => {
      const { slate, board } = (window as any).native
      await slate.collab.handleRemotePackage({ type: 'onNodeDeleted', data: { id: 'plain', isComment: false } })
      const value = board.value
      board.update({ ...value, cards: [...value.cards, { id: 'plain', label: 'Ordinary note', laneId: 'now' }] })
    })
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await resting(page, 'card-plain')
    await noStrandedOutline(page)
  })
})
