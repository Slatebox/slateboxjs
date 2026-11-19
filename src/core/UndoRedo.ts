/**
 * UndoRedo.ts - Snapshot-based undo/redo system
 *
 * Takes full JSON snapshots of the slate state.
 * Uses a 3-second debounce before saving snapshots.
 */

import { serialize, deserialize, type SlateJSON } from "./Serialization";

export interface UndoRedoOptions {
  enabled?: boolean;
  maxHistory?: number;
  debounceMs?: number;
}

export class UndoRedo {
  private slate: any;
  private options: UndoRedoOptions;
  private undoStack: SlateJSON[] = [];
  private redoStack: SlateJSON[] = [];
  private debounceTimer: any = null;
  private isRestoring: boolean = false;
  private restoreQueue: Promise<void> = Promise.resolve();
  private pendingRestores: number = 0;
  /** A record is due as soon as the current gesture has made all its changes (see snapAfterGesture). */
  private gestureRecordDue: boolean = false;

  constructor(slate: any, options: UndoRedoOptions = {}) {
    this.slate = slate;
    this.options = {
      enabled: true,
      maxHistory: 50,
      // Coalesce a burst of edits into one undo step, but land the snapshot soon
      // after activity stops so undo is responsive.
      debounceMs: 500,
      ...options,
    };
  }

  /**
   * Take a snapshot of the current state.
   * Debounced to avoid excessive snapshots during rapid changes.
   *
   * @param init - If true, take immediately without debounce (initial state)
   */
  public snap(init: boolean = false): void {
    if (!this.options.enabled || this.isRestoring) return;

    if (init) {
      this.takeSnapshot();
      return;
    }

    // A delete in this same gesture is about to be recorded: that record holds
    // this change too, and must not be put off by it.
    if (this.gestureRecordDue) return;

    // Debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      // Null the handle BEFORE snapshotting so undo()'s "flush pending" check
      // (if (this.debounceTimer) forceSnapshot()) doesn't then push a duplicate
      // of a state we just captured — which made undo() a no-op.
      this.debounceTimer = null;
      this.takeSnapshot();
    }, this.options.debounceMs);
  }

  /**
   * Record a step as soon as the current gesture has made all its changes,
   * without the pause that groups a burst of edits into one step.
   *
   * Deleting is one deliberate act: two notes deleted one after the other are
   * two steps, and undo brings back the last one only. (Several selected notes
   * deleted by one key press are still one step: their packages are all sent
   * before this record is taken.)
   */
  public snapAfterGesture(): void {
    if (!this.options.enabled || this.isRestoring) return;
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this.gestureRecordDue) return;
    this.gestureRecordDue = true;
    // A microtask, not a timer: it runs when the handler of this key press or
    // click has finished, before the browser delivers the next one. A timer can
    // be overtaken by the next key press, which would merge the two steps.
    queueMicrotask(() => {
      if (!this.gestureRecordDue) return; // recorded already (undo flushed it) or history was cleared
      this.gestureRecordDue = false;
      if (!this.slate || this.isRestoring) return;
      this.takeSnapshot();
    });
  }

  /**
   * Take an immediate snapshot, bypassing the debounce timer.
   * Useful for programmatic undo/redo sequences where you need
   * guaranteed snapshot state right now (e.g., tests, scripts).
   */
  public forceSnapshot(): void {
    if (!this.options.enabled || this.isRestoring) return;

    // Clear any pending debounced snapshot
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.gestureRecordDue = false;

    this.takeSnapshot();
  }

  /**
   * Undo the last change. Restores the previous snapshot.
   */
  public undo(): boolean {
    // Capture any pending (debounced) change first, so an edit made moments ago
    // is on the stack and can be undone immediately.
    if (this.debounceTimer || this.gestureRecordDue) this.forceSnapshot();
    if (this.undoStack.length <= 1) {
      console.log("UNDOREDO_DEBUG: Nothing to undo");
      return false;
    }

    // Save current state to redo stack
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);

    // Restore previous state
    const previous = this.undoStack[this.undoStack.length - 1];
    this.restore(previous, "undo");

    console.log(
      "UNDOREDO_DEBUG: Undo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    );

    return true;
  }

  /**
   * Redo the last undone change.
   */
  public redo(): boolean {
    if (this.redoStack.length === 0) {
      console.log("UNDOREDO_DEBUG: Nothing to redo");
      return false;
    }

    // Pop from redo stack
    const next = this.redoStack.pop()!;

    // Push to undo stack
    this.undoStack.push(next);

    // Restore state
    this.restore(next, "redo");

    console.log(
      "UNDOREDO_DEBUG: Redo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    );

    return true;
  }

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
  public absorbRemote(replaced: boolean = false): void {
    if (!this.options.enabled || !this.slate) return;
    if (replaced) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      this.gestureRecordDue = false;
      this.undoStack = [];
      this.redoStack = [];
      this.takeSnapshot();
      return;
    }
    // A change of this person's own is waiting to be recorded: that record will
    // hold the others' changes too.
    if (this.isRestoring || this.debounceTimer || this.gestureRecordDue || this.undoStack.length === 0) return;
    try {
      this.undoStack[this.undoStack.length - 1] = serialize(this.slate);
    } catch (e) {
      /* the slate cannot be serialized right now: keep the record as it is */
    }
  }

  /** Check if undo is available */
  public canUndo(): boolean {
    return this.undoStack.length > 1;
  }

  /** Check if redo is available */
  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Clear all history */
  public clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.gestureRecordDue = false;
  }

  /** Destroy the undo/redo system, clearing all history and references */
  public destroy(): void {
    this.clear();
    this.isRestoring = false;
    (this as any).slate = null;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private takeSnapshot(): void {
    let snapshot: SlateJSON;
    try {
      snapshot = serialize(this.slate);
    } catch (e) {
      // Slate not fully constructed / serializable yet — skip this snapshot.
      return;
    }

    // Clear redo stack on new change
    this.redoStack = [];

    // Add to undo stack
    this.undoStack.push(snapshot);

    // Trim if exceeds max
    if (this.undoStack.length > this.options.maxHistory!) {
      this.undoStack.shift();
    }

    console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
  }

  private restore(snapshot: SlateJSON, action: "undo" | "redo"): void {
    // Restoring creates SVG nodes asynchronously. Serialize rapid undo/redo
    // requests so an older restore cannot finish after a newer one and win.
    this.pendingRestores += 1;
    this.isRestoring = true;
    this.restoreQueue = this.restoreQueue
      .then(async () => {
        // Packages from the room that are still being applied finish first: a
        // restore that starts in the middle of them would be overwritten by
        // the rest.
        await this.slate.collab?.whenApplied?.();
        await deserialize(snapshot, this.slate, false, true);

        // A local undo/redo is still a document mutation. Broadcast one
        // authoritative full-state baseline so remote peers restore the same
        // document and the host's onSlateChanged persistence path runs.
        const snapshotJSON = JSON.stringify(snapshot);
        this.slate.broadcast?.("onSlateReplaced", {
          action,
          snapshot: snapshotJSON,
        });

        // The Meteor host persists named snapshots through this callback and
        // expects both fields (passing only `action` made the method unusable).
        this.slate.options.events?.onTakeSnapshot?.({
          action,
          slateId: this.slate.options.id,
          snapshot: snapshotJSON,
        });
      })
      .catch((err: Error) =>
        console.error("UNDOREDO_DEBUG: Restore failed", err)
      )
      .finally(() => {
        this.pendingRestores -= 1;
        if (this.pendingRestores === 0) this.isRestoring = false;
      });
  }
}
