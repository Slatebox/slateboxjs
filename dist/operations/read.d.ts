import { type StoredNode } from "./stored";
/** Keys every note read carries besides the writable ones: what a person sees but cannot yet set by plan. */
export declare const NOTE_READ_KEYS: readonly ["id", ...string[], "image", "media", "photo", "styleRole"];
export declare const READ_LIMITS: Readonly<{
    notes: 100;
    maxNotes: 500;
    maxChars: 60000;
}>;
export interface ReadSelection {
    /** Note keys to return (id is always returned). Left out, every key. */
    fields?: string[];
    ids?: string[];
    within?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    groupId?: string;
    /** Whole text of a note, ignoring case and extra spaces; match "contains" to search. */
    q?: string;
    match?: "exact" | "contains";
    /** Notes per page, 1 to 500. */
    limit?: number;
    /** The nextCursor of the page before. */
    cursor?: string;
    /** Size ceiling for one page, in characters of JSON. */
    maxChars?: number;
}
export interface SlateRead {
    name: string;
    description: string;
    background: {
        color: string;
        gradient?: Record<string, any>;
    } | null;
    /** The style the slate wears ({id, overrides?, v}), or null. */
    style: Record<string, any> | null;
    /** The box around every note on the slate, or null when it has none. */
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    /** Notes the selection matches, on every page. */
    nodeCount: number;
    nodes: Array<Record<string, any>>;
    /** The connectors that start at a note on this page. Across pages each appears once. */
    connections: Array<Record<string, any>>;
    /** Pass as cursor for the next page; null on the last. */
    nextCursor: string | null;
}
export declare const isCommentMarker: (node: StoredNode) => boolean;
/** One note, read through the key table. */
export declare function readNote(node: StoredNode, fields?: readonly string[]): Record<string, any>;
/** One connector, read through the connector key table. */
export declare function readConnector(association: Record<string, any>): Record<string, any>;
/** Read a stored or live slate. Throws OperationPlanError invalid_selection (400) for a selection it cannot apply. */
export declare function readSlate(input: any, selection?: ReadSelection): SlateRead;
/** Slate options a document carries. Visibility and the app's own fields stay with the app. */
export declare const DOCUMENT_OPTION_KEYS: readonly ["id", "name", "description", "enabled", "allowDrag", "followMe", "mindMapMode", "autoResizeNodesBasedOnText", "useLayoutQuadrants", "autoEnableDefaultFilters", "showbirdsEye", "sizeOfbirdsEye", "showMultiSelect", "showZoom", "showUndoRedo", "showStatus", "showLocks", "isTemplate", "basedOnTemplate", "allowCollaboration", "defaultLineColor", "style", "layoutType", "disableAutoLayoutOfManuallyPositionedNodes", "nodeOrder", "viewPort", "containerStyle"];
/**
 * The slate as the engine loads it ({options, nodes, shareId}): what the
 * engine's own serializer writes, without visibility flags, access keys,
 * the app's record fields or comment markers.
 */
export declare function toSlateDocument(input: any): {
    options: Record<string, any>;
    nodes: StoredNode[];
    shareId: string;
};
