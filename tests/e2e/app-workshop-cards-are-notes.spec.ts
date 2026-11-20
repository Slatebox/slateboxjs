import { expect, test, type Browser, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import {
  caption, card, conversation, dragCard, messageBox, note, openConversation, resting, selectCard, slateKey, storedWorkshop, workshopReady, workshopStatus,
} from './app-native-workshop.shared'

/**
 * Notes and cards are the same thing to a person. On the real app: an ordinary note dropped on a
 * lane becomes a card there, a card dropped on the canvas becomes a note, each is one step of the
 * canvas's undo, a teammate sees it, and a reload keeps it. A card looks like the slate's notes.
 * And the conversation takes any sentence: what the workshop's own sentences do not cover goes to
 * the slate's conversation, with the selection as context.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const board: Workshop = {
  version: 1, title: 'Cards are notes',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next', capacity: 1 }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'next' }],
}

async function openBoard(page: Page) {
  await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(board), origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  await workshopReady(page)
  return { key: slateKey(page), id: (await userId(page))! }
}
const stored = async (page: Page, key: string) => (await getSlate(page, key)).nodes.map((n: any) => ({ id: n.options.id as string, text: n.options.text as string }))
const cardsOf = async (page: Page, key: string) => (await storedWorkshop(page, key)).cards.map((c: any) => c.id + '@' + c.laneId).join(' ')

/** Double-click empty canvas left of the board and name the new note. Returns its id. */
async function addNote(page: Page, text: string) {
  const now = await resting(page, 'column-now')
  const before = await page.evaluate(() => (window as any).slate.v2.freeNodes().map((n: any) => n.id))
  await page.mouse.dblclick(now.x - 90, now.y + 140)
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  return page.evaluate(known => (window as any).slate.v2.freeNodes().map((n: any) => n.id).find((id: string) => !known.includes(id)) as string, before)
}

async function carry(page: Page, id: string, to: { x: number; y: number }) {
  const from = await resting(page, id)
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
  await page.mouse.up()
}
const laneSpot = async (page: Page, laneId: string) => {
  const column = await resting(page, 'column-' + laneId)
  return { x: column.x + column.width / 2, y: column.y + column.height - 24 }
}

async function joinAsEditor(browser: Browser, owner: Page) {
  const link = await shareAs(owner, 'edit')
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto(link.href)
  await dismissWelcome(page)
  await workshopReady(page)
  await workshopStatus(page).getByRole('button', { name: 'Join to edit', exact: true }).click()
  await expect.poll(() => userId(page)).toBeTruthy()
  return { context, page, id: (await userId(page))! }
}

test('a note dropped on a lane is a card there and a card dropped on the canvas is a note: saved, seen by a teammate, kept on reload, and each one undo step', async ({ page, browser }) => {
  let id: string | null = null, guest: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    const noteId = await addNote(page, 'Call Sam')
    await expect.poll(() => stored(page, owner.key)).toEqual([{ id: noteId, text: 'Call Sam' }])
    guest = await joinAsEditor(browser, page)
    await expect(note(guest.page, noteId)).toContainText('Call Sam')

    // Note → card, in Later.
    await page.waitForTimeout(600)
    await carry(page, noteId, await laneSpot(page, 'later'))
    await expect.poll(() => cardsOf(page, owner.key)).toBe(`alpha@now beta@next ${noteId}@later`)
    await expect.poll(() => stored(page, owner.key)).toEqual([])
    await expect(card(page, noteId)).toContainText('Call Sam')
    await expect(caption(page, 'later')).toContainText('1 card')
    // The teammate sees the card in Later, and no note.
    await expect(card(guest.page, noteId)).toContainText('Call Sam')
    await expect(note(guest.page, noteId)).toHaveCount(0)
    // The status strip offers no "Undo last change" for it: the canvas's undo puts back both halves.
    await expect(workshopStatus(page).getByRole('button', { name: 'Undo last change' })).toHaveCount(0)

    // Undo: the note is back on the canvas and the card leaves Later, for everyone.
    await page.mouse.click(5, 300)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cardsOf(page, owner.key)).toBe('alpha@now beta@next')
    await expect.poll(() => stored(page, owner.key)).toEqual([{ id: noteId, text: 'Call Sam' }])
    await expect(note(guest.page, noteId)).toContainText('Call Sam')
    await expect(card(guest.page, noteId)).toHaveCount(0)
    // Redo: a card again.
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(() => cardsOf(page, owner.key)).toBe(`alpha@now beta@next ${noteId}@later`)
    await expect.poll(() => stored(page, owner.key)).toEqual([])

    // A full lane refuses a note: it goes back and Next says why. Nothing is saved.
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => stored(page, owner.key)).toEqual([{ id: noteId, text: 'Call Sam' }])
    await page.waitForTimeout(600)
    await carry(page, noteId, await laneSpot(page, 'next'))
    await expect(caption(page, 'next')).toContainText('It already holds 1 of 1 card.')
    await page.waitForTimeout(800)
    expect(await cardsOf(page, owner.key)).toBe('alpha@now beta@next')
    expect(await stored(page, owner.key)).toEqual([{ id: noteId, text: 'Call Sam' }])

    // Card → note: Alpha dropped on empty canvas below the note.
    const spot = await resting(page, noteId)
    await carry(page, 'card-alpha', { x: spot.x + spot.width / 2, y: spot.y + spot.height + 140 })
    await expect.poll(() => cardsOf(page, owner.key)).toBe('beta@next')
    await expect.poll(async () => (await stored(page, owner.key)).map(n => n.text).sort()).toEqual(['Alpha', 'Call Sam'])
    await expect(note(guest.page, 'alpha')).toContainText('Alpha')
    await expect(card(guest.page, 'alpha')).toHaveCount(0)

    // Both survive a reload.
    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect(note(page, 'alpha')).toContainText('Alpha')
    await expect(note(page, noteId)).toContainText('Call Sam')
    await expect(card(page, 'alpha')).toHaveCount(0)
    await expect(caption(page, 'now')).toContainText('0 cards')

    // Dropped back on Now, the note is a card again.
    await page.waitForTimeout(600)
    await carry(page, 'alpha', await laneSpot(page, 'now'))
    await expect.poll(() => cardsOf(page, owner.key)).toBe('beta@next alpha@now')
    await expect.poll(async () => (await stored(page, owner.key)).map(n => n.id)).toEqual([noteId])
  } finally {
    if (guest) { await removeTestGuest(guest.page, guest.id).catch(() => undefined); await guest.context.close() }
    await removeTestGuest(page, id)
  }
})

test('a viewer can neither turn a note into a card nor a card into a note', async ({ page, browser }) => {
  let id: string | null = null
  const context = await browser.newContext()
  try {
    const owner = await openBoard(page)
    id = owner.id
    const noteId = await addNote(page, 'Look only')
    await expect.poll(() => stored(page, owner.key)).toEqual([{ id: noteId, text: 'Look only' }])
    const link = await shareAs(page, 'read')
    const viewer = await context.newPage()
    await viewer.goto(link.href)
    await dismissWelcome(viewer)
    await workshopReady(viewer)
    await expect(note(viewer, noteId)).toBeVisible()
    await carry(viewer, noteId, await laneSpot(viewer, 'later'))
    await carry(viewer, 'card-alpha', { x: 40, y: 500 })
    await viewer.waitForTimeout(1200)
    expect(await cardsOf(page, owner.key)).toBe('alpha@now beta@next')
    expect(await stored(page, owner.key)).toEqual([{ id: noteId, text: 'Look only' }])
    await expect(card(viewer, noteId)).toHaveCount(0)
  } finally { await context.close(); await removeTestGuest(page, id) }
})

test('a card looks like the notes the slate makes: the same fill, border and type', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    const noteId = await addNote(page, 'Same look')
    const paint = (target: string) => page.locator(`#slateCanvas [data-node-id="${target}"] path, #slateCanvas [data-node-id="${target}"] rect`).first()
      .evaluate(el => { const style = getComputedStyle(el); return { fill: style.fill, stroke: style.stroke } })
    const type = (target: string) => page.locator(`#slateCanvas [data-node-id="${target}"] text`).first().evaluate(el => getComputedStyle(el).fontFamily)
    expect(await paint('card-alpha')).toEqual(await paint(noteId))
    expect(await type('card-alpha')).toBe(await type(noteId))
    void owner
  } finally { await removeTestGuest(page, id) }
})

test('with a card selected, plain words still work: notes are added, and drafting on Free says it needs Pro or Team with the way there', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    await openConversation(page)
    const chat = conversation(page)
    await selectCard(page, 'alpha')
    await expect(chat.getByLabel('Selected object')).toContainText('Alpha')
    // The selection's suggestions are there as shortcuts.
    await expect(chat.getByLabel('Starter messages').getByRole('button').first()).toBeVisible()

    // A question needs drafting: on Free that is said plainly, with one way to Pro or Team.
    await messageBox(page).fill('Which lane has the most left?')
    await messageBox(page).press('Enter')
    await expect(chat.getByRole('log')).toContainText('Drafting from a request like this comes with Pro and Team.')
    await expect(chat.getByRole('log')).not.toContainText('I did not follow that')
    const plans = chat.getByRole('link', { name: 'See Pro and Team plans' })
    await expect(plans).toHaveAttribute('href', '/plans')
    const response = await page.request.get(new URL('/plans', origin).href)
    expect(response.ok()).toBe(true)

    // Notes, asked for in plain words with the card still selected.
    await selectCard(page, 'alpha')
    await messageBox(page).fill('can you add a couple more regular notes')
    await messageBox(page).press('Enter')
    await expect(chat.getByLabel('Review proposed drawing')).toContainText('2 notes for the slate')
    await chat.getByRole('button', { name: 'Keep changes', exact: true }).click()
    await expect.poll(async () => (await stored(page, owner.key)).map(n => n.text), { timeout: 20000 }).toEqual(['New note', 'New note'])
    await workshopReady(page)
    expect(await cardsOf(page, owner.key)).toBe('alpha@now beta@next')
    const ids = (await stored(page, owner.key)).map(n => n.id)
    for (const noteId of ids) await expect(note(page, noteId)).toContainText('New note')
    // Below the board, not over a lane.
    const board = await resting(page, 'column-now')
    for (const noteId of ids) expect((await resting(page, noteId)).y).toBeGreaterThan(board.y + board.height)
    await openConversation(page)
    await expect(conversation(page).getByRole('log')).toContainText('Added 2 notes')

    // The workshop's own sentences understand notes too: one named for a lane is a card there.
    await messageBox(page).fill('Add a note called Call the printer to Later')
    await messageBox(page).press('Enter')
    await conversation(page).getByRole('button', { name: 'Keep changes', exact: true }).click()
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.label + '@' + c.laneId)).toContain('Call the printer@later')
  } finally { await removeTestGuest(page, id) }
})
