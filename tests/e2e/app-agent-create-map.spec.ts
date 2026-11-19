import { execFile } from 'node:child_process'
import { randomBytes, randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { conversation, workshopReady } from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const installed = process.env.SLATEBOX_AGENT_TOOLS_DIR

test('packaged tools create private maps and source diagrams through the same operation', async ({ browser, request }) => {
  test.skip(!installed, 'Requires an installed CLI and MCP release package.')
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Uses a disposable registered member.')
  const manifest = JSON.parse(readFileSync(resolve(installed!, 'package.json'), 'utf8'))
  const tools = createRequire(resolve(installed!, 'package.json'))
  const { Client } = tools('@modelcontextprotocol/sdk/client/index.js')
  const { StdioClientTransport } = tools('@modelcontextprotocol/sdk/client/stdio.js')
  const owner = await browser.newPage()
  const reader = await browser.newPage({ viewport: { width: 390, height: 844 } })
  owner.setDefaultTimeout(15_000)
  reader.setDefaultTimeout(15_000)
  const expectedBundle = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
  const fixtureId = randomUUID()
  const email = 'agent-create-' + fixtureId + '@qa.slatebox.invalid'
  const brief = 'Who approves a return for a damaged item?'
  const tokenIds: string[] = []
  const ownedBoards: string[] = []
  let principal: string | null = null
  let mcp: InstanceType<typeof Client> | undefined
  const mine = () => owner.evaluate(async () =>
    (await (window as any).Meteor.callAsync('slates.get', { type: 'mine', skip: 0, limit: 20 })).slates.map((s: { shareId: string }) => s.shareId).sort())
  try {
    const entry = new URL('/new', origin)
    entry.hash = new URLSearchParams({ brief: 'Agent tools verification ' + fixtureId }).toString()
    await owner.goto(entry.href)
    await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
    await owner.waitForFunction(() => Boolean((window as any).Meteor?.userId()))
    principal = await userId(owner)
    await owner.goto(new URL('/profile', origin).href)
    const claim = owner.getByTestId('guest-account-claim')
    // Hydration can show the profile before its automatic registration dialog.
    if (!await claim.waitFor({ timeout: 3000 }).then(() => true, () => false)) {
      await owner.getByRole('main').getByRole('button', { name: 'Save My Slatebox', exact: true }).click()
    }
    await claim.getByLabel('Email address').fill(email)
    await claim.locator('input[type=password]').fill(randomBytes(24).toString('hex'))
    await claim.getByRole('button', { name: 'Save my Slatebox' }).click()
    await owner.waitForFunction(email => (window as any).Meteor?.user()?.emails?.[0]?.address === email, email)
    const initial = await mine()
    const issue = async (name: string, scopes: string[]) => {
      const created = await owner.evaluate(args => (window as any).Meteor.callAsync('apiTokens.create', args), { name, scopes })
      tokenIds.push(created.id)
      return created.token as string
    }
    const write = await issue('Create map proof', ['slates:read', 'slates:write'])
    const read = await issue('Read map proof', ['slates:read'])
    const url = new URL('/api/v1/slates', origin).href
    const key = randomUUID()
    const post = (token: string, message: string, idempotencyKey = key) => request.post(url, {
      headers: { Authorization: 'Bearer ' + token, 'Idempotency-Key': idempotencyKey },
      data: { brief: message },
    })
    expect((await post(read, brief, randomUUID())).status()).toBe(401)
    expect(await mine()).toEqual(initial)

    const env = { PATH: process.env.PATH!, SLATEBOX_API_TOKEN: write, SLATEBOX_BASE_URL: origin.origin }
    const shell = async (...args: string[]) => JSON.parse((await promisify(execFile)(process.execPath, [
      resolve(installed!, manifest.bin.slatebox), ...args,
    ], { env })).stdout)
    const created = await shell('create', brief, '--idempotency-key', key)
    expect(created.shareId).toMatch(/^[a-zA-Z0-9]{10}$/)
    expect(created.url).toBe(new URL('/canvas/' + created.shareId, origin).href)
    expect(created.workshop.revision).toBe(0)
    mcp = new Client({ name: 'slatebox-create-acceptance', version: '1' })
    await mcp.connect(new StdioClientTransport({
      command: process.execPath, args: [resolve(installed!, manifest.bin['slatebox-mcp'])], env, stderr: 'ignore',
    }))
    const replay = await mcp.callTool({ name: 'create_slate', arguments: { brief, idempotency_key: key } })
    expect(replay.isError).toBeFalsy()
    expect(replay.structuredContent).toEqual(created)
    const httpReplay = await post(write, brief)
    expect(httpReplay.status()).toBe(200)
    expect(await httpReplay.json()).toEqual(created)
    expect((await post(write, 'Who processes a refund?')).status()).toBe(409)
    expect(await mine()).toEqual([...initial, created.shareId].sort())

    await owner.goto(created.url)
    await dismissWelcome(owner)
    if (expectedBundle) await expect(owner.locator('script[src*="/' + expectedBundle + '.js"]')).toHaveCount(1)
    const saved = () => getSlate(owner, created.shareId)
    const source = await saved()
    expect(source.userId).toBe(principal)
    ownedBoards.push(source._id)
    expect(source.options).toMatchObject({ isPrivate: true, isPublic: false })
    expect(source.creative.model.workshop.title).toBe(brief)
    // Create slate registers a guest. Warm the signed-out reader on a public page.
    await reader.goto(new URL('/plans', origin).href)
    await reader.waitForFunction(() => (window as any).Meteor?.status().connected)
    expect(await userId(reader)).toBeNull()
    expect(await getSlate(reader, created.shareId)).toBeFalsy()

    await workshopReady(owner)
    const chat = conversation(owner)
    const message = chat.getByRole('textbox', { name: 'Message Slatebox' })
    await message.fill('Ask the shop or ask the courier')
    await message.press('Enter')
    const keep = chat.getByRole('button', { name: 'Keep changes' })
    await expect(keep).toBeEnabled()
    expect((await saved()).creative.revision).toBe(0)
    await keep.click()
    await expect.poll(async () => (await saved()).creative.revision).toBe(1)
    const edited = (await saved()).creative.model.workshop
    expect(edited.lanes.map((lane: {label: string}) => lane.label)).toEqual([brief, 'Ask the shop', 'ask the courier'])
    await owner.reload()
    await workshopReady(owner)
    await expect(owner.locator('#slateCanvas [data-node-id^="lane-"]').filter({hasText:'Ask the shop'})).toBeVisible()
    expect((await saved()).creative.model.workshop).toEqual(edited)
    const invite = await shareAs(owner, 'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    if (expectedBundle) await expect(reader.locator('script[src*="/' + expectedBundle + '.js"]')).toHaveCount(1)
    await expect(reader.getByRole('button', { name: 'Join to edit' })).toHaveCount(0)
    await workshopReady(reader)
    await expect(conversation(reader)).toHaveCount(0)
    await expect(reader.getByRole('button', { name: 'Ask Slatebox' })).toHaveCount(0)
    await reader.getByRole('button', { name: 'Present', exact: true }).click()
    const show = reader.getByRole('region', { name: 'Decision presentation' })
    await expect(show.getByRole('heading', { name: brief, exact: true })).toBeVisible()
    await show.getByRole('button', { name: 'Next station' }).click()
    await expect(show.getByRole('heading', { name: 'Ask the shop', exact: true })).toBeVisible()
    expect(await userId(reader)).toBeNull()
    expect((await shell('create', brief, '--idempotency-key', key))).toEqual(created)
    expect((await saved()).creative.model.workshop).toEqual(edited)
    expect(await mine()).toEqual([...initial, created.shareId].sort())

    const diagramKey = randomUUID()
    const diagram = {
      brief: 'What should support tell someone starting a new call during the outage?',
      kind: 'diagram', source: 'call-status',
    }
    const createDrawing = (token: string, body: object) => request.post(url, {
      headers: { Authorization: 'Bearer ' + token, 'Idempotency-Key': diagramKey }, data: body,
    })
    expect((await createDrawing(read, diagram)).status()).toBe(401)
    const fresh = await createDrawing(write, diagram)
    expect(fresh.status()).toBe(201)
    const drawing = await fresh.json()
    expect(drawing.shareId).not.toBe(created.shareId)
    expect(drawing.diagram.nodeCount).toBe(5)
    expect(drawing.diagram.connections).toHaveLength(4)
    const marketing = process.env.SLATEBOX_MARKETING_URL
    if (marketing) {
      const example = await request.get(new URL('/assets/product/call-status-slate.json', marketing).href)
      expect(example.ok()).toBe(true)
      const { nodes } = await example.json()
      for (const { options, relationships } of nodes) {
        expect(drawing.diagram.nodes).toContainEqual(expect.objectContaining({
          id:options.id, text:options.text, x:options.xPos, y:options.yPos, width:options.width, height:options.height,
        }))
        for (const edge of relationships.associations) {
          expect(drawing.diagram.connections).toContainEqual(expect.objectContaining({
            id:edge.id, from:edge.parentId, to:edge.childId,
          }))
        }
      }
    }
    expect(drawing.workshop).toBeUndefined()
    const replayDrawing = () => mcp!.callTool({ name: 'create_slate', arguments: { ...diagram, idempotency_key: diagramKey } })
    expect((await replayDrawing()).structuredContent).toEqual(drawing)
    expect(await shell('create', diagram.brief, '--kind', 'diagram', '--source', diagram.source, '--idempotency-key', diagramKey)).toEqual(drawing)
    expect((await createDrawing(write, { ...diagram, source: 'interview-notes' })).status()).toBe(409)
    expect((await createDrawing(write, { brief: diagram.brief })).status()).toBe(409)
    expect(await getSlate(reader, drawing.shareId)).toBeFalsy()
    await owner.goto(drawing.url)
    const note = owner.locator('#slateCanvas g[data-node-id="unavailable"]').first()
    await expect(note).toHaveAttribute('aria-label','Could not start')
    const original = await getSlate(owner, drawing.shareId)
    expect(original.userId).toBe(principal)
    ownedBoards.push(original._id)
    expect(original.options.isPrivate).toBe(true)
    expect(original.creative).toBeUndefined()
    await expect(owner.getByRole('complementary', {name:'Conversation with Slatebox'})).toContainText(diagram.brief)
    const diagramInvitation = await shareAs(owner, 'edit')
    await reader.goto(diagramInvitation.href)
    await dismissWelcome(reader)
    const peerNote = reader.locator('#slateCanvas g[data-node-id="unavailable"]').first()
    await peerNote.click()
    await reader.keyboard.press('F2')
    await reader.locator('.sb-inline-editor').fill('Offer to call back')
    await reader.locator('.sb-inline-editor').press('Enter')
    await expect(note).toHaveAttribute('aria-label','Offer to call back')
    await expect.poll(async () => (await getSlate(owner,drawing.shareId)).nodes.find((node:{options:{id:string}}) => node.options.id === 'unavailable')?.options.text).toBe('Offer to call back')
    expect((await replayDrawing()).structuredContent).toEqual(drawing)
    await owner.reload()
    await expect(note).toHaveAttribute('aria-label','Offer to call back')
    expect(await mine()).toEqual([...initial,created.shareId,drawing.shareId].sort())
  } finally {
    try {
      if (mcp) await mcp.close()
      if (principal) {
        // Leave the editor before cleanup so a pending autosave cannot recreate its source.
        await owner.goto(new URL('/profile', origin).href)
        await owner.waitForFunction(({ id, email }) => {
          const u = (window as any).Meteor?.user()
          return u?._id === id && !u.orgId && (u.isAnonymous === true || u.emails?.[0]?.address === email)
        }, { id: principal, email })
        const removed = await owner.evaluate(async ({ id, email, tokenIds, ownedBoards }) => {
          const m = (window as any).Meteor, u = m.user()
          if (m.userId() !== id || u.orgId || !(u.isAnonymous || u.emails?.[0]?.address === email)) return false
          for (const tokenId of tokenIds) await m.callAsync('apiTokens.revoke', { tokenId })
          if (ownedBoards.length) await m.callAsync('slates.remove', { slateIds: ownedBoards })
          return m.callAsync('users.delete')
        }, { id: principal, email, tokenIds, ownedBoards })
        expect(removed, 'Retire only the registered test member, token pair and owned slates').toBe(true)
      }
    } finally {
      try {
        const peerGuest = await userId(reader)
        if (peerGuest) {
          await reader.goto(new URL('/plans', origin).href)
          await reader.waitForFunction(id => (window as any).Meteor?.userId() === id, peerGuest)
          await removeTestGuest(reader, peerGuest)
        }
      } finally {
        await reader.close()
        await owner.close()
      }
    }
  }
})
