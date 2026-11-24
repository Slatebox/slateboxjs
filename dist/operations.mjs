import { SHAPE_LIMITS as Lt, prepareShape as Xt, storeCustomShape as Te } from "./shapes.mjs";
import { N as Pe } from "./NoteDefaults-1xFW0br8.mjs";
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
function Ce() {
  return Array.from(B.keys());
}
const rt = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", je = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${rt}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${rt}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${rt}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${rt}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${rt}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${rt}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${rt}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
function Re() {
  return { ...je };
}
function Y(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
const ze = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, Ye = /^https?:\/\/[^\s]+$/i, pe = 2e3, De = /^[A-Za-z0-9_-]{1,64}$/;
function kt(t, e) {
  if (typeof e != "string") return;
  const n = e.trim().toLowerCase();
  return t.find((o) => o.toLowerCase() === n);
}
function R(t, e, n) {
  switch (t.type) {
    case "string":
      return e === null && t.nullable ? null : typeof e != "string" ? `${n} must be a string.` : e.length > t.maxLength ? `${n} must be at most ${t.maxLength} characters.` : t.minLength && e.trim().length < t.minLength ? `${n} must not be empty.` : null;
    case "number":
      return typeof e != "number" || !Number.isFinite(e) || e < t.min || e > t.max ? `${n} must be a number from ${t.min} to ${t.max}.` : null;
    case "boolean":
      return typeof e == "boolean" ? null : `${n} must be true or false.`;
    case "enum":
      return e === null && t.nullable || (t.caseless ? kt(t.values, e) : t.values.find((s) => s === e)) !== void 0 ? null : `${n} must be one of: ${t.values.join(", ")}.`;
    case "shape": {
      if (e && typeof e == "object" && !Array.isArray(e)) {
        const o = Xt(e);
        return o.ok ? null : `${n} is not a usable custom shape: ${o.message}`;
      }
      return kt(t.values, e) !== void 0 ? null : `${n} must be one of: ${t.values.join(", ")} (or a custom shape {name, d, fillRule}).`;
    }
    case "list":
      return Array.isArray(e) && e.every((o) => typeof o == "string" && t.values.includes(o)) && new Set(e).size === e.length ? null : `${n} must be a list of different values from: ${t.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof e == "string" && ze.test(e.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return Y(e) && Object.keys(e).every((o) => o === "x" || o === "y") && [e.x, e.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return Y(e) ? null : `${n} must be an object.`;
    case "url":
      return e === null && t.nullable || typeof e == "string" && e.length <= pe && Ye.test(e.trim()) ? null : `${n} must be an http or https address${t.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return e === null && t.nullable || typeof e == "string" && De.test(e) ? null : `${n} must be 1 to 64 letters, digits, _ or -${t.nullable ? ", or null" : ""}.`;
  }
}
function Q(t) {
  switch (t.type) {
    case "string":
      return { type: t.nullable ? ["string", "null"] : "string", maxLength: t.maxLength, ...t.minLength ? { minLength: t.minLength } : {} };
    case "number":
      return { type: "number", minimum: t.min, maximum: t.max };
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return t.nullable ? { type: ["string", "null"], enum: [...t.values, null] } : { type: "string", enum: [...t.values] };
    case "shape":
      return { oneOf: [{ type: "string", enum: [...t.values] }, Be()] };
    case "list":
      return { type: "array", items: { type: "string", enum: [...t.values] } };
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
        type: t.nullable ? ["string", "null"] : "string",
        maxLength: pe,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: t.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
function Be() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["name", "d"],
    description: "A custom shape: one SVG path (several closed parts and holes allowed, no markup), as shapes.generate or shapes.list return it.",
    properties: {
      name: { type: "string", minLength: 1, maxLength: Lt.maxName },
      d: { type: "string", minLength: 1, maxLength: Lt.maxInput, description: "Path data: commands and plain numbers only." },
      fillRule: { type: "string", enum: ["nonzero", "evenodd"], description: "evenodd when the shape has holes." },
      ref: {
        type: "object",
        additionalProperties: !1,
        required: ["id"],
        description: "The shape library entry it came from.",
        properties: { id: { type: "string", pattern: "^[A-Za-z0-9_-]{1,64}$" }, name: { type: "string", maxLength: Lt.maxName } }
      }
    }
  };
}
function He(t) {
  return Array.isArray(t.oneOf) && t.oneOf[0]?.type === "string" && t.oneOf[0]?.enum ? { ...t.oneOf[0], ...Object.fromEntries(Object.entries(t).filter(([e]) => e !== "oneOf")) } : t;
}
const U = (t) => ({
  store: (e, n) => {
    e[t] = n;
  },
  read: (e) => e[t]
}), Xe = ["solid", "dashed", "dotted", "combo"], We = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), Fe = ["front", "back"], Ue = ["left", "middle", "right"], qe = ["top", "middle", "bottom"], Yt = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), te = Object.keys(Yt), C = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...U("text") },
  shape: {
    spec: (t) => ({ type: "shape", values: t.shapes }),
    description: "A shape registered with the engine (custom shapes read back as custom:<name>).",
    store: (t, e, n) => {
      if (e && typeof e == "object") {
        const s = Xt(e);
        s.ok && Te(t, s.shape);
        return;
      }
      const o = kt(n.shapes, e);
      t.shape = o, t.vectorPath = o, t.shapeHint = o, delete t.fillRule, delete t.textBox, delete t.shapeRef;
    },
    // A custom outline reads as its name, never its (long) path.
    // A named shape (or a shapeHint like "rect") reads as itself, even when
    // the note also stores its drawn path.
    read: (t) => {
      const e = String(t.shape || t.shapeHint || t.vectorPath || "rectangle");
      if (e === "custom" || /^[Mm]/.test(e.trim())) {
        const n = t.shapeRef?.name;
        return typeof n == "string" && n ? `custom:${n}` : "custom";
      }
      return e;
    }
  },
  x: {
    spec: () => ({ type: "number", min: -1e6, max: 1e6 }),
    description: "Left edge on the canvas.",
    store: (t, e) => {
      t.xPos = e, delete t.x;
    },
    read: (t) => Number(t.xPos ?? t.x ?? 0)
  },
  y: {
    spec: () => ({ type: "number", min: -1e6, max: 1e6 }),
    description: "Top edge on the canvas.",
    store: (t, e) => {
      t.yPos = e, delete t.y;
    },
    read: (t) => Number(t.yPos ?? t.y ?? 0)
  },
  width: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Width in canvas units.", ...U("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Height in canvas units.", ...U("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (t, e) => {
      t.rotate = { ...t.rotate || {}, rotationAngle: e }, delete t.rotationAngle;
    },
    read: (t) => Number(t.rotate?.rotationAngle ?? 0)
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ...U("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (t, e) => {
      t.foregroundColor = e, t.fontColor = e;
    },
    read: (t) => t.fontColor ?? t.foregroundColor
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ...U("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ...U("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ...U("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: Xe }),
    description: "Border line style.",
    ...U("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...U("opacity") },
  fontFamily: {
    spec: (t) => ({ type: "enum", values: t.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (t, e, n) => {
      t.fontFamily = kt(n.fonts, e);
    },
    read: (t) => t.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...U("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: Ue }), description: "Horizontal text alignment.", ...U("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: qe }), description: "Vertical text alignment.", ...U("textYAlign") },
  animation: {
    spec: (t) => ({ type: "enum", values: t.animations, nullable: !0 }),
    description: "An entrance or looping animation, or null for none.",
    store: (t, e) => {
      t.animations = { ...t.animations || {}, vect: e ?? null };
    },
    read: (t) => t.animations?.vect ?? null
  },
  textOpacity: {
    spec: () => ({ type: "number", min: 0, max: 1 }),
    description: "Text opacity from 0 to 1.",
    store: (t, e) => {
      t.textOpacity = e;
    },
    // A note with none stored draws its text fully opaque (Node's default).
    read: (t) => t.textOpacity ?? 1
  },
  link: {
    spec: () => ({ type: "url", nullable: !0 }),
    description: "A web address the note opens (http or https), or null to remove it.",
    store: (t, e) => {
      e === null ? delete t.link : t.link = { show: !0, type: "url", data: `${e}`.trim() };
    },
    read: (t) => t.link?.show && t.link.type === "url" ? t.link.data : null
  },
  effect: {
    spec: (t) => ({ type: "enum", values: t.effects, nullable: !0 }),
    description: "A note effect such as dropShadow or postItNote, or null for none.",
    store: (t, e) => {
      t.filters = { ...t.filters || {}, vect: e ?? null };
    },
    read: (t) => t.filters?.vect ?? null
  },
  groupId: {
    spec: () => ({ type: "id", nullable: !0 }),
    description: "Notes sharing a groupId select and move as one group; null takes the note out of its group.",
    store: (t, e) => {
      e === null ? delete t.groupId : t.groupId = e;
    },
    read: (t) => t.groupId ?? null
  },
  templateCategory: {
    spec: () => ({ type: "string", minLength: 1, maxLength: 200, nullable: !0 }),
    description: "Only when asked to make a note a template's category heading: names the bucket the template's AI conversation files notes under, and presentations skip the note. Not for grouping or labelling notes by theme (use groupId or text). null makes it an ordinary note.",
    store: (t, e) => {
      e === null ? (t.isCategory = !1, delete t.categoryName) : (t.isCategory = !0, t.categoryName = `${e}`.trim());
    },
    // Read the way the template conversation reads it: a category has a name.
    read: (t) => t.isCategory === !0 && t.categoryName ? t.categoryName : null
  },
  hiddenControls: {
    spec: () => ({ type: "list", values: te }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (t, e) => {
      for (const [n, o] of Object.entries(Yt)) t[o] = !e.includes(n);
    },
    read: (t) => te.filter((e) => t[Yt[e]] === !1)
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (t, e) => {
      t.isLocked = e;
    },
    read: (t) => t.isLocked === !0
  }
}, yt = {
  order: {
    spec: { type: "enum", values: Fe },
    description: "Bring the note to the front or send it to the back."
  }
}, Ge = [...Object.keys(C), ...Object.keys(yt)], Ke = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Wt = Object.keys(C).filter((t) => !Ke.has(t)), $t = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Ft = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style", "media"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, fe = ["left", "right", "above", "below", "center"], me = ["row", "column", "grid"], Ze = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], Je = ["distribute-horizontal", "distribute-vertical"], Ut = ["row", "column", "grid", "circle", ...Ze, ...Je, "tidy", "tree"], qt = ["text", "sticky"], Ve = 75, Qe = Object.freeze({ x: 20, y: 20 }), tn = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), ee = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, ne = 200, en = Object.freeze([
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
function _t(t = {}) {
  return {
    shapes: [...t.shapes ?? Ce()],
    fonts: [...t.fonts ?? en],
    animations: Object.keys(Re()),
    effects: [...We]
  };
}
function It(t = {}) {
  return { ...tn, ...t.limits || {} };
}
class X extends Error {
  constructor(e, n, o, s) {
    super(o), this.name = "OperationPlanError", this.code = e, this.status = n, s && (this.details = s);
  }
}
const nn = ["bezier", "orthogonal", "straight", "linear", "curved"], on = ["cubic", "quadratic"], sn = ["solid", "dashed", "dotted"], rn = ["follow", "pinned"], oe = ["follow", "pinned", "top", "right", "bottom", "left"], it = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: nn }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: on }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  lineDash: { spec: { type: "enum", values: sn }, description: "Solid, dashed or dotted line." },
  labelPosition: {
    spec: { type: "number", min: 0.05, max: 0.95 },
    description: "Where the label sits along the line, from near its start (0.05) to near its end (0.95); the middle (0.5) when unset."
  },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: rn },
    description: "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge that faces the line's other end, where a following end sits)."
  },
  fromEnd: {
    spec: { type: "enum", values: oe },
    description: "The starting end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side."
  },
  toEnd: {
    spec: { type: "enum", values: oe },
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
}, Gt = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"], Kt = Object.keys(it).filter((t) => !Gt.includes(t)), At = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, mt = "__free_", ge = ["linear", "radial"], ye = ["horizontal", "vertical", "diagonal"], wt = (t) => ({
  store: (e, n) => {
    e.options[t] = n;
  }
}), se = (t) => ({
  store: (e, n) => {
    e.options.viewPort = { ...e.options.viewPort || {}, [t]: n };
  }
}), ht = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...wt("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...wt("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (t, e) => {
      const n = { ...t.options.containerStyle || {}, ...cn(e) };
      delete n.backgroundImage, delete n.backgroundEffect, t.options.containerStyle = n;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: a theme colours notes by their depth in the connected tree.",
    ...wt("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...wt("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...se("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...se("snapToObjects") },
  defaultLineColor: {
    spec: { type: "color" },
    description: "The slate's line colour: every connector and every note's line colour takes it, as the Colours panel does.",
    store: (t, e) => {
      t.options.defaultLineColor = e;
      for (const n of t.nodes) {
        n.options.lineColor = e;
        for (const o of n.relationships.associations) o.lineColor = e;
      }
    }
  }
};
function an(t, e) {
  if (!Y(t)) return [`${e} must be an object {color, gradient?}.`];
  const n = [];
  for (const s of Object.keys(t))
    s !== "color" && s !== "gradient" && n.push(`${e} has an unknown field: ${s}.`);
  const o = R({ type: "color" }, t.color, `${e}.color`);
  if (o && n.push(o), t.gradient !== void 0) {
    const s = t.gradient;
    if (!Y(s)) return [...n, `${e}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(s))
      ["type", "colors", "direction"].includes(a) || n.push(`${e}.gradient has an unknown field: ${a}.`);
    const r = R({ type: "enum", values: ge }, s.type, `${e}.gradient.type`);
    if (r && n.push(r), s.direction !== void 0) {
      const a = R({ type: "enum", values: ye }, s.direction, `${e}.gradient.direction`);
      a && n.push(a);
    }
    !Array.isArray(s.colors) || s.colors.length < 2 || s.colors.length > 8 ? n.push(`${e}.gradient.colors must list 2 to 8 colours.`) : s.colors.forEach((a, h) => {
      const g = R({ type: "color" }, a, `${e}.gradient.colors[${h}]`);
      g && n.push(g);
    });
  }
  return n;
}
function cn(t) {
  return {
    backgroundColor: t.color,
    backgroundColorAsGradient: !!t.gradient,
    backgroundGradientType: t.gradient?.type ?? "linear",
    backgroundGradientColors: t.gradient?.colors ?? [],
    backgroundGradientStrategy: t.gradient?.direction ?? "horizontal"
  };
}
function be() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["color"],
    properties: {
      color: Q({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: !1,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...ge] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: Q({ type: "color" }) },
          direction: { type: "string", enum: [...ye] }
        }
      }
    }
  };
}
function dn(t) {
  if (!t?.backgroundColor) return null;
  const e = t.backgroundGradientColors;
  return !t.backgroundColorAsGradient || !Array.isArray(e) || e.length < 2 ? { color: t.backgroundColor } : {
    color: t.backgroundColor,
    gradient: {
      type: t.backgroundGradientType ?? "linear",
      colors: [...e],
      direction: t.backgroundGradientStrategy ?? "horizontal"
    }
  };
}
const ln = ["ids", "text", "match", "all", "within", "groupId"], hn = ["ids", "text", "within", "groupId"];
function dt(t, e) {
  if (!Y(t)) return [`${e} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const s of Object.keys(t))
    ln.includes(s) || n.push(`${e} has an unknown field: ${s}.`);
  const o = hn.filter((s) => t[s] !== void 0);
  if (o.length > 1 && n.push(`${e} must name notes one way, not by ${o.join(" and ")}.`), !o.length && t.all !== !0 && n.push(`${e} must name notes by ids, text, within, groupId or all: true.`), t.ids !== void 0 && (!Array.isArray(t.ids) || !t.ids.length || t.ids.some((s) => typeof s != "string" || !s)) && n.push(`${e}.ids must be a list of note ids.`), t.text !== void 0 && (typeof t.text != "string" || !t.text.trim()) && n.push(`${e}.text must be the text of a note.`), t.match !== void 0) {
    t.text === void 0 && n.push(`${e}.match goes with text.`);
    const s = R({ type: "enum", values: ["exact", "contains"] }, t.match, `${e}.match`);
    s && n.push(s);
  }
  if (t.all !== void 0 && t.all !== !0 && n.push(`${e}.all must be true when given.`), t.groupId !== void 0 && (typeof t.groupId != "string" || !t.groupId) && n.push(`${e}.groupId must be a group id.`), t.within !== void 0) {
    const s = t.within;
    Y(s) && Object.keys(s).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof s[a] == "number" && Number.isFinite(s[a])) && s.width > 0 && s.height > 0 || n.push(`${e}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function we() {
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
const xe = ["youtube", "vimeo", "loom"], un = Object.freeze({
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom"
}), co = Object.freeze([
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://www.loom.com"
]), pn = Object.freeze({ width: 320, height: 180 }), G = Object.freeze({ urlLength: 2e3, titleLength: 300, authorLength: 120, startSeconds: 86400 }), ve = /^[A-Za-z0-9_-]{11}$/, Dt = /^\d{1,12}$/, Bt = /^[0-9a-f]{6,20}$/i, ke = /^[0-9a-f]{32}$/i, fn = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]), mn = /* @__PURE__ */ new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]), gn = /* @__PURE__ */ new Set(["loom.com", "www.loom.com"]);
function Zt(t) {
  if (!t) return;
  const e = String(t).trim().toLowerCase();
  let n;
  if (/^\d+$/.test(e)) n = Number(e);
  else {
    const o = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(e);
    if (!o || !o[0]) return;
    n = Number(o[1] || 0) * 3600 + Number(o[2] || 0) * 60 + Number(o[3] || 0);
  }
  return Number.isSafeInteger(n) && n > 0 && n <= G.startSeconds ? n : void 0;
}
function Jt(t) {
  return t.hostname.toLowerCase().replace(/\.$/, "");
}
function yn(t) {
  const e = Jt(t), n = t.pathname.split("/").filter(Boolean);
  let o;
  if (e === "youtu.be" ? o = n[0] : n[0] === "watch" ? o = t.searchParams.get("v") ?? void 0 : ["shorts", "embed", "live", "v"].includes(n[0]) && (o = n[1]), !o || !ve.test(o)) return null;
  const s = Zt(t.searchParams.get("t") ?? t.searchParams.get("start"));
  return { provider: "youtube", id: o, url: `https://www.youtube.com/watch?v=${o}`, ...s ? { start: s } : {} };
}
function bn(t) {
  const e = Jt(t), n = t.pathname.split("/").filter(Boolean);
  let o, s;
  if (e === "player.vimeo.com") {
    if (n[0] !== "video") return null;
    o = n[1], s = t.searchParams.get("h") ?? void 0;
  } else {
    const a = n.findIndex((g) => Dt.test(g));
    if (a < 0) return null;
    o = n[a];
    const h = n[a + 1];
    h && Bt.test(h) && (s = h);
  }
  if (!o || !Dt.test(o)) return null;
  s !== void 0 && !Bt.test(s) && (s = void 0);
  const r = Zt((t.hash.match(/t=([0-9hms]+)/i) || [])[1]);
  return {
    provider: "vimeo",
    id: o,
    url: s ? `https://vimeo.com/${o}/${s}` : `https://vimeo.com/${o}`,
    ...s ? { hash: s } : {},
    ...r ? { start: r } : {}
  };
}
function wn(t) {
  const e = t.pathname.split("/").filter(Boolean);
  if (!["share", "embed"].includes(e[0])) return null;
  const n = e[1] ? e[1].split("-").pop() : void 0;
  if (!n || !ke.test(n)) return null;
  const o = n.toLowerCase(), s = Zt(t.searchParams.get("t"));
  return { provider: "loom", id: o, url: `https://www.loom.com/share/${o}`, ...s ? { start: s } : {} };
}
function $e(t) {
  if (typeof t != "string") return null;
  const e = t.trim();
  if (!e || e.length > G.urlLength || /\s/.test(e)) return null;
  let n;
  try {
    n = new URL(/^[a-z][a-z0-9+.-]*:/i.test(e) ? e : `https://${e}`);
  } catch {
    return null;
  }
  if (n.protocol !== "https:" && n.protocol !== "http:" || n.username || n.password || n.port) return null;
  const o = Jt(n);
  return fn.has(o) ? yn(n) : mn.has(o) ? bn(n) : gn.has(o) ? wn(n) : null;
}
const lo = (t) => $e(t) !== null;
function ho(t, { play: e = !1 } = {}) {
  const n = e ? "1" : "0";
  switch (t?.provider) {
    case "youtube": {
      if (!ve.test(t.id)) return null;
      const o = new URLSearchParams({ autoplay: n, rel: "0", playsinline: "1", modestbranding: "1" });
      return t.start && o.set("start", String(t.start)), `https://www.youtube-nocookie.com/embed/${t.id}?${o}`;
    }
    case "vimeo": {
      if (!Dt.test(t.id)) return null;
      const o = new URLSearchParams({ autoplay: n, dnt: "1" });
      return t.hash && Bt.test(t.hash) && o.set("h", t.hash), `https://player.vimeo.com/video/${t.id}?${o}${t.start ? `#t=${t.start}s` : ""}`;
    }
    case "loom": {
      if (!ke.test(t.id)) return null;
      const o = new URLSearchParams({ autoplay: n, hide_owner: "true", hideEmbedTopBar: "true" });
      return t.start && o.set("t", String(t.start)), `https://www.loom.com/embed/${t.id}?${o}`;
    }
    default:
      return null;
  }
}
const xn = /^(?:https:\/\/[^\s"'<>]+|\/sbimages\/media-posters(?:\/|%2F)(?!.*(?:\.\.|%2e%2e))[^\s"'<>\\]*)$/i, ie = (t, e) => typeof t != "string" ? void 0 : t.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, e) || void 0, re = (t) => typeof t == "number" && Number.isFinite(t) && t > 0 && t <= 1e4 ? Math.round(t) : void 0;
function Se(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return { ok: !1, message: "must be an object with the video's url." };
  const e = t, n = ["url", "provider", "id", "hash", "start", "title", "author", "poster", "posterWidth", "posterHeight"], o = Object.keys(e).filter((p) => !n.includes(p));
  if (o.length) return { ok: !1, message: `has fields it does not take: ${o.join(", ")}.` };
  const s = $e(e.url);
  if (!s) return { ok: !1, message: "url must be a YouTube, Vimeo or Loom video address." };
  if (e.provider !== void 0 && e.provider !== s.provider) return { ok: !1, message: "provider does not match the url." };
  if (e.id !== void 0 && e.id !== s.id) return { ok: !1, message: "id does not match the url." };
  if (e.poster !== void 0 && (typeof e.poster != "string" || e.poster.length > G.urlLength || !xn.test(e.poster)))
    return { ok: !1, message: "poster must be an https address or a poster this app stored (/sbimages/media-posters/...)." };
  const r = e.start === void 0 ? s.start : Number.isSafeInteger(e.start) && e.start > 0 && e.start <= G.startSeconds ? e.start : NaN;
  if (Number.isNaN(r)) return { ok: !1, message: `start must be whole seconds from 1 to ${G.startSeconds}.` };
  const a = ie(e.title, G.titleLength), h = ie(e.author, G.authorLength), g = re(e.posterWidth), w = re(e.posterHeight);
  return {
    ok: !0,
    media: {
      ...s,
      ...r ? { start: r } : {},
      ...a ? { title: a } : {},
      ...h ? { author: h } : {},
      ...typeof e.poster == "string" ? { poster: e.poster } : {},
      ...g && w ? { posterWidth: g, posterHeight: w } : {}
    }
  };
}
function vn(t, e) {
  t.media = { ...e }, t.text = "", t.shape = "rectangle", t.vectorPath = "rectangle", t.shapeHint = "rectangle", t.imageFit = "cover", t.backgroundColor = "#111418", t.borderColor = "#111418", t.showTextTab = !1, e.poster ? (t.image = e.poster, t.imageOrigWidth = e.posterWidth || 480, t.imageOrigHeight = e.posterHeight || 360) : delete t.image;
}
function kn(t) {
  const e = t?.media;
  return !e || typeof e != "object" || !xe.includes(e.provider) ? null : {
    provider: e.provider,
    url: e.url,
    ...e.title ? { title: e.title } : {},
    ...e.author ? { author: e.author } : {},
    ...e.start ? { start: e.start } : {},
    ...e.poster ? { poster: e.poster } : {}
  };
}
function uo(t) {
  if (!t || !xe.includes(t.provider)) return "Video";
  const e = un[t.provider];
  return t.title ? `Video: ${t.title} (${e})` : `${e} video`;
}
const $n = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, Oe = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function pt(t, e, n, o, s, { required: r = !0, plural: a = `${o}s` } = {}) {
  const h = [];
  if (t === void 0 && !r) return h;
  if (!Y(t) || r && !Object.keys(t).length)
    return [r ? `${n} requires at least one ${o}.` : `${n} ${a} must be an object.`];
  const g = Object.keys(t).filter((w) => !e.includes(w));
  g.length && h.push(`${n} contains unsupported ${a}: ${g.join(", ")}.`);
  for (const [w, p] of Object.entries(t))
    e.includes(w) && s(w, p, h);
  return h;
}
function ae(t, e) {
  return (n, o, s) => {
    const r = yt[n]?.spec ?? C[n].spec(t), a = R(r, o, `${e} ${n}`);
    a && s.push(a);
  };
}
function ce(t) {
  return (e, n, o) => {
    const s = R(it[e].spec, n, `${t} ${e}`);
    s && o.push(s);
  };
}
function V(t) {
  return Array.isArray(t) && t.length > 0 && t.every((e) => typeof e == "string" && e.length > 0);
}
function Sn(t, e = {}) {
  const n = _t(e), o = It(e), s = e.userMessage || "";
  if (!Y(t)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const r = [];
  for (const i of Object.keys(t))
    i !== "message" && i !== "operations" && r.push(`The plan has an unknown field: ${i}.`);
  (typeof t.message != "string" || !t.message.trim()) && r.push("A natural completion message is required."), !Array.isArray(t.operations) || t.operations.length === 0 ? r.push("At least one slate operation is required.") : t.operations.length > o.operationsPerPlan && r.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const a = !!e.existingNodeIds?.length, h = new Set((e.existingNodeIds || []).filter(Boolean)), g = !!e.existingConnectionIds?.length, w = new Set((e.existingConnectionIds || []).filter(Boolean)), p = (i, c) => {
    a && Y(i) && Array.isArray(i.ids) && i.ids.some((d) => !h.has(d)) && r.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(t.operations) ? t.operations : []).forEach((i, c) => {
    const d = `Operation ${c + 1}`;
    if (!Y(i) || !$t.includes(i.kind)) {
      r.push(`${d} has an unsupported kind.`);
      return;
    }
    const k = Ft[i.kind], v = Object.keys(i).filter((m) => !k.includes(m));
    for (const m of v) r.push(`${d} has an unknown field: ${m}.`);
    switch (i.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(i.count) || i.count < 1 || i.count > o.notesPerAdd) && r.push(`${d} count must be an integer from 1 to ${o.notesPerAdd}.`), i.preset !== void 0) {
          const S = R({ type: "enum", values: qt }, i.preset, `${d} preset`);
          S && r.push(S);
        }
        const m = Y(i.placement) && i.placement.connect === !0, $ = i.media !== void 0;
        if ($) {
          const S = Se(i.media);
          S.ok || r.push(`${d} media ${S.message}`), i.count !== 1 && r.push(`${d} adds one media note at a time (count 1).`);
          for (const E of ["shape", "preset", "text"])
            i[E] !== void 0 && r.push(`${d} is a media note, so it takes no ${E}.`);
          m && r.push(`${d} is a media note, so it cannot copy and connect from another note.`);
        }
        if (!$ && (i.shape !== void 0 || i.preset === void 0 && !m)) {
          const S = R(C.shape.spec(n), i.shape, `${d} shape`);
          S && r.push(S);
        }
        for (const S of ["text", "width", "height"]) {
          if (i[S] === void 0) continue;
          const E = R(C[S].spec(n), i[S], `${d} ${S}`);
          E && r.push(E);
        }
        i.x === void 0 != (i.y === void 0) && r.push(`${d} needs both x and y, or neither.`);
        for (const S of ["x", "y"]) {
          if (i[S] === void 0) continue;
          const E = R(C[S].spec(n), i[S], `${d} ${S}`);
          E && r.push(E);
        }
        i.ids !== void 0 && (!V(i.ids) || new Set(i.ids).size !== i.ids.length ? r.push(`${d} ids must be a list of different note ids.`) : i.ids.some((S) => !ee.test(S)) ? r.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(i.count) && i.ids.length > i.count && r.push(`${d} has more ids than notes to add.`));
        const y = i.placement;
        if (y !== void 0)
          if (!Y(y))
            r.push(`${d} placement must be an object.`);
          else {
            const S = i.x !== void 0 ? ["arrangement", "gap", ...y.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const E of Object.keys(y))
              S.includes(E) || r.push(
                i.x !== void 0 && ["relativeTo", "direction", "connect"].includes(E) ? `${d} gives x and y, so placement cannot also give ${E}.` : `${d} placement has an unknown field: ${E}.`
              );
            y.connect !== void 0 && (typeof y.connect != "boolean" ? r.push(`${d} placement.connect must be true or false.`) : y.connect && (y.relativeTo === void 0 && r.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), y.direction === "center" && r.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), y.relativeTo !== void 0 && typeof y.relativeTo != "string" ? r.push(`${d} placement.relativeTo must be a note id.`) : y.relativeTo && a && !h.has(y.relativeTo) && r.push(`${d} references a note that is not in the slate.`);
            for (const [E, l] of [["direction", fe], ["arrangement", me]]) {
              if (y[E] === void 0) continue;
              const u = R({ type: "enum", values: l }, y[E], `${d} placement.${E}`);
              u && r.push(u);
            }
            if (y.gap !== void 0) {
              const E = R({ type: "number", min: 0, max: 2e3 }, y.gap, `${d} placement.gap`);
              E && r.push(E);
            }
          }
        r.push(...pt(i.style, Wt, d, "node style", ae(n, d), { required: !1 })), V(i.ids) && i.ids.forEach((S) => h.add(S));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = dt(i.target, `${d} target`);
        if (r.push(...m), m.length || p(i.target, d), i.kind === "update_nodes" && r.push(...pt(i.changes, Ge, d, "node change", ae(n, d), { plural: "changes" })), i.kind === "delete_nodes" && Y(i.target) && i.target.all === !0 && Object.keys(i.target).length === 1 && !Oe.test(s) && r.push(`${d} cannot delete every note without an explicit request.`), i.kind === "arrange_nodes") {
          const $ = R({ type: "enum", values: Ut }, i.layout, `${d} layout`);
          if ($ && r.push($), i.gap !== void 0) {
            const y = R({ type: "number", min: 0, max: 2e3 }, i.gap, `${d} gap`);
            y && r.push(y);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = dt(i.target, `${d} target`);
        if (r.push(...m), m.length || p(i.target, d), i.offset !== void 0) {
          const $ = R({ type: "point" }, i.offset, `${d} offset`);
          $ && r.push($);
        }
        i.ids !== void 0 && (!V(i.ids) || new Set(i.ids).size !== i.ids.length ? r.push(`${d} ids must be a list of different note ids.`) : i.ids.some(($) => !ee.test($)) ? r.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Y(i.target) && V(i.target.ids) && i.ids.length > i.target.ids.length && r.push(`${d} has more ids than notes to copy.`)), V(i.ids) && i.ids.forEach(($) => h.add($));
        return;
      }
      case "connect_nodes": {
        const m = dt(i.from, `${d} from`);
        if (r.push(...m), m.length || p(i.from, d), Y(i.to) && i.to.point !== void 0) {
          Object.keys(i.to).length !== 1 && r.push(`${d} to must be a note selector or {point}, not both.`);
          const S = R({ type: "point" }, i.to.point, `${d} to.point`);
          S && r.push(S);
        } else {
          const S = dt(i.to, `${d} to`);
          r.push(...S), S.length || p(i.to, d);
        }
        i.ids !== void 0 && (!V(i.ids) || new Set(i.ids).size !== i.ids.length ? r.push(`${d} ids must be a list of different connector ids.`) : i.ids.some((S) => S.length > ne) && r.push(`${d} connector ids can be at most ${ne} characters.`)), r.push(...pt(i.style, Kt, d, "connection style", ce(d), { required: !1 })), V(i.ids) && i.ids.forEach((S) => w.add(S));
        const $ = i.from?.ids, y = i.to?.ids;
        V($) && V(y) && $.forEach((S) => y.forEach((E) => w.add(`${S}->${E}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = i.connectionIds !== void 0, $ = i.from !== void 0 || i.to !== void 0;
        if (m && $ && r.push(`${d} names connectors by connectionIds or by from and to, not both.`), !m && !$ && r.push(`${d} requires connectionIds or both from and to note selectors.`), m && (V(i.connectionIds) ? g && i.connectionIds.some((y) => !w.has(y)) && r.push(`${d} references connectors that are not in the slate.`) : r.push(`${d} connectionIds must be a list of connector ids.`)), $)
          for (const y of ["from", "to"]) {
            const S = dt(i[y], `${d} ${y}`);
            r.push(...S), S.length || p(i[y], d);
          }
        if (i.kind === "update_connections") {
          r.push(...pt(i.changes, Object.keys(it), d, "connection change", ce(d)));
          const y = Y(i.changes) ? i.changes : {};
          y.toNote !== void 0 && y.toPoint !== void 0 && r.push(`${d} moves the far end with toNote or toPoint, not both.`), y.fromNote !== void 0 && y.fromPoint !== void 0 && r.push(`${d} moves the starting end with fromNote or fromPoint, not both.`), y.ends !== void 0 && (y.fromEnd !== void 0 || y.toEnd !== void 0) && r.push(`${d} sets ends, or fromEnd and toEnd, not both.`), y.toPoint !== void 0 && y.toEnd !== void 0 && r.push(`${d} cannot pin a far end it leaves free (toPoint with toEnd).`), y.fromPoint !== void 0 && (y.toPoint !== void 0 || y.fromEnd !== void 0) && r.push(`${d} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        r.push(
          ...pt(i.changes, Object.keys(ht), d, "slate change", (m, $, y) => {
            if (m === "background") {
              y.push(...an($, `${d} background`));
              return;
            }
            const S = R(ht[m].spec, $, `${d} ${m}`);
            S && y.push(S);
          })
        ), Y(i.changes) && i.changes.background !== void 0 && !$n.test(s) && r.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: r.length === 0, errors: r };
}
const x = (t) => t.options.id, q = (t, e) => C[e].read(t.options), K = (t) => ({
  x: q(t, "x"),
  y: q(t, "y"),
  width: Number(t.options.width ?? 120),
  height: Number(t.options.height ?? 80)
}), st = (t) => !!t.targetPoint || `${t.childId || ""}`.startsWith(mt), ft = (t, e) => `${t}->${e}`;
function St(t) {
  return JSON.parse(JSON.stringify(t ?? null));
}
function Et(t) {
  const e = t?.nodes && !Array.isArray(t.nodes), n = e ? t.v2 ?? t : null, o = e ? {
    options: St(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((s) => On(s?.v2 ?? s))
  } : St(t || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((s) => {
    const r = s?.options ? s : { options: { ...s || {} }, relationships: s?.relationships };
    return r.options.relationships && delete r.options.relationships, r.relationships = { ...r.relationships || {}, associations: [...r.relationships?.associations || []] }, r.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = r.options.id), a.id || (a.id = ft(a.parentId, a.childId));
    }), r;
  }), o;
}
function On(t) {
  const e = St(t.options || {});
  e.x !== void 0 && (e.xPos = e.x, delete e.x), e.y !== void 0 && (e.yPos = e.y, delete e.y), e.fontColor !== void 0 && e.foregroundColor === void 0 && (e.foregroundColor = e.fontColor);
  const n = typeof t.getRotation == "function" ? t.getRotation() : void 0;
  typeof n == "number" && (e.rotate = { ...e.rotate || {}, rotationAngle: n });
  const o = t.relationships, s = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: e,
    relationships: {
      associations: s.map(({ parent: r, child: a, ...h }) => St(h))
    }
  };
}
function nt(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const o of t.nodes)
    for (const s of o.relationships.associations)
      e.has(s.id) || (e.add(s.id), n.push({ node: o, association: s }));
  return n;
}
const Tt = (t) => `${t ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function et(t, e, n) {
  const o = t.nodes;
  if (e.ids)
    return e.ids.map((s) => o.find((r) => x(r) === s)).filter(Boolean);
  if (e.text !== void 0) {
    const s = Tt(e.text), r = o.filter(
      (a) => e.match === "contains" ? Tt(a.options.text).includes(s) : Tt(a.options.text) === s
    );
    if (r.length > 1 && e.all !== !0)
      throw new X(
        "ambiguous_selector",
        400,
        `${n} "${e.text}" matches ${r.length} notes (${r.map(x).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: r.map((a) => ({ id: x(a), text: a.options.text ?? "" })) }
      );
    return r;
  }
  if (e.within) {
    const s = e.within;
    return o.filter((r) => {
      const a = K(r);
      return a.x >= s.x && a.y >= s.y && a.x + a.width <= s.x + s.width && a.y + a.height <= s.y + s.height;
    });
  }
  return e.groupId !== void 0 ? o.filter((s) => s.options.groupId === e.groupId) : e.all === !0 ? [...o] : [];
}
const lt = (t) => Math.round(t * 1e4) / 1e4, de = (t) => Math.max(0, Math.min(1, t));
function _n(t) {
  const e = de(t.x), n = de(t.y), o = [e, 1 - e, n, 1 - n], s = Math.min(...o);
  return s === o[0] ? { x: 0, y: lt(n) } : s === o[1] ? { x: 1, y: lt(n) } : s === o[2] ? { x: lt(e), y: 0 } : { x: lt(e), y: 1 };
}
function In(t) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[t];
}
function _e(t, e, n) {
  if (!n) return { ...t };
  const o = n * Math.PI / 180, s = t.x - e.x, r = t.y - e.y;
  return { x: e.x + s * Math.cos(o) - r * Math.sin(o), y: e.y + s * Math.sin(o) + r * Math.cos(o) };
}
function En(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = _e(e, n, -(t.rotation || 0));
  return { x: (o.x - t.x) / (t.width || 1), y: (o.y - t.y) / (t.height || 1) };
}
function Mn(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = _e({ x: t.x + e.x * t.width, y: t.y + e.y * t.height }, n, t.rotation || 0);
  return { x: lt(o.x), y: lt(o.y) };
}
function Nn(t, e) {
  const n = En(t, e), o = (n.x - 0.5) * (t.width || 1), s = (n.y - 0.5) * (t.height || 1);
  if (Math.abs(o) < 1e-9 && Math.abs(s) < 1e-9) return { x: 0.5, y: 0 };
  const r = o !== 0 ? t.width / 2 / Math.abs(o) : 1 / 0, a = s !== 0 ? t.height / 2 / Math.abs(s) : 1 / 0, h = Math.min(r, a);
  return _n({ x: 0.5 + o * h / (t.width || 1), y: 0.5 + s * h / (t.height || 1) });
}
function Ln(t) {
  const e = { ...t };
  return e.showParentArrow = t.showChildArrow !== !1, e.showChildArrow = !!t.showParentArrow, e.sourceAnchor = t.targetAnchor ?? null, e.targetAnchor = null, e;
}
const Pt = (t) => ({ ...K(t), rotation: Number(q(t, "rotationAngle")) || 0 }), An = (t) => ({ x: t.x + t.width / 2, y: t.y + t.height / 2 });
function Tn(t, e, n, o, s, r) {
  const a = (d) => t.nodes.find((k) => x(k) === d), h = (d) => {
    throw new X("invalid_operation_plan", 400, `${s} ${d}`);
  }, g = (d) => {
    throw new X("no_match", 409, `${s} names no note ${JSON.stringify(d)} on the slate.`);
  }, w = (d, k) => {
    d !== k && (d.relationships.associations = d.relationships.associations.filter((v) => v !== n), k.relationships.associations.push(n));
  };
  let p = e;
  if (o.toNote !== void 0) {
    const d = a(o.toNote) ?? g(o.toNote);
    n.childId = x(d), delete n.targetPoint, n.targetAnchor = null;
  } else o.toPoint !== void 0 && (st(n) || (n.childId = `${mt}${r()}`), n.targetPoint = { x: o.toPoint.x, y: o.toPoint.y }, n.targetAnchor = null);
  if (o.fromNote !== void 0) {
    const d = a(o.fromNote) ?? g(o.fromNote);
    n.parentId = x(d), n.sourceAnchor = null, w(p, d), p = d;
  } else if (o.fromPoint !== void 0) {
    st(n) && h(`keeps one end on a note: the far end of ${n.id} is already free.`);
    const d = a(n.childId) ?? g(n.childId), k = Ln(n);
    for (const v of Object.keys(n)) delete n[v];
    Object.assign(n, k, {
      parentId: x(d),
      childId: `${mt}${r()}`,
      targetPoint: { x: o.fromPoint.x, y: o.fromPoint.y }
    }), w(p, d), p = d;
  }
  n.parentId === n.childId && h(`cannot connect ${n.id} from a note to itself.`);
  const i = (d) => {
    if (d === "target" && st(n)) return n.targetPoint;
    const k = a(d === "source" ? n.parentId : n.childId);
    if (!k) return null;
    const v = d === "source" ? n.sourceAnchor : n.targetAnchor;
    return v ? Mn(Pt(k), v) : An(Pt(k));
  }, c = (d, k, v) => {
    if (d === "target" && st(n)) {
      v && h(`cannot pin or follow the far end of ${n.id}: it is free, on no note.`);
      return;
    }
    const m = d === "source" ? "sourceAnchor" : "targetAnchor";
    if (k === "follow") n[m] = null;
    else if (k !== "pinned") n[m] = In(k);
    else if (!n[m]) {
      const $ = a(d === "source" ? n.parentId : n.childId), y = i(d === "source" ? "target" : "source");
      $ && y && (n[m] = Nn(Pt($), y));
    }
  };
  return o.ends !== void 0 && (c("source", o.ends, !1), c("target", o.ends, !1)), o.fromEnd !== void 0 && c("source", o.fromEnd, !0), o.toEnd !== void 0 && c("target", o.toEnd, !0), p;
}
function Pn(t) {
  return {
    fromEnd: t.sourceAnchor ? "pinned" : "follow",
    toEnd: st(t) ? "free" : t.targetAnchor ? "pinned" : "follow"
  };
}
function Ie(t) {
  const { x: e, y: n, width: o, height: s } = t, r = t.rotationAngle || 0;
  if (!r) return { minX: e, minY: n, maxX: e + o, maxY: n + s };
  const a = e + o / 2, h = n + s / 2, g = r * Math.PI / 180, w = Math.cos(g), p = Math.sin(g);
  let i = 1 / 0, c = 1 / 0, d = -1 / 0, k = -1 / 0;
  for (const [m, $] of [[e, n], [e + o, n], [e + o, n + s], [e, n + s]]) {
    const y = m - a, S = $ - h, E = a + y * w - S * p, l = h + y * p + S * w;
    i = Math.min(i, E), c = Math.min(c, l), d = Math.max(d, E), k = Math.max(k, l);
  }
  const v = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: v(i), minY: v(c), maxX: v(d), maxY: v(k) };
}
function Cn(t, e) {
  if (e.length < 2) return [];
  const n = e.map(Ie), o = Math.min(...n.map((w) => w.minX)), s = Math.max(...n.map((w) => w.maxX)), r = Math.min(...n.map((w) => w.minY)), a = Math.max(...n.map((w) => w.maxY)), h = (o + s) / 2, g = (r + a) / 2;
  return e.map((w, p) => {
    const i = n[p];
    let { x: c, y: d } = w;
    return t === "left" ? c += o - i.minX : t === "right" ? c += s - i.maxX : t === "centerH" ? c += h - (i.minX + i.maxX) / 2 : t === "top" ? d += r - i.minY : t === "bottom" ? d += a - i.maxY : t === "middle" && (d += g - (i.minY + i.maxY) / 2), { id: w.id, x: c, y: d };
  });
}
function jn(t, e) {
  if (e.length < 3) return [];
  const n = e.map((c, d) => ({ box: c, index: d, b: Ie(c) })), o = t === "horizontal", s = (c) => o ? c.b.minX : c.b.minY, r = (c) => o ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, a = [...n].sort((c, d) => s(c) - s(d) || c.index - d.index), h = s(a[0]), w = (a.reduce((c, d) => Math.max(c, s(d) + r(d)), -1 / 0) - h - a.reduce((c, d) => c + r(d), 0)) / (a.length - 1), p = /* @__PURE__ */ new Map();
  let i = h;
  for (const c of a) {
    const d = i - s(c);
    p.set(c.index, {
      id: c.box.id,
      x: o ? c.box.x + d : c.box.x,
      y: o ? c.box.y : c.box.y + d
    }), i += r(c) + w;
  }
  return n.map((c) => p.get(c.index));
}
function Ot(t, e, n) {
  const o = Math.min(t.x + t.width + n - e.x, e.x + e.width + n - t.x), s = Math.min(t.y + t.height + n - e.y, e.y + e.height + n - t.y);
  return o > 0 && s > 0 ? { x: o, y: s } : null;
}
const Rn = 4e6;
function zn(t, e, { gap: n = 20 } = {}) {
  const o = t.map((p) => ({ ...p })), s = e.map((p) => ({ ...p })), r = (p, i, c, d, k) => {
    const v = p.x + p.width / 2 - (i.x + i.width / 2), m = p.y + p.height / 2 - (i.y + i.height / 2);
    c.y <= c.x ? p.y += (m > 0 || m === 0 && k > 0 ? 1 : -1) * c.y * d : p.x += (v > 0 || v === 0 && k > 0 ? 1 : -1) * c.x * d;
  }, a = Math.max(1, o.length * (s.length + o.length / 2)), h = Math.max(1, Math.min(1e3, Math.floor(Rn / a)));
  let g = !1;
  for (let p = 0; p < h; p += 1) {
    let i = !1;
    for (let c = 0; c < o.length; c += 1) {
      for (const d of s) {
        const k = Ot(o[c], d, n);
        k && (r(o[c], d, k, 1, 1), i = !0);
      }
      for (let d = c + 1; d < o.length; d += 1) {
        const k = Ot(o[c], o[d], n);
        k && (r(o[c], o[d], k, 0.5, -1), r(o[d], o[c], k, 0.5, 1), i = !0);
      }
    }
    if (!i) {
      g = !0;
      break;
    }
  }
  const w = (p) => Math.round(p * 100) / 100;
  for (const p of o)
    p.x = w(p.x), p.y = w(p.y);
  return g || Yn(o, s, n), o.map(({ id: p, x: i, y: c }) => ({ id: p, x: i, y: c }));
}
function Yn(t, e, n) {
  const o = [...e], s = [];
  for (const d of t)
    o.some((k) => Ot(d, k, n)) ? s.push(d) : o.push(d);
  if (!s.length) return;
  const r = Math.min(...t.map((d) => d.x)), a = o.length ? Math.max(...o.map((d) => d.y + d.height)) + n : Math.min(...t.map((d) => d.y)), h = o.length ? Math.max(...o.map((d) => d.x + d.width)) : r, g = s.reduce((d, k) => d + (k.width + n) * (k.height + n), 0), w = Math.max(h - r, Math.sqrt(g) * 1.5, ...s.map((d) => d.width));
  let p = r, i = a, c = 0;
  for (const d of s)
    p > r && p + d.width > r + w && (p = r, i += c + n, c = 0), d.x = p, d.y = i, p += d.width + n, c = Math.max(c, d.height);
}
function Dn(t, e, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!t.length) return [];
  const s = new Map(t.map((l) => [l.id, l])), r = new Map(t.map((l) => [l.id, []])), a = new Map(t.map((l) => [l.id, 0]));
  for (const [l, u] of e)
    !s.has(l) || !s.has(u) || l === u || (r.get(l).push(u), a.set(u, a.get(u) + 1));
  const h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), w = [], p = (l) => {
    w.push(l), g.set(l, 0), h.set(l, []);
    const u = [l];
    for (; u.length; ) {
      const f = u.shift();
      for (const b of r.get(f))
        g.has(b) || (g.set(b, g.get(f) + 1), h.set(b, []), h.get(f).push(b), u.push(b));
    }
  };
  for (const l of t) a.get(l.id) === 0 && !g.has(l.id) && p(l.id);
  for (const l of t) g.has(l.id) || p(l.id);
  const i = [];
  for (const l of t) {
    const u = g.get(l.id);
    i[u] = Math.max(i[u] ?? 0, l.height);
  }
  const c = Math.min(...t.map((l) => l.x)), d = Math.min(...t.map((l) => l.y)), k = [];
  i.forEach((l, u) => {
    k[u] = u === 0 ? d : k[u - 1] + i[u - 1] + n;
  });
  const v = /* @__PURE__ */ new Map(), m = (l) => {
    const u = h.get(l), f = u.reduce((I, T) => I + m(T), 0) + n * Math.max(0, u.length - 1), b = Math.max(s.get(l).width, f);
    return v.set(l, b), b;
  }, $ = /* @__PURE__ */ new Map(), y = (l, u) => {
    const f = s.get(l), b = h.get(l), I = v.get(l), T = k[g.get(l)];
    if (!b.length) {
      $.set(l, { id: l, x: u + (I - f.width) / 2, y: T });
      return;
    }
    const L = b.reduce((_, P) => _ + v.get(P), 0) + n * (b.length - 1);
    let A = u + (I - L) / 2;
    for (const _ of b)
      y(_, A), A += v.get(_) + n;
    const z = $.get(b[0]), N = $.get(b[b.length - 1]), M = (z.x + s.get(b[0]).width / 2 + N.x + s.get(b[b.length - 1]).width / 2) / 2, O = Math.min(Math.max(M - f.width / 2, u), u + I - f.width);
    $.set(l, { id: l, x: O, y: T });
  };
  let S = c;
  for (const l of w) {
    const u = m(l);
    y(l, S), S += u + n;
  }
  const E = t.map((l) => $.get(l.id));
  return Bn(t, E, o, n);
}
function Bn(t, e, n, o) {
  if (!n.length) return e;
  let s = 0;
  for (let r = 0; r <= n.length; r += 1) {
    let a = 0;
    if (e.forEach((h, g) => {
      const w = { ...t[g], x: h.x, y: h.y + s };
      for (const p of n)
        Ot(w, p, o) && (a = Math.max(a, p.y + p.height + o - w.y));
    }), !a) break;
    s += a;
  }
  return s ? e.map((r) => ({ ...r, y: r.y + s })) : e;
}
function Hn() {
  const t = "abcdefghijklmnopqrstuvwxyz0123456789";
  let e = "";
  for (let n = 0; n < 12; n += 1) e += t[Math.floor(Math.random() * t.length)];
  return e;
}
function Xn(t) {
  const e = (r) => {
    const a = (parseInt(r, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (r) => 0.2126 * e(r.substr(1, 2)) + 0.7152 * e(r.substr(3, 2)) + 0.0722 * e(r.substr(-2)), o = (r, a) => {
    const [h, g] = [n(r), n(a)];
    return (Math.max(h, g) + 0.05) / (Math.min(h, g) + 0.05);
  }, s = /^#[0-9a-f]{6}$/i.test(t) ? t : "#7aa2c8";
  return o(s, "#ffffff") > o(s, "#000000") ? "#ffffff" : "#000000";
}
function Wn(t, e, n) {
  return t.x < e.x + e.width + n && t.x + t.width + n > e.x && t.y < e.y + e.height + n && t.y + t.height + n > e.y;
}
function Fn(t, e, n, o, s, r) {
  let a = t;
  for (let h = 0; h <= e.length; h += 1) {
    const g = e.filter((i) => a.some((c) => Wn({ ...c, width: n, height: o }, i, r)));
    if (!g.length) return a;
    let w = 0, p = 0;
    s === "left" ? w = Math.min(...g.map((i) => i.x - r)) - Math.max(...a.map((i) => i.x + n)) : s === "above" ? p = Math.min(...g.map((i) => i.y - r)) - Math.max(...a.map((i) => i.y + o)) : s === "below" || s === "center" ? p = Math.max(...g.map((i) => i.y + i.height + r)) - Math.min(...a.map((i) => i.y)) : w = Math.max(...g.map((i) => i.x + i.width + r)) - Math.min(...a.map((i) => i.x)), a = a.map((i) => ({ x: i.x + w, y: i.y + p }));
  }
  return a;
}
function Ee(t, e) {
  if (e) {
    const n = t.nodes.find((s) => x(s) === e);
    if (n) return n;
    const o = t.nodes.filter((s) => `${s.options.text ?? ""}`.trim().toLowerCase() === e.trim().toLowerCase());
    if (o.length === 1) return o[0];
  }
  return [...t.nodes].sort((n, o) => K(o).x + K(o).width - (K(n).x + K(n).width))[0];
}
function Ht(t, e) {
  const n = e === "grid" ? Math.ceil(Math.sqrt(t)) : t;
  return Array.from({ length: t }, (o, s) => ({
    row: e === "column" ? s : e === "grid" ? Math.floor(s / n) : 0,
    column: e === "column" ? 0 : e === "grid" ? s % n : s
  }));
}
function Un(t, e, n, o) {
  const s = e.count, r = e.placement || {}, a = r.gap ?? (r.connect ? Ve : 48);
  if (e.x !== void 0 && e.y !== void 0) {
    const c = r.arrangement || "row";
    return { points: Ht(s, c).map(({ row: k, column: v }) => ({
      x: e.x + v * (n + a),
      y: e.y + k * (o + a)
    })), arrangement: c, gap: a };
  }
  const h = Ee(t, r.relativeTo), g = h ? K(h) : { x: 0, y: 0, width: 160, height: 100 }, w = r.direction || "right", p = r.arrangement || (["left", "right"].includes(w) ? "column" : "row"), i = Ht(s, p).map(({ row: c, column: d }) => {
    let k = g.x + d * (n + a), v = g.y + c * (o + a);
    return w === "right" && (k += g.width + a), w === "left" && (k -= n + a), w === "below" && (v += g.height + a), w === "above" && (v -= o + a), { x: k, y: v };
  });
  return { points: Fn(i, t.nodes.map(K), n, o, w, a), arrangement: p, gap: a };
}
function qn(t, e) {
  if (!t) return { childId: `${mt}${e()}` };
  const n = t.match(/->(__free_.+)$/);
  return { id: t, childId: n ? n[1] : `${mt}${t.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Ct(t, e) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}~${n}`); ) n += 1;
  return `${e}~${n}`;
}
const jt = (t, e) => JSON.stringify([t, e]);
function Rt(t, e, n) {
  return new X(
    "id_taken",
    409,
    `${t} names ${e} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${e}s in a later operation.`,
    { ids: n }
  );
}
const le = (t, e) => JSON.stringify(t) === JSON.stringify(e), Gn = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], zt = (t) => JSON.parse(JSON.stringify(t)), xt = 1e6, he = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, ct = (t) => ({ id: x(t), ...K(t), rotationAngle: q(t, "rotationAngle") });
function po(t, e, n = {}) {
  const o = _t(n), s = It(n), r = n.idFactory || Hn, a = Et(t), h = Sn(e, {
    ...n,
    existingNodeIds: a.nodes.map(x),
    existingConnectionIds: nt(a).map(({ association: c }) => c.id)
  });
  if (!h.valid)
    throw new X("invalid_operation_plan", 400, h.errors.join(" "), { errors: h.errors });
  const g = JSON.stringify(a), w = a.nodes.length, p = [], i = {
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
  if (e.operations.forEach((c, d) => {
    const k = d + 1, v = `Operation ${k}`, m = { operation: k, kind: c.kind, matched: [], changed: [] };
    i.operations.push(m);
    const $ = () => i.warnings.push(`${v} matched no notes.`), y = (l) => {
      i.skipped.push({ operation: k, id: x(l), reason: "locked" });
    }, S = (l) => {
      const u = a.nodes.length + l;
      if (l > 0 && u > s.notesPerSlate && u > w)
        throw new X(
          "note_limit",
          422,
          `${v} would leave ${u} notes; a slate can hold at most ${s.notesPerSlate} notes.`,
          { limit: s.notesPerSlate, operation: k }
        );
    }, E = (l, u) => {
      if (u > 0 && l > s.connectorsPerSlate)
        throw new X(
          "connector_limit",
          422,
          `${v} would leave ${l} connectors; a slate can hold at most ${s.connectorsPerSlate} connectors.`,
          { limit: s.connectorsPerSlate, operation: k }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const l = c.preset ? Pe[c.preset] : void 0, u = c.placement?.connect === !0, f = u ? a.nodes.find((F) => x(F) === c.placement.relativeTo) : void 0;
        if (u && !f)
          throw new X("no_match", 409, `${v} placement.relativeTo names no note on the slate to connect from.`, { operation: k });
        if (f && f.options.isLocked === !0) {
          y(f);
          return;
        }
        const b = c.shape ?? l?.shape, I = f ? K(f) : void 0, T = typeof b == "string" && b.toLowerCase() === "triangle", L = b && typeof b == "object" ? Me(b) : 0, A = c.media !== void 0 ? Se(c.media) : null;
        if (A && !A.ok) throw new X("invalid_operation_plan", 400, `${v} media ${A.message}`, { operation: k });
        const z = A ? pn : void 0, N = c.width ?? z?.width ?? l?.width ?? I?.width ?? (T ? 150 : L ? Math.round(L >= 1 ? 180 : 180 * L) : 180), M = c.height ?? z?.height ?? l?.height ?? I?.height ?? (T ? 130 : L ? Math.round(L >= 1 ? 180 / L : 180) : 110), O = f ?? Ee(a, c.placement?.relativeTo), _ = c.style?.backgroundColor || l?.style?.backgroundColor || O?.options.backgroundColor || "#7aa2c8", { points: P, arrangement: j, gap: Z } = Un(a, c, N, M), W = new Set(nt(a).map(({ association: F }) => F.id)), H = new Set(a.nodes.map(x)), at = (c.ids || []).filter((F) => H.has(F));
        if (at.length && !n.replay) throw Rt(v, "note", at);
        const D = P.map((F, Mt) => c.ids?.[Mt] || r());
        S(D.filter((F) => !H.has(F)).length), f && E(W.size + D.filter((F) => !H.has(F)).length, D.length), P.forEach(({ x: F, y: Mt }, Vt) => {
          const J = D[Vt];
          if (m.matched.push(J), H.has(J)) return;
          const Qt = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${Vt + 1}`) : c.text : "", bt = f ? zt(f.options) : void 0;
          if (bt) for (const tt of Gn) delete bt[tt];
          const ot = bt ? { ...bt, id: J, name: J, text: Qt, width: N, height: M } : {
            id: J,
            name: J,
            text: Qt,
            defaultShaped: !0,
            width: N,
            height: M,
            backgroundColor: _,
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
          b && C.shape.store(ot, b, o), C.x.store(ot, F, o), C.y.store(ot, Mt, o), f || C.foregroundColor.store(ot, Xn(_), o);
          for (const [tt, Nt] of Object.entries(l?.style || {})) C[tt].store(ot, Nt, o);
          for (const [tt, Nt] of Object.entries(c.style || {})) C[tt].store(ot, Nt, o);
          if (A?.ok && vn(ot, A.media), a.nodes.push({ options: ot, relationships: { associations: [] } }), m.changed.push(J), i.created.push(J), f) {
            const tt = Ct(W, ft(x(f), J));
            W.add(tt), f.relationships.associations.push({ id: tt, parentId: x(f), childId: J, ...At }), i.connected.push(tt);
          }
        });
        const { placement: io, ...Ae } = c;
        p.push({
          ...Ae,
          ids: D,
          x: P[0].x,
          y: P[0].y,
          placement: { arrangement: j, gap: Z, ...f ? { relativeTo: x(f), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = et(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || $();
        const u = [];
        for (const f of l) {
          if (f.options.isLocked === !0 && c.changes.locked !== !1) {
            y(f);
            continue;
          }
          const b = JSON.stringify(f.options);
          for (const [I, T] of Object.entries(c.changes))
            yt[I] || C[I].store(f.options, T, o);
          Kn(f.options, c.changes), u.push(x(f)), JSON.stringify(f.options) !== b && m.changed.push(x(f));
        }
        if (c.changes.order && u.length) {
          const f = new Set(u), b = a.nodes.map(x), I = a.nodes.filter((L) => f.has(x(L))), T = a.nodes.filter((L) => !f.has(x(L)));
          a.nodes = c.changes.order === "front" ? [...T, ...I] : [...I, ...T], a.nodes.forEach((L, A) => {
            const z = x(L);
            f.has(z) && b[A] !== z && !m.changed.includes(z) && m.changed.push(z);
          });
        }
        i.updated.push(...u), u.length && p.push({ kind: "update_nodes", target: { ids: u }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const l = et(a, c.target, `${v} target`);
        if (m.matched = l.map(x), l.length || $(), !c.target.ids && a.nodes.length > 1 && l.length === a.nodes.length && !Oe.test(n.userMessage || ""))
          throw new X("invalid_operation_plan", 400, `${v} cannot delete every note without an explicit request.`);
        const f = /* @__PURE__ */ new Set();
        for (const b of l)
          b.options.isLocked === !0 ? y(b) : f.add(x(b));
        a.nodes = a.nodes.filter((b) => !f.has(x(b)));
        for (const b of a.nodes)
          b.relationships.associations = b.relationships.associations.filter(
            (I) => !f.has(I.parentId) && !f.has(I.childId)
          );
        m.changed = [...f], i.deleted.push(...f), f.size && p.push({ kind: "delete_nodes", target: { ids: [...f] } });
        return;
      }
      case "duplicate_nodes": {
        const l = et(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || $();
        const u = c.offset ?? Qe, f = new Set(a.nodes.map(x)), b = (c.ids || []).filter((N) => f.has(N));
        if (b.length && !n.replay) throw Rt(v, "note", b);
        const I = l.map((N, M) => c.ids?.[M] || r());
        S(I.filter((N) => !f.has(N)).length);
        for (const N of l) {
          const M = q(N, "x") + u.x, O = q(N, "y") + u.y;
          if (Math.abs(M) > xt || Math.abs(O) > xt)
            throw new X(
              "invalid_operation_plan",
              400,
              `${v} would put the copy of ${x(N)} at ${M}, ${O}; a note's position must be from -${xt} to ${xt}.`
            );
        }
        const T = new Map(l.map((N, M) => [x(N), I[M]])), L = /* @__PURE__ */ new Map();
        l.forEach((N, M) => {
          const O = I[M];
          if (f.has(O)) return;
          const _ = { options: { ...zt(N.options), id: O, name: O }, relationships: { associations: [] } };
          C.x.store(_.options, q(N, "x") + u.x, o), C.y.store(_.options, q(N, "y") + u.y, o), a.nodes.push(_), L.set(O, _), m.changed.push(O), i.created.push(O);
        });
        const A = new Set(nt(a).map(({ association: N }) => N.id));
        let z = 0;
        for (const N of l) {
          const M = L.get(T.get(x(N)));
          if (M)
            for (const O of N.relationships.associations) {
              const _ = T.get(O.childId);
              if (!_ || st(O)) continue;
              const P = Ct(A, ft(x(M), _));
              A.add(P), M.relationships.associations.push({ ...zt(O), id: P, parentId: x(M), childId: _ }), i.connected.push(P), z += 1;
            }
        }
        E(A.size, z), l.length && p.push({ kind: "duplicate_nodes", target: { ids: l.map(x) }, ids: I, offset: { ...u } });
        return;
      }
      case "connect_nodes": {
        const l = et(a, c.from, `${v} from`), u = c.to?.point, f = u ? [] : et(a, c.to, `${v} to`);
        (!l.length || !u && !f.length) && $();
        const b = l.length * (u ? 1 : f.length);
        if (b > s.connectorsPerOperation)
          throw new X(
            "connector_limit",
            422,
            `${v} would join ${b} pairs of notes; one operation may join at most ${s.connectorsPerOperation}.`,
            { limit: s.connectorsPerOperation }
          );
        const I = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Map();
        for (const { association: M } of nt(a)) {
          I.add(M.id);
          const O = jt(M.parentId, M.childId);
          T.has(O) || T.set(O, M.id);
        }
        const L = [], A = [], z = [];
        let N = 0;
        for (const M of l) {
          const O = x(M), _ = u ? [null] : f.filter((P) => x(P) !== O);
          if (M.options.isLocked === !0) {
            _.length && y(M), N += _.length;
            continue;
          }
          _.length && z.push(O);
          for (const P of _) {
            const j = c.ids?.[N];
            if (N += 1, !P) {
              const at = qn(j, r), D = at.id ?? ft(O, at.childId);
              if (I.has(D)) {
                n.replay || L.push(D), A.push(D), m.matched.push(D);
                continue;
              }
              M.relationships.associations.push({ id: D, parentId: O, childId: at.childId, targetPoint: { ...u }, ...At, ...c.style || {} }), I.add(D), A.push(D), m.matched.push(D), m.changed.push(D), i.connected.push(D);
              continue;
            }
            const Z = x(P), W = T.get(jt(O, Z));
            if (W) {
              A.push(W), m.matched.push(W);
              continue;
            }
            if (j && I.has(j)) {
              n.replay || L.push(j), A.push(j), m.matched.push(j);
              continue;
            }
            const H = j || Ct(I, ft(O, Z));
            M.relationships.associations.push({ id: H, parentId: O, childId: Z, ...At, ...c.style || {} }), I.add(H), T.set(jt(O, Z), H), A.push(H), m.matched.push(H), m.changed.push(H), i.connected.push(H);
          }
        }
        if (L.length) throw Rt(v, "connector", L);
        if (I.size > s.connectorsPerSlate && m.changed.length)
          throw new X(
            "connector_limit",
            422,
            `A slate can hold at most ${s.connectorsPerSlate} connectors; this plan would leave ${I.size}.`,
            { limit: s.connectorsPerSlate }
          );
        m.changed.length && p.push({
          kind: "connect_nodes",
          from: { ids: z },
          to: u ? { point: { ...u } } : { ids: f.map(x) },
          ids: A,
          ...c.style ? { style: c.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let l;
        if (c.connectionIds) {
          const u = new Set(c.connectionIds);
          l = nt(a).filter(({ association: f }) => u.has(f.id));
        } else {
          const u = new Set(et(a, c.from, `${v} from`).map(x)), f = new Set(et(a, c.to, `${v} to`).map(x));
          l = nt(a).filter(
            ({ association: b }) => u.has(b.parentId) && f.has(b.childId) || f.has(b.parentId) && u.has(b.childId)
          );
        }
        if (m.matched = l.map(({ association: u }) => u.id), l.length || i.warnings.push(`${v} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: u, association: f } of l)
            u.relationships.associations = u.relationships.associations.filter((b) => b !== f);
          m.changed = [...m.matched], i.disconnected.push(...m.matched), l.length && p.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { node: u, association: f } of l) {
          const b = JSON.stringify([x(u), f]), I = Object.entries(c.changes).filter(([L]) => !Gt.includes(L));
          for (const [L, A] of I) f[it[L].field || L] = A;
          const T = Tn(a, u, f, c.changes, v, r);
          JSON.stringify([x(T), f]) !== b && m.changed.push(f.id);
        }
        i.connectionsUpdated.push(...m.matched), l.length && p.push({ kind: "update_connections", connectionIds: m.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const l = et(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || $();
        const u = l.filter((O) => O.options.isLocked !== !0 ? !0 : (y(O), !1));
        if (!u.length) return;
        const f = c.layout;
        let b;
        if (he[f]) b = Cn(he[f], u.map(ct));
        else if (f === "distribute-horizontal" || f === "distribute-vertical")
          b = jn(f === "distribute-horizontal" ? "horizontal" : "vertical", u.map(ct));
        else if (f === "tidy") {
          const O = new Set(u.map(x)), _ = a.nodes.filter((P) => !O.has(x(P))).map(ct);
          b = zn(u.map(ct), _, { gap: c.gap ?? 20 });
        } else if (f === "tree") {
          const O = nt(a).filter(({ association: j }) => !st(j)).map(({ association: j }) => [j.parentId, j.childId]), _ = new Set(u.map(x)), P = a.nodes.filter((j) => !_.has(x(j))).map(ct);
          b = Dn(u.map(ct), O, { gap: c.gap ?? 48, obstacles: P });
        }
        if (b) {
          const O = new Map(u.map((_) => [x(_), _]));
          for (const _ of b) {
            const P = O.get(_.id), j = [q(P, "x"), q(P, "y")];
            C.x.store(P.options, _.x, o), C.y.store(P.options, _.y, o), le(j, [_.x, _.y]) || m.changed.push(_.id);
          }
          i.updated.push(...u.map(x)), p.push({ kind: "arrange_nodes", target: { ids: u.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const I = u.map(K), T = c.gap ?? 48, L = Math.min(...I.map((O) => O.x)), A = Math.min(...I.map((O) => O.y)), z = Math.max(...I.map((O) => O.width), 120), N = Math.max(...I.map((O) => O.height), 80), M = Ht(u.length, c.layout === "circle" ? "row" : c.layout);
        u.forEach((O, _) => {
          const P = [q(O, "x"), q(O, "y")];
          let j, Z;
          if (c.layout === "circle") {
            const W = Math.max(180, u.length * 35), H = Math.PI * 2 * _ / u.length;
            j = L + W + Math.cos(H) * W, Z = A + W + Math.sin(H) * W;
          } else
            j = L + M[_].column * (z + T), Z = A + M[_].row * (N + T);
          C.x.store(O.options, j, o), C.y.store(O.options, Z, o), le(P, [j, Z]) || m.changed.push(x(O));
        }), i.updated.push(...u.map(x)), p.push({ kind: "arrange_nodes", target: { ids: u.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: T } : {} });
        return;
      }
      case "update_slate": {
        const l = c.changes, u = JSON.stringify(a);
        for (const [f, b] of Object.entries(ht))
          l[f] !== void 0 && b.store(a, l[f]);
        JSON.stringify(a) !== u && m.changed.push("slate"), p.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && i.warnings.length) {
    const c = i.warnings[0];
    throw new X("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return i.unchanged = JSON.stringify(a) === g, { slate: a, materializedPlan: { message: e.message.trim(), operations: p }, report: i };
}
function Kn(t, e) {
  const n = e.shape;
  if (!n || typeof n != "object" || t.shape !== "custom" || e.width !== void 0 && e.height !== void 0) return;
  const o = Me(n);
  if (!o) return;
  const s = (r) => Math.round(Math.min(5e3, Math.max(20, r)));
  e.height !== void 0 ? t.width = s(Number(t.height) * o) : t.height = s(Number(t.width || 180) / o);
}
function Me(t) {
  const e = Xt(t);
  return e.ok && e.shape.aspect > 0 ? Math.min(10, Math.max(0.1, e.shape.aspect)) : 0;
}
const ue = ["id", ...Object.keys(C), "image", "media"], vt = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), gt = (t) => t.options.isComment === !0;
function Ne(t, e) {
  const n = t.options, o = (r) => !e || e.includes(r), s = { id: x(t) };
  for (const [r, a] of Object.entries(C)) {
    if (!o(r)) continue;
    const h = a.read(n);
    s[r] = h === void 0 ? null : h;
  }
  return o("image") && (s.image = n.image || null), o("media") && (s.media = kn(n)), s;
}
function Le(t) {
  const e = st(t), n = { id: t.id, from: t.parentId, to: e ? null : t.childId };
  for (const [s, r] of Object.entries(it)) {
    if (Gt.includes(s)) continue;
    const a = t[r.field ?? s];
    n[s] = a === void 0 ? null : a;
  }
  e && (n.toPoint = t.targetPoint ?? null);
  const o = Pn(t);
  return (o.fromEnd !== "follow" || o.toEnd !== "follow") && Object.assign(n, o), n;
}
const ut = (t) => new X("invalid_selection", 400, t);
function Zn(t) {
  const e = {};
  if (t.ids !== void 0 && (e.ids = t.ids), t.within !== void 0 && (e.within = t.within), t.groupId !== void 0 && (e.groupId = t.groupId), t.q !== void 0)
    e.text = t.q, e.all = !0, t.match !== void 0 && (e.match = t.match);
  else if (t.match !== void 0)
    throw ut("match goes with q.");
  if (!Object.keys(e).length) return null;
  const n = dt(e, "selection").map(
    (o) => o.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q")
  );
  if (n.length) throw ut(n.join(" "));
  return e;
}
const Jn = (t) => btoa(encodeURIComponent(JSON.stringify(t))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function Vn(t) {
  try {
    const { after: e, at: n } = JSON.parse(decodeURIComponent(atob(t.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof e == "string" && e && Number.isSafeInteger(n) && n >= 0) return { after: e, at: n };
  } catch {
  }
  throw ut("cursor is not one this slate gave. Read again from the first page.");
}
function Qn(t, { after: e, at: n }) {
  let o = -1;
  if (t.forEach((s, r) => {
    x(s) === e && (o < 0 || Math.abs(r - n) < Math.abs(o - n)) && (o = r);
  }), o < 0) throw ut("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function to(t) {
  if (!t.length) return null;
  const e = t.map(K), n = Math.min(...e.map((a) => a.x)), o = Math.min(...e.map((a) => a.y)), s = Math.max(...e.map((a) => a.x + a.width)), r = Math.max(...e.map((a) => a.y + a.height));
  return { x: n, y: o, width: s - n, height: r - o };
}
function fo(t, e = {}) {
  const n = Et(t), o = n.nodes.filter(($) => !gt($)), s = e.fields;
  if (s !== void 0) {
    const $ = s.filter((y) => !ue.includes(y));
    if ($.length) throw ut(`Unknown note field: ${$.join(", ")}. Choose from ${ue.join(", ")}.`);
  }
  const r = e.limit ?? vt.notes;
  if (!Number.isInteger(r) || r < 1 || r > vt.maxNotes)
    throw ut(`limit must be a whole number from 1 to ${vt.maxNotes}.`);
  const a = e.maxChars ?? vt.maxChars, h = Zn(e), g = h ? et({ ...n, nodes: o }, h, "selection") : o;
  let w = 0;
  e.cursor !== void 0 && (w = Qn(g, Vn(e.cursor)));
  const p = new Set(n.nodes.filter(gt).map(x)), i = /* @__PURE__ */ new Map();
  for (const { association: $ } of nt(n)) {
    if (p.has($.parentId) || p.has($.childId)) continue;
    const y = i.get($.parentId) ?? [];
    y.push($), i.set($.parentId, y);
  }
  const c = [], d = [];
  let k = 0, v = w;
  for (; v < g.length && c.length < r; v += 1) {
    const $ = g[v], y = Ne($, s), S = (i.get(x($)) ?? []).map(Le), E = JSON.stringify(y).length + JSON.stringify(S).length;
    if (c.length && k + E > a) break;
    k += E, c.push(y), d.push(...S);
  }
  const m = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: dn(n.options.containerStyle),
    bounds: to(o),
    nodeCount: g.length,
    nodes: c,
    connections: d,
    nextCursor: v < g.length && m ? Jn({ after: m.id, at: v - 1 }) : null
  };
}
const eo = [
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
function mo(t) {
  const e = Et(t), n = new Set(e.nodes.filter(gt).map(x)), o = {};
  for (const r of eo) e.options[r] !== void 0 && (o[r] = e.options[r]);
  const s = e.nodes.filter((r) => !n.has(x(r))).map((r) => ({
    options: r.options,
    relationships: {
      ...r.relationships,
      associations: r.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: o, nodes: s, shareId: `${t?.shareId ?? e.options.shareId ?? ""}` };
}
const no = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"], oo = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function go(t) {
  const e = Et(t), n = e.nodes.filter((a) => !gt(a)), o = new Set(e.nodes.filter(gt).map((a) => a.options.id)), s = n.slice(0, 150).map((a) => {
    const h = Ne(a, no);
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
  }), r = nt(e).filter(({ association: a }) => !o.has(a.parentId) && !o.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const h = Le(a);
    return {
      id: h.id,
      from: h.from,
      to: h.to,
      ..."toPoint" in h ? { toPoint: h.toPoint } : {},
      // Whether each end follows its note, is pinned to a spot on its edge, or is free.
      ..."fromEnd" in h ? { fromEnd: h.fromEnd, toEnd: h.toEnd } : {},
      label: h.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(oo.map((g) => [g, h[g] ?? void 0]))
    };
  });
  return {
    name: e.options.name || "",
    description: e.options.description || "",
    nodeCount: n.length,
    nodes: s,
    connections: r
  };
}
function yo(t = {}) {
  const e = _t(t), n = (o, s) => Object.fromEntries(Object.entries(o).map(([r, a]) => [r, { ...Q(s(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries($t.map((o) => [o, { fields: Ft[o].filter((s) => s !== "kind") }])),
    noteKeys: { ...n(C, (o) => o.spec(e)), ...n(yt, (o) => o.spec) },
    noteStyleKeys: [...Wt],
    connectorKeys: n(it, (o) => o.spec),
    connectorStyleKeys: [...Kt],
    slateKeys: Object.fromEntries(
      Object.entries(ht).map(([o, s]) => [
        o,
        { ...o === "background" ? be() : Q(s.spec), description: s.description }
      ])
    ),
    selector: we(),
    layouts: [...Ut],
    presets: [...qt],
    limits: It(t),
    shapes: e.shapes,
    fonts: e.fonts,
    animations: e.animations,
    effects: e.effects,
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
function so(t = {}, e = {}) {
  const n = _t(t), o = It(t), s = (i) => {
    const c = Q(C[i].spec(n));
    return e.modelTool ? He(c) : c;
  }, r = (i) => Object.fromEntries(i.map((c) => [c, s(c)])), a = (i) => Object.fromEntries(i.map((c) => [c, { ...s(c), description: C[c].description }])), h = (i) => Object.fromEntries(i.map((c) => [c, Q(it[c].spec)])), g = we(), w = { type: "array", items: { type: "string" } }, p = $t.map((i) => `${i}: ${Ft[i].filter((c) => c !== "kind").join(", ")}`).join("; ");
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
          description: `Fields by kind. ${p}.`,
          properties: {
            kind: { type: "string", enum: [...$t] },
            count: { type: "integer", minimum: 1, maximum: o.notesPerAdd },
            ...r(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...qt],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...w, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: w,
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...Q({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...fe] },
                arrangement: { type: "string", enum: [...me] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            // Not in a model's tool: a model asks the host's add-media action, which fetches and stores the poster.
            ...e.modelTool ? {} : { media: {
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
              properties: { ...r(Wt), ...h(Kt) }
            },
            target: g,
            from: g,
            to: {
              ...g,
              description: `${g.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...g.properties, point: Q({ type: "point" }) }
            },
            layout: {
              type: "string",
              enum: [...Ut],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(ht).join(", ")}.`,
              properties: {
                ...a(Object.keys(C)),
                ...Object.fromEntries(Object.entries(yt).map(([i, c]) => [i, Q(c.spec)])),
                ...h(Object.keys(it)),
                ...Object.fromEntries(
                  Object.entries(ht).map(([i, c]) => [i, i === "background" ? be() : Q(c.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
const bo = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: so({}, { modelTool: !0 })
});
function wo(t) {
  return `Call applySlateOperations again with a safe, valid plan. ${t.join(" ")}`;
}
function xo(t) {
  if (typeof t?.message == "string" && t.message.trim()) return t.message.trim();
  const e = (t?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${e} ${e === 1 ? "change" : "changes"} to the slate.`;
}
export {
  Xe as BORDER_STYLES,
  it as CONNECTOR_KEYS,
  Kt as CONNECTOR_STYLE_KEYS,
  en as DEFAULT_FONTS,
  eo as DOCUMENT_OPTION_KEYS,
  We as EFFECTS,
  Ut as LAYOUTS,
  tn as LIMITS,
  co as MEDIA_FRAME_ORIGINS,
  un as MEDIA_HOST_NAMES,
  G as MEDIA_LIMITS,
  pn as MEDIA_NOTE_SIZE,
  xe as MEDIA_PROVIDERS,
  yt as NODE_INTENT_KEYS,
  C as NODE_KEYS,
  Wt as NODE_STYLE_KEYS,
  ue as NOTE_READ_KEYS,
  Ft as OPERATION_FIELDS,
  X as OperationPlanError,
  qt as PRESETS,
  vt as READ_LIMITS,
  ht as SLATE_KEYS,
  $t as SLATE_OPERATION_KINDS,
  bo as SLATE_OPERATION_TOOL,
  Cn as alignPositions,
  po as applyPlanToJSON,
  dn as backgroundOf,
  It as contractLimits,
  _t as contractLists,
  yo as describeOperations,
  jn as distributePositions,
  lo as isMediaUrl,
  ho as mediaEmbedUrl,
  uo as mediaLabel,
  xo as naturalOperationFallback,
  wo as operationPlanRetryPrompt,
  $e as parseMediaUrl,
  Zt as parseStart,
  Le as readConnector,
  kn as readMedia,
  Se as readMediaValue,
  Ne as readNote,
  fo as readSlate,
  Ie as rotatedBounds,
  so as slateOperationPlanSchema,
  go as summarizeSlate,
  zn as tidyPositions,
  mo as toSlateDocument,
  Et as toStoredSlate,
  Dn as treePositions,
  Sn as validatePlan
};
