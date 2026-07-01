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
- [ ] **DECISION**: publish name — take over `slateboxjs` (as v3.x? major bump), publish as `slateboxjs-v2`, or scoped `@slatebox/js`. The Meteor app's import specifier depends on this.

Current v2 reality: exports `SlateboxJS(element, options)` factory + PascalCase classes
(`Slate`, `Node`, …) and `utils`; no `Slatebox` namespace, no lowercase aliases.
A compat facade module (e.g. `src/compat-facade.ts` exporting `Slatebox`) is the likely shape.

## B. Slate constructor & lifecycle

App usage: `const slate = await new Slatebox.slate(options, events).init()`

- [x] Constructor signature `(options, events)` — facade accepts v1 shape, resolves `options.container` element-id string (selector and direct-element fallbacks) (proof: tests/unit/compat-facade.test.ts)
- [x] `.init()` returns a Promise resolving to the slate (awaits v2 viewport readiness) (proof: unit + e2e)
- [ ] Options honored (pass-through or mapped):
  - `id`, `name`, `description`, `shareId`, `container`
  - `containerStyle: { width, height, backgroundColor, backgroundImage, backgroundSize, backgroundEffect, backgroundColorAsGradient, backgroundGradientType, backgroundGradientColors, backgroundGradientStrategy }`
  - `viewPort: { allowDrag, useInertiaScrolling, showGrid, snapToObjects, zoom }`
  - `defaultLineColor`, `showMultiSelect`, `showUndoRedo`, `showbirdsEye` (typo is canon), `showZoom`, `showLocks`, `showAddNodes`
  - `isSharing`, `isEmbedded`, `enabled`, `imageFolder`, `allowCollaboration`, `huddleType`, `mindMapMode`, `autoResizeNodesBasedOnText`, `createdViaAI`
  - `layoutType: { val, overlap, rankdir }`, `eligibleForThemeCompilation`
  - `isPublic`, `isPrivate`, `isUnlisted`, `isTemplate`, `basedOnThemeId`, `basedOnTemplate`
- [x] Events object passed as 2nd constructor arg reaches the engine (`v2Options.events = this.events`) (proof: tests/unit/compat-facade.test.ts "passes the v1 events object through")
- [ ] Events object callbacks wired (fired by the library at the right moments):
  - `onSlateChanged(pkg, collabUsers)` — PARTIAL: fires on node add/delete/text-change/drag-move with v1 pkg shape `{type, data, instanceId}` + remote-echo suppression via `beginRemoteApply` (proof: tests/e2e/compat-facade.spec.ts). Remaining: color/shape/resize/rotate/zoom/canvas-move/undo-redo emission — tracked in §F
  - `onCollaborationUsersChanged(users)`, `onCollaborationUsersRemoved(users)`, `onCollaboration(pkg)`
  - `onInitCollaboration(clientID)` → app returns `{ websocketUrl, websocketParams: {bearer, timestamp}, color, x, y, suppressCursor? }`
  - `onConfirmRequested(title, msg, cb)`
  - `onTakeSnapshot(opts)`
  - `onTextPaneRequested(node, cb)`, `onLineMenuRequested(node, association, cb)`, `onMenuRequested(nodes, cb)`
  - `onGroupSelection(selectedNodes)`
  - `onBase64ImageRequested(imgUrl, imageType, cb)`, `onOptimizeSVG(svg, cb)`
  - `onCanvasClicked()`
  - Permission checks called by the library: `isReadOnly()`, `isCommentOnly()`, `canRemoveComments()`

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
- [ ] `.collab.exe(pkg)`, `.collab.invoke(packages)`, `.collab.send(packages)`, `.collab.updateUserData(data)` (see §I)
- [x] `.png({base64: true}, callback(blob))` — facade delegates to v2 exportPNG (proof: unit; real-render quality check belongs to §K)
- [x] Properties: `.options`, `.shareId`, `.userId`, `.orgId`, `.savingTemplateImage` (proof: unit)

## D. Node constructor, methods & properties

App usage: `const node = new Slatebox.node(options)`

- [ ] Options honored: `id`, `name`, `text`, `xPos`, `yPos` (and stray `yPo` typo tolerated), `width`, `height`, `vectorPath`, `shapeHint`, `image`, `backgroundColor`, `foregroundColor`, `fontFamily`, `fontSize`, `fontStyle`, `lineColor`, `lineWidth`, `opacity`, `borderOpacity`, `allowResize`, `allowDrag`, `allowContext`, `allowMenu`, `isComment`, `disableDrag`, `textXAlign`, `textYAlign`, `filters: {vect}`
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

- [ ] Each type emitted at the right moment with `{type, data, instanceId, id?}` — DONE so far: `onNodeAdded` (data.id + v1-shaped data.nodeOptions), `onNodeDeleted` (data.id + isComment), `onNodeTextChanged` (data.id + text), `onNodesMove` (data.nodeOptions array), `onNodeColorChanged` (id + color + borderColor via setColors), `onNodeToFront`/`onNodeToBack` (id), `onZoom` ({zoomLevel} via Slate.zoom), `onCanvasMove` ({left, top, relative, orient} on panEnd), `onNodeResized` (facade resize.send) via `Slate.emitSlateChange()` (proof: tests/e2e/compat-facade.spec.ts + tests/unit/Slate.test.ts "emitSlateChange"). Remaining: `onNodeShapeChanged`, `onNodeRotated` (interactive end), `onSlateNameChanged`/`onSlateDescriptionChanged` (app-initiated — likely flow through collab.send, §I), `onMouseMoved` (awareness-only in v1, must NOT hit onSlateChanged — verified not emitted), AI/huddle types (app-initiated)
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

- [ ] **DECISION**: bridge strategy — (a) v1-wire-compatible collab adapter in v2 (speak the old websocket protocol), (b) keep yjs and update the Meteor app + collab server, or (c) facade `.collab.exe/invoke/send/updateUserData` over yjs transport with app-side URL/auth passthrough
- [ ] `.collab.exe(pkg)` applies a remote package without re-broadcast
- [ ] `.collab.invoke(packages)` applies locally + notifies `onSlateChanged`
- [ ] `.collab.send(packages)` transmits to the wire
- [ ] `.collab.updateUserData(data)` presence update
- [ ] Auth: bearer/timestamp params from `onInitCollaboration` used when connecting
- [ ] Verified against a locally-run collab server (`tests/collab-server-dev.js` exists; production-shape test against `~/Projects/node/collab.slatebox.com` in dev mode)

## J. Open-source / publication hygiene

- [x] `LICENSE` file (MIT) at repo root — added 2026-07-01; verified included in `npm pack` tarball
- [x] `CONTRIBUTING.md` extracted from README — added 2026-07-01 (workflow + quality gates + conventions)
- [x] `yjs` / `y-websocket` moved to optional `peerDependencies` (+ `peerDependenciesMeta`), kept in devDependencies for CI — done 2026-07-01; 998 unit tests + build still green
- [ ] `npm pack` tarball installs and type-checks in a fresh project (re-verify after facade work)
- [ ] README updated to document the v1-compat facade and migration path
- [ ] CHANGELOG entry for the compat facade
- [ ] **DECISION (user)**: actually publishing to npm

## K. Integration proof (definition of done)

- [x] `tests/e2e/drop-in.spec.ts`: replicates `createSlate.js` verbatim (exact opts/events shapes, "Welcome!" node, foregroundColor/xPos mapping), QuickNodeActions flow (`_transformPath` + `getBBox` + `getOrientation` + live `viewPort.zoom.r` read), SnapSlate reload + `scaleToFitAndCenter`, Mongo-shape persistence (xPos field names) — all green
- [x] Fixture-based: real slate JSON from the Meteor app loads and renders (node count, positions, connector count asserted) — tests/e2e/real-fixtures.spec.ts (§G)
- [ ] `npm link` (or `file:` dep) swap inside `~/Projects/node/slatebox`: app builds and the Canvas page loads a slate. (Requires user coordination to run Meteor; the loop should prepare everything and ask before touching the slatebox repo.)
- [x] All existing v2 tests still green: `npm test` + `npm run test:e2e` (1051 unit / 112 e2e as of iter 9; started at 998/101)

---

## Status log

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
