import React,{useState} from 'react'
import {createRoot} from 'react-dom/client'
import {offlineHandoff,OfflineHandoffBoard,type OfflineHandoffModel} from '../../src/workshops'
function App(){
  const [value,save] = useState(offlineHandoff)
  const [history,log] = useState<OfflineHandoffModel[]>([])
  const [locked,lock] = useState(false)
  return <>
    <OfflineHandoffBoard value={value} readOnly={locked} onChange={next=>{log([...history,value]);save(next)}}/>
    <output aria-label="Commits">{history.length}</output>
    <button disabled={!history.length} onClick={()=>{save(history[history.length-1]);log(history.slice(0,-1))}}>Undo</button>
    <button onClick={()=>lock(!locked)}>Toggle read-only</button>
  </>
}
createRoot(document.querySelector('main')!).render(<App/>)
