import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { canvas, card, note, openConversation, resting, slateKey, storedWorkshop, workshopReady } from './app-native-workshop.shared'

/**
 * Empty notes on boards in the real Meteor app (2026-11-23, owner: "a card needs some words? i thought
 * we fixed this"). An empty note dropped on a hiring plan, a launch plan or a lane board is never
 * refused: it is saved as a card named with the board's word for a new item ("New hire", "New task",
 * "New card"), its name is open for typing, and undo gives the empty note back.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable accounts and slates; local app only.')

const lanes: Workshop = {
  version: 1, title: 'Week plan', lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next' }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }],
}
// The hiring plan is made as the owner made theirs: "Add a hiring plan" in Ask Slatebox on a new slate.
const boards: Array<{ kind: string; path: string; chat?: string; name: string; typed: string }> = [
  { kind: 'hiring plan', path: '/new?empty=1', chat: 'Add a hiring plan', name: 'New hire', typed: 'Ops lead' },
  { kind: 'launch plan', path: '/new/launch-plan', name: 'New task', typed: 'Write docs' },
  { kind: 'lane board', path: '/new/workshop' + encodeWorkshopFragment(lanes), name: 'New card', typed: 'Call Jo' },
]

const centre = (box: { x: number; y: number; width: number; height: number }) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 16 })
  await page.waitForTimeout(80)
  await page.mouse.up()
}
const editor = (page: Page) => page.locator('.sb-inline-editor')
const blankCard = async (page: Page, key: string) => (await storedWorkshop(page, key)).cards.find((item: any) => item.id === 'blank') ?? null

test.use({ viewport: { width: 1440, height: 900 } })

for (const board of boards) {
  test(`${board.kind}: an empty note dropped on it is saved as “${board.name}”, its name open for typing; undo gives the empty note back`, async ({ page }) => {
    let id: string | null = null
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    try {
      await page.goto(new URL(board.path, origin).href)
      await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
      await expect.poll(() => userId(page)).toBeTruthy()
      id = await userId(page)
      await dismissWelcome(page)
      if (board.chat) {
        const panel = await openConversation(page)
        await panel.getByRole('textbox').fill(board.chat)
        await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
        await expect(panel.getByRole('button', { name: 'Keep changes', exact: true })).toBeEnabled({ timeout: 30000 })
        await panel.getByRole('button', { name: 'Keep changes', exact: true }).click()
        // Kept, the board is drawn on the slate (with or without a reload).
        await expect(page.locator('#slateCanvas [data-node-id^="column-"]').first()).toBeVisible({ timeout: 30000 })
        await dismissWelcome(page)
      }
      await workshopReady(page)
      const key = slateKey(page)
      // The page frames the board for its first few seconds; the view is the person's after that.
      await page.waitForTimeout(4000)
      const laneId = await page.evaluate(() => {
        const slate = (window as any).slate.v2
        // The board's first lane, as it is drawn.
        const first = document.querySelector('#slateCanvas [data-node-id^="column-"]')!.getAttribute('data-node-id')!
        const o = slate.nodes.one(first).options
        slate.addNode({ id: 'blank', x: o.x - 260, y: o.y + 20, width: 120, height: 120, text: '', shape: 'ellipse' })
        return String(o.id).slice('column-'.length)
      })
      await page.waitForTimeout(500)
      await page.evaluate(() => (window as any).slate.v2.fitToContent?.())
      await page.waitForTimeout(600)

      await drag(page, centre(await resting(page, 'blank')), centre(await resting(page, 'column-' + laneId)))
      // Saved as a card named for the board, never refused.
      await expect.poll(async () => (await blankCard(page, key))?.label ?? null).toBe(board.name)
      await expect(canvas(page).getByText('needs some words')).toHaveCount(0)
      await expect(card(page, 'blank')).toHaveAttribute('aria-label', new RegExp('^' + board.name + ', in '))
      // The name is open for typing, all selected; left as it is, it stays.
      await expect(editor(page)).toBeVisible()
      await expect(editor(page)).toHaveText(board.name)
      await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(board.name)
      await page.keyboard.press('Escape')
      await expect(editor(page)).toHaveCount(0)
      expect((await blankCard(page, key)).label).toBe(board.name)

      // Undo: the empty note is back, empty and round, and the card is gone from the board.
      await page.mouse.click(5, 300)
      await page.keyboard.press('ControlOrMeta+z')
      await expect.poll(async () => await blankCard(page, key)).toBeNull()
      await expect.poll(async () => (await getSlate(page, key)).nodes.filter((n: any) => n.options.id === 'blank').map((n: any) => [n.options.text, n.options.shape]))
        .toEqual([['', 'ellipse']])
      // Redo: the card again. Typing on it names it.
      await page.keyboard.press('ControlOrMeta+Shift+z')
      await expect.poll(async () => (await blankCard(page, key))?.label ?? null).toBe(board.name)
      const drawn = await resting(page, 'card-blank')
      await page.mouse.dblclick(drawn.x + drawn.width / 2, drawn.y + drawn.height / 2)
      await expect(editor(page)).toBeVisible()
      await page.keyboard.press('ControlOrMeta+a')
      await page.keyboard.type(board.typed)
      await page.keyboard.press('Enter')
      await expect.poll(async () => (await blankCard(page, key))?.label ?? null).toBe(board.typed)
      expect(errors).toEqual([])
      await expect(note(page, 'card-blank')).toHaveCount(1)
    } finally {
      await removeTestGuest(page, id)
    }
  })
}
