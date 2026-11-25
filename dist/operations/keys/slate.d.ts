/**
 * Slate keys: name, description and background. The background is one shape
 * for every applier: {color, gradient?}. It is stored in the containerStyle
 * fields Slate.applyContainerStyle paints, and the live applier sends it as
 * the onSlateBackgroundColorChanged package that sets those same fields.
 */
import { type ValueSpec } from "./values";
export declare const GRADIENT_TYPES: readonly ["linear", "radial"];
export declare const GRADIENT_DIRECTIONS: readonly ["horizontal", "vertical", "diagonal"];
export interface Background {
    color: string;
    gradient?: {
        type: (typeof GRADIENT_TYPES)[number];
        colors: string[];
        direction?: (typeof GRADIENT_DIRECTIONS)[number];
    };
}
export interface SlateKey {
    spec: ValueSpec;
    description: string;
    /** Write the (already valid) value into the stored slate. */
    store: (slate: {
        options: Record<string, any>;
        nodes: Array<{
            options: Record<string, any>;
            relationships: {
                associations: Record<string, any>[];
            };
        }>;
    }, value: any) => void;
}
/**
 * Slate keys, in the order a change is applied and sent. The settings are
 * stored where the canvas reads them (Slate.options, options.viewPort), as the
 * Settings and Colours panels store them.
 */
export declare const SLATE_KEYS: Record<string, SlateKey>;
export declare function checkBackground(value: any, label: string): string[];
/**
 * A style record ({id, overrides?, v?}, or null to take the style off). The engine does not know
 * the styles (they are the host's data); it checks the record's shape: an id, colors that are
 * colors, a palette of 1 to 12 colors (a "from-to" pair is a two-stop gradient), fonts the
 * instance offers.
 */
export declare function checkStyle(value: any, label: string, fonts: readonly string[]): string[];
/** The containerStyle fields a background sets. */
export declare function backgroundToContainerStyle(background: Background): Record<string, any>;
/** The style record's schema (null takes the style off). */
export declare function styleSchema(): Record<string, any>;
export declare function backgroundSchema(): Record<string, any>;
/** The background a stored containerStyle paints, in the shape update_slate takes; null when none is stored. */
export declare function backgroundOf(style: Record<string, any> | undefined): Background | null;
