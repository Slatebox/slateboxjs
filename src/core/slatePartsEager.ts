// The main entry's slateParts.ts (vite.config.ts swaps it in for the slate): the line tool, the bird's-eye view, the undo
// history, the keyboard, the video-address paste, the right-click menu, the presentation mode and the video note are part of the bundle from the start, imported as the slate always imported them, with no module objects and no
// dynamic imports for the bundle to carry.
import { startLineTool } from './LineTool'
import { BirdsEye } from './BirdsEye'
import { UndoRedo } from './UndoRedo'
import { MediaInput } from './MediaInput'
import { ContextMenu } from './ContextMenu'
import { Keyboard } from './Keyboard'
import { Presentation } from './Presentation'
import { MediaNote } from './MediaNote'

export const partsBuiltIn = true
const lineTool = { startLineTool }
const birdsEye = { BirdsEye }
const undoRedo = { UndoRedo }
const mediaInput = { MediaInput }
const contextMenu = { ContextMenu }
const keyboard = { Keyboard }
const presentation = { Presentation }
const mediaNote = { MediaNote }
export const lineToolNow = () => lineTool
export const loadLineTool = async () => lineTool
export const birdsEyeNow = () => birdsEye
export const loadBirdsEye = async () => birdsEye
export const undoRedoNow = () => undoRedo
export const loadUndoRedo = async () => undoRedo
export const mediaInputNow = () => mediaInput
export const loadMediaInput = async () => mediaInput
export const contextMenuNow = () => contextMenu
export const loadContextMenu = async () => contextMenu
export const keyboardNow = () => keyboard
export const loadKeyboard = async () => keyboard
export const presentationNow = () => presentation
export const loadPresentation = async () => presentation
export const mediaNoteNow = () => mediaNote
export const loadMediaNote = async () => mediaNote
