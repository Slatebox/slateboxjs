/**
 * MediaNote.ts - a note that is a video (options.media).
 *
 * Following the isolated class pattern (constructor takes the node; enable,
 * disable, isEnabled, updateOptions).
 *
 * The note is drawn as its poster (the note's image fill, cropped to the note),
 * a play button, and a caption with the title and the host. That drawing is the
 * only one: the live canvas, a slate's card, a presentation's overview and an
 * export all show the same poster, play button and caption, because they are
 * ordinary SVG inside the note's group.
 *
 * Pressing play (a click or tap on the play button, Enter on the selected note,
 * a double-click, or a click anywhere on the note for a read-only viewer or a
 * presenter) puts the provider's privacy-respecting player over the poster, in
 * a sandboxed iframe. Nothing plays on its own and nothing from the video host
 * loads before play is pressed. Playing is this viewer's own: it is never saved
 * or sent to the room. The close button, Escape, or the next presentation step
 * puts the poster back.
 */
import type { Node } from "./Node";
import { type MediaValue } from "../operations/media";
/** Classes a picture of the slate keeps (overlay) or leaves out (player, close). */
export declare const MEDIA_CLASSES: Readonly<{
    overlay: "media-note-overlay";
    play: "media-note-play";
    player: "media-note-player";
    close: "media-note-close";
}>;
/** The sandbox a player iframe runs in: the player's own scripts, nothing reaching the page. */
export declare const MEDIA_IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox";
export declare const MEDIA_IFRAME_ALLOW = "autoplay; encrypted-media; picture-in-picture; fullscreen";
/** Cut text to roughly fit `width` at `fontSize` (no layout pass: the caption is plain SVG). */
export declare function fitText(text: string, width: number, fontSize: number): string;
export declare class MediaNote {
    private node;
    private enabled;
    private overlay;
    private playButton;
    private player;
    private closeButton;
    constructor(node: Node);
    enable(): void;
    /** Stops any playback; the poster stays drawn. */
    disable(): void;
    isEnabled(): boolean;
    /** Store a new video on the note and draw it. */
    updateOptions(media: MediaValue | null): void;
    get(): MediaValue | null;
    hasMedia(): boolean;
    isPlaying(): boolean;
    /**
     * Whether this note may play here. A host that draws a still picture of a slate
     * (a slate's card, a gallery tile, a draft, a presenter's overview) sets the
     * slate option `mediaPlayback: false`: the note shows its poster, play button
     * and caption, and pressing it does nothing (a press opens what the picture
     * stands for, as on any other note).
     */
    canPlay(): boolean;
    /** Draw (or redraw, after a resize) the poster's play button and caption. */
    render(): void;
    /** Redraw for a new size (Node.setSize calls this). */
    update(): void;
    /** Put the player over the poster and start it. Returns false when there is nothing to play. */
    play(): boolean;
    /** Take the player away and show the poster again. */
    stop(): void;
    toggle(): void;
    destroy(): void;
    /** Where the note's box starts inside its group (the background shape's corner). */
    private origin;
    private sizePlayer;
    private removeOverlay;
    /**
     * A button on the note: a press never starts a drag of the note, and the action
     * runs on pointerup (the drag machinery captures the pointer, so no native click
     * follows), on a synthetic click, and on Enter or Space when it has focus.
     */
    private bindActivate;
}
