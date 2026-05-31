# Autonomous Milestones

> Phases are ordered by "most impactful gap first." Milestones within a phase are sequential.

## Phase 1: Audit & Baseline ✅

### Completed Audit Results

**Test Suite:**
- ✅ 290/290 unit tests pass (22 files)
- ✅ 56/56 e2e tests pass (10 spec files, chromium)
- ✅ TypeScript compiles clean (`tsc --noEmit`)
- ✅ Build succeeds (`npm run build`) — ESM (314 kB) + CJS (224 kB) + types + CSS

**Working Tree Changes (15 source files):**
- `src/core/Node.ts` (+511 lines) — Major expansion: new sub-systems (Relationships, Images, Editor, Links, Filters, Menu), async `ready` promise, preDragTransform, circular shape preservation, expanded NodeOptions
- `src/core/Slate.ts` (+309 lines) — New sub-systems (BirdsEye, UndoRedo, MultiSelection, Grid, Keyboard, Collab, ZoomSlider, Presentation), expanded SlateOptions/SlateEvents
- `src/core/PanZoom.ts` (+150 lines) — Momentum scrolling, zoom controls UI, wheel zoom enabled
- `src/core/ResizeRotate.ts` (+70 lines) — Handle hit area widening, rotation tracking fixes, BirdsEye notification
- `src/core/Connector.ts` (+1 line) — sourceAttach "center" → "perifery"
- `src/index.ts` (+131 lines) — All modules re-exported, global window exposure
- `src/styles/slateboxjs.css` — svg.select.js handle overrides
- `vite.config.ts` — svg.js dedup/alias, port 5173, external yjs/y-websocket
- `playwright.config.ts` — port 3000→5173
- `package.json` — test scripts, Playwright, jsdom deps
- `tests/e2e/connectors.spec.ts` — async/await node creation, better drag
- `tests/e2e/selection.spec.ts` — updated selectors
- `CLAUDE.md` — Full architecture reference rewritten
- `advanced-demo.html`, `public/test.html` — Rewritten

**Module Coverage: 9 modules without unit tests:**
- BirdsEye, Connector, Export, Invoker, MultiSelection, NodesManager, PanZoom, ResizeRotate, Slate

**Compat Layer:** Round-trip v1↔v2 passes (20 tests), 14 shape mappings, association conversion complete

**Build Warnings:**
1. FontLoader.ts is both dynamically (Slate) and statically (Editor, index) imported
2. Named+default export warning (Vite — SlateboxJS.default)

### Phase Plan Adjustments

**Priority reorder:** Since the working-tree changes are already substantial and building, Phase 2 (Finish In-Progress) is largely complete. Focus shifts to:
1. Review & polish the working-tree changes (catch any issues)
2. Harden error handling (Phase 4 shift to after polish)
3. Review/reorder based on findings below

## Phase 1b: Polish & Review Working-Tree Changes

- [ ] Review Node.ts for: null-safety on new properties, Content Type Duality guards, Selection/ResizeRotate pattern compliance
- [ ] Review Slate.ts for: initialization order, event handler registration, error guards on new sub-systems
- [ ] Review PanZoom.ts for: momentum defaults, zoom controls DOM cleanup on disable
- [ ] Review ResizeRotate.ts for: rotation tracking edge cases, handle widening reliability
- [ ] Fix build warnings (FontLoader dual import, named+default export)
- [ ] Review all new sub-system integrations for Isolated Class pattern compliance
- [ ] Verify index.ts export consistency (all modules exported with correct names)
- [ ] Commit polished working-tree changes to `main`

## Phase 3: Fix E2E Test Failures

- [x] ~~Identify all failing e2e tests and root-cause each failure~~ (all 56 pass)
- [x] ~~Fix underlying source issues~~ (0 failures currently)
- [ ] Verify all 56 tests pass on chromium (re-verify after Phase 1b changes)
- [ ] Check for flaky tests — run 3x to identify

## Phase 4: Hardening & Error Handling

- [ ] Review each core module for: null-safety, missing return guards, unhandled edge cases
- [ ] Apply Content Type Duality guards (text vs SVG content) where missing
- [ ] Review Selection/ResizeRotate orchestration pattern compliance
- [ ] Remove dead code, unused imports, stale comments
- [ ] Add consistent debug logging where missing
- [ ] Focus hardest on: Node.ts (massive expansion), Slate.ts (new sub-system orchestration), PanZoom.ts (DOM manipulation)

## Phase 5: Compat Layer Verification

- [x] ~~Write/adjust unit tests for compat.ts covering v1→v2→v1 round-trip~~ (20 tests exist, all pass)
- [ ] Verify shape hint mapping covers all known v1 shapes (14 mapped, check for gaps)
- [ ] Verify association conversion matches connector defaults (connector.ts changed to "perifery")
- [ ] Add missing compat tests for edge cases (null inputs, empty arrays, nested relationships)

## Phase 6: Build & Dist Verification

- [ ] Run `npm run build` — verify clean output (passes now)
- [ ] Check dist/ contains: `.js` (CJS), `.es.js` (ESM), `.d.ts` (types), `.css` (all present)
- [ ] Verify source maps are correct
- [ ] Verify the demo page loads and works from dist/
- [ ] Confirm `package.json` `files` field matches dist/ contents
- [ ] Fix build warnings (FontLoader, named+default export)

## Phase 7: Final Validation

- [ ] Full test pass: unit + e2e on chromium
- [ ] TypeScript check: `tsc --noEmit` clean
- [ ] Clean build: `npm run build` succeeds
- [ ] Demo page: basic functionality verified
- [ ] Working tree committed
- [ ] **All Definition of Done criteria met — mark directive complete**
