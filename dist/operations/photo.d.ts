/**
 * Photo notes: a picture someone took or chose on their phone, drawn as the
 * whole note. This module is the one place a photo value is read: which
 * addresses a photo may live at, its size, and how the note stores it. It has
 * no DOM, so the app server, the live canvas and the agent package read a photo
 * the same way.
 *
 * Nothing here reaches the network. The app server cleans the picture (turns
 * it upright, shrinks it, drops its location data) and stores it in the app's
 * own file store before a plan names it.
 */
export declare const PHOTO_LIMITS: Readonly<{
    urlLength: 2000;
    dimension: 10000;
    altLength: 300;
}>;
/** The longer side of a new photo note; the other side keeps the photo's proportions. */
export declare const PHOTO_NOTE_LONG_SIDE = 320;
/** What a photo note stores (options.photo). The picture itself is options.image. */
export interface PhotoValue {
    /** An https address, or the app's own stored copy (/files/... or /sbimages/...). */
    url: string;
    width: number;
    height: number;
    /** Words that say what the photo shows, for a screen reader. */
    alt?: string;
}
/**
 * A photo value as an operation sends it ({url, width, height, alt?}), read into
 * what a note stores, or a sentence saying why it cannot be.
 */
export declare function readPhotoValue(value: unknown): {
    ok: true;
    photo: PhotoValue;
} | {
    ok: false;
    message: string;
};
/** The size a new photo note is drawn at: 320 on the longer side, the photo's proportions kept (at least 20 on each). */
export declare function photoNoteSize(width: number, height: number): {
    width: number;
    height: number;
};
/** The stored note options a photo sets: the picture fills the note, with no text. */
export declare function storePhoto(options: Record<string, any>, photo: PhotoValue): void;
/** How a photo note reads back to an agent: the picture, its size and its words. */
export declare function readPhoto(options: Record<string, any>): PhotoValue | null;
