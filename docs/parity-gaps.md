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

## User direction (2026-07-02)
- Do NOT copy legacy for **rotate/resize** — ours stays as-is.
- Panels/toolbars can be **modern (Miro-style)**, not legacy replicas. G1/G2 use a flat white
  rounded pill with crisp monochrome line-icons (delete red, plug/cog neutral).

## Status
- 2026-07-02: established comparison pattern; captured legacy node toolbar (delete/plug/cog/+)
  and line toolbar (delete/cog/plug from user image). Starting G1.
