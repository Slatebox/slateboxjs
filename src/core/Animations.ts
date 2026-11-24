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
 * bounds. Animating that <svg> goes wrong two ways: WebKit ignores CSS
 * transforms on a nested <svg> (nothing moves), and Chromium and Firefox take
 * its fill-box in viewBox units, so the pivot sits wherever the path's numbers
 * are (thousands of pixels away for a path stored in canvas coordinates; off
 * centre for a resized note or a named shape). The animation therefore runs on
 * the outline path inside it, whose own box is exactly the shape in every
 * browser; the class stays on the shape element, and the <svg> stops clipping
 * so the outline can move past its box.
 */
const nestedTarget = "svg.sb-node-animation>path[data-node-background-path]";
const nestedBaseCss =
  `svg.sb-node-animation{overflow:visible}` +
  `${nestedTarget}{transform-box:fill-box;transform-origin:center}`;

/** Each animation's rule, repeated for the outline path of a nested-<svg> shape. */
function cssFor(name: string, def: AnimationDef): string {
  const cls = `.${animationClass(name)}`;
  const match = def.css.match(/^\.[\w-]+\{([^}]*)\}([\s\S]*)$/);
  if (!match) return def.css;
  const [, declarations, rest] = match;
  return (
    `${cls}{${declarations}}` +
    `svg${cls}{animation:none}` +
    `svg${cls}>path[data-node-background-path]{${declarations}}` +
    rest
  );
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
    baseCss + nestedBaseCss + Object.entries(animationDefs).map(([name, def]) => cssFor(name, def)).join("");
}

export function applyAnimation(element: any, name: string): boolean {
  if (!element || !animationDefs[name]) return false;
  installAnimationStyles(element);
  removeAnimations(element);
  const dom = element.node as SVGElement | undefined;
  // Restart finite animations when the same menu item is chosen again.
  if (dom) {
    void (dom as SVGGraphicsElement).getBBox?.();
    dom.classList.add("sb-node-animation", animationClass(name));
  }
  return true;
}

export function removeAnimations(element: any): void {
  const dom = element?.node as SVGElement | undefined;
  if (!dom) return;
  for (const name of Object.keys(animationDefs)) dom.classList.remove(animationClass(name));
  dom.classList.remove("sb-node-animation");
}
