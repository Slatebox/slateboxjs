/**
 * Slate keys: name, description and background. The background is one shape
 * for every applier: {color, gradient?}. It is stored in the containerStyle
 * fields Slate.applyContainerStyle paints, and the live applier sends it as
 * the onSlateBackgroundColorChanged package that sets those same fields.
 */
import { checkValue, isObject, schemaFor, type ValueSpec } from "./values";

export const GRADIENT_TYPES = ["linear", "radial"] as const;
export const GRADIENT_DIRECTIONS = ["horizontal", "vertical", "diagonal"] as const;

export interface Background {
  color: string;
  gradient?: { type: (typeof GRADIENT_TYPES)[number]; colors: string[]; direction?: (typeof GRADIENT_DIRECTIONS)[number] };
}

export interface SlateKey {
  spec: ValueSpec;
  description: string;
  /** Write the (already valid) value into the stored slate. */
  store: (slate: { options: Record<string, any>; nodes: Array<{ options: Record<string, any>; relationships: { associations: Record<string, any>[] } }> }, value: any) => void;
}

const option = (key: string) => ({
  store: (slate: { options: Record<string, any> }, value: any) => {
    slate.options[key] = value;
  },
});

const viewPort = (key: string) => ({
  store: (slate: { options: Record<string, any> }, value: any) => {
    slate.options.viewPort = { ...(slate.options.viewPort || {}), [key]: value };
  },
});

/**
 * Slate keys, in the order a change is applied and sent. The settings are
 * stored where the canvas reads them (Slate.options, options.viewPort), as the
 * Settings and Colours panels store them.
 */
export const SLATE_KEYS: Record<string, SlateKey> = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...option("name") },
  description: { spec: { type: "string", maxLength: 5000 }, description: "The slate's description.", ...option("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (slate, value: Background) => {
      const style = { ...(slate.options.containerStyle || {}), ...backgroundToContainerStyle(value) };
      delete style.backgroundImage;
      delete style.backgroundEffect;
      slate.options.containerStyle = style;
    },
  },
  style: {
    spec: { type: "object" },
    description:
      "The style the slate wears, as a record: {id, overrides?: {bg?, palette?, fonts?: {display?, body?}}, v?}, or null to take it off. The look itself lives in the slate's background, its notes and its style art (real notes the app writes with the style); sent alone, the app wears the whole style.",
    store: (slate, value) => {
      if (value === null) delete slate.options.style;
      else slate.options.style = value;
    },
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: the slate's style colors notes by their depth in the connected tree.",
    ...option("mindMapMode"),
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...option("autoResizeNodesBasedOnText"),
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...viewPort("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...viewPort("snapToObjects") },
  defaultLineColor: {
    spec: { type: "color" },
    description: "The slate's line colour: every connector and every note's line colour takes it, as the Colours panel does.",
    store: (slate, value) => {
      slate.options.defaultLineColor = value;
      for (const node of slate.nodes) {
        node.options.lineColor = value;
        for (const association of node.relationships.associations) association.lineColor = value;
      }
    },
  },
};

export function checkBackground(value: any, label: string): string[] {
  if (!isObject(value)) return [`${label} must be an object {color, gradient?}.`];
  const errors: string[] = [];
  for (const key of Object.keys(value)) {
    if (key !== "color" && key !== "gradient") errors.push(`${label} has an unknown field: ${key}.`);
  }
  const color = checkValue({ type: "color" }, value.color, `${label}.color`);
  if (color) errors.push(color);
  if (value.gradient !== undefined) {
    const gradient = value.gradient;
    if (!isObject(gradient)) return [...errors, `${label}.gradient must be an object {type, colors, direction?}.`];
    for (const key of Object.keys(gradient)) {
      if (!["type", "colors", "direction"].includes(key)) errors.push(`${label}.gradient has an unknown field: ${key}.`);
    }
    const type = checkValue({ type: "enum", values: GRADIENT_TYPES }, gradient.type, `${label}.gradient.type`);
    if (type) errors.push(type);
    if (gradient.direction !== undefined) {
      const direction = checkValue({ type: "enum", values: GRADIENT_DIRECTIONS }, gradient.direction, `${label}.gradient.direction`);
      if (direction) errors.push(direction);
    }
    if (!Array.isArray(gradient.colors) || gradient.colors.length < 2 || gradient.colors.length > 8) {
      errors.push(`${label}.gradient.colors must list 2 to 8 colours.`);
    } else {
      gradient.colors.forEach((item: unknown, index: number) => {
        const problem = checkValue({ type: "color" }, item, `${label}.gradient.colors[${index}]`);
        if (problem) errors.push(problem);
      });
    }
  }
  return errors;
}

/** Style ids: lowercase words joined by hyphens, as the app's styles are named. */
const STYLE_ID = /^[a-z][a-z-]{0,39}$/;
const STYLE_OVERRIDES = ["bg", "palette", "fonts"];

/**
 * A style record ({id, overrides?, v?}, or null to take the style off). The engine does not know
 * the styles (they are the host's data); it checks the record's shape: an id, colors that are
 * colors, a palette of 1 to 12 colors (a "from-to" pair is a two-stop gradient), fonts the
 * instance offers.
 */
export function checkStyle(value: any, label: string, fonts: readonly string[]): string[] {
  if (value === null) return [];
  if (!isObject(value)) return [`${label} must be an object {id, overrides?, v?} or null.`];
  const errors: string[] = [];
  for (const key of Object.keys(value)) {
    if (!["id", "overrides", "v"].includes(key)) errors.push(`${label} has an unknown field: ${key}.`);
  }
  if (typeof value.id !== "string" || !STYLE_ID.test(value.id)) errors.push(`${label}.id must be a style name (lowercase letters and hyphens, at most 40).`);
  if (value.v !== undefined && (typeof value.v !== "number" || !Number.isInteger(value.v) || value.v < 1 || value.v > 1000)) {
    errors.push(`${label}.v must be a whole number from 1 to 1000.`);
  }
  const overrides = value.overrides;
  if (overrides === undefined) return errors;
  if (!isObject(overrides)) return [...errors, `${label}.overrides must be an object.`];
  for (const key of Object.keys(overrides)) {
    if (!STYLE_OVERRIDES.includes(key)) errors.push(`${label}.overrides has an unknown field: ${key}.`);
  }
  if (overrides.bg !== undefined) {
    const problem = checkValue({ type: "color" }, overrides.bg, `${label}.overrides.bg`);
    if (problem) errors.push(problem);
  }
  if (overrides.palette !== undefined) {
    if (!Array.isArray(overrides.palette) || overrides.palette.length < 1 || overrides.palette.length > 12) {
      errors.push(`${label}.overrides.palette must list 1 to 12 colors.`);
    } else {
      overrides.palette.forEach((item: unknown, index: number) => {
        const parts = typeof item === "string" ? item.split("-") : [item];
        if (parts.length > 2) errors.push(`${label}.overrides.palette[${index}] must be a color or a "from-to" pair.`);
        for (const part of parts) {
          const problem = checkValue({ type: "color" }, part, `${label}.overrides.palette[${index}]`);
          if (problem) {
            errors.push(problem);
            break;
          }
        }
      });
    }
  }
  if (overrides.fonts !== undefined) {
    if (!isObject(overrides.fonts)) errors.push(`${label}.overrides.fonts must be an object {display?, body?}.`);
    else {
      for (const [key, font] of Object.entries(overrides.fonts)) {
        if (key !== "display" && key !== "body") errors.push(`${label}.overrides.fonts has an unknown field: ${key}.`);
        else if (typeof font !== "string" || !fonts.some((name) => name.toLowerCase() === font.toLowerCase())) {
          errors.push(`${label}.overrides.fonts.${key} must be a font this instance offers.`);
        }
      }
    }
  }
  return errors;
}

/** The containerStyle fields a background sets. */
export function backgroundToContainerStyle(background: Background): Record<string, any> {
  return {
    backgroundColor: background.color,
    backgroundColorAsGradient: Boolean(background.gradient),
    backgroundGradientType: background.gradient?.type ?? "linear",
    backgroundGradientColors: background.gradient?.colors ?? [],
    backgroundGradientStrategy: background.gradient?.direction ?? "horizontal",
  };
}

/** The style record's schema (null takes the style off). */
export function styleSchema(): Record<string, any> {
  return {
    type: ["object", "null"],
    additionalProperties: false,
    required: ["id"],
    properties: {
      id: { type: "string", pattern: "^[a-z][a-z-]{0,39}$" },
      v: { type: "integer", minimum: 1, maximum: 1000 },
      overrides: {
        type: "object",
        additionalProperties: false,
        properties: {
          bg: schemaFor({ type: "color" }),
          palette: { type: "array", minItems: 1, maxItems: 12, items: { type: "string", maxLength: 64 } },
          fonts: { type: "object", additionalProperties: false, properties: { display: { type: "string" }, body: { type: "string" } } },
        },
      },
    },
  };
}

export function backgroundSchema(): Record<string, any> {
  return {
    type: "object",
    additionalProperties: false,
    required: ["color"],
    properties: {
      color: schemaFor({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: false,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...GRADIENT_TYPES] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: schemaFor({ type: "color" }) },
          direction: { type: "string", enum: [...GRADIENT_DIRECTIONS] },
        },
      },
    },
  };
}

/** The background a stored containerStyle paints, in the shape update_slate takes; null when none is stored. */
export function backgroundOf(style: Record<string, any> | undefined): Background | null {
  if (!style?.backgroundColor) return null;
  const colors = style.backgroundGradientColors;
  if (!style.backgroundColorAsGradient || !Array.isArray(colors) || colors.length < 2) return { color: style.backgroundColor };
  return {
    color: style.backgroundColor,
    gradient: {
      type: style.backgroundGradientType ?? "linear",
      colors: [...colors],
      direction: style.backgroundGradientStrategy ?? "horizontal",
    },
  };
}
