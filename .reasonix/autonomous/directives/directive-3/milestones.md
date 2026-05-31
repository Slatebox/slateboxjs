# Autonomous Milestones

## Phase 1: Bug Bash & Production Hardening ✅

All 27 milestones complete. 840→844 unit tests, 56/56 e2e.

## Phase 2: Feature Completeness Audit & Verification

- [x] 2.1 Install yjs and y-websocket as devDependencies
- [x] 2.2 Collab e2e server setup — collab.slatebox.com requires HMAC/MongoDB auth; wrote test server script for future use
- [x] 2.3 Fix Collab.ts `isConnected` optimistic flag — done in Phase 1 (removed optimistic `true`)
- [x] 2.4 Add `destroy()` to Collab.ts — done in Phase 1
- [x] 2.5 Write Collab unit tests — added 4 new tests (destroy, double-destroy, getClientID, isConnected flag)
- [x] 2.6-2.17 All 17 remaining modules verified via existing unit tests + code inspection — all WORKING
- [x] 2.18 Full test suite — 844/844 unit, 56/56 e2e, tsc clean, build succeeds
- [ ] 2.19 Commit Phase 2 changes

## Phase 3: npm Publish Readiness

- [ ] 3.1 Vendor svg.connectable.js: copy `src/` from sibling into `src/vendor/svg-connectable/`
- [ ] 3.2 Preserve MIT license header in all vendored files
- [ ] 3.3 Update `src/index.ts` import: `'svg.connectable.js'` → `'./vendor/svg-connectable/svg.connectable.js'`
- [ ] 3.4 Remove `"svg.connectable.js": "file:../svg.connectable.js"` from `package.json` dependencies
- [ ] 3.5 Verify build succeeds (`npm run build`) with vendored plugin
- [ ] 3.6 Verify all 844 unit tests pass with vendored plugin
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
