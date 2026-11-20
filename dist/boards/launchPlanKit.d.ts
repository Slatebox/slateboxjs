import { type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type PartPlace } from '../workshops/model';
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
export declare const launchPlanKit: WorkshopBoardKit;
