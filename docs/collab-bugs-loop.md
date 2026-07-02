# Collab bug loop — canvas drag / presence / connector / rotation parity

## Line editing backlog (2026-07-02, IN PROGRESS)
Go-ahead given; app-side pane edits approved. L2+L3 DONE [9fa0cef]: onLinePropertiesChanged now routes
pane {prop,val,associationId,id} → relationships.applyLineProperty (updates assoc record + re-renders via
real connectable setters setConnectorColor/setStrokeWidth/setType/setMarker; type map bezier→curved/
orthogonal/straight); connectTo+renderAssociation honor per-connection type/curviness/arrows so saved type
renders on create AND reload. Verified live 2-window (bezier→orthogonal syncs A→B + persists reload of both).
L1 IN PROGRESS [4845d95 foundation]: model hook wired — attachHandleToTarget fires con.onEndpointChange →
Connector.handleEndpointChange rebuilds the association (remove+add) on node reattach (broadcasts+persists);
phantom/free-float = L1b pending (needs bare-point endpoint in model+serialize). BLOCKERS found live: (a) the
connector handle's svg.draggable does NOT fire (beforedrag never triggers) in the SVG.js3/panzoom setup — the
handle has a draggable instance but pointer-drag doesn't start it; likely panzoom pointer interception or
handle event wiring. FIX THIS FIRST — nothing downstream works until the handle drag fires. (b) app chat panel
(MuiPaper 200px) overlaps the canvas and intercepts pointer events over part of it (z-order; app-side).
REMAINING: L1a drag-firing repair, L1b free-float bare-point model, L5 (relative/absolute locking toggle in
pane; builds on setConnectionAnchor), L4 (no rogue lines).
- L1. Snap-anywhere endpoints: source AND target endpoints draggable. Drop on a node → connect/snap;
  drop on empty canvas → free-floating (disconnected). Connect + disconnect by dragging the line end.
- L2. Line properties pane (v1 parity): line TYPE selectable — orthogonal, bezier, straight/linear, etc.
  (alongside existing color/width/arrow props).
- L3. Collab parity for editing EXISTING lines: changing a line's type/endpoints/props on existing nodes
  does not sync today — must broadcast + apply (create/delete/update/re-endpoint) like nodes.
- L4. No rogue lines: same discipline as the node fly-away fix — no stranded/orphaned lines, no endpoints
  flying off during endpoint-drag, re-layout, or collab apply.
- L5. Per-endpoint locking mode chosen in the pane: RELATIVE (proportional/auto-flow, follows move+rotate)
  vs ABSOLUTE (fixed point). Builds on edge-pin (setConnectionAnchor) + adds mode toggle, pane UI,
  persistence, collab sync.



> STATUS 2026-07-02: ALL 6 FIXED (core-library only, e2e-guarded).
> #1 harness — already resolved by the controlled-drag rework (verified not reproducible).
> #2 presence cursor — restyled (arrow + white rounded label, name in user color) [7c39445].
> #3+#6 connector sync+persist — connectToNode routed through relationships.addAssociation;
>   addRelationship idempotent [1b1f88d].
> #4 connector follows rotation — applyPositionAndRotation fires "transform" so svg.connectable
>   re-solves (auto-flow) [ed4fa76]; edge-pin mode added (setConnectionAnchor / local anchor that
>   rotates with the node) [7359ff0].
> #5 remote rotation animates — setRotation(angle, duration) tween; Invoker applies remote at 400ms [ae9a098].
> e2e: connector-sync-persist, connector-follows-rotation, connector-edge-pin, remote-rotation-anim,
> rotated-drag, presence-cursors. 1063 unit; 134 standalone e2e green.


Reported 2026-07-02 from a two-window collab session (localhost:3000/canvas). Work these
one at a time; every fix must hold **collab parity** (mirror to the other session) and
collab events must be **animated** in the remote window, not snapped.

Core files: `src/core/{Collab,Connector,ResizeRotate,Node,NodesManager}.ts`.

## 1. Selection harness left behind on drag
Dragging a node moves the node but the dashed bounding-box + transform handles (the
"harness") stay at the origin. Rotated-node drag tracks fine, so the plain-drag path
isn't applying the same transform to the harness. Fix: the harness must follow the node
during a controlled pointer-drag (same path that already works for rotated nodes).
→ `ResizeRotate.ts` / `Node.ts` drag handlers.

## 2. Presence cursor regressed to bare triangle + text
Remote "You" cursor renders as a plain triangle + unstyled label. Restore the prior
style: **white rounded-rect background with the color-coordinated collaborator name on
top** (name color matches the user's assigned collab color). → `Collab.ts` presence
cursor rendering (recently "wired up" — the style was dropped).

## 3. Connector/association not synced in collab
Clicking "add" created the node in the other window but NOT the association (connector
line). Left window shows the blue connector between the two nodes; right window has both
nodes but no line. Fix: connector create (and delete/update) must broadcast + apply in
every session — full connector-line parity. → `Connector.ts` + `Collab.ts` (yjs shared
type for connectors) + `NodesManager.ts`.

## 4. Connector doesn't follow a rotated node + edge-pin mode
On rotation the association stops tracking the node's anchor. Fix so the connector
endpoint stays attached through rotation. Support **both** modes: (a) auto-flow (endpoint
re-solves to the nearest/closest point automatically), and (b) **pinned to a specific node
edge/handle** the user chose. → `Connector.ts` anchor resolution + `ResizeRotate.ts`
rotation → connector re-layout.

## 5. Rotation not animated in the remote window
Rotation snaps in the other session. Every collab event should animate; rotation must
tween in the remote window like drag does. → `Collab.ts` remote-apply + the rotation tween
already used locally (`ResizeRotate.ts`).

## Acceptance
Two windows side by side: drag (harness follows), presence cursor styled, add connector
(appears + associates in both), rotate a connected node (connector stays attached in both,
both auto-flow and edge-pinned), rotation animates remotely.

## 6. Connectors don't survive a refresh (likely same root cause as #3)
Connectors/associations disappear on page reload. Combined with #3 (not synced to the
other session), this points to ONE root cause: connector create is NOT written to the
persistent/shared yjs store the way nodes are — so it neither syncs to peers nor reloads.
Fix connector persistence + sync together. → `Connector.ts` / `Collab.ts` (yjs shared
type) / `Serialization.ts` / `NodesManager.ts`.
