import { expect, test, type Page } from '@playwright/test'

/**
 * Empty notes on boards (2026-11-23, owner: "a card needs some words? i thought we fixed this").
 * An empty note dropped on a board is never refused. It becomes a card named with the board's word
 * for a new item ("New hire", "New task", "New card"), its name opens for typing with the words
 * selected, and undo gives the empty note back.
 */

type Fixture = { url: string; api: 'boards' | 'native'; lane: (page: Page) => Promise<string>; name: string; typed: string }
const fixtures: Record<string, Fixture> = {
  'hiring plan': { url: '/tests/fixtures/native-boards.html?board=hiring-plan', api: 'boards', name: 'New hire', typed: 'Ops lead',
    lane: page => page.evaluate(() => (window as any).boards.board.value.lanes[0].id) },
  'launch plan': { url: '/tests/fixtures/native-boards.html?board=launch-plan', api: 'boards', name: 'New task', typed: 'Write docs',
    lane: page => page.evaluate(() => (window as any).boards.board.value.lanes[0].id) },
  'lane board': { url: '/tests/fixtures/native-workshop.html', api: 'native', name: 'New card', typed: 'Call Jo', lane: async () => 'now' },
}

const box = (page: Page, api: string, id: string) =>
  page.evaluate(([api, key]) => (window as any)[api].box(key), [api, id]) as Promise<{ x: number; y: number; width: number; height: number } | null>
const center = async (page: Page, api: string, id: string) => { const b = (await box(page, api, id))!; return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }
const card = (page: Page, api: string) =>
  page.evaluate(api => (window as any)[api].board.value.cards.find((item: any) => item.id === 'blank') ?? null, api)
const note = (page: Page, api: string) => page.evaluate(api => {
  const node = (window as any)[api].slate.nodes.one('blank')
  return node ? { text: node.options.text, shape: node.options.shape } : null
}, api)
const editor = (page: Page) => page.locator('.sb-inline-editor')

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 14 })
  await page.waitForTimeout(60)
  await page.mouse.up()
}

async function openWithEmptyNote(page: Page, f: Fixture) {
  await page.goto(f.url)
  await page.waitForFunction(api => (window as any)[api]?.ready === true, f.api)
  await page.evaluate(api => {
    const { board, slate } = (window as any)[api]
    const origin = board.origin ?? { x: 0, y: 0 }
    const bounds = board.bounds
    slate.addNode({ id: 'blank', x: origin.x + 40, y: origin.y + bounds.height + 60, width: 120, height: 120, text: '', shape: 'ellipse' })
    slate.fitToWidth({ x: bounds.x ?? origin.x, y: bounds.y ?? origin.y, width: bounds.width, height: bounds.height + 240 })
  }, f.api)
  await page.waitForTimeout(300)
}

for (const [kind, f] of Object.entries(fixtures)) {
  test.describe(kind, () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    test(`an empty note dropped on a ${kind} is "${f.name}", its name open for typing; undo gives the empty note back`, async ({ page }) => {
      await openWithEmptyNote(page, f)
      const lane = await f.lane(page)
      await drag(page, await center(page, f.api, 'blank'), await center(page, f.api, 'column-' + lane))
      // Never refused: a card, named for the board.
      await expect.poll(() => card(page, f.api).then(item => item?.label ?? null)).toBe(f.name)
      expect((await card(page, f.api)).laneId).toBe(lane)
      expect(await page.locator('body').innerText()).not.toContain('needs some words')
      // Its name is open for typing, all selected, so the person just types.
      await expect(editor(page)).toBeVisible()
      await expect(editor(page)).toHaveText(f.name)
      await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(f.name)
      // Left as it is, the name stays.
      await page.keyboard.press('Escape')
      await expect(editor(page)).toHaveCount(0)
      expect((await card(page, f.api)).label).toBe(f.name)

      // Undo: the empty note is back, empty, in its own shape. Redo makes the card again.
      await page.mouse.click(5, 5)
      await page.keyboard.press('ControlOrMeta+z')
      await expect.poll(() => card(page, f.api)).toBeNull()
      await expect.poll(() => note(page, f.api)).toEqual({ text: '', shape: 'ellipse' })
      await page.keyboard.press('ControlOrMeta+y')
      await expect.poll(() => card(page, f.api).then(item => item?.label ?? null)).toBe(f.name)
    })

    test(`on a ${kind}, typing names the new card straight away`, async ({ page }) => {
      await openWithEmptyNote(page, f)
      const lane = await f.lane(page)
      await drag(page, await center(page, f.api, 'blank'), await center(page, f.api, 'column-' + lane))
      await expect(editor(page)).toBeVisible()
      await page.keyboard.type(f.typed)
      await page.keyboard.press('Enter')
      await expect.poll(() => card(page, f.api).then(item => item?.label ?? null)).toBe(f.typed)
    })

    test(`on a ${kind}, a name left as it is stays, and dragged off the card is an empty note in its shape`, async ({ page }) => {
      await openWithEmptyNote(page, f)
      const lane = await f.lane(page)
      await drag(page, await center(page, f.api, 'blank'), await center(page, f.api, 'column-' + lane))
      await expect(editor(page)).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(editor(page)).toHaveCount(0)
      expect((await card(page, f.api)).label).toBe(f.name)
      await page.waitForTimeout(400)
      // Dragged off unchanged: an empty note again, in its shape.
      const out = await page.evaluate(api => {
        const { board, slate } = (window as any)[api]
        const origin = board.origin ?? { x: 0, y: 0 }
        return slate.worldToClient({ x: origin.x + 300, y: origin.y + board.bounds.height + 150 })
      }, f.api)
      await drag(page, await center(page, f.api, 'card-blank'), out)
      await expect.poll(() => card(page, f.api)).toBeNull()
      await expect.poll(() => note(page, f.api)).toEqual({ text: '', shape: 'ellipse' })
    })
  })
}
