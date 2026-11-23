# Workshops as native notes

`attachWorkshop` runs a workshop on an ordinary, live `Slate`: the same instance the host already
has, with its pan, zoom, minimap, selection and inline text editing. Lanes and cards are real
notes. The workshop model stays the one saved source of truth; the notes are its drawing.

```js
import { Slate } from 'slateboxjs'
import { attachWorkshop } from 'slateboxjs/workshops/model' // plain JavaScript, no React

const board = attachWorkshop(slate, model, {
  onChange(next, change) { return save(next) },   // a move, a rename, or a note and a card trading places (below)
  onRefuse({ cardId, noteId, laneId, reason }) { toast(reason) },
  onPreview(candidate) {},                         // the board a held or keyboard-staged card would produce, or null
  onSelect(selection) {},                          // { cardId } | { laneId } | null
  readOnly: false,
  origin: { x: 0, y: 0 },                          // default: to the right of what the slate already holds
  layout: { lanesPerRow: 1 },                      // default: every lane in one row
  style: { fontFamily: 'Manrope', fontSize: 16, cornerRadius: 12 }, // default: an ordinary engine note
})

board.update(modelFromServer)   // redraw from a new model, moving only what changed
board.preview(proposal)         // show a proposed model without committing; null restores
board.refuse('later', 'Someone else just filled Later.') // the canvas cue for a move the host turned down
board.setReadOnly(true)
board.setLayout({ lanesPerRow: 2 }) // the same notes glide to their new places
board.bounds                    // { x, y, width, height } of the board, in world units
slate.fitToWidth(board.bounds)  // the board as large as its width allows, read from the top
board.destroy()                 // removes the workshop's notes and nothing else
```

The signatures, exactly:

```ts
attachWorkshop(slate: Slate, workshop: Workshop, options?: AttachWorkshopOptions): AttachedWorkshop

interface AttachWorkshopOptions {
  onChange?: (next: Workshop, change: WorkshopChangeEvent) => void | Promise<boolean | 'taken' | void>
  onRefuse?: (refusal: WorkshopRefusalEvent) => void
  onPreview?: (candidate: Workshop | null) => void
  onSelect?: (selection: { cardId: string } | { laneId: string } | null) => void
  readOnly?: boolean
  origin?: { x: number; y: number }
  chooseCandidate?: WorkshopCandidateChooser
  layout?: WorkshopBoardLayout          // { lanesPerRow?: number }
  style?: WorkshopNoteStyle
  scope?: string                        // a board of several on one slate: notes named `<scope>:<name>`; none or 'main' keeps today's names
  avoid?: () => Box[]                   // boxes a note put "beside the board" stays clear of (the other boards)
}

interface WorkshopNoteStyle {           // sizes in world units: CSS px at 100% zoom
  fontFamily?: string                   // default: the engine's note family
  fontSize?: number                     // card text; default 14
  laneFontSize?: number                 // default fontSize + 2
  captionFontSize?: number              // default fontSize - 1
  textColor?: string                    // default #000000
  backgroundColor?: string              // card fill; default #f0f0f0, an engine note's
  borderColor?: string                  // default #cccccc
  borderWidth?: number                  // default 1
  cornerRadius?: number                 // default 0 (square, like a plain note)
  card?: WorkshopCardLook & { cornerRadius?: number } // cards only: drawn as the host's own notes
}

interface AttachedWorkshop {
  update(next: Workshop): void
  preview(candidate: Workshop | null): void
  setReadOnly(readOnly: boolean): void
  refuse(laneId: string, reason: string): void
  setLayout(layout: WorkshopBoardLayout): void
  toCanvas(cardId: string): string | null   // a card off the lanes as a note beside the board; else the reason it stays
  destroy(): void
  readonly value: Workshop
  readonly origin: { x: number; y: number }
  readonly layout: WorkshopBoardLayout
  readonly bounds: { x: number; y: number; width: number; height: number }
  whenDrawn(): Promise<void>
}
```

## Many boards on one slate (groundwork)

A slate may come to hold several boards side by side. The engine's parts for that, used by a host that
opts in (nothing changes for a slate of one board):

- **Scoped names.** `attachWorkshop(slate, board, { scope: 'b2' })` names every note of that board
  `b2:<name>` (`b2:card-<id>`, `b2:lane-<id>`, `b2:rules-board`, ...). The first board (`main`, or no
  scope) keeps the names below, so saved slates, links and tests are unchanged. Two boards made from one
  preset never share a note name, and a board only treats notes of its own scope as its parts.
  `workshopNodeIds.of(scope)`, `workshopToSlate(board, { scope })` and `workshopPresentationScenes(board, { scope })`
  give the same names; `workshopBoardScope` checks one (1 to 12 lowercase letters and digits).
- **Room.** `workshopReserve(board, layout?, kit?)` is the box a board needs: five lanes (1220) for a lane board,
  its kit's desktop width (or the width it is pinned to) for a business board. A host places boards side by side
  in these boxes; a phone's narrow layout is always smaller.
- **Beside the board.** With `avoid`, a card taken to the canvas, a note a lane refuses and a keyboard move off
  the lanes go past the other boards along their row (`workshopFreeSpot`).
- **Undo.** An undo that brings back a note only takes the card off the board that took it, even when another
  board has a card by the same id.
- **Library.** `catalogFits(id, { hasBoard, many: true, boards })` fits beside other boards up to
  `maxBoardsPerSlate` (8); without `many` a slate holds one board, as before.

## What it draws

One artwork function draws every view: `workshopToSlate(model, { native: true, origin })`.

| Note | Name | Behaviour |
|---|---|---|
| Lane header | `lane-<id>` | Selectable, not draggable. Double-click or type to rename. |
| Caption | `caption-<id>` | `N of M` with a capacity, `N cards` without, `$amount · description` for the budget experience, points for a release plan. Decoration: no pointer input, focus or selection. |
| Column | `column-<id>` | The lane's drop zone. Decoration. |
| Card | `card-<id>` | Dragged under the workshop's rules. Double-click or type to rename (not in a release plan, where the card also shows its points). |

Station maps also get their connectors, drawn from one station's zone to the next so a line runs
between stations and never over a token; release plans get their dependency connectors. A connector
between two workshop notes that cannot be connected (a map's stations, a release plan's features) is
part of the drawing: it takes no pointer input, so it cannot be selected, re-plugged or deleted, and a
press on a card it crosses reaches the card. On a board of plain lanes the lines people draw to and
from cards are ordinary lines (see Lines below).

None of these notes is written by `slate.exportJSON()`, `slate.snapshot()`, recorded for undo, or
sent to collaborators; that is the supported way to keep them out of a saved drawing, and it needs
nothing from the host. A host that autosaves the slate's own drawing can keep doing so; the workshop
is persisted by saving the model `onChange` hands over. `slate.nodes.allNodes` and
`slate.getAllNodes()` do include them; `slate.freeNodes()` is the drawing without them.

The workshop draws its notes as `lane-<id>`, `card-<id>`, `caption-<id>`, `column-<id>` and
`image-<id>` wherever the slate leaves those names free. A slate's own document may already hold a
note by one of them, when the workshop is attached or in a document loaded later (`loadJSON`, undo,
a collaborator's full replace). That note stays the document's own note: saved, ungoverned, and left
in place by `destroy()`. The workshop draws its note under another id (`card-<id>--2`), logs a
warning, and loses nothing: the card is moved, renamed and refused exactly as before. So every note
`slate.exportJSON()` returns is the document's, whatever it is called, and a host never has to
tell the two apart by name. `loadJSON`, undo and redo otherwise redraw the workshop from its
model, as new notes.

## In the host's note style

With no `style`, lanes and cards are drawn as the engine draws an ordinary note: the same family,
size, text colour, border and (for cards) fill (`DEFAULT_NOTE_STYLE`, exported from `slateboxjs`),
with square corners. A host whose notes look different passes that look in `style`, and every lane
header, caption and card takes it; `style.backgroundColor` is the host's note fill, for cards. A
host whose notes do not look like its lanes (white text on a coloured note, say) passes that look
in `style.card` (`backgroundColor`, `textColor`, `fontFamily`, `fontSize`, `borderColor`,
`borderWidth`, `cornerRadius`): cards take it and lanes and captions do not. A card
is recognisable as a card by where it sits, in a lane, not by a skin of its own. Lane fills and the
tint behind each lane stay the workshop's own, and so does a map's token, which is a playing piece.

A card made from an ordinary note keeps that note's look (`card.look`: fill, text colour, type
family and size, border colour and width), and a card that leaves the lanes becomes a note drawn
exactly as the card was.

Cards are 228 by 76 and lane headers 228 by 58, whatever the type size. A label that would not fit
at the size asked is set smaller (never below 11), so a long name stays inside its note; a short one
is drawn at the size asked.

## Lanes that wrap, and phones

`layout: { lanesPerRow }` wraps the lanes into rows; `setLayout` changes it on a live board (a pane
opens, a phone turns), gliding the same notes to their new places. Each row is as tall as its own
fullest lane plus one free slot. `bounds` is the box the board fills.

On a phone, one lane to a row and a fit to width keep every card readable:

```js
board.setLayout({ lanesPerRow: 1 })
slate.fitToWidth(board.bounds)          // never past 100%: card text is the size the style asked for
slate.fitToWidth(board.bounds, 12, 1.5) // or let one lane fill the width, up to 150%
```

The lanes below the screen are reached by panning: one finger on empty canvas (a lane's empty
space included) pans it, two fingers pinch. A card is carried to them by holding it near an edge
(see below). A map ignores `lanesPerRow`: its stations stay where their author put
them, so a map wider than the screen is fitted smaller.

## Moving a card

- **Pointer or touch.** Lanes the card may enter are outlined (and their `column-<id>` note carries
  `data-workshop-drop="open"`; the lane the card is over carries `"over"`, and a lane that refuses
  it `"refused"`, for as long as the outline shows). Over one of them the lane captions
  and the other cards show the outcome. On release the move commits (`onChange`) and the card
  settles in its slot, or it is refused: the card glides back to exactly where it started, the lane
  is outlined, its caption shows the reason for about 1.5 s, and `onRefuse` is called. A drop
  outside every lane makes the card an ordinary note there (see below); on a map, a release plan
  or a startup experience it is refused with an empty reason. Escape, a cancelled pointer or touch, and
  window blur cancel the drag.
- **To a lane that is off screen.** A card held within 56 CSS pixels of an edge of the visible
  canvas pans the canvas that way, faster the nearer the edge, and stays under the pointer or finger
  while it does. An edge only pulls once the card has been carried toward it, so a card that starts
  beside an edge can be carried away in peace. Refusal and cancel return the card to where it
  started, however far the canvas has moved. (This is the drag policy's behaviour for every
  governed note; `onPan` and `onPanEnd` are not called for it.)
- **Keyboard.** The canvas has the keyboard when focus is inside it or nowhere on the page; a press
  on the canvas takes focus from a control beside it. A key pressed on a button, field, dialog or
  menu outside the canvas belongs to that control: Delete there deletes no note and an arrow there
  stages no move (a Ctrl/Cmd shortcut such as undo still works from a toolbar button, but not from
  inside a dialog, menu or list). With a card selected, Left and Right stage a move to the previous or next lane it may
  enter (shown exactly like a pointer hover), Enter commits, Escape cancels. An arrow toward a lane
  the rules close is refused the way a drop there is: the lane shows the reason, it is announced,
  and `onRefuse` is called. The slate's live region announces each step. Left and Right follow
  reading order, on from the end of one row to the start of the next. When the lanes are in more
  than one row (a wrapped layout, or a map with stations above one another) Up and Down go to the
  lane above or below in the same column. A lane staged off screen is brought into view.
- **Viewers.** When the slate's own `isReadOnly` or `isCommentOnly` event says the person may not
  edit, cards cannot be moved by pointer or keyboard and nothing can be renamed, whatever
  `readOnly` was passed here.
- **Reduced motion.** With `prefers-reduced-motion: reduce` a refused card, a settled card and a
  redrawn board are placed at once instead of gliding.

The rule is `workshopCandidate(board, cardId, laneId)`: the board the move would produce, the same
board when the card is already there, or null. `workshopRefusal` gives the sentence for a null.
On a board of plain lanes, open canvas beside the board is a destination too (see "Notes and cards
are the same thing").

## Notes and cards are the same thing

On a board of plain lanes (`workshopTakesNotes(board)`: not a map, a release plan or a startup
experience) an ordinary note and a card trade places by being dropped:

- **A note dropped on a lane becomes a card** at the foot of that lane, under the lane's rules
  (`workshopNoteCandidate` / `workshopNoteRefusal`: capacity, 24 cards at most, 1 to 80 characters
  of plain text). The note leaves the slate's drawing (`onNodeDeleted` is sent to collaborators and
  the host's save path) and the board gains the card, with the note's words, its look, and its id
  when the board has no lane or card by that id (otherwise the next free `card-N`). The card glides
  from where the note was let go into its slot and becomes the selection. The card also keeps what
  the note had that a card does not show (`card.asNote`: its words with their line breaks, its
  shape and its size), so the same note comes back when the card leaves the lanes.
- **Several notes carried together** and dropped on a lane all become cards there, as one undo
  step, or none do: when the lane cannot take them all (it has room for fewer, or one of them is
  refused), every one glides back to where it started and the lane says why ("One and Two can't go
  in Later. It has room for 1 more card.").
- **A note typed inside a lane.** A double-click on a lane makes an ordinary note there; when its
  words are committed (Enter, or leaving the editor) it is dropped where it is: it becomes a card in
  that lane, or the lane says why not and the note moves out just beside the board. A note never
  sits on a lane looking like a card without being one.
- **A lane that refuses a note** sends it gliding back to where it started, outlines the lane, shows
  the reason in its caption for about 1.5 s, announces it, and calls
  `onRefuse({ noteId, laneId, reason })`, exactly as for a refused card. Nothing is saved, sent or
  recorded. While a note is carried over the board the lanes are outlined as for a card
  (`data-workshop-drop` on each column says `open`, `over` or `refused`).
- **Lines.** A card is a note, lines and all. A note joined to other notes by lines becomes a card
  with its lines, and a card dropped on the canvas becomes a note with them. On a board of plain
  lanes a card has its connector plugs, as any note does: a line is drawn from a card to a note,
  from a note to a card, or between two cards, and restyled, labelled or taken away like any line.
  A line with a card at either end is the board's (`Workshop.lines`, ends named by card id or note
  id): the card's note holds the connector, so `exportJSON` never saves it, and the host persists
  it with the board (`onChange({ line: { set } })` or `{ line: { remove } }`, one undo step each).
  It follows its card into another lane, as rows reflow, through undo and redo and a
  collaborator's change to the board. A line between two ordinary notes stays the drawing's: a
  note that becomes a card brings its lines with it (`noteToCard.lines`), and a card that becomes a
  note gives its lines to notes back to the drawing (sent as `addRelationship` once saved), while
  its lines to other cards stay on the board. A note deleted from the slate takes its line off the
  screen; the board keeps the line for when the note comes back (undo). A card removed from the
  board takes its lines with it. A line whose end is free on empty canvas comes too (see below).
- **Line ends on cards.** A pinned end (a spot on a note's edge, `sourceAnchor` / `targetAnchor`
  on the line) goes with the card and comes back with the note; drawn from the card's end, the pins
  change places with the arrows. Moving an end of a card's line onto another note or card is one
  change to the line, keeping its id; moving it so no card is at either end gives the line to the
  drawing. A card's line may end free on empty canvas, as any line may (owner 2026-11-22): the line
  keeps the point (`targetPoint`, with `parentId` the card that holds it and `childId` the free end's
  own id, as the slate saves it), and the point stays where it is when the card moves. A note with a
  free-ended line becomes a card with it; a card's line end let go on empty canvas stays free there,
  one change to the line; and a card that becomes a note gives a free-ended line back to the drawing
  with its point. The free end can be moved again, or dropped on a note or card to join it.
- **Any note becomes a card.** A lane takes a note whatever its words, look, shape, picture, link or
  lines. An empty note is an empty card (counted in its lane, renamed in place, an empty note again
  off the lanes); words longer than a card shows are cut to the first 80 characters on the card and
  kept whole for the note (`asNote.text`); a picture with a web address and a link go with the card
  (`asNote.image`, `asNote.link`) and come back with the note; a look or shape a card cannot draw is
  left out of the card and nothing is refused. Words are kept verbatim, markup included (every view
  shows them as text; only control characters go, and line breaks and tabs are spaces on the card). A
  picture held in the page (a `data:` address) goes with the card for its host to store (the app
  stores it with the slate's pictures and keeps the address). A note whose id a card cannot have
  (an older note's) gives the card a fresh id; the card remembers it (`card.noteId`) and the note
  comes back under it. What still keeps a note a note: the board's own rules (a full lane, the board's
  size limit of 24 cards, a map, a release plan or a starter that keeps its own cards, a lane that is
  gone), someone else's change first, a viewer, a link a card cannot keep (over 2 KB, or not text),
  more than 96 lines, and comments. On a business board a note with any lines stays a note.
- **A trade record carries its lines.** The host's record of a card that became a note
  (`NoteTrade.lines`) holds the note's lines to other notes: a screen that hears of the trade only
  from that record (the page that made it went away first) draws them with the note and tells the
  room of both. A record kept under another key names its note (`NoteTrade.id`).
- **A card dropped on empty canvas, outside every lane, becomes an ordinary note** where it was let
  go: it leaves the board, and a note with its words and look is added to the drawing
  (`onNodeAdded`), saved with it and selected. Its id is the card's, unless the slate already holds a
  note by that id. A card that an outcome (`signals`) depends on, or that may only be in some lanes
  (`allowedLaneIds`), stays a card: it glides back and `onRefuse({ cardId, laneId: null, reason })`
  says why (`workshopCardAsNoteRefusal`). Dropped back on a lane, the note is a card again.
- **Keyboard.** A note nudged with the arrow keys is dropped where it comes to rest (a quarter of a
  second after the last arrow), at its middle: on a lane it becomes a card there, or is refused and
  goes back to where the nudging began. With a card selected, Left from the first lane or Right from
  the last stages a move off the lanes ("Alpha to the canvas, outside the lanes: it becomes an
  ordinary note. Press Enter to move it, Escape to cancel."); the card waits just beside the board,
  Enter makes it a note there and selects it, Escape or the opposite arrow brings it back.
- **One undo step each.** Each conversion is one step of the slate's own undo history, taken with the
  board as it was just before (`slate.beginHostStep()` / `slate.endHostStep()`). This person's undo
  and redo put back both halves: the drawing from the record, and the board through `onChange`.
  A step that brings a note back takes its card off the board; a step that takes a note away puts its
  card back in the lane and the place among the cards it had. Collaborators' changes carried into the
  history (see `UndoRedo.absorbRemote`) are never taken back by it.
- **Viewers** (`readOnly`, or the slate's own `isReadOnly` / `isCommentOnly`) can do neither.
- **Maps, release plans and startup experiences** keep their own cards: an ordinary note dropped on
  one of their lanes is an ordinary move, and a card dropped outside every lane is refused with an
  empty reason, as before.

The two new change shapes `onChange` reports:

```ts
// An ordinary note became card `cardId` at the foot of `laneId` (or just before card `before`, where
// an undo puts it back); the note left the drawing. `asNote`: what the note had that the card does
// not show (line breaks, shape, size).
{ cardId, laneId, noteToCard: { noteId, label, look?, asNote?, before? } }
// Card `cardId` left the board; it is now the ordinary note `noteId` in the drawing.
{ cardId, cardToNote: { noteId } }
```

A host saves both like any change, and should save the board and the drawing half in one write
(the Slatebox app sends the note itself with a `cardToNote`), so a page closed the moment after a
trade keeps the note or the card, never both and never neither. Return a promise of what the save
came to from `onChange`:

- `false`: the save was refused (the lane filled first, say). The drawing half is put back (the note
  returns to the canvas, or leaves it again) and so is the board, unless the host has drawn a newer
  board since; a card the host has drawn is never taken away.
- `'taken'`: someone else made this same trade first (two people dropped the same note on two
  lanes, or the same card on the canvas). This person's copy of the note leaves the canvas, nothing
  is brought back, and the board is the host's to draw.

The same shapes come from this person's undo and redo of a conversion.

The engine mechanism is optional policy hooks (`onFreeMove`, `onFreeDrop`, `onFreeGroupDrop`,
`onFreeTextCommit`, and `undoState` with `onUndoRestore`): any host can use them to take ordinary
notes into state of its own.

`board.toCanvas(cardId)` takes a card off the lanes as an ordinary note just beside the board, as a
drop on the canvas would (one undo step, the same `cardToNote` change): what a conversation does
for "turn this card into a note". It returns null, or the reason the card stays a card.

## What is selected

`onSelect` tells a host that keeps a conversation about the board what the person has selected:
`{ cardId }` or `{ laneId }` when the selection is exactly one card or lane of this workshop, and
`null` when it moves to anything else (an ordinary note, several notes, nothing) or the workshop is
destroyed with one selected. It is called once per change: moving a card, staging it from the
keyboard and an undo of the ordinary drawing do not repeat it. Any host can hear every selection
change with `slate.onSelectionChange(listener)`.

## One canvas

- **Presentation.** The built-in `slate.presentation` never stops at a column or a caption, in its
  default order, in `setStepOrder`, or in `extractPresentationLayout`. Lanes and cards are stops.
- **Assistive technology.** Columns and captions have no tab stop and no role and are hidden from
  the accessibility tree; a lane's accessible name carries what its caption shows.
- **A double-click on empty space inside a lane** makes an ordinary note there, as it does anywhere
  on the canvas: above the lane, selected, movable, saved with the drawing. It is the document's
  note until its words are committed, when it is dropped where it is (see "Notes and cards are the
  same thing"). Columns are always the backmost notes, so nothing a person puts on a lane is
  hidden behind it.
- **The zoom label** follows the view itself, so it is right the moment `fitToContent`,
  `fitToWidth` or any other call changes the zoom.

## Dragology

By default the lane under the pointer (the engine's hit test over the column notes) and
`workshopCandidate` decide the move. To have the SVG board's own Dragology spec choose among the
legal boards instead, pass `chooseCandidate: dragologyCandidates` (from `slateboxjs/workshops`;
needs React installed, mounts nothing). The native controller still refuses a drop on a lane the
rules close and a drop outside every lane, which Dragology's `closest()` cannot express.

## Smart components: behaviour as data

A board's rules live on the board (`workshop.behaviour`: up to 12 rules, each `refuse` or `warn`, with who set it).
One `check(before, after)` decides a drag, a chat edit, exec's `check_move` and the server's whole save, in the same
sentence; the "How this board behaves" note shows each rule's sentence. Rules read roles, fields and owners, never a
card's words. Chat and exec change them with `add_rule`, `set_rule` and `remove_rule`; a new rule moves nothing.

| Board | Kind / layout | Its rules | Its own edits |
|---|---|---|---|
| Lane boards, Team board | lanes | `capacity`, `path`, `gate`, `bin` | — |
| Launch plan, go-live, hiring plan | `launch-plan`, `hiring-plan` | `deadline`, `overlap`, `snap`, `workdays`, `blackout`, `cascade`, `locked` | `set_task`, `link_tasks`, `set_funding` … |
| Sort the evidence, Discovery tree, Break down a problem | `nest` · `clusters` / `tree` | `nests`, `children`, `depth`, `rank`, `emptyDrop` | `nest_card`, `start_pile`, `merge_cards`, `set_role`, `add_field` … |
| Impact × effort | `nest` · `matrix` | `quadrant` (a square holds at most N) | `score_card` (both scores, 0–10, one edit), `rename_field` |
| Reorg & hiring sandbox | `nest` · `tree` | `children` (span), `parent` (a role or yes/no field never manages), `contains` (every manager has a designer) | `add_field` with `flag` |
| Goals & owners | `nest` · `tree` + `nest.owners` | `sameOwnerAs` (`mode`: `warn`, `ask`, `carry`) | `add_owner`, `set_owner` (with `carry`) |

A nested board is lists in lists: `card.parentId`, a free `card.role`, a fractional `card.order`, and two areas (the
board and a tray). A card dragged under another brings everything under it. On a 2 by 2 a card's box is placed by its
two axis fields (`nest.axes`); the drag rounds to whole scores and a full square holds the card back. With owners, a
row of teams sits above the tree; a card dropped on a team goes to it. Under `carry` the cards under it that were its
team's go too, and the edit names them (`set_owner.carry`): a server that works out a different carry refuses the
drop ("The board changed while you were dragging. Try again.") rather than apply another. On a phone a 2 by 2 stays a
square (358 px); trees become an outline and teams change by chat. Salaries stay off boards: yes/no fields and roles
only.

## Two people on one workshop

The engine sends nothing about workshop notes, so a second client sees a move only when the host
delivers the new model and calls `board.update(next)`; its cards then glide to their new slots. A
conversion has a drawing half that the engine does send (the note leaving or joining the drawing)
and a board half the host delivers; a second client sees both. To
show a move in progress, relay `onPreview` and call `board.preview(candidate)` on the other client.
When a save loses a race (two people fill the last slot), call `board.update(serverModel)` and
`board.refuse(laneId, reason)` on the loser.

## The engine mechanism

`attachWorkshop` is built on `slate.setDragPolicy(policy)` (`src/core/DragPolicy.ts`), which any
host can use to govern notes of its own: `governs(node)` claims a note and sets its capabilities
(`canMove`, `canResize`, `canRotate`, `canDelete`, `canDuplicate`, `canConnect`, `canEditText`,
`canSelect`, `persist`); `onStart`, `onMove`, `onEnd` and `onCancel` rule on a drag; `onTextCommit`
on an inline edit; `onKeyDown` gets keys pressed while the note is selected. For ordinary notes,
`onFreeMove` sees one carried, `onFreeDrop` may take one that was let go (or nudged into place) or
refuse it, and `undoState` / `onUndoRestore` keep host state beside the slate's undo records.
