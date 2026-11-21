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
function Ne(e, t) {
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
      return t === null && e.nullable || (e.caseless ? Ne(e.values, t) : e.values.find((r) => r === t)) !== void 0 ? null : `${n} must be one of: ${e.values.join(", ")}.`;
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
function U(e) {
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
}), gt = ["solid", "dashed", "dotted", "combo"], yt = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), bt = ["front", "back"], xt = ["left", "middle", "right"], wt = ["top", "middle", "bottom"], Te = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), Xe = Object.keys(Te), E = {
  text: { spec: () => ({ type: "string", maxLength: 1e4 }), description: "The note's text.", ...q("text") },
  shape: {
    spec: (e) => ({ type: "enum", values: e.shapes, caseless: !0 }),
    description: "A shape registered with the engine.",
    store: (e, t, n) => {
      const s = Ne(n.shapes, t);
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
      e.fontFamily = Ne(n.fonts, t);
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
    spec: () => ({ type: "list", values: Xe }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (e, t) => {
      for (const [n, s] of Object.entries(Te)) e[s] = !t.includes(n);
    },
    read: (e) => Xe.filter((t) => e[Te[t]] === !1)
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
}, kt = [...Object.keys(E), ...Object.keys(ue)], $t = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Pe = Object.keys(E).filter((e) => !$t.has(e)), be = [
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
}, Ve = ["left", "right", "above", "below", "center"], Qe = ["row", "column", "grid"], vt = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], _t = ["distribute-horizontal", "distribute-vertical"], Ye = ["row", "column", "grid", "circle", ...vt, ..._t, "tidy", "tree"], Re = ["text", "sticky"], Ot = 75, St = Object.freeze({ x: 20, y: 20 }), It = Object.freeze({
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
function $e(e = {}) {
  return { ...It, ...e.limits || {} };
}
class W extends Error {
  constructor(t, n, s, r) {
    super(s), this.name = "OperationPlanError", this.code = t, this.status = n, r && (this.details = r);
  }
}
const Ct = ["bezier", "orthogonal", "straight", "linear", "curved"], Et = ["cubic", "quadratic"], ne = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: Ct }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: Et }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  toPoint: {
    spec: { type: "point" },
    description: "Move a free end to this point. Only for a connector whose far end is not on a note.",
    field: "targetPoint"
  }
}, ze = Object.keys(ne).filter((e) => e !== "toPoint"), Oe = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, Le = "__free_", et = ["linear", "radial"], tt = ["horizontal", "vertical", "diagonal"], fe = (e) => ({
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
      const n = { ...e.options.containerStyle || {}, ...Tt(t) };
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
function Nt(e, t) {
  if (!z(e)) return [`${t} must be an object {color, gradient?}.`];
  const n = [];
  for (const r of Object.keys(e))
    r !== "color" && r !== "gradient" && n.push(`${t} has an unknown field: ${r}.`);
  const s = j({ type: "color" }, e.color, `${t}.color`);
  if (s && n.push(s), e.gradient !== void 0) {
    const r = e.gradient;
    if (!z(r)) return [...n, `${t}.gradient must be an object {type, colors, direction?}.`];
    for (const i of Object.keys(r))
      ["type", "colors", "direction"].includes(i) || n.push(`${t}.gradient has an unknown field: ${i}.`);
    const a = j({ type: "enum", values: et }, r.type, `${t}.gradient.type`);
    if (a && n.push(a), r.direction !== void 0) {
      const i = j({ type: "enum", values: tt }, r.direction, `${t}.gradient.direction`);
      i && n.push(i);
    }
    !Array.isArray(r.colors) || r.colors.length < 2 || r.colors.length > 8 ? n.push(`${t}.gradient.colors must list 2 to 8 colours.`) : r.colors.forEach((i, p) => {
      const x = j({ type: "color" }, i, `${t}.gradient.colors[${p}]`);
      x && n.push(x);
    });
  }
  return n;
}
function Tt(e) {
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
      color: U({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: !1,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...et] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: U({ type: "color" }) },
          direction: { type: "string", enum: [...tt] }
        }
      }
    }
  };
}
function Lt(e) {
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
const At = ["ids", "text", "match", "all", "within", "groupId"], Pt = ["ids", "text", "within", "groupId"];
function re(e, t) {
  if (!z(e)) return [`${t} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const r of Object.keys(e))
    At.includes(r) || n.push(`${t} has an unknown field: ${r}.`);
  const s = Pt.filter((r) => e[r] !== void 0);
  if (s.length > 1 && n.push(`${t} must name notes one way, not by ${s.join(" and ")}.`), !s.length && e.all !== !0 && n.push(`${t} must name notes by ids, text, within, groupId or all: true.`), e.ids !== void 0 && (!Array.isArray(e.ids) || !e.ids.length || e.ids.some((r) => typeof r != "string" || !r)) && n.push(`${t}.ids must be a list of note ids.`), e.text !== void 0 && (typeof e.text != "string" || !e.text.trim()) && n.push(`${t}.text must be the text of a note.`), e.match !== void 0) {
    e.text === void 0 && n.push(`${t}.match goes with text.`);
    const r = j({ type: "enum", values: ["exact", "contains"] }, e.match, `${t}.match`);
    r && n.push(r);
  }
  if (e.all !== void 0 && e.all !== !0 && n.push(`${t}.all must be true when given.`), e.groupId !== void 0 && (typeof e.groupId != "string" || !e.groupId) && n.push(`${t}.groupId must be a group id.`), e.within !== void 0) {
    const r = e.within;
    z(r) && Object.keys(r).every((i) => ["x", "y", "width", "height"].includes(i)) && ["x", "y", "width", "height"].every((i) => typeof r[i] == "number" && Number.isFinite(r[i])) && r.width > 0 && r.height > 0 || n.push(`${t}.within must be {x, y, width, height} with a positive width and height.`);
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
function de(e, t, n, s, r, { required: a = !0, plural: i = `${s}s` } = {}) {
  const p = [];
  if (e === void 0 && !a) return p;
  if (!z(e) || a && !Object.keys(e).length)
    return [a ? `${n} requires at least one ${s}.` : `${n} ${i} must be an object.`];
  const x = Object.keys(e).filter((y) => !t.includes(y));
  x.length && p.push(`${n} contains unsupported ${i}: ${x.join(", ")}.`);
  for (const [y, u] of Object.entries(e))
    t.includes(y) && r(y, u, p);
  return p;
}
function qe(e, t) {
  return (n, s, r) => {
    const a = ue[n]?.spec ?? E[n].spec(e), i = j(a, s, `${t} ${n}`);
    i && r.push(i);
  };
}
function Ge(e) {
  return (t, n, s) => {
    const r = j(ne[t].spec, n, `${e} ${t}`);
    r && s.push(r);
  };
}
function Z(e) {
  return Array.isArray(e) && e.length > 0 && e.every((t) => typeof t == "string" && t.length > 0);
}
function Yt(e, t = {}) {
  const n = ke(t), s = $e(t), r = t.userMessage || "";
  if (!z(e)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const a = [];
  for (const o of Object.keys(e))
    o !== "message" && o !== "operations" && a.push(`The plan has an unknown field: ${o}.`);
  (typeof e.message != "string" || !e.message.trim()) && a.push("A natural completion message is required."), !Array.isArray(e.operations) || e.operations.length === 0 ? a.push("At least one slate operation is required.") : e.operations.length > s.operationsPerPlan && a.push(`A plan cannot contain more than ${s.operationsPerPlan} operations.`);
  const i = !!t.existingNodeIds?.length, p = new Set((t.existingNodeIds || []).filter(Boolean)), x = !!t.existingConnectionIds?.length, y = new Set((t.existingConnectionIds || []).filter(Boolean)), u = (o, c) => {
    i && z(o) && Array.isArray(o.ids) && o.ids.some((d) => !p.has(d)) && a.push(`${c} references notes that are not in the slate.`);
  };
  return (Array.isArray(e.operations) ? e.operations : []).forEach((o, c) => {
    const d = `Operation ${c + 1}`;
    if (!z(o) || !be.includes(o.kind)) {
      a.push(`${d} has an unsupported kind.`);
      return;
    }
    const O = je[o.kind], v = Object.keys(o).filter((m) => !O.includes(m));
    for (const m of v) a.push(`${d} has an unknown field: ${m}.`);
    switch (o.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(o.count) || o.count < 1 || o.count > s.notesPerAdd) && a.push(`${d} count must be an integer from 1 to ${s.notesPerAdd}.`), o.preset !== void 0) {
          const w = j({ type: "enum", values: Re }, o.preset, `${d} preset`);
          w && a.push(w);
        }
        const m = z(o.placement) && o.placement.connect === !0;
        if (o.shape !== void 0 || o.preset === void 0 && !m) {
          const w = j(E.shape.spec(n), o.shape, `${d} shape`);
          w && a.push(w);
        }
        for (const w of ["text", "width", "height"]) {
          if (o[w] === void 0) continue;
          const _ = j(E[w].spec(n), o[w], `${d} ${w}`);
          _ && a.push(_);
        }
        o.x === void 0 != (o.y === void 0) && a.push(`${d} needs both x and y, or neither.`);
        for (const w of ["x", "y"]) {
          if (o[w] === void 0) continue;
          const _ = j(E[w].spec(n), o[w], `${d} ${w}`);
          _ && a.push(_);
        }
        o.ids !== void 0 && (!Z(o.ids) || new Set(o.ids).size !== o.ids.length ? a.push(`${d} ids must be a list of different note ids.`) : o.ids.some((w) => !Fe.test(w)) ? a.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(o.count) && o.ids.length > o.count && a.push(`${d} has more ids than notes to add.`));
        const g = o.placement;
        if (g !== void 0)
          if (!z(g))
            a.push(`${d} placement must be an object.`);
          else {
            const w = o.x !== void 0 ? ["arrangement", "gap", ...g.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const _ of Object.keys(g))
              w.includes(_) || a.push(
                o.x !== void 0 && ["relativeTo", "direction", "connect"].includes(_) ? `${d} gives x and y, so placement cannot also give ${_}.` : `${d} placement has an unknown field: ${_}.`
              );
            g.connect !== void 0 && (typeof g.connect != "boolean" ? a.push(`${d} placement.connect must be true or false.`) : g.connect && (g.relativeTo === void 0 && a.push(`${d} placement.connect needs relativeTo, the note to copy and connect from.`), g.direction === "center" && a.push(`${d} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), g.relativeTo !== void 0 && typeof g.relativeTo != "string" ? a.push(`${d} placement.relativeTo must be a note id.`) : g.relativeTo && i && !p.has(g.relativeTo) && a.push(`${d} references a note that is not in the slate.`);
            for (const [_, X] of [["direction", Ve], ["arrangement", Qe]]) {
              if (g[_] === void 0) continue;
              const l = j({ type: "enum", values: X }, g[_], `${d} placement.${_}`);
              l && a.push(l);
            }
            if (g.gap !== void 0) {
              const _ = j({ type: "number", min: 0, max: 2e3 }, g.gap, `${d} placement.gap`);
              _ && a.push(_);
            }
          }
        a.push(...de(o.style, Pe, d, "node style", qe(n, d), { required: !1 })), Z(o.ids) && o.ids.forEach((w) => p.add(w));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = re(o.target, `${d} target`);
        if (a.push(...m), m.length || u(o.target, d), o.kind === "update_nodes" && a.push(...de(o.changes, kt, d, "node change", qe(n, d), { plural: "changes" })), o.kind === "delete_nodes" && z(o.target) && o.target.all === !0 && Object.keys(o.target).length === 1 && !ot.test(r) && a.push(`${d} cannot delete every note without an explicit request.`), o.kind === "arrange_nodes") {
          const g = j({ type: "enum", values: Ye }, o.layout, `${d} layout`);
          if (g && a.push(g), o.gap !== void 0) {
            const w = j({ type: "number", min: 0, max: 2e3 }, o.gap, `${d} gap`);
            w && a.push(w);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = re(o.target, `${d} target`);
        if (a.push(...m), m.length || u(o.target, d), o.offset !== void 0) {
          const g = j({ type: "point" }, o.offset, `${d} offset`);
          g && a.push(g);
        }
        o.ids !== void 0 && (!Z(o.ids) || new Set(o.ids).size !== o.ids.length ? a.push(`${d} ids must be a list of different note ids.`) : o.ids.some((g) => !Fe.test(g)) ? a.push(`${d} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : z(o.target) && Z(o.target.ids) && o.ids.length > o.target.ids.length && a.push(`${d} has more ids than notes to copy.`)), Z(o.ids) && o.ids.forEach((g) => p.add(g));
        return;
      }
      case "connect_nodes": {
        const m = re(o.from, `${d} from`);
        if (a.push(...m), m.length || u(o.from, d), z(o.to) && o.to.point !== void 0) {
          Object.keys(o.to).length !== 1 && a.push(`${d} to must be a note selector or {point}, not both.`);
          const _ = j({ type: "point" }, o.to.point, `${d} to.point`);
          _ && a.push(_);
        } else {
          const _ = re(o.to, `${d} to`);
          a.push(..._), _.length || u(o.to, d);
        }
        o.ids !== void 0 && (!Z(o.ids) || new Set(o.ids).size !== o.ids.length ? a.push(`${d} ids must be a list of different connector ids.`) : o.ids.some((_) => _.length > We) && a.push(`${d} connector ids can be at most ${We} characters.`)), a.push(...de(o.style, ze, d, "connection style", Ge(d), { required: !1 })), Z(o.ids) && o.ids.forEach((_) => y.add(_));
        const g = o.from?.ids, w = o.to?.ids;
        Z(g) && Z(w) && g.forEach((_) => w.forEach((X) => y.add(`${_}->${X}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = o.connectionIds !== void 0, g = o.from !== void 0 || o.to !== void 0;
        if (m && g && a.push(`${d} names connectors by connectionIds or by from and to, not both.`), !m && !g && a.push(`${d} requires connectionIds or both from and to note selectors.`), m && (Z(o.connectionIds) ? x && o.connectionIds.some((w) => !y.has(w)) && a.push(`${d} references connectors that are not in the slate.`) : a.push(`${d} connectionIds must be a list of connector ids.`)), g)
          for (const w of ["from", "to"]) {
            const _ = re(o[w], `${d} ${w}`);
            a.push(..._), _.length || u(o[w], d);
          }
        o.kind === "update_connections" && a.push(...de(o.changes, Object.keys(ne), d, "connection change", Ge(d)));
        return;
      }
      case "update_slate": {
        a.push(
          ...de(o.changes, Object.keys(ae), d, "slate change", (m, g, w) => {
            if (m === "background") {
              w.push(...Nt(g, `${d} background`));
              return;
            }
            const _ = j(ae[m].spec, g, `${d} ${m}`);
            _ && w.push(_);
          })
        ), z(o.changes) && o.changes.background !== void 0 && !jt.test(r) && a.push(`${d} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: a.length === 0, errors: a };
}
function it(e) {
  const { x: t, y: n, width: s, height: r } = e, a = e.rotationAngle || 0;
  if (!a) return { minX: t, minY: n, maxX: t + s, maxY: n + r };
  const i = t + s / 2, p = n + r / 2, x = a * Math.PI / 180, y = Math.cos(x), u = Math.sin(x);
  let o = 1 / 0, c = 1 / 0, d = -1 / 0, O = -1 / 0;
  for (const [m, g] of [[t, n], [t + s, n], [t + s, n + r], [t, n + r]]) {
    const w = m - i, _ = g - p, X = i + w * y - _ * u, l = p + w * u + _ * y;
    o = Math.min(o, X), c = Math.min(c, l), d = Math.max(d, X), O = Math.max(O, l);
  }
  const v = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: v(o), minY: v(c), maxX: v(d), maxY: v(O) };
}
function Rt(e, t) {
  if (t.length < 2) return [];
  const n = t.map(it), s = Math.min(...n.map((y) => y.minX)), r = Math.max(...n.map((y) => y.maxX)), a = Math.min(...n.map((y) => y.minY)), i = Math.max(...n.map((y) => y.maxY)), p = (s + r) / 2, x = (a + i) / 2;
  return t.map((y, u) => {
    const o = n[u];
    let { x: c, y: d } = y;
    return e === "left" ? c += s - o.minX : e === "right" ? c += r - o.maxX : e === "centerH" ? c += p - (o.minX + o.maxX) / 2 : e === "top" ? d += a - o.minY : e === "bottom" ? d += i - o.maxY : e === "middle" && (d += x - (o.minY + o.maxY) / 2), { id: y.id, x: c, y: d };
  });
}
function zt(e, t) {
  if (t.length < 3) return [];
  const n = t.map((c, d) => ({ box: c, index: d, b: it(c) })), s = e === "horizontal", r = (c) => s ? c.b.minX : c.b.minY, a = (c) => s ? c.b.maxX - c.b.minX : c.b.maxY - c.b.minY, i = [...n].sort((c, d) => r(c) - r(d) || c.index - d.index), p = r(i[0]), y = (i.reduce((c, d) => Math.max(c, r(d) + a(d)), -1 / 0) - p - i.reduce((c, d) => c + a(d), 0)) / (i.length - 1), u = /* @__PURE__ */ new Map();
  let o = p;
  for (const c of i) {
    const d = o - r(c);
    u.set(c.index, {
      id: c.box.id,
      x: s ? c.box.x + d : c.box.x,
      y: s ? c.box.y : c.box.y + d
    }), o += a(c) + y;
  }
  return n.map((c) => u.get(c.index));
}
function xe(e, t, n) {
  const s = Math.min(e.x + e.width + n - t.x, t.x + t.width + n - e.x), r = Math.min(e.y + e.height + n - t.y, t.y + t.height + n - e.y);
  return s > 0 && r > 0 ? { x: s, y: r } : null;
}
const Bt = 4e6;
function Dt(e, t, { gap: n = 20 } = {}) {
  const s = e.map((u) => ({ ...u })), r = t.map((u) => ({ ...u })), a = (u, o, c, d, O) => {
    const v = u.x + u.width / 2 - (o.x + o.width / 2), m = u.y + u.height / 2 - (o.y + o.height / 2);
    c.y <= c.x ? u.y += (m > 0 || m === 0 && O > 0 ? 1 : -1) * c.y * d : u.x += (v > 0 || v === 0 && O > 0 ? 1 : -1) * c.x * d;
  }, i = Math.max(1, s.length * (r.length + s.length / 2)), p = Math.max(1, Math.min(1e3, Math.floor(Bt / i)));
  let x = !1;
  for (let u = 0; u < p; u += 1) {
    let o = !1;
    for (let c = 0; c < s.length; c += 1) {
      for (const d of r) {
        const O = xe(s[c], d, n);
        O && (a(s[c], d, O, 1, 1), o = !0);
      }
      for (let d = c + 1; d < s.length; d += 1) {
        const O = xe(s[c], s[d], n);
        O && (a(s[c], s[d], O, 0.5, -1), a(s[d], s[c], O, 0.5, 1), o = !0);
      }
    }
    if (!o) {
      x = !0;
      break;
    }
  }
  const y = (u) => Math.round(u * 100) / 100;
  for (const u of s)
    u.x = y(u.x), u.y = y(u.y);
  return x || Xt(s, r, n), s.map(({ id: u, x: o, y: c }) => ({ id: u, x: o, y: c }));
}
function Xt(e, t, n) {
  const s = [...t], r = [];
  for (const d of e)
    s.some((O) => xe(d, O, n)) ? r.push(d) : s.push(d);
  if (!r.length) return;
  const a = Math.min(...e.map((d) => d.x)), i = s.length ? Math.max(...s.map((d) => d.y + d.height)) + n : Math.min(...e.map((d) => d.y)), p = s.length ? Math.max(...s.map((d) => d.x + d.width)) : a, x = r.reduce((d, O) => d + (O.width + n) * (O.height + n), 0), y = Math.max(p - a, Math.sqrt(x) * 1.5, ...r.map((d) => d.width));
  let u = a, o = i, c = 0;
  for (const d of r)
    u > a && u + d.width > a + y && (u = a, o += c + n, c = 0), d.x = u, d.y = o, u += d.width + n, c = Math.max(c, d.height);
}
function Ft(e, t, { gap: n = 48, obstacles: s = [] } = {}) {
  if (!e.length) return [];
  const r = new Map(e.map((l) => [l.id, l])), a = new Map(e.map((l) => [l.id, []])), i = new Map(e.map((l) => [l.id, 0]));
  for (const [l, h] of t)
    !r.has(l) || !r.has(h) || l === h || (a.get(l).push(h), i.set(h, i.get(h) + 1));
  const p = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), y = [], u = (l) => {
    y.push(l), x.set(l, 0), p.set(l, []);
    const h = [l];
    for (; h.length; ) {
      const f = h.shift();
      for (const b of a.get(f))
        x.has(b) || (x.set(b, x.get(f) + 1), p.set(b, []), p.get(f).push(b), h.push(b));
    }
  };
  for (const l of e) i.get(l.id) === 0 && !x.has(l.id) && u(l.id);
  for (const l of e) x.has(l.id) || u(l.id);
  const o = [];
  for (const l of e) {
    const h = x.get(l.id);
    o[h] = Math.max(o[h] ?? 0, l.height);
  }
  const c = Math.min(...e.map((l) => l.x)), d = Math.min(...e.map((l) => l.y)), O = [];
  o.forEach((l, h) => {
    O[h] = h === 0 ? d : O[h - 1] + o[h - 1] + n;
  });
  const v = /* @__PURE__ */ new Map(), m = (l) => {
    const h = p.get(l), f = h.reduce((I, T) => I + m(T), 0) + n * Math.max(0, h.length - 1), b = Math.max(r.get(l).width, f);
    return v.set(l, b), b;
  }, g = /* @__PURE__ */ new Map(), w = (l, h) => {
    const f = r.get(l), b = p.get(l), I = v.get(l), T = O[x.get(l)];
    if (!b.length) {
      g.set(l, { id: l, x: h + (I - f.width) / 2, y: T });
      return;
    }
    const A = b.reduce((S, N) => S + v.get(N), 0) + n * (b.length - 1);
    let P = h + (I - A) / 2;
    for (const S of b)
      w(S, P), P += v.get(S) + n;
    const Y = g.get(b[0]), M = g.get(b[b.length - 1]), C = (Y.x + r.get(b[0]).width / 2 + M.x + r.get(b[b.length - 1]).width / 2) / 2, $ = Math.min(Math.max(C - f.width / 2, h), h + I - f.width);
    g.set(l, { id: l, x: $, y: T });
  };
  let _ = c;
  for (const l of y) {
    const h = m(l);
    w(l, _), _ += h + n;
  }
  const X = e.map((l) => g.get(l.id));
  return Wt(e, X, s, n);
}
function Wt(e, t, n, s) {
  if (!n.length) return t;
  let r = 0;
  for (let a = 0; a <= n.length; a += 1) {
    let i = 0;
    if (t.forEach((p, x) => {
      const y = { ...e[x], x: p.x, y: p.y + r };
      for (const u of n)
        xe(y, u, s) && (i = Math.max(i, u.y + u.height + s - y.y));
    }), !i) break;
    r += i;
  }
  return r ? t.map((a) => ({ ...a, y: a.y + r })) : t;
}
const k = (e) => e.options.id, G = (e, t) => E[t].read(e.options), K = (e) => ({
  x: G(e, "x"),
  y: G(e, "y"),
  width: Number(e.options.width ?? 120),
  height: Number(e.options.height ?? 80)
}), ye = (e) => !!e.targetPoint || `${e.childId || ""}`.startsWith(Le), le = (e, t) => `${e}->${t}`;
function we(e) {
  return JSON.parse(JSON.stringify(e ?? null));
}
function ve(e) {
  const t = e?.nodes && !Array.isArray(e.nodes), n = t ? e.v2 ?? e : null, s = t ? {
    options: we(n.options || {}),
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((r) => Ht(r?.v2 ?? r))
  } : we(e || {});
  return s.options || (s.options = {}), s.nodes = (Array.isArray(s.nodes) ? s.nodes : []).map((r) => {
    const a = r?.options ? r : { options: { ...r || {} }, relationships: r?.relationships };
    return a.options.relationships && delete a.options.relationships, a.relationships = { ...a.relationships || {}, associations: [...a.relationships?.associations || []] }, a.relationships.associations.forEach((i) => {
      i.parentId || (i.parentId = a.options.id), i.id || (i.id = le(i.parentId, i.childId));
    }), a;
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
      associations: r.map(({ parent: a, child: i, ...p }) => we(p))
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
    return t.ids.map((r) => s.find((a) => k(a) === r)).filter(Boolean);
  if (t.text !== void 0) {
    const r = Se(t.text), a = s.filter(
      (i) => t.match === "contains" ? Se(i.options.text).includes(r) : Se(i.options.text) === r
    );
    if (a.length > 1 && t.all !== !0)
      throw new W(
        "ambiguous_selector",
        400,
        `${n} "${t.text}" matches ${a.length} notes (${a.map(k).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: a.map((i) => ({ id: k(i), text: i.options.text ?? "" })) }
      );
    return a;
  }
  if (t.within) {
    const r = t.within;
    return s.filter((a) => {
      const i = K(a);
      return i.x >= r.x && i.y >= r.y && i.x + i.width <= r.x + r.width && i.y + i.height <= r.y + r.height;
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
  const t = (a) => {
    const i = (parseInt(a, 16) || 0) / 255;
    return i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
  }, n = (a) => 0.2126 * t(a.substr(1, 2)) + 0.7152 * t(a.substr(3, 2)) + 0.0722 * t(a.substr(-2)), s = (a, i) => {
    const [p, x] = [n(a), n(i)];
    return (Math.max(p, x) + 0.05) / (Math.min(p, x) + 0.05);
  }, r = /^#[0-9a-f]{6}$/i.test(e) ? e : "#7aa2c8";
  return s(r, "#ffffff") > s(r, "#000000") ? "#ffffff" : "#000000";
}
function Ut(e, t, n) {
  return e.x < t.x + t.width + n && e.x + e.width + n > t.x && e.y < t.y + t.height + n && e.y + e.height + n > t.y;
}
function Kt(e, t, n, s, r, a) {
  let i = e;
  for (let p = 0; p <= t.length; p += 1) {
    const x = t.filter((o) => i.some((c) => Ut({ ...c, width: n, height: s }, o, a)));
    if (!x.length) return i;
    let y = 0, u = 0;
    r === "left" ? y = Math.min(...x.map((o) => o.x - a)) - Math.max(...i.map((o) => o.x + n)) : r === "above" ? u = Math.min(...x.map((o) => o.y - a)) - Math.max(...i.map((o) => o.y + s)) : r === "below" || r === "center" ? u = Math.max(...x.map((o) => o.y + o.height + a)) - Math.min(...i.map((o) => o.y)) : y = Math.max(...x.map((o) => o.x + o.width + a)) - Math.min(...i.map((o) => o.x)), i = i.map((o) => ({ x: o.x + y, y: o.y + u }));
  }
  return i;
}
function rt(e, t) {
  if (t) {
    const n = e.nodes.find((r) => k(r) === t);
    if (n) return n;
    const s = e.nodes.filter((r) => `${r.options.text ?? ""}`.trim().toLowerCase() === t.trim().toLowerCase());
    if (s.length === 1) return s[0];
  }
  return [...e.nodes].sort((n, s) => K(s).x + K(s).width - (K(n).x + K(n).width))[0];
}
function Ae(e, t) {
  const n = t === "grid" ? Math.ceil(Math.sqrt(e)) : e;
  return Array.from({ length: e }, (s, r) => ({
    row: t === "column" ? r : t === "grid" ? Math.floor(r / n) : 0,
    column: t === "column" ? 0 : t === "grid" ? r % n : r
  }));
}
function Jt(e, t, n, s) {
  const r = t.count, a = t.placement || {}, i = a.gap ?? (a.connect ? Ot : 48);
  if (t.x !== void 0 && t.y !== void 0) {
    const c = a.arrangement || "row";
    return { points: Ae(r, c).map(({ row: O, column: v }) => ({
      x: t.x + v * (n + i),
      y: t.y + O * (s + i)
    })), arrangement: c, gap: i };
  }
  const p = rt(e, a.relativeTo), x = p ? K(p) : { x: 0, y: 0, width: 160, height: 100 }, y = a.direction || "right", u = a.arrangement || (["left", "right"].includes(y) ? "column" : "row"), o = Ae(r, u).map(({ row: c, column: d }) => {
    let O = x.x + d * (n + i), v = x.y + c * (s + i);
    return y === "right" && (O += x.width + i), y === "left" && (O -= n + i), y === "below" && (v += x.height + i), y === "above" && (v -= s + i), { x: O, y: v };
  });
  return { points: Kt(o, e.nodes.map(K), n, s, y, i), arrangement: u, gap: i };
}
function Zt(e, t) {
  if (!e) return { childId: `${Le}${t()}` };
  const n = e.match(/->(__free_.+)$/);
  return { id: e, childId: n ? n[1] : `${Le}${e.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Ie(e, t) {
  if (!e.has(t)) return t;
  let n = 2;
  for (; e.has(`${t}~${n}`); ) n += 1;
  return `${t}~${n}`;
}
const Me = (e, t) => JSON.stringify([e, t]);
function Ce(e, t, n) {
  return new W(
    "id_taken",
    409,
    `${e} names ${t} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${t}s in a later operation.`,
    { ids: n }
  );
}
const Ue = (e, t) => JSON.stringify(e) === JSON.stringify(t), Vt = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Ee = (e) => JSON.parse(JSON.stringify(e)), me = 1e6, Ke = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, ie = (e) => ({ id: k(e), ...K(e), rotationAngle: G(e, "rotationAngle") });
function ln(e, t, n = {}) {
  const s = ke(n), r = $e(n), a = n.idFactory || qt, i = ve(e), p = Yt(t, {
    ...n,
    existingNodeIds: i.nodes.map(k),
    existingConnectionIds: te(i).map(({ association: c }) => c.id)
  });
  if (!p.valid)
    throw new W("invalid_operation_plan", 400, p.errors.join(" "), { errors: p.errors });
  const x = JSON.stringify(i), y = i.nodes.length, u = [], o = {
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
    const O = d + 1, v = `Operation ${O}`, m = { operation: O, kind: c.kind, matched: [], changed: [] };
    o.operations.push(m);
    const g = () => o.warnings.push(`${v} matched no notes.`), w = (l) => {
      o.skipped.push({ operation: O, id: k(l), reason: "locked" });
    }, _ = (l) => {
      const h = i.nodes.length + l;
      if (l > 0 && h > r.notesPerSlate && h > y)
        throw new W(
          "note_limit",
          422,
          `${v} would leave ${h} notes; a slate can hold at most ${r.notesPerSlate} notes.`,
          { limit: r.notesPerSlate, operation: O }
        );
    }, X = (l, h) => {
      if (h > 0 && l > r.connectorsPerSlate)
        throw new W(
          "connector_limit",
          422,
          `${v} would leave ${l} connectors; a slate can hold at most ${r.connectorsPerSlate} connectors.`,
          { limit: r.connectorsPerSlate, operation: O }
        );
    };
    switch (c.kind) {
      case "add_nodes": {
        const l = c.preset ? dt[c.preset] : void 0, h = c.placement?.connect === !0, f = h ? i.nodes.find((R) => k(R) === c.placement.relativeTo) : void 0;
        if (h && !f)
          throw new W("no_match", 409, `${v} placement.relativeTo names no note on the slate to connect from.`, { operation: O });
        if (f && f.options.isLocked === !0) {
          w(f);
          return;
        }
        const b = c.shape ?? l?.shape, I = f ? K(f) : void 0, T = c.width ?? l?.width ?? I?.width ?? (b?.toLowerCase() === "triangle" ? 150 : 180), A = c.height ?? l?.height ?? I?.height ?? (b?.toLowerCase() === "triangle" ? 130 : 110), P = f ?? rt(i, c.placement?.relativeTo), Y = c.style?.backgroundColor || l?.style?.backgroundColor || P?.options.backgroundColor || "#7aa2c8", { points: M, arrangement: C, gap: $ } = Jt(i, c, T, A), S = new Set(te(i).map(({ association: R }) => R.id)), N = new Set(i.nodes.map(k)), L = (c.ids || []).filter((R) => N.has(R));
        if (L.length && !n.replay) throw Ce(v, "note", L);
        const D = M.map((R, F) => c.ids?.[F] || a());
        _(D.filter((R) => !N.has(R)).length), f && X(S.size + D.filter((R) => !N.has(R)).length, D.length), M.forEach(({ x: R, y: F }, Be) => {
          const J = D[Be];
          if (m.matched.push(J), N.has(J)) return;
          const De = c.text ? c.count > 1 ? c.text.replace(/\{n\}/g, `${Be + 1}`) : c.text : "", pe = f ? Ee(f.options) : void 0;
          if (pe) for (const Q of Vt) delete pe[Q];
          const se = pe ? { ...pe, id: J, name: J, text: De, width: T, height: A } : {
            id: J,
            name: J,
            text: De,
            defaultShaped: !0,
            width: T,
            height: A,
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
          b && E.shape.store(se, b, s), E.x.store(se, R, s), E.y.store(se, F, s), f || E.foregroundColor.store(se, Gt(Y), s);
          for (const [Q, _e] of Object.entries(l?.style || {})) E[Q].store(se, _e, s);
          for (const [Q, _e] of Object.entries(c.style || {})) E[Q].store(se, _e, s);
          if (i.nodes.push({ options: se, relationships: { associations: [] } }), m.changed.push(J), o.created.push(J), f) {
            const Q = Ie(S, le(k(f), J));
            S.add(Q), f.relationships.associations.push({ id: Q, parentId: k(f), childId: J, ...Oe }), o.connected.push(Q);
          }
        });
        const { placement: V, ...H } = c;
        u.push({
          ...H,
          ids: D,
          x: M[0].x,
          y: M[0].y,
          placement: { arrangement: C, gap: $, ...f ? { relativeTo: k(f), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = ee(i, c.target, `${v} target`);
        m.matched = l.map(k), l.length || g();
        const h = [];
        for (const f of l) {
          if (f.options.isLocked === !0 && c.changes.locked !== !1) {
            w(f);
            continue;
          }
          const b = JSON.stringify(f.options);
          for (const [I, T] of Object.entries(c.changes))
            ue[I] || E[I].store(f.options, T, s);
          h.push(k(f)), JSON.stringify(f.options) !== b && m.changed.push(k(f));
        }
        if (c.changes.order && h.length) {
          const f = new Set(h), b = i.nodes.map(k), I = i.nodes.filter((A) => f.has(k(A))), T = i.nodes.filter((A) => !f.has(k(A)));
          i.nodes = c.changes.order === "front" ? [...T, ...I] : [...I, ...T], i.nodes.forEach((A, P) => {
            const Y = k(A);
            f.has(Y) && b[P] !== Y && !m.changed.includes(Y) && m.changed.push(Y);
          });
        }
        o.updated.push(...h), h.length && u.push({ kind: "update_nodes", target: { ids: h }, changes: c.changes });
        return;
      }
      case "delete_nodes": {
        const l = ee(i, c.target, `${v} target`);
        if (m.matched = l.map(k), l.length || g(), !c.target.ids && i.nodes.length > 1 && l.length === i.nodes.length && !ot.test(n.userMessage || ""))
          throw new W("invalid_operation_plan", 400, `${v} cannot delete every note without an explicit request.`);
        const f = /* @__PURE__ */ new Set();
        for (const b of l)
          b.options.isLocked === !0 ? w(b) : f.add(k(b));
        i.nodes = i.nodes.filter((b) => !f.has(k(b)));
        for (const b of i.nodes)
          b.relationships.associations = b.relationships.associations.filter(
            (I) => !f.has(I.parentId) && !f.has(I.childId)
          );
        m.changed = [...f], o.deleted.push(...f), f.size && u.push({ kind: "delete_nodes", target: { ids: [...f] } });
        return;
      }
      case "duplicate_nodes": {
        const l = ee(i, c.target, `${v} target`);
        m.matched = l.map(k), l.length || g();
        const h = c.offset ?? St, f = new Set(i.nodes.map(k)), b = (c.ids || []).filter((M) => f.has(M));
        if (b.length && !n.replay) throw Ce(v, "note", b);
        const I = l.map((M, C) => c.ids?.[C] || a());
        _(I.filter((M) => !f.has(M)).length);
        for (const M of l) {
          const C = G(M, "x") + h.x, $ = G(M, "y") + h.y;
          if (Math.abs(C) > me || Math.abs($) > me)
            throw new W(
              "invalid_operation_plan",
              400,
              `${v} would put the copy of ${k(M)} at ${C}, ${$}; a note's position must be from -${me} to ${me}.`
            );
        }
        const T = new Map(l.map((M, C) => [k(M), I[C]])), A = /* @__PURE__ */ new Map();
        l.forEach((M, C) => {
          const $ = I[C];
          if (f.has($)) return;
          const S = { options: { ...Ee(M.options), id: $, name: $ }, relationships: { associations: [] } };
          E.x.store(S.options, G(M, "x") + h.x, s), E.y.store(S.options, G(M, "y") + h.y, s), i.nodes.push(S), A.set($, S), m.changed.push($), o.created.push($);
        });
        const P = new Set(te(i).map(({ association: M }) => M.id));
        let Y = 0;
        for (const M of l) {
          const C = A.get(T.get(k(M)));
          if (C)
            for (const $ of M.relationships.associations) {
              const S = T.get($.childId);
              if (!S || ye($)) continue;
              const N = Ie(P, le(k(C), S));
              P.add(N), C.relationships.associations.push({ ...Ee($), id: N, parentId: k(C), childId: S }), o.connected.push(N), Y += 1;
            }
        }
        X(P.size, Y), l.length && u.push({ kind: "duplicate_nodes", target: { ids: l.map(k) }, ids: I, offset: { ...h } });
        return;
      }
      case "connect_nodes": {
        const l = ee(i, c.from, `${v} from`), h = c.to?.point, f = h ? [] : ee(i, c.to, `${v} to`);
        (!l.length || !h && !f.length) && g();
        const b = l.length * (h ? 1 : f.length);
        if (b > r.connectorsPerOperation)
          throw new W(
            "connector_limit",
            422,
            `${v} would join ${b} pairs of notes; one operation may join at most ${r.connectorsPerOperation}.`,
            { limit: r.connectorsPerOperation }
          );
        const I = /* @__PURE__ */ new Set(), T = /* @__PURE__ */ new Map();
        for (const { association: C } of te(i)) {
          I.add(C.id);
          const $ = Me(C.parentId, C.childId);
          T.has($) || T.set($, C.id);
        }
        const A = [], P = [], Y = [];
        let M = 0;
        for (const C of l) {
          const $ = k(C), S = h ? [null] : f.filter((N) => k(N) !== $);
          if (C.options.isLocked === !0) {
            S.length && w(C), M += S.length;
            continue;
          }
          S.length && Y.push($);
          for (const N of S) {
            const L = c.ids?.[M];
            if (M += 1, !N) {
              const R = Zt(L, a), F = R.id ?? le($, R.childId);
              if (I.has(F)) {
                n.replay || A.push(F), P.push(F), m.matched.push(F);
                continue;
              }
              C.relationships.associations.push({ id: F, parentId: $, childId: R.childId, targetPoint: { ...h }, ...Oe, ...c.style || {} }), I.add(F), P.push(F), m.matched.push(F), m.changed.push(F), o.connected.push(F);
              continue;
            }
            const D = k(N), V = T.get(Me($, D));
            if (V) {
              P.push(V), m.matched.push(V);
              continue;
            }
            if (L && I.has(L)) {
              n.replay || A.push(L), P.push(L), m.matched.push(L);
              continue;
            }
            const H = L || Ie(I, le($, D));
            C.relationships.associations.push({ id: H, parentId: $, childId: D, ...Oe, ...c.style || {} }), I.add(H), T.set(Me($, D), H), P.push(H), m.matched.push(H), m.changed.push(H), o.connected.push(H);
          }
        }
        if (A.length) throw Ce(v, "connector", A);
        if (I.size > r.connectorsPerSlate && m.changed.length)
          throw new W(
            "connector_limit",
            422,
            `A slate can hold at most ${r.connectorsPerSlate} connectors; this plan would leave ${I.size}.`,
            { limit: r.connectorsPerSlate }
          );
        m.changed.length && u.push({
          kind: "connect_nodes",
          from: { ids: Y },
          to: h ? { point: { ...h } } : { ids: f.map(k) },
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
          l = te(i).filter(({ association: f }) => h.has(f.id));
        } else {
          const h = new Set(ee(i, c.from, `${v} from`).map(k)), f = new Set(ee(i, c.to, `${v} to`).map(k));
          l = te(i).filter(
            ({ association: b }) => h.has(b.parentId) && f.has(b.childId) || f.has(b.parentId) && h.has(b.childId)
          );
        }
        if (m.matched = l.map(({ association: h }) => h.id), l.length || o.warnings.push(`${v} matched no connectors.`), c.kind === "disconnect_nodes") {
          for (const { node: h, association: f } of l)
            h.relationships.associations = h.relationships.associations.filter((b) => b !== f);
          m.changed = [...m.matched], o.disconnected.push(...m.matched), l.length && u.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { association: h } of l) {
          if (c.changes.toPoint !== void 0 && !ye(h))
            throw new W(
              "invalid_operation_plan",
              400,
              `${v} can move only a free end with toPoint; connector ${h.id} ends on a note.`
            );
          const f = JSON.stringify(h);
          for (const [b, I] of Object.entries(c.changes))
            h[ne[b].field || b] = b === "toPoint" ? { ...I } : I;
          JSON.stringify(h) !== f && m.changed.push(h.id);
        }
        o.connectionsUpdated.push(...m.matched), l.length && u.push({ kind: "update_connections", connectionIds: m.matched, changes: c.changes });
        return;
      }
      case "arrange_nodes": {
        const l = ee(i, c.target, `${v} target`);
        m.matched = l.map(k), l.length || g();
        const h = l.filter(($) => $.options.isLocked !== !0 ? !0 : (w($), !1));
        if (!h.length) return;
        const f = c.layout;
        let b;
        if (Ke[f]) b = Rt(Ke[f], h.map(ie));
        else if (f === "distribute-horizontal" || f === "distribute-vertical")
          b = zt(f === "distribute-horizontal" ? "horizontal" : "vertical", h.map(ie));
        else if (f === "tidy") {
          const $ = new Set(h.map(k)), S = i.nodes.filter((N) => !$.has(k(N))).map(ie);
          b = Dt(h.map(ie), S, { gap: c.gap ?? 20 });
        } else if (f === "tree") {
          const $ = te(i).filter(({ association: L }) => !ye(L)).map(({ association: L }) => [L.parentId, L.childId]), S = new Set(h.map(k)), N = i.nodes.filter((L) => !S.has(k(L))).map(ie);
          b = Ft(h.map(ie), $, { gap: c.gap ?? 48, obstacles: N });
        }
        if (b) {
          const $ = new Map(h.map((S) => [k(S), S]));
          for (const S of b) {
            const N = $.get(S.id), L = [G(N, "x"), G(N, "y")];
            E.x.store(N.options, S.x, s), E.y.store(N.options, S.y, s), Ue(L, [S.x, S.y]) || m.changed.push(S.id);
          }
          o.updated.push(...h.map(k)), u.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: c.layout, ...c.gap !== void 0 ? { gap: c.gap } : {} });
          return;
        }
        const I = h.map(K), T = c.gap ?? 48, A = Math.min(...I.map(($) => $.x)), P = Math.min(...I.map(($) => $.y)), Y = Math.max(...I.map(($) => $.width), 120), M = Math.max(...I.map(($) => $.height), 80), C = Ae(h.length, c.layout === "circle" ? "row" : c.layout);
        h.forEach(($, S) => {
          const N = [G($, "x"), G($, "y")];
          let L, D;
          if (c.layout === "circle") {
            const V = Math.max(180, h.length * 35), H = Math.PI * 2 * S / h.length;
            L = A + V + Math.cos(H) * V, D = P + V + Math.sin(H) * V;
          } else
            L = A + C[S].column * (Y + T), D = P + C[S].row * (M + T);
          E.x.store($.options, L, s), E.y.store($.options, D, s), Ue(N, [L, D]) || m.changed.push(k($));
        }), o.updated.push(...h.map(k)), u.push({ kind: "arrange_nodes", target: { ids: h.map(k) }, layout: c.layout, ...c.gap !== void 0 ? { gap: T } : {} });
        return;
      }
      case "update_slate": {
        const l = c.changes, h = JSON.stringify(i);
        for (const [f, b] of Object.entries(ae))
          l[f] !== void 0 && b.store(i, l[f]);
        JSON.stringify(i) !== h && m.changed.push("slate"), u.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && o.warnings.length) {
    const c = o.warnings[0];
    throw new W("no_match", 409, c, { operation: Number(c.match(/^Operation (\d+)/)?.[1]) });
  }
  return o.unchanged = JSON.stringify(i) === x, { slate: i, materializedPlan: { message: t.message.trim(), operations: u }, report: o };
}
const Je = ["id", ...Object.keys(E), "image"], ge = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), he = (e) => e.options.isComment === !0;
function at(e, t) {
  const n = e.options, s = (a) => !t || t.includes(a), r = { id: k(e) };
  for (const [a, i] of Object.entries(E)) {
    if (!s(a)) continue;
    const p = i.read(n);
    r[a] = p === void 0 ? null : p;
  }
  return s("image") && (r.image = n.image || null), r;
}
function ct(e) {
  const t = ye(e), n = { id: e.id, from: e.parentId, to: t ? null : e.childId };
  for (const [s, r] of Object.entries(ne)) {
    if (s === "toPoint") continue;
    const a = e[r.field ?? s];
    n[s] = a === void 0 ? null : a;
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
  if (e.forEach((r, a) => {
    k(r) === t && (s < 0 || Math.abs(a - n) < Math.abs(s - n)) && (s = a);
  }), s < 0) throw ce("The note this cursor continues from is gone. Read again from the first page.");
  return s + 1;
}
function sn(e) {
  if (!e.length) return null;
  const t = e.map(K), n = Math.min(...t.map((i) => i.x)), s = Math.min(...t.map((i) => i.y)), r = Math.max(...t.map((i) => i.x + i.width)), a = Math.max(...t.map((i) => i.y + i.height));
  return { x: n, y: s, width: r - n, height: a - s };
}
function hn(e, t = {}) {
  const n = ve(e), s = n.nodes.filter((g) => !he(g)), r = t.fields;
  if (r !== void 0) {
    const g = r.filter((w) => !Je.includes(w));
    if (g.length) throw ce(`Unknown note field: ${g.join(", ")}. Choose from ${Je.join(", ")}.`);
  }
  const a = t.limit ?? ge.notes;
  if (!Number.isInteger(a) || a < 1 || a > ge.maxNotes)
    throw ce(`limit must be a whole number from 1 to ${ge.maxNotes}.`);
  const i = t.maxChars ?? ge.maxChars, p = Qt(t), x = p ? ee({ ...n, nodes: s }, p, "selection") : s;
  let y = 0;
  t.cursor !== void 0 && (y = nn(x, tn(t.cursor)));
  const u = new Set(n.nodes.filter(he).map(k)), o = /* @__PURE__ */ new Map();
  for (const { association: g } of te(n)) {
    if (u.has(g.parentId) || u.has(g.childId)) continue;
    const w = o.get(g.parentId) ?? [];
    w.push(g), o.set(g.parentId, w);
  }
  const c = [], d = [];
  let O = 0, v = y;
  for (; v < x.length && c.length < a; v += 1) {
    const g = x[v], w = at(g, r), _ = (o.get(k(g)) ?? []).map(ct), X = JSON.stringify(w).length + JSON.stringify(_).length;
    if (c.length && O + X > i) break;
    O += X, c.push(w), d.push(..._);
  }
  const m = c[c.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: Lt(n.options.containerStyle),
    bounds: sn(s),
    nodeCount: x.length,
    nodes: c,
    connections: d,
    nextCursor: v < x.length && m ? en({ after: m.id, at: v - 1 }) : null
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
  const t = ve(e), n = new Set(t.nodes.filter(he).map(k)), s = {};
  for (const a of on) t.options[a] !== void 0 && (s[a] = t.options[a]);
  const r = t.nodes.filter((a) => !n.has(k(a))).map((a) => ({
    options: a.options,
    relationships: {
      ...a.relationships,
      associations: a.relationships.associations.filter((i) => !n.has(i.childId))
    }
  }));
  return { options: s, nodes: r, shareId: `${e?.shareId ?? t.options.shareId ?? ""}` };
}
const rn = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"], an = [
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
  const t = ve(e), n = t.nodes.filter((i) => !he(i)), s = new Set(t.nodes.filter(he).map((i) => i.options.id)), r = n.slice(0, 150).map((i) => {
    const p = at(i, rn);
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
  }), a = te(t).filter(({ association: i }) => !s.has(i.parentId) && !s.has(i.childId)).slice(0, 250).map(({ association: i }) => {
    const p = ct(i);
    return {
      id: p.id,
      from: p.from,
      to: p.to,
      ..."toPoint" in p ? { toPoint: p.toPoint } : {},
      label: p.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(an.map((x) => [x, p[x] ?? void 0]))
    };
  });
  return {
    name: t.options.name || "",
    description: t.options.description || "",
    nodeCount: n.length,
    nodes: r,
    connections: a
  };
}
function fn(e = {}) {
  const t = ke(e), n = (s, r) => Object.fromEntries(Object.entries(s).map(([a, i]) => [a, { ...U(r(i)), description: i.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(be.map((s) => [s, { fields: je[s].filter((r) => r !== "kind") }])),
    noteKeys: { ...n(E, (s) => s.spec(t)), ...n(ue, (s) => s.spec) },
    noteStyleKeys: [...Pe],
    connectorKeys: n(ne, (s) => s.spec),
    connectorStyleKeys: [...ze],
    slateKeys: Object.fromEntries(
      Object.entries(ae).map(([s, r]) => [
        s,
        { ...s === "background" ? nt() : U(r.spec), description: r.description }
      ])
    ),
    selector: st(),
    layouts: [...Ye],
    presets: [...Re],
    limits: $e(e),
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
  const t = ke(e), n = $e(e), s = (y) => Object.fromEntries(y.map((u) => [u, U(E[u].spec(t))])), r = (y) => Object.fromEntries(y.map((u) => [u, { ...U(E[u].spec(t)), description: E[u].description }])), a = (y) => Object.fromEntries(y.map((u) => [u, U(ne[u].spec)])), i = st(), p = { type: "array", items: { type: "string" } }, x = be.map((y) => `${y}: ${je[y].filter((u) => u !== "kind").join(", ")}`).join("; ");
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
          description: `Fields by kind. ${x}.`,
          properties: {
            kind: { type: "string", enum: [...be] },
            count: { type: "integer", minimum: 1, maximum: n.notesPerAdd },
            ...s(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...Re],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...p, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: p,
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...U({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
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
              properties: { ...s(Pe), ...a(ze) }
            },
            target: i,
            from: i,
            to: {
              ...i,
              description: `${i.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...i.properties, point: U({ type: "point" }) }
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
                ...r(Object.keys(E)),
                ...Object.fromEntries(Object.entries(ue).map(([y, u]) => [y, U(u.spec)])),
                ...a(Object.keys(ne)),
                ...Object.fromEntries(
                  Object.entries(ae).map(([y, u]) => [y, y === "background" ? nt() : U(u.spec)])
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
  E as NODE_KEYS,
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
  Lt as backgroundOf,
  $e as contractLimits,
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
  ve as toStoredSlate,
  Ft as treePositions,
  Yt as validatePlan
};
