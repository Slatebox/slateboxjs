import { a as z, m as S, b as D } from "./canvas-media-D5MZ8APN.mjs";
const d = "http://www.w3.org/2000/svg", L = "http://www.w3.org/1999/xhtml", w = Object.freeze({
  overlay: "media-note-overlay",
  play: "media-note-play",
  player: "media-note-player",
  close: "media-note-close"
}), I = "allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox", j = "autoplay; encrypted-media; picture-in-picture; fullscreen", E = (b, t, r) => Math.max(t, Math.min(r, b));
function G(b, t, r) {
  const e = Math.max(1, Math.floor(t / (r * 0.56)));
  return b.length <= e ? b : `${b.slice(0, Math.max(1, e - 1)).trimEnd()}…`;
}
class T {
  constructor(t) {
    this.enabled = !0, this.overlay = null, this.playButton = null, this.player = null, this.closeButton = null, this.node = t;
  }
  // ─── Isolated class contract ─────────────────────────────────────
  enable() {
    this.enabled = !0;
  }
  /** Stops any playback; the poster stays drawn. */
  disable() {
    this.stop(), this.enabled = !1;
  }
  isEnabled() {
    return this.enabled;
  }
  /** Store a new video on the note and draw it. */
  updateOptions(t) {
    t ? this.node.options.media = { ...t } : delete this.node.options.media, this.render();
  }
  // ─── Reading ─────────────────────────────────────────────────────
  get() {
    const t = this.node?.options?.media;
    return t && typeof t == "object" && t.provider && t.id ? t : null;
  }
  hasMedia() {
    return this.get() !== null;
  }
  isPlaying() {
    return this.player !== null;
  }
  /**
   * Whether this note may play here. A host that draws a still picture of a slate
   * (a slate's card, a gallery tile, a draft, a presenter's overview) sets the
   * slate option `mediaPlayback: false`: the note shows its poster, play button
   * and caption, and pressing it does nothing (a press opens what the picture
   * stands for, as on any other note).
   */
  canPlay() {
    return this.enabled && this.node?.slate?.options?.mediaPlayback !== !1;
  }
  // ─── Drawing ─────────────────────────────────────────────────────
  /** Draw (or redraw, after a resize) the poster's play button and caption. */
  render() {
    this.removeOverlay();
    const t = this.get(), r = this.node?.svgGroup?.node;
    if (!t || !r) {
      this.player && this.stop();
      return;
    }
    const e = Number(this.node.options.width) || 0, i = Number(this.node.options.height) || 0;
    if (e <= 0 || i <= 0) return;
    const { x: o, y: n } = this.origin(), s = document.createElementNS(d, "g");
    s.setAttribute("class", w.overlay), s.setAttribute("data-media-provider", t.provider);
    const l = E(i * 0.075, 9, 18), c = Math.round(l * 0.8 * 10) / 10, y = E(e * 0.03, 6, 14), A = Math.round(l * 1.35 + c * 1.35 + y), k = i >= 70 && e >= 90;
    if (k) {
      const p = document.createElementNS(d, "rect");
      p.setAttribute("x", String(o)), p.setAttribute("y", String(n + i - A)), p.setAttribute("width", String(e)), p.setAttribute("height", String(A)), p.setAttribute("fill", "#000000"), p.setAttribute("fill-opacity", "0.58"), p.setAttribute("pointer-events", "none"), s.appendChild(p);
      const x = z[t.provider] || "Video", P = [
        [t.title || `${x} video`, l, "700", "1"],
        [t.author ? `${x} · ${t.author}` : x, c, "500", "0.82"]
      ];
      let $ = n + i - A + y / 2 + l;
      for (const [B, N, O, _] of P) {
        const u = document.createElementNS(d, "text");
        u.setAttribute("x", String(o + y)), u.setAttribute("y", String(Math.round($ * 10) / 10)), u.setAttribute("font-family", "Manrope, Arial, sans-serif"), u.setAttribute("font-size", String(N)), u.setAttribute("font-weight", O), u.setAttribute("fill", "#ffffff"), u.setAttribute("fill-opacity", _), u.setAttribute("pointer-events", "none"), u.textContent = G(B, e - y * 2, N), s.appendChild(u), $ += N * 1.35;
      }
    }
    const M = E(Math.min(e, i) * 0.16, 12, 36), m = o + e / 2, g = n + (k ? (i - A) / 2 : i / 2), C = this.canPlay(), a = document.createElementNS(d, "g");
    a.setAttribute("class", w.play), C ? (a.setAttribute("role", "button"), a.setAttribute("tabindex", "0"), a.setAttribute("aria-label", `Play ${S(t)}`), a.setAttribute("style", "cursor:pointer")) : (a.setAttribute("aria-hidden", "true"), a.setAttribute("pointer-events", "none"));
    const h = document.createElementNS(d, "circle");
    h.setAttribute("cx", String(m)), h.setAttribute("cy", String(g)), h.setAttribute("r", String(M)), h.setAttribute("fill", "#000000"), h.setAttribute("fill-opacity", "0.62"), h.setAttribute("stroke", "#ffffff"), h.setAttribute("stroke-width", String(E(M * 0.09, 1.5, 3))), a.appendChild(h);
    const v = document.createElementNS(d, "path"), f = M * 0.42;
    v.setAttribute("d", `M ${m - f * 0.7} ${g - f} L ${m + f} ${g} L ${m - f * 0.7} ${g + f} Z`), v.setAttribute("fill", "#ffffff"), v.setAttribute("pointer-events", "none"), a.appendChild(v), s.appendChild(a), C && this.bindActivate(a, () => this.play()), r.appendChild(s), this.overlay = s, this.playButton = a, r.setAttribute("aria-label", S(t)), r.setAttribute("data-media-note", t.provider), this.player && (s.setAttribute("display", "none"), this.sizePlayer());
  }
  /** Redraw for a new size (Node.setSize calls this). */
  update() {
    this.hasMedia() && this.render();
  }
  // ─── Playing ─────────────────────────────────────────────────────
  /** Put the player over the poster and start it. Returns false when there is nothing to play. */
  play() {
    const t = this.get(), r = this.node?.svgGroup?.node;
    if (!this.canPlay() || !t || !r) return !1;
    if (this.player) return !0;
    const e = D(t, { play: !0 });
    if (!e) return !1;
    const i = document.createElementNS(d, "foreignObject");
    i.setAttribute("class", w.player);
    const o = document.createElementNS(L, "div");
    o.setAttribute("style", "width:100%;height:100%;margin:0;padding:0;background:#000;overflow:hidden");
    const n = document.createElementNS(L, "iframe");
    n.setAttribute("src", e), n.setAttribute("title", S(t)), n.setAttribute("sandbox", I), n.setAttribute("allow", j), n.setAttribute("allowfullscreen", ""), n.setAttribute("referrerpolicy", "strict-origin-when-cross-origin"), n.setAttribute("style", "width:100%;height:100%;border:0;display:block"), o.appendChild(n), i.appendChild(o), r.appendChild(i), this.player = i;
    const s = document.createElementNS(d, "g");
    s.setAttribute("class", w.close), s.setAttribute("role", "button"), s.setAttribute("tabindex", "0"), s.setAttribute("aria-label", "Stop the video"), s.setAttribute("style", "cursor:pointer");
    const l = document.createElementNS(d, "circle");
    l.setAttribute("r", "11"), l.setAttribute("fill", "#000000"), l.setAttribute("fill-opacity", "0.72"), l.setAttribute("stroke", "#ffffff"), l.setAttribute("stroke-width", "1.5"), s.appendChild(l);
    const c = document.createElementNS(d, "path");
    return c.setAttribute("d", "M -4 -4 L 4 4 M 4 -4 L -4 4"), c.setAttribute("stroke", "#ffffff"), c.setAttribute("stroke-width", "2"), c.setAttribute("stroke-linecap", "round"), c.setAttribute("pointer-events", "none"), s.appendChild(c), r.appendChild(s), this.closeButton = s, this.bindActivate(s, () => this.stop()), this.overlay && this.overlay.setAttribute("display", "none"), this.sizePlayer(), this.node.slate?.announce?.(`Playing ${S(t)}`), !0;
  }
  /** Take the player away and show the poster again. */
  stop() {
    const t = this.player !== null;
    if (this.player?.remove(), this.player = null, this.closeButton?.remove(), this.closeButton = null, this.overlay && this.overlay.removeAttribute("display"), t)
      try {
        this.playButton?.focus?.({ preventScroll: !0 });
      } catch {
      }
  }
  toggle() {
    this.player ? this.stop() : this.play();
  }
  destroy() {
    this.stop(), this.removeOverlay(), this.node = null;
  }
  // ─── Private ─────────────────────────────────────────────────────
  /** Where the note's box starts inside its group (the background shape's corner). */
  origin() {
    const t = this.node.backgroundRect, r = Number(t?.x?.()) || 0, e = Number(t?.y?.()) || 0;
    return { x: r, y: e };
  }
  sizePlayer() {
    if (!this.player) return;
    const t = Number(this.node.options.width) || 0, r = Number(this.node.options.height) || 0, { x: e, y: i } = this.origin();
    this.player.setAttribute("x", String(e)), this.player.setAttribute("y", String(i)), this.player.setAttribute("width", String(t)), this.player.setAttribute("height", String(r)), this.closeButton?.setAttribute("transform", `translate(${e + t - 15} ${i + 15})`);
  }
  removeOverlay() {
    this.overlay?.remove(), this.overlay = null, this.playButton = null;
  }
  /**
   * A button on the note: a press never starts a drag of the note, and the action
   * runs on pointerup (the drag machinery captures the pointer, so no native click
   * follows), on a synthetic click, and on Enter or Space when it has focus.
   */
  bindActivate(t, r) {
    let e = -1 / 0;
    const i = (o) => {
      o.stopPropagation(), o.preventDefault?.();
      const n = typeof performance < "u" ? performance.now() : Date.now();
      n - e < 350 || (e = n, r());
    };
    t.addEventListener("pointerdown", (o) => o.stopPropagation()), t.addEventListener("pointerup", i), t.addEventListener("click", i), t.addEventListener("keydown", (o) => {
      const n = o.key;
      (n === "Enter" || n === " ") && i(o);
    });
  }
}
export {
  w as MEDIA_CLASSES,
  j as MEDIA_IFRAME_ALLOW,
  I as MEDIA_IFRAME_SANDBOX,
  T as MediaNote,
  G as fitText
};
