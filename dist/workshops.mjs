import e, { useState as D, useRef as B, useMemo as we, useLayoutEffect as U, useEffect as V, useId as ze } from "react";
import { DraggableRenderer as X, translate as z, param as De, inOrder as Ie } from "./dragology.mjs";
import { handoffSummary as pe, reviewHandoff as Z, resolveHandoff as he, offlineHandoff as Fe, listeningRoom as ge, listeningRoomCaption as be, workshopLayout as ie, releaseLoad as ve, availableLanes as O, moveWorkshopCard as ee, canHangPanel as se, hangGalleryPanel as J, printFields as K, workshopPositions as ce, maxWorkshopCards as Pe, resolveWorkshopSignals as Be, laneColors as Re } from "./workshop-model.mjs";
import { addWorkshopBranch as mt, addWorkshopCard as ut, addWorkshopLane as pt, createLaneWorkshop as ht, createWorkshopMap as gt, decodeWorkshopFragment as bt, describeFocusDarkroom as Et, encodeWorkshopFragment as yt, industrialWorkshop as kt, initialFocusDarkroom as xt, moonGallery as wt, nightTransfer as vt, normalizeFocusDarkroom as Mt, normalizeListeningRoom as $t, normalizeMoonGallery as Ct, normalizeOfflineHandoff as Lt, releasePlan as St, validateWorkshop as Wt, workshopPresentationLanes as zt, workshopPresentationScenes as Dt, workshopToSlate as It } from "./workshop-model.mjs";
function qe(t, f, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${f}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + a, d: `M59 ${a}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function Ae(t, f) {
  const n = t ? 9 : 49, a = t ? 20 : 23, r = t ? 144 : 181, m = t ? 183 : 370, c = t ? 35 : 40, s = t ? 164 : 255, p = t ? 119 : 147, o = 45, g = (E, k, h, u, b = "#243c32", d = "normal", y = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: z(E, k), fill: b, fontSize: u, fontFamily: y, fontWeight: d }, h);
  return ({ state: E, d: k, draggedId: h }) => {
    const u = E.stage === "queued", b = E.stage === "resolved", d = m + (s - p) / 2, y = c + 138, M = u ? n + (r - p) / 2 : d, C = u ? a + 141 : y, $ = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + r - 2} ${a + 180} C${n + r + 45} ${a + 235},${m - 24} ${c + 204},${m + 22} ${c + 159}`, fill: "none", stroke: u ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: u ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: z(n, a) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: r, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: r, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: r - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), g(13, 27, "17:08", 9, $, "bold"), g(r - 50, 27, u ? "Offline" : "Online", 10, u ? "#835420" : "#266451", "bold"), g(13, 47, "Field log", t ? 18 : 20, $, "bold"), qe(13, 55, (r - 26) / 142), g(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, $), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: z(m, c) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${s - 5} -3 5 190 -${s - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${s - 1} -3 3 183 -${s - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: s, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + i, cx: "8", cy: i, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), g(23, 38, u ? "SHIFT HANDOFF" : b ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), g(22, 69, "Gate B", t ? 30 : 37, $, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${s - 42}`, stroke: "#bfc5b1" }), g(23, 101, (b && E.choice === "field" ? E.fieldNote : E.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, $, "bold"), g(23, 120, b && E.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: z((s - p) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: p, height: o, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), g(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: z(M, C),
        dragologyZIndex: h === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !f && u ? () => k.closest([E, Z(E)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${p - 2}v${o - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${p}v${o - 7}l-7 7H0z`, fill: b ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${p - 7} ${o}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + i, cx: "8", cy: i, r: "1.3", fill: "#84662e" })),
      g(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      g(17, 34, b ? "Reviewed" : E.fieldNote === Fe.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
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
function at({ value: t, onChange: f, readOnly: n = !1 }) {
  const [a, r] = D(null), [m, c] = D(null), [s, p] = D(0), [o, g] = D(!1), [E, k] = D(1), h = B(null), u = B(!1), b = B(t), d = we(() => Ae(o, n), [o, n]), y = n ? t : m ?? a ?? t, M = t.stage === "queued" && y.stage === "review";
  function C() {
    u.current = !1, c(null), r(null), p((i) => i + 1);
  }
  function $(i) {
    C(), !n && i.stage !== t.stage && f?.(i);
  }
  return U(() => {
    (u.current || m) && (n || b.current !== t) && C(), b.current = t;
  }, [t, n, m]), U(() => {
    const i = () => {
      const I = h.current.clientWidth;
      g(I < 510), k(Math.min(1, I / (I < 510 ? 360 : 685)));
    };
    i();
    const L = new ResizeObserver(i);
    return L.observe(h.current), () => L.disconnect();
  }, []), V(() => {
    function i(L) {
      (u.current || m) && (!(L instanceof KeyboardEvent) || L.key === "Escape") && C();
    }
    return document.addEventListener("keydown", i), document.addEventListener("pointercancel", i), window.addEventListener("blur", i), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("pointercancel", i), window.removeEventListener("blur", i);
    };
  }, [m]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, Ne), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: h, style: { "--drawing-scale": E } }, /* @__PURE__ */ e.createElement(
    X,
    {
      key: n ? "read-only" : s,
      state: m ?? t,
      draggable: d,
      width: o ? 360 : 685,
      height: o ? 254 : 262,
      onDragState: n ? void 0 : (i) => {
        u.current = !0, r(i.stage !== t.stage && t.stage === "queued" ? i : null);
      },
      onDropState: n ? void 0 : $
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (y.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", y.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, pe(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, M ? "The two access reports disagree." : pe(t)), !n && (t.stage === "queued" ? M ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => $(Z(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: C }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => c(Z(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => $(he(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => $(he(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => $(Z(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => $({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function He() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const f = new t(), n = f.sampleRate, a = n * 4, r = f.createBuffer(1, a, n), m = f.createBuffer(1, a, n), c = r.getChannelData(0), s = m.getChannelData(0);
  let p = 419;
  function o() {
    return p = 1664525 * p + 1013904223 >>> 0, p / 4294967296;
  }
  for (let E = 0; E < 100; E++) {
    const k = Math.floor(o() * a), h = 380 + o() * 1500, u = 0.09 + o() * 0.08;
    for (let b = 0; b < n * 0.12; b++) {
      const d = b / n, y = Math.sin(2 * Math.PI * h * d) + 0.22 * (o() * 2 - 1);
      c[(k + b) % a] += u * Math.exp(-d * 76) * y;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((E, k) => {
    const h = Math.floor((k * 0.93 + 0.1) * n);
    for (let u = 0; u < n * 1.6; u++) {
      const b = u / n, d = Math.sin(b * E * 2 * Math.PI) + 0.23 * Math.sin(b * E * 5.42 * Math.PI);
      s[(h + u) % a] += 0.16 * Math.min(1, b * 250) * Math.exp(-b * 3.3) * d;
    }
  });
  const g = [r, m].map((E) => {
    const k = f.createBufferSource(), h = f.createGain();
    return h.gain.value = 0, k.buffer = E, k.loop = !0, k.connect(h).connect(f.destination), k.start(), h;
  });
  return {
    ctx: f,
    mix(E) {
      g[0].gain.setTargetAtTime(Math.cos(E * Math.PI / 2), f.currentTime, 0.035), g[1].gain.setTargetAtTime(Math.sin(E * Math.PI / 2), f.currentTime, 0.035);
    },
    stop() {
      f.close();
    }
  };
}
function Me({ state: t, d: f, isTracking: n }, a) {
  const r = t.mix, m = 106 + 420 * r, c = z(m, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (s, p) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + p, cx: 18 + p * 137 % 604, cy: 12 + p * 47 % 103, r: p % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - r * 0.45 }, Array.from({ length: 30 }, (s, p) => {
    const o = 29 + p * 31 % 184, g = 24 + p * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + p, d: `M${o} ${g}l-3 8`, stroke: p % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: p % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + s, d: `M${39 + s * 15} ${116 + s * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + s, d: `M${65 + s * 35} ${177 - s * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + r * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((s) => {
    const p = 407 + s * 32, o = 63 - s % 3 * 4, g = 52 + (s + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + s, transform: z(p, o) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${g}l-8 5-8-6z`, fill: s % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${g + 7}l7-5V13z`, fill: s % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${g - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: r })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c, dragologyOnDrag: a ? void 0 : () => f.vary(t, De("mix"), { constraint: (s) => Ie([0, s.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + r * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const Ke = (t) => Me(t, !1), Te = (t) => Me(t, !0), Ge = `
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
function lt({ value: t, onChange: f, readOnly: n = !1 }) {
  const a = B(null), r = B(null), [m, c] = D(null), [s, p] = D(0), [o, g] = D(1), [E, k] = D(!1), [h, u] = D(!1), b = m ?? t, d = B(t), y = B(!1);
  function M() {
    y.current = !1, c(null), p((v) => v + 1);
  }
  U(() => {
    y.current && (n || t !== d.current) && M(), d.current = t;
  }, [t, n]), U(() => {
    const v = a.current, S = () => g(Math.min(1, v.clientWidth / 640));
    S();
    const w = new ResizeObserver(S);
    return w.observe(v), () => w.disconnect();
  }, []), V(() => {
    function v(S) {
      y.current && (!(S instanceof KeyboardEvent) || S.key === "Escape") && M();
    }
    return document.addEventListener("keydown", v), document.addEventListener("pointercancel", v), window.addEventListener("blur", v), () => {
      document.removeEventListener("keydown", v), document.removeEventListener("pointercancel", v), window.removeEventListener("blur", v);
    };
  }, []);
  function C(v) {
    y.current = !1, c(null), !n && v !== t.mix && f?.({ ...t, mix: v });
  }
  function $() {
    r.current?.stop(), r.current = null, k(!1);
  }
  V(() => {
    r.current?.mix(b.mix);
  }, [b.mix]), V(() => {
    const v = new IntersectionObserver(([w]) => {
      w.isIntersecting || $();
    });
    v.observe(a.current);
    const S = () => {
      document.hidden && $();
    };
    return document.addEventListener("visibilitychange", S), () => {
      v.disconnect(), document.removeEventListener("visibilitychange", S), r.current?.stop(), r.current = null;
    };
  }, []);
  async function i() {
    if (r.current) {
      $();
      return;
    }
    try {
      const v = He();
      r.current = v, v.mix(b.mix), await v.ctx.resume(), r.current === v && k(!0);
    } catch {
      $(), u(!0);
    }
  }
  const L = t.leftLabel === ge.leftLabel ? "rain" : t.leftLabel, I = t.rightLabel === ge.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, Ge), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: a,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": o },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": n,
      tabIndex: n ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(b.mix * 100),
      "aria-valuetext": be(b),
      onKeyDown: (v) => {
        if (n) return;
        const S = {
          ArrowLeft: b.mix - 0.01,
          ArrowRight: b.mix + 0.01,
          ArrowDown: b.mix - 0.01,
          ArrowUp: b.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(S, v.key) && (v.preventDefault(), C(Math.round(100 * Math.min(1, Math.max(0, S[v.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      X,
      {
        key: n ? "read-only" : s,
        state: t,
        draggable: n ? Te : Ke,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (v) => {
          y.current = v !== null, c(v);
        },
        onDropState: n ? void 0 : (v) => C(v.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => C(0) }, "Listen to ", L), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => C(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => C(1) }, "Listen to ", I)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, be(b))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: i, "aria-pressed": E, disabled: h }, h ? "Audio unavailable" : E ? "Mute sound" : "Enable sound")));
}
function Qe(t, f, n) {
  const a = [];
  let r = "";
  for (const m of t.split(/\s+/u)) {
    const c = r ? r + " " + m : m;
    if (n.measureText(c).width <= f) {
      r = c;
      continue;
    }
    r && a.push(r), r = "";
    for (const s of m)
      r && n.measureText(r + s).width > f && (a.push(r), r = ""), r += s;
  }
  return r && a.push(r), a;
}
function je(t, f) {
  const n = Math.min(ie.pitch, Math.max(124, Math.floor(f / t.lanes.length))), a = n - 16, r = document.createElement("canvas").getContext("2d"), m = /* @__PURE__ */ new Map();
  function c(g, E, k) {
    r.font = k;
    let h = 1;
    for (const u of g) {
      const b = Qe(u.label, a - 25, r);
      m.set(E + u.id, b), h = Math.max(h, b.length);
    }
    return h;
  }
  const s = c(t.lanes, "heading-", "bold 13px system-ui, sans-serif"), p = c(t.cards, "choice-", "14px system-ui, sans-serif"), o = Math.max(ie.height, 16 * p + 14);
  return { labels: m, layout: { pitch: n, width: a, height: o, row: o + 12, top: 16 * s + 45 } };
}
function Ve({ value: t, preview: f }) {
  const n = f ?? t, a = new Map(n.lanes.map((c) => [c.id, c.label])), r = new Map(n.cards.map((c) => [c.id, c])), m = n.cards.flatMap((c) => (c.dependsOn ?? []).map((s) => ({ feature: c, prerequisite: r.get(s) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((c) => c.capacity !== void 0).map((c) => {
    const s = ve(n, c.id);
    return /* @__PURE__ */ e.createElement("div", { key: c.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, c.label), /* @__PURE__ */ e.createElement("output", { "aria-label": c.label + " capacity" }, s, " / ", c.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": c.label + " point budget", min: 0, max: c.capacity, value: s, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), m.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, m.map(({ feature: c, prerequisite: s }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([c.id, s.id]) }, /* @__PURE__ */ e.createElement("strong", null, c.label), " needs ", s.label, " · ", a.get(s.laneId))))), f && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((c) => t.cards.find((s) => s.id === c.id)?.laneId !== c.laneId).map((c) => c.label + " → " + a.get(c.laneId)).join(" · ")));
}
function Xe({ value: t, preview: f, stage: n, apply: a, cancel: r }) {
  const [m, c] = D(t.cards[0].id), s = t.cards.find((o) => o.id === m) ?? t.cards[0], p = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (o) => {
    o.key === "Escape" && (r(), o.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: p }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: p, value: s.id, onChange: (o) => {
    c(o.target.value), r();
  } }, t.cards.map((o) => /* @__PURE__ */ e.createElement("option", { key: o.id, value: o.id }, o.label))), /* @__PURE__ */ e.createElement("div", null, O(t, s).filter((o) => o.id !== s.laneId).map((o) => /* @__PURE__ */ e.createElement("button", { key: o.id, type: "button", onClick: () => n(ee(t, s.id, o.id), { cardId: s.id, laneId: o.id }) }, "Preview ", o.label))), f && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: a }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: r }, "Cancel preview")));
}
const Ee = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], Ye = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], A = 148, j = 104;
function _e(t) {
  const f = (n, a, r) => {
    const m = Array.from({ length: 38 }, (c, s) => {
      const p = Math.min(A, 4 * s), o = t * A + p, g = n + a * (Math.sin(o / 46) + 0.39 * Math.cos(o / 19) + 0.09 * Math.sin(o / 7));
      return (s ? "L" : "M") + p + " " + g.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: m + `L${A} ${j}H0z`, fill: r });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: A + 8, height: j + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: A + 4, height: j + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: A, height: j, fill: "#343b66" }), Array.from({ length: 13 }, (n, a) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + a, cx: 6 + (a * 77 + t * 19) % 136, cy: 4 + (a * 29 + t * 11) % 35, r: a % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), f(48, 7, "#9b88aa"), f(59, 10, "#bf9492"), f(75, 7, "#596d83"), f(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, a) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + a, d: `M${4 + (a * 37 + t * 13) % 124} ${92 + a * 3 % 10}h${4 + a % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Ze(t, f) {
  return ({ state: n, d: a, draggedId: r, isTracking: m }) => {
    const c = (o) => o === 1 ? "panorama-panel" : "gallery-panel-" + o, s = (o) => (n.hung.includes(n.panels[o].id) ? Ee : Ye)[o], p = n.panels.findIndex((o, g) => c(g) === r);
    if (m && p >= 0) {
      const o = s(p);
      return /* @__PURE__ */ e.createElement("g", { id: c(p), transform: z(o.x, o.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + o, d: `M${40 + 83 * o} 225l${(o - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((o) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + o, transform: z(163 + o * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((o, g) => {
      const E = Ee[g], k = s(g), h = !t && (!f || f.includes(o.id)) && se(n, o.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: o.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: g === 1 ? "gallery-hook" : "gallery-hook-" + g,
          x: E.x,
          y: E.y,
          width: A,
          height: j,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: E.x + A / 2, cy: E.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: c(g),
          transform: z(k.x, k.y),
          dragologyZIndex: r === c(g) ? "/1" : !1,
          dragologyOnDrag: h ? () => a.between([n, J(n, o.id)]) : void 0
        },
        _e(["dunes", "moon", "coast"].indexOf(o.artwork))
      ));
    }));
  };
}
function it({ value: t, onChange: f, onPreview: n, readOnly: a = !1, enabledIds: r }) {
  const m = e.useRef(null), [c, s] = e.useState(1), [p, o] = e.useState(0), [g, E] = e.useState(null), k = e.useRef(t);
  k.current = t;
  const h = e.useMemo(() => Ze(a, r), [a, r]), u = (i) => {
    E(i), n?.(i);
  }, b = e.useRef(n);
  b.current = n;
  const d = e.useCallback(() => {
    E(null), b.current?.(null), o((i) => i + 1);
  }, []);
  e.useEffect(() => {
    const i = new ResizeObserver(() => {
      m.current && s(Math.min(1, m.current.clientWidth / 640));
    });
    return i.observe(m.current), () => i.disconnect();
  }, []), e.useEffect(() => {
    d();
    const i = (L) => {
      L.key === "Escape" && d();
    };
    return document.addEventListener("keydown", i), window.addEventListener("blur", d), () => {
      document.removeEventListener("keydown", i), window.removeEventListener("blur", d);
    };
  }, [t, a, d]);
  function y(i) {
    if (u(null), a || k.current !== t) return;
    const L = i.hung.find((I) => !t.hung.includes(I));
    L && (!r || r.includes(L)) && se(t, L) && f(J(t, L));
  }
  const M = g ?? t, C = M.panels.find((i) => M.hung.includes(i.id) && !t.hung.includes(i.id)), $ = t.panels.filter((i) => !t.hung.includes(i.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: m, onPointerCancel: d, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: c, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    X,
    {
      key: p,
      draggable: h,
      width: 640,
      height: 300,
      state: t,
      onDragState: u,
      onDropState: y
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, M.panels.map((i, L) => /* @__PURE__ */ e.createElement("svg", { key: i.id, x: L * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: M.hung.includes(i.id) ? "#343b66" : "#c7b8a8" }), M.hung.includes(i.id) && /* @__PURE__ */ e.createElement("g", null, i.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: i.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : i.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, C ? C.label + " lines up with its hook." : $.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !a && $.filter((i) => (!r || r.includes(i.id)) && se(t, i.id)).map((i) => /* @__PURE__ */ e.createElement("button", { key: i.id, type: "button", onFocus: () => u(J(t, i.id)), onBlur: () => u(null), onClick: () => y(J(t, i.id)) }, "Hang ", i.label)));
}
const Je = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", le = { start: 99, opener: 361 }, Ue = { route: null }, ye = "#ffcb62";
function ke(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((f) => /* @__PURE__ */ e.createElement("g", { key: f, transform: "scale(" + f + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (f, n) => {
    const a = 33 - n * 6, r = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${a}q${-r} -2 ${-r - 4} -15q${r} 1 ${r + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${a - 3}q${r - 1} -3 ${r + 2} -15q${-r} 3 ${-r - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (f, n) => {
    const a = (n - 5.5) * 6, r = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${a * 0.35} 6 ${a} ${r}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((m) => /* @__PURE__ */ e.createElement("path", { key: m, d: `M${a * m / 5} ${35 + (r - 35) * m / 5}q${a * 0.15 - 5} -4 ${a * 0.25 - 7} -13m${7 - a * 0.25} 13q6 -6 7 -13` })));
  }));
}
function $e({ state: t, d: f, isTracking: n }, a = !1) {
  const r = t.route ? le[t.route] : 232, m = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: z(r, m) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [le.start, le.opener].map((c, s) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(c) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${c} 85 ${c} 48V0`, fill: "none", stroke: t.route === "start" && s === 0 || t.route === "opener" && s === 1 ? ye : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: s ? "opener-jack" : "first-jack", cx: c, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: c, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, s ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: z(r, m), dragologyOnDrag: a ? void 0 : () => f.closest([Ue, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: ye, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Oe(t) {
  return $e(t, !0);
}
function st({ value: t, onChange: f, readOnly: n = !1 }) {
  const a = n || !f, [r, m] = D(null), [c, s] = D(0), [p, o] = D(1), [g, E] = D(""), [k, h] = D(null), [u, b] = D(1), d = B(null), y = B(null), M = B([]), C = ze(), $ = we(() => ({ route: t.route }), [t.route]), i = (!a && r ? r : $).route;
  V(() => {
    const w = d.current, F = new ResizeObserver(() => b(Math.min(1, w.clientWidth / 460)));
    return F.observe(w), () => F.disconnect();
  }, []);
  function L(w) {
    a || (m(null), E(""), f?.({ ...t, route: w.route }));
  }
  function I(w) {
    o(w), h(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), y.current?.showModal();
  }
  function v() {
    const w = t.route === "start" ? 0 : p;
    M.current[w]?.focus({ preventScroll: !0 });
    const F = t[K[w]];
    E(w === p ? "Focus returned to " + F + ", the print you opened." : "Focus jumped to " + F + ". You opened " + t[K[p]] + ".");
  }
  function S() {
    s((w) => w + 1), m(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": a || void 0,
      onPointerCancel: S,
      onKeyDown: (w) => {
        w.key === "Escape" && !y.current?.open && S();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, Je),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, a ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, K.map((w, F) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: w,
        ref: (T) => {
          M.current[F] = T;
        },
        "aria-label": "Open " + t[w],
        onClick: () => I(F)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ke(F)),
      /* @__PURE__ */ e.createElement("span", null, t[w])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: d, style: { "--circuit-scale": u } }, /* @__PURE__ */ e.createElement(
      X,
      {
        key: a ? "locked" : c,
        state: $,
        width: 460,
        height: 108,
        draggable: a ? Oe : $e,
        onDragState: a ? void 0 : m,
        onDropState: a ? void 0 : L
      }
    )),
    !a && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "start", onClick: () => L({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "opener", onClick: () => L({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, i === "start" ? "Every viewer returns to the first print." : i === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, g || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: y, onClose: v, "aria-labelledby": C, onKeyDown: (w) => {
      w.key === "Escape" && (w.preventDefault(), w.stopPropagation(), w.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ke(p)), /* @__PURE__ */ e.createElement("h2", { id: C }, t[K[p]]), !a && k !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (w) => {
      w.preventDefault(), k.trim() && (f?.({ ...t, [K[p]]: k.trim() }), h(null), y.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: k, onChange: (w) => h(w.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !k.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => h(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => y.current?.close() }, "Close viewer"), !a && k === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => h(t[K[p]]) }, "Rename print"))
  );
}
function xe(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((f) => f.trim()) ?? [t];
}
function de({ state: t, d: f, draggedId: n, isTracking: a }, r, m, c = !1, s = !1) {
  const p = m?.layout ?? ie, { width: o, row: g, height: E, top: k } = p, { points: h } = ce(t, p), u = !!t.lanes[0].station, b = (d) => {
    const y = t.lanes.findIndex((C) => C.id === d.laneId), M = t.cards.filter((C) => C.laneId === d.laneId).indexOf(d);
    return z((u ? 18 : 8) + h[y].x, h[y].y + k + M * g);
  };
  if (a && n) {
    const d = t.cards.find((y) => "choice-" + y.id === n);
    if (d) return /* @__PURE__ */ e.createElement("g", { id: n, transform: b(d) });
  }
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((d, y) => (d.station?.next ?? []).map((M) => {
    const C = h[y], $ = h[t.lanes.findIndex((T) => T.id === M)], i = o / 2 + 8, L = (k - 12) / 2 + 4, I = $.x - C.x, v = $.y - C.y, S = Math.min(I ? o / 2 / Math.abs(I) : 1 / 0, v ? (L - 4) / Math.abs(v) : 1 / 0), w = $.x + i - I * S, F = $.y + L - v * S;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: d.id + "-" + M }, /* @__PURE__ */ e.createElement("line", { x1: C.x + i, y1: C.y + L, x2: w, y2: F, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${w} ${F}) rotate(${Math.atan2(v, I) * 180 / Math.PI})` }));
  })), t.lanes.map((d, y) => {
    const M = t.cards.filter((i) => i.laneId === d.id).length, C = t.kind === "release-plan" && ve(t, d.id), $ = t.kind === "release-plan" ? C + (d.capacity ? " / " + d.capacity : "") + " points" : d.station ? M ? "● Occupied" : "Open stop" : d.capacity ? `${M} of ${d.capacity} slots` : `${M} ${M === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + d.id, transform: z(8 + h[y].x, 4 + h[y].y) }, u && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: o, height: k + Math.max(1, M) * g - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...c && !r ? {
      ...u ? { "data-workshop-station": d.id } : { "data-workshop-lane": d.id },
      role: "button",
      tabIndex: 0,
      "aria-label": "Edit " + d.label,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: o, height: k - 12, rx: u ? 6 : 9, fill: u ? "#253c36" : Re[y] }), (m?.labels.get("heading-" + d.id) ?? xe(d.label)).map((i, L) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + L, fill: u ? "#fffdf3" : "#18302d", transform: z(12, (u ? 23 : 16) + L * 16), fontSize: u ? 17 : 13, fontWeight: "bold" }, i)), /* @__PURE__ */ e.createElement("text", { fill: u ? "#ebd29a" : "#18302d", transform: z(12, k - 23), fontSize: 12 }, $)), s && M < (d.capacity ?? 1 / 0) && /* @__PURE__ */ e.createElement(
      "g",
      {
        "data-workshop-add-card": d.id,
        transform: z(0, k + M * g - 4),
        role: "button",
        tabIndex: 0,
        "aria-label": "Add card to " + d.label,
        cursor: "pointer"
      },
      /* @__PURE__ */ e.createElement("rect", { width: o, height: 40, rx: 7, fill: "#fbfcf9", stroke: "#64796c", strokeDasharray: "4 3" }),
      /* @__PURE__ */ e.createElement("text", { transform: z(12, 25), fontSize: 14 }, "+ Add card")
    ));
  }), t.cards.map((d) => {
    const y = r ? [] : O(t, d), M = "choice-" + d.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: M,
        "data-workshop-card": d.id,
        transform: b(d),
        dragologyZIndex: n === M ? "/1" : !1,
        dragologyOnDrag: y.length > 1 ? () => f.closest(y.map((C) => ee(t, d.id, C.id))).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: u ? o - 20 : o, height: E - (u ? 6 : 0), fill: u ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: u ? 1 : 8 }),
      u && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: z(12, E - 10), fill: "#466358", fontSize: 12 }, d.points, " pts"),
      (m?.labels.get(M) ?? xe(d.label)).map((C, $) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + $, transform: z(12, 17 + $ * 16), fontSize: 14 }, C))
    );
  }));
}
const et = (t) => de(t, !1), tt = (t) => de(t, !0);
function ct({ value: t, onChange: f, onPreview: n, onEditCard: a, onEditStation: r, onEditLane: m, onAddCard: c, onUndo: s, canUndo: p, readOnly: o = !1, fitLanes: g = !1, showPlacementOutcomes: E = !0 }) {
  const k = e.useRef(null), h = e.useRef(null), u = e.useRef(null), [b, d] = e.useState(0), y = g && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const l = k.current;
    if (!y || !l) return;
    const x = () => d(l.clientWidth);
    x();
    const W = new ResizeObserver(x);
    return W.observe(l), () => W.disconnect();
  }, [y]);
  const M = e.useMemo(() => y && b ? je(t, b) : void 0, [y, b, t]), { width: C, height: $ } = ce(t, M?.layout), i = t.kind === "release-plan", L = !!t.signals?.length, [I, v] = e.useState(0), S = e.useRef(!1), w = e.useRef(null), [F, T] = e.useState(null), [H, G] = e.useState(null), [te, fe] = e.useState(null), P = !o && H?.source === t ? H : null, me = e.useRef(t), N = e.useCallback((l) => {
    (i || L) && T(l), n?.(l);
  }, [i, L, n]), R = e.useCallback(() => {
    S.current = !1, w.current = null, G(null), N(null), v((l) => l + 1);
  }, [N]);
  e.useLayoutEffect(() => {
    me.current !== t && (S.current || H) && R(), me.current = t;
  }, [t, H, R]);
  const Q = (l, x) => {
    S.current = !1, G(null), N(null), l !== t && (i && !s && fe({ before: t, after: l }), f(l, x));
  }, Ce = (l) => {
    const x = l.cards.find((W) => W.id === w.current);
    Q(l, x && { cardId: x.id, laneId: x.laneId });
  }, Le = e.useCallback((l) => {
    const x = l.type === "dragging" ? l : l.pendingDrag?.status;
    S.current = !!x, x ? (w.current = x.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, G(null)) : w.current !== null && (w.current = null, N(null));
  }, [N]);
  e.useEffect(() => {
    function l(x) {
      !S.current && !H || x instanceof KeyboardEvent && x.key !== "Escape" || R();
    }
    return document.addEventListener("keydown", l), document.addEventListener("pointercancel", l), window.addEventListener("blur", l), () => {
      document.removeEventListener("keydown", l), document.removeEventListener("pointercancel", l), window.removeEventListener("blur", l);
    };
  }, [R, H]);
  const Y = o ? null : P?.next ?? F, q = !!(o || P), ue = !!t.lanes[0].station, ne = !q && (ue ? !!r : !i && !!m), re = !q && !ue && !i && !!c && t.cards.length < Pe, Se = e.useMemo(() => M || ne || re ? (l) => de(l, q, M, ne, re) : q ? tt : et, [M, q, ne, re]), oe = "[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]";
  function ae(l) {
    q || (l.dataset.workshopStation ? r?.(l.dataset.workshopStation) : l.dataset.workshopLane ? m?.(l.dataset.workshopLane, l) : l.dataset.workshopAddCard && c?.(l.dataset.workshopAddCard, l));
  }
  const We = Y ? Math.max($, ce(Y, M?.layout).height) : $;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: k,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (l) => {
        const x = l.target.closest(oe);
        !x || !["Enter", " "].includes(l.key) || (l.preventDefault(), l.repeat || ae(x));
      },
      onClickCapture: (l) => {
        const x = l.target.closest(oe);
        x && l.detail === 0 && ae(x);
      },
      onPointerDownCapture: (l) => {
        if (h.current = null, q || !l.isPrimary || l.button !== 0) return;
        const x = l.target.closest(oe + ",[data-workshop-card]");
        x && (h.current = { target: x, x: l.clientX, y: l.clientY });
      },
      onPointerMoveCapture: (l) => {
        h.current && Math.hypot(l.clientX - h.current.x, l.clientY - h.current.y) > 5 && (h.current = null, u.current = null);
      },
      onPointerCancelCapture: () => {
        h.current = null, u.current = null;
      },
      onPointerUpCapture: (l) => {
        const x = h.current;
        if (h.current = null, !x || q) return;
        const W = x.target.dataset.workshopCard;
        if (!W) {
          u.current = null, ae(x.target);
          return;
        }
        a && (u.current?.id === W && l.timeStamp - u.current.at < 400 ? (u.current = null, a(W)) : u.current = { id: W, at: l.timeStamp });
      }
    },
    /* @__PURE__ */ e.createElement(
      X,
      {
        key: o ? "read-only" : I,
        draggable: Se,
        state: P?.next ?? t,
        onDropState: o ? void 0 : Ce,
        onDragState: o ? void 0 : N,
        onDragStatus: Le,
        width: C,
        height: We
      }
    )
  ), L && E && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Be(Y ?? t).map((l) => /* @__PURE__ */ e.createElement("p", { key: l.id }, /* @__PURE__ */ e.createElement("strong", null, l.label), /* @__PURE__ */ e.createElement("br", null), l.text))), i && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Ve, { value: t, preview: Y }), !o && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    Xe,
    {
      value: t,
      preview: P?.move ?? null,
      stage: (l, x) => {
        G({ source: t, next: l, move: x }), n?.(l);
      },
      cancel: R,
      apply: () => {
        P && (Q(P.next, P.move), N(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(s ? p : te?.after === t), onClick: () => {
    R(), s ? s() : te?.after === t && (fe(null), f(te.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((l) => {
    const x = t.lanes.find((W) => W.id === l.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: l.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, l.label, " · ", x.label), /* @__PURE__ */ e.createElement("br", null), x.station.outcome), x.station.image && /* @__PURE__ */ e.createElement(
      "img",
      {
        src: x.station.image.src,
        alt: x.station.image.alt,
        referrerPolicy: "no-referrer",
        style: { display: "block", maxWidth: "100%", width: 360, maxHeight: 240, objectFit: "contain", objectPosition: "left", marginBlock: "8px" }
      }
    ), O(t, l).filter((W) => W.id !== l.laneId).map((W) => /* @__PURE__ */ e.createElement("button", { key: W.id, type: "button", disabled: o, onClick: () => Q(ee(t, l.id, W.id), { cardId: l.id, laneId: W.id }) }, l.label, " → ", W.label)));
  })), !i && t.cards.length > 0 && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((l) => /* @__PURE__ */ e.createElement("label", { key: l.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, l.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: o,
      "aria-label": "Move " + l.label,
      value: P?.move.cardId === l.id ? P.move.laneId : l.laneId,
      onChange: (x) => {
        const W = { cardId: l.id, laneId: x.currentTarget.value }, _ = ee(t, l.id, W.laneId);
        L ? _ === t ? R() : (G({ source: t, next: _, move: W }), n?.(_)) : Q(_, W);
      }
    },
    O(t, l).map((x) => /* @__PURE__ */ e.createElement("option", { key: x.id, value: x.id }, x.label))
  ))), P && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => Q(P.next, P.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: R }, "Cancel move"))));
}
export {
  st as FocusDarkroomBoard,
  lt as ListeningRoomBoard,
  it as MoonGalleryBoard,
  at as OfflineHandoffBoard,
  Ve as ReleasePlanReadout,
  ct as WorkshopBoard,
  mt as addWorkshopBranch,
  ut as addWorkshopCard,
  pt as addWorkshopLane,
  O as availableLanes,
  se as canHangPanel,
  ht as createLaneWorkshop,
  gt as createWorkshopMap,
  bt as decodeWorkshopFragment,
  Et as describeFocusDarkroom,
  yt as encodeWorkshopFragment,
  pe as handoffSummary,
  J as hangGalleryPanel,
  kt as industrialWorkshop,
  xt as initialFocusDarkroom,
  Re as laneColors,
  ge as listeningRoom,
  be as listeningRoomCaption,
  Pe as maxWorkshopCards,
  wt as moonGallery,
  ee as moveWorkshopCard,
  vt as nightTransfer,
  Mt as normalizeFocusDarkroom,
  $t as normalizeListeningRoom,
  Ct as normalizeMoonGallery,
  Lt as normalizeOfflineHandoff,
  Fe as offlineHandoff,
  K as printFields,
  ve as releaseLoad,
  St as releasePlan,
  he as resolveHandoff,
  Be as resolveWorkshopSignals,
  Z as reviewHandoff,
  Wt as validateWorkshop,
  ie as workshopLayout,
  ce as workshopPositions,
  zt as workshopPresentationLanes,
  Dt as workshopPresentationScenes,
  It as workshopToSlate
};
