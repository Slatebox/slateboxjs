import e, { useState as I, useRef as R, useMemo as pe, useLayoutEffect as _, useEffect as G, useId as we } from "react";
import { DraggableRenderer as Q, translate as W, param as ve, inOrder as Me } from "./dragology.mjs";
import { handoffSummary as le, reviewHandoff as X, resolveHandoff as ie, offlineHandoff as $e, listeningRoom as se, listeningRoomCaption as ce, workshopLayout as ee, releaseLoad as he, availableLanes as Z, moveWorkshopCard as J, canHangPanel as te, hangGalleryPanel as Y, printFields as H, workshopPositions as ne, resolveWorkshopSignals as Le, laneColors as Se } from "./workshop-model.mjs";
import { decodeWorkshopFragment as rt, describeFocusDarkroom as ot, encodeWorkshopFragment as at, industrialWorkshop as lt, initialFocusDarkroom as it, moonGallery as st, nightTransfer as ct, normalizeFocusDarkroom as dt, normalizeListeningRoom as ft, normalizeMoonGallery as ut, normalizeOfflineHandoff as mt, releasePlan as pt, validateWorkshop as ht, workshopPresentationLanes as gt, workshopPresentationScenes as bt, workshopToSlate as Et } from "./workshop-model.mjs";
function Ce(t, u, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${u}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + o, d: `M59 ${o}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function ze(t, u) {
  const n = t ? 9 : 49, o = t ? 20 : 23, r = t ? 144 : 181, m = t ? 183 : 370, a = t ? 35 : 40, l = t ? 164 : 255, h = t ? 119 : 147, i = 45, p = (g, b, w, c, f = "#243c32", k = "normal", E = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: W(g, b), fill: f, fontSize: c, fontFamily: E, fontWeight: k }, w);
  return ({ state: g, d: b, draggedId: w }) => {
    const c = g.stage === "queued", f = g.stage === "resolved", k = m + (l - h) / 2, E = a + 138, M = c ? n + (r - h) / 2 : k, S = c ? o + 141 : E, $ = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + r - 2} ${o + 180} C${n + r + 45} ${o + 235},${m - 24} ${a + 204},${m + 22} ${a + 159}`, fill: "none", stroke: c ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: c ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: W(n, o) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: r, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: r, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: r - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), p(13, 27, "17:08", 9, $, "bold"), p(r - 50, 27, c ? "Offline" : "Online", 10, c ? "#835420" : "#266451", "bold"), p(13, 47, "Field log", t ? 18 : 20, $, "bold"), Ce(13, 55, (r - 26) / 142), p(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, $), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: W(m, a) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${l - 5} -3 5 190 -${l - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${l - 1} -3 3 183 -${l - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: l, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((s) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + s, cx: "8", cy: s, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), p(23, 38, c ? "SHIFT HANDOFF" : f ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), p(22, 69, "Gate B", t ? 30 : 37, $, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${l - 42}`, stroke: "#bfc5b1" }), p(23, 101, (f && g.choice === "field" ? g.fieldNote : g.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, $, "bold"), p(23, 120, f && g.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: W((l - h) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: h, height: i, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), p(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: W(M, S),
        dragologyZIndex: w === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !u && c ? () => b.closest([g, X(g)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${h - 2}v${i - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${h}v${i - 7}l-7 7H0z`, fill: f ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${h - 7} ${i}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((s) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + s, cx: "8", cy: s, r: "1.3", fill: "#84662e" })),
      p(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      p(17, 34, f ? "Reviewed" : g.fieldNote === $e.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const We = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function Ze({ value: t, onChange: u, readOnly: n = !1 }) {
  const [o, r] = I(null), [m, a] = I(null), [l, h] = I(0), [i, p] = I(!1), [g, b] = I(1), w = R(null), c = R(!1), f = R(t), k = pe(() => ze(i, n), [i, n]), E = n ? t : m ?? o ?? t, M = t.stage === "queued" && E.stage === "review";
  function S() {
    c.current = !1, a(null), r(null), h((s) => s + 1);
  }
  function $(s) {
    S(), !n && s.stage !== t.stage && u?.(s);
  }
  return _(() => {
    (c.current || m) && (n || f.current !== t) && S(), f.current = t;
  }, [t, n, m]), _(() => {
    const s = () => {
      const z = w.current.clientWidth;
      p(z < 510), b(Math.min(1, z / (z < 510 ? 360 : 685)));
    };
    s();
    const L = new ResizeObserver(s);
    return L.observe(w.current), () => L.disconnect();
  }, []), G(() => {
    function s(L) {
      (c.current || m) && (!(L instanceof KeyboardEvent) || L.key === "Escape") && S();
    }
    return document.addEventListener("keydown", s), document.addEventListener("pointercancel", s), window.addEventListener("blur", s), () => {
      document.removeEventListener("keydown", s), document.removeEventListener("pointercancel", s), window.removeEventListener("blur", s);
    };
  }, [m]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, We), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: w, style: { "--drawing-scale": g } }, /* @__PURE__ */ e.createElement(
    Q,
    {
      key: n ? "read-only" : l,
      state: m ?? t,
      draggable: k,
      width: i ? 360 : 685,
      height: i ? 254 : 262,
      onDragState: n ? void 0 : (s) => {
        c.current = !0, r(s.stage !== t.stage && t.stage === "queued" ? s : null);
      },
      onDropState: n ? void 0 : $
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (E.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", E.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, le(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, M ? "The two access reports disagree." : le(t)), !n && (t.stage === "queued" ? M ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => $(X(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: S }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => a(X(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => $(ie(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => $(ie(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => $(X(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => $({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function De() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const u = new t(), n = u.sampleRate, o = n * 4, r = u.createBuffer(1, o, n), m = u.createBuffer(1, o, n), a = r.getChannelData(0), l = m.getChannelData(0);
  let h = 419;
  function i() {
    return h = 1664525 * h + 1013904223 >>> 0, h / 4294967296;
  }
  for (let g = 0; g < 100; g++) {
    const b = Math.floor(i() * o), w = 380 + i() * 1500, c = 0.09 + i() * 0.08;
    for (let f = 0; f < n * 0.12; f++) {
      const k = f / n, E = Math.sin(2 * Math.PI * w * k) + 0.22 * (i() * 2 - 1);
      a[(b + f) % o] += c * Math.exp(-k * 76) * E;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((g, b) => {
    const w = Math.floor((b * 0.93 + 0.1) * n);
    for (let c = 0; c < n * 1.6; c++) {
      const f = c / n, k = Math.sin(f * g * 2 * Math.PI) + 0.23 * Math.sin(f * g * 5.42 * Math.PI);
      l[(w + c) % o] += 0.16 * Math.min(1, f * 250) * Math.exp(-f * 3.3) * k;
    }
  });
  const p = [r, m].map((g) => {
    const b = u.createBufferSource(), w = u.createGain();
    return w.gain.value = 0, b.buffer = g, b.loop = !0, b.connect(w).connect(u.destination), b.start(), w;
  });
  return {
    ctx: u,
    mix(g) {
      p[0].gain.setTargetAtTime(Math.cos(g * Math.PI / 2), u.currentTime, 0.035), p[1].gain.setTargetAtTime(Math.sin(g * Math.PI / 2), u.currentTime, 0.035);
    },
    stop() {
      u.close();
    }
  };
}
function ge({ state: t, d: u, isTracking: n }, o) {
  const r = t.mix, m = 106 + 420 * r, a = W(m, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: a }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (l, h) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + h, cx: 18 + h * 137 % 604, cy: 12 + h * 47 % 103, r: h % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - r * 0.45 }, Array.from({ length: 30 }, (l, h) => {
    const i = 29 + h * 31 % 184, p = 24 + h * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + h, d: `M${i} ${p}l-3 8`, stroke: h % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: h % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + l, d: `M${39 + l * 15} ${116 + l * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + l, d: `M${65 + l * 35} ${177 - l * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + r * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((l) => {
    const h = 407 + l * 32, i = 63 - l % 3 * 4, p = 52 + (l + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + l, transform: W(h, i) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${p}l-8 5-8-6z`, fill: l % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${p + 7}l7-5V13z`, fill: l % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${p - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: r })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: a, dragologyOnDrag: o ? void 0 : () => u.vary(t, ve("mix"), { constraint: (l) => Me([0, l.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + r * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const Ie = (t) => ge(t, !1), Fe = (t) => ge(t, !0), Pe = `
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
function Je({ value: t, onChange: u, readOnly: n = !1 }) {
  const o = R(null), r = R(null), [m, a] = I(null), [l, h] = I(0), [i, p] = I(1), [g, b] = I(!1), [w, c] = I(!1), f = m ?? t, k = R(t), E = R(!1);
  function M() {
    E.current = !1, a(null), h((x) => x + 1);
  }
  _(() => {
    E.current && (n || t !== k.current) && M(), k.current = t;
  }, [t, n]), _(() => {
    const x = o.current, C = () => p(Math.min(1, x.clientWidth / 640));
    C();
    const y = new ResizeObserver(C);
    return y.observe(x), () => y.disconnect();
  }, []), G(() => {
    function x(C) {
      E.current && (!(C instanceof KeyboardEvent) || C.key === "Escape") && M();
    }
    return document.addEventListener("keydown", x), document.addEventListener("pointercancel", x), window.addEventListener("blur", x), () => {
      document.removeEventListener("keydown", x), document.removeEventListener("pointercancel", x), window.removeEventListener("blur", x);
    };
  }, []);
  function S(x) {
    E.current = !1, a(null), !n && x !== t.mix && u?.({ ...t, mix: x });
  }
  function $() {
    r.current?.stop(), r.current = null, b(!1);
  }
  G(() => {
    r.current?.mix(f.mix);
  }, [f.mix]), G(() => {
    const x = new IntersectionObserver(([y]) => {
      y.isIntersecting || $();
    });
    x.observe(o.current);
    const C = () => {
      document.hidden && $();
    };
    return document.addEventListener("visibilitychange", C), () => {
      x.disconnect(), document.removeEventListener("visibilitychange", C), r.current?.stop(), r.current = null;
    };
  }, []);
  async function s() {
    if (r.current) {
      $();
      return;
    }
    try {
      const x = De();
      r.current = x, x.mix(f.mix), await x.ctx.resume(), r.current === x && b(!0);
    } catch {
      $(), c(!0);
    }
  }
  const L = t.leftLabel === se.leftLabel ? "rain" : t.leftLabel, z = t.rightLabel === se.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, Pe), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: o,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": i },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": n,
      tabIndex: n ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(f.mix * 100),
      "aria-valuetext": ce(f),
      onKeyDown: (x) => {
        if (n) return;
        const C = {
          ArrowLeft: f.mix - 0.01,
          ArrowRight: f.mix + 0.01,
          ArrowDown: f.mix - 0.01,
          ArrowUp: f.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(C, x.key) && (x.preventDefault(), S(Math.round(100 * Math.min(1, Math.max(0, C[x.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      Q,
      {
        key: n ? "read-only" : l,
        state: t,
        draggable: n ? Fe : Ie,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (x) => {
          E.current = x !== null, a(x);
        },
        onDropState: n ? void 0 : (x) => S(x.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => S(0) }, "Listen to ", L), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => S(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => S(1) }, "Listen to ", z)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, ce(f))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: s, "aria-pressed": g, disabled: w }, w ? "Audio unavailable" : g ? "Mute sound" : "Enable sound")));
}
function Re(t, u, n) {
  const o = [];
  let r = "";
  for (const m of t.split(/\s+/u)) {
    const a = r ? r + " " + m : m;
    if (n.measureText(a).width <= u) {
      r = a;
      continue;
    }
    r && o.push(r), r = "";
    for (const l of m)
      r && n.measureText(r + l).width > u && (o.push(r), r = ""), r += l;
  }
  return r && o.push(r), o;
}
function qe(t, u) {
  const n = Math.min(ee.pitch, Math.max(124, Math.floor(u / t.lanes.length))), o = n - 16, r = document.createElement("canvas").getContext("2d"), m = /* @__PURE__ */ new Map();
  function a(p, g, b) {
    r.font = b;
    let w = 1;
    for (const c of p) {
      const f = Re(c.label, o - 25, r);
      m.set(g + c.id, f), w = Math.max(w, f.length);
    }
    return w;
  }
  const l = a(t.lanes, "heading-", "bold 13px system-ui, sans-serif"), h = a(t.cards, "choice-", "14px system-ui, sans-serif"), i = Math.max(ee.height, 16 * h + 14);
  return { labels: m, layout: { pitch: n, width: o, height: i, row: i + 12, top: 16 * l + 45 } };
}
function Ne({ value: t, preview: u }) {
  const n = u ?? t, o = new Map(n.lanes.map((a) => [a.id, a.label])), r = new Map(n.cards.map((a) => [a.id, a])), m = n.cards.flatMap((a) => (a.dependsOn ?? []).map((l) => ({ feature: a, prerequisite: r.get(l) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((a) => a.capacity !== void 0).map((a) => {
    const l = he(n, a.id);
    return /* @__PURE__ */ e.createElement("div", { key: a.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, a.label), /* @__PURE__ */ e.createElement("output", { "aria-label": a.label + " capacity" }, l, " / ", a.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": a.label + " point budget", min: 0, max: a.capacity, value: l, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), m.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, m.map(({ feature: a, prerequisite: l }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([a.id, l.id]) }, /* @__PURE__ */ e.createElement("strong", null, a.label), " needs ", l.label, " · ", o.get(l.laneId))))), u && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((a) => t.cards.find((l) => l.id === a.id)?.laneId !== a.laneId).map((a) => a.label + " → " + o.get(a.laneId)).join(" · ")));
}
function Ae({ value: t, preview: u, stage: n, apply: o, cancel: r }) {
  const [m, a] = I(t.cards[0].id), l = t.cards.find((i) => i.id === m) ?? t.cards[0], h = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (i) => {
    i.key === "Escape" && (r(), i.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: h }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: h, value: l.id, onChange: (i) => {
    a(i.target.value), r();
  } }, t.cards.map((i) => /* @__PURE__ */ e.createElement("option", { key: i.id, value: i.id }, i.label))), /* @__PURE__ */ e.createElement("div", null, Z(t, l).filter((i) => i.id !== l.laneId).map((i) => /* @__PURE__ */ e.createElement("button", { key: i.id, type: "button", onClick: () => n(J(t, l.id, i.id), { cardId: l.id, laneId: i.id }) }, "Preview ", i.label))), u && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: o }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: r }, "Cancel preview")));
}
const de = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], He = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], N = 148, T = 104;
function Be(t) {
  const u = (n, o, r) => {
    const m = Array.from({ length: 38 }, (a, l) => {
      const h = Math.min(N, 4 * l), i = t * N + h, p = n + o * (Math.sin(i / 46) + 0.39 * Math.cos(i / 19) + 0.09 * Math.sin(i / 7));
      return (l ? "L" : "M") + h + " " + p.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: m + `L${N} ${T}H0z`, fill: r });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: N + 8, height: T + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: N + 4, height: T + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: N, height: T, fill: "#343b66" }), Array.from({ length: 13 }, (n, o) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + o, cx: 6 + (o * 77 + t * 19) % 136, cy: 4 + (o * 29 + t * 11) % 35, r: o % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), u(48, 7, "#9b88aa"), u(59, 10, "#bf9492"), u(75, 7, "#596d83"), u(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + o, d: `M${4 + (o * 37 + t * 13) % 124} ${92 + o * 3 % 10}h${4 + o % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Ke(t, u) {
  return ({ state: n, d: o, draggedId: r, isTracking: m }) => {
    const a = (i) => i === 1 ? "panorama-panel" : "gallery-panel-" + i, l = (i) => (n.hung.includes(n.panels[i].id) ? de : He)[i], h = n.panels.findIndex((i, p) => a(p) === r);
    if (m && h >= 0) {
      const i = l(h);
      return /* @__PURE__ */ e.createElement("g", { id: a(h), transform: W(i.x, i.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + i, d: `M${40 + 83 * i} 225l${(i - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((i) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + i, transform: W(163 + i * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((i, p) => {
      const g = de[p], b = l(p), w = !t && (!u || u.includes(i.id)) && te(n, i.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: i.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: p === 1 ? "gallery-hook" : "gallery-hook-" + p,
          x: g.x,
          y: g.y,
          width: N,
          height: T,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: g.x + N / 2, cy: g.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: a(p),
          transform: W(b.x, b.y),
          dragologyZIndex: r === a(p) ? "/1" : !1,
          dragologyOnDrag: w ? () => o.between([n, Y(n, i.id)]) : void 0
        },
        Be(["dunes", "moon", "coast"].indexOf(i.artwork))
      ));
    }));
  };
}
function Ue({ value: t, onChange: u, onPreview: n, readOnly: o = !1, enabledIds: r }) {
  const m = e.useRef(null), [a, l] = e.useState(1), [h, i] = e.useState(0), [p, g] = e.useState(null), b = e.useRef(t);
  b.current = t;
  const w = e.useMemo(() => Ke(o, r), [o, r]), c = (s) => {
    g(s), n?.(s);
  }, f = e.useRef(n);
  f.current = n;
  const k = e.useCallback(() => {
    g(null), f.current?.(null), i((s) => s + 1);
  }, []);
  e.useEffect(() => {
    const s = new ResizeObserver(() => {
      m.current && l(Math.min(1, m.current.clientWidth / 640));
    });
    return s.observe(m.current), () => s.disconnect();
  }, []), e.useEffect(() => {
    k();
    const s = (L) => {
      L.key === "Escape" && k();
    };
    return document.addEventListener("keydown", s), window.addEventListener("blur", k), () => {
      document.removeEventListener("keydown", s), window.removeEventListener("blur", k);
    };
  }, [t, o, k]);
  function E(s) {
    if (c(null), o || b.current !== t) return;
    const L = s.hung.find((z) => !t.hung.includes(z));
    L && (!r || r.includes(L)) && te(t, L) && u(Y(t, L));
  }
  const M = p ?? t, S = M.panels.find((s) => M.hung.includes(s.id) && !t.hung.includes(s.id)), $ = t.panels.filter((s) => !t.hung.includes(s.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: m, onPointerCancel: k, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: a, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    Q,
    {
      key: h,
      draggable: w,
      width: 640,
      height: 300,
      state: t,
      onDragState: c,
      onDropState: E
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, M.panels.map((s, L) => /* @__PURE__ */ e.createElement("svg", { key: s.id, x: L * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: M.hung.includes(s.id) ? "#343b66" : "#c7b8a8" }), M.hung.includes(s.id) && /* @__PURE__ */ e.createElement("g", null, s.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: s.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : s.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, S ? S.label + " lines up with its hook." : $.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !o && $.filter((s) => (!r || r.includes(s.id)) && te(t, s.id)).map((s) => /* @__PURE__ */ e.createElement("button", { key: s.id, type: "button", onFocus: () => c(Y(t, s.id)), onBlur: () => c(null), onClick: () => E(Y(t, s.id)) }, "Hang ", s.label)));
}
const Te = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", O = { start: 99, opener: 361 }, Ge = { route: null }, fe = "#ffcb62";
function ue(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((u) => /* @__PURE__ */ e.createElement("g", { key: u, transform: "scale(" + u + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (u, n) => {
    const o = 33 - n * 6, r = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${o}q${-r} -2 ${-r - 4} -15q${r} 1 ${r + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${o - 3}q${r - 1} -3 ${r + 2} -15q${-r} 3 ${-r - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (u, n) => {
    const o = (n - 5.5) * 6, r = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${o * 0.35} 6 ${o} ${r}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((m) => /* @__PURE__ */ e.createElement("path", { key: m, d: `M${o * m / 5} ${35 + (r - 35) * m / 5}q${o * 0.15 - 5} -4 ${o * 0.25 - 7} -13m${7 - o * 0.25} 13q6 -6 7 -13` })));
  }));
}
function be({ state: t, d: u, isTracking: n }, o = !1) {
  const r = t.route ? O[t.route] : 232, m = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: W(r, m) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [O.start, O.opener].map((a, l) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(a) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${a} 85 ${a} 48V0`, fill: "none", stroke: t.route === "start" && l === 0 || t.route === "opener" && l === 1 ? fe : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: l ? "opener-jack" : "first-jack", cx: a, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: a, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, l ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: W(r, m), dragologyOnDrag: o ? void 0 : () => u.closest([Ge, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: fe, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Qe(t) {
  return be(t, !0);
}
function Oe({ value: t, onChange: u, readOnly: n = !1 }) {
  const o = n || !u, [r, m] = I(null), [a, l] = I(0), [h, i] = I(1), [p, g] = I(""), [b, w] = I(null), [c, f] = I(1), k = R(null), E = R(null), M = R([]), S = we(), $ = pe(() => ({ route: t.route }), [t.route]), s = (!o && r ? r : $).route;
  G(() => {
    const y = k.current, F = new ResizeObserver(() => f(Math.min(1, y.clientWidth / 460)));
    return F.observe(y), () => F.disconnect();
  }, []);
  function L(y) {
    o || (m(null), g(""), u?.({ ...t, route: y.route }));
  }
  function z(y) {
    i(y), w(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), E.current?.showModal();
  }
  function x() {
    const y = t.route === "start" ? 0 : h;
    M.current[y]?.focus({ preventScroll: !0 });
    const F = t[H[y]];
    g(y === h ? "Focus returned to " + F + ", the print you opened." : "Focus jumped to " + F + ". You opened " + t[H[h]] + ".");
  }
  function C() {
    l((y) => y + 1), m(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": o || void 0,
      onPointerCancel: C,
      onKeyDown: (y) => {
        y.key === "Escape" && !E.current?.open && C();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, Te),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, o ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, H.map((y, F) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: y,
        ref: (B) => {
          M.current[F] = B;
        },
        "aria-label": "Open " + t[y],
        onClick: () => z(F)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ue(F)),
      /* @__PURE__ */ e.createElement("span", null, t[y])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: k, style: { "--circuit-scale": c } }, /* @__PURE__ */ e.createElement(
      Q,
      {
        key: o ? "locked" : a,
        state: $,
        width: 460,
        height: 108,
        draggable: o ? Qe : be,
        onDragState: o ? void 0 : m,
        onDropState: o ? void 0 : L
      }
    )),
    !o && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": s === "start", onClick: () => L({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": s === "opener", onClick: () => L({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, s === "start" ? "Every viewer returns to the first print." : s === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, p || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: E, onClose: x, "aria-labelledby": S, onKeyDown: (y) => {
      y.key === "Escape" && (y.preventDefault(), y.stopPropagation(), y.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ue(h)), /* @__PURE__ */ e.createElement("h2", { id: S }, t[H[h]]), !o && b !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (y) => {
      y.preventDefault(), b.trim() && (u?.({ ...t, [H[h]]: b.trim() }), w(null), E.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: b, onChange: (y) => w(y.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !b.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => w(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => E.current?.close() }, "Close viewer"), !o && b === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => w(t[H[h]]) }, "Rename print"))
  );
}
function me(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((u) => u.trim()) ?? [t];
}
function re({ state: t, d: u, draggedId: n, isTracking: o }, r, m) {
  const a = m?.layout ?? ee, { width: l, row: h, height: i, top: p } = a, { points: g } = ne(t, a), b = !!t.lanes[0].station, w = (c) => {
    const f = t.lanes.findIndex((E) => E.id === c.laneId), k = t.cards.filter((E) => E.laneId === c.laneId).indexOf(c);
    return W((b ? 18 : 8) + g[f].x, g[f].y + p + k * h);
  };
  if (o && n) {
    const c = t.cards.find((f) => "choice-" + f.id === n);
    if (c) return /* @__PURE__ */ e.createElement("g", { id: n, transform: w(c) });
  }
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((c, f) => (c.station?.next ?? []).map((k) => {
    const E = g[f], M = g[t.lanes.findIndex((y) => y.id === k)], S = l / 2 + 8, $ = (p - 12) / 2 + 4, s = M.x - E.x, L = M.y - E.y, z = Math.min(s ? l / 2 / Math.abs(s) : 1 / 0, L ? ($ - 4) / Math.abs(L) : 1 / 0), x = M.x + S - s * z, C = M.y + $ - L * z;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: c.id + "-" + k }, /* @__PURE__ */ e.createElement("line", { x1: E.x + S, y1: E.y + $, x2: x, y2: C, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${x} ${C}) rotate(${Math.atan2(L, s) * 180 / Math.PI})` }));
  })), t.lanes.map((c, f) => {
    const k = t.cards.filter((S) => S.laneId === c.id).length, E = t.kind === "release-plan" && he(t, c.id), M = t.kind === "release-plan" ? E + (c.capacity ? " / " + c.capacity : "") + " points" : c.station ? k ? "● Occupied" : "Open stop" : c.capacity ? `${k} of ${c.capacity} slots` : `${k} ${k === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + c.id, transform: W(8 + g[f].x, 4 + g[f].y) }, b && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: l, height: p + Math.max(1, k) * h - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("rect", { width: l, height: p - 12, rx: b ? 6 : 9, fill: b ? "#253c36" : Se[f] }), (m?.labels.get("heading-" + c.id) ?? me(c.label)).map((S, $) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + $, fill: b ? "#fffdf3" : "#18302d", transform: W(12, (b ? 23 : 16) + $ * 16), fontSize: b ? 17 : 13, fontWeight: "bold" }, S)), /* @__PURE__ */ e.createElement("text", { fill: b ? "#ebd29a" : "#18302d", transform: W(12, p - 23), fontSize: 12 }, M));
  }), t.cards.map((c) => {
    const f = r ? [] : Z(t, c), k = "choice-" + c.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: k,
        "data-workshop-card": c.id,
        transform: w(c),
        dragologyZIndex: n === k ? "/1" : !1,
        dragologyOnDrag: f.length > 1 ? () => u.closest(f.map((E) => J(t, c.id, E.id))).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: b ? l - 20 : l, height: i - (b ? 6 : 0), fill: b ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: b ? 1 : 8 }),
      b && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: W(12, i - 10), fill: "#466358", fontSize: 12 }, c.points, " pts"),
      (m?.labels.get(k) ?? me(c.label)).map((E, M) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + M, transform: W(12, 17 + M * 16), fontSize: 14 }, E))
    );
  }));
}
const Ve = (t) => re(t, !1), je = (t) => re(t, !0);
function et({ value: t, onChange: u, onPreview: n, onEditCard: o, onUndo: r, canUndo: m, readOnly: a = !1, fitLanes: l = !1, showPlacementOutcomes: h = !0 }) {
  const i = e.useRef(null), p = e.useRef(null), g = e.useRef(null), [b, w] = e.useState(0), c = l && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const d = i.current;
    if (!c || !d) return;
    const v = () => w(d.clientWidth);
    v();
    const D = new ResizeObserver(v);
    return D.observe(d), () => D.disconnect();
  }, [c]);
  const f = e.useMemo(() => c && b ? qe(t, b) : void 0, [c, b, t]), { width: k, height: E } = ne(t, f?.layout), M = t.kind === "release-plan", S = !!t.signals?.length, [$, s] = e.useState(0), L = e.useRef(!1), z = e.useRef(null), [x, C] = e.useState(null), [y, F] = e.useState(null), [B, oe] = e.useState(null), P = !a && y?.source === t ? y : null, ae = e.useRef(t), A = e.useCallback((d) => {
    (M || S) && C(d), n?.(d);
  }, [M, S, n]), q = e.useCallback(() => {
    L.current = !1, z.current = null, F(null), A(null), s((d) => d + 1);
  }, [A]);
  e.useLayoutEffect(() => {
    ae.current !== t && (L.current || y) && q(), ae.current = t;
  }, [t, y, q]);
  const K = (d, v) => {
    L.current = !1, F(null), A(null), d !== t && (M && !r && oe({ before: t, after: d }), u(d, v));
  }, Ee = (d) => {
    const v = d.cards.find((D) => D.id === z.current);
    K(d, v && { cardId: v.id, laneId: v.laneId });
  }, ye = e.useCallback((d) => {
    const v = d.type === "dragging" ? d : d.pendingDrag?.status;
    L.current = !!v, v ? (z.current = v.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, F(null)) : z.current !== null && (z.current = null, A(null));
  }, [A]);
  e.useEffect(() => {
    function d(v) {
      !L.current && !y || v instanceof KeyboardEvent && v.key !== "Escape" || q();
    }
    return document.addEventListener("keydown", d), document.addEventListener("pointercancel", d), window.addEventListener("blur", d), () => {
      document.removeEventListener("keydown", d), document.removeEventListener("pointercancel", d), window.removeEventListener("blur", d);
    };
  }, [q, y]);
  const V = a ? null : P?.next ?? x, U = !!(a || P), ke = e.useMemo(() => f ? (d) => re(d, U, f) : U ? je : Ve, [f, U]), xe = V ? Math.max(E, ne(V, f?.layout).height) : E;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: i,
      style: { maxWidth: "100%", overflowX: "auto" },
      onPointerDownCapture: (d) => {
        const v = d.target.closest("[data-workshop-card]")?.getAttribute("data-workshop-card");
        p.current = !a && o && v && d.isPrimary && d.button === 0 ? { id: v, x: d.clientX, y: d.clientY } : null;
      },
      onPointerMoveCapture: (d) => {
        p.current && Math.hypot(d.clientX - p.current.x, d.clientY - p.current.y) > 5 && (p.current = null, g.current = null);
      },
      onPointerCancelCapture: () => {
        p.current = null, g.current = null;
      },
      onPointerUpCapture: (d) => {
        const v = p.current;
        p.current = null, !(!v || !o || a) && (g.current?.id === v.id && d.timeStamp - g.current.at < 400 ? (g.current = null, o(v.id)) : g.current = { id: v.id, at: d.timeStamp });
      }
    },
    /* @__PURE__ */ e.createElement(
      Q,
      {
        key: a ? "read-only" : $,
        draggable: ke,
        state: P?.next ?? t,
        onDropState: a ? void 0 : Ee,
        onDragState: a ? void 0 : A,
        onDragStatus: ye,
        width: k,
        height: xe
      }
    )
  ), S && h && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Le(V ?? t).map((d) => /* @__PURE__ */ e.createElement("p", { key: d.id }, /* @__PURE__ */ e.createElement("strong", null, d.label), /* @__PURE__ */ e.createElement("br", null), d.text))), M && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Ne, { value: t, preview: V }), !a && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    Ae,
    {
      value: t,
      preview: P?.move ?? null,
      stage: (d, v) => {
        F({ source: t, next: d, move: v }), n?.(d);
      },
      cancel: q,
      apply: () => {
        P && (K(P.next, P.move), A(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(r ? m : B?.after === t), onClick: () => {
    q(), r ? r() : B?.after === t && (oe(null), u(B.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((d) => {
    const v = t.lanes.find((D) => D.id === d.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: d.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, d.label, " · ", v.label), /* @__PURE__ */ e.createElement("br", null), v.station.outcome), Z(t, d).filter((D) => D.id !== d.laneId).map((D) => /* @__PURE__ */ e.createElement("button", { key: D.id, type: "button", disabled: a, onClick: () => K(J(t, d.id, D.id), { cardId: d.id, laneId: D.id }) }, d.label, " → ", D.label)));
  })), !M && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((d) => /* @__PURE__ */ e.createElement("label", { key: d.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, d.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: a,
      "aria-label": "Move " + d.label,
      value: P?.move.cardId === d.id ? P.move.laneId : d.laneId,
      onChange: (v) => {
        const D = { cardId: d.id, laneId: v.currentTarget.value }, j = J(t, d.id, D.laneId);
        S ? j === t ? q() : (F({ source: t, next: j, move: D }), n?.(j)) : K(j, D);
      }
    },
    Z(t, d).map((v) => /* @__PURE__ */ e.createElement("option", { key: v.id, value: v.id }, v.label))
  ))), P && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => K(P.next, P.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: q }, "Cancel move"))));
}
export {
  Oe as FocusDarkroomBoard,
  Je as ListeningRoomBoard,
  Ue as MoonGalleryBoard,
  Ze as OfflineHandoffBoard,
  Ne as ReleasePlanReadout,
  et as WorkshopBoard,
  Z as availableLanes,
  te as canHangPanel,
  rt as decodeWorkshopFragment,
  ot as describeFocusDarkroom,
  at as encodeWorkshopFragment,
  le as handoffSummary,
  Y as hangGalleryPanel,
  lt as industrialWorkshop,
  it as initialFocusDarkroom,
  Se as laneColors,
  se as listeningRoom,
  ce as listeningRoomCaption,
  st as moonGallery,
  J as moveWorkshopCard,
  ct as nightTransfer,
  dt as normalizeFocusDarkroom,
  ft as normalizeListeningRoom,
  ut as normalizeMoonGallery,
  mt as normalizeOfflineHandoff,
  $e as offlineHandoff,
  H as printFields,
  he as releaseLoad,
  pt as releasePlan,
  ie as resolveHandoff,
  Le as resolveWorkshopSignals,
  X as reviewHandoff,
  ht as validateWorkshop,
  ee as workshopLayout,
  ne as workshopPositions,
  gt as workshopPresentationLanes,
  bt as workshopPresentationScenes,
  Et as workshopToSlate
};
