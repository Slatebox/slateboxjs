import { N as ae } from "./NoteDefaults-1xFW0br8.mjs";
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
function ce() {
  return Array.from(B.keys());
}
const ot = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", de = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${ot}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${ot}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${ot}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${ot}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${ot}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${ot}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${ot}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
function le() {
  return { ...de };
}
function z(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
const he = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, ue = /^https?:\/\/[^\s]+$/i, Kt = 2e3, pe = /^[A-Za-z0-9_-]{1,64}$/;
function Nt(t, e) {
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
      return e === null && t.nullable || (t.caseless ? Nt(t.values, e) : t.values.find((r) => r === e)) !== void 0 ? null : `${n} must be one of: ${t.values.join(", ")}.`;
    case "color":
      return typeof e == "string" && he.test(e.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return z(e) && Object.keys(e).every((o) => o === "x" || o === "y") && [e.x, e.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return z(e) ? null : `${n} must be an object.`;
    case "url":
      return e === null && t.nullable || typeof e == "string" && e.length <= Kt && ue.test(e.trim()) ? null : `${n} must be an http or https address${t.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return e === null && t.nullable || typeof e == "string" && pe.test(e) ? null : `${n} must be 1 to 64 letters, digits, _ or -${t.nullable ? ", or null" : ""}.`;
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
        maxLength: Kt,
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
}), fe = ["solid", "dashed", "dotted", "combo"], me = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), ge = ["front", "back"], ye = ["left", "middle", "right"], be = ["top", "middle", "bottom"], T = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...q("text") },
  shape: {
    spec: (t) => ({ type: "enum", values: t.shapes, caseless: !0 }),
    description: "A shape registered with the engine.",
    store: (t, e, n) => {
      const o = Nt(n.shapes, e);
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
    spec: () => ({ type: "enum", values: fe }),
    description: "Border line style.",
    ...q("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...q("opacity") },
  fontFamily: {
    spec: (t) => ({ type: "enum", values: t.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (t, e, n) => {
      t.fontFamily = Nt(n.fonts, e);
    },
    read: (t) => t.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...q("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: ye }), description: "Horizontal text alignment.", ...q("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: be }), description: "Vertical text alignment.", ...q("textYAlign") },
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
}, ut = {
  order: {
    spec: { type: "enum", values: ge },
    description: "Bring the note to the front or send it to the back."
  }
}, xe = [...Object.keys(T), ...Object.keys(ut)], we = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Pt = Object.keys(T).filter((t) => !we.has(t)), bt = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Ct = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, Jt = ["left", "right", "above", "below", "center"], Zt = ["row", "column", "grid"], ke = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], ve = ["distribute-horizontal", "distribute-vertical"], jt = ["row", "column", "grid", "circle", ...ke, ...ve, "tidy", "tree"], Yt = ["text", "sticky"], $e = 75, _e = Object.freeze({ x: 20, y: 20 }), Se = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), Dt = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, Xt = 200, Ie = Object.freeze([
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
function kt(t = {}) {
  return {
    shapes: [...t.shapes ?? ce()],
    fonts: [...t.fonts ?? Ie],
    animations: Object.keys(le()),
    effects: [...me]
  };
}
function vt(t = {}) {
  return { ...Se, ...t.limits || {} };
}
class W extends Error {
  constructor(e, n, o, r) {
    super(o), this.name = "OperationPlanError", this.code = e, this.status = n, r && (this.details = r);
  }
}
const Oe = ["bezier", "orthogonal", "straight", "linear", "curved"], Me = ["cubic", "quadratic"], nt = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: Oe }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: Me }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  toPoint: {
    spec: { type: "point" },
    description: "Move a free end to this point. Only for a connector whose far end is not on a note.",
    field: "targetPoint"
  }
}, Rt = Object.keys(nt).filter((t) => t !== "toPoint"), St = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, Tt = "__free_", Vt = ["linear", "radial"], Qt = ["horizontal", "vertical", "diagonal"], ft = (t) => ({
  store: (e, n) => {
    e.options[t] = n;
  }
}), Ft = (t) => ({
  store: (e, n) => {
    e.options.viewPort = { ...e.options.viewPort || {}, [t]: n };
  }
}), at = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...ft("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...ft("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (t, e) => {
      const n = { ...t.options.containerStyle || {}, ...Le(e) };
      delete n.backgroundImage, delete n.backgroundEffect, t.options.containerStyle = n;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: a theme colours notes by their depth in the connected tree.",
    ...ft("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...ft("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...Ft("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...Ft("snapToObjects") },
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
function Ee(t, e) {
  if (!z(t)) return [`${e} must be an object {color, gradient?}.`];
  const n = [];
  for (const r of Object.keys(t))
    r !== "color" && r !== "gradient" && n.push(`${e} has an unknown field: ${r}.`);
  const o = j({ type: "color" }, t.color, `${e}.color`);
  if (o && n.push(o), t.gradient !== void 0) {
    const r = t.gradient;
    if (!z(r)) return [...n, `${e}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(r))
      ["type", "colors", "direction"].includes(a) || n.push(`${e}.gradient has an unknown field: ${a}.`);
    const i = j({ type: "enum", values: Vt }, r.type, `${e}.gradient.type`);
    if (i && n.push(i), r.direction !== void 0) {
      const a = j({ type: "enum", values: Qt }, r.direction, `${e}.gradient.direction`);
      a && n.push(a);
    }
    !Array.isArray(r.colors) || r.colors.length < 2 || r.colors.length > 8 ? n.push(`${e}.gradient.colors must list 2 to 8 colours.`) : r.colors.forEach((a, p) => {
      const g = j({ type: "color" }, a, `${e}.gradient.colors[${p}]`);
      g && n.push(g);
    });
  }
  return n;
}
function Le(t) {
  return {
    backgroundColor: t.color,
    backgroundColorAsGradient: !!t.gradient,
    backgroundGradientType: t.gradient?.type ?? "linear",
    backgroundGradientColors: t.gradient?.colors ?? [],
    backgroundGradientStrategy: t.gradient?.direction ?? "horizontal"
  };
}
function te() {
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
          type: { type: "string", enum: [...Vt] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: Z({ type: "color" }) },
          direction: { type: "string", enum: [...Qt] }
        }
      }
    }
  };
}
function Ne(t) {
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
const Te = ["ids", "text", "match", "all", "within", "groupId"], Ae = ["ids", "text", "within", "groupId"];
function rt(t, e) {
  if (!z(t)) return [`${e} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const r of Object.keys(t))
    Te.includes(r) || n.push(`${e} has an unknown field: ${r}.`);
  const o = Ae.filter((r) => t[r] !== void 0);
  if (o.length > 1 && n.push(`${e} must name notes one way, not by ${o.join(" and ")}.`), !o.length && t.all !== !0 && n.push(`${e} must name notes by ids, text, within, groupId or all: true.`), t.ids !== void 0 && (!Array.isArray(t.ids) || !t.ids.length || t.ids.some((r) => typeof r != "string" || !r)) && n.push(`${e}.ids must be a list of note ids.`), t.text !== void 0 && (typeof t.text != "string" || !t.text.trim()) && n.push(`${e}.text must be the text of a note.`), t.match !== void 0) {
    t.text === void 0 && n.push(`${e}.match goes with text.`);
    const r = j({ type: "enum", values: ["exact", "contains"] }, t.match, `${e}.match`);
    r && n.push(r);
  }
  if (t.all !== void 0 && t.all !== !0 && n.push(`${e}.all must be true when given.`), t.groupId !== void 0 && (typeof t.groupId != "string" || !t.groupId) && n.push(`${e}.groupId must be a group id.`), t.within !== void 0) {
    const r = t.within;
    z(r) && Object.keys(r).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof r[a] == "number" && Number.isFinite(r[a])) && r.width > 0 && r.height > 0 || n.push(`${e}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function ee() {
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
const Pe = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, ne = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function dt(t, e, n, o, r, { required: i = !0, plural: a = `${o}s` } = {}) {
  const p = [];
  if (t === void 0 && !i) return p;
  if (!z(t) || i && !Object.keys(t).length)
    return [i ? `${n} requires at least one ${o}.` : `${n} ${a} must be an object.`];
  const g = Object.keys(t).filter((b) => !e.includes(b));
  g.length && p.push(`${n} contains unsupported ${a}: ${g.join(", ")}.`);
  for (const [b, f] of Object.entries(t))
    e.includes(b) && r(b, f, p);
  return p;
}
function Wt(t, e) {
  return (n, o, r) => {
    const i = ut[n]?.spec ?? T[n].spec(t), a = j(i, o, `${e} ${n}`);
    a && r.push(a);
  };
}
function Ht(t) {
  return (e, n, o) => {
    const r = j(nt[e].spec, n, `${t} ${e}`);
    r && o.push(r);
  };
}
function J(t) {
  return Array.isArray(t) && t.length > 0 && t.every((e) => typeof e == "string" && e.length > 0);
}
function Ce(t, e = {}) {
  const n = kt(e), o = vt(e), r = e.userMessage || "";
  if (!z(t)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const i = [];
  for (const s of Object.keys(t))
    s !== "message" && s !== "operations" && i.push(`The plan has an unknown field: ${s}.`);
  (typeof t.message != "string" || !t.message.trim()) && i.push("A natural completion message is required."), !Array.isArray(t.operations) || t.operations.length === 0 ? i.push("At least one slate operation is required.") : t.operations.length > o.operationsPerPlan && i.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const a = !!e.existingNodeIds?.length, p = new Set((e.existingNodeIds || []).filter(Boolean)), g = !!e.existingConnectionIds?.length, b = new Set((e.existingConnectionIds || []).filter(Boolean)), f = (s, c) => {
    a && z(s) && Array.isArray(s.ids) && s.ids.some((d) => !p.has(d)) && i.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(t.operations) ? t.operations : []).forEach((s, c) => {
    const d = `Operation ${c + 1}`;
    if (!z(s) || !bt.includes(s.kind)) {
      i.push(`${d} has an unsupported kind.`);
      return;
    }
    const S = Ct[s.kind], $ = Object.keys(s).filter((m) => !S.includes(m));
    for (const m of $) i.push(`${d} has an unknown field: ${m}.`);
    switch (s.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(s.count) || s.count < 1 || s.count > o.notesPerAdd) && i.push(`${d} count must be an integer from 1 to ${o.notesPerAdd}.`), s.preset !== void 0) {
          const w = j({ type: "enum", values: Yt }, s.preset, `${d} preset`);
          w && i.push(w);
        }
        const m = z(s.placement) && s.placement.connect === !0;
        if (s.shape !== void 0 || s.preset === void 0 && !m) {
          const w = j(T.shape.spec(n), s.shape, `${d} shape`);
          w && i.push(w);
        }
        for (const w of ["text", "width", "height"]) {
          if (s[w] === void 0) continue;
          const _ = j(T[w].spec(n), s[w], `${d} ${w}`);
          _ && i.push(_);
        }
        s.x === void 0 != (s.y === void 0) && i.push(`${d} needs both x and y, or neither.`);
        for (const w of ["x", "y"]) {
          if (s[w] === void 0) continue;
          const _ = j(T[w].spec(n), s[w], `${d} ${w}`);
          _ && i.push(_);
        }
        s.ids !== void 0 && (!J(s.ids) || new Set(s.ids).size !== s.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : s.ids.some((w) => !Dt.test(w)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(s.count) && s.ids.length > s.count && i.push(`${d} has more ids than notes to add.`));
        const y = s.placement;
        if (y !== void 0)
          if (!z(y))
            i.push(`${d} placement must be an object.`);
          else {
            const w = s.x !== void 0 ? ["arrangement", "gap", ...y.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const _ of Object.keys(y))
              w.includes(_) || i.push(
                s.x !== void 0 && ["relativeTo", "direction", "connect"].includes(_) ? `${d} gives x and y, so placement cannot also give ${_}.` : `${d} placement has an unknown field: ${_}.`
              );
            y.connect !== void 0 && (typeof y.connect != "boolean" ? i.push(`${d} placement.connect must be true or false.`) : y.connect && (y.relativeTo === void 0 && i.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), y.direction === "center" && i.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), y.relativeTo !== void 0 && typeof y.relativeTo != "string" ? i.push(`${d} placement.relativeTo must be a note id.`) : y.relativeTo && a && !p.has(y.relativeTo) && i.push(`${d} references a note that is not in the slate.`);
            for (const [_, X] of [["direction", Jt], ["arrangement", Zt]]) {
              if (y[_] === void 0) continue;
              const l = j({ type: "enum", values: X }, y[_], `${d} placement.${_}`);
              l && i.push(l);
            }
            if (y.gap !== void 0) {
              const _ = j({ type: "number", min: 0, max: 2e3 }, y.gap, `${d} placement.gap`);
              _ && i.push(_);
            }
          }
        i.push(...dt(s.style, Pt, d, "node style", Wt(n, d), { required: !1 })), J(s.ids) && s.ids.forEach((w) => p.add(w));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = rt(s.target, `${d} target`);
        if (i.push(...m), m.length || f(s.target, d), s.kind === "update_nodes" && i.push(...dt(s.changes, xe, d, "node change", Wt(n, d), { plural: "changes" })), s.kind === "delete_nodes" && z(s.target) && s.target.all === !0 && Object.keys(s.target).length === 1 && !ne.test(r) && i.push(`${d} cannot delete every note without an explicit request.`), s.kind === "arrange_nodes") {
          const y = j({ type: "enum", values: jt }, s.layout, `${d} layout`);
          if (y && i.push(y), s.gap !== void 0) {
            const w = j({ type: "number", min: 0, max: 2e3 }, s.gap, `${d} gap`);
            w && i.push(w);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = rt(s.target, `${d} target`);
        if (i.push(...m), m.length || f(s.target, d), s.offset !== void 0) {
          const y = j({ type: "point" }, s.offset, `${d} offset`);
          y && i.push(y);
        }
        s.ids !== void 0 && (!J(s.ids) || new Set(s.ids).size !== s.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : s.ids.some((y) => !Dt.test(y)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : z(s.target) && J(s.target.ids) && s.ids.length > s.target.ids.length && i.push(`${d} has more ids than notes to copy.`)), J(s.ids) && s.ids.forEach((y) => p.add(y));
        return;
      }
      case "connect_nodes": {
        const m = rt(s.from, `${d} from`);
        if (i.push(...m), m.length || f(s.from, d), z(s.to) && s.to.point !== void 0) {
          Object.keys(s.to).length !== 1 && i.push(`${d} to must be a note selector or {point}, not both.`);
          const _ = j({ type: "point" }, s.to.point, `${d} to.point`);
          _ && i.push(_);
        } else {
          const _ = rt(s.to, `${d} to`);
          i.push(..._), _.length || f(s.to, d);
        }
        s.ids !== void 0 && (!J(s.ids) || new Set(s.ids).size !== s.ids.length ? i.push(`${d} ids must be a list of different connector ids.`) : s.ids.some((_) => _.length > Xt) && i.push(`${d} connector ids can be at most ${Xt} characters.`)), i.push(...dt(s.style, Rt, d, "connection style", Ht(d), { required: !1 })), J(s.ids) && s.ids.forEach((_) => b.add(_));
        const y = s.from?.ids, w = s.to?.ids;
        J(y) && J(w) && y.forEach((_) => w.forEach((X) => b.add(`${_}->${X}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = s.connectionIds !== void 0, y = s.from !== void 0 || s.to !== void 0;
        if (m && y && i.push(`${d} names connectors by connectionIds or by from and to, not both.`), !m && !y && i.push(`${d} requires connectionIds or both from and to note selectors.`), m && (J(s.connectionIds) ? g && s.connectionIds.some((w) => !b.has(w)) && i.push(`${d} references connectors that are not in the slate.`) : i.push(`${d} connectionIds must be a list of connector ids.`)), y)
          for (const w of ["from", "to"]) {
            const _ = rt(s[w], `${d} ${w}`);
            i.push(..._), _.length || f(s[w], d);
          }
        s.kind === "update_connections" && i.push(...dt(s.changes, Object.keys(nt), d, "connection change", Ht(d)));
        return;
      }
      case "update_slate": {
        i.push(
          ...dt(s.changes, Object.keys(at), d, "slate change", (m, y, w) => {
            if (m === "background") {
              w.push(...Ee(y, `${d} background`));
              return;
            }
            const _ = j(at[m].spec, y, `${d} ${m}`);
            _ && w.push(_);
          })
        ), z(s.changes) && s.changes.background !== void 0 && !Pe.test(r) && i.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: i.length === 0, errors: i };
}
function se(t) {
  const { x: e, y: n, width: o, height: r } = t, i = t.rotationAngle || 0;
  if (!i) return { minX: e, minY: n, maxX: e + o, maxY: n + r };
  const a = e + o / 2, p = n + r / 2, g = i * Math.PI / 180, b = Math.cos(g), f = Math.sin(g);
  let s = 1 / 0, c = 1 / 0, d = -1 / 0, S = -1 / 0;
  for (const [m, y] of [[e, n], [e + o, n], [e + o, n + r], [e, n + r]]) {
    const w = m - a, _ = y - p, X = a + w * b - _ * f, l = p + w * f + _ * b;
    s = Math.min(s, X), c = Math.min(c, l), d = Math.max(d, X), S = Math.max(S, l);
  }
  const $ = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: $(s), minY: $(c), maxX: $(d), maxY: $(S) };
}
function je(t, e) {
  if (e.length < 2) return [];
  const n = e.map(se), o = Math.min(...n.map((b) => b.minX)), r = Math.max(...n.map((b) => b.maxX)), i = Math.min(...n.map((b) => b.minY)), a = Math.max(...n.map((b) => b.maxY)), p = (o + r) / 2, g = (i + a) / 2;
  return e.map((b, f) => {
    const s = n[f];
    let { x: c, y: d } = b;
    return t === "left" ? c += o - s.minX : t === "right" ? c += r - s.maxX : t === "centerH" ? c += p - (s.minX + s.maxX) / 2 : t === "top" ? d += i - s.minY : t === "bottom" ? d += a - s.maxY : t === "middle" && (d += g - (s.minY + s.maxY) / 2), { id: b.id, x: c, y: d };
  });
}
function Ye(t, e) {
  if (e.length < 3) return [];
  const n = e.map((c, d) => ({ box: c, index: d, b: se(c) })), o = t === "horizontal", r = (c) => o ? c.b.minX : c.b.minY, i = (c) => o ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, a = [...n].sort((c, d) => r(c) - r(d) || c.index - d.index), p = r(a[0]), b = (a.reduce((c, d) => Math.max(c, r(d) + i(d)), -1 / 0) - p - a.reduce((c, d) => c + i(d), 0)) / (a.length - 1), f = /* @__PURE__ */ new Map();
  let s = p;
  for (const c of a) {
    const d = s - r(c);
    f.set(c.index, {
      id: c.box.id,
      x: o ? c.box.x + d : c.box.x,
      y: o ? c.box.y : c.box.y + d
    }), s += i(c) + b;
  }
  return n.map((c) => f.get(c.index));
}
function xt(t, e, n) {
  const o = Math.min(t.x + t.width + n - e.x, e.x + e.width + n - t.x), r = Math.min(t.y + t.height + n - e.y, e.y + e.height + n - t.y);
  return o > 0 && r > 0 ? { x: o, y: r } : null;
}
const Re = 4e6;
function ze(t, e, { gap: n = 20 } = {}) {
  const o = t.map((f) => ({ ...f })), r = e.map((f) => ({ ...f })), i = (f, s, c, d, S) => {
    const $ = f.x + f.width / 2 - (s.x + s.width / 2), m = f.y + f.height / 2 - (s.y + s.height / 2);
    c.y <= c.x ? f.y += (m > 0 || m === 0 && S > 0 ? 1 : -1) * c.y * d : f.x += ($ > 0 || $ === 0 && S > 0 ? 1 : -1) * c.x * d;
  }, a = Math.max(1, o.length * (r.length + o.length / 2)), p = Math.max(1, Math.min(1e3, Math.floor(Re / a)));
  let g = !1;
  for (let f = 0; f < p; f += 1) {
    let s = !1;
    for (let c = 0; c < o.length; c += 1) {
      for (const d of r) {
        const S = xt(o[c], d, n);
        S && (i(o[c], d, S, 1, 1), s = !0);
      }
      for (let d = c + 1; d < o.length; d += 1) {
        const S = xt(o[c], o[d], n);
        S && (i(o[c], o[d], S, 0.5, -1), i(o[d], o[c], S, 0.5, 1), s = !0);
      }
    }
    if (!s) {
      g = !0;
      break;
    }
  }
  const b = (f) => Math.round(f * 100) / 100;
  for (const f of o)
    f.x = b(f.x), f.y = b(f.y);
  return g || Be(o, r, n), o.map(({ id: f, x: s, y: c }) => ({ id: f, x: s, y: c }));
}
function Be(t, e, n) {
  const o = [...e], r = [];
  for (const d of t)
    o.some((S) => xt(d, S, n)) ? r.push(d) : o.push(d);
  if (!r.length) return;
  const i = Math.min(...t.map((d) => d.x)), a = o.length ? Math.max(...o.map((d) => d.y + d.height)) + n : Math.min(...t.map((d) => d.y)), p = o.length ? Math.max(...o.map((d) => d.x + d.width)) : i, g = r.reduce((d, S) => d + (S.width + n) * (S.height + n), 0), b = Math.max(p - i, Math.sqrt(g) * 1.5, ...r.map((d) => d.width));
  let f = i, s = a, c = 0;
  for (const d of r)
    f > i && f + d.width > i + b && (f = i, s += c + n, c = 0), d.x = f, d.y = s, f += d.width + n, c = Math.max(c, d.height);
}
function De(t, e, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!t.length) return [];
  const r = new Map(t.map((l) => [l.id, l])), i = new Map(t.map((l) => [l.id, []])), a = new Map(t.map((l) => [l.id, 0]));
  for (const [l, h] of e)
    !r.has(l) || !r.has(h) || l === h || (i.get(l).push(h), a.set(h, a.get(h) + 1));
  const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), b = [], f = (l) => {
    b.push(l), g.set(l, 0), p.set(l, []);
    const h = [l];
    for (; h.length; ) {
      const u = h.shift();
      for (const x of i.get(u))
        g.has(x) || (g.set(x, g.get(u) + 1), p.set(x, []), p.get(u).push(x), h.push(x));
    }
  };
  for (const l of t) a.get(l.id) === 0 && !g.has(l.id) && f(l.id);
  for (const l of t) g.has(l.id) || f(l.id);
  const s = [];
  for (const l of t) {
    const h = g.get(l.id);
    s[h] = Math.max(s[h] ?? 0, l.height);
  }
  const c = Math.min(...t.map((l) => l.x)), d = Math.min(...t.map((l) => l.y)), S = [];
  s.forEach((l, h) => {
    S[h] = h === 0 ? d : S[h - 1] + s[h - 1] + n;
  });
  const $ = /* @__PURE__ */ new Map(), m = (l) => {
    const h = p.get(l), u = h.reduce((O, N) => O + m(N), 0) + n * Math.max(0, h.length - 1), x = Math.max(r.get(l).width, u);
    return $.set(l, x), x;
  }, y = /* @__PURE__ */ new Map(), w = (l, h) => {
    const u = r.get(l), x = p.get(l), O = $.get(l), N = S[g.get(l)];
    if (!x.length) {
      y.set(l, { id: l, x: h + (O - u.width) / 2, y: N });
      return;
    }
    const P = x.reduce((I, L) => I + $.get(L), 0) + n * (x.length - 1);
    let C = h + (O - P) / 2;
    for (const I of x)
      w(I, C), C += $.get(I) + n;
    const Y = y.get(x[0]), M = y.get(x[x.length - 1]), E = (Y.x + r.get(x[0]).width / 2 + M.x + r.get(x[x.length - 1]).width / 2) / 2, v = Math.min(Math.max(E - u.width / 2, h), h + O - u.width);
    y.set(l, { id: l, x: v, y: N });
  };
  let _ = c;
  for (const l of b) {
    const h = m(l);
    w(l, _), _ += h + n;
  }
  const X = t.map((l) => y.get(l.id));
  return Xe(t, X, o, n);
}
function Xe(t, e, n, o) {
  if (!n.length) return e;
  let r = 0;
  for (let i = 0; i <= n.length; i += 1) {
    let a = 0;
    if (e.forEach((p, g) => {
      const b = { ...t[g], x: p.x, y: p.y + r };
      for (const f of n)
        xt(b, f, o) && (a = Math.max(a, f.y + f.height + o - b.y));
    }), !a) break;
    r += a;
  }
  return r ? e.map((i) => ({ ...i, y: i.y + r })) : e;
}
const k = (t) => t.options.id, G = (t, e) => T[e].read(t.options), U = (t) => ({
  x: G(t, "x"),
  y: G(t, "y"),
  width: Number(t.options.width ?? 120),
  height: Number(t.options.height ?? 80)
}), yt = (t) => !!t.targetPoint || `${t.childId || ""}`.startsWith(Tt), lt = (t, e) => `${t}->${e}`;
function wt(t) {
  return JSON.parse(JSON.stringify(t ?? null));
}
function $t(t) {
  const e = t?.nodes && !Array.isArray(t.nodes), n = e ? t.v2 ?? t : null, o = e ? {
    options: wt(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((r) => Fe(r?.v2 ?? r))
  } : wt(t || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((r) => {
    const i = r?.options ? r : { options: { ...r || {} }, relationships: r?.relationships };
    return i.options.relationships && delete i.options.relationships, i.relationships = { ...i.relationships || {}, associations: [...i.relationships?.associations || []] }, i.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = i.options.id), a.id || (a.id = lt(a.parentId, a.childId));
    }), i;
  }), o;
}
function Fe(t) {
  const e = wt(t.options || {});
  e.x !== void 0 && (e.xPos = e.x, delete e.x), e.y !== void 0 && (e.yPos = e.y, delete e.y), e.fontColor !== void 0 && e.foregroundColor === void 0 && (e.foregroundColor = e.fontColor);
  const n = typeof t.getRotation == "function" ? t.getRotation() : void 0;
  typeof n == "number" && (e.rotate = { ...e.rotate || {}, rotationAngle: n });
  const o = t.relationships, r = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: e,
    relationships: {
      associations: r.map(({ parent: i, child: a, ...p }) => wt(p))
    }
  };
}
function et(t) {
  const e = /* @__PURE__ */ new Set(), n = [];
  for (const o of t.nodes)
    for (const r of o.relationships.associations)
      e.has(r.id) || (e.add(r.id), n.push({ node: o, association: r }));
  return n;
}
const It = (t) => `${t ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function tt(t, e, n) {
  const o = t.nodes;
  if (e.ids)
    return e.ids.map((r) => o.find((i) => k(i) === r)).filter(Boolean);
  if (e.text !== void 0) {
    const r = It(e.text), i = o.filter(
      (a) => e.match === "contains" ? It(a.options.text).includes(r) : It(a.options.text) === r
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
    const r = e.within;
    return o.filter((i) => {
      const a = U(i);
      return a.x >= r.x && a.y >= r.y && a.x + a.width <= r.x + r.width && a.y + a.height <= r.y + r.height;
    });
  }
  return e.groupId !== void 0 ? o.filter((r) => r.options.groupId === e.groupId) : e.all === !0 ? [...o] : [];
}
function We() {
  const t = "abcdefghijklmnopqrstuvwxyz0123456789";
  let e = "";
  for (let n = 0; n < 12; n += 1) e += t[Math.floor(Math.random() * t.length)];
  return e;
}
function He(t) {
  const e = (i) => {
    const a = (parseInt(i, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (i) => 0.2126 * e(i.substr(1, 2)) + 0.7152 * e(i.substr(3, 2)) + 0.0722 * e(i.substr(-2)), o = (i, a) => {
    const [p, g] = [n(i), n(a)];
    return (Math.max(p, g) + 0.05) / (Math.min(p, g) + 0.05);
  }, r = /^#[0-9a-f]{6}$/i.test(t) ? t : "#7aa2c8";
  return o(r, "#ffffff") > o(r, "#000000") ? "#ffffff" : "#000000";
}
function qe(t, e, n) {
  return t.x < e.x + e.width + n && t.x + t.width + n > e.x && t.y < e.y + e.height + n && t.y + t.height + n > e.y;
}
function Ge(t, e, n, o, r, i) {
  let a = t;
  for (let p = 0; p <= e.length; p += 1) {
    const g = e.filter((s) => a.some((c) => qe({ ...c, width: n, height: o }, s, i)));
    if (!g.length) return a;
    let b = 0, f = 0;
    r === "left" ? b = Math.min(...g.map((s) => s.x - i)) - Math.max(...a.map((s) => s.x + n)) : r === "above" ? f = Math.min(...g.map((s) => s.y - i)) - Math.max(...a.map((s) => s.y + o)) : r === "below" || r === "center" ? f = Math.max(...g.map((s) => s.y + s.height + i)) - Math.min(...a.map((s) => s.y)) : b = Math.max(...g.map((s) => s.x + s.width + i)) - Math.min(...a.map((s) => s.x)), a = a.map((s) => ({ x: s.x + b, y: s.y + f }));
  }
  return a;
}
function oe(t, e) {
  if (e) {
    const n = t.nodes.find((r) => k(r) === e);
    if (n) return n;
    const o = t.nodes.filter((r) => `${r.options.text ?? ""}`.trim().toLowerCase() === e.trim().toLowerCase());
    if (o.length === 1) return o[0];
  }
  return [...t.nodes].sort((n, o) => U(o).x + U(o).width - (U(n).x + U(n).width))[0];
}
function At(t, e) {
  const n = e === "grid" ? Math.ceil(Math.sqrt(t)) : t;
  return Array.from({ length: t }, (o, r) => ({
    row: e === "column" ? r : e === "grid" ? Math.floor(r / n) : 0,
    column: e === "column" ? 0 : e === "grid" ? r % n : r
  }));
}
function Ue(t, e, n, o) {
  const r = e.count, i = e.placement || {}, a = i.gap ?? (i.connect ? $e : 48);
  if (e.x !== void 0 && e.y !== void 0) {
    const c = i.arrangement || "row";
    return { points: At(r, c).map(({ row: S, column: $ }) => ({
      x: e.x + $ * (n + a),
      y: e.y + S * (o + a)
    })), arrangement: c, gap: a };
  }
  const p = oe(t, i.relativeTo), g = p ? U(p) : { x: 0, y: 0, width: 160, height: 100 }, b = i.direction || "right", f = i.arrangement || (["left", "right"].includes(b) ? "column" : "row"), s = At(r, f).map(({ row: c, column: d }) => {
    let S = g.x + d * (n + a), $ = g.y + c * (o + a);
    return b === "right" && (S += g.width + a), b === "left" && (S -= n + a), b === "below" && ($ += g.height + a), b === "above" && ($ -= o + a), { x: S, y: $ };
  });
  return { points: Ge(s, t.nodes.map(U), n, o, b, a), arrangement: f, gap: a };
}
function Ke(t, e) {
  if (!t) return { childId: `${Tt}${e()}` };
  const n = t.match(/->(__free_.+)$/);
  return { id: t, childId: n ? n[1] : `${Tt}${t.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Ot(t, e) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}~${n}`); ) n += 1;
  return `${e}~${n}`;
}
const Mt = (t, e) => JSON.stringify([t, e]);
function Et(t, e, n) {
  return new W(
    "id_taken",
    409,
    `${t} names ${e} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${e}s in a later operation.`,
    { ids: n }
  );
}
const qt = (t, e) => JSON.stringify(t) === JSON.stringify(e), Je = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Lt = (t) => JSON.parse(JSON.stringify(t)), mt = 1e6, Gt = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, it = (t) => ({ id: k(t), ...U(t), rotationAngle: G(t, "rotationAngle") });
function cn(t, e, n = {}) {
  const o = kt(n), r = vt(n), i = n.idFactory || We, a = $t(t), p = Ce(e, {
    ...n,
    existingNodeIds: a.nodes.map(k),
    existingConnectionIds: et(a).map(({ association: c }) => c.id)
  });
  if (!p.valid)
    throw new W("invalid_operation_plan", 400, p.errors.join(" "), { errors: p.errors });
  const g = JSON.stringify(a), b = a.nodes.length, f = [], s = {
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
    const S = d + 1, $ = `Operation ${S}`, m = { operation: S, kind: c.kind, matched: [], changed: [] };
    s.operations.push(m);
    const y = () => s.warnings.push(`${$} matched no notes.`), w = (l) => {
      s.skipped.push({ operation: S, id: k(l), reason: "locked" });
    }, _ = (l) => {
      const h = a.nodes.length + l;
      if (l > 0 && h > r.notesPerSlate && h > b)
        throw new W(
          "note_limit",
          422,
          `${$} would leave ${h} notes; a slate can hold at most ${r.notesPerSlate} notes.`,
          { limit: r.notesPerSlate, operation: S }
        );
    }, X = (l, h) => {
      if (h > 0 && l > r.connectorsPerSlate)
        throw new W(
          "connector_limit",
          422,
          `${$} would leave ${l} connectors; a slate can hold at most ${r.connectorsPerSlate} connectors.`,
          { limit: r.connectorsPerSlate, operation: S }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const l = c.preset ? ae[c.preset] : void 0, h = c.placement?.connect === !0, u = h ? a.nodes.find((R) => k(R) === c.placement.relativeTo) : void 0;
        if (h && !u)
          throw new W("no_match", 409, `${$} placement.relativeTo names no note on the slate to connect from.`, { operation: S });
        if (u && u.options.isLocked === !0) {
          w(u);
          return;
        }
        const x = c.shape ?? l?.shape, O = u ? U(u) : void 0, N = c.width ?? l?.width ?? O?.width ?? (x?.toLowerCase() === "triangle" ? 150 : 180), P = c.height ?? l?.height ?? O?.height ?? (x?.toLowerCase() === "triangle" ? 130 : 110), C = u ?? oe(a, c.placement?.relativeTo), Y = c.style?.backgroundColor || l?.style?.backgroundColor || C?.options.backgroundColor || "#7aa2c8", { points: M, arrangement: E, gap: v } = Ue(a, c, N, P), I = new Set(et(a).map(({ association: R }) => R.id)), L = new Set(a.nodes.map(k)), A = (c.ids || []).filter((R) => L.has(R));
        if (A.length && !n.replay) throw Et($, "note", A);
        const D = M.map((R, F) => c.ids?.[F] || i());
        _(D.filter((R) => !L.has(R)).length), u && X(I.size + D.filter((R) => !L.has(R)).length, D.length), M.forEach(({ x: R, y: F }, zt) => {
          const K = D[zt];
          if (m.matched.push(K), L.has(K)) return;
          const Bt = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${zt + 1}`) : c.text : "", pt = u ? Lt(u.options) : void 0;
          if (pt) for (const Q of Je) delete pt[Q];
          const st = pt ? { ...pt, id: K, name: K, text: Bt, width: N, height: P } : {
            id: K,
            name: K,
            text: Bt,
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
          x && T.shape.store(st, x, o), T.x.store(st, R, o), T.y.store(st, F, o), u || T.foregroundColor.store(st, He(Y), o);
          for (const [Q, _t] of Object.entries(l?.style || {})) T[Q].store(st, _t, o);
          for (const [Q, _t] of Object.entries(c.style || {})) T[Q].store(st, _t, o);
          if (a.nodes.push({ options: st, relationships: { associations: [] } }), m.changed.push(K), s.created.push(K), u) {
            const Q = Ot(I, lt(k(u), K));
            I.add(Q), u.relationships.associations.push({ id: Q, parentId: k(u), childId: K, ...St }), s.connected.push(Q);
          }
        });
        const { placement: V, ...H } = c;
        f.push({
          ...H,
          ids: D,
          x: M[0].x,
          y: M[0].y,
          placement: { arrangement: E, gap: v, ...u ? { relativeTo: k(u), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = tt(a, c.target, `${$} target`);
        m.matched = l.map(k), l.length || y();
        const h = [];
        for (const u of l) {
          if (u.options.isLocked === !0 && c.changes.locked !== !1) {
            w(u);
            continue;
          }
          const x = JSON.stringify(u.options);
          for (const [O, N] of Object.entries(c.changes))
            ut[O] || T[O].store(u.options, N, o);
          h.push(k(u)), JSON.stringify(u.options) !== x && m.changed.push(k(u));
        }
        if (c.changes.order && h.length) {
          const u = new Set(h), x = a.nodes.map(k), O = a.nodes.filter((P) => u.has(k(P))), N = a.nodes.filter((P) => !u.has(k(P)));
          a.nodes = c.changes.order === "front" ? [...N, ...O] : [...O, ...N], a.nodes.forEach((P, C) => {
            const Y = k(P);
            u.has(Y) && x[C] !== Y && !m.changed.includes(Y) && m.changed.push(Y);
          });
        }
        s.updated.push(...h), h.length && f.push({ kind: "update_nodes", target: { ids: h }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const l = tt(a, c.target, `${$} target`);
        if (m.matched = l.map(k), l.length || y(), !c.target.ids && a.nodes.length > 1 && l.length === a.nodes.length && !ne.test(n.userMessage || ""))
          throw new W("invalid_operation_plan", 400, `${$} cannot delete every note without an explicit request.`);
        const u = /* @__PURE__ */ new Set();
        for (const x of l)
          x.options.isLocked === !0 ? w(x) : u.add(k(x));
        a.nodes = a.nodes.filter((x) => !u.has(k(x)));
        for (const x of a.nodes)
          x.relationships.associations = x.relationships.associations.filter(
            (O) => !u.has(O.parentId) && !u.has(O.childId)
          );
        m.changed = [...u], s.deleted.push(...u), u.size && f.push({ kind: "delete_nodes", target: { ids: [...u] } });
        return;
      }
      case "duplicate_nodes": {
        const l = tt(a, c.target, `${$} target`);
        m.matched = l.map(k), l.length || y();
        const h = c.offset ?? _e, u = new Set(a.nodes.map(k)), x = (c.ids || []).filter((M) => u.has(M));
        if (x.length && !n.replay) throw Et($, "note", x);
        const O = l.map((M, E) => c.ids?.[E] || i());
        _(O.filter((M) => !u.has(M)).length);
        for (const M of l) {
          const E = G(M, "x") + h.x, v = G(M, "y") + h.y;
          if (Math.abs(E) > mt || Math.abs(v) > mt)
            throw new W(
              "invalid_operation_plan",
              400,
              `${$} would put the copy of ${k(M)} at ${E}, ${v}; a note's position must be from -${mt} to ${mt}.`
            );
        }
        const N = new Map(l.map((M, E) => [k(M), O[E]])), P = /* @__PURE__ */ new Map();
        l.forEach((M, E) => {
          const v = O[E];
          if (u.has(v)) return;
          const I = { options: { ...Lt(M.options), id: v, name: v }, relationships: { associations: [] } };
          T.x.store(I.options, G(M, "x") + h.x, o), T.y.store(I.options, G(M, "y") + h.y, o), a.nodes.push(I), P.set(v, I), m.changed.push(v), s.created.push(v);
        });
        const C = new Set(et(a).map(({ association: M }) => M.id));
        let Y = 0;
        for (const M of l) {
          const E = P.get(N.get(k(M)));
          if (E)
            for (const v of M.relationships.associations) {
              const I = N.get(v.childId);
              if (!I || yt(v)) continue;
              const L = Ot(C, lt(k(E), I));
              C.add(L), E.relationships.associations.push({ ...Lt(v), id: L, parentId: k(E), childId: I }), s.connected.push(L), Y += 1;
            }
        }
        X(C.size, Y), l.length && f.push({ kind: "duplicate_nodes", target: { ids: l.map(k) }, ids: O, offset: { ...h } });
        return;
      }
      case "connect_nodes": {
        const l = tt(a, c.from, `${$} from`), h = c.to?.point, u = h ? [] : tt(a, c.to, `${$} to`);
        (!l.length || !h && !u.length) && y();
        const x = l.length * (h ? 1 : u.length);
        if (x > r.connectorsPerOperation)
          throw new W(
            "connector_limit",
            422,
            `${$} would join ${x} pairs of notes; one operation may join at most ${r.connectorsPerOperation}.`,
            { limit: r.connectorsPerOperation }
          );
        const O = /* @__PURE__ */ new Set(), N = /* @__PURE__ */ new Map();
        for (const { association: E } of et(a)) {
          O.add(E.id);
          const v = Mt(E.parentId, E.childId);
          N.has(v) || N.set(v, E.id);
        }
        const P = [], C = [], Y = [];
        let M = 0;
        for (const E of l) {
          const v = k(E), I = h ? [null] : u.filter((L) => k(L) !== v);
          if (E.options.isLocked === !0) {
            I.length && w(E), M += I.length;
            continue;
          }
          I.length && Y.push(v);
          for (const L of I) {
            const A = c.ids?.[M];
            if (M += 1, !L) {
              const R = Ke(A, i), F = R.id ?? lt(v, R.childId);
              if (O.has(F)) {
                n.replay || P.push(F), C.push(F), m.matched.push(F);
                continue;
              }
              E.relationships.associations.push({ id: F, parentId: v, childId: R.childId, targetPoint: { ...h }, ...St, ...c.style || {} }), O.add(F), C.push(F), m.matched.push(F), m.changed.push(F), s.connected.push(F);
              continue;
            }
            const D = k(L), V = N.get(Mt(v, D));
            if (V) {
              C.push(V), m.matched.push(V);
              continue;
            }
            if (A && O.has(A)) {
              n.replay || P.push(A), C.push(A), m.matched.push(A);
              continue;
            }
            const H = A || Ot(O, lt(v, D));
            E.relationships.associations.push({ id: H, parentId: v, childId: D, ...St, ...c.style || {} }), O.add(H), N.set(Mt(v, D), H), C.push(H), m.matched.push(H), m.changed.push(H), s.connected.push(H);
          }
        }
        if (P.length) throw Et($, "connector", P);
        if (O.size > r.connectorsPerSlate && m.changed.length)
          throw new W(
            "connector_limit",
            422,
            `A slate can hold at most ${r.connectorsPerSlate} connectors; this plan would leave ${O.size}.`,
            { limit: r.connectorsPerSlate }
          );
        m.changed.length && f.push({
          kind: "connect_nodes",
          from: { ids: Y },
          to: h ? { point: { ...h } } : { ids: u.map(k) },
          ids: C,
          ...c.style ? { style: c.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let l;
        if (c.connectionIds) {
          const h = new Set(c.connectionIds);
          l = et(a).filter(({ association: u }) => h.has(u.id));
        } else {
          const h = new Set(tt(a, c.from, `${$} from`).map(k)), u = new Set(tt(a, c.to, `${$} to`).map(k));
          l = et(a).filter(
            ({ association: x }) => h.has(x.parentId) && u.has(x.childId) || u.has(x.parentId) && h.has(x.childId)
          );
        }
        if (m.matched = l.map(({ association: h }) => h.id), l.length || s.warnings.push(`${$} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: h, association: u } of l)
            h.relationships.associations = h.relationships.associations.filter((x) => x !== u);
          m.changed = [...m.matched], s.disconnected.push(...m.matched), l.length && f.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { association: h } of l) {
          if (c.changes.toPoint !== void 0 && !yt(h))
            throw new W(
              "invalid_operation_plan",
              400,
              `${$} can move only a free end with toPoint; connector ${h.id} ends on a note.`
            );
          const u = JSON.stringify(h);
          for (const [x, O] of Object.entries(c.changes))
            h[nt[x].field || x] = x === "toPoint" ? { ...O } : O;
          JSON.stringify(h) !== u && m.changed.push(h.id);
        }
        s.connectionsUpdated.push(...m.matched), l.length && f.push({ kind: "update_connections", connectionIds: m.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const l = tt(a, c.target, `${$} target`);
        m.matched = l.map(k), l.length || y();
        const h = l.filter((v) => v.options.isLocked !== !0 ? !0 : (w(v), !1));
        if (!h.length) return;
        const u = c.layout;
        let x;
        if (Gt[u]) x = je(Gt[u], h.map(it));
        else if (u === "distribute-horizontal" || u === "distribute-vertical")
          x = Ye(u === "distribute-horizontal" ? "horizontal" : "vertical", h.map(it));
        else if (u === "tidy") {
          const v = new Set(h.map(k)), I = a.nodes.filter((L) => !v.has(k(L))).map(it);
          x = ze(h.map(it), I, { gap: c.gap ?? 20 });
        } else if (u === "tree") {
          const v = et(a).filter(({ association: A }) => !yt(A)).map(({ association: A }) => [A.parentId, A.childId]), I = new Set(h.map(k)), L = a.nodes.filter((A) => !I.has(k(A))).map(it);
          x = De(h.map(it), v, { gap: c.gap ?? 48, obstacles: L });
        }
        if (x) {
          const v = new Map(h.map((I) => [k(I), I]));
          for (const I of x) {
            const L = v.get(I.id), A = [G(L, "x"), G(L, "y")];
            T.x.store(L.options, I.x, o), T.y.store(L.options, I.y, o), qt(A, [I.x, I.y]) || m.changed.push(I.id);
          }
          s.updated.push(...h.map(k)), f.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const O = h.map(U), N = c.gap ?? 48, P = Math.min(...O.map((v) => v.x)), C = Math.min(...O.map((v) => v.y)), Y = Math.max(...O.map((v) => v.width), 120), M = Math.max(...O.map((v) => v.height), 80), E = At(h.length, c.layout === "circle" ? "row" : c.layout);
        h.forEach((v, I) => {
          const L = [G(v, "x"), G(v, "y")];
          let A, D;
          if (c.layout === "circle") {
            const V = Math.max(180, h.length * 35), H = Math.PI * 2 * I / h.length;
            A = P + V + Math.cos(H) * V, D = C + V + Math.sin(H) * V;
          } else
            A = P + E[I].column * (Y + N), D = C + E[I].row * (M + N);
          T.x.store(v.options, A, o), T.y.store(v.options, D, o), qt(L, [A, D]) || m.changed.push(k(v));
        }), s.updated.push(...h.map(k)), f.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: c.layout, ...c.gap !== void 0 ? { gap: N } : {} });
        return;
      }
      case "update_slate": {
        const l = c.changes, h = JSON.stringify(a);
        for (const [u, x] of Object.entries(at))
          l[u] !== void 0 && x.store(a, l[u]);
        JSON.stringify(a) !== h && m.changed.push("slate"), f.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && s.warnings.length) {
    const c = s.warnings[0];
    throw new W("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return s.unchanged = JSON.stringify(a) === g, { slate: a, materializedPlan: { message: e.message.trim(), operations: f }, report: s };
}
const Ut = ["id", ...Object.keys(T), "image"], gt = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), ht = (t) => t.options.isComment === !0;
function ie(t, e) {
  const n = t.options, o = (i) => !e || e.includes(i), r = { id: k(t) };
  for (const [i, a] of Object.entries(T)) {
    if (!o(i)) continue;
    const p = a.read(n);
    r[i] = p === void 0 ? null : p;
  }
  return o("image") && (r.image = n.image || null), r;
}
function re(t) {
  const e = yt(t), n = { id: t.id, from: t.parentId, to: e ? null : t.childId };
  for (const [o, r] of Object.entries(nt)) {
    if (o === "toPoint") continue;
    const i = t[r.field ?? o];
    n[o] = i === void 0 ? null : i;
  }
  return e && (n.toPoint = t.targetPoint ?? null), n;
}
const ct = (t) => new W("invalid_selection", 400, t);
function Ze(t) {
  const e = {};
  if (t.ids !== void 0 && (e.ids = t.ids), t.within !== void 0 && (e.within = t.within), t.groupId !== void 0 && (e.groupId = t.groupId), t.q !== void 0)
    e.text = t.q, e.all = !0, t.match !== void 0 && (e.match = t.match);
  else if (t.match !== void 0)
    throw ct("match goes with q.");
  if (!Object.keys(e).length) return null;
  const n = rt(e, "selection").map(
    (o) => o.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q")
  );
  if (n.length) throw ct(n.join(" "));
  return e;
}
const Ve = (t) => btoa(encodeURIComponent(JSON.stringify(t))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function Qe(t) {
  try {
    const { after: e, at: n } = JSON.parse(decodeURIComponent(atob(t.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof e == "string" && e && Number.isSafeInteger(n) && n >= 0) return { after: e, at: n };
  } catch {
  }
  throw ct("cursor is not one this slate gave. Read again from the first page.");
}
function tn(t, { after: e, at: n }) {
  let o = -1;
  if (t.forEach((r, i) => {
    k(r) === e && (o < 0 || Math.abs(i - n) < Math.abs(o - n)) && (o = i);
  }), o < 0) throw ct("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function en(t) {
  if (!t.length) return null;
  const e = t.map(U), n = Math.min(...e.map((a) => a.x)), o = Math.min(...e.map((a) => a.y)), r = Math.max(...e.map((a) => a.x + a.width)), i = Math.max(...e.map((a) => a.y + a.height));
  return { x: n, y: o, width: r - n, height: i - o };
}
function dn(t, e = {}) {
  const n = $t(t), o = n.nodes.filter((y) => !ht(y)), r = e.fields;
  if (r !== void 0) {
    const y = r.filter((w) => !Ut.includes(w));
    if (y.length) throw ct(`Unknown note field: ${y.join(", ")}. Choose from ${Ut.join(", ")}.`);
  }
  const i = e.limit ?? gt.notes;
  if (!Number.isInteger(i) || i < 1 || i > gt.maxNotes)
    throw ct(`limit must be a whole number from 1 to ${gt.maxNotes}.`);
  const a = e.maxChars ?? gt.maxChars, p = Ze(e), g = p ? tt({ ...n, nodes: o }, p, "selection") : o;
  let b = 0;
  e.cursor !== void 0 && (b = tn(g, Qe(e.cursor)));
  const f = new Set(n.nodes.filter(ht).map(k)), s = /* @__PURE__ */ new Map();
  for (const { association: y } of et(n)) {
    if (f.has(y.parentId) || f.has(y.childId)) continue;
    const w = s.get(y.parentId) ?? [];
    w.push(y), s.set(y.parentId, w);
  }
  const c = [], d = [];
  let S = 0, $ = b;
  for (; $ < g.length && c.length < i; $ += 1) {
    const y = g[$], w = ie(y, r), _ = (s.get(k(y)) ?? []).map(re), X = JSON.stringify(w).length + JSON.stringify(_).length;
    if (c.length && S + X > a) break;
    S += X, c.push(w), d.push(..._);
  }
  const m = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: Ne(n.options.containerStyle),
    bounds: en(o),
    nodeCount: g.length,
    nodes: c,
    connections: d,
    nextCursor: $ < g.length && m ? Ve({ after: m.id, at: $ - 1 }) : null
  };
}
const nn = [
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
function ln(t) {
  const e = $t(t), n = new Set(e.nodes.filter(ht).map(k)), o = {};
  for (const i of nn) e.options[i] !== void 0 && (o[i] = e.options[i]);
  const r = e.nodes.filter((i) => !n.has(k(i))).map((i) => ({
    options: i.options,
    relationships: {
      ...i.relationships,
      associations: i.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: o, nodes: r, shareId: `${t?.shareId ?? e.options.shareId ?? ""}` };
}
const sn = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked"], on = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function hn(t) {
  const e = $t(t), n = e.nodes.filter((a) => !ht(a)), o = new Set(e.nodes.filter(ht).map((a) => a.options.id)), r = n.slice(0, 150).map((a) => {
    const p = ie(a, sn);
    return {
      id: p.id,
      text: `${p.text ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 240),
      shape: p.shape,
      x: p.x,
      y: p.y,
      width: Number(p.width ?? 120),
      height: Number(p.height ?? 80),
      ...p.rotationAngle ? { rotationAngle: p.rotationAngle } : {},
      ...p.locked === !0 ? { locked: !0 } : {}
    };
  }), i = et(e).filter(({ association: a }) => !o.has(a.parentId) && !o.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const p = re(a);
    return {
      id: p.id,
      from: p.from,
      to: p.to,
      ..."toPoint" in p ? { toPoint: p.toPoint } : {},
      label: p.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(on.map((g) => [g, p[g] ?? void 0]))
    };
  });
  return {
    name: e.options.name || "",
    description: e.options.description || "",
    nodeCount: n.length,
    nodes: r,
    connections: i
  };
}
function un(t = {}) {
  const e = kt(t), n = (o, r) => Object.fromEntries(Object.entries(o).map(([i, a]) => [i, { ...Z(r(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(bt.map((o) => [o, { fields: Ct[o].filter((r) => r !== "kind") }])),
    noteKeys: { ...n(T, (o) => o.spec(e)), ...n(ut, (o) => o.spec) },
    noteStyleKeys: [...Pt],
    connectorKeys: n(nt, (o) => o.spec),
    connectorStyleKeys: [...Rt],
    slateKeys: Object.fromEntries(
      Object.entries(at).map(([o, r]) => [
        o,
        { ...o === "background" ? te() : Z(r.spec), description: r.description }
      ])
    ),
    selector: ee(),
    layouts: [...jt],
    presets: [...Yt],
    limits: vt(t),
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
function rn(t = {}) {
  const e = kt(t), n = vt(t), o = (g) => Object.fromEntries(g.map((b) => [b, Z(T[b].spec(e))])), r = (g) => Object.fromEntries(g.map((b) => [b, Z(nt[b].spec)])), i = ee(), a = { type: "array", items: { type: "string" } }, p = bt.map((g) => `${g}: ${Ct[g].filter((b) => b !== "kind").join(", ")}`).join("; ");
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
          description: `Fields by kind. ${p}.`,
          properties: {
            kind: { type: "string", enum: [...bt] },
            count: { type: "integer", minimum: 1, maximum: n.notesPerAdd },
            ...o(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...Yt],
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
                direction: { type: "string", enum: [...Jt] },
                arrangement: { type: "string", enum: [...Zt] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...o(Pt), ...r(Rt) }
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
              enum: [...jt],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(at).join(", ")}.`,
              properties: {
                ...o(Object.keys(T)),
                ...Object.fromEntries(Object.entries(ut).map(([g, b]) => [g, Z(b.spec)])),
                ...r(Object.keys(nt)),
                ...Object.fromEntries(
                  Object.entries(at).map(([g, b]) => [g, g === "background" ? te() : Z(b.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
const pn = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: rn()
});
function fn(t) {
  return `Call applySlateOperations again with a safe, valid plan. ${t.join(" ")}`;
}
function mn(t) {
  if (typeof t?.message == "string" && t.message.trim()) return t.message.trim();
  const e = (t?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${e} ${e === 1 ? "change" : "changes"} to the slate.`;
}
export {
  fe as BORDER_STYLES,
  nt as CONNECTOR_KEYS,
  Rt as CONNECTOR_STYLE_KEYS,
  Ie as DEFAULT_FONTS,
  nn as DOCUMENT_OPTION_KEYS,
  me as EFFECTS,
  jt as LAYOUTS,
  Se as LIMITS,
  ut as NODE_INTENT_KEYS,
  T as NODE_KEYS,
  Pt as NODE_STYLE_KEYS,
  Ut as NOTE_READ_KEYS,
  Ct as OPERATION_FIELDS,
  W as OperationPlanError,
  Yt as PRESETS,
  gt as READ_LIMITS,
  at as SLATE_KEYS,
  bt as SLATE_OPERATION_KINDS,
  pn as SLATE_OPERATION_TOOL,
  je as alignPositions,
  cn as applyPlanToJSON,
  Ne as backgroundOf,
  vt as contractLimits,
  kt as contractLists,
  un as describeOperations,
  Ye as distributePositions,
  mn as naturalOperationFallback,
  fn as operationPlanRetryPrompt,
  re as readConnector,
  ie as readNote,
  dn as readSlate,
  se as rotatedBounds,
  rn as slateOperationPlanSchema,
  hn as summarizeSlate,
  ze as tidyPositions,
  ln as toSlateDocument,
  $t as toStoredSlate,
  De as treePositions,
  Ce as validatePlan
};
