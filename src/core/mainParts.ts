// The main entry's slate (slateboxjs): every part present from the start, as it always was (see slateParts.ts).
import * as lineTool from './LineTool'
import * as birdsEye from './BirdsEye'
import { provideSlateParts } from './slateParts'

provideSlateParts({ lineTool, birdsEye })
