import { type Workshop } from './model';
export declare function fitLaneLayout(board: Workshop, viewport: number, mapCanvas?: boolean): {
    labels: Map<string, string[]>;
    layout: {
        pitch: number;
        width: number;
        height: number;
        row: number;
        top: number;
    };
};
