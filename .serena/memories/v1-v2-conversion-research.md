# SlateboxJS v1→v2 Conversion Research

## Project Layout
- `slateboxjs-v2` (this repo): SVG.js 3+ rewrite, TypeScript, Vite
- `slateboxjs` at `../slateboxjs`: Old Raphael-based v2.5.17
- `app.slatebox.com` at `../app.slatebox.com`: Meteor app consuming slateboxjs@2.5.17
- `slatebox-docs` at `../slatebox-docs`: Documentation (docs.slatebox.com)

## Key Integration Points
- App imports: `new Slatebox.slate(opts, events).init()`
- App uses: `slate.exportJSON()`, `slate.loadJSON()`, `slate.png()`, `slate.svg()`
- App collab: `slate.collab.invoke(packages)`, `slate.collab.send(packages)`
- 35+ collab event types, 40+ node options, 12+ slate events

## v1 JSON Format
```json
{ "options": {}, "nodes": [{ "options": {}, "relationships": { "associations": [] }}], "shareId": "" }
```

## Property Name Mapping
- v1 `xPos/yPos` → v2 `x/y`
- v1 `foregroundColor` → v2 `fontColor`
- v1 `shapeHint` → v2 `shape` (with vectorPath adapter)

## User Decisions (Feb 2025)
- Core library first, then app-specific features
- Collaboration built INTO library (like v1, using Yjs)
- Modernize shapes with backward-compatible adapter
