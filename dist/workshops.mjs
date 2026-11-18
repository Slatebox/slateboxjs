import e, { useState as W, useRef as q, useMemo as ne, useLayoutEffect as T, useEffect as A, useId as ie } from "react";
import { DraggableRenderer as P, translate as S, param as ce, inOrder as se } from "./dragology.mjs";
import { handoffSummary as Y, reviewHandoff as B, resolveHandoff as _, offlineHandoff as de, listeningRoom as Z, listeningRoomCaption as J, releaseLoad as re, availableLanes as G, moveWorkshopCard as Q, canHangPanel as j, hangGalleryPanel as K, printFields as R, workshopPositions as X, workshopLayout as fe, laneColors as me } from "./workshop-model.mjs";
import { decodeWorkshopFragment as Be, describeFocusDarkroom as Ke, encodeWorkshopFragment as Te, industrialWorkshop as Ge, initialFocusDarkroom as Qe, moonGallery as Ve, nightTransfer as je, normalizeFocusDarkroom as Xe, normalizeListeningRoom as Ye, normalizeMoonGallery as _e, normalizeOfflineHandoff as Ze, releasePlan as Je, validateWorkshop as Ue, workshopToSlate as Oe } from "./workshop-model.mjs";
function ue(t, p, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${p}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + o, d: `M59 ${o}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function pe(t, p) {
  const n = t ? 9 : 49, o = t ? 20 : 23, l = t ? 144 : 181, d = t ? 183 : 370, c = t ? 35 : 40, i = t ? 164 : 255, f = t ? 119 : 147, r = 45, u = (h, s, b, g, m = "#243c32", y = "normal", w = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: S(h, s), fill: m, fontSize: g, fontFamily: w, fontWeight: y }, b);
  return ({ state: h, d: s, draggedId: b }) => {
    const g = h.stage === "queued", m = h.stage === "resolved", y = d + (i - f) / 2, w = c + 138, L = g ? n + (l - f) / 2 : y, v = g ? o + 141 : w, M = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + l - 2} ${o + 180} C${n + l + 45} ${o + 235},${d - 24} ${c + 204},${d + 22} ${c + 159}`, fill: "none", stroke: g ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: g ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: S(n, o) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: l, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: l, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: l - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: l / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), u(13, 27, "17:08", 9, M, "bold"), u(l - 50, 27, g ? "Offline" : "Online", 10, g ? "#835420" : "#266451", "bold"), u(13, 47, "Field log", t ? 18 : 20, M, "bold"), ue(13, 55, (l - 26) / 142), u(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, M), /* @__PURE__ */ e.createElement("rect", { x: l / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: S(d, c) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${i - 5} -3 5 190 -${i - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${i - 1} -3 3 183 -${i - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: i, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((a) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + a, cx: "8", cy: a, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), u(23, 38, g ? "SHIFT HANDOFF" : m ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), u(22, 69, "Gate B", t ? 30 : 37, M, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${i - 42}`, stroke: "#bfc5b1" }), u(23, 101, (m && h.choice === "field" ? h.fieldNote : h.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, M, "bold"), u(23, 120, m && h.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: S((i - f) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: f, height: r, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), u(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: S(L, v),
        dragologyZIndex: b === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !p && g ? () => s.closest([h, B(h)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${f - 2}v${r - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${f}v${r - 7}l-7 7H0z`, fill: m ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${f - 7} ${r}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((a) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + a, cx: "8", cy: a, r: "1.3", fill: "#84662e" })),
      u(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      u(17, 34, m ? "Reviewed" : h.fieldNote === de.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const he = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function Fe({ value: t, onChange: p, readOnly: n = !1 }) {
  const [o, l] = W(null), [d, c] = W(null), [i, f] = W(0), [r, u] = W(!1), [h, s] = W(1), b = q(null), g = q(!1), m = q(t), y = ne(() => pe(r, n), [r, n]), w = n ? t : d ?? o ?? t, L = t.stage === "queued" && w.stage === "review";
  function v() {
    g.current = !1, c(null), l(null), f((a) => a + 1);
  }
  function M(a) {
    v(), !n && a.stage !== t.stage && p?.(a);
  }
  return T(() => {
    (g.current || d) && (n || m.current !== t) && v(), m.current = t;
  }, [t, n, d]), T(() => {
    const a = () => {
      const C = b.current.clientWidth;
      u(C < 510), s(Math.min(1, C / (C < 510 ? 360 : 685)));
    };
    a();
    const $ = new ResizeObserver(a);
    return $.observe(b.current), () => $.disconnect();
  }, []), A(() => {
    function a($) {
      (g.current || d) && (!($ instanceof KeyboardEvent) || $.key === "Escape") && v();
    }
    return document.addEventListener("keydown", a), document.addEventListener("pointercancel", a), window.addEventListener("blur", a), () => {
      document.removeEventListener("keydown", a), document.removeEventListener("pointercancel", a), window.removeEventListener("blur", a);
    };
  }, [d]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, he), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: b, style: { "--drawing-scale": h } }, /* @__PURE__ */ e.createElement(
    P,
    {
      key: n ? "read-only" : i,
      state: d ?? t,
      draggable: y,
      width: r ? 360 : 685,
      height: r ? 254 : 262,
      onDragState: n ? void 0 : (a) => {
        g.current = !0, l(a.stage !== t.stage && t.stage === "queued" ? a : null);
      },
      onDropState: n ? void 0 : M
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (w.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", w.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, Y(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, L ? "The two access reports disagree." : Y(t)), !n && (t.stage === "queued" ? L ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(B(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: v }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => c(B(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(_(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => M(_(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(B(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => M({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function ge() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const p = new t(), n = p.sampleRate, o = n * 4, l = p.createBuffer(1, o, n), d = p.createBuffer(1, o, n), c = l.getChannelData(0), i = d.getChannelData(0);
  let f = 419;
  function r() {
    return f = 1664525 * f + 1013904223 >>> 0, f / 4294967296;
  }
  for (let h = 0; h < 100; h++) {
    const s = Math.floor(r() * o), b = 380 + r() * 1500, g = 0.09 + r() * 0.08;
    for (let m = 0; m < n * 0.12; m++) {
      const y = m / n, w = Math.sin(2 * Math.PI * b * y) + 0.22 * (r() * 2 - 1);
      c[(s + m) % o] += g * Math.exp(-y * 76) * w;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((h, s) => {
    const b = Math.floor((s * 0.93 + 0.1) * n);
    for (let g = 0; g < n * 1.6; g++) {
      const m = g / n, y = Math.sin(m * h * 2 * Math.PI) + 0.23 * Math.sin(m * h * 5.42 * Math.PI);
      i[(b + g) % o] += 0.16 * Math.min(1, m * 250) * Math.exp(-m * 3.3) * y;
    }
  });
  const u = [l, d].map((h) => {
    const s = p.createBufferSource(), b = p.createGain();
    return b.gain.value = 0, s.buffer = h, s.loop = !0, s.connect(b).connect(p.destination), s.start(), b;
  });
  return {
    ctx: p,
    mix(h) {
      u[0].gain.setTargetAtTime(Math.cos(h * Math.PI / 2), p.currentTime, 0.035), u[1].gain.setTargetAtTime(Math.sin(h * Math.PI / 2), p.currentTime, 0.035);
    },
    stop() {
      p.close();
    }
  };
}
function oe({ state: t, d: p, isTracking: n }, o) {
  const l = t.mix, d = 106 + 420 * l, c = S(d, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (i, f) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + f, cx: 18 + f * 137 % 604, cy: 12 + f * 47 % 103, r: f % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - l * 0.45 }, Array.from({ length: 30 }, (i, f) => {
    const r = 29 + f * 31 % 184, u = 24 + f * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + f, d: `M${r} ${u}l-3 8`, stroke: f % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: f % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + i, d: `M${39 + i * 15} ${116 + i * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((i) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + i, d: `M${65 + i * 35} ${177 - i * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + l * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((i) => {
    const f = 407 + i * 32, r = 63 - i % 3 * 4, u = 52 + (i + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + i, transform: S(f, r) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${u}l-8 5-8-6z`, fill: i % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${u + 7}l7-5V13z`, fill: i % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${u - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: l })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c, dragologyOnDrag: o ? void 0 : () => p.vary(t, ce("mix"), { constraint: (i) => se([0, i.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + l * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const be = (t) => oe(t, !1), Ee = (t) => oe(t, !0), ye = `
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
function qe({ value: t, onChange: p, readOnly: n = !1 }) {
  const o = q(null), l = q(null), [d, c] = W(null), [i, f] = W(0), [r, u] = W(1), [h, s] = W(!1), [b, g] = W(!1), m = d ?? t, y = q(t), w = q(!1);
  function L() {
    w.current = !1, c(null), f((k) => k + 1);
  }
  T(() => {
    w.current && (n || t !== y.current) && L(), y.current = t;
  }, [t, n]), T(() => {
    const k = o.current, D = () => u(Math.min(1, k.clientWidth / 640));
    D();
    const x = new ResizeObserver(D);
    return x.observe(k), () => x.disconnect();
  }, []), A(() => {
    function k(D) {
      w.current && (!(D instanceof KeyboardEvent) || D.key === "Escape") && L();
    }
    return document.addEventListener("keydown", k), document.addEventListener("pointercancel", k), window.addEventListener("blur", k), () => {
      document.removeEventListener("keydown", k), document.removeEventListener("pointercancel", k), window.removeEventListener("blur", k);
    };
  }, []);
  function v(k) {
    w.current = !1, c(null), !n && k !== t.mix && p?.({ ...t, mix: k });
  }
  function M() {
    l.current?.stop(), l.current = null, s(!1);
  }
  A(() => {
    l.current?.mix(m.mix);
  }, [m.mix]), A(() => {
    const k = new IntersectionObserver(([x]) => {
      x.isIntersecting || M();
    });
    k.observe(o.current);
    const D = () => {
      document.hidden && M();
    };
    return document.addEventListener("visibilitychange", D), () => {
      k.disconnect(), document.removeEventListener("visibilitychange", D), l.current?.stop(), l.current = null;
    };
  }, []);
  async function a() {
    if (l.current) {
      M();
      return;
    }
    try {
      const k = ge();
      l.current = k, k.mix(m.mix), await k.ctx.resume(), l.current === k && s(!0);
    } catch {
      M(), g(!0);
    }
  }
  const $ = t.leftLabel === Z.leftLabel ? "rain" : t.leftLabel, C = t.rightLabel === Z.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, ye), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: o,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": r },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": n,
      tabIndex: n ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(m.mix * 100),
      "aria-valuetext": J(m),
      onKeyDown: (k) => {
        if (n) return;
        const D = {
          ArrowLeft: m.mix - 0.01,
          ArrowRight: m.mix + 0.01,
          ArrowDown: m.mix - 0.01,
          ArrowUp: m.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(D, k.key) && (k.preventDefault(), v(Math.round(100 * Math.min(1, Math.max(0, D[k.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      P,
      {
        key: n ? "read-only" : i,
        state: t,
        draggable: n ? Ee : be,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (k) => {
          w.current = k !== null, c(k);
        },
        onDropState: n ? void 0 : (k) => v(k.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(0) }, "Listen to ", $), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(1) }, "Listen to ", C)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, J(m))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: a, "aria-pressed": h, disabled: b }, b ? "Audio unavailable" : h ? "Mute sound" : "Enable sound")));
}
function ke({ value: t, preview: p }) {
  const n = p ?? t, o = new Map(n.lanes.map((c) => [c.id, c.label])), l = new Map(n.cards.map((c) => [c.id, c])), d = n.cards.flatMap((c) => (c.dependsOn ?? []).map((i) => ({ feature: c, prerequisite: l.get(i) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((c) => c.capacity !== void 0).map((c) => {
    const i = re(n, c.id);
    return /* @__PURE__ */ e.createElement("div", { key: c.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, c.label), /* @__PURE__ */ e.createElement("output", { "aria-label": c.label + " capacity" }, i, " / ", c.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": c.label + " point budget", min: 0, max: c.capacity, value: i, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), d.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, d.map(({ feature: c, prerequisite: i }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([c.id, i.id]) }, /* @__PURE__ */ e.createElement("strong", null, c.label), " needs ", i.label, " · ", o.get(i.laneId))))), p && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((c) => t.cards.find((i) => i.id === c.id)?.laneId !== c.laneId).map((c) => c.label + " → " + o.get(c.laneId)).join(" · ")));
}
function xe({ value: t, preview: p, stage: n, apply: o, cancel: l }) {
  const [d, c] = W(t.cards[0].id), i = t.cards.find((r) => r.id === d) ?? t.cards[0], f = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (r) => {
    r.key === "Escape" && (l(), r.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: f }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: f, value: i.id, onChange: (r) => {
    c(r.target.value), l();
  } }, t.cards.map((r) => /* @__PURE__ */ e.createElement("option", { key: r.id, value: r.id }, r.label))), /* @__PURE__ */ e.createElement("div", null, G(t, i).filter((r) => r.id !== i.laneId).map((r) => /* @__PURE__ */ e.createElement("button", { key: r.id, type: "button", onClick: () => n(Q(t, i.id, r.id), { cardId: i.id, laneId: r.id }) }, "Preview ", r.label))), p && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: o }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: l }, "Cancel preview")));
}
const U = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], we = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], N = 148, H = 104;
function ve(t) {
  const p = (n, o, l) => {
    const d = Array.from({ length: 38 }, (c, i) => {
      const f = Math.min(N, 4 * i), r = t * N + f, u = n + o * (Math.sin(r / 46) + 0.39 * Math.cos(r / 19) + 0.09 * Math.sin(r / 7));
      return (i ? "L" : "M") + f + " " + u.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: d + `L${N} ${H}H0z`, fill: l });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: N + 8, height: H + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: N + 4, height: H + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: N, height: H, fill: "#343b66" }), Array.from({ length: 13 }, (n, o) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + o, cx: 6 + (o * 77 + t * 19) % 136, cy: 4 + (o * 29 + t * 11) % 35, r: o % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), p(48, 7, "#9b88aa"), p(59, 10, "#bf9492"), p(75, 7, "#596d83"), p(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + o, d: `M${4 + (o * 37 + t * 13) % 124} ${92 + o * 3 % 10}h${4 + o % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Me(t, p) {
  return ({ state: n, d: o, draggedId: l, isTracking: d }) => {
    const c = (r) => r === 1 ? "panorama-panel" : "gallery-panel-" + r, i = (r) => (n.hung.includes(n.panels[r].id) ? U : we)[r], f = n.panels.findIndex((r, u) => c(u) === l);
    if (d && f >= 0) {
      const r = i(f);
      return /* @__PURE__ */ e.createElement("g", { id: c(f), transform: S(r.x, r.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((r) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + r, d: `M${40 + 83 * r} 225l${(r - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((r) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + r, transform: S(163 + r * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((r, u) => {
      const h = U[u], s = i(u), b = !t && (!p || p.includes(r.id)) && j(n, r.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: r.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: u === 1 ? "gallery-hook" : "gallery-hook-" + u,
          x: h.x,
          y: h.y,
          width: N,
          height: H,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: h.x + N / 2, cy: h.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: c(u),
          transform: S(s.x, s.y),
          dragologyZIndex: l === c(u) ? "/1" : !1,
          dragologyOnDrag: b ? () => o.between([n, K(n, r.id)]) : void 0
        },
        ve(["dunes", "moon", "coast"].indexOf(r.artwork))
      ));
    }));
  };
}
function Ne({ value: t, onChange: p, onPreview: n, readOnly: o = !1, enabledIds: l }) {
  const d = e.useRef(null), [c, i] = e.useState(1), [f, r] = e.useState(0), [u, h] = e.useState(null), s = e.useRef(t);
  s.current = t;
  const b = e.useMemo(() => Me(o, l), [o, l]), g = (a) => {
    h(a), n?.(a);
  }, m = e.useRef(n);
  m.current = n;
  const y = e.useCallback(() => {
    h(null), m.current?.(null), r((a) => a + 1);
  }, []);
  e.useEffect(() => {
    const a = new ResizeObserver(() => {
      d.current && i(Math.min(1, d.current.clientWidth / 640));
    });
    return a.observe(d.current), () => a.disconnect();
  }, []), e.useEffect(() => {
    y();
    const a = ($) => {
      $.key === "Escape" && y();
    };
    return document.addEventListener("keydown", a), window.addEventListener("blur", y), () => {
      document.removeEventListener("keydown", a), window.removeEventListener("blur", y);
    };
  }, [t, o, y]);
  function w(a) {
    if (g(null), o || s.current !== t) return;
    const $ = a.hung.find((C) => !t.hung.includes(C));
    $ && (!l || l.includes($)) && j(t, $) && p(K(t, $));
  }
  const L = u ?? t, v = L.panels.find((a) => L.hung.includes(a.id) && !t.hung.includes(a.id)), M = t.panels.filter((a) => !t.hung.includes(a.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: d, onPointerCancel: y, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: c, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    P,
    {
      key: f,
      draggable: b,
      width: 640,
      height: 300,
      state: t,
      onDragState: g,
      onDropState: w
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, L.panels.map((a, $) => /* @__PURE__ */ e.createElement("svg", { key: a.id, x: $ * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: L.hung.includes(a.id) ? "#343b66" : "#c7b8a8" }), L.hung.includes(a.id) && /* @__PURE__ */ e.createElement("g", null, a.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: a.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : a.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, v ? v.label + " lines up with its hook." : M.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !o && M.filter((a) => (!l || l.includes(a.id)) && j(t, a.id)).map((a) => /* @__PURE__ */ e.createElement("button", { key: a.id, type: "button", onFocus: () => g(K(t, a.id)), onBlur: () => g(null), onClick: () => w(K(t, a.id)) }, "Hang ", a.label)));
}
const $e = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", V = { start: 99, opener: 361 }, Le = { route: null }, O = "#ffcb62";
function ee(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((p) => /* @__PURE__ */ e.createElement("g", { key: p, transform: "scale(" + p + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (p, n) => {
    const o = 33 - n * 6, l = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${o}q${-l} -2 ${-l - 4} -15q${l} 1 ${l + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${o - 3}q${l - 1} -3 ${l + 2} -15q${-l} 3 ${-l - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (p, n) => {
    const o = (n - 5.5) * 6, l = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${o * 0.35} 6 ${o} ${l}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((d) => /* @__PURE__ */ e.createElement("path", { key: d, d: `M${o * d / 5} ${35 + (l - 35) * d / 5}q${o * 0.15 - 5} -4 ${o * 0.25 - 7} -13m${7 - o * 0.25} 13q6 -6 7 -13` })));
  }));
}
function ae({ state: t, d: p, isTracking: n }, o = !1) {
  const l = t.route ? V[t.route] : 232, d = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: S(l, d) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [V.start, V.opener].map((c, i) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(c) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${c} 85 ${c} 48V0`, fill: "none", stroke: t.route === "start" && i === 0 || t.route === "opener" && i === 1 ? O : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: i ? "opener-jack" : "first-jack", cx: c, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: c, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, i ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: S(l, d), dragologyOnDrag: o ? void 0 : () => p.closest([Le, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: O, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function ze(t) {
  return ae(t, !0);
}
function Re({ value: t, onChange: p, readOnly: n = !1 }) {
  const o = n || !p, [l, d] = W(null), [c, i] = W(0), [f, r] = W(1), [u, h] = W(""), [s, b] = W(null), [g, m] = W(1), y = q(null), w = q(null), L = q([]), v = ie(), M = ne(() => ({ route: t.route }), [t.route]), a = (!o && l ? l : M).route;
  A(() => {
    const x = y.current, I = new ResizeObserver(() => m(Math.min(1, x.clientWidth / 460)));
    return I.observe(x), () => I.disconnect();
  }, []);
  function $(x) {
    o || (d(null), h(""), p?.({ ...t, route: x.route }));
  }
  function C(x) {
    r(x), b(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), w.current?.showModal();
  }
  function k() {
    const x = t.route === "start" ? 0 : f;
    L.current[x]?.focus({ preventScroll: !0 });
    const I = t[R[x]];
    h(x === f ? "Focus returned to " + I + ", the print you opened." : "Focus jumped to " + I + ". You opened " + t[R[f]] + ".");
  }
  function D() {
    i((x) => x + 1), d(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": o || void 0,
      onPointerCancel: D,
      onKeyDown: (x) => {
        x.key === "Escape" && !w.current?.open && D();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, $e),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, o ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, R.map((x, I) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: x,
        ref: (E) => {
          L.current[I] = E;
        },
        "aria-label": "Open " + t[x],
        onClick: () => C(I)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ee(I)),
      /* @__PURE__ */ e.createElement("span", null, t[x])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: y, style: { "--circuit-scale": g } }, /* @__PURE__ */ e.createElement(
      P,
      {
        key: o ? "locked" : c,
        state: M,
        width: 460,
        height: 108,
        draggable: o ? ze : ae,
        onDragState: o ? void 0 : d,
        onDropState: o ? void 0 : $
      }
    )),
    !o && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": a === "start", onClick: () => $({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": a === "opener", onClick: () => $({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, a === "start" ? "Every viewer returns to the first print." : a === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, u || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: w, onClose: k, "aria-labelledby": v, onKeyDown: (x) => {
      x.key === "Escape" && (x.preventDefault(), x.stopPropagation(), x.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ee(f)), /* @__PURE__ */ e.createElement("h2", { id: v }, t[R[f]]), !o && s !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (x) => {
      x.preventDefault(), s.trim() && (p?.({ ...t, [R[f]]: s.trim() }), b(null), w.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: s, onChange: (x) => b(x.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !s.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => b(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => w.current?.close() }, "Close viewer"), !o && s === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => b(t[R[f]]) }, "Rename print"))
  );
}
function te(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((p) => p.trim()) ?? [t];
}
function le({ state: t, d: p, draggedId: n, isTracking: o }, l) {
  const { width: d, row: c, height: i, top: f } = fe, { points: r } = X(t), u = !!t.lanes[0].station, h = (s) => {
    const b = t.lanes.findIndex((m) => m.id === s.laneId), g = t.cards.filter((m) => m.laneId === s.laneId).indexOf(s);
    return S((u ? 18 : 8) + r[b].x, r[b].y + f + g * c);
  };
  if (o && n) {
    const s = t.cards.find((b) => "choice-" + b.id === n);
    if (s) return /* @__PURE__ */ e.createElement("g", { id: n, transform: h(s) });
  }
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((s, b) => (s.station?.next ?? []).map((g) => {
    const m = r[b], y = r[t.lanes.findIndex((k) => k.id === g)], w = d / 2 + 8, L = (f - 12) / 2 + 4, v = y.x - m.x, M = y.y - m.y, a = Math.min(v ? d / 2 / Math.abs(v) : 1 / 0, M ? (L - 4) / Math.abs(M) : 1 / 0), $ = y.x + w - v * a, C = y.y + L - M * a;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: s.id + "-" + g }, /* @__PURE__ */ e.createElement("line", { x1: m.x + w, y1: m.y + L, x2: $, y2: C, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${$} ${C}) rotate(${Math.atan2(M, v) * 180 / Math.PI})` }));
  })), t.lanes.map((s, b) => {
    const g = t.cards.filter((w) => w.laneId === s.id).length, m = t.kind === "release-plan" && re(t, s.id), y = t.kind === "release-plan" ? m + (s.capacity ? " / " + s.capacity : "") + " points" : s.station ? g ? "● Occupied" : "Open stop" : s.capacity ? `${g} of ${s.capacity} slots` : `${g} ${g === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + s.id, transform: S(8 + r[b].x, 4 + r[b].y) }, u && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: d, height: f + Math.max(1, g) * c - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("rect", { width: d, height: f - 12, rx: u ? 6 : 9, fill: u ? "#253c36" : me[b] }), te(s.label).map((w, L) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + L, fill: u ? "#fffdf3" : "#18302d", transform: S(12, (u ? 23 : 16) + L * 16), fontSize: u ? 17 : 13, fontWeight: "bold" }, w)), /* @__PURE__ */ e.createElement("text", { fill: u ? "#ebd29a" : "#18302d", transform: S(12, f - 23), fontSize: 12 }, y));
  }), t.cards.map((s) => {
    const b = l ? [] : G(t, s), g = "choice-" + s.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: g,
        transform: h(s),
        dragologyZIndex: n === g ? "/1" : !1,
        dragologyOnDrag: b.length > 1 ? () => p.closest(b.map((m) => Q(t, s.id, m.id))).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: u ? d - 20 : d, height: i - (u ? 6 : 0), fill: u ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: u ? 1 : 8 }),
      u && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: S(12, i - 10), fill: "#466358", fontSize: 12 }, s.points, " pts"),
      te(s.label).map((m, y) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + y, transform: S(12, 17 + y * 16), fontSize: 14 }, m))
    );
  }));
}
const Se = (t) => le(t, !1), Ce = (t) => le(t, !0);
function He({ value: t, onChange: p, onPreview: n, onUndo: o, canUndo: l, readOnly: d = !1 }) {
  const { width: c, height: i } = X(t), f = t.kind === "release-plan", [r, u] = e.useState(0), h = e.useRef(!1), s = e.useRef(null), [b, g] = e.useState(null), [m, y] = e.useState(null), [w, L] = e.useState(null), v = !d && m?.source === t ? m : null, M = e.useRef(t), a = e.useCallback((E) => {
    f && g(E), n?.(E);
  }, [f, n]), $ = e.useCallback(() => {
    h.current = !1, s.current = null, y(null), a(null), u((E) => E + 1);
  }, [a]);
  e.useLayoutEffect(() => {
    M.current !== t && (h.current || m) && $(), M.current = t;
  }, [t, m, $]);
  const C = (E, z) => {
    h.current = !1, y(null), E !== t && (f && !o && L({ before: t, after: E }), p(E, z));
  }, k = (E) => {
    const z = E.cards.find((F) => F.id === s.current);
    C(E, z && { cardId: z.id, laneId: z.laneId });
  }, D = e.useCallback((E) => {
    const z = E.type === "dragging" ? E : E.pendingDrag?.status;
    h.current = !!z, z ? (s.current = z.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, y(null)) : s.current !== null && (s.current = null, a(null));
  }, [a]);
  e.useEffect(() => {
    function E(z) {
      !h.current && !m || z instanceof KeyboardEvent && z.key !== "Escape" || $();
    }
    return document.addEventListener("keydown", E), document.addEventListener("pointercancel", E), window.addEventListener("blur", E), () => {
      document.removeEventListener("keydown", E), document.removeEventListener("pointercancel", E), window.removeEventListener("blur", E);
    };
  }, [$, m]);
  const x = d ? null : v?.next ?? b, I = x ? Math.max(i, X(x).height) : i;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement("div", { style: { maxWidth: "100%", overflowX: "auto" } }, /* @__PURE__ */ e.createElement(
    P,
    {
      key: d ? "read-only" : r,
      draggable: d || v ? Ce : Se,
      state: v?.next ?? t,
      onDropState: d ? void 0 : k,
      onDragState: d ? void 0 : a,
      onDragStatus: D,
      width: c,
      height: I
    }
  )), f && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(ke, { value: t, preview: x }), !d && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    xe,
    {
      value: t,
      preview: v?.move ?? null,
      stage: (E, z) => {
        y({ source: t, next: E, move: z }), n?.(E);
      },
      cancel: $,
      apply: () => {
        v && (C(v.next, v.move), a(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(o ? l : w?.after === t), onClick: () => {
    $(), o ? o() : w?.after === t && (L(null), p(w.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((E) => {
    const z = t.lanes.find((F) => F.id === E.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: E.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, E.label, " · ", z.label), /* @__PURE__ */ e.createElement("br", null), z.station.outcome), G(t, E).filter((F) => F.id !== E.laneId).map((F) => /* @__PURE__ */ e.createElement("button", { key: F.id, type: "button", disabled: d, onClick: () => C(Q(t, E.id, F.id), { cardId: E.id, laneId: F.id }) }, E.label, " → ", F.label)));
  })), !f && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((E) => /* @__PURE__ */ e.createElement("label", { key: E.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, E.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: d,
      "aria-label": "Move " + E.label,
      value: E.laneId,
      onChange: (z) => C(Q(t, E.id, z.currentTarget.value), { cardId: E.id, laneId: z.currentTarget.value })
    },
    G(t, E).map((z) => /* @__PURE__ */ e.createElement("option", { key: z.id, value: z.id }, z.label))
  )))));
}
export {
  Re as FocusDarkroomBoard,
  qe as ListeningRoomBoard,
  Ne as MoonGalleryBoard,
  Fe as OfflineHandoffBoard,
  ke as ReleasePlanReadout,
  He as WorkshopBoard,
  G as availableLanes,
  j as canHangPanel,
  Be as decodeWorkshopFragment,
  Ke as describeFocusDarkroom,
  Te as encodeWorkshopFragment,
  Y as handoffSummary,
  K as hangGalleryPanel,
  Ge as industrialWorkshop,
  Qe as initialFocusDarkroom,
  me as laneColors,
  Z as listeningRoom,
  J as listeningRoomCaption,
  Ve as moonGallery,
  Q as moveWorkshopCard,
  je as nightTransfer,
  Xe as normalizeFocusDarkroom,
  Ye as normalizeListeningRoom,
  _e as normalizeMoonGallery,
  Ze as normalizeOfflineHandoff,
  de as offlineHandoff,
  R as printFields,
  re as releaseLoad,
  Je as releasePlan,
  _ as resolveHandoff,
  B as reviewHandoff,
  Ue as validateWorkshop,
  fe as workshopLayout,
  X as workshopPositions,
  Oe as workshopToSlate
};
