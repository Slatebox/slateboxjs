/**
 * MultiSelection.ts - Rectangle drag selection
 *
 * Provides:
 * - Shift+click: add/remove from selection
 * - Canvas drag: rectangle selection
 * - Visual selection rectangle
 * - Group move/delete operations
 */
export interface MultiSelectionOptions {
    enabled?: boolean;
    selectionColor?: string;
    selectionOpacity?: number;
}
export declare class MultiSelection {
    private slate;
    private options;
    private selectionRect;
    private startPoint;
    private isSelecting;
    constructor(slate: any, options?: MultiSelectionOptions);
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    private bindEvents;
    private unbindEvents;
    private cancelSelection;
    private selectNodesInRect;
    private getSvgPoint;
    /** Delete all selected nodes */
    deleteSelected(): void;
    /** Move all selected nodes by a delta */
    moveSelected(dx: number, dy: number): void;
}
