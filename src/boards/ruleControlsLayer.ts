// The rule controls' drawing (library spec §4.3): native chrome shapes in the board layer, beside
// boardChromeShapes, on both engine shapes (SVG.js and the legacy one). Never an HTML overlay.
//
// FOUNDATION stub: draws nothing. BUILDER replaces it.
import type { RuleControl } from '../workshops/ruleControls'
import type { WorkshopEdit } from '../workshops/edits'

export interface RuleControlsLayerOptions {
  onRuleEdit?: (edits: WorkshopEdit[], sentence: string) => Promise<boolean> | boolean
}

export interface RuleControlsLayer { update(controls: RuleControl[]): void; remove(): void }

/** Draw a board's rule controls on `slate`. The stub draws nothing. */
export function drawRuleControls(_slate: unknown, _boardId: string, _controls: RuleControl[], _options: RuleControlsLayerOptions = {}): RuleControlsLayer {
  return { update() {}, remove() {} }
}
