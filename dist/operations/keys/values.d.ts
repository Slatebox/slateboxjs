/**
 * Value specifications shared by every key table. A key's spec decides how it
 * is checked, how it is described to callers (describeOperations, the JSON
 * Schema) and, through its table, how it is stored.
 */
export type ValueSpec = {
    type: "string";
    minLength?: number;
    maxLength: number;
    nullable?: boolean;
} | {
    type: "number";
    min: number;
    max: number;
} | {
    type: "boolean";
} | {
    type: "enum";
    values: readonly string[];
    nullable?: boolean;
    caseless?: boolean;
}
/**
 * A shape: one of `values` (any case), or a custom shape object
 * {name, d, fillRule?, ref?} checked by slateboxjs/shapes. The JSON Schema
 * publishes both forms (oneOf); the model tool lists the names only.
 */
 | {
    type: "shape";
    values: readonly string[];
}
/** A list of distinct values, each one of `values`; it may be empty. */
 | {
    type: "list";
    values: readonly string[];
} | {
    type: "color";
} | {
    type: "point";
} | {
    type: "object";
}
/** An http or https address, or null to remove it. */
 | {
    type: "url";
    nullable?: boolean;
}
/** A plain id: 1 to 64 letters, digits, _ or -. */
 | {
    type: "id";
    nullable?: boolean;
};
export type Lists = {
    shapes: string[];
    fonts: string[];
    animations: string[];
    effects: string[];
};
export declare function isObject(value: unknown): value is Record<string, any>;
export declare function canonical(values: readonly string[], value: unknown): string | undefined;
/** Returns the error sentence for a value, or null when it is acceptable. */
export declare function checkValue(spec: ValueSpec, value: unknown, label: string): string | null;
/** JSON Schema for a value spec. */
export declare function schemaFor(spec: ValueSpec): Record<string, any>;
/** The object form of a shape value (one path, compound sub-paths allowed). */
export declare function customShapeSchema(): Record<string, any>;
/** A schema with shape values cut to their names, for model tools (no combinators). */
export declare function namesOnlyShape(schema: Record<string, any>): Record<string, any>;
