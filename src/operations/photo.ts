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

export const PHOTO_LIMITS = Object.freeze({ urlLength: 2000, dimension: 10000, altLength: 300 });

/** The longer side of a new photo note; the other side keeps the photo's proportions. */
export const PHOTO_NOTE_LONG_SIDE = 320;

/** What a photo note stores (options.photo). The picture itself is options.image. */
export interface PhotoValue {
  /** An https address, or the app's own stored copy (/files/... or /sbimages/...). */
  url: string;
  width: number;
  height: number;
  /** Words that say what the photo shows, for a screen reader. */
  alt?: string;
}

// An https address (the server checks it is one it stored), or a path in the app's own file store:
// never another path on the app, which every viewer's browser would request with its cookies.
const PHOTO_URL = /^(?:https:\/\/[^\s"'<>]+|\/(?:files|sbimages)\/(?!.*(?:\.\.|%2e%2e))[^\s"'<>\\]+)$/i;

const dimension = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= PHOTO_LIMITS.dimension ? Math.round(value) : undefined;

const cleanText = (value: unknown, max: number): string | undefined => {
  if (typeof value !== "string") return undefined;
  // eslint-disable-next-line no-control-regex
  const text = value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  return text || undefined;
};

/**
 * A photo value as an operation sends it ({url, width, height, alt?}), read into
 * what a note stores, or a sentence saying why it cannot be.
 */
export function readPhotoValue(value: unknown): { ok: true; photo: PhotoValue } | { ok: false; message: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, message: "must be an object with the photo's url, width and height." };
  const input = value as Record<string, unknown>;
  const unknown = Object.keys(input).filter((key) => !["url", "width", "height", "alt"].includes(key));
  if (unknown.length) return { ok: false, message: `has fields it does not take: ${unknown.join(", ")}.` };
  if (typeof input.url !== "string" || input.url.length > PHOTO_LIMITS.urlLength || !PHOTO_URL.test(input.url))
    return { ok: false, message: "url must be an https address or a photo this app stored (/files/... or /sbimages/...)." };
  const width = dimension(input.width);
  const height = dimension(input.height);
  if (!width || !height) return { ok: false, message: `width and height must be numbers from 1 to ${PHOTO_LIMITS.dimension}.` };
  if (input.alt !== undefined && (typeof input.alt !== "string" || input.alt.length > PHOTO_LIMITS.altLength))
    return { ok: false, message: `alt must be text of at most ${PHOTO_LIMITS.altLength} characters.` };
  const alt = cleanText(input.alt, PHOTO_LIMITS.altLength);
  return { ok: true, photo: { url: input.url, width, height, ...(alt ? { alt } : {}) } };
}

/** The size a new photo note is drawn at: 320 on the longer side, the photo's proportions kept (at least 20 on each). */
export function photoNoteSize(width: number, height: number): { width: number; height: number } {
  const w = dimension(width) ?? 1;
  const h = dimension(height) ?? 1;
  const scale = PHOTO_NOTE_LONG_SIDE / Math.max(w, h);
  return { width: Math.max(20, Math.round(w * scale)), height: Math.max(20, Math.round(h * scale)) };
}

/** The stored note options a photo sets: the picture fills the note, with no text. */
export function storePhoto(options: Record<string, any>, photo: PhotoValue): void {
  options.photo = { ...photo };
  options.text = "";
  options.shape = "rectangle";
  options.vectorPath = "rectangle";
  options.shapeHint = "rectangle";
  options.image = photo.url;
  options.imageOrigWidth = photo.width;
  options.imageOrigHeight = photo.height;
  options.imageFit = "cover";
  options.showTextTab = false;
}

/** How a photo note reads back to an agent: the picture, its size and its words. */
export function readPhoto(options: Record<string, any>): PhotoValue | null {
  const photo = options?.photo;
  if (!photo || typeof photo !== "object" || typeof options.image !== "string" || !options.image) return null;
  const width = dimension(photo.width);
  const height = dimension(photo.height);
  if (!width || !height) return null;
  return { url: options.image, width, height, ...(typeof photo.alt === "string" && photo.alt ? { alt: photo.alt } : {}) };
}
