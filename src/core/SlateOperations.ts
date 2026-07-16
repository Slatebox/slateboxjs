import { guid, whiteOrBlack } from "../utils";

export const SUPPORTED_SLATE_OPERATION_SHAPES = [
  "rectangle",
  "roundedrectangle",
  "ellipse",
  "circle",
  "star",
  "triangle",
  "pentagon",
  "hexagon",
  "octagon",
  "trapezium",
  "parallelogram",
  "rarrow",
  "larrow",
  "diamond",
] as const;

export type SlateOperationShape =
  (typeof SUPPORTED_SLATE_OPERATION_SHAPES)[number];
export type SlateOperationKind =
  | "add_nodes"
  | "update_nodes"
  | "delete_nodes"
  | "connect_nodes"
  | "disconnect_nodes"
  | "update_connections"
  | "arrange_nodes"
  | "update_slate";

export interface SlateNodeSelector {
  ids?: string[];
  text?: string;
}

export interface SlateOperation {
  kind: SlateOperationKind;
  count?: number;
  shape?: SlateOperationShape;
  text?: string;
  ids?: string[];
  connectionIds?: string[];
  width?: number;
  height?: number;
  gap?: number;
  target?: SlateNodeSelector;
  from?: SlateNodeSelector;
  to?: SlateNodeSelector;
  placement?: {
    relativeTo?: string;
    direction?: "left" | "right" | "above" | "below" | "center";
    arrangement?: "row" | "column" | "grid";
    gap?: number;
  };
  layout?: "row" | "column" | "grid" | "circle";
  changes?: Record<string, any>;
  style?: Record<string, any>;
}

export interface SlateOperationPlan {
  message: string;
  operations: SlateOperation[];
}

export interface SlateOperationValidation {
  valid: boolean;
  errors: string[];
}

export interface SlateOperationReport {
  created: string[];
  updated: string[];
  deleted: string[];
  connected: string[];
  disconnected: string[];
  connectionsUpdated: string[];
}

const OPERATION_KINDS: SlateOperationKind[] = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate",
];
const NODE_CHANGE_KEYS = new Set([
  "text",
  "shape",
  "x",
  "y",
  "width",
  "height",
  "rotationAngle",
  "backgroundColor",
  "foregroundColor",
  "borderColor",
  "borderWidth",
  "borderOpacity",
  "borderStyle",
  "opacity",
  "fontFamily",
  "fontSize",
  "textXAlign",
  "textYAlign",
  "animation",
  "locked",
]);
const SLATE_CHANGE_KEYS = new Set(["name", "description", "background"]);
const CONNECTION_CHANGE_KEYS = new Set([
  "label",
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow",
]);
const NODE_STYLE_KEYS = new Set([
  "backgroundColor",
  "foregroundColor",
  "borderColor",
  "borderWidth",
  "borderOpacity",
  "borderStyle",
  "opacity",
  "fontFamily",
  "fontSize",
]);
const STYLE_INTENT =
  /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i;
const DESTRUCTIVE_INTENT =
  /\b(clear|replace|reset|start over|delete all|remove all)\b/i;

function objectValue(value: any): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function selectorHasValue(selector?: SlateNodeSelector): boolean {
  return Boolean(
    selector &&
    ((selector.ids?.some(Boolean) ?? false) || selector.text?.trim()),
  );
}

function unknownKeys(value: any, allowed: Set<string>): string[] {
  if (!objectValue(value)) return [];
  return Object.keys(value).filter((key) => !allowed.has(key));
}

function checkSelectorIds(
  selector: SlateNodeSelector | undefined,
  knownIds: Set<string>,
  prefix: string,
  errors: string[],
): void {
  if (!knownIds.size || !selector?.ids) return;
  if (selector.ids.some((id) => !knownIds.has(id))) {
    errors.push(`${prefix} references nodes that are not in the slate.`);
  }
}

function validateString(
  changes: any,
  key: string,
  prefix: string,
  errors: string[],
  { nullable = false }: { nullable?: boolean } = {},
): void {
  if (changes?.[key] === undefined) return;
  if (nullable && changes[key] === null) return;
  if (typeof changes[key] !== "string") {
    errors.push(`${prefix} ${key} must be a string.`);
  }
}

function validateNumber(
  changes: any,
  key: string,
  prefix: string,
  errors: string[],
  { min = -1000000, max = 1000000 }: { min?: number; max?: number } = {},
): void {
  if (changes?.[key] === undefined) return;
  if (
    !Number.isFinite(changes[key]) ||
    changes[key] < min ||
    changes[key] > max
  ) {
    errors.push(`${prefix} ${key} must be a number from ${min} to ${max}.`);
  }
}

function validateBoolean(
  changes: any,
  key: string,
  prefix: string,
  errors: string[],
): void {
  if (changes?.[key] !== undefined && typeof changes[key] !== "boolean") {
    errors.push(`${prefix} ${key} must be true or false.`);
  }
}

function validateEnum(
  changes: any,
  key: string,
  values: string[],
  prefix: string,
  errors: string[],
): void {
  if (changes?.[key] !== undefined && !values.includes(changes[key])) {
    errors.push(`${prefix} ${key} must be one of: ${values.join(", ")}.`);
  }
}

function validateNodeChangeValues(
  changes: any,
  prefix: string,
  errors: string[],
): void {
  for (const key of [
    "text",
    "backgroundColor",
    "foregroundColor",
    "borderColor",
    "borderStyle",
    "fontFamily",
  ]) {
    validateString(changes, key, prefix, errors);
  }
  validateString(changes, "animation", prefix, errors, { nullable: true });
  for (const key of ["x", "y", "rotationAngle"]) {
    validateNumber(changes, key, prefix, errors);
  }
  for (const key of ["width", "height"]) {
    validateNumber(changes, key, prefix, errors, { min: 20, max: 5000 });
  }
  validateNumber(changes, "borderWidth", prefix, errors, { min: 0, max: 100 });
  validateNumber(changes, "borderOpacity", prefix, errors, { min: 0, max: 1 });
  validateNumber(changes, "opacity", prefix, errors, { min: 0, max: 1 });
  validateNumber(changes, "fontSize", prefix, errors, { min: 1, max: 500 });
  validateEnum(
    changes,
    "textXAlign",
    ["left", "middle", "right"],
    prefix,
    errors,
  );
  validateEnum(
    changes,
    "textYAlign",
    ["top", "middle", "bottom"],
    prefix,
    errors,
  );
  validateBoolean(changes, "locked", prefix, errors);
}

function validateConnectionChangeValues(
  changes: any,
  prefix: string,
  errors: string[],
): void {
  for (const key of ["label", "lineColor"]) {
    validateString(changes, key, prefix, errors);
  }
  validateNumber(changes, "lineWidth", prefix, errors, { min: 0.1, max: 100 });
  validateNumber(changes, "lineOpacity", prefix, errors, { min: 0, max: 1 });
  validateNumber(changes, "lineCurviness", prefix, errors, { min: 0, max: 1 });
  validateEnum(
    changes,
    "lineType",
    ["bezier", "orthogonal", "straight", "linear", "curved"],
    prefix,
    errors,
  );
  validateEnum(
    changes,
    "lineCurveType",
    ["cubic", "quadratic"],
    prefix,
    errors,
  );
  validateBoolean(changes, "showParentArrow", prefix, errors);
  validateBoolean(changes, "showChildArrow", prefix, errors);
}

export function validateSlateOperationPlan(
  plan: SlateOperationPlan,
  {
    userMessage = "",
    existingNodeIds = [],
    existingConnectionIds = [],
  }: {
    userMessage?: string;
    existingNodeIds?: string[];
    existingConnectionIds?: string[];
  } = {},
): SlateOperationValidation {
  const errors: string[] = [];
  if (!objectValue(plan)) {
    return { valid: false, errors: ["The operation plan must be an object."] };
  }
  if (typeof plan.message !== "string" || !plan.message.trim()) {
    errors.push("A natural completion message is required.");
  }
  if (!Array.isArray(plan.operations) || plan.operations.length === 0) {
    errors.push("At least one slate operation is required.");
  } else if (plan.operations.length > 50) {
    errors.push("A plan cannot contain more than 50 operations.");
  }

  const knownIds = new Set(existingNodeIds.filter(Boolean));
  const knownConnectionIds = new Set(existingConnectionIds.filter(Boolean));
  (plan.operations || []).forEach((operation, index) => {
    const prefix = `Operation ${index + 1}`;
    if (!objectValue(operation) || !OPERATION_KINDS.includes(operation.kind)) {
      errors.push(`${prefix} has an unsupported kind.`);
      return;
    }
    if (operation.kind === "add_nodes") {
      if (
        !Number.isInteger(operation.count) ||
        operation.count! < 1 ||
        operation.count! > 20
      ) {
        errors.push(`${prefix} count must be an integer from 1 to 20.`);
      }
      if (!SUPPORTED_SLATE_OPERATION_SHAPES.includes(operation.shape as any)) {
        errors.push(`${prefix} must use a supported shape.`);
      }
      if (
        operation.placement?.relativeTo &&
        knownIds.size &&
        !knownIds.has(operation.placement.relativeTo)
      ) {
        errors.push(`${prefix} references a node that is not in the slate.`);
      }
      const invalidStyle = unknownKeys(operation.style, NODE_STYLE_KEYS);
      if (invalidStyle.length) {
        errors.push(
          `${prefix} contains unsupported node styles: ${invalidStyle.join(", ")}.`,
        );
      }
      validateNodeChangeValues(operation.style, prefix, errors);
      return;
    }
    if (operation.kind === "update_nodes") {
      if (!selectorHasValue(operation.target)) {
        errors.push(`${prefix} requires a node target.`);
      }
      const invalid = unknownKeys(operation.changes, NODE_CHANGE_KEYS);
      if (
        !objectValue(operation.changes) ||
        !Object.keys(operation.changes).length
      ) {
        errors.push(`${prefix} requires at least one node change.`);
      } else if (invalid.length) {
        errors.push(
          `${prefix} contains unsupported changes: ${invalid.join(", ")}.`,
        );
      }
      if (
        operation.changes?.shape &&
        !SUPPORTED_SLATE_OPERATION_SHAPES.includes(
          operation.changes.shape as SlateOperationShape,
        )
      ) {
        errors.push(`${prefix} contains an unsupported shape.`);
      }
      validateNodeChangeValues(operation.changes, prefix, errors);
      checkSelectorIds(operation.target, knownIds, prefix, errors);
      return;
    }
    if (operation.kind === "delete_nodes") {
      if (!selectorHasValue(operation.target)) {
        errors.push(`${prefix} requires a node target.`);
      }
      if (
        !DESTRUCTIVE_INTENT.test(userMessage) &&
        operation.target?.text === "*"
      ) {
        errors.push(
          `${prefix} cannot delete every node without an explicit request.`,
        );
      }
      checkSelectorIds(operation.target, knownIds, prefix, errors);
      return;
    }
    if (["connect_nodes", "disconnect_nodes"].includes(operation.kind)) {
      if (
        !selectorHasValue(operation.from) ||
        !selectorHasValue(operation.to)
      ) {
        errors.push(`${prefix} requires both from and to node selectors.`);
      }
      checkSelectorIds(operation.from, knownIds, prefix, errors);
      checkSelectorIds(operation.to, knownIds, prefix, errors);
      if (operation.kind === "connect_nodes") {
        const invalidStyle = unknownKeys(
          operation.style,
          CONNECTION_CHANGE_KEYS,
        );
        if (invalidStyle.length) {
          errors.push(
            `${prefix} contains unsupported connection styles: ${invalidStyle.join(", ")}.`,
          );
        }
        validateConnectionChangeValues(operation.style, prefix, errors);
      }
      return;
    }
    if (operation.kind === "update_connections") {
      const hasConnectionIds = operation.connectionIds?.some(Boolean) ?? false;
      const hasEndpoints =
        selectorHasValue(operation.from) && selectorHasValue(operation.to);
      if (!hasConnectionIds && !hasEndpoints) {
        errors.push(
          `${prefix} requires connectionIds or both from and to node selectors.`,
        );
      }
      if (
        hasConnectionIds &&
        knownConnectionIds.size &&
        operation.connectionIds!.some((id) => !knownConnectionIds.has(id))
      ) {
        errors.push(
          `${prefix} references connections that are not in the slate.`,
        );
      }
      const invalid = unknownKeys(operation.changes, CONNECTION_CHANGE_KEYS);
      if (
        !objectValue(operation.changes) ||
        !Object.keys(operation.changes).length
      ) {
        errors.push(`${prefix} requires at least one connection change.`);
      } else if (invalid.length) {
        errors.push(
          `${prefix} contains unsupported connection changes: ${invalid.join(", ")}.`,
        );
      }
      validateConnectionChangeValues(operation.changes, prefix, errors);
      checkSelectorIds(operation.from, knownIds, prefix, errors);
      checkSelectorIds(operation.to, knownIds, prefix, errors);
      return;
    }
    if (operation.kind === "arrange_nodes") {
      if (!selectorHasValue(operation.target)) {
        errors.push(`${prefix} requires a node target.`);
      }
      if (
        !operation.layout ||
        !["row", "column", "grid", "circle"].includes(operation.layout)
      ) {
        errors.push(`${prefix} requires a supported layout.`);
      }
      checkSelectorIds(operation.target, knownIds, prefix, errors);
      return;
    }
    if (operation.kind === "update_slate") {
      const invalid = unknownKeys(operation.changes, SLATE_CHANGE_KEYS);
      if (
        !objectValue(operation.changes) ||
        !Object.keys(operation.changes).length
      ) {
        errors.push(`${prefix} requires at least one slate change.`);
      } else if (invalid.length) {
        errors.push(
          `${prefix} contains unsupported slate changes: ${invalid.join(", ")}.`,
        );
      }
      if (operation.changes?.background && !STYLE_INTENT.test(userMessage)) {
        errors.push(
          `${prefix} cannot change the canvas background unless the user explicitly asks for it.`,
        );
      }
    }
  });
  return { valid: errors.length === 0, errors };
}

function option(node: any, key: string, fallback: any = 0): any {
  if (node?.options?.[key] !== undefined) return node.options[key];
  const aliases: Record<string, string> = { x: "xPos", y: "yPos" };
  if (aliases[key] && node?.options?.[aliases[key]] !== undefined) {
    return node.options[aliases[key]];
  }
  return fallback;
}

function cleanText(value: any): string {
  return `${value || ""}`.replace(/\s+/g, " ").trim().toLowerCase();
}

function allNodes(slate: any): any[] {
  return slate?.nodes?.allNodes || [];
}

function allConnections(slate: any): Array<{ source: any; association: any }> {
  const seen = new Set<string>();
  const result: Array<{ source: any; association: any }> = [];
  allNodes(slate).forEach((source) => {
    const associations =
      source?.relationships?.associations ||
      source?.relationships?.getAssociations?.() ||
      [];
    Array.from(associations).forEach((association: any) => {
      const id = association?.id;
      if (!id || seen.has(id)) return;
      seen.add(id);
      result.push({ source, association });
    });
  });
  return result;
}

function selectConnections(
  slate: any,
  operation: SlateOperation,
): Array<{ source: any; association: any }> {
  const connectionIds = new Set(
    (operation.connectionIds || []).filter(Boolean),
  );
  const connections = allConnections(slate);
  if (connectionIds.size) {
    return connections.filter(({ association }) =>
      connectionIds.has(association.id),
    );
  }
  const fromIds = new Set(
    selectNodes(slate, operation.from).map((node) =>
      option(node, "id", node.id),
    ),
  );
  const toIds = new Set(
    selectNodes(slate, operation.to).map((node) => option(node, "id", node.id)),
  );
  return connections.filter(({ source, association }) => {
    const parentId = association.parentId || option(source, "id", source.id);
    return fromIds.has(parentId) && toIds.has(association.childId);
  });
}

function selectNodes(slate: any, selector: SlateNodeSelector = {}): any[] {
  const nodes = allNodes(slate);
  const ids = new Set((selector.ids || []).filter(Boolean));
  if (ids.size)
    return nodes.filter((node) => ids.has(option(node, "id", node.id)));
  const text = cleanText(selector.text);
  const exact = nodes.filter(
    (node) => cleanText(option(node, "text", "")) === text,
  );
  if (exact.length) return exact;
  return text
    ? nodes.filter((node) => cleanText(option(node, "text", "")).includes(text))
    : [];
}

function referenceNode(slate: any, relativeTo?: string): any {
  if (relativeTo) {
    const byId = slate?.nodes?.one?.(relativeTo);
    if (byId) return byId;
    const byText = selectNodes(slate, { text: relativeTo })[0];
    if (byText) return byText;
  }
  return [...allNodes(slate)].sort(
    (a, b) =>
      option(b, "x") +
      option(b, "width") -
      (option(a, "x") + option(a, "width")),
  )[0];
}

type PlacementPoint = { x: number; y: number };
type PlacementRect = PlacementPoint & { width: number; height: number };

function overlapsWithGap(
  first: PlacementRect,
  second: PlacementRect,
  gap: number,
): boolean {
  return (
    first.x < second.x + second.width + gap &&
    first.x + first.width + gap > second.x &&
    first.y < second.y + second.height + gap &&
    first.y + first.height + gap > second.y
  );
}

function avoidNodeCollisions(
  points: PlacementPoint[],
  obstacles: PlacementRect[],
  width: number,
  height: number,
  direction: string,
  gap: number,
): PlacementPoint[] {
  let result = points;
  for (let attempt = 0; attempt <= obstacles.length; attempt += 1) {
    const collisions = obstacles.filter((obstacle) =>
      result.some((point) =>
        overlapsWithGap({ ...point, width, height }, obstacle, gap),
      ),
    );
    if (!collisions.length) return result;

    let dx = 0;
    let dy = 0;
    if (direction === "left") {
      const groupRight = Math.max(...result.map((point) => point.x + width));
      const targetRight = Math.min(
        ...collisions.map((obstacle) => obstacle.x - gap),
      );
      dx = targetRight - groupRight;
    } else if (direction === "above") {
      const groupBottom = Math.max(...result.map((point) => point.y + height));
      const targetBottom = Math.min(
        ...collisions.map((obstacle) => obstacle.y - gap),
      );
      dy = targetBottom - groupBottom;
    } else if (direction === "below" || direction === "center") {
      const groupTop = Math.min(...result.map((point) => point.y));
      const targetTop = Math.max(
        ...collisions.map((obstacle) => obstacle.y + obstacle.height + gap),
      );
      dy = targetTop - groupTop;
    } else {
      const groupLeft = Math.min(...result.map((point) => point.x));
      const targetLeft = Math.max(
        ...collisions.map((obstacle) => obstacle.x + obstacle.width + gap),
      );
      dx = targetLeft - groupLeft;
    }
    result = result.map((point) => ({ x: point.x + dx, y: point.y + dy }));
  }
  return result;
}

function positions(
  slate: any,
  operation: SlateOperation,
  width: number,
  height: number,
): Array<{ x: number; y: number }> {
  const count = operation.count || 1;
  const placement = operation.placement || {};
  const reference = referenceNode(slate, placement.relativeTo);
  const gap = Number.isFinite(placement.gap) ? placement.gap! : 48;
  const direction = placement.direction || "right";
  const arrangement =
    placement.arrangement ||
    (["left", "right"].includes(direction) ? "column" : "row");
  const columns = arrangement === "grid" ? Math.ceil(Math.sqrt(count)) : count;
  const proposed = Array.from({ length: count }, (_, index) => {
    const row =
      arrangement === "column"
        ? index
        : arrangement === "grid"
          ? Math.floor(index / columns)
          : 0;
    const column =
      arrangement === "column"
        ? 0
        : arrangement === "grid"
          ? index % columns
          : index;
    let x = option(reference, "x") + column * (width + gap);
    let y = option(reference, "y") + row * (height + gap);
    if (direction === "right") x += option(reference, "width", 160) + gap;
    if (direction === "left") x -= width + gap;
    if (direction === "below") y += option(reference, "height", 100) + gap;
    if (direction === "above") y -= height + gap;
    return { x, y };
  });
  const obstacles = allNodes(slate).map((node) => ({
    x: Number(option(node, "x")),
    y: Number(option(node, "y")),
    width: Number(option(node, "width", 120)),
    height: Number(option(node, "height", 80)),
  }));
  return avoidNodeCollisions(
    proposed,
    obstacles,
    width,
    height,
    direction,
    gap,
  );
}

function invokeAndSend(slate: any, packages: any | any[]): void {
  const list = (Array.isArray(packages) ? packages : [packages]).filter(
    Boolean,
  );
  if (!list.length) return;
  slate.collab.invoke(list);
  slate.collab.send(list);
}

export function summarizeSlateForOperations(slate: any): Record<string, any> {
  const nodes = allNodes(slate)
    .slice(0, 150)
    .map((node) => ({
      id: option(node, "id", node.id),
      text: `${option(node, "text", "")}`
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 240),
      shape: option(node, "shape", option(node, "vectorPath", "rectangle")),
      x: Number(option(node, "x")),
      y: Number(option(node, "y")),
      width: Number(option(node, "width", 120)),
      height: Number(option(node, "height", 80)),
    }));
  return {
    name: slate?.options?.name || "",
    description: slate?.options?.description || "",
    nodeCount: nodes.length,
    nodes,
    connections: allConnections(slate)
      .slice(0, 250)
      .map(({ source, association }) => ({
        id: association.id,
        from: association.parentId || option(source, "id", source.id),
        to: association.childId,
        label: association.label || "",
        lineColor: association.lineColor,
        lineWidth: association.lineWidth,
        lineOpacity: association.lineOpacity,
        lineType: association.lineType,
        lineCurveType: association.lineCurveType,
        lineCurviness: association.lineCurviness,
        showParentArrow: association.showParentArrow,
        showChildArrow: association.showChildArrow,
      })),
  };
}

export function applySlateOperations(
  slate: any,
  plan: SlateOperationPlan,
  { userMessage = "" }: { userMessage?: string } = {},
): { message: string; report: SlateOperationReport } {
  const validation = validateSlateOperationPlan(plan, {
    userMessage,
    existingNodeIds: allNodes(slate).map((node) => option(node, "id", node.id)),
    existingConnectionIds: allConnections(slate).map(
      ({ association }) => association.id,
    ),
  });
  if (!validation.valid) throw new Error(validation.errors.join(" "));
  const report: SlateOperationReport = {
    created: [],
    updated: [],
    deleted: [],
    connected: [],
    disconnected: [],
    connectionsUpdated: [],
  };

  plan.operations.forEach((operation) => {
    if (operation.kind === "add_nodes") {
      const shape = operation.shape!;
      const width =
        Number(operation.width) || (shape === "triangle" ? 150 : 180);
      const height =
        Number(operation.height) || (shape === "triangle" ? 130 : 110);
      const reference = referenceNode(slate, operation.placement?.relativeTo);
      const backgroundColor =
        operation.style?.backgroundColor ||
        option(reference, "backgroundColor", "#7aa2c8");
      positions(slate, operation, width, height).forEach(({ x, y }, index) => {
        const id = operation.ids?.[index] || guid(12);
        if (slate.nodes.one(id)) return;
        const text = operation.text
          ? operation.count! > 1
            ? operation.text.replace(/\{n\}/g, `${index + 1}`)
            : operation.text
          : "";
        invokeAndSend(slate, {
          type: "onNodeAdded",
          data: {
            nodeOptions: {
              id,
              name: id,
              text,
              shape,
              vectorPath: shape,
              shapeHint: shape,
              defaultShaped: true,
              xPos: x,
              yPos: y,
              width,
              height,
              backgroundColor,
              foregroundColor:
                operation.style?.foregroundColor ||
                whiteOrBlack(backgroundColor),
              borderColor: operation.style?.borderColor || "#333333",
              borderWidth: operation.style?.borderWidth ?? 1,
              borderOpacity: operation.style?.borderOpacity ?? 1,
              borderStyle: operation.style?.borderStyle || "solid",
              opacity: operation.style?.opacity ?? 1,
              fontFamily: operation.style?.fontFamily || "Manrope",
              fontSize: operation.style?.fontSize || 20,
              textXAlign: "middle",
              textYAlign: "middle",
              filters: { vect: null, text: null },
              animations: { vect: null, text: null },
            },
          },
        });
        report.created.push(id);
      });
      return;
    }

    if (operation.kind === "update_nodes") {
      selectNodes(slate, operation.target).forEach((node) => {
        const id = option(node, "id", node.id);
        const changes = operation.changes!;
        const packages: any[] = [];
        if (
          changes.text !== undefined ||
          changes.fontFamily !== undefined ||
          changes.fontSize !== undefined ||
          changes.foregroundColor !== undefined ||
          changes.textXAlign !== undefined ||
          changes.textYAlign !== undefined
        ) {
          packages.push({
            type: "onNodeTextChanged",
            data: {
              id,
              text: changes.text,
              fontFamily: changes.fontFamily,
              fontSize: changes.fontSize,
              fontColor: changes.foregroundColor,
              textXAlign: changes.textXAlign,
              textYAlign: changes.textYAlign,
            },
          });
        }
        if (changes.shape) {
          packages.push({
            type: "onNodeShapeChanged",
            data: { id, shape: changes.shape, vectorPath: changes.shape },
          });
        }
        if (
          changes.backgroundColor !== undefined ||
          changes.opacity !== undefined ||
          changes.borderColor !== undefined
        ) {
          packages.push({
            type: "onNodeColorChanged",
            data: {
              id,
              color: changes.backgroundColor,
              opacity: changes.opacity,
              borderColor: changes.borderColor,
            },
          });
        }
        ["borderColor", "borderWidth", "borderOpacity", "borderStyle"].forEach(
          (prop) => {
            if (changes[prop] !== undefined) {
              packages.push({
                type: "onNodeBorderPropertiesChanged",
                data: { id, prop, val: changes[prop] },
              });
            }
          },
        );
        if (changes.width !== undefined || changes.height !== undefined) {
          packages.push({
            type: "onNodeResized",
            data: {
              id,
              width: changes.width ?? option(node, "width"),
              height: changes.height ?? option(node, "height"),
            },
          });
        }
        if (changes.x !== undefined || changes.y !== undefined) {
          packages.push({
            type: "onNodesMove",
            data: {
              dur: 350,
              moves: [
                {
                  id,
                  x: changes.x ?? option(node, "x"),
                  y: changes.y ?? option(node, "y"),
                },
              ],
            },
          });
        }
        if (changes.rotationAngle !== undefined) {
          packages.push({
            type: "onNodeRotated",
            data: { id, rotationAngle: changes.rotationAngle },
          });
        }
        if (changes.locked !== undefined) {
          packages.push({
            type: changes.locked ? "onNodeLocked" : "onNodeUnlocked",
            data: { id },
          });
        }
        if (changes.animation !== undefined) {
          packages.push({
            type: "onNodeEffectChanged",
            data: {
              id,
              filter: {
                apply: "vect",
                id: changes.animation,
                isAnimation: true,
              },
            },
          });
        }
        invokeAndSend(slate, packages);
        report.updated.push(id);
      });
      return;
    }

    if (operation.kind === "delete_nodes") {
      selectNodes(slate, operation.target).forEach((node) => {
        const id = option(node, "id", node.id);
        invokeAndSend(slate, { type: "onNodeDeleted", data: { id } });
        report.deleted.push(id);
      });
      return;
    }

    if (["connect_nodes", "disconnect_nodes"].includes(operation.kind)) {
      selectNodes(slate, operation.from).forEach((from) => {
        selectNodes(slate, operation.to).forEach((to) => {
          const parentId = option(from, "id", from.id);
          const childId = option(to, "id", to.id);
          if (parentId === childId) return;
          const id = `${parentId}->${childId}`;
          invokeAndSend(slate, {
            type:
              operation.kind === "connect_nodes"
                ? "addRelationship"
                : "removeRelationship",
            data: {
              id,
              parentId,
              childId,
              lineColor: operation.style?.lineColor || "#333333",
              lineWidth: operation.style?.lineWidth || 3,
              lineType: operation.style?.lineType || "bezier",
              ...(operation.style || {}),
            },
          });
          report[
            operation.kind === "connect_nodes" ? "connected" : "disconnected"
          ].push(id);
        });
      });
      return;
    }

    if (operation.kind === "update_connections") {
      selectConnections(slate, operation).forEach(({ source, association }) => {
        const sourceId =
          association.parentId || option(source, "id", source.id);
        const packages = Object.entries(operation.changes || {}).map(
          ([prop, val]) => ({
            type: "onLinePropertiesChanged",
            data: {
              id: sourceId,
              associationId: association.id,
              prop,
              val,
            },
          }),
        );
        invokeAndSend(slate, packages);
        report.connectionsUpdated.push(association.id);
      });
      return;
    }

    if (operation.kind === "arrange_nodes") {
      const nodes = selectNodes(slate, operation.target);
      if (!nodes.length) return;
      const originX = Math.min(...nodes.map((node) => option(node, "x")));
      const originY = Math.min(...nodes.map((node) => option(node, "y")));
      const maxWidth = Math.max(
        ...nodes.map((node) => option(node, "width", 120)),
      );
      const maxHeight = Math.max(
        ...nodes.map((node) => option(node, "height", 80)),
      );
      const gap = operation.gap ?? 48;
      const columns =
        operation.layout === "grid"
          ? Math.ceil(Math.sqrt(nodes.length))
          : nodes.length;
      const moves = nodes.map((node, index) => {
        if (operation.layout === "circle") {
          const radius = Math.max(180, nodes.length * 35);
          const angle = (Math.PI * 2 * index) / nodes.length;
          return {
            id: option(node, "id", node.id),
            x: originX + radius + Math.cos(angle) * radius,
            y: originY + radius + Math.sin(angle) * radius,
          };
        }
        const row =
          operation.layout === "column" ? index : Math.floor(index / columns);
        const column = operation.layout === "row" ? index : index % columns;
        return {
          id: option(node, "id", node.id),
          x: originX + column * (maxWidth + gap),
          y: originY + row * (maxHeight + gap),
        };
      });
      invokeAndSend(slate, { type: "onNodesMove", data: { dur: 450, moves } });
      report.updated.push(...nodes.map((node) => option(node, "id", node.id)));
      return;
    }

    if (operation.kind === "update_slate") {
      const packages: any[] = [];
      if (operation.changes?.name !== undefined) {
        packages.push({
          type: "onSlateNameChanged",
          data: { name: operation.changes.name },
        });
      }
      if (operation.changes?.description !== undefined) {
        packages.push({
          type: "onSlateDescriptionChanged",
          data: { description: operation.changes.description },
        });
      }
      if (operation.changes?.background !== undefined) {
        packages.push({
          type: "onSlateBackgroundColorChanged",
          data: operation.changes.background,
        });
      }
      invokeAndSend(slate, packages);
    }
  });
  return { message: plan.message.trim(), report };
}
