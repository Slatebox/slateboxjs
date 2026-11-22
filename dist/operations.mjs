import { N as me } from "./NoteDefaults-1xFW0br8.mjs";
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
function ge() {
  return Array.from(D.keys());
}
const it = "0.6s cubic-bezier(0.4, 0, 0.2, 1) both", ye = {
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
function be() {
  return { ...ye };
}
function R(t) {
  return !!t && typeof t == "object" && !Array.isArray(t);
}
const we = /^(#[0-9a-f]{3,8}|(rgb|rgba|hsl|hsla)\([\d\s.,%+-]{1,60}\)|[a-z]{3,30}|transparent)$/i, xe = /^https?:\/\/[^\s]+$/i, ne = 2e3, ke = /^[A-Za-z0-9_-]{1,64}$/;
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
    case "list":
      return Array.isArray(e) && e.every((o) => typeof o == "string" && t.values.includes(o)) && new Set(e).size === e.length ? null : `${n} must be a list of different values from: ${t.values.join(", ")} (or an empty list).`;
    case "color":
      return typeof e == "string" && we.test(e.trim()) ? null : `${n} must be a colour such as #336699 or rgb(51, 102, 153).`;
    case "point":
      return R(e) && Object.keys(e).every((o) => o === "x" || o === "y") && [e.x, e.y].every((o) => typeof o == "number" && Number.isFinite(o) && Math.abs(o) <= 1e6) ? null : `${n} must be a point {x, y} with numbers from -1000000 to 1000000.`;
    case "object":
      return R(e) ? null : `${n} must be an object.`;
    case "url":
      return e === null && t.nullable || typeof e == "string" && e.length <= ne && xe.test(e.trim()) ? null : `${n} must be an http or https address${t.nullable ? ", or null to remove it" : ""}.`;
    case "id":
      return e === null && t.nullable || typeof e == "string" && ke.test(e) ? null : `${n} must be 1 to 64 letters, digits, _ or -${t.nullable ? ", or null" : ""}.`;
  }
}
function K(t) {
  switch (t.type) {
    case "string":
      return { type: t.nullable ? ["string", "null"] : "string", maxLength: t.maxLength, ...t.minLength ? { minLength: t.minLength } : {} };
    case "number":
      return { type: "number", minimum: t.min, maximum: t.max };
    case "boolean":
      return { type: "boolean" };
    case "enum":
      return t.nullable ? { type: ["string", "null"], enum: [...t.values, null] } : { type: "string", enum: [...t.values] };
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
        maxLength: ne,
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
}), ve = ["solid", "dashed", "dotted", "combo"], $e = Object.freeze(["dropShadow", "blur", "outline", "postItNote", "pencil"]), _e = ["front", "back"], Ie = ["left", "middle", "right"], Oe = ["top", "middle", "bottom"], Lt = Object.freeze({
  color: "showColorTab",
  text: "showTextTab",
  shape: "showShapeTab",
  picture: "showImageTab",
  effects: "showEffectTab",
  ask: "showAITab"
}), Ht = Object.keys(Lt), P = {
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
    spec: () => ({ type: "enum", values: ve }),
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
  textXAlign: { spec: () => ({ type: "enum", values: Ie }), description: "Horizontal text alignment.", ...q("textXAlign") },
  textYAlign: { spec: () => ({ type: "enum", values: Oe }), description: "Vertical text alignment.", ...q("textYAlign") },
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
    spec: () => ({ type: "list", values: Ht }),
    description: "Controls left off this note's style bar: color (fill and border), text (text colour, size, alignment, font), shape, picture, effects, ask. The list replaces the note's whole list, so to hide one more, send the ones already hidden (the summary lists them) plus it. An empty list shows them all. Chat and exec can still change the note.",
    store: (t, e) => {
      for (const [n, o] of Object.entries(Lt)) t[o] = !e.includes(n);
    },
    read: (t) => Ht.filter((e) => t[Lt[e]] === !1)
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
    spec: { type: "enum", values: _e },
    description: "Bring the note to the front or send it to the back."
  }
}, Se = [...Object.keys(P), ...Object.keys(mt)], Ee = /* @__PURE__ */ new Set(["text", "shape", "x", "y", "width", "height"]), Yt = Object.keys(P).filter((t) => !Ee.has(t)), xt = [
  "add_nodes",
  "update_nodes",
  "delete_nodes",
  "duplicate_nodes",
  "connect_nodes",
  "disconnect_nodes",
  "update_connections",
  "arrange_nodes",
  "update_slate"
], Rt = {
  add_nodes: ["kind", "count", "shape", "preset", "text", "ids", "x", "y", "width", "height", "placement", "style"],
  update_nodes: ["kind", "target", "changes"],
  delete_nodes: ["kind", "target"],
  duplicate_nodes: ["kind", "target", "offset", "ids"],
  connect_nodes: ["kind", "from", "to", "ids", "style"],
  disconnect_nodes: ["kind", "from", "to", "connectionIds"],
  update_connections: ["kind", "from", "to", "connectionIds", "changes"],
  arrange_nodes: ["kind", "target", "layout", "gap"],
  update_slate: ["kind", "changes"]
}, oe = ["left", "right", "above", "below", "center"], se = ["row", "column", "grid"], Ne = ["align-left", "align-center", "align-right", "align-top", "align-middle", "align-bottom"], Me = ["distribute-horizontal", "distribute-vertical"], zt = ["row", "column", "grid", "circle", ...Ne, ...Me, "tidy", "tree"], Dt = ["text", "sticky"], Ae = 75, Pe = Object.freeze({ x: 20, y: 20 }), Ce = Object.freeze({
  operationsPerPlan: 50,
  notesPerAdd: 20,
  notesPerSlate: 1e3,
  connectorsPerOperation: 400,
  connectorsPerSlate: 5e3
}), qt = /^(?!__free_)[A-Za-z0-9_-]{1,64}$/, Gt = 200, Te = Object.freeze([
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
    shapes: [...t.shapes ?? ge()],
    fonts: [...t.fonts ?? Te],
    animations: Object.keys(be()),
    effects: [...$e]
  };
}
function _t(t = {}) {
  return { ...Ce, ...t.limits || {} };
}
class W extends Error {
  constructor(e, n, o, s) {
    super(o), this.name = "OperationPlanError", this.code = e, this.status = n, s && (this.details = s);
  }
}
const Le = ["bezier", "orthogonal", "straight", "linear", "curved"], je = ["cubic", "quadratic"], Ye = ["solid", "dashed", "dotted"], Re = ["follow", "pinned"], Ut = ["follow", "pinned", "top", "right", "bottom", "left"], ot = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: Le }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: je }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  lineDash: { spec: { type: "enum", values: Ye }, description: "Solid, dashed or dotted line." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  ends: {
    spec: { type: "enum", values: Re },
    description: "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge that faces the line's other end, where a following end sits)."
  },
  fromEnd: {
    spec: { type: "enum", values: Ut },
    description: "The starting end: follow, pinned (at the spot on the note's edge facing the line's other end), or pinned to the middle of the note's top, right, bottom or left side."
  },
  toEnd: {
    spec: { type: "enum", values: Ut },
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
}, Bt = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"], Xt = Object.keys(ot).filter((t) => !Bt.includes(t)), St = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" }, pt = "__free_", ie = ["linear", "radial"], re = ["horizontal", "vertical", "diagonal"], yt = (t) => ({
  store: (e, n) => {
    e.options[t] = n;
  }
}), Kt = (t) => ({
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
      const n = { ...t.options.containerStyle || {}, ...De(e) };
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
  showGrid: { spec: { type: "boolean" }, description: "Show the grid behind the canvas.", ...Kt("showGrid") },
  snapToObjects: { spec: { type: "boolean" }, description: "A dragged note snaps to the edges of its neighbours.", ...Kt("snapToObjects") },
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
function ze(t, e) {
  if (!R(t)) return [`${e} must be an object {color, gradient?}.`];
  const n = [];
  for (const s of Object.keys(t))
    s !== "color" && s !== "gradient" && n.push(`${e} has an unknown field: ${s}.`);
  const o = j({ type: "color" }, t.color, `${e}.color`);
  if (o && n.push(o), t.gradient !== void 0) {
    const s = t.gradient;
    if (!R(s)) return [...n, `${e}.gradient must be an object {type, colors, direction?}.`];
    for (const i of Object.keys(s))
      ["type", "colors", "direction"].includes(i) || n.push(`${e}.gradient has an unknown field: ${i}.`);
    const a = j({ type: "enum", values: ie }, s.type, `${e}.gradient.type`);
    if (a && n.push(a), s.direction !== void 0) {
      const i = j({ type: "enum", values: re }, s.direction, `${e}.gradient.direction`);
      i && n.push(i);
    }
    !Array.isArray(s.colors) || s.colors.length < 2 || s.colors.length > 8 ? n.push(`${e}.gradient.colors must list 2 to 8 colours.`) : s.colors.forEach((i, p) => {
      const x = j({ type: "color" }, i, `${e}.gradient.colors[${p}]`);
      x && n.push(x);
    });
  }
  return n;
}
function De(t) {
  return {
    backgroundColor: t.color,
    backgroundColorAsGradient: !!t.gradient,
    backgroundGradientType: t.gradient?.type ?? "linear",
    backgroundGradientColors: t.gradient?.colors ?? [],
    backgroundGradientStrategy: t.gradient?.direction ?? "horizontal"
  };
}
function ae() {
  return {
    type: "object",
    additionalProperties: !1,
    required: ["color"],
    properties: {
      color: K({ type: "color" }),
      gradient: {
        type: "object",
        additionalProperties: !1,
        required: ["type", "colors"],
        properties: {
          type: { type: "string", enum: [...ie] },
          colors: { type: "array", minItems: 2, maxItems: 8, items: K({ type: "color" }) },
          direction: { type: "string", enum: [...re] }
        }
      }
    }
  };
}
function Be(t) {
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
const Xe = ["ids", "text", "match", "all", "within", "groupId"], Fe = ["ids", "text", "within", "groupId"];
function at(t, e) {
  if (!R(t)) return [`${e} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const n = [];
  for (const s of Object.keys(t))
    Xe.includes(s) || n.push(`${e} has an unknown field: ${s}.`);
  const o = Fe.filter((s) => t[s] !== void 0);
  if (o.length > 1 && n.push(`${e} must name notes one way, not by ${o.join(" and ")}.`), !o.length && t.all !== !0 && n.push(`${e} must name notes by ids, text, within, groupId or all: true.`), t.ids !== void 0 && (!Array.isArray(t.ids) || !t.ids.length || t.ids.some((s) => typeof s != "string" || !s)) && n.push(`${e}.ids must be a list of note ids.`), t.text !== void 0 && (typeof t.text != "string" || !t.text.trim()) && n.push(`${e}.text must be the text of a note.`), t.match !== void 0) {
    t.text === void 0 && n.push(`${e}.match goes with text.`);
    const s = j({ type: "enum", values: ["exact", "contains"] }, t.match, `${e}.match`);
    s && n.push(s);
  }
  if (t.all !== void 0 && t.all !== !0 && n.push(`${e}.all must be true when given.`), t.groupId !== void 0 && (typeof t.groupId != "string" || !t.groupId) && n.push(`${e}.groupId must be a group id.`), t.within !== void 0) {
    const s = t.within;
    R(s) && Object.keys(s).every((i) => ["x", "y", "width", "height"].includes(i)) && ["x", "y", "width", "height"].every((i) => typeof s[i] == "number" && Number.isFinite(s[i])) && s.width > 0 && s.height > 0 || n.push(`${e}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return n;
}
function ce() {
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
const We = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i, de = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;
function ht(t, e, n, o, s, { required: a = !0, plural: i = `${o}s` } = {}) {
  const p = [];
  if (t === void 0 && !a) return p;
  if (!R(t) || a && !Object.keys(t).length)
    return [a ? `${n} requires at least one ${o}.` : `${n} ${i} must be an object.`];
  const x = Object.keys(t).filter((b) => !e.includes(b));
  x.length && p.push(`${n} contains unsupported ${i}: ${x.join(", ")}.`);
  for (const [b, h] of Object.entries(t))
    e.includes(b) && s(b, h, p);
  return p;
}
function Jt(t, e) {
  return (n, o, s) => {
    const a = mt[n]?.spec ?? P[n].spec(t), i = j(a, o, `${e} ${n}`);
    i && s.push(i);
  };
}
function Zt(t) {
  return (e, n, o) => {
    const s = j(ot[e].spec, n, `${t} ${e}`);
    s && o.push(s);
  };
}
function Z(t) {
  return Array.isArray(t) && t.length > 0 && t.every((e) => typeof e == "string" && e.length > 0);
}
function He(t, e = {}) {
  const n = $t(e), o = _t(e), s = e.userMessage || "";
  if (!R(t)) return { valid: !1, errors: ["The operation plan must be an object."] };
  const a = [];
  for (const r of Object.keys(t))
    r !== "message" && r !== "operations" && a.push(`The plan has an unknown field: ${r}.`);
  (typeof t.message != "string" || !t.message.trim()) && a.push("A natural completion message is required."), !Array.isArray(t.operations) || t.operations.length === 0 ? a.push("At least one slate operation is required.") : t.operations.length > o.operationsPerPlan && a.push(`A plan cannot contain more than ${o.operationsPerPlan} operations.`);
  const i = !!e.existingNodeIds?.length, p = new Set((e.existingNodeIds || []).filter(Boolean)), x = !!e.existingConnectionIds?.length, b = new Set((e.existingConnectionIds || []).filter(Boolean)), h = (r, d) => {
    i && R(r) && Array.isArray(r.ids) && r.ids.some((c) => !p.has(c)) && a.push(`${d} references notes that are not in the slate.`);
  };
  return (Array.isArray(t.operations) ? t.operations : []).forEach((r, d) => {
    const c = `Operation ${d + 1}`;
    if (!R(r) || !xt.includes(r.kind)) {
      a.push(`${c} has an unsupported kind.`);
      return;
    }
    const $ = Rt[r.kind], v = Object.keys(r).filter((m) => !$.includes(m));
    for (const m of v) a.push(`${c} has an unknown field: ${m}.`);
    switch (r.kind) {
      case "add_nodes": {
        if ((!Number.isInteger(r.count) || r.count < 1 || r.count > o.notesPerAdd) && a.push(`${c} count must be an integer from 1 to ${o.notesPerAdd}.`), r.preset !== void 0) {
          const g = j({ type: "enum", values: Dt }, r.preset, `${c} preset`);
          g && a.push(g);
        }
        const m = R(r.placement) && r.placement.connect === !0;
        if (r.shape !== void 0 || r.preset === void 0 && !m) {
          const g = j(P.shape.spec(n), r.shape, `${c} shape`);
          g && a.push(g);
        }
        for (const g of ["text", "width", "height"]) {
          if (r[g] === void 0) continue;
          const I = j(P[g].spec(n), r[g], `${c} ${g}`);
          I && a.push(I);
        }
        r.x === void 0 != (r.y === void 0) && a.push(`${c} needs both x and y, or neither.`);
        for (const g of ["x", "y"]) {
          if (r[g] === void 0) continue;
          const I = j(P[g].spec(n), r[g], `${c} ${g}`);
          I && a.push(I);
        }
        r.ids !== void 0 && (!Z(r.ids) || new Set(r.ids).size !== r.ids.length ? a.push(`${c} ids must be a list of different note ids.`) : r.ids.some((g) => !qt.test(g)) ? a.push(`${c} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : Number.isInteger(r.count) && r.ids.length > r.count && a.push(`${c} has more ids than notes to add.`));
        const y = r.placement;
        if (y !== void 0)
          if (!R(y))
            a.push(`${c} placement must be an object.`);
          else {
            const g = r.x !== void 0 ? ["arrangement", "gap", ...y.connect === !0 ? ["relativeTo", "connect"] : []] : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const I of Object.keys(y))
              g.includes(I) || a.push(
                r.x !== void 0 && ["relativeTo", "direction", "connect"].includes(I) ? `${c} gives x and y, so placement cannot also give ${I}.` : `${c} placement has an unknown field: ${I}.`
              );
            y.connect !== void 0 && (typeof y.connect != "boolean" ? a.push(`${c} placement.connect must be true or false.`) : y.connect && (y.relativeTo === void 0 && a.push(`${c} placement.connect needs relativeTo, the note to copy and connect from.`), y.direction === "center" && a.push(`${c} cannot connect a note placed at the centre of another; choose left, right, above or below.`))), y.relativeTo !== void 0 && typeof y.relativeTo != "string" ? a.push(`${c} placement.relativeTo must be a note id.`) : y.relativeTo && i && !p.has(y.relativeTo) && a.push(`${c} references a note that is not in the slate.`);
            for (const [I, X] of [["direction", oe], ["arrangement", se]]) {
              if (y[I] === void 0) continue;
              const l = j({ type: "enum", values: X }, y[I], `${c} placement.${I}`);
              l && a.push(l);
            }
            if (y.gap !== void 0) {
              const I = j({ type: "number", min: 0, max: 2e3 }, y.gap, `${c} placement.gap`);
              I && a.push(I);
            }
          }
        a.push(...ht(r.style, Yt, c, "node style", Jt(n, c), { required: !1 })), Z(r.ids) && r.ids.forEach((g) => p.add(g));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const m = at(r.target, `${c} target`);
        if (a.push(...m), m.length || h(r.target, c), r.kind === "update_nodes" && a.push(...ht(r.changes, Se, c, "node change", Jt(n, c), { plural: "changes" })), r.kind === "delete_nodes" && R(r.target) && r.target.all === !0 && Object.keys(r.target).length === 1 && !de.test(s) && a.push(`${c} cannot delete every note without an explicit request.`), r.kind === "arrange_nodes") {
          const y = j({ type: "enum", values: zt }, r.layout, `${c} layout`);
          if (y && a.push(y), r.gap !== void 0) {
            const g = j({ type: "number", min: 0, max: 2e3 }, r.gap, `${c} gap`);
            g && a.push(g);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const m = at(r.target, `${c} target`);
        if (a.push(...m), m.length || h(r.target, c), r.offset !== void 0) {
          const y = j({ type: "point" }, r.offset, `${c} offset`);
          y && a.push(y);
        }
        r.ids !== void 0 && (!Z(r.ids) || new Set(r.ids).size !== r.ids.length ? a.push(`${c} ids must be a list of different note ids.`) : r.ids.some((y) => !qt.test(y)) ? a.push(`${c} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`) : R(r.target) && Z(r.target.ids) && r.ids.length > r.target.ids.length && a.push(`${c} has more ids than notes to copy.`)), Z(r.ids) && r.ids.forEach((y) => p.add(y));
        return;
      }
      case "connect_nodes": {
        const m = at(r.from, `${c} from`);
        if (a.push(...m), m.length || h(r.from, c), R(r.to) && r.to.point !== void 0) {
          Object.keys(r.to).length !== 1 && a.push(`${c} to must be a note selector or {point}, not both.`);
          const I = j({ type: "point" }, r.to.point, `${c} to.point`);
          I && a.push(I);
        } else {
          const I = at(r.to, `${c} to`);
          a.push(...I), I.length || h(r.to, c);
        }
        r.ids !== void 0 && (!Z(r.ids) || new Set(r.ids).size !== r.ids.length ? a.push(`${c} ids must be a list of different connector ids.`) : r.ids.some((I) => I.length > Gt) && a.push(`${c} connector ids can be at most ${Gt} characters.`)), a.push(...ht(r.style, Xt, c, "connection style", Zt(c), { required: !1 })), Z(r.ids) && r.ids.forEach((I) => b.add(I));
        const y = r.from?.ids, g = r.to?.ids;
        Z(y) && Z(g) && y.forEach((I) => g.forEach((X) => b.add(`${I}->${X}`)));
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const m = r.connectionIds !== void 0, y = r.from !== void 0 || r.to !== void 0;
        if (m && y && a.push(`${c} names connectors by connectionIds or by from and to, not both.`), !m && !y && a.push(`${c} requires connectionIds or both from and to note selectors.`), m && (Z(r.connectionIds) ? x && r.connectionIds.some((g) => !b.has(g)) && a.push(`${c} references connectors that are not in the slate.`) : a.push(`${c} connectionIds must be a list of connector ids.`)), y)
          for (const g of ["from", "to"]) {
            const I = at(r[g], `${c} ${g}`);
            a.push(...I), I.length || h(r[g], c);
          }
        if (r.kind === "update_connections") {
          a.push(...ht(r.changes, Object.keys(ot), c, "connection change", Zt(c)));
          const g = R(r.changes) ? r.changes : {};
          g.toNote !== void 0 && g.toPoint !== void 0 && a.push(`${c} moves the far end with toNote or toPoint, not both.`), g.fromNote !== void 0 && g.fromPoint !== void 0 && a.push(`${c} moves the starting end with fromNote or fromPoint, not both.`), g.ends !== void 0 && (g.fromEnd !== void 0 || g.toEnd !== void 0) && a.push(`${c} sets ends, or fromEnd and toEnd, not both.`), g.toPoint !== void 0 && g.toEnd !== void 0 && a.push(`${c} cannot pin a far end it leaves free (toPoint with toEnd).`), g.fromPoint !== void 0 && (g.toPoint !== void 0 || g.fromEnd !== void 0) && a.push(`${c} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
        }
        return;
      }
      case "update_slate": {
        a.push(
          ...ht(r.changes, Object.keys(dt), c, "slate change", (m, y, g) => {
            if (m === "background") {
              g.push(...ze(y, `${c} background`));
              return;
            }
            const I = j(dt[m].spec, y, `${c} ${m}`);
            I && g.push(I);
          })
        ), R(r.changes) && r.changes.background !== void 0 && !We.test(s) && a.push(`${c} cannot change the canvas background unless the user explicitly asks for it.`);
        return;
      }
    }
  }), { valid: a.length === 0, errors: a };
}
const k = (t) => t.options.id, G = (t, e) => P[e].read(t.options), U = (t) => ({
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
    nodes: (n.freeNodes?.() ?? n.nodes.allNodes ?? []).map((s) => qe(s?.v2 ?? s))
  } : kt(t || {});
  return o.options || (o.options = {}), o.nodes = (Array.isArray(o.nodes) ? o.nodes : []).map((s) => {
    const a = s?.options ? s : { options: { ...s || {} }, relationships: s?.relationships };
    return a.options.relationships && delete a.options.relationships, a.relationships = { ...a.relationships || {}, associations: [...a.relationships?.associations || []] }, a.relationships.associations.forEach((i) => {
      i.parentId || (i.parentId = a.options.id), i.id || (i.id = ut(i.parentId, i.childId));
    }), a;
  }), o;
}
function qe(t) {
  const e = kt(t.options || {});
  e.x !== void 0 && (e.xPos = e.x, delete e.x), e.y !== void 0 && (e.yPos = e.y, delete e.y), e.fontColor !== void 0 && e.foregroundColor === void 0 && (e.foregroundColor = e.fontColor);
  const n = typeof t.getRotation == "function" ? t.getRotation() : void 0;
  typeof n == "number" && (e.rotate = { ...e.rotate || {}, rotationAngle: n });
  const o = t.relationships, s = typeof o?.getAssociations == "function" ? o.getAssociations() : Array.from(o?.associations || []);
  return {
    options: e,
    relationships: {
      associations: s.map(({ parent: a, child: i, ...p }) => kt(p))
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
    return e.ids.map((s) => o.find((a) => k(a) === s)).filter(Boolean);
  if (e.text !== void 0) {
    const s = Et(e.text), a = o.filter(
      (i) => e.match === "contains" ? Et(i.options.text).includes(s) : Et(i.options.text) === s
    );
    if (a.length > 1 && e.all !== !0)
      throw new W(
        "ambiguous_selector",
        400,
        `${n} "${e.text}" matches ${a.length} notes (${a.map(k).join(", ")}). Name them by ids, or add all: true to change every one.`,
        { candidates: a.map((i) => ({ id: k(i), text: i.options.text ?? "" })) }
      );
    return a;
  }
  if (e.within) {
    const s = e.within;
    return o.filter((a) => {
      const i = U(a);
      return i.x >= s.x && i.y >= s.y && i.x + i.width <= s.x + s.width && i.y + i.height <= s.y + s.height;
    });
  }
  return e.groupId !== void 0 ? o.filter((s) => s.options.groupId === e.groupId) : e.all === !0 ? [...o] : [];
}
const ct = (t) => Math.round(t * 1e4) / 1e4, Vt = (t) => Math.max(0, Math.min(1, t));
function Ge(t) {
  const e = Vt(t.x), n = Vt(t.y), o = [e, 1 - e, n, 1 - n], s = Math.min(...o);
  return s === o[0] ? { x: 0, y: ct(n) } : s === o[1] ? { x: 1, y: ct(n) } : s === o[2] ? { x: ct(e), y: 0 } : { x: ct(e), y: 1 };
}
function Ue(t) {
  return { top: { x: 0.5, y: 0 }, right: { x: 1, y: 0.5 }, bottom: { x: 0.5, y: 1 }, left: { x: 0, y: 0.5 } }[t];
}
function le(t, e, n) {
  if (!n) return { ...t };
  const o = n * Math.PI / 180, s = t.x - e.x, a = t.y - e.y;
  return { x: e.x + s * Math.cos(o) - a * Math.sin(o), y: e.y + s * Math.sin(o) + a * Math.cos(o) };
}
function Ke(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = le(e, n, -(t.rotation || 0));
  return { x: (o.x - t.x) / (t.width || 1), y: (o.y - t.y) / (t.height || 1) };
}
function Je(t, e) {
  const n = { x: t.x + t.width / 2, y: t.y + t.height / 2 }, o = le({ x: t.x + e.x * t.width, y: t.y + e.y * t.height }, n, t.rotation || 0);
  return { x: ct(o.x), y: ct(o.y) };
}
function Ze(t, e) {
  const n = Ke(t, e), o = (n.x - 0.5) * (t.width || 1), s = (n.y - 0.5) * (t.height || 1);
  if (Math.abs(o) < 1e-9 && Math.abs(s) < 1e-9) return { x: 0.5, y: 0 };
  const a = o !== 0 ? t.width / 2 / Math.abs(o) : 1 / 0, i = s !== 0 ? t.height / 2 / Math.abs(s) : 1 / 0, p = Math.min(a, i);
  return Ge({ x: 0.5 + o * p / (t.width || 1), y: 0.5 + s * p / (t.height || 1) });
}
function Ve(t) {
  const e = { ...t };
  return e.showParentArrow = t.showChildArrow !== !1, e.showChildArrow = !!t.showParentArrow, e.sourceAnchor = t.targetAnchor ?? null, e.targetAnchor = null, e;
}
const Nt = (t) => ({ ...U(t), rotation: Number(G(t, "rotationAngle")) || 0 }), Qe = (t) => ({ x: t.x + t.width / 2, y: t.y + t.height / 2 });
function tn(t, e, n, o, s, a) {
  const i = (c) => t.nodes.find(($) => k($) === c), p = (c) => {
    throw new W("invalid_operation_plan", 400, `${s} ${c}`);
  }, x = (c) => {
    throw new W("no_match", 409, `${s} names no note ${JSON.stringify(c)} on the slate.`);
  }, b = (c, $) => {
    c !== $ && (c.relationships.associations = c.relationships.associations.filter((v) => v !== n), $.relationships.associations.push(n));
  };
  let h = e;
  if (o.toNote !== void 0) {
    const c = i(o.toNote) ?? x(o.toNote);
    n.childId = k(c), delete n.targetPoint, n.targetAnchor = null;
  } else o.toPoint !== void 0 && (nt(n) || (n.childId = `${pt}${a()}`), n.targetPoint = { x: o.toPoint.x, y: o.toPoint.y }, n.targetAnchor = null);
  if (o.fromNote !== void 0) {
    const c = i(o.fromNote) ?? x(o.fromNote);
    n.parentId = k(c), n.sourceAnchor = null, b(h, c), h = c;
  } else if (o.fromPoint !== void 0) {
    nt(n) && p(`keeps one end on a note: the far end of ${n.id} is already free.`);
    const c = i(n.childId) ?? x(n.childId), $ = Ve(n);
    for (const v of Object.keys(n)) delete n[v];
    Object.assign(n, $, {
      parentId: k(c),
      childId: `${pt}${a()}`,
      targetPoint: { x: o.fromPoint.x, y: o.fromPoint.y }
    }), b(h, c), h = c;
  }
  n.parentId === n.childId && p(`cannot connect ${n.id} from a note to itself.`);
  const r = (c) => {
    if (c === "target" && nt(n)) return n.targetPoint;
    const $ = i(c === "source" ? n.parentId : n.childId);
    if (!$) return null;
    const v = c === "source" ? n.sourceAnchor : n.targetAnchor;
    return v ? Je(Nt($), v) : Qe(Nt($));
  }, d = (c, $, v) => {
    if (c === "target" && nt(n)) {
      v && p(`cannot pin or follow the far end of ${n.id}: it is free, on no note.`);
      return;
    }
    const m = c === "source" ? "sourceAnchor" : "targetAnchor";
    if ($ === "follow") n[m] = null;
    else if ($ !== "pinned") n[m] = Ue($);
    else if (!n[m]) {
      const y = i(c === "source" ? n.parentId : n.childId), g = r(c === "source" ? "target" : "source");
      y && g && (n[m] = Ze(Nt(y), g));
    }
  };
  return o.ends !== void 0 && (d("source", o.ends, !1), d("target", o.ends, !1)), o.fromEnd !== void 0 && d("source", o.fromEnd, !0), o.toEnd !== void 0 && d("target", o.toEnd, !0), h;
}
function en(t) {
  return {
    fromEnd: t.sourceAnchor ? "pinned" : "follow",
    toEnd: nt(t) ? "free" : t.targetAnchor ? "pinned" : "follow"
  };
}
function he(t) {
  const { x: e, y: n, width: o, height: s } = t, a = t.rotationAngle || 0;
  if (!a) return { minX: e, minY: n, maxX: e + o, maxY: n + s };
  const i = e + o / 2, p = n + s / 2, x = a * Math.PI / 180, b = Math.cos(x), h = Math.sin(x);
  let r = 1 / 0, d = 1 / 0, c = -1 / 0, $ = -1 / 0;
  for (const [m, y] of [[e, n], [e + o, n], [e + o, n + s], [e, n + s]]) {
    const g = m - i, I = y - p, X = i + g * b - I * h, l = p + g * h + I * b;
    r = Math.min(r, X), d = Math.min(d, l), c = Math.max(c, X), $ = Math.max($, l);
  }
  const v = (m) => Math.round(m * 1e6) / 1e6;
  return { minX: v(r), minY: v(d), maxX: v(c), maxY: v($) };
}
function nn(t, e) {
  if (e.length < 2) return [];
  const n = e.map(he), o = Math.min(...n.map((b) => b.minX)), s = Math.max(...n.map((b) => b.maxX)), a = Math.min(...n.map((b) => b.minY)), i = Math.max(...n.map((b) => b.maxY)), p = (o + s) / 2, x = (a + i) / 2;
  return e.map((b, h) => {
    const r = n[h];
    let { x: d, y: c } = b;
    return t === "left" ? d += o - r.minX : t === "right" ? d += s - r.maxX : t === "centerH" ? d += p - (r.minX + r.maxX) / 2 : t === "top" ? c += a - r.minY : t === "bottom" ? c += i - r.maxY : t === "middle" && (c += x - (r.minY + r.maxY) / 2), { id: b.id, x: d, y: c };
  });
}
function on(t, e) {
  if (e.length < 3) return [];
  const n = e.map((d, c) => ({ box: d, index: c, b: he(d) })), o = t === "horizontal", s = (d) => o ? d.b.minX : d.b.minY, a = (d) => o ? d.b.maxX - d.b.minX : d.b.maxY - d.b.minY, i = [...n].sort((d, c) => s(d) - s(c) || d.index - c.index), p = s(i[0]), b = (i.reduce((d, c) => Math.max(d, s(c) + a(c)), -1 / 0) - p - i.reduce((d, c) => d + a(c), 0)) / (i.length - 1), h = /* @__PURE__ */ new Map();
  let r = p;
  for (const d of i) {
    const c = r - s(d);
    h.set(d.index, {
      id: d.box.id,
      x: o ? d.box.x + c : d.box.x,
      y: o ? d.box.y : d.box.y + c
    }), r += a(d) + b;
  }
  return n.map((d) => h.get(d.index));
}
function vt(t, e, n) {
  const o = Math.min(t.x + t.width + n - e.x, e.x + e.width + n - t.x), s = Math.min(t.y + t.height + n - e.y, e.y + e.height + n - t.y);
  return o > 0 && s > 0 ? { x: o, y: s } : null;
}
const sn = 4e6;
function rn(t, e, { gap: n = 20 } = {}) {
  const o = t.map((h) => ({ ...h })), s = e.map((h) => ({ ...h })), a = (h, r, d, c, $) => {
    const v = h.x + h.width / 2 - (r.x + r.width / 2), m = h.y + h.height / 2 - (r.y + r.height / 2);
    d.y <= d.x ? h.y += (m > 0 || m === 0 && $ > 0 ? 1 : -1) * d.y * c : h.x += (v > 0 || v === 0 && $ > 0 ? 1 : -1) * d.x * c;
  }, i = Math.max(1, o.length * (s.length + o.length / 2)), p = Math.max(1, Math.min(1e3, Math.floor(sn / i)));
  let x = !1;
  for (let h = 0; h < p; h += 1) {
    let r = !1;
    for (let d = 0; d < o.length; d += 1) {
      for (const c of s) {
        const $ = vt(o[d], c, n);
        $ && (a(o[d], c, $, 1, 1), r = !0);
      }
      for (let c = d + 1; c < o.length; c += 1) {
        const $ = vt(o[d], o[c], n);
        $ && (a(o[d], o[c], $, 0.5, -1), a(o[c], o[d], $, 0.5, 1), r = !0);
      }
    }
    if (!r) {
      x = !0;
      break;
    }
  }
  const b = (h) => Math.round(h * 100) / 100;
  for (const h of o)
    h.x = b(h.x), h.y = b(h.y);
  return x || an(o, s, n), o.map(({ id: h, x: r, y: d }) => ({ id: h, x: r, y: d }));
}
function an(t, e, n) {
  const o = [...e], s = [];
  for (const c of t)
    o.some(($) => vt(c, $, n)) ? s.push(c) : o.push(c);
  if (!s.length) return;
  const a = Math.min(...t.map((c) => c.x)), i = o.length ? Math.max(...o.map((c) => c.y + c.height)) + n : Math.min(...t.map((c) => c.y)), p = o.length ? Math.max(...o.map((c) => c.x + c.width)) : a, x = s.reduce((c, $) => c + ($.width + n) * ($.height + n), 0), b = Math.max(p - a, Math.sqrt(x) * 1.5, ...s.map((c) => c.width));
  let h = a, r = i, d = 0;
  for (const c of s)
    h > a && h + c.width > a + b && (h = a, r += d + n, d = 0), c.x = h, c.y = r, h += c.width + n, d = Math.max(d, c.height);
}
function cn(t, e, { gap: n = 48, obstacles: o = [] } = {}) {
  if (!t.length) return [];
  const s = new Map(t.map((l) => [l.id, l])), a = new Map(t.map((l) => [l.id, []])), i = new Map(t.map((l) => [l.id, 0]));
  for (const [l, u] of e)
    !s.has(l) || !s.has(u) || l === u || (a.get(l).push(u), i.set(u, i.get(u) + 1));
  const p = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), b = [], h = (l) => {
    b.push(l), x.set(l, 0), p.set(l, []);
    const u = [l];
    for (; u.length; ) {
      const f = u.shift();
      for (const w of a.get(f))
        x.has(w) || (x.set(w, x.get(f) + 1), p.set(w, []), p.get(f).push(w), u.push(w));
    }
  };
  for (const l of t) i.get(l.id) === 0 && !x.has(l.id) && h(l.id);
  for (const l of t) x.has(l.id) || h(l.id);
  const r = [];
  for (const l of t) {
    const u = x.get(l.id);
    r[u] = Math.max(r[u] ?? 0, l.height);
  }
  const d = Math.min(...t.map((l) => l.x)), c = Math.min(...t.map((l) => l.y)), $ = [];
  r.forEach((l, u) => {
    $[u] = u === 0 ? c : $[u - 1] + r[u - 1] + n;
  });
  const v = /* @__PURE__ */ new Map(), m = (l) => {
    const u = p.get(l), f = u.reduce((S, M) => S + m(M), 0) + n * Math.max(0, u.length - 1), w = Math.max(s.get(l).width, f);
    return v.set(l, w), w;
  }, y = /* @__PURE__ */ new Map(), g = (l, u) => {
    const f = s.get(l), w = p.get(l), S = v.get(l), M = $[x.get(l)];
    if (!w.length) {
      y.set(l, { id: l, x: u + (S - f.width) / 2, y: M });
      return;
    }
    const A = w.reduce((O, C) => O + v.get(C), 0) + n * (w.length - 1);
    let L = u + (S - A) / 2;
    for (const O of w)
      g(O, L), L += v.get(O) + n;
    const Y = y.get(w[0]), E = y.get(w[w.length - 1]), N = (Y.x + s.get(w[0]).width / 2 + E.x + s.get(w[w.length - 1]).width / 2) / 2, _ = Math.min(Math.max(N - f.width / 2, u), u + S - f.width);
    y.set(l, { id: l, x: _, y: M });
  };
  let I = d;
  for (const l of b) {
    const u = m(l);
    g(l, I), I += u + n;
  }
  const X = t.map((l) => y.get(l.id));
  return dn(t, X, o, n);
}
function dn(t, e, n, o) {
  if (!n.length) return e;
  let s = 0;
  for (let a = 0; a <= n.length; a += 1) {
    let i = 0;
    if (e.forEach((p, x) => {
      const b = { ...t[x], x: p.x, y: p.y + s };
      for (const h of n)
        vt(b, h, o) && (i = Math.max(i, h.y + h.height + o - b.y));
    }), !i) break;
    s += i;
  }
  return s ? e.map((a) => ({ ...a, y: a.y + s })) : e;
}
function ln() {
  const t = "abcdefghijklmnopqrstuvwxyz0123456789";
  let e = "";
  for (let n = 0; n < 12; n += 1) e += t[Math.floor(Math.random() * t.length)];
  return e;
}
function hn(t) {
  const e = (a) => {
    const i = (parseInt(a, 16) || 0) / 255;
    return i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
  }, n = (a) => 0.2126 * e(a.substr(1, 2)) + 0.7152 * e(a.substr(3, 2)) + 0.0722 * e(a.substr(-2)), o = (a, i) => {
    const [p, x] = [n(a), n(i)];
    return (Math.max(p, x) + 0.05) / (Math.min(p, x) + 0.05);
  }, s = /^#[0-9a-f]{6}$/i.test(t) ? t : "#7aa2c8";
  return o(s, "#ffffff") > o(s, "#000000") ? "#ffffff" : "#000000";
}
function un(t, e, n) {
  return t.x < e.x + e.width + n && t.x + t.width + n > e.x && t.y < e.y + e.height + n && t.y + t.height + n > e.y;
}
function pn(t, e, n, o, s, a) {
  let i = t;
  for (let p = 0; p <= e.length; p += 1) {
    const x = e.filter((r) => i.some((d) => un({ ...d, width: n, height: o }, r, a)));
    if (!x.length) return i;
    let b = 0, h = 0;
    s === "left" ? b = Math.min(...x.map((r) => r.x - a)) - Math.max(...i.map((r) => r.x + n)) : s === "above" ? h = Math.min(...x.map((r) => r.y - a)) - Math.max(...i.map((r) => r.y + o)) : s === "below" || s === "center" ? h = Math.max(...x.map((r) => r.y + r.height + a)) - Math.min(...i.map((r) => r.y)) : b = Math.max(...x.map((r) => r.x + r.width + a)) - Math.min(...i.map((r) => r.x)), i = i.map((r) => ({ x: r.x + b, y: r.y + h }));
  }
  return i;
}
function ue(t, e) {
  if (e) {
    const n = t.nodes.find((s) => k(s) === e);
    if (n) return n;
    const o = t.nodes.filter((s) => `${s.options.text ?? ""}`.trim().toLowerCase() === e.trim().toLowerCase());
    if (o.length === 1) return o[0];
  }
  return [...t.nodes].sort((n, o) => U(o).x + U(o).width - (U(n).x + U(n).width))[0];
}
function jt(t, e) {
  const n = e === "grid" ? Math.ceil(Math.sqrt(t)) : t;
  return Array.from({ length: t }, (o, s) => ({
    row: e === "column" ? s : e === "grid" ? Math.floor(s / n) : 0,
    column: e === "column" ? 0 : e === "grid" ? s % n : s
  }));
}
function fn(t, e, n, o) {
  const s = e.count, a = e.placement || {}, i = a.gap ?? (a.connect ? Ae : 48);
  if (e.x !== void 0 && e.y !== void 0) {
    const d = a.arrangement || "row";
    return { points: jt(s, d).map(({ row: $, column: v }) => ({
      x: e.x + v * (n + i),
      y: e.y + $ * (o + i)
    })), arrangement: d, gap: i };
  }
  const p = ue(t, a.relativeTo), x = p ? U(p) : { x: 0, y: 0, width: 160, height: 100 }, b = a.direction || "right", h = a.arrangement || (["left", "right"].includes(b) ? "column" : "row"), r = jt(s, h).map(({ row: d, column: c }) => {
    let $ = x.x + c * (n + i), v = x.y + d * (o + i);
    return b === "right" && ($ += x.width + i), b === "left" && ($ -= n + i), b === "below" && (v += x.height + i), b === "above" && (v -= o + i), { x: $, y: v };
  });
  return { points: pn(r, t.nodes.map(U), n, o, b, i), arrangement: h, gap: i };
}
function mn(t, e) {
  if (!t) return { childId: `${pt}${e()}` };
  const n = t.match(/->(__free_.+)$/);
  return { id: t, childId: n ? n[1] : `${pt}${t.replace(/[^A-Za-z0-9_-]/g, "_")}` };
}
function Mt(t, e) {
  if (!t.has(e)) return e;
  let n = 2;
  for (; t.has(`${e}~${n}`); ) n += 1;
  return `${e}~${n}`;
}
const At = (t, e) => JSON.stringify([t, e]);
function Pt(t, e, n) {
  return new W(
    "id_taken",
    409,
    `${t} names ${e} ids already in use: ${n.join(", ")}. Choose new ids, or name the existing ${e}s in a later operation.`,
    { ids: n }
  );
}
const Qt = (t, e) => JSON.stringify(t) === JSON.stringify(e), gn = ["id", "name", "text", "xPos", "yPos", "x", "y", "isLocked"], Ct = (t) => JSON.parse(JSON.stringify(t)), bt = 1e6, te = {
  "align-left": "left",
  "align-center": "centerH",
  "align-right": "right",
  "align-top": "top",
  "align-middle": "middle",
  "align-bottom": "bottom"
}, rt = (t) => ({ id: k(t), ...U(t), rotationAngle: G(t, "rotationAngle") });
function Sn(t, e, n = {}) {
  const o = $t(n), s = _t(n), a = n.idFactory || ln, i = It(t), p = He(e, {
    ...n,
    existingNodeIds: i.nodes.map(k),
    existingConnectionIds: et(i).map(({ association: d }) => d.id)
  });
  if (!p.valid)
    throw new W("invalid_operation_plan", 400, p.errors.join(" "), { errors: p.errors });
  const x = JSON.stringify(i), b = i.nodes.length, h = [], r = {
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
    const y = () => r.warnings.push(`${v} matched no notes.`), g = (l) => {
      r.skipped.push({ operation: $, id: k(l), reason: "locked" });
    }, I = (l) => {
      const u = i.nodes.length + l;
      if (l > 0 && u > s.notesPerSlate && u > b)
        throw new W(
          "note_limit",
          422,
          `${v} would leave ${u} notes; a slate can hold at most ${s.notesPerSlate} notes.`,
          { limit: s.notesPerSlate, operation: $ }
        );
    }, X = (l, u) => {
      if (u > 0 && l > s.connectorsPerSlate)
        throw new W(
          "connector_limit",
          422,
          `${v} would leave ${l} connectors; a slate can hold at most ${s.connectorsPerSlate} connectors.`,
          { limit: s.connectorsPerSlate, operation: $ }
        );
    };
    switch (d.kind) {
      case "add_nodes": {
        const l = d.preset ? me[d.preset] : void 0, u = d.placement?.connect === !0, f = u ? i.nodes.find((z) => k(z) === d.placement.relativeTo) : void 0;
        if (u && !f)
          throw new W("no_match", 409, `${v} placement.relativeTo names no note on the slate to connect from.`, { operation: $ });
        if (f && f.options.isLocked === !0) {
          g(f);
          return;
        }
        const w = d.shape ?? l?.shape, S = f ? U(f) : void 0, M = d.width ?? l?.width ?? S?.width ?? (w?.toLowerCase() === "triangle" ? 150 : 180), A = d.height ?? l?.height ?? S?.height ?? (w?.toLowerCase() === "triangle" ? 130 : 110), L = f ?? ue(i, d.placement?.relativeTo), Y = d.style?.backgroundColor || l?.style?.backgroundColor || L?.options.backgroundColor || "#7aa2c8", { points: E, arrangement: N, gap: _ } = fn(i, d, M, A), O = new Set(et(i).map(({ association: z }) => z.id)), C = new Set(i.nodes.map(k)), T = (d.ids || []).filter((z) => C.has(z));
        if (T.length && !n.replay) throw Pt(v, "note", T);
        const B = E.map((z, F) => d.ids?.[F] || a());
        I(B.filter((z) => !C.has(z)).length), f && X(O.size + B.filter((z) => !C.has(z)).length, B.length), E.forEach(({ x: z, y: F }, Ft) => {
          const J = B[Ft];
          if (m.matched.push(J), C.has(J)) return;
          const Wt = d.text ? d.count > 1 ? d.text.replace(/\{n\}/g, `${Ft + 1}`) : d.text : "", gt = f ? Ct(f.options) : void 0;
          if (gt) for (const Q of gn) delete gt[Q];
          const st = gt ? { ...gt, id: J, name: J, text: Wt, width: M, height: A } : {
            id: J,
            name: J,
            text: Wt,
            defaultShaped: !0,
            width: M,
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
          w && P.shape.store(st, w, o), P.x.store(st, z, o), P.y.store(st, F, o), f || P.foregroundColor.store(st, hn(Y), o);
          for (const [Q, Ot] of Object.entries(l?.style || {})) P[Q].store(st, Ot, o);
          for (const [Q, Ot] of Object.entries(d.style || {})) P[Q].store(st, Ot, o);
          if (i.nodes.push({ options: st, relationships: { associations: [] } }), m.changed.push(J), r.created.push(J), f) {
            const Q = Mt(O, ut(k(f), J));
            O.add(Q), f.relationships.associations.push({ id: Q, parentId: k(f), childId: J, ...St }), r.connected.push(Q);
          }
        });
        const { placement: V, ...H } = d;
        h.push({
          ...H,
          ids: B,
          x: E[0].x,
          y: E[0].y,
          placement: { arrangement: N, gap: _, ...f ? { relativeTo: k(f), connect: !0 } : {} }
        });
        return;
      }
      case "update_nodes": {
        const l = tt(i, d.target, `${v} target`);
        m.matched = l.map(k), l.length || y();
        const u = [];
        for (const f of l) {
          if (f.options.isLocked === !0 && d.changes.locked !== !1) {
            g(f);
            continue;
          }
          const w = JSON.stringify(f.options);
          for (const [S, M] of Object.entries(d.changes))
            mt[S] || P[S].store(f.options, M, o);
          u.push(k(f)), JSON.stringify(f.options) !== w && m.changed.push(k(f));
        }
        if (d.changes.order && u.length) {
          const f = new Set(u), w = i.nodes.map(k), S = i.nodes.filter((A) => f.has(k(A))), M = i.nodes.filter((A) => !f.has(k(A)));
          i.nodes = d.changes.order === "front" ? [...M, ...S] : [...S, ...M], i.nodes.forEach((A, L) => {
            const Y = k(A);
            f.has(Y) && w[L] !== Y && !m.changed.includes(Y) && m.changed.push(Y);
          });
        }
        r.updated.push(...u), u.length && h.push({ kind: "update_nodes", target: { ids: u }, changes: d.changes });
        return;
      }
      case "delete_nodes": {
        const l = tt(i, d.target, `${v} target`);
        if (m.matched = l.map(k), l.length || y(), !d.target.ids && i.nodes.length > 1 && l.length === i.nodes.length && !de.test(n.userMessage || ""))
          throw new W("invalid_operation_plan", 400, `${v} cannot delete every note without an explicit request.`);
        const f = /* @__PURE__ */ new Set();
        for (const w of l)
          w.options.isLocked === !0 ? g(w) : f.add(k(w));
        i.nodes = i.nodes.filter((w) => !f.has(k(w)));
        for (const w of i.nodes)
          w.relationships.associations = w.relationships.associations.filter(
            (S) => !f.has(S.parentId) && !f.has(S.childId)
          );
        m.changed = [...f], r.deleted.push(...f), f.size && h.push({ kind: "delete_nodes", target: { ids: [...f] } });
        return;
      }
      case "duplicate_nodes": {
        const l = tt(i, d.target, `${v} target`);
        m.matched = l.map(k), l.length || y();
        const u = d.offset ?? Pe, f = new Set(i.nodes.map(k)), w = (d.ids || []).filter((E) => f.has(E));
        if (w.length && !n.replay) throw Pt(v, "note", w);
        const S = l.map((E, N) => d.ids?.[N] || a());
        I(S.filter((E) => !f.has(E)).length);
        for (const E of l) {
          const N = G(E, "x") + u.x, _ = G(E, "y") + u.y;
          if (Math.abs(N) > bt || Math.abs(_) > bt)
            throw new W(
              "invalid_operation_plan",
              400,
              `${v} would put the copy of ${k(E)} at ${N}, ${_}; a note's position must be from -${bt} to ${bt}.`
            );
        }
        const M = new Map(l.map((E, N) => [k(E), S[N]])), A = /* @__PURE__ */ new Map();
        l.forEach((E, N) => {
          const _ = S[N];
          if (f.has(_)) return;
          const O = { options: { ...Ct(E.options), id: _, name: _ }, relationships: { associations: [] } };
          P.x.store(O.options, G(E, "x") + u.x, o), P.y.store(O.options, G(E, "y") + u.y, o), i.nodes.push(O), A.set(_, O), m.changed.push(_), r.created.push(_);
        });
        const L = new Set(et(i).map(({ association: E }) => E.id));
        let Y = 0;
        for (const E of l) {
          const N = A.get(M.get(k(E)));
          if (N)
            for (const _ of E.relationships.associations) {
              const O = M.get(_.childId);
              if (!O || nt(_)) continue;
              const C = Mt(L, ut(k(N), O));
              L.add(C), N.relationships.associations.push({ ...Ct(_), id: C, parentId: k(N), childId: O }), r.connected.push(C), Y += 1;
            }
        }
        X(L.size, Y), l.length && h.push({ kind: "duplicate_nodes", target: { ids: l.map(k) }, ids: S, offset: { ...u } });
        return;
      }
      case "connect_nodes": {
        const l = tt(i, d.from, `${v} from`), u = d.to?.point, f = u ? [] : tt(i, d.to, `${v} to`);
        (!l.length || !u && !f.length) && y();
        const w = l.length * (u ? 1 : f.length);
        if (w > s.connectorsPerOperation)
          throw new W(
            "connector_limit",
            422,
            `${v} would join ${w} pairs of notes; one operation may join at most ${s.connectorsPerOperation}.`,
            { limit: s.connectorsPerOperation }
          );
        const S = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Map();
        for (const { association: N } of et(i)) {
          S.add(N.id);
          const _ = At(N.parentId, N.childId);
          M.has(_) || M.set(_, N.id);
        }
        const A = [], L = [], Y = [];
        let E = 0;
        for (const N of l) {
          const _ = k(N), O = u ? [null] : f.filter((C) => k(C) !== _);
          if (N.options.isLocked === !0) {
            O.length && g(N), E += O.length;
            continue;
          }
          O.length && Y.push(_);
          for (const C of O) {
            const T = d.ids?.[E];
            if (E += 1, !C) {
              const z = mn(T, a), F = z.id ?? ut(_, z.childId);
              if (S.has(F)) {
                n.replay || A.push(F), L.push(F), m.matched.push(F);
                continue;
              }
              N.relationships.associations.push({ id: F, parentId: _, childId: z.childId, targetPoint: { ...u }, ...St, ...d.style || {} }), S.add(F), L.push(F), m.matched.push(F), m.changed.push(F), r.connected.push(F);
              continue;
            }
            const B = k(C), V = M.get(At(_, B));
            if (V) {
              L.push(V), m.matched.push(V);
              continue;
            }
            if (T && S.has(T)) {
              n.replay || A.push(T), L.push(T), m.matched.push(T);
              continue;
            }
            const H = T || Mt(S, ut(_, B));
            N.relationships.associations.push({ id: H, parentId: _, childId: B, ...St, ...d.style || {} }), S.add(H), M.set(At(_, B), H), L.push(H), m.matched.push(H), m.changed.push(H), r.connected.push(H);
          }
        }
        if (A.length) throw Pt(v, "connector", A);
        if (S.size > s.connectorsPerSlate && m.changed.length)
          throw new W(
            "connector_limit",
            422,
            `A slate can hold at most ${s.connectorsPerSlate} connectors; this plan would leave ${S.size}.`,
            { limit: s.connectorsPerSlate }
          );
        m.changed.length && h.push({
          kind: "connect_nodes",
          from: { ids: Y },
          to: u ? { point: { ...u } } : { ids: f.map(k) },
          ids: L,
          ...d.style ? { style: d.style } : {}
        });
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        let l;
        if (d.connectionIds) {
          const u = new Set(d.connectionIds);
          l = et(i).filter(({ association: f }) => u.has(f.id));
        } else {
          const u = new Set(tt(i, d.from, `${v} from`).map(k)), f = new Set(tt(i, d.to, `${v} to`).map(k));
          l = et(i).filter(
            ({ association: w }) => u.has(w.parentId) && f.has(w.childId) || f.has(w.parentId) && u.has(w.childId)
          );
        }
        if (m.matched = l.map(({ association: u }) => u.id), l.length || r.warnings.push(`${v} matched no connectors.`), d.kind === "disconnect_nodes") {
          for (const { node: u, association: f } of l)
            u.relationships.associations = u.relationships.associations.filter((w) => w !== f);
          m.changed = [...m.matched], r.disconnected.push(...m.matched), l.length && h.push({ kind: "disconnect_nodes", connectionIds: m.matched });
          return;
        }
        for (const { node: u, association: f } of l) {
          const w = JSON.stringify([k(u), f]), S = Object.entries(d.changes).filter(([A]) => !Bt.includes(A));
          for (const [A, L] of S) f[ot[A].field || A] = L;
          const M = tn(i, u, f, d.changes, v, a);
          JSON.stringify([k(M), f]) !== w && m.changed.push(f.id);
        }
        r.connectionsUpdated.push(...m.matched), l.length && h.push({ kind: "update_connections", connectionIds: m.matched, changes: d.changes });
        return;
      }
      case "arrange_nodes": {
        const l = tt(i, d.target, `${v} target`);
        m.matched = l.map(k), l.length || y();
        const u = l.filter((_) => _.options.isLocked !== !0 ? !0 : (g(_), !1));
        if (!u.length) return;
        const f = d.layout;
        let w;
        if (te[f]) w = nn(te[f], u.map(rt));
        else if (f === "distribute-horizontal" || f === "distribute-vertical")
          w = on(f === "distribute-horizontal" ? "horizontal" : "vertical", u.map(rt));
        else if (f === "tidy") {
          const _ = new Set(u.map(k)), O = i.nodes.filter((C) => !_.has(k(C))).map(rt);
          w = rn(u.map(rt), O, { gap: d.gap ?? 20 });
        } else if (f === "tree") {
          const _ = et(i).filter(({ association: T }) => !nt(T)).map(({ association: T }) => [T.parentId, T.childId]), O = new Set(u.map(k)), C = i.nodes.filter((T) => !O.has(k(T))).map(rt);
          w = cn(u.map(rt), _, { gap: d.gap ?? 48, obstacles: C });
        }
        if (w) {
          const _ = new Map(u.map((O) => [k(O), O]));
          for (const O of w) {
            const C = _.get(O.id), T = [G(C, "x"), G(C, "y")];
            P.x.store(C.options, O.x, o), P.y.store(C.options, O.y, o), Qt(T, [O.x, O.y]) || m.changed.push(O.id);
          }
          r.updated.push(...u.map(k)), h.push({ kind: "arrange_nodes", target: { ids: u.map(k) }, layout: d.layout, ...d.gap !== void 0 ? { gap: d.gap } : {} });
          return;
        }
        const S = u.map(U), M = d.gap ?? 48, A = Math.min(...S.map((_) => _.x)), L = Math.min(...S.map((_) => _.y)), Y = Math.max(...S.map((_) => _.width), 120), E = Math.max(...S.map((_) => _.height), 80), N = jt(u.length, d.layout === "circle" ? "row" : d.layout);
        u.forEach((_, O) => {
          const C = [G(_, "x"), G(_, "y")];
          let T, B;
          if (d.layout === "circle") {
            const V = Math.max(180, u.length * 35), H = Math.PI * 2 * O / u.length;
            T = A + V + Math.cos(H) * V, B = L + V + Math.sin(H) * V;
          } else
            T = A + N[O].column * (Y + M), B = L + N[O].row * (E + M);
          P.x.store(_.options, T, o), P.y.store(_.options, B, o), Qt(C, [T, B]) || m.changed.push(k(_));
        }), r.updated.push(...u.map(k)), h.push({ kind: "arrange_nodes", target: { ids: u.map(k) }, layout: d.layout, ...d.gap !== void 0 ? { gap: M } : {} });
        return;
      }
      case "update_slate": {
        const l = d.changes, u = JSON.stringify(i);
        for (const [f, w] of Object.entries(dt))
          l[f] !== void 0 && w.store(i, l[f]);
        JSON.stringify(i) !== u && m.changed.push("slate"), h.push({ kind: "update_slate", changes: l });
        return;
      }
    }
  }), n.requireMatches && r.warnings.length) {
    const d = r.warnings[0];
    throw new W("no_match", 409, d, { operation: Number(d.match(/^Operation (\d+)/)?.[1]) });
  }
  return r.unchanged = JSON.stringify(i) === x, { slate: i, materializedPlan: { message: e.message.trim(), operations: h }, report: r };
}
const ee = ["id", ...Object.keys(P), "image"], wt = Object.freeze({ notes: 100, maxNotes: 500, maxChars: 6e4 }), ft = (t) => t.options.isComment === !0;
function pe(t, e) {
  const n = t.options, o = (a) => !e || e.includes(a), s = { id: k(t) };
  for (const [a, i] of Object.entries(P)) {
    if (!o(a)) continue;
    const p = i.read(n);
    s[a] = p === void 0 ? null : p;
  }
  return o("image") && (s.image = n.image || null), s;
}
function fe(t) {
  const e = nt(t), n = { id: t.id, from: t.parentId, to: e ? null : t.childId };
  for (const [s, a] of Object.entries(ot)) {
    if (Bt.includes(s)) continue;
    const i = t[a.field ?? s];
    n[s] = i === void 0 ? null : i;
  }
  e && (n.toPoint = t.targetPoint ?? null);
  const o = en(t);
  return (o.fromEnd !== "follow" || o.toEnd !== "follow") && Object.assign(n, o), n;
}
const lt = (t) => new W("invalid_selection", 400, t);
function yn(t) {
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
const bn = (t) => btoa(encodeURIComponent(JSON.stringify(t))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function wn(t) {
  try {
    const { after: e, at: n } = JSON.parse(decodeURIComponent(atob(t.replace(/-/g, "+").replace(/_/g, "/"))));
    if (typeof e == "string" && e && Number.isSafeInteger(n) && n >= 0) return { after: e, at: n };
  } catch {
  }
  throw lt("cursor is not one this slate gave. Read again from the first page.");
}
function xn(t, { after: e, at: n }) {
  let o = -1;
  if (t.forEach((s, a) => {
    k(s) === e && (o < 0 || Math.abs(a - n) < Math.abs(o - n)) && (o = a);
  }), o < 0) throw lt("The note this cursor continues from is gone. Read again from the first page.");
  return o + 1;
}
function kn(t) {
  if (!t.length) return null;
  const e = t.map(U), n = Math.min(...e.map((i) => i.x)), o = Math.min(...e.map((i) => i.y)), s = Math.max(...e.map((i) => i.x + i.width)), a = Math.max(...e.map((i) => i.y + i.height));
  return { x: n, y: o, width: s - n, height: a - o };
}
function En(t, e = {}) {
  const n = It(t), o = n.nodes.filter((y) => !ft(y)), s = e.fields;
  if (s !== void 0) {
    const y = s.filter((g) => !ee.includes(g));
    if (y.length) throw lt(`Unknown note field: ${y.join(", ")}. Choose from ${ee.join(", ")}.`);
  }
  const a = e.limit ?? wt.notes;
  if (!Number.isInteger(a) || a < 1 || a > wt.maxNotes)
    throw lt(`limit must be a whole number from 1 to ${wt.maxNotes}.`);
  const i = e.maxChars ?? wt.maxChars, p = yn(e), x = p ? tt({ ...n, nodes: o }, p, "selection") : o;
  let b = 0;
  e.cursor !== void 0 && (b = xn(x, wn(e.cursor)));
  const h = new Set(n.nodes.filter(ft).map(k)), r = /* @__PURE__ */ new Map();
  for (const { association: y } of et(n)) {
    if (h.has(y.parentId) || h.has(y.childId)) continue;
    const g = r.get(y.parentId) ?? [];
    g.push(y), r.set(y.parentId, g);
  }
  const d = [], c = [];
  let $ = 0, v = b;
  for (; v < x.length && d.length < a; v += 1) {
    const y = x[v], g = pe(y, s), I = (r.get(k(y)) ?? []).map(fe), X = JSON.stringify(g).length + JSON.stringify(I).length;
    if (d.length && $ + X > i) break;
    $ += X, d.push(g), c.push(...I);
  }
  const m = d[d.length - 1];
  return {
    name: n.options.name || "",
    description: n.options.description || "",
    background: Be(n.options.containerStyle),
    bounds: kn(o),
    nodeCount: x.length,
    nodes: d,
    connections: c,
    nextCursor: v < x.length && m ? bn({ after: m.id, at: v - 1 }) : null
  };
}
const vn = [
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
function Nn(t) {
  const e = It(t), n = new Set(e.nodes.filter(ft).map(k)), o = {};
  for (const a of vn) e.options[a] !== void 0 && (o[a] = e.options[a]);
  const s = e.nodes.filter((a) => !n.has(k(a))).map((a) => ({
    options: a.options,
    relationships: {
      ...a.relationships,
      associations: a.relationships.associations.filter((i) => !n.has(i.childId))
    }
  }));
  return { options: o, nodes: s, shareId: `${t?.shareId ?? e.options.shareId ?? ""}` };
}
const $n = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"], _n = [
  "lineColor",
  "lineWidth",
  "lineOpacity",
  "lineType",
  "lineCurveType",
  "lineCurviness",
  "showParentArrow",
  "showChildArrow"
];
function Mn(t) {
  const e = It(t), n = e.nodes.filter((i) => !ft(i)), o = new Set(e.nodes.filter(ft).map((i) => i.options.id)), s = n.slice(0, 150).map((i) => {
    const p = pe(i, $n);
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
  }), a = et(e).filter(({ association: i }) => !o.has(i.parentId) && !o.has(i.childId)).slice(0, 250).map(({ association: i }) => {
    const p = fe(i);
    return {
      id: p.id,
      from: p.from,
      to: p.to,
      ..."toPoint" in p ? { toPoint: p.toPoint } : {},
      // Whether each end follows its note, is pinned to a spot on its edge, or is free.
      ..."fromEnd" in p ? { fromEnd: p.fromEnd, toEnd: p.toEnd } : {},
      label: p.label || "",
      // A key the connector does not store reads as undefined, as it always has in the summary.
      ...Object.fromEntries(_n.map((x) => [x, p[x] ?? void 0]))
    };
  });
  return {
    name: e.options.name || "",
    description: e.options.description || "",
    nodeCount: n.length,
    nodes: s,
    connections: a
  };
}
function An(t = {}) {
  const e = $t(t), n = (o, s) => Object.fromEntries(Object.entries(o).map(([a, i]) => [a, { ...K(s(i)), description: i.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(xt.map((o) => [o, { fields: Rt[o].filter((s) => s !== "kind") }])),
    noteKeys: { ...n(P, (o) => o.spec(e)), ...n(mt, (o) => o.spec) },
    noteStyleKeys: [...Yt],
    connectorKeys: n(ot, (o) => o.spec),
    connectorStyleKeys: [...Xt],
    slateKeys: Object.fromEntries(
      Object.entries(dt).map(([o, s]) => [
        o,
        { ...o === "background" ? ae() : K(s.spec), description: s.description }
      ])
    ),
    selector: ce(),
    layouts: [...zt],
    presets: [...Dt],
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
function In(t = {}) {
  const e = $t(t), n = _t(t), o = (b) => Object.fromEntries(b.map((h) => [h, K(P[h].spec(e))])), s = (b) => Object.fromEntries(b.map((h) => [h, { ...K(P[h].spec(e)), description: P[h].description }])), a = (b) => Object.fromEntries(b.map((h) => [h, K(ot[h].spec)])), i = ce(), p = { type: "array", items: { type: "string" } }, x = xt.map((b) => `${b}: ${Rt[b].filter((h) => h !== "kind").join(", ")}`).join("; ");
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
            kind: { type: "string", enum: [...xt] },
            count: { type: "integer", minimum: 1, maximum: n.notesPerAdd },
            ...o(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...Dt],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given."
            },
            ids: { ...p, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: p,
            gap: { type: "number", minimum: 0, maximum: 2e3 },
            offset: { ...K({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...oe] },
                arrangement: { type: "string", enum: [...se] },
                gap: { type: "number", minimum: 0, maximum: 2e3 },
                connect: { type: "boolean" }
              }
            },
            style: {
              type: "object",
              additionalProperties: !1,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...o(Yt), ...a(Xt) }
            },
            target: i,
            from: i,
            to: {
              ...i,
              description: `${i.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...i.properties, point: K({ type: "point" }) }
            },
            layout: {
              type: "string",
              enum: [...zt],
              description: "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root."
            },
            changes: {
              type: "object",
              additionalProperties: !1,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(dt).join(", ")}.`,
              properties: {
                ...s(Object.keys(P)),
                ...Object.fromEntries(Object.entries(mt).map(([b, h]) => [b, K(h.spec)])),
                ...a(Object.keys(ot)),
                ...Object.fromEntries(
                  Object.entries(dt).map(([b, h]) => [b, b === "background" ? ae() : K(h.spec)])
                )
              }
            }
          }
        }
      }
    }
  };
}
const Pn = Object.freeze({
  name: "applySlateOperations",
  description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: In()
});
function Cn(t) {
  return `Call applySlateOperations again with a safe, valid plan. ${t.join(" ")}`;
}
function Tn(t) {
  if (typeof t?.message == "string" && t.message.trim()) return t.message.trim();
  const e = (t?.operations || []).reduce(
    (n, o) => n + (o.kind === "add_nodes" ? o.count || 0 : 1),
    0
  );
  return `Done — I applied ${e} ${e === 1 ? "change" : "changes"} to the slate.`;
}
export {
  ve as BORDER_STYLES,
  ot as CONNECTOR_KEYS,
  Xt as CONNECTOR_STYLE_KEYS,
  Te as DEFAULT_FONTS,
  vn as DOCUMENT_OPTION_KEYS,
  $e as EFFECTS,
  zt as LAYOUTS,
  Ce as LIMITS,
  mt as NODE_INTENT_KEYS,
  P as NODE_KEYS,
  Yt as NODE_STYLE_KEYS,
  ee as NOTE_READ_KEYS,
  Rt as OPERATION_FIELDS,
  W as OperationPlanError,
  Dt as PRESETS,
  wt as READ_LIMITS,
  dt as SLATE_KEYS,
  xt as SLATE_OPERATION_KINDS,
  Pn as SLATE_OPERATION_TOOL,
  nn as alignPositions,
  Sn as applyPlanToJSON,
  Be as backgroundOf,
  _t as contractLimits,
  $t as contractLists,
  An as describeOperations,
  on as distributePositions,
  Tn as naturalOperationFallback,
  Cn as operationPlanRetryPrompt,
  fe as readConnector,
  pe as readNote,
  En as readSlate,
  he as rotatedBounds,
  In as slateOperationPlanSchema,
  Mn as summarizeSlate,
  rn as tidyPositions,
  Nn as toSlateDocument,
  It as toStoredSlate,
  cn as treePositions,
  He as validatePlan
};
