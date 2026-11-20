#!/usr/bin/env node
/**
 * harness.mjs — a staging-like collaboration path for the trade specs (app-trade-reload.spec.ts).
 *
 * It starts, and keeps as its own children:
 * - the production relay (the Slatebox y-websocket fork, collab.slatebox.com bin/server.js),
 *   configured as the cluster runs it: HMAC bearer auth against API_KEYS, rooms kept in memory
 *   for the life of the process (no YPERSISTENCE, no CALLBACK_URL: see k3/prod.yml);
 * - a latency proxy in front of it (default 150-400 ms each way, with jitter);
 * - a latency proxy in front of the local Meteor app (default 40-90 ms each way), so a method's
 *   answer arrives a hosted round trip after the server has acted on it;
 * - a control server: GET /status, POST /latency?which=relay|app&min=&max=,
 *   POST /relay/restart (the relay process restarts and its rooms are gone, as a pod restart),
 *   POST /relay/cut (every open relay connection drops; the relay keeps its rooms),
 *   POST /hold?which=app|relay&ms= (what the server sends on every WebSocket open now is held
 *   back ms longer: a page reloaded then leaves before the answer to its last call arrives).
 *
 * The Meteor app is started separately (see the app's scripts/trade-harness-meteor.sh) on
 * APP_PORT with ROOT_URL at the app proxy, and its settings' public.wsUrl at the relay proxy.
 *
 * Environment (all optional except RELAY_KEYS_FILE):
 *   RELAY_DIR          the relay checkout                     (default ../collab.slatebox.com next to this repo)
 *   RELAY_KEYS_FILE    JSON for API_KEYS: [{"name":"slatebox","publicKey":…,"secretKey":…}],
 *                      the same pair as the app settings' slateboxAPI. Never printed.
 *   RELAY_CWD          working folder for the relay; must hold no .env (the relay loads one)
 *   RELAY_PORT=2293 RELAY_PROXY_PORT=2294 APP_PORT=4494 APP_PROXY_PORT=4496 CONTROL_PORT=2295
 *   RELAY_LATENCY=150-400 APP_LATENCY=40-90   (ms each way, min-max)
 *   RELAY_PERSIST      a folder: run the relay with YPERSISTENCE there (production does not)
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, createWriteStream } from 'node:fs'
import http from 'node:http'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createLatencyProxy } from './latency-proxy.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const env = process.env
const num = (v, d) => (v ? Number(v) : d)
const range = (v, d) => { const [min, max] = (v || d).split('-').map(Number); return { min, max } }

const relayDir = resolve(env.RELAY_DIR || resolve(here, '../../../../collab.slatebox.com'))
const relayPort = num(env.RELAY_PORT, 2293)
const relayProxyPort = num(env.RELAY_PROXY_PORT, 2294)
const appPort = num(env.APP_PORT, 4494)
const appProxyPort = num(env.APP_PROXY_PORT, 4496)
const controlPort = num(env.CONTROL_PORT, 2295)
const relayCwd = resolve(env.RELAY_CWD || process.cwd())
const relayLog = env.RELAY_LOG ? resolve(env.RELAY_LOG) : null

if (!env.RELAY_KEYS_FILE) throw new Error('RELAY_KEYS_FILE is required')
const apiKeys = readFileSync(env.RELAY_KEYS_FILE, 'utf8')
JSON.parse(apiKeys)
if (!existsSync(resolve(relayDir, 'bin/server.js'))) throw new Error('No relay at ' + relayDir)
if (existsSync(resolve(relayCwd, '.env'))) throw new Error('RELAY_CWD holds a .env; the relay would load it')
mkdirSync(relayCwd, { recursive: true })

let relay = null
let relayStarts = 0
const log = (...a) => console.log('[harness]', new Date().toISOString(), ...a)

function startRelay() {
  return new Promise((resolveStart, reject) => {
    const childEnv = {
      PATH: env.PATH, HOME: env.HOME, HOST: '127.0.0.1', PORT: String(relayPort), API_KEYS: apiKeys,
      NODE_OPTIONS: '--max-old-space-size=2048',
      ...(env.RELAY_PERSIST ? { YPERSISTENCE: resolve(env.RELAY_PERSIST) } : {}),
    }
    const child = spawn(process.execPath, [resolve(relayDir, 'bin/server.js')], { cwd: relayCwd, env: childEnv, stdio: ['ignore', 'pipe', 'pipe'] })
    relay = child
    relayStarts++
    const out = relayLog ? createWriteStream(relayLog, { flags: 'a' }) : process.stdout
    let ready = false
    const onData = d => {
      out.write(d)
      if (!ready && /running at/.test(String(d))) { ready = true; resolveStart() }
    }
    child.stdout.on('data', onData)
    child.stderr.on('data', d => out.write(d))
    child.on('exit', (code, signal) => {
      log('relay exited', code, signal)
      if (relay === child) relay = null
      if (!ready) reject(new Error('relay exited before it listened'))
    })
  })
}
function stopRelay() {
  return new Promise(resolveStop => {
    const child = relay
    if (!child) return resolveStop()
    child.once('exit', () => resolveStop())
    child.kill('SIGTERM')
    setTimeout(() => { try { child.kill('SIGKILL') } catch { /* gone */ } }, 3000)
  })
}

const relayProxy = createLatencyProxy({ name: 'relay', listenPort: relayProxyPort, targetPort: relayPort, ...range(env.RELAY_LATENCY, '150-400') })
const appProxy = createLatencyProxy({ name: 'app', listenPort: appProxyPort, targetPort: appPort, ...range(env.APP_LATENCY, '40-90') })

await startRelay()
await relayProxy.listen()
await appProxy.listen()

const status = () => ({ relay: { pid: relay?.pid ?? null, port: relayPort, starts: relayStarts, persist: !!env.RELAY_PERSIST }, proxies: [relayProxy.status(), appProxy.status()] })

const control = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const reply = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  try {
    if (req.method === 'GET' && url.pathname === '/status') return reply(200, status())
    if (req.method === 'POST' && url.pathname === '/latency') {
      const proxy = url.searchParams.get('which') === 'app' ? appProxy : relayProxy
      proxy.setLatency({ min: url.searchParams.get('min') ?? undefined, max: url.searchParams.get('max') ?? undefined })
      return reply(200, status())
    }
    if (req.method === 'POST' && url.pathname === '/relay/restart') {
      await stopRelay()
      relayProxy.cutAll()
      await startRelay()
      log('relay restarted')
      return reply(200, status())
    }
    if (req.method === 'POST' && url.pathname === '/hold') {
      const proxy = url.searchParams.get('which') === 'relay' ? relayProxy : appProxy
      return reply(200, { held: proxy.holdSockets(Number(url.searchParams.get('ms') ?? 3000)) })
    }
    if (req.method === 'POST' && url.pathname === '/relay/cut') { relayProxy.cutAll(); return reply(200, status()) }
    reply(404, { error: 'unknown' })
  } catch (e) {
    reply(500, { error: String(e?.message ?? e) })
  }
})
control.listen(controlPort, '127.0.0.1', () => log('ready', JSON.stringify(status())))

const shutdown = async () => {
  await stopRelay()
  await relayProxy.close()
  await appProxy.close()
  control.close()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
