/**
 * MediaInput.ts - a video address pasted or dropped on the canvas becomes a media note.
 *
 * Following the isolated class pattern (constructor takes the slate; enable,
 * disable, isEnabled, updateOptions).
 *
 * The host decides how the note is made: a host that stores posters (the
 * Slatebox app fetches the title and poster on its server and keeps the poster
 * in its own image store) sets `events.onMediaRequested` and makes the note
 * itself. With no handler the note is made here, with no poster: the play button
 * and the host's name on a dark note, so nothing reaches the video host before
 * someone presses play.
 */
import type { WorldPoint } from "./DragPolicy";
import { type MediaValue } from "../operations/media";
export interface MediaRequest {
    /** The address as pasted or dropped. */
    url: string;
    media: MediaValue;
    /** Where the note's centre goes, in canvas coordinates. */
    x: number;
    y: number;
    /** How it arrived. */
    via: "paste" | "drop" | "call";
}
export interface MediaInputOptions {
    enabled?: boolean;
}
/** The first video address in pasted or dropped text (a uri-list may hold comments and several lines). */
export declare function videoAddressIn(text: string | null | undefined): string | null;
export declare class MediaInput {
    private slate;
    private options;
    private onPaste;
    private onDragOver;
    private onDrop;
    private onPress;
    constructor(slate: any, options?: MediaInputOptions);
    isEnabled(): boolean;
    updateOptions(options: MediaInputOptions): void;
    /** Listen for pastes on the page and drops on this canvas. */
    enable(): void;
    disable(): void;
    destroy(): void;
    /**
     * Make a media note for `url` with its centre at `at` (canvas coordinates; the
     * middle of the view when left out). False when the address is not a video a
     * note plays, or this viewer may not add notes.
     */
    add(url: string, at?: WorldPoint, via?: MediaRequest["via"]): boolean;
    private canAdd;
    private viewCentre;
    /** A paste belongs to the canvas when focus is on the page itself or inside this canvas, never in a field. */
    private ownsPaste;
    private handlePaste;
    private dropped;
    private handleDragOver;
    private handleDrop;
}
