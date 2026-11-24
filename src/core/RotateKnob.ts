/**
 * The rotate knob drawn by svg.select.js for one selected note, and the angle maths
 * behind it.
 *
 * The knob sits just outside the note's top-right corner, so it stays clear of the
 * four connect dots (edge midpoints) and the note's action pill (centred above).
 * Every size here is in screen pixels: the overlay lives in the root SVG, whose
 * viewBox carries the zoom, so sizes are divided by the root's screen scale and the
 * knob looks the same at every zoom.
 */

type Pt = [number, number];

/** Visible knob diameter, in screen px. */
export const KNOB_SIZE = 28;
/** Hit target, in screen px (WCAG 2.5.5 / Apple HIG touch size). */
export const KNOB_HIT = 44;
/** Knob centre offset from the corner, along each of the note's local axes, in screen px. */
export const KNOB_OFFSET = 20;
/** Shift snaps to this step (tldraw, Excalidraw and FigJam all use 15°). */
export const SHIFT_STEP = 15;
/** On touch the angle sticks to a right angle when this close to it. */
export const TOUCH_STICK = 4;

const ICON_D = "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8M21 3v5h-5";
const BLUE = "#2d6cdf";
const BLUE_ACTIVE = "#1f56b8";
const RING = "#c7ccd4";

// A circular arrow with a white halo, so the cursor reads on light and dark canvases.
const CURSOR_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">` +
  `<path d="${ICON_D}" stroke="#fff" stroke-width="5"/>` +
  `<path d="${ICON_D}" stroke="#1b1f1d" stroke-width="2"/></svg>`;
export const ROTATE_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(CURSOR_SVG)}") 12 12, grab`;

/** Normalise an angle in degrees to (-180, 180]. */
export function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a <= -180) a += 360;
  if (a > 180) a -= 360;
  return a === 0 ? 0 : a; // no -0
}

export interface RotationSnap {
  /** Shift held: snap to multiples of 15°. */
  shift?: boolean;
  /** Coarse pointer (touch): stick to the nearest right angle within 4°. */
  coarse?: boolean;
}

/**
 * The note's absolute angle for a pointer position during a rotate gesture.
 *
 * @param startAngle - the note's angle when the gesture began (degrees)
 * @param centre     - the note's centre, in the same space as `grab` and `p`
 * @param grab       - the pointer where the gesture began
 * @param p          - the pointer now
 */
export function rotationFromPointer(
  startAngle: number,
  centre: { x: number; y: number },
  grab: { x: number; y: number },
  p: { x: number; y: number },
  snap: RotationSnap = {},
): number {
  const from = Math.atan2(grab.y - centre.y, grab.x - centre.x);
  const to = Math.atan2(p.y - centre.y, p.x - centre.x);
  return snapAngle(startAngle + ((to - from) * 180) / Math.PI, snap);
}

/** Apply the snap rules to a raw angle, and normalise it. */
export function snapAngle(raw: number, snap: RotationSnap = {}): number {
  let a = raw;
  if (snap.shift) {
    a = Math.round(a / SHIFT_STEP) * SHIFT_STEP;
  } else {
    const right = Math.round(a / 90) * 90;
    a = snap.coarse && Math.abs(a - right) <= TOUCH_STICK ? right : Math.round(a);
  }
  return normalizeAngle(a);
}

/**
 * Where the knob goes, in overlay units: outside the top-right corner, offset
 * along the note's own top edge and its outward normal, so it turns with the note.
 *
 * @param points - svg.select's eight handle points (lt, t, rt, r, rb, b, lb, l)
 * @param scale  - screen px per overlay unit
 */
export function rotateKnobPosition(points: Pt[], scale: number): Pt | null {
  const lt = points?.[0], rt = points?.[2], rb = points?.[4];
  if (!lt || !rt || !rb) return null;
  const s = scale > 0 && Number.isFinite(scale) ? scale : 1;
  const unit = (a: Pt, b: Pt): Pt => {
    const dx = a[0] - b[0], dy = a[1] - b[1];
    const len = Math.hypot(dx, dy);
    return len > 1e-9 ? [dx / len, dy / len] : [0, 0];
  };
  let along = unit(rt, lt);
  let up = unit(rt, rb);
  // A collapsed box (zero width or height): fall back to screen axes.
  if (!along[0] && !along[1]) along = [1, 0];
  if (!up[0] && !up[1]) up = [-along[1], along[0]] as Pt;
  const d = KNOB_OFFSET / s;
  const pos: Pt = [rt[0] + (along[0] + up[0]) * d, rt[1] + (along[1] + up[1]) * d];
  return Number.isFinite(pos[0]) && Number.isFinite(pos[1]) ? pos : null;
}

/** Screen px per overlay unit for an svg.select handler (the root SVG's zoom). */
function overlayScale(handler: any): number {
  try {
    const m = handler?.el?.root?.()?.screenCTM?.();
    const s = m ? Math.hypot(m.a, m.b) : 1;
    return s > 0 && Number.isFinite(s) ? s : 1;
  } catch {
    return 1;
  }
}

/**
 * svg.select `createRot`: a transparent 44px hit target (a rect, so the group still
 * holds exactly one circle), the 28px white knob and a circular-arrow icon. Styles
 * are inline because the host may load the JS without slateboxjs.css.
 */
export function createRotateKnob(group: any) {
  group.rect(KNOB_HIT, KNOB_HIT).addClass("svg_select_handle_rot_hit").attr({
    fill: "#fff",
    "fill-opacity": 0.001,
    stroke: "none",
    "pointer-events": "all",
  });
  group.circle(KNOB_SIZE).addClass("svg_select_handle_rot_knob").attr({
    fill: "#fff",
    stroke: RING,
    "stroke-width": 1,
    "pointer-events": "all",
  });
  group.path(ICON_D).addClass("svg_select_handle_rot_icon").attr({
    fill: "none",
    stroke: BLUE,
    "stroke-width": 2.6,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "pointer-events": "none",
  });
  const el = group.node as SVGGElement;
  el.style.cursor = ROTATE_CURSOR;
  el.style.filter = "drop-shadow(0 1px 2px rgba(0,0,0,.28))";
  el.setAttribute("data-rotate-knob", "");
  el.setAttribute("aria-label", "Rotate");
  const paint = () => {
    const state = el.getAttribute("data-state");
    const knob = el.querySelector("circle");
    const icon = el.querySelector("path");
    knob?.setAttribute("fill", state === "active" ? BLUE_ACTIVE : state === "hover" ? BLUE : "#fff");
    knob?.setAttribute("stroke", state ? BLUE_ACTIVE : RING);
    icon?.setAttribute("stroke", state ? "#fff" : BLUE);
  };
  (el as any).__paintKnob = paint;
  el.addEventListener("pointerenter", () => {
    if (el.getAttribute("data-state") !== "active") el.setAttribute("data-state", "hover");
    paint();
    (group as any).__relayout?.();
  });
  el.addEventListener("pointerleave", () => {
    if (el.getAttribute("data-state") !== "active") el.removeAttribute("data-state");
    paint();
    (group as any).__relayout?.();
  });
}

/**
 * svg.select `updateRot` (called with `this` = the select handler): place and size
 * the knob for the current geometry and zoom. The plugin's own rotation point
 * (20 units above top-centre) is ignored.
 */
export function updateRotateKnob(this: any, group: any, _rotPoint: Pt, points: Pt[]) {
  const s = overlayScale(this);
  const pos = rotateKnobPosition(points, s);
  if (!pos) return;
  const [cx, cy] = pos;
  const el = group.node as SVGGElement;
  const grow = el.getAttribute("data-state") ? 1.1 : 1;
  const hit = group.findOne?.("rect");
  const knob = group.findOne?.("circle");
  const icon = group.findOne?.("path");
  const h = KNOB_HIT / s;
  hit?.attr({ x: cx - h / 2, y: cy - h / 2, width: h, height: h, rx: h / 2, ry: h / 2 });
  knob?.attr({ cx, cy, r: (KNOB_SIZE * grow) / 2 / s, "stroke-width": 1 / s });
  // The icon is drawn in lucide's 24-unit box and scaled to 16 screen px.
  const k = (16 * grow) / 24 / s;
  icon?.attr({ transform: `translate(${cx - 12 * k} ${cy - 12 * k}) scale(${k})` });
  (group as any).__relayout = () => updateRotateKnob.call(this, group, _rotPoint, points);
}

/**
 * A small dark pill beside the pointer that shows the live angle while rotating.
 * A fixed-position div outside the SVG, so it is immune to zoom and never exported.
 */
export class AngleReadout {
  private el: HTMLDivElement | null = null;

  show(angle: number, clientX: number, clientY: number) {
    if (typeof document === "undefined") return;
    if (!this.el) {
      const el = document.createElement("div");
      el.className = "slatebox-rotate-readout";
      el.setAttribute("aria-hidden", "true");
      el.style.cssText =
        "position:fixed;left:0;top:0;z-index:2147483000;pointer-events:none;" +
        "padding:3px 8px;border-radius:999px;background:#1b1f1d;color:#fff;" +
        "font:600 12px/16px system-ui,-apple-system,'Segoe UI',sans-serif;" +
        "font-variant-numeric:tabular-nums;box-shadow:0 2px 6px rgba(0,0,0,.3);white-space:nowrap";
      document.body.appendChild(el);
      this.el = el;
    }
    this.el.textContent = `${Math.round(angle)}°`;
    const w = this.el.offsetWidth || 40;
    const h = this.el.offsetHeight || 22;
    const vw = window.innerWidth || 0;
    const vh = window.innerHeight || 0;
    const x = Math.max(4, Math.min(clientX + 24, vw - w - 4));
    const y = Math.max(4, Math.min(clientY + 24, vh - h - 4));
    this.el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  }

  hide() {
    this.el?.remove();
    this.el = null;
  }
}

/** Client coordinates of a mouse or touch event (touch end uses changedTouches). */
export function clientPoint(ev: any): { x: number; y: number } | null {
  const t = ev?.touches?.[0] ?? ev?.changedTouches?.[0];
  const src = t ?? ev;
  const x = src?.clientX, y = src?.clientY;
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}
