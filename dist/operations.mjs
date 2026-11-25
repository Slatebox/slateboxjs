import { SHAPE_LIMITS as Nt, prepareShape as Xt, storeCustomShape as Pe } from "./shapes.mjs";
import { N as Ce } from "./NoteDefaults-BjVBa8YH.mjs";
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
function je() {
  return Array.from(B.keys());
}
const rt = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", Re = {
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
function ze() {
  return { ...Re };
}
function z(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
const Ye = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, De = /^https?:\/\/[^\s]+$/i, pe = 2e3, Be = /^[A-Za-z0-9_-]{1,64}$/;
function $t(t, e) {
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
      return e === null && t.nullable || (t.caseless ? $t(t.values, e) : t.values.find((s) => s === e)) !== void 0 ? null : `${n} must be one of: ${t.values.join(", ")}.`;
    case "shape": {
      if (e && typeof e == "object" && !Array.isArray(e)) {
        const o = Xt(e);
        return o.ok ? null : `${n} is not a usable custom shape: ${o.message}`;
      }
      return $t(t.values, e) !== void 0 ? null : `${n} must be one of: ${t.values.join(", ")} (or a custom shape {name, d, fillRule}).`;
    }
    case "list":
      return Array.isArray(e) && e.every((o) => typeof o == "string" && t.values.includes(o)) && new Set(e).size === e.length ? null : `${n} must be a list of different values from: ${t.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof e == "string" && Ye.test(e.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return z(e) && Object.keys(e).every((o) => o === "x" || o === "y") && [e.x, e.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return z(e) ? null : `${n} must be an object.`;
    case "url":
      return e === null && t.nullable || typeof e == "string" && e.length <= pe && De.test(e.trim()) ? null : `${n} must be an http or https address${t.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return e === null && t.nullable || typeof e == "string" && Be.test(e) ? null : `${n} must be 1 to 64 letters, digits, _ or -${t.nullable ? ", or null" : ""}.`;
  }
}
function Z(t) {
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
      return { oneOf: [{ type: "string", enum: [...t.values] }, He()] };
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
function He() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["name", "d"],
    description: "A custom shape: one SVG path (several closed parts and holes allowed, no markup), as shapes.generate or shapes.list return it.",
    properties: {
      name: { type: "string", minLength: 1, maxLength: Nt.maxName },
      d: { type: "string", minLength: 1, maxLength: Nt.maxInput, description: "Path data: commands and plain numbers only." },
      fillRule: { type: "string", enum: ["nonzero", "evenodd"], description: "evenodd when the shape has holes." },
      ref: {
        type: "object",
        additionalProperties: !1,
        required: ["id"],
        description: "The shape library entry it came from.",
        properties: { id: { type: "string", pattern: "^[A-Za-z0-9_-]{1,64}$" }, name: { type: "string", maxLength: Nt.maxName } }
      }
    }
  };
}
function Xe(t) {
  return Array.isArray(t.oneOf) && t.oneOf[0]?.type === "string" && t.oneOf[0]?.enum ? { ...t.oneOf[0], ...Object.fromEntries(Object.entries(t).filter(([e]) => e !== "oneOf")) } : t;
}
const U = (t) => ({
  store: (e, n) => {
    e[t] = n;
  },
  read: (e) => e[t]
}), We = ["solid", "dashed", "dotted", "combo"], Fe = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), Ue = ["front", "back"], qe = ["left", "middle", "right"], Ge = ["top", "middle", "bottom"], Yt = Object.freeze({
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
        s.ok && Pe(t, s.shape);
        return;
      }
      const o = $t(n.shapes, e);
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
    spec: () => ({ type: "enum", values: We }),
    description: "Border line style.",
    ...U("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...U("opacity") },
  fontFamily: {
    spec: (t) => ({ type: "enum", values: t.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (t, e, n) => {
      t.fontFamily = $t(n.fonts, e);
    },
    read: (t) => t.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...U("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: qe }), description: "Horizontal text alignment.", ...U("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: Ge }), description: "Vertical text alignment.", ...U("textYAlign") },
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
    spec: { type: "enum", values: Ue },
    description: "Bring the note to the front or send it to the back."
  }
}, Ke = [...Object.keys(C), ...Object.keys(yt)], Ve = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Wt = Object.keys(C).filter((t) => !Ve.has(t)), kt = [
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
}, fe = ["left", "right", "above", "below", "center"], me = ["row", "column", "grid"], Ze = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], Je = ["distribute-horizontal", "distribute-vertical"], Ut = ["row", "column", "grid", "circle", ...Ze, ...Je, "tidy", "tree"], qt = ["text", "sticky"], Qe = 75, tn = Object.freeze({ x: 20, y: 20 }), en = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), ee = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, ne = 200, nn = Object.freeze([
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
function It(t = {}) {
  return {
    shapes: [...t.shapes ?? je()],
    fonts: [...t.fonts ?? nn],
    animations: Object.keys(ze()),
    effects: [...Fe]
  };
}
function _t(t = {}) {
  return { ...en, ...t.limits || {} };
}
class X extends Error {
  constructor(e, n, o, s) {
    super(o), this.name = "OperationPlanError", this.code = e, this.status = n, s && (this.details = s);
  }
}
const on = ["bezier", "orthogonal", "straight", "linear", "curved"], sn = ["cubic", "quadratic"], rn = ["solid", "dashed", "dotted"], an = ["follow", "pinned"], oe = ["follow", "pinned", "top", "right", "bottom", "left"], it = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: on }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: sn }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  lineDash: { spec: { type: "enum", values: rn }, description: "Solid, dashed or dotted line." },
  labelPosition: {
    spec: { type: "number", min: 0.05, max: 0.95 },
    description: "Where the label sits along the line, from near its start (0.05) to near its end (0.95); the middle (0.5) when unset."
  },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: an },
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
      const n = { ...t.options.containerStyle || {}, ...un(e) };
      delete n.backgroundImage, delete n.backgroundEffect, t.options.containerStyle = n;
    }
  },
  style: {
    spec: { type: "object" },
    description: "The style the slate wears, as a record: {id, overrides?: {bg?, palette?, fonts?: {display?, body?}}, v?}, or null to take it off. The look itself lives in the slate's background, its notes and its style art (real notes the app writes with the style); sent alone, the app wears the whole style.",
    store: (t, e) => {
      e === null ? delete t.options.style : t.options.style = e;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: the slate's style colors notes by their depth in the connected tree.",
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
function cn(t, e) {
  if (!z(t)) return [`${e} must be an object {color, gradient?}.`];
  const n = [];
  for (const s of Object.keys(t))
    s !== "color" && s !== "gradient" && n.push(`${e} has an unknown field: ${s}.`);
  const o = R({ type: "color" }, t.color, `${e}.color`);
  if (o && n.push(o), t.gradient !== void 0) {
    const s = t.gradient;
    if (!z(s)) return [...n, `${e}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(s))
      ["type", "colors", "direction"].includes(a) || n.push(`${e}.gradient has an unknown field: ${a}.`);
    const i = R({ type: "enum", values: ge }, s.type, `${e}.gradient.type`);
    if (i && n.push(i), s.direction !== void 0) {
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
const dn = /^[a-z][a-z-]{0,39}$/, ln = ["bg", "palette", "fonts"];
function hn(t, e, n) {
  if (t === null) return [];
  if (!z(t)) return [`${e} must be an object {id, overrides?, v?} or null.`];
  const o = [];
  for (const i of Object.keys(t))
    ["id", "overrides", "v"].includes(i) || o.push(`${e} has an unknown field: ${i}.`);
  (typeof t.id != "string" || !dn.test(t.id)) && o.push(`${e}.id must be a style name (lowercase letters and hyphens, at most 40).`), t.v !== void 0 && (typeof t.v != "number" || !Number.isInteger(t.v) || t.v < 1 || t.v > 1e3) && o.push(`${e}.v must be a whole number from 1 to 1000.`);
  const s = t.overrides;
  if (s === void 0) return o;
  if (!z(s)) return [...o, `${e}.overrides must be an object.`];
  for (const i of Object.keys(s))
    ln.includes(i) || o.push(`${e}.overrides has an unknown field: ${i}.`);
  if (s.bg !== void 0) {
    const i = R({ type: "color" }, s.bg, `${e}.overrides.bg`);
    i && o.push(i);
  }
  if (s.palette !== void 0 && (!Array.isArray(s.palette) || s.palette.length < 1 || s.palette.length > 12 ? o.push(`${e}.overrides.palette must list 1 to 12 colors.`) : s.palette.forEach((i, a) => {
    const h = typeof i == "string" ? i.split("-") : [i];
    h.length > 2 && o.push(`${e}.overrides.palette[${a}] must be a color or a "from-to" pair.`);
    for (const g of h) {
      const w = R({ type: "color" }, g, `${e}.overrides.palette[${a}]`);
      if (w) {
        o.push(w);
        break;
      }
    }
  })), s.fonts !== void 0)
    if (!z(s.fonts)) o.push(`${e}.overrides.fonts must be an object {display?, body?}.`);
    else
      for (const [i, a] of Object.entries(s.fonts))
        i !== "display" && i !== "body" ? o.push(`${e}.overrides.fonts has an unknown field: ${i}.`) : (typeof a != "string" || !n.some((h) => h.toLowerCase() === a.toLowerCase())) && o.push(`${e}.overrides.fonts.${i} must be a font this instance offers.`);
  return o;
}
function un(t) {
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
          bg: Z({ type: "color" }),
          palette: { type: "array", minItems: 1, maxItems: 12, items: { type: "string", maxLength: 64 } },
          fonts: { type: "object", additionalProperties: !1, properties: { display: { type: "string" }, body: { type: "string" } } }
        }
      }
    }
  };
}
function we() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["color"],
    properties: {
      color: Z({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: !1,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...ge] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: Z({ type: "color" }) },
          direction: { type: "string", enum: [...ye] }
        }
      }
    }
  };
}
function pn(t) {
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
const fn = ["ids", "text", "match", "all", "within", "groupId"], mn = ["ids", "text", "within", "groupId"];
function dt(t, e) {
  if (!z(t)) return [`${e} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const s of Object.keys(t))
    fn.includes(s) || n.push(`${e} has an unknown field: ${s}.`);
  const o = mn.filter((s) => t[s] !== void 0);
  if (o.length > 1 && n.push(`${e} must name notes one way, not by ${o.join(" and ")}.`), !o.length && t.all !== !0 && n.push(`${e} must name notes by ids, text, within, groupId or all: true.`), t.ids !== void 0 && (!Array.isArray(t.ids) || !t.ids.length || t.ids.some((s) => typeof s != "string" || !s)) && n.push(`${e}.ids must be a list of note ids.`), t.text !== void 0 && (typeof t.text != "string" || !t.text.trim()) && n.push(`${e}.text must be the text of a note.`), t.match !== void 0) {
    t.text === void 0 && n.push(`${e}.match goes with text.`);
    const s = R({ type: "enum", values: ["exact", "contains"] }, t.match, `${e}.match`);
    s && n.push(s);
  }
  if (t.all !== void 0 && t.all !== !0 && n.push(`${e}.all must be true when given.`), t.groupId !== void 0 && (typeof t.groupId != "string" || !t.groupId) && n.push(`${e}.groupId must be a group id.`), t.within !== void 0) {
    const s = t.within;
    z(s) && Object.keys(s).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof s[a] == "number" && Number.isFinite(s[a])) && s.width > 0 && s.height > 0 || n.push(`${e}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function xe() {
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
const ve = ["youtube", "vimeo", "loom"], gn = Object.freeze({
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom"
}), po = Object.freeze([
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://www.loom.com"
]), yn = Object.freeze({ width: 320, height: 180 }), G = Object.freeze({ urlLength: 2e3, titleLength: 300, authorLength: 120, startSeconds: 86400 }), $e = /^[A-Za-z0-9_-]{11}$/, Dt = /^\d{1,12}$/, Bt = /^[0-9a-f]{6,20}$/i, ke = /^[0-9a-f]{32}$/i, bn = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]), wn = /* @__PURE__ */ new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]), xn = /* @__PURE__ */ new Set(["loom.com", "www.loom.com"]);
function Vt(t) {
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
function Zt(t) {
  return t.hostname.toLowerCase().replace(/\.$/, "");
}
function vn(t) {
  const e = Zt(t), n = t.pathname.split("/").filter(Boolean);
  let o;
  if (e === "youtu.be" ? o = n[0] : n[0] === "watch" ? o = t.searchParams.get("v") ?? void 0 : ["shorts", "embed", "live", "v"].includes(n[0]) && (o = n[1]), !o || !$e.test(o)) return null;
  const s = Vt(t.searchParams.get("t") ?? t.searchParams.get("start"));
  return { provider: "youtube", id: o, url: `https://www.youtube.com/watch?v=${o}`, ...s ? { start: s } : {} };
}
function $n(t) {
  const e = Zt(t), n = t.pathname.split("/").filter(Boolean);
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
  const i = Vt((t.hash.match(/t=([0-9hms]+)/i) || [])[1]);
  return {
    provider: "vimeo",
    id: o,
    url: s ? `https://vimeo.com/${o}/${s}` : `https://vimeo.com/${o}`,
    ...s ? { hash: s } : {},
    ...i ? { start: i } : {}
  };
}
function kn(t) {
  const e = t.pathname.split("/").filter(Boolean);
  if (!["share", "embed"].includes(e[0])) return null;
  const n = e[1] ? e[1].split("-").pop() : void 0;
  if (!n || !ke.test(n)) return null;
  const o = n.toLowerCase(), s = Vt(t.searchParams.get("t"));
  return { provider: "loom", id: o, url: `https://www.loom.com/share/${o}`, ...s ? { start: s } : {} };
}
function Se(t) {
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
  const o = Zt(n);
  return bn.has(o) ? vn(n) : wn.has(o) ? $n(n) : xn.has(o) ? kn(n) : null;
}
const fo = (t) => Se(t) !== null;
function mo(t, { play: e = !1 } = {}) {
  const n = e ? "1" : "0";
  switch (t?.provider) {
    case "youtube": {
      if (!$e.test(t.id)) return null;
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
const Sn = /^(?:https:\/\/[^\s"'<>]+|\/sbimages\/media-posters(?:\/|%2F)(?!.*(?:\.\.|%2e%2e))[^\s"'<>\\]*)$/i, ie = (t, e) => typeof t != "string" ? void 0 : t.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, e) || void 0, re = (t) => typeof t == "number" && Number.isFinite(t) && t > 0 && t <= 1e4 ? Math.round(t) : void 0;
function Oe(t) {
  if (!t || typeof t != "object" || Array.isArray(t)) return { ok: !1, message: "must be an object with the video's url." };
  const e = t, n = ["url", "provider", "id", "hash", "start", "title", "author", "poster", "posterWidth", "posterHeight"], o = Object.keys(e).filter((p) => !n.includes(p));
  if (o.length) return { ok: !1, message: `has fields it does not take: ${o.join(", ")}.` };
  const s = Se(e.url);
  if (!s) return { ok: !1, message: "url must be a YouTube, Vimeo or Loom video address." };
  if (e.provider !== void 0 && e.provider !== s.provider) return { ok: !1, message: "provider does not match the url." };
  if (e.id !== void 0 && e.id !== s.id) return { ok: !1, message: "id does not match the url." };
  if (e.poster !== void 0 && (typeof e.poster != "string" || e.poster.length > G.urlLength || !Sn.test(e.poster)))
    return { ok: !1, message: "poster must be an https address or a poster this app stored (/sbimages/media-posters/...)." };
  const i = e.start === void 0 ? s.start : Number.isSafeInteger(e.start) && e.start > 0 && e.start <= G.startSeconds ? e.start : NaN;
  if (Number.isNaN(i)) return { ok: !1, message: `start must be whole seconds from 1 to ${G.startSeconds}.` };
  const a = ie(e.title, G.titleLength), h = ie(e.author, G.authorLength), g = re(e.posterWidth), w = re(e.posterHeight);
  return {
    ok: !0,
    media: {
      ...s,
      ...i ? { start: i } : {},
      ...a ? { title: a } : {},
      ...h ? { author: h } : {},
      ...typeof e.poster == "string" ? { poster: e.poster } : {},
      ...g && w ? { posterWidth: g, posterHeight: w } : {}
    }
  };
}
function On(t, e) {
  t.media = { ...e }, t.text = "", t.shape = "rectangle", t.vectorPath = "rectangle", t.shapeHint = "rectangle", t.imageFit = "cover", t.backgroundColor = "#111418", t.borderColor = "#111418", t.showTextTab = !1, e.poster ? (t.image = e.poster, t.imageOrigWidth = e.posterWidth || 480, t.imageOrigHeight = e.posterHeight || 360) : delete t.image;
}
function In(t) {
  const e = t?.media;
  return !e || typeof e != "object" || !ve.includes(e.provider) ? null : {
    provider: e.provider,
    url: e.url,
    ...e.title ? { title: e.title } : {},
    ...e.author ? { author: e.author } : {},
    ...e.start ? { start: e.start } : {},
    ...e.poster ? { poster: e.poster } : {}
  };
}
function go(t) {
  if (!t || !ve.includes(t.provider)) return "Video";
  const e = gn[t.provider];
  return t.title ? `Video: ${t.title} (${e})` : `${e} video`;
}
const _n = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, Ie = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function pt(t, e, n, o, s, { required: i = !0, plural: a = `${o}s` } = {}) {
  const h = [];
  if (t === void 0 && !i) return h;
  if (!z(t) || i && !Object.keys(t).length)
    return [i ? `${n} requires at least one ${o}.` : `${n} ${a} must be an object.`];
  const g = Object.keys(t).filter((w) => !e.includes(w));
  g.length && h.push(`${n} contains unsupported ${a}: ${g.join(", ")}.`);
  for (const [w, p] of Object.entries(t))
    e.includes(w) && s(w, p, h);
  return h;
}
function ae(t, e) {
  return (n, o, s) => {
    const i = yt[n]?.spec ?? C[n].spec(t), a = R(i, o, `${e} ${n}`);
    a && s.push(a);
  };
}
function ce(t) {
  return (e, n, o) => {
    const s = R(it[e].spec, n, `${t} ${e}`);
    s && o.push(s);
  };
}
function Q(t) {
  return Array.isArray(t) && t.length > 0 && t.every((e) => typeof e == "string" && e.length > 0);
}
function En(t, e = {}) {
  const n = It(e), o = _t(e), s = e.userMessage || "";
  if (!z(t)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const i = [];
  for (const r of Object.keys(t))
    r !== "message" && r !== "operations" && i.push(`The plan has an unknown field: ${r}.`);
  (typeof t.message != "string" || !t.message.trim()) && i.push("A natural completion message is required."), !Array.isArray(t.operations) || t.operations.length === 0 ? i.push("At least one slate operation is required.") : t.operations.length > o.operationsPerPlan && i.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const a = !!e.existingNodeIds?.length, h = new Set((e.existingNodeIds || []).filter(Boolean)), g = !!e.existingConnectionIds?.length, w = new Set((e.existingConnectionIds || []).filter(Boolean)), p = (r, c) => {
    a && z(r) && Array.isArray(r.ids) && r.ids.some((d) => !h.has(d)) && i.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(t.operations) ? t.operations : []).forEach((r, c) => {
    const d = `Operation ${c + 1}`;
    if (!z(r) || !kt.includes(r.kind)) {
      i.push(`${d} has an unsupported kind.`);
      return;
    }
    const $ = Ft[r.kind], v = Object.keys(r).filter((m) => !$.includes(m));
    for (const m of v) i.push(`${d} has an unknown field: ${m}.`);
    switch (r.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(r.count) || r.count < 1 || r.count > o.notesPerAdd) && i.push(`${d} count must be an integer from 1 to ${o.notesPerAdd}.`), r.preset !== void 0) {
          const S = R({ type: "enum", values: qt }, r.preset, `${d} preset`);
          S && i.push(S);
        }
        const m = z(r.placement) && r.placement.connect === !0, k = r.media !== void 0;
        if (k) {
          const S = Oe(r.media);
          S.ok || i.push(`${d} media ${S.message}`), r.count !== 1 && i.push(`${d} adds one media note at a time (count 1).`);
          for (const E of ["shape", "preset", "text"])
            r[E] !== void 0 && i.push(`${d} is a media note, so it takes no ${E}.`);
          m && i.push(`${d} is a media note, so it cannot copy and connect from another note.`);
        }
        if (!k && (r.shape !== void 0 || r.preset === void 0 && !m)) {
          const S = R(C.shape.spec(n), r.shape, `${d} shape`);
          S && i.push(S);
        }
        for (const S of ["text", "width", "height"]) {
          if (r[S] === void 0) continue;
          const E = R(C[S].spec(n), r[S], `${d} ${S}`);
          E && i.push(E);
        }
        r.x === void 0 != (r.y === void 0) && i.push(`${d} needs both x and y, or neither.`);
        for (const S of ["x", "y"]) {
          if (r[S] === void 0) continue;
          const E = R(C[S].spec(n), r[S], `${d} ${S}`);
          E && i.push(E);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : r.ids.some((S) => !ee.test(S)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(r.count) && r.ids.length > r.count && i.push(`${d} has more ids than notes to add.`));
        const y = r.placement;
        if (y !== void 0)
          if (!z(y))
            i.push(`${d} placement must be an object.`);
          else {
            const S = r.x !== void 0 ? ["arrangement", "gap", ...y.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const E of Object.keys(y))
              S.includes(E) || i.push(
                r.x !== void 0 && ["relativeTo", "direction", "connect"].includes(E) ? `${d} gives x and y, so placement cannot also give ${E}.` : `${d} placement has an unknown field: ${E}.`
              );
            y.connect !== void 0 && (typeof y.connect != "boolean" ? i.push(`${d} placement.connect must be true or false.`) : y.connect && (y.relativeTo === void 0 && i.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), y.direction === "center" && i.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), y.relativeTo !== void 0 && typeof y.relativeTo != "string" ? i.push(`${d} placement.relativeTo must be a note id.`) : y.relativeTo && a && !h.has(y.relativeTo) && i.push(`${d} references a note that is not in the slate.`);
            for (const [E, l] of [["direction", fe], ["arrangement", me]]) {
              if (y[E] === void 0) continue;
              const u = R({ type: "enum", values: l }, y[E], `${d} placement.${E}`);
              u && i.push(u);
            }
            if (y.gap !== void 0) {
              const E = R({ type: "number", min: 0, max: 2e3 }, y.gap, `${d} placement.gap`);
              E && i.push(E);
            }
          }
        i.push(...pt(r.style, Wt, d, "node style", ae(n, d), { required: !1 })), Q(r.ids) && r.ids.forEach((S) => h.add(S));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = dt(r.target, `${d} target`);
        if (i.push(...m), m.length || p(r.target, d), r.kind === "update_nodes" && i.push(...pt(r.changes, Ke, d, "node change", ae(n, d), { plural: "changes" })), r.kind === "delete_nodes" && z(r.target) && r.target.all === !0 && Object.keys(r.target).length === 1 && !Ie.test(s) && i.push(`${d} cannot delete every note without an explicit request.`), r.kind === "arrange_nodes") {
          const k = R({ type: "enum", values: Ut }, r.layout, `${d} layout`);
          if (k && i.push(k), r.gap !== void 0) {
            const y = R({ type: "number", min: 0, max: 2e3 }, r.gap, `${d} gap`);
            y && i.push(y);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = dt(r.target, `${d} target`);
        if (i.push(...m), m.length || p(r.target, d), r.offset !== void 0) {
          const k = R({ type: "point" }, r.offset, `${d} offset`);
          k && i.push(k);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : r.ids.some((k) => !ee.test(k)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : z(r.target) && Q(r.target.ids) && r.ids.length > r.target.ids.length && i.push(`${d} has more ids than notes to copy.`)), Q(r.ids) && r.ids.forEach((k) => h.add(k));
        return;
      }
      case "connect_nodes": {
        const m = dt(r.from, `${d} from`);
        if (i.push(...m), m.length || p(r.from, d), z(r.to) && r.to.point !== void 0) {
          Object.keys(r.to).length !== 1 && i.push(`${d} to must be a note selector or {point}, not both.`);
          const S = R({ type: "point" }, r.to.point, `${d} to.point`);
          S && i.push(S);
        } else {
          const S = dt(r.to, `${d} to`);
          i.push(...S), S.length || p(r.to, d);
        }
        r.ids !== void 0 && (!Q(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${d} ids must be a list of different connector ids.`) : r.ids.some((S) => S.length > ne) && i.push(`${d} connector ids can be at most ${ne} characters.`)), i.push(...pt(r.style, Kt, d, "connection style", ce(d), { required: !1 })), Q(r.ids) && r.ids.forEach((S) => w.add(S));
        const k = r.from?.ids, y = r.to?.ids;
        Q(k) && Q(y) && k.forEach((S) => y.forEach((E) => w.add(`${S}->${E}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = r.connectionIds !== void 0, k = r.from !== void 0 || r.to !== void 0;
        if (m && k && i.push(`${d} names connectors by connectionIds or by from and to, not both.`), !m && !k && i.push(`${d} requires connectionIds or both from and to note selectors.`), m && (Q(r.connectionIds) ? g && r.connectionIds.some((y) => !w.has(y)) && i.push(`${d} references connectors that are not in the slate.`) : i.push(`${d} connectionIds must be a list of connector ids.`)), k)
          for (const y of ["from", "to"]) {
            const S = dt(r[y], `${d} ${y}`);
            i.push(...S), S.length || p(r[y], d);
          }
        if (r.kind === "update_connections") {
          i.push(...pt(r.changes, Object.keys(it), d, "connection change", ce(d)));
          const y = z(r.changes) ? r.changes : {};
          y.toNote !== void 0 && y.toPoint !== void 0 && i.push(`${d} moves the far end with toNote or toPoint, not both.`), y.fromNote !== void 0 && y.fromPoint !== void 0 && i.push(`${d} moves the starting end with fromNote or fromPoint, not both.`), y.ends !== void 0 && (y.fromEnd !== void 0 || y.toEnd !== void 0) && i.push(`${d} sets ends, or fromEnd and toEnd, not both.`), y.toPoint !== void 0 && y.toEnd !== void 0 && i.push(`${d} cannot pin a far end it leaves free (toPoint with toEnd).`), y.fromPoint !== void 0 && (y.toPoint !== void 0 || y.fromEnd !== void 0) && i.push(`${d} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        i.push(
          ...pt(r.changes, Object.keys(ht), d, "slate change", (m, k, y) => {
            if (m === "background") {
              y.push(...cn(k, `${d} background`));
              return;
            }
            if (m === "style") {
              y.push(...hn(k, `${d} style`, n.fonts));
              return;
            }
            const S = R(ht[m].spec, k, `${d} ${m}`);
            S && y.push(S);
          })
        ), z(r.changes) && r.changes.background !== void 0 && !_n.test(s) && i.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: i.length === 0, errors: i };
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
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((s) => Ln(s?.v2 ?? s))
  } : St(t || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((s) => {
    const i = s?.options ? s : { options: { ...s || {} }, relationships: s?.relationships };
    return i.options.relationships && delete i.options.relationships, i.relationships = { ...i.relationships || {}, associations: [...i.relationships?.associations || []] }, i.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = i.options.id), a.id || (a.id = ft(a.parentId, a.childId));
    }), i;
  }), o;
}
function Ln(t) {
  const e = St(t.options || {});
  e.x !== void 0 && (e.xPos = e.x, delete e.x), e.y !== void 0 && (e.yPos = e.y, delete e.y), e.fontColor !== void 0 && e.foregroundColor === void 0 && (e.foregroundColor = e.fontColor);
  const n = typeof t.getRotation == "function" ? t.getRotation() : void 0;
  typeof n == "number" && (e.rotate = { ...e.rotate || {}, rotationAngle: n });
  const o = t.relationships, s = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: e,
    relationships: {
      associations: s.map(({ parent: i, child: a, ...h }) => St(h))
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
    return e.ids.map((s) => o.find((i) => x(i) === s)).filter(Boolean);
  if (e.text !== void 0) {
    const s = Tt(e.text), i = o.filter(
      (a) => e.match === "contains" ? Tt(a.options.text).includes(s) : Tt(a.options.text) === s
    );
    if (i.length > 1 && e.all !== !0)
      throw new X(
        "ambiguous_selector",
        400,
        `${n} "${e.text}" matches ${i.length} notes (${i.map(x).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: i.map((a) => ({ id: x(a), text: a.options.text ?? "" })) }
      );
    return i;
  }
  if (e.within) {
    const s = e.within;
    return o.filter((i) => {
      const a = K(i);
      return a.x >= s.x && a.y >= s.y && a.x + a.width <= s.x + s.width && a.y + a.height <= s.y + s.height;
    });
  }
  return e.groupId !== void 0 ? o.filter((s) => s.options.groupId === e.groupId) : e.all === !0 ? [...o] : [];
}
const lt = (t) => Math.round(t * 1e4) / 1e4, de = (t) => Math.max(0, Math.min(1, t));
function Mn(t) {
  const e = de(t.x), n = de(t.y), o = [e, 1 - e, n, 1 - n], s = Math.min(...o);
  return s === o[0] ? { x: 0, y: lt(n) } : s === o[1] ? { x: 1, y: lt(n) } : s === o[2] ? { x: lt(e), y: 0 } : { x: lt(e), y: 1 };
}
function Nn(t) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[t];
}
function _e(t, e, n) {
  if (!n) return { ...t };
  const o = n * Math.PI / 180, s = t.x - e.x, i = t.y - e.y;
  return { x: e.x + s * Math.cos(o) - i * Math.sin(o), y: e.y + s * Math.sin(o) + i * Math.cos(o) };
}
function An(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = _e(e, n, -(t.rotation || 0));
  return { x: (o.x - t.x) / (t.width || 1), y: (o.y - t.y) / (t.height || 1) };
}
function Tn(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = _e({ x: t.x + e.x * t.width, y: t.y + e.y * t.height }, n, t.rotation || 0);
  return { x: lt(o.x), y: lt(o.y) };
}
function Pn(t, e) {
  const n = An(t, e), o = (n.x - 0.5) * (t.width || 1), s = (n.y - 0.5) * (t.height || 1);
  if (Math.abs(o) < 1e-9 && Math.abs(s) < 1e-9) return { x: 0.5, y: 0 };
  const i = o !== 0 ? t.width / 2 / Math.abs(o) : 1 / 0, a = s !== 0 ? t.height / 2 / Math.abs(s) : 1 / 0, h = Math.min(i, a);
  return Mn({ x: 0.5 + o * h / (t.width || 1), y: 0.5 + s * h / (t.height || 1) });
}
function Cn(t) {
  const e = { ...t };
  return e.showParentArrow = t.showChildArrow !== !1, e.showChildArrow = !!t.showParentArrow, e.sourceAnchor = t.targetAnchor ?? null, e.targetAnchor = null, e;
}
const Pt = (t) => ({ ...K(t), rotation: Number(q(t, "rotationAngle")) || 0 }), jn = (t) => ({ x: t.x + t.width / 2, y: t.y + t.height / 2 });
function Rn(t, e, n, o, s, i) {
  const a = (d) => t.nodes.find(($) => x($) === d), h = (d) => {
    throw new X("invalid_operation_plan", 400, `${s} ${d}`);
  }, g = (d) => {
    throw new X("no_match", 409, `${s} names no note ${JSON.stringify(d)} on the slate.`);
  }, w = (d, $) => {
    d !== $ && (d.relationships.associations = d.relationships.associations.filter((v) => v !== n), $.relationships.associations.push(n));
  };
  let p = e;
  if (o.toNote !== void 0) {
    const d = a(o.toNote) ?? g(o.toNote);
    n.childId = x(d), delete n.targetPoint, n.targetAnchor = null;
  } else o.toPoint !== void 0 && (st(n) || (n.childId = `${mt}${i()}`), n.targetPoint = { x: o.toPoint.x, y: o.toPoint.y }, n.targetAnchor = null);
  if (o.fromNote !== void 0) {
    const d = a(o.fromNote) ?? g(o.fromNote);
    n.parentId = x(d), n.sourceAnchor = null, w(p, d), p = d;
  } else if (o.fromPoint !== void 0) {
    st(n) && h(`keeps one end on a note: the far end of ${n.id} is already free.`);
    const d = a(n.childId) ?? g(n.childId), $ = Cn(n);
    for (const v of Object.keys(n)) delete n[v];
    Object.assign(n, $, {
      parentId: x(d),
      childId: `${mt}${i()}`,
      targetPoint: { x: o.fromPoint.x, y: o.fromPoint.y }
    }), w(p, d), p = d;
  }
  n.parentId === n.childId && h(`cannot connect ${n.id} from a note to itself.`);
  const r = (d) => {
    if (d === "target" && st(n)) return n.targetPoint;
    const $ = a(d === "source" ? n.parentId : n.childId);
    if (!$) return null;
    const v = d === "source" ? n.sourceAnchor : n.targetAnchor;
    return v ? Tn(Pt($), v) : jn(Pt($));
  }, c = (d, $, v) => {
    if (d === "target" && st(n)) {
      v && h(`cannot pin or follow the far end of ${n.id}: it is free, on no note.`);
      return;
    }
    const m = d === "source" ? "sourceAnchor" : "targetAnchor";
    if ($ === "follow") n[m] = null;
    else if ($ !== "pinned") n[m] = Nn($);
    else if (!n[m]) {
      const k = a(d === "source" ? n.parentId : n.childId), y = r(d === "source" ? "target" : "source");
      k && y && (n[m] = Pn(Pt(k), y));
    }
  };
  return o.ends !== void 0 && (c("source", o.ends, !1), c("target", o.ends, !1)), o.fromEnd !== void 0 && c("source", o.fromEnd, !0), o.toEnd !== void 0 && c("target", o.toEnd, !0), p;
}
function zn(t) {
  return {
    fromEnd: t.sourceAnchor ? "pinned" : "follow",
    toEnd: st(t) ? "free" : t.targetAnchor ? "pinned" : "follow"
  };
}
function Ee(t) {
  const { x: e, y: n, width: o, height: s } = t, i = t.rotationAngle || 0;
  if (!i) return { minX: e, minY: n, maxX: e + o, maxY: n + s };
  const a = e + o / 2, h = n + s / 2, g = i * Math.PI / 180, w = Math.cos(g), p = Math.sin(g);
  let r = 1 / 0, c = 1 / 0, d = -1 / 0, $ = -1 / 0;
  for (const [m, k] of [[e, n], [e + o, n], [e + o, n + s], [e, n + s]]) {
    const y = m - a, S = k - h, E = a + y * w - S * p, l = h + y * p + S * w;
    r = Math.min(r, E), c = Math.min(c, l), d = Math.max(d, E), $ = Math.max($, l);
  }
  const v = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: v(r), minY: v(c), maxX: v(d), maxY: v($) };
}
function Yn(t, e) {
  if (e.length < 2) return [];
  const n = e.map(Ee), o = Math.min(...n.map((w) => w.minX)), s = Math.max(...n.map((w) => w.maxX)), i = Math.min(...n.map((w) => w.minY)), a = Math.max(...n.map((w) => w.maxY)), h = (o + s) / 2, g = (i + a) / 2;
  return e.map((w, p) => {
    const r = n[p];
    let { x: c, y: d } = w;
    return t === "left" ? c += o - r.minX : t === "right" ? c += s - r.maxX : t === "centerH" ? c += h - (r.minX + r.maxX) / 2 : t === "top" ? d += i - r.minY : t === "bottom" ? d += a - r.maxY : t === "middle" && (d += g - (r.minY + r.maxY) / 2), { id: w.id, x: c, y: d };
  });
}
function Dn(t, e) {
  if (e.length < 3) return [];
  const n = e.map((c, d) => ({ box: c, index: d, b: Ee(c) })), o = t === "horizontal", s = (c) => o ? c.b.minX : c.b.minY, i = (c) => o ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, a = [...n].sort((c, d) => s(c) - s(d) || c.index - d.index), h = s(a[0]), w = (a.reduce((c, d) => Math.max(c, s(d) + i(d)), -1 / 0) - h - a.reduce((c, d) => c + i(d), 0)) / (a.length - 1), p = /* @__PURE__ */ new Map();
  let r = h;
  for (const c of a) {
    const d = r - s(c);
    p.set(c.index, {
      id: c.box.id,
      x: o ? c.box.x + d : c.box.x,
      y: o ? c.box.y : c.box.y + d
    }), r += i(c) + w;
  }
  return n.map((c) => p.get(c.index));
}
function Ot(t, e, n) {
  const o = Math.min(t.x + t.width + n - e.x, e.x + e.width + n - t.x), s = Math.min(t.y + t.height + n - e.y, e.y + e.height + n - t.y);
  return o > 0 && s > 0 ? { x: o, y: s } : null;
}
const Bn = 4e6;
function Hn(t, e, { gap: n = 20 } = {}) {
  const o = t.map((p) => ({ ...p })), s = e.map((p) => ({ ...p })), i = (p, r, c, d, $) => {
    const v = p.x + p.width / 2 - (r.x + r.width / 2), m = p.y + p.height / 2 - (r.y + r.height / 2);
    c.y <= c.x ? p.y += (m > 0 || m === 0 && $ > 0 ? 1 : -1) * c.y * d : p.x += (v > 0 || v === 0 && $ > 0 ? 1 : -1) * c.x * d;
  }, a = Math.max(1, o.length * (s.length + o.length / 2)), h = Math.max(1, Math.min(1e3, Math.floor(Bn / a)));
  let g = !1;
  for (let p = 0; p < h; p += 1) {
    let r = !1;
    for (let c = 0; c < o.length; c += 1) {
      for (const d of s) {
        const $ = Ot(o[c], d, n);
        $ && (i(o[c], d, $, 1, 1), r = !0);
      }
      for (let d = c + 1; d < o.length; d += 1) {
        const $ = Ot(o[c], o[d], n);
        $ && (i(o[c], o[d], $, 0.5, -1), i(o[d], o[c], $, 0.5, 1), r = !0);
      }
    }
    if (!r) {
      g = !0;
      break;
    }
  }
  const w = (p) => Math.round(p * 100) / 100;
  for (const p of o)
    p.x = w(p.x), p.y = w(p.y);
  return g || Xn(o, s, n), o.map(({ id: p, x: r, y: c }) => ({ id: p, x: r, y: c }));
}
function Xn(t, e, n) {
  const o = [...e], s = [];
  for (const d of t)
    o.some(($) => Ot(d, $, n)) ? s.push(d) : o.push(d);
  if (!s.length) return;
  const i = Math.min(...t.map((d) => d.x)), a = o.length ? Math.max(...o.map((d) => d.y + d.height)) + n : Math.min(...t.map((d) => d.y)), h = o.length ? Math.max(...o.map((d) => d.x + d.width)) : i, g = s.reduce((d, $) => d + ($.width + n) * ($.height + n), 0), w = Math.max(h - i, Math.sqrt(g) * 1.5, ...s.map((d) => d.width));
  let p = i, r = a, c = 0;
  for (const d of s)
    p > i && p + d.width > i + w && (p = i, r += c + n, c = 0), d.x = p, d.y = r, p += d.width + n, c = Math.max(c, d.height);
}
function Wn(t, e, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!t.length) return [];
  const s = new Map(t.map((l) => [l.id, l])), i = new Map(t.map((l) => [l.id, []])), a = new Map(t.map((l) => [l.id, 0]));
  for (const [l, u] of e)
    !s.has(l) || !s.has(u) || l === u || (i.get(l).push(u), a.set(u, a.get(u) + 1));
  const h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), w = [], p = (l) => {
    w.push(l), g.set(l, 0), h.set(l, []);
    const u = [l];
    for (; u.length; ) {
      const f = u.shift();
      for (const b of i.get(f))
        g.has(b) || (g.set(b, g.get(f) + 1), h.set(b, []), h.get(f).push(b), u.push(b));
    }
  };
  for (const l of t) a.get(l.id) === 0 && !g.has(l.id) && p(l.id);
  for (const l of t) g.has(l.id) || p(l.id);
  const r = [];
  for (const l of t) {
    const u = g.get(l.id);
    r[u] = Math.max(r[u] ?? 0, l.height);
  }
  const c = Math.min(...t.map((l) => l.x)), d = Math.min(...t.map((l) => l.y)), $ = [];
  r.forEach((l, u) => {
    $[u] = u === 0 ? d : $[u - 1] + r[u - 1] + n;
  });
  const v = /* @__PURE__ */ new Map(), m = (l) => {
    const u = h.get(l), f = u.reduce((_, T) => _ + m(T), 0) + n * Math.max(0, u.length - 1), b = Math.max(s.get(l).width, f);
    return v.set(l, b), b;
  }, k = /* @__PURE__ */ new Map(), y = (l, u) => {
    const f = s.get(l), b = h.get(l), _ = v.get(l), T = $[g.get(l)];
    if (!b.length) {
      k.set(l, { id: l, x: u + (_ - f.width) / 2, y: T });
      return;
    }
    const N = b.reduce((I, P) => I + v.get(P), 0) + n * (b.length - 1);
    let A = u + (_ - N) / 2;
    for (const I of b)
      y(I, A), A += v.get(I) + n;
    const Y = k.get(b[0]), M = k.get(b[b.length - 1]), L = (Y.x + s.get(b[0]).width / 2 + M.x + s.get(b[b.length - 1]).width / 2) / 2, O = Math.min(Math.max(L - f.width / 2, u), u + _ - f.width);
    k.set(l, { id: l, x: O, y: T });
  };
  let S = c;
  for (const l of w) {
    const u = m(l);
    y(l, S), S += u + n;
  }
  const E = t.map((l) => k.get(l.id));
  return Fn(t, E, o, n);
}
function Fn(t, e, n, o) {
  if (!n.length) return e;
  let s = 0;
  for (let i = 0; i <= n.length; i += 1) {
    let a = 0;
    if (e.forEach((h, g) => {
      const w = { ...t[g], x: h.x, y: h.y + s };
      for (const p of n)
        Ot(w, p, o) && (a = Math.max(a, p.y + p.height + o - w.y));
    }), !a) break;
    s += a;
  }
  return s ? e.map((i) => ({ ...i, y: i.y + s })) : e;
}
function Un() {
  const t = "abcdefghijklmnopqrstuvwxyz0123456789";
  let e = "";
  for (let n = 0; n < 12; n += 1) e += t[Math.floor(Math.random() * t.length)];
  return e;
}
function qn(t) {
  const e = (i) => {
    const a = (parseInt(i, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (i) => 0.2126 * e(i.substr(1, 2)) + 0.7152 * e(i.substr(3, 2)) + 0.0722 * e(i.substr(-2)), o = (i, a) => {
    const [h, g] = [n(i), n(a)];
    return (Math.max(h, g) + 0.05) / (Math.min(h, g) + 0.05);
  }, s = /^#[0-9a-f]{6}$/i.test(t) ? t : "#7aa2c8";
  return o(s, "#ffffff") > o(s, "#000000") ? "#ffffff" : "#000000";
}
function Gn(t, e, n) {
  return t.x < e.x + e.width + n && t.x + t.width + n > e.x && t.y < e.y + e.height + n && t.y + t.height + n > e.y;
}
function Kn(t, e, n, o, s, i) {
  let a = t;
  for (let h = 0; h <= e.length; h += 1) {
    const g = e.filter((r) => a.some((c) => Gn({ ...c, width: n, height: o }, r, i)));
    if (!g.length) return a;
    let w = 0, p = 0;
    s === "left" ? w = Math.min(...g.map((r) => r.x - i)) - Math.max(...a.map((r) => r.x + n)) : s === "above" ? p = Math.min(...g.map((r) => r.y - i)) - Math.max(...a.map((r) => r.y + o)) : s === "below" || s === "center" ? p = Math.max(...g.map((r) => r.y + r.height + i)) - Math.min(...a.map((r) => r.y)) : w = Math.max(...g.map((r) => r.x + r.width + i)) - Math.min(...a.map((r) => r.x)), a = a.map((r) => ({ x: r.x + w, y: r.y + p }));
  }
  return a;
}
function Le(t, e) {
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
function Vn(t, e, n, o) {
  const s = e.count, i = e.placement || {}, a = i.gap ?? (i.connect ? Qe : 48);
  if (e.x !== void 0 && e.y !== void 0) {
    const c = i.arrangement || "row";
    return { points: Ht(s, c).map(({ row: $, column: v }) => ({
      x: e.x + v * (n + a),
      y: e.y + $ * (o + a)
    })), arrangement: c, gap: a };
  }
  const h = Le(t, i.relativeTo), g = h ? K(h) : { x: 0, y: 0, width: 160, height: 100 }, w = i.direction || "right", p = i.arrangement || (["left", "right"].includes(w) ? "column" : "row"), r = Ht(s, p).map(({ row: c, column: d }) => {
    let $ = g.x + d * (n + a), v = g.y + c * (o + a);
    return w === "right" && ($ += g.width + a), w === "left" && ($ -= n + a), w === "below" && (v += g.height + a), w === "above" && (v -= o + a), { x: $, y: v };
  });
  return { points: Kn(r, t.nodes.map(K), n, o, w, a), arrangement: p, gap: a };
}
function Zn(t, e) {
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
const le = (t, e) => JSON.stringify(t) === JSON.stringify(e), Jn = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], zt = (t) => JSON.parse(JSON.stringify(t)), xt = 1e6, he = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, ct = (t) => ({ id: x(t), ...K(t), rotationAngle: q(t, "rotationAngle") });
function yo(t, e, n = {}) {
  const o = It(n), s = _t(n), i = n.idFactory || Un, a = Et(t), h = En(e, {
    ...n,
    existingNodeIds: a.nodes.map(x),
    existingConnectionIds: nt(a).map(({ association: c }) => c.id)
  });
  if (!h.valid)
    throw new X("invalid_operation_plan", 400, h.errors.join(" "), { errors: h.errors });
  const g = JSON.stringify(a), w = a.nodes.length, p = [], r = {
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
    const $ = d + 1, v = `Operation ${$}`, m = { operation: $, kind: c.kind, matched: [], changed: [] };
    r.operations.push(m);
    const k = () => r.warnings.push(`${v} matched no notes.`), y = (l) => {
      r.skipped.push({ operation: $, id: x(l), reason: "locked" });
    }, S = (l) => {
      const u = a.nodes.length + l;
      if (l > 0 && u > s.notesPerSlate && u > w)
        throw new X(
          "note_limit",
          422,
          `${v} would leave ${u} notes; a slate can hold at most ${s.notesPerSlate} notes.`,
          { limit: s.notesPerSlate, operation: $ }
        );
    }, E = (l, u) => {
      if (u > 0 && l > s.connectorsPerSlate)
        throw new X(
          "connector_limit",
          422,
          `${v} would leave ${l} connectors; a slate can hold at most ${s.connectorsPerSlate} connectors.`,
          { limit: s.connectorsPerSlate, operation: $ }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const l = c.preset ? Ce[c.preset] : void 0, u = c.placement?.connect === !0, f = u ? a.nodes.find((F) => x(F) === c.placement.relativeTo) : void 0;
        if (u && !f)
          throw new X("no_match", 409, `${v} placement.relativeTo names no note on the slate to connect from.`, { operation: $ });
        if (f && f.options.isLocked === !0) {
          y(f);
          return;
        }
        const b = c.shape ?? l?.shape, _ = f ? K(f) : void 0, T = typeof b == "string" && b.toLowerCase() === "triangle", N = b && typeof b == "object" ? Me(b) : 0, A = c.media !== void 0 ? Oe(c.media) : null;
        if (A && !A.ok) throw new X("invalid_operation_plan", 400, `${v} media ${A.message}`, { operation: $ });
        const Y = A ? yn : void 0, M = c.width ?? Y?.width ?? l?.width ?? _?.width ?? (T ? 150 : N ? Math.round(N >= 1 ? 180 : 180 * N) : 180), L = c.height ?? Y?.height ?? l?.height ?? _?.height ?? (T ? 130 : N ? Math.round(N >= 1 ? 180 / N : 180) : 110), O = f ?? Le(a, c.placement?.relativeTo), I = c.style?.backgroundColor || l?.style?.backgroundColor || O?.options.backgroundColor || "#7aa2c8", { points: P, arrangement: j, gap: V } = Vn(a, c, M, L), W = new Set(nt(a).map(({ association: F }) => F.id)), H = new Set(a.nodes.map(x)), at = (c.ids || []).filter((F) => H.has(F));
        if (at.length && !n.replay) throw Rt(v, "note", at);
        const D = P.map((F, Lt) => c.ids?.[Lt] || i());
        S(D.filter((F) => !H.has(F)).length), f && E(W.size + D.filter((F) => !H.has(F)).length, D.length), P.forEach(({ x: F, y: Lt }, Jt) => {
          const J = D[Jt];
          if (m.matched.push(J), H.has(J)) return;
          const Qt = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${Jt + 1}`) : c.text : "", bt = f ? zt(f.options) : void 0;
          if (bt) for (const tt of Jn) delete bt[tt];
          const ot = bt ? { ...bt, id: J, name: J, text: Qt, width: M, height: L } : {
            id: J,
            name: J,
            text: Qt,
            defaultShaped: !0,
            width: M,
            height: L,
            backgroundColor: I,
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
          b && C.shape.store(ot, b, o), C.x.store(ot, F, o), C.y.store(ot, Lt, o), f || C.foregroundColor.store(ot, qn(I), o);
          for (const [tt, Mt] of Object.entries(l?.style || {})) C[tt].store(ot, Mt, o);
          for (const [tt, Mt] of Object.entries(c.style || {})) C[tt].store(ot, Mt, o);
          if (A?.ok && On(ot, A.media), a.nodes.push({ options: ot, relationships: { associations: [] } }), m.changed.push(J), r.created.push(J), f) {
            const tt = Ct(W, ft(x(f), J));
            W.add(tt), f.relationships.associations.push({ id: tt, parentId: x(f), childId: J, ...At }), r.connected.push(tt);
          }
        });
        const { placement: lo, ...Te } = c;
        p.push({
          ...Te,
          ids: D,
          x: P[0].x,
          y: P[0].y,
          placement: { arrangement: j, gap: V, ...f ? { relativeTo: x(f), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = et(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || k();
        const u = [];
        for (const f of l) {
          if (f.options.isLocked === !0 && c.changes.locked !== !1) {
            y(f);
            continue;
          }
          const b = JSON.stringify(f.options);
          for (const [_, T] of Object.entries(c.changes))
            yt[_] || C[_].store(f.options, T, o);
          Qn(f.options, c.changes), u.push(x(f)), JSON.stringify(f.options) !== b && m.changed.push(x(f));
        }
        if (c.changes.order && u.length) {
          const f = new Set(u), b = a.nodes.map(x), _ = a.nodes.filter((N) => f.has(x(N))), T = a.nodes.filter((N) => !f.has(x(N)));
          a.nodes = c.changes.order === "front" ? [...T, ..._] : [..._, ...T], a.nodes.forEach((N, A) => {
            const Y = x(N);
            f.has(Y) && b[A] !== Y && !m.changed.includes(Y) && m.changed.push(Y);
          });
        }
        r.updated.push(...u), u.length && p.push({ kind: "update_nodes", target: { ids: u }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const l = et(a, c.target, `${v} target`);
        if (m.matched = l.map(x), l.length || k(), !c.target.ids && a.nodes.length > 1 && l.length === a.nodes.length && !Ie.test(n.userMessage || ""))
          throw new X("invalid_operation_plan", 400, `${v} cannot delete every note without an explicit request.`);
        const f = /* @__PURE__ */ new Set();
        for (const b of l)
          b.options.isLocked === !0 ? y(b) : f.add(x(b));
        a.nodes = a.nodes.filter((b) => !f.has(x(b)));
        for (const b of a.nodes)
          b.relationships.associations = b.relationships.associations.filter(
            (_) => !f.has(_.parentId) && !f.has(_.childId)
          );
        m.changed = [...f], r.deleted.push(...f), f.size && p.push({ kind: "delete_nodes", target: { ids: [...f] } });
        return;
      }
      case "duplicate_nodes": {
        const l = et(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || k();
        const u = c.offset ?? tn, f = new Set(a.nodes.map(x)), b = (c.ids || []).filter((M) => f.has(M));
        if (b.length && !n.replay) throw Rt(v, "note", b);
        const _ = l.map((M, L) => c.ids?.[L] || i());
        S(_.filter((M) => !f.has(M)).length);
        for (const M of l) {
          const L = q(M, "x") + u.x, O = q(M, "y") + u.y;
          if (Math.abs(L) > xt || Math.abs(O) > xt)
            throw new X(
              "invalid_operation_plan",
              400,
              `${v} would put the copy of ${x(M)} at ${L}, ${O}; a note's position must be from -${xt} to ${xt}.`
            );
        }
        const T = new Map(l.map((M, L) => [x(M), _[L]])), N = /* @__PURE__ */ new Map();
        l.forEach((M, L) => {
          const O = _[L];
          if (f.has(O)) return;
          const I = { options: { ...zt(M.options), id: O, name: O }, relationships: { associations: [] } };
          C.x.store(I.options, q(M, "x") + u.x, o), C.y.store(I.options, q(M, "y") + u.y, o), a.nodes.push(I), N.set(O, I), m.changed.push(O), r.created.push(O);
        });
        const A = new Set(nt(a).map(({ association: M }) => M.id));
        let Y = 0;
        for (const M of l) {
          const L = N.get(T.get(x(M)));
          if (L)
            for (const O of M.relationships.associations) {
              const I = T.get(O.childId);
              if (!I || st(O)) continue;
              const P = Ct(A, ft(x(L), I));
              A.add(P), L.relationships.associations.push({ ...zt(O), id: P, parentId: x(L), childId: I }), r.connected.push(P), Y += 1;
            }
        }
        E(A.size, Y), l.length && p.push({ kind: "duplicate_nodes", target: { ids: l.map(x) }, ids: _, offset: { ...u } });
        return;
      }
      case "connect_nodes": {
        const l = et(a, c.from, `${v} from`), u = c.to?.point, f = u ? [] : et(a, c.to, `${v} to`);
        (!l.length || !u && !f.length) && k();
        const b = l.length * (u ? 1 : f.length);
        if (b > s.connectorsPerOperation)
          throw new X(
            "connector_limit",
            422,
            `${v} would join ${b} pairs of notes; one operation may join at most ${s.connectorsPerOperation}.`,
            { limit: s.connectorsPerOperation }
          );
        const _ = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Map();
        for (const { association: L } of nt(a)) {
          _.add(L.id);
          const O = jt(L.parentId, L.childId);
          T.has(O) || T.set(O, L.id);
        }
        const N = [], A = [], Y = [];
        let M = 0;
        for (const L of l) {
          const O = x(L), I = u ? [null] : f.filter((P) => x(P) !== O);
          if (L.options.isLocked === !0) {
            I.length && y(L), M += I.length;
            continue;
          }
          I.length && Y.push(O);
          for (const P of I) {
            const j = c.ids?.[M];
            if (M += 1, !P) {
              const at = Zn(j, i), D = at.id ?? ft(O, at.childId);
              if (_.has(D)) {
                n.replay || N.push(D), A.push(D), m.matched.push(D);
                continue;
              }
              L.relationships.associations.push({ id: D, parentId: O, childId: at.childId, targetPoint: { ...u }, ...At, ...c.style || {} }), _.add(D), A.push(D), m.matched.push(D), m.changed.push(D), r.connected.push(D);
              continue;
            }
            const V = x(P), W = T.get(jt(O, V));
            if (W) {
              A.push(W), m.matched.push(W);
              continue;
            }
            if (j && _.has(j)) {
              n.replay || N.push(j), A.push(j), m.matched.push(j);
              continue;
            }
            const H = j || Ct(_, ft(O, V));
            L.relationships.associations.push({ id: H, parentId: O, childId: V, ...At, ...c.style || {} }), _.add(H), T.set(jt(O, V), H), A.push(H), m.matched.push(H), m.changed.push(H), r.connected.push(H);
          }
        }
        if (N.length) throw Rt(v, "connector", N);
        if (_.size > s.connectorsPerSlate && m.changed.length)
          throw new X(
            "connector_limit",
            422,
            `A slate can hold at most ${s.connectorsPerSlate} connectors; this plan would leave ${_.size}.`,
            { limit: s.connectorsPerSlate }
          );
        m.changed.length && p.push({
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
        if (m.matched = l.map(({ association: u }) => u.id), l.length || r.warnings.push(`${v} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: u, association: f } of l)
            u.relationships.associations = u.relationships.associations.filter((b) => b !== f);
          m.changed = [...m.matched], r.disconnected.push(...m.matched), l.length && p.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { node: u, association: f } of l) {
          const b = JSON.stringify([x(u), f]), _ = Object.entries(c.changes).filter(([N]) => !Gt.includes(N));
          for (const [N, A] of _) f[it[N].field || N] = A;
          const T = Rn(a, u, f, c.changes, v, i);
          JSON.stringify([x(T), f]) !== b && m.changed.push(f.id);
        }
        r.connectionsUpdated.push(...m.matched), l.length && p.push({ kind: "update_connections", connectionIds: m.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const l = et(a, c.target, `${v} target`);
        m.matched = l.map(x), l.length || k();
        const u = l.filter((O) => O.options.isLocked !== !0 ? !0 : (y(O), !1));
        if (!u.length) return;
        const f = c.layout;
        let b;
        if (he[f]) b = Yn(he[f], u.map(ct));
        else if (f === "distribute-horizontal" || f === "distribute-vertical")
          b = Dn(f === "distribute-horizontal" ? "horizontal" : "vertical", u.map(ct));
        else if (f === "tidy") {
          const O = new Set(u.map(x)), I = a.nodes.filter((P) => !O.has(x(P))).map(ct);
          b = Hn(u.map(ct), I, { gap: c.gap ?? 20 });
        } else if (f === "tree") {
          const O = nt(a).filter(({ association: j }) => !st(j)).map(({ association: j }) => [j.parentId, j.childId]), I = new Set(u.map(x)), P = a.nodes.filter((j) => !I.has(x(j))).map(ct);
          b = Wn(u.map(ct), O, { gap: c.gap ?? 48, obstacles: P });
        }
        if (b) {
          const O = new Map(u.map((I) => [x(I), I]));
          for (const I of b) {
            const P = O.get(I.id), j = [q(P, "x"), q(P, "y")];
            C.x.store(P.options, I.x, o), C.y.store(P.options, I.y, o), le(j, [I.x, I.y]) || m.changed.push(I.id);
          }
          r.updated.push(...u.map(x)), p.push({ kind: "arrange_nodes", target: { ids: u.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const _ = u.map(K), T = c.gap ?? 48, N = Math.min(..._.map((O) => O.x)), A = Math.min(..._.map((O) => O.y)), Y = Math.max(..._.map((O) => O.width), 120), M = Math.max(..._.map((O) => O.height), 80), L = Ht(u.length, c.layout === "circle" ? "row" : c.layout);
        u.forEach((O, I) => {
          const P = [q(O, "x"), q(O, "y")];
          let j, V;
          if (c.layout === "circle") {
            const W = Math.max(180, u.length * 35), H = Math.PI * 2 * I / u.length;
            j = N + W + Math.cos(H) * W, V = A + W + Math.sin(H) * W;
          } else
            j = N + L[I].column * (Y + T), V = A + L[I].row * (M + T);
          C.x.store(O.options, j, o), C.y.store(O.options, V, o), le(P, [j, V]) || m.changed.push(x(O));
        }), r.updated.push(...u.map(x)), p.push({ kind: "arrange_nodes", target: { ids: u.map(x) }, layout: c.layout, ...c.gap !== void 0 ? { gap: T } : {} });
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
  }), n.requireMatches && r.warnings.length) {
    const c = r.warnings[0];
    throw new X("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return r.unchanged = JSON.stringify(a) === g, { slate: a, materializedPlan: { message: e.message.trim(), operations: p }, report: r };
}
function Qn(t, e) {
  const n = e.shape;
  if (!n || typeof n != "object" || t.shape !== "custom" || e.width !== void 0 && e.height !== void 0) return;
  const o = Me(n);
  if (!o) return;
  const s = (i) => Math.round(Math.min(5e3, Math.max(20, i)));
  e.height !== void 0 ? t.width = s(Number(t.height) * o) : t.height = s(Number(t.width || 180) / o);
}
function Me(t) {
  const e = Xt(t);
  return e.ok && e.shape.aspect > 0 ? Math.min(10, Math.max(0.1, e.shape.aspect)) : 0;
}
const ue = ["id", ...Object.keys(C), "image", "media", "styleRole"], vt = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), gt = (t) => t.options.isComment === !0;
function Ne(t, e) {
  const n = t.options, o = (i) => !e || e.includes(i), s = { id: x(t) };
  for (const [i, a] of Object.entries(C)) {
    if (!o(i)) continue;
    const h = a.read(n);
    s[i] = h === void 0 ? null : h;
  }
  return o("image") && (s.image = n.image || null), o("media") && (s.media = In(n)), o("styleRole") && (s.styleRole = typeof n.styleRole == "string" ? n.styleRole : null), s;
}
function Ae(t) {
  const e = st(t), n = { id: t.id, from: t.parentId, to: e ? null : t.childId };
  for (const [s, i] of Object.entries(it)) {
    if (Gt.includes(s)) continue;
    const a = t[i.field ?? s];
    n[s] = a === void 0 ? null : a;
  }
  e && (n.toPoint = t.targetPoint ?? null);
  const o = zn(t);
  return (o.fromEnd !== "follow" || o.toEnd !== "follow") && Object.assign(n, o), n;
}
const ut = (t) => new X("invalid_selection", 400, t);
function to(t) {
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
const eo = (t) => btoa(encodeURIComponent(JSON.stringify(t))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function no(t) {
  try {
    const { after: e, at: n } = JSON.parse(decodeURIComponent(atob(t.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof e == "string" && e && Number.isSafeInteger(n) && n >= 0) return { after: e, at: n };
  } catch {
  }
  throw ut("cursor is not one this slate gave. Read again from the first page.");
}
function oo(t, { after: e, at: n }) {
  let o = -1;
  if (t.forEach((s, i) => {
    x(s) === e && (o < 0 || Math.abs(i - n) < Math.abs(o - n)) && (o = i);
  }), o < 0) throw ut("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function so(t) {
  if (!t.length) return null;
  const e = t.map(K), n = Math.min(...e.map((a) => a.x)), o = Math.min(...e.map((a) => a.y)), s = Math.max(...e.map((a) => a.x + a.width)), i = Math.max(...e.map((a) => a.y + a.height));
  return { x: n, y: o, width: s - n, height: i - o };
}
function bo(t, e = {}) {
  const n = Et(t), o = n.nodes.filter((k) => !gt(k)), s = e.fields;
  if (s !== void 0) {
    const k = s.filter((y) => !ue.includes(y));
    if (k.length) throw ut(`Unknown note field: ${k.join(", ")}. Choose from ${ue.join(", ")}.`);
  }
  const i = e.limit ?? vt.notes;
  if (!Number.isInteger(i) || i < 1 || i > vt.maxNotes)
    throw ut(`limit must be a whole number from 1 to ${vt.maxNotes}.`);
  const a = e.maxChars ?? vt.maxChars, h = to(e), g = h ? et({ ...n, nodes: o }, h, "selection") : o;
  let w = 0;
  e.cursor !== void 0 && (w = oo(g, no(e.cursor)));
  const p = new Set(n.nodes.filter(gt).map(x)), r = /* @__PURE__ */ new Map();
  for (const { association: k } of nt(n)) {
    if (p.has(k.parentId) || p.has(k.childId)) continue;
    const y = r.get(k.parentId) ?? [];
    y.push(k), r.set(k.parentId, y);
  }
  const c = [], d = [];
  let $ = 0, v = w;
  for (; v < g.length && c.length < i; v += 1) {
    const k = g[v], y = Ne(k, s), S = (r.get(x(k)) ?? []).map(Ae), E = JSON.stringify(y).length + JSON.stringify(S).length;
    if (c.length && $ + E > a) break;
    $ += E, c.push(y), d.push(...S);
  }
  const m = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: pn(n.options.containerStyle),
    style: n.options.style && typeof n.options.style == "object" ? n.options.style : null,
    bounds: so(o),
    nodeCount: g.length,
    nodes: c,
    connections: d,
    nextCursor: v < g.length && m ? eo({ after: m.id, at: v - 1 }) : null
  };
}
const io = [
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
function wo(t) {
  const e = Et(t), n = new Set(e.nodes.filter(gt).map(x)), o = {};
  for (const i of io) e.options[i] !== void 0 && (o[i] = e.options[i]);
  const s = e.nodes.filter((i) => !n.has(x(i))).map((i) => ({
    options: i.options,
    relationships: {
      ...i.relationships,
      associations: i.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: o, nodes: s, shareId: `${t?.shareId ?? e.options.shareId ?? ""}` };
}
const ro = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"], ao = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function xo(t) {
  const e = Et(t), n = e.nodes.filter((a) => !gt(a)), o = new Set(e.nodes.filter(gt).map((a) => a.options.id)), s = n.slice(0, 150).map((a) => {
    const h = Ne(a, ro);
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
  }), i = nt(e).filter(({ association: a }) => !o.has(a.parentId) && !o.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const h = Ae(a);
    return {
      id: h.id,
      from: h.from,
      to: h.to,
      ..."toPoint" in h ? { toPoint: h.toPoint } : {},
      // Whether each end follows its note, is pinned to a spot on its edge, or is free.
      ..."fromEnd" in h ? { fromEnd: h.fromEnd, toEnd: h.toEnd } : {},
      label: h.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(ao.map((g) => [g, h[g] ?? void 0]))
    };
  });
  return {
    name: e.options.name || "",
    description: e.options.description || "",
    nodeCount: n.length,
    nodes: s,
    connections: i
  };
}
function vo(t = {}) {
  const e = It(t), n = (o, s) => Object.fromEntries(Object.entries(o).map(([i, a]) => [i, { ...Z(s(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(kt.map((o) => [o, { fields: Ft[o].filter((s) => s !== "kind") }])),
    noteKeys: { ...n(C, (o) => o.spec(e)), ...n(yt, (o) => o.spec) },
    noteStyleKeys: [...Wt],
    connectorKeys: n(it, (o) => o.spec),
    connectorStyleKeys: [...Kt],
    slateKeys: Object.fromEntries(
      Object.entries(ht).map(([o, s]) => [
        o,
        { ...o === "background" ? we() : o === "style" ? be() : Z(s.spec), description: s.description }
      ])
    ),
    selector: xe(),
    layouts: [...Ut],
    presets: [...qt],
    limits: _t(t),
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
function co(t = {}, e = {}) {
  const n = It(t), o = _t(t), s = (r) => {
    const c = Z(C[r].spec(n));
    return e.modelTool ? Xe(c) : c;
  }, i = (r) => Object.fromEntries(r.map((c) => [c, s(c)])), a = (r) => Object.fromEntries(r.map((c) => [c, { ...s(c), description: C[c].description }])), h = (r) => Object.fromEntries(r.map((c) => [c, Z(it[c].spec)])), g = xe(), w = { type: "array", items: { type: "string" } }, p = kt.map((r) => `${r}: ${Ft[r].filter((c) => c !== "kind").join(", ")}`).join("; ");
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
            kind: { type: "string", enum: [...kt] },
            count: { type: "integer", minimum: 1, maximum: o.notesPerAdd },
            ...i(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...qt],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...w, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: w,
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...Z({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
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
              properties: { ...i(Wt), ...h(Kt) }
            },
            target: g,
            from: g,
            to: {
              ...g,
              description: `${g.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...g.properties, point: Z({ type: "point" }) }
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
                ...Object.fromEntries(Object.entries(yt).map(([r, c]) => [r, Z(c.spec)])),
                ...h(Object.keys(it)),
                ...Object.fromEntries(
                  Object.entries(ht).map(([r, c]) => [r, r === "background" ? we() : r === "style" ? be() : Z(c.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
const $o = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: co({}, { modelTool: !0 })
});
function ko(t) {
  return `Call applySlateOperations again with a safe, valid plan. ${t.join(" ")}`;
}
function So(t) {
  if (typeof t?.message == "string" && t.message.trim()) return t.message.trim();
  const e = (t?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${e} ${e === 1 ? "change" : "changes"} to the slate.`;
}
export {
  We as BORDER_STYLES,
  it as CONNECTOR_KEYS,
  Kt as CONNECTOR_STYLE_KEYS,
  nn as DEFAULT_FONTS,
  io as DOCUMENT_OPTION_KEYS,
  Fe as EFFECTS,
  Ut as LAYOUTS,
  en as LIMITS,
  po as MEDIA_FRAME_ORIGINS,
  gn as MEDIA_HOST_NAMES,
  G as MEDIA_LIMITS,
  yn as MEDIA_NOTE_SIZE,
  ve as MEDIA_PROVIDERS,
  yt as NODE_INTENT_KEYS,
  C as NODE_KEYS,
  Wt as NODE_STYLE_KEYS,
  ue as NOTE_READ_KEYS,
  Ft as OPERATION_FIELDS,
  X as OperationPlanError,
  qt as PRESETS,
  vt as READ_LIMITS,
  ht as SLATE_KEYS,
  kt as SLATE_OPERATION_KINDS,
  $o as SLATE_OPERATION_TOOL,
  Yn as alignPositions,
  yo as applyPlanToJSON,
  pn as backgroundOf,
  _t as contractLimits,
  It as contractLists,
  vo as describeOperations,
  Dn as distributePositions,
  fo as isMediaUrl,
  mo as mediaEmbedUrl,
  go as mediaLabel,
  So as naturalOperationFallback,
  ko as operationPlanRetryPrompt,
  Se as parseMediaUrl,
  Vt as parseStart,
  Ae as readConnector,
  In as readMedia,
  Oe as readMediaValue,
  Ne as readNote,
  bo as readSlate,
  Ee as rotatedBounds,
  co as slateOperationPlanSchema,
  xo as summarizeSlate,
  Hn as tidyPositions,
  wo as toSlateDocument,
  Et as toStoredSlate,
  Wn as treePositions,
  En as validatePlan
};
