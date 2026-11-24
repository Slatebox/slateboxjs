import { type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout } from '../workshops/model';
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
