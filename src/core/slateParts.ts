// The parts of a slate that wait for a person or a request: the line tool, the bird's-eye view, the undo history and
// the keyboard, the video-address paste and the right-click menu (the last four wait for a person: a read-only page
// never fetches the paste or the menu, and fetches the history and the keyboard as the slate starts), the
// presentation mode (fetched as the slate starts, so it is there when a host presents), and a video note's poster,
// play button and player (fetched the first time a note with a video is drawn). The main
// entry (slateboxjs) has them from the start: its build (vite.config.ts) swaps this file for slatePartsEager.ts,
// and a source host (the dev server, the unit tests) hands them over through mainParts.ts, so a slate behaves
// exactly as it always has. The canvas entry (slateboxjs/canvas) does not: a read-only page never fetches them,
// and a slate loads each the first time it needs it.
import type * as LineToolModule from './LineTool'
import type * as BirdsEyeModule from './BirdsEye'
import type * as UndoRedoModule from './UndoRedo'
import type * as MediaInputModule from './MediaInput'
import type * as ContextMenuModule from './ContextMenu'
import type * as KeyboardModule from './Keyboard'
import type * as PresentationModule from './Presentation'
import type * as MediaNoteModule from './MediaNote'

export interface SlateParts {
  lineTool?: Pick<typeof LineToolModule, 'startLineTool'>
  birdsEye?: Pick<typeof BirdsEyeModule, 'BirdsEye'>
  undoRedo?: Pick<typeof UndoRedoModule, 'UndoRedo'>
  mediaInput?: Pick<typeof MediaInputModule, 'MediaInput'>
  contextMenu?: Pick<typeof ContextMenuModule, 'ContextMenu'>
  keyboard?: Pick<typeof KeyboardModule, 'Keyboard'>
  presentation?: Pick<typeof PresentationModule, 'Presentation'>
  mediaNote?: Pick<typeof MediaNoteModule, 'MediaNote'>
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
/** The undo history, when it is here already. */
export const undoRedoNow = () => parts.undoRedo ?? null
/** The undo history, fetched as soon as a slate starts (a read-only page's first paint never waits on it). */
export const loadUndoRedo = async () => parts.undoRedo ?? (parts.undoRedo = await import('./UndoRedo'))
/** The video-address paste, when it is here already. */
export const mediaInputNow = () => parts.mediaInput ?? null
/** The video-address paste, fetched for a slate that can be edited. */
export const loadMediaInput = async () => parts.mediaInput ?? (parts.mediaInput = await import('./MediaInput'))
/** The right-click menu, when it is here already. */
export const contextMenuNow = () => parts.contextMenu ?? null
/** The right-click menu, fetched for a slate that can be edited. */
export const loadContextMenu = async () => parts.contextMenu ?? (parts.contextMenu = await import('./ContextMenu'))
/** The keyboard, when it is here already. */
export const keyboardNow = () => parts.keyboard ?? null
/** The keyboard, fetched as soon as a slate starts. */
export const loadKeyboard = async () => parts.keyboard ?? (parts.keyboard = await import('./Keyboard'))
/** The presentation mode, when it is here already. */
export const presentationNow = () => parts.presentation ?? null
/** The presentation mode, fetched as soon as a slate starts. */
export const loadPresentation = async () => parts.presentation ?? (parts.presentation = await import('./Presentation'))
/** A video note's poster, play button and player, when they are here already. */
export const mediaNoteNow = () => parts.mediaNote ?? null
/** A video note's poster, play button and player, fetched the first time a note with a video is drawn. */
export const loadMediaNote = async () => parts.mediaNote ?? (parts.mediaNote = await import('./MediaNote'))
