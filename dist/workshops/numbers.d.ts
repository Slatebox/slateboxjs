/** What a note says, split into its name and the numbers written on it. */
export interface NoteNumbers {
    /** The words without the number. */
    label: string;
    /** Whole days, from "3d" or "3 days" (part of a day is a whole one), or weeks of five days ("2w", "6 weeks"). */
    days?: number;
    /** Whole currency units, from "$45k", "€1.2M", "40k" or "45000". */
    amount?: number;
    /** The currency sign written with the amount, when there was one. */
    currency?: string;
}
/**
 * Read the days and the amount written on a note. A plain number counts as an amount only with
 * a sign or k/M, or from 1000 up; a number with a sign or k/M wins over a bare one, so
 * "2026 offsite $12k" is $12k for "2026 offsite".
 */
export declare function readNoteNumbers(text: string): NoteNumbers;
/** "$45k", "$1.2M", "$320k", "$900": short money for captions and sentences. */
export declare function money(amount: number, currency?: string): string;
/** "1 day", "3 days". */
export declare const days: (n: number) => string;
/** The bounds every amount keeps, and their sentences. */
export declare const amountLimits: {
    field: string;
    min: number;
    max: number;
    reasons: {
        min: string;
        max: string;
    };
};
/** A note's words as a card's name and number, or why they can't be one. */
export declare function noteNumbers(text: string): NoteNumbers | string;
/** A card's new words: its name without the number typed on it, and that number. */
export declare function renamedNumbers(text: string): NoteNumbers;
/** The next free card id on a board: card-1, card-2… */
export declare function nextCardId(board: {
    lanes: {
        id: string;
    }[];
    cards: {
        id: string;
    }[];
}): string;
/** A whole (or, with `fraction`, any) number from `low` to `high`, or the sentence `why`. */
export declare function amountOf(value: unknown, low: number, high: number, why: string, fraction?: boolean): number;
/** A currency sign ($ € £ ¥ ₹) or a three-letter code and a space. */
export declare function currencyOf(value: unknown): string;
/** A board's own object field (its launch, forecast or budget), or the sentence when it is missing. */
export declare function ownField(raw: Record<string, unknown>, key: string, missing: string): Record<string, unknown>;
