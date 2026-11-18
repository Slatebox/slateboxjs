import React from 'react'
import { DraggableRenderer, translate, type Draggable } from 'dragology'
import { availableLanes, laneColors, moveWorkshopCard, workshopLayout, workshopPositions, type Workshop } from './model'

export * from './model'

function wrapLabel(label: string) {
  return label.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map(line => line.trim()) ?? [label]
}

const draggable: Draggable<Workshop> = ({ state, d, draggedId }) => {
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
        <rect width={width} height={top - 12} rx={map ? 2 : 9} fill={laneColors[column]} />
        {wrapLabel(lane.label).map((line, i) =>
          <text dragologyKey={'line-' + i} transform={translate(12, 16 + i * 15)} fontSize={map ? 17 : 13} fontWeight="bold">{line}</text>)}
        <text transform={translate(12, top - 23)} fontSize={12}>{lane.station ? (count ? '● Occupied' : 'Open stop') : lane.capacity ? `${count} of ${lane.capacity} slots` : `${count} ${count === 1 ? "choice" : "choices"}`}</text>
      </g>
    })}
    {state.cards.map(card => {
      const column = state.lanes.findIndex(lane => lane.id === card.laneId)
      const index = state.cards.filter(item => item.laneId === card.laneId).indexOf(card)
      const allowed = availableLanes(state, card)
      const key = 'choice-' + card.id
      return <g id={key} transform={translate(8 + points[column].x, points[column].y + top + index * row)}
        dragologyZIndex={draggedId === key ? '/1' : false}
        dragologyOnDrag={allowed.length > 1 ? () => d.closest(allowed.map(lane =>
          moveWorkshopCard(state, card.id, lane.id))).withFloating() : undefined}>
        <rect width={width} height={height} fill={map ? "#ffe381" : "#fffdf6"} stroke="#78857d" rx={map ? 1 : 8} />
        {wrapLabel(card.label).map((line, i) =>
          <text dragologyKey={'line-' + i} transform={translate(12, 17 + i * 16)} fontSize={14}>{line}</text>)}
      </g>
    })}
  </g>
}

export interface WorkshopBoardProps {
  value: Workshop
  onChange: (value: Workshop) => void
}

export function WorkshopBoard({ value, onChange }: WorkshopBoardProps) {
  const { width, height } = workshopPositions(value)
  return <section aria-label={value.title}>
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <DraggableRenderer draggable={draggable} state={value} onDropState={onChange}
        width={width} height={height} />
    </div>
    {value.lanes[0].station && <div className="workshop-outcomes" aria-live="polite">
      {value.cards.map(card => {
        const current = value.lanes.find(lane => lane.id === card.laneId)!
        return <div key={card.id}><p><strong>{card.label} · {current.label}</strong><br />{current.station!.outcome}</p>
          {availableLanes(value, card).filter(lane => lane.id !== card.laneId).map(lane =>
            <button key={lane.id} type="button" onClick={() => onChange(moveWorkshopCard(value, card.id, lane.id))}>
              {card.label} → {lane.label}
            </button>)}
        </div>
      })}
    </div>}
    <details>
      <summary>Move a card by name</summary>
      {value.cards.map(card => <label key={card.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBlock: 6 }}>
        {card.label}
        <select aria-label={'Move ' + card.label} value={card.laneId}
          onChange={e => onChange(moveWorkshopCard(value, card.id, e.currentTarget.value))}>
          {availableLanes(value, card).map(lane => <option key={lane.id} value={lane.id}>{lane.label}</option>)}
        </select>
      </label>)}
    </details>
  </section>
}
