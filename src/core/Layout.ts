/**
 * Layout.ts - Layout algorithms for node positioning
 *
 * Provides overlap removal and auto-layout capabilities.
 */

export interface LayoutMove {
  id: string;
  x: number;
  y: number;
}

/**
 * Remove overlapping nodes by pushing them apart.
 *
 * @param slate - The Slate instance
 * @param enableAttraction - If true, nodes are slightly attracted to center
 * @param threshold - Minimum distance between nodes
 */
export function removeLayoutOverlaps(
  slate: any,
  enableAttraction: boolean = false,
  threshold: number = 20
): void {
  const nodes = slate.nodes.allNodes;
  if (nodes.length < 2) return;

  const maxIterations = 100;
  let hasOverlap = true;
  let iteration = 0;

  while (hasOverlap && iteration < maxIterations) {
    hasOverlap = false;
    iteration++;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];

        const ax = a.options.x || 0;
        const ay = a.options.y || 0;
        const aw = a.options.width || 100;
        const ah = a.options.height || 60;

        const bx = b.options.x || 0;
        const by = b.options.y || 0;
        const bw = b.options.width || 100;
        const bh = b.options.height || 60;

        // Check overlap
        const overlapX = ax < bx + bw + threshold && ax + aw + threshold > bx;
        const overlapY = ay < by + bh + threshold && ay + ah + threshold > by;

        if (overlapX && overlapY) {
          hasOverlap = true;

          // Push nodes apart
          const dx = (ax + aw / 2) - (bx + bw / 2);
          const dy = (ay + ah / 2) - (by + bh / 2);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const pushX = (dx / dist) * (threshold / 2);
          const pushY = (dy / dist) * (threshold / 2);

          a.position(ax + pushX, ay + pushY);
          b.position(bx - pushX, by - pushY);
        }
      }
    }
  }

  if (enableAttraction) {
    // Gently attract nodes toward center of mass
    const cx = nodes.reduce((sum: number, n: any) => sum + (n.options.x || 0), 0) / nodes.length;
    const cy = nodes.reduce((sum: number, n: any) => sum + (n.options.y || 0), 0) / nodes.length;

    for (const node of nodes) {
      const nx = node.options.x || 0;
      const ny = node.options.y || 0;
      const dx = cx - nx;
      const dy = cy - ny;
      node.position(nx + dx * 0.05, ny + dy * 0.05);
    }
  }

  console.log(
    "LAYOUT_DEBUG: Overlap removal completed in",
    iteration,
    "iterations"
  );
}

/**
 * Apply a set of pre-computed layout moves to nodes.
 *
 * @param slate - The Slate instance
 * @param moves - Array of { id, x, y } moves
 * @param callback - Called when animation completes
 * @param noAnimation - If true, move instantly
 */
export function applyLayout(
  slate: any,
  moves: LayoutMove[],
  callback?: () => void,
  noAnimation: boolean = false
): void {
  const duration = noAnimation ? 0 : 500;
  let completed = 0;

  for (const move of moves) {
    const node = slate.nodes.one(move.id);
    if (node) {
      node.position(move.x, move.y, () => {
        completed++;
        if (completed >= moves.length && callback) {
          callback();
        }
      }, undefined, duration);
    } else {
      completed++;
    }
  }

  if (moves.length === 0 && callback) {
    callback();
  }
}

/**
 * Package the current layout positions for all nodes.
 * Can be transmitted via collab and applied elsewhere.
 */
export function packageLayout(slate: any): LayoutMove[] {
  return slate.nodes.allNodes.map((node: any) => ({
    id: node.id,
    x: node.options.x || 0,
    y: node.options.y || 0,
  }));
}
