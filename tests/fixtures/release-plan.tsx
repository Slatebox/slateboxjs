import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Slate } from '../../src'
import { releasePlan, validateWorkshop, WorkshopBoard, workshopToSlate, type WorkshopMove } from '../../src/workshops'

function Plan() {
  const [value, setValue] = useState(() => validateWorkshop(JSON.parse(sessionStorage.getItem('plan') || 'null') ?? releasePlan))
  const [intent, setIntent] = useState<WorkshopMove>()
  return <>
    <WorkshopBoard value={value} onChange={(next, move) => {
      setValue(next); setIntent(move); sessionStorage.setItem('plan', JSON.stringify(next))
    }} />
    <output aria-label="Last move intent">{intent ? intent.cardId + ' to ' + intent.laneId : ''}</output>
    <button onClick={() => new Slate('#slate').loadJSON(workshopToSlate(value))}>Open presentation artwork</button>
  </>
}
createRoot(document.querySelector('main')!).render(<Plan />)
