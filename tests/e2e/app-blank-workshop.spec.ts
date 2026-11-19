import {laneChat, sendLaneEdit, expectRejectedLaneEdit} from './workshop-conversation.shared'
import { expect, test, type Page } from '@playwright/test'
import type { Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true })
const report = (page: Page) => page.getByRole('region', { name: 'Placement outcomes', exact: true })

async function addCard(page: Page, name: string) {
  await sendLaneEdit(page, 'Add card ' + name + ' to Field recordings')
}

test('two editors build a blank workshop, fill a lane and present their saved choice', async ({ browser }) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname), 'Creates private synthetic boards on local or staging.')
  const [owner, peer] = await Promise.all([browser.newPage(), browser.newPage()])
  let ownerId: string | null = null, peerId: string | null = null, slateId: string | null = null, key = ''
  try {
    await owner.goto(new URL('/new/workshop', origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(owner)
    ownerId = await userId(owner)
    expect(ownerId).toBeTruthy()
    key = new URL(owner.url()).pathname.split('/').pop()!
    const original = await getSlate(owner, key)
    slateId = original._id
    expect(original.userId).toBe(ownerId)
    expect(original.options.isPrivate).toBe(true)
    expect(original.creative.model.workshop.cards).toEqual([])
    const model = async (): Promise<Workshop> => (await getSlate(owner, key)).creative.model.workshop
    await expect(owner.getByRole('heading', { name: 'Untitled workshop' })).toBeVisible()
    expect((await model()).lanes.map(lane => lane.label)).toEqual(['Lane 1','Lane 2'])
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      await expect(owner.locator('script[src*="/' + process.env.SLATEBOX_EXPECTED_APP_BUNDLE + '.js"]')).toHaveCount(1)
    }

    await expect(owner.getByRole('region',{name:'Interactive workshop studio'}).getByRole('textbox')).toHaveCount(1)
    await expect(laneChat(owner).getByRole('textbox')).toHaveCount(1)
    await expect(button(owner,'Edit an object')).toHaveCount(0)
    await sendLaneEdit(owner,'Rename lane Lane 1 to Field recordings')
    await sendLaneEdit(owner,'Add lane Listening booth')
    await sendLaneEdit(owner,'Set capacity of Listening booth to 1')
    await addCard(owner, 'Listen to the tide')
    const editLink = await shareAs(owner, 'edit')
    await peer.goto(editLink.href)
    await dismissWelcome(peer)
    await button(peer, 'Join to edit').click()
    await expect.poll(() => userId(peer)).toBeTruthy()
    peerId = await userId(peer)
    expect(peerId).not.toBe(ownerId)
    await addCard(peer, 'Hear the ferry')
    await expect.poll(async () => (await model()).cards.map(c => c.label)).toEqual(['Listen to the tide', 'Hear the ferry'])
    const authored = await model()
    const [first, second] = authored.cards
    const [source, , booth] = authored.lanes
    expect(booth).toMatchObject({ label: 'Listening booth', capacity: 1 })
    expect([first.laneId, second.laneId]).toEqual([source.id,source.id])
    await sendLaneEdit(owner,'Set outcome Now playing for @'+first.id+' in @'+booth.id+': The tide recording is playing. | The tide recording is waiting.')
    await expect(report(peer)).toContainText('The tide recording is waiting.')

    await sendLaneEdit(peer,'Move @'+first.id+' to @'+booth.id)
    await expect(report(owner)).toContainText('The tide recording is playing.')
    await expectRejectedLaneEdit(peer,'Move @'+second.id+' to @'+booth.id)

    // Attempt to place the second card directly on the already occupied slot.
    const secondCard = peer.locator('.workshop-drawing [data-workshop-card="' + second.id + '"]')
    const firstCard = peer.locator('.workshop-drawing [data-workshop-card="' + first.id + '"]')
    await secondCard.scrollIntoViewIfNeeded()
    const from = (await secondCard.boundingBox())!, to = (await firstCard.boundingBox())!
    const before = await secondCard.getAttribute('transform')
    await peer.mouse.move(from.x + from.width / 2, from.y + from.height / 2)
    await peer.mouse.down()
    await peer.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 16 })
    await peer.mouse.up()
    await expect(secondCard).toHaveAttribute('transform', before!)
    await owner.reload()
    await dismissWelcome(owner)
    await expect(report(owner)).toContainText('The tide recording is playing.')
    const saved = await model()
    expect(saved.cards.map(card => card.laneId)).toEqual([booth.id,source.id])
    expect(saved.lanes).toEqual(authored.lanes)
    await button(owner, 'Present').click()
    await expectWorkshopSlide(owner, 'Field recordings', [second.label], ['lane-' + source.id, 'card-' + second.id])
    await button(owner, 'Next lane').click()
    await button(owner, 'Next lane').click()
    await expectWorkshopSlide(owner, booth.label, [first.label], ['lane-' + booth.id,'card-' + first.id])
    await expect(report(owner)).toContainText('The tide recording is playing.')
    await button(owner, 'Back to board').click()
    await expect(laneChat(owner).getByRole('textbox')).toBeVisible()
  } finally {
    try {
      if (ownerId && slateId && await userId(owner) === ownerId) {
        await owner.goto(new URL('/plans', origin).href)
        await owner.waitForFunction(() => Boolean((window as any).Meteor?.subscribe))
        await owner.evaluate(() => { (window as any).Meteor.subscribe('me') })
        await owner.waitForFunction(id => (window as any).Meteor.userId() === id && (window as any).Meteor.user()?.isAnonymous === true, ownerId)
        await owner.evaluate(id => (window as any).Meteor.callAsync('slates.remove', { slateIds: [id] }), slateId)
        await expect.poll(() => getSlate(owner, key)).toBeFalsy()
      }
    } finally {
      try { await Promise.all([removeTestGuest(owner, ownerId), removeTestGuest(peer, peerId)]) }
      finally { await Promise.all([owner.close(), peer.close()]) }
    }
  }
})

test('an invalid workshop link asks for a usable model before creating a guest or a board', async ({ page }) => {
  await page.goto(new URL('/new/workshop#model=invalid', origin).href)
  await expect(page.getByRole('alert')).toContainText('invalid model')
  await expect(page).toHaveURL(/\/new\/workshop#model=invalid$/)
  expect(await userId(page)).toBeNull()
})
