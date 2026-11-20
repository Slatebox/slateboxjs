/**
 * Layout.ts - Layout algorithms for node positioning
 *
 * Provides overlap removal and auto-layout capabilities.
 */

import { tidyPositions, type LayoutBox } from "../operations/layout";

export interface LayoutMove {
  id: string;
  x: number;
  y: number;
}

/**
 * Optimize Layout: move the slate's notes apart until none overlaps another,
 * with the shared tidy layout that arrange_nodes "tidy" uses, then save the
 * move with one onNodesMove. Locked notes and notes a host draws stay where
 * they are and the others go round them.
 *
 * @param slate - The Slate instance
 * @param gap - The space to leave between notes
 */
export function removeLayoutOverlaps(slate: any, gap: number = 20): void {
  const all: any[] = slate.nodes.allNodes;
  const free: any[] = slate.freeNodes?.() ?? all;
  const movable = free.filter((node) => !node.options.isLocked);
  if (movable.length < 1 || all.length < 2) return;
  const toBox = (node: any): LayoutBox => ({
    id: node.id ?? node.options.id,
    x: node.options.x || 0,
    y: node.options.y || 0,
    width: node.options.width || 100,
    height: node.options.height || 60,
  });
  const moving = new Set(movable);
  const positions = tidyPositions(movable.map(toBox), all.filter((node) => !moving.has(node)).map(toBox), { gap });
  const moves = positions.filter((position, index) => {
    const node = movable[index];
    return position.x !== (node.options.x || 0) || position.y !== (node.options.y || 0);
  });
  if (!moves.length) return;
  moves.forEach((move) => {
    const node = movable.find((candidate) => (candidate.id ?? candidate.options.id) === move.id);
    node.position(move.x, move.y);
  });
  slate.broadcast?.("onNodesMove", { nodes: moves });
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
    if (node && !slate.governanceOf?.(node)) {
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
  return (slate.freeNodes?.() ?? slate.nodes.allNodes).map((node: any) => ({
    id: node.id,
    x: node.options.x || 0,
    y: node.options.y || 0,
  }));
}
