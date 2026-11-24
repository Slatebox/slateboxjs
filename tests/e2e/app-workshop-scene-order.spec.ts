import {sendMapEdit} from './map-conversation.shared'
import {sendLaneEdit,laneChat,expectRejectedLaneEdit} from './workshop-conversation.shared'
import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, workshopDestinations, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { exitWithEscape, expectLane, nextView, openPresenter } from './app-presenter.shared'
import {conversation, dragCardNamed, editable, isOffered, keyboardMove, offeredLanes, selectLaneNamed, slateTitle, standingLine, workshopReady} from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const workshops: Workshop[] = [{
  version: 1, title: 'Loan case rotation',
  lanes: [{ id: 'reserve', label: 'Reserve' }, { id: 'case', label: 'Display case', capacity: 1 }, { id: 'return', label: 'Return' }],
  cards: [{ id: 'shell', label: 'Shell carving', laneId: 'reserve' }, { id: 'coin', label: 'Copper coin', laneId: 'reserve' }],
}, {
  version: 1, title: 'Lens test routes',
  lanes: [
    { id: 'bench', label: 'Lens bench', station: { column: 0, row: 0, next: ['lamp', 'star'], outcome: 'Choose a light source.' } },
    { id: 'lamp', label: 'Indoor lamp', station: { column: 1, row: 1, next: ['bench'], outcome: 'Lamp test complete.' } },
    { id: 'star', label: 'Bright star', station: { column: 2, row: 0, next: [], outcome: 'Night test complete.' } },
  ],
  cards: [{ id: 'lens', label: 'Test lens', laneId: 'bench' }],
}]

// Restated 2026-11-21: Present opens the presenter; the lanes are its first viewpoints, in the
// authored order, each framing the lane and its cards with the step's outcome in its narrative.
async function readScenes(page: Page, draft: Workshop, orderedLanes: string[]) {
  const deck = await openPresenter(page)
  for (const id of orderedLanes) {
    const lane = draft.lanes.find(item => item.id === id)!
    const cards = draft.cards.filter(card => card.laneId === id)
    await nextView(page, deck)
    await expectLane(deck, lane.label, id, cards.map(card => card.id))
    if (lane.station) await expect(deck.locator('.sb-presentation-narrative')).toContainText(lane.station.outcome)
  }
  await exitWithEscape(page, deck)
}

async function boardPositions(page: Page, draft: Workshop) {
  const positions = []
  await workshopReady(page)
  for (const lane of draft.lanes) {
    const heading = page.locator('#slateCanvas [data-node-id="lane-' + lane.id + '"]')
    await expect(heading).toBeVisible()
    // Where the lane's note sits on the slate, in the slate's own units.
    const point = await page.evaluate(id => {
      const { x, y } = (window as any).slate.v2.nodes.one(id).options
      return [x, y]
    }, 'lane-' + lane.id)
    positions.push(point)
  }
  expect(new Set(positions.map(point => point.join(','))).size).toBe(draft.lanes.length)
  return positions
}

for (const workshop of workshops) {
  test(workshop.title + ' keeps its authored scenes and shared decision through playback and reload', async ({ browser }) => {
    test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname), 'Creates disposable fixtures only on local or staging.')
    const [owner, editor, reader] = await Promise.all([browser.newPage(), browser.newPage(), browser.newPage()])
    let ownerId: string | null = null
    let editorId: string | null = null
    let slateId: string | null = null
    try {
      await owner.goto(new URL('/new/workshop' + encodeWorkshopFragment(workshop), origin).href)
      await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
      await expect.poll(() => userId(owner)).toBeTruthy()
      ownerId = await userId(owner)
      await dismissWelcome(owner)
      const key = new URL(owner.url()).pathname.split('/').pop()!
      const original = await getSlate(owner, key)
      expect(original.userId).toBe(ownerId)
      expect(original.options.isPrivate).toBe(true)
      slateId = original._id
      if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
        await expect(owner.locator('script[src*="/' + process.env.SLATEBOX_EXPECTED_APP_BUNDLE + '.js"]')).toHaveCount(1)
      }

      const editLink = await shareAs(owner, 'edit')
      await editor.goto(editLink.href)
      await dismissWelcome(editor)
      await workshopReady(editor)
      await editor.getByRole('button', { name: 'Join to edit', exact: true }).click()
      await expect.poll(() => userId(editor)).toBeTruthy()
      await editable(editor)
      editorId = await userId(editor)
      expect(editorId).not.toBe(ownerId)

      const [start, destination, alternate] = workshop.lanes
      const moving = workshop.cards[0]
      if (destination.station) {
        await dragCardNamed(editor, moving.label, destination.label)
        // The line read aloud for the token names its stop and the stop's outcome ('Test lens · Indoor lamp — Lamp test complete.').
        await expect(editor.getByText(standingLine(moving.label, destination), { exact: true })).toBeVisible()
        expect(await isOffered(editor, moving.label, alternate.label)).toBe(false)
      } else {
        await sendLaneEdit(editor,'Move '+moving.label+' to '+destination.label)
        // Restated 2026-11-23 (decision-path): the refused move is offered as "Move anyway" with the rule; cancelled, nothing moves.
        await expectRejectedLaneEdit(editor,'Move '+workshop.cards[1].label+' to '+destination.label)
      }
      const updated = { ...workshop, cards: workshop.cards.map((card, index) => index === 0 ? { ...card, laneId: destination.id } : card) }
      await expect.poll(async () => (await getSlate(owner, key)).creative.model.workshop.cards).toEqual(updated.cards)
      const positions = await boardPositions(owner, workshop)
      await selectLaneNamed(owner, destination.label)
      if (start.station) await expect(owner.getByLabel('Selected object')).toContainText(destination.label)
      else await expect(laneChat(owner).getByRole('status')).toContainText(destination.label)
      await (start.station ? sendMapEdit : sendLaneEdit)(owner,'Present '+destination.label+' first')
      const order = [destination.id, start.id, alternate.id]
      await readScenes(editor, updated, order)
      await expect(conversation(editor)).toBeVisible()

      await owner.reload()
      await dismissWelcome(owner)
      expect(await boardPositions(owner, workshop)).toEqual(positions)
      const persisted = (await getSlate(owner, key)).creative.model.workshop
      expect(persisted.lanes).toEqual(workshop.lanes)
      expect(persisted.cards).toEqual(updated.cards)
      await readScenes(owner, updated, order)

      const readLink = await shareAs(owner, 'read')
      await reader.goto(readLink.href)
      await dismissWelcome(reader)
      await workshopReady(reader)
      await expect(slateTitle(reader)).toHaveText(updated.title)
      await expect(reader.getByRole('button', { name: 'Presentation order' })).toHaveCount(0)
      await expect(reader.getByRole('button', { name: 'Edit an object' })).toHaveCount(0)
      await readScenes(reader, updated, order)
      expect(await userId(reader)).toBeNull()
      // The owner's canvas offers the card exactly the lanes the workshop's rules open to it.
      const open = workshopDestinations(updated, moving.id).map(item => item.id).filter(id => id !== destination.id).sort()
      expect(open.length).toBeGreaterThan(0)
      expect((await offeredLanes(owner, moving.id)).sort()).toEqual(open)
      // A reader is offered no move: not by picking the card up, and not from the keyboard.
      expect(await offeredLanes(reader, moving.id)).toEqual([])
      expect(await isOffered(reader, moving.label, start.label)).toBe(false)
      expect(await keyboardMove(reader, moving.id, start.label)).toBe(false)
      expect((await getSlate(owner, key)).creative.model.workshop.cards).toEqual(updated.cards)
    } finally {
      try {
        if (slateId && ownerId && await userId(owner) === ownerId) {
          await owner.evaluate(id => (window as any).Meteor.callAsync('slates.remove', { slateIds: [id] }), slateId)
        }
      } finally {
        try { await Promise.all([removeTestGuest(owner, ownerId), removeTestGuest(editor, editorId)]) }
        finally { await Promise.all([owner.close(), editor.close(), reader.close()]) }
      }
    }
  })
}
