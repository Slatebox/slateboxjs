export * from './offlineHandoff';
export * from './listeningRoom';
export { releaseLoad, releasePlan } from './release';
import type { SlateJSON } from '../core/Serialization';
export interface WorkshopLane {
    id: string;
    label: string;
    capacity?: number;
    station?: {
        column: number;
        row: number;
        next: string[];
        outcome: string;
    };
}
export interface WorkshopCard {
    id: string;
    label: string;
    laneId: string;
    allowedLaneIds?: string[];
    points?: number;
    dependsOn?: string[];
}
export interface Workshop {
    version: 1;
    kind?: 'release-plan';
    title: string;
    lanes: WorkshopLane[];
    /** Lane IDs in playback order. Boards without an authored order present their lanes in layout order. */
    presentationOrder?: string[];
    cards: WorkshopCard[];
}
/** Resolve the original lanes for playback without changing their board positions or rules. */
export declare function workshopPresentationLanes({ lanes, presentationOrder }: Pick<Workshop, 'lanes' | 'presentationOrder'>): WorkshopLane[];
export interface WorkshopPresentationScene {
    lane: WorkshopLane;
    cards: WorkshopCard[];
    /** Native node IDs for this viewpoint in the artwork produced by workshopToSlate. */
    nodeIds: string[];
}
/** Describe each authored viewpoint from the committed state, including empty lanes. */
export declare function workshopPresentationScenes(board: Workshop): WorkshopPresentationScene[];
export declare function validateWorkshop(input: unknown): Workshop;
/** Build the fragment for /new/workshop from portable workshop data. */
export declare function encodeWorkshopFragment(value: Workshop): string;
/** Read location.hash before creating a slate. Only the validated model is imported. */
export declare function decodeWorkshopFragment(fragment: string): Workshop;
export declare function availableLanes(board: Workshop, card: WorkshopCard): WorkshopLane[];
export declare function moveWorkshopCard(board: Workshop, cardId: string, laneId: string): Workshop;
export declare const workshopLayout: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
};
export declare const laneColors: string[];
export declare function workshopPositions(board: Workshop, layout?: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
}): {
    points: {
        x: number;
        y: number;
    }[];
    width: number;
    height: number;
};
export declare const nightTransfer: Workshop;
export declare function workshopToSlate(input: Workshop): SlateJSON;
export declare const industrialWorkshop: Workshop;
export * from './moonGallery';
export * from './darkroom/model';
