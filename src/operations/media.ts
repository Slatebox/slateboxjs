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

export const MEDIA_PROVIDERS = ["youtube", "vimeo", "loom"] as const;
export type MediaProvider = (typeof MEDIA_PROVIDERS)[number];

/** The host each provider is named by, as a person reads it under the poster. */
export const MEDIA_HOST_NAMES: Readonly<Record<MediaProvider, string>> = Object.freeze({
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom",
});

/**
 * The origins the player iframe loads from: the only frames a media note opens.
 * A page that sets a Content-Security-Policy adds these to frame-src.
 */
export const MEDIA_FRAME_ORIGINS: readonly string[] = Object.freeze([
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://www.loom.com",
]);

/** The note a media note is drawn in, 16:9, before anyone resizes it. */
export const MEDIA_NOTE_SIZE = Object.freeze({ width: 320, height: 180 });

export const MEDIA_LIMITS = Object.freeze({ urlLength: 2000, titleLength: 300, authorLength: 120, startSeconds: 86400 });

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

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{1,12}$/;
const VIMEO_HASH = /^[0-9a-f]{6,20}$/i;
const LOOM_ID = /^[0-9a-f]{32}$/i;

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);
const LOOM_HOSTS = new Set(["loom.com", "www.loom.com"]);

/** "90", "90s", "1m30s", "1h2m3s" as whole seconds; undefined for anything else or 0. */
export function parseStart(raw: string | null | undefined): number | undefined {
  if (!raw) return undefined;
  const text = String(raw).trim().toLowerCase();
  let seconds: number;
  if (/^\d+$/.test(text)) seconds = Number(text);
  else {
    const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(text);
    if (!match || !match[0]) return undefined;
    seconds = Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
  }
  return Number.isSafeInteger(seconds) && seconds > 0 && seconds <= MEDIA_LIMITS.startSeconds ? seconds : undefined;
}

function hostOf(url: URL): string {
  return url.hostname.toLowerCase().replace(/\.$/, "");
}

function youtube(url: URL): MediaValue | null {
  const host = hostOf(url);
  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;
  if (host === "youtu.be") id = parts[0];
  else if (parts[0] === "watch") id = url.searchParams.get("v") ?? undefined;
  else if (["shorts", "embed", "live", "v"].includes(parts[0])) id = parts[1];
  if (!id || !YOUTUBE_ID.test(id)) return null;
  const start = parseStart(url.searchParams.get("t") ?? url.searchParams.get("start"));
  return { provider: "youtube", id, url: `https://www.youtube.com/watch?v=${id}`, ...(start ? { start } : {}) };
}

function vimeo(url: URL): MediaValue | null {
  const host = hostOf(url);
  const parts = url.pathname.split("/").filter(Boolean);
  let id: string | undefined;
  let hash: string | undefined;
  if (host === "player.vimeo.com") {
    if (parts[0] !== "video") return null;
    id = parts[1];
    hash = url.searchParams.get("h") ?? undefined;
  } else {
    // vimeo.com/123, vimeo.com/123/abcdef (an unlisted video), vimeo.com/channels/x/123, vimeo.com/groups/x/videos/123
    const at = parts.findIndex((part) => VIMEO_ID.test(part));
    if (at < 0) return null;
    id = parts[at];
    const next = parts[at + 1];
    if (next && VIMEO_HASH.test(next)) hash = next;
  }
  if (!id || !VIMEO_ID.test(id)) return null;
  if (hash !== undefined && !VIMEO_HASH.test(hash)) hash = undefined;
  const start = parseStart((url.hash.match(/t=([0-9hms]+)/i) || [])[1]);
  return {
    provider: "vimeo",
    id,
    url: hash ? `https://vimeo.com/${id}/${hash}` : `https://vimeo.com/${id}`,
    ...(hash ? { hash } : {}),
    ...(start ? { start } : {}),
  };
}

function loom(url: URL): MediaValue | null {
  const parts = url.pathname.split("/").filter(Boolean);
  if (!["share", "embed"].includes(parts[0])) return null;
  // A share address may end in a readable slug: /share/my-demo-<id>.
  const last = parts[1] ? parts[1].split("-").pop() : undefined;
  if (!last || !LOOM_ID.test(last)) return null;
  const id = last.toLowerCase();
  const start = parseStart(url.searchParams.get("t"));
  return { provider: "loom", id, url: `https://www.loom.com/share/${id}`, ...(start ? { start } : {}) };
}

/**
 * The video an address names, or null when it is not a video from an approved
 * host. http is read as https; anything with credentials, a port or another
 * scheme is not a video address.
 */
export function parseMediaUrl(raw: unknown): MediaValue | null {
  if (typeof raw !== "string") return null;
  const text = raw.trim();
  if (!text || text.length > MEDIA_LIMITS.urlLength || /\s/.test(text)) return null;
  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password || url.port) return null;
  const host = hostOf(url);
  if (YOUTUBE_HOSTS.has(host)) return youtube(url);
  if (VIMEO_HOSTS.has(host)) return vimeo(url);
  if (LOOM_HOSTS.has(host)) return loom(url);
  return null;
}

/** True when the address is a video a media note can play. */
export const isMediaUrl = (raw: unknown): boolean => parseMediaUrl(raw) !== null;

/**
 * The player address for a stored video. `play` is true only after a person has
 * pressed play: the player then starts at once, so one press plays. A note never
 * plays on its own.
 */
export function mediaEmbedUrl(media: Pick<MediaValue, "provider" | "id" | "hash" | "start">, { play = false }: { play?: boolean } = {}): string | null {
  const auto = play ? "1" : "0";
  switch (media?.provider) {
    case "youtube": {
      if (!YOUTUBE_ID.test(media.id)) return null;
      const query = new URLSearchParams({ autoplay: auto, rel: "0", playsinline: "1", modestbranding: "1" });
      if (media.start) query.set("start", String(media.start));
      return `https://www.youtube-nocookie.com/embed/${media.id}?${query}`;
    }
    case "vimeo": {
      if (!VIMEO_ID.test(media.id)) return null;
      const query = new URLSearchParams({ autoplay: auto, dnt: "1" });
      if (media.hash && VIMEO_HASH.test(media.hash)) query.set("h", media.hash);
      return `https://player.vimeo.com/video/${media.id}?${query}${media.start ? `#t=${media.start}s` : ""}`;
    }
    case "loom": {
      if (!LOOM_ID.test(media.id)) return null;
      const query = new URLSearchParams({ autoplay: auto, hide_owner: "true", hideEmbedTopBar: "true" });
      if (media.start) query.set("t", String(media.start));
      return `https://www.loom.com/embed/${media.id}?${query}`;
    }
    default:
      return null;
  }
}

// An https address, or a path on the app itself (one leading slash, never "//", which names another host).
const POSTER = /^(?:https:\/\/[^\s"'<>]+|\/(?![\/\\])[^\s"'<>\\]*)$/i;
const cleanText = (value: unknown, max: number): string | undefined => {
  if (typeof value !== "string") return undefined;
  // eslint-disable-next-line no-control-regex
  const text = value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  return text || undefined;
};
const dimension = (value: unknown) => (typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 10000 ? Math.round(value) : undefined);

/**
 * A media value as an operation sends it ({url, title?, author?, poster?, ...}),
 * read into what a note stores, or a sentence saying why it cannot be.
 */
export function readMediaValue(value: unknown): { ok: true; media: MediaValue } | { ok: false; message: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, message: "must be an object with the video's url." };
  const input = value as Record<string, unknown>;
  const allowed = ["url", "provider", "id", "hash", "start", "title", "author", "poster", "posterWidth", "posterHeight"];
  const unknown = Object.keys(input).filter((key) => !allowed.includes(key));
  if (unknown.length) return { ok: false, message: `has fields it does not take: ${unknown.join(", ")}.` };
  const parsed = parseMediaUrl(input.url);
  if (!parsed) return { ok: false, message: `url must be a YouTube, Vimeo or Loom video address.` };
  if (input.provider !== undefined && input.provider !== parsed.provider) return { ok: false, message: "provider does not match the url." };
  if (input.id !== undefined && input.id !== parsed.id) return { ok: false, message: "id does not match the url." };
  if (input.poster !== undefined && (typeof input.poster !== "string" || input.poster.length > MEDIA_LIMITS.urlLength || !POSTER.test(input.poster)))
    return { ok: false, message: "poster must be an https address or a path on this app (/...)." };
  const start = input.start === undefined ? parsed.start : Number.isSafeInteger(input.start) && (input.start as number) > 0 && (input.start as number) <= MEDIA_LIMITS.startSeconds ? (input.start as number) : NaN;
  if (Number.isNaN(start)) return { ok: false, message: `start must be whole seconds from 1 to ${MEDIA_LIMITS.startSeconds}.` };
  const title = cleanText(input.title, MEDIA_LIMITS.titleLength);
  const author = cleanText(input.author, MEDIA_LIMITS.authorLength);
  const posterWidth = dimension(input.posterWidth);
  const posterHeight = dimension(input.posterHeight);
  return {
    ok: true,
    media: {
      ...parsed,
      ...(start ? { start } : {}),
      ...(title ? { title } : {}),
      ...(author ? { author } : {}),
      ...(typeof input.poster === "string" ? { poster: input.poster } : {}),
      ...(posterWidth && posterHeight ? { posterWidth, posterHeight } : {}),
    },
  };
}

/** The stored note options a media value sets: the poster fills the note, cropped to it. */
export function storeMedia(options: Record<string, any>, media: MediaValue): void {
  options.media = { ...media };
  options.text = "";
  options.shape = "rectangle";
  options.vectorPath = "rectangle";
  options.shapeHint = "rectangle";
  options.imageFit = "cover";
  options.backgroundColor = "#111418";
  options.borderColor = "#111418";
  options.showTextTab = false;
  if (media.poster) {
    options.image = media.poster;
    options.imageOrigWidth = media.posterWidth || 480;
    options.imageOrigHeight = media.posterHeight || 360;
  } else {
    delete options.image;
  }
}

/** How a media note reads back to an agent: the video, never the player's internals. */
export function readMedia(options: Record<string, any>): Record<string, any> | null {
  const media = options?.media;
  if (!media || typeof media !== "object" || !MEDIA_PROVIDERS.includes(media.provider)) return null;
  return {
    provider: media.provider,
    url: media.url,
    ...(media.title ? { title: media.title } : {}),
    ...(media.author ? { author: media.author } : {}),
    ...(media.start ? { start: media.start } : {}),
    ...(media.poster ? { poster: media.poster } : {}),
  };
}

/** The words a media note is read by (a screen reader, a search, a summary). */
export function mediaLabel(media: Pick<MediaValue, "provider" | "title"> | null | undefined): string {
  if (!media || !MEDIA_PROVIDERS.includes(media.provider as MediaProvider)) return "Video";
  const host = MEDIA_HOST_NAMES[media.provider as MediaProvider];
  return media.title ? `Video: ${media.title} (${host})` : `${host} video`;
}
