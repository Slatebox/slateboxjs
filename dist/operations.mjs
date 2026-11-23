import { SHAPE_LIMITS as Me, prepareShape as De, storeCustomShape as xt } from "./shapes.mjs";
import { N as kt } from "./NoteDefaults-1xFW0br8.mjs";
const D = /* @__PURE__ */ new Map();
D.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
D.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
D.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
D.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
D.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
D.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
D.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
D.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
D.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
D.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
D.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
D.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
D.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
D.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
D.set("stickynote", {
  path: "M1 1l18 0.1l-0.1 17.8s-15.5 0.4-17.6-1c-0.4-2.1-0.3-16.9-0.3-16.9z",
  defaultWidth: 108,
  defaultHeight: 108,
  viewBox: "1 1 18 18"
});
function vt() {
  return Array.from(D.keys());
}
const ie = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", $t = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${ie}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${ie}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${ie}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${ie}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${ie}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${ie}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${ie}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
function _t() {
  return { ...$t };
}
function Y(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const Ot = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, It = /^https?:\/\/[^\s]+$/i, rt = 2e3, St = /^[A-Za-z0-9_-]{1,64}$/;
function ke(e, t) {
  if (typeof t != "string") return;
  const n = t.trim().toLowerCase();
  return e.find((o) => o.toLowerCase() === n);
}
function R(e, t, n) {
  switch (e.type) {
    case "string":
      return t === null && e.nullable ? null : typeof t != "string" ? `${n} must be a string.` : t.length > e.maxLength ? `${n} must be at most ${e.maxLength} characters.` : e.minLength && t.trim().length < e.minLength ? `${n} must not be empty.` : null;
    case "number":
      return typeof t != "number" || !Number.isFinite(t) || t < e.min || t > e.max ? `${n} must be a number from ${e.min} to ${e.max}.` : null;
    case "boolean":
      return typeof t == "boolean" ? null : `${n} must be true or false.`;
    case "enum":
      return t === null && e.nullable || (e.caseless ? ke(e.values, t) : e.values.find((i) => i === t)) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")}.`;
    case "shape": {
      if (t && typeof t == "object" && !Array.isArray(t)) {
        const o = De(t);
        return o.ok ? null : `${n} is not a usable custom shape: ${o.message}`;
      }
      return ke(e.values, t) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")} (or a custom shape {name, d, fillRule}).`;
    }
    case "list":
      return Array.isArray(t) && t.every((o) => typeof o == "string" && e.values.includes(o)) && new Set(t).size === t.length ? null : `${n} must be a list of different values from: ${e.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof t == "string" && Ot.test(t.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return Y(t) && Object.keys(t).every((o) => o === "x" || o === "y") && [t.x, t.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return Y(t) ? null : `${n} must be an object.`;
    case "url":
      return t === null && e.nullable || typeof t == "string" && t.length <= rt && It.test(t.trim()) ? null : `${n} must be an http or https address${e.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return t === null && e.nullable || typeof t == "string" && St.test(t) ? null : `${n} must be 1 to 64 letters, digits, _ or -${e.nullable ? ", or null" : ""}.`;
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
      return { oneOf: [{ type: "string", enum: [...e.values] }, Et()] };
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
        maxLength: rt,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: e.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
function Et() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["name", "d"],
    description: "A custom shape: one SVG path (several closed parts and holes allowed, no markup), as shapes.generate or shapes.list return it.",
    properties: {
      name: { type: "string", minLength: 1, maxLength: Me.maxName },
      d: { type: "string", minLength: 1, maxLength: Me.maxInput, description: "Path data: commands and plain numbers only." },
      fillRule: { type: "string", enum: ["nonzero", "evenodd"], description: "evenodd when the shape has holes." },
      ref: {
        type: "object",
        additionalProperties: !1,
        required: ["id"],
        description: "The shape library entry it came from.",
        properties: { id: { type: "string", pattern: "^[A-Za-z0-9_-]{1,64}$" }, name: { type: "string", maxLength: Me.maxName } }
      }
    }
  };
}
function Nt(e) {
  return Array.isArray(e.oneOf) && e.oneOf[0]?.type === "string" && e.oneOf[0]?.enum ? { ...e.oneOf[0], ...Object.fromEntries(Object.entries(e).filter(([t]) => t !== "oneOf")) } : e;
}
const q = (e) => ({
  store: (t, n) => {
    t[e] = n;
  },
  read: (t) => t[e]
}), Mt = ["solid", "dashed", "dotted", "combo"], At = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), Pt = ["front", "back"], Lt = ["left", "middle", "right"], Tt = ["top", "middle", "bottom"], Ye = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), Ke = Object.keys(Ye), P = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...q("text") },
  shape: {
    spec: (e) => ({ type: "shape", values: e.shapes }),
    description: "A shape registered with the engine (custom shapes read back as custom:<name>).",
    store: (e, t, n) => {
      if (t && typeof t == "object") {
        const i = De(t);
        i.ok && xt(e, i.shape);
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
    spec: () => ({ type: "enum", values: Mt }),
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
  textXAlign: { spec: () => ({ type: "enum", values: Lt }), description: "Horizontal text alignment.", ...q("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: Tt }), description: "Vertical text alignment.", ...q("textYAlign") },
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
    spec: () => ({ type: "list", values: Ke }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (e, t) => {
      for (const [n, o] of Object.entries(Ye)) e[o] = !t.includes(n);
    },
    read: (e) => Ke.filter((t) => e[Ye[t]] === !1)
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (e, t) => {
      e.isLocked = t;
    },
    read: (e) => e.isLocked === !0
  }
}, me = {
  order: {
    spec: { type: "enum", values: Pt },
    description: "Bring the note to the front or send it to the back."
  }
}, Ct = [...Object.keys(P), ...Object.keys(me)], jt = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Be = Object.keys(P).filter((e) => !jt.has(e)), ve = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Xe = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, at = ["left", "right", "above", "below", "center"], ct = ["row", "column", "grid"], Rt = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], Yt = ["distribute-horizontal", "distribute-vertical"], Fe = ["row", "column", "grid", "circle", ...Rt, ...Yt, "tidy", "tree"], He = ["text", "sticky"], zt = 75, Dt = Object.freeze({ x: 20, y: 20 }), Bt = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), Je = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, Ze = 200, Xt = Object.freeze([
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
  "Urbanist"
]);
function Oe(e = {}) {
  return {
    shapes: [...e.shapes ?? vt()],
    fonts: [...e.fonts ?? Xt],
    animations: Object.keys(_t()),
    effects: [...At]
  };
}
function Ie(e = {}) {
  return { ...Bt, ...e.limits || {} };
}
class F extends Error {
  constructor(t, n, o, i) {
    super(o), this.name = "OperationPlanError", this.code = t, this.status = n, i && (this.details = i);
  }
}
const Ft = ["bezier", "orthogonal", "straight", "linear", "curved"], Ht = ["cubic", "quadratic"], Wt = ["solid", "dashed", "dotted"], qt = ["follow", "pinned"], Ve = ["follow", "pinned", "top", "right", "bottom", "left"], oe = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: Ft }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: Ht }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  lineDash: { spec: { type: "enum", values: Wt }, description: "Solid, dashed or dotted line." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: qt },
    description: "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge that faces the line's other end, where a following end sits)."
  },
  fromEnd: {
    spec: { type: "enum", values: Ve },
    description: "The starting end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side."
  },
  toEnd: {
    spec: { type: "enum", values: Ve },
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
}, We = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"], qe = Object.keys(oe).filter((e) => !We.includes(e)), Ae = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, ue = "__free_", dt = ["linear", "radial"], lt = ["horizontal", "vertical", "diagonal"], be = (e) => ({
  store: (t, n) => {
    t.options[e] = n;
  }
}), Qe = (e) => ({
  store: (t, n) => {
    t.options.viewPort = { ...t.options.viewPort || {}, [e]: n };
  }
}), de = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...be("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...be("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (e, t) => {
      const n = { ...e.options.containerStyle || {}, ...Ut(t) };
      delete n.backgroundImage, delete n.backgroundEffect, e.options.containerStyle = n;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: a theme colours notes by their depth in the connected tree.",
    ...be("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...be("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...Qe("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...Qe("snapToObjects") },
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
function Gt(e, t) {
  if (!Y(e)) return [`${t} must be an object {color, gradient?}.`];
  const n = [];
  for (const i of Object.keys(e))
    i !== "color" && i !== "gradient" && n.push(`${t} has an unknown field: ${i}.`);
  const o = R({ type: "color" }, e.color, `${t}.color`);
  if (o && n.push(o), e.gradient !== void 0) {
    const i = e.gradient;
    if (!Y(i)) return [...n, `${t}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(i))
      ["type", "colors", "direction"].includes(a) || n.push(`${t}.gradient has an unknown field: ${a}.`);
    const r = R({ type: "enum", values: dt }, i.type, `${t}.gradient.type`);
    if (r && n.push(r), i.direction !== void 0) {
      const a = R({ type: "enum", values: lt }, i.direction, `${t}.gradient.direction`);
      a && n.push(a);
    }
    !Array.isArray(i.colors) || i.colors.length < 2 || i.colors.length > 8 ? n.push(`${t}.gradient.colors must list 2 to 8 colours.`) : i.colors.forEach((a, p) => {
      const b = R({ type: "color" }, a, `${t}.gradient.colors[${p}]`);
      b && n.push(b);
    });
  }
  return n;
}
function Ut(e) {
  return {
    backgroundColor: e.color,
    backgroundColorAsGradient: !!e.gradient,
    backgroundGradientType: e.gradient?.type ?? "linear",
    backgroundGradientColors: e.gradient?.colors ?? [],
    backgroundGradientStrategy: e.gradient?.direction ?? "horizontal"
  };
}
function ht() {
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
          type: { type: "string", enum: [...dt] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: V({ type: "color" }) },
          direction: { type: "string", enum: [...lt] }
        }
      }
    }
  };
}
function Kt(e) {
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
const Jt = ["ids", "text", "match", "all", "within", "groupId"], Zt = ["ids", "text", "within", "groupId"];
function ae(e, t) {
  if (!Y(e)) return [`${t} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const i of Object.keys(e))
    Jt.includes(i) || n.push(`${t} has an unknown field: ${i}.`);
  const o = Zt.filter((i) => e[i] !== void 0);
  if (o.length > 1 && n.push(`${t} must name notes one way, not by ${o.join(" and ")}.`), !o.length && e.all !== !0 && n.push(`${t} must name notes by ids, text, within, groupId or all: true.`), e.ids !== void 0 && (!Array.isArray(e.ids) || !e.ids.length || e.ids.some((i) => typeof i != "string" || !i)) && n.push(`${t}.ids must be a list of note ids.`), e.text !== void 0 && (typeof e.text != "string" || !e.text.trim()) && n.push(`${t}.text must be the text of a note.`), e.match !== void 0) {
    e.text === void 0 && n.push(`${t}.match goes with text.`);
    const i = R({ type: "enum", values: ["exact", "contains"] }, e.match, `${t}.match`);
    i && n.push(i);
  }
  if (e.all !== void 0 && e.all !== !0 && n.push(`${t}.all must be true when given.`), e.groupId !== void 0 && (typeof e.groupId != "string" || !e.groupId) && n.push(`${t}.groupId must be a group id.`), e.within !== void 0) {
    const i = e.within;
    Y(i) && Object.keys(i).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof i[a] == "number" && Number.isFinite(i[a])) && i.width > 0 && i.height > 0 || n.push(`${t}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function pt() {
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
const Vt = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, ut = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function he(e, t, n, o, i, { required: r = !0, plural: a = `${o}s` } = {}) {
  const p = [];
  if (e === void 0 && !r) return p;
  if (!Y(e) || r && !Object.keys(e).length)
    return [r ? `${n} requires at least one ${o}.` : `${n} ${a} must be an object.`];
  const b = Object.keys(e).filter((k) => !t.includes(k));
  b.length && p.push(`${n} contains unsupported ${a}: ${b.join(", ")}.`);
  for (const [k, f] of Object.entries(e))
    t.includes(k) && i(k, f, p);
  return p;
}
function et(e, t) {
  return (n, o, i) => {
    const r = me[n]?.spec ?? P[n].spec(e), a = R(r, o, `${t} ${n}`);
    a && i.push(a);
  };
}
function tt(e) {
  return (t, n, o) => {
    const i = R(oe[t].spec, n, `${e} ${t}`);
    i && o.push(i);
  };
}
function Z(e) {
  return Array.isArray(e) && e.length > 0 && e.every((t) => typeof t == "string" && t.length > 0);
}
function Qt(e, t = {}) {
  const n = Oe(t), o = Ie(t), i = t.userMessage || "";
  if (!Y(e)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const r = [];
  for (const s of Object.keys(e))
    s !== "message" && s !== "operations" && r.push(`The plan has an unknown field: ${s}.`);
  (typeof e.message != "string" || !e.message.trim()) && r.push("A natural completion message is required."), !Array.isArray(e.operations) || e.operations.length === 0 ? r.push("At least one slate operation is required.") : e.operations.length > o.operationsPerPlan && r.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const a = !!t.existingNodeIds?.length, p = new Set((t.existingNodeIds || []).filter(Boolean)), b = !!t.existingConnectionIds?.length, k = new Set((t.existingConnectionIds || []).filter(Boolean)), f = (s, c) => {
    a && Y(s) && Array.isArray(s.ids) && s.ids.some((d) => !p.has(d)) && r.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(e.operations) ? e.operations : []).forEach((s, c) => {
    const d = `Operation ${c + 1}`;
    if (!Y(s) || !ve.includes(s.kind)) {
      r.push(`${d} has an unsupported kind.`);
      return;
    }
    const $ = Xe[s.kind], v = Object.keys(s).filter((m) => !$.includes(m));
    for (const m of v) r.push(`${d} has an unknown field: ${m}.`);
    switch (s.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(s.count) || s.count < 1 || s.count > o.notesPerAdd) && r.push(`${d} count must be an integer from 1 to ${o.notesPerAdd}.`), s.preset !== void 0) {
          const g = R({ type: "enum", values: He }, s.preset, `${d} preset`);
          g && r.push(g);
        }
        const m = Y(s.placement) && s.placement.connect === !0;
        if (s.shape !== void 0 || s.preset === void 0 && !m) {
          const g = R(P.shape.spec(n), s.shape, `${d} shape`);
          g && r.push(g);
        }
        for (const g of ["text", "width", "height"]) {
          if (s[g] === void 0) continue;
          const O = R(P[g].spec(n), s[g], `${d} ${g}`);
          O && r.push(O);
        }
        s.x === void 0 != (s.y === void 0) && r.push(`${d} needs both x and y, or neither.`);
        for (const g of ["x", "y"]) {
          if (s[g] === void 0) continue;
          const O = R(P[g].spec(n), s[g], `${d} ${g}`);
          O && r.push(O);
        }
        s.ids !== void 0 && (!Z(s.ids) || new Set(s.ids).size !== s.ids.length ? r.push(`${d} ids must be a list of different note ids.`) : s.ids.some((g) => !Je.test(g)) ? r.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(s.count) && s.ids.length > s.count && r.push(`${d} has more ids than notes to add.`));
        const y = s.placement;
        if (y !== void 0)
          if (!Y(y))
            r.push(`${d} placement must be an object.`);
          else {
            const g = s.x !== void 0 ? ["arrangement", "gap", ...y.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const O of Object.keys(y))
              g.includes(O) || r.push(
                s.x !== void 0 && ["relativeTo", "direction", "connect"].includes(O) ? `${d} gives x and y, so placement cannot also give ${O}.` : `${d} placement has an unknown field: ${O}.`
              );
            y.connect !== void 0 && (typeof y.connect != "boolean" ? r.push(`${d} placement.connect must be true or false.`) : y.connect && (y.relativeTo === void 0 && r.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), y.direction === "center" && r.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), y.relativeTo !== void 0 && typeof y.relativeTo != "string" ? r.push(`${d} placement.relativeTo must be a note id.`) : y.relativeTo && a && !p.has(y.relativeTo) && r.push(`${d} references a note that is not in the slate.`);
            for (const [O, B] of [["direction", at], ["arrangement", ct]]) {
              if (y[O] === void 0) continue;
              const l = R({ type: "enum", values: B }, y[O], `${d} placement.${O}`);
              l && r.push(l);
            }
            if (y.gap !== void 0) {
              const O = R({ type: "number", min: 0, max: 2e3 }, y.gap, `${d} placement.gap`);
              O && r.push(O);
            }
          }
        r.push(...he(s.style, Be, d, "node style", et(n, d), { required: !1 })), Z(s.ids) && s.ids.forEach((g) => p.add(g));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = ae(s.target, `${d} target`);
        if (r.push(...m), m.length || f(s.target, d), s.kind === "update_nodes" && r.push(...he(s.changes, Ct, d, "node change", et(n, d), { plural: "changes" })), s.kind === "delete_nodes" && Y(s.target) && s.target.all === !0 && Object.keys(s.target).length === 1 && !ut.test(i) && r.push(`${d} cannot delete every note without an explicit request.`), s.kind === "arrange_nodes") {
          const y = R({ type: "enum", values: Fe }, s.layout, `${d} layout`);
          if (y && r.push(y), s.gap !== void 0) {
            const g = R({ type: "number", min: 0, max: 2e3 }, s.gap, `${d} gap`);
            g && r.push(g);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = ae(s.target, `${d} target`);
        if (r.push(...m), m.length || f(s.target, d), s.offset !== void 0) {
          const y = R({ type: "point" }, s.offset, `${d} offset`);
          y && r.push(y);
        }
        s.ids !== void 0 && (!Z(s.ids) || new Set(s.ids).size !== s.ids.length ? r.push(`${d} ids must be a list of different note ids.`) : s.ids.some((y) => !Je.test(y)) ? r.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Y(s.target) && Z(s.target.ids) && s.ids.length > s.target.ids.length && r.push(`${d} has more ids than notes to copy.`)), Z(s.ids) && s.ids.forEach((y) => p.add(y));
        return;
      }
      case "connect_nodes": {
        const m = ae(s.from, `${d} from`);
        if (r.push(...m), m.length || f(s.from, d), Y(s.to) && s.to.point !== void 0) {
          Object.keys(s.to).length !== 1 && r.push(`${d} to must be a note selector or {point}, not both.`);
          const O = R({ type: "point" }, s.to.point, `${d} to.point`);
          O && r.push(O);
        } else {
          const O = ae(s.to, `${d} to`);
          r.push(...O), O.length || f(s.to, d);
        }
        s.ids !== void 0 && (!Z(s.ids) || new Set(s.ids).size !== s.ids.length ? r.push(`${d} ids must be a list of different connector ids.`) : s.ids.some((O) => O.length > Ze) && r.push(`${d} connector ids can be at most ${Ze} characters.`)), r.push(...he(s.style, qe, d, "connection style", tt(d), { required: !1 })), Z(s.ids) && s.ids.forEach((O) => k.add(O));
        const y = s.from?.ids, g = s.to?.ids;
        Z(y) && Z(g) && y.forEach((O) => g.forEach((B) => k.add(`${O}->${B}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = s.connectionIds !== void 0, y = s.from !== void 0 || s.to !== void 0;
        if (m && y && r.push(`${d} names connectors by connectionIds or by from and to, not both.`), !m && !y && r.push(`${d} requires connectionIds or both from and to note selectors.`), m && (Z(s.connectionIds) ? b && s.connectionIds.some((g) => !k.has(g)) && r.push(`${d} references connectors that are not in the slate.`) : r.push(`${d} connectionIds must be a list of connector ids.`)), y)
          for (const g of ["from", "to"]) {
            const O = ae(s[g], `${d} ${g}`);
            r.push(...O), O.length || f(s[g], d);
          }
        if (s.kind === "update_connections") {
          r.push(...he(s.changes, Object.keys(oe), d, "connection change", tt(d)));
          const g = Y(s.changes) ? s.changes : {};
          g.toNote !== void 0 && g.toPoint !== void 0 && r.push(`${d} moves the far end with toNote or toPoint, not both.`), g.fromNote !== void 0 && g.fromPoint !== void 0 && r.push(`${d} moves the starting end with fromNote or fromPoint, not both.`), g.ends !== void 0 && (g.fromEnd !== void 0 || g.toEnd !== void 0) && r.push(`${d} sets ends, or fromEnd and toEnd, not both.`), g.toPoint !== void 0 && g.toEnd !== void 0 && r.push(`${d} cannot pin a far end it leaves free (toPoint with toEnd).`), g.fromPoint !== void 0 && (g.toPoint !== void 0 || g.fromEnd !== void 0) && r.push(`${d} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        r.push(
          ...he(s.changes, Object.keys(de), d, "slate change", (m, y, g) => {
            if (m === "background") {
              g.push(...Gt(y, `${d} background`));
              return;
            }
            const O = R(de[m].spec, y, `${d} ${m}`);
            O && g.push(O);
          })
        ), Y(s.changes) && s.changes.background !== void 0 && !Vt.test(i) && r.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: r.length === 0, errors: r };
}
const x = (e) => e.options.id, G = (e, t) => P[t].read(e.options), U = (e) => ({
  x: G(e, "x"),
  y: G(e, "y"),
  width: Number(e.options.width ?? 120),
  height: Number(e.options.height ?? 80)
}), ne = (e) => !!e.targetPoint || `${e.childId || ""}`.startsWith(ue), pe = (e, t) => `${e}->${t}`;
function $e(e) {
  return JSON.parse(JSON.stringify(e ?? null));
}
function Se(e) {
  const t = e?.nodes && !Array.isArray(e.nodes), n = t ? e.v2 ?? e : null, o = t ? {
    options: $e(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((i) => en(i?.v2 ?? i))
  } : $e(e || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((i) => {
    const r = i?.options ? i : { options: { ...i || {} }, relationships: i?.relationships };
    return r.options.relationships && delete r.options.relationships, r.relationships = { ...r.relationships || {}, associations: [...r.relationships?.associations || []] }, r.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = r.options.id), a.id || (a.id = pe(a.parentId, a.childId));
    }), r;
  }), o;
}
function en(e) {
  const t = $e(e.options || {});
  t.x !== void 0 && (t.xPos = t.x, delete t.x), t.y !== void 0 && (t.yPos = t.y, delete t.y), t.fontColor !== void 0 && t.foregroundColor === void 0 && (t.foregroundColor = t.fontColor);
  const n = typeof e.getRotation == "function" ? e.getRotation() : void 0;
  typeof n == "number" && (t.rotate = { ...t.rotate || {}, rotationAngle: n });
  const o = e.relationships, i = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: t,
    relationships: {
      associations: i.map(({ parent: r, child: a, ...p }) => $e(p))
    }
  };
}
function te(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const o of e.nodes)
    for (const i of o.relationships.associations)
      t.has(i.id) || (t.add(i.id), n.push({ node: o, association: i }));
  return n;
}
const Pe = (e) => `${e ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function ee(e, t, n) {
  const o = e.nodes;
  if (t.ids)
    return t.ids.map((i) => o.find((r) => x(r) === i)).filter(Boolean);
  if (t.text !== void 0) {
    const i = Pe(t.text), r = o.filter(
      (a) => t.match === "contains" ? Pe(a.options.text).includes(i) : Pe(a.options.text) === i
    );
    if (r.length > 1 && t.all !== !0)
      throw new F(
        "ambiguous_selector",
        400,
        `${n} "${t.text}" matches ${r.length} notes (${r.map(x).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: r.map((a) => ({ id: x(a), text: a.options.text ?? "" })) }
      );
    return r;
  }
  if (t.within) {
    const i = t.within;
    return o.filter((r) => {
      const a = U(r);
      return a.x >= i.x && a.y >= i.y && a.x + a.width <= i.x + i.width && a.y + a.height <= i.y + i.height;
    });
  }
  return t.groupId !== void 0 ? o.filter((i) => i.options.groupId === t.groupId) : t.all === !0 ? [...o] : [];
}
const ce = (e) => Math.round(e * 1e4) / 1e4, nt = (e) => Math.max(0, Math.min(1, e));
function tn(e) {
  const t = nt(e.x), n = nt(e.y), o = [t, 1 - t, n, 1 - n], i = Math.min(...o);
  return i === o[0] ? { x: 0, y: ce(n) } : i === o[1] ? { x: 1, y: ce(n) } : i === o[2] ? { x: ce(t), y: 0 } : { x: ce(t), y: 1 };
}
function nn(e) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[e];
}
function ft(e, t, n) {
  if (!n) return { ...e };
  const o = n * Math.PI / 180, i = e.x - t.x, r = e.y - t.y;
  return { x: t.x + i * Math.cos(o) - r * Math.sin(o), y: t.y + i * Math.sin(o) + r * Math.cos(o) };
}
function on(e, t) {
  const n = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, o = ft(t, n, -(e.rotation || 0));
  return { x: (o.x - e.x) / (e.width || 1), y: (o.y - e.y) / (e.height || 1) };
}
function sn(e, t) {
  const n = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, o = ft({ x: e.x + t.x * e.width, y: e.y + t.y * e.height }, n, e.rotation || 0);
  return { x: ce(o.x), y: ce(o.y) };
}
function rn(e, t) {
  const n = on(e, t), o = (n.x - 0.5) * (e.width || 1), i = (n.y - 0.5) * (e.height || 1);
  if (Math.abs(o) < 1e-9 && Math.abs(i) < 1e-9) return { x: 0.5, y: 0 };
  const r = o !== 0 ? e.width / 2 / Math.abs(o) : 1 / 0, a = i !== 0 ? e.height / 2 / Math.abs(i) : 1 / 0, p = Math.min(r, a);
  return tn({ x: 0.5 + o * p / (e.width || 1), y: 0.5 + i * p / (e.height || 1) });
}
function an(e) {
  const t = { ...e };
  return t.showParentArrow = e.showChildArrow !== !1, t.showChildArrow = !!e.showParentArrow, t.sourceAnchor = e.targetAnchor ?? null, t.targetAnchor = null, t;
}
const Le = (e) => ({ ...U(e), rotation: Number(G(e, "rotationAngle")) || 0 }), cn = (e) => ({ x: e.x + e.width / 2, y: e.y + e.height / 2 });
function dn(e, t, n, o, i, r) {
  const a = (d) => e.nodes.find(($) => x($) === d), p = (d) => {
    throw new F("invalid_operation_plan", 400, `${i} ${d}`);
  }, b = (d) => {
    throw new F("no_match", 409, `${i} names no note ${JSON.stringify(d)} on the slate.`);
  }, k = (d, $) => {
    d !== $ && (d.relationships.associations = d.relationships.associations.filter((v) => v !== n), $.relationships.associations.push(n));
  };
  let f = t;
  if (o.toNote !== void 0) {
    const d = a(o.toNote) ?? b(o.toNote);
    n.childId = x(d), delete n.targetPoint, n.targetAnchor = null;
  } else o.toPoint !== void 0 && (ne(n) || (n.childId = `${ue}${r()}`), n.targetPoint = { x: o.toPoint.x, y: o.toPoint.y }, n.targetAnchor = null);
  if (o.fromNote !== void 0) {
    const d = a(o.fromNote) ?? b(o.fromNote);
    n.parentId = x(d), n.sourceAnchor = null, k(f, d), f = d;
  } else if (o.fromPoint !== void 0) {
    ne(n) && p(`keeps one end on a note: the far end of ${n.id} is already free.`);
    const d = a(n.childId) ?? b(n.childId), $ = an(n);
    for (const v of Object.keys(n)) delete n[v];
    Object.assign(n, $, {
      parentId: x(d),
      childId: `${ue}${r()}`,
      targetPoint: { x: o.fromPoint.x, y: o.fromPoint.y }
    }), k(f, d), f = d;
  }
  n.parentId === n.childId && p(`cannot connect ${n.id} from a note to itself.`);
  const s = (d) => {
    if (d === "target" && ne(n)) return n.targetPoint;
    const $ = a(d === "source" ? n.parentId : n.childId);
    if (!$) return null;
    const v = d === "source" ? n.sourceAnchor : n.targetAnchor;
    return v ? sn(Le($), v) : cn(Le($));
  }, c = (d, $, v) => {
    if (d === "target" && ne(n)) {
      v && p(`cannot pin or follow the far end of ${n.id}: it is free, on no note.`);
      return;
    }
    const m = d === "source" ? "sourceAnchor" : "targetAnchor";
    if ($ === "follow") n[m] = null;
    else if ($ !== "pinned") n[m] = nn($);
    else if (!n[m]) {
      const y = a(d === "source" ? n.parentId : n.childId), g = s(d === "source" ? "target" : "source");
      y && g && (n[m] = rn(Le(y), g));
    }
  };
  return o.ends !== void 0 && (c("source", o.ends, !1), c("target", o.ends, !1)), o.fromEnd !== void 0 && c("source", o.fromEnd, !0), o.toEnd !== void 0 && c("target", o.toEnd, !0), f;
}
function ln(e) {
  return {
    fromEnd: e.sourceAnchor ? "pinned" : "follow",
    toEnd: ne(e) ? "free" : e.targetAnchor ? "pinned" : "follow"
  };
}
function mt(e) {
  const { x: t, y: n, width: o, height: i } = e, r = e.rotationAngle || 0;
  if (!r) return { minX: t, minY: n, maxX: t + o, maxY: n + i };
  const a = t + o / 2, p = n + i / 2, b = r * Math.PI / 180, k = Math.cos(b), f = Math.sin(b);
  let s = 1 / 0, c = 1 / 0, d = -1 / 0, $ = -1 / 0;
  for (const [m, y] of [[t, n], [t + o, n], [t + o, n + i], [t, n + i]]) {
    const g = m - a, O = y - p, B = a + g * k - O * f, l = p + g * f + O * k;
    s = Math.min(s, B), c = Math.min(c, l), d = Math.max(d, B), $ = Math.max($, l);
  }
  const v = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: v(s), minY: v(c), maxX: v(d), maxY: v($) };
}
function hn(e, t) {
  if (t.length < 2) return [];
  const n = t.map(mt), o = Math.min(...n.map((k) => k.minX)), i = Math.max(...n.map((k) => k.maxX)), r = Math.min(...n.map((k) => k.minY)), a = Math.max(...n.map((k) => k.maxY)), p = (o + i) / 2, b = (r + a) / 2;
  return t.map((k, f) => {
    const s = n[f];
    let { x: c, y: d } = k;
    return e === "left" ? c += o - s.minX : e === "right" ? c += i - s.maxX : e === "centerH" ? c += p - (s.minX + s.maxX) / 2 : e === "top" ? d += r - s.minY : e === "bottom" ? d += a - s.maxY : e === "middle" && (d += b - (s.minY + s.maxY) / 2), { id: k.id, x: c, y: d };
  });
}
function pn(e, t) {
  if (t.length < 3) return [];
  const n = t.map((c, d) => ({ box: c, index: d, b: mt(c) })), o = e === "horizontal", i = (c) => o ? c.b.minX : c.b.minY, r = (c) => o ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, a = [...n].sort((c, d) => i(c) - i(d) || c.index - d.index), p = i(a[0]), k = (a.reduce((c, d) => Math.max(c, i(d) + r(d)), -1 / 0) - p - a.reduce((c, d) => c + r(d), 0)) / (a.length - 1), f = /* @__PURE__ */ new Map();
  let s = p;
  for (const c of a) {
    const d = s - i(c);
    f.set(c.index, {
      id: c.box.id,
      x: o ? c.box.x + d : c.box.x,
      y: o ? c.box.y : c.box.y + d
    }), s += r(c) + k;
  }
  return n.map((c) => f.get(c.index));
}
function _e(e, t, n) {
  const o = Math.min(e.x + e.width + n - t.x, t.x + t.width + n - e.x), i = Math.min(e.y + e.height + n - t.y, t.y + t.height + n - e.y);
  return o > 0 && i > 0 ? { x: o, y: i } : null;
}
const un = 4e6;
function fn(e, t, { gap: n = 20 } = {}) {
  const o = e.map((f) => ({ ...f })), i = t.map((f) => ({ ...f })), r = (f, s, c, d, $) => {
    const v = f.x + f.width / 2 - (s.x + s.width / 2), m = f.y + f.height / 2 - (s.y + s.height / 2);
    c.y <= c.x ? f.y += (m > 0 || m === 0 && $ > 0 ? 1 : -1) * c.y * d : f.x += (v > 0 || v === 0 && $ > 0 ? 1 : -1) * c.x * d;
  }, a = Math.max(1, o.length * (i.length + o.length / 2)), p = Math.max(1, Math.min(1e3, Math.floor(un / a)));
  let b = !1;
  for (let f = 0; f < p; f += 1) {
    let s = !1;
    for (let c = 0; c < o.length; c += 1) {
      for (const d of i) {
        const $ = _e(o[c], d, n);
        $ && (r(o[c], d, $, 1, 1), s = !0);
      }
      for (let d = c + 1; d < o.length; d += 1) {
        const $ = _e(o[c], o[d], n);
        $ && (r(o[c], o[d], $, 0.5, -1), r(o[d], o[c], $, 0.5, 1), s = !0);
      }
    }
    if (!s) {
      b = !0;
      break;
    }
  }
  const k = (f) => Math.round(f * 100) / 100;
  for (const f of o)
    f.x = k(f.x), f.y = k(f.y);
  return b || mn(o, i, n), o.map(({ id: f, x: s, y: c }) => ({ id: f, x: s, y: c }));
}
function mn(e, t, n) {
  const o = [...t], i = [];
  for (const d of e)
    o.some(($) => _e(d, $, n)) ? i.push(d) : o.push(d);
  if (!i.length) return;
  const r = Math.min(...e.map((d) => d.x)), a = o.length ? Math.max(...o.map((d) => d.y + d.height)) + n : Math.min(...e.map((d) => d.y)), p = o.length ? Math.max(...o.map((d) => d.x + d.width)) : r, b = i.reduce((d, $) => d + ($.width + n) * ($.height + n), 0), k = Math.max(p - r, Math.sqrt(b) * 1.5, ...i.map((d) => d.width));
  let f = r, s = a, c = 0;
  for (const d of i)
    f > r && f + d.width > r + k && (f = r, s += c + n, c = 0), d.x = f, d.y = s, f += d.width + n, c = Math.max(c, d.height);
}
function gn(e, t, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!e.length) return [];
  const i = new Map(e.map((l) => [l.id, l])), r = new Map(e.map((l) => [l.id, []])), a = new Map(e.map((l) => [l.id, 0]));
  for (const [l, h] of t)
    !i.has(l) || !i.has(h) || l === h || (r.get(l).push(h), a.set(h, a.get(h) + 1));
  const p = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), k = [], f = (l) => {
    k.push(l), b.set(l, 0), p.set(l, []);
    const h = [l];
    for (; h.length; ) {
      const u = h.shift();
      for (const w of r.get(u))
        b.has(w) || (b.set(w, b.get(u) + 1), p.set(w, []), p.get(u).push(w), h.push(w));
    }
  };
  for (const l of e) a.get(l.id) === 0 && !b.has(l.id) && f(l.id);
  for (const l of e) b.has(l.id) || f(l.id);
  const s = [];
  for (const l of e) {
    const h = b.get(l.id);
    s[h] = Math.max(s[h] ?? 0, l.height);
  }
  const c = Math.min(...e.map((l) => l.x)), d = Math.min(...e.map((l) => l.y)), $ = [];
  s.forEach((l, h) => {
    $[h] = h === 0 ? d : $[h - 1] + s[h - 1] + n;
  });
  const v = /* @__PURE__ */ new Map(), m = (l) => {
    const h = p.get(l), u = h.reduce((I, A) => I + m(A), 0) + n * Math.max(0, h.length - 1), w = Math.max(i.get(l).width, u);
    return v.set(l, w), w;
  }, y = /* @__PURE__ */ new Map(), g = (l, h) => {
    const u = i.get(l), w = p.get(l), I = v.get(l), A = $[b.get(l)];
    if (!w.length) {
      y.set(l, { id: l, x: h + (I - u.width) / 2, y: A });
      return;
    }
    const N = w.reduce((S, C) => S + v.get(C), 0) + n * (w.length - 1);
    let T = h + (I - N) / 2;
    for (const S of w)
      g(S, T), T += v.get(S) + n;
    const j = y.get(w[0]), M = y.get(w[w.length - 1]), E = (j.x + i.get(w[0]).width / 2 + M.x + i.get(w[w.length - 1]).width / 2) / 2, _ = Math.min(Math.max(E - u.width / 2, h), h + I - u.width);
    y.set(l, { id: l, x: _, y: A });
  };
  let O = c;
  for (const l of k) {
    const h = m(l);
    g(l, O), O += h + n;
  }
  const B = e.map((l) => y.get(l.id));
  return yn(e, B, o, n);
}
function yn(e, t, n, o) {
  if (!n.length) return t;
  let i = 0;
  for (let r = 0; r <= n.length; r += 1) {
    let a = 0;
    if (t.forEach((p, b) => {
      const k = { ...e[b], x: p.x, y: p.y + i };
      for (const f of n)
        _e(k, f, o) && (a = Math.max(a, f.y + f.height + o - k.y));
    }), !a) break;
    i += a;
  }
  return i ? t.map((r) => ({ ...r, y: r.y + i })) : t;
}
function bn() {
  const e = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let n = 0; n < 12; n += 1) t += e[Math.floor(Math.random() * e.length)];
  return t;
}
function wn(e) {
  const t = (r) => {
    const a = (parseInt(r, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (r) => 0.2126 * t(r.substr(1, 2)) + 0.7152 * t(r.substr(3, 2)) + 0.0722 * t(r.substr(-2)), o = (r, a) => {
    const [p, b] = [n(r), n(a)];
    return (Math.max(p, b) + 0.05) / (Math.min(p, b) + 0.05);
  }, i = /^#[0-9a-f]{6}$/i.test(e) ? e : "#7aa2c8";
  return o(i, "#ffffff") > o(i, "#000000") ? "#ffffff" : "#000000";
}
function xn(e, t, n) {
  return e.x < t.x + t.width + n && e.x + e.width + n > t.x && e.y < t.y + t.height + n && e.y + e.height + n > t.y;
}
function kn(e, t, n, o, i, r) {
  let a = e;
  for (let p = 0; p <= t.length; p += 1) {
    const b = t.filter((s) => a.some((c) => xn({ ...c, width: n, height: o }, s, r)));
    if (!b.length) return a;
    let k = 0, f = 0;
    i === "left" ? k = Math.min(...b.map((s) => s.x - r)) - Math.max(...a.map((s) => s.x + n)) : i === "above" ? f = Math.min(...b.map((s) => s.y - r)) - Math.max(...a.map((s) => s.y + o)) : i === "below" || i === "center" ? f = Math.max(...b.map((s) => s.y + s.height + r)) - Math.min(...a.map((s) => s.y)) : k = Math.max(...b.map((s) => s.x + s.width + r)) - Math.min(...a.map((s) => s.x)), a = a.map((s) => ({ x: s.x + k, y: s.y + f }));
  }
  return a;
}
function gt(e, t) {
  if (t) {
    const n = e.nodes.find((i) => x(i) === t);
    if (n) return n;
    const o = e.nodes.filter((i) => `${i.options.text ?? ""}`.trim().toLowerCase() === t.trim().toLowerCase());
    if (o.length === 1) return o[0];
  }
  return [...e.nodes].sort((n, o) => U(o).x + U(o).width - (U(n).x + U(n).width))[0];
}
function ze(e, t) {
  const n = t === "grid" ? Math.ceil(Math.sqrt(e)) : e;
  return Array.from({ length: e }, (o, i) => ({
    row: t === "column" ? i : t === "grid" ? Math.floor(i / n) : 0,
    column: t === "column" ? 0 : t === "grid" ? i % n : i
  }));
}
function vn(e, t, n, o) {
  const i = t.count, r = t.placement || {}, a = r.gap ?? (r.connect ? zt : 48);
  if (t.x !== void 0 && t.y !== void 0) {
    const c = r.arrangement || "row";
    return { points: ze(i, c).map(({ row: $, column: v }) => ({
      x: t.x + v * (n + a),
      y: t.y + $ * (o + a)
    })), arrangement: c, gap: a };
  }
  const p = gt(e, r.relativeTo), b = p ? U(p) : { x: 0, y: 0, width: 160, height: 100 }, k = r.direction || "right", f = r.arrangement || (["left", "right"].includes(k) ? "column" : "row"), s = ze(i, f).map(({ row: c, column: d }) => {
    let $ = b.x + d * (n + a), v = b.y + c * (o + a);
    return k === "right" && ($ += b.width + a), k === "left" && ($ -= n + a), k === "below" && (v += b.height + a), k === "above" && (v -= o + a), { x: $, y: v };
  });
  return { points: kn(s, e.nodes.map(U), n, o, k, a), arrangement: f, gap: a };
}
function $n(e, t) {
  if (!e) return { childId: `${ue}${t()}` };
  const n = e.match(/->(__free_.+)$/);
  return { id: e, childId: n ? n[1] : `${ue}${e.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Te(e, t) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}~${n}`); ) n += 1;
  return `${t}~${n}`;
}
const Ce = (e, t) => JSON.stringify([e, t]);
function je(e, t, n) {
  return new F(
    "id_taken",
    409,
    `${e} names ${t} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${t}s in a later operation.`,
    { ids: n }
  );
}
const ot = (e, t) => JSON.stringify(e) === JSON.stringify(t), _n = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Re = (e) => JSON.parse(JSON.stringify(e)), we = 1e6, st = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, re = (e) => ({ id: x(e), ...U(e), rotationAngle: G(e, "rotationAngle") });
function Rn(e, t, n = {}) {
  const o = Oe(n), i = Ie(n), r = n.idFactory || bn, a = Se(e), p = Qt(t, {
    ...n,
    existingNodeIds: a.nodes.map(x),
    existingConnectionIds: te(a).map(({ association: c }) => c.id)
  });
  if (!p.valid)
    throw new F("invalid_operation_plan", 400, p.errors.join(" "), { errors: p.errors });
  const b = JSON.stringify(a), k = a.nodes.length, f = [], s = {
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
    const $ = d + 1, v = `Operation ${$}`, m = { operation: $, kind: c.kind, matched: [], changed: [] };
    s.operations.push(m);
    const y = () => s.warnings.push(`${v} matched no notes.`), g = (l) => {
      s.skipped.push({ operation: $, id: x(l), reason: "locked" });
    }, O = (l) => {
      const h = a.nodes.length + l;
      if (l > 0 && h > i.notesPerSlate && h > k)
        throw new F(
          "note_limit",
          422,
          `${v} would leave ${h} notes; a slate can hold at most ${i.notesPerSlate} notes.`,
          { limit: i.notesPerSlate, operation: $ }
        );
    }, B = (l, h) => {
      if (h > 0 && l > i.connectorsPerSlate)
        throw new F(
          "connector_limit",
          422,
          `${v} would leave ${l} connectors; a slate can hold at most ${i.connectorsPerSlate} connectors.`,
          { limit: i.connectorsPerSlate, operation: $ }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const l = c.preset ? kt[c.preset] : void 0, h = c.placement?.connect === !0, u = h ? a.nodes.find((W) => x(W) === c.placement.relativeTo) : void 0;
        if (h && !u)
          throw new F("no_match", 409, `${v} placement.relativeTo names no note on the slate to connect from.`, { operation: $ });
        if (u && u.options.isLocked === !0) {
          g(u);
          return;
        }
        const w = c.shape ?? l?.shape, I = u ? U(u) : void 0, A = typeof w == "string" && w.toLowerCase() === "triangle", N = w && typeof w == "object" ? yt(w) : 0, T = c.width ?? l?.width ?? I?.width ?? (A ? 150 : N ? Math.round(N >= 1 ? 180 : 180 * N) : 180), j = c.height ?? l?.height ?? I?.height ?? (A ? 130 : N ? Math.round(N >= 1 ? 180 / N : 180) : 110), M = u ?? gt(a, c.placement?.relativeTo), E = c.style?.backgroundColor || l?.style?.backgroundColor || M?.options.backgroundColor || "#7aa2c8", { points: _, arrangement: S, gap: C } = vn(a, c, T, j), L = new Set(te(a).map(({ association: W }) => W.id)), X = new Set(a.nodes.map(x)), K = (c.ids || []).filter((W) => X.has(W));
        if (K.length && !n.replay) throw je(v, "note", K);
        const z = _.map((W, Ee) => c.ids?.[Ee] || r());
        O(z.filter((W) => !X.has(W)).length), u && B(L.size + z.filter((W) => !X.has(W)).length, z.length), _.forEach(({ x: W, y: Ee }, Ge) => {
          const J = z[Ge];
          if (m.matched.push(J), X.has(J)) return;
          const Ue = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${Ge + 1}`) : c.text : "", ye = u ? Re(u.options) : void 0;
          if (ye) for (const Q of _n) delete ye[Q];
          const se = ye ? { ...ye, id: J, name: J, text: Ue, width: T, height: j } : {
            id: J,
            name: J,
            text: Ue,
            defaultShaped: !0,
            width: T,
            height: j,
            backgroundColor: E,
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
          w && P.shape.store(se, w, o), P.x.store(se, W, o), P.y.store(se, Ee, o), u || P.foregroundColor.store(se, wn(E), o);
          for (const [Q, Ne] of Object.entries(l?.style || {})) P[Q].store(se, Ne, o);
          for (const [Q, Ne] of Object.entries(c.style || {})) P[Q].store(se, Ne, o);
          if (a.nodes.push({ options: se, relationships: { associations: [] } }), m.changed.push(J), s.created.push(J), u) {
            const Q = Te(L, pe(x(u), J));
            L.add(Q), u.relationships.associations.push({ id: Q, parentId: x(u), childId: J, ...Ae }), s.connected.push(Q);
          }
        });
        const { placement: ge, ...H } = c;
        f.push({
          ...H,
          ids: z,
          x: _[0].x,
          y: _[0].y,
          placement: { arrangement: S, gap: C, ...u ? { relativeTo: x(u), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = ee(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || y();
        const h = [];
        for (const u of l) {
          if (u.options.isLocked === !0 && c.changes.locked !== !1) {
            g(u);
            continue;
          }
          const w = JSON.stringify(u.options);
          for (const [I, A] of Object.entries(c.changes))
            me[I] || P[I].store(u.options, A, o);
          On(u.options, c.changes), h.push(x(u)), JSON.stringify(u.options) !== w && m.changed.push(x(u));
        }
        if (c.changes.order && h.length) {
          const u = new Set(h), w = a.nodes.map(x), I = a.nodes.filter((N) => u.has(x(N))), A = a.nodes.filter((N) => !u.has(x(N)));
          a.nodes = c.changes.order === "front" ? [...A, ...I] : [...I, ...A], a.nodes.forEach((N, T) => {
            const j = x(N);
            u.has(j) && w[T] !== j && !m.changed.includes(j) && m.changed.push(j);
          });
        }
        s.updated.push(...h), h.length && f.push({ kind: "update_nodes", target: { ids: h }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const l = ee(a, c.target, `${v} target`);
        if (m.matched = l.map(x), l.length || y(), !c.target.ids && a.nodes.length > 1 && l.length === a.nodes.length && !ut.test(n.userMessage || ""))
          throw new F("invalid_operation_plan", 400, `${v} cannot delete every note without an explicit request.`);
        const u = /* @__PURE__ */ new Set();
        for (const w of l)
          w.options.isLocked === !0 ? g(w) : u.add(x(w));
        a.nodes = a.nodes.filter((w) => !u.has(x(w)));
        for (const w of a.nodes)
          w.relationships.associations = w.relationships.associations.filter(
            (I) => !u.has(I.parentId) && !u.has(I.childId)
          );
        m.changed = [...u], s.deleted.push(...u), u.size && f.push({ kind: "delete_nodes", target: { ids: [...u] } });
        return;
      }
      case "duplicate_nodes": {
        const l = ee(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || y();
        const h = c.offset ?? Dt, u = new Set(a.nodes.map(x)), w = (c.ids || []).filter((M) => u.has(M));
        if (w.length && !n.replay) throw je(v, "note", w);
        const I = l.map((M, E) => c.ids?.[E] || r());
        O(I.filter((M) => !u.has(M)).length);
        for (const M of l) {
          const E = G(M, "x") + h.x, _ = G(M, "y") + h.y;
          if (Math.abs(E) > we || Math.abs(_) > we)
            throw new F(
              "invalid_operation_plan",
              400,
              `${v} would put the copy of ${x(M)} at ${E}, ${_}; a note's position must be from -${we} to ${we}.`
            );
        }
        const A = new Map(l.map((M, E) => [x(M), I[E]])), N = /* @__PURE__ */ new Map();
        l.forEach((M, E) => {
          const _ = I[E];
          if (u.has(_)) return;
          const S = { options: { ...Re(M.options), id: _, name: _ }, relationships: { associations: [] } };
          P.x.store(S.options, G(M, "x") + h.x, o), P.y.store(S.options, G(M, "y") + h.y, o), a.nodes.push(S), N.set(_, S), m.changed.push(_), s.created.push(_);
        });
        const T = new Set(te(a).map(({ association: M }) => M.id));
        let j = 0;
        for (const M of l) {
          const E = N.get(A.get(x(M)));
          if (E)
            for (const _ of M.relationships.associations) {
              const S = A.get(_.childId);
              if (!S || ne(_)) continue;
              const C = Te(T, pe(x(E), S));
              T.add(C), E.relationships.associations.push({ ...Re(_), id: C, parentId: x(E), childId: S }), s.connected.push(C), j += 1;
            }
        }
        B(T.size, j), l.length && f.push({ kind: "duplicate_nodes", target: { ids: l.map(x) }, ids: I, offset: { ...h } });
        return;
      }
      case "connect_nodes": {
        const l = ee(a, c.from, `${v} from`), h = c.to?.point, u = h ? [] : ee(a, c.to, `${v} to`);
        (!l.length || !h && !u.length) && y();
        const w = l.length * (h ? 1 : u.length);
        if (w > i.connectorsPerOperation)
          throw new F(
            "connector_limit",
            422,
            `${v} would join ${w} pairs of notes; one operation may join at most ${i.connectorsPerOperation}.`,
            { limit: i.connectorsPerOperation }
          );
        const I = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map();
        for (const { association: E } of te(a)) {
          I.add(E.id);
          const _ = Ce(E.parentId, E.childId);
          A.has(_) || A.set(_, E.id);
        }
        const N = [], T = [], j = [];
        let M = 0;
        for (const E of l) {
          const _ = x(E), S = h ? [null] : u.filter((C) => x(C) !== _);
          if (E.options.isLocked === !0) {
            S.length && g(E), M += S.length;
            continue;
          }
          S.length && j.push(_);
          for (const C of S) {
            const L = c.ids?.[M];
            if (M += 1, !C) {
              const ge = $n(L, r), H = ge.id ?? pe(_, ge.childId);
              if (I.has(H)) {
                n.replay || N.push(H), T.push(H), m.matched.push(H);
                continue;
              }
              E.relationships.associations.push({ id: H, parentId: _, childId: ge.childId, targetPoint: { ...h }, ...Ae, ...c.style || {} }), I.add(H), T.push(H), m.matched.push(H), m.changed.push(H), s.connected.push(H);
              continue;
            }
            const X = x(C), K = A.get(Ce(_, X));
            if (K) {
              T.push(K), m.matched.push(K);
              continue;
            }
            if (L && I.has(L)) {
              n.replay || N.push(L), T.push(L), m.matched.push(L);
              continue;
            }
            const z = L || Te(I, pe(_, X));
            E.relationships.associations.push({ id: z, parentId: _, childId: X, ...Ae, ...c.style || {} }), I.add(z), A.set(Ce(_, X), z), T.push(z), m.matched.push(z), m.changed.push(z), s.connected.push(z);
          }
        }
        if (N.length) throw je(v, "connector", N);
        if (I.size > i.connectorsPerSlate && m.changed.length)
          throw new F(
            "connector_limit",
            422,
            `A slate can hold at most ${i.connectorsPerSlate} connectors; this plan would leave ${I.size}.`,
            { limit: i.connectorsPerSlate }
          );
        m.changed.length && f.push({
          kind: "connect_nodes",
          from: { ids: j },
          to: h ? { point: { ...h } } : { ids: u.map(x) },
          ids: T,
          ...c.style ? { style: c.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let l;
        if (c.connectionIds) {
          const h = new Set(c.connectionIds);
          l = te(a).filter(({ association: u }) => h.has(u.id));
        } else {
          const h = new Set(ee(a, c.from, `${v} from`).map(x)), u = new Set(ee(a, c.to, `${v} to`).map(x));
          l = te(a).filter(
            ({ association: w }) => h.has(w.parentId) && u.has(w.childId) || u.has(w.parentId) && h.has(w.childId)
          );
        }
        if (m.matched = l.map(({ association: h }) => h.id), l.length || s.warnings.push(`${v} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: h, association: u } of l)
            h.relationships.associations = h.relationships.associations.filter((w) => w !== u);
          m.changed = [...m.matched], s.disconnected.push(...m.matched), l.length && f.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { node: h, association: u } of l) {
          const w = JSON.stringify([x(h), u]), I = Object.entries(c.changes).filter(([N]) => !We.includes(N));
          for (const [N, T] of I) u[oe[N].field || N] = T;
          const A = dn(a, h, u, c.changes, v, r);
          JSON.stringify([x(A), u]) !== w && m.changed.push(u.id);
        }
        s.connectionsUpdated.push(...m.matched), l.length && f.push({ kind: "update_connections", connectionIds: m.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const l = ee(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || y();
        const h = l.filter((_) => _.options.isLocked !== !0 ? !0 : (g(_), !1));
        if (!h.length) return;
        const u = c.layout;
        let w;
        if (st[u]) w = hn(st[u], h.map(re));
        else if (u === "distribute-horizontal" || u === "distribute-vertical")
          w = pn(u === "distribute-horizontal" ? "horizontal" : "vertical", h.map(re));
        else if (u === "tidy") {
          const _ = new Set(h.map(x)), S = a.nodes.filter((C) => !_.has(x(C))).map(re);
          w = fn(h.map(re), S, { gap: c.gap ?? 20 });
        } else if (u === "tree") {
          const _ = te(a).filter(({ association: L }) => !ne(L)).map(({ association: L }) => [L.parentId, L.childId]), S = new Set(h.map(x)), C = a.nodes.filter((L) => !S.has(x(L))).map(re);
          w = gn(h.map(re), _, { gap: c.gap ?? 48, obstacles: C });
        }
        if (w) {
          const _ = new Map(h.map((S) => [x(S), S]));
          for (const S of w) {
            const C = _.get(S.id), L = [G(C, "x"), G(C, "y")];
            P.x.store(C.options, S.x, o), P.y.store(C.options, S.y, o), ot(L, [S.x, S.y]) || m.changed.push(S.id);
          }
          s.updated.push(...h.map(x)), f.push({ kind: "arrange_nodes", target: { ids: h.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const I = h.map(U), A = c.gap ?? 48, N = Math.min(...I.map((_) => _.x)), T = Math.min(...I.map((_) => _.y)), j = Math.max(...I.map((_) => _.width), 120), M = Math.max(...I.map((_) => _.height), 80), E = ze(h.length, c.layout === "circle" ? "row" : c.layout);
        h.forEach((_, S) => {
          const C = [G(_, "x"), G(_, "y")];
          let L, X;
          if (c.layout === "circle") {
            const K = Math.max(180, h.length * 35), z = Math.PI * 2 * S / h.length;
            L = N + K + Math.cos(z) * K, X = T + K + Math.sin(z) * K;
          } else
            L = N + E[S].column * (j + A), X = T + E[S].row * (M + A);
          P.x.store(_.options, L, o), P.y.store(_.options, X, o), ot(C, [L, X]) || m.changed.push(x(_));
        }), s.updated.push(...h.map(x)), f.push({ kind: "arrange_nodes", target: { ids: h.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: A } : {} });
        return;
      }
      case "update_slate": {
        const l = c.changes, h = JSON.stringify(a);
        for (const [u, w] of Object.entries(de))
          l[u] !== void 0 && w.store(a, l[u]);
        JSON.stringify(a) !== h && m.changed.push("slate"), f.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && s.warnings.length) {
    const c = s.warnings[0];
    throw new F("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return s.unchanged = JSON.stringify(a) === b, { slate: a, materializedPlan: { message: t.message.trim(), operations: f }, report: s };
}
function On(e, t) {
  const n = t.shape;
  if (!n || typeof n != "object" || e.shape !== "custom" || t.width !== void 0 && t.height !== void 0) return;
  const o = yt(n);
  if (!o) return;
  const i = (r) => Math.round(Math.min(5e3, Math.max(20, r)));
  t.height !== void 0 ? e.width = i(Number(e.height) * o) : e.height = i(Number(e.width || 180) / o);
}
function yt(e) {
  const t = De(e);
  return t.ok && t.shape.aspect > 0 ? Math.min(10, Math.max(0.1, t.shape.aspect)) : 0;
}
const it = ["id", ...Object.keys(P), "image"], xe = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), fe = (e) => e.options.isComment === !0;
function bt(e, t) {
  const n = e.options, o = (r) => !t || t.includes(r), i = { id: x(e) };
  for (const [r, a] of Object.entries(P)) {
    if (!o(r)) continue;
    const p = a.read(n);
    i[r] = p === void 0 ? null : p;
  }
  return o("image") && (i.image = n.image || null), i;
}
function wt(e) {
  const t = ne(e), n = { id: e.id, from: e.parentId, to: t ? null : e.childId };
  for (const [i, r] of Object.entries(oe)) {
    if (We.includes(i)) continue;
    const a = e[r.field ?? i];
    n[i] = a === void 0 ? null : a;
  }
  t && (n.toPoint = e.targetPoint ?? null);
  const o = ln(e);
  return (o.fromEnd !== "follow" || o.toEnd !== "follow") && Object.assign(n, o), n;
}
const le = (e) => new F("invalid_selection", 400, e);
function In(e) {
  const t = {};
  if (e.ids !== void 0 && (t.ids = e.ids), e.within !== void 0 && (t.within = e.within), e.groupId !== void 0 && (t.groupId = e.groupId), e.q !== void 0)
    t.text = e.q, t.all = !0, e.match !== void 0 && (t.match = e.match);
  else if (e.match !== void 0)
    throw le("match goes with q.");
  if (!Object.keys(t).length) return null;
  const n = ae(t, "selection").map(
    (o) => o.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q")
  );
  if (n.length) throw le(n.join(" "));
  return t;
}
const Sn = (e) => btoa(encodeURIComponent(JSON.stringify(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function En(e) {
  try {
    const { after: t, at: n } = JSON.parse(decodeURIComponent(atob(e.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof t == "string" && t && Number.isSafeInteger(n) && n >= 0) return { after: t, at: n };
  } catch {
  }
  throw le("cursor is not one this slate gave. Read again from the first page.");
}
function Nn(e, { after: t, at: n }) {
  let o = -1;
  if (e.forEach((i, r) => {
    x(i) === t && (o < 0 || Math.abs(r - n) < Math.abs(o - n)) && (o = r);
  }), o < 0) throw le("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function Mn(e) {
  if (!e.length) return null;
  const t = e.map(U), n = Math.min(...t.map((a) => a.x)), o = Math.min(...t.map((a) => a.y)), i = Math.max(...t.map((a) => a.x + a.width)), r = Math.max(...t.map((a) => a.y + a.height));
  return { x: n, y: o, width: i - n, height: r - o };
}
function Yn(e, t = {}) {
  const n = Se(e), o = n.nodes.filter((y) => !fe(y)), i = t.fields;
  if (i !== void 0) {
    const y = i.filter((g) => !it.includes(g));
    if (y.length) throw le(`Unknown note field: ${y.join(", ")}. Choose from ${it.join(", ")}.`);
  }
  const r = t.limit ?? xe.notes;
  if (!Number.isInteger(r) || r < 1 || r > xe.maxNotes)
    throw le(`limit must be a whole number from 1 to ${xe.maxNotes}.`);
  const a = t.maxChars ?? xe.maxChars, p = In(t), b = p ? ee({ ...n, nodes: o }, p, "selection") : o;
  let k = 0;
  t.cursor !== void 0 && (k = Nn(b, En(t.cursor)));
  const f = new Set(n.nodes.filter(fe).map(x)), s = /* @__PURE__ */ new Map();
  for (const { association: y } of te(n)) {
    if (f.has(y.parentId) || f.has(y.childId)) continue;
    const g = s.get(y.parentId) ?? [];
    g.push(y), s.set(y.parentId, g);
  }
  const c = [], d = [];
  let $ = 0, v = k;
  for (; v < b.length && c.length < r; v += 1) {
    const y = b[v], g = bt(y, i), O = (s.get(x(y)) ?? []).map(wt), B = JSON.stringify(g).length + JSON.stringify(O).length;
    if (c.length && $ + B > a) break;
    $ += B, c.push(g), d.push(...O);
  }
  const m = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: Kt(n.options.containerStyle),
    bounds: Mn(o),
    nodeCount: b.length,
    nodes: c,
    connections: d,
    nextCursor: v < b.length && m ? Sn({ after: m.id, at: v - 1 }) : null
  };
}
const An = [
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
  "basedOnThemeId",
  "syncWithTheme",
  "allowCollaboration",
  "eligibleForThemeCompilation",
  "defaultLineColor",
  "themeId",
  "layoutType",
  "disableAutoLayoutOfManuallyPositionedNodes",
  "nodeOrder",
  "viewPort",
  "containerStyle"
];
function zn(e) {
  const t = Se(e), n = new Set(t.nodes.filter(fe).map(x)), o = {};
  for (const r of An) t.options[r] !== void 0 && (o[r] = t.options[r]);
  const i = t.nodes.filter((r) => !n.has(x(r))).map((r) => ({
    options: r.options,
    relationships: {
      ...r.relationships,
      associations: r.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: o, nodes: i, shareId: `${e?.shareId ?? t.options.shareId ?? ""}` };
}
const Pn = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"], Ln = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function Dn(e) {
  const t = Se(e), n = t.nodes.filter((a) => !fe(a)), o = new Set(t.nodes.filter(fe).map((a) => a.options.id)), i = n.slice(0, 150).map((a) => {
    const p = bt(a, Pn);
    return {
      id: p.id,
      text: `${p.text ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 240),
      shape: p.shape,
      x: p.x,
      y: p.y,
      width: Number(p.width ?? 120),
      height: Number(p.height ?? 80),
      ...p.rotationAngle ? { rotationAngle: p.rotationAngle } : {},
      ...p.locked === !0 ? { locked: !0 } : {},
      ...p.templateCategory ? { templateCategory: p.templateCategory } : {},
      ...p.hiddenControls?.length ? { hiddenControls: p.hiddenControls } : {}
    };
  }), r = te(t).filter(({ association: a }) => !o.has(a.parentId) && !o.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const p = wt(a);
    return {
      id: p.id,
      from: p.from,
      to: p.to,
      ..."toPoint" in p ? { toPoint: p.toPoint } : {},
      // Whether each end follows its note, is pinned to a spot on its edge, or is free.
      ..."fromEnd" in p ? { fromEnd: p.fromEnd, toEnd: p.toEnd } : {},
      label: p.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(Ln.map((b) => [b, p[b] ?? void 0]))
    };
  });
  return {
    name: t.options.name || "",
    description: t.options.description || "",
    nodeCount: n.length,
    nodes: i,
    connections: r
  };
}
function Bn(e = {}) {
  const t = Oe(e), n = (o, i) => Object.fromEntries(Object.entries(o).map(([r, a]) => [r, { ...V(i(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(ve.map((o) => [o, { fields: Xe[o].filter((i) => i !== "kind") }])),
    noteKeys: { ...n(P, (o) => o.spec(t)), ...n(me, (o) => o.spec) },
    noteStyleKeys: [...Be],
    connectorKeys: n(oe, (o) => o.spec),
    connectorStyleKeys: [...qe],
    slateKeys: Object.fromEntries(
      Object.entries(de).map(([o, i]) => [
        o,
        { ...o === "background" ? ht() : V(i.spec), description: i.description }
      ])
    ),
    selector: pt(),
    layouts: [...Fe],
    presets: [...He],
    limits: Ie(e),
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
function Tn(e = {}, t = {}) {
  const n = Oe(e), o = Ie(e), i = (s) => {
    const c = V(P[s].spec(n));
    return t.modelTool ? Nt(c) : c;
  }, r = (s) => Object.fromEntries(s.map((c) => [c, i(c)])), a = (s) => Object.fromEntries(s.map((c) => [c, { ...i(c), description: P[c].description }])), p = (s) => Object.fromEntries(s.map((c) => [c, V(oe[c].spec)])), b = pt(), k = { type: "array", items: { type: "string" } }, f = ve.map((s) => `${s}: ${Xe[s].filter((c) => c !== "kind").join(", ")}`).join("; ");
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
        items: {
          type: "object",
          additionalProperties: !1,
          required: ["kind"],
          description: `Fields by kind. ${f}.`,
          properties: {
            kind: { type: "string", enum: [...ve] },
            count: { type: "integer", minimum: 1, maximum: o.notesPerAdd },
            ...r(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...He],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...k, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: k,
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...V({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...at] },
                arrangement: { type: "string", enum: [...ct] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...r(Be), ...p(qe) }
            },
            target: b,
            from: b,
            to: {
              ...b,
              description: `${b.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...b.properties, point: V({ type: "point" }) }
            },
            layout: {
              type: "string",
              enum: [...Fe],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(de).join(", ")}.`,
              properties: {
                ...a(Object.keys(P)),
                ...Object.fromEntries(Object.entries(me).map(([s, c]) => [s, V(c.spec)])),
                ...p(Object.keys(oe)),
                ...Object.fromEntries(
                  Object.entries(de).map(([s, c]) => [s, s === "background" ? ht() : V(c.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
const Xn = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: Tn({}, { modelTool: !0 })
});
function Fn(e) {
  return `Call applySlateOperations again with a safe, valid plan. ${e.join(" ")}`;
}
function Hn(e) {
  if (typeof e?.message == "string" && e.message.trim()) return e.message.trim();
  const t = (e?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${t} ${t === 1 ? "change" : "changes"} to the slate.`;
}
export {
  Mt as BORDER_STYLES,
  oe as CONNECTOR_KEYS,
  qe as CONNECTOR_STYLE_KEYS,
  Xt as DEFAULT_FONTS,
  An as DOCUMENT_OPTION_KEYS,
  At as EFFECTS,
  Fe as LAYOUTS,
  Bt as LIMITS,
  me as NODE_INTENT_KEYS,
  P as NODE_KEYS,
  Be as NODE_STYLE_KEYS,
  it as NOTE_READ_KEYS,
  Xe as OPERATION_FIELDS,
  F as OperationPlanError,
  He as PRESETS,
  xe as READ_LIMITS,
  de as SLATE_KEYS,
  ve as SLATE_OPERATION_KINDS,
  Xn as SLATE_OPERATION_TOOL,
  hn as alignPositions,
  Rn as applyPlanToJSON,
  Kt as backgroundOf,
  Ie as contractLimits,
  Oe as contractLists,
  Bn as describeOperations,
  pn as distributePositions,
  Hn as naturalOperationFallback,
  Fn as operationPlanRetryPrompt,
  wt as readConnector,
  bt as readNote,
  Yn as readSlate,
  mt as rotatedBounds,
  Tn as slateOperationPlanSchema,
  Dn as summarizeSlate,
  fn as tidyPositions,
  zn as toSlateDocument,
  Se as toStoredSlate,
  gn as treePositions,
  Qt as validatePlan
};
