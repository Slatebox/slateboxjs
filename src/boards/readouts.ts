// What only a drawn business board needs: the edits a canvas change carries, the gauge and header
// words, and the parts as slate notes. Lazy, with the kits; the rules stay in the model entry.
import type { NodeJSON } from '../core/Serialization'
import type { PartPlace, Workshop, WorkshopEdit, WorkshopNoteStyle } from '../workshops/model'
import { dayWords, launchLinkRefusal, lineWord, scheduleLaunch, startHandleCard } from '../workshops/launchPlan'
import { pipelineForecast } from '../workshops/pipeline'
import { money } from '../workshops/numbers'
/**
 * The edits that turn `before` into `after` on a launch plan, pipeline or budget: what a canvas
 * change carries (change.edits) so a server applies it with applyWorkshopEdits to the board as it
 * stands there, and two people changing different tasks or deals both keep their change.
 */
export function workshopEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[] {
  const edits: WorkshopEdit[] = []
  const was = new Map(before.cards.map(card => [card.id, card]))
  for (const card of after.cards) {
    const old = was.get(card.id)
    const ref = { id: card.id }
    if (!old) {
      edits.push({ kind: 'add_card', lane: { id: card.laneId }, label: card.label,
        ...(card.duration !== undefined && { duration: card.duration }), ...(card.lag && { lag: card.lag }),
        ...(card.dependsOn && { waitsOn: card.dependsOn.map(id => ({ id })) }), ...(card.amount !== undefined && { amount: card.amount }) })
      continue
    }
    if (old.label !== card.label) edits.push({ kind: 'rename_card', card: ref, label: card.label })
    const count = edits.length
    for (const id of old.dependsOn ?? []) if (!card.dependsOn?.includes(id)) edits.push({ kind: 'unlink_tasks', card: ref, waitsOn: { id } })
    for (const id of card.dependsOn ?? []) if (!old.dependsOn?.includes(id)) edits.push({ kind: 'link_tasks', card: ref, waitsOn: { id } })
    if (old.laneId !== card.laneId) edits.push({ kind: 'move_card', card: ref, lane: { id: card.laneId } })
    // A link keeps the task's start by changing its lag, so after one the task's days are set as they are wanted.
    if (edits.length > count && card.duration !== undefined && edits.slice(count).some(edit => edit.kind !== 'move_card') ||
      old.duration !== card.duration || (old.lag ?? 0) !== (card.lag ?? 0)) edits.push({ kind: 'set_task', card: ref, duration: card.duration!, lag: card.lag ?? 0 })
    if (card.amount !== undefined && old.amount !== card.amount) edits.push({ kind: 'set_amount', card: ref, amount: card.amount })
  }
  for (const card of before.cards) if (!after.cards.some(item => item.id === card.id)) edits.push({ kind: 'remove_card', card: { id: card.id } })
  if (after.launch && before.launch?.day !== after.launch.day) edits.push({ kind: 'set_launch_day', day: after.launch.day })
  if (after.forecast && before.forecast?.target !== after.forecast.target) edits.push({ kind: 'set_target', amount: after.forecast.target })
  // Money moves from the teams that gave it to the teams that got it.
  const change = after.lanes.map(lane => ({ id: lane.id, by: (lane.allocation ?? 0) - (before.lanes.find(item => item.id === lane.id)?.allocation ?? 0) }))
  const givers = change.filter(item => item.by < 0), takers = change.filter(item => item.by > 0)
  for (const taker of takers) {
    for (const giver of givers) {
      const amount = Math.min(taker.by, -giver.by)
      if (amount <= 0) continue
      edits.push({ kind: 'shift_budget', from: { id: giver.id }, to: { id: taker.id }, amount })
      taker.by -= amount
      giver.by += amount
    }
  }
  for (const lane of after.lanes) {
    const old = before.lanes.find(item => item.id === lane.id)
    if (old && old.label !== lane.label) edits.push({ kind: 'rename_lane', lane: { id: lane.id }, label: lane.label })
    if (old && old.capacity !== lane.capacity) edits.push({ kind: 'set_lane_capacity', lane: { id: lane.id }, capacity: lane.capacity ?? null })
  }
  if (before.title !== after.title) edits.push({ kind: 'rename_workshop', title: after.title })
  return edits
}

/** "Forecast $205k of $250k". */
export function pipelineGauge(board: Workshop): string {
  const currency = board.forecast?.currency
  return `Forecast ${money(pipelineForecast(board), currency)} of ${money(board.forecast?.target ?? 0, currency)}`
}


/** "$1.2M · balanced": always true, and that is the point. */
export function budgetHeader(board: Workshop): string {
  return `${money(board.budget?.total ?? 0, board.budget?.currency)} · balanced`
}


/** The tasks `cardId` may be dropped on to wait on them: not itself, not what it waits on, nothing that waits on it. */
export function launchLinkTargets(board: Workshop, cardId: string): string[] {
  return board.cards.filter(card => launchLinkRefusal(board, cardId, card.id) === null).map(card => card.id)
}

/** The largest size from `size` down to 11 at which `text` fits the box (an estimate; the engine wraps by measuring). */
function fitText(text: string, size: number, width: number, height: number) {
  for (let candidate = size; candidate > 11; candidate--) {
    const perLine = Math.max(1, Math.floor(width / (candidate * 0.55)))
    const lines = text.split('\n').reduce((count, line) => count + Math.max(1, Math.ceil(line.length / perLine)), 0)
    if (lines * candidate * 1.3 <= height) return candidate
  }
  return Math.min(size, 11)
}

/** The parts as slate notes at `origin`: handles are see-through and borderless, the rest drawn in the host's note style. */
export function partNotes(parts: PartPlace[], board: Workshop, origin: { x: number; y: number }, style: WorkshopNoteStyle): NodeJSON[] {
  const ink = style.textColor ?? '#18302d', line = style.borderColor ?? '#667872'
  const size = style.fontSize ?? 14
  return parts.map(part => {
    const handle = part.name.startsWith('handle-')
    const text = part.text ?? ''
    return { options: { id: part.name, text, name: board.cards.find(card => 'card-' + card.id === part.name)?.label ?? text,
      xPos: origin.x + part.x, yPos: origin.y + part.y, width: part.width, height: part.height, shapeHint: 'rectangle',
      vectorPath: `M 0 0 H ${part.width} V ${part.height} H 0 Z`,
      backgroundColor: handle ? 'transparent' : part.fill ?? style.backgroundColor ?? '#fffdf6', foregroundColor: part.ink ?? ink,
      borderColor: part.line ?? line, borderWidth: handle ? 0 : part.lineWidth ?? 1,
      ...(style.fontFamily ? { fontFamily: style.fontFamily } : {}),
      fontSize: fitText(text, part.fontSize ?? size, part.width - 12, part.height - 6) }, relationships: { associations: [] } }
  })
}

/** What a screen reader calls a grip: launch day, a task's start or length, or the divider after a team. */
export function handleLabel(model: Workshop, part: string): string | null {
  const key = part.slice('handle-'.length)
  const from = startHandleCard(part), task = from !== null && model.cards.find(item => item.id === from)
  if (task) return `${task.label} start, ${dayWords(model, scheduleLaunch(model).get(task.id)!.from)}. Left and Right move it; the end stays.`
  // A dated plan says the line's name and date ("Go-live, Fri 18 Dec"); a plan in day numbers, its day.
  if (key === 'launch') return model.clock ? `${lineWord(model).charAt(0).toUpperCase() + lineWord(model).slice(1)}, ${dayWords(model, model.launch!.day)}. Left and Right move it.`
    : `Launch day, day ${model.launch?.day}. Left and Right move it.`
  const card = model.cards.find(item => item.id === key)
  if (card) return `${card.label} length, ${card.duration} days. Left and Right change it.`
  const at = model.lanes.findIndex(item => item.id === key)
  return at >= 0 && model.lanes[at + 1] ? `Divider between ${model.lanes[at].label} and ${model.lanes[at + 1].label}. Left and Right move money.` : null
}
