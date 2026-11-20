import { randomBytes, randomUUID } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, getSlate, shareAs } from './workshop-guests.shared'

// P05a: every writer saves through the app's one save core. Two browsers and one token on one
// slate: each save raises the slate's revision; a token edit that names the revision it read is
// refused only when a note it changes was changed since, so people editing other notes never
// block it; a slate made and renamed by the token is found by the dashboard's search; a copy
// and a setting are made by the server.

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

const ready = (page: Page) => page.waitForFunction(() => Boolean((window as any).slate?.exportJSON))
// The edit a person makes by typing in a note, as the canvas makes it.
const typeInto = (page: Page, id: string, text: string) => page.evaluate(({ id, text }) => {
  const node = (window as any).slate.nodes.allNodes.find((n: any) => n.options.id === id)
  ;(node.v2 ?? node).setText(text)
}, { id, text })
const storedText = async (page: Page, share: string, id: string) =>
  (await getSlate(page, share)).nodes.find((n: any) => n.options.id === id)?.options.text

test('two people and a token save through one core: revisions, scoped conflict, search, copy and settings', async ({ browser, request }) => {
  test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Local disposable fixtures only.')
  const owner = await browser.newPage()
  const peerContext = await browser.newContext()
  const peer = await peerContext.newPage()
  owner.setDefaultTimeout(20_000)
  peer.setDefaultTimeout(20_000)

  const entry = new URL('/new', origin)
  entry.hash = new URLSearchParams({ brief: 'Save path ' + randomUUID() }).toString()
  await owner.goto(entry.href)
  await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
  await owner.waitForFunction(() => Boolean((window as any).Meteor?.userId()))
  await owner.goto(new URL('/profile', origin).href)
  const claim = owner.getByTestId('guest-account-claim')
  const email = 'save-path-' + randomUUID() + '@qa.slatebox.invalid'
  await claim.getByLabel('Email address').fill(email)
  await claim.locator('input[type=password]').fill(randomBytes(24).toString('hex'))
  await claim.getByRole('button', { name: 'Save my Slatebox' }).click()
  await owner.waitForFunction(email => (window as any).Meteor?.user()?.emails?.[0]?.address === email, email)
  const issued = await owner.evaluate(() => (window as any).Meteor.callAsync('apiTokens.create', { name: 'Save path proof', scopes: ['slates:read', 'slates:write'] }))
  const headers = { Authorization: 'Bearer ' + issued.token }

  try {
    const word = 'Zq' + randomBytes(4).toString('hex')
    const created = await request.post(new URL('/api/v1/slates', origin).href, {
      headers: { ...headers, 'Idempotency-Key': randomUUID() },
      data: { kind: 'diagram', brief: 'Draft -> Review -> Ship' },
    })
    expect(created.status()).toBe(201)
    const { shareId, url, diagram } = await created.json()
    const draft = diagram.connections[0].from as string
    const review = diagram.connections[0].to as string
    const ship = diagram.connections[1].to as string
    const read = async () => (await request.get(new URL('/api/v1/slates/' + shareId, origin).href, { headers })).json()
    const edit = (operations: object[], extra: object = {}) =>
      request.post(new URL('/api/v1/slates/' + shareId + '/operations', origin).href,
        { headers, data: { userMessage: 'Save path proof', plan: { message: 'Done.', operations }, ...extra } })

    // A slate made by the token starts at revision 1.
    expect((await read()).revision).toBe(1)

    await owner.goto(url)
    await dismissWelcome(owner)
    await ready(owner)
    const invitation = await shareAs(owner, 'edit')
    await peer.goto(invitation.href)
    await dismissWelcome(peer)
    await ready(peer)

    // The agent reads the revision, then two people edit two notes from their own browsers.
    const seen = (await read()).revision
    await typeInto(owner, draft, 'Draft by the owner')
    await expect.poll(() => storedText(owner, shareId, draft)).toBe('Draft by the owner')
    await typeInto(peer, ship, 'Ship by the guest')
    await expect.poll(() => storedText(owner, shareId, ship)).toBe('Ship by the guest')
    const afterPeople = (await read()).revision
    expect(afterPeople).toBeGreaterThan(seen)

    // The agent's edit of the note nobody touched saves on the revision it read...
    const untouched = await edit([{ kind: 'update_nodes', target: { ids: [review] }, changes: { text: 'Review by the agent' } }], { expectedRevision: seen })
    expect(untouched.status()).toBe(201)
    expect((await untouched.json()).revision).toBeGreaterThan(afterPeople)
    // ...and its edit of the owner's note is refused, naming the note and the current revision.
    const touched = await edit([{ kind: 'update_nodes', target: { ids: [draft] }, changes: { text: 'Draft by the agent' } }], { expectedRevision: seen })
    expect(touched.status()).toBe(409)
    const refusal = (await touched.json()).error
    expect(refusal.code).toBe('slate_changed')
    expect(refusal.details.notes).toEqual([draft])
    expect(refusal.details.revision).toBe((await read()).revision)
    expect(await storedText(owner, shareId, draft)).toBe('Draft by the owner')
    // Both browsers show the agent's saved edit; the people's notes are untouched.
    for (const page of [owner, peer])
      await expect.poll(() => page.evaluate(id => (window as any).slate.nodes.allNodes.find((n: any) => n.options.id === id)?.options.text, review)).toBe('Review by the agent')
    expect(await storedText(owner, shareId, ship)).toBe('Ship by the guest')

    // A rename by the token: the dashboard's search finds the slate by its new name and its notes.
    expect((await edit([{ kind: 'update_slate', changes: { name: word + ' launch' } }])).status()).toBe(201)
    const search = (filterString: string) => owner.evaluate(async filterString =>
      ((await (window as any).Meteor.callAsync('slates.get', { type: 'mine', filterString, limit: 20 }))?.slates ?? []).map((s: any) => s.shareId), filterString)
    await expect.poll(() => search(word)).toContain(shareId)
    await expect.poll(() => search('Review by the agent')).toContain(shareId)

    // A setting the page changes goes through the server, by an editor only.
    const before = (await read()).revision
    expect(await owner.evaluate(shareId => (window as any).Meteor.callAsync('slates.updateSettings', { shareId, welcomeAid: 'ai_savepath' }).then((r: any) => r.revision), shareId)).toBe(before + 1)

    // A copy is made by the server: the owner's, private, at revision 1, with its own search fields.
    const copied = await owner.evaluate(shareId => (window as any).Meteor.callAsync('slates.copy', { shareId, name: 'Copied board' }), shareId)
    expect(copied.revision).toBe(1)
    const copy = await getSlate(owner, copied.shareId)
    expect(copy.options.isPrivate).toBe(true)
    expect(copy.options.name).toBe('Copied board')
    expect(copy.nodes.map((n: any) => n.options.text).sort()).toEqual(['Draft by the owner', 'Review by the agent', 'Ship by the guest'])
    await expect.poll(() => search('Copied')).toContain(copied.shareId)
  } finally {
    await owner.evaluate((id) => (window as any).Meteor.callAsync('apiTokens.revoke', id), issued.id).catch(() => undefined)
    await peerContext.close()
  }
})
