import type { Workshop } from './model';
import type { WorkshopLimits } from './launchPlan';
/** Σ amount × chance over open stages, plus every won amount. */
export declare function pipelineForecast(board: Workshop): number;
export declare function validatePipeline(board: Workshop): string | null;
/** Why the deal may not move to that stage; null when it may (or is there already). */
export declare function pipelineRefusal(board: Workshop, cardId: string, laneId: string): string | null;
export declare function planPipelineMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
export declare function pipelineCaption(board: Workshop, laneId: string): string;
export declare function pipelineLimits(_board: Workshop, ref: {
    field: 'amount' | 'target';
}): WorkshopLimits;
export declare function samplePipeline(): Workshop;
