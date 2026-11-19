/**
 * Value specifications shared by every key table. A key's spec decides how it
 * is checked, how it is described to callers (describeOperations, the JSON
 * Schema) and, through its table, how it is stored.
 */

export type ValueSpec =
  | { type: "string"; minLength?: number; maxLength: number; nullable?: boolean }
  | { type: "number"; min: number; max: number }
  | { type: "boolean" }
  | { type: "enum"; values: readonly string[]; nullable?: boolean; caseless?: boolean }
  | { type: "color" }
  | { type: "point" }
  | { type: "object" };

export type Lists = {
  shapes: string[];
  fonts: string[];
  animations: string[];
};

export function isObject(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

// #rgb, #rrggbb, #rrggbbaa, rgb()/rgba()/hsl()/hsla(), or a CSS colour word.
const COLOR =
  /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i;

export function canonical(values: readonly string[], value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const wanted = value.trim().toLowerCase();
  return values.find((item) => item.toLowerCase() === wanted);
}

/** Returns the error sentence for a value, or null when it is acceptable. */
export function checkValue(spec: ValueSpec, value: unknown, label: string): string | null {
  switch (spec.type) {
    case "string":
      if (value === null && spec.nullable) return null;
      if (typeof value !== "string") return `${label} must be a string.`;
      if (value.length > spec.maxLength) return `${label} must be at most ${spec.maxLength} characters.`;
      if (spec.minLength && value.trim().length < spec.minLength) return `${label} must not be empty.`;
      return null;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value) || value < spec.min || value > spec.max) {
        return `${label} must be a number from ${spec.min} to ${spec.max}.`;
      }
      return null;
    case "boolean":
      return typeof value === "boolean" ? null : `${label} must be true or false.`;
    case "enum": {
      if (value === null && spec.nullable) return null;
      const found = spec.caseless ? canonical(spec.values, value) : spec.values.find((item) => item === value);
      return found !== undefined ? null : `${label} must be one of: ${spec.values.join(", ")}.`;
    }
    case "color":
      return typeof value === "string" && COLOR.test(value.trim())
        ? null
        : `${label} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return isObject(value) &&
        Object.keys(value).every((key) => key === "x" || key === "y") &&
        [value.x, value.y].every((n) => typeof n === "number" && Number.isFinite(n) && Math.abs(n) <= 1000000)
        ? null
        : `${label} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return isObject(value) ? null : `${label} must be an object.`;
  }
}

/** JSON Schema for a value spec. */
export function schemaFor(spec: ValueSpec): Record<string, any> {
  switch (spec.type) {
    case "string":
      return { type: spec.nullable ? ["string", "null"] : "string", maxLength: spec.maxLength, ...(spec.minLength ? { minLength: spec.minLength } : {}) };
    case "number":
      return { type: "number", minimum: spec.min, maximum: spec.max };
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return spec.nullable
        ? { type: ["string", "null"], enum: [...spec.values, null] }
        : { type: "string", enum: [...spec.values] };
    case "color":
      return { type: "string", maxLength: 64, description: "A CSS colour, such as #336699." };
    case "point":
      return {
        type: "object",
        additionalProperties: false,
        required: ["x", "y"],
        properties: { x: { type: "number" }, y: { type: "number" } },
      };
    case "object":
      return { type: "object" };
  }
}
