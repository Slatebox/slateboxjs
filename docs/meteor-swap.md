# Swapping slateboxjs v3 into the Meteor app (slatebox.com)

Step-by-step for the real drop-in test at `~/Projects/node/slatebox`.
Nothing here has been executed — the slatebox repo is untouched; run these
together when ready.

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
