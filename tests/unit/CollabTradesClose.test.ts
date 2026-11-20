import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";
import { Collab } from "../../src/core/Collab";

// trade-close (2026-11-20): what the trade-attack review left open, beside its own tests
// (CollabTradesAttack.test.ts). A note and a card trading places is the server's to decide: the stored slate records each
// trade (which note became a card, which card a note, at which workshop revision), in the same
// write as the board and the drawing. The room only follows. When the page that made a trade goes
// away before it told the room, the room still holds what was there before the trade (the note's
// arrival, or its removal), and a client that draws the stored slate and then replays the room
// must not let that old entry win. Any client that knows of a trade the room has not been told
// of tells it, from the stored slate, once it has the room.
//
// `room` stands for the relay's copy, each `client()` for one browser, with real Yjs documents.

type Applied = { type: string; data: any };

/** A slate whose notes are a set of ids (and their options), changed by the packages applied to it. */
function slate(notes: Record<string, any> = {}, options: Record<string, any> = {}) {
  const present = new Map<string, any>(Object.entries(notes));
  return {
    present,
    options: { id: "slate-1", events: {}, ...options },
    emitSlateChange: vi.fn(),
    nodes: { one: (id: string) => (present.has(id) ? { id, options: { id, ...present.get(id) } } : undefined) },
    undoRedo: { beforeRemote: vi.fn(() => "before"), absorbRemote: vi.fn() },
  } as any;
}

function client(room: Y.Doc, clientID: number, host: any = slate()) {
  const doc = new Y.Doc();
  doc.clientID = clientID;
  const map = doc.getMap<any>("collabPackages");
  const collab = new Collab(host);
  Object.assign(collab, { doc, collabMap: map, clientID, synced: false });
  const applied: Applied[] = [];
  vi.spyOn(collab as any, "handleRemotePackage").mockImplementation((pkg: any) => {
    applied.push({ type: pkg.type, data: pkg.data });
    if (pkg.type === "onNodeDeleted") host.present.delete(pkg.data.id);
    if (pkg.type === "onNodeAdded") {
      const list = Array.isArray(pkg.data.nodeOptions) ? pkg.data.nodeOptions : [pkg.data.nodeOptions];
      for (const n of list) if (!host.present.has(n.id)) host.present.set(n.id, n);
    }
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
    /** Exchange updates with the room; the first exchange is this client's sync with it. */
    sync() {
      Y.applyUpdate(room, Y.encodeStateAsUpdate(doc, Y.encodeStateVector(room)));
      Y.applyUpdate(doc, Y.encodeStateAsUpdate(room, Y.encodeStateVector(doc)));
      if (!(collab as any).synced) (collab as any).roomSynced(true);
    },
    types: () => applied.map((pkg) => pkg.type + ":" + (pkg.data?.id ?? (pkg.data?.nodeOptions?.[0]?.id ?? pkg.data?.nodeOptions?.id))),
  };
}

/** What the room says about note `id`: its packages' types, in the order written. */
function roomAbout(room: Y.Doc, id: string) {
  const out: { type: string; t: number; r?: number }[] = [];
  room.getMap<any>("collabPackages").forEach((pkg: any, key: string) => {
    const d = pkg?.data;
    const ids = [d?.id, d?.trade, ...(Array.isArray(d?.nodeOptions) ? d.nodeOptions.map((n: any) => n.id) : [d?.nodeOptions?.id]),
      ...(Array.isArray(d?.nodes) ? d.nodes.map((n: any) => n.id) : [])];
    if (ids.includes(id)) out.push({ type: pkg.type, t: pkg.timestamp, ...(d?.trade ? { r: d.r } : {}) });
  });
  return out.sort((a, b) => a.t - b.t).map((e) => e.type + (e.r ? "@" + e.r : ""));
}

const added = (id: string, x = 10) => ({ type: "onNodeAdded", data: { id, nodeOptions: { id, text: "Delta", xPos: x, yPos: 10 } } });
const deleted = (id: string) => ({ type: "onNodeDeleted", data: { id, isComment: false } });
const moved = (id: string, x: number) => ({ type: "onNodesMove", data: { nodes: [{ id, x, y: 10 }, { id: "other", x: 1, y: 1 }] } });
const asCard = (r: number) => ({ r, as: "card" as const });
const asNote = (r: number, x = 300) => ({ r, as: "note" as const, note: { options: { id: "delta", text: "Delta", xPos: x, yPos: 40 } } });

describe("trade-close: the room's half of a trade, and an undo whose trade is on its way", () => {
  let room: Y.Doc;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    room = new Y.Doc();
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  /** A client whose slate is rebuilt from a replacement's snapshot (its notes, by id). */
  function rebuilding(c: ReturnType<typeof client>) {
    (c.collab as any).handleRemotePackage.mockImplementation((pkg: any) => {
      c.applied.push({ type: pkg.type, data: pkg.data });
      if (pkg.type === "onSlateReplaced") {
        c.host.present.clear();
        for (const n of JSON.parse(pkg.data.snapshot).nodes ?? []) c.host.present.set(n.options.id, n.options);
      }
      if (pkg.type === "onNodeDeleted") c.host.present.delete(pkg.data.id);
      if (pkg.type === "onNodeAdded") { for (const n of [].concat(pkg.data.nodeOptions) as any[]) if (!c.host.present.has(n.id)) c.host.present.set(n.id, n); }
    });
    return c;
  }
  const replacement = (ids: string[]) => ({ type: "onSlateReplaced", data: { action: "undo",
    snapshot: JSON.stringify({ options: {}, nodes: ids.map((id) => ({ options: { id, text: id, xPos: 1, yPos: 1 } })), shareId: "" }) } });

  it("a loader that drew the stored note follows the trader's room half when it arrives (the trader moved the note before its answer)", async () => {
    // The stored slate holds the note as the play saved it (x=300); the room has not been told yet.
    const host = slate({ delta: { id: "delta", text: "Delta", x: 300, y: 40, xPos: 300, yPos: 40 } }, { collabTrades: { through: 5, trades: { delta: asNote(5, 300) } } });
    const loader = client(room, 20, host);
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    expect(host.present.get("delta")?.xPos).toBe(300);
    // The trader's answer: it tells the room from its own copy, moved to x=390 meanwhile.
    const trader = client(room, 10, slate({ delta: { id: "delta", text: "Delta", x: 390, y: 40, xPos: 390, yPos: 40 } }));
    trader.sync();
    trader.collab.settleTrades({ delta: asNote(5, 300) }, 5);
    expect(trader.collab.tellRoomOfTrade("delta")).toBe(true);
    trader.sync();
    loader.sync();
    await loader.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    loader.sync();
    expect(host.present.get("delta")?.xPos).toBe(390);
    // Told once: the loader saw the room was told and wrote nothing of its own.
    expect(roomAbout(room, "delta")).toEqual(["onNodeAdded", "onNoteTraded@5"]);
  });

  it("a screen whose copy of the note came from the room is not drawn again by a later trade half (nothing is removed and re-added)", async () => {
    // The note arrived through the room, after the room was told of its trade: the screen's copy is the room's.
    const trader = client(room, 10, slate({ delta: { id: "delta", text: "Delta", x: 390, y: 40, xPos: 390, yPos: 40 } }));
    trader.sync();
    trader.collab.settleTrades({ delta: asNote(5, 300) }, 5);
    trader.collab.tellRoomOfTrade("delta");
    trader.sync();
    const watcher = client(room, 20, slate());
    watcher.sync();
    await watcher.collab.whenApplied();
    watcher.collab.settleTrades({ delta: asNote(5, 300) }, 5);
    await watcher.collab.whenApplied();
    expect(watcher.host.present.get("delta")?.xPos).toBe(390);
    expect(watcher.types().filter((t) => t === "onNodeDeleted:delta")).toEqual([]);
  });

  it("an undo's replacement does not take away a traded note while that undo's own trade is on its way; the trade's half does, once saved", async () => {
    // Card -> note, saved (r=1) and told.
    const writer = client(room, 10, slate({ delta: { id: "delta", text: "Delta", x: 300, y: 40, xPos: 300, yPos: 40 } }));
    writer.sync();
    writer.collab.settleTrades({ delta: asNote(1) }, 1);
    writer.collab.tellRoomOfTrade("delta");
    writer.sync();
    const watcher = rebuilding(client(room, 20, slate()));
    watcher.sync();
    await watcher.collab.whenApplied();
    watcher.collab.settleTrades({ delta: asNote(1) }, 1);
    await watcher.collab.whenApplied();
    expect(watcher.host.present.has("delta")).toBe(true);
    // Undo: the native host holds the undo's trade (note -> card), then the replacement goes out.
    let answer!: (v: unknown) => void;
    writer.collab.holdTrade("delta", new Promise((resolve) => { answer = resolve; }));
    vi.advanceTimersByTime(5);
    writer.collab.send(replacement(["other"]));
    writer.sync(); watcher.sync();
    await watcher.collab.whenApplied();
    expect(watcher.host.present.has("other")).toBe(true);
    expect(watcher.host.present.has("delta")).toBe(true);
    // The undo's trade is saved (r=2): the writer tells the room, and the note leaves every screen.
    writer.host.present.delete("delta");
    writer.collab.settleTrades({ delta: asCard(2) }, 2);
    answer(true);
    await Promise.resolve();
    expect(writer.collab.tellRoomOfTrade("delta")).toBe(true);
    writer.sync(); watcher.sync();
    await watcher.collab.whenApplied();
    expect(watcher.host.present.has("delta")).toBe(false);
    // And the next to load, from the stored slate (no Delta) and the room, agrees.
    const loader = rebuilding(client(room, 30, slate({ other: { id: "other" } }, { collabTrades: { through: 2, trades: { delta: asCard(2) } } })));
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(loader.host.present.has("delta")).toBe(false);
  });

  it("a replacement with no trade on its way (a redo of an ordinary delete) still takes a traded note away, on open screens and loaders", async () => {
    const writer = client(room, 10, slate({ delta: { id: "delta", text: "Delta", x: 300, y: 40, xPos: 300, yPos: 40 } }));
    writer.sync();
    writer.collab.settleTrades({ delta: asNote(1) }, 1);
    writer.collab.tellRoomOfTrade("delta");
    writer.sync();
    const watcher = rebuilding(client(room, 20, slate()));
    watcher.sync();
    await watcher.collab.whenApplied();
    watcher.collab.settleTrades({ delta: asNote(1) }, 1);
    await watcher.collab.whenApplied();
    expect(watcher.host.present.has("delta")).toBe(true);
    vi.advanceTimersByTime(5);
    writer.collab.send(replacement(["other"]));
    writer.sync(); watcher.sync();
    await watcher.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(watcher.host.present.has("delta")).toBe(false);
    const loader = rebuilding(client(room, 30, slate({ delta: { id: "delta" }, other: { id: "other" } }, { collabTrades: { through: 1, trades: { delta: asNote(1) } } })));
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(loader.host.present.has("delta")).toBe(false);
  });

  it("a replacement made while the undo's trade is on its way brings no traded note to a screen that does not have it (note -> card undone, page gone)", async () => {
    // Note -> card, saved (r=1) and told: nobody has Delta as a note.
    const writer = client(room, 10, slate());
    writer.sync();
    writer.collab.settleTrades({ delta: asCard(1) }, 1);
    writer.collab.tellRoomOfTrade("delta");
    writer.sync();
    const watcher = rebuilding(client(room, 20, slate()));
    watcher.sync();
    watcher.collab.settleTrades({ delta: asCard(1) }, 1);
    await watcher.collab.whenApplied();
    // Undo brings the note back: its trade (card -> note) is held, the replacement goes out, the page closes.
    writer.collab.holdTrade("delta", new Promise(() => {}));
    vi.advanceTimersByTime(5);
    writer.collab.send(replacement(["delta"]));
    writer.sync(); watcher.sync();
    await watcher.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(watcher.host.present.has("delta")).toBe(false);
    const loader = rebuilding(client(room, 30, slate({}, { collabTrades: { through: 1, trades: { delta: asCard(1) } } })));
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(loader.host.present.has("delta")).toBe(false);
  });
});

describe("trade-close: a drawing saved without someone's undo is saved again once that undo is drawn", () => {
  // A's page handed its host a change (A's trade, then its drawing save) a moment before B's undo
  // reached it: that save, made without B's undo, can land after B's own save of it, and the stored
  // slate then holds A's notes as they were before B's undo (trade-attack F4). Once A has drawn B's
  // undo, A's host is handed the slate again, as it now is, so the stored slate ends on what
  // everyone sees.
  let room: Y.Doc;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    room = new Y.Doc();
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
  const undo = { type: "onSlateReplaced", data: { action: "undo", snapshot: '{"options":{},"nodes":[],"shareId":""}' } };

  it("a screen whose host was handed a change a moment ago saves again after rebuilding from someone else's undo", async () => {
    const a = client(room, 10);
    const b = client(room, 20);
    a.sync(); b.sync();
    a.collab.noteHostChange("onNodeDeleted");
    vi.advanceTimersByTime(300);
    b.collab.send(undo);
    b.sync(); a.sync();
    await a.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(0);
    expect(a.applied.map((p) => p.type)).toContain("onSlateReplaced");
    expect(a.host.emitSlateChange).toHaveBeenLastCalledWith("onSlateReplaced", { action: "superseded" });
  });

  it("an idle screen, or one whose last change is long saved, does not save again", async () => {
    const a = client(room, 10);
    const idle = client(room, 30);
    const b = client(room, 20);
    a.sync(); b.sync(); idle.sync();
    a.collab.noteHostChange("onNodeDeleted");
    vi.advanceTimersByTime(30_000);
    // A change that is only a view (a pan) is not saved.
    a.collab.noteHostChange("onCanvasMove");
    b.collab.send(undo);
    b.sync(); a.sync(); idle.sync();
    await a.collab.whenApplied(); await idle.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(0);
    expect(a.applied.map((p) => p.type)).toContain("onSlateReplaced");
    expect(a.host.emitSlateChange).not.toHaveBeenCalled();
    expect(idle.host.emitSlateChange).not.toHaveBeenCalled();
  });
});
