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

  constructor(slate: any, options: UndoRedoOptions = {}) {
    this.slate = slate;
    this.options = {
      enabled: true,
      maxHistory: 50,
      debounceMs: 3000,
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

    // Debounce
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.takeSnapshot();
    }, this.options.debounceMs);
  }

  /**
   * Undo the last change. Restores the previous snapshot.
   */
  public undo(): boolean {
    if (this.undoStack.length <= 1) {
      console.log("UNDOREDO_DEBUG: Nothing to undo");
      return false;
    }

    // Save current state to redo stack
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);

    // Restore previous state
    const previous = this.undoStack[this.undoStack.length - 1];
    this.restore(previous);

    console.log(
      "UNDOREDO_DEBUG: Undo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    );

    // Trigger event
    this.slate.options.events?.onTakeSnapshot?.({ action: "undo" });

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
    this.restore(next);

    console.log(
      "UNDOREDO_DEBUG: Redo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    );

    // Trigger event
    this.slate.options.events?.onTakeSnapshot?.({ action: "redo" });

    return true;
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
    }
  }

  /** Destroy the undo/redo system, clearing all history and references */
  public destroy(): void {
    this.clear();
    this.isRestoring = false;
    (this as any).slate = null;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private takeSnapshot(): void {
    const snapshot = serialize(this.slate);

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

  private restore(snapshot: SlateJSON): void {
    this.isRestoring = true;
    deserialize(snapshot, this.slate, false, true)
      .catch((err: Error) => console.error("UNDOREDO_DEBUG: Restore failed", err))
      .finally(() => { this.isRestoring = false; });
  }
}
