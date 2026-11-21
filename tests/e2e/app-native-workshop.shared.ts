import { expect, type Locator, type Page } from '@playwright/test'
import { getSlate } from './workshop-guests.shared'

/**
 * A workshop slate in the app is an ordinary slate with the workshop drawn on its canvas:
 * lanes and cards are notes named lane-<id>, card-<id>, column-<id> and caption-<id> inside
 * #slateCanvas, and the conversation is the slate's own panel. These helpers act on that
 * surface the way a person does: a pointer, a finger or the keyboard.
 */

type Box = { x: number; y: number; width: number; height: number }

export const canvas = (page: Page) => page.locator('#slateCanvas')
export const note = (page: Page, id: string) => page.locator('#slateCanvas [data-node-id="' + id + '"]')
export const card = (page: Page, cardId: string) => note(page, 'card-' + cardId)
export const lane = (page: Page, laneId: string) => note(page, 'lane-' + laneId)
export const caption = (page: Page, laneId: string) => note(page, 'caption-' + laneId)
/** The slate's own conversation panel. */
export const conversation = (page: Page) => page.getByRole('complementary', { name: 'Ask Slatebox' })
/** The status strip on the canvas: Join to edit, View only, Undo last change, Saving, errors. */
export const workshopStatus = (page: Page) => page.getByRole('group', { name: 'Workshop', exact: true })
/** Where each token of a map is and what happens there. */
export const standing = (page: Page) => page.getByRole('region', { name: 'Where things stand', exact: true })
export const placementOutcomes = (page: Page) => page.getByRole('region', { name: 'Placement outcomes', exact: true })
/** What the canvas announces to assistive technology. */
export const announced = (page: Page) => page.locator('#slateCanvas [aria-live]')
export const storedWorkshop = async (page: Page, key: string) => (await getSlate(page, key)).creative.model.workshop
export const slateKey = (page: Page) => new URL(page.url()).pathname.split('/').pop()!

/** Wait for the workshop to be drawn on the live canvas. */
export async function workshopReady(page: Page) {
  await expect(canvas(page)).toBeVisible()
  await expect(page.locator('[data-creative-revision]').first()).toBeAttached()
  await expect(page.locator('#slateCanvas [data-node-id^="lane-"]').first()).toBeVisible()
}

/** The note's accessible name: "<card>, in <lane>" for a card, "<lane>, <caption>" for a lane. */
const named = (page: Page, kind: 'card' | 'lane', label: string) => page.evaluate(({ kind, label }) => {
  const prefix = label + ', '
  const matches = [...document.querySelectorAll('#slateCanvas [data-node-id^="' + kind + '-"]')]
    .filter(node => (node.getAttribute('aria-label') ?? '').startsWith(kind === 'card' ? prefix + 'in ' : prefix))
  if (matches.length !== 1) throw new Error(matches.length + ' ' + kind + ' notes are named "' + label + '"')
  return matches[0].getAttribute('data-node-id')!.slice(kind.length + 1)
}, { kind, label })
export const cardIdNamed = (page: Page, label: string) => named(page, 'card', label)
export const laneIdNamed = (page: Page, label: string) => named(page, 'lane', label)
export const cardNamed = async (page: Page, label: string) => card(page, await cardIdNamed(page, label))
/** The lane a card is drawn in, by the card's accessible name. */
export const laneOfCard = async (page: Page, cardId: string) =>
  ((await card(page, cardId).getAttribute('aria-label')) ?? '').replace(/^.*, in /s, '')

async function boxOf(target: Locator): Promise<Box> {
  await expect(target).toBeVisible()
  const box = await target.boundingBox()
  if (!box) throw new Error('The note has no box on screen')
  return box
}
const centre = (box: Box) => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 })
/** A point in the lower part of a lane's column, clear of its header and (for a lane with a free slot) its cards. */
export async function inLane(page: Page, laneId: string) {
  const column = await boxOf(note(page, 'column-' + laneId))
  return { x: column.x + column.width / 2, y: column.y + column.height - Math.min(30, column.height / 6) }
}

/** The note's place on screen once it has stopped moving. */
export async function resting(page: Page, id: string) {
  let last = await boxOf(note(page, id))
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100)
    const next = await boxOf(note(page, id))
    if (Math.abs(next.x - last.x) < 0.5 && Math.abs(next.y - last.y) < 0.5) return next
    last = next
  }
  throw new Error(id + ' never came to rest')
}

/** Press on a card and carry it over a lane, leaving the button down. */
export async function holdCardOver(page: Page, cardId: string, laneId: string) {
  const from = centre(await resting(page, 'card-' + cardId))
  const to = await inLane(page, laneId)
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
}

/** Drag a card to a lane with the mouse and let go. */
export async function dragCard(page: Page, cardId: string, laneId: string) {
  await holdCardOver(page, cardId, laneId)
  await page.mouse.up()
}

/** Drag by the names on the notes. */
export async function dragCardNamed(page: Page, cardLabel: string, laneLabel: string) {
  await dragCard(page, await cardIdNamed(page, cardLabel), await laneIdNamed(page, laneLabel))
}

/** Select a card with a click, the way a person does before moving it from the keyboard. */
export async function selectCard(page: Page, cardId: string) {
  const at = centre(await resting(page, 'card-' + cardId))
  // A card that is already the selection is left alone: a second click on it is a different gesture.
  const selected = await page.evaluate(id => {
    const chosen = (window as any).slate?.v2?.getSelectedNodes?.() ?? []
    return chosen.length === 1 && chosen[0].id === id
  }, 'card-' + cardId)
  if (selected) return
  await page.mouse.click(at.x, at.y)
  // A click that follows a selection too closely can be undone by the note's own drag-end timer.
  await page.waitForTimeout(500)
}

/**
 * Move a card from the keyboard: select it, step with the arrow keys until the canvas
 * announces the lane, and press Enter. Returns false when no arrow reaches that lane.
 */
export async function keyboardMove(page: Page, cardId: string, laneLabel: string) {
  await selectCard(page, cardId)
  const said = async () => (await announced(page).allTextContents()).join(' ')
  for (const key of ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp']) {
    for (let step = 0; step < 6; step++) {
      const before = await said()
      await page.keyboard.press(key)
      // The canvas answers every arrow it takes with an announcement; give it a moment to speak.
      let now = before
      for (let wait = 0; wait < 8 && now === before; wait++) { await page.waitForTimeout(75); now = await said() }
      if (now.includes(' to ' + laneLabel + ':')) {
        await page.keyboard.press('Enter')
        return true
      }
      if (now === before || /has no lane|can't move|is back in/.test(now)) break
    }
    await page.keyboard.press('Escape')
  }
  return false
}

/** A finger, through Chromium's device input. The page's context must have touch enabled. */
export async function finger(page: Page) {
  const device = await page.context().newCDPSession(page)
  const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel', points: { x: number; y: number }[]) =>
    device.send('Input.dispatchTouchEvent', { type, touchPoints: points })
  return {
    touch,
    /** Put a finger on a card, carry it to a lane and lift it. */
    async dragCard(cardId: string, laneId: string) {
      const from = centre(await resting(page, 'card-' + cardId))
      const to = await inLane(page, laneId)
      await touch('touchStart', [from])
      for (let i = 1; i <= 10; i++) await touch('touchMove', [{ x: from.x + (to.x - from.x) * i / 10, y: from.y + (to.y - from.y) * i / 10 }])
      await page.waitForTimeout(80)
      await touch('touchEnd', [])
    },
  }
}

/** Rename a card or a lane in place: double-click the note, type, Enter. */
export async function renameInPlace(page: Page, id: string, text: string) {
  const at = centre(await resting(page, id))
  await page.mouse.dblclick(at.x, at.y)
  const editor = page.locator('.sb-inline-editor')
  await expect(editor).toBeVisible()
  await page.keyboard.press('ControlOrMeta+A')
  await page.keyboard.type(text)
  await page.keyboard.press('Enter')
  await expect(editor).toHaveCount(0)
}

/** The conversation's message box: the same one on a drawing, a workshop and a map. */
export const messageBox = (page: Page) => conversation(page).getByRole('textbox', { name: 'Message Slatebox', exact: true })
/** A starter the conversation offers. What it offers says what the slate holds: steps on a map, lanes and cards on a workshop. */
export const starter = (page: Page, name: string | RegExp) =>
  conversation(page).getByLabel('Starter messages').getByRole('button', { name, exact: typeof name === 'string' })

/** Pages whose conversation this test closed itself, until they next load. */
const closedByTest = new WeakSet<Page>()

/**
 * The slate's conversation, ready to type in. Beside a wide canvas (1000px and up) it is open
 * when the slate opens, and this insists on that: it does not open it for the page. It is
 * opened here only where a person would have to: on a narrower canvas, or after the test
 * closed it.
 */
export async function openConversation(page: Page) {
  const panel = conversation(page)
  const ask = page.getByRole('button', { name: 'Ask Slatebox', exact: true })
  // Either the panel or its button is there once the page is ready (a closing dialog hides both for a moment).
  await expect(panel.or(ask).first()).toBeVisible()
  const wide = await page.evaluate(() => innerWidth >= 1000)
  if (wide && !closedByTest.has(page)) await expect(panel, 'the conversation starts open beside a wide canvas').toBeVisible()
  else if (!await panel.isVisible()) await ask.click()
  closedByTest.delete(page)
  await expect(panel).toBeVisible()
  return panel
}

/** Send one message in the workshop's conversation and wait for its preview. */
export async function previewWorkshopMessage(page: Page, message: string) {
  const panel = await openConversation(page)
  await panel.getByRole('textbox').fill(message)
  await panel.getByRole('button', { name: 'Preview changes', exact: true }).click()
  await expect(panel.getByRole('button', { name: 'Keep changes', exact: true })).toBeEnabled()
  return panel
}

/** Send one message and keep or discard what it proposes. */
export async function sendWorkshopMessage(page: Page, message: string, decision: 'Keep changes' | 'Discard preview' = 'Keep changes') {
  const panel = await previewWorkshopMessage(page, message)
  await panel.getByRole('button', { name: decision, exact: true }).click()
  await expect(panel.getByRole('textbox')).toBeVisible()
  return panel
}

/**
 * The lanes the canvas offers a card while it is held: pick the card up, read which lane
 * columns are outlined as destinations, and put it back with Escape. Nothing is moved. A
 * person who may not edit cannot pick a card up, so nothing is offered to them.
 */
export async function offeredLanes(page: Page, cardId: string) {
  const from = centre(await resting(page, 'card-' + cardId))
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x + 6, from.y + 6, { steps: 3 })
  await page.mouse.move(from.x + 14, from.y + 10, { steps: 3 })
  await page.waitForTimeout(150)
  // The canvas says which lanes take the held card on each lane's column (data-workshop-drop).
  const offered = await page.evaluate(() => [...document.querySelectorAll('#slateCanvas [data-node-id^="column-"]')]
    .filter(column => ['open', 'over'].includes(column.getAttribute('data-workshop-drop') ?? ''))
    .map(column => column.getAttribute('data-node-id')!.slice('column-'.length)))
  await page.keyboard.press('Escape')
  await page.mouse.up()
  await resting(page, 'card-' + cardId)
  return offered
}

/** Whether the canvas offers this card that lane, by the names on the notes. */
export async function isOffered(page: Page, cardLabel: string, laneLabel: string) {
  return (await offeredLanes(page, await cardIdNamed(page, cardLabel))).includes(await laneIdNamed(page, laneLabel))
}

/** Try a drag and report whether the card ended in that lane. */
export async function tryDragNamed(page: Page, cardLabel: string, laneLabel: string) {
  const cardId = await cardIdNamed(page, cardLabel)
  await dragCard(page, cardId, await laneIdNamed(page, laneLabel))
  await resting(page, 'card-' + cardId)
  return (await laneOfCard(page, cardId)) === laneLabel
}

/** Select a lane (a station on a map) with a click on its header. */
export async function selectLane(page: Page, laneId: string) {
  const at = centre(await resting(page, 'lane-' + laneId))
  await page.mouse.click(at.x, at.y)
  await page.waitForTimeout(500)
}
export const selectLaneNamed = async (page: Page, label: string) => selectLane(page, await laneIdNamed(page, label))
export const selectCardNamed = async (page: Page, label: string) => selectCard(page, await cardIdNamed(page, label))
/** The slate's name in the toolbar. A workshop's title is its slate's name. */
export const slateTitle = (page: Page) => page.locator('.sb-board-name strong')
/** Close the conversation, as a person on a phone does to give the canvas the screen. */
export async function closeConversation(page: Page) {
  const panel = conversation(page)
  if (await panel.isVisible()) await panel.getByRole('button', { name: 'Close conversation', exact: true }).click()
  await expect(panel).toHaveCount(0)
  closedByTest.add(page)
  page.once('load', () => closedByTest.delete(page))
}

/** Wait until this person may edit the workshop: the conversation, or its "Ask Slatebox" button, is there. */
export async function editable(page: Page) {
  await expect(conversation(page).or(page.getByRole('button', { name: 'Ask Slatebox', exact: true })).first()).toBeVisible()
}

/** Join through the edit link's "Join to edit" and wait until the canvas takes this person's moves. */
export async function joinToEdit(page: Page) {
  await workshopStatus(page).getByRole('button', { name: 'Join to edit', exact: true }).click()
  await editable(page)
}
