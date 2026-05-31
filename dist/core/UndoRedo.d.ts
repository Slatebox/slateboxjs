/**
 * UndoRedo.ts - Snapshot-based undo/redo system
 *
 * Takes full JSON snapshots of the slate state.
 * Uses a 3-second debounce before saving snapshots.
 */
export interface UndoRedoOptions {
    enabled?: boolean;
    maxHistory?: number;
    debounceMs?: number;
}
export declare class UndoRedo {
    private slate;
    private options;
    private undoStack;
    private redoStack;
    private debounceTimer;
    private isRestoring;
    constructor(slate: any, options?: UndoRedoOptions);
    /**
     * Take a snapshot of the current state.
     * Debounced to avoid excessive snapshots during rapid changes.
     *
     * @param init - If true, take immediately without debounce (initial state)
     */
    snap(init?: boolean): void;
    /**
     * Take an immediate snapshot, bypassing the debounce timer.
     * Useful for programmatic undo/redo sequences where you need
     * guaranteed snapshot state right now (e.g., tests, scripts).
     */
    forceSnapshot(): void;
    /**
     * Undo the last change. Restores the previous snapshot.
     */
    undo(): boolean;
    /**
     * Redo the last undone change.
     */
    redo(): boolean;
    /** Check if undo is available */
    canUndo(): boolean;
    /** Check if redo is available */
    canRedo(): boolean;
    /** Clear all history */
    clear(): void;
    /** Destroy the undo/redo system, clearing all history and references */
    destroy(): void;
    private takeSnapshot;
    private restore;
}
