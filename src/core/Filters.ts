/**
 * Filters.ts - SVG filter effects for nodes
 *
 * SVG.js filter equivalents for v1 Raphael effects:
 * - dropShadow, blur, outline
 * - Apply to vect (shape) and text separately
 */

export interface FilterDef {
  name: string;
  apply: (element: any) => void;
  remove: (element: any) => void;
}

import type { Node } from "./Node";

// ─── Built-in filter definitions ─────────────────────────────────────

const filterDefs: Map<string, FilterDef> = new Map();

filterDefs.set("dropShadow", {
  name: "dropShadow",
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
  apply: (element: any) => {
    try {
      // Save original stroke before changing
      const origStroke = element.attr("stroke");
      const origStrokeWidth = element.attr("stroke-width");
      element.data("original-stroke", origStroke || "#333");
      element.data("original-stroke-width", origStrokeWidth || 2);
      element.stroke({ color: "#ff0000", width: 3 });
    } catch {}
  },
  remove: (element: any) => {
    try {
      // Restore original stroke
      element.stroke({
        color: element.data("original-stroke") || "#333",
        width: element.data("original-stroke-width") || 2,
      });
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
