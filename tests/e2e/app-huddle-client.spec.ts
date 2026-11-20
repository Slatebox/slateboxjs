import { expect, test } from '@playwright/test'
import { dismissWelcome, removeTestGuest, userId } from './workshop-guests.shared'

// The huddle client a slate loads is a daily-js release Daily supports (0.72.2 was refused in
// November 2026), it starts without deprecation warnings, and turning a huddle on asks the app
// for the slate's room and joins it with the room's URL and token through that client.
// No Daily account is used: the room the server would issue is stood in for, and every request
// to Daily is recorded and refused, so this proves the client and its join path, not the call.

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const local = ['localhost', '127.0.0.1'].includes(new URL(origin).hostname)
const atLeast = (version: string, floor: string) => {
  const a = version.split('.').map(Number), b = floor.split('.').map(Number)
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]
  return true
}

test('turning a Free voice huddle on joins the slate’s room through a supported daily-js', async ({ browser }) => {
  test.skip(!local, 'Stands in for the Daily room on a local app only')
  const context = await browser.newContext({ permissions: ['microphone'] })
  const page = await context.newPage()
  const warnings: string[] = []
  page.on('console', message => {
    if (/daily|call ?object|deprecat|no longer supported/i.test(message.text())) warnings.push(message.type() + ': ' + message.text())
  })
  const daily: string[] = []
  await context.route(/daily\.co/, route => { daily.push(route.request().url()); return route.abort() })
  let guest: string | null = null
  try {
    await page.goto(origin + '/new')
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
    await expect.poll(() => userId(page)).toBeTruthy()
    guest = await userId(page)
    await dismissWelcome(page)
    const shareId = new URL(page.url()).pathname.split('/').pop()
    const version = await page.evaluate(() => (window as any).require('@daily-co/daily-js').default.version())
    expect(atLeast(version, '0.95.0'), 'daily-js ' + version).toBe(true)
    const huddle = await page.evaluate(async id => (await (window as any).Meteor.callAsync('slates.get', { shareId: id })).slateBase.options.huddleType ?? 'audio', shareId)
    expect(huddle, 'a new slate on Free has a voice huddle').toBe('audio')

    // The room the server would issue for this slate: its URL and a room token.
    const room = 'https://slatebox-local.daily.co/' + shareId
    await page.evaluate(({ room }) => {
      const m = (window as any).Meteor, call = m.callAsync.bind(m)
      ;(window as any).__joins = []
      m.callAsync = (name: string, ...args: any[]) => {
        if (name !== 'daily.join') return call(name, ...args)
        ;(window as any).__joins.push(args[0])
        return Promise.resolve({ url: room, token: 'local-room-token', canTranscribe: false })
      }
      const co = (window as any).require('@daily-co/daily-js').default.getCallInstance()
      const join = co.join.bind(co)
      co.join = (options: any) => { (window as any).__joined = options; return join(options) }
    }, { room, shareId })
    await page.locator('[name="huddleEnabled"]').check()
    await expect.poll(() => page.evaluate(() => (window as any).__joins)).toEqual([{ shareId }])
    await expect.poll(() => page.evaluate(() => (window as any).__joined)).toEqual({ url: room, token: 'local-room-token' })
    // The client went for the call machine of its own version, which is where a call starts.
    await expect.poll(() => daily.find(url => /call-machine/.test(url)) ?? '').toMatch(new RegExp('/' + version.replace(/\./g, '\\.') + '/'))
    const call = await page.evaluate(() => {
      const co = (window as any).require('@daily-co/daily-js').default.getCallInstance()
      return { instances: Object.keys((window as any)._daily?.instances ?? {}).length, state: co.meetingState() }
    })
    expect(call.instances, 'one call object per page').toBe(1)
    expect(warnings.filter(w => /deprecat|no longer supported/i.test(w))).toEqual([])
    test.info().annotations.push({ type: 'daily', description: JSON.stringify({ version, call, requests: daily, deprecations: warnings.filter(w => /deprecat|no longer supported/i.test(w)) }) })
  } finally {
    await removeTestGuest(page, guest).catch(() => undefined)
    await context.close()
  }
})
