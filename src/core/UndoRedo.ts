/**
 * UndoRedo.ts - Snapshot-based undo/redo system
 *
 * Takes full JSON snapshots of the slate state.
 * Uses a 3-second debounce before saving snapshots.
 */

import { serialize, deserialize, type SlateJSON } from "./Serialization";
import { applyDelta, diffSlates } from "./SlateDelta";

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
  /**
   * What the slate's host policies kept with each record (see DragPolicy.undoState),
   * index for index with undoStack and redoStack.
   */
  private undoHost: unknown[] = [];
  private redoHost: unknown[] = [];
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
   * Record a change still waiting for its pause (or its gesture) now, as a step of
   * its own. Nothing happens when nothing is waiting.
   */
  public flushPending(): void {
    if (this.debounceTimer || this.gestureRecordDue) this.forceSnapshot();
  }

  /** Bring what the host keeps with the current record up to date (see Slate.beginHostStep). */
  public refreshHostState(): void {
    if (!this.options.enabled || !this.slate || !this.undoStack.length) return;
    this.undoHost[this.undoStack.length - 1] = this.hostState();
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
    this.redoHost.push(this.undoHost.pop());

    // Restore previous state
    const previous = this.undoStack[this.undoStack.length - 1];
    this.restore(previous, "undo", this.undoHost[this.undoStack.length - 1]);

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
    const host = this.redoHost.pop();

    // Push to undo stack
    this.undoStack.push(next);
    this.undoHost.push(host);

    // Restore state
    this.restore(next, "redo", host);

    console.log(
      "UNDOREDO_DEBUG: Redo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    );

    return true;
  }

  /**
   * The slate as it is now, taken just before other people's changes are
   * applied to it; pass it to {@link absorbRemote} once they have been. Null
   * when this slate keeps no history.
   */
  public beforeRemote(): SlateJSON | null {
    if (!this.options.enabled || !this.slate) return null;
    try {
      return serialize(this.slate);
    } catch (e) {
      return null;
    }
  }

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
  public absorbRemote(before?: SlateJSON | null): void {
    if (!this.options.enabled || !this.slate) return;
    let now: SlateJSON;
    try {
      now = serialize(this.slate);
    } catch (e) {
      return; /* the slate cannot be serialized right now: keep the records as they are */
    }
    if (before && typeof before === "object") {
      const delta = diffSlates(before, now);
      if (delta) {
        this.undoStack = this.undoStack.map((record) => applyDelta(record, delta));
        this.redoStack = this.redoStack.map((record) => applyDelta(record, delta));
      }
    }
    // A change of this person's own is waiting to be recorded: that record is
    // taken from the slate and holds the others' changes already.
    if (this.isRestoring || this.debounceTimer || this.gestureRecordDue || this.undoStack.length === 0) return;
    // The current record is the slate as it is now.
    this.undoStack[this.undoStack.length - 1] = now;
    this.undoHost[this.undoStack.length - 1] = this.hostState();
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
    this.undoHost = [];
    this.redoHost = [];
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
    this.redoHost = [];

    // Add to undo stack
    this.undoStack.push(snapshot);
    this.undoHost.push(this.hostState());

    // Trim if exceeds max
    if (this.undoStack.length > this.options.maxHistory!) {
      this.undoStack.shift();
      this.undoHost.shift();
    }

    console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
  }

  /** What the slate's host policies keep with a record taken now. */
  private hostState(): unknown {
    try {
      return this.slate?.undoHostState?.() ?? null;
    } catch (e) {
      return null;
    }
  }

  /** The ids of the ordinary notes a slate document holds. */
  private static noteIds(json: SlateJSON | null): Set<string> {
    return new Set((json?.nodes ?? []).map((node: any) => node?.options?.id).filter((id: unknown) => typeof id === "string"));
  }

  private restore(snapshot: SlateJSON, action: "undo" | "redo", host: unknown = null): void {
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
        let before: SlateJSON | null = null;
        try {
          before = serialize(this.slate);
        } catch (e) {
          before = null;
        }
        await deserialize(snapshot, this.slate, false, true);
        // A host keeps its own state beside the drawing (a workshop's cards): it hears
        // which notes this step brought back or took away, with what it kept then.
        const was = UndoRedo.noteIds(before), now = UndoRedo.noteIds(snapshot);
        this.slate.restoreUndoHostState?.(host, {
          added: [...now].filter((id) => !was.has(id)),
          removed: [...was].filter((id) => !now.has(id)),
        });

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
