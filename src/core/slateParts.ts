// The parts of a slate that wait for a person or a request: the line tool, and the bird's-eye view. The main
// entry (slateboxjs, src/index.ts) hands them over at once through mainParts.ts, so a slate behaves exactly as
// it always has. The canvas entry (slateboxjs/canvas) does not: a read-only page never fetches them, and a
// slate loads each the first time it needs it.
import type * as LineToolModule from './LineTool'
import type * as BirdsEyeModule from './BirdsEye'

interface Parts {
  lineTool?: typeof LineToolModule
  birdsEye?: typeof BirdsEyeModule
}
const parts: Parts = {}

/** Hand the parts over at once (the main entry does, on import). */
export function provideSlateParts(given: Parts): void {
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
