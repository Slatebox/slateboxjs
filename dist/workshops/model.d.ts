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
}
export interface Workshop {
    version: 1;
    title: string;
    lanes: WorkshopLane[];
    cards: WorkshopCard[];
}
export declare function validateWorkshop(input: unknown): Workshop;
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
export declare function workshopPositions(board: Workshop): {
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
