/**
 * Export.ts - SVG and PNG export functionality
 *
 * Provides methods to export the slate canvas as SVG or PNG.
 */
export interface ExportOptions {
    /** Exclude the background from export */
    noBackground?: boolean;
    /** Export only the background (no nodes) */
    backgroundOnly?: boolean;
    /** Specific nodes to include (if undefined, all nodes) */
    nodes?: any[];
    /** For PNG: return as base64 string */
    base64?: boolean;
    /** For PNG: return as binary Blob */
    asBinary?: boolean;
    /** For PNG: include alpha transparency */
    alpha?: boolean;
    /** Use data image URLs for embedded images */
    useDataImageUrls?: boolean;
    /** Scale factor for PNG export */
    scale?: number;
    /**
     * The exact box to export, in canvas units (a grid sheet's page): the picture's viewBox is this box, with no
     * padding, instead of the box around the content.
     */
    frame?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** The SVG's printed size, such as `{ width: '8.5in', height: '11in' }`: its width and height attributes. Left out, the frame's size in px. */
    size?: {
        width: string;
        height: string;
    };
}
/**
 * Export the slate canvas as SVG string.
 */
export declare function exportSVG(slate: any, opts?: ExportOptions, callback?: (svg: string) => void): string;
/**
 * A picture drawn from an SVG held in an <img> loads nothing from outside it, so
 * every note's picture (a photo, a video note's poster) is written into the SVG
 * as a data address first. A picture that cannot be read (another site that does
 * not allow it, too large, too slow) is left as it was: the note is still drawn,
 * without that picture.
 */
/** True when the SVG draws a picture from an address (not already a data address). */
export declare function hasOutsidePictures(svgString: string): boolean;
export declare function inlinePictures(svgString: string, fetcher?: typeof fetch | undefined): Promise<string>;
/**
 * Export the slate canvas as PNG.
 *
 * @returns Promise that resolves with base64 string or Blob
 */
export declare function exportPNG(slate: any, opts?: ExportOptions, callback?: (result: string | Blob) => void): Promise<string | Blob>;
