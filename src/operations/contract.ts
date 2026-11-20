/**
 * The canvas operation contract: the operation kinds, the fields each accepts,
 * the limits, and the lists (shapes, fonts, animations) values are checked
 * against. The key tables live in ./keys, one file per key group.
 */
import { getShapeNames } from "../core/ShapeRegistry";
import { getAvailableAnimations } from "../core/Animations";
import type { Lists } from "./keys/values";
import type { NodeSelector } from "./keys/selector";
import type { Background } from "./keys/slate";

export const SLATE_OPERATION_KINDS = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate",
] as const;

export type SlateOperationKind = (typeof SLATE_OPERATION_KINDS)[number];

/** Fields each kind accepts. Anything else in an operation is refused. */
export const OPERATION_FIELDS: Record<SlateOperationKind, readonly string[]> = {
  add_nodes: ["kind", "count", "shape", "text", "ids", "x", "y", "width", "height", "placement", "style"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"],
};

export const PLACEMENT_DIRECTIONS = ["left", "right", "above", "below", "center"] as const;
export const ARRANGEMENTS = ["row", "column", "grid"] as const;
export const LAYOUTS = ["row", "column", "grid", "circle"] as const;

export interface Limits {
  operationsPerPlan: number;
  notesPerAdd: number;
  notesPerSlate: number;
  /** Pairs of notes one connect_nodes may join (20 notes to 20 notes). */
  connectorsPerOperation: number;
  connectorsPerSlate: number;
}

export const LIMITS: Readonly<Limits> = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1000,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5000,
});

/** A new note id: letters, digits, _ and -, up to 64 characters, not the free-end prefix. */
export const NOTE_ID_PATTERN = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/;
export const CONNECTOR_ID_MAX_LENGTH = 200;

/** The fonts the Slatebox app offers (its picker list plus the default, Manrope). */
export const DEFAULT_FONTS: readonly string[] = Object.freeze([
  "Manrope", "Arial", "Times New Roman", "Georgia", "Courier Prime", "Indie Flower", "Abril Fatface",
  "Bangers", "Caveat", "EB Garamond", "Fredoka One", "Graduate", "Gravitas One", "IBM Plex Mono",
  "IBM Plex Sans", "IBM Plex Serif", "Lemon", "Lora", "Nixie One", "Noto Sans", "Open Sans", "Poppins",
  "PT Sans", "PT Sans Narrow", "PT Serif", "Permanent Marker", "Rammetto One", "Roboto",
  "Roboto Condensed", "Roboto Mono", "Roboto Slab", "Rubik", "Titan One", "Urbanist",
]);

/** What an instance may change about the contract: its own fonts, shapes and limits. */
export interface ContractOptions {
  fonts?: readonly string[];
  shapes?: readonly string[];
  limits?: Partial<Limits>;
}

export function contractLists(options: ContractOptions = {}): Lists {
  return {
    shapes: [...(options.shapes ?? getShapeNames())],
    fonts: [...(options.fonts ?? DEFAULT_FONTS)],
    animations: Object.keys(getAvailableAnimations()),
  };
}

export function contractLimits(options: ContractOptions = {}): Limits {
  return { ...LIMITS, ...(options.limits || {}) };
}

export interface SlateOperation {
  kind: SlateOperationKind;
  count?: number;
  shape?: string;
  text?: string;
  ids?: string[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  gap?: number;
  placement?: {
    relativeTo?: string;
    direction?: (typeof PLACEMENT_DIRECTIONS)[number];
    arrangement?: (typeof ARRANGEMENTS)[number];
    gap?: number;
  };
  style?: Record<string, any>;
  target?: NodeSelector;
  from?: NodeSelector;
  to?: NodeSelector & { point?: { x: number; y: number } };
  connectionIds?: string[];
  layout?: (typeof LAYOUTS)[number];
  changes?: Record<string, any> & { background?: Background };
}

export interface SlateOperationPlan {
  message: string;
  operations: SlateOperation[];
}

export interface SlateOperationValidation {
  valid: boolean;
  errors: string[];
}

export interface OperationReport {
  operation: number;
  kind: SlateOperationKind;
  /** Ids of the notes (or connectors) the operation's selectors matched. */
  matched: string[];
  /** Ids it actually changed, created or removed. */
  changed: string[];
}

export interface SlateOperationReport {
  created: string[];
  updated: string[];
  deleted: string[];
  connected: string[];
  disconnected: string[];
  connectionsUpdated: string[];
  operations: OperationReport[];
  /** Notes left alone because they are locked (a connect skips a locked starting note). */
  skipped: Array<{ operation: number; id: string; reason: "locked" }>;
  warnings: string[];
  /** True when the plan changes nothing on the slate. */
  unchanged: boolean;
}

/** A refusal with the HTTP status and code a server answers with. */
export class OperationPlanError extends Error {
  status: number;
  code: string;
  details?: Record<string, any>;
  constructor(code: string, status: number, message: string, details?: Record<string, any>) {
    super(message);
    this.name = "OperationPlanError";
    this.code = code;
    this.status = status;
    if (details) this.details = details;
  }
}
