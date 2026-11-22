/**
 * update_connections' end keys (keys/connector.ts CONNECTOR_END_KEYS) on a
 * stored slate: reconnect an end to another note, leave an end free at a point,
 * and pin an end or let it follow. The rules are core/LineEnds.ts, the same the
 * canvas uses when a person drags a line's end.
 */
import { OperationPlanError } from "./contract";
import { FREE_END_PREFIX } from "./keys/connector";
import { box, isFreeEnd, noteId, read, type StoredNode, type StoredSlate } from "./stored";
import { anchorPoint, anchorToward, flipLine, sideAnchor, type LineEnd, type NoteBox, type Side } from "../core/LineEnds";

const noteBox = (node: StoredNode): NoteBox => ({ ...box(node), rotation: Number(read(node, "rotationAngle")) || 0 });
const middle = (b: NoteBox) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 });

/**
 * Apply the end keys of one update_connections change to one connector, in
 * place. Returns the note that holds the connector afterwards (the starting end
 * moving to another note, or being let go, hands it to another note).
 */
export function moveLineEnds(
  slate: StoredSlate,
  owner: StoredNode,
  association: Record<string, any>,
  changes: Record<string, any>,
  prefix: string,
  idFactory: () => string,
): StoredNode {
  const find = (id: string) => slate.nodes.find((node) => noteId(node) === id);
  const refuse = (message: string): never => {
    throw new OperationPlanError("invalid_operation_plan", 400, `${prefix} ${message}`);
  };
  const noNote = (id: string): never => {
    throw new OperationPlanError("no_match", 409, `${prefix} names no note ${JSON.stringify(id)} on the slate.`);
  };
  const handTo = (from: StoredNode, to: StoredNode) => {
    if (from === to) return;
    from.relationships.associations = from.relationships.associations.filter((item) => item !== association);
    to.relationships.associations.push(association);
  };
  let holder = owner;

  // The far end: onto a note, or free at a point.
  if (changes.toNote !== undefined) {
    const target = find(changes.toNote) ?? noNote(changes.toNote);
    association.childId = noteId(target);
    delete association.targetPoint;
    association.targetAnchor = null;
  } else if (changes.toPoint !== undefined) {
    if (!isFreeEnd(association)) association.childId = `${FREE_END_PREFIX}${idFactory()}`;
    association.targetPoint = { x: changes.toPoint.x, y: changes.toPoint.y };
    association.targetAnchor = null;
  }

  // The starting end: onto a note (which then holds the line), or let go (the far end's note holds it).
  if (changes.fromNote !== undefined) {
    const from = find(changes.fromNote) ?? noNote(changes.fromNote);
    association.parentId = noteId(from);
    association.sourceAnchor = null;
    handTo(holder, from);
    holder = from;
  } else if (changes.fromPoint !== undefined) {
    if (isFreeEnd(association)) refuse(`keeps one end on a note: the far end of ${association.id} is already free.`);
    const far = find(association.childId) ?? noNote(association.childId);
    const flipped = flipLine(association);
    for (const key of Object.keys(association)) delete association[key];
    Object.assign(association, flipped, {
      parentId: noteId(far),
      childId: `${FREE_END_PREFIX}${idFactory()}`,
      targetPoint: { x: changes.fromPoint.x, y: changes.fromPoint.y },
    });
    handTo(holder, far);
    holder = far;
  }
  if (association.parentId === association.childId) refuse(`cannot connect ${association.id} from a note to itself.`);

  // Pin or follow, once each end is where it is going.
  const endPoint = (which: LineEnd) => {
    if (which === "target" && isFreeEnd(association)) return association.targetPoint;
    const note = find(which === "source" ? association.parentId : association.childId);
    if (!note) return null;
    const anchor = which === "source" ? association.sourceAnchor : association.targetAnchor;
    return anchor ? anchorPoint(noteBox(note), anchor) : middle(noteBox(note));
  };
  const pin = (which: LineEnd, mode: string, explicit: boolean) => {
    if (which === "target" && isFreeEnd(association)) {
      if (explicit) refuse(`cannot pin or follow the far end of ${association.id}: it is free, on no note.`);
      return;
    }
    const key = which === "source" ? "sourceAnchor" : "targetAnchor";
    if (mode === "follow") association[key] = null;
    else if (mode !== "pinned") association[key] = sideAnchor(mode as Side);
    else if (!association[key]) {
      const note = find(which === "source" ? association.parentId : association.childId);
      const toward = endPoint(which === "source" ? "target" : "source");
      if (note && toward) association[key] = anchorToward(noteBox(note), toward);
    }
  };
  if (changes.ends !== undefined) {
    pin("source", changes.ends, false);
    pin("target", changes.ends, false);
  }
  if (changes.fromEnd !== undefined) pin("source", changes.fromEnd, true);
  if (changes.toEnd !== undefined) pin("target", changes.toEnd, true);
  return holder;
}

/** How each end of a stored connector behaves, for reads. */
export function readEnds(association: Record<string, any>): { fromEnd: string; toEnd: string } {
  return {
    fromEnd: association.sourceAnchor ? "pinned" : "follow",
    toEnd: isFreeEnd(association) ? "free" : association.targetAnchor ? "pinned" : "follow",
  };
}
