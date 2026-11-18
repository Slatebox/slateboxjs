import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { DraggableRenderer, inOrder, param, translate, type DraggableProps } from 'dragology'
import { listeningRoom, listeningRoomCaption, type ListeningRoomModel } from './listeningRoom'
import { playSculptures } from './listeningAudio'

function listeningScene({state,d,isTracking}: DraggableProps<ListeningRoomModel>, readOnly: boolean) {
  const amount=state.mix, hornX=106+420*amount;
  const position=translate(hornX,220);
  if (isTracking) return <g id="listening-horn" transform={position}/>;
  return <g>
    <rect width="640" height="276" fill="#302342"/>
    <path d="M0 200L95 174 285 184 440 161 640 194v82H0z" fill="#3f2d4f"/>
    <path d="M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2" stroke="#564063" fill="none"/>
    {Array.from({length:21},(_,i)=><circle dragologyKey={'star'+i} cx={18+(i*137)%604} cy={12+(i*47)%103} r={i%4===0?1.7:.85} fill="#c7b5cb"/>)}
    <g id="copper-rain" opacity={1-amount*.45}>
      {Array.from({length:30},(_,i)=>{const x=29+(i*31)%184,y=24+(i*19)%58;return <path dragologyKey={'drop'+i} d={`M${x} ${y}l-3 8`} stroke={i%3===0?'#e8d8d5':'#b4c8d1'} strokeWidth={i%3===0?2:1}/>;})}
      <path d="M21 111l91-44 132 42-91 49z" fill="#eb9d64"/>
      <path d="M21 111l132 47v8L21 120z" fill="#96513e"/><path d="M153 158l91-49v8l-91 49z" fill="#b76e4d"/>
      {[0,1,2,3,4,5,6].map(i=><path dragologyKey={'ridge'+i} d={`M${39+i*15} ${116+i*5.3}l89-44`} stroke="#b96d50" strokeWidth="2"/>)}
      <path d="M43 128v52l7 3v-52m155-2v43l7-3v-43" fill="#9f7466"/>
      <ellipse cx="121" cy="183" rx="75" ry="7" fill="#221e34"/>
      {[0,1,2].map(i=><path dragologyKey={'ring'+i} d={`M${65+i*35} ${177-i*2}q13-4 22 0q-10 4-22 0`} fill="none" stroke="#d3a287" strokeWidth="1.5"/>)}
    </g>
    <g id="glass-chimes" opacity={.59+amount*.41}>
      <path d="M386 46l160-14 57 17-158 18z" fill="#be9272"/><path d="M386 46v5l59 20 158-17v-5L445 67z" fill="#865c60"/>
      {[0,1,2,3,4,5].map(i=>{const x=407+i*32,y=63-(i%3)*4,length=52+((i+1)*17)%46;return <g dragologyKey={'tube'+i} transform={translate(x,y)}>
        <path d="M0 -9v23" stroke="#d3d1bc"/><path d={`M-7 14l8-4 8 3v${length}l-8 5-8-6z`} fill={i%2?'#83c3b3':'#d6bab9'}/>
        <path d={`M1 11v${length+7}l7-5V13z`} fill={i%2?'#488b8b':'#a38ea6'}/>
        <path d={`M-5 18v${length-9}`} stroke="#f5f0da" strokeWidth="2"/>
      </g>;})}
      <path d="M550 143q14-6 9-23m9 31q18-12 10-32" fill="none" stroke="#b9d7ca" strokeWidth="2" opacity={amount}/>
    </g>
    <path d="M63 233Q303 204 575 229" fill="none" stroke="#1d182b" strokeWidth="8"/>
    <path d="M63 232Q303 203 575 228" fill="none" stroke="#ad8c80" strokeWidth="2"/>
    <g id="listening-horn" transform={position} dragologyOnDrag={readOnly ? undefined : ()=>d.vary(state,param('mix'),{constraint:s=>inOrder([0,s.mix,1])})}>
      <rect x="-42" y="-67" width="84" height="90" fill="transparent"/>
      <ellipse cx="0" cy="12" rx="39" ry="6" fill="#261c32"/>
      <path d="M-24 2h48l6 8h-60z" fill="#bd8c59"/><circle cx="-17" cy="11" r="6" fill="#e3c992"/><circle cx="17" cy="11" r="6" fill="#e3c992"/>
      <path d="M-4 2v-13q0-10 10-13l4-2" stroke="#ba8755" strokeWidth="9" fill="none"/>
      <g transform={`rotate(${-38+amount*76} 3 -26)`}><path d="M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z" fill="#efbc63" stroke="#a97740" strokeWidth="1.5"/><ellipse cx="-12" cy="-60" rx="25" ry="8" transform="rotate(-22 -12 -60)" fill="#72483c" stroke="#f2cd7a" strokeWidth="4"/><path d="M-1-51q-3 13 3 25" fill="none" stroke="#fff1ac" strokeWidth="2.2"/></g>
    </g>
  </g>;
}

const editableScene = (props: DraggableProps<ListeningRoomModel>) => listeningScene(props, false)
const staticScene = (props: DraggableProps<ListeningRoomModel>) => listeningScene(props, true)

const style = `
.sb-listening{color:#3f2848;background:#f6edf0;font:15px/1.4 system-ui,sans-serif}
.sb-listening .sb-listening-stage{border:1px solid #635166;background:#302342;overflow:hidden;min-width:0}
.sb-listening .sb-listening-stage svg{display:block;margin:auto;zoom:var(--horn-scale,1)}
.sb-listening [id="listening-horn"]{touch-action:none;cursor:grab}
.sb-listening [aria-readonly="true"] [id="listening-horn"]{touch-action:auto;cursor:default}
.sb-listening .sb-listening-choices{display:flex;flex-wrap:wrap;gap:.4rem;margin:.7rem 0}
.sb-listening button{color:#49324e;background:transparent;font:600 14px/1.25 system-ui,sans-serif;padding:.48rem .76rem;border:1px solid #89768c;border-radius:3px;cursor:pointer}
.sb-listening .sb-listening-caption{border-top:1px solid #cbbdcb;padding:.8rem 0;display:flex;justify-content:space-between;align-items:center;gap:.75rem}
.sb-listening .sb-listening-caption strong{display:block;font:600 12px/1.3 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.05em}
.sb-listening output{font:500 clamp(18px,2.6vw,25px)/1.1 Georgia,serif}
.sb-listening .sb-listening-caption button{flex:none;background:#4f3658;color:#fff4fa;border-color:#4f3658}
.sb-listening :focus-visible{outline:3px solid #ab601d;outline-offset:2px}
`

export interface ListeningRoomBoardProps {
  value: ListeningRoomModel
  onChange?: (next: ListeningRoomModel) => void
  readOnly?: boolean
}

export function ListeningRoomBoard({ value, onChange, readOnly = false }: ListeningRoomBoardProps) {
  const stage = useRef<HTMLDivElement>(null)
  const sound = useRef<ReturnType<typeof playSculptures> | null>(null)
  const [preview, setPreview] = useState<ListeningRoomModel | null>(null)
  const [gesture, setGesture] = useState(0)
  const [scale, setScale] = useState(1)
  const [active, setActive] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const current = preview ?? value
  const prior = useRef(value)
  const dragging = useRef(false)

  function cancel() {
    dragging.current = false
    setPreview(null)
    setGesture(n => n + 1)
  }
  useLayoutEffect(() => {
    if (dragging.current && (readOnly || value !== prior.current)) cancel()
    prior.current = value
  }, [value, readOnly])
  useLayoutEffect(() => {
    const holder = stage.current!
    const size = () => setScale(Math.min(1, holder.clientWidth / 640))
    size()
    const observer = new ResizeObserver(size)
    observer.observe(holder)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    function interrupt(event: Event) {
      if (dragging.current && (!(event instanceof KeyboardEvent) || event.key === 'Escape')) cancel()
    }
    document.addEventListener('keydown', interrupt)
    document.addEventListener('pointercancel', interrupt)
    window.addEventListener('blur', interrupt)
    return () => {
      document.removeEventListener('keydown', interrupt)
      document.removeEventListener('pointercancel', interrupt)
      window.removeEventListener('blur', interrupt)
    }
  }, [])
  function commit(mix: number) {
    dragging.current = false
    setPreview(null)
    if (!readOnly && mix !== value.mix) onChange?.({ ...value, mix })
  }
  function stop() {
    sound.current?.stop()
    sound.current = null
    setActive(false)
  }
  useEffect(() => { sound.current?.mix(current.mix) }, [current.mix])
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop() })
    observer.observe(stage.current!)
    const hide = () => { if (document.hidden) stop() }
    document.addEventListener('visibilitychange', hide)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', hide)
      sound.current?.stop()
      sound.current = null
    }
  }, [])
  async function toggleSound() {
    if (sound.current) { stop(); return }
    try {
      const player = playSculptures()
      sound.current = player
      player.mix(current.mix)
      await player.ctx.resume()
      if (sound.current === player) setActive(true)
    } catch { stop(); setUnavailable(true) }
  }
  const rain = value.leftLabel === listeningRoom.leftLabel ? 'rain' : value.leftLabel
  const glass = value.rightLabel === listeningRoom.rightLabel ? 'glass' : value.rightLabel
  return <section className="sb-listening" aria-label="Listening room mix">
    <style>{style}</style>
    <div ref={stage} className="sb-listening-stage exhibit-stage"
      style={{ '--horn-scale': scale } as React.CSSProperties}
      role="slider" aria-label="Listening horn" aria-readonly={readOnly} tabIndex={readOnly ? -1 : 0}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(current.mix * 100)}
      aria-valuetext={listeningRoomCaption(current)}
      onKeyDown={event => {
        if (readOnly) return
        const targets: Record<string, number> = {
          ArrowLeft: current.mix - 0.01, ArrowRight: current.mix + 0.01,
          ArrowDown: current.mix - 0.01, ArrowUp: current.mix + 0.01,
          Home: 0, End: 1,
        }
        if (Object.prototype.hasOwnProperty.call(targets, event.key)) {
          event.preventDefault()
          commit(Math.round(100 * Math.min(1, Math.max(0, targets[event.key]))) / 100)
        }
      }}>
      <DraggableRenderer key={readOnly ? 'read-only' : gesture} state={value}
        draggable={readOnly ? staticScene : editableScene} width={640} height={276}
        onDragState={readOnly ? undefined : next => { dragging.current = next !== null; setPreview(next) }}
        onDropState={readOnly ? undefined : next => commit(next.mix)} />
    </div>
    {!readOnly && <div className="sb-listening-choices">
      <button type="button" onClick={() => commit(0)}>Listen to {rain}</button>
      <button type="button" onClick={() => commit(0.5)}>Blend both</button>
      <button type="button" onClick={() => commit(1)}>Listen to {glass}</button>
    </div>}
    <div className="sb-listening-caption"><div><strong>Sound caption</strong>
      <output aria-label="Sound caption">{listeningRoomCaption(current)}</output></div>
      <button type="button" onClick={toggleSound} aria-pressed={active} disabled={unavailable}>
        {unavailable ? 'Audio unavailable' : active ? 'Mute sound' : 'Enable sound'}
      </button>
    </div>
  </section>
}
