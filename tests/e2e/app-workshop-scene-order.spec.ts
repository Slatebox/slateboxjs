import {sendMapEdit} from './map-conversation.shared'
import {sendLaneEdit,laneChat} from './workshop-conversation.shared'
import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'

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

async function readScenes(page: Page, draft: Workshop, orderedLanes: string[]) {
  await page.getByRole('button', { name: 'Present', exact: true }).click()
  const region = page.getByRole('region', { name: 'Decision presentation' })
  for (const [index, id] of orderedLanes.entries()) {
    const lane = draft.lanes.find(item => item.id === id)!
    const cards = draft.cards.filter(card => card.laneId === id)
    await expectWorkshopSlide(page, lane.label, cards.map(card => card.label), ['lane-' + id, ...cards.map(card => 'card-' + card.id)])
    if (lane.station) await expect(region.getByText(lane.station.outcome,{exact:true}).last()).toBeVisible()
    if (index < orderedLanes.length - 1) await region.getByRole('button', { name: lane.station ? 'Next station' : 'Next lane' }).click()
  }
  await region.getByRole('button', { name: 'Back to board' }).click()
  await expect(region).toHaveCount(0)
}

async function boardPositions(page: Page, draft: Workshop) {
  const positions = []
  for (const lane of draft.lanes) {
    const heading = page.locator('.workshop-drawing #heading-' + lane.id)
    await expect(heading).toBeVisible()
    const point = await heading.evaluate(element => {
      const { e, f } = (element as SVGGraphicsElement).transform.baseVal.getItem(0).matrix
      return [e, f]
    })
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
      await editor.getByRole('button', { name: 'Join to edit', exact: true }).click()
      await expect.poll(() => userId(editor)).toBeTruthy()
      editorId = await userId(editor)
      expect(editorId).not.toBe(ownerId)

      const [start, destination, alternate] = workshop.lanes
      const moving = workshop.cards[0]
      if (destination.station) {
        await editor.getByRole('button', { name: moving.label + ' → ' + destination.label }).click()
        await expect(editor.getByText(moving.label + ' · ' + destination.label, { exact: true })).toBeVisible()
        await expect(editor.getByRole('button', { name: moving.label + ' → ' + alternate.label })).toHaveCount(0)
      } else {
        await sendLaneEdit(editor,'Move '+moving.label+' to '+destination.label)
        const chat = laneChat(editor)
        await chat.getByRole('textbox').fill('Move '+workshop.cards[1].label+' to '+destination.label)
        await chat.getByRole('button',{name:'Send workshop message'}).click()
        await expect(chat.getByRole('alert')).toBeVisible()
        await expect(chat.getByRole('button',{name:'Keep changes'})).toHaveCount(0)
      }
      const updated = { ...workshop, cards: workshop.cards.map((card, index) => index === 0 ? { ...card, laneId: destination.id } : card) }
      await expect.poll(async () => (await getSlate(owner, key)).creative.model.workshop.cards).toEqual(updated.cards)
      const positions = await boardPositions(owner, workshop)
      const aside = start.station ? 'Map conversation' : 'Workshop conversation'
      await owner.getByRole('button',{name:'Edit '+destination.label,exact:true}).click()
      if (start.station) await expect(owner.getByLabel('Selected object')).toContainText(destination.label)
      else await expect(laneChat(owner).getByRole('status')).toContainText(destination.label)
      await (start.station ? sendMapEdit : sendLaneEdit)(owner,'Present '+destination.label+' first')
      const order = [destination.id, start.id, alternate.id]
      await readScenes(editor, updated, order)
      await expect(editor.getByRole('complementary',{name:aside})).toBeVisible()

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
      await expect(reader.getByRole('heading', { name: updated.title })).toBeVisible()
      await expect(reader.getByRole('button', { name: 'Presentation order' })).toHaveCount(0)
      await expect(reader.getByRole('button', { name: 'Edit an object' })).toHaveCount(0)
      await readScenes(reader, updated, order)
      expect(await userId(reader)).toBeNull()
      if(start.station) {
        await expect(reader.getByRole('button',{name:moving.label+' → '+start.label})).toBeDisabled()
      } else {
      await reader.getByText('Move a card by name', { exact: true }).click()
      await expect(reader.getByLabel('Move ' + moving.label, { exact: true })).toBeDisabled()
      }
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
