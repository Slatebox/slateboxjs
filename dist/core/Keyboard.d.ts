/**
 * Keyboard.ts - Global keyboard bindings
 *
 * Provides keyboard shortcuts for common actions:
 * - Delete/Backspace: remove selected nodes
 * - Ctrl+Z / Cmd+Z: undo
 * - Ctrl+Y / Cmd+Shift+Z: redo
 * - Ctrl+A / Cmd+A: select all
 * - Arrow keys: nudge selected nodes
 * - Escape: deselect all
 */
export interface KeyboardOptions {
    enabled?: boolean;
    nudgeDistance?: number;
}
export declare class Keyboard {
    private slate;
    private options;
    private boundHandler;
    constructor(slate: any, options?: KeyboardOptions);
    /** Bind global keyboard shortcuts */
    bindGlobal(): void;
    /** Unbind global keyboard shortcuts */
    unbindGlobal(): void;
    /** Enable keyboard shortcuts */
    enable(): void;
    /** Disable keyboard shortcuts (keeps bindings, ignores events) */
    disable(): void;
    private handleKeyDown;
    private deleteSelected;
    private undo;
    private redo;
    private selectAll;
    private deselect;
    private nudge;
}
