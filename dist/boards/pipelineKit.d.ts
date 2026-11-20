import { type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout } from '../workshops/model';
/** Where every note of a pipeline goes, in board coordinates. */
export declare function pipelineLayout(board: Workshop, layout?: WorkshopBoardLayout): {
    parts: PartPlace[];
    width: number;
    height: number;
};
export declare const pipelineKit: WorkshopBoardKit;
