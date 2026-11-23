// slateboxjs/workshops/controls: the rule controls (pure) and their layer, a lazy chunk loaded
// where a board can be edited. Loading it lends every attached board its controls (attachWorkshop's
// `controls` option): until it has loaded, a board draws none.
import { registerRuleControls } from './model'
import { ruleControls } from './ruleControls'
import { drawRuleControls } from '../boards/ruleControlsLayer'

export * from './ruleControls'
export * from '../boards/ruleControlsLayer'

registerRuleControls({ controls: ruleControls as never, draw: drawRuleControls as never })
