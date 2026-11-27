/**
 * Slate keys: name, description and background. The background is one shape
 * for every applier: {color, gradient? | picture?}. It is stored in the
 * containerStyle fields Slate.applyContainerStyle paints, and the live applier
 * sends it as the onSlateBackgroundColorChanged package that sets those same
 * fields. A slate that wears a style keeps its background in the style's record
 * too (overrides.bg and overrides.background), so the host's "Revert to
 * original" and a style worn again keep or restore it.
 */
import { type ValueSpec } from "./values";
export declare const GRADIENT_TYPES: readonly ["linear", "radial"];
export declare const GRADIENT_DIRECTIONS: readonly ["horizontal", "vertical", "diagonal"];
/** How a background picture fills the canvas: cover (fills, cropped), contain (whole, centred), repeat (tiled). */
export declare const PICTURE_FITS: readonly ["cover", "contain", "repeat"];
/** The most a picture is dimmed (laid under the background colour), so it never disappears. */
export declare const PICTURE_DIM_MAX = 0.8;
export interface Background {
    color: string;
    gradient?: {
        type: (typeof GRADIENT_TYPES)[number];
        colors: string[];
        direction?: (typeof GRADIENT_DIRECTIONS)[number];
        angle?: number;
    };
    picture?: {
        url: string;
        fit?: (typeof PICTURE_FITS)[number];
        dim?: number;
    };
}
/**
 * A picture a background may show: an https address, or a path on this app (a file it stored,
 * /files/... or /sbimages/...). Never http, data:, javascript: or another scheme, never a path
 * that climbs (..) or starts another host (//), and nothing that could end a CSS url().
 */
export declare const PICTURE_URL: RegExp;
export declare const PICTURE_URL_MAX_LENGTH = 2000;
export declare function isPictureUrl(value: unknown): value is string;
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
/** A background picture: {url, fit?, dim?}. */
export declare function checkPicture(picture: any, label: string): string[];
/**
 * A style record ({id, overrides?, v?}, or null to take the style off). The engine does not know
 * the styles (they are the host's data); it checks the record's shape: an id, colors that are
 * colors, a palette of 1 to 12 colors (a "from-to" pair is a two-stop gradient), fonts the
 * instance offers.
 */
export declare function checkStyle(value: any, label: string, fonts: readonly string[]): string[];
/**
 * The containerStyle fields a background sets. Every field is written (undefined where the
 * background has none), so a picture replaces a gradient and a color replaces both.
 */
export declare function backgroundToContainerStyle(background: Background): Record<string, any>;
/** The part of a background a style's record keeps beside its color (overrides.background); null for a plain color. */
export declare function backgroundOverride(background: Background): Record<string, any> | null;
/** The style record's schema (null takes the style off). */
export declare function styleSchema(): Record<string, any>;
export declare function backgroundSchema(): Record<string, any>;
/** The background a stored containerStyle paints, in the shape update_slate takes; null when none is stored. */
export declare function backgroundOf(style: Record<string, any> | undefined): Background | null;
