# Collab bug loop — canvas drag / presence / connector / rotation parity

## HELD — line/UX backlog M1-M9 (2026-07-02, from user; work ONE AT A TIME)
Core fixes in slateboxjs-v2; app-side pane/layout edits approved (LineDrawer/NodeDrawer/Chat/Canvas).
- M1. COG affordances: clicking a NODE shows a cog → opens the node properties pane (pop up from bottom);
  clicking a LINE shows a cog → opens the line properties pane. Today there's no cog on either.
- M2. LINE-CLICK BREAKS THE APP: clicking a connector leaves you stuck — can only pan the canvas, must
  refresh. Must be able to click a line, open its pane, and click away. (Blocking.)
- M3. CHAT = OVERLAY, not width-taking: REVERT the canvas inset (last change docked it + shrank canvas).
  Chat must float as an overlay that does NOT reduce canvas width, and must NOT block canvas interaction on
  its non-UI areas (pointer-events pass-through except the actual chat controls).
- M4. Arrowhead z-order: the connector arrowhead must render OVER the node, not behind it.
- M5. Birds-eye Miro-style: focus/frame content in the CENTER of the minimap; right now content sits weirdly
  at the bottom. Match Miro's overview behavior.
- M6. Remove the lower cookie banner.
- M7. Connectors follow LIVE during node RESIZE (dynamic re-layout each resize frame, not only at the end).
- M8. Drop-target feedback: dragging a line endpoint over an existing node must clearly show it will attach
  (highlight the target) and how; respect locked vs dynamic positioning.
- M9. Line properties pane fully configurable via the cog: arrow heads, line width, line type, locked/not-
  locked. (Pane logic largely exists from L-series; the missing piece is the cog to open it + completeness.)
Acceptance: click node/line → cog → pane from bottom; chat is a non-blocking overlay; arrowheads over nodes;
birds-eye centered; no cookie banner; connectors track during resize; clear attach feedback dragging a line
onto a node; all line props (arrows/width/type/lock) editable.



## Line editing backlog (2026-07-02, ALL L1-L5 DONE)
> L1a reattach-to-node [5097839]; L1b free-float endpoints [db0ea35]; L2/L3 line-prop apply+sync+persist
> [9fa0cef]; L4 no-rogue-lines via con.remove() [db0ea35]; L5 relative/absolute endpoint locking + pane
> toggle [3da98ef]. e2e: connector-endpoint-drag, connector-floating-endpoint, line-properties,
> connector-edge-pin, line-endpoint-lock, connector-sync-persist, connector-follows-rotation. 1063 unit.
> CHAT OVERLAP FIXED (app-side, user chose "dock it"): Chat.jsx panel is now a full-height right dock
> (top:0/right:0/height:100%/width:260); Canvas.jsx insets #slateCanvas width to calc(100% - 260px) when
> chat is open. Canvas ends exactly at the dock edge (no overlap); previously-covered region is interactive
> again → endpoints anywhere are grabbable. App files changed (uncommitted in slatebox repo, user-gated):
> Chat.jsx, pages/Canvas.jsx, components/line/LineProperties.jsx (L5 toggle), recoil/atoms.js, client/main.jsx.
> BACKLOG FULLY COMPLETE.

## Line editing backlog (superseded above)
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
L1a DONE [5097839]: endpoint-drag reattach to a node syncs+persists. The handle drag fires fine (earlier
"beforedrag never fires" was the chat panel overlapping that spot). Real bug was data-node-id read null
(findDropTarget returns the SHAPE child; group carries the id) → now walk up to the group. Reattach rebuilds
the association (remove+add) → broadcasts + persists. Verified live 2-window + reload.
L1b DONE [db0ea35]: free-floating endpoints — Association.sourcePoint/targetPoint; Connector.connectToPoint
(phantom-backed); addFloatingAssociation; handleEndpointChange phantom branch rebuilds as floating; deserialize
+ NodesManager + compat carry it. Verified live: drag endpoint to empty canvas → floating, syncs + persists.
L4 DONE [db0ea35]: disconnect removed con.line/con.marker which NEVER existed (real: con.connector/hitArea/
handles/markers) → added con.remove() + call from disconnectById. Rebuild leaves exactly 1 line, no orphans.
REMAINING: L5 (per-endpoint locking mode in the line pane — RELATIVE=auto-flow vs ABSOLUTE=pinned anchor;
builds on setConnectionAnchor; needs Association.sourceAnchor/targetAnchor persisted + pane toggle + collab).
Also app-side: chat panel (MuiPaper) overlaps canvas + intercepts handle grabs over its region (z-order).
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
