import e, { useState as F, useRef as B, useMemo as ve, useLayoutEffect as te, useEffect as Y, useId as De } from "react";
import { DraggableRenderer as _, translate as I, param as Ie, inOrder as Fe } from "./dragology.mjs";
import { handoffSummary as he, reviewHandoff as O, resolveHandoff as ge, offlineHandoff as Pe, listeningRoom as be, listeningRoomCaption as Ee, workshopLayout as se, releaseLoad as Me, availableLanes as ne, moveWorkshopCard as re, canHangPanel as ce, hangGalleryPanel as ee, printFields as G, workshopPositions as de, maxWorkshopCards as Be, resolveWorkshopSignals as Re, laneColors as qe } from "./workshop-model.mjs";
import { addWorkshopBranch as ut, addWorkshopCard as pt, addWorkshopLane as ht, createLaneWorkshop as gt, createWorkshopMap as bt, decodeWorkshopFragment as Et, describeFocusDarkroom as yt, encodeWorkshopFragment as kt, industrialWorkshop as xt, initialFocusDarkroom as wt, moonGallery as vt, nightTransfer as Mt, normalizeFocusDarkroom as $t, normalizeListeningRoom as Ct, normalizeMoonGallery as Lt, normalizeOfflineHandoff as St, releasePlan as Wt, validateWorkshop as zt, workshopPresentationLanes as Dt, workshopPresentationScenes as It, workshopToSlate as Ft } from "./workshop-model.mjs";
function Ae(t, f, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${f}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + l, d: `M59 ${l}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function He(t, f) {
  const n = t ? 9 : 49, l = t ? 20 : 23, r = t ? 144 : 181, m = t ? 183 : 370, c = t ? 35 : 40, s = t ? 164 : 255, u = t ? 119 : 147, a = 45, h = (b, $, y, p, g = "#243c32", x = "normal", C = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: I(b, $), fill: g, fontSize: p, fontFamily: C, fontWeight: x }, y);
  return ({ state: b, d: $, draggedId: y }) => {
    const p = b.stage === "queued", g = b.stage === "resolved", x = m + (s - u) / 2, C = c + 138, W = p ? n + (r - u) / 2 : x, d = p ? l + 141 : C, v = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + r - 2} ${l + 180} C${n + r + 45} ${l + 235},${m - 24} ${c + 204},${m + 22} ${c + 159}`, fill: "none", stroke: p ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: p ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: I(n, l) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: r, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: r, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: r - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), h(13, 27, "17:08", 9, v, "bold"), h(r - 50, 27, p ? "Offline" : "Online", 10, p ? "#835420" : "#266451", "bold"), h(13, 47, "Field log", t ? 18 : 20, v, "bold"), Ae(13, 55, (r - 26) / 142), h(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, v), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: I(m, c) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${s - 5} -3 5 190 -${s - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${s - 1} -3 3 183 -${s - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: s, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + i, cx: "8", cy: i, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), h(23, 38, p ? "SHIFT HANDOFF" : g ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), h(22, 69, "Gate B", t ? 30 : 37, v, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${s - 42}`, stroke: "#bfc5b1" }), h(23, 101, (g && b.choice === "field" ? b.fieldNote : b.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, v, "bold"), h(23, 120, g && b.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: I((s - u) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: u, height: a, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), h(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: I(W, d),
        dragologyZIndex: y === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !f && p ? () => $.closest([b, O(b)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${u - 2}v${a - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${u}v${a - 7}l-7 7H0z`, fill: g ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${u - 7} ${a}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + i, cx: "8", cy: i, r: "1.3", fill: "#84662e" })),
      h(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      h(17, 34, g ? "Reviewed" : b.fieldNote === Pe.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const Ne = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function lt({ value: t, onChange: f, readOnly: n = !1 }) {
  const [l, r] = F(null), [m, c] = F(null), [s, u] = F(0), [a, h] = F(!1), [b, $] = F(1), y = B(null), p = B(!1), g = B(t), x = ve(() => He(a, n), [a, n]), C = n ? t : m ?? l ?? t, W = t.stage === "queued" && C.stage === "review";
  function d() {
    p.current = !1, c(null), r(null), u((i) => i + 1);
  }
  function v(i) {
    d(), !n && i.stage !== t.stage && f?.(i);
  }
  return te(() => {
    (p.current || m) && (n || g.current !== t) && d(), g.current = t;
  }, [t, n, m]), te(() => {
    const i = () => {
      const L = y.current.clientWidth;
      h(L < 510), $(Math.min(1, L / (L < 510 ? 360 : 685)));
    };
    i();
    const k = new ResizeObserver(i);
    return k.observe(y.current), () => k.disconnect();
  }, []), Y(() => {
    function i(k) {
      (p.current || m) && (!(k instanceof KeyboardEvent) || k.key === "Escape") && d();
    }
    return document.addEventListener("keydown", i), document.addEventListener("pointercancel", i), window.addEventListener("blur", i), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("pointercancel", i), window.removeEventListener("blur", i);
    };
  }, [m]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, Ne), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: y, style: { "--drawing-scale": b } }, /* @__PURE__ */ e.createElement(
    _,
    {
      key: n ? "read-only" : s,
      state: m ?? t,
      draggable: x,
      width: a ? 360 : 685,
      height: a ? 254 : 262,
      onDragState: n ? void 0 : (i) => {
        p.current = !0, r(i.stage !== t.stage && t.stage === "queued" ? i : null);
      },
      onDropState: n ? void 0 : v
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (C.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", C.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, he(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, W ? "The two access reports disagree." : he(t)), !n && (t.stage === "queued" ? W ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(O(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: d }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => c(O(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(ge(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => v(ge(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => v(O(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => v({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function Ke() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const f = new t(), n = f.sampleRate, l = n * 4, r = f.createBuffer(1, l, n), m = f.createBuffer(1, l, n), c = r.getChannelData(0), s = m.getChannelData(0);
  let u = 419;
  function a() {
    return u = 1664525 * u + 1013904223 >>> 0, u / 4294967296;
  }
  for (let b = 0; b < 100; b++) {
    const $ = Math.floor(a() * l), y = 380 + a() * 1500, p = 0.09 + a() * 0.08;
    for (let g = 0; g < n * 0.12; g++) {
      const x = g / n, C = Math.sin(2 * Math.PI * y * x) + 0.22 * (a() * 2 - 1);
      c[($ + g) % l] += p * Math.exp(-x * 76) * C;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((b, $) => {
    const y = Math.floor(($ * 0.93 + 0.1) * n);
    for (let p = 0; p < n * 1.6; p++) {
      const g = p / n, x = Math.sin(g * b * 2 * Math.PI) + 0.23 * Math.sin(g * b * 5.42 * Math.PI);
      s[(y + p) % l] += 0.16 * Math.min(1, g * 250) * Math.exp(-g * 3.3) * x;
    }
  });
  const h = [r, m].map((b) => {
    const $ = f.createBufferSource(), y = f.createGain();
    return y.gain.value = 0, $.buffer = b, $.loop = !0, $.connect(y).connect(f.destination), $.start(), y;
  });
  return {
    ctx: f,
    mix(b) {
      h[0].gain.setTargetAtTime(Math.cos(b * Math.PI / 2), f.currentTime, 0.035), h[1].gain.setTargetAtTime(Math.sin(b * Math.PI / 2), f.currentTime, 0.035);
    },
    stop() {
      f.close();
    }
  };
}
function $e({ state: t, d: f, isTracking: n }, l) {
  const r = t.mix, m = 106 + 420 * r, c = I(m, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (s, u) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + u, cx: 18 + u * 137 % 604, cy: 12 + u * 47 % 103, r: u % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - r * 0.45 }, Array.from({ length: 30 }, (s, u) => {
    const a = 29 + u * 31 % 184, h = 24 + u * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + u, d: `M${a} ${h}l-3 8`, stroke: u % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: u % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + s, d: `M${39 + s * 15} ${116 + s * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + s, d: `M${65 + s * 35} ${177 - s * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + r * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((s) => {
    const u = 407 + s * 32, a = 63 - s % 3 * 4, h = 52 + (s + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + s, transform: I(u, a) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${h}l-8 5-8-6z`, fill: s % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${h + 7}l7-5V13z`, fill: s % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${h - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: r })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c, dragologyOnDrag: l ? void 0 : () => f.vary(t, Ie("mix"), { constraint: (s) => Fe([0, s.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + r * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const Te = (t) => $e(t, !1), Ge = (t) => $e(t, !0), Qe = `
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
function it({ value: t, onChange: f, readOnly: n = !1 }) {
  const l = B(null), r = B(null), [m, c] = F(null), [s, u] = F(0), [a, h] = F(1), [b, $] = F(!1), [y, p] = F(!1), g = m ?? t, x = B(t), C = B(!1);
  function W() {
    C.current = !1, c(null), u((E) => E + 1);
  }
  te(() => {
    C.current && (n || t !== x.current) && W(), x.current = t;
  }, [t, n]), te(() => {
    const E = l.current, S = () => h(Math.min(1, E.clientWidth / 640));
    S();
    const w = new ResizeObserver(S);
    return w.observe(E), () => w.disconnect();
  }, []), Y(() => {
    function E(S) {
      C.current && (!(S instanceof KeyboardEvent) || S.key === "Escape") && W();
    }
    return document.addEventListener("keydown", E), document.addEventListener("pointercancel", E), window.addEventListener("blur", E), () => {
      document.removeEventListener("keydown", E), document.removeEventListener("pointercancel", E), window.removeEventListener("blur", E);
    };
  }, []);
  function d(E) {
    C.current = !1, c(null), !n && E !== t.mix && f?.({ ...t, mix: E });
  }
  function v() {
    r.current?.stop(), r.current = null, $(!1);
  }
  Y(() => {
    r.current?.mix(g.mix);
  }, [g.mix]), Y(() => {
    const E = new IntersectionObserver(([w]) => {
      w.isIntersecting || v();
    });
    E.observe(l.current);
    const S = () => {
      document.hidden && v();
    };
    return document.addEventListener("visibilitychange", S), () => {
      E.disconnect(), document.removeEventListener("visibilitychange", S), r.current?.stop(), r.current = null;
    };
  }, []);
  async function i() {
    if (r.current) {
      v();
      return;
    }
    try {
      const E = Ke();
      r.current = E, E.mix(g.mix), await E.ctx.resume(), r.current === E && $(!0);
    } catch {
      v(), p(!0);
    }
  }
  const k = t.leftLabel === be.leftLabel ? "rain" : t.leftLabel, L = t.rightLabel === be.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, Qe), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: l,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": a },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": n,
      tabIndex: n ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(g.mix * 100),
      "aria-valuetext": Ee(g),
      onKeyDown: (E) => {
        if (n) return;
        const S = {
          ArrowLeft: g.mix - 0.01,
          ArrowRight: g.mix + 0.01,
          ArrowDown: g.mix - 0.01,
          ArrowUp: g.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(S, E.key) && (E.preventDefault(), d(Math.round(100 * Math.min(1, Math.max(0, S[E.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      _,
      {
        key: n ? "read-only" : s,
        state: t,
        draggable: n ? Ge : Te,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (E) => {
          C.current = E !== null, c(E);
        },
        onDropState: n ? void 0 : (E) => d(E.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(0) }, "Listen to ", k), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(1) }, "Listen to ", L)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, Ee(g))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: i, "aria-pressed": b, disabled: y }, y ? "Audio unavailable" : b ? "Mute sound" : "Enable sound")));
}
function je(t, f, n) {
  const l = [];
  let r = "";
  for (const m of t.split(/\s+/u)) {
    const c = r ? r + " " + m : m;
    if (n.measureText(c).width <= f) {
      r = c;
      continue;
    }
    r && l.push(r), r = "";
    for (const s of m)
      r && n.measureText(r + s).width > f && (l.push(r), r = ""), r += s;
  }
  return r && l.push(r), l;
}
function Ve(t, f) {
  const n = Math.min(se.pitch, Math.max(124, Math.floor(f / t.lanes.length))), l = n - 16, r = document.createElement("canvas").getContext("2d"), m = /* @__PURE__ */ new Map();
  function c(h, b, $) {
    r.font = $;
    let y = 1;
    for (const p of h) {
      const g = je(p.label, l - 25, r);
      m.set(b + p.id, g), y = Math.max(y, g.length);
    }
    return y;
  }
  const s = c(t.lanes, "heading-", "bold 13px system-ui, sans-serif"), u = c(t.cards, "choice-", "14px system-ui, sans-serif"), a = Math.max(se.height, 16 * u + 14);
  return { labels: m, layout: { pitch: n, width: l, height: a, row: a + 12, top: 16 * s + 45 } };
}
function Xe({ value: t, preview: f }) {
  const n = f ?? t, l = new Map(n.lanes.map((c) => [c.id, c.label])), r = new Map(n.cards.map((c) => [c.id, c])), m = n.cards.flatMap((c) => (c.dependsOn ?? []).map((s) => ({ feature: c, prerequisite: r.get(s) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((c) => c.capacity !== void 0).map((c) => {
    const s = Me(n, c.id);
    return /* @__PURE__ */ e.createElement("div", { key: c.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, c.label), /* @__PURE__ */ e.createElement("output", { "aria-label": c.label + " capacity" }, s, " / ", c.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": c.label + " point budget", min: 0, max: c.capacity, value: s, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), m.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, m.map(({ feature: c, prerequisite: s }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([c.id, s.id]) }, /* @__PURE__ */ e.createElement("strong", null, c.label), " needs ", s.label, " · ", l.get(s.laneId))))), f && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((c) => t.cards.find((s) => s.id === c.id)?.laneId !== c.laneId).map((c) => c.label + " → " + l.get(c.laneId)).join(" · ")));
}
function Ye({ value: t, preview: f, stage: n, apply: l, cancel: r }) {
  const [m, c] = F(t.cards[0].id), s = t.cards.find((a) => a.id === m) ?? t.cards[0], u = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (a) => {
    a.key === "Escape" && (r(), a.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: u }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: u, value: s.id, onChange: (a) => {
    c(a.target.value), r();
  } }, t.cards.map((a) => /* @__PURE__ */ e.createElement("option", { key: a.id, value: a.id }, a.label))), /* @__PURE__ */ e.createElement("div", null, ne(t, s).filter((a) => a.id !== s.laneId).map((a) => /* @__PURE__ */ e.createElement("button", { key: a.id, type: "button", onClick: () => n(re(t, s.id, a.id), { cardId: s.id, laneId: a.id }) }, "Preview ", a.label))), f && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: l }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: r }, "Cancel preview")));
}
const ye = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], _e = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], H = 148, X = 104;
function Ze(t) {
  const f = (n, l, r) => {
    const m = Array.from({ length: 38 }, (c, s) => {
      const u = Math.min(H, 4 * s), a = t * H + u, h = n + l * (Math.sin(a / 46) + 0.39 * Math.cos(a / 19) + 0.09 * Math.sin(a / 7));
      return (s ? "L" : "M") + u + " " + h.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: m + `L${H} ${X}H0z`, fill: r });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: H + 8, height: X + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: H + 4, height: X + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: H, height: X, fill: "#343b66" }), Array.from({ length: 13 }, (n, l) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + l, cx: 6 + (l * 77 + t * 19) % 136, cy: 4 + (l * 29 + t * 11) % 35, r: l % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), f(48, 7, "#9b88aa"), f(59, 10, "#bf9492"), f(75, 7, "#596d83"), f(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + l, d: `M${4 + (l * 37 + t * 13) % 124} ${92 + l * 3 % 10}h${4 + l % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Je(t, f) {
  return ({ state: n, d: l, draggedId: r, isTracking: m }) => {
    const c = (a) => a === 1 ? "panorama-panel" : "gallery-panel-" + a, s = (a) => (n.hung.includes(n.panels[a].id) ? ye : _e)[a], u = n.panels.findIndex((a, h) => c(h) === r);
    if (m && u >= 0) {
      const a = s(u);
      return /* @__PURE__ */ e.createElement("g", { id: c(u), transform: I(a.x, a.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + a, d: `M${40 + 83 * a} 225l${(a - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((a) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + a, transform: I(163 + a * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((a, h) => {
      const b = ye[h], $ = s(h), y = !t && (!f || f.includes(a.id)) && ce(n, a.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: a.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: h === 1 ? "gallery-hook" : "gallery-hook-" + h,
          x: b.x,
          y: b.y,
          width: H,
          height: X,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: b.x + H / 2, cy: b.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: c(h),
          transform: I($.x, $.y),
          dragologyZIndex: r === c(h) ? "/1" : !1,
          dragologyOnDrag: y ? () => l.between([n, ee(n, a.id)]) : void 0
        },
        Ze(["dunes", "moon", "coast"].indexOf(a.artwork))
      ));
    }));
  };
}
function st({ value: t, onChange: f, onPreview: n, readOnly: l = !1, enabledIds: r }) {
  const m = e.useRef(null), [c, s] = e.useState(1), [u, a] = e.useState(0), [h, b] = e.useState(null), $ = e.useRef(t);
  $.current = t;
  const y = e.useMemo(() => Je(l, r), [l, r]), p = (i) => {
    b(i), n?.(i);
  }, g = e.useRef(n);
  g.current = n;
  const x = e.useCallback(() => {
    b(null), g.current?.(null), a((i) => i + 1);
  }, []);
  e.useEffect(() => {
    const i = new ResizeObserver(() => {
      m.current && s(Math.min(1, m.current.clientWidth / 640));
    });
    return i.observe(m.current), () => i.disconnect();
  }, []), e.useEffect(() => {
    x();
    const i = (k) => {
      k.key === "Escape" && x();
    };
    return document.addEventListener("keydown", i), window.addEventListener("blur", x), () => {
      document.removeEventListener("keydown", i), window.removeEventListener("blur", x);
    };
  }, [t, l, x]);
  function C(i) {
    if (p(null), l || $.current !== t) return;
    const k = i.hung.find((L) => !t.hung.includes(L));
    k && (!r || r.includes(k)) && ce(t, k) && f(ee(t, k));
  }
  const W = h ?? t, d = W.panels.find((i) => W.hung.includes(i.id) && !t.hung.includes(i.id)), v = t.panels.filter((i) => !t.hung.includes(i.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: m, onPointerCancel: x, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: c, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    _,
    {
      key: u,
      draggable: y,
      width: 640,
      height: 300,
      state: t,
      onDragState: p,
      onDropState: C
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, W.panels.map((i, k) => /* @__PURE__ */ e.createElement("svg", { key: i.id, x: k * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: W.hung.includes(i.id) ? "#343b66" : "#c7b8a8" }), W.hung.includes(i.id) && /* @__PURE__ */ e.createElement("g", null, i.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: i.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : i.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, d ? d.label + " lines up with its hook." : v.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !l && v.filter((i) => (!r || r.includes(i.id)) && ce(t, i.id)).map((i) => /* @__PURE__ */ e.createElement("button", { key: i.id, type: "button", onFocus: () => p(ee(t, i.id)), onBlur: () => p(null), onClick: () => C(ee(t, i.id)) }, "Hang ", i.label)));
}
const Ue = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", ie = { start: 99, opener: 361 }, Oe = { route: null }, ke = "#ffcb62";
function xe(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((f) => /* @__PURE__ */ e.createElement("g", { key: f, transform: "scale(" + f + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (f, n) => {
    const l = 33 - n * 6, r = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${l}q${-r} -2 ${-r - 4} -15q${r} 1 ${r + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${l - 3}q${r - 1} -3 ${r + 2} -15q${-r} 3 ${-r - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (f, n) => {
    const l = (n - 5.5) * 6, r = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${l * 0.35} 6 ${l} ${r}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((m) => /* @__PURE__ */ e.createElement("path", { key: m, d: `M${l * m / 5} ${35 + (r - 35) * m / 5}q${l * 0.15 - 5} -4 ${l * 0.25 - 7} -13m${7 - l * 0.25} 13q6 -6 7 -13` })));
  }));
}
function Ce({ state: t, d: f, isTracking: n }, l = !1) {
  const r = t.route ? ie[t.route] : 232, m = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: I(r, m) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [ie.start, ie.opener].map((c, s) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(c) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${c} 85 ${c} 48V0`, fill: "none", stroke: t.route === "start" && s === 0 || t.route === "opener" && s === 1 ? ke : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: s ? "opener-jack" : "first-jack", cx: c, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: c, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, s ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: I(r, m), dragologyOnDrag: l ? void 0 : () => f.closest([Oe, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: ke, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function et(t) {
  return Ce(t, !0);
}
function ct({ value: t, onChange: f, readOnly: n = !1 }) {
  const l = n || !f, [r, m] = F(null), [c, s] = F(0), [u, a] = F(1), [h, b] = F(""), [$, y] = F(null), [p, g] = F(1), x = B(null), C = B(null), W = B([]), d = De(), v = ve(() => ({ route: t.route }), [t.route]), i = (!l && r ? r : v).route;
  Y(() => {
    const w = x.current, D = new ResizeObserver(() => g(Math.min(1, w.clientWidth / 460)));
    return D.observe(w), () => D.disconnect();
  }, []);
  function k(w) {
    l || (m(null), b(""), f?.({ ...t, route: w.route }));
  }
  function L(w) {
    a(w), y(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), C.current?.showModal();
  }
  function E() {
    const w = t.route === "start" ? 0 : u;
    W.current[w]?.focus({ preventScroll: !0 });
    const D = t[G[w]];
    b(w === u ? "Focus returned to " + D + ", the print you opened." : "Focus jumped to " + D + ". You opened " + t[G[u]] + ".");
  }
  function S() {
    s((w) => w + 1), m(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": l || void 0,
      onPointerCancel: S,
      onKeyDown: (w) => {
        w.key === "Escape" && !C.current?.open && S();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, Ue),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, l ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, G.map((w, D) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: w,
        ref: (T) => {
          W.current[D] = T;
        },
        "aria-label": "Open " + t[w],
        onClick: () => L(D)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, xe(D)),
      /* @__PURE__ */ e.createElement("span", null, t[w])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: x, style: { "--circuit-scale": p } }, /* @__PURE__ */ e.createElement(
      _,
      {
        key: l ? "locked" : c,
        state: v,
        width: 460,
        height: 108,
        draggable: l ? et : Ce,
        onDragState: l ? void 0 : m,
        onDropState: l ? void 0 : k
      }
    )),
    !l && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "start", onClick: () => k({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "opener", onClick: () => k({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, i === "start" ? "Every viewer returns to the first print." : i === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, h || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: C, onClose: E, "aria-labelledby": d, onKeyDown: (w) => {
      w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), w.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, xe(u)), /* @__PURE__ */ e.createElement("h2", { id: d }, t[G[u]]), !l && $ !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (w) => {
      w.preventDefault(), $.trim() && (f?.({ ...t, [G[u]]: $.trim() }), y(null), C.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: $, onChange: (w) => y(w.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !$.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => y(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => C.current?.close() }, "Close viewer"), !l && $ === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => y(t[G[u]]) }, "Rename print"))
  );
}
function we(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((f) => f.trim()) ?? [t];
}
function fe({ state: t, d: f, draggedId: n, isTracking: l }, r, m, c = !1, s = !1, u = "") {
  const a = m?.layout ?? se, { width: h, row: b, height: $, top: y } = a, { points: p, height: g } = de(t, a), x = !!t.lanes[0].station, C = (d) => {
    const v = t.lanes.findIndex((k) => k.id === d.laneId), i = t.cards.filter((k) => k.laneId === d.laneId).indexOf(d);
    return I((x ? 18 : 8) + p[v].x, p[v].y + y + i * b);
  };
  if (l && n) {
    const d = t.cards.find((v) => "choice-" + v.id === n);
    if (d) return /* @__PURE__ */ e.createElement("g", { id: n, transform: C(d) });
  }
  const W = !x && !t.kind;
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, W && n && t.lanes.map((d, v) => /* @__PURE__ */ e.createElement(
    "rect",
    {
      id: "drop-" + d.id,
      x: p[v].x,
      y: 0,
      width: a.pitch,
      height: g,
      fill: "none",
      pointerEvents: "none",
      "aria-hidden": "true"
    }
  )), t.lanes.flatMap((d, v) => (d.station?.next ?? []).map((i) => {
    const k = p[v], L = p[t.lanes.findIndex((N) => N.id === i)], E = h / 2 + 8, S = (y - 12) / 2 + 4, w = L.x - k.x, D = L.y - k.y, T = Math.min(w ? h / 2 / Math.abs(w) : 1 / 0, D ? (S - 4) / Math.abs(D) : 1 / 0), Z = L.x + E - w * T, R = L.y + S - D * T;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: d.id + "-" + i }, /* @__PURE__ */ e.createElement("line", { x1: k.x + E, y1: k.y + S, x2: Z, y2: R, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${Z} ${R}) rotate(${Math.atan2(D, w) * 180 / Math.PI})` }));
  })), t.lanes.map((d, v) => {
    const i = t.cards.filter((E) => E.laneId === d.id).length, k = t.kind === "release-plan" && Me(t, d.id), L = t.kind === "release-plan" ? k + (d.capacity ? " / " + d.capacity : "") + " points" : d.station ? i ? "● Occupied" : "Open stop" : d.capacity ? `${i} of ${d.capacity} slots` : `${i} ${i === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + d.id, transform: I(8 + p[v].x, 4 + p[v].y) }, x && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: h, height: y + Math.max(1, i) * b - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...c && !r ? {
      ...x ? { "data-workshop-station": d.id } : { "data-workshop-lane": d.id },
      role: "button",
      tabIndex: 0,
      "aria-labelledby": u + "-edit-" + d.id,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: h, height: y - 12, rx: x ? 6 : 9, fill: x ? "#253c36" : qe[v] }), (m?.labels.get("heading-" + d.id) ?? we(d.label)).map((E, S) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + S, fill: x ? "#fffdf3" : "#18302d", transform: I(12, (x ? 23 : 16) + S * 16), fontSize: x ? 17 : 13, fontWeight: "bold" }, E)), /* @__PURE__ */ e.createElement("text", { fill: x ? "#ebd29a" : "#18302d", transform: I(12, y - 23), fontSize: 12 }, L)), s && i < (d.capacity ?? 1 / 0) && /* @__PURE__ */ e.createElement(
      "g",
      {
        "data-workshop-add-card": d.id,
        transform: I(0, y + i * b - 4),
        role: "button",
        tabIndex: 0,
        "aria-labelledby": u + "-add-" + d.id,
        cursor: "pointer"
      },
      /* @__PURE__ */ e.createElement("rect", { width: h, height: 40, rx: 7, fill: "#fbfcf9", stroke: "#64796c", strokeDasharray: "4 3" }),
      /* @__PURE__ */ e.createElement("text", { transform: I(12, 25), fontSize: 14 }, "+ Add card")
    ));
  }), t.cards.map((d) => {
    const v = r ? [] : ne(t, d), i = "choice-" + d.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: i,
        "data-workshop-card": d.id,
        transform: C(d),
        dragologyZIndex: n === i ? "/1" : !1,
        dragologyOnDrag: v.length > 1 ? () => {
          const k = v.map((E) => re(t, d.id, E.id));
          if (!W) return f.closest(k).withFloating();
          const L = v.map((E, S) => f.dropTarget("drop-" + E.id, k[S], { boundsState: t }));
          return f.closest(L).whenFar(t).withFloating();
        } : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: x ? h - 20 : h, height: $ - (x ? 6 : 0), fill: x ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: x ? 1 : 8 }),
      x && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: I(12, $ - 10), fill: "#466358", fontSize: 12 }, d.points, " pts"),
      (m?.labels.get(i) ?? we(d.label)).map((k, L) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + L, transform: I(12, 17 + L * 16), fontSize: 14 }, k))
    );
  }));
}
const tt = (t) => fe(t, !1), nt = (t) => fe(t, !0);
function dt({ value: t, onChange: f, onPreview: n, onEditCard: l, onEditStation: r, onEditLane: m, onAddCard: c, onUndo: s, canUndo: u, readOnly: a = !1, fitLanes: h = !1, showPlacementOutcomes: b = !0 }) {
  const $ = e.useRef(null), y = e.useId(), p = e.useRef(null), g = e.useRef(null), [x, C] = e.useState(0), W = h && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const o = $.current;
    if (!W || !o) return;
    const M = () => C(o.clientWidth);
    M();
    const z = new ResizeObserver(M);
    return z.observe(o), () => z.disconnect();
  }, [W]);
  const d = e.useMemo(() => W && x ? Ve(t, x) : void 0, [W, x, t]), { width: v, height: i } = de(t, d?.layout), k = t.kind === "release-plan", L = !!t.signals?.length, [E, S] = e.useState(0), w = e.useRef(!1), D = e.useRef(null), [T, Z] = e.useState(null), [R, N] = e.useState(null), [oe, me] = e.useState(null), P = !a && R?.source === t ? R : null, ue = e.useRef(t), K = e.useCallback((o) => {
    (k || L) && Z(o), n?.(o);
  }, [k, L, n]), q = e.useCallback(() => {
    w.current = !1, D.current = null, N(null), K(null), S((o) => o + 1);
  }, [K]);
  e.useLayoutEffect(() => {
    ue.current !== t && (w.current || R) && q(), ue.current = t;
  }, [t, R, q]);
  const Q = (o, M) => {
    w.current = !1, N(null), K(null), o !== t && (k && !s && me({ before: t, after: o }), f(o, M));
  }, Le = (o) => {
    const M = o.cards.find((z) => z.id === D.current);
    Q(o, M && { cardId: M.id, laneId: M.laneId });
  }, Se = e.useCallback((o) => {
    const M = o.type === "dragging" ? o : o.pendingDrag?.status;
    w.current = !!M, M ? (D.current = M.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, N(null)) : D.current !== null && (D.current = null, K(null));
  }, [K]);
  e.useEffect(() => {
    function o(M) {
      !w.current && !R || M instanceof KeyboardEvent && M.key !== "Escape" || q();
    }
    return document.addEventListener("keydown", o), document.addEventListener("pointercancel", o), window.addEventListener("blur", o), () => {
      document.removeEventListener("keydown", o), document.removeEventListener("pointercancel", o), window.removeEventListener("blur", o);
    };
  }, [q, R]);
  const J = a ? null : P?.next ?? T, A = !!(a || P), pe = !!t.lanes[0].station, j = !A && (pe ? !!r : !k && !!m), V = !A && !pe && !k && !!c && t.cards.length < Be, We = e.useMemo(() => d || j || V ? (o) => fe(o, A, d, j, V, y) : A ? nt : tt, [d, A, j, V, y]), ae = "[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]";
  function le(o) {
    A || (o.dataset.workshopStation ? r?.(o.dataset.workshopStation) : o.dataset.workshopLane ? m?.(o.dataset.workshopLane, o) : o.dataset.workshopAddCard && c?.(o.dataset.workshopAddCard, o));
  }
  const ze = J ? Math.max(i, de(J, d?.layout).height) : i;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, (j || V) && /* @__PURE__ */ e.createElement("div", { hidden: !0 }, t.lanes.map((o) => /* @__PURE__ */ e.createElement(e.Fragment, { key: o.id }, j && /* @__PURE__ */ e.createElement("span", { id: y + "-edit-" + o.id }, "Edit ", o.label), V && /* @__PURE__ */ e.createElement("span", { id: y + "-add-" + o.id }, "Add card to ", o.label)))), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: $,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (o) => {
        const M = o.target.closest(ae);
        !M || !["Enter", " "].includes(o.key) || (o.preventDefault(), o.repeat || le(M));
      },
      onClickCapture: (o) => {
        const M = o.target.closest(ae);
        M && o.detail === 0 && le(M);
      },
      onPointerDownCapture: (o) => {
        if (p.current = null, A || !o.isPrimary || o.button !== 0) return;
        const M = o.target.closest(ae + ",[data-workshop-card]");
        M && (p.current = { target: M, x: o.clientX, y: o.clientY });
      },
      onPointerMoveCapture: (o) => {
        p.current && Math.hypot(o.clientX - p.current.x, o.clientY - p.current.y) > 5 && (p.current = null, g.current = null);
      },
      onPointerCancelCapture: () => {
        p.current = null, g.current = null;
      },
      onPointerUpCapture: (o) => {
        const M = p.current;
        if (p.current = null, !M || A) return;
        const z = M.target.dataset.workshopCard;
        if (!z) {
          g.current = null, le(M.target);
          return;
        }
        l && (g.current?.id === z && o.timeStamp - g.current.at < 400 ? (g.current = null, l(z)) : g.current = { id: z, at: o.timeStamp });
      }
    },
    /* @__PURE__ */ e.createElement(
      _,
      {
        key: a ? "read-only" : E,
        draggable: We,
        state: P?.next ?? t,
        onDropState: a ? void 0 : Le,
        onDragState: a ? void 0 : K,
        onDragStatus: Se,
        width: v,
        height: ze
      }
    )
  ), L && b && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Re(J ?? t).map((o) => /* @__PURE__ */ e.createElement("p", { key: o.id }, /* @__PURE__ */ e.createElement("strong", null, o.label), /* @__PURE__ */ e.createElement("br", null), o.text))), k && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Xe, { value: t, preview: J }), !a && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    Ye,
    {
      value: t,
      preview: P?.move ?? null,
      stage: (o, M) => {
        N({ source: t, next: o, move: M }), n?.(o);
      },
      cancel: q,
      apply: () => {
        P && (Q(P.next, P.move), K(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(s ? u : oe?.after === t), onClick: () => {
    q(), s ? s() : oe?.after === t && (me(null), f(oe.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((o) => {
    const M = t.lanes.find((z) => z.id === o.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: o.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, o.label, " · ", M.label), /* @__PURE__ */ e.createElement("br", null), M.station.outcome), M.station.image && /* @__PURE__ */ e.createElement(
      "img",
      {
        src: M.station.image.src,
        alt: M.station.image.alt,
        referrerPolicy: "no-referrer",
        style: { display: "block", maxWidth: "100%", width: 360, maxHeight: 240, objectFit: "contain", objectPosition: "left", marginBlock: "8px" }
      }
    ), ne(t, o).filter((z) => z.id !== o.laneId).map((z) => /* @__PURE__ */ e.createElement("button", { key: z.id, type: "button", disabled: a, onClick: () => Q(re(t, o.id, z.id), { cardId: o.id, laneId: z.id }) }, o.label, " → ", z.label)));
  })), !k && t.cards.length > 0 && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((o) => /* @__PURE__ */ e.createElement("label", { key: o.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, o.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: a,
      "aria-label": "Move " + o.label,
      value: P?.move.cardId === o.id ? P.move.laneId : o.laneId,
      onChange: (M) => {
        const z = { cardId: o.id, laneId: M.currentTarget.value }, U = re(t, o.id, z.laneId);
        L ? U === t ? q() : (N({ source: t, next: U, move: z }), n?.(U)) : Q(U, z);
      }
    },
    ne(t, o).map((M) => /* @__PURE__ */ e.createElement("option", { key: M.id, value: M.id }, M.label))
  ))), P && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => Q(P.next, P.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: q }, "Cancel move"))));
}
export {
  ct as FocusDarkroomBoard,
  it as ListeningRoomBoard,
  st as MoonGalleryBoard,
  lt as OfflineHandoffBoard,
  Xe as ReleasePlanReadout,
  dt as WorkshopBoard,
  ut as addWorkshopBranch,
  pt as addWorkshopCard,
  ht as addWorkshopLane,
  ne as availableLanes,
  ce as canHangPanel,
  gt as createLaneWorkshop,
  bt as createWorkshopMap,
  Et as decodeWorkshopFragment,
  yt as describeFocusDarkroom,
  kt as encodeWorkshopFragment,
  he as handoffSummary,
  ee as hangGalleryPanel,
  xt as industrialWorkshop,
  wt as initialFocusDarkroom,
  qe as laneColors,
  be as listeningRoom,
  Ee as listeningRoomCaption,
  Be as maxWorkshopCards,
  vt as moonGallery,
  re as moveWorkshopCard,
  Mt as nightTransfer,
  $t as normalizeFocusDarkroom,
  Ct as normalizeListeningRoom,
  Lt as normalizeMoonGallery,
  St as normalizeOfflineHandoff,
  Pe as offlineHandoff,
  G as printFields,
  Me as releaseLoad,
  Wt as releasePlan,
  ge as resolveHandoff,
  Re as resolveWorkshopSignals,
  O as reviewHandoff,
  zt as validateWorkshop,
  se as workshopLayout,
  de as workshopPositions,
  Dt as workshopPresentationLanes,
  It as workshopPresentationScenes,
  Ft as workshopToSlate
};
