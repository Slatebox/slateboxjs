import { N as pe } from "./NoteDefaults-1xFW0br8.mjs";
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
function fe() {
  return Array.from(B.keys());
}
const it = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", me = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${it}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${it}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${it}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${it}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${it}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${it}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${it}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
function ge() {
  return { ...me };
}
function R(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
const ye = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, be = /^https?:\/\/[^\s]+$/i, te = 2e3, we = /^[A-Za-z0-9_-]{1,64}$/;
function Tt(t, e) {
  if (typeof e != "string") return;
  const n = e.trim().toLowerCase();
  return t.find((o) => o.toLowerCase() === n);
}
function j(t, e, n) {
  switch (t.type) {
    case "string":
      return e === null && t.nullable ? null : typeof e != "string" ? `${n} must be a string.` : e.length > t.maxLength ? `${n} must be at most ${t.maxLength} characters.` : t.minLength && e.trim().length < t.minLength ? `${n} must not be empty.` : null;
    case "number":
      return typeof e != "number" || !Number.isFinite(e) || e < t.min || e > t.max ? `${n} must be a number from ${t.min} to ${t.max}.` : null;
    case "boolean":
      return typeof e == "boolean" ? null : `${n} must be true or false.`;
    case "enum":
      return e === null && t.nullable || (t.caseless ? Tt(t.values, e) : t.values.find((s) => s === e)) !== void 0 ? null : `${n} must be one of: ${t.values.join(", ")}.`;
    case "color":
      return typeof e == "string" && ye.test(e.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return R(e) && Object.keys(e).every((o) => o === "x" || o === "y") && [e.x, e.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return R(e) ? null : `${n} must be an object.`;
    case "url":
      return e === null && t.nullable || typeof e == "string" && e.length <= te && be.test(e.trim()) ? null : `${n} must be an http or https address${t.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return e === null && t.nullable || typeof e == "string" && we.test(e) ? null : `${n} must be 1 to 64 letters, digits, _ or -${t.nullable ? ", or null" : ""}.`;
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
        maxLength: te,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: t.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
const q = (t) => ({
  store: (e, n) => {
    e[t] = n;
  },
  read: (e) => e[t]
}), xe = ["solid", "dashed", "dotted", "combo"], ke = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), ve = ["front", "back"], $e = ["left", "middle", "right"], _e = ["top", "middle", "bottom"], L = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...q("text") },
  shape: {
    spec: (t) => ({ type: "enum", values: t.shapes, caseless: !0 }),
    description: "A shape registered with the engine.",
    store: (t, e, n) => {
      const o = Tt(n.shapes, e);
      t.shape = o, t.vectorPath = o, t.shapeHint = o;
    },
    read: (t) => t.shape || t.shapeHint || t.vectorPath || "rectangle"
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
  width: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Width in canvas units.", ...q("width") },
  height: { spec: () => ({ type: "number", min: 20, max: 5e3 }), description: "Height in canvas units.", ...q("height") },
  rotationAngle: {
    spec: () => ({ type: "number", min: -360, max: 360 }),
    description: "Rotation in degrees.",
    store: (t, e) => {
      t.rotate = { ...t.rotate || {}, rotationAngle: e }, delete t.rotationAngle;
    },
    read: (t) => Number(t.rotate?.rotationAngle ?? 0)
  },
  backgroundColor: { spec: () => ({ type: "color" }), description: "Fill colour.", ...q("backgroundColor") },
  foregroundColor: {
    spec: () => ({ type: "color" }),
    description: "Text colour.",
    store: (t, e) => {
      t.foregroundColor = e, t.fontColor = e;
    },
    read: (t) => t.fontColor ?? t.foregroundColor
  },
  borderColor: { spec: () => ({ type: "color" }), description: "Border colour.", ...q("borderColor") },
  borderWidth: { spec: () => ({ type: "number", min: 0, max: 100 }), description: "Border width.", ...q("borderWidth") },
  borderOpacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Border opacity from 0 to 1.", ...q("borderOpacity") },
  borderStyle: {
    spec: () => ({ type: "enum", values: xe }),
    description: "Border line style.",
    ...q("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...q("opacity") },
  fontFamily: {
    spec: (t) => ({ type: "enum", values: t.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (t, e, n) => {
      t.fontFamily = Tt(n.fonts, e);
    },
    read: (t) => t.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...q("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: $e }), description: "Horizontal text alignment.", ...q("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: _e }), description: "Vertical text alignment.", ...q("textYAlign") },
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
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (t, e) => {
      t.isLocked = e;
    },
    read: (t) => t.isLocked === !0
  }
}, mt = {
  order: {
    spec: { type: "enum", values: ve },
    description: "Bring the note to the front or send it to the back."
  }
}, Ie = [...Object.keys(L), ...Object.keys(mt)], Oe = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), jt = Object.keys(L).filter((t) => !Oe.has(t)), xt = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Yt = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, ee = ["left", "right", "above", "below", "center"], ne = ["row", "column", "grid"], Se = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], Ee = ["distribute-horizontal", "distribute-vertical"], Rt = ["row", "column", "grid", "circle", ...Se, ...Ee, "tidy", "tree"], zt = ["text", "sticky"], Me = 75, Ne = Object.freeze({ x: 20, y: 20 }), Pe = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), Wt = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, Ht = 200, Ae = Object.freeze([
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
function $t(t = {}) {
  return {
    shapes: [...t.shapes ?? fe()],
    fonts: [...t.fonts ?? Ae],
    animations: Object.keys(ge()),
    effects: [...ke]
  };
}
function _t(t = {}) {
  return { ...Pe, ...t.limits || {} };
}
class W extends Error {
  constructor(e, n, o, s) {
    super(o), this.name = "OperationPlanError", this.code = e, this.status = n, s && (this.details = s);
  }
}
const Le = ["bezier", "orthogonal", "straight", "linear", "curved"], Te = ["cubic", "quadratic"], Ce = ["follow", "pinned"], qt = ["follow", "pinned", "top", "right", "bottom", "left"], ot = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: Le }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: Te }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: Ce },
    description: "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge that faces the line's other end, where a following end sits)."
  },
  fromEnd: {
    spec: { type: "enum", values: qt },
    description: "The starting end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side."
  },
  toEnd: {
    spec: { type: "enum", values: qt },
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
}, Bt = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"], Dt = Object.keys(ot).filter((t) => !Bt.includes(t)), St = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, pt = "__free_", oe = ["linear", "radial"], se = ["horizontal", "vertical", "diagonal"], yt = (t) => ({
  store: (e, n) => {
    e.options[t] = n;
  }
}), Gt = (t) => ({
  store: (e, n) => {
    e.options.viewPort = { ...e.options.viewPort || {}, [t]: n };
  }
}), dt = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...yt("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...yt("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (t, e) => {
      const n = { ...t.options.containerStyle || {}, ...Ye(e) };
      delete n.backgroundImage, delete n.backgroundEffect, t.options.containerStyle = n;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: a theme colours notes by their depth in the connected tree.",
    ...yt("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...yt("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...Gt("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...Gt("snapToObjects") },
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
function je(t, e) {
  if (!R(t)) return [`${e} must be an object {color, gradient?}.`];
  const n = [];
  for (const s of Object.keys(t))
    s !== "color" && s !== "gradient" && n.push(`${e} has an unknown field: ${s}.`);
  const o = j({ type: "color" }, t.color, `${e}.color`);
  if (o && n.push(o), t.gradient !== void 0) {
    const s = t.gradient;
    if (!R(s)) return [...n, `${e}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(s))
      ["type", "colors", "direction"].includes(a) || n.push(`${e}.gradient has an unknown field: ${a}.`);
    const i = j({ type: "enum", values: oe }, s.type, `${e}.gradient.type`);
    if (i && n.push(i), s.direction !== void 0) {
      const a = j({ type: "enum", values: se }, s.direction, `${e}.gradient.direction`);
      a && n.push(a);
    }
    !Array.isArray(s.colors) || s.colors.length < 2 || s.colors.length > 8 ? n.push(`${e}.gradient.colors must list 2 to 8 colours.`) : s.colors.forEach((a, u) => {
      const y = j({ type: "color" }, a, `${e}.gradient.colors[${u}]`);
      y && n.push(y);
    });
  }
  return n;
}
function Ye(t) {
  return {
    backgroundColor: t.color,
    backgroundColorAsGradient: !!t.gradient,
    backgroundGradientType: t.gradient?.type ?? "linear",
    backgroundGradientColors: t.gradient?.colors ?? [],
    backgroundGradientStrategy: t.gradient?.direction ?? "horizontal"
  };
}
function ie() {
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
          type: { type: "string", enum: [...oe] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: Z({ type: "color" }) },
          direction: { type: "string", enum: [...se] }
        }
      }
    }
  };
}
function Re(t) {
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
const ze = ["ids", "text", "match", "all", "within", "groupId"], Be = ["ids", "text", "within", "groupId"];
function at(t, e) {
  if (!R(t)) return [`${e} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const s of Object.keys(t))
    ze.includes(s) || n.push(`${e} has an unknown field: ${s}.`);
  const o = Be.filter((s) => t[s] !== void 0);
  if (o.length > 1 && n.push(`${e} must name notes one way, not by ${o.join(" and ")}.`), !o.length && t.all !== !0 && n.push(`${e} must name notes by ids, text, within, groupId or all: true.`), t.ids !== void 0 && (!Array.isArray(t.ids) || !t.ids.length || t.ids.some((s) => typeof s != "string" || !s)) && n.push(`${e}.ids must be a list of note ids.`), t.text !== void 0 && (typeof t.text != "string" || !t.text.trim()) && n.push(`${e}.text must be the text of a note.`), t.match !== void 0) {
    t.text === void 0 && n.push(`${e}.match goes with text.`);
    const s = j({ type: "enum", values: ["exact", "contains"] }, t.match, `${e}.match`);
    s && n.push(s);
  }
  if (t.all !== void 0 && t.all !== !0 && n.push(`${e}.all must be true when given.`), t.groupId !== void 0 && (typeof t.groupId != "string" || !t.groupId) && n.push(`${e}.groupId must be a group id.`), t.within !== void 0) {
    const s = t.within;
    R(s) && Object.keys(s).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof s[a] == "number" && Number.isFinite(s[a])) && s.width > 0 && s.height > 0 || n.push(`${e}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function re() {
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
const De = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, ae = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function ht(t, e, n, o, s, { required: i = !0, plural: a = `${o}s` } = {}) {
  const u = [];
  if (t === void 0 && !i) return u;
  if (!R(t) || i && !Object.keys(t).length)
    return [i ? `${n} requires at least one ${o}.` : `${n} ${a} must be an object.`];
  const y = Object.keys(t).filter((w) => !e.includes(w));
  y.length && u.push(`${n} contains unsupported ${a}: ${y.join(", ")}.`);
  for (const [w, f] of Object.entries(t))
    e.includes(w) && s(w, f, u);
  return u;
}
function Ut(t, e) {
  return (n, o, s) => {
    const i = mt[n]?.spec ?? L[n].spec(t), a = j(i, o, `${e} ${n}`);
    a && s.push(a);
  };
}
function Kt(t) {
  return (e, n, o) => {
    const s = j(ot[e].spec, n, `${t} ${e}`);
    s && o.push(s);
  };
}
function J(t) {
  return Array.isArray(t) && t.length > 0 && t.every((e) => typeof e == "string" && e.length > 0);
}
function Xe(t, e = {}) {
  const n = $t(e), o = _t(e), s = e.userMessage || "";
  if (!R(t)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const i = [];
  for (const r of Object.keys(t))
    r !== "message" && r !== "operations" && i.push(`The plan has an unknown field: ${r}.`);
  (typeof t.message != "string" || !t.message.trim()) && i.push("A natural completion message is required."), !Array.isArray(t.operations) || t.operations.length === 0 ? i.push("At least one slate operation is required.") : t.operations.length > o.operationsPerPlan && i.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const a = !!e.existingNodeIds?.length, u = new Set((e.existingNodeIds || []).filter(Boolean)), y = !!e.existingConnectionIds?.length, w = new Set((e.existingConnectionIds || []).filter(Boolean)), f = (r, d) => {
    a && R(r) && Array.isArray(r.ids) && r.ids.some((c) => !u.has(c)) && i.push(`${d} references notes that are not in the slate.`);
  };
  return (Array.isArray(t.operations) ? t.operations : []).forEach((r, d) => {
    const c = `Operation ${d + 1}`;
    if (!R(r) || !xt.includes(r.kind)) {
      i.push(`${c} has an unsupported kind.`);
      return;
    }
    const $ = Yt[r.kind], v = Object.keys(r).filter((m) => !$.includes(m));
    for (const m of v) i.push(`${c} has an unknown field: ${m}.`);
    switch (r.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(r.count) || r.count < 1 || r.count > o.notesPerAdd) && i.push(`${c} count must be an integer from 1 to ${o.notesPerAdd}.`), r.preset !== void 0) {
          const g = j({ type: "enum", values: zt }, r.preset, `${c} preset`);
          g && i.push(g);
        }
        const m = R(r.placement) && r.placement.connect === !0;
        if (r.shape !== void 0 || r.preset === void 0 && !m) {
          const g = j(L.shape.spec(n), r.shape, `${c} shape`);
          g && i.push(g);
        }
        for (const g of ["text", "width", "height"]) {
          if (r[g] === void 0) continue;
          const I = j(L[g].spec(n), r[g], `${c} ${g}`);
          I && i.push(I);
        }
        r.x === void 0 != (r.y === void 0) && i.push(`${c} needs both x and y, or neither.`);
        for (const g of ["x", "y"]) {
          if (r[g] === void 0) continue;
          const I = j(L[g].spec(n), r[g], `${c} ${g}`);
          I && i.push(I);
        }
        r.ids !== void 0 && (!J(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${c} ids must be a list of different note ids.`) : r.ids.some((g) => !Wt.test(g)) ? i.push(`${c} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(r.count) && r.ids.length > r.count && i.push(`${c} has more ids than notes to add.`));
        const b = r.placement;
        if (b !== void 0)
          if (!R(b))
            i.push(`${c} placement must be an object.`);
          else {
            const g = r.x !== void 0 ? ["arrangement", "gap", ...b.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const I of Object.keys(b))
              g.includes(I) || i.push(
                r.x !== void 0 && ["relativeTo", "direction", "connect"].includes(I) ? `${c} gives x and y, so placement cannot also give ${I}.` : `${c} placement has an unknown field: ${I}.`
              );
            b.connect !== void 0 && (typeof b.connect != "boolean" ? i.push(`${c} placement.connect must be true or false.`) : b.connect && (b.relativeTo === void 0 && i.push(`${c} placement.connect needs relativeTo, the note to copy and connect from.`), b.direction === "center" && i.push(`${c} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), b.relativeTo !== void 0 && typeof b.relativeTo != "string" ? i.push(`${c} placement.relativeTo must be a note id.`) : b.relativeTo && a && !u.has(b.relativeTo) && i.push(`${c} references a note that is not in the slate.`);
            for (const [I, X] of [["direction", ee], ["arrangement", ne]]) {
              if (b[I] === void 0) continue;
              const l = j({ type: "enum", values: X }, b[I], `${c} placement.${I}`);
              l && i.push(l);
            }
            if (b.gap !== void 0) {
              const I = j({ type: "number", min: 0, max: 2e3 }, b.gap, `${c} placement.gap`);
              I && i.push(I);
            }
          }
        i.push(...ht(r.style, jt, c, "node style", Ut(n, c), { required: !1 })), J(r.ids) && r.ids.forEach((g) => u.add(g));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = at(r.target, `${c} target`);
        if (i.push(...m), m.length || f(r.target, c), r.kind === "update_nodes" && i.push(...ht(r.changes, Ie, c, "node change", Ut(n, c), { plural: "changes" })), r.kind === "delete_nodes" && R(r.target) && r.target.all === !0 && Object.keys(r.target).length === 1 && !ae.test(s) && i.push(`${c} cannot delete every note without an explicit request.`), r.kind === "arrange_nodes") {
          const b = j({ type: "enum", values: Rt }, r.layout, `${c} layout`);
          if (b && i.push(b), r.gap !== void 0) {
            const g = j({ type: "number", min: 0, max: 2e3 }, r.gap, `${c} gap`);
            g && i.push(g);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = at(r.target, `${c} target`);
        if (i.push(...m), m.length || f(r.target, c), r.offset !== void 0) {
          const b = j({ type: "point" }, r.offset, `${c} offset`);
          b && i.push(b);
        }
        r.ids !== void 0 && (!J(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${c} ids must be a list of different note ids.`) : r.ids.some((b) => !Wt.test(b)) ? i.push(`${c} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : R(r.target) && J(r.target.ids) && r.ids.length > r.target.ids.length && i.push(`${c} has more ids than notes to copy.`)), J(r.ids) && r.ids.forEach((b) => u.add(b));
        return;
      }
      case "connect_nodes": {
        const m = at(r.from, `${c} from`);
        if (i.push(...m), m.length || f(r.from, c), R(r.to) && r.to.point !== void 0) {
          Object.keys(r.to).length !== 1 && i.push(`${c} to must be a note selector or {point}, not both.`);
          const I = j({ type: "point" }, r.to.point, `${c} to.point`);
          I && i.push(I);
        } else {
          const I = at(r.to, `${c} to`);
          i.push(...I), I.length || f(r.to, c);
        }
        r.ids !== void 0 && (!J(r.ids) || new Set(r.ids).size !== r.ids.length ? i.push(`${c} ids must be a list of different connector ids.`) : r.ids.some((I) => I.length > Ht) && i.push(`${c} connector ids can be at most ${Ht} characters.`)), i.push(...ht(r.style, Dt, c, "connection style", Kt(c), { required: !1 })), J(r.ids) && r.ids.forEach((I) => w.add(I));
        const b = r.from?.ids, g = r.to?.ids;
        J(b) && J(g) && b.forEach((I) => g.forEach((X) => w.add(`${I}->${X}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = r.connectionIds !== void 0, b = r.from !== void 0 || r.to !== void 0;
        if (m && b && i.push(`${c} names connectors by connectionIds or by from and to, not both.`), !m && !b && i.push(`${c} requires connectionIds or both from and to note selectors.`), m && (J(r.connectionIds) ? y && r.connectionIds.some((g) => !w.has(g)) && i.push(`${c} references connectors that are not in the slate.`) : i.push(`${c} connectionIds must be a list of connector ids.`)), b)
          for (const g of ["from", "to"]) {
            const I = at(r[g], `${c} ${g}`);
            i.push(...I), I.length || f(r[g], c);
          }
        if (r.kind === "update_connections") {
          i.push(...ht(r.changes, Object.keys(ot), c, "connection change", Kt(c)));
          const g = R(r.changes) ? r.changes : {};
          g.toNote !== void 0 && g.toPoint !== void 0 && i.push(`${c} moves the far end with toNote or toPoint, not both.`), g.fromNote !== void 0 && g.fromPoint !== void 0 && i.push(`${c} moves the starting end with fromNote or fromPoint, not both.`), g.ends !== void 0 && (g.fromEnd !== void 0 || g.toEnd !== void 0) && i.push(`${c} sets ends, or fromEnd and toEnd, not both.`), g.toPoint !== void 0 && g.toEnd !== void 0 && i.push(`${c} cannot pin a far end it leaves free (toPoint with toEnd).`), g.fromPoint !== void 0 && (g.toPoint !== void 0 || g.fromEnd !== void 0) && i.push(`${c} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        i.push(
          ...ht(r.changes, Object.keys(dt), c, "slate change", (m, b, g) => {
            if (m === "background") {
              g.push(...je(b, `${c} background`));
              return;
            }
            const I = j(dt[m].spec, b, `${c} ${m}`);
            I && g.push(I);
          })
        ), R(r.changes) && r.changes.background !== void 0 && !De.test(s) && i.push(`${c} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: i.length === 0, errors: i };
}
const k = (t) => t.options.id, G = (t, e) => L[e].read(t.options), U = (t) => ({
  x: G(t, "x"),
  y: G(t, "y"),
  width: Number(t.options.width ?? 120),
  height: Number(t.options.height ?? 80)
}), nt = (t) => !!t.targetPoint || `${t.childId || ""}`.startsWith(pt), ut = (t, e) => `${t}->${e}`;
function kt(t) {
  return JSON.parse(JSON.stringify(t ?? null));
}
function It(t) {
  const e = t?.nodes && !Array.isArray(t.nodes), n = e ? t.v2 ?? t : null, o = e ? {
    options: kt(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((s) => Fe(s?.v2 ?? s))
  } : kt(t || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((s) => {
    const i = s?.options ? s : { options: { ...s || {} }, relationships: s?.relationships };
    return i.options.relationships && delete i.options.relationships, i.relationships = { ...i.relationships || {}, associations: [...i.relationships?.associations || []] }, i.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = i.options.id), a.id || (a.id = ut(a.parentId, a.childId));
    }), i;
  }), o;
}
function Fe(t) {
  const e = kt(t.options || {});
  e.x !== void 0 && (e.xPos = e.x, delete e.x), e.y !== void 0 && (e.yPos = e.y, delete e.y), e.fontColor !== void 0 && e.foregroundColor === void 0 && (e.foregroundColor = e.fontColor);
  const n = typeof t.getRotation == "function" ? t.getRotation() : void 0;
  typeof n == "number" && (e.rotate = { ...e.rotate || {}, rotationAngle: n });
  const o = t.relationships, s = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: e,
    relationships: {
      associations: s.map(({ parent: i, child: a, ...u }) => kt(u))
    }
  };
}
function et(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const o of t.nodes)
    for (const s of o.relationships.associations)
      e.has(s.id) || (e.add(s.id), n.push({ node: o, association: s }));
  return n;
}
const Et = (t) => `${t ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function tt(t, e, n) {
  const o = t.nodes;
  if (e.ids)
    return e.ids.map((s) => o.find((i) => k(i) === s)).filter(Boolean);
  if (e.text !== void 0) {
    const s = Et(e.text), i = o.filter(
      (a) => e.match === "contains" ? Et(a.options.text).includes(s) : Et(a.options.text) === s
    );
    if (i.length > 1 && e.all !== !0)
      throw new W(
        "ambiguous_selector",
        400,
        `${n} "${e.text}" matches ${i.length} notes (${i.map(k).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: i.map((a) => ({ id: k(a), text: a.options.text ?? "" })) }
      );
    return i;
  }
  if (e.within) {
    const s = e.within;
    return o.filter((i) => {
      const a = U(i);
      return a.x >= s.x && a.y >= s.y && a.x + a.width <= s.x + s.width && a.y + a.height <= s.y + s.height;
    });
  }
  return e.groupId !== void 0 ? o.filter((s) => s.options.groupId === e.groupId) : e.all === !0 ? [...o] : [];
}
const ct = (t) => Math.round(t * 1e4) / 1e4, Jt = (t) => Math.max(0, Math.min(1, t));
function We(t) {
  const e = Jt(t.x), n = Jt(t.y), o = [e, 1 - e, n, 1 - n], s = Math.min(...o);
  return s === o[0] ? { x: 0, y: ct(n) } : s === o[1] ? { x: 1, y: ct(n) } : s === o[2] ? { x: ct(e), y: 0 } : { x: ct(e), y: 1 };
}
function He(t) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[t];
}
function ce(t, e, n) {
  if (!n) return { ...t };
  const o = n * Math.PI / 180, s = t.x - e.x, i = t.y - e.y;
  return { x: e.x + s * Math.cos(o) - i * Math.sin(o), y: e.y + s * Math.sin(o) + i * Math.cos(o) };
}
function qe(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = ce(e, n, -(t.rotation || 0));
  return { x: (o.x - t.x) / (t.width || 1), y: (o.y - t.y) / (t.height || 1) };
}
function Ge(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = ce({ x: t.x + e.x * t.width, y: t.y + e.y * t.height }, n, t.rotation || 0);
  return { x: ct(o.x), y: ct(o.y) };
}
function Ue(t, e) {
  const n = qe(t, e), o = (n.x - 0.5) * (t.width || 1), s = (n.y - 0.5) * (t.height || 1);
  if (Math.abs(o) < 1e-9 && Math.abs(s) < 1e-9) return { x: 0.5, y: 0 };
  const i = o !== 0 ? t.width / 2 / Math.abs(o) : 1 / 0, a = s !== 0 ? t.height / 2 / Math.abs(s) : 1 / 0, u = Math.min(i, a);
  return We({ x: 0.5 + o * u / (t.width || 1), y: 0.5 + s * u / (t.height || 1) });
}
function Ke(t) {
  const e = { ...t };
  return e.showParentArrow = t.showChildArrow !== !1, e.showChildArrow = !!t.showParentArrow, e.sourceAnchor = t.targetAnchor ?? null, e.targetAnchor = null, e;
}
const Mt = (t) => ({ ...U(t), rotation: Number(G(t, "rotationAngle")) || 0 }), Je = (t) => ({ x: t.x + t.width / 2, y: t.y + t.height / 2 });
function Ze(t, e, n, o, s, i) {
  const a = (c) => t.nodes.find(($) => k($) === c), u = (c) => {
    throw new W("invalid_operation_plan", 400, `${s} ${c}`);
  }, y = (c) => {
    throw new W("no_match", 409, `${s} names no note ${JSON.stringify(c)} on the slate.`);
  }, w = (c, $) => {
    c !== $ && (c.relationships.associations = c.relationships.associations.filter((v) => v !== n), $.relationships.associations.push(n));
  };
  let f = e;
  if (o.toNote !== void 0) {
    const c = a(o.toNote) ?? y(o.toNote);
    n.childId = k(c), delete n.targetPoint, n.targetAnchor = null;
  } else o.toPoint !== void 0 && (nt(n) || (n.childId = `${pt}${i()}`), n.targetPoint = { x: o.toPoint.x, y: o.toPoint.y }, n.targetAnchor = null);
  if (o.fromNote !== void 0) {
    const c = a(o.fromNote) ?? y(o.fromNote);
    n.parentId = k(c), n.sourceAnchor = null, w(f, c), f = c;
  } else if (o.fromPoint !== void 0) {
    nt(n) && u(`keeps one end on a note: the far end of ${n.id} is already free.`);
    const c = a(n.childId) ?? y(n.childId), $ = Ke(n);
    for (const v of Object.keys(n)) delete n[v];
    Object.assign(n, $, {
      parentId: k(c),
      childId: `${pt}${i()}`,
      targetPoint: { x: o.fromPoint.x, y: o.fromPoint.y }
    }), w(f, c), f = c;
  }
  n.parentId === n.childId && u(`cannot connect ${n.id} from a note to itself.`);
  const r = (c) => {
    if (c === "target" && nt(n)) return n.targetPoint;
    const $ = a(c === "source" ? n.parentId : n.childId);
    if (!$) return null;
    const v = c === "source" ? n.sourceAnchor : n.targetAnchor;
    return v ? Ge(Mt($), v) : Je(Mt($));
  }, d = (c, $, v) => {
    if (c === "target" && nt(n)) {
      v && u(`cannot pin or follow the far end of ${n.id}: it is free, on no note.`);
      return;
    }
    const m = c === "source" ? "sourceAnchor" : "targetAnchor";
    if ($ === "follow") n[m] = null;
    else if ($ !== "pinned") n[m] = He($);
    else if (!n[m]) {
      const b = a(c === "source" ? n.parentId : n.childId), g = r(c === "source" ? "target" : "source");
      b && g && (n[m] = Ue(Mt(b), g));
    }
  };
  return o.ends !== void 0 && (d("source", o.ends, !1), d("target", o.ends, !1)), o.fromEnd !== void 0 && d("source", o.fromEnd, !0), o.toEnd !== void 0 && d("target", o.toEnd, !0), f;
}
function Ve(t) {
  return {
    fromEnd: t.sourceAnchor ? "pinned" : "follow",
    toEnd: nt(t) ? "free" : t.targetAnchor ? "pinned" : "follow"
  };
}
function de(t) {
  const { x: e, y: n, width: o, height: s } = t, i = t.rotationAngle || 0;
  if (!i) return { minX: e, minY: n, maxX: e + o, maxY: n + s };
  const a = e + o / 2, u = n + s / 2, y = i * Math.PI / 180, w = Math.cos(y), f = Math.sin(y);
  let r = 1 / 0, d = 1 / 0, c = -1 / 0, $ = -1 / 0;
  for (const [m, b] of [[e, n], [e + o, n], [e + o, n + s], [e, n + s]]) {
    const g = m - a, I = b - u, X = a + g * w - I * f, l = u + g * f + I * w;
    r = Math.min(r, X), d = Math.min(d, l), c = Math.max(c, X), $ = Math.max($, l);
  }
  const v = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: v(r), minY: v(d), maxX: v(c), maxY: v($) };
}
function Qe(t, e) {
  if (e.length < 2) return [];
  const n = e.map(de), o = Math.min(...n.map((w) => w.minX)), s = Math.max(...n.map((w) => w.maxX)), i = Math.min(...n.map((w) => w.minY)), a = Math.max(...n.map((w) => w.maxY)), u = (o + s) / 2, y = (i + a) / 2;
  return e.map((w, f) => {
    const r = n[f];
    let { x: d, y: c } = w;
    return t === "left" ? d += o - r.minX : t === "right" ? d += s - r.maxX : t === "centerH" ? d += u - (r.minX + r.maxX) / 2 : t === "top" ? c += i - r.minY : t === "bottom" ? c += a - r.maxY : t === "middle" && (c += y - (r.minY + r.maxY) / 2), { id: w.id, x: d, y: c };
  });
}
function tn(t, e) {
  if (e.length < 3) return [];
  const n = e.map((d, c) => ({ box: d, index: c, b: de(d) })), o = t === "horizontal", s = (d) => o ? d.b.minX : d.b.minY, i = (d) => o ? d.b.maxX - d.b.minX : d.b.maxY - d.b.minY, a = [...n].sort((d, c) => s(d) - s(c) || d.index - c.index), u = s(a[0]), w = (a.reduce((d, c) => Math.max(d, s(c) + i(c)), -1 / 0) - u - a.reduce((d, c) => d + i(c), 0)) / (a.length - 1), f = /* @__PURE__ */ new Map();
  let r = u;
  for (const d of a) {
    const c = r - s(d);
    f.set(d.index, {
      id: d.box.id,
      x: o ? d.box.x + c : d.box.x,
      y: o ? d.box.y : d.box.y + c
    }), r += i(d) + w;
  }
  return n.map((d) => f.get(d.index));
}
function vt(t, e, n) {
  const o = Math.min(t.x + t.width + n - e.x, e.x + e.width + n - t.x), s = Math.min(t.y + t.height + n - e.y, e.y + e.height + n - t.y);
  return o > 0 && s > 0 ? { x: o, y: s } : null;
}
const en = 4e6;
function nn(t, e, { gap: n = 20 } = {}) {
  const o = t.map((f) => ({ ...f })), s = e.map((f) => ({ ...f })), i = (f, r, d, c, $) => {
    const v = f.x + f.width / 2 - (r.x + r.width / 2), m = f.y + f.height / 2 - (r.y + r.height / 2);
    d.y <= d.x ? f.y += (m > 0 || m === 0 && $ > 0 ? 1 : -1) * d.y * c : f.x += (v > 0 || v === 0 && $ > 0 ? 1 : -1) * d.x * c;
  }, a = Math.max(1, o.length * (s.length + o.length / 2)), u = Math.max(1, Math.min(1e3, Math.floor(en / a)));
  let y = !1;
  for (let f = 0; f < u; f += 1) {
    let r = !1;
    for (let d = 0; d < o.length; d += 1) {
      for (const c of s) {
        const $ = vt(o[d], c, n);
        $ && (i(o[d], c, $, 1, 1), r = !0);
      }
      for (let c = d + 1; c < o.length; c += 1) {
        const $ = vt(o[d], o[c], n);
        $ && (i(o[d], o[c], $, 0.5, -1), i(o[c], o[d], $, 0.5, 1), r = !0);
      }
    }
    if (!r) {
      y = !0;
      break;
    }
  }
  const w = (f) => Math.round(f * 100) / 100;
  for (const f of o)
    f.x = w(f.x), f.y = w(f.y);
  return y || on(o, s, n), o.map(({ id: f, x: r, y: d }) => ({ id: f, x: r, y: d }));
}
function on(t, e, n) {
  const o = [...e], s = [];
  for (const c of t)
    o.some(($) => vt(c, $, n)) ? s.push(c) : o.push(c);
  if (!s.length) return;
  const i = Math.min(...t.map((c) => c.x)), a = o.length ? Math.max(...o.map((c) => c.y + c.height)) + n : Math.min(...t.map((c) => c.y)), u = o.length ? Math.max(...o.map((c) => c.x + c.width)) : i, y = s.reduce((c, $) => c + ($.width + n) * ($.height + n), 0), w = Math.max(u - i, Math.sqrt(y) * 1.5, ...s.map((c) => c.width));
  let f = i, r = a, d = 0;
  for (const c of s)
    f > i && f + c.width > i + w && (f = i, r += d + n, d = 0), c.x = f, c.y = r, f += c.width + n, d = Math.max(d, c.height);
}
function sn(t, e, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!t.length) return [];
  const s = new Map(t.map((l) => [l.id, l])), i = new Map(t.map((l) => [l.id, []])), a = new Map(t.map((l) => [l.id, 0]));
  for (const [l, h] of e)
    !s.has(l) || !s.has(h) || l === h || (i.get(l).push(h), a.set(h, a.get(h) + 1));
  const u = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), w = [], f = (l) => {
    w.push(l), y.set(l, 0), u.set(l, []);
    const h = [l];
    for (; h.length; ) {
      const p = h.shift();
      for (const x of i.get(p))
        y.has(x) || (y.set(x, y.get(p) + 1), u.set(x, []), u.get(p).push(x), h.push(x));
    }
  };
  for (const l of t) a.get(l.id) === 0 && !y.has(l.id) && f(l.id);
  for (const l of t) y.has(l.id) || f(l.id);
  const r = [];
  for (const l of t) {
    const h = y.get(l.id);
    r[h] = Math.max(r[h] ?? 0, l.height);
  }
  const d = Math.min(...t.map((l) => l.x)), c = Math.min(...t.map((l) => l.y)), $ = [];
  r.forEach((l, h) => {
    $[h] = h === 0 ? c : $[h - 1] + r[h - 1] + n;
  });
  const v = /* @__PURE__ */ new Map(), m = (l) => {
    const h = u.get(l), p = h.reduce((S, N) => S + m(N), 0) + n * Math.max(0, h.length - 1), x = Math.max(s.get(l).width, p);
    return v.set(l, x), x;
  }, b = /* @__PURE__ */ new Map(), g = (l, h) => {
    const p = s.get(l), x = u.get(l), S = v.get(l), N = $[y.get(l)];
    if (!x.length) {
      b.set(l, { id: l, x: h + (S - p.width) / 2, y: N });
      return;
    }
    const P = x.reduce((O, A) => O + v.get(A), 0) + n * (x.length - 1);
    let C = h + (S - P) / 2;
    for (const O of x)
      g(O, C), C += v.get(O) + n;
    const Y = b.get(x[0]), E = b.get(x[x.length - 1]), M = (Y.x + s.get(x[0]).width / 2 + E.x + s.get(x[x.length - 1]).width / 2) / 2, _ = Math.min(Math.max(M - p.width / 2, h), h + S - p.width);
    b.set(l, { id: l, x: _, y: N });
  };
  let I = d;
  for (const l of w) {
    const h = m(l);
    g(l, I), I += h + n;
  }
  const X = t.map((l) => b.get(l.id));
  return rn(t, X, o, n);
}
function rn(t, e, n, o) {
  if (!n.length) return e;
  let s = 0;
  for (let i = 0; i <= n.length; i += 1) {
    let a = 0;
    if (e.forEach((u, y) => {
      const w = { ...t[y], x: u.x, y: u.y + s };
      for (const f of n)
        vt(w, f, o) && (a = Math.max(a, f.y + f.height + o - w.y));
    }), !a) break;
    s += a;
  }
  return s ? e.map((i) => ({ ...i, y: i.y + s })) : e;
}
function an() {
  const t = "abcdefghijklmnopqrstuvwxyz0123456789";
  let e = "";
  for (let n = 0; n < 12; n += 1) e += t[Math.floor(Math.random() * t.length)];
  return e;
}
function cn(t) {
  const e = (i) => {
    const a = (parseInt(i, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (i) => 0.2126 * e(i.substr(1, 2)) + 0.7152 * e(i.substr(3, 2)) + 0.0722 * e(i.substr(-2)), o = (i, a) => {
    const [u, y] = [n(i), n(a)];
    return (Math.max(u, y) + 0.05) / (Math.min(u, y) + 0.05);
  }, s = /^#[0-9a-f]{6}$/i.test(t) ? t : "#7aa2c8";
  return o(s, "#ffffff") > o(s, "#000000") ? "#ffffff" : "#000000";
}
function dn(t, e, n) {
  return t.x < e.x + e.width + n && t.x + t.width + n > e.x && t.y < e.y + e.height + n && t.y + t.height + n > e.y;
}
function ln(t, e, n, o, s, i) {
  let a = t;
  for (let u = 0; u <= e.length; u += 1) {
    const y = e.filter((r) => a.some((d) => dn({ ...d, width: n, height: o }, r, i)));
    if (!y.length) return a;
    let w = 0, f = 0;
    s === "left" ? w = Math.min(...y.map((r) => r.x - i)) - Math.max(...a.map((r) => r.x + n)) : s === "above" ? f = Math.min(...y.map((r) => r.y - i)) - Math.max(...a.map((r) => r.y + o)) : s === "below" || s === "center" ? f = Math.max(...y.map((r) => r.y + r.height + i)) - Math.min(...a.map((r) => r.y)) : w = Math.max(...y.map((r) => r.x + r.width + i)) - Math.min(...a.map((r) => r.x)), a = a.map((r) => ({ x: r.x + w, y: r.y + f }));
  }
  return a;
}
function le(t, e) {
  if (e) {
    const n = t.nodes.find((s) => k(s) === e);
    if (n) return n;
    const o = t.nodes.filter((s) => `${s.options.text ?? ""}`.trim().toLowerCase() === e.trim().toLowerCase());
    if (o.length === 1) return o[0];
  }
  return [...t.nodes].sort((n, o) => U(o).x + U(o).width - (U(n).x + U(n).width))[0];
}
function Ct(t, e) {
  const n = e === "grid" ? Math.ceil(Math.sqrt(t)) : t;
  return Array.from({ length: t }, (o, s) => ({
    row: e === "column" ? s : e === "grid" ? Math.floor(s / n) : 0,
    column: e === "column" ? 0 : e === "grid" ? s % n : s
  }));
}
function hn(t, e, n, o) {
  const s = e.count, i = e.placement || {}, a = i.gap ?? (i.connect ? Me : 48);
  if (e.x !== void 0 && e.y !== void 0) {
    const d = i.arrangement || "row";
    return { points: Ct(s, d).map(({ row: $, column: v }) => ({
      x: e.x + v * (n + a),
      y: e.y + $ * (o + a)
    })), arrangement: d, gap: a };
  }
  const u = le(t, i.relativeTo), y = u ? U(u) : { x: 0, y: 0, width: 160, height: 100 }, w = i.direction || "right", f = i.arrangement || (["left", "right"].includes(w) ? "column" : "row"), r = Ct(s, f).map(({ row: d, column: c }) => {
    let $ = y.x + c * (n + a), v = y.y + d * (o + a);
    return w === "right" && ($ += y.width + a), w === "left" && ($ -= n + a), w === "below" && (v += y.height + a), w === "above" && (v -= o + a), { x: $, y: v };
  });
  return { points: ln(r, t.nodes.map(U), n, o, w, a), arrangement: f, gap: a };
}
function un(t, e) {
  if (!t) return { childId: `${pt}${e()}` };
  const n = t.match(/->(__free_.+)$/);
  return { id: t, childId: n ? n[1] : `${pt}${t.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Nt(t, e) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}~${n}`); ) n += 1;
  return `${e}~${n}`;
}
const Pt = (t, e) => JSON.stringify([t, e]);
function At(t, e, n) {
  return new W(
    "id_taken",
    409,
    `${t} names ${e} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${e}s in a later operation.`,
    { ids: n }
  );
}
const Zt = (t, e) => JSON.stringify(t) === JSON.stringify(e), pn = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Lt = (t) => JSON.parse(JSON.stringify(t)), bt = 1e6, Vt = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, rt = (t) => ({ id: k(t), ...U(t), rotationAngle: G(t, "rotationAngle") });
function _n(t, e, n = {}) {
  const o = $t(n), s = _t(n), i = n.idFactory || an, a = It(t), u = Xe(e, {
    ...n,
    existingNodeIds: a.nodes.map(k),
    existingConnectionIds: et(a).map(({ association: d }) => d.id)
  });
  if (!u.valid)
    throw new W("invalid_operation_plan", 400, u.errors.join(" "), { errors: u.errors });
  const y = JSON.stringify(a), w = a.nodes.length, f = [], r = {
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
  if (e.operations.forEach((d, c) => {
    const $ = c + 1, v = `Operation ${$}`, m = { operation: $, kind: d.kind, matched: [], changed: [] };
    r.operations.push(m);
    const b = () => r.warnings.push(`${v} matched no notes.`), g = (l) => {
      r.skipped.push({ operation: $, id: k(l), reason: "locked" });
    }, I = (l) => {
      const h = a.nodes.length + l;
      if (l > 0 && h > s.notesPerSlate && h > w)
        throw new W(
          "note_limit",
          422,
          `${v} would leave ${h} notes; a slate can hold at most ${s.notesPerSlate} notes.`,
          { limit: s.notesPerSlate, operation: $ }
        );
    }, X = (l, h) => {
      if (h > 0 && l > s.connectorsPerSlate)
        throw new W(
          "connector_limit",
          422,
          `${v} would leave ${l} connectors; a slate can hold at most ${s.connectorsPerSlate} connectors.`,
          { limit: s.connectorsPerSlate, operation: $ }
        );
    };
    switch (d.kind) {
      case "add_nodes": {
        const l = d.preset ? pe[d.preset] : void 0, h = d.placement?.connect === !0, p = h ? a.nodes.find((z) => k(z) === d.placement.relativeTo) : void 0;
        if (h && !p)
          throw new W("no_match", 409, `${v} placement.relativeTo names no note on the slate to connect from.`, { operation: $ });
        if (p && p.options.isLocked === !0) {
          g(p);
          return;
        }
        const x = d.shape ?? l?.shape, S = p ? U(p) : void 0, N = d.width ?? l?.width ?? S?.width ?? (x?.toLowerCase() === "triangle" ? 150 : 180), P = d.height ?? l?.height ?? S?.height ?? (x?.toLowerCase() === "triangle" ? 130 : 110), C = p ?? le(a, d.placement?.relativeTo), Y = d.style?.backgroundColor || l?.style?.backgroundColor || C?.options.backgroundColor || "#7aa2c8", { points: E, arrangement: M, gap: _ } = hn(a, d, N, P), O = new Set(et(a).map(({ association: z }) => z.id)), A = new Set(a.nodes.map(k)), T = (d.ids || []).filter((z) => A.has(z));
        if (T.length && !n.replay) throw At(v, "note", T);
        const D = E.map((z, F) => d.ids?.[F] || i());
        I(D.filter((z) => !A.has(z)).length), p && X(O.size + D.filter((z) => !A.has(z)).length, D.length), E.forEach(({ x: z, y: F }, Xt) => {
          const K = D[Xt];
          if (m.matched.push(K), A.has(K)) return;
          const Ft = d.text ? d.count > 1 ? d.text.replace(/\{n\}/g, `${Xt + 1}`) : d.text : "", gt = p ? Lt(p.options) : void 0;
          if (gt) for (const Q of pn) delete gt[Q];
          const st = gt ? { ...gt, id: K, name: K, text: Ft, width: N, height: P } : {
            id: K,
            name: K,
            text: Ft,
            defaultShaped: !0,
            width: N,
            height: P,
            backgroundColor: Y,
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
          x && L.shape.store(st, x, o), L.x.store(st, z, o), L.y.store(st, F, o), p || L.foregroundColor.store(st, cn(Y), o);
          for (const [Q, Ot] of Object.entries(l?.style || {})) L[Q].store(st, Ot, o);
          for (const [Q, Ot] of Object.entries(d.style || {})) L[Q].store(st, Ot, o);
          if (a.nodes.push({ options: st, relationships: { associations: [] } }), m.changed.push(K), r.created.push(K), p) {
            const Q = Nt(O, ut(k(p), K));
            O.add(Q), p.relationships.associations.push({ id: Q, parentId: k(p), childId: K, ...St }), r.connected.push(Q);
          }
        });
        const { placement: V, ...H } = d;
        f.push({
          ...H,
          ids: D,
          x: E[0].x,
          y: E[0].y,
          placement: { arrangement: M, gap: _, ...p ? { relativeTo: k(p), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = tt(a, d.target, `${v} target`);
        m.matched = l.map(k), l.length || b();
        const h = [];
        for (const p of l) {
          if (p.options.isLocked === !0 && d.changes.locked !== !1) {
            g(p);
            continue;
          }
          const x = JSON.stringify(p.options);
          for (const [S, N] of Object.entries(d.changes))
            mt[S] || L[S].store(p.options, N, o);
          h.push(k(p)), JSON.stringify(p.options) !== x && m.changed.push(k(p));
        }
        if (d.changes.order && h.length) {
          const p = new Set(h), x = a.nodes.map(k), S = a.nodes.filter((P) => p.has(k(P))), N = a.nodes.filter((P) => !p.has(k(P)));
          a.nodes = d.changes.order === "front" ? [...N, ...S] : [...S, ...N], a.nodes.forEach((P, C) => {
            const Y = k(P);
            p.has(Y) && x[C] !== Y && !m.changed.includes(Y) && m.changed.push(Y);
          });
        }
        r.updated.push(...h), h.length && f.push({ kind: "update_nodes", target: { ids: h }, changes: d.changes });
        return;
      }
      case "delete_nodes": {
        const l = tt(a, d.target, `${v} target`);
        if (m.matched = l.map(k), l.length || b(), !d.target.ids && a.nodes.length > 1 && l.length === a.nodes.length && !ae.test(n.userMessage || ""))
          throw new W("invalid_operation_plan", 400, `${v} cannot delete every note without an explicit request.`);
        const p = /* @__PURE__ */ new Set();
        for (const x of l)
          x.options.isLocked === !0 ? g(x) : p.add(k(x));
        a.nodes = a.nodes.filter((x) => !p.has(k(x)));
        for (const x of a.nodes)
          x.relationships.associations = x.relationships.associations.filter(
            (S) => !p.has(S.parentId) && !p.has(S.childId)
          );
        m.changed = [...p], r.deleted.push(...p), p.size && f.push({ kind: "delete_nodes", target: { ids: [...p] } });
        return;
      }
      case "duplicate_nodes": {
        const l = tt(a, d.target, `${v} target`);
        m.matched = l.map(k), l.length || b();
        const h = d.offset ?? Ne, p = new Set(a.nodes.map(k)), x = (d.ids || []).filter((E) => p.has(E));
        if (x.length && !n.replay) throw At(v, "note", x);
        const S = l.map((E, M) => d.ids?.[M] || i());
        I(S.filter((E) => !p.has(E)).length);
        for (const E of l) {
          const M = G(E, "x") + h.x, _ = G(E, "y") + h.y;
          if (Math.abs(M) > bt || Math.abs(_) > bt)
            throw new W(
              "invalid_operation_plan",
              400,
              `${v} would put the copy of ${k(E)} at ${M}, ${_}; a note's position must be from -${bt} to ${bt}.`
            );
        }
        const N = new Map(l.map((E, M) => [k(E), S[M]])), P = /* @__PURE__ */ new Map();
        l.forEach((E, M) => {
          const _ = S[M];
          if (p.has(_)) return;
          const O = { options: { ...Lt(E.options), id: _, name: _ }, relationships: { associations: [] } };
          L.x.store(O.options, G(E, "x") + h.x, o), L.y.store(O.options, G(E, "y") + h.y, o), a.nodes.push(O), P.set(_, O), m.changed.push(_), r.created.push(_);
        });
        const C = new Set(et(a).map(({ association: E }) => E.id));
        let Y = 0;
        for (const E of l) {
          const M = P.get(N.get(k(E)));
          if (M)
            for (const _ of E.relationships.associations) {
              const O = N.get(_.childId);
              if (!O || nt(_)) continue;
              const A = Nt(C, ut(k(M), O));
              C.add(A), M.relationships.associations.push({ ...Lt(_), id: A, parentId: k(M), childId: O }), r.connected.push(A), Y += 1;
            }
        }
        X(C.size, Y), l.length && f.push({ kind: "duplicate_nodes", target: { ids: l.map(k) }, ids: S, offset: { ...h } });
        return;
      }
      case "connect_nodes": {
        const l = tt(a, d.from, `${v} from`), h = d.to?.point, p = h ? [] : tt(a, d.to, `${v} to`);
        (!l.length || !h && !p.length) && b();
        const x = l.length * (h ? 1 : p.length);
        if (x > s.connectorsPerOperation)
          throw new W(
            "connector_limit",
            422,
            `${v} would join ${x} pairs of notes; one operation may join at most ${s.connectorsPerOperation}.`,
            { limit: s.connectorsPerOperation }
          );
        const S = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map();
        for (const { association: M } of et(a)) {
          S.add(M.id);
          const _ = Pt(M.parentId, M.childId);
          N.has(_) || N.set(_, M.id);
        }
        const P = [], C = [], Y = [];
        let E = 0;
        for (const M of l) {
          const _ = k(M), O = h ? [null] : p.filter((A) => k(A) !== _);
          if (M.options.isLocked === !0) {
            O.length && g(M), E += O.length;
            continue;
          }
          O.length && Y.push(_);
          for (const A of O) {
            const T = d.ids?.[E];
            if (E += 1, !A) {
              const z = un(T, i), F = z.id ?? ut(_, z.childId);
              if (S.has(F)) {
                n.replay || P.push(F), C.push(F), m.matched.push(F);
                continue;
              }
              M.relationships.associations.push({ id: F, parentId: _, childId: z.childId, targetPoint: { ...h }, ...St, ...d.style || {} }), S.add(F), C.push(F), m.matched.push(F), m.changed.push(F), r.connected.push(F);
              continue;
            }
            const D = k(A), V = N.get(Pt(_, D));
            if (V) {
              C.push(V), m.matched.push(V);
              continue;
            }
            if (T && S.has(T)) {
              n.replay || P.push(T), C.push(T), m.matched.push(T);
              continue;
            }
            const H = T || Nt(S, ut(_, D));
            M.relationships.associations.push({ id: H, parentId: _, childId: D, ...St, ...d.style || {} }), S.add(H), N.set(Pt(_, D), H), C.push(H), m.matched.push(H), m.changed.push(H), r.connected.push(H);
          }
        }
        if (P.length) throw At(v, "connector", P);
        if (S.size > s.connectorsPerSlate && m.changed.length)
          throw new W(
            "connector_limit",
            422,
            `A slate can hold at most ${s.connectorsPerSlate} connectors; this plan would leave ${S.size}.`,
            { limit: s.connectorsPerSlate }
          );
        m.changed.length && f.push({
          kind: "connect_nodes",
          from: { ids: Y },
          to: h ? { point: { ...h } } : { ids: p.map(k) },
          ids: C,
          ...d.style ? { style: d.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let l;
        if (d.connectionIds) {
          const h = new Set(d.connectionIds);
          l = et(a).filter(({ association: p }) => h.has(p.id));
        } else {
          const h = new Set(tt(a, d.from, `${v} from`).map(k)), p = new Set(tt(a, d.to, `${v} to`).map(k));
          l = et(a).filter(
            ({ association: x }) => h.has(x.parentId) && p.has(x.childId) || p.has(x.parentId) && h.has(x.childId)
          );
        }
        if (m.matched = l.map(({ association: h }) => h.id), l.length || r.warnings.push(`${v} matched no connectors.`), d.kind === "disconnect_nodes") {
          for (const { node: h, association: p } of l)
            h.relationships.associations = h.relationships.associations.filter((x) => x !== p);
          m.changed = [...m.matched], r.disconnected.push(...m.matched), l.length && f.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { node: h, association: p } of l) {
          const x = JSON.stringify([k(h), p]), S = Object.entries(d.changes).filter(([P]) => !Bt.includes(P));
          for (const [P, C] of S) p[ot[P].field || P] = C;
          const N = Ze(a, h, p, d.changes, v, i);
          JSON.stringify([k(N), p]) !== x && m.changed.push(p.id);
        }
        r.connectionsUpdated.push(...m.matched), l.length && f.push({ kind: "update_connections", connectionIds: m.matched, changes: d.changes });
        return;
      }
      case "arrange_nodes": {
        const l = tt(a, d.target, `${v} target`);
        m.matched = l.map(k), l.length || b();
        const h = l.filter((_) => _.options.isLocked !== !0 ? !0 : (g(_), !1));
        if (!h.length) return;
        const p = d.layout;
        let x;
        if (Vt[p]) x = Qe(Vt[p], h.map(rt));
        else if (p === "distribute-horizontal" || p === "distribute-vertical")
          x = tn(p === "distribute-horizontal" ? "horizontal" : "vertical", h.map(rt));
        else if (p === "tidy") {
          const _ = new Set(h.map(k)), O = a.nodes.filter((A) => !_.has(k(A))).map(rt);
          x = nn(h.map(rt), O, { gap: d.gap ?? 20 });
        } else if (p === "tree") {
          const _ = et(a).filter(({ association: T }) => !nt(T)).map(({ association: T }) => [T.parentId, T.childId]), O = new Set(h.map(k)), A = a.nodes.filter((T) => !O.has(k(T))).map(rt);
          x = sn(h.map(rt), _, { gap: d.gap ?? 48, obstacles: A });
        }
        if (x) {
          const _ = new Map(h.map((O) => [k(O), O]));
          for (const O of x) {
            const A = _.get(O.id), T = [G(A, "x"), G(A, "y")];
            L.x.store(A.options, O.x, o), L.y.store(A.options, O.y, o), Zt(T, [O.x, O.y]) || m.changed.push(O.id);
          }
          r.updated.push(...h.map(k)), f.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: d.layout, ...d.gap !== void 0 ? { gap: d.gap } : {} });
          return;
        }
        const S = h.map(U), N = d.gap ?? 48, P = Math.min(...S.map((_) => _.x)), C = Math.min(...S.map((_) => _.y)), Y = Math.max(...S.map((_) => _.width), 120), E = Math.max(...S.map((_) => _.height), 80), M = Ct(h.length, d.layout === "circle" ? "row" : d.layout);
        h.forEach((_, O) => {
          const A = [G(_, "x"), G(_, "y")];
          let T, D;
          if (d.layout === "circle") {
            const V = Math.max(180, h.length * 35), H = Math.PI * 2 * O / h.length;
            T = P + V + Math.cos(H) * V, D = C + V + Math.sin(H) * V;
          } else
            T = P + M[O].column * (Y + N), D = C + M[O].row * (E + N);
          L.x.store(_.options, T, o), L.y.store(_.options, D, o), Zt(A, [T, D]) || m.changed.push(k(_));
        }), r.updated.push(...h.map(k)), f.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: d.layout, ...d.gap !== void 0 ? { gap: N } : {} });
        return;
      }
      case "update_slate": {
        const l = d.changes, h = JSON.stringify(a);
        for (const [p, x] of Object.entries(dt))
          l[p] !== void 0 && x.store(a, l[p]);
        JSON.stringify(a) !== h && m.changed.push("slate"), f.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && r.warnings.length) {
    const d = r.warnings[0];
    throw new W("no_match", 409, d, { operation: Number(d.match(/^Operation (\d+)/)?.[1]) });
  }
  return r.unchanged = JSON.stringify(a) === y, { slate: a, materializedPlan: { message: e.message.trim(), operations: f }, report: r };
}
const Qt = ["id", ...Object.keys(L), "image"], wt = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), ft = (t) => t.options.isComment === !0;
function he(t, e) {
  const n = t.options, o = (i) => !e || e.includes(i), s = { id: k(t) };
  for (const [i, a] of Object.entries(L)) {
    if (!o(i)) continue;
    const u = a.read(n);
    s[i] = u === void 0 ? null : u;
  }
  return o("image") && (s.image = n.image || null), s;
}
function ue(t) {
  const e = nt(t), n = { id: t.id, from: t.parentId, to: e ? null : t.childId };
  for (const [s, i] of Object.entries(ot)) {
    if (Bt.includes(s)) continue;
    const a = t[i.field ?? s];
    n[s] = a === void 0 ? null : a;
  }
  e && (n.toPoint = t.targetPoint ?? null);
  const o = Ve(t);
  return (o.fromEnd !== "follow" || o.toEnd !== "follow") && Object.assign(n, o), n;
}
const lt = (t) => new W("invalid_selection", 400, t);
function fn(t) {
  const e = {};
  if (t.ids !== void 0 && (e.ids = t.ids), t.within !== void 0 && (e.within = t.within), t.groupId !== void 0 && (e.groupId = t.groupId), t.q !== void 0)
    e.text = t.q, e.all = !0, t.match !== void 0 && (e.match = t.match);
  else if (t.match !== void 0)
    throw lt("match goes with q.");
  if (!Object.keys(e).length) return null;
  const n = at(e, "selection").map(
    (o) => o.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q")
  );
  if (n.length) throw lt(n.join(" "));
  return e;
}
const mn = (t) => btoa(encodeURIComponent(JSON.stringify(t))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function gn(t) {
  try {
    const { after: e, at: n } = JSON.parse(decodeURIComponent(atob(t.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof e == "string" && e && Number.isSafeInteger(n) && n >= 0) return { after: e, at: n };
  } catch {
  }
  throw lt("cursor is not one this slate gave. Read again from the first page.");
}
function yn(t, { after: e, at: n }) {
  let o = -1;
  if (t.forEach((s, i) => {
    k(s) === e && (o < 0 || Math.abs(i - n) < Math.abs(o - n)) && (o = i);
  }), o < 0) throw lt("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function bn(t) {
  if (!t.length) return null;
  const e = t.map(U), n = Math.min(...e.map((a) => a.x)), o = Math.min(...e.map((a) => a.y)), s = Math.max(...e.map((a) => a.x + a.width)), i = Math.max(...e.map((a) => a.y + a.height));
  return { x: n, y: o, width: s - n, height: i - o };
}
function In(t, e = {}) {
  const n = It(t), o = n.nodes.filter((b) => !ft(b)), s = e.fields;
  if (s !== void 0) {
    const b = s.filter((g) => !Qt.includes(g));
    if (b.length) throw lt(`Unknown note field: ${b.join(", ")}. Choose from ${Qt.join(", ")}.`);
  }
  const i = e.limit ?? wt.notes;
  if (!Number.isInteger(i) || i < 1 || i > wt.maxNotes)
    throw lt(`limit must be a whole number from 1 to ${wt.maxNotes}.`);
  const a = e.maxChars ?? wt.maxChars, u = fn(e), y = u ? tt({ ...n, nodes: o }, u, "selection") : o;
  let w = 0;
  e.cursor !== void 0 && (w = yn(y, gn(e.cursor)));
  const f = new Set(n.nodes.filter(ft).map(k)), r = /* @__PURE__ */ new Map();
  for (const { association: b } of et(n)) {
    if (f.has(b.parentId) || f.has(b.childId)) continue;
    const g = r.get(b.parentId) ?? [];
    g.push(b), r.set(b.parentId, g);
  }
  const d = [], c = [];
  let $ = 0, v = w;
  for (; v < y.length && d.length < i; v += 1) {
    const b = y[v], g = he(b, s), I = (r.get(k(b)) ?? []).map(ue), X = JSON.stringify(g).length + JSON.stringify(I).length;
    if (d.length && $ + X > a) break;
    $ += X, d.push(g), c.push(...I);
  }
  const m = d[d.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: Re(n.options.containerStyle),
    bounds: bn(o),
    nodeCount: y.length,
    nodes: d,
    connections: c,
    nextCursor: v < y.length && m ? mn({ after: m.id, at: v - 1 }) : null
  };
}
const wn = [
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
function On(t) {
  const e = It(t), n = new Set(e.nodes.filter(ft).map(k)), o = {};
  for (const i of wn) e.options[i] !== void 0 && (o[i] = e.options[i]);
  const s = e.nodes.filter((i) => !n.has(k(i))).map((i) => ({
    options: i.options,
    relationships: {
      ...i.relationships,
      associations: i.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: o, nodes: s, shareId: `${t?.shareId ?? e.options.shareId ?? ""}` };
}
const xn = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked"], kn = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function Sn(t) {
  const e = It(t), n = e.nodes.filter((a) => !ft(a)), o = new Set(e.nodes.filter(ft).map((a) => a.options.id)), s = n.slice(0, 150).map((a) => {
    const u = he(a, xn);
    return {
      id: u.id,
      text: `${u.text ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 240),
      shape: u.shape,
      x: u.x,
      y: u.y,
      width: Number(u.width ?? 120),
      height: Number(u.height ?? 80),
      ...u.rotationAngle ? { rotationAngle: u.rotationAngle } : {},
      ...u.locked === !0 ? { locked: !0 } : {}
    };
  }), i = et(e).filter(({ association: a }) => !o.has(a.parentId) && !o.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const u = ue(a);
    return {
      id: u.id,
      from: u.from,
      to: u.to,
      ..."toPoint" in u ? { toPoint: u.toPoint } : {},
      // Whether each end follows its note, is pinned to a spot on its edge, or is free.
      ..."fromEnd" in u ? { fromEnd: u.fromEnd, toEnd: u.toEnd } : {},
      label: u.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(kn.map((y) => [y, u[y] ?? void 0]))
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
function En(t = {}) {
  const e = $t(t), n = (o, s) => Object.fromEntries(Object.entries(o).map(([i, a]) => [i, { ...Z(s(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(xt.map((o) => [o, { fields: Yt[o].filter((s) => s !== "kind") }])),
    noteKeys: { ...n(L, (o) => o.spec(e)), ...n(mt, (o) => o.spec) },
    noteStyleKeys: [...jt],
    connectorKeys: n(ot, (o) => o.spec),
    connectorStyleKeys: [...Dt],
    slateKeys: Object.fromEntries(
      Object.entries(dt).map(([o, s]) => [
        o,
        { ...o === "background" ? ie() : Z(s.spec), description: s.description }
      ])
    ),
    selector: re(),
    layouts: [...Rt],
    presets: [...zt],
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
function vn(t = {}) {
  const e = $t(t), n = _t(t), o = (y) => Object.fromEntries(y.map((w) => [w, Z(L[w].spec(e))])), s = (y) => Object.fromEntries(y.map((w) => [w, Z(ot[w].spec)])), i = re(), a = { type: "array", items: { type: "string" } }, u = xt.map((y) => `${y}: ${Yt[y].filter((w) => w !== "kind").join(", ")}`).join("; ");
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
        maxItems: n.operationsPerPlan,
        items: {
          type: "object",
          additionalProperties: !1,
          required: ["kind"],
          description: `Fields by kind. ${u}.`,
          properties: {
            kind: { type: "string", enum: [...xt] },
            count: { type: "integer", minimum: 1, maximum: n.notesPerAdd },
            ...o(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...zt],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...a, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: a,
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...Z({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...ee] },
                arrangement: { type: "string", enum: [...ne] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...o(jt), ...s(Dt) }
            },
            target: i,
            from: i,
            to: {
              ...i,
              description: `${i.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...i.properties, point: Z({ type: "point" }) }
            },
            layout: {
              type: "string",
              enum: [...Rt],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(dt).join(", ")}.`,
              properties: {
                ...o(Object.keys(L)),
                ...Object.fromEntries(Object.entries(mt).map(([y, w]) => [y, Z(w.spec)])),
                ...s(Object.keys(ot)),
                ...Object.fromEntries(
                  Object.entries(dt).map(([y, w]) => [y, y === "background" ? ie() : Z(w.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
const Mn = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: vn()
});
function Nn(t) {
  return `Call applySlateOperations again with a safe, valid plan. ${t.join(" ")}`;
}
function Pn(t) {
  if (typeof t?.message == "string" && t.message.trim()) return t.message.trim();
  const e = (t?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${e} ${e === 1 ? "change" : "changes"} to the slate.`;
}
export {
  xe as BORDER_STYLES,
  ot as CONNECTOR_KEYS,
  Dt as CONNECTOR_STYLE_KEYS,
  Ae as DEFAULT_FONTS,
  wn as DOCUMENT_OPTION_KEYS,
  ke as EFFECTS,
  Rt as LAYOUTS,
  Pe as LIMITS,
  mt as NODE_INTENT_KEYS,
  L as NODE_KEYS,
  jt as NODE_STYLE_KEYS,
  Qt as NOTE_READ_KEYS,
  Yt as OPERATION_FIELDS,
  W as OperationPlanError,
  zt as PRESETS,
  wt as READ_LIMITS,
  dt as SLATE_KEYS,
  xt as SLATE_OPERATION_KINDS,
  Mn as SLATE_OPERATION_TOOL,
  Qe as alignPositions,
  _n as applyPlanToJSON,
  Re as backgroundOf,
  _t as contractLimits,
  $t as contractLists,
  En as describeOperations,
  tn as distributePositions,
  Pn as naturalOperationFallback,
  Nn as operationPlanRetryPrompt,
  ue as readConnector,
  he as readNote,
  In as readSlate,
  de as rotatedBounds,
  vn as slateOperationPlanSchema,
  Sn as summarizeSlate,
  nn as tidyPositions,
  On as toSlateDocument,
  It as toStoredSlate,
  sn as treePositions,
  Xe as validatePlan
};
