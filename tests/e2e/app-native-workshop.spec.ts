import { expect, test, type Browser, type Page } from '@playwright/test'
import { createInterviewWorkshop, encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import {
  announced, canvas, caption, card, conversation, dragCard, finger, holdCardOver, keyboardMove, lane, laneOfCard, note, offeredLanes,
  placementOutcomes, previewWorkshopMessage, renameInPlace, resting, selectCard, slateKey, storedWorkshop, workshopReady, workshopStatus,
} from './app-native-workshop.shared'

/**
 * A workshop slate is an ordinary Slatebox slate with the workshop on its canvas. These
 * tests run against the real Meteor app: the canvas is live, the workshop's rules decide every
 * drop, notes a person adds beside the workshop are saved as the slate's own notes, and the
 * workshop itself is only ever saved as its model.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

// Two lanes with rules that refuse: Next holds one card, and Gamma may only be in Now.
const ruled: Workshop = {
  version: 1, title: 'Native canvas proof',
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
  const engine = (window as any).slate.v2
  const box = engine.canvas.viewbox()
  return { x: box.x as number, y: box.y as number, zoom: engine.getZoom() as number }
})

/** A second person who has joined the owner's slate through its edit link. */
async function joinAsEditor(browser: Browser, owner: Page, options: Parameters<Browser['newContext']>[0] = {}) {
  const link = await shareAs(owner, 'edit')
  const context = await browser.newContext(options)
  const page = await context.newPage()
  await page.goto(link.href)
  await dismissWelcome(page)
  await workshopReady(page)
  await workshopStatus(page).getByRole('button', { name: 'Join to edit', exact: true }).click()
  await expect.poll(() => userId(page)).toBeTruthy()
  await expect(conversation(page)).toBeVisible()
  return { context, page, id: (await userId(page))!, link }
}

test('the $600 budget opens on the slate\'s own canvas, which pans, zooms and keeps its minimap', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openOwned(page, '/new/pilot-budget')
    id = owner.id
    // One canvas: the real one, visible, with the workshop's notes inside it and no board laid over it.
    await expect(canvas(page)).toBeVisible()
    expect(await canvas(page).evaluate(element => getComputedStyle(element).visibility)).toBe('visible')
    await expect(page.locator('.map-studio, .map-stage, [data-workshop-card], [data-native-workshop-map]')).toHaveCount(0)
    for (const id of ['lane-reserve', 'lane-calls', 'lane-newsletter', 'lane-pilot', 'card-fund-0', 'card-fund-1', 'card-fund-2']) {
      await expect(note(page, id)).toBeVisible()
    }
    await expect(caption(page, 'reserve')).toContainText('$400 · unallocated')
    await expect(page.locator('#slateCanvas .slateboxjs-birdseye')).toBeVisible()
    await expect(page.locator('#slateCanvas .slatebox-zoom-slider')).toBeVisible()
    // Nothing on screen covers the card: the element under its centre belongs to the card's own note.
    const fund = await resting(page, 'card-fund-1')
    expect(await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('[data-node-id]')?.getAttribute('data-node-id'),
      { x: fund.x + fund.width / 2, y: fund.y + fund.height / 2 })).toBe('card-fund-1')
    // It is drawn in the app's own note family, not a board font of its own.
    expect(await card(page, 'fund-1').locator('text').first().evaluate(element => getComputedStyle(element).fontFamily)).toContain('Manrope')

    // Zoom with Ctrl and the wheel, then pan with the wheel alone: the card follows the view.
    const before = await view(page)
    const empty = await canvas(page).boundingBox()
    await page.mouse.move(empty!.x + 60, empty!.y + empty!.height - 60)
    await page.keyboard.down('Control')
    await page.mouse.wheel(0, -120)
    await page.keyboard.up('Control')
    await expect.poll(async () => (await view(page)).zoom).toBeGreaterThan(before.zoom)
    const zoomed = await view(page)
    const cardZoomed = await resting(page, 'card-fund-1')
    expect(cardZoomed.width).toBeGreaterThan(fund.width)
    await page.mouse.wheel(-60, 40)
    await expect.poll(async () => (await view(page)).x).toBeLessThan(zoomed.x)
    expect((await view(page)).zoom).toBeCloseTo(zoomed.zoom, 3)
    const cardPanned = await resting(page, 'card-fund-1')
    expect(Math.round(cardPanned.x - cardZoomed.x)).toBeGreaterThan(20)
    expect(Math.round(cardPanned.y - cardZoomed.y)).toBeLessThan(-10)

    // After panning and zooming the workshop still plays, and the move is saved as the model.
    await dragCard(page, 'fund-1', 'calls')
    await expect.poll(async () => (await lanesOf(page, owner.key))['fund-1']).toBe('calls')
    await expect(caption(page, 'calls')).toContainText('$400 · 8 customer calls')
    expect(await laneOfCard(page, 'fund-1')).toBe('Customer calls · $50 per call')
    expect((await getSlate(page, owner.key)).nodes).toEqual([])
  } finally { await removeTestGuest(page, id) }
})

test('a note added beside the workshop is saved with the slate and survives a reload; no workshop note is ever stored', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    // Double-click empty canvas beside the lanes, and name the new note.
    const first = await resting(page, 'column-now')
    const spot = { x: first.x - 70, y: first.y + 120 }
    const placed = () => page.evaluate(() => { const o = (window as any).slate.v2.nodes.one('lane-now').options; return { x: o.x as number, y: o.y as number } })
    const laneBefore = await placed()
    await page.mouse.dblclick(spot.x, spot.y)
    // The new note is selected; typing names it.
    await expect(page.locator('#slateCanvas [data-node-id]:not([data-node-id^="lane-"]):not([data-node-id^="card-"]):not([data-node-id^="column-"]):not([data-node-id^="caption-"])')).toHaveCount(1)
    await page.keyboard.type('Parking lot')
    await expect(page.locator('.sb-inline-editor')).toBeVisible()
    await page.keyboard.press('Enter')
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    const ordinary = (key: string) => getSlate(page, key).then(slate => slate.nodes as { options: { id: string; text: string } }[])
    await expect.poll(async () => (await ordinary(owner.key)).map(node => node.options.text)).toEqual(['Parking lot'])
    const [saved] = await ordinary(owner.key)
    expect(saved.options.id).not.toMatch(/^(lane|card|caption|column|image)-/)

    // Play the workshop too: its move goes to the model, the note stays the only stored note.
    await dragCard(page, 'alpha', 'later')
    await expect.poll(async () => (await lanesOf(page, owner.key)).alpha).toBe('later')
    expect((await ordinary(owner.key)).map(node => node.options.id)).toEqual([saved.options.id])

    // What the canvas itself would save leaves the workshop out, though the canvas shows it.
    const exported = await page.evaluate(() => JSON.parse((window as any).slate.exportJSON()).nodes.map((node: any) => node.options.id as string))
    expect(exported).toEqual([saved.options.id])
    expect(await page.locator('#slateCanvas [data-node-id^="card-"]').count()).toBe(4)

    // The server is the authority: a save that carries workshop notes stores none of them.
    await page.evaluate(async () => {
      const slate = (window as any).slate
      const snapshot = JSON.parse(slate.exportJSON())
      snapshot.shareId ||= slate.shareId
      const forged = (id: string) => ({ options: { id, text: 'forged', xPos: 0, yPos: 0, width: 80, height: 40 }, relationships: { associations: [] } })
      snapshot.nodes.push(forged('card-alpha'), forged('lane-now'), forged('column-next'), forged('caption-later'))
      snapshot.nodes[0].relationships.associations.push({ id: 'to-card', parentId: snapshot.nodes[0].options.id, childId: 'card-beta' })
      await (window as any).Meteor.callAsync('slates.update', { slate: snapshot, nativeConversationRevision: slate.nativeConversationRevision ?? 0, routeKey: location.pathname.split('/').pop() })
    })
    const afterForgery = await getSlate(page, owner.key)
    expect(afterForgery.nodes.map((node: any) => node.options.id)).toEqual([saved.options.id])
    expect(afterForgery.nodes[0].relationships.associations).toEqual([])
    // Neither can a direct collection write by the owner's own client. The same path may write
    // other fields, which is the control: the probe option lands and the forged notes do not.
    const forgedNote = { options: { id: 'card-alpha', text: 'forged' }, relationships: { associations: [] } }
    await page.evaluate(async ({ id, modifiers }) => {
      for (const modifier of modifiers) {
        await (window as any).Meteor.connection.applyAsync('/slates/updateAsync', [{ _id: id }, modifier, {}]).catch(() => {})
      }
    }, { id: afterForgery._id as string, modifiers: [
      { $push: { nodes: forgedNote } }, { $set: { nodes: [...afterForgery.nodes, forgedNote] } }, { $set: { 'options.directWriteProbe': true } },
    ] })
    const afterDirect = await getSlate(page, owner.key)
    expect(afterDirect.options.directWriteProbe).toBe(true)
    expect(afterDirect.nodes.map((node: any) => node.options.id)).toEqual([saved.options.id])

    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect(note(page, saved.options.id)).toContainText('Parking lot')
    expect(await laneOfCard(page, 'alpha')).toBe('Later')
    // The workshop is where it was, so the note is still beside it on the same side after the reload.
    expect(await placed()).toEqual(laneBefore)
    expect((await getSlate(page, owner.key)).options.workshopOrigin).toEqual({ x: 40, y: 40 })
    const noteBox = await resting(page, saved.options.id), column = await resting(page, 'column-now')
    expect(noteBox.x + noteBox.width / 2).toBeLessThan(column.x)
    expect((await ordinary(owner.key)).map(node => node.options.text)).toEqual(['Parking lot'])
  } finally { await removeTestGuest(page, id) }
})

test('a drop the workshop\'s rules refuse sends the card back and the lane says why', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    const start = await resting(page, 'card-alpha')
    // Next holds one card and already has Beta.
    await holdCardOver(page, 'alpha', 'next')
    await page.mouse.up()
    await expect(caption(page, 'next')).toContainText('Now holds 1 of 1 card.')
    await expect(announced(page)).toContainText('Alpha can\'t move to Next. Now holds 1 of 1 card.')
    const back = await resting(page, 'card-alpha')
    expect(Math.abs(back.x - start.x)).toBeLessThan(1)
    expect(Math.abs(back.y - start.y)).toBeLessThan(1)
    expect(await laneOfCard(page, 'alpha')).toBe('Now')
    // The reason leaves the caption again.
    await expect(caption(page, 'next')).toContainText('1 of 1')
    await expect(caption(page, 'next')).not.toContainText('Now holds')
    // Gamma may only be in Now, and a drop on open canvas is not a move either.
    await dragCard(page, 'gamma', 'later')
    await expect(announced(page)).toContainText('Gamma can\'t move to Later. This card can\'t go in Later.')
    const gamma = await resting(page, 'card-gamma')
    await page.mouse.move(gamma.x + gamma.width / 2, gamma.y + gamma.height / 2)
    await page.mouse.down()
    await page.mouse.move(gamma.x + gamma.width / 2, gamma.y + gamma.height + 400, { steps: 10 })
    await page.mouse.up()
    await expect(announced(page)).toContainText('Gamma was not dropped on a lane. It stays where it was.')
    // The same rule answers the keyboard.
    expect(await keyboardMove(page, 'alpha', 'Next')).toBe(false)
    // Nothing was saved: same cards in the same lanes, on the first revision.
    expect(await lanesOf(page, owner.key)).toEqual({ alpha: 'now', beta: 'next', gamma: 'now', delta: 'now' })
    expect(await revisionOf(page, owner.key)).toBe(0)
    // A move the rules allow still goes through afterwards.
    await dragCard(page, 'alpha', 'later')
    await expect.poll(async () => (await lanesOf(page, owner.key)).alpha).toBe('later')
  } finally { await removeTestGuest(page, id) }
})

test('a second person sees a move, a rename and a kept proposal without reloading', async ({ browser, page }) => {
  let ownerId: string | null = null
  let peer: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const owner = await openRuled(page)
    ownerId = owner.id
    peer = await joinAsEditor(browser, page)
    // A mark on the peer's page that a reload or remount of the page would lose.
    await peer.page.evaluate(() => { (window as any).__stayed = true; (window as any).__engine = (window as any).slate.v2 })
    const peerAlpha = await resting(peer.page, 'card-alpha')

    await dragCard(page, 'alpha', 'later')
    await expect.poll(() => laneOfCard(peer!.page, 'alpha')).toBe('Later')
    const moved = await resting(peer.page, 'card-alpha')
    const laterColumn = await resting(peer.page, 'column-later')
    expect(moved.x).toBeGreaterThan(peerAlpha.x)
    expect(moved.x).toBeGreaterThanOrEqual(laterColumn.x)
    expect(moved.x + moved.width).toBeLessThanOrEqual(laterColumn.x + laterColumn.width + 1)
    await expect(caption(peer.page, 'later')).toContainText('1 card')

    // The other way round: the peer's move reaches the owner.
    await dragCard(peer.page, 'delta', 'later')
    await expect.poll(() => laneOfCard(page, 'delta')).toBe('Later')
    await expect(caption(page, 'later')).toContainText('2 cards')

    // A rename made in place on the owner's canvas, and a proposal the owner keeps.
    await renameInPlace(page, 'card-beta', 'Beta prime')
    await expect(card(peer.page, 'beta')).toContainText('Beta prime')
    const panel = await previewWorkshopMessage(page, 'Rename lane Later to Someday')
    // Until it is kept, the proposal is on the owner's canvas only.
    await expect(lane(page, 'later')).toContainText('Someday')
    await expect(lane(peer.page, 'later')).toContainText('Later')
    await panel.getByRole('button', { name: 'Keep changes', exact: true }).click()
    await expect(lane(peer.page, 'later')).toContainText('Someday')

    expect(await peer.page.evaluate(() => (window as any).__stayed === true && (window as any).__engine === (window as any).slate.v2)).toBe(true)
    const stored = await storedWorkshop(page, owner.key)
    expect(stored.cards.find((item: any) => item.id === 'beta').label).toBe('Beta prime')
    expect(stored.lanes.find((item: any) => item.id === 'later').label).toBe('Someday')
    expect(await lanesOf(page, owner.key)).toEqual({ alpha: 'later', beta: 'next', gamma: 'now', delta: 'later' })
    expect(await revisionOf(page, owner.key)).toBe(4)
  } finally {
    if (peer) { await removeTestGuest(peer.page, peer.id).catch(() => {}); await peer.context.close() }
    await removeTestGuest(page, ownerId)
  }
})

test('a save that loses a race is undone on the canvas and the lane says so', async ({ browser, page }) => {
  let ownerId: string | null = null
  let peer: Awaited<ReturnType<typeof joinAsEditor>> | null = null
  try {
    const owner = await openRuled(page)
    ownerId = owner.id
    peer = await joinAsEditor(browser, page)
    // The peer picks Alpha up and holds it over Later.
    await holdCardOver(peer.page, 'alpha', 'later')
    // Meanwhile the owner moves Delta. The peer's canvas does not redraw under the held card.
    await dragCard(page, 'delta', 'later')
    await expect.poll(async () => (await lanesOf(page, owner.key)).delta).toBe('later')
    await expect.poll(() => revisionOf(page, owner.key)).toBe(1)
    await peer.page.waitForTimeout(800)
    expect(await laneOfCard(peer.page, 'delta')).toBe('Now')
    // The peer lets go: their save is for a revision that is gone.
    await peer.page.mouse.up()
    await expect(caption(peer.page, 'later')).toContainText('Someone else saved first.')
    await expect(announced(peer.page)).toContainText('Later: Someone else saved first.')
    await expect(workshopStatus(peer.page).getByRole('alert')).toContainText('Someone else changed this workshop first. Your change was not saved.')
    // Their canvas now shows the server's workshop: the owner's move, and Alpha back in Now.
    await expect.poll(() => laneOfCard(peer!.page, 'delta')).toBe('Later')
    await expect.poll(() => laneOfCard(peer!.page, 'alpha')).toBe('Now')
    const alpha = await resting(peer.page, 'card-alpha'), now = await resting(peer.page, 'column-now')
    expect(alpha.x).toBeGreaterThanOrEqual(now.x)
    expect(alpha.x + alpha.width).toBeLessThanOrEqual(now.x + now.width + 1)
    expect(await lanesOf(page, owner.key)).toEqual({ alpha: 'now', beta: 'next', gamma: 'now', delta: 'later' })
    expect(await revisionOf(page, owner.key)).toBe(1)
    // On the latest workshop the same move is saved.
    await dragCard(peer.page, 'alpha', 'later')
    await expect.poll(async () => (await lanesOf(page, owner.key)).alpha).toBe('later')
    await expect.poll(() => laneOfCard(page, 'alpha')).toBe('Later')
    expect(await revisionOf(page, owner.key)).toBe(2)
  } finally {
    if (peer) { await removeTestGuest(peer.page, peer.id).catch(() => {}); await peer.context.close() }
    await removeTestGuest(page, ownerId)
  }
})

test('a visitor who has not joined cannot move a card by pointer, touch or keyboard, or rename one', async ({ browser, page }) => {
  let ownerId: string | null = null
  const context = await browser.newContext({ hasTouch: true })
  const guest = await context.newPage()
  try {
    const owner = await openRuled(page)
    ownerId = owner.id
    const link = await shareAs(page, 'edit')
    await guest.goto(link.href)
    await dismissWelcome(guest)
    await workshopReady(guest)
    await expect(workshopStatus(guest).getByRole('button', { name: 'Join to edit', exact: true })).toBeVisible()
    expect(await userId(guest)).toBeNull()
    // No conversation, no undo, no quick-add: nothing that offers an edit.
    await expect(conversation(guest)).toHaveCount(0)
    await expect(guest.getByRole('button', { name: 'Ask Slatebox' })).toHaveCount(0)
    await expect(guest.getByRole('button', { name: 'Undo last change' })).toHaveCount(0)
    const start = await resting(guest, 'card-alpha')
    const untouched = async () => {
      const box = await resting(guest, 'card-alpha')
      expect(Math.abs(box.x - start.x)).toBeLessThan(1)
      expect(Math.abs(box.y - start.y)).toBeLessThan(1)
      expect(await laneOfCard(guest, 'alpha')).toBe('Now')
    }
    await dragCard(guest, 'alpha', 'later')
    await untouched()
    const hand = await finger(guest)
    await hand.dragCard('alpha', 'later')
    await untouched()
    expect(await keyboardMove(guest, 'alpha', 'Later')).toBe(false)
    await untouched()
    // Double-click does not open a card or a lane for renaming, and typing on a selected card does nothing.
    await guest.mouse.dblclick(start.x + start.width / 2, start.y + start.height / 2)
    await expect(guest.locator('.sb-inline-editor')).toHaveCount(0)
    await selectCard(guest, 'alpha')
    await guest.keyboard.type('x')
    await expect(guest.locator('.sb-inline-editor')).toHaveCount(0)
    // Nor can the visitor add a note of their own beside the workshop.
    const later = await resting(guest, 'column-later')
    await guest.mouse.dblclick(later.x + later.width + 120, later.y + 60)
    await expect(guest.locator('.sb-inline-editor')).toHaveCount(0)
    // The server refuses the same writes when they are sent without the canvas.
    const refused = await guest.evaluate(async key => {
      const meteor = (window as any).Meteor, slate = (window as any).slate
      const model = (await meteor.callAsync('slates.get', { shareId: key })).slateBase.creative.model
      model.workshop.cards.find((item: any) => item.id === 'alpha').laneId = 'later'
      const results: string[] = []
      for (const call of [
        () => meteor.callAsync('creativeSlates.save', key, 0, model),
        () => {
          const snapshot = JSON.parse(slate.exportJSON())
          snapshot.shareId ||= slate.shareId
          snapshot.nodes.push({ options: { id: 'guest-note', text: 'x', xPos: 0, yPos: 0, width: 80, height: 40 }, relationships: { associations: [] } })
          return meteor.callAsync('slates.update', { slate: snapshot, nativeConversationRevision: 0, routeKey: key, guestCollaboratorId: document.cookie.match(/slatebox_guestCollaboratorId=([^;]+)/)?.[1] })
        },
      ]) { try { await call(); results.push('written') } catch { results.push('refused') } }
      return results
    }, link.pathname.split('/').pop()!)
    expect(refused).toEqual(['refused', 'refused'])
    expect(await lanesOf(page, owner.key)).toEqual({ alpha: 'now', beta: 'next', gamma: 'now', delta: 'now' })
    expect(await revisionOf(page, owner.key)).toBe(0)
    expect((await getSlate(page, owner.key)).nodes).toEqual([])

    // Joining is the way in: the same pointer move is then saved.
    await workshopStatus(guest).getByRole('button', { name: 'Join to edit', exact: true }).click()
    await expect.poll(() => userId(guest)).toBeTruthy()
    await expect(conversation(guest)).toBeVisible()
    await dragCard(guest, 'alpha', 'later')
    await expect.poll(async () => (await lanesOf(page, owner.key)).alpha).toBe('later')
    await removeTestGuest(guest, await userId(guest))
  } finally {
    await context.close()
    await removeTestGuest(page, ownerId)
  }
})

test('on a phone the lanes wrap one to a row at full size and a finger moves a card', async ({ browser, browserName }) => {
  test.skip(browserName !== 'chromium', 'Uses Chromium device input for real touch events')
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  let id: string | null = null
  try {
    const owner = await openOwned(page, '/new/pilot-budget')
    id = owner.id
    // One lane to a row: every column starts at the same x, each below the one before, inside the screen.
    const ids = ['reserve', 'calls', 'newsletter', 'pilot']
    const columns = []
    for (const laneId of ids) columns.push(await resting(page, 'column-' + laneId))
    for (let i = 1; i < columns.length; i++) {
      expect(Math.abs(columns[i].x - columns[0].x)).toBeLessThan(1)
      expect(columns[i].y).toBeGreaterThan(columns[i - 1].y + columns[i - 1].height - 1)
    }
    expect(columns[0].x).toBeGreaterThanOrEqual(0)
    expect(columns[0].x + columns[0].width).toBeLessThanOrEqual(390)
    // Fitted to width at 100%: card text is on screen at the size the app's notes use.
    expect((await view(page)).zoom).toBeCloseTo(1, 2)
    const size = await card(page, 'fund-1').locator('text').first().evaluate(element => {
      const scale = (document.querySelector('#slateCanvas svg') as SVGSVGElement).getScreenCTM()!.a
      return parseFloat(getComputedStyle(element).fontSize) * scale
    })
    expect(size).toBeGreaterThanOrEqual(16)
    // The conversation leaves the canvas the screen until it is asked for.
    await expect(conversation(page)).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Ask Slatebox', exact: true })).toBeVisible()

    const hand = await finger(page)
    await hand.dragCard('fund-1', 'calls')
    await expect.poll(async () => (await lanesOf(page, owner.key))['fund-1']).toBe('calls')
    await expect(caption(page, 'calls')).toContainText('$400 · 8 customer calls')
    expect(await laneOfCard(page, 'fund-1')).toBe('Customer calls · $50 per call')
    const settled = await resting(page, 'card-fund-1'), calls = await resting(page, 'column-calls')
    expect(settled.y).toBeGreaterThan(calls.y)
    expect(settled.y + settled.height).toBeLessThanOrEqual(calls.y + calls.height + 1)

    // The phone turns: the lanes sit side by side again, fitted to the wider screen.
    await page.setViewportSize({ width: 844, height: 390 })
    await expect.poll(async () => {
      const first = await note(page, 'column-reserve').boundingBox(), second = await note(page, 'column-calls').boundingBox()
      return Boolean(first && second && Math.abs(first.y - second.y) < 1 && second.x > first.x)
    }).toBe(true)
    const pilot = await resting(page, 'column-pilot')
    expect(pilot.x + pilot.width).toBeLessThanOrEqual(844)
  } finally {
    await removeTestGuest(page, id).catch(() => {})
    await context.close()
  }
})

test('a card and a lane are renamed in place, saved on the workshop\'s revision, and one change can be undone', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openRuled(page)
    id = owner.id
    await renameInPlace(page, 'card-alpha', 'Apollo')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).cards.find((item: any) => item.id === 'alpha').label).toBe('Apollo')
    await expect(card(page, 'alpha')).toContainText('Apollo')
    expect(await card(page, 'alpha').getAttribute('aria-label')).toBe('Apollo, in Now')
    await renameInPlace(page, 'lane-now', 'Today')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).lanes.find((item: any) => item.id === 'now').label).toBe('Today')
    expect(await revisionOf(page, owner.key)).toBe(2)
    // The rename is the model's: it is there after a reload, and the slate still stores no notes.
    expect((await getSlate(page, owner.key)).nodes).toEqual([])
    // A name the workshop cannot hold is refused and the old one stays.
    await renameInPlace(page, 'card-beta', 'x'.repeat(81))
    await expect(card(page, 'beta')).toContainText('Beta')
    expect(await revisionOf(page, owner.key)).toBe(2)

    // "Undo last change" takes back the lane's rename through the same revision-checked save.
    const undo = workshopStatus(page).getByRole('button', { name: 'Undo last change', exact: true })
    await undo.click()
    await expect(lane(page, 'now')).toContainText('Now')
    await expect.poll(async () => (await storedWorkshop(page, owner.key)).lanes.find((item: any) => item.id === 'now').label).toBe('Now')
    expect(await revisionOf(page, owner.key)).toBe(3)
    await expect(undo).toHaveCount(0)
    // The canvas's own undo does not reach the workshop: the card keeps its new name and nothing is saved.
    await page.locator('#slateCanvas').click({ position: { x: 20, y: 300 } })
    await page.keyboard.press('ControlOrMeta+Z')
    await page.waitForTimeout(600)
    await expect(card(page, 'alpha')).toContainText('Apollo')
    expect(await revisionOf(page, owner.key)).toBe(3)

    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect(card(page, 'alpha')).toContainText('Apollo')
    await expect(lane(page, 'now')).toContainText('Now')
  } finally { await removeTestGuest(page, id) }
})

test('the interview board plays its own rule on the canvas, and a keyboard move has an announced result', async ({ page }) => {
  let id: string | null = null
  try {
    const owner = await openOwned(page, '/new/workshop' + encodeWorkshopFragment(createInterviewWorkshop()))
    id = owner.id
    // The prototype holds one interview. The board says what that interview will test.
    await expect(caption(page, 'prototype')).toContainText('1 of 1')
    await expect(placementOutcomes(page)).toContainText('Mara will test whether Jo can import a list without contacting a client.')
    await expect(placementOutcomes(page)).toContainText('Still in the interview notes.')
    // A full lane is still offered here: this board swaps the interview it holds for the one dropped on it.
    expect(await offeredLanes(page, 'duplicate')).toEqual(['prototype'])
    await dragCard(page, 'duplicate', 'prototype')
    await expect.poll(async () => lanesOf(page, owner.key)).toEqual({ preview: 'interviews', duplicate: 'prototype', undo: 'interviews' })
    await expect(placementOutcomes(page)).toContainText('Imani will test whether Bea can keep the existing client and skip its duplicate.')
    expect(await laneOfCard(page, 'preview')).toBe('Customer interviews')
    expect(await revisionOf(page, owner.key)).toBe(1)

    // The same move from the keyboard: staged with an arrow, read out, committed with Enter.
    await selectCard(page, 'undo')
    await page.keyboard.press('ArrowRight')
    await expect(announced(page)).toContainText('to Prototype to test: 1 of 1. Press Enter to move it, Escape to cancel.')
    // The outcome region already reads what the staged move would decide, and nothing is saved yet.
    await expect(placementOutcomes(page)).toContainText('Dev will test whether Sam can restore the original list without support.')
    expect(await revisionOf(page, owner.key)).toBe(1)
    await page.keyboard.press('Escape')
    await expect(announced(page)).toContainText('Move cancelled.')
    await expect(placementOutcomes(page)).toContainText('Imani will test whether Bea can keep the existing client and skip its duplicate.')
    expect(await keyboardMove(page, 'undo', 'Prototype to test')).toBe(true)
    await expect(announced(page)).toContainText('moved to Prototype to test. 1 of 1.')
    await expect.poll(async () => lanesOf(page, owner.key)).toEqual({ preview: 'interviews', duplicate: 'interviews', undo: 'prototype' })
    await expect(placementOutcomes(page)).toContainText('Dev will test whether Sam can restore the original list without support.')
    // From the prototype the interview may go back to the notes, and nowhere else.
    expect(await offeredLanes(page, 'undo')).toEqual(['interviews'])
  } finally { await removeTestGuest(page, id) }
})
