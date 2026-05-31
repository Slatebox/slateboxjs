# Autonomous Directive: SlateboxJS v2 — Quality Gates, Developer UX & Accessibility

## Directive

Ship a polished, professionally-documented, enterprise-grade library. Fix every known test failure. Make CI a real quality gate that runs e2e tests across browsers. Document every public method so IDE users get rich IntelliSense. Add accessibility foundations so the library can be adopted by government, education, and healthcare organizations. Three ordered phases.

## Context

- **Repo**: `/Users/timheckel/Projects/node/slateboxjs-v2` — TypeScript (ES2020), SVG.js 3+, Vite 5, Playwright, Vitest
- **CLAUDE.md**: Full architecture reference at project root.
- **Current state**: 994/994 unit tests pass, 93/101 e2e pass (8 flaky), TypeScript compiles clean, build succeeds. npm pack works. All leaks fixed, all classes have `destroy()`, types hardened.
- **Branch**: `main`, up to date with `origin/main`
- **Previous directives**: directive-1 (production hardening), directive-2 (git integrity + test coverage), directive-3 (bug bash + npm readiness + demo), directive-4 (TS strict + e2e expansion + collab)

### The Three Gaps

**Quality Gates Are Broken (8 failing e2e tests, CI runs zero e2e):**
- `export.spec.ts` (2 failures) — uses wrong method names (`slate.exportSVG` instead of `slate.svg`)
- `undo-redo.spec.ts` (3 failures) — UndoRedo has a 3-second debounce before snapshots, so `undo()` immediately after `addNode()` has nothing to undo
- `images.spec.ts` (1 failure) — URL typo (`picsum` not `picsum.photos`), image silently fails
- `layout.spec.ts` (1 failure) — test `beforeEach` adds zero nodes but expects positions
- `keyboard.spec.ts` (1 failure) — same UndoRedo debounce issue
- CI (`.github/workflows/ci.yml`): runs unit tests and build, but zero e2e tests, zero cross-browser, no `npm pack` verification
- Cross-browser: Firefox/WebKit browsers not installed, Playwright `--project=firefox` / `--project=webkit` never run

**Developer UX is Poor (69 undocumented public methods across Node.ts + Slate.ts):**
- **Node.ts**: 1 of 36 public methods have JSDoc (2.8%). Constructor has NO JSDoc. This is the class every consumer touches most.
- **Slate.ts**: 17 of 51 public methods have JSDoc (33.3%). 34 methods lack any documentation — including `getZoom`, `getPan`, `clearSelection`, `removeNode`, `getAllNodes`, and 25 pan/zoom delegation methods.
- **Other classes**: PanZoom.ts has zero JSDoc blocks. ResizeRotate.ts, Connector.ts, and several others have minimal documentation.
- **`SlatePackage` type** is defined but NOT exported from `index.ts` — consumers integrating with Invoker or Collab can't type their package handlers.
- **No `@example` tags** anywhere in the codebase — developers get zero code snippets in tooltips.

**Accessibility Is Zero (enterprise adoption blocker):**
- Zero `aria-*` attributes, zero `role` attributes, zero `tabindex`, zero focus management
- SVG canvas has no `aria-label` or `role="img"`
- Nodes are not keyboard-focusable — no arrow key navigation, no Enter to select, no screen-reader announcements
- The `Keyboard` module handles internal shortcuts (Delete, Ctrl+Z, Escape) but provides no user-facing keyboard navigation
- This blocks adoption by government, education, healthcare — any organization with WCAG 2.1 AA requirements

### Key Files
- `src/core/Node.ts` — 35 undocumented public methods, constructor has no JSDoc
- `src/core/Slate.ts` — 34 undocumented public methods
- `src/core/PanZoom.ts` — zero JSDoc
- `tests/e2e/export.spec.ts`, `undo-redo.spec.ts`, `images.spec.ts`, `layout.spec.ts`, `keyboard.spec.ts` — 8 failing tests
- `.github/workflows/ci.yml` — no e2e, no cross-browser, no `npm pack` check
- `playwright.config.ts` — firefox + webkit projects configured but browsers not installed
- `src/index.ts` — `SlatePackage` type not exported
- `src/core/UndoRedo.ts` — 3-second debounce causes test failures, may need `forceSnapshot()` API for programmatic use
- `src/core/Keyboard.ts` — internal shortcuts only, no focus/navigation support

## Milestone Guidance

### Phase 1: Quality Gates — Fix Every Failure + CI Hardening

**Fix 8 failing e2e tests:**
- Fix `export.spec.ts`: use correct API names (`slate.svg()` / `slate.png()`)
- Fix `undo-redo.spec.ts` and `keyboard.spec.ts`: add `slate.undoRedo.forceSnapshot()` or reduce debounce for tests. Alternative: wait 3+ seconds after addNode before undo
- Fix `images.spec.ts`: correct URL to `https://picsum.photos/320/240`
- Fix `layout.spec.ts`: add nodes in beforeEach before testing positions
- Target: 101/101 e2e tests green on chromium

**Optional UndoRedo API improvement:**
- Add `forceSnapshot()` public method to UndoRedo — takes an immediate snapshot bypassing debounce. This enables programmatic undo/redo sequences without waiting.

**CI hardening:**
- Install Playwright browsers in CI (`npx playwright install chromium`)
- Add `npx playwright test --project=chromium` step to CI after unit tests
- Add `npm pack --dry-run` verification step
- Add Firefox + WebKit browser installs and test runs (separate job or matrix)

**Cross-browser verification:**
- `npx playwright install firefox webkit`
- Run full e2e suite on Firefox and WebKit
- Fix any cross-browser failures discovered
- Target: all 101 e2e tests pass on chromium, firefox, and webkit

### Phase 2: Developer UX — JSDoc Coverage + API Surface Polish

**Node.ts JSDoc (35 methods + constructor):**
- Constructor: full JSDoc with `@param options`, `@param slate`
- All 35 public methods: at minimum `/** description */` one-liner
- Key methods get full JSDoc: `position()`, `setSize()`, `setRotation()`, `getRotation()`, `setText()`, `setColors()`, `lock()`, `unlock()`, `connectTo()`, `destroy()`, `remove()`, `enableConnector()`, `enableResizeRotate()`, `enableConnectionHandles()`
- Use `@param`, `@returns`, `@example` on the 10 most critical methods

**Slate.ts JSDoc (34 methods):**
- Pan/zoom delegation methods (25 methods): brief one-liners since they mirror PanZoom API
- Selection methods (5 methods): brief one-liners
- Other methods (4): `removeNode`, `getNode`, `getAllNodes`, `getViewport` — full JSDoc

**Other module JSDoc:**
- PanZoom.ts: JSDoc on constructor + key methods (zoom, zoomIn, zoomOut, pan, getZoom, getPan, destroy, enable, disable)
- Connector.ts: JSDoc on constructor + key methods (enable, disable, connectTo, disconnectFrom)
- ResizeRotate.ts: JSDoc on constructor + key methods (enable, disable)

**API surface fixes:**
- Export `SlatePackage` type from `src/index.ts`
- Add `@example` tags to at least 5 key methods (Slate constructor, addNode, selectNodes, Node constructor, connectTo)
- Verify `tsc --noEmit` still clean with all JSDoc additions

### Phase 3: Accessibility Foundations

**Canvas-level accessibility:**
- Add `role="img"` and `aria-label` to the SVG canvas element
- Add `aria-describedby` pointing to a hidden description of the diagram

**Node-level accessibility:**
- Make node SVG groups focusable: add `tabindex="0"` and `role="button"` or `role="group"`
- Add `aria-label` to each node group using node text or a generated label
- Add visible focus ring styling (CSS outline on focus-visible)
- Arrow key navigation between nodes (right/down = next node, left/up = previous node)
- Enter/Space to select focused node, Escape to deselect

**State change announcements:**
- Add a hidden live region (`aria-live="polite"`) for screen-reader announcements
- Announce: "Node added: [text]", "Node removed: [text]", "3 nodes selected", "Zoom: 150%"

**Keyboard module enhancements:**
- Register arrow key handlers for node navigation (in addition to existing shortcuts)
- Ensure keyboard handlers don't conflict with text editing or browser shortcuts
- Add `?` key to show keyboard shortcuts help overlay

**Demo page accessibility:**
- Add `aria-label` to all sidebar buttons
- Add focus-visible styles
- Add a "Keyboard shortcuts" tooltip accessible via `?` key

**Verification:**
- Run full test suite — all 994+ unit + 101+ e2e must pass
- Verify `tsc --noEmit` clean, `npm run build` succeeds
- Manual check: demo.html loads and keyboard navigation works

## Constraints

- Keep work inside this workspace unless explicitly told otherwise
- Respect configured deny rules in `reasonix.toml`
- Pause and mark `state.json` as `blocked` if credentials, publishing, destructive data changes, or external approval are needed
- Do NOT modify `node_modules/` or `.git/` contents
- Do NOT delete or modify `.reasonix/`, `.codegraph/`, `.cursor/`, `.serena/`, `.playwright-mcp/` metadata directories
- Follow the architectural conventions in CLAUDE.md, especially the Selection/ResizeRotate orchestration pattern and Content Type Duality guards
- All source changes must keep TypeScript compiling and unit tests passing
- Use `npm run build` to verify the build output after significant changes
- `import type` must be used for all cross-module type references
- Accessibility changes must NOT break existing drag/resize/connect/interaction behavior
- JSDoc must use `@param`, `@returns`, `@throws` following the existing Slate.ts constructor template

## Definition Of Done

All of the following must be true:

**Phase 1:**
1. **All 8 failing e2e tests fixed** — 101/101 green on chromium
2. **UndoRedo has `forceSnapshot()` method** or tests adapted to debounce
3. **CI runs e2e tests** — `npx playwright test --project=chromium` in workflow
4. **CI verifies npm pack** — `npm pack --dry-run` in workflow
5. **Firefox + WebKit browsers installed** — `npx playwright install firefox webkit`
6. **All 101 e2e tests pass on Firefox and WebKit** (or known browser-specific issues documented)

**Phase 2:**
7. **Node.ts: 36/36 public methods have JSDoc** — constructor + all 35 methods
8. **Slate.ts: 51/51 public methods have JSDoc** — all 34 undocumented methods documented
9. **PanZoom.ts: constructor + 10+ key methods have JSDoc**
10. **Connector.ts + ResizeRotate.ts: constructor + key methods have JSDoc**
11. **`SlatePackage` type exported** from `src/index.ts`
12. **At least 5 `@example` tags** present across the codebase

**Phase 3:**
13. **SVG canvas has `role="img"` and `aria-label`**
14. **Nodes are keyboard-focusable** — `tabindex="0"`, `role`, `aria-label`, visible focus ring
15. **Arrow key navigation works** — right/down next node, left/up previous node
16. **Enter/Space selects focused node, Escape deselects**
17. **`aria-live` region for screen-reader announcements** — add, remove, select, zoom changes
18. **`?` key shows keyboard shortcuts reference**

**Global:**
19. **994+ unit tests pass** — no regressions
20. **101+ e2e tests pass on chromium** — no regressions
21. **TypeScript compiles cleanly** (`tsc --noEmit`)
22. **`npm run build` succeeds**
23. **demo.html loads and works** — keyboard navigation functional, new features visible
24. **CI updated** — reflects all new test commands
