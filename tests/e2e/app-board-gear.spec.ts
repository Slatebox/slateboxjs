import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { closeConversation, conversation, finger, messageBox, note, openConversation, resting, slateKey, starter, storedWorkshop, workshopReady } from './app-native-workshop.shared'

/**
 * Boards S2a (plan 2026-11-22, owner): "Change this board" puts the whole board in focus for the
 * chat. On a laptop a gear appears over the board while the pointer is on it; on a phone (and from
 * the keyboard) selecting a lane's header, caption or column shows a bar with it; Ask Slatebox
 * offers it as a starter. Focus opens the chat with "Editing: <title> ×", fits the view to the
 * board once the panel has settled, offers the board's own suggestions with a concrete example in
 * the message box, and stays on the board while a preview waits for Keep or Discard.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const board: Workshop = {
  version: 1, title: 'Vendor choice',
  lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'review', label: 'Review' }, { id: 'done', label: 'Done' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'todo' }, { id: 'beta', label: 'Beta', laneId: 'doing' }, { id: 'gamma', label: 'Gamma', laneId: 'doing' }],
}

const gear = (page: Page) => page.locator('[data-board-gear]')
const focusChip = (page: Page) => conversation(page).locator('[data-board-focus]')
const marker = 'Change this board'

async function open(page: Page) {
  await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(board), origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  await workshopReady(page)
  await page.waitForTimeout(4000) // past the page's own framing of a new board
  return { key: slateKey(page), id: (await userId(page))! }
}

/** The board's box on screen (its lanes' columns and headers), and the canvas's. */
const onScreen = (page: Page) => page.evaluate(() => {
  const rects = [...document.querySelectorAll('#slateCanvas [data-node-id^="column-"], #slateCanvas [data-node-id^="lane-"]')].map(n => n.getBoundingClientRect())
  const area = document.querySelector('#slateCanvas')!.getBoundingClientRect()
  return {
    board: { left: Math.min(...rects.map(r => r.left)), top: Math.min(...rects.map(r => r.top)), right: Math.max(...rects.map(r => r.right)), bottom: Math.max(...rects.map(r => r.bottom)) },
    canvas: { left: area.left, top: area.top, right: area.right, bottom: area.bottom },
  }
})
const focusedMark = (page: Page) => page.evaluate(() => document.querySelector('#slateCanvas [data-node-id="lane-todo"]')?.hasAttribute('data-workshop-focused') ?? null)
/**
 * Board polish (test 18): the focus frame drawn round the board in focus ("Editing", "Done"), in screen pixels from
 * each edge of what the canvas shows (beside an open chat, its left edge), and whether the canvas dims the rest.
 */
const focusFrame = (page: Page) => page.evaluate(() => {
  const frame = document.querySelector('#slateCanvas [data-board-layer="focus-frame"]')?.getBoundingClientRect()
  const canvas = document.querySelector('#slateCanvas')!
  const area = canvas.getBoundingClientRect()
  const panel = document.querySelector('aside[aria-label="Ask Slatebox"]')?.getBoundingClientRect()
  const right = panel && panel.left > area.left + 100 ? Math.min(area.right, panel.left) : area.right
  const bottom = panel && panel.top > area.top + 100 && panel.left <= area.left + 1 ? Math.min(area.bottom, panel.top) : area.bottom
  return { dims: canvas.classList.contains('focusing'), frame: frame ? { left: frame.left - area.left, top: frame.top - area.top, right: right - frame.right, bottom: bottom - frame.bottom } : null }
})

test.describe('desktop, 1440 by 900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('the gear shows over the board on hover; it opens the chat about the board, fitted; a column is added with Keep; × leaves focus', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      const owner = await open(page)
      id = owner.id
      await closeConversation(page)
      await expect(gear(page)).toHaveCount(0)

      // Over the board: the gear, just above its top-right corner.
      const column = await resting(page, 'column-doing')
      await page.mouse.move(column.x + column.width / 2, column.y + column.height / 2, { steps: 4 })
      await expect(gear(page)).toBeVisible()
      await expect(gear(page)).toHaveAttribute('aria-label', marker)
      const chip = (await gear(page).boundingBox())!
      const seen = await onScreen(page)
      expect(chip.y + chip.height).toBeLessThanOrEqual(seen.board.top + 1)
      expect(Math.abs(chip.x + chip.width - seen.board.right)).toBeLessThan(40)
      // The band above the board keeps it while the pointer travels to it; far away it goes.
      await page.mouse.move(chip.x + chip.width / 2, seen.board.top - 20, { steps: 4 })
      await page.waitForTimeout(800)
      await expect(gear(page)).toBeVisible()
      await page.mouse.move(seen.canvas.left + 10, seen.canvas.bottom - 10, { steps: 4 })
      await expect(gear(page)).toHaveCount(0, { timeout: 3000 })

      // Click: the chat opens about the board, the view is fitted to it once the panel has settled.
      await page.mouse.move(column.x + column.width / 2, column.y + column.height / 2, { steps: 4 })
      await gear(page).click()
      await expect(conversation(page)).toBeVisible()
      await expect(focusChip(page)).toContainText('Editing: Vendor choice')
      await expect.poll(() => focusedMark(page)).toBe(true)
      await expect(starter(page, 'Add a column called Blocked')).toBeVisible()
      await expect(starter(page, 'What else can this board do?')).toBeVisible()
      await expect(messageBox(page)).toHaveAttribute('placeholder', 'Add a column called Blocked')
      await page.waitForTimeout(1500)
      const fitted = await onScreen(page)
      expect(fitted.board.left).toBeGreaterThanOrEqual(fitted.canvas.left - 1)
      expect(fitted.board.right).toBeLessThanOrEqual(fitted.canvas.right + 1)
      expect(fitted.board.top).toBeGreaterThanOrEqual(fitted.canvas.top - 1)
      const panel = (await conversation(page).boundingBox())!
      expect(fitted.board.right).toBeLessThanOrEqual(panel.x + 1)
      // The board in focus is framed (Editing, Done) with room to spare on every side, and the rest of the canvas is dimmed.
      const framed = await focusFrame(page)
      expect(framed.dims).toBe(true)
      expect(framed.frame).not.toBeNull()
      for (const side of ['left', 'top', 'right', 'bottom'] as const) expect([side, framed.frame![side] >= 24]).toEqual([side, true])
      await expect(page.locator('#slateCanvas [data-board-layer="focus-done-box"]')).toHaveAttribute('role', 'button')

      // Clicking empty canvas keeps focus, so a person can look around.
      await page.mouse.click(fitted.canvas.left + 8, fitted.canvas.bottom - 40)
      await expect(focusChip(page)).toContainText('Editing: Vendor choice')

      // "add a column called Blocked": a preview, focus held while it waits, then Keep: five columns.
      await messageBox(page).fill('add a column called Blocked')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      await expect(conversation(page).getByRole('button', { name: 'Keep changes', exact: true })).toBeEnabled()
      await expect(conversation(page).getByRole('button', { name: 'Stop editing this board' })).toBeDisabled()
      await expect(focusChip(page)).toContainText('Editing: Vendor choice')
      await conversation(page).getByRole('button', { name: 'Keep changes', exact: true }).click()
      await expect.poll(async () => (await storedWorkshop(page, owner.key)).lanes.map((lane: any) => lane.label))
        .toEqual(['To do', 'Doing', 'Review', 'Done', 'Blocked'])

      // ×: focus leaves; the board's mark goes, the starter is back.
      await conversation(page).getByRole('button', { name: 'Stop editing this board' }).click()
      await expect(focusChip(page)).toHaveCount(0)
      await expect.poll(() => focusedMark(page)).toBe(false)
      await expect(starter(page, marker)).toBeVisible()
    } finally {
      await removeTestGuest(page, id)
    }
  })

  test('Ask Slatebox offers "Change this board"; closing the chat leaves focus, but not while a preview waits', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      id = (await open(page)).id
      await openConversation(page)
      await starter(page, marker).click()
      await expect(focusChip(page)).toContainText('Editing: Vendor choice')
      // What else can this board do? answers in place, from the board's own phrases.
      await starter(page, 'What else can this board do?').click()
      await expect(conversation(page).getByRole('log', { name: 'Conversation' })).toContainText('Here is what this board can do.')
      // A preview waiting keeps focus through a close; Discard, then close: focus is gone.
      await messageBox(page).fill('rename this to Vendor shortlist')
      await conversation(page).getByRole('button', { name: 'Preview changes', exact: true }).click()
      await expect(conversation(page).getByRole('button', { name: 'Keep changes', exact: true })).toBeEnabled()
      await conversation(page).getByRole('button', { name: 'Close conversation', exact: true }).click()
      await expect.poll(() => focusedMark(page)).toBe(true)
      await page.getByRole('button', { name: 'Ask Slatebox', exact: true }).click()
      await expect(focusChip(page)).toContainText('Editing: Vendor choice')
      await conversation(page).getByRole('button', { name: 'Discard preview', exact: true }).click()
      await conversation(page).getByRole('button', { name: 'Close conversation', exact: true }).click()
      await expect.poll(() => focusedMark(page)).toBe(false)
    } finally {
      await removeTestGuest(page, id)
    }
  })
})

test.describe('a phone, 390 by 844, touch', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('a tap on a lane header shows the board\'s bar; "Change this board" opens the chat about the board; no hover gear', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      id = (await open(page)).id
      if (await conversation(page).isVisible()) await closeConversation(page)
      const hand = await finger(page)
      const header = await resting(page, 'lane-doing')
      const at = { x: header.x + header.width / 2, y: header.y + header.height / 2 }
      await hand.touch('touchStart', [at])
      await hand.touch('touchEnd', [])
      const bar = page.getByRole('toolbar', { name: 'Board: Vendor choice' })
      await expect(bar).toBeVisible()
      await expect(gear(page)).toHaveCount(0)
      await bar.getByRole('button', { name: marker }).click()
      await expect(conversation(page)).toBeVisible()
      await expect(focusChip(page)).toContainText('Editing: Vendor choice')
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
      // The frame round the board in focus fits the phone's width with room to spare (board polish, test 18). A phone
      // keeps the board at the size it always had (its grips a finger's size), so the frame keeps 12px, not 24.
      await expect.poll(async () => (await focusFrame(page)).frame?.left ?? -1).toBeGreaterThanOrEqual(12)
      const framed = await focusFrame(page)
      expect(framed.dims).toBe(true)
      expect(framed.frame!.right).toBeGreaterThanOrEqual(12)
    } finally {
      await removeTestGuest(page, id)
    }
  })

  test('a tap on a lane\'s caption selects the lane and shows the bar', async ({ page }) => {
    test.setTimeout(180_000)
    let id: string | null = null
    try {
      id = (await open(page)).id
      if (await conversation(page).isVisible()) await closeConversation(page)
      const hand = await finger(page)
      const caption = await resting(page, 'caption-todo')
      await hand.touch('touchStart', [{ x: caption.x + caption.width / 2, y: caption.y + caption.height / 2 }])
      await hand.touch('touchEnd', [])
      await expect(page.getByRole('toolbar', { name: 'Board: Vendor choice' })).toBeVisible()
      await expect.poll(() => page.evaluate(() => (window as any).slate.v2.getSelectedNodes().map((n: any) => n.id))).toEqual(['lane-todo'])
      expect(await note(page, 'lane-todo').count()).toBe(1)
    } finally {
      await removeTestGuest(page, id)
    }
  })
})
