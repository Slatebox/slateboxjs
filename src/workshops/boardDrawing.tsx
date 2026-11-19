import React from 'react'
import { compactStationGap, type fitLaneLayout } from './fitLanes'
import { translate, type DraggableProps, type DragSpec, type DragSpecBuilder } from 'dragology'
import { availableLanes, releaseLoad, laneColors, workshopCandidate, workshopLayout, workshopPositions, type Workshop, type WorkshopCard, type WorkshopLane } from './model'

/**
 * The Dragology spec for dragging one card: among the boards its lanes allow, the
 * pointer picks the closest. On an ordinary lane board each lane is a drop target
 * and anywhere else means "stay" (a full or forbidden lane is not an invitation to
 * a neighbouring one); on a map or a release plan the card goes to the nearest
 * board it may reach.
 *
 * The SVG board hands this to Dragology's renderer. A native slate evaluates the
 * same spec at its own pointer positions (see dragologyCandidates).
 */
export function workshopDragSpec(d: DragSpecBuilder<Workshop>, state: Workshop, card: WorkshopCard,
  lanes: WorkshopLane[] = availableLanes(state, card)): DragSpec<Workshop> {
  const candidates = lanes.map(lane => workshopCandidate(state, card.id, lane.id)!)
  if (state.lanes[0].station || state.kind) return d.closest(candidates).withFloating()
  // A full or forbidden lane is not an invitation to a neighboring lane.
  const targets = lanes.map((lane, i) => d.dropTarget('drop-' + lane.id, candidates[i], { boundsState: state }))
  return d.closest(targets).whenFar(state).withFloating()
}

function wrapLabel(label: string) {
  return label.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map(line => line.trim()) ?? [label]
}

export function renderBoard({ state, d, draggedId, isTracking }: DraggableProps<Workshop>, readOnly: boolean, fitted?: ReturnType<typeof fitLaneLayout>, editHeaders = false, addCards = false, actionId = '', mapCanvas = false, selectCards = false) {
  const layout = fitted?.layout ?? workshopLayout
  const { width, row, height, top } = layout
  const { points, height: boardHeight } = workshopPositions(state, layout, mapCanvas ? compactStationGap : undefined)
  const map = Boolean(state.lanes[0].station)
  const position = (card: Workshop['cards'][number]) => {
    const column = state.lanes.findIndex(lane => lane.id === card.laneId)
    const index = state.cards.filter(item => item.laneId === card.laneId).indexOf(card)
    return translate((map ? 18 : 8) + points[column].x, points[column].y + top + index * row)
  }
  // Upstream only asks for the anchor's geometry while comparing candidate futures.
  if (isTracking && draggedId) {
    const card = state.cards.find(item => 'choice-' + item.id === draggedId)
    if (card) return <g id={draggedId} transform={position(card)} />
  }
  const ordinary = !map && !state.kind
  return <g fontFamily="system-ui, sans-serif" fill="#18302d">
    {ordinary && draggedId && state.lanes.map((lane, i) =>
      <rect id={'drop-' + lane.id} x={points[i].x} y={0} width={layout.pitch} height={boardHeight}
        fill="none" pointerEvents="none" aria-hidden="true" />)}
    {state.lanes.flatMap((lane, index) => (lane.station?.next ?? []).map(next => {
      const from = points[index]
      const to = points[state.lanes.findIndex(dest => dest.id === next)]
      const cx = width / 2 + 8, cy = (top - 12) / 2 + 4
      const dx = to.x - from.x, dy = to.y - from.y
      const inset = Math.min(dx ? width / 2 / Math.abs(dx) : Infinity, dy ? (cy - 4) / Math.abs(dy) : Infinity)
      const endX = to.x + cx - dx * inset, endY = to.y + cy - dy * inset
      return <g dragologyKey={lane.id + '-' + next}>
        <line x1={from.x + cx} y1={from.y + cy} x2={endX} y2={endY} stroke="#506b61" strokeWidth={3} />
        <path d="M0 0l-11 -5v10z" fill="#315044" transform={`translate(${endX} ${endY}) rotate(${Math.atan2(dy, dx) * 180 / Math.PI})`} />
      </g>
    }))}
    {state.lanes.map((lane, column) => {
      const count = state.cards.filter(card => card.laneId === lane.id).length
      const pointsUsed = state.kind === 'release-plan' && releaseLoad(state, lane.id)
      const caption = state.kind === 'release-plan'
        ? pointsUsed + (lane.capacity ? ' / ' + lane.capacity : '') + ' points'
        : lane.station ? (count ? '● Occupied' : 'Open stop') : lane.capacity ? `${count} of ${lane.capacity} slots` : `${count} ${count === 1 ? 'choice' : 'choices'}`
      return <g id={'heading-' + lane.id} transform={translate(8 + points[column].x, 4 + points[column].y)}>
        {map && !mapCanvas && <rect x={0} y={0} width={width} height={top + Math.max(1, count) * row - 10} rx={9} fill="#fcf9ed" stroke="#a8b5aa" strokeDasharray="4 4" />}
        <g {...(editHeaders && !readOnly ? {
          ...(map ? { 'data-workshop-station': lane.id } : { 'data-workshop-lane': lane.id }), role: 'button', tabIndex: 0, 'aria-labelledby': actionId + '-edit-' + lane.id, cursor: 'pointer',
        } : {})}>
          <rect width={width} height={top - 12} rx={mapCanvas ? 12 : map ? 6 : 9} stroke={mapCanvas ? "#a0b9a6" : undefined} fill={mapCanvas ? "#f4f8ef" : map ? "#253c36" : laneColors[column]} />
          {(fitted?.labels.get('heading-' + lane.id) ?? wrapLabel(lane.label)).map((line, i) =>
            <text dragologyKey={'line-' + i} fill={mapCanvas ? "#244b3d" : map ? "#fffdf3" : "#18302d"} transform={translate(12, (map ? 23 : 16) + i * 16)} fontSize={mapCanvas ? 15 : map ? 17 : 13} fontWeight="bold">{line}</text>)}
          {!mapCanvas && <text fill={map ? "#ebd29a" : "#18302d"} transform={translate(12, top - 23)} fontSize={12}>{caption}</text>}
        </g>
        {addCards && count < (lane.capacity ?? Infinity) && <g data-workshop-add-card={lane.id}
          transform={translate(0, top + count * row - 4)} role="button" tabIndex={0}
          aria-labelledby={actionId + '-add-' + lane.id} cursor="pointer">
          <rect width={width} height={40} rx={7} fill="#fbfcf9" stroke="#64796c" strokeDasharray="4 3" />
          <text transform={translate(12, 25)} fontSize={14}>+ Add card</text>
        </g>}
      </g>
    })}
    {state.cards.map(card => {
      const allowed = readOnly ? [] : availableLanes(state, card)
      const key = 'choice-' + card.id
      return <g id={key} data-workshop-card={card.id} transform={position(card)}
        {...(selectCards ? {role:'button', tabIndex:0, 'aria-labelledby':actionId + '-select-' + card.id} : {})}
        dragologyZIndex={draggedId === key ? '/1' : false}
        dragologyOnDrag={allowed.length > 1 ? () => workshopDragSpec(d, state, card, allowed) : undefined}>
        <rect width={map ? width - 20 : width} height={height - (map ? 6 : 0)} fill={map ? "#ffda75" : "#fffdf6"} stroke="#78857d" rx={mapCanvas ? 12 : map ? 1 : 8} />
        {map && !mapCanvas && <path d="M198 0v70" stroke="#897530" strokeDasharray="4 5" />}
        {state.kind === 'release-plan' && <text transform={translate(12, height - 10)} fill="#466358" fontSize={12}>{card.points} pts</text>}
        {(fitted?.labels.get(key) ?? wrapLabel(card.label)).map((line, i) =>
          <text dragologyKey={'line-' + i} transform={translate(12, (mapCanvas ? 21 : 17) + i * 16)} fontSize={14}>{line}</text>)}
      </g>
    })}
  </g>
}

