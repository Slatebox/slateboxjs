// Restated (exec): with the installed package, the per-action `read` and `move` commands and the
// `move_workshop_card` tool became scripts run by `slatebox exec` and the MCP `exec` tool; the
// named preview finds the card and lane by label in the script, as the command did. Same preview,
// same save, same replays across MCP, the CLI and HTTP. Keys inside a script are derived from the
// run's key, so the HTTP replay sends the key the script's call saved under.
import { randomBytes, randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { cliResult, derivedKey, installedTools, lit, mcpExec } from './agent-exec.shared'
import { dismissWelcome, getSlate, shareAs, userId } from './workshop-guests.shared'
import { conversation, standing, workshopReady } from './app-native-workshop.shared'
import { expectLane, nextView, openPresenter } from './app-presenter.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

test('a saved agent move follows the team’s map rules and reaches its reader’s presentation', async ({ browser, request }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Disposable staging or local fixtures only.')
  const owner = await browser.newPage()
  const reader = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const email = 'refund-move-final-' + randomUUID() + '@qa.slatebox.invalid'
  let ownerId: string | null = null
  let shareId: string | undefined
  let tokenId: string | undefined
  try {
    const entry = new URL('/new/map#brief=Who%20can%20approve%20a%20refund%3F', origin)
    await owner.goto(entry.href)
    await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
    await owner.waitForFunction(() => (window as any).Meteor?.userId())
    ownerId = await userId(owner)
    shareId = new URL(owner.url()).pathname.split('/').pop()!
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      await expect(owner.locator('script[src*="/' + process.env.SLATEBOX_EXPECTED_APP_BUNDLE + '.js"]')).toHaveCount(1)
    }
    await owner.goto(new URL('/profile', origin).href)
    const claim = owner.getByTestId('guest-account-claim')
    await claim.getByLabel('Email address').fill(email)
    await claim.locator('input[type=password]').fill(randomBytes(24).toString('hex'))
    await claim.getByRole('button', { name: 'Save my Slatebox' }).click()
    await owner.waitForFunction(() => (window as any).Meteor?.user()?.isAnonymous === false)
    await owner.goto(new URL('/canvas/' + shareId, origin).href)
    await owner.waitForFunction(id => (window as any).Meteor?.userId() === id, ownerId)
    const first = await getSlate(owner, shareId)
    expect(first.userId).toBe(ownerId)
    expect(first.options.isPrivate).toBe(true)
    await dismissWelcome(owner)
    await workshopReady(owner)
    const chat = conversation(owner)
    const input = chat.getByRole('textbox', { name: 'Message Slatebox' })
    await input.fill('Ask finance or ask the account owner')
    await input.press('Enter')
    await chat.getByRole('button', { name: 'Keep changes' }).click()
    await expect.poll(async () => (await getSlate(owner, shareId!)).creative.model.workshop.lanes.length).toBe(3)
    console.info('Private map created and both authored branches saved.')
    const issued = await owner.evaluate(() => (window as any).Meteor.callAsync('apiTokens.create', { name: 'Refund map proof', scopes: ['slates:read', 'slates:write'] }))
    tokenId = issued.id
    const headers = { authorization: 'Bearer ' + issued.token }
    const endpoint = new URL('/api/v1/slates/' + shareId, origin).href
    async function summary() {
      const response = await request.get(endpoint, { headers })
      expect(response.status()).toBe(200)
      return (await response.json()).workshop
    }
    const map = await summary()
    const team = map.cards.find((card: { label: string }) => card.label === 'Team')
    const finance = map.lanes.find((lane: { label: string }) => lane.label === 'Ask finance')
    expect(team.legalLaneIds).toContain(finance.id)
    const move = { kind: 'move_workshop_card', cardId: team.id, laneId: finance.id, expectedRevision: map.revision }
    const key = randomUUID()
    // The API takes mode "preview" or "save" since the action registry (app P02); it took dryRun.
    const submit = (mode: 'preview' | 'save', idempotencyKey: string, op = move) => request.post(endpoint + '/operations', {
      headers: { ...headers, 'Idempotency-Key': idempotencyKey },
      data: { mode, plan: { message: 'Move the workshop card', operations: [op] } },
    })
    expect((await submit('preview', key)).status()).toBe(200)
    expect(await summary()).toEqual(map)
    const forbidden = await submit('save', randomUUID(), { ...move, laneId: 'missing-destination' })
    expect(forbidden.status()).toBe(400)
    expect(await summary()).toEqual(map)
    let saved
    const tools = process.env.SLATEBOX_AGENT_TOOLS_DIR
    // The key the save was recorded under: with the package, the key its one call derived.
    let savedKey = key
    if (tools) {
      const { Client, StdioClientTransport, cli, server } = installedTools(tools)
      const env = { PATH: process.env.PATH!, SLATEBOX_API_TOKEN: issued.token, SLATEBOX_BASE_URL: origin.origin }
      expect(await cliResult(cli, env, `return (await slatebox.slates.get({ shareId: ${lit(shareId)} })).workshop`)).toEqual(map)
      const namedPreview = await cliResult(cli, env, `const { workshop } = await slatebox.slates.get({ shareId: ${lit(shareId)} })
const card = workshop.cards.find((c) => c.label === "Team"), lane = workshop.lanes.find((l) => l.label === "Ask finance")
return slatebox.slates.applyOperations({ shareId: ${lit(shareId)}, mode: "preview", plan: { message: "Move the workshop card", operations: [{ kind: "move_workshop_card", cardId: card.id, laneId: lane.id, expectedRevision: workshop.revision }] } })`)
      expect(namedPreview.operations).toEqual([move])
      expect(namedPreview.mode).toBe('preview')
      expect(await summary()).toEqual(map)
      const mcp = new Client({ name: 'refund-map-proof', version: '1' })
      try {
        await mcp.connect(new StdioClientTransport({ command: process.execPath, args: [server], env, stderr: 'ignore' }))
        const moveIt = (mode: string) => `return slatebox.slates.applyOperations({ shareId: ${lit(shareId)}, mode: ${lit(mode)}, plan: { message: "Move the workshop card", operations: [${lit(move)}] } })`
        const preview = await mcpExec(mcp, moveIt('preview'))
        expect(preview.status).toBe('completed')
        expect(preview.result.mode).toBe('preview')
        expect(await summary()).toEqual(map)
        const commit = await mcpExec(mcp, moveIt('save'), { idempotencyKey: key })
        expect(commit.status, JSON.stringify(commit.error)).toBe('completed')
        expect(commit.result.mode).toBe('save')
        saved = commit.result
        const cliReplay = await cliResult(cli, env, moveIt('save'), { key })
        expect(cliReplay).toEqual(saved)
        savedKey = derivedKey(issued.id, key, 1)
      } finally {
        await mcp.close()
      }
    } else {
      const committed = await submit('save', key)
      expect(committed.status()).toBe(201)
      saved = await committed.json()
    }
    const replay = await submit('save', savedKey)
    expect(replay.status()).toBe(200)
    expect(await replay.json()).toEqual(saved)
    expect((await submit('save', randomUUID())).status()).toBe(409)
    const result = await summary()
    expect(result.revision).toBe(map.revision + 1)
    expect(result.cards.find((card: { id: string }) => card.id === team.id).laneId).toBe(finance.id)
    await expect(standing(owner)).toContainText('Team · Ask finance', { timeout: 15000 })
    console.info('Owner saw the external move in the open map after preview, commit and retries.')
    await owner.reload()
    await workshopReady(owner)
    await expect(standing(owner)).toContainText('Team · Ask finance')

    const invite = await shareAs(owner, 'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    await workshopReady(reader)
    await expect(standing(reader)).toContainText('Team · Ask finance')
    // Restated 2026-11-21: Present opens the presenter; the second step frames Ask finance and the team's card.
    const presented = (await getSlate(reader, invite.pathname.split('/').pop()!)).creative.model.workshop
    const askFinance = presented.lanes.find((lane: { label: string }) => lane.label === 'Ask finance')
    const held = presented.cards.filter((item: { laneId: string }) => item.laneId === askFinance.id)
    expect(held.map((item: { label: string }) => item.label)).toEqual(['Team'])
    const player = await openPresenter(reader)
    await nextView(reader, player)
    await nextView(reader, player)
    await expectLane(player, 'Ask finance', askFinance.id, held.map((item: { id: string }) => item.id))
    expect(await userId(reader)).toBeNull()
    console.info('Independent read invitation presented the team token at the saved station.')
  } finally {
    try {
      if (ownerId) {
        await owner.goto(new URL('/profile', origin).href)
        await owner.waitForFunction((id) => (window as any).Meteor?.userId() === id, ownerId)
        await owner.waitForFunction(({ id, email }) => {
          const u = (window as any).Meteor?.user()
          return u?._id === id && (u.isAnonymous === true || u.emails?.[0]?.address === email)
        }, { id: ownerId, email })
        const cleaned = await owner.evaluate(async ({ ownerId, email, shareId, tokenId }) => {
          const meteor = (window as any).Meteor
          if (meteor.userId() !== ownerId || !(meteor.user()?.isAnonymous || meteor.user()?.emails?.[0]?.address === email)) return false
          if (meteor.user()?.orgId) return false
          if (shareId) {
            const owned = (await meteor.callAsync('slates.get', { shareId }))?.slateBase
            if (owned?.userId !== ownerId || owned.shareId !== shareId) return false
          }
          if (tokenId) await meteor.callAsync('apiTokens.revoke', { tokenId })
          return meteor.callAsync('users.delete')
        }, { ownerId, email, shareId, tokenId })
        expect(cleaned, 'Revoke the fixture token and delete its unique owner and sole board').toBe(true)
      }
    } finally {
      await reader.close()
      await owner.close()
    }
  }
})
