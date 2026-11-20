import { expect, test, type Page } from '@playwright/test'
import { presentToEveryone } from './app-header.shared'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import { openPublication, slateTitle, workshopReady } from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const workshop: Workshop = {
  version: 1, title: 'Listening walk',
  lanes: [
    { id: 'quay', label: 'At the quay' },
    { id: 'bridge', label: 'Under the bridge' },
    { id: 'market', label: 'Market square' },
  ],
  cards: [
    { id: 'bell', label: 'Bicycle bell', laneId: 'market' },
    { id: 'ferry', label: 'Ferry horn', laneId: 'quay' },
  ],
  presentationOrder: ['market', 'quay', 'bridge'],
}

async function scene(page: Page, id: string) {
  const lane = workshop.lanes.find(lane => lane.id === id)!
  const cards = workshop.cards.filter(card => card.laneId === id)
  await expectWorkshopSlide(page, lane.label, cards.map(card => card.label), ['lane-' + id, ...cards.map(card => 'card-' + card.id)])
}

test('a reader opts into live playback, returns to the current scene, and leaves independently', async ({ browser }) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname) ||
    process.env.SLATEBOX_TEST_WORKSHOP_PUBLICATION !== 'true', 'Uses a disposable source and link-only publication on local or staging.')
  const [owner, reader, published] = await Promise.all([browser.newPage(), browser.newPage(), browser.newPage()])
  const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true })
  const readout = (page: Page) => page.getByRole('region', { name: 'Decision presentation' })
  let ownerId: string | null = null
  let slateId: string | null = null
  let key: string | null = null
  try {
    await owner.goto(new URL('/new/workshop' + encodeWorkshopFragment(workshop), origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(owner)).toBeTruthy()
    ownerId = await userId(owner)
    key = new URL(owner.url()).pathname.split('/').pop()!
    const original = await getSlate(owner, key)
    expect(original.userId).toBe(ownerId)
    expect(original.options.isPrivate).toBe(true)
    slateId = original._id
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      await expect(owner.locator('script[src*="/' + process.env.SLATEBOX_EXPECTED_APP_BUNDLE + '.js"]')).toHaveCount(1)
    }
    await dismissWelcome(owner)

    await workshopReady(owner)
    const dialog = await openPublication(owner)
    await expect(dialog.getByRole('radio', { name: 'Anyone with the link' })).toBeChecked()
    await dialog.getByRole('button', { name: 'Publish', exact: true }).click()
    const publishedUrl = await dialog.getByRole('link', { name: 'Open published presentation' }).getAttribute('href')
    expect(publishedUrl).toBe(new URL('/present/' + key, origin).href)
    await dialog.getByRole('button', { name: 'Close', exact: true }).click()
    await published.goto(publishedUrl!)
    await scene(published, 'market')
    const readLink = await shareAs(owner, 'read')
    await reader.goto(readLink.href)
    await dismissWelcome(reader)
    await workshopReady(reader)
    await expect(slateTitle(reader)).toHaveText(workshop.title)
    expect(await userId(reader)).toBeNull()
    await expect(button(reader, 'Presentation options')).toHaveCount(0)
    await expect(button(reader, 'Follow presentation')).toHaveCount(0)

    await presentToEveryone(owner)
    await scene(owner, 'market')
    await expect(button(reader, 'Follow presentation')).toBeVisible()
    await expect(readout(reader)).toHaveCount(0)
    await button(owner, 'Next lane').click()
    await scene(owner, 'quay')
    await expect(readout(reader)).toHaveCount(0)

    await button(reader, 'Follow presentation').click()
    await scene(reader, 'quay')
    await expect(button(reader, 'End presentation')).toHaveCount(0)
    await expect(button(reader, 'Next lane')).toHaveCount(0)
    await readout(reader).getByRole('heading', { name: 'At the quay' }).press('ArrowRight')
    await scene(reader, 'quay')
    await scene(published, 'market')
    await button(published, 'Next lane').click()
    await scene(published, 'quay')
    await button(owner, 'Next lane').click()
    await scene(reader, 'bridge')
    await scene(published, 'quay')

    await reader.reload()
    await scene(reader, 'bridge')
    await button(owner, 'Previous').click()
    await scene(reader, 'quay')
    await button(reader, 'Leave presentation').click()
    await expect(readout(reader)).toHaveCount(0)
    await button(owner, 'Previous').click()
    await scene(owner, 'market')
    await expect(button(reader, 'Follow presentation')).toBeVisible()
    await reader.reload()
    await expect(button(reader, 'Follow presentation')).toBeVisible()
    await expect(readout(reader)).toHaveCount(0)
    await button(reader, 'Follow presentation').click()
    await scene(reader, 'market')

    await button(owner, 'End presentation').click()
    await expect(readout(reader)).toHaveCount(0)
    await expect(button(reader, 'Follow presentation')).toHaveCount(0)
    await expect(button(owner, 'Present')).toBeVisible()
    await scene(published, 'quay')
    expect(await userId(reader)).toBeNull()
    expect(await userId(published)).toBeNull()
    expect((await getSlate(owner, key)).creative.model.workshop).toEqual(workshop)
  } finally {
    try {
      if (ownerId && slateId && key && await userId(owner) === ownerId) {
        // Unmount observers before deleting the exact fixture.
        await owner.goto(new URL('/plans', origin).href)
        await owner.waitForFunction(() => Boolean((window as any).Meteor?.subscribe))
        await owner.evaluate(() => { (window as any).Meteor.subscribe('me') })
        await owner.waitForFunction(id => {
          const meteor = (window as any).Meteor
          return meteor?.userId() === id && meteor.user()?.isAnonymous === true
        }, ownerId)
        await owner.evaluate(async ({ key, slateId }) => {
          const meteor = (window as any).Meteor
          const active = await meteor.callAsync('presentations.workshopStatus', key)
          if (active) await meteor.callAsync('presentations.unpublish', {
            presentationId: 'workshop-presentation-' + key, generation: active.generation,
          })
          await meteor.callAsync('slates.remove', { slateIds: [slateId] })
        }, { key, slateId })
        await expect.poll(() => getSlate(owner, key!)).toBeFalsy()
      }
    } finally {
      try { await removeTestGuest(owner, ownerId) }
      finally { await Promise.all([owner.close(), reader.close(), published.close()]) }
    }
  }
})
