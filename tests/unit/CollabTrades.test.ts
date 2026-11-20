import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";
import { Collab } from "../../src/core/Collab";

// A note and a card trading places is the server's to decide: the stored slate records each
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

describe("trades the server decided, and a room that was not told", () => {
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

  /** A writer who made the note and left: the room holds its arrival, and maybe more. */
  function roomWith(...pkgs: any[]) {
    const writer = client(room, 10);
    writer.sync();
    for (const pkg of pkgs) {
      writer.collab.send(pkg);
      vi.advanceTimersByTime(5);
    }
    writer.sync();
    return writer;
  }

  it("note → card stored, the room still holds the note's arrival: a loader does not draw the old note, and tells the room", async () => {
    roomWith(added("delta"), moved("delta", 50));
    // The stored slate has no Delta note: the trade took it out.
    const host = slate({}, { collabTrades: { through: 5, trades: { delta: asCard(5) } } });
    const loader = client(room, 20, host);
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    expect(host.present.has("delta")).toBe(false);
    expect(loader.types()).not.toContain("onNodeAdded:delta");
    // The other note in the same move still moves.
    expect(loader.applied.some((p) => p.type === "onNodesMove" && p.data.nodes.some((n: any) => n.id === "other"))).toBe(true);

    await vi.advanceTimersByTimeAsync(3000);
    loader.sync();
    expect(roomAbout(room, "delta")).toEqual(["onNodeDeleted", "onNoteTraded@5"]);
    // And the next person to join does not see it either, whatever they know of trades.
    const later = client(room, 30, slate());
    later.sync();
    await later.collab.whenApplied();
    expect(later.host.present.has("delta")).toBe(false);
  });

  it("card → note stored, the room still holds the note's removal from an earlier trade: the stored note stays", async () => {
    roomWith(added("delta"), deleted("delta"));
    const host = slate({ delta: { text: "Delta", x: 300, y: 40 } }, { collabTrades: { through: 6, trades: { delta: asNote(6) } } });
    const loader = client(room, 20, host);
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    expect(host.present.has("delta")).toBe(true);

    await vi.advanceTimersByTimeAsync(3000);
    loader.sync();
    expect(roomAbout(room, "delta")).toEqual(["onNodeAdded", "onNoteTraded@6"]);
    const later = client(room, 30, slate());
    later.sync();
    await later.collab.whenApplied();
    expect(later.host.present.get("delta")).toMatchObject({ xPos: 300 });
  });

  it("a room that was told keeps its say: the note deleted after it became a note again stays deleted", async () => {
    const writer = roomWith(added("delta"));
    writer.collab.settleTrades({ delta: asNote(6) }, 6);
    expect(writer.collab.tellRoomOfTrade("delta")).toBe(true);
    vi.advanceTimersByTime(5);
    writer.collab.send(deleted("delta"));
    writer.sync();
    // The stored slate is older than the delete (the drawing save had not landed).
    const host = slate({ delta: { text: "Delta" } }, { collabTrades: { through: 6, trades: { delta: asNote(6) } } });
    const loader = client(room, 20, host);
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    expect(host.present.has("delta")).toBe(false);
    await vi.advanceTimersByTimeAsync(3000);
    expect(roomAbout(room, "delta")).toEqual(["onNoteTraded@6", "onNodeDeleted"]);
  });

  it("nobody tells the room before having it: a client not yet synced writes nothing", async () => {
    roomWith(added("delta"));
    const host = slate({}, { collabTrades: { through: 5, trades: { delta: asCard(5) } } });
    const loader = client(room, 20, host);
    loader.collab.documentLoaded();
    await vi.advanceTimersByTimeAsync(5000);
    expect(loader.map.size).toBe(0);
    loader.sync();
    await loader.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    loader.sync();
    expect(roomAbout(room, "delta")).toEqual(["onNodeDeleted", "onNoteTraded@5"]);
  });

  it("an open screen hears of a trade from the server whose page went away: it draws it, then tells the room", async () => {
    roomWith(added("delta"));
    const host = slate();
    const watcher = client(room, 20, host);
    watcher.sync();
    await watcher.collab.whenApplied();
    expect(host.present.has("delta")).toBe(true);
    // note → card, then card → note
    watcher.collab.settleTrades({ delta: asCard(5) }, 5);
    await watcher.collab.whenApplied();
    expect(host.present.has("delta")).toBe(false);
    watcher.collab.settleTrades({ delta: asNote(6, 420) }, 6);
    await watcher.collab.whenApplied();
    expect(host.present.get("delta")).toMatchObject({ xPos: 420 });
    expect(watcher.collab.tradesSettledThrough()).toBe(6);
    await vi.advanceTimersByTimeAsync(3000);
    watcher.sync();
    expect(roomAbout(room, "delta")).toEqual(["onNodeAdded", "onNoteTraded@6"]);
  });

  it("the page that made the trade tells the room at once, and a screen that heard of it from the server first adds nothing twice", async () => {
    roomWith(added("delta"));
    const maker = client(room, 20, slate());
    const other = client(room, 30, slate());
    maker.sync(); other.sync();
    await maker.collab.whenApplied(); await other.collab.whenApplied();
    maker.host.present.delete("delta"); // its own trade took the note off its screen
    other.collab.settleTrades({ delta: asCard(5) }, 5);
    maker.collab.settleTrades({ delta: asCard(5) }, 5);
    expect(maker.collab.tellRoomOfTrade("delta")).toBe(true);
    maker.sync(); other.sync();
    await other.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    other.sync();
    // Told once, by the maker: the other screen saw the room was told and wrote nothing.
    expect(roomAbout(room, "delta")).toEqual(["onNodeDeleted", "onNoteTraded@5"]);
    expect(other.map.size).toBe(room.getMap("collabPackages").size);
    expect(other.host.present.has("delta")).toBe(false);
  });

  it("a package about the note from a room not yet told is not applied on an open screen either", async () => {
    const writer = roomWith();
    const host = slate({ delta: { text: "Delta" } });
    const watcher = client(room, 20, host);
    watcher.sync();
    watcher.collab.settleTrades({ delta: asNote(6) }, 6);
    // Someone whose page had not heard yet removes the old note's arrival… then its removal arrives.
    writer.collab.send(deleted("delta"));
    writer.sync(); watcher.sync();
    await watcher.collab.whenApplied();
    expect(host.present.has("delta")).toBe(true);
  });

  it("an undo's replacement keeps what the room was told of trades", async () => {
    const writer = roomWith(added("delta"));
    writer.collab.settleTrades({ delta: asCard(5) }, 5);
    writer.host.present.delete("delta");
    writer.collab.tellRoomOfTrade("delta");
    vi.advanceTimersByTime(5);
    writer.collab.send({ type: "onSlateReplaced", data: { action: "undo", snapshot: '{"options":{},"nodes":[],"shareId":""}' } });
    writer.sync();
    expect(roomAbout(room, "delta")).toEqual(["onNoteTraded@5"]);
  });

  it("a replacement written before the trade and never told of it does not bring the note back", async () => {
    const writer = roomWith(added("delta"));
    writer.collab.send({ type: "onSlateReplaced", data: { action: "undo", snapshot: '{"options":{},"nodes":[{"options":{"id":"delta"}}],"shareId":""}' } });
    writer.sync();
    const host = slate({}, { collabTrades: { through: 5, trades: { delta: asCard(5) } } });
    const loader = client(room, 20, host);
    // Rebuilding from the replacement draws the note it holds.
    (loader.collab as any).handleRemotePackage.mockImplementation((pkg: any) => {
      loader.applied.push({ type: pkg.type, data: pkg.data });
      if (pkg.type === "onSlateReplaced") host.present.set("delta", { text: "Delta" });
      if (pkg.type === "onNodeDeleted") host.present.delete(pkg.data.id);
    });
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(0);
    expect(host.present.has("delta")).toBe(false);
  });

  it("a note this person lost to someone else's same trade comes back as the server has it", async () => {
    const host = slate();
    const loser = client(room, 20, host);
    loser.sync();
    loser.collab.settleTrades({ delta: asNote(6, 77) }, 6);
    await loser.collab.whenApplied();
    host.present.delete("delta"); // its own copy of the note was taken away
    loser.collab.keepTrade("delta");
    await loser.collab.whenApplied();
    expect(host.present.get("delta")).toMatchObject({ xPos: 77 });
  });

  it("a trade of this person's own on its way is not drawn over by an older one the server tells of (an undo straight after a redo)", async () => {
    const host = slate({ delta: { text: "Delta" } });
    const me = client(room, 20, host);
    me.sync();
    me.collab.settleTrades({ delta: asNote(2) }, 2);
    // Undo put the note back; its trade is on its way. The server's answer to the redo arrives late.
    let answer!: (v: unknown) => void;
    me.collab.holdTrade("delta", new Promise((resolve) => { answer = resolve; }));
    me.collab.settleTrades({ delta: asCard(3) }, 3);
    await me.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(host.present.has("delta")).toBe(true);
    expect(roomAbout(room, "delta")).toEqual([]);
    // The answer: the note again, at revision 4.
    me.collab.settleTrades({ delta: asNote(4) }, 4);
    answer(true);
    await vi.advanceTimersByTimeAsync(3000);
    me.sync();
    expect(host.present.has("delta")).toBe(true);
    expect(roomAbout(room, "delta")).toEqual(["onNodeAdded", "onNoteTraded@4"]);
  });

  it("without trades from the host, nothing changes: tellRoomOfTrade says it did nothing", () => {
    const writer = roomWith(added("delta"));
    expect(writer.collab.tellRoomOfTrade("delta")).toBe(false);
    expect(writer.collab.tradesSettledThrough()).toBe(0);
  });
});
