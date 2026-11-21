import { expect, test, type Browser, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { card, dragCard, note, openConversation, resting, slateKey, storedWorkshop, workshopReady, workshopStatus } from './app-native-workshop.shared'
import { harness, harnessOn } from './app-trade-harness.shared'

/**
 * Connected cards (owner decision 2026-11-21, test.slatebox.com): notes joined by lines become
 * cards and keep their lines, and cards are joined to notes and to each other with the plugs. On
 * the real app the server saves the board's lines with the trade, a teammate sees every line
 * live, a reload keeps them, and the canvas's undo takes a line back.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
const shots = process.env.CONNECT_SHOTS

const board: Workshop = {
  version: 1, title: 'Connected cards',
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

async function joinAsEditor(browser: Browser, owner: Page) {
  const link = await shareAs(owner, 'edit')
  const context = await browser.newContext({ viewport: owner.viewportSize()! })
  const page = await context.newPage()
  await page.goto(link.href)
  await dismissWelcome(page)
  await workshopReady(page)
  await workshopStatus(page).getByRole('button', { name: 'Join to edit', exact: true }).click()
  await expect.poll(() => userId(page)).toBeTruthy()
  return { context, page, id: (await userId(page))! }
}

/** Two ordinary notes beside the board, made as a person's would be (sent and saved), then everything in view. */
async function addNotes(page: Page) {
  // The page frames the board for its first few seconds; the view is the person's after that.
  await page.waitForTimeout(4000)
  const ids = await page.evaluate(() => {
    const slate = (window as any).slate.v2
    const column = slate.nodes.one('column-now').options
    const x = column.x - 300
    const a = slate.addNode({ id: 'callsam', x, y: column.y + 40, width: 180, height: 70, text: 'Call Sam' })
    const b = slate.addNode({ id: 'bookroom', x, y: column.y + 260, width: 180, height: 70, text: 'Book room' })
    return [a.id, b.id]
  })
  await page.waitForTimeout(400)
  await page.evaluate(() => (window as any).slate.v2.fitToContent?.())
  await page.waitForTimeout(400)
  return ids as [string, string]
}

const boxOf = (page: Page, id: string) => page.evaluate(key => {
  const el = document.querySelector(`#slateCanvas [data-node-id="${key}"]`) as SVGGraphicsElement | null
  const r = el?.getBoundingClientRect()
  return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null
}, id)

async function carry(page: Page, id: string, to: { x: number; y: number }) {
  const from = await resting(page, id)
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 14 })
  await page.mouse.up()
}

/** Select a note or card, press the plug on its right edge, and let go on another. */
async function plug(page: Page, from: string, to: string) {
  const at = await resting(page, from)
  await page.mouse.click(at.x + at.width / 2, at.y + at.height / 2)
  await page.waitForTimeout(350)
  const dot = await page.evaluate(key => {
    const el = (window as any).slate.v2.nodes.one(key)?.connectionHandles?.right?.node as SVGElement | undefined
    const r = el?.getBoundingClientRect()
    return r && r.width > 3 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null
  }, from)
  expect(dot, 'the plug on the right of ' + from).not.toBeNull()
  const target = await resting(page, to)
  await page.mouse.move(dot!.x, dot!.y)
  await page.mouse.down()
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 14 })
  await page.mouse.up()
  await page.waitForTimeout(400)
}

/** The board's lines as the server holds them. */
const boardLines = async (page: Page, key: string) => ((await storedWorkshop(page, key)).lines ?? []).map((l: any) => l.parentId + '>' + l.childId).join(' ')
/** The drawing's connectors as the server holds them. */
const drawingLines = async (page: Page, key: string) => (await getSlate(page, key)).nodes
  .flatMap((n: any) => (n.relationships?.associations ?? []).map((a: any) => a.parentId + '>' + a.childId)).join(' ')
const lineIdOf = async (page: Page, key: string, parentId: string, childId: string) =>
  ((await storedWorkshop(page, key)).lines ?? []).find((l: any) => l.parentId === parentId && l.childId === childId)?.id as string

/** Whether a drawn line `id` runs between the notes `a` and `b` as this screen draws them. */
const joins = (page: Page, id: string, a: string, b: string) => page.evaluate(([key, one, two]) => {
  const path = document.querySelector(`#slateCanvas [data-connection-id="${CSS.escape(key)}"]`) as SVGPathElement | null
  const boxA = document.querySelector(`#slateCanvas [data-node-id="${one}"]`)?.getBoundingClientRect()
  const boxB = document.querySelector(`#slateCanvas [data-node-id="${two}"]`)?.getBoundingClientRect()
  if (!path || !boxA || !boxB || typeof path.getTotalLength !== 'function') return false
  const m = path.getScreenCTM()!
  const client = (p: DOMPoint) => ({ x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f })
  const ends = [client(path.getPointAtLength(0)), client(path.getPointAtLength(path.getTotalLength()))]
  const slack = 30
  const near = (p: { x: number; y: number }, r: DOMRect) => p.x >= r.x - slack && p.x <= r.right + slack && p.y >= r.y - slack && p.y <= r.bottom + slack
  return (near(ends[0], boxA) && near(ends[1], boxB)) || (near(ends[0], boxB) && near(ends[1], boxA))
}, [id, a, b])

async function shot(page: Page, name: string) {
  if (!shots) return
  const width = page.viewportSize()?.width ?? 0
  await page.screenshot({ path: `${shots}/${name}-${width}.png` })
}

test('notes joined by lines become cards and keep them, cards join notes and each other: saved, seen by a teammate, kept on reload, undone', async ({ page, browser }) => {
  let id: string | null = null, guest: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    const [sam, room] = await addNotes(page)
    await plug(page, sam, room)
    await expect.poll(() => drawingLines(page, owner.key)).toBe(`${sam}>${room}`)
    guest = await joinAsEditor(browser, page)
    await expect(note(guest.page, room)).toContainText('Book room')

    // A note joined by a line, dropped on Later, is a card there and keeps the line.
    await page.waitForTimeout(600)
    const later = await resting(page, 'column-later')
    await carry(page, sam, { x: later.x + later.width / 2, y: later.y + later.height - 24 })
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.id + '@' + c.laneId).join(' '))
      .toBe(`alpha@now beta@next ${sam}@later`)
    await expect.poll(() => boardLines(page, owner.key)).toBe(`${sam}>${room}`)
    await expect.poll(() => drawingLines(page, owner.key)).toBe('')
    await expect(page.locator('#slateCanvas').getByText('stays a note')).toHaveCount(0)
    const samLine = await lineIdOf(page, owner.key, sam, room)
    await expect.poll(() => joins(page, samLine, 'card-' + sam, room)).toBe(true)
    // The teammate sees the card joined to the note.
    await expect(card(guest.page, sam)).toContainText('Call Sam')
    await expect.poll(() => joins(guest!.page, samLine, 'card-' + sam, room)).toBe(true)
    await shot(page, 'note-with-line-is-a-card')

    // A line from the card Alpha to the note, drawn with Alpha's plug.
    await plug(page, 'card-alpha', room)
    await expect.poll(() => boardLines(page, owner.key)).toBe(`${sam}>${room} alpha>${room}`)
    const alphaLine = await lineIdOf(page, owner.key, 'alpha', room)
    await expect.poll(() => joins(page, alphaLine, 'card-alpha', room)).toBe(true)
    await expect.poll(() => joins(guest!.page, alphaLine, 'card-alpha', room)).toBe(true)
    // Undo takes that line back, redo draws it again; nothing else changes.
    await page.mouse.click(5, 300)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => boardLines(page, owner.key)).toBe(`${sam}>${room}`)
    await expect.poll(() => page.evaluate(key => Boolean(document.querySelector(`#slateCanvas [data-connection-id="${CSS.escape(key)}"]`)), alphaLine)).toBe(false)
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(() => boardLines(page, owner.key)).toBe(`${sam}>${room} alpha>${room}`)

    // Card to card: Alpha to the card the note became.
    await plug(page, 'card-alpha', 'card-' + sam)
    await expect.poll(() => boardLines(page, owner.key)).toBe(`${sam}>${room} alpha>${room} alpha>${sam}`)
    const cardLine = await lineIdOf(page, owner.key, 'alpha', sam)
    await expect.poll(() => joins(guest!.page, cardLine, 'card-alpha', 'card-' + sam)).toBe(true)

    // The card moves to Now: its lines follow, on both screens.
    await dragCard(page, sam, 'now')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.find((c: any) => c.id === sam)?.laneId).toBe('now')
    await resting(page, 'card-' + sam)
    await expect.poll(() => joins(page, samLine, 'card-' + sam, room)).toBe(true)
    await expect.poll(() => joins(page, cardLine, 'card-alpha', 'card-' + sam)).toBe(true)
    await expect.poll(() => joins(guest!.page, samLine, 'card-' + sam, room)).toBe(true)

    // A reload keeps every line.
    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect.poll(() => joins(page, samLine, 'card-' + sam, room)).toBe(true)
    await expect.poll(() => joins(page, alphaLine, 'card-alpha', room)).toBe(true)
    await expect.poll(() => joins(page, cardLine, 'card-alpha', 'card-' + sam)).toBe(true)

    // The card dropped on the canvas is a note again, with its lines: the line to the note is the
    // drawing's, the line from Alpha stays on the board.
    await page.waitForTimeout(4000)
    await page.evaluate(() => (window as any).slate.v2.fitToContent?.())
    await page.waitForTimeout(400)
    const roomBox = await resting(page, room)
    await carry(page, 'card-' + sam, { x: roomBox.x + roomBox.width / 2, y: roomBox.y + roomBox.height + 120 })
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.id).join(' ')).toBe('alpha beta')
    await expect.poll(() => drawingLines(page, owner.key)).toBe(`${sam}>${room}`)
    await expect.poll(() => boardLines(page, owner.key)).toBe(`alpha>${room} alpha>${sam}`)
    await expect.poll(() => joins(page, samLine, sam, room)).toBe(true)
    await expect.poll(() => joins(page, cardLine, 'card-alpha', sam)).toBe(true)
    await expect(note(guest.page, sam)).toContainText('Call Sam')
    await expect.poll(() => joins(guest!.page, samLine, sam, room)).toBe(true)
    await expect.poll(() => joins(guest!.page, cardLine, 'card-alpha', sam)).toBe(true)
    await shot(page, 'card-with-lines-is-a-note')

    // A joiner who opens it now draws the same lines.
    const fresh = await browser.newContext({ viewport: page.viewportSize()! })
    const viewer = await fresh.newPage()
    await viewer.goto(page.url())
    await dismissWelcome(viewer)
    await workshopReady(viewer)
    await expect.poll(() => joins(viewer, samLine, sam, room)).toBe(true)
    await expect.poll(() => joins(viewer, cardLine, 'card-alpha', sam)).toBe(true)
    await fresh.close()
  } finally {
    if (guest) { await removeTestGuest(guest.page, guest.id).catch(() => undefined); await guest.context.close() }
    await removeTestGuest(page, id)
  }
})

// Any note becomes a card (owner decision 2026-11-21, "no need to restrict this either").
test('an empty note dropped on a lane is an empty card: saved, counted, seen by a teammate, kept on reload, undone, presented', async ({ page, browser }) => {
  let id: string | null = null, guest: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  try {
    const owner = await openBoard(page)
    id = owner.id
    await page.waitForTimeout(4000)
    await page.evaluate(() => {
      const slate = (window as any).slate.v2
      const column = slate.nodes.one('column-now').options
      slate.addNode({ id: 'blank', x: column.x - 300, y: column.y + 40, width: 180, height: 70, text: '' })
    })
    await page.waitForTimeout(500)
    await page.evaluate(() => (window as any).slate.v2.fitToContent?.())
    await page.waitForTimeout(400)
    guest = await joinAsEditor(browser, page)
    const later = await resting(page, 'column-later')
    await carry(page, 'blank', { x: later.x + later.width / 2, y: later.y + later.height - 24 })
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.id + '@' + c.laneId + ':' + c.label).join(' '))
      .toBe('alpha@now:Alpha beta@next:Beta blank@later:')
    await expect(page.locator('#slateCanvas').getByText('needs some words')).toHaveCount(0)
    await expect(note(page, 'caption-later')).toContainText('1 card')
    await expect(card(page, 'blank')).toHaveAttribute('aria-label', 'Empty card, in Later')
    await expect(card(guest.page, 'blank')).toHaveCount(1)
    await expect(note(guest.page, 'caption-later')).toContainText('1 card')
    await shot(page, 'empty-note-is-a-card')

    // Undo: an empty note again; redo: an empty card.
    await page.mouse.click(5, 300)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.id).join(' ')).toBe('alpha beta')
    await expect.poll(async () => (await getSlate(page, owner.key)).nodes.map((n: any) => n.options.id + ':' + n.options.text).join(' ')).toBe('blank:')
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.map((c: any) => c.id).join(' ')).toBe('alpha beta blank')

    // A reload keeps it, and Present shows it without a fault.
    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect(card(page, 'blank')).toHaveCount(1)
    await expect(note(page, 'caption-later')).toContainText('1 card')
    await page.getByRole('button', { name: 'Present', exact: true }).click()
    await page.waitForTimeout(1500)
    await page.keyboard.press('Escape')
    expect(errors).toEqual([])
  } finally {
    if (guest) { await removeTestGuest(guest.page, guest.id).catch(() => undefined); await guest.context.close() }
    await removeTestGuest(page, id)
  }
})

// Content never refuses a trade (coordinator decisions, 2026-11-21): words with markup are kept
// verbatim and every view shows them as text.
test('markup typed on a note is a card whose words are text everywhere: the canvas, the card bar, the conversation, the read and Present', async ({ page }) => {
  let id: string | null = null
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('dialog', dialog => { errors.push('dialog ' + dialog.message()); dialog.dismiss().catch(() => undefined) })
  const words = '<img src=x onerror="window.__pwned=1"><script>window.__pwned=2</script>'
  const injected = () => page.evaluate(() => [(window as any).__pwned, document.querySelectorAll('img[src="x"], script:not([src])').length > 0 &&
    [...document.querySelectorAll('script:not([src])')].some(el => el.textContent?.includes('__pwned'))])
  try {
    const owner = await openBoard(page)
    id = owner.id
    await page.waitForTimeout(4000)
    await page.evaluate(w => {
      const slate = (window as any).slate.v2
      const column = slate.nodes.one('column-now').options
      slate.addNode({ id: 'markup', x: column.x - 300, y: column.y + 40, width: 220, height: 80, text: w })
    }, words)
    await page.waitForTimeout(500)
    await page.evaluate(() => (window as any).slate.v2.fitToContent?.())
    await page.waitForTimeout(400)
    const later = await resting(page, 'column-later')
    await carry(page, 'markup', { x: later.x + later.width / 2, y: later.y + later.height - 24 })
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.find((c: any) => c.id === 'markup')?.label).toBe(words)
    // The canvas draws the words as text.
    await expect(card(page, 'markup')).toContainText('<script>')
    // The card bar names it as text.
    const spot = await resting(page, 'card-markup')
    await page.mouse.click(spot.x + spot.width / 2, spot.y + spot.height / 2)
    await expect(page.getByRole('toolbar', { name: 'Card: ' + words })).toBeVisible()
    // The conversation, with the card selected, names it as text.
    const panel = await openConversation(page)
    await expect(panel.getByText('Selected card · ' + words, { exact: false })).toBeVisible()
    // The read (what an agent's exec gets) holds the words as data.
    expect((await getSlate(page, owner.key)).creative.model.workshop.cards.find((c: any) => c.id === 'markup').label).toBe(words)
    // Present shows it, still as text.
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Present', exact: true }).click()
    await page.waitForTimeout(2000)
    await page.keyboard.press('Escape')
    expect(await injected()).toEqual([undefined, false])
    expect(errors).toEqual([])
    await shot(page, 'markup-card')
  } finally {
    await removeTestGuest(page, id)
  }
})

// The page that took a card off the lanes went away before it told the room: a teammate's open
// screen still gets the note's lines, from the server's record of the trade.
test('a card with lines taken off the lanes on a page closed at once: an open screen gets the note and its lines', async ({ page, browser }) => {
  test.skip(!harnessOn, 'Needs the trade harness (SLATEBOX_TRADE_HARNESS=1): the server\'s answer is held while the page closes.')
  let id: string | null = null, guest: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const owner = await openBoard(page)
    id = owner.id
    const [sam, room] = await addNotes(page)
    await plug(page, 'card-alpha', room)
    await expect.poll(() => boardLines(page, owner.key)).toBe(`alpha>${room}`)
    guest = await joinAsEditor(browser, page)
    const alphaLine = await lineIdOf(page, owner.key, 'alpha', room)
    await expect.poll(() => joins(guest!.page, alphaLine, 'card-alpha', room)).toBe(true)
    await page.waitForTimeout(800)
    // What the server answers is held back; the page closes before it hears that the trade was saved.
    await harness('/hold?which=app&ms=4000')
    const samBox = await resting(page, sam)
    await carry(page, 'card-alpha', { x: samBox.x + samBox.width / 2, y: samBox.y + samBox.height + 200 })
    await page.waitForTimeout(300)
    await page.close({ runBeforeUnload: false })
    await expect.poll(async () => (await storedWorkshop(guest!.page, owner.key)).cards.map((c: any) => c.id).join(' '), { timeout: 20_000 }).toBe('beta')
    await expect(note(guest.page, 'alpha')).toContainText('Alpha', { timeout: 20_000 })
    await expect.poll(() => joins(guest!.page, alphaLine, 'alpha', room), { timeout: 20_000 }).toBe(true)
    // And someone who opens the slate now draws it too.
    const fresh = await browser.newContext({ viewport: guest.page.viewportSize()! })
    const viewer = await fresh.newPage()
    await viewer.goto(guest.page.url())
    await dismissWelcome(viewer)
    await workshopReady(viewer)
    await expect.poll(() => joins(viewer, alphaLine, 'alpha', room), { timeout: 20_000 }).toBe(true)
    await fresh.close()
  } finally {
    if (guest) { await removeTestGuest(guest.page, guest.id).catch(() => undefined); await guest.context.close() }
    if (!page.isClosed()) await removeTestGuest(page, id)
  }
})
