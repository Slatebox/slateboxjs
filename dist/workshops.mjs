import e, { useState as F, useRef as R, useMemo as ge, useLayoutEffect as J, useEffect as X, useId as Me } from "react";
import { DraggableRenderer as Y, translate as I, param as $e, inOrder as Le } from "./dragology.mjs";
import { handoffSummary as se, reviewHandoff as _, resolveHandoff as ce, offlineHandoff as Ce, listeningRoom as de, listeningRoomCaption as fe, workshopLayout as ne, releaseLoad as be, availableLanes as U, moveWorkshopCard as O, canHangPanel as re, hangGalleryPanel as Z, printFields as G, workshopPositions as oe, resolveWorkshopSignals as Se, laneColors as ze } from "./workshop-model.mjs";
import { addWorkshopBranch as at, createWorkshopMap as lt, decodeWorkshopFragment as it, describeFocusDarkroom as st, encodeWorkshopFragment as ct, industrialWorkshop as dt, initialFocusDarkroom as ft, moonGallery as ut, nightTransfer as mt, normalizeFocusDarkroom as pt, normalizeListeningRoom as ht, normalizeMoonGallery as gt, normalizeOfflineHandoff as bt, releasePlan as Et, validateWorkshop as yt, workshopPresentationLanes as kt, workshopPresentationScenes as xt, workshopToSlate as wt } from "./workshop-model.mjs";
function We(t, m, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${m}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + o, d: `M59 ${o}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function De(t, m) {
  const n = t ? 9 : 49, o = t ? 20 : 23, r = t ? 144 : 181, f = t ? 183 : 370, c = t ? 35 : 40, a = t ? 164 : 255, u = t ? 119 : 147, l = 45, g = (p, b, h, w, i = "#243c32", E = "normal", x = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: I(p, b), fill: i, fontSize: w, fontFamily: x, fontWeight: E }, h);
  return ({ state: p, d: b, draggedId: h }) => {
    const w = p.stage === "queued", i = p.stage === "resolved", E = f + (a - u) / 2, x = c + 138, $ = w ? n + (r - u) / 2 : E, L = w ? o + 141 : x, M = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + r - 2} ${o + 180} C${n + r + 45} ${o + 235},${f - 24} ${c + 204},${f + 22} ${c + 159}`, fill: "none", stroke: w ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: w ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: I(n, o) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: r, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: r, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: r - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), g(13, 27, "17:08", 9, M, "bold"), g(r - 50, 27, w ? "Offline" : "Online", 10, w ? "#835420" : "#266451", "bold"), g(13, 47, "Field log", t ? 18 : 20, M, "bold"), We(13, 55, (r - 26) / 142), g(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, M), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: I(f, c) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${a - 5} -3 5 190 -${a - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${a - 1} -3 3 183 -${a - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((d) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + d, cx: "8", cy: d, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), g(23, 38, w ? "SHIFT HANDOFF" : i ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), g(22, 69, "Gate B", t ? 30 : 37, M, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${a - 42}`, stroke: "#bfc5b1" }), g(23, 101, (i && p.choice === "field" ? p.fieldNote : p.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, M, "bold"), g(23, 120, i && p.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: I((a - u) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: u, height: l, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), g(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: I($, L),
        dragologyZIndex: h === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !m && w ? () => b.closest([p, _(p)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${u - 2}v${l - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${u}v${l - 7}l-7 7H0z`, fill: i ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${u - 7} ${l}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((d) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + d, cx: "8", cy: d, r: "1.3", fill: "#84662e" })),
      g(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      g(17, 34, i ? "Reviewed" : p.fieldNote === Ce.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const Ie = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function Ue({ value: t, onChange: m, readOnly: n = !1 }) {
  const [o, r] = F(null), [f, c] = F(null), [a, u] = F(0), [l, g] = F(!1), [p, b] = F(1), h = R(null), w = R(!1), i = R(t), E = ge(() => De(l, n), [l, n]), x = n ? t : f ?? o ?? t, $ = t.stage === "queued" && x.stage === "review";
  function L() {
    w.current = !1, c(null), r(null), u((d) => d + 1);
  }
  function M(d) {
    L(), !n && d.stage !== t.stage && m?.(d);
  }
  return J(() => {
    (w.current || f) && (n || i.current !== t) && L(), i.current = t;
  }, [t, n, f]), J(() => {
    const d = () => {
      const S = h.current.clientWidth;
      g(S < 510), b(Math.min(1, S / (S < 510 ? 360 : 685)));
    };
    d();
    const C = new ResizeObserver(d);
    return C.observe(h.current), () => C.disconnect();
  }, []), X(() => {
    function d(C) {
      (w.current || f) && (!(C instanceof KeyboardEvent) || C.key === "Escape") && L();
    }
    return document.addEventListener("keydown", d), document.addEventListener("pointercancel", d), window.addEventListener("blur", d), () => {
      document.removeEventListener("keydown", d), document.removeEventListener("pointercancel", d), window.removeEventListener("blur", d);
    };
  }, [f]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, Ie), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: h, style: { "--drawing-scale": p } }, /* @__PURE__ */ e.createElement(
    Y,
    {
      key: n ? "read-only" : a,
      state: f ?? t,
      draggable: E,
      width: l ? 360 : 685,
      height: l ? 254 : 262,
      onDragState: n ? void 0 : (d) => {
        w.current = !0, r(d.stage !== t.stage && t.stage === "queued" ? d : null);
      },
      onDropState: n ? void 0 : M
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (x.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", x.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, se(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, $ ? "The two access reports disagree." : se(t)), !n && (t.stage === "queued" ? $ ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(_(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: L }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => c(_(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(ce(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => M(ce(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(_(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => M({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function Fe() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const m = new t(), n = m.sampleRate, o = n * 4, r = m.createBuffer(1, o, n), f = m.createBuffer(1, o, n), c = r.getChannelData(0), a = f.getChannelData(0);
  let u = 419;
  function l() {
    return u = 1664525 * u + 1013904223 >>> 0, u / 4294967296;
  }
  for (let p = 0; p < 100; p++) {
    const b = Math.floor(l() * o), h = 380 + l() * 1500, w = 0.09 + l() * 0.08;
    for (let i = 0; i < n * 0.12; i++) {
      const E = i / n, x = Math.sin(2 * Math.PI * h * E) + 0.22 * (l() * 2 - 1);
      c[(b + i) % o] += w * Math.exp(-E * 76) * x;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((p, b) => {
    const h = Math.floor((b * 0.93 + 0.1) * n);
    for (let w = 0; w < n * 1.6; w++) {
      const i = w / n, E = Math.sin(i * p * 2 * Math.PI) + 0.23 * Math.sin(i * p * 5.42 * Math.PI);
      a[(h + w) % o] += 0.16 * Math.min(1, i * 250) * Math.exp(-i * 3.3) * E;
    }
  });
  const g = [r, f].map((p) => {
    const b = m.createBufferSource(), h = m.createGain();
    return h.gain.value = 0, b.buffer = p, b.loop = !0, b.connect(h).connect(m.destination), b.start(), h;
  });
  return {
    ctx: m,
    mix(p) {
      g[0].gain.setTargetAtTime(Math.cos(p * Math.PI / 2), m.currentTime, 0.035), g[1].gain.setTargetAtTime(Math.sin(p * Math.PI / 2), m.currentTime, 0.035);
    },
    stop() {
      m.close();
    }
  };
}
function Ee({ state: t, d: m, isTracking: n }, o) {
  const r = t.mix, f = 106 + 420 * r, c = I(f, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (a, u) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + u, cx: 18 + u * 137 % 604, cy: 12 + u * 47 % 103, r: u % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - r * 0.45 }, Array.from({ length: 30 }, (a, u) => {
    const l = 29 + u * 31 % 184, g = 24 + u * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + u, d: `M${l} ${g}l-3 8`, stroke: u % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: u % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + a, d: `M${39 + a * 15} ${116 + a * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + a, d: `M${65 + a * 35} ${177 - a * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + r * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((a) => {
    const u = 407 + a * 32, l = 63 - a % 3 * 4, g = 52 + (a + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + a, transform: I(u, l) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${g}l-8 5-8-6z`, fill: a % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${g + 7}l7-5V13z`, fill: a % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${g - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: r })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c, dragologyOnDrag: o ? void 0 : () => m.vary(t, $e("mix"), { constraint: (a) => Le([0, a.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + r * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const Pe = (t) => Ee(t, !1), Re = (t) => Ee(t, !0), Ae = `
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
function Oe({ value: t, onChange: m, readOnly: n = !1 }) {
  const o = R(null), r = R(null), [f, c] = F(null), [a, u] = F(0), [l, g] = F(1), [p, b] = F(!1), [h, w] = F(!1), i = f ?? t, E = R(t), x = R(!1);
  function $() {
    x.current = !1, c(null), u((y) => y + 1);
  }
  J(() => {
    x.current && (n || t !== E.current) && $(), E.current = t;
  }, [t, n]), J(() => {
    const y = o.current, W = () => g(Math.min(1, y.clientWidth / 640));
    W();
    const v = new ResizeObserver(W);
    return v.observe(y), () => v.disconnect();
  }, []), X(() => {
    function y(W) {
      x.current && (!(W instanceof KeyboardEvent) || W.key === "Escape") && $();
    }
    return document.addEventListener("keydown", y), document.addEventListener("pointercancel", y), window.addEventListener("blur", y), () => {
      document.removeEventListener("keydown", y), document.removeEventListener("pointercancel", y), window.removeEventListener("blur", y);
    };
  }, []);
  function L(y) {
    x.current = !1, c(null), !n && y !== t.mix && m?.({ ...t, mix: y });
  }
  function M() {
    r.current?.stop(), r.current = null, b(!1);
  }
  X(() => {
    r.current?.mix(i.mix);
  }, [i.mix]), X(() => {
    const y = new IntersectionObserver(([v]) => {
      v.isIntersecting || M();
    });
    y.observe(o.current);
    const W = () => {
      document.hidden && M();
    };
    return document.addEventListener("visibilitychange", W), () => {
      y.disconnect(), document.removeEventListener("visibilitychange", W), r.current?.stop(), r.current = null;
    };
  }, []);
  async function d() {
    if (r.current) {
      M();
      return;
    }
    try {
      const y = Fe();
      r.current = y, y.mix(i.mix), await y.ctx.resume(), r.current === y && b(!0);
    } catch {
      M(), w(!0);
    }
  }
  const C = t.leftLabel === de.leftLabel ? "rain" : t.leftLabel, S = t.rightLabel === de.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, Ae), /* @__PURE__ */ e.createElement(
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
      "aria-valuenow": Math.round(i.mix * 100),
      "aria-valuetext": fe(i),
      onKeyDown: (y) => {
        if (n) return;
        const W = {
          ArrowLeft: i.mix - 0.01,
          ArrowRight: i.mix + 0.01,
          ArrowDown: i.mix - 0.01,
          ArrowUp: i.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(W, y.key) && (y.preventDefault(), L(Math.round(100 * Math.min(1, Math.max(0, W[y.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      Y,
      {
        key: n ? "read-only" : a,
        state: t,
        draggable: n ? Re : Pe,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (y) => {
          x.current = y !== null, c(y);
        },
        onDropState: n ? void 0 : (y) => L(y.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0) }, "Listen to ", C), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(1) }, "Listen to ", S)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, fe(i))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: d, "aria-pressed": p, disabled: h }, h ? "Audio unavailable" : p ? "Mute sound" : "Enable sound")));
}
function qe(t, m, n) {
  const o = [];
  let r = "";
  for (const f of t.split(/\s+/u)) {
    const c = r ? r + " " + f : f;
    if (n.measureText(c).width <= m) {
      r = c;
      continue;
    }
    r && o.push(r), r = "";
    for (const a of f)
      r && n.measureText(r + a).width > m && (o.push(r), r = ""), r += a;
  }
  return r && o.push(r), o;
}
function Ne(t, m) {
  const n = Math.min(ne.pitch, Math.max(124, Math.floor(m / t.lanes.length))), o = n - 16, r = document.createElement("canvas").getContext("2d"), f = /* @__PURE__ */ new Map();
  function c(g, p, b) {
    r.font = b;
    let h = 1;
    for (const w of g) {
      const i = qe(w.label, o - 25, r);
      f.set(p + w.id, i), h = Math.max(h, i.length);
    }
    return h;
  }
  const a = c(t.lanes, "heading-", "bold 13px system-ui, sans-serif"), u = c(t.cards, "choice-", "14px system-ui, sans-serif"), l = Math.max(ne.height, 16 * u + 14);
  return { labels: f, layout: { pitch: n, width: o, height: l, row: l + 12, top: 16 * a + 45 } };
}
function Be({ value: t, preview: m }) {
  const n = m ?? t, o = new Map(n.lanes.map((c) => [c.id, c.label])), r = new Map(n.cards.map((c) => [c.id, c])), f = n.cards.flatMap((c) => (c.dependsOn ?? []).map((a) => ({ feature: c, prerequisite: r.get(a) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((c) => c.capacity !== void 0).map((c) => {
    const a = be(n, c.id);
    return /* @__PURE__ */ e.createElement("div", { key: c.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, c.label), /* @__PURE__ */ e.createElement("output", { "aria-label": c.label + " capacity" }, a, " / ", c.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": c.label + " point budget", min: 0, max: c.capacity, value: a, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), f.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, f.map(({ feature: c, prerequisite: a }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([c.id, a.id]) }, /* @__PURE__ */ e.createElement("strong", null, c.label), " needs ", a.label, " · ", o.get(a.laneId))))), m && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((c) => t.cards.find((a) => a.id === c.id)?.laneId !== c.laneId).map((c) => c.label + " → " + o.get(c.laneId)).join(" · ")));
}
function He({ value: t, preview: m, stage: n, apply: o, cancel: r }) {
  const [f, c] = F(t.cards[0].id), a = t.cards.find((l) => l.id === f) ?? t.cards[0], u = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (l) => {
    l.key === "Escape" && (r(), l.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: u }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: u, value: a.id, onChange: (l) => {
    c(l.target.value), r();
  } }, t.cards.map((l) => /* @__PURE__ */ e.createElement("option", { key: l.id, value: l.id }, l.label))), /* @__PURE__ */ e.createElement("div", null, U(t, a).filter((l) => l.id !== a.laneId).map((l) => /* @__PURE__ */ e.createElement("button", { key: l.id, type: "button", onClick: () => n(O(t, a.id, l.id), { cardId: a.id, laneId: l.id }) }, "Preview ", l.label))), m && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: o }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: r }, "Cancel preview")));
}
const ue = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], Ke = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], q = 148, V = 104;
function Te(t) {
  const m = (n, o, r) => {
    const f = Array.from({ length: 38 }, (c, a) => {
      const u = Math.min(q, 4 * a), l = t * q + u, g = n + o * (Math.sin(l / 46) + 0.39 * Math.cos(l / 19) + 0.09 * Math.sin(l / 7));
      return (a ? "L" : "M") + u + " " + g.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: f + `L${q} ${V}H0z`, fill: r });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: q + 8, height: V + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: q + 4, height: V + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: q, height: V, fill: "#343b66" }), Array.from({ length: 13 }, (n, o) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + o, cx: 6 + (o * 77 + t * 19) % 136, cy: 4 + (o * 29 + t * 11) % 35, r: o % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), m(48, 7, "#9b88aa"), m(59, 10, "#bf9492"), m(75, 7, "#596d83"), m(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + o, d: `M${4 + (o * 37 + t * 13) % 124} ${92 + o * 3 % 10}h${4 + o % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Ge(t, m) {
  return ({ state: n, d: o, draggedId: r, isTracking: f }) => {
    const c = (l) => l === 1 ? "panorama-panel" : "gallery-panel-" + l, a = (l) => (n.hung.includes(n.panels[l].id) ? ue : Ke)[l], u = n.panels.findIndex((l, g) => c(g) === r);
    if (f && u >= 0) {
      const l = a(u);
      return /* @__PURE__ */ e.createElement("g", { id: c(u), transform: I(l.x, l.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + l, d: `M${40 + 83 * l} 225l${(l - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((l) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + l, transform: I(163 + l * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((l, g) => {
      const p = ue[g], b = a(g), h = !t && (!m || m.includes(l.id)) && re(n, l.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: l.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: g === 1 ? "gallery-hook" : "gallery-hook-" + g,
          x: p.x,
          y: p.y,
          width: q,
          height: V,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: p.x + q / 2, cy: p.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: c(g),
          transform: I(b.x, b.y),
          dragologyZIndex: r === c(g) ? "/1" : !1,
          dragologyOnDrag: h ? () => o.between([n, Z(n, l.id)]) : void 0
        },
        Te(["dunes", "moon", "coast"].indexOf(l.artwork))
      ));
    }));
  };
}
function et({ value: t, onChange: m, onPreview: n, readOnly: o = !1, enabledIds: r }) {
  const f = e.useRef(null), [c, a] = e.useState(1), [u, l] = e.useState(0), [g, p] = e.useState(null), b = e.useRef(t);
  b.current = t;
  const h = e.useMemo(() => Ge(o, r), [o, r]), w = (d) => {
    p(d), n?.(d);
  }, i = e.useRef(n);
  i.current = n;
  const E = e.useCallback(() => {
    p(null), i.current?.(null), l((d) => d + 1);
  }, []);
  e.useEffect(() => {
    const d = new ResizeObserver(() => {
      f.current && a(Math.min(1, f.current.clientWidth / 640));
    });
    return d.observe(f.current), () => d.disconnect();
  }, []), e.useEffect(() => {
    E();
    const d = (C) => {
      C.key === "Escape" && E();
    };
    return document.addEventListener("keydown", d), window.addEventListener("blur", E), () => {
      document.removeEventListener("keydown", d), window.removeEventListener("blur", E);
    };
  }, [t, o, E]);
  function x(d) {
    if (w(null), o || b.current !== t) return;
    const C = d.hung.find((S) => !t.hung.includes(S));
    C && (!r || r.includes(C)) && re(t, C) && m(Z(t, C));
  }
  const $ = g ?? t, L = $.panels.find((d) => $.hung.includes(d.id) && !t.hung.includes(d.id)), M = t.panels.filter((d) => !t.hung.includes(d.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: f, onPointerCancel: E, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: c, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    Y,
    {
      key: u,
      draggable: h,
      width: 640,
      height: 300,
      state: t,
      onDragState: w,
      onDropState: x
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, $.panels.map((d, C) => /* @__PURE__ */ e.createElement("svg", { key: d.id, x: C * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: $.hung.includes(d.id) ? "#343b66" : "#c7b8a8" }), $.hung.includes(d.id) && /* @__PURE__ */ e.createElement("g", null, d.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: d.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : d.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, L ? L.label + " lines up with its hook." : M.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !o && M.filter((d) => (!r || r.includes(d.id)) && re(t, d.id)).map((d) => /* @__PURE__ */ e.createElement("button", { key: d.id, type: "button", onFocus: () => w(Z(t, d.id)), onBlur: () => w(null), onClick: () => x(Z(t, d.id)) }, "Hang ", d.label)));
}
const Qe = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", te = { start: 99, opener: 361 }, Ve = { route: null }, me = "#ffcb62";
function pe(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((m) => /* @__PURE__ */ e.createElement("g", { key: m, transform: "scale(" + m + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (m, n) => {
    const o = 33 - n * 6, r = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${o}q${-r} -2 ${-r - 4} -15q${r} 1 ${r + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${o - 3}q${r - 1} -3 ${r + 2} -15q${-r} 3 ${-r - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (m, n) => {
    const o = (n - 5.5) * 6, r = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${o * 0.35} 6 ${o} ${r}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((f) => /* @__PURE__ */ e.createElement("path", { key: f, d: `M${o * f / 5} ${35 + (r - 35) * f / 5}q${o * 0.15 - 5} -4 ${o * 0.25 - 7} -13m${7 - o * 0.25} 13q6 -6 7 -13` })));
  }));
}
function ye({ state: t, d: m, isTracking: n }, o = !1) {
  const r = t.route ? te[t.route] : 232, f = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: I(r, f) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [te.start, te.opener].map((c, a) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(c) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${c} 85 ${c} 48V0`, fill: "none", stroke: t.route === "start" && a === 0 || t.route === "opener" && a === 1 ? me : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: a ? "opener-jack" : "first-jack", cx: c, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: c, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, a ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: I(r, f), dragologyOnDrag: o ? void 0 : () => m.closest([Ve, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: me, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Xe(t) {
  return ye(t, !0);
}
function tt({ value: t, onChange: m, readOnly: n = !1 }) {
  const o = n || !m, [r, f] = F(null), [c, a] = F(0), [u, l] = F(1), [g, p] = F(""), [b, h] = F(null), [w, i] = F(1), E = R(null), x = R(null), $ = R([]), L = Me(), M = ge(() => ({ route: t.route }), [t.route]), d = (!o && r ? r : M).route;
  X(() => {
    const v = E.current, D = new ResizeObserver(() => i(Math.min(1, v.clientWidth / 460)));
    return D.observe(v), () => D.disconnect();
  }, []);
  function C(v) {
    o || (f(null), p(""), m?.({ ...t, route: v.route }));
  }
  function S(v) {
    l(v), h(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), x.current?.showModal();
  }
  function y() {
    const v = t.route === "start" ? 0 : u;
    $.current[v]?.focus({ preventScroll: !0 });
    const D = t[G[v]];
    p(v === u ? "Focus returned to " + D + ", the print you opened." : "Focus jumped to " + D + ". You opened " + t[G[u]] + ".");
  }
  function W() {
    a((v) => v + 1), f(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": o || void 0,
      onPointerCancel: W,
      onKeyDown: (v) => {
        v.key === "Escape" && !x.current?.open && W();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, Qe),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, o ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, G.map((v, D) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: v,
        ref: (N) => {
          $.current[D] = N;
        },
        "aria-label": "Open " + t[v],
        onClick: () => S(D)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, pe(D)),
      /* @__PURE__ */ e.createElement("span", null, t[v])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: E, style: { "--circuit-scale": w } }, /* @__PURE__ */ e.createElement(
      Y,
      {
        key: o ? "locked" : c,
        state: M,
        width: 460,
        height: 108,
        draggable: o ? Xe : ye,
        onDragState: o ? void 0 : f,
        onDropState: o ? void 0 : C
      }
    )),
    !o && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": d === "start", onClick: () => C({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": d === "opener", onClick: () => C({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, d === "start" ? "Every viewer returns to the first print." : d === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, g || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: x, onClose: y, "aria-labelledby": L, onKeyDown: (v) => {
      v.key === "Escape" && (v.preventDefault(), v.stopPropagation(), v.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, pe(u)), /* @__PURE__ */ e.createElement("h2", { id: L }, t[G[u]]), !o && b !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (v) => {
      v.preventDefault(), b.trim() && (m?.({ ...t, [G[u]]: b.trim() }), h(null), x.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: b, onChange: (v) => h(v.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !b.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => h(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => x.current?.close() }, "Close viewer"), !o && b === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => h(t[G[u]]) }, "Rename print"))
  );
}
function he(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((m) => m.trim()) ?? [t];
}
function ae({ state: t, d: m, draggedId: n, isTracking: o }, r, f, c = !1) {
  const a = f?.layout ?? ne, { width: u, row: l, height: g, top: p } = a, { points: b } = oe(t, a), h = !!t.lanes[0].station, w = (i) => {
    const E = t.lanes.findIndex(($) => $.id === i.laneId), x = t.cards.filter(($) => $.laneId === i.laneId).indexOf(i);
    return I((h ? 18 : 8) + b[E].x, b[E].y + p + x * l);
  };
  if (o && n) {
    const i = t.cards.find((E) => "choice-" + E.id === n);
    if (i) return /* @__PURE__ */ e.createElement("g", { id: n, transform: w(i) });
  }
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((i, E) => (i.station?.next ?? []).map((x) => {
    const $ = b[E], L = b[t.lanes.findIndex((D) => D.id === x)], M = u / 2 + 8, d = (p - 12) / 2 + 4, C = L.x - $.x, S = L.y - $.y, y = Math.min(C ? u / 2 / Math.abs(C) : 1 / 0, S ? (d - 4) / Math.abs(S) : 1 / 0), W = L.x + M - C * y, v = L.y + d - S * y;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: i.id + "-" + x }, /* @__PURE__ */ e.createElement("line", { x1: $.x + M, y1: $.y + d, x2: W, y2: v, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${W} ${v}) rotate(${Math.atan2(S, C) * 180 / Math.PI})` }));
  })), t.lanes.map((i, E) => {
    const x = t.cards.filter((M) => M.laneId === i.id).length, $ = t.kind === "release-plan" && be(t, i.id), L = t.kind === "release-plan" ? $ + (i.capacity ? " / " + i.capacity : "") + " points" : i.station ? x ? "● Occupied" : "Open stop" : i.capacity ? `${x} of ${i.capacity} slots` : `${x} ${x === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + i.id, transform: I(8 + b[E].x, 4 + b[E].y) }, h && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: u, height: p + Math.max(1, x) * l - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...h && c && !r ? {
      "data-workshop-station": i.id,
      role: "button",
      tabIndex: 0,
      "aria-label": "Edit " + i.label,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: u, height: p - 12, rx: h ? 6 : 9, fill: h ? "#253c36" : ze[E] }), (f?.labels.get("heading-" + i.id) ?? he(i.label)).map((M, d) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + d, fill: h ? "#fffdf3" : "#18302d", transform: I(12, (h ? 23 : 16) + d * 16), fontSize: h ? 17 : 13, fontWeight: "bold" }, M)), /* @__PURE__ */ e.createElement("text", { fill: h ? "#ebd29a" : "#18302d", transform: I(12, p - 23), fontSize: 12 }, L)));
  }), t.cards.map((i) => {
    const E = r ? [] : U(t, i), x = "choice-" + i.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: x,
        "data-workshop-card": i.id,
        transform: w(i),
        dragologyZIndex: n === x ? "/1" : !1,
        dragologyOnDrag: E.length > 1 ? () => m.closest(E.map(($) => O(t, i.id, $.id))).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: h ? u - 20 : u, height: g - (h ? 6 : 0), fill: h ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: h ? 1 : 8 }),
      h && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: I(12, g - 10), fill: "#466358", fontSize: 12 }, i.points, " pts"),
      (f?.labels.get(x) ?? he(i.label)).map(($, L) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + L, transform: I(12, 17 + L * 16), fontSize: 14 }, $))
    );
  }));
}
const Ye = (t) => ae(t, !1), je = (t) => ae(t, !0);
function nt({ value: t, onChange: m, onPreview: n, onEditCard: o, onEditStation: r, onUndo: f, canUndo: c, readOnly: a = !1, fitLanes: u = !1, showPlacementOutcomes: l = !0 }) {
  const g = e.useRef(null), p = e.useRef(null), b = e.useRef(null), [h, w] = e.useState(0), i = u && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const s = g.current;
    if (!i || !s) return;
    const k = () => w(s.clientWidth);
    k();
    const z = new ResizeObserver(k);
    return z.observe(s), () => z.disconnect();
  }, [i]);
  const E = e.useMemo(() => i && h ? Ne(t, h) : void 0, [i, h, t]), { width: x, height: $ } = oe(t, E?.layout), L = t.kind === "release-plan", M = !!t.signals?.length, [d, C] = e.useState(0), S = e.useRef(!1), y = e.useRef(null), [W, v] = e.useState(null), [D, N] = e.useState(null), [ee, le] = e.useState(null), P = !a && D?.source === t ? D : null, ie = e.useRef(t), B = e.useCallback((s) => {
    (L || M) && v(s), n?.(s);
  }, [L, M, n]), A = e.useCallback(() => {
    S.current = !1, y.current = null, N(null), B(null), C((s) => s + 1);
  }, [B]);
  e.useLayoutEffect(() => {
    ie.current !== t && (S.current || D) && A(), ie.current = t;
  }, [t, D, A]);
  const Q = (s, k) => {
    S.current = !1, N(null), B(null), s !== t && (L && !f && le({ before: t, after: s }), m(s, k));
  }, ke = (s) => {
    const k = s.cards.find((z) => z.id === y.current);
    Q(s, k && { cardId: k.id, laneId: k.laneId });
  }, xe = e.useCallback((s) => {
    const k = s.type === "dragging" ? s : s.pendingDrag?.status;
    S.current = !!k, k ? (y.current = k.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, N(null)) : y.current !== null && (y.current = null, B(null));
  }, [B]);
  e.useEffect(() => {
    function s(k) {
      !S.current && !D || k instanceof KeyboardEvent && k.key !== "Escape" || A();
    }
    return document.addEventListener("keydown", s), document.addEventListener("pointercancel", s), window.addEventListener("blur", s), () => {
      document.removeEventListener("keydown", s), document.removeEventListener("pointercancel", s), window.removeEventListener("blur", s);
    };
  }, [A, D]);
  const j = a ? null : P?.next ?? W, K = !!(a || P), T = !!(r && t.lanes[0].station && !K), we = e.useMemo(() => E || T ? (s) => ae(s, K, E, T) : K ? je : Ye, [E, K, T]), ve = j ? Math.max($, oe(j, E?.layout).height) : $;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: g,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (s) => {
        const k = s.target.closest("[data-workshop-station]")?.getAttribute("data-workshop-station");
        !T || !k || !["Enter", " "].includes(s.key) || (s.preventDefault(), s.repeat || r?.(k));
      },
      onClickCapture: (s) => {
        const k = s.target.closest("[data-workshop-station]")?.getAttribute("data-workshop-station");
        T && s.detail === 0 && k && r?.(k);
      },
      onPointerDownCapture: (s) => {
        if (p.current = null, K || !s.isPrimary || s.button !== 0) return;
        const k = s.target.closest("[data-workshop-card],[data-workshop-station]"), z = k?.getAttribute("data-workshop-station"), H = k?.getAttribute("data-workshop-card");
        z && T ? p.current = { kind: "station", id: z, x: s.clientX, y: s.clientY } : H && o && (p.current = { kind: "card", id: H, x: s.clientX, y: s.clientY });
      },
      onPointerMoveCapture: (s) => {
        p.current && Math.hypot(s.clientX - p.current.x, s.clientY - p.current.y) > 5 && (p.current = null, b.current = null);
      },
      onPointerCancelCapture: () => {
        p.current = null, b.current = null;
      },
      onPointerUpCapture: (s) => {
        const k = p.current;
        if (p.current = null, !(!k || K)) {
          if (k.kind === "station") {
            b.current = null, r?.(k.id);
            return;
          }
          o && (b.current?.id === k.id && s.timeStamp - b.current.at < 400 ? (b.current = null, o(k.id)) : b.current = { id: k.id, at: s.timeStamp });
        }
      }
    },
    /* @__PURE__ */ e.createElement(
      Y,
      {
        key: a ? "read-only" : d,
        draggable: we,
        state: P?.next ?? t,
        onDropState: a ? void 0 : ke,
        onDragState: a ? void 0 : B,
        onDragStatus: xe,
        width: x,
        height: ve
      }
    )
  ), M && l && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Se(j ?? t).map((s) => /* @__PURE__ */ e.createElement("p", { key: s.id }, /* @__PURE__ */ e.createElement("strong", null, s.label), /* @__PURE__ */ e.createElement("br", null), s.text))), L && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Be, { value: t, preview: j }), !a && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    He,
    {
      value: t,
      preview: P?.move ?? null,
      stage: (s, k) => {
        N({ source: t, next: s, move: k }), n?.(s);
      },
      cancel: A,
      apply: () => {
        P && (Q(P.next, P.move), B(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(f ? c : ee?.after === t), onClick: () => {
    A(), f ? f() : ee?.after === t && (le(null), m(ee.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((s) => {
    const k = t.lanes.find((z) => z.id === s.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: s.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, s.label, " · ", k.label), /* @__PURE__ */ e.createElement("br", null), k.station.outcome), U(t, s).filter((z) => z.id !== s.laneId).map((z) => /* @__PURE__ */ e.createElement("button", { key: z.id, type: "button", disabled: a, onClick: () => Q(O(t, s.id, z.id), { cardId: s.id, laneId: z.id }) }, s.label, " → ", z.label)));
  })), !L && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((s) => /* @__PURE__ */ e.createElement("label", { key: s.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, s.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: a,
      "aria-label": "Move " + s.label,
      value: P?.move.cardId === s.id ? P.move.laneId : s.laneId,
      onChange: (k) => {
        const z = { cardId: s.id, laneId: k.currentTarget.value }, H = O(t, s.id, z.laneId);
        M ? H === t ? A() : (N({ source: t, next: H, move: z }), n?.(H)) : Q(H, z);
      }
    },
    U(t, s).map((k) => /* @__PURE__ */ e.createElement("option", { key: k.id, value: k.id }, k.label))
  ))), P && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => Q(P.next, P.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: A }, "Cancel move"))));
}
export {
  tt as FocusDarkroomBoard,
  Oe as ListeningRoomBoard,
  et as MoonGalleryBoard,
  Ue as OfflineHandoffBoard,
  Be as ReleasePlanReadout,
  nt as WorkshopBoard,
  at as addWorkshopBranch,
  U as availableLanes,
  re as canHangPanel,
  lt as createWorkshopMap,
  it as decodeWorkshopFragment,
  st as describeFocusDarkroom,
  ct as encodeWorkshopFragment,
  se as handoffSummary,
  Z as hangGalleryPanel,
  dt as industrialWorkshop,
  ft as initialFocusDarkroom,
  ze as laneColors,
  de as listeningRoom,
  fe as listeningRoomCaption,
  ut as moonGallery,
  O as moveWorkshopCard,
  mt as nightTransfer,
  pt as normalizeFocusDarkroom,
  ht as normalizeListeningRoom,
  gt as normalizeMoonGallery,
  bt as normalizeOfflineHandoff,
  Ce as offlineHandoff,
  G as printFields,
  be as releaseLoad,
  Et as releasePlan,
  ce as resolveHandoff,
  Se as resolveWorkshopSignals,
  _ as reviewHandoff,
  yt as validateWorkshop,
  ne as workshopLayout,
  oe as workshopPositions,
  kt as workshopPresentationLanes,
  xt as workshopPresentationScenes,
  wt as workshopToSlate
};
