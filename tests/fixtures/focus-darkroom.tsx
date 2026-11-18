import React, {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {FocusDarkroomBoard, initialFocusDarkroom} from '../../src/workshops'

function Fixture() {
  const [value, setValue] = useState(initialFocusDarkroom())
  const [readOnly, setReadOnly] = useState(false)
  return <>
    <label><input type="checkbox" checked={readOnly} onChange={e => setReadOnly(e.target.checked)}/>View only</label>
    <FocusDarkroomBoard value={value} onChange={setValue} readOnly={readOnly}/>
  </>
}
createRoot(document.querySelector('main')!).render(<Fixture/>)
