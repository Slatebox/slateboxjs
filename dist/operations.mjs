import { SHAPE_LIMITS as Ce, prepareShape as Ue, storeCustomShape as Bt } from "./shapes.mjs";
import { N as Ht } from "./NoteDefaults-BjVBa8YH.mjs";
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
function Wt() {
  return Array.from(B.keys());
}
const ce = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", Xt = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${ce}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${ce}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${ce}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${ce}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${ce}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${ce}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${ce}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
function Ft() {
  return { ...Xt };
}
function z(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const qt = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, Ut = /^https?:\/\/[^\s]+$/i, yt = 2e3, Gt = /^[A-Za-z0-9_-]{1,64}$/;
function Se(e, t) {
  if (typeof t != "string") return;
  const n = t.trim().toLowerCase();
  return e.find((o) => o.toLowerCase() === n);
}
function Y(e, t, n) {
  switch (e.type) {
    case "string":
      return t === null && e.nullable ? null : typeof t != "string" ? `${n} must be a string.` : t.length > e.maxLength ? `${n} must be at most ${e.maxLength} characters.` : e.minLength && t.trim().length < e.minLength ? `${n} must not be empty.` : null;
    case "number":
      return typeof t != "number" || !Number.isFinite(t) || t < e.min || t > e.max ? `${n} must be a number from ${e.min} to ${e.max}.` : null;
    case "boolean":
      return typeof t == "boolean" ? null : `${n} must be true or false.`;
    case "enum":
      return t === null && e.nullable || (e.caseless ? Se(e.values, t) : e.values.find((s) => s === t)) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")}.`;
    case "shape": {
      if (t && typeof t == "object" && !Array.isArray(t)) {
        const o = Ue(t);
        return o.ok ? null : `${n} is not a usable custom shape: ${o.message}`;
      }
      return Se(e.values, t) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")} (or a custom shape {name, d, fillRule}).`;
    }
    case "list":
      return Array.isArray(t) && t.every((o) => typeof o == "string" && e.values.includes(o)) && new Set(t).size === t.length ? null : `${n} must be a list of different values from: ${e.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof t == "string" && qt.test(t.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return z(t) && Object.keys(t).every((o) => o === "x" || o === "y") && [t.x, t.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return z(t) ? null : `${n} must be an object.`;
    case "url":
      return t === null && e.nullable || typeof t == "string" && t.length <= yt && Ut.test(t.trim()) ? null : `${n} must be an http or https address${e.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return t === null && e.nullable || typeof t == "string" && Gt.test(t) ? null : `${n} must be 1 to 64 letters, digits, _ or -${e.nullable ? ", or null" : ""}.`;
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
      return { oneOf: [{ type: "string", enum: [...e.values] }, Kt()] };
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
        maxLength: yt,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: e.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
function Kt() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["name", "d"],
    description: "A custom shape: one SVG path (several closed parts and holes allowed, no markup), as shapes.generate or shapes.list return it.",
    properties: {
      name: { type: "string", minLength: 1, maxLength: Ce.maxName },
      d: { type: "string", minLength: 1, maxLength: Ce.maxInput, description: "Path data: commands and plain numbers only." },
      fillRule: { type: "string", enum: ["nonzero", "evenodd"], description: "evenodd when the shape has holes." },
      ref: {
        type: "object",
        additionalProperties: !1,
        required: ["id"],
        description: "The shape library entry it came from.",
        properties: { id: { type: "string", pattern: "^[A-Za-z0-9_-]{1,64}$" }, name: { type: "string", maxLength: Ce.maxName } }
      }
    }
  };
}
function Vt(e) {
  return Array.isArray(e.oneOf) && e.oneOf[0]?.type === "string" && e.oneOf[0]?.enum ? { ...e.oneOf[0], ...Object.fromEntries(Object.entries(e).filter(([t]) => t !== "oneOf")) } : e;
}
const F = (e) => ({
  store: (t, n) => {
    t[e] = n;
  },
  read: (t) => t[e]
}), Zt = ["solid", "dashed", "dotted", "combo"], Jt = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), Qt = ["front", "back"], en = ["left", "middle", "right"], tn = ["top", "middle", "bottom"], We = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), ot = Object.keys(We), C = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...F("text") },
  shape: {
    spec: (e) => ({ type: "shape", values: e.shapes }),
    description: "A shape registered with the engine (custom shapes read back as custom:<name>).",
    store: (e, t, n) => {
      if (t && typeof t == "object") {
        const s = Ue(t);
        s.ok && Bt(e, s.shape);
        return;
      }
      const o = Se(n.shapes, t);
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
  width: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Width in canvas units.", ...F("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Height in canvas units.", ...F("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (e, t) => {
      e.rotate = { ...e.rotate || {}, rotationAngle: t }, delete e.rotationAngle;
    },
    read: (e) => Number(e.rotate?.rotationAngle ?? 0)
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ...F("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (e, t) => {
      e.foregroundColor = t, e.fontColor = t;
    },
    read: (e) => e.fontColor ?? e.foregroundColor
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ...F("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ...F("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ...F("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: Zt }),
    description: "Border line style.",
    ...F("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...F("opacity") },
  fontFamily: {
    spec: (e) => ({ type: "enum", values: e.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (e, t, n) => {
      e.fontFamily = Se(n.fonts, t);
    },
    read: (e) => e.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...F("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: en }), description: "Horizontal text alignment.", ...F("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: tn }), description: "Vertical text alignment.", ...F("textYAlign") },
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
    spec: () => ({ type: "list", values: ot }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (e, t) => {
      for (const [n, o] of Object.entries(We)) e[o] = !t.includes(n);
    },
    read: (e) => ot.filter((t) => e[We[t]] === !1)
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (e, t) => {
      e.isLocked = t;
    },
    read: (e) => e.isLocked === !0
  }
}, ve = {
  order: {
    spec: { type: "enum", values: Qt },
    description: "Bring the note to the front or send it to the back."
  }
}, nn = [...Object.keys(C), ...Object.keys(ve)], on = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Ge = Object.keys(C).filter((e) => !on.has(e)), me = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Le = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style", "media", "photo"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, bt = ["left", "right", "above", "below", "center"], wt = ["row", "column", "grid"], sn = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], rn = ["distribute-horizontal", "distribute-vertical"], Ke = ["row", "column", "grid", "circle", ...sn, ...rn, "tidy", "tree"], Ve = ["text", "sticky"], an = 75, cn = Object.freeze({ x: 20, y: 20 }), dn = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), st = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, it = 200, ln = Object.freeze([
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
function Ne(e = {}) {
  return {
    shapes: [...e.shapes ?? Wt()],
    fonts: [...e.fonts ?? ln],
    animations: Object.keys(Ft()),
    effects: [...Jt]
  };
}
function Me(e = {}) {
  return { ...dn, ...e.limits || {} };
}
class D extends Error {
  constructor(t, n, o, s) {
    super(o), this.name = "OperationPlanError", this.code = t, this.status = n, s && (this.details = s);
  }
}
const hn = ["bezier", "orthogonal", "straight", "linear", "curved"], un = ["cubic", "quadratic"], pn = ["solid", "dashed", "dotted"], fn = ["follow", "pinned"], rt = ["follow", "pinned", "top", "right", "bottom", "left"], ae = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: hn }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: un }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  lineDash: { spec: { type: "enum", values: pn }, description: "Solid, dashed or dotted line." },
  labelPosition: {
    spec: { type: "number", min: 0.05, max: 0.95 },
    description: "Where the label sits along the line, from near its start (0.05) to near its end (0.95); the middle (0.5) when unset."
  },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: fn },
    description: "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge that faces the line's other end, where a following end sits)."
  },
  fromEnd: {
    spec: { type: "enum", values: rt },
    description: "The starting end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side."
  },
  toEnd: {
    spec: { type: "enum", values: rt },
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
}, Ze = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"], Je = Object.keys(ae).filter((e) => !Ze.includes(e)), je = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, we = "__free_", xt = ["linear", "radial"], vt = ["horizontal", "vertical", "diagonal"], ke = (e) => ({
  store: (t, n) => {
    t.options[e] = n;
  }
}), at = (e) => ({
  store: (t, n) => {
    t.options.viewPort = { ...t.options.viewPort || {}, [e]: n };
  }
}), ue = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...ke("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...ke("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (e, t) => {
      const n = { ...e.options.containerStyle || {}, ...wn(t) };
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
    ...ke("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...ke("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...at("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...at("snapToObjects") },
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
function mn(e, t) {
  if (!z(e)) return [`${t} must be an object {color, gradient?}.`];
  const n = [];
  for (const s of Object.keys(e))
    s !== "color" && s !== "gradient" && n.push(`${t} has an unknown field: ${s}.`);
  const o = Y({ type: "color" }, e.color, `${t}.color`);
  if (o && n.push(o), e.gradient !== void 0) {
    const s = e.gradient;
    if (!z(s)) return [...n, `${t}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(s))
      ["type", "colors", "direction"].includes(a) || n.push(`${t}.gradient has an unknown field: ${a}.`);
    const i = Y({ type: "enum", values: xt }, s.type, `${t}.gradient.type`);
    if (i && n.push(i), s.direction !== void 0) {
      const a = Y({ type: "enum", values: vt }, s.direction, `${t}.gradient.direction`);
      a && n.push(a);
    }
    !Array.isArray(s.colors) || s.colors.length < 2 || s.colors.length > 8 ? n.push(`${t}.gradient.colors must list 2 to 8 colours.`) : s.colors.forEach((a, h) => {
      const m = Y({ type: "color" }, a, `${t}.gradient.colors[${h}]`);
      m && n.push(m);
    });
  }
  return n;
}
const gn = /^[a-z][a-z-]{0,39}$/, yn = ["bg", "palette", "fonts"];
function bn(e, t, n) {
  if (e === null) return [];
  if (!z(e)) return [`${t} must be an object {id, overrides?, v?} or null.`];
  const o = [];
  for (const i of Object.keys(e))
    ["id", "overrides", "v"].includes(i) || o.push(`${t} has an unknown field: ${i}.`);
  (typeof e.id != "string" || !gn.test(e.id)) && o.push(`${t}.id must be a style name (lowercase letters and hyphens, at most 40).`), e.v !== void 0 && (typeof e.v != "number" || !Number.isInteger(e.v) || e.v < 1 || e.v > 1e3) && o.push(`${t}.v must be a whole number from 1 to 1000.`);
  const s = e.overrides;
  if (s === void 0) return o;
  if (!z(s)) return [...o, `${t}.overrides must be an object.`];
  for (const i of Object.keys(s))
    yn.includes(i) || o.push(`${t}.overrides has an unknown field: ${i}.`);
  if (s.bg !== void 0) {
    const i = Y({ type: "color" }, s.bg, `${t}.overrides.bg`);
    i && o.push(i);
  }
  if (s.palette !== void 0 && (!Array.isArray(s.palette) || s.palette.length < 1 || s.palette.length > 12 ? o.push(`${t}.overrides.palette must list 1 to 12 colors.`) : s.palette.forEach((i, a) => {
    const h = typeof i == "string" ? i.split("-") : [i];
    h.length > 2 && o.push(`${t}.overrides.palette[${a}] must be a color or a "from-to" pair.`);
    for (const m of h) {
      const y = Y({ type: "color" }, m, `${t}.overrides.palette[${a}]`);
      if (y) {
        o.push(y);
        break;
      }
    }
  })), s.fonts !== void 0)
    if (!z(s.fonts)) o.push(`${t}.overrides.fonts must be an object {display?, body?}.`);
    else
      for (const [i, a] of Object.entries(s.fonts))
        i !== "display" && i !== "body" ? o.push(`${t}.overrides.fonts has an unknown field: ${i}.`) : (typeof a != "string" || !n.some((h) => h.toLowerCase() === a.toLowerCase())) && o.push(`${t}.overrides.fonts.${i} must be a font this instance offers.`);
  return o;
}
function wn(e) {
  return {
    backgroundColor: e.color,
    backgroundColorAsGradient: !!e.gradient,
    backgroundGradientType: e.gradient?.type ?? "linear",
    backgroundGradientColors: e.gradient?.colors ?? [],
    backgroundGradientStrategy: e.gradient?.direction ?? "horizontal"
  };
}
function $t() {
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
function kt() {
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
          type: { type: "string", enum: [...xt] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: V({ type: "color" }) },
          direction: { type: "string", enum: [...vt] }
        }
      }
    }
  };
}
function xn(e) {
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
const vn = ["ids", "text", "match", "all", "within", "groupId"], $n = ["ids", "text", "within", "groupId"];
function le(e, t) {
  if (!z(e)) return [`${t} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const s of Object.keys(e))
    vn.includes(s) || n.push(`${t} has an unknown field: ${s}.`);
  const o = $n.filter((s) => e[s] !== void 0);
  if (o.length > 1 && n.push(`${t} must name notes one way, not by ${o.join(" and ")}.`), !o.length && e.all !== !0 && n.push(`${t} must name notes by ids, text, within, groupId or all: true.`), e.ids !== void 0 && (!Array.isArray(e.ids) || !e.ids.length || e.ids.some((s) => typeof s != "string" || !s)) && n.push(`${t}.ids must be a list of note ids.`), e.text !== void 0 && (typeof e.text != "string" || !e.text.trim()) && n.push(`${t}.text must be the text of a note.`), e.match !== void 0) {
    e.text === void 0 && n.push(`${t}.match goes with text.`);
    const s = Y({ type: "enum", values: ["exact", "contains"] }, e.match, `${t}.match`);
    s && n.push(s);
  }
  if (e.all !== void 0 && e.all !== !0 && n.push(`${t}.all must be true when given.`), e.groupId !== void 0 && (typeof e.groupId != "string" || !e.groupId) && n.push(`${t}.groupId must be a group id.`), e.within !== void 0) {
    const s = e.within;
    z(s) && Object.keys(s).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof s[a] == "number" && Number.isFinite(s[a])) && s.width > 0 && s.height > 0 || n.push(`${t}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function _t() {
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
const Ot = ["youtube", "vimeo", "loom"], kn = Object.freeze({
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom"
}), Po = Object.freeze([
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://www.loom.com"
]), _n = Object.freeze({ width: 320, height: 180 }), U = Object.freeze({ urlLength: 2e3, titleLength: 300, authorLength: 120, startSeconds: 86400 }), St = /^[A-Za-z0-9_-]{11}$/, Xe = /^\d{1,12}$/, Fe = /^[0-9a-f]{6,20}$/i, It = /^[0-9a-f]{32}$/i, On = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]), Sn = /* @__PURE__ */ new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]), In = /* @__PURE__ */ new Set(["loom.com", "www.loom.com"]);
function Qe(e) {
  if (!e) return;
  const t = String(e).trim().toLowerCase();
  let n;
  if (/^\d+$/.test(t)) n = Number(t);
  else {
    const o = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
    if (!o || !o[0]) return;
    n = Number(o[1] || 0) * 3600 + Number(o[2] || 0) * 60 + Number(o[3] || 0);
  }
  return Number.isSafeInteger(n) && n > 0 && n <= U.startSeconds ? n : void 0;
}
function et(e) {
  return e.hostname.toLowerCase().replace(/\.$/, "");
}
function En(e) {
  const t = et(e), n = e.pathname.split("/").filter(Boolean);
  let o;
  if (t === "youtu.be" ? o = n[0] : n[0] === "watch" ? o = e.searchParams.get("v") ?? void 0 : ["shorts", "embed", "live", "v"].includes(n[0]) && (o = n[1]), !o || !St.test(o)) return null;
  const s = Qe(e.searchParams.get("t") ?? e.searchParams.get("start"));
  return { provider: "youtube", id: o, url: `https://www.youtube.com/watch?v=${o}`, ...s ? { start: s } : {} };
}
function Ln(e) {
  const t = et(e), n = e.pathname.split("/").filter(Boolean);
  let o, s;
  if (t === "player.vimeo.com") {
    if (n[0] !== "video") return null;
    o = n[1], s = e.searchParams.get("h") ?? void 0;
  } else {
    const a = n.findIndex((m) => Xe.test(m));
    if (a < 0) return null;
    o = n[a];
    const h = n[a + 1];
    h && Fe.test(h) && (s = h);
  }
  if (!o || !Xe.test(o)) return null;
  s !== void 0 && !Fe.test(s) && (s = void 0);
  const i = Qe((e.hash.match(/t=([0-9hms]+)/i) || [])[1]);
  return {
    provider: "vimeo",
    id: o,
    url: s ? `https://vimeo.com/${o}/${s}` : `https://vimeo.com/${o}`,
    ...s ? { hash: s } : {},
    ...i ? { start: i } : {}
  };
}
function Nn(e) {
  const t = e.pathname.split("/").filter(Boolean);
  if (!["share", "embed"].includes(t[0])) return null;
  const n = t[1] ? t[1].split("-").pop() : void 0;
  if (!n || !It.test(n)) return null;
  const o = n.toLowerCase(), s = Qe(e.searchParams.get("t"));
  return { provider: "loom", id: o, url: `https://www.loom.com/share/${o}`, ...s ? { start: s } : {} };
}
function Et(e) {
  if (typeof e != "string") return null;
  const t = e.trim();
  if (!t || t.length > U.urlLength || /\s/.test(t)) return null;
  let n;
  try {
    n = new URL(/^[a-z][a-z0-9+.-]*:/i.test(t) ? t : `https://${t}`);
  } catch {
    return null;
  }
  if (n.protocol !== "https:" && n.protocol !== "http:" || n.username || n.password || n.port) return null;
  const o = et(n);
  return On.has(o) ? En(n) : Sn.has(o) ? Ln(n) : In.has(o) ? Nn(n) : null;
}
const Co = (e) => Et(e) !== null;
function jo(e, { play: t = !1 } = {}) {
  const n = t ? "1" : "0";
  switch (e?.provider) {
    case "youtube": {
      if (!St.test(e.id)) return null;
      const o = new URLSearchParams({ autoplay: n, rel: "0", playsinline: "1", modestbranding: "1" });
      return e.start && o.set("start", String(e.start)), `https://www.youtube-nocookie.com/embed/${e.id}?${o}`;
    }
    case "vimeo": {
      if (!Xe.test(e.id)) return null;
      const o = new URLSearchParams({ autoplay: n, dnt: "1" });
      return e.hash && Fe.test(e.hash) && o.set("h", e.hash), `https://player.vimeo.com/video/${e.id}?${o}${e.start ? `#t=${e.start}s` : ""}`;
    }
    case "loom": {
      if (!It.test(e.id)) return null;
      const o = new URLSearchParams({ autoplay: n, hide_owner: "true", hideEmbedTopBar: "true" });
      return e.start && o.set("t", String(e.start)), `https://www.loom.com/embed/${e.id}?${o}`;
    }
    default:
      return null;
  }
}
const Mn = /^(?:https:\/\/[^\s"'<>]+|\/sbimages\/media-posters(?:\/|%2F)(?!.*(?:\.\.|%2e%2e))[^\s"'<>\\]*)$/i, ct = (e, t) => typeof e != "string" ? void 0 : e.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, t) || void 0, dt = (e) => typeof e == "number" && Number.isFinite(e) && e > 0 && e <= 1e4 ? Math.round(e) : void 0;
function Lt(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return { ok: !1, message: "must be an object with the video's url." };
  const t = e, n = ["url", "provider", "id", "hash", "start", "title", "author", "poster", "posterWidth", "posterHeight"], o = Object.keys(t).filter((p) => !n.includes(p));
  if (o.length) return { ok: !1, message: `has fields it does not take: ${o.join(", ")}.` };
  const s = Et(t.url);
  if (!s) return { ok: !1, message: "url must be a YouTube, Vimeo or Loom video address." };
  if (t.provider !== void 0 && t.provider !== s.provider) return { ok: !1, message: "provider does not match the url." };
  if (t.id !== void 0 && t.id !== s.id) return { ok: !1, message: "id does not match the url." };
  if (t.poster !== void 0 && (typeof t.poster != "string" || t.poster.length > U.urlLength || !Mn.test(t.poster)))
    return { ok: !1, message: "poster must be an https address or a poster this app stored (/sbimages/media-posters/...)." };
  const i = t.start === void 0 ? s.start : Number.isSafeInteger(t.start) && t.start > 0 && t.start <= U.startSeconds ? t.start : NaN;
  if (Number.isNaN(i)) return { ok: !1, message: `start must be whole seconds from 1 to ${U.startSeconds}.` };
  const a = ct(t.title, U.titleLength), h = ct(t.author, U.authorLength), m = dt(t.posterWidth), y = dt(t.posterHeight);
  return {
    ok: !0,
    media: {
      ...s,
      ...i ? { start: i } : {},
      ...a ? { title: a } : {},
      ...h ? { author: h } : {},
      ...typeof t.poster == "string" ? { poster: t.poster } : {},
      ...m && y ? { posterWidth: m, posterHeight: y } : {}
    }
  };
}
function Tn(e, t) {
  e.media = { ...t }, e.text = "", e.shape = "rectangle", e.vectorPath = "rectangle", e.shapeHint = "rectangle", e.imageFit = "cover", e.backgroundColor = "#111418", e.borderColor = "#111418", e.showTextTab = !1, t.poster ? (e.image = t.poster, e.imageOrigWidth = t.posterWidth || 480, e.imageOrigHeight = t.posterHeight || 360) : delete e.image;
}
function An(e) {
  const t = e?.media;
  return !t || typeof t != "object" || !Ot.includes(t.provider) ? null : {
    provider: t.provider,
    url: t.url,
    ...t.title ? { title: t.title } : {},
    ...t.author ? { author: t.author } : {},
    ...t.start ? { start: t.start } : {},
    ...t.poster ? { poster: t.poster } : {}
  };
}
function Ro(e) {
  if (!e || !Ot.includes(e.provider)) return "Video";
  const t = kn[e.provider];
  return e.title ? `Video: ${e.title} (${t})` : `${t} video`;
}
const ee = Object.freeze({ urlLength: 2e3, dimension: 1e4, altLength: 300 }), Pn = 320, Cn = /^(?:https:\/\/[^\s"'<>]+|\/(?:files|sbimages)\/(?!.*(?:\.\.|%2e%2e))[^\s"'<>\\]+)$/i, pe = (e) => typeof e == "number" && Number.isFinite(e) && e >= 1 && e <= ee.dimension ? Math.round(e) : void 0, jn = (e, t) => typeof e != "string" ? void 0 : e.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, t) || void 0;
function Nt(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return { ok: !1, message: "must be an object with the photo's url, width and height." };
  const t = e, n = Object.keys(t).filter((a) => !["url", "width", "height", "alt"].includes(a));
  if (n.length) return { ok: !1, message: `has fields it does not take: ${n.join(", ")}.` };
  if (typeof t.url != "string" || t.url.length > ee.urlLength || !Cn.test(t.url))
    return { ok: !1, message: "url must be an https address or a photo this app stored (/files/... or /sbimages/...)." };
  const o = pe(t.width), s = pe(t.height);
  if (!o || !s) return { ok: !1, message: `width and height must be numbers from 1 to ${ee.dimension}.` };
  if (t.alt !== void 0 && (typeof t.alt != "string" || t.alt.length > ee.altLength))
    return { ok: !1, message: `alt must be text of at most ${ee.altLength} characters.` };
  const i = jn(t.alt, ee.altLength);
  return { ok: !0, photo: { url: t.url, width: o, height: s, ...i ? { alt: i } : {} } };
}
function Rn(e, t) {
  const n = pe(e) ?? 1, o = pe(t) ?? 1, s = Pn / Math.max(n, o);
  return { width: Math.max(20, Math.round(n * s)), height: Math.max(20, Math.round(o * s)) };
}
function zn(e, t) {
  e.photo = { ...t }, e.text = "", e.shape = "rectangle", e.vectorPath = "rectangle", e.shapeHint = "rectangle", e.image = t.url, e.imageOrigWidth = t.width, e.imageOrigHeight = t.height, e.imageFit = "cover", e.showTextTab = !1;
}
function Yn(e) {
  const t = e?.photo;
  if (!t || typeof t != "object" || typeof e.image != "string" || !e.image) return null;
  const n = pe(t.width), o = pe(t.height);
  return !n || !o ? null : { url: e.image, width: n, height: o, ...typeof t.alt == "string" && t.alt ? { alt: t.alt } : {} };
}
const Dn = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, Mt = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function ye(e, t, n, o, s, { required: i = !0, plural: a = `${o}s` } = {}) {
  const h = [];
  if (e === void 0 && !i) return h;
  if (!z(e) || i && !Object.keys(e).length)
    return [i ? `${n} requires at least one ${o}.` : `${n} ${a} must be an object.`];
  const m = Object.keys(e).filter((y) => !t.includes(y));
  m.length && h.push(`${n} contains unsupported ${a}: ${m.join(", ")}.`);
  for (const [y, p] of Object.entries(e))
    t.includes(y) && s(y, p, h);
  return h;
}
function lt(e, t) {
  return (n, o, s) => {
    const i = ve[n]?.spec ?? C[n].spec(e), a = Y(i, o, `${t} ${n}`);
    a && s.push(a);
  };
}
function ht(e) {
  return (t, n, o) => {
    const s = Y(ae[t].spec, n, `${e} ${t}`);
    s && o.push(s);
  };
}
function Q(e) {
  return Array.isArray(e) && e.length > 0 && e.every((t) => typeof t == "string" && t.length > 0);
}
function Bn(e, t = {}) {
  const n = Ne(t), o = Me(t), s = t.userMessage || "";
  if (!z(e)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const i = [];
  for (const r of Object.keys(e))
    r !== "message" && r !== "operations" && i.push(`The plan has an unknown field: ${r}.`);
  (typeof e.message != "string" || !e.message.trim()) && i.push("A natural completion message is required."), !Array.isArray(e.operations) || e.operations.length === 0 ? i.push("At least one slate operation is required.") : e.operations.length > o.operationsPerPlan && i.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const a = !!t.existingNodeIds?.length, h = new Set((t.existingNodeIds || []).filter(Boolean)), m = !!t.existingConnectionIds?.length, y = new Set((t.existingConnectionIds || []).filter(Boolean)), p = (r, c) => {
    a && z(r) && Array.isArray(r.ids) && r.ids.some((d) => !h.has(d)) && i.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(e.operations) ? e.operations : []).forEach((r, c) => {
    const d = `Operation ${c + 1}`;
    if (!z(r) || !me.includes(r.kind)) {
      i.push(`${d} has an unsupported kind.`);
      return;
    }
    const v = Le[r.kind], x = Object.keys(r).filter((g) => !v.includes(g));
    for (const g of x) i.push(`${d} has an unknown field: ${g}.`);
    switch (r.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(r.count) || r.count < 1 || r.count > o.notesPerAdd) && i.push(`${d} count must be an integer from 1 to ${o.notesPerAdd}.`), r.preset !== void 0) {
          const S = Y({ type: "enum", values: Ve }, r.preset, `${d} preset`);
          S && i.push(S);
        }
        const g = z(r.placement) && r.placement.connect === !0, $ = r.media !== void 0;
        if ($) {
          const S = Lt(r.media);
          S.ok || i.push(`${d} media ${S.message}`), r.count !== 1 && i.push(`${d} adds one media note at a time (count 1).`);
          for (const l of ["shape", "preset", "text"])
            r[l] !== void 0 && i.push(`${d} is a media note, so it takes no ${l}.`);
          g && i.push(`${d} is a media note, so it cannot copy and connect from another note.`);
        }
        const k = r.photo !== void 0;
        if (k) {
          const S = Nt(r.photo);
          S.ok || i.push(`${d} photo ${S.message}`), r.count !== 1 && i.push(`${d} adds one photo note at a time (count 1).`);
          for (const l of ["shape", "preset", "text", "media"])
            r[l] !== void 0 && i.push(`${d} is a photo note, so it takes no ${l}.`);
          g && i.push(`${d} is a photo note, so it cannot copy and connect from another note.`);
        }
        if (!$ && !k && (r.shape !== void 0 || r.preset === void 0 && !g)) {
          const S = Y(C.shape.spec(n), r.shape, `${d} shape`);
          S && i.push(S);
        }
        for (const S of ["text", "width", "height"]) {
          if (r[S] === void 0) continue;
          const l = Y(C[S].spec(n), r[S], `${d} ${S}`);
          l && i.push(l);
        }
        r.x === void 0 != (r.y === void 0) && i.push(`${d} needs both x and y, or neither.`);
        for (const S of ["x", "y"]) {
          if (r[S] === void 0) continue;
          const l = Y(C[S].spec(n), r[S], `${d} ${S}`);
          l && i.push(l);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : r.ids.some((S) => !st.test(S)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(r.count) && r.ids.length > r.count && i.push(`${d} has more ids than notes to add.`));
        const O = r.placement;
        if (O !== void 0)
          if (!z(O))
            i.push(`${d} placement must be an object.`);
          else {
            const S = r.x !== void 0 ? ["arrangement", "gap", ...O.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const l of Object.keys(O))
              S.includes(l) || i.push(
                r.x !== void 0 && ["relativeTo", "direction", "connect"].includes(l) ? `${d} gives x and y, so placement cannot also give ${l}.` : `${d} placement has an unknown field: ${l}.`
              );
            O.connect !== void 0 && (typeof O.connect != "boolean" ? i.push(`${d} placement.connect must be true or false.`) : O.connect && (O.relativeTo === void 0 && i.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), O.direction === "center" && i.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), O.relativeTo !== void 0 && typeof O.relativeTo != "string" ? i.push(`${d} placement.relativeTo must be a note id.`) : O.relativeTo && a && !h.has(O.relativeTo) && i.push(`${d} references a note that is not in the slate.`);
            for (const [l, u] of [["direction", bt], ["arrangement", wt]]) {
              if (O[l] === void 0) continue;
              const f = Y({ type: "enum", values: u }, O[l], `${d} placement.${l}`);
              f && i.push(f);
            }
            if (O.gap !== void 0) {
              const l = Y({ type: "number", min: 0, max: 2e3 }, O.gap, `${d} placement.gap`);
              l && i.push(l);
            }
          }
        i.push(...ye(r.style, Ge, d, "node style", lt(n, d), { required: !1 })), Q(r.ids) && r.ids.forEach((S) => h.add(S));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const g = le(r.target, `${d} target`);
        if (i.push(...g), g.length || p(r.target, d), r.kind === "update_nodes" && i.push(...ye(r.changes, nn, d, "node change", lt(n, d), { plural: "changes" })), r.kind === "delete_nodes" && z(r.target) && r.target.all === !0 && Object.keys(r.target).length === 1 && !Mt.test(s) && i.push(`${d} cannot delete every note without an explicit request.`), r.kind === "arrange_nodes") {
          const $ = Y({ type: "enum", values: Ke }, r.layout, `${d} layout`);
          if ($ && i.push($), r.gap !== void 0) {
            const k = Y({ type: "number", min: 0, max: 2e3 }, r.gap, `${d} gap`);
            k && i.push(k);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const g = le(r.target, `${d} target`);
        if (i.push(...g), g.length || p(r.target, d), r.offset !== void 0) {
          const $ = Y({ type: "point" }, r.offset, `${d} offset`);
          $ && i.push($);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : r.ids.some(($) => !st.test($)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : z(r.target) && Q(r.target.ids) && r.ids.length > r.target.ids.length && i.push(`${d} has more ids than notes to copy.`)), Q(r.ids) && r.ids.forEach(($) => h.add($));
        return;
      }
      case "connect_nodes": {
        const g = le(r.from, `${d} from`);
        if (i.push(...g), g.length || p(r.from, d), z(r.to) && r.to.point !== void 0) {
          Object.keys(r.to).length !== 1 && i.push(`${d} to must be a note selector or {point}, not both.`);
          const O = Y({ type: "point" }, r.to.point, `${d} to.point`);
          O && i.push(O);
        } else {
          const O = le(r.to, `${d} to`);
          i.push(...O), O.length || p(r.to, d);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different connector ids.`) : r.ids.some((O) => O.length > it) && i.push(`${d} connector ids can be at most ${it} characters.`)), i.push(...ye(r.style, Je, d, "connection style", ht(d), { required: !1 })), Q(r.ids) && r.ids.forEach((O) => y.add(O));
        const $ = r.from?.ids, k = r.to?.ids;
        Q($) && Q(k) && $.forEach((O) => k.forEach((S) => y.add(`${O}->${S}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const g = r.connectionIds !== void 0, $ = r.from !== void 0 || r.to !== void 0;
        if (g && $ && i.push(`${d} names connectors by connectionIds or by from and to, not both.`), !g && !$ && i.push(`${d} requires connectionIds or both from and to note selectors.`), g && (Q(r.connectionIds) ? m && r.connectionIds.some((k) => !y.has(k)) && i.push(`${d} references connectors that are not in the slate.`) : i.push(`${d} connectionIds must be a list of connector ids.`)), $)
          for (const k of ["from", "to"]) {
            const O = le(r[k], `${d} ${k}`);
            i.push(...O), O.length || p(r[k], d);
          }
        if (r.kind === "update_connections") {
          i.push(...ye(r.changes, Object.keys(ae), d, "connection change", ht(d)));
          const k = z(r.changes) ? r.changes : {};
          k.toNote !== void 0 && k.toPoint !== void 0 && i.push(`${d} moves the far end with toNote or toPoint, not both.`), k.fromNote !== void 0 && k.fromPoint !== void 0 && i.push(`${d} moves the starting end with fromNote or fromPoint, not both.`), k.ends !== void 0 && (k.fromEnd !== void 0 || k.toEnd !== void 0) && i.push(`${d} sets ends, or fromEnd and toEnd, not both.`), k.toPoint !== void 0 && k.toEnd !== void 0 && i.push(`${d} cannot pin a far end it leaves free (toPoint with toEnd).`), k.fromPoint !== void 0 && (k.toPoint !== void 0 || k.fromEnd !== void 0) && i.push(`${d} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        i.push(
          ...ye(r.changes, Object.keys(ue), d, "slate change", (g, $, k) => {
            if (g === "background") {
              k.push(...mn($, `${d} background`));
              return;
            }
            if (g === "style") {
              k.push(...bn($, `${d} style`, n.fonts));
              return;
            }
            const O = Y(ue[g].spec, $, `${d} ${g}`);
            O && k.push(O);
          })
        ), z(r.changes) && r.changes.background !== void 0 && !Dn.test(s) && i.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: i.length === 0, errors: i };
}
const w = (e) => e.options.id, q = (e, t) => C[t].read(e.options), G = (e) => ({
  x: q(e, "x"),
  y: q(e, "y"),
  width: Number(e.options.width ?? 120),
  height: Number(e.options.height ?? 80)
}), re = (e) => !!e.targetPoint || `${e.childId || ""}`.startsWith(we), be = (e, t) => `${e}->${t}`;
function Ie(e) {
  return JSON.parse(JSON.stringify(e ?? null));
}
function Te(e) {
  const t = e?.nodes && !Array.isArray(e.nodes), n = t ? e.v2 ?? e : null, o = t ? {
    options: Ie(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((s) => Hn(s?.v2 ?? s))
  } : Ie(e || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((s) => {
    const i = s?.options ? s : { options: { ...s || {} }, relationships: s?.relationships };
    return i.options.relationships && delete i.options.relationships, i.relationships = { ...i.relationships || {}, associations: [...i.relationships?.associations || []] }, i.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = i.options.id), a.id || (a.id = be(a.parentId, a.childId));
    }), i;
  }), o;
}
function Hn(e) {
  const t = Ie(e.options || {});
  t.x !== void 0 && (t.xPos = t.x, delete t.x), t.y !== void 0 && (t.yPos = t.y, delete t.y), t.fontColor !== void 0 && t.foregroundColor === void 0 && (t.foregroundColor = t.fontColor);
  const n = typeof e.getRotation == "function" ? e.getRotation() : void 0;
  typeof n == "number" && (t.rotate = { ...t.rotate || {}, rotationAngle: n });
  const o = e.relationships, s = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: t,
    relationships: {
      associations: s.map(({ parent: i, child: a, ...h }) => Ie(h))
    }
  };
}
function se(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const o of e.nodes)
    for (const s of o.relationships.associations)
      t.has(s.id) || (t.add(s.id), n.push({ node: o, association: s }));
  return n;
}
const Re = (e) => `${e ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function oe(e, t, n) {
  const o = e.nodes;
  if (t.ids)
    return t.ids.map((s) => o.find((i) => w(i) === s)).filter(Boolean);
  if (t.text !== void 0) {
    const s = Re(t.text), i = o.filter(
      (a) => t.match === "contains" ? Re(a.options.text).includes(s) : Re(a.options.text) === s
    );
    if (i.length > 1 && t.all !== !0)
      throw new D(
        "ambiguous_selector",
        400,
        `${n} "${t.text}" matches ${i.length} notes (${i.map(w).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: i.map((a) => ({ id: w(a), text: a.options.text ?? "" })) }
      );
    return i;
  }
  if (t.within) {
    const s = t.within;
    return o.filter((i) => {
      const a = G(i);
      return a.x >= s.x && a.y >= s.y && a.x + a.width <= s.x + s.width && a.y + a.height <= s.y + s.height;
    });
  }
  return t.groupId !== void 0 ? o.filter((s) => s.options.groupId === t.groupId) : t.all === !0 ? [...o] : [];
}
const he = (e) => Math.round(e * 1e4) / 1e4, ut = (e) => Math.max(0, Math.min(1, e));
function Wn(e) {
  const t = ut(e.x), n = ut(e.y), o = [t, 1 - t, n, 1 - n], s = Math.min(...o);
  return s === o[0] ? { x: 0, y: he(n) } : s === o[1] ? { x: 1, y: he(n) } : s === o[2] ? { x: he(t), y: 0 } : { x: he(t), y: 1 };
}
function Xn(e) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[e];
}
function Tt(e, t, n) {
  if (!n) return { ...e };
  const o = n * Math.PI / 180, s = e.x - t.x, i = e.y - t.y;
  return { x: t.x + s * Math.cos(o) - i * Math.sin(o), y: t.y + s * Math.sin(o) + i * Math.cos(o) };
}
function Fn(e, t) {
  const n = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, o = Tt(t, n, -(e.rotation || 0));
  return { x: (o.x - e.x) / (e.width || 1), y: (o.y - e.y) / (e.height || 1) };
}
function qn(e, t) {
  const n = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, o = Tt({ x: e.x + t.x * e.width, y: e.y + t.y * e.height }, n, e.rotation || 0);
  return { x: he(o.x), y: he(o.y) };
}
function Un(e, t) {
  const n = Fn(e, t), o = (n.x - 0.5) * (e.width || 1), s = (n.y - 0.5) * (e.height || 1);
  if (Math.abs(o) < 1e-9 && Math.abs(s) < 1e-9) return { x: 0.5, y: 0 };
  const i = o !== 0 ? e.width / 2 / Math.abs(o) : 1 / 0, a = s !== 0 ? e.height / 2 / Math.abs(s) : 1 / 0, h = Math.min(i, a);
  return Wn({ x: 0.5 + o * h / (e.width || 1), y: 0.5 + s * h / (e.height || 1) });
}
function Gn(e) {
  const t = { ...e };
  return t.showParentArrow = e.showChildArrow !== !1, t.showChildArrow = !!e.showParentArrow, t.sourceAnchor = e.targetAnchor ?? null, t.targetAnchor = null, t;
}
const ze = (e) => ({ ...G(e), rotation: Number(q(e, "rotationAngle")) || 0 }), Kn = (e) => ({ x: e.x + e.width / 2, y: e.y + e.height / 2 });
function Vn(e, t, n, o, s, i) {
  const a = (d) => e.nodes.find((v) => w(v) === d), h = (d) => {
    throw new D("invalid_operation_plan", 400, `${s} ${d}`);
  }, m = (d) => {
    throw new D("no_match", 409, `${s} names no note ${JSON.stringify(d)} on the slate.`);
  }, y = (d, v) => {
    d !== v && (d.relationships.associations = d.relationships.associations.filter((x) => x !== n), v.relationships.associations.push(n));
  };
  let p = t;
  if (o.toNote !== void 0) {
    const d = a(o.toNote) ?? m(o.toNote);
    n.childId = w(d), delete n.targetPoint, n.targetAnchor = null;
  } else o.toPoint !== void 0 && (re(n) || (n.childId = `${we}${i()}`), n.targetPoint = { x: o.toPoint.x, y: o.toPoint.y }, n.targetAnchor = null);
  if (o.fromNote !== void 0) {
    const d = a(o.fromNote) ?? m(o.fromNote);
    n.parentId = w(d), n.sourceAnchor = null, y(p, d), p = d;
  } else if (o.fromPoint !== void 0) {
    re(n) && h(`keeps one end on a note: the far end of ${n.id} is already free.`);
    const d = a(n.childId) ?? m(n.childId), v = Gn(n);
    for (const x of Object.keys(n)) delete n[x];
    Object.assign(n, v, {
      parentId: w(d),
      childId: `${we}${i()}`,
      targetPoint: { x: o.fromPoint.x, y: o.fromPoint.y }
    }), y(p, d), p = d;
  }
  n.parentId === n.childId && h(`cannot connect ${n.id} from a note to itself.`);
  const r = (d) => {
    if (d === "target" && re(n)) return n.targetPoint;
    const v = a(d === "source" ? n.parentId : n.childId);
    if (!v) return null;
    const x = d === "source" ? n.sourceAnchor : n.targetAnchor;
    return x ? qn(ze(v), x) : Kn(ze(v));
  }, c = (d, v, x) => {
    if (d === "target" && re(n)) {
      x && h(`cannot pin or follow the far end of ${n.id}: it is free, on no note.`);
      return;
    }
    const g = d === "source" ? "sourceAnchor" : "targetAnchor";
    if (v === "follow") n[g] = null;
    else if (v !== "pinned") n[g] = Xn(v);
    else if (!n[g]) {
      const $ = a(d === "source" ? n.parentId : n.childId), k = r(d === "source" ? "target" : "source");
      $ && k && (n[g] = Un(ze($), k));
    }
  };
  return o.ends !== void 0 && (c("source", o.ends, !1), c("target", o.ends, !1)), o.fromEnd !== void 0 && c("source", o.fromEnd, !0), o.toEnd !== void 0 && c("target", o.toEnd, !0), p;
}
function Zn(e) {
  return {
    fromEnd: e.sourceAnchor ? "pinned" : "follow",
    toEnd: re(e) ? "free" : e.targetAnchor ? "pinned" : "follow"
  };
}
function At(e) {
  const { x: t, y: n, width: o, height: s } = e, i = e.rotationAngle || 0;
  if (!i) return { minX: t, minY: n, maxX: t + o, maxY: n + s };
  const a = t + o / 2, h = n + s / 2, m = i * Math.PI / 180, y = Math.cos(m), p = Math.sin(m);
  let r = 1 / 0, c = 1 / 0, d = -1 / 0, v = -1 / 0;
  for (const [g, $] of [[t, n], [t + o, n], [t + o, n + s], [t, n + s]]) {
    const k = g - a, O = $ - h, S = a + k * y - O * p, l = h + k * p + O * y;
    r = Math.min(r, S), c = Math.min(c, l), d = Math.max(d, S), v = Math.max(v, l);
  }
  const x = (g) => Math.round(g * 1e6) / 1e6;
  return { minX: x(r), minY: x(c), maxX: x(d), maxY: x(v) };
}
function Jn(e, t) {
  if (t.length < 2) return [];
  const n = t.map(At), o = Math.min(...n.map((y) => y.minX)), s = Math.max(...n.map((y) => y.maxX)), i = Math.min(...n.map((y) => y.minY)), a = Math.max(...n.map((y) => y.maxY)), h = (o + s) / 2, m = (i + a) / 2;
  return t.map((y, p) => {
    const r = n[p];
    let { x: c, y: d } = y;
    return e === "left" ? c += o - r.minX : e === "right" ? c += s - r.maxX : e === "centerH" ? c += h - (r.minX + r.maxX) / 2 : e === "top" ? d += i - r.minY : e === "bottom" ? d += a - r.maxY : e === "middle" && (d += m - (r.minY + r.maxY) / 2), { id: y.id, x: c, y: d };
  });
}
function Qn(e, t) {
  if (t.length < 3) return [];
  const n = t.map((c, d) => ({ box: c, index: d, b: At(c) })), o = e === "horizontal", s = (c) => o ? c.b.minX : c.b.minY, i = (c) => o ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, a = [...n].sort((c, d) => s(c) - s(d) || c.index - d.index), h = s(a[0]), y = (a.reduce((c, d) => Math.max(c, s(d) + i(d)), -1 / 0) - h - a.reduce((c, d) => c + i(d), 0)) / (a.length - 1), p = /* @__PURE__ */ new Map();
  let r = h;
  for (const c of a) {
    const d = r - s(c);
    p.set(c.index, {
      id: c.box.id,
      x: o ? c.box.x + d : c.box.x,
      y: o ? c.box.y : c.box.y + d
    }), r += i(c) + y;
  }
  return n.map((c) => p.get(c.index));
}
function Ee(e, t, n) {
  const o = Math.min(e.x + e.width + n - t.x, t.x + t.width + n - e.x), s = Math.min(e.y + e.height + n - t.y, t.y + t.height + n - e.y);
  return o > 0 && s > 0 ? { x: o, y: s } : null;
}
const eo = 4e6;
function to(e, t, { gap: n = 20 } = {}) {
  const o = e.map((p) => ({ ...p })), s = t.map((p) => ({ ...p })), i = (p, r, c, d, v) => {
    const x = p.x + p.width / 2 - (r.x + r.width / 2), g = p.y + p.height / 2 - (r.y + r.height / 2);
    c.y <= c.x ? p.y += (g > 0 || g === 0 && v > 0 ? 1 : -1) * c.y * d : p.x += (x > 0 || x === 0 && v > 0 ? 1 : -1) * c.x * d;
  }, a = Math.max(1, o.length * (s.length + o.length / 2)), h = Math.max(1, Math.min(1e3, Math.floor(eo / a)));
  let m = !1;
  for (let p = 0; p < h; p += 1) {
    let r = !1;
    for (let c = 0; c < o.length; c += 1) {
      for (const d of s) {
        const v = Ee(o[c], d, n);
        v && (i(o[c], d, v, 1, 1), r = !0);
      }
      for (let d = c + 1; d < o.length; d += 1) {
        const v = Ee(o[c], o[d], n);
        v && (i(o[c], o[d], v, 0.5, -1), i(o[d], o[c], v, 0.5, 1), r = !0);
      }
    }
    if (!r) {
      m = !0;
      break;
    }
  }
  const y = (p) => Math.round(p * 100) / 100;
  for (const p of o)
    p.x = y(p.x), p.y = y(p.y);
  return m || no(o, s, n), o.map(({ id: p, x: r, y: c }) => ({ id: p, x: r, y: c }));
}
function no(e, t, n) {
  const o = [...t], s = [];
  for (const d of e)
    o.some((v) => Ee(d, v, n)) ? s.push(d) : o.push(d);
  if (!s.length) return;
  const i = Math.min(...e.map((d) => d.x)), a = o.length ? Math.max(...o.map((d) => d.y + d.height)) + n : Math.min(...e.map((d) => d.y)), h = o.length ? Math.max(...o.map((d) => d.x + d.width)) : i, m = s.reduce((d, v) => d + (v.width + n) * (v.height + n), 0), y = Math.max(h - i, Math.sqrt(m) * 1.5, ...s.map((d) => d.width));
  let p = i, r = a, c = 0;
  for (const d of s)
    p > i && p + d.width > i + y && (p = i, r += c + n, c = 0), d.x = p, d.y = r, p += d.width + n, c = Math.max(c, d.height);
}
function oo(e, t, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!e.length) return [];
  const s = new Map(e.map((l) => [l.id, l])), i = new Map(e.map((l) => [l.id, []])), a = new Map(e.map((l) => [l.id, 0]));
  for (const [l, u] of t)
    !s.has(l) || !s.has(u) || l === u || (i.get(l).push(u), a.set(u, a.get(u) + 1));
  const h = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), y = [], p = (l) => {
    y.push(l), m.set(l, 0), h.set(l, []);
    const u = [l];
    for (; u.length; ) {
      const f = u.shift();
      for (const b of i.get(f))
        m.has(b) || (m.set(b, m.get(f) + 1), h.set(b, []), h.get(f).push(b), u.push(b));
    }
  };
  for (const l of e) a.get(l.id) === 0 && !m.has(l.id) && p(l.id);
  for (const l of e) m.has(l.id) || p(l.id);
  const r = [];
  for (const l of e) {
    const u = m.get(l.id);
    r[u] = Math.max(r[u] ?? 0, l.height);
  }
  const c = Math.min(...e.map((l) => l.x)), d = Math.min(...e.map((l) => l.y)), v = [];
  r.forEach((l, u) => {
    v[u] = u === 0 ? d : v[u - 1] + r[u - 1] + n;
  });
  const x = /* @__PURE__ */ new Map(), g = (l) => {
    const u = h.get(l), f = u.reduce((I, A) => I + g(A), 0) + n * Math.max(0, u.length - 1), b = Math.max(s.get(l).width, f);
    return x.set(l, b), b;
  }, $ = /* @__PURE__ */ new Map(), k = (l, u) => {
    const f = s.get(l), b = h.get(l), I = x.get(l), A = v[m.get(l)];
    if (!b.length) {
      $.set(l, { id: l, x: u + (I - f.width) / 2, y: A });
      return;
    }
    const N = b.reduce((E, j) => E + x.get(j), 0) + n * (b.length - 1);
    let T = u + (I - N) / 2;
    for (const E of b)
      k(E, T), T += x.get(E) + n;
    const R = $.get(b[0]), M = $.get(b[b.length - 1]), L = (R.x + s.get(b[0]).width / 2 + M.x + s.get(b[b.length - 1]).width / 2) / 2, _ = Math.min(Math.max(L - f.width / 2, u), u + I - f.width);
    $.set(l, { id: l, x: _, y: A });
  };
  let O = c;
  for (const l of y) {
    const u = g(l);
    k(l, O), O += u + n;
  }
  const S = e.map((l) => $.get(l.id));
  return so(e, S, o, n);
}
function so(e, t, n, o) {
  if (!n.length) return t;
  let s = 0;
  for (let i = 0; i <= n.length; i += 1) {
    let a = 0;
    if (t.forEach((h, m) => {
      const y = { ...e[m], x: h.x, y: h.y + s };
      for (const p of n)
        Ee(y, p, o) && (a = Math.max(a, p.y + p.height + o - y.y));
    }), !a) break;
    s += a;
  }
  return s ? t.map((i) => ({ ...i, y: i.y + s })) : t;
}
function io() {
  const e = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let n = 0; n < 12; n += 1) t += e[Math.floor(Math.random() * e.length)];
  return t;
}
function ro(e) {
  const t = (i) => {
    const a = (parseInt(i, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (i) => 0.2126 * t(i.substr(1, 2)) + 0.7152 * t(i.substr(3, 2)) + 0.0722 * t(i.substr(-2)), o = (i, a) => {
    const [h, m] = [n(i), n(a)];
    return (Math.max(h, m) + 0.05) / (Math.min(h, m) + 0.05);
  }, s = /^#[0-9a-f]{6}$/i.test(e) ? e : "#7aa2c8";
  return o(s, "#ffffff") > o(s, "#000000") ? "#ffffff" : "#000000";
}
function ao(e, t, n) {
  return e.x < t.x + t.width + n && e.x + e.width + n > t.x && e.y < t.y + t.height + n && e.y + e.height + n > t.y;
}
function co(e, t, n, o, s, i) {
  let a = e;
  for (let h = 0; h <= t.length; h += 1) {
    const m = t.filter((r) => a.some((c) => ao({ ...c, width: n, height: o }, r, i)));
    if (!m.length) return a;
    let y = 0, p = 0;
    s === "left" ? y = Math.min(...m.map((r) => r.x - i)) - Math.max(...a.map((r) => r.x + n)) : s === "above" ? p = Math.min(...m.map((r) => r.y - i)) - Math.max(...a.map((r) => r.y + o)) : s === "below" || s === "center" ? p = Math.max(...m.map((r) => r.y + r.height + i)) - Math.min(...a.map((r) => r.y)) : y = Math.max(...m.map((r) => r.x + r.width + i)) - Math.min(...a.map((r) => r.x)), a = a.map((r) => ({ x: r.x + y, y: r.y + p }));
  }
  return a;
}
function Pt(e, t) {
  if (t) {
    const n = e.nodes.find((s) => w(s) === t);
    if (n) return n;
    const o = e.nodes.filter((s) => `${s.options.text ?? ""}`.trim().toLowerCase() === t.trim().toLowerCase());
    if (o.length === 1) return o[0];
  }
  return [...e.nodes].sort((n, o) => G(o).x + G(o).width - (G(n).x + G(n).width))[0];
}
function qe(e, t) {
  const n = t === "grid" ? Math.ceil(Math.sqrt(e)) : e;
  return Array.from({ length: e }, (o, s) => ({
    row: t === "column" ? s : t === "grid" ? Math.floor(s / n) : 0,
    column: t === "column" ? 0 : t === "grid" ? s % n : s
  }));
}
function lo(e, t, n, o) {
  const s = t.count, i = t.placement || {}, a = i.gap ?? (i.connect ? an : 48);
  if (t.x !== void 0 && t.y !== void 0) {
    const c = i.arrangement || "row";
    return { points: qe(s, c).map(({ row: v, column: x }) => ({
      x: t.x + x * (n + a),
      y: t.y + v * (o + a)
    })), arrangement: c, gap: a };
  }
  const h = Pt(e, i.relativeTo), m = h ? G(h) : { x: 0, y: 0, width: 160, height: 100 }, y = i.direction || "right", p = i.arrangement || (["left", "right"].includes(y) ? "column" : "row"), r = qe(s, p).map(({ row: c, column: d }) => {
    let v = m.x + d * (n + a), x = m.y + c * (o + a);
    return y === "right" && (v += m.width + a), y === "left" && (v -= n + a), y === "below" && (x += m.height + a), y === "above" && (x -= o + a), { x: v, y: x };
  });
  return { points: co(r, e.nodes.map(G), n, o, y, a), arrangement: p, gap: a };
}
function ho(e, t) {
  if (!e) return { childId: `${we}${t()}` };
  const n = e.match(/->(__free_.+)$/);
  return { id: e, childId: n ? n[1] : `${we}${e.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Ye(e, t) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}~${n}`); ) n += 1;
  return `${t}~${n}`;
}
const De = (e, t) => JSON.stringify([e, t]);
function Be(e, t, n) {
  return new D(
    "id_taken",
    409,
    `${e} names ${t} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${t}s in a later operation.`,
    { ids: n }
  );
}
const pt = (e, t) => JSON.stringify(e) === JSON.stringify(t), uo = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], He = (e) => JSON.parse(JSON.stringify(e)), _e = 1e6, ft = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, de = (e) => ({ id: w(e), ...G(e), rotationAngle: q(e, "rotationAngle") });
function zo(e, t, n = {}) {
  const o = Ne(n), s = Me(n), i = n.idFactory || io, a = Te(e), h = Bn(t, {
    ...n,
    existingNodeIds: a.nodes.map(w),
    existingConnectionIds: se(a).map(({ association: c }) => c.id)
  });
  if (!h.valid)
    throw new D("invalid_operation_plan", 400, h.errors.join(" "), { errors: h.errors });
  const m = JSON.stringify(a), y = a.nodes.length, p = [], r = {
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
    const v = d + 1, x = `Operation ${v}`, g = { operation: v, kind: c.kind, matched: [], changed: [] };
    r.operations.push(g);
    const $ = () => r.warnings.push(`${x} matched no notes.`), k = (l) => {
      r.skipped.push({ operation: v, id: w(l), reason: "locked" });
    }, O = (l) => {
      const u = a.nodes.length + l;
      if (l > 0 && u > s.notesPerSlate && u > y)
        throw new D(
          "note_limit",
          422,
          `${x} would leave ${u} notes; a slate can hold at most ${s.notesPerSlate} notes.`,
          { limit: s.notesPerSlate, operation: v }
        );
    }, S = (l, u) => {
      if (u > 0 && l > s.connectorsPerSlate)
        throw new D(
          "connector_limit",
          422,
          `${x} would leave ${l} connectors; a slate can hold at most ${s.connectorsPerSlate} connectors.`,
          { limit: s.connectorsPerSlate, operation: v }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const l = c.preset ? Ht[c.preset] : void 0, u = c.placement?.connect === !0, f = u ? a.nodes.find((X) => w(X) === c.placement.relativeTo) : void 0;
        if (u && !f)
          throw new D("no_match", 409, `${x} placement.relativeTo names no note on the slate to connect from.`, { operation: v });
        if (f && f.options.isLocked === !0) {
          k(f);
          return;
        }
        const b = c.shape ?? l?.shape, I = f ? G(f) : void 0, A = typeof b == "string" && b.toLowerCase() === "triangle", N = b && typeof b == "object" ? Ct(b) : 0, T = c.media !== void 0 ? Lt(c.media) : null;
        if (T && !T.ok) throw new D("invalid_operation_plan", 400, `${x} media ${T.message}`, { operation: v });
        const R = c.photo !== void 0 ? Nt(c.photo) : null;
        if (R && !R.ok) throw new D("invalid_operation_plan", 400, `${x} photo ${R.message}`, { operation: v });
        const M = T ? _n : R?.ok ? Rn(R.photo.width, R.photo.height) : void 0, L = c.width ?? M?.width ?? l?.width ?? I?.width ?? (A ? 150 : N ? Math.round(N >= 1 ? 180 : 180 * N) : 180), _ = c.height ?? M?.height ?? l?.height ?? I?.height ?? (A ? 130 : N ? Math.round(N >= 1 ? 180 / N : 180) : 110), E = f ?? Pt(a, c.placement?.relativeTo), j = c.style?.backgroundColor || l?.style?.backgroundColor || E?.options.backgroundColor || "#7aa2c8", { points: P, arrangement: K, gap: Z } = lo(a, c, L, _), H = new Set(se(a).map(({ association: X }) => X.id)), ie = new Set(a.nodes.map(w)), W = (c.ids || []).filter((X) => ie.has(X));
        if (W.length && !n.replay) throw Be(x, "note", W);
        const ge = P.map((X, Ae) => c.ids?.[Ae] || i());
        O(ge.filter((X) => !ie.has(X)).length), f && S(H.size + ge.filter((X) => !ie.has(X)).length, ge.length), P.forEach(({ x: X, y: Ae }, tt) => {
          const J = ge[tt];
          if (g.matched.push(J), ie.has(J)) return;
          const nt = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${tt + 1}`) : c.text : "", $e = f ? He(f.options) : void 0;
          if ($e) for (const ne of uo) delete $e[ne];
          const te = $e ? { ...$e, id: J, name: J, text: nt, width: L, height: _ } : {
            id: J,
            name: J,
            text: nt,
            defaultShaped: !0,
            width: L,
            height: _,
            backgroundColor: j,
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
          b && C.shape.store(te, b, o), C.x.store(te, X, o), C.y.store(te, Ae, o), f || C.foregroundColor.store(te, ro(j), o);
          for (const [ne, Pe] of Object.entries(l?.style || {})) C[ne].store(te, Pe, o);
          for (const [ne, Pe] of Object.entries(c.style || {})) C[ne].store(te, Pe, o);
          if (T?.ok && Tn(te, T.media), R?.ok && zn(te, R.photo), a.nodes.push({ options: te, relationships: { associations: [] } }), g.changed.push(J), r.created.push(J), f) {
            const ne = Ye(H, be(w(f), J));
            H.add(ne), f.relationships.associations.push({ id: ne, parentId: w(f), childId: J, ...je }), r.connected.push(ne);
          }
        });
        const { placement: Mo, ...Dt } = c;
        p.push({
          ...Dt,
          ids: ge,
          x: P[0].x,
          y: P[0].y,
          placement: { arrangement: K, gap: Z, ...f ? { relativeTo: w(f), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = oe(a, c.target, `${x} target`);
        g.matched = l.map(w), l.length || $();
        const u = [];
        for (const f of l) {
          if (f.options.isLocked === !0 && c.changes.locked !== !1) {
            k(f);
            continue;
          }
          const b = JSON.stringify(f.options);
          for (const [I, A] of Object.entries(c.changes))
            ve[I] || C[I].store(f.options, A, o);
          po(f.options, c.changes), u.push(w(f)), JSON.stringify(f.options) !== b && g.changed.push(w(f));
        }
        if (c.changes.order && u.length) {
          const f = new Set(u), b = a.nodes.map(w), I = a.nodes.filter((N) => f.has(w(N))), A = a.nodes.filter((N) => !f.has(w(N)));
          a.nodes = c.changes.order === "front" ? [...A, ...I] : [...I, ...A], a.nodes.forEach((N, T) => {
            const R = w(N);
            f.has(R) && b[T] !== R && !g.changed.includes(R) && g.changed.push(R);
          });
        }
        r.updated.push(...u), u.length && p.push({ kind: "update_nodes", target: { ids: u }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const l = oe(a, c.target, `${x} target`);
        if (g.matched = l.map(w), l.length || $(), !c.target.ids && a.nodes.length > 1 && l.length === a.nodes.length && !Mt.test(n.userMessage || ""))
          throw new D("invalid_operation_plan", 400, `${x} cannot delete every note without an explicit request.`);
        const f = /* @__PURE__ */ new Set();
        for (const b of l)
          b.options.isLocked === !0 ? k(b) : f.add(w(b));
        a.nodes = a.nodes.filter((b) => !f.has(w(b)));
        for (const b of a.nodes)
          b.relationships.associations = b.relationships.associations.filter(
            (I) => !f.has(I.parentId) && !f.has(I.childId)
          );
        g.changed = [...f], r.deleted.push(...f), f.size && p.push({ kind: "delete_nodes", target: { ids: [...f] } });
        return;
      }
      case "duplicate_nodes": {
        const l = oe(a, c.target, `${x} target`);
        g.matched = l.map(w), l.length || $();
        const u = c.offset ?? cn, f = new Set(a.nodes.map(w)), b = (c.ids || []).filter((M) => f.has(M));
        if (b.length && !n.replay) throw Be(x, "note", b);
        const I = l.map((M, L) => c.ids?.[L] || i());
        O(I.filter((M) => !f.has(M)).length);
        for (const M of l) {
          const L = q(M, "x") + u.x, _ = q(M, "y") + u.y;
          if (Math.abs(L) > _e || Math.abs(_) > _e)
            throw new D(
              "invalid_operation_plan",
              400,
              `${x} would put the copy of ${w(M)} at ${L}, ${_}; a note's position must be from -${_e} to ${_e}.`
            );
        }
        const A = new Map(l.map((M, L) => [w(M), I[L]])), N = /* @__PURE__ */ new Map();
        l.forEach((M, L) => {
          const _ = I[L];
          if (f.has(_)) return;
          const E = { options: { ...He(M.options), id: _, name: _ }, relationships: { associations: [] } };
          C.x.store(E.options, q(M, "x") + u.x, o), C.y.store(E.options, q(M, "y") + u.y, o), a.nodes.push(E), N.set(_, E), g.changed.push(_), r.created.push(_);
        });
        const T = new Set(se(a).map(({ association: M }) => M.id));
        let R = 0;
        for (const M of l) {
          const L = N.get(A.get(w(M)));
          if (L)
            for (const _ of M.relationships.associations) {
              const E = A.get(_.childId);
              if (!E || re(_)) continue;
              const j = Ye(T, be(w(L), E));
              T.add(j), L.relationships.associations.push({ ...He(_), id: j, parentId: w(L), childId: E }), r.connected.push(j), R += 1;
            }
        }
        S(T.size, R), l.length && p.push({ kind: "duplicate_nodes", target: { ids: l.map(w) }, ids: I, offset: { ...u } });
        return;
      }
      case "connect_nodes": {
        const l = oe(a, c.from, `${x} from`), u = c.to?.point, f = u ? [] : oe(a, c.to, `${x} to`);
        (!l.length || !u && !f.length) && $();
        const b = l.length * (u ? 1 : f.length);
        if (b > s.connectorsPerOperation)
          throw new D(
            "connector_limit",
            422,
            `${x} would join ${b} pairs of notes; one operation may join at most ${s.connectorsPerOperation}.`,
            { limit: s.connectorsPerOperation }
          );
        const I = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map();
        for (const { association: L } of se(a)) {
          I.add(L.id);
          const _ = De(L.parentId, L.childId);
          A.has(_) || A.set(_, L.id);
        }
        const N = [], T = [], R = [];
        let M = 0;
        for (const L of l) {
          const _ = w(L), E = u ? [null] : f.filter((j) => w(j) !== _);
          if (L.options.isLocked === !0) {
            E.length && k(L), M += E.length;
            continue;
          }
          E.length && R.push(_);
          for (const j of E) {
            const P = c.ids?.[M];
            if (M += 1, !j) {
              const ie = ho(P, i), W = ie.id ?? be(_, ie.childId);
              if (I.has(W)) {
                n.replay || N.push(W), T.push(W), g.matched.push(W);
                continue;
              }
              L.relationships.associations.push({ id: W, parentId: _, childId: ie.childId, targetPoint: { ...u }, ...je, ...c.style || {} }), I.add(W), T.push(W), g.matched.push(W), g.changed.push(W), r.connected.push(W);
              continue;
            }
            const K = w(j), Z = A.get(De(_, K));
            if (Z) {
              T.push(Z), g.matched.push(Z);
              continue;
            }
            if (P && I.has(P)) {
              n.replay || N.push(P), T.push(P), g.matched.push(P);
              continue;
            }
            const H = P || Ye(I, be(_, K));
            L.relationships.associations.push({ id: H, parentId: _, childId: K, ...je, ...c.style || {} }), I.add(H), A.set(De(_, K), H), T.push(H), g.matched.push(H), g.changed.push(H), r.connected.push(H);
          }
        }
        if (N.length) throw Be(x, "connector", N);
        if (I.size > s.connectorsPerSlate && g.changed.length)
          throw new D(
            "connector_limit",
            422,
            `A slate can hold at most ${s.connectorsPerSlate} connectors; this plan would leave ${I.size}.`,
            { limit: s.connectorsPerSlate }
          );
        g.changed.length && p.push({
          kind: "connect_nodes",
          from: { ids: R },
          to: u ? { point: { ...u } } : { ids: f.map(w) },
          ids: T,
          ...c.style ? { style: c.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let l;
        if (c.connectionIds) {
          const u = new Set(c.connectionIds);
          l = se(a).filter(({ association: f }) => u.has(f.id));
        } else {
          const u = new Set(oe(a, c.from, `${x} from`).map(w)), f = new Set(oe(a, c.to, `${x} to`).map(w));
          l = se(a).filter(
            ({ association: b }) => u.has(b.parentId) && f.has(b.childId) || f.has(b.parentId) && u.has(b.childId)
          );
        }
        if (g.matched = l.map(({ association: u }) => u.id), l.length || r.warnings.push(`${x} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: u, association: f } of l)
            u.relationships.associations = u.relationships.associations.filter((b) => b !== f);
          g.changed = [...g.matched], r.disconnected.push(...g.matched), l.length && p.push({ kind: "disconnect_nodes", connectionIds: g.matched });
          return;
        }
        for (const { node: u, association: f } of l) {
          const b = JSON.stringify([w(u), f]), I = Object.entries(c.changes).filter(([N]) => !Ze.includes(N));
          for (const [N, T] of I) f[ae[N].field || N] = T;
          const A = Vn(a, u, f, c.changes, x, i);
          JSON.stringify([w(A), f]) !== b && g.changed.push(f.id);
        }
        r.connectionsUpdated.push(...g.matched), l.length && p.push({ kind: "update_connections", connectionIds: g.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const l = oe(a, c.target, `${x} target`);
        g.matched = l.map(w), l.length || $();
        const u = l.filter((_) => _.options.isLocked !== !0 ? !0 : (k(_), !1));
        if (!u.length) return;
        const f = c.layout;
        let b;
        if (ft[f]) b = Jn(ft[f], u.map(de));
        else if (f === "distribute-horizontal" || f === "distribute-vertical")
          b = Qn(f === "distribute-horizontal" ? "horizontal" : "vertical", u.map(de));
        else if (f === "tidy") {
          const _ = new Set(u.map(w)), E = a.nodes.filter((j) => !_.has(w(j))).map(de);
          b = to(u.map(de), E, { gap: c.gap ?? 20 });
        } else if (f === "tree") {
          const _ = se(a).filter(({ association: P }) => !re(P)).map(({ association: P }) => [P.parentId, P.childId]), E = new Set(u.map(w)), j = a.nodes.filter((P) => !E.has(w(P))).map(de);
          b = oo(u.map(de), _, { gap: c.gap ?? 48, obstacles: j });
        }
        if (b) {
          const _ = new Map(u.map((E) => [w(E), E]));
          for (const E of b) {
            const j = _.get(E.id), P = [q(j, "x"), q(j, "y")];
            C.x.store(j.options, E.x, o), C.y.store(j.options, E.y, o), pt(P, [E.x, E.y]) || g.changed.push(E.id);
          }
          r.updated.push(...u.map(w)), p.push({ kind: "arrange_nodes", target: { ids: u.map(w) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const I = u.map(G), A = c.gap ?? 48, N = Math.min(...I.map((_) => _.x)), T = Math.min(...I.map((_) => _.y)), R = Math.max(...I.map((_) => _.width), 120), M = Math.max(...I.map((_) => _.height), 80), L = qe(u.length, c.layout === "circle" ? "row" : c.layout);
        u.forEach((_, E) => {
          const j = [q(_, "x"), q(_, "y")];
          let P, K;
          if (c.layout === "circle") {
            const Z = Math.max(180, u.length * 35), H = Math.PI * 2 * E / u.length;
            P = N + Z + Math.cos(H) * Z, K = T + Z + Math.sin(H) * Z;
          } else
            P = N + L[E].column * (R + A), K = T + L[E].row * (M + A);
          C.x.store(_.options, P, o), C.y.store(_.options, K, o), pt(j, [P, K]) || g.changed.push(w(_));
        }), r.updated.push(...u.map(w)), p.push({ kind: "arrange_nodes", target: { ids: u.map(w) }, layout: c.layout, ...c.gap !== void 0 ? { gap: A } : {} });
        return;
      }
      case "update_slate": {
        const l = c.changes, u = JSON.stringify(a);
        for (const [f, b] of Object.entries(ue))
          l[f] !== void 0 && b.store(a, l[f]);
        JSON.stringify(a) !== u && g.changed.push("slate"), p.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && r.warnings.length) {
    const c = r.warnings[0];
    throw new D("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return r.unchanged = JSON.stringify(a) === m, { slate: a, materializedPlan: { message: t.message.trim(), operations: p }, report: r };
}
function po(e, t) {
  const n = t.shape;
  if (!n || typeof n != "object" || e.shape !== "custom" || t.width !== void 0 && t.height !== void 0) return;
  const o = Ct(n);
  if (!o) return;
  const s = (i) => Math.round(Math.min(5e3, Math.max(20, i)));
  t.height !== void 0 ? e.width = s(Number(e.height) * o) : e.height = s(Number(e.width || 180) / o);
}
function Ct(e) {
  const t = Ue(e);
  return t.ok && t.shape.aspect > 0 ? Math.min(10, Math.max(0.1, t.shape.aspect)) : 0;
}
const mt = ["id", ...Object.keys(C), "image", "media", "photo", "styleRole"], Oe = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), xe = (e) => e.options.isComment === !0;
function jt(e, t) {
  const n = e.options, o = (i) => !t || t.includes(i), s = { id: w(e) };
  for (const [i, a] of Object.entries(C)) {
    if (!o(i)) continue;
    const h = a.read(n);
    s[i] = h === void 0 ? null : h;
  }
  return o("image") && (s.image = n.image || null), o("media") && (s.media = An(n)), o("photo") && (s.photo = Yn(n)), o("styleRole") && (s.styleRole = typeof n.styleRole == "string" ? n.styleRole : null), s;
}
function Rt(e) {
  const t = re(e), n = { id: e.id, from: e.parentId, to: t ? null : e.childId };
  for (const [s, i] of Object.entries(ae)) {
    if (Ze.includes(s)) continue;
    const a = e[i.field ?? s];
    n[s] = a === void 0 ? null : a;
  }
  t && (n.toPoint = e.targetPoint ?? null);
  const o = Zn(e);
  return (o.fromEnd !== "follow" || o.toEnd !== "follow") && Object.assign(n, o), n;
}
const fe = (e) => new D("invalid_selection", 400, e);
function fo(e) {
  const t = {};
  if (e.ids !== void 0 && (t.ids = e.ids), e.within !== void 0 && (t.within = e.within), e.groupId !== void 0 && (t.groupId = e.groupId), e.q !== void 0)
    t.text = e.q, t.all = !0, e.match !== void 0 && (t.match = e.match);
  else if (e.match !== void 0)
    throw fe("match goes with q.");
  if (!Object.keys(t).length) return null;
  const n = le(t, "selection").map(
    (o) => o.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q")
  );
  if (n.length) throw fe(n.join(" "));
  return t;
}
const mo = (e) => btoa(encodeURIComponent(JSON.stringify(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function go(e) {
  try {
    const { after: t, at: n } = JSON.parse(decodeURIComponent(atob(e.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof t == "string" && t && Number.isSafeInteger(n) && n >= 0) return { after: t, at: n };
  } catch {
  }
  throw fe("cursor is not one this slate gave. Read again from the first page.");
}
function yo(e, { after: t, at: n }) {
  let o = -1;
  if (e.forEach((s, i) => {
    w(s) === t && (o < 0 || Math.abs(i - n) < Math.abs(o - n)) && (o = i);
  }), o < 0) throw fe("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function bo(e) {
  if (!e.length) return null;
  const t = e.map(G), n = Math.min(...t.map((a) => a.x)), o = Math.min(...t.map((a) => a.y)), s = Math.max(...t.map((a) => a.x + a.width)), i = Math.max(...t.map((a) => a.y + a.height));
  return { x: n, y: o, width: s - n, height: i - o };
}
function Yo(e, t = {}) {
  const n = Te(e), o = n.nodes.filter(($) => !xe($)), s = t.fields;
  if (s !== void 0) {
    const $ = s.filter((k) => !mt.includes(k));
    if ($.length) throw fe(`Unknown note field: ${$.join(", ")}. Choose from ${mt.join(", ")}.`);
  }
  const i = t.limit ?? Oe.notes;
  if (!Number.isInteger(i) || i < 1 || i > Oe.maxNotes)
    throw fe(`limit must be a whole number from 1 to ${Oe.maxNotes}.`);
  const a = t.maxChars ?? Oe.maxChars, h = fo(t), m = h ? oe({ ...n, nodes: o }, h, "selection") : o;
  let y = 0;
  t.cursor !== void 0 && (y = yo(m, go(t.cursor)));
  const p = new Set(n.nodes.filter(xe).map(w)), r = /* @__PURE__ */ new Map();
  for (const { association: $ } of se(n)) {
    if (p.has($.parentId) || p.has($.childId)) continue;
    const k = r.get($.parentId) ?? [];
    k.push($), r.set($.parentId, k);
  }
  const c = [], d = [];
  let v = 0, x = y;
  for (; x < m.length && c.length < i; x += 1) {
    const $ = m[x], k = jt($, s), O = (r.get(w($)) ?? []).map(Rt), S = JSON.stringify(k).length + JSON.stringify(O).length;
    if (c.length && v + S > a) break;
    v += S, c.push(k), d.push(...O);
  }
  const g = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: xn(n.options.containerStyle),
    style: n.options.style && typeof n.options.style == "object" ? n.options.style : null,
    bounds: bo(o),
    nodeCount: m.length,
    nodes: c,
    connections: d,
    nextCursor: x < m.length && g ? mo({ after: g.id, at: x - 1 }) : null
  };
}
const wo = [
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
function Do(e) {
  const t = Te(e), n = new Set(t.nodes.filter(xe).map(w)), o = {};
  for (const i of wo) t.options[i] !== void 0 && (o[i] = t.options[i]);
  const s = t.nodes.filter((i) => !n.has(w(i))).map((i) => ({
    options: i.options,
    relationships: {
      ...i.relationships,
      associations: i.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: o, nodes: s, shareId: `${e?.shareId ?? t.options.shareId ?? ""}` };
}
const xo = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"], vo = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function Bo(e) {
  const t = Te(e), n = t.nodes.filter((a) => !xe(a)), o = new Set(t.nodes.filter(xe).map((a) => a.options.id)), s = n.slice(0, 150).map((a) => {
    const h = jt(a, xo);
    return {
      id: h.id,
      text: `${h.text ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 240),
      shape: h.shape,
      x: h.x,
      y: h.y,
      width: Number(h.width ?? 120),
      height: Number(h.height ?? 80),
      ...h.rotationAngle ? { rotationAngle: h.rotationAngle } : {},
      ...h.locked === !0 ? { locked: !0 } : {},
      ...h.templateCategory ? { templateCategory: h.templateCategory } : {},
      ...h.hiddenControls?.length ? { hiddenControls: h.hiddenControls } : {}
    };
  }), i = se(t).filter(({ association: a }) => !o.has(a.parentId) && !o.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const h = Rt(a);
    return {
      id: h.id,
      from: h.from,
      to: h.to,
      ..."toPoint" in h ? { toPoint: h.toPoint } : {},
      // Whether each end follows its note, is pinned to a spot on its edge, or is free.
      ..."fromEnd" in h ? { fromEnd: h.fromEnd, toEnd: h.toEnd } : {},
      label: h.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(vo.map((m) => [m, h[m] ?? void 0]))
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
const $o = /^Operation (\d+) (.+)$/s, ko = {
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
function gt(e) {
  const t = [...new Set(e)].sort((o, s) => o - s), n = [];
  for (let o = 0; o < t.length; o += 1) {
    let s = o;
    for (; s + 1 < t.length && t[s + 1] === t[s] + 1; ) s += 1;
    n.push(s > o ? `${t[o]}–${t[s]}` : String(t[o])), o = s;
  }
  return n.join(", ");
}
function Ho(e) {
  return String(e ?? "").split(/(?<=\.)\s+(?=[A-Z])/).map((t) => t.trim()).filter(Boolean);
}
function zt(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) {
    const o = String(n ?? "").trim();
    if (!o) continue;
    const s = $o.exec(o), i = s ? s[2] : o, a = s ? `op:${i}` : `plan:${o}`, h = t.get(a) ?? { problem: i, operations: [], message: "" };
    s && h.operations.push(Number(s[1])), t.set(a, h);
  }
  for (const n of t.values())
    if (!n.operations.length) n.message = n.problem;
    else if (n.operations.length === 1) n.message = `Operation ${n.operations[0]} ${n.problem}`;
    else {
      const [o, ...s] = n.problem.split(" "), i = ko[o];
      n.message = i ? `Operations ${gt(n.operations)} ${[i, ...s].join(" ")}` : `Operations ${gt(n.operations)}: ${n.problem}`;
    }
  return [...t.values()];
}
const _o = (e) => me.filter((t) => Le[t].includes(e));
function Oo(e) {
  const t = /* @__PURE__ */ new Set();
  for (const { problem: n } of zt(e)) {
    if (/^count must be an integer/.test(n)) {
      t.add('add_nodes requires count, a whole number: how many notes it adds. With ids, count is ids.length (count 1 with ids ["a"]).');
      continue;
    }
    const o = /^has an unknown field: ([A-Za-z_]+)\.$/.exec(n);
    if (o) {
      const s = o[1], i = _o(s);
      s === "connectionIds" ? t.add("connect_nodes names its new connectors with ids; connectionIds is only for disconnect_nodes and update_connections.") : i.length ? t.add(`${s} belongs to ${i.join(", ")} only.`) : t.add(`No operation takes ${s}.`);
      continue;
    }
    /^needs both x and y/.test(n) && t.add("add_nodes gives both x and y, or neither (then placement says where the notes go)."), /^has an unsupported kind/.test(n) && t.add(`kind is one of ${me.join(", ")}.`);
  }
  return [...t];
}
function Wo(e = {}) {
  const t = Ne(e), n = (o, s) => Object.fromEntries(Object.entries(o).map(([i, a]) => [i, { ...V(s(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(me.map((o) => [o, { fields: Le[o].filter((s) => s !== "kind") }])),
    noteKeys: { ...n(C, (o) => o.spec(t)), ...n(ve, (o) => o.spec) },
    noteStyleKeys: [...Ge],
    connectorKeys: n(ae, (o) => o.spec),
    connectorStyleKeys: [...Je],
    slateKeys: Object.fromEntries(
      Object.entries(ue).map(([o, s]) => [
        o,
        { ...o === "background" ? kt() : o === "style" ? $t() : V(s.spec), description: s.description }
      ])
    ),
    selector: _t(),
    layouts: [...Ke],
    presets: [...Ve],
    limits: Me(e),
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
function So(e = {}, t = {}) {
  const n = Ne(e), o = Me(e), s = (r) => {
    const c = V(C[r].spec(n));
    return t.modelTool ? Vt(c) : c;
  }, i = (r) => Object.fromEntries(r.map((c) => [c, s(c)])), a = (r) => Object.fromEntries(r.map((c) => [c, { ...s(c), description: C[c].description }])), h = (r) => Object.fromEntries(r.map((c) => [c, V(ae[c].spec)])), m = _t(), y = { type: "array", items: { type: "string" } }, p = Yt();
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
        description: Io(o.notesPerAdd),
        items: {
          type: "object",
          additionalProperties: !1,
          required: ["kind"],
          description: `Fields by kind (any other field is refused). ${p}. add_nodes requires count.`,
          properties: {
            kind: { type: "string", enum: [...me], description: "Which operation this is; it decides the fields the operation may carry." },
            count: {
              type: "integer",
              minimum: 1,
              maximum: o.notesPerAdd,
              description: `add_nodes only, and required there: how many notes it adds, 1 to ${o.notesPerAdd}. With ids, count is normally ids.length (never fewer). Other kinds take no count.`
            },
            ...i(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...Ve],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...y, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: {
              ...y,
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
                direction: { type: "string", enum: [...bt] },
                arrangement: { type: "string", enum: [...wt] },
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
                url: { type: "string", maxLength: U.urlLength, description: "The video's address." },
                title: { type: "string", maxLength: U.titleLength },
                author: { type: "string", maxLength: U.authorLength },
                start: { type: "integer", minimum: 1, maximum: U.startSeconds, description: "Where to start, in seconds." },
                poster: { type: "string", maxLength: U.urlLength, pattern: "^(https://\\S+|/[^/\\\\\\s]\\S*)$", description: "The poster picture: an https address, or a path on this app (/...)." },
                posterWidth: { type: "number", minimum: 1, maximum: 1e4 },
                posterHeight: { type: "number", minimum: 1, maximum: 1e4 }
              }
            } },
            // Not in a model's tool: a photo comes from a person's phone through the host's add-photo action, which cleans and stores it.
            ...t.modelTool ? {} : { photo: {
              type: "object",
              additionalProperties: !1,
              required: ["url", "width", "height"],
              description: "add_nodes, count 1, no shape, preset, text or media: a photo note, a picture the host stored, drawn as the whole note at 320 on its longer side. Hosts add photos through their own add-photo action, which turns the picture upright, shrinks it and removes its location data.",
              properties: {
                url: { type: "string", maxLength: ee.urlLength, pattern: "^(https://\\S+|/(files|sbimages)/\\S+)$", description: "The stored picture: an https address, or a path in this app's file store (/files/... or /sbimages/...)." },
                width: { type: "number", minimum: 1, maximum: ee.dimension, description: "The picture's width in pixels." },
                height: { type: "number", minimum: 1, maximum: ee.dimension, description: "The picture's height in pixels." },
                alt: { type: "string", maxLength: ee.altLength, description: "What the photo shows, for a screen reader." }
              }
            } },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...i(Ge), ...h(Je) }
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
              enum: [...Ke],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(ue).join(", ")}.`,
              properties: {
                ...a(Object.keys(C)),
                ...Object.fromEntries(Object.entries(ve).map(([r, c]) => [r, V(c.spec)])),
                ...h(Object.keys(ae)),
                ...Object.fromEntries(
                  Object.entries(ue).map(([r, c]) => [r, r === "background" ? kt() : r === "style" ? $t() : V(c.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
function Yt() {
  return me.map((e) => `${e}: ${Le[e].filter((t) => t !== "kind").join(", ")}`).join("; ");
}
function Io(e = 20) {
  return [
    `The operations, applied in order. Each operation's kind decides which fields it may carry; any other field is refused. Fields by kind: ${Yt()}.`,
    `add_nodes requires count (1 to ${e}): one add_nodes may add several notes (count 3, ids ["a","b","c"]) or one (count 1, ids ["a"]).`,
    "connect_nodes names its new connectors with ids (one per pair); connectionIds is only for disconnect_nodes and update_connections.",
    'Examples: {"kind":"add_nodes","count":1,"ids":["title"],"shape":"rectangle","text":"Title","x":0,"y":0,"width":240,"height":80}; {"kind":"add_nodes","count":2,"ids":["a","b"],"shape":"rectangle","text":"Step","placement":{"relativeTo":"title","direction":"below","arrangement":"row"}}; {"kind":"connect_nodes","from":{"ids":["title"]},"to":{"ids":["a"]},"ids":["title-a"]}; {"kind":"update_nodes","target":{"ids":["a"]},"changes":{"text":"First step"}}.'
  ].join(" ");
}
const Xo = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: So({}, { modelTool: !0 })
});
function Fo(e) {
  return `Call applySlateOperations again with a safe, valid plan. ${[...zt(e).map((n) => n.message), ...Oo(e)].join(" ")}`;
}
function qo(e) {
  if (typeof e?.message == "string" && e.message.trim()) return e.message.trim();
  const t = (e?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${t} ${t === 1 ? "change" : "changes"} to the slate.`;
}
const Eo = /^\s*-?\d+(?:\.\d+)?\s*$/, Lo = /^\s*\d+\s*$/, No = {
  add_nodes: { count: "integer", x: "number", y: "number", width: "number", height: "number" },
  arrange_nodes: { gap: "number" }
};
function Uo(e) {
  if (!z(e) || !Array.isArray(e.operations)) return { plan: e, changes: [] };
  const t = [], n = e.operations.map((o, s) => {
    if (!z(o) || typeof o.kind != "string") return o;
    const i = `Operation ${s + 1}`, a = No[o.kind];
    if (!a) return o;
    const h = { ...o };
    for (const [m, y] of Object.entries(a)) {
      const p = h[m];
      typeof p == "string" && (y === "integer" ? Lo : Eo).test(p) && (h[m] = Number(p), t.push(`${i} ${m} ${JSON.stringify(p)} read as ${h[m]}.`));
    }
    return o.kind === "add_nodes" && h.count === void 0 && Array.isArray(h.ids) && h.ids.length > 0 && h.ids.every((m) => typeof m == "string" && m.length > 0) && (h.count = h.ids.length, t.push(`${i} count read as ${h.count}, one note per id.`)), h;
  });
  return t.length ? { plan: { ...e, operations: n }, changes: t } : { plan: e, changes: t };
}
export {
  Zt as BORDER_STYLES,
  ae as CONNECTOR_KEYS,
  Je as CONNECTOR_STYLE_KEYS,
  ln as DEFAULT_FONTS,
  wo as DOCUMENT_OPTION_KEYS,
  Jt as EFFECTS,
  Ke as LAYOUTS,
  dn as LIMITS,
  Po as MEDIA_FRAME_ORIGINS,
  kn as MEDIA_HOST_NAMES,
  U as MEDIA_LIMITS,
  _n as MEDIA_NOTE_SIZE,
  Ot as MEDIA_PROVIDERS,
  ve as NODE_INTENT_KEYS,
  C as NODE_KEYS,
  Ge as NODE_STYLE_KEYS,
  mt as NOTE_READ_KEYS,
  Le as OPERATION_FIELDS,
  D as OperationPlanError,
  ee as PHOTO_LIMITS,
  Pn as PHOTO_NOTE_LONG_SIDE,
  Ve as PRESETS,
  Oe as READ_LIMITS,
  ue as SLATE_KEYS,
  me as SLATE_OPERATION_KINDS,
  Xo as SLATE_OPERATION_TOOL,
  Jn as alignPositions,
  zo as applyPlanToJSON,
  xn as backgroundOf,
  Me as contractLimits,
  Ne as contractLists,
  Wo as describeOperations,
  Qn as distributePositions,
  zt as groupPlanErrors,
  Co as isMediaUrl,
  jo as mediaEmbedUrl,
  Ro as mediaLabel,
  qo as naturalOperationFallback,
  Uo as normalizePlan,
  Yt as operationFieldsByKind,
  Fo as operationPlanRetryPrompt,
  gt as operationRanges,
  Io as operationsDescription,
  Et as parseMediaUrl,
  Qe as parseStart,
  Rn as photoNoteSize,
  Oo as planErrorHints,
  Ho as planErrorsOf,
  Rt as readConnector,
  An as readMedia,
  Lt as readMediaValue,
  jt as readNote,
  Yn as readPhoto,
  Nt as readPhotoValue,
  Yo as readSlate,
  At as rotatedBounds,
  So as slateOperationPlanSchema,
  zn as storePhoto,
  Bo as summarizeSlate,
  to as tidyPositions,
  Do as toSlateDocument,
  Te as toStoredSlate,
  oo as treePositions,
  Bn as validatePlan
};
