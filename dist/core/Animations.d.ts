/** SVG-safe node animations exposed through the v1-compatible filter catalog. */
export interface AnimationDef {
    id: string;
    types: Array<"text" | "vect">;
    display: string;
    description: string;
    isInfinite?: boolean;
    css: string;
}
/**
 * A path shape's element is a nested <svg> whose viewBox is the outline's own
 * bounds, stretched to the note (preserveAspectRatio="none"). Animating that
 * <svg> goes wrong: WebKit ignores CSS transforms on a nested <svg> (nothing
 * moves), and Chromium and Firefox take its fill-box in viewBox units, so the
 * pivot sits wherever the path's numbers are. Animating the outline inside it
 * is no better: the rotation then happens before the stretch, so a turning
 * star on a wide note squashes instead of turning.
 *
 * The animation therefore runs on a plain <g> wrapped around the <svg> (the
 * "animation host"): its fill-box is the note's box in every browser, it turns
 * rigidly after the stretch, and the <svg> keeps clipping exactly as it does
 * at rest (the border looks the same animated or not). The class also stays on
 * the shape element (the API and `.sb-animation-*` lookups are unchanged) but
 * does nothing there.
 */
export declare const ANIMATION_HOST_ATTR = "data-sb-animation-host";
/** The <g> an animated nested <svg> sits in, if any. */
export declare function animationHostOf(element: any): SVGGElement | null;
/**
 * Remove a shape element from the canvas together with its animation host (a
 * reshape replaces the element; an empty host must not stay behind).
 */
export declare function removeWithAnimationHost(element: any): void;
/**
 * The element's screen matrix at rest: what it would be with no node animation
 * running (an animation's frame moves the drawn shape, never the note). Readers
 * that place things from a note (connector ends, the sibling and its preview)
 * use this so a note that is mid-animation, or whose entrance is still
 * playing, is measured where it stands.
 */
export declare function restingScreenCTM(el: SVGGraphicsElement | null | undefined): DOMMatrix | null;
export declare function getAvailableAnimations(): Record<string, AnimationDef>;
export declare function installAnimationStyles(element: any): void;
export declare function applyAnimation(element: any, name: string): boolean;
export declare function removeAnimations(element: any): void;
