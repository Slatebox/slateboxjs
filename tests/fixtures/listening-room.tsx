import React, {useState} from 'react'
import {createRoot} from 'react-dom/client'
import {ListeningRoomBoard, listeningRoom} from '../../src/workshops'

function Room() {
  const [value, setValue] = useState(listeningRoom)
  const [readOnly, setReadOnly] = useState(false)
  return <>
    <ListeningRoomBoard value={value} onChange={setValue} readOnly={readOnly}/>
    <output aria-label="Saved mix">{value.mix}</output>
    <button onClick={() => setValue({...value,leftLabel:'Seashells',rightLabel:'River bells'})}>Rename materials</button>
    <button onClick={() => setReadOnly(!readOnly)}>Toggle read-only</button>
  </>
}
createRoot(document.querySelector('main')!).render(<Room />)
