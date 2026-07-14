/**
 * Editor.ts - Text editing integration for nodes
 *
 * Following the isolated class pattern:
 * - Constructor takes node
 * - Has set(), get() methods
 * - Manages text content, font, alignment, and auto text offset
 */
import type { Node } from "./Node";
export declare class Editor {
    private node;
    private _inlineEditing;
    private _inlineFO;
    constructor(node: Node);
    /** Destroy the editor, clearing all references */
    destroy(): void;
    /** Whether an inline (on-canvas) edit is currently active. */
    isInlineEditing(): boolean;
    /**
     * Start inline (on-canvas) text editing — Miro-style. Overlays a
     * contenteditable box exactly on the node (inside its group so it tracks
     * pan/zoom/position), pre-filled + all-selected. Enter commits, Shift+Enter
     * inserts a newline, Escape cancels, blur commits.
     *
     * Commit routes through collab.invoke + collab.send (the same persist/sync path
     * the drawer uses via onNodeTextChanged), so the edit survives reload and syncs
     * to collaborators. SVG-content nodes (no textElement) are skipped.
     */
    startInline(): void;
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
