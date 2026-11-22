import { expect, test, type Page } from '@playwright/test'

/**
 * Any note becomes a card (owner decision 2026-11-21: "no need to restrict this either"). An empty
 * note dropped on a lane is an empty card there, counted in the lane, renamed in place like any
 * card, and an empty note again off the lanes. A note's picture and link go with the card and come
 * back with the note.
 *
 * Fixture (tests/fixtures/native-workshop.html): the note "plain" beside lanes Now and Later.
 */

async function open(page: Page) {
  await page.goto('/tests/fixtures/native-workshop.html')
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.waitForTimeout(150)
}
const box = (page: Page, id: string) => page.evaluate(key => (window as any).native.box(key), id) as Promise<{ x: number; y: number; width: number; height: number } | null>
const cards = (page: Page) => page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId + (c.label ? '' : '(empty)')).join(' ') as string)
const text = (page: Page, id: string) => page.evaluate(key => (window as any).native.slate.nodes.one(key)?.options.text, id)
const live = (page: Page) => page.locator('#slate [aria-live]')
async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column!.x + column!.width / 2, y: column!.y + column!.height * 0.85 }
}
async function drag(page: Page, id: string, to: { x: number; y: number }) {
  const from = await box(page, id)
  await page.mouse.move(from!.x + from!.width / 2, from!.y + from!.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
  await page.mouse.up()
}
async function resting(page: Page, id: string) {
  let last = await box(page, id)
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100)
    const next = await box(page, id)
    if (last && next && Math.abs(next.x - last.x) < 0.5 && Math.abs(next.y - last.y) < 0.5) return next
    last = next
  }
  throw new Error(id + ' never came to rest')
}
const client = (page: Page, world: { x: number; y: number }) => page.evaluate(p => (window as any).native.slate.worldToClient(p), world)

test('an empty note dropped on a lane is an empty card there; it is renamed in place, and off the lanes it is an empty note', async ({ page }) => {
  await open(page)
  await page.evaluate(() => (window as any).native.slate.addNode({ id: 'blank', x: 60, y: 260, width: 160, height: 80, text: '' }))
  await page.waitForTimeout(300)
  await drag(page, 'blank', await inLane(page, 'now'))
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now blank@now(empty)')
  await expect(live(page)).toHaveText('The empty card is now a card in Now. 4 cards.')
  await expect.poll(() => text(page, 'caption-now')).toBe('4 cards')
  const drawn = await resting(page, 'card-blank')
  const alpha = await box(page, 'card-alpha')
  // Drawn as a card like the others: the same width as its neighbours.
  expect(Math.round(drawn.width)).toBe(Math.round(alpha!.width))
  await expect(page.locator('#slate [data-node-id="card-blank"]')).toHaveAttribute('aria-label', 'Empty card, in Now')
  expect(await page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes.map((n: any) => n.options.id))).toEqual(['plain'])

  // Off the lanes: an empty note again.
  await drag(page, 'card-blank', await client(page, { x: 60, y: 520 }))
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
  await expect.poll(() => text(page, 'blank')).toBe('')
  // Undo puts the empty card back, redo takes it off again.
  await page.mouse.click(5, 5)
  await page.keyboard.press('ControlOrMeta+z')
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now blank@now(empty)')
  await page.keyboard.press('ControlOrMeta+y')
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')

  // A card renamed to nothing is an empty card, and an empty card takes words in place.
  const a = await resting(page, 'card-alpha')
  await page.mouse.dblclick(a.x + a.width / 2, a.y + a.height / 2)
  await expect(page.locator('.sb-inline-editor')).toBeVisible()
  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => (window as any).native.board.value.cards[0].label)).toBe('')
  await page.mouse.dblclick(a.x + a.width / 2, a.y + a.height / 2)
  await expect(page.locator('.sb-inline-editor')).toBeVisible()
  await page.keyboard.type('Apollo')
  await page.keyboard.press('Enter')
  await expect.poll(() => page.evaluate(() => (window as any).native.board.value.cards[0].label)).toBe('Apollo')
})

test('a note with a picture and a link becomes a card, and the note gets both back', async ({ page }) => {
  await open(page)
  await page.evaluate(() => {
    const note = (window as any).native.slate.nodes.one('plain')
    note.options.link = { type: 'externalUrl', data: { url: 'https://example.org/x' }, show: true }
    note.options.image = 'https://example.org/picture.png'
    note.options.imageOrigWidth = 640
    note.options.imageOrigHeight = 480
  })
  await drag(page, 'plain', await inLane(page, 'now'))
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
  expect(await page.evaluate(() => (window as any).native.board.value.cards.at(-1).asNote)).toMatchObject({
    image: { src: 'https://example.org/picture.png', width: 640, height: 480 }, link: { type: 'externalUrl', data: { url: 'https://example.org/x' }, show: true } })
  await resting(page, 'card-plain')
  await drag(page, 'card-plain', await client(page, { x: 60, y: 520 }))
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
  expect(await page.evaluate(() => { const o = (window as any).native.slate.nodes.one('plain').options; return { image: o.image, link: o.link } })).toEqual({
    image: 'https://example.org/picture.png', link: { type: 'externalUrl', data: { url: 'https://example.org/x' }, show: true } })
})

test('a note with words longer than a card shows is a card with the first of them, and the note gets them all back', async ({ page }) => {
  await open(page)
  const words = 'word '.repeat(30).trim()
  await page.evaluate(w => (window as any).native.slate.addNode({ id: 'long', x: 60, y: 260, width: 200, height: 120, text: w }), words)
  await page.waitForTimeout(300)
  await drag(page, 'long', await inLane(page, 'now'))
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now long@now')
  expect((await text(page, 'card-long'))!.length).toBeLessThanOrEqual(80)
  await resting(page, 'card-long')
  await drag(page, 'card-long', await client(page, { x: 60, y: 560 }))
  await expect.poll(() => text(page, 'long')).toBe(words)
})

// Content never refuses a trade (coordinator decisions, 2026-11-21).
test('markup typed on a note is a card with those very words, shown as text, never run', async ({ page }) => {
  await open(page)
  const words = '<img src=x onerror="window.__pwned=1"><b>Hi</b>'
  await page.evaluate(w => (window as any).native.slate.addNode({ id: 'mk', x: 60, y: 260, width: 200, height: 80, text: w }), words)
  await page.waitForTimeout(300)
  await drag(page, 'mk', await inLane(page, 'now'))
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now mk@now')
  expect(await page.evaluate(() => (window as any).native.board.value.cards.at(-1).label)).toBe(words)
  await expect(page.locator('#slate [data-node-id="card-mk"]')).toContainText('<b>Hi</b>')
  expect(await page.evaluate(() => [(window as any).__pwned, document.querySelectorAll('#slate img[src="x"], #slate b').length])).toEqual([undefined, 0])
})

test('an old note whose id a card cannot have is a card, and the note comes back under its own id', async ({ page }) => {
  await open(page)
  await page.evaluate(() => (window as any).native.slate.addNode({ id: 'old.note id', x: 60, y: 260, width: 160, height: 80, text: 'Old' }))
  await page.waitForTimeout(300)
  await drag(page, 'old.note id', await inLane(page, 'now'))
  await expect.poll(() => page.evaluate(() => (window as any).native.board.value.cards.at(-1))).toMatchObject({ id: 'card-1', noteId: 'old.note id', label: 'Old' })
  const change = await page.evaluate(() => (window as any).native.log.changes.at(-1).change)
  expect(change).toMatchObject({ cardId: 'card-1', noteToCard: { noteId: 'old.note id' } })
  await resting(page, 'card-card-1')
  await drag(page, 'card-card-1', await client(page, { x: 60, y: 520 }))
  await expect.poll(() => text(page, 'old.note id')).toBe('Old')
})

test('a note with a picture held in the page is a card; the note gets the picture back', async ({ page }) => {
  await open(page)
  const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  await page.evaluate(s => { const n = (window as any).native.slate.nodes.one('plain'); n.options.image = s; n.options.imageOrigWidth = 1; n.options.imageOrigHeight = 1 }, src)
  await drag(page, 'plain', await inLane(page, 'now'))
  await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
  expect(await page.evaluate(() => (window as any).native.board.value.cards.at(-1).asNote.image.src)).toBe(src)
  await resting(page, 'card-plain')
  await drag(page, 'card-plain', await client(page, { x: 60, y: 520 }))
  await expect.poll(() => page.evaluate(() => (window as any).native.slate.nodes.one('plain')?.options.image)).toBe(src)
})
