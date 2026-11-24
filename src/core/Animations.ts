/** SVG-safe node animations exposed through the v1-compatible filter catalog. */

export interface AnimationDef {
  id: string;
  types: Array<"text" | "vect">;
  display: string;
  description: string;
  isInfinite?: boolean;
  css: string;
}

const once = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both";

const animationDefs: Record<string, AnimationDef> = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${once}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`,
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${once}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`,
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${once}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`,
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${once}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`,
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${once}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`,
  },
  impactSlide: {
    id: "sb-impact-slide",
    types: ["text", "vect"],
    display: "Impact slide",
    description: "Fast slide with a firm landing",
    css: `.sb-animation-impactSlide{animation:sb-impact-slide .6s cubic-bezier(.18,.89,.32,1.28) both}@keyframes sb-impact-slide{0%{opacity:0;transform:translateX(-200%) scale(2) skew(-25deg)}45%{opacity:1;transform:translateX(8%) scale(1.15) skew(8deg)}100%{opacity:1;transform:translateX(0) scale(1) skew(0)}}`,
  },
  powerSmash: {
    id: "sb-power-smash",
    types: ["text", "vect"],
    display: "Power smash",
    description: "Dramatic drop with a spring finish",
    css: `.sb-animation-powerSmash{animation:sb-power-smash .6s cubic-bezier(.68,-.6,.32,1.6) both}@keyframes sb-power-smash{0%{opacity:0;transform:translateY(-150%) scale(.2)}25%{opacity:1;transform:translateY(0) scale(1.5)}55%{transform:scale(.8) rotate(-3deg)}100%{opacity:1;transform:scale(1) rotate(0)}}`,
  },
  torqueWarp: {
    id: "sb-torque-warp",
    types: ["text", "vect"],
    display: "Torque warp",
    description: "Elastic horizontal twist",
    css: `.sb-animation-torqueWarp{animation:sb-torque-warp .6s cubic-bezier(.7,-.3,.1,1.3) both}@keyframes sb-torque-warp{0%{opacity:0;transform:translateX(-100%) scaleX(.1) skew(45deg)}45%{opacity:1;transform:translateX(10%) scaleX(1.3) skew(-12deg)}100%{opacity:1;transform:translateX(0) scaleX(1) skew(0)}}`,
  },
  unroll: {
    id: "sb-unroll",
    types: ["text", "vect"],
    display: "Unroll",
    description: "Unfurls from the top",
    css: `.sb-animation-unroll{transform-origin:top;animation:sb-unroll .6s cubic-bezier(.33,1,.68,1) both}@keyframes sb-unroll{0%{opacity:0;transform:rotateX(-180deg) scaleY(.1)}60%{opacity:.8;transform:rotateX(-35deg) scaleY(.8)}100%{opacity:1;transform:rotateX(0) scaleY(1)}}`,
  },
  smoke: {
    id: "sb-smoke",
    types: ["text", "vect"],
    display: "Smoke",
    description: "Soft blurred emergence",
    css: `.sb-animation-smoke{animation:sb-smoke ${once}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`,
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${once}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`,
  },
  flux: {
    id: "sb-flux",
    types: ["text", "vect"],
    display: "Flux",
    description: "Spinning elastic entrance",
    css: `.sb-animation-flux{animation:sb-flux .6s cubic-bezier(.68,-.6,.32,1.6) both}@keyframes sb-flux{0%{opacity:0;transform:scale(.1) rotate(180deg)}55%{opacity:.7;transform:scale(1.3) rotate(-25deg)}100%{opacity:1;transform:scale(1) rotate(0)}}`,
  },
  springy: {
    id: "sb-springy",
    types: ["text", "vect"],
    display: "Springy",
    description: "Bouncy diagonal entrance",
    css: `.sb-animation-springy{animation:sb-springy .7s cubic-bezier(.37,0,.63,1) both}@keyframes sb-springy{0%{opacity:0;transform:scale(1.8) translate(80px,-80px)}35%{opacity:.5;transform:scale(.8) translate(-20px,20px)}70%{opacity:.8;transform:scale(1.1) translate(6px,-6px)}100%{opacity:1;transform:scale(1) translate(0,0)}}`,
  },
  breathe: {
    id: "sb-breathe-slow",
    types: ["vect"],
    display: "Breathe",
    description: "Subtle continuous breathing",
    isInfinite: true,
    css: `.sb-animation-breathe{animation:sb-breathe 4s ease-in-out infinite}@keyframes sb-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}`,
  },
  pulse: {
    id: "sb-pulse",
    types: ["vect"],
    display: "Pulse",
    description: "Strong continuous pulse",
    isInfinite: true,
    css: `.sb-animation-pulse{animation:sb-pulse .7s ease-in-out infinite}@keyframes sb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}`,
  },
  rotate: {
    id: "sb-rotate",
    types: ["vect"],
    display: "Rotate",
    description: "Smooth continuous rotation",
    isInfinite: true,
    css: `.sb-animation-rotate{animation:sb-rotate 8s linear infinite}@keyframes sb-rotate{to{transform:rotate(360deg)}}`,
  },
};

const baseCss = `.sb-node-animation{transform-box:fill-box;transform-origin:center}`;

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
export const ANIMATION_HOST_ATTR = "data-sb-animation-host";
const SVG_NS = "http://www.w3.org/2000/svg";

/** Each animation's rule, switched off on a nested <svg> (its host plays it). */
function cssFor(name: string, def: AnimationDef): string {
  return def.css + `svg.${animationClass(name)}{animation:none}`;
}

function isNestedSvg(dom: Element | undefined | null): dom is SVGSVGElement {
  return !!dom && dom.tagName?.toLowerCase() === "svg" && !!(dom as SVGSVGElement).ownerSVGElement;
}

/** The <g> an animated nested <svg> sits in, if any. */
export function animationHostOf(element: any): SVGGElement | null {
  const dom = (element?.node ?? element) as Element | undefined;
  const parent = dom?.parentNode as Element | null | undefined;
  return parent && parent.nodeType === 1 && parent.hasAttribute?.(ANIMATION_HOST_ATTR) ? (parent as SVGGElement) : null;
}

function ensureHost(dom: SVGSVGElement): SVGGElement {
  const existing = animationHostOf(dom);
  if (existing) return existing;
  const host = dom.ownerDocument.createElementNS(SVG_NS, "g") as SVGGElement;
  host.setAttribute(ANIMATION_HOST_ATTR, "1");
  dom.parentNode!.insertBefore(host, dom);
  host.appendChild(dom);
  return host;
}

/** Put the shape element back where its host was and drop the host. */
function releaseHost(dom: Element): void {
  const host = animationHostOf(dom);
  if (!host || !host.parentNode) return;
  host.parentNode.insertBefore(dom, host);
  host.remove();
}

/**
 * Remove a shape element from the canvas together with its animation host (a
 * reshape replaces the element; an empty host must not stay behind).
 */
export function removeWithAnimationHost(element: any): void {
  const host = animationHostOf(element);
  element?.remove?.();
  host?.remove();
}

/**
 * The element's screen matrix at rest: what it would be with no node animation
 * running (an animation's frame moves the drawn shape, never the note). Readers
 * that place things from a note (connector ends, the sibling and its preview)
 * use this so a note that is mid-animation, or whose entrance is still
 * playing, is measured where it stands.
 */
export function restingScreenCTM(el: SVGGraphicsElement | null | undefined): DOMMatrix | null {
  if (!el || typeof el.getScreenCTM !== "function") return null;
  const ctm = el.getScreenCTM();
  if (!ctm) return null;
  try {
    // A nested <svg> animated through its host: undo the host's frame.
    let node: Element | null = el;
    while (node && node.nodeType === 1) {
      if ((node as Element).hasAttribute?.(ANIMATION_HOST_ATTR)) {
        const host = node as SVGGElement;
        const hostCtm = host.getScreenCTM();
        const parentCtm = (host.parentNode as SVGGraphicsElement | null)?.getScreenCTM?.();
        if (!hostCtm || !parentCtm) return ctm;
        return parentCtm.multiply(hostCtm.inverse()).multiply(ctm);
      }
      if (node.tagName?.toLowerCase() === "svg" && !(node as SVGSVGElement).ownerSVGElement) break;
      node = node.parentNode as Element | null;
    }
    // An element animated directly (a rectangle or circle note): its own
    // transform attribute is the resting one, the animation only overrides it.
    if (el.classList?.contains("sb-node-animation") && !isNestedSvg(el)) {
      const parentCtm = (el.parentNode as SVGGraphicsElement | null)?.getScreenCTM?.();
      if (!parentCtm) return ctm;
      const own = el.transform?.baseVal?.consolidate?.()?.matrix;
      return own ? parentCtm.multiply(DOMMatrix.fromMatrix(own as any)) : parentCtm;
    }
  } catch {
    /* fall back to the drawn matrix */
  }
  return ctm;
}

export function getAvailableAnimations(): Record<string, AnimationDef> {
  return { ...animationDefs };
}

function animationClass(name: string): string {
  return `sb-animation-${name}`;
}

export function installAnimationStyles(element: any): void {
  const root = element?.root?.();
  const defs = root?.defs?.();
  if (!defs || defs.findOne?.("#sb-node-animation-styles")) return;
  const style = defs.element("style").id("sb-node-animation-styles");
  style.attr("type", "text/css");
  style.node.textContent =
    baseCss + Object.entries(animationDefs).map(([name, def]) => cssFor(name, def)).join("");
}

export function applyAnimation(element: any, name: string): boolean {
  if (!element || !animationDefs[name]) return false;
  installAnimationStyles(element);
  removeAnimations(element);
  const dom = element.node as SVGElement | undefined;
  // Restart finite animations when the same menu item is chosen again.
  if (dom) {
    const classes = ["sb-node-animation", animationClass(name)];
    if (isNestedSvg(dom) && dom.parentNode) {
      const host = ensureHost(dom);
      void host.getBBox?.();
      host.classList.add(...classes);
    } else {
      void (dom as SVGGraphicsElement).getBBox?.();
    }
    dom.classList.add(...classes);
  }
  return true;
}

export function removeAnimations(element: any): void {
  const dom = element?.node as SVGElement | undefined;
  if (!dom) return;
  for (const name of Object.keys(animationDefs)) dom.classList.remove(animationClass(name));
  dom.classList.remove("sb-node-animation");
  releaseHost(dom);
}
