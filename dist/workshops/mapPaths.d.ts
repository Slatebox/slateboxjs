import type { NodeJSON } from '../core/Serialization';
import { type Workshop, type WorkshopEdit } from './model';
import { type LayerShape } from './boardLayer';
import type { BoardLayerState } from './native';
/** A grip on a map in focus: draw a new path from a step, or move the end of a path to another step. */
export type MapGrip = {
    kind: 'link';
    from: string;
} | {
    kind: 'route';
    from: string;
    to: string;
};
/**
 * A grip's size in board units at `zoom` (screen px per board unit): a finger's on screen, on a laptop and on a
 * phone alike. A map fitted to a phone in focus is drawn at about half size, so its grips are drawn larger.
 */
export declare function mapGripSize(zoom: number): number;
/** The grip an artwork name draws, or null for any other part. */
export declare function mapGripOf(name: string): MapGrip | null;
/** One path between two steps, clear of both columns (board coordinates): where its hit area and its end grip go. */
export interface MapPathSegment {
    key: string;
    from: string;
    to: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
/** Every path of the map, in the order the steps list them. */
export declare function mapPathSegments(board: Workshop): MapPathSegment[];
/** The step whose column holds this point (board coordinates), or null. */
export declare function mapStationAt(board: Workshop, point: {
    x: number;
    y: number;
}): string | null;
/**
 * The grips a map in focus shows, as notes at `origin`: one at each step's bottom-right corner to draw a new path
 * from it, and one at the end of each path to move that end to another step. Each is a finger's size.
 */
export declare function mapGripNotes(board: Workshop, origin: {
    x: number;
    y: number;
}, size?: number): NodeJSON[];
/** What a screen reader calls a map's grip. */
export declare function mapGripLabel(board: Workshop, name: string): string | null;
/**
 * A grip let go over step `laneId` (null: over no step): the map it makes, or the sentence that refuses it.
 * A link grip opens a path from its step; a route grip moves its path's end there (one change). Let go
 * where nothing changes, the map is as it was.
 */
export declare function mapPathDrop(board: Workshop, grip: MapGrip, laneId: string | null): {
    next: Workshop | null;
    refusal?: string;
};
/** The path edits between two maps: every path taken away, then every path opened (chat's and exec's edits). */
export declare function mapEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[];
/**
 * A map's layer: under each path a hit area. Outside focus it picks the path (the host offers "Change this
 * board"); in focus it removes it (a click, Enter or Space; on a touch screen a tap selects it and a second tap
 * removes it). The picked path is outlined. A held grip's sentence is said beside it.
 */
export declare function paintMap(board: Workshop, state: BoardLayerState): LayerShape[];
