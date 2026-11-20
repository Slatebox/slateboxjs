/**
 * Editor.ts - Text editing integration for nodes
 *
 * Following the isolated class pattern:
 * - Constructor takes node
 * - Has set(), get() methods
 * - Manages text content, font, alignment, and auto text offset
 */
import type { Node } from "./Node";
/** How an inline edit opens. With no options it is the rename gesture: all text selected. */
export interface InlineEditOptions {
    /**
     * "all" (default) selects the existing text so typing replaces it.
     * "end" keeps the text and puts the caret after it, so typing appends.
     */
    caret?: "all" | "end";
    /** Text appended as the edit opens: the key press that started a type-to-edit. */
    insert?: string;
    /** A key that is physically down as the edit opens and should keep auto-repeating into it. */
    heldKey?: string;
    /** Focus without letting the browser scroll (the caller has already put the note in view). */
    preventScroll?: boolean;
    /**
     * The editor's starting text, in place of the note's own text (and `insert`): a
     * draft carried across a load that replaced the note (see {@link draft}).
     */
    text?: string;
    /** Where the caret or selection goes, as offsets into the text. Overrides `caret`. */
    selection?: {
        start: number;
        end: number;
    };
    /**
     * Whether Enter/Escape hand keyboard focus back to the note. Defaults to true only
     * when the note itself had focus as the edit opened, so pointer edits leave focus
     * where it was.
     */
    returnFocus?: boolean;
}
/** An inline edit in progress: what has been typed so far and where the caret is. */
export interface InlineDraft {
    text: string;
    selection: {
        start: number;
        end: number;
    } | null;
    returnFocus: boolean;
}
export declare class Editor {
    private node;
    private _inlineEditing;
    private _inlineFO;
    private _inlineDiv;
    private _returnFocus;
    constructor(node: Node);
    /** Destroy the editor, clearing all references */
    destroy(): void;
    /** Whether an inline (on-canvas) edit is currently active. */
    isInlineEditing(): boolean;
    /**
     * The edit in progress, or null. A load that replaces the slate's notes (an
     * undo or redo by someone else on the slate) destroys this note and its open
     * editor; the slate takes the draft first and opens it again on the note's new
     * copy (Slate.takeInlineDraft), so what the person was typing is not lost.
     */
    draft(): InlineDraft | null;
    /**
     * Start inline (on-canvas) text editing — Miro-style. Overlays a
     * contenteditable box exactly on the node (inside its group so it tracks
     * pan/zoom/position), pre-filled + all-selected. Enter commits, Shift+Enter
     * inserts a newline, Escape cancels, blur commits.
     *
     * Commit routes through collab.invoke + collab.send (the same persist/sync path
     * the drawer uses via onNodeTextChanged), so the edit survives reload and syncs
     * to collaborators. SVG-content nodes (no textElement) are skipped.
     *
     * Opening the editor is local only: nothing is broadcast until a commit changes
     * the text. Returns true when an editor was opened by this call.
     */
    startInline(options?: InlineEditOptions): boolean;
    /** Cancel an in-progress inline edit without saving. */
    cancelInline(): void;
    /**
     * Set text content and properties on the node.
     * This is the primary method used by collaboration events
     * and the text editing pane.
     */
    set(text: string, fontSize?: number, fontFamily?: string, fontColor?: string, opacity?: number, textXAlign?: "left" | "center" | "right", textYAlign?: "top" | "middle" | "bottom"): Promise<void>;
    /**
     * Get current text properties.
     */
    get(): {
        text: string;
        fontSize: number;
        fontFamily: string;
        fontColor: string;
        textOpacity: number;
        textXAlign: string;
        textYAlign: string;
    };
    /**
     * Calculate auto text offset based on node shape and text size.
     */
    calculateAutoOffset(): {
        x: number;
        y: number;
    };
    private applyText;
    private autoResize;
}
