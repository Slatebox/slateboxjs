/**
 * A name in curly quotes, as every reply and refusal writes it. Curly quotes inside the name
 * become straight ones, so a name cannot close its quotes early and pass its own words off as
 * the sentence's (a label is anyone's text, and these sentences reach agents too).
 */
export declare const said: (text: string) => string;
/** “A”, “A and B”, “A, B and C”. */
export declare const listed: (names: string[]) => string;
/** The text without the quotes around it. */
export declare const unquoted: (text: string) => string;
/** The name a person gave something: without the sentence's full stop or the quotes around it. */
export declare const named: (text: string) => string;
/** A number written as digits or a word (“two”, “a”, “a single”). */
export declare const countWord: (text: string) => number;
/** Words that point at the selection instead of naming something. */
export declare const pointing: RegExp;
interface Named {
    id: string;
    label: string;
}
/** Why a reference picked nothing, or more than one thing. */
export declare class WorkshopReferenceError extends Error {
    readonly reason: 'unknown' | 'ambiguous' | 'no-selection';
    readonly candidates: string[];
    /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
    constructor(message: string, reason: 'unknown' | 'ambiguous' | 'no-selection', candidates?: string[]);
}
export interface WorkshopFinder<T> {
    /** The one item a reference names. Throws a WorkshopReferenceError, whose message is a sentence for the person, when it names none or several. */
    find(reference: string): T;
    /** The same, or null. */
    attempt(reference: string): T | null;
    /** How exactly the reference names something: 0 for its whole name, more for a looser reading, Infinity for nothing. */
    rank(reference: string): number;
}
/**
 * Look items up by what a person called them. `noun` is a pattern of the words for them
 * (“lanes?|columns?”), `what` the word the replies use (“lane”). `ordered` items can also be
 * named by their place in the row.
 */
export declare function workshopFinder<T extends Named>(items: T[], noun: string, what: string, selectedId?: string, ordered?: boolean): WorkshopFinder<T>;
export {};
