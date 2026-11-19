import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Slate } from '../../src'
import { addWorkshopCard, createLaneWorkshop, industrialWorkshop, nightTransfer, releasePlan, type Workshop, WorkshopBoard, workshopToSlate } from '../../src/workshops'

const fieldNotes: Workshop = {
  version:1, title:'Choose the two recordings for the evening broadcast',
  lanes:[{id:'notes', label:'Field recordings'}, {id:'pilot', label:'On the air', capacity:2}],
  cards:[
    {id:'rain', label:'The first drops strike the tin roof above the station entrance', laneId:'notes'},
    {id:'train', label:'A driver sounds the train whistle across the frozen river', laneId:'notes'},
    {id:'birds', label:'Birdsong cuts through the rush of water beneath the bridge', laneId:'notes'},
  ],
}

function Example() {
  const mapCanvas = location.search === '?map-studio'
  const author = location.search === '?author'
  const fitLanes = location.search === '?fit' || author
  const selectable = location.search === '?select'
  const signaled = location.search === '?signals'
  const [board, setBoard] = useState(selectable ? releasePlan : author ? createLaneWorkshop() : signaled ? {...industrialWorkshop,
    signals:[{id:'sensors-ready',label:'Sensor status',cardId:'sensors',laneId:'pilot',
      whenPresent:'The instruments are ready.',whenAbsent:'The instruments are waiting.'}]} : fitLanes ? fieldNotes : (mapCanvas || location.search === '?map') ? nightTransfer : industrialWorkshop)
  const [preview, setPreview] = useState<Workshop | null>(null)
  const [editing, setEditing] = useState('')
  const [readOnly, setReadOnly] = useState(false)
  const [commits, setCommits] = useState(0)
  const [undo, setUndo] = useState<Workshop | null>(null)
  const shown = preview ?? board
  return <>
    <label>View only<input type="checkbox" checked={readOnly} onChange={e => setReadOnly(e.target.checked)} /></label>
    <WorkshopBoard mapCanvas={mapCanvas} onAddCard={author ? (id, element) => {
      if (element.dataset.workshopAddCard === id) setBoard(old => addWorkshopCard(old, id, {label:'Wind chimes'}))
    } : undefined} onSelectCard={selectable || mapCanvas ? id => setEditing('card:' + id) : undefined} onEditLane={author || selectable ? (id, element) => {
      if (element.dataset.workshopLane === id) setEditing('lane:' + id)
    } : undefined} onEditStation={id => setEditing('station:' + id)} onEditCard={setEditing} fitLanes={fitLanes} readOnly={readOnly} value={board} onPreview={setPreview} onChange={next => {
      setUndo(board); setBoard(next); setCommits(count => count + 1)
    }} />
    <button onClick={() => setBoard(old => ({ ...old, lanes:old.lanes.map((lane,i) => i ? lane : {...lane,label:'Pitches / prises de son'}) }))}>Rename first lane</button>
    <output aria-label="Selected object">{editing}</output>
    <output aria-label="Quarterly budget">{shown.cards.filter(card => card.laneId === 'pilot').length} of 2 pilots funded</output>
    <output aria-label="Committed decisions">{commits}</output>
    <button disabled={!undo} onClick={() => { if (undo) setBoard(undo); setUndo(null) }}>Undo decision</button>
    <button onClick={() => new Slate('#slate').loadJSON(workshopToSlate(board))}>Open in canvas</button>
  </>
}
createRoot(document.querySelector('main')!).render(<Example />)
