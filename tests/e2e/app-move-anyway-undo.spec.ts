import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'
import { canvasRedo, canvasUndo, holdCardOver, laneOfCard, slateKey, storedWorkshop, workshopReady } from './app-native-workshop.shared'

/**
 * A move made anyway (a drop the board's rules refuse, confirmed) is one step of the person's own undo history: the
 * canvas's Undo, or Ctrl/Cmd+Z, puts the card back where it was and Redo moves it anyway again, each saved. The dialog
 * names that Undo with its key. (release/land2: Move anyway everywhere + first-class undo.)
 */
const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const ruled: Workshop = {
  version: 1, title: 'Move anyway and undo',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next', capacity: 1 }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'next' }, { id: 'delta', label: 'Delta', laneId: 'now' }],
}
const stored = async (page: Page, key: string) => {
  const board = await storedWorkshop(page, key)
  return { alpha: board.cards.find((c: any) => c.id === 'alpha')?.laneId, marked: Boolean(board.cards.find((c: any) => c.id === 'alpha')?.override) }
}

test('a move made anyway is one step: Undo puts the card back, Redo moves it anyway again, and the keys do the same', async ({ page }) => {
  let id: string | null = null
  try {
    await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(ruled), origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(page)).toBeTruthy()
    id = await userId(page)
    await dismissWelcome(page)
    await workshopReady(page)
    const key = slateKey(page)
    await expect(canvasUndo(page)).toBeDisabled()

    await holdCardOver(page, 'alpha', 'next')
    await page.mouse.up()
    const ask = page.getByRole('dialog', { name: 'Move Alpha to Next anyway?' })
    await expect(ask).toBeVisible()
    await expect(ask).toContainText(/Undo \((⌘Z|Ctrl\+Z)\) puts it back\./)
    await expect(ask).not.toContainText('Undo last change')
    await ask.getByRole('button', { name: 'Move anyway' }).click()
    await expect.poll(() => stored(page, key)).toEqual({ alpha: 'next', marked: true })
    expect(await laneOfCard(page, 'alpha')).toBe('Next')

    // One step: a single Undo puts it back, saved; Redo moves it anyway again, saved and marked.
    await expect(canvasUndo(page)).toBeEnabled()
    await canvasUndo(page).click()
    await expect.poll(() => stored(page, key)).toEqual({ alpha: 'now', marked: false })
    await expect.poll(() => laneOfCard(page, 'alpha')).toBe('Now')
    await expect(canvasUndo(page)).toBeDisabled()
    await canvasRedo(page).click()
    await expect.poll(() => stored(page, key)).toEqual({ alpha: 'next', marked: true })

    // The keyboard's Undo does the same.
    await page.locator('#slateCanvas').click({ position: { x: 300, y: 120 } })
    await page.keyboard.press('Control+Z')
    await expect.poll(() => stored(page, key)).toEqual({ alpha: 'now', marked: false })
  } finally { await removeTestGuest(page, id) }
})
