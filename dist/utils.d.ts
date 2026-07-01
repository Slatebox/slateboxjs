/**
 * utils.ts - Utility functions matching v1 Slatebox.utils
 *
 * Provides all utility functions used by the app.
 */
/** Generate a unique ID string */
export declare function guid(length?: number): string;
/**
 * Determine whether white or black text has better contrast against the
 * given background color. Uses the v1 WCAG relative-luminance contrast
 * algorithm so drop-in results match the original library exactly.
 */
export declare function whiteOrBlack(hexColor: string): "#ffffff" | "#000000";
/**
 * Measure text dimensions — v1 contract: font string is
 * `"<style> <size>pt <family>"` and the result is `{width, height}`
 * (multi-line aware; height accumulates per line).
 */
export declare function getTextWidth(text: string, font?: string): {
    width: number;
    height: number;
};
/**
 * Get the bounding box of an SVG path string — v1 contract: Raphael-style
 * bbox `{x, y, x2, y2, width, height, cx, cy}` computed analytically
 * (curves included), no DOM required.
 */
export declare function getBBox(opts: {
    path: string;
}): {
    x: number;
    y: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    cx: number;
    cy: number;
};
/**
 * v1: `Slatebox.utils._transformPath(path, transform)` — apply a Raphael
 * transform string (`t/T`, `s/S`, `r/R`, `m/M`) to a path, returning the
 * curve-ified transformed path string. Scale/rotate without explicit
 * centers pivot on the path's bounding-box center, exactly like Raphael.
 */
export declare function _transformPath(path: string, transform: string): string;
/**
 * Create multi-line text by wrapping at a given number of lines.
 */
export declare function createMultiLineText(text: string, lineCount: number): string;
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
