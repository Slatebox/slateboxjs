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
- [ ] Events object callbacks wired (fired by the library at the right moments):
  - `onSlateChanged(pkg, collabUsers)` — fires on ANY change; pkg shape `{type, data, instanceId, id?}`
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
- [ ] `.nodes.packageLayout()` — exists in v2 but on `Slate`, not `slate.nodes`
- [ ] `.nodes.applyLayout(layoutData, {skipCenter?})`
- [ ] `.nodes.nodeMovePackage({dur, moves: [{id, x, y}]})` — missing in v2
- [ ] `.canvas.hideBg(opacity)` — missing in v2
- [ ] `.controller.scaleToFitAndCenter(callback?)` — missing in v2
- [ ] `.getOrientation()` → `{width, height, left, top, orientation}` — missing in v2
- [ ] `.collab.exe(pkg)`, `.collab.invoke(packages)`, `.collab.send(packages)`, `.collab.updateUserData(data)` (see §I)
- [ ] `.png({base64: true}, callback(blob))` — used for thumbnails
- [ ] Properties: `.options`, `.shareId`, `.userId`, `.orgId`, `.savingTemplateImage`

## D. Node constructor, methods & properties

App usage: `const node = new Slatebox.node(options)`

- [ ] Options honored: `id`, `name`, `text`, `xPos`, `yPos` (and stray `yPo` typo tolerated), `width`, `height`, `vectorPath`, `shapeHint`, `image`, `backgroundColor`, `foregroundColor`, `fontFamily`, `fontSize`, `fontStyle`, `lineColor`, `lineWidth`, `opacity`, `borderOpacity`, `allowResize`, `allowDrag`, `allowContext`, `allowMenu`, `isComment`, `disableDrag`, `textXAlign`, `textYAlign`, `filters: {vect}`
- [ ] `.resize.set(w, h)` and `.resize.send()`
- [ ] `.relationships.addAssociation(otherNode)`
- [ ] `.relationships.associations` → array of `{parent, lineWidth, ...}` where `parent.options.id` resolves
- [ ] `.png(groupNodes?, callback)`
- [ ] Properties: `.options` (with `.id/.text/.xPos/.yPos/.width/.height/.vectorPath/.backgroundColor/.foregroundColor`), `.slate` backref

## E. Slatebox.utils

- [x] `guid(length?)` — exists (`src/utils.ts`)
- [x] `randomInt(min, max)` — exists
- [ ] `whiteOrBlack(hexColor)` — exists but verify return values match what the app expects (v2 returns `#ffffff`/`#000000`; check app comparisons don't expect `#fff`/`#000`)
- [x] `createMultiLineText(text, charsPerLine)` — exists
- [x] `getTextWidth(text, fontStyleString)` → `{width, height}` — exists
- [ ] `_transformPath(path, transform)` — MISSING in v2 (v1 helper for vectorPath transforms, e.g. `"T100,200 s1,1"`)
- [x] `getBBox({path})` — exists

## F. Change-package event types

`onSlateChanged` pkg `type` values the app switches on — each must be emitted with v1-compatible `data`:
`onNodeCreated`, `onNodeDeleted`, `onNodeTextChanged`, `onNodeColorChanged`, `onNodeShapeChanged`,
`onNodeAITextChanged`, `onSlateAISet`, `onSlateNameChanged`, `onSlateDescriptionChanged`,
`onNodesMove`, `onNodeToFront`, `onCanvasMove`, `onZoom`, `onMouseMoved`,
`onCollaborationUserCustomDataChanged`, `onSlateHuddleChanged`

- [ ] Each type emitted at the right moment with `{type, data, instanceId, id?}`
- [ ] `instanceId` semantics preserved (used to ignore own echoes)

## G. Persistence round-trip (Mongo `Slates` collection)

Document shape: `{_id, shareId, userId, orgId, options: {...}, nodes: [{options, relationships: {associations}}], created, lastSaved}`
saved via `Slates.upsert({_id: opts.slate.options.id}, {$set: opts.slate})`.

- [ ] `exportJSON()` output loads back via `loadJSON()` with zero loss (positions, shapes, colors, associations, shareId)
- [ ] A REAL slate document exported from the production/local slatebox Mongo loads correctly in v2 (grab fixtures from the slatebox app repo or a mongo dump; store under `tests/fixtures/real-slates/`)
- [ ] v1→v2→v1 JSON round-trip preserves the fields the Meteor app reads directly (`options.id`, node `xPos/yPos`, associations `parent.options.id`)

## H. DOM/CSS assumptions

- [ ] Renders into a bare `<div id="slateCanvas">` (the app hardcodes this id) with `height: inherit`
- [ ] No required CSS beyond the shipped stylesheet; verify the library works when the app does NOT import `slateboxjs.css` (v1 required no stylesheet — decide + document)
- [ ] Fonts: app loads `@fontsource/*`; FontLoader must not fight app-provided fonts

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

- [ ] `tests/e2e/drop-in.spec.ts`: an e2e page that replicates `createSlate.js` usage verbatim — `new Slatebox.slate(opts, events).init()` with the app's exact options/events shape, node creation via `new Slatebox.node`, associations, exportJSON/loadJSON, png export — all green
- [ ] Fixture-based: real slate JSON from the Meteor app loads and renders (node count, positions, connector count asserted)
- [ ] `npm link` (or `file:` dep) swap inside `~/Projects/node/slatebox`: app builds and the Canvas page loads a slate. (Requires user coordination to run Meteor; the loop should prepare everything and ask before touching the slatebox repo.)
- [ ] All existing v2 tests still green: `npm test` (998) + `npm run test:e2e` (101 chromium)

---

## Status log

| Date | Iteration notes |
|------|-----------------|
| 2026-07-01 | Contract established from Meteor-app audit. v2 at 998 unit / 101 e2e green. Facade layer not started. Uncommitted ResizeRotate selection-UI fix in tree. |
| 2026-07-01 | Iter 1: committed ResizeRotate selection-UI fix; §J hygiene — LICENSE (MIT), CONTRIBUTING.md, yjs/y-websocket → optional peerDependencies, author field. Gates: 998 unit, build clean, pack 42 files incl. LICENSE. Next: §A `Slatebox` namespace facade. |
| 2026-07-01 | Iter 2: §A namespace facade — src/compat-facade.ts (`Slatebox.slate/node/base/utils`, container-by-id init, nodes.add/addRange/one/allNodes, exportJSON/loadJSON delegation), exported + window.Slatebox. 17 new unit tests, 2 new e2e. Gates: 1015 unit, 103 e2e, build clean. Next: §B options/events wiring (`onSlateChanged` emission is the core of it). |
