import { expect, test, type Page } from '@playwright/test'
import { fromSlateMenu } from './app-header.shared'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import {
  canvas, caption, card, closeConversation, conversation, dragCard, finger, keyboardMove, laneOfCard, note, offeredLanes, openConversation,
  previewWorkshopMessage, resting, selectCard, slateKey, slateTitle, storedWorkshop, workshopReady, workshopStatus,
} from './app-native-workshop.shared'

/**
 * What two hostile reviews found on a workshop slate in the app, each held here against the
 * running Meteor app: keys pressed in a dialog reaching the canvas, a name the workshop cannot
 * take staying in the toolbar, a waiting proposal that froze the board without saying so, a
 * view that jumped after a person's own move, a phone whose status strip covered a card and
 * whose canvas one finger could not move, and an embed that was never asserted read-only.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const ruled: Workshop = {
  version: 1, title: 'Review proof',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next', capacity: 1 }, { id: 'later', label: 'Later' }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'next' },
    { id: 'gamma', label: 'Gamma', laneId: 'now', allowedLaneIds: ['now'] }, { id: 'delta', label: 'Delta', laneId: 'now' },
  ],
}

async function openOwned(page: Page, path: string) {
  await page.goto(new URL(path, origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await expect.poll(() => userId(page)).toBeTruthy()
  await dismissWelcome(page)
  await workshopReady(page)
  return { key: slateKey(page), id: (await userId(page))! }
}
const openRuled = (page: Page) => openOwned(page, '/new/workshop' + encodeWorkshopFragment(ruled))
const lanesOf = async (page: Page, key: string) =>
  Object.fromEntries((await storedWorkshop(page, key)).cards.map((item: { id: string; laneId: string }) => [item.id, item.laneId]))
const revisionOf = async (page: Page, key: string) => (await getSlate(page, key)).creative.revision as number
const view = (page: Page) => page.evaluate(() => {
  const box = (window as any).slate.v2.canvas.viewbox()
  return { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width) }
})
const storedNotes = async (page: Page, key: string) => ((await getSlate(page, key)).nodes as { options: { id: string; text: string } }[]).map(node => node.options.text)

/** Add an ordinary note beside the lanes by double-clicking empty canvas and naming it. It stays selected. */
async function addNoteBeside(page: Page, text: string) {
  const first = await resting(page, 'column-now')
  await page.mouse.dblclick(first.x - 70, first.y + 120)
  await page.keyboard.type(text)
  await expect(page.locator('.sb-inline-editor')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
}

test('Backspace and Delete pressed in the Share dialog or on a conversation button do not delete the note selected on the canvas', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    await addNoteBeside(page, 'Parking lot')
    await expect.poll(() => storedNotes(page, owner.key)).toEqual(['Parking lot'])
    const selected = () => page.evaluate(() => (window as any).slate.v2.getSelectedNodes().map((node: any) => node.options.text as string))
    expect(await selected()).toEqual(['Parking lot'])

    // The Share dialog is open and has the keyboard.
    await page.getByRole('button', { name: 'Share', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Share this slate' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: 'Done', exact: true }).focus()
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Delete')
    await dialog.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(dialog).toHaveCount(0)

    // A button of the conversation has the keyboard, with a proposal waiting.
    const panel = await previewWorkshopMessage(page, 'Move Alpha to Later')
    const discard = panel.getByRole('button', { name: 'Discard preview', exact: true })
    await discard.focus()
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Delete')
    // Arrow keys there drive nothing on the canvas either.
    await page.keyboard.press('ArrowRight')
    await discard.click()

    await page.waitForTimeout(1200)
    await expect(page.locator('#slateCanvas [data-node-id]').filter({ hasText: 'Parking lot' })).toHaveCount(1)
    expect(await storedNotes(page, owner.key)).toEqual(['Parking lot'])
    expect(await revisionOf(page, owner.key)).toBe(0)

    // The canvas still takes the key when the keyboard is on it: press the note, then Delete.
    const mine = page.locator('#slateCanvas [data-node-id]').filter({ hasText: 'Parking lot' })
    const box = (await mine.boundingBox())!
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
    await page.keyboard.press('Delete')
    await expect(mine).toHaveCount(0)
    await expect.poll(() => storedNotes(page, owner.key)).toEqual([])
    // And never a card: Delete on a selected card removes nothing.
    await selectCard(page, 'alpha')
    await page.keyboard.press('Delete')
    await page.keyboard.press('Backspace')
    await expect(card(page, 'alpha')).toBeVisible()
    expect((await storedWorkshop(page, owner.key)).cards).toHaveLength(4)
  } finally { await removeTestGuest(page, id) }
})

test('a note one person adds beside the workshop appears for the other without a reload, and no workshop note travels with it', async ({ browser, page }) => {
  let ownerId: string | null = null
  const context = await browser.newContext()
  const peer = await context.newPage()
  let peerId: string | null = null
  try {
    const owner = await openRuled(page)
    ownerId = owner.id
    const link = await shareAs(page, 'edit')
    await peer.goto(link.href)
    await dismissWelcome(peer)
    await workshopReady(peer)
    await workshopStatus(peer).getByRole('button', { name: 'Join to edit', exact: true }).click()
    await expect.poll(() => userId(peer)).toBeTruthy()
    peerId = await userId(peer)
    await expect(conversation(peer)).toBeVisible()
    await page.evaluate(() => { (window as any).__stayed = true })

    // The peer adds an ordinary note beside the lanes. It reaches the owner's open canvas over the
    // slate's live connection, and it is stored as the slate's only note.
    await addNoteBeside(peer, 'From the peer')
    const arrived = page.locator('#slateCanvas [data-node-id]').filter({ hasText: 'From the peer' })
    await expect(arrived).toHaveCount(1, { timeout: 25000 })
    await expect.poll(() => storedNotes(page, owner.key)).toEqual(['From the peer'])
    // Nothing of the workshop came with it: each canvas still has the workshop's four cards and
    // three lanes once, drawn from the model, and the note is the only thing either would save.
    for (const view of [page, peer]) {
      await expect(view.locator('#slateCanvas [data-node-id^="card-"]')).toHaveCount(4)
      await expect(view.locator('#slateCanvas [data-node-id^="lane-"]')).toHaveCount(3)
      await expect(view.locator('#slateCanvas [data-node-id^="column-"]')).toHaveCount(3)
      expect(await view.evaluate(() => JSON.parse((window as any).slate.exportJSON()).nodes.map((node: any) => node.options.text as string))).toEqual(['From the peer'])
    }
    // The owner moves that note; the peer sees it move, and the owner's next save does not drop it.
    const before = (await peer.locator('#slateCanvas [data-node-id]').filter({ hasText: 'From the peer' }).boundingBox())!
    const mine = (await arrived.boundingBox())!
    await page.mouse.move(mine.x + mine.width / 2, mine.y + mine.height / 2)
    await page.mouse.down()
    await page.mouse.move(mine.x + mine.width / 2, mine.y + mine.height / 2 + 90, { steps: 8 })
    await page.mouse.up()
    await expect.poll(async () => (await peer.locator('#slateCanvas [data-node-id]').filter({ hasText: 'From the peer' }).boundingBox())!.y, { timeout: 25000 }).toBeGreaterThan(before.y + 40)
    // And the workshop still travels as its model: a card the owner moves arrives on the peer's canvas.
    await dragCard(page, 'alpha', 'later')
    await expect.poll(() => laneOfCard(peer, 'alpha')).toBe('Later')
    await page.waitForTimeout(1200)
    expect(await storedNotes(page, owner.key)).toEqual(['From the peer'])
    expect(await lanesOf(page, owner.key)).toEqual({ alpha: 'later', beta: 'next', gamma: 'now', delta: 'now' })
    for (const view of [page, peer]) await expect(view.locator('#slateCanvas [data-node-id^="card-"]')).toHaveCount(4)
    expect(await page.evaluate(() => (window as any).__stayed === true)).toBe(true)
  } finally {
    try { await removeTestGuest(peer, peerId).catch(() => {}) } finally { await context.close() }
    await removeTestGuest(page, ownerId)
  }
})

test('Slate settings renames the workshop; a name it cannot take is said and the saved name comes back', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    await fromSlateMenu(page, 'Slate settings')
    const name = page.getByRole('textbox', { name: 'Name', exact: true })
    await expect(name).toHaveValue('Review proof')

    await name.fill('Sprint plan')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).title).toBe('Sprint plan')
    const stored = await getSlate(page, owner.key)
    expect(stored.options.name).toBe('Sprint plan')
    // The slate is found in search by its new name.
    expect(stored.options.searchName).toContain('Sprint')
    expect(stored.options.searchName).not.toContain('Review')
    await expect(slateTitle(page)).toHaveText('Sprint plan')

    // The field takes no more than the workshop's 120 characters: a longer name stops there, and is saved.
    await expect(name).toHaveAttribute('maxlength', '120')
    const long = 'A name that runs on '.repeat(7).slice(0, 130)
    await name.fill(long)
    await expect(name).toHaveValue(long.slice(0, 120))
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).title).toBe(long.slice(0, 120).trim())
    await name.fill('Sprint plan')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).title).toBe('Sprint plan')
    // A name the workshop cannot take is refused: the reason is said beside the field and on the
    // canvas, and the saved name comes back in the field and in the toolbar.
    const beside = page.getByRole('alert').filter({ hasText: 'The name was not changed.' })
    const onCanvas = page.locator('[role="group"][aria-label="Workshop"] [role="alert"]')
    await name.fill('<b>Sprint</b>')
    await expect(beside).toContainText('without < or >')
    await expect(onCanvas).toContainText('The name was not changed.')
    await expect(name).toHaveValue('Sprint plan')
    await expect(slateTitle(page)).toHaveText('Sprint plan')
    // Typing again clears the reason.
    await name.fill('Sprint plan B')
    await expect(beside).toHaveCount(0)
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).title).toBe('Sprint plan B')
    await name.fill('Sprint plan')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).title).toBe('Sprint plan')
    expect((await storedWorkshop(page, owner.key)).title).toBe('Sprint plan')
    expect((await getSlate(page, owner.key)).options.name).toBe('Sprint plan')

    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect(slateTitle(page)).toHaveText('Sprint plan')
  } finally { await removeTestGuest(page, id) }
})

test('a proposal left waiting with the conversation closed says so on the canvas and offers the way back', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    await previewWorkshopMessage(page, 'Move Alpha to Later')
    // With the conversation open the strip names the preview.
    await expect(workshopStatus(page).getByRole('status')).toContainText('Preview: a proposed change, not saved yet.')
    await expect(workshopStatus(page).getByRole('button', { name: 'Review proposal', exact: true })).toHaveCount(0)
    await closeConversation(page)
    // Closed: the strip says why nothing moves, and has the one button that leads back to Keep and Discard.
    await expect(workshopStatus(page).getByRole('status')).toContainText('Cards stay where they are until you keep or discard it.')
    const review = workshopStatus(page).getByRole('button', { name: 'Review proposal', exact: true })
    await expect(review).toBeVisible()
    // The board is held still, and nothing is saved.
    expect(await offeredLanes(page, 'delta')).toEqual([])
    expect(await keyboardMove(page, 'delta', 'Later')).toBe(false)
    expect(await revisionOf(page, owner.key)).toBe(0)
    await review.click()
    const panel = conversation(page)
    await expect(panel.getByRole('button', { name: 'Keep changes', exact: true })).toBeEnabled()
    await expect(review).toHaveCount(0)
    await panel.getByRole('button', { name: 'Discard preview', exact: true }).click()
    await expect(workshopStatus(page).getByRole('status')).toHaveCount(0)
    // Answered, the board plays again.
    await dragCard(page, 'delta', 'later')
    await expect.poll(async () => (await lanesOf(page, owner.key)).delta).toBe('later')
  } finally { await removeTestGuest(page, id) }
})

test('a person\'s own move does not move their view, though it changes which lane is tallest', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    // Let the opening fit finish.
    await page.waitForTimeout(4000)
    const before = await view(page)
    const beta = await resting(page, 'card-beta')
    // Now holds three cards and is the tallest lane. Two moves make Later the tallest instead.
    for (const cardId of ['alpha', 'delta']) {
      await dragCard(page, cardId, 'later')
      await expect.poll(async () => (await lanesOf(page, owner.key))[cardId]).toBe('later')
      await page.waitForTimeout(900)
      expect(await view(page)).toEqual(before)
    }
    await dragCard(page, 'beta', 'later')
    await expect.poll(async () => (await lanesOf(page, owner.key)).beta).toBe('later')
    await page.waitForTimeout(900)
    expect(await view(page)).toEqual(before)
    // A card nobody touched is exactly where it was on screen.
    const gammaBefore = await resting(page, 'card-gamma')
    await dragCard(page, 'alpha', 'now')
    await expect.poll(async () => (await lanesOf(page, owner.key)).alpha).toBe('now')
    await page.waitForTimeout(900)
    expect(await view(page)).toEqual(before)
    expect(beta.width).toBeGreaterThan(0)
    const gammaAfter = await resting(page, 'card-gamma')
    expect(Math.abs(gammaAfter.x - gammaBefore.x)).toBeLessThan(1)
  } finally { await removeTestGuest(page, id) }
})

test('on a phone the status strip has a row of its own and one finger pans the canvas to the lanes below', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch events')
  const ownerContext = await browser.newContext()
  const ownerPage = await ownerContext.newPage()
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  const guest = await context.newPage()
  let ownerId: string | null = null
  try {
    const owner = await openRuled(ownerPage)
    ownerId = owner.id
    const link = await shareAs(ownerPage, 'edit')
    await guest.goto(link.href)
    await dismissWelcome(guest)
    await workshopReady(guest)
    const strip = workshopStatus(guest)
    await expect(strip.getByRole('button', { name: 'Join to edit', exact: true })).toBeVisible()
    // The strip sits under the canvas: it covers no card, and the canvas's own controls are not drawn through it.
    const stripBox = (await strip.boundingBox())!
    const canvasBox = (await canvas(guest).boundingBox())!
    expect(stripBox.y).toBeGreaterThanOrEqual(canvasBox.y + canvasBox.height - 1)
    expect(stripBox.y + stripBox.height).toBeLessThanOrEqual(844)
    for (const control of ['.slatebox-zoom-slider', '.slateboxjs-birdseye']) {
      const box = await guest.locator('#slateCanvas ' + control).first().boundingBox()
      if (box) expect(box.y + box.height).toBeLessThanOrEqual(stripBox.y + 1)
    }

    // The last lane starts below the screen. One finger on the empty part of a lane brings it up.
    const later = await resting(guest, 'column-later')
    expect(later.y + later.height).toBeGreaterThan(canvasBox.y + canvasBox.height)
    const before = await view(guest)
    const device = await finger(guest)
    const from = { x: 372, y: canvasBox.y + canvasBox.height - 80 }
    await device.touch('touchStart', [from])
    for (let i = 1; i <= 10; i++) await device.touch('touchMove', [{ x: from.x, y: from.y - 30 * i }])
    await device.touch('touchEnd', [])
    const after = await view(guest)
    expect(after.y - before.y).toBeGreaterThan(250)
    expect(after.width).toBe(before.width)
    expect((await resting(guest, 'column-later')).y).toBeLessThan(later.y - 250)
    // Panning is all a visitor who has not joined did: nothing moved, nothing was saved.
    expect(await lanesOf(ownerPage, owner.key)).toEqual({ alpha: 'now', beta: 'next', gamma: 'now', delta: 'now' })
    expect(await revisionOf(ownerPage, owner.key)).toBe(0)
  } finally {
    await context.close()
    try { await removeTestGuest(ownerPage, ownerId) } finally { await ownerContext.close() }
  }
})

test('an embedded workshop slate is read-only: no card moves, nothing is offered, nothing is saved', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    // The owner's own session, in the embed view of the same slate.
    await page.goto(new URL('/canvas/' + owner.key + '/0/true', origin).href)
    await workshopReady(page)
    await expect(note(page, 'card-alpha')).toBeVisible()
    await expect(caption(page, 'next')).toContainText('1 of 1')
    // No conversation, no way to ask for one, no status strip, no toolbar name to edit.
    await expect(conversation(page)).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Ask Slatebox' })).toHaveCount(0)
    await expect(workshopStatus(page)).toHaveCount(0)
    await expect(page.locator('.sb-board-toolbar')).toHaveCount(0)
    // A card cannot be picked up, dragged, moved from the keyboard or renamed.
    const start = await resting(page, 'card-alpha')
    expect(await offeredLanes(page, 'alpha')).toEqual([])
    await dragCard(page, 'alpha', 'later')
    const back = await resting(page, 'card-alpha')
    expect(Math.abs(back.x - start.x)).toBeLessThan(1)
    expect(Math.abs(back.y - start.y)).toBeLessThan(1)
    expect(await laneOfCard(page, 'alpha')).toBe('Now')
    expect(await keyboardMove(page, 'alpha', 'Later')).toBe(false)
    await page.mouse.dblclick(start.x + start.width / 2, start.y + start.height / 2)
    await page.waitForTimeout(300)
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    // Nor is an ordinary note made by a double-click on empty canvas.
    const column = await resting(page, 'column-now')
    await page.mouse.dblclick(Math.max(4, column.x - 60), column.y + 100)
    await page.waitForTimeout(600)
    const stored = await getSlate(page, owner.key)
    expect(stored.nodes).toEqual([])
    expect(stored.creative.revision).toBe(0)
    expect(await lanesOf(page, owner.key)).toEqual({ alpha: 'now', beta: 'next', gamma: 'now', delta: 'now' })
  } finally {
    await page.goto(new URL('/canvas/' + slateKey(page).replace(/^true$/, ''), origin).href).catch(() => {})
    await removeTestGuest(page, id).catch(() => {})
  }
})
