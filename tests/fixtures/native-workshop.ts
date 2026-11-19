// A live slate holding one ordinary note and an attached workshop. No React:
// the engine and the workshop model entry are the only imports, unless the page
// is opened with ?dragology (which loads Dragology's headless chooser).
import { Slate } from '../../src'
import {
  attachWorkshop, createBudgetWorkshop, createInterviewWorkshop, releasePlan, validateWorkshop,
  type AttachedWorkshop, type Workshop, type WorkshopChangeEvent, type WorkshopRefusalEvent,
} from '../../src/workshops/model'

const params = new URLSearchParams(location.search)

/** Two lanes: "Later" holds one card, and Gamma may never leave "Now". */
const twoLanes: Workshop = {
  version: 1, title: 'What ships now?',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later', capacity: 1 }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' },
    { id: 'beta', label: 'Beta', laneId: 'now' },
    { id: 'gamma', label: 'Gamma', laneId: 'now', allowedLaneIds: ['now'] },
  ],
}

/** Three stations in a row. The token may only take one hop at a time. */
const threeStations: Workshop = {
  version: 1, title: 'Refund request',
  lanes: [
    { id: 'request', label: 'Refund request', station: { column: 0, row: 0, next: ['finance'], outcome: 'The customer has asked for a refund.' } },
    { id: 'finance', label: 'Finance approves', station: { column: 1, row: 0, next: ['refund'], outcome: 'Finance has approved the refund.' } },
    { id: 'refund', label: 'Issue refund', station: { column: 2, row: 0, next: [], outcome: 'The refund has been issued.' } },
  ],
  cards: [{ id: 'token', label: 'Team', laneId: 'request' }],
}

const models: Record<string, () => Workshop> = {
  lanes: () => twoLanes, budget: createBudgetWorkshop, interview: createInterviewWorkshop, map: () => threeStations, release: () => releasePlan,
}

const log = {
  changes: [] as { next: Workshop; change: WorkshopChangeEvent }[],
  refusals: [] as WorkshopRefusalEvent[],
  previews: [] as (Workshop | null)[],
  /** Every package the engine handed the host through onSlateChanged. */
  packages: [] as { type: string; data: unknown }[],
  /** Every package the engine tried to send to collaborators. */
  sent: [] as { type: string; data: unknown }[],
}

const slate = new Slate('#slate', {
  name: 'Native workshop test', showZoom: true, showMultiSelect: true, birdsEye: { enabled: true },
  viewPort: { originalWidth: innerWidth, originalHeight: innerHeight, showCoordinates: false },
  containerStyle: { backgroundColor: '#eeeee3' },
  events: { onSlateChanged: pkg => { log.packages.push({ type: pkg.type, data: pkg.data }) } },
} as any)
const send = slate.collab.send.bind(slate.collab)
slate.collab.send = (packages: any) => {
  for (const pkg of Array.isArray(packages) ? packages : [packages]) log.sent.push({ type: pkg.type, data: pkg.data })
  return send(packages)
}

if (!params.has('empty')) {
  slate.addNode({ id: 'plain', x: 60, y: 80, width: 160, height: 80, text: 'Ordinary note', shape: 'roundedrectangle', backgroundColor: '#f0d399', borderColor: '#627569', fontSize: 16, fontColor: '#24372d' })
}

async function attach(model: Workshop, options: Record<string, unknown> = {}) {
  const chooseCandidate = params.has('dragology')
    ? (await import('../../src/workshops/dragologyCandidates')).dragologyCandidates : undefined
  const board = attachWorkshop(slate, model, {
    readOnly: params.has('readonly'), chooseCandidate, ...options,
    onChange: (next, change) => { log.changes.push({ next, change }); if (api.hostThrows) throw new Error('The host could not save.') },
    onRefuse: refusal => { log.refusals.push(refusal); if (api.hostThrows) throw new Error('The host could not show the refusal.') },
    onPreview: candidate => { log.previews.push(candidate); if (api.hostThrows) throw new Error('The host could not show the preview.') },
  })
  await board.whenDrawn()
  return board
}

const kind = ['budget', 'interview', 'map', 'release'].find(name => params.has(name)) ?? 'lanes'
const api = {
  slate, log, models, validateWorkshop, attach,
  board: null as AttachedWorkshop | null,
  ready: false,
  /** Set to make every host callback throw after recording what it was told. */
  hostThrows: false,
  /** Screen position and size of a note, by its node id: its world box seen through the current pan and zoom. */
  box(id: string) {
    const o = slate.nodes.one(id)?.options
    if (!o) return null
    const a = slate.worldToClient({ x: o.x ?? 0, y: o.y ?? 0 })
    const b = slate.worldToClient({ x: (o.x ?? 0) + (o.width ?? 0), y: (o.y ?? 0) + (o.height ?? 0) })
    return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y }
  },
  /** World position of a note, by its node id. */
  at(id: string) {
    const o = slate.nodes.one(id)?.options
    return o ? { x: o.x, y: o.y, width: o.width, height: o.height, text: o.text } : null
  },
}
;(window as any).native = api

slate.nodes.one('plain')?.ready.then(async () => {
  // Settle the ordinary note's own "added" package before the workshop arrives.
  await new Promise(resolve => setTimeout(resolve, 50))
  api.board = await attach(models[kind]())
  if (params.has('fit')) slate.fitToContent()
  log.packages.length = 0
  log.sent.length = 0
  api.ready = true
}) ?? (async () => {
  api.board = await attach(models[kind]())
  if (params.has('fit')) slate.fitToContent()
  api.ready = true
})()
