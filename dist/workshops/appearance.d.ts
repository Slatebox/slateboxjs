/** The palette a column takes a color from: soft fills that keep dark words readable (the cards' own named colors). */
export declare const appearancePalette: Record<string, string>;
/** A 2 by 2's quadrants, by the key its parts are named with (column-q-do-now), and what they are called. */
export declare const appearanceQuadrants: Record<string, string>;
export interface WorkshopAppearance {
    /** The columns' outlines (normal when left out). */
    borders?: 'subtle' | 'strong';
    /** The column headers: subtle is quieter, strong is bold with a deeper fill. */
    headers?: 'subtle' | 'strong';
    headerSize?: 'large';
    /** The columns' fills: soft is paler, strong deeper. */
    fill?: 'soft' | 'strong';
    /** Grid lines: dark lines between the columns (a 2 by 2's quadrant lines). */
    lines?: true;
    density?: 'compact';
    /** A column's color from the palette, by lane id (on a 2 by 2, also a quadrant's key, q-do-now). */
    colors?: Record<string, string>;
}
/** A board's appearance, checked. A color for a column that is gone is dropped; anything unknown is left out. */
export declare function readAppearance(input: unknown, keys: string[]): WorkshopAppearance | undefined;
/** The keys a board's colors may name: its lanes, and on a 2 by 2 its quadrants. */
export declare function appearanceKeys(board: {
    lanes: {
        id: string;
    }[];
    kind?: string;
    nest?: {
        layout?: string;
    };
}): string[];
/** Blend a #rrggbb color toward white (amount > 0) or black (amount < 0); anything else is kept. */
export declare function blend(color: string | undefined, amount: number): string | undefined;
/** The look of one drawn part that an appearance changes. */
export interface AppearanceLook {
    fill?: string;
    line?: string;
    lineWidth?: number;
    fontSize?: number;
    weight?: 'bold';
    height?: number;
}
/**
 * One part's look under a board's appearance, by the part's name (column-, lane-, caption-, card-, unscoped). The same
 * for a board of columns (workshopToSlate) and every kit's parts (partNotes), so every kind of board takes it alike.
 */
export declare function appearanceLook(appearance: WorkshopAppearance | undefined, name: string, look: AppearanceLook): AppearanceLook;
/** The set_appearance edit's fields (edits.ts): emphasis sets borders, headers and fills together; the rest each set one. */
export interface AppearanceEdit {
    emphasis?: 'subtle' | 'normal' | 'strong';
    borders?: 'subtle' | 'normal' | 'strong';
    headers?: 'subtle' | 'normal' | 'strong';
    headerSize?: 'normal' | 'large';
    fill?: 'soft' | 'normal' | 'strong';
    lines?: boolean;
    density?: 'normal' | 'compact';
    color?: string;
}
/**
 * The board with an appearance edit made, and what to tell the person. `part` is the column (or quadrant) a color is for:
 * its key and what it is called. Nothing else on the board changes.
 */
export declare function withAppearance<T extends {
    appearance?: WorkshopAppearance;
}>(board: T, edit: AppearanceEdit, part?: {
    key: string;
    label: string;
}): {
    board: T;
    said: string;
    changed: boolean;
};
/** The set_appearance edits that make `before`'s look `after`'s (a whole save of a business board said as its edits). */
export declare function appearanceEditsBetween(before: {
    appearance?: WorkshopAppearance;
}, after: {
    appearance?: WorkshopAppearance;
}): (AppearanceEdit & {
    kind: 'set_appearance';
    lane?: {
        id: string;
    };
})[];
/**
 * What the board's chips say of its look (ruleControls.ts lays them out): Look, Cards and Lines for the rail, and for each
 * column (or a 2 by 2's quadrant) its swatch, each with the set_appearance edit a press makes and what that press makes.
 */
export declare function appearanceChips(board: {
    appearance?: WorkshopAppearance;
    lanes: {
        id: string;
        label: string;
    }[];
    nest?: {
        layout?: string;
    };
}, keys: string[]): {
    rail: {
        id: string;
        label: string;
        on: boolean;
        said: string;
        edit: {
            emphasis?: "subtle" | "normal" | "strong";
            borders?: "subtle" | "normal" | "strong";
            headers?: "subtle" | "normal" | "strong";
            headerSize?: "normal" | "large";
            fill?: "soft" | "normal" | "strong";
            lines?: boolean;
            density?: "normal" | "compact";
            color?: string;
            kind: string;
        };
    }[];
    swatches: {
        key: string;
        now: string | null;
        swatch: string;
        sentence: string;
        said: string;
        edit: {
            kind: string;
            lane: {
                id: string;
            };
            color: string;
        };
    }[];
};
