# Workshops as native notes

`attachWorkshop` runs a workshop on an ordinary, live `Slate`: the same instance the host already
has, with its pan, zoom, minimap, selection and inline text editing. Lanes and cards are real
notes. The workshop model stays the one saved source of truth; the notes are its drawing.

```js
import { Slate } from 'slateboxjs'
import { attachWorkshop } from 'slateboxjs/workshops/model' // plain JavaScript, no React

const board = attachWorkshop(slate, model, {
  onChange(next, change) { save(next) },          // { cardId, laneId } or { rename: { laneId | cardId, label } }
  onRefuse({ cardId, laneId, reason }) { toast(reason) },
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
  onChange?: (next: Workshop, change: WorkshopChangeEvent) => void
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
  borderColor?: string                  // default #cccccc
  borderWidth?: number                  // default 1
  cornerRadius?: number                 // default 0 (square, like a plain note)
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

The names `lane-<id>`, `card-<id>`, `caption-<id>`, `column-<id>` and `image-<id>` belong to the
workshop. `attachWorkshop` throws if the slate already has a note by one of them. If a document
loaded later brings one (`loadJSON`, undo, a collaborator's full replace), that note stays the
document's own note: saved, ungoverned, and left in place by `destroy()`; the workshop logs a
warning and goes without its own note of that name. `loadJSON`, undo and redo otherwise redraw the
workshop from its model, as new notes.

## In the host's note style

With no `style`, lanes and cards are drawn as the engine draws an ordinary note: the same family,
size, text colour and border (`DEFAULT_NOTE_STYLE`, exported from `slateboxjs`), with square corners.
A host whose notes look different passes that look in `style`, and every lane header, caption and
card takes it. Lane fills, card fills and the tint behind each lane stay the workshop's own.

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

The lanes below the screen are reached by panning, and a card is carried to them by holding it
near an edge (see below). A map ignores `lanesPerRow`: its stations stay where their author put
them, so a map wider than the screen is fitted smaller.

## Moving a card

- **Pointer or touch.** Lanes the card may enter are outlined. Over one of them the lane captions
  and the other cards show the outcome. On release the move commits (`onChange`) and the card
  settles in its slot, or it is refused: the card glides back to exactly where it started, the lane
  is outlined, its caption shows the reason for about 1.5 s, and `onRefuse` is called. A drop
  outside every lane is refused with an empty reason. Escape, a cancelled pointer or touch, and
  window blur cancel the drag.
- **To a lane that is off screen.** A card held within 56 CSS pixels of an edge of the visible
  canvas pans the canvas that way, faster the nearer the edge, and stays under the pointer or finger
  while it does. An edge only pulls once the card has been carried toward it, so a card that starts
  beside an edge can be carried away in peace. Refusal and cancel return the card to where it
  started, however far the canvas has moved. (This is the drag policy's behaviour for every
  governed note; `onPan` and `onPanEnd` are not called for it.)
- **Keyboard.** With a card selected, Left and Right stage a move to the previous or next lane it may
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
  note, not a card. Columns are always the backmost notes, so nothing a person puts on a lane is
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
delivers the new model and calls `board.update(next)`; its cards then glide to their new slots. To
show a move in progress, relay `onPreview` and call `board.preview(candidate)` on the other client.
When a save loses a race (two people fill the last slot), call `board.update(serverModel)` and
`board.refuse(laneId, reason)` on the loser.

## The engine mechanism

`attachWorkshop` is built on `slate.setDragPolicy(policy)` (`src/core/DragPolicy.ts`), which any
host can use to govern notes of its own: `governs(node)` claims a note and sets its capabilities
(`canMove`, `canResize`, `canRotate`, `canDelete`, `canDuplicate`, `canConnect`, `canEditText`,
`canSelect`, `persist`); `onStart`, `onMove`, `onEnd` and `onCancel` rule on a drag; `onTextCommit`
on an inline edit; `onKeyDown` gets keys pressed while the note is selected.
