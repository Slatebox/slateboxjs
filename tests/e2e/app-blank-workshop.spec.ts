import { expect, test, type Page } from '@playwright/test'
import type { Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true })
const report = (page: Page) => page.getByRole('region', { name: 'Placement outcomes', exact: true })

async function addCard(page: Page, name: string) {
  await button(page, 'Add card to Field recordings').click()
  const dialog = page.getByRole('dialog', { name: 'Add card' })
  await dialog.getByLabel('Card name').fill(name)
  await dialog.getByRole('button', { name: 'Add card', exact: true }).click()
  await expect(dialog).toHaveCount(0)
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

    await button(owner, 'Edit an object').click()
    const firstLaneId = (await model()).lanes[0].id
    const rename = owner.locator('.workshop-inspector')
    await rename.getByLabel('Object', { exact: true }).selectOption('lane:' + firstLaneId)
    await rename.getByLabel('Name', { exact: true }).fill('Field recordings')
    await rename.getByRole('button', { name: 'Save changes' }).click()
    await expect(button(owner, 'Add card to Field recordings')).toBeVisible()

    await button(owner, 'Add lane').click()
    const laneDialog = owner.getByRole('dialog', { name: 'Add lane' })
    await laneDialog.getByLabel('Lane name').fill('Listening booth')
    await laneDialog.getByLabel('Capacity').fill('1')
    await laneDialog.getByRole('button', { name: 'Add lane', exact: true }).click()
    await expect(laneDialog).toHaveCount(0)
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
    await button(owner, 'Edit an object').click()
    const editor = owner.locator('.workshop-inspector')
    await editor.getByLabel('Object', { exact: true }).selectOption('card:' + first.id)
    await editor.getByRole('button', { name: 'Add placement outcome' }).click()
    await editor.getByLabel('Outcome name').fill('Now playing')
    await editor.getByLabel('Target lane').selectOption(booth.id)
    await editor.getByLabel('When the card is here').fill('The tide recording is playing.')
    await editor.getByLabel('When the card is elsewhere').fill('The tide recording is waiting.')
    await editor.getByRole('button', { name: 'Save changes' }).click()
    await expect(report(peer)).toContainText('The tide recording is waiting.')

    await peer.getByText('Move a card by name', { exact: true }).click()
    await peer.getByLabel('Move ' + first.label, { exact: true }).selectOption(booth.id)
    await button(peer, 'Apply move').click()
    await expect(report(owner)).toContainText('The tide recording is playing.')
    const secondMove = peer.getByLabel('Move ' + second.label, { exact: true })
    await expect(secondMove.locator('option[value="' + booth.id + '"]')).toHaveCount(0)

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
    await expect(button(owner, 'Add lane')).toBeVisible()
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
