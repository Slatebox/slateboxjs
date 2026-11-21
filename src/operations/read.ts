/**
 * readSlate: the one read of a slate's canvas, built from the same key tables
 * as the write contract. Every note carries every key an operation can set,
 * read back the way the engine's loader reads it, so a note read here can be
 * sent straight back as `changes`. Connectors carry every connector key.
 *
 * Selection: notes by ids, within a rectangle, by group or by text (the same
 * matcher a write's selector uses, so a read finds exactly the notes a write
 * would change); which note keys to return; and cursor paging bounded by a
 * note count and a size ceiling, in place of a fixed cut.
 *
 * Comment markers (the "?" notes the comment tool draws) are part of the
 * comment thread, not the drawing: they are left out of every read.
 */
import { OperationPlanError } from "./contract";
import { CONNECTOR_END_KEYS, CONNECTOR_KEYS } from "./keys/connector";
import { readEnds } from "./line-ends";
import { NODE_KEYS } from "./keys/node";
import { checkSelector, type NodeSelector } from "./keys/selector";
import { backgroundOf } from "./keys/slate";
import { allConnectors, box, isFreeEnd, noteId, selectNotes, toStoredSlate, type StoredNode, type StoredSlate } from "./stored";

/** Keys every note read carries besides the writable ones: what a person sees but cannot yet set by plan. */
export const NOTE_READ_KEYS = ["id", ...Object.keys(NODE_KEYS), "image"] as const;
export const READ_LIMITS = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 60000 });

export interface ReadSelection {
  /** Note keys to return (id is always returned). Left out, every key. */
  fields?: string[];
  ids?: string[];
  within?: { x: number; y: number; width: number; height: number };
  groupId?: string;
  /** Whole text of a note, ignoring case and extra spaces; match "contains" to search. */
  q?: string;
  match?: "exact" | "contains";
  /** Notes per page, 1 to 500. */
  limit?: number;
  /** The nextCursor of the page before. */
  cursor?: string;
  /** Size ceiling for one page, in characters of JSON. */
  maxChars?: number;
}

export interface SlateRead {
  name: string;
  description: string;
  background: { color: string; gradient?: Record<string, any> } | null;
  /** The box around every note on the slate, or null when it has none. */
  bounds: { x: number; y: number; width: number; height: number } | null;
  /** Notes the selection matches, on every page. */
  nodeCount: number;
  nodes: Array<Record<string, any>>;
  /** The connectors that start at a note on this page. Across pages each appears once. */
  connections: Array<Record<string, any>>;
  /** Pass as cursor for the next page; null on the last. */
  nextCursor: string | null;
}

export const isCommentMarker = (node: StoredNode) => node.options.isComment === true;

/** One note, read through the key table. */
export function readNote(node: StoredNode, fields?: readonly string[]): Record<string, any> {
  const options = node.options;
  const want = (key: string) => !fields || fields.includes(key);
  const out: Record<string, any> = { id: noteId(node) };
  for (const [key, spec] of Object.entries(NODE_KEYS)) {
    if (!want(key)) continue;
    const value = spec.read(options);
    out[key] = value === undefined ? null : value;
  }
  if (want("image")) out.image = options.image || null;
  return out;
}

/** One connector, read through the connector key table. */
export function readConnector(association: Record<string, any>): Record<string, any> {
  const free = isFreeEnd(association);
  const out: Record<string, any> = { id: association.id, from: association.parentId, to: free ? null : association.childId };
  for (const [key, spec] of Object.entries(CONNECTOR_KEYS)) {
    if ((CONNECTOR_END_KEYS as readonly string[]).includes(key)) continue;
    const value = association[spec.field ?? key];
    out[key] = value === undefined ? null : value;
  }
  if (free) out.toPoint = association.targetPoint ?? null;
  // How the ends behave, when either is not the usual (both following their notes).
  const ends = readEnds(association);
  if (ends.fromEnd !== "follow" || ends.toEnd !== "follow") Object.assign(out, ends);
  return out;
}

const invalid = (message: string) => new OperationPlanError("invalid_selection", 400, message);

function selector(selection: ReadSelection): NodeSelector | null {
  const given: NodeSelector = {};
  if (selection.ids !== undefined) given.ids = selection.ids;
  if (selection.within !== undefined) given.within = selection.within;
  if (selection.groupId !== undefined) given.groupId = selection.groupId;
  if (selection.q !== undefined) {
    given.text = selection.q;
    // A read lists every note a write naming this text would have to choose between.
    given.all = true;
    if (selection.match !== undefined) given.match = selection.match;
  } else if (selection.match !== undefined) {
    throw invalid("match goes with q.");
  }
  if (!Object.keys(given).length) return null;
  const errors = checkSelector(given, "selection").map((error) =>
    error.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q"),
  );
  if (errors.length) throw invalid(errors.join(" "));
  return given;
}

// A cursor names the last note of the page before and where it stood: a stored slate can hold
// two notes with one id, and the position tells them apart. It runs in the browser too, so no
// Buffer.
interface Cursor {
  after: string;
  at: number;
}
const encodeCursor = (cursor: Cursor) =>
  btoa(encodeURIComponent(JSON.stringify(cursor))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function decodeCursor(cursor: string): Cursor {
  try {
    const { after, at } = JSON.parse(decodeURIComponent(atob(cursor.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof after === "string" && after && Number.isSafeInteger(at) && at >= 0) return { after, at };
  } catch {
    /* falls through */
  }
  throw invalid("cursor is not one this slate gave. Read again from the first page.");
}

// Where the page before ended: the note with the cursor's id nearest the position it stood at,
// so notes added or removed before it do not lose the place, and a repeated id is never
// read twice.
function resume(matched: StoredNode[], { after, at }: Cursor): number {
  let best = -1;
  matched.forEach((node, index) => {
    if (noteId(node) === after && (best < 0 || Math.abs(index - at) < Math.abs(best - at))) best = index;
  });
  if (best < 0) throw invalid("The note this cursor continues from is gone. Read again from the first page.");
  return best + 1;
}

function boundsOf(nodes: StoredNode[]): SlateRead["bounds"] {
  if (!nodes.length) return null;
  const boxes = nodes.map(box);
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const right = Math.max(...boxes.map((b) => b.x + b.width));
  const bottom = Math.max(...boxes.map((b) => b.y + b.height));
  return { x, y, width: right - x, height: bottom - y };
}

/** Read a stored or live slate. Throws OperationPlanError invalid_selection (400) for a selection it cannot apply. */
export function readSlate(input: any, selection: ReadSelection = {}): SlateRead {
  const slate: StoredSlate = toStoredSlate(input);
  const drawn = slate.nodes.filter((node) => !isCommentMarker(node));
  const fields = selection.fields;
  if (fields !== undefined) {
    const unknown = fields.filter((key) => !(NOTE_READ_KEYS as readonly string[]).includes(key));
    if (unknown.length) throw invalid(`Unknown note field: ${unknown.join(", ")}. Choose from ${NOTE_READ_KEYS.join(", ")}.`);
  }
  const limit = selection.limit ?? READ_LIMITS.notes;
  if (!Number.isInteger(limit) || limit < 1 || limit > READ_LIMITS.maxNotes)
    throw invalid(`limit must be a whole number from 1 to ${READ_LIMITS.maxNotes}.`);
  const maxChars = selection.maxChars ?? READ_LIMITS.maxChars;

  const chosen = selector(selection);
  const matched = chosen ? selectNotes({ ...slate, nodes: drawn }, chosen, "selection") : drawn;
  let start = 0;
  if (selection.cursor !== undefined) start = resume(matched, decodeCursor(selection.cursor));

  const markers = new Set(slate.nodes.filter(isCommentMarker).map(noteId));
  const byParent = new Map<string, Record<string, any>[]>();
  for (const { association } of allConnectors(slate)) {
    if (markers.has(association.parentId) || markers.has(association.childId)) continue;
    const list = byParent.get(association.parentId) ?? [];
    list.push(association);
    byParent.set(association.parentId, list);
  }

  const nodes: Array<Record<string, any>> = [];
  const connections: Array<Record<string, any>> = [];
  let size = 0;
  let index = start;
  for (; index < matched.length && nodes.length < limit; index += 1) {
    const node = matched[index];
    const read = readNote(node, fields);
    const lines = (byParent.get(noteId(node)) ?? []).map(readConnector);
    const cost = JSON.stringify(read).length + JSON.stringify(lines).length;
    // The ceiling cuts a page short, never to nothing: one note always fits.
    if (nodes.length && size + cost > maxChars) break;
    size += cost;
    nodes.push(read);
    connections.push(...lines);
  }
  const last = nodes[nodes.length - 1];
  return {
    name: slate.options.name || "",
    description: slate.options.description || "",
    background: backgroundOf(slate.options.containerStyle),
    bounds: boundsOf(drawn),
    nodeCount: matched.length,
    nodes,
    connections,
    nextCursor: index < matched.length && last ? encodeCursor({ after: last.id, at: index - 1 }) : null,
  };
}

/** Slate options a document carries. Visibility and the app's own fields stay with the app. */
export const DOCUMENT_OPTION_KEYS = [
  "id", "name", "description", "enabled", "allowDrag", "followMe", "mindMapMode",
  "autoResizeNodesBasedOnText", "useLayoutQuadrants", "autoEnableDefaultFilters",
  "showbirdsEye", "sizeOfbirdsEye", "showMultiSelect", "showZoom", "showUndoRedo", "showStatus", "showLocks",
  "isTemplate", "basedOnTemplate", "basedOnThemeId", "syncWithTheme", "allowCollaboration",
  "eligibleForThemeCompilation", "defaultLineColor", "themeId", "layoutType",
  "disableAutoLayoutOfManuallyPositionedNodes", "nodeOrder", "viewPort", "containerStyle",
] as const;

/**
 * The slate as the engine loads it ({options, nodes, shareId}): what the
 * engine's own serializer writes, without visibility flags, access keys,
 * the app's record fields or comment markers.
 */
export function toSlateDocument(input: any): { options: Record<string, any>; nodes: StoredNode[]; shareId: string } {
  const slate = toStoredSlate(input);
  const markers = new Set(slate.nodes.filter(isCommentMarker).map(noteId));
  const options: Record<string, any> = {};
  for (const key of DOCUMENT_OPTION_KEYS) if (slate.options[key] !== undefined) options[key] = slate.options[key];
  const nodes = slate.nodes
    .filter((node) => !markers.has(noteId(node)))
    .map((node) => ({
      options: node.options,
      relationships: {
        ...node.relationships,
        associations: node.relationships.associations.filter((association) => !markers.has(association.childId)),
      },
    }));
  return { options, nodes, shareId: `${input?.shareId ?? slate.options.shareId ?? ""}` };
}
