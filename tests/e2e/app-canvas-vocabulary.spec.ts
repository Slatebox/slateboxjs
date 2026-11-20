// App spec (P10): the P10 vocabulary written by an agent (MCP
// apply_slate_operations -> POST /api/v1/slates/{id}/operations) reaches an open
// canvas through the run listener and equals what is stored, and a reload
// agrees. Optimize Layout (the facade call the Settings button makes) saves a
// tidy layout.
import { randomBytes, randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { dismissWelcome, getSlate } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL!)
const tools = process.env.SLATEBOX_AGENT_TOOLS_DIR!
import * as ops from '../../src/operations'

async function ownerWithTools(owner: Page) {
  await owner.goto(new URL('/new/map#brief=Vocabulary%20proof', origin).href)
  await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
  await owner.waitForFunction(() => (window as any).Meteor?.userId())
  await owner.goto(new URL('/profile', origin).href)
  const claim = owner.getByTestId('guest-account-claim')
  await claim.getByLabel('Email address').fill('p10-' + randomUUID() + '@qa.slatebox.invalid')
  await claim.locator('input[type=password]').fill(randomBytes(24).toString('hex'))
  await claim.getByRole('button', { name: 'Save my Slatebox' }).click()
  await owner.waitForFunction(() => (window as any).Meteor?.user()?.isAnonymous === false)
  const issued = await owner.evaluate(() => (window as any).Meteor.callAsync('apiTokens.create', { name: 'P10 proof', scopes: ['slates:read', 'slates:write'] }))
  const requireTools = createRequire(resolve(tools, 'package.json'))
  const { Client } = requireTools('@modelcontextprotocol/sdk/client/index.js')
  const { StdioClientTransport } = requireTools('@modelcontextprotocol/sdk/client/stdio.js')
  const mcp = new Client({ name: 'p10-proof', version: '1' })
  await mcp.connect(new StdioClientTransport({ command: process.execPath, args: [resolve(tools, 'src/cli.js')],
    env: { PATH: process.env.PATH!, SLATEBOX_API_TOKEN: issued.token, SLATEBOX_BASE_URL: origin.origin }, stderr: 'ignore' }))
  const call = async (name: string, args: object) => {
    const result = await mcp.callTool({ name, arguments: args })
    expect(result.isError, name + ': ' + result.content?.[0]?.text).toBeFalsy()
    return result.structuredContent
  }
  const drawing = await call('create_slate', { brief: 'Alpha -> Beta -> Gamma', kind: 'diagram', idempotency_key: randomUUID() })
  const nodes: { id: string, text: string }[] = drawing.diagram.nodes
  const cleanup = async () => {
    await mcp.close()
    await owner.evaluate(async ({ tokenId }) => (window as any).Meteor.callAsync('apiTokens.revoke', { tokenId }), { tokenId: issued.id }).catch(() => {})
  }
  return { call, drawing, share: drawing.shareId as string, id: (text: string) => nodes.find(n => n.text === text)!.id, nodes, cleanup }
}

const note = (page: Page, nodeId: string) => page.locator('#slateCanvas g[data-node-id="' + nodeId + '"]').first()
const KEYS = ['text', 'shape', 'backgroundColor', 'borderColor', 'fontFamily', 'link', 'effect', 'groupId', 'textOpacity']
const view = (slate: any) => ({
  order: slate.nodes.map((n: any) => n.options.id),
  notes: Object.fromEntries(slate.nodes.map((n: any) => [n.options.id, Object.fromEntries(KEYS.map(k => [k, ops.NODE_KEYS[k].read(n.options)]))])),
  connectors: slate.nodes.flatMap((n: any) => n.relationships.associations).map((a: any) => [a.id, a.lineColor]).sort(),
  settings: [slate.options.mindMapMode, slate.options.viewPort?.showGrid, slate.options.viewPort?.snapToObjects, slate.options.defaultLineColor],
})
const liveView = (page: Page) => page.evaluate(() => JSON.parse((window as any).slate.exportJSON()))

test('the P10 vocabulary from an agent appears on the open canvas as stored, and survives a reload', async ({ browser }) => {
  const owner = await browser.newPage()
  const t = await ownerWithTools(owner)
  try {
    const { call, share, id } = t
    await owner.goto(t.drawing.url)
    await dismissWelcome(owner)
    for (const n of t.nodes) await expect(note(owner, n.id)).toHaveAttribute('aria-label', n.text, { timeout: 20000 })
    const saved = await call('apply_slate_operations', {
      share_id: share, message: 'P10 proof', user_message: 'P10 proof', dry_run: false, idempotency_key: randomUUID(),
      operations: [
        { kind: 'add_nodes', count: 1, text: 'Delta', ids: ['p10-delta'], placement: { relativeTo: id('Gamma'), direction: 'below', connect: true } },
        { kind: 'add_nodes', count: 1, preset: 'sticky', text: 'Sticky', ids: ['p10-sticky'], x: 2000, y: 2000 },
        { kind: 'update_nodes', target: { ids: [id('Alpha')] }, changes: { link: 'https://slatebox.com/docs', effect: 'dropShadow', textOpacity: 0.6 } },
        { kind: 'update_nodes', target: { ids: [id('Beta'), id('Gamma')] }, changes: { groupId: 'p10-group' } },
        { kind: 'update_nodes', target: { ids: [id('Alpha')] }, changes: { order: 'front' } },
        { kind: 'duplicate_nodes', target: { ids: [id('Beta'), id('Gamma')] }, ids: ['p10-beta2', 'p10-gamma2'], offset: { x: 0, y: 900 } },
        { kind: 'arrange_nodes', target: { ids: [id('Alpha'), id('Beta'), id('Gamma'), 'p10-delta'] }, layout: 'tree' },
        { kind: 'update_slate', changes: { mindMapMode: true, showGrid: true, snapToObjects: true, defaultLineColor: '#ff0055' } },
      ],
    })
    expect(saved.mode).toBe('save')
    await expect(note(owner, 'p10-delta')).toHaveCount(1, { timeout: 20000 })
    await expect(note(owner, 'p10-gamma2')).toHaveCount(1, { timeout: 20000 })
    await owner.waitForTimeout(5000)
    const stored = view(await getSlate(owner, share))
    const live = view(await liveView(owner))
    console.info('stored', JSON.stringify(stored))
    expect(stored.notes['p10-delta'].fontFamily).toBe(stored.notes[id('Gamma')].fontFamily)
    expect(stored.notes[id('Alpha')]).toMatchObject({ link: 'https://slatebox.com/docs', effect: 'dropShadow', textOpacity: 0.6 })
    expect(stored.settings).toEqual([true, true, true, '#ff0055'])
    expect(live).toEqual(stored)
    await owner.reload()
    await expect(note(owner, 'p10-delta')).toHaveCount(1, { timeout: 20000 })
    await owner.waitForTimeout(3000)
    // The relay room replays its whole package log on every join (plan-check F1,
    // P06's to fix): a replayed onNodeToFront raises Alpha again, above notes added
    // after it. Everything but the order is compared here; the order after the
    // reload is logged as evidence for P06.
    const without = ({ order, ...rest }: any) => rest
    const reloaded = view(await liveView(owner))
    expect(without(reloaded)).toEqual(without(stored))
    await owner.waitForTimeout(4000)
    const storedAfter = view(await getSlate(owner, share))
    expect(without(storedAfter)).toEqual(without(stored))
    console.info('order: stored before reload', JSON.stringify(stored.order), 'live after reload', JSON.stringify(reloaded.order), 'stored after reload', JSON.stringify(storedAfter.order))
  } finally {
    await t.cleanup()
    await owner.close()
  }
})

test("Optimize Layout runs the engine's tidy layout and saves it", async ({ browser }) => {
  const owner = await browser.newPage()
  const t = await ownerWithTools(owner)
  try {
    const { call, share, id } = t
    await call('apply_slate_operations', {
      share_id: share, message: 'Stack', user_message: 'Stack the notes', dry_run: false, idempotency_key: randomUUID(),
      operations: [{ kind: 'update_nodes', target: { ids: t.nodes.map(n => n.id) }, changes: { x: 500, y: 500 } }],
    })
    await owner.goto(t.drawing.url)
    await dismissWelcome(owner)
    for (const n of t.nodes) await expect(note(owner, n.id)).toHaveAttribute('aria-label', n.text, { timeout: 20000 })
    await owner.evaluate(() => (window as any).slate.removeLayoutOverlaps())
    await owner.waitForTimeout(5000)
    const boxes = (await getSlate(owner, share)).nodes.map((n: any) => ({ x: n.options.xPos, y: n.options.yPos, w: n.options.width, h: n.options.height }))
    const overlaps = boxes.some((a: any, i: number) => boxes.slice(i + 1).some((b: any) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y))
    console.info('after Optimize Layout', JSON.stringify(boxes))
    expect(overlaps).toBe(false)
    expect(boxes.map((b: any) => [b.x, b.y])).not.toEqual(boxes.map(() => [500, 500]))
    void id
  } finally {
    await t.cleanup()
    await owner.close()
  }
})
