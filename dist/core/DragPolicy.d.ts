/**
 * DragPolicy.ts - let a host govern what a person may do to some notes.
 *
 * An ordinary note follows the pointer and the engine saves where it was dropped.
 * A governed note belongs to host state (a workshop model, a game, a form): the
 * host says whether a drag may start, sees the drag while it happens, and decides
 * on release whether the drop is accepted and where the note comes to rest. The
 * engine never broadcasts, saves or records undo for a governed note; the host
 * persists its own state.
 *
 * Register a policy with `slate.setDragPolicy(policy)`. Notes the policy does not
 * claim behave exactly as before.
 */
import type { Node } from "./Node";
/** What a person (or a collaborator's package) may do to one note. */
export interface NodeCapabilities {
    /** May be dragged. The policy's onEnd decides where it lands; nothing else moves it. */
    canMove: boolean;
    /** Resize handles. */
    canResize: boolean;
    /** Rotate handle. */
    canRotate: boolean;
    /** Delete key, toolbar and context-menu delete, slate.removeNode. */
    canDelete: boolean;
    /** Duplicate, copy and paste. */
    canDuplicate: boolean;
    /** Connector plugs, the toolbar plug, and being the target of someone else's connector. */
    canConnect: boolean;
    /** Double-click, Enter, F2 and type-to-edit. Commits go to the policy's onTextCommit. */
    canEditText: boolean;
    /** false makes the note decoration: no pointer input, focus or selection. */
    canSelect: boolean;
    /**
     * false (the default for governed notes) marks the note as a drawing of host state:
     * exportJSON, snapshots and undo history leave it out.
     */
    persist: boolean;
}
/** An ordinary note. Returned for every note no policy claims. */
export declare const FREE_NODE: Readonly<NodeCapabilities>;
/** What a governed note gets unless its policy says otherwise. */
export declare const GOVERNED_NODE: Readonly<NodeCapabilities>;
/** A point in world coordinates (the slate's own units, independent of pan and zoom). */
export interface WorldPoint {
    x: number;
    y: number;
}
/** Where the pointer is on screen and what kind of pointer it is. */
export interface DragGesture {
    clientX: number;
    clientY: number;
    pointerType: "mouse" | "touch";
}
export type DragVerdict = {
    accept: true;
    /** Where the note's top-left corner comes to rest. Omit to leave it where it was dropped. */
    settle?: WorldPoint;
} | {
    accept: false;
};
export type DragCancelReason = "escape" | "pointercancel" | "touchcancel" | "blur" | "host";
export interface DragPolicy {
    /**
     * Claim a note. Return `true` for the governed defaults, an object to change some
     * of them, or a falsy value to leave the note alone. Called often; keep it cheap.
     */
    governs(node: Node): Partial<NodeCapabilities> | boolean | null | undefined;
    /**
     * A drag is about to begin (the pointer has travelled a few pixels with the note
     * held). Return false to refuse: the note stays where it is.
     */
    onStart?(node: Node, point: WorldPoint, gesture: DragGesture): boolean | void;
    /** The pointer moved. Called at most once per animation frame. */
    onMove?(node: Node, point: WorldPoint, gesture: DragGesture): void;
    /**
     * The note was released. Accept (optionally naming where it settles) or refuse;
     * a refused note glides back to where the drag started.
     */
    onEnd(node: Node, point: WorldPoint, gesture: DragGesture): DragVerdict;
    /** The drag ended without a release: Escape, a cancelled pointer or touch, window blur, or the host. */
    onCancel?(node: Node, reason: DragCancelReason): void;
    /**
     * The person committed an inline text edit. Return false to refuse (the old text
     * stays), a string to accept a corrected label, or nothing to accept it as typed.
     */
    onTextCommit?(node: Node, text: string, previous: string): boolean | string | void;
    /**
     * A key was pressed with this note as the only selection. Return true when the
     * policy handled it; otherwise the engine's own shortcut runs (subject to the
     * note's capabilities).
     */
    onKeyDown?(node: Node, event: KeyboardEvent): boolean | void;
    /**
     * loadJSON, undo or redo replaced the slate's notes. Governed notes that were not
     * persisted are gone; the host redraws them here.
     */
    onNotesReplaced?(): void;
}
export interface NodeGovernance {
    policy: DragPolicy;
    capabilities: NodeCapabilities;
}
/** Resolve the first policy that claims `node`, with its capabilities filled in. */
export declare function resolveGovernance(policies: readonly DragPolicy[], node: Node): NodeGovernance | null;
/** Topmost of `nodes` whose (rotated) box contains the world point. */
export declare function hitTestNodeBoxes(point: WorldPoint, nodes: readonly Node[], padding?: number): Node | null;
