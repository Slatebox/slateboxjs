import e, { useState as F, useRef as q, useMemo as fe, useLayoutEffect as Y, useEffect as K, useId as ye } from "react";
import { DraggableRenderer as T, translate as D, param as ke, inOrder as xe } from "./dragology.mjs";
import { handoffSummary as re, reviewHandoff as j, resolveHandoff as oe, offlineHandoff as we, listeningRoom as ae, listeningRoomCaption as le, workshopLayout as O, releaseLoad as me, availableLanes as _, moveWorkshopCard as Z, canHangPanel as ee, hangGalleryPanel as X, printFields as A, workshopPositions as te, resolveWorkshopSignals as ve, laneColors as Me } from "./workshop-model.mjs";
import { decodeWorkshopFragment as et, describeFocusDarkroom as tt, encodeWorkshopFragment as nt, industrialWorkshop as rt, initialFocusDarkroom as ot, moonGallery as at, nightTransfer as lt, normalizeFocusDarkroom as it, normalizeListeningRoom as st, normalizeMoonGallery as ct, normalizeOfflineHandoff as dt, releasePlan as ft, validateWorkshop as mt, workshopPresentationLanes as ut, workshopPresentationScenes as pt, workshopToSlate as ht } from "./workshop-model.mjs";
function $e(t, m, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${m}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + o, d: `M59 ${o}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function Le(t, m) {
  const n = t ? 9 : 49, o = t ? 20 : 23, r = t ? 144 : 181, d = t ? 183 : 370, i = t ? 35 : 40, a = t ? 164 : 255, u = t ? 119 : 147, l = 45, b = (h, g, x, c, f = "#243c32", E = "normal", k = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: D(h, g), fill: f, fontSize: c, fontFamily: k, fontWeight: E }, x);
  return ({ state: h, d: g, draggedId: x }) => {
    const c = h.stage === "queued", f = h.stage === "resolved", E = d + (a - u) / 2, k = i + 138, $ = c ? n + (r - u) / 2 : E, M = c ? o + 141 : k, v = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + r - 2} ${o + 180} C${n + r + 45} ${o + 235},${d - 24} ${i + 204},${d + 22} ${i + 159}`, fill: "none", stroke: c ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: c ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: D(n, o) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: r, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: r, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: r - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), b(13, 27, "17:08", 9, v, "bold"), b(r - 50, 27, c ? "Offline" : "Online", 10, c ? "#835420" : "#266451", "bold"), b(13, 47, "Field log", t ? 18 : 20, v, "bold"), $e(13, 55, (r - 26) / 142), b(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, v), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: D(d, i) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${a - 5} -3 5 190 -${a - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${a - 1} -3 3 183 -${a - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((s) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + s, cx: "8", cy: s, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), b(23, 38, c ? "SHIFT HANDOFF" : f ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), b(22, 69, "Gate B", t ? 30 : 37, v, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${a - 42}`, stroke: "#bfc5b1" }), b(23, 101, (f && h.choice === "field" ? h.fieldNote : h.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, v, "bold"), b(23, 120, f && h.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: D((a - u) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: u, height: l, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), b(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: D($, M),
        dragologyZIndex: x === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !m && c ? () => g.closest([h, j(h)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${u - 2}v${l - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${u}v${l - 7}l-7 7H0z`, fill: f ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${u - 7} ${l}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((s) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + s, cx: "8", cy: s, r: "1.3", fill: "#84662e" })),
      b(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      b(17, 34, f ? "Reviewed" : h.fieldNote === we.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const Se = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function Xe({ value: t, onChange: m, readOnly: n = !1 }) {
  const [o, r] = F(null), [d, i] = F(null), [a, u] = F(0), [l, b] = F(!1), [h, g] = F(1), x = q(null), c = q(!1), f = q(t), E = fe(() => Le(l, n), [l, n]), k = n ? t : d ?? o ?? t, $ = t.stage === "queued" && k.stage === "review";
  function M() {
    c.current = !1, i(null), r(null), u((s) => s + 1);
  }
  function v(s) {
    M(), !n && s.stage !== t.stage && m?.(s);
  }
  return Y(() => {
    (c.current || d) && (n || f.current !== t) && M(), f.current = t;
  }, [t, n, d]), Y(() => {
    const s = () => {
      const W = x.current.clientWidth;
      b(W < 510), g(Math.min(1, W / (W < 510 ? 360 : 685)));
    };
    s();
    const L = new ResizeObserver(s);
    return L.observe(x.current), () => L.disconnect();
  }, []), K(() => {
    function s(L) {
      (c.current || d) && (!(L instanceof KeyboardEvent) || L.key === "Escape") && M();
    }
    return document.addEventListener("keydown", s), document.addEventListener("pointercancel", s), window.addEventListener("blur", s), () => {
      document.removeEventListener("keydown", s), document.removeEventListener("pointercancel", s), window.removeEventListener("blur", s);
    };
  }, [d]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, Se), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: x, style: { "--drawing-scale": h } }, /* @__PURE__ */ e.createElement(
    T,
    {
      key: n ? "read-only" : a,
      state: d ?? t,
      draggable: E,
      width: l ? 360 : 685,
      height: l ? 254 : 262,
      onDragState: n ? void 0 : (s) => {
        c.current = !0, r(s.stage !== t.stage && t.stage === "queued" ? s : null);
      },
      onDropState: n ? void 0 : v
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (k.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", k.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, re(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, $ ? "The two access reports disagree." : re(t)), !n && (t.stage === "queued" ? $ ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(j(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: M }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => i(j(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(oe(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => v(oe(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(j(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => v({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function ze() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const m = new t(), n = m.sampleRate, o = n * 4, r = m.createBuffer(1, o, n), d = m.createBuffer(1, o, n), i = r.getChannelData(0), a = d.getChannelData(0);
  let u = 419;
  function l() {
    return u = 1664525 * u + 1013904223 >>> 0, u / 4294967296;
  }
  for (let h = 0; h < 100; h++) {
    const g = Math.floor(l() * o), x = 380 + l() * 1500, c = 0.09 + l() * 0.08;
    for (let f = 0; f < n * 0.12; f++) {
      const E = f / n, k = Math.sin(2 * Math.PI * x * E) + 0.22 * (l() * 2 - 1);
      i[(g + f) % o] += c * Math.exp(-E * 76) * k;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((h, g) => {
    const x = Math.floor((g * 0.93 + 0.1) * n);
    for (let c = 0; c < n * 1.6; c++) {
      const f = c / n, E = Math.sin(f * h * 2 * Math.PI) + 0.23 * Math.sin(f * h * 5.42 * Math.PI);
      a[(x + c) % o] += 0.16 * Math.min(1, f * 250) * Math.exp(-f * 3.3) * E;
    }
  });
  const b = [r, d].map((h) => {
    const g = m.createBufferSource(), x = m.createGain();
    return x.gain.value = 0, g.buffer = h, g.loop = !0, g.connect(x).connect(m.destination), g.start(), x;
  });
  return {
    ctx: m,
    mix(h) {
      b[0].gain.setTargetAtTime(Math.cos(h * Math.PI / 2), m.currentTime, 0.035), b[1].gain.setTargetAtTime(Math.sin(h * Math.PI / 2), m.currentTime, 0.035);
    },
    stop() {
      m.close();
    }
  };
}
function ue({ state: t, d: m, isTracking: n }, o) {
  const r = t.mix, d = 106 + 420 * r, i = D(d, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: i }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (a, u) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + u, cx: 18 + u * 137 % 604, cy: 12 + u * 47 % 103, r: u % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - r * 0.45 }, Array.from({ length: 30 }, (a, u) => {
    const l = 29 + u * 31 % 184, b = 24 + u * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + u, d: `M${l} ${b}l-3 8`, stroke: u % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: u % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + a, d: `M${39 + a * 15} ${116 + a * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + a, d: `M${65 + a * 35} ${177 - a * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + r * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((a) => {
    const u = 407 + a * 32, l = 63 - a % 3 * 4, b = 52 + (a + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + a, transform: D(u, l) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${b}l-8 5-8-6z`, fill: a % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${b + 7}l7-5V13z`, fill: a % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${b - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: r })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: i, dragologyOnDrag: o ? void 0 : () => m.vary(t, ke("mix"), { constraint: (a) => xe([0, a.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + r * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const Ce = (t) => ue(t, !1), We = (t) => ue(t, !0), De = `
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
function Ye({ value: t, onChange: m, readOnly: n = !1 }) {
  const o = q(null), r = q(null), [d, i] = F(null), [a, u] = F(0), [l, b] = F(1), [h, g] = F(!1), [x, c] = F(!1), f = d ?? t, E = q(t), k = q(!1);
  function $() {
    k.current = !1, i(null), u((y) => y + 1);
  }
  Y(() => {
    k.current && (n || t !== E.current) && $(), E.current = t;
  }, [t, n]), Y(() => {
    const y = o.current, C = () => b(Math.min(1, y.clientWidth / 640));
    C();
    const w = new ResizeObserver(C);
    return w.observe(y), () => w.disconnect();
  }, []), K(() => {
    function y(C) {
      k.current && (!(C instanceof KeyboardEvent) || C.key === "Escape") && $();
    }
    return document.addEventListener("keydown", y), document.addEventListener("pointercancel", y), window.addEventListener("blur", y), () => {
      document.removeEventListener("keydown", y), document.removeEventListener("pointercancel", y), window.removeEventListener("blur", y);
    };
  }, []);
  function M(y) {
    k.current = !1, i(null), !n && y !== t.mix && m?.({ ...t, mix: y });
  }
  function v() {
    r.current?.stop(), r.current = null, g(!1);
  }
  K(() => {
    r.current?.mix(f.mix);
  }, [f.mix]), K(() => {
    const y = new IntersectionObserver(([w]) => {
      w.isIntersecting || v();
    });
    y.observe(o.current);
    const C = () => {
      document.hidden && v();
    };
    return document.addEventListener("visibilitychange", C), () => {
      y.disconnect(), document.removeEventListener("visibilitychange", C), r.current?.stop(), r.current = null;
    };
  }, []);
  async function s() {
    if (r.current) {
      v();
      return;
    }
    try {
      const y = ze();
      r.current = y, y.mix(f.mix), await y.ctx.resume(), r.current === y && g(!0);
    } catch {
      v(), c(!0);
    }
  }
  const L = t.leftLabel === ae.leftLabel ? "rain" : t.leftLabel, W = t.rightLabel === ae.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, De), /* @__PURE__ */ e.createElement(
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
      "aria-valuenow": Math.round(f.mix * 100),
      "aria-valuetext": le(f),
      onKeyDown: (y) => {
        if (n) return;
        const C = {
          ArrowLeft: f.mix - 0.01,
          ArrowRight: f.mix + 0.01,
          ArrowDown: f.mix - 0.01,
          ArrowUp: f.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(C, y.key) && (y.preventDefault(), M(Math.round(100 * Math.min(1, Math.max(0, C[y.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      T,
      {
        key: n ? "read-only" : a,
        state: t,
        draggable: n ? We : Ce,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (y) => {
          k.current = y !== null, i(y);
        },
        onDropState: n ? void 0 : (y) => M(y.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(0) }, "Listen to ", L), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(1) }, "Listen to ", W)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, le(f))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: s, "aria-pressed": h, disabled: x }, x ? "Audio unavailable" : h ? "Mute sound" : "Enable sound")));
}
function Ie(t, m, n) {
  const o = [];
  let r = "";
  for (const d of t.split(/\s+/u)) {
    const i = r ? r + " " + d : d;
    if (n.measureText(i).width <= m) {
      r = i;
      continue;
    }
    r && o.push(r), r = "";
    for (const a of d)
      r && n.measureText(r + a).width > m && (o.push(r), r = ""), r += a;
  }
  return r && o.push(r), o;
}
function Fe(t, m) {
  const n = Math.min(O.pitch, Math.max(124, Math.floor(m / t.lanes.length))), o = n - 16, r = document.createElement("canvas").getContext("2d"), d = /* @__PURE__ */ new Map();
  function i(b, h, g) {
    r.font = g;
    let x = 1;
    for (const c of b) {
      const f = Ie(c.label, o - 25, r);
      d.set(h + c.id, f), x = Math.max(x, f.length);
    }
    return x;
  }
  const a = i(t.lanes, "heading-", "bold 13px system-ui, sans-serif"), u = i(t.cards, "choice-", "14px system-ui, sans-serif"), l = Math.max(O.height, 16 * u + 14);
  return { labels: d, layout: { pitch: n, width: o, height: l, row: l + 12, top: 16 * a + 45 } };
}
function qe({ value: t, preview: m }) {
  const n = m ?? t, o = new Map(n.lanes.map((i) => [i.id, i.label])), r = new Map(n.cards.map((i) => [i.id, i])), d = n.cards.flatMap((i) => (i.dependsOn ?? []).map((a) => ({ feature: i, prerequisite: r.get(a) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((i) => i.capacity !== void 0).map((i) => {
    const a = me(n, i.id);
    return /* @__PURE__ */ e.createElement("div", { key: i.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, i.label), /* @__PURE__ */ e.createElement("output", { "aria-label": i.label + " capacity" }, a, " / ", i.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": i.label + " point budget", min: 0, max: i.capacity, value: a, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), d.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, d.map(({ feature: i, prerequisite: a }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([i.id, a.id]) }, /* @__PURE__ */ e.createElement("strong", null, i.label), " needs ", a.label, " · ", o.get(a.laneId))))), m && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((i) => t.cards.find((a) => a.id === i.id)?.laneId !== i.laneId).map((i) => i.label + " → " + o.get(i.laneId)).join(" · ")));
}
function Ne({ value: t, preview: m, stage: n, apply: o, cancel: r }) {
  const [d, i] = F(t.cards[0].id), a = t.cards.find((l) => l.id === d) ?? t.cards[0], u = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (l) => {
    l.key === "Escape" && (r(), l.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: u }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: u, value: a.id, onChange: (l) => {
    i(l.target.value), r();
  } }, t.cards.map((l) => /* @__PURE__ */ e.createElement("option", { key: l.id, value: l.id }, l.label))), /* @__PURE__ */ e.createElement("div", null, _(t, a).filter((l) => l.id !== a.laneId).map((l) => /* @__PURE__ */ e.createElement("button", { key: l.id, type: "button", onClick: () => n(Z(t, a.id, l.id), { cardId: a.id, laneId: l.id }) }, "Preview ", l.label))), m && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: o }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: r }, "Cancel preview")));
}
const ie = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], Re = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], R = 148, B = 104;
function Pe(t) {
  const m = (n, o, r) => {
    const d = Array.from({ length: 38 }, (i, a) => {
      const u = Math.min(R, 4 * a), l = t * R + u, b = n + o * (Math.sin(l / 46) + 0.39 * Math.cos(l / 19) + 0.09 * Math.sin(l / 7));
      return (a ? "L" : "M") + u + " " + b.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: d + `L${R} ${B}H0z`, fill: r });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: R + 8, height: B + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: R + 4, height: B + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: R, height: B, fill: "#343b66" }), Array.from({ length: 13 }, (n, o) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + o, cx: 6 + (o * 77 + t * 19) % 136, cy: 4 + (o * 29 + t * 11) % 35, r: o % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), m(48, 7, "#9b88aa"), m(59, 10, "#bf9492"), m(75, 7, "#596d83"), m(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + o, d: `M${4 + (o * 37 + t * 13) % 124} ${92 + o * 3 % 10}h${4 + o % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Ae(t, m) {
  return ({ state: n, d: o, draggedId: r, isTracking: d }) => {
    const i = (l) => l === 1 ? "panorama-panel" : "gallery-panel-" + l, a = (l) => (n.hung.includes(n.panels[l].id) ? ie : Re)[l], u = n.panels.findIndex((l, b) => i(b) === r);
    if (d && u >= 0) {
      const l = a(u);
      return /* @__PURE__ */ e.createElement("g", { id: i(u), transform: D(l.x, l.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + l, d: `M${40 + 83 * l} 225l${(l - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((l) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + l, transform: D(163 + l * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((l, b) => {
      const h = ie[b], g = a(b), x = !t && (!m || m.includes(l.id)) && ee(n, l.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: l.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: b === 1 ? "gallery-hook" : "gallery-hook-" + b,
          x: h.x,
          y: h.y,
          width: R,
          height: B,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: h.x + R / 2, cy: h.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: i(b),
          transform: D(g.x, g.y),
          dragologyZIndex: r === i(b) ? "/1" : !1,
          dragologyOnDrag: x ? () => o.between([n, X(n, l.id)]) : void 0
        },
        Pe(["dunes", "moon", "coast"].indexOf(l.artwork))
      ));
    }));
  };
}
function _e({ value: t, onChange: m, onPreview: n, readOnly: o = !1, enabledIds: r }) {
  const d = e.useRef(null), [i, a] = e.useState(1), [u, l] = e.useState(0), [b, h] = e.useState(null), g = e.useRef(t);
  g.current = t;
  const x = e.useMemo(() => Ae(o, r), [o, r]), c = (s) => {
    h(s), n?.(s);
  }, f = e.useRef(n);
  f.current = n;
  const E = e.useCallback(() => {
    h(null), f.current?.(null), l((s) => s + 1);
  }, []);
  e.useEffect(() => {
    const s = new ResizeObserver(() => {
      d.current && a(Math.min(1, d.current.clientWidth / 640));
    });
    return s.observe(d.current), () => s.disconnect();
  }, []), e.useEffect(() => {
    E();
    const s = (L) => {
      L.key === "Escape" && E();
    };
    return document.addEventListener("keydown", s), window.addEventListener("blur", E), () => {
      document.removeEventListener("keydown", s), window.removeEventListener("blur", E);
    };
  }, [t, o, E]);
  function k(s) {
    if (c(null), o || g.current !== t) return;
    const L = s.hung.find((W) => !t.hung.includes(W));
    L && (!r || r.includes(L)) && ee(t, L) && m(X(t, L));
  }
  const $ = b ?? t, M = $.panels.find((s) => $.hung.includes(s.id) && !t.hung.includes(s.id)), v = t.panels.filter((s) => !t.hung.includes(s.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: d, onPointerCancel: E, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: i, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    T,
    {
      key: u,
      draggable: x,
      width: 640,
      height: 300,
      state: t,
      onDragState: c,
      onDropState: k
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, $.panels.map((s, L) => /* @__PURE__ */ e.createElement("svg", { key: s.id, x: L * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: $.hung.includes(s.id) ? "#343b66" : "#c7b8a8" }), $.hung.includes(s.id) && /* @__PURE__ */ e.createElement("g", null, s.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: s.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : s.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, M ? M.label + " lines up with its hook." : v.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !o && v.filter((s) => (!r || r.includes(s.id)) && ee(t, s.id)).map((s) => /* @__PURE__ */ e.createElement("button", { key: s.id, type: "button", onFocus: () => c(X(t, s.id)), onBlur: () => c(null), onClick: () => k(X(t, s.id)) }, "Hang ", s.label)));
}
const He = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", U = { start: 99, opener: 361 }, Be = { route: null }, se = "#ffcb62";
function ce(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((m) => /* @__PURE__ */ e.createElement("g", { key: m, transform: "scale(" + m + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (m, n) => {
    const o = 33 - n * 6, r = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${o}q${-r} -2 ${-r - 4} -15q${r} 1 ${r + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${o - 3}q${r - 1} -3 ${r + 2} -15q${-r} 3 ${-r - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (m, n) => {
    const o = (n - 5.5) * 6, r = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${o * 0.35} 6 ${o} ${r}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((d) => /* @__PURE__ */ e.createElement("path", { key: d, d: `M${o * d / 5} ${35 + (r - 35) * d / 5}q${o * 0.15 - 5} -4 ${o * 0.25 - 7} -13m${7 - o * 0.25} 13q6 -6 7 -13` })));
  }));
}
function pe({ state: t, d: m, isTracking: n }, o = !1) {
  const r = t.route ? U[t.route] : 232, d = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(r, d) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [U.start, U.opener].map((i, a) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(i) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${i} 85 ${i} 48V0`, fill: "none", stroke: t.route === "start" && a === 0 || t.route === "opener" && a === 1 ? se : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: a ? "opener-jack" : "first-jack", cx: i, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: i, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, a ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(r, d), dragologyOnDrag: o ? void 0 : () => m.closest([Be, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: se, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Ke(t) {
  return pe(t, !0);
}
function Ze({ value: t, onChange: m, readOnly: n = !1 }) {
  const o = n || !m, [r, d] = F(null), [i, a] = F(0), [u, l] = F(1), [b, h] = F(""), [g, x] = F(null), [c, f] = F(1), E = q(null), k = q(null), $ = q([]), M = ye(), v = fe(() => ({ route: t.route }), [t.route]), s = (!o && r ? r : v).route;
  K(() => {
    const w = E.current, z = new ResizeObserver(() => f(Math.min(1, w.clientWidth / 460)));
    return z.observe(w), () => z.disconnect();
  }, []);
  function L(w) {
    o || (d(null), h(""), m?.({ ...t, route: w.route }));
  }
  function W(w) {
    l(w), x(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), k.current?.showModal();
  }
  function y() {
    const w = t.route === "start" ? 0 : u;
    $.current[w]?.focus({ preventScroll: !0 });
    const z = t[A[w]];
    h(w === u ? "Focus returned to " + z + ", the print you opened." : "Focus jumped to " + z + ". You opened " + t[A[u]] + ".");
  }
  function C() {
    a((w) => w + 1), d(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": o || void 0,
      onPointerCancel: C,
      onKeyDown: (w) => {
        w.key === "Escape" && !k.current?.open && C();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, He),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, o ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, A.map((w, z) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: w,
        ref: (G) => {
          $.current[z] = G;
        },
        "aria-label": "Open " + t[w],
        onClick: () => W(z)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ce(z)),
      /* @__PURE__ */ e.createElement("span", null, t[w])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: E, style: { "--circuit-scale": c } }, /* @__PURE__ */ e.createElement(
      T,
      {
        key: o ? "locked" : i,
        state: v,
        width: 460,
        height: 108,
        draggable: o ? Ke : pe,
        onDragState: o ? void 0 : d,
        onDropState: o ? void 0 : L
      }
    )),
    !o && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": s === "start", onClick: () => L({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": s === "opener", onClick: () => L({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, s === "start" ? "Every viewer returns to the first print." : s === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, b || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: k, onClose: y, "aria-labelledby": M, onKeyDown: (w) => {
      w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), w.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ce(u)), /* @__PURE__ */ e.createElement("h2", { id: M }, t[A[u]]), !o && g !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (w) => {
      w.preventDefault(), g.trim() && (m?.({ ...t, [A[u]]: g.trim() }), x(null), k.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: g, onChange: (w) => x(w.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !g.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => x(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => k.current?.close() }, "Close viewer"), !o && g === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => x(t[A[u]]) }, "Rename print"))
  );
}
function de(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((m) => m.trim()) ?? [t];
}
function ne({ state: t, d: m, draggedId: n, isTracking: o }, r, d) {
  const i = d?.layout ?? O, { width: a, row: u, height: l, top: b } = i, { points: h } = te(t, i), g = !!t.lanes[0].station, x = (c) => {
    const f = t.lanes.findIndex((k) => k.id === c.laneId), E = t.cards.filter((k) => k.laneId === c.laneId).indexOf(c);
    return D((g ? 18 : 8) + h[f].x, h[f].y + b + E * u);
  };
  if (o && n) {
    const c = t.cards.find((f) => "choice-" + f.id === n);
    if (c) return /* @__PURE__ */ e.createElement("g", { id: n, transform: x(c) });
  }
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((c, f) => (c.station?.next ?? []).map((E) => {
    const k = h[f], $ = h[t.lanes.findIndex((w) => w.id === E)], M = a / 2 + 8, v = (b - 12) / 2 + 4, s = $.x - k.x, L = $.y - k.y, W = Math.min(s ? a / 2 / Math.abs(s) : 1 / 0, L ? (v - 4) / Math.abs(L) : 1 / 0), y = $.x + M - s * W, C = $.y + v - L * W;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: c.id + "-" + E }, /* @__PURE__ */ e.createElement("line", { x1: k.x + M, y1: k.y + v, x2: y, y2: C, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${y} ${C}) rotate(${Math.atan2(L, s) * 180 / Math.PI})` }));
  })), t.lanes.map((c, f) => {
    const E = t.cards.filter((M) => M.laneId === c.id).length, k = t.kind === "release-plan" && me(t, c.id), $ = t.kind === "release-plan" ? k + (c.capacity ? " / " + c.capacity : "") + " points" : c.station ? E ? "● Occupied" : "Open stop" : c.capacity ? `${E} of ${c.capacity} slots` : `${E} ${E === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + c.id, transform: D(8 + h[f].x, 4 + h[f].y) }, g && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: a, height: b + Math.max(1, E) * u - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: b - 12, rx: g ? 6 : 9, fill: g ? "#253c36" : Me[f] }), (d?.labels.get("heading-" + c.id) ?? de(c.label)).map((M, v) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + v, fill: g ? "#fffdf3" : "#18302d", transform: D(12, (g ? 23 : 16) + v * 16), fontSize: g ? 17 : 13, fontWeight: "bold" }, M)), /* @__PURE__ */ e.createElement("text", { fill: g ? "#ebd29a" : "#18302d", transform: D(12, b - 23), fontSize: 12 }, $));
  }), t.cards.map((c) => {
    const f = r ? [] : _(t, c), E = "choice-" + c.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: E,
        transform: x(c),
        dragologyZIndex: n === E ? "/1" : !1,
        dragologyOnDrag: f.length > 1 ? () => m.closest(f.map((k) => Z(t, c.id, k.id))).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: g ? a - 20 : a, height: l - (g ? 6 : 0), fill: g ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: g ? 1 : 8 }),
      g && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: D(12, l - 10), fill: "#466358", fontSize: 12 }, c.points, " pts"),
      (d?.labels.get(E) ?? de(c.label)).map((k, $) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + $, transform: D(12, 17 + $ * 16), fontSize: 14 }, k))
    );
  }));
}
const Te = (t) => ne(t, !1), Ge = (t) => ne(t, !0);
function Je({ value: t, onChange: m, onPreview: n, onUndo: o, canUndo: r, readOnly: d = !1, fitLanes: i = !1, showPlacementOutcomes: a = !0 }) {
  const u = e.useRef(null), [l, b] = e.useState(0), h = i && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const p = u.current;
    if (!h || !p) return;
    const S = () => b(p.clientWidth);
    S();
    const I = new ResizeObserver(S);
    return I.observe(p), () => I.disconnect();
  }, [h]);
  const g = e.useMemo(() => h && l ? Fe(t, l) : void 0, [h, l, t]), { width: x, height: c } = te(t, g?.layout), f = t.kind === "release-plan", E = !!t.signals?.length, [k, $] = e.useState(0), M = e.useRef(!1), v = e.useRef(null), [s, L] = e.useState(null), [W, y] = e.useState(null), [C, w] = e.useState(null), z = !d && W?.source === t ? W : null, G = e.useRef(t), P = e.useCallback((p) => {
    (f || E) && L(p), n?.(p);
  }, [f, E, n]), N = e.useCallback(() => {
    M.current = !1, v.current = null, y(null), P(null), $((p) => p + 1);
  }, [P]);
  e.useLayoutEffect(() => {
    G.current !== t && (M.current || W) && N(), G.current = t;
  }, [t, W, N]);
  const H = (p, S) => {
    M.current = !1, y(null), P(null), p !== t && (f && !o && w({ before: t, after: p }), m(p, S));
  }, he = (p) => {
    const S = p.cards.find((I) => I.id === v.current);
    H(p, S && { cardId: S.id, laneId: S.laneId });
  }, ge = e.useCallback((p) => {
    const S = p.type === "dragging" ? p : p.pendingDrag?.status;
    M.current = !!S, S ? (v.current = S.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, y(null)) : v.current !== null && (v.current = null, P(null));
  }, [P]);
  e.useEffect(() => {
    function p(S) {
      !M.current && !W || S instanceof KeyboardEvent && S.key !== "Escape" || N();
    }
    return document.addEventListener("keydown", p), document.addEventListener("pointercancel", p), window.addEventListener("blur", p), () => {
      document.removeEventListener("keydown", p), document.removeEventListener("pointercancel", p), window.removeEventListener("blur", p);
    };
  }, [N, W]);
  const Q = d ? null : z?.next ?? s, J = !!(d || z), be = e.useMemo(() => g ? (p) => ne(p, J, g) : J ? Ge : Te, [g, J]), Ee = Q ? Math.max(c, te(Q, g?.layout).height) : c;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement("div", { ref: u, style: { maxWidth: "100%", overflowX: "auto" } }, /* @__PURE__ */ e.createElement(
    T,
    {
      key: d ? "read-only" : k,
      draggable: be,
      state: z?.next ?? t,
      onDropState: d ? void 0 : he,
      onDragState: d ? void 0 : P,
      onDragStatus: ge,
      width: x,
      height: Ee
    }
  )), E && a && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, ve(Q ?? t).map((p) => /* @__PURE__ */ e.createElement("p", { key: p.id }, /* @__PURE__ */ e.createElement("strong", null, p.label), /* @__PURE__ */ e.createElement("br", null), p.text))), f && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(qe, { value: t, preview: Q }), !d && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    Ne,
    {
      value: t,
      preview: z?.move ?? null,
      stage: (p, S) => {
        y({ source: t, next: p, move: S }), n?.(p);
      },
      cancel: N,
      apply: () => {
        z && (H(z.next, z.move), P(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(o ? r : C?.after === t), onClick: () => {
    N(), o ? o() : C?.after === t && (w(null), m(C.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((p) => {
    const S = t.lanes.find((I) => I.id === p.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: p.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, p.label, " · ", S.label), /* @__PURE__ */ e.createElement("br", null), S.station.outcome), _(t, p).filter((I) => I.id !== p.laneId).map((I) => /* @__PURE__ */ e.createElement("button", { key: I.id, type: "button", disabled: d, onClick: () => H(Z(t, p.id, I.id), { cardId: p.id, laneId: I.id }) }, p.label, " → ", I.label)));
  })), !f && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((p) => /* @__PURE__ */ e.createElement("label", { key: p.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, p.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: d,
      "aria-label": "Move " + p.label,
      value: z?.move.cardId === p.id ? z.move.laneId : p.laneId,
      onChange: (S) => {
        const I = { cardId: p.id, laneId: S.currentTarget.value }, V = Z(t, p.id, I.laneId);
        E ? V === t ? N() : (y({ source: t, next: V, move: I }), n?.(V)) : H(V, I);
      }
    },
    _(t, p).map((S) => /* @__PURE__ */ e.createElement("option", { key: S.id, value: S.id }, S.label))
  ))), z && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => H(z.next, z.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: N }, "Cancel move"))));
}
export {
  Ze as FocusDarkroomBoard,
  Ye as ListeningRoomBoard,
  _e as MoonGalleryBoard,
  Xe as OfflineHandoffBoard,
  qe as ReleasePlanReadout,
  Je as WorkshopBoard,
  _ as availableLanes,
  ee as canHangPanel,
  et as decodeWorkshopFragment,
  tt as describeFocusDarkroom,
  nt as encodeWorkshopFragment,
  re as handoffSummary,
  X as hangGalleryPanel,
  rt as industrialWorkshop,
  ot as initialFocusDarkroom,
  Me as laneColors,
  ae as listeningRoom,
  le as listeningRoomCaption,
  at as moonGallery,
  Z as moveWorkshopCard,
  lt as nightTransfer,
  it as normalizeFocusDarkroom,
  st as normalizeListeningRoom,
  ct as normalizeMoonGallery,
  dt as normalizeOfflineHandoff,
  we as offlineHandoff,
  A as printFields,
  me as releaseLoad,
  ft as releasePlan,
  oe as resolveHandoff,
  ve as resolveWorkshopSignals,
  j as reviewHandoff,
  mt as validateWorkshop,
  O as workshopLayout,
  te as workshopPositions,
  ut as workshopPresentationLanes,
  pt as workshopPresentationScenes,
  ht as workshopToSlate
};
