// Rule controls: the drag primitives of a board's rulebook, drawn on the board itself (library
// spec §4.3). Pure: which controls a board shows, where, and the workshop_edits each gesture
// makes (the same add_rule, set_rule and remove_rule edits chat and exec make).
//
// FOUNDATION stub: the entry point (slateboxjs/workshops/controls) and its types. BUILDER replaces
// ruleControls with the v1 controls (capacity, one-way path, bin, gate, deadline line, freeze band,
// snap, lock, push or stop, depth, holds N, sits under, empty-space drop, rank, square limit).
import type { Workshop } from './model'
import type { WorkshopEdit } from './edits'

export type RuleControlPrimitive =
  | 'capacity' | 'path' | 'bin' | 'gate' | 'deadline' | 'blackout' | 'snap' | 'locked' | 'cascade'
  | 'depth' | 'children' | 'nests' | 'emptyDrop' | 'rank' | 'quadrant' | 'addLane'

/** A box in board (chrome) coordinates; at least 44 by 44 at a finger's chrome scale. */
export interface RuleControlBox { x: number; y: number; width: number; height: number }

export interface RuleControl {
  id: string
  primitive: RuleControlPrimitive
  /** What it sits on: a lane, a card, the time axis, or a line between lanes. */
  anchor: { kind: 'lane' | 'card' | 'axis' | 'edge' | 'board'; id?: string; to?: string }
  hit: RuleControlBox
  /** The rule as it stands: its value and its sentence ("Review holds 3"). */
  state: { value?: unknown; sentence: string; ruleId?: string }
  gestures: {
    tap?: WorkshopEdit[]
    drag?: (delta: { dx: number; dy: number }) => WorkshopEdit[]
    remove?: WorkshopEdit[]
  }
}

export interface RuleControlsOptions { finger?: boolean; scale?: number }

/** The controls a board shows. The stub shows none. */
export function ruleControls(_board: Workshop, _layout: unknown, _options: RuleControlsOptions = {}): RuleControl[] {
  return []
}
