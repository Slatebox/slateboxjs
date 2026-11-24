import { type WorkshopCard } from '../workshops/model';
/** A card's words with its move-anyway mark under them ("Moved anyway by Sam · 23 Nov"), when it was moved anyway. */
export declare function withMark(text: string, card: Pick<WorkshopCard, 'override'>): string;
/** What a lane over its limit or its money is drawn in: a pale red, edged in the refusal colour. */
export declare const overInk: {
    fill: string;
    line: string;
    ink: string;
};
/** Blend a #rrggbb colour toward white. */
export declare function tint(hex: string, amount: number): string;
