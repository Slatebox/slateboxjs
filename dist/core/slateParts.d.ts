import type * as LineToolModule from './LineTool';
import type * as BirdsEyeModule from './BirdsEye';
import type * as UndoRedoModule from './UndoRedo';
import type * as MediaInputModule from './MediaInput';
import type * as ContextMenuModule from './ContextMenu';
import type * as KeyboardModule from './Keyboard';
import type * as PresentationModule from './Presentation';
import type * as MediaNoteModule from './MediaNote';
export interface SlateParts {
    lineTool?: Pick<typeof LineToolModule, 'startLineTool'>;
    birdsEye?: Pick<typeof BirdsEyeModule, 'BirdsEye'>;
    undoRedo?: Pick<typeof UndoRedoModule, 'UndoRedo'>;
    mediaInput?: Pick<typeof MediaInputModule, 'MediaInput'>;
    contextMenu?: Pick<typeof ContextMenuModule, 'ContextMenu'>;
    keyboard?: Pick<typeof KeyboardModule, 'Keyboard'>;
    presentation?: Pick<typeof PresentationModule, 'Presentation'>;
    mediaNote?: Pick<typeof MediaNoteModule, 'MediaNote'>;
}
/** Whether the parts are part of the bundle from the start: never here (slatePartsEager.ts says yes, as a constant the build folds). */
export declare const partsBuiltIn: boolean;
/** Hand the parts over at once (mainParts.ts does, for a host that loads the source). */
export declare function provideSlateParts(given: SlateParts): void;
/** The line tool, when it is here already. */
export declare const lineToolNow: () => Pick<typeof LineToolModule, "startLineTool"> | null;
/** The line tool, fetched the first time a slate draws a line. */
export declare const loadLineTool: () => Promise<typeof LineToolModule>;
/** The bird's-eye view, when it is here already. */
export declare const birdsEyeNow: () => Pick<typeof BirdsEyeModule, "BirdsEye"> | null;
/** The bird's-eye view, fetched the first time a slate asks for it. */
export declare const loadBirdsEye: () => Promise<typeof BirdsEyeModule>;
/** The undo history, when it is here already. */
export declare const undoRedoNow: () => Pick<typeof UndoRedoModule, "UndoRedo"> | null;
/** The undo history, fetched as soon as a slate starts (a read-only page's first paint never waits on it). */
export declare const loadUndoRedo: () => Promise<Pick<typeof UndoRedoModule, "UndoRedo">>;
/** The video-address paste, when it is here already. */
export declare const mediaInputNow: () => Pick<typeof MediaInputModule, "MediaInput"> | null;
/** The video-address paste, fetched for a slate that can be edited. */
export declare const loadMediaInput: () => Promise<Pick<typeof MediaInputModule, "MediaInput">>;
/** The right-click menu, when it is here already. */
export declare const contextMenuNow: () => Pick<typeof ContextMenuModule, "ContextMenu"> | null;
/** The right-click menu, fetched for a slate that can be edited. */
export declare const loadContextMenu: () => Promise<typeof ContextMenuModule>;
/** The keyboard, when it is here already. */
export declare const keyboardNow: () => Pick<typeof KeyboardModule, "Keyboard"> | null;
/** The keyboard, fetched as soon as a slate starts. */
export declare const loadKeyboard: () => Promise<typeof KeyboardModule>;
/** The presentation mode, when it is here already. */
export declare const presentationNow: () => Pick<typeof PresentationModule, "Presentation"> | null;
/** The presentation mode, fetched as soon as a slate starts. */
export declare const loadPresentation: () => Promise<typeof PresentationModule>;
/** A video note's poster, play button and player, when they are here already. */
export declare const mediaNoteNow: () => Pick<typeof MediaNoteModule, "MediaNote"> | null;
/** A video note's poster, play button and player, fetched the first time a note with a video is drawn. */
export declare const loadMediaNote: () => Promise<Pick<typeof MediaNoteModule, "MediaNote">>;
