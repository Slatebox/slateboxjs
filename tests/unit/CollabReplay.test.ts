import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";
import { Collab } from "../../src/core/Collab";

// How a client rebuilds a slate from its room.
//
// The room is a Yjs map of packages. A client that joins receives all of them at
// once, grouped by the client that wrote them. These tests use real Yjs
// documents: `room` stands for the relay's copy, each `client()` for one browser.

type Applied = { type: string; data: any };

function slate(options: Record<string, any> = {}) {
  return {
    options: { id: "slate-1", events: {}, ...options },
    emitSlateChange: vi.fn(),
    undoRedo: { absorbRemote: vi.fn() },
  } as any;
}

/** One browser on the slate: its own Yjs document, exchanging updates with the room on demand. */
function client(room: Y.Doc, clientID: number, host: any = slate()) {
  const doc = new Y.Doc();
  doc.clientID = clientID;
  const map = doc.getMap<any>("collabPackages");
  const collab = new Collab(host);
  Object.assign(collab, { doc, collabMap: map, clientID });
  const applied: Applied[] = [];
  vi.spyOn(collab as any, "handleRemotePackage").mockImplementation((pkg: any) => {
    applied.push({ type: pkg.type, data: pkg.data });
  });
  map.observe((event) => {
    if (!event.transaction.local) (collab as any).applyRemoteChanges(event.keysChanged);
  });
  return {
    doc,
    map,
    collab,
    host,
    applied,
    /** Send this client's packages to the room and take the room's. */
    sync() {
      Y.applyUpdate(room, Y.encodeStateAsUpdate(doc, Y.encodeStateVector(room)));
      Y.applyUpdate(doc, Y.encodeStateAsUpdate(room, Y.encodeStateVector(doc)));
    },
    types: () => applied.map((pkg) => pkg.type + (pkg.data?.step ? ":" + pkg.data.step : "")),
  };
}

const move = (step: string) => ({ type: "onNodesMove", data: { step, nodes: [{ id: "n", x: 1, y: 1 }] } });
const replacement = (name: string) => ({
  type: "onSlateReplaced",
  data: { action: "undo", name, snapshot: '{"options":{},"nodes":[],"shareId":""}' },
});

describe("replaying a room", () => {
  let room: Y.Doc;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    room = new Y.Doc();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // Yjs delivers a room one writer at a time, not in the order it was written.
  // Whichever of the two writers has the higher id, a client that joins applies
  // the earlier package first.
  for (const [first, second] of [[10, 900], [900, 10]]) {
    it(`applies packages in the order they were written (client ${first} wrote before client ${second})`, () => {
      const early = client(room, first);
      early.collab.send(move("first"));
      early.sync();
      vi.advanceTimersByTime(60_000);
      const late = client(room, second);
      late.sync();
      late.collab.send(move("second"));
      late.sync();

      const joiner = client(room, 5000);
      joiner.sync();
      expect(joiner.types()).toEqual(["onNodesMove:first", "onNodesMove:second"]);
    });
  }

  it("orders by what each writer had seen, not by the writers' own clocks", () => {
    const fast = client(room, 10); // this person's clock runs an hour ahead
    vi.setSystemTime(1_000_000 + 3_600_000);
    fast.collab.send(move("first"));
    fast.sync();
    vi.setSystemTime(1_000_500);
    const slow = client(room, 900);
    slow.sync(); // has seen the first package
    slow.collab.send(move("second"));
    slow.sync();

    const joiner = client(room, 5000);
    joiner.sync();
    expect(joiner.types()).toEqual(["onNodesMove:first", "onNodesMove:second"]);
  });

  it("goes on with the room after a package that cannot be applied", () => {
    const writer = client(room, 10);
    writer.collab.send(move("first"));
    vi.advanceTimersByTime(10);
    writer.collab.send(move("second"));
    writer.sync();

    const joiner = client(room, 20);
    const seen: string[] = [];
    (joiner.collab as any).handleRemotePackage.mockImplementation((pkg: any) => {
      seen.push(pkg.data.step);
      if (pkg.data.step === "first") throw new TypeError("Cannot read properties of undefined (reading 'remove')");
    });
    expect(() => joiner.sync()).not.toThrow();
    expect(seen).toEqual(["first", "second"]);
  });

  it("waits for the notes of one package to be drawn before applying the next", async () => {
    const writer = client(room, 10);
    writer.collab.send({ type: "onNodeAdded", data: { nodeOptions: [{ id: "child", text: "" }] } });
    vi.advanceTimersByTime(10);
    writer.collab.send({ type: "onNodeTextChanged", data: { id: "child", text: "Child" } });
    writer.sync();

    let drawn!: () => void;
    let building: Promise<void> | null = null;
    const host = slate();
    host.whenBuilt = () => building;
    const joiner = client(room, 20, host);
    (joiner.collab as any).handleRemotePackage.mockImplementation((pkg: any) => {
      joiner.applied.push({ type: pkg.type, data: pkg.data });
      if (pkg.type === "onNodeAdded") building = new Promise<void>((resolve) => { drawn = resolve; });
    });
    joiner.sync();
    expect(joiner.types()).toEqual(["onNodeAdded"]); // the name waits: its note is not drawn yet

    building = null;
    drawn();
    await vi.advanceTimersByTimeAsync(0);
    expect(joiner.types()).toEqual(["onNodeAdded", "onNodeTextChanged"]);
    expect(host.undoRedo.absorbRemote).toHaveBeenCalledWith(false);
  });

  describe("after an undo", () => {
    it("the room holds the replacement and what was written after it; a new client rebuilds from both, in order", async () => {
      const author = client(room, 900);
      author.collab.send(move("before the undo"));
      vi.advanceTimersByTime(1000);
      author.collab.send(replacement("undo"));
      vi.advanceTimersByTime(1000);
      author.collab.send(move("after the undo"));
      author.sync();
      expect([...author.map.values()].map((pkg) => pkg.type)).toEqual(["onSlateReplaced", "onNodesMove"]);

      const joiner = client(room, 10);
      joiner.sync();
      await vi.advanceTimersByTimeAsync(0);
      expect(joiner.types()).toEqual(["onSlateReplaced", "onNodesMove:after the undo"]);
      expect(joiner.host.undoRedo.absorbRemote).toHaveBeenLastCalledWith(true);
    });

    it("the author's slate remembers which replacement it holds, for the document it stores next", () => {
      const author = client(room, 900);
      author.collab.send(replacement("undo"));
      const [key] = [...author.map.keys()];
      expect(author.host.options.collabBaseline).toEqual({ id: "slate-1", t: 1_000_000, c: 900, k: key });
      // The host is told after the marker is set: the document it stores holds it.
      expect(author.host.emitSlateChange).toHaveBeenCalledWith("onSlateReplaced", expect.anything());
    });

    it("a client whose stored document already holds the replacement keeps its document", async () => {
      const author = client(room, 900);
      author.collab.send(replacement("undo"));
      vi.advanceTimersByTime(1000);
      author.collab.send(move("after the undo"));
      author.sync();

      // The document was stored after the undo, with the author's marker in it.
      const joiner = client(room, 10, slate({ collabBaseline: { ...author.host.options.collabBaseline } }));
      joiner.sync();
      await vi.advanceTimersByTimeAsync(0);
      expect(joiner.types()).toEqual(["onNodesMove:after the undo"]);
    });

    it("a marker from another slate (a copy of this document) is not trusted", async () => {
      const author = client(room, 900);
      author.collab.send(replacement("undo"));
      author.sync();
      const copy = client(room, 10, slate({ collabBaseline: { ...author.host.options.collabBaseline, id: "the-original" } }));
      copy.sync();
      await vi.advanceTimersByTimeAsync(0);
      expect(copy.types()).toEqual(["onSlateReplaced"]);
    });

    it("a person who was working at that moment keeps what the undo had not seen", async () => {
      const a = client(room, 900);
      const b = client(room, 10);
      b.collab.send(move("B, unseen by A"));
      vi.advanceTimersByTime(5);
      a.collab.send(replacement("undo by A"));
      a.sync();
      b.sync();
      a.sync();
      await vi.advanceTimersByTimeAsync(0);

      // B rebuilds from A's replacement and puts its own move back on top.
      expect(b.types()).toEqual(["onSlateReplaced", "onNodesMove:B, unseen by A"]);
      // A receives B's move after its undo.
      expect(a.types()).toEqual(["onNodesMove:B, unseen by A"]);
      // Someone who joins now does what B did.
      const joiner = client(room, 5000);
      joiner.sync();
      await vi.advanceTimersByTimeAsync(0);
      expect(joiner.types()).toEqual(["onSlateReplaced", "onNodesMove:B, unseen by A"]);
    });

    it("two people undo at the same moment: everyone ends on the later one, and the room keeps only that one", async () => {
      const a = client(room, 900);
      const b = client(room, 10);
      a.collab.send(replacement("undo by A"));
      vi.advanceTimersByTime(5);
      b.collab.send(replacement("undo by B"));
      a.sync();
      b.sync();
      a.sync();
      await vi.advanceTimersByTimeAsync(0);

      expect(a.applied.map((pkg) => pkg.data.name)).toEqual(["undo by B"]); // A gives way to the later undo
      expect(b.applied).toEqual([]); // B already holds it; A's is ignored
      // A's own undo was stored a moment ago; A hands the host the slate again, as it now is.
      expect(a.host.emitSlateChange).toHaveBeenLastCalledWith("onSlateReplaced", { action: "superseded" });
      expect(b.host.emitSlateChange).toHaveBeenCalledTimes(1);
      a.sync();
      b.sync();
      expect([...room.getMap<any>("collabPackages").values()].map((pkg) => pkg.data.name)).toEqual(["undo by B"]);

      const joiner = client(room, 5000);
      joiner.sync();
      await vi.advanceTimersByTimeAsync(0);
      expect(joiner.applied.map((pkg) => pkg.data.name)).toEqual(["undo by B"]);
    });

    it("an undo that arrives while an earlier one is still being applied wins, once", async () => {
      const a = client(room, 900);
      a.collab.send(replacement("first"));
      a.sync();
      const joiner = client(room, 10);
      let finish!: () => void;
      (joiner.collab as any).handleRemotePackage.mockImplementation((pkg: any) => {
        joiner.applied.push({ type: pkg.type, data: pkg.data });
        return new Promise<void>((resolve) => { finish = resolve; });
      });
      joiner.sync();
      await vi.advanceTimersByTimeAsync(1000);
      expect(joiner.applied.map((pkg) => pkg.data.name)).toEqual(["first"]); // still loading
      a.collab.send(replacement("second"));
      a.sync();
      joiner.sync();
      await vi.advanceTimersByTimeAsync(0);
      expect(joiner.applied.map((pkg) => pkg.data.name)).toEqual(["first"]); // the second waits its turn
      finish();
      await vi.advanceTimersByTimeAsync(0);
      expect(joiner.applied.map((pkg) => pkg.data.name)).toEqual(["first", "second"]);
      finish();
      await vi.advanceTimersByTimeAsync(0);
      expect(joiner.applied.map((pkg) => pkg.data.name)).toEqual(["first", "second"]);
      expect(joiner.host.options.collabBaseline.t).toBe(a.host.options.collabBaseline.t);
    });
  });
});
