import { type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type PartPlace, type WorkshopEdit } from '../workshops/model';
export interface LaunchGeometry {
    parts: PartPlace[];
    width: number;
    height: number;
    narrow: boolean;
    /** Where day 0 is, and how wide a day is. */
    x0: number;
    dayW: number;
    /** Top of the day grid, and of the axis labels. */
    gridTop: number;
    axisY: number;
    bars: Map<string, {
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
}
/** Where every note of a launch plan goes, in board coordinates. The native notes and Dragology both read it. */
export declare function launchLayout(board: Workshop, layout?: WorkshopBoardLayout): LaunchGeometry;
/** How wide a phone task's words are drawn (13px; the layer measures nothing, so a generous average glyph). */
export declare const phoneWordsWidth: (words: string, bold?: boolean) => number;
export declare const launchPlanKit: WorkshopBoardKit;
/**
 * Where a set_task made anyway takes its task, in words (the "Move anyway?" dialog's title): "to start Tue 1 Dec", "to
 * end Mon 28 Dec" when only its days change, and on a hiring plan the day the hire starts work, as the board says it
 * ("to start work Mon 15 Feb (recruiting from Mon 21 Dec)").
 */
export declare function taskWords(board: Workshop, edit: WorkshopEdit): string | undefined;
