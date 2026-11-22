import { expect, test, type Page } from '@playwright/test'

/**
 * Cards are notes. An ordinary note dropped on a lane becomes a card there, under the lane's
 * rules; a card dropped on empty canvas becomes an ordinary note again. Each is one undo step.
 *
 * Fixture (tests/fixtures/native-workshop.html): the ordinary note "plain" ("Ordinary note",
 * #f0d399) beside lanes Now and Later; Later holds one card; Alpha, Beta and Gamma start in
 * Now, and Gamma may never leave it.
 */

async function open(page: Page, query = '') {
  await page.goto('/tests/fixtures/native-workshop.html' + query)
  await page.waitForFunction(() => (window as any).native?.ready === true)
  // The slate announces the fixture's own note a moment after adding it; let that be said first.
  await page.waitForTimeout(150)
}

const box = (page: Page, id: string) =>
  page.evaluate(key => (window as any).native.box(key) as { x: number; y: number; width: number; height: number } | null, id)
const at = (page: Page, id: string) =>
  page.evaluate(key => (window as any).native.at(key) as { x: number; y: number; width: number; height: number; text: string } | null, id)
const cards = (page: Page) =>
  page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string)
const text = async (page: Page, id: string) => (await at(page, id))?.text
const saved = (page: Page) => page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes
  .map((n: any) => ({ id: n.options.id, text: n.options.text, x: Math.round(n.options.xPos), y: Math.round(n.options.yPos), fill: n.options.backgroundColor })))
const journal = (page: Page) => page.evaluate(() => {
  const { log } = (window as any).native
  return {
    changes: log.changes.map((entry: any) => entry.change),
    refusals: log.refusals,
    sent: log.sent.map((pkg: any) => pkg.type) as string[],
  }
})
const undoSteps = (page: Page) => page.evaluate(() => (window as any).native.slate.undoRedo.undoStack.length as number)
/** The undo history once the fixture's own note (added as the page opened) has been recorded after its pause. */
async function settledSteps(page: Page) {
  await page.waitForTimeout(700)
  return undoSteps(page)
}
const live = (page: Page) => page.locator('#slate [aria-live]')
const client = (page: Page, world: { x: number; y: number }) =>
  page.evaluate(point => (window as any).native.slate.worldToClient(point) as { x: number; y: number }, world)

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
  let last = await at(page, id)
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(100)
    const next = await at(page, id)
    if (last && next && next.x === last.x && next.y === last.y) return next
    last = next
  }
  throw new Error(id + ' never came to rest')
}

/** The painted fill of a note's shape. */
const fill = (page: Page, id: string) => page.locator(`#slate [data-node-id="${id}"] path, #slate [data-node-id="${id}"] rect`).first()
  .evaluate(el => getComputedStyle(el).fill || el.getAttribute('fill'))

test.describe('an ordinary note dropped on a lane becomes a card', () => {
  test('the lane takes it: the note leaves the drawing as one undo step and the card keeps its words, id and look', async ({ page }) => {
    await open(page)
    const before = await settledSteps(page)
    const start = await at(page, 'plain')
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await expect(page.locator('#slate [data-node-id="card-plain"]')).toBeVisible()
    await expect(page.locator('#slate [data-node-id="plain"]')).toHaveCount(0)
    expect(await saved(page)).toEqual([])
    await expect.poll(() => text(page, 'caption-now')).toBe('4 cards')
    expect(await text(page, 'card-plain')).toBe('Ordinary note')
    // It looks as it did as a note.
    expect(await fill(page, 'card-plain')).toBe(await page.evaluate(() => 'rgb(240, 211, 153)'))
    const { changes, sent } = await journal(page)
    // (Restated 2026-11-19, cards-fix: the change also carries the note's shape and size, so the
    // card becomes the same note again on its way back.)
    expect(changes).toEqual([{ cardId: 'plain', laneId: 'now', noteToCard: { noteId: 'plain', label: 'Ordinary note',
      look: { backgroundColor: '#f0d399', textColor: '#24372d', fontFamily: 'Arial, sans-serif', fontSize: 16, borderColor: '#627569', borderWidth: 1 },
      asNote: { shape: 'roundedrectangle', width: 160, height: 80 } } }])
    // Collaborators hear that the note left the drawing, and nothing about a move.
    expect(sent).toEqual(['onNodeDeleted'])
    await expect.poll(() => undoSteps(page)).toBe(before + 1)
    await expect(live(page)).toHaveText('Ordinary note is now a card in Now. 4 cards.')

    // Undo: the note is back where it started and the card leaves the board.
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    await expect.poll(() => saved(page)).toEqual([{ id: 'plain', text: 'Ordinary note', x: Math.round(start!.x), y: Math.round(start!.y), fill: '#f0d399' }])
    await expect(page.locator('#slate [data-node-id="card-plain"]')).toHaveCount(0)
    // (Restated 2026-11-22, boards S1: a change an undo or redo makes says so, so a host keeps quiet
    // about it: no "drag it off to get its shape back" for a step the person took back.)
    expect((await journal(page)).changes.at(-1)).toEqual({ cardId: 'plain', cardToNote: { noteId: 'plain' }, via: 'undo' })
    await expect.poll(() => text(page, 'caption-now')).toBe('3 cards')

    // Redo: a card again.
    await page.keyboard.press('ControlOrMeta+y')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await expect.poll(() => saved(page)).toEqual([])
    expect((await journal(page)).changes.at(-1)).toMatchObject({ cardId: 'plain', laneId: 'now', noteToCard: { noteId: 'plain', label: 'Ordinary note' }, via: 'undo' })
  })

  test('the lane refuses it: the note glides back and the lane says why, and nothing is saved, sent or recorded', async ({ page }) => {
    await open(page)
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await resting(page, 'card-alpha')
    const steps = await undoSteps(page)
    const start = await at(page, 'plain')
    await drag(page, 'plain', await inLane(page, 'later'))
    await expect(live(page)).toHaveText("Ordinary note can't go in Later. It already holds 1 of 1 card.")
    await expect.poll(() => text(page, 'caption-later')).toBe('It already holds 1 of 1 card.')
    await expect(page.locator('#slate [data-node-id="column-later"]')).toHaveAttribute('data-workshop-drop', 'refused')
    expect(await resting(page, 'plain')).toEqual(start)
    expect((await journal(page)).refusals.at(-1)).toEqual({ noteId: 'plain', laneId: 'later', reason: 'It already holds 1 of 1 card.' })
    expect(await cards(page)).toBe('alpha@later beta@now gamma@now')
    expect(await saved(page)).toEqual([{ id: 'plain', text: 'Ordinary note', x: Math.round(start!.x), y: Math.round(start!.y), fill: '#f0d399' }])
    expect((await journal(page)).sent).toEqual([])
    expect(await undoSteps(page)).toBe(steps)
  })

  // (Restated 2026-11-21, owner decision: a note joined to other notes by lines becomes a card
  // and keeps its lines. This test said the lane refused it; see native-workshop-lines.spec.ts.)
  test('a note with a line to another note becomes a card and keeps the line', async ({ page }) => {
    await open(page, '?defaultnote')
    await page.evaluate(() => {
      const { slate } = (window as any).native
      slate.nodes.one('plain').relationships.addAssociation(slate.nodes.one('default'), { id: 'plain-default' })
    })
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect(live(page)).toHaveText('Ordinary note is now a card in Now. 4 cards.')
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    expect(await page.evaluate(() => (window as any).native.board.value.lines.map((l: any) => l.id))).toEqual(['plain-default'])
    expect(await page.evaluate(() => (window as any).native.slate.nodes.one('card-plain').relationships.getAssociations().map((a: any) => a.id))).toEqual(['plain-default'])
  })

  // (Restated 2026-11-19, cards-fix: several notes dropped on a lane together now become cards
  // there, or are all refused with the reason; see "notes carried together" below. A note
  // dropped on a map still stays a note.)
  test('a note dropped on a map stays a note', async ({ page }) => {
    await open(page, '?map')
    await drag(page, 'plain', await inLane(page, 'finance'))
    await page.waitForTimeout(300)
    expect((await saved(page)).map(note => note.id)).toEqual(['plain'])
    expect((await journal(page)).changes).toEqual([])
  })

  test('a viewer cannot turn a note into a card', async ({ page }) => {
    await open(page, '?readonly')
    await drag(page, 'plain', await inLane(page, 'now'))
    await page.waitForTimeout(300)
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    expect((await saved(page)).map(note => note.id)).toEqual(['plain'])
    expect((await journal(page)).changes).toEqual([])
  })

  test('by keyboard: a note nudged onto a lane becomes a card there', async ({ page }) => {
    await open(page)
    // Put the note just left of Now, then nudge it in with the arrow keys.
    const column = await at(page, 'column-now')
    await page.evaluate(({ x, y }) => { const note = (window as any).native.slate.nodes.one('plain'); note.position(x, y) }, { x: column!.x - 150, y: column!.y + 300 })
    await page.evaluate(() => { const { slate } = (window as any).native; slate.selectNodes([slate.nodes.one('plain')]) })
    for (let i = 0; i < 6; i++) await page.keyboard.press('Shift+ArrowRight')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await expect(live(page)).toHaveText('Ordinary note is now a card in Now. 4 cards.')
    // The card is the selection, so the person keeps their place.
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['card-plain'])
  })
})

test.describe('a card dropped on empty canvas becomes an ordinary note', () => {
  test('it leaves the board and is saved with the drawing where it was dropped, as one undo step; dropped on a lane it is a card again', async ({ page }) => {
    await open(page)
    const before = await settledSteps(page)
    const spot = await client(page, { x: 60, y: 420 })
    await drag(page, 'card-alpha', spot)
    await expect.poll(() => cards(page)).toBe('beta@now gamma@now')
    await expect(page.locator('#slate [data-node-id="card-alpha"]')).toHaveCount(0)
    await expect.poll(async () => (await saved(page)).map(note => note.id + ':' + note.text)).toEqual(['plain:Ordinary note', 'alpha:Alpha'])
    const note = (await saved(page)).find(item => item.id === 'alpha')!
    // Where it was let go: the card's middle under the pointer.
    expect(Math.abs(note.x + 114 - 60)).toBeLessThan(6)
    expect(Math.abs(note.y + 38 - 420)).toBeLessThan(6)
    // It looks as the card did, which is how the slate draws a note.
    expect(note.fill).toBe('#f0f0f0')
    const { changes, sent } = await journal(page)
    expect(changes).toEqual([{ cardId: 'alpha', cardToNote: { noteId: 'alpha' } }])
    expect(sent).toEqual(['onNodeAdded'])
    await expect.poll(() => undoSteps(page)).toBe(before + 1)
    await expect(live(page)).toHaveText('Alpha is now a note on the canvas. Now: 2 cards.')
    await expect.poll(() => text(page, 'caption-now')).toBe('2 cards')
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['alpha'])

    // Undo: a card in Now again, and no note.
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    // Back in its own place among the cards.
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    await expect.poll(async () => (await saved(page)).map(item => item.id)).toEqual(['plain'])
    expect((await journal(page)).changes.at(-1)).toMatchObject({ cardId: 'alpha', laneId: 'now', noteToCard: { noteId: 'alpha', label: 'Alpha' }, via: 'undo' })
    // Redo: a note again.
    await page.keyboard.press('ControlOrMeta+y')
    await expect.poll(() => cards(page)).toBe('beta@now gamma@now')
    await expect.poll(async () => (await saved(page)).map(item => item.id)).toEqual(['plain', 'alpha'])

    // The note dropped on Later is a card again, in Later.
    await resting(page, 'alpha')
    await drag(page, 'alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('beta@now gamma@now alpha@later')
    await expect.poll(async () => (await saved(page)).map(item => item.id)).toEqual(['plain'])
  })

  test('a card that must stay a card glides back and says why', async ({ page }) => {
    await open(page)
    const start = await at(page, 'card-gamma')
    await drag(page, 'card-gamma', await client(page, { x: 60, y: 420 }))
    await expect(live(page)).toHaveText('Gamma may only be in Now, so it stays a card.')
    expect(await resting(page, 'card-gamma')).toEqual(start)
    expect((await journal(page)).refusals.at(-1)).toEqual({ cardId: 'gamma', laneId: null, reason: 'Gamma may only be in Now, so it stays a card.' })
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    expect((await saved(page)).map(item => item.id)).toEqual(['plain'])
  })

  test('by keyboard: past the first or last lane is the canvas, and Enter makes the card a note there', async ({ page }) => {
    await open(page)
    await page.locator('#slate [data-node-id="card-beta"]').click()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(live(page)).toHaveText('Beta to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.')
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@now gamma@now')
    await expect.poll(async () => (await saved(page)).map(item => item.id)).toEqual(['plain', 'beta'])
    const later = await at(page, 'column-later'), note = (await saved(page)).find(item => item.id === 'beta')!
    expect(note.x).toBeGreaterThan(later!.x + later!.width)
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['beta'])
    expect((await journal(page)).changes).toEqual([{ cardId: 'beta', cardToNote: { noteId: 'beta' } }])
  })

  test('a viewer cannot take a card off the lanes', async ({ page }) => {
    await open(page, '?readonly')
    await drag(page, 'card-alpha', await client(page, { x: 60, y: 420 }))
    await page.waitForTimeout(400)
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    expect((await saved(page)).map(item => item.id)).toEqual(['plain'])
  })
})

test.describe('cards look like notes', () => {
  test('with no host style a card is filled, outlined and set exactly as an ordinary engine note', async ({ page }) => {
    await open(page, '?defaultnote')
    expect(await fill(page, 'card-alpha')).toBe(await fill(page, 'default'))
  })
})

// cards-fix (2026-11-19): what the hostile review of cards-are-notes found.
test.describe('two people, one note: the host has the last word', () => {
  test('a card that left the lanes for someone else first: this person\'s copy of the note goes, and the card is not brought back', async ({ page }) => {
    await open(page)
    // The host's save says someone else already took Alpha off the lanes; the host draws its board.
    await page.evaluate(() => {
      const native = (window as any).native
      native.answer = () => new Promise(resolve => setTimeout(() => {
        native.board.update({ ...native.board.value, cards: native.board.value.cards.filter((c: any) => c.id !== 'alpha') })
        resolve('taken')
      }, 50))
    })
    await drag(page, 'card-alpha', await client(page, { x: 60, y: 420 }))
    await expect.poll(async () => (await saved(page)).map(note => note.id)).toEqual(['plain'])
    await page.waitForTimeout(300)
    expect(await cards(page)).toBe('beta@now gamma@now')
    await expect(page.locator('#slate [data-node-id="card-alpha"]')).toHaveCount(0)
  })

  test('a refused trade puts the note back but never takes away a card the host has drawn since', async ({ page }) => {
    await open(page)
    // Someone else made this same note a card in Later first: the host draws that card, and its save of this drop is refused.
    await page.evaluate(() => {
      const native = (window as any).native
      native.answer = () => new Promise(resolve => setTimeout(() => {
        native.board.update({ ...native.board.value, cards: [...native.board.value.cards.filter((c: any) => c.id !== 'plain'), { id: 'plain', label: 'Ordinary note', laneId: 'later' }] })
        resolve(false)
      }, 50))
    })
    await drag(page, 'plain', await inLane(page, 'now'))
    await page.waitForTimeout(500)
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now plain@later')
    await expect(page.locator('#slate [data-node-id="card-plain"]')).toHaveCount(1)
  })

  test('someone else made the note a card first: the note is not brought back', async ({ page }) => {
    await open(page)
    await page.evaluate(() => {
      const native = (window as any).native
      native.answer = () => new Promise(resolve => setTimeout(() => {
        native.board.update({ ...native.board.value, cards: [...native.board.value.cards.filter((c: any) => c.id !== 'plain'), { id: 'plain', label: 'Ordinary note', laneId: 'later' }] })
        resolve('taken')
      }, 50))
    })
    await drag(page, 'plain', await inLane(page, 'now'))
    await page.waitForTimeout(500)
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now plain@later')
    expect(await saved(page)).toEqual([])
  })
})

test.describe('nothing the note had is lost on its way to a card and back', () => {
  // (Restated 2026-11-21, owner decision: a note with a link becomes a card and gets the link back;
  // it was refused here. See native-workshop-any-note.spec.ts.)
  test('line breaks, shape and size come back; a note with a link is a card too', async ({ page }) => {
    await open(page)
    await page.evaluate(() => {
      const { slate } = (window as any).native
      slate.addNode({ id: 'shaped', x: 60, y: 260, width: 120, height: 70, text: 'First line\nSecond line', shape: 'ellipse' })
    })
    await page.waitForTimeout(300)
    await drag(page, 'shaped', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now shaped@now')
    expect((await journal(page)).changes.at(-1)).toMatchObject({ noteToCard: { noteId: 'shaped', label: 'First line Second line',
      asNote: { text: 'First line\nSecond line', shape: 'ellipse', width: 120, height: 70 } } })
    // A screen reader hears what the eye sees: the oval is drawn as a card now, and comes back off the board.
    await expect(live(page)).toHaveText('First line Second line is now a card in Now. 4 cards. It was an oval: drag it off the board to get its oval back.')
    await resting(page, 'card-shaped')
    await drag(page, 'card-shaped', await client(page, { x: 60, y: 520 }))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    const back = await page.evaluate(() => { const o = (window as any).native.slate.nodes.one('shaped').options; return { text: o.text, shape: o.shape, width: o.width, height: o.height } })
    expect(back).toEqual({ text: 'First line\nSecond line', shape: 'ellipse', width: 120, height: 70 })
    await expect(live(page)).toHaveText('First line Second line is now a note on the canvas. Now: 3 cards. It is an oval again.')

    await page.evaluate(() => { (window as any).native.slate.nodes.one('plain').options.link = { type: 'externalUrl', data: { url: 'https://example.org/x' }, show: true } })
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect(live(page)).toHaveText('Ordinary note is now a card in Now. 4 cards.')
    expect(await page.evaluate(() => (window as any).native.board.value.cards.at(-1).asNote.link)).toEqual({ type: 'externalUrl', data: { url: 'https://example.org/x' }, show: true })
  })

  test('an undone trade sends where the card goes back, so every copy of the board puts it in its own place', async ({ page }) => {
    await open(page)
    await drag(page, 'card-beta', await client(page, { x: 60, y: 420 }))
    await expect.poll(() => cards(page)).toBe('alpha@now gamma@now')
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    expect((await journal(page)).changes.at(-1)).toMatchObject({ cardId: 'beta', laneId: 'now', noteToCard: { noteId: 'beta', label: 'Beta', before: 'gamma' }, via: 'undo' })
  })
})

test.describe('notes carried together, notes typed in a lane, and a card sent from the conversation', () => {
  test('several notes dropped on a lane together become cards there as one undo step; a lane that cannot take them all sends them all back and says why', async ({ page }) => {
    await open(page, '?defaultnote')
    const before = await settledSteps(page)
    await page.evaluate(() => { const { slate } = (window as any).native; slate.selectNodes([slate.nodes.one('plain'), slate.nodes.one('default')]) })
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now default@now')
    expect(await saved(page)).toEqual([])
    await expect.poll(() => undoSteps(page)).toBe(before + 1)
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    await expect.poll(async () => (await saved(page)).map(note => note.id).sort()).toEqual(['default', 'plain'])

    // Later holds one card: two notes cannot both go there.
    const starts = { plain: await resting(page, 'plain'), def: await resting(page, 'default') }
    await page.evaluate(() => { const { slate } = (window as any).native; slate.selectNodes([slate.nodes.one('plain'), slate.nodes.one('default')]) })
    await drag(page, 'plain', await inLane(page, 'later'))
    await expect(live(page)).toHaveText("Ordinary note and Default note can't go in Later. It has room for 1 more card.")
    expect(await resting(page, 'plain')).toEqual(starts.plain)
    expect(await resting(page, 'default')).toEqual(starts.def)
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
  })

  test('a note typed inside a lane becomes a card there; one the lane refuses moves out beside the board and the lane says why', async ({ page }) => {
    await open(page)
    const spot = await inLane(page, 'now')
    await page.mouse.dblclick(spot.x, spot.y)
    await page.waitForTimeout(300)
    await page.keyboard.type('Typed in Now')
    await page.keyboard.press('Enter')
    await expect.poll(() => page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.label + '@' + c.laneId).join(' '))).toBe('Alpha@now Beta@now Gamma@now Typed in Now@now')
    expect((await saved(page)).map(note => note.id)).toEqual(['plain'])

    // Later is full once Alpha is in it.
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toContain('alpha@later')
    await resting(page, 'card-alpha')
    const later = await inLane(page, 'later')
    await page.mouse.dblclick(later.x, later.y - 40)
    await page.waitForTimeout(300)
    await page.keyboard.type('No room')
    await page.keyboard.press('Enter')
    await expect.poll(() => text(page, 'caption-later')).toBe('It already holds 1 of 1 card.')
    const board = await page.evaluate(() => (window as any).native.board.bounds)
    await expect.poll(async () => (await saved(page)).find(item => item.text === 'No room')?.x ?? 0).toBeGreaterThan(board.x + board.width)
    expect(await page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.label + '@' + c.laneId).sort().join(' '))).toBe('Alpha@later Beta@now Gamma@now Typed in Now@now')
  })

  test('the host can send a card off the lanes, as the conversation does: it becomes a note beside the board, or says why it stays', async ({ page }) => {
    await open(page)
    const answer = await page.evaluate(() => (window as any).native.board.toCanvas('alpha'))
    expect(answer).toBeNull()
    await expect.poll(() => cards(page)).toBe('beta@now gamma@now')
    const board = await page.evaluate(() => (window as any).native.board.bounds)
    await expect.poll(async () => (await saved(page)).find(item => item.id === 'alpha')?.x ?? 0).toBeGreaterThan(board.x + board.width)
    expect((await journal(page)).changes.at(-1)!.cardId).toBe('alpha')
    expect(await page.evaluate(() => (window as any).native.board.toCanvas('gamma'))).toBe('Gamma may only be in Now, so it stays a card.')
    expect(await cards(page)).toBe('beta@now gamma@now')
  })
})

// cards-atomic (2026-11-19): on a slow network a person who traded and closed the page at once
// had told the room the note was gone while the host never saved the trade; everyone else then
// lost the note. A trade now shows on this screen at once, but reaches collaborators and the
// host's drawing save only once the host has saved it; refused, it was never seen elsewhere.
test.describe('a trade reaches collaborators only once the host has saved it', () => {
  /** The host's save of each change waits until the test answers it. */
  const holdSaves = (page: Page) => page.evaluate(() => {
    const native = (window as any).native
    native.pending = []
    native.answer = () => new Promise(resolve => native.pending.push(resolve))
  })
  const answerSaves = (page: Page, saved: unknown) => page.evaluate(value => {
    const native = (window as any).native
    for (const resolve of native.pending.splice(0)) resolve(value)
  }, saved)
  /** The document changes handed to the host's own drawing save. */
  const handed = (page: Page) => page.evaluate(() => (window as any).native.log.packages.map((pkg: any) => pkg.type)
    .filter((type: string) => ['onNodeAdded', 'onNodeDeleted', 'onSlateReplaced'].includes(type)) as string[])
  const heldSettled = (page: Page) => page.evaluate(() => {
    let done = false
    ;(window as any).native.slate.whenHeldSettled().then(() => { done = true })
    return new Promise<boolean>(resolve => setTimeout(() => resolve(done), 50))
  })

  test('note → card: shown here at once, sent only when saved, and the host may wait for it', async ({ page }) => {
    await open(page)
    await holdSaves(page)
    const before = await settledSteps(page)
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    expect(await saved(page)).toEqual([])
    await page.waitForTimeout(600)
    // Nothing has left this screen: not the note's removal, and not to the host's drawing save.
    expect((await journal(page)).sent).toEqual([])
    expect(await handed(page)).toEqual([])
    expect(await heldSettled(page)).toBe(false)
    await expect.poll(() => undoSteps(page)).toBe(before + 1)

    await answerSaves(page, true)
    await expect.poll(async () => (await journal(page)).sent).toEqual(['onNodeDeleted'])
    expect(await handed(page)).toEqual(['onNodeDeleted'])
    expect(await heldSettled(page)).toBe(true)
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    // Still one undo step: the save added none.
    expect(await undoSteps(page)).toBe(before + 1)
  })

  test('note → card refused: the note comes back and collaborators never heard of the trade', async ({ page }) => {
    await open(page)
    await holdSaves(page)
    const start = await at(page, 'plain')
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await answerSaves(page, false)
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    await expect.poll(async () => (await saved(page)).map(note => note.id)).toEqual(['plain'])
    expect((await at(page, 'plain'))!.x).toBe(start!.x)
    await page.waitForTimeout(400)
    expect((await journal(page)).sent).toEqual([])
    expect(await handed(page)).toEqual([])
    expect(await heldSettled(page)).toBe(true)
  })

  test('card → note: the note is sent only when saved, as it is then; refused, it leaves and nothing was sent', async ({ page }) => {
    await open(page)
    await holdSaves(page)
    await drag(page, 'card-alpha', await client(page, { x: 60, y: 420 }))
    await expect.poll(async () => (await saved(page)).map(note => note.id)).toEqual(['plain', 'alpha'])
    await page.waitForTimeout(600)
    expect((await journal(page)).sent).toEqual([])
    expect(await handed(page)).toEqual([])
    // Renamed while the save is on its way: the room hears of the note with its new words.
    await page.evaluate(() => (window as any).native.slate.nodes.one('alpha').options.text = 'Alpha renamed')
    await answerSaves(page, true)
    await expect.poll(async () => (await journal(page)).sent).toEqual(['onNodeAdded'])
    const added = await page.evaluate(() => (window as any).native.log.sent[0].data)
    expect(added.id).toBe('alpha')
    expect(added.nodeOptions.text).toBe('Alpha renamed')
    expect(await handed(page)).toEqual(['onNodeAdded'])

    // Beta's trade is refused: its note leaves this screen and the card is back; nothing more was sent.
    await drag(page, 'card-beta', await client(page, { x: 60, y: 560 }))
    await expect.poll(async () => (await saved(page)).map(note => note.id)).toEqual(['plain', 'alpha', 'beta'])
    await answerSaves(page, false)
    await expect.poll(() => cards(page)).toBe('beta@now gamma@now')
    await expect.poll(async () => (await saved(page)).map(note => note.id)).toEqual(['plain', 'alpha'])
    await page.waitForTimeout(400)
    expect((await journal(page)).sent).toEqual(['onNodeAdded'])
    expect(await handed(page)).toEqual(['onNodeAdded'])
  })
})
