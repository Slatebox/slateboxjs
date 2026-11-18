import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import type { Workshop } from '../../src/workshops/model'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const destination = 'Listening buoy'
const outcome = 'Record the bell before the tide turns.'

async function presentDestination(page: Page, model: Workshop) {
  await page.getByRole('button', { name: 'Present', exact: true }).click()
  const player = page.getByRole('region', { name: 'Decision presentation' })
  for (const station of model.lanes.slice(0, -1)) {
    await expect(player.getByRole('heading', { name: station.label, exact: true })).toBeVisible()
    await player.getByRole('button', { name: 'Next station' }).click()
  }
  const branch = model.lanes.find(station => station.label === destination)!
  await expectWorkshopSlide(page, destination, ['Token'], ['lane-' + branch.id, 'card-' + model.cards[0].id])
  await expect(player.getByText(outcome, { exact: true }).last()).toBeVisible()
  await player.getByRole('button', { name: 'Back to board' }).click()
}

test('create a private interactive map from Start, author a branch and share the saved outcome', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Uses a disposable guest and slate on local or staging')
  const owner = await browser.newPage()
  const reader = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true })
  let ownerId: string | null = null
  try {
    await owner.goto(new URL('/start', origin).href)
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      const hash = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
      expect(hash).toMatch(/^[a-f0-9]{40}$/)
      const script = owner.locator(`script[src*="/${hash}.js"]`)
      await expect(script).toHaveCount(1)
      const chunk = await owner.request.get(new URL((await script.getAttribute('src'))!, origin).href)
      expect(chunk.ok()).toBe(true)
      expect(await chunk.text()).toContain('Create an interactive map')
    }
    await owner.getByRole('link', { name: 'Create an interactive map', exact: true }).click()
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(owner)
    ownerId = await userId(owner)
    expect(ownerId).toBeTruthy()
    const ownerUrl = owner.url()
    const key = new URL(ownerUrl).pathname.split('/').pop()!
    await expect(owner.getByRole('heading', { name: 'Untitled map' })).toBeVisible()
    const initial = await getSlate(owner, key)
    expect(initial.userId).toBe(ownerId)
    expect(initial.options.isPrivate).toBe(true)
    const starter: Workshop = initial.creative.model.workshop
    expect(starter.lanes.map(station => station.label)).toEqual(['Start', 'Next step'])
    const [start, next] = starter.lanes
    expect(start.station?.next).toEqual([next.id])
    expect(starter.cards).toHaveLength(1)
    expect(starter.cards[0]).toMatchObject({ label: 'Token', laneId: start.id })

    const add = owner.getByRole('button', { name: 'Add a branch', exact: true })
    await add.click()
    const name = owner.getByRole('textbox', { name: 'Name', exact: true })
    await name.fill('Discard this branch')
    await owner.getByRole('button', { name: 'Cancel', exact: true }).click()
    expect((await getSlate(owner, key)).creative.model.workshop).toEqual(starter)

    await add.click()
    const source = owner.getByRole('combobox', { name: 'Branch from' })
    await expect(source).toHaveValue(start.id)
    await source.selectOption({ label: next.label })
    await name.fill(destination)
    await owner.getByRole('textbox', { name: 'On arrival', exact: true }).fill(outcome)
    await owner.getByRole('button', { name: 'Save branch', exact: true }).click()
    await expect(name).toHaveCount(0)
    await owner.getByRole('button', { name: 'Token → Next step' }).click()
    await owner.getByRole('button', { name: 'Token → ' + destination }).click()
    await expect(owner.getByText('Token · ' + destination, { exact: true })).toBeVisible()
    await expect.poll(async () => {
      const model: Workshop = (await getSlate(owner, key)).creative.model.workshop
      return model.lanes.find(station => station.id === model.cards[0].laneId)?.label
    }).toBe(destination)
    await owner.reload()
    await expect(owner.getByText('Token · ' + destination, { exact: true })).toBeVisible()
    const saved: Workshop = (await getSlate(owner, key)).creative.model.workshop
    expect(saved.lanes.map(station => station.label)).toEqual(['Start', 'Next step', destination])
    expect(saved.lanes[0].station?.next).toEqual([next.id])
    expect(saved.lanes[1].station?.next).toContain(saved.lanes[2].id)
    expect(saved.lanes[2].station?.outcome).toBe(outcome)
    await presentDestination(owner, saved)

    const invite = await shareAs(owner, 'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    await expect(reader.getByText('Token · ' + destination, { exact: true })).toBeVisible()
    await expect(reader.getByRole('button', { name: 'Add a branch' })).toHaveCount(0)
    await presentDestination(reader, saved)
    expect(await userId(reader)).toBeNull()
  } finally {
    try { await removeTestGuest(owner, ownerId) }
    finally { await Promise.all([owner.close(), reader.close()]) }
  }
})
