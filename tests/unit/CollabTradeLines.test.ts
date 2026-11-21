import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";
import { Collab } from "../../src/core/Collab";

// A card that became a note keeps its lines to notes (connected cards). When the page that made
// the trade goes away before it tells the room, screens that are already open draw the note from
// the server's trade record: the record carries the note's lines, and those screens draw them too,
// and tell the room of them with the note. A trade record keyed by an id the store could not use
// as a key (an old note id) names the note itself (`id`).

function slate(notes: Record<string, any> = {}) {
  const present = new Map<string, any>(Object.entries(notes));
  return { present, options: { id: "slate-1", events: {} }, emitSlateChange: vi.fn(),
    nodes: { one: (id: string) => (present.has(id) ? { id, options: { id, ...present.get(id) } } : undefined) },
    undoRedo: { beforeRemote: vi.fn(() => "before"), absorbRemote: vi.fn() } } as any;
}

function client(room: Y.Doc, clientID: number, host: any) {
  const doc = new Y.Doc();
  doc.clientID = clientID;
  const map = doc.getMap<any>("collabPackages");
  const collab = new Collab(host);
  Object.assign(collab, { doc, collabMap: map, clientID, synced: false });
  const applied: { type: string; data: any }[] = [];
  vi.spyOn(collab as any, "handleRemotePackage").mockImplementation((pkg: any) => {
    applied.push({ type: pkg.type, data: pkg.data });
    if (pkg.type === "onNodeAdded") {
      const list = Array.isArray(pkg.data.nodeOptions) ? pkg.data.nodeOptions : [pkg.data.nodeOptions];
      for (const n of list) host.present.set(n.id, n);
    }
  });
  return { doc, map, collab, host, applied,
    sync() {
      Y.applyUpdate(room, Y.encodeStateAsUpdate(doc, Y.encodeStateVector(room)));
      Y.applyUpdate(doc, Y.encodeStateAsUpdate(room, Y.encodeStateVector(doc)));
      if (!(collab as any).synced) (collab as any).roomSynced(true);
    } };
}

const line = { id: "sing->alpha", parentId: "sing", childId: "alpha", lineColor: "#666666" };

describe("a card that became a note on a page that went away: open screens get its lines", () => {
  let room: Y.Doc;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    room = new Y.Doc();
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it("draws the note and then its lines from the server's record, and tells the room of both", async () => {
    const watcher = client(room, 20, slate({ sing: { text: "sing" } }));
    watcher.sync();
    await watcher.collab.whenApplied();
    watcher.collab.settleTrades({ alpha: { r: 6, as: "note", note: { options: { id: "alpha", text: "Alpha", xPos: 300, yPos: 40 } }, lines: [line] } as any }, 6);
    await watcher.collab.whenApplied();
    expect(watcher.applied.map((p) => p.type + ":" + (p.data.id ?? ""))).toEqual(["onNodeAdded:alpha", "addRelationship:sing->alpha"]);
    await vi.advanceTimersByTimeAsync(3000);
    watcher.sync();
    const told: string[] = [];
    room.getMap<any>("collabPackages").forEach((pkg: any) => told.push(pkg.type + ":" + (pkg.data?.id ?? pkg.data?.trade)));
    expect(told).toEqual(expect.arrayContaining(["onNodeAdded:alpha", "addRelationship:sing->alpha", "onNoteTraded:alpha"]));
  });

  it("a record kept under another key names its note", async () => {
    const watcher = client(room, 20, slate());
    watcher.sync();
    await watcher.collab.whenApplied();
    watcher.collab.settleTrades({ "enc-b2xkLm5vdGU": { r: 3, as: "note", id: "old.note", note: { options: { id: "old.note", text: "Old" } } } as any }, 3);
    await watcher.collab.whenApplied();
    expect(watcher.host.present.has("old.note")).toBe(true);
  });
});
