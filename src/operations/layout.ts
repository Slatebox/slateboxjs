/**
 * Layouts over plain boxes, free of the DOM. The canvas's Align, Distribute and
 * Optimize Layout (core/Slate.ts, core/Layout.ts) and the arrange_nodes
 * operation both call these, so a person and an agent get the same result.
 * Each function returns the new top-left corner of every box it moves, in the
 * order the boxes were given.
 */

export interface LayoutBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Degrees. Align and distribute work on the rotated outline, as you see it. */
  rotationAngle?: number;
}

export interface Position {
  id: string;
  x: number;
  y: number;
}

export type AlignMode = "left" | "centerH" | "right" | "top" | "middle" | "bottom";
export type DistributeAxis = "horizontal" | "vertical";

/** The axis-aligned box around a box turned about its centre. */
export function rotatedBounds(box: LayoutBox): { minX: number; minY: number; maxX: number; maxY: number } {
  const { x, y, width: w, height: h } = box;
  const angle = box.rotationAngle || 0;
  if (!angle) return { minX: x, minY: y, maxX: x + w, maxY: y + h };
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [px, py] of [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]) {
    const dx = px - cx;
    const dy = py - cy;
    const rx = cx + dx * cos - dy * sin;
    const ry = cy + dx * sin + dy * cos;
    minX = Math.min(minX, rx);
    minY = Math.min(minY, ry);
    maxX = Math.max(maxX, rx);
    maxY = Math.max(maxY, ry);
  }
  // Remove floating-point noise (a 90 degree turn gives 1e-14 offsets).
  const clean = (n: number) => Math.round(n * 1e6) / 1e6;
  return { minX: clean(minX), minY: clean(minY), maxX: clean(maxX), maxY: clean(maxY) };
}

/** Align two or more boxes by an edge or centre line; fewer than two move nothing. */
export function alignPositions(mode: AlignMode, boxes: LayoutBox[]): Position[] {
  if (boxes.length < 2) return [];
  const bounds = boxes.map(rotatedBounds);
  const gMinX = Math.min(...bounds.map((b) => b.minX));
  const gMaxX = Math.max(...bounds.map((b) => b.maxX));
  const gMinY = Math.min(...bounds.map((b) => b.minY));
  const gMaxY = Math.max(...bounds.map((b) => b.maxY));
  const gcx = (gMinX + gMaxX) / 2;
  const gcy = (gMinY + gMaxY) / 2;
  return boxes.map((box, index) => {
    const b = bounds[index];
    let { x, y } = box;
    // Move by a delta on the box's own corner, so a rotation is kept.
    if (mode === "left") x += gMinX - b.minX;
    else if (mode === "right") x += gMaxX - b.maxX;
    else if (mode === "centerH") x += gcx - (b.minX + b.maxX) / 2;
    else if (mode === "top") y += gMinY - b.minY;
    else if (mode === "bottom") y += gMaxY - b.maxY;
    else if (mode === "middle") y += gcy - (b.minY + b.maxY) / 2;
    return { id: box.id, x, y };
  });
}

/** Space three or more boxes with equal gaps; the outer two stay where they are. */
export function distributePositions(axis: DistributeAxis, boxes: LayoutBox[]): Position[] {
  if (boxes.length < 3) return [];
  const items = boxes.map((box, index) => ({ box, index, b: rotatedBounds(box) }));
  const horizontal = axis === "horizontal";
  const start = (item: (typeof items)[number]) => (horizontal ? item.b.minX : item.b.minY);
  const size = (item: (typeof items)[number]) => (horizontal ? item.b.maxX - item.b.minX : item.b.maxY - item.b.minY);
  const sorted = [...items].sort((p, q) => start(p) - start(q) || p.index - q.index);
  const first = start(sorted[0]);
  const last = sorted.reduce((end, item) => Math.max(end, start(item) + size(item)), -Infinity);
  const gap = (last - first - sorted.reduce((total, item) => total + size(item), 0)) / (sorted.length - 1);
  const result = new Map<number, Position>();
  let cursor = first;
  for (const item of sorted) {
    const delta = cursor - start(item);
    result.set(item.index, {
      id: item.box.id,
      x: horizontal ? item.box.x + delta : item.box.x,
      y: horizontal ? item.box.y : item.box.y + delta,
    });
    cursor += size(item) + gap;
  }
  return items.map((item) => result.get(item.index)!);
}

function overlap(a: LayoutBox, b: LayoutBox, gap: number): { x: number; y: number } | null {
  const x = Math.min(a.x + a.width + gap - b.x, b.x + b.width + gap - a.x);
  const y = Math.min(a.y + a.height + gap - b.y, b.y + b.height + gap - a.y);
  return x > 0 && y > 0 ? { x, y } : null;
}

/**
 * Move the boxes apart until no two are closer than `gap`. Obstacles (notes
 * that are not being arranged, or are locked) never move; the boxes go round
 * them. Each overlap is resolved along the axis that needs the shorter move,
 * away from the other box's centre, split between two boxes that may both move.
 */
export function tidyPositions(boxes: LayoutBox[], obstacles: LayoutBox[], { gap = 20 }: { gap?: number } = {}): Position[] {
  const moving = boxes.map((box) => ({ ...box }));
  const fixed = obstacles.map((box) => ({ ...box }));
  const push = (mover: LayoutBox, other: LayoutBox, amount: { x: number; y: number }, share: number, order: number) => {
    const dx = mover.x + mover.width / 2 - (other.x + other.width / 2);
    const dy = mover.y + mover.height / 2 - (other.y + other.height / 2);
    if (amount.y <= amount.x) mover.y += (dy > 0 || (dy === 0 && order > 0) ? 1 : -1) * amount.y * share;
    else mover.x += (dx > 0 || (dx === 0 && order > 0) ? 1 : -1) * amount.x * share;
  };
  for (let pass = 0; pass < 1000; pass += 1) {
    let moved = false;
    for (let i = 0; i < moving.length; i += 1) {
      for (const other of fixed) {
        const amount = overlap(moving[i], other, gap);
        if (amount) {
          push(moving[i], other, amount, 1, 1);
          moved = true;
        }
      }
      for (let j = i + 1; j < moving.length; j += 1) {
        const amount = overlap(moving[i], moving[j], gap);
        if (!amount) continue;
        // The later box gives way when the two share a centre.
        push(moving[i], moving[j], amount, 0.5, -1);
        push(moving[j], moving[i], amount, 0.5, 1);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return moving.map(({ id, x, y }) => ({ id, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 }));
}

/**
 * Lay connected boxes out top-down. Roots are boxes no other box leads to (or,
 * where every box is on a cycle, the first box not yet placed); each box sits
 * one layer below the first box that reaches it, and a parent is centred over
 * its children. Boxes are placed from the top-left corner the boxes had.
 */
export function treePositions(boxes: LayoutBox[], edges: Array<[string, string]>, { gap = 48 }: { gap?: number } = {}): Position[] {
  if (!boxes.length) return [];
  const byId = new Map(boxes.map((box) => [box.id, box]));
  const outgoing = new Map<string, string[]>(boxes.map((box) => [box.id, []]));
  const incoming = new Map<string, number>(boxes.map((box) => [box.id, 0]));
  for (const [from, to] of edges) {
    if (!byId.has(from) || !byId.has(to) || from === to) continue;
    outgoing.get(from)!.push(to);
    incoming.set(to, incoming.get(to)! + 1);
  }
  const children = new Map<string, string[]>();
  const depth = new Map<string, number>();
  const roots: string[] = [];
  const grow = (root: string) => {
    roots.push(root);
    depth.set(root, 0);
    children.set(root, []);
    const queue = [root];
    while (queue.length) {
      const id = queue.shift()!;
      for (const next of outgoing.get(id)!) {
        if (depth.has(next)) continue;
        depth.set(next, depth.get(id)! + 1);
        children.set(next, []);
        children.get(id)!.push(next);
        queue.push(next);
      }
    }
  };
  for (const box of boxes) if (incoming.get(box.id) === 0 && !depth.has(box.id)) grow(box.id);
  for (const box of boxes) if (!depth.has(box.id)) grow(box.id);

  const layers: number[] = [];
  for (const box of boxes) {
    const level = depth.get(box.id)!;
    layers[level] = Math.max(layers[level] ?? 0, box.height);
  }
  const originX = Math.min(...boxes.map((box) => box.x));
  const originY = Math.min(...boxes.map((box) => box.y));
  const layerTop: number[] = [];
  layers.forEach((height, level) => {
    layerTop[level] = level === 0 ? originY : layerTop[level - 1] + layers[level - 1] + gap;
  });

  const span = new Map<string, number>();
  const measure = (id: string): number => {
    const kids = children.get(id)!;
    const kidsWidth = kids.reduce((total, kid) => total + measure(kid), 0) + gap * Math.max(0, kids.length - 1);
    const width = Math.max(byId.get(id)!.width, kidsWidth);
    span.set(id, width);
    return width;
  };
  const placed = new Map<string, Position>();
  const place = (id: string, left: number) => {
    const box = byId.get(id)!;
    const kids = children.get(id)!;
    const width = span.get(id)!;
    const top = layerTop[depth.get(id)!];
    if (!kids.length) {
      placed.set(id, { id, x: left + (width - box.width) / 2, y: top });
      return;
    }
    const kidsWidth = kids.reduce((total, kid) => total + span.get(kid)!, 0) + gap * (kids.length - 1);
    let cursor = left + (width - kidsWidth) / 2;
    for (const kid of kids) {
      place(kid, cursor);
      cursor += span.get(kid)! + gap;
    }
    const first = placed.get(kids[0])!;
    const last = placed.get(kids[kids.length - 1])!;
    const centre = (first.x + byId.get(kids[0])!.width / 2 + last.x + byId.get(kids[kids.length - 1])!.width / 2) / 2;
    const x = Math.min(Math.max(centre - box.width / 2, left), left + width - box.width);
    placed.set(id, { id, x, y: top });
  };
  let left = originX;
  for (const root of roots) {
    const width = measure(root);
    place(root, left);
    left += width + gap;
  }
  return boxes.map((box) => placed.get(box.id)!);
}
