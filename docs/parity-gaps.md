# Legacy-vs-new parity gaps (2026-07-02)

Mine gaps by comparing the **legacy production app** (app.slatebox.com — Raphael-era slatebox)
against **our build** (slatebox Meteor app on :3000 using slateboxjs@3 / SVG.js). Work them
ONE AT A TIME with the standard cycle: npm test (1063), npm run build, pack→install into the
Meteor app (rm -rf .meteor/local/bundler-cache, restart :3000), verify LIVE two-window with
Playwright, add a durable e2e, commit.

## Comparison pattern (how to look at differences each iteration)
1. Legacy: Playwright → https://app.slatebox.com → "Got a story to tell" onboarding
   (Personal Use → Other → pick a suggestion) lands on /canvas/<id> with a "Welcome!" node +
   AI chat. Dismiss the cookie "I understand".
2. Interact + screenshot the legacy behavior for the feature under study (select node, select
   line, drag-to-connect, resize, rotate, context toolbar, etc.).
3. Our build: :3000 guest slate (START NOW → NEW) — same interaction, screenshot.
4. Diff the two; the delta is the gap. Record it here, then close it.

## Known gaps (from user + first legacy pass)
- **G1 — Node context toolbar.** Legacy: selecting a node floats a compact horizontal toolbar
  CENTERED ABOVE the node with [delete(trash)] [plug] [cog] [ + add-connector ]. Ours: a single
  cog pinned at the node's top-right. TODO: replace the lone cog with a small toolbar above the
  node: **delete + plug + cog** (DROP the "+" add-connector — we have connection anchors now).
- **G2 — Line context toolbar.** Legacy: selecting a line shows [delete] [cog] [plug]. Ours:
  just a cog at the line midpoint. TODO: make it a small toolbar: **delete + cog + plug**.
- **G3 — Plug drag-to-connect.** Legacy: press-and-hold the plug icon → it becomes a line you
  drag onto another node to connect. Ours uses connection ANCHORS (blue dots) for drag-to-
  connect. TODO: verify our anchors do press-drag-connect; wire the plug icon to start the same
  connector drag (so both affordances work).
- (ongoing) Keep mining: node/line delete parity + collab, theme palette, presentation mode,
  etc. — add rows as found.

## Presentation mode (user-selected focus, 2026-07-02)
Legacy has a top-bar PRESENT button that steps through the slate (uses the underlying raw SVG).
Our local app top bar has NO PRESENT button; the library Presentation class existed but was BROKEN.
- P1 DONE [pending commit]: fixed Presentation.goToStep — it used a LOCAL bbox + hardcoded 400/300
  center + wrong pan/zoom order, leaving the focused node ~13-15k px off-screen. Now uses the node's
  WORLD center (options.x/y + w/2,h/2), zooms first, then sets the viewbox origin to center it.
  Verified live: start/next center each node exactly (dx=dy=0). e2e presentation-step.
- P2 DONE [lib getter pending commit; app edits uncommitted]: added the app PRESENT button (top bar)
  + a modern control pill (‹ step/total › ✕) + keyboard (→/space next, ← prev, Esc exit). Library:
  facade now exposes a public `presentation` getter. KEY GOTCHA: the app's `currentSlate` recoil atom
  holds a SERIALIZED slate (exportJSON), NOT the live facade — so the app reaches the live v2 slate via
  window.__slateboxInstances (last instance) for .presentation and .fit(). Verified live: PRESENT →
  control bar 1/3, Next + ArrowRight center Welcome→Two→Three, Esc exits + fits back.
  App files (uncommitted/user-gated): Main.jsx.
- P3 DONE [pending commit]: smooth step transitions. goToStep now TWEENS the canvas viewbox
  (easeInOutQuad, ~450ms) from current → target (node-centered at zoomLevel) via rAF instead of an
  instant jump; cancels any in-flight tween on a new step. Pass duration 0 for instant (tests).
  Verified live: viewbox X moves gradually 9693→10001→11080 during a Next (animated), lands centered.
  e2e presentation-step covers centering + the animation (mid-flight viewbox strictly between).
  PRESENTATION MODE COMPLETE: P1 engine centering + P2 app UI (button/controls/keyboard) + P3 tween.
  Step ORDER = _presentationIndex else position (top-to-bottom, left-to-right) — matches legacy's
  reading order for a typical top-down mindmap; revisit if a specific slate needs custom ordering.

## AI-driven presentation ordering (2026-07-03) — WORKING end-to-end
Reuses the ORIGINAL pipeline (not the made-up position sort):
1. lib [6eb2ee1]: Presentation.extractPresentationLayout() → hierarchical preziData (root→children
   + rotation/content-relative bbox/description); setStepOrder(nodeIds) applies an explicit order.
2. app (uncommitted/user-gated): Main.jsx presentation build effect calls the EXISTING openai.chat
   Meteor method (processImmediately) with the preziData, asking for {"order":[nodeId,...]}; parses
   req()'s {json:{order}} and setStepOrder()s it (falls back to default layout order on any failure).
   server/methods/openai.js: threads opts.engine through the processImmediately req() call so a
   CURRENT model can be used (the historical default gpt-3.5-turbo-16k-0613 is deprecated → was
   erroring). App call uses engine:'gpt-4o-mini' (reuses the same req/provider plumbing + keys).
Verified live: server log shows gpt-4o-mini returned {"order":[Overview,Marketing,Engineering,
Conclusion]} for a hierarchical slate; the fullscreen modal stepped in that AI order (≠ position
default). Engine reused (isolated read-only slate, zoom/pan-to-node, smooth tween).
App files changed: imports/ui/Main.jsx, server/methods/openai.js.

## Batch 2026-07-02 (user) — COMPLETE (PRES + Q1-Q4)
PRES [568f5e3] fullscreen modal + isolated read-only slate, steps all nodes, clean view.
Q1 [d2a6efa] arrowheads over nodes during drag. Q2+Q3 [6874923] line plug dropped + endpoint lock
toggles baked in. Q4 [f9c2900] birds-eye animates. 13 new-feature e2e green; 1063 unit.

## Batch 2026-07-02 (user) — iterate until PRESENTATION works end-to-end
- PRES DONE [lib pending commit; app Main.jsx uncommitted]: presentation is now a FULLSCREEN MODAL
  ("<Name> - Presentation" header + X) rendering an ISOLATED read-only slate (exportJSON → fresh
  Slatebox instance in #presentCanvas), stepping through EVERY node in order with smooth zoom/pan.
  Fixed the "one node" issue (real stepping through all). Library cleanups so the view is clean:
  goToStep no longer selects the node (no edit toolbar/handles/anchors in presentation), and the
  dev coordinate readout is gated behind options.showCoordinates (hidden by default). Verified live:
  header + 3/3 nodes render, Next/ArrowRight center Welcome→Two→Three, Esc/X destroys the slate;
  no toolbar/handles/debug-coords. NEXT: Q1-Q4.
- PRES (priority): presentation must work END TO END. Legacy = a FULLSCREEN MODAL ("<Name> -
  Presentation" header + X close, image #12) that steps through ALL nodes with smooth zoom/pan.
  Ours currently "just goes to one node." Make it a fullscreen presentation experience that steps
  through every node in order; fix the one-node bug. OG v1: controller.present() runs per-node
  operation sequences (zoom/position); extractPresentationLayout orders nodes.
- Q1: connector arrowhead gets pushed BEHIND the node while DRAGGING — keep markers container on top
  during dragmove (M4 held on connect/create but not during drag).
- Q2: LINE toolbar plug button "doesn't do anything" — make it meaningful or drop it.
- Q3: bake endpoint locking into the LIBRARY — when the line cog is clicked, show a small
  lock/relative ICON next to EACH endpoint (start + end); clicking toggles absolute/relative
  (setEndpointLock). Visual L5 on-canvas (in addition to / instead of the pane toggle).
- Q4: birds-eye should ANIMATE when nodes change (move/add/remove) instead of snapping.

- Q1 DONE [d2a6efa]: arrowheads stay over nodes during drag (markers.front() each dragmove frame).
- Q2 DONE [pending commit]: removed the no-op plug from the LINE toolbar (now delete + cog).
- Q3 DONE [pending commit]: baked endpoint locking into the library — clicking the line cog shows a
  padlock toggle at EACH endpoint (inset from the ends, clear of drag-handles; transparent hit-circle
  on top so clicks register over the fill:none padlock). Click flips absolute (pinned anchor) ↔
  relative (auto-flow) via applyLineProperty + broadcasts onLinePropertiesChanged for collab. Classes
  endpoint-lock / -source / -target / -absolute / -relative. Verified live: relative→absolute→relative.
  e2e endpoint-lock-toggle. NEXT: Q4 birds-eye animate on node changes.

## User direction (2026-07-02)
- Do NOT copy legacy for **rotate/resize** — ours stays as-is.
- Panels/toolbars can be **modern (Miro-style)**, not legacy replicas. G1/G2 use a flat white
  rounded pill with crisp monochrome line-icons (delete red, plug/cog neutral).

## Status
- 2026-07-02: established comparison pattern; captured legacy node toolbar (delete/plug/cog/+)
  and line toolbar (delete/cog/plug from user image).
- G1 DONE [9811c04]: node context toolbar (delete+plug+cog) as a modern Miro pill centered above
  the node; delete→removeNode (syncs), cog→node pane, plug→placeholder (G3). drawToolIcon helper.
- G2 DONE [pending commit]: line context toolbar (delete+cog+plug) pill at the line midpoint;
  delete→removeAssociation (broadcasts removeRelationship → verified syncs to peer), cog→line pane.
- G3 DONE [pending commit]: plug PRESS-DRAG-TO-CONNECT. Discovery: our connection anchors only
  CLICK→create-new-node; they did NOT drag-to-existing. Implemented Node.startConnectDrag — press
  the plug → dashed rubber-band line follows the pointer, target node highlights, drop → addAssociation
  (connector + broadcast). Verified live two-window (connected + syncedToPeer). e2e plug-connect.
  NOTE: anchors keep click→new-node (the legacy "+" role); plug = connect-to-existing.
- COMPARISON (double-click text edit): PARITY — legacy AND ours both open the bottom pane's TEXT
  editor (TEXTAREA), neither does inline-on-canvas editing. No gap. (Panes are shared app-side
  React; real deltas are canvas/library behaviors.)
- G4 DONE [pending commit]: DELETE PARITY / no-rogue-lines. Bug found via comparison: deleting a
  connected node left a rogue connector line + a stale association (removeNode dropped the SVG but
  not associations referencing the node). Fixed NodesManager.remove to clean up ALL associations
  involving the node (outgoing via removeAll + incoming via other nodes' removeAssociation), which
  disconnects the connectors. Verified live two-window: node+assoc+lines all gone in both, synced.
- COMPARISON round (2026-07-02, no code change — all PARITY):
  * node drag → connector follows live (samplesDistinct 6) — parity.
  * empty-canvas drag → PANS in BOTH legacy and ours (node pans off, stays in birds-eye);
    multi-select is via shift-click in both, NOT a marquee. Parity — not a gap.
  * double-click node → both open the bottom pane's TEXT editor; no inline-on-canvas edit. Parity.
  Core interaction parity is now solid. Remaining candidates are larger FEATURES that need product
  direction, not clear regressions: themes palette, presentation mode, comments, export. Recommend
  getting user direction before building those (they aren't obvious "legacy does X, we don't").
- NEXT: await user direction on which larger feature-areas to pursue (themes/presentation/comments/
  export), or treat the parity pass as complete.
