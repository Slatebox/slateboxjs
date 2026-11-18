import e, { useState as C, useRef as q, useMemo as se, useLayoutEffect as Q, useEffect as A, useId as ge } from "react";
import { DraggableRenderer as B, translate as W, param as be, inOrder as Ee } from "./dragology.mjs";
import { handoffSummary as ee, reviewHandoff as T, resolveHandoff as te, offlineHandoff as ye, listeningRoom as ne, listeningRoomCaption as re, workshopLayout as Z, releaseLoad as ce, availableLanes as V, moveWorkshopCard as j, canHangPanel as J, hangGalleryPanel as G, printFields as P, workshopPositions as U, laneColors as ke } from "./workshop-model.mjs";
import { decodeWorkshopFragment as Ze, describeFocusDarkroom as Je, encodeWorkshopFragment as Ue, industrialWorkshop as Oe, initialFocusDarkroom as et, moonGallery as tt, nightTransfer as nt, normalizeFocusDarkroom as rt, normalizeListeningRoom as ot, normalizeMoonGallery as at, normalizeOfflineHandoff as lt, releasePlan as it, validateWorkshop as st, workshopPresentationLanes as ct, workshopPresentationScenes as dt, workshopToSlate as ft } from "./workshop-model.mjs";
function xe(t, f, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${f}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + o, d: `M59 ${o}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function we(t, f) {
  const n = t ? 9 : 49, o = t ? 20 : 23, r = t ? 144 : 181, d = t ? 183 : 370, s = t ? 35 : 40, a = t ? 164 : 255, m = t ? 119 : 147, l = 45, h = (p, g, x, c, u = "#243c32", y = "normal", E = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: W(p, g), fill: u, fontSize: c, fontFamily: E, fontWeight: y }, x);
  return ({ state: p, d: g, draggedId: x }) => {
    const c = p.stage === "queued", u = p.stage === "resolved", y = d + (a - m) / 2, E = s + 138, v = c ? n + (r - m) / 2 : y, L = c ? o + 141 : E, M = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + r - 2} ${o + 180} C${n + r + 45} ${o + 235},${d - 24} ${s + 204},${d + 22} ${s + 159}`, fill: "none", stroke: c ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: c ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: W(n, o) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: r, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: r, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: r - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), h(13, 27, "17:08", 9, M, "bold"), h(r - 50, 27, c ? "Offline" : "Online", 10, c ? "#835420" : "#266451", "bold"), h(13, 47, "Field log", t ? 18 : 20, M, "bold"), xe(13, 55, (r - 26) / 142), h(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, M), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: W(d, s) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${a - 5} -3 5 190 -${a - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${a - 1} -3 3 183 -${a - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + i, cx: "8", cy: i, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), h(23, 38, c ? "SHIFT HANDOFF" : u ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), h(22, 69, "Gate B", t ? 30 : 37, M, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${a - 42}`, stroke: "#bfc5b1" }), h(23, 101, (u && p.choice === "field" ? p.fieldNote : p.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, M, "bold"), h(23, 120, u && p.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: W((a - m) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: m, height: l, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), h(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: W(v, L),
        dragologyZIndex: x === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !f && c ? () => g.closest([p, T(p)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${m - 2}v${l - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${m}v${l - 7}l-7 7H0z`, fill: u ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${m - 7} ${l}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + i, cx: "8", cy: i, r: "1.3", fill: "#84662e" })),
      h(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      h(17, 34, u ? "Reviewed" : p.fieldNote === ye.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const ve = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
.sb-handoff .field-art svg{display:block;zoom:var(--drawing-scale,1);margin:auto}
.sb-handoff[data-stage=queued]:not([data-readonly=true]) #field-edit{cursor:grab}
.sb-handoff[data-stage=queued]:not([data-readonly=true]) #field-edit:active{cursor:grabbing}
.sb-handoff .field-versions{display:grid;grid-template-columns:1fr 1fr;border-block-end:1px solid #c3c7b5}
.sb-handoff .field-versions>div{padding:14px 12px 14px 0;min-width:0}
.sb-handoff .field-versions>div+div{border-left:1px solid #c3c7b5;padding-inline:15px 0}
.sb-handoff .field-versions h2,.sb-handoff .field-outcome h2{margin:0 0 .25rem;font:700 15px/1.25 system-ui,Arial,sans-serif;letter-spacing:-.02em}
.sb-handoff .field-versions p,.sb-handoff .field-outcome p{margin:.15rem 0 .4rem;font-size:clamp(15px,2.3vw,19px);line-height:1.3}
.sb-handoff .field-versions small,.sb-handoff .field-outcome small{font-size:12px;color:#566657}
.sb-handoff .field-versions.comparing>div:first-child{box-shadow:inset 0 4px #d29236}
.sb-handoff .field-versions.comparing>div+div{box-shadow:inset 0 4px #718b70}
.sb-handoff .field-outcome{padding:15px 0;border-bottom:1px solid #b9c6af}
.sb-handoff .field-outcome h2{font:600 clamp(21px,3vw,28px)/1.2 Georgia,serif}
.sb-handoff .field-actions{padding-top:14px;display:flex;align-items:center;flex-wrap:wrap;gap:7px}
.sb-handoff .field-actions [role=status]{margin-right:auto;font-size:14px;color:#435846}
.sb-handoff .field-actions button{font:600 13px/1.2 system-ui,sans-serif;background:#254c3a;color:#fffef3;border:1px solid #254c3a;padding:8px 12px;border-radius:3px}
.sb-handoff .field-actions button.field-quiet{color:#355441;background:transparent;border-color:#a9bba6}
@media(max-width:460px){.sb-handoff .field-art{margin-inline:-2px}.sb-handoff .field-versions>div{padding:12px 8px 12px 0}.sb-handoff .field-versions>div+div{padding-inline:9px 0}.sb-handoff .field-versions p{font-size:14px}.sb-handoff .field-actions [role=status]{width:100%}}.sb-handoff{background:#faf8ee;color:#213e32;font:15px/1.35 system-ui,Arial,sans-serif}.sb-handoff #field-edit{touch-action:none}.sb-handoff [data-stage=queued]{cursor:grab}.sb-handoff button:focus-visible{outline:3px solid #ab601d;outline-offset:2px}`;
function Ge({ value: t, onChange: f, readOnly: n = !1 }) {
  const [o, r] = C(null), [d, s] = C(null), [a, m] = C(0), [l, h] = C(!1), [p, g] = C(1), x = q(null), c = q(!1), u = q(t), y = se(() => we(l, n), [l, n]), E = n ? t : d ?? o ?? t, v = t.stage === "queued" && E.stage === "review";
  function L() {
    c.current = !1, s(null), r(null), m((i) => i + 1);
  }
  function M(i) {
    L(), !n && i.stage !== t.stage && f?.(i);
  }
  return Q(() => {
    (c.current || d) && (n || u.current !== t) && L(), u.current = t;
  }, [t, n, d]), Q(() => {
    const i = () => {
      const D = x.current.clientWidth;
      h(D < 510), g(Math.min(1, D / (D < 510 ? 360 : 685)));
    };
    i();
    const $ = new ResizeObserver(i);
    return $.observe(x.current), () => $.disconnect();
  }, []), A(() => {
    function i($) {
      (c.current || d) && (!($ instanceof KeyboardEvent) || $.key === "Escape") && L();
    }
    return document.addEventListener("keydown", i), document.addEventListener("pointercancel", i), window.addEventListener("blur", i), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("pointercancel", i), window.removeEventListener("blur", i);
    };
  }, [d]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, ve), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: x, style: { "--drawing-scale": p } }, /* @__PURE__ */ e.createElement(
    B,
    {
      key: n ? "read-only" : a,
      state: d ?? t,
      draggable: y,
      width: l ? 360 : 685,
      height: l ? 254 : 262,
      onDragState: n ? void 0 : (i) => {
        c.current = !0, r(i.stage !== t.stage && t.stage === "queued" ? i : null);
      },
      onDropState: n ? void 0 : M
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (E.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", E.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, ee(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, v ? "The two access reports disagree." : ee(t)), !n && (t.stage === "queued" ? v ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(T(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: L }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => s(T(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(te(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => M(te(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(T(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => M({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function Me() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const f = new t(), n = f.sampleRate, o = n * 4, r = f.createBuffer(1, o, n), d = f.createBuffer(1, o, n), s = r.getChannelData(0), a = d.getChannelData(0);
  let m = 419;
  function l() {
    return m = 1664525 * m + 1013904223 >>> 0, m / 4294967296;
  }
  for (let p = 0; p < 100; p++) {
    const g = Math.floor(l() * o), x = 380 + l() * 1500, c = 0.09 + l() * 0.08;
    for (let u = 0; u < n * 0.12; u++) {
      const y = u / n, E = Math.sin(2 * Math.PI * x * y) + 0.22 * (l() * 2 - 1);
      s[(g + u) % o] += c * Math.exp(-y * 76) * E;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((p, g) => {
    const x = Math.floor((g * 0.93 + 0.1) * n);
    for (let c = 0; c < n * 1.6; c++) {
      const u = c / n, y = Math.sin(u * p * 2 * Math.PI) + 0.23 * Math.sin(u * p * 5.42 * Math.PI);
      a[(x + c) % o] += 0.16 * Math.min(1, u * 250) * Math.exp(-u * 3.3) * y;
    }
  });
  const h = [r, d].map((p) => {
    const g = f.createBufferSource(), x = f.createGain();
    return x.gain.value = 0, g.buffer = p, g.loop = !0, g.connect(x).connect(f.destination), g.start(), x;
  });
  return {
    ctx: f,
    mix(p) {
      h[0].gain.setTargetAtTime(Math.cos(p * Math.PI / 2), f.currentTime, 0.035), h[1].gain.setTargetAtTime(Math.sin(p * Math.PI / 2), f.currentTime, 0.035);
    },
    stop() {
      f.close();
    }
  };
}
function de({ state: t, d: f, isTracking: n }, o) {
  const r = t.mix, d = 106 + 420 * r, s = W(d, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: s }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (a, m) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + m, cx: 18 + m * 137 % 604, cy: 12 + m * 47 % 103, r: m % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - r * 0.45 }, Array.from({ length: 30 }, (a, m) => {
    const l = 29 + m * 31 % 184, h = 24 + m * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + m, d: `M${l} ${h}l-3 8`, stroke: m % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: m % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + a, d: `M${39 + a * 15} ${116 + a * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + a, d: `M${65 + a * 35} ${177 - a * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + r * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((a) => {
    const m = 407 + a * 32, l = 63 - a % 3 * 4, h = 52 + (a + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + a, transform: W(m, l) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${h}l-8 5-8-6z`, fill: a % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${h + 7}l7-5V13z`, fill: a % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${h - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: r })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: s, dragologyOnDrag: o ? void 0 : () => f.vary(t, be("mix"), { constraint: (a) => Ee([0, a.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + r * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const $e = (t) => de(t, !1), Le = (t) => de(t, !0), ze = `
.sb-listening{color:#3f2848;background:#f6edf0;font:15px/1.4 system-ui,sans-serif}
.sb-listening .sb-listening-stage{border:1px solid #635166;background:#302342;overflow:hidden;min-width:0}
.sb-listening .sb-listening-stage svg{display:block;margin:auto;zoom:var(--horn-scale,1)}
.sb-listening [id="listening-horn"]{touch-action:none;cursor:grab}
.sb-listening [aria-readonly="true"] [id="listening-horn"]{touch-action:auto;cursor:default}
.sb-listening .sb-listening-choices{display:flex;flex-wrap:wrap;gap:.4rem;margin:.7rem 0}
.sb-listening button{color:#49324e;background:transparent;font:600 14px/1.25 system-ui,sans-serif;padding:.48rem .76rem;border:1px solid #89768c;border-radius:3px;cursor:pointer}
.sb-listening .sb-listening-caption{border-top:1px solid #cbbdcb;padding:.8rem 0;display:flex;justify-content:space-between;align-items:center;gap:.75rem}
.sb-listening .sb-listening-caption strong{display:block;font:600 12px/1.3 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.05em}
.sb-listening output{font:500 clamp(18px,2.6vw,25px)/1.1 Georgia,serif}
.sb-listening .sb-listening-caption button{flex:none;background:#4f3658;color:#fff4fa;border-color:#4f3658}
.sb-listening :focus-visible{outline:3px solid #ab601d;outline-offset:2px}
`;
function Qe({ value: t, onChange: f, readOnly: n = !1 }) {
  const o = q(null), r = q(null), [d, s] = C(null), [a, m] = C(0), [l, h] = C(1), [p, g] = C(!1), [x, c] = C(!1), u = d ?? t, y = q(t), E = q(!1);
  function v() {
    E.current = !1, s(null), m((k) => k + 1);
  }
  Q(() => {
    E.current && (n || t !== y.current) && v(), y.current = t;
  }, [t, n]), Q(() => {
    const k = o.current, S = () => h(Math.min(1, k.clientWidth / 640));
    S();
    const w = new ResizeObserver(S);
    return w.observe(k), () => w.disconnect();
  }, []), A(() => {
    function k(S) {
      E.current && (!(S instanceof KeyboardEvent) || S.key === "Escape") && v();
    }
    return document.addEventListener("keydown", k), document.addEventListener("pointercancel", k), window.addEventListener("blur", k), () => {
      document.removeEventListener("keydown", k), document.removeEventListener("pointercancel", k), window.removeEventListener("blur", k);
    };
  }, []);
  function L(k) {
    E.current = !1, s(null), !n && k !== t.mix && f?.({ ...t, mix: k });
  }
  function M() {
    r.current?.stop(), r.current = null, g(!1);
  }
  A(() => {
    r.current?.mix(u.mix);
  }, [u.mix]), A(() => {
    const k = new IntersectionObserver(([w]) => {
      w.isIntersecting || M();
    });
    k.observe(o.current);
    const S = () => {
      document.hidden && M();
    };
    return document.addEventListener("visibilitychange", S), () => {
      k.disconnect(), document.removeEventListener("visibilitychange", S), r.current?.stop(), r.current = null;
    };
  }, []);
  async function i() {
    if (r.current) {
      M();
      return;
    }
    try {
      const k = Me();
      r.current = k, k.mix(u.mix), await k.ctx.resume(), r.current === k && g(!0);
    } catch {
      M(), c(!0);
    }
  }
  const $ = t.leftLabel === ne.leftLabel ? "rain" : t.leftLabel, D = t.rightLabel === ne.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, ze), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: o,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": l },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": n,
      tabIndex: n ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(u.mix * 100),
      "aria-valuetext": re(u),
      onKeyDown: (k) => {
        if (n) return;
        const S = {
          ArrowLeft: u.mix - 0.01,
          ArrowRight: u.mix + 0.01,
          ArrowDown: u.mix - 0.01,
          ArrowUp: u.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(S, k.key) && (k.preventDefault(), L(Math.round(100 * Math.min(1, Math.max(0, S[k.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      B,
      {
        key: n ? "read-only" : a,
        state: t,
        draggable: n ? Le : $e,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (k) => {
          E.current = k !== null, s(k);
        },
        onDropState: n ? void 0 : (k) => L(k.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0) }, "Listen to ", $), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(1) }, "Listen to ", D)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, re(u))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: i, "aria-pressed": p, disabled: x }, x ? "Audio unavailable" : p ? "Mute sound" : "Enable sound")));
}
function Se(t, f, n) {
  const o = [];
  let r = "";
  for (const d of t.split(/\s+/u)) {
    const s = r ? r + " " + d : d;
    if (n.measureText(s).width <= f) {
      r = s;
      continue;
    }
    r && o.push(r), r = "";
    for (const a of d)
      r && n.measureText(r + a).width > f && (o.push(r), r = ""), r += a;
  }
  return r && o.push(r), o;
}
function We(t, f) {
  const n = Math.min(Z.pitch, Math.max(124, Math.floor(f / t.lanes.length))), o = n - 16, r = document.createElement("canvas").getContext("2d"), d = /* @__PURE__ */ new Map();
  function s(h, p, g) {
    r.font = g;
    let x = 1;
    for (const c of h) {
      const u = Se(c.label, o - 25, r);
      d.set(p + c.id, u), x = Math.max(x, u.length);
    }
    return x;
  }
  const a = s(t.lanes, "heading-", "bold 13px system-ui, sans-serif"), m = s(t.cards, "choice-", "14px system-ui, sans-serif"), l = Math.max(Z.height, 16 * m + 14);
  return { labels: d, layout: { pitch: n, width: o, height: l, row: l + 12, top: 16 * a + 45 } };
}
function Ce({ value: t, preview: f }) {
  const n = f ?? t, o = new Map(n.lanes.map((s) => [s.id, s.label])), r = new Map(n.cards.map((s) => [s.id, s])), d = n.cards.flatMap((s) => (s.dependsOn ?? []).map((a) => ({ feature: s, prerequisite: r.get(a) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((s) => s.capacity !== void 0).map((s) => {
    const a = ce(n, s.id);
    return /* @__PURE__ */ e.createElement("div", { key: s.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, s.label), /* @__PURE__ */ e.createElement("output", { "aria-label": s.label + " capacity" }, a, " / ", s.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": s.label + " point budget", min: 0, max: s.capacity, value: a, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), d.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, d.map(({ feature: s, prerequisite: a }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([s.id, a.id]) }, /* @__PURE__ */ e.createElement("strong", null, s.label), " needs ", a.label, " · ", o.get(a.laneId))))), f && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((s) => t.cards.find((a) => a.id === s.id)?.laneId !== s.laneId).map((s) => s.label + " → " + o.get(s.laneId)).join(" · ")));
}
function De({ value: t, preview: f, stage: n, apply: o, cancel: r }) {
  const [d, s] = C(t.cards[0].id), a = t.cards.find((l) => l.id === d) ?? t.cards[0], m = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (l) => {
    l.key === "Escape" && (r(), l.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: m }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: m, value: a.id, onChange: (l) => {
    s(l.target.value), r();
  } }, t.cards.map((l) => /* @__PURE__ */ e.createElement("option", { key: l.id, value: l.id }, l.label))), /* @__PURE__ */ e.createElement("div", null, V(t, a).filter((l) => l.id !== a.laneId).map((l) => /* @__PURE__ */ e.createElement("button", { key: l.id, type: "button", onClick: () => n(j(t, a.id, l.id), { cardId: a.id, laneId: l.id }) }, "Preview ", l.label))), f && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: o }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: r }, "Cancel preview")));
}
const oe = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], Ie = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], R = 148, H = 104;
function Fe(t) {
  const f = (n, o, r) => {
    const d = Array.from({ length: 38 }, (s, a) => {
      const m = Math.min(R, 4 * a), l = t * R + m, h = n + o * (Math.sin(l / 46) + 0.39 * Math.cos(l / 19) + 0.09 * Math.sin(l / 7));
      return (a ? "L" : "M") + m + " " + h.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: d + `L${R} ${H}H0z`, fill: r });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: R + 8, height: H + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: R + 4, height: H + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: R, height: H, fill: "#343b66" }), Array.from({ length: 13 }, (n, o) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + o, cx: 6 + (o * 77 + t * 19) % 136, cy: 4 + (o * 29 + t * 11) % 35, r: o % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), f(48, 7, "#9b88aa"), f(59, 10, "#bf9492"), f(75, 7, "#596d83"), f(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + o, d: `M${4 + (o * 37 + t * 13) % 124} ${92 + o * 3 % 10}h${4 + o % 3 * 4}`, stroke: "#7d9b9a" })));
}
function qe(t, f) {
  return ({ state: n, d: o, draggedId: r, isTracking: d }) => {
    const s = (l) => l === 1 ? "panorama-panel" : "gallery-panel-" + l, a = (l) => (n.hung.includes(n.panels[l].id) ? oe : Ie)[l], m = n.panels.findIndex((l, h) => s(h) === r);
    if (d && m >= 0) {
      const l = a(m);
      return /* @__PURE__ */ e.createElement("g", { id: s(m), transform: W(l.x, l.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + l, d: `M${40 + 83 * l} 225l${(l - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((l) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + l, transform: W(163 + l * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((l, h) => {
      const p = oe[h], g = a(h), x = !t && (!f || f.includes(l.id)) && J(n, l.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: l.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: h === 1 ? "gallery-hook" : "gallery-hook-" + h,
          x: p.x,
          y: p.y,
          width: R,
          height: H,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: p.x + R / 2, cy: p.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: s(h),
          transform: W(g.x, g.y),
          dragologyZIndex: r === s(h) ? "/1" : !1,
          dragologyOnDrag: x ? () => o.between([n, G(n, l.id)]) : void 0
        },
        Fe(["dunes", "moon", "coast"].indexOf(l.artwork))
      ));
    }));
  };
}
function Ve({ value: t, onChange: f, onPreview: n, readOnly: o = !1, enabledIds: r }) {
  const d = e.useRef(null), [s, a] = e.useState(1), [m, l] = e.useState(0), [h, p] = e.useState(null), g = e.useRef(t);
  g.current = t;
  const x = e.useMemo(() => qe(o, r), [o, r]), c = (i) => {
    p(i), n?.(i);
  }, u = e.useRef(n);
  u.current = n;
  const y = e.useCallback(() => {
    p(null), u.current?.(null), l((i) => i + 1);
  }, []);
  e.useEffect(() => {
    const i = new ResizeObserver(() => {
      d.current && a(Math.min(1, d.current.clientWidth / 640));
    });
    return i.observe(d.current), () => i.disconnect();
  }, []), e.useEffect(() => {
    y();
    const i = ($) => {
      $.key === "Escape" && y();
    };
    return document.addEventListener("keydown", i), window.addEventListener("blur", y), () => {
      document.removeEventListener("keydown", i), window.removeEventListener("blur", y);
    };
  }, [t, o, y]);
  function E(i) {
    if (c(null), o || g.current !== t) return;
    const $ = i.hung.find((D) => !t.hung.includes(D));
    $ && (!r || r.includes($)) && J(t, $) && f(G(t, $));
  }
  const v = h ?? t, L = v.panels.find((i) => v.hung.includes(i.id) && !t.hung.includes(i.id)), M = t.panels.filter((i) => !t.hung.includes(i.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: d, onPointerCancel: y, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: s, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    B,
    {
      key: m,
      draggable: x,
      width: 640,
      height: 300,
      state: t,
      onDragState: c,
      onDropState: E
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, v.panels.map((i, $) => /* @__PURE__ */ e.createElement("svg", { key: i.id, x: $ * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: v.hung.includes(i.id) ? "#343b66" : "#c7b8a8" }), v.hung.includes(i.id) && /* @__PURE__ */ e.createElement("g", null, i.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: i.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : i.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, L ? L.label + " lines up with its hook." : M.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !o && M.filter((i) => (!r || r.includes(i.id)) && J(t, i.id)).map((i) => /* @__PURE__ */ e.createElement("button", { key: i.id, type: "button", onFocus: () => c(G(t, i.id)), onBlur: () => c(null), onClick: () => E(G(t, i.id)) }, "Hang ", i.label)));
}
const Ne = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", _ = { start: 99, opener: 361 }, Re = { route: null }, ae = "#ffcb62";
function le(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((f) => /* @__PURE__ */ e.createElement("g", { key: f, transform: "scale(" + f + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (f, n) => {
    const o = 33 - n * 6, r = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${o}q${-r} -2 ${-r - 4} -15q${r} 1 ${r + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${o - 3}q${r - 1} -3 ${r + 2} -15q${-r} 3 ${-r - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (f, n) => {
    const o = (n - 5.5) * 6, r = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${o * 0.35} 6 ${o} ${r}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((d) => /* @__PURE__ */ e.createElement("path", { key: d, d: `M${o * d / 5} ${35 + (r - 35) * d / 5}q${o * 0.15 - 5} -4 ${o * 0.25 - 7} -13m${7 - o * 0.25} 13q6 -6 7 -13` })));
  }));
}
function fe({ state: t, d: f, isTracking: n }, o = !1) {
  const r = t.route ? _[t.route] : 232, d = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: W(r, d) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [_.start, _.opener].map((s, a) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(s) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${s} 85 ${s} 48V0`, fill: "none", stroke: t.route === "start" && a === 0 || t.route === "opener" && a === 1 ? ae : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: a ? "opener-jack" : "first-jack", cx: s, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: s, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, a ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: W(r, d), dragologyOnDrag: o ? void 0 : () => f.closest([Re, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: ae, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Pe(t) {
  return fe(t, !0);
}
function je({ value: t, onChange: f, readOnly: n = !1 }) {
  const o = n || !f, [r, d] = C(null), [s, a] = C(0), [m, l] = C(1), [h, p] = C(""), [g, x] = C(null), [c, u] = C(1), y = q(null), E = q(null), v = q([]), L = ge(), M = se(() => ({ route: t.route }), [t.route]), i = (!o && r ? r : M).route;
  A(() => {
    const w = y.current, I = new ResizeObserver(() => u(Math.min(1, w.clientWidth / 460)));
    return I.observe(w), () => I.disconnect();
  }, []);
  function $(w) {
    o || (d(null), p(""), f?.({ ...t, route: w.route }));
  }
  function D(w) {
    l(w), x(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), E.current?.showModal();
  }
  function k() {
    const w = t.route === "start" ? 0 : m;
    v.current[w]?.focus({ preventScroll: !0 });
    const I = t[P[w]];
    p(w === m ? "Focus returned to " + I + ", the print you opened." : "Focus jumped to " + I + ". You opened " + t[P[m]] + ".");
  }
  function S() {
    a((w) => w + 1), d(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": o || void 0,
      onPointerCancel: S,
      onKeyDown: (w) => {
        w.key === "Escape" && !E.current?.open && S();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, Ne),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, o ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, P.map((w, I) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: w,
        ref: (N) => {
          v.current[I] = N;
        },
        "aria-label": "Open " + t[w],
        onClick: () => D(I)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, le(I)),
      /* @__PURE__ */ e.createElement("span", null, t[w])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: y, style: { "--circuit-scale": c } }, /* @__PURE__ */ e.createElement(
      B,
      {
        key: o ? "locked" : s,
        state: M,
        width: 460,
        height: 108,
        draggable: o ? Pe : fe,
        onDragState: o ? void 0 : d,
        onDropState: o ? void 0 : $
      }
    )),
    !o && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "start", onClick: () => $({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "opener", onClick: () => $({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, i === "start" ? "Every viewer returns to the first print." : i === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, h || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: E, onClose: k, "aria-labelledby": L, onKeyDown: (w) => {
      w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), w.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, le(m)), /* @__PURE__ */ e.createElement("h2", { id: L }, t[P[m]]), !o && g !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (w) => {
      w.preventDefault(), g.trim() && (f?.({ ...t, [P[m]]: g.trim() }), x(null), E.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: g, onChange: (w) => x(w.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !g.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => x(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => E.current?.close() }, "Close viewer"), !o && g === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => x(t[P[m]]) }, "Rename print"))
  );
}
function ie(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((f) => f.trim()) ?? [t];
}
function O({ state: t, d: f, draggedId: n, isTracking: o }, r, d) {
  const s = d?.layout ?? Z, { width: a, row: m, height: l, top: h } = s, { points: p } = U(t, s), g = !!t.lanes[0].station, x = (c) => {
    const u = t.lanes.findIndex((E) => E.id === c.laneId), y = t.cards.filter((E) => E.laneId === c.laneId).indexOf(c);
    return W((g ? 18 : 8) + p[u].x, p[u].y + h + y * m);
  };
  if (o && n) {
    const c = t.cards.find((u) => "choice-" + u.id === n);
    if (c) return /* @__PURE__ */ e.createElement("g", { id: n, transform: x(c) });
  }
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((c, u) => (c.station?.next ?? []).map((y) => {
    const E = p[u], v = p[t.lanes.findIndex((w) => w.id === y)], L = a / 2 + 8, M = (h - 12) / 2 + 4, i = v.x - E.x, $ = v.y - E.y, D = Math.min(i ? a / 2 / Math.abs(i) : 1 / 0, $ ? (M - 4) / Math.abs($) : 1 / 0), k = v.x + L - i * D, S = v.y + M - $ * D;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: c.id + "-" + y }, /* @__PURE__ */ e.createElement("line", { x1: E.x + L, y1: E.y + M, x2: k, y2: S, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${k} ${S}) rotate(${Math.atan2($, i) * 180 / Math.PI})` }));
  })), t.lanes.map((c, u) => {
    const y = t.cards.filter((L) => L.laneId === c.id).length, E = t.kind === "release-plan" && ce(t, c.id), v = t.kind === "release-plan" ? E + (c.capacity ? " / " + c.capacity : "") + " points" : c.station ? y ? "● Occupied" : "Open stop" : c.capacity ? `${y} of ${c.capacity} slots` : `${y} ${y === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + c.id, transform: W(8 + p[u].x, 4 + p[u].y) }, g && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: a, height: h + Math.max(1, y) * m - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: h - 12, rx: g ? 6 : 9, fill: g ? "#253c36" : ke[u] }), (d?.labels.get("heading-" + c.id) ?? ie(c.label)).map((L, M) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + M, fill: g ? "#fffdf3" : "#18302d", transform: W(12, (g ? 23 : 16) + M * 16), fontSize: g ? 17 : 13, fontWeight: "bold" }, L)), /* @__PURE__ */ e.createElement("text", { fill: g ? "#ebd29a" : "#18302d", transform: W(12, h - 23), fontSize: 12 }, v));
  }), t.cards.map((c) => {
    const u = r ? [] : V(t, c), y = "choice-" + c.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: y,
        transform: x(c),
        dragologyZIndex: n === y ? "/1" : !1,
        dragologyOnDrag: u.length > 1 ? () => f.closest(u.map((E) => j(t, c.id, E.id))).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: g ? a - 20 : a, height: l - (g ? 6 : 0), fill: g ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: g ? 1 : 8 }),
      g && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: W(12, l - 10), fill: "#466358", fontSize: 12 }, c.points, " pts"),
      (d?.labels.get(y) ?? ie(c.label)).map((E, v) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + v, transform: W(12, 17 + v * 16), fontSize: 14 }, E))
    );
  }));
}
const He = (t) => O(t, !1), Ae = (t) => O(t, !0);
function Xe({ value: t, onChange: f, onPreview: n, onUndo: o, canUndo: r, readOnly: d = !1, fitLanes: s = !1 }) {
  const a = e.useRef(null), [m, l] = e.useState(0), h = s && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const b = a.current;
    if (!h || !b) return;
    const z = () => l(b.clientWidth);
    z();
    const F = new ResizeObserver(z);
    return F.observe(b), () => F.disconnect();
  }, [h]);
  const p = e.useMemo(() => h && m ? We(t, m) : void 0, [h, m, t]), { width: g, height: x } = U(t, p?.layout), c = t.kind === "release-plan", [u, y] = e.useState(0), E = e.useRef(!1), v = e.useRef(null), [L, M] = e.useState(null), [i, $] = e.useState(null), [D, k] = e.useState(null), S = !d && i?.source === t ? i : null, w = e.useRef(t), I = e.useCallback((b) => {
    c && M(b), n?.(b);
  }, [c, n]), N = e.useCallback(() => {
    E.current = !1, v.current = null, $(null), I(null), y((b) => b + 1);
  }, [I]);
  e.useLayoutEffect(() => {
    w.current !== t && (E.current || i) && N(), w.current = t;
  }, [t, i, N]);
  const K = (b, z) => {
    E.current = !1, $(null), b !== t && (c && !o && k({ before: t, after: b }), f(b, z));
  }, me = (b) => {
    const z = b.cards.find((F) => F.id === v.current);
    K(b, z && { cardId: z.id, laneId: z.laneId });
  }, ue = e.useCallback((b) => {
    const z = b.type === "dragging" ? b : b.pendingDrag?.status;
    E.current = !!z, z ? (v.current = z.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, $(null)) : v.current !== null && (v.current = null, I(null));
  }, [I]);
  e.useEffect(() => {
    function b(z) {
      !E.current && !i || z instanceof KeyboardEvent && z.key !== "Escape" || N();
    }
    return document.addEventListener("keydown", b), document.addEventListener("pointercancel", b), window.addEventListener("blur", b), () => {
      document.removeEventListener("keydown", b), document.removeEventListener("pointercancel", b), window.removeEventListener("blur", b);
    };
  }, [N, i]);
  const X = d ? null : S?.next ?? L, Y = !!(d || S), pe = e.useMemo(() => p ? (b) => O(b, Y, p) : Y ? Ae : He, [p, Y]), he = X ? Math.max(x, U(X, p?.layout).height) : x;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement("div", { ref: a, style: { maxWidth: "100%", overflowX: "auto" } }, /* @__PURE__ */ e.createElement(
    B,
    {
      key: d ? "read-only" : u,
      draggable: pe,
      state: S?.next ?? t,
      onDropState: d ? void 0 : me,
      onDragState: d ? void 0 : I,
      onDragStatus: ue,
      width: g,
      height: he
    }
  )), c && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Ce, { value: t, preview: X }), !d && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    De,
    {
      value: t,
      preview: S?.move ?? null,
      stage: (b, z) => {
        $({ source: t, next: b, move: z }), n?.(b);
      },
      cancel: N,
      apply: () => {
        S && (K(S.next, S.move), I(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(o ? r : D?.after === t), onClick: () => {
    N(), o ? o() : D?.after === t && (k(null), f(D.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((b) => {
    const z = t.lanes.find((F) => F.id === b.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: b.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, b.label, " · ", z.label), /* @__PURE__ */ e.createElement("br", null), z.station.outcome), V(t, b).filter((F) => F.id !== b.laneId).map((F) => /* @__PURE__ */ e.createElement("button", { key: F.id, type: "button", disabled: d, onClick: () => K(j(t, b.id, F.id), { cardId: b.id, laneId: F.id }) }, b.label, " → ", F.label)));
  })), !c && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((b) => /* @__PURE__ */ e.createElement("label", { key: b.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, b.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: d,
      "aria-label": "Move " + b.label,
      value: b.laneId,
      onChange: (z) => K(j(t, b.id, z.currentTarget.value), { cardId: b.id, laneId: z.currentTarget.value })
    },
    V(t, b).map((z) => /* @__PURE__ */ e.createElement("option", { key: z.id, value: z.id }, z.label))
  )))));
}
export {
  je as FocusDarkroomBoard,
  Qe as ListeningRoomBoard,
  Ve as MoonGalleryBoard,
  Ge as OfflineHandoffBoard,
  Ce as ReleasePlanReadout,
  Xe as WorkshopBoard,
  V as availableLanes,
  J as canHangPanel,
  Ze as decodeWorkshopFragment,
  Je as describeFocusDarkroom,
  Ue as encodeWorkshopFragment,
  ee as handoffSummary,
  G as hangGalleryPanel,
  Oe as industrialWorkshop,
  et as initialFocusDarkroom,
  ke as laneColors,
  ne as listeningRoom,
  re as listeningRoomCaption,
  tt as moonGallery,
  j as moveWorkshopCard,
  nt as nightTransfer,
  rt as normalizeFocusDarkroom,
  ot as normalizeListeningRoom,
  at as normalizeMoonGallery,
  lt as normalizeOfflineHandoff,
  ye as offlineHandoff,
  P as printFields,
  ce as releaseLoad,
  it as releasePlan,
  te as resolveHandoff,
  T as reviewHandoff,
  st as validateWorkshop,
  Z as workshopLayout,
  U as workshopPositions,
  ct as workshopPresentationLanes,
  dt as workshopPresentationScenes,
  ft as workshopToSlate
};
