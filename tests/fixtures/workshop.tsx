import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Slate } from '../../src'
import { industrialWorkshop, WorkshopBoard, workshopToSlate } from '../../src/workshops'

function Example() {
  const [board, setBoard] = useState(industrialWorkshop)
  return <>
    <WorkshopBoard value={board} onChange={setBoard} />
    <button onClick={() => new Slate('#slate').loadJSON(workshopToSlate(board))}>Open in canvas</button>
  </>
}
createRoot(document.querySelector('main')!).render(<Example />)
