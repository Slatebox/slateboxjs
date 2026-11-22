/**
 * The rules for a line's ends, in one place for the canvas (dragging an end),
 * the keyboard, the line tool and the operations module (exec and chat).
 *
 * An end that is on a note either FOLLOWS the note (it takes the shortest way
 * round the note as things move: no anchor) or is PINNED to one spot on the
 * note's edge (a normalized anchor {x, y} in 0..1 on the unrotated note, which
 * turns and moves with the note). An end that is on no note is FREE: a saved
 * world point that stays where it is. Only the far (target) end of a stored
 * line is ever free; a line whose starting end is let go belongs to the note at
 * its other end instead (see flipLine).
 */

export type LineEnd = "source" | "target";
export type EndAnchor = { x: number; y: number };
export type EndState = "follow" | "pinned" | "free";
export type Side = "top" | "right" | "bottom" | "left";
export type NoteBox = { x: number; y: number; width: number; height: number; rotation?: number };

/** A drop this close to an edge (a quarter of the note's width or height) pins; nearer the middle follows. */
export const PIN_BAND = 0.25;
/** How far one arrow key press slides a pinned end along the edge (a twentieth of that side). */
export const NUDGE_STEP = 0.05;

const round = (v: number) => Math.round(v * 10000) / 10000;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** The anchor a drop at normalized (nx, ny) on a note gives: an edge spot, or null for its middle. */
export function anchorForDrop(nx: number, ny: number): EndAnchor | null {
  if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
  const ax = clamp01(nx);
  const ay = clamp01(ny);
  const outside = nx < 0 || nx > 1 || ny < 0 || ny > 1;
  if (!outside && Math.min(ax, 1 - ax, ay, 1 - ay) >= PIN_BAND) return null;
  return snapToEdge({ x: ax, y: ay });
}

/** The nearest spot on the note's edge to a normalized point inside it. */
export function snapToEdge(anchor: EndAnchor): EndAnchor {
  const x = clamp01(anchor.x);
  const y = clamp01(anchor.y);
  const d = [x, 1 - x, y, 1 - y];
  const m = Math.min(...d);
  if (m === d[0]) return { x: 0, y: round(y) };
  if (m === d[1]) return { x: 1, y: round(y) };
  if (m === d[2]) return { x: round(x), y: 0 };
  return { x: round(x), y: 1 };
}

/** One arrow key press: slide a pinned end that way, then back onto the edge (turning corners). */
export function nudgeAnchor(anchor: EndAnchor, key: string, step = NUDGE_STEP): EndAnchor {
  const delta: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
  };
  const [dx, dy] = delta[key] || [0, 0];
  const from = snapToEdge(anchor);
  // Along the edge (or round a corner onto the next one) it slides; across it, into the
  // note or off it, nothing moves.
  const next = { x: clamp01(round(from.x + dx)), y: clamp01(round(from.y + dy)) };
  const onEdge = next.x === 0 || next.x === 1 || next.y === 0 || next.y === 1;
  return onEdge ? next : from;
}

/** The middle of one side. */
export function sideAnchor(side: Side): EndAnchor {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[side];
}

/** Whether an end of a stored association follows, is pinned or is free. */
export function endStateOf(association: Record<string, any>, which: LineEnd): EndState {
  if (which === "target" && association?.targetPoint) return "free";
  const anchor = which === "source" ? association?.sourceAnchor : association?.targetAnchor;
  return anchor ? "pinned" : "follow";
}

function rotate(p: { x: number; y: number }, c: { x: number; y: number }, degrees: number) {
  if (!degrees) return { ...p };
  const r = (degrees * Math.PI) / 180;
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(r) - dy * Math.sin(r), y: c.y + dx * Math.sin(r) + dy * Math.cos(r) };
}

/** A world point in the note's own (unturned) frame, normalized to its box. */
export function normalizedOn(box: NoteBox, world: { x: number; y: number }): { x: number; y: number } {
  const c = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const local = rotate(world, c, -(box.rotation || 0));
  return { x: (local.x - box.x) / (box.width || 1), y: (local.y - box.y) / (box.height || 1) };
}

/** Where a pinned anchor is in the world (turned with the note). */
export function anchorPoint(box: NoteBox, anchor: EndAnchor): { x: number; y: number } {
  const c = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const p = rotate({ x: box.x + anchor.x * box.width, y: box.y + anchor.y * box.height }, c, box.rotation || 0);
  return { x: round(p.x), y: round(p.y) };
}

/** The spot where a straight line from the note's middle toward a point leaves its edge. */
export function anchorToward(box: NoteBox, toward: { x: number; y: number }): EndAnchor {
  const n = normalizedOn(box, toward);
  // In the note's own frame, scaled to its box, the middle is (0.5, 0.5).
  const dx = (n.x - 0.5) * (box.width || 1);
  const dy = (n.y - 0.5) * (box.height || 1);
  if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9) return { x: 0.5, y: 0 };
  const sx = dx !== 0 ? box.width / 2 / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? box.height / 2 / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return snapToEdge({ x: 0.5 + (dx * s) / (box.width || 1), y: 0.5 + (dy * s) / (box.height || 1) });
}

/**
 * The same line seen from its other end: what a line becomes when its starting
 * end is let go (it then belongs to the note at its far end). The arrows and the
 * pin of the end that stays on a note go with it, so it looks just as it did.
 */
export function flipLine<T extends Record<string, any>>(association: T): T {
  const flipped: Record<string, any> = { ...association };
  flipped.showParentArrow = association.showChildArrow !== false;
  flipped.showChildArrow = !!association.showParentArrow;
  flipped.sourceAnchor = association.targetAnchor ?? null;
  flipped.targetAnchor = null;
  return flipped as T;
}
