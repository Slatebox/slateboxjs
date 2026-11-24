// A live slate with one business board attached as native notes. The model entry is loaded with
// the slate; the boards entry (kits, board layer and Dragology) only once a board is opened, as
// an app does. ?board=launch-plan|hiring-plan|pipeline|budget|nest picks the board; the screen width picks the layout.
// ?confirm: a host that asks "Move anyway?" (a dialog with the rule's sentence, Move anyway and Cancel, keyboard
// operable, focus going back to the slate), marking cards moved anyway with "Sam".
import { Slate } from '../../src'
import { attachWorkshop, validateWorkshop, type AttachedWorkshop, type Workshop, type WorkshopChangeEvent, type WorkshopRefusalEvent } from '../../src/workshops/model'

const params = new URLSearchParams(location.search)
const kind = params.get('board') ?? 'launch-plan'

const log = {
  changes: [] as { next: Workshop; change: WorkshopChangeEvent }[],
  refusals: [] as WorkshopRefusalEvent[],
  said: [] as string[],
  /** Every "Move anyway?" the board asked (?confirm). */
  asks: [] as unknown[],
}

/** ?confirm: the host's "Move anyway?" dialog, as the app shows it. Escape cancels; focus goes back where it was. */
function confirmOverride(ask: { card: string; lane: string; reason: string; to?: string }) {
  log.asks.push(ask)
  const back = document.activeElement as HTMLElement | null
  return new Promise<boolean>(resolve => {
    const dialog = document.createElement('div')
    dialog.setAttribute('role', 'alertdialog')
    dialog.setAttribute('aria-label', 'Move anyway?')
    dialog.style.cssText = 'position:fixed;left:50%;top:20px;transform:translateX(-50%);background:#fff;padding:12px;border:1px solid #333;z-index:10'
    const words = document.createElement('p')
    words.textContent = `Move ${ask.card} ${ask.to ?? 'to ' + ask.lane} anyway? ${ask.reason}`
    const answer = (yes: boolean) => () => { dialog.remove(); back?.focus?.(); resolve(yes) }
    const yes = document.createElement('button'), no = document.createElement('button')
    yes.textContent = 'Move anyway'; no.textContent = 'Cancel'
    yes.onclick = answer(true); no.onclick = answer(false)
    dialog.addEventListener('keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); answer(false)() } })
    dialog.append(words, no, yes)
    document.body.append(dialog)
    yes.focus()
  })
}

const slate = new Slate('#slate', {
  name: 'Business boards test', showZoom: true,
  viewPort: { originalWidth: innerWidth, originalHeight: innerHeight, showCoordinates: false },
  containerStyle: { backgroundColor: '#eeeee3' },
} as any)
const announce = (slate as any).announce?.bind(slate)
;(slate as any).announce = (text: string) => { log.said.push(text); return announce?.(text) }

const api = {
  slate, log, ready: false, board: null as AttachedWorkshop | null, second: null as AttachedWorkshop | null, validateWorkshop,
  /** Screen box of a note, by its id. */
  box(id: string) {
    const o = slate.nodes.one(id)?.options
    if (!o) return null
    const a = slate.worldToClient({ x: o.x ?? 0, y: o.y ?? 0 })
    const b = slate.worldToClient({ x: (o.x ?? 0) + (o.width ?? 0), y: (o.y ?? 0) + (o.height ?? 0) })
    return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y }
  },
  text: (id: string) => slate.nodes.one(id)?.options?.text ?? null,
}
;(window as any).boards = api

;(async () => {
  if (params.has('plain')) {
    // An ordinary slate: no business board, so nothing from the boards entry is fetched.
    slate.addNode({ id: 'plain', x: 60, y: 80, width: 160, height: 80, text: 'Ordinary note' })
    api.ready = true
    return
  }
  // The boards entry brings the kits and plugs the boards' rules into the model's gate.
  const { kitFor, boardLayoutFor, sampleLaunchPlan, samplePipeline, sampleBudget, hiringPlanSample } = await import('../../src/boards')
  const { workshopReserve } = await import('../../src/workshops/model')
  // A hiring plan comes with its rulebook: the rulebook's own module reads it.
  if (kind === 'hiring-plan' || kind === 'nest') await import('../../src/workshops/behaviour')
  // A nested board's kit is its own chunk.
  if (kind === 'nest') await import('../../src/boards/nest')
  const { discoveryTreeSample } = await import('../../src/workshops/samples')
  const samples: Record<string, () => Workshop> = { 'launch-plan': sampleLaunchPlan, 'hiring-plan': hiringPlanSample, pipeline: samplePipeline, budget: sampleBudget, nest: discoveryTreeSample }
  const layout = boardLayoutFor(innerWidth)
  // ?second: a second copy in scope "b2", 160 past the room the first needs; each board avoids the other.
  const many = params.has('second')
  api.board = attachWorkshop(slate, samples[kind](), {
    kit: kitFor(kind), layout, origin: { x: 0, y: 0 },
    ...(many && { avoid: () => api.second ? [api.second.bounds] : [] }),
    ...(params.has('confirm') ? { confirmOverride, overrideBy: () => 'Sam' } : {}),
    onChange: (next, change) => { log.changes.push({ next, change }) },
    onRefuse: refusal => { log.refusals.push(refusal) },
  })
  await api.board.whenDrawn()
  if (many) {
    const room = workshopReserve(api.board.value, layout, kitFor(kind))
    api.second = attachWorkshop(slate, samples[kind](), {
      kit: kitFor(kind), layout, origin: { x: room.width + 160, y: 0 }, scope: 'b2', avoid: () => [api.board!.bounds],
    })
    await api.second.whenDrawn()
    slate.fitToContent()
  } else slate.fitToWidth(api.board.bounds)
  api.ready = true
})()
