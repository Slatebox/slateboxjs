# Autonomous Milestones

## Phase 1: Bug Bash & Production Hardening

- [x] 1.1 Fix **ZoomSlider.ts** interval leak — add `clearInterval` to `destroy()`, store interval ID
- [x] 1.2 Fix **Slate.ts** coordinate polling leak — add `destroy()` that clears `_coordinateIntervalId` and chains to all sub-objects
- [x] 1.3 Fix **Slate.ts** canvas `on("click")` leak — remove listener in destroy
- [x] 1.4 Fix **Slate.ts** 3× setTimeout leaks — guard against firing after teardown
- [x] 1.5 Fix **Node.ts** 4× setTimeout leaks — store timeout IDs, clear in new `destroy()`
- [x] 1.6 Fix **BirdsEye.ts** document listener leak — clear mousemove/mouseup in `disable()`/`removeEventListeners()`
- [x] 1.7 Add `destroy()` to **Node.ts** — pattern: clear timeouts → `.off()` event handlers → `.remove()` SVG group → disable owned modules
- [x] 1.8 Add `destroy()` to **BirdsEye.ts** — already covered by 1.6 (disable now properly clears doc listeners)
- [x] 1.9 Add `destroy()` to **Connector.ts** — pattern: disable → clear connection data
- [x] 1.10 Add `destroy()` to **Editor.ts** — pattern: clear node references
- [x] 1.11 Add `destroy()` to **Filters.ts** — pattern: removeAll filters, clear references
- [x] 1.12 Add `destroy()` to **Images.ts** — pattern: clear image data, restore fill
- [x] 1.13 Add `destroy()` to **Invoker.ts** — pattern: null out callback references
- [x] 1.14 Add `destroy()` to **Links.ts** — pattern: unset link, clear references
- [x] 1.15 Add `destroy()` to **Menu.ts** — pattern: close menu, clear references
- [x] 1.16 Add `destroy()` to **NodesManager.ts** — pattern: clear all nodes + callbacks
- [x] 1.17 Add `destroy()` to **Collab.ts** — pattern: disconnect provider, destroy doc, clear awareness
- [x] 1.18 Add `destroy()` to **Presentation.ts** — pattern: stop presentation
- [x] 1.19 Add `destroy()` to **Relationships.ts** — pattern: removeAll associations
- [x] 1.20 Add `destroy()` to **ResizeRotate.ts** — pattern: disable select+resize plugins
- [x] 1.21 Add `destroy()` to **UndoRedo.ts** — pattern: clear stack, clear debounce timeout
- [x] 1.22 Resolve directive-2 residual issues:
  - Filters.ts outline: save original stroke before changing, restore on remove
  - Images.ts: store and use preserveAspectRatio parameter
  - Menu.ts isOpen: only set true when onMenuRequested handler registered
  - Collab.ts isConnected: removed optimistic set, rely on WebSocket status event
- [x] 1.23 Fix **drag-hop.spec.ts** flaky test — target by `data-node-id` instead of broad SVG filter
- [x] 1.23b ShapeRegistry star shape path verified correct — no typo found
- [x] 1.24 Run full `npm test` — 840/840 unit tests green
- [x] 1.25 Run full `npx playwright test --project=chromium` — 56/56 e2e tests green
- [x] 1.26 Run `npm run build` + `tsc --noEmit` — clean
- [ ] 1.27 Commit Phase 1 changes

## Phase 2: Feature Completeness Audit & Verification

- [ ] 2.1 Install yjs and y-websocket as devDependencies
- [ ] 2.2 Start local collab.slatebox.com server (or connect to production) and verify Collab.ts end-to-end
- [ ] 2.3 Fix Collab.ts `isConnected` optimistic flag — set only after WebSocket confirms
- [ ] 2.4 Add `destroy()` to Collab.ts (if not done in 1.17)
- [ ] 2.5 Write Collab e2e test — connect, send package, receive package, disconnect
- [ ] 2.6 Verify Grid.ts works end-to-end (snap-to-grid + grid rendering in browser)
- [ ] 2.7 Verify Menu.ts delegate pattern works (context menu via `onMenuRequested`)
- [ ] 2.8 Verify Presentation.ts (step-by-step mode with next/previous navigation)
- [ ] 2.9 Verify Comments.ts (create comment nodes, remove, query)
- [ ] 2.10 Verify Export.ts (SVG and PNG export produce valid files)
- [ ] 2.11 Verify Theme.ts (apply theme, verify child styles cycle correctly)
- [ ] 2.12 Verify Layout.ts (overlap removal + animated layout)
- [ ] 2.13 Verify Filters.ts (dropShadow, blur, outline apply/remove correctly)
- [ ] 2.14 Verify Links.ts (click-through navigation, URL passing)
- [ ] 2.15 Verify Images.ts (pattern-based image fill, update on resize)
- [ ] 2.16 Verify FontLoader.ts (Google Font loading, caching, dedup)
- [ ] 2.17 Verify all 17 shapes in ShapeRegistry.ts render correctly
- [ ] 2.18 Run full `npm test` + `npm run test:all` — no regressions
- [ ] 2.19 Commit Phase 2 changes

## Phase 3: npm Publish Readiness

- [ ] 3.1 Vendor svg.connectable.js: copy `src/` from sibling into `src/vendor/svg-connectable/`
- [ ] 3.2 Preserve MIT license header in all vendored files
- [ ] 3.3 Update `src/index.ts` import: `'svg.connectable.js'` → `'./vendor/svg-connectable/svg.connectable.js'`
- [ ] 3.4 Remove `"svg.connectable.js": "file:../svg.connectable.js"` from `package.json` dependencies
- [ ] 3.5 Verify build succeeds (`npm run build`) with vendored plugin
- [ ] 3.6 Verify all 840 unit tests pass with vendored plugin
- [ ] 3.7 Verify all 56 e2e tests pass with vendored plugin
- [ ] 3.8 Run `npm pack --dry-run` to verify `files` field correct
- [ ] 3.9 Run `npm pack` to produce tarball
- [ ] 3.10 Test tarball: `npm install ./slateboxjs-v2-2.0.0.tgz` in temp directory
- [ ] 3.11 Test CJS consumer: `require('slateboxjs-v2')` in Node script
- [ ] 3.12 Test ESM consumer: `import { SlateboxJS } from 'slateboxjs-v2'` in Vite project
- [ ] 3.13 Test TypeScript consumer: `tsc --noEmit` against installed types
- [ ] 3.14 Update README.md — remove file: dependency caveat, add vendoring note
- [ ] 3.15 Update CHANGELOG.md — note vendored plugin, Phase 3 changes
- [ ] 3.16 Commit Phase 3 changes (but do NOT publish to npm)

## Phase 4: Real-World Integration & Demo Showcase

- [ ] 4.1 Create `demo.html` at project root with clean, modern layout
- [ ] 4.2 Demo: node creation — buttons for Rectangle, Circle, and at least 5 other shapes
- [ ] 4.3 Demo: drag/resize/rotate — demonstrate node manipulation
- [ ] 4.4 Demo: connector system — create connections between nodes with labels
- [ ] 4.5 Demo: multi-select — shift-click to select multiple, drag-select rectangle
- [ ] 4.6 Demo: pan/zoom — scroll/pinch to zoom, two-finger to pan, zoom slider widget
- [ ] 4.7 Demo: grid — toggle grid visibility + snap-to-grid
- [ ] 4.8 Demo: themes — cycle through theme presets
- [ ] 4.9 Demo: undo/redo — undo and redo buttons with stack display
- [ ] 4.10 Demo: presentation mode — enter/exit, step through nodes
- [ ] 4.11 Demo: comments — add/remove comment nodes
- [ ] 4.12 Demo: export — SVG and PNG export buttons
- [ ] 4.13 Demo: birds-eye — minimap toggle
- [ ] 4.14 Demo: image nodes — image upload or URL-based image fill
- [ ] 4.15 Demo: collab indicator — show connection status (when collab server available)
- [ ] 4.16 Demo: keyboard shortcuts — reference display for delete, undo, redo, etc.
- [ ] 4.17 Verify `demo.html` loads clean in browser, all features functional
- [ ] 4.18 Run full test suite — no regressions
- [ ] 4.19 Final `npm run build` verification
- [ ] 4.20 Commit Phase 4 changes, update CHANGELOG with demo info
