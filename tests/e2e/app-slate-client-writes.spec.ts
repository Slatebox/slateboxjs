import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { openGuestCanvas } from './app-host.shared'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { dragCard, laneOfCard, slateKey, workshopReady } from './app-native-workshop.shared'

/**
 * What a browser may write straight to the slates collection, without going through a method.
 * Meteor exposes /slates/insertAsync, /slates/updateAsync and /slates/removeAsync to every
 * connected client; the collection's allow and deny rules are the only thing between a signed-in
 * stranger and somebody else's slate, and between an editor and the fields only methods may set.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

/**
 * One collection write from this page's own connection, answered by the server (the browser's
 * own optimistic answer says nothing about what was stored). Resolves to "ok" or the refusal's
 * error code: 403 is the collection's "Access denied".
 */
const write = (page: Page, method: 'insertAsync' | 'updateAsync' | 'removeAsync', args: unknown[]) =>
  page.evaluate(({ method, args }) => (window as any).Meteor.connection.applyAsync('/slates/' + method, args, { returnServerResultPromise: true })
    .then(() => 'ok', (error: { error?: unknown }) => String(error?.error ?? 'refused')), { method, args })

const plan: Workshop = {
  version: 1, title: 'Client write proof',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }],
}

test('a signed-in stranger cannot change, empty, delete or plant a slate through the collection', async ({ page, browser }) => {
  let ownerId: string | null = null, strangerId: string | null = null
  const other = await browser.newContext()
  const stranger = await other.newPage()
  try {
    await openGuestCanvas(page, origin.origin)
    ownerId = await userId(page)
    const key = slateKey(page)
    // A slate started in the browser, saved at least once.
    await expect.poll(async () => (await getSlate(page, key))?._id).toBeTruthy()
    const before = await getSlate(page, key)
    // The flag every slate started in the browser carries; it must not be a grant to everyone.
    expect(before.options.allowCollaboration).toBe(true)
    expect(before.userId).toBe(ownerId)

    await openGuestCanvas(stranger, origin.origin)
    strangerId = await userId(stranger)
    expect(strangerId).toBeTruthy()
    expect(strangerId).not.toBe(ownerId)

    // The slate is private: nobody but its owner has been given anything. The flag is not a grant.
    expect(before.options.isPrivate).toBe(true)
    expect(await write(stranger, 'updateAsync', [{ _id: before._id }, { $set: { 'options.name': 'Taken over' } }, {}])).toBe('403')
    expect(await write(stranger, 'updateAsync', [{ _id: before._id }, { $set: { 'options.welcomeAid': 'x' } }, {}])).toBe('403')
    expect(await write(stranger, 'updateAsync', [{ _id: before._id }, { $set: { nodes: [] } }, {}])).toBe('403')
    expect(await write(stranger, 'updateAsync', [{ _id: before._id }, { $set: { userId: strangerId } }, {}])).toBe('403')
    expect(await write(stranger, 'updateAsync', [{ _id: before._id }, { $set: { 'options.isPrivate': false, 'options.isPublic': true } }, {}])).toBe('403')
    expect(await write(stranger, 'removeAsync', [{ _id: before._id }])).toBe('403')
    // Nor can a slate be planted in somebody else's account.
    const planted = 'planted' + Date.now()
    expect(await write(stranger, 'insertAsync', [{ _id: planted, userId: ownerId, shareId: planted, nodes: [], options: { id: planted, name: 'Planted', allowCollaboration: true } }])).toBe('403')
    // The owner's own setting still lands, which shows the path itself is open.
    expect(await write(page, 'updateAsync', [{ _id: before._id }, { $set: { 'options.directWriteProbe': true } }, {}])).toBe('ok')

    const after = await getSlate(page, key)
    expect(after).toBeTruthy()
    expect(after.userId).toBe(ownerId)
    expect(after.options.name).toBe(before.options.name)
    expect(after.options.welcomeAid).toBe(before.options.welcomeAid)
    expect(after.options.directWriteProbe).toBe(true)
    expect(after.nodes.map((node: any) => node.options.id)).toEqual(before.nodes.map((node: any) => node.options.id))
    expect(await page.evaluate(id => (window as any).Meteor.callAsync('slates.get', { shareId: id }).then((found: any) => Boolean(found?.slateBase), () => false), planted)).toBe(false)
  } finally {
    try { await removeTestGuest(stranger, strangerId) } finally { await other.close() }
    await removeTestGuest(page, ownerId)
  }
})

test('an owner\'s own browser may write a setting, and nothing that a method guards: notes, owner, share id, sharing, or the workshop', async ({ page }) => {
  let id: string | null = null
  try {
    await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(plan), origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(page)).toBeTruthy()
    id = await userId(page)
    await dismissWelcome(page)
    await workshopReady(page)
    const key = slateKey(page)
    const before = await getSlate(page, key)
    const set = (fields: Record<string, unknown>) => write(page, 'updateAsync', [{ _id: before._id }, { $set: fields }, {}])

    // The control: a setting under options lands.
    expect(await set({ 'options.directWriteProbe': true })).toBe('ok')
    // The workshop is saved by creativeSlates.save alone: validated, on the revision it was made on.
    expect(await set({ 'creative.model.workshop': { version: 1, title: 'x', lanes: 'not lanes', cards: null } })).toBe('403')
    expect(await set({ 'creative.model.kind': 'paused' })).toBe('403')
    expect(await set({ 'creative.revision': 99 })).toBe('403')
    expect(await set({ creative: { revision: 0, model: { kind: 'workshop', version: 1, workshop: { ...plan, title: 'Swapped' } } } })).toBe('403')
    expect(await write(page, 'updateAsync', [{ _id: before._id }, { $unset: { creative: '' } }, {}])).toBe('403')
    // Notes are saved by slates.update; identity and sharing by their own methods.
    expect(await set({ nodes: [{ options: { id: 'direct', text: 'Direct' }, relationships: { associations: [] } }] })).toBe('403')
    expect(await write(page, 'updateAsync', [{ _id: before._id }, { $push: { nodes: { options: { id: 'pushed' } } } }, {}])).toBe('403')
    expect(await set({ userId: 'someone-else' })).toBe('403')
    expect(await set({ shareId: 'aaaaaaaaaa' })).toBe('403')
    expect(await set({ 'options.shareId': 'aaaaaaaaaa' })).toBe('403')
    expect(await set({ 'options.allowCollaboration': false })).toBe('403')
    expect(await set({ options: { name: 'Replaced' } })).toBe('403')

    const after = await getSlate(page, key)
    expect(after.options.directWriteProbe).toBe(true)
    expect(after.creative).toEqual(before.creative)
    expect(after.nodes).toEqual(before.nodes)
    expect(after.userId).toBe(before.userId)
    expect(after.shareId).toBe(before.shareId)
    expect(after.options.name).toBe(before.options.name)

    // And the workshop still plays and saves on its revision.
    await dragCard(page, 'alpha', 'later')
    await expect.poll(async () => (await getSlate(page, key)).creative.revision).toBe(before.creative.revision + 1)
    expect(await laneOfCard(page, 'alpha')).toBe('Later')
  } finally { await removeTestGuest(page, id) }
})
