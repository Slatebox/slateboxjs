/**
 * applyPlanToJSON: applies a canvas plan to a stored slate and returns the new
 * slate, the plan as it was carried out (every selector resolved to ids, every
 * new id and position fixed, so replaying it gives the same result), and a
 * report of what each operation matched, changed and skipped.
 */
import { prepareShape } from "../shapes";
import {
  CONNECTED_NOTE_GAP,
  contractLimits,
  contractLists,
  DUPLICATE_OFFSET,
  OperationPlanError,
  type ContractOptions,
  type OperationReport,
  type SlateOperation,
  type SlateOperationPlan,
  type SlateOperationReport,
} from "./contract";
import { NODE_INTENT_KEYS, NODE_KEYS } from "./keys/node";
import { CONNECTOR_END_KEYS, CONNECTOR_KEYS, FREE_END_PREFIX, NEW_CONNECTOR } from "./keys/connector";
import { moveLineEnds } from "./line-ends";
import { SLATE_KEYS } from "./keys/slate";
import { alignPositions, distributePositions, tidyPositions, treePositions, type AlignMode, type LayoutBox, type Position } from "./layout";
import { NOTE_PRESETS } from "../core/NoteDefaults";
import type { Lists } from "./keys/values";
import {
  allConnectors,
  box,
  defaultConnectorId,
  isFreeEnd,
  noteId,
  read,
  selectNotes,
  toStoredSlate,
  type StoredNode,
  type StoredSlate,
} from "./stored";
import { DESTRUCTIVE_INTENT, validatePlan } from "./validate";

export interface ApplyOptions extends ContractOptions {
  userMessage?: string;
  idFactory?: () => string;
  /** Refuse with 409 no_match when an operation matches nothing (a save, not a preview). */
  requireMatches?: boolean;
  /**
   * The plan is a carried-out (materialized) plan being applied again, as the
   * run listener does: an id it names that already exists was made by that
   * run, so it is left as it is. Otherwise an id already in use is refused
   * (409 id_taken), so later operations cannot edit the wrong object.
   */
  replay?: boolean;
}

export interface ApplyResult {
  slate: StoredSlate;
  materializedPlan: SlateOperationPlan;
  report: SlateOperationReport;
}

function randomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let index = 0; index < 12; index += 1) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

/** Black or white, whichever reads better on the fill (same rule as utils.whiteOrBlack). */
function textColorOn(fill: string): "#ffffff" | "#000000" {
  const channel = (hex: string) => {
    const value = (parseInt(hex, 16) || 0) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  const luminance = (hex: string) => 0.2126 * channel(hex.substr(1, 2)) + 0.7152 * channel(hex.substr(3, 2)) + 0.0722 * channel(hex.substr(-2));
  const contrast = (a: string, b: string) => {
    const [first, second] = [luminance(a), luminance(b)];
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  };
  const color = /^#[0-9a-f]{6}$/i.test(fill) ? fill : "#7aa2c8";
  return contrast(color, "#ffffff") > contrast(color, "#000000") ? "#ffffff" : "#000000";
}

type Rect = { x: number; y: number; width: number; height: number };

function overlaps(first: Rect, second: Rect, gap: number): boolean {
  return (
    first.x < second.x + second.width + gap &&
    first.x + first.width + gap > second.x &&
    first.y < second.y + second.height + gap &&
    first.y + first.height + gap > second.y
  );
}

/** Shift a new group outward, in its direction, until it clears every note. */
function clearOfNotes(points: Array<{ x: number; y: number }>, obstacles: Rect[], width: number, height: number, direction: string, gap: number) {
  let result = points;
  for (let attempt = 0; attempt <= obstacles.length; attempt += 1) {
    const hits = obstacles.filter((obstacle) => result.some((point) => overlaps({ ...point, width, height }, obstacle, gap)));
    if (!hits.length) return result;
    let dx = 0;
    let dy = 0;
    if (direction === "left") dx = Math.min(...hits.map((o) => o.x - gap)) - Math.max(...result.map((p) => p.x + width));
    else if (direction === "above") dy = Math.min(...hits.map((o) => o.y - gap)) - Math.max(...result.map((p) => p.y + height));
    else if (direction === "below" || direction === "center") dy = Math.max(...hits.map((o) => o.y + o.height + gap)) - Math.min(...result.map((p) => p.y));
    else dx = Math.max(...hits.map((o) => o.x + o.width + gap)) - Math.min(...result.map((p) => p.x));
    result = result.map((point) => ({ x: point.x + dx, y: point.y + dy }));
  }
  return result;
}

function findReference(slate: StoredSlate, relativeTo?: string): StoredNode | undefined {
  if (relativeTo) {
    const byId = slate.nodes.find((node) => noteId(node) === relativeTo);
    if (byId) return byId;
    const byText = slate.nodes.filter((node) => `${node.options.text ?? ""}`.trim().toLowerCase() === relativeTo.trim().toLowerCase());
    if (byText.length === 1) return byText[0];
  }
  return [...slate.nodes].sort((a, b) => box(b).x + box(b).width - (box(a).x + box(a).width))[0];
}

function grid(count: number, arrangement: string) {
  const columns = arrangement === "grid" ? Math.ceil(Math.sqrt(count)) : count;
  return Array.from({ length: count }, (_, index) => ({
    row: arrangement === "column" ? index : arrangement === "grid" ? Math.floor(index / columns) : 0,
    column: arrangement === "column" ? 0 : arrangement === "grid" ? index % columns : index,
  }));
}

function addPositions(slate: StoredSlate, operation: SlateOperation, width: number, height: number) {
  const count = operation.count!;
  const placement = operation.placement || {};
  const gap = placement.gap ?? (placement.connect ? CONNECTED_NOTE_GAP : 48);
  if (operation.x !== undefined && operation.y !== undefined) {
    const arrangement = placement.arrangement || "row";
    const points = grid(count, arrangement).map(({ row, column }) => ({
      x: operation.x! + column * (width + gap),
      y: operation.y! + row * (height + gap),
    }));
    return { points, arrangement, gap };
  }
  const reference = findReference(slate, placement.relativeTo);
  const origin = reference ? box(reference) : { x: 0, y: 0, width: 160, height: 100 };
  const direction = placement.direction || "right";
  const arrangement = placement.arrangement || (["left", "right"].includes(direction) ? "column" : "row");
  const proposed = grid(count, arrangement).map(({ row, column }) => {
    let x = origin.x + column * (width + gap);
    let y = origin.y + row * (height + gap);
    if (direction === "right") x += origin.width + gap;
    if (direction === "left") x -= width + gap;
    if (direction === "below") y += origin.height + gap;
    if (direction === "above") y -= height + gap;
    return { x, y };
  });
  return { points: clearOfNotes(proposed, slate.nodes.map(box), width, height, direction, gap), arrangement, gap };
}

function freeEndChild(connectorId: string | undefined, idFactory: () => string): { id?: string; childId: string } {
  if (!connectorId) return { childId: `${FREE_END_PREFIX}${idFactory()}` };
  const named = connectorId.match(/->(__free_.+)$/);
  return { id: connectorId, childId: named ? named[1] : `${FREE_END_PREFIX}${connectorId.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}

/** A default id not yet taken (a caller-chosen id that is taken is refused instead). */
function unusedDefaultId(taken: Set<string>, wanted: string): string {
  if (!taken.has(wanted)) return wanted;
  let suffix = 2;
  while (taken.has(`${wanted}~${suffix}`)) suffix += 1;
  return `${wanted}~${suffix}`;
}

const pairKey = (parentId: string, childId: string) => JSON.stringify([parentId, childId]);

function idTaken(prefix: string, noun: string, ids: string[]): OperationPlanError {
  return new OperationPlanError(
    "id_taken",
    409,
    `${prefix} names ${noun} ids already in use: ${ids.join(", ")}. Choose new ids, or name the existing ${noun}s in a later operation.`,
    { ids },
  );
}

const same = (first: unknown, second: unknown) => JSON.stringify(first) === JSON.stringify(second);

/**
 * What a connected note does not take from its source (Node.cloneNodeOptions keeps the rest).
 * It keeps the source's link, as the canvas's connected note does (the owner's decision on P10-8).
 */
const NOT_COPIED_TO_CONNECTED = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"];

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
/** The bound a point may take (keys/node.ts x and y, keys/values.ts point). */
const COORDINATE_BOUND = 1000000;

const ALIGN_MODES: Record<string, AlignMode> = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom",
};

const layoutBox = (node: StoredNode): LayoutBox => ({ id: noteId(node), ...box(node), rotationAngle: read(node, "rotationAngle") });

export function applyPlanToJSON(input: any, plan: SlateOperationPlan, options: ApplyOptions = {}): ApplyResult {
  const lists: Lists = contractLists(options);
  const limits = contractLimits(options);
  const idFactory = options.idFactory || randomId;
  const slate = toStoredSlate(input);
  const validation = validatePlan(plan, {
    ...options,
    existingNodeIds: slate.nodes.map(noteId),
    existingConnectionIds: allConnectors(slate).map(({ association }) => association.id),
  });
  if (!validation.valid) {
    throw new OperationPlanError("invalid_operation_plan", 400, validation.errors.join(" "), { errors: validation.errors });
  }

  const before = JSON.stringify(slate);
  const notesBefore = slate.nodes.length;
  const materialized: SlateOperation[] = [];
  const report: SlateOperationReport = {
    created: [],
    updated: [],
    deleted: [],
    connected: [],
    disconnected: [],
    connectionsUpdated: [],
    operations: [],
    skipped: [],
    warnings: [],
    unchanged: false,
  };

  plan.operations.forEach((operation, index) => {
    const number = index + 1;
    const prefix = `Operation ${number}`;
    const entry: OperationReport = { operation: number, kind: operation.kind, matched: [], changed: [] };
    report.operations.push(entry);
    const noNotes = () => report.warnings.push(`${prefix} matched no notes.`);
    const skipLocked = (node: StoredNode) => {
      report.skipped.push({ operation: number, id: noteId(node), reason: "locked" });
    };
    // Checked before an operation makes its notes, so a plan that keeps
    // doubling the slate is refused at the operation that passes the limit,
    // not after every copy has been held in memory.
    const guardNoteLimit = (adding: number) => {
      const leaving = slate.nodes.length + adding;
      if (adding > 0 && leaving > limits.notesPerSlate && leaving > notesBefore) {
        throw new OperationPlanError(
          "note_limit",
          422,
          `${prefix} would leave ${leaving} notes; a slate can hold at most ${limits.notesPerSlate} notes.`,
          { limit: limits.notesPerSlate, operation: number },
        );
      }
    };
    const guardConnectorLimit = (connectors: number, made: number) => {
      if (made > 0 && connectors > limits.connectorsPerSlate) {
        throw new OperationPlanError(
          "connector_limit",
          422,
          `${prefix} would leave ${connectors} connectors; a slate can hold at most ${limits.connectorsPerSlate} connectors.`,
          { limit: limits.connectorsPerSlate, operation: number },
        );
      }
    };

    switch (operation.kind) {
      case "add_nodes": {
        const preset = operation.preset ? NOTE_PRESETS[operation.preset] : undefined;
        const connect = operation.placement?.connect === true;
        // A connected note copies its source, so the source must be the note named.
        const source = connect ? slate.nodes.find((node) => noteId(node) === operation.placement!.relativeTo) : undefined;
        if (connect && !source) {
          throw new OperationPlanError("no_match", 409, `${prefix} placement.relativeTo names no note on the slate to connect from.`, { operation: number });
        }
        if (source && source.options.isLocked === true) {
          // A locked note shows no connection handles, so nothing grows from it.
          skipLocked(source);
          return;
        }
        const shape = operation.shape ?? preset?.shape;
        const sourceBox = source ? box(source) : undefined;
        const triangle = typeof shape === "string" && shape.toLowerCase() === "triangle";
        // A custom outline keeps its proportions: 180 on its longer side.
        const aspect = shape && typeof shape === "object" ? prepareAspect(shape) : 0;
        const width = operation.width ?? preset?.width ?? sourceBox?.width ?? (triangle ? 150 : aspect ? Math.round(aspect >= 1 ? 180 : 180 * aspect) : 180);
        const height = operation.height ?? preset?.height ?? sourceBox?.height ?? (triangle ? 130 : aspect ? Math.round(aspect >= 1 ? 180 / aspect : 180) : 110);
        const reference = source ?? findReference(slate, operation.placement?.relativeTo);
        const backgroundColor =
          operation.style?.backgroundColor || (preset?.style as Record<string, any> | undefined)?.backgroundColor || reference?.options.backgroundColor || "#7aa2c8";
        const { points, arrangement, gap } = addPositions(slate, operation, width, height);
        const takenConnectors = new Set(allConnectors(slate).map(({ association }) => association.id));
        const existingIds = new Set(slate.nodes.map(noteId));
        const taken = (operation.ids || []).filter((id) => existingIds.has(id));
        if (taken.length && !options.replay) throw idTaken(prefix, "note", taken);
        const ids = points.map((_, position) => operation.ids?.[position] || idFactory());
        guardNoteLimit(ids.filter((id) => !existingIds.has(id)).length);
        if (source) guardConnectorLimit(takenConnectors.size + ids.filter((id) => !existingIds.has(id)).length, ids.length);
        points.forEach(({ x, y }, position) => {
          const id = ids[position];
          entry.matched.push(id);
          if (existingIds.has(id)) return;
          const text = operation.text ? (operation.count! > 1 ? operation.text.replace(/\{n\}/g, `${position + 1}`) : operation.text) : "";
          const copied = source ? clone(source.options) : undefined;
          if (copied) for (const key of NOT_COPIED_TO_CONNECTED) delete copied[key];
          const created: Record<string, any> = copied ? { ...copied, id, name: id, text, width, height } : {
            id,
            name: id,
            text,
            defaultShaped: true,
            width,
            height,
            backgroundColor,
            borderColor: "#333333",
            borderWidth: 1,
            borderOpacity: 1,
            borderStyle: "solid",
            opacity: 1,
            fontFamily: "Manrope",
            fontSize: 20,
            textXAlign: "middle",
            textYAlign: "middle",
            lineColor: "#333333",
            lineWidth: 3,
            filters: { vect: null, text: null },
            animations: { vect: null, text: null },
          };
          if (shape) NODE_KEYS.shape.store(created, shape, lists);
          NODE_KEYS.x.store(created, x, lists);
          NODE_KEYS.y.store(created, y, lists);
          if (!source) NODE_KEYS.foregroundColor.store(created, textColorOn(backgroundColor), lists);
          for (const [key, value] of Object.entries(preset?.style || {})) NODE_KEYS[key].store(created, value, lists);
          for (const [key, value] of Object.entries(operation.style || {})) NODE_KEYS[key].store(created, value, lists);
          slate.nodes.push({ options: created, relationships: { associations: [] } });
          entry.changed.push(id);
          report.created.push(id);
          if (source) {
            const connectorId = unusedDefaultId(takenConnectors, defaultConnectorId(noteId(source), id));
            takenConnectors.add(connectorId);
            source.relationships.associations.push({ id: connectorId, parentId: noteId(source), childId: id, ...NEW_CONNECTOR });
            report.connected.push(connectorId);
          }
        });
        const { placement, ...rest } = operation;
        materialized.push({
          ...rest,
          ids,
          x: points[0].x,
          y: points[0].y,
          placement: { arrangement, gap, ...(source ? { relativeTo: noteId(source), connect: true } : {}) },
        });
        return;
      }

      case "update_nodes": {
        const notes = selectNotes(slate, operation.target!, `${prefix} target`);
        entry.matched = notes.map(noteId);
        if (!notes.length) noNotes();
        const applied: string[] = [];
        for (const node of notes) {
          if (node.options.isLocked === true && operation.changes!.locked !== false) {
            skipLocked(node);
            continue;
          }
          const was = JSON.stringify(node.options);
          for (const [key, value] of Object.entries(operation.changes!)) {
            if (!NODE_INTENT_KEYS[key]) NODE_KEYS[key].store(node.options, value, lists);
          }
          keepCustomProportions(node.options, operation.changes!);
          applied.push(noteId(node));
          if (JSON.stringify(node.options) !== was) entry.changed.push(noteId(node));
        }
        if (operation.changes!.order && applied.length) {
          // The note list is the z-order: the last note is drawn on top.
          const moving = new Set(applied);
          const before = slate.nodes.map(noteId);
          const chosen = slate.nodes.filter((node) => moving.has(noteId(node)));
          const others = slate.nodes.filter((node) => !moving.has(noteId(node)));
          slate.nodes = operation.changes!.order === "front" ? [...others, ...chosen] : [...chosen, ...others];
          slate.nodes.forEach((node, index) => {
            const id = noteId(node);
            if (moving.has(id) && before[index] !== id && !entry.changed.includes(id)) entry.changed.push(id);
          });
        }
        report.updated.push(...applied);
        if (applied.length) materialized.push({ kind: "update_nodes", target: { ids: applied }, changes: operation.changes });
        return;
      }

      case "delete_nodes": {
        const notes = selectNotes(slate, operation.target!, `${prefix} target`);
        entry.matched = notes.map(noteId);
        if (!notes.length) noNotes();
        // Deleting every note through a broad selector (all, within, text with
        // all, groupId) needs the explicit request too, not only {all: true}.
        const wholeSlate = !operation.target!.ids && slate.nodes.length > 1 && notes.length === slate.nodes.length;
        if (wholeSlate && !DESTRUCTIVE_INTENT.test(options.userMessage || "")) {
          throw new OperationPlanError("invalid_operation_plan", 400, `${prefix} cannot delete every note without an explicit request.`);
        }
        const removed = new Set<string>();
        for (const node of notes) {
          if (node.options.isLocked === true) skipLocked(node);
          else removed.add(noteId(node));
        }
        slate.nodes = slate.nodes.filter((node) => !removed.has(noteId(node)));
        for (const node of slate.nodes) {
          node.relationships.associations = node.relationships.associations.filter(
            (association) => !removed.has(association.parentId) && !removed.has(association.childId),
          );
        }
        entry.changed = [...removed];
        report.deleted.push(...removed);
        if (removed.size) materialized.push({ kind: "delete_nodes", target: { ids: [...removed] } });
        return;
      }

      case "duplicate_nodes": {
        const notes = selectNotes(slate, operation.target!, `${prefix} target`);
        entry.matched = notes.map(noteId);
        if (!notes.length) noNotes();
        const offset = operation.offset ?? DUPLICATE_OFFSET;
        const existingIds = new Set(slate.nodes.map(noteId));
        const taken = (operation.ids || []).filter((id) => existingIds.has(id));
        if (taken.length && !options.replay) throw idTaken(prefix, "note", taken);
        const copyIds = notes.map((_, position) => operation.ids?.[position] || idFactory());
        guardNoteLimit(copyIds.filter((id) => !existingIds.has(id)).length);
        for (const node of notes) {
          const x = read(node, "x") + offset.x;
          const y = read(node, "y") + offset.y;
          if (Math.abs(x) > COORDINATE_BOUND || Math.abs(y) > COORDINATE_BOUND) {
            throw new OperationPlanError(
              "invalid_operation_plan",
              400,
              `${prefix} would put the copy of ${noteId(node)} at ${x}, ${y}; a note's position must be from -${COORDINATE_BOUND} to ${COORDINATE_BOUND}.`,
            );
          }
        }
        const copyOf = new Map(notes.map((node, position) => [noteId(node), copyIds[position]]));
        const made = new Map<string, StoredNode>();
        notes.forEach((node, position) => {
          const id = copyIds[position];
          if (existingIds.has(id)) return;
          // Ctrl+D copies every option of the note (Keyboard.snapshotNode).
          const copy: StoredNode = { options: { ...clone(node.options), id, name: id }, relationships: { associations: [] } };
          NODE_KEYS.x.store(copy.options, read(node, "x") + offset.x, lists);
          NODE_KEYS.y.store(copy.options, read(node, "y") + offset.y, lists);
          slate.nodes.push(copy);
          made.set(id, copy);
          entry.changed.push(id);
          report.created.push(id);
        });
        // A connector with both ends among the copied notes is made again between the copies.
        const takenConnectors = new Set(allConnectors(slate).map(({ association }) => association.id));
        let copied = 0;
        for (const node of notes) {
          const parent = made.get(copyOf.get(noteId(node))!);
          if (!parent) continue;
          for (const association of node.relationships.associations) {
            const childCopy = copyOf.get(association.childId);
            if (!childCopy || isFreeEnd(association)) continue;
            const id = unusedDefaultId(takenConnectors, defaultConnectorId(noteId(parent), childCopy));
            takenConnectors.add(id);
            parent.relationships.associations.push({ ...clone(association), id, parentId: noteId(parent), childId: childCopy });
            report.connected.push(id);
            copied += 1;
          }
        }
        guardConnectorLimit(takenConnectors.size, copied);
        if (notes.length) materialized.push({ kind: "duplicate_nodes", target: { ids: notes.map(noteId) }, ids: copyIds, offset: { ...offset } });
        return;
      }

      case "connect_nodes": {
        const parents = selectNotes(slate, operation.from!, `${prefix} from`);
        const point = (operation.to as any)?.point;
        const children = point ? [] : selectNotes(slate, operation.to!, `${prefix} to`);
        if (!parents.length || (!point && !children.length)) noNotes();
        const pairs = parents.length * (point ? 1 : children.length);
        if (pairs > limits.connectorsPerOperation) {
          throw new OperationPlanError(
            "connector_limit",
            422,
            `${prefix} would join ${pairs} pairs of notes; one operation may join at most ${limits.connectorsPerOperation}.`,
            { limit: limits.connectorsPerOperation },
          );
        }
        // Index the slate's connectors once per operation, not once per pair.
        const takenIds = new Set<string>();
        const joined = new Map<string, string>();
        for (const { association } of allConnectors(slate)) {
          takenIds.add(association.id);
          const key = pairKey(association.parentId, association.childId);
          if (!joined.has(key)) joined.set(key, association.id);
        }
        const taken: string[] = [];
        const connectorIds: string[] = [];
        const madeFrom: string[] = [];
        let pair = 0;
        for (const parent of parents) {
          const parentId = noteId(parent);
          const ends: Array<StoredNode | null> = point ? [null] : children.filter((child) => noteId(child) !== parentId);
          // A person cannot start a connector from a locked note (its handles are off).
          if (parent.options.isLocked === true) {
            if (ends.length) skipLocked(parent);
            pair += ends.length;
            continue;
          }
          if (ends.length) madeFrom.push(parentId);
          for (const child of ends) {
            const wanted = operation.ids?.[pair];
            pair += 1;
            if (!child) {
              const end = freeEndChild(wanted, idFactory);
              const id = end.id ?? defaultConnectorId(parentId, end.childId);
              if (takenIds.has(id)) {
                if (!options.replay) taken.push(id);
                connectorIds.push(id);
                entry.matched.push(id);
                continue;
              }
              parent.relationships.associations.push({ id, parentId, childId: end.childId, targetPoint: { ...point }, ...NEW_CONNECTOR, ...(operation.style || {}) });
              takenIds.add(id);
              connectorIds.push(id);
              entry.matched.push(id);
              entry.changed.push(id);
              report.connected.push(id);
              continue;
            }
            const childId = noteId(child);
            const existing = joined.get(pairKey(parentId, childId));
            if (existing) {
              connectorIds.push(existing);
              entry.matched.push(existing);
              continue;
            }
            if (wanted && takenIds.has(wanted)) {
              if (!options.replay) taken.push(wanted);
              connectorIds.push(wanted);
              entry.matched.push(wanted);
              continue;
            }
            const id = wanted || unusedDefaultId(takenIds, defaultConnectorId(parentId, childId));
            parent.relationships.associations.push({ id, parentId, childId, ...NEW_CONNECTOR, ...(operation.style || {}) });
            takenIds.add(id);
            joined.set(pairKey(parentId, childId), id);
            connectorIds.push(id);
            entry.matched.push(id);
            entry.changed.push(id);
            report.connected.push(id);
          }
        }
        if (taken.length) throw idTaken(prefix, "connector", taken);
        if (takenIds.size > limits.connectorsPerSlate && entry.changed.length) {
          throw new OperationPlanError(
            "connector_limit",
            422,
            `A slate can hold at most ${limits.connectorsPerSlate} connectors; this plan would leave ${takenIds.size}.`,
            { limit: limits.connectorsPerSlate },
          );
        }
        if (entry.changed.length) {
          materialized.push({
            kind: "connect_nodes",
            from: { ids: madeFrom },
            to: point ? ({ point: { ...point } } as any) : { ids: children.map(noteId) },
            ids: connectorIds,
            ...(operation.style ? { style: operation.style } : {}),
          });
        }
        return;
      }

      case "disconnect_nodes":
      case "update_connections": {
        let found: Array<{ node: StoredNode; association: Record<string, any> }>;
        if (operation.connectionIds) {
          const wanted = new Set(operation.connectionIds);
          found = allConnectors(slate).filter(({ association }) => wanted.has(association.id));
        } else {
          const from = new Set(selectNotes(slate, operation.from!, `${prefix} from`).map(noteId));
          const to = new Set(selectNotes(slate, operation.to!, `${prefix} to`).map(noteId));
          found = allConnectors(slate).filter(
            ({ association }) =>
              (from.has(association.parentId) && to.has(association.childId)) ||
              (to.has(association.parentId) && from.has(association.childId)),
          );
        }
        entry.matched = found.map(({ association }) => association.id);
        if (!found.length) report.warnings.push(`${prefix} matched no connectors.`);
        if (operation.kind === "disconnect_nodes") {
          for (const { node, association } of found) {
            node.relationships.associations = node.relationships.associations.filter((item) => item !== association);
          }
          entry.changed = [...entry.matched];
          report.disconnected.push(...entry.matched);
          if (found.length) materialized.push({ kind: "disconnect_nodes", connectionIds: entry.matched });
          return;
        }
        for (const { node, association } of found) {
          const was = JSON.stringify([noteId(node), association]);
          const style = Object.entries(operation.changes!).filter(([key]) => !(CONNECTOR_END_KEYS as readonly string[]).includes(key));
          for (const [key, value] of style) association[CONNECTOR_KEYS[key].field || key] = value;
          const owner = moveLineEnds(slate, node, association, operation.changes!, prefix, idFactory);
          if (JSON.stringify([noteId(owner), association]) !== was) entry.changed.push(association.id);
        }
        report.connectionsUpdated.push(...entry.matched);
        if (found.length) materialized.push({ kind: "update_connections", connectionIds: entry.matched, changes: operation.changes });
        return;
      }

      case "arrange_nodes": {
        const selected = selectNotes(slate, operation.target!, `${prefix} target`);
        entry.matched = selected.map(noteId);
        if (!selected.length) noNotes();
        const notes = selected.filter((node) => {
          if (node.options.isLocked !== true) return true;
          skipLocked(node);
          return false;
        });
        if (!notes.length) return;
        const layout = operation.layout!;
        let positions: Position[] | undefined;
        if (ALIGN_MODES[layout]) positions = alignPositions(ALIGN_MODES[layout], notes.map(layoutBox));
        else if (layout === "distribute-horizontal" || layout === "distribute-vertical") {
          positions = distributePositions(layout === "distribute-horizontal" ? "horizontal" : "vertical", notes.map(layoutBox));
        } else if (layout === "tidy") {
          const moving = new Set(notes.map(noteId));
          const obstacles = slate.nodes.filter((node) => !moving.has(noteId(node))).map(layoutBox);
          positions = tidyPositions(notes.map(layoutBox), obstacles, { gap: operation.gap ?? 20 });
        } else if (layout === "tree") {
          const edges = allConnectors(slate)
            .filter(({ association }) => !isFreeEnd(association))
            .map(({ association }) => [association.parentId, association.childId] as [string, string]);
          const moving = new Set(notes.map(noteId));
          const obstacles = slate.nodes.filter((node) => !moving.has(noteId(node))).map(layoutBox);
          positions = treePositions(notes.map(layoutBox), edges, { gap: operation.gap ?? 48, obstacles });
        }
        if (positions) {
          const byId = new Map(notes.map((node) => [noteId(node), node]));
          for (const position of positions) {
            const node = byId.get(position.id)!;
            const was = [read(node, "x"), read(node, "y")];
            NODE_KEYS.x.store(node.options, position.x, lists);
            NODE_KEYS.y.store(node.options, position.y, lists);
            if (!same(was, [position.x, position.y])) entry.changed.push(position.id);
          }
          report.updated.push(...notes.map(noteId));
          materialized.push({ kind: "arrange_nodes", target: { ids: notes.map(noteId) }, layout: operation.layout, ...(operation.gap !== undefined ? { gap: operation.gap } : {}) });
          return;
        }
        const boxes = notes.map(box);
        const gap = operation.gap ?? 48;
        const originX = Math.min(...boxes.map((b) => b.x));
        const originY = Math.min(...boxes.map((b) => b.y));
        const maxWidth = Math.max(...boxes.map((b) => b.width), 120);
        const maxHeight = Math.max(...boxes.map((b) => b.height), 80);
        const cells = grid(notes.length, operation.layout === "circle" ? "row" : operation.layout!);
        notes.forEach((node, position) => {
          const was = [read(node, "x"), read(node, "y")];
          let x: number;
          let y: number;
          if (operation.layout === "circle") {
            const radius = Math.max(180, notes.length * 35);
            const angle = (Math.PI * 2 * position) / notes.length;
            x = originX + radius + Math.cos(angle) * radius;
            y = originY + radius + Math.sin(angle) * radius;
          } else {
            x = originX + cells[position].column * (maxWidth + gap);
            y = originY + cells[position].row * (maxHeight + gap);
          }
          NODE_KEYS.x.store(node.options, x, lists);
          NODE_KEYS.y.store(node.options, y, lists);
          if (!same(was, [x, y])) entry.changed.push(noteId(node));
        });
        report.updated.push(...notes.map(noteId));
        materialized.push({ kind: "arrange_nodes", target: { ids: notes.map(noteId) }, layout: operation.layout, ...(operation.gap !== undefined ? { gap } : {}) });
        return;
      }

      case "update_slate": {
        const changes = operation.changes!;
        const was = JSON.stringify(slate);
        for (const [key, entryKey] of Object.entries(SLATE_KEYS)) {
          if (changes[key] !== undefined) entryKey.store(slate, changes[key]);
        }
        if (JSON.stringify(slate) !== was) entry.changed.push("slate");
        materialized.push({ kind: "update_slate", changes });
        return;
      }
    }
  });

  if (options.requireMatches && report.warnings.length) {
    const first = report.warnings[0];
    throw new OperationPlanError("no_match", 409, first, { operation: Number(first.match(/^Operation (\d+)/)?.[1]) });
  }
  report.unchanged = JSON.stringify(slate) === before;
  return { slate, materializedPlan: { message: plan.message.trim(), operations: materialized }, report };
}

/**
 * A custom shape put on a note keeps its proportions: the note keeps its width
 * (or the height it was given) and the other side follows the outline, as the
 * canvas and shapes.apply size it. A size given with the shape wins.
 */
function keepCustomProportions(options: Record<string, any>, changes: Record<string, any>): void {
  const shape = changes.shape;
  if (!shape || typeof shape !== "object" || options.shape !== "custom") return;
  if (changes.width !== undefined && changes.height !== undefined) return;
  const aspect = prepareAspect(shape);
  if (!aspect) return;
  const clamp = (v: number) => Math.round(Math.min(5000, Math.max(20, v)));
  if (changes.height !== undefined) options.width = clamp(Number(options.height) * aspect);
  else options.height = clamp(Number(options.width || 180) / aspect);
}

function prepareAspect(shape: unknown): number {
  const prepared = prepareShape(shape as Record<string, unknown>);
  return prepared.ok && prepared.shape.aspect > 0 ? Math.min(10, Math.max(0.1, prepared.shape.aspect)) : 0;
}
