import { expect, test, type Browser, type Page } from '@playwright/test'

/**
 * A workshop attached to a live slate as native notes (attachWorkshop), beside one
 * ordinary note. The fixture is plain TypeScript: no React, no overlay, one Slate.
 *
 * Fixture board: lanes Now and Later (Later holds one card); cards Alpha, Beta and
 * Gamma start in Now, and Gamma may never leave it.
 */

const shots = process.env.NATIVE_WORKSHOP_SHOTS

async function open(page: Page, query = '') {
  await page.goto('/tests/fixtures/native-workshop.html' + query)
  await page.waitForFunction(() => (window as any).native?.ready === true)
}

const box = (page: Page, id: string) =>
  page.evaluate(key => (window as any).native.box(key) as { x: number; y: number; width: number; height: number }, id)
const at = (page: Page, id: string) =>
  page.evaluate(key => (window as any).native.at(key) as { x: number; y: number; width: number; height: number; text: string } | null, id)
const cards = (page: Page) =>
  page.evaluate(() => (window as any).native.board.value.cards.map((c: any) => c.id + '@' + c.laneId).join(' ') as string)
const text = async (page: Page, id: string) => (await at(page, id))?.text
const journal = (page: Page) => page.evaluate(() => {
  const { log } = (window as any).native
  return {
    changes: log.changes.map((entry: any) => entry.change),
    refusals: log.refusals as { cardId?: string; laneId?: string | null; reason: string; rename?: unknown }[],
    packages: log.packages.map((pkg: any) => pkg.type) as string[],
    sent: log.sent.map((pkg: any) => pkg.type) as string[],
  }
})
const live = (page: Page) => page.locator('#slate [aria-live]')

/** A point in the lower part of a lane's column: clear of its header and of every card slot in the fixture. */
async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column.x + column.width / 2, y: column.y + column.height * 0.85 }
}

/** Press a note and carry it to a point, leaving the mouse button down. */
async function carry(page: Page, id: string, to: { x: number; y: number }) {
  const from = await box(page, id)
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 12 })
}

async function drag(page: Page, id: string, to: { x: number; y: number }) {
  await carry(page, id, to)
  await page.mouse.up()
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

test.describe('a workshop drawn as native notes on a live slate', () => {
  test('draws lanes, captions and cards as notes beside an ordinary note, and saves none of them', async ({ page }) => {
    await open(page)
    for (const id of ['plain', 'lane-now', 'lane-later', 'card-alpha', 'card-beta', 'card-gamma', 'caption-now', 'caption-later', 'column-now', 'column-later']) {
      await expect(page.locator(`#slate [data-node-id="${id}"]`)).toBeVisible()
    }
    // One Slate, one SVG, no React board and no overlay.
    expect(await page.evaluate(() => ({
      canvases: document.querySelectorAll('#slate > svg').length,
      instances: (window as any).__slateboxInstances.length,
      boards: document.querySelectorAll('.pilot-board, [data-workshop-hit-surface], [data-native-workshop-map], [data-workshop-card]').length,
    }))).toEqual({ canvases: 1, instances: 1, boards: 0 })
    expect(await text(page, 'lane-now')).toBe('Now')
    expect(await text(page, 'caption-now')).toBe('3 cards')
    expect(await text(page, 'caption-later')).toBe('0 of 1')
    // The workshop sits to the right of what the slate already held.
    const plain = await at(page, 'plain'), column = await at(page, 'column-now')
    expect(column!.x).toBeGreaterThan(plain!.x + plain!.width)
    // Cards sit in their lane, under its header and caption.
    const header = await at(page, 'lane-now'), caption = await at(page, 'caption-now')
    const alpha = await at(page, 'card-alpha'), beta = await at(page, 'card-beta')
    expect(alpha!.x).toBe(header!.x)
    expect(alpha!.y).toBeGreaterThanOrEqual(caption!.y + caption!.height)
    expect(beta!.y).toBeGreaterThan(alpha!.y + alpha!.height)
    // The same type as an ordinary note, and round corners like it.
    const type = (id: string) => page.locator(`#slate [data-node-id="${id}"] text`).first().evaluate(el => getComputedStyle(el).fontFamily)
    expect(await type('card-alpha')).toBe(await type('plain'))
    expect(await type('lane-now')).toBe(await type('plain'))
    // The drawing is the model's, not the document's: nothing was saved, sent or recorded.
    const state = await page.evaluate(() => {
      const { slate } = (window as any).native
      return {
        saved: JSON.parse(slate.exportJSON()).nodes.map((n: any) => n.options.id),
        snapshot: slate.snapshot().nodes.map((n: any) => n.options.id),
        governed: slate.nodes.allNodes.map((n: any) => n.id + ':' + (n.svgGroup.node.getAttribute('data-governed') ?? 'free')),
      }
    })
    expect(state.saved).toEqual(['plain'])
    expect(state.snapshot).toEqual(['plain'])
    expect(state.governed).toEqual([
      'plain:free', 'column-now:decoration', 'lane-now:fixed', 'caption-now:decoration', 'card-alpha:movable', 'card-beta:movable',
      'card-gamma:movable', 'column-later:decoration', 'lane-later:fixed', 'caption-later:decoration',
    ])
    const { packages, sent } = await journal(page)
    expect(packages).toEqual([])
    expect(sent).toEqual([])
    if (shots) await page.screenshot({ path: shots + '/01-two-lane-at-rest.png' })
  })

  test('a permitted drag previews on the captions, commits once and settles the card in its lane', async ({ page }) => {
    await open(page)
    await carry(page, 'card-alpha', await inLane(page, 'later'))
    // Held over Later: both captions show the outcome, the other cards close up, nothing is committed.
    await expect.poll(() => text(page, 'caption-later')).toBe('1 of 1')
    await expect.poll(() => text(page, 'caption-now')).toBe('2 cards')
    const slot = (await at(page, 'lane-now'))!
    await expect.poll(async () => (await at(page, 'card-beta'))!.y).toBe(slot.y - 6 + 98)
    expect((await journal(page)).changes).toEqual([])
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    // The lane it may enter is outlined.
    await expect(page.locator('#slate [data-node-id="column-later"] path').first()).toHaveAttribute('stroke', '#1f7a5c')
    if (shots) await page.screenshot({ path: shots + '/02-mid-drag-over-permitted-lane.png' })
    await page.mouse.up()

    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    const state = await journal(page)
    expect(state.changes).toEqual([{ cardId: 'alpha', laneId: 'later' }])
    // The card comes to rest in Later's first slot, not where it was dropped.
    const later = (await at(page, 'lane-later'))!
    const alpha = await resting(page, 'card-alpha')
    expect(alpha.x).toBe(later.x)
    expect(alpha.y).toBe(later.y - 6 + 98)
    expect(await text(page, 'caption-later')).toBe('1 of 1')
    await expect(live(page)).toHaveText('Alpha moved to Later. 1 of 1.')
    // The host was told once; the engine sent and saved nothing of its own.
    expect(state.packages).toEqual([])
    expect(state.sent).toEqual([])
    expect(await page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes.length)).toBe(1)
    await expect(page.locator('#slate [data-node-id="column-later"] path').first()).not.toHaveAttribute('stroke', '#1f7a5c')
  })

  test('a full lane, a forbidden lane and open canvas each refuse: the card returns and nothing is sent', async ({ page }) => {
    await open(page)
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await resting(page, 'card-alpha')

    // Later is full.
    const betaStart = await resting(page, 'card-beta')
    await carry(page, 'card-beta', await inLane(page, 'later'))
    await expect(page.locator('#slate [data-node-id="column-later"] path').first()).toHaveAttribute('stroke', '#c2410c')
    await page.mouse.up()
    await expect.poll(async () => (await journal(page)).refusals).toEqual([{ cardId: 'beta', laneId: 'later', reason: 'It already holds 1 of 1 card.' }])
    // The refusal is visible on the canvas: the lane is outlined and its caption says why.
    await expect.poll(() => text(page, 'caption-later')).toBe('It already holds 1 of 1 card.')
    await expect(page.locator('#slate [data-node-id="caption-later"]')).toContainText('It already holds 1 of 1 card.')
    await expect(page.locator('#slate [data-node-id="lane-later"] path').first()).toHaveAttribute('stroke', '#c2410c')
    await expect(live(page)).toHaveText("Beta can't move to Later. It already holds 1 of 1 card.")
    expect(await resting(page, 'card-beta')).toEqual(betaStart)
    // The outline is back around the card where it rests, not where it was dropped.
    const outline = (await page.locator('#slate .svg_select_shape').boundingBox())!
    const rested = await box(page, 'card-beta')
    expect(Math.abs(outline.x - rested.x)).toBeLessThan(4)
    expect(Math.abs(outline.y - rested.y)).toBeLessThan(4)
    if (shots) await page.screenshot({ path: shots + '/03-refusal-on-full-lane.png' })
    // ...and passes after about a second and a half.
    await expect.poll(() => text(page, 'caption-later'), { timeout: 4000 }).toBe('1 of 1')
    await expect(page.locator('#slate [data-node-id="lane-later"] path').first()).not.toHaveAttribute('stroke', '#c2410c')

    // Gamma may not go to Later at all.
    const gammaStart = await resting(page, 'card-gamma')
    await drag(page, 'card-gamma', await inLane(page, 'later'))
    await expect.poll(async () => (await journal(page)).refusals.at(-1)).toEqual({ cardId: 'gamma', laneId: 'later', reason: "This card can't go in Later." })
    expect(await resting(page, 'card-gamma')).toEqual(gammaStart)

    // Dropped on open canvas, outside every lane: Gamma may only be in Now, so it may not
    // become a note there either, and says so. (Restated 2026-11-19: a card that may leave
    // the lanes now becomes an ordinary note on open canvas; native-workshop-cards.spec.ts.)
    const plain = await box(page, 'plain')
    await drag(page, 'card-gamma', { x: plain.x + plain.width / 2, y: plain.y + plain.height + 260 })
    await expect.poll(async () => (await journal(page)).refusals.at(-1)).toEqual({ cardId: 'gamma', laneId: null, reason: 'Gamma may only be in Now, so it stays a card.' })
    expect(await resting(page, 'card-gamma')).toEqual(gammaStart)
    expect(await resting(page, 'card-beta')).toEqual(betaStart)

    const state = await journal(page)
    expect(state.changes).toEqual([{ cardId: 'alpha', laneId: 'later' }])
    expect(await cards(page)).toBe('alpha@later beta@now gamma@now')
    expect(state.packages).toEqual([])
    expect(state.sent).toEqual([])
  })

  test('Escape, a cancelled pointer and window blur each abandon a held card', async ({ page }) => {
    await open(page)
    const start = await resting(page, 'card-alpha')
    const abandon: Record<string, () => Promise<unknown>> = {
      Escape: () => page.keyboard.press('Escape'),
      pointercancel: () => page.evaluate(() => window.dispatchEvent(new PointerEvent('pointercancel', { pointerType: 'mouse' }))),
      blur: () => page.evaluate(() => window.dispatchEvent(new Event('blur'))),
    }
    for (const [name, cancel] of Object.entries(abandon)) {
      await carry(page, 'card-alpha', await inLane(page, 'later'))
      await expect.poll(() => text(page, 'caption-later'), { message: name }).toBe('1 of 1')
      await cancel()
      await expect.poll(() => text(page, 'caption-later'), { message: name }).toBe('0 of 1')
      await expect(live(page)).toHaveText('Move cancelled. Alpha stays where it was.')
      expect(await resting(page, 'card-alpha'), name).toEqual(start)
      // The button comes up over Later; the abandoned drag must not land there.
      await page.mouse.up()
      await page.waitForTimeout(150)
      expect(await cards(page), name).toBe('alpha@now beta@now gamma@now')
      // The card is still the selection, as after any drag.
      expect(await page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['card-alpha'])
    }
    const state = await journal(page)
    expect(state.changes).toEqual([])
    expect(state.refusals).toEqual([])
    expect(state.packages).toEqual([])
    // A fresh drag still works after each kind of cancel.
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
  })

  test('pan and zoom keep working, between drags and while a card is held', async ({ page }) => {
    await open(page)
    const view = () => page.evaluate(() => {
      const { slate } = (window as any).native
      const vb = slate.canvas.viewbox()
      return { x: vb.x, y: vb.y, zoom: slate.getZoom() }
    })
    const before = await view()
    const centre = await inLane(page, 'now')
    await page.mouse.move(centre.x, centre.y)
    await page.mouse.wheel(60, 40)
    await expect.poll(async () => (await view()).x).toBeGreaterThan(before.x)
    await page.keyboard.down('Control')
    await page.mouse.wheel(0, 160)
    await page.keyboard.up('Control')
    await expect.poll(async () => (await view()).zoom).toBeLessThan(before.zoom * 0.95)
    const zoomed = await view()

    // After the zoom, the card still goes where the pointer says.
    await carry(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => text(page, 'caption-later')).toBe('1 of 1')
    // Pan while it is held: the board moves under the pointer, so step back onto Later and drop.
    await page.mouse.wheel(0, 30)
    await expect.poll(async () => (await view()).y).toBeGreaterThan(zoomed.y)
    const later = await inLane(page, 'later')
    await page.mouse.move(later.x, later.y, { steps: 4 })
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    const header = (await at(page, 'lane-later'))!
    const alpha = await resting(page, 'card-alpha')
    expect(alpha.x).toBe(header.x)
    expect(alpha.y).toBe(header.y - 6 + 98)

    // Zoom in past where it started, with the board still on screen, and refuse a drop into the now-full lane.
    const middle = await box(page, 'lane-later')
    await page.mouse.move(middle.x, middle.y + 200)
    await page.keyboard.down('Control')
    await page.mouse.wheel(0, -120)
    await page.keyboard.up('Control')
    await expect.poll(async () => (await view()).zoom).toBeGreaterThan(zoomed.zoom * 1.05)
    const edge = await box(page, 'column-later')
    expect(edge.x + edge.width).toBeLessThan(1280)
    const betaStart = await resting(page, 'card-beta')
    await drag(page, 'card-beta', await inLane(page, 'later'))
    await expect.poll(async () => (await journal(page)).refusals.length).toBe(1)
    expect(await resting(page, 'card-beta')).toEqual(betaStart)
    // The zoom slider and minimap are the slate's own.
    await expect(page.locator('.slatebox-zoom-slider')).toBeVisible()
  })

  test('the ordinary note still drags, resizes, edits and deletes exactly as before', async ({ page }) => {
    await open(page)
    const start = (await at(page, 'plain'))!
    const b = await box(page, 'plain')
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
    await page.mouse.down()
    // Down past the bottom of the board, so growing it later cannot slide it under a card.
    await page.mouse.move(b.x + b.width / 2 + 40, b.y + b.height / 2 + 470, { steps: 10 })
    await page.mouse.up()
    // It stays where it was dropped (no policy, no snap-back) and the engine broadcasts the move.
    await expect.poll(async () => (await at(page, 'plain'))!.y).toBe(start.y + 470)
    expect((await at(page, 'plain'))!.x).toBe(start.x + 40)
    await expect.poll(async () => (await journal(page)).packages).toContain('onNodesMove')
    expect((await journal(page)).sent).toContain('onNodesMove')

    // Selected, it has the full toolbar, plugs, resize handles and rotate knob.
    await expect(page.locator('#slate .node-toolbar .node-tool-delete')).toBeVisible()
    await expect(page.locator('#slate .node-toolbar .node-tool-plug')).toBeVisible()
    await expect(page.locator('#slate .connection-handle').first()).toBeVisible()
    await expect(page.locator('#slate .svg_select_handle_rb')).toBeVisible()
    const handle = (await page.locator('#slate .svg_select_handle_rb').boundingBox())!
    const hx = handle.x + handle.width / 2, hy = handle.y + handle.height / 2
    await page.mouse.move(hx, hy)
    await page.mouse.down()
    await page.waitForTimeout(120)
    await page.mouse.move(hx + 30, hy + 10, { steps: 8 })
    await page.mouse.move(hx + 60, hy + 20, { steps: 8 })
    await page.waitForTimeout(120)
    await page.mouse.up()
    await expect.poll(async () => (await at(page, 'plain'))!.width).toBeGreaterThan(start.width + 30)
    await expect.poll(async () => (await journal(page)).packages).toContain('onNodeResized')

    // Arrow keys nudge it.
    const beforeNudge = (await at(page, 'plain'))!
    await page.keyboard.press('ArrowRight')
    expect((await at(page, 'plain'))!.x).toBe(beforeNudge.x + 5)

    // Double-click edits in place; the engine broadcasts the text.
    const c = await box(page, 'plain')
    await page.mouse.dblclick(c.x + c.width / 2, c.y + c.height / 2)
    await expect(page.locator('.sb-inline-editor')).toBeVisible()
    await page.keyboard.type('Still ordinary')
    await page.keyboard.press('Enter')
    await expect.poll(() => text(page, 'plain')).toBe('Still ordinary')
    await expect.poll(async () => (await journal(page)).packages).toContain('onNodeTextChanged')

    // Duplicate, then delete the original from the keyboard. (Pauses keep two clicks from reading as a double-click.)
    await page.waitForTimeout(450)
    await page.mouse.click(c.x + c.width / 2, c.y + c.height / 2)
    await page.keyboard.press('Control+d')
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.freeNodes().length)).toBe(2)
    await page.waitForTimeout(450)
    await page.mouse.click(c.x + c.width / 2, c.y + 6)
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['plain'])
    await page.keyboard.press('Delete')
    await expect(page.locator('#slate [data-node-id="plain"]')).toHaveCount(0)
    await expect.poll(async () => (await journal(page)).packages).toContain('onNodeDeleted')
    // The workshop was not touched by any of it.
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    expect((await journal(page)).changes).toEqual([])
  })

  // (Restated 2026-11-21, owner decision: cards connect to notes and to each other like any note.
  // This test said a card could not be connected: its plug, the engine's addAssociation on a card and a
  // connector dropped on a card were all refused. A card now shows its plug, and a line drawn to it is
  // the board's (native-workshop-lines.spec.ts). A collaborator's package still cannot join a card.)
  test('a card cannot be nudged, resized, rotated, deleted, duplicated or moved by a collaborator; it connects like a note', async ({ page }) => {
    await open(page)
    const start = await resting(page, 'card-alpha')
    const a = await box(page, 'card-alpha')
    const count = () => page.evaluate(() => (window as any).native.slate.nodes.allNodes.length)
    const total = await count()
    await page.mouse.click(a.x + a.width / 2, a.y + a.height / 2)
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['card-alpha'])

    // Selected: an outline, but no resize handles, rotate knob or toolbar; its connector plugs show, as a note's do.
    await expect(page.locator('#slate .svg_select_shape')).toBeVisible()
    await expect(page.locator('#slate .svg_select_handle_rb')).toBeHidden()
    await expect(page.locator('#slate .svg_select_handle_rot')).toBeHidden()
    await expect(page.locator('#slate .node-toolbar')).toHaveCount(0)
    await expect(page.locator('#slate .connection-handle:visible')).toHaveCount(4)

    // Keyboard: no nudge, no delete, no duplicate, no copy and paste.
    for (const key of ['ArrowUp', 'ArrowDown', 'Shift+ArrowDown', 'Delete', 'Backspace', 'Control+d', 'Control+c', 'Control+v', 'Control+]', 'Control+[']) {
      await page.keyboard.press(key)
    }
    await page.waitForTimeout(350)
    expect(await at(page, 'card-alpha')).toEqual(start)
    expect(await count()).toBe(total)
    await expect(page.locator('#slate [data-node-id="card-alpha"]')).toBeVisible()

    // Right-click offers nothing (the menu is all persistence actions).
    await page.mouse.click(a.x + a.width / 2, a.y + a.height / 2, { button: 'right' })
    await expect(page.locator('.sb-context-menu')).toHaveCount(0)

    // Select-all and a marquee across the board pick up only the ordinary note.
    await page.keyboard.press('Control+a')
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['plain'])
    const plain = await box(page, 'plain'), far = await box(page, 'column-later')
    await page.mouse.move(plain.x - 30, plain.y - 30)
    await page.mouse.down()
    await page.mouse.move(far.x + far.width + 20, far.y + far.height + 20, { steps: 10 })
    await page.mouse.up()
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['plain'])
    // Shift-click cannot add a card to a selection either: the card replaces it.
    await page.keyboard.down('Shift')
    await page.mouse.click(a.x + a.width / 2, a.y + a.height / 2)
    await page.keyboard.up('Shift')
    await expect.poll(() => page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['card-alpha'])

    // The engine's own entry points refuse too.
    const refused = await page.evaluate(async () => {
      const { slate } = (window as any).native
      const card = slate.nodes.one('card-alpha'), lane = slate.nodes.one('lane-now'), plainNote = slate.nodes.one('plain')
      const removed = slate.removeNode('card-alpha')
      slate.alignNodes('left', [plainNote, card, lane])
      slate.distributeNodes('vertical', [plainNote, card, lane])
      const group = slate.groupNodes([plainNote, card])
      slate.lockNodes([card])
      slate.applyLayout([{ id: 'card-alpha', x: 0, y: 0 }], undefined, true)
      // A collaborator's packages aimed at the card, its lane, or its text.
      slate.collab.exe({ type: 'onNodesMove', data: { nodeOptions: [{ id: 'card-alpha', xPos: 0, yPos: 0 }], dur: 0 } })
      slate.collab.exe({ type: 'onNodePositioned', data: { id: 'card-alpha', location: { x: 0, y: 0 } } })
      slate.collab.exe({ type: 'onNodeResized', data: { id: 'card-alpha', width: 10, height: 10 } })
      slate.collab.exe({ type: 'onNodeRotated', data: { id: 'card-alpha', rotate: { rotationAngle: 45 } } })
      slate.collab.exe({ type: 'onNodeTextChanged', data: { id: 'lane-now', text: 'Hijacked' } })
      slate.collab.exe({ type: 'onNodeDeleted', data: { id: 'card-alpha' } })
      slate.collab.exe({ type: 'addRelationship', data: { parentId: 'plain', childId: 'card-alpha' } })
      await new Promise(resolve => setTimeout(resolve, 600))
      return {
        removed, group, locked: !!card.options.isLocked, exists: !!slate.nodes.one('card-alpha'),
        links: plainNote.relationships.assocMap.size + card.relationships.assocMap.size,
        connectors: document.querySelectorAll('#slate .connect-drag-line').length,
        rotation: card.options.rotate?.rotationAngle ?? 0, lane: lane.options.text,
        size: [card.options.width, card.options.height],
      }
    })
    expect(refused).toEqual({ removed: false, group: null, locked: false, exists: true, links: 0, connectors: 0, rotation: 0, lane: 'Now', size: [228, 76] })
    expect(await at(page, 'card-alpha')).toEqual(start)

    // A connector dragged from the ordinary note onto a card joins them: the line is the board's (held by the
    // card, saved by the host, sent to nobody), and no new note is made on top of the card.
    await page.mouse.click(plain.x + plain.width / 2, plain.y + plain.height / 2)
    await expect(page.locator('#slate .node-toolbar .node-tool-plug')).toBeVisible()
    // The toolbar is redrawn once the click settles; take the one that stays.
    await page.waitForTimeout(250)
    const plug = (await page.locator('#slate .node-toolbar .node-tool-plug').boundingBox())!
    await page.mouse.move(plug.x + plug.width / 2, plug.y + plug.height / 2)
    await page.mouse.down()
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2, { steps: 10 })
    await page.mouse.up()
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => (window as any).native.slate.nodes.one('plain').relationships.assocMap.size)).toBe(0)
    expect(await page.evaluate(() => (window as any).native.board.value.lines.map((l: any) => l.parentId + '>' + l.childId))).toEqual(['plain>alpha'])
    expect(await count()).toBe(total)

    const state = await journal(page)
    expect(state.changes).toEqual([{ line: { set: expect.objectContaining({ parentId: 'plain', childId: 'alpha' }) } }])
    expect(state.packages.filter(type => /^onNode|Relationship/.test(type))).toEqual([])
    expect(state.sent.filter(type => /^onNode|Relationship/.test(type))).toEqual([])
    // A lane header does not drag at all.
    const lane = await resting(page, 'lane-later')
    await drag(page, 'lane-later', await inLane(page, 'now'))
    expect(await resting(page, 'lane-later')).toEqual(lane)
  })

  test('double-click renames a card and a lane in place; an empty or over-long name is refused', async ({ page }) => {
    await open(page)
    const edit = async (id: string, typed: string | null) => {
      const b = await box(page, id)
      await page.mouse.dblclick(b.x + b.width / 2, b.y + b.height / 2)
      const editor = page.locator('.sb-inline-editor')
      await expect(editor).toBeVisible()
      // The editor holds the label alone: the caption is a separate note.
      if (typed === null) await page.keyboard.press('Backspace')
      else await page.keyboard.type(typed)
      await page.keyboard.press('Enter')
      await expect(editor).toHaveCount(0)
    }
    await edit('card-alpha', 'Apollo')
    await expect.poll(() => text(page, 'card-alpha')).toBe('Apollo')
    await edit('lane-now', 'Today')
    await expect.poll(() => text(page, 'lane-now')).toBe('Today')
    let state = await journal(page)
    expect(state.changes).toEqual([{ rename: { cardId: 'alpha', label: 'Apollo' } }, { rename: { laneId: 'now', label: 'Today' } }])
    expect(await page.evaluate(() => {
      const model = (window as any).native.board.value
      return [model.cards[0].label, model.lanes[0].label]
    })).toEqual(['Apollo', 'Today'])
    expect(await text(page, 'caption-now')).toBe('3 cards')
    await expect(live(page)).toHaveText('Now renamed to Today.')

    // Typing on a selected lane header appends to its name.
    const later = await box(page, 'lane-later')
    await page.mouse.click(later.x + later.width / 2, later.y + later.height / 2)
    await page.keyboard.type('!')
    await expect(page.locator('.sb-inline-editor')).toHaveText('Later!')
    await page.keyboard.press('Enter')
    await expect.poll(async () => (await journal(page)).changes.at(-1)).toEqual({ rename: { laneId: 'later', label: 'Later!' } })

    // An empty name and an over-long one are refused and the old text stays.
    await edit('card-beta', null)
    await edit('lane-now', 'x'.repeat(90))
    state = await journal(page)
    expect(state.refusals).toEqual([
      { cardId: 'beta', rename: { cardId: 'beta', label: '' }, reason: 'Labels must contain 1 to 80 characters.' },
      { laneId: 'now', rename: { laneId: 'now', label: 'x'.repeat(90) }, reason: 'Labels must contain 1 to 80 characters.' },
    ])
    expect(await text(page, 'card-beta')).toBe('Beta')
    expect(await text(page, 'lane-now')).toBe('Today')
    await expect(page.locator('#slate [data-node-id="card-beta"]')).toContainText('Beta')
    expect(state.changes).toHaveLength(3)
    // The caption is not text anyone can edit or select.
    expect(await page.evaluate(() => {
      const { slate } = (window as any).native
      const caption = slate.nodes.one('caption-now')
      slate.selectNodes([caption])
      return { opened: caption.editor.startInline(), selected: slate.getSelectedNodes().length, pointer: getComputedStyle(caption.svgGroup.node).pointerEvents }
    })).toEqual({ opened: false, selected: 0, pointer: 'none' })
    // Renames are the host's to save: the engine broadcast none of them.
    expect(state.packages.filter(type => type === 'onNodeTextChanged')).toEqual([])
  })

  test('keyboard: Left and Right stage a move, Enter commits, Escape cancels, and each step is announced', async ({ page }) => {
    await open(page)
    const a = await box(page, 'card-alpha')
    await page.mouse.click(a.x + a.width / 2, a.y + a.height / 2)
    const start = await resting(page, 'card-alpha')
    await page.keyboard.press('ArrowRight')
    // Staged exactly like a pointer hover: captions preview and the lane is outlined.
    await expect.poll(() => text(page, 'caption-later')).toBe('1 of 1')
    await expect.poll(() => text(page, 'caption-now')).toBe('2 cards')
    await expect(page.locator('#slate [data-node-id="column-later"] path').first()).toHaveAttribute('stroke', '#1f7a5c')
    await expect(live(page)).toHaveText('Alpha to Later: 1 of 1. Press Enter to move it, Escape to cancel.')
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    await page.keyboard.press('Escape')
    await expect.poll(() => text(page, 'caption-later')).toBe('0 of 1')
    await expect(live(page)).toHaveText('Move cancelled. Alpha stays where it was.')
    expect(await resting(page, 'card-alpha')).toEqual(start)
    // Still selected: the Escape cancelled the move, not the selection.
    expect(await page.evaluate(() => (window as any).native.slate.getSelectedNodes().map((n: any) => n.id))).toEqual(['card-alpha'])

    // Right then Left returns home without committing. Further left is the canvas, where the
    // card would become a note; Right brings it back to Now. (Restated 2026-11-19: this used to
    // say there was no lane on that side.)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')
    await expect(live(page)).toHaveText('Alpha is back in Now.')
    await page.keyboard.press('ArrowLeft')
    await expect(live(page)).toHaveText('Alpha to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.')
    await page.keyboard.press('ArrowRight')
    await expect(live(page)).toHaveText('Alpha is back in Now.')
    expect((await journal(page)).changes).toEqual([])

    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await expect(live(page)).toHaveText('Alpha moved to Later. 1 of 1.')
    expect((await journal(page)).changes).toEqual([{ cardId: 'alpha', laneId: 'later' }])
    const later = (await at(page, 'lane-later'))!
    expect((await resting(page, 'card-alpha')).x).toBe(later.x)

    // Gamma may not enter Later: nothing is staged, and the arrow says why (see native-workshop-hardening.spec.ts).
    const g = await box(page, 'card-gamma')
    await page.mouse.click(g.x + g.width / 2, g.y + g.height / 2)
    await page.keyboard.press('ArrowRight')
    await expect(live(page)).toHaveText("Gamma can't move to Later. This card can't go in Later.")
    const state = await journal(page)
    expect(state.changes).toHaveLength(1)
    expect(state.packages).toEqual([])
  })

  test('update() moves only what changed and preview() shows a proposal without committing it', async ({ page }) => {
    await open(page)
    const result = await page.evaluate(async () => {
      const native = (window as any).native
      const { slate, board } = native
      const before = { beta: slate.nodes.one('card-beta'), lane: slate.nodes.one('lane-now'), canvas: slate.canvas.node }
      const model = board.value
      board.update({
        ...model,
        lanes: model.lanes.map((lane: any) => lane.id === 'later' ? { ...lane, label: 'Next week', capacity: 2 } : lane),
        cards: [
          { id: 'alpha', label: 'Alpha', laneId: 'later' }, { id: 'beta', label: 'Beta', laneId: 'now' },
          { id: 'delta', label: 'Delta', laneId: 'later' },
        ],
      })
      await board.whenDrawn()
      await new Promise(resolve => setTimeout(resolve, 400))
      return {
        sameBeta: slate.nodes.one('card-beta') === before.beta, sameLane: slate.nodes.one('lane-now') === before.lane,
        sameCanvas: slate.canvas.node === before.canvas && (window as any).__slateboxInstances.length === 1,
        ids: slate.nodes.allNodes.map((n: any) => n.id).sort(),
        alpha: native.at('card-alpha'), delta: native.at('card-delta'), later: native.at('lane-later'),
        captions: [native.at('caption-now').text, native.at('caption-later').text],
      }
    })
    expect(result.sameBeta && result.sameLane && result.sameCanvas).toBe(true)
    expect(result.ids).toEqual(['caption-later', 'caption-now', 'card-alpha', 'card-beta', 'card-delta', 'column-later', 'column-now', 'lane-later', 'lane-now', 'plain'])
    expect(result.later.text).toBe('Next week')
    expect(result.captions).toEqual(['1 card', '2 of 2'])
    expect(result.alpha.x).toBe(result.later.x)
    expect(result.delta.y).toBe(result.alpha.y + 88)
    expect((await journal(page)).changes).toEqual([])

    // A proposal is drawn, but the committed model does not change and cards do not move by hand.
    await page.evaluate(async () => {
      const { board } = (window as any).native
      const model = board.value
      board.preview({ ...model, cards: model.cards.map((card: any) => card.id === 'beta' ? { ...card, laneId: 'later' } : card).slice(0, 2) })
      await board.whenDrawn()
    })
    await expect.poll(() => text(page, 'caption-now')).toBe('0 cards')
    expect(await cards(page)).toBe('alpha@later beta@now delta@later')
    await expect(page.locator('#slate [data-node-id="card-delta"]')).toHaveCount(0)
    const held = await resting(page, 'card-beta')
    await drag(page, 'card-beta', await inLane(page, 'now'))
    expect(await resting(page, 'card-beta')).toEqual(held)
    await page.evaluate(async () => {
      const { board } = (window as any).native
      board.preview(null)
      await board.whenDrawn()
    })
    await expect.poll(() => text(page, 'caption-now')).toBe('1 card')
    await expect(page.locator('#slate [data-node-id="card-delta"]')).toBeVisible()
    expect((await journal(page)).changes).toEqual([])

    // A model arriving while a card is held cancels the drag first.
    await carry(page, 'card-alpha', await inLane(page, 'now'))
    await expect.poll(() => text(page, 'caption-now')).toBe('2 cards')
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, title: 'Renamed by a collaborator' })
    })
    await expect.poll(() => text(page, 'caption-now')).toBe('1 card')
    await page.mouse.up()
    await page.waitForTimeout(200)
    expect(await cards(page)).toBe('alpha@later beta@now delta@later')
    expect((await journal(page)).changes).toEqual([])
    const home = (await at(page, 'lane-later'))!
    expect((await resting(page, 'card-alpha')).x).toBe(home.x)

    // A move the host had to turn down (a save that lost a race) gets the same cue on the canvas.
    await page.evaluate(() => (window as any).native.board.refuse('now', 'Someone else just filled Now.'))
    await expect.poll(() => text(page, 'caption-now')).toBe('Someone else just filled Now.')
    await expect(page.locator('#slate [data-node-id="lane-now"] path').first()).toHaveAttribute('stroke', '#c2410c')
    await expect(live(page)).toHaveText('Now: Someone else just filled Now.')
    await expect.poll(() => text(page, 'caption-now'), { timeout: 4000 }).toBe('1 card')
  })

  test('a proposal outlines what it adds or changes as provisional, and only that', async ({ page }) => {
    await open(page)
    const look = () => page.evaluate(() => Object.fromEntries((window as any).native.slate.nodes.allNodes
      .filter((n: any) => /^(card|lane)-/.test(n.id))
      .map((n: any) => [n.id, n.options.borderStyle === 'dashed' ? 'dashed' : 'solid'])))
    const committed = await look()
    expect(Object.values(committed).every(style => style === 'solid')).toBe(true)
    await page.evaluate(async () => {
      const { board } = (window as any).native
      const model = board.value
      board.preview({
        ...model,
        lanes: model.lanes.map((lane: any) => lane.id === 'later' ? { ...lane, label: 'Next week' } : lane),
        cards: [...model.cards.map((card: any) => card.id === 'beta' ? { ...card, laneId: 'later' } : card), { id: 'draft', label: 'Draft', laneId: 'now' }],
      })
      await board.whenDrawn()
    })
    // The new card, the moved card and the renamed lane are dashed; what the proposal leaves alone is not.
    await expect.poll(look).toEqual({ ...committed, 'card-beta': 'dashed', 'card-draft': 'dashed', 'lane-later': 'dashed' })
    await expect(page.locator('#slate [data-node-id="card-draft"]')).toHaveAttribute('data-workshop-proposed', '')
    await expect(page.locator('#slate [data-node-id="card-alpha"]')).not.toHaveAttribute('data-workshop-proposed', '')
    // Nothing is committed, and putting the proposal away brings back the committed look.
    expect((await journal(page)).changes).toEqual([])
    await page.evaluate(async () => {
      const { board } = (window as any).native
      board.preview(null)
      await board.whenDrawn()
    })
    await expect.poll(look).toEqual(committed)
    await expect(page.locator('#slate [data-workshop-proposed]')).toHaveCount(0)
  })

  test('read-only draws the same artwork with nothing draggable or editable', async ({ page }) => {
    await open(page)
    const artwork = () => page.evaluate(() => (window as any).native.slate.nodes.allNodes.map((n: any) => [n.id, n.options.x, n.options.y, n.options.text].join('|')))
    const playable = await artwork()
    await open(page, '?readonly')
    expect(await artwork()).toEqual(playable)
    const start = await resting(page, 'card-alpha')
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    expect(await resting(page, 'card-alpha')).toEqual(start)
    const a = await box(page, 'card-alpha')
    await page.mouse.dblclick(a.x + a.width / 2, a.y + a.height / 2)
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await page.keyboard.type('x')
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    const lane = await box(page, 'lane-now')
    await page.mouse.dblclick(lane.x + lane.width / 2, lane.y + lane.height / 2)
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    const state = await journal(page)
    expect(state.changes).toEqual([])
    expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    // Switched to playable, the same notes can be moved.
    await page.evaluate(() => (window as any).native.board.setReadOnly(false))
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
  })

  test('destroy() removes the workshop and leaves the ordinary note as it was', async ({ page }) => {
    await open(page)
    const plain = await at(page, 'plain')
    const after = await page.evaluate(() => {
      const { slate, board } = (window as any).native
      const note = slate.nodes.one('plain')
      board.destroy()
      board.destroy()
      return { ids: slate.nodes.allNodes.map((n: any) => n.id), same: slate.nodes.one('plain') === note, governed: !!slate.governanceOf(note), policies: slate._dragPolicies.length }
    })
    expect(after).toEqual({ ids: ['plain'], same: true, governed: false, policies: 0 })
    await expect(page.locator('#slate [data-node-id^="card-"], #slate [data-node-id^="lane-"], #slate [data-node-id^="column-"], #slate [data-node-id^="caption-"]')).toHaveCount(0)
    expect(await at(page, 'plain')).toEqual(plain)
    expect((await journal(page)).packages).toEqual([])
    // It is still an ordinary, draggable note.
    const b = await box(page, 'plain')
    await drag(page, 'plain', { x: b.x + b.width / 2 + 200, y: b.y + b.height / 2 })
    await expect.poll(async () => (await at(page, 'plain'))!.x).toBe(plain!.x + 200)
    // And the workshop can be attached again.
    await page.evaluate(async () => {
      const native = (window as any).native
      native.board = await native.attach(native.models.lanes())
    })
    await expect(page.locator('#slate [data-node-id="card-alpha"]')).toBeVisible()
  })

  test('undo and redo of the ordinary drawing keep the workshop drawn and governed', async ({ page }) => {
    await open(page)
    // Let the engine record the drawing as loaded (its undo snapshots are debounced).
    await page.waitForTimeout(700)
    const start = (await at(page, 'plain'))!
    const b = await box(page, 'plain')
    await drag(page, 'plain', { x: b.x + b.width / 2, y: b.y + b.height / 2 + 150 })
    await expect.poll(async () => (await at(page, 'plain'))!.y).toBe(start.y + 150)
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await page.waitForTimeout(700)
    await page.evaluate(() => (window as any).native.slate.undoRedo.undo())
    // The ordinary note goes back; the workshop is the host's, so its move stays.
    await expect.poll(async () => (await at(page, 'plain'))?.y).toBe(start.y)
    await expect(page.locator('#slate [data-node-id="card-alpha"]')).toBeVisible()
    expect(await cards(page)).toBe('alpha@later beta@now gamma@now')
    const later = (await at(page, 'lane-later'))!
    await expect.poll(async () => (await at(page, 'card-alpha'))?.x).toBe(later.x)
    expect(await page.evaluate(() => {
      const { slate } = (window as any).native
      return slate.nodes.allNodes.filter((n: any) => slate.governanceOf(n)).length
    })).toBe(9)
    // And it still plays.
    const betaStart = await resting(page, 'card-beta')
    await drag(page, 'card-beta', await inLane(page, 'later'))
    await expect.poll(async () => (await journal(page)).refusals.length).toBe(1)
    expect(await resting(page, 'card-beta')).toEqual(betaStart)
  })

  test('the same Dragology spec as the SVG board can choose the candidate', async ({ page }) => {
    await open(page, '?dragology')
    await carry(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => text(page, 'caption-later')).toBe('1 of 1')
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    const betaStart = await resting(page, 'card-beta')
    await drag(page, 'card-beta', await inLane(page, 'later'))
    await expect.poll(async () => (await journal(page)).refusals).toEqual([{ cardId: 'beta', laneId: 'later', reason: 'It already holds 1 of 1 card.' }])
    expect(await resting(page, 'card-beta')).toEqual(betaStart)
    await drag(page, 'card-alpha', await inLane(page, 'now'))
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    expect((await journal(page)).changes).toEqual([{ cardId: 'alpha', laneId: 'later' }, { cardId: 'alpha', laneId: 'now' }])
  })
})

test.describe('experiences and maps as native notes', () => {
  test('budget: moving "Second $200" to Partner newsletter previews "$200 · 1 placement" and commits', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 800 })
    await open(page, '?budget')
    expect(await text(page, 'card-fund-1')).toBe('Second $200')
    expect(await text(page, 'caption-newsletter')).toBe('$0 · 0 placements')
    expect(await text(page, 'caption-reserve')).toBe('$400 · unallocated')
    await carry(page, 'card-fund-1', await inLane(page, 'newsletter'))
    await expect.poll(() => text(page, 'caption-newsletter')).toBe('$200 · 1 placement')
    await expect(page.locator('#slate [data-node-id="caption-newsletter"]')).toContainText('$200 · 1 placement')
    await expect.poll(() => text(page, 'caption-reserve')).toBe('$200 · unallocated')
    expect((await journal(page)).changes).toEqual([])
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('fund-0@calls fund-1@newsletter fund-2@reserve')
    expect((await journal(page)).changes).toEqual([{ cardId: 'fund-1', laneId: 'newsletter' }])
    const header = (await at(page, 'lane-newsletter'))!
    expect((await resting(page, 'card-fund-1')).x).toBe(header.x)
    expect(await text(page, 'caption-newsletter')).toBe('$200 · 1 placement')
  })

  test('interviews: an interview dropped on the occupied prototype swaps with the one there', async ({ page }) => {
    await open(page, '?interview')
    await drag(page, 'card-duplicate', await inLane(page, 'prototype'))
    await expect.poll(() => cards(page)).toBe('preview@interviews duplicate@prototype undo@interviews')
    const interviews = (await at(page, 'lane-interviews'))!
    await expect.poll(async () => (await at(page, 'card-preview'))!.x).toBe(interviews.x)
    expect(await text(page, 'caption-prototype')).toBe('1 of 1')
  })

  test('release plan: pulling a feature forward previews its prerequisite and the points, and an over-budget move is refused', async ({ page }) => {
    await open(page, '?release')
    // Dependencies are drawn with the engine's own connectors.
    await expect(page.locator('#slate path[data-connection-id]')).toHaveCount(1)
    expect(await text(page, 'caption-friday')).toBe('3 / 8 points')
    await carry(page, 'card-invite', await inLane(page, 'friday'))
    await expect.poll(() => text(page, 'caption-friday')).toBe('8 / 8 points')
    const friday = (await at(page, 'lane-friday'))!
    // Permission checks is a prerequisite: it is previewed moving into Friday too.
    await expect.poll(async () => (await at(page, 'card-guardrails'))!.x).toBe(friday.x)
    expect((await journal(page)).changes).toEqual([])
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('guardrails@friday invite@friday billing@friday export@next')
    expect((await journal(page)).changes).toEqual([{ cardId: 'invite', laneId: 'friday' }])
    await resting(page, 'card-invite')

    const start = await resting(page, 'card-export')
    await drag(page, 'card-export', await inLane(page, 'friday'))
    await expect.poll(async () => (await journal(page)).refusals).toEqual([
      { cardId: 'export', laneId: 'friday', reason: 'Needs 4 points. It already holds 8 of 8 points.' },
    ])
    expect(await resting(page, 'card-export')).toEqual(start)
    // A release card shows its points on a second line, so it is not renamed in place.
    const invite = await box(page, 'card-invite')
    await page.mouse.dblclick(invite.x + invite.width / 2, invite.y + invite.height / 2)
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  })

  test('a three-station map: the token takes one hop, and two hops are refused where it was dropped', async ({ page }) => {
    await open(page, '?map')
    // Stations are joined by the engine's own connectors.
    await expect(page.locator('#slate path[data-connection-id]')).toHaveCount(2)
    const start = await resting(page, 'card-token')
    await carry(page, 'card-token', await inLane(page, 'refund'))
    // Held over the station two hops away: it is marked closed, and nothing is previewed as if it were allowed.
    await expect(page.locator('#slate [data-node-id="column-refund"] path').first()).toHaveAttribute('stroke', '#c2410c')
    expect(await text(page, 'caption-refund')).toBe('0 cards')
    await page.mouse.up()
    await expect.poll(async () => (await journal(page)).refusals).toEqual([
      { cardId: 'token', laneId: 'refund', reason: "Issue refund can't be reached from Refund request." },
    ])
    await expect.poll(() => text(page, 'caption-refund')).toBe("Issue refund can't be reached from Refund request.")
    expect(await resting(page, 'card-token')).toEqual(start)
    expect(await cards(page)).toBe('token@request')
    expect((await journal(page)).changes).toEqual([])

    await drag(page, 'card-token', await inLane(page, 'finance'))
    await expect.poll(() => cards(page)).toBe('token@finance')
    await drag(page, 'card-token', await inLane(page, 'refund'))
    await expect.poll(() => cards(page)).toBe('token@refund')
    expect((await journal(page)).changes).toEqual([{ cardId: 'token', laneId: 'finance' }, { cardId: 'token', laneId: 'refund' }])
    // Connectors are part of the drawing, not of the saved document.
    expect(await page.evaluate(() => JSON.parse((window as any).native.slate.exportJSON()).nodes.map((n: any) => n.relationships.associations.length))).toEqual([0])
  })
})

test.describe('touch at 390x844', () => {
  async function phone(browser: Browser, baseURL: string | undefined, query: string) {
    const context = await browser.newContext({ baseURL, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    const device = await context.newCDPSession(page)
    await open(page, query)
    const touch = (type: string, points: { x: number; y: number }[]) =>
      device.send('Input.dispatchTouchEvent', { type: type as any, touchPoints: points })
    /** Put a finger on a note and carry it to a point, leaving the finger down. */
    async function carryByTouch(id: string, to: { x: number; y: number }) {
      const from = await box(page, id)
      const sx = from.x + from.width / 2, sy = from.y + from.height / 2
      await touch('touchStart', [{ x: sx, y: sy }])
      for (let i = 1; i <= 8; i++) await touch('touchMove', [{ x: sx + (to.x - sx) * i / 8, y: sy + (to.y - sy) * i / 8 }])
    }
    return { context, page, touch, carryByTouch }
  }

  test('a finger moves a card, is refused by a full lane, and a cancelled touch puts the card back', async ({ browser, browserName, baseURL }) => {
    test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch and touchcancel events')
    const { context, page, touch, carryByTouch } = await phone(browser, baseURL, '?fit')
    try {
      // The whole board is on screen at phone width.
      const later = await box(page, 'column-later')
      expect(later.x + later.width).toBeLessThanOrEqual(390)
      const alphaStart = await resting(page, 'card-alpha')

      // A cancelled touch is a refusal.
      await carryByTouch('card-alpha', await inLane(page, 'later'))
      await expect.poll(() => text(page, 'caption-later')).toBe('1 of 1')
      await touch('touchCancel', [])
      await expect.poll(() => text(page, 'caption-later')).toBe('0 of 1')
      expect(await resting(page, 'card-alpha')).toEqual(alphaStart)
      expect(await cards(page)).toBe('alpha@now beta@now gamma@now')

      // A permitted move commits once and the card settles in the lane.
      await carryByTouch('card-alpha', await inLane(page, 'later'))
      await expect.poll(() => text(page, 'caption-later')).toBe('1 of 1')
      await touch('touchEnd', [])
      await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
      const header = (await at(page, 'lane-later'))!
      const alpha = await resting(page, 'card-alpha')
      expect([alpha.x, alpha.y]).toEqual([header.x, header.y - 6 + 98])

      // The full lane and the forbidden lane refuse; each card returns to its exact start.
      for (const [id, reason] of [['beta', 'It already holds 1 of 1 card.'], ['gamma', "This card can't go in Later."]]) {
        const start = await resting(page, 'card-' + id)
        await carryByTouch('card-' + id, await inLane(page, 'later'))
        await touch('touchEnd', [])
        await expect.poll(async () => (await journal(page)).refusals.at(-1)).toEqual({ cardId: id, laneId: 'later', reason })
        expect(await resting(page, 'card-' + id)).toEqual(start)
      }
      const state = await journal(page)
      expect(state.changes).toEqual([{ cardId: 'alpha', laneId: 'later' }])
      expect(state.packages.filter(type => /^onNode|Relationship/.test(type))).toEqual([])
      expect(state.sent.filter(type => /^onNode|Relationship/.test(type))).toEqual([])
    } finally { await context.close() }
  })

  test('the budget workshop fits a phone and "Second $200" moves by touch', async ({ browser, browserName, baseURL }) => {
    test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch events')
    const { context, page, touch, carryByTouch } = await phone(browser, baseURL, '?budget&fit&empty')
    try {
      const last = await box(page, 'column-pilot')
      expect(last.x + last.width).toBeLessThanOrEqual(390)
      if (shots) await page.screenshot({ path: shots + '/04-budget-390x844.png' })
      await carryByTouch('card-fund-1', await inLane(page, 'newsletter'))
      await expect.poll(() => text(page, 'caption-newsletter')).toBe('$200 · 1 placement')
      expect((await journal(page)).changes).toEqual([])
      await touch('touchEnd', [])
      await expect.poll(() => cards(page)).toBe('fund-0@calls fund-1@newsletter fund-2@reserve')
      expect((await journal(page)).changes).toEqual([{ cardId: 'fund-1', laneId: 'newsletter' }])
    } finally { await context.close() }
  })
})
