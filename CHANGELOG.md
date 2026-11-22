# Changelog

## [Unreleased]

### Added

- **Impact × effort, the reorg & hiring sandbox and goals & owners** (`slateboxjs/workshops/nestPlus`, loaded with
  the nested boards). A `matrix` layout (`nest.axes`, `score_card`, rule `quadrant`), yes/no fields (`add_field`
  `flag`) with rules `parent` and `contains`, and owners (`nest.owners`, `card.owner`, `add_owner`, `set_owner` with
  `carry`) with rule `sameOwnerAs` (`mode` `warn` | `ask` | `carry`; a server carry that differs from the page's is
  refused). The nest kit draws the square (a phone keeps it square) and a row of teams to drop cards on. Catalogue:
  `impact-effort`, `reorg-sandbox`, `goals-owners`, each with rule phrases first. See docs/native-workshops.md.
  A whole save of these boards is made again exactly as shown: a card given a team before it had one, a card added
  and scored at once, and under carry a card under the moved one that ends with another team. `contains` holds a team
  to it only when it falls short or grows (a manager with no one under them yet is added before their designer), and
  `sameOwnerAs` only a change of place or team.
- **Agents on the canvas** (`slateboxjs/presence`). `createAgentPresence(slate).set(records)`
  draws each agent run as a hexagon with a pointer, a named tag and its plan, above the notes. It
  is its own entry, so a slate no agent works on never loads it; the canvas entry keeps only the
  small text helpers (`AGENT_PALETTE`, `agentStepText`, `agentChecklist`, `visibleAgents`). The
  pointer rests inside a corner of the note it works on, and the tag goes on the side that stays
  in view and off the note's words (`agentTagSide`, `agentAnchor`).
- **Business boards: a launch plan, a sales pipeline and a budget.** Three new workshop kinds
  (`kind: 'launch-plan' | 'pipeline' | 'budget'`), drawn as native notes by `attachWorkshop`.
  A launch plan schedules tasks (`duration`, `lag`, `dependsOn`) in team lanes, derives every start
  (`scheduleLaunch`), finds the critical path and keeps every task ending by `launch.day`. A
  pipeline moves deals forward one stage at a time (back to any open stage), wins only a priced deal
  from the stage before Won, holds stage capacities and forecasts Σ amount × chance against
  `forecast.target`. A budget splits `budget.total` between teams (`allocation`, `floor`, `cap`):
  it always balances, and a team's line items must fit what it was given. The rules are pure
  functions in `slateboxjs/workshops/rules` (`validate*`, `plan*Move`, `*Refusal`, `*Caption`,
  `*Limits`, `sample*`, `readNoteNumbers`), not in the model a plain slate loads: they plug into
  the model's gate when they load (a server imports `slateboxjs/workshops/rules`, a browser gets
  them with the kits from `slateboxjs/boards`, the same code), and until then the gate refuses
  these boards (`workshopRulesLoaded(kind)`). They are shared with the server through `validateWorkshop` and
  `applyWorkshopEdits`, which gains `set_task`, `link_tasks`, `unlink_tasks`, `set_launch_day`,
  `set_amount`, `set_target` and `shift_budget` (`add_card` takes `duration`, `lag`, `waitsOn`,
  `amount`); a refused numeric edit returns `limits`. `WORKSHOP_BOARD_KINDS` names every kind for a
  schema. Notes trade with cards on these boards too: the days or amount written on a note
  (`readNoteNumbers`: "Copy 3d", "$45k", "€1.2M") become the card's, and a card leaves as
  "Copy · 3 days".
- **`slateboxjs/boards`: what a slate needs to draw and play a business board, loaded only for
  one.** `kitFor(kind)` gives `attachWorkshop` its `kit` option: where every note goes (desktop and
  a narrow phone arrangement, `boardLayoutFor(width)`), a board layer (`createBoardLayer`: day grid,
  arrows that unlink on click, critical path, launch-day line, forecast bar, budget fills and the
  reason a held handle stopped, under the board's notes), Dragology specs run headless (bars slide,
  stretch and link; deals and line items go to the nearest legal stage; budget dividers move money
  with `varyFunc`), 44px handle notes and arrow-key edits. Every change commits through
  `applyWorkshopEdits` and reaches `onChange` with `change.edits`, so a server applies it to its
  own board and two people changing different tasks or deals both keep their change.
  `attachWorkshop` refuses a business board given no kit. `npm run check:budget` holds the built
  entries to their size ceilings and checks the boards and Dragology stay out of the eager entries.
- **Notes and cards trade places by being dropped.** On a board of plain lanes, an ordinary note
  dropped on a lane (or nudged onto one with the arrow keys) becomes a card there under the lane's
  rules, keeping its words, look and id; a lane that refuses it sends it back and says why. A card
  dropped on empty canvas, or staged past the first or last lane from the keyboard and committed
  with Enter, becomes an ordinary note saved with the drawing. Each is one undo step that undoes
  both the board and the drawing. A note joined by lines stays a note, and says so. New change
  shapes `{ cardId, laneId, noteToCard }` and `{ cardId, cardToNote }`; model helpers
  `workshopTakesNotes`, `workshopNoteCandidate`, `workshopNoteRefusal`, `workshopCardAsNote`,
  `workshopCardAsNoteRefusal`, `workshopCardLookOf`; drag-policy hooks `onFreeMove`, `onFreeDrop`,
  `undoState` and `onUndoRestore`; `slate.beginHostStep()` / `endHostStep()`.
  Several notes carried together onto a lane become cards there as one step, or all go back with
  the reason (`onFreeGroupDrop`); a note whose words are typed on a lane is dropped there
  (`onFreeTextCommit`). A card keeps what its note had that a card does not show (`card.asNote`:
  line breaks, shape, size) and gives it back on the way out; a note with a link stays a note. An
  undone trade says where the card goes back (`noteToCard.before`). `onChange` may answer a trade
  with `'taken'` (someone else made it first): this person's copy of the note goes and nothing is
  brought back; a refused trade never takes away a card the host has drawn since.
  `board.toCanvas(cardId)` takes a card off the lanes as a note beside the board.
- **A host can keep provisional notes out of exports.** A drag policy may give a note
  `exportable: false` (the default stays `true`, so a workshop's cards still export). SVG and PNG
  exports then leave that note out, with every line drawn to or from it, and frame the picture to
  the notes that remain; the canvas itself is untouched. Slatebox uses it for a conversation's
  preview, which is shown on the canvas but is not yet part of the diagram.
- **A workshop proposal looks provisional.** While `preview(candidate)` shows a proposal, each
  card it adds, moves or renames and each lane it adds or changes is outlined dashed and tagged
  `data-workshop-proposed`; `preview(null)` brings back the committed look.
- **A host can draw its own selection toolbar.** With `contextToolbar: 'host'` the engine draws no
  pill (delete, connect, settings) above a selected note or line; connecting stays on the connect
  dots and a selected line keeps its start/end lock toggles on the canvas. The new
  `events.onSelectionFrame(frame)` says what is selected (`kind`: `node`, `nodes`, `line` or
  `none`, with `ids` and, for a line, `line: { nodeId, associationId, childId }`) and where it is
  on screen (`rect`, in client pixels, rotation included). A line's frame also carries `avoid`:
  the screen boxes of the notes at its two ends, so a host bar over the line can stay off them. `topClearance` is the room above
  `rect.top` taken by the rotate handle and the top connect dot. It fires on every selection
  change, once with `moving: true` when a drag, resize, rotate, pan or zoom starts, and with
  `moving: false` and the new place when it ends. `getSelectionFrame()`, `getSelectedLine()` and
  `removeSelectedLine()` are on the Slate and on the v1 facade. Hosts without the option keep the
  pill.
- **Dashed and dotted lines.** An association's `lineDash` (`solid`, `dashed`, `dotted`) is set with
  `onLinePropertiesChanged { prop: 'lineDash' }`, scales with the line's width, and is saved,
  synced and undone like every other line style.
- **Bold note text.** A note's `fontWeight: 'bold'` is set with `onNodeTextChanged`, drawn on the
  canvas and in the inline editor, and is saved, synced and undone like the other text styles.
- **Workshops can run as native notes on a live slate.** `attachWorkshop(slate, workshop, options)`
  (from `slateboxjs/workshops/model`, plain JavaScript) draws a workshop model onto a Slate the host
  already has: lanes, captions and cards are real notes with the canvas's own pan, zoom, minimap,
  selection and inline editing. A card dragged to a lane it may enter previews the outcome on the
  lane captions and commits through `onChange`; a full or forbidden lane refuses, the card glides
  back and the reason is shown on the lane and given to `onRefuse`. The notes are a drawing of the
  model and are never saved, broadcast or put in undo history. Cards also move from the keyboard
  (Left/Right to stage, Enter, Escape), with the same refusals; a viewer (`isReadOnly`,
  `isCommentOnly`) can move nothing; and with `prefers-reduced-motion` cards are placed without
  gliding. See `docs/native-workshops.md`.
- **Native workshops for narrow screens, in the host's note style.** `attachWorkshop` takes
  `layout: { lanesPerRow }` to wrap lanes into rows and `setLayout()` to change it live (the same
  notes glide to their new places); `bounds` and the new `slate.fitToWidth(region, padding, maxZoom)`
  fit a board to a phone's width. A held card near an edge of the visible canvas pans the canvas, so
  it can be carried by mouse or touch to a lane that started off screen. Left and Right follow
  reading order through wrapped rows and Up and Down the column. `style` draws lanes, captions and
  cards in the host's family, sizes, text colour, border and corner; with none they are drawn as an
  ordinary engine note (`DEFAULT_NOTE_STYLE`). `onSelect` reports the selected card or lane.
  `workshopLanePlaces` gives each lane's place. `slate.onSelectionChange(listener)` hears every
  selection change.
- **Host drag policies.** `slate.setDragPolicy(policy)` lets a host govern chosen notes: refuse a
  drag, watch it, accept or refuse the drop and say where the note settles, and decide per note
  whether it may be resized, rotated, deleted, duplicated, connected, edited or selected. Also
  `slate.hitTestNodes`, `slate.clientToWorld` and `slate.worldToClient`.
- `workshopCandidate`, `workshopDestinations`, `workshopRefusal` and `workshopLaneCaption` in the
  workshop model; `workshopToSlate(model, { native: true })` for the native artwork (its output with
  no options is unchanged); `dragologyCandidates` to let the SVG board's Dragology spec choose the
  candidate on a native slate.

- `workshopToSlate(model, { native: true, beside: ids })` draws the native artwork beside a
  document that already has notes by its names, under other ids (`workshopStandInId` is the rule,
  shared with the live canvas). While a card is held or staged, each lane's `column-<id>` note says
  whether it takes the card in a `data-workshop-drop` attribute (`open`, `over`, `refused`).

### Changed
- **Cards look like notes.** A card is drawn with an ordinary note's fill (`#f0f0f0`, now
  `DEFAULT_NOTE_STYLE.backgroundColor`) or the host's `style.backgroundColor`, instead of a card
  fill of its own; a card made from a note keeps that note's look (`card.look`).
- **Keys pressed on a control outside the canvas stay with that control.** Delete, Backspace, the
  arrow keys and Escape act on the canvas only when focus is inside it or nowhere on the page; a
  Ctrl/Cmd shortcut still reaches it from a toolbar button beside the canvas, and nothing does from
  inside a dialog, menu or list. Before, Backspace pressed in a dialog deleted the selected note,
  and an arrow on a host button nudged it (or staged a workshop card's move). A press on the canvas
  now takes keyboard focus from the control last used beside it, so the keys that follow go to the
  note just pressed.
- **One finger on empty canvas pans it** on a touch screen (two fingers still pinch, a finger on a
  note still moves the note, and a mouse still draws the selection rectangle). Hosts hear the usual
  `panStart`, `panning` and `panEnd` events.
- A native workshop no longer refuses a slate whose own document has a note called `lane-<id>` or
  `card-<id>` (`attachWorkshop` threw; a document loaded later left the workshop without that note).
  The document's note stays as it is and the workshop draws its own under another id.
- Native workshop notes default to the engine's own note style (14px, black text, a light grey
  one-pixel border, square corners) instead of a look of their own; a host passes `style` for
  anything else. `workshopToSlate` with no options is unchanged.
- A station map's native connectors join one station's zone to the next instead of its header, so
  a line no longer runs over a token or a caption.
- A connected note is ready to name the moment it is created. Clicking or tapping
  a connector, dragging one into open space, or activating a keyboard direction
  button now selects the new note and opens its editor with the caret in it, so
  the next thing typed is its name. Enter commits; Escape or clicking away with
  nothing typed leaves the note blank, as before. Notes that arrive any other way
  (`addNode`, `loadJSON`, collaborators, paste, duplicate, undo/redo) never open
  an editor, and nothing is broadcast until a name is committed.
- When that new note lands outside the view, the view now moves only as far as
  the note needs (with a little air around it) instead of centring on it, so the
  note it was created from stays in sight on a small or embedded canvas. A note
  already in view leaves the view where it was.
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

- **Work done after an undo is no longer blanked or lost when the slate is reloaded or someone
  joins.** A client rebuilt the slate from its room in the order Yjs delivered the packages (one
  writer at a time, not the order they were written) and all in one go, before the notes they
  were for had been drawn. After an undo the room holds a whole-slate replacement, so a reload
  rebuilt everything from it: a note added after the undo lost its name and its line, a delete
  replayed onto a note not yet drawn threw and stopped the rest of the room from being applied,
  and the next edit stored the damaged slate over the good document. Now:
  - packages are stamped with a clock that is never behind anything their writer has seen, and a
    room is applied in that order, one package after the other, each waiting until the notes
    before it are drawn and any document load has finished; one package that fails no longer
    stops the ones after it;
  - a document stored after an undo records which replacement it holds
    (`options.collabBaseline`), and a client that loads it keeps the stored document instead of
    rebuilding the slate from the room's copy;
  - a replacement received live is applied, then everything else the room holds is applied on
    top of it, so a person who was working (or offline) while someone else undid keeps what the
    undo had not seen; when two people undo at the same moment everyone ends on the later one;
  - `beginRemoteApply`/`endRemoteApply` nest, so a document load started by a package from the
    room stays silent towards the host until it has finished;
  - a name given to a note that is not drawn yet is kept, and a note removed before it was drawn
    is never drawn.
- **Undo takes back only one's own steps.** Undo records are whole slates, so undoing one's last
  step put back the slate from before it and took away a note another person had added since,
  for everyone. Changes received from the room, someone else's undo or redo included, are now
  carried note by note into every undo and redo record (`SlateDelta.ts`,
  `UndoRedo.beforeRemote`/`absorbRemote`). Someone else's undo no longer empties one's own
  history either: one can still undo and redo one's own steps after it.
- **A name half typed when someone else undoes is kept.** Their undo replaces every note, and
  the note being typed into closed its editor and dropped what had been typed. The draft and its
  caret are now taken before any load that replaces the notes and opened again on the note's new
  copy (`Editor.draft`, `Slate.takeInlineDraft`/`resumeInlineDraft`; `startInline` takes `text`
  and `selection`).
- **Two notes deleted one after the other are two undo steps.** A delete is recorded when its key
  press ends; several selected notes deleted by one press are still one step.
- **No selection is kept on notes that undo, redo or a load replaced.** Nothing showed as
  selected, yet Delete still acted on them, and the next selection threw `Cannot read properties
  of null (reading 'screenCTM')` in `updateConnectionHandlePositions`.
- **Typing goes to the note just pressed** when another note, or one of its connector buttons,
  still had keyboard focus (after a connector was dragged onto a note and Escape was pressed).
- **A selected note's connector dots no longer blink when the note is clicked.** A click is a
  drag that never moves: the dots and the resize/rotate outline were put away on the press and
  brought back a moment after the release, and a click on a dot in that moment hit nothing. They
  are now put away on the drag's first move. The end of that click, settled a moment later, no
  longer selects the note again when a connector pressed in that moment has already created and
  selected a connected note.
- The zoom slider's label was up to half a second behind the view (it polled on a timer), so it
  read the old figure after `fitToContent()`. It now follows the canvas's viewBox and is right at
  once.
- The built-in presentation stepped through a host's decoration notes (a workshop's lane columns
  and captions). Notes a drag policy marks `canSelect: false` are never a stop.
- A connector between two governed notes (a station map's lines) could be clicked, selected and
  deleted, and one that crossed a token took the press meant for the token. Such a connector now
  takes no pointer input.
- A held governed note could sit one pointer step behind a pointer that had stopped: the drag was
  followed through svg.draggable, which drops a move when two in a row cover the same distance. It
  is now followed from the browser's own move events.
- A selected card that a workshop moved (a keyboard move, a new model) left its selection outline
  round the slot it came from; and `board.refuse()` took a held card out of the hand.
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
