import { expect, test } from '@playwright/test'
import { newGuest } from './guest-budget.shared'
import WebSocket from 'ws'

const appUrl = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const wsHost = 'wss://collab.slatebox.com'

// Live collaboration hands out room-bound tokens only after an access check (security fix, 2026-11-26).
test('relay tokens: no access gets nothing, the owner gets a write token for its own room, live sync works', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(new URL(appUrl).hostname), 'writes: disposable guest on test only')
  test.setTimeout(180_000)
  const context = await browser.newContext()
  const page = await context.newPage()
  let owner: string | null = null
  try {
    await newGuest(page, () => page.goto(new URL('/start?empty=1', appUrl).href))
    const shareId = new URL(page.url()).pathname.split('/').pop()!
    owner = await page.evaluate(() => (window as any).Meteor.userId())

    // The owner's own init: a token, a write role, no legacy pair.
    // The new slate is saved a moment after the canvas opens: ask until it exists (up to 30 s).
    let mine: any = null
    for (let i = 0; i < 30; i++) {
      mine = await page.evaluate(async (shareId) => (window as any).Meteor.callAsync('collaborators.init', { shareId, routeKey: shareId }), shareId)
      if (mine?.relayCode !== 'slate-not-found') break
      await page.waitForTimeout(1000)
    }
    const params = mine?.wsParams || {}
    console.log('OWNER >>>', JSON.stringify({ role: mine?.relayRole, code: mine?.relayCode, keys: Object.keys(params) }))
    expect(params.token, 'owner token').toBeTruthy()
    expect(mine.relayRole).toBe('write')
    expect(params.bearer, 'no legacy pair').toBeUndefined()

    // A stranger (a fresh browser, never signed in) asking for this private slate, or a made-up one: nothing.
    const stranger = await (await browser.newContext()).newPage()
    await stranger.goto(new URL('/library', appUrl).href)
    await stranger.waitForFunction(() => (window as any).Meteor?.status?.().connected)
    const theirs = await stranger.evaluate(async (shareId) => {
      const m = (window as any).Meteor
      const ask = async (id: string) => { try { return await m.callAsync('collaborators.init', { shareId: id, routeKey: id }) } catch (e: any) { return { error: String(e?.error || e?.message) } } }
      return { private: await ask(shareId), madeUp: await ask('zz' + Math.random().toString(36).slice(2, 10)) }
    }, shareId)
    console.log('STRANGER >>>', JSON.stringify({ private: { code: theirs.private?.relayCode, keys: Object.keys(theirs.private?.wsParams || {}), error: theirs.private?.error }, madeUp: { code: theirs.madeUp?.relayCode, keys: Object.keys(theirs.madeUp?.wsParams || {}), error: theirs.madeUp?.error } }))
    expect(theirs.private?.wsParams?.token).toBeFalsy()
    expect(theirs.private?.wsParams?.bearer).toBeFalsy()
    expect(theirs.madeUp?.wsParams?.token).toBeFalsy()
    expect(theirs.madeUp?.wsParams?.bearer).toBeFalsy()

    // The relay itself: the owner's token on another room is refused (4403).
    const room = JSON.parse(Buffer.from(String(params.token).split('.')[0], 'base64url').toString()).room
    const closeCode = await new Promise<number>((resolve) => {
      const ws = new WebSocket(`${wsHost}/${room}x?token=${encodeURIComponent(params.token)}`)
      ws.on('close', (code) => resolve(code))
      ws.on('error', () => {})
      setTimeout(() => { ws.terminate(); resolve(-1) }, 15_000)
    })
    console.log('WRONG ROOM CLOSE >>>', closeCode)
    expect(closeCode).toBe(4403)

    // Live sync between two tabs of the same slate on the new tokens.
    const addNote = async (text: string) => {
      await page.bringToFront()
      const welcome = page.getByRole('region', { name: 'Your slate is ready' })
      if (await welcome.count()) await welcome.getByRole('button', { name: 'Add a note' }).click()
      else await page.locator('#slateCanvas').dblclick({ position: { x: 120, y: 120 } })
      await expect(page.locator('.sb-inline-editor')).toBeVisible()
      await page.keyboard.type(text)
      await page.keyboard.press('Enter')
    }
    const notes = (p: any) => p.locator('#slateCanvas g[data-node-id]')
    const first = `relay check one ${Date.now()}`
    await addNote(first)
    await expect(notes(page)).toHaveCount(1, { timeout: 15_000 })
    const second = await context.newPage()
    await second.goto(page.url())
    await expect(notes(second)).toHaveCount(1, { timeout: 30_000 })
    await second.waitForTimeout(3000)
    const live = `relay check two ${Date.now()}`
    await addNote(live)
    await expect(notes(page)).toHaveCount(2, { timeout: 15_000 })
    await expect(notes(second)).toHaveCount(2, { timeout: 30_000 })
    console.log('LIVE SYNC >>> ok')
    await stranger.context().close()
  } finally {
    if (owner) await page.evaluate(() => (window as any).Meteor.callAsync('users.delete')).catch(() => {})
    await context.close()
  }
})
