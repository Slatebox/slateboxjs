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
import { v1NodeToV2, v1SlateToV2 } from "./core/compat";

/** v1-style events object passed as the 2nd constructor argument. */
export type V1Events = Record<string, ((...args: any[]) => any) | undefined>;

/**
 * v1-style node: constructed standalone (no slate required) and later
 * attached via `slate.nodes.add(node)`. Keeps its v1-shaped `options`
 * object; once added, `v2` points at the live v2 Node.
 */
class node {
  /** v1-shaped options (xPos/yPos/foregroundColor/…) */
  public options: Record<string, any>;

  /** The live v2 node once this wrapper has been added to a slate. */
  public v2?: V2Node;

  /** Back-reference to the owning facade slate (set on add, like v1). */
  public slate?: slate;

  constructor(options: Record<string, any> = {}) {
    this.options = { id: utilsModule.guid(), ...options };
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
        "SLATEBOX_COMPAT: slate.init() must complete before using slate.nodes"
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

  public shareId: string;
  public userId?: string;
  public orgId?: string;

  constructor(options: Record<string, any> = {}, events: V1Events = {}) {
    this.options = {
      id: options.id || utilsModule.guid(),
      ...options,
    };
    this.events = events || {};
    this.shareId = this.options.shareId || utilsModule.guid();
    this.nodes = new NodesFacade(this);
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
        `SLATEBOX_COMPAT: container "${container}" not found in document`
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
      v2Options.shareId = this.shareId;
    }
    // v1 takes events as the 2nd constructor arg; v2 nests them in options.
    // The callback names are shared between both generations.
    v2Options.events = this.events;
    this.v2 = new Slate(element, v2Options);
    // v2 Slate self-initializes; readiness is signaled by the viewport promise
    await this.v2.getViewportAsync();
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

  private assertReady(): void {
    if (!this.v2) {
      throw new Error(
        "SLATEBOX_COMPAT: slate.init() must complete before use"
      );
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
        "Plugins must provide a name and a plugin (class definition)"
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
