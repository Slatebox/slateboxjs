# Autonomous Directive: SlateboxJS v2 — TypeScript Strict, Test Depth & Collab Integration

## Directive

Transform the codebase from "strict in name only" to genuinely type-safe. Elevate the most complex module (Node.ts) from 4 placeholder tests to 150+ comprehensive tests. Fill the e2e test coverage gaps across 12 untested modules. Finally, prove the library's flagship collaboration feature works end-to-end against a real WebSocket server. Three ordered phases producing the most thoroughly-validated version of the library yet.

## Context

- **Repo**: `/Users/timheckel/Projects/node/slateboxjs-v2` — TypeScript (ES2020), SVG.js 3+, Vite 5, Playwright, Vitest
- **Collab server**: `/Users/timheckel/Projects/node/collab.slatebox.com` — y-websocket server (production uses HMAC/MongoDB auth). Needs a dev-mode bypass for local testing.
- **CLAUDE.md**: Full architecture reference at project root.
- **Current state**: 844/844 unit tests pass, 56/56 e2e tests pass, TypeScript compiles clean, build succeeds, npm pack works. All leaks fixed, all classes have `destroy()`.
- **Branch**: `main`, up to date with `origin/main`
- **Previous directives**: directive-1 (production hardening), directive-2 (git integrity + test coverage), directive-3 (bug bash + npm readiness + demo)

### The Three Big Gaps

**TypeScript `strict: true` is enabled but ~288 explicit `any` annotations bypass every check.** The code opts out of type safety everywhere. Key patterns:
- 12 classes use `private slate: any` / `private node: any` where `import type { Slate }` / `import type { Node }` already works (proven by BirdsEye.ts and Serialization.ts which do it correctly)
- `Invoker.ts` has 44 `(pkg: any)` parameters — trivially replaceable with a shared `SlatePackage` interface
- `SlateEvents` callbacks use `(node: any, pkg: any)` despite `Node` and `CollabPackage` already being in scope
- `Node.ts` has 18 `(this.backgroundRect as any).method()` casts — needs SVG.js module augmentation
- Total fixable: ~150 `any` annotations with well-understood patterns, ~80 harder (plugin types, compat JSON)

**Node.ts has only 4 tests** — and none test the Node class. For the most complex module (36 public methods, 15 properties, 22 private methods, 2 content types, drag/resize/connect/destroy lifecycle), this is a critical quality gap. Estimated effort: ~150 comprehensive tests.

**E2E coverage is heavily skewed** — 23 of 56 tests are in one file (connections-comprehensive). 12 of 26 core modules have zero e2e tests: undo/redo, presentation, export, comments, filters, themes, grid, multi-select, keyboard, serialization, layout, images, links, font loading.

**Collab.ts has never been tested end-to-end.** The module exists, has 11 unit tests (all mock), and the y-websocket server requires MongoDB/HMAC auth — blocking local integration testing.

### Key Files
- `src/core/*.ts` — 26 modules, all tracked
- `src/core/Node.ts` — 58 `any` refs, 4 placeholder tests, most complex module
- `src/core/Invoker.ts` — 50 `any` refs, 44 are identical `(pkg: any)` patterns
- `src/core/Slate.ts` — 32 `any` refs, SlateEvents callbacks most fixable
- `tests/unit/Node.test.ts` — 4 tests (all fake), needs full rewrite
- `tests/e2e/*.spec.ts` — 10 spec files, 12 modules untested
- `tsconfig.json` — `strict: true` enabled but ~288 explicit `any` bypass it
- `../collab.slatebox.com/bin/server.js`, `../collab.slatebox.com/src/auth/isAuthenticated.js` — needs dev-mode bypass
- `src/vendor/svg-connectable/` — vendored plugin, no types yet

## Milestone Guidance

Three ordered phases — each builds on the last:

### Phase 1: TypeScript Strict Hardening + Node.ts Test Coverage

Fix the type system so `strict: true` actually enforces safety. Then write comprehensive Node.ts tests that the improved types enable.

**Type hardening** (eliminate ~150 of 288 `any` annotations):
- Add `import type { Slate }` / `import type { Node }` to all 12 sub-system classes (BirdsEye.ts and Serialization.ts already prove this pattern works)
- Define a shared `SlatePackage` interface, replace 44 `(pkg: any)` in Invoker.ts
- Fix `SlateEvents` callback signatures to use existing `Node`, `CollabPackage`, `Association`, `CollabUser` types
- Fix `Connection` interface fields to use `Node` instead of `any`
- Fix `catch (error: any)` → `catch (error: unknown)` across all files
- Fix inline object types (`strokeOpts: any = { color, width }`) to use proper types
- Add SVG.js module augmentation for plugin-augmented methods (`.draggable()`, `.connectable()`, `.transform()`)
- Add Yjs type stubs for Collab.ts dynamic imports
- `addNode(options: any)` → `addNode(options: Partial<NodeOptions>)`

**Node.ts testing** (4 → 150+):
- Construction & initialization (15 tests)
- Text content paths (10 tests)
- SVG content paths (10 tests)
- Shape rendering: rect, circle, ellipse, named shapes (8 tests)
- Position: immediate, animated, callback, easing (8 tests)
- setSize: rectangle, circle min-dim, ellipse, custom shape, nested SVG, text recenter (10 tests)
- Rotation: set, get, fallback chain, preserve translate, initial rotate from options (10 tests)
- Drag lifecycle: dragstart selection, multi-select, preDragPosition, dragmove, dragend position update, timer guard (12 tests)
- Lock/Unlock: disable drag+resize, restore, edge cases (6 tests)
- Resize/Rotate enable/disable delegation (8 tests)
- Selection behavior: click threshold, multi-select, handle click skip, onSelected, onDeselected (8 tests)
- Connector delegation: enable/disable, connectTo, disconnectFrom, disconnectAll, getConnections (12 tests)
- Connection handles: create, show, hide, positions (normal + rotated), preview (15 tests)
- Destroy/Remove lifecycle: timer clearance, sub-module disable, guard checks (10 tests)
- Edge cases: null slate, failed createAsync, SVG regex fallbacks, etc. (15 tests)

### Phase 2: E2E Coverage Expansion

Write e2e tests for all 12 untested modules:
- **Undo/Redo** — undo after add node, redo restores node, stack limit, debounce
- **Presentation** — start/stop, next/previous step, goToStep
- **Export** — exportSVG produces valid XML, exportPNG produces data URL
- **Comments** — create comment node, verify styling, remove comment, getComments
- **Filters** — apply dropShadow/blur/outline to selected nodes, remove all
- **Themes** — applyTheme changes node colors, child style cycling
- **Grid** — show/hide grid, snap-to-grid, gridSize
- **Multi-selection** — drag-select rectangle, shift-click, group resize/rotate
- **Keyboard** — delete removes node, Ctrl+Z undo, Ctrl+Y redo, Escape deselect
- **Serialization** — serialize produces valid JSON, deserialize restores state
- **Layout** — applyLayout positions nodes, removeLayoutOverlaps
- **Images** — set image fill, clear restores color, hasImage

Target: 10-12 new spec files, 30-40 new e2e tests. All 56 existing must continue to pass.

### Phase 3: Collab Integration Testing

- Add `COLLAB_DEV_MODE=1` environment variable to collab.slatebox.com that bypasses MongoDB/HMAC auth
- Or write a minimal dev-mode route in `bin/server.js`
- Write Collab e2e test: start server → connect to WebSocket → verify `isConnected` updates via status event → send package → receive package → verify awareness users → disconnect cleanly → verify cleanup
- Add multi-client test: two WebSocket connections to same room, verify bidirectional package propagation
- Fix any issues discovered during real integration testing (timing, error handling, reconnection)
- Run `npm run build` + full test suite after all changes

## Constraints

- Keep work inside this workspace unless explicitly told otherwise
- Respect configured deny rules in `reasonix.toml`
- Pause and mark `state.json` as `blocked` if credentials, publishing, destructive data changes, or external approval are needed
- Do NOT modify `node_modules/` or `.git/` contents
- Do NOT delete or modify `.reasonix/`, `.codegraph/`, `.cursor/`, `.serena/`, `.playwright-mcp/` metadata directories
- Follow the architectural conventions in CLAUDE.md, especially the Selection/ResizeRotate orchestration pattern and Content Type Duality guards
- All source changes must keep TypeScript compiling and unit tests passing
- Use `npm run build` to verify the build output after significant changes
- `import type` must be used for all cross-module type references to avoid circular dependency risks
- SVG.js module augmentations must use `declare module` in a `.d.ts` file, not inline patches to `node_modules/`
- The collab server at `../collab.slatebox.com` may be modified ONLY to add a dev-mode auth bypass — no other changes
- Node.ts tests must use realistic mock objects (mock Slate, mock SVG.js elements) to validate real behavior, not just constructor calls

## Definition Of Done

All of the following must be true:

1. **At least ~150 of ~288 `any` annotations eliminated** — proven patterns: `import type`, `SlatePackage` interface, SVG.js augmentation, `SlateEvents` callbacks, `catch (error: unknown)`
2. **All 12 sub-system classes use `import type { Slate }` / `import type { Node }`** instead of `private slate: any` / `private node: any`
3. **`SlatePackage` interface defined and used** in Invoker.ts, Collab.ts, SlateEvents — replaces 44+ `(pkg: any)` patterns
4. **SVG.js module augmentation file exists** (`src/types/svgjs-plugins.d.ts`) declaring plugin-augmented methods — eliminates `(this.svgGroup as any).method()` casts
5. **Node.test.ts has 150+ tests** covering construction, text content, SVG content, shapes, position, setSize, rotation, drag, lock/unlock, resize/rotate delegation, selection, connector delegation, connection handles, destroy/remove lifecycle, and edge cases
6. **All existing 844 unit tests + 56 e2e tests continue to pass**
7. **10-12 new e2e spec files exist** covering undo/redo, presentation, export, comments, filters, themes, grid, multi-selection, keyboard, serialization, layout, images
8. **Collab dev-mode bypass exists** in `../collab.slatebox.com` — `COLLAB_DEV_MODE=1` skips MongoDB/HMAC auth
9. **Collab e2e test passes** — connect, send/receive package, awareness update, disconnect, clean cleanup
10. **Multi-client collab test passes** — two connections same room, bidirectional propagation
11. **TypeScript compiles cleanly** (`tsc --noEmit` with zero errors, strict enabled)
12. **`npm run build` succeeds** and produces valid ESM + CJS + types + CSS
13. **README.md updated** — reflects stricter types, dev mode collab setup, e2e test instructions
