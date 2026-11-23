import { expect, test, type Page } from '@playwright/test'

/**
 * Ways a governed card could move, change, multiply or disappear without the
 * workshop model agreeing, found by trying to break attachWorkshop. Same fixture
 * as native-workshop.spec.ts: lanes Now and Later (Later holds one card); Alpha,
 * Beta and Gamma start in Now, and Gamma may never leave it.
 */

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
    refusals: log.refusals as { cardId?: string; laneId?: string | null; reason: string }[],
    packages: log.packages.map((pkg: any) => pkg.type) as string[],
  }
})
const live = (page: Page) => page.locator('#slate [aria-live]')
/** Each selected note's name, and whether it is still one of the slate's notes. */
const selection = (page: Page) => page.evaluate(() => {
  const { slate } = (window as any).native
  return slate.getSelectedNodes().map((n: any) => [n.id, slate.nodes.one(n.id) === n] as [string, boolean])
})
const focused = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute('data-node-id') ?? document.activeElement?.tagName)

async function inLane(page: Page, laneId: string) {
  const column = await box(page, 'column-' + laneId)
  return { x: column.x + column.width / 2, y: column.y + column.height * 0.85 }
}
async function press(page: Page, id: string) {
  const from = await box(page, id)
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
  await page.mouse.down()
}
async function carry(page: Page, id: string, to: { x: number; y: number }, steps = 12) {
  await press(page, id)
  await page.mouse.move(to.x, to.y, { steps })
}
async function drag(page: Page, id: string, to: { x: number; y: number }, steps = 12) {
  await carry(page, id, to, steps)
  await page.mouse.up()
}
async function click(page: Page, id: string) {
  const b = await box(page, id)
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)
}
/** Where a card rests in its lane: slot 0 is the first place under the caption. */
async function slot(page: Page, laneId: string, index: number) {
  const header = (await at(page, 'lane-' + laneId))!
  return { x: header.x, y: header.y - 6 + 98 + index * 88 }
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
function pageErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(String(error)))
  return errors
}

test.describe('a governed card changes only when the workshop agrees', () => {
  for (const permission of ['isReadOnly', 'isCommentOnly'] as const) {
    test(`a viewer cannot move a card from the keyboard when the slate says ${permission}`, async ({ page }) => {
      await open(page)
      await click(page, 'card-alpha')
      await expect.poll(() => selection(page)).toEqual([['card-alpha', true]])
      // The host withdraws edit rights (a role change, a plan limit) with the card still selected.
      await page.evaluate(name => { (window as any).native.slate.options.events[name] = () => true }, permission)
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(250)
      // Nothing is staged...
      expect(await text(page, 'caption-later')).toBe('0 / 1')
      await page.keyboard.press('Enter')
      await page.waitForTimeout(250)
      // ...nothing is committed, and no editor opens.
      expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
      expect((await journal(page)).changes).toEqual([])
      await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
      // The pointer is refused by the same permission.
      const start = await at(page, 'card-beta')
      await drag(page, 'card-beta', await inLane(page, 'later'))
      await page.waitForTimeout(300)
      expect(await at(page, 'card-beta')).toEqual(start)
      expect(await cards(page)).toBe('alpha@now beta@now gamma@now')
    })
  }

  test('a host pane cannot restyle a card, or tell anyone it did, through collab.invoke and collab.send', async ({ page }) => {
    await open(page)
    const result = await page.evaluate(async () => {
      const { slate, log } = (window as any).native
      const card = slate.nodes.one('card-alpha'), plain = slate.nodes.one('plain')
      const before = { fill: card.options.backgroundColor, text: card.options.text, undo: slate.undoRedo.undoStack.length }
      // What the app's node panes do for the selected note: apply locally, then send.
      const aimedAtCard = [
        { type: 'onNodeColorChanged', data: { id: 'card-alpha', color: '#ff0000' } },
        { type: 'onNodeTextChanged', data: { id: 'card-alpha', text: 'Hijacked', fontSize: 40 } },
        { type: 'onNodesMove', data: { nodeOptions: [{ id: 'card-alpha', xPos: 0, yPos: 0 }] } },
      ]
      for (const pkg of aimedAtCard) { slate.collab.invoke(pkg); slate.collab.send(pkg) }
      // The same pane on an ordinary note still works, alone or in a batch with a card.
      const mixed = [{ type: 'onNodeColorChanged', data: { id: 'plain', color: '#00ff00' } }, { type: 'onNodeColorChanged', data: { id: 'card-beta', color: '#00ff00' } }]
      slate.collab.invoke(mixed)
      slate.collab.send(mixed)
      await new Promise(resolve => setTimeout(resolve, 700))
      return {
        card: { fill: card.options.backgroundColor, text: card.options.text, x: card.options.x },
        before, beta: slate.nodes.one('card-beta').options.backgroundColor, plain: plain.options.backgroundColor,
        told: log.packages.map((pkg: any) => pkg.type + ':' + (pkg.data.id ?? '')),
        undoSteps: slate.undoRedo.undoStack.length - before.undo,
      }
    })
    expect(result.card).toEqual({ fill: result.before.fill, text: 'Alpha', x: (await at(page, 'card-alpha'))!.x })
    expect(result.beta).toBe(result.before.fill)
    expect(result.plain).toBe('#00ff00')
    // The host's save path heard about the ordinary note only, and undo gained that one step.
    expect(result.told).toEqual(['onNodeColorChanged:plain'])
    expect(result.undoSteps).toBe(1)
  })

  test('undo with a card selected leaves no ghost of the card to duplicate, copy or paste', async ({ page }) => {
    const errors = pageErrors(page)
    await open(page)
    await page.waitForTimeout(700)
    const start = (await at(page, 'plain'))!
    const b = await box(page, 'plain')
    await drag(page, 'plain', { x: b.x + b.width / 2, y: b.y + b.height / 2 + 150 })
    await expect.poll(async () => (await at(page, 'plain'))!.y).toBe(start.y + 150)
    await page.waitForTimeout(700)
    await click(page, 'card-beta')
    await expect.poll(() => selection(page)).toEqual([['card-beta', true]])
    await page.waitForTimeout(100)
    // Undo replaces every note on the slate, the workshop's included.
    await page.keyboard.press('Control+z')
    await expect.poll(async () => (await at(page, 'plain'))?.y).toBe(start.y)
    await page.waitForTimeout(400)
    // The selection is the redrawn card, never the note that undo removed.
    expect(await selection(page)).toEqual([['card-beta', true]])
    await page.keyboard.press('Control+d')
    await page.keyboard.press('Control+c')
    await page.keyboard.press('Control+v')
    await page.waitForTimeout(500)
    const state = await page.evaluate(() => {
      const { slate } = (window as any).native
      return {
        ordinary: slate.freeNodes().map((n: any) => n.options.text),
        saved: JSON.parse(slate.exportJSON()).nodes.map((n: any) => n.options.text),
      }
    })
    expect(state).toEqual({ ordinary: ['Ordinary note'], saved: ['Ordinary note'] })
    expect((await journal(page)).packages).not.toContain('onNodeAdded')
    // The redrawn card still plays from the keyboard.
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@later gamma@now')
    expect(errors).toEqual([])
  })

  test('a loaded document that has a note with a card\'s name keeps it as its own note', async ({ page }) => {
    await open(page)
    const state = await page.evaluate(async () => {
      const { slate, board } = (window as any).native
      const doc = JSON.parse(slate.exportJSON())
      doc.nodes.push({
        options: { id: 'card-alpha', text: 'Saved by the document', xPos: 60, yPos: 420, width: 160, height: 80 },
        relationships: { associations: [] },
      })
      await slate.loadJSON(JSON.stringify(doc))
      await board.whenDrawn()
      await new Promise(resolve => setTimeout(resolve, 200))
      const note = slate.nodes.one('card-alpha')
      const loaded = {
        text: note.options.text, governed: !!slate.governanceOf(note),
        saved: JSON.parse(slate.exportJSON()).nodes.map((n: any) => n.options.id),
        workshopNotes: slate.nodes.allNodes.filter((n: any) => slate.governanceOf(n)).map((n: any) => n.id),
        alpha: slate.nodes.allNodes.filter((n: any) => slate.governanceOf(n) && n.options.text === 'Alpha').map((n: any) => n.id),
      }
      return { loaded }
    })
    expect(state.loaded.text).toBe('Saved by the document')
    // It is still the document's note: ordinary, saved, and not removed with the workshop.
    expect(state.loaded.governed).toBe(false)
    expect(state.loaded.saved).toEqual(['plain', 'card-alpha'])
    // The workshop goes without nothing: Alpha is drawn as a note of another id.
    expect(state.loaded.alpha).toHaveLength(1)
    const alpha = state.loaded.alpha[0]
    expect(alpha).not.toBe('card-alpha')
    expect([...state.loaded.workshopNotes].sort()).toEqual(['column-now', 'lane-now', 'caption-now', alpha, 'card-beta', 'card-gamma', 'column-later', 'lane-later', 'caption-later'].sort())
    // And it is Alpha in every way that matters: it is dragged under the workshop's rules.
    await drag(page, alpha, await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    expect((await journal(page)).changes).toEqual([{ cardId: 'alpha', laneId: 'later' }])
    const afterDetach = await page.evaluate(() => {
      const { slate, board } = (window as any).native
      board.destroy()
      return slate.nodes.allNodes.map((n: any) => n.id)
    })
    expect(afterDetach).toEqual(['plain', 'card-alpha'])
  })

  test('a card its host removes right after a drop, or a workshop detached mid-drag, leaves no ghost selection', async ({ page }) => {
    const errors = pageErrors(page)
    await open(page)
    // A collaborator's model without Alpha arrives as Alpha is dropped.
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, cards: board.value.cards.filter((card: any) => card.id !== 'alpha') })
    })
    await page.waitForTimeout(700)
    await expect(page.locator('#slate [data-node-id="card-alpha"]')).toHaveCount(0)
    expect((await selection(page)).filter(([, present]) => !present)).toEqual([])

    // The host detaches the workshop while Beta is held.
    await carry(page, 'card-beta', await inLane(page, 'later'))
    await page.waitForTimeout(100)
    await page.evaluate(() => (window as any).native.board.destroy())
    await page.mouse.move(700, 500, { steps: 3 })
    await page.mouse.up()
    await page.waitForTimeout(700)
    expect((await selection(page)).filter(([, present]) => !present)).toEqual([])
    expect(await page.evaluate(() => (window as any).native.slate.nodes.allNodes.map((n: any) => n.id))).toEqual(['plain'])
    expect(errors).toEqual([])
    // The ordinary note is untouched by all of it and still drags.
    const plain = (await at(page, 'plain'))!
    const b = await box(page, 'plain')
    await drag(page, 'plain', { x: b.x + b.width / 2 + 120, y: b.y + b.height / 2 })
    await expect.poll(async () => (await at(page, 'plain'))!.x).toBe(plain.x + 120)
  })

  test('a host callback that throws does not leave the notes and the model disagreeing', async ({ page }) => {
    await open(page)
    await page.evaluate(() => { (window as any).native.hostThrows = true })
    // By pointer: the move is committed in the model, so the card settles in its new lane.
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await page.waitForTimeout(600)
    const alpha = (await at(page, 'card-alpha'))!, beta = (await at(page, 'card-beta'))!
    expect({ x: alpha.x, y: alpha.y }).toEqual(await slot(page, 'later', 0))
    expect({ x: beta.x, y: beta.y }).toEqual(await slot(page, 'now', 0))
    // A refusal the host fails to show still puts the card back.
    await drag(page, 'card-beta', await inLane(page, 'later'))
    await page.waitForTimeout(600)
    const back = (await at(page, 'card-beta'))!
    expect({ x: back.x, y: back.y }).toEqual(await slot(page, 'now', 0))
    // By keyboard: Enter commits the staged move and does nothing else (no editor opens on the card).
    await click(page, 'card-alpha')
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
    await page.waitForTimeout(400)
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    expect((await journal(page)).changes).toEqual([{ cardId: 'alpha', laneId: 'later' }, { cardId: 'alpha', laneId: 'now' }])
  })

  test('a card caught while it glides to its slot still comes to rest in a slot', async ({ page }) => {
    await open(page)
    // Alpha leaves Now, so Beta and Gamma start gliding up one place.
    await drag(page, 'card-alpha', await inLane(page, 'later'), 3)
    // Beta is caught on the way and dropped on open canvas: refused, back to its (new) slot.
    await carry(page, 'card-beta', { x: 150, y: 600 }, 3)
    await page.mouse.up()
    // Gamma is only pressed while it glides, and let go once it has arrived.
    await press(page, 'card-gamma')
    await page.waitForTimeout(450)
    await page.mouse.up()
    await page.waitForTimeout(700)
    expect(await cards(page)).toBe('alpha@later beta@now gamma@now')
    const beta = (await at(page, 'card-beta'))!, gamma = (await at(page, 'card-gamma'))!
    expect({ x: beta.x, y: beta.y }).toEqual(await slot(page, 'now', 0))
    expect({ x: gamma.x, y: gamma.y }).toEqual(await slot(page, 'now', 1))
    const alpha = (await at(page, 'card-alpha'))!
    expect({ x: alpha.x, y: alpha.y }).toEqual(await slot(page, 'later', 0))
  })

  test('pressing a lane header leaves keyboard focus where a press on any note leaves it', async ({ page }) => {
    await open(page)
    await click(page, 'plain')
    const afterOrdinary = await focused(page)
    await page.waitForTimeout(450)
    await click(page, 'lane-now')
    await expect.poll(() => selection(page)).toEqual([['lane-now', true]])
    // A lane header cannot be dragged, but it takes a press like every other note.
    expect(await focused(page)).toBe(afterOrdinary)
    await page.waitForTimeout(450)
    await click(page, 'card-alpha')
    await expect.poll(() => selection(page)).toEqual([['card-alpha', true]])
    // Keys go to the selected card, not to a lane header that kept focus.
    await page.keyboard.press('Space')
    await page.waitForTimeout(200)
    expect(await selection(page)).toEqual([['card-alpha', true]])
    // A lane header is still renamed by double-click, and a press inside its open editor still places the caret.
    await page.waitForTimeout(450)
    const lane = await box(page, 'lane-later')
    await page.mouse.dblclick(lane.x + lane.width / 2, lane.y + lane.height / 2)
    await expect(page.locator('.sb-inline-editor')).toBeVisible()
    await page.mouse.click(lane.x + lane.width / 2, lane.y + lane.height / 2)
    await expect(page.locator('.sb-inline-editor')).toBeFocused()
    await page.keyboard.press('ControlOrMeta+a')
    await page.keyboard.type('Later!')
    await page.keyboard.press('Enter')
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    await expect.poll(async () => (await journal(page)).changes.at(-1)).toEqual({ rename: { laneId: 'later', label: 'Later!' } })
  })

  test('keyboard: an arrow toward a lane the rules close gives the refusal a drop there would', async ({ page }) => {
    await open(page)
    await drag(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await page.waitForTimeout(450)
    await click(page, 'card-beta')
    const start = await at(page, 'card-beta')
    await page.keyboard.press('ArrowRight')
    // Later is full: the lane says so, the reason is announced and the host is told.
    await expect(live(page)).toHaveText("Beta can't move to Later. It already holds 1 of 1 card.")
    await expect.poll(() => text(page, 'caption-later')).toBe('It already holds 1 of 1 card.')
    await expect(page.locator('#slate [data-node-id="lane-later"] path').first()).toHaveAttribute('stroke', '#c2410c')
    expect((await journal(page)).refusals).toEqual([{ cardId: 'beta', laneId: 'later', reason: 'It already holds 1 of 1 card.' }])
    // Nothing is staged and nothing moved; the card is still the selection.
    expect(await cards(page)).toBe('alpha@later beta@now gamma@now')
    expect(await at(page, 'card-beta')).toEqual(start)
    await expect.poll(() => text(page, 'caption-later'), { timeout: 4000 }).toBe('1 / 1')
    expect(await selection(page)).toEqual([['card-beta', true]])

    await page.waitForTimeout(450)
    await click(page, 'card-gamma')
    await page.keyboard.press('ArrowRight')
    await expect(live(page)).toHaveText("Gamma can't move to Later. This card can't go in Later.")
    expect((await journal(page)).refusals.at(-1)).toEqual({ cardId: 'gamma', laneId: 'later', reason: "This card can't go in Later." })
    // The other side is the canvas, where Gamma may not go as a note: refused with the reason.
    // (Restated 2026-11-19: past the first lane is now the canvas, see native-workshop-cards.spec.ts.)
    await page.keyboard.press('ArrowLeft')
    await expect(live(page)).toHaveText('Gamma may only be in Now, so it stays a card.')
    expect((await journal(page)).refusals).toHaveLength(3)
    expect((await journal(page)).refusals.at(-1)).toEqual({ cardId: 'gamma', laneId: null, reason: 'Gamma may only be in Now, so it stays a card.' })
    expect((await journal(page)).changes).toEqual([{ cardId: 'alpha', laneId: 'later' }])
  })
})

test.describe('a refusal the host shows itself', () => {
  test('refuse() leaves a held card in the hand and a staged move on show', async ({ page }) => {
    await open(page)
    // Held over Later: the captions preview the move.
    await carry(page, 'card-alpha', await inLane(page, 'later'))
    await expect.poll(() => text(page, 'caption-now')).toBe('2')
    const held = await at(page, 'card-alpha')
    await page.evaluate(() => (window as any).native.board.refuse('now', 'Someone else just changed Now.'))
    await page.waitForTimeout(350)
    // The cue is on Now, the card has not been taken out of the hand, and the preview is still the preview.
    expect(await text(page, 'caption-now')).toBe('Someone else just changed Now.')
    expect(await at(page, 'card-alpha')).toEqual(held)
    expect(await text(page, 'caption-later')).toBe('1 / 1')
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await expect.poll(() => text(page, 'caption-now'), { timeout: 4000 }).toBe('2')

    // Staged from the keyboard: what Enter will commit stays on show while the cue is up.
    await page.waitForTimeout(450)
    await click(page, 'card-alpha')
    await page.keyboard.press('ArrowLeft')
    await expect.poll(() => text(page, 'caption-later')).toBe('0 / 1')
    const staged = await resting(page, 'card-alpha')
    await page.evaluate(() => (window as any).native.board.refuse('now', 'Someone else just changed Now.'))
    await page.waitForTimeout(350)
    expect(await text(page, 'caption-now')).toBe('Someone else just changed Now.')
    expect(await text(page, 'caption-later')).toBe('0 / 1')
    expect(await at(page, 'card-alpha')).toEqual(staged)
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@now beta@now gamma@now')
  })
})

test.describe('the selection outline', () => {
  /** How far the selection outline's corner is from the selected note's corner, in screen pixels. */
  async function outlineOffset(page: Page, id: string) {
    // The outline is redrawn when the selection is refreshed; while it is, there is none to measure.
    const outline = await page.locator('#slate .svg_select_shape').first().boundingBox().catch(() => null)
    const note = await box(page, id)
    return outline ? Math.max(Math.abs(outline.x - note.x), Math.abs(outline.y - note.y)) : Number.POSITIVE_INFINITY
  }

  /**
   * Arrange to measure, on every frame of the next half second, how far a visible
   * selection outline is from the note it belongs to. (Armed and awaited before the
   * key is pressed, so no frame of the glide is missed.)
   */
  async function watchOutline(page: Page, id: string) {
    await page.evaluate(key => {
      (window as any).outlineWatch = new Promise<{ worst: number; seen: number }>(resolve => {
        const started = performance.now()
        let worst = 0, seen = 0
        const frame = () => {
          const outline = document.querySelector('#slate .svg_select_shape')?.getBoundingClientRect()
          const note = (window as any).native.box(key)
          if (outline && outline.width > 0) {
            seen++
            worst = Math.max(worst, Math.abs(outline.x - note.x), Math.abs(outline.y - note.y))
          }
          if (performance.now() - started < 500) requestAnimationFrame(frame)
          else resolve({ worst, seen })
        }
        requestAnimationFrame(frame)
      })
    }, id)
  }
  const outlineWatched = (page: Page) => page.evaluate(() => (window as any).outlineWatch as Promise<{ worst: number; seen: number }>)

  test('stays around a card that is staged and moved from the keyboard, and one a new model moves', async ({ page }) => {
    await open(page)
    await click(page, 'card-alpha')
    await expect(page.locator('#slate .svg_select_shape')).toBeVisible()
    await expect.poll(() => outlineOffset(page, 'card-alpha')).toBeLessThan(4)
    // Staged in Later: the outline goes with the card, not round whichever card took its
    // old place, and on no frame of the glide is it drawn anywhere but round the card.
    await watchOutline(page, 'card-alpha')
    await page.keyboard.press('ArrowRight')
    const glide = await outlineWatched(page)
    expect(glide.seen).toBeGreaterThan(0)
    expect(glide.worst).toBeLessThan(4)
    await expect.poll(() => text(page, 'caption-later')).toBe('1 / 1')
    await expect.poll(() => outlineOffset(page, 'card-alpha')).toBeLessThan(4)
    await page.keyboard.press('Escape')
    await expect.poll(() => text(page, 'caption-later')).toBe('0 / 1')
    await expect.poll(() => outlineOffset(page, 'card-alpha')).toBeLessThan(4)
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await expect.poll(() => cards(page)).toBe('alpha@later beta@now gamma@now')
    await expect.poll(() => outlineOffset(page, 'card-alpha')).toBeLessThan(4)
    // A collaborator's model moves the selected card back.
    await page.evaluate(() => {
      const { board } = (window as any).native
      board.update({ ...board.value, cards: board.value.cards.map((card: any) => card.id === 'alpha' ? { ...card, laneId: 'now' } : card) })
    })
    await expect.poll(async () => (await at(page, 'card-alpha'))!.x).toBe((await slot(page, 'now', 0)).x)
    await expect.poll(() => outlineOffset(page, 'card-alpha')).toBeLessThan(4)
    expect(await selection(page)).toEqual([['card-alpha', true]])
  })
})

test.describe('the Dragology chooser', () => {
  /**
   * Release plan fixture: Friday release, Next week, Unscheduled. "Invoice download"
   * (billing) starts in Friday and may go to either other lane. Held by its left
   * edge with the pointer just inside Next week's right edge, the pointer is in
   * Next week but the card itself is nearest its place in Unscheduled.
   */
  async function holdBillingAtTheSeam(page: Page) {
    const billing = await box(page, 'card-billing'), next = await box(page, 'column-next'), row = await box(page, 'card-guardrails')
    await page.mouse.move(billing.x + 6, billing.y + billing.height / 2)
    await page.mouse.down()
    await page.mouse.move(next.x + next.width - 8, row.y + row.height / 2, { steps: 12 })
  }

  test('by default the lane under the pointer decides', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 800 })
    await open(page, '?release')
    await holdBillingAtTheSeam(page)
    await expect.poll(() => text(page, 'caption-next')).toBe('9 / 12 points')
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('guardrails@next invite@backlog billing@next export@next')
  })

  test('with chooseCandidate the Dragology spec decides: the board whose place for the card is nearest', async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 800 })
    await open(page, '?release&dragology')
    await holdBillingAtTheSeam(page)
    // Previewed and committed in Unscheduled, though the pointer is inside Next week.
    await expect.poll(() => text(page, 'caption-backlog')).toBe('6 points')
    expect(await text(page, 'caption-next')).toBe('6 / 12 points')
    await page.mouse.up()
    await expect.poll(() => cards(page)).toBe('guardrails@next invite@backlog billing@backlog export@next')
    expect((await journal(page)).changes).toEqual([{ cardId: 'billing', laneId: 'backlog' }])
  })
})

test.describe('reduced motion', () => {
  /**
   * Arrange to record the world position of some notes two frames after the next
   * mouse release: late enough for a glide to have taken its first step, far too
   * early for one to have ended. (Armed and awaited before the button comes up, so
   * the release cannot slip past the listener.)
   */
  async function watchRelease(page: Page, ids: string[]) {
    await page.evaluate(names => {
      (window as any).released = new Promise<Record<string, { x: number; y: number }>>(resolve => {
        window.addEventListener('mouseup', () => requestAnimationFrame(() => requestAnimationFrame(() => {
          const { native } = window as any
          resolve(Object.fromEntries(names.map(id => [id, { x: native.at(id).x, y: native.at(id).y }])))
        })), { once: true, capture: true })
      })
    }, ids)
  }
  const released = (page: Page) => page.evaluate(() => (window as any).released as Promise<Record<string, { x: number; y: number }>>)

  test('a refused card is put back, an accepted one settled and a new model drawn without gliding', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page)
    // Refused: within two frames Gamma is back where it started.
    const gamma = (await at(page, 'card-gamma'))!
    await carry(page, 'card-gamma', await inLane(page, 'later'))
    await page.waitForTimeout(100)
    await watchRelease(page, ['card-gamma'])
    await page.mouse.up()
    expect((await released(page))['card-gamma']).toEqual({ x: gamma.x, y: gamma.y })

    // Accepted: Alpha is in its slot, and the cards behind it have closed up.
    await page.waitForTimeout(450)
    await carry(page, 'card-alpha', await inLane(page, 'later'))
    await page.waitForTimeout(100)
    await watchRelease(page, ['card-alpha', 'card-beta', 'card-gamma'])
    await page.mouse.up()
    expect(await released(page)).toEqual({
      'card-alpha': await slot(page, 'later', 0), 'card-beta': await slot(page, 'now', 0), 'card-gamma': await slot(page, 'now', 1),
    })

    // A model from the host: two frames later every card is where the model says.
    const positions = await page.evaluate(async () => {
      const { native } = window as any
      const model = native.board.value
      native.board.update({ ...model, cards: model.cards.map((card: any) => ({ ...card, laneId: card.id === 'alpha' ? 'now' : card.id === 'beta' ? 'later' : card.laneId })) })
      await native.board.whenDrawn()
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      return Object.fromEntries(['card-alpha', 'card-beta', 'card-gamma'].map(id => [id, { x: native.at(id).x, y: native.at(id).y }]))
    })
    expect(positions).toEqual({
      'card-alpha': await slot(page, 'now', 0), 'card-beta': await slot(page, 'later', 0), 'card-gamma': await slot(page, 'now', 1),
    })
  })

  test('without the preference the same card glides back (so the test above measures something)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await open(page)
    const gamma = (await at(page, 'card-gamma'))!
    await carry(page, 'card-gamma', await inLane(page, 'later'))
    await page.waitForTimeout(100)
    await watchRelease(page, ['card-gamma'])
    await page.mouse.up()
    expect((await released(page))['card-gamma']).not.toEqual({ x: gamma.x, y: gamma.y })
    await expect.poll(async () => { const now = (await at(page, 'card-gamma'))!; return { x: now.x, y: now.y } }).toEqual({ x: gamma.x, y: gamma.y })
  })
})
