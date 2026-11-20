// A live slate holding one ordinary note and an attached workshop. No React:
// the engine and the workshop model entry are the only imports, unless the page
// is opened with ?dragology (which loads Dragology's headless chooser).
import { Slate } from '../../src'
import {
  attachWorkshop, createBudgetWorkshop, createInterviewWorkshop, nightTransfer, releasePlan, validateWorkshop,
  type AttachedWorkshop, type Workshop, type WorkshopChangeEvent, type WorkshopNoteStyle, type WorkshopRefusalEvent, type WorkshopSelection,
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

/** Four lanes, tall enough that the last starts below a phone screen when they are stacked. "Done" is full. */
const fourLanes: Workshop = {
  version: 1, title: 'Where is each job?',
  lanes: [{ id: 'inbox', label: 'Inbox' }, { id: 'doing', label: 'Doing' }, { id: 'review', label: 'Review' }, { id: 'done', label: 'Done', capacity: 1 }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'inbox' },
    { id: 'beta', label: 'Beta', laneId: 'inbox' },
    { id: 'gamma', label: 'Gamma', laneId: 'inbox' },
    { id: 'omega', label: 'Omega', laneId: 'done' },
  ],
}

const models: Record<string, () => Workshop> = {
  lanes: () => twoLanes, budget: createBudgetWorkshop, interview: createInterviewWorkshop, map: () => threeStations, release: () => releasePlan,
  tall: () => fourLanes, night: () => nightTransfer,
}

const log = {
  changes: [] as { next: Workshop; change: WorkshopChangeEvent }[],
  refusals: [] as WorkshopRefusalEvent[],
  previews: [] as (Workshop | null)[],
  selections: [] as WorkshopSelection[],
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

/** ?styled: a host with a note style of its own, passed to the workshop and used for its ordinary note. */
const hostStyle: WorkshopNoteStyle | undefined = params.has('styled')
  ? { fontFamily: 'Georgia, serif', fontSize: 18, laneFontSize: 20, captionFontSize: 15, textColor: '#24372d', borderColor: '#627569', borderWidth: 2, cornerRadius: 12 }
  : undefined

if (!params.has('empty')) {
  slate.addNode(hostStyle
    ? { id: 'plain', x: 60, y: 80, width: 160, height: 80, text: 'Ordinary note', shape: 'roundedrectangle', backgroundColor: '#f0d399',
        borderColor: hostStyle.borderColor, borderWidth: hostStyle.borderWidth, fontSize: hostStyle.fontSize, fontFamily: hostStyle.fontFamily, fontColor: hostStyle.textColor }
    : { id: 'plain', x: 60, y: 80, width: 160, height: 80, text: 'Ordinary note', shape: 'roundedrectangle', backgroundColor: '#f0d399', borderColor: '#627569', fontSize: 16, fontColor: '#24372d' })
  // ?defaultnote: a second ordinary note with nothing but the engine's defaults, to compare the workshop's notes with.
  if (params.has('defaultnote')) slate.addNode({ id: 'default', x: 60, y: 200, width: 160, height: 80, text: 'Default note' })
}

async function attach(model: Workshop, options: Record<string, unknown> = {}) {
  const chooseCandidate = params.has('dragology')
    ? (await import('../../src/workshops/dragologyCandidates')).dragologyCandidates : undefined
  const board = attachWorkshop(slate, model, {
    readOnly: params.has('readonly'), chooseCandidate,
    ...(params.has('perRow') ? { layout: { lanesPerRow: Number(params.get('perRow')) } } : {}),
    ...(hostStyle ? { style: hostStyle } : {}),
    ...options,
    onChange: (next, change) => {
      log.changes.push({ next, change })
      if (api.hostThrows) throw new Error('The host could not save.')
      // What the host's save said, when a test sets an answer (true, false or 'taken').
      return api.answer?.(change)
    },
    onRefuse: refusal => { log.refusals.push(refusal); if (api.hostThrows) throw new Error('The host could not show the refusal.') },
    onPreview: candidate => { log.previews.push(candidate); if (api.hostThrows) throw new Error('The host could not show the preview.') },
    onSelect: selection => { log.selections.push(selection); if (api.hostThrows) throw new Error('The host could not show the selection.') },
  })
  await board.whenDrawn()
  return board
}

const kind = ['budget', 'interview', 'map', 'release', 'tall', 'night'].find(name => params.has(name)) ?? 'lanes'
const api = {
  slate, log, models, validateWorkshop, attach,
  board: null as AttachedWorkshop | null,
  ready: false,
  /** Set to make every host callback throw after recording what it was told. */
  hostThrows: false,
  /** Set to answer each change as a host's save would: a promise of true, false or 'taken'. */
  answer: null as null | ((change: WorkshopChangeEvent) => unknown),
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
  // ?fitwidth: what a phone host does: the board as wide as the screen allows, read from the top.
  if (params.has('fitwidth')) slate.fitToWidth(api.board.bounds)
  log.packages.length = 0
  log.sent.length = 0
  api.ready = true
}) ?? (async () => {
  api.board = await attach(models[kind]())
  if (params.has('fit')) slate.fitToContent()
  // ?fitwidth: what a phone host does: the board as wide as the screen allows, read from the top.
  if (params.has('fitwidth')) slate.fitToWidth(api.board.bounds)
  api.ready = true
})()
