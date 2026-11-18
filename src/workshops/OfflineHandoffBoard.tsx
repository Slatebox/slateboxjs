import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {DraggableRenderer, translate, type DraggableProps} from 'dragology'
import {handoffSummary, offlineHandoff, reviewHandoff, resolveHandoff, type OfflineHandoffModel} from './offlineHandoff'

function dock(x: number, y: number, scale: number) {
  return <g transform={`translate(${x} ${y}) scale(${scale} ${scale*.88})`}>
    <rect width="142" height="73" rx="3" fill="#b8d0c5"/>
    <path d="M0 27L46 7h96v12H50L0 38Z" fill="#728d81"/>
    <path d="M12 38l36-17v43l-36 6z" fill="#395c50"/>
    <path d="M49 20h89v43H49z" fill="#f1e3b8"/>
    <path d="M57 33h45v30H57z" fill="#557468"/>
    {[37,42,47,52,57].map(v => <path dragologyKey={'slat'+v} d={`M59 ${v}h41`} stroke="#a5b6a3"/>)}
    <path d="M0 69l49-7h93v11H0z" fill="#84998a"/>
    <path d="M12 73l40-7h65" fill="none" stroke="#e9b04e" strokeWidth="2"/>
    <rect x="111" y="34" width="19" height="27" fill="#d1a45c"/>
    <rect x="116" y="39" width="9" height="12" rx="2" fill="#38574b"/>
    <circle cx="120" cy="42" r="2" fill="#f0a466"/>
    <text x="59" y="30" fontSize="8" fontWeight="bold" fill="#354e40">GATE B</text>
  </g>;
}

function scene(compact: boolean, readOnly: boolean) {
  const phoneX = compact ? 9 : 49, phoneY = compact ? 20 : 23, phoneW = compact ? 144 : 181;
  const sheetX = compact ? 183 : 370, sheetY = compact ? 35 : 40, sheetW = compact ? 164 : 255;
  const tokenW = compact ? 119 : 147, tokenH = 45;
  const t = (x: number,y: number,label: string,size: number,fill='#243c32',weight='normal',family='Arial, sans-serif') =>
    <text transform={translate(x,y)} fill={fill} fontSize={size} fontFamily={family} fontWeight={weight}>{label}</text>;
  return ({state, d, draggedId}: DraggableProps<OfflineHandoffModel>) => {
    const queued = state.stage === 'queued', done = state.stage === 'resolved';
    const targetX = sheetX + (sheetW - tokenW)/2, targetY = sheetY + 138;
    const tokenX = queued ? phoneX + (phoneW-tokenW)/2 : targetX;
    const tokenY = queued ? phoneY + 141 : targetY;
    const ink = '#233e33';
    return <g fontFamily="Arial, sans-serif">
      <g id="sync-cable"><path d={`M${phoneX+phoneW-2} ${phoneY+180} C${phoneX+phoneW+45} ${phoneY+235},${sheetX-24} ${sheetY+204},${sheetX+22} ${sheetY+159}`} fill="none" stroke={queued ? '#9aab9b':'#2a7464'} strokeWidth="2.5" strokeDasharray={queued ? '5 7':'8 2'}/></g>
      <g id="field-phone" transform={translate(phoneX,phoneY)}>
        <rect x="3" y="5" width={phoneW} height="202" rx="18" fill="#a6b3a5"/>
        <rect width={phoneW} height="202" rx="18" fill="#243d34"/>
        <rect x="5" y="5" width={phoneW-10} height="192" rx="14" fill="#f4f1db"/>
        <rect x={phoneW/2-17} y="7" width="34" height="5" rx="3" fill="#283b30"/>
        {t(13,27,'17:08',9,ink,'bold')}
        {t(phoneW-50,27,queued ? 'Offline':'Online',10,queued ? '#835420':'#266451','bold')}
        {t(13,47,'Field log',compact ? 18:20,ink,'bold')}
        {dock(13,55,(phoneW-26)/142)}
        {t(13,compact ? 132:134,'Noor · Gate B',compact ? 10:12,ink)}
        <rect x={phoneW/2-19} y="190" width="38" height="2.6" rx="2" fill="#697a69"/>
      </g>
      <g id="shared-notebook" transform={translate(sheetX,sheetY)}>
        <path d={`M4 3l${sheetW-5} -3 5 190 -${sheetW-3} 5z`} fill="#c6c4ab" />
        <path d={`M-3 5l${sheetW-1} -3 3 183 -${sheetW-1} 6z`} fill="#dccfb0" stroke="#b2aa8c"/>
        <rect width={sheetW} height="184" fill="#fffbea" stroke="#b9ba9f"/>
        <path d={`M15 0v184`} stroke="#e1b9a6"/>
        {[30,65,100,135,169].map(v=><circle dragologyKey={'hole'+v} cx="8" cy={v} r="2.7" fill="#bfbba7"/>)}
        <path d="M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3" fill="none" stroke="#718273" strokeWidth="2"/>
        {t(23,38,queued ? 'SHIFT HANDOFF' : done ? 'CREW COPY' : 'REVIEW QUEUE',compact ? 10:12,'#586e5f','bold','monospace')}
        {t(22,69,'Gate B',compact ? 30:37,ink,'bold','Georgia, serif')}
        <path d={`M23 79h${sheetW-42}`} stroke="#bfc5b1"/>
        {t(23,101,(done && state.choice === 'field' ? state.fieldNote : state.deskNote).slice(0, compact ? 18 : 25),compact ? 12:16,ink,'bold')}
        {t(23,120,done && state.choice === 'field' ? 'Noor + Jules' : 'Jules · Release desk',compact ? 10:12,'#5a6c5d')}
        <g id="desk-drop" transform={translate((sheetW-tokenW)/2,138)}>
          <rect width={tokenW} height={tokenH} rx="3" stroke="#849785" strokeDasharray="4 3" fill="#f0f2df"/>
          {t(11,26,'Attach field edit',compact ? 12:15,'#607465')}
        </g>
      </g>
      <g id="field-edit" transform={translate(tokenX,tokenY)}
        dragologyZIndex={draggedId === 'field-edit' ? '/2':false}
        dragologyOnDrag={!readOnly && queued ? () => d.closest([state,reviewHandoff(state)]).withFloating() : undefined}>
        <path d={`M2 3h${tokenW-2}v${tokenH-2}l-6 5H2z`} fill="#a29165"/>
        <path d={`M0 0h${tokenW}v${tokenH-7}l-7 7H0z`} fill={done ? '#c8ddbe':'#ffcf72'} stroke="#ae8a42"/>
        <path d={`M${tokenW-7} ${tokenH}v-7h7`} fill="#ca9f55"/>
        {[13,18,23].map(v=><circle dragologyKey={'handle'+v} cx="8" cy={v} r="1.3" fill="#84662e"/>)}
        {t(17,17,'BADGE TEST',compact ? 9:11,'#72522e','bold','monospace')}
        {t(17,34,done ? 'Reviewed' : state.fieldNote === offlineHandoff.fieldNote ? 'Badge rejected' : 'Field result',compact ? 13:16,'#42351f','bold')}
      </g>
    </g>;
  };
}


const styles = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
.sb-handoff .field-art svg{display:block;zoom:var(--drawing-scale,1);margin:auto}
.sb-handoff[data-stage=queued]:not([data-readonly=true]) #field-edit{cursor:grab}
.sb-handoff[data-stage=queued]:not([data-readonly=true]) #field-edit:active{cursor:grabbing}
.sb-handoff .field-versions{display:grid;grid-template-columns:1fr 1fr;border-block-end:1px solid #c3c7b5}
.sb-handoff .field-versions>div{padding:14px 12px 14px 0;min-width:0}
.sb-handoff .field-versions>div+div{border-left:1px solid #c3c7b5;padding-inline:15px 0}
.sb-handoff .field-versions h2,.sb-handoff .field-outcome h2{margin:0 0 .25rem;font:700 15px/1.25 system-ui,Arial,sans-serif;letter-spacing:-.02em}
.sb-handoff .field-versions p,.sb-handoff .field-outcome p{margin:.15rem 0 .4rem;font-size:clamp(15px,2.3vw,19px);line-height:1.3}
.sb-handoff .field-versions small,.sb-handoff .field-outcome small{font-size:12px;color:#566657}
.sb-handoff .field-versions.comparing>div:first-child{box-shadow:inset 0 4px #d29236}
.sb-handoff .field-versions.comparing>div+div{box-shadow:inset 0 4px #718b70}
.sb-handoff .field-outcome{padding:15px 0;border-bottom:1px solid #b9c6af}
.sb-handoff .field-outcome h2{font:600 clamp(21px,3vw,28px)/1.2 Georgia,serif}
.sb-handoff .field-actions{padding-top:14px;display:flex;align-items:center;flex-wrap:wrap;gap:7px}
.sb-handoff .field-actions [role=status]{margin-right:auto;font-size:14px;color:#435846}
.sb-handoff .field-actions button{font:600 13px/1.2 system-ui,sans-serif;background:#254c3a;color:#fffef3;border:1px solid #254c3a;padding:8px 12px;border-radius:3px}
.sb-handoff .field-actions button.field-quiet{color:#355441;background:transparent;border-color:#a9bba6}
@media(max-width:460px){.sb-handoff .field-art{margin-inline:-2px}.sb-handoff .field-versions>div{padding:12px 8px 12px 0}.sb-handoff .field-versions>div+div{padding-inline:9px 0}.sb-handoff .field-versions p{font-size:14px}.sb-handoff .field-actions [role=status]{width:100%}}.sb-handoff{background:#faf8ee;color:#213e32;font:15px/1.35 system-ui,Arial,sans-serif}.sb-handoff #field-edit{touch-action:none}.sb-handoff [data-stage=queued]{cursor:grab}.sb-handoff button:focus-visible{outline:3px solid #ab601d;outline-offset:2px}`

export function OfflineHandoffBoard({ value, onChange, readOnly = false }: {
  value: OfflineHandoffModel
  onChange?: (next: OfflineHandoffModel) => void
  readOnly?: boolean
}) {
  const [preview, setPreview] = useState<OfflineHandoffModel | null>(null)
  const [keyboardPreview, setKeyboardPreview] = useState<OfflineHandoffModel | null>(null)
  const [gesture, setGesture] = useState(0)
  const [compact, setCompact] = useState(false)
  const [scale, setScale] = useState(1)
  const art = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const previous = useRef(value)
  const drawing = useMemo(() => scene(compact, readOnly), [compact, readOnly])
  const shown = readOnly ? value : keyboardPreview ?? preview ?? value
  const held = value.stage === 'queued' && shown.stage === 'review'

  function cancel() {
    dragging.current = false
    setKeyboardPreview(null)
    setPreview(null)
    setGesture(k => k + 1)
  }
  function commit(next: OfflineHandoffModel) {
    cancel()
    if (!readOnly && next.stage !== value.stage) onChange?.(next)
  }
  useLayoutEffect(() => {
    if ((dragging.current || keyboardPreview) && (readOnly || previous.current !== value)) cancel()
    previous.current = value
  }, [value, readOnly, keyboardPreview])
  useLayoutEffect(() => {
    const resize = () => {
      const width = art.current!.clientWidth
      setCompact(width < 510)
      setScale(Math.min(1, width / (width < 510 ? 360 : 685)))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(art.current!)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    function interrupt(event: Event) {
      if ((dragging.current || keyboardPreview) && (!(event instanceof KeyboardEvent) || event.key === 'Escape')) cancel()
    }
    document.addEventListener('keydown', interrupt)
    document.addEventListener('pointercancel', interrupt)
    window.addEventListener('blur', interrupt)
    return () => {
      document.removeEventListener('keydown', interrupt)
      document.removeEventListener('pointercancel', interrupt)
      window.removeEventListener('blur', interrupt)
    }
  }, [keyboardPreview])

  return <section className="sb-handoff" data-stage={value.stage} data-readonly={readOnly} aria-label="Field handoff simulation">
    <style>{styles}</style>
    <div className="field-art" ref={art} style={{'--drawing-scale':scale} as React.CSSProperties}>
      <DraggableRenderer key={readOnly ? 'read-only' : gesture} state={keyboardPreview ?? value} draggable={drawing}
        width={compact ? 360 : 685} height={compact ? 254 : 262}
        onDragState={readOnly ? undefined : next => {
          dragging.current = true
          setPreview(next.stage !== value.stage && value.stage === 'queued' ? next : null)
        }} onDropState={readOnly ? undefined : commit}/>
    </div>
    {value.stage !== 'resolved'
      ? <section className={'field-versions ' + (shown.stage === 'review' ? 'comparing' : '')} aria-label="Note versions">
          <div><h2>Noor’s field test</h2><p>{value.fieldNote}</p><small>17:08 · {shown.stage === 'queued' ? 'Saved on phone' : 'Incoming edit'}</small></div>
          <div><h2>Jules’s shared note</h2><p>{value.deskNote}</p><small>17:05 · {value.fallback}</small></div>
        </section>
      : <section className="field-outcome" aria-label="Published handoff">
          <h2>{value.choice === 'field' ? 'Field test accepted' : 'Shared note retained'}</h2>
          <p>{handoffSummary(value)}</p>
          <small>{value.choice === 'field' ? 'Field result and fallback shared with the crew.' : 'Noor’s field test stays in the review history.'}</small>
        </section>}
    <div className="field-actions">
      {value.stage !== 'resolved' && <span role="status">{held ? 'The two access reports disagree.' : handoffSummary(value)}</span>}
      {!readOnly && (value.stage === 'queued' ? (held ? <>
          <button type="button" onClick={() => commit(reviewHandoff(value))}>Send for review</button>
          <button type="button" className="field-quiet" onClick={cancel}>Cancel preview</button>
        </> : <button type="button" onClick={() => setKeyboardPreview(reviewHandoff(value))}>Preview sync</button>)
        : value.stage === 'review' ? <>
            <button type="button" onClick={() => commit(resolveHandoff(value,'field'))}>Merge field test</button>
            <button type="button" className="field-quiet" onClick={() => commit(resolveHandoff(value,'desk'))}>Keep shared note</button>
          </> : <button type="button" onClick={() => commit(reviewHandoff(value))}>Reopen review</button>)}
      {!readOnly && value.stage !== 'queued' && <button type="button" className="field-quiet"
        onClick={() => commit({...value, stage:'queued', choice:null})}>Start over</button>}
    </div>
  </section>
}
