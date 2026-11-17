import React from 'react'
import { DraggableRenderer, translate, type Draggable } from 'dragology'
import { availableLanes, laneColors, moveWorkshopCard, workshopLayout, type Workshop } from './model'

export * from './model'

function wrapLabel(label: string) {
  return label.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map(line => line.trim()) ?? [label]
}

const draggable: Draggable<Workshop> = ({ state, d, draggedId }) => {
  const { pitch, width, row, height, top } = workshopLayout
  return <g fontFamily="system-ui, sans-serif" fill="#18302d">
    {state.lanes.map((lane, column) => {
      const count = state.cards.filter(card => card.laneId === lane.id).length
      return <g id={'heading-' + lane.id} transform={translate(8 + column * pitch, 4)}>
        <rect width={width} height={top - 12} rx={9} fill={laneColors[column]} />
        {wrapLabel(lane.label).map((line, i) =>
          <text dragologyKey={'line-' + i} transform={translate(12, 16 + i * 15)} fontSize={13} fontWeight="bold">{line}</text>)}
        <text transform={translate(12, top - 23)} fontSize={12}>{lane.capacity ? `${count} of ${lane.capacity} slots` : `${count} ${count === 1 ? "choice" : "choices"}`}</text>
      </g>
    })}
    {state.cards.map(card => {
      const column = state.lanes.findIndex(lane => lane.id === card.laneId)
      const index = state.cards.filter(item => item.laneId === card.laneId).indexOf(card)
      const allowed = availableLanes(state, card)
      const key = 'choice-' + card.id
      return <g id={key} transform={translate(8 + column * pitch, top + index * row)}
        dragologyZIndex={draggedId === key ? '/1' : false}
        dragologyOnDrag={allowed.length > 1 ? () => d.closest(allowed.map(lane =>
          moveWorkshopCard(state, card.id, lane.id))).withFloating() : undefined}>
        <rect width={width} height={height} fill="#fffdf6" stroke="#78857d" rx={8} />
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
  const { pitch, row, top } = workshopLayout
  const maxRows = Math.max(...value.lanes.map(lane => value.cards.filter(card => card.laneId === lane.id).length))
  return <section aria-label={value.title}>
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <DraggableRenderer draggable={draggable} state={value} onDropState={onChange}
        width={pitch * value.lanes.length} height={top + (maxRows + 1) * row} />
    </div>
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
