import { createHmac } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { expect, type Browser, type BrowserContext, type Page } from '@playwright/test'
import WebSocket from 'ws'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { getSlate } from './workshop-guests.shared'
import { storedWorkshop } from './app-native-workshop.shared'

/**
 * What the trade harness (tests/harness/trade/harness.mjs) needs from a spec: the room as the relay
 * holds it, read straight from the relay (not through the latency proxy and not through a page),
 * the stored slate, and what a page draws — so each step can say which of the two sources of truth
 * a screen followed.
 *
 *   SLATEBOX_TRADE_HARNESS=1            the specs that need the harness run only with it
 *   SLATEBOX_RELAY_URL=ws://127.0.0.1:2293   the relay itself (default)
 *   SLATEBOX_RELAY_KEYS_FILE=…          the API_KEYS file the harness gave the relay (never printed)
 *   SLATEBOX_HARNESS_CONTROL=http://127.0.0.1:2295
 */
export const harnessOn = process.env.SLATEBOX_TRADE_HARNESS === '1'
const relayUrl = process.env.SLATEBOX_RELAY_URL || 'ws://127.0.0.1:2293'
const control = process.env.SLATEBOX_HARNESS_CONTROL || 'http://127.0.0.1:2295'

function relayParams() {
  const keys = JSON.parse(readFileSync(process.env.SLATEBOX_RELAY_KEYS_FILE!, 'utf8')) as { name: string; publicKey: string; secretKey: string }[]
  const { publicKey, secretKey } = keys.find(k => k.name === 'slatebox')!
  const timestamp = 'collab.' + new Date().toISOString()
  const hash = createHmac('sha256', secretKey).update(publicKey + ':' + timestamp).digest('base64')
  return { bearer: Buffer.from(publicKey + ':' + hash).toString('base64'), timestamp }
}

export interface RoomEntry { key: string; type: string; id?: string; t?: number; c?: number }

/** Every package the relay's room holds, read by a silent observer that writes nothing. */
export async function roomOf(room: string): Promise<RoomEntry[]> {
  const doc = new Y.Doc()
  const provider = new WebsocketProvider(relayUrl, room, doc, { connect: true, params: relayParams(), WebSocketPolyfill: WebSocket as any, disableBc: true })
  provider.awareness.setLocalState(null)
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('relay room ' + room + ' did not sync in 10 s')), 10_000)
      provider.once('sync', (synced: boolean) => { if (synced) { clearTimeout(timer); resolve() } })
    })
    const out: RoomEntry[] = []
    doc.getMap('collabPackages').forEach((pkg: any, key: string) => {
      const data = pkg?.data
      out.push({ key, type: pkg?.type, ...(data && !Array.isArray(data) && typeof data.id === 'string' ? { id: data.id } : {}), t: pkg?.timestamp, c: pkg?.clientID })
    })
    return out.sort((a, b) => (a.t ?? 0) - (b.t ?? 0))
  } finally {
    provider.destroy()
    doc.destroy()
  }
}

export async function harness(path: string, method = 'POST') {
  const res = await fetch(control + path, { method })
  expect(res.ok, 'harness ' + path).toBe(true)
  return res.json()
}

/** Notes and cards with these words, as the server stores them. */
export async function storedWords(page: Page, key: string, words: string) {
  const slate = await getSlate(page, key)
  const notes = (slate.nodes ?? []).filter((n: any) => n.options?.text === words).map((n: any) => n.options.id as string)
  const cards = ((await storedWorkshop(page, key)).cards as any[]).filter(c => c.label === words).map(c => c.id + '@' + c.laneId)
  return { notes, cards, baseline: slate.options?.collabBaseline ?? null, slateId: slate.options?.id as string }
}

/** Notes and cards with these words, as a page draws them (cards by their accessible name). */
export const drawnWords = (page: Page, words: string) => page.evaluate(words => {
  const s = (window as any).slate.v2
  const notes = s.freeNodes().filter((n: any) => n.options.text === words).map((n: any) => n.id + '@' + Math.round(n.options.x) + ',' + Math.round(n.options.y))
  const cards = [...document.querySelectorAll('#slateCanvas [data-node-id^="card-"]')]
    .filter(el => (el.getAttribute('aria-label') ?? '').startsWith(words + ', in '))
    .map(el => el.getAttribute('data-node-id')!.slice(5) + '@' + (el.getAttribute('aria-label') ?? '').slice((words + ', in ').length))
  const all = s.nodes.allNodes.map((n: any) => n.id)
  return { notes, cards, dupIds: all.filter((id: string, i: number) => all.indexOf(id) !== i) }
}, words)

/** Open a page in a fresh context; `relay: false` keeps it off the relay, so it draws the stored slate alone. */
export async function freshContext(browser: Browser, relay = true): Promise<BrowserContext> {
  const context = await browser.newContext({ viewport: { width: 1360, height: 900 } })
  if (!relay) await context.routeWebSocket(/:\d+\/[A-Za-z0-9_-]+\?bearer=/, ws => ws.close())
  return context
}

/**
 * Log, with times relative to `mark()`, when this page's DDP socket sends a method call and when
 * its result comes back, and when its relay socket sends or receives a Yjs update. Returns `mark`
 * and `events`, so a step can say whether the trade reached the server and the room before the
 * page went away.
 */
export function traceSockets(page: Page, who: string) {
  let zero = Date.now()
  const events: string[] = []
  const at = () => Date.now() - zero
  const methods = new Map<string, string>()
  const waiters: { name: string; resolve: () => void }[] = []
  // DDP messages, whether the socket carries them bare or in SockJS frames.
  const ddp = (payload: string | Buffer): any[] => {
    if (typeof payload !== 'string') return []
    try {
      // SockJS: the server sends a["…"], the client sends ["…"].
      if (payload.startsWith('a[') || payload.startsWith('["')) return (JSON.parse(payload.replace(/^a/, '')) as string[]).map(m => JSON.parse(m))
      if (payload.startsWith('{')) return [JSON.parse(payload)]
    } catch { /* not DDP */ }
    return []
  }
  const watched = (name: string) => /^(creativeSlates\.|slates\.)/.test(name)
  page.on('websocket', ws => {
    const relay = /\?bearer=/.test(ws.url())
    ws.on('framesent', f => {
      if (relay) {
        // y-protocols: messageSync (0), then an update (2).
        if (typeof f.payload !== 'string' && f.payload.length > 3 && f.payload[0] === 0 && f.payload[1] === 2) events.push(at() + 'ms ' + who + ' relay<-update ' + f.payload.length + 'B')
        return
      }
      for (const m of ddp(f.payload)) {
        if (m?.msg !== 'method' || !watched(m.method)) continue
        methods.set(m.id, m.method)
        events.push(at() + 'ms ' + who + ' ddp-> ' + m.method)
        for (const w of waiters.filter(w => w.name === m.method)) { waiters.splice(waiters.indexOf(w), 1); w.resolve() }
      }
    })
    ws.on('framereceived', f => {
      if (relay) return
      for (const m of ddp(f.payload)) {
        if (m?.msg === 'result' && methods.has(m.id)) events.push(at() + 'ms ' + who + ' ddp<- result ' + methods.get(m.id) + (m.error ? ' ERROR ' + (m.error.error ?? '') : ''))
      }
    })
    ws.on('close', () => events.push(at() + 'ms ' + who + (relay ? ' relay' : ' ddp') + ' socket closed'))
  })
  return {
    mark: () => { zero = Date.now(); events.length = 0 },
    events,
    /** Resolves the moment this page sends a call to `name` (after now). */
    sent: (name: string) => new Promise<void>(resolve => waiters.push({ name, resolve })),
  }
}

/** Slow the page's own network (Chrome DevTools throttling), as the staging spec did. */
export async function throttle(page: Page) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 400, downloadThroughput: 100_000, uploadThroughput: 50_000 })
}
