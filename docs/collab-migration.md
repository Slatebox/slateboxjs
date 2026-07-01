# Collab Migration: slatebox.com → slateboxjs v3

**Decision (2026-07-01)**: keep v3's modern collab protocol and update the
Meteor app + collab server to match ("modernize app+server"), rather than
making v3 emulate v1's wire format.

Both generations use yjs + y-websocket with a Y.Map named `collabPackages`,
so the transport and server are already compatible. What changes is the
package flow inside the client and the app-side glue.

## What v3 already provides (no app changes needed)

- `onInitCollaboration(clientID)` is **awaited** before connecting; return
  `{websocketUrl, websocketParams: {bearer, timestamp}, userName, color}`
  exactly as the app does today (`Meteor.call` → collaborators.init). The
  params are sent as query-string values, so the existing HMAC check in
  collab.slatebox.com keeps working unchanged.
- `slate.collab.exe(pkg)` — applies a package locally via the Invoker
  (remote-echo-suppressed: it will NOT re-fire `onSlateChanged`).
- `slate.collab.invoke(packages)` — applies locally (same as exe over a list).
- `slate.collab.send(packages)` — writes to the shared Y.Map; remote peers
  apply via their Invoker automatically.
- `onCollaborationUsersChanged(users)` fires from awareness changes.
- `onSlateChanged(pkg, users)` fires on local user actions (add, delete,
  text, move, color, z-order, zoom, canvas move, resize).

## Differences from v1 the app must absorb

| v1 behavior | v3 behavior | App change |
|---|---|---|
| `collab.send()` writes map key = nodeId (last-write-wins per node) | unique key per package (append-style) | None — server relays either; Collaboration-collection observers unaffected |
| Local map write echoes back through the observer → `onSlateChanged` fires → app saves | `onSlateChanged` fires directly from the user action; `collab.send` does not re-echo | None in Canvas.jsx (it already saves from `onSlateChanged`); remove any reliance on send-echo ordering |
| `onMouseMoved` packages routed via awareness `user` field | `collab.updateCursor(x, y)` awareness cursor field + `renderCursor` | Replace `collab.send({type:'onMouseMoved'})` with `slate.collab.updateCursor(x, y)` |
| `collab.updateUserData(data)` merges into awareness user | same concept; v3 method name `updateUserData` needs adding OR use `awareness.setLocalStateField('user', ...)` | Small shim (see below) |
| `undoRedo.snap()` implicit on every send | explicit — call `slate.undoRedo.forceSnapshot()` where snapshotting matters | Optional |

## collab.slatebox.com changes

### STAGING CHECK RESULTS (2026-07-01, verified against the real bin/server.js)

Ran the actual production server code locally (`API_KEYS` synthetic org,
port 1122) with two slateboxjs v3 clients — `tests/e2e/collab-staging.spec.ts`:

- ✅ **HMAC auth path works end-to-end**: v3's awaited `onInitCollaboration`
  → `websocketParams: {bearer, timestamp}` → query params → the server's
  `isAuthenticated` accepts and relays. 20-package burst synced A→B,
  presence propagated. **No server changes required for v3 compatibility.**
- ✅ **Auth blocks data**: an invalid bearer receives zero document state
  and zero awareness (verified across isolated browser contexts).
- ⚠️ **Pre-existing server quirk** (not v3-related): on failed auth,
  `bin/server.js` sends the text frame `"Unauthenticated"` but never calls
  `ws.close()` — the socket stays open, so clients report a "connected"
  status while nothing flows. Recommended one-line fix in `handleAuth`'s
  catch: `ws.send("Unauthenticated"); ws.close(4401, "Unauthenticated");`
- ⚠️ **Map growth**: v3 appends unique keys per package (v1 overwrote one
  key per node). In-memory doc for an active room grows with edit count;
  the doc is discarded when the room empties (no `YPERSISTENCE` set in
  production ⇒ no long-term accumulation). If `YPERSISTENCE` is ever
  enabled, add periodic map clearing (v1-style `changesCleared` transaction
  on load) or key packages by `data.id`.

## Canvas.jsx wiring sketch (for the migration PR in the slatebox repo)

```js
// onInitCollaboration stays EXACTLY as-is (v3 awaits it now):
onInitCollaboration: async (clientID) => {
  const collaboratorDetails = await promisify(
    Meteor.call, CONSTANTS.methods.collaborators.init,
    { shareId, instanceId, clientID }
  )
  return {
    websocketUrl: collaboratorDetails.wsUrl,
    websocketParams: collaboratorDetails.wsParams, // {bearer, timestamp}
    color: collaboratorDetails.color,
    userName: getUserName(Meteor.userId()),
    x: 0, y: 0,
  }
},

// mouse cursors: replace the onMouseMoved send with
slate.collab.updateCursor(evt.clientX, evt.clientY)
```

## Open items tracked in drop-in-contract.md §I

- [ ] `collab.updateUserData(data)` parity method on v3 Collab
- [ ] Map GC/clearing semantics verified against collab.slatebox.com
- [ ] End-to-end test against `tests/collab-server-dev.js` with two clients
      exchanging a package through `send()` → remote `exe()`
- [ ] Migration PR prepared for the slatebox repo (user-coordinated)
