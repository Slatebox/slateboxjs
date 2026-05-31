/**
 * Serialization.ts - Full serialize/deserialize for SlateboxJS v2
 *
 * Produces and consumes JSON matching the v1 format:
 * {
 *   "options": { SlateOptions },
 *   "nodes": [
 *     {
 *       "options": { NodeOptions with xPos/yPos },
 *       "relationships": {
 *         "associations": [ Association ]
 *       }
 *     }
 *   ],
 *   "shareId": "string"
 * }
 */
import type { NodeOptions } from "./Node";
export interface SlateJSON {
    options: Record<string, any>;
    nodes: NodeJSON[];
    shareId: string;
}
export interface NodeJSON {
    options: Record<string, any>;
    relationships: {
        associations: Record<string, any>[];
    };
}
/**
 * Serialize an entire Slate instance to the v1-compatible JSON format.
 *
 * @param slate - The Slate instance to serialize
 * @param nodes - Optional subset of nodes to include (defaults to all)
 * @param asPresentation - If true, includes presentation ordering metadata
 */
export declare function serialize(slate: any, nodes?: any[], asPresentation?: boolean): SlateJSON;
/**
 * Deserialize JSON into an existing Slate instance.
 * Clears existing nodes and replaces with deserialized content.
 *
 * @param json - The v1-compatible JSON to load
 * @param slate - The Slate instance to load into
 * @param preserve - If true, don't clear existing nodes (merge mode)
 * @param skipZoom - If true, don't adjust zoom/pan after load
 */
export declare function deserialize(json: SlateJSON | string, slate: any, preserve?: boolean, skipZoom?: boolean): Promise<void>;
/** Serialize a single Node to the v1-compatible JSON format */
export declare function serializeNode(node: any): NodeJSON;
/** Convert JSON node options to v2 NodeOptions */
export declare function deserializeNodeOptions(jsonOpts: Record<string, any>): Partial<NodeOptions>;
/**
 * Take a snapshot of the current slate state.
 * Used by undo/redo system.
 */
export declare function snapshot(slate: any): SlateJSON;
