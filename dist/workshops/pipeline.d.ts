import type { Workshop, WorkshopCard } from './model';
import type { BusinessBoardRules, WorkshopLimits } from './kinds';
/** Σ amount × chance over open stages, plus every won amount. */
export declare function pipelineForecast(board: Workshop): number;
export declare function validatePipeline(board: Workshop): string | null;
/** Why the deal may not move to that stage; null when it may (or is there already). */
export declare function pipelineRefusal(board: Workshop, cardId: string, laneId: string): string | null;
export declare function planPipelineMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
export declare function pipelineCaption(board: Workshop, laneId: string): string;
/** Whether a stage holds more deals than its limit (a deal moved anyway): drawn in red. */
export declare function pipelineStageOver(board: Workshop, laneId: string): boolean;
export declare function pipelineLimits(_board: Workshop, ref: {
    field: 'amount' | 'target';
}): WorkshopLimits;
export declare function samplePipeline(): Workshop;
/** The parts a pipeline and a budget share: amounts on cards, read and written the same way. */
export declare const amountRules: {
    readCard(raw: Record<string, unknown>, card: WorkshopCard): void;
    cardText: (board: Workshop, card: WorkshopCard) => string;
    noteText: (board: Workshop, card: WorkshopCard) => string;
    renamed(_board: Workshop, cardId: string, text: string): {
        label: string;
        edits: {
            kind: "set_amount";
            card: {
                id: string;
            };
            amount: number;
        }[];
    };
};
/** The pipeline's part of the one gate (see kinds.ts). */
export declare const pipelineRules: BusinessBoardRules;
