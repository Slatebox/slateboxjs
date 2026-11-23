/**
 * Theme.ts - Theme system for applying visual styles to slates
 *
 * A theme contains a parent style and up to N child styles.
 * When applied, nodes cycle through child styles based on their index.
 */
export interface ThemeStyle {
    image?: string;
    backgroundColor?: string;
    nodeColor?: string;
    opacity?: number;
    borderOpacity?: number;
    borderColor?: string;
    borderStyle?: "solid" | "dashed" | "dotted" | "-" | "." | "--." | "combo";
    borderWidth?: number;
    fontColor?: string;
    foregroundColor?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    textOpacity?: number;
    lineColor?: string;
    lineOpacity?: number;
    lineEffect?: string;
    lineWidth?: number;
    filters?: {
        vect?: string | null;
        text?: string | null;
        line?: string | null;
    };
    vectorPath?: string;
    shape?: string;
    /** With a custom vectorPath: how its sub-paths fill (holes need evenodd). */
    fillRule?: "nonzero" | "evenodd";
    /** With a custom vectorPath: where text sits (slateboxjs/shapes shapeTextBox). */
    textBox?: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
}
export interface ThemeDefinition {
    _id?: string;
    name?: string;
    description?: string;
    containerStyle?: {
        backgroundColor?: string;
        backgroundColorAsGradient?: boolean;
        backgroundGradientColors?: string[];
        backgroundGradientType?: string;
        backgroundImage?: string;
        backgroundSize?: string;
    };
    defaultLineColor?: string;
    styles?: {
        parent?: ThemeStyle;
        [key: string]: ThemeStyle | undefined;
    };
}
/**
 * Apply a theme to a slate. Updates node styles based on theme definitions.
 *
 * @param slate - The Slate instance
 * @param theme - Theme definition
 * @param syncWithTheme - If true, persist theme sync setting
 * @param revertTheme - If true, revert to pre-theme styles (not implemented yet)
 */
export declare function applyTheme(slate: any, theme: ThemeDefinition, syncWithTheme?: boolean, revertTheme?: boolean): void;
/**
 * Build node style from theme based on child number.
 * The first node uses parent style, subsequent nodes cycle through child_1, child_2, etc.
 */
export declare function buildNodeStyleFromTheme(theme: ThemeDefinition, childNumber: number): ThemeStyle | null;
export declare function applyStyleToNode(node: any, style: ThemeStyle): void;
