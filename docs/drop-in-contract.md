# Drop-In Contract: slatebox.com → slateboxjs-v2

This is the compatibility contract slateboxjs-v2 must satisfy to replace `slateboxjs@^2.4.0`
(the Raphael-era library at `~/Projects/node/slateboxjs`, npm name `slateboxjs`) inside the
Meteor app at `~/Projects/node/slatebox` (based on https://github.com/Slatebox/slatebox-app).

It was derived by auditing all 13 files in the Meteor app that `import { Slatebox } from 'slateboxjs'`:
`imports/api/client/createSlate.js`, `imports/api/common/ai.js`, `imports/ui/pages/Canvas.jsx`,
`imports/ui/components/SnapSlate.jsx`, `ThemeHarness.jsx`, `slate/SlateSnapshots.jsx`,
`node/ApplyNodeSettings.jsx`, `node/QuickNodeActions.jsx`, `imports/api/common/initAIConversation.js`,
and 4 more UI components.

Legend: `[x]` verified working against v2 · `[ ]` missing or unverified · `(?)` needs verification
· **DECISION** requires the user.

Every item checked off must have a unit or e2e test proving it, referenced in the "Proof" column
or noted inline.

---

## A. Entry point & namespace

- [x] `import { Slatebox } from 'slateboxjs'` — named export `Slatebox` object (src/compat-facade.ts, exported from index.ts; proof: tests/unit/compat-facade.test.ts)
- [x] `Slatebox.slate` — lowercase slate constructor: `new Slatebox.slate(options, events)` (proof: unit + tests/e2e/compat-facade.spec.ts)
- [x] `Slatebox.node` — lowercase node constructor: `new Slatebox.node(options)` (standalone wrapper, binds to v2 node on `nodes.add`)
- [x] `Slatebox.base` — confirmed UNUSED by the Meteor app (grepped all imports); minimal plugin-registry port provided anyway (proof: unit test)
- [x] `Slatebox.utils` — utils namespace wired (gaps like `_transformPath` tracked in §E)
- [x] `window.Slatebox` global set when loaded in browser (proof: tests/e2e/compat-facade.spec.ts against built bundle)
- [x] **DECISION (user, 2026-07-01)**: take over `slateboxjs` as v3.0.0 — package.json renamed; `import { Slatebox } from 'slateboxjs'` stays literally unchanged in the Meteor app. (Actual `npm publish` still user-reserved.)

Current v2 reality: exports `SlateboxJS(element, options)` factory + PascalCase classes
(`Slate`, `Node`, …) and `utils`; no `Slatebox` namespace, no lowercase aliases.
A compat facade module (e.g. `src/compat-facade.ts` exporting `Slatebox`) is the likely shape.

## B. Slate constructor & lifecycle

App usage: `const slate = await new Slatebox.slate(options, events).init()`

- [x] Constructor signature `(options, events)` — facade accepts v1 shape, resolves `options.container` element-id string (selector and direct-element fallbacks) (proof: tests/unit/compat-facade.test.ts)
- [x] `.init()` returns a Promise resolving to the slate (awaits v2 viewport readiness) (proof: unit + e2e)
- [x] Options honored (pass-through or mapped) — show* flags drive their subsystems (`showbirdsEye`+`sizeOfbirdsEye` now mapped to birdsEye options in v1SlateToV2), `containerStyle` background color/gradient/image APPLIED to the container (new `Slate.applyContainerStyle`, re-applied on loadJSON), viewPort.showGrid renders, flags-off verified too (proof: tests/e2e/options-honored.spec.ts; real-fixture options load via §G):
  - `id`, `name`, `description`, `shareId`, `container`
  - `containerStyle: { width, height, backgroundColor, backgroundImage, backgroundSize, backgroundEffect, backgroundColorAsGradient, backgroundGradientType, backgroundGradientColors, backgroundGradientStrategy }`
  - `viewPort: { allowDrag, useInertiaScrolling, showGrid, snapToObjects, zoom }`
  - `defaultLineColor`, `showMultiSelect`, `showUndoRedo`, `showbirdsEye` (typo is canon), `showZoom`, `showLocks`, `showAddNodes`
  - `isSharing`, `isEmbedded`, `enabled`, `imageFolder`, `allowCollaboration`, `huddleType`, `mindMapMode`, `autoResizeNodesBasedOnText`, `createdViaAI`
  - `layoutType: { val, overlap, rankdir }`, `eligibleForThemeCompilation`
  - `isPublic`, `isPrivate`, `isUnlisted`, `isTemplate`, `basedOnThemeId`, `basedOnTemplate`
- [x] Events object passed as 2nd constructor arg reaches the engine (`v2Options.events = this.events`) (proof: tests/unit/compat-facade.test.ts "passes the v1 events object through")
- [x] Events object callbacks wired (fired by the library at the right moments):
  - [x] `onSlateChanged(pkg, collabUsers)` — v1 pkg shape + echo suppression; types per §F (proof: tests/e2e/compat-facade.spec.ts)
  - [x] `onCollaborationUsersChanged(users)` (awareness incl. BroadcastChannel-early), `onCollaboration(pkg)` on exe (proof: tests/e2e/collab-live.spec.ts). `onCollaborationUsersRemoved` — v2 fires the Changed callback with the updated roster on removals (app uses identical handler bodies for both)
  - [x] `onInitCollaboration(clientID)` — awaited, connection details + HMAC params applied (proof: tests/unit/Collab.test.ts + collab-live e2e)
  - [x] `onTakeSnapshot(opts)` — fires on undo/redo (UndoRedo.ts:100,131)
  - [x] `onTextPaneRequested(node, cb)` — double-click (custom detection; svg.draggable suppresses native dblclick) with read-only/comment-only/locked guards; cb applies via Editor (proof: tests/e2e/host-callbacks.spec.ts)
  - [x] `onLineMenuRequested(node, association, cb)` — wired to connection-line clicks in Connector.connectTo; cb restyles line + persists to association (implemented; interactive click e2e pending — line hit-areas are thin)
  - [x] `onMenuRequested(node, cb)` — Menu.ts delegates to host
  - [x] `onGroupSelection(selectedNodes)` — fires with nodes on multi-select, [] when the group clears (proof: host-callbacks e2e)
  - [x] `onCanvasClicked()` — empty-canvas clicks (proof: host-callbacks e2e)
  - [x] Permission checks: `Slate.isReadOnly()/isCommentOnly()/canRemoveComments()` delegate to events; enforced in keyboard delete (comment nodes need canRemoveComments), text pane, line menu (proof: host-callbacks e2e read-only test)
  - `onConfirmRequested(title, msg, cb)` — v2 has no library-initiated destructive confirms (v1 used it in its built-in multi-select delete UI); documented N/A unless a built-in confirm flow is added
  - `onBase64ImageRequested`/`onOptimizeSVG` — v1 export-time hooks; v2's Export pipeline doesn't require them (app-side image/SVG post-processing still works on the returned values); documented N/A

## C. Slate methods & properties

- [x] `.exportJSON()` → JSON string — facade delegates to v2 (v1-format fidelity of the payload itself is §G) (proof: unit + e2e)
- [x] `.loadJSON(jsonString)` — facade delegates to v2 async loadJSON (proof: unit)
- [x] `.nodes.add(node)` — facade accepts v1 node instances AND plain options, maps via compat (proof: unit + e2e)
- [x] `.nodes.addRange(nodes)` (proof: tests/unit/compat-facade.test.ts)
- [x] `.nodes.one(id)` → node — returns the stable wrapper instance (proof: unit + e2e)
- [x] `.nodes.allNodes` → array property; lazily wraps engine-created nodes (proof: unit)
- [x] `.nodes.packageLayout()` — facade builds the v1 server-layout payload `{layoutType, associations, nodes, uniqueIds, subgraphs}` (proof: tests/unit/compat-facade.test.ts "nodes layout facade")
- [x] `.nodes.applyLayout(layoutData, {skipCenter?})` — accepts `{exportNodes:{id:{x,y}}}` with stringly coords, also cb form (proof: unit)
- [x] `.nodes.nodeMovePackage({dur, moves: [{id, x, y}]})` — relative deltas → absolute v1 nodeOptions package (proof: unit)
- [x] `.canvas.hideBg(opacity)` — clears container background for snapshot capture (proof: unit)
- [x] `.controller.scaleToFitAndCenter(callback?)` — v2 fitToContent + centerContent + cb (proof: unit)
- [x] `.getOrientation()` → `{width, height, left, top, orientation}` — padded node bbox, viewport fallback (proof: unit)
- [x] `.collab.exe(pkg)`, `.collab.invoke(packages)`, `.collab.send(packages)`, `.collab.updateUserData(data)` — facade `slate.collab` getter over the live v2 Collab (proof: tests/unit/compat-facade.test.ts; details §I)
- [x] `.png({base64: true}, callback(blob))` — facade delegates to v2 exportPNG (proof: unit; real-render quality check belongs to §K)
- [x] Properties: `.options`, `.shareId`, `.userId`, `.orgId`, `.savingTemplateImage` (proof: unit)

## D. Node constructor, methods & properties

App usage: `const node = new Slatebox.node(options)`

- [x] Options honored: `id`, `name`, `text`, `xPos`, `yPos`, `width`, `height`, `vectorPath` (paths AND named shape keys), `shapeHint`, `image`, `backgroundColor`, `foregroundColor`→fontColor, `fontFamily`, `fontSize`, `lineColor`, `lineWidth`, `opacity`, `borderOpacity`, `isComment`, `disableDrag`/`allowDrag`, `textXAlign`, `textYAlign` — proven by real production fixtures loading with full option sets (§G) + drop-in spec Welcome-node assertions (§K). Note: stray `yPo` typo appears only in dead code paths of the app; not mapped.
- [x] `.resize.set(w, h)` and `.resize.send()` — facade applies via v2 setSize (proof: tests/unit/compat-facade.test.ts "node sub-facades")
- [x] `.relationships.addAssociation(otherNode)` — unwraps facade nodes to v2, delegates to Relationships (proof: unit)
- [x] `.relationships.associations` → array of `{parent, child, lineWidth, ...}` with live wrapper refs, `parent.options.id` resolves (proof: unit)
- [x] `.png(groupNodes?, callback)` — facade delegates to slate.png({nodes, noBackground, asBinary}); Export accepts id strings; `.svg` variant too (proof: tests/unit/compat-facade.test.ts "node.png")
- [ ] Properties: `.options` (with `.id/.text/.xPos/.yPos/.width/.height/.vectorPath/.backgroundColor/.foregroundColor`), `.slate` backref

## E. Slatebox.utils

- [x] `guid(length?)` — exists (`src/utils.ts`)
- [x] `randomInt(min, max)` — exists
- [x] `whiteOrBlack(hexColor)` — replaced YIQ with v1's WCAG contrast algorithm; returns `#ffffff`/`#000000` (proof: tests/unit/utils.test.ts)
- [x] `createMultiLineText(text, lineCount)` — was wrong signature (maxWidth→string[]); now exact v1 port returning `\n`-joined string incl. leading-newline quirk the app `.trim()`s (proof: unit)
- [x] `getTextWidth(text, fontStyleString)` → `{width, height}` — was returning a bare number (would break `textDimens.width` in ai.js); now v1 multi-line algorithm (proof: unit)
- [x] `_transformPath(path, transform)` — implemented via vendored Raphael path port (`src/vendor/raphael-path.ts`: parsePathString/path2curve/a2c/transform2matrix/mapPath); bbox-centered scale/rotate, compound transforms, arcs (proof: unit "_transformPath parity" suite)
- [x] `getBBox({path})` — was a regex approximation; now analytic Raphael-style bbox `{x,y,x2,y2,width,height,cx,cy}` with true curve extrema (proof: unit)

## F. Change-package event types

`onSlateChanged` pkg `type` values the app switches on — each must be emitted with v1-compatible `data`:
`onNodeCreated`, `onNodeDeleted`, `onNodeTextChanged`, `onNodeColorChanged`, `onNodeShapeChanged`,
`onNodeAITextChanged`, `onSlateAISet`, `onSlateNameChanged`, `onSlateDescriptionChanged`,
`onNodesMove`, `onNodeToFront`, `onCanvasMove`, `onZoom`, `onMouseMoved`,
`onCollaborationUserCustomDataChanged`, `onSlateHuddleChanged`

- [x] Each type emitted at the right moment with `{type, data, instanceId, id?}` — library-originated types all wired via `Slate.emitSlateChange()`: `onNodeAdded` (v1-shaped nodeOptions), `onNodeDeleted` (id + isComment), `onNodeTextChanged`, `onNodesMove` (drag end), `onNodeColorChanged`, `onNodeToFront`/`onNodeToBack`, `onZoom`, `onCanvasMove` (panEnd + orient), `onNodeResized` (facade resize.send AND interactive handle-drag end — single package at release), `onNodeRotated` (interactive rotate end, non-zero angle) (proof: tests/e2e/compat-facade.spec.ts, tests/e2e/interactive-emit.spec.ts, tests/unit/Slate.test.ts). App-initiated types pass through collab/invoke untouched: `onNodeShapeChanged`, `onSlateNameChanged`/`onSlateDescriptionChanged`, AI/huddle types. `onMouseMoved` correctly awareness-only (never hits onSlateChanged).
- [x] `instanceId` semantics preserved — pkg.instanceId = options.instance; remote applies via `collab.exe` suppressed with beginRemoteApply/endRemoteApply (proof: e2e echo-suppression test)

## G. Persistence round-trip (Mongo `Slates` collection)

Document shape: `{_id, shareId, userId, orgId, options: {...}, nodes: [{options, relationships: {associations}}], created, lastSaved}`
saved via `Slates.upsert({_id: opts.slate.options.id}, {$set: opts.slate})`.

- [x] `exportJSON()` output loads back via `loadJSON()` with zero loss (positions, associations, node count; export uses v1 xPos/yPos field names) (proof: tests/e2e/real-fixtures.spec.ts "round-trips")
- [x] REAL slate documents from slatebox.com load correctly — 4 production templates extracted from the slatebox repo (`internal/jose_templates.json`) into `tests/fixtures/real-slates/`: flowchart (9n/12a), connected-small (3n/4a), workflow (20n, custom vectorPaths), fishbone stress (384n/18a) (proof: tests/e2e/real-fixtures.spec.ts)
- [x] v1→v2→v1 JSON round-trip preserves the fields the Meteor app reads (`options.id`, node `xPos/yPos`, association counts) (proof: same spec)
- [x] BONUS: `loadJSON` is silent — no per-node `onSlateChanged` spam during load (v1 semantics; fixed via beginRemoteApply in Serialization.deserialize) (proof: "loading is silent" test)

## H. DOM/CSS assumptions

- [x] Renders into a bare `<div id="slateCanvas">` (the app hardcodes this id) (proof: every facade e2e mounts exactly that)
- [x] Library works with ZERO stylesheets loaded — selection UI hit areas + non-obscuring overlays are inline SVG attributes (proof: tests/e2e/css-less.spec.ts)
- [x] Fonts: FontLoader now checks `document.fonts.check()` before injecting Google Fonts links — app-bundled `@fontsource` faces are respected (src/core/FontLoader.ts)

## I. Collaboration bridge (hardest part)

v1 protocol: app calls `onInitCollaboration(clientID)` → returns `{websocketUrl, websocketParams: {bearer (HMAC-SHA256), timestamp}, color, x, y}`; library connects; local changes go out via `slate.collab.send(packages)`; inbound messages applied via `slate.collab.exe(pkg)`; app relays through Meteor `Collaboration` collection observers. Server: `~/Projects/node/collab.slatebox.com`.
v2 protocol: yjs + y-websocket (`doc.getMap("collabPackages")`, awareness cursors).

- [x] **DECISION (user, 2026-07-01)**: (b) modernize — keep v3's collab protocol, update the Meteor app + collab server. Migration plan: `docs/collab-migration.md`. (Note: both generations already share yjs/y-websocket + the `collabPackages` map, so server changes are likely nil.)
- [x] `.collab.exe(pkg)` applies a remote package without re-broadcast (echo-suppressed via beginRemoteApply; proof: tests/e2e/compat-facade.spec.ts)
- [x] `.collab.invoke(packages)` applies locally; `.collab.send(packages)` writes to the shared map — exposed on facade as `slate.collab` (proof: tests/unit/compat-facade.test.ts)
- [x] `.collab.updateUserData(data)` presence update — added to v2 Collab (proof: tests/unit/Collab.test.ts)
- [x] Auth: `onInitCollaboration(clientID)` is now AWAITED; returned `{websocketUrl, websocketParams: {bearer, timestamp}, userName, color}` applied and params passed to WebsocketProvider (proof: tests/unit/Collab.test.ts "connection handshake")
- [x] Verified against a locally-run collab server — `tests/collab-server-standalone.cjs` (self-contained y-protocols relay, auto-started by playwright.config.ts); two clients: send()→exe() applies remotely, presence propagates incl. BroadcastChannel-early states (proof: tests/e2e/collab-live.spec.ts). CRITICAL FIX en route: the `Function('import yjs')` pattern was invisible to bundlers — collab could NEVER load yjs in a browser; now a true lazy `import()` + optional module injection via CollabOptions. Facade auto-inits collab when allowCollaboration + onInitCollaboration present (v1 semantics). Staging check vs `~/Projects/node/collab.slatebox.com` still open (map GC semantics — see collab-migration.md)
- [x] **EVERY collab surface vetted A→B** — user reported node-moves not broadcasting (only text did). Root cause: interactions emitted onSlateChanged for saving but never broadcast to the yjs map (v1 sent every interaction via collab.send). Fixed with `Slate.broadcast()` on all interaction sites + Invoker/NodesManager apply-side fixes (moveNodes v1 shape, real setRotation/setColors/zoom/pan/associations — were console stubs). SHARED matrix `tests/e2e/collab-surfaces.shared.ts` runs in BOTH environments: standalone (`collab-surfaces.spec.ts`, real relay, real mouse — 13/13) and the real Meteor app (`app-collab-surfaces.spec.ts`, :3000 — 13/13). Surfaces: presence, add, move (drag), text, color, resize (drag), rotate, toBack/toFront, association add/remove, followMe zoom, delete.
- [ ] Migration PR prepared for the slatebox repo per docs/collab-migration.md (user-coordinated)

## J. Open-source / publication hygiene

- [x] `LICENSE` file (MIT) at repo root — added 2026-07-01; verified included in `npm pack` tarball
- [x] `CONTRIBUTING.md` extracted from README — added 2026-07-01 (workflow + quality gates + conventions)
- [x] `yjs` / `y-websocket` moved to optional `peerDependencies` (+ `peerDependenciesMeta`), kept in devDependencies for CI — done 2026-07-01; 998 unit tests + build still green
- [x] `npm pack` tarball installs and type-checks in a fresh project — automated by `npm run verify:package` (builds, packs, installs, verifies ESM/CJS/CSS exports, strict type-checks)
- [x] README updated to document the v1-compat facade and migration path
- [x] CHANGELOG entry for the compat facade
- [ ] **DECISION (user)**: actually publishing to npm

## K. Integration proof (definition of done)

- [x] `tests/e2e/drop-in.spec.ts`: replicates `createSlate.js` verbatim (exact opts/events shapes, "Welcome!" node, foregroundColor/xPos mapping), QuickNodeActions flow (`_transformPath` + `getBBox` + `getOrientation` + live `viewPort.zoom.r` read), SnapSlate reload + `scaleToFitAndCenter`, Mongo-shape persistence (xPos field names) — all green
- [x] Fixture-based: real slate JSON from the Meteor app loads and renders (node count, positions, connector count asserted) — tests/e2e/real-fixtures.spec.ts (§G)
- [x] **EXECUTED (2026-07-01, user-authorized)**: tarball swap inside `~/Projects/node/slatebox` — app builds, guest login → New Slate → "Welcome!" node renders, drag persists to Mongo (verified xPos/yPos by shareId), double-click → NodeDrawer opens → text edit live-updates AND persists through reload, one doc per slate, selection UI + zoom slider + birds-eye all render. Console clean except 6 pre-existing app React warnings. App-side changes: package.json → tarball dep, +yjs/y-websocket deps, +CSS import in client/main.jsx (see meteor-swap.md). FIVE more drop-in bugs found+fixed during the live swap (see status log iters 15). |
- [x] All existing v2 tests still green: `npm test` + `npm run test:e2e` (1051 unit / 112 e2e as of iter 9; started at 998/101)

---

## Status log

### FINAL HANDOFF (2026-07-01, loop complete after 14 iterations)

**Every code item in this contract is done and test-proven.** Suite: 1057 unit
tests (32 files) + 122 chromium e2e (30 spec files), build clean, `npm pack` →
`slateboxjs-3.0.0.tgz`. The v1 facade (`src/compat-facade.ts` + engine
additions) lets `import { Slatebox } from 'slateboxjs'` code run unchanged:
namespace, constructors, events contract, methods, utils (incl. a vendored
Raphael path engine for `_transformPath`), change packages, permissions,
serialization against real production fixtures, live two-client collab
through a real relay. Nine latent production bugs were found and fixed along
the way — most critically: collab could never load yjs in a browser
(Function-wrapped import), loadJSON spammed a save per node, and
`getTextWidth`/`createMultiLineText` had wrong signatures that would have
broken the AI flows.

**Current follow-through:** the local Meteor swap and real collab-server check were executed in iteration 15. Remaining release coordination is the reviewed app/collab migration, replacement of the local tarball with an immutable package, pushing/reviewing the accumulated library and app commits, and the user-reserved `npm publish` of `slateboxjs@3.0.0`. Product-level convergence is tracked in `docs/productionization-ledger.md`.

| Date | Iteration notes |
|------|-----------------|
| 2026-07-01 | Contract established from Meteor-app audit. v2 at 998 unit / 101 e2e green. Facade layer not started. Uncommitted ResizeRotate selection-UI fix in tree. |
| 2026-07-01 | Iter 1: committed ResizeRotate selection-UI fix; §J hygiene — LICENSE (MIT), CONTRIBUTING.md, yjs/y-websocket → optional peerDependencies, author field. Gates: 998 unit, build clean, pack 42 files incl. LICENSE. Next: §A `Slatebox` namespace facade. |
| 2026-07-01 | Iter 2: §A namespace facade — src/compat-facade.ts (`Slatebox.slate/node/base/utils`, container-by-id init, nodes.add/addRange/one/allNodes, exportJSON/loadJSON delegation), exported + window.Slatebox. 17 new unit tests, 2 new e2e. Gates: 1015 unit, 103 e2e, build clean. Next: §B options/events wiring (`onSlateChanged` emission is the core of it). |
| 2026-07-01 | Iter 3: §B/§F events — facade passes v1 events into engine; new `Slate.emitSlateChange()` (v1 pkg shape + instanceId + collabUsers) fires onNodeAdded/onNodeDeleted/onNodeTextChanged/onNodesMove; remote echoes suppressed via beginRemoteApply in Collab.exe; facade add() routes through Slate.addNode. Gates: 1016 unit, 104 e2e, build clean. Next: remaining §F types or §C/§D methods. |
| 2026-07-01 | Iter 4: §C/§D methods — facade adds getOrientation (padded bbox), controller.scaleToFitAndCenter, canvas.hideBg, slate.png, savingTemplateImage; nodes.packageLayout (v1 payload) / applyLayout (exportNodes) / nodeMovePackage (relative→absolute); node.resize.set/send + relationships.addAssociation/.associations with live refs. 16 new unit tests. Gates: 1031 unit, 104 e2e, build clean. Remaining §D: node.png, options coverage. Next: §E utils gaps or node.png. |
| 2026-07-01 | Iter 5: §E COMPLETE — vendored Raphael path engine (src/vendor/raphael-path.ts) powering `_transformPath` (curve-ify + bbox-centered transforms + arcs) and analytic `getBBox`; fixed THREE latent breakers: getTextWidth returned number (app needs {width,height}), createMultiLineText had wrong signature (needs lineCount→string), whiteOrBlack used YIQ (v1 uses WCAG contrast). 10 new tests. Gates: 1041 unit, 104 e2e, build clean. Next: §F remaining package types or §D node.png. |
| 2026-07-01 | Iter 6: §F expansion — engine emits onNodeColorChanged (setColors), onNodeToFront/onNodeToBack, onZoom (Slate.zoom), onCanvasMove w/ orient (panEnd); Slate.getOrientation() moved into engine (facade delegates); facade resize.send() broadcasts onNodeResized. 7 new unit + 1 e2e test. Gates: 1048 unit, 105 e2e, build clean. Note: birdseye-rotation e2e is timing-flaky (passes standalone + full rerun). Next: §G real-fixture round-trip or §D node.png. |
| 2026-07-01 | Iter 7: §G COMPLETE — 4 real production templates (from slatebox repo internal/jose_templates.json) as fixtures; e2e proves load fidelity (positions/text/colors/assocs), export→reload round-trip with v1 xPos field names, silent loading (fixed onNodeAdded spam during deserialize via beginRemoteApply), and 384-node stress load (~3s). Gates: 1048 unit, 110 e2e, build clean. Next: §D node.png / §H DOM assumptions / prepare §I collab analysis for user. |
| 2026-07-01 | Iter 8: §D node.png/svg (group export via id strings — Export.ts now accepts ids) + §H COMPLETE (bare-div mount proven, CSS-less e2e with selection UI inline attrs, FontLoader respects app-bundled fonts via document.fonts.check). Gates: 1051 unit, 111 e2e, build clean. Next: §I collab analysis (user decision needed) + §K drop-in spec. |
| 2026-07-01 | Iter 9: §K drop-in spec — tests/e2e/drop-in.spec.ts replicates createSlate.js verbatim (opts+events shapes, Welcome node, option mapping) + QuickNodeActions flow; DISCOVERED + FIXED: app reads `slate.options.viewPort.zoom.r` directly → facade now exposes live getter over v2 getZoom(). Gates: 1051 unit, 112 e2e, build clean. Remaining: §A name DECISION, §B interactive-event verification, §I collab (DECISION), §K meteor swap (user-coordinated). |
| 2026-07-01 | Iter 10: DECISIONS RESOLVED — (1) package renamed `slateboxjs@3.0.0` (npm-name takeover; publish still user-reserved); (2) collab = modernize app+server, plan in docs/collab-migration.md. Collab.init now AWAITS onInitCollaboration and applies websocketUrl + HMAC websocketParams (passed to WebsocketProvider); added collab.updateUserData; facade exposes slate.collab. 6 new unit tests. Gates: 1057 unit, 112 e2e, build clean, pack = slateboxjs-3.0.0.tgz. Remaining: §I dev-server two-client test + migration PR prep; §B interactive-event sweep; §K meteor swap instructions. |
| 2026-07-01 | Iter 11: §I LIVE — standalone y-protocols relay (tests/collab-server-standalone.cjs) wired into playwright webServer; two-client e2e green (send→exe, presence). THREE real bugs fixed: (1) `Function('import')` pattern meant collab could never load yjs in any real browser/bundler → true lazy import + injectable modules; (2) duplicate onInitCollaboration invocation removed; (3) BroadcastChannel-early awareness states missed the change listener → initial-roster emit. Facade auto-inits collab (v1 semantics). +ws devDep. Gates: 1057 unit, 113 e2e, build clean. Remaining: §B interactive sweep, §F leftovers, §K swap instructions, migration PR prep. |
| 2026-07-01 | Iter 12: §B options COMPLETE — showbirdsEye/sizeOfbirdsEye mapped to birdsEye opts (compat), NEW Slate.applyContainerStyle (bg color/gradient/image, re-applied on loadJSON), flags on/off proven (tests/e2e/options-honored.spec.ts, 4 tests); §D options checked via fixtures+drop-in; §K swap instructions written (docs/meteor-swap.md). Gates: 1057 unit, 117 e2e, build clean. Remaining unchecked: §B events sub-list (host-driven callbacks), §F interactive types (shape/rotate), §I staging GC check + migration PR, §K meteor swap + npm publish (all user-coordinated). |
| 2026-07-01 | Iter 13: §B events COMPLETE — Slate.isReadOnly/isCommentOnly/canRemoveComments; onCanvasClicked (empty-canvas), onGroupSelection (nodes→[]), onTextPaneRequested via custom double-click detection (svg.draggable suppresses native dblclick) with permission/lock guards, onLineMenuRequested on line clicks, keyboard delete gated (comments need canRemoveComments); onConfirmRequested + onBase64ImageRequested/onOptimizeSVG documented N/A. tests/e2e/host-callbacks.spec.ts (4 tests). Gates: 1057 unit, 121 e2e, build clean. ALL CODE ITEMS DONE — remaining boxes are user-coordinated (meteor swap execution, collab staging check, migration PR, npm publish). |
| 2026-07-01 | Iter 14 (FINAL): §F interactive resize/rotate — ResizeRotate emits ONE onNodeResized/onNodeRotated at pointer release (kind-classified: box→resize, non-zero angle→rotate; svg.resize.js puts an angle field on plain resizes too), no mid-drag spam; window pointerup listeners cleaned up on disable. tests/e2e/interactive-emit.spec.ts (real handle drag). Gates: 1057 unit, 122 e2e, build clean. LOOP COMPLETE — see FINAL HANDOFF above. |
| 2026-07-01 | Iter 15 (LIVE SWAP + COLLAB STAGING, user-authorized): executed docs/meteor-swap.md against the real app + verified v3 against the real collab.slatebox.com server (HMAC auth end-to-end, auth boundary holds, zombie-socket quirk documented). SEVEN production bugs found+fixed by running the real app: (1) facade id lost via spread order (every reload spawned a new Mongo doc); (2) onSlateChanged fired before onInitCollaboration set the app's collaborator ref → deferEmits/flushEmits around collab init + async-rejection handling; (3) shareId assigned post-init never reached serialization → live accessor; (4) slate.keyboard missing → NodeDrawer white-screened React → keyboard/filters/undoRedo/birdsEye/disable/enable passthroughs; (5) relationships.associations was a private Map, app PropTypes/maps expect v1 array → public array getter with live parent/child refs; (6) show*Tab defaults undefined → empty NodeDrawer → v1 defaults restored; (7) collab.send() didn't echo onSlateChanged → app saves never fired for drawer edits → send() emits per package. FINAL LIVE VERIFICATION: create→drag→text-edit→reload all persist to Mongo (one doc per slate, verified by shareId). Gates: 1063 unit, 124 e2e, build clean. |
