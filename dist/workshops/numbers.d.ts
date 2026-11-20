/** What a note says, split into its name and the numbers written on it. */
export interface NoteNumbers {
    /** The words without the number. */
    label: string;
    /** Whole days, from "3d" or "3 days". */
    days?: number;
    /** Whole currency units, from "$45k", "€1.2M", "40k" or "45000". */
    amount?: number;
    /** The currency sign written with the amount, when there was one. */
    currency?: string;
}
/** Read the days and the amount written on a note. A plain number counts as an amount only with a sign or k/M. */
export declare function readNoteNumbers(text: string): NoteNumbers;
/** "$45k", "$1.2M", "$320k", "$900": short money for captions and sentences. */
export declare function money(amount: number, currency?: string): string;
/** "1 day", "3 days". */
export declare const days: (n: number) => string;
