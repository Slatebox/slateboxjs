# Swapping slateboxjs v3 into the Meteor app (slatebox.com)

Step-by-step for the real drop-in test at `~/Projects/node/slatebox`.
**Executed 2026-07-01** — the swap is live and verified (create/drag/text-
edit/reload persist; all 13 collab surfaces sync two-window). The slatebox
repo has uncommitted changes (package.json dep, +yjs/y-websocket, CSS import
in client/main.jsx) — commit them when ready.

## Verifying collab after any library change

The collab surface matrix runs in TWO environments from the same source
(`tests/e2e/collab-surfaces.shared.ts`):

```bash
# Standalone (spins up its own relay via playwright.config.ts) — no app needed
npx playwright test tests/e2e/collab-surfaces.spec.ts --project=chromium

# Against the running Meteor app on :3000 (auto-skips if the app is down)
npx playwright test tests/e2e/app-collab-surfaces.spec.ts --project=chromium
```

Both must print 13/13 ✓ (presence, add, move, text, color, resize, rotate,
toBack/toFront, association add+remove, followMe zoom, delete). Rerun after
every reinstall — remember to clear Meteor's bundler cache first (below).

## Reinstall loop gotcha

Meteor's bundler-cache keys on package VERSION, so reinstalling the same
`slateboxjs-3.0.0.tgz` serves the STALE bundle. After each rebuild:

```bash
cd ~/Projects/node/slateboxjs-v2 && npm run build && npm pack
cd ~/Projects/node/slatebox/web/app
meteor npm install ~/Projects/node/slateboxjs-v2/slateboxjs-3.0.0.tgz
rm -rf .meteor/local/bundler-cache      # <-- REQUIRED or you run the old code
# restart meteor
```

## 1. Link the local build

```bash
cd ~/Projects/node/slateboxjs-v2
npm run build && npm pack        # → slateboxjs-3.0.0.tgz

cd ~/Projects/node/slatebox/web/app
# Meteor plays poorly with symlinked node_modules; install the tarball:
meteor npm install ~/Projects/node/slateboxjs-v2/slateboxjs-3.0.0.tgz
```

(`package.json` will show `"slateboxjs": "file:../../..../slateboxjs-3.0.0.tgz"` —
revert to `"^2.4.0"` to roll back.)

## 2. One import addition (CSS)

v3 ships its stylesheet separately (v1 injected styles from JS). Add to the
app's client entry (e.g. `web/app/client/main.jsx`):

```js
import 'slateboxjs/dist/slateboxjs.css'
```

The library remains functional without it (inline attrs cover selection UI),
but menus/handles look better with it.

## 3. What should just work (already proven by e2e in this repo)

- `import { Slatebox } from 'slateboxjs'` → same namespace, same constructors
- `new Slatebox.slate(opts, events).init()` with the app's exact opts/events
- `new Slatebox.node({...})` + `slate.nodes.add/addRange/one/allNodes`
- `exportJSON`/`loadJSON` in the Mongo document shape (xPos/yPos field names)
- `Slatebox.utils.*` incl. `_transformPath`, `getBBox`, `getTextWidth` ({width,height})
- `controller.scaleToFitAndCenter`, `canvas.hideBg`, `getOrientation`,
  `viewPort.zoom.r`, `nodes.packageLayout/applyLayout/nodeMovePackage`
- `onSlateChanged` persistence flow (add/delete/text/move/color/z-order/zoom/
  canvas-move/resize), echo-suppressed for remote packages
- Collab: `onInitCollaboration` is awaited; its `websocketUrl` +
  `websocketParams` (HMAC) are used to connect. `collab.exe/invoke/send/
  updateUserData` all present.

## 4. Known app-side follow-ups (collab modernization decision)

Per `docs/collab-migration.md`:
- Replace `collab.send({type:'onMouseMoved'})` cursor path with
  `slate.collab.updateCursor(x, y)`
- Verify collab doc GC behavior against collab.slatebox.com (v3 appends
  unique map keys rather than per-node keys)

## 5. Smoke checklist (manual, in the running app)

1. `meteor npm start` → open an existing slate: nodes/connectors render at
   the right positions, background color/gradient correct
2. Create a new slate → "Welcome!" node appears; drag it → position persists
   after reload (saveSlateLite fired via onSlateChanged)
3. Double-click text edit, color change, shape menu, resize — each persists
4. Undo/redo, zoom slider, birds-eye, multi-select rectangle
5. Two browser windows on the same slate → live sync + presence avatars
6. PNG thumbnail generation (isTemplate/isEmbedded path) and SnapSlate previews
7. AI node creation (uses `_transformPath`, `getBBox`, `nodeMovePackage`)

## Rollback

```bash
cd ~/Projects/node/slatebox/web/app
meteor npm install slateboxjs@2.4.0
# remove the CSS import if added
```
