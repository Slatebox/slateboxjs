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
export declare class Filters {
    private node;
    private activeFilters;
    private hidden;
    constructor(node: Node);
    /**
     * Apply a named filter to the node.
     *
     * @param filterName - Name of the filter (e.g., "dropShadow", "blur")
     * @param target - "vect" for shape, "text" for text, or both
     */
    apply(filterName: string, target?: "vect" | "text" | "both"): void;
    /**
     * Remove a specific filter from the node.
     */
    remove(filterName: string): void;
    /**
     * Remove all filters from the node.
     */
    removeAll(): void;
    /** Apply one exclusive animation to a node element. */
    applyAnimation(animationName: string, target: "vect" | "text"): boolean;
    /** Clear the animation from a node element without affecting filter effects. */
    removeAnimation(target: "vect" | "text"): void;
    /**
     * Toggle filter visibility (hide/show without removing).
     */
    toggleVisibility(hide: boolean): void;
    /** Get list of active filter names */
    getActive(): string[];
    /** Check if a specific filter is active */
    isActive(filterName: string): boolean;
    /** Destroy the filters instance, removing all active filters */
    destroy(): void;
}
/** Register a custom filter definition */
export declare function registerFilter(def: FilterDef): void;
/** Get all available filter names */
export declare function getFilterNames(): string[];
/**
 * v1-parity shape for `slate.filters.availableFilters`: an object keyed by
 * filter name, each carrying its `types` array (which element kinds it targets).
 * The app iterates Object.keys(...) and reads `[name].types`.
 */
export declare function getAvailableFilters(): Record<string, {
    types: string[];
}>;
