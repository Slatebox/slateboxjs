import { N as dt } from "./NoteDefaults-1xFW0br8.mjs";
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
function lt() {
  return Array.from(B.keys());
}
const oe = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", ht = {
  mystery: {
    id: "sb-mystery",
    types: ["text", "vect"],
    display: "Mystery",
    description: "Gentle fade in with a subtle zoom",
    css: `.sb-animation-mystery{animation:sb-mystery ${oe}}@keyframes sb-mystery{0%{opacity:0;transform:scale(1.2)}50%{opacity:.5;transform:scale(1.1)}100%{opacity:1;transform:scale(1)}}`
  },
  fadeSlideUp: {
    id: "sb-fade-slide-up",
    types: ["text", "vect"],
    display: "Fade up",
    description: "Smooth upward entrance",
    css: `.sb-animation-fadeSlideUp{animation:sb-fade-slide-up ${oe}}@keyframes sb-fade-slide-up{0%{opacity:0;transform:translateY(100%) rotateX(40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  fadeSlideDown: {
    id: "sb-fade-slide-down",
    types: ["text", "vect"],
    display: "Fade down",
    description: "Smooth downward entrance",
    css: `.sb-animation-fadeSlideDown{animation:sb-fade-slide-down ${oe}}@keyframes sb-fade-slide-down{0%{opacity:0;transform:translateY(-100%) rotateX(-40deg)}100%{opacity:1;transform:translateY(0) rotateX(0)}}`
  },
  bumpUpIn: {
    id: "sb-bump-up-in",
    types: ["text", "vect"],
    display: "Bump up",
    description: "Playful bounce from below",
    css: `.sb-animation-bumpUpIn{animation:sb-bump-up-in ${oe}}@keyframes sb-bump-up-in{0%{opacity:0;transform:scale(.8) rotate(-3deg) translateY(100%)}55%{opacity:.8;transform:scale(1.1) rotate(2deg) translateY(-20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
  },
  bumpDownIn: {
    id: "sb-bump-down-in",
    types: ["text", "vect"],
    display: "Bump down",
    description: "Playful bounce from above",
    css: `.sb-animation-bumpDownIn{animation:sb-bump-down-in ${oe}}@keyframes sb-bump-down-in{0%{opacity:0;transform:scale(.8) rotate(3deg) translateY(-100%)}55%{opacity:.8;transform:scale(1.1) rotate(-2deg) translateY(20%)}100%{opacity:1;transform:scale(1) translateY(0)}}`
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
    css: `.sb-animation-smoke{animation:sb-smoke ${oe}}@keyframes sb-smoke{0%{opacity:0;transform:scale(1.5) rotate(5deg);filter:blur(10px)}55%{opacity:.75;transform:scale(1.1) rotate(-2deg);filter:blur(3px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}`
  },
  fractured: {
    id: "sb-fractured",
    types: ["text", "vect"],
    display: "Fractured",
    description: "Sharp geometric reveal",
    css: `.sb-animation-fractured{animation:sb-fractured ${oe}}@keyframes sb-fractured{0%{opacity:0;clip-path:polygon(50% 50%,50% 50%,50% 50%);transform:rotate(45deg) scale(.3)}55%{opacity:.7;clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);transform:rotate(-8deg) scale(1.1)}100%{opacity:1;clip-path:polygon(0 0,100% 0,100% 100%,0 100%);transform:rotate(0) scale(1)}}`
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
function ut() {
  return { ...ht };
}
function z(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
const pt = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, ft = /^https?:\/\/[^\s]+$/i, Ze = 2e3, mt = /^[A-Za-z0-9_-]{1,64}$/;
function Le(e, t) {
  if (typeof t != "string") return;
  const n = t.trim().toLowerCase();
  return e.find((s) => s.toLowerCase() === n);
}
function j(e, t, n) {
  switch (e.type) {
    case "string":
      return t === null && e.nullable ? null : typeof t != "string" ? `${n} must be a string.` : t.length > e.maxLength ? `${n} must be at most ${e.maxLength} characters.` : e.minLength && t.trim().length < e.minLength ? `${n} must not be empty.` : null;
    case "number":
      return typeof t != "number" || !Number.isFinite(t) || t < e.min || t > e.max ? `${n} must be a number from ${e.min} to ${e.max}.` : null;
    case "boolean":
      return typeof t == "boolean" ? null : `${n} must be true or false.`;
    case "enum":
      return t === null && e.nullable || (e.caseless ? Le(e.values, t) : e.values.find((r) => r === t)) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")}.`;
    case "list":
      return Array.isArray(t) && t.every((s) => typeof s == "string" && e.values.includes(s)) && new Set(t).size === t.length ? null : `${n} must be a list of different values from: ${e.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof t == "string" && pt.test(t.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return z(t) && Object.keys(t).every((s) => s === "x" || s === "y") && [t.x, t.y].every((s) => typeof s == "number" && Number.isFinite(s) && Math.abs(s) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return z(t) ? null : `${n} must be an object.`;
    case "url":
      return t === null && e.nullable || typeof t == "string" && t.length <= Ze && ft.test(t.trim()) ? null : `${n} must be an http or https address${e.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return t === null && e.nullable || typeof t == "string" && mt.test(t) ? null : `${n} must be 1 to 64 letters, digits, _ or -${e.nullable ? ", or null" : ""}.`;
  }
}
function Z(e) {
  switch (e.type) {
    case "string":
      return { type: e.nullable ? ["string", "null"] : "string", maxLength: e.maxLength, ...e.minLength ? { minLength: e.minLength } : {} };
    case "number":
      return { type: "number", minimum: e.min, maximum: e.max };
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return e.nullable ? { type: ["string", "null"], enum: [...e.values, null] } : { type: "string", enum: [...e.values] };
    case "list":
      return { type: "array", items: { type: "string", enum: [...e.values] }, uniqueItems: !0 };
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
        maxLength: Ze,
        pattern: "^https?://\\S+$",
        description: "An http or https address."
      };
    case "id":
      return { type: e.nullable ? ["string", "null"] : "string", pattern: "^[A-Za-z0-9_-]{1,64}$" };
  }
}
const q = (e) => ({
  store: (t, n) => {
    t[e] = n;
  },
  read: (t) => t[e]
}), gt = ["solid", "dashed", "dotted", "combo"], yt = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), bt = ["front", "back"], xt = ["left", "middle", "right"], wt = ["top", "middle", "bottom"], Ne = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), Xe = Object.keys(Ne), N = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...q("text") },
  shape: {
    spec: (e) => ({ type: "enum", values: e.shapes, caseless: !0 }),
    description: "A shape registered with the engine.",
    store: (e, t, n) => {
      const s = Le(n.shapes, t);
      e.shape = s, e.vectorPath = s, e.shapeHint = s;
    },
    read: (e) => e.shape || e.shapeHint || e.vectorPath || "rectangle"
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
    spec: () => ({ type: "enum", values: gt }),
    description: "Border line style.",
    ...q("borderStyle")
  },
  opacity: { spec: () => ({ type: "number", min: 0, max: 1 }), description: "Note opacity from 0 to 1.", ...q("opacity") },
  fontFamily: {
    spec: (e) => ({ type: "enum", values: e.fonts, caseless: !0 }),
    description: "A font this instance offers.",
    store: (e, t, n) => {
      e.fontFamily = Le(n.fonts, t);
    },
    read: (e) => e.fontFamily
  },
  fontSize: { spec: () => ({ type: "number", min: 1, max: 500 }), description: "Font size.", ...q("fontSize") },
  textXAlign: { spec: () => ({ type: "enum", values: xt }), description: "Horizontal text alignment.", ...q("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: wt }), description: "Vertical text alignment.", ...q("textYAlign") },
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
  category: {
    spec: () => ({ type: "string", minLength: 1, maxLength: 200, nullable: !0 }),
    description: "Makes the note a category of a template, named by this text (the template's AI conversation files notes under it, and presentations pass over it); null makes it an ordinary note.",
    store: (e, t) => {
      t === null ? (e.isCategory = !1, delete e.categoryName) : (e.isCategory = !0, e.categoryName = `${t}`.trim());
    },
    // Read the way the template conversation reads it: a category has a name.
    read: (e) => e.isCategory === !0 && e.categoryName ? e.categoryName : null
  },
  hiddenControls: {
    spec: () => ({ type: "list", values: Xe }),
    description: "Style-bar controls this note leaves off, so people cannot use them on it: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. An empty list shows them all.",
    store: (e, t) => {
      for (const [n, s] of Object.entries(Ne)) e[s] = !t.includes(n);
    },
    read: (e) => Xe.filter((t) => e[Ne[t]] === !1)
  },
  locked: {
    spec: () => ({ type: "boolean" }),
    description: "A locked note cannot be moved, changed or deleted until it is unlocked.",
    store: (e, t) => {
      e.isLocked = t;
    },
    read: (e) => e.isLocked === !0
  }
}, ue = {
  order: {
    spec: { type: "enum", values: bt },
    description: "Bring the note to the front or send it to the back."
  }
}, kt = [...Object.keys(N), ...Object.keys(ue)], vt = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Pe = Object.keys(N).filter((e) => !vt.has(e)), be = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], je = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, Ve = ["left", "right", "above", "below", "center"], Qe = ["row", "column", "grid"], $t = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], _t = ["distribute-horizontal", "distribute-vertical"], Ye = ["row", "column", "grid", "circle", ...$t, ..._t, "tidy", "tree"], Re = ["text", "sticky"], Ot = 75, St = Object.freeze({ x: 20, y: 20 }), It = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), Fe = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, We = 200, Mt = Object.freeze([
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
function ke(e = {}) {
  return {
    shapes: [...e.shapes ?? lt()],
    fonts: [...e.fonts ?? Mt],
    animations: Object.keys(ut()),
    effects: [...yt]
  };
}
function ve(e = {}) {
  return { ...It, ...e.limits || {} };
}
class W extends Error {
  constructor(t, n, s, r) {
    super(s), this.name = "OperationPlanError", this.code = t, this.status = n, r && (this.details = r);
  }
}
const Et = ["bezier", "orthogonal", "straight", "linear", "curved"], Tt = ["cubic", "quadratic"], ne = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: Et }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: Tt }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  toPoint: {
    spec: { type: "point" },
    description: "Move a free end to this point. Only for a connector whose far end is not on a note.",
    field: "targetPoint"
  }
}, ze = Object.keys(ne).filter((e) => e !== "toPoint"), Oe = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, Ae = "__free_", et = ["linear", "radial"], tt = ["horizontal", "vertical", "diagonal"], fe = (e) => ({
  store: (t, n) => {
    t.options[e] = n;
  }
}), He = (e) => ({
  store: (t, n) => {
    t.options.viewPort = { ...t.options.viewPort || {}, [e]: n };
  }
}), ae = {
  name: { spec: { type: "string", minLength: 1, maxLength: 200 }, description: "The slate's name.", ...fe("name") },
  description: { spec: { type: "string", maxLength: 5e3 }, description: "The slate's description.", ...fe("description") },
  background: {
    spec: { type: "object" },
    description: "Canvas background: {color, gradient?: {type, colors, direction?}}.",
    store: (e, t) => {
      const n = { ...e.options.containerStyle || {}, ...Nt(t) };
      delete n.backgroundImage, delete n.backgroundEffect, e.options.containerStyle = n;
    }
  },
  mindMapMode: {
    spec: { type: "boolean" },
    description: "Mind map mode: a theme colours notes by their depth in the connected tree.",
    ...fe("mindMapMode")
  },
  autoResizeNodesBasedOnText: {
    spec: { type: "boolean" },
    description: "Notes grow to fit their text while it is typed.",
    ...fe("autoResizeNodesBasedOnText")
  },
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...He("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...He("snapToObjects") },
  defaultLineColor: {
    spec: { type: "color" },
    description: "The slate's line colour: every connector and every note's line colour takes it, as the Colours panel does.",
    store: (e, t) => {
      e.options.defaultLineColor = t;
      for (const n of e.nodes) {
        n.options.lineColor = t;
        for (const s of n.relationships.associations) s.lineColor = t;
      }
    }
  }
};
function Lt(e, t) {
  if (!z(e)) return [`${t} must be an object {color, gradient?}.`];
  const n = [];
  for (const r of Object.keys(e))
    r !== "color" && r !== "gradient" && n.push(`${t} has an unknown field: ${r}.`);
  const s = j({ type: "color" }, e.color, `${t}.color`);
  if (s && n.push(s), e.gradient !== void 0) {
    const r = e.gradient;
    if (!z(r)) return [...n, `${t}.gradient must be an object {type, colors, direction?}.`];
    for (const a of Object.keys(r))
      ["type", "colors", "direction"].includes(a) || n.push(`${t}.gradient has an unknown field: ${a}.`);
    const i = j({ type: "enum", values: et }, r.type, `${t}.gradient.type`);
    if (i && n.push(i), r.direction !== void 0) {
      const a = j({ type: "enum", values: tt }, r.direction, `${t}.gradient.direction`);
      a && n.push(a);
    }
    !Array.isArray(r.colors) || r.colors.length < 2 || r.colors.length > 8 ? n.push(`${t}.gradient.colors must list 2 to 8 colours.`) : r.colors.forEach((a, p) => {
      const g = j({ type: "color" }, a, `${t}.gradient.colors[${p}]`);
      g && n.push(g);
    });
  }
  return n;
}
function Nt(e) {
  return {
    backgroundColor: e.color,
    backgroundColorAsGradient: !!e.gradient,
    backgroundGradientType: e.gradient?.type ?? "linear",
    backgroundGradientColors: e.gradient?.colors ?? [],
    backgroundGradientStrategy: e.gradient?.direction ?? "horizontal"
  };
}
function nt() {
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
          type: { type: "string", enum: [...et] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: Z({ type: "color" }) },
          direction: { type: "string", enum: [...tt] }
        }
      }
    }
  };
}
function At(e) {
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
const Ct = ["ids", "text", "match", "all", "within", "groupId"], Pt = ["ids", "text", "within", "groupId"];
function re(e, t) {
  if (!z(e)) return [`${t} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const r of Object.keys(e))
    Ct.includes(r) || n.push(`${t} has an unknown field: ${r}.`);
  const s = Pt.filter((r) => e[r] !== void 0);
  if (s.length > 1 && n.push(`${t} must name notes one way, not by ${s.join(" and ")}.`), !s.length && e.all !== !0 && n.push(`${t} must name notes by ids, text, within, groupId or all: true.`), e.ids !== void 0 && (!Array.isArray(e.ids) || !e.ids.length || e.ids.some((r) => typeof r != "string" || !r)) && n.push(`${t}.ids must be a list of note ids.`), e.text !== void 0 && (typeof e.text != "string" || !e.text.trim()) && n.push(`${t}.text must be the text of a note.`), e.match !== void 0) {
    e.text === void 0 && n.push(`${t}.match goes with text.`);
    const r = j({ type: "enum", values: ["exact", "contains"] }, e.match, `${t}.match`);
    r && n.push(r);
  }
  if (e.all !== void 0 && e.all !== !0 && n.push(`${t}.all must be true when given.`), e.groupId !== void 0 && (typeof e.groupId != "string" || !e.groupId) && n.push(`${t}.groupId must be a group id.`), e.within !== void 0) {
    const r = e.within;
    z(r) && Object.keys(r).every((a) => ["x", "y", "width", "height"].includes(a)) && ["x", "y", "width", "height"].every((a) => typeof r[a] == "number" && Number.isFinite(r[a])) && r.width > 0 && r.height > 0 || n.push(`${t}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function st() {
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
const jt = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, ot = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function de(e, t, n, s, r, { required: i = !0, plural: a = `${s}s` } = {}) {
  const p = [];
  if (e === void 0 && !i) return p;
  if (!z(e) || i && !Object.keys(e).length)
    return [i ? `${n} requires at least one ${s}.` : `${n} ${a} must be an object.`];
  const g = Object.keys(e).filter((b) => !t.includes(b));
  g.length && p.push(`${n} contains unsupported ${a}: ${g.join(", ")}.`);
  for (const [b, f] of Object.entries(e))
    t.includes(b) && r(b, f, p);
  return p;
}
function qe(e, t) {
  return (n, s, r) => {
    const i = ue[n]?.spec ?? N[n].spec(e), a = j(i, s, `${t} ${n}`);
    a && r.push(a);
  };
}
function Ge(e) {
  return (t, n, s) => {
    const r = j(ne[t].spec, n, `${e} ${t}`);
    r && s.push(r);
  };
}
function J(e) {
  return Array.isArray(e) && e.length > 0 && e.every((t) => typeof t == "string" && t.length > 0);
}
function Yt(e, t = {}) {
  const n = ke(t), s = ve(t), r = t.userMessage || "";
  if (!z(e)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const i = [];
  for (const o of Object.keys(e))
    o !== "message" && o !== "operations" && i.push(`The plan has an unknown field: ${o}.`);
  (typeof e.message != "string" || !e.message.trim()) && i.push("A natural completion message is required."), !Array.isArray(e.operations) || e.operations.length === 0 ? i.push("At least one slate operation is required.") : e.operations.length > s.operationsPerPlan && i.push(`A plan cannot contain more than ${s.operationsPerPlan} operations.`);
  const a = !!t.existingNodeIds?.length, p = new Set((t.existingNodeIds || []).filter(Boolean)), g = !!t.existingConnectionIds?.length, b = new Set((t.existingConnectionIds || []).filter(Boolean)), f = (o, c) => {
    a && z(o) && Array.isArray(o.ids) && o.ids.some((d) => !p.has(d)) && i.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(e.operations) ? e.operations : []).forEach((o, c) => {
    const d = `Operation ${c + 1}`;
    if (!z(o) || !be.includes(o.kind)) {
      i.push(`${d} has an unsupported kind.`);
      return;
    }
    const O = je[o.kind], $ = Object.keys(o).filter((m) => !O.includes(m));
    for (const m of $) i.push(`${d} has an unknown field: ${m}.`);
    switch (o.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(o.count) || o.count < 1 || o.count > s.notesPerAdd) && i.push(`${d} count must be an integer from 1 to ${s.notesPerAdd}.`), o.preset !== void 0) {
          const w = j({ type: "enum", values: Re }, o.preset, `${d} preset`);
          w && i.push(w);
        }
        const m = z(o.placement) && o.placement.connect === !0;
        if (o.shape !== void 0 || o.preset === void 0 && !m) {
          const w = j(N.shape.spec(n), o.shape, `${d} shape`);
          w && i.push(w);
        }
        for (const w of ["text", "width", "height"]) {
          if (o[w] === void 0) continue;
          const _ = j(N[w].spec(n), o[w], `${d} ${w}`);
          _ && i.push(_);
        }
        o.x === void 0 != (o.y === void 0) && i.push(`${d} needs both x and y, or neither.`);
        for (const w of ["x", "y"]) {
          if (o[w] === void 0) continue;
          const _ = j(N[w].spec(n), o[w], `${d} ${w}`);
          _ && i.push(_);
        }
        o.ids !== void 0 && (!J(o.ids) || new Set(o.ids).size !== o.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : o.ids.some((w) => !Fe.test(w)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(o.count) && o.ids.length > o.count && i.push(`${d} has more ids than notes to add.`));
        const y = o.placement;
        if (y !== void 0)
          if (!z(y))
            i.push(`${d} placement must be an object.`);
          else {
            const w = o.x !== void 0 ? ["arrangement", "gap", ...y.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const _ of Object.keys(y))
              w.includes(_) || i.push(
                o.x !== void 0 && ["relativeTo", "direction", "connect"].includes(_) ? `${d} gives x and y, so placement cannot also give ${_}.` : `${d} placement has an unknown field: ${_}.`
              );
            y.connect !== void 0 && (typeof y.connect != "boolean" ? i.push(`${d} placement.connect must be true or false.`) : y.connect && (y.relativeTo === void 0 && i.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), y.direction === "center" && i.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), y.relativeTo !== void 0 && typeof y.relativeTo != "string" ? i.push(`${d} placement.relativeTo must be a note id.`) : y.relativeTo && a && !p.has(y.relativeTo) && i.push(`${d} references a note that is not in the slate.`);
            for (const [_, X] of [["direction", Ve], ["arrangement", Qe]]) {
              if (y[_] === void 0) continue;
              const l = j({ type: "enum", values: X }, y[_], `${d} placement.${_}`);
              l && i.push(l);
            }
            if (y.gap !== void 0) {
              const _ = j({ type: "number", min: 0, max: 2e3 }, y.gap, `${d} placement.gap`);
              _ && i.push(_);
            }
          }
        i.push(...de(o.style, Pe, d, "node style", qe(n, d), { required: !1 })), J(o.ids) && o.ids.forEach((w) => p.add(w));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = re(o.target, `${d} target`);
        if (i.push(...m), m.length || f(o.target, d), o.kind === "update_nodes" && i.push(...de(o.changes, kt, d, "node change", qe(n, d), { plural: "changes" })), o.kind === "delete_nodes" && z(o.target) && o.target.all === !0 && Object.keys(o.target).length === 1 && !ot.test(r) && i.push(`${d} cannot delete every note without an explicit request.`), o.kind === "arrange_nodes") {
          const y = j({ type: "enum", values: Ye }, o.layout, `${d} layout`);
          if (y && i.push(y), o.gap !== void 0) {
            const w = j({ type: "number", min: 0, max: 2e3 }, o.gap, `${d} gap`);
            w && i.push(w);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = re(o.target, `${d} target`);
        if (i.push(...m), m.length || f(o.target, d), o.offset !== void 0) {
          const y = j({ type: "point" }, o.offset, `${d} offset`);
          y && i.push(y);
        }
        o.ids !== void 0 && (!J(o.ids) || new Set(o.ids).size !== o.ids.length ? i.push(`${d} ids must be a list of different note ids.`) : o.ids.some((y) => !Fe.test(y)) ? i.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : z(o.target) && J(o.target.ids) && o.ids.length > o.target.ids.length && i.push(`${d} has more ids than notes to copy.`)), J(o.ids) && o.ids.forEach((y) => p.add(y));
        return;
      }
      case "connect_nodes": {
        const m = re(o.from, `${d} from`);
        if (i.push(...m), m.length || f(o.from, d), z(o.to) && o.to.point !== void 0) {
          Object.keys(o.to).length !== 1 && i.push(`${d} to must be a note selector or {point}, not both.`);
          const _ = j({ type: "point" }, o.to.point, `${d} to.point`);
          _ && i.push(_);
        } else {
          const _ = re(o.to, `${d} to`);
          i.push(..._), _.length || f(o.to, d);
        }
        o.ids !== void 0 && (!J(o.ids) || new Set(o.ids).size !== o.ids.length ? i.push(`${d} ids must be a list of different connector ids.`) : o.ids.some((_) => _.length > We) && i.push(`${d} connector ids can be at most ${We} characters.`)), i.push(...de(o.style, ze, d, "connection style", Ge(d), { required: !1 })), J(o.ids) && o.ids.forEach((_) => b.add(_));
        const y = o.from?.ids, w = o.to?.ids;
        J(y) && J(w) && y.forEach((_) => w.forEach((X) => b.add(`${_}->${X}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = o.connectionIds !== void 0, y = o.from !== void 0 || o.to !== void 0;
        if (m && y && i.push(`${d} names connectors by connectionIds or by from and to, not both.`), !m && !y && i.push(`${d} requires connectionIds or both from and to note selectors.`), m && (J(o.connectionIds) ? g && o.connectionIds.some((w) => !b.has(w)) && i.push(`${d} references connectors that are not in the slate.`) : i.push(`${d} connectionIds must be a list of connector ids.`)), y)
          for (const w of ["from", "to"]) {
            const _ = re(o[w], `${d} ${w}`);
            i.push(..._), _.length || f(o[w], d);
          }
        o.kind === "update_connections" && i.push(...de(o.changes, Object.keys(ne), d, "connection change", Ge(d)));
        return;
      }
      case "update_slate": {
        i.push(
          ...de(o.changes, Object.keys(ae), d, "slate change", (m, y, w) => {
            if (m === "background") {
              w.push(...Lt(y, `${d} background`));
              return;
            }
            const _ = j(ae[m].spec, y, `${d} ${m}`);
            _ && w.push(_);
          })
        ), z(o.changes) && o.changes.background !== void 0 && !jt.test(r) && i.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: i.length === 0, errors: i };
}
function it(e) {
  const { x: t, y: n, width: s, height: r } = e, i = e.rotationAngle || 0;
  if (!i) return { minX: t, minY: n, maxX: t + s, maxY: n + r };
  const a = t + s / 2, p = n + r / 2, g = i * Math.PI / 180, b = Math.cos(g), f = Math.sin(g);
  let o = 1 / 0, c = 1 / 0, d = -1 / 0, O = -1 / 0;
  for (const [m, y] of [[t, n], [t + s, n], [t + s, n + r], [t, n + r]]) {
    const w = m - a, _ = y - p, X = a + w * b - _ * f, l = p + w * f + _ * b;
    o = Math.min(o, X), c = Math.min(c, l), d = Math.max(d, X), O = Math.max(O, l);
  }
  const $ = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: $(o), minY: $(c), maxX: $(d), maxY: $(O) };
}
function Rt(e, t) {
  if (t.length < 2) return [];
  const n = t.map(it), s = Math.min(...n.map((b) => b.minX)), r = Math.max(...n.map((b) => b.maxX)), i = Math.min(...n.map((b) => b.minY)), a = Math.max(...n.map((b) => b.maxY)), p = (s + r) / 2, g = (i + a) / 2;
  return t.map((b, f) => {
    const o = n[f];
    let { x: c, y: d } = b;
    return e === "left" ? c += s - o.minX : e === "right" ? c += r - o.maxX : e === "centerH" ? c += p - (o.minX + o.maxX) / 2 : e === "top" ? d += i - o.minY : e === "bottom" ? d += a - o.maxY : e === "middle" && (d += g - (o.minY + o.maxY) / 2), { id: b.id, x: c, y: d };
  });
}
function zt(e, t) {
  if (t.length < 3) return [];
  const n = t.map((c, d) => ({ box: c, index: d, b: it(c) })), s = e === "horizontal", r = (c) => s ? c.b.minX : c.b.minY, i = (c) => s ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, a = [...n].sort((c, d) => r(c) - r(d) || c.index - d.index), p = r(a[0]), b = (a.reduce((c, d) => Math.max(c, r(d) + i(d)), -1 / 0) - p - a.reduce((c, d) => c + i(d), 0)) / (a.length - 1), f = /* @__PURE__ */ new Map();
  let o = p;
  for (const c of a) {
    const d = o - r(c);
    f.set(c.index, {
      id: c.box.id,
      x: s ? c.box.x + d : c.box.x,
      y: s ? c.box.y : c.box.y + d
    }), o += i(c) + b;
  }
  return n.map((c) => f.get(c.index));
}
function xe(e, t, n) {
  const s = Math.min(e.x + e.width + n - t.x, t.x + t.width + n - e.x), r = Math.min(e.y + e.height + n - t.y, t.y + t.height + n - e.y);
  return s > 0 && r > 0 ? { x: s, y: r } : null;
}
const Bt = 4e6;
function Dt(e, t, { gap: n = 20 } = {}) {
  const s = e.map((f) => ({ ...f })), r = t.map((f) => ({ ...f })), i = (f, o, c, d, O) => {
    const $ = f.x + f.width / 2 - (o.x + o.width / 2), m = f.y + f.height / 2 - (o.y + o.height / 2);
    c.y <= c.x ? f.y += (m > 0 || m === 0 && O > 0 ? 1 : -1) * c.y * d : f.x += ($ > 0 || $ === 0 && O > 0 ? 1 : -1) * c.x * d;
  }, a = Math.max(1, s.length * (r.length + s.length / 2)), p = Math.max(1, Math.min(1e3, Math.floor(Bt / a)));
  let g = !1;
  for (let f = 0; f < p; f += 1) {
    let o = !1;
    for (let c = 0; c < s.length; c += 1) {
      for (const d of r) {
        const O = xe(s[c], d, n);
        O && (i(s[c], d, O, 1, 1), o = !0);
      }
      for (let d = c + 1; d < s.length; d += 1) {
        const O = xe(s[c], s[d], n);
        O && (i(s[c], s[d], O, 0.5, -1), i(s[d], s[c], O, 0.5, 1), o = !0);
      }
    }
    if (!o) {
      g = !0;
      break;
    }
  }
  const b = (f) => Math.round(f * 100) / 100;
  for (const f of s)
    f.x = b(f.x), f.y = b(f.y);
  return g || Xt(s, r, n), s.map(({ id: f, x: o, y: c }) => ({ id: f, x: o, y: c }));
}
function Xt(e, t, n) {
  const s = [...t], r = [];
  for (const d of e)
    s.some((O) => xe(d, O, n)) ? r.push(d) : s.push(d);
  if (!r.length) return;
  const i = Math.min(...e.map((d) => d.x)), a = s.length ? Math.max(...s.map((d) => d.y + d.height)) + n : Math.min(...e.map((d) => d.y)), p = s.length ? Math.max(...s.map((d) => d.x + d.width)) : i, g = r.reduce((d, O) => d + (O.width + n) * (O.height + n), 0), b = Math.max(p - i, Math.sqrt(g) * 1.5, ...r.map((d) => d.width));
  let f = i, o = a, c = 0;
  for (const d of r)
    f > i && f + d.width > i + b && (f = i, o += c + n, c = 0), d.x = f, d.y = o, f += d.width + n, c = Math.max(c, d.height);
}
function Ft(e, t, { gap: n = 48, obstacles: s = [] } = {}) {
  if (!e.length) return [];
  const r = new Map(e.map((l) => [l.id, l])), i = new Map(e.map((l) => [l.id, []])), a = new Map(e.map((l) => [l.id, 0]));
  for (const [l, h] of t)
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
  for (const l of e) a.get(l.id) === 0 && !g.has(l.id) && f(l.id);
  for (const l of e) g.has(l.id) || f(l.id);
  const o = [];
  for (const l of e) {
    const h = g.get(l.id);
    o[h] = Math.max(o[h] ?? 0, l.height);
  }
  const c = Math.min(...e.map((l) => l.x)), d = Math.min(...e.map((l) => l.y)), O = [];
  o.forEach((l, h) => {
    O[h] = h === 0 ? d : O[h - 1] + o[h - 1] + n;
  });
  const $ = /* @__PURE__ */ new Map(), m = (l) => {
    const h = p.get(l), u = h.reduce((I, L) => I + m(L), 0) + n * Math.max(0, h.length - 1), x = Math.max(r.get(l).width, u);
    return $.set(l, x), x;
  }, y = /* @__PURE__ */ new Map(), w = (l, h) => {
    const u = r.get(l), x = p.get(l), I = $.get(l), L = O[g.get(l)];
    if (!x.length) {
      y.set(l, { id: l, x: h + (I - u.width) / 2, y: L });
      return;
    }
    const C = x.reduce((S, T) => S + $.get(T), 0) + n * (x.length - 1);
    let P = h + (I - C) / 2;
    for (const S of x)
      w(S, P), P += $.get(S) + n;
    const Y = y.get(x[0]), M = y.get(x[x.length - 1]), E = (Y.x + r.get(x[0]).width / 2 + M.x + r.get(x[x.length - 1]).width / 2) / 2, v = Math.min(Math.max(E - u.width / 2, h), h + I - u.width);
    y.set(l, { id: l, x: v, y: L });
  };
  let _ = c;
  for (const l of b) {
    const h = m(l);
    w(l, _), _ += h + n;
  }
  const X = e.map((l) => y.get(l.id));
  return Wt(e, X, s, n);
}
function Wt(e, t, n, s) {
  if (!n.length) return t;
  let r = 0;
  for (let i = 0; i <= n.length; i += 1) {
    let a = 0;
    if (t.forEach((p, g) => {
      const b = { ...e[g], x: p.x, y: p.y + r };
      for (const f of n)
        xe(b, f, s) && (a = Math.max(a, f.y + f.height + s - b.y));
    }), !a) break;
    r += a;
  }
  return r ? t.map((i) => ({ ...i, y: i.y + r })) : t;
}
const k = (e) => e.options.id, G = (e, t) => N[t].read(e.options), U = (e) => ({
  x: G(e, "x"),
  y: G(e, "y"),
  width: Number(e.options.width ?? 120),
  height: Number(e.options.height ?? 80)
}), ye = (e) => !!e.targetPoint || `${e.childId || ""}`.startsWith(Ae), le = (e, t) => `${e}->${t}`;
function we(e) {
  return JSON.parse(JSON.stringify(e ?? null));
}
function $e(e) {
  const t = e?.nodes && !Array.isArray(e.nodes), n = t ? e.v2 ?? e : null, s = t ? {
    options: we(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((r) => Ht(r?.v2 ?? r))
  } : we(e || {});
  return s.options || (s.options = {}), s.nodes = (Array.isArray(s.nodes) ? s.nodes : []).map((r) => {
    const i = r?.options ? r : { options: { ...r || {} }, relationships: r?.relationships };
    return i.options.relationships && delete i.options.relationships, i.relationships = { ...i.relationships || {}, associations: [...i.relationships?.associations || []] }, i.relationships.associations.forEach((a) => {
      a.parentId || (a.parentId = i.options.id), a.id || (a.id = le(a.parentId, a.childId));
    }), i;
  }), s;
}
function Ht(e) {
  const t = we(e.options || {});
  t.x !== void 0 && (t.xPos = t.x, delete t.x), t.y !== void 0 && (t.yPos = t.y, delete t.y), t.fontColor !== void 0 && t.foregroundColor === void 0 && (t.foregroundColor = t.fontColor);
  const n = typeof e.getRotation == "function" ? e.getRotation() : void 0;
  typeof n == "number" && (t.rotate = { ...t.rotate || {}, rotationAngle: n });
  const s = e.relationships, r = typeof s?.getAssociations == "function" ? s.getAssociations() : Array.from(s?.associations || []);
  return {
    options: t,
    relationships: {
      associations: r.map(({ parent: i, child: a, ...p }) => we(p))
    }
  };
}
function te(e) {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const s of e.nodes)
    for (const r of s.relationships.associations)
      t.has(r.id) || (t.add(r.id), n.push({ node: s, association: r }));
  return n;
}
const Se = (e) => `${e ?? ""}`.replace(/\s+/g, " ").trim().toLowerCase();
function ee(e, t, n) {
  const s = e.nodes;
  if (t.ids)
    return t.ids.map((r) => s.find((i) => k(i) === r)).filter(Boolean);
  if (t.text !== void 0) {
    const r = Se(t.text), i = s.filter(
      (a) => t.match === "contains" ? Se(a.options.text).includes(r) : Se(a.options.text) === r
    );
    if (i.length > 1 && t.all !== !0)
      throw new W(
        "ambiguous_selector",
        400,
        `${n} "${t.text}" matches ${i.length} notes (${i.map(k).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: i.map((a) => ({ id: k(a), text: a.options.text ?? "" })) }
      );
    return i;
  }
  if (t.within) {
    const r = t.within;
    return s.filter((i) => {
      const a = U(i);
      return a.x >= r.x && a.y >= r.y && a.x + a.width <= r.x + r.width && a.y + a.height <= r.y + r.height;
    });
  }
  return t.groupId !== void 0 ? s.filter((r) => r.options.groupId === t.groupId) : t.all === !0 ? [...s] : [];
}
function qt() {
  const e = "abcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let n = 0; n < 12; n += 1) t += e[Math.floor(Math.random() * e.length)];
  return t;
}
function Gt(e) {
  const t = (i) => {
    const a = (parseInt(i, 16) || 0) / 255;
    return a <= 0.03928 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4);
  }, n = (i) => 0.2126 * t(i.substr(1, 2)) + 0.7152 * t(i.substr(3, 2)) + 0.0722 * t(i.substr(-2)), s = (i, a) => {
    const [p, g] = [n(i), n(a)];
    return (Math.max(p, g) + 0.05) / (Math.min(p, g) + 0.05);
  }, r = /^#[0-9a-f]{6}$/i.test(e) ? e : "#7aa2c8";
  return s(r, "#ffffff") > s(r, "#000000") ? "#ffffff" : "#000000";
}
function Ut(e, t, n) {
  return e.x < t.x + t.width + n && e.x + e.width + n > t.x && e.y < t.y + t.height + n && e.y + e.height + n > t.y;
}
function Kt(e, t, n, s, r, i) {
  let a = e;
  for (let p = 0; p <= t.length; p += 1) {
    const g = t.filter((o) => a.some((c) => Ut({ ...c, width: n, height: s }, o, i)));
    if (!g.length) return a;
    let b = 0, f = 0;
    r === "left" ? b = Math.min(...g.map((o) => o.x - i)) - Math.max(...a.map((o) => o.x + n)) : r === "above" ? f = Math.min(...g.map((o) => o.y - i)) - Math.max(...a.map((o) => o.y + s)) : r === "below" || r === "center" ? f = Math.max(...g.map((o) => o.y + o.height + i)) - Math.min(...a.map((o) => o.y)) : b = Math.max(...g.map((o) => o.x + o.width + i)) - Math.min(...a.map((o) => o.x)), a = a.map((o) => ({ x: o.x + b, y: o.y + f }));
  }
  return a;
}
function rt(e, t) {
  if (t) {
    const n = e.nodes.find((r) => k(r) === t);
    if (n) return n;
    const s = e.nodes.filter((r) => `${r.options.text ?? ""}`.trim().toLowerCase() === t.trim().toLowerCase());
    if (s.length === 1) return s[0];
  }
  return [...e.nodes].sort((n, s) => U(s).x + U(s).width - (U(n).x + U(n).width))[0];
}
function Ce(e, t) {
  const n = t === "grid" ? Math.ceil(Math.sqrt(e)) : e;
  return Array.from({ length: e }, (s, r) => ({
    row: t === "column" ? r : t === "grid" ? Math.floor(r / n) : 0,
    column: t === "column" ? 0 : t === "grid" ? r % n : r
  }));
}
function Jt(e, t, n, s) {
  const r = t.count, i = t.placement || {}, a = i.gap ?? (i.connect ? Ot : 48);
  if (t.x !== void 0 && t.y !== void 0) {
    const c = i.arrangement || "row";
    return { points: Ce(r, c).map(({ row: O, column: $ }) => ({
      x: t.x + $ * (n + a),
      y: t.y + O * (s + a)
    })), arrangement: c, gap: a };
  }
  const p = rt(e, i.relativeTo), g = p ? U(p) : { x: 0, y: 0, width: 160, height: 100 }, b = i.direction || "right", f = i.arrangement || (["left", "right"].includes(b) ? "column" : "row"), o = Ce(r, f).map(({ row: c, column: d }) => {
    let O = g.x + d * (n + a), $ = g.y + c * (s + a);
    return b === "right" && (O += g.width + a), b === "left" && (O -= n + a), b === "below" && ($ += g.height + a), b === "above" && ($ -= s + a), { x: O, y: $ };
  });
  return { points: Kt(o, e.nodes.map(U), n, s, b, a), arrangement: f, gap: a };
}
function Zt(e, t) {
  if (!e) return { childId: `${Ae}${t()}` };
  const n = e.match(/->(__free_.+)$/);
  return { id: e, childId: n ? n[1] : `${Ae}${e.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Ie(e, t) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}~${n}`); ) n += 1;
  return `${t}~${n}`;
}
const Me = (e, t) => JSON.stringify([e, t]);
function Ee(e, t, n) {
  return new W(
    "id_taken",
    409,
    `${e} names ${t} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${t}s in a later operation.`,
    { ids: n }
  );
}
const Ue = (e, t) => JSON.stringify(e) === JSON.stringify(t), Vt = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Te = (e) => JSON.parse(JSON.stringify(e)), me = 1e6, Ke = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, ie = (e) => ({ id: k(e), ...U(e), rotationAngle: G(e, "rotationAngle") });
function ln(e, t, n = {}) {
  const s = ke(n), r = ve(n), i = n.idFactory || qt, a = $e(e), p = Yt(t, {
    ...n,
    existingNodeIds: a.nodes.map(k),
    existingConnectionIds: te(a).map(({ association: c }) => c.id)
  });
  if (!p.valid)
    throw new W("invalid_operation_plan", 400, p.errors.join(" "), { errors: p.errors });
  const g = JSON.stringify(a), b = a.nodes.length, f = [], o = {
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
    const O = d + 1, $ = `Operation ${O}`, m = { operation: O, kind: c.kind, matched: [], changed: [] };
    o.operations.push(m);
    const y = () => o.warnings.push(`${$} matched no notes.`), w = (l) => {
      o.skipped.push({ operation: O, id: k(l), reason: "locked" });
    }, _ = (l) => {
      const h = a.nodes.length + l;
      if (l > 0 && h > r.notesPerSlate && h > b)
        throw new W(
          "note_limit",
          422,
          `${$} would leave ${h} notes; a slate can hold at most ${r.notesPerSlate} notes.`,
          { limit: r.notesPerSlate, operation: O }
        );
    }, X = (l, h) => {
      if (h > 0 && l > r.connectorsPerSlate)
        throw new W(
          "connector_limit",
          422,
          `${$} would leave ${l} connectors; a slate can hold at most ${r.connectorsPerSlate} connectors.`,
          { limit: r.connectorsPerSlate, operation: O }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const l = c.preset ? dt[c.preset] : void 0, h = c.placement?.connect === !0, u = h ? a.nodes.find((R) => k(R) === c.placement.relativeTo) : void 0;
        if (h && !u)
          throw new W("no_match", 409, `${$} placement.relativeTo names no note on the slate to connect from.`, { operation: O });
        if (u && u.options.isLocked === !0) {
          w(u);
          return;
        }
        const x = c.shape ?? l?.shape, I = u ? U(u) : void 0, L = c.width ?? l?.width ?? I?.width ?? (x?.toLowerCase() === "triangle" ? 150 : 180), C = c.height ?? l?.height ?? I?.height ?? (x?.toLowerCase() === "triangle" ? 130 : 110), P = u ?? rt(a, c.placement?.relativeTo), Y = c.style?.backgroundColor || l?.style?.backgroundColor || P?.options.backgroundColor || "#7aa2c8", { points: M, arrangement: E, gap: v } = Jt(a, c, L, C), S = new Set(te(a).map(({ association: R }) => R.id)), T = new Set(a.nodes.map(k)), A = (c.ids || []).filter((R) => T.has(R));
        if (A.length && !n.replay) throw Ee($, "note", A);
        const D = M.map((R, F) => c.ids?.[F] || i());
        _(D.filter((R) => !T.has(R)).length), u && X(S.size + D.filter((R) => !T.has(R)).length, D.length), M.forEach(({ x: R, y: F }, Be) => {
          const K = D[Be];
          if (m.matched.push(K), T.has(K)) return;
          const De = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${Be + 1}`) : c.text : "", pe = u ? Te(u.options) : void 0;
          if (pe) for (const Q of Vt) delete pe[Q];
          const se = pe ? { ...pe, id: K, name: K, text: De, width: L, height: C } : {
            id: K,
            name: K,
            text: De,
            defaultShaped: !0,
            width: L,
            height: C,
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
          x && N.shape.store(se, x, s), N.x.store(se, R, s), N.y.store(se, F, s), u || N.foregroundColor.store(se, Gt(Y), s);
          for (const [Q, _e] of Object.entries(l?.style || {})) N[Q].store(se, _e, s);
          for (const [Q, _e] of Object.entries(c.style || {})) N[Q].store(se, _e, s);
          if (a.nodes.push({ options: se, relationships: { associations: [] } }), m.changed.push(K), o.created.push(K), u) {
            const Q = Ie(S, le(k(u), K));
            S.add(Q), u.relationships.associations.push({ id: Q, parentId: k(u), childId: K, ...Oe }), o.connected.push(Q);
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
        const l = ee(a, c.target, `${$} target`);
        m.matched = l.map(k), l.length || y();
        const h = [];
        for (const u of l) {
          if (u.options.isLocked === !0 && c.changes.locked !== !1) {
            w(u);
            continue;
          }
          const x = JSON.stringify(u.options);
          for (const [I, L] of Object.entries(c.changes))
            ue[I] || N[I].store(u.options, L, s);
          h.push(k(u)), JSON.stringify(u.options) !== x && m.changed.push(k(u));
        }
        if (c.changes.order && h.length) {
          const u = new Set(h), x = a.nodes.map(k), I = a.nodes.filter((C) => u.has(k(C))), L = a.nodes.filter((C) => !u.has(k(C)));
          a.nodes = c.changes.order === "front" ? [...L, ...I] : [...I, ...L], a.nodes.forEach((C, P) => {
            const Y = k(C);
            u.has(Y) && x[P] !== Y && !m.changed.includes(Y) && m.changed.push(Y);
          });
        }
        o.updated.push(...h), h.length && f.push({ kind: "update_nodes", target: { ids: h }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const l = ee(a, c.target, `${$} target`);
        if (m.matched = l.map(k), l.length || y(), !c.target.ids && a.nodes.length > 1 && l.length === a.nodes.length && !ot.test(n.userMessage || ""))
          throw new W("invalid_operation_plan", 400, `${$} cannot delete every note without an explicit request.`);
        const u = /* @__PURE__ */ new Set();
        for (const x of l)
          x.options.isLocked === !0 ? w(x) : u.add(k(x));
        a.nodes = a.nodes.filter((x) => !u.has(k(x)));
        for (const x of a.nodes)
          x.relationships.associations = x.relationships.associations.filter(
            (I) => !u.has(I.parentId) && !u.has(I.childId)
          );
        m.changed = [...u], o.deleted.push(...u), u.size && f.push({ kind: "delete_nodes", target: { ids: [...u] } });
        return;
      }
      case "duplicate_nodes": {
        const l = ee(a, c.target, `${$} target`);
        m.matched = l.map(k), l.length || y();
        const h = c.offset ?? St, u = new Set(a.nodes.map(k)), x = (c.ids || []).filter((M) => u.has(M));
        if (x.length && !n.replay) throw Ee($, "note", x);
        const I = l.map((M, E) => c.ids?.[E] || i());
        _(I.filter((M) => !u.has(M)).length);
        for (const M of l) {
          const E = G(M, "x") + h.x, v = G(M, "y") + h.y;
          if (Math.abs(E) > me || Math.abs(v) > me)
            throw new W(
              "invalid_operation_plan",
              400,
              `${$} would put the copy of ${k(M)} at ${E}, ${v}; a note's position must be from -${me} to ${me}.`
            );
        }
        const L = new Map(l.map((M, E) => [k(M), I[E]])), C = /* @__PURE__ */ new Map();
        l.forEach((M, E) => {
          const v = I[E];
          if (u.has(v)) return;
          const S = { options: { ...Te(M.options), id: v, name: v }, relationships: { associations: [] } };
          N.x.store(S.options, G(M, "x") + h.x, s), N.y.store(S.options, G(M, "y") + h.y, s), a.nodes.push(S), C.set(v, S), m.changed.push(v), o.created.push(v);
        });
        const P = new Set(te(a).map(({ association: M }) => M.id));
        let Y = 0;
        for (const M of l) {
          const E = C.get(L.get(k(M)));
          if (E)
            for (const v of M.relationships.associations) {
              const S = L.get(v.childId);
              if (!S || ye(v)) continue;
              const T = Ie(P, le(k(E), S));
              P.add(T), E.relationships.associations.push({ ...Te(v), id: T, parentId: k(E), childId: S }), o.connected.push(T), Y += 1;
            }
        }
        X(P.size, Y), l.length && f.push({ kind: "duplicate_nodes", target: { ids: l.map(k) }, ids: I, offset: { ...h } });
        return;
      }
      case "connect_nodes": {
        const l = ee(a, c.from, `${$} from`), h = c.to?.point, u = h ? [] : ee(a, c.to, `${$} to`);
        (!l.length || !h && !u.length) && y();
        const x = l.length * (h ? 1 : u.length);
        if (x > r.connectorsPerOperation)
          throw new W(
            "connector_limit",
            422,
            `${$} would join ${x} pairs of notes; one operation may join at most ${r.connectorsPerOperation}.`,
            { limit: r.connectorsPerOperation }
          );
        const I = /* @__PURE__ */ new Set(), L = /* @__PURE__ */ new Map();
        for (const { association: E } of te(a)) {
          I.add(E.id);
          const v = Me(E.parentId, E.childId);
          L.has(v) || L.set(v, E.id);
        }
        const C = [], P = [], Y = [];
        let M = 0;
        for (const E of l) {
          const v = k(E), S = h ? [null] : u.filter((T) => k(T) !== v);
          if (E.options.isLocked === !0) {
            S.length && w(E), M += S.length;
            continue;
          }
          S.length && Y.push(v);
          for (const T of S) {
            const A = c.ids?.[M];
            if (M += 1, !T) {
              const R = Zt(A, i), F = R.id ?? le(v, R.childId);
              if (I.has(F)) {
                n.replay || C.push(F), P.push(F), m.matched.push(F);
                continue;
              }
              E.relationships.associations.push({ id: F, parentId: v, childId: R.childId, targetPoint: { ...h }, ...Oe, ...c.style || {} }), I.add(F), P.push(F), m.matched.push(F), m.changed.push(F), o.connected.push(F);
              continue;
            }
            const D = k(T), V = L.get(Me(v, D));
            if (V) {
              P.push(V), m.matched.push(V);
              continue;
            }
            if (A && I.has(A)) {
              n.replay || C.push(A), P.push(A), m.matched.push(A);
              continue;
            }
            const H = A || Ie(I, le(v, D));
            E.relationships.associations.push({ id: H, parentId: v, childId: D, ...Oe, ...c.style || {} }), I.add(H), L.set(Me(v, D), H), P.push(H), m.matched.push(H), m.changed.push(H), o.connected.push(H);
          }
        }
        if (C.length) throw Ee($, "connector", C);
        if (I.size > r.connectorsPerSlate && m.changed.length)
          throw new W(
            "connector_limit",
            422,
            `A slate can hold at most ${r.connectorsPerSlate} connectors; this plan would leave ${I.size}.`,
            { limit: r.connectorsPerSlate }
          );
        m.changed.length && f.push({
          kind: "connect_nodes",
          from: { ids: Y },
          to: h ? { point: { ...h } } : { ids: u.map(k) },
          ids: P,
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
          const h = new Set(ee(a, c.from, `${$} from`).map(k)), u = new Set(ee(a, c.to, `${$} to`).map(k));
          l = te(a).filter(
            ({ association: x }) => h.has(x.parentId) && u.has(x.childId) || u.has(x.parentId) && h.has(x.childId)
          );
        }
        if (m.matched = l.map(({ association: h }) => h.id), l.length || o.warnings.push(`${$} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: h, association: u } of l)
            h.relationships.associations = h.relationships.associations.filter((x) => x !== u);
          m.changed = [...m.matched], o.disconnected.push(...m.matched), l.length && f.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { association: h } of l) {
          if (c.changes.toPoint !== void 0 && !ye(h))
            throw new W(
              "invalid_operation_plan",
              400,
              `${$} can move only a free end with toPoint; connector ${h.id} ends on a note.`
            );
          const u = JSON.stringify(h);
          for (const [x, I] of Object.entries(c.changes))
            h[ne[x].field || x] = x === "toPoint" ? { ...I } : I;
          JSON.stringify(h) !== u && m.changed.push(h.id);
        }
        o.connectionsUpdated.push(...m.matched), l.length && f.push({ kind: "update_connections", connectionIds: m.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const l = ee(a, c.target, `${$} target`);
        m.matched = l.map(k), l.length || y();
        const h = l.filter((v) => v.options.isLocked !== !0 ? !0 : (w(v), !1));
        if (!h.length) return;
        const u = c.layout;
        let x;
        if (Ke[u]) x = Rt(Ke[u], h.map(ie));
        else if (u === "distribute-horizontal" || u === "distribute-vertical")
          x = zt(u === "distribute-horizontal" ? "horizontal" : "vertical", h.map(ie));
        else if (u === "tidy") {
          const v = new Set(h.map(k)), S = a.nodes.filter((T) => !v.has(k(T))).map(ie);
          x = Dt(h.map(ie), S, { gap: c.gap ?? 20 });
        } else if (u === "tree") {
          const v = te(a).filter(({ association: A }) => !ye(A)).map(({ association: A }) => [A.parentId, A.childId]), S = new Set(h.map(k)), T = a.nodes.filter((A) => !S.has(k(A))).map(ie);
          x = Ft(h.map(ie), v, { gap: c.gap ?? 48, obstacles: T });
        }
        if (x) {
          const v = new Map(h.map((S) => [k(S), S]));
          for (const S of x) {
            const T = v.get(S.id), A = [G(T, "x"), G(T, "y")];
            N.x.store(T.options, S.x, s), N.y.store(T.options, S.y, s), Ue(A, [S.x, S.y]) || m.changed.push(S.id);
          }
          o.updated.push(...h.map(k)), f.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const I = h.map(U), L = c.gap ?? 48, C = Math.min(...I.map((v) => v.x)), P = Math.min(...I.map((v) => v.y)), Y = Math.max(...I.map((v) => v.width), 120), M = Math.max(...I.map((v) => v.height), 80), E = Ce(h.length, c.layout === "circle" ? "row" : c.layout);
        h.forEach((v, S) => {
          const T = [G(v, "x"), G(v, "y")];
          let A, D;
          if (c.layout === "circle") {
            const V = Math.max(180, h.length * 35), H = Math.PI * 2 * S / h.length;
            A = C + V + Math.cos(H) * V, D = P + V + Math.sin(H) * V;
          } else
            A = C + E[S].column * (Y + L), D = P + E[S].row * (M + L);
          N.x.store(v.options, A, s), N.y.store(v.options, D, s), Ue(T, [A, D]) || m.changed.push(k(v));
        }), o.updated.push(...h.map(k)), f.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: c.layout, ...c.gap !== void 0 ? { gap: L } : {} });
        return;
      }
      case "update_slate": {
        const l = c.changes, h = JSON.stringify(a);
        for (const [u, x] of Object.entries(ae))
          l[u] !== void 0 && x.store(a, l[u]);
        JSON.stringify(a) !== h && m.changed.push("slate"), f.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && o.warnings.length) {
    const c = o.warnings[0];
    throw new W("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return o.unchanged = JSON.stringify(a) === g, { slate: a, materializedPlan: { message: t.message.trim(), operations: f }, report: o };
}
const Je = ["id", ...Object.keys(N), "image"], ge = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), he = (e) => e.options.isComment === !0;
function at(e, t) {
  const n = e.options, s = (i) => !t || t.includes(i), r = { id: k(e) };
  for (const [i, a] of Object.entries(N)) {
    if (!s(i)) continue;
    const p = a.read(n);
    r[i] = p === void 0 ? null : p;
  }
  return s("image") && (r.image = n.image || null), r;
}
function ct(e) {
  const t = ye(e), n = { id: e.id, from: e.parentId, to: t ? null : e.childId };
  for (const [s, r] of Object.entries(ne)) {
    if (s === "toPoint") continue;
    const i = e[r.field ?? s];
    n[s] = i === void 0 ? null : i;
  }
  return t && (n.toPoint = e.targetPoint ?? null), n;
}
const ce = (e) => new W("invalid_selection", 400, e);
function Qt(e) {
  const t = {};
  if (e.ids !== void 0 && (t.ids = e.ids), e.within !== void 0 && (t.within = e.within), e.groupId !== void 0 && (t.groupId = e.groupId), e.q !== void 0)
    t.text = e.q, t.all = !0, e.match !== void 0 && (t.match = e.match);
  else if (e.match !== void 0)
    throw ce("match goes with q.");
  if (!Object.keys(t).length) return null;
  const n = re(t, "selection").map(
    (s) => s.replace("selection.text", "q").replace(/selection\./g, "").replace("by text", "by q")
  );
  if (n.length) throw ce(n.join(" "));
  return t;
}
const en = (e) => btoa(encodeURIComponent(JSON.stringify(e))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function tn(e) {
  try {
    const { after: t, at: n } = JSON.parse(decodeURIComponent(atob(e.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof t == "string" && t && Number.isSafeInteger(n) && n >= 0) return { after: t, at: n };
  } catch {
  }
  throw ce("cursor is not one this slate gave. Read again from the first page.");
}
function nn(e, { after: t, at: n }) {
  let s = -1;
  if (e.forEach((r, i) => {
    k(r) === t && (s < 0 || Math.abs(i - n) < Math.abs(s - n)) && (s = i);
  }), s < 0) throw ce("The note this cursor continues from is gone. Read again from the first page.");
  return s + 1;
}
function sn(e) {
  if (!e.length) return null;
  const t = e.map(U), n = Math.min(...t.map((a) => a.x)), s = Math.min(...t.map((a) => a.y)), r = Math.max(...t.map((a) => a.x + a.width)), i = Math.max(...t.map((a) => a.y + a.height));
  return { x: n, y: s, width: r - n, height: i - s };
}
function hn(e, t = {}) {
  const n = $e(e), s = n.nodes.filter((y) => !he(y)), r = t.fields;
  if (r !== void 0) {
    const y = r.filter((w) => !Je.includes(w));
    if (y.length) throw ce(`Unknown note field: ${y.join(", ")}. Choose from ${Je.join(", ")}.`);
  }
  const i = t.limit ?? ge.notes;
  if (!Number.isInteger(i) || i < 1 || i > ge.maxNotes)
    throw ce(`limit must be a whole number from 1 to ${ge.maxNotes}.`);
  const a = t.maxChars ?? ge.maxChars, p = Qt(t), g = p ? ee({ ...n, nodes: s }, p, "selection") : s;
  let b = 0;
  t.cursor !== void 0 && (b = nn(g, tn(t.cursor)));
  const f = new Set(n.nodes.filter(he).map(k)), o = /* @__PURE__ */ new Map();
  for (const { association: y } of te(n)) {
    if (f.has(y.parentId) || f.has(y.childId)) continue;
    const w = o.get(y.parentId) ?? [];
    w.push(y), o.set(y.parentId, w);
  }
  const c = [], d = [];
  let O = 0, $ = b;
  for (; $ < g.length && c.length < i; $ += 1) {
    const y = g[$], w = at(y, r), _ = (o.get(k(y)) ?? []).map(ct), X = JSON.stringify(w).length + JSON.stringify(_).length;
    if (c.length && O + X > a) break;
    O += X, c.push(w), d.push(..._);
  }
  const m = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: At(n.options.containerStyle),
    bounds: sn(s),
    nodeCount: g.length,
    nodes: c,
    connections: d,
    nextCursor: $ < g.length && m ? en({ after: m.id, at: $ - 1 }) : null
  };
}
const on = [
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
function un(e) {
  const t = $e(e), n = new Set(t.nodes.filter(he).map(k)), s = {};
  for (const i of on) t.options[i] !== void 0 && (s[i] = t.options[i]);
  const r = t.nodes.filter((i) => !n.has(k(i))).map((i) => ({
    options: i.options,
    relationships: {
      ...i.relationships,
      associations: i.relationships.associations.filter((a) => !n.has(a.childId))
    }
  }));
  return { options: s, nodes: r, shareId: `${e?.shareId ?? t.options.shareId ?? ""}` };
}
const rn = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "category"], an = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function pn(e) {
  const t = $e(e), n = t.nodes.filter((a) => !he(a)), s = new Set(t.nodes.filter(he).map((a) => a.options.id)), r = n.slice(0, 150).map((a) => {
    const p = at(a, rn);
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
      ...p.category ? { category: p.category } : {}
    };
  }), i = te(t).filter(({ association: a }) => !s.has(a.parentId) && !s.has(a.childId)).slice(0, 250).map(({ association: a }) => {
    const p = ct(a);
    return {
      id: p.id,
      from: p.from,
      to: p.to,
      ..."toPoint" in p ? { toPoint: p.toPoint } : {},
      label: p.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(an.map((g) => [g, p[g] ?? void 0]))
    };
  });
  return {
    name: t.options.name || "",
    description: t.options.description || "",
    nodeCount: n.length,
    nodes: r,
    connections: i
  };
}
function fn(e = {}) {
  const t = ke(e), n = (s, r) => Object.fromEntries(Object.entries(s).map(([i, a]) => [i, { ...Z(r(a)), description: a.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(be.map((s) => [s, { fields: je[s].filter((r) => r !== "kind") }])),
    noteKeys: { ...n(N, (s) => s.spec(t)), ...n(ue, (s) => s.spec) },
    noteStyleKeys: [...Pe],
    connectorKeys: n(ne, (s) => s.spec),
    connectorStyleKeys: [...ze],
    slateKeys: Object.fromEntries(
      Object.entries(ae).map(([s, r]) => [
        s,
        { ...s === "background" ? nt() : Z(r.spec), description: r.description }
      ])
    ),
    selector: st(),
    layouts: [...Ye],
    presets: [...Re],
    limits: ve(e),
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
function cn(e = {}) {
  const t = ke(e), n = ve(e), s = (g) => Object.fromEntries(g.map((b) => [b, Z(N[b].spec(t))])), r = (g) => Object.fromEntries(g.map((b) => [b, Z(ne[b].spec)])), i = st(), a = { type: "array", items: { type: "string" } }, p = be.map((g) => `${g}: ${je[g].filter((b) => b !== "kind").join(", ")}`).join("; ");
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
            kind: { type: "string", enum: [...be] },
            count: { type: "integer", minimum: 1, maximum: n.notesPerAdd },
            ...s(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...Re],
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
                direction: { type: "string", enum: [...Ve] },
                arrangement: { type: "string", enum: [...Qe] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...s(Pe), ...r(ze) }
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
              enum: [...Ye],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(ae).join(", ")}.`,
              properties: {
                ...s(Object.keys(N)),
                ...Object.fromEntries(Object.entries(ue).map(([g, b]) => [g, Z(b.spec)])),
                ...r(Object.keys(ne)),
                ...Object.fromEntries(
                  Object.entries(ae).map(([g, b]) => [g, g === "background" ? nt() : Z(b.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
const mn = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: cn()
});
function gn(e) {
  return `Call applySlateOperations again with a safe, valid plan. ${e.join(" ")}`;
}
function yn(e) {
  if (typeof e?.message == "string" && e.message.trim()) return e.message.trim();
  const t = (e?.operations || []).reduce(
    (n, s) => n + (s.kind === "add_nodes" ? s.count || 0 : 1),
    0
  );
  return `Done — I applied ${t} ${t === 1 ? "change" : "changes"} to the slate.`;
}
export {
  gt as BORDER_STYLES,
  ne as CONNECTOR_KEYS,
  ze as CONNECTOR_STYLE_KEYS,
  Mt as DEFAULT_FONTS,
  on as DOCUMENT_OPTION_KEYS,
  yt as EFFECTS,
  Ye as LAYOUTS,
  It as LIMITS,
  ue as NODE_INTENT_KEYS,
  N as NODE_KEYS,
  Pe as NODE_STYLE_KEYS,
  Je as NOTE_READ_KEYS,
  je as OPERATION_FIELDS,
  W as OperationPlanError,
  Re as PRESETS,
  ge as READ_LIMITS,
  ae as SLATE_KEYS,
  be as SLATE_OPERATION_KINDS,
  mn as SLATE_OPERATION_TOOL,
  Rt as alignPositions,
  ln as applyPlanToJSON,
  At as backgroundOf,
  ve as contractLimits,
  ke as contractLists,
  fn as describeOperations,
  zt as distributePositions,
  yn as naturalOperationFallback,
  gn as operationPlanRetryPrompt,
  ct as readConnector,
  at as readNote,
  hn as readSlate,
  it as rotatedBounds,
  cn as slateOperationPlanSchema,
  pn as summarizeSlate,
  Dt as tidyPositions,
  un as toSlateDocument,
  $e as toStoredSlate,
  Ft as treePositions,
  Yt as validatePlan
};
