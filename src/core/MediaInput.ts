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
import { MEDIA_NOTE_SIZE, parseMediaUrl, storeMedia, type MediaValue } from "../operations/media";
import { guid } from "../utils";

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

const URL_TYPES = ["text/uri-list", "text/plain"];

// Every listening canvas on the page, and the one a person last pressed. A paste with
// no field focused (on the page itself) belongs to that canvas, or to the only one
// listening: a page of slate cards, each a canvas, never turns a paste into notes.
const listening = new Set<MediaInput>();
let pressed: MediaInput | null = null;

/** The first video address in pasted or dropped text (a uri-list may hold comments and several lines). */
export function videoAddressIn(text: string | null | undefined): string | null {
  if (!text) return null;
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  // Only an address on its own: a sentence that mentions a video stays text.
  if (lines.length !== 1) return null;
  return parseMediaUrl(lines[0]) ? lines[0] : null;
}

export class MediaInput {
  private slate: any;
  private options: Required<MediaInputOptions>;
  private onPaste: ((e: ClipboardEvent) => void) | null = null;
  private onDragOver: ((e: DragEvent) => void) | null = null;
  private onDrop: ((e: DragEvent) => void) | null = null;
  private onPress: (() => void) | null = null;

  constructor(slate: any, options: MediaInputOptions = {}) {
    this.slate = slate;
    this.options = { enabled: true, ...options };
  }

  public isEnabled(): boolean {
    return this.options.enabled && this.onPaste !== null;
  }

  public updateOptions(options: MediaInputOptions): void {
    this.options = { ...this.options, ...options };
    if (this.options.enabled) this.enable();
    else this.disable();
  }

  /** Listen for pastes on the page and drops on this canvas. */
  public enable(): void {
    this.options.enabled = true;
    if (this.onPaste || typeof document === "undefined") return;
    this.onPaste = (e) => this.handlePaste(e);
    this.onDragOver = (e) => this.handleDragOver(e);
    this.onDrop = (e) => this.handleDrop(e);
    this.onPress = () => {
      pressed = this;
    };
    document.addEventListener("paste", this.onPaste);
    const el: HTMLElement | undefined = this.slate?.element;
    el?.addEventListener("dragover", this.onDragOver);
    el?.addEventListener("drop", this.onDrop);
    el?.addEventListener("pointerdown", this.onPress, true);
    listening.add(this);
  }

  public disable(): void {
    this.options.enabled = false;
    if (this.onPaste) document.removeEventListener("paste", this.onPaste);
    const el: HTMLElement | undefined = this.slate?.element;
    if (this.onDragOver) el?.removeEventListener("dragover", this.onDragOver);
    if (this.onDrop) el?.removeEventListener("drop", this.onDrop);
    if (this.onPress) el?.removeEventListener("pointerdown", this.onPress, true);
    this.onPaste = this.onDragOver = this.onDrop = null;
    this.onPress = null;
    listening.delete(this);
    if (pressed === this) pressed = null;
  }

  public destroy(): void {
    this.disable();
    this.slate = null;
  }

  /**
   * Make a media note for `url` with its centre at `at` (canvas coordinates; the
   * middle of the view when left out). False when the address is not a video a
   * note plays, or this viewer may not add notes.
   */
  public add(url: string, at?: WorldPoint, via: MediaRequest["via"] = "call"): boolean {
    const media = parseMediaUrl(url);
    if (!media || !this.canAdd()) return false;
    const centre = at ?? this.viewCentre();
    const request: MediaRequest = { url, media, x: Math.round(centre.x), y: Math.round(centre.y), via };
    const handler = this.slate.options?.events?.onMediaRequested;
    if (typeof handler === "function") {
      handler(request);
      return true;
    }
    const options: Record<string, any> = {
      id: guid(),
      x: request.x - MEDIA_NOTE_SIZE.width / 2,
      y: request.y - MEDIA_NOTE_SIZE.height / 2,
      width: MEDIA_NOTE_SIZE.width,
      height: MEDIA_NOTE_SIZE.height,
    };
    storeMedia(options, media);
    const node = this.slate.addNode(options);
    try {
      this.slate.selectNodes?.([node], false);
    } catch {
      /* selection is a nicety */
    }
    return true;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private canAdd(): boolean {
    const slate = this.slate;
    return Boolean(slate) && slate.options?.enabled !== false && !slate.isReadOnly?.() && !slate.isCommentOnly?.();
  }

  private viewCentre(): WorldPoint {
    const rect = this.slate.element?.getBoundingClientRect?.();
    if (!rect || !rect.width) return { x: 0, y: 0 };
    try {
      return this.slate.clientToWorld({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    } catch {
      return { x: 0, y: 0 };
    }
  }

  /** A paste belongs to the canvas when focus is on the page itself or inside this canvas, never in a field. */
  private ownsPaste(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null;
    if (!el || !this.slate?.element) return false;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable) return false;
    if (el.closest?.('[role="dialog"], [aria-modal="true"]')) return false;
    if (this.slate.element.contains(el)) return true;
    if (el !== document.body && el !== document.documentElement) return false;
    // On the page itself: the canvas last pressed, or the only one listening.
    return pressed ? pressed === this : listening.size === 1;
  }

  private handlePaste(e: ClipboardEvent): void {
    if (!this.options.enabled || e.defaultPrevented || !this.ownsPaste(e.target)) return;
    // Text being typed into a note is that note's text.
    if (this.slate.nodes?.allNodes?.some((node: any) => node?.editor?.isInlineEditing?.())) return;
    const url = videoAddressIn(e.clipboardData?.getData("text/plain"));
    if (!url) return;
    if (this.add(url, undefined, "paste")) e.preventDefault();
  }

  private dropped(e: DragEvent): string | null {
    const data = e.dataTransfer;
    if (!data) return null;
    for (const type of URL_TYPES) {
      const url = videoAddressIn(data.getData(type));
      if (url) return url;
    }
    return null;
  }

  private handleDragOver(e: DragEvent): void {
    if (!this.options.enabled || !this.canAdd()) return;
    // The address is readable only on drop; a link being dragged is offered as one.
    const types = Array.from(e.dataTransfer?.types ?? []);
    if (types.includes("text/uri-list")) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    }
  }

  private handleDrop(e: DragEvent): void {
    if (!this.options.enabled || e.defaultPrevented) return;
    const url = this.dropped(e);
    if (!url) return;
    let at: WorldPoint | undefined;
    try {
      at = this.slate.clientToWorld({ x: e.clientX, y: e.clientY });
    } catch {
      at = undefined;
    }
    if (this.add(url, at, "drop")) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
