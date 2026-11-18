import e, { useState as P, useRef as F, useMemo as Le, useLayoutEffect as ne, useEffect as j, useId as Fe } from "react";
import { DraggableRenderer as U, translate as I, param as Re, inOrder as Be } from "./dragology.mjs";
import { handoffSummary as Ee, reviewHandoff as te, resolveHandoff as xe, offlineHandoff as Ae, listeningRoom as ye, listeningRoomCaption as ke, workshopLayout as pe, releaseLoad as Se, availableLanes as oe, moveWorkshopCard as ae, canHangPanel as ue, hangGalleryPanel as re, printFields as G, startupExperienceKind as He, resolveWorkshopSignals as We, workshopBudgetResult as we, interviews as Ke, channels as Te, planStartupMove as ce, workshopPositions as me, maxWorkshopCards as Ge, laneColors as je } from "./workshop-model.mjs";
import { addWorkshopBranch as vt, addWorkshopCard as Mt, addWorkshopLane as $t, createBudgetWorkshop as zt, createInterviewWorkshop as Lt, createLaneWorkshop as St, createWorkshopMap as Wt, decodeWorkshopFragment as Ct, describeFocusDarkroom as Nt, encodeWorkshopFragment as Pt, industrialWorkshop as It, initialFocusDarkroom as Dt, moonGallery as qt, nightTransfer as Ft, normalizeFocusDarkroom as Rt, normalizeListeningRoom as Bt, normalizeMoonGallery as At, normalizeOfflineHandoff as Ht, releasePlan as Kt, validateWorkshop as Tt, workshopPresentationLanes as Gt, workshopPresentationScenes as jt, workshopToSlate as Qt } from "./workshop-model.mjs";
function Qe(t, p, n) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${p}) scale(${n} ${n * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + l, d: `M59 ${l}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function Xe(t, p) {
  const n = t ? 9 : 49, l = t ? 20 : 23, a = t ? 144 : 181, g = t ? 183 : 370, d = t ? 35 : 40, c = t ? 164 : 255, h = t ? 119 : 147, o = 45, y = (E, z, w, x, b = "#243c32", v = "normal", k = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: I(E, z), fill: b, fontSize: x, fontFamily: k, fontWeight: v }, w);
  return ({ state: E, d: z, draggedId: w }) => {
    const x = E.stage === "queued", b = E.stage === "resolved", v = g + (c - h) / 2, k = d + 138, W = x ? n + (a - h) / 2 : v, L = x ? l + 141 : k, u = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${n + a - 2} ${l + 180} C${n + a + 45} ${l + 235},${g - 24} ${d + 204},${g + 22} ${d + 159}`, fill: "none", stroke: x ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: x ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: I(n, l) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: a, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: a - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: a / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), y(13, 27, "17:08", 9, u, "bold"), y(a - 50, 27, x ? "Offline" : "Online", 10, x ? "#835420" : "#266451", "bold"), y(13, 47, "Field log", t ? 18 : 20, u, "bold"), Qe(13, 55, (a - 26) / 142), y(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, u), /* @__PURE__ */ e.createElement("rect", { x: a / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: I(g, d) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${c - 5} -3 5 190 -${c - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${c - 1} -3 3 183 -${c - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: c, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + i, cx: "8", cy: i, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), y(23, 38, x ? "SHIFT HANDOFF" : b ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), y(22, 69, "Gate B", t ? 30 : 37, u, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${c - 42}`, stroke: "#bfc5b1" }), y(23, 101, (b && E.choice === "field" ? E.fieldNote : E.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, u, "bold"), y(23, 120, b && E.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: I((c - h) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: h, height: o, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), y(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: I(W, L),
        dragologyZIndex: w === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !p && x ? () => z.closest([E, te(E)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${h - 2}v${o - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${h}v${o - 7}l-7 7H0z`, fill: b ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${h - 7} ${o}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + i, cx: "8", cy: i, r: "1.3", fill: "#84662e" })),
      y(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      y(17, 34, b ? "Reviewed" : E.fieldNote === Ae.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const Ye = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function bt({ value: t, onChange: p, readOnly: n = !1 }) {
  const [l, a] = P(null), [g, d] = P(null), [c, h] = P(0), [o, y] = P(!1), [E, z] = P(1), w = F(null), x = F(!1), b = F(t), v = Le(() => Xe(o, n), [o, n]), k = n ? t : g ?? l ?? t, W = t.stage === "queued" && k.stage === "review";
  function L() {
    x.current = !1, d(null), a(null), h((i) => i + 1);
  }
  function u(i) {
    L(), !n && i.stage !== t.stage && p?.(i);
  }
  return ne(() => {
    (x.current || g) && (n || b.current !== t) && L(), b.current = t;
  }, [t, n, g]), ne(() => {
    const i = () => {
      const S = w.current.clientWidth;
      y(S < 510), z(Math.min(1, S / (S < 510 ? 360 : 685)));
    };
    i();
    const M = new ResizeObserver(i);
    return M.observe(w.current), () => M.disconnect();
  }, []), j(() => {
    function i(M) {
      (x.current || g) && (!(M instanceof KeyboardEvent) || M.key === "Escape") && L();
    }
    return document.addEventListener("keydown", i), document.addEventListener("pointercancel", i), window.addEventListener("blur", i), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("pointercancel", i), window.removeEventListener("blur", i);
    };
  }, [g]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": n, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, Ye), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: w, style: { "--drawing-scale": E } }, /* @__PURE__ */ e.createElement(
    U,
    {
      key: n ? "read-only" : c,
      state: g ?? t,
      draggable: v,
      width: o ? 360 : 685,
      height: o ? 254 : 262,
      onDragState: n ? void 0 : (i) => {
        x.current = !0, a(i.stage !== t.stage && t.stage === "queued" ? i : null);
      },
      onDropState: n ? void 0 : u
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (k.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", k.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, Ee(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, W ? "The two access reports disagree." : Ee(t)), !n && (t.stage === "queued" ? W ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => u(te(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: L }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(te(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => u(xe(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => u(xe(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => u(te(t)) }, "Reopen review")), !n && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => u({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function Ve() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const p = new t(), n = p.sampleRate, l = n * 4, a = p.createBuffer(1, l, n), g = p.createBuffer(1, l, n), d = a.getChannelData(0), c = g.getChannelData(0);
  let h = 419;
  function o() {
    return h = 1664525 * h + 1013904223 >>> 0, h / 4294967296;
  }
  for (let E = 0; E < 100; E++) {
    const z = Math.floor(o() * l), w = 380 + o() * 1500, x = 0.09 + o() * 0.08;
    for (let b = 0; b < n * 0.12; b++) {
      const v = b / n, k = Math.sin(2 * Math.PI * w * v) + 0.22 * (o() * 2 - 1);
      d[(z + b) % l] += x * Math.exp(-v * 76) * k;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((E, z) => {
    const w = Math.floor((z * 0.93 + 0.1) * n);
    for (let x = 0; x < n * 1.6; x++) {
      const b = x / n, v = Math.sin(b * E * 2 * Math.PI) + 0.23 * Math.sin(b * E * 5.42 * Math.PI);
      c[(w + x) % l] += 0.16 * Math.min(1, b * 250) * Math.exp(-b * 3.3) * v;
    }
  });
  const y = [a, g].map((E) => {
    const z = p.createBufferSource(), w = p.createGain();
    return w.gain.value = 0, z.buffer = E, z.loop = !0, z.connect(w).connect(p.destination), z.start(), w;
  });
  return {
    ctx: p,
    mix(E) {
      y[0].gain.setTargetAtTime(Math.cos(E * Math.PI / 2), p.currentTime, 0.035), y[1].gain.setTargetAtTime(Math.sin(E * Math.PI / 2), p.currentTime, 0.035);
    },
    stop() {
      p.close();
    }
  };
}
function Ce({ state: t, d: p, isTracking: n }, l) {
  const a = t.mix, g = 106 + 420 * a, d = I(g, 220);
  return n ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: d }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (c, h) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + h, cx: 18 + h * 137 % 604, cy: 12 + h * 47 % 103, r: h % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - a * 0.45 }, Array.from({ length: 30 }, (c, h) => {
    const o = 29 + h * 31 % 184, y = 24 + h * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + h, d: `M${o} ${y}l-3 8`, stroke: h % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: h % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((c) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + c, d: `M${39 + c * 15} ${116 + c * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((c) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + c, d: `M${65 + c * 35} ${177 - c * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + a * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((c) => {
    const h = 407 + c * 32, o = 63 - c % 3 * 4, y = 52 + (c + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + c, transform: I(h, o) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${y}l-8 5-8-6z`, fill: c % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${y + 7}l7-5V13z`, fill: c % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${y - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: a })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: d, dragologyOnDrag: l ? void 0 : () => p.vary(t, Re("mix"), { constraint: (c) => Be([0, c.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + a * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const _e = (t) => Ce(t, !1), Ue = (t) => Ce(t, !0), Ze = `
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
function gt({ value: t, onChange: p, readOnly: n = !1 }) {
  const l = F(null), a = F(null), [g, d] = P(null), [c, h] = P(0), [o, y] = P(1), [E, z] = P(!1), [w, x] = P(!1), b = g ?? t, v = F(t), k = F(!1);
  function W() {
    k.current = !1, d(null), h((r) => r + 1);
  }
  ne(() => {
    k.current && (n || t !== v.current) && W(), v.current = t;
  }, [t, n]), ne(() => {
    const r = l.current, m = () => y(Math.min(1, r.clientWidth / 640));
    m();
    const f = new ResizeObserver(m);
    return f.observe(r), () => f.disconnect();
  }, []), j(() => {
    function r(m) {
      k.current && (!(m instanceof KeyboardEvent) || m.key === "Escape") && W();
    }
    return document.addEventListener("keydown", r), document.addEventListener("pointercancel", r), window.addEventListener("blur", r), () => {
      document.removeEventListener("keydown", r), document.removeEventListener("pointercancel", r), window.removeEventListener("blur", r);
    };
  }, []);
  function L(r) {
    k.current = !1, d(null), !n && r !== t.mix && p?.({ ...t, mix: r });
  }
  function u() {
    a.current?.stop(), a.current = null, z(!1);
  }
  j(() => {
    a.current?.mix(b.mix);
  }, [b.mix]), j(() => {
    const r = new IntersectionObserver(([f]) => {
      f.isIntersecting || u();
    });
    r.observe(l.current);
    const m = () => {
      document.hidden && u();
    };
    return document.addEventListener("visibilitychange", m), () => {
      r.disconnect(), document.removeEventListener("visibilitychange", m), a.current?.stop(), a.current = null;
    };
  }, []);
  async function i() {
    if (a.current) {
      u();
      return;
    }
    try {
      const r = Ve();
      a.current = r, r.mix(b.mix), await r.ctx.resume(), a.current === r && z(!0);
    } catch {
      u(), x(!0);
    }
  }
  const M = t.leftLabel === ye.leftLabel ? "rain" : t.leftLabel, S = t.rightLabel === ye.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, Ze), /* @__PURE__ */ e.createElement(
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
      "aria-valuenow": Math.round(b.mix * 100),
      "aria-valuetext": ke(b),
      onKeyDown: (r) => {
        if (n) return;
        const m = {
          ArrowLeft: b.mix - 0.01,
          ArrowRight: b.mix + 0.01,
          ArrowDown: b.mix - 0.01,
          ArrowUp: b.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(m, r.key) && (r.preventDefault(), L(Math.round(100 * Math.min(1, Math.max(0, m[r.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      U,
      {
        key: n ? "read-only" : c,
        state: t,
        draggable: n ? Ue : _e,
        width: 640,
        height: 276,
        onDragState: n ? void 0 : (r) => {
          k.current = r !== null, d(r);
        },
        onDropState: n ? void 0 : (r) => L(r.mix)
      }
    )
  ), !n && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0) }, "Listen to ", M), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => L(1) }, "Listen to ", S)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, ke(b))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: i, "aria-pressed": E, disabled: w }, w ? "Audio unavailable" : E ? "Mute sound" : "Enable sound")));
}
function Je(t, p, n) {
  const l = [];
  let a = "";
  for (const g of t.split(/\s+/u)) {
    const d = a ? a + " " + g : g;
    if (n.measureText(d).width <= p) {
      a = d;
      continue;
    }
    a && l.push(a), a = "";
    for (const c of g)
      a && n.measureText(a + c).width > p && (l.push(a), a = ""), a += c;
  }
  return a && l.push(a), l;
}
function Oe(t, p, n = !1) {
  const l = n ? Math.max(...t.lanes.map((w) => w.station.column)) + 1 : t.lanes.length, a = n ? (l - 1) * 28 : 0, g = Math.min(n ? 202 : pe.pitch, Math.max(n ? 145 : 124, Math.floor((p - a) / l))), d = g - 16, c = document.createElement("canvas").getContext("2d"), h = /* @__PURE__ */ new Map();
  function o(w, x, b) {
    c.font = b;
    let v = 1;
    for (const k of w) {
      const W = n && x === "choice-" ? 49 : 25, L = Je(k.label, d - W, c);
      h.set(x + k.id, L), v = Math.max(v, L.length);
    }
    return v;
  }
  const y = o(t.lanes, "heading-", n ? "bold 15px system-ui, sans-serif" : "bold 13px system-ui, sans-serif"), E = o(t.cards, "choice-", "14px system-ui, sans-serif");
  if (n) {
    const w = 16 * E + 22;
    return { labels: h, layout: { pitch: g, width: d, height: w, row: w + 6, top: 16 * y + 32 } };
  }
  const z = Math.max(pe.height, 16 * E + 14);
  return { labels: h, layout: { pitch: g, width: d, height: z, row: z + 12, top: 16 * y + 45 } };
}
function et({ value: t, preview: p }) {
  const n = p ?? t, l = new Map(n.lanes.map((d) => [d.id, d.label])), a = new Map(n.cards.map((d) => [d.id, d])), g = n.cards.flatMap((d) => (d.dependsOn ?? []).map((c) => ({ feature: d, prerequisite: a.get(c) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), n.lanes.filter((d) => d.capacity !== void 0).map((d) => {
    const c = Se(n, d.id);
    return /* @__PURE__ */ e.createElement("div", { key: d.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, d.label), /* @__PURE__ */ e.createElement("output", { "aria-label": d.label + " capacity" }, c, " / ", d.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": d.label + " point budget", min: 0, max: d.capacity, value: c, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), g.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, g.map(({ feature: d, prerequisite: c }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([d.id, c.id]) }, /* @__PURE__ */ e.createElement("strong", null, d.label), " needs ", c.label, " · ", l.get(c.laneId))))), p && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, n.cards.filter((d) => t.cards.find((c) => c.id === d.id)?.laneId !== d.laneId).map((d) => d.label + " → " + l.get(d.laneId)).join(" · ")));
}
function tt({ value: t, preview: p, stage: n, apply: l, cancel: a }) {
  const [g, d] = P(t.cards[0].id), c = t.cards.find((o) => o.id === g) ?? t.cards[0], h = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (o) => {
    o.key === "Escape" && (a(), o.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: h }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: h, value: c.id, onChange: (o) => {
    d(o.target.value), a();
  } }, t.cards.map((o) => /* @__PURE__ */ e.createElement("option", { key: o.id, value: o.id }, o.label))), /* @__PURE__ */ e.createElement("div", null, oe(t, c).filter((o) => o.id !== c.laneId).map((o) => /* @__PURE__ */ e.createElement("button", { key: o.id, type: "button", onClick: () => n(ae(t, c.id, o.id), { cardId: c.id, laneId: o.id }) }, "Preview ", o.label))), p && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: l }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: a }, "Cancel preview")));
}
const ve = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], rt = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], K = 148, _ = 104;
function nt(t) {
  const p = (n, l, a) => {
    const g = Array.from({ length: 38 }, (d, c) => {
      const h = Math.min(K, 4 * c), o = t * K + h, y = n + l * (Math.sin(o / 46) + 0.39 * Math.cos(o / 19) + 0.09 * Math.sin(o / 7));
      return (c ? "L" : "M") + h + " " + y.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: g + `L${K} ${_}H0z`, fill: a });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: K + 8, height: _ + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: K + 4, height: _ + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: K, height: _, fill: "#343b66" }), Array.from({ length: 13 }, (n, l) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + l, cx: 6 + (l * 77 + t * 19) % 136, cy: 4 + (l * 29 + t * 11) % 35, r: l % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), p(48, 7, "#9b88aa"), p(59, 10, "#bf9492"), p(75, 7, "#596d83"), p(88, 6, "#2a4858"), Array.from({ length: 7 }, (n, l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + l, d: `M${4 + (l * 37 + t * 13) % 124} ${92 + l * 3 % 10}h${4 + l % 3 * 4}`, stroke: "#7d9b9a" })));
}
function ot(t, p) {
  return ({ state: n, d: l, draggedId: a, isTracking: g }) => {
    const d = (o) => o === 1 ? "panorama-panel" : "gallery-panel-" + o, c = (o) => (n.hung.includes(n.panels[o].id) ? ve : rt)[o], h = n.panels.findIndex((o, y) => d(y) === a);
    if (g && h >= 0) {
      const o = c(h);
      return /* @__PURE__ */ e.createElement("g", { id: d(h), transform: I(o.x, o.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + o, d: `M${40 + 83 * o} 225l${(o - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((o) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + o, transform: I(163 + o * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), n.panels.map((o, y) => {
      const E = ve[y], z = c(y), w = !t && (!p || p.includes(o.id)) && ue(n, o.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: o.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: y === 1 ? "gallery-hook" : "gallery-hook-" + y,
          x: E.x,
          y: E.y,
          width: K,
          height: _,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: E.x + K / 2, cy: E.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: d(y),
          transform: I(z.x, z.y),
          dragologyZIndex: a === d(y) ? "/1" : !1,
          dragologyOnDrag: w ? () => l.between([n, re(n, o.id)]) : void 0
        },
        nt(["dunes", "moon", "coast"].indexOf(o.artwork))
      ));
    }));
  };
}
function ht({ value: t, onChange: p, onPreview: n, readOnly: l = !1, enabledIds: a }) {
  const g = e.useRef(null), [d, c] = e.useState(1), [h, o] = e.useState(0), [y, E] = e.useState(null), z = e.useRef(t);
  z.current = t;
  const w = e.useMemo(() => ot(l, a), [l, a]), x = (i) => {
    E(i), n?.(i);
  }, b = e.useRef(n);
  b.current = n;
  const v = e.useCallback(() => {
    E(null), b.current?.(null), o((i) => i + 1);
  }, []);
  e.useEffect(() => {
    const i = new ResizeObserver(() => {
      g.current && c(Math.min(1, g.current.clientWidth / 640));
    });
    return i.observe(g.current), () => i.disconnect();
  }, []), e.useEffect(() => {
    v();
    const i = (M) => {
      M.key === "Escape" && v();
    };
    return document.addEventListener("keydown", i), window.addEventListener("blur", v), () => {
      document.removeEventListener("keydown", i), window.removeEventListener("blur", v);
    };
  }, [t, l, v]);
  function k(i) {
    if (x(null), l || z.current !== t) return;
    const M = i.hung.find((S) => !t.hung.includes(S));
    M && (!a || a.includes(M)) && ue(t, M) && p(re(t, M));
  }
  const W = y ?? t, L = W.panels.find((i) => W.hung.includes(i.id) && !t.hung.includes(i.id)), u = t.panels.filter((i) => !t.hung.includes(i.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: g, onPointerCancel: v, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: d, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    U,
    {
      key: h,
      draggable: w,
      width: 640,
      height: 300,
      state: t,
      onDragState: x,
      onDropState: k
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, W.panels.map((i, M) => /* @__PURE__ */ e.createElement("svg", { key: i.id, x: M * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: W.hung.includes(i.id) ? "#343b66" : "#c7b8a8" }), W.hung.includes(i.id) && /* @__PURE__ */ e.createElement("g", null, i.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: i.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : i.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, L ? L.label + " lines up with its hook." : u.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !l && u.filter((i) => (!a || a.includes(i.id)) && ue(t, i.id)).map((i) => /* @__PURE__ */ e.createElement("button", { key: i.id, type: "button", onFocus: () => x(re(t, i.id)), onBlur: () => x(null), onClick: () => k(re(t, i.id)) }, "Hang ", i.label)));
}
const at = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", de = { start: 99, opener: 361 }, lt = { route: null }, Me = "#ffcb62";
function $e(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((p) => /* @__PURE__ */ e.createElement("g", { key: p, transform: "scale(" + p + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (p, n) => {
    const l = 33 - n * 6, a = 9 + 16 * Math.sin(n / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${l}q${-a} -2 ${-a - 4} -15q${a} 1 ${a + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${l - 3}q${a - 1} -3 ${a + 2} -15q${-a} 3 ${-a - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (p, n) => {
    const l = (n - 5.5) * 6, a = -18 - 22 * Math.sin(n * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: n }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${l * 0.35} 6 ${l} ${a}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((g) => /* @__PURE__ */ e.createElement("path", { key: g, d: `M${l * g / 5} ${35 + (a - 35) * g / 5}q${l * 0.15 - 5} -4 ${l * 0.25 - 7} -13m${7 - l * 0.25} 13q6 -6 7 -13` })));
  }));
}
function Ne({ state: t, d: p, isTracking: n }, l = !1) {
  const a = t.route ? de[t.route] : 232, g = t.route ? 48 : 85;
  return n ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: I(a, g) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [de.start, de.opener].map((d, c) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(d) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${d} 85 ${d} 48V0`, fill: "none", stroke: t.route === "start" && c === 0 || t.route === "opener" && c === 1 ? Me : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: c ? "opener-jack" : "first-jack", cx: d, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: d, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, c ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: I(a, g), dragologyOnDrag: l ? void 0 : () => p.closest([lt, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: Me, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function it(t) {
  return Ne(t, !0);
}
function Et({ value: t, onChange: p, readOnly: n = !1 }) {
  const l = n || !p, [a, g] = P(null), [d, c] = P(0), [h, o] = P(1), [y, E] = P(""), [z, w] = P(null), [x, b] = P(1), v = F(null), k = F(null), W = F([]), L = Fe(), u = Le(() => ({ route: t.route }), [t.route]), i = (!l && a ? a : u).route;
  j(() => {
    const f = v.current, C = new ResizeObserver(() => b(Math.min(1, f.clientWidth / 460)));
    return C.observe(f), () => C.disconnect();
  }, []);
  function M(f) {
    l || (g(null), E(""), p?.({ ...t, route: f.route }));
  }
  function S(f) {
    o(f), w(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), k.current?.showModal();
  }
  function r() {
    const f = t.route === "start" ? 0 : h;
    W.current[f]?.focus({ preventScroll: !0 });
    const C = t[G[f]];
    E(f === h ? "Focus returned to " + C + ", the print you opened." : "Focus jumped to " + C + ". You opened " + t[G[h]] + ".");
  }
  function m() {
    c((f) => f + 1), g(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": l || void 0,
      onPointerCancel: m,
      onKeyDown: (f) => {
        f.key === "Escape" && !k.current?.open && m();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, at),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, l ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, G.map((f, C) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: f,
        ref: (D) => {
          W.current[C] = D;
        },
        "aria-label": "Open " + t[f],
        onClick: () => S(C)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, $e(C)),
      /* @__PURE__ */ e.createElement("span", null, t[f])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: v, style: { "--circuit-scale": x } }, /* @__PURE__ */ e.createElement(
      U,
      {
        key: l ? "locked" : d,
        state: u,
        width: 460,
        height: 108,
        draggable: l ? it : Ne,
        onDragState: l ? void 0 : g,
        onDropState: l ? void 0 : M
      }
    )),
    !l && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "start", onClick: () => M({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": i === "opener", onClick: () => M({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, i === "start" ? "Every viewer returns to the first print." : i === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, y || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: k, onClose: r, "aria-labelledby": L, onKeyDown: (f) => {
      f.key === "Escape" && (f.preventDefault(), f.stopPropagation(), f.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, $e(h)), /* @__PURE__ */ e.createElement("h2", { id: L }, t[G[h]]), !l && z !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (f) => {
      f.preventDefault(), z.trim() && (p?.({ ...t, [G[h]]: z.trim() }), w(null), k.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: z, onChange: (f) => w(f.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !z.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => w(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => k.current?.close() }, "Close viewer"), !l && z === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => w(t[G[h]]) }, "Rename print"))
  );
}
const st = '.pilot-board{--ink:#243d33;box-sizing:border-box;color:var(--ink);background:#efece3;padding:clamp(14px,3.5vw,35px);font:15px/1.4 system-ui,sans-serif}.pilot-board *,.pilot-board *:before{box-sizing:border-box}.pilot-board header{margin:0 0 1.4rem;color:inherit;background:none;display:block;position:static;padding:0;border:0}.pilot-board header h2{font:700 clamp(30px,5vw,52px)/1 "Pilot Narrow",sans-serif;margin:.28em 0;color:inherit;letter-spacing:-.025em}.pilot-board p{margin:0}.pilot-board .pilot-kicker{font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}.pilot-board button{font:inherit;cursor:pointer;color:inherit}.pilot-board button:focus-visible,.pilot-board a:focus-visible{outline:3px solid #007486;outline-offset:3px}.pilot-board footer{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;padding:14px 0 0;margin:0;background:none;color:inherit;border:0}.pilot-board footer a{color:inherit;text-underline-offset:.24em;font-weight:700}.pilot-board footer button{background:transparent;border:0;text-decoration:underline;text-underline-offset:.23em}.pilot-board .interview-desk{display:grid;grid-template-columns:minmax(0,.94fr) minmax(0,1.2fr);gap:clamp(12px,3vw,32px);align-items:center}.pilot-board .quote-stack{display:grid;gap:10px;padding:4px}.pilot-board .quote{border:1px solid #a79e88;border-radius:2px;box-shadow:2px 3px #756d592b;padding:11px 14px;display:grid;gap:6px;text-align:left;touch-action:none;cursor:grab;position:relative}.pilot-board .quote small{font:600 11px/1.3 ui-monospace,monospace}.pilot-board .quote strong{font:600 clamp(15px,2.1vw,22px)/1.15 Georgia,serif}.pilot-board .quote-preview{background:#f5d989}.pilot-board .quote-duplicate{background:#c5dacf}.pilot-board .quote-undo{background:#ded1ea}.pilot-board .quote[aria-pressed=true]{outline:2px solid #385947;outline-offset:1px}.pilot-board .prototype-slot{position:relative;background:#254a3e;color:#fcf9ee;padding:30px clamp(12px,3vw,26px) 16px;border:2px dashed transparent;border-radius:4px}.pilot-board .prototype-slot.drop-active{border-color:#edc65e}.pilot-board .prototype-screen{background:#fffdf7;color:#233a30;border:1px solid #162d25;border-radius:6px;box-shadow:3px 4px #102b2166;overflow:hidden}.pilot-board .prototype-screen>strong{display:block;padding:15px 12px 7px;font-size:clamp(16px,2.3vw,24px)}.pilot-board .prototype-bar,.pilot-board .prototype-row{display:flex;align-items:center;justify-content:space-between;gap:5px;padding:8px 12px;font-size:12px}.pilot-board .prototype-bar{background:#e8eade;border-bottom:1px solid #c3cbbe;font-weight:650}.pilot-board .prototype-bar span+span,.pilot-board .prototype-row span+span{font:11px/1.3 ui-monospace,monospace}.pilot-board .prototype-row{margin:0 10px;padding:8px 2px;border-bottom:1px solid #e1e5da}.pilot-board .prototype-screen p{padding:8px 12px 12px;color:#355d49;font-weight:650;font-size:12px}.pilot-board .test-brief{margin-top:14px}.pilot-board .test-brief strong{font-size:18px}.pilot-board .test-brief p{font-size:13px;margin-top:3px}.pilot-board .design-cursor{position:absolute;right:17px;top:5px;font:700 10px/1.5 ui-monospace,monospace;color:#f8d7bc;pointer-events:none}.pilot-board .design-cursor span{display:inline-block;transform:rotate(-126deg)}@media (prefers-reduced-motion:no-preference){.pilot-board .design-cursor{animation:point-to-screen .45s ease-out}@keyframes point-to-screen{0%{transform:translate(15px,12px)}to{transform:translate(0)}}}.pilot-board .budget-board{background:#e1e8dc}.pilot-board .budget-ledger{padding:clamp(12px,2.5vw,24px);background:#fcf9f0;border:1px solid #9fae9e}.pilot-board .budget-heading,.pilot-board .reserve{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.pilot-board .budget-heading{font-weight:700}.pilot-board .budget-heading b{font:700 clamp(22px,3vw,32px)/1 "Pilot Narrow",sans-serif}.pilot-board .budget-heading small{font:400 12px/1.4 system-ui,sans-serif}.pilot-board .budget-bar{display:flex;gap:2px;margin:12px 0;height:10px}.pilot-board .budget-bar span{flex:1}.pilot-board .band-calls{background:#386759}.pilot-board .band-pilot{background:#b8804f}.pilot-board .band-newsletter{background:#80698c}.pilot-board .band-reserve{background:#dfded2}.pilot-board .budget-chips,.pilot-board .budget-targets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.pilot-board .budget-chips{margin:14px 0 18px}.pilot-board .budget-chips button{background:#f4e6bd;border:1px solid #b7a46b;border-left:4px solid #a98b43;display:grid;justify-items:start;text-align:left;align-content:start;gap:3px;padding:9px 10px;touch-action:none;cursor:grab}.pilot-board .budget-chips button[aria-pressed=true]{outline:2px solid #485e49;outline-offset:1px}.pilot-board .budget-chips small{font:11px/1.2 ui-monospace,monospace}.pilot-board .budget-chips span{font-size:12px}.pilot-board .budget-chips strong,.pilot-board .budget-targets b{font:700 clamp(22px,4vw,38px)/1.1 "Pilot Narrow",sans-serif}.pilot-board .budget-targets button{border:1px dashed #969a8b;border-radius:4px;display:grid;grid-template-rows:1fr auto auto;text-align:left;gap:4px;padding:12px 10px}.pilot-board .budget-targets strong{font-size:14px;line-height:1.15}.pilot-board .budget-targets span{font-size:12px}.pilot-board .target-calls{background:#d6e5d9}.pilot-board .target-newsletter{background:#e6ddeb}.pilot-board .target-pilot{background:#f1ddc6}.pilot-board .reserve{width:100%;border:0;border-top:1px solid #b4baad;background:none;margin-top:14px;padding:10px 0 0;font-size:13px}.pilot-board .pilot-ghost{position:fixed;z-index:10;pointer-events:none;background:#25382e;color:#fff9ee;box-shadow:1px 4px 10px #0003;padding:6px 10px;border-radius:3px;font:600 12px/1.3 system-ui,sans-serif}@media (max-width:480px){.pilot-board .interview-desk{grid-template-columns:1fr;gap:12px}.pilot-board .quote-stack{gap:6px}.pilot-board .quote{padding:8px 10px;gap:3px}.pilot-board footer{font-size:14px}.pilot-board .budget-chips,.pilot-board .budget-targets{gap:5px}.pilot-board .budget-targets button,.pilot-board .budget-chips button{padding:8px 5px}.pilot-board .budget-targets strong{font-size:12px}.pilot-board .budget-targets span,.pilot-board .budget-chips span{font-size:11px}}.pilot-board button:disabled{cursor:default}';
function xt({ value: t, readOnly: p = !1, onChange: n }) {
  const l = He(t), a = F(null), [g, d] = P(null), [c, h] = P(null), [o, y] = P(null), [E, z] = P("fund-1"), w = g?.base === t && !p ? g.next : t, x = t.cards.some((r) => r.id === E) ? E : t.cards[0]?.id;
  function b() {
    a.current = null, h(null), y(null), d(null);
  }
  j(() => {
    if (!c) return;
    const r = (m) => {
      m.key === "Escape" && b();
    };
    return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
  }, [c]);
  function v(r, m) {
    const f = !p && ce(t, r, m);
    f && n?.(f);
  }
  function k(r) {
    l === "customer-interviews" ? v(r, "prototype") : z(r);
  }
  function W(r) {
    const m = document.elementFromPoint(r.clientX, r.clientY)?.closest("[data-drop]");
    return m && m.closest(".pilot-board") === r.currentTarget.closest(".pilot-board") ? m.dataset.drop : void 0;
  }
  function L(r) {
    return {
      disabled: p,
      onClick: (m) => {
        m.detail === 0 && k(r);
      },
      onPointerDown: (m) => {
        p || !m.isPrimary || m.button !== 0 || (m.currentTarget.setPointerCapture(m.pointerId), a.current = { card: r, board: t, x: m.clientX, y: m.clientY, moved: !1 }, h(r));
      },
      onPointerMove: (m) => {
        const f = a.current;
        if (!f || f.card !== r) return;
        if (f.board !== t || p) return b();
        if (f.moved || (f.moved = Math.hypot(m.clientX - f.x, m.clientY - f.y) > 5), !f.moved) return;
        y({ left: m.clientX + 10, top: m.clientY + 10 });
        const C = W(m), D = C && ce(t, r, C);
        d(D ? { base: t, next: D } : null);
      },
      onPointerUp: (m) => {
        const f = a.current;
        if (!f || f.card !== r) return;
        const C = W(m);
        b(), !(p || f.board !== t) && (f.moved ? C && v(r, C) : k(r));
      },
      onLostPointerCapture: b,
      onPointerCancel: b
    };
  }
  if (!l) return null;
  const u = w.cards.find((r) => r.laneId === "prototype"), i = We(w).find((r) => r.cardId === u?.id && r.laneId === "prototype" && r.present), M = we(w, "reserve")?.amount ?? 0, S = (r) => t.lanes.find((m) => m.id === r)?.label ?? "";
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "pilot-board " + (l === "customer-interviews" ? "interview-board" : "budget-board"),
      onKeyDown: (r) => {
        r.key === "Escape" && b();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, st),
    l === "customer-interviews" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("header", null, /* @__PURE__ */ e.createElement("p", { className: "pilot-kicker" }, "Design partner interviews"), /* @__PURE__ */ e.createElement("h2", null, "What’s stopping the first import?"), !p && /* @__PURE__ */ e.createElement("p", null, "Pick a customer quote or drag it to the prototype. See what your designer would test.")), /* @__PURE__ */ e.createElement("div", { className: "interview-desk" }, /* @__PURE__ */ e.createElement("div", { className: "quote-stack" }, t.cards.map((r) => {
      const m = Ke.find((C) => C.id === r.id), f = r.label === m.who + " · " + m.quote;
      return /* @__PURE__ */ e.createElement(
        "button",
        {
          type: "button",
          className: "quote quote-" + r.id,
          key: r.id,
          "data-card": r.id,
          "aria-pressed": u?.id === r.id,
          ...L(r.id)
        },
        f && /* @__PURE__ */ e.createElement("small", null, m.who),
        /* @__PURE__ */ e.createElement("strong", null, f ? m.quote : r.label)
      );
    })), /* @__PURE__ */ e.createElement("div", { className: "prototype-slot" + (c ? " drop-active" : ""), "data-drop": "prototype", "aria-label": S("prototype") }, /* @__PURE__ */ e.createElement("div", { key: u?.id, className: "design-cursor", "aria-label": "Simulated designer Imani" }, /* @__PURE__ */ e.createElement("span", { "aria-hidden": "true" }, "➤"), " Imani"), u ? /* @__PURE__ */ e.createElement(ct, { id: u.id }) : /* @__PURE__ */ e.createElement("p", null, "Choose an interview for the prototype."), i && /* @__PURE__ */ e.createElement("div", { className: "test-brief", "aria-live": "polite" }, /* @__PURE__ */ e.createElement("strong", null, i.label), /* @__PURE__ */ e.createElement("p", null, i.text))))) : /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("header", null, /* @__PURE__ */ e.createElement("p", { className: "pilot-kicker" }, "First ten design partners"), /* @__PURE__ */ e.createElement("h2", null, "Where would you spend $", t.cards.length * 200, "?"), !p && /* @__PURE__ */ e.createElement("p", null, "Drag a $200 allocation to an experiment, or select an allocation and then a destination.")), /* @__PURE__ */ e.createElement("div", { className: "budget-ledger" }, /* @__PURE__ */ e.createElement("div", { className: "budget-heading" }, /* @__PURE__ */ e.createElement("span", null, "Pilot budget"), /* @__PURE__ */ e.createElement("b", null, "$", t.cards.length * 200 - M, " ", /* @__PURE__ */ e.createElement("small", null, "committed"))), /* @__PURE__ */ e.createElement("div", { className: "budget-bar", "aria-hidden": "true" }, w.cards.map((r) => /* @__PURE__ */ e.createElement("span", { key: r.id, className: "band-" + r.laneId }))), /* @__PURE__ */ e.createElement("div", { className: "budget-chips" }, t.cards.map((r) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: r.id,
        "data-card": r.id,
        "aria-label": r.label + ", " + S(r.laneId),
        "aria-pressed": x === r.id,
        ...L(r.id)
      },
      /* @__PURE__ */ e.createElement("small", null, r.label),
      /* @__PURE__ */ e.createElement("strong", null, "$200"),
      /* @__PURE__ */ e.createElement("span", null, S(r.laneId).split(" · ")[0])
    ))), /* @__PURE__ */ e.createElement("div", { className: "budget-targets" }, Te.map((r) => {
      const m = we(w, r.id);
      return /* @__PURE__ */ e.createElement(
        "button",
        {
          type: "button",
          key: r.id,
          className: "target-" + r.id,
          "data-drop": r.id,
          disabled: p || !x || !ce(t, x, r.id),
          onClick: () => v(x, r.id)
        },
        /* @__PURE__ */ e.createElement("strong", null, S(r.id).replace(" · " + r.rate, "")),
        /* @__PURE__ */ e.createElement("b", null, "$", m.amount),
        /* @__PURE__ */ e.createElement("span", null, m.description),
        /* @__PURE__ */ e.createElement("small", null, r.rate)
      );
    })), /* @__PURE__ */ e.createElement("button", { type: "button", className: "reserve", "data-drop": "reserve", disabled: p || !x, onClick: () => v(x, "reserve") }, S("reserve") === "Unallocated" ? "Return to unallocated funds" : S("reserve"), " ", /* @__PURE__ */ e.createElement("b", null, "$", M)))),
    o && c && /* @__PURE__ */ e.createElement("span", { className: "pilot-ghost", "aria-hidden": "true", style: o }, t.cards.find((r) => r.id === c)?.label)
  );
}
function ct({ id: t }) {
  const p = t === "duplicate" ? [["Studio Oka", "Already a client"], ["Lowell Design", "New client"]] : t === "undo" ? [["Latest import", "10 clients added"], ["Previous list", "38 clients"]] : [["Studio Oka", "Ready"], ["Lowell Design", "Ready"]];
  return /* @__PURE__ */ e.createElement("div", { className: "prototype-screen", "aria-label": "Example product screen" }, /* @__PURE__ */ e.createElement("div", { className: "prototype-bar" }, /* @__PURE__ */ e.createElement("span", null, "Client list"), /* @__PURE__ */ e.createElement("span", null, "Prototype")), /* @__PURE__ */ e.createElement("strong", null, t === "duplicate" ? "1 matching client" : t === "undo" ? "Import history" : "Preview your first 10 rows"), p.map(([n, l]) => /* @__PURE__ */ e.createElement("div", { className: "prototype-row", key: n }, /* @__PURE__ */ e.createElement("span", null, n), /* @__PURE__ */ e.createElement("span", null, l))), /* @__PURE__ */ e.createElement("p", null, t === "duplicate" ? "Keep original record" : t === "undo" ? "Restore previous list" : "No emails will be sent"));
}
function ze(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((p) => p.trim()) ?? [t];
}
function fe({ state: t, d: p, draggedId: n, isTracking: l }, a, g, d = !1, c = !1, h = "", o = !1) {
  const y = g?.layout ?? pe, { width: E, row: z, height: w, top: x } = y, { points: b, height: v } = me(t, y), k = !!t.lanes[0].station, W = (u) => {
    const i = t.lanes.findIndex((S) => S.id === u.laneId), M = t.cards.filter((S) => S.laneId === u.laneId).indexOf(u);
    return I((k ? 18 : 8) + b[i].x, b[i].y + x + M * z);
  };
  if (l && n) {
    const u = t.cards.find((i) => "choice-" + i.id === n);
    if (u) return /* @__PURE__ */ e.createElement("g", { id: n, transform: W(u) });
  }
  const L = !k && !t.kind;
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, L && n && t.lanes.map((u, i) => /* @__PURE__ */ e.createElement(
    "rect",
    {
      id: "drop-" + u.id,
      x: b[i].x,
      y: 0,
      width: y.pitch,
      height: v,
      fill: "none",
      pointerEvents: "none",
      "aria-hidden": "true"
    }
  )), t.lanes.flatMap((u, i) => (u.station?.next ?? []).map((M) => {
    const S = b[i], r = b[t.lanes.findIndex((B) => B.id === M)], m = E / 2 + 8, f = (x - 12) / 2 + 4, C = r.x - S.x, D = r.y - S.y, R = Math.min(C ? E / 2 / Math.abs(C) : 1 / 0, D ? (f - 4) / Math.abs(D) : 1 / 0), Z = r.x + m - C * R, J = r.y + f - D * R;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: u.id + "-" + M }, /* @__PURE__ */ e.createElement("line", { x1: S.x + m, y1: S.y + f, x2: Z, y2: J, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${Z} ${J}) rotate(${Math.atan2(D, C) * 180 / Math.PI})` }));
  })), t.lanes.map((u, i) => {
    const M = t.cards.filter((m) => m.laneId === u.id).length, S = t.kind === "release-plan" && Se(t, u.id), r = t.kind === "release-plan" ? S + (u.capacity ? " / " + u.capacity : "") + " points" : u.station ? M ? "● Occupied" : "Open stop" : u.capacity ? `${M} of ${u.capacity} slots` : `${M} ${M === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + u.id, transform: I(8 + b[i].x, 4 + b[i].y) }, k && !o && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: E, height: x + Math.max(1, M) * z - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...d && !a ? {
      ...k ? { "data-workshop-station": u.id } : { "data-workshop-lane": u.id },
      role: "button",
      tabIndex: 0,
      "aria-labelledby": h + "-edit-" + u.id,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: E, height: x - 12, rx: o ? 12 : k ? 6 : 9, stroke: o ? "#a0b9a6" : void 0, fill: o ? "#f4f8ef" : k ? "#253c36" : je[i] }), (g?.labels.get("heading-" + u.id) ?? ze(u.label)).map((m, f) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + f, fill: o ? "#244b3d" : k ? "#fffdf3" : "#18302d", transform: I(12, (k ? 23 : 16) + f * 16), fontSize: o ? 15 : k ? 17 : 13, fontWeight: "bold" }, m)), !o && /* @__PURE__ */ e.createElement("text", { fill: k ? "#ebd29a" : "#18302d", transform: I(12, x - 23), fontSize: 12 }, r)), c && M < (u.capacity ?? 1 / 0) && /* @__PURE__ */ e.createElement(
      "g",
      {
        "data-workshop-add-card": u.id,
        transform: I(0, x + M * z - 4),
        role: "button",
        tabIndex: 0,
        "aria-labelledby": h + "-add-" + u.id,
        cursor: "pointer"
      },
      /* @__PURE__ */ e.createElement("rect", { width: E, height: 40, rx: 7, fill: "#fbfcf9", stroke: "#64796c", strokeDasharray: "4 3" }),
      /* @__PURE__ */ e.createElement("text", { transform: I(12, 25), fontSize: 14 }, "+ Add card")
    ));
  }), t.cards.map((u) => {
    const i = a ? [] : oe(t, u), M = "choice-" + u.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: M,
        "data-workshop-card": u.id,
        transform: W(u),
        dragologyZIndex: n === M ? "/1" : !1,
        dragologyOnDrag: i.length > 1 ? () => {
          const S = i.map((m) => ae(t, u.id, m.id));
          if (!L) return p.closest(S).withFloating();
          const r = i.map((m, f) => p.dropTarget("drop-" + m.id, S[f], { boundsState: t }));
          return p.closest(r).whenFar(t).withFloating();
        } : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: k ? E - 20 : E, height: w - (k ? 6 : 0), fill: k ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: o ? 12 : k ? 1 : 8 }),
      k && !o && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: I(12, w - 10), fill: "#466358", fontSize: 12 }, u.points, " pts"),
      (g?.labels.get(M) ?? ze(u.label)).map((S, r) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + r, transform: I(12, (o ? 21 : 17) + r * 16), fontSize: 14 }, S))
    );
  }));
}
const dt = (t) => fe(t, !1), pt = (t) => fe(t, !0);
function yt({ value: t, onChange: p, onPreview: n, onEditCard: l, onEditStation: a, onEditLane: g, onAddCard: d, onUndo: c, canUndo: h, readOnly: o = !1, fitLanes: y = !1, mapCanvas: E = !1, showPlacementOutcomes: z = !0 }) {
  const w = e.useRef(null), x = e.useId(), b = e.useRef(null), v = e.useRef(null), [k, W] = e.useState(0), L = E && !!t.lanes[0].station, u = L || y && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const s = w.current;
    if (!u || !s) return;
    const $ = () => W(s.clientWidth);
    $();
    const N = new ResizeObserver($);
    return N.observe(s), () => N.disconnect();
  }, [u]);
  const i = e.useMemo(() => u && k ? Oe(t, k, L) : void 0, [u, k, t, L]), { width: M, height: S } = me(t, i?.layout), r = t.kind === "release-plan", m = !!t.signals?.length, [f, C] = e.useState(0), D = e.useRef(!1), R = e.useRef(null), [Z, J] = e.useState(null), [B, Q] = e.useState(null), [le, be] = e.useState(null), q = !o && B?.source === t ? B : null, ge = e.useRef(t), T = e.useCallback((s) => {
    (r || m) && J(s), n?.(s);
  }, [r, m, n]), A = e.useCallback(() => {
    D.current = !1, R.current = null, Q(null), T(null), C((s) => s + 1);
  }, [T]);
  e.useLayoutEffect(() => {
    ge.current !== t && (D.current || B) && A(), ge.current = t;
  }, [t, B, A]);
  const X = (s, $) => {
    D.current = !1, Q(null), T(null), s !== t && (r && !c && be({ before: t, after: s }), p(s, $));
  }, Pe = (s) => {
    const $ = s.cards.find((N) => N.id === R.current);
    X(s, $ && { cardId: $.id, laneId: $.laneId });
  }, Ie = e.useCallback((s) => {
    const $ = s.type === "dragging" ? s : s.pendingDrag?.status;
    D.current = !!$, $ ? (R.current = $.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, Q(null)) : R.current !== null && (R.current = null, T(null));
  }, [T]);
  e.useEffect(() => {
    function s($) {
      !D.current && !B || $ instanceof KeyboardEvent && $.key !== "Escape" || A();
    }
    return document.addEventListener("keydown", s), document.addEventListener("pointercancel", s), window.addEventListener("blur", s), () => {
      document.removeEventListener("keydown", s), document.removeEventListener("pointercancel", s), window.removeEventListener("blur", s);
    };
  }, [A, B]);
  const O = o ? null : q?.next ?? Z, H = !!(o || q), he = !!t.lanes[0].station, Y = !H && (he ? !!a : !r && !!g), V = !H && !he && !r && !!d && t.cards.length < Ge, De = e.useMemo(() => i || Y || V || L ? (s) => fe(s, H, i, Y, V, x, L) : H ? pt : dt, [i, H, Y, V, x, L]), ie = "[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]";
  function se(s) {
    H || (s.dataset.workshopStation ? a?.(s.dataset.workshopStation) : s.dataset.workshopLane ? g?.(s.dataset.workshopLane, s) : s.dataset.workshopAddCard && d?.(s.dataset.workshopAddCard, s));
  }
  const qe = O ? Math.max(S, me(O, i?.layout).height) : S;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, (Y || V) && /* @__PURE__ */ e.createElement("div", { hidden: !0 }, t.lanes.map((s) => /* @__PURE__ */ e.createElement(e.Fragment, { key: s.id }, Y && /* @__PURE__ */ e.createElement("span", { id: x + "-edit-" + s.id }, "Edit ", s.label), V && /* @__PURE__ */ e.createElement("span", { id: x + "-add-" + s.id }, "Add card to ", s.label)))), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: w,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (s) => {
        const $ = s.target.closest(ie);
        !$ || !["Enter", " "].includes(s.key) || (s.preventDefault(), s.repeat || se($));
      },
      onClickCapture: (s) => {
        const $ = s.target.closest(ie);
        $ && s.detail === 0 && se($);
      },
      onPointerDownCapture: (s) => {
        if (b.current = null, H || !s.isPrimary || s.button !== 0) return;
        const $ = s.target.closest(ie + ",[data-workshop-card]");
        $ && (b.current = { target: $, x: s.clientX, y: s.clientY });
      },
      onPointerMoveCapture: (s) => {
        b.current && Math.hypot(s.clientX - b.current.x, s.clientY - b.current.y) > 5 && (b.current = null, v.current = null);
      },
      onPointerCancelCapture: () => {
        b.current = null, v.current = null;
      },
      onPointerUpCapture: (s) => {
        const $ = b.current;
        if (b.current = null, !$ || H) return;
        const N = $.target.dataset.workshopCard;
        if (!N) {
          v.current = null, se($.target);
          return;
        }
        l && (v.current?.id === N && s.timeStamp - v.current.at < 400 ? (v.current = null, l(N)) : v.current = { id: N, at: s.timeStamp });
      }
    },
    /* @__PURE__ */ e.createElement(
      U,
      {
        key: o ? "read-only" : f,
        draggable: De,
        state: q?.next ?? t,
        onDropState: o ? void 0 : Pe,
        onDragState: o ? void 0 : T,
        onDragStatus: Ie,
        width: M,
        height: qe
      }
    )
  ), m && z && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, We(O ?? t).map((s) => /* @__PURE__ */ e.createElement("p", { key: s.id }, /* @__PURE__ */ e.createElement("strong", null, s.label), /* @__PURE__ */ e.createElement("br", null), s.text))), r && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(et, { value: t, preview: O }), !o && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    tt,
    {
      value: t,
      preview: q?.move ?? null,
      stage: (s, $) => {
        Q({ source: t, next: s, move: $ }), n?.(s);
      },
      cancel: A,
      apply: () => {
        q && (X(q.next, q.move), T(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(c ? h : le?.after === t), onClick: () => {
    A(), c ? c() : le?.after === t && (be(null), p(le.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((s) => {
    const $ = t.lanes.find((N) => N.id === s.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: s.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, s.label, " · ", $.label), /* @__PURE__ */ e.createElement("br", null), $.station.outcome), $.station.image && /* @__PURE__ */ e.createElement(
      "img",
      {
        src: $.station.image.src,
        alt: $.station.image.alt,
        referrerPolicy: "no-referrer",
        style: { display: "block", maxWidth: "100%", width: 360, maxHeight: 240, objectFit: "contain", objectPosition: "left", marginBlock: "8px" }
      }
    ), oe(t, s).filter((N) => N.id !== s.laneId).map((N) => /* @__PURE__ */ e.createElement("button", { key: N.id, type: "button", disabled: o, onClick: () => X(ae(t, s.id, N.id), { cardId: s.id, laneId: N.id }) }, s.label, " → ", N.label)));
  })), !r && !L && t.cards.length > 0 && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((s) => /* @__PURE__ */ e.createElement("label", { key: s.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, s.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: o,
      "aria-label": "Move " + s.label,
      value: q?.move.cardId === s.id ? q.move.laneId : s.laneId,
      onChange: ($) => {
        const N = { cardId: s.id, laneId: $.currentTarget.value }, ee = ae(t, s.id, N.laneId);
        m ? ee === t ? A() : (Q({ source: t, next: ee, move: N }), n?.(ee)) : X(ee, N);
      }
    },
    oe(t, s).map(($) => /* @__PURE__ */ e.createElement("option", { key: $.id, value: $.id }, $.label))
  ))), q && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => X(q.next, q.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: A }, "Cancel move"))));
}
export {
  Et as FocusDarkroomBoard,
  gt as ListeningRoomBoard,
  ht as MoonGalleryBoard,
  bt as OfflineHandoffBoard,
  et as ReleasePlanReadout,
  xt as StartupWorkshopBoard,
  yt as WorkshopBoard,
  vt as addWorkshopBranch,
  Mt as addWorkshopCard,
  $t as addWorkshopLane,
  oe as availableLanes,
  ue as canHangPanel,
  Te as channels,
  zt as createBudgetWorkshop,
  Lt as createInterviewWorkshop,
  St as createLaneWorkshop,
  Wt as createWorkshopMap,
  Ct as decodeWorkshopFragment,
  Nt as describeFocusDarkroom,
  Pt as encodeWorkshopFragment,
  Ee as handoffSummary,
  re as hangGalleryPanel,
  It as industrialWorkshop,
  Dt as initialFocusDarkroom,
  Ke as interviews,
  je as laneColors,
  ye as listeningRoom,
  ke as listeningRoomCaption,
  Ge as maxWorkshopCards,
  qt as moonGallery,
  ae as moveWorkshopCard,
  Ft as nightTransfer,
  Rt as normalizeFocusDarkroom,
  Bt as normalizeListeningRoom,
  At as normalizeMoonGallery,
  Ht as normalizeOfflineHandoff,
  Ae as offlineHandoff,
  ce as planStartupMove,
  G as printFields,
  Se as releaseLoad,
  Kt as releasePlan,
  xe as resolveHandoff,
  We as resolveWorkshopSignals,
  te as reviewHandoff,
  He as startupExperienceKind,
  Tt as validateWorkshop,
  we as workshopBudgetResult,
  pe as workshopLayout,
  me as workshopPositions,
  Gt as workshopPresentationLanes,
  jt as workshopPresentationScenes,
  Qt as workshopToSlate
};
