import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UndoRedo } from "../../src/core/UndoRedo";

describe("UndoRedo", () => {
  let mockSlate: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockSlate = {
      options: {
        name: "Test",
        shareId: "",
        events: {
          onTakeSnapshot: vi.fn(),
        },
      },
      nodes: {
        allNodes: [],
        clear: vi.fn(),
        one: vi.fn(),
      },
      addNode: vi.fn(),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("snap", () => {
    it("should take immediate snapshot with init=true", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      expect(ur.canUndo()).toBe(false); // Need at least 2 snapshots to undo
    });

    it("should debounce non-init snapshots", () => {
      const ur = new UndoRedo(mockSlate, { debounceMs: 100 });
      ur.snap(true); // Initial
      ur.snap(); // Debounced

      // Before debounce fires, still only 1 snapshot
      expect(ur.canUndo()).toBe(false);

      // Fast-forward past debounce
      vi.advanceTimersByTime(150);
      expect(ur.canUndo()).toBe(true); // Now have 2 snapshots
    });

    it("should not take snapshot when disabled", () => {
      const ur = new UndoRedo(mockSlate, { enabled: false });
      ur.snap(true);
      expect(ur.canUndo()).toBe(false);
    });
  });

  describe("undo/redo", () => {
    it("should undo to previous state", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true); // State 1
      ur.snap(true); // State 2 (bypass debounce)

      const result = ur.undo();
      expect(result).toBe(true);
      expect(ur.canRedo()).toBe(true);
    });

    it("should return false when nothing to undo", () => {
      const ur = new UndoRedo(mockSlate);
      expect(ur.undo()).toBe(false);
    });

    it("should redo after undo", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snap(true);

      ur.undo();
      const result = ur.redo();
      expect(result).toBe(true);
    });

    it("should return false when nothing to redo", () => {
      const ur = new UndoRedo(mockSlate);
      expect(ur.redo()).toBe(false);
    });

    it("should clear redo stack on new snap after undo", async () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snap(true);
      ur.snap(true);

      ur.undo();
      expect(ur.canRedo()).toBe(true);

      // Wait for async restore to complete
      await vi.advanceTimersByTimeAsync(0);

      ur.snap(true); // New change after undo
      expect(ur.canRedo()).toBe(false); // Redo cleared
    });

    it("should fire onTakeSnapshot event on undo", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snap(true);
      ur.undo();

      expect(mockSlate.options.events.onTakeSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({ action: "undo" })
      );
    });
  });

  describe("canUndo / canRedo", () => {
    it("canUndo requires at least 2 snapshots", () => {
      const ur = new UndoRedo(mockSlate);
      expect(ur.canUndo()).toBe(false);

      ur.snap(true);
      expect(ur.canUndo()).toBe(false);

      ur.snap(true);
      expect(ur.canUndo()).toBe(true);
    });

    it("canRedo starts false", () => {
      const ur = new UndoRedo(mockSlate);
      expect(ur.canRedo()).toBe(false);
    });
  });

  describe("clear", () => {
    it("should clear all history", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snap(true);
      ur.undo();

      ur.clear();
      expect(ur.canUndo()).toBe(false);
      expect(ur.canRedo()).toBe(false);
    });
  });

  describe("forceSnapshot", () => {
    it("should take immediate snapshot bypassing debounce", () => {
      const ur = new UndoRedo(mockSlate, { debounceMs: 3000 });
      ur.snap(true); // initial snapshot
      expect(ur.canUndo()).toBe(false);

      ur.forceSnapshot(); // immediate second snapshot
      expect(ur.canUndo()).toBe(true);
    });

    it("should clear pending debounce timer", () => {
      const ur = new UndoRedo(mockSlate, { debounceMs: 3000 });
      ur.snap(true); // initial snapshot
      ur.snap(); // starts debounce
      expect((ur as any).debounceTimer).not.toBeNull();

      ur.forceSnapshot(); // should clear the timer
      expect((ur as any).debounceTimer).toBeNull();
    });

    it("should not snapshot when disabled", () => {
      const ur = new UndoRedo(mockSlate, { enabled: false });
      ur.forceSnapshot();
      expect(ur.canUndo()).toBe(false);
    });
  });

  describe("maxHistory", () => {
    it("should trim undo stack when exceeding maxHistory", () => {
      const ur = new UndoRedo(mockSlate, { maxHistory: 3 });

      ur.snap(true);
      ur.snap(true);
      ur.snap(true);
      ur.snap(true); // This should trim the oldest

      // We should be able to undo but only up to maxHistory - 1 times
      expect(ur.canUndo()).toBe(true);
    });
  });
});
