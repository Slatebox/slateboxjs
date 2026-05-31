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
export declare class Filters {
    private node;
    private activeFilters;
    private hidden;
    constructor(node: any);
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
    /**
     * Toggle filter visibility (hide/show without removing).
     */
    toggleVisibility(hide: boolean): void;
    /** Get list of active filter names */
    getActive(): string[];
    /** Check if a specific filter is active */
    isActive(filterName: string): boolean;
}
/** Register a custom filter definition */
export declare function registerFilter(def: FilterDef): void;
/** Get all available filter names */
export declare function getFilterNames(): string[];
