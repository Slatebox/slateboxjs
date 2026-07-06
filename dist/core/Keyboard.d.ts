/**
 * Keyboard.ts - Global keyboard bindings
 *
 * Provides keyboard shortcuts for common actions:
 * - Delete/Backspace: remove selected nodes
 * - Ctrl+Z / Cmd+Z: undo
 * - Ctrl+Y / Cmd+Shift+Z: redo
 * - Ctrl+A / Cmd+A: select all
 * - Ctrl+C / Ctrl+V: copy / paste selected nodes
 * - Ctrl+D: duplicate selected nodes in place (offset)
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
    private clipboard;
    private nudgeTimer;
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
    /**
     * A serializable snapshot of a node's paintable options — enough to recreate
     * it, minus identity (id) and relationship arrays (which reference the OLD node
     * ids and would create dangling connections on a copy).
     */
    private snapshotNode;
    /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
    private copySelected;
    /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
    private pasteClipboard;
    /** Ctrl/Cmd+D — duplicate the current selection in place (offset). */
    private duplicateSelected;
    /**
     * Create fresh nodes from option snapshots, offset by (offset,offset) and each
     * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
     * so copies persist + sync to collab peers like any other added node.
     */
    private createCopies;
    private nudge;
    private handleArrowKey;
    private selectFocused;
}
