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
}
/**
 * Export the slate canvas as SVG string.
 */
export declare function exportSVG(slate: any, opts?: ExportOptions, callback?: (svg: string) => void): string;
/**
 * Export the slate canvas as PNG.
 *
 * @returns Promise that resolves with base64 string or Blob
 */
export declare function exportPNG(slate: any, opts?: ExportOptions, callback?: (result: string | Blob) => void): Promise<string | Blob>;
