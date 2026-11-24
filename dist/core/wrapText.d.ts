/**
 * A note's words laid out in lines (Miro-style autofit): words wrap between words at the note's
 * width; a word too wide for the line is never cut into letters when shrinking the text can fit it.
 *
 * - A word up to twice the line's width stays whole: the text shrinks to fit it (fitTextToNode).
 * - A longer token with break points (a URL or path: / . - _ ? & = #) breaks after them, as a
 *   browser would, without a space between its pieces.
 * - A longer plain word stays whole down to the shrink floor (0.3, the same floor fitTextToNode uses).
 * - Only a word too wide even at the floor (a long code or hash) is cut into letters, at the line's
 *   width, as before.
 *
 * When a word stays whole the lines are wrapped at the wider width the shrunk text will fill
 * (`width / scale`), so the shrunk text uses the note's whole width, and `scale` says by how much
 * the text will shrink, so the note can grow only as tall as the shrunk text needs.
 */
export declare const SHRINK_FLOOR = 0.3;
export declare const SOFT_FLOOR = 0.5;
export interface WrappedText {
    text: string;
    lines: string[];
    /** How much the text must shrink for the widest line to fit (1 = not at all). */
    scale: number;
}
export declare function wrapWords(text: string, maxWidth: number, measure: (s: string) => number): WrappedText;
