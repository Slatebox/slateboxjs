// The parts of a slate that wait for a person or a request: the line tool, and the bird's-eye view. The main
// entry (slateboxjs) has them from the start: its build (vite.config.ts) swaps this file for slatePartsEager.ts,
// and a source host (the dev server, the unit tests) hands them over through mainParts.ts, so a slate behaves
// exactly as it always has. The canvas entry (slateboxjs/canvas) does not: a read-only page never fetches them,
// and a slate loads each the first time it needs it.
import type * as LineToolModule from './LineTool'
import type * as BirdsEyeModule from './BirdsEye'

export interface SlateParts {
  lineTool?: Pick<typeof LineToolModule, 'startLineTool'>
  birdsEye?: Pick<typeof BirdsEyeModule, 'BirdsEye'>
}
const parts: SlateParts = {}

/** Whether the parts are part of the bundle from the start: never here (slatePartsEager.ts says yes, as a constant the build folds). */
export const partsBuiltIn: boolean = false

/** Hand the parts over at once (mainParts.ts does, for a host that loads the source). */
export function provideSlateParts(given: SlateParts): void {
  Object.assign(parts, given)
}

/** The line tool, when it is here already. */
export const lineToolNow = () => parts.lineTool ?? null
/** The line tool, fetched the first time a slate draws a line. */
export const loadLineTool = async () => parts.lineTool ?? (parts.lineTool = await import('./LineTool'))
/** The bird's-eye view, when it is here already. */
export const birdsEyeNow = () => parts.birdsEye ?? null
/** The bird's-eye view, fetched the first time a slate asks for it. */
export const loadBirdsEye = async () => parts.birdsEye ?? (parts.birdsEye = await import('./BirdsEye'))
