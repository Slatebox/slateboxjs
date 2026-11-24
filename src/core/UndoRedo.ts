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

import { serialize, deserialize, type SlateJSON } from "./Serialization";
import { applyDelta, diffSlates, type SlateDelta } from "./SlateDelta";

export interface UndoRedoOptions {
  enabled?: boolean;
  maxHistory?: number;
  debounceMs?: number;
}

/** What a host step's undo or redo did: true (done), false (nothing done), or with a sentence for the person. */
export type HostStepOutcome = boolean | { ok: boolean; message?: string } | void;

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
export const OVERWRITTEN_SENTENCE = "Someone else changed that since, so there was nothing of yours to take back there.";

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
  /**
   * The host step that leads to each record (see recordHostStep), index for index with
   * undoStack and redoStack. Null for a step of the drawing.
   */
  private undoSteps: (HostStep | null)[] = [];
  private redoSteps: (HostStep | null)[] = [];
  /**
   * Whether other people's changes reached each record after it was taken (absorbRemote),
   * index for index with undoStack: a step of this person's that nobody else changed is
   * always undone as it is.
   */
  private undoTouched: boolean[] = [];
  private redoTouched: boolean[] = [];
  /** Pointer gestures under way (see beginGesture): their changes become one step when the last ends. */
  private gestureDepth: number = 0;
  private gestureChanged: boolean = false;
  private listeners = new Set<UndoRedoListener>();
  private lastState: string = "";
  private carried = new WeakMap<SlateJSON, Set<string>>();

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

    // A drag, resize or rotation is one step: recorded when the pointer is let go.
    if (this.gestureDepth > 0) {
      this.gestureChanged = true;
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      return;
    }

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
    // Under a pointer gesture the step is recorded when the pointer is let go.
    if (this.gestureDepth > 0) {
      this.gestureChanged = true;
      return;
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
    this.gestureChanged = false;

    this.takeSnapshot();
  }

  /** True while a change of this person's own waits to be recorded. */
  private hasPending(): boolean {
    return Boolean(this.debounceTimer || this.gestureRecordDue || this.gestureChanged);
  }

  /**
   * Record a change still waiting for its pause (or its gesture) now, as a step of
   * its own. Nothing happens when nothing is waiting.
   */
  public flushPending(): void {
    if (this.hasPending()) this.forceSnapshot();
  }

  /**
   * A pointer gesture began on the canvas (a drag, a resize, a rotation, a line drawn):
   * whatever it changes is one step, recorded by {@link endGesture}. An edit already
   * waiting for its pause is recorded first, as a step of its own.
   */
  public beginGesture(): void {
    if (!this.options.enabled) return;
    if (this.gestureDepth === 0 && this.debounceTimer) this.forceSnapshot();
    this.gestureDepth += 1;
  }

  /** True while a pointer gesture on the canvas is under way. */
  public inGesture(): boolean {
    return this.gestureDepth > 0;
  }

  /** The gesture begun with {@link beginGesture} is over: its changes, if any, are one step. */
  public endGesture(): void {
    if (this.gestureDepth === 0) return;
    this.gestureDepth -= 1;
    if (this.gestureDepth > 0 || !this.gestureChanged) return;
    this.gestureChanged = false;
    // Packages a gesture sends as it ends (a drop's final move) are sent by the same
    // pointerup: the record is taken once that handler has finished.
    this.gestureRecordDue = true;
    queueMicrotask(() => {
      if (!this.gestureRecordDue) return;
      this.gestureRecordDue = false;
      if (!this.slate || this.isRestoring) return;
      this.takeSnapshot();
    });
  }

  /**
   * Record a step a host made in its own state (see {@link HostStep}) as the next step
   * of this person's history. A change of the drawing still waiting to be recorded is
   * recorded first, as a step of its own. Redo history is cleared, as by any new step.
   */
  public recordHostStep(step: HostStep): void {
    if (!this.options.enabled || !this.slate || !step) return;
    if (typeof step.undo !== "function" || typeof step.redo !== "function") return;
    this.flushPending();
    this.takeSnapshot(step);
  }

  /** Whether there is something to undo and to redo now. */
  public state(): UndoRedoState {
    const undoStep = this.undoSteps[this.undoStack.length - 1];
    const redoStep = this.redoSteps[this.redoStack.length - 1];
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoLabel: this.canUndo() ? undoStep?.label ?? null : null,
      redoLabel: this.canRedo() ? redoStep?.label ?? null : null,
    };
  }

  /**
   * Hear whenever there comes to be something, or nothing, to undo or redo, and what each
   * undo or redo did. Called at once with the state as it is. Returns a function that stops it.
   */
  public subscribe(listener: UndoRedoListener): () => void {
    if (typeof listener !== "function") return () => {};
    this.listeners.add(listener);
    const state = this.state();
    this.lastState = JSON.stringify(state);
    try {
      listener(state);
    } catch (e) {
      console.warn("UNDOREDO_DEBUG: listener threw", e);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(outcome?: UndoRedoOutcome): void {
    const state = this.state();
    const key = JSON.stringify(state);
    if (!outcome && key === this.lastState) return;
    this.lastState = key;
    for (const listener of [...this.listeners]) {
      try {
        listener(state, outcome);
      } catch (e) {
        console.warn("UNDOREDO_DEBUG: listener threw", e);
      }
    }
    try {
      this.slate?.options?.events?.onUndoRedoChanged?.(state, outcome);
    } catch (e) {
      console.warn("UNDOREDO_DEBUG: onUndoRedoChanged threw", e);
    }
  }

  /** Bring what the host keeps with the current record up to date (see Slate.beginHostStep). */
  public refreshHostState(): void {
    if (!this.options.enabled || !this.slate || !this.undoStack.length) return;
    this.undoHost[this.undoStack.length - 1] = this.hostState();
  }


  /** True when going back from record `index` to the one before changes nothing (drawing and host state alike). */
  private sameAsBefore(index: number): boolean {
    if (index < 1) return false;
    try {
      if (diffSlates(this.undoStack[index - 1], this.undoStack[index]) !== null) return false;
    } catch (e) {
      return false;
    }
    return UndoRedo.sameHost(this.undoHost[index - 1], this.undoHost[index]);
  }

  /** True when redoing the top redo record changes nothing from the current record. */
  private redoChangesNothing(): boolean {
    const next = this.redoStack[this.redoStack.length - 1];
    const current = this.undoStack[this.undoStack.length - 1];
    if (!next || !current) return false;
    try {
      if (diffSlates(current, next) !== null) return false;
    } catch (e) {
      return false;
    }
    return UndoRedo.sameHost(this.undoHost[this.undoStack.length - 1], this.redoHost[this.redoStack.length - 1]);
  }

  /** Whether two records' host states (Map of policy to state) hold the same. */
  private static sameHost(a: unknown, b: unknown): boolean {
    const flat = (v: unknown) => {
      try {
        return JSON.stringify(v instanceof Map ? [...v.values()] : v ?? null);
      } catch (e) {
        return String(Math.random());
      }
    };
    return flat(a) === flat(b);
  }

  /**
   * Undo this person's last step. A step someone else has since changed so that going
   * back would change nothing is passed over (and listeners are told so); the step
   * before it is undone instead. Returns false when there was nothing to undo.
   */
  public undo(): boolean {
    // Capture any pending (debounced) change first, so an edit made moments ago
    // is on the stack and can be undone immediately.
    if (this.hasPending()) this.forceSnapshot();
    let skipped = 0;
    while (this.undoStack.length > 1) {
      const top = this.undoStack.length - 1;
      const step = this.undoSteps[top];
      if (!step && this.undoTouched[top] && this.sameAsBefore(top)) {
        // Someone else changed everything this step changed: there is nothing of this
        // person's to take back. The step goes, and is not offered for redo either.
        this.undoStack.splice(top, 1);
        this.undoHost.splice(top, 1);
        this.undoSteps.splice(top, 1);
        this.undoTouched.splice(top, 1);
        skipped += 1;
        continue;
      }

      // Save current state to redo stack
      this.redoStack.push(this.undoStack.pop()!);
      this.redoHost.push(this.undoHost.pop());
      this.redoSteps.push(this.undoSteps.pop() ?? null);
      this.redoTouched.push(this.undoTouched.pop() ?? false);

      // Restore previous state
      const previous = this.undoStack[this.undoStack.length - 1];
      const partly = this.leavesTheirs(this.redoStack[this.redoStack.length - 1], previous);
      this.restore(previous, "undo", this.undoHost[this.undoStack.length - 1], step ?? null, skipped, partly);
      this.notify();
      return true;
    }
    if (skipped) {
      this.notify({ action: "undo", done: false, skipped, message: OVERWRITTEN_SENTENCE });
    }
    return false;
  }

  /**
   * Redo the last undone step. A step someone else has since changed so that redoing it
   * would change nothing is passed over. Returns false when there was nothing to redo.
   */
  public redo(): boolean {
    let skipped = 0;
    while (this.redoStack.length > 0) {
      const top = this.redoStack.length - 1;
      const step = this.redoSteps[top];
      if (!step && this.redoTouched[top] && this.redoChangesNothing()) {
        this.redoStack.pop();
        this.redoHost.pop();
        this.redoSteps.pop();
        this.redoTouched.pop();
        skipped += 1;
        continue;
      }
      const partly = this.leavesTheirs(this.undoStack[this.undoStack.length - 1], this.redoStack[top]);
      const next = this.redoStack.pop()!;
      const host = this.redoHost.pop();
      this.redoSteps.pop();
      const touched = this.redoTouched.pop() ?? false;

      this.undoStack.push(next);
      this.undoHost.push(host);
      this.undoSteps.push(step ?? null);
      this.undoTouched.push(touched);

      this.restore(next, "redo", host, step ?? null, skipped, partly);
      this.notify();
      return true;
    }
    if (skipped) {
      this.notify({ action: "redo", done: false, skipped, message: OVERWRITTEN_SENTENCE });
    }
    return false;
  }

  /**
   * The slate as it is now, taken just before other people's changes are
   * applied to it; pass it to {@link absorbRemote} once they have been. Null
   * when this slate keeps no history.
   */
  public beforeRemote(): SlateJSON | null {
    if (!this.options.enabled || !this.slate) return null;
    try {
      return UndoRedo.capture(this.slate);
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
      now = UndoRedo.capture(this.slate);
    } catch (e) {
      return; /* the slate cannot be serialized right now: keep the records as they are */
    }
    if (before && typeof before === "object") {
      const delta = diffSlates(before, now);
      if (delta) {
        this.undoStack = this.undoStack.map((record) => this.absorbInto(record, before, delta));
        this.redoStack = this.redoStack.map((record) => this.absorbInto(record, before, delta));
        this.undoTouched = this.undoTouched.map(() => true);
        this.redoTouched = this.redoTouched.map(() => true);
      }
    }
    // A change of this person's own is waiting to be recorded: that record is
    // taken from the slate and holds the others' changes already.
    if (this.isRestoring || this.hasPending() || this.undoStack.length === 0) return;
    // The current record is the slate as it is now.
    this.undoStack[this.undoStack.length - 1] = now;
    this.undoHost[this.undoStack.length - 1] = this.hostState();
  }

  private absorbInto(record: SlateJSON, before: SlateJSON, delta: SlateDelta): SlateJSON {
    // `record` with someone else's change carried into it. A note this person's step made (or
    // took away) that the change edits, or draws a line to, is someone else's work too now:
    // a record without it gets it, so no undo or redo of this person's takes their edit away.
    // `carried` keeps, per record, the notes it holds only for that reason: an undo or redo to
    // it leaves them, and says so (leavesTheirs). (Comments inside a method: the canvas chunk
    // ships without them, and it is at its ceiling.)
    const touched = new Set<string>();
    for (const change of delta.changed) {
      touched.add(change.id);
      for (const link of change.links.set) if (typeof link.childId === "string") touched.add(link.childId);
    }
    for (const id of delta.removed) touched.delete(id);
    const have = UndoRedo.noteIds(record);
    const missing = (before.nodes ?? []).filter((node: any) => touched.has(node?.options?.id) && !have.has(node.options.id));
    const next = applyDelta(missing.length ? { ...record, nodes: [...(record.nodes ?? []), ...JSON.parse(JSON.stringify(missing))] } : record, delta);
    const kept = new Set([...(this.carried.get(record) ?? []), ...missing.map((node: any) => node.options.id as string)]);
    if (kept.size) this.carried.set(next, kept);
    return next;
  }

  private leavesTheirs(from: SlateJSON | undefined, to: SlateJSON | undefined): boolean {
    // True when going from record `from` to record `to` leaves a note `from` made that someone else changed since.
    const kept = to ? this.carried.get(to) : undefined;
    if (!kept) return false;
    const own = (from && this.carried.get(from)) || new Set<string>();
    return [...kept].some((id) => !own.has(id));
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
    this.undoSteps = [];
    this.redoSteps = [];
    this.undoTouched = [];
    this.redoTouched = [];
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.gestureRecordDue = false;
    this.gestureChanged = false;
    this.notify();
  }

  /** Destroy the undo/redo system, clearing all history and references */
  public destroy(): void {
    this.clear();
    this.listeners.clear();
    this.isRestoring = false;
    this.gestureDepth = 0;
    (this as any).slate = null;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private takeSnapshot(step: HostStep | null = null): void {
    let snapshot: SlateJSON;
    try {
      snapshot = UndoRedo.capture(this.slate);
    } catch (e) {
      // Slate not fully constructed / serializable yet — skip this snapshot.
      return;
    }

    // Clear redo stack on new change
    this.redoStack = [];
    this.redoHost = [];
    this.redoSteps = [];
    this.redoTouched = [];

    // Add to undo stack
    this.undoStack.push(snapshot);
    this.undoHost.push(this.hostState());
    this.undoSteps.push(step);
    this.undoTouched.push(false);

    // Trim if exceeds max
    if (this.undoStack.length > this.options.maxHistory!) {
      this.undoStack.shift();
      this.undoHost.shift();
      this.undoSteps.shift();
      this.undoTouched.shift();
      // The oldest record is the starting point now: no step leads to it.
      this.undoSteps[0] = null;
    }

    this.notify();
  }

  /**
   * The slate as a record: plain data, copied all the way down. A serialized note can share
   * nested objects with the live note (its `rotate` while it is not rotated), and a later
   * change to the live note would otherwise change the record with it (undoing a first
   * rotation left the note rotated).
   */
  private static capture(slate: any): SlateJSON {
    return JSON.parse(JSON.stringify(serialize(slate)));
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

  /** A host step that did nothing is not offered the other way round. */
  private dropStep(step: HostStep, action: "undo" | "redo"): void {
    const stack = action === "undo" ? this.redoSteps : this.undoSteps;
    const at = stack.lastIndexOf(step);
    if (at < 0) return;
    if (action === "undo") {
      if (at !== this.redoStack.length - 1) return;
      this.redoStack.pop();
      this.redoHost.pop();
      this.redoSteps.pop();
      this.redoTouched.pop();
    } else {
      // A redo that did nothing: the slate stays where it was before the redo.
      if (at !== this.undoStack.length - 1 || at < 1) return;
      this.undoStack.pop();
      this.undoHost.pop();
      this.undoSteps.pop();
      this.undoTouched.pop();
    }
  }

  private restore(
    snapshot: SlateJSON,
    action: "undo" | "redo",
    host: unknown = null,
    step: HostStep | null = null,
    skipped: number = 0,
    partly: boolean = false
  ): void {
    // Restoring creates SVG nodes asynchronously. Serialize rapid undo/redo
    // requests so an older restore cannot finish after a newer one and win.
    this.pendingRestores += 1;
    this.isRestoring = true;
    let outcome: UndoRedoOutcome = {
      action,
      done: true,
      skipped,
      message: skipped || partly ? OVERWRITTEN_SENTENCE : null,
    };
    this.restoreQueue = this.restoreQueue
      .then(async () => {
        // Packages from the room that are still being applied finish first: a
        // restore that starts in the middle of them would be overwritten by
        // the rest.
        await this.slate.collab?.whenApplied?.();
        let before: SlateJSON | null = null;
        try {
          before = UndoRedo.capture(this.slate);
        } catch (e) {
          before = null;
        }
        // A host step leaves the drawing as it was: the slate is rebuilt (and the whole
        // of it sent to the room) only when the drawing itself goes back or forward.
        let drawingChanges = true;
        if (step && before) {
          try {
            drawingChanges = diffSlates(before, snapshot) !== null;
          } catch (e) {
            drawingChanges = true;
          }
        }
        if (drawingChanges) {
          // Drawn from a copy: the notes built from it must not share objects with the record
          // (a rotation made afterwards would change the record with the note).
          await deserialize(JSON.stringify(snapshot), this.slate, false, true);
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
        }
        if (step) {
          let result: HostStepOutcome;
          try {
            result = await (action === "undo" ? step.undo() : step.redo());
          } catch (e) {
            console.warn("UNDOREDO_DEBUG: host step failed", e);
            result = { ok: false, message: null as any };
          }
          const ok = result === undefined || result === true || (typeof result === "object" && result !== null && result.ok !== false);
          const message = typeof result === "object" && result !== null && typeof result.message === "string" ? result.message : null;
          if (!ok) {
            this.dropStep(step, action);
            outcome = { action, done: drawingChanges, skipped, message: message ?? (skipped ? OVERWRITTEN_SENTENCE : null) };
          } else if (message) {
            outcome = { ...outcome, message };
          }
        }
      })
      .catch((err: Error) =>
        console.error("UNDOREDO_DEBUG: Restore failed", err)
      )
      .finally(() => {
        this.pendingRestores -= 1;
        if (this.pendingRestores === 0) this.isRestoring = false;
        this.notify(outcome);
      });
  }

  /** Resolves once every undo and redo asked for so far has been carried out. */
  public whenRestored(): Promise<void> {
    return this.restoreQueue.then(() => undefined);
  }
}
