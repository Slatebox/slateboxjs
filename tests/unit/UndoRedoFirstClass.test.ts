import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UndoRedo, OVERWRITTEN_SENTENCE, type UndoRedoOutcome } from "../../src/core/UndoRedo";
import { Keyboard } from "../../src/core/Keyboard";
import { applySlateOperations } from "../../src/core/SlateOperations";

// A note as the slate holds it; serialize() reads only these fields here.
const note = (id: string, text: string, x = 0) => ({ options: { id, text, x, y: 0 } });
const texts = (record: any) => record.nodes.map((n: any) => n.options.text).sort();

function slateDouble() {
  const slate: any = {
    options: { id: "slate-1", name: "Test", shareId: "", events: { onTakeSnapshot: vi.fn(), onUndoRedoChanged: vi.fn() } },
    nodes: { allNodes: [] as any[], clear: vi.fn(), one: vi.fn() },
    addNode: vi.fn(),
    broadcast: vi.fn(),
  };
  return slate;
}

const restoredBy = (slate: any) => JSON.parse(slate.broadcast.mock.calls.at(-1)[1].snapshot);
const flush = () => vi.advanceTimersByTimeAsync(0);

describe("first-class undo and redo", () => {
  let slate: any;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    slate = slateDouble();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("one step per gesture", () => {
    it("a drag that sends many changes over more than the pause is one step, recorded when the pointer is let go", async () => {
      const ur = new UndoRedo(slate, { debounceMs: 100 });
      slate.nodes.allNodes = [note("a", "A", 0)];
      ur.snap(true);
      ur.beginGesture();
      for (let x = 10; x <= 100; x += 10) {
        slate.nodes.allNodes = [note("a", "A", x)];
        ur.snap();
        vi.advanceTimersByTime(150); // longer than the pause between two changes
      }
      expect(ur.canUndo()).toBe(false);
      ur.endGesture();
      await Promise.resolve();
      expect(ur.canUndo()).toBe(true);
      ur.undo();
      await flush();
      expect(restoredBy(slate).nodes[0].options.x).toBe(0);
      expect(ur.canUndo()).toBe(false);
    });

    it("a press that changes nothing records nothing", async () => {
      const ur = new UndoRedo(slate);
      ur.snap(true);
      ur.beginGesture();
      ur.endGesture();
      await Promise.resolve();
      expect(ur.canUndo()).toBe(false);
    });

    it("an edit waiting for its pause when a gesture begins is a step of its own", async () => {
      const ur = new UndoRedo(slate, { debounceMs: 100 });
      slate.nodes.allNodes = [note("a", "A")];
      ur.snap(true);
      slate.nodes.allNodes = [note("a", "Typed")];
      ur.snap();
      ur.beginGesture();
      slate.nodes.allNodes = [note("a", "Typed", 50)];
      ur.snap();
      ur.endGesture();
      await Promise.resolve();
      ur.undo();
      await flush();
      expect(restoredBy(slate).nodes[0].options).toMatchObject({ text: "Typed", x: 0 });
      ur.undo();
      await flush();
      expect(restoredBy(slate).nodes[0].options.text).toBe("A");
    });
  });

  describe("redo history", () => {
    it("is cleared by a new step", async () => {
      const ur = new UndoRedo(slate);
      ur.snap(true);
      slate.nodes.allNodes = [note("a", "A")];
      ur.snap(true);
      ur.undo();
      await flush();
      expect(ur.canRedo()).toBe(true);
      slate.nodes.allNodes = [note("b", "B")];
      ur.forceSnapshot();
      expect(ur.canRedo()).toBe(false);
    });

    it("is not cleared by other people's changes", async () => {
      const ur = new UndoRedo(slate);
      ur.snap(true);
      slate.nodes.allNodes = [note("a", "A")];
      ur.snap(true);
      ur.undo();
      await flush();
      slate.nodes.allNodes = []; // the undo took A away (this double does not draw)
      const before = ur.beforeRemote();
      slate.nodes.allNodes = [note("b", "FromB")];
      ur.absorbRemote(before);
      expect(ur.canRedo()).toBe(true);
      ur.redo();
      await flush();
      expect(texts(restoredBy(slate))).toEqual(["A", "FromB"]);
    });
  });

  describe("a host's own steps", () => {
    it("are undone and redone by the host, in the same history as the drawing, with their names", async () => {
      const ur = new UndoRedo(slate);
      ur.snap(true);
      slate.nodes.allNodes = [note("a", "A")];
      ur.snap(true);
      const step = { label: "Move Audit log to Doing", undo: vi.fn(async () => true), redo: vi.fn(async () => true) };
      ur.recordHostStep(step);
      expect(ur.state()).toEqual({ canUndo: true, canRedo: false, undoLabel: "Move Audit log to Doing", redoLabel: null });

      const calls = slate.broadcast.mock.calls.length;
      ur.undo();
      await flush();
      expect(step.undo).toHaveBeenCalledTimes(1);
      // The drawing did not change with the host's step: it is not rebuilt or sent to the room.
      expect(slate.broadcast.mock.calls.length).toBe(calls);
      expect(ur.state().redoLabel).toBe("Move Audit log to Doing");

      ur.redo();
      await flush();
      expect(step.redo).toHaveBeenCalledTimes(1);

      // Undo twice: the host's step, then the note.
      ur.undo();
      await flush();
      ur.undo();
      await flush();
      expect(step.undo).toHaveBeenCalledTimes(2);
      expect(texts(restoredBy(slate))).toEqual([]);
    });

    it("a host step that cannot be undone says why, and is not offered for redo", async () => {
      const ur = new UndoRedo(slate);
      const outcomes: UndoRedoOutcome[] = [];
      ur.subscribe((_state, outcome) => outcome && outcomes.push(outcome));
      ur.snap(true);
      const message = "Priya moved Audit log since. Your move was not undone.";
      ur.recordHostStep({ undo: async () => ({ ok: false, message }), redo: async () => true });
      ur.undo();
      await flush();
      expect(outcomes.at(-1)).toEqual({ action: "undo", done: false, skipped: 0, message });
      expect(ur.canRedo()).toBe(false);
    });
  });

  describe("per person", () => {
    it("a step someone else has since changed entirely is passed over, said plainly, and the step before it is undone", async () => {
      const ur = new UndoRedo(slate);
      const outcomes: UndoRedoOutcome[] = [];
      ur.subscribe((_state, outcome) => outcome && outcomes.push(outcome));
      slate.nodes.allNodes = [note("w", "Welcome")];
      ur.snap(true);
      slate.nodes.allNodes = [note("w", "Welcome"), note("a", "Alpha")]; // mine: add Alpha
      ur.snap(true);
      slate.nodes.allNodes = [note("w", "Mine"), note("a", "Alpha")]; // mine: rename Welcome
      ur.snap(true);
      // Someone else renames that note again.
      const before = ur.beforeRemote();
      slate.nodes.allNodes = [note("w", "Theirs"), note("a", "Alpha")];
      ur.absorbRemote(before);

      ur.undo();
      await flush();
      // The rename is theirs now: the undo takes back Alpha instead, and keeps their name.
      expect(texts(restoredBy(slate))).toEqual(["Theirs"]);
      expect(outcomes.at(-1)).toMatchObject({ action: "undo", done: true, skipped: 1, message: OVERWRITTEN_SENTENCE });
    });

    it("when every step left was changed by someone else, nothing is undone and that is said", async () => {
      const ur = new UndoRedo(slate);
      const outcomes: UndoRedoOutcome[] = [];
      ur.subscribe((_state, outcome) => outcome && outcomes.push(outcome));
      slate.nodes.allNodes = [note("w", "Welcome")];
      ur.snap(true);
      slate.nodes.allNodes = [note("w", "Mine")];
      ur.snap(true);
      const before = ur.beforeRemote();
      slate.nodes.allNodes = [note("w", "Theirs")];
      ur.absorbRemote(before);
      expect(ur.undo()).toBe(false);
      expect(outcomes.at(-1)).toEqual({ action: "undo", done: false, skipped: 1, message: OVERWRITTEN_SENTENCE });
      expect(ur.canUndo()).toBe(false);
    });

    it("a step nobody else touched is undone as it is", async () => {
      const ur = new UndoRedo(slate);
      ur.snap(true);
      ur.snap(true); // a step that changed nothing visible
      expect(ur.undo()).toBe(true);
    });
  });

  describe("listeners", () => {
    it("hear when there comes to be something to undo or redo, and the host's event hears it too", async () => {
      const ur = new UndoRedo(slate);
      const states: any[] = [];
      const stop = ur.subscribe((state) => states.push(state));
      ur.snap(true);
      slate.nodes.allNodes = [note("a", "A")];
      ur.snap(true);
      ur.undo();
      await flush();
      expect(states.map((s) => [s.canUndo, s.canRedo])).toEqual([
        [false, false],
        [true, false],
        [false, true],
        [false, true], // the undo's outcome
      ]);
      expect(slate.options.events.onUndoRedoChanged).toHaveBeenCalledWith(
        expect.objectContaining({ canUndo: false, canRedo: true }),
        expect.objectContaining({ action: "undo", done: true })
      );
      stop();
      ur.redo();
      await flush();
      expect(states).toHaveLength(4);
    });
  });

  describe("keyboard", () => {
    let host: HTMLElement;
    let keyboard: Keyboard;
    let target: any;
    beforeEach(() => {
      host = document.createElement("div");
      document.body.appendChild(host);
      target = { element: host, undo: vi.fn(), redo: vi.fn(), getSelectedNodes: () => [], nodes: { allNodes: [] } };
      keyboard = new Keyboard(target);
      keyboard.bindGlobal();
    });
    afterEach(() => {
      keyboard.unbindGlobal();
      host.remove();
    });
    const press = (init: KeyboardEventInit) => document.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }));

    it("Ctrl+Shift+Z redoes when the browser reports a capital Z (Windows, Linux, Firefox)", () => {
      press({ key: "Z", code: "KeyZ", ctrlKey: true, shiftKey: true });
      expect(target.redo).toHaveBeenCalledTimes(1);
      expect(target.undo).not.toHaveBeenCalled();
    });

    it("Cmd+Shift+Z redoes, Cmd+Z undoes, Ctrl+Y redoes", () => {
      press({ key: "z", code: "KeyZ", metaKey: true, shiftKey: true });
      press({ key: "z", code: "KeyZ", metaKey: true });
      press({ key: "y", code: "KeyY", ctrlKey: true });
      expect(target.redo).toHaveBeenCalledTimes(2);
      expect(target.undo).toHaveBeenCalledTimes(1);
    });

    it("a layout whose letters are not Latin undoes by the key's place", () => {
      press({ key: "я", code: "KeyZ", ctrlKey: true });
      expect(target.undo).toHaveBeenCalledTimes(1);
    });

    it("leaves a text field's own undo alone", () => {
      const input = document.createElement("input");
      host.appendChild(input);
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "z", ctrlKey: true, bubbles: true }));
      expect(target.undo).not.toHaveBeenCalled();
    });
  });

  describe("a run someone else saved", () => {
    it("is drawn as theirs: no step of this person's, and their earlier step still undoes without taking it away", async () => {
      const notes: any[] = [{ id: "w", options: { id: "w", text: "Welcome", xPos: 100, yPos: 100, width: 200, height: 100 }, relationships: { associations: [] } }];
      const engine: any = {
        options: { id: "s", name: "S", events: {} },
        nodes: { allNodes: notes, one: (id: string) => notes.find((n) => n.options.id === id), clear: vi.fn() },
        broadcast: vi.fn(),
        addNode: vi.fn(),
      };
      const ur = new UndoRedo(engine);
      engine.undoRedo = ur;
      let others = 0;
      engine.othersChange = async (change: () => any) => {
        const before = ur.beforeRemote();
        others++;
        try {
          return await change();
        } finally {
          others--;
          ur.absorbRemote(before);
        }
      };
      engine.collab = {
        invoke: vi.fn((pkgs: any[]) => {
          for (const pkg of pkgs) {
            if (pkg.type === "onNodeAdded") notes.push({ id: pkg.data.nodeOptions.id, options: pkg.data.nodeOptions, relationships: { associations: [] } });
            if (!others) ur.snap(true);
          }
        }),
        send: vi.fn(),
      };
      ur.snap(true);
      notes[0].options.text = "Mine"; // this person's own step
      ur.snap(true);
      const result = applySlateOperations(engine, {
        message: "Added",
        operations: [{ kind: "add_nodes", count: 1, ids: ["agent-1"], shape: "rectangle", text: "From the agent" } as any],
      }, { replay: true, send: false });
      await result.applied;
      expect(ur.state().canUndo).toBe(true);
      ur.undo();
      await flush();
      const restored = restoredBy(engine);
      expect(restored.nodes.map((n: any) => n.options.text).sort()).toEqual(["From the agent", "Welcome"]);
      expect(ur.canUndo()).toBe(false);
    });
  });
});
