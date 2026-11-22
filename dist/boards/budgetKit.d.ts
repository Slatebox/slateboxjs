import { type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout } from '../workshops/model';
/** Each team's segment of the envelope, and every note, in board coordinates. */
export declare function budgetLayout(board: Workshop, layout?: WorkshopBoardLayout): {
    parts: PartPlace[];
    width: number;
    height: number;
    segments: {
        laneId: string;
        start: number;
        size: number;
    }[];
    narrow: boolean;
    k: number;
};
export declare const budgetKit: WorkshopBoardKit;
