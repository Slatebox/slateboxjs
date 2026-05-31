/**
 * Editor.ts - Text editing integration for nodes
 *
 * Following the isolated class pattern:
 * - Constructor takes node
 * - Has set(), get() methods
 * - Manages text content, font, alignment, and auto text offset
 */
export declare class Editor {
    private node;
    constructor(node: any);
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
