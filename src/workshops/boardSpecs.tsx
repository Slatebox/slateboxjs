// Dragology run headless for the business boards, as dragologyCandidates does for lanes: no React
// tree is mounted. A spec, a starting board and a pointer give the board a drop there would make.
// The geometry Dragology measures is drawn from the same parts the native notes are placed by.
import React from 'react'
import { dragSpecToBehavior, getElementPositionCheap, translate, Vec2, type DragInitContext, type DragSpec, type DragSpecBuilder, type Draggable } from 'dragology'
import type { Workshop } from './model'
import type { PartPlace } from './native'

/**
 * The elements Dragology measures: every card and handle at its place, and each drop target
 * (another task's bar) as a box named `target-<card>`.
 */
export function partsGeometry(parts: PartPlace[], targets: string[] = []) {
  const moving = parts.filter(part => part.name.startsWith('card-') || part.name.startsWith('handle-'))
  // Children are passed as arguments: Dragology matches elements by id, not by React keys.
  return React.createElement('g', null,
    ...moving.map(part => <g id={part.name} transform={translate(part.x, part.y)}><rect width={part.width} height={part.height} /></g>),
    ...parts.filter(part => targets.includes(part.name)).map(part =>
      <rect id={'target-' + part.name.slice(5)} x={part.x} y={part.y} width={part.width} height={part.height} />))
}

/**
 * A function from a pointer position (board coordinates) to the board a drop there makes, for
 * dragging the element `draggedId` grabbed at `grab`. Null when Dragology cannot place the element.
 */
export function headlessDrag(start: Workshop, draggedId: string, grab: { x: number; y: number },
  render: (state: Workshop) => ReturnType<typeof partsGeometry>,
  spec: (d: DragSpecBuilder<Workshop>, state: Workshop) => DragSpec<Workshop>): ((point: { x: number; y: number }) => Workshop) | null {
  let builder: DragSpecBuilder<Workshop> | undefined
  const draggable: Draggable<Workshop> = props => {
    builder ??= props.d
    return render(props.state)
  }
  const context: DragInitContext<Workshop> = { draggable, draggedPath: draggedId + '/', draggedId, anchorPos: Vec2(grab.x, grab.y),
    startState: start, debug: { varyVisualizer: false } }
  if (!getElementPositionCheap(context, start) || !builder) return null
  const behavior = dragSpecToBehavior(spec(builder, start), context)
  return point => behavior({ pointer: Vec2(point.x, point.y) }).dropState
}

/** Whether a point is inside a part's box, grown by `pad`. */
export const inside = (part: { x: number; y: number; width: number; height: number } | undefined, point: { x: number; y: number }, pad = 0) =>
  Boolean(part) && point.x >= part!.x - pad && point.x <= part!.x + part!.width + pad && point.y >= part!.y - pad && point.y <= part!.y + part!.height + pad

/**
 * Dragology's choice, except that a card let go inside the column of a stage or team it may go to
 * goes there even when the pointer is far from the slot it would take (a tall lane's foot).
 */
export function orColumnUnder(choose: ((point: { x: number; y: number }) => Workshop) | null, board: Workshop, cardId: string,
  parts: PartPlace[], legal: Workshop[]): ((point: { x: number; y: number }) => Workshop) | null {
  if (!choose) return null
  const home = board.cards.find(card => card.id === cardId)!.laneId
  return point => {
    const chosen = choose(point)
    if (chosen !== board && JSON.stringify(chosen) !== JSON.stringify(board)) return chosen
    const column = parts.find(part => part.name.startsWith('column-') && part.name !== 'column-' + home && inside(part, point))
    return (column && legal.find(next => next.cards.find(card => card.id === cardId)!.laneId === column.name.slice(7))) || chosen
  }
}
