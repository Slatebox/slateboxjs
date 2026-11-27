/**
 * Slate keys: name, description and background. The background is one shape
 * for every applier: {color, gradient? | picture?}. It is stored in the
 * containerStyle fields Slate.applyContainerStyle paints, and the live applier
 * sends it as the onSlateBackgroundColorChanged package that sets those same
 * fields. A slate that wears a style keeps its background in the style's record
 * too (overrides.bg and overrides.background), so the host's "Revert to
 * original" and a style worn again keep or restore it.
 */
import { checkValue, isObject, schemaFor, type ValueSpec } from "./values";

export const GRADIENT_TYPES = ["linear", "radial"] as const;
export const GRADIENT_DIRECTIONS = ["horizontal", "vertical", "diagonal"] as const;
/** How a background picture fills the canvas: cover (fills, cropped), contain (whole, centred), repeat (tiled). */
export const PICTURE_FITS = ["cover", "contain", "repeat"] as const;
/** The most a picture is dimmed (laid under the background colour), so it never disappears. */
export const PICTURE_DIM_MAX = 0.8;

export interface Background {
  color: string;
  gradient?: { type: (typeof GRADIENT_TYPES)[number]; colors: string[]; direction?: (typeof GRADIENT_DIRECTIONS)[number]; angle?: number };
  picture?: { url: string; fit?: (typeof PICTURE_FITS)[number]; dim?: number };
}

/**
 * A picture a background may show: an https address, or a path on this app (a file it stored,
 * /files/... or /sbimages/...). Never http, data:, javascript: or another scheme, never a path
 * that climbs (..) or starts another host (//), and nothing that could end a CSS url().
 */
export const PICTURE_URL = /^(https:\/\/[A-Za-z0-9.-]+(:\d{1,5})?(\/[A-Za-z0-9._~!$&*+,;=:@%\/?#-]*)?|\/(?!\/)[A-Za-z0-9._~%\/-]+)$/;
export const PICTURE_URL_MAX_LENGTH = 2000;
export function isPictureUrl(value: unknown): value is string {
  return typeof value === "string" && value.length <= PICTURE_URL_MAX_LENGTH && PICTURE_URL.test(value) && !/(^|\/)\.\.(\/|$)/.test(value);
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
    description:
      "Canvas background: {color, gradient?: {type, colors, direction?, angle?}} or {color, picture: {url, fit?, dim?}}. A picture is an https address or a file this app stored; dim (0 to 0.8) lays the color over it so notes stay readable.",
    store: (slate, value: Background) => {
      const style = { ...(slate.options.containerStyle || {}), ...backgroundToContainerStyle(value) };
      delete style.backgroundEffect;
      for (const key of Object.keys(style)) if (style[key] === undefined) delete style[key];
      slate.options.containerStyle = style;
      // A slate that wears a style keeps its background in the style's record, as the host's own
      // Background control does: a style worn again keeps it, and its original restores the one before.
      const worn = slate.options.style;
      if (isObject(worn) && typeof worn.id === "string") {
        const overrides: Record<string, any> = { ...(isObject(worn.overrides) ? worn.overrides : {}), bg: value.color };
        const kept = backgroundOverride(value);
        if (kept) overrides.background = kept;
        else delete overrides.background;
        slate.options.style = { ...worn, overrides };
      }
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
    if (key !== "color" && key !== "gradient" && key !== "picture") errors.push(`${label} has an unknown field: ${key}.`);
  }
  const color = checkValue({ type: "color" }, value.color, `${label}.color`);
  if (color) errors.push(color);
  if (value.gradient !== undefined && value.picture !== undefined) errors.push(`${label} is a gradient or a picture, not both.`);
  if (value.picture !== undefined) errors.push(...checkPicture(value.picture, `${label}.picture`));
  if (value.gradient !== undefined) {
    const gradient = value.gradient;
    if (!isObject(gradient)) return [...errors, `${label}.gradient must be an object {type, colors, direction?, angle?}.`];
    for (const key of Object.keys(gradient)) {
      if (!["type", "colors", "direction", "angle"].includes(key)) errors.push(`${label}.gradient has an unknown field: ${key}.`);
    }
    if (gradient.angle !== undefined && (typeof gradient.angle !== "number" || !Number.isInteger(gradient.angle) || gradient.angle < 0 || gradient.angle > 359)) {
      errors.push(`${label}.gradient.angle must be a whole number of degrees from 0 to 359.`);
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

/** A background picture: {url, fit?, dim?}. */
export function checkPicture(picture: any, label: string): string[] {
  if (!isObject(picture)) return [`${label} must be an object {url, fit?, dim?}.`];
  const errors: string[] = [];
  for (const key of Object.keys(picture)) {
    if (!["url", "fit", "dim"].includes(key)) errors.push(`${label} has an unknown field: ${key}.`);
  }
  if (!isPictureUrl(picture.url)) errors.push(`${label}.url must be an https address or a file this app stored (a path such as /files/...).`);
  if (picture.fit !== undefined) {
    const fit = checkValue({ type: "enum", values: PICTURE_FITS }, picture.fit, `${label}.fit`);
    if (fit) errors.push(fit);
  }
  if (picture.dim !== undefined && (typeof picture.dim !== "number" || !Number.isFinite(picture.dim) || picture.dim < 0 || picture.dim > PICTURE_DIM_MAX)) {
    errors.push(`${label}.dim must be a number from 0 to ${PICTURE_DIM_MAX}.`);
  }
  return errors;
}

/** Style ids: lowercase words joined by hyphens, as the app's styles are named. */
const STYLE_ID = /^[a-z][a-z-]{0,39}$/;
const STYLE_OVERRIDES = ["bg", "palette", "fonts", "background"];

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
  if (overrides.background !== undefined) {
    const background = overrides.background;
    const where = `${label}.overrides.background`;
    if (!isObject(background) || Object.keys(background).length !== 1 || !["gradient", "picture"].includes(Object.keys(background)[0])) {
      errors.push(`${where} must be {gradient} or {picture}.`);
    } else {
      // Checked as a background of its own, over the record's color.
      const color = typeof overrides.bg === "string" ? overrides.bg : "#ffffff";
      errors.push(...checkBackground({ color, ...background }, where).filter((problem) => !problem.startsWith(`${where}.color`)));
    }
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

/** A gradient's angle as the nearest of the three older directions (what an older reader draws). */
const directionOfAngle = (angle: number): (typeof GRADIENT_DIRECTIONS)[number] => {
  const a = ((angle % 180) + 180) % 180;
  if (a < 22.5 || a >= 157.5) return "vertical";
  if (a >= 67.5 && a < 112.5) return "horizontal";
  return "diagonal";
};

/**
 * The containerStyle fields a background sets. Every field is written (undefined where the
 * background has none), so a picture replaces a gradient and a color replaces both.
 */
export function backgroundToContainerStyle(background: Background): Record<string, any> {
  const gradient = background.gradient;
  const picture = background.picture;
  const angle = typeof gradient?.angle === "number" ? gradient.angle : undefined;
  return {
    backgroundColor: background.color,
    backgroundColorAsGradient: Boolean(gradient),
    backgroundGradientType: gradient?.type ?? "linear",
    backgroundGradientColors: gradient?.colors ?? [],
    backgroundGradientStrategy: gradient?.direction ?? (angle !== undefined ? directionOfAngle(angle) : "horizontal"),
    backgroundGradientAngle: gradient?.type === "linear" ? angle : undefined,
    backgroundImage: picture?.url,
    backgroundSize: picture ? picture.fit ?? "cover" : undefined,
    backgroundDim: picture && picture.dim ? picture.dim : undefined,
  };
}

/** The part of a background a style's record keeps beside its color (overrides.background); null for a plain color. */
export function backgroundOverride(background: Background): Record<string, any> | null {
  if (background.picture) {
    const { url, fit = "cover", dim = 0 } = background.picture;
    return { picture: { url, fit, dim } };
  }
  if (background.gradient) {
    const { type, colors, angle } = background.gradient;
    return { gradient: { type, colors: [...colors], ...(type === "linear" && typeof angle === "number" ? { angle } : {}) } };
  }
  return null;
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
          background: {
            type: "object",
            description: "The background beside bg: {gradient} or {picture}, as background takes them.",
            additionalProperties: false,
            minProperties: 1,
            maxProperties: 1,
            properties: { gradient: gradientSchema(), picture: pictureSchema() },
          },
        },
      },
    },
  };
}

function gradientSchema(): Record<string, any> {
  return {
    type: "object",
    additionalProperties: false,
    required: ["type", "colors"],
    properties: {
      type: { type: "string", enum: [...GRADIENT_TYPES] },
      colors: { type: "array", minItems: 2, maxItems: 8, items: schemaFor({ type: "color" }) },
      direction: { type: "string", enum: [...GRADIENT_DIRECTIONS] },
      angle: { type: "integer", minimum: 0, maximum: 359, description: "Degrees, as CSS: 0 runs bottom to top, 90 left to right. Linear only." },
    },
  };
}

function pictureSchema(): Record<string, any> {
  return {
    type: "object",
    additionalProperties: false,
    required: ["url"],
    properties: {
      url: { type: "string", maxLength: PICTURE_URL_MAX_LENGTH, pattern: PICTURE_URL.source, description: "An https address, or a file this app stored (/files/...)." },
      fit: { type: "string", enum: [...PICTURE_FITS], description: "cover fills the canvas, contain shows the whole picture, repeat tiles it." },
      dim: { type: "number", minimum: 0, maximum: PICTURE_DIM_MAX, description: "How much of the color is laid over the picture, so notes stay readable." },
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
      gradient: gradientSchema(),
      picture: pictureSchema(),
    },
  };
}

/** The background a stored containerStyle paints, in the shape update_slate takes; null when none is stored. */
export function backgroundOf(style: Record<string, any> | undefined): Background | null {
  if (!style?.backgroundColor) return null;
  const colors = style.backgroundGradientColors;
  if (!style.backgroundColorAsGradient || !Array.isArray(colors) || colors.length < 2) {
    // A gradient wins over a picture when both are stored (as the canvas draws them).
    if (typeof style.backgroundImage === "string" && style.backgroundImage) {
      const fit = (PICTURE_FITS as readonly string[]).includes(style.backgroundSize) ? style.backgroundSize : "cover";
      const dim = typeof style.backgroundDim === "number" && style.backgroundDim > 0 ? Math.min(style.backgroundDim, PICTURE_DIM_MAX) : 0;
      return { color: style.backgroundColor, picture: { url: style.backgroundImage, fit, dim } };
    }
    return { color: style.backgroundColor };
  }
  const type = style.backgroundGradientType ?? "linear";
  const angle = type === "linear" && typeof style.backgroundGradientAngle === "number" ? style.backgroundGradientAngle : undefined;
  return {
    color: style.backgroundColor,
    gradient: {
      type,
      colors: [...colors],
      direction: style.backgroundGradientStrategy ?? "horizontal",
      ...(angle !== undefined ? { angle } : {}),
    },
  };
}
