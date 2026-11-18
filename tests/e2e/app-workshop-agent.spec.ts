import { randomBytes, randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'
import { dismissWelcome, getSlate, shareAs, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

test('a saved agent move follows the team’s map rules and reaches its reader’s presentation', async ({ browser, request }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Disposable staging or local fixtures only.')
  const owner = await browser.newPage()
  const reader = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const email = 'map-agent-' + randomUUID() + '@qa.slatebox.invalid'
  let ownerId: string | null = null
  let shareId: string | undefined
  let tokenId: string | undefined
  try {
    await owner.goto(new URL('/plans', origin).href)
    await owner.waitForFunction(() => (window as any).Accounts && (window as any).Meteor.status().connected)
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      await expect(owner.locator('script[src*="/' + process.env.SLATEBOX_EXPECTED_APP_BUNDLE + '.js"]')).toHaveCount(1)
    }
    ownerId = await owner.evaluate(async ({ email, password }) => {
      await new Promise<void>((ok, fail) => (window as any).Accounts.createUser({ email, password }, (err: Error) => err ? fail(err) : ok()))
      return (window as any).Meteor.userId()
    }, { email, password: randomBytes(24).toString('hex') })
    expect(ownerId).toBeTruthy()
    await owner.goto(new URL('/new/map#brief=Who%20can%20approve%20a%20refund%3F', origin).href)
    await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
    shareId = new URL(owner.url()).pathname.split('/').pop()!
    const first = await getSlate(owner, shareId)
    expect(first.userId).toBe(ownerId)
    expect(first.options.isPrivate).toBe(true)
    await dismissWelcome(owner)
    const chat = owner.getByRole('complementary', { name: 'Map conversation' })
    const input = chat.getByRole('textbox', { name: 'Direct map edits' })
    await input.fill('Ask finance or ask the account owner')
    await input.press('Enter')
    await chat.getByRole('button', { name: 'Keep changes' }).click()
    await expect.poll(async () => (await getSlate(owner, shareId!)).creative.model.workshop.lanes.length).toBe(3)
    const issued = await owner.evaluate(() => (window as any).Meteor.callAsync('apiTokens.create', { name: 'Refund map proof', scopes: ['slates:read', 'slates:write'] }))
    tokenId = issued.id
    const headers = { authorization: 'Bearer ' + issued.token }
    const endpoint = new URL('/api/v1/slates/' + shareId, origin).href
    async function summary() {
      const response = await request.get(endpoint, { headers })
      expect(response.status()).toBe(200)
      return (await response.json()).summary.workshop
    }
    const map = await summary()
    const team = map.cards.find((card: { label: string }) => card.label === 'Team')
    const finance = map.lanes.find((lane: { label: string }) => lane.label === 'Ask finance')
    expect(team.legalLaneIds).toContain(finance.id)
    const move = { kind: 'move_workshop_card', cardId: team.id, laneId: finance.id, expectedRevision: map.revision }
    const key = randomUUID()
    const submit = (dryRun: boolean, idempotencyKey: string, op = move) => request.post(endpoint + '/operations', {
      headers: { ...headers, 'Idempotency-Key': idempotencyKey },
      data: { dryRun, plan: { message: 'Move the workshop card', operations: [op] } },
    })
    expect((await submit(true, key)).status()).toBe(200)
    expect(await summary()).toEqual(map)
    const forbidden = await submit(false, randomUUID(), { ...move, laneId: 'missing-destination' })
    expect(forbidden.status()).toBe(400)
    expect(await summary()).toEqual(map)
    let saved
    const tools = process.env.SLATEBOX_AGENT_TOOLS_DIR
    if (tools) {
      const requireTools = createRequire(resolve(tools, 'package.json'))
      const { Client } = requireTools('@modelcontextprotocol/sdk/client/index.js')
      const { StdioClientTransport } = requireTools('@modelcontextprotocol/sdk/client/stdio.js')
      const env = { PATH: process.env.PATH!, SLATEBOX_API_TOKEN: issued.token, SLATEBOX_BASE_URL: origin.origin }
      const cli = await promisify(execFile)(process.execPath, [resolve(tools, 'src/slatebox.js'), 'read', shareId], { env })
      expect(JSON.parse(cli.stdout).summary.workshop).toEqual(map)
      const mcp = new Client({ name: 'refund-map-proof', version: '1' })
      try {
        await mcp.connect(new StdioClientTransport({ command: process.execPath, args: [resolve(tools, 'src/cli.js')], env, stderr: 'ignore' }))
        const args = { share_id: shareId, card_id: team.id, lane_id: finance.id, expected_revision: map.revision }
        const preview = await mcp.callTool({ name: 'move_workshop_card', arguments: args })
        expect(preview.isError).toBeFalsy()
        expect(preview.structuredContent.dryRun).toBe(true)
        expect(await summary()).toEqual(map)
        const commit = await mcp.callTool({ name: 'move_workshop_card', arguments: {
          ...args, dry_run: false, idempotency_key: key,
        } })
        expect(commit.isError).toBeFalsy()
        expect(commit.structuredContent.dryRun).toBe(false)
        saved = commit.structuredContent
      } finally {
        await mcp.close()
      }
    } else {
      const committed = await submit(false, key)
      expect(committed.status()).toBe(201)
      saved = await committed.json()
    }
    const replay = await submit(false, key)
    expect(replay.status()).toBe(200)
    expect(await replay.json()).toEqual(saved)
    expect((await submit(false, randomUUID())).status()).toBe(409)
    const result = await summary()
    expect(result.revision).toBe(map.revision + 1)
    expect(result.cards.find((card: { id: string }) => card.id === team.id).laneId).toBe(finance.id)
    await owner.reload()
    await expect(owner.locator('.map-stage')).toContainText('Team · Ask finance')

    const invite = await shareAs(owner, 'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    await expect(reader.locator('.map-stage')).toContainText('Team · Ask finance')
    await reader.getByRole('button', { name: 'Present', exact: true }).click()
    const player = reader.getByRole('region', { name: 'Decision presentation' })
    await player.getByRole('button', { name: 'Next station' }).click()
    await expect(player.getByRole('heading', { name: 'Ask finance', exact: true })).toBeVisible()
    await expect(player.getByRole('listitem').filter({ hasText: /^Team$/ })).toHaveCount(1)
    expect(await userId(reader)).toBeNull()
  } finally {
    try {
      if (ownerId) {
        await owner.goto(new URL('/profile', origin).href)
        await owner.waitForFunction((id) => (window as any).Meteor.userId() === id, ownerId)
        const cleaned = await owner.evaluate(async ({ ownerId, email, shareId, tokenId }) => {
          const meteor = (window as any).Meteor
          if (meteor.userId() !== ownerId || meteor.user()?.emails?.[0]?.address !== email) return false
          const mine = await meteor.callAsync('slates.get', { type: 'mine', skip: 0, limit: 5, filterString: '', private: false })
          if (mine.counts.total !== (shareId ? 1 : 0) || (shareId && mine.slates[0]?.shareId !== shareId)) return false
          if (tokenId) await meteor.callAsync('apiTokens.revoke', { tokenId })
          return meteor.callAsync('users.delete')
        }, { ownerId, email, shareId, tokenId })
        expect(cleaned).toBe(true)
      }
    } finally {
      await reader.close()
      await owner.close()
    }
  }
})
