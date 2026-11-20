/**
 * The live applier. A plan is decided by the same function the server uses
 * (operations/applyPlanToJSON) on a stored copy of the live slate, so every
 * rule (ids made earlier in a plan, exact text, locked notes, connectors by
 * their two notes, the stored shape of rotation and background) holds here
 * exactly as it does for a saved slate. The carried-out plan is then sent to
 * the canvas and the room as collaboration packages.
 */
import {
  applyPlanToJSON,
  toStoredSlate,
  type ContractOptions,
  type SlateOperation,
  type SlateOperationPlan,
  type SlateOperationReport,
  type StoredNode,
  type StoredSlate,
} from "../operations";
import { backgroundToContainerStyle } from "../operations/keys/slate";
import { NODE_KEYS } from "../operations/keys/node";

function byId(slate: StoredSlate): Map<string, StoredNode> {
  return new Map(slate.nodes.map((node) => [node.options.id, node]));
}

function connectorsById(slate: StoredSlate): Map<string, Record<string, any>> {
  const result = new Map<string, Record<string, any>>();
  slate.nodes.forEach((node) => node.relationships.associations.forEach((association) => result.set(association.id, association)));
  return result;
}

function nodePackages(id: string, changes: Record<string, any>, options: Record<string, any>): any[] {
  const value = (key: string) => NODE_KEYS[key].read(options);
  const has = (...keys: string[]) => keys.some((key) => changes[key] !== undefined);
  const packages: any[] = [];
  if (has("shape")) packages.push({ type: "onNodeShapeChanged", data: { id, shape: value("shape"), vectorPath: options.vectorPath } });
  if (has("backgroundColor", "opacity")) {
    packages.push({ type: "onNodeColorChanged", data: { id, color: options.backgroundColor, opacity: options.opacity, borderColor: options.borderColor } });
  }
  // After the fill: setColors re-picks a readable text colour, and an explicit
  // foregroundColor must win over it.
  if (has("text", "fontFamily", "fontSize", "foregroundColor", "textXAlign", "textYAlign")) {
    packages.push({
      type: "onNodeTextChanged",
      data: {
        id,
        ...(has("text") ? { text: value("text") } : {}),
        ...(has("fontFamily") ? { fontFamily: value("fontFamily") } : {}),
        ...(has("fontSize") ? { fontSize: value("fontSize") } : {}),
        ...(has("foregroundColor") ? { fontColor: value("foregroundColor") } : {}),
        ...(has("textXAlign") ? { textXAlign: value("textXAlign") } : {}),
        ...(has("textYAlign") ? { textYAlign: value("textYAlign") } : {}),
      },
    });
  }
  for (const prop of ["borderColor", "borderWidth", "borderOpacity", "borderStyle"]) {
    if (has(prop)) packages.push({ type: "onNodeBorderPropertiesChanged", data: { id, prop, val: options[prop] } });
  }
  if (has("width", "height")) packages.push({ type: "onNodeResized", data: { id, width: options.width, height: options.height } });
  // NodesManager.moveNodes reads data.nodes (not data.moves).
  if (has("x", "y")) packages.push({ type: "onNodesMove", data: { dur: 350, nodes: [{ id, x: value("x"), y: value("y") }] } });
  if (has("rotationAngle")) packages.push({ type: "onNodeRotated", data: { id, rotationAngle: value("rotationAngle") } });
  if (has("locked")) packages.push({ type: value("locked") ? "onNodeLocked" : "onNodeUnlocked", data: { id } });
  if (has("animation")) {
    packages.push({ type: "onNodeEffectChanged", data: { id, filter: { apply: "vect", id: value("animation"), isAnimation: true } } });
  }
  return packages;
}

/** Collaboration packages that carry a materialized operation from `before` to `after`. */
export function packagesForOperation(operation: SlateOperation, before: StoredSlate, after: StoredSlate): any[] {
  const notesBefore = byId(before);
  const notesAfter = byId(after);
  const connectorsBefore = connectorsById(before);
  const connectorsAfter = connectorsById(after);
  switch (operation.kind) {
    case "add_nodes":
      return (operation.ids || [])
        .filter((id) => !notesBefore.has(id) && notesAfter.has(id))
        .map((id) => ({ type: "onNodeAdded", data: { nodeOptions: { ...notesAfter.get(id)!.options } } }));
    case "update_nodes":
      return (operation.target?.ids || []).flatMap((id) => {
        const node = notesAfter.get(id);
        return node ? nodePackages(id, operation.changes || {}, node.options) : [];
      });
    case "delete_nodes":
      return (operation.target?.ids || []).map((id) => ({ type: "onNodeDeleted", data: { id } }));
    case "connect_nodes":
      return (operation.ids || [])
        .filter((id) => !connectorsBefore.has(id) && connectorsAfter.has(id))
        .map((id) => ({ type: "addRelationship", data: { ...connectorsAfter.get(id)! } }));
    case "disconnect_nodes":
      return (operation.connectionIds || []).flatMap((id) => {
        const association = connectorsBefore.get(id);
        return association ? [{ type: "removeRelationship", data: { id, parentId: association.parentId, childId: association.childId } }] : [];
      });
    case "update_connections":
      return (operation.connectionIds || []).flatMap((id): any[] => {
        const association = connectorsAfter.get(id);
        if (!association) return [];
        if (operation.changes?.toPoint !== undefined) {
          // A free end is redrawn at its new point.
          return [
            { type: "removeRelationship", data: { id, parentId: association.parentId, childId: association.childId } },
            { type: "addRelationship", data: { ...association } },
          ];
        }
        return Object.keys(operation.changes || {}).map((prop) => ({
          type: "onLinePropertiesChanged",
          data: { id: association.parentId, associationId: id, prop, val: association[prop] },
        }));
      });
    case "arrange_nodes": {
      const moves = (operation.target?.ids || []).flatMap((id) => {
        const node = notesAfter.get(id);
        return node ? [{ id, x: NODE_KEYS.x.read(node.options), y: NODE_KEYS.y.read(node.options) }] : [];
      });
      return moves.length ? [{ type: "onNodesMove", data: { dur: 450, nodes: moves } }] : [];
    }
    case "update_slate": {
      const changes = operation.changes || {};
      const packages: any[] = [];
      if (changes.name !== undefined) packages.push({ type: "onSlateNameChanged", data: { name: after.options.name } });
      if (changes.description !== undefined) packages.push({ type: "onSlateDescriptionChanged", data: { description: after.options.description } });
      if (changes.background !== undefined) {
        const style = backgroundToContainerStyle(changes.background);
        packages.push({
          type: "onSlateBackgroundColorChanged",
          data: {
            color: style.backgroundColor,
            asGradient: style.backgroundColorAsGradient,
            gradientType: style.backgroundGradientType,
            gradientColors: style.backgroundGradientColors,
            gradientStrategy: style.backgroundGradientStrategy,
          },
        });
      }
      return packages;
    }
  }
}

export function applySlateOperations(
  slate: any,
  plan: SlateOperationPlan,
  { userMessage = "", replay = false, ...contract }: { userMessage?: string; replay?: boolean } & ContractOptions = {},
): { message: string; report: SlateOperationReport; materializedPlan: SlateOperationPlan } {
  let current = toStoredSlate(slate);
  const result = applyPlanToJSON(current, plan, { userMessage, replay, ...contract });
  // Replay one operation at a time so each one's packages are read from the
  // state it left, then send them in order.
  const packages: any[] = [];
  for (const operation of result.materializedPlan.operations) {
    const next = applyPlanToJSON(current, { message: plan.message, operations: [operation] }, { userMessage, replay: true, ...contract }).slate;
    packages.push(...packagesForOperation(operation, current, next));
    current = next;
  }
  if (packages.length) {
    slate.collab.invoke(packages);
    slate.collab.send(packages);
  }
  return { message: result.materializedPlan.message, report: result.report, materializedPlan: result.materializedPlan };
}
