/**
 * SlateDelta.ts - What changed between two serialized slates, note by note, and
 * how to carry that change into another serialized slate.
 *
 * Undo records are whole slates. When other people change the slate, their
 * change is carried into every record this person holds (UndoRedo.absorbRemote),
 * so that going back to a record takes back only this person's own steps and
 * never the others' work, whenever it was done.
 */

import type { NodeJSON, SlateJSON } from "./Serialization";

/** Slate options that describe this person's view or the room, not the drawing. */
const NOT_CARRIED = new Set<string>(["collabBaseline", "viewPort"]);

interface FieldDelta {
  set: Record<string, any>;
  unset: string[];
}

interface NodeChange extends FieldDelta {
  id: string;
  /** Lines leaving this note, keyed by linkKey: set (added or changed) and removed. */
  links: { set: Record<string, any>[]; removed: string[] };
}

export interface SlateDelta {
  options: FieldDelta;
  added: NodeJSON[];
  removed: string[];
  changed: NodeChange[];
}

const same = (a: unknown, b: unknown) => a === b || JSON.stringify(a) === JSON.stringify(b);
const idOf = (node: NodeJSON | undefined): string | undefined => node?.options?.id;
const linksOf = (node: NodeJSON): Record<string, any>[] => node.relationships?.associations ?? [];

/** One line's identity: its association id, or its two ends for lines stored without one. */
export function linkKey(link: Record<string, any>): string {
  return link.id != null && link.id !== "" ? String(link.id) : `${link.parentId}->${link.childId}`;
}

function diffFields(before: Record<string, any>, after: Record<string, any>, skip?: Set<string>): FieldDelta {
  const set: Record<string, any> = {};
  const unset: string[] = [];
  for (const key of Object.keys(after)) {
    if (skip?.has(key)) continue;
    if (!(key in before) || !same(before[key], after[key])) set[key] = after[key];
  }
  for (const key of Object.keys(before)) {
    if (skip?.has(key)) continue;
    if (!(key in after)) unset.push(key);
  }
  return { set, unset };
}

const emptyFields = (d: FieldDelta) => Object.keys(d.set).length === 0 && d.unset.length === 0;

function byId(nodes: NodeJSON[]): Map<string, NodeJSON> {
  const map = new Map<string, NodeJSON>();
  for (const node of nodes ?? []) {
    const id = idOf(node);
    if (id != null) map.set(id, node);
  }
  return map;
}

/** What changed from `before` to `after`, or null when nothing did. */
export function diffSlates(before: SlateJSON, after: SlateJSON): SlateDelta | null {
  const options = diffFields(before?.options ?? {}, after?.options ?? {}, NOT_CARRIED);
  const was = byId(before?.nodes ?? []);
  const now = byId(after?.nodes ?? []);
  const added: NodeJSON[] = [];
  const removed: string[] = [];
  const changed: NodeChange[] = [];

  for (const [id, node] of now) {
    const old = was.get(id);
    if (!old) {
      added.push(node);
      continue;
    }
    if (same(old, node)) continue;
    const fields = diffFields(old.options ?? {}, node.options ?? {});
    const oldLinks = new Map(linksOf(old).map((link) => [linkKey(link), link]));
    const newLinks = new Map(linksOf(node).map((link) => [linkKey(link), link]));
    const links = { set: [] as Record<string, any>[], removed: [] as string[] };
    for (const [key, link] of newLinks) if (!same(oldLinks.get(key), link)) links.set.push(link);
    for (const key of oldLinks.keys()) if (!newLinks.has(key)) links.removed.push(key);
    if (emptyFields(fields) && links.set.length === 0 && links.removed.length === 0) continue;
    changed.push({ id, ...fields, links });
  }
  for (const id of was.keys()) if (!now.has(id)) removed.push(id);

  if (emptyFields(options) && added.length === 0 && removed.length === 0 && changed.length === 0) return null;
  return { options, added, removed, changed };
}

/**
 * `record` with `delta` carried into it. The record is not modified: the result
 * shares the notes the delta does not touch.
 *
 * - A note added by the delta is added (or replaces the record's copy).
 * - A note removed by the delta is removed, with the lines into it.
 * - A note the delta changed is changed field by field, if the record has it: a
 *   record taken before the note existed stays without it.
 */
export function applyDelta(record: SlateJSON, delta: SlateDelta): SlateJSON {
  const options = { ...(record.options ?? {}) };
  for (const [key, value] of Object.entries(delta.options.set)) options[key] = value;
  for (const key of delta.options.unset) delete options[key];

  const removed = new Set(delta.removed);
  const changes = new Map(delta.changed.map((change) => [change.id, change]));
  const additions = new Map(delta.added.map((node) => [idOf(node)!, node]));

  const nodes: NodeJSON[] = [];
  for (const node of record.nodes ?? []) {
    const id = idOf(node);
    if (id != null && removed.has(id)) continue;
    if (id != null && additions.has(id)) {
      nodes.push(additions.get(id)!);
      additions.delete(id);
      continue;
    }
    const change = id != null ? changes.get(id) : undefined;
    let next = node;
    if (change) {
      const nodeOptions = { ...(node.options ?? {}) };
      for (const [key, value] of Object.entries(change.set)) nodeOptions[key] = value;
      for (const key of change.unset) delete nodeOptions[key];
      let links = linksOf(node);
      if (change.links.set.length || change.links.removed.length) {
        const gone = new Set(change.links.removed);
        const replace = new Map(change.links.set.map((link) => [linkKey(link), link]));
        links = links
          .filter((link) => !gone.has(linkKey(link)))
          .map((link) => {
            const key = linkKey(link);
            const updated = replace.get(key);
            if (!updated) return link;
            replace.delete(key);
            return updated;
          });
        links.push(...replace.values());
      }
      next = { ...node, options: nodeOptions, relationships: { ...(node.relationships ?? {}), associations: links } };
    }
    nodes.push(next);
  }
  nodes.push(...additions.values());

  // Lines must end on notes the record holds: drop those into removed notes, and
  // lines carried in by the delta whose other end this record does not have.
  const present = new Set(nodes.map(idOf));
  const cleaned = nodes.map((node) => {
    const links = linksOf(node);
    const kept = links.filter((link) => link.targetPoint || link.childId == null || present.has(link.childId));
    return kept.length === links.length ? node : { ...node, relationships: { ...node.relationships, associations: kept } };
  });

  return { ...record, options, nodes: cleaned };
}
