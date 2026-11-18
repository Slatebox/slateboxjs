import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Slate } from '../../src'
import { industrialWorkshop, nightTransfer, type Workshop, WorkshopBoard, workshopToSlate } from '../../src/workshops'

function Example() {
  const [board, setBoard] = useState(location.search === '?map' ? nightTransfer : industrialWorkshop)
  const [preview, setPreview] = useState<Workshop | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [commits, setCommits] = useState(0)
  const [undo, setUndo] = useState<Workshop | null>(null)
  const shown = preview ?? board
  return <>
    <label>View only<input type="checkbox" checked={readOnly} onChange={e => setReadOnly(e.target.checked)} /></label>
    <WorkshopBoard readOnly={readOnly} value={board} onPreview={setPreview} onChange={next => {
      setUndo(board); setBoard(next); setCommits(count => count + 1)
    }} />
    <output aria-label="Quarterly budget">{shown.cards.filter(card => card.laneId === 'pilot').length} of 2 pilots funded</output>
    <output aria-label="Committed decisions">{commits}</output>
    <button disabled={!undo} onClick={() => { if (undo) setBoard(undo); setUndo(null) }}>Undo decision</button>
    <button onClick={() => new Slate('#slate').loadJSON(workshopToSlate(board))}>Open in canvas</button>
  </>
}
createRoot(document.querySelector('main')!).render(<Example />)
