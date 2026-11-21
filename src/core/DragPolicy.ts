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
  /** Editing the note's text in place, however it is begun. Commits go to the policy's onTextCommit. */
  canEditText: boolean;
  /** false makes the note decoration: no pointer input, focus or selection. */
  canSelect: boolean;
  /**
   * false (the default for governed notes) marks the note as a drawing of host state:
   * exportJSON, snapshots and undo history leave it out.
   */
  persist: boolean;
  /**
   * false leaves the note, and every line to or from it, out of SVG and PNG exports:
   * a provisional drawing (a conversation's preview, say) is shown but is not the diagram.
   */
  exportable: boolean;
}

/** An ordinary note. Returned for every note no policy claims. */
export const FREE_NODE: Readonly<NodeCapabilities> = Object.freeze({
  canMove: true,
  canResize: true,
  canRotate: true,
  canDelete: true,
  canDuplicate: true,
  canConnect: true,
  canEditText: true,
  canSelect: true,
  persist: true,
  exportable: true,
});

/** What a governed note gets unless its policy says otherwise. */
export const GOVERNED_NODE: Readonly<NodeCapabilities> = Object.freeze({
  canMove: true,
  canResize: false,
  canRotate: false,
  canDelete: false,
  canDuplicate: false,
  canConnect: false,
  canEditText: false,
  canSelect: true,
  persist: false,
  exportable: true,
});

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

export type DragVerdict =
  | {
      accept: true;
      /** Where the note's top-left corner comes to rest. Omit to leave it where it was dropped. */
      settle?: WorldPoint;
    }
  | { accept: false };

export type DragCancelReason =
  | "escape"
  | "pointercancel"
  | "touchcancel"
  | "blur"
  | "host";

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
  /**
   * An ordinary note (one, not part of a group drag) is being dragged. Lets a host show
   * what a drop there would do. Called at most once per animation frame.
   */
  onFreeMove?(node: Node, point: WorldPoint): void;
  /**
   * An ordinary note was dropped at `point` (by pointer, or by the arrow keys that
   * nudge it), having started at `from`. Return "taken" when the host has made the
   * note its own (it removed the note from the drawing; the engine records no move),
   * "refused" to have the note glide back to `from` (nothing is saved or sent), or
   * nothing to leave it where it was dropped as an ordinary move.
   */
  onFreeDrop?(node: Node, point: WorldPoint, from: WorldPoint): "taken" | "refused" | void;
  /**
   * Several ordinary notes dragged together were dropped at `point` (where the pointer
   * let go). Return "taken" when the host has made them all its own, "refused" to have
   * every one glide back to where it started, or nothing to leave them as an ordinary
   * move. `from` holds where each of them started, in the same order.
   */
  onFreeGroupDrop?(nodes: Node[], point: WorldPoint, from?: WorldPoint[]): "taken" | "refused" | void;
  /**
   * The words of an ordinary note were committed (typed and confirmed). A host may act on
   * where the note now is (a note typed on a workshop's lane becomes a card there).
   */
  onFreeTextCommit?(node: Node): void;
  /**
   * A person drew, restyled or took away a line with one of this policy's notes at an end (a
   * note it lets connect). `type` is the change package the engine would have sent for it:
   * "addRelationship", "removeRelationship" or "onLinePropertiesChanged", with its data. The
   * engine has already drawn the change on this screen; it sends, saves and records nothing for
   * it, so the host keeps the line (or takes it off again) itself. A note removed from the slate
   * takes its lines off with it, and the host hears of that as a removal too.
   */
  onLine?(type: string, data: any): void;
  /**
   * What the host wants kept with each undo record (taken when the record is taken).
   * Given back to {@link onUndoRestore} when this person's undo or redo goes back to it.
   */
  undoState?(): unknown;
  /**
   * This person's undo or redo replaced the slate's notes with a record. `state` is what
   * undoState returned for that record; `added` and `removed` are the ids of ordinary
   * notes the restore brought back or took away. Runs after onNotesReplaced.
   */
  onUndoRestore?(state: unknown, notes: { added: string[]; removed: string[] }): void;
}

export interface NodeGovernance {
  policy: DragPolicy;
  capabilities: NodeCapabilities;
}

/**
 * Whether the person has asked their system for less motion. Governed notes then
 * go straight to where they belong instead of gliding there.
 */
export function prefersReducedMotion(): boolean {
  try {
    return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Resolve the first policy that claims `node`, with its capabilities filled in. */
export function resolveGovernance(
  policies: readonly DragPolicy[],
  node: Node
): NodeGovernance | null {
  for (const policy of policies) {
    let claim: ReturnType<DragPolicy["governs"]>;
    try {
      claim = policy.governs(node);
    } catch (error) {
      console.warn("DRAG_POLICY: governs() threw; treating the note as governed", error);
      claim = true;
    }
    if (!claim) continue;
    return {
      policy,
      capabilities:
        claim === true ? GOVERNED_NODE : { ...GOVERNED_NODE, ...claim },
    };
  }
  return null;
}

/** Topmost of `nodes` whose (rotated) box contains the world point. */
export function hitTestNodeBoxes(
  point: WorldPoint,
  nodes: readonly Node[],
  padding = 0
): Node | null {
  let best: Node | null = null;
  for (const node of nodes) {
    const o = node?.options;
    if (!o) continue;
    const w = o.width || 0;
    const h = o.height || 0;
    const cx = (o.x || 0) + w / 2;
    const cy = (o.y || 0) + h / 2;
    let dx = point.x - cx;
    let dy = point.y - cy;
    const angle = o.rotate?.rotationAngle || 0;
    if (angle) {
      const rad = (-angle * Math.PI) / 180;
      const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
      const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
      dx = rx;
      dy = ry;
    }
    if (Math.abs(dx) > w / 2 + padding || Math.abs(dy) > h / 2 + padding) continue;
    if (!best || paintsAbove(node, best)) best = node;
  }
  return best;
}

/** Whether `a` is painted after (on top of) `b`. Falls back to list order. */
function paintsAbove(a: Node, b: Node): boolean {
  const an = (a as any).svgGroup?.node as globalThis.Node | undefined;
  const bn = (b as any).svgGroup?.node as globalThis.Node | undefined;
  if (!an || !bn || typeof bn.compareDocumentPosition !== "function") return true;
  // FOLLOWING: `an` comes after `bn` in document order, so it paints on top.
  return (bn.compareDocumentPosition(an) & 4) !== 0;
}
