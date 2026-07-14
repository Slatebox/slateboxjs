/**
 * Filters.ts - SVG filter effects for nodes
 *
 * SVG.js filter equivalents for v1 Raphael effects:
 * - dropShadow, blur, outline
 * - Apply to vect (shape) and text separately
 */

export interface FilterDef {
  name: string;
  /** Which element types this effect can target (v1 parity: ['text','vect']). */
  types?: string[];
  apply: (element: any) => void;
  remove: (element: any) => void;
}

import type { Node } from "./Node";
import { whiteOrBlack } from "../utils";

// ─── Built-in filter definitions ─────────────────────────────────────

const filterDefs: Map<string, FilterDef> = new Map();

filterDefs.set("dropShadow", {
  name: "dropShadow",
  types: ["text", "vect", "image", "line"],
  apply: (element: any) => {
    try {
      element.attr(
        "filter",
        "drop-shadow(3px 3px 4px rgba(0,0,0,0.3))"
      );
    } catch {
      // SVG filter fallback if CSS filter not supported
    }
  },
  remove: (element: any) => {
    try {
      element.attr("filter", null);
    } catch {}
  },
});

filterDefs.set("blur", {
  name: "blur",
  types: ["text", "vect", "image", "line"],
  apply: (element: any) => {
    try {
      element.attr("filter", "blur(2px)");
    } catch {}
  },
  remove: (element: any) => {
    try {
      element.attr("filter", null);
    } catch {}
  },
});

filterDefs.set("outline", {
  name: "outline",
  types: ["text", "vect"],
  apply: (element: any) => {
    try {
      // Save original stroke before changing
      const origStroke = element.attr("stroke");
      const origStrokeWidth = element.attr("stroke-width");
      element.data("original-stroke", origStroke || "#333");
      element.data("original-stroke-width", origStrokeWidth || 2);
      // Outline color contrasts the element's fill so it reads as a clean halo
      // (dark text → white outline, light text → black). Was a hardcoded #ff0000
      // red placeholder that looked wrong on virtually any text/shape.
      const fill = element.attr("fill");
      const outlineColor =
        typeof fill === "string" && /^#[0-9a-fA-F]{3,6}$/.test(fill)
          ? whiteOrBlack(fill)
          : "#ffffff";
      element.stroke({ color: outlineColor, width: 3 });
      // On TEXT the stroke is painted OVER the fill by default, so a 3px stroke
      // bleeds across the thin glyph strokes and turns the letters into an
      // illegible blob. Paint the stroke BEHIND the fill (paint-order: stroke) so
      // the outline reads as a clean halo. Shapes (rect/path) keep the default so
      // their border stays a full 3px.
      if (element.type === "text") {
        element.attr("paint-order", "stroke");
      }
    } catch {}
  },
  remove: (element: any) => {
    try {
      // Restore original stroke
      element.stroke({
        color: element.data("original-stroke") || "#333",
        width: element.data("original-stroke-width") || 2,
      });
      element.attr("paint-order", null);
    } catch {}
  },
});

// v1 parity: "post-it note" is a soft drop shadow (v1 built it from
// feGaussianBlur + feOffset + feMerge); a CSS drop-shadow reproduces it.
filterDefs.set("postItNote", {
  name: "postItNote",
  types: ["text", "vect", "image", "line"],
  apply: (element: any) => {
    try {
      element.attr("filter", "drop-shadow(0 4px 2px rgba(0,0,0,0.5))");
    } catch {}
  },
  remove: (element: any) => {
    try {
      element.attr("filter", null);
    } catch {}
  },
});

// v1 parity: "pencil" is a hand-drawn/sketch look — feTurbulence +
// feDisplacementMap jitter the edges. CSS can't express this, so we register a
// reusable SVG <filter> in the canvas <defs> and reference it by url.
filterDefs.set("pencil", {
  name: "pencil",
  types: ["text", "vect", "image"],
  apply: (element: any) => {
    try {
      const root = element.root?.();
      const defs = root?.defs?.();
      if (defs && !defs.findOne?.("#sb-pencil-filter")) {
        const f = defs.element("filter").id("sb-pencil-filter");
        f.attr({
          x: "-10%",
          y: "-10%",
          width: "120%",
          height: "120%",
        });
        f.node.innerHTML =
          '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="1" result="noise"/>' +
          '<feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="3" in="SourceGraphic" in2="noise"/>';
      }
      element.attr("filter", "url(#sb-pencil-filter)");
    } catch {}
  },
  remove: (element: any) => {
    try {
      element.attr("filter", null);
    } catch {}
  },
});

// ─── Filters class (isolated class pattern) ─────────────────────────

export class Filters {
  private node: Node;
  private activeFilters: Set<string> = new Set();
  private hidden: boolean = false;

  constructor(node: Node) {
    this.node = node;
  }

  /**
   * Apply a named filter to the node.
   *
   * @param filterName - Name of the filter (e.g., "dropShadow", "blur")
   * @param target - "vect" for shape, "text" for text, or both
   */
  public apply(
    filterName: string,
    target: "vect" | "text" | "both" = "both"
  ): void {
    const def = filterDefs.get(filterName);
    if (!def) {
      console.warn("FILTERS_DEBUG: Unknown filter:", filterName);
      return;
    }

    if (target === "vect" || target === "both") {
      if (this.node.backgroundRect) {
        def.apply(this.node.backgroundRect);
      }
    }

    if (target === "text" || target === "both") {
      if (this.node.textElement) {
        def.apply(this.node.textElement);
      }
    }

    this.activeFilters.add(filterName);

    // Store in node options
    if (!this.node.options.filters) {
      this.node.options.filters = {};
    }
    if (target === "vect" || target === "both") {
      this.node.options.filters.vect = filterName;
    }
    if (target === "text" || target === "both") {
      this.node.options.filters.text = filterName;
    }

    console.log(
      "FILTERS_DEBUG: Applied",
      filterName,
      "to",
      this.node.id,
      "target:",
      target
    );
  }

  /**
   * Remove a specific filter from the node.
   */
  public remove(filterName: string): void {
    const def = filterDefs.get(filterName);
    if (!def) return;

    if (this.node.backgroundRect) {
      def.remove(this.node.backgroundRect);
    }
    if (this.node.textElement) {
      def.remove(this.node.textElement);
    }

    this.activeFilters.delete(filterName);
  }

  /**
   * Remove all filters from the node.
   */
  public removeAll(): void {
    for (const name of this.activeFilters) {
      this.remove(name);
    }
    this.activeFilters.clear();
  }

  /**
   * Toggle filter visibility (hide/show without removing).
   */
  public toggleVisibility(hide: boolean): void {
    this.hidden = hide;
    if (hide) {
      // Temporarily remove all filter effects
      for (const name of this.activeFilters) {
        const def = filterDefs.get(name);
        if (def) {
          if (this.node.backgroundRect) def.remove(this.node.backgroundRect);
          if (this.node.textElement) def.remove(this.node.textElement);
        }
      }
    } else {
      // Re-apply all active filters
      for (const name of this.activeFilters) {
        const def = filterDefs.get(name);
        if (def) {
          if (this.node.backgroundRect) def.apply(this.node.backgroundRect);
          if (this.node.textElement) def.apply(this.node.textElement);
        }
      }
    }
  }

  /** Get list of active filter names */
  public getActive(): string[] {
    return Array.from(this.activeFilters);
  }

  /** Check if a specific filter is active */
  public isActive(filterName: string): boolean {
    return this.activeFilters.has(filterName);
  }

  /** Destroy the filters instance, removing all active filters */
  public destroy(): void {
    this.removeAll();
    this.activeFilters.clear();
    this.hidden = false;
    (this as any).node = null;
  }
}

// ─── Registry API ────────────────────────────────────────────────────

/** Register a custom filter definition */
export function registerFilter(def: FilterDef): void {
  filterDefs.set(def.name, def);
}

/** Get all available filter names */
export function getFilterNames(): string[] {
  return Array.from(filterDefs.keys());
}

/**
 * v1-parity shape for `slate.filters.availableFilters`: an object keyed by
 * filter name, each carrying its `types` array (which element kinds it targets).
 * The app iterates Object.keys(...) and reads `[name].types`.
 */
export function getAvailableFilters(): Record<string, { types: string[] }> {
  const out: Record<string, { types: string[] }> = {};
  for (const [name, def] of filterDefs) {
    out[name] = { types: def.types || ["text", "vect"] };
  }
  return out;
}
