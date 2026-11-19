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
  readOnly: false,
  origin: { x: 0, y: 0 },                          // default: to the right of what the slate already holds
})

board.update(modelFromServer)   // redraw from a new model, moving only what changed
board.preview(proposal)         // show a proposed model without committing; null restores
board.refuse('later', 'Someone else just filled Later.') // the canvas cue for a move the host turned down
board.setReadOnly(true)
board.destroy()                 // removes the workshop's notes and nothing else
```

## What it draws

One artwork function draws every view: `workshopToSlate(model, { native: true, origin })`.

| Note | Name | Behaviour |
|---|---|---|
| Lane header | `lane-<id>` | Selectable, not draggable. Double-click or type to rename. |
| Caption | `caption-<id>` | `N of M` with a capacity, `N cards` without, `$amount · description` for the budget experience, points for a release plan. Decoration: no pointer input, focus or selection. |
| Column | `column-<id>` | The lane's drop zone. Decoration. |
| Card | `card-<id>` | Dragged under the workshop's rules. Double-click or type to rename (not in a release plan, where the card also shows its points). |

Station maps also get their connectors; release plans their dependency connectors.

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

## Moving a card

- **Pointer or touch.** Lanes the card may enter are outlined. Over one of them the lane captions
  and the other cards show the outcome. On release the move commits (`onChange`) and the card
  settles in its slot, or it is refused: the card glides back to exactly where it started, the lane
  is outlined, its caption shows the reason for about 1.5 s, and `onRefuse` is called. A drop
  outside every lane is refused with an empty reason. Escape, a cancelled pointer or touch, and
  window blur cancel the drag.
- **Keyboard.** With a card selected, Left and Right stage a move to the previous or next lane it may
  enter (shown exactly like a pointer hover), Enter commits, Escape cancels. An arrow toward a lane
  the rules close is refused the way a drop there is: the lane shows the reason, it is announced,
  and `onRefuse` is called. The slate's live region announces each step.
- **Viewers.** When the slate's own `isReadOnly` or `isCommentOnly` event says the person may not
  edit, cards cannot be moved by pointer or keyboard and nothing can be renamed, whatever
  `readOnly` was passed here.
- **Reduced motion.** With `prefers-reduced-motion: reduce` a refused card, a settled card and a
  redrawn board are placed at once instead of gliding.

The rule is `workshopCandidate(board, cardId, laneId)`: the board the move would produce, the same
board when the card is already there, or null. `workshopRefusal` gives the sentence for a null.

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
