// Rule controls: the drag primitives of a board's rulebook, drawn on the board itself (library
// spec §4.3). Pure: which controls a board shows, where (board coordinates, as the chrome uses), and
// the workshop_edits each gesture makes. They are the same add_rule, set_rule and remove_rule edits
// chat and exec make (and add_lane and set_lane_capacity, which the board already takes), so a control
// is only a picture of a rule: dragging it, or tapping it, says what a sentence in chat would say.
//
// v1 draws these (the rest stay chat only, listed in "How this board behaves", so no control is dead):
// - a board of columns: each column's limit as a line after its last slot (drag it; arrows; − and +),
//   its severity (hold or right-click the limit), a bin on its header, a one-way chevron between two
//   columns side by side, "One column at a time", and a ghost column that adds a column;
// - a sales pipeline: each stage's limit (− and +) and its "needs an amount" padlock;
// - a launch or hiring plan: snap (day or week); a launch plan's hard or soft line and what a slip does;
// - a nested board: a ladder of levels (drag its top rung), how many a card holds (− and +), and on
//   piles, where a far drop goes and what piles rank by.
import { appearanceChips, type Workshop, type WorkshopLane } from './model'
import type { WorkshopEdit } from './edits'

export type RuleControlPrimitive =
  | 'capacity' | 'path' | 'bin' | 'gate' | 'deadline' | 'blackout' | 'snap' | 'locked' | 'cascade'
  | 'depth' | 'children' | 'nests' | 'emptyDrop' | 'rank' | 'quadrant' | 'addLane' | 'look'

/** A box in board (chrome) coordinates; at least 44 by 44 at a finger's chrome scale. */
export interface RuleControlBox { x: number; y: number; width: number; height: number }

/**
 * How a control is drawn (ruleControlsLayer.ts):
 * - line: a limit line across a column from x1 to x2 at y, with a grip pill (`label`) in its middle;
 * - chip: a pill with words (`on`: filled; `icon`: a glyph before the words);
 * - badge: a round button with a glyph;
 * - step: a small round − or + button;
 * - ghost: a dashed column with a + (a column not there yet);
 * - ladder: rungs from y down, `rungs` of them, `on` of them lit, with a grip on the top lit rung.
 */
export interface RuleControlLook {
  shape: 'line' | 'chip' | 'badge' | 'step' | 'ghost' | 'ladder'
  on?: boolean
  /** A badge filled with this color (a column's color from the palette). */
  swatch?: string
  label?: string
  icon?: 'bin' | 'gate' | 'oneway' | 'twoway' | 'step' | 'minus' | 'plus' | 'flag' | 'push' | 'snap' | 'drop' | 'rank' | 'depth' | 'holds'
  warn?: boolean
  x1?: number
  x2?: number
  y?: number
  rungs?: number
  lit?: number
  rungGap?: number
}

export interface RuleControl {
  id: string
  primitive: RuleControlPrimitive
  /** What it sits on: a lane, a card, the time axis, or a line between lanes. */
  anchor: { kind: 'lane' | 'card' | 'axis' | 'edge' | 'board'; id?: string; to?: string }
  hit: RuleControlBox
  /** The rule as it stands: its value and its sentence ("Review holds 3"). */
  state: { value?: unknown; sentence: string; ruleId?: string }
  /** What a screen reader calls it, and what its keys do. */
  label: string
  look: RuleControlLook
  gestures: {
    tap?: WorkshopEdit[]
    /** A drag by `delta` (board units): the edits it makes, [] when it changes nothing. */
    drag?: (delta: { dx: number; dy: number }) => WorkshopEdit[]
    /** What a drag by `delta` would say, while it is held ("Review holds 2"). */
    preview?: (delta: { dx: number; dy: number }) => string
    /** One arrow key moves a drag this far (board units), along `axis`. */
    step?: number
    axis?: 'x' | 'y'
    /** A long press, a right-click, or Shift+Enter (a limit's refuse or warn). */
    hold?: WorkshopEdit[]
    /** Delete or Backspace, or a drag off the board: the rule goes. */
    remove?: WorkshopEdit[]
  }
}

/** Where the board's columns are drawn (workshopLanePlaces, or a kit's column parts), and its drawn size. */
export interface RuleControlsLayout {
  places?: { laneId: string; x: number; y: number; width: number; height: number; row?: number }[]
  width: number
  height: number
}

export interface RuleControlsOptions { finger?: boolean; scale?: number }

interface Rule { id: string; kind: string; on?: boolean; severity?: 'refuse' | 'warn'; [key: string]: unknown }

// The slot geometry of a board of columns (model.ts workshopLayout): a column's header, then one slot a card.
const TOP = 98, ROW = 88, LANE_WIDTH = 228
/** The most cards a column may hold (validateBehaviour), the most columns a board has, and a nested board's deepest level. */
const MAX_HOLD = 24, MAX_LANES = 5, MAX_DEPTH = 6, MAX_CHILDREN = 40
const RUNG = 30

type Family = 'lanes' | 'pipeline' | 'time' | 'nest' | null
/** Which rules a board takes (behaviour.ts behaviourFamily, read here without loading the rulebook). */
export function ruleControlsFamily(board: Pick<Workshop, 'kind' | 'lanes' | 'experience'>): Family {
  if (board.kind === 'pipeline') return 'pipeline'
  if (board.kind === 'launch-plan' || board.kind === 'hiring-plan') return 'time'
  if (board.kind === 'nest') return 'nest'
  if (board.kind || board.experience || board.lanes.some(lane => lane.station)) return null
  return 'lanes'
}

const rulesOf = (board: Workshop): Rule[] => ((board.behaviour as { rules?: Rule[] } | undefined)?.rules ?? []) as Rule[]
const labelOf = (board: Workshop, id: string) => board.lanes.find(lane => lane.id === id)?.label ?? id
const held = (board: Workshop, laneId: string) => board.cards.filter(card => card.laneId === laneId).length
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value))
const box = (cx: number, cy: number, w: number, h: number): RuleControlBox => ({ x: Math.round(cx - w / 2), y: Math.round(cy - h / 2), width: Math.round(w), height: Math.round(h) })
/** A chip's width for its words (the chrome's measure: about half an em a glyph). */
const chipWidth = (text: string, k: number, icon = true) => Math.ceil((text.length * 13 * 0.55 + (icon ? 22 : 0) + 24) * k)

/** A column's limit, as a rule or as the column's own capacity. */
function limitOf(board: Workshop, lane: WorkshopLane): { max: number; rule?: Rule } | null {
  const rule = rulesOf(board).find(item => item.kind === 'capacity' && item.where === lane.id)
  if (rule) return { max: rule.max as number, rule }
  return lane.capacity !== undefined ? { max: lane.capacity } : null
}

/**
 * The edits that set a column's limit to `max` (null: no limit), whatever holds it now, as chat says it: a board with a
 * rulebook gets a capacity rule; a board without one, the column's own capacity (lane-conversation's "Doing holds 3").
 */
function setLimit(board: Workshop, lane: WorkshopLane, max: number | null): WorkshopEdit[] {
  const now = limitOf(board, lane)
  if ((now?.max ?? null) === max) return []
  if (now?.rule) return max === null ? [{ kind: 'remove_rule', rule: now.rule.id }] : [{ kind: 'set_rule', rule: now.rule.id, max }]
  if (now || !board.behaviour) return [{ kind: 'set_lane_capacity', lane: { id: lane.id }, capacity: max }]
  return max === null ? [] : [{ kind: 'add_rule', rule: { kind: 'capacity', where: lane.id, max } }]
}

const holdsSentence = (label: string, max: number | null, warn = false) => max === null ? label + ' holds any number of cards' : label + ' holds ' + max + (warn ? ' (a warning only)' : '')

/**
 * The controls a board shows, where, and what each gesture makes. `layout` is where the board is drawn
 * (its columns' places for a board of columns or a pipeline; its size always). A board that takes no
 * rules (a map, a budget, a decision board) shows none.
 */
export function ruleControls(board: Workshop, layout: RuleControlsLayout | null | undefined, options: RuleControlsOptions = {}): RuleControl[] {
  const family = ruleControlsFamily(board)
  if (!family) return []
  const k = clamp(options.scale ?? 1, 1, 3)
  // A finger's target, at the chrome's scale.
  const H = 44 * k
  const size = { width: layout?.width ?? board.lanes.length * 244, height: layout?.height ?? TOP + ROW }
  const places = layout?.places ?? []
  const out: RuleControl[] = []
  const rules = rulesOf(board)
  // The rail: a row of chips under the board, for the rules that belong to the whole board.
  let railX = 0
  const railY = size.height + 18 * k
  const rail = (control: Omit<RuleControl, 'hit' | 'look'> & { look: Omit<RuleControlLook, 'shape'> & { shape?: RuleControlLook['shape'] } }) => {
    const words = control.look.label ?? ''
    const shape = control.look.shape ?? 'chip'
    const width = shape === 'step' ? H : Math.max(H, chipWidth(words, k, Boolean(control.look.icon)))
    out.push({ ...control, look: { ...control.look, shape }, hit: { x: Math.round(railX), y: Math.round(railY), width, height: Math.round(H) } })
    railX += width + 8 * k
  }

  if (family === 'lanes' || family === 'pipeline') {
    for (const lane of board.lanes) {
      const place = places.find(item => item.laneId === lane.id)
      if (!place) continue
      const limit = limitOf(board, lane)
      const warn = limit?.rule?.severity === 'warn'
      // A bin takes every card: it has no limit to show or change.
      const binned = rules.some(item => item.kind === 'bin' && item.lane === lane.id)
      const name = lane.label
      const sentence = holdsSentence(name, limit?.max ?? null, warn)
      const laneWidth = family === 'lanes' ? Math.min(LANE_WIDTH, place.width) : place.width
      // The header row of controls sits at the foot of the column's header, clear of its name.
      const headerY = place.y + (family === 'lanes' ? TOP - 26 * k : 30 * k)
      const hold = limit?.rule ? [{ kind: 'set_rule', rule: limit.rule.id, severity: warn ? 'refuse' : 'warn' } as WorkshopEdit] : undefined
      // − and +: the limit a step at a time (a finger's way, and a pipeline's only way).
      // A column's own capacity (not a rule) never drops under what it holds; a rule's limit may (it moves no card).
      const floor = limit && !limit.rule ? Math.max(1, held(board, lane.id)) : 1
      const minusMax = limit ? (limit.max <= 1 ? null : limit.max - 1) : null
      const plusMax = limit ? Math.min(MAX_HOLD, limit.max + 1) : Math.max(1, held(board, lane.id))
      const right = place.x + laneWidth - 6 * k
      if (limit && !binned && (minusMax === null || minusMax >= floor)) out.push({ id: 'capacity-minus:' + lane.id, primitive: 'capacity', anchor: { kind: 'lane', id: lane.id },
        hit: box(right - H * 1.5, headerY, H, H), state: { value: limit.max, sentence, ...(limit.rule && { ruleId: limit.rule.id }) },
        label: limit.max <= 1 ? 'Remove the limit on ' + name : name + ': hold one fewer card',
        look: { shape: 'step', icon: 'minus', on: true }, gestures: { tap: setLimit(board, lane, minusMax) } })
      if (!binned && (!limit || limit.max < MAX_HOLD)) out.push({ id: 'capacity-plus:' + lane.id, primitive: 'capacity', anchor: { kind: 'lane', id: lane.id },
        hit: box(right - H * 0.5, headerY, H, H), state: { value: limit?.max ?? null, sentence, ...(limit?.rule && { ruleId: limit.rule.id }) },
        label: limit ? name + ': hold one more card' : 'Give ' + name + ' a limit of ' + plusMax,
        look: { shape: 'step', icon: 'plus', on: Boolean(limit) }, gestures: { tap: setLimit(board, lane, plusMax), ...(hold && { hold }) } })
      if (family === 'lanes' && !binned) {
        // The limit as a line after its last slot: drag it up or down; past the column's foot it goes.
        // A limit past the column's drawn foot (a column with fewer cards than it may hold) is drawn at its foot, and
        // dragged from there by whole slots: never off the board, and a drag up from it is never read as one off the foot.
        const at = (max: number) => place.y + TOP + max * ROW - 6
        const foot = place.y + place.height
        const y = Math.min(limit ? at(limit.max) : foot - 8 * k, foot - 8 * k)
        const maxAt = (dy: number) => {
          const point = y + dy
          // Off the board takes the limit away: well past the foot, never one slot down (an arrow key's step), which adds a card.
          if (point > Math.max(foot, y + ROW) + ROW * 0.75) return null
          if (limit) return clamp(limit.max + Math.round(dy / ROW), floor, MAX_HOLD)
          return clamp(Math.round((point + 6 - place.y - TOP) / ROW), floor, MAX_HOLD)
        }
        const drag = ({ dy }: { dx: number; dy: number }) => {
          const max = maxAt(dy)
          // From no limit, a drag that stays at the column's foot changes nothing.
          if (!limit && (max === null || max >= Math.max(1, held(board, lane.id)) + 1)) return []
          return setLimit(board, lane, max)
        }
        const pill = limit ? 'holds ' + limit.max : 'no limit'
        out.push({ id: 'capacity:' + lane.id, primitive: 'capacity', anchor: { kind: 'lane', id: lane.id },
          hit: box(place.x + laneWidth / 2, y, Math.max(H * 2.4, 104 * k), H), state: { value: limit?.max ?? null, sentence, ...(limit?.rule && { ruleId: limit.rule.id }) },
          label: sentence + '. Drag the line, or press the up and down arrows, to change it' + (limit ? '; Delete removes it' : '') + (hold ? '; Shift+Enter makes it ' + (warn ? 'refuse' : 'a warning only') : '') + '.',
          look: { shape: 'line', label: pill, on: Boolean(limit), warn, x1: place.x + 6, x2: place.x + laneWidth - 6, y },
          gestures: {
            drag, step: ROW, axis: 'y',
            preview: delta => { const max = maxAt(delta.dy); return max === null ? 'No limit' : 'holds ' + max },
            ...(hold && { hold }),
            ...(limit && { remove: setLimit(board, lane, null) }),
          } })
      }
      if (family === 'lanes') {
        // A bin: the column archives what is dropped in it (a limit it had goes: a bin takes every card).
        const bin = rules.find(item => item.kind === 'bin' && item.lane === lane.id)
        out.push({ id: 'bin:' + lane.id, primitive: 'bin', anchor: { kind: 'lane', id: lane.id }, hit: box(place.x + 6 * k + H / 2, headerY, H, H),
          state: { value: Boolean(bin), sentence: bin ? name + ' is a bin: it archives the cards dropped in it' : name + ' is not a bin', ...(bin && { ruleId: bin.id }) },
          label: bin ? name + ' is a bin. Press to make it an ordinary column.' : 'Make ' + name + ' a bin that archives cards' + (limit ? ' (its limit goes)' : '') + '.',
          look: { shape: 'badge', icon: 'bin', on: Boolean(bin) },
          gestures: { tap: bin ? [{ kind: 'remove_rule', rule: bin.id }] : [...setLimit(board, lane, null), { kind: 'add_rule', rule: { kind: 'bin', lane: lane.id } }] } })
      } else {
        // A pipeline's stage: "needs an amount" (the only field its deals carry).
        const gate = rules.find(item => item.kind === 'gate' && item.into === lane.id)
        if (!lane.role || lane.role === 'won') {
          out.push({ id: 'gate:' + lane.id, primitive: 'gate', anchor: { kind: 'lane', id: lane.id }, hit: box(place.x + 6 * k + H / 2, headerY, H, H),
            state: { value: Boolean(gate), sentence: gate ? name + ' needs an amount' : name + ' takes any deal', ...(gate && { ruleId: gate.id }) },
            label: gate ? name + ' needs an amount. Press to let any deal in.' : 'Make ' + name + ' need an amount.',
            look: { shape: 'badge', icon: 'gate', on: Boolean(gate) },
            gestures: { tap: gate ? [{ kind: 'remove_rule', rule: gate.id }] : [{ kind: 'add_rule', rule: { kind: 'gate', into: lane.id, needs: ['amount'] } }] } })
        }
      }
    }
    if (family === 'lanes') {
      // One-way chevrons between two columns side by side.
      for (let i = 0; i + 1 < board.lanes.length; i++) {
        const from = board.lanes[i], to = board.lanes[i + 1]
        const a = places.find(item => item.laneId === from.id), b = places.find(item => item.laneId === to.id)
        if (!a || !b || (a.row ?? 0) !== (b.row ?? 0)) continue
        const path = rules.find(item => item.kind === 'path' && item.from === from.id && Array.isArray(item.to)) as (Rule & { to: string[] }) | undefined
        const oneWay = Boolean(path?.to.includes(to.id))
        const tap: WorkshopEdit[] = !path ? [{ kind: 'add_rule', rule: { kind: 'path', from: from.id, to: [to.id] } }]
          : oneWay ? (path.to.length === 1 ? [{ kind: 'remove_rule', rule: path.id }] : [{ kind: 'set_rule', rule: path.id, to: path.to.filter(id => id !== to.id) }])
          : path.to.length >= 4 ? [] : [{ kind: 'set_rule', rule: path.id, to: [...path.to, to.id] }]
        const said = oneWay ? from.label + ' → ' + path!.to.map(id => labelOf(board, id)).join(' or ') + ' only' : 'Cards move freely between ' + from.label + ' and ' + to.label
        const cx = (a.x + Math.min(LANE_WIDTH, a.width) + b.x) / 2
        out.push({ id: 'path:' + from.id + '>' + to.id, primitive: 'path', anchor: { kind: 'edge', id: from.id, to: to.id },
          hit: box(cx, a.y + TOP + ROW / 2, H, H), state: { value: oneWay, sentence: said, ...(path && { ruleId: path.id }) },
          label: oneWay ? said + '. Press to let cards move freely.' : 'Make cards in ' + from.label + ' go only to ' + to.label + '.',
          look: { shape: 'badge', icon: oneWay ? 'oneway' : 'twoway', on: oneWay }, gestures: { tap } })
      }
      // A column not there yet: tap to add one (a board of columns has up to five).
      if (board.lanes.length < MAX_LANES && places.length) {
        const first = places.filter(item => (item.row ?? 0) === 0)
        const last = first[first.length - 1]
        const x = last.x + Math.min(LANE_WIDTH, last.width) + 16 * k
        const label = 'New column'
        out.push({ id: 'add-lane', primitive: 'addLane', anchor: { kind: 'board' }, hit: { x: Math.round(x), y: Math.round(last.y), width: Math.round(Math.max(H, 64 * k)), height: Math.round(Math.max(H, Math.min(last.height, TOP + ROW))) },
          state: { sentence: board.lanes.length + ' of ' + MAX_LANES + ' columns' }, label: 'Add a column',
          look: { shape: 'ghost', icon: 'plus' }, gestures: { tap: [{ kind: 'add_lane', label }] } })
      }
      // One column at a time.
      const step = rules.find(item => item.kind === 'path' && item.from === 'any' && item.noSkip)
      rail({ id: 'path:any', primitive: 'path', anchor: { kind: 'board' }, state: { value: Boolean(step), sentence: step ? 'Cards move one column at a time' : 'Cards may skip columns', ...(step && { ruleId: step.id }) },
        label: step ? 'Cards move one column at a time. Press to let them skip columns.' : 'Make cards move one column at a time.',
        look: { label: 'One column at a time', icon: 'step', on: Boolean(step) },
        gestures: { tap: step ? [{ kind: 'remove_rule', rule: step.id }] : [{ kind: 'add_rule', rule: { kind: 'path', from: 'any', noSkip: true } }] } })
    }
  }

  if (family === 'time') {
    const noun = board.kind === 'hiring-plan' ? 'Hires' : 'Tasks'
    const snap = rules.find(item => item.kind === 'snap')
    const unit = snap?.unit as 'day' | 'week' | undefined
    rail({ id: 'snap', primitive: 'snap', anchor: { kind: 'axis' }, state: { value: unit ?? null, sentence: unit ? noun + ' snap to whole ' + unit + 's' : noun + ' do not snap', ...(snap && { ruleId: snap.id }) },
      label: (unit ? noun + ' snap to whole ' + unit + 's' : noun + ' do not snap') + '. Press for ' + (unit === 'day' ? 'whole weeks' : unit === 'week' ? 'no snap' : 'whole days') + '.',
      look: { label: 'Snap: ' + (unit === 'day' ? 'Day' : unit === 'week' ? 'Week' : 'Off'), icon: 'snap', on: Boolean(unit) },
      gestures: { tap: !snap ? [{ kind: 'add_rule', rule: { kind: 'snap', unit: 'day' } }] : unit === 'day' ? [{ kind: 'set_rule', rule: snap.id, unit: 'week' }] : [{ kind: 'remove_rule', rule: snap.id }] } })
    if (board.kind === 'launch-plan') {
      const line = rules.find(item => item.kind === 'deadline')
      const soft = line?.severity === 'warn'
      const word = board.launch?.name === 'go-live' ? 'Go-live' : 'Launch day'
      rail({ id: 'deadline', primitive: 'deadline', anchor: { kind: 'axis' },
        state: { value: line ? (soft ? 'soft' : 'hard') : null, sentence: line ? word + ' is a ' + (soft ? 'soft' : 'hard') + ' line' : word + ' has no rule yet', ...(line && { ruleId: line.id }) },
        label: line ? word + ' is a ' + (soft ? 'soft' : 'hard') + ' line. Press to make it ' + (soft ? 'hard' : 'soft') + '.' : 'Make ' + word.toLowerCase() + ' a hard line.',
        look: { label: line ? (soft ? 'Soft line' : 'Hard line') : 'Line: none', icon: 'flag', on: Boolean(line), warn: soft },
        gestures: { tap: line ? [{ kind: 'set_rule', rule: line.id, severity: soft ? 'refuse' : 'warn' }] : [{ kind: 'add_rule', rule: { kind: 'deadline', at: 'launch' } }],
          ...(line && { remove: [{ kind: 'remove_rule', rule: line.id }] }) } })
      const cascade = rules.find(item => item.kind === 'cascade')
      const how = cascade?.onConflict as 'push' | 'stop' | undefined
      rail({ id: 'cascade', primitive: 'cascade', anchor: { kind: 'board' },
        state: { value: how ?? null, sentence: how ? 'A slip ' + (how === 'stop' ? 'stops at' : 'pushes') + ' the tasks that wait on it' : 'A slip does what the plan does by itself', ...(cascade && { ruleId: cascade.id }) },
        label: (how ? 'A slip ' + (how === 'stop' ? 'stops at' : 'pushes') + ' what waits on it' : 'No rule for a slip') + '. Press for ' + (how === 'push' ? 'stop' : how === 'stop' ? 'no rule' : 'push') + '.',
        look: { label: 'A slip: ' + (how === 'push' ? 'pushes' : how === 'stop' ? 'stops' : 'no rule'), icon: 'push', on: Boolean(how) },
        gestures: { tap: !cascade ? [{ kind: 'add_rule', rule: { kind: 'cascade', onConflict: 'push' } }] : how === 'push' ? [{ kind: 'set_rule', rule: cascade.id, onConflict: 'stop' }] : [{ kind: 'remove_rule', rule: cascade.id }] } })
    }
  }

  if (family === 'nest') {
    const layoutKind = board.nest?.layout
    // A ladder of levels on the board's left edge: drag its top lit rung to say how deep cards nest.
    if (layoutKind !== 'matrix') {
      const depth = rules.find(item => item.kind === 'depth')
      const max = depth ? depth.max as number : null
      const lit = max ?? MAX_DEPTH
      const x = -44 * k, top = 8 * k, gap = RUNG * k
      const rungY = top + (lit - 1) * gap
      const depthAt = (dy: number) => {
        const n = Math.round((rungY + dy - top) / gap) + 1
        return n > MAX_DEPTH ? null : clamp(n, 1, MAX_DEPTH)
      }
      const said = (n: number | null) => n === null ? 'Cards nest as deep as they like' : n === 1 ? 'Cards nest one level deep' : 'Cards nest up to ' + n + ' levels deep'
      const set = (n: number | null): WorkshopEdit[] => n === max ? [] : n === null ? [{ kind: 'remove_rule', rule: depth!.id }]
        : depth ? [{ kind: 'set_rule', rule: depth.id, max: n } as WorkshopEdit] : [{ kind: 'add_rule', rule: { kind: 'depth', max: n } }]
      out.push({ id: 'depth', primitive: 'depth', anchor: { kind: 'board' }, hit: box(x, rungY, H, H),
        state: { value: max, sentence: said(max), ...(depth && { ruleId: depth.id }) },
        label: said(max) + '. Drag the ladder, or press the up and down arrows, to change it' + (depth ? '; Delete removes it' : '') + '.',
        look: { shape: 'ladder', rungs: MAX_DEPTH, lit, on: Boolean(depth), y: top, x1: x, rungGap: gap, label: max === null ? 'any depth' : max + (max === 1 ? ' level' : ' levels') },
        gestures: { drag: ({ dy }) => set(depthAt(dy)), preview: ({ dy }) => said(depthAt(dy)), step: gap, axis: 'y', ...(depth && { remove: set(null) }) } })
    }
    // How many cards a card holds under it, a step at a time.
    const children = rules.find(item => item.kind === 'children' && !item.role)
    const most = children ? children.max as number : null
    const kids = Math.max(1, ...board.cards.map(card => board.cards.filter(item => item.parentId === card.id).length))
    const said = most === null ? 'A card holds any number under it' : 'A card holds at most ' + most + ' under it'
    rail({ id: 'children', primitive: 'children', anchor: { kind: 'board' }, state: { value: most, sentence: said, ...(children && { ruleId: children.id }) },
      label: said + '. Press to ' + (children ? 'remove the limit.' : 'give cards a limit of ' + Math.min(MAX_CHILDREN, Math.max(kids, 3)) + '.'),
      look: { label: most === null ? 'Holds: any' : 'Holds ' + most, icon: 'holds', on: Boolean(children) },
      gestures: { tap: children ? [{ kind: 'remove_rule', rule: children.id }] : [{ kind: 'add_rule', rule: { kind: 'children', max: Math.min(MAX_CHILDREN, Math.max(kids, 3)) } }] } })
    if (children) rail({ id: 'children-minus', primitive: 'children', anchor: { kind: 'board' }, state: { value: most, sentence: said },
      label: most === null ? 'No limit on how many a card holds' : most <= 1 ? 'Remove the limit on how many a card holds' : 'A card holds one fewer',
      look: { shape: 'step', icon: 'minus', on: Boolean(children) },
      gestures: { tap: most! <= 1 ? [{ kind: 'remove_rule', rule: children.id }] : [{ kind: 'set_rule', rule: children.id, max: most! - 1 }] } })
    if (children && most! < MAX_CHILDREN) rail({ id: 'children-plus', primitive: 'children', anchor: { kind: 'board' }, state: { value: most, sentence: said },
      label: 'A card holds one more', look: { shape: 'step', icon: 'plus', on: true },
      gestures: { tap: [{ kind: 'set_rule', rule: children.id, max: most! + 1 }] } })
    if (layoutKind === 'clusters') {
      const drop = rules.find(item => item.kind === 'emptyDrop')
      const where = drop?.drop as 'new-pile' | 'unsorted' | undefined
      const tray = board.lanes[1]?.label ?? 'Unsorted'
      rail({ id: 'empty-drop', primitive: 'emptyDrop', anchor: { kind: 'board' },
        state: { value: where ?? null, sentence: where === 'unsorted' ? 'A card let go in empty space goes to ' + tray : 'A card let go in empty space starts a new pile', ...(drop && { ruleId: drop.id }) },
        label: 'Where a card let go in empty space goes: ' + (where === 'unsorted' ? tray : where === 'new-pile' ? 'a new pile' : 'a new pile (no rule)') + '. Press to change it.',
        look: { label: 'Far drop: ' + (where === 'unsorted' ? tray : where === 'new-pile' ? 'new pile' : 'no rule'), icon: 'drop', on: Boolean(drop) },
        gestures: { tap: !drop ? [{ kind: 'add_rule', rule: { kind: 'emptyDrop', drop: 'unsorted' } }] : where === 'unsorted' ? [{ kind: 'set_rule', rule: drop.id, drop: 'new-pile' }] : [{ kind: 'remove_rule', rule: drop.id }] } })
      const rank = rules.find(item => item.kind === 'rank')
      const by = rank?.by as string | undefined
      const fields = (board.nest?.fields ?? []).filter(field => !field.flag).map(field => ({ id: field.id, label: field.label }))
      const choices = [{ id: 'count', label: 'count' }, { id: 'sources', label: 'customers' }, ...fields]
      const index = by ? choices.findIndex(choice => choice.id === by) : -1
      const next = choices[index + 1]
      const name = (id?: string) => choices.find(choice => choice.id === id)?.label ?? id ?? ''
      rail({ id: 'rank', primitive: 'rank', anchor: { kind: 'board' },
        state: { value: by ?? null, sentence: by ? 'Piles rank by ' + name(by) : 'Piles keep their order', ...(rank && { ruleId: rank.id }) },
        label: (by ? 'Piles rank by ' + name(by) : 'Piles keep their order') + '. Press for ' + (next ? 'rank by ' + next.label : 'no ranking') + '.',
        look: { label: 'Rank: ' + (by ? name(by) : 'off'), icon: 'rank', on: Boolean(rank) },
        gestures: { tap: !rank ? [{ kind: 'add_rule', rule: { kind: 'rank', by: 'count' } }] : next ? [{ kind: 'set_rule', rule: rank.id, by: next.id }] : [{ kind: 'remove_rule', rule: rank.id }] } })
    }
  }
  // The board's look (appearance.ts): its chips on the rail, a swatch in each column's corner (a pipeline's between its limit and padlock).
  const { rail: chips, swatches } = appearanceChips(board, places.map(place => place.laneId)), pipe = family === 'pipeline'
  for (const c of chips) rail({ id: c.id, primitive: 'look', anchor: { kind: 'board' }, state: { value: c.on, sentence: c.label }, label: c.said, look: { label: c.label, on: c.on }, gestures: { tap: [c.edit as WorkshopEdit] } })
  for (const c of swatches) {
    const { x, y, width } = places.find(place => place.laneId === c.key)!
    out.push({ id: 'color:' + c.key, primitive: 'look', anchor: { kind: 'lane', id: c.key }, hit: box(pipe ? x + width / 2 : x + Math.min(LANE_WIDTH, width) - H / 2 - 2 * k, pipe ? y + 30 * k : y + H / 2 + 2 * k, H, H),
      state: { value: c.now, sentence: c.sentence }, label: c.said, look: { shape: 'badge', on: !!c.now, swatch: c.swatch }, gestures: { tap: [c.edit as WorkshopEdit] } })
  }
  return out
}

/** The edit kinds a rule control makes: what a canvas change of rules may hold (and never a move with them). */
export const RULE_CONTROL_EDITS: readonly string[] = ['add_rule', 'set_rule', 'remove_rule', 'set_lane_capacity', 'add_lane', 'set_appearance']
