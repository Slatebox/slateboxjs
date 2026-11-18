import e, { useState as I, useRef as B, useMemo as we, useLayoutEffect as U, useEffect as V, useId as ze } from "react";
import { DraggableRenderer as X, translate as D, param as De, inOrder as Ie } from "./dragology.mjs";
import { handoffSummary as pe, reviewHandoff as Z, resolveHandoff as he, offlineHandoff as Fe, listeningRoom as ge, listeningRoomCaption as be, workshopLayout as ie, releaseLoad as ve, availableLanes as O, moveWorkshopCard as ee, canHangPanel as se, hangGalleryPanel as J, printFields as G, workshopPositions as ce, maxWorkshopCards as Pe, resolveWorkshopSignals as Be, laneColors as Re } from "./workshop-model.mjs";
import { addWorkshopBranch as mt, addWorkshopCard as ut, addWorkshopLane as pt, createLaneWorkshop as ht, createWorkshopMap as gt, decodeWorkshopFragment as bt, describeFocusDarkroom as Et, encodeWorkshopFragment as yt, industrialWorkshop as kt, initialFocusDarkroom as xt, moonGallery as wt, nightTransfer as vt, normalizeFocusDarkroom as Mt, normalizeListeningRoom as $t, normalizeMoonGallery as Ct, normalizeOfflineHandoff as Lt, releasePlan as St, validateWorkshop as Wt, workshopPresentationLanes as zt, workshopPresentationScenes as Dt, workshopToSlate as It } from "./workshop-model.mjs";
function qe(t, d, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${d}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + l, d: `M59 ${l}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function Ae(t, d) {
  const n = t ? 9 : 49, l = t ? 20 : 23, r = t ? 144 : 181, u = t ? 183 : 370, c = t ? 35 : 40, s = t ? 164 : 255, p = t ? 119 : 147, o = 45, g = (b, w, h, E, f = "#243c32", L = "normal", C = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: D(b, w), fill: f, fontSize: E, fontFamily: C, fontWeight: L }, h);
  return ({ state: b, d: w, draggedId: h }) => {
    const E = b.stage === "queued", f = b.stage === "resolved", L = u + (s - p) / 2, C = c + 138, m = E ? n + (r - p) / 2 : L, M = E ? l + 141 : C, k = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + r - 2} ${l + 180} C${n + r + 45} ${l + 235},${u - 24} ${c + 204},${u + 22} ${c + 159}`, fill: "none", stroke: E ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: E ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: D(n, l) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: r, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: r, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: r - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), g(13, 27, "17:08", 9, k, "bold"), g(r - 50, 27, E ? "Offline" : "Online", 10, E ? "#835420" : "#266451", "bold"), g(13, 47, "Field log", t ? 18 : 20, k, "bold"), qe(13, 55, (r - 26) / 142), g(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, k), /* @__PURE__ */ e.createElement("rect", { x: r / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: D(u, c) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${s - 5} -3 5 190 -${s - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${s - 1} -3 3 183 -${s - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: s, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((a) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + a, cx: "8", cy: a, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), g(23, 38, E ? "SHIFT HANDOFF" : f ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), g(22, 69, "Gate B", t ? 30 : 37, k, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${s - 42}`, stroke: "#bfc5b1" }), g(23, 101, (f && b.choice === "field" ? b.fieldNote : b.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, k, "bold"), g(23, 120, f && b.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: D((s - p) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: p, height: o, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), g(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: D(m, M),
        dragologyZIndex: h === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !d && E ? () => w.closest([b, Z(b)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${p - 2}v${o - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${p}v${o - 7}l-7 7H0z`, fill: f ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${p - 7} ${o}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((a) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + a, cx: "8", cy: a, r: "1.3", fill: "#84662e" })),
      g(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      g(17, 34, f ? "Reviewed" : b.fieldNote === Fe.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const He = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function at({ value: t, onChange: d, readOnly: n = !1 }) {
  const [l, r] = I(null), [u, c] = I(null), [s, p] = I(0), [o, g] = I(!1), [b, w] = I(1), h = B(null), E = B(!1), f = B(t), L = we(() => Ae(o, n), [o, n]), C = n ? t : u ?? l ?? t, m = t.stage === "queued" && C.stage === "review";
  function M() {
    E.current = !1, c(null), r(null), p((a) => a + 1);
  }
  function k(a) {
    M(), !n && a.stage !== t.stage && d?.(a);
  }
  return U(() => {
    (E.current || u) && (n || f.current !== t) && M(), f.current = t;
  }, [t, n, u]), U(() => {
    const a = () => {
      const W = h.current.clientWidth;
      g(W < 510), w(Math.min(1, W / (W < 510 ? 360 : 685)));
    };
    a();
    const $ = new ResizeObserver(a);
    return $.observe(h.current), () => $.disconnect();
  }, []), V(() => {
    function a($) {
      (E.current || u) && (!($ instanceof KeyboardEvent) || $.key === "Escape") && M();
    }
    return document.addEventListener("keydown", a), document.addEventListener("pointercancel", a), window.addEventListener("blur", a), () => {
      document.removeEventListener("keydown", a), document.removeEventListener("pointercancel", a), window.removeEventListener("blur", a);
    };
  }, [u]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, He), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: h, style: { "--drawing-scale": b } }, /* @__PURE__ */ e.createElement(
    X,
    {
      key: n ? "read-only" : s,
      state: u ?? t,
      draggable: L,
      width: o ? 360 : 685,
      height: o ? 254 : 262,
      onDragState: n ? void 0 : (a) => {
        E.current = !0, r(a.stage !== t.stage && t.stage === "queued" ? a : null);
      },
      onDropState: n ? void 0 : k
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (C.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", C.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, pe(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, m ? "The two access reports disagree." : pe(t)), !n && (t.stage === "queued" ? m ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => k(Z(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: M }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => c(Z(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => k(he(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => k(he(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => k(Z(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => k({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function Ne() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const d = new t(), n = d.sampleRate, l = n * 4, r = d.createBuffer(1, l, n), u = d.createBuffer(1, l, n), c = r.getChannelData(0), s = u.getChannelData(0);
  let p = 419;
  function o() {
    return p = 1664525 * p + 1013904223 >>> 0, p / 4294967296;
  }
  for (let b = 0; b < 100; b++) {
    const w = Math.floor(o() * l), h = 380 + o() * 1500, E = 0.09 + o() * 0.08;
    for (let f = 0; f < n * 0.12; f++) {
      const L = f / n, C = Math.sin(2 * Math.PI * h * L) + 0.22 * (o() * 2 - 1);
      c[(w + f) % l] += E * Math.exp(-L * 76) * C;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((b, w) => {
    const h = Math.floor((w * 0.93 + 0.1) * n);
    for (let E = 0; E < n * 1.6; E++) {
      const f = E / n, L = Math.sin(f * b * 2 * Math.PI) + 0.23 * Math.sin(f * b * 5.42 * Math.PI);
      s[(h + E) % l] += 0.16 * Math.min(1, f * 250) * Math.exp(-f * 3.3) * L;
    }
  });
  const g = [r, u].map((b) => {
    const w = d.createBufferSource(), h = d.createGain();
    return h.gain.value = 0, w.buffer = b, w.loop = !0, w.connect(h).connect(d.destination), w.start(), h;
  });
  return {
    ctx: d,
    mix(b) {
      g[0].gain.setTargetAtTime(Math.cos(b * Math.PI / 2), d.currentTime, 0.035), g[1].gain.setTargetAtTime(Math.sin(b * Math.PI / 2), d.currentTime, 0.035);
    },
    stop() {
      d.close();
    }
  };
}
function Me({ state: t, d, isTracking: n }, l) {
  const r = t.mix, u = 106 + 420 * r, c = D(u, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (s, p) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + p, cx: 18 + p * 137 % 604, cy: 12 + p * 47 % 103, r: p % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - r * 0.45 }, Array.from({ length: 30 }, (s, p) => {
    const o = 29 + p * 31 % 184, g = 24 + p * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + p, d: `M${o} ${g}l-3 8`, stroke: p % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: p % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + s, d: `M${39 + s * 15} ${116 + s * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + s, d: `M${65 + s * 35} ${177 - s * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + r * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((s) => {
    const p = 407 + s * 32, o = 63 - s % 3 * 4, g = 52 + (s + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + s, transform: D(p, o) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${g}l-8 5-8-6z`, fill: s % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${g + 7}l7-5V13z`, fill: s % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${g - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: r })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: c, dragologyOnDrag: l ? void 0 : () => d.vary(t, De("mix"), { constraint: (s) => Ie([0, s.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + r * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
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
function lt({ value: t, onChange: d, readOnly: n = !1 }) {
  const l = B(null), r = B(null), [u, c] = I(null), [s, p] = I(0), [o, g] = I(1), [b, w] = I(!1), [h, E] = I(!1), f = u ?? t, L = B(t), C = B(!1);
  function m() {
    C.current = !1, c(null), p((y) => y + 1);
  }
  U(() => {
    C.current && (n || t !== L.current) && m(), L.current = t;
  }, [t, n]), U(() => {
    const y = l.current, S = () => g(Math.min(1, y.clientWidth / 640));
    S();
    const x = new ResizeObserver(S);
    return x.observe(y), () => x.disconnect();
  }, []), V(() => {
    function y(S) {
      C.current && (!(S instanceof KeyboardEvent) || S.key === "Escape") && m();
    }
    return document.addEventListener("keydown", y), document.addEventListener("pointercancel", y), window.addEventListener("blur", y), () => {
      document.removeEventListener("keydown", y), document.removeEventListener("pointercancel", y), window.removeEventListener("blur", y);
    };
  }, []);
  function M(y) {
    C.current = !1, c(null), !n && y !== t.mix && d?.({ ...t, mix: y });
  }
  function k() {
    r.current?.stop(), r.current = null, w(!1);
  }
  V(() => {
    r.current?.mix(f.mix);
  }, [f.mix]), V(() => {
    const y = new IntersectionObserver(([x]) => {
      x.isIntersecting || k();
    });
    y.observe(l.current);
    const S = () => {
      document.hidden && k();
    };
    return document.addEventListener("visibilitychange", S), () => {
      y.disconnect(), document.removeEventListener("visibilitychange", S), r.current?.stop(), r.current = null;
    };
  }, []);
  async function a() {
    if (r.current) {
      k();
      return;
    }
    try {
      const y = Ne();
      r.current = y, y.mix(f.mix), await y.ctx.resume(), r.current === y && w(!0);
    } catch {
      k(), E(!0);
    }
  }
  const $ = t.leftLabel === ge.leftLabel ? "rain" : t.leftLabel, W = t.rightLabel === ge.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, Ge), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: l,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": o },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": n,
      tabIndex: n ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(f.mix * 100),
      "aria-valuetext": be(f),
      onKeyDown: (y) => {
        if (n) return;
        const S = {
          ArrowLeft: f.mix - 0.01,
          ArrowRight: f.mix + 0.01,
          ArrowDown: f.mix - 0.01,
          ArrowUp: f.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(S, y.key) && (y.preventDefault(), M(Math.round(100 * Math.min(1, Math.max(0, S[y.key]))) / 100));
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
        onDragState: n ? void 0 : (y) => {
          C.current = y !== null, c(y);
        },
        onDropState: n ? void 0 : (y) => M(y.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(0) }, "Listen to ", $), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => M(1) }, "Listen to ", W)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, be(f))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: a, "aria-pressed": b, disabled: h }, h ? "Audio unavailable" : b ? "Mute sound" : "Enable sound")));
}
function Qe(t, d, n) {
  const l = [];
  let r = "";
  for (const u of t.split(/\s+/u)) {
    const c = r ? r + " " + u : u;
    if (n.measureText(c).width <= d) {
      r = c;
      continue;
    }
    r && l.push(r), r = "";
    for (const s of u)
      r && n.measureText(r + s).width > d && (l.push(r), r = ""), r += s;
  }
  return r && l.push(r), l;
}
function je(t, d) {
  const n = Math.min(ie.pitch, Math.max(124, Math.floor(d / t.lanes.length))), l = n - 16, r = document.createElement("canvas").getContext("2d"), u = /* @__PURE__ */ new Map();
  function c(g, b, w) {
    r.font = w;
    let h = 1;
    for (const E of g) {
      const f = Qe(E.label, l - 25, r);
      u.set(b + E.id, f), h = Math.max(h, f.length);
    }
    return h;
  }
  const s = c(t.lanes, "heading-", "bold 13px system-ui, sans-serif"), p = c(t.cards, "choice-", "14px system-ui, sans-serif"), o = Math.max(ie.height, 16 * p + 14);
  return { labels: u, layout: { pitch: n, width: l, height: o, row: o + 12, top: 16 * s + 45 } };
}
function Ve({ value: t, preview: d }) {
  const n = d ?? t, l = new Map(n.lanes.map((c) => [c.id, c.label])), r = new Map(n.cards.map((c) => [c.id, c])), u = n.cards.flatMap((c) => (c.dependsOn ?? []).map((s) => ({ feature: c, prerequisite: r.get(s) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((c) => c.capacity !== void 0).map((c) => {
    const s = ve(n, c.id);
    return /* @__PURE__ */ e.createElement("div", { key: c.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, c.label), /* @__PURE__ */ e.createElement("output", { "aria-label": c.label + " capacity" }, s, " / ", c.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": c.label + " point budget", min: 0, max: c.capacity, value: s, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), u.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, u.map(({ feature: c, prerequisite: s }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([c.id, s.id]) }, /* @__PURE__ */ e.createElement("strong", null, c.label), " needs ", s.label, " · ", l.get(s.laneId))))), d && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((c) => t.cards.find((s) => s.id === c.id)?.laneId !== c.laneId).map((c) => c.label + " → " + l.get(c.laneId)).join(" · ")));
}
function Xe({ value: t, preview: d, stage: n, apply: l, cancel: r }) {
  const [u, c] = I(t.cards[0].id), s = t.cards.find((o) => o.id === u) ?? t.cards[0], p = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (o) => {
    o.key === "Escape" && (r(), o.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: p }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: p, value: s.id, onChange: (o) => {
    c(o.target.value), r();
  } }, t.cards.map((o) => /* @__PURE__ */ e.createElement("option", { key: o.id, value: o.id }, o.label))), /* @__PURE__ */ e.createElement("div", null, O(t, s).filter((o) => o.id !== s.laneId).map((o) => /* @__PURE__ */ e.createElement("button", { key: o.id, type: "button", onClick: () => n(ee(t, s.id, o.id), { cardId: s.id, laneId: o.id }) }, "Preview ", o.label))), d && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: l }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: r }, "Cancel preview")));
}
const Ee = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], Ye = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], H = 148, j = 104;
function _e(t) {
  const d = (n, l, r) => {
    const u = Array.from({ length: 38 }, (c, s) => {
      const p = Math.min(H, 4 * s), o = t * H + p, g = n + l * (Math.sin(o / 46) + 0.39 * Math.cos(o / 19) + 0.09 * Math.sin(o / 7));
      return (s ? "L" : "M") + p + " " + g.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: u + `L${H} ${j}H0z`, fill: r });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: H + 8, height: j + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: H + 4, height: j + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: H, height: j, fill: "#343b66" }), Array.from({ length: 13 }, (n, l) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + l, cx: 6 + (l * 77 + t * 19) % 136, cy: 4 + (l * 29 + t * 11) % 35, r: l % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), d(48, 7, "#9b88aa"), d(59, 10, "#bf9492"), d(75, 7, "#596d83"), d(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + l, d: `M${4 + (l * 37 + t * 13) % 124} ${92 + l * 3 % 10}h${4 + l % 3 * 4}`, stroke: "#7d9b9a" })));
}
function Ze(t, d) {
  return ({ state: n, d: l, draggedId: r, isTracking: u }) => {
    const c = (o) => o === 1 ? "panorama-panel" : "gallery-panel-" + o, s = (o) => (n.hung.includes(n.panels[o].id) ? Ee : Ye)[o], p = n.panels.findIndex((o, g) => c(g) === r);
    if (u && p >= 0) {
      const o = s(p);
      return /* @__PURE__ */ e.createElement("g", { id: c(p), transform: D(o.x, o.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + o, d: `M${40 + 83 * o} 225l${(o - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((o) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + o, transform: D(163 + o * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((o, g) => {
      const b = Ee[g], w = s(g), h = !t && (!d || d.includes(o.id)) && se(n, o.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: o.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: g === 1 ? "gallery-hook" : "gallery-hook-" + g,
          x: b.x,
          y: b.y,
          width: H,
          height: j,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: b.x + H / 2, cy: b.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: c(g),
          transform: D(w.x, w.y),
          dragologyZIndex: r === c(g) ? "/1" : !1,
          dragologyOnDrag: h ? () => l.between([n, J(n, o.id)]) : void 0
        },
        _e(["dunes", "moon", "coast"].indexOf(o.artwork))
      ));
    }));
  };
}
function it({ value: t, onChange: d, onPreview: n, readOnly: l = !1, enabledIds: r }) {
  const u = e.useRef(null), [c, s] = e.useState(1), [p, o] = e.useState(0), [g, b] = e.useState(null), w = e.useRef(t);
  w.current = t;
  const h = e.useMemo(() => Ze(l, r), [l, r]), E = (a) => {
    b(a), n?.(a);
  }, f = e.useRef(n);
  f.current = n;
  const L = e.useCallback(() => {
    b(null), f.current?.(null), o((a) => a + 1);
  }, []);
  e.useEffect(() => {
    const a = new ResizeObserver(() => {
      u.current && s(Math.min(1, u.current.clientWidth / 640));
    });
    return a.observe(u.current), () => a.disconnect();
  }, []), e.useEffect(() => {
    L();
    const a = ($) => {
      $.key === "Escape" && L();
    };
    return document.addEventListener("keydown", a), window.addEventListener("blur", L), () => {
      document.removeEventListener("keydown", a), window.removeEventListener("blur", L);
    };
  }, [t, l, L]);
  function C(a) {
    if (E(null), l || w.current !== t) return;
    const $ = a.hung.find((W) => !t.hung.includes(W));
    $ && (!r || r.includes($)) && se(t, $) && d(J(t, $));
  }
  const m = g ?? t, M = m.panels.find((a) => m.hung.includes(a.id) && !t.hung.includes(a.id)), k = t.panels.filter((a) => !t.hung.includes(a.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: u, onPointerCancel: L, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: c, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    X,
    {
      key: p,
      draggable: h,
      width: 640,
      height: 300,
      state: t,
      onDragState: E,
      onDropState: C
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, m.panels.map((a, $) => /* @__PURE__ */ e.createElement("svg", { key: a.id, x: $ * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: m.hung.includes(a.id) ? "#343b66" : "#c7b8a8" }), m.hung.includes(a.id) && /* @__PURE__ */ e.createElement("g", null, a.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: a.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : a.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, M ? M.label + " lines up with its hook." : k.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !l && k.filter((a) => (!r || r.includes(a.id)) && se(t, a.id)).map((a) => /* @__PURE__ */ e.createElement("button", { key: a.id, type: "button", onFocus: () => E(J(t, a.id)), onBlur: () => E(null), onClick: () => C(J(t, a.id)) }, "Hang ", a.label)));
}
const Je = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", le = { start: 99, opener: 361 }, Ue = { route: null }, ye = "#ffcb62";
function ke(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((d) => /* @__PURE__ */ e.createElement("g", { key: d, transform: "scale(" + d + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (d, n) => {
    const l = 33 - n * 6, r = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${l}q${-r} -2 ${-r - 4} -15q${r} 1 ${r + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${l - 3}q${r - 1} -3 ${r + 2} -15q${-r} 3 ${-r - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (d, n) => {
    const l = (n - 5.5) * 6, r = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${l * 0.35} 6 ${l} ${r}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((u) => /* @__PURE__ */ e.createElement("path", { key: u, d: `M${l * u / 5} ${35 + (r - 35) * u / 5}q${l * 0.15 - 5} -4 ${l * 0.25 - 7} -13m${7 - l * 0.25} 13q6 -6 7 -13` })));
  }));
}
function $e({ state: t, d, isTracking: n }, l = !1) {
  const r = t.route ? le[t.route] : 232, u = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(r, u) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [le.start, le.opener].map((c, s) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(c) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${c} 85 ${c} 48V0`, fill: "none", stroke: t.route === "start" && s === 0 || t.route === "opener" && s === 1 ? ye : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: s ? "opener-jack" : "first-jack", cx: c, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: c, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, s ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(r, u), dragologyOnDrag: l ? void 0 : () => d.closest([Ue, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: ye, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Oe(t) {
  return $e(t, !0);
}
function st({ value: t, onChange: d, readOnly: n = !1 }) {
  const l = n || !d, [r, u] = I(null), [c, s] = I(0), [p, o] = I(1), [g, b] = I(""), [w, h] = I(null), [E, f] = I(1), L = B(null), C = B(null), m = B([]), M = ze(), k = we(() => ({ route: t.route }), [t.route]), a = (!l && r ? r : k).route;
  V(() => {
    const x = L.current, F = new ResizeObserver(() => f(Math.min(1, x.clientWidth / 460)));
    return F.observe(x), () => F.disconnect();
  }, []);
  function $(x) {
    l || (u(null), b(""), d?.({ ...t, route: x.route }));
  }
  function W(x) {
    o(x), h(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), C.current?.showModal();
  }
  function y() {
    const x = t.route === "start" ? 0 : p;
    m.current[x]?.focus({ preventScroll: !0 });
    const F = t[G[x]];
    b(x === p ? "Focus returned to " + F + ", the print you opened." : "Focus jumped to " + F + ". You opened " + t[G[p]] + ".");
  }
  function S() {
    s((x) => x + 1), u(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": l || void 0,
      onPointerCancel: S,
      onKeyDown: (x) => {
        x.key === "Escape" && !C.current?.open && S();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, Je),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, l ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, G.map((x, F) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: x,
        ref: (T) => {
          m.current[F] = T;
        },
        "aria-label": "Open " + t[x],
        onClick: () => W(F)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ke(F)),
      /* @__PURE__ */ e.createElement("span", null, t[x])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: L, style: { "--circuit-scale": E } }, /* @__PURE__ */ e.createElement(
      X,
      {
        key: l ? "locked" : c,
        state: k,
        width: 460,
        height: 108,
        draggable: l ? Oe : $e,
        onDragState: l ? void 0 : u,
        onDropState: l ? void 0 : $
      }
    )),
    !l && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": a === "start", onClick: () => $({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": a === "opener", onClick: () => $({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, a === "start" ? "Every viewer returns to the first print." : a === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, g || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: C, onClose: y, "aria-labelledby": M, onKeyDown: (x) => {
      x.key === "Escape" && (x.preventDefault(), x.stopPropagation(), x.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, ke(p)), /* @__PURE__ */ e.createElement("h2", { id: M }, t[G[p]]), !l && w !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (x) => {
      x.preventDefault(), w.trim() && (d?.({ ...t, [G[p]]: w.trim() }), h(null), C.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: w, onChange: (x) => h(x.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !w.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => h(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => C.current?.close() }, "Close viewer"), !l && w === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => h(t[G[p]]) }, "Rename print"))
  );
}
function xe(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((d) => d.trim()) ?? [t];
}
function de({ state: t, d, draggedId: n, isTracking: l }, r, u, c = !1, s = !1) {
  const p = u?.layout ?? ie, { width: o, row: g, height: b, top: w } = p, { points: h, height: E } = ce(t, p), f = !!t.lanes[0].station, L = (m) => {
    const M = t.lanes.findIndex((a) => a.id === m.laneId), k = t.cards.filter((a) => a.laneId === m.laneId).indexOf(m);
    return D((f ? 18 : 8) + h[M].x, h[M].y + w + k * g);
  };
  if (l && n) {
    const m = t.cards.find((M) => "choice-" + M.id === n);
    if (m) return /* @__PURE__ */ e.createElement("g", { id: n, transform: L(m) });
  }
  const C = !f && !t.kind;
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, C && n && t.lanes.map((m, M) => /* @__PURE__ */ e.createElement(
    "rect",
    {
      id: "drop-" + m.id,
      x: h[M].x,
      y: 0,
      width: p.pitch,
      height: E,
      fill: "none",
      pointerEvents: "none",
      "aria-hidden": "true"
    }
  )), t.lanes.flatMap((m, M) => (m.station?.next ?? []).map((k) => {
    const a = h[M], $ = h[t.lanes.findIndex((N) => N.id === k)], W = o / 2 + 8, y = (w - 12) / 2 + 4, S = $.x - a.x, x = $.y - a.y, F = Math.min(S ? o / 2 / Math.abs(S) : 1 / 0, x ? (y - 4) / Math.abs(x) : 1 / 0), T = $.x + W - S * F, R = $.y + y - x * F;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: m.id + "-" + k }, /* @__PURE__ */ e.createElement("line", { x1: a.x + W, y1: a.y + y, x2: T, y2: R, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${T} ${R}) rotate(${Math.atan2(x, S) * 180 / Math.PI})` }));
  })), t.lanes.map((m, M) => {
    const k = t.cards.filter((W) => W.laneId === m.id).length, a = t.kind === "release-plan" && ve(t, m.id), $ = t.kind === "release-plan" ? a + (m.capacity ? " / " + m.capacity : "") + " points" : m.station ? k ? "● Occupied" : "Open stop" : m.capacity ? `${k} of ${m.capacity} slots` : `${k} ${k === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + m.id, transform: D(8 + h[M].x, 4 + h[M].y) }, f && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: o, height: w + Math.max(1, k) * g - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...c && !r ? {
      ...f ? { "data-workshop-station": m.id } : { "data-workshop-lane": m.id },
      role: "button",
      tabIndex: 0,
      "aria-label": "Edit " + m.label,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: o, height: w - 12, rx: f ? 6 : 9, fill: f ? "#253c36" : Re[M] }), (u?.labels.get("heading-" + m.id) ?? xe(m.label)).map((W, y) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + y, fill: f ? "#fffdf3" : "#18302d", transform: D(12, (f ? 23 : 16) + y * 16), fontSize: f ? 17 : 13, fontWeight: "bold" }, W)), /* @__PURE__ */ e.createElement("text", { fill: f ? "#ebd29a" : "#18302d", transform: D(12, w - 23), fontSize: 12 }, $)), s && k < (m.capacity ?? 1 / 0) && /* @__PURE__ */ e.createElement(
      "g",
      {
        "data-workshop-add-card": m.id,
        transform: D(0, w + k * g - 4),
        role: "button",
        tabIndex: 0,
        "aria-label": "Add card to " + m.label,
        cursor: "pointer"
      },
      /* @__PURE__ */ e.createElement("rect", { width: o, height: 40, rx: 7, fill: "#fbfcf9", stroke: "#64796c", strokeDasharray: "4 3" }),
      /* @__PURE__ */ e.createElement("text", { transform: D(12, 25), fontSize: 14 }, "+ Add card")
    ));
  }), t.cards.map((m) => {
    const M = r ? [] : O(t, m), k = "choice-" + m.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: k,
        "data-workshop-card": m.id,
        transform: L(m),
        dragologyZIndex: n === k ? "/1" : !1,
        dragologyOnDrag: M.length > 1 ? () => {
          const a = M.map((W) => ee(t, m.id, W.id));
          if (!C) return d.closest(a).withFloating();
          const $ = M.map((W, y) => d.dropTarget("drop-" + W.id, a[y], { boundsState: t }));
          return d.closest($).whenFar(t).withFloating();
        } : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: f ? o - 20 : o, height: b - (f ? 6 : 0), fill: f ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: f ? 1 : 8 }),
      f && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: D(12, b - 10), fill: "#466358", fontSize: 12 }, m.points, " pts"),
      (u?.labels.get(k) ?? xe(m.label)).map((a, $) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + $, transform: D(12, 17 + $ * 16), fontSize: 14 }, a))
    );
  }));
}
const et = (t) => de(t, !1), tt = (t) => de(t, !0);
function ct({ value: t, onChange: d, onPreview: n, onEditCard: l, onEditStation: r, onEditLane: u, onAddCard: c, onUndo: s, canUndo: p, readOnly: o = !1, fitLanes: g = !1, showPlacementOutcomes: b = !0 }) {
  const w = e.useRef(null), h = e.useRef(null), E = e.useRef(null), [f, L] = e.useState(0), C = g && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const i = w.current;
    if (!C || !i) return;
    const v = () => L(i.clientWidth);
    v();
    const z = new ResizeObserver(v);
    return z.observe(i), () => z.disconnect();
  }, [C]);
  const m = e.useMemo(() => C && f ? je(t, f) : void 0, [C, f, t]), { width: M, height: k } = ce(t, m?.layout), a = t.kind === "release-plan", $ = !!t.signals?.length, [W, y] = e.useState(0), S = e.useRef(!1), x = e.useRef(null), [F, T] = e.useState(null), [R, N] = e.useState(null), [te, fe] = e.useState(null), P = !o && R?.source === t ? R : null, me = e.useRef(t), K = e.useCallback((i) => {
    (a || $) && T(i), n?.(i);
  }, [a, $, n]), q = e.useCallback(() => {
    S.current = !1, x.current = null, N(null), K(null), y((i) => i + 1);
  }, [K]);
  e.useLayoutEffect(() => {
    me.current !== t && (S.current || R) && q(), me.current = t;
  }, [t, R, q]);
  const Q = (i, v) => {
    S.current = !1, N(null), K(null), i !== t && (a && !s && fe({ before: t, after: i }), d(i, v));
  }, Ce = (i) => {
    const v = i.cards.find((z) => z.id === x.current);
    Q(i, v && { cardId: v.id, laneId: v.laneId });
  }, Le = e.useCallback((i) => {
    const v = i.type === "dragging" ? i : i.pendingDrag?.status;
    S.current = !!v, v ? (x.current = v.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, N(null)) : x.current !== null && (x.current = null, K(null));
  }, [K]);
  e.useEffect(() => {
    function i(v) {
      !S.current && !R || v instanceof KeyboardEvent && v.key !== "Escape" || q();
    }
    return document.addEventListener("keydown", i), document.addEventListener("pointercancel", i), window.addEventListener("blur", i), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("pointercancel", i), window.removeEventListener("blur", i);
    };
  }, [q, R]);
  const Y = o ? null : P?.next ?? F, A = !!(o || P), ue = !!t.lanes[0].station, ne = !A && (ue ? !!r : !a && !!u), re = !A && !ue && !a && !!c && t.cards.length < Pe, Se = e.useMemo(() => m || ne || re ? (i) => de(i, A, m, ne, re) : A ? tt : et, [m, A, ne, re]), oe = "[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]";
  function ae(i) {
    A || (i.dataset.workshopStation ? r?.(i.dataset.workshopStation) : i.dataset.workshopLane ? u?.(i.dataset.workshopLane, i) : i.dataset.workshopAddCard && c?.(i.dataset.workshopAddCard, i));
  }
  const We = Y ? Math.max(k, ce(Y, m?.layout).height) : k;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: w,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (i) => {
        const v = i.target.closest(oe);
        !v || !["Enter", " "].includes(i.key) || (i.preventDefault(), i.repeat || ae(v));
      },
      onClickCapture: (i) => {
        const v = i.target.closest(oe);
        v && i.detail === 0 && ae(v);
      },
      onPointerDownCapture: (i) => {
        if (h.current = null, A || !i.isPrimary || i.button !== 0) return;
        const v = i.target.closest(oe + ",[data-workshop-card]");
        v && (h.current = { target: v, x: i.clientX, y: i.clientY });
      },
      onPointerMoveCapture: (i) => {
        h.current && Math.hypot(i.clientX - h.current.x, i.clientY - h.current.y) > 5 && (h.current = null, E.current = null);
      },
      onPointerCancelCapture: () => {
        h.current = null, E.current = null;
      },
      onPointerUpCapture: (i) => {
        const v = h.current;
        if (h.current = null, !v || A) return;
        const z = v.target.dataset.workshopCard;
        if (!z) {
          E.current = null, ae(v.target);
          return;
        }
        l && (E.current?.id === z && i.timeStamp - E.current.at < 400 ? (E.current = null, l(z)) : E.current = { id: z, at: i.timeStamp });
      }
    },
    /* @__PURE__ */ e.createElement(
      X,
      {
        key: o ? "read-only" : W,
        draggable: Se,
        state: P?.next ?? t,
        onDropState: o ? void 0 : Ce,
        onDragState: o ? void 0 : K,
        onDragStatus: Le,
        width: M,
        height: We
      }
    )
  ), $ && b && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Be(Y ?? t).map((i) => /* @__PURE__ */ e.createElement("p", { key: i.id }, /* @__PURE__ */ e.createElement("strong", null, i.label), /* @__PURE__ */ e.createElement("br", null), i.text))), a && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Ve, { value: t, preview: Y }), !o && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    Xe,
    {
      value: t,
      preview: P?.move ?? null,
      stage: (i, v) => {
        N({ source: t, next: i, move: v }), n?.(i);
      },
      cancel: q,
      apply: () => {
        P && (Q(P.next, P.move), K(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(s ? p : te?.after === t), onClick: () => {
    q(), s ? s() : te?.after === t && (fe(null), d(te.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((i) => {
    const v = t.lanes.find((z) => z.id === i.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: i.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, i.label, " · ", v.label), /* @__PURE__ */ e.createElement("br", null), v.station.outcome), v.station.image && /* @__PURE__ */ e.createElement(
      "img",
      {
        src: v.station.image.src,
        alt: v.station.image.alt,
        referrerPolicy: "no-referrer",
        style: { display: "block", maxWidth: "100%", width: 360, maxHeight: 240, objectFit: "contain", objectPosition: "left", marginBlock: "8px" }
      }
    ), O(t, i).filter((z) => z.id !== i.laneId).map((z) => /* @__PURE__ */ e.createElement("button", { key: z.id, type: "button", disabled: o, onClick: () => Q(ee(t, i.id, z.id), { cardId: i.id, laneId: z.id }) }, i.label, " → ", z.label)));
  })), !a && t.cards.length > 0 && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((i) => /* @__PURE__ */ e.createElement("label", { key: i.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, i.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: o,
      "aria-label": "Move " + i.label,
      value: P?.move.cardId === i.id ? P.move.laneId : i.laneId,
      onChange: (v) => {
        const z = { cardId: i.id, laneId: v.currentTarget.value }, _ = ee(t, i.id, z.laneId);
        $ ? _ === t ? q() : (N({ source: t, next: _, move: z }), n?.(_)) : Q(_, z);
      }
    },
    O(t, i).map((v) => /* @__PURE__ */ e.createElement("option", { key: v.id, value: v.id }, v.label))
  ))), P && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => Q(P.next, P.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: q }, "Cancel move"))));
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
  G as printFields,
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
