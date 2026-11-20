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
async function addNote(page: Page, text: string, dy = 140) {
  const now = await resting(page, 'column-now')
  const before = await page.evaluate(() => (window as any).slate.v2.freeNodes().map((n: any) => n.id))
  await page.mouse.dblclick(now.x - 90, now.y + dy)
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

test('with a card selected, plain words still work: notes are added, and drafting as a guest says to sign in, with no plan offered', async ({ page }) => {
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

    // A question needs drafting: AI is free each month for anyone signed in, so a guest is told
    // plainly to sign in. (Restated 2026-11-20, switch day: Slatebox has no plans, so the one way
    // to Pro or Team is gone; an old /plans link still lands on a page.)
    await messageBox(page).fill('Which lane has the most left?')
    await messageBox(page).press('Enter')
    await expect(chat.getByRole('log')).toContainText('Sign in to use AI. It is free each month.')
    await expect(chat.getByRole('log')).not.toContainText('I did not follow that')
    await expect(chat.getByRole('log')).not.toContainText(/\bPro\b|Team plan/)
    await expect(chat.getByRole('link', { name: 'See Pro and Team plans' })).toHaveCount(0)
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

// cards-fix (2026-11-19): what a hostile review found with two people, a quick reload, several
// notes at once, a note typed in a lane, and plain words on Free.
const shown = (page: Page) => page.evaluate(() => {
  const s = (window as any).slate.v2
  return { notes: s.freeNodes().map((n: any) => n.id).sort() as string[],
    cards: [...document.querySelectorAll('#slateCanvas [data-node-id^="card-"]')].map(el => el.getAttribute('data-node-id')!.slice(5)).sort() as string[] }
})

test('two people drop the same note on two lanes at once: it is one card, and both pages and the server agree', async ({ page, browser }) => {
  let id: string | null = null, guest: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    const n = await addNote(page, 'Shared note')
    guest = await joinAsEditor(browser, page)
    await expect(note(guest.page, n)).toContainText('Shared note')
    await page.waitForTimeout(800)
    await Promise.all([carry(page, n, await laneSpot(page, 'now')), carry(guest.page, n, await laneSpot(guest.page, 'later'))])
    await expect.poll(async () => (await cardsOf(page, owner.key)).split(' ').filter(c => c.startsWith(n + '@')).length, { timeout: 15000 }).toBe(1)
    await page.waitForTimeout(2500)
    expect((await stored(page, owner.key)).map(item => item.id)).toEqual([])
    const mine = await shown(page), theirs = await shown(guest.page)
    expect(mine.notes).toEqual([])
    expect(theirs.notes).toEqual([])
    expect(mine.cards).toContain(n)
    expect(theirs.cards).toEqual(mine.cards)
  } finally {
    if (guest) { await removeTestGuest(guest.page, guest.id).catch(() => undefined); await guest.context.close() }
    await removeTestGuest(page, id)
  }
})

test('two people drop the same card on the canvas at once: it is one note, on both pages and on the server', async ({ page, browser }) => {
  let id: string | null = null, guest: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    guest = await joinAsEditor(browser, page)
    await page.waitForTimeout(800)
    const mineNow = await resting(page, 'column-now'), theirNow = await resting(guest.page, 'column-now')
    await Promise.all([
      carry(page, 'card-alpha', { x: mineNow.x - 160, y: mineNow.y + 120 }),
      carry(guest.page, 'card-alpha', { x: theirNow.x - 160, y: theirNow.y + 360 }),
    ])
    await expect.poll(() => cardsOf(page, owner.key), { timeout: 15000 }).toBe('beta@next')
    await page.waitForTimeout(3000)
    const texts = (await stored(page, owner.key)).map(item => item.text)
    expect(texts).toEqual(['Alpha'])
    expect((await shown(page)).notes).toHaveLength(1)
    expect((await shown(guest.page)).notes).toEqual((await shown(page)).notes)
  } finally {
    if (guest) { await removeTestGuest(guest.page, guest.id).catch(() => undefined); await guest.context.close() }
    await removeTestGuest(page, id)
  }
})

test('a reload the moment after a trade keeps the note or the card, never both and never neither; an undo puts a card back in its place for everyone', async ({ page, browser }) => {
  let id: string | null = null, guest: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const three: Workshop = { ...board, cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'gamma', label: 'Gamma', laneId: 'now' }, { id: 'delta', label: 'Delta', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'next' }] }
    await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(three), origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(page)).toBeTruthy()
    await dismissWelcome(page)
    await workshopReady(page)
    const key = slateKey(page)
    id = (await userId(page))!
    await page.waitForTimeout(800)
    // A card to the canvas, then a reload 150 ms later.
    const now = await resting(page, 'column-now')
    await carry(page, 'card-delta', { x: now.x - 160, y: now.y + 200 })
    await page.waitForTimeout(150)
    await page.reload()
    await workshopReady(page)
    await page.waitForTimeout(1500)
    expect(await cardsOf(page, key)).toBe('alpha@now gamma@now beta@next')
    expect((await stored(page, key)).map(item => item.id)).toEqual(['delta'])
    // A note to a lane, then a reload 150 ms later.
    await carry(page, 'delta', await laneSpot(page, 'later'))
    await page.waitForTimeout(150)
    await page.reload()
    await workshopReady(page)
    await page.waitForTimeout(1500)
    expect(await cardsOf(page, key)).toBe('alpha@now gamma@now beta@next delta@later')
    expect(await stored(page, key)).toEqual([])

    // Gamma to the canvas and back with Ctrl+Z: between Alpha and Delta in Now again, for a teammate too.
    await carry(page, 'card-delta', await laneSpot(page, 'now'))
    await expect.poll(() => cardsOf(page, key)).toBe('alpha@now gamma@now beta@next delta@now')
    guest = await joinAsEditor(browser, page)
    await page.waitForTimeout(800)
    const column = await resting(page, 'column-now')
    await carry(page, 'card-gamma', { x: column.x - 160, y: column.y + 200 })
    await expect.poll(() => cardsOf(page, key)).toBe('alpha@now beta@next delta@now')
    await page.waitForTimeout(1200)
    await page.mouse.click(5, 300)
    await page.keyboard.press('ControlOrMeta+z')
    const inNow = async () => (await storedWorkshop(page, key)).cards.filter((c: any) => c.laneId === 'now').map((c: any) => c.id).join(' ')
    await expect.poll(inNow).toBe('alpha gamma delta')
    const order = (p: Page) => p.evaluate(() => ['alpha', 'gamma', 'delta'].map(c => Math.round((window as any).slate.v2.nodes.one('card-' + c)?.options?.y ?? -1)))
    await expect.poll(async () => { const y = await order(guest!.page); return y[0] < y[1] && y[1] < y[2] }).toBe(true)
  } finally {
    if (guest) { await removeTestGuest(guest.page, guest.id).catch(() => undefined); await guest.context.close() }
    await removeTestGuest(page, id)
  }
})

// cards-atomic (2026-11-19): seen on staging. On a slow network a person dropped the note Delta on
// Later and closed the page at once: the server kept Delta as a note and no card, yet a teammate
// and a newcomer showed neither, because the note's removal had reached the room and the trade's
// save never landed. A trade is all or nothing for everyone.
test('on a slow network, a page closed straight after a trade: the server, a teammate and a newcomer agree, both ways; once saved, everyone sees it', async ({ page, browser }) => {
  let id: string | null = null
  const guests: { page: Page; id: string | null }[] = []
  const contexts: { close(): Promise<void> }[] = []
  try {
    const owner = await openBoard(page)
    id = owner.id
    const delta = await addNote(page, 'Delta')
    const other = await addNote(page, 'Other', 300)
    await expect.poll(async () => (await stored(page, owner.key)).map(n => n.text).sort()).toEqual(['Delta', 'Other'])
    const link = await shareAs(page, 'edit')
    const teammate = await browser.newContext()
    contexts.push(teammate)
    const b = await teammate.newPage()
    await b.goto(link.href)
    await dismissWelcome(b)
    await workshopReady(b)
    await workshopStatus(b).getByRole('button', { name: 'Join to edit', exact: true }).click()
    await expect.poll(() => userId(b)).toBeTruthy()
    guests.push({ page: b, id: await userId(b) })
    await expect(note(b, delta)).toContainText('Delta')

    /** A newcomer's first look: the stored slate, then the room. */
    const newcomer = async () => {
      const context = await browser.newContext()
      contexts.push(context)
      const viewer = await context.newPage()
      await viewer.goto(link.href)
      await dismissWelcome(viewer)
      await workshopReady(viewer)
      await viewer.waitForTimeout(2500)
      guests.push({ page: viewer, id: await userId(viewer) })
      return shown(viewer)
    }
    /** A second tab of this person on a slow link; with `late`, its trade's save leaves 4 s after the trade, as behind a slow save. */
    const slowTab = async (late: boolean) => {
      const tab = await page.context().newPage()
      await tab.goto(page.url())
      await dismissWelcome(tab)
      await workshopReady(tab)
      await tab.waitForTimeout(1500)
      const cdp = await page.context().newCDPSession(tab)
      await cdp.send('Network.enable')
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 100_000, uploadThroughput: 50_000 })
      if (late) await tab.evaluate(() => {
        const M = (window as any).Meteor, call = M.callAsync
        M.callAsync = function (name: string, ...args: unknown[]) {
          return name === 'creativeSlates.play' ? new Promise(resolve => setTimeout(resolve, 4000)).then(() => call.call(M, name, ...args)) : call.call(M, name, ...args)
        }
      })
      return tab
    }

    // Note → card, and the tab closed before the save left. Another note is moved meanwhile, so
    // the page's own drawing save has a reason to run inside the window.
    let tab = await slowTab(true)
    await carry(tab, delta, await laneSpot(tab, 'later'))
    await expect(card(tab, delta)).toBeVisible()
    await expect(note(tab, delta)).toHaveCount(0)
    const o = await resting(tab, other)
    await carry(tab, other, { x: o.x + o.width / 2 + 40, y: o.y + o.height / 2 + 30 })
    await tab.waitForTimeout(1800)
    await tab.close()
    await b.waitForTimeout(3000)
    expect(await cardsOf(page, owner.key)).toBe('alpha@now beta@next')
    expect((await stored(page, owner.key)).map(n => n.id)).toContain(delta)
    let theirs = await shown(b)
    expect(theirs.notes, 'the teammate still shows Delta as a note').toContain(delta)
    expect(theirs.cards).toEqual(['alpha', 'beta'])
    let fresh = await newcomer()
    expect(fresh.notes, 'a newcomer shows Delta as a note').toContain(delta)
    expect(fresh.cards).toEqual(['alpha', 'beta'])

    // Card → note, the same way: Alpha stays a card for everyone.
    tab = await slowTab(true)
    const now = await resting(tab, 'column-now')
    await carry(tab, 'card-alpha', { x: now.x - 160, y: now.y + 420 })
    await expect(note(tab, 'alpha')).toBeVisible()
    await tab.waitForTimeout(1800)
    await tab.close()
    await b.waitForTimeout(3000)
    expect(await cardsOf(page, owner.key)).toBe('alpha@now beta@next')
    expect((await stored(page, owner.key)).map(n => n.id)).not.toContain('alpha')
    theirs = await shown(b)
    expect(theirs.notes, 'the teammate shows no Alpha note').not.toContain('alpha')
    expect(theirs.cards).toEqual(['alpha', 'beta'])
    fresh = await newcomer()
    expect(fresh.notes, 'a newcomer shows no Alpha note').not.toContain('alpha')
    expect(fresh.cards).toEqual(['alpha', 'beta'])

    // Once the save lands, on the same slow link, everyone sees the trade.
    tab = await slowTab(false)
    await carry(tab, delta, await laneSpot(tab, 'later'))
    await expect.poll(() => cardsOf(page, owner.key), { timeout: 20000 }).toBe(`alpha@now beta@next ${delta}@later`)
    await expect.poll(async () => (await shown(b)).notes, { timeout: 15000 }).not.toContain(delta)
    expect((await shown(b)).cards).toContain(delta)
    await tab.waitForTimeout(1500)
    await tab.close()
    expect((await stored(page, owner.key)).map(n => n.id)).not.toContain(delta)
    fresh = await newcomer()
    expect(fresh.notes).not.toContain(delta)
    expect(fresh.cards).toContain(delta)
  } finally {
    for (const guest of guests) await removeTestGuest(guest.page, guest.id).catch(() => undefined)
    for (const context of contexts) await context.close().catch(() => undefined)
    await removeTestGuest(page, id)
  }
})

test('several notes dropped on a lane together become cards there; a note typed inside a lane becomes a card in it', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    const one = await addNote(page, 'One')
    const now = await resting(page, 'column-now')
    const before = await page.evaluate(() => (window as any).slate.v2.freeNodes().map((n: any) => n.id))
    await page.mouse.dblclick(now.x - 90, now.y + 300)
    await page.keyboard.type('Two')
    await page.keyboard.press('Enter')
    const two = await page.evaluate(known => (window as any).slate.v2.freeNodes().map((n: any) => n.id).find((x: string) => !known.includes(x)) as string, before)
    await page.evaluate(([a, b]) => { const s = (window as any).slate.v2; s.selectNodes([s.nodes.one(a), s.nodes.one(b)]) }, [one, two])
    await carry(page, one, await laneSpot(page, 'later'))
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.label + '@' + c.laneId).sort()).toEqual(['Alpha@now', 'Beta@next', 'One@later', 'Two@later'])
    await expect.poll(() => stored(page, owner.key)).toEqual([])

    // Typed inside Now: a card there, counted in its caption.
    const inNow = await laneSpot(page, 'now')
    await page.mouse.dblclick(inNow.x, inNow.y)
    await page.keyboard.type('Typed in Now')
    await page.keyboard.press('Enter')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.label + '@' + c.laneId)).toContain('Typed in Now@now')
    await expect(caption(page, 'now')).toContainText('2 cards')
    await page.waitForTimeout(1000)
    expect(await stored(page, owner.key)).toEqual([])
  } finally { await removeTestGuest(page, id) }
})

test('typed requests are done with no AI and no plan offered: a card becomes a note, cards by number, a colour', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    await openConversation(page)
    const chat = conversation(page)
    for (const [message, reply] of [['add three cards to Later', 'Added 3 cards to “Later”.'], ['make this card red', 'Coloured “Alpha” red.']]) {
      await selectCard(page, 'alpha')
      await messageBox(page).fill(message)
      await messageBox(page).press('Enter')
      await expect(chat.getByRole('log')).toContainText(reply)
      await expect(chat.getByRole('link', { name: 'See Pro and Team plans' })).toHaveCount(0)
      await chat.getByRole('button', { name: 'Keep changes', exact: true }).click()
      await expect(chat.getByRole('log')).toContainText('Saved to the workshop.')
    }
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.filter((c: any) => c.laneId === 'later').length).toBe(3)
    expect((await storedWorkshop(page, owner.key)).cards[0].look.backgroundColor).toMatch(/^#/)

    await selectCard(page, 'alpha')
    await messageBox(page).fill('turn this card into a note')
    await messageBox(page).press('Enter')
    await expect(chat.getByRole('log')).toContainText('Making “Alpha” an ordinary note beside the board.')
    await expect(chat.getByRole('link', { name: 'See Pro and Team plans' })).toHaveCount(0)
    await chat.getByRole('button', { name: 'Keep changes', exact: true }).click()
    await expect.poll(() => stored(page, owner.key)).toEqual([{ id: 'alpha', text: 'Alpha' }])
    expect((await storedWorkshop(page, owner.key)).cards.some((c: any) => c.id === 'alpha')).toBe(false)
  } finally { await removeTestGuest(page, id) }
})
