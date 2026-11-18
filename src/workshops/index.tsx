export { OfflineHandoffBoard } from './OfflineHandoffBoard'
export { ListeningRoomBoard, type ListeningRoomBoardProps } from './ListeningRoomBoard'
import React from 'react'
import { fitLaneLayout } from './fitLanes'
import { DraggableRenderer, translate, type Draggable, type DraggableProps, type DragStatus } from 'dragology'
import { availableLanes, resolveWorkshopSignals, releaseLoad, laneColors, moveWorkshopCard, workshopLayout, workshopPositions, maxWorkshopCards, type Workshop } from './model'

import { ReleaseMoveControls, ReleasePlanReadout, type WorkshopMove } from './ReleasePlan'
export { ReleasePlanReadout, type WorkshopMove } from './ReleasePlan'
export * from './model'

function wrapLabel(label: string) {
  return label.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map(line => line.trim()) ?? [label]
}

function renderBoard({ state, d, draggedId, isTracking }: DraggableProps<Workshop>, readOnly: boolean, fitted?: ReturnType<typeof fitLaneLayout>, editHeaders = false, addCards = false) {
  const layout = fitted?.layout ?? workshopLayout
  const { width, row, height, top } = layout
  const { points } = workshopPositions(state, layout)
  const map = Boolean(state.lanes[0].station)
  const position = (card: Workshop['cards'][number]) => {
    const column = state.lanes.findIndex(lane => lane.id === card.laneId)
    const index = state.cards.filter(item => item.laneId === card.laneId).indexOf(card)
    return translate((map ? 18 : 8) + points[column].x, points[column].y + top + index * row)
  }
  // Upstream only asks for the anchor's geometry while comparing candidate futures.
  if (isTracking && draggedId) {
    const card = state.cards.find(item => 'choice-' + item.id === draggedId)
    if (card) return <g id={draggedId} transform={position(card)} />
  }
  return <g fontFamily="system-ui, sans-serif" fill="#18302d">
    {state.lanes.flatMap((lane, index) => (lane.station?.next ?? []).map(next => {
      const from = points[index]
      const to = points[state.lanes.findIndex(dest => dest.id === next)]
      const cx = width / 2 + 8, cy = (top - 12) / 2 + 4
      const dx = to.x - from.x, dy = to.y - from.y
      const inset = Math.min(dx ? width / 2 / Math.abs(dx) : Infinity, dy ? (cy - 4) / Math.abs(dy) : Infinity)
      const endX = to.x + cx - dx * inset, endY = to.y + cy - dy * inset
      return <g dragologyKey={lane.id + '-' + next}>
        <line x1={from.x + cx} y1={from.y + cy} x2={endX} y2={endY} stroke="#506b61" strokeWidth={3} />
        <path d="M0 0l-11 -5v10z" fill="#315044" transform={`translate(${endX} ${endY}) rotate(${Math.atan2(dy, dx) * 180 / Math.PI})`} />
      </g>
    }))}
    {state.lanes.map((lane, column) => {
      const count = state.cards.filter(card => card.laneId === lane.id).length
      const pointsUsed = state.kind === 'release-plan' && releaseLoad(state, lane.id)
      const caption = state.kind === 'release-plan'
        ? pointsUsed + (lane.capacity ? ' / ' + lane.capacity : '') + ' points'
        : lane.station ? (count ? '● Occupied' : 'Open stop') : lane.capacity ? `${count} of ${lane.capacity} slots` : `${count} ${count === 1 ? 'choice' : 'choices'}`
      return <g id={'heading-' + lane.id} transform={translate(8 + points[column].x, 4 + points[column].y)}>
        {map && <rect x={0} y={0} width={width} height={top + Math.max(1, count) * row - 10} rx={9} fill="#fcf9ed" stroke="#a8b5aa" strokeDasharray="4 4" />}
        <g {...(editHeaders && !readOnly ? {
          ...(map ? { 'data-workshop-station': lane.id } : { 'data-workshop-lane': lane.id }), role: 'button', tabIndex: 0, 'aria-label': 'Edit ' + lane.label, cursor: 'pointer',
        } : {})}>
          <rect width={width} height={top - 12} rx={map ? 6 : 9} fill={map ? "#253c36" : laneColors[column]} />
          {(fitted?.labels.get('heading-' + lane.id) ?? wrapLabel(lane.label)).map((line, i) =>
            <text dragologyKey={'line-' + i} fill={map ? "#fffdf3" : "#18302d"} transform={translate(12, (map ? 23 : 16) + i * 16)} fontSize={map ? 17 : 13} fontWeight="bold">{line}</text>)}
          <text fill={map ? "#ebd29a" : "#18302d"} transform={translate(12, top - 23)} fontSize={12}>{caption}</text>
        </g>
        {addCards && count < (lane.capacity ?? Infinity) && <g data-workshop-add-card={lane.id}
          transform={translate(0, top + count * row - 4)} role="button" tabIndex={0}
          aria-label={'Add card to ' + lane.label} cursor="pointer">
          <rect width={width} height={40} rx={7} fill="#fbfcf9" stroke="#64796c" strokeDasharray="4 3" />
          <text transform={translate(12, 25)} fontSize={14}>+ Add card</text>
        </g>}
      </g>
    })}
    {state.cards.map(card => {
      const allowed = readOnly ? [] : availableLanes(state, card)
      const key = 'choice-' + card.id
      return <g id={key} data-workshop-card={card.id} transform={position(card)}
        dragologyZIndex={draggedId === key ? '/1' : false}
        dragologyOnDrag={allowed.length > 1 ? () => d.closest(allowed.map(lane =>
          moveWorkshopCard(state, card.id, lane.id))).withFloating() : undefined}>
        <rect width={map ? width - 20 : width} height={height - (map ? 6 : 0)} fill={map ? "#ffda75" : "#fffdf6"} stroke="#78857d" rx={map ? 1 : 8} />
        {map && <path d="M198 0v70" stroke="#897530" strokeDasharray="4 5" />}
        {state.kind === 'release-plan' && <text transform={translate(12, height - 10)} fill="#466358" fontSize={12}>{card.points} pts</text>}
        {(fitted?.labels.get(key) ?? wrapLabel(card.label)).map((line, i) =>
          <text dragologyKey={'line-' + i} transform={translate(12, 17 + i * 16)} fontSize={14}>{line}</text>)}
      </g>
    })}
  </g>
}

const editableBoard: Draggable<Workshop> = props => renderBoard(props, false)
const readOnlyBoard: Draggable<Workshop> = props => renderBoard(props, true)

export interface WorkshopBoardProps {
  value: Workshop
  onChange: (value: Workshop, move?: WorkshopMove) => void
  /** A shared host owns its revision-checked undo. Private controlled boards use local history. */
  onUndo?: () => void
  canUndo?: boolean
  readOnly?: boolean
  /** Fit ordinary lane boards to the host while retaining legible notes and pointer targets. */
  fitLanes?: boolean
  /** Hide the built-in readout when the host supplies its own accessible outcome display. */
  showPlacementOutcomes?: boolean
  /** Temporary model shown to a linked view while the pointer is held. */
  onPreview?: (value: Workshop | null) => void
  /** Open the host's object editor when an author double-clicks a card. */
  onEditCard?: (cardId: string) => void
  /** Open the host's station editor from a map header by touch, click or keyboard. */
  onEditStation?: (stationId: string) => void
  /** Open the ordinary lane editor from its heading. */
  onEditLane?: (laneId: string, anchorElement: SVGGElement) => void
  /** Offer a place to author a new card in each ordinary lane with room. */
  onAddCard?: (laneId: string, anchorElement: SVGGElement) => void
}

export function WorkshopBoard({ value, onChange, onPreview, onEditCard, onEditStation, onEditLane, onAddCard, onUndo, canUndo, readOnly = false, fitLanes = false, showPlacementOutcomes = true }: WorkshopBoardProps) {
  const container = React.useRef<HTMLDivElement>(null)
  const press = React.useRef<{target: SVGGElement; x: number; y: number} | null>(null)
  const lastTap = React.useRef<{id: string; at: number} | null>(null)
  const [viewport, setViewport] = React.useState(0)
  const fit = fitLanes && !value.kind && !value.lanes[0].station
  React.useLayoutEffect(() => {
    const host = container.current
    if (!fit || !host) return
    const measure = () => setViewport(host.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    return () => observer.disconnect()
  }, [fit])
  const fitted = React.useMemo(() => fit && viewport ? fitLaneLayout(value, viewport) : undefined, [fit, viewport, value])
  const { width, height } = workshopPositions(value, fitted?.layout)
  const release = value.kind === 'release-plan'
  const hasSignals = Boolean(value.signals?.length)
  const [gesture, setGesture] = React.useState(0)
  const dragging = React.useRef(false)
  const feature = React.useRef<string | null>(null)
  const [preview, setPreview] = React.useState<Workshop | null>(null)
  const [keyboard, setKeyboard] = React.useState<{source: Workshop; next: Workshop; move: WorkshopMove} | null>(null)
  const [last, setLast] = React.useState<{before: Workshop; after: Workshop} | null>(null)
  const keyboardMove = !readOnly && keyboard?.source === value ? keyboard : null
  const prior = React.useRef(value)
  const showPreview = React.useCallback((candidate: Workshop | null) => {
    if (release || hasSignals) setPreview(candidate)
    onPreview?.(candidate)
  }, [release, hasSignals, onPreview])
  const cancel = React.useCallback(() => {
    dragging.current = false
    feature.current = null
    setKeyboard(null)
    showPreview(null)
    setGesture(id => id + 1)
  }, [showPreview])
  React.useLayoutEffect(() => {
    if (prior.current !== value && (dragging.current || keyboard)) cancel()
    prior.current = value
  }, [value, keyboard, cancel])

  const commit = (next: Workshop, move?: WorkshopMove) => {
    dragging.current = false
    setKeyboard(null)
    showPreview(null)
    if (next === value) return
    if (release && !onUndo) setLast({before: value, after: next})
    onChange(next, move)
  }
  const onDrop = (next: Workshop) => {
    const card = next.cards.find(card => card.id === feature.current)
    commit(next, card && {cardId: card.id, laneId: card.laneId})
  }
  const onDragStatus = React.useCallback((status: DragStatus<Workshop>) => {
    const active = status.type === 'dragging' ? status : status.pendingDrag?.status
    dragging.current = Boolean(active)
    if (active) {
      feature.current = active.behaviorCtx.draggedId?.replace(/^choice-/, '') ?? null
      setKeyboard(null)
    } else if (feature.current !== null) { feature.current = null; showPreview(null) }
  }, [showPreview])

  React.useEffect(() => {
    function cancelGesture(event: Event) {
      if ((!dragging.current && !keyboard) || (event instanceof KeyboardEvent && event.key !== 'Escape')) return
      cancel()
    }
    document.addEventListener('keydown', cancelGesture)
    document.addEventListener('pointercancel', cancelGesture)
    window.addEventListener('blur', cancelGesture)
    return () => {
      document.removeEventListener('keydown', cancelGesture)
      document.removeEventListener('pointercancel', cancelGesture)
      window.removeEventListener('blur', cancelGesture)
    }
  }, [cancel, keyboard])
  const linked = readOnly ? null : keyboardMove?.next ?? preview
  const viewOnly = Boolean(readOnly || keyboardMove)
  const map = Boolean(value.lanes[0].station)
  const editHeaders = !viewOnly && (map ? Boolean(onEditStation) : !release && Boolean(onEditLane))
  const addCards = !viewOnly && !map && !release && Boolean(onAddCard) && value.cards.length < maxWorkshopCards
  const draggable = React.useMemo<Draggable<Workshop>>(() => fitted || editHeaders || addCards
    ? props => renderBoard(props, viewOnly, fitted, editHeaders, addCards)
    : viewOnly ? readOnlyBoard : editableBoard, [fitted, viewOnly, editHeaders, addCards])
  const controls = '[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]'
  function activate(target: SVGGElement) {
    if (viewOnly) return
    if (target.dataset.workshopStation) onEditStation?.(target.dataset.workshopStation)
    else if (target.dataset.workshopLane) onEditLane?.(target.dataset.workshopLane, target)
    else if (target.dataset.workshopAddCard) onAddCard?.(target.dataset.workshopAddCard, target)
  }
  const canvasHeight = linked ? Math.max(height, workshopPositions(linked, fitted?.layout).height) : height
  return <section aria-label={value.title}>
    <div ref={container} style={{ maxWidth: '100%', overflowX: 'auto' }}
      onKeyDownCapture={event => {
        const target = (event.target as Element).closest<SVGGElement>(controls)
        if (!target || !['Enter', ' '].includes(event.key)) return
        event.preventDefault()
        if (!event.repeat) activate(target)
      }}
      onClickCapture={event => {
        // Assistive technology can activate an SVG button without pointer events.
        const target = (event.target as Element).closest<SVGGElement>(controls)
        if (target && event.detail === 0) activate(target)
      }}
      onPointerDownCapture={event => {
        press.current = null
        if (viewOnly || !event.isPrimary || event.button !== 0) return
        const target = (event.target as Element).closest<SVGGElement>(controls + ',[data-workshop-card]')
        if (target) press.current = {target, x:event.clientX, y:event.clientY}
      }}
      onPointerMoveCapture={event => {
        if (press.current && Math.hypot(event.clientX - press.current.x, event.clientY - press.current.y) > 5) {
          press.current = null
          lastTap.current = null
        }
      }}
      onPointerCancelCapture={() => { press.current = null; lastTap.current = null }}
      onPointerUpCapture={event => {
        // Dragology suppresses synthesized click events. Two stationary taps
        // on the same card open it while a drag remains exclusively a move.
        const current = press.current
        press.current = null
        if (!current || viewOnly) return
        const card = current.target.dataset.workshopCard
        if (!card) {
          lastTap.current = null
          activate(current.target)
          return
        }
        if (!onEditCard) return
        if (lastTap.current?.id === card && event.timeStamp - lastTap.current.at < 400) {
          lastTap.current = null
          onEditCard(card)
        } else lastTap.current = {id:card, at:event.timeStamp}
      }}>
      <DraggableRenderer key={readOnly ? 'read-only' : gesture}
        draggable={draggable} state={keyboardMove?.next ?? value}
        onDropState={readOnly ? undefined : onDrop} onDragState={readOnly ? undefined : showPreview} onDragStatus={onDragStatus}
        width={width} height={canvasHeight} />
    </div>
    {hasSignals && showPlacementOutcomes && <section aria-label="Placement outcomes" aria-live="polite" style={{overflowWrap:'anywhere'}}>
      {resolveWorkshopSignals(linked ?? value).map(signal => <p key={signal.id}><strong>{signal.label}</strong><br />{signal.text}</p>)}
    </section>}
    {release && <>
      <ReleasePlanReadout value={value} preview={linked} />
      {!readOnly && <><ReleaseMoveControls value={value} preview={keyboardMove?.move ?? null}
        stage={(next, move) => { setKeyboard({source:value, next, move}); onPreview?.(next) }}
        cancel={cancel} apply={() => { if (keyboardMove) { commit(keyboardMove.next, keyboardMove.move); showPreview(null) } }} />
        <button type="button" disabled={!(onUndo ? canUndo : last?.after === value)} onClick={() => {
          cancel()
          if (onUndo) onUndo()
          else if (last?.after === value) { setLast(null); onChange(last.before) }
        }}>Undo move</button></>}
    </>}
    {value.lanes[0].station && <div className="workshop-outcomes" aria-live="polite">
      {value.cards.map(card => {
        const current = value.lanes.find(lane => lane.id === card.laneId)!
        return <div key={card.id}><p><strong>{card.label} · {current.label}</strong><br />{current.station!.outcome}</p>
          {current.station!.image && <img src={current.station!.image.src} alt={current.station!.image.alt}
            referrerPolicy="no-referrer" style={{ display:'block', maxWidth:'100%', width:360, maxHeight:240, objectFit:'contain', objectPosition:'left', marginBlock:'8px' }} />}
          {availableLanes(value, card).filter(lane => lane.id !== card.laneId).map(lane =>
            <button key={lane.id} type="button" disabled={readOnly} onClick={() => commit(moveWorkshopCard(value, card.id, lane.id), {cardId: card.id, laneId: lane.id})}>
              {card.label} → {lane.label}
            </button>)}
        </div>
      })}
    </div>}
    {!release && value.cards.length > 0 && <details>
      <summary>Move a card by name</summary>
      {value.cards.map(card => <label key={card.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBlock: 6 }}>
        {card.label}
        <select disabled={readOnly} aria-label={'Move ' + card.label} value={keyboardMove?.move.cardId === card.id ? keyboardMove.move.laneId : card.laneId}
          onChange={e => {
            const move = {cardId:card.id, laneId:e.currentTarget.value}
            const next = moveWorkshopCard(value, card.id, move.laneId)
            if (!hasSignals) commit(next, move)
            else if (next === value) cancel()
            else { setKeyboard({source:value, next, move}); onPreview?.(next) }
          }}>
          {availableLanes(value, card).map(lane => <option key={lane.id} value={lane.id}>{lane.label}</option>)}
        </select>
      </label>)}
      {keyboardMove && <div>
        <button type="button" onClick={() => commit(keyboardMove.next, keyboardMove.move)}>Apply move</button>
        <button type="button" onClick={cancel}>Cancel move</button>
      </div>}
    </details>}
  </section>
}

export { MoonGalleryBoard, type MoonGalleryBoardProps } from './MoonGalleryBoard'
export { FocusDarkroomBoard } from './darkroom/FocusDarkroomBoard'
