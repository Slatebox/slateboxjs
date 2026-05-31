# Autonomous Milestones

## Phase 1: Quality Gates — Fix Every Failure + CI Hardening

### Fix 8 Failing E2E Tests
- [ ] 1.1 Fix `export.spec.ts` — use `slate.svg()` instead of `slate.exportSVG()`, `slate.png()` instead of `slate.exportPNG()`
- [ ] 1.2 Fix `undo-redo.spec.ts` (3 tests) — add `forceSnapshot()` to UndoRedo, call it after `addNode` before `undo`
- [ ] 1.3 Fix `keyboard.spec.ts` (1 test) — same debounce fix (forceSnapshot after addNode)
- [ ] 1.4 Fix `images.spec.ts` (1 test) — correct URL from `picsum` to `picsum.photos`
- [ ] 1.5 Fix `layout.spec.ts` (1 test) — add nodes in `beforeEach` before testing positions
- [ ] 1.6 Verify all 101 e2e tests pass on chromium: `npx playwright test --project=chromium`

### UndoRedo API Improvement
- [ ] 1.7 Add `forceSnapshot()` method to `UndoRedo.ts` — immediate snapshot bypassing debounce, for programmatic use
- [ ] 1.8 Update UndoRedo unit tests to cover `forceSnapshot()`

### CI Hardening
- [ ] 1.9 Install Playwright chromium in CI: `npx playwright install chromium --with-deps`
- [ ] 1.10 Add `npx playwright test --project=chromium` step to CI workflow
- [ ] 1.11 Add `npm pack --dry-run` verification step to CI
- [ ] 1.12 Add Firefox + WebKit browser installs + test matrix (optional job, non-blocking)

### Cross-Browser Verification
- [ ] 1.13 Install Firefox + WebKit browsers: `npx playwright install firefox webkit`
- [ ] 1.14 Run e2e suite on Firefox: `npx playwright test --project=firefox`
- [ ] 1.15 Run e2e suite on WebKit: `npx playwright test --project=webkit`
- [ ] 1.16 Fix any cross-browser failures discovered (SVG namespace, CSS, event differences)
- [ ] 1.17 Document known cross-browser limitations if any remain

### Phase 1 Verification
- [ ] 1.18 Full test suite: 994+ unit + 101+ e2e on chromium green
- [ ] 1.19 `tsc --noEmit` clean, `npm run build` succeeds
- [ ] 1.20 CI config updated and verified
- [ ] 1.21 Commit Phase 1

## Phase 2: Developer UX — JSDoc Coverage + API Surface Polish

### Node.ts JSDoc (35 methods + constructor)
- [ ] 2.1 Constructor JSDoc: `@param options`, `@param slate`, description of the async initialization
- [ ] 2.2 Lifecycle methods: `destroy()`, `remove()`, `hide()`, `show()` (4 methods)
- [ ] 2.3 Position/size: `position()`, `setSize()`, `toFront()`, `toBack()` (4 methods)
- [ ] 2.4 Text content: `setText()`, `centerText()` (2 methods)
- [ ] 2.5 Appearance: `setColors()` (1 method)
- [ ] 2.6 Locking: `lock()`, `unlock()` (2 methods)
- [ ] 2.7 Resize/rotate delegation: `enableResizeRotate()`, `disableResizeRotate()`, `enableResize()`, `disableResize()`, `enableRotate()`, `disableRotate()`, `isResizeRotateEnabled()` (7 methods)
- [ ] 2.8 Rotation: `setRotation()`, `getRotation()` (2 methods)
- [ ] 2.9 Connector delegation: `enableConnector()`, `enableConnectorWithInteractive()`, `disableConnector()`, `connectTo()`, `disconnectFrom()`, `disconnectAll()`, `getConnections()`, `getConnection()`, `isConnectorEnabled()` (9 methods)
- [ ] 2.10 Selection: `onSelected()`, `onDeselected()` (2 methods)
- [ ] 2.11 Connection handles: `enableConnectionHandles()`, `disableConnectionHandles()`, `isConnectionHandlesEnabled()` (3 methods)
- [ ] 2.12 Add `@example` tags to 3+ key methods (constructor, `position()`, `connectTo()`)

### Slate.ts JSDoc (34 methods)
- [ ] 2.13 Node management: `removeNode()`, `getNode()`, `getAllNodes()` (3 methods)
- [ ] 2.14 Viewport: `getViewport()`, `getViewportAsync()` (2 methods)
- [ ] 2.15 Pan/zoom delegation (25 methods): one-liner JSDoc for each (`enablePanZoom`, `disablePanZoom`, `enablePan`, `disablePan`, `enableZoom`, `disableZoom`, `pan`, `panBy`, `zoom`, `zoomBy`, `zoomIn`, `zoomOut`, `zoomAtPoint`, `resetPanZoom`, `resetZoom`, `resetPan`, `fitToContent`, `centerContent`, `getZoom`, `getPan`, `resizePanZoom` — 21 methods; + `updateSelectionResizeRotate`, `enableNodeResizeRotate`, `disableNodeResizeRotate`, `selectNode`, `deselectNode`, `clearSelection` — 6 methods)
- [ ] 2.16 Selection: `selectNode()`, `deselectNode()`, `clearSelection()`, `getSelectedNodes()`, `getSelectedNode()` (5 methods)
- [ ] 2.17 Add `@example` tags to 2+ key methods (`selectNodes()`, `exportJSON()`)

### Other Module JSDoc
- [ ] 2.18 PanZoom.ts: constructor + `zoom()`, `zoomIn()`, `zoomOut()`, `pan()`, `getZoom()`, `getPan()`, `destroy()`, `enable()`, `disable()`, `resize()`, `isInitialized()` (11 methods)
- [ ] 2.19 Connector.ts: constructor + `enable()`, `disable()`, `connectTo()`, `disconnectFrom()`, `disconnectAll()`, `destroy()` (7 methods)
- [ ] 2.20 ResizeRotate.ts: constructor + `enable()`, `disable()`, `destroy()`, `isEnabled()` (5 methods)

### API Surface Fixes
- [ ] 2.21 Export `SlatePackage` type from `src/index.ts`
- [ ] 2.22 Verify no other commonly-needed types are missing from index.ts exports

### Phase 2 Verification
- [ ] 2.23 `tsc --noEmit` clean — JSDoc additions don't break types
- [ ] 2.24 All 994+ unit + 101+ e2e tests pass
- [ ] 2.25 `npm run build` succeeds
- [ ] 2.26 Commit Phase 2

## Phase 3: Accessibility Foundations

### Canvas-Level
- [ ] 3.1 Add `role="img"` and `aria-label` to SVG canvas element in `Slate.ts`
- [ ] 3.2 Add hidden `aria-describedby` description of the diagram

### Node-Level Accessibility
- [ ] 3.3 Add `tabindex="0"` and `role="button"` to node SVG groups in `Node.ts`
- [ ] 3.4 Add `aria-label` to each node using `node.options.text` or generated label
- [ ] 3.5 Add `:focus-visible` CSS outline style for focused nodes (in `src/styles/`)
- [ ] 3.6 Implement arrow key navigation in `Keyboard.ts`: right/down = next node by position, left/up = previous node
- [ ] 3.7 Enter/Space to select focused node via keyboard
- [ ] 3.8 Escape to deselect focused node and return focus to canvas

### Screen-Reader Announcements
- [ ] 3.9 Add hidden `aria-live="polite"` region to the DOM in `Slate.ts`
- [ ] 3.10 Announce node add: "Node added: [text]"
- [ ] 3.11 Announce node remove: "Node removed: [text]"
- [ ] 3.12 Announce selection change: "N nodes selected"
- [ ] 3.13 Announce zoom change: "Zoom: 150%"
- [ ] 3.14 Create helper utility `announce(msg: string)` for live region updates

### Keyboard Shortcuts Reference
- [ ] 3.15 Add `?` key handler to show keyboard shortcuts in demo or console
- [ ] 3.16 Add keyboard shortcuts list to demo.html sidebar

### Demo Page Updates
- [ ] 3.17 Add `aria-label` to all sidebar buttons in demo.html
- [ ] 3.18 Add focus-visible styles to demo.html buttons

### Phase 3 Verification
- [ ] 3.19 All existing interaction behavior preserved — drag, resize, rotate, connect still work
- [ ] 3.20 Arrow key navigation works in browser on demo.html
- [ ] 3.21 Screen-reader announcements fire correctly
- [ ] 3.22 Focus ring visible on focused nodes
- [ ] 3.23 994+ unit + 101+ e2e pass, tsc clean, build succeeds
- [ ] 3.24 Commit Phase 3

## Completion
- [ ] Final audit against Definition of Done (24 criteria)
- [ ] Verify all 3 phases tracked in git log
- [ ] Update README with accessibility notes and JSDoc coverage
- [ ] Mark directive complete
