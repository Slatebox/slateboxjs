import React from 'react'
import { DraggableRenderer, translate, type Draggable, type DraggableProps, type DragStatus } from 'dragology'
import { availableLanes, laneColors, moveWorkshopCard, workshopLayout, workshopPositions, type Workshop } from './model'

export * from './model'

function wrapLabel(label: string) {
  return label.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map(line => line.trim()) ?? [label]
}

function renderBoard({ state, d, draggedId }: DraggableProps<Workshop>, readOnly: boolean) {
  const { width, row, height, top } = workshopLayout
  const { points } = workshopPositions(state)
  const map = Boolean(state.lanes[0].station)
  return <g fontFamily="system-ui, sans-serif" fill="#18302d">
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
      return <g id={'heading-' + lane.id} transform={translate(8 + points[column].x, 4 + points[column].y)}>
        {map && <rect x={0} y={0} width={width} height={top + Math.max(1, count) * row - 10} rx={9} fill="#fcf9ed" stroke="#a8b5aa" strokeDasharray="4 4" />}
        <rect width={width} height={top - 12} rx={map ? 6 : 9} fill={map ? "#253c36" : laneColors[column]} />
        {wrapLabel(lane.label).map((line, i) =>
          <text dragologyKey={'line-' + i} fill={map ? "#fffdf3" : "#18302d"} transform={translate(12, (map ? 23 : 16) + i * 16)} fontSize={map ? 17 : 13} fontWeight="bold">{line}</text>)}
        <text fill={map ? "#ebd29a" : "#18302d"} transform={translate(12, top - 23)} fontSize={12}>{lane.station ? (count ? '● Occupied' : 'Open stop') : lane.capacity ? `${count} of ${lane.capacity} slots` : `${count} ${count === 1 ? "choice" : "choices"}`}</text>
      </g>
    })}
    {state.cards.map(card => {
      const column = state.lanes.findIndex(lane => lane.id === card.laneId)
      const index = state.cards.filter(item => item.laneId === card.laneId).indexOf(card)
      const allowed = availableLanes(state, card)
      const key = 'choice-' + card.id
      return <g id={key} transform={translate((map ? 18 : 8) + points[column].x, points[column].y + top + index * row)}
        dragologyZIndex={draggedId === key ? '/1' : false}
        dragologyOnDrag={!readOnly && allowed.length > 1 ? () => d.closest(allowed.map(lane =>
          moveWorkshopCard(state, card.id, lane.id))).withFloating() : undefined}>
        <rect width={map ? width - 20 : width} height={height - (map ? 6 : 0)} fill={map ? "#ffda75" : "#fffdf6"} stroke="#78857d" rx={map ? 1 : 8} />
        {map && <path d="M198 0v70" stroke="#897530" strokeDasharray="4 5" />}
        {wrapLabel(card.label).map((line, i) =>
          <text dragologyKey={'line-' + i} transform={translate(12, 17 + i * 16)} fontSize={14}>{line}</text>)}
      </g>
    })}
  </g>
}

const editableBoard: Draggable<Workshop> = props => renderBoard(props, false)
const readOnlyBoard: Draggable<Workshop> = props => renderBoard(props, true)

export interface WorkshopBoardProps {
  value: Workshop
  onChange: (value: Workshop) => void
  readOnly?: boolean
  /** Temporary model shown to a linked view while the pointer is held. */
  onPreview?: (value: Workshop | null) => void
}

export function WorkshopBoard({ value, onChange, onPreview, readOnly = false }: WorkshopBoardProps) {
  const { width, height } = workshopPositions(value)
  const [gesture, setGesture] = React.useState(0)
  const dragging = React.useRef(false)
  const onDragStatus = React.useCallback((status: DragStatus<Workshop>) => {
    dragging.current = status.type === 'dragging' || Boolean(status.pendingDrag)
    if (!dragging.current) onPreview?.(null)
  }, [onPreview])

  React.useEffect(() => {
    function cancel(event: Event) {
      if (!dragging.current || (event instanceof KeyboardEvent && event.key !== 'Escape')) return
      dragging.current = false
      onPreview?.(null)
      // Unmount the upstream gesture and its document-level pointerup listener.
      // A release after cancellation must never commit its last candidate.
      setGesture(id => id + 1)
    }
    document.addEventListener('keydown', cancel)
    document.addEventListener('pointercancel', cancel)
    window.addEventListener('blur', cancel)
    return () => {
      document.removeEventListener('keydown', cancel)
      document.removeEventListener('pointercancel', cancel)
      window.removeEventListener('blur', cancel)
    }
  }, [onPreview])
  return <section aria-label={value.title}>
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <DraggableRenderer key={readOnly ? 'read-only' : gesture}
        draggable={readOnly ? readOnlyBoard : editableBoard} state={value}
        onDropState={readOnly ? undefined : onChange} onDragState={readOnly ? undefined : onPreview} onDragStatus={onDragStatus}
        width={width} height={height} />
    </div>
    {value.lanes[0].station && <div className="workshop-outcomes" aria-live="polite">
      {value.cards.map(card => {
        const current = value.lanes.find(lane => lane.id === card.laneId)!
        return <div key={card.id}><p><strong>{card.label} · {current.label}</strong><br />{current.station!.outcome}</p>
          {availableLanes(value, card).filter(lane => lane.id !== card.laneId).map(lane =>
            <button key={lane.id} type="button" disabled={readOnly} onClick={() => onChange(moveWorkshopCard(value, card.id, lane.id))}>
              {card.label} → {lane.label}
            </button>)}
        </div>
      })}
    </div>}
    <details>
      <summary>Move a card by name</summary>
      {value.cards.map(card => <label key={card.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBlock: 6 }}>
        {card.label}
        <select disabled={readOnly} aria-label={'Move ' + card.label} value={card.laneId}
          onChange={e => onChange(moveWorkshopCard(value, card.id, e.currentTarget.value))}>
          {availableLanes(value, card).map(lane => <option key={lane.id} value={lane.id}>{lane.label}</option>)}
        </select>
      </label>)}
    </details>
  </section>
}
