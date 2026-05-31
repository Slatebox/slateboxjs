/**
 * Grid.ts - Grid overlay and snap-to-grid functionality
 */
export interface GridOptions {
    enabled?: boolean;
    gridSize?: number;
    gridColor?: string;
    gridOpacity?: number;
    snapToGrid?: boolean;
    snapToObjects?: boolean;
}
export declare class Grid {
    private slate;
    private options;
    private gridGroup;
    private isVisible;
    constructor(slate: any, options?: GridOptions);
    /** Show the grid overlay */
    show(): void;
    /** Hide the grid overlay */
    hide(): void;
    /** Destroy the grid and clean up */
    destroy(): void;
    /** Toggle grid visibility */
    toggle(): void;
    /** Check if grid is currently visible */
    isShown(): boolean;
    /** Snap a coordinate to the nearest grid point */
    snapPoint(x: number, y: number): {
        x: number;
        y: number;
    };
    /** Update grid options */
    updateOptions(options: Partial<GridOptions>): void;
    private render;
}
