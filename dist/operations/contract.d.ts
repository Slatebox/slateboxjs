import type { Lists } from "./keys/values";
import type { NodeSelector } from "./keys/selector";
import type { Background } from "./keys/slate";
export declare const SLATE_OPERATION_KINDS: readonly ["add_nodes", "update_nodes", "delete_nodes", "duplicate_nodes", "connect_nodes", "disconnect_nodes", "update_connections", "arrange_nodes", "update_slate"];
export type SlateOperationKind = (typeof SLATE_OPERATION_KINDS)[number];
/** Fields each kind accepts. Anything else in an operation is refused. */
export declare const OPERATION_FIELDS: Record<SlateOperationKind, readonly string[]>;
export declare const PLACEMENT_DIRECTIONS: readonly ["left", "right", "above", "below", "center"];
export declare const ARRANGEMENTS: readonly ["row", "column", "grid"];
export declare const ALIGN_LAYOUTS: readonly ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"];
export declare const DISTRIBUTE_LAYOUTS: readonly ["distribute-horizontal", "distribute-vertical"];
/**
 * arrange_nodes layouts. align-* and distribute-* are the canvas's Align and
 * Distribute (by each note's rotated outline); tidy moves notes apart until
 * none overlaps another (the canvas's Optimize Layout); tree lays connected
 * notes out in layers under their root.
 */
export declare const LAYOUTS: readonly ["row", "column", "grid", "circle", "align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom", "distribute-horizontal", "distribute-vertical", "tidy", "tree"];
export declare const PRESETS: readonly ["text", "sticky"];
/** The canvas's connected-note gap (Node.createConnectedNode) and Ctrl+D offset (Keyboard). */
export declare const CONNECTED_NOTE_GAP = 75;
export declare const DUPLICATE_OFFSET: Readonly<{
    x: 20;
    y: 20;
}>;
export interface Limits {
    operationsPerPlan: number;
    notesPerAdd: number;
    notesPerSlate: number;
    /** Pairs of notes one connect_nodes may join (20 notes to 20 notes). */
    connectorsPerOperation: number;
    connectorsPerSlate: number;
}
export declare const LIMITS: Readonly<Limits>;
/** A new note id: letters, digits, _ and -, up to 64 characters, not the free-end prefix. */
export declare const NOTE_ID_PATTERN: RegExp;
export declare const CONNECTOR_ID_MAX_LENGTH = 200;
/** The fonts the Slatebox app offers (its picker list plus the default, Manrope). */
export declare const DEFAULT_FONTS: readonly string[];
/** What an instance may change about the contract: its own fonts, shapes and limits. */
export interface ContractOptions {
    fonts?: readonly string[];
    shapes?: readonly string[];
    limits?: Partial<Limits>;
}
export declare function contractLists(options?: ContractOptions): Lists;
export declare function contractLimits(options?: ContractOptions): Limits;
/** A custom shape value: one path (compound sub-paths allowed), checked by slateboxjs/shapes. */
export interface CustomShapeValue {
    name: string;
    d: string;
    fillRule?: "nonzero" | "evenodd";
    ref?: {
        id: string;
        name?: string;
    };
}
export interface SlateOperation {
    kind: SlateOperationKind;
    count?: number;
    shape?: string | CustomShapeValue;
    preset?: (typeof PRESETS)[number];
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
        /** Copy relativeTo's look and join it to each new note, as the canvas's connection handles do. */
        connect?: boolean;
    };
    offset?: {
        x: number;
        y: number;
    };
    style?: Record<string, any>;
    /** add_nodes: a media note, a video from an approved host (operations/media.ts readMediaValue). */
    media?: {
        url: string;
        title?: string;
        author?: string;
        start?: number;
        poster?: string;
        posterWidth?: number;
        posterHeight?: number;
    };
    /** add_nodes: a photo note, a picture the host stored (operations/photo.ts readPhotoValue). */
    photo?: {
        url: string;
        width: number;
        height: number;
        alt?: string;
    };
    target?: NodeSelector;
    from?: NodeSelector;
    to?: NodeSelector & {
        point?: {
            x: number;
            y: number;
        };
    };
    connectionIds?: string[];
    layout?: (typeof LAYOUTS)[number];
    changes?: Record<string, any> & {
        background?: Background;
    };
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
    skipped: Array<{
        operation: number;
        id: string;
        reason: "locked";
    }>;
    warnings: string[];
    /** True when the plan changes nothing on the slate. */
    unchanged: boolean;
}
/** A refusal with the HTTP status and code a server answers with. */
export declare class OperationPlanError extends Error {
    status: number;
    code: string;
    details?: Record<string, any>;
    constructor(code: string, status: number, message: string, details?: Record<string, any>);
}
