/**
 * The stored slate: the JSON the app saves and the engine loads
 * ({options, nodes: [{options, relationships: {associations}}]}). Helpers to
 * read it, to turn a live slate into it, and to select notes in it.
 */
import { OperationPlanError } from "./contract";
import { FREE_END_PREFIX } from "./keys/connector";
import { NODE_KEYS } from "./keys/node";
import type { NodeSelector } from "./keys/selector";

export interface StoredNode {
  options: Record<string, any>;
  relationships: { associations: Record<string, any>[] };
}

export interface StoredSlate {
  options: Record<string, any>;
  nodes: StoredNode[];
  [key: string]: any;
}

export const noteId = (node: StoredNode): string => node.options.id;
export const read = (node: StoredNode, key: string): any => NODE_KEYS[key].read(node.options);
export const box = (node: StoredNode) => ({
  x: read(node, "x"),
  y: read(node, "y"),
  width: Number(node.options.width ?? 120),
  height: Number(node.options.height ?? 80),
});

export const isFreeEnd = (association: Record<string, any>): boolean =>
  Boolean(association.targetPoint) || `${association.childId || ""}`.startsWith(FREE_END_PREFIX);

/** The engine's own default id for a connector stored without one (compat.v1AssociationToV2). */
export const defaultConnectorId = (parentId: string, childId: string) => `${parentId}->${childId}`;

function plain<T>(value: T): T {
  // Live options can hold functions and node references; keep only data.
  return JSON.parse(JSON.stringify(value ?? null));
}

/**
 * A stored copy of whatever was passed: stored JSON (cloned) or a live engine
 * slate (its free notes, in stored form). Every connector gets an id and a
 * parentId, the way the engine's loader gives them.
 */
export function toStoredSlate(input: any): StoredSlate {
  const live = input?.nodes && !Array.isArray(input.nodes);
  // The v1 facade (Slatebox.slate) wraps the engine's slate and notes as `v2`.
  const engine = live ? input.v2 ?? input : null;
  const slate: StoredSlate = live
    ? {
        options: plain(engine.options || {}),
        nodes: (engine.freeNodes?.() ?? engine.nodes.allNodes ?? []).map((node: any) => liveNode(node?.v2 ?? node)),
      }
    : plain(input || {});
  slate.options ||= {};
  slate.nodes = (Array.isArray(slate.nodes) ? slate.nodes : []).map((node: any) => {
    const stored: StoredNode = node?.options ? node : { options: { ...(node || {}) }, relationships: node?.relationships };
    if (stored.options.relationships) delete stored.options.relationships;
    stored.relationships = { ...(stored.relationships || {}), associations: [...(stored.relationships?.associations || [])] };
    stored.relationships.associations.forEach((association) => {
      association.parentId ||= stored.options.id;
      association.id ||= defaultConnectorId(association.parentId, association.childId);
    });
    return stored;
  });
  return slate;
}

function liveNode(node: any): StoredNode {
  const options = plain(node.options || {});
  if (options.x !== undefined) {
    options.xPos = options.x;
    delete options.x;
  }
  if (options.y !== undefined) {
    options.yPos = options.y;
    delete options.y;
  }
  if (options.fontColor !== undefined && options.foregroundColor === undefined) options.foregroundColor = options.fontColor;
  const rotation = typeof node.getRotation === "function" ? node.getRotation() : undefined;
  if (typeof rotation === "number") options.rotate = { ...(options.rotate || {}), rotationAngle: rotation };
  const relationships = node.relationships;
  const associations = typeof relationships?.getAssociations === "function"
    ? relationships.getAssociations()
    : Array.from(relationships?.associations || []);
  return {
    options,
    relationships: {
      associations: associations.map(({ parent, child, ...association }: any) => plain(association)),
    },
  };
}

export function allConnectors(slate: StoredSlate): Array<{ node: StoredNode; association: Record<string, any> }> {
  const seen = new Set<string>();
  const result: Array<{ node: StoredNode; association: Record<string, any> }> = [];
  for (const node of slate.nodes) {
    for (const association of node.relationships.associations) {
      if (seen.has(association.id)) continue;
      seen.add(association.id);
      result.push({ node, association });
    }
  }
  return result;
}

const cleanText = (value: unknown) => `${value ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();

/** The notes a selector names. A text selector naming several needs all: true. */
export function selectNotes(slate: StoredSlate, selector: NodeSelector, label: string): StoredNode[] {
  const nodes = slate.nodes;
  if (selector.ids) {
    return selector.ids.map((id) => nodes.find((node) => noteId(node) === id)).filter(Boolean) as StoredNode[];
  }
  if (selector.text !== undefined) {
    const wanted = cleanText(selector.text);
    const found = nodes.filter((node) =>
      selector.match === "contains" ? cleanText(node.options.text).includes(wanted) : cleanText(node.options.text) === wanted,
    );
    if (found.length > 1 && selector.all !== true) {
      throw new OperationPlanError(
        "ambiguous_selector",
        400,
        `${label} "${selector.text}" matches ${found.length} notes (${found.map(noteId).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: found.map((node) => ({ id: noteId(node), text: node.options.text ?? "" })) },
      );
    }
    return found;
  }
  if (selector.within) {
    const area = selector.within;
    return nodes.filter((node) => {
      const b = box(node);
      return b.x >= area.x && b.y >= area.y && b.x + b.width <= area.x + area.width && b.y + b.height <= area.y + area.height;
    });
  }
  if (selector.groupId !== undefined) return nodes.filter((node) => node.options.groupId === selector.groupId);
  return selector.all === true ? [...nodes] : [];
}
