// A source host that loads the main entry (the dev server, the unit tests): every part of a slate present from the
// start, as it always was (see slateParts.ts). The main entry's build does not need it: it builds the slate with
// slatePartsEager.ts instead (vite.config.ts).
import { startLineTool } from './LineTool'
import { BirdsEye } from './BirdsEye'
import { UndoRedo } from './UndoRedo'
import { MediaInput } from './MediaInput'
import { ContextMenu } from './ContextMenu'
import { Keyboard } from './Keyboard'
import { provideSlateParts } from './slateParts'

provideSlateParts({ lineTool: { startLineTool }, birdsEye: { BirdsEye }, undoRedo: { UndoRedo }, mediaInput: { MediaInput }, contextMenu: { ContextMenu }, keyboard: { Keyboard } })
