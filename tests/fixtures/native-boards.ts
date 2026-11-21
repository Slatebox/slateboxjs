// A live slate with one business board attached as native notes. The model entry is loaded with
// the slate; the boards entry (kits, board layer and Dragology) only once a board is opened, as
// an app does. ?board=launch-plan|pipeline|budget picks the board; the screen width picks the layout.
import { Slate } from '../../src'
import { attachWorkshop, validateWorkshop, type AttachedWorkshop, type Workshop, type WorkshopChangeEvent, type WorkshopRefusalEvent } from '../../src/workshops/model'

const params = new URLSearchParams(location.search)
const kind = params.get('board') ?? 'launch-plan'

const log = {
  changes: [] as { next: Workshop; change: WorkshopChangeEvent }[],
  refusals: [] as WorkshopRefusalEvent[],
  said: [] as string[],
}

const slate = new Slate('#slate', {
  name: 'Business boards test', showZoom: true,
  viewPort: { originalWidth: innerWidth, originalHeight: innerHeight, showCoordinates: false },
  containerStyle: { backgroundColor: '#eeeee3' },
} as any)
const announce = (slate as any).announce?.bind(slate)
;(slate as any).announce = (text: string) => { log.said.push(text); return announce?.(text) }

const api = {
  slate, log, ready: false, board: null as AttachedWorkshop | null, validateWorkshop,
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
  const { kitFor, boardLayoutFor, sampleLaunchPlan, samplePipeline, sampleBudget } = await import('../../src/boards')
  const samples: Record<string, () => Workshop> = { 'launch-plan': sampleLaunchPlan, pipeline: samplePipeline, budget: sampleBudget }
  const layout = boardLayoutFor(innerWidth)
  api.board = attachWorkshop(slate, samples[kind](), {
    kit: kitFor(kind), layout, origin: { x: 0, y: 0 },
    onChange: (next, change) => { log.changes.push({ next, change }) },
    onRefuse: refusal => { log.refusals.push(refusal) },
  })
  await api.board.whenDrawn()
  slate.fitToWidth(api.board.bounds)
  api.ready = true
})()
