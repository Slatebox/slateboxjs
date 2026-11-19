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

export const SLATE_KEYS: Record<string, { spec: ValueSpec; description: string }> = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name." },
  description: { spec: { type: "string", maxLength: 5000 }, description: "The slate's description." },
  background: { spec: { type: "object" }, description: "Canvas background: {color, gradient?: {type, colors, direction?}}." },
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
