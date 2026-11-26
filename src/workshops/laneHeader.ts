// A lane's header: where its name sits and where its controls go, shared by the layouts that draw
// the name (model.ts, the kits) and the rule controls that sit beside it (ruleControls.ts), so the
// two never drift. A control never covers words:
// - the name leaves a slot on its right, in its own row, for the lane's color button;
// - under the name (and its caption, when a caption has a row of its own) a strip one finger tall
//   holds, left to right, the lane's status toggle (a bin, "needs an amount"), then − , the limit's
//   value when the header shows one, and +.
// The strip and the slot are reserved in the layout whether or not the controls show, so nothing
// moves when a board is selected.

/** The room a lane's name leaves on its right for its color button: a finger's 44 and a 4 gap. */
export const HEADER_SLOT = 48
/** A finger's target, in board units: the height of the strip and the size of every header control. */
export const HEADER_TARGET = 44
/** The gap between a header row and the next. */
export const HEADER_GAP = 4
/** A board of columns' name: its height (the strip under it ends before the first card, at 98). */
export const LANE_NAME_HEIGHT = 40
/** A board of columns' counter ("2 / 3"): its least height, and the widest it gets (it sits between − and +). */
export const LANE_COUNTER_HEIGHT = 22
export const LANE_COUNTER_MAX = 84
/**
 * The counter's height as the canvas draws it: a note grows to fit its words (Node.ts fitHeightToText: the text's height
 * and 14 of padding), so a box shorter than that is drawn taller, from the same top, and sits lower than the − and + it
 * stands between. The layout takes the drawn height, so the counter is centred in the strip as drawn.
 */
export const laneCounterHeight = (fontSize: number) => Math.min(HEADER_TARGET, Math.max(LANE_COUNTER_HEIGHT, Math.ceil(fontSize * 1.45) + 14))

/** A board of columns' first card (its header's foot) and one card's slot, as model.ts workshopLayout draws them. */
export const LANE_TOP = 98
export const LANE_ROW = 88

/** A box in board coordinates. */
export interface HeaderBox { x: number; y: number; width: number; height: number }

/**
 * Whether a board drawn as columns of native notes (model.ts) shows header controls at all: a board of columns does;
 * a budget, a release plan, a decision board or a map takes no rules (ruleControls.ts ruleControlsFamily), so its
 * header reserves no room for them.
 */
export const laneHeaderHasControls = (board: { kind?: unknown; experience?: unknown; lanes: { station?: unknown }[] }) =>
  !(board.kind || board.experience || board.lanes.some(lane => lane.station))

/**
 * A board of columns' header, in a column at (x, y): its name, its counter, and its strip. A header with no controls
 * (`controls` false) keeps no slot or stepper: its name takes the column's width and the height down to its counter,
 * and its counter (a budget's "$200 · 4 customer calls", a release plan's "3 / 8 points") the column's width, centred
 * just above the first card, so neither shrinks or wraps for room nothing uses.
 */
export function laneHeaderBoxes(x: number, y: number, counterWidth: number, noteWidth = 228, counterHeight = LANE_COUNTER_HEIGHT, controls = true) {
  if (!controls) {
    const pill = Math.min(noteWidth, counterWidth)
    const counterY = y + LANE_TOP - HEADER_GAP - counterHeight
    const label: HeaderBox = { x: x + 8, y: y + 6, width: noteWidth, height: Math.max(LANE_NAME_HEIGHT, counterY - HEADER_GAP - (y + 6)) }
    const counter: HeaderBox = { x: x + 8 + Math.round((noteWidth - pill) / 2), y: counterY, width: pill, height: counterHeight }
    return { label, counter, strip: { x: x + 8, y: label.y + LANE_NAME_HEIGHT + HEADER_GAP, width: noteWidth, height: HEADER_TARGET } }
  }
  const label: HeaderBox = { x: x + 8, y: y + 6, width: noteWidth - HEADER_SLOT, height: LANE_NAME_HEIGHT }
  const stripY = label.y + label.height + HEADER_GAP
  const pill = Math.min(LANE_COUNTER_MAX, counterWidth)
  // The counter sits just before + (the strip's last slot), so − , the counter and + read as one stepper.
  const counter: HeaderBox = { x: x + 8 + noteWidth - HEADER_TARGET - HEADER_GAP - pill, y: stripY + (HEADER_TARGET - counterHeight) / 2, width: pill, height: counterHeight }
  return { label, counter, strip: { x: x + 8, y: stripY, width: noteWidth, height: HEADER_TARGET } }
}

/**
 * A name set in a box: the largest size from `size` down to 11 at which it fits, and at 11 the words that fit with an
 * ellipsis (the full name stays the note's name, so a screen reader and a tooltip still say all of it).
 */
export function fitName(text: string, size: number, width: number, height: number): { text: string; fontSize: number } {
  for (let candidate = size; candidate > 11; candidate--) {
    const perLine = Math.max(1, Math.floor(width / (candidate * 0.55)))
    const lines = text.split('\n').reduce((count, line) => count + Math.max(1, Math.ceil(line.length / perLine)), 0)
    if (lines * candidate * 1.3 <= height) return { text, fontSize: candidate }
  }
  const fontSize = Math.min(size, 11)
  const perLine = Math.max(1, Math.floor(width / (fontSize * 0.55)))
  const most = perLine * Math.max(1, Math.floor(height / (fontSize * 1.3)))
  if (text.length <= most) return { text, fontSize }
  const cut = text.slice(0, Math.max(1, most - 1))
  const space = cut.lastIndexOf(' ')
  return { text: (space > most / 2 ? cut.slice(0, space) : cut).trimEnd() + '…', fontSize }
}

/** Whether two boxes overlap (touching edges do not). */
export function boxesOverlap(a: HeaderBox, b: HeaderBox): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height
}

/** A kit's parts as the controls' layout: its column parts, each with its name part and its caption (when it has words). */
export function ruleControlsLayoutOf(parts: { name: string; x: number; y: number; width: number; height: number; text?: string }[], width: number, height: number): { width: number; height: number; places: { laneId: string; x: number; y: number; width: number; height: number; row: number; label?: HeaderBox; caption?: HeaderBox }[] } {
  const boxOf = (part?: { x: number; y: number; width: number; height: number }) => part && { x: part.x, y: part.y, width: part.width, height: part.height }
  return { width, height, places: parts.filter(part => part.name.startsWith('column-')).map(part => {
    const laneId = part.name.slice('column-'.length)
    // A 2 by 2's quadrant is named by its caption; a lane by its name part, with its caption under it.
    const name = parts.find(item => item.name === 'lane-' + laneId) ?? (laneId.startsWith('q-') ? parts.find(item => item.name === 'caption-' + laneId) : undefined)
    const caption = name?.name.startsWith('lane-') ? parts.find(item => item.name === 'caption-' + laneId && item.text) : undefined
    return { laneId, x: part.x, y: part.y, width: part.width, height: part.height, row: 0, ...(name && { label: boxOf(name) }), ...(caption && { caption: boxOf(caption) }) }
  }) }
}
