/**
 * latency-proxy.mjs — a TCP proxy that holds every chunk for a random delay before passing it on,
 * in each direction, without reordering a connection's bytes. It carries HTTP and WebSocket alike
 * (the Meteor app's DDP socket, the collaboration relay's Yjs socket), so a local run sees the
 * hosted round trips that widen the windows a trade can be half-done in.
 *
 * A chunk read at `now` is written at max(previous chunk's due time, now + delay), where delay is
 * drawn between `min` and `max` ms (jitter), so later bytes never overtake earlier ones.
 * `setLatency` changes it for new chunks; `cutAll` drops every open connection (a relay restart,
 * or a network blip, seen from the browser). `holdSockets(ms)` holds back what the server sends on
 * every WebSocket open at that moment for `ms` more (HTTP and later sockets are not held): a page
 * that reloads then is gone before the answer to a call it already made reaches it, as on a
 * hosted link where that answer is slower than the reload.
 */
import net from 'node:net'

export function createLatencyProxy({ listenPort, targetPort, targetHost = '127.0.0.1', min = 150, max = 400, name = 'proxy' }) {
  let latency = { min, max }
  const open = new Set()
  let total = 0
  const delay = () => latency.min + Math.random() * Math.max(0, latency.max - latency.min)

  // One FIFO per direction, drained by a single timer: separate timers that come due in the same
  // millisecond are not guaranteed to fire in the order they were set, which would reorder bytes.
  function pipeDelayed(from, to, pair, downstream) {
    const queue = []
    let due = 0
    let ended = false
    let timer = null
    const drain = () => {
      timer = null
      const now = Date.now()
      while (queue.length && queue[0].at <= now) {
        const { chunk } = queue.shift()
        if (!to.destroyed) to.write(chunk)
      }
      if (queue.length) timer = setTimeout(drain, queue[0].at - now)
      else if (ended && !to.destroyed) to.end()
    }
    from.on('data', chunk => {
      if (!downstream && pair.ws === undefined) pair.ws = /\r\nupgrade:\s*websocket/i.test(String(chunk.subarray(0, 2048)))
      due = Math.max(due, Date.now() + delay(), downstream ? pair.holdUntil : 0)
      queue.push({ at: due, chunk })
      if (!timer) timer = setTimeout(drain, queue[0].at - Date.now())
    })
    const finish = () => {
      ended = true
      if (!queue.length && !timer && !to.destroyed) to.end()
    }
    from.on('end', finish)
    from.on('close', finish)
  }

  const accept = client => {
    total++
    const upstream = net.connect(targetPort, targetHost)
    const pair = { client, upstream, ws: undefined, holdUntil: 0 }
    open.add(pair)
    // An error (a reset from a closed tab, a refused relay) is followed by 'close', handled below.
    client.on('error', () => open.delete(pair))
    upstream.on('error', () => open.delete(pair))
    // A side that closes has its last bytes delivered first (as in-flight packets would be); the
    // other side is ended once they are, and destroyed a while later if it lingers.
    client.on('close', () => { open.delete(pair); setTimeout(() => upstream.destroy(), latency.max + 5000) })
    upstream.on('close', () => { open.delete(pair); setTimeout(() => client.destroy(), latency.max + 5000) })
    pipeDelayed(client, upstream, pair, false)
    pipeDelayed(upstream, client, pair, true)
  }
  // Loopback only, on both families: a browser asked for "localhost" may try ::1 first.
  const servers = ['127.0.0.1', '::1'].map(host => ({ host, server: net.createServer(accept) }))

  return {
    name,
    listen: () => Promise.all(servers.map(({ host, server }) => new Promise((resolve, reject) => {
      server.once('error', error => (host === '::1' && error.code === 'EADDRNOTAVAIL' ? resolve() : reject(error)))
      server.listen(listenPort, host, () => resolve())
    }))),
    setLatency(next) { latency = { min: Number(next.min ?? latency.min), max: Number(next.max ?? latency.max) } },
    status: () => ({ name, listenPort, targetPort, latency, open: open.size, total }),
    holdSockets(ms) { let held = 0; for (const pair of open) if (pair.ws) { pair.holdUntil = Date.now() + Number(ms); held++ } return held },
    cutAll() { for (const { client, upstream } of [...open]) { client.destroy(); upstream.destroy() } open.clear() },
    close: () => {
      for (const { client, upstream } of open) { client.destroy(); upstream.destroy() }
      return Promise.all(servers.map(({ server }) => new Promise(resolve => (server.listening ? server.close(() => resolve()) : resolve()))))
    },
  }
}
