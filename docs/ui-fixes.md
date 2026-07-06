# UI-usability iteration (2026-07-05, /loop)

Refocus on the slatebox UI as a human user; Miro as reference. Fix every broken
surface one at a time, root-cause, verify LIVE (:3000) with Playwright, persist +
two-window parity, e2e where possible. Library fixes in slateboxjs-v2; app pane
edits in the slatebox repo (approved, uncommitted/user-gated).

## Fixed
- U1 [app: LineProperties.jsx]: line-property toggles "didn't stick". Root cause:
  the pane's ToggleButtons kept LOCAL state but after onChange re-rendered the
  pane the highlight lagged the model (clicking ORTHOGONAL / Start ABSOLUTE
  updated the association + persisted on reopen, but the button didn't highlight
  immediately → felt like it didn't save). Fix: a useEffect syncs lineType /
  sourceLock / targetLock from the association's actual values on every relevant
  change. Verified live: ORTHOGONAL and ABSOLUTE now highlight immediately AND
  persist on reopen.

- U3 DONE [lib, pending commit]: the arrow now connects AT THE DROP POINT. The vendored
  onEndpointChange passed the target's CENTER as the drop point; now it captures the handle's
  release position (world coords) in attachHandleToTarget and passes THAT. Connector.pinDropAnchor
  converts the world drop point → a normalized [0,1] anchor on the node and stores it as source/
  targetAnchor (persists + renders there) on reattach (non-rotated nodes). Verified live: dropping
  the target endpoint on C's top-center → targetAnchor {0.50,0.06}, arrow endpoint at C's top edge.
  e2e connector-drop-point.

- U2 DONE [lib 9b2da5d+]: line cog + endpoint-lock toggles DRIFTED when a connected node moved
  (they're positioned at the connector geometry once; a move re-solves the line but the affordances
  stayed). Fix: applyPositionAndRotation clears the active line affordances on any node move (Miro
  hides connector UI during moves; re-click for fresh placement). Verified live: locks 2/cog 1 →
  0/0 after a move. e2e line-affordances-nodrift.
- U4 CHECKED: reload persistence WORKS via the real pane path (onChange→save); library
  serialize/deserialize round-trips lineType + sourceAnchor + arrows perfectly (loadJSON restores
  connectableType='orthogonal'). Earlier "revert" was a test artifact (direct applyLineProperty
  bypasses the save/broadcast). Not a bug.

- U5 DONE [lib, pending commit]: NODE SHAPE change didn't re-render. onNodeShapeChanged was a stub
  ("simplified implementation") that set options.shape (to the picker's raw path) but never re-drew
  → node stayed a rect. Fixes: (a) resolveShapePath now treats a raw path in `shape` as a path (was
  vectorPath-only); (b) new Node.setShape(shape, vectorPath?) removes the old shape, re-renders (named
  or raw path) behind the text, re-centers, re-binds resize/rotate; (c) Invoker.onNodeShapeChanged
  calls setShape. Verified live: picking a shape re-renders (rect → path in nested SVG); node COLOR
  swatch also verified working (blue→red). e2e node-setshape.

- U6 DONE [lib, pending commit]: NODE EFFECTS tab was empty AND inert. Two bugs: (a)
  slate.filters.availableFilters returned an array of {id}, but the app reads Object.keys(...) +
  [name].types → no effects rendered (and the v2 Slate had NO .filters at all — the facade getter
  wasn't on node.slate's path); (b) Invoker.onNodeEffectChanged was a stub. Fixes: FilterDef.types
  + getAvailableFilters() (object keyed by name w/ types); Slate.get filters() returns it (node.slate
  path); facade getter uses the same; Invoker.onNodeEffectChanged applies/removes via node.filters
  (exclusive toggle: removes prev, clears id on deselect). Verified live: EFFECTS shows dropShadow/
  blur/outline; clicking dropShadow sets DOM filter drop-shadow(...) + options.filters.vect. e2e
  node-effects.
- U7 DONE [lib, pending commit]: NODE IMAGE tab was a stub (onNodeImageChanged console.log only).
  Now applies via node.images.set(url,w,h) from the app's { img, w, h } pkg (clears on falsy img).
  Verified live: setting a data-URI image → node fill becomes url(#SvgjsPattern...) + options.image
  set; clearing restores the solid color. e2e node-image.

- U8 DONE [lib, pending commit]: SLATE BACKGROUND color/gradient/image changed options but never
  painted the container (onSlateBackgroundColorChanged / onSlateBackgroundImageChanged didn't call
  applyContainerStyle). Fix: both call applyContainerStyle(); the image handler also clears
  backgroundColorAsGradient (else the gradient branch wins in applyContainerStyle and the image never
  shows). Verified live: canvas bg → solid #ff8800, linear-gradient, then image url. e2e
  slate-background. DEFERRED: slate background EFFECT (texture) needs filters w/ types:['slate'] +
  onSlateBackgroundEffectChanged apply — SlateEffects list is empty until then. onSlateThemeChanged
  still a stub (theme apply to nodes) — larger, separate.

- U9 DONE [lib + app SlateThemes.jsx]: SLATE THEME didn't apply. Three bugs: (a) app sent
  data.theme=`mtheme` (undefined var — ReferenceError/undefined) → fixed to `theme`; (b)
  onSlateThemeChanged was a stub → now calls slate.applyTheme(theme, syncWithTheme); (c) the app's
  saved theme styles use v1 field names (nodeColor/foregroundColor) but the engine read
  backgroundColor/fontColor → applyStyleToNode now accepts both, and applyTheme paints the container
  bg via applyContainerStyle. Verified live: applying a theme recolors nodes (parent→child cycle),
  updates fills, sets fontColor from foregroundColor, paints container bg, sets themeId. e2e
  slate-theme. Remaining: slate background EFFECT (texture, needs types:['slate']) + theme vectorPath
  (app stores it as an SVGPathData object) — shape not applied via theme yet.

- LINE PANE SWEEP: verified live — line WIDTH (stroke + model), ARROWS (showParentArrow/
  showChildArrow toggle marker-start/-end), and lineType/locks/color all WORK. Only curviness broken:
- U10 DONE [lib, pending commit]: LINE CURVE slider (lineCurviness 0.01-1) did nothing — it was
  assigned directly to curveRadius (a PIXEL value), so the bezier handle max(30, min(curveRadius*2.5,
  dist*0.5)) was always clamped to the 30 floor. Fix: connectable now carries lineCurviness (0..1,
  default 0.3) distinct from curveRadius (pixels, still used by the orthogonal router); the bezier
  geometry scales the bow as a fraction of span: handle = max(20, dist*(0.12 + curviness*0.55));
  Connector create + updateConnection set c.lineCurviness (not curveRadius). Verified live: control
  point shifts 161px between curviness 0.05 and 0.95. e2e connector-curviness.

- U11 DONE [lib, pending commit]: NODE BORDER pane (width/color/style) was inert. App sends one
  {prop,val} at a time, but onNodeBorderPropertiesChanged read pkg.data.borderColor/.borderWidth
  (wrong shape) and only applied stroke COLOR via setColors (never width/dash). Fix: handler sets
  options[prop]=val and calls new Node.applyBorder() which repaints color+width+dasharray+opacity
  from options (borderStyle maps '-'/'.'/'--.' or words → dash lengths scaled by width). Verified
  live: width 9, color #ff0000, dashed 27,9, solid restore. e2e node-border. NOTE: applyBorder is a
  no-op for nested path-shape nodes (stroke is on the inner path, not backgroundRect) — edge case.

- PERSISTENCE/COLLAB SWEEP: serialize→deserialize round-trip of the new fixes. SHAPE ✅, border
  width/color ✅, EFFECT ✅ (re-applied via finishCreate for rect; on nested-path shapes the filter
  is on the nested SVG). GAP found + fixed:
- U12 DONE [lib, pending commit]: BORDER STYLE (dash) didn't survive a reload. createBackground only
  mapped 'dashed'/'dotted' words, so the app's symbol styles ('-','.','--.') produced no dasharray on
  deserialize. Fix: extracted Node.borderDashArray() (symbols+words, width-scaled) shared by
  createBackground (load path) AND applyBorder (edit path). Verified: dashed border restores as 18,6
  after loadJSON. e2e node-border (reload test). NOTE: Invoker handlers are shared by local +
  remote(collab) apply, so collab parity is covered by the same code path; late-joining peers/reload
  read the serialized JSON — now correct for these props.

- U13 DONE [lib, pending commit]: PATH-SHAPED nodes (star/diamond/etc.) couldn't be recolored or
  bordered. For vector shapes backgroundRect is the nested <svg> wrapper, but fill/stroke live on the
  inner <path>; setColors/applyBorder styled the wrapper → no-op. Fix: createBackground stores the
  inner path as node.contentPath; setColors + applyBorder target (contentPath ?? backgroundRect).
  Verified live: star node fill #ff0000, stroke #00aa00 w8 dash 24,8. e2e node-pathshape-styling.
  (Effects already worked on path shapes — filter sits on the nested SVG.)

- COLLAB PARITY VERIFIED [durable e2e]: two-window test (A edits → B observes, isolated contexts,
  yjs websocket relay). Confirmed live on :3000 AND added to the standalone collab-surfaces matrix:
  onNodeShapeChanged, onNodeBorderPropertiesChanged, onNodeEffectChanged all sync A→B (shape
  re-render, border stroke, effect filter). The Invoker handlers are the shared local+remote apply
  path, so every fix (U5/U6/U11/U13...) rides the same proven pipeline. No lib change this iteration.

- SLATE BG EFFECT (texture): NOT A BUG — no v1 filter is tagged types:['slate'], so the pane is
  empty in v1 too (vestigial). Nothing to port.
- U14 DONE [lib, pending commit]: NODE TEXT font controls (size/color/family/alignment) were inert.
  onNodeTextChanged set font options AFTER setText and never re-rendered the <text>. Fix: set options
  FIRST, then setText (only if text present), then new Node.applyTextStyle() re-applies
  font({family,size,fill,opacity}) + centerText (alignment). Verified live: size 30, color #ff0000,
  family Georgia, left-align shifts x 110→5. e2e node-text-style.

- U15 DONE [lib, pending commit]: NODE OPACITY (color pane slider) was inert. onNodeColorChanged set
  options.opacity but never applied it. Fix: new Node.applyOpacity() pushes options.opacity onto the
  shape element (contentPath ?? backgroundRect), matching createBackground's load path; handler calls
  it. Verified live: opacity 0.35 applies AND persists across reload. e2e node-opacity.

- REGRESSION SWEEP: full chromium e2e after the 15 fixes → 167/170; the 3 failures were PRE-EXISTING
  (fail identically against the pre-session dist) — zero regressions from U1-U15.
- U16 DONE [lib, pending commit]: BIRDSEYE minimap didn't reflect node ROTATION on the incremental/
  load paths (updateNodePosition + addNodeShape only moved shapes). Fix: new applyShapeRotation()
  applies the node's rotationAngle as an absolute transform about the shape center, called from both.
  (The end-of-rotate full-refresh already handled it; this covers add/load of pre-rotated nodes.)
  Verified live: minimap shape gets matrix(0.707...) = rotate(45).
  Also fixed the 3 pre-existing red tests: connections-comprehensive (asserted toBeVisible on an
  intentionally-invisible hitarea → toBeAttached); birdseye-rotation x2 (rewrote fragile handle-drag
  → engine-API rotation + assert minimap reflects it). Full suite now 170/170 green.

- CAPSTONE (real-UI, integrated): built a styled flowchart on :3000 — Start(rect,blue) →ortho→
  Process(STAR, green, dashed dark-green border), Start →bezier(curviness .85)→ Decision(circle,
  orange, dropShadow). All fixes compose correctly; birds-eye reflects all 3 nodes; 2 connectors,
  no rogue paths. Real font-size DROPDOWN verified end-to-end (14→20 via the actual MUI Select →
  onNodeTextChanged → applyTextStyle). Confirms the app pane→package→handler chain, not just the
  invoker.
- U17 INVESTIGATED — NOT A BUG: deselect appeared to leave connection handles, but the clean repro
  shows 0 VISIBLE handles after deselect (stable across repeated cycles). The DOM count includes
  HIDDEN handles — the handle container is .hide()'d (perf), not removed. No fly-aways. The capstone
  screenshot's dots were a timing artifact (deselect hadn't settled before the shot).

- U18 DONE [lib, pending commit] (USER-REPORTED): arrowhead TIP buried inside the target node. The
  marker was anchored at its BASE (refX=0 for target, refX=arrowWidth for source — reversed), so with
  markerUnits=strokeWidth the tip overshot ~arrowWidth*strokeWidth PAST the endpoint into the node.
  Fix: anchor at the TIP — refX = isSource ? 0 : arrowWidth (target tip at x=arrowWidth, source tip at
  x=0). Verified live: arrow point now sits exactly on the node's edge ("just touching"). e2e
  connector-arrowhead-tip; perpendicular + drop-point regressions green.

- INTERACTION SWEEP (real mouse): drag (from anywhere incl. text) ✅, resize handle (node + rect +
  text re-center) ✅, double-click inline text edit (textarea) ✅, connectors follow, no fly-aways.
- U19 DONE [lib, pending commit]: UNDO/REDO was entirely dead — UndoRedo.snap() was called NOWHERE in
  the codebase, so the stack stayed empty (Ctrl+Z bound but nothing to undo). Fix: Slate.broadcast()
  auto-records a snapshot on state-mutating changes (view/presence types excluded via NON_UNDOABLE);
  initial baseline on init + after loadJSON; debounce 3000→500ms; undo() flushes any pending snap
  first; takeSnapshot guarded against pre-construction serialize. Verified live: drag→Ctrl+Z reverts,
  Ctrl+Shift+Z redoes (restore is a full async deserialize, ~1s). e2e undo-redo-autosnap (auto-record
  + zoom excluded); existing undo-redo.spec green.

- INTERACTION SWEEP cont.: delete key ✅ (+ toolbar delete ✅), double-click edit ✅. Multi-select
  was broken →
- U20 DONE [lib, pending commit]: rubber-band MULTI-SELECT was broken by THREE issues. (1) panButton
  was 0 (left mouse) so left-drag PANNED while also rubber-banding — changed default to 1 (middle
  mouse); left-drag now selects, pan via middle/trackpad/wheel (custom wheel handler unaffected). (2)
  selectNodesInRect compared the world-space rect against node.svgGroup.bbox() (LOCAL ~0,0,w,h) →
  never overlapped; now uses node.options world coords. (3) pointermove/up were on the canvas → pointer
  capture stole them; moved to window listeners bound during the drag. Verified live (real mouse):
  rect grows + selects the boxed nodes. e2e multi-select; MultiSelection unit tests reworked for the
  window-listener model (1065 unit).

- U21 DONE [lib, pending commit]: GROUP MOVE — dragging one node in a multi-selection only moved that
  node. Node drag now captures the other selected nodes' positions on dragstart (_groupDragSiblings)
  and shifts them by the same delta on dragmove + dragend; dragend broadcasts onNodesMove with ALL
  moved nodes (sync/persist/undo). Verified live: select 2 → drag one → both move by the same delta.
  e2e node-group-move.

- U18b DONE: arrow tip now touches the node edge exactly (removed the ~19px endpoint offset that
  double-counted after U18 made the arrow tip-anchored). Gap 17px → 0.

## NODE AI-TEXT merge order fixed (collab replay audit)
- Found by auditing every Invoker handler for the link-bug class (whole-pkg / wrong-field). Only real
  hit besides links: onNodeAITextChanged merged { ...pkg.data.ai, ...node.options.ai } — EXISTING won
  over NEW, so re-setting an AI field was ignored and a remote peer never picked up another client's AI
  change (backwards vs onSlateAISet, which lets new win). Fixed to { ...node.options.ai, ...pkg.data.ai }
  (new wins, untouched fields preserved). Unit test added (update-same-field). AI needs the backend to
  live-drive, so the unit test is the guard. Rest of the ~40 handlers audited clean. 1075 unit / 186 e2e.

## Connector arrowhead OVERSIZED (Miro parity) — fixed
- Screenshotting the reconnect fix surfaced that arrowheads render as giant triangles (~10× the line
  width). Root cause in vendored markers.js: marker used markerUnits="strokeWidth" (rendered =
  markerWidth × strokeWidth) while markerSize ALSO scaled with strokeWidth (strokeWidth*3+6) — a
  double-scale. For a 6px line the head was ~50px+. Fix: markerUnits="userSpaceOnUse" + markerWidth=
  arrowWidth (absolute px = markerSize), so the head is a sensible size (~24px on a 6px line = 4×,
  Miro-like) that still grows modestly with thicker lines via markerSize. Verified live (screenshot):
  slim proportional head on the edge, pointing in. e2e arrowhead-size.spec.ts. 1076 unit / 195 e2e.

## RECONNECT arrowhead detached/inverted + not following — fixed (user repro)
- User: disconnected + reconnected an association endpoint; the arrowhead ended up detached/inverted
  (floating outside the child) and the line didn't track the child on drag. Root cause: on reconnect,
  handleEndpointChange→pinDropAnchor pinned the TARGET endpoint at the exact interior drop point
  (normalized [0,1], clamped). An interior anchor (e.g. drop near center → {0.5,0.5}) put the arrowhead
  INSIDE the node and made the connectable's edge-solve disagree with the pinned arrowhead → a
  detached/inverted arrow that didn't sit cleanly on the edge. Fix: snap the drop-point anchor to the
  NEAREST EDGE (project x or y to 0/1 by smallest distance) so the arrowhead sits ON the boundary
  (touching, on the side the user dropped) and the line + arrowhead agree; it's a relative anchor so it
  follows the node. Verified live: reconnect → arrowhead on edge (nx/ny at boundary, on drop side) +
  follows on drag. e2e reconnect-edge.spec.ts. 1076 unit / 194 e2e.

## getRotation warning noise on shape-add eliminated
- Adding a shape logged two "NODE_DEBUG: Failed to read svgGroup/backgroundRect transform for rotation"
  warnings each time. Cause: the save (serializeNode → getRotation) can run while the node is still
  mid-async-creation, so svgGroup/backgroundRect are undefined → transform() throws → warn. Non-fatal
  (getRotation returns 0, and options.rotate is the real source) but noisy. Guarded existence
  (`if (this.svgGroup)` / `if (this.backgroundRect)`) before calling transform(), so the expected
  "not ready → rotation 0" case doesn't warn. Verified live: shape-add now logs 0 warnings. 1076 unit.

## SHAPE PALETTE add threw "node.position is not a function" (v1-compat gap)
- Found by noticing elevated console errors when adding a shape from the palette. The app
  (QuickNodeActions.jsx) does `new Slatebox.node(opts)` → `slate.nodes.add(node)` → `node.position('center')`
  to center a newly-added node in the viewport. The v1-style facade node (compat-facade.ts) had png/svg/
  resize/relationships but NO position() → uncaught TypeError on every shape add, and the intended
  centering never happened (nodes appeared at a default spot). Fix: added node.position() to the facade —
  `position({x,y})`/`position(x,y)` sets position (stashes on options before add), `position('center')`
  centers the node in the current viewport (computed from the SVG viewBox). Verified live: no error +
  new shapes land at the viewport center (distFromCenter 0). Unit test in compat-facade.test.ts.
  1075 unit / 192 e2e.

## NODE LINKS — piece 1: badge indicator + navigate wiring (feature completion)
- Node links were an INCOMPLETE feature: set/persist worked but navigate() was never called (clicking a
  linked node did nothing) and there was no visual indicator. Piece 1 (library-only): Node.updateLinkIndicator()
  renders a Miro-style "↗" badge (top-right, inside svgGroup so it tracks the node) when options.link.show +
  link.data is set; clicking it calls Links.navigate() → window.open(link.data). Links.set/unset refresh the
  badge. Canonical link target field is NodeLinkOptions.data (NOT .url). Raw <text> for the glyph (SVG.js
  text() wraps a tspan that ignores x/y). Verified live: badge renders centered, click opens the URL, persists
  through reload; unset removes it. e2e node-link-badge.spec.ts. 1075 unit / 190 e2e.
- Piece 2 (app @fd36c5a): NodeDrawer Link tab (index 13, gated on basedOnTemplate) + URL dialog →
  onNodeLinkAdded {link:{show,type:'url',data}} / onNodeLinkRemoved. Verified live: link tab → dialog →
  Save → badge → survives reload.
- Piece 3 (library): whole-node click-to-follow in READ-ONLY/view mode (slate.isReadOnly) — in edit mode
  the badge is the follow affordance so a normal click still selects/edits. e2e covers both modes.
- REMAINING (optional): slate-to-slate nav events (currentSlate/externalSlate types only console.log).

## NODE LINK corruption on reload / collab fixed
- Found by driving the library node-link API (app has no link UI yet). Setting a URL link persisted
  locally, but after reload options.link held the ENTIRE collab envelope
  ({type:'onNodeLinkAdded', data:{id, link:{…}}, clientID, timestamp}) instead of the link options.
  Root cause: Invoker.onNodeLinkAdded passed the whole pkg to links.set() (which expects the link
  options) — so the collab receive/replay path stored the envelope as options.link and corrupted it.
  Fix: extract pkg.data.link (matches Links.set's broadcast shape) + guard when absent. Also fixes
  remote-peer link sync (a peer's link corrupted the receiver). Verified live: set link → reload →
  options.link is the clean {show,type:'url',url,target}. Unit (Invoker onNodeLinkAdded) + e2e
  node-link.spec.ts. 1074 unit / 186 e2e. NOTE: app has no node-link UI — library is correct now;
  exposing it is app-side feature work.

## ENDPOINT LOCK Absolute→Relative REVERT fixed (named bug 2 — real root cause)
- Found via real-user pane testing (API tests missed it). Clicking the Absolute endpoint-lock button
  persisted, but toggling BACK to Relative reverted to Absolute after reload. Root cause: the collab
  doc (yjs collabMap) ACCUMULATES packages and is replayed on reload; it kept BOTH the old
  {sourceLock:absolute} and new {sourceLock:relative} package, and replay order (not recency) decided
  the winner → the stale Absolute re-applied. DB/serialization was correct (sourceAnchor null); the
  replay re-introduced the anchor. Fix: Collab.send prunes superseded onLinePropertiesChanged packages
  matching the same (node id, associationId, prop) before adding the new one — so replay applies only
  the latest value. Same mechanism as the delete-prune fix. Also hardens lineType/lineColor/lineWidth
  toggles against repeated changes. Verified live: Absolute→Relative→reload STAYS relative + pane
  reflects it. Unit test Collab.test.ts (supersede); e2e unchanged. 1073 unit.

## ALIGN + DISTRIBUTE added (Miro parity)
- Slate.alignNodes(mode, nodes?) — align a multi-selection to its shared bounding box (left / centerH /
  right / top / middle / bottom). Slate.distributeNodes(axis, nodes?) — even the gaps (horizontal /
  vertical, 3+ nodes). Both broadcast onNodesMove → persist + sync. Surfaced in the context menu: for a
  2+ selection a divider + 6 align items appear; 3+ adds 2 distribute items. IMPORTANT: the menu
  snapshots the selection at open() (this.targetNodes) and all actions use it — a real-mouse right-click
  collapses a multi-selection on pointerup, which would otherwise make align/duplicate/delete a no-op.
  Verified live: right-click a node in a 3-selection → Align left → all share min-x + persists. e2e
  align.spec.ts (logic + menu-click + snapshot robustness). 1073 unit / 184 e2e.

## RIGHT-CLICK CONTEXT MENU added (Miro parity)
- Right-clicking a node had no useful menu. Added ContextMenu.ts (isolated class, wired in Slate,
  exported + window global): a positioned HTML overlay with Bring to front / Send to back / Duplicate /
  Delete. Right-click selects the node (keeps an existing multi-selection) + opens the menu at the
  cursor; each item calls a node op that broadcasts (toFront/toBack, addNode for duplicate, removeNode
  for delete) so it persists + syncs. Dismiss on outside pointerdown / Escape / item-click; repositions
  if off-screen. Verified live: menu shows 4 items; Duplicate 1→2, Delete removes + persists,
  bring-to-front reorders. e2e context-menu.spec.ts. 1073 unit / 182 e2e.

## Z-ORDER keyboard shortcuts added (Miro parity)
- Z-order (bring-to-front/send-to-back) worked at the model level (node.toFront/toBack broadcast
  onNodeToFront/onNodeToBack; Invoker applies them on the collab-receive side; persists via serialize
  order) but had NO user trigger. Added Ctrl/Cmd+] = bring to front, Ctrl/Cmd+[ = send to back in
  Keyboard.ts (for the selection). Verified live: Ctrl+] moves a node on top, Ctrl+[ behind, survives
  reload. e2e z-order.spec.ts asserts DOM reorder + onNodeToFront/onNodeToBack broadcasts. Help text
  updated (also documents Ctrl+C/V/D). 1073 unit.

## ARROW-KEY NUDGE persistence FIXED
- BUG: selecting a node + pressing arrow keys moved it (Keyboard.nudge, 5px), but it did NOT persist —
  on reload the node snapped back. Root cause: nudge() called node.position() but never broadcast, so
  the host never saved it (a drag persists because dragend broadcasts onNodesMove). FIX (lib
  Keyboard.ts): after nudging, broadcast onNodesMove (same package as drag-end,
  {nodeOptions:[v2NodeToV1(...)]}), DEBOUNCED 250ms so holding an arrow key batches into one save.
  Verified live: nudge 4 right/3 down (20,15) → reload → position kept. e2e keyboard-nudge.spec.ts.
  1073 unit.

## UNDO/REDO FIXED (undo was a no-op after a debounced change)
- BUG: after a debounced change (move/resize etc. via the engine broadcast path), Ctrl+Z / undo() did
  NOTHING (node stayed moved; delete not restored). Root cause: the debounce callback in
  UndoRedo.snap() never nulled this.debounceTimer after firing, so undo()'s first line
  `if (this.debounceTimer) this.forceSnapshot()` ran and pushed a DUPLICATE snapshot of the current
  state; undo() then popped one dup and "restored" the still-current state — a no-op. (Isolated it:
  loadJSON/deserialize restore works fine; the snapshots were correct [10000,10300]; the stack
  management was wrong — debouncePending stayed true after the auto-snap fired.) FIX (lib
  UndoRedo.ts): the debounced setTimeout nulls this.debounceTimer BEFORE takeSnapshot. Verified live:
  move→Ctrl+Z restores (10150→10000), Ctrl+Y redoes, delete→Ctrl+Z restores the node. e2e
  undo-redo.spec.ts "undo restores a debounced move (no duplicate-snapshot no-op)". 1073 unit.
  (Also tried a takeSnapshot dedupe but it broke 8 unit tests that rely on identical snaps growing the
  stack; the timer-null is the true root-cause fix, kept it minimal.)

## DELETE-PERSISTENCE FIXED (deleted nodes came back on reload)
- BUG: deleting a node (Delete key) removed it locally + cleaned up its connector (no rogue line), and
  the Slates DB was correctly saved without it (exportJSON excludes it; slates.update $sets the full
  slate). BUT after reload the node + its connector CAME BACK. Root cause: the yjs collab doc
  (collabMap) accumulates every package and is replayed on reload/sync — the deleted node's earlier
  onNodeAdded got re-applied, recreating it. FIX (lib Collab.ts): send() of onNodeDeleted prunes that
  node's add/change packages from the collabMap (keeps the delete tombstone), so the replay can't
  recreate it. Verified live: delete a connected node → reload → node + connector stay gone
  (nodeCount 1, connLines 0). Unit test Collab.test.ts "prunes a deleted node's add/change packages".
  1073 unit.

## COPY/PASTE/DUPLICATE implemented (Ctrl+C/V/D) + rotation verified
- Node ROTATION (rotation handle, arc drag): rotates the node (getRotation reflects the angle, group
  transform gets rotate(angle …)), and PERSISTS through reload (98° before+after). Verified live.
- NEW FEATURE (lib): copy/paste/duplicate keyboard shortcuts were unimplemented (Ctrl+C/V/D did
  nothing). Added to Keyboard.ts: Ctrl+C copies selected nodes to an internal clipboard (option
  snapshots, minus id + relationship arrays), Ctrl+V pastes them offset +20,+20 with fresh ids, Ctrl+D
  duplicates the selection in place. Copies inherit paintable options (shape/color/etc.) and are
  selected after creation. addNode() broadcasts onNodeAdded, so copies persist + sync to collab like
  any added node. Verified live: Ctrl+D 1→2 (pink color copied, offset), Ctrl+C/V 2→3, all survive
  reload. e2e tests/e2e/copy-paste.spec.ts. 1072 unit.

## MULTI-SELECT group-move FIXED (real-mouse trailing click wiped selection)
- Node RESIZE (interactive handle drag): verified — resizes to the dragged size, no fly-away (x/y
  anchored), persists through reload.
- BUG (fixed, lib): rubber-band multi-select worked, but dragging a selected node did NOT group-move
  the others — only the dragged node moved. Root cause: a REAL-mouse rubber-band ends with a `click`
  on the canvas (down+up on the same element); Slate's canvas-click handler deselects on empty-space
  clicks, so it cleared the selection the instant it was made. The node-drag then re-selected only the
  pressed node (Node dragstart: if not currently selected → selectNodes([this])). The synthetic-event
  multi-select e2e never fired that click, so it was invisible. FIX: MultiSelection stamps
  slate._rubberBandSelectedAt on selection; the canvas-click handler skips the deselect for 400ms after
  a rubber-band. Verified live: rubber-band selects A+M2 (persist), dragging A moves A+M2 by the same
  delta, M3 stays. e2e multi-select.spec.ts gained a "trailing canvas click does not wipe the
  rubber-band selection" test. 1072 unit.

## NODE BORDER + PLUG-DRAG-CONNECT verified; CHAT-OVERLAY bug found
- NODE BORDER (COLOR tab): border style (solid/dashed/dotted/combo) + width work + persist through
  reload. NOTE: border controls are DISABLED until you toggle the Background→Border mode button (by
  design). Once in Border mode: dashed applies (stroke-dasharray "3,1"), label updates to
  "BORDER: DASHED", survives reload. Guarded already by node-border.spec.ts. Not a bug.
- PLUG-DRAG-CONNECT (Node.startConnectDrag, G3): pressing a selected node's plug tool and dragging to
  another node DOES create the association — VERIFIED live when the target is in the clear canvas area
  (rubber-band preview follows, drop → addAssociation, connCount=1). The interaction relies on
  document.elementFromPoint(...).closest('[data-node-id]') to find the drop target.
- CHAT-OVERLAY BUG (app) — FIXED (slatebox 5b354a8): the AI chat is a floating 320x420 bottom-right
  <Paper> (Chat.jsx, zIndex 6, pointer-events auto), and Canvas had a "hook to always open chat" that
  force-opened it on every slate load — covering the bottom-right canvas so nodes there failed
  elementFromPoint (hit the MuiGrid, not the SVG) and couldn't be selected / drop-connected. Removed
  the force-open effect; isChatOpen default:false. Chat now opens on demand (toolbar Chat icon, or real
  AI activity via AdHocAINodes / CanvasAIIntentionsDialog / initAIConversation). Verified live: chat
  closed on load, a bottom-right node hit-tests to SVG, plug-drag-connect to it succeeds (connCount 1),
  and the toolbar Chat icon opens+closes the chat. Library plug-connect guarded by
  tests/e2e/plug-connect.spec.ts (green).

## NODE PANE (TEXT+EFFECTS) + COLLAB PARITY — VERIFIED CLEAN
- Node TEXT tab: changing font family (Roboto→Bangers) applies, the active-font highlight moves, the
  <text> renders in the new font, and it survives RELOAD. Node EFFECTS: DropShadow toggle applies a
  filter, selects the button, and persists through reload. Node pane reads live node.options → no
  stale bug.
- COLLAB PARITY (two Playwright tabs on the same canvas, collab active): node ADD + node COLOR sync
  live to the 2nd window; LINE TYPE (orthogonal) syncs too — via the real pane path
  onUpdateNode→collab.invoke+send, peer applies through Invoker.onLinePropertiesChanged. KEY: the
  package MUST carry data.id (packageUp adds node.options.id); a package without it is dropped by the
  peer (nodes.one(undefined)→null). Earlier "not syncing" reads were malformed test packages (no id),
  not a bug.
- Durable guard: Invoker.test.ts "onLinePropertiesChanged (collab apply)" — a remote {id, associationId,
  prop, val} routes to applyLineProperty; a package missing id is a no-op. 1072 unit.

## LINE PANE — 2 more bugs fixed: controls reachable + Arrow Heads reflect
- CLIPPING (app slatebox 996ed7e): the bottom LineDrawer paper was a fixed height:250px, so the Width
  slider + Arrow Heads toggles overflowed BELOW the viewport (y~1021 on a 943px screen) — unreachable.
  Sized the paper to content (minHeight 250 / maxHeight 55vh / overflowY auto). Verified: both controls
  now render on-screen + clickable.
- ARROW-HEADS REFLECTION (app slatebox 04c527b): the parent/child toggles derived state from
  node.options.parentArrowForChildren (a v1 concept the v2 lib never maintains), so toggling rendered
  the arrow but the button never showed selected + reopen showed wrong state. Now derives from the
  association's showParentArrow/showChildArrow (what the lib renders+persists) + re-syncs in the assoc
  effect. Verified live: click Parent → arrow renders AND button selects; reopen reflects.
- Library guard: Relationships.test.ts asserts applyLineProperty persists showParentArrow/showChildArrow
  on the record. 1070 unit.

## NODE PANE mined — VERIFIED CLEAN (shape + color persist through reload)
- Drove the node pane live (select node → cog → SHAPE/COLOR tabs). Picking a path shape and a preset
  color both apply, persist, and survive a full page RELOAD (DB round-trip). The node pane reads the
  LIVE node.options (passes the real Node by reference), so it does NOT have the stale-snapshot revert
  bug that hit the line pane — confirms that bug was isolated to the line pane's captured association.
- Durable guard: tests/e2e/serialization.spec.ts "node shape (path) + color survive a serialize→load
  round-trip" — reloads exported JSON into a fresh slate and asserts the star path + #f44336 come back
  and render as a <path data-shape-path>.

## NAMED BUGS 1/2/3 FIXED: line-pane toggles stick + save + survive reload
- (1) Line Type BEZIER↔ORTHOGONAL didn't stick; (2) Start/End ABSOLUTE↔RELATIVE didn't save; (3)
  lock toggles drifted — ALL one root cause, app-side. Canvas.jsx captured the `association` snapshot
  ONCE at cog-click (onLineMenuRequested) and never refreshed it; after a toggle the model updated but
  LineProperties' re-seed effect REVERTED the button to the stale snapshot value.
- FIX (app repo slatebox, committed 417bec1): Canvas.updateLine re-fetches the updated association and
  setLineDrawer({...prev, association: fresh}); LineProperties syncs toggles from the association's live
  VALUES (lineType/sourceAnchor/targetAnchor). Verified live: click updates button+model instantly;
  Start/End locks save; fresh reopen AND full page RELOAD both show the exact set state (orthogonal +
  End=absolute, targetAnchor persisted). No drift.
- Library guard (slateboxjs-v2): tests/unit/Relationships.test.ts "applyLineProperty (line-pane state
  contract)" — asserts lineType / targetAnchor / targetLock persist on the association record (the data
  the pane reads). 1069 unit.

## BIG ITEM (user-requested 2026-07-XX): render ALL shapes as PATHS
- Legacy rendered everything (rects, circles, etc.) as <path> — more adaptive/customizable than native
  <rect>/<circle>, and connectors compute against real path geometry. svg.js has full path support.
- Current v2: named/vector shapes already render as <path> in a nested svg (U5/U13 handle contentPath
  fill/stroke/border). But the DEFAULT rect/circle/ellipse still use native SVG elements
  (createBackground "native shapes fast path").
- PLAN (multi-iteration): route rect/circle/ellipse through the path branch too (equivalent path data),
  unify styling on contentPath, verify: fill/border/opacity/effect, resize/rotate handles, connector
  edge geometry (getClosestPointOnEdge should use the path), selection bbox, serialize round-trip,
  reload, collab. Use svg.js conventions; keep the isolated-class pattern. Risk: wide surface — do it
  behind careful e2e coverage, one shape family at a time.

## PATHS — step 1 DONE: connectors attach to the real path outline
- First concrete step of the "everything as paths" vision: connectors now target the ACTUAL vector-
  path outline (star arms, diamond edges, etc.) instead of the bounding box. createBackground tags the
  shape <path> data-shape-path; geometry.closestPointOnPathOutline samples it (path screenCTM → root
  user space) and picks the outline point aligned with the ray toward the other node. Native rect/
  circle/ellipse keep their exact math. SAFE: guarded + falls back to the bbox intersection, so the
  connector never breaks. Verified live in-app: connector into a star lands ON the outline (dist 0) at
  a point 47px OFF the bbox corner (diagonal target). e2e connector-path-outline (wiring + no-fly-away;
  precise outline attach is CTM-dependent so verified live, not in headless).
- PATHS step 2 ATTEMPTED + REVERTED: converted the default rect to a rounded-rect <path> (drawn at
  actual size, regenerated on resize via setSize→attr('d') to keep constant corners — resize routes
  through setSize, so that part worked; unit suite passed). BUT the full e2e suite failed ~9 tests:
  connector-edge-pin, connector-floating-endpoint, connector-follows-rotation, line-properties (type
  re-render+persist), node-border reload, node-opacity reload, node-setshape. The default node's
  backgroundRect being a <path> instead of a Rect broke code that assumes Rect + the serialize/reload
  + shape-change + connector-pin paths. Reverted per the full-suite gate. LEARNING: converting the
  DEFAULT shape is a wide, multi-subsystem change — needs a dedicated effort touching setSize,
  serialize/deserialize (shape round-trip), setShape re-render, connector edge-pin/rotation, and
  opacity/border reload TOGETHER, each with its own e2e. Not a single-iteration change. The connector-
  outline (step 1) already delivers the visible "adaptive paths" benefit for picked path shapes;
  default-shape conversion is lower value / higher risk and should be scoped as its own project.
- ABSOLUTE-ANCHOR + DRAG: re-verified with a REAL mouse drag on a clean single connection — the pinned
  endpoint STAYS at the same relative point (relX 0.39 before/after) with the anchor preserved. Works.
  Could not reproduce the user's detach; awaiting exact repro (likely multi-connection or a specific
  pin method).

## OPEN (user-reported): absolute-anchor endpoint + node drag
- User: pinning the arrow at a point (absolute anchor) works initially, but dragging the node after
  "doesn't update the association correctly" (endpoint detaches). Investigated: on a CLEAN single-
  connection slate, the pinned endpoint follows the node exactly (programmatic move → endpoint moves
  by the same delta; con.targetAnchor set correctly via setEndpointLock). Could NOT reproduce the
  detach in isolation — my multi-run slate had 3 overlapping connections which confounded it. NEXT:
  reproduce with the exact user flow (drop-pin via U3, or the on-canvas padlock, then a REAL mouse
  drag) and check whether the drag rewrites/loses the anchor on the association (persist/collab path).

## Backlog (from user, this loop)
- U3b (was U3, done): the END OF THE ARROW should ALWAYS connect exactly at the DROP POINT on a
  node (dropping an endpoint should pin the connection there, not snap to the
  nearest edge midpoint).
- U4: RELOAD persistence — confirm lineType + anchors survive a page reload (and
  whether a guest slate persists at all).
- (ongoing) click every control in node pane / line pane / toolbars / cogs /
  anchors; verify state saves + survives reload + syncs two-window. Miro parity.

App files touched: imports/ui/components/line/LineProperties.jsx.
