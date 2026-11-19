# Changelog

## [Unreleased]

### Added

- **Workshops can run as native notes on a live slate.** `attachWorkshop(slate, workshop, options)`
  (from `slateboxjs/workshops/model`, plain JavaScript) draws a workshop model onto a Slate the host
  already has: lanes, captions and cards are real notes with the canvas's own pan, zoom, minimap,
  selection and inline editing. A card dragged to a lane it may enter previews the outcome on the
  lane captions and commits through `onChange`; a full or forbidden lane refuses, the card glides
  back and the reason is shown on the lane and given to `onRefuse`. The notes are a drawing of the
  model and are never saved, broadcast or put in undo history. See `docs/native-workshops.md`.
- **Host drag policies.** `slate.setDragPolicy(policy)` lets a host govern chosen notes: refuse a
  drag, watch it, accept or refuse the drop and say where the note settles, and decide per note
  whether it may be resized, rotated, deleted, duplicated, connected, edited or selected. Also
  `slate.hitTestNodes`, `slate.clientToWorld` and `slate.worldToClient`.
- `workshopCandidate`, `workshopDestinations`, `workshopRefusal` and `workshopLaneCaption` in the
  workshop model; `workshopToSlate(model, { native: true })` for the native artwork (its output with
  no options is unchanged); `dragologyCandidates` to let the SVG board's Dragology spec choose the
  candidate on a native slate.

### Changed
- A connected note is ready to name the moment it is created. Clicking or tapping
  a connector, dragging one into open space, or activating a keyboard direction
  button now selects the new note and opens its editor with the caret in it, so
  the next thing typed is its name. Enter commits; Escape or clicking away with
  nothing typed leaves the note blank, as before. Notes that arrive any other way
  (`addNode`, `loadJSON`, collaborators, paste, duplicate, undo/redo) never open
  an editor, and nothing is broadcast until a name is committed.
- Typing with exactly one note selected edits it: the editor opens with the caret
  after the existing text and the character is appended. Read-only and
  comment-only viewers, locked notes, comments, artwork and multi-selections are
  unaffected, Ctrl/Cmd shortcuts are unchanged, and `?` remains the shortcuts
  reference. Enter still opens the editor with the text selected.
- The new note is announced to screen readers once, with a prompt to type its
  name, instead of as "selected" followed by "added". After Enter or Escape,
  keyboard focus returns to the note when the edit began from the keyboard.
- A press inside an open note editor now places the caret instead of starting a
  drag of the note underneath (which closed the editor), and a right-click or
  long-press there shows the browser's text menu, not the note menu.
- A control that can do nothing is no longer drawn. The gear on a selected
  note's toolbar only asks the host for its note menu, so it appears only when
  the host supplies `events.onMenuRequested`; the gear on a selected connector's
  toolbar appears only when the host supplies `events.onLineMenuRequested`.
  Delete and the connect plug are the engine's own and stay. Hosts that supply
  the callbacks see the same toolbars as before. Because the connector gear is
  also what reveals the per-endpoint lock toggles, a page with no line menu no
  longer shows those toggles; endpoints can still be pinned by dragging them.
- `Editor.startInline()` accepts `{ caret, insert, heldKey, preventScroll,
  returnFocus }`, returns whether it opened, and takes focus synchronously.

### Fixed
- `selectNodes` no longer throws when the slate contains a node whose
  `finishCreate()` has not run yet (async creation, collab peer seeds, paste
  cascades): `updateSelectionResizeRotate` called `resizeRotate.isEnabled()`
  unguarded over all nodes, and one half-initialized node killed the whole
  selection pipeline (no handles, stale overlay, dropped state update).
- Rotating a node now rotates the VISIBLE content during the drag, not just
  the dashed selection outline. The live rotate handler only touched the text
  label (or the svgContent `nestedSvg`, which custom-shape nodes do not
  use), so custom shapes (diamond etc.) and image/complex nodes rendered a
  ghost outline mid-drag while the artwork stayed flat. The handler now
  rotates every visible child (artwork nested-svg, svg content, label) by
  the same delta around the same center — a rigid motion of the whole node.
  Plain-rect shapes, whose resize/rotate target IS the visible background
  rect (rotated by svg.resize.js itself), are skipped to avoid double
  rotation; `finalizeInteraction` continues to strip child rotations and
  re-bake the group transform on release.

## [3.1.2] — 2026-09-20

### Fixed
- Rotating or resizing a node no longer dismisses the selection: the trailing
  `click` of a drag is dispatched on the common ancestor of the pointer
  down/up targets, which the canvas-click handler misread as an empty-canvas
  click. Deselect now requires the pointer to go down on blank canvas and to
  travel less than 6 px.
- Selection overlay and plug-dots re-anchor after rotate/resize instead of
  staying at the pre-rotation edge positions.
- Node link badges navigate on a real click (not only synthetic events).

### Added
- Real-input e2e guards for rotate/overlay-follow, connection-handle click,
  marquee/context menu, copy-paste, inline edit, keyboard nudge, undo/redo
  keyboard journey, snap-to-grid, birdseye click-to-jump, and multi-select.

## [3.1.1] — 2026-07-16

### Fixed
- Operation group placement avoids collisions with existing nodes.

## [3.1.0] — 2026-07-16

### Added
- Added the public `SlateOperations` module with typed, validated add, update,
  delete, connect, disconnect, arrange, and slate-level operation plans.
- Added collaboration-aware execution, stable AI summaries, idempotent node ids,
  relative placement, and safeguards against unrequested theme or destructive
  changes.
- Added regression coverage for the Slatebox AI request to place three triangle
  nodes to the right of an existing Welcome node without changing the canvas.

## [3.0.4] — 2026-07-16

### Fixed
- Exported connector paths now retain their connection, source-node, and
  target-node identity so presentation playback can keep the active
  relationship visible while panning and zooming.

## [3.0.3] — 2026-07-15

### Fixed
- Stable compatibility-facade node wrappers now rebind to the live engine node
  after `loadJSON()` replaces instances, so subsequent relationships and moves
  persist against the deserialized slate.

## [3.0.2] — 2026-07-14

### Changed
- Custom vector and SVG-content nodes stretch during ordinary resize; holding Shift preserves their aspect ratio, matching Miro's resize convention.

### Fixed
- Source and target arrowheads remain independently configurable when connector width or color changes rebuild their markers.

## [3.0.0] — Unreleased

### Added
- Modern `SlateboxJS`, `Slate`, and `Node` APIs backed by SVG.js.
- Audited `Slatebox.slate`, `Slatebox.node`, `Slatebox.base`, and `Slatebox.utils` compatibility facade for SlateboxJS 2.x hosts.
- Infinite canvas, Miro-style pan/zoom, multi-selection, grouped move/rotate/lock behavior, presentation mode, connector labels and endpoint pinning.
- Yjs/y-websocket collaboration with authenticated host initialization, awareness, echo suppression, and two-client integration coverage.
- Production-slate fixtures and v1 → v3 → v1 serialization round-trip coverage.
- Public stylesheet export at `slateboxjs/style.css`.
- Fresh-consumer package verification through `npm run verify:package`.
- A strict canonical-Meteor-app gate through `npm run test:app`; it packs and installs the current library artifact, boots the app, and exercises real-host collaboration plus persistence.

### Changed
- Package name is `slateboxjs`; version 3 replaces the Raphael-era 2.x engine while retaining the migration facade.
- Connector rendering, custom vector shapes, text fitting, undo/redo, collaboration replay, and app integration now use the SVG.js engine.
- Rectangle, rounded-rectangle, circle, and ellipse nodes now share the SVG path rendering, styling, resize, connector-outline, persistence, collaboration, and undo pipeline used by custom shapes.
- `yjs` and `y-websocket` are optional peer dependencies and remain development dependencies for integration tests.

### Fixed
- Persistence, reload, collaboration, and undo behavior across node movement, text, styles, resize, rotation, ordering, relationships, canvas state, and grouped interactions.
- Connector geometry for rotated/custom shapes, parallel edges, arrowhead trimming, endpoint reconnection, and pinned anchors.
- Host lifecycle leaks by exposing and exercising slate destruction on unmount.
- Undo/redo now publishes an authoritative full-state collaboration baseline, reaches the host save path, supplies usable snapshot callback data, and remains correct for reconnecting peers.

### Migration
- Existing applications may continue using `import { Slatebox } from 'slateboxjs'`; see `docs/drop-in-contract.md` and `docs/meteor-swap.md`.
- Publishing `slateboxjs@3.0.0` remains an explicit release action and is not performed by the build or verification scripts.

## [2.0.0] — 2025-05-31

### Added
- Complete diagramming library with 26 core modules
- Draggable nodes with multiple shapes (rectangle, circle, ellipse)
- Pan/zoom canvas with trackpad support (`@svgdotjs/svg.panzoom.js`)
- Resize/rotate handles (`@svgdotjs/svg.select.js`, `@svgdotjs/svg.resize.js`)
- Node connections/lines with arrows (svg.connectable.js, vendored in-tree)
- Multi-selection (Shift+click, drag-select)
- Keyboard shortcuts (Ctrl+Z undo, Ctrl+Y redo, Delete, etc.)
- Grid overlay with snap-to-grid
- Inline text editing
- Undo/redo via JSON snapshots
- JSON serialization/deserialization for save/load
- SVG/PNG/PDF export
- BirdsEye minimap overview
- Theming system
- Presentation mode

### Changed (v2.0.0 post-release updates)
- **Vendored svg.connectable.js**: The `file:../svg.connectable.js` dependency has been replaced
  with an in-tree vendor copy under `src/vendor/svg-connectable/`. This fixes `npm install`
  for all consumers — the package is now fully self-contained. MIT license preserved.
- **Bug bash**: Fixed 4 critical memory leaks (Slate coordinate polling interval,
  ZoomSlider update interval, BirdsEye document listeners, Node orphaned timeouts).
  Added proper `destroy()` lifecycle methods to all 15 classes that lacked them.
- **Residual fixes**: Filters outline now saves/restores original stroke, Images
  `preserveAspectRatio` parameter is now used, Menu `isOpen` no longer gets stuck,
  Collab `isConnected` flag fixed (removed optimistic set).
- 844 unit tests (up from 840), all 56 e2e tests pass
- yjs and y-websocket added as optional devDependencies for Collab testing
- Real-time collaboration (yjs/y-websocket)
- Context menu, comments, filtering, images, links
- Font loader for custom fonts
- Layout algorithms
- v1 API compatibility shim
- Built with TypeScript, SVG.js 3+, Vite 5

### Fixed
- UndoRedo async restore race condition — `restore()` now properly awaits
  deserialization and keeps `isRestoring` flag active for the full duration
- Connection handle cleanup on node selection changes
- ResizeRotate event listener cleanup
- Various null-safety guards across core modules

### Changed
- All source modules committed to git repository
- Comprehensive unit test coverage (840+ tests)
- Full e2e test suite (56 tests across 10 spec files)
- Updated README with complete API documentation
- Continuous Integration via GitHub Actions
- .gitignore covers build/test artifacts, OS files, environment config
