/**
 * Media notes: a video from an approved host, drawn as its poster picture with a
 * play button, that plays in place when someone presses play. This module is the
 * one place a video address is read: which hosts are approved, the video's id,
 * the canonical address, and the privacy-respecting player address. It has no
 * DOM, so the app server, the live canvas and the agent package read an address
 * the same way.
 *
 * Nothing here reaches the network. The app server fetches the title and the
 * poster (oEmbed) and stores the poster in the app's own image store, so a
 * viewer's browser reaches the video host only when they press play.
 */
export declare const MEDIA_PROVIDERS: readonly ["youtube", "vimeo", "loom"];
export type MediaProvider = (typeof MEDIA_PROVIDERS)[number];
/** The host each provider is named by, as a person reads it under the poster. */
export declare const MEDIA_HOST_NAMES: Readonly<Record<MediaProvider, string>>;
/**
 * The origins the player iframe loads from: the only frames a media note opens.
 * A page that sets a Content-Security-Policy adds these to frame-src.
 */
export declare const MEDIA_FRAME_ORIGINS: readonly string[];
/** The note a media note is drawn in, 16:9, before anyone resizes it. */
export declare const MEDIA_NOTE_SIZE: Readonly<{
    width: 320;
    height: 180;
}>;
export declare const MEDIA_LIMITS: Readonly<{
    urlLength: 2000;
    titleLength: 300;
    authorLength: 120;
    startSeconds: 86400;
}>;
/** What a media note stores (options.media). The poster is options.image. */
export interface MediaValue {
    provider: MediaProvider;
    /** The provider's id for the video. */
    id: string;
    /** The canonical watch address (https). */
    url: string;
    /** Vimeo's private-link hash, for an unlisted video. */
    hash?: string;
    /** Where to start, in whole seconds. */
    start?: number;
    title?: string;
    author?: string;
    /**
     * The poster picture in the app's own image store: an https address, or a path
     * on the app itself ("/sbimages/...") for a server with no https file store.
     */
    poster?: string;
    posterWidth?: number;
    posterHeight?: number;
}
/** "90", "90s", "1m30s", "1h2m3s" as whole seconds; undefined for anything else or 0. */
export declare function parseStart(raw: string | null | undefined): number | undefined;
/**
 * The video an address names, or null when it is not a video from an approved
 * host. http is read as https; anything with credentials, a port or another
 * scheme is not a video address.
 */
export declare function parseMediaUrl(raw: unknown): MediaValue | null;
/** True when the address is a video a media note can play. */
export declare const isMediaUrl: (raw: unknown) => boolean;
/**
 * The player address for a stored video. `play` is true only after a person has
 * pressed play: the player then starts at once, so one press plays. A note never
 * plays on its own.
 */
export declare function mediaEmbedUrl(media: Pick<MediaValue, "provider" | "id" | "hash" | "start">, { play }?: {
    play?: boolean;
}): string | null;
/**
 * A media value as an operation sends it ({url, title?, author?, poster?, ...}),
 * read into what a note stores, or a sentence saying why it cannot be.
 */
export declare function readMediaValue(value: unknown): {
    ok: true;
    media: MediaValue;
} | {
    ok: false;
    message: string;
};
/** The stored note options a media value sets: the poster fills the note, cropped to it. */
export declare function storeMedia(options: Record<string, any>, media: MediaValue): void;
/** How a media note reads back to an agent: the video, never the player's internals. */
export declare function readMedia(options: Record<string, any>): Record<string, any> | null;
/** The words a media note is read by (a screen reader, a search, a summary). */
export declare function mediaLabel(media: Pick<MediaValue, "provider" | "title"> | null | undefined): string;
