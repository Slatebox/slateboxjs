/**
 * compat-facade.ts — v1 runtime API facade
 *
 * Lets code written against the Raphael-era `slateboxjs` package
 * (`import { Slatebox } from 'slateboxjs'` → `new Slatebox.slate(options, events).init()`)
 * run on the v2 engine without changes. This module is the migration layer:
 * it wraps the modern v2 classes (`Slate`, `Node`, …) rather than modifying
 * their public APIs.
 *
 * Scope covered here (see docs/drop-in-contract.md):
 *  §A — namespace shape: `Slatebox.slate`, `Slatebox.node`, `Slatebox.base`,
 *        `Slatebox.utils`, plus the `window.Slatebox` global (wired in index.ts)
 *  §B (partial) — `(options, events)` constructor signature, `container`
 *        resolution by element id, async `.init()` resolving to the slate
 *  §C (partial) — `nodes.add/addRange/one/allNodes`, `exportJSON/loadJSON`
 *
 * Deeper option/event wiring, layout/canvas/controller methods and collab
 * bridging are tracked as separate contract items.
 */

import { Slate } from "./core/Slate";
import type { Node as V2Node, NodeOptions } from "./core/Node";
import * as utilsModule from "./utils";
import { v1NodeToV2, v1SlateToV2, v2NodeToV1 } from "./core/compat";
import { getAvailableFilters } from "./core/Filters";

/** v1-style events object passed as the 2nd constructor argument. */
export type V1Events = Record<string, ((...args: any[]) => any) | undefined>;

/**
 * v1-style node: constructed standalone (no slate required) and later
 * attached via `slate.nodes.add(node)`. Keeps its v1-shaped `options`
 * object; once added, `v2` points at the live v2 Node.
 */
class node {
  /**
   * Live v1-shaped options (xPos/yPos/foregroundColor/…). Before attachment
   * the proxy behaves like a plain object. Once attached, reads reflect the
   * current v2 NodeOptions and writes update both the v1 view and v2 model.
   */
  public options: Record<string, any>;

  private optionState: Record<string, any>;

  /** The live v2 node once this wrapper has been added to a slate. */
  public v2?: V2Node;

  /** Back-reference to the owning facade slate (set on add, like v1). */
  public slate?: slate;

  /** v1: `node.resize.set(w, h)` then `node.resize.send()` */
  public resize: NodeResizeFacade;

  /** v1: `node.relationships.addAssociation(otherNode)` / `.associations` */
  public relationships: NodeRelationshipsFacade;

  constructor(options: Record<string, any> = {}) {
    this.optionState = { id: utilsModule.guid(), ...options };
    this.options = new Proxy(this.optionState, {
      get: (target, property, receiver) => {
        if (typeof property !== "string" || !this.v2) {
          return Reflect.get(target, property, receiver);
        }
        const live = v2NodeToV1(this.v2.options || {});
        return Object.prototype.hasOwnProperty.call(live, property)
          ? live[property]
          : Reflect.get(target, property, receiver);
      },
      set: (target, property, value, receiver) => {
        const written = Reflect.set(target, property, value, receiver);
        if (written && typeof property === "string" && this.v2) {
          Object.assign(this.v2.options, v1NodeToV2({ [property]: value }));
        }
        return written;
      },
      deleteProperty: (target, property) => {
        const deleted = Reflect.deleteProperty(target, property);
        if (deleted && typeof property === "string" && this.v2) {
          const v2Property =
            {
              xPos: "x",
              yPos: "y",
              foregroundColor: "fontColor",
              shapeHint: "shape",
              svgString: "svgContent",
            }[property] || property;
          delete (this.v2.options as Record<string, any>)[v2Property];
        }
        return deleted;
      },
      ownKeys: (target) => {
        if (!this.v2) return Reflect.ownKeys(target);
        const liveKeys = Reflect.ownKeys(v2NodeToV1(this.v2.options || {}));
        return Array.from(new Set([...Reflect.ownKeys(target), ...liveKeys]));
      },
      getOwnPropertyDescriptor: (target, property) => {
        const existing = Reflect.getOwnPropertyDescriptor(target, property);
        if (existing || !this.v2 || typeof property !== "string") {
          return existing;
        }
        const live = v2NodeToV1(this.v2.options || {});
        if (Object.prototype.hasOwnProperty.call(live, property)) {
          return { configurable: true, enumerable: true, writable: true };
        }
        return undefined;
      },
    });
    this.resize = new NodeResizeFacade(this);
    this.relationships = new NodeRelationshipsFacade(this);
  }

  /**
   * v1: `node.png(withNodes?, cb)` — export this node (or the given group of
   * node ids) as a transparent-background PNG blob.
   */
  public png(
    withNodes: string[] | ((blob: Blob) => void) | undefined,
    cb?: (blob: Blob) => void,
  ): void {
    // v1 allows node.png(cb) with the group omitted
    const callback = typeof withNodes === "function" ? withNodes : cb;
    const group = Array.isArray(withNodes) ? withNodes : undefined;
    const v2Node = this.v2;
    if (!v2Node || !callback) return;
    const nodes = group && group.length > 0 ? group : [v2Node.id];
    (v2Node.slate as any).png(
      { nodes, noBackground: true, asBinary: true },
      (blob: any) => callback(blob),
    );
  }

  /** v1: `node.svg(withNodes?, cb)` — same as png but returns the SVG string. */
  public svg(
    withNodes: string[] | ((svg: string) => void) | undefined,
    cb?: (svg: string) => void,
  ): void {
    const callback = typeof withNodes === "function" ? withNodes : cb;
    const group = Array.isArray(withNodes) ? withNodes : undefined;
    const v2Node = this.v2;
    if (!v2Node || !callback) return;
    const nodes = group && group.length > 0 ? group : [v2Node.id];
    (v2Node.slate as any).svg({ nodes, noBackground: true }, (svg: string) =>
      callback(svg),
    );
  }

  /**
   * v1 API: position the node. `position('center')` centers it in the current
   * viewport (used right after adding a node from the shape palette);
   * `position({x, y})` / `position(x, y)` sets an explicit position. Before the
   * node is added (no v2 yet) this just stashes coordinates on options.
   */
  public position(coords?: any, maybeY?: number): this {
    const v2: any = this.v2;
    // Explicit coordinates (object or x,y pair).
    const explicit =
      coords && typeof coords === "object"
        ? { x: coords.x, y: coords.y }
        : typeof coords === "number"
          ? { x: coords, y: maybeY }
          : null;

    if (!v2) {
      if (explicit) {
        this.options.x = explicit.x;
        this.options.y = explicit.y;
      }
      return this;
    }

    if (explicit && explicit.x != null && explicit.y != null) {
      v2.position(explicit.x, explicit.y);
      return this;
    }

    // 'center' (or no args): center the node in the current viewport.
    try {
      const svgEl: any = (v2.slate as any)?.canvas?.node;
      const vb = svgEl?.getAttribute?.("viewBox");
      if (vb) {
        const p = String(vb)
          .split(/[\s,]+/)
          .map(Number);
        if (p.length === 4 && p.every((n) => !isNaN(n))) {
          const cx = p[0] + p[2] / 2;
          const cy = p[1] + p[3] / 2;
          const w = v2.options.width || 0;
          const h = v2.options.height || 0;
          v2.position(cx - w / 2, cy - h / 2);
        }
      }
    } catch (e) {
      /* noop — centering is a nicety, never fatal */
    }
    return this;
  }
}

/**
 * v1 resize sub-object: `set()` stages new dimensions, `send()` applies them
 * (v1 additionally broadcast to collab; broadcasting is the host app's job
 * via the packages it already sends).
 */
class NodeResizeFacade {
  private owner: node;
  private pending?: { width: number; height: number };

  constructor(owner: node) {
    this.owner = owner;
  }

  public set(width: number, height: number): void {
    this.pending = { width, height };
    this.owner.options.width = width;
    this.owner.options.height = height;
    // v1 applied the size immediately on set(); send() finalized/broadcast
    this.owner.v2?.setSize(width, height);
  }

  public send(): void {
    if (!this.pending || !this.owner.v2) return;
    const v2Node = this.owner.v2;
    v2Node.setSize(this.pending.width, this.pending.height);
    // v1: send() broadcasts the resize as an onNodeResized package
    (v2Node.slate as any)?.emitSlateChange?.("onNodeResized", {
      id: v2Node.id,
      width: this.pending.width,
      height: this.pending.height,
      rotate: (v2Node.options as any).rotate,
      vectorPath: (v2Node.options as any).vectorPath,
      associations: (
        (v2Node as any).relationships?.getAssociations?.() ?? []
      ).map((a: any) => ({
        parentId: a.parentId,
        childId: a.childId,
        linePath: "",
      })),
    });
    this.pending = undefined;
  }
}

/**
 * v1 relationships sub-object. v1 exposed `.associations` as an array whose
 * entries carry live `parent`/`child` node references (the Meteor app reads
 * `a.parent.options.id`); v2 stores plain id-based Association records.
 */
class NodeRelationshipsFacade {
  private owner: node;

  constructor(owner: node) {
    this.owner = owner;
  }

  /** v1: `node.relationships.addAssociation(childNode, data?)` */
  public addAssociation(child: node | V2Node, data?: Record<string, any>) {
    if (!this.owner.v2) {
      throw new Error(
        "SLATEBOX_COMPAT: add the node to a slate before creating associations",
      );
    }
    const childV2 = child instanceof node ? child.v2 : child;
    if (!childV2) {
      throw new Error(
        "SLATEBOX_COMPAT: child node must be added to the slate first",
      );
    }
    return (this.owner.v2 as any).relationships?.addAssociation(childV2, data);
  }

  /** v1: `.associations` — array with live parent/child wrapper references */
  public get associations(): Array<Record<string, any>> {
    const v2Node = this.owner.v2;
    const slateFacade = this.owner.slate;
    if (!v2Node || !slateFacade) return [];
    const list =
      (v2Node as any).relationships?.getAssociations?.() ?? ([] as any[]);
    return list.map((a: any) => ({
      ...a,
      parent: slateFacade.nodes.one(a.parentId),
      child: slateFacade.nodes.one(a.childId),
    }));
  }
}

/**
 * Facade over the v2 NodesManager exposing the v1 `slate.nodes` surface.
 * v1 takes node INSTANCES (`nodes.add(new Slatebox.node({...}))`) while v2's
 * manager takes plain options — this adapter accepts both.
 */
class NodesFacade {
  private owner: slate;
  private wrappers = new Map<string, node>();

  constructor(owner: slate) {
    this.owner = owner;
  }

  private get v2Slate(): Slate {
    if (!this.owner.v2) {
      throw new Error(
        "SLATEBOX_COMPAT: slate.init() must complete before using slate.nodes",
      );
    }
    return this.owner.v2;
  }

  /** v1: `slate.nodes.add(nodeInstance)` — also accepts a plain options object. */
  public add(n: node | Record<string, any>): node {
    const wrapper = n instanceof node ? n : new node(n);
    const v2Options = v1NodeToV2(wrapper.options) as Partial<NodeOptions>;
    // Route through Slate.addNode (not NodesManager directly) so host-facing
    // side effects fire: onSlateChanged emission, BirdsEye refresh, a11y announce
    const v2Node = this.v2Slate.addNode(v2Options);
    wrapper.v2 = v2Node;
    wrapper.slate = this.owner;
    this.wrappers.set(v2Node.id, wrapper);
    return wrapper;
  }

  /** v1: `slate.nodes.addRange([...])` */
  public addRange(list: Array<node | Record<string, any>>): node[] {
    return (list || []).map((n) => this.add(n));
  }

  /** v1: `slate.nodes.one(id)` → node (or undefined) */
  public one(id: string): node | undefined {
    const v2Node = this.v2Slate.nodes.one(id);
    if (!v2Node) return undefined;
    return this.wrap(v2Node);
  }

  /** v1: `slate.nodes.allNodes` → array property */
  public get allNodes(): node[] {
    return this.v2Slate.nodes.allNodes.map((n) => this.wrap(n));
  }

  /**
   * v1: `slate.nodes.packageLayout()` — payload sent to the server-side
   * layout calculator: `{layoutType, associations, nodes, uniqueIds, subgraphs}`.
   */
  public packageLayout(): Record<string, any> {
    const v2 = this.v2Slate;
    const all = v2.nodes.allNodes;
    const associations: Array<Record<string, any>> = [];
    const nodes: Record<string, any> = {};
    const subgraphs: Record<string, string[]> = {};

    all.forEach((nx: any) => {
      const opts = nx.options || {};
      const v1Opts = v2NodeToV1(opts);
      (nx.relationships?.getAssociations?.() ?? []).forEach((a: any) => {
        associations.push({
          parentId: a.parentId,
          childId: a.childId,
          lineWidth: a.lineWidth,
          lineType: a.lineType,
          lineCurveType: a.lineCurveType,
          lineCurviness: a.lineCurviness,
          lineOpacity: a.lineOpacity,
          showParentArrow: a.showParentArrow,
          showChildArrow: a.showChildArrow,
        });
      });
      if (!nodes[nx.id]) {
        nodes[nx.id] = {
          width: +(opts.width || 0),
          height: +(opts.height || 0),
          shape: v1Opts.shapeHint || opts.shape || "rect",
          color: opts.backgroundColor,
          textColor: v1Opts.foregroundColor ?? opts.fontColor,
          text: opts.text,
          groupId: opts.groupId ?? null,
        };
      }
      const gid = String(opts.groupId ?? "null");
      if (!subgraphs[gid]) subgraphs[gid] = [];
      subgraphs[gid].push(nx.id);
    });

    return {
      layoutType: this.owner.options.layoutType,
      associations,
      nodes,
      uniqueIds: Object.keys(nodes),
      subgraphs,
    };
  }

  /**
   * v1: `slate.nodes.applyLayout(layout, cbOrOpts?)` — layout is the server
   * response `{exportNodes: {id: {x, y}}}` with stringly coordinates.
   */
  public applyLayout(
    layout: Record<string, any>,
    cbOrOpts?: (() => void) | { skipCenter?: boolean },
  ): void {
    const v2 = this.v2Slate;
    const exportNodes = layout?.exportNodes || {};
    const cb = typeof cbOrOpts === "function" ? cbOrOpts : undefined;
    const opts = typeof cbOrOpts === "object" ? cbOrOpts : {};

    const moves = Object.keys(exportNodes)
      .filter((id) => v2.nodes.one(id))
      .map((id) => ({
        id,
        x: parseFloat(exportNodes[id].x),
        y: parseFloat(exportNodes[id].y),
      }));
    v2.applyLayout(moves, cb);
    if (!opts.skipCenter) {
      v2.centerContent();
    }
  }

  /**
   * v1: `slate.nodes.nodeMovePackage({dur, moves: [{id, x: dx, y: dy}]})` —
   * moves are RELATIVE deltas; the returned package carries the resulting
   * ABSOLUTE positions in v1 shape, ready for `collab.exe({type:'onNodesMove'})`.
   */
  public nodeMovePackage(
    opts: {
      dur?: number;
      easing?: string;
      moves?: Array<{ id: string; x: number; y: number }>;
      nodes?: Array<node | V2Node>;
    } = {},
  ): Record<string, any> {
    const v2 = this.v2Slate;
    const deltas = new Map((opts.moves || []).map((m) => [m.id, m] as const));
    const targets: any[] = opts.nodes
      ? opts.nodes.map((n) => (n instanceof node ? n.v2 : n)).filter(Boolean)
      : opts.moves
        ? (opts.moves.map((m) => v2.nodes.one(m.id)).filter(Boolean) as any[])
        : v2.nodes.allNodes;

    return {
      dur: opts.dur ?? 300,
      easing: opts.easing ?? ">",
      textPositions: targets.map((nx: any) => ({
        id: nx.id,
        textPosition: { x: 0, y: 0, transform: "" },
      })),
      nodeOptions: targets.map((nx: any) => {
        const delta = deltas.get(nx.id);
        const v1Opts = v2NodeToV1(nx.options || {});
        return {
          id: nx.id,
          vectorPath: v1Opts.vectorPath,
          xPos: (v1Opts.xPos ?? 0) + (delta?.x ?? 0),
          yPos: (v1Opts.yPos ?? 0) + (delta?.y ?? 0),
        };
      }),
      associations: targets.flatMap((nx: any) =>
        (nx.relationships?.getAssociations?.() ?? []).map((a: any) => ({
          parentId: a.parentId,
          childId: a.childId,
          linePath: "",
          id: a.id,
        })),
      ),
    };
  }

  /**
   * Return the stable wrapper for a v2 node, creating one lazily for nodes
   * that came into existence outside this facade (e.g. loadJSON).
   */
  private wrap(v2Node: V2Node): node {
    let wrapper = this.wrappers.get(v2Node.id);
    if (!wrapper) {
      wrapper = new node({ ...(v2Node.options as Record<string, any>) });
      wrapper.options.id = v2Node.id;
      wrapper.v2 = v2Node;
      wrapper.slate = this.owner;
      this.wrappers.set(v2Node.id, wrapper);
    }
    return wrapper;
  }
}

/**
 * v1-style slate: `const s = await new Slatebox.slate(options, events).init()`.
 *
 * v1 differences bridged here:
 *  - constructor takes `(options, events)`; v2 takes `(element, options)`
 *  - `options.container` is an element ID string (e.g. "slateCanvas"); v2
 *    wants the element (or a CSS selector)
 *  - `.init()` is async and resolves to the slate itself
 */
class slate {
  public options: Record<string, any>;
  public events: V1Events;
  public nodes: NodesFacade;

  /** The live v2 Slate once init() has run. */
  public v2?: Slate;

  private _shareId: string;
  public userId?: string;
  public orgId?: string;

  /**
   * v1: hosts assign `slate.shareId = X` AFTER init (createSlate.js does) and
   * expect it to persist through exportJSON. Route writes into the live v2
   * options (which serialization reads) once available.
   */
  public get shareId(): string {
    return (
      ((this.v2 as any)?.options?.shareId as string | undefined) ??
      this._shareId
    );
  }

  public set shareId(value: string) {
    this._shareId = value;
    if (this.v2) {
      (this.v2 as any).options.shareId = value;
    }
  }

  /** v1: `slate.savingTemplateImage` — host-managed re-entrancy flag */
  public savingTemplateImage = false;

  /** v1: `slate.controller.scaleToFitAndCenter(cb?, dur?)` */
  public controller: {
    scaleToFitAndCenter: (cb?: () => void, dur?: number) => void;
  };

  /** v1: `slate.canvas.hideBg(opacity?)` — clear background for snapshots */
  public canvas: { hideBg: (opacity?: number) => void };

  /** The step-through presentation controller (start/next/previous/stop). */
  public get presentation(): any {
    return this.v2?.presentation;
  }

  constructor(options: Record<string, any> = {}, events: V1Events = {}) {
    // Spread FIRST: hosts pass `id: undefined` for new slates, and spreading
    // after the default would clobber the generated guid with undefined —
    // losing the id the URL/persistence layer expects.
    this.options = {
      ...options,
      id: options.id || utilsModule.guid(),
    };
    this.events = events || {};
    this._shareId = this.options.shareId || utilsModule.guid();
    this.nodes = new NodesFacade(this);

    this.controller = {
      scaleToFitAndCenter: (cb?: () => void) => {
        this.assertReady();
        // fitToContent() already frames AND centers on the node bounds.
        // Do NOT also call centerContent() — it centers on the whole-SVG
        // bbox (contaminated by marker/def elements near origin) and would
        // yank the view off the content.
        this.v2!.fitToContent();
        cb?.();
      },
    };

    this.canvas = {
      hideBg: () => {
        this.assertReady();
        const el = (this.v2 as any).element as HTMLElement | undefined;
        if (el) {
          el.style.backgroundColor = "transparent";
          el.style.backgroundImage = "none";
        }
      },
    };
  }

  /** Resolve v1 `options.container` (id string or element) to an HTMLElement. */
  private resolveContainer(): HTMLElement {
    const container = this.options.container;
    if (container && typeof container !== "string") {
      // Already an element
      return container as HTMLElement;
    }
    if (typeof container === "string" && container.length > 0) {
      // v1 semantics: bare element id first, CSS selector as fallback
      const byId = document.getElementById(container);
      if (byId) return byId;
      const bySelector = document.querySelector<HTMLElement>(container);
      if (bySelector) return bySelector;
      throw new Error(
        `SLATEBOX_COMPAT: container "${container}" not found in document`,
      );
    }
    throw new Error("SLATEBOX_COMPAT: options.container is required");
  }

  /** v1: async init resolving to the slate itself. */
  public async init(): Promise<this> {
    const element = this.resolveContainer();
    const v2Options = v1SlateToV2(this.options) as Record<string, any>;
    delete v2Options.container;
    if (this.options.shareId === undefined) {
      v2Options.shareId = this._shareId;
    }
    // v1 takes events as the 2nd constructor arg; v2 nests them in options.
    // The callback names are shared between both generations.
    v2Options.events = this.events;
    this.v2 = new Slate(element, v2Options);
    // v2 Slate self-initializes; readiness is signaled by the viewport promise
    await this.v2.getViewportAsync();

    // v1 maintained `options.viewPort.zoom = {w, h, l, t, r}` at runtime and
    // the Meteor app reads `zoom.r` directly (QuickNodeActions). Expose `r`
    // as a live getter over the v2 zoom level.
    if (!this.options.viewPort) this.options.viewPort = {};
    const zoomState: Record<string, any> = {
      ...(this.options.viewPort.zoom || {}),
    };
    Object.defineProperty(zoomState, "r", {
      enumerable: true,
      get: () => {
        try {
          return this.v2?.getZoom() || 1;
        } catch {
          return 1;
        }
      },
    });
    this.options.viewPort.zoom = zoomState;

    // v1: slate.init() auto-connects collaboration (after a short delay)
    // when allowCollaboration is on. Only meaningful when the host has
    // registered onInitCollaboration to supply the URL + auth params.
    // v1 TIMING: onSlateChanged never fired before collab init completed
    // (packages traveled through the yjs echo), and host apps rely on that —
    // defer emissions until the handshake settles, then flush.
    if (
      (this.options.allowCollaboration ?? true) &&
      this.events.onInitCollaboration
    ) {
      const v2 = this.v2 as any;
      v2.deferEmits?.();
      setTimeout(() => {
        const initPromise: Promise<void> =
          v2?.collab?.init({ roomName: this.options.id }) ?? Promise.resolve();
        initPromise
          .catch((error: unknown) =>
            console.warn("SLATEBOX_COMPAT: collab init failed", error),
          )
          .finally(() => v2?.flushEmits?.());
      }, 100);
    }

    return this;
  }

  /** v1: `slate.exportJSON()` → JSON string */
  public exportJSON(): string {
    this.assertReady();
    return this.v2!.exportJSON();
  }

  /** v1: `slate.loadJSON(jsonString)` */
  public async loadJSON(json: string): Promise<void> {
    this.assertReady();
    await this.v2!.loadJSON(json);
  }

  /**
   * Lifecycle: `slate.destroy()` — tears down the slate. Delegates to the v2
   * Slate's destroy(), which deregisters from `window.__slateboxInstances`,
   * disconnects the ResizeObserver, clears all timers/intervals, removes the
   * canvas handler, and chains destroy to sub-modules (panZoom/zoomSlider/…).
   *
   * The host app MUST call this when unmounting a canvas (React unmount / route
   * change) — otherwise every navigation LEAKS a Slate: its timers, observers,
   * and `__slateboxInstances` entry persist (the array grows unbounded across
   * navigations). Best-effort: safe to call more than once and before ready.
   */
  public destroy(): void {
    try {
      this.v2?.destroy();
    } catch (e) {
      /* best-effort teardown — never throw from destroy */
    }
  }

  /**
   * v1: `slate.getOrientation()` → `{orientation, width, height, left, top}`
   * computed over the bounding box of all nodes (10px padding, like v1),
   * falling back to the viewport dimensions when the slate is empty.
   */
  public getOrientation(): {
    orientation: "landscape" | "portrait";
    width: number;
    height: number;
    left: number;
    top: number;
  } {
    this.assertReady();
    return this.v2!.getOrientation();
  }

  /**
   * v1: `slate.collab.exe/invoke/send/updateUserData` — the live v2 Collab
   * instance exposes the same four methods.
   */
  public get collab() {
    this.assertReady();
    return (this.v2 as any).collab;
  }

  /** v1: `slate.keyboard.bindGlobal()/unbindGlobal()` (NodeDrawer uses it) */
  public get keyboard() {
    this.assertReady();
    return (this.v2 as any).keyboard;
  }

  /**
   * v1: `slate.filters.availableFilters` — an object keyed by filter name, each
   * with a `types` array. The node Effects pane iterates Object.keys(...) and
   * reads `[name].types` to decide which effects to show, so the shape matters.
   */
  public get filters(): {
    availableFilters: Record<string, { types: string[] }>;
  } {
    return {
      availableFilters: getAvailableFilters(),
    };
  }

  /** v1: `slate.undoRedo` / `slate.birdsEye` passthroughs */
  public get undoRedo() {
    this.assertReady();
    return (this.v2 as any).undoRedo;
  }

  public get birdsEye() {
    this.assertReady();
    return (this.v2 as any).birdsEye;
  }

  /**
   * Grouping/locking controls used by the canonical app. These deliberately
   * live on the facade so hosts never need to discover the active engine via
   * the internal `window.__slateboxInstances` lifecycle registry.
   *
   * Event callbacks such as `onGroupSelection` carry live v2 nodes, while
   * older integrations may pass facade node wrappers. Accept both shapes and
   * delegate the actual mutation to the engine so persistence, collaboration,
   * and undo continue through the normal `onNodesMove` path.
   */
  public groupNodes(nodes?: Array<node | V2Node>): string | null {
    this.assertReady();
    return this.v2!.groupNodes(this.unwrapNodes(nodes));
  }

  public ungroupNodes(nodes?: Array<node | V2Node>): void {
    this.assertReady();
    this.v2!.ungroupNodes(this.unwrapNodes(nodes));
  }

  public lockNodes(nodes?: Array<node | V2Node>): void {
    this.assertReady();
    this.v2!.lockNodes(this.unwrapNodes(nodes));
  }

  public unlockNodes(nodes?: Array<node | V2Node>): void {
    this.assertReady();
    this.v2!.unlockNodes(this.unwrapNodes(nodes));
  }

  public isSelectionLocked(nodes?: Array<node | V2Node>): boolean {
    this.assertReady();
    return this.v2!.isSelectionLocked(this.unwrapNodes(nodes));
  }

  private unwrapNodes(nodes?: Array<node | V2Node>): V2Node[] | undefined {
    if (!nodes) return undefined;
    return nodes
      .map((candidate) =>
        candidate instanceof node ? candidate.v2 : candidate,
      )
      .filter((candidate): candidate is V2Node => !!candidate);
  }

  /**
   * v1: `slate.disable(exemptSlate?, exemptNodes?, full?)` — freeze
   * interactions (used when the app opens read-only/embedded views).
   */
  public disable(
    exemptSlate?: unknown,
    exemptNodes?: unknown,
    full?: boolean,
  ): void {
    this.assertReady();
    const v2 = this.v2 as any;
    if (!exemptNodes) {
      v2.nodes.allNodes.forEach((n: any) => n.lock?.());
    }
    if (!exemptSlate) {
      this.options.enabled = false;
      this.options.allowDrag = false;
      v2.disablePanZoom?.();
      if (full) {
        v2.birdsEye?.disable?.();
        v2.zoomSlider?.disable?.();
      }
    }
  }

  /** v1: `slate.enable(exemptSlate?, exemptNodes?)` — reverse of disable() */
  public enable(exemptSlate?: unknown, exemptNodes?: unknown): void {
    this.assertReady();
    const v2 = this.v2 as any;
    if (!exemptNodes) {
      v2.nodes.allNodes.forEach((n: any) => {
        if (!n.options?.isLocked) n.unlock?.();
      });
    }
    if (!exemptSlate) {
      this.options.enabled = true;
      this.options.allowDrag = true;
      v2.enablePanZoom?.();
    }
  }

  /** v1: `slate.png({base64: true}, cb)` — thumbnail export */
  public png(
    opts?: Record<string, any>,
    callback?: (result: string | Blob) => void,
  ): Promise<string | Blob> {
    this.assertReady();
    return this.v2!.png(opts as any, callback);
  }

  private assertReady(): void {
    if (!this.v2) {
      throw new Error("SLATEBOX_COMPAT: slate.init() must complete before use");
    }
  }
}

/**
 * v1 exported a `base` class carrying a static plugin registry. The Meteor
 * app does not use it directly (verified against all 13 importing files);
 * this minimal port exists so `Slatebox.base` is present for any external
 * v1 consumers that subclass it.
 */
class base {
  private static availablePlugins: Record<
    string,
    Array<{ name: string; plugin: new (payload?: any) => any }>
  > = {};

  public plugins?: Record<string, any>;

  constructor(initPayload?: any) {
    this.registerPlugins(initPayload);
  }

  public registerPlugins(initPayload?: any): void {
    const root = this.constructor.name;
    const registered = base.availablePlugins[root];
    if (registered) {
      registered.forEach(({ name, plugin: Plugin }) => {
        if (!this.plugins) this.plugins = {};
        this.plugins[name] = new Plugin(initPayload);
      });
    }
  }

  public static registerPlugin(details: {
    name: string;
    plugin: new (payload?: any) => any;
  }): void {
    if (!details?.name || !details?.plugin) {
      throw new Error(
        "Plugins must provide a name and a plugin (class definition)",
      );
    }
    const root = Object.getPrototypeOf(details.plugin).name;
    if (!base.availablePlugins[root]) {
      base.availablePlugins[root] = [];
    }
    base.availablePlugins[root] = [...base.availablePlugins[root], details];
  }
}

/**
 * The v1 namespace object: `import { Slatebox } from 'slateboxjs'`.
 * Also assigned to `window.Slatebox` in index.ts.
 */
export const Slatebox = {
  slate,
  node,
  base,
  utils: utilsModule,
};

export { slate as CompatSlate, node as CompatNode, base as CompatBase };
