/**
 * FontLoader.ts - Google Fonts loading on demand
 *
 * Loads fonts from Google Fonts API, caches loaded fonts,
 * and provides a method to scan all nodes and load unique fonts.
 */
/**
 * Load a single Google Font by name.
 * Idempotent — won't reload already-loaded fonts.
 */
export declare function loadFont(fontFamily: string): Promise<void>;
/**
 * Scan all nodes in a slate and load any unique fonts.
 */
export declare function loadAllFonts(slate: any): Promise<void>;
/** Check if a font has been loaded */
export declare function isFontLoaded(fontFamily: string): boolean;
