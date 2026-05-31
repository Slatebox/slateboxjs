/**
 * utils.ts - Utility functions matching v1 Slatebox.utils
 *
 * Provides all utility functions used by the app.
 */
/** Generate a unique ID string */
export declare function guid(length?: number): string;
/**
 * Determine whether white or black text has better contrast
 * against the given background color.
 */
export declare function whiteOrBlack(hexColor: string): "#ffffff" | "#000000";
/**
 * Measure the width of text in pixels.
 * Creates a temporary span to measure.
 */
export declare function getTextWidth(text: string, fontStr?: string): number;
/**
 * Get bounding box from an SVG path string.
 * Simple approximation based on path commands.
 */
export declare function getBBox(opts: {
    path: string;
}): {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * Create multi-line text by wrapping at a given number of lines.
 */
export declare function createMultiLineText(text: string, maxWidth: number, fontStr?: string): string[];
/** Generate random integer between min and max (inclusive) */
export declare function randomInt(min: number, max: number): number;
/**
 * Calculate proportionate width and height for resizing,
 * preserving aspect ratio.
 */
export declare function obtainProportionateWidthAndHeightForResizing(originalWidth: number, originalHeight: number, targetWidth: number, targetHeight: number, preserveAspectRatio?: boolean): {
    width: number;
    height: number;
};
/**
 * Build node style from a theme definition.
 */
export declare function buildNodeStyleFromTheme(opts: {
    theme: any;
    childNumber: number;
}): any;
/** Make a string safe for use in URLs */
export declare function safeForUrls(str: string): string;
/** Check if value is a DOM element */
export declare function isElement(obj: any): boolean;
/** Shorthand for document.getElementById */
export declare function el(id: string): HTMLElement | null;
/** Detect Safari browser */
export declare function isSafari(): boolean;
/** Detect mobile device */
export declare function isMobile(): boolean;
/** Stop event propagation and prevent default */
export declare function stopEvent(evt: Event): void;
/** Split an array into chunks of a given size */
export declare function chunk<T>(arr: T[], size: number): T[][];
