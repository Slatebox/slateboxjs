/**
 * Module augmentation for @svgdotjs/svg.js — declares methods added by official plugins.
 * This eliminates `(this.svgGroup as any).pluginMethod()` casts throughout the codebase.
 */

import "@svgdotjs/svg.js";

declare module "@svgdotjs/svg.js" {
  // ── svg.draggable.js ────────────────────────────────────────────
  interface Element {
    draggable(enable?: boolean): this;
    draggable(options?: Record<string, unknown>): this;
  }

  // ── svg.panzoom.js ─────────────────────────────────────────────
  interface Svg {
    panZoom(enable?: boolean): this;
    panZoom(options?: Record<string, unknown>): this;
    zoom(): number;
    zoom(level: number): this;
    zoomIn(): this;
    zoomOut(): this;
    reset(): this;
    pan(pos: { x: number; y: number }): this;
  }

  // ── svg.select.js ──────────────────────────────────────────────
  interface Element {
    select(enable?: boolean): this;
    select(options?: Record<string, unknown>): this;
    selectize(enable?: boolean): this;
    selectize(options?: Record<string, unknown>): this;
  }

  // ── svg.resize.js ──────────────────────────────────────────────
  interface Element {
    resize(enable?: boolean): this;
    resize(options?: Record<string, unknown>): this;
  }

  // ── SVG.js 3.x utility methods ─────────────────────────────────
  interface Element {
    /** Get bounding box as per SVG spec (same as bbox but includes transforms) */
    rbox(): { x: number; y: number; width: number; height: number; w: number; h: number };
    /** Get screen CTM (cumulative transformation matrix) */
    screenCTM(): DOMMatrix | null;
    /** Get tbox (tight bbox for text elements) */
    tbox(): { x: number; y: number; width: number; height: number; w: number; h: number };
    /** Add data-* attribute with value */
    data(key: string, value?: unknown): unknown;
    /** Get ancestors matching optional selector */
    parents(selector?: string): Element[];
    /** Get the element's owner SVG document */
    root(): Svg;
    /** Create a <defs> element */
    defs(): Defs;
    /** Create a nested <svg> element */
    nested(): Svg;
    /** Get native DOM node transform */
    transform(): { translateX: number; translateY: number; scaleX: number; scaleY: number; rotate: number; shear: number };
    transform(transform: Partial<{ translateX: number; translateY: number; scaleX: number; scaleY: number; rotate: number; shear: number; origin: string }>): this;
    /** SVG to string / string to SVG */
    svg(svgString: string): this;
    svg(): string;
    /** Natural dimensions (for images) */
    natural(): { width: number; height: number };
  }
}
