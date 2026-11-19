import { randomBytes, randomUUID } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, getSlate, shareAs } from './workshop-guests.shared'

// The app's /api/v1 operations route now runs slateboxjs/operations. With a
// slate open in two browsers, each saved agent edit appears on both (through
// the run listener and the relay), and a reload shows what was saved.

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

type Seen = { notes: Record<string, { text: string; x: number; y: number; rotation: number; locked: boolean }>; connectors: string[] }

function seen(slate: { nodes: Array<{ options: any; relationships?: { associations?: any[] } }> }): Seen {
  const notes: Seen['notes'] = {}
  const connectors: string[] = []
  for (const { options, relationships } of slate.nodes) {
    notes[options.id] = {
      text: options.text ?? '',
      x: Math.round(options.xPos ?? options.x ?? 0),
      y: Math.round(options.yPos ?? options.y ?? 0),
      rotation: Math.round(options.rotate?.rotationAngle ?? 0),
      locked: options.isLocked === true,
    }
    for (const a of relationships?.associations ?? []) connectors.push(`${a.parentId ?? options.id}>${a.childId}`)
  }
  return { notes, connectors: connectors.sort() }
}

const onCanvas = (page: Page) => page.evaluate(() => JSON.parse((window as any).slate.exportJSON())).then(seen)

test('agent canvas edits reach both open browsers and survive a reload', async ({ browser, request }) => {
  test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Local disposable fixtures only.')
  const owner = await browser.newPage()
  const peerContext = await browser.newContext()
  const peer = await peerContext.newPage()
  owner.setDefaultTimeout(15_000)
  peer.setDefaultTimeout(15_000)

  const entry = new URL('/new', origin)
  entry.hash = new URLSearchParams({ brief: 'Canvas operations ' + randomUUID() }).toString()
  await owner.goto(entry.href)
  await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
  await owner.waitForFunction(() => Boolean((window as any).Meteor?.userId()))
  await owner.goto(new URL('/profile', origin).href)
  const claim = owner.getByTestId('guest-account-claim')
  if (!await claim.waitFor({ timeout: 3000 }).then(() => true, () => false)) {
    await owner.getByRole('main').getByRole('button', { name: 'Save My Slatebox', exact: true }).click()
  }
  const email = 'canvas-ops-' + randomUUID() + '@qa.slatebox.invalid'
  await claim.getByLabel('Email address').fill(email)
  await claim.locator('input[type=password]').fill(randomBytes(24).toString('hex'))
  await claim.getByRole('button', { name: 'Save my Slatebox' }).click()
  await owner.waitForFunction(email => (window as any).Meteor?.user()?.emails?.[0]?.address === email, email)
  const issued = await owner.evaluate(() => (window as any).Meteor.callAsync('apiTokens.create', { name: 'Canvas operations proof', scopes: ['slates:read', 'slates:write'] }))
  const headers = { Authorization: 'Bearer ' + issued.token }

  // A slate made from a brief: its connectors carry the brief's ids (from-to).
  const created = await request.post(new URL('/api/v1/slates', origin).href, {
    headers: { ...headers, 'Idempotency-Key': randomUUID() },
    data: { kind: 'diagram', brief: 'Draft -> Review -> Ship' },
  })
  expect(created.status()).toBe(201)
  const { shareId, url, diagram } = await created.json()
  const [first, second] = diagram.connections
  const a = first.from as string
  const b = first.to as string
  const c = second.to as string
  const endpoint = new URL('/api/v1/slates/' + shareId + '/operations', origin).href
  const save = (operations: object[], userMessage = 'Edit the slate') =>
    request.post(endpoint, { headers, data: { userMessage, plan: { message: 'Done.', operations } } })

  await owner.goto(url)
  await dismissWelcome(owner)
  await owner.waitForFunction(() => Boolean((window as any).slate?.exportJSON))
  const invitation = await shareAs(owner, 'edit')
  await peer.goto(invitation.href)
  await dismissWelcome(peer)
  await peer.waitForFunction(() => Boolean((window as any).slate?.exportJSON))
  const both = async (check: (state: Seen) => void) => {
    for (const page of [owner, peer]) await expect.poll(async () => { try { check(await onCanvas(page)); return true } catch { return false } }, { timeout: 15_000 }).toBe(true)
  }
  const stored = async () => seen(await getSlate(owner, shareId))

  // A note made with id x1 is connected in the same plan, and lands at x, y.
  const added = await save([
    { kind: 'add_nodes', count: 1, shape: 'rectangle', text: 'Added by an agent', ids: ['x1'], x: 900, y: 600 },
    { kind: 'connect_nodes', from: { ids: [a] }, to: { ids: ['x1'] } },
  ])
  expect(added.status()).toBe(201)
  await both((state) => {
    expect(state.notes.x1).toMatchObject({ text: 'Added by an agent', x: 900, y: 600 })
    expect(state.connectors).toContain(`${a}>x1`)
  })

  // An update to a locked note is skipped and reported.
  expect((await save([{ kind: 'update_nodes', target: { ids: [c] }, changes: { locked: true } }])).status()).toBe(201)
  await both((state) => expect(state.notes[c].locked).toBe(true))
  const locked = await save([{ kind: 'update_nodes', target: { ids: [c] }, changes: { text: 'Should not change' } }])
  expect((await locked.json()).report.skipped).toEqual([{ operation: 1, id: c, reason: 'locked' }])
  expect((await stored()).notes[c].text).not.toBe('Should not change')

  // An empty match answers 409 no_match and writes nothing.
  const empty = await save([{ kind: 'update_nodes', target: { text: 'No note says this' }, changes: { text: 'x' } }])
  expect(empty.status()).toBe(409)
  expect((await empty.json()).error.code).toBe('no_match')

  // Rotate 45: shown live, stored where the engine loads it.
  expect((await save([{ kind: 'update_nodes', target: { ids: [a] }, changes: { rotationAngle: 45 } }])).status()).toBe(201)
  await both((state) => expect(state.notes[a].rotation).toBe(45))

  // Connecting twice leaves one connector on a slate made from a brief.
  const twice = await save([{ kind: 'connect_nodes', from: { ids: [a] }, to: { ids: [b] } }])
  expect((await twice.json()).report.unchanged).toBe(true)
  await both((state) => expect(state.connectors.filter((item) => item === `${a}>${b}`)).toHaveLength(1))

  // Disconnect b from a removes the a to b connector.
  const removed = await save([{ kind: 'disconnect_nodes', from: { ids: [b] }, to: { ids: [a] } }])
  expect((await removed.json()).report.disconnected).toEqual([first.id])
  await both((state) => expect(state.connectors).not.toContain(`${a}>${b}`))

  // Stored JSON and the live canvas agree, before and after a reload.
  const saved = await stored()
  expect(saved.notes[a].rotation).toBe(45)
  expect(saved.notes.x1).toMatchObject({ x: 900, y: 600 })
  expect(saved.connectors).not.toContain(`${a}>${b}`)
  expect(saved.connectors).toContain(`${a}>x1`)
  for (const page of [owner, peer]) {
    expect(await onCanvas(page)).toEqual(saved)
    await page.reload()
    await page.waitForFunction(() => Boolean((window as any).slate?.exportJSON))
    await expect.poll(() => onCanvas(page), { timeout: 15_000 }).toEqual(saved)
  }
  await owner.evaluate((id) => (window as any).Meteor.callAsync('apiTokens.revoke', id), issued.id).catch(() => undefined)
  await peerContext.close()
})
