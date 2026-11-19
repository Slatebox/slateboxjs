export { OfflineHandoffBoard } from './OfflineHandoffBoard'
export { ListeningRoomBoard, type ListeningRoomBoardProps } from './ListeningRoomBoard'
import React from 'react'
import { NativeMapSurface } from './NativeMapSurface'
import { compactStationGap, fitLaneLayout } from './fitLanes'
import { DraggableRenderer, type Draggable, type DragStatus } from 'dragology'
import { availableLanes, resolveWorkshopSignals, workshopCandidate, workshopPositions, maxWorkshopCards, type Workshop } from './model'
import { renderBoard } from './boardDrawing'
export { dragologyCandidates } from './dragologyCandidates'

import { ReleaseMoveControls, ReleasePlanReadout, type WorkshopMove } from './ReleasePlan'
export { ReleasePlanReadout, type WorkshopMove } from './ReleasePlan'
export * from './model'

const editableBoard: Draggable<Workshop> = props => renderBoard(props, false)
const readOnlyBoard: Draggable<Workshop> = props => renderBoard(props, true)

export interface WorkshopBoardProps {
  value: Workshop
  onChange: (value: Workshop, move?: WorkshopMove) => void
  /** A shared host owns its revision-checked undo. Private controlled boards use local history. */
  onUndo?: () => void
  canUndo?: boolean
  readOnly?: boolean
  /** Compact station map for conversation-led editors. Each playable exit remains a keyboard button. */
  mapCanvas?: boolean
  /** Fit ordinary lane boards to the host while retaining legible notes and pointer targets. */
  fitLanes?: boolean
  /** Hide the built-in readout when the host supplies its own accessible outcome display. */
  showPlacementOutcomes?: boolean
  /** Hide the optional move-by-name selector when the host supplies equivalent keyboard movement. */
  showMoveControls?: boolean
  /** Temporary model shown to a linked view while the pointer is held. */
  onPreview?: (value: Workshop | null) => void
  /** Select a card with a stationary pointer or Enter/Space. Takes precedence over double-tap editing. */
  onSelectCard?: (cardId: string) => void
  /** Open the host's object editor when an author double-clicks a card. */
  onEditCard?: (cardId: string) => void
  /** Open the host's station editor from a map header by touch, click or keyboard. */
  onEditStation?: (stationId: string) => void
  /** Open the ordinary lane editor from its heading. */
  onEditLane?: (laneId: string, anchorElement: SVGGElement) => void
  /** Offer a place to author a new card in each ordinary lane with room. */
  onAddCard?: (laneId: string, anchorElement: SVGGElement) => void
}

export function WorkshopBoard({ value, onChange, onPreview, onSelectCard, onEditCard, onEditStation, onEditLane, onAddCard, onUndo, canUndo, readOnly = false, fitLanes = false, mapCanvas = false, showPlacementOutcomes = true, showMoveControls = true }: WorkshopBoardProps) {
  const container = React.useRef<HTMLDivElement>(null)
  const actionId = React.useId()
  const press = React.useRef<{target: SVGGElement; x: number; y: number} | null>(null)
  const pointerSequence = React.useRef(false)
  const lastTap = React.useRef<{id: string; at: number} | null>(null)
  const [viewport, setViewport] = React.useState(0)
  const compactMap = mapCanvas && Boolean(value.lanes[0].station)
  const fit = compactMap || (fitLanes && !value.kind && !value.lanes[0].station)
  React.useLayoutEffect(() => {
    const host = container.current
    if (!fit || !host) return
    const measure = () => setViewport(host.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(host)
    return () => observer.disconnect()
  }, [fit])
  const fitted = React.useMemo(() => fit && viewport ? fitLaneLayout(value, viewport, compactMap) : undefined, [fit, viewport, value, compactMap])
  const { width, height } = workshopPositions(value, fitted?.layout, compactMap ? compactStationGap : undefined)
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
  const editHeaders = !viewOnly && (map ? Boolean(onEditStation) : (!release || Boolean(onSelectCard)) && Boolean(onEditLane))
  const addCards = !viewOnly && !map && !release && Boolean(onAddCard) && value.cards.length < maxWorkshopCards
  const selectCards = !viewOnly && Boolean(onSelectCard)
  const draggable = React.useMemo<Draggable<Workshop>>(() => fitted || editHeaders || addCards || compactMap || selectCards
    ? props => renderBoard(props, viewOnly, fitted, editHeaders, addCards, actionId, compactMap, selectCards)
    : viewOnly ? readOnlyBoard : editableBoard, [fitted, viewOnly, editHeaders, addCards, actionId, compactMap, selectCards])
  const headers = '[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]'
  const controls = selectCards ? headers + ',[data-workshop-card]' : headers
  function activate(target: SVGGElement) {
    if (viewOnly) return
    if (target.dataset.workshopCard) onSelectCard?.(target.dataset.workshopCard)
    else if (target.dataset.workshopStation) onEditStation?.(target.dataset.workshopStation)
    else if (target.dataset.workshopLane) onEditLane?.(target.dataset.workshopLane, target)
    else if (target.dataset.workshopAddCard) onAddCard?.(target.dataset.workshopAddCard, target)
  }
  const canvasHeight = linked ? Math.max(height, workshopPositions(linked, fitted?.layout, compactMap ? compactStationGap : undefined).height) : height
  const drawing = <DraggableRenderer key={readOnly ? 'read-only' : gesture}
    draggable={draggable} state={keyboardMove?.next ?? value}
    onDropState={readOnly ? undefined : onDrop} onDragState={readOnly ? undefined : showPreview} onDragStatus={onDragStatus}
    width={width} height={canvasHeight} />
  return <section aria-label={value.title}>
    {/* Keep accessible names current without asking Dragology to interpolate text attributes. */}
    {(editHeaders || addCards) && <div hidden>{value.lanes.map(lane => <React.Fragment key={lane.id}>
      {editHeaders && <span id={actionId + '-edit-' + lane.id}>Edit {lane.label}</span>}
      {addCards && <span id={actionId + '-add-' + lane.id}>Add card to {lane.label}</span>}
    </React.Fragment>)}</div>}
    {selectCards && <div hidden>{value.cards.map(card =>
      <span key={card.id} id={actionId + '-select-' + card.id}>Select {card.label}</span>)}</div>}
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
        const clickOnly = event.detail === 0 || !pointerSequence.current
        pointerSequence.current = false
        if (target && clickOnly) activate(target)
      }}
      onPointerDownCapture={event => {
        pointerSequence.current = true
        press.current = null
        if (viewOnly || !event.isPrimary || event.button !== 0) return
        const target = (event.target as Element).closest<SVGGElement>(headers + ',[data-workshop-card]')
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
        if (!current || viewOnly || Math.hypot(event.clientX - current.x, event.clientY - current.y) > 5) return
        const card = current.target.dataset.workshopCard
        if (!card || selectCards) {
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
      {compactMap ? <NativeMapSurface board={keyboardMove?.next ?? value} fitted={fitted} width={width} height={canvasHeight}>{drawing}</NativeMapSurface> : drawing}
    </div>
    {hasSignals && showPlacementOutcomes && <section aria-label="Placement outcomes" aria-live="polite" style={{overflowWrap:'anywhere'}}>
      {resolveWorkshopSignals(linked ?? value).map(signal => <p key={signal.id}><strong>{signal.label}</strong><br />{signal.text}</p>)}
    </section>}
    {release && <>
      <ReleasePlanReadout value={value} preview={linked} />
      {!readOnly && <>{showMoveControls && <ReleaseMoveControls value={value} preview={keyboardMove?.move ?? null}
        stage={(next, move) => { setKeyboard({source:value, next, move}); onPreview?.(next) }}
        cancel={cancel} apply={() => { if (keyboardMove) { commit(keyboardMove.next, keyboardMove.move); showPreview(null) } }} />}
        <button type="button" disabled={!(onUndo ? canUndo : last?.after === value)} onClick={() => {
          cancel()
          if (onUndo) onUndo()
          else if (last?.after === value) { setLast(null); onChange(last.before) }
        }}>Undo move</button></>}
    </>}
    {value.lanes[0].station && <div className="workshop-outcomes" aria-live="polite">
      {value.cards.map(card => {
        const current = value.lanes.find(lane => lane.id === card.laneId)!
        return <div key={card.id}><p><strong>{card.label} · {current.label}</strong>{(!compactMap || current.station!.outcome !== current.label) && <><br />{current.station!.outcome}</>}</p>
          {current.station!.image && <img src={current.station!.image.src} alt={current.station!.image.alt}
            referrerPolicy="no-referrer" style={{ display:'block', maxWidth:'100%', width:360, maxHeight:240, objectFit:'contain', objectPosition:'left', marginBlock:'8px' }} />}
          {availableLanes(value, card).filter(lane => lane.id !== card.laneId).map(lane =>
            <button key={lane.id} type="button" disabled={readOnly} onClick={() => commit(workshopCandidate(value, card.id, lane.id)!, {cardId: card.id, laneId: lane.id})}>
              {card.label} → {lane.label}
            </button>)}
        </div>
      })}
    </div>}
    {showMoveControls && !release && !compactMap && value.cards.length > 0 && <details>
      <summary>Move a card by name</summary>
      {value.cards.map(card => <label key={card.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBlock: 6 }}>
        {card.label}
        <select disabled={readOnly} aria-label={'Move ' + card.label} value={keyboardMove?.move.cardId === card.id ? keyboardMove.move.laneId : card.laneId}
          onChange={e => {
            const move = {cardId:card.id, laneId:e.currentTarget.value}
            const next = workshopCandidate(value, card.id, move.laneId)!
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
export {StartupWorkshopBoard} from './StartupWorkshopBoard'
