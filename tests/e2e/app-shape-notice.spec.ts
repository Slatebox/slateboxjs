import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { note, openConversation, resting, slateKey, storedWorkshop, workshopReady } from './app-native-workshop.shared'

/**
 * Boards S1 (plan 2026-11-22, owner): a diamond dropped on a board becomes the board's card, with a
 * short notice that says so and how to get the diamond back; dragged off, it is a diamond again,
 * with another. A rectangle gets no notice (nothing visible changes), an undo or redo says
 * nothing, the notice is for the eye only (screen readers hear the engine's own sentence), and it
 * sits at the top on a phone. Ask Slatebox keeps 12px between "Add to this slate" and the box.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const board: Workshop = {
  version: 1, title: 'Vendor choice',
  lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'done', label: 'Done' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'todo' }],
}

const notice = (page: Page) => page.locator('[data-shape-notice]')
const marker = 'Drag it off to get its'

async function open(page: Page, path: string) {
  await page.goto(new URL(path, origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  await workshopReady(page)
  return { key: slateKey(page), id: (await userId(page))! }
}

/**
 * Open canvas beside the board: once the page has framed the board, the view is widened so the
 * right half of the screen is empty canvas (a phone's board fills its width otherwise).
 */
async function makeRoom(page: Page) {
  await page.waitForTimeout(4000) // past the page's own framing of a new board
  await page.evaluate(() => {
    const v2 = (window as any).slate.v2
    const boxes = v2.nodes.allNodes.map((n: any) => n.options).filter((o: any) => Number.isFinite(o.x) && Number.isFinite(o.y))
    const left = Math.min(...boxes.map((o: any) => o.x)), top = Math.min(...boxes.map((o: any) => o.y))
    const right = Math.max(...boxes.map((o: any) => o.x + (o.width ?? 0)))
    const width = right - left
    v2.fitToWidth({ x: left - 20, y: top - 20, width: width * 2 + 40, height: 400 }, 0, 1)
  })
  await page.waitForTimeout(400)
}
/** A screen point on open canvas right of everything on the slate, `down` pixels from the top of the board. */
const beside = (page: Page, down = 120) => page.evaluate(down => {
  const boxes = [...document.querySelectorAll('#slateCanvas [data-node-id]')].map(node => node.getBoundingClientRect())
  const right = Math.max(...boxes.map(r => r.right)), top = Math.min(...boxes.map(r => r.top))
  const canvas = document.querySelector('#slateCanvas')!.getBoundingClientRect()
  return { x: Math.min(right + 90, canvas.right - 60), y: Math.max(top, canvas.top + 60) + down }
}, down)

/** A screen point on open canvas under everything on the slate (a plan's bar dragged sideways slides its task). */
const under = (page: Page) => page.evaluate(() => {
  const boxes = [...document.querySelectorAll('#slateCanvas [data-node-id]')].map(node => node.getBoundingClientRect())
  const canvas = document.querySelector('#slateCanvas')!.getBoundingClientRect()
  return { x: Math.min(...boxes.map(r => r.left)) + 120, y: Math.min(Math.max(...boxes.map(r => r.bottom)) + 120, canvas.bottom - 80) }
})

/** A note of this shape on open canvas beside the board, made as a person makes one (double-click, type). */
async function addNote(page: Page, text: string, shape: string | null, down = 120) {
  const spot = await beside(page, down)
  const before = await page.evaluate(() => (window as any).slate.v2.freeNodes().map((n: any) => n.id))
  await page.mouse.dblclick(spot.x, spot.y)
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  const id = await page.evaluate(known => (window as any).slate.v2.freeNodes().map((n: any) => n.id).find((nid: string) => !known.includes(nid)) as string, before)
  expect(id, 'a double-click on open canvas makes a note').toBeTruthy()
  if (shape) {
    // The shape a person picks in the style bar: the note is redrawn as it.
    await page.evaluate(({ id, shape }) => {
      const node = (window as any).slate.v2.nodes.one(id)
      node.options.shape = shape
      node.setShape(shape)
    }, { id, shape })
  }
  await page.waitForTimeout(600)
  return id
}

async function carry(page: Page, id: string, to: { x: number; y: number }) {
  const from = await resting(page, id)
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 14 })
  await page.waitForTimeout(60)
  await page.mouse.up()
}
/** A point in the lane's column, low enough to miss its header and on screen. */
const laneSpot = async (page: Page, laneId: string) => {
  const column = await resting(page, 'column-' + laneId)
  const bottom = Math.min(column.y + column.height, (page.viewportSize()?.height ?? 800) - 60)
  return { x: column.x + column.width / 2, y: Math.max(column.y + 40, bottom - 24) }
}
/** Nothing is said for a while. */
async function quiet(page: Page) {
  await page.waitForTimeout(1500)
  await expect(notice(page)).toHaveCount(0)
}
const shapeOf = (page: Page, id: string) => page.evaluate(nid => (window as any).slate.v2.nodes.one(nid)?.options?.shape ?? null, id)

test.describe('desktop, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('lane board: a diamond becomes a card with a notice and comes back a diamond with another; undo and a rectangle say nothing', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      const owner = await open(page, '/new/workshop' + encodeWorkshopFragment(board))
      id = owner.id
      await makeRoom(page)
      const pick = await addNote(page, 'Pick vendor', 'diamond')
      expect(await shapeOf(page, pick)).toBe('diamond')

      // On: the card is the board's box, and the notice says how to get the diamond back.
      await carry(page, pick, await laneSpot(page, 'doing'))
      await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.find((c: any) => c.id === pick)?.asNote?.shape).toBe('diamond')
      await expect(notice(page)).toBeVisible()
      await expect(notice(page)).toHaveText(/^‘Pick vendor’ is a card now: cards on a board are (rounded )?boxes\. Drag it off to get its diamond back\.$/)
      // For the eye only, at the foot of the canvas on a laptop.
      await expect(notice(page)).toHaveAttribute('aria-hidden', 'true')
      const low = await notice(page).boundingBox()
      expect(low!.y).toBeGreaterThan(900 / 2)
      // The screen reader's sentence is the engine's own, said once.
      await expect(page.locator('#slateCanvas [aria-live]')).toContainText('Pick vendor is now a card in Doing.')
      await expect(notice(page)).toHaveCount(0, { timeout: 8000 })

      // Off: a diamond again, saved as one.
      await carry(page, 'card-' + pick, await beside(page, 260))
      await expect.poll(() => shapeOf(page, pick)).toBe('diamond')
      await expect(notice(page)).toHaveText('‘Pick vendor’ is a diamond again.')
      await expect.poll(async () => (await getSlate(page, owner.key)).nodes.find((n: any) => n.options.id === pick)?.options?.shape).toBe('diamond')
      await expect(notice(page)).toHaveCount(0, { timeout: 8000 })

      // Undo and redo put the trade back without a word.
      await page.mouse.click(5, 300)
      await page.keyboard.press('ControlOrMeta+z')
      await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.some((c: any) => c.id === pick)).toBe(true)
      await quiet(page)
      await page.keyboard.press('ControlOrMeta+Shift+z')
      await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.some((c: any) => c.id === pick)).toBe(false)
      await quiet(page)

      // A rectangle looks the same as a card: nothing to say, either way.
      const plain = await addNote(page, 'Call Sam', 'rectangle', 20)
      await carry(page, plain, await laneSpot(page, 'todo'))
      await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.some((c: any) => c.id === plain)).toBe(true)
      await quiet(page)
    } finally {
      await removeTestGuest(page, id)
    }
  })

  test('launch plan: a diamond becomes a task ("tasks on a plan are bars") and comes back a diamond', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      const owner = await open(page, '/new/launch-plan')
      id = owner.id
      const lane = (await storedWorkshop(page, owner.key)).lanes[0].id as string
      await makeRoom(page)
      const pick = await addNote(page, 'Pick vendor', 'diamond')
      await carry(page, pick, await laneSpot(page, lane))
      await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.find((c: any) => c.id === pick)?.asNote?.shape).toBe('diamond')
      await expect(notice(page)).toHaveText('‘Pick vendor’ is a task now: tasks on a plan are bars. Drag it off to get its diamond back.')
      await expect(notice(page)).toHaveCount(0, { timeout: 8000 })
      await carry(page, 'card-' + pick, await under(page))
      await expect.poll(() => shapeOf(page, pick)).toBe('diamond')
      await expect(notice(page)).toHaveText('‘Pick vendor’ is a diamond again.')
    } finally {
      await removeTestGuest(page, id)
    }
  })

  test('Ask Slatebox: "Add to this slate" sits at least 8px above the message box\'s label', async ({ page }) => {
    let id: string | null = null
    try {
      id = (await open(page, '/new/workshop' + encodeWorkshopFragment(board))).id
      const panel = await openConversation(page)
      const strip = panel.getByRole('group', { name: 'Add to this slate' })
      await expect(strip).toBeVisible()
      const label = panel.locator('label', { hasText: 'Message Slatebox' })
      const [s, l] = [await strip.boundingBox(), await label.boundingBox()]
      expect(s!.y + s!.height + 8).toBeLessThanOrEqual(l!.y)
    } finally {
      await removeTestGuest(page, id)
    }
  })
})

test.describe('a phone, 390 by 844', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the notice sits at the top, clear of the message box and the zoom', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      const owner = await open(page, '/new/workshop' + encodeWorkshopFragment(board))
      id = owner.id
      await makeRoom(page)
      const pick = await addNote(page, 'Pick vendor', 'diamond')
      await carry(page, pick, await laneSpot(page, 'doing'))
      await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.some((c: any) => c.id === pick)).toBe(true)
      await expect(notice(page)).toContainText(marker)
      const at = await notice(page).boundingBox()
      expect(at!.y + at!.height).toBeLessThan(844 / 2)
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      // It is gone after 5 seconds.
      await expect(notice(page)).toHaveCount(0, { timeout: 8000 })
      expect(await note(page, 'card-' + pick).count()).toBe(1)
    } finally {
      await removeTestGuest(page, id)
    }
  })
})
