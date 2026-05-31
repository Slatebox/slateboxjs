/**
 * Images.ts - Image fill support for nodes
 *
 * Following the isolated class pattern:
 * - Constructor takes node
 * - Has set(), clear() methods
 * - Manages image fills via SVG patterns
 */
export declare class Images {
    private node;
    private patternElement;
    private imageUrl;
    private origWidth;
    private origHeight;
    private preserveAspectRatio;
    constructor(node: any);
    /**
     * Set an image fill on the node's background.
     *
     * Uses SVG pattern fills for proper scaling within the shape.
     */
    set(url: string, width?: number, height?: number, preserveAspectRatio?: boolean): void;
    /**
     * Clear the image fill and restore the background color.
     */
    clear(): void;
    /** Destroy the images instance, clearing all image data */
    destroy(): void;
    /**
     * Update the image (e.g., after resize).
     */
    update(): void;
    /** Check if an image is set */
    hasImage(): boolean;
    private render;
}
