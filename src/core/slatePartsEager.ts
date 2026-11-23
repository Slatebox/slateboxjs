// The main entry's slateParts.ts (vite.config.ts swaps it in for the slate): the line tool and the bird's-eye view
// are part of the bundle from the start, imported as the slate always imported them, with no module objects and no
// dynamic imports for the bundle to carry.
import { startLineTool } from './LineTool'
import { BirdsEye } from './BirdsEye'

export const partsBuiltIn = true
const lineTool = { startLineTool }
const birdsEye = { BirdsEye }
export const lineToolNow = () => lineTool
export const loadLineTool = async () => lineTool
export const birdsEyeNow = () => birdsEye
export const loadBirdsEye = async () => birdsEye
