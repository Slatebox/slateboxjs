import { test, type Page, type WebSocket } from '@playwright/test'

// One network address may make only so many guests: users.createAnonymous allows 30 per 10 minutes per
// address (the app's server/metering/limits.mjs). Since the app reads the visitor's real address behind
// Cloudflare (2026-11-26), a whole test run against a deployed app is one address, so every guest an
// earlier spec made counts against the next one, and a long run is refused part way through. A spec that
// makes a guest does it through newGuest: when the server refuses the guest, it waits out the window the
// server names (its timeToReset) and asks again, so no test fails for what the tests before it spent.
// The limit itself is never raised, skipped or worked around: the guest is made the ordinary way, later.

const CANVAS = /\/canvas\/[a-zA-Z0-9]{10}$/

type Watch = { refused: Array<(ms: number) => void>, sockets: WeakMap<WebSocket, Set<string>> }
const watches = new WeakMap<Page, Watch>()

/** DDP messages in one websocket frame: plain JSON, or SockJS's "a[...]" / "[...]" batches of JSON strings. */
function messages(payload: string | Buffer): any[] {
  let text = typeof payload === 'string' ? payload : payload.toString('utf8')
  if (text.startsWith('a[')) text = text.slice(1)
  try {
    const parsed = JSON.parse(text)
    return (Array.isArray(parsed) ? parsed : [parsed]).map(item => typeof item === 'string' ? JSON.parse(item) : item)
  } catch { return [] }
}

/**
 * Watch a page's DDP traffic for a refused guest. Call it before the page opens its connection (a fresh
 * page, before its first goto) when the guest is made by a click on an already loaded page; newGuest
 * calls it too, which is enough when the step that makes the guest loads a page.
 */
export function watchGuests(page: Page): Watch {
  const known = watches.get(page)
  if (known) return known
  const watch: Watch = { refused: [], sockets: new WeakMap() }
  watches.set(page, watch)
  page.on('websocket', socket => {
    const asked = new Set<string>()
    watch.sockets.set(socket, asked)
    socket.on('framesent', frame => {
      for (const m of messages(frame.payload)) if (m?.msg === 'method' && m.method === 'users.createAnonymous') asked.add(String(m.id))
    })
    socket.on('framereceived', frame => {
      for (const m of messages(frame.payload)) {
        if (m?.msg !== 'result' || !asked.has(String(m.id)) || m.error?.error !== 'too-many-requests') continue
        const ms = Number(m.error?.details?.timeToReset) || 60_000
        for (const tell of watch.refused.splice(0)) tell(ms)
      }
    })
  })
  return watch
}

/**
 * Make a guest: `act` is the step that makes one (a goto, or a click), and `arrived` waits for its slate
 * (by default, the canvas URL). If the server refuses the guest for this address's budget, wait out the
 * window it names, with the test's timeout extended by as much, and take the same step again.
 */
export async function newGuest(page: Page, act: () => Promise<unknown>, arrived: () => Promise<unknown> = () => page.waitForURL(CANVAS, { timeout: 30_000 })) {
  const watch = watchGuests(page)
  for (let attempt = 1; ; attempt++) {
    let tell: (ms: number) => void = () => {}
    const refused = new Promise<number>(resolve => { tell = resolve })
    watch.refused.push(tell)
    const made = (async () => { await act(); await arrived(); return 'made' as const })()
    made.catch(() => {}) // when the refusal wins, this step is abandoned and its wait may time out later
    const outcome = await Promise.race([made, refused])
    watch.refused.splice(watch.refused.indexOf(tell), 1)
    if (outcome === 'made') return
    if (attempt >= 3) throw new Error(`users.createAnonymous was refused ${attempt} times for this address (too-many-requests)`)
    const wait = outcome + 2_000
    test.info().setTimeout(test.info().timeout + wait)
    console.log(`GUEST BUDGET >>> this address has made its guests for now; waiting ${Math.ceil(wait / 1000)} s, then the same step again`)
    await page.waitForTimeout(wait)
  }
}
