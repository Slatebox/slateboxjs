import React, { useState } from 'react'
import { availableLanes, moveWorkshopCard, releaseLoad, type Workshop } from './model'

export function ReleasePlanReadout({ value, preview }: { value: Workshop; preview?: Workshop | null }) {
  const shown = preview ?? value
  const laneNames = new Map(shown.lanes.map(lane => [lane.id, lane.label]))
  const features = new Map(shown.cards.map(card => [card.id, card]))
  const dependencies = shown.cards.flatMap(feature => (feature.dependsOn ?? []).map(id => ({ feature, prerequisite: features.get(id)! })))
  return <div className="release-plan-readout" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem' }}>
    <section aria-label="Release capacity" style={{ flex: '1 1 16rem' }}>
      <h3>Release capacity</h3>
      {shown.lanes.filter(lane => lane.capacity !== undefined).map(lane => {
        const used = releaseLoad(shown, lane.id)
        return <div key={lane.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0 .75rem', marginBottom: '.65rem' }}>
          <span>{lane.label}</span><output aria-label={lane.label + ' capacity'}>{used} / {lane.capacity} points</output>
          <meter aria-label={lane.label + ' point budget'} min={0} max={lane.capacity} value={used} style={{ width: '100%', gridColumn: '1 / -1' }} />
        </div>
      })}
    </section>
    <section aria-label="Feature dependencies" style={{ flex: '1 1 16rem' }}>
      <h3>Feature dependencies</h3>
      {dependencies.length === 0 ? <p>These features can ship independently.</p> : <ul>
        {dependencies.map(({feature, prerequisite}) => <li key={JSON.stringify([feature.id, prerequisite.id])}>
          <strong>{feature.label}</strong> needs {prerequisite.label} · {laneNames.get(prerequisite.laneId)}
        </li>)}
      </ul>}
    </section>
    {preview && <p role="status" style={{flexBasis:'100%', margin:0}}>
      {shown.cards.filter(card => value.cards.find(old => old.id === card.id)?.laneId !== card.laneId)
        .map(card => card.label + ' → ' + laneNames.get(card.laneId)).join(' · ')}
    </p>}
  </div>
}

export interface WorkshopMove { cardId: string; laneId: string }

export function ReleaseMoveControls({value, preview, stage, apply, cancel}: {
  value: Workshop
  preview: WorkshopMove | null
  stage: (candidate: Workshop, move: WorkshopMove) => void
  apply: () => void
  cancel: () => void
}) {
  const [selected, setSelected] = useState(value.cards[0].id)
  const feature = value.cards.find(card => card.id === selected) ?? value.cards[0]
  const selector = React.useId()
  return <fieldset onKeyDown={event => { if (event.key === 'Escape') { cancel(); event.stopPropagation() } }}>
    <legend>Schedule a feature</legend>
    <label htmlFor={selector}>Feature</label> <select id={selector} value={feature.id} onChange={event => { setSelected(event.target.value); cancel() }}>
      {value.cards.map(card => <option key={card.id} value={card.id}>{card.label}</option>)}
    </select>
    <div>{availableLanes(value, feature).filter(lane => lane.id !== feature.laneId).map(lane =>
      <button key={lane.id} type="button" onClick={() => stage(moveWorkshopCard(value, feature.id, lane.id), {cardId:feature.id, laneId:lane.id})}>
        Preview {lane.label}</button>)}</div>
    {preview && <div><button type="button" onClick={apply}>Apply move</button>
      <button type="button" onClick={cancel}>Cancel preview</button></div>}
  </fieldset>
}
