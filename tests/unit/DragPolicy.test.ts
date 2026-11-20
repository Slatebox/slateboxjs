import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FREE_NODE,
  GOVERNED_NODE,
  hitTestNodeBoxes,
  resolveGovernance,
  type DragPolicy,
} from "../../src/core/DragPolicy";
import { Keyboard } from "../../src/core/Keyboard";
import { serialize } from "../../src/core/Serialization";
import { applyLayout, packageLayout, removeLayoutOverlaps } from "../../src/core/Layout";

const node = (id: string, x = 0, y = 0, width = 100, height = 60, angle = 0): any => ({
  id,
  options: { id, x, y, width, height, text: id, rotate: { rotationAngle: angle } },
  position: vi.fn(function (this: any, nx: number, ny: number) {
    this.options.x = nx;
    this.options.y = ny;
  }),
});

const policyFor = (claims: Record<string, ReturnType<DragPolicy["governs"]>>, extra: Partial<DragPolicy> = {}): DragPolicy => ({
  governs: (n) => claims[n.id],
  onEnd: () => ({ accept: false }),
  ...extra,
});

describe("resolveGovernance", () => {
  it("leaves unclaimed notes alone and fills governed defaults for claimed ones", () => {
    const policy = policyFor({ card: true, lane: { canMove: false, canEditText: true }, column: { canMove: false, canSelect: false } });
    expect(resolveGovernance([policy], node("plain"))).toBeNull();
    expect(resolveGovernance([], node("card"))).toBeNull();
    expect(resolveGovernance([policy], node("card"))).toEqual({ policy, capabilities: GOVERNED_NODE });
    expect(resolveGovernance([policy], node("lane"))!.capabilities).toEqual({
      ...GOVERNED_NODE, canMove: false, canEditText: true,
    });
    expect(resolveGovernance([policy], node("column"))!.capabilities.canSelect).toBe(false);
    // A governed note may never be resized, rotated, deleted, duplicated or connected unless its host says so.
    expect(GOVERNED_NODE).toMatchObject({
      canMove: true, canResize: false, canRotate: false, canDelete: false, canDuplicate: false, canConnect: false, persist: false,
    });
    expect(Object.values(FREE_NODE).every(Boolean)).toBe(true);
    // A governed note is part of the picture unless its host says otherwise (a workshop's cards export).
    expect(GOVERNED_NODE.exportable).toBe(true);
    expect(FREE_NODE.exportable).toBe(true);
  });

  it("gives a note to the first policy that claims it, and treats a throwing policy as a claim", () => {
    const first = policyFor({ card: { canDelete: true } });
    const second = policyFor({ card: true, other: true });
    expect(resolveGovernance([first, second], node("card"))!.policy).toBe(first);
    expect(resolveGovernance([first, second], node("other"))!.policy).toBe(second);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const broken: DragPolicy = { governs: () => { throw new Error("boom"); }, onEnd: () => ({ accept: false }) };
    expect(resolveGovernance([broken], node("card"))!.capabilities).toEqual(GOVERNED_NODE);
    warn.mockRestore();
  });
});

describe("hitTestNodeBoxes", () => {
  it("finds the note under a world point, honouring padding and rotation", () => {
    const a = node("a", 0, 0, 100, 60);
    const b = node("b", 104, 0, 100, 60);
    expect(hitTestNodeBoxes({ x: 50, y: 30 }, [a, b])).toBe(a);
    expect(hitTestNodeBoxes({ x: 150, y: 59 }, [a, b])).toBe(b);
    expect(hitTestNodeBoxes({ x: 102, y: 30 }, [a, b])).toBeNull();
    expect(hitTestNodeBoxes({ x: 101, y: 30 }, [a, b], 2)).toBe(a);
    expect(hitTestNodeBoxes({ x: 50, y: 200 }, [a, b])).toBeNull();
    expect(hitTestNodeBoxes({ x: 50, y: 30 }, [])).toBeNull();
    // A 100x20 bar turned a quarter turn about its centre covers a tall, narrow area.
    const turned = node("t", 0, 0, 100, 20, 90);
    expect(hitTestNodeBoxes({ x: 50, y: 50 }, [turned])).toBe(turned);
    expect(hitTestNodeBoxes({ x: 5, y: 10 }, [turned])).toBeNull();
  });
});

describe("governed notes at the engine's enforcement sites", () => {
  let host: HTMLElement;
  let keyboard: Keyboard;
  let slate: any;
  let plain: any, card: any, lane: any;
  let keys: string[];

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    host = document.createElement("div");
    document.body.appendChild(host);
    plain = node("plain", 0, 0);
    card = node("card", 300, 0);
    lane = node("lane", 300, 100);
    keys = [];
    const policy = policyFor(
      { card: true, lane: { canMove: false } },
      { onKeyDown: (n, e) => { keys.push(n.id + ":" + e.key); return e.key === "ArrowRight"; } }
    );
    const governanceOf = (n: any) => resolveGovernance([policy], n);
    slate = {
      element: host,
      selected: [] as any[],
      getSelectedNodes: () => slate.selected,
      getAllNodes: () => [plain, card, lane],
      clearSelection: vi.fn(),
      selectNodes: vi.fn(),
      removeNode: vi.fn(),
      addNode: vi.fn(),
      broadcast: vi.fn(),
      announce: vi.fn(),
      nodes: { allNodes: [plain, card, lane], one: (id: string) => [plain, card, lane].find((n) => n.id === id) },
      options: {},
      governanceOf,
      capabilitiesOf: (n: any) => governanceOf(n)?.capabilities ?? FREE_NODE,
      isDerivedNode: (n: any) => !!governanceOf(n) && !governanceOf(n)!.capabilities.persist,
      freeNodes: (list?: any[]) => (list ?? slate.nodes.allNodes).filter((n: any) => !governanceOf(n)),
    };
    keyboard = new Keyboard(slate);
    keyboard.bindGlobal();
  });

  afterEach(() => {
    keyboard.unbindGlobal();
    host.remove();
    vi.restoreAllMocks();
  });

  const press = (key: string, init: KeyboardEventInit = {}) => {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    document.dispatchEvent(event);
    return event;
  };

  it("arrow keys nudge an ordinary note and never a governed one", () => {
    slate.selected = [plain];
    press("ArrowDown");
    expect(plain.position).toHaveBeenCalledWith(0, 5);
    slate.selected = [card];
    const down = press("ArrowDown");
    expect(card.position).not.toHaveBeenCalled();
    expect(down.defaultPrevented).toBe(true);
    expect(keys).toEqual(["card:ArrowDown"]);
  });

  it("offers each key to the policy of a selected governed note first", () => {
    slate.selected = [card];
    press("ArrowRight");
    expect(keys).toEqual(["card:ArrowRight"]);
    expect(card.position).not.toHaveBeenCalled();
    slate.selected = [plain];
    press("ArrowRight");
    expect(keys).toEqual(["card:ArrowRight"]);
    expect(plain.position).toHaveBeenCalledWith(5, 0);
  });

  it("Delete removes an ordinary note and leaves a governed one selected and in place", () => {
    slate.selected = [card];
    press("Delete");
    press("Backspace");
    expect(slate.removeNode).not.toHaveBeenCalled();
    expect(slate.clearSelection).not.toHaveBeenCalled();
    slate.selected = [plain];
    press("Delete");
    expect(slate.removeNode).toHaveBeenCalledWith("plain");
  });

  it("duplicate, copy and paste skip governed notes", () => {
    slate.selected = [card];
    press("d", { ctrlKey: true });
    press("c", { ctrlKey: true });
    press("v", { ctrlKey: true });
    expect(slate.addNode).not.toHaveBeenCalled();
    slate.selected = [plain];
    press("d", { ctrlKey: true });
    expect(slate.addNode).toHaveBeenCalledTimes(1);
  });

  it("serialize leaves governed notes out of the saved document and of undo snapshots", () => {
    expect(serialize(slate).nodes.map((n) => n.options.id)).toEqual(["plain"]);
    expect(serialize(slate, [plain, card]).nodes.map((n) => n.options.id)).toEqual(["plain"]);
  });

  it("layout passes move only ordinary notes", () => {
    expect(packageLayout(slate).map((m) => m.id)).toEqual(["plain"]);
    applyLayout(slate, [{ id: "card", x: 1, y: 2 }, { id: "plain", x: 9, y: 9 }], undefined, true);
    expect(card.position).not.toHaveBeenCalled();
    expect(plain.position).toHaveBeenCalled();
    card.options.x = 5; // overlapping the ordinary note
    card.options.y = 5;
    removeLayoutOverlaps(slate);
    expect(card.position).not.toHaveBeenCalled();
  });
});
