import React, {useEffect, useId, useMemo, useRef, useState} from 'react'
import {DraggableRenderer, translate, type DraggableProps} from 'dragology'
import {printFields, type FocusDarkroom, type ReturnPath} from './model'
import styles from './darkroom.css?inline'

type Wire = {route: ReturnPath}
const positions = {start:99, opener:361};
const dock: Wire = {route:null};
const brass = '#ffcb62';

function specimen(index: number) {
  if (index === 1) return <g fill="#d4e6db" stroke="#8ebcbb" strokeWidth="1">
    {[-1,1].map(side=><g key={side} transform={'scale('+side+' 1)'}>
      <path d="M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z"/>
      <path d="M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29" fill="none"/>
      <ellipse cx="29" cy="-9" rx="6" ry="5" fill="#3d7280"/><circle cx="29" cy="-9" r="2" fill="#e4eee1"/>
      <path d="M2-4Q5-17 12-22" fill="none" stroke="#d4e6db" strokeWidth="2"/>
    </g>)}<ellipse cy="4" rx="3.3" ry="15" fill="#eaebcf"/>
  </g>;
  if (index===0) return <g transform="rotate(22)" stroke="#cedfd0" fill="#b6d1be">
    <path d="M-3 42Q0 0 0-44" fill="none" strokeWidth="2"/>
    {Array.from({length:11},(_,i)=>{const y=33-i*6,w=9+16*Math.sin(i/10*Math.PI);return <g key={i}>
      <path d={`M0 ${y}q${-w} -2 ${-w-4} -15q${w} 1 ${w+4} 15`}/>
      <path d={`M0 ${y-3}q${w-1} -3 ${w+2} -15q${-w} 3 ${-w-2} 15`}/>
    </g>})}
  </g>;
  return <g stroke="#d6d6bd" fill="none" strokeLinecap="round">
    {Array.from({length:12},(_,i)=>{const x=(i-5.5)*6, y=-18-22*Math.sin(i*Math.PI/11);return <g key={i}>
      <path d={`M0 39Q${x*.35} 6 ${x} ${y}`} strokeWidth="1.6"/>
      {[1,2,3,4].map(k=><path key={k} d={`M${x*k/5} ${35+(y-35)*k/5}q${x*.15-5} -4 ${x*.25-7} -13m${7-x*.25} 13q6 -6 7 -13`}/>)}
    </g>})}
  </g>;
}

function returnCircuit({state, d, isTracking}: DraggableProps<Wire>, readOnly = false) {
  const x=state.route ? positions[state.route] : 232, y=state.route?48:85;
  if(isTracking) return <g id="focus-ring" transform={translate(x,y)}/>;
  return <g>
    <rect width="460" height="108" fill="#14282c"/>
    {[positions.start,positions.opener].map((point,i)=><g dragologyKey={String(point)}>
      <path d={`M232 85Q${point} 85 ${point} 48V0`} fill="none" stroke={(state.route==='start'&&i===0)||(state.route==='opener'&&i===1)?brass:'#52727a'} strokeWidth="2" strokeDasharray="3 5"/>
      <circle id={i?'opener-jack':'first-jack'} cx={point} cy="48" r="12" fill="#233d40" stroke="#608185"/>
      <text x={point} y="24" fill="#dae9e1" fontFamily="system-ui,sans-serif" fontSize="13" textAnchor="middle">{i?'Opening print':'First print'}</text>
    </g>)}
    <g id="focus-ring" transform={translate(x,y)} dragologyOnDrag={readOnly ? undefined : ()=>d.closest([dock,{route:'start'},{route:'opener'}]).withFloating()}>
      <circle r="19" fill="#132a2e" stroke="#85693d" strokeWidth="2"/><circle r="13.5" fill="#203336" stroke={brass} strokeWidth="4"/>
      <path d="M-5 -5L1 8l2-6 6-2z" fill="#f8db94"/>
    </g>
  </g>;
}

function readonlyCircuit(props: DraggableProps<Wire>) {
  return returnCircuit(props, true)
}

interface Props {
  value: FocusDarkroom
  onChange?: (next: FocusDarkroom) => void
  readOnly?: boolean
}

export function FocusDarkroomBoard({value, onChange, readOnly = false}: Props) {
  const locked = readOnly || !onChange
  const [preview, setPreview] = useState<Wire | null>(null)
  const [epoch, setEpoch] = useState(0)
  const [opened, setOpened] = useState(1)
  const [result, setResult] = useState('')
  const [draft, setDraft] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const surface = useRef<HTMLDivElement>(null)
  const viewer = useRef<HTMLDialogElement>(null)
  const triggers = useRef<Array<HTMLButtonElement | null>>([])
  const heading = useId()
  const wireState = useMemo(() => ({route: value.route}), [value.route])
  const route = (!locked && preview ? preview : wireState).route
  useEffect(() => {
    const element = surface.current!
    const observer = new ResizeObserver(() => setScale(Math.min(1, element.clientWidth / 460)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  function wire(next: Wire) {
    if (locked) return
    setPreview(null)
    setResult('')
    onChange?.({...value, route: next.route})
  }
  function open(index: number) {
    setOpened(index)
    setDraft(null)
    window.frameElement?.scrollIntoView({block: 'center', inline: 'nearest', behavior: 'instant'})
    viewer.current?.showModal()
  }
  function close() {
    const target = value.route === 'start' ? 0 : opened
    triggers.current[target]?.focus({preventScroll: true})
    const name = value[printFields[target]]
    setResult(target === opened ? 'Focus returned to ' + name + ', the print you opened.'
      : 'Focus jumped to ' + name + '. You opened ' + value[printFields[opened]] + '.')
  }
  function cancelWire() {
    setEpoch(n => n + 1)
    setPreview(null)
  }
  return <section className="focus-darkroom" aria-label="Focus Darkroom" data-readonly={locked || undefined}
    onPointerCancel={cancelWire} onKeyDown={e => {if (e.key === 'Escape' && !viewer.current?.open) cancelWire()}}>
    <style>{styles}</style>
    <h1>Where does focus land?</h1>
    <p>{locked ? '' : 'Wire the gold ring to a return path. '}Open {value.secondPrint}, then close its viewer.</p>
    <div className="contact-sheet">{printFields.map((field, index) =>
      <button type="button" key={field} ref={node => {triggers.current[index] = node}}
        aria-label={'Open ' + value[field]} onClick={() => open(index)}>
        <svg viewBox="-65 -50 130 100" aria-hidden="true">{specimen(index)}</svg><span>{value[field]}</span>
      </button>)}</div>
    <div className="return-circuit" ref={surface} style={{'--circuit-scale':scale} as React.CSSProperties}>
      <DraggableRenderer key={locked ? 'locked' : epoch} state={wireState} width={460} height={108}
        draggable={locked ? readonlyCircuit : returnCircuit} onDragState={locked ? undefined : setPreview}
        onDropState={locked ? undefined : wire}/>
    </div>
    {!locked && <div className="wire-controls">
      <button type="button" aria-pressed={route === 'start'} onClick={() => wire({route:'start'})}>Wire first print</button>
      <button type="button" aria-pressed={route === 'opener'} onClick={() => wire({route:'opener'})}>Wire opening print</button>
    </div>}
    <output aria-label="Return path">{route === 'start' ? 'Every viewer returns to the first print.'
      : route === 'opener' ? 'Each viewer returns to the print that opened it.' : 'No wire attached. The viewer uses its native return path.'}</output>
    <output aria-label="Focus result">{result || 'Open ' + value.secondPrint + ' to try the return path.'}</output>
    <dialog ref={viewer} onClose={close} aria-labelledby={heading} onKeyDown={event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.close()
      }
    }}>
      <svg viewBox="-65 -50 130 100" aria-hidden="true">{specimen(opened)}</svg>
      <h2 id={heading}>{value[printFields[opened]]}</h2>
      {!locked && draft !== null ? <form onSubmit={e => {
        e.preventDefault()
        if (!draft.trim()) return
        onChange?.({...value, [printFields[opened]]:draft.trim()})
        setDraft(null)
        viewer.current?.querySelector<HTMLButtonElement>('[data-close]')?.focus()
      }}>
        <label>Print name <input autoFocus required maxLength={48} value={draft} onChange={e => setDraft(e.target.value)}/></label>
        <div><button type="submit" disabled={!draft.trim()}>Save name</button>
        <button type="button" onClick={() => setDraft(null)}>Cancel rename</button></div>
      </form> : null}
      <button type="button" data-close onClick={() => viewer.current?.close()}>Close viewer</button>
      {!locked && draft === null && <button type="button" onClick={() => setDraft(value[printFields[opened]])}>Rename print</button>}
    </dialog>
  </section>
}
