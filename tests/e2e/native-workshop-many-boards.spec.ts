import { expect, test, type Page } from '@playwright/test'

/**
 * Two boards on one slate (plan S3a/S3b): the fixture's board ("main", unscoped) and a second copy of the
 * same preset attached beside it in scope "b2". Each board names its notes in its own scope, takes only
 * the notes dropped on its own lanes, and an undo on one never touches the other. A card's line joins
 * notes and cards of its own board: a line between the two boards' cards is refused, and so is a note
 * joined to one board's card dropped on the other; a note with a line ending free on the canvas keeps it.
 *
 * Fixture (tests/fixtures/native-workshop.html?defaultnote): notes "plain" and "default", then lanes Now
 * and Later (Alpha, Beta, Gamma in Now; Later holds one card).
 */

type Box = { x: number; y: number; width: number; height: number }
type Point = { x: number; y: number }

const SENTENCE = 'A card\'s line joins notes and cards on its own board.'

async function open(page: Page) {
  const warnings: string[] = []
  page.on('console', message => { if (message.type() === 'warning') warnings.push(message.text()) })
  await page.goto('/tests/fixtures/native-workshop.html?defaultnote')
  await page.waitForFunction(() => (window as any).native?.ready === true)
  await page.evaluate(async () => {
    const n = (window as any).native
    const first = n.board.bounds
    // The same preset again, in its own scope, a gap to the right of the room the first board needs.
    n.second = await n.attach(n.models.lanes(), { scope: 'b2', origin: { x: Math.round(first.x + 1220 + 160), y: Math.round(first.y) } })
    n.slate.fitToContent()
    n.log.changes.length = 0
    n.log.refusals.length = 0
  })
  await page.waitForTimeout(300)
  return warnings
}

const box = (page: Page, id: string) => page.evaluate(key => (window as any).native.box(key) as Box | null, id)
const cardsOf = (page: Page, which: 'board' | 'second') => page.evaluate(w => (window as any).native[w].value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string, which)
const linesOf = (page: Page, which: 'board' | 'second') => page.evaluate(w => ((window as any).native[w].value.lines ?? [])
  .map((l: any) => l.parentId + '>' + (l.targetPoint ? 'free' : l.childId)).join(' ') as string, which)
const ids = (page: Page) => page.evaluate(() => (window as any).native.slate.nodes.allNodes.map((n: any) => n.id as string))
const live = (page: Page) => page.locator('#slate [aria-live]')
/** The connectors a note holds. */
const held = (page: Page, id: string) => page.evaluate(key => ((window as any).native.slate.nodes.one(key)?.relationships.getAssociations() ?? [])
  .map((a: any) => ({ id: a.id, childId: a.childId, free: Boolean(a.targetPoint) })), id)
const refusals = (page: Page) => page.evaluate(() => (window as any).native.log.refusals.map((r: any) => r.reason) as string[])

async function inLane(page: Page, column: string) {
  const area = await box(page, column)
  return { x: area!.x + area!.width / 2, y: area!.y + area!.height * 0.85 }
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

/** A person joins a note to another with its plugs: select it, press the plug on its right edge, carry it onto the other and let go. */
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
    return r && r.width > 2 ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null
  }, from)
  expect(dot, 'the plug on the right of ' + from).not.toBeNull()
  const target = await box(page, to)
  await page.mouse.move(dot!.x, dot!.y)
  await page.mouse.down()
  await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(400)
}

test.describe('two copies of one preset on one slate', () => {
  test('each board is named in its own scope, the first as today, with no stand-ins; a note dropped on the second is its card', async ({ page }) => {
    const warnings = await open(page)
    const all = await ids(page)
    const mine = all.filter(id => id.startsWith('b2:'))
    const first = all.filter(id => /^(lane|card|caption|column)-/.test(id))
    expect(first).toEqual(expect.arrayContaining(['lane-now', 'lane-later', 'card-alpha', 'card-beta', 'card-gamma', 'column-now']))
    expect(mine.sort()).toEqual(first.map(id => 'b2:' + id).sort())
    expect(all.some(id => id.includes('--'))).toBe(false)
    expect(warnings.filter(text => text.includes('already has a note named'))).toEqual([])

    await drag(page, 'plain', await inLane(page, 'b2:column-now'))
    await expect.poll(() => cardsOf(page, 'second')).toBe('alpha@now beta@now gamma@now plain@now')
    expect(await cardsOf(page, 'board')).toBe('alpha@now beta@now gamma@now')
    await expect.poll(() => ids(page)).toContain('b2:card-plain')
    expect(await ids(page)).not.toContain('card-plain')
    await expect(live(page)).toHaveText('Ordinary note is now a card in Now. 4 cards.')

    // Undo puts the note back and takes the card off the second board only.
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cardsOf(page, 'second')).toBe('alpha@now beta@now gamma@now')
    expect(await cardsOf(page, 'board')).toBe('alpha@now beta@now gamma@now')
    await expect.poll(() => ids(page)).toContain('plain')
  })

  test('undo and redo of a card leaving the second board never take the same card off the first', async ({ page }) => {
    await open(page)
    // The second board's Alpha leaves the lanes as the note "alpha": the first board has a card by that id.
    expect(await page.evaluate(() => (window as any).native.second.toCanvas('alpha'))).toBeNull()
    await expect.poll(() => cardsOf(page, 'second')).toBe('beta@now gamma@now')
    await expect.poll(() => ids(page)).toContain('alpha')
    await page.mouse.click(5, 5)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(() => cardsOf(page, 'second')).toBe('alpha@now beta@now gamma@now')
    expect(await cardsOf(page, 'board')).toBe('alpha@now beta@now gamma@now')
    // Redo brings the note "alpha" back: only the second board lets its Alpha go.
    await page.keyboard.press('ControlOrMeta+y')
    await expect.poll(() => cardsOf(page, 'second')).toBe('beta@now gamma@now')
    await page.waitForTimeout(300)
    expect(await cardsOf(page, 'board')).toBe('alpha@now beta@now gamma@now')
    expect(await ids(page)).toEqual(expect.arrayContaining(['alpha', 'card-alpha']))
  })
})

test.describe('a card\'s line joins notes and cards on its own board', () => {
  test('a note with a line ending free on the canvas, dropped on the second board, keeps its line', async ({ page }) => {
    await open(page)
    const point = await page.evaluate(() => {
      const { slate } = (window as any).native
      const at = slate.nodes.one('plain').options
      const p = { x: Math.round((at.x ?? at.xPos) + at.width + 160), y: Math.round((at.y ?? at.yPos) - 40) }
      slate.nodes.one('plain').relationships.addFloatingAssociation(p, { id: 'plain-free', childId: '__free_plain1', lineType: 'elbow', showChildArrow: true })
      return p
    })
    await drag(page, 'plain', await inLane(page, 'b2:column-now'))
    await expect.poll(() => cardsOf(page, 'second')).toBe('alpha@now beta@now gamma@now plain@now')
    expect(await page.evaluate(() => (window as any).native.second.value.lines))
      .toEqual([expect.objectContaining({ id: 'plain-free', parentId: 'plain', childId: '__free_plain1', targetPoint: point, lineType: 'elbow' })])
    expect(await linesOf(page, 'board')).toBe('')
    await expect.poll(() => held(page, 'b2:card-plain')).toEqual([expect.objectContaining({ id: 'plain-free', childId: '__free_plain1', free: true })])
  })

  test('a line from a card on one board to a card on the other is refused with the sentence, said once, either way round', async ({ page }) => {
    await open(page)
    await plug(page, 'card-alpha', 'b2:card-beta')
    await expect(live(page)).toHaveText(SENTENCE)
    expect(await refusals(page)).toEqual([SENTENCE])
    expect(await linesOf(page, 'board')).toBe('')
    expect(await linesOf(page, 'second')).toBe('')
    await expect.poll(() => held(page, 'card-alpha')).toEqual([])
    expect(await held(page, 'b2:card-beta')).toEqual([])

    await plug(page, 'b2:card-alpha', 'card-beta')
    await expect.poll(() => refusals(page)).toEqual([SENTENCE, SENTENCE])
    expect(await linesOf(page, 'board')).toBe('')
    expect(await linesOf(page, 'second')).toBe('')
    await expect.poll(() => held(page, 'b2:card-alpha')).toEqual([])
    // A line within one board is still drawn.
    await plug(page, 'b2:card-alpha', 'b2:card-beta')
    await expect.poll(() => linesOf(page, 'second')).toBe('alpha>beta')
    expect(await linesOf(page, 'board')).toBe('')
  })

  test('a note joined to a card of the first board stays a note when dropped on the second, and says why', async ({ page }) => {
    await open(page)
    await plug(page, 'card-alpha', 'default')
    await expect.poll(() => linesOf(page, 'board')).toBe('alpha>default')
    await drag(page, 'default', await inLane(page, 'b2:column-now'))
    await expect(live(page)).toHaveText(`Default note can't go in Now. ${SENTENCE}`)
    expect(await cardsOf(page, 'second')).toBe('alpha@now beta@now gamma@now')
    expect(await ids(page)).toContain('default')
    expect(await linesOf(page, 'board')).toBe('alpha>default')
    // On its own board it is welcome, line and all (once it has glided back from the refusal).
    await resting(page, 'default')
    await drag(page, 'default', await inLane(page, 'column-now'))
    await expect.poll(() => cardsOf(page, 'board')).toBe('alpha@now beta@now gamma@now default@now')
    expect(await linesOf(page, 'board')).toBe('alpha>default')
  })
})
