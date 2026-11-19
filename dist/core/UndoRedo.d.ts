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
    private restoreQueue;
    private pendingRestores;
    /** A record is due as soon as the current gesture has made all its changes (see snapAfterGesture). */
    private gestureRecordDue;
    constructor(slate: any, options?: UndoRedoOptions);
    /**
     * Take a snapshot of the current state.
     * Debounced to avoid excessive snapshots during rapid changes.
     *
     * @param init - If true, take immediately without debounce (initial state)
     */
    snap(init?: boolean): void;
    /**
     * Record a step as soon as the current gesture has made all its changes,
     * without the pause that groups a burst of edits into one step.
     *
     * Deleting is one deliberate act: two notes deleted one after the other are
     * two steps, and undo brings back the last one only. (Several selected notes
     * deleted by one key press are still one step: their packages are all sent
     * before this record is taken.)
     */
    snapAfterGesture(): void;
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
    /**
     * Other people's changes were applied to the slate. Snapshots are whole
     * slates, so an undo puts back everything as this person last recorded it:
     * without this, undoing one's own latest step would also take away whatever
     * the others did since that record was made.
     *
     * - After ordinary changes, the current record is brought up to date, so the
     *   next step this person takes is undone back to a slate that still holds
     *   the others' work.
     * - After someone else replaced the whole slate (their undo or redo), every
     *   earlier record describes a slate that no longer exists, and returning to
     *   one would undo their undo and all work since. History starts again here.
     */
    absorbRemote(replaced?: boolean): void;
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
