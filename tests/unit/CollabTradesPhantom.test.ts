import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";
import { Collab } from "../../src/core/Collab";

// staging-2 F4 (2026-11-20): B moves Gamma; A drops the Delta note on a lane (note -> card); B
// presses Ctrl+Z at the same instant. On 2 of 5 staging runs every screen and every fresh joiner
// drew Delta twice, the card and a note, while the server stored only the card. B's undo (a
// whole-slate replacement drawn from B's history, which still had Delta as a note) reached A's
// page before A's trade was answered. A rebuilt from it and drew Delta again, because only notes
// the replacement's writer held were kept as they were, not A's own trade on its way. When the
// answer came, A told the room of its trade from that copy: the room's half of a note -> card
// trade said the note is there. The room then holds a note the server's trade record says is a
// card, on every replay.
//
// `room` stands for the relay's copy, each `client()` for one browser, with real Yjs documents.

type Applied = { type: string; data: any };

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

/** One browser. Its slate is rebuilt from a replacement's snapshot (its notes, by id). */
function client(room: Y.Doc, clientID: number, host: any = slate()) {
  const doc = new Y.Doc();
  doc.clientID = clientID;
  const map = doc.getMap<any>("collabPackages");
  const collab = new Collab(host);
  Object.assign(collab, { doc, collabMap: map, clientID, synced: false });
  const applied: Applied[] = [];
  vi.spyOn(collab as any, "handleRemotePackage").mockImplementation((pkg: any) => {
    applied.push({ type: pkg.type, data: pkg.data });
    if (pkg.type === "onSlateReplaced") {
      host.present.clear();
      for (const n of JSON.parse(pkg.data.snapshot).nodes ?? []) host.present.set(n.options.id, n.options);
    }
    if (pkg.type === "onNodeDeleted") host.present.delete(pkg.data.id);
    if (pkg.type === "onNodeAdded") {
      for (const n of [].concat(pkg.data.nodeOptions) as any[]) if (!host.present.has(n.id)) host.present.set(n.id, n);
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
    sync() {
      Y.applyUpdate(room, Y.encodeStateAsUpdate(doc, Y.encodeStateVector(room)));
      Y.applyUpdate(doc, Y.encodeStateAsUpdate(room, Y.encodeStateVector(doc)));
      if (!(collab as any).synced) (collab as any).roomSynced(true);
    },
  };
}

/** What the room says about note `id`: its packages' types, in the order written. */
function roomAbout(room: Y.Doc, id: string) {
  const out: { type: string; t: number; r?: number; as?: string }[] = [];
  room.getMap<any>("collabPackages").forEach((pkg: any) => {
    const d = pkg?.data;
    const ids = [d?.id, d?.trade, ...(Array.isArray(d?.nodeOptions) ? d.nodeOptions.map((n: any) => n.id) : [d?.nodeOptions?.id])];
    if (ids.includes(id)) out.push({ type: pkg.type, t: pkg.timestamp, ...(d?.trade ? { r: d.r } : {}) });
  });
  return out.sort((a, b) => a.t - b.t).map((e) => e.type + (e.r ? "@" + e.r : ""));
}

const note = (id: string, x = 10) => ({ id, text: id, x, y: 10, xPos: x, yPos: 10 });
const asCard = (r: number) => ({ r, as: "card" as const });
const asNote = (r: number, x = 300) => ({ r, as: "note" as const, note: { options: { id: "delta", text: "delta", xPos: x, yPos: 40 } } });
/** B's undo: the slate as B's history had it, Delta still a note there. */
const undoTo = (notes: Record<string, any>) => ({ type: "onSlateReplaced", data: { action: "undo",
  snapshot: JSON.stringify({ options: {}, nodes: Object.values(notes).map((options) => ({ options })), shareId: "" }) } });

describe("staging-2 F4: an undo from someone else while this page's own trade is on its way", () => {
  let room: Y.Doc;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    room = new Y.Doc();
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  /** Gamma and Delta are notes on A, B and C; A has just dropped Delta on a lane (its trade is on its way). */
  async function setUp() {
    const a = client(room, 10, slate({ gamma: note("gamma"), delta: note("delta", 200) }));
    const b = client(room, 20, slate({ gamma: note("gamma", 40), delta: note("delta", 200) }));
    const c = client(room, 30, slate({ gamma: note("gamma", 40), delta: note("delta", 200) }));
    a.sync(); b.sync(); c.sync();
    // A's note -> card: the note leaves A's canvas at once, and A holds the trade until answered.
    let answer!: (v: unknown) => void;
    a.host.present.delete("delta");
    a.collab.holdTrade("delta", new Promise((resolve) => { answer = resolve; }));
    // B's undo of its Gamma move goes out at the same instant, and reaches A before A's answer.
    vi.advanceTimersByTime(5);
    b.collab.send(undoTo({ gamma: note("gamma"), delta: note("delta", 200) }));
    b.sync(); a.sync(); c.sync();
    await a.collab.whenApplied(); await c.collab.whenApplied();
    // A's answer: the server stored the trade (r=1, a card). A's host settles it, then the
    // note's removal goes out, which tells the room of the trade.
    // B and C hear of the trade from the server's publication about then, before the room is told.
    a.collab.settleTrades({ delta: asCard(1) }, 1);
    b.collab.settleTrades({ delta: asCard(1) }, 1);
    c.collab.settleTrades({ delta: asCard(1) }, 1);
    await a.collab.whenApplied(); await b.collab.whenApplied(); await c.collab.whenApplied();
    answer(true);
    await Promise.resolve(); await Promise.resolve();
    a.collab.tellRoomOfTrade("delta");
    a.sync(); b.sync(); c.sync();
    await a.collab.whenApplied(); await b.collab.whenApplied(); await c.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    a.sync(); b.sync(); c.sync();
    await a.collab.whenApplied(); await b.collab.whenApplied(); await c.collab.whenApplied();
    return { a, b, c };
  }

  it("the trading page keeps its own copy of the note as it was (gone) through the rebuild", async () => {
    const { a } = await setUp();
    expect(a.host.present.has("delta")).toBe(false);
    expect(a.host.present.has("gamma")).toBe(true);
  });

  it("the room's half of a note -> card trade takes the note away, whatever the trader draws", async () => {
    await setUp();
    expect(roomAbout(room, "delta")).toEqual(["onNodeDeleted", "onNoteTraded@1"]);
  });

  it("no screen and no fresh joiner draws the note the server says is a card", async () => {
    const { b, c } = await setUp();
    expect(b.host.present.has("delta")).toBe(false);
    expect(c.host.present.has("delta")).toBe(false);
    const joiner = client(room, 40, slate({ gamma: note("gamma") }, { collabTrades: { through: 1, trades: { delta: asCard(1) } } }));
    joiner.collab.documentLoaded();
    joiner.sync();
    await joiner.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(joiner.host.present.has("delta")).toBe(false);
    // A joiner that has not heard of the trade from its server yet follows the room's record.
    const early = client(room, 50, slate({ gamma: note("gamma") }));
    early.sync();
    await early.collab.whenApplied();
    expect(early.host.present.has("delta")).toBe(false);
  });
});

describe("staging-2 F4: the room never brings back a note its trade record says is a card", () => {
  let room: Y.Doc;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    room = new Y.Doc();
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it("a later replacement that still holds the note (drawn from an older history) does not bring it back, on open screens and joiners", async () => {
    const a = client(room, 10, slate({ gamma: note("gamma") }));
    a.sync();
    a.collab.settleTrades({ delta: asCard(1) }, 1);
    a.collab.tellRoomOfTrade("delta");
    a.sync();
    const c = client(room, 30, slate({ gamma: note("gamma") }));
    c.sync();
    // B's undo replacement, from a history in which Delta was still a note, with no trade of B's on its way.
    const b = client(room, 20, slate({ gamma: note("gamma", 40), delta: note("delta", 200) }));
    b.sync();
    vi.advanceTimersByTime(5);
    b.collab.send(undoTo({ gamma: note("gamma"), delta: note("delta", 200) }));
    b.sync(); a.sync(); c.sync();
    await a.collab.whenApplied(); await c.collab.whenApplied();
    expect(a.host.present.has("delta")).toBe(false);
    expect(c.host.present.has("delta")).toBe(false);
    const joiner = client(room, 40, slate());
    joiner.sync();
    await joiner.collab.whenApplied();
    expect(joiner.host.present.has("delta")).toBe(false);
    expect(joiner.host.present.has("gamma")).toBe(true);
  });

  it("a note the room has seen a newer trade for (card -> note) is drawn", async () => {
    const a = client(room, 10, slate({ gamma: note("gamma") }));
    a.sync();
    a.collab.settleTrades({ delta: asCard(1) }, 1);
    a.collab.tellRoomOfTrade("delta");
    a.sync();
    // Delta comes back as a note: trade r=2, told by the trader with its note.
    a.host.present.set("delta", note("delta", 300));
    a.collab.settleTrades({ delta: asNote(2) }, 2);
    a.collab.tellRoomOfTrade("delta");
    a.sync();
    const b = client(room, 20, slate({ gamma: note("gamma", 40), delta: note("delta", 300) }));
    b.sync();
    vi.advanceTimersByTime(5);
    b.collab.send(undoTo({ gamma: note("gamma"), delta: note("delta", 300) }));
    b.sync(); a.sync();
    await a.collab.whenApplied();
    expect(a.host.present.has("delta")).toBe(true);
    const joiner = client(room, 40, slate());
    joiner.sync();
    await joiner.collab.whenApplied();
    expect(joiner.host.present.has("delta")).toBe(true);
  });

  it("a page that knows of a newer trade than the room's record (back to a note, not told yet) keeps the note", async () => {
    const a = client(room, 10, slate({ gamma: note("gamma") }));
    a.sync();
    a.collab.settleTrades({ delta: asCard(1) }, 1);
    a.collab.tellRoomOfTrade("delta");
    a.sync();
    const c = client(room, 30, slate({ gamma: note("gamma"), delta: note("delta", 300) }));
    c.sync();
    c.collab.settleTrades({ delta: asNote(2) }, 2);
    await c.collab.whenApplied();
    const b = client(room, 20, slate({ gamma: note("gamma", 40), delta: note("delta", 300) }));
    b.sync();
    vi.advanceTimersByTime(5);
    b.collab.send(undoTo({ gamma: note("gamma"), delta: note("delta", 300) }));
    b.sync(); c.sync();
    await c.collab.whenApplied();
    expect(c.host.present.has("delta")).toBe(true);
  });
});
