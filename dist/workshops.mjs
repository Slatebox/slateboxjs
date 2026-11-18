import e, { useState as I, useRef as R, useMemo as $e, useLayoutEffect as re, useEffect as _, useId as Fe } from "react";
import { DraggableRenderer as Z, translate as D, param as Pe, inOrder as Be } from "./dragology.mjs";
import { handoffSummary as be, reviewHandoff as te, resolveHandoff as Ee, offlineHandoff as Re, listeningRoom as ye, listeningRoomCaption as ke, workshopLayout as de, releaseLoad as Le, availableLanes as oe, moveWorkshopCard as ae, canHangPanel as fe, hangGalleryPanel as ne, printFields as G, workshopPositions as ue, maxWorkshopCards as qe, resolveWorkshopSignals as Ae, laneColors as He } from "./workshop-model.mjs";
import { addWorkshopBranch as ht, addWorkshopCard as gt, addWorkshopLane as bt, createLaneWorkshop as Et, createWorkshopMap as yt, decodeWorkshopFragment as kt, describeFocusDarkroom as xt, encodeWorkshopFragment as wt, industrialWorkshop as vt, initialFocusDarkroom as Mt, moonGallery as $t, nightTransfer as Lt, normalizeFocusDarkroom as St, normalizeListeningRoom as Wt, normalizeMoonGallery as zt, normalizeOfflineHandoff as Ct, releasePlan as Dt, validateWorkshop as It, workshopPresentationLanes as Ft, workshopPresentationScenes as Pt, workshopToSlate as Bt } from "./workshop-model.mjs";
function Ne(t, f, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${f}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((i) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + i, d: `M59 ${i}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function Ke(t, f) {
  const n = t ? 9 : 49, i = t ? 20 : 23, o = t ? 144 : 181, u = t ? 183 : 370, c = t ? 35 : 40, s = t ? 164 : 255, m = t ? 119 : 147, r = 45, b = (g, v, w, y, p = "#243c32", $ = "normal", E = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: D(g, v), fill: p, fontSize: y, fontFamily: E, fontWeight: $ }, w);
  return ({ state: g, d: v, draggedId: w }) => {
    const y = g.stage === "queued", p = g.stage === "resolved", $ = u + (s - m) / 2, E = c + 138, z = y ? n + (o - m) / 2 : $, L = y ? i + 141 : E, d = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + o - 2} ${i + 180} C${n + o + 45} ${i + 235},${u - 24} ${c + 204},${u + 22} ${c + 159}`, fill: "none", stroke: y ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: y ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: D(n, i) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: o, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: o, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: o - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: o / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), b(13, 27, "17:08", 9, d, "bold"), b(o - 50, 27, y ? "Offline" : "Online", 10, y ? "#835420" : "#266451", "bold"), b(13, 47, "Field log", t ? 18 : 20, d, "bold"), Ne(13, 55, (o - 26) / 142), b(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, d), /* @__PURE__ */ e.createElement("rect", { x: o / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: D(u, c) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${s - 5} -3 5 190 -${s - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${s - 1} -3 3 183 -${s - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: s, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((l) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + l, cx: "8", cy: l, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), b(23, 38, y ? "SHIFT HANDOFF" : p ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), b(22, 69, "Gate B", t ? 30 : 37, d, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${s - 42}`, stroke: "#bfc5b1" }), b(23, 101, (p && g.choice === "field" ? g.fieldNote : g.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, d, "bold"), b(23, 120, p && g.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: D((s - m) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: m, height: r, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), b(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: D(z, L),
        dragologyZIndex: w === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !f && y ? () => v.closest([g, te(g)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${m - 2}v${r - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${m}v${r - 7}l-7 7H0z`, fill: p ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${m - 7} ${r}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((l) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + l, cx: "8", cy: l, r: "1.3", fill: "#84662e" })),
      b(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      b(17, 34, p ? "Reviewed" : g.fieldNote === Re.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const Te = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function st({ value: t, onChange: f, readOnly: n = !1 }) {
  const [i, o] = I(null), [u, c] = I(null), [s, m] = I(0), [r, b] = I(!1), [g, v] = I(1), w = R(null), y = R(!1), p = R(t), $ = $e(() => Ke(r, n), [r, n]), E = n ? t : u ?? i ?? t, z = t.stage === "queued" && E.stage === "review";
  function L() {
    y.current = !1, c(null), o(null), m((l) => l + 1);
  }
  function d(l) {
    L(), !n && l.stage !== t.stage && f?.(l);
  }
  return re(() => {
    (y.current || u) && (n || p.current !== t) && L(), p.current = t;
  }, [t, n, u]), re(() => {
    const l = () => {
      const W = w.current.clientWidth;
      b(W < 510), v(Math.min(1, W / (W < 510 ? 360 : 685)));
    };
    l();
    const M = new ResizeObserver(l);
    return M.observe(w.current), () => M.disconnect();
  }, []), _(() => {
    function l(M) {
      (y.current || u) && (!(M instanceof KeyboardEvent) || M.key === "Escape") && L();
    }
    return document.addEventListener("keydown", l), document.addEventListener("pointercancel", l), window.addEventListener("blur", l), () => {
      document.removeEventListener("keydown", l), document.removeEventListener("pointercancel", l), window.removeEventListener("blur", l);
    };
  }, [u]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, Te), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: w, style: { "--drawing-scale": g } }, /* @__PURE__ */ e.createElement(
    Z,
    {
      key: n ? "read-only" : s,
      state: u ?? t,
      draggable: $,
      width: r ? 360 : 685,
      height: r ? 254 : 262,
      onDragState: n ? void 0 : (l) => {
        y.current = !0, o(l.stage !== t.stage && t.stage === "queued" ? l : null);
      },
      onDropState: n ? void 0 : d
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (E.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", E.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, be(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, z ? "The two access reports disagree." : be(t)), !n && (t.stage === "queued" ? z ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(te(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: L }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => c(te(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(Ee(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => d(Ee(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(te(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => d({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function Ge() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const f = new t(), n = f.sampleRate, i = n * 4, o = f.createBuffer(1, i, n), u = f.createBuffer(1, i, n), c = o.getChannelData(0), s = u.getChannelData(0);
  let m = 419;
  function r() {
    return m = 1664525 * m + 1013904223 >>> 0, m / 4294967296;
  }
  for (let g = 0; g < 100; g++) {
    const v = Math.floor(r() * i), w = 380 + r() * 1500, y = 0.09 + r() * 0.08;
    for (let p = 0; p < n * 0.12; p++) {
      const $ = p / n, E = Math.sin(2 * Math.PI * w * $) + 0.22 * (r() * 2 - 1);
      c[(v + p) % i] += y * Math.exp(-$ * 76) * E;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((g, v) => {
    const w = Math.floor((v * 0.93 + 0.1) * n);
    for (let y = 0; y < n * 1.6; y++) {
      const p = y / n, $ = Math.sin(p * g * 2 * Math.PI) + 0.23 * Math.sin(p * g * 5.42 * Math.PI);
      s[(w + y) % i] += 0.16 * Math.min(1, p * 250) * Math.exp(-p * 3.3) * $;
    }
  });
  const b = [o, u].map((g) => {
    const v = f.createBufferSource(), w = f.createGain();
    return w.gain.value = 0, v.buffer = g, v.loop = !0, v.connect(w).connect(f.destination), v.start(), w;
  });
  return {
    ctx: f,
    mix(g) {
      b[0].gain.setTargetAtTime(Math.cos(g * Math.PI / 2), f.currentTime, 0.035), b[1].gain.setTargetAtTime(Math.sin(g * Math.PI / 2), f.currentTime, 0.035);
    },
    stop() {
      f.close();
    }
  };
}
function Se({ state: t, d: f, isTracking: n }, i) {
  const o = t.mix, u = 106 + 420 * o, c = D(u, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (s, m) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + m, cx: 18 + m * 137 % 604, cy: 12 + m * 47 % 103, r: m % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - o * 0.45 }, Array.from({ length: 30 }, (s, m) => {
    const r = 29 + m * 31 % 184, b = 24 + m * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + m, d: `M${r} ${b}l-3 8`, stroke: m % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: m % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + s, d: `M${39 + s * 15} ${116 + s * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + s, d: `M${65 + s * 35} ${177 - s * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + o * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((s) => {
    const m = 407 + s * 32, r = 63 - s % 3 * 4, b = 52 + (s + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + s, transform: D(m, r) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${b}l-8 5-8-6z`, fill: s % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${b + 7}l7-5V13z`, fill: s % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${b - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: o })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c, dragologyOnDrag: i ? void 0 : () => f.vary(t, Pe("mix"), { constraint: (s) => Be([0, s.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + o * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const Qe = (t) => Se(t, !1), je = (t) => Se(t, !0), Ve = `
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
function ct({ value: t, onChange: f, readOnly: n = !1 }) {
  const i = R(null), o = R(null), [u, c] = I(null), [s, m] = I(0), [r, b] = I(1), [g, v] = I(!1), [w, y] = I(!1), p = u ?? t, $ = R(t), E = R(!1);
  function z() {
    E.current = !1, c(null), m((h) => h + 1);
  }
  re(() => {
    E.current && (n || t !== $.current) && z(), $.current = t;
  }, [t, n]), re(() => {
    const h = i.current, S = () => b(Math.min(1, h.clientWidth / 640));
    S();
    const k = new ResizeObserver(S);
    return k.observe(h), () => k.disconnect();
  }, []), _(() => {
    function h(S) {
      E.current && (!(S instanceof KeyboardEvent) || S.key === "Escape") && z();
    }
    return document.addEventListener("keydown", h), document.addEventListener("pointercancel", h), window.addEventListener("blur", h), () => {
      document.removeEventListener("keydown", h), document.removeEventListener("pointercancel", h), window.removeEventListener("blur", h);
    };
  }, []);
  function L(h) {
    E.current = !1, c(null), !n && h !== t.mix && f?.({ ...t, mix: h });
  }
  function d() {
    o.current?.stop(), o.current = null, v(!1);
  }
  _(() => {
    o.current?.mix(p.mix);
  }, [p.mix]), _(() => {
    const h = new IntersectionObserver(([k]) => {
      k.isIntersecting || d();
    });
    h.observe(i.current);
    const S = () => {
      document.hidden && d();
    };
    return document.addEventListener("visibilitychange", S), () => {
      h.disconnect(), document.removeEventListener("visibilitychange", S), o.current?.stop(), o.current = null;
    };
  }, []);
  async function l() {
    if (o.current) {
      d();
      return;
    }
    try {
      const h = Ge();
      o.current = h, h.mix(p.mix), await h.ctx.resume(), o.current === h && v(!0);
    } catch {
      d(), y(!0);
    }
  }
  const M = t.leftLabel === ye.leftLabel ? "rain" : t.leftLabel, W = t.rightLabel === ye.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, Ve), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: i,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": r },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": n,
      tabIndex: n ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(p.mix * 100),
      "aria-valuetext": ke(p),
      onKeyDown: (h) => {
        if (n) return;
        const S = {
          ArrowLeft: p.mix - 0.01,
          ArrowRight: p.mix + 0.01,
          ArrowDown: p.mix - 0.01,
          ArrowUp: p.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(S, h.key) && (h.preventDefault(), L(Math.round(100 * Math.min(1, Math.max(0, S[h.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      Z,
      {
        key: n ? "read-only" : s,
        state: t,
        draggable: n ? je : Qe,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (h) => {
          E.current = h !== null, c(h);
        },
        onDropState: n ? void 0 : (h) => L(h.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0) }, "Listen to ", M), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(1) }, "Listen to ", W)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, ke(p))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: l, "aria-pressed": g, disabled: w }, w ? "Audio unavailable" : g ? "Mute sound" : "Enable sound")));
}
function Xe(t, f, n) {
  const i = [];
  let o = "";
  for (const u of t.split(/\s+/u)) {
    const c = o ? o + " " + u : u;
    if (n.measureText(c).width <= f) {
      o = c;
      continue;
    }
    o && i.push(o), o = "";
    for (const s of u)
      o && n.measureText(o + s).width > f && (i.push(o), o = ""), o += s;
  }
  return o && i.push(o), i;
}
function Ye(t, f, n = !1) {
  const i = n ? Math.max(...t.lanes.map((w) => w.station.column)) + 1 : t.lanes.length, o = n ? (i - 1) * 28 : 0, u = Math.min(n ? 202 : de.pitch, Math.max(n ? 145 : 124, Math.floor((f - o) / i))), c = u - 16, s = document.createElement("canvas").getContext("2d"), m = /* @__PURE__ */ new Map();
  function r(w, y, p) {
    s.font = p;
    let $ = 1;
    for (const E of w) {
      const z = n && y === "choice-" ? 49 : 25, L = Xe(E.label, c - z, s);
      m.set(y + E.id, L), $ = Math.max($, L.length);
    }
    return $;
  }
  const b = r(t.lanes, "heading-", n ? "bold 15px system-ui, sans-serif" : "bold 13px system-ui, sans-serif"), g = r(t.cards, "choice-", "14px system-ui, sans-serif");
  if (n) {
    const w = 16 * g + 22;
    return { labels: m, layout: { pitch: u, width: c, height: w, row: w + 6, top: 16 * b + 32 } };
  }
  const v = Math.max(de.height, 16 * g + 14);
  return { labels: m, layout: { pitch: u, width: c, height: v, row: v + 12, top: 16 * b + 45 } };
}
function _e({ value: t, preview: f }) {
  const n = f ?? t, i = new Map(n.lanes.map((c) => [c.id, c.label])), o = new Map(n.cards.map((c) => [c.id, c])), u = n.cards.flatMap((c) => (c.dependsOn ?? []).map((s) => ({ feature: c, prerequisite: o.get(s) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((c) => c.capacity !== void 0).map((c) => {
    const s = Le(n, c.id);
    return /* @__PURE__ */ e.createElement("div", { key: c.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, c.label), /* @__PURE__ */ e.createElement("output", { "aria-label": c.label + " capacity" }, s, " / ", c.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": c.label + " point budget", min: 0, max: c.capacity, value: s, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), u.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, u.map(({ feature: c, prerequisite: s }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([c.id, s.id]) }, /* @__PURE__ */ e.createElement("strong", null, c.label), " needs ", s.label, " · ", i.get(s.laneId))))), f && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((c) => t.cards.find((s) => s.id === c.id)?.laneId !== c.laneId).map((c) => c.label + " → " + i.get(c.laneId)).join(" · ")));
}
function Ze({ value: t, preview: f, stage: n, apply: i, cancel: o }) {
  const [u, c] = I(t.cards[0].id), s = t.cards.find((r) => r.id === u) ?? t.cards[0], m = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (r) => {
    r.key === "Escape" && (o(), r.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: m }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: m, value: s.id, onChange: (r) => {
    c(r.target.value), o();
  } }, t.cards.map((r) => /* @__PURE__ */ e.createElement("option", { key: r.id, value: r.id }, r.label))), /* @__PURE__ */ e.createElement("div", null, oe(t, s).filter((r) => r.id !== s.laneId).map((r) => /* @__PURE__ */ e.createElement("button", { key: r.id, type: "button", onClick: () => n(ae(t, s.id, r.id), { cardId: s.id, laneId: r.id }) }, "Preview ", r.label))), f && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: i }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: o }, "Cancel preview")));
}
const xe = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], Je = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], K = 148, Y = 104;
function Ue(t) {
  const f = (n, i, o) => {
    const u = Array.from({ length: 38 }, (c, s) => {
      const m = Math.min(K, 4 * s), r = t * K + m, b = n + i * (Math.sin(r / 46) + 0.39 * Math.cos(r / 19) + 0.09 * Math.sin(r / 7));
      return (s ? "L" : "M") + m + " " + b.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: u + `L${K} ${Y}H0z`, fill: o });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: K + 8, height: Y + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: K + 4, height: Y + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: K, height: Y, fill: "#343b66" }), Array.from({ length: 13 }, (n, i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + i, cx: 6 + (i * 77 + t * 19) % 136, cy: 4 + (i * 29 + t * 11) % 35, r: i % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), f(48, 7, "#9b88aa"), f(59, 10, "#bf9492"), f(75, 7, "#596d83"), f(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, i) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + i, d: `M${4 + (i * 37 + t * 13) % 124} ${92 + i * 3 % 10}h${4 + i % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Oe(t, f) {
  return ({ state: n, d: i, draggedId: o, isTracking: u }) => {
    const c = (r) => r === 1 ? "panorama-panel" : "gallery-panel-" + r, s = (r) => (n.hung.includes(n.panels[r].id) ? xe : Je)[r], m = n.panels.findIndex((r, b) => c(b) === o);
    if (u && m >= 0) {
      const r = s(m);
      return /* @__PURE__ */ e.createElement("g", { id: c(m), transform: D(r.x, r.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((r) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + r, d: `M${40 + 83 * r} 225l${(r - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((r) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + r, transform: D(163 + r * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((r, b) => {
      const g = xe[b], v = s(b), w = !t && (!f || f.includes(r.id)) && fe(n, r.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: r.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: b === 1 ? "gallery-hook" : "gallery-hook-" + b,
          x: g.x,
          y: g.y,
          width: K,
          height: Y,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: g.x + K / 2, cy: g.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: c(b),
          transform: D(v.x, v.y),
          dragologyZIndex: o === c(b) ? "/1" : !1,
          dragologyOnDrag: w ? () => i.between([n, ne(n, r.id)]) : void 0
        },
        Ue(["dunes", "moon", "coast"].indexOf(r.artwork))
      ));
    }));
  };
}
function dt({ value: t, onChange: f, onPreview: n, readOnly: i = !1, enabledIds: o }) {
  const u = e.useRef(null), [c, s] = e.useState(1), [m, r] = e.useState(0), [b, g] = e.useState(null), v = e.useRef(t);
  v.current = t;
  const w = e.useMemo(() => Oe(i, o), [i, o]), y = (l) => {
    g(l), n?.(l);
  }, p = e.useRef(n);
  p.current = n;
  const $ = e.useCallback(() => {
    g(null), p.current?.(null), r((l) => l + 1);
  }, []);
  e.useEffect(() => {
    const l = new ResizeObserver(() => {
      u.current && s(Math.min(1, u.current.clientWidth / 640));
    });
    return l.observe(u.current), () => l.disconnect();
  }, []), e.useEffect(() => {
    $();
    const l = (M) => {
      M.key === "Escape" && $();
    };
    return document.addEventListener("keydown", l), window.addEventListener("blur", $), () => {
      document.removeEventListener("keydown", l), window.removeEventListener("blur", $);
    };
  }, [t, i, $]);
  function E(l) {
    if (y(null), i || v.current !== t) return;
    const M = l.hung.find((W) => !t.hung.includes(W));
    M && (!o || o.includes(M)) && fe(t, M) && f(ne(t, M));
  }
  const z = b ?? t, L = z.panels.find((l) => z.hung.includes(l.id) && !t.hung.includes(l.id)), d = t.panels.filter((l) => !t.hung.includes(l.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: u, onPointerCancel: $, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: c, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    Z,
    {
      key: m,
      draggable: w,
      width: 640,
      height: 300,
      state: t,
      onDragState: y,
      onDropState: E
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, z.panels.map((l, M) => /* @__PURE__ */ e.createElement("svg", { key: l.id, x: M * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: z.hung.includes(l.id) ? "#343b66" : "#c7b8a8" }), z.hung.includes(l.id) && /* @__PURE__ */ e.createElement("g", null, l.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: l.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : l.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, L ? L.label + " lines up with its hook." : d.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !i && d.filter((l) => (!o || o.includes(l.id)) && fe(t, l.id)).map((l) => /* @__PURE__ */ e.createElement("button", { key: l.id, type: "button", onFocus: () => y(ne(t, l.id)), onBlur: () => y(null), onClick: () => E(ne(t, l.id)) }, "Hang ", l.label)));
}
const et = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", ce = { start: 99, opener: 361 }, tt = { route: null }, we = "#ffcb62";
function ve(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((f) => /* @__PURE__ */ e.createElement("g", { key: f, transform: "scale(" + f + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (f, n) => {
    const i = 33 - n * 6, o = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${i}q${-o} -2 ${-o - 4} -15q${o} 1 ${o + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${i - 3}q${o - 1} -3 ${o + 2} -15q${-o} 3 ${-o - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (f, n) => {
    const i = (n - 5.5) * 6, o = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${i * 0.35} 6 ${i} ${o}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((u) => /* @__PURE__ */ e.createElement("path", { key: u, d: `M${i * u / 5} ${35 + (o - 35) * u / 5}q${i * 0.15 - 5} -4 ${i * 0.25 - 7} -13m${7 - i * 0.25} 13q6 -6 7 -13` })));
  }));
}
function We({ state: t, d: f, isTracking: n }, i = !1) {
  const o = t.route ? ce[t.route] : 232, u = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(o, u) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [ce.start, ce.opener].map((c, s) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(c) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${c} 85 ${c} 48V0`, fill: "none", stroke: t.route === "start" && s === 0 || t.route === "opener" && s === 1 ? we : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: s ? "opener-jack" : "first-jack", cx: c, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: c, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, s ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(o, u), dragologyOnDrag: i ? void 0 : () => f.closest([tt, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: we, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function nt(t) {
  return We(t, !0);
}
function ft({ value: t, onChange: f, readOnly: n = !1 }) {
  const i = n || !f, [o, u] = I(null), [c, s] = I(0), [m, r] = I(1), [b, g] = I(""), [v, w] = I(null), [y, p] = I(1), $ = R(null), E = R(null), z = R([]), L = Fe(), d = $e(() => ({ route: t.route }), [t.route]), l = (!i && o ? o : d).route;
  _(() => {
    const k = $.current, F = new ResizeObserver(() => p(Math.min(1, k.clientWidth / 460)));
    return F.observe(k), () => F.disconnect();
  }, []);
  function M(k) {
    i || (u(null), g(""), f?.({ ...t, route: k.route }));
  }
  function W(k) {
    r(k), w(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), E.current?.showModal();
  }
  function h() {
    const k = t.route === "start" ? 0 : m;
    z.current[k]?.focus({ preventScroll: !0 });
    const F = t[G[k]];
    g(k === m ? "Focus returned to " + F + ", the print you opened." : "Focus jumped to " + F + ". You opened " + t[G[m]] + ".");
  }
  function S() {
    s((k) => k + 1), u(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": i || void 0,
      onPointerCancel: S,
      onKeyDown: (k) => {
        k.key === "Escape" && !E.current?.open && S();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, et),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, i ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, G.map((k, F) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: k,
        ref: (P) => {
          z.current[F] = P;
        },
        "aria-label": "Open " + t[k],
        onClick: () => W(F)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ve(F)),
      /* @__PURE__ */ e.createElement("span", null, t[k])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: $, style: { "--circuit-scale": y } }, /* @__PURE__ */ e.createElement(
      Z,
      {
        key: i ? "locked" : c,
        state: d,
        width: 460,
        height: 108,
        draggable: i ? nt : We,
        onDragState: i ? void 0 : u,
        onDropState: i ? void 0 : M
      }
    )),
    !i && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": l === "start", onClick: () => M({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": l === "opener", onClick: () => M({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, l === "start" ? "Every viewer returns to the first print." : l === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, b || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: E, onClose: h, "aria-labelledby": L, onKeyDown: (k) => {
      k.key === "Escape" && (k.preventDefault(), k.stopPropagation(), k.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ve(m)), /* @__PURE__ */ e.createElement("h2", { id: L }, t[G[m]]), !i && v !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (k) => {
      k.preventDefault(), v.trim() && (f?.({ ...t, [G[m]]: v.trim() }), w(null), E.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: v, onChange: (k) => w(k.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !v.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => w(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => E.current?.close() }, "Close viewer"), !i && v === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => w(t[G[m]]) }, "Rename print"))
  );
}
function Me(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((f) => f.trim()) ?? [t];
}
function me({ state: t, d: f, draggedId: n, isTracking: i }, o, u, c = !1, s = !1, m = "", r = !1) {
  const b = u?.layout ?? de, { width: g, row: v, height: w, top: y } = b, { points: p, height: $ } = ue(t, b), E = !!t.lanes[0].station, z = (d) => {
    const l = t.lanes.findIndex((W) => W.id === d.laneId), M = t.cards.filter((W) => W.laneId === d.laneId).indexOf(d);
    return D((E ? 18 : 8) + p[l].x, p[l].y + y + M * v);
  };
  if (i && n) {
    const d = t.cards.find((l) => "choice-" + l.id === n);
    if (d) return /* @__PURE__ */ e.createElement("g", { id: n, transform: z(d) });
  }
  const L = !E && !t.kind;
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, L && n && t.lanes.map((d, l) => /* @__PURE__ */ e.createElement(
    "rect",
    {
      id: "drop-" + d.id,
      x: p[l].x,
      y: 0,
      width: b.pitch,
      height: $,
      fill: "none",
      pointerEvents: "none",
      "aria-hidden": "true"
    }
  )), t.lanes.flatMap((d, l) => (d.station?.next ?? []).map((M) => {
    const W = p[l], h = p[t.lanes.findIndex((A) => A.id === M)], S = g / 2 + 8, k = (y - 12) / 2 + 4, F = h.x - W.x, P = h.y - W.y, q = Math.min(F ? g / 2 / Math.abs(F) : 1 / 0, P ? (k - 4) / Math.abs(P) : 1 / 0), J = h.x + S - F * q, U = h.y + k - P * q;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: d.id + "-" + M }, /* @__PURE__ */ e.createElement("line", { x1: W.x + S, y1: W.y + k, x2: J, y2: U, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${J} ${U}) rotate(${Math.atan2(P, F) * 180 / Math.PI})` }));
  })), t.lanes.map((d, l) => {
    const M = t.cards.filter((S) => S.laneId === d.id).length, W = t.kind === "release-plan" && Le(t, d.id), h = t.kind === "release-plan" ? W + (d.capacity ? " / " + d.capacity : "") + " points" : d.station ? M ? "● Occupied" : "Open stop" : d.capacity ? `${M} of ${d.capacity} slots` : `${M} ${M === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + d.id, transform: D(8 + p[l].x, 4 + p[l].y) }, E && !r && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: g, height: y + Math.max(1, M) * v - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...c && !o ? {
      ...E ? { "data-workshop-station": d.id } : { "data-workshop-lane": d.id },
      role: "button",
      tabIndex: 0,
      "aria-labelledby": m + "-edit-" + d.id,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: g, height: y - 12, rx: r ? 12 : E ? 6 : 9, stroke: r ? "#a0b9a6" : void 0, fill: r ? "#f4f8ef" : E ? "#253c36" : He[l] }), (u?.labels.get("heading-" + d.id) ?? Me(d.label)).map((S, k) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + k, fill: r ? "#244b3d" : E ? "#fffdf3" : "#18302d", transform: D(12, (E ? 23 : 16) + k * 16), fontSize: r ? 15 : E ? 17 : 13, fontWeight: "bold" }, S)), !r && /* @__PURE__ */ e.createElement("text", { fill: E ? "#ebd29a" : "#18302d", transform: D(12, y - 23), fontSize: 12 }, h)), s && M < (d.capacity ?? 1 / 0) && /* @__PURE__ */ e.createElement(
      "g",
      {
        "data-workshop-add-card": d.id,
        transform: D(0, y + M * v - 4),
        role: "button",
        tabIndex: 0,
        "aria-labelledby": m + "-add-" + d.id,
        cursor: "pointer"
      },
      /* @__PURE__ */ e.createElement("rect", { width: g, height: 40, rx: 7, fill: "#fbfcf9", stroke: "#64796c", strokeDasharray: "4 3" }),
      /* @__PURE__ */ e.createElement("text", { transform: D(12, 25), fontSize: 14 }, "+ Add card")
    ));
  }), t.cards.map((d) => {
    const l = o ? [] : oe(t, d), M = "choice-" + d.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: M,
        "data-workshop-card": d.id,
        transform: z(d),
        dragologyZIndex: n === M ? "/1" : !1,
        dragologyOnDrag: l.length > 1 ? () => {
          const W = l.map((S) => ae(t, d.id, S.id));
          if (!L) return f.closest(W).withFloating();
          const h = l.map((S, k) => f.dropTarget("drop-" + S.id, W[k], { boundsState: t }));
          return f.closest(h).whenFar(t).withFloating();
        } : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: E ? g - 20 : g, height: w - (E ? 6 : 0), fill: E ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: r ? 12 : E ? 1 : 8 }),
      E && !r && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: D(12, w - 10), fill: "#466358", fontSize: 12 }, d.points, " pts"),
      (u?.labels.get(M) ?? Me(d.label)).map((W, h) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + h, transform: D(12, (r ? 21 : 17) + h * 16), fontSize: 14 }, W))
    );
  }));
}
const rt = (t) => me(t, !1), ot = (t) => me(t, !0);
function ut({ value: t, onChange: f, onPreview: n, onEditCard: i, onEditStation: o, onEditLane: u, onAddCard: c, onUndo: s, canUndo: m, readOnly: r = !1, fitLanes: b = !1, mapCanvas: g = !1, showPlacementOutcomes: v = !0 }) {
  const w = e.useRef(null), y = e.useId(), p = e.useRef(null), $ = e.useRef(null), [E, z] = e.useState(0), L = g && !!t.lanes[0].station, d = L || b && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const a = w.current;
    if (!d || !a) return;
    const x = () => z(a.clientWidth);
    x();
    const C = new ResizeObserver(x);
    return C.observe(a), () => C.disconnect();
  }, [d]);
  const l = e.useMemo(() => d && E ? Ye(t, E, L) : void 0, [d, E, t, L]), { width: M, height: W } = ue(t, l?.layout), h = t.kind === "release-plan", S = !!t.signals?.length, [k, F] = e.useState(0), P = e.useRef(!1), q = e.useRef(null), [J, U] = e.useState(null), [A, Q] = e.useState(null), [le, pe] = e.useState(null), B = !r && A?.source === t ? A : null, he = e.useRef(t), T = e.useCallback((a) => {
    (h || S) && U(a), n?.(a);
  }, [h, S, n]), H = e.useCallback(() => {
    P.current = !1, q.current = null, Q(null), T(null), F((a) => a + 1);
  }, [T]);
  e.useLayoutEffect(() => {
    he.current !== t && (P.current || A) && H(), he.current = t;
  }, [t, A, H]);
  const j = (a, x) => {
    P.current = !1, Q(null), T(null), a !== t && (h && !s && pe({ before: t, after: a }), f(a, x));
  }, ze = (a) => {
    const x = a.cards.find((C) => C.id === q.current);
    j(a, x && { cardId: x.id, laneId: x.laneId });
  }, Ce = e.useCallback((a) => {
    const x = a.type === "dragging" ? a : a.pendingDrag?.status;
    P.current = !!x, x ? (q.current = x.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, Q(null)) : q.current !== null && (q.current = null, T(null));
  }, [T]);
  e.useEffect(() => {
    function a(x) {
      !P.current && !A || x instanceof KeyboardEvent && x.key !== "Escape" || H();
    }
    return document.addEventListener("keydown", a), document.addEventListener("pointercancel", a), window.addEventListener("blur", a), () => {
      document.removeEventListener("keydown", a), document.removeEventListener("pointercancel", a), window.removeEventListener("blur", a);
    };
  }, [H, A]);
  const O = r ? null : B?.next ?? J, N = !!(r || B), ge = !!t.lanes[0].station, V = !N && (ge ? !!o : !h && !!u), X = !N && !ge && !h && !!c && t.cards.length < qe, De = e.useMemo(() => l || V || X || L ? (a) => me(a, N, l, V, X, y, L) : N ? ot : rt, [l, N, V, X, y, L]), ie = "[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]";
  function se(a) {
    N || (a.dataset.workshopStation ? o?.(a.dataset.workshopStation) : a.dataset.workshopLane ? u?.(a.dataset.workshopLane, a) : a.dataset.workshopAddCard && c?.(a.dataset.workshopAddCard, a));
  }
  const Ie = O ? Math.max(W, ue(O, l?.layout).height) : W;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, (V || X) && /* @__PURE__ */ e.createElement("div", { hidden: !0 }, t.lanes.map((a) => /* @__PURE__ */ e.createElement(e.Fragment, { key: a.id }, V && /* @__PURE__ */ e.createElement("span", { id: y + "-edit-" + a.id }, "Edit ", a.label), X && /* @__PURE__ */ e.createElement("span", { id: y + "-add-" + a.id }, "Add card to ", a.label)))), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: w,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (a) => {
        const x = a.target.closest(ie);
        !x || !["Enter", " "].includes(a.key) || (a.preventDefault(), a.repeat || se(x));
      },
      onClickCapture: (a) => {
        const x = a.target.closest(ie);
        x && a.detail === 0 && se(x);
      },
      onPointerDownCapture: (a) => {
        if (p.current = null, N || !a.isPrimary || a.button !== 0) return;
        const x = a.target.closest(ie + ",[data-workshop-card]");
        x && (p.current = { target: x, x: a.clientX, y: a.clientY });
      },
      onPointerMoveCapture: (a) => {
        p.current && Math.hypot(a.clientX - p.current.x, a.clientY - p.current.y) > 5 && (p.current = null, $.current = null);
      },
      onPointerCancelCapture: () => {
        p.current = null, $.current = null;
      },
      onPointerUpCapture: (a) => {
        const x = p.current;
        if (p.current = null, !x || N) return;
        const C = x.target.dataset.workshopCard;
        if (!C) {
          $.current = null, se(x.target);
          return;
        }
        i && ($.current?.id === C && a.timeStamp - $.current.at < 400 ? ($.current = null, i(C)) : $.current = { id: C, at: a.timeStamp });
      }
    },
    /* @__PURE__ */ e.createElement(
      Z,
      {
        key: r ? "read-only" : k,
        draggable: De,
        state: B?.next ?? t,
        onDropState: r ? void 0 : ze,
        onDragState: r ? void 0 : T,
        onDragStatus: Ce,
        width: M,
        height: Ie
      }
    )
  ), S && v && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Ae(O ?? t).map((a) => /* @__PURE__ */ e.createElement("p", { key: a.id }, /* @__PURE__ */ e.createElement("strong", null, a.label), /* @__PURE__ */ e.createElement("br", null), a.text))), h && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(_e, { value: t, preview: O }), !r && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    Ze,
    {
      value: t,
      preview: B?.move ?? null,
      stage: (a, x) => {
        Q({ source: t, next: a, move: x }), n?.(a);
      },
      cancel: H,
      apply: () => {
        B && (j(B.next, B.move), T(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(s ? m : le?.after === t), onClick: () => {
    H(), s ? s() : le?.after === t && (pe(null), f(le.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((a) => {
    const x = t.lanes.find((C) => C.id === a.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: a.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, a.label, " · ", x.label), /* @__PURE__ */ e.createElement("br", null), x.station.outcome), x.station.image && /* @__PURE__ */ e.createElement(
      "img",
      {
        src: x.station.image.src,
        alt: x.station.image.alt,
        referrerPolicy: "no-referrer",
        style: { display: "block", maxWidth: "100%", width: 360, maxHeight: 240, objectFit: "contain", objectPosition: "left", marginBlock: "8px" }
      }
    ), oe(t, a).filter((C) => C.id !== a.laneId).map((C) => /* @__PURE__ */ e.createElement("button", { key: C.id, type: "button", disabled: r, onClick: () => j(ae(t, a.id, C.id), { cardId: a.id, laneId: C.id }) }, a.label, " → ", C.label)));
  })), !h && !L && t.cards.length > 0 && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((a) => /* @__PURE__ */ e.createElement("label", { key: a.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, a.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: r,
      "aria-label": "Move " + a.label,
      value: B?.move.cardId === a.id ? B.move.laneId : a.laneId,
      onChange: (x) => {
        const C = { cardId: a.id, laneId: x.currentTarget.value }, ee = ae(t, a.id, C.laneId);
        S ? ee === t ? H() : (Q({ source: t, next: ee, move: C }), n?.(ee)) : j(ee, C);
      }
    },
    oe(t, a).map((x) => /* @__PURE__ */ e.createElement("option", { key: x.id, value: x.id }, x.label))
  ))), B && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => j(B.next, B.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: H }, "Cancel move"))));
}
export {
  ft as FocusDarkroomBoard,
  ct as ListeningRoomBoard,
  dt as MoonGalleryBoard,
  st as OfflineHandoffBoard,
  _e as ReleasePlanReadout,
  ut as WorkshopBoard,
  ht as addWorkshopBranch,
  gt as addWorkshopCard,
  bt as addWorkshopLane,
  oe as availableLanes,
  fe as canHangPanel,
  Et as createLaneWorkshop,
  yt as createWorkshopMap,
  kt as decodeWorkshopFragment,
  xt as describeFocusDarkroom,
  wt as encodeWorkshopFragment,
  be as handoffSummary,
  ne as hangGalleryPanel,
  vt as industrialWorkshop,
  Mt as initialFocusDarkroom,
  He as laneColors,
  ye as listeningRoom,
  ke as listeningRoomCaption,
  qe as maxWorkshopCards,
  $t as moonGallery,
  ae as moveWorkshopCard,
  Lt as nightTransfer,
  St as normalizeFocusDarkroom,
  Wt as normalizeListeningRoom,
  zt as normalizeMoonGallery,
  Ct as normalizeOfflineHandoff,
  Re as offlineHandoff,
  G as printFields,
  Le as releaseLoad,
  Dt as releasePlan,
  Ee as resolveHandoff,
  Ae as resolveWorkshopSignals,
  te as reviewHandoff,
  It as validateWorkshop,
  de as workshopLayout,
  ue as workshopPositions,
  Ft as workshopPresentationLanes,
  Pt as workshopPresentationScenes,
  Bt as workshopToSlate
};
