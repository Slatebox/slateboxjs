/**
 * Theme.ts - Theme system for applying visual styles to slates
 *
 * A theme contains a parent style and up to N child styles.
 * When applied, nodes cycle through child styles based on their index.
 */

export interface ThemeStyle {
  image?: string;
  backgroundColor?: string;
  nodeColor?: string;
  opacity?: number;
  borderOpacity?: number;
  borderColor?: string;
  borderStyle?:
    | "solid"
    | "dashed"
    | "dotted"
    | "-"
    | "."
    | "--."
    | "combo";
  borderWidth?: number;
  fontColor?: string;
  foregroundColor?: string;
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  textOpacity?: number;
  lineColor?: string;
  lineOpacity?: number;
  lineEffect?: string;
  lineWidth?: number;
  filters?: {
    vect?: string | null;
    text?: string | null;
    line?: string | null;
  };
  vectorPath?: string;
  shape?: string;
}

export interface ThemeDefinition {
  _id?: string;
  name?: string;
  description?: string;
  containerStyle?: {
    backgroundColor?: string;
  };
  defaultLineColor?: string;
  styles?: {
    parent?: ThemeStyle;
    [key: string]: ThemeStyle | undefined; // child_1, child_2, etc.
  };
}

/**
 * Apply a theme to a slate. Updates node styles based on theme definitions.
 *
 * @param slate - The Slate instance
 * @param theme - Theme definition
 * @param syncWithTheme - If true, persist theme sync setting
 * @param revertTheme - If true, revert to pre-theme styles (not implemented yet)
 */
export function applyTheme(
  slate: any,
  theme: ThemeDefinition,
  syncWithTheme: boolean = false,
  revertTheme: boolean = false
): void {
  if (!theme) return;

  // Update slate options
  if (theme._id) {
    slate.options.themeId = theme._id;
  }
  if (syncWithTheme) {
    slate.options.syncWithTheme = true;
  }

  // Apply container style
  if (theme.containerStyle?.backgroundColor) {
    slate.options.containerStyle = slate.options.containerStyle || {};
    slate.options.containerStyle.backgroundColor =
      theme.containerStyle.backgroundColor;
    // Paint it onto the container (setting the option alone is a no-op).
    slate.applyContainerStyle?.();
  }

  // Apply default line color (for future connections) AND re-color EXISTING
  // connections — a theme restyles the WHOLE slate (it recolors nodes below), so
  // existing lines shouldn't stay their old color while everything else changes.
  if (theme.defaultLineColor) {
    slate.options.defaultLineColor = theme.defaultLineColor;
    slate.nodes?.allNodes?.forEach((node: any) => {
      node.relationships?.updateAssociationsWith?.({
        lineColor: theme.defaultLineColor,
      });
    });
  }

  // Apply styles to nodes. In mindMapMode over a connected tree, color by
  // HIERARCHY — root(s) get the parent style, each level down cycles child_1,
  // child_2, … — so the theme follows the mind-map's structure (v1/Miro parity).
  // For a flat slate (no associations) fall back to insertion-order cycling so
  // every node still gets a distinct style (and existing behavior is unchanged).
  const nodes = slate.nodes.allNodes;
  if (!nodes || nodes.length === 0 || !theme.styles) return;

  const depthByNodeId = computeHierarchyDepths(slate, nodes);

  nodes.forEach((node: any, index: number) => {
    const childNumber = depthByNodeId
      ? depthByNodeId.get(node.options.id) ?? 0
      : index;
    const style = buildNodeStyleFromTheme(theme, childNumber);
    if (style) {
      applyStyleToNode(node, style);
    }
  });

  console.log("THEME_DEBUG: Applied theme", theme.name || theme._id);
}

/**
 * Depth of each node in the association tree, for mindMapMode theme coloring.
 * Returns null (→ caller uses insertion-order index) when mindMapMode is off or
 * the slate has no associations at all (a flat slate), so unconnected nodes keep
 * distinct cycling styles and non-mind-map slates are unaffected.
 */
function computeHierarchyDepths(
  slate: any,
  nodes: any[]
): Map<string, number> | null {
  if (!slate?.options?.mindMapMode) return null;

  const childIds = new Set<string>();
  const childrenOf = new Map<string, string[]>();
  let hasEdges = false;
  for (const n of nodes) {
    const assocMap = n.relationships?.assocMap;
    const kids: string[] = assocMap
      ? Array.from(assocMap.values())
          .map((a: any) => a.childId || a.child?.id)
          .filter(Boolean)
      : [];
    if (kids.length) hasEdges = true;
    childrenOf.set(n.options.id, kids);
    kids.forEach((k) => childIds.add(k));
  }
  if (!hasEdges) return null;

  // Roots = nodes that are nobody's child. BFS assigns depth (root = 0 = parent).
  const depth = new Map<string, number>();
  const queue: Array<[string, number]> = [];
  for (const n of nodes) {
    if (!childIds.has(n.options.id)) queue.push([n.options.id, 0]);
  }
  while (queue.length) {
    const [id, d] = queue.shift()!;
    if (depth.has(id)) continue;
    depth.set(id, d);
    for (const k of childrenOf.get(id) || []) queue.push([k, d + 1]);
  }
  // Cycle/orphan safety: anything unreached gets parent style.
  for (const n of nodes) {
    if (!depth.has(n.options.id)) depth.set(n.options.id, 0);
  }
  return depth;
}

/**
 * Build node style from theme based on child number.
 * The first node uses parent style, subsequent nodes cycle through child_1, child_2, etc.
 */
export function buildNodeStyleFromTheme(
  theme: ThemeDefinition,
  childNumber: number
): ThemeStyle | null {
  if (!theme.styles) return null;

  // First node gets parent style
  if (childNumber === 0 && theme.styles.parent) {
    return theme.styles.parent;
  }

  // Subsequent nodes cycle through child styles
  const childKeys = Object.keys(theme.styles).filter((k) =>
    k.startsWith("child_")
  );

  if (childKeys.length === 0) {
    return theme.styles.parent || null;
  }

  const childIndex = (childNumber - 1) % childKeys.length;
  const key = `child_${childIndex + 1}`;
  return theme.styles[key] || theme.styles.parent || null;
}

function applyStyleToNode(node: any, style: ThemeStyle): void {
  // The app's saved theme styles use v1 field names (nodeColor for fill,
  // foregroundColor for text). Accept both so DB themes apply correctly.
  const s = style as any;
  const backgroundColor = style.backgroundColor ?? s.nodeColor;
  const fontColor = style.fontColor ?? s.foregroundColor;

  // A saved app theme is a complete visual style, not just a color palette.
  // Copy every explicitly-present scalar before repainting so createBackground,
  // setShape, and the apply* helpers all read one coherent option set.
  const optionKeys = [
    "opacity",
    "borderOpacity",
    "borderColor",
    "borderStyle",
    "borderWidth",
    "fontFamily",
    "fontSize",
    "fontStyle",
    "textOpacity",
    "lineColor",
    "lineOpacity",
    "lineEffect",
    "lineWidth",
  ] as const;
  for (const key of optionKeys) {
    if (Object.prototype.hasOwnProperty.call(style, key)) {
      node.options[key] = (style as any)[key];
    }
  }

  if (backgroundColor) {
    node.options.backgroundColor = backgroundColor;
  }
  if (fontColor) {
    node.options.fontColor = fontColor;
  }

  const changesShape = !!(style.vectorPath || style.shape);
  if (changesShape) {
    // Filters and image patterns point at the old shape element. Tear them down
    // before replacing it, then restore the theme's own image/effects below.
    node.filters?.removeAll?.();
    node.images?.clear?.();
    const shape = style.shape || style.vectorPath!;
    node.setShape?.(shape, style.vectorPath);
  }

  // Apply all paintable node properties to the (possibly new) shape.
  node.setColors?.(backgroundColor, style.borderColor);
  node.applyBorder?.();
  node.applyOpacity?.();

  if (
    fontColor ||
    style.fontSize !== undefined ||
    style.fontFamily ||
    style.textOpacity !== undefined ||
    style.fontStyle
  ) {
    node.applyTextStyle?.();
  }

  if (Object.prototype.hasOwnProperty.call(style, "image")) {
    if (style.image) node.images?.set?.(style.image);
    else node.images?.clear?.();
  }

  if (style.filters) {
    node.filters?.removeAll?.();
    node.options.filters = {};
    if (style.filters.vect) node.filters?.apply?.(style.filters.vect, "vect");
    if (style.filters.text) node.filters?.apply?.(style.filters.text, "text");
  }

  // Existing connections inherit the themed parent node's line style. New
  // connections already read these values from node.options.
  const lineStyle: Record<string, any> = {};
  for (const key of [
    "lineColor",
    "lineOpacity",
    "lineEffect",
    "lineWidth",
  ] as const) {
    if (Object.prototype.hasOwnProperty.call(style, key)) {
      lineStyle[key] = style[key];
    }
  }
  if (Object.keys(lineStyle).length) {
    node.relationships?.updateAssociationsWith?.(lineStyle);
  }
}
