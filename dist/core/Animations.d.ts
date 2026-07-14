/** SVG-safe node animations exposed through the v1-compatible filter catalog. */
export interface AnimationDef {
    id: string;
    types: Array<"text" | "vect">;
    display: string;
    description: string;
    isInfinite?: boolean;
    css: string;
}
export declare function getAvailableAnimations(): Record<string, AnimationDef>;
export declare function installAnimationStyles(element: any): void;
export declare function applyAnimation(element: any, name: string): boolean;
export declare function removeAnimations(element: any): void;
