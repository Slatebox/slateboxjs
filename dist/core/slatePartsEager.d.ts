import { startLineTool } from './LineTool';
import { BirdsEye } from './BirdsEye';
import { UndoRedo } from './UndoRedo';
import { MediaInput } from './MediaInput';
import { ContextMenu } from './ContextMenu';
import { Keyboard } from './Keyboard';
import { Presentation } from './Presentation';
import { MediaNote } from './MediaNote';
export declare const partsBuiltIn = true;
export declare const lineToolNow: () => {
    startLineTool: typeof startLineTool;
};
export declare const loadLineTool: () => Promise<{
    startLineTool: typeof startLineTool;
}>;
export declare const birdsEyeNow: () => {
    BirdsEye: typeof BirdsEye;
};
export declare const loadBirdsEye: () => Promise<{
    BirdsEye: typeof BirdsEye;
}>;
export declare const undoRedoNow: () => {
    UndoRedo: typeof UndoRedo;
};
export declare const loadUndoRedo: () => Promise<{
    UndoRedo: typeof UndoRedo;
}>;
export declare const mediaInputNow: () => {
    MediaInput: typeof MediaInput;
};
export declare const loadMediaInput: () => Promise<{
    MediaInput: typeof MediaInput;
}>;
export declare const contextMenuNow: () => {
    ContextMenu: typeof ContextMenu;
};
export declare const loadContextMenu: () => Promise<{
    ContextMenu: typeof ContextMenu;
}>;
export declare const keyboardNow: () => {
    Keyboard: typeof Keyboard;
};
export declare const loadKeyboard: () => Promise<{
    Keyboard: typeof Keyboard;
}>;
export declare const presentationNow: () => {
    Presentation: typeof Presentation;
};
export declare const loadPresentation: () => Promise<{
    Presentation: typeof Presentation;
}>;
export declare const mediaNoteNow: () => {
    MediaNote: typeof MediaNote;
};
export declare const loadMediaNote: () => Promise<{
    MediaNote: typeof MediaNote;
}>;
