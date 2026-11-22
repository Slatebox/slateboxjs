import type { Workshop, WorkshopBoardKit, WorkshopBoardLayout } from '../workshops/model';
export { launchPlanKit, launchLayout, type LaunchGeometry } from './launchPlanKit';
export { pipelineKit, pipelineLayout } from './pipelineKit';
export { budgetKit, budgetLayout } from './budgetKit';
export { nestKit, nestLayout, nestEditsBetween } from './nestKit';
export { workshopEditsBetween, pipelineGauge, budgetHeader, launchLinkTargets, partNotes, handleLabel } from './readouts';
export { createBoardLayer, renderLayerShapes, layerInk, type LayerShape } from '../workshops/boardLayer';
export * from '../workshops/rules';
/** The kit for a business board's kind. Throws for any other kind: those boards draw without one. */
export declare function kitFor(kind: Workshop['kind'] | string | undefined): WorkshopBoardKit;
/**
 * The layout a business board is drawn with on a screen this many CSS pixels wide: the narrow
 * (phone) arrangement under 600, filling the screen less a 16px gutter each side.
 */
export declare function boardLayoutFor(viewportWidth: number): WorkshopBoardLayout;
