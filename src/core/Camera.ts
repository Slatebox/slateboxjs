/**
 * Camera.ts - eased, Prezi-style camera flights over the live canvas.
 *
 * The camera is the canvas viewbox: a flight writes one viewbox per frame. A
 * "prezi" arc interpolates the zoom in log space with a pull-back bump that
 * grows with the distance travelled (zoom out, travel, zoom in), and eases the
 * centre inside the middle of the flight so the pull-back leads.
 *
 * Roll: an SVG viewbox cannot rotate. A host that wants roll gives the camera a
 * roll host (an element wrapping the canvas, usually a square whose side is the
 * viewport's diagonal so no corner shows) and the camera rotates it with a CSS
 * transform, mapping the screen offset (the caption band) through the roll.
 *
 * Every write goes through `canvas.viewbox(...)`: nothing is saved, no event is
 * sent, nothing enters undo.
 */

export interface CameraBox { x: number; y: number; width: number; height: number }
export interface CameraState { cx: number; cy: number; scale: number; roll: number; dy: number }
export interface CameraViewport { w: number; h: number }
export type CameraArc = "prezi" | "direct" | "cut";

export interface CameraFrameOptions {
  /** Share of the room the box fills (0-1). Default 0.9. */
  fill?: number;
  /** Fill the whole viewport with the box (it is cropped), not fit inside it. */
  cover?: boolean;
  /** Screen pixels kept clear at the bottom (a caption band) and at the top. */
  bottom?: number;
  top?: number;
  /** Highest zoom allowed. */
  maxScale?: number;
}

export interface CameraTarget extends CameraFrameOptions {
  bbox?: CameraBox;
  nodeIds?: string[];
  /** A camera state, as given (bbox and nodeIds are ignored). */
  state?: Partial<CameraState>;
  /** Degrees. */
  roll?: number;
}

export interface FlyOptions {
  /** Milliseconds; default grows with distance, 900-2000. */
  duration?: number;
  arc?: CameraArc;
  /** Reduced motion: a cut, and the roll forced level. */
  reduced?: boolean;
  signal?: AbortSignal;
  onFrame?: (state: CameraState, t: number) => void;
  ease?: (t: number) => number;
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** The camera that frames `box` in `view`, leaving `top`/`bottom` pixels clear. */
export function cameraFor(box: CameraBox, view: CameraViewport, opts: CameraFrameOptions & { roll?: number } = {}): CameraState {
  const width = Math.max(1, box.width);
  const height = Math.max(1, box.height);
  const top = opts.top ?? 0;
  const bottom = opts.bottom ?? 0;
  const fill = opts.fill ?? 0.9;
  const room = Math.max(1, view.h - top - bottom);
  // A rolled frame is fitted by its rotated extent, so its corners stay on screen.
  const r = (Math.abs(opts.roll ?? 0) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(r));
  const sin = Math.abs(Math.sin(r));
  const fitW = opts.cover ? width : width * cos + height * sin;
  const fitH = opts.cover ? height : width * sin + height * cos;
  let scale = opts.cover
    ? Math.max(view.w / width, view.h / height)
    : Math.min((view.w * fill) / fitW, (room * fill) / fitH);
  if (opts.maxScale && scale > opts.maxScale) scale = opts.maxScale;
  return {
    cx: box.x + box.width / 2,
    cy: box.y + box.height / 2,
    scale,
    roll: opts.roll ?? 0,
    dy: opts.cover ? 0 : (top - bottom) / 2,
  };
}

/** The camera `t` (0-1) of the way from `a` to `b`. */
export function cameraBetween(a: CameraState, b: CameraState, t: number, view: CameraViewport, arc: CameraArc = "prezi", ease = easeInOutCubic): CameraState {
  if (t >= 1 || arc === "cut") return { ...b };
  if (t <= 0) return { ...a };
  const e = ease(t);
  const la = Math.log(a.scale);
  const lb = Math.log(b.scale);
  let ls = la + (lb - la) * e;
  let ce = e;
  if (arc === "prezi") {
    const travel = (Math.hypot(b.cx - a.cx, b.cy - a.cy) * Math.min(a.scale, b.scale)) / Math.max(1, Math.min(view.w, view.h));
    const bump = Math.min(2.2, 0.9 * Math.log(1 + travel + Math.abs(lb - la) * 0.4));
    ls -= bump * Math.sin(Math.PI * e);
    ce = ease(clamp01((t - 0.12) / 0.76));
  }
  return {
    cx: a.cx + (b.cx - a.cx) * ce,
    cy: a.cy + (b.cy - a.cy) * ce,
    scale: Math.exp(ls),
    roll: a.roll + (b.roll - a.roll) * e,
    dy: a.dy + (b.dy - a.dy) * e,
  };
}

/**
 * The viewbox that shows `cam`: centred on (cx, cy) moved by the screen offset
 * `dy` (mapped through the roll), `side` pixels square when the canvas sits in a
 * square roll host, else the viewport's size.
 */
export function viewboxFor(cam: CameraState, view: CameraViewport, side?: number): CameraBox {
  const r = (-cam.roll * Math.PI) / 180;
  const ox = -Math.sin(r) * cam.dy;
  const oy = Math.cos(r) * cam.dy;
  const w = (side ?? view.w) / cam.scale;
  const h = (side ?? view.h) / cam.scale;
  const cx = cam.cx - ox / cam.scale;
  const cy = cam.cy - oy / cam.scale;
  return { x: cx - w / 2, y: cy - h / 2, width: w, height: h };
}

/** A flight's length: longer for a longer trip, 900-2000 ms. */
export function flightDuration(a: CameraState, b: CameraState, view: CameraViewport): number {
  const travel = (Math.hypot(b.cx - a.cx, b.cy - a.cy) * Math.min(a.scale, b.scale)) / Math.max(1, Math.min(view.w, view.h));
  const zoom = Math.abs(Math.log(b.scale / a.scale));
  return Math.round(Math.min(2000, 900 + travel * 260 + zoom * 180));
}

const abortError = () => {
  const error = new Error("The camera flight was aborted.");
  error.name = "AbortError";
  return error;
};

export class Camera {
  private slate: any;
  private state: CameraState | null = null;
  private rollHost: { style: { transform: string } } | null = null;
  private hostSide: number | undefined;
  private viewportFn: (() => CameraViewport) | null = null;
  private raf: number | null = null;
  private cancelCurrent: (() => void) | null = null;

  constructor(slate: any) {
    this.slate = slate;
  }

  /**
   * Where the camera looks from: `viewport` is the visible stage's size (it
   * defaults to the canvas element's), `rollHost` the element rotated for roll,
   * and `hostSide` the canvas's side when it sits in a square roll host.
   */
  public configure(opts: { viewport?: () => CameraViewport; rollHost?: { style: { transform: string } } | null; hostSide?: number }): void {
    if (opts.viewport) this.viewportFn = opts.viewport;
    if (opts.rollHost !== undefined) this.rollHost = opts.rollHost;
    if (opts.hostSide !== undefined) this.hostSide = opts.hostSide;
  }

  public setRollHost(host: { style: { transform: string } } | null, side?: number): void {
    this.configure({ rollHost: host, hostSide: side });
  }

  public viewport(): CameraViewport {
    if (this.viewportFn) return this.viewportFn();
    const size = this.slate?.panZoom?.getViewportSize?.();
    return size ? { w: size.w, h: size.h } : { w: 800, h: 600 };
  }

  /** The camera now: the last one set, else read from the viewbox. */
  public current(): CameraState | null {
    if (this.state) return { ...this.state };
    const vb = this.slate?.canvas?.viewbox?.();
    if (!vb?.width) return null;
    const view = this.viewport();
    return { cx: vb.x + vb.width / 2, cy: vb.y + vb.height / 2, scale: (this.hostSide ?? view.w) / vb.width, roll: 0, dy: 0 };
  }

  /** The box the given notes cover, from their options. */
  public boxOf(nodeIds: string[]): CameraBox | null {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const id of nodeIds) {
      const node = this.slate?.nodes?.one?.(id);
      const o = node?.options;
      if (!o) continue;
      x0 = Math.min(x0, o.x ?? 0);
      y0 = Math.min(y0, o.y ?? 0);
      x1 = Math.max(x1, (o.x ?? 0) + (o.width ?? 0));
      y1 = Math.max(y1, (o.y ?? 0) + (o.height ?? 0));
    }
    return Number.isFinite(x0) ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null;
  }

  /** The camera that frames `target`, or null when it frames nothing. */
  public resolve(target: CameraTarget, reduced = false): CameraState | null {
    const roll = reduced ? 0 : target.roll ?? 0;
    if (target.state) {
      const now = this.current();
      return { cx: 0, cy: 0, scale: 1, dy: 0, ...now, ...target.state, roll: reduced ? 0 : target.state.roll ?? roll } as CameraState;
    }
    const box = target.bbox ?? (target.nodeIds ? this.boxOf(target.nodeIds) : null);
    return box ? cameraFor(box, this.viewport(), { ...target, roll }) : null;
  }

  /** Show `cam` at once. */
  public apply(cam: CameraState): void {
    const vb = viewboxFor(cam, this.viewport(), this.hostSide);
    try {
      this.slate.canvas.viewbox(vb.x, vb.y, vb.width, vb.height);
    } catch {
      /* a detached canvas: nothing to show */
    }
    if (this.rollHost) this.rollHost.style.transform = `rotate(${Math.round(cam.roll * 100) / 100}deg)`;
    this.state = { ...cam };
  }

  /** Stop the flight in progress (its promise rejects with an AbortError). */
  public stop(): void {
    this.cancelCurrent?.();
  }

  /**
   * Fly to `target`. Resolves when the camera lands; rejects with an AbortError
   * when `signal` aborts or a newer flight starts.
   */
  public flyTo(target: CameraTarget, opts: FlyOptions = {}): Promise<CameraState> {
    this.stop();
    const reduced = Boolean(opts.reduced);
    const to = this.resolve(target, reduced);
    if (!to) return Promise.resolve(this.current() as CameraState);
    const from = this.current();
    const arc: CameraArc = reduced || !from ? "cut" : opts.arc ?? "prezi";
    const view = this.viewport();
    const duration = opts.duration ?? (from ? flightDuration(from, to, view) : 0);
    if (arc === "cut" || duration <= 0 || typeof requestAnimationFrame === "undefined") {
      if (opts.signal?.aborted) return Promise.reject(abortError());
      this.apply(to);
      opts.onFrame?.(to, 1);
      return Promise.resolve({ ...to });
    }
    const flight = new Promise<CameraState>((resolve, reject) => {
      let start: number | null = null;
      let done = false;
      const finish = (error?: Error) => {
        if (done) return;
        done = true;
        if (this.raf != null) {
          try { cancelAnimationFrame(this.raf); } catch { /* noop */ }
        }
        this.raf = null;
        this.cancelCurrent = null;
        opts.signal?.removeEventListener?.("abort", onAbort);
        if (error) reject(error);
        else resolve({ ...to });
      };
      const onAbort = () => finish(abortError());
      if (opts.signal?.aborted) { finish(abortError()); return; }
      opts.signal?.addEventListener?.("abort", onAbort);
      this.cancelCurrent = onAbort;
      const tick = (now: number) => {
        // A frame queued before this flight was stopped never moves the camera.
        if (done) return;
        if (start === null) start = now;
        const t = clamp01((now - start) / duration);
        const cam = cameraBetween(from!, to, t, view, arc, opts.ease);
        this.apply(cam);
        opts.onFrame?.(cam, t);
        if (t < 1) this.raf = requestAnimationFrame(tick);
        else finish();
      };
      this.raf = requestAnimationFrame(tick);
    });
    // A flight nobody waits for may be cut short: that is not an error to report.
    flight.catch(() => {});
    return flight;
  }

  public destroy(): void {
    this.stop();
    this.rollHost = null;
    this.slate = null;
  }
}
