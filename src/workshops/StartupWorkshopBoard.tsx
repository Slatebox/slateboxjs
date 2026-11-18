import React, {useRef, useState, useEffect, type PointerEvent} from 'react'
import {resolveWorkshopSignals, type Workshop} from './model'
import {channels, interviews, planStartupMove, startupExperienceKind, workshopBudgetResult} from './model'
import styles from './startupBoard.css?inline'

type Props = {value:Workshop; readOnly?:boolean; onChange?:(value:Workshop)=>unknown}
export function StartupWorkshopBoard({value,readOnly=false,onChange}:Props) {
  const kind=startupExperienceKind(value)
  const drag=useRef<{card:string;board:Workshop;x:number;y:number;moved:boolean}|null>(null)
  const [preview,setPreview]=useState<{base:Workshop;next:Workshop}|null>(null)
  const [held,setHeld]=useState<string|null>(null)
  const [position,setPosition]=useState<{left:number;top:number}|null>(null)
  const [selected,select]=useState('fund-1')
  const view=preview?.base===value && !readOnly ? preview.next : value
  const active=value.cards.some(c=>c.id===selected) ? selected : value.cards[0]?.id
  function cancel() { drag.current=null; setHeld(null); setPosition(null); setPreview(null) }
  useEffect(()=>{
    if (!held) return
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape') cancel()}
    window.addEventListener('keydown',escape)
    return ()=>window.removeEventListener('keydown',escape)
  },[held])
  function commit(id:string,destination:string) {
    const next=!readOnly && planStartupMove(value,id,destination)
    if(next) onChange?.(next)
  }
  function tap(id:string) { if(kind==='customer-interviews') commit(id,'prototype'); else select(id) }
  function destination(event:PointerEvent<HTMLButtonElement>) {
    const el=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-drop]')
    return el && el.closest('.pilot-board')===event.currentTarget.closest('.pilot-board') ? el.dataset.drop : undefined
  }
  function handlers(id:string) {
    return {disabled:readOnly, onClick:(e:React.MouseEvent)=>{if(e.detail===0) tap(id)},
      onPointerDown:(e:PointerEvent<HTMLButtonElement>)=>{
        if(readOnly || !e.isPrimary || e.button!==0) return
        e.currentTarget.setPointerCapture(e.pointerId)
        drag.current={card:id,board:value,x:e.clientX,y:e.clientY,moved:false}; setHeld(id)
      },
      onPointerMove:(e:PointerEvent<HTMLButtonElement>)=>{
        const d=drag.current
        if(!d || d.card!==id) return
        if(d.board!==value || readOnly) return cancel()
        d.moved ||= Math.hypot(e.clientX-d.x,e.clientY-d.y)>5
        if(!d.moved) return
        setPosition({left:e.clientX+10,top:e.clientY+10})
        const target=destination(e)
        const next=target && planStartupMove(value,id,target)
        setPreview(next ? {base:value,next} : null)
      },
      onPointerUp:(e:PointerEvent<HTMLButtonElement>)=>{
        const d=drag.current
        if(!d || d.card!==id) return
        const target=destination(e)
        cancel()
        if(readOnly || d.board!==value) return
        if(!d.moved) tap(id)
        else if(target) commit(id,target)
      },
      onLostPointerCapture:cancel, onPointerCancel:cancel}
  }
  if(!kind) return null
  const picked=view.cards.find(c=>c.laneId==='prototype')
  const signal=resolveWorkshopSignals(view).find(s=>s.cardId===picked?.id && s.laneId==='prototype' && s.present)
  const left=workshopBudgetResult(view,'reserve')?.amount ?? 0
  const laneName=(id:string)=>value.lanes.find(l=>l.id===id)?.label ?? ''
  return <section className={'pilot-board '+(kind==='customer-interviews'?'interview-board':'budget-board')}
    onKeyDown={e=>{if(e.key==='Escape') cancel()}}>
    <style>{styles}</style>
    {kind==='customer-interviews'?<>
      <header><p className="pilot-kicker">Design partner interviews</p><h2>What’s stopping the first import?</h2>
        {!readOnly && <p>Pick a customer quote or drag it to the prototype. See what your designer would test.</p>}</header>
      <div className="interview-desk"><div className="quote-stack">{value.cards.map(card=>{
        const original=interviews.find(q=>q.id===card.id)!
        const unchanged=card.label===original.who+' · '+original.quote
        return <button type="button" className={'quote quote-'+card.id} key={card.id} data-card={card.id}
          aria-pressed={picked?.id===card.id} {...handlers(card.id)}>{unchanged && <small>{original.who}</small>}
          <strong>{unchanged ? original.quote : card.label}</strong></button>
      })}</div><div className={'prototype-slot'+(held?' drop-active':'')} data-drop="prototype" aria-label={laneName('prototype')}>
        <div key={picked?.id} className="design-cursor" aria-label="Simulated designer Imani"><span aria-hidden="true">➤</span> Imani</div>
        {picked ? <Prototype id={picked.id}/> : <p>Choose an interview for the prototype.</p>}
        {signal && <div className="test-brief" aria-live="polite"><strong>{signal.label}</strong><p>{signal.text}</p></div>}
      </div></div></>:<>
      <header><p className="pilot-kicker">First ten design partners</p><h2>Where would you spend ${value.cards.length*200}?</h2>
        {!readOnly && <p>Drag a $200 allocation to an experiment, or select an allocation and then a destination.</p>}</header>
      <div className="budget-ledger"><div className="budget-heading"><span>Pilot budget</span><b>${value.cards.length*200-left} <small>committed</small></b></div>
        <div className="budget-bar" aria-hidden="true">{view.cards.map(card=><span key={card.id} className={'band-'+card.laneId}/>)}</div>
        <div className="budget-chips">{value.cards.map(card=><button type="button" key={card.id} data-card={card.id}
          aria-label={card.label+', '+laneName(card.laneId)} aria-pressed={active===card.id} {...handlers(card.id)}>
          <small>{card.label}</small><strong>$200</strong><span>{laneName(card.laneId).split(' · ')[0]}</span></button>)}</div>
        <div className="budget-targets">{channels.map(c=>{const result=workshopBudgetResult(view,c.id)!; return <button type="button" key={c.id} className={'target-'+c.id} data-drop={c.id}
          disabled={readOnly || !active || !planStartupMove(value,active,c.id)} onClick={()=>commit(active,c.id)}>
          <strong>{laneName(c.id).replace(' · '+c.rate,'')}</strong><b>${result.amount}</b><span>{result.description}</span><small>{c.rate}</small></button>})}</div>
        <button type="button" className="reserve" data-drop="reserve" disabled={readOnly || !active} onClick={()=>commit(active,'reserve')}>
          {laneName('reserve')==='Unallocated'?'Return to unallocated funds':laneName('reserve')} <b>${left}</b></button>
      </div></>}
    {position && held && <span className="pilot-ghost" aria-hidden="true" style={position}>{value.cards.find(c=>c.id===held)?.label}</span>}
  </section>
}
function Prototype({id}:{id:string}) {
  const rows = id==='duplicate' ? [['Studio Oka','Already a client'],['Lowell Design','New client']] :
    id==='undo' ? [['Latest import','10 clients added'],['Previous list','38 clients']] :
    [['Studio Oka','Ready'],['Lowell Design','Ready']];
  return <div className="prototype-screen" aria-label="Example product screen"><div className="prototype-bar"><span>Client list</span><span>Prototype</span></div>
    <strong>{id==='duplicate'?'1 matching client':id==='undo'?'Import history':'Preview your first 10 rows'}</strong>
    {rows.map(([name,status])=><div className="prototype-row" key={name}><span>{name}</span><span>{status}</span></div>)}
    <p>{id==='duplicate'?'Keep original record':id==='undo'?'Restore previous list':'No emails will be sent'}</p></div>;
}
