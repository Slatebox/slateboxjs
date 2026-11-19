import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UndoRedo } from "../../src/core/UndoRedo";

describe("UndoRedo", () => {
  let mockSlate: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockSlate = {
      options: {
        id: "slate-1",
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
      broadcast: vi.fn(),
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

    it("broadcasts and snapshots the restored state after undo", async () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snap(true);
      ur.undo();

      await vi.advanceTimersByTimeAsync(0);

      expect(mockSlate.broadcast).toHaveBeenCalledWith(
        "onSlateReplaced",
        expect.objectContaining({ action: "undo", snapshot: expect.any(String) })
      );

      expect(mockSlate.options.events.onTakeSnapshot).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "undo",
          slateId: "slate-1",
          snapshot: expect.any(String),
        })
      );
    });
  });

  // Snapshots are whole slates: undoing to one that was taken before other
  // people's changes arrived would take their changes away with it.
  describe("other people's changes", () => {
    it("are taken into the current record, so undoing one's next step keeps them", async () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true); // the slate as loaded
      mockSlate.options.name = "Renamed by someone else";
      ur.absorbRemote();
      mockSlate.options.name = "Renamed by me";
      ur.snap(true);

      ur.undo();
      await vi.advanceTimersByTimeAsync(0);
      const restored = JSON.parse(mockSlate.broadcast.mock.calls.at(-1)[1].snapshot);
      expect(restored.options.name).toBe("Renamed by someone else");
    });

    it("do not become a step of one's own", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.absorbRemote();
      expect(ur.canUndo()).toBe(false);
    });

    it("leave a change of one's own that is still waiting to be recorded alone", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snap(); // an edit, not yet recorded
      mockSlate.options.name = "Renamed by someone else";
      ur.absorbRemote();
      vi.advanceTimersByTime(600);
      expect(ur.canUndo()).toBe(true);
    });

    it("someone else's undo starts this person's history again", async () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snap(true);
      ur.undo();
      await vi.advanceTimersByTimeAsync(0);
      expect(ur.canRedo()).toBe(true);
      ur.absorbRemote(true);
      expect(ur.canUndo()).toBe(false);
      expect(ur.canRedo()).toBe(false);
      ur.snap(true);
      expect(ur.canUndo()).toBe(true);
    });
  });

  // Deleting is one deliberate act; a burst of other edits is one step.
  describe("snapAfterGesture", () => {
    /** The handler of one key press or click has finished. */
    const gestureEnds = () => Promise.resolve();

    it("records a delete when its key press ends, so two deletes one after the other are two steps", async () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      mockSlate.options.name = "first note deleted";
      ur.snapAfterGesture();
      await gestureEnds(); // no time passes: the next press may follow at once
      mockSlate.options.name = "second note deleted";
      ur.snapAfterGesture();
      await gestureEnds();

      ur.undo();
      const restored = (ur as any).undoStack.at(-1);
      expect(restored.options.name).toBe("first note deleted");
    });

    it("keeps several notes deleted by one key press, and what that press also changed, in one step", async () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      ur.snapAfterGesture(); // note 1
      ur.snap(); // a connector that went with it
      ur.snapAfterGesture(); // note 2
      ur.snap();
      await gestureEnds();
      expect((ur as any).undoStack).toHaveLength(2);
      vi.advanceTimersByTime(1000);
      expect((ur as any).undoStack).toHaveLength(2);
    });

    it("an undo pressed before the record was taken still undoes the delete", () => {
      const ur = new UndoRedo(mockSlate);
      ur.snap(true);
      mockSlate.options.name = "note deleted";
      ur.snapAfterGesture();
      expect(ur.undo()).toBe(true);
      expect((ur as any).undoStack.at(-1).options.name).toBe("Test");
    });

    it("does nothing when undo is off", async () => {
      const off = new UndoRedo(mockSlate, { enabled: false });
      off.snapAfterGesture();
      await gestureEnds();
      expect(off.canUndo()).toBe(false);
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
