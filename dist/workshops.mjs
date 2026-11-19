import e, { useState as I, useRef as F, useMemo as De, useLayoutEffect as O, useEffect as Q, useId as Ge } from "react";
import { DraggableRenderer as te, translate as D, param as je, inOrder as Xe } from "./dragology.mjs";
import { handoffSummary as Se, reviewHandoff as ae, resolveHandoff as Le, offlineHandoff as Ye, listeningRoom as $e, listeningRoomCaption as ze, workshopLayout as ie, workshopToSlate as Qe, workshopPositions as se, releaseLoad as qe, availableLanes as ce, moveWorkshopCard as de, canHangPanel as he, hangGalleryPanel as le, printFields as Y, startupExperienceKind as Ve, resolveWorkshopSignals as Fe, workshopBudgetResult as Ce, interviews as _e, channels as Ue, planStartupMove as be, maxWorkshopCards as Ze, laneColors as Je } from "./workshop-model.mjs";
import { addWorkshopBranch as qt, addWorkshopCard as Ft, addWorkshopLane as Rt, createBudgetWorkshop as Bt, createInterviewWorkshop as At, createLaneWorkshop as Ht, createWorkshopMap as Kt, decodeWorkshopFragment as Tt, describeFocusDarkroom as Gt, encodeWorkshopFragment as jt, industrialWorkshop as Xt, initialFocusDarkroom as Yt, moonGallery as Qt, nightTransfer as Vt, normalizeFocusDarkroom as _t, normalizeListeningRoom as Ut, normalizeMoonGallery as Zt, normalizeOfflineHandoff as Jt, releasePlan as Ot, validateWorkshop as en, workshopPresentationLanes as tn, workshopPresentationScenes as nn } from "./workshop-model.mjs";
import { Slate as Oe } from "slateboxjs";
function et(t, p, r) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${p}) scale(${r} ${r * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + s, d: `M59 ${s}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function tt(t, p) {
  const r = t ? 9 : 49, s = t ? 20 : 23, a = t ? 144 : 181, m = t ? 183 : 370, d = t ? 35 : 40, c = t ? 164 : 255, u = t ? 119 : 147, l = 45, b = (x, w, g, k, E = "#243c32", v = "normal", $ = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: D(x, w), fill: E, fontSize: k, fontFamily: $, fontWeight: v }, g);
  return ({ state: x, d: w, draggedId: g }) => {
    const k = x.stage === "queued", E = x.stage === "resolved", v = m + (c - u) / 2, $ = d + 138, M = k ? r + (a - u) / 2 : v, W = k ? s + 141 : $, z = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${r + a - 2} ${s + 180} C${r + a + 45} ${s + 235},${m - 24} ${d + 204},${m + 22} ${d + 159}`, fill: "none", stroke: k ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: k ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: D(r, s) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: a, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: a - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: a / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), b(13, 27, "17:08", 9, z, "bold"), b(a - 50, 27, k ? "Offline" : "Online", 10, k ? "#835420" : "#266451", "bold"), b(13, 47, "Field log", t ? 18 : 20, z, "bold"), et(13, 55, (a - 26) / 142), b(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, z), /* @__PURE__ */ e.createElement("rect", { x: a / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: D(m, d) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${c - 5} -3 5 190 -${c - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${c - 1} -3 3 183 -${c - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: c, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((o) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + o, cx: "8", cy: o, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), b(23, 38, k ? "SHIFT HANDOFF" : E ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), b(22, 69, "Gate B", t ? 30 : 37, z, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${c - 42}`, stroke: "#bfc5b1" }), b(23, 101, (E && x.choice === "field" ? x.fieldNote : x.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, z, "bold"), b(23, 120, E && x.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: D((c - u) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: u, height: l, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), b(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: D(M, W),
        dragologyZIndex: g === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !p && k ? () => w.closest([x, ae(x)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${u - 2}v${l - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${u}v${l - 7}l-7 7H0z`, fill: E ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${u - 7} ${l}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((o) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + o, cx: "8", cy: o, r: "1.3", fill: "#84662e" })),
      b(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      b(17, 34, E ? "Reviewed" : x.fieldNote === Ye.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const nt = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function $t({ value: t, onChange: p, readOnly: r = !1 }) {
  const [s, a] = I(null), [m, d] = I(null), [c, u] = I(0), [l, b] = I(!1), [x, w] = I(1), g = F(null), k = F(!1), E = F(t), v = De(() => tt(l, r), [l, r]), $ = r ? t : m ?? s ?? t, M = t.stage === "queued" && $.stage === "review";
  function W() {
    k.current = !1, d(null), a(null), u((o) => o + 1);
  }
  function z(o) {
    W(), !r && o.stage !== t.stage && p?.(o);
  }
  return O(() => {
    (k.current || m) && (r || E.current !== t) && W(), E.current = t;
  }, [t, r, m]), O(() => {
    const o = () => {
      const S = g.current.clientWidth;
      b(S < 510), w(Math.min(1, S / (S < 510 ? 360 : 685)));
    };
    o();
    const h = new ResizeObserver(o);
    return h.observe(g.current), () => h.disconnect();
  }, []), Q(() => {
    function o(h) {
      (k.current || m) && (!(h instanceof KeyboardEvent) || h.key === "Escape") && W();
    }
    return document.addEventListener("keydown", o), document.addEventListener("pointercancel", o), window.addEventListener("blur", o), () => {
      document.removeEventListener("keydown", o), document.removeEventListener("pointercancel", o), window.removeEventListener("blur", o);
    };
  }, [m]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": r, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, nt), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: g, style: { "--drawing-scale": x } }, /* @__PURE__ */ e.createElement(
    te,
    {
      key: r ? "read-only" : c,
      state: m ?? t,
      draggable: v,
      width: l ? 360 : 685,
      height: l ? 254 : 262,
      onDragState: r ? void 0 : (o) => {
        k.current = !0, a(o.stage !== t.stage && t.stage === "queued" ? o : null);
      },
      onDropState: r ? void 0 : z
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + ($.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", $.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, Se(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, M ? "The two access reports disagree." : Se(t)), !r && (t.stage === "queued" ? M ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => z(ae(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: W }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => d(ae(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => z(Le(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => z(Le(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => z(ae(t)) }, "Reopen review")), !r && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => z({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function rt() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const p = new t(), r = p.sampleRate, s = r * 4, a = p.createBuffer(1, s, r), m = p.createBuffer(1, s, r), d = a.getChannelData(0), c = m.getChannelData(0);
  let u = 419;
  function l() {
    return u = 1664525 * u + 1013904223 >>> 0, u / 4294967296;
  }
  for (let x = 0; x < 100; x++) {
    const w = Math.floor(l() * s), g = 380 + l() * 1500, k = 0.09 + l() * 0.08;
    for (let E = 0; E < r * 0.12; E++) {
      const v = E / r, $ = Math.sin(2 * Math.PI * g * v) + 0.22 * (l() * 2 - 1);
      d[(w + E) % s] += k * Math.exp(-v * 76) * $;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((x, w) => {
    const g = Math.floor((w * 0.93 + 0.1) * r);
    for (let k = 0; k < r * 1.6; k++) {
      const E = k / r, v = Math.sin(E * x * 2 * Math.PI) + 0.23 * Math.sin(E * x * 5.42 * Math.PI);
      c[(g + k) % s] += 0.16 * Math.min(1, E * 250) * Math.exp(-E * 3.3) * v;
    }
  });
  const b = [a, m].map((x) => {
    const w = p.createBufferSource(), g = p.createGain();
    return g.gain.value = 0, w.buffer = x, w.loop = !0, w.connect(g).connect(p.destination), w.start(), g;
  });
  return {
    ctx: p,
    mix(x) {
      b[0].gain.setTargetAtTime(Math.cos(x * Math.PI / 2), p.currentTime, 0.035), b[1].gain.setTargetAtTime(Math.sin(x * Math.PI / 2), p.currentTime, 0.035);
    },
    stop() {
      p.close();
    }
  };
}
function Re({ state: t, d: p, isTracking: r }, s) {
  const a = t.mix, m = 106 + 420 * a, d = D(m, 220);
  return r ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: d }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (c, u) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + u, cx: 18 + u * 137 % 604, cy: 12 + u * 47 % 103, r: u % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - a * 0.45 }, Array.from({ length: 30 }, (c, u) => {
    const l = 29 + u * 31 % 184, b = 24 + u * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + u, d: `M${l} ${b}l-3 8`, stroke: u % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: u % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((c) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + c, d: `M${39 + c * 15} ${116 + c * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((c) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + c, d: `M${65 + c * 35} ${177 - c * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + a * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((c) => {
    const u = 407 + c * 32, l = 63 - c % 3 * 4, b = 52 + (c + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + c, transform: D(u, l) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${b}l-8 5-8-6z`, fill: c % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${b + 7}l7-5V13z`, fill: c % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${b - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: a })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: d, dragologyOnDrag: s ? void 0 : () => p.vary(t, je("mix"), { constraint: (c) => Xe([0, c.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + a * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const ot = (t) => Re(t, !1), at = (t) => Re(t, !0), lt = `
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
function zt({ value: t, onChange: p, readOnly: r = !1 }) {
  const s = F(null), a = F(null), [m, d] = I(null), [c, u] = I(0), [l, b] = I(1), [x, w] = I(!1), [g, k] = I(!1), E = m ?? t, v = F(t), $ = F(!1);
  function M() {
    $.current = !1, d(null), u((n) => n + 1);
  }
  O(() => {
    $.current && (r || t !== v.current) && M(), v.current = t;
  }, [t, r]), O(() => {
    const n = s.current, f = () => b(Math.min(1, n.clientWidth / 640));
    f();
    const C = new ResizeObserver(f);
    return C.observe(n), () => C.disconnect();
  }, []), Q(() => {
    function n(f) {
      $.current && (!(f instanceof KeyboardEvent) || f.key === "Escape") && M();
    }
    return document.addEventListener("keydown", n), document.addEventListener("pointercancel", n), window.addEventListener("blur", n), () => {
      document.removeEventListener("keydown", n), document.removeEventListener("pointercancel", n), window.removeEventListener("blur", n);
    };
  }, []);
  function W(n) {
    $.current = !1, d(null), !r && n !== t.mix && p?.({ ...t, mix: n });
  }
  function z() {
    a.current?.stop(), a.current = null, w(!1);
  }
  Q(() => {
    a.current?.mix(E.mix);
  }, [E.mix]), Q(() => {
    const n = new IntersectionObserver(([C]) => {
      C.isIntersecting || z();
    });
    n.observe(s.current);
    const f = () => {
      document.hidden && z();
    };
    return document.addEventListener("visibilitychange", f), () => {
      n.disconnect(), document.removeEventListener("visibilitychange", f), a.current?.stop(), a.current = null;
    };
  }, []);
  async function o() {
    if (a.current) {
      z();
      return;
    }
    try {
      const n = rt();
      a.current = n, n.mix(E.mix), await n.ctx.resume(), a.current === n && w(!0);
    } catch {
      z(), k(!0);
    }
  }
  const h = t.leftLabel === $e.leftLabel ? "rain" : t.leftLabel, S = t.rightLabel === $e.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, lt), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: s,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": l },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": r,
      tabIndex: r ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(E.mix * 100),
      "aria-valuetext": ze(E),
      onKeyDown: (n) => {
        if (r) return;
        const f = {
          ArrowLeft: E.mix - 0.01,
          ArrowRight: E.mix + 0.01,
          ArrowDown: E.mix - 0.01,
          ArrowUp: E.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(f, n.key) && (n.preventDefault(), W(Math.round(100 * Math.min(1, Math.max(0, f[n.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      te,
      {
        key: r ? "read-only" : c,
        state: t,
        draggable: r ? at : ot,
        width: 640,
        height: 276,
        onDragState: r ? void 0 : (n) => {
          $.current = n !== null, d(n);
        },
        onDropState: r ? void 0 : (n) => W(n.mix)
      }
    )
  ), !r && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => W(0) }, "Listen to ", h), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => W(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => W(1) }, "Listen to ", S)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, ze(E))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: o, "aria-pressed": x, disabled: g }, g ? "Audio unavailable" : x ? "Mute sound" : "Enable sound")));
}
function it(t, p, r) {
  const s = [];
  let a = "";
  for (const m of t.split(/\s+/u)) {
    const d = a ? a + " " + m : m;
    if (r.measureText(d).width <= p) {
      a = d;
      continue;
    }
    a && s.push(a), a = "";
    for (const c of m)
      a && r.measureText(a + c).width > p && (s.push(a), a = ""), a += c;
  }
  return a && s.push(a), s;
}
const ee = 12;
function st(t, p, r = !1) {
  const s = r ? Math.max(...t.lanes.map((g) => g.station.column)) + 1 : t.lanes.length, a = r ? (s - 1) * ee : 0, m = Math.min(r ? 202 : ie.pitch, Math.max(r ? 108 : 124, Math.floor((p - a) / s))), d = m - 16, c = document.createElement("canvas").getContext("2d"), u = /* @__PURE__ */ new Map();
  function l(g, k, E) {
    c.font = E;
    let v = 1;
    for (const $ of g) {
      const M = r && k === "choice-" ? 49 : 25, W = it($.label, d - M, c);
      u.set(k + $.id, W), v = Math.max(v, W.length);
    }
    return v;
  }
  const b = l(t.lanes, "heading-", r ? "bold 15px system-ui, sans-serif" : "bold 13px system-ui, sans-serif"), x = l(t.cards, "choice-", "14px system-ui, sans-serif");
  if (r) {
    const g = 16 * x + 22;
    return { labels: u, layout: { pitch: m, width: d, height: g, row: g + 6, top: 16 * b + 32 } };
  }
  const w = Math.max(ie.height, 16 * x + 14);
  return { labels: u, layout: { pitch: m, width: d, height: w, row: w + 12, top: 16 * b + 45 } };
}
function ct(t, p) {
  const r = Qe(t), s = p?.layout ?? ie, { points: a } = se(t, s, ee), m = new Map(r.nodes.map((c) => [c.options.id, c])), d = [];
  for (const [c, u] of t.lanes.entries()) {
    const l = a[c], b = m.get("lane-" + u.id);
    Object.assign(b.options, {
      xPos: l.x + 8,
      yPos: l.y + 4,
      width: s.width,
      height: s.top - 12,
      text: (p?.labels.get("heading-" + u.id) ?? [u.label]).join(`
`),
      fontSize: 14,
      backgroundColor: "#edf4ee",
      foregroundColor: "#263e34",
      borderColor: "#9ab3a0",
      allowDrag: !1
    }), d.push(b);
    for (const [x, w] of t.cards.filter((g) => g.laneId === u.id).entries()) {
      const g = m.get("card-" + w.id);
      Object.assign(g.options, {
        xPos: l.x + 18,
        yPos: l.y + s.top + x * s.row,
        width: s.width - 20,
        height: s.height - 6,
        text: (p?.labels.get("choice-" + w.id) ?? [w.label]).join(`
`),
        fontSize: 14,
        backgroundColor: "#ffda75",
        foregroundColor: "#293629",
        borderColor: "#8e814a",
        allowDrag: !1
      }), d.push(g);
    }
  }
  return { ...r, nodes: d };
}
function dt({ board: t, fitted: p, width: r, height: s, children: a }) {
  const m = F(null), d = F(null);
  return O(() => {
    const c = m.current, u = d.current;
    c.setAttribute("inert", "");
    const l = document.createElement("div");
    l.style.cssText = "width:100%;height:100%", c.appendChild(l);
    const b = new Oe(l, {
      name: t.title,
      enabled: !1,
      showUndoRedo: !1,
      showMultiSelect: !1,
      viewPort: { originalWidth: r, originalHeight: s, showCoordinates: !1 },
      panZoom: { enabled: !1 },
      autoResizeNodesBasedOnText: !1
    }), x = b.canvas.node;
    x.removeAttribute("tabindex");
    let w = !0, g = 0, k = !1;
    const E = () => {
      if (g = 0, !k) return;
      const z = x.getScreenCTM();
      if (!z) return;
      const o = z.inverse();
      for (const h of u.querySelectorAll("[data-workshop-card]")) {
        const S = h.getScreenCTM(), n = b.nodes.one("card-" + h.dataset.workshopCard);
        if (!S || !n) continue;
        const f = new DOMPoint(S.e, S.f).matrixTransform(o);
        (Math.abs(f.x - (n.options.x ?? 0)) > 0.1 || Math.abs(f.y - (n.options.y ?? 0)) > 0.1) && n.position(f.x, f.y);
      }
    }, v = () => {
      g || (g = requestAnimationFrame(E));
    }, $ = new MutationObserver(v);
    $.observe(u, { subtree: !0, childList: !0, attributes: !0, attributeFilter: ["transform", "style"] });
    const M = b.loadJSON(ct(t, p), !1, !0).then(() => {
      w && (k = !0, v());
    }), W = (z) => {
      const o = z.target?.closest("[data-workshop-station],[data-workshop-card]"), h = o?.dataset.workshopStation ? "lane-" + o.dataset.workshopStation : o?.dataset.workshopCard ? "card-" + o.dataset.workshopCard : "", S = b.nodes.one(h)?.svgGroup?.node;
      S && (S.style.outline = z.type === "focusin" ? "2px solid #305d99" : "");
    };
    return u.addEventListener("focusin", W), u.addEventListener("focusout", W), () => {
      w = !1, $.disconnect(), cancelAnimationFrame(g), u.removeEventListener("focusin", W), u.removeEventListener("focusout", W), l.remove(), M.finally(() => b.destroy());
    };
  }, [t, p, r, s]), /* @__PURE__ */ e.createElement("div", { style: { position: "relative", width: r, height: s, marginInline: "auto", isolation: "isolate" } }, /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: m,
      "data-native-workshop-map": "",
      "aria-hidden": "true",
      style: { position: "absolute", inset: 0, pointerEvents: "none" }
    }
  ), /* @__PURE__ */ e.createElement("div", { ref: d, "data-workshop-hit-surface": "", style: { position: "absolute", inset: 0, opacity: 0 } }, a));
}
function pt({ value: t, preview: p }) {
  const r = p ?? t, s = new Map(r.lanes.map((d) => [d.id, d.label])), a = new Map(r.cards.map((d) => [d.id, d])), m = r.cards.flatMap((d) => (d.dependsOn ?? []).map((c) => ({ feature: d, prerequisite: a.get(c) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), r.lanes.filter((d) => d.capacity !== void 0).map((d) => {
    const c = qe(r, d.id);
    return /* @__PURE__ */ e.createElement("div", { key: d.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, d.label), /* @__PURE__ */ e.createElement("output", { "aria-label": d.label + " capacity" }, c, " / ", d.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": d.label + " point budget", min: 0, max: d.capacity, value: c, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), m.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, m.map(({ feature: d, prerequisite: c }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([d.id, c.id]) }, /* @__PURE__ */ e.createElement("strong", null, d.label), " needs ", c.label, " · ", s.get(c.laneId))))), p && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, r.cards.filter((d) => t.cards.find((c) => c.id === d.id)?.laneId !== d.laneId).map((d) => d.label + " → " + s.get(d.laneId)).join(" · ")));
}
function ut({ value: t, preview: p, stage: r, apply: s, cancel: a }) {
  const [m, d] = I(t.cards[0].id), c = t.cards.find((l) => l.id === m) ?? t.cards[0], u = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (l) => {
    l.key === "Escape" && (a(), l.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: u }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: u, value: c.id, onChange: (l) => {
    d(l.target.value), a();
  } }, t.cards.map((l) => /* @__PURE__ */ e.createElement("option", { key: l.id, value: l.id }, l.label))), /* @__PURE__ */ e.createElement("div", null, ce(t, c).filter((l) => l.id !== c.laneId).map((l) => /* @__PURE__ */ e.createElement("button", { key: l.id, type: "button", onClick: () => r(de(t, c.id, l.id), { cardId: c.id, laneId: l.id }) }, "Preview ", l.label))), p && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: s }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: a }, "Cancel preview")));
}
const We = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], ft = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], T = 148, J = 104;
function mt(t) {
  const p = (r, s, a) => {
    const m = Array.from({ length: 38 }, (d, c) => {
      const u = Math.min(T, 4 * c), l = t * T + u, b = r + s * (Math.sin(l / 46) + 0.39 * Math.cos(l / 19) + 0.09 * Math.sin(l / 7));
      return (c ? "L" : "M") + u + " " + b.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: m + `L${T} ${J}H0z`, fill: a });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: T + 8, height: J + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: T + 4, height: J + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: T, height: J, fill: "#343b66" }), Array.from({ length: 13 }, (r, s) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + s, cx: 6 + (s * 77 + t * 19) % 136, cy: 4 + (s * 29 + t * 11) % 35, r: s % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), p(48, 7, "#9b88aa"), p(59, 10, "#bf9492"), p(75, 7, "#596d83"), p(88, 6, "#2a4858"), Array.from({ length: 7 }, (r, s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + s, d: `M${4 + (s * 37 + t * 13) % 124} ${92 + s * 3 % 10}h${4 + s % 3 * 4}`, stroke: "#7d9b9a" })));
}
function bt(t, p) {
  return ({ state: r, d: s, draggedId: a, isTracking: m }) => {
    const d = (l) => l === 1 ? "panorama-panel" : "gallery-panel-" + l, c = (l) => (r.hung.includes(r.panels[l].id) ? We : ft)[l], u = r.panels.findIndex((l, b) => d(b) === a);
    if (m && u >= 0) {
      const l = c(u);
      return /* @__PURE__ */ e.createElement("g", { id: d(u), transform: D(l.x, l.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + l, d: `M${40 + 83 * l} 225l${(l - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((l) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + l, transform: D(163 + l * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), r.panels.map((l, b) => {
      const x = We[b], w = c(b), g = !t && (!p || p.includes(l.id)) && he(r, l.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: l.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: b === 1 ? "gallery-hook" : "gallery-hook-" + b,
          x: x.x,
          y: x.y,
          width: T,
          height: J,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: x.x + T / 2, cy: x.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: d(b),
          transform: D(w.x, w.y),
          dragologyZIndex: a === d(b) ? "/1" : !1,
          dragologyOnDrag: g ? () => s.between([r, le(r, l.id)]) : void 0
        },
        mt(["dunes", "moon", "coast"].indexOf(l.artwork))
      ));
    }));
  };
}
function Ct({ value: t, onChange: p, onPreview: r, readOnly: s = !1, enabledIds: a }) {
  const m = e.useRef(null), [d, c] = e.useState(1), [u, l] = e.useState(0), [b, x] = e.useState(null), w = e.useRef(t);
  w.current = t;
  const g = e.useMemo(() => bt(s, a), [s, a]), k = (o) => {
    x(o), r?.(o);
  }, E = e.useRef(r);
  E.current = r;
  const v = e.useCallback(() => {
    x(null), E.current?.(null), l((o) => o + 1);
  }, []);
  e.useEffect(() => {
    const o = new ResizeObserver(() => {
      m.current && c(Math.min(1, m.current.clientWidth / 640));
    });
    return o.observe(m.current), () => o.disconnect();
  }, []), e.useEffect(() => {
    v();
    const o = (h) => {
      h.key === "Escape" && v();
    };
    return document.addEventListener("keydown", o), window.addEventListener("blur", v), () => {
      document.removeEventListener("keydown", o), window.removeEventListener("blur", v);
    };
  }, [t, s, v]);
  function $(o) {
    if (k(null), s || w.current !== t) return;
    const h = o.hung.find((S) => !t.hung.includes(S));
    h && (!a || a.includes(h)) && he(t, h) && p(le(t, h));
  }
  const M = b ?? t, W = M.panels.find((o) => M.hung.includes(o.id) && !t.hung.includes(o.id)), z = t.panels.filter((o) => !t.hung.includes(o.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: m, onPointerCancel: v, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: d, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    te,
    {
      key: u,
      draggable: g,
      width: 640,
      height: 300,
      state: t,
      onDragState: k,
      onDropState: $
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, M.panels.map((o, h) => /* @__PURE__ */ e.createElement("svg", { key: o.id, x: h * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: M.hung.includes(o.id) ? "#343b66" : "#c7b8a8" }), M.hung.includes(o.id) && /* @__PURE__ */ e.createElement("g", null, o.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: o.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : o.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, W ? W.label + " lines up with its hook." : z.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !s && z.filter((o) => (!a || a.includes(o.id)) && he(t, o.id)).map((o) => /* @__PURE__ */ e.createElement("button", { key: o.id, type: "button", onFocus: () => k(le(t, o.id)), onBlur: () => k(null), onClick: () => $(le(t, o.id)) }, "Hang ", o.label)));
}
const gt = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", ge = { start: 99, opener: 361 }, ht = { route: null }, Ne = "#ffcb62";
function Pe(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((p) => /* @__PURE__ */ e.createElement("g", { key: p, transform: "scale(" + p + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (p, r) => {
    const s = 33 - r * 6, a = 9 + 16 * Math.sin(r / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: r }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${s}q${-a} -2 ${-a - 4} -15q${a} 1 ${a + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${s - 3}q${a - 1} -3 ${a + 2} -15q${-a} 3 ${-a - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (p, r) => {
    const s = (r - 5.5) * 6, a = -18 - 22 * Math.sin(r * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: r }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${s * 0.35} 6 ${s} ${a}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((m) => /* @__PURE__ */ e.createElement("path", { key: m, d: `M${s * m / 5} ${35 + (a - 35) * m / 5}q${s * 0.15 - 5} -4 ${s * 0.25 - 7} -13m${7 - s * 0.25} 13q6 -6 7 -13` })));
  }));
}
function Be({ state: t, d: p, isTracking: r }, s = !1) {
  const a = t.route ? ge[t.route] : 232, m = t.route ? 48 : 85;
  return r ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(a, m) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [ge.start, ge.opener].map((d, c) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(d) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${d} 85 ${d} 48V0`, fill: "none", stroke: t.route === "start" && c === 0 || t.route === "opener" && c === 1 ? Ne : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: c ? "opener-jack" : "first-jack", cx: d, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: d, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, c ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(a, m), dragologyOnDrag: s ? void 0 : () => p.closest([ht, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: Ne, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Et(t) {
  return Be(t, !0);
}
function Wt({ value: t, onChange: p, readOnly: r = !1, onEditPrint: s }) {
  const a = r || !p, [m, d] = I(null), [c, u] = I(0), [l, b] = I(1), [x, w] = I(""), [g, k] = I(null), [E, v] = I(1), $ = F(null), M = F(null), W = F([]), z = Ge(), o = De(() => ({ route: t.route }), [t.route]), h = (!a && m ? m : o).route;
  Q(() => {
    const y = $.current, P = new ResizeObserver(() => v(Math.min(1, y.clientWidth / 460)));
    return P.observe(y), () => P.disconnect();
  }, []);
  function S(y) {
    a || (d(null), w(""), p?.({ ...t, route: y.route }));
  }
  function n(y) {
    b(y), k(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), M.current?.showModal();
  }
  function f() {
    const y = t.route === "start" ? 0 : l;
    W.current[y]?.focus({ preventScroll: !0 });
    const P = t[Y[y]];
    w(y === l ? "Focus returned to " + P + ", the print you opened." : "Focus jumped to " + P + ". You opened " + t[Y[l]] + ".");
  }
  function C() {
    u((y) => y + 1), d(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": a || void 0,
      onPointerCancel: C,
      onKeyDown: (y) => {
        y.key === "Escape" && !M.current?.open && C();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, gt),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, a ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, Y.map((y, P) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: y,
        ref: (B) => {
          W.current[P] = B;
        },
        "aria-label": "Open " + t[y],
        onClick: () => n(P)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, Pe(P)),
      /* @__PURE__ */ e.createElement("span", null, t[y])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: $, style: { "--circuit-scale": E } }, /* @__PURE__ */ e.createElement(
      te,
      {
        key: a ? "locked" : c,
        state: o,
        width: 460,
        height: 108,
        draggable: a ? Et : Be,
        onDragState: a ? void 0 : d,
        onDropState: a ? void 0 : S
      }
    )),
    !a && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": h === "start", onClick: () => S({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": h === "opener", onClick: () => S({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, h === "start" ? "Every viewer returns to the first print." : h === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, x || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: M, onClose: f, "aria-labelledby": z, onKeyDown: (y) => {
      y.key === "Escape" && (y.preventDefault(), y.stopPropagation(), y.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, Pe(l)), /* @__PURE__ */ e.createElement("h2", { id: z }, t[Y[l]]), !a && g !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (y) => {
      y.preventDefault(), g.trim() && (p?.({ ...t, [Y[l]]: g.trim() }), k(null), M.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: g, onChange: (y) => k(y.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !g.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => k(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => M.current?.close() }, "Close viewer"), !a && g === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => {
      const y = Y[l];
      s ? (M.current?.close(), s(y)) : k(t[y]);
    } }, "Rename print"))
  );
}
const yt = '.pilot-board{--ink:#243d33;box-sizing:border-box;color:var(--ink);background:#efece3;padding:clamp(14px,3.5vw,35px);font:15px/1.4 system-ui,sans-serif}.pilot-board *,.pilot-board *:before{box-sizing:border-box}.pilot-board header{margin:0 0 1.4rem;color:inherit;background:none;display:block;position:static;padding:0;border:0}.pilot-board header h2{font:700 clamp(30px,5vw,52px)/1 "Pilot Narrow",sans-serif;margin:.28em 0;color:inherit;letter-spacing:-.025em}.pilot-board p{margin:0}.pilot-board .pilot-kicker{font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}.pilot-board button{font:inherit;cursor:pointer;color:inherit}.pilot-board button:focus-visible,.pilot-board a:focus-visible{outline:3px solid #007486;outline-offset:3px}.pilot-board footer{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;padding:14px 0 0;margin:0;background:none;color:inherit;border:0}.pilot-board footer a{color:inherit;text-underline-offset:.24em;font-weight:700}.pilot-board footer button{background:transparent;border:0;text-decoration:underline;text-underline-offset:.23em}.pilot-board .interview-desk{display:grid;grid-template-columns:minmax(0,.94fr) minmax(0,1.2fr);gap:clamp(12px,3vw,32px);align-items:center}.pilot-board .quote-stack{display:grid;gap:10px;padding:4px}.pilot-board .quote{border:1px solid #a79e88;border-radius:2px;box-shadow:2px 3px #756d592b;padding:11px 14px;display:grid;gap:6px;text-align:left;touch-action:none;cursor:grab;position:relative}.pilot-board .quote small{font:600 11px/1.3 ui-monospace,monospace}.pilot-board .quote strong{font:600 clamp(15px,2.1vw,22px)/1.15 Georgia,serif}.pilot-board .quote-preview{background:#f5d989}.pilot-board .quote-duplicate{background:#c5dacf}.pilot-board .quote-undo{background:#ded1ea}.pilot-board .quote[aria-pressed=true]{outline:2px solid #385947;outline-offset:1px}.pilot-board .prototype-slot{position:relative;background:#254a3e;color:#fcf9ee;padding:30px clamp(12px,3vw,26px) 16px;border:2px dashed transparent;border-radius:4px}.pilot-board .prototype-slot.drop-active{border-color:#edc65e}.pilot-board .prototype-screen{background:#fffdf7;color:#233a30;border:1px solid #162d25;border-radius:6px;box-shadow:3px 4px #102b2166;overflow:hidden}.pilot-board .prototype-screen>strong{display:block;padding:15px 12px 7px;font-size:clamp(16px,2.3vw,24px)}.pilot-board .prototype-bar,.pilot-board .prototype-row{display:flex;align-items:center;justify-content:space-between;gap:5px;padding:8px 12px;font-size:12px}.pilot-board .prototype-bar{background:#e8eade;border-bottom:1px solid #c3cbbe;font-weight:650}.pilot-board .prototype-bar span+span,.pilot-board .prototype-row span+span{font:11px/1.3 ui-monospace,monospace}.pilot-board .prototype-row{margin:0 10px;padding:8px 2px;border-bottom:1px solid #e1e5da}.pilot-board .prototype-screen p{padding:8px 12px 12px;color:#355d49;font-weight:650;font-size:12px}.pilot-board .test-brief{margin-top:14px}.pilot-board .test-brief strong{font-size:18px}.pilot-board .test-brief p{font-size:13px;margin-top:3px}.pilot-board .design-cursor{position:absolute;right:17px;top:5px;font:700 10px/1.5 ui-monospace,monospace;color:#f8d7bc;pointer-events:none}.pilot-board .design-cursor span{display:inline-block;transform:rotate(-126deg)}@media (prefers-reduced-motion:no-preference){.pilot-board .design-cursor{animation:point-to-screen .45s ease-out}@keyframes point-to-screen{0%{transform:translate(15px,12px)}to{transform:translate(0)}}}.pilot-board .budget-board{background:#e1e8dc}.pilot-board .budget-ledger{padding:clamp(12px,2.5vw,24px);background:#fcf9f0;border:1px solid #9fae9e}.pilot-board .budget-heading,.pilot-board .reserve{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.pilot-board .budget-heading{font-weight:700}.pilot-board .budget-heading b{font:700 clamp(22px,3vw,32px)/1 "Pilot Narrow",sans-serif}.pilot-board .budget-heading small{font:400 12px/1.4 system-ui,sans-serif}.pilot-board .budget-bar{display:flex;gap:2px;margin:12px 0;height:10px}.pilot-board .budget-bar span{flex:1}.pilot-board .band-calls{background:#386759}.pilot-board .band-pilot{background:#b8804f}.pilot-board .band-newsletter{background:#80698c}.pilot-board .band-reserve{background:#dfded2}.pilot-board .budget-chips,.pilot-board .budget-targets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.pilot-board .budget-chips{margin:14px 0 18px}.pilot-board .budget-chips button{background:#f4e6bd;border:1px solid #b7a46b;border-left:4px solid #a98b43;display:grid;justify-items:start;text-align:left;align-content:start;gap:3px;padding:9px 10px;touch-action:none;cursor:grab}.pilot-board .budget-chips button[aria-pressed=true]{outline:2px solid #485e49;outline-offset:1px}.pilot-board .budget-chips small{font:11px/1.2 ui-monospace,monospace}.pilot-board .budget-chips span{font-size:12px}.pilot-board .budget-chips strong,.pilot-board .budget-targets b{font:700 clamp(22px,4vw,38px)/1.1 "Pilot Narrow",sans-serif}.pilot-board .budget-targets button{border:1px dashed #969a8b;border-radius:4px;display:grid;grid-template-rows:1fr auto auto;text-align:left;gap:4px;padding:12px 10px}.pilot-board .budget-targets strong{font-size:14px;line-height:1.15}.pilot-board .budget-targets span{font-size:12px}.pilot-board .target-calls{background:#d6e5d9}.pilot-board .target-newsletter{background:#e6ddeb}.pilot-board .target-pilot{background:#f1ddc6}.pilot-board .reserve{width:100%;border:0;border-top:1px solid #b4baad;background:none;margin-top:14px;padding:10px 0 0;font-size:13px}.pilot-board .pilot-ghost{position:fixed;z-index:10;pointer-events:none;background:#25382e;color:#fff9ee;box-shadow:1px 4px 10px #0003;padding:6px 10px;border-radius:3px;font:600 12px/1.3 system-ui,sans-serif}@media (max-width:480px){.pilot-board .interview-desk{grid-template-columns:1fr;gap:12px}.pilot-board .quote-stack{gap:6px}.pilot-board .quote{padding:8px 10px;gap:3px}.pilot-board footer{font-size:14px}.pilot-board .budget-chips,.pilot-board .budget-targets{gap:5px}.pilot-board .budget-targets button,.pilot-board .budget-chips button{padding:8px 5px}.pilot-board .budget-targets strong{font-size:12px}.pilot-board .budget-targets span,.pilot-board .budget-chips span{font-size:11px}}.pilot-board button:disabled{cursor:default}';
function Nt({ value: t, readOnly: p = !1, onChange: r }) {
  const s = Ve(t), a = F(null), [m, d] = I(null), [c, u] = I(null), [l, b] = I(null), [x, w] = I("fund-1"), g = m?.base === t && !p ? m.next : t, k = t.cards.some((n) => n.id === x) ? x : t.cards[0]?.id;
  function E() {
    a.current = null, u(null), b(null), d(null);
  }
  Q(() => {
    if (!c) return;
    const n = (f) => {
      f.key === "Escape" && E();
    };
    return window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n);
  }, [c]);
  function v(n, f) {
    const C = !p && be(t, n, f);
    C && r?.(C);
  }
  function $(n) {
    s === "customer-interviews" ? v(n, "prototype") : w(n);
  }
  function M(n) {
    const f = document.elementFromPoint(n.clientX, n.clientY)?.closest("[data-drop]");
    return f && f.closest(".pilot-board") === n.currentTarget.closest(".pilot-board") ? f.dataset.drop : void 0;
  }
  function W(n) {
    return {
      disabled: p,
      onClick: (f) => {
        f.detail === 0 && $(n);
      },
      onPointerDown: (f) => {
        p || !f.isPrimary || f.button !== 0 || (f.currentTarget.setPointerCapture(f.pointerId), a.current = { card: n, board: t, x: f.clientX, y: f.clientY, moved: !1 }, u(n));
      },
      onPointerMove: (f) => {
        const C = a.current;
        if (!C || C.card !== n) return;
        if (C.board !== t || p) return E();
        if (C.moved || (C.moved = Math.hypot(f.clientX - C.x, f.clientY - C.y) > 5), !C.moved) return;
        b({ left: f.clientX + 10, top: f.clientY + 10 });
        const y = M(f), P = y && be(t, n, y);
        d(P ? { base: t, next: P } : null);
      },
      onPointerUp: (f) => {
        const C = a.current;
        if (!C || C.card !== n) return;
        const y = M(f);
        E(), !(p || C.board !== t) && (C.moved ? y && v(n, y) : $(n));
      },
      onLostPointerCapture: E,
      onPointerCancel: E
    };
  }
  if (!s) return null;
  const z = g.cards.find((n) => n.laneId === "prototype"), o = Fe(g).find((n) => n.cardId === z?.id && n.laneId === "prototype" && n.present), h = Ce(g, "reserve")?.amount ?? 0, S = (n) => t.lanes.find((f) => f.id === n)?.label ?? "";
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "pilot-board " + (s === "customer-interviews" ? "interview-board" : "budget-board"),
      onKeyDown: (n) => {
        n.key === "Escape" && E();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, yt),
    s === "customer-interviews" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("header", null, /* @__PURE__ */ e.createElement("p", { className: "pilot-kicker" }, "Design partner interviews"), /* @__PURE__ */ e.createElement("h2", null, "What’s stopping the first import?"), !p && /* @__PURE__ */ e.createElement("p", null, "Pick a customer quote or drag it to the prototype. See what your designer would test.")), /* @__PURE__ */ e.createElement("div", { className: "interview-desk" }, /* @__PURE__ */ e.createElement("div", { className: "quote-stack" }, t.cards.map((n) => {
      const f = _e.find((y) => y.id === n.id), C = n.label === f.who + " · " + f.quote;
      return /* @__PURE__ */ e.createElement(
        "button",
        {
          type: "button",
          className: "quote quote-" + n.id,
          key: n.id,
          "data-card": n.id,
          "aria-pressed": z?.id === n.id,
          ...W(n.id)
        },
        C && /* @__PURE__ */ e.createElement("small", null, f.who),
        /* @__PURE__ */ e.createElement("strong", null, C ? f.quote : n.label)
      );
    })), /* @__PURE__ */ e.createElement("div", { className: "prototype-slot" + (c ? " drop-active" : ""), "data-drop": "prototype", "aria-label": S("prototype") }, /* @__PURE__ */ e.createElement("div", { key: z?.id, className: "design-cursor", "aria-label": "Simulated designer Imani" }, /* @__PURE__ */ e.createElement("span", { "aria-hidden": "true" }, "➤"), " Imani"), z ? /* @__PURE__ */ e.createElement(xt, { id: z.id }) : /* @__PURE__ */ e.createElement("p", null, "Choose an interview for the prototype."), o && /* @__PURE__ */ e.createElement("div", { className: "test-brief", "aria-live": "polite" }, /* @__PURE__ */ e.createElement("strong", null, o.label), /* @__PURE__ */ e.createElement("p", null, o.text))))) : /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("header", null, /* @__PURE__ */ e.createElement("p", { className: "pilot-kicker" }, "First ten design partners"), /* @__PURE__ */ e.createElement("h2", null, "Where would you spend $", t.cards.length * 200, "?"), !p && /* @__PURE__ */ e.createElement("p", null, "Drag a $200 allocation to an experiment, or select an allocation and then a destination.")), /* @__PURE__ */ e.createElement("div", { className: "budget-ledger" }, /* @__PURE__ */ e.createElement("div", { className: "budget-heading" }, /* @__PURE__ */ e.createElement("span", null, "Pilot budget"), /* @__PURE__ */ e.createElement("b", null, "$", t.cards.length * 200 - h, " ", /* @__PURE__ */ e.createElement("small", null, "committed"))), /* @__PURE__ */ e.createElement("div", { className: "budget-bar", "aria-hidden": "true" }, g.cards.map((n) => /* @__PURE__ */ e.createElement("span", { key: n.id, className: "band-" + n.laneId }))), /* @__PURE__ */ e.createElement("div", { className: "budget-chips" }, t.cards.map((n) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: n.id,
        "data-card": n.id,
        "aria-label": n.label + ", " + S(n.laneId),
        "aria-pressed": k === n.id,
        ...W(n.id)
      },
      /* @__PURE__ */ e.createElement("small", null, n.label),
      /* @__PURE__ */ e.createElement("strong", null, "$200"),
      /* @__PURE__ */ e.createElement("span", null, S(n.laneId).split(" · ")[0])
    ))), /* @__PURE__ */ e.createElement("div", { className: "budget-targets" }, Ue.map((n) => {
      const f = Ce(g, n.id);
      return /* @__PURE__ */ e.createElement(
        "button",
        {
          type: "button",
          key: n.id,
          className: "target-" + n.id,
          "data-drop": n.id,
          disabled: p || !k || !be(t, k, n.id),
          onClick: () => v(k, n.id)
        },
        /* @__PURE__ */ e.createElement("strong", null, S(n.id).replace(" · " + n.rate, "")),
        /* @__PURE__ */ e.createElement("b", null, "$", f.amount),
        /* @__PURE__ */ e.createElement("span", null, f.description),
        /* @__PURE__ */ e.createElement("small", null, n.rate)
      );
    })), /* @__PURE__ */ e.createElement("button", { type: "button", className: "reserve", "data-drop": "reserve", disabled: p || !k, onClick: () => v(k, "reserve") }, S("reserve") === "Unallocated" ? "Return to unallocated funds" : S("reserve"), " ", /* @__PURE__ */ e.createElement("b", null, "$", h)))),
    l && c && /* @__PURE__ */ e.createElement("span", { className: "pilot-ghost", "aria-hidden": "true", style: l }, t.cards.find((n) => n.id === c)?.label)
  );
}
function xt({ id: t }) {
  const p = t === "duplicate" ? [["Studio Oka", "Already a client"], ["Lowell Design", "New client"]] : t === "undo" ? [["Latest import", "10 clients added"], ["Previous list", "38 clients"]] : [["Studio Oka", "Ready"], ["Lowell Design", "Ready"]];
  return /* @__PURE__ */ e.createElement("div", { className: "prototype-screen", "aria-label": "Example product screen" }, /* @__PURE__ */ e.createElement("div", { className: "prototype-bar" }, /* @__PURE__ */ e.createElement("span", null, "Client list"), /* @__PURE__ */ e.createElement("span", null, "Prototype")), /* @__PURE__ */ e.createElement("strong", null, t === "duplicate" ? "1 matching client" : t === "undo" ? "Import history" : "Preview your first 10 rows"), p.map(([r, s]) => /* @__PURE__ */ e.createElement("div", { className: "prototype-row", key: r }, /* @__PURE__ */ e.createElement("span", null, r), /* @__PURE__ */ e.createElement("span", null, s))), /* @__PURE__ */ e.createElement("p", null, t === "duplicate" ? "Keep original record" : t === "undo" ? "Restore previous list" : "No emails will be sent"));
}
function Ie(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((p) => p.trim()) ?? [t];
}
function Ee({ state: t, d: p, draggedId: r, isTracking: s }, a, m, d = !1, c = !1, u = "", l = !1, b = !1) {
  const x = m?.layout ?? ie, { width: w, row: g, height: k, top: E } = x, { points: v, height: $ } = se(t, x, l ? ee : void 0), M = !!t.lanes[0].station, W = (o) => {
    const h = t.lanes.findIndex((n) => n.id === o.laneId), S = t.cards.filter((n) => n.laneId === o.laneId).indexOf(o);
    return D((M ? 18 : 8) + v[h].x, v[h].y + E + S * g);
  };
  if (s && r) {
    const o = t.cards.find((h) => "choice-" + h.id === r);
    if (o) return /* @__PURE__ */ e.createElement("g", { id: r, transform: W(o) });
  }
  const z = !M && !t.kind;
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, z && r && t.lanes.map((o, h) => /* @__PURE__ */ e.createElement(
    "rect",
    {
      id: "drop-" + o.id,
      x: v[h].x,
      y: 0,
      width: x.pitch,
      height: $,
      fill: "none",
      pointerEvents: "none",
      "aria-hidden": "true"
    }
  )), t.lanes.flatMap((o, h) => (o.station?.next ?? []).map((S) => {
    const n = v[h], f = v[t.lanes.findIndex((pe) => pe.id === S)], C = w / 2 + 8, y = (E - 12) / 2 + 4, P = f.x - n.x, B = f.y - n.y, ne = Math.min(P ? w / 2 / Math.abs(P) : 1 / 0, B ? (y - 4) / Math.abs(B) : 1 / 0), A = f.x + C - P * ne, H = f.y + y - B * ne;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: o.id + "-" + S }, /* @__PURE__ */ e.createElement("line", { x1: n.x + C, y1: n.y + y, x2: A, y2: H, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${A} ${H}) rotate(${Math.atan2(B, P) * 180 / Math.PI})` }));
  })), t.lanes.map((o, h) => {
    const S = t.cards.filter((C) => C.laneId === o.id).length, n = t.kind === "release-plan" && qe(t, o.id), f = t.kind === "release-plan" ? n + (o.capacity ? " / " + o.capacity : "") + " points" : o.station ? S ? "● Occupied" : "Open stop" : o.capacity ? `${S} of ${o.capacity} slots` : `${S} ${S === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + o.id, transform: D(8 + v[h].x, 4 + v[h].y) }, M && !l && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: w, height: E + Math.max(1, S) * g - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...d && !a ? {
      ...M ? { "data-workshop-station": o.id } : { "data-workshop-lane": o.id },
      role: "button",
      tabIndex: 0,
      "aria-labelledby": u + "-edit-" + o.id,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: w, height: E - 12, rx: l ? 12 : M ? 6 : 9, stroke: l ? "#a0b9a6" : void 0, fill: l ? "#f4f8ef" : M ? "#253c36" : Je[h] }), (m?.labels.get("heading-" + o.id) ?? Ie(o.label)).map((C, y) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + y, fill: l ? "#244b3d" : M ? "#fffdf3" : "#18302d", transform: D(12, (M ? 23 : 16) + y * 16), fontSize: l ? 15 : M ? 17 : 13, fontWeight: "bold" }, C)), !l && /* @__PURE__ */ e.createElement("text", { fill: M ? "#ebd29a" : "#18302d", transform: D(12, E - 23), fontSize: 12 }, f)), c && S < (o.capacity ?? 1 / 0) && /* @__PURE__ */ e.createElement(
      "g",
      {
        "data-workshop-add-card": o.id,
        transform: D(0, E + S * g - 4),
        role: "button",
        tabIndex: 0,
        "aria-labelledby": u + "-add-" + o.id,
        cursor: "pointer"
      },
      /* @__PURE__ */ e.createElement("rect", { width: w, height: 40, rx: 7, fill: "#fbfcf9", stroke: "#64796c", strokeDasharray: "4 3" }),
      /* @__PURE__ */ e.createElement("text", { transform: D(12, 25), fontSize: 14 }, "+ Add card")
    ));
  }), t.cards.map((o) => {
    const h = a ? [] : ce(t, o), S = "choice-" + o.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: S,
        "data-workshop-card": o.id,
        transform: W(o),
        ...b ? { role: "button", tabIndex: 0, "aria-labelledby": u + "-select-" + o.id } : {},
        dragologyZIndex: r === S ? "/1" : !1,
        dragologyOnDrag: h.length > 1 ? () => {
          const n = h.map((C) => de(t, o.id, C.id));
          if (!z) return p.closest(n).withFloating();
          const f = h.map((C, y) => p.dropTarget("drop-" + C.id, n[y], { boundsState: t }));
          return p.closest(f).whenFar(t).withFloating();
        } : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: M ? w - 20 : w, height: k - (M ? 6 : 0), fill: M ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: l ? 12 : M ? 1 : 8 }),
      M && !l && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: D(12, k - 10), fill: "#466358", fontSize: 12 }, o.points, " pts"),
      (m?.labels.get(S) ?? Ie(o.label)).map((n, f) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + f, transform: D(12, (l ? 21 : 17) + f * 16), fontSize: 14 }, n))
    );
  }));
}
const kt = (t) => Ee(t, !1), wt = (t) => Ee(t, !0);
function Pt({ value: t, onChange: p, onPreview: r, onSelectCard: s, onEditCard: a, onEditStation: m, onEditLane: d, onAddCard: c, onUndo: u, canUndo: l, readOnly: b = !1, fitLanes: x = !1, mapCanvas: w = !1, showPlacementOutcomes: g = !0, showMoveControls: k = !0 }) {
  const E = e.useRef(null), v = e.useId(), $ = e.useRef(null), M = e.useRef(!1), W = e.useRef(null), [z, o] = e.useState(0), h = w && !!t.lanes[0].station, S = h || x && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const i = E.current;
    if (!S || !i) return;
    const L = () => o(i.clientWidth);
    L();
    const N = new ResizeObserver(L);
    return N.observe(i), () => N.disconnect();
  }, [S]);
  const n = e.useMemo(() => S && z ? st(t, z, h) : void 0, [S, z, t, h]), { width: f, height: C } = se(t, n?.layout, h ? ee : void 0), y = t.kind === "release-plan", P = !!t.signals?.length, [B, ne] = e.useState(0), A = e.useRef(!1), H = e.useRef(null), [pe, Ae] = e.useState(null), [j, V] = e.useState(null), [ue, ye] = e.useState(null), q = !b && j?.source === t ? j : null, xe = e.useRef(t), G = e.useCallback((i) => {
    (y || P) && Ae(i), r?.(i);
  }, [y, P, r]), K = e.useCallback(() => {
    A.current = !1, H.current = null, V(null), G(null), ne((i) => i + 1);
  }, [G]);
  e.useLayoutEffect(() => {
    xe.current !== t && (A.current || j) && K(), xe.current = t;
  }, [t, j, K]);
  const _ = (i, L) => {
    A.current = !1, V(null), G(null), i !== t && (y && !u && ye({ before: t, after: i }), p(i, L));
  }, He = (i) => {
    const L = i.cards.find((N) => N.id === H.current);
    _(i, L && { cardId: L.id, laneId: L.laneId });
  }, Ke = e.useCallback((i) => {
    const L = i.type === "dragging" ? i : i.pendingDrag?.status;
    A.current = !!L, L ? (H.current = L.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, V(null)) : H.current !== null && (H.current = null, G(null));
  }, [G]);
  e.useEffect(() => {
    function i(L) {
      !A.current && !j || L instanceof KeyboardEvent && L.key !== "Escape" || K();
    }
    return document.addEventListener("keydown", i), document.addEventListener("pointercancel", i), window.addEventListener("blur", i), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("pointercancel", i), window.removeEventListener("blur", i);
    };
  }, [K, j]);
  const re = b ? null : q?.next ?? pe, R = !!(b || q), ke = !!t.lanes[0].station, U = !R && (ke ? !!m : (!y || !!s) && !!d), Z = !R && !ke && !y && !!c && t.cards.length < Ze, X = !R && !!s, Te = e.useMemo(() => n || U || Z || h || X ? (i) => Ee(i, R, n, U, Z, v, h, X) : R ? wt : kt, [n, R, U, Z, v, h, X]), fe = "[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]", we = X ? fe + ",[data-workshop-card]" : fe;
  function me(i) {
    R || (i.dataset.workshopCard ? s?.(i.dataset.workshopCard) : i.dataset.workshopStation ? m?.(i.dataset.workshopStation) : i.dataset.workshopLane ? d?.(i.dataset.workshopLane, i) : i.dataset.workshopAddCard && c?.(i.dataset.workshopAddCard, i));
  }
  const ve = re ? Math.max(C, se(re, n?.layout, h ? ee : void 0).height) : C, Me = /* @__PURE__ */ e.createElement(
    te,
    {
      key: b ? "read-only" : B,
      draggable: Te,
      state: q?.next ?? t,
      onDropState: b ? void 0 : He,
      onDragState: b ? void 0 : G,
      onDragStatus: Ke,
      width: f,
      height: ve
    }
  );
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, (U || Z) && /* @__PURE__ */ e.createElement("div", { hidden: !0 }, t.lanes.map((i) => /* @__PURE__ */ e.createElement(e.Fragment, { key: i.id }, U && /* @__PURE__ */ e.createElement("span", { id: v + "-edit-" + i.id }, "Edit ", i.label), Z && /* @__PURE__ */ e.createElement("span", { id: v + "-add-" + i.id }, "Add card to ", i.label)))), X && /* @__PURE__ */ e.createElement("div", { hidden: !0 }, t.cards.map((i) => /* @__PURE__ */ e.createElement("span", { key: i.id, id: v + "-select-" + i.id }, "Select ", i.label))), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: E,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (i) => {
        const L = i.target.closest(we);
        !L || !["Enter", " "].includes(i.key) || (i.preventDefault(), i.repeat || me(L));
      },
      onClickCapture: (i) => {
        const L = i.target.closest(we), N = i.detail === 0 || !M.current;
        M.current = !1, L && N && me(L);
      },
      onPointerDownCapture: (i) => {
        if (M.current = !0, $.current = null, R || !i.isPrimary || i.button !== 0) return;
        const L = i.target.closest(fe + ",[data-workshop-card]");
        L && ($.current = { target: L, x: i.clientX, y: i.clientY });
      },
      onPointerMoveCapture: (i) => {
        $.current && Math.hypot(i.clientX - $.current.x, i.clientY - $.current.y) > 5 && ($.current = null, W.current = null);
      },
      onPointerCancelCapture: () => {
        $.current = null, W.current = null;
      },
      onPointerUpCapture: (i) => {
        const L = $.current;
        if ($.current = null, !L || R || Math.hypot(i.clientX - L.x, i.clientY - L.y) > 5) return;
        const N = L.target.dataset.workshopCard;
        if (!N || X) {
          W.current = null, me(L.target);
          return;
        }
        a && (W.current?.id === N && i.timeStamp - W.current.at < 400 ? (W.current = null, a(N)) : W.current = { id: N, at: i.timeStamp });
      }
    },
    h ? /* @__PURE__ */ e.createElement(dt, { board: q?.next ?? t, fitted: n, width: f, height: ve }, Me) : Me
  ), P && g && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Fe(re ?? t).map((i) => /* @__PURE__ */ e.createElement("p", { key: i.id }, /* @__PURE__ */ e.createElement("strong", null, i.label), /* @__PURE__ */ e.createElement("br", null), i.text))), y && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(pt, { value: t, preview: re }), !b && /* @__PURE__ */ e.createElement(e.Fragment, null, k && /* @__PURE__ */ e.createElement(
    ut,
    {
      value: t,
      preview: q?.move ?? null,
      stage: (i, L) => {
        V({ source: t, next: i, move: L }), r?.(i);
      },
      cancel: K,
      apply: () => {
        q && (_(q.next, q.move), G(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(u ? l : ue?.after === t), onClick: () => {
    K(), u ? u() : ue?.after === t && (ye(null), p(ue.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((i) => {
    const L = t.lanes.find((N) => N.id === i.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: i.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, i.label, " · ", L.label), (!h || L.station.outcome !== L.label) && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("br", null), L.station.outcome)), L.station.image && /* @__PURE__ */ e.createElement(
      "img",
      {
        src: L.station.image.src,
        alt: L.station.image.alt,
        referrerPolicy: "no-referrer",
        style: { display: "block", maxWidth: "100%", width: 360, maxHeight: 240, objectFit: "contain", objectPosition: "left", marginBlock: "8px" }
      }
    ), ce(t, i).filter((N) => N.id !== i.laneId).map((N) => /* @__PURE__ */ e.createElement("button", { key: N.id, type: "button", disabled: b, onClick: () => _(de(t, i.id, N.id), { cardId: i.id, laneId: N.id }) }, i.label, " → ", N.label)));
  })), k && !y && !h && t.cards.length > 0 && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((i) => /* @__PURE__ */ e.createElement("label", { key: i.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, i.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: b,
      "aria-label": "Move " + i.label,
      value: q?.move.cardId === i.id ? q.move.laneId : i.laneId,
      onChange: (L) => {
        const N = { cardId: i.id, laneId: L.currentTarget.value }, oe = de(t, i.id, N.laneId);
        P ? oe === t ? K() : (V({ source: t, next: oe, move: N }), r?.(oe)) : _(oe, N);
      }
    },
    ce(t, i).map((L) => /* @__PURE__ */ e.createElement("option", { key: L.id, value: L.id }, L.label))
  ))), q && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => _(q.next, q.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: K }, "Cancel move"))));
}
export {
  Wt as FocusDarkroomBoard,
  zt as ListeningRoomBoard,
  Ct as MoonGalleryBoard,
  $t as OfflineHandoffBoard,
  pt as ReleasePlanReadout,
  Nt as StartupWorkshopBoard,
  Pt as WorkshopBoard,
  qt as addWorkshopBranch,
  Ft as addWorkshopCard,
  Rt as addWorkshopLane,
  ce as availableLanes,
  he as canHangPanel,
  Ue as channels,
  Bt as createBudgetWorkshop,
  At as createInterviewWorkshop,
  Ht as createLaneWorkshop,
  Kt as createWorkshopMap,
  Tt as decodeWorkshopFragment,
  Gt as describeFocusDarkroom,
  jt as encodeWorkshopFragment,
  Se as handoffSummary,
  le as hangGalleryPanel,
  Xt as industrialWorkshop,
  Yt as initialFocusDarkroom,
  _e as interviews,
  Je as laneColors,
  $e as listeningRoom,
  ze as listeningRoomCaption,
  Ze as maxWorkshopCards,
  Qt as moonGallery,
  de as moveWorkshopCard,
  Vt as nightTransfer,
  _t as normalizeFocusDarkroom,
  Ut as normalizeListeningRoom,
  Zt as normalizeMoonGallery,
  Jt as normalizeOfflineHandoff,
  Ye as offlineHandoff,
  be as planStartupMove,
  Y as printFields,
  qe as releaseLoad,
  Ot as releasePlan,
  Le as resolveHandoff,
  Fe as resolveWorkshopSignals,
  ae as reviewHandoff,
  Ve as startupExperienceKind,
  en as validateWorkshop,
  Ce as workshopBudgetResult,
  ie as workshopLayout,
  se as workshopPositions,
  tn as workshopPresentationLanes,
  nn as workshopPresentationScenes,
  Qe as workshopToSlate
};
