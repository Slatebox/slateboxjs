import { expect, test, type Page } from '@playwright/test'

/**
 * Connected cards (owner decision 2026-11-21): notes joined by lines may become cards, and
 * cards can be joined to notes and to each other. A card keeps its lines wherever it goes: into a
 * lane, between lanes, as the rows of lanes reflow, and back onto the canvas as a note. Lines are
 * drawn with the plug as between any two notes, and undo takes them back.
 *
 * Fixture (tests/fixtures/native-workshop.html): the ordinary note "plain" (and with ?defaultnote,
 * "default" below it) beside lanes Now and Later; Later holds one card; Alpha, Beta and Gamma
 * start in Now, and Gamma may never leave it.
 */

type Box = { x: number; y: number; width: number; height: number }
type Point = { x: number; y: number }

async function open(page: Page, query = '?defaultnote') {
  await page.goto('/tests/fixtures/native-workshop.html' + query)
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.waitForTimeout(150)
}

const box = (page: Page, id: string) => page.evaluate(key => (window as any).native.box(key) as Box | null, id)
const cards = (page: Page) => page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string)
const lines = (page: Page) => page.evaluate(() => ((window as any).native.board.value.lines ?? []).map((l: any) => l.parentId + '>' + l.childId).join(' ') as string)
const changes = (page: Page) => page.evaluate(() => (window as any).native.log.changes.map((entry: any) => entry.change))
const sent = (page: Page) => page.evaluate(() => (window as any).native.log.sent.map((pkg: any) => pkg.type) as string[])
/** The connectors the saved drawing holds, as parent>child. */
const savedLines = (page: Page) => page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes
  .flatMap((n: any) => n.relationships.associations.map((a: any) => a.parentId + '>' + a.childId)).join(' ') as string)
const live = (page: Page) => page.locator('#slate [aria-live]')

/** Where a drawn connector starts and ends on screen, by its association id. */
const lineEnds = (page: Page, id: string) => page.evaluate(key => {
  const path = document.querySelector(`#slate [data-connection-id="${CSS.escape(key)}"]`) as SVGPathElement | null
  if (!path || typeof path.getTotalLength !== 'function') return null
  const length = path.getTotalLength()
  const m = path.getScreenCTM()!
  const client = (p: DOMPoint) => ({ x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f })
  return [client(path.getPointAtLength(0)), client(path.getPointAtLength(length))]
}, id)

// An end stops short of its note by the arrow's length.
const near = (point: Point, area: Box, slack = 24) =>
  point.x >= area.x - slack && point.x <= area.x + area.width + slack && point.y >= area.y - slack && point.y <= area.y + area.height + slack

/** The line `id` runs between the notes `a` and `b` as they are drawn now (either way round). */
async function joins(page: Page, id: string, a: string, b: string) {
  const ends = await lineEnds(page, id)
  const boxA = await box(page, a), boxB = await box(page, b)
  if (!ends || !boxA || !boxB) return false
  return (near(ends[0], boxA) && near(ends[1], boxB)) || (near(ends[0], boxB) && near(ends[1], boxA))
}

async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column!.x + column!.width / 2, y: column!.y + column!.height * 0.85 }
}

async function drag(page: Page, id: string, to: Point) {
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

/**
 * A person joins a note to another with its plugs, as the canvas lets them: select it, press the
 * plug on its right edge, carry it onto the other note and let go.
 */
async function plug(page: Page, from: string, to: string) {
  await page.evaluate(key => {
    const { slate } = (window as any).native
    slate.selectNodes([slate.nodes.one(key)])
  }, from)
  await page.waitForTimeout(250)
  const dot = await page.evaluate(key => {
    const node = (window as any).native.slate.nodes.one(key)
    const el = node.connectionHandles?.right?.node as SVGElement | undefined
    const r = el?.getBoundingClientRect()
    return r && r.width > 3 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null
  }, from)
  expect(dot, 'the plug on the right of ' + from).not.toBeNull()
  const target = await box(page, to)
  await page.mouse.move(dot!.x, dot!.y)
  await page.mouse.down()
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(300)
}

/** Join two notes with a connector as a person's gesture does (the engine's own call, not the host's). */
const connect = (page: Page, parent: string, child: string, id: string) => page.evaluate(([p, c, key]) => {
  const { slate } = (window as any).native
  slate.nodes.one(p).relationships.addAssociation(slate.nodes.one(c), { id: key })
}, [parent, child, id])

test.describe('a note joined by lines becomes a card and keeps them', () => {
  test('dropped on a lane it is a card with its line, as one undo step; undo and redo keep the line', async ({ page }) => {
    await open(page)
    await connect(page, 'plain', 'default', 'plain-default')
    expect(await savedLines(page)).toBe('plain>default')
    expect(await sent(page)).toEqual(['addRelationship'])
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await expect(live(page)).toHaveText('Ordinary note is now a card in Now. 4 cards.')
    // The line is the board's now, held by the card: the drawing no longer saves it.
    expect(await lines(page)).toBe('plain>default')
    expect(await savedLines(page)).toBe('')
    await resting(page, 'card-plain')
    await expect.poll(() => joins(page, 'plain-default', 'card-plain', 'default')).toBe(true)
    const [change] = await changes(page)
    expect(change.noteToCard.lines).toEqual([expect.objectContaining({ id: 'plain-default', parentId: 'plain', childId: 'default' })])
    // Collaborators hear that the note left the drawing (its line with it), and nothing about a move.
    expect(await sent(page)).toEqual(['addRelationship', 'onNodeDeleted'])

    // Undo: the note and its line are the drawing's again.
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    await expect.poll(() => savedLines(page)).toBe('plain>default')
    expect(await lines(page)).toBe('')
    await expect.poll(() => joins(page, 'plain-default', 'plain', 'default')).toBe(true)

    // Redo: a card again, still joined.
    await page.keyboard.press('ControlOrMeta+y')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await expect.poll(() => lines(page)).toBe('plain>default')
    expect(await savedLines(page)).toBe('')
    await expect.poll(() => joins(page, 'plain-default', 'card-plain', 'default')).toBe(true)
    expect((await changes(page)).at(-1).noteToCard.lines).toEqual([expect.objectContaining({ id: 'plain-default' })])
  })

  test('the line follows the card into another lane and as the lanes wrap into rows', async ({ page }) => {
    await open(page)
    await connect(page, 'plain', 'default', 'plain-default')
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now')
    await drag(page, 'card-plain', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@later')
    await resting(page, 'card-plain')
    await expect.poll(() => joins(page, 'plain-default', 'card-plain', 'default')).toBe(true)
    await page.evaluate(() => (window as any).native.board.setLayout({ lanesPerRow: 1 }))
    await resting(page, 'card-plain')
    await expect.poll(() => joins(page, 'plain-default', 'card-plain', 'default')).toBe(true)
    expect(await lines(page)).toBe('plain>default')
  })

  test('two notes joined to each other, carried together, become two joined cards', async ({ page }) => {
    await open(page)
    await connect(page, 'plain', 'default', 'plain-default')
    await page.evaluate(() => {
      const { slate } = (window as any).native
      slate.selectNodes([slate.nodes.one('plain'), slate.nodes.one('default')])
    })
    await drag(page, 'plain', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now plain@now default@now')
    expect(await lines(page)).toBe('plain>default')
    expect(await savedLines(page)).toBe('')
    await resting(page, 'card-default')
    await expect.poll(() => joins(page, 'plain-default', 'card-plain', 'card-default')).toBe(true)
  })
})

test.describe('a card with lines becomes a note and keeps them', () => {
  test('dropped on the canvas: its line to a note is the drawing\'s, its line to a card stays on the board', async ({ page }) => {
    await open(page)
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, lines: [{ id: 'alpha-default', parentId: 'alpha', childId: 'default' }, { id: 'alpha-beta', parentId: 'alpha', childId: 'beta' }] })
    })
    await expect.poll(() => joins(page, 'alpha-default', 'card-alpha', 'default')).toBe(true)
    await expect.poll(() => joins(page, 'alpha-beta', 'card-alpha', 'card-beta')).toBe(true)
    const plainBox = await box(page, 'plain')
    await drag(page, 'card-alpha', { x: plainBox!.x + plainBox!.width / 2, y: plainBox!.y + 360 })
    await expect.poll(() => cards(page)).toBe('beta@now gamma@now')
    await expect.poll(() => savedLines(page)).toBe('alpha>default')
    expect(await lines(page)).toBe('alpha>beta')
    await expect.poll(() => joins(page, 'alpha-default', 'alpha', 'default')).toBe(true)
    await expect.poll(() => joins(page, 'alpha-beta', 'alpha', 'card-beta')).toBe(true)
    // Collaborators hear of the note and then of its line.
    await expect.poll(() => sent(page)).toEqual(['onNodeAdded', 'addRelationship'])
  })
})

test.describe('lines are drawn between cards and notes with the plug', () => {
  test('card to note, note to card and card to card; each is the board\'s, and undo takes the last one back', async ({ page }) => {
    await open(page)
    await plug(page, 'card-alpha', 'default')
    await expect.poll(() => lines(page)).toBe('alpha>default')
    await plug(page, 'default', 'card-beta')
    await expect.poll(() => lines(page)).toBe('alpha>default default>beta')
    await plug(page, 'card-alpha', 'card-beta')
    await expect.poll(() => lines(page)).toBe('alpha>default default>beta alpha>beta')
    // The drawing saves none of them, and nothing about them goes to collaborators: the host saves the board.
    expect(await savedLines(page)).toBe('')
    expect((await sent(page)).filter(type => /Relationship/.test(type))).toEqual([])
    expect((await changes(page)).map((change: any) => change.line?.set && change.line.set.parentId + '>' + change.line.set.childId))
      .toEqual(['alpha>default', 'default>beta', 'alpha>beta'])
    const ids = await page.evaluate(() => (window as any).native.board.value.lines.map((l: any) => l.id))
    await expect.poll(() => joins(page, ids[0], 'card-alpha', 'default')).toBe(true)
    await expect.poll(() => joins(page, ids[1], 'default', 'card-beta')).toBe(true)
    await expect.poll(() => joins(page, ids[2], 'card-alpha', 'card-beta')).toBe(true)
    // The line from the note points at the card, as drawn.
    const fromNote = await page.evaluate(id => (window as any).native.board.value.lines.find((l: any) => l.id === id), ids[1])
    expect(fromNote).toMatchObject({ parentId: 'default', childId: 'beta', showChildArrow: true })

    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => lines(page)).toBe('alpha>default default>beta')
    expect((await changes(page)).at(-1)).toEqual({ line: { remove: ids[2] } })
    await page.keyboard.press('ControlOrMeta+y')
    await expect.poll(() => lines(page)).toBe('alpha>default default>beta alpha>beta')
  })

  test('a line taken off a card leaves the board; a note deleted takes its line off screen and undo brings both back', async ({ page }) => {
    await open(page)
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, lines: [{ id: 'default-alpha', parentId: 'default', childId: 'alpha' }, { id: 'alpha-beta', parentId: 'alpha', childId: 'beta' }] })
    })
    await expect.poll(() => joins(page, 'default-alpha', 'default', 'card-alpha')).toBe(true)
    // The line pane's delete: the engine takes the connector off its holder.
    await page.evaluate(() => (window as any).native.slate.nodes.one('card-alpha').relationships.removeAssociation('alpha-beta'))
    await expect.poll(() => lines(page)).toBe('default>alpha')
    expect((await changes(page)).at(-1)).toEqual({ line: { remove: 'alpha-beta' } })

    await page.waitForTimeout(700)
    await page.evaluate(() => (window as any).native.slate.removeNode('default'))
    await expect.poll(() => lineEnds(page, 'default-alpha')).toBeNull()
    // The board keeps the line for when the note is back.
    expect(await lines(page)).toBe('default>alpha')
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => page.evaluate(() => Boolean((window as any).native.slate.nodes.one('default')))).toBe(true)
    await expect.poll(() => joins(page, 'default-alpha', 'default', 'card-alpha')).toBe(true)
  })
})

test('a line to a note that arrives after the board (a load, a collaborator) is drawn when the note arrives', async ({ page }) => {
  await open(page, '')
  await page.evaluate(() => {
    const { board } = (window as any).native
    board.update({ ...board.value, lines: [{ id: 'alpha-late', parentId: 'alpha', childId: 'late' }] })
  })
  await page.waitForTimeout(300)
  expect(await lineEnds(page, 'alpha-late')).toBeNull()
  // As a collaborator's package or a load adds it: nothing the workshop did.
  await page.evaluate(() => (window as any).native.slate.collab.exe({ type: 'onNodeAdded', data: { id: 'late', nodeOptions: [{ id: 'late', xPos: 60, yPos: 320, width: 160, height: 80, text: 'Late note' }] } }))
  await expect.poll(() => joins(page, 'alpha-late', 'card-alpha', 'late')).toBe(true)
})

test('a note the lane refuses glides back with its outline and plugs', async ({ page }) => {
  // tests/fixtures: Later holds one card. Fill it, then drop the selected note there.
  await open(page, '')
  await drag(page, 'card-alpha', await inLane(page, 'later'))
  await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
  await resting(page, 'card-alpha')
  await page.evaluate(() => { const { slate } = (window as any).native; slate.selectNodes([slate.nodes.one('plain')]) })
  await page.waitForTimeout(200)
  await drag(page, 'plain', await inLane(page, 'later'))
  await expect(live(page)).toHaveText("Ordinary note can't go in Later. It already holds 1 of 1 card.")
  const rest = await resting(page, 'plain')
  await page.waitForTimeout(300)
  const outline = await page.evaluate(() => {
    const el = [...document.querySelectorAll('#slate .svg_select_shape, #slate rect[stroke-dasharray="5,5"], #slate rect[stroke-dasharray="5 5"]')]
      .find(item => (item as SVGGraphicsElement).getBoundingClientRect().width > 0)
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  })
  expect(outline).not.toBeNull()
  // The outline is round the note where it came to rest, not where it was let go.
  expect(Math.abs(outline!.x - rest.x)).toBeLessThan(12)
  expect(Math.abs(outline!.y - rest.y)).toBeLessThan(12)
})
