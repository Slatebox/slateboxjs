import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Slate } from '../../src'
import { industrialWorkshop, nightTransfer, type Workshop, WorkshopBoard, workshopToSlate } from '../../src/workshops'

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
  const fitLanes = location.search === '?fit'
  const signaled = location.search === '?signals'
  const [board, setBoard] = useState(signaled ? {...industrialWorkshop,
    signals:[{id:'sensors-ready',label:'Sensor status',cardId:'sensors',laneId:'pilot',
      whenPresent:'The instruments are ready.',whenAbsent:'The instruments are waiting.'}]} : fitLanes ? fieldNotes : location.search === '?map' ? nightTransfer : industrialWorkshop)
  const [preview, setPreview] = useState<Workshop | null>(null)
  const [editing, setEditing] = useState('')
  const [readOnly, setReadOnly] = useState(false)
  const [commits, setCommits] = useState(0)
  const [undo, setUndo] = useState<Workshop | null>(null)
  const shown = preview ?? board
  return <>
    <label>View only<input type="checkbox" checked={readOnly} onChange={e => setReadOnly(e.target.checked)} /></label>
    <WorkshopBoard onEditCard={setEditing} fitLanes={fitLanes} readOnly={readOnly} value={board} onPreview={setPreview} onChange={next => {
      setUndo(board); setBoard(next); setCommits(count => count + 1)
    }} />
    <output aria-label="Selected object">{editing}</output>
    <output aria-label="Quarterly budget">{shown.cards.filter(card => card.laneId === 'pilot').length} of 2 pilots funded</output>
    <output aria-label="Committed decisions">{commits}</output>
    <button disabled={!undo} onClick={() => { if (undo) setBoard(undo); setUndo(null) }}>Undo decision</button>
    <button onClick={() => new Slate('#slate').loadJSON(workshopToSlate(board))}>Open in canvas</button>
  </>
}
createRoot(document.querySelector('main')!).render(<Example />)
