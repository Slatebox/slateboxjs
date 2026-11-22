import { type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout } from '../workshops/model';
/** Where every note of a pipeline goes, in board coordinates. */
export declare function pipelineLayout(board: Workshop, layout?: WorkshopBoardLayout): {
    parts: PartPlace[];
    width: number;
    height: number;
};
/** The target moves in steps of about a hundredth of the gauge: $1k, $5k, $10k, $50k, … */
export declare function targetStep(scale: number): number;
export declare const pipelineKit: WorkshopBoardKit;
