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
  onChange?: (next: Workshop, change: WorkshopChangeEvent) => void | Promise<boolean | void>
  onRefuse?: (refusal: WorkshopRefusalEvent) => void
  onPreview?: (candidate: Workshop | null) => void
  onSelect?: (selection: { cardId: string } | { laneId: string } | null) => void
  readOnly?: boolean
  origin?: { x: number; y: number }
  chooseCandidate?: WorkshopCandidateChooser
  layout?: WorkshopBoardLayout          // { lanesPerRow?: number }
  style?: WorkshopNoteStyle
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
  destroy(): void
  readonly value: Workshop
  readonly origin: { x: number; y: number }
  readonly layout: WorkshopBoardLayout
  readonly bounds: { x: number; y: number; width: number; height: number }
  whenDrawn(): Promise<void>
}
```

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
between two workshop notes is part of the drawing: it takes no pointer input, so it cannot be
selected, re-plugged or deleted, and a press on a card it crosses reaches the card.

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
  from where the note was let go into its slot and becomes the selection. Only one ordinary note at a
  time: a group of selected notes dragged together is an ordinary move.
- **A lane that refuses a note** sends it gliding back to where it started, outlines the lane, shows
  the reason in its caption for about 1.5 s, announces it, and calls
  `onRefuse({ noteId, laneId, reason })`, exactly as for a refused card. Nothing is saved, sent or
  recorded. While a note is carried over the board the lanes are outlined as for a card
  (`data-workshop-drop` on each column says `open`, `over` or `refused`).
- **Connectors.** A note joined to other notes by lines stays a note: the lane refuses it with
  "A note joined to other notes by lines stays a note. Remove its lines first." A card is a drawing
  of the model and cannot hold a line to the saved drawing, and a line is never dropped silently.
  A note with a picture stays a note the same way.
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
// An ordinary note became card `cardId` at the foot of `laneId`; the note left the drawing.
{ cardId, laneId, noteToCard: { noteId, label, look? } }
// Card `cardId` left the board; it is now the ordinary note `noteId` in the drawing.
{ cardId, cardToNote: { noteId } }
```

A host saves both like any change. Return a promise of `false` from `onChange` when the save fails
(the board was refused on the server, say): the drawing half is put back (the note returns to the
canvas, or leaves it again), so the note and the card are never both gone. The same shapes come
from this person's undo and redo of a conversion.

The engine mechanism is three optional policy hooks (`onFreeMove`, `onFreeDrop`, and `undoState` with
`onUndoRestore`): any host can use them to take ordinary notes into state of its own.

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
  note until it is dropped on a lane, which (once it has words) makes it a card. Columns are always the backmost notes, so nothing a person puts on a lane is
  hidden behind it.
- **The zoom label** follows the view itself, so it is right the moment `fitToContent`,
  `fitToWidth` or any other call changes the zoom.

## Dragology

By default the lane under the pointer (the engine's hit test over the column notes) and
`workshopCandidate` decide the move. To have the SVG board's own Dragology spec choose among the
legal boards instead, pass `chooseCandidate: dragologyCandidates` (from `slateboxjs/workshops`;
needs React installed, mounts nothing). The native controller still refuses a drop on a lane the
rules close and a drop outside every lane, which Dragology's `closest()` cannot express.

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
