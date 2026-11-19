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
 * - Enter, or simply typing, with one note selected: edit its text on the canvas
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
    private clipboardEdges;
    private pasteCount;
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
    /** What may be done to `node` (everything, unless a host policy governs it). */
    private caps;
    /** Whether a host policy governs `node`. */
    private governed;
    /** Give a key to the policy of the single selected governed note. True when it handled the key. */
    private offerKeyToPolicy;
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
    /**
     * Capture the connectors whose BOTH endpoints are within `nodes` — the internal
     * edges of a selection. Duplicating/pasting a connected group must recreate these
     * between the copies (Miro parity), or the copies come out disconnected.
     */
    private internalEdges;
    /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
    private copySelected;
    /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
    private pasteClipboard;
    /** Ctrl/Cmd+] — bring the selected node(s) to the front of the z-order. */
    private bringToFront;
    /** Ctrl/Cmd+[ — send the selected node(s) to the back of the z-order. */
    private sendToBack;
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
    /** Surfaces that keep every key pressed inside them, Ctrl/Cmd shortcuts included. */
    private static readonly MODAL_SURFACES;
    /** A key press that produces one character of text, with no Ctrl/Cmd/Alt chord. */
    private static isTypingKey;
    /**
     * Type-to-edit: with exactly one editable note selected and no editor open, a
     * character key opens the note's editor with the caret after its existing text and
     * types that character there. It appends; it never replaces what the note says.
     *
     * Returns false (leaving the key to its existing meaning) for read-only and
     * comment-only viewers, locked notes, comments, artwork and multi-selections, and
     * whenever keyboard focus is on some other control of the canvas.
     */
    private typeIntoSelected;
    /**
     * If exactly one node is selected, begin inline text editing on it.
     * Returns true when it started an edit (so callers can stop falling through).
     * Skips SVG-content nodes (they have no editable text).
     */
    private startInlineEditSelected;
}
