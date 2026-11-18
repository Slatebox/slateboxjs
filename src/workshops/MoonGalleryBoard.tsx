import React from 'react'
import { DraggableRenderer, translate, type Draggable } from 'dragology'
import { canHangPanel, hangGalleryPanel, type MoonGalleryModel } from './moonGallery'

const stops=[{x:90,y:56},{x:246,y:56},{x:402,y:56}];
const loose=[{x:55,y:162},{x:219,y:174},{x:455,y:154}];
const panelWidth=148, panelHeight=104;
function painting(index: number) {
  // The same world coordinates cross every edge, so the dunes line up only
  // once all three canvases hang level.
  const lower=(offset: number,relief: number,color: string)=>{
    const curve=Array.from({length:38},(_,i)=>{
      const x=Math.min(panelWidth,4*i),world=index*panelWidth+x;
      const y=offset+relief*(Math.sin(world/46)+.39*Math.cos(world/19)+.09*Math.sin(world/7));
      return (i?'L':'M')+x+' '+y.toFixed(1);
    }).join('');
    return <path d={curve+`L${panelWidth} ${panelHeight}H0z`} fill={color}/>;
  };
  return <g>
    <rect x="-4" y="-4" width={panelWidth+8} height={panelHeight+8} fill="#4b423c"/><rect x="-2" y="-2" width={panelWidth+4} height={panelHeight+4} fill="#caa67d"/>
    <rect width={panelWidth} height={panelHeight} fill="#343b66"/>
    {Array.from({length:13},(_,i)=><circle dragologyKey={'sky'+i} cx={6+((i*77+index*19)%136)} cy={4+((i*29+index*11)%35)} r={i%4===0?1.3:.65} fill="#f4e0bc"/>)}
    {index===1&&<g><circle cx="90" cy="22" r="15" fill="#ffdf9a"/><circle cx="95" cy="18" r="3" fill="#ebc68b"/><circle cx="85" cy="28" r="2" fill="#ebc68b"/></g>}
    {lower(48,7,'#9b88aa')}{lower(59,10,'#bf9492')}{lower(75,7,'#596d83')}{lower(88,6,'#2a4858')}
    {Array.from({length:7},(_,i)=><path dragologyKey={'water'+i} d={`M${4+(i*37+index*13)%124} ${92+(i*3)%10}h${4+(i%3)*4}`} stroke="#7d9b9a"/>)}
  </g>;
}

function renderWall(readOnly: boolean, enabledIds?: readonly string[]): Draggable<MoonGalleryModel> {
  return ({state, d, draggedId, isTracking}) => {
    const anchor = (index: number) => index === 1 ? 'panorama-panel' : 'gallery-panel-' + index
    const position = (index: number) => (state.hung.includes(state.panels[index].id) ? stops : loose)[index]
    const dragged = state.panels.findIndex((_, index) => anchor(index) === draggedId)
    if (isTracking && dragged >= 0) {
      const point = position(dragged)
      return <g id={anchor(dragged)} transform={translate(point.x, point.y)} />
    }
    return <g>
    <rect width="640" height="300" fill="#d6c7b2"/>
    <path d="M0 0h640v17H0z" fill="#b8ad99"/><path d="M0 220h640v80H0z" fill="#c19c79"/>
    <path d="M0 218h640v7H0z" fill="#a38d77"/>
    {[0,1,2,3,4,5,6].map(i=><path dragologyKey={'floor'+i} d={`M${40+83*i} 225l${(i-3)*24} 75`} stroke="#ae8b6c"/>)}
    {[0,1,2].map(i=><g dragologyKey={'light'+i} transform={translate(163+i*156,8)}>
      <path d="M-10 0h20l-4 8H-6z" fill="#67584b"/><path d="M-4 9h8l84 181H-84z" fill="#f8e8bf" opacity=".22"/>
    </g>)}

    {state.panels.map((panel, index) => {
      const hook = stops[index]
      const point = position(index)
      const movable = !readOnly && (!enabledIds || enabledIds.includes(panel.id)) && canHangPanel(state, panel.id)
      return <g dragologyKey={panel.id}>
        <rect id={index === 1 ? 'gallery-hook' : 'gallery-hook-' + index} x={hook.x} y={hook.y}
          width={panelWidth} height={panelHeight} stroke="#887e6b" strokeDasharray="4 7" fill="none"/>
        <circle cx={hook.x+panelWidth/2} cy={hook.y+6} r="3" fill="#7a6c57"/>
        <g id={anchor(index)} transform={translate(point.x,point.y)} style={{cursor: movable ? 'grab' : 'default', touchAction: movable ? 'none' : 'auto'}}
          dragologyZIndex={draggedId === anchor(index) ? '/1' : false}
          dragologyOnDrag={movable ? () => d.between([state, hangGalleryPanel(state, panel.id)]) : undefined}>
          {painting(['dunes','moon','coast'].indexOf(panel.artwork))}
        </g>
      </g>
    })}
    </g>
  }
}

export interface MoonGalleryBoardProps {
  value: MoonGalleryModel
  onChange: (next: MoonGalleryModel) => void
  readOnly?: boolean
  /** Let a facilitator reserve certain pieces for another participant. */
  enabledIds?: readonly string[]
  onPreview?: (candidate: MoonGalleryModel | null) => void
}

export function MoonGalleryBoard({value, onChange, onPreview, readOnly = false, enabledIds}: MoonGalleryBoardProps) {
  const surface = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(1)
  const [epoch, setEpoch] = React.useState(0)
  const [candidate, setCandidate] = React.useState<MoonGalleryModel | null>(null)
  const current = React.useRef(value)
  current.current = value
  const wall = React.useMemo(() => renderWall(readOnly, enabledIds), [readOnly, enabledIds])
  const preview = (next: MoonGalleryModel | null) => { setCandidate(next); onPreview?.(next) }
  const notify = React.useRef(onPreview)
  notify.current = onPreview
  const cancel = React.useCallback(() => {
    setCandidate(null)
    notify.current?.(null)
    setEpoch(n => n + 1)
  }, [])
  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (surface.current) setScale(Math.min(1, surface.current.clientWidth / 640))
    })
    observer.observe(surface.current!)
    return () => observer.disconnect()
  }, [])
  React.useEffect(() => {
    cancel()
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') cancel() }
    document.addEventListener('keydown', escape)
    window.addEventListener('blur', cancel)
    return () => { document.removeEventListener('keydown', escape); window.removeEventListener('blur', cancel) }
  }, [value, readOnly, cancel])
  function commit(next: MoonGalleryModel) {
    preview(null)
    if (readOnly || current.current !== value) return
    const id = next.hung.find(piece => !value.hung.includes(piece))
    if (id && (!enabledIds || enabledIds.includes(id)) && canHangPanel(value, id)) onChange(hangGalleryPanel(value,id))
  }
  const shown = candidate ?? value
  const justHung = shown.panels.find(panel => shown.hung.includes(panel.id) && !value.hung.includes(panel.id))
  const waiting = value.panels.filter(panel => !value.hung.includes(panel.id))
  return <section aria-label="Panorama wall">
    <div className="exhibit-stage" ref={surface} onPointerCancel={cancel} style={{overflow:'hidden',background:'#d6c7b2'}}>
      <div style={{width:640, zoom:scale, margin:'auto'}}>
        <DraggableRenderer key={epoch} draggable={wall} width={640} height={300} state={value}
          onDragState={preview} onDropState={commit}/>
      </div>
    </div>
    <div style={{display:'flex', gap:12, alignItems:'center', marginTop:8}}>
      <strong>Visitor’s view</strong>
      <svg aria-hidden="true" viewBox="0 0 150 40" width="150" height="40" style={{maxWidth:'45%'}}>
        {shown.panels.map((panel, index) => <svg key={panel.id} x={index*50} width="50" height="40" viewBox="0 0 50 40">
          <rect width="50" height="40" fill={shown.hung.includes(panel.id) ? '#343b66' : '#c7b8a8'}/>
          {shown.hung.includes(panel.id) && <g>
            {panel.artwork === 'moon' && <circle cx="27" cy="10" r="6" fill="#ffdf9a"/>}
            <path d={panel.artwork === 'dunes' ? 'M0 24Q14 8 50 25V40H0z' : panel.artwork === 'moon' ? 'M0 25Q24 36 50 22V40H0z' : 'M0 22Q25 8 50 18V40H0z'} fill="#bd969d"/>
            <path d="M0 32q13-4 25-1t25 1v8H0z" fill="#365566"/>
          </g>}
        </svg>)}
      </svg>
    </div>
    <output aria-label="Panorama" style={{display:'block',marginBlock:8}}>{justHung
      ? justHung.label + ' lines up with its hook.'
      : waiting.length ? value.hung.length + ' of ' + value.panels.length + ' panels on the wall.' : 'The panorama is complete.'}</output>
    {!readOnly && waiting.filter(panel => (!enabledIds || enabledIds.includes(panel.id)) && canHangPanel(value, panel.id)).map(panel =>
      <button key={panel.id} type="button" onFocus={() => preview(hangGalleryPanel(value, panel.id))} onBlur={() => preview(null)} onClick={() => commit(hangGalleryPanel(value, panel.id))}>Hang {panel.label}</button>)}
  </section>
}
