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
import type { Node as V2Node } from "./core/Node";
import * as utilsModule from "./utils";
import { type AnimationDef } from "./core/Animations";
/** v1-style events object passed as the 2nd constructor argument. */
export type V1Events = Record<string, ((...args: any[]) => any) | undefined>;
/**
 * v1-style node: constructed standalone (no slate required) and later
 * attached via `slate.nodes.add(node)`. Keeps its v1-shaped `options`
 * object; once added, `v2` points at the live v2 Node.
 */
declare class node {
    /**
     * Live v1-shaped options (xPos/yPos/foregroundColor/…). Before attachment
     * the proxy behaves like a plain object. Once attached, reads reflect the
     * current v2 NodeOptions and writes update both the v1 view and v2 model.
     */
    options: Record<string, any>;
    private optionState;
    /** The live v2 node once this wrapper has been added to a slate. */
    v2?: V2Node;
    /** Back-reference to the owning facade slate (set on add, like v1). */
    slate?: slate;
    /** v1: `node.resize.set(w, h)` then `node.resize.send()` */
    resize: NodeResizeFacade;
    /** v1: `node.relationships.addAssociation(otherNode)` / `.associations` */
    relationships: NodeRelationshipsFacade;
    constructor(options?: Record<string, any>);
    /**
     * v1: `node.png(withNodes?, cb)` — export this node (or the given group of
     * node ids) as a transparent-background PNG blob.
     */
    png(withNodes: string[] | ((blob: Blob) => void) | undefined, cb?: (blob: Blob) => void): void;
    /** v1: `node.svg(withNodes?, cb)` — same as png but returns the SVG string. */
    svg(withNodes: string[] | ((svg: string) => void) | undefined, cb?: (svg: string) => void): void;
    /**
     * v1 API: position the node. `position('center')` centers it in the current
     * viewport (used right after adding a node from the shape palette);
     * `position({x, y})` / `position(x, y)` sets an explicit position. Before the
     * node is added (no v2 yet) this just stashes coordinates on options.
     */
    position(coords?: any, maybeY?: number): this;
}
/**
 * v1 resize sub-object: `set()` stages new dimensions, `send()` applies them
 * (v1 additionally broadcast to collab; broadcasting is the host app's job
 * via the packages it already sends).
 */
declare class NodeResizeFacade {
    private owner;
    private pending?;
    constructor(owner: node);
    set(width: number, height: number): void;
    send(): void;
}
/**
 * v1 relationships sub-object. v1 exposed `.associations` as an array whose
 * entries carry live `parent`/`child` node references (the Meteor app reads
 * `a.parent.options.id`); v2 stores plain id-based Association records.
 */
declare class NodeRelationshipsFacade {
    private owner;
    constructor(owner: node);
    /** v1: `node.relationships.addAssociation(childNode, data?)` */
    addAssociation(child: node | V2Node, data?: Record<string, any>): any;
    /** v1: `.associations` — array with live parent/child wrapper references */
    get associations(): Array<Record<string, any>>;
}
/**
 * Facade over the v2 NodesManager exposing the v1 `slate.nodes` surface.
 * v1 takes node INSTANCES (`nodes.add(new Slatebox.node({...}))`) while v2's
 * manager takes plain options — this adapter accepts both.
 */
declare class NodesFacade {
    private owner;
    private wrappers;
    constructor(owner: slate);
    private get v2Slate();
    /** v1: `slate.nodes.add(nodeInstance)` — also accepts a plain options object. */
    add(n: node | Record<string, any>): node;
    /** v1: `slate.nodes.addRange([...])` */
    addRange(list: Array<node | Record<string, any>>): node[];
    /** v1: `slate.nodes.one(id)` → node (or undefined) */
    one(id: string): node | undefined;
    /** v1: `slate.nodes.allNodes` → array property */
    get allNodes(): node[];
    /**
     * v1: `slate.nodes.packageLayout()` — payload sent to the server-side
     * layout calculator: `{layoutType, associations, nodes, uniqueIds, subgraphs}`.
     */
    packageLayout(): Record<string, any>;
    /**
     * v1: `slate.nodes.applyLayout(layout, cbOrOpts?)` — layout is the server
     * response `{exportNodes: {id: {x, y}}}` with stringly coordinates.
     */
    applyLayout(layout: Record<string, any>, cbOrOpts?: (() => void) | {
        skipCenter?: boolean;
    }): void;
    /**
     * v1: `slate.nodes.nodeMovePackage({dur, moves: [{id, x: dx, y: dy}]})` —
     * moves are RELATIVE deltas; the returned package carries the resulting
     * ABSOLUTE positions in v1 shape, ready for `collab.exe({type:'onNodesMove'})`.
     */
    nodeMovePackage(opts?: {
        dur?: number;
        easing?: string;
        moves?: Array<{
            id: string;
            x: number;
            y: number;
        }>;
        nodes?: Array<node | V2Node>;
    }): Record<string, any>;
    /**
     * Return the stable wrapper for a v2 node, creating one lazily for nodes
     * that came into existence outside this facade (e.g. loadJSON).
     */
    private wrap;
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
declare class slate {
    options: Record<string, any>;
    events: V1Events;
    nodes: NodesFacade;
    /** The live v2 Slate once init() has run. */
    v2?: Slate;
    private _shareId;
    userId?: string;
    orgId?: string;
    /**
     * v1: hosts assign `slate.shareId = X` AFTER init (createSlate.js does) and
     * expect it to persist through exportJSON. Route writes into the live v2
     * options (which serialization reads) once available.
     */
    get shareId(): string;
    set shareId(value: string);
    /** v1: `slate.savingTemplateImage` — host-managed re-entrancy flag */
    savingTemplateImage: boolean;
    /** v1: `slate.controller.scaleToFitAndCenter(cb?, dur?)` */
    controller: {
        scaleToFitAndCenter: (cb?: () => void, dur?: number) => void;
    };
    /** v1: `slate.canvas.hideBg(opacity?)` — clear background for snapshots */
    canvas: {
        hideBg: (opacity?: number) => void;
    };
    /** The step-through presentation controller (start/next/previous/stop). */
    get presentation(): any;
    constructor(options?: Record<string, any>, events?: V1Events);
    /** Resolve v1 `options.container` (id string or element) to an HTMLElement. */
    private resolveContainer;
    /** v1: async init resolving to the slate itself. */
    init(): Promise<this>;
    /** v1: `slate.exportJSON()` → JSON string */
    exportJSON(): string;
    /** v1: `slate.loadJSON(jsonString)` */
    loadJSON(json: string): Promise<void>;
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
    destroy(): void;
    /**
     * v1: `slate.getOrientation()` → `{orientation, width, height, left, top}`
     * computed over the bounding box of all nodes (10px padding, like v1),
     * falling back to the viewport dimensions when the slate is empty.
     */
    getOrientation(): {
        orientation: "landscape" | "portrait";
        width: number;
        height: number;
        left: number;
        top: number;
    };
    /**
     * v1: `slate.collab.exe/invoke/send/updateUserData` — the live v2 Collab
     * instance exposes the same four methods.
     */
    get collab(): any;
    /** v1: `slate.keyboard.bindGlobal()/unbindGlobal()` (NodeDrawer uses it) */
    get keyboard(): any;
    /**
     * v1: `slate.filters.availableFilters` — an object keyed by filter name, each
     * with a `types` array. The node Effects pane iterates Object.keys(...) and
     * reads `[name].types` to decide which effects to show, so the shape matters.
     */
    get filters(): {
        availableFilters: Record<string, {
            types: string[];
        }>;
        availableAnimations: Record<string, AnimationDef>;
    };
    /** v1: `slate.undoRedo` / `slate.birdsEye` passthroughs */
    get undoRedo(): any;
    get birdsEye(): any;
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
    groupNodes(nodes?: Array<node | V2Node>): string | null;
    ungroupNodes(nodes?: Array<node | V2Node>): void;
    lockNodes(nodes?: Array<node | V2Node>): void;
    unlockNodes(nodes?: Array<node | V2Node>): void;
    isSelectionLocked(nodes?: Array<node | V2Node>): boolean;
    /**
     * Multi-node arrangement (F2, Nov 16): expose align/distribute on the v1
     * facade so app-level selection toolbars can drive the same rotation-aware
     * engine path the v2 context menu uses (undo/persist/collab via the normal
     * onNodesMove flow). `nodes` accepts facade wrappers or live v2 nodes.
     */
    alignNodes(mode: string, nodes?: Array<node | V2Node>): void;
    distributeNodes(axis: string, nodes?: Array<node | V2Node>): void;
    /**
     * Optimize Layout: the engine's tidy layout over every note, saved as one
     * move. The app's Settings button and AI layout call this on the facade.
     */
    removeLayoutOverlaps(gap?: number): void;
    private unwrapNodes;
    /**
     * v1: `slate.disable(exemptSlate?, exemptNodes?, full?)` — freeze
     * interactions (used when the app opens read-only/embedded views).
     */
    disable(exemptSlate?: unknown, exemptNodes?: unknown, full?: boolean): void;
    /** v1: `slate.enable(exemptSlate?, exemptNodes?)` — reverse of disable() */
    enable(exemptSlate?: unknown, exemptNodes?: unknown): void;
    /** v1: `slate.png({base64: true}, cb)` — thumbnail export */
    png(opts?: Record<string, any>, callback?: (result: string | Blob) => void): Promise<string | Blob>;
    private assertReady;
}
/**
 * v1 exported a `base` class carrying a static plugin registry. The Meteor
 * app does not use it directly (verified against all 13 importing files);
 * this minimal port exists so `Slatebox.base` is present for any external
 * v1 consumers that subclass it.
 */
declare class base {
    private static availablePlugins;
    plugins?: Record<string, any>;
    constructor(initPayload?: any);
    registerPlugins(initPayload?: any): void;
    static registerPlugin(details: {
        name: string;
        plugin: new (payload?: any) => any;
    }): void;
}
/**
 * The v1 namespace object: `import { Slatebox } from 'slateboxjs'`.
 * Also assigned to `window.Slatebox` in index.ts.
 */
export declare const Slatebox: {
    slate: typeof slate;
    node: typeof node;
    base: typeof base;
    utils: typeof utilsModule;
};
export { slate as CompatSlate, node as CompatNode, base as CompatBase };
