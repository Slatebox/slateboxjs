# Autonomous Milestones

## Phase 1: TypeScript Strict Hardening + Node.ts Test Coverage

### Type Hardening — Core Patterns
- [ ] 1.1 Add `import type { Slate }` to Node.ts → `private slate: Slate`
- [ ] 1.2 Add `import type { Slate }` to Invoker.ts → `private slate: Slate`
- [ ] 1.3 Add `import type { Slate }` to Collab.ts → `private slate: Slate`
- [ ] 1.4 Add `import type { Node }`, `import type { Slate }` to Connector.ts
- [ ] 1.5 Add `import type { Node }` to ResizeRotate.ts
- [ ] 1.6 Add `import type { Node }`, `import type { Slate }` to Relationships.ts
- [ ] 1.7 Add `import type { Node }` to Editor.ts
- [ ] 1.8 Add `import type { Node }` to Filters.ts
- [ ] 1.9 Add `import type { Node }` to Images.ts
- [ ] 1.10 Add `import type { Node }` to Links.ts
- [ ] 1.11 Add `import type { Node }`, `import type { Slate }` to Menu.ts
- [ ] 1.12 Add `import type { Slate }` to NodesManager.ts

### Type Hardening — SlatePackage & SlateEvents
- [ ] 1.13 Define `SlatePackage` interface (shared type: `{ type: string; data: Record<string, unknown> }`)
- [ ] 1.14 Use `SlatePackage` in Invoker.ts — replace 44 `(pkg: any)` parameters
- [ ] 1.15 Use `SlatePackage` in Collab.ts `CollabPackage` + `send`/`exe`/`handleRemotePackage`
- [ ] 1.16 Fix `SlateEvents` callbacks: `node: any` → `node: Node`, `pkg: any` → `SlatePackage`, `users: any[]` → `CollabUser[]`, `association: any` → `Association`
- [ ] 1.17 Fix `Connection` interface in Connector.ts: `source: any` → `Node`, `target: any` → `Node`, `lineContainer: any` → `G`, `markerContainer: any` → `G`

### Type Hardening — Catch blocks & Inline Types
- [ ] 1.18 Fix all `catch (error: any)` → `catch (error: unknown)` across all files
- [ ] 1.19 Fix `(reason?: any) => void` → `(reason?: unknown) => void` in Node.ts ready promise
- [ ] 1.20 Fix `addNode(options: any)` → `addNode(options: Partial<NodeOptions>)` in Slate.ts
- [ ] 1.21 Fix `getViewport(): any` → proper `Viewport` return type in Slate.ts
- [ ] 1.22 Fix `strokeOpts: any` → inline object type in Node.ts
- [ ] 1.23 Fix inline `(pan: any)` / `(zoom: any)` → `PanEvent` / `ZoomEvent` in PanZoom.ts callbacks

### Type Hardening — SVG.js Module Augmentation
- [ ] 1.24 Create `src/types/svgjs-plugins.d.ts` — module augmentation for `@svgdotjs/svg.js`
- [ ] 1.25 Declare `.draggable()`, `.panZoom()`, `.select()`, `.resize()` methods on SVG types
- [ ] 1.26 Declare `.connectable()`, `.makeInteractive()`, `.connect()`, `.disconnect()` on `G`
- [ ] 1.27 Remove `(this.svgGroup as any).method()` casts in Node.ts (6 instances)
- [ ] 1.28 Remove `(this.svgGroup as any).connectable` casts in Connector.ts
- [ ] 1.29 Remove `(this.backgroundRect as any).rbox()` / `.screenCTM()` casts in Node.ts (18 instances) via type narrowing or augmentation

### Type Hardening — Yjs Types
- [ ] 1.30 Create `src/types/yjs.d.ts` — minimal type stubs for yjs and y-websocket
- [ ] 1.31 Type Collab.ts private fields: `doc: YDoc`, `provider: WebsocketProvider`, `collabMap: YMap<CollabPackage>`, `awareness: Awareness`

### Node.ts Comprehensive Testing
- [ ] 1.32 Rewrite `tests/unit/Node.test.ts` — remove 4 placeholder tests, establish mock infrastructure
- [ ] 1.33 Construction tests: defaults merge, ID generation, ready promise resolves, ready promise rejects, data-node-id set (5 tests)
- [ ] 1.34 Text content tests: createText, setText, centerText, all 9 text alignments, text offset, SVG-content no-op guard (10 tests)
- [ ] 1.35 SVG content tests: nested SVG, viewBox timeout, preserveAspectRatio, path bounds calculation, bbox fallback, viewBox extraction regex (10 tests)
- [ ] 1.36 Shape tests: rectangle, circle (preserveAspectRatio forced true), ellipse, named shape, vectorPath, custom shape fallback (8 tests)
- [ ] 1.37 Position tests: immediate move, animated move, callback execution, easing, post-drag position update, position stores x/y in options (8 tests)
- [ ] 1.38 setSize tests: rectangle resize, circle min-dim enforcement, ellipse resize, custom shape try/catch, nested SVG resize, text recenter on resize (10 tests)
- [ ] 1.39 Rotation tests: set 0, set non-zero, getRotation fallback chain, preserve translateX/Y, initial rotate from options, getRotation post-drag (10 tests)
- [ ] 1.40 Drag tests: dragstart selection, multi-select flag, preDragPosition capture, dragmove sets isDragging, dragend position update, timer guard (12 tests)
- [ ] 1.41 Lock/Unlock tests: lock disables drag+resize, unlock restores, no-draggable-method edge case, selected-during-lock, double-lock idempotent (6 tests)
- [ ] 1.42 Resize/Rotate delegation: enableResizeRotate delegates to slate, enableResize, disableResize, enableRotate, disableRotate, isResizeRotateEnabled (8 tests)
- [ ] 1.43 Selection behavior: click threshold 5px, multi-select with Ctrl, handle click skip, pointerdown/up flow, onSelected, onDeselected (8 tests)
- [ ] 1.44 Connector delegation: enableConnector, disableConnector, connectTo, disconnectFrom, disconnectAll, getConnections, getConnection, isConnectorEnabled, enableConnectorWithInteractive (12 tests)
- [ ] 1.45 Connection handles: create handles (4 circles), show/hide, positions on normal node, positions on rotated node, preview create/hide, createConnectedNode, cloneNodeOptions, connectToNode auto-enable (15 tests)
- [ ] 1.46 Destroy/Remove lifecycle: destroy clears all 4 timeouts, destroy disables sub-modules, destroy removes SVG group, remove is lighter (no sub-module disable), timer callbacks guarded by _destroyed, double-destroy safe (10 tests)
- [ ] 1.47 Edge cases: null slate, missing viewport, failed createAsync, image application during init, filter application during init, customRender hook, hide/show, toFront/toBack, setColors partial, border styles (15 tests)

### Phase 1 Verification
- [ ] 1.48 `tsc --noEmit` — zero errors
- [ ] 1.49 `npm test` — all tests pass (target: 990+)
- [ ] 1.50 `npm run build` — succeeds
- [ ] 1.51 `npx playwright test --project=chromium` — all 56 e2e green
- [ ] 1.52 Commit Phase 1

## Phase 2: E2E Coverage Expansion

- [ ] 2.1 Write `tests/e2e/undo-redo.spec.ts` — undo after add, redo restores, stack limit, debounce (4 tests)
- [ ] 2.2 Write `tests/e2e/presentation.spec.ts` — start/stop, next step, previous step, goToStep, isPresenting (5 tests)
- [ ] 2.3 Write `tests/e2e/export.spec.ts` — exportSVG valid XML, exportPNG data URL, export after node changes (3 tests)
- [ ] 2.4 Write `tests/e2e/comments.spec.ts` — create comment node, verify yellow styling, remove comment, getComments (4 tests)
- [ ] 2.5 Write `tests/e2e/filters.spec.ts` — apply dropShadow, apply blur, apply outline, remove all filters, toggle visibility (5 tests)
- [ ] 2.6 Write `tests/e2e/theme.spec.ts` — apply theme changes colors, child style cycling, container style, line color default (4 tests)
- [ ] 2.7 Write `tests/e2e/grid.spec.ts` — show grid, hide grid, snap-to-grid, change gridSize (4 tests)
- [ ] 2.8 Write `tests/e2e/multi-selection.spec.ts` — drag-select rectangle, shift-click, group resize visible, clear on canvas click (4 tests)
- [ ] 2.9 Write `tests/e2e/keyboard.spec.ts` — delete removes selected, Ctrl+Z undo, Ctrl+Y redo, Escape deselect, focus handling (5 tests)
- [ ] 2.10 Write `tests/e2e/serialization.spec.ts` — serialize produces valid JSON, deserialize restores nodes, round-trip preserves positions, round-trip preserves connections (4 tests)
- [ ] 2.11 Write `tests/e2e/layout.spec.ts` — applyLayout positions nodes, removeLayoutOverlaps, packageLayout returns positions (3 tests)
- [ ] 2.12 Write `tests/e2e/images.spec.ts` — set image fill, clear restores color, hasImage after set/clear, update after resize (4 tests)

### Phase 2 Verification
- [ ] 2.13 Run all e2e tests — all 56 existing + 30-40 new pass
- [ ] 2.14 Run `npm test` — all unit tests pass
- [ ] 2.15 `tsc --noEmit` — clean
- [ ] 2.16 `npm run build` — succeeds
- [ ] 2.17 Commit Phase 2

## Phase 3: Collab Integration Testing

- [ ] 3.1 Add `COLLAB_DEV_MODE` env var to collab.slatebox.com `bin/server.js` — skips auth when set
- [ ] 3.2 Verify dev-mode server starts cleanly: `COLLAB_DEV_MODE=1 npm start`
- [ ] 3.3 Write `tests/e2e/collab.spec.ts` — single client connect/disconnect test
- [ ] 3.4 Collab e2e: connect to y-websocket, verify `isConnected` updates via status event
- [ ] 3.5 Collab e2e: send package via collabMap, verify propagation
- [ ] 3.6 Collab e2e: awareness update (user presence), verify `getCollabUsers()`
- [ ] 3.7 Collab e2e: disconnect, verify cleanup (provider null, doc destroyed, cursorElements cleared)
- [ ] 3.8 Collab e2e: multi-client — two connections to same room, bidirectional propagation
- [ ] 3.9 Collab e2e: test `exe()` package execution on receiving client
- [ ] 3.10 Fix any Collab.ts issues discovered during integration (timing, error handling, reconnection)
- [ ] 3.11 Update `README.md` with dev-mode collab setup instructions
- [ ] 3.12 Run `npm run test:all` — all tests pass
- [ ] 3.13 `tsc --noEmit` — clean
- [ ] 3.14 `npm run build` — succeeds
- [ ] 3.15 Commit Phase 3

## Completion
- [ ] Final audit against Definition of Done
- [ ] Verify all 3 phases tracked in git log
- [ ] Mark directive complete
