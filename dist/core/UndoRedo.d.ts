/**
 * UndoRedo.ts - Snapshot-based undo/redo system
 *
 * Takes full JSON snapshots of the slate state.
 * Uses a 3-second debounce before saving snapshots.
 */
import { type SlateJSON } from "./Serialization";
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
    /**
     * What the slate's host policies kept with each record (see DragPolicy.undoState),
     * index for index with undoStack and redoStack.
     */
    private undoHost;
    private redoHost;
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
     * Record a change still waiting for its pause (or its gesture) now, as a step of
     * its own. Nothing happens when nothing is waiting.
     */
    flushPending(): void;
    /** Bring what the host keeps with the current record up to date (see Slate.beginHostStep). */
    refreshHostState(): void;
    /**
     * Undo the last change. Restores the previous snapshot.
     */
    undo(): boolean;
    /**
     * Redo the last undone change.
     */
    redo(): boolean;
    /**
     * The slate as it is now, taken just before other people's changes are
     * applied to it; pass it to {@link absorbRemote} once they have been. Null
     * when this slate keeps no history.
     */
    beforeRemote(): SlateJSON | null;
    /**
     * Other people's changes were applied to the slate (ordinary edits, or a
     * whole-slate replacement from their undo or redo). Records are whole slates,
     * so going back to one would put back the slate as this person recorded it and
     * take away everything the others did since, however long ago this person's
     * own step was. Their change is therefore carried into every record, undo and
     * redo alike: an undo then takes back only this person's own step.
     *
     * @param before - the slate just before those changes (see {@link beforeRemote})
     */
    absorbRemote(before?: SlateJSON | null): void;
    /** Check if undo is available */
    canUndo(): boolean;
    /** Check if redo is available */
    canRedo(): boolean;
    /** Clear all history */
    clear(): void;
    /** Destroy the undo/redo system, clearing all history and references */
    destroy(): void;
    private takeSnapshot;
    /** What the slate's host policies keep with a record taken now. */
    private hostState;
    /** The ids of the ordinary notes a slate document holds. */
    private static noteIds;
    private restore;
}
