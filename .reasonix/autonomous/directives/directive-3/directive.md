# Autonomous Directive: SlateboxJS v2 — Bug Bash, Feature Hardening, npm Readiness & Demo

## Directive

Eliminate all known bugs, memory leaks, and residual issues from the codebase. Verify every advertised feature works end-to-end. Resolve the `file:` dependency that blocks npm publishing. Build a comprehensive demo page proving the library works. Four ordered phases, all producing a release-quality v2 library.

## Context

- **Repo**: `/Users/timheckel/Projects/node/slateboxjs-v2` — TypeScript (ES2020), SVG.js 3+, Vite 5, Playwright, Vitest
- **Collab server**: `/Users/timheckel/Projects/node/collab.slatebox.com` — y-websocket server, production at `collab.slatebox.com`. The Collab module in slateboxjs-v2 can connect to this for testing.
- **svg.connectable.js sibling**: `/Users/timheckel/Projects/node/svg.connectable.js` — MIT-licensed, 2,700-line plugin, NOT published to npm under Slatebox's control. The npm name `svg.connectable.js` is owned by jillix (original SVG.js 2.x version).
- **CLAUDE.md**: Full architecture reference at project root — read it for critical patterns (Selection/ResizeRotate orchestration, Content Type Duality, plugin loading order).
- **Current state**: 840/840 unit tests pass, 55/56 e2e tests pass (1 known flaky test), TypeScript compiles clean, build succeeds. All files tracked by git.
- **Branch**: `main`, up to date with `origin/main`
- **Previous directives**: directive-1 (production hardening, 3 commits), directive-2 (git integrity, test coverage, release readiness, 10 commits)

### Known Bugs & Issues (from directive-2 handoff + fresh audit)

**Critical leaks (must fix):**
1. **Slate.ts:392** — `setInterval` (200ms coordinate polling) never cleared. No `destroy()` method exists.
2. **ZoomSlider.ts:146** — `setInterval` (500ms update polling) never cleared. `destroy()` exists but doesn't call `clearInterval`.
3. **BirdsEye.ts:347-348** — document `mousemove`/`mouseup` listeners leak if mousedown fires without mouseup. `disable()` doesn't clear them.
4. **Node.ts** — 4× `setTimeout` leaks (lines 341, 728, 1639, 1915) that can fire on removed nodes. No `destroy()` method.

**Missing lifecycle methods (15 classes lack `destroy()`):**
Slate (most critical — no teardown at all), Node, BirdsEye, Collab, Connector, Editor, Filters, Images, Invoker, Links, Menu, NodesManager, Presentation, Relationships, ResizeRotate, UndoRedo. PanZoom.ts is the gold-standard example of proper destroy/disable.

**One failing e2e test:**
- `drag-hop.spec.ts:66` "detailed drag position tracking" — times out because `circle_2` node overlaps `rect_1`, intercepting Playwright's hover. Root cause: test fragility, not a code bug.

**Feature completeness gap:**
- **Collab.ts** — code is 100% present but requires optional peer deps (`yjs`, `y-websocket`). Untested end-to-end. `isConnected` set optimistically before WebSocket actually connects.

**npm publish blocker:**
- `"svg.connectable.js": "file:../svg.connectable.js"` in package.json — any consumer's `npm install` fails because the sibling directory doesn't exist on their machine.

### Key Files
- `src/core/*.ts` — 26 modules total, all tracked
- `tests/unit/*.test.ts` — 31 files, 840 tests, all tracked
- `tests/e2e/*.spec.ts` — 10 files, 56 tests, all tracked
- `package.json` — dependency `svg.connectable.js` is a `file:` link
- `vite.config.ts` — `dedupe` svg.js, no special handling for svg.connectable.js
- `src/index.ts` — plugin loading order, global exports, `import 'svg.connectable.js'`
- `advanced-demo.html`, `index.html` — demo pages (simplified, basic)
- `public/test.html` — dev testing page
- `.github/workflows/ci.yml` — Node 18/20/22 test + build

## Milestone Guidance

See milestones.md for the four-phase ordering:

1. **Bug Bash & Production Hardening** — Fix all critical leaks (Slate interval, ZoomSlider interval, BirdsEye doc listeners, Node timeouts). Add proper `destroy()` methods to all classes that lack them (following PanZoom.ts as the pattern). Fix `drag-hop.spec.ts` flaky test. Run full test suite to confirm no regressions. Run `npm run build` to verify.
2. **Feature Completeness Audit & Verification** — Install yjs+y-websocket, verify Collab end-to-end against collab.slatebox.com. Fix the optimistic `isConnected` flag. Verify all 19 CLAUDE.md-advertised modules are truly working. Write e2e tests for modules that lack them where feasible. Fix any feature gaps discovered.
3. **npm Publish Readiness** — Vendor `svg.connectable.js` in-tree (MIT-licensed, ~2,700 lines, zero deps beyond svg.js). Remove `file:` dependency from package.json. Update import in `src/index.ts`. Verify `npm pack` produces a working tarball. Test in a temp directory with `npm install ./slateboxjs-v2-2.0.0.tgz`. Verify CJS, ESM, and TypeScript consumers all work. Do NOT publish to npm registry.
4. **Real-World Integration & Demo Showcase** — Build a single comprehensive `demo.html` page that exercises every major feature: all shape types, drag/resize/rotate, connectors, multi-select, pan/zoom, grid toggle, themes, undo/redo, presentation mode, comments, export (SVG/PNG), birds-eye minimap, zoom slider. Verify the page loads and all features work.

## Constraints

- Keep work inside this workspace unless explicitly told otherwise
- Respect configured deny rules in `reasonix.toml`
- Pause and mark `state.json` as `blocked` if credentials, publishing, destructive data changes, or external approval are needed
- Do NOT modify `node_modules/` or `.git/` contents
- Do NOT publish to npm or push to remote without explicit approval
- Do NOT delete or modify `.reasonix/`, `.codegraph/`, `.cursor/`, `.serena/`, `.playwright-mcp/` metadata directories
- Follow the architectural conventions in CLAUDE.md, especially the Selection/ResizeRotate orchestration pattern and Content Type Duality guards
- All source changes must keep TypeScript compiling and unit tests passing
- Use `npm run build` to verify the build output after significant changes
- Vendoring svg.connectable.js MUST preserve the MIT license header in copied source files
- The collab server at `../collab.slatebox.com` may be used for local testing but must NOT be modified

## Definition Of Done

All of the following must be true:

1. **Zero known critical leaks** — Slate interval cleared, ZoomSlider interval cleared, BirdsEye doc listeners cleaned on disable, Node timeouts cleared on destroy
2. **All 15 classes lacking `destroy()` have one** — each following the PanZoom.ts pattern: clean up timers, remove listeners, chain to owned sub-objects, set enabled flags to false
3. **All 6+ residual issues from directive-2 handoff are resolved or explicitly documented**
4. **`drag-hop.spec.ts` passes** — all 56 e2e tests green on chromium
5. **Collab.ts verified end-to-end** — connect to collab.slatebox.com, send/receive packages, awareness update, disconnect cleanly. isConnected flag fixed.
6. **svg.connectable.js vendored in-tree** — no `file:` dependency in package.json, build works, all tests pass
7. **`npm pack` produces a valid tarball** — `npm install ./tarball.tgz` succeeds in a clean temp directory
8. **ESM, CJS, and TypeScript consumers all verified** — import/require/type-check all work
9. **`demo.html` exists and exercises all major features** — loads in browser without errors, buttons/toggles for each feature work
10. **840+ unit tests pass, 56+ e2e tests pass, TypeScript compiles clean, `npm run build` succeeds**
11. **README.md updated** — reflects the vendored plugin, demo page instructions, collab setup notes
