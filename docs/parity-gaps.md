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
- NEXT (P2): app-side — add the PRESENT button + fullscreen step controls (next/prev/esc) wired to
  slate.presentation.{start,next,previous,stop}. (P3) match legacy raw-SVG step transitions/animation.

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
