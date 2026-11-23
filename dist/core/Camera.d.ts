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
export interface CameraBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface CameraState {
    cx: number;
    cy: number;
    scale: number;
    roll: number;
    dy: number;
}
export interface CameraViewport {
    w: number;
    h: number;
}
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
/** The camera that frames `box` in `view`, leaving `top`/`bottom` pixels clear. */
export declare function cameraFor(box: CameraBox, view: CameraViewport, opts?: CameraFrameOptions & {
    roll?: number;
}): CameraState;
/** The camera `t` (0-1) of the way from `a` to `b`. */
export declare function cameraBetween(a: CameraState, b: CameraState, t: number, view: CameraViewport, arc?: CameraArc, ease?: (t: number) => number): CameraState;
/**
 * The viewbox that shows `cam`: centred on (cx, cy) moved by the screen offset
 * `dy` (mapped through the roll), `side` pixels square when the canvas sits in a
 * square roll host, else the viewport's size.
 */
export declare function viewboxFor(cam: CameraState, view: CameraViewport, side?: number): CameraBox;
/** A flight's length: longer for a longer trip, 900-2000 ms. */
export declare function flightDuration(a: CameraState, b: CameraState, view: CameraViewport): number;
export declare class Camera {
    private slate;
    private state;
    private rollHost;
    private hostSide;
    private viewportFn;
    private raf;
    private cancelCurrent;
    constructor(slate: any);
    /**
     * Where the camera looks from: `viewport` is the visible stage's size (it
     * defaults to the canvas element's), `rollHost` the element rotated for roll,
     * and `hostSide` the canvas's side when it sits in a square roll host.
     */
    configure(opts: {
        viewport?: () => CameraViewport;
        rollHost?: {
            style: {
                transform: string;
            };
        } | null;
        hostSide?: number;
    }): void;
    setRollHost(host: {
        style: {
            transform: string;
        };
    } | null, side?: number): void;
    viewport(): CameraViewport;
    /** The camera now: the last one set, else read from the viewbox. */
    current(): CameraState | null;
    /** The box the given notes cover, from their options. */
    boxOf(nodeIds: string[]): CameraBox | null;
    /** The camera that frames `target`, or null when it frames nothing. */
    resolve(target: CameraTarget, reduced?: boolean): CameraState | null;
    /** Show `cam` at once. */
    apply(cam: CameraState): void;
    /** Stop the flight in progress (its promise rejects with an AbortError). */
    stop(): void;
    /**
     * Fly to `target`. Resolves when the camera lands; rejects with an AbortError
     * when `signal` aborts or a newer flight starts.
     */
    flyTo(target: CameraTarget, opts?: FlyOptions): Promise<CameraState>;
    destroy(): void;
}
