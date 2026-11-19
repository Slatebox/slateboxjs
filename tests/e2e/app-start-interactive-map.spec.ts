import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import type { Workshop } from '../../src/workshops/model'
import { conversation, dragCardNamed, note, workshopReady } from './app-native-workshop.shared'

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
  await expectWorkshopSlide(page, destination, ['Team'], ['lane-' + branch.id, 'card-' + model.cards[0].id])
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
      expect(await chunk.text()).toContain('Conversation with Slatebox')
    }
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(owner)
    ownerId = await userId(owner)
    expect(ownerId).toBeTruthy()
    const ownerUrl = owner.url()
    const key = new URL(ownerUrl).pathname.split('/').pop()!
    const drawingChat = owner.getByRole('complementary', {name:'Conversation with Slatebox'})
    await drawingChat.getByRole('textbox', {name:'Message Slatebox'}).fill('Make this interactive: Start → Next step')
    await drawingChat.getByRole('button', {name:'Preview changes'}).click()
    await drawingChat.getByRole('button', {name:'Keep changes'}).click()
    // The same slate, on the same canvas, now carries the playable route beside its drawing.
    await workshopReady(owner)
    await expect(conversation(owner).getByRole('textbox', {name:'Direct map edits'})).toBeVisible()
    await expect(owner.getByRole('button', {name:/View drawing|Open workshop|Play interactive route/})).toHaveCount(0)
    expect(owner.url()).toBe(ownerUrl)
    const initial = await getSlate(owner, key)
    expect(initial.userId).toBe(ownerId)
    expect(initial.options.isPrivate).toBe(true)
    const starter: Workshop = initial.creative.model.workshop
    expect(starter.lanes.map(station => station.label)).toEqual(['Start', 'Next step'])
    const [start, next] = starter.lanes
    expect(start.station?.next).toEqual([next.id])
    expect(starter.cards).toHaveLength(1)
    expect(starter.cards[0]).toMatchObject({ label: 'Team', laneId: start.id })

    // The drawing's own notes are still on the canvas, and still the only stored notes.
    expect(initial.nativeCanvasDrawing).toBe(true)
    for (const kept of initial.nodes) await expect(note(owner, kept.options.id)).toBeVisible()
    expect(initial.nodes.some((kept: any) => /^(lane|card|column|caption)-/.test(kept.options.id))).toBe(false)
    const chat = conversation(owner)
    const message = chat.getByRole('textbox', {name:'Direct map edits'})
    await message.fill('Add Discard this branch after Next step')
    await message.press('Enter')
    await chat.getByRole('button', {name:'Discard preview',exact:true}).click()
    expect((await getSlate(owner, key)).creative.model.workshop).toEqual(starter)
    await message.fill('Add ' + destination + ' after Next step')
    await message.press('Enter')
    await chat.getByRole('button', {name:'Keep changes'}).click()
    await message.fill('At ' + destination + ', ' + outcome)
    await message.press('Enter')
    await chat.getByRole('button', {name:'Keep changes'}).click()
    await dragCardNamed(owner, 'Team', 'Next step')
    await expect(owner.getByText('Team · Next step', { exact: true })).toBeVisible()
    await dragCardNamed(owner, 'Team', destination)
    await expect(owner.getByText('Team · ' + destination, { exact: true })).toBeVisible()
    await expect.poll(async () => {
      const model: Workshop = (await getSlate(owner, key)).creative.model.workshop
      return model.lanes.find(station => station.id === model.cards[0].laneId)?.label
    }).toBe(destination)
    await owner.reload()
    await expect(owner.getByText('Team · ' + destination, { exact: true })).toBeVisible()
    const saved: Workshop = (await getSlate(owner, key)).creative.model.workshop
    expect(saved.lanes.map(station => station.label)).toEqual(['Start', 'Next step', destination])
    expect(saved.lanes[0].station?.next).toEqual([next.id])
    expect(saved.lanes[1].station?.next).toContain(saved.lanes[2].id)
    expect(saved.lanes[2].station?.outcome).toBe(outcome)
    await presentDestination(owner, saved)

    const invite = await shareAs(owner, 'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    await expect(reader.getByText('Team · ' + destination, { exact: true })).toBeVisible()
    await expect(conversation(reader)).toHaveCount(0)
    await presentDestination(reader, saved)
    expect(await userId(reader)).toBeNull()
  } finally {
    try { await removeTestGuest(owner, ownerId) }
    finally { await Promise.all([owner.close(), reader.close()]) }
  }
})
