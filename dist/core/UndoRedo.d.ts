/**
 * UndoRedo.ts - One person's undo and redo history on a slate.
 *
 * Records are whole slates, taken once each step of this person's own is done: a
 * gesture (a drag, a resize, a rotation) is one step however many packages it sends, a
 * burst of other edits is grouped by a short pause, and a delete or a text edit is a
 * step of its own. Other people's changes are carried into every record
 * (absorbRemote), so an undo takes back only this person's own steps.
 *
 * A host keeps state beside the drawing (a board's cards and rules on its server): it
 * records a step of its own with {@link UndoRedo.recordHostStep}, and that step is undone
 * and redone by the host, in the same history as the drawing's steps.
 */
import { type SlateJSON } from "./Serialization";
export interface UndoRedoOptions {
    enabled?: boolean;
    maxHistory?: number;
    debounceMs?: number;
}
/** What a host step's undo or redo did: true (done), false (nothing done), or with a sentence for the person. */
export type HostStepOutcome = boolean | {
    ok: boolean;
    message?: string;
} | void;
/**
 * A step a host made in its own state (for example a board's cards on its server), undone
 * and redone by the host. `label` names it ("Move Audit log to Doing").
 */
export interface HostStep {
    label?: string;
    undo(): HostStepOutcome | Promise<HostStepOutcome>;
    redo(): HostStepOutcome | Promise<HostStepOutcome>;
}
/** Whether there is something to undo and to redo, for a host's Undo and Redo controls. */
export interface UndoRedoState {
    canUndo: boolean;
    canRedo: boolean;
    /** The name of the step an undo takes back, when its host named it. */
    undoLabel: string | null;
    redoLabel: string | null;
}
/** What one undo or redo did, told to listeners once it has been carried out. */
export interface UndoRedoOutcome {
    action: "undo" | "redo";
    /** False when nothing was undone or redone. */
    done: boolean;
    /** Steps of this person's that someone else had changed since, passed over with nothing to take back. */
    skipped: number;
    /** A sentence for the person, when there is something to explain. */
    message: string | null;
}
export type UndoRedoListener = (state: UndoRedoState, outcome?: UndoRedoOutcome) => void;
/** Said when steps were passed over because someone else had changed what they changed. */
export declare const OVERWRITTEN_SENTENCE = "Someone else changed that since, so there was nothing of yours to take back there.";
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
    /**
     * The host step that leads to each record (see recordHostStep), index for index with
     * undoStack and redoStack. Null for a step of the drawing.
     */
    private undoSteps;
    private redoSteps;
    /**
     * Whether other people's changes reached each record after it was taken (absorbRemote),
     * index for index with undoStack: a step of this person's that nobody else changed is
     * always undone as it is.
     */
    private undoTouched;
    private redoTouched;
    /** Pointer gestures under way (see beginGesture): their changes become one step when the last ends. */
    private gestureDepth;
    private gestureChanged;
    private listeners;
    private lastState;
    private carried;
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
    /** True while a change of this person's own waits to be recorded. */
    private hasPending;
    /**
     * Record a change still waiting for its pause (or its gesture) now, as a step of
     * its own. Nothing happens when nothing is waiting.
     */
    flushPending(): void;
    /**
     * A pointer gesture began on the canvas (a drag, a resize, a rotation, a line drawn):
     * whatever it changes is one step, recorded by {@link endGesture}. An edit already
     * waiting for its pause is recorded first, as a step of its own.
     */
    beginGesture(): void;
    /** True while a pointer gesture on the canvas is under way. */
    inGesture(): boolean;
    /** The gesture begun with {@link beginGesture} is over: its changes, if any, are one step. */
    endGesture(): void;
    /**
     * Record a step a host made in its own state (see {@link HostStep}) as the next step
     * of this person's history. A change of the drawing still waiting to be recorded is
     * recorded first, as a step of its own. Redo history is cleared, as by any new step.
     */
    recordHostStep(step: HostStep): void;
    /** Whether there is something to undo and to redo now. */
    state(): UndoRedoState;
    /**
     * Hear whenever there comes to be something, or nothing, to undo or redo, and what each
     * undo or redo did. Called at once with the state as it is. Returns a function that stops it.
     */
    subscribe(listener: UndoRedoListener): () => void;
    private notify;
    /** Bring what the host keeps with the current record up to date (see Slate.beginHostStep). */
    refreshHostState(): void;
    /** True when going back from record `index` to the one before changes nothing (drawing and host state alike). */
    private sameAsBefore;
    /** True when redoing the top redo record changes nothing from the current record. */
    private redoChangesNothing;
    /** Whether two records' host states (Map of policy to state) hold the same. */
    private static sameHost;
    /**
     * Undo this person's last step. A step someone else has since changed so that going
     * back would change nothing is passed over (and listeners are told so); the step
     * before it is undone instead. Returns false when there was nothing to undo.
     */
    undo(): boolean;
    /**
     * Redo the last undone step. A step someone else has since changed so that redoing it
     * would change nothing is passed over. Returns false when there was nothing to redo.
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
    private absorbInto;
    private leavesTheirs;
    /** Check if undo is available */
    canUndo(): boolean;
    /** Check if redo is available */
    canRedo(): boolean;
    /** Clear all history */
    clear(): void;
    /** Destroy the undo/redo system, clearing all history and references */
    destroy(): void;
    private takeSnapshot;
    /**
     * The slate as a record: plain data, copied all the way down. A serialized note can share
     * nested objects with the live note (its `rotate` while it is not rotated), and a later
     * change to the live note would otherwise change the record with it (undoing a first
     * rotation left the note rotated).
     */
    private static capture;
    /** What the slate's host policies keep with a record taken now. */
    private hostState;
    /** The ids of the ordinary notes a slate document holds. */
    private static noteIds;
    /** A host step that did nothing is not offered the other way round. */
    private dropStep;
    private restore;
    /** Resolves once every undo and redo asked for so far has been carried out. */
    whenRestored(): Promise<void>;
}
