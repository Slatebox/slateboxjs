import { SHAPE_LIMITS as Ae, prepareShape as We, storeCustomShape as Rt } from "./shapes.mjs";
import { N as zt } from "./NoteDefaults-BjVBa8YH.mjs";
const B = /* @__PURE__ */ new Map();
B.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
B.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
B.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
B.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
B.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
B.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
B.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
B.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
B.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
B.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
B.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
B.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
B.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
B.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
B.set("stickynote", {
  path: "M1 1l18 0.1l-0.1 17.8s-15.5 0.4-17.6-1c-0.4-2.1-0.3-16.9-0.3-16.9z",
  defaultWidth: 108,
  defaultHeight: 108,
  viewBox: "1 1 18 18"
});
function Yt() {
  return Array.from(B.keys());
}
const re = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", Dt = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${re}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${re}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${re}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${re}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${re}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  impactSlide: {
    id: "sb-impact-slide",
    types: ["text", "vect"],
    display: "Impact slide",
    description: "Fast slide with a firm landing",
    css: ".sb-animation-impactSlide{animation:sb-impact-slide .6s cubic-bezier(.18,.89,.32,1.28) both}@keyframes sb-impact-slide{0%{opacity:0;transform:translateX(-200%) scale(2) skew(-25deg)}45%{opacity:1;transform:translateX(8%) scale(1.15) skew(8deg)}100%{opacity:1;transform:translateX(0) scale(1) skew(0)}}"
  },
  powerSmash: {
    id: "sb-power-smash",
    types: ["text", "vect"],
    display: "Power smash",
    description: "Dramatic drop with a spring finish",
    css: ".sb-animation-powerSmash{animation:sb-power-smash .6s cubic-bezier(.68,-.6,.32,1.6) both}@keyframes sb-power-smash{0%{opacity:0;transform:translateY(-150%) scale(.2)}25%{opacity:1;transform:translateY(0) scale(1.5)}55%{transform:scale(.8) rotate(-3deg)}100%{opacity:1;transform:scale(1) rotate(0)}}"
  },
  torqueWarp: {
    id: "sb-torque-warp",
    types: ["text", "vect"],
    display: "Torque warp",
    description: "Elastic horizontal twist",
    css: ".sb-animation-torqueWarp{animation:sb-torque-warp .6s cubic-bezier(.7,-.3,.1,1.3) both}@keyframes sb-torque-warp{0%{opacity:0;transform:translateX(-100%) scaleX(.1) skew(45deg)}45%{opacity:1;transform:translateX(10%) scaleX(1.3) skew(-12deg)}100%{opacity:1;transform:translateX(0) scaleX(1) skew(0)}}"
  },
  unroll: {
    id: "sb-unroll",
    types: ["text", "vect"],
    display: "Unroll",
    description: "Unfurls from the top",
    css: ".sb-animation-unroll{transform-origin:top;animation:sb-unroll .6s cubic-bezier(.33,1,.68,1) both}@keyframes sb-unroll{0%{opacity:0;transform:rotateX(-180deg) scaleY(.1)}60%{opacity:.8;transform:rotateX(-35deg) scaleY(.8)}100%{opacity:1;transform:rotateX(0) scaleY(1)}}"
  },
  smoke: {
    id: "sb-smoke",
    types: ["text", "vect"],
    display: "Smoke",
    description: "Soft blurred emergence",
    css: `.sb-animation-smoke{animation:sb-smoke ${re}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${re}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
  },
  flux: {
    id: "sb-flux",
    types: ["text", "vect"],
    display: "Flux",
    description: "Spinning elastic entrance",
    css: ".sb-animation-flux{animation:sb-flux .6s cubic-bezier(.68,-.6,.32,1.6) both}@keyframes sb-flux{0%{opacity:0;transform:scale(.1) rotate(180deg)}55%{opacity:.7;transform:scale(1.3) rotate(-25deg)}100%{opacity:1;transform:scale(1) rotate(0)}}"
  },
  springy: {
    id: "sb-springy",
    types: ["text", "vect"],
    display: "Springy",
    description: "Bouncy diagonal entrance",
    css: ".sb-animation-springy{animation:sb-springy .7s cubic-bezier(.37,0,.63,1) both}@keyframes sb-springy{0%{opacity:0;transform:scale(1.8) translate(80px,-80px)}35%{opacity:.5;transform:scale(.8) translate(-20px,20px)}70%{opacity:.8;transform:scale(1.1) translate(6px,-6px)}100%{opacity:1;transform:scale(1) translate(0,0)}}"
  },
  breathe: {
    id: "sb-breathe-slow",
    types: ["vect"],
    display: "Breathe",
    description: "Subtle continuous breathing",
    isInfinite: !0,
    css: ".sb-animation-breathe{animation:sb-breathe 4s ease-in-out infinite}@keyframes sb-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}"
  },
  pulse: {
    id: "sb-pulse",
    types: ["vect"],
    display: "Pulse",
    description: "Strong continuous pulse",
    isInfinite: !0,
    css: ".sb-animation-pulse{animation:sb-pulse .7s ease-in-out infinite}@keyframes sb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}"
  },
  rotate: {
    id: "sb-rotate",
    types: ["vect"],
    display: "Rotate",
    description: "Smooth continuous rotation",
    isInfinite: !0,
    css: ".sb-animation-rotate{animation:sb-rotate 8s linear infinite}@keyframes sb-rotate{to{transform:rotate(360deg)}}"
  }
};
function Bt() {
  return { ...Dt };
}
function R(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const Ht = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, Xt = /^https?:\/\/[^\s]+$/i, ft = 2e3, Wt = /^[A-Za-z0-9_-]{1,64}$/;
function ke(e, t) {
  if (typeof t != "string") return;
  const n = t.trim().toLowerCase();
  return e.find((o) => o.toLowerCase() === n);
}
function z(e, t, n) {
  switch (e.type) {
    case "string":
      return t === null && e.nullable ? null : typeof t != "string" ? `${n} must be a string.` : t.length > e.maxLength ? `${n} must be at most ${e.maxLength} characters.` : e.minLength && t.trim().length < e.minLength ? `${n} must not be empty.` : null;
    case "number":
      return typeof t != "number" || !Number.isFinite(t) || t < e.min || t > e.max ? `${n} must be a number from ${e.min} to ${e.max}.` : null;
    case "boolean":
      return typeof t == "boolean" ? null : `${n} must be true or false.`;
    case "enum":
      return t === null && e.nullable || (e.caseless ? ke(e.values, t) : e.values.find((s) => s === t)) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")}.`;
    case "shape": {
      if (t && typeof t == "object" && !Array.isArray(t)) {
        const o = We(t);
        return o.ok ? null : `${n} is not a usable custom shape: ${o.message}`;
      }
      return ke(e.values, t) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")} (or a custom shape {name, d, fillRule}).`;
    }
    case "list":
      return Array.isArray(t) && t.every((o) => typeof o == "string" && e.values.includes(o)) && new Set(t).size === t.length ? null : `${n} must be a list of different values from: ${e.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof t == "string" && Ht.test(t.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return R(t) && Object.keys(t).every((o) => o === "x" || o === "y") && [t.x, t.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return R(t) ? null : `${n} must be an object.`;
    case "url":
      return t === null && e.nullable || typeof t == "string" && t.length <= ft && Xt.test(t.trim()) ? null : `${n} must be an http or https address${e.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return t === null && e.nullable || typeof t == "string" && Wt.test(t) ? null : `${n} must be 1 to 64 letters, digits, _ or -${e.nullable ? ", or null" : ""}.`;
  }
}
function V(e) {
  switch (e.type) {
    case "string":
      return { type: e.nullable ? ["string", "null"] : "string", maxLength: e.maxLength, ...e.minLength ? { minLength: e.minLength } : {} };
    case "number":
      return { type: "number", minimum: e.min, maximum: e.max };
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return e.nullable ? { type: ["string", "null"], enum: [...e.values, null] } : { type: "string", enum: [...e.values] };
    case "shape":
      return { oneOf: [{ type: "string", enum: [...e.values] }, Ft()] };
    case "list":
      return { type: "array", items: { type: "string", enum: [...e.values] } };
    case "color":
      return { type: "string", maxLength: 64, description: "A CSS colour, such as #336699." };
    case "point":
      return {
        type: "object",
        additionalProperties: !1,
        required: ["x", "y"],
        properties: { x: { type: "number" }, y: { type: "number" } }
      };
    case "object":
      return { type: "object" };
    case "url":
      return {
        type: e.nullable ? ["string", "null"] : "string",
        maxLength: ft,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: e.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
function Ft() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["name", "d"],
    description: "A custom shape: one SVG path (several closed parts and holes allowed, no markup), as shapes.generate or shapes.list return it.",
    properties: {
      name: { type: "string", minLength: 1, maxLength: Ae.maxName },
      d: { type: "string", minLength: 1, maxLength: Ae.maxInput, description: "Path data: commands and plain numbers only." },
      fillRule: { type: "string", enum: ["nonzero", "evenodd"], description: "evenodd when the shape has holes." },
      ref: {
        type: "object",
        additionalProperties: !1,
        required: ["id"],
        description: "The shape library entry it came from.",
        properties: { id: { type: "string", pattern: "^[A-Za-z0-9_-]{1,64}$" }, name: { type: "string", maxLength: Ae.maxName } }
      }
    }
  };
}
function qt(e) {
  return Array.isArray(e.oneOf) && e.oneOf[0]?.type === "string" && e.oneOf[0]?.enum ? { ...e.oneOf[0], ...Object.fromEntries(Object.entries(e).filter(([t]) => t !== "oneOf")) } : e;
}
const q = (e) => ({
  store: (t, n) => {
    t[e] = n;
  },
  read: (t) => t[e]
}), Ut = ["solid", "dashed", "dotted", "combo"], Gt = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), Kt = ["front", "back"], Zt = ["left", "middle", "right"], Vt = ["top", "middle", "bottom"], De = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), et = Object.keys(De), C = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...q("text") },
  shape: {
    spec: (e) => ({ type: "shape", values: e.shapes }),
    description: "A shape registered with the engine (custom shapes read back as custom:<name>).",
    store: (e, t, n) => {
      if (t && typeof t == "object") {
        const s = We(t);
        s.ok && Rt(e, s.shape);
        return;
      }
      const o = ke(n.shapes, t);
      e.shape = o, e.vectorPath = o, e.shapeHint = o, delete e.fillRule, delete e.textBox, delete e.shapeRef;
    },
    // A custom outline reads as its name, never its (long) path.
    // A named shape (or a shapeHint like "rect") reads as itself, even when
    // the note also stores its drawn path.
    read: (e) => {
      const t = String(e.shape || e.shapeHint || e.vectorPath || "rectangle");
      if (t === "custom" || /^[Mm]/.test(t.trim())) {
        const n = e.shapeRef?.name;
        return typeof n == "string" && n ? `custom:${n}` : "custom";
      }
      return t;
    }
  },
  x: {
    spec: () => ({ type: "number", min: -1e6, max: 1e6 }),
    description: "Left edge on the canvas.",
    store: (e, t) => {
      e.xPos = t, delete e.x;
    },
    read: (e) => Number(e.xPos ?? e.x ?? 0)
  },
  y: {
    spec: () => ({ type: "number", min: -1e6, max: 1e6 }),
    description: "Top edge on the canvas.",
    store: (e, t) => {
      e.yPos = t, delete e.y;
    },
    read: (e) => Number(e.yPos ?? e.y ?? 0)
  },
  width: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Width in canvas units.", ...q("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Height in canvas units.", ...q("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (e, t) => {
      e.rotate = { ...e.rotate || {}, rotationAngle: t }, delete e.rotationAngle;
    },
    read: (e) => Number(e.rotate?.rotationAngle ?? 0)
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ...q("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (e, t) => {
      e.foregroundColor = t, e.fontColor = t;
    },
    read: (e) => e.fontColor ?? e.foregroundColor
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ...q("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ...q("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ...q("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: Ut }),
    description: "Border line style.",
    ...q("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...q("opacity") },
  fontFamily: {
    spec: (e) => ({ type: "enum", values: e.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (e, t, n) => {
      e.fontFamily = ke(n.fonts, t);
    },
    read: (e) => e.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...q("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: Zt }), description: "Horizontal text alignment.", ...q("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: Vt }), description: "Vertical text alignment.", ...q("textYAlign") },
  animation: {
    spec: (e) => ({ type: "enum", values: e.animations, nullable: !0 }),
    description: "An entrance or looping animation, or null for none.",
    store: (e, t) => {
      e.animations = { ...e.animations || {}, vect: t ?? null };
    },
    read: (e) => e.animations?.vect ?? null
  },
  textOpacity: {
    spec: () => ({ type: "number", min: 0, max: 1 }),
    description: "Text opacity from 0 to 1.",
    store: (e, t) => {
      e.textOpacity = t;
    },
    // A note with none stored draws its text fully opaque (Node's default).
    read: (e) => e.textOpacity ?? 1
  },
  link: {
    spec: () => ({ type: "url", nullable: !0 }),
    description: "A web address the note opens (http or https), or null to remove it.",
    store: (e, t) => {
      t === null ? delete e.link : e.link = { show: !0, type: "url", data: `${t}`.trim() };
    },
    read: (e) => e.link?.show && e.link.type === "url" ? e.link.data : null
  },
  effect: {
    spec: (e) => ({ type: "enum", values: e.effects, nullable: !0 }),
    description: "A note effect such as dropShadow or postItNote, or null for none.",
    store: (e, t) => {
      e.filters = { ...e.filters || {}, vect: t ?? null };
    },
    read: (e) => e.filters?.vect ?? null
  },
  groupId: {
    spec: () => ({ type: "id", nullable: !0 }),
    description: "Notes sharing a groupId select and move as one group; null takes the note out of its group.",
    store: (e, t) => {
      t === null ? delete e.groupId : e.groupId = t;
    },
    read: (e) => e.groupId ?? null
  },
  templateCategory: {
    spec: () => ({ type: "string", minLength: 1, maxLength: 200, nullable: !0 }),
    description: "Only when asked to make a note a template's category heading: names the bucket the template's AI conversation files notes under, and presentations skip the note. Not for grouping or labelling notes by theme (use groupId or text). null makes it an ordinary note.",
    store: (e, t) => {
      t === null ? (e.isCategory = !1, delete e.categoryName) : (e.isCategory = !0, e.categoryName = `${t}`.trim());
    },
    // Read the way the template conversation reads it: a category has a name.
    read: (e) => e.isCategory === !0 && e.categoryName ? e.categoryName : null
  },
  hiddenControls: {
    spec: () => ({ type: "list", values: et }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (e, t) => {
      for (const [n, o] of Object.entries(De)) e[o] = !t.includes(n);
    },
    read: (e) => et.filter((t) => e[De[t]] === !1)
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (e, t) => {
      e.isLocked = t;
    },
    read: (e) => e.isLocked === !0
  }
}, be = {
  order: {
    spec: { type: "enum", values: Kt },
    description: "Bring the note to the front or send it to the back."
  }
}, Jt = [...Object.keys(C), ...Object.keys(be)], Qt = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Fe = Object.keys(C).filter((e) => !Qt.has(e)), pe = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Oe = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style", "media"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, mt = ["left", "right", "above", "below", "center"], gt = ["row", "column", "grid"], en = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], tn = ["distribute-horizontal", "distribute-vertical"], qe = ["row", "column", "grid", "circle", ...en, ...tn, "tidy", "tree"], Ue = ["text", "sticky"], nn = 75, on = Object.freeze({ x: 20, y: 20 }), sn = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), tt = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, nt = 200, rn = Object.freeze([
  "Manrope",
  "Arial",
  "Times New Roman",
  "Georgia",
  "Courier Prime",
  "Indie Flower",
  "Abril Fatface",
  "Bangers",
  "Caveat",
  "EB Garamond",
  "Fredoka One",
  "Graduate",
  "Gravitas One",
  "IBM Plex Mono",
  "IBM Plex Sans",
  "IBM Plex Serif",
  "Lemon",
  "Lora",
  "Nixie One",
  "Noto Sans",
  "Open Sans",
  "Poppins",
  "PT Sans",
  "PT Sans Narrow",
  "PT Serif",
  "Permanent Marker",
  "Rammetto One",
  "Roboto",
  "Roboto Condensed",
  "Roboto Mono",
  "Roboto Slab",
  "Rubik",
  "Titan One",
  "Urbanist",
  // The presentation styles' faces (a slate that wears a style draws its notes in them).
  "Anton",
  "Space Grotesk",
  "Fraunces",
  "Inter"
]);
function Ie(e = {}) {
  return {
    shapes: [...e.shapes ?? Yt()],
    fonts: [...e.fonts ?? rn],
    animations: Object.keys(Bt()),
    effects: [...Gt]
  };
}
function Ee(e = {}) {
  return { ...sn, ...e.limits || {} };
}
class X extends Error {
  constructor(t, n, o, s) {
    super(o), this.name = "OperationPlanError", this.code = t, this.status = n, s && (this.details = s);
  }
}
const an = ["bezier", "orthogonal", "straight", "linear", "curved"], cn = ["cubic", "quadratic"], dn = ["solid", "dashed", "dotted"], ln = ["follow", "pinned"], ot = ["follow", "pinned", "top", "right", "bottom", "left"], ie = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: an }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: cn }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  lineDash: { spec: { type: "enum", values: dn }, description: "Solid, dashed or dotted line." },
  labelPosition: {
    spec: { type: "number", min: 0.05, max: 0.95 },
    description: "Where the label sits along the line, from near its start (0.05) to near its end (0.95); the middle (0.5) when unset."
  },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: ln },
    description: "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge that faces the line's other end, where a following end sits)."
  },
  fromEnd: {
    spec: { type: "enum", values: ot },
    description: "The starting end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side."
  },
  toEnd: {
    spec: { type: "enum", values: ot },
    description: "The far end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side. Not for a free end."
  },
  toNote: {
    spec: { type: "string", minLength: 1, maxLength: 200 },
    description: "Reconnect the far end to this note (its id). A free end is attached to it. The connector keeps its id."
  },
  fromNote: {
    spec: { type: "string", minLength: 1, maxLength: 200 },
    description: "Reconnect the starting end to this note (its id); the connector then belongs to that note and keeps its id."
  },
  toPoint: {
    spec: { type: "point" },
    description: "Leave the far end free at this point on the canvas (a saved point that stays put). Detaches it from its note if it is on one; moves it if it is already free.",
    field: "targetPoint"
  },
  fromPoint: {
    spec: { type: "point" },
    description: "Leave the starting end free at this point. The connector then belongs to the note at its far end, its arrows kept as drawn. A connector keeps at least one end on a note."
  }
}, Ge = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"], Ke = Object.keys(ie).filter((e) => !Ge.includes(e)), Te = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, ge = "__free_", yt = ["linear", "radial"], bt = ["horizontal", "vertical", "diagonal"], xe = (e) => ({
  store: (t, n) => {
    t.options[e] = n;
  }
}), st = (e) => ({
  store: (t, n) => {
    t.options.viewPort = { ...t.options.viewPort || {}, [e]: n };
  }
}), he = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...xe("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...xe("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (e, t) => {
      const n = { ...e.options.containerStyle || {}, ...mn(t) };
      delete n.backgroundImage, delete n.backgroundEffect, e.options.containerStyle = n;
    }
  },
  style: {
    spec: { type: "object" },
    description: "The style the slate wears, as a record: {id, overrides?: {bg?, palette?, fonts?: {display?, body?}}, v?}, or null to take it off. The look itself lives in the slate's background, its notes and its style art (real notes the app writes with the style); sent alone, the app wears the whole style.",
    store: (e, t) => {
      t === null ? delete e.options.style : e.options.style = t;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: the slate's style colors notes by their depth in the connected tree.",
    ...xe("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...xe("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...st("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...st("snapToObjects") },
  defaultLineColor: {
    spec: { type: "color" },
    description: "The slate's line colour: every connector and every note's line colour takes it, as the Colours panel does.",
    store: (e, t) => {
      e.options.defaultLineColor = t;
      for (const n of e.nodes) {
        n.options.lineColor = t;
        for (const o of n.relationships.associations) o.lineColor = t;
      }
    }
  }
};
function hn(e, t) {
  if (!R(e)) return [`${t} must be an object {color, gradient?}.`];
  const n = [];
  for (const s of Object.keys(e))
    s !== "color" && s !== "gradient" && n.push(`${t} has an unknown field: ${s}.`);
  const o = z({ type: "color" }, e.color, `${t}.color`);
  if (o && n.push(o), e.gradient !== void 0) {
    const s = e.gradient;
    if (!R(s)) return [...n, `${t}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(s))
      ["type", "colors", "direction"].includes(a) || n.push(`${t}.gradient has an unknown field: ${a}.`);
    const i = z({ type: "enum", values: yt }, s.type, `${t}.gradient.type`);
    if (i && n.push(i), s.direction !== void 0) {
      const a = z({ type: "enum", values: bt }, s.direction, `${t}.gradient.direction`);
      a && n.push(a);
    }
    !Array.isArray(s.colors) || s.colors.length < 2 || s.colors.length > 8 ? n.push(`${t}.gradient.colors must list 2 to 8 colours.`) : s.colors.forEach((a, l) => {
      const m = z({ type: "color" }, a, `${t}.gradient.colors[${l}]`);
      m && n.push(m);
    });
  }
  return n;
}
const un = /^[a-z][a-z-]{0,39}$/, pn = ["bg", "palette", "fonts"];
function fn(e, t, n) {
  if (e === null) return [];
  if (!R(e)) return [`${t} must be an object {id, overrides?, v?} or null.`];
  const o = [];
  for (const i of Object.keys(e))
    ["id", "overrides", "v"].includes(i) || o.push(`${t} has an unknown field: ${i}.`);
  (typeof e.id != "string" || !un.test(e.id)) && o.push(`${t}.id must be a style name (lowercase letters and hyphens, at most 40).`), e.v !== void 0 && (typeof e.v != "number" || !Number.isInteger(e.v) || e.v < 1 || e.v > 1e3) && o.push(`${t}.v must be a whole number from 1 to 1000.`);
  const s = e.overrides;
  if (s === void 0) return o;
  if (!R(s)) return [...o, `${t}.overrides must be an object.`];
  for (const i of Object.keys(s))
    pn.includes(i) || o.push(`${t}.overrides has an unknown field: ${i}.`);
  if (s.bg !== void 0) {
    const i = z({ type: "color" }, s.bg, `${t}.overrides.bg`);
    i && o.push(i);
  }
  if (s.palette !== void 0 && (!Array.isArray(s.palette) || s.palette.length < 1 || s.palette.length > 12 ? o.push(`${t}.overrides.palette must list 1 to 12 colors.`) : s.palette.forEach((i, a) => {
    const l = typeof i == "string" ? i.split("-") : [i];
    l.length > 2 && o.push(`${t}.overrides.palette[${a}] must be a color or a "from-to" pair.`);
    for (const m of l) {
      const b = z({ type: "color" }, m, `${t}.overrides.palette[${a}]`);
      if (b) {
        o.push(b);
        break;
      }
    }
  })), s.fonts !== void 0)
    if (!R(s.fonts)) o.push(`${t}.overrides.fonts must be an object {display?, body?}.`);
    else
      for (const [i, a] of Object.entries(s.fonts))
        i !== "display" && i !== "body" ? o.push(`${t}.overrides.fonts has an unknown field: ${i}.`) : (typeof a != "string" || !n.some((l) => l.toLowerCase() === a.toLowerCase())) && o.push(`${t}.overrides.fonts.${i} must be a font this instance offers.`);
  return o;
}
function mn(e) {
  return {
    backgroundColor: e.color,
    backgroundColorAsGradient: !!e.gradient,
    backgroundGradientType: e.gradient?.type ?? "linear",
    backgroundGradientColors: e.gradient?.colors ?? [],
    backgroundGradientStrategy: e.gradient?.direction ?? "horizontal"
  };
}
function wt() {
  return {
    type: ["object", "null"],
    additionalProperties: !1,
    required: ["id"],
    properties: {
      id: { type: "string", pattern: "^[a-z][a-z-]{0,39}$" },
      v: { type: "integer", minimum: 1, maximum: 1e3 },
      overrides: {
        type: "object",
        additionalProperties: !1,
        properties: {
          bg: V({ type: "color" }),
          palette: { type: "array", minItems: 1, maxItems: 12, items: { type: "string", maxLength: 64 } },
          fonts: { type: "object", additionalProperties: !1, properties: { display: { type: "string" }, body: { type: "string" } } }
        }
      }
    }
  };
}
function xt() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["color"],
    properties: {
      color: V({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: !1,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...yt] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: V({ type: "color" }) },
          direction: { type: "string", enum: [...bt] }
        }
      }
    }
  };
}
function gn(e) {
  if (!e?.backgroundColor) return null;
  const t = e.backgroundGradientColors;
  return !e.backgroundColorAsGradient || !Array.isArray(t) || t.length < 2 ? { color: e.backgroundColor } : {
    color: e.backgroundColor,
    gradient: {
      type: e.backgroundGradientType ?? "linear",
      colors: [...t],
      direction: e.backgroundGradientStrategy ?? "horizontal"
    }
  };
}
const yn = ["ids", "text", "match", "all", "within", "groupId"], bn = ["ids", "text", "within", "groupId"];
function de(e, t) {
  if (!R(e)) return [`${t} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const s of Object.keys(e))
    yn.includes(s) || n.push(`${t} has an unknown field: ${s}.`);
  const o = bn.filter((s) => e[s] !== void 0);
  if (o.length > 1 && n.push(`${t} must name notes one way, not by ${o.join(" and ")}.`), !o.length && e.all !== !0 && n.push(`${t} must name notes by ids, text, within, groupId or all: true.`), e.ids !== void 0 && (!Array.isArray(e.ids) || !e.ids.length || e.ids.some((s) => typeof s != "string" || !s)) && n.push(`${t}.ids must be a list of note ids.`), e.text !== void 0 && (typeof e.text != "string" || !e.text.trim()) && n.push(`${t}.text must be the text of a note.`), e.match !== void 0) {
    e.text === void 0 && n.push(`${t}.match goes with text.`);
    const s = z({ type: "enum", values: ["exact", "contains"] }, e.match, `${t}.match`);
    s && n.push(s);
  }
  if (e.all !== void 0 && e.all !== !0 && n.push(`${t}.all must be true when given.`), e.groupId !== void 0 && (typeof e.groupId != "string" || !e.groupId) && n.push(`${t}.groupId must be a group id.`), e.within !== void 0) {
    const s = e.within;
    R(s) && Object.keys(s).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof s[a] == "number" && Number.isFinite(s[a])) && s.width > 0 && s.height > 0 || n.push(`${t}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function vt() {
  return {
    type: "object",
    additionalProperties: !1,
    description: 'Name notes one way: ids, text (the whole text, ignoring case and extra spaces; match: "contains" to search), within a rectangle, groupId, or all: true. A text selector matching several notes also needs all: true.',
    properties: {
      ids: { type: "array", minItems: 1, items: { type: "string" } },
      text: { type: "string" },
      match: { type: "string", enum: ["exact", "contains"] },
      all: { type: "boolean", enum: [!0] },
      within: {
        type: "object",
        additionalProperties: !1,
        required: ["x", "y", "width", "height"],
        properties: { x: { type: "number" }, y: { type: "number" }, width: { type: "number" }, height: { type: "number" } }
      },
      groupId: { type: "string" }
    }
  };
}
const $t = ["youtube", "vimeo", "loom"], wn = Object.freeze({
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom"
}), _o = Object.freeze([
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://www.loom.com"
]), xn = Object.freeze({ width: 320, height: 180 }), G = Object.freeze({ urlLength: 2e3, titleLength: 300, authorLength: 120, startSeconds: 86400 }), kt = /^[A-Za-z0-9_-]{11}$/, Be = /^\d{1,12}$/, He = /^[0-9a-f]{6,20}$/i, _t = /^[0-9a-f]{32}$/i, vn = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]), $n = /* @__PURE__ */ new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]), kn = /* @__PURE__ */ new Set(["loom.com", "www.loom.com"]);
function Ze(e) {
  if (!e) return;
  const t = String(e).trim().toLowerCase();
  let n;
  if (/^\d+$/.test(t)) n = Number(t);
  else {
    const o = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
    if (!o || !o[0]) return;
    n = Number(o[1] || 0) * 3600 + Number(o[2] || 0) * 60 + Number(o[3] || 0);
  }
  return Number.isSafeInteger(n) && n > 0 && n <= G.startSeconds ? n : void 0;
}
function Ve(e) {
  return e.hostname.toLowerCase().replace(/\.$/, "");
}
function _n(e) {
  const t = Ve(e), n = e.pathname.split("/").filter(Boolean);
  let o;
  if (t === "youtu.be" ? o = n[0] : n[0] === "watch" ? o = e.searchParams.get("v") ?? void 0 : ["shorts", "embed", "live", "v"].includes(n[0]) && (o = n[1]), !o || !kt.test(o)) return null;
  const s = Ze(e.searchParams.get("t") ?? e.searchParams.get("start"));
  return { provider: "youtube", id: o, url: `https://www.youtube.com/watch?v=${o}`, ...s ? { start: s } : {} };
}
function Sn(e) {
  const t = Ve(e), n = e.pathname.split("/").filter(Boolean);
  let o, s;
  if (t === "player.vimeo.com") {
    if (n[0] !== "video") return null;
    o = n[1], s = e.searchParams.get("h") ?? void 0;
  } else {
    const a = n.findIndex((m) => Be.test(m));
    if (a < 0) return null;
    o = n[a];
    const l = n[a + 1];
    l && He.test(l) && (s = l);
  }
  if (!o || !Be.test(o)) return null;
  s !== void 0 && !He.test(s) && (s = void 0);
  const i = Ze((e.hash.match(/t=([0-9hms]+)/i) || [])[1]);
  return {
    provider: "vimeo",
    id: o,
    url: s ? `https://vimeo.com/${o}/${s}` : `https://vimeo.com/${o}`,
    ...s ? { hash: s } : {},
    ...i ? { start: i } : {}
  };
}
function On(e) {
  const t = e.pathname.split("/").filter(Boolean);
  if (!["share", "embed"].includes(t[0])) return null;
  const n = t[1] ? t[1].split("-").pop() : void 0;
  if (!n || !_t.test(n)) return null;
  const o = n.toLowerCase(), s = Ze(e.searchParams.get("t"));
  return { provider: "loom", id: o, url: `https://www.loom.com/share/${o}`, ...s ? { start: s } : {} };
}
function St(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t || t.length > G.urlLength || /\s/.test(t)) return null;
  let n;
  try {
    n = new URL(/^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`);
  } catch {
    return null;
  }
  if (n.protocol !== "https:" && n.protocol !== "http:" || n.username || n.password || n.port) return null;
  const o = Ve(n);
  return vn.has(o) ? _n(n) : $n.has(o) ? Sn(n) : kn.has(o) ? On(n) : null;
}
const So = (e) => St(e) !== null;
function Oo(e, { play: t = !1 } = {}) {
  const n = t ? "1" : "0";
  switch (e?.provider) {
    case "youtube": {
      if (!kt.test(e.id)) return null;
      const o = new URLSearchParams({ autoplay: n, rel: "0", playsinline: "1", modestbranding: "1" });
      return e.start && o.set("start", String(e.start)), `https://www.youtube-nocookie.com/embed/${e.id}?${o}`;
    }
    case "vimeo": {
      if (!Be.test(e.id)) return null;
      const o = new URLSearchParams({ autoplay: n, dnt: "1" });
      return e.hash && He.test(e.hash) && o.set("h", e.hash), `https://player.vimeo.com/video/${e.id}?${o}${e.start ? `#t=${e.start}s` : ""}`;
    }
    case "loom": {
      if (!_t.test(e.id)) return null;
      const o = new URLSearchParams({ autoplay: n, hide_owner: "true", hideEmbedTopBar: "true" });
      return e.start && o.set("t", String(e.start)), `https://www.loom.com/embed/${e.id}?${o}`;
    }
    default:
      return null;
  }
}
const In = /^(?:https:\/\/[^\s"'<>]+|\/sbimages\/media-posters(?:\/|%2F)(?!.*(?:\.\.|%2e%2e))[^\s"'<>\\]*)$/i, it = (e, t) => typeof e != "string" ? void 0 : e.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, t) || void 0, rt = (e) => typeof e == "number" && Number.isFinite(e) && e > 0 && e <= 1e4 ? Math.round(e) : void 0;
function Ot(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return { ok: !1, message: "must be an object with the video's url." };
  const t = e, n = ["url", "provider", "id", "hash", "start", "title", "author", "poster", "posterWidth", "posterHeight"], o = Object.keys(t).filter((p) => !n.includes(p));
  if (o.length) return { ok: !1, message: `has fields it does not take: ${o.join(", ")}.` };
  const s = St(t.url);
  if (!s) return { ok: !1, message: "url must be a YouTube, Vimeo or Loom video address." };
  if (t.provider !== void 0 && t.provider !== s.provider) return { ok: !1, message: "provider does not match the url." };
  if (t.id !== void 0 && t.id !== s.id) return { ok: !1, message: "id does not match the url." };
  if (t.poster !== void 0 && (typeof t.poster != "string" || t.poster.length > G.urlLength || !In.test(t.poster)))
    return { ok: !1, message: "poster must be an https address or a poster this app stored (/sbimages/media-posters/...)." };
  const i = t.start === void 0 ? s.start : Number.isSafeInteger(t.start) && t.start > 0 && t.start <= G.startSeconds ? t.start : NaN;
  if (Number.isNaN(i)) return { ok: !1, message: `start must be whole seconds from 1 to ${G.startSeconds}.` };
  const a = it(t.title, G.titleLength), l = it(t.author, G.authorLength), m = rt(t.posterWidth), b = rt(t.posterHeight);
  return {
    ok: !0,
    media: {
      ...s,
      ...i ? { start: i } : {},
      ...a ? { title: a } : {},
      ...l ? { author: l } : {},
      ...typeof t.poster == "string" ? { poster: t.poster } : {},
      ...m && b ? { posterWidth: m, posterHeight: b } : {}
    }
  };
}
function En(e, t) {
  e.media = { ...t }, e.text = "", e.shape = "rectangle", e.vectorPath = "rectangle", e.shapeHint = "rectangle", e.imageFit = "cover", e.backgroundColor = "#111418", e.borderColor = "#111418", e.showTextTab = !1, t.poster ? (e.image = t.poster, e.imageOrigWidth = t.posterWidth || 480, e.imageOrigHeight = t.posterHeight || 360) : delete e.image;
}
function Nn(e) {
  const t = e?.media;
  return !t || typeof t != "object" || !$t.includes(t.provider) ? null : {
    provider: t.provider,
    url: t.url,
    ...t.title ? { title: t.title } : {},
    ...t.author ? { author: t.author } : {},
    ...t.start ? { start: t.start } : {},
    ...t.poster ? { poster: t.poster } : {}
  };
}
function Io(e) {
  if (!e || !$t.includes(e.provider)) return "Video";
  const t = wn[e.provider];
  return e.title ? `Video: ${e.title} (${t})` : `${t} video`;
}
const Ln = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, It = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function fe(e, t, n, o, s, { required: i = !0, plural: a = `${o}s` } = {}) {
  const l = [];
  if (e === void 0 && !i) return l;
  if (!R(e) || i && !Object.keys(e).length)
    return [i ? `${n} requires at least one ${o}.` : `${n} ${a} must be an object.`];
  const m = Object.keys(e).filter((b) => !t.includes(b));
  m.length && l.push(`${n} contains unsupported ${a}: ${m.join(", ")}.`);
  for (const [b, p] of Object.entries(e))
    t.includes(b) && s(b, p, l);
  return l;
}
function at(e, t) {
  return (n, o, s) => {
    const i = be[n]?.spec ?? C[n].spec(e), a = z(i, o, `${t} ${n}`);
    a && s.push(a);
  };
}
function ct(e) {
  return (t, n, o) => {
    const s = z(ie[t].spec, n, `${e} ${t}`);
    s && o.push(s);
  };
}
function Q(e) {
  return Array.isArray(e) && e.length > 0 && e.every((t) => typeof t == "string" && t.length > 0);
}
function Mn(e, t = {}) {
  const n = Ie(t), o = Ee(t), s = t.userMessage || "";
  if (!R(e)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const i = [];
  for (const r of Object.keys(e))
    r !== "message" && r !== "operations" && i.push(`The plan has an unknown field: ${r}.`);
  (typeof e.message != "string" || !e.message.trim()) && i.push("A natural completion message is required."), !Array.isArray(e.operations) || e.operations.length === 0 ? i.push("At least one slate operation is required.") : e.operations.length > o.operationsPerPlan && i.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const a = !!t.existingNodeIds?.length, l = new Set((t.existingNodeIds || []).filter(Boolean)), m = !!t.existingConnectionIds?.length, b = new Set((t.existingConnectionIds || []).filter(Boolean)), p = (r, c) => {
    a && R(r) && Array.isArray(r.ids) && r.ids.some((d) => !l.has(d)) && i.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(e.operations) ? e.operations : []).forEach((r, c) => {
    const d = `Operation ${c + 1}`;
    if (!R(r) || !pe.includes(r.kind)) {
      i.push(`${d} has an unsupported kind.`);
      return;
    }
    const $ = Oe[r.kind], v = Object.keys(r).filter((g) => !$.includes(g));
    for (const g of v) i.push(`${d} has an unknown field: ${g}.`);
    switch (r.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(r.count) || r.count < 1 || r.count > o.notesPerAdd) && i.push(`${d} count must be an integer from 1 to ${o.notesPerAdd}.`), r.preset !== void 0) {
          const _ = z({ type: "enum", values: Ue }, r.preset, `${d} preset`);
          _ && i.push(_);
        }
        const g = R(r.placement) && r.placement.connect === !0, k = r.media !== void 0;
        if (k) {
          const _ = Ot(r.media);
          _.ok || i.push(`${d} media ${_.message}`), r.count !== 1 && i.push(`${d} adds one media note at a time (count 1).`);
          for (const E of ["shape", "preset", "text"])
            r[E] !== void 0 && i.push(`${d} is a media note, so it takes no ${E}.`);
          g && i.push(`${d} is a media note, so it cannot copy and connect from another note.`);
        }
        if (!k && (r.shape !== void 0 || r.preset === void 0 && !g)) {
          const _ = z(C.shape.spec(n), r.shape, `${d} shape`);
          _ && i.push(_);
        }
        for (const _ of ["text", "width", "height"]) {
          if (r[_] === void 0) continue;
          const E = z(C[_].spec(n), r[_], `${d} ${_}`);
          E && i.push(E);
        }
        r.x === void 0 != (r.y === void 0) && i.push(`${d} needs both x and y, or neither.`);
        for (const _ of ["x", "y"]) {
          if (r[_] === void 0) continue;
          const E = z(C[_].spec(n), r[_], `${d} ${_}`);
          E && i.push(E);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : r.ids.some((_) => !tt.test(_)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(r.count) && r.ids.length > r.count && i.push(`${d} has more ids than notes to add.`));
        const y = r.placement;
        if (y !== void 0)
          if (!R(y))
            i.push(`${d} placement must be an object.`);
          else {
            const _ = r.x !== void 0 ? ["arrangement", "gap", ...y.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const E of Object.keys(y))
              _.includes(E) || i.push(
                r.x !== void 0 && ["relativeTo", "direction", "connect"].includes(E) ? `${d} gives x and y, so placement cannot also give ${E}.` : `${d} placement has an unknown field: ${E}.`
              );
            y.connect !== void 0 && (typeof y.connect != "boolean" ? i.push(`${d} placement.connect must be true or false.`) : y.connect && (y.relativeTo === void 0 && i.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), y.direction === "center" && i.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), y.relativeTo !== void 0 && typeof y.relativeTo != "string" ? i.push(`${d} placement.relativeTo must be a note id.`) : y.relativeTo && a && !l.has(y.relativeTo) && i.push(`${d} references a note that is not in the slate.`);
            for (const [E, h] of [["direction", mt], ["arrangement", gt]]) {
              if (y[E] === void 0) continue;
              const u = z({ type: "enum", values: h }, y[E], `${d} placement.${E}`);
              u && i.push(u);
            }
            if (y.gap !== void 0) {
              const E = z({ type: "number", min: 0, max: 2e3 }, y.gap, `${d} placement.gap`);
              E && i.push(E);
            }
          }
        i.push(...fe(r.style, Fe, d, "node style", at(n, d), { required: !1 })), Q(r.ids) && r.ids.forEach((_) => l.add(_));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const g = de(r.target, `${d} target`);
        if (i.push(...g), g.length || p(r.target, d), r.kind === "update_nodes" && i.push(...fe(r.changes, Jt, d, "node change", at(n, d), { plural: "changes" })), r.kind === "delete_nodes" && R(r.target) && r.target.all === !0 && Object.keys(r.target).length === 1 && !It.test(s) && i.push(`${d} cannot delete every note without an explicit request.`), r.kind === "arrange_nodes") {
          const k = z({ type: "enum", values: qe }, r.layout, `${d} layout`);
          if (k && i.push(k), r.gap !== void 0) {
            const y = z({ type: "number", min: 0, max: 2e3 }, r.gap, `${d} gap`);
            y && i.push(y);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const g = de(r.target, `${d} target`);
        if (i.push(...g), g.length || p(r.target, d), r.offset !== void 0) {
          const k = z({ type: "point" }, r.offset, `${d} offset`);
          k && i.push(k);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : r.ids.some((k) => !tt.test(k)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : R(r.target) && Q(r.target.ids) && r.ids.length > r.target.ids.length && i.push(`${d} has more ids than notes to copy.`)), Q(r.ids) && r.ids.forEach((k) => l.add(k));
        return;
      }
      case "connect_nodes": {
        const g = de(r.from, `${d} from`);
        if (i.push(...g), g.length || p(r.from, d), R(r.to) && r.to.point !== void 0) {
          Object.keys(r.to).length !== 1 && i.push(`${d} to must be a note selector or {point}, not both.`);
          const _ = z({ type: "point" }, r.to.point, `${d} to.point`);
          _ && i.push(_);
        } else {
          const _ = de(r.to, `${d} to`);
          i.push(..._), _.length || p(r.to, d);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different connector ids.`) : r.ids.some((_) => _.length > nt) && i.push(`${d} connector ids can be at most ${nt} characters.`)), i.push(...fe(r.style, Ke, d, "connection style", ct(d), { required: !1 })), Q(r.ids) && r.ids.forEach((_) => b.add(_));
        const k = r.from?.ids, y = r.to?.ids;
        Q(k) && Q(y) && k.forEach((_) => y.forEach((E) => b.add(`${_}->${E}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const g = r.connectionIds !== void 0, k = r.from !== void 0 || r.to !== void 0;
        if (g && k && i.push(`${d} names connectors by connectionIds or by from and to, not both.`), !g && !k && i.push(`${d} requires connectionIds or both from and to note selectors.`), g && (Q(r.connectionIds) ? m && r.connectionIds.some((y) => !b.has(y)) && i.push(`${d} references connectors that are not in the slate.`) : i.push(`${d} connectionIds must be a list of connector ids.`)), k)
          for (const y of ["from", "to"]) {
            const _ = de(r[y], `${d} ${y}`);
            i.push(..._), _.length || p(r[y], d);
          }
        if (r.kind === "update_connections") {
          i.push(...fe(r.changes, Object.keys(ie), d, "connection change", ct(d)));
          const y = R(r.changes) ? r.changes : {};
          y.toNote !== void 0 && y.toPoint !== void 0 && i.push(`${d} moves the far end with toNote or toPoint, not both.`), y.fromNote !== void 0 && y.fromPoint !== void 0 && i.push(`${d} moves the starting end with fromNote or fromPoint, not both.`), y.ends !== void 0 && (y.fromEnd !== void 0 || y.toEnd !== void 0) && i.push(`${d} sets ends, or fromEnd and toEnd, not both.`), y.toPoint !== void 0 && y.toEnd !== void 0 && i.push(`${d} cannot pin a far end it leaves free (toPoint with toEnd).`), y.fromPoint !== void 0 && (y.toPoint !== void 0 || y.fromEnd !== void 0) && i.push(`${d} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        i.push(
          ...fe(r.changes, Object.keys(he), d, "slate change", (g, k, y) => {
            if (g === "background") {
              y.push(...hn(k, `${d} background`));
              return;
            }
            if (g === "style") {
              y.push(...fn(k, `${d} style`, n.fonts));
              return;
            }
            const _ = z(he[g].spec, k, `${d} ${g}`);
            _ && y.push(_);
          })
        ), R(r.changes) && r.changes.background !== void 0 && !Ln.test(s) && i.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: i.length === 0, errors: i };
}
const x = (e) => e.options.id, U = (e, t) => C[t].read(e.options), K = (e) => ({
  x: U(e, "x"),
  y: U(e, "y"),
  width: Number(e.options.width ?? 120),
  height: Number(e.options.height ?? 80)
}), se = (e) => !!e.targetPoint || `${e.childId || ""}`.startsWith(ge), me = (e, t) => `${e}->${t}`;
function _e(e) {
  return JSON.parse(JSON.stringify(e ?? null));
}
function Ne(e) {
  const t = e?.nodes && !Array.isArray(e.nodes), n = t ? e.v2 ?? e : null, o = t ? {
    options: _e(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((s) => An(s?.v2 ?? s))
  } : _e(e || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((s) => {
    const i = s?.options ? s : { options: { ...s || {} }, relationships: s?.relationships };
    return i.options.relationships && delete i.options.relationships, i.relationships = { ...i.relationships || {}, associations: [...i.relationships?.associations || []] }, i.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = i.options.id), a.id || (a.id = me(a.parentId, a.childId));
    }), i;
  }), o;
}
function An(e) {
  const t = _e(e.options || {});
  t.x !== void 0 && (t.xPos = t.x, delete t.x), t.y !== void 0 && (t.yPos = t.y, delete t.y), t.fontColor !== void 0 && t.foregroundColor === void 0 && (t.foregroundColor = t.fontColor);
  const n = typeof e.getRotation == "function" ? e.getRotation() : void 0;
  typeof n == "number" && (t.rotate = { ...t.rotate || {}, rotationAngle: n });
  const o = e.relationships, s = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: t,
    relationships: {
      associations: s.map(({ parent: i, child: a, ...l }) => _e(l))
    }
  };
}
function ne(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const o of e.nodes)
    for (const s of o.relationships.associations)
      t.has(s.id) || (t.add(s.id), n.push({ node: o, association: s }));
  return n;
}
const Pe = (e) => `${e ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function te(e, t, n) {
  const o = e.nodes;
  if (t.ids)
    return t.ids.map((s) => o.find((i) => x(i) === s)).filter(Boolean);
  if (t.text !== void 0) {
    const s = Pe(t.text), i = o.filter(
      (a) => t.match === "contains" ? Pe(a.options.text).includes(s) : Pe(a.options.text) === s
    );
    if (i.length > 1 && t.all !== !0)
      throw new X(
        "ambiguous_selector",
        400,
        `${n} "${t.text}" matches ${i.length} notes (${i.map(x).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: i.map((a) => ({ id: x(a), text: a.options.text ?? "" })) }
      );
    return i;
  }
  if (t.within) {
    const s = t.within;
    return o.filter((i) => {
      const a = K(i);
      return a.x >= s.x && a.y >= s.y && a.x + a.width <= s.x + s.width && a.y + a.height <= s.y + s.height;
    });
  }
  return t.groupId !== void 0 ? o.filter((s) => s.options.groupId === t.groupId) : t.all === !0 ? [...o] : [];
}
const le = (e) => Math.round(e * 1e4) / 1e4, dt = (e) => Math.max(0, Math.min(1, e));
function Tn(e) {
  const t = dt(e.x), n = dt(e.y), o = [t, 1 - t, n, 1 - n], s = Math.min(...o);
  return s === o[0] ? { x: 0, y: le(n) } : s === o[1] ? { x: 1, y: le(n) } : s === o[2] ? { x: le(t), y: 0 } : { x: le(t), y: 1 };
}
function Pn(e) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[e];
}
function Et(e, t, n) {
  if (!n) return { ...e };
  const o = n * Math.PI / 180, s = e.x - t.x, i = e.y - t.y;
  return { x: t.x + s * Math.cos(o) - i * Math.sin(o), y: t.y + s * Math.sin(o) + i * Math.cos(o) };
}
function Cn(e, t) {
  const n = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, o = Et(t, n, -(e.rotation || 0));
  return { x: (o.x - e.x) / (e.width || 1), y: (o.y - e.y) / (e.height || 1) };
}
function jn(e, t) {
  const n = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, o = Et({ x: e.x + t.x * e.width, y: e.y + t.y * e.height }, n, e.rotation || 0);
  return { x: le(o.x), y: le(o.y) };
}
function Rn(e, t) {
  const n = Cn(e, t), o = (n.x - 0.5) * (e.width || 1), s = (n.y - 0.5) * (e.height || 1);
  if (Math.abs(o) < 1e-9 && Math.abs(s) < 1e-9) return { x: 0.5, y: 0 };
  const i = o !== 0 ? e.width / 2 / Math.abs(o) : 1 / 0, a = s !== 0 ? e.height / 2 / Math.abs(s) : 1 / 0, l = Math.min(i, a);
  return Tn({ x: 0.5 + o * l / (e.width || 1), y: 0.5 + s * l / (e.height || 1) });
}
function zn(e) {
  const t = { ...e };
  return t.showParentArrow = e.showChildArrow !== !1, t.showChildArrow = !!e.showParentArrow, t.sourceAnchor = e.targetAnchor ?? null, t.targetAnchor = null, t;
}
const Ce = (e) => ({ ...K(e), rotation: Number(U(e, "rotationAngle")) || 0 }), Yn = (e) => ({ x: e.x + e.width / 2, y: e.y + e.height / 2 });
function Dn(e, t, n, o, s, i) {
  const a = (d) => e.nodes.find(($) => x($) === d), l = (d) => {
    throw new X("invalid_operation_plan", 400, `${s} ${d}`);
  }, m = (d) => {
    throw new X("no_match", 409, `${s} names no note ${JSON.stringify(d)} on the slate.`);
  }, b = (d, $) => {
    d !== $ && (d.relationships.associations = d.relationships.associations.filter((v) => v !== n), $.relationships.associations.push(n));
  };
  let p = t;
  if (o.toNote !== void 0) {
    const d = a(o.toNote) ?? m(o.toNote);
    n.childId = x(d), delete n.targetPoint, n.targetAnchor = null;
  } else o.toPoint !== void 0 && (se(n) || (n.childId = `${ge}${i()}`), n.targetPoint = { x: o.toPoint.x, y: o.toPoint.y }, n.targetAnchor = null);
  if (o.fromNote !== void 0) {
    const d = a(o.fromNote) ?? m(o.fromNote);
    n.parentId = x(d), n.sourceAnchor = null, b(p, d), p = d;
  } else if (o.fromPoint !== void 0) {
    se(n) && l(`keeps one end on a note: the far end of ${n.id} is already free.`);
    const d = a(n.childId) ?? m(n.childId), $ = zn(n);
    for (const v of Object.keys(n)) delete n[v];
    Object.assign(n, $, {
      parentId: x(d),
      childId: `${ge}${i()}`,
      targetPoint: { x: o.fromPoint.x, y: o.fromPoint.y }
    }), b(p, d), p = d;
  }
  n.parentId === n.childId && l(`cannot connect ${n.id} from a note to itself.`);
  const r = (d) => {
    if (d === "target" && se(n)) return n.targetPoint;
    const $ = a(d === "source" ? n.parentId : n.childId);
    if (!$) return null;
    const v = d === "source" ? n.sourceAnchor : n.targetAnchor;
    return v ? jn(Ce($), v) : Yn(Ce($));
  }, c = (d, $, v) => {
    if (d === "target" && se(n)) {
      v && l(`cannot pin or follow the far end of ${n.id}: it is free, on no note.`);
      return;
    }
    const g = d === "source" ? "sourceAnchor" : "targetAnchor";
    if ($ === "follow") n[g] = null;
    else if ($ !== "pinned") n[g] = Pn($);
    else if (!n[g]) {
      const k = a(d === "source" ? n.parentId : n.childId), y = r(d === "source" ? "target" : "source");
      k && y && (n[g] = Rn(Ce(k), y));
    }
  };
  return o.ends !== void 0 && (c("source", o.ends, !1), c("target", o.ends, !1)), o.fromEnd !== void 0 && c("source", o.fromEnd, !0), o.toEnd !== void 0 && c("target", o.toEnd, !0), p;
}
function Bn(e) {
  return {
    fromEnd: e.sourceAnchor ? "pinned" : "follow",
    toEnd: se(e) ? "free" : e.targetAnchor ? "pinned" : "follow"
  };
}
function Nt(e) {
  const { x: t, y: n, width: o, height: s } = e, i = e.rotationAngle || 0;
  if (!i) return { minX: t, minY: n, maxX: t + o, maxY: n + s };
  const a = t + o / 2, l = n + s / 2, m = i * Math.PI / 180, b = Math.cos(m), p = Math.sin(m);
  let r = 1 / 0, c = 1 / 0, d = -1 / 0, $ = -1 / 0;
  for (const [g, k] of [[t, n], [t + o, n], [t + o, n + s], [t, n + s]]) {
    const y = g - a, _ = k - l, E = a + y * b - _ * p, h = l + y * p + _ * b;
    r = Math.min(r, E), c = Math.min(c, h), d = Math.max(d, E), $ = Math.max($, h);
  }
  const v = (g) => Math.round(g * 1e6) / 1e6;
  return { minX: v(r), minY: v(c), maxX: v(d), maxY: v($) };
}
function Hn(e, t) {
  if (t.length < 2) return [];
  const n = t.map(Nt), o = Math.min(...n.map((b) => b.minX)), s = Math.max(...n.map((b) => b.maxX)), i = Math.min(...n.map((b) => b.minY)), a = Math.max(...n.map((b) => b.maxY)), l = (o + s) / 2, m = (i + a) / 2;
  return t.map((b, p) => {
    const r = n[p];
    let { x: c, y: d } = b;
    return e === "left" ? c += o - r.minX : e === "right" ? c += s - r.maxX : e === "centerH" ? c += l - (r.minX + r.maxX) / 2 : e === "top" ? d += i - r.minY : e === "bottom" ? d += a - r.maxY : e === "middle" && (d += m - (r.minY + r.maxY) / 2), { id: b.id, x: c, y: d };
  });
}
function Xn(e, t) {
  if (t.length < 3) return [];
  const n = t.map((c, d) => ({ box: c, index: d, b: Nt(c) })), o = e === "horizontal", s = (c) => o ? c.b.minX : c.b.minY, i = (c) => o ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, a = [...n].sort((c, d) => s(c) - s(d) || c.index - d.index), l = s(a[0]), b = (a.reduce((c, d) => Math.max(c, s(d) + i(d)), -1 / 0) - l - a.reduce((c, d) => c + i(d), 0)) / (a.length - 1), p = /* @__PURE__ */ new Map();
  let r = l;
  for (const c of a) {
    const d = r - s(c);
    p.set(c.index, {
      id: c.box.id,
      x: o ? c.box.x + d : c.box.x,
      y: o ? c.box.y : c.box.y + d
    }), r += i(c) + b;
  }
  return n.map((c) => p.get(c.index));
}
function Se(e, t, n) {
  const o = Math.min(e.x + e.width + n - t.x, t.x + t.width + n - e.x), s = Math.min(e.y + e.height + n - t.y, t.y + t.height + n - e.y);
  return o > 0 && s > 0 ? { x: o, y: s } : null;
}
const Wn = 4e6;
function Fn(e, t, { gap: n = 20 } = {}) {
  const o = e.map((p) => ({ ...p })), s = t.map((p) => ({ ...p })), i = (p, r, c, d, $) => {
    const v = p.x + p.width / 2 - (r.x + r.width / 2), g = p.y + p.height / 2 - (r.y + r.height / 2);
    c.y <= c.x ? p.y += (g > 0 || g === 0 && $ > 0 ? 1 : -1) * c.y * d : p.x += (v > 0 || v === 0 && $ > 0 ? 1 : -1) * c.x * d;
  }, a = Math.max(1, o.length * (s.length + o.length / 2)), l = Math.max(1, Math.min(1e3, Math.floor(Wn / a)));
  let m = !1;
  for (let p = 0; p < l; p += 1) {
    let r = !1;
    for (let c = 0; c < o.length; c += 1) {
      for (const d of s) {
        const $ = Se(o[c], d, n);
        $ && (i(o[c], d, $, 1, 1), r = !0);
      }
      for (let d = c + 1; d < o.length; d += 1) {
        const $ = Se(o[c], o[d], n);
        $ && (i(o[c], o[d], $, 0.5, -1), i(o[d], o[c], $, 0.5, 1), r = !0);
      }
    }
    if (!r) {
      m = !0;
      break;
    }
  }
  const b = (p) => Math.round(p * 100) / 100;
  for (const p of o)
    p.x = b(p.x), p.y = b(p.y);
  return m || qn(o, s, n), o.map(({ id: p, x: r, y: c }) => ({ id: p, x: r, y: c }));
}
function qn(e, t, n) {
  const o = [...t], s = [];
  for (const d of e)
    o.some(($) => Se(d, $, n)) ? s.push(d) : o.push(d);
  if (!s.length) return;
  const i = Math.min(...e.map((d) => d.x)), a = o.length ? Math.max(...o.map((d) => d.y + d.height)) + n : Math.min(...e.map((d) => d.y)), l = o.length ? Math.max(...o.map((d) => d.x + d.width)) : i, m = s.reduce((d, $) => d + ($.width + n) * ($.height + n), 0), b = Math.max(l - i, Math.sqrt(m) * 1.5, ...s.map((d) => d.width));
  let p = i, r = a, c = 0;
  for (const d of s)
    p > i && p + d.width > i + b && (p = i, r += c + n, c = 0), d.x = p, d.y = r, p += d.width + n, c = Math.max(c, d.height);
}
function Un(e, t, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!e.length) return [];
  const s = new Map(e.map((h) => [h.id, h])), i = new Map(e.map((h) => [h.id, []])), a = new Map(e.map((h) => [h.id, 0]));
  for (const [h, u] of t)
    !s.has(h) || !s.has(u) || h === u || (i.get(h).push(u), a.set(u, a.get(u) + 1));
  const l = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), b = [], p = (h) => {
    b.push(h), m.set(h, 0), l.set(h, []);
    const u = [h];
    for (; u.length; ) {
      const f = u.shift();
      for (const w of i.get(f))
        m.has(w) || (m.set(w, m.get(f) + 1), l.set(w, []), l.get(f).push(w), u.push(w));
    }
  };
  for (const h of e) a.get(h.id) === 0 && !m.has(h.id) && p(h.id);
  for (const h of e) m.has(h.id) || p(h.id);
  const r = [];
  for (const h of e) {
    const u = m.get(h.id);
    r[u] = Math.max(r[u] ?? 0, h.height);
  }
  const c = Math.min(...e.map((h) => h.x)), d = Math.min(...e.map((h) => h.y)), $ = [];
  r.forEach((h, u) => {
    $[u] = u === 0 ? d : $[u - 1] + r[u - 1] + n;
  });
  const v = /* @__PURE__ */ new Map(), g = (h) => {
    const u = l.get(h), f = u.reduce((I, T) => I + g(T), 0) + n * Math.max(0, u.length - 1), w = Math.max(s.get(h).width, f);
    return v.set(h, w), w;
  }, k = /* @__PURE__ */ new Map(), y = (h, u) => {
    const f = s.get(h), w = l.get(h), I = v.get(h), T = $[m.get(h)];
    if (!w.length) {
      k.set(h, { id: h, x: u + (I - f.width) / 2, y: T });
      return;
    }
    const M = w.reduce((O, P) => O + v.get(P), 0) + n * (w.length - 1);
    let A = u + (I - M) / 2;
    for (const O of w)
      y(O, A), A += v.get(O) + n;
    const Y = k.get(w[0]), L = k.get(w[w.length - 1]), N = (Y.x + s.get(w[0]).width / 2 + L.x + s.get(w[w.length - 1]).width / 2) / 2, S = Math.min(Math.max(N - f.width / 2, u), u + I - f.width);
    k.set(h, { id: h, x: S, y: T });
  };
  let _ = c;
  for (const h of b) {
    const u = g(h);
    y(h, _), _ += u + n;
  }
  const E = e.map((h) => k.get(h.id));
  return Gn(e, E, o, n);
}
function Gn(e, t, n, o) {
  if (!n.length) return t;
  let s = 0;
  for (let i = 0; i <= n.length; i += 1) {
    let a = 0;
    if (t.forEach((l, m) => {
      const b = { ...e[m], x: l.x, y: l.y + s };
      for (const p of n)
        Se(b, p, o) && (a = Math.max(a, p.y + p.height + o - b.y));
    }), !a) break;
    s += a;
  }
  return s ? t.map((i) => ({ ...i, y: i.y + s })) : t;
}
function Kn() {
  const e = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let n = 0; n < 12; n += 1) t += e[Math.floor(Math.random() * e.length)];
  return t;
}
function Zn(e) {
  const t = (i) => {
    const a = (parseInt(i, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (i) => 0.2126 * t(i.substr(1, 2)) + 0.7152 * t(i.substr(3, 2)) + 0.0722 * t(i.substr(-2)), o = (i, a) => {
    const [l, m] = [n(i), n(a)];
    return (Math.max(l, m) + 0.05) / (Math.min(l, m) + 0.05);
  }, s = /^#[0-9a-f]{6}$/i.test(e) ? e : "#7aa2c8";
  return o(s, "#ffffff") > o(s, "#000000") ? "#ffffff" : "#000000";
}
function Vn(e, t, n) {
  return e.x < t.x + t.width + n && e.x + e.width + n > t.x && e.y < t.y + t.height + n && e.y + e.height + n > t.y;
}
function Jn(e, t, n, o, s, i) {
  let a = e;
  for (let l = 0; l <= t.length; l += 1) {
    const m = t.filter((r) => a.some((c) => Vn({ ...c, width: n, height: o }, r, i)));
    if (!m.length) return a;
    let b = 0, p = 0;
    s === "left" ? b = Math.min(...m.map((r) => r.x - i)) - Math.max(...a.map((r) => r.x + n)) : s === "above" ? p = Math.min(...m.map((r) => r.y - i)) - Math.max(...a.map((r) => r.y + o)) : s === "below" || s === "center" ? p = Math.max(...m.map((r) => r.y + r.height + i)) - Math.min(...a.map((r) => r.y)) : b = Math.max(...m.map((r) => r.x + r.width + i)) - Math.min(...a.map((r) => r.x)), a = a.map((r) => ({ x: r.x + b, y: r.y + p }));
  }
  return a;
}
function Lt(e, t) {
  if (t) {
    const n = e.nodes.find((s) => x(s) === t);
    if (n) return n;
    const o = e.nodes.filter((s) => `${s.options.text ?? ""}`.trim().toLowerCase() === t.trim().toLowerCase());
    if (o.length === 1) return o[0];
  }
  return [...e.nodes].sort((n, o) => K(o).x + K(o).width - (K(n).x + K(n).width))[0];
}
function Xe(e, t) {
  const n = t === "grid" ? Math.ceil(Math.sqrt(e)) : e;
  return Array.from({ length: e }, (o, s) => ({
    row: t === "column" ? s : t === "grid" ? Math.floor(s / n) : 0,
    column: t === "column" ? 0 : t === "grid" ? s % n : s
  }));
}
function Qn(e, t, n, o) {
  const s = t.count, i = t.placement || {}, a = i.gap ?? (i.connect ? nn : 48);
  if (t.x !== void 0 && t.y !== void 0) {
    const c = i.arrangement || "row";
    return { points: Xe(s, c).map(({ row: $, column: v }) => ({
      x: t.x + v * (n + a),
      y: t.y + $ * (o + a)
    })), arrangement: c, gap: a };
  }
  const l = Lt(e, i.relativeTo), m = l ? K(l) : { x: 0, y: 0, width: 160, height: 100 }, b = i.direction || "right", p = i.arrangement || (["left", "right"].includes(b) ? "column" : "row"), r = Xe(s, p).map(({ row: c, column: d }) => {
    let $ = m.x + d * (n + a), v = m.y + c * (o + a);
    return b === "right" && ($ += m.width + a), b === "left" && ($ -= n + a), b === "below" && (v += m.height + a), b === "above" && (v -= o + a), { x: $, y: v };
  });
  return { points: Jn(r, e.nodes.map(K), n, o, b, a), arrangement: p, gap: a };
}
function eo(e, t) {
  if (!e) return { childId: `${ge}${t()}` };
  const n = e.match(/->(__free_.+)$/);
  return { id: e, childId: n ? n[1] : `${ge}${e.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function je(e, t) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}~${n}`); ) n += 1;
  return `${t}~${n}`;
}
const Re = (e, t) => JSON.stringify([e, t]);
function ze(e, t, n) {
  return new X(
    "id_taken",
    409,
    `${e} names ${t} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${t}s in a later operation.`,
    { ids: n }
  );
}
const lt = (e, t) => JSON.stringify(e) === JSON.stringify(t), to = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Ye = (e) => JSON.parse(JSON.stringify(e)), ve = 1e6, ht = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, ce = (e) => ({ id: x(e), ...K(e), rotationAngle: U(e, "rotationAngle") });
function Eo(e, t, n = {}) {
  const o = Ie(n), s = Ee(n), i = n.idFactory || Kn, a = Ne(e), l = Mn(t, {
    ...n,
    existingNodeIds: a.nodes.map(x),
    existingConnectionIds: ne(a).map(({ association: c }) => c.id)
  });
  if (!l.valid)
    throw new X("invalid_operation_plan", 400, l.errors.join(" "), { errors: l.errors });
  const m = JSON.stringify(a), b = a.nodes.length, p = [], r = {
    created: [],
    updated: [],
    deleted: [],
    connected: [],
    disconnected: [],
    connectionsUpdated: [],
    operations: [],
    skipped: [],
    warnings: [],
    unchanged: !1
  };
  if (t.operations.forEach((c, d) => {
    const $ = d + 1, v = `Operation ${$}`, g = { operation: $, kind: c.kind, matched: [], changed: [] };
    r.operations.push(g);
    const k = () => r.warnings.push(`${v} matched no notes.`), y = (h) => {
      r.skipped.push({ operation: $, id: x(h), reason: "locked" });
    }, _ = (h) => {
      const u = a.nodes.length + h;
      if (h > 0 && u > s.notesPerSlate && u > b)
        throw new X(
          "note_limit",
          422,
          `${v} would leave ${u} notes; a slate can hold at most ${s.notesPerSlate} notes.`,
          { limit: s.notesPerSlate, operation: $ }
        );
    }, E = (h, u) => {
      if (u > 0 && h > s.connectorsPerSlate)
        throw new X(
          "connector_limit",
          422,
          `${v} would leave ${h} connectors; a slate can hold at most ${s.connectorsPerSlate} connectors.`,
          { limit: s.connectorsPerSlate, operation: $ }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const h = c.preset ? zt[c.preset] : void 0, u = c.placement?.connect === !0, f = u ? a.nodes.find((F) => x(F) === c.placement.relativeTo) : void 0;
        if (u && !f)
          throw new X("no_match", 409, `${v} placement.relativeTo names no note on the slate to connect from.`, { operation: $ });
        if (f && f.options.isLocked === !0) {
          y(f);
          return;
        }
        const w = c.shape ?? h?.shape, I = f ? K(f) : void 0, T = typeof w == "string" && w.toLowerCase() === "triangle", M = w && typeof w == "object" ? Mt(w) : 0, A = c.media !== void 0 ? Ot(c.media) : null;
        if (A && !A.ok) throw new X("invalid_operation_plan", 400, `${v} media ${A.message}`, { operation: $ });
        const Y = A ? xn : void 0, L = c.width ?? Y?.width ?? h?.width ?? I?.width ?? (T ? 150 : M ? Math.round(M >= 1 ? 180 : 180 * M) : 180), N = c.height ?? Y?.height ?? h?.height ?? I?.height ?? (T ? 130 : M ? Math.round(M >= 1 ? 180 / M : 180) : 110), S = f ?? Lt(a, c.placement?.relativeTo), O = c.style?.backgroundColor || h?.style?.backgroundColor || S?.options.backgroundColor || "#7aa2c8", { points: P, arrangement: j, gap: Z } = Qn(a, c, L, N), W = new Set(ne(a).map(({ association: F }) => F.id)), H = new Set(a.nodes.map(x)), ae = (c.ids || []).filter((F) => H.has(F));
        if (ae.length && !n.replay) throw ze(v, "note", ae);
        const D = P.map((F, Le) => c.ids?.[Le] || i());
        _(D.filter((F) => !H.has(F)).length), f && E(W.size + D.filter((F) => !H.has(F)).length, D.length), P.forEach(({ x: F, y: Le }, Je) => {
          const J = D[Je];
          if (g.matched.push(J), H.has(J)) return;
          const Qe = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${Je + 1}`) : c.text : "", we = f ? Ye(f.options) : void 0;
          if (we) for (const ee of to) delete we[ee];
          const oe = we ? { ...we, id: J, name: J, text: Qe, width: L, height: N } : {
            id: J,
            name: J,
            text: Qe,
            defaultShaped: !0,
            width: L,
            height: N,
            backgroundColor: O,
            borderColor: "#333333",
            borderWidth: 1,
            borderOpacity: 1,
            borderStyle: "solid",
            opacity: 1,
            fontFamily: "Manrope",
            fontSize: 20,
            textXAlign: "middle",
            textYAlign: "middle",
            lineColor: "#333333",
            lineWidth: 3,
            filters: { vect: null, text: null },
            animations: { vect: null, text: null }
          };
          w && C.shape.store(oe, w, o), C.x.store(oe, F, o), C.y.store(oe, Le, o), f || C.foregroundColor.store(oe, Zn(O), o);
          for (const [ee, Me] of Object.entries(h?.style || {})) C[ee].store(oe, Me, o);
          for (const [ee, Me] of Object.entries(c.style || {})) C[ee].store(oe, Me, o);
          if (A?.ok && En(oe, A.media), a.nodes.push({ options: oe, relationships: { associations: [] } }), g.changed.push(J), r.created.push(J), f) {
            const ee = je(W, me(x(f), J));
            W.add(ee), f.relationships.associations.push({ id: ee, parentId: x(f), childId: J, ...Te }), r.connected.push(ee);
          }
        });
        const { placement: vo, ...jt } = c;
        p.push({
          ...jt,
          ids: D,
          x: P[0].x,
          y: P[0].y,
          placement: { arrangement: j, gap: Z, ...f ? { relativeTo: x(f), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const h = te(a, c.target, `${v} target`);
        g.matched = h.map(x), h.length || k();
        const u = [];
        for (const f of h) {
          if (f.options.isLocked === !0 && c.changes.locked !== !1) {
            y(f);
            continue;
          }
          const w = JSON.stringify(f.options);
          for (const [I, T] of Object.entries(c.changes))
            be[I] || C[I].store(f.options, T, o);
          no(f.options, c.changes), u.push(x(f)), JSON.stringify(f.options) !== w && g.changed.push(x(f));
        }
        if (c.changes.order && u.length) {
          const f = new Set(u), w = a.nodes.map(x), I = a.nodes.filter((M) => f.has(x(M))), T = a.nodes.filter((M) => !f.has(x(M)));
          a.nodes = c.changes.order === "front" ? [...T, ...I] : [...I, ...T], a.nodes.forEach((M, A) => {
            const Y = x(M);
            f.has(Y) && w[A] !== Y && !g.changed.includes(Y) && g.changed.push(Y);
          });
        }
        r.updated.push(...u), u.length && p.push({ kind: "update_nodes", target: { ids: u }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const h = te(a, c.target, `${v} target`);
        if (g.matched = h.map(x), h.length || k(), !c.target.ids && a.nodes.length > 1 && h.length === a.nodes.length && !It.test(n.userMessage || ""))
          throw new X("invalid_operation_plan", 400, `${v} cannot delete every note without an explicit request.`);
        const f = /* @__PURE__ */ new Set();
        for (const w of h)
          w.options.isLocked === !0 ? y(w) : f.add(x(w));
        a.nodes = a.nodes.filter((w) => !f.has(x(w)));
        for (const w of a.nodes)
          w.relationships.associations = w.relationships.associations.filter(
            (I) => !f.has(I.parentId) && !f.has(I.childId)
          );
        g.changed = [...f], r.deleted.push(...f), f.size && p.push({ kind: "delete_nodes", target: { ids: [...f] } });
        return;
      }
      case "duplicate_nodes": {
        const h = te(a, c.target, `${v} target`);
        g.matched = h.map(x), h.length || k();
        const u = c.offset ?? on, f = new Set(a.nodes.map(x)), w = (c.ids || []).filter((L) => f.has(L));
        if (w.length && !n.replay) throw ze(v, "note", w);
        const I = h.map((L, N) => c.ids?.[N] || i());
        _(I.filter((L) => !f.has(L)).length);
        for (const L of h) {
          const N = U(L, "x") + u.x, S = U(L, "y") + u.y;
          if (Math.abs(N) > ve || Math.abs(S) > ve)
            throw new X(
              "invalid_operation_plan",
              400,
              `${v} would put the copy of ${x(L)} at ${N}, ${S}; a note's position must be from -${ve} to ${ve}.`
            );
        }
        const T = new Map(h.map((L, N) => [x(L), I[N]])), M = /* @__PURE__ */ new Map();
        h.forEach((L, N) => {
          const S = I[N];
          if (f.has(S)) return;
          const O = { options: { ...Ye(L.options), id: S, name: S }, relationships: { associations: [] } };
          C.x.store(O.options, U(L, "x") + u.x, o), C.y.store(O.options, U(L, "y") + u.y, o), a.nodes.push(O), M.set(S, O), g.changed.push(S), r.created.push(S);
        });
        const A = new Set(ne(a).map(({ association: L }) => L.id));
        let Y = 0;
        for (const L of h) {
          const N = M.get(T.get(x(L)));
          if (N)
            for (const S of L.relationships.associations) {
              const O = T.get(S.childId);
              if (!O || se(S)) continue;
              const P = je(A, me(x(N), O));
              A.add(P), N.relationships.associations.push({ ...Ye(S), id: P, parentId: x(N), childId: O }), r.connected.push(P), Y += 1;
            }
        }
        E(A.size, Y), h.length && p.push({ kind: "duplicate_nodes", target: { ids: h.map(x) }, ids: I, offset: { ...u } });
        return;
      }
      case "connect_nodes": {
        const h = te(a, c.from, `${v} from`), u = c.to?.point, f = u ? [] : te(a, c.to, `${v} to`);
        (!h.length || !u && !f.length) && k();
        const w = h.length * (u ? 1 : f.length);
        if (w > s.connectorsPerOperation)
          throw new X(
            "connector_limit",
            422,
            `${v} would join ${w} pairs of notes; one operation may join at most ${s.connectorsPerOperation}.`,
            { limit: s.connectorsPerOperation }
          );
        const I = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Map();
        for (const { association: N } of ne(a)) {
          I.add(N.id);
          const S = Re(N.parentId, N.childId);
          T.has(S) || T.set(S, N.id);
        }
        const M = [], A = [], Y = [];
        let L = 0;
        for (const N of h) {
          const S = x(N), O = u ? [null] : f.filter((P) => x(P) !== S);
          if (N.options.isLocked === !0) {
            O.length && y(N), L += O.length;
            continue;
          }
          O.length && Y.push(S);
          for (const P of O) {
            const j = c.ids?.[L];
            if (L += 1, !P) {
              const ae = eo(j, i), D = ae.id ?? me(S, ae.childId);
              if (I.has(D)) {
                n.replay || M.push(D), A.push(D), g.matched.push(D);
                continue;
              }
              N.relationships.associations.push({ id: D, parentId: S, childId: ae.childId, targetPoint: { ...u }, ...Te, ...c.style || {} }), I.add(D), A.push(D), g.matched.push(D), g.changed.push(D), r.connected.push(D);
              continue;
            }
            const Z = x(P), W = T.get(Re(S, Z));
            if (W) {
              A.push(W), g.matched.push(W);
              continue;
            }
            if (j && I.has(j)) {
              n.replay || M.push(j), A.push(j), g.matched.push(j);
              continue;
            }
            const H = j || je(I, me(S, Z));
            N.relationships.associations.push({ id: H, parentId: S, childId: Z, ...Te, ...c.style || {} }), I.add(H), T.set(Re(S, Z), H), A.push(H), g.matched.push(H), g.changed.push(H), r.connected.push(H);
          }
        }
        if (M.length) throw ze(v, "connector", M);
        if (I.size > s.connectorsPerSlate && g.changed.length)
          throw new X(
            "connector_limit",
            422,
            `A slate can hold at most ${s.connectorsPerSlate} connectors; this plan would leave ${I.size}.`,
            { limit: s.connectorsPerSlate }
          );
        g.changed.length && p.push({
          kind: "connect_nodes",
          from: { ids: Y },
          to: u ? { point: { ...u } } : { ids: f.map(x) },
          ids: A,
          ...c.style ? { style: c.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let h;
        if (c.connectionIds) {
          const u = new Set(c.connectionIds);
          h = ne(a).filter(({ association: f }) => u.has(f.id));
        } else {
          const u = new Set(te(a, c.from, `${v} from`).map(x)), f = new Set(te(a, c.to, `${v} to`).map(x));
          h = ne(a).filter(
            ({ association: w }) => u.has(w.parentId) && f.has(w.childId) || f.has(w.parentId) && u.has(w.childId)
          );
        }
        if (g.matched = h.map(({ association: u }) => u.id), h.length || r.warnings.push(`${v} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: u, association: f } of h)
            u.relationships.associations = u.relationships.associations.filter((w) => w !== f);
          g.changed = [...g.matched], r.disconnected.push(...g.matched), h.length && p.push({ kind: "disconnect_nodes", connectionIds: g.matched });
          return;
        }
        for (const { node: u, association: f } of h) {
          const w = JSON.stringify([x(u), f]), I = Object.entries(c.changes).filter(([M]) => !Ge.includes(M));
          for (const [M, A] of I) f[ie[M].field || M] = A;
          const T = Dn(a, u, f, c.changes, v, i);
          JSON.stringify([x(T), f]) !== w && g.changed.push(f.id);
        }
        r.connectionsUpdated.push(...g.matched), h.length && p.push({ kind: "update_connections", connectionIds: g.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const h = te(a, c.target, `${v} target`);
        g.matched = h.map(x), h.length || k();
        const u = h.filter((S) => S.options.isLocked !== !0 ? !0 : (y(S), !1));
        if (!u.length) return;
        const f = c.layout;
        let w;
        if (ht[f]) w = Hn(ht[f], u.map(ce));
        else if (f === "distribute-horizontal" || f === "distribute-vertical")
          w = Xn(f === "distribute-horizontal" ? "horizontal" : "vertical", u.map(ce));
        else if (f === "tidy") {
          const S = new Set(u.map(x)), O = a.nodes.filter((P) => !S.has(x(P))).map(ce);
          w = Fn(u.map(ce), O, { gap: c.gap ?? 20 });
        } else if (f === "tree") {
          const S = ne(a).filter(({ association: j }) => !se(j)).map(({ association: j }) => [j.parentId, j.childId]), O = new Set(u.map(x)), P = a.nodes.filter((j) => !O.has(x(j))).map(ce);
          w = Un(u.map(ce), S, { gap: c.gap ?? 48, obstacles: P });
        }
        if (w) {
          const S = new Map(u.map((O) => [x(O), O]));
          for (const O of w) {
            const P = S.get(O.id), j = [U(P, "x"), U(P, "y")];
            C.x.store(P.options, O.x, o), C.y.store(P.options, O.y, o), lt(j, [O.x, O.y]) || g.changed.push(O.id);
          }
          r.updated.push(...u.map(x)), p.push({ kind: "arrange_nodes", target: { ids: u.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const I = u.map(K), T = c.gap ?? 48, M = Math.min(...I.map((S) => S.x)), A = Math.min(...I.map((S) => S.y)), Y = Math.max(...I.map((S) => S.width), 120), L = Math.max(...I.map((S) => S.height), 80), N = Xe(u.length, c.layout === "circle" ? "row" : c.layout);
        u.forEach((S, O) => {
          const P = [U(S, "x"), U(S, "y")];
          let j, Z;
          if (c.layout === "circle") {
            const W = Math.max(180, u.length * 35), H = Math.PI * 2 * O / u.length;
            j = M + W + Math.cos(H) * W, Z = A + W + Math.sin(H) * W;
          } else
            j = M + N[O].column * (Y + T), Z = A + N[O].row * (L + T);
          C.x.store(S.options, j, o), C.y.store(S.options, Z, o), lt(P, [j, Z]) || g.changed.push(x(S));
        }), r.updated.push(...u.map(x)), p.push({ kind: "arrange_nodes", target: { ids: u.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: T } : {} });
        return;
      }
      case "update_slate": {
        const h = c.changes, u = JSON.stringify(a);
        for (const [f, w] of Object.entries(he))
          h[f] !== void 0 && w.store(a, h[f]);
        JSON.stringify(a) !== u && g.changed.push("slate"), p.push({ kind: "update_slate", changes: h });
        return;
      }
    }
  }), n.requireMatches && r.warnings.length) {
    const c = r.warnings[0];
    throw new X("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return r.unchanged = JSON.stringify(a) === m, { slate: a, materializedPlan: { message: t.message.trim(), operations: p }, report: r };
}
function no(e, t) {
  const n = t.shape;
  if (!n || typeof n != "object" || e.shape !== "custom" || t.width !== void 0 && t.height !== void 0) return;
  const o = Mt(n);
  if (!o) return;
  const s = (i) => Math.round(Math.min(5e3, Math.max(20, i)));
  t.height !== void 0 ? e.width = s(Number(e.height) * o) : e.height = s(Number(e.width || 180) / o);
}
function Mt(e) {
  const t = We(e);
  return t.ok && t.shape.aspect > 0 ? Math.min(10, Math.max(0.1, t.shape.aspect)) : 0;
}
const ut = ["id", ...Object.keys(C), "image", "media", "styleRole"], $e = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), ye = (e) => e.options.isComment === !0;
function At(e, t) {
  const n = e.options, o = (i) => !t || t.includes(i), s = { id: x(e) };
  for (const [i, a] of Object.entries(C)) {
    if (!o(i)) continue;
    const l = a.read(n);
    s[i] = l === void 0 ? null : l;
  }
  return o("image") && (s.image = n.image || null), o("media") && (s.media = Nn(n)), o("styleRole") && (s.styleRole = typeof n.styleRole == "string" ? n.styleRole : null), s;
}
function Tt(e) {
  const t = se(e), n = { id: e.id, from: e.parentId, to: t ? null : e.childId };
  for (const [s, i] of Object.entries(ie)) {
    if (Ge.includes(s)) continue;
    const a = e[i.field ?? s];
    n[s] = a === void 0 ? null : a;
  }
  t && (n.toPoint = e.targetPoint ?? null);
  const o = Bn(e);
  return (o.fromEnd !== "follow" || o.toEnd !== "follow") && Object.assign(n, o), n;
}
const ue = (e) => new X("invalid_selection", 400, e);
function oo(e) {
  const t = {};
  if (e.ids !== void 0 && (t.ids = e.ids), e.within !== void 0 && (t.within = e.within), e.groupId !== void 0 && (t.groupId = e.groupId), e.q !== void 0)
    t.text = e.q, t.all = !0, e.match !== void 0 && (t.match = e.match);
  else if (e.match !== void 0)
    throw ue("match goes with q.");
  if (!Object.keys(t).length) return null;
  const n = de(t, "selection").map(
    (o) => o.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q")
  );
  if (n.length) throw ue(n.join(" "));
  return t;
}
const so = (e) => btoa(encodeURIComponent(JSON.stringify(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function io(e) {
  try {
    const { after: t, at: n } = JSON.parse(decodeURIComponent(atob(e.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof t == "string" && t && Number.isSafeInteger(n) && n >= 0) return { after: t, at: n };
  } catch {
  }
  throw ue("cursor is not one this slate gave. Read again from the first page.");
}
function ro(e, { after: t, at: n }) {
  let o = -1;
  if (e.forEach((s, i) => {
    x(s) === t && (o < 0 || Math.abs(i - n) < Math.abs(o - n)) && (o = i);
  }), o < 0) throw ue("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function ao(e) {
  if (!e.length) return null;
  const t = e.map(K), n = Math.min(...t.map((a) => a.x)), o = Math.min(...t.map((a) => a.y)), s = Math.max(...t.map((a) => a.x + a.width)), i = Math.max(...t.map((a) => a.y + a.height));
  return { x: n, y: o, width: s - n, height: i - o };
}
function No(e, t = {}) {
  const n = Ne(e), o = n.nodes.filter((k) => !ye(k)), s = t.fields;
  if (s !== void 0) {
    const k = s.filter((y) => !ut.includes(y));
    if (k.length) throw ue(`Unknown note field: ${k.join(", ")}. Choose from ${ut.join(", ")}.`);
  }
  const i = t.limit ?? $e.notes;
  if (!Number.isInteger(i) || i < 1 || i > $e.maxNotes)
    throw ue(`limit must be a whole number from 1 to ${$e.maxNotes}.`);
  const a = t.maxChars ?? $e.maxChars, l = oo(t), m = l ? te({ ...n, nodes: o }, l, "selection") : o;
  let b = 0;
  t.cursor !== void 0 && (b = ro(m, io(t.cursor)));
  const p = new Set(n.nodes.filter(ye).map(x)), r = /* @__PURE__ */ new Map();
  for (const { association: k } of ne(n)) {
    if (p.has(k.parentId) || p.has(k.childId)) continue;
    const y = r.get(k.parentId) ?? [];
    y.push(k), r.set(k.parentId, y);
  }
  const c = [], d = [];
  let $ = 0, v = b;
  for (; v < m.length && c.length < i; v += 1) {
    const k = m[v], y = At(k, s), _ = (r.get(x(k)) ?? []).map(Tt), E = JSON.stringify(y).length + JSON.stringify(_).length;
    if (c.length && $ + E > a) break;
    $ += E, c.push(y), d.push(..._);
  }
  const g = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: gn(n.options.containerStyle),
    style: n.options.style && typeof n.options.style == "object" ? n.options.style : null,
    bounds: ao(o),
    nodeCount: m.length,
    nodes: c,
    connections: d,
    nextCursor: v < m.length && g ? so({ after: g.id, at: v - 1 }) : null
  };
}
const co = [
  "id",
  "name",
  "description",
  "enabled",
  "allowDrag",
  "followMe",
  "mindMapMode",
  "autoResizeNodesBasedOnText",
  "useLayoutQuadrants",
  "autoEnableDefaultFilters",
  "showbirdsEye",
  "sizeOfbirdsEye",
  "showMultiSelect",
  "showZoom",
  "showUndoRedo",
  "showStatus",
  "showLocks",
  "isTemplate",
  "basedOnTemplate",
  "allowCollaboration",
  "defaultLineColor",
  "style",
  "layoutType",
  "disableAutoLayoutOfManuallyPositionedNodes",
  "nodeOrder",
  "viewPort",
  "containerStyle"
];
function Lo(e) {
  const t = Ne(e), n = new Set(t.nodes.filter(ye).map(x)), o = {};
  for (const i of co) t.options[i] !== void 0 && (o[i] = t.options[i]);
  const s = t.nodes.filter((i) => !n.has(x(i))).map((i) => ({
    options: i.options,
    relationships: {
      ...i.relationships,
      associations: i.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: o, nodes: s, shareId: `${e?.shareId ?? t.options.shareId ?? ""}` };
}
const lo = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"], ho = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function Mo(e) {
  const t = Ne(e), n = t.nodes.filter((a) => !ye(a)), o = new Set(t.nodes.filter(ye).map((a) => a.options.id)), s = n.slice(0, 150).map((a) => {
    const l = At(a, lo);
    return {
      id: l.id,
      text: `${l.text ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 240),
      shape: l.shape,
      x: l.x,
      y: l.y,
      width: Number(l.width ?? 120),
      height: Number(l.height ?? 80),
      ...l.rotationAngle ? { rotationAngle: l.rotationAngle } : {},
      ...l.locked === !0 ? { locked: !0 } : {},
      ...l.templateCategory ? { templateCategory: l.templateCategory } : {},
      ...l.hiddenControls?.length ? { hiddenControls: l.hiddenControls } : {}
    };
  }), i = ne(t).filter(({ association: a }) => !o.has(a.parentId) && !o.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const l = Tt(a);
    return {
      id: l.id,
      from: l.from,
      to: l.to,
      ..."toPoint" in l ? { toPoint: l.toPoint } : {},
      // Whether each end follows its note, is pinned to a spot on its edge, or is free.
      ..."fromEnd" in l ? { fromEnd: l.fromEnd, toEnd: l.toEnd } : {},
      label: l.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(ho.map((m) => [m, l[m] ?? void 0]))
    };
  });
  return {
    name: t.options.name || "",
    description: t.options.description || "",
    nodeCount: n.length,
    nodes: s,
    connections: i
  };
}
const uo = /^Operation (\d+) (.+)$/s, po = {
  has: "have",
  is: "are",
  needs: "need",
  adds: "add",
  references: "reference",
  requires: "require",
  contains: "contain",
  gives: "give",
  names: "name",
  moves: "move",
  keeps: "keep",
  sets: "set"
};
function pt(e) {
  const t = [...new Set(e)].sort((o, s) => o - s), n = [];
  for (let o = 0; o < t.length; o += 1) {
    let s = o;
    for (; s + 1 < t.length && t[s + 1] === t[s] + 1; ) s += 1;
    n.push(s > o ? `${t[o]}–${t[s]}` : String(t[o])), o = s;
  }
  return n.join(", ");
}
function Ao(e) {
  return String(e ?? "").split(/(?<=\.)\s+(?=[A-Z])/).map((t) => t.trim()).filter(Boolean);
}
function Pt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const o = String(n ?? "").trim();
    if (!o) continue;
    const s = uo.exec(o), i = s ? s[2] : o, a = s ? `op:${i}` : `plan:${o}`, l = t.get(a) ?? { problem: i, operations: [], message: "" };
    s && l.operations.push(Number(s[1])), t.set(a, l);
  }
  for (const n of t.values())
    if (!n.operations.length) n.message = n.problem;
    else if (n.operations.length === 1) n.message = `Operation ${n.operations[0]} ${n.problem}`;
    else {
      const [o, ...s] = n.problem.split(" "), i = po[o];
      n.message = i ? `Operations ${pt(n.operations)} ${[i, ...s].join(" ")}` : `Operations ${pt(n.operations)}: ${n.problem}`;
    }
  return [...t.values()];
}
const fo = (e) => pe.filter((t) => Oe[t].includes(e));
function mo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const { problem: n } of Pt(e)) {
    if (/^count must be an integer/.test(n)) {
      t.add('add_nodes requires count, a whole number: how many notes it adds. With ids, count is ids.length (count 1 with ids ["a"]).');
      continue;
    }
    const o = /^has an unknown field: ([A-Za-z_]+)\.$/.exec(n);
    if (o) {
      const s = o[1], i = fo(s);
      s === "connectionIds" ? t.add("connect_nodes names its new connectors with ids; connectionIds is only for disconnect_nodes and update_connections.") : i.length ? t.add(`${s} belongs to ${i.join(", ")} only.`) : t.add(`No operation takes ${s}.`);
      continue;
    }
    /^needs both x and y/.test(n) && t.add("add_nodes gives both x and y, or neither (then placement says where the notes go)."), /^has an unsupported kind/.test(n) && t.add(`kind is one of ${pe.join(", ")}.`);
  }
  return [...t];
}
function To(e = {}) {
  const t = Ie(e), n = (o, s) => Object.fromEntries(Object.entries(o).map(([i, a]) => [i, { ...V(s(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(pe.map((o) => [o, { fields: Oe[o].filter((s) => s !== "kind") }])),
    noteKeys: { ...n(C, (o) => o.spec(t)), ...n(be, (o) => o.spec) },
    noteStyleKeys: [...Fe],
    connectorKeys: n(ie, (o) => o.spec),
    connectorStyleKeys: [...Ke],
    slateKeys: Object.fromEntries(
      Object.entries(he).map(([o, s]) => [
        o,
        { ...o === "background" ? xt() : o === "style" ? wt() : V(s.spec), description: s.description }
      ])
    ),
    selector: vt(),
    layouts: [...qe],
    presets: [...Ue],
    limits: Ee(e),
    shapes: t.shapes,
    fonts: t.fonts,
    animations: t.animations,
    effects: t.effects,
    errors: {
      invalid_operation_plan: "400: the plan breaks the contract; the message lists each problem.",
      ambiguous_selector: "400: a text selector matched several notes; details.candidates lists them.",
      no_match: "409 on save: an operation matched no notes or connectors. A preview reports it as a warning instead.",
      note_limit: "422: the plan would leave more notes than the slate may hold.",
      connector_limit: "422: one connect_nodes would join more pairs than limits.connectorsPerOperation, or the slate would hold more connectors than limits.connectorsPerSlate.",
      id_taken: "409: add_nodes or connect_nodes named an id already in use; details.ids lists them."
    }
  };
}
function go(e = {}, t = {}) {
  const n = Ie(e), o = Ee(e), s = (r) => {
    const c = V(C[r].spec(n));
    return t.modelTool ? qt(c) : c;
  }, i = (r) => Object.fromEntries(r.map((c) => [c, s(c)])), a = (r) => Object.fromEntries(r.map((c) => [c, { ...s(c), description: C[c].description }])), l = (r) => Object.fromEntries(r.map((c) => [c, V(ie[c].spec)])), m = vt(), b = { type: "array", items: { type: "string" } }, p = Ct();
  return {
    type: "object",
    additionalProperties: !1,
    required: ["message", "operations"],
    properties: {
      message: {
        type: "string",
        description: "A concise, natural response describing exactly what will change. Do not claim an operation that is absent from operations."
      },
      operations: {
        type: "array",
        minItems: 1,
        maxItems: o.operationsPerPlan,
        // On the array as well as its items: a renderer that reads property descriptions only
        // (the exec declarations) still shows which fields each kind takes, and that add_nodes needs count.
        description: yo(o.notesPerAdd),
        items: {
          type: "object",
          additionalProperties: !1,
          required: ["kind"],
          description: `Fields by kind (any other field is refused). ${p}. add_nodes requires count.`,
          properties: {
            kind: { type: "string", enum: [...pe], description: "Which operation this is; it decides the fields the operation may carry." },
            count: {
              type: "integer",
              minimum: 1,
              maximum: o.notesPerAdd,
              description: `add_nodes only, and required there: how many notes it adds, 1 to ${o.notesPerAdd}. With ids, count is normally ids.length (never fewer). Other kinds take no count.`
            },
            ...i(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...Ue],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...b, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: {
              ...b,
              description: "disconnect_nodes and update_connections only: ids of connectors already on the slate. connect_nodes names its new connectors with ids, never connectionIds."
            },
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...V({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...mt] },
                arrangement: { type: "string", enum: [...gt] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            // Not in a model's tool: a model asks the host's add-media action, which fetches and stores the poster.
            ...t.modelTool ? {} : { media: {
              type: "object",
              additionalProperties: !1,
              required: ["url"],
              description: "add_nodes, count 1, no shape, preset or text: a media note, a video from YouTube, Vimeo or Loom drawn as its poster with a play button; it plays where it sits when someone presses play, never on its own. Hosts add videos through their own add-media action, which fetches the title and stores the poster.",
              properties: {
                url: { type: "string", maxLength: G.urlLength, description: "The video's address." },
                title: { type: "string", maxLength: G.titleLength },
                author: { type: "string", maxLength: G.authorLength },
                start: { type: "integer", minimum: 1, maximum: G.startSeconds, description: "Where to start, in seconds." },
                poster: { type: "string", maxLength: G.urlLength, pattern: "^(https://\\S+|/[^/\\\\\\s]\\S*)$", description: "The poster picture: an https address, or a path on this app (/...)." },
                posterWidth: { type: "number", minimum: 1, maximum: 1e4 },
                posterHeight: { type: "number", minimum: 1, maximum: 1e4 }
              }
            } },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...i(Fe), ...l(Ke) }
            },
            target: m,
            from: m,
            to: {
              ...m,
              description: `${m.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...m.properties, point: V({ type: "point" }) }
            },
            layout: {
              type: "string",
              enum: [...qe],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(he).join(", ")}.`,
              properties: {
                ...a(Object.keys(C)),
                ...Object.fromEntries(Object.entries(be).map(([r, c]) => [r, V(c.spec)])),
                ...l(Object.keys(ie)),
                ...Object.fromEntries(
                  Object.entries(he).map(([r, c]) => [r, r === "background" ? xt() : r === "style" ? wt() : V(c.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
function Ct() {
  return pe.map((e) => `${e}: ${Oe[e].filter((t) => t !== "kind").join(", ")}`).join("; ");
}
function yo(e = 20) {
  return [
    `The operations, applied in order. Each operation's kind decides which fields it may carry; any other field is refused. Fields by kind: ${Ct()}.`,
    `add_nodes requires count (1 to ${e}): one add_nodes may add several notes (count 3, ids ["a","b","c"]) or one (count 1, ids ["a"]).`,
    "connect_nodes names its new connectors with ids (one per pair); connectionIds is only for disconnect_nodes and update_connections.",
    'Examples: {"kind":"add_nodes","count":1,"ids":["title"],"shape":"rectangle","text":"Title","x":0,"y":0,"width":240,"height":80}; {"kind":"add_nodes","count":2,"ids":["a","b"],"shape":"rectangle","text":"Step","placement":{"relativeTo":"title","direction":"below","arrangement":"row"}}; {"kind":"connect_nodes","from":{"ids":["title"]},"to":{"ids":["a"]},"ids":["title-a"]}; {"kind":"update_nodes","target":{"ids":["a"]},"changes":{"text":"First step"}}.'
  ].join(" ");
}
const Po = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: go({}, { modelTool: !0 })
});
function Co(e) {
  return `Call applySlateOperations again with a safe, valid plan. ${[...Pt(e).map((n) => n.message), ...mo(e)].join(" ")}`;
}
function jo(e) {
  if (typeof e?.message == "string" && e.message.trim()) return e.message.trim();
  const t = (e?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${t} ${t === 1 ? "change" : "changes"} to the slate.`;
}
const bo = /^\s*-?\d+(?:\.\d+)?\s*$/, wo = /^\s*\d+\s*$/, xo = {
  add_nodes: { count: "integer", x: "number", y: "number", width: "number", height: "number" },
  arrange_nodes: { gap: "number" }
};
function Ro(e) {
  if (!R(e) || !Array.isArray(e.operations)) return { plan: e, changes: [] };
  const t = [], n = e.operations.map((o, s) => {
    if (!R(o) || typeof o.kind != "string") return o;
    const i = `Operation ${s + 1}`, a = xo[o.kind];
    if (!a) return o;
    const l = { ...o };
    for (const [m, b] of Object.entries(a)) {
      const p = l[m];
      typeof p == "string" && (b === "integer" ? wo : bo).test(p) && (l[m] = Number(p), t.push(`${i} ${m} ${JSON.stringify(p)} read as ${l[m]}.`));
    }
    return o.kind === "add_nodes" && l.count === void 0 && Array.isArray(l.ids) && l.ids.length > 0 && l.ids.every((m) => typeof m == "string" && m.length > 0) && (l.count = l.ids.length, t.push(`${i} count read as ${l.count}, one note per id.`)), l;
  });
  return t.length ? { plan: { ...e, operations: n }, changes: t } : { plan: e, changes: t };
}
export {
  Ut as BORDER_STYLES,
  ie as CONNECTOR_KEYS,
  Ke as CONNECTOR_STYLE_KEYS,
  rn as DEFAULT_FONTS,
  co as DOCUMENT_OPTION_KEYS,
  Gt as EFFECTS,
  qe as LAYOUTS,
  sn as LIMITS,
  _o as MEDIA_FRAME_ORIGINS,
  wn as MEDIA_HOST_NAMES,
  G as MEDIA_LIMITS,
  xn as MEDIA_NOTE_SIZE,
  $t as MEDIA_PROVIDERS,
  be as NODE_INTENT_KEYS,
  C as NODE_KEYS,
  Fe as NODE_STYLE_KEYS,
  ut as NOTE_READ_KEYS,
  Oe as OPERATION_FIELDS,
  X as OperationPlanError,
  Ue as PRESETS,
  $e as READ_LIMITS,
  he as SLATE_KEYS,
  pe as SLATE_OPERATION_KINDS,
  Po as SLATE_OPERATION_TOOL,
  Hn as alignPositions,
  Eo as applyPlanToJSON,
  gn as backgroundOf,
  Ee as contractLimits,
  Ie as contractLists,
  To as describeOperations,
  Xn as distributePositions,
  Pt as groupPlanErrors,
  So as isMediaUrl,
  Oo as mediaEmbedUrl,
  Io as mediaLabel,
  jo as naturalOperationFallback,
  Ro as normalizePlan,
  Ct as operationFieldsByKind,
  Co as operationPlanRetryPrompt,
  pt as operationRanges,
  yo as operationsDescription,
  St as parseMediaUrl,
  Ze as parseStart,
  mo as planErrorHints,
  Ao as planErrorsOf,
  Tt as readConnector,
  Nn as readMedia,
  Ot as readMediaValue,
  At as readNote,
  No as readSlate,
  Nt as rotatedBounds,
  go as slateOperationPlanSchema,
  Mo as summarizeSlate,
  Fn as tidyPositions,
  Lo as toSlateDocument,
  Ne as toStoredSlate,
  Un as treePositions,
  Mn as validatePlan
};
