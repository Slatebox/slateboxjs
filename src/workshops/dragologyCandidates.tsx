import { dragSpecToBehavior, getElementPositionCheap, Vec2, type Draggable, type DragInitContext, type DragSpecBuilder } from 'dragology'
import { renderBoard, workshopDragSpec } from './boardDrawing'
import { workshopCandidate, workshopDestinations, type Workshop } from './model'
import type { WorkshopCandidateChooser } from './native'

/**
 * Let Dragology choose the board a pointer position means on a native slate.
 *
 * Nothing is rendered. Dragology's drag engine is a function of a spec, a starting
 * board and a pointer position: `dragSpecToBehavior(spec, context)` builds it, and
 * each call with `{ pointer }` returns the board a drop there would produce. The
 * spec is workshopDragSpec, the one the SVG board gives Dragology's renderer; the
 * geometry it measures (where a card sits in each candidate board, where each
 * lane's drop target is) comes from the same renderBoard function, which the
 * native artwork is laid out to match.
 *
 * Pass it to attachWorkshop as `chooseCandidate`. It needs React to be installed,
 * because Dragology imports it and describes geometry as React elements, but no
 * React tree is ever mounted.
 */
export const dragologyCandidates: WorkshopCandidateChooser = (board, cardId, grab) => {
  const card = board.cards.find(item => item.id === cardId)
  const lanes = workshopDestinations(board, cardId)
  if (!card || lanes.length < 2) return null
  // Dragology does not export its spec builder; it hands one to the draggable on
  // every call, so take it from the first measurement.
  let builder: DragSpecBuilder<Workshop> | undefined
  const draggable: Draggable<Workshop> = props => {
    builder ??= props.d
    return renderBoard(props, false)
  }
  const context: DragInitContext<Workshop> = {
    draggable, draggedPath: '', draggedId: 'choice-' + cardId, anchorPos: Vec2(grab.x, grab.y),
    startState: board, debug: { varyVisualizer: false },
  }
  getElementPositionCheap(context, board)
  if (!builder) return null
  const behavior = dragSpecToBehavior(workshopDragSpec(builder, board, card, lanes, workshopCandidate), context)
  return point => behavior({ pointer: Vec2(point.x, point.y) }).dropState
}
