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

describe("trade-attack: a bystander that drew the trade from the publication", () => {
  let room: Y.Doc;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    room = new Y.Doc();
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it("follows the trader's room half when the trader moved the note before its answer (card -> note, then a move within 50 ms)", async () => {
    // The trader: the card became the note at x=300 (what the play saved), then it was moved to x=390
    // before the answer came back. Its answer: the room is told from the trader's copy.
    const traderHost = slate({ delta: { id: "delta", text: "Delta", x: 390, y: 40, xPos: 390, yPos: 40 } });
    const trader = client(room, 10, traderHost);
    trader.sync();
    // The bystander hears of the trade through the publication first, and draws it as saved.
    const bystanderHost = slate();
    const bystander = client(room, 20, bystanderHost);
    bystander.sync();
    bystander.collab.settleTrades({ delta: asNote(5, 300) }, 5);
    await bystander.collab.whenApplied();
    expect(bystanderHost.present.get("delta")?.xPos).toBe(300);
    // The trader's answer: it settles the same record and tells the room.
    trader.collab.settleTrades({ delta: asNote(5, 300) }, 5);
    expect(trader.collab.tellRoomOfTrade("delta")).toBe(true);
    trader.sync();
    bystander.sync();
    await bystander.collab.whenApplied();
    vi.advanceTimersByTime(3000);
    await bystander.collab.whenApplied();
    // The room and the stored slate (the trader's drawing save) say x=390: so must the bystander.
    const told = [...room.getMap<any>("collabPackages").values()].find((p: any) => p.type === "onNodeAdded");
    expect(told?.data?.nodeOptions?.xPos).toBe(390);
    expect(bystanderHost.present.get("delta")?.xPos).toBe(390);
  });

  it("an undo's replacement whose trade never reached the server does not take away the note the server holds (undo, then the tab closed at once)", async () => {
    // Card -> note, saved (r=1) and told: the room holds the arrival and the marker.
    const writerHost = slate({ delta: { id: "delta", text: "Delta", x: 300, y: 40 } });
    const writer = client(room, 10, writerHost);
    writer.sync();
    writer.collab.settleTrades({ delta: asNote(1) }, 1);
    writer.collab.tellRoomOfTrade("delta");
    vi.advanceTimersByTime(5);
    // Undo: the whole slate without the note goes to the room at once; its trade (note -> card)
    // never reaches the server because the tab is closed at once.
    writer.collab.send({ type: "onSlateReplaced", data: { action: "undo", snapshot: '{"options":{},"nodes":[],"shareId":""}' } });
    writer.sync();
    // The server still holds the note (trade r=1, as note) and no card.
    const host = slate({ delta: { id: "delta", text: "Delta", xPos: 300, yPos: 40 } }, { collabTrades: { through: 1, trades: { delta: asNote(1) } } });
    const loader = client(room, 20, host);
    (loader.collab as any).handleRemotePackage.mockImplementation((pkg: any) => {
      loader.applied.push({ type: pkg.type, data: pkg.data });
      if (pkg.type === "onSlateReplaced") host.present.clear();
      if (pkg.type === "onNodeDeleted") host.present.delete(pkg.data.id);
      if (pkg.type === "onNodeAdded") { const l = [].concat(pkg.data.nodeOptions); for (const n of l as any[]) if (!host.present.has(n.id)) host.present.set(n.id, n); }
    });
    loader.collab.documentLoaded();
    loader.sync();
    await loader.collab.whenApplied();
    await vi.advanceTimersByTimeAsync(3000);
    expect(host.present.has("delta")).toBe(true);
  });
});
