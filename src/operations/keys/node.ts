/**
 * Note keys: what an operation may set on a note, how each value is checked,
 * and where it is stored in the saved JSON so the engine's loader reads it
 * back (Serialization.deserialize -> compat.v1NodeToV2 -> Node).
 */
import { canonical, type Lists, type ValueSpec } from "./values";

export interface NodeKey {
  spec: (lists: Lists) => ValueSpec;
  description: string;
  /** Write the (already valid) value into stored note options. */
  store: (options: Record<string, any>, value: any, lists: Lists) => void;
  /** Read the value back from stored note options. */
  read: (options: Record<string, any>) => any;
}

const plain = (key: string) => ({
  store: (options: Record<string, any>, value: any) => {
    options[key] = value;
  },
  read: (options: Record<string, any>) => options[key],
});

export const BORDER_STYLES = ["solid", "dashed", "dotted", "combo"] as const;
/**
 * The note effects the canvas offers: the engine's filters (core/Filters.ts,
 * kept equal by a test). Listed here so this module loads without the DOM.
 */
export const EFFECTS: readonly string[] = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]);
export const ORDERS = ["front", "back"] as const;
export const TEXT_X_ALIGN = ["left", "middle", "right"] as const;
export const TEXT_Y_ALIGN = ["top", "middle", "bottom"] as const;

export const NODE_KEYS: Record<string, NodeKey> = {
  text: { spec: () => ({ type: "string", maxLength: 10000 }), description: "The note's text.", ...plain("text") },
  shape: {
    spec: (lists) => ({ type: "enum", values: lists.shapes, caseless: true }),
    description: "A shape registered with the engine.",
    store: (options, value, lists) => {
      const name = canonical(lists.shapes, value)!;
      options.shape = name;
      options.vectorPath = name;
      options.shapeHint = name;
    },
    read: (options) => options.shape || options.shapeHint || options.vectorPath || "rectangle",
  },
  x: {
    spec: () => ({ type: "number", min: -1000000, max: 1000000 }),
    description: "Left edge on the canvas.",
    store: (options, value) => {
      options.xPos = value;
      delete options.x;
    },
    read: (options) => Number(options.xPos ?? options.x ?? 0),
  },
  y: {
    spec: () => ({ type: "number", min: -1000000, max: 1000000 }),
    description: "Top edge on the canvas.",
    store: (options, value) => {
      options.yPos = value;
      delete options.y;
    },
    read: (options) => Number(options.yPos ?? options.y ?? 0),
  },
  width: { spec: () => ({ type: "number", min: 20, max: 5000 }), description: "Width in canvas units.", ...plain("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5000 }), description: "Height in canvas units.", ...plain("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (options, value) => {
      options.rotate = { ...(options.rotate || {}), rotationAngle: value };
      delete options.rotationAngle;
    },
    read: (options) => Number(options.rotate?.rotationAngle ?? 0),
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ...plain("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (options, value) => {
      // The loader prefers fontColor when both are stored; keep them equal.
      options.foregroundColor = value;
      options.fontColor = value;
    },
    read: (options) => options.fontColor ?? options.foregroundColor,
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ...plain("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ...plain("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ...plain("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: BORDER_STYLES }),
    description: "Border line style.",
    ...plain("borderStyle"),
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...plain("opacity") },
  fontFamily: {
    spec: (lists) => ({ type: "enum", values: lists.fonts, caseless: true }),
    description: "A font this instance offers.",
    store: (options, value, lists) => {
      options.fontFamily = canonical(lists.fonts, value);
    },
    read: (options) => options.fontFamily,
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...plain("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: TEXT_X_ALIGN }), description: "Horizontal text alignment.", ...plain("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: TEXT_Y_ALIGN }), description: "Vertical text alignment.", ...plain("textYAlign") },
  animation: {
    spec: (lists) => ({ type: "enum", values: lists.animations, nullable: true }),
    description: "An entrance or looping animation, or null for none.",
    store: (options, value) => {
      options.animations = { ...(options.animations || {}), vect: value ?? null };
    },
    read: (options) => options.animations?.vect ?? null,
  },
  textOpacity: {
    spec: () => ({ type: "number", min: 0, max: 1 }),
    description: "Text opacity from 0 to 1.",
    ...plain("textOpacity"),
  },
  link: {
    spec: () => ({ type: "url", nullable: true }),
    description: "A web address the note opens (http or https), or null to remove it.",
    store: (options, value) => {
      // The shape the link dialog stores (Links.set): {show, type: "url", data}.
      if (value === null) delete options.link;
      else options.link = { show: true, type: "url", data: `${value}`.trim() };
    },
    read: (options) => (options.link?.show && options.link.type === "url" ? options.link.data : null),
  },
  effect: {
    spec: (lists) => ({ type: "enum", values: lists.effects, nullable: true }),
    description: "A note effect such as dropShadow or postItNote, or null for none.",
    store: (options, value) => {
      options.filters = { ...(options.filters || {}), vect: value ?? null };
    },
    read: (options) => options.filters?.vect ?? null,
  },
  groupId: {
    spec: () => ({ type: "id", nullable: true }),
    description: "Notes sharing a groupId select and move as one group; null takes the note out of its group.",
    store: (options, value) => {
      if (value === null) delete options.groupId;
      else options.groupId = value;
    },
    read: (options) => options.groupId ?? null,
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (options, value) => {
      options.isLocked = value;
    },
    read: (options) => options.isLocked === true,
  },
};

/**
 * A change that is not stored on the note: order moves the note to the front
 * (the end of the slate's note list, drawn last) or the back (the start). The
 * engine saves and loads notes in that order, so the list is the z-order.
 */
export const NODE_INTENT_KEYS: Record<string, { spec: ValueSpec; description: string }> = {
  order: {
    spec: { type: "enum", values: ORDERS },
    description: "Bring the note to the front or send it to the back.",
  },
};

/** Every key update_nodes accepts in changes. */
export const NODE_CHANGE_KEYS = [...Object.keys(NODE_KEYS), ...Object.keys(NODE_INTENT_KEYS)];

/** Keys set on add_nodes at the top level of the operation, not in style. */
export const ADD_LEVEL_KEYS = new Set(["text", "shape", "x", "y", "width", "height"]);
export const NODE_STYLE_KEYS = Object.keys(NODE_KEYS).filter((key) => !ADD_LEVEL_KEYS.has(key));
