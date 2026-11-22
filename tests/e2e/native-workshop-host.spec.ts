import { expect, test, type Browser, type Page } from '@playwright/test'

/**
 * What a host needs from a native workshop beyond the moves themselves: notes in
 * its own note style, word of what is selected, lanes that wrap on a narrow
 * screen, and a canvas that stays one canvas (presentation, zoom label, a
 * double-click in a lane). Same fixture as native-workshop.spec.ts.
 */

async function open(page: Page, query = '') {
  await page.goto('/tests/fixtures/native-workshop.html' + query)
  await page.waitForFunction(() => (window as any).native?.ready === true)
}

type Box = { x: number; y: number; width: number; height: number }
const box = (page: Page, id: string) => page.evaluate(key => (window as any).native.box(key) as Box, id)
const at = (page: Page, id: string) =>
  page.evaluate(key => (window as any).native.at(key) as (Box & { text: string }) | null, id)
const cards = (page: Page) =>
  page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string)
const text = async (page: Page, id: string) => (await at(page, id))?.text
const journal = (page: Page) => page.evaluate(() => {
  const { log } = (window as any).native
  return {
    changes: log.changes.map((entry: any) => entry.change),
    refusals: log.refusals as { cardId?: string; laneId?: string | null; reason: string }[],
    selections: log.selections as ({ cardId: string } | { laneId: string } | null)[],
  }
})
const live = (page: Page) => page.locator('#slate [aria-live]')
const view = (page: Page) => page.evaluate(() => {
  const { slate } = (window as any).native
  const vb = slate.canvas.viewbox()
  return { x: vb.x as number, y: vb.y as number, zoom: slate.getZoom() as number }
})

/** A point in the lower part of a lane's column, clear of its header and its cards. */
async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column.x + column.width / 2, y: column.y + column.height - 30 }
}
async function click(page: Page, id: string) {
  const b = await box(page, id)
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)
}
async function carry(page: Page, id: string, to: { x: number; y: number }, steps = 12) {
  const from = await box(page, id)
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps })
}
/** The note's world position once it has stopped moving (two equal readings a tenth of a second apart). */
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
/** How a note is drawn: its type as the browser resolved it, on-screen text size, and its outline. */
const drawn = (page: Page, id: string) => page.evaluate(key => {
  const group = document.querySelector(`#slate [data-node-id="${key}"]`)!
  const words = group.querySelector('text') as SVGTextElement
  const outline = group.querySelector('path') as SVGPathElement
  const type = getComputedStyle(words)
  const scale = (document.querySelector('#slate > svg') as SVGSVGElement).getScreenCTM()!.a
  return {
    family: type.fontFamily, size: parseFloat(type.fontSize), onScreen: parseFloat(type.fontSize) * scale, color: type.fill,
    stroke: outline.getAttribute('stroke'), strokeWidth: Number(outline.getAttribute('stroke-width')), path: outline.getAttribute('d') ?? '',
  }
}, id)

test.describe('workshop notes in the family of the host\'s notes', () => {
  test('with no style they are drawn as an ordinary engine note is: its type, size, text colour and border', async ({ page }) => {
    await open(page, '?defaultnote')
    const ordinary = await drawn(page, 'default')
    for (const id of ['card-alpha', 'card-gamma', 'lane-now']) {
      const note = await drawn(page, id)
      expect(note.family, id).toBe(ordinary.family)
      expect(note.color, id).toBe(ordinary.color)
      expect(note.stroke, id).toBe(ordinary.stroke)
      expect(note.strokeWidth, id).toBe(ordinary.strokeWidth)
      // Square corners, as an ordinary note has.
      expect(note.path, id).not.toContain('Q')
    }
    // Card text is exactly an ordinary note's size; a lane name is a heading, two larger; a caption one smaller.
    expect((await drawn(page, 'card-alpha')).size).toBe(ordinary.size)
    expect((await drawn(page, 'lane-now')).size).toBe(ordinary.size + 2)
    expect((await drawn(page, 'caption-now')).size).toBe(ordinary.size - 1)
    expect((await drawn(page, 'caption-now')).family).toBe(ordinary.family)
  })

  test('a host passes its note style and every lane, caption and card takes it', async ({ page }) => {
    await open(page, '?styled')
    const ordinary = await drawn(page, 'plain')
    expect(ordinary.family).toContain('Georgia')
    for (const id of ['card-alpha', 'card-beta', 'card-gamma']) {
      const note = await drawn(page, id)
      expect({ family: note.family, size: note.size, color: note.color, stroke: note.stroke, strokeWidth: note.strokeWidth }, id).toEqual(
        { family: ordinary.family, size: ordinary.size, color: ordinary.color, stroke: ordinary.stroke, strokeWidth: ordinary.strokeWidth })
      // Round corners of the radius asked for, drawn at the card's own size.
      expect(note.path, id).toContain('Q 228 0 228 12')
    }
    const lane = await drawn(page, 'lane-now'), caption = await drawn(page, 'caption-later')
    expect({ family: lane.family, size: lane.size, color: lane.color, stroke: lane.stroke }).toEqual({ family: ordinary.family, size: 20, color: ordinary.color, stroke: ordinary.stroke })
    expect({ family: caption.family, size: caption.size, color: caption.color }).toEqual({ family: ordinary.family, size: 15, color: ordinary.color })
    // The style survives a move, a rename and a redraw from a new model.
    await carry(page, 'card-alpha', await inLane(page, 'later'))
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await resting(page, 'card-alpha')
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, cards: [...board.value.cards, { id: 'delta', label: 'Delta', laneId: 'now' }] })
    })
    await expect(page.locator('#slate [data-node-id="card-delta"]')).toBeVisible()
    for (const id of ['card-alpha', 'card-delta']) {
      const note = await drawn(page, id)
      expect({ family: note.family, size: note.size, color: note.color, stroke: note.stroke }, id).toEqual(
        { family: ordinary.family, size: ordinary.size, color: ordinary.color, stroke: ordinary.stroke })
    }
  })

  test('a label too long for its card at the host\'s size is set smaller, and stays inside the card', async ({ page }) => {
    await open(page, '?interview&styled')
    for (const id of ['card-preview', 'card-duplicate', 'card-undo']) {
      const note = await drawn(page, id)
      expect(note.size, id).toBeLessThan(18)
      expect(note.size, id).toBeGreaterThanOrEqual(11)
      const fits = await page.evaluate(key => {
        const group = document.querySelector(`#slate [data-node-id="${key}"]`)!
        const words = group.querySelector('text')!.getBoundingClientRect(), outline = group.querySelector('path')!.getBoundingClientRect()
        return words.top >= outline.top - 1 && words.bottom <= outline.bottom + 1 && words.left >= outline.left - 1 && words.right <= outline.right + 1
      }, id)
      expect(fits, id + ' text inside its card').toBe(true)
    }
  })
})

test.describe('onSelect', () => {
  test('tells the host which card or lane is selected, and null when the selection leaves them', async ({ page }) => {
    await open(page)
    expect((await journal(page)).selections).toEqual([])
    await click(page, 'card-alpha')
    await expect.poll(async () => (await journal(page)).selections).toEqual([{ cardId: 'alpha' }])
    // From one card straight to another, and to a lane: one call each, with no null between.
    await page.waitForTimeout(450)
    await click(page, 'card-beta')
    await expect.poll(async () => (await journal(page)).selections).toEqual([{ cardId: 'alpha' }, { cardId: 'beta' }])
    await page.waitForTimeout(450)
    await click(page, 'lane-later')
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toEqual({ laneId: 'later' })
    // An ordinary note is not the workshop's business.
    await page.waitForTimeout(450)
    await click(page, 'plain')
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toBe(null)
    await page.waitForTimeout(450)
    await click(page, 'card-gamma')
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toEqual({ cardId: 'gamma' })
    // Empty canvas.
    await page.waitForTimeout(450)
    await page.mouse.click(900, 620)
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toBe(null)
    expect((await journal(page)).selections).toEqual([{ cardId: 'alpha' }, { cardId: 'beta' }, { laneId: 'later' }, null, { cardId: 'gamma' }, null])
  })

  test('a move, a keyboard move and an undo of the drawing keep the selection the host was told; a removed card and destroy() end it', async ({ page }) => {
    await open(page)
    await click(page, 'card-alpha')
    await expect.poll(async () => (await journal(page)).selections).toEqual([{ cardId: 'alpha' }])
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    // Undo of the ordinary drawing redraws the workshop as new notes; the card is still the selection.
    await page.evaluate(async () => {
      const { slate } = (window as any).native
      slate.nodes.one('plain').position(80, 100)
      slate.undoRedo.snapshot?.()
    })
    await page.keyboard.press('ControlOrMeta+z')
    await page.waitForTimeout(600)
    expect((await journal(page)).selections).toEqual([{ cardId: 'alpha' }])
    expect(await page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['card-alpha'])
    // A host callback that throws is reported, not fatal.
    await page.evaluate(() => { (window as any).native.hostThrows = true })
    await page.waitForTimeout(450)
    await click(page, 'card-beta')
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toEqual({ cardId: 'beta' })
    await page.evaluate(() => { (window as any).native.hostThrows = false })
    // The selected card is removed by a new model.
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, cards: board.value.cards.filter((card: any) => card.id !== 'beta') })
    })
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toBe(null)
    // destroy() with a lane selected.
    await page.waitForTimeout(450)
    await click(page, 'lane-now')
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toEqual({ laneId: 'now' })
    await page.evaluate(() => (window as any).native.board.destroy())
    expect((await journal(page)).selections.at(-1)).toBe(null)
    expect((await journal(page)).selections).toEqual([{ cardId: 'alpha' }, { cardId: 'beta' }, null, { laneId: 'now' }, null])
  })
})

// Boards S2a (plan 2026-11-22): on a phone or from the keyboard there is no hover, so selecting a
// lane is how the host offers "Change this board". A tap on a lane's caption or on the empty part
// of its column selects that lane's header, as a tap on the header does. A drag there is not a tap.
test.describe('a tap on a lane\'s caption or column', () => {
  test('selects the lane, and the host hears it as the lane', async ({ page }) => {
    await open(page)
    await click(page, 'caption-later')
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toEqual({ laneId: 'later' })
    await page.waitForTimeout(450)
    const spot = await inLane(page, 'now')
    await page.mouse.click(spot.x, spot.y)
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toEqual({ laneId: 'now' })
    expect(await page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['lane-now'])
    // Empty canvas still leaves it.
    await page.waitForTimeout(450)
    await page.mouse.click(900, 620)
    await expect.poll(async () => (await journal(page)).selections.at(-1)).toBe(null)
  })

  test('a drag that starts on a column selects nothing', async ({ page }) => {
    await open(page)
    const spot = await inLane(page, 'later')
    await page.mouse.move(spot.x, spot.y)
    await page.mouse.down()
    await page.mouse.move(spot.x + 60, spot.y + 40, { steps: 6 })
    await page.mouse.up()
    await page.waitForTimeout(300)
    expect((await journal(page)).selections).toEqual([])
  })
})

// The gear's focus: the host says which board the chat is about; the board marks its notes so a
// kit (S2b's timeline handles) and assistive tools can tell. Focus is the host's to give and take.
test.describe('setFocused', () => {
  test('marks every note of the board while it is in focus, and keeps the mark through a redraw', async ({ page }) => {
    await open(page)
    const marked = () => page.evaluate(() => {
      const { board, slate } = (window as any).native
      const mine = slate.nodes.allNodes.filter((n: any) => /^(lane|card|caption|column)-/.test(n.id))
      return { focused: board.focused, all: mine.length, marked: mine.filter((n: any) => n.svgGroup.node.hasAttribute('data-workshop-focused')).length,
        plain: slate.nodes.one('plain').svgGroup.node.hasAttribute('data-workshop-focused') }
    })
    expect(await marked()).toMatchObject({ focused: false, marked: 0, plain: false })
    await page.evaluate(() => (window as any).native.board.setFocused(true))
    const on = await marked()
    expect(on.focused).toBe(true)
    expect(on.marked).toBe(on.all)
    expect(on.plain).toBe(false)
    // A new model (a lane more) is drawn in focus too.
    await page.evaluate(async () => {
      const { board } = (window as any).native
      board.update({ ...board.value, lanes: [...board.value.lanes, { id: 'blocked', label: 'Blocked' }] })
      await board.whenDrawn()
    })
    const grown = await marked()
    expect(grown.all).toBeGreaterThan(on.all)
    expect(grown.marked).toBe(grown.all)
    await page.evaluate(() => (window as any).native.board.setFocused(false))
    expect(await marked()).toMatchObject({ focused: false, marked: 0 })
  })
})

test.describe('one canvas', () => {
  test('column and caption notes are never a presentation stop, a tab stop or a button', async ({ page }) => {
    await open(page)
    const state = await page.evaluate(() => {
      const { slate } = (window as any).native
      const names = (nodes: any[]): string[] => nodes.flatMap(node => [node.nodeId, ...names(node.childrenNodes ?? [])])
      // Play the built-in presentation from its first stop to its last.
      const steps = slate.presentation.extractLayout().map((step: any) => step.nodeId) as string[]
      const visited: string[] = []
      slate.presentation.start(0)
      do visited.push(steps[slate.presentation.getCurrentStep()])
      while (visited.length < 30 && slate.presentation.next(0))
      const total = slate.presentation.getTotalSteps() as number
      slate.presentation.stop()
      return {
        steps, total,
        tree: names(slate.presentation.extractPresentationLayout().nodes),
        ordered: slate.presentation.setStepOrder(['column-now', 'card-beta', 'caption-later', 'lane-later']).map((step: any) => step.nodeId) as string[],
        visited,
        decoration: [...document.querySelectorAll('#slate [data-node-id^="column-"], #slate [data-node-id^="caption-"]')].map(el => ({
          id: el.getAttribute('data-node-id'), tab: el.getAttribute('tabindex'), role: el.getAttribute('role'), hidden: el.getAttribute('aria-hidden'),
          focusable: (el as SVGElement).tabIndex >= 0,
        })),
        buttons: [...document.querySelectorAll('#slate [role="button"]')].map(el => el.getAttribute('data-node-id')).filter(Boolean),
      }
    })
    const scenery = (ids: string[]) => ids.filter(id => /^(column|caption)-/.test(id))
    expect([...state.steps].sort()).toEqual(['card-alpha', 'card-beta', 'card-gamma', 'lane-later', 'lane-now', 'plain'])
    expect(scenery(state.tree)).toEqual([])
    expect([...state.tree].sort()).toEqual(['card-alpha', 'card-beta', 'card-gamma', 'lane-later', 'lane-now', 'plain'])
    expect(state.ordered.slice(0, 2)).toEqual(['card-beta', 'lane-later'])
    expect(scenery(state.ordered)).toEqual([])
    expect(state.total).toBe(6)
    expect([...state.visited].sort()).toEqual(['card-alpha', 'card-beta', 'card-gamma', 'lane-later', 'lane-now', 'plain'])
    expect(state.decoration).toEqual(['column-later', 'column-now', 'caption-now', 'caption-later'].map(id => ({ id, tab: null, role: null, hidden: 'true', focusable: false })))
    expect(scenery(state.buttons)).toEqual([])
    // Tab from the first note never lands on scenery.
    const seen: string[] = []
    await page.locator('#slate [data-node-id="plain"]').focus()
    for (let i = 0; i < 12; i++) {
      seen.push(await page.evaluate(() => document.activeElement?.getAttribute('data-node-id') ?? ''))
      await page.keyboard.press('Tab')
    }
    expect(scenery(seen)).toEqual([])
    expect(seen).toEqual(expect.arrayContaining(['plain', 'lane-now', 'card-alpha', 'lane-later']))
  })

  test('the zoom label is right the moment the view changes, however it was changed', async ({ page }) => {
    await open(page)
    const label = page.locator('.slatebox-zoom-slider span')
    await expect(label).toHaveText('100%')
    const readings = await page.evaluate(async () => {
      const { slate } = (window as any).native
      const read = async () => {
        // The label follows the view by observation: one turn of the microtask queue, no timer.
        await Promise.resolve()
        return { label: document.querySelector('.slatebox-zoom-slider span')!.textContent, zoom: Math.round(slate.getZoom() * 100) + '%' }
      }
      slate.zoom(0.5)
      const zoomed = await read()
      slate.fitToContent()
      const fitted = await read()
      const vb = slate.canvas.viewbox()
      slate.canvas.viewbox(vb.x, vb.y, vb.width * 4, vb.height * 4)
      const direct = await read()
      return { zoomed, fitted, direct }
    })
    expect(readings.zoomed).toEqual({ label: '50%', zoom: '50%' })
    expect(readings.fitted).toEqual({ label: '100%', zoom: '100%' })
    expect(readings.direct).toEqual({ label: '25%', zoom: '25%' })
  })

  test('a double-click on empty space inside a lane makes an ordinary note there, above the lane', async ({ page }) => {
    await open(page)
    const spot = await inLane(page, 'later')
    const before = await page.evaluate(() => (window as any).native.slate.nodes.allNodes.map((n: any) => n.id) as string[])
    await page.mouse.dblclick(spot.x, spot.y)
    await page.waitForTimeout(450)
    const made = await page.evaluate(known => (window as any).native.slate.nodes.allNodes.map((n: any) => n.id).filter((id: string) => !known.includes(id)) as string[], before)
    expect(made).toHaveLength(1)
    const id = made[0]
    const topmost = (point: { x: number; y: number }) => page.evaluate(p => document.elementFromPoint(p.x, p.y)?.closest('[data-node-id]')?.getAttribute('data-node-id'), point)
    // Visible (nothing of the workshop is drawn over it), selected, ordinary and saved.
    expect(await topmost(spot)).toBe(id)
    const state = async () => page.evaluate(key => {
      const { slate } = (window as any).native
      const node = slate.nodes.one(key)
      return {
        governed: node?.svgGroup.node.getAttribute('data-governed'),
        selected: slate.getSelectedNodes().map((n: any) => n.id),
        saved: JSON.parse(slate.exportJSON()).nodes.map((n: any) => n.options.id) as string[],
        x: node?.options.x, y: node?.options.y,
      }
    }, id)
    const created = await state()
    expect(created.governed).toBe(null)
    expect(created.selected).toEqual([id])
    expect(created.saved).toEqual(['plain', id])
    // The workshop is as it was, and still plays: the lane takes a card dropped on it beside the note.
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    const later = await box(page, 'column-later')
    await carry(page, 'card-alpha', { x: later.x + 30, y: later.y + later.height - 12 })
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await resting(page, 'card-alpha')
    // The lane is redrawn at a new size by a new model, and again by undo and redo: the note stays above it.
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, cards: [...board.value.cards, { id: 'delta', label: 'Delta', laneId: 'now' }, { id: 'eta', label: 'Eta', laneId: 'now' }] })
    })
    await expect(page.locator('#slate [data-node-id="card-eta"]')).toBeVisible()
    await page.waitForTimeout(300)
    expect(await topmost(await page.evaluate(key => { const b = (window as any).native.box(key); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }, id))).toBe(id)
    await page.mouse.click(1000, 650)
    await page.keyboard.press('ControlOrMeta+z')
    await page.waitForTimeout(500)
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await page.waitForTimeout(500)
    const after = await page.evaluate(key => {
      const { slate } = (window as any).native
      const b = (window as any).native.box(key)
      return { there: Boolean(slate.nodes.one(key)), centre: b && { x: b.x + b.width / 2, y: b.y + b.height / 2 } }
    }, id)
    expect(after.there).toBe(true)
    expect(await topmost(after.centre!)).toBe(id)
    // Carried out of the lane onto open canvas it moves like any note, and the move is saved.
    // (Restated 2026-11-19: a note let go on a lane now becomes a card there, so the old
    // "out of the lane and back in" move is now the lane deciding, below.)
    const placed = await state()
    const outside = await page.evaluate(() => { const { slate, board } = (window as any).native
      return slate.worldToClient({ x: board.bounds.x + board.bounds.width + 160, y: board.bounds.y + 40 }) })
    await page.mouse.move(after.centre!.x, after.centre!.y)
    await page.mouse.down()
    await page.mouse.move(outside.x, outside.y, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(450)
    const moved = await state()
    expect(moved.governed).toBe(null)
    expect(Math.abs(moved.x - placed.x)).toBeGreaterThan(100)
    expect(await page.evaluate(key => JSON.parse((window as any).native.slate.exportJSON()).nodes.find((n: any) => n.options.id === key).options.x, id)).toBeCloseTo(moved.x, 0)
    // Let go on Later it is refused there and goes back: a card needs words, and this note has none yet.
    const back = await page.evaluate(key => { const b = (window as any).native.box(key); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }, id)
    const full = await inLane(page, 'later')
    await page.mouse.move(back.x, back.y)
    await page.mouse.down()
    await page.mouse.move(full.x, full.y, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(450)
    expect((await state()).x).toBeCloseTo(moved.x, 0)
    expect(await cards(page)).toBe('alpha@later beta@now gamma@now delta@now eta@now')
  })
})

test.describe('lanes that wrap', () => {
  const places = (page: Page, ids: string[]) => page.evaluate(names => Object.fromEntries(names.map(id => {
    const o = (window as any).native.slate.nodes.one(id).options
    return [id, { x: o.x, y: o.y, width: o.width, height: o.height }]
  })) as Record<string, Box>, ids)
  const budgetColumns = ['column-reserve', 'column-calls', 'column-newsletter', 'column-pilot']

  test('a layout option wraps the lanes, and setLayout re-arranges the same notes live', async ({ page }) => {
    // Tall enough that four stacked lanes are all on screen (nothing here is about panning).
    await page.setViewportSize({ width: 1280, height: 1200 })
    await open(page, '?budget&empty&perRow=2')
    let at = await places(page, budgetColumns)
    // Two to a row: the third lane under the first, the fourth under the second.
    expect(at['column-calls'].y).toBe(at['column-reserve'].y)
    expect(at['column-calls'].x).toBe(at['column-reserve'].x + 244)
    expect(at['column-newsletter'].x).toBe(at['column-reserve'].x)
    expect(at['column-newsletter'].y).toBe(at['column-reserve'].y + at['column-reserve'].height + 12)
    expect(at['column-pilot']).toMatchObject({ x: at['column-calls'].x, y: at['column-newsletter'].y })
    // Lanes of one row share a height; a row is only as tall as its own fullest lane.
    expect(at['column-calls'].height).toBe(at['column-reserve'].height)
    expect(at['column-pilot'].height).toBe(98 + 88)
    expect(await page.evaluate(() => (window as any).native.board.bounds)).toEqual({ x: 40, y: 40, width: 488, height: at['column-reserve'].height + 12 + 186 })
    expect(await page.evaluate(() => (window as any).native.board.layout)).toEqual({ lanesPerRow: 2 })

    // Remember the note instances, then stack the lanes one to a row.
    // Watch Customer calls on every frame of the half second that follows.
    const seen = await page.evaluate(() => {
      const { slate, board } = (window as any).native
      ;(window as any).before = new Map(slate.nodes.allNodes.map((n: any) => [n.id, n]))
      board.setLayout({ lanesPerRow: 1 })
      return new Promise<number[]>(resolve => {
        const xs: number[] = [], started = performance.now()
        const frame = () => {
          xs.push(slate.nodes.one('column-calls').options.x)
          if (performance.now() - started < 500) requestAnimationFrame(frame)
          else resolve(xs)
        }
        requestAnimationFrame(frame)
      })
    })
    const target = at['column-reserve'].y + at['column-reserve'].height + 12
    // It glides there: on some frames it is on its way, neither where it was nor where it is going.
    expect(seen.filter(x => x > 42 && x < 286).length).toBeGreaterThan(1)
    expect(seen.at(-1)).toBe(42)
    await resting(page, 'column-calls')
    await resting(page, 'card-fund-0')
    expect((await places(page, budgetColumns))['column-calls'].y).toBe(target)
    at = await places(page, budgetColumns)
    expect(new Set(budgetColumns.map(id => at[id].x)).size).toBe(1)
    expect(budgetColumns.map(id => at[id].y)).toEqual([...budgetColumns.map(id => at[id].y)].sort((a, b) => a - b))
    for (let i = 1; i < 4; i++) expect(at[budgetColumns[i]].y).toBe(at[budgetColumns[i - 1]].y + at[budgetColumns[i - 1]].height + 12)
    // Each card is in its own lane's column, under its header.
    const card = (await places(page, ['card-fund-0', 'lane-calls']))
    expect(card['card-fund-0']).toMatchObject({ x: card['lane-calls'].x, y: card['lane-calls'].y - 6 + 98 })
    const same = await page.evaluate(() => {
      const { slate } = (window as any).native
      const before: Map<string, unknown> = (window as any).before
      return slate.nodes.allNodes.length === before.size && slate.nodes.allNodes.every((n: any) => before.get(n.id) === n)
    })
    expect(same, 'the same note instances').toBe(true)
    expect(await page.evaluate(() => (window as any).native.board.bounds.width)).toBe(244)

    // A move still commits in the stacked layout, and nothing was told to the host about the re-arrangement.
    await carry(page, 'card-fund-1', await inLane(page, 'newsletter'))
    await expect.poll(() => text(page, 'caption-newsletter')).toBe('$200 · 1 placement')
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('fund-0@calls fund-1@newsletter fund-2@reserve')
    expect((await journal(page)).changes).toEqual([{ cardId: 'fund-1', laneId: 'newsletter' }])

    // Back to one row, as with no layout at all.
    await page.evaluate(() => (window as any).native.board.setLayout({}))
    await resting(page, 'column-pilot')
    at = await places(page, budgetColumns)
    expect(budgetColumns.map(id => at[id].y)).toEqual([40, 40, 40, 40])
    expect(budgetColumns.map(id => at[id].x)).toEqual([42, 286, 530, 774])
    // A layout that makes no sense is refused and changes nothing.
    expect(await page.evaluate(() => { try { (window as any).native.board.setLayout({ lanesPerRow: 0 }); return 'accepted' } catch (error) { return String((error as Error).message) } }))
      .toBe('lanesPerRow must be a whole number, 1 or more.')
    expect(await page.evaluate(() => (window as any).native.board.layout)).toEqual({})
  })

  test('setLayout while a card is held cancels the drag and the card takes its place in the new layout', async ({ page }) => {
    await open(page, '?budget&empty')
    await carry(page, 'card-fund-1', await inLane(page, 'newsletter'))
    await expect.poll(() => text(page, 'caption-newsletter')).toBe('$200 · 1 placement')
    await page.evaluate(() => (window as any).native.board.setLayout({ lanesPerRow: 2 }))
    await page.mouse.up()
    await expect.poll(() => text(page, 'caption-newsletter')).toBe('$0 · 0 placements')
    expect(await cards(page)).toBe('fund-0@calls fund-1@reserve fund-2@reserve')
    const card = await resting(page, 'card-fund-1'), lane = (await at(page, 'lane-reserve'))!
    expect({ x: card.x, y: card.y }).toEqual({ x: lane.x, y: lane.y - 6 + 98 })
    expect((await journal(page)).changes).toEqual([])
  })

  test('keyboard: Left and Right follow reading order through the rows, Up and Down the column', async ({ page }) => {
    // reserve | calls
    // newsletter | pilot
    await open(page, '?budget&empty&perRow=2')
    await click(page, 'card-fund-1')
    await page.keyboard.press('ArrowDown')
    await expect(live(page)).toHaveText('Second $200 to Partner newsletter · $200 per placement: $200 · 1 placement. Press Enter to move it, Escape to cancel.')
    await page.keyboard.press('ArrowRight')
    await expect(live(page)).toContainText('Second $200 to Concierge onboarding · $100 per import: $200 · 2 assisted imports.')
    await page.keyboard.press('ArrowUp')
    await expect(live(page)).toContainText('Second $200 to Customer calls · $50 per call: $400 · 8 customer calls.')
    // Nothing above the top row.
    await page.keyboard.press('ArrowUp')
    await expect(live(page)).toHaveText('Second $200 has no lane to move to on that side.')
    // Right from the end of the first row goes on to the start of the second.
    await page.keyboard.press('ArrowRight')
    await expect(live(page)).toContainText('Second $200 to Partner newsletter · $200 per placement')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('ArrowLeft')
    await expect(live(page)).toHaveText('Second $200 is back in Unallocated.')
    expect(await cards(page)).toBe('fund-0@calls fund-1@reserve fund-2@reserve')
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('fund-0@calls fund-1@pilot fund-2@reserve')
    expect((await journal(page)).changes).toEqual([{ cardId: 'fund-1', laneId: 'pilot' }])
    const card = await resting(page, 'card-fund-1'), lane = (await at(page, 'lane-pilot'))!
    expect({ x: card.x, y: card.y }).toEqual({ x: lane.x, y: lane.y - 6 + 98 })
  })

  test('keyboard: one lane to a row, Down reaches a lane below the screen and brings it into view; a closed lane below refuses', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 520 })
    await open(page, '?tall&empty&perRow=1&fitwidth')
    const hidden = await box(page, 'column-review')
    expect(hidden.y).toBeGreaterThan(520)
    await click(page, 'card-alpha')
    await page.keyboard.press('ArrowDown')
    await expect(live(page)).toContainText('Alpha to Doing: 1 card.')
    await page.keyboard.press('ArrowDown')
    await expect(live(page)).toContainText('Alpha to Review: 1 card.')
    // Review was below the screen; now all of its column is on it.
    await resting(page, 'card-alpha')
    const shown = await box(page, 'column-review')
    expect(shown.y).toBeGreaterThanOrEqual(0)
    expect(shown.y + shown.height).toBeLessThanOrEqual(520)
    // Done is full: the same refusal a drop there gives, and Review stays staged.
    await page.keyboard.press('ArrowDown')
    await expect(live(page)).toHaveText("Alpha can't move to Done. It already holds 1 of 1 card.")
    expect((await journal(page)).refusals).toEqual([{ cardId: 'alpha', laneId: 'done', reason: 'It already holds 1 of 1 card.' }])
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@review beta@inbox gamma@inbox omega@done')
    // Up goes back the way it came; Left and Right mean the same in a single column.
    await page.keyboard.press('ArrowUp')
    await expect(live(page)).toContainText('Alpha to Doing: 1 card.')
    await page.keyboard.press('ArrowLeft')
    await expect(live(page)).toContainText('Alpha to Inbox: 3 cards.')
    await page.keyboard.press('Escape')
    expect(await cards(page)).toBe('alpha@review beta@inbox gamma@inbox omega@done')
  })

  test('with every lane in one row, Up and Down are not the workshop\'s keys', async ({ page }) => {
    await open(page)
    await click(page, 'card-alpha')
    const start = await at(page, 'card-alpha')
    await page.waitForTimeout(250)
    const said = await live(page).textContent()
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('ArrowUp')
    await page.waitForTimeout(250)
    expect(await at(page, 'card-alpha')).toEqual(start)
    expect(await live(page).textContent()).toBe(said)
    expect(await text(page, 'caption-later')).toBe('0 of 1')
    expect((await journal(page)).refusals).toEqual([])
  })

  test('keyboard on a map with stations above one another: Up and Down follow its columns, and a station that cannot be reached refuses', async ({ page }) => {
    // Last train | East stairs
    // Market St lift | Shuttle · Bay B
    await open(page, '?night&empty')
    await click(page, 'card-rider')
    await page.keyboard.press('ArrowDown')
    await expect(live(page)).toContainText('Last rider to Market St lift: 1 card.')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('rider@lift')
    // The lift only leads on to the shuttle: back up to the platform is refused as a drop there would be.
    await page.keyboard.press('ArrowUp')
    await expect(live(page)).toHaveText("Last rider can't move to Last train. Last train can't be reached from Market St lift.")
    expect((await journal(page)).refusals).toEqual([{ cardId: 'rider', laneId: 'platform', reason: "Last train can't be reached from Market St lift." }])
    await page.keyboard.press('ArrowRight')
    await expect(live(page)).toContainText('Last rider to Shuttle · Bay B: 1 card.')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('rider@shuttle')
    expect((await journal(page)).changes).toEqual([{ cardId: 'rider', laneId: 'lift' }, { cardId: 'rider', laneId: 'shuttle' }])
  })

  test('a map\'s connectors are the workshop\'s drawing: they run between stations, take no pointer input and cannot be deleted', async ({ page }) => {
    await open(page, '?night&empty')
    const lines = () => page.evaluate(() => [...document.querySelectorAll('#slate path[data-connection-id]')].map(el => el.getAttribute('data-connection-id')))
    expect(await lines()).toEqual(['platform-to-stairs', 'platform-to-lift', 'stairs-to-platform', 'lift-to-shuttle'])
    // Last train leads down to Market St lift. The line is in the gap between the two stations...
    const line = await page.locator('#slate path[data-connection-id="platform-to-lift"]').boundingBox()
    const above = await box(page, 'column-platform'), below = await box(page, 'column-lift')
    // (A browser may count the stroke and the arrowhead in the line's box: a few pixels either way.)
    expect(line!.y).toBeGreaterThanOrEqual(above.y + above.height - 6)
    expect(line!.y + line!.height).toBeLessThanOrEqual(below.y + 6)
    // ...so nothing lies over the token or the caption above it, and the token is grabbed by its middle.
    const token = await box(page, 'card-rider')
    expect(line!.y).toBeGreaterThan(token.y + token.height)
    const middle = { x: token.x + token.width / 2, y: token.y + token.height / 2 }
    expect(await page.evaluate(p => document.elementFromPoint(p.x, p.y)?.closest('[data-node-id]')?.getAttribute('data-node-id'), middle)).toBe('card-rider')
    // A click on the line selects nothing and offers nothing: no line toolbar, no delete, no endpoint to drag.
    const on = { x: line!.x + line!.width / 2, y: line!.y + line!.height / 2 }
    await page.mouse.click(on.x, on.y)
    await page.waitForTimeout(300)
    await expect(page.locator('#slate .line-cog, #slate .line-tool-delete')).toHaveCount(0)
    await page.mouse.click(on.x, on.y)
    await page.keyboard.press('Delete')
    await page.waitForTimeout(300)
    expect(await lines()).toEqual(['platform-to-stairs', 'platform-to-lift', 'stairs-to-platform', 'lift-to-shuttle'])
    await carry(page, 'card-rider', { x: below.x + below.width / 2, y: below.y + below.height - 20 })
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('rider@lift')
    await resting(page, 'card-rider')
    // Still four lines, still not in the saved drawing.
    expect(await lines()).toEqual(['platform-to-stairs', 'platform-to-lift', 'stairs-to-platform', 'lift-to-shuttle'])
    expect(await page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes)).toEqual([])
    // An ordinary connector between ordinary notes is as it always was.
    const ordinary = await page.evaluate(async () => {
      const { slate } = (window as any).native
      const a = slate.addNode({ id: 'a', x: 700, y: 60, width: 120, height: 60, text: 'A' })
      const b = slate.addNode({ id: 'b', x: 700, y: 260, width: 120, height: 60, text: 'B' })
      await Promise.all([a.ready, b.ready])
      a.relationships.addAssociation(b)
      await new Promise(resolve => setTimeout(resolve, 200))
      const path = document.querySelector('#slate path[data-source-node-id="a"]') as SVGPathElement
      return { events: getComputedStyle(path).pointerEvents, governed: path.getAttribute('data-governed') }
    })
    expect(ordinary).toEqual({ events: 'auto', governed: null })
  })

  test('a map keeps its stations where they were authored, whatever the layout says', async ({ page }) => {
    await open(page, '?map&empty&perRow=1')
    const at = await places(page, ['column-request', 'column-finance', 'column-refund'])
    expect(new Set(Object.values(at).map(place => place.y)).size).toBe(1)
    expect([at['column-finance'].x - at['column-request'].x, at['column-refund'].x - at['column-finance'].x]).toEqual([272, 272])
    await expect(page.locator('#slate path[data-connection-id]')).toHaveCount(2)
  })
})

test.describe('a held card near the edge pans the canvas', () => {
  test('mouse: a lane below the window is reached by holding the card at the bottom edge, and a card beside an edge is not pulled until it is carried toward it', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 520 })
    await open(page, '?tall&empty&perRow=1&fitwidth')
    const start = await view(page)
    expect((await box(page, 'column-review')).y).toBeGreaterThan(520)
    // Pressed and carried sideways along the top: the top edge is near, but the card was not carried toward it.
    const alpha = await box(page, 'card-alpha')
    await page.mouse.move(alpha.x + 30, alpha.y + 10)
    await page.mouse.down()
    await page.mouse.move(alpha.x + 60, alpha.y + 10, { steps: 4 })
    await page.waitForTimeout(300)
    expect(await view(page)).toEqual(start)
    // Carried to the bottom edge and held still there: the canvas pans down under the card.
    await page.mouse.move(alpha.x + 60, 505, { steps: 10 })
    await expect.poll(async () => (await box(page, 'column-review')).y, { timeout: 8000 }).toBeLessThan(330)
    const panned = await view(page)
    expect(panned.y).toBeGreaterThan(start.y + 150)
    expect(panned.x).toBe(start.x)
    expect(panned.zoom).toBe(start.zoom)
    // The card stayed under the pointer the whole way.
    const held = await box(page, 'card-alpha')
    expect(held.y).toBeLessThan(505)
    expect(held.y + held.height).toBeGreaterThan(505)
    // Away from the edge the panning stops; Review takes the card.
    const review = await inLane(page, 'review')
    await page.mouse.move(review.x, Math.min(review.y, 440), { steps: 6 })
    const steady = await view(page)
    await page.waitForTimeout(250)
    expect(await view(page)).toEqual(steady)
    await expect.poll(() => text(page, 'caption-review')).toBe('1 card')
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('alpha@review beta@inbox gamma@inbox omega@done')
    const card = await resting(page, 'card-alpha'), lane = (await at(page, 'lane-review'))!
    expect({ x: card.x, y: card.y }).toEqual({ x: lane.x, y: lane.y - 6 + 98 })
    // Nothing pans once the card is let go.
    const after = await view(page)
    await page.waitForTimeout(250)
    expect(await view(page)).toEqual(after)
  })
})

test.describe('a phone: 390x844, touch, one lane to a row', () => {
  async function phone(browser: Browser, baseURL: string | undefined, query: string) {
    const context = await browser.newContext({ baseURL, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    const device = await context.newCDPSession(page)
    await open(page, query)
    let finger = { x: 0, y: 0 }
    const touch = async (type: string, points: { x: number; y: number }[]) => {
      if (points[0]) finger = points[0]
      await device.send('Input.dispatchTouchEvent', { type: type as any, touchPoints: points })
    }
    /** Put a finger on a note. */
    async function press(id: string) {
      const from = await box(page, id)
      await touch('touchStart', [{ x: from.x + from.width / 2, y: from.y + from.height / 2 }])
    }
    /** Slide the finger that is down to a point. */
    async function slide(to: { x: number; y: number }, steps = 8) {
      const from = finger
      for (let i = 1; i <= steps; i++) await touch('touchMove', [{ x: from.x + (to.x - from.x) * i / steps, y: from.y + (to.y - from.y) * i / steps }])
    }
    /** Hold a card at the bottom edge until a lane's column has come this far up the screen. */
    async function holdAtBottomUntil(laneId: string, top: number) {
      await slide({ x: 195, y: 826 })
      await expect.poll(async () => (await box(page, 'column-' + laneId)).y, { timeout: 10000 }).toBeLessThan(top)
    }
    return { context, page, touch, press, slide, holdAtBottomUntil }
  }
  const skipUnlessChromium = (browserName: string) => test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch and touchcancel events')

  test('every card of the budget is readable, and "Second $200" is carried by touch to a lane that starts below the screen', async ({ browser, browserName, baseURL }) => {
    skipUnlessChromium(browserName)
    const { context, page, touch, press, slide, holdAtBottomUntil } = await phone(browser, baseURL, '?budget&empty&perRow=1&fitwidth')
    try {
      // Fitted to the screen's width at full size: every lane and card is inside it, and card text is 13 CSS px or more.
      expect((await view(page)).zoom).toBe(1)
      for (const id of ['column-reserve', 'column-calls', 'column-newsletter', 'column-pilot', 'card-fund-0', 'card-fund-1', 'card-fund-2']) {
        const b = await box(page, id)
        expect(b.x, id).toBeGreaterThanOrEqual(0)
        expect(b.x + b.width, id).toBeLessThanOrEqual(390)
      }
      for (const id of ['card-fund-0', 'card-fund-1', 'card-fund-2']) expect((await drawn(page, id)).onScreen, id).toBeGreaterThanOrEqual(13)
      for (const id of ['lane-reserve', 'lane-calls', 'lane-newsletter', 'lane-pilot', 'caption-reserve']) expect((await drawn(page, id)).onScreen, id).toBeGreaterThanOrEqual(13)
      // The first lane is at the top of the screen; Concierge onboarding starts below it.
      expect((await box(page, 'column-reserve')).y).toBeLessThan(60)
      expect((await box(page, 'column-pilot')).y).toBeGreaterThan(844)
      const start = await view(page)

      await press('card-fund-1')
      await holdAtBottomUntil('pilot', 560)
      expect((await view(page)).y).toBeGreaterThan(start.y)
      // The card is still under the finger.
      const held = await box(page, 'card-fund-1')
      expect(held.y).toBeLessThan(826)
      expect(held.y + held.height).toBeGreaterThan(826)
      // Up off the edge and onto the lane: the panning stops and the lane previews the outcome.
      const target = await inLane(page, 'pilot')
      await slide({ x: target.x, y: Math.min(target.y, 760) })
      await expect.poll(() => text(page, 'caption-pilot')).toBe('$200 · 2 assisted imports')
      expect((await journal(page)).changes).toEqual([])
      await touch('touchEnd', [])
      await expect.poll(() => cards(page)).toBe('fund-0@calls fund-1@pilot fund-2@reserve')
      expect((await journal(page)).changes).toEqual([{ cardId: 'fund-1', laneId: 'pilot' }])
      const card = await resting(page, 'card-fund-1'), lane = (await at(page, 'lane-pilot'))!
      expect({ x: card.x, y: card.y }).toEqual({ x: lane.x, y: lane.y - 6 + 98 })
      // And back up: held at the top edge, the canvas pans the other way to the first lane.
      await press('card-fund-1')
      await slide({ x: 195, y: 14 })
      await expect.poll(async () => (await box(page, 'column-reserve')).y, { timeout: 10000 }).toBeGreaterThan(100)
      const reserve = await box(page, 'column-reserve')
      await slide({ x: reserve.x + reserve.width / 2, y: reserve.y + reserve.height - 30 })
      await expect.poll(() => text(page, 'caption-reserve')).toBe('$400 · unallocated')
      await touch('touchEnd', [])
      await expect.poll(() => cards(page)).toBe('fund-0@calls fund-1@reserve fund-2@reserve')
    } finally { await context.close() }
  })

  test('after the canvas has panned under a held card, a cancelled touch, a full lane and open canvas each return it to its start', async ({ browser, browserName, baseURL }) => {
    skipUnlessChromium(browserName)
    const { context, page, touch, press, slide, holdAtBottomUntil } = await phone(browser, baseURL, '?tall&empty&perRow=1&fitwidth')
    try {
      expect((await box(page, 'column-done')).y).toBeGreaterThan(844)
      const start = await resting(page, 'card-alpha')
      const top = () => page.evaluate(() => { const { slate, board } = (window as any).native; slate.fitToWidth(board.bounds) })

      // Cancelled by the system while the canvas is panning.
      await press('card-alpha')
      await holdAtBottomUntil('done', 600)
      await touch('touchCancel', [])
      expect(await resting(page, 'card-alpha')).toEqual(start)
      expect(await cards(page)).toBe('alpha@inbox beta@inbox gamma@inbox omega@done')
      const stopped = await view(page)
      await page.waitForTimeout(250)
      expect(await view(page)).toEqual(stopped)

      // Dropped on Done, which is full.
      await top()
      await press('card-alpha')
      await holdAtBottomUntil('done', 560)
      const done = await inLane(page, 'done')
      await slide({ x: done.x, y: Math.min(done.y, 760) })
      await touch('touchEnd', [])
      await expect.poll(async () => (await journal(page)).refusals).toEqual([{ cardId: 'alpha', laneId: 'done', reason: 'It already holds 1 of 1 card.' }])
      expect(await resting(page, 'card-alpha')).toEqual(start)
      expect(await text(page, 'caption-done')).toBe('It already holds 1 of 1 card.')

      // Dropped beside the lanes, on open canvas, it becomes an ordinary note there; undo makes
      // it a card again in its own place. (Restated 2026-11-19: this drop used to be refused.)
      await top()
      await press('card-alpha')
      await holdAtBottomUntil('review', 500)
      await slide({ x: 195, y: 600 })
      await slide({ x: 30, y: 600 })
      await touch('touchEnd', [])
      await expect.poll(() => cards(page)).toBe('beta@inbox gamma@inbox omega@done')
      expect(await page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes.map((n: any) => n.options.id))).toEqual(['alpha'])
      await page.evaluate(() => (window as any).native.slate.undoRedo.undo())
      await expect.poll(() => cards(page)).toBe('alpha@inbox beta@inbox gamma@inbox omega@done')
      expect(await resting(page, 'card-alpha')).toEqual(start)
      // (Restated 2026-11-19, cards-fix: the undo also says which card Alpha goes back in front
      // of, so every copy of the board puts it in its own place.)
      expect((await journal(page)).changes).toEqual([
        { cardId: 'alpha', cardToNote: { noteId: 'alpha' } },
        // (Restated 2026-11-22, boards S1: the undo's change says it came from an undo.)
        { cardId: 'alpha', laneId: 'inbox', noteToCard: { noteId: 'alpha', label: 'Alpha', before: 'beta' }, via: 'undo' },
      ])
      // The workshop still plays after all three.
      await top()
      const doing = await inLane(page, 'doing')
      await press('card-alpha')
      await slide(doing)
      await touch('touchEnd', [])
      await expect.poll(() => cards(page)).toBe('alpha@doing beta@inbox gamma@inbox omega@done')
    } finally { await context.close() }
  })

  test('the fit and the zoom label on a phone: the board is read from the top at full size, and the label says so at once', async ({ browser, browserName, baseURL }) => {
    skipUnlessChromium(browserName)
    const { context, page } = await phone(browser, baseURL, '?budget&empty&fit')
    try {
      // fitToContent shows all four lanes in one row: about a third of full size, and the label says that, not 100%.
      const zoom = (await view(page)).zoom
      expect(zoom).toBeLessThan(0.5)
      await expect(page.locator('.slatebox-zoom-slider span')).toHaveText(Math.round(zoom * 100) + '%')
      const said = await page.evaluate(async () => {
        const { slate, board } = (window as any).native
        board.setLayout({ lanesPerRow: 1 })
        slate.fitToWidth(board.bounds)
        await Promise.resolve()
        return document.querySelector('.slatebox-zoom-slider span')!.textContent
      })
      expect(said).toBe('100%')
    } finally { await context.close() }
  })
})
