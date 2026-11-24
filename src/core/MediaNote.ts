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
import { mediaEmbedUrl, mediaLabel, MEDIA_HOST_NAMES, type MediaValue } from "../operations/media";

const SVG_NS = "http://www.w3.org/2000/svg";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

/** Classes a picture of the slate keeps (overlay) or leaves out (player, close). */
export const MEDIA_CLASSES = Object.freeze({
  overlay: "media-note-overlay",
  play: "media-note-play",
  player: "media-note-player",
  close: "media-note-close",
});

/** The sandbox a player iframe runs in: the player's own scripts, nothing reaching the page. */
export const MEDIA_IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox";
export const MEDIA_IFRAME_ALLOW = "autoplay; encrypted-media; picture-in-picture; fullscreen";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Cut text to roughly fit `width` at `fontSize` (no layout pass: the caption is plain SVG). */
export function fitText(text: string, width: number, fontSize: number): string {
  const max = Math.max(1, Math.floor(width / (fontSize * 0.56)));
  return text.length <= max ? text : `${text.slice(0, Math.max(1, max - 1)).trimEnd()}…`;
}

export class MediaNote {
  private node: Node;
  private enabled = true;
  private overlay: SVGGElement | null = null;
  private playButton: SVGGElement | null = null;
  private player: SVGForeignObjectElement | null = null;
  private closeButton: SVGGElement | null = null;

  constructor(node: Node) {
    this.node = node;
  }

  // ─── Isolated class contract ─────────────────────────────────────

  public enable(): void {
    this.enabled = true;
  }

  /** Stops any playback; the poster stays drawn. */
  public disable(): void {
    this.stop();
    this.enabled = false;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /** Store a new video on the note and draw it. */
  public updateOptions(media: MediaValue | null): void {
    if (media) this.node.options.media = { ...media };
    else delete this.node.options.media;
    this.render();
  }

  // ─── Reading ─────────────────────────────────────────────────────

  public get(): MediaValue | null {
    const media = this.node?.options?.media;
    return media && typeof media === "object" && media.provider && media.id ? (media as MediaValue) : null;
  }

  public hasMedia(): boolean {
    return this.get() !== null;
  }

  public isPlaying(): boolean {
    return this.player !== null;
  }

  /**
   * Whether this note may play here. A host that draws a still picture of a slate
   * (a slate's card, a gallery tile, a draft, a presenter's overview) sets the
   * slate option `mediaPlayback: false`: the note shows its poster, play button
   * and caption, and pressing it does nothing (a press opens what the picture
   * stands for, as on any other note).
   */
  public canPlay(): boolean {
    return this.enabled && this.node?.slate?.options?.mediaPlayback !== false;
  }

  // ─── Drawing ─────────────────────────────────────────────────────

  /** Draw (or redraw, after a resize) the poster's play button and caption. */
  public render(): void {
    this.removeOverlay();
    const media = this.get();
    const group = this.node?.svgGroup?.node as SVGGElement | undefined;
    if (!media || !group) {
      if (this.player) this.stop();
      return;
    }
    const w = Number(this.node.options.width) || 0;
    const h = Number(this.node.options.height) || 0;
    if (w <= 0 || h <= 0) return;
    const { x: ox, y: oy } = this.origin();

    const overlay = document.createElementNS(SVG_NS, "g");
    overlay.setAttribute("class", MEDIA_CLASSES.overlay);
    overlay.setAttribute("data-media-provider", media.provider);

    // Caption: the title, and the host (with the author) under it, on a dark band.
    const titleSize = clamp(h * 0.075, 9, 18);
    const hostSize = Math.round(titleSize * 0.8 * 10) / 10;
    const pad = clamp(w * 0.03, 6, 14);
    const band = Math.round(titleSize * 1.35 + hostSize * 1.35 + pad);
    const showCaption = h >= 70 && w >= 90;
    if (showCaption) {
      const scrim = document.createElementNS(SVG_NS, "rect");
      scrim.setAttribute("x", String(ox));
      scrim.setAttribute("y", String(oy + h - band));
      scrim.setAttribute("width", String(w));
      scrim.setAttribute("height", String(band));
      scrim.setAttribute("fill", "#000000");
      scrim.setAttribute("fill-opacity", "0.58");
      scrim.setAttribute("pointer-events", "none");
      overlay.appendChild(scrim);
      const host = MEDIA_HOST_NAMES[media.provider] || "Video";
      const lines: Array<[string, number, string, string]> = [
        [media.title || `${host} video`, titleSize, "700", "1"],
        [media.author ? `${host} · ${media.author}` : host, hostSize, "500", "0.82"],
      ];
      let baseline = oy + h - band + pad / 2 + titleSize;
      for (const [words, size, weight, opacity] of lines) {
        const text = document.createElementNS(SVG_NS, "text");
        text.setAttribute("x", String(ox + pad));
        text.setAttribute("y", String(Math.round(baseline * 10) / 10));
        text.setAttribute("font-family", "Manrope, Arial, sans-serif");
        text.setAttribute("font-size", String(size));
        text.setAttribute("font-weight", weight);
        text.setAttribute("fill", "#ffffff");
        text.setAttribute("fill-opacity", opacity);
        text.setAttribute("pointer-events", "none");
        text.textContent = fitText(words, w - pad * 2, size);
        overlay.appendChild(text);
        baseline += size * 1.35;
      }
    }

    // The play button, centred over the picture above the caption.
    const r = clamp(Math.min(w, h) * 0.16, 12, 36);
    const cx = ox + w / 2;
    const cy = oy + (showCaption ? (h - band) / 2 : h / 2);
    const playable = this.canPlay();
    const play = document.createElementNS(SVG_NS, "g");
    play.setAttribute("class", MEDIA_CLASSES.play);
    if (playable) {
      play.setAttribute("role", "button");
      play.setAttribute("tabindex", "0");
      play.setAttribute("aria-label", `Play ${mediaLabel(media)}`);
      play.setAttribute("style", "cursor:pointer");
    } else {
      // A still picture: the button is part of the look, not something to press.
      play.setAttribute("aria-hidden", "true");
      play.setAttribute("pointer-events", "none");
    }
    const ring = document.createElementNS(SVG_NS, "circle");
    ring.setAttribute("cx", String(cx));
    ring.setAttribute("cy", String(cy));
    ring.setAttribute("r", String(r));
    ring.setAttribute("fill", "#000000");
    ring.setAttribute("fill-opacity", "0.62");
    ring.setAttribute("stroke", "#ffffff");
    ring.setAttribute("stroke-width", String(clamp(r * 0.09, 1.5, 3)));
    play.appendChild(ring);
    const tri = document.createElementNS(SVG_NS, "path");
    const t = r * 0.42;
    // A triangle pointing right, nudged so it looks centred in the ring.
    tri.setAttribute("d", `M ${cx - t * 0.7} ${cy - t} L ${cx + t} ${cy} L ${cx - t * 0.7} ${cy + t} Z`);
    tri.setAttribute("fill", "#ffffff");
    tri.setAttribute("pointer-events", "none");
    play.appendChild(tri);
    overlay.appendChild(play);
    if (playable) this.bindActivate(play, () => this.play());

    group.appendChild(overlay);
    this.overlay = overlay;
    this.playButton = play;
    group.setAttribute("aria-label", mediaLabel(media));
    group.setAttribute("data-media-note", media.provider);

    if (this.player) {
      overlay.setAttribute("display", "none");
      this.sizePlayer();
    }
  }

  /** Redraw for a new size (Node.setSize calls this). */
  public update(): void {
    if (this.hasMedia()) this.render();
  }

  // ─── Playing ─────────────────────────────────────────────────────

  /** Put the player over the poster and start it. Returns false when there is nothing to play. */
  public play(): boolean {
    const media = this.get();
    const group = this.node?.svgGroup?.node as SVGGElement | undefined;
    if (!this.canPlay() || !media || !group) return false;
    if (this.player) return true;
    const src = mediaEmbedUrl(media, { play: true });
    if (!src) return false;

    const fo = document.createElementNS(SVG_NS, "foreignObject");
    fo.setAttribute("class", MEDIA_CLASSES.player);
    const box = document.createElementNS(XHTML_NS, "div") as HTMLDivElement;
    box.setAttribute("style", "width:100%;height:100%;margin:0;padding:0;background:#000;overflow:hidden");
    const frame = document.createElementNS(XHTML_NS, "iframe") as HTMLIFrameElement;
    frame.setAttribute("src", src);
    frame.setAttribute("title", mediaLabel(media));
    frame.setAttribute("sandbox", MEDIA_IFRAME_SANDBOX);
    frame.setAttribute("allow", MEDIA_IFRAME_ALLOW);
    frame.setAttribute("allowfullscreen", "");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    frame.setAttribute("style", "width:100%;height:100%;border:0;display:block");
    box.appendChild(frame);
    fo.appendChild(box);
    // Under the selection chrome the slate draws outside the group; over the poster.
    group.appendChild(fo);
    this.player = fo;

    const close = document.createElementNS(SVG_NS, "g");
    close.setAttribute("class", MEDIA_CLASSES.close);
    close.setAttribute("role", "button");
    close.setAttribute("tabindex", "0");
    close.setAttribute("aria-label", "Stop the video");
    close.setAttribute("style", "cursor:pointer");
    const disc = document.createElementNS(SVG_NS, "circle");
    disc.setAttribute("r", "11");
    disc.setAttribute("fill", "#000000");
    disc.setAttribute("fill-opacity", "0.72");
    disc.setAttribute("stroke", "#ffffff");
    disc.setAttribute("stroke-width", "1.5");
    close.appendChild(disc);
    const cross = document.createElementNS(SVG_NS, "path");
    cross.setAttribute("d", "M -4 -4 L 4 4 M 4 -4 L -4 4");
    cross.setAttribute("stroke", "#ffffff");
    cross.setAttribute("stroke-width", "2");
    cross.setAttribute("stroke-linecap", "round");
    cross.setAttribute("pointer-events", "none");
    close.appendChild(cross);
    group.appendChild(close);
    this.closeButton = close;
    this.bindActivate(close, () => this.stop());

    if (this.overlay) this.overlay.setAttribute("display", "none");
    this.sizePlayer();
    this.node.slate?.announce?.(`Playing ${mediaLabel(media)}`);
    return true;
  }

  /** Take the player away and show the poster again. */
  public stop(): void {
    const was = this.player !== null;
    this.player?.remove();
    this.player = null;
    this.closeButton?.remove();
    this.closeButton = null;
    if (this.overlay) this.overlay.removeAttribute("display");
    if (was) {
      try {
        (this.playButton as any)?.focus?.({ preventScroll: true });
      } catch {
        /* focus is a nicety */
      }
    }
  }

  public toggle(): void {
    if (this.player) this.stop();
    else this.play();
  }

  public destroy(): void {
    this.stop();
    this.removeOverlay();
    (this as any).node = null;
  }

  // ─── Private ─────────────────────────────────────────────────────

  /** Where the note's box starts inside its group (the background shape's corner). */
  private origin(): { x: number; y: number } {
    const bg: any = this.node.backgroundRect;
    const x = Number(bg?.x?.()) || 0;
    const y = Number(bg?.y?.()) || 0;
    return { x, y };
  }

  private sizePlayer(): void {
    if (!this.player) return;
    const w = Number(this.node.options.width) || 0;
    const h = Number(this.node.options.height) || 0;
    const { x, y } = this.origin();
    this.player.setAttribute("x", String(x));
    this.player.setAttribute("y", String(y));
    this.player.setAttribute("width", String(w));
    this.player.setAttribute("height", String(h));
    this.closeButton?.setAttribute("transform", `translate(${x + w - 15} ${y + 15})`);
  }

  private removeOverlay(): void {
    this.overlay?.remove();
    this.overlay = null;
    this.playButton = null;
  }

  /**
   * A button on the note: a press never starts a drag of the note, and the action
   * runs on pointerup (the drag machinery captures the pointer, so no native click
   * follows), on a synthetic click, and on Enter or Space when it has focus.
   */
  private bindActivate(el: Element, action: () => void): void {
    // One press is one action: a browser that also sends a click after pointerup runs it once.
    let last = -Infinity;
    const run = (event: Event) => {
      event.stopPropagation();
      event.preventDefault?.();
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (now - last < 350) return;
      last = now;
      action();
    };
    el.addEventListener("pointerdown", (event) => event.stopPropagation());
    el.addEventListener("pointerup", run);
    el.addEventListener("click", run);
    el.addEventListener("keydown", (event: Event) => {
      const key = (event as KeyboardEvent).key;
      if (key === "Enter" || key === " ") run(event);
    });
  }
}
