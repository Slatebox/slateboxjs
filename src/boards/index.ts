// slateboxjs/boards: what a live slate needs to draw and play a launch plan, a sales pipeline or a
// budget. Loaded only for a slate that holds one of these boards (it brings Dragology with it):
//
//   const { kitFor } = await import('slateboxjs/boards')
//   attachWorkshop(slate, board, { kit: kitFor(board.kind), onChange })
//
// Loading it also plugs the three boards' rules into the one gate in slateboxjs/workshops/model
// (validateWorkshop, applyWorkshopEdits, the refusal sentences): the kits import the rule modules,
// the same code a server loads from slateboxjs/workshops/rules. Load it before the board is read.
//
// Needs React 18 or 19 (an optional peer of slateboxjs): the kits describe their geometry to
// Dragology as React elements. Nothing is mounted, so React DOM is not used.
import type { BusinessBoardKind, Workshop, WorkshopBoardKit, WorkshopBoardLayout } from '../workshops/model'
import { launchPlanKit } from './launchPlanKit'
import { pipelineKit } from './pipelineKit'
import { budgetKit } from './budgetKit'

export { launchPlanKit, launchLayout, type LaunchGeometry } from './launchPlanKit'
export { pipelineKit, pipelineLayout } from './pipelineKit'
export { budgetKit, budgetLayout } from './budgetKit'
export { workshopEditsBetween, pipelineGauge, budgetHeader, launchLinkTargets, partNotes, handleLabel } from './readouts'
export { createBoardLayer, renderLayerShapes, layerInk, type LayerShape } from '../workshops/boardLayer'
export * from '../workshops/rules'

const kits: Record<BusinessBoardKind, WorkshopBoardKit> = { 'launch-plan': launchPlanKit, 'hiring-plan': launchPlanKit, pipeline: pipelineKit, budget: budgetKit }

/** The kit for a business board's kind. Throws for any other kind: those boards draw without one. */
export function kitFor(kind: Workshop['kind'] | string | undefined): WorkshopBoardKit {
  const kit = kits[kind as BusinessBoardKind]
  if (!kit) throw new Error(`No board kit for "${kind}". Only a launch plan, a hiring plan, a pipeline and a budget have one.`)
  return kit
}

/**
 * The layout a business board is drawn with on a screen this many CSS pixels wide: the narrow
 * (phone) arrangement under 600, filling the screen less a 16px gutter each side.
 */
export function boardLayoutFor(viewportWidth: number): WorkshopBoardLayout {
  return viewportWidth < 600 ? { narrow: true, width: Math.max(300, Math.round(viewportWidth - 32)) } : {}
}
