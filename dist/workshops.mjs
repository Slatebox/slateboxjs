import e, { useState as I, useRef as F, useMemo as qe, useLayoutEffect as O, useEffect as Q, useId as Xe } from "react";
import { DraggableRenderer as ne, translate as D, param as Qe, inOrder as Ve, Vec2 as Le, getElementPositionCheap as _e, dragSpecToBehavior as Ue } from "./dragology.mjs";
import { handoffSummary as Se, reviewHandoff as ie, resolveHandoff as Ce, offlineHandoff as Ze, listeningRoom as We, listeningRoomCaption as ze, workshopLayout as se, workshopToSlate as Je, workshopPositions as ce, releaseLoad as Fe, laneColors as Oe, availableLanes as ee, moveWorkshopCard as de, workshopDestinations as et, workshopCandidate as Re, canHangPanel as Ee, hangGalleryPanel as le, printFields as X, startupExperienceKind as tt, resolveWorkshopSignals as Be, workshopBudgetResult as $e, interviews as nt, channels as rt, maxWorkshopCards as ot } from "./workshop-model.mjs";
import { WorkshopReferenceError as Kt, addWorkshopBranch as Gt, addWorkshopCard as jt, addWorkshopLane as Yt, applyWorkshopEdits as Xt, attachWorkshop as Qt, checkWorkshopReplacement as Vt, countWord as _t, createBudgetWorkshop as Ut, createInterviewWorkshop as Zt, createLaneWorkshop as Jt, createWorkshopMap as Ot, decodeWorkshopFragment as en, describeFocusDarkroom as tn, describeWorkshopEdits as nn, encodeWorkshopFragment as rn, industrialWorkshop as on, initialFocusDarkroom as an, listed as ln, maxWorkshopLines as sn, moonGallery as cn, named as dn, nightTransfer as pn, normalizeFocusDarkroom as un, normalizeListeningRoom as fn, normalizeMoonGallery as mn, normalizeOfflineHandoff as bn, planStartupMove as gn, pointing as hn, releasePlan as En, said as yn, unquoted as xn, validateWorkshop as kn, workshopBoardKind as wn, workshopCardAsNote as vn, workshopCardAsNoteRefusal as Mn, workshopCardLabelOf as Ln, workshopCardLines as Sn, workshopCardLookOf as Cn, workshopEditKinds as Wn, workshopFinder as zn, workshopKeepsLink as $n, workshopKeepsPicture as Nn, workshopLaneCaption as Pn, workshopLanePlaces as In, workshopLineRefusal as Dn, workshopLinesOf as qn, workshopNewLine as Fn, workshopNodeIds as Rn, workshopNoteCandidate as Bn, workshopNoteRefusal as An, workshopPresentationLanes as Hn, workshopPresentationScenes as Tn, workshopReferences as Kn, workshopRefusal as Gn, workshopRenamedLines as jn, workshopStandInId as Yn, workshopTakesNotes as Xn, workshopWithLine as Qn, workshopWithoutCardLines as Vn, workshopWithoutLine as _n } from "./workshop-model.mjs";
import { Slate as at } from "slateboxjs";
import { D as Zn } from "./NoteDefaults-1xFW0br8.mjs";
function it(t, d, r) {
  return /* @__PURE__ */ e.createElement("g", { transform: `translate(${t} ${d}) scale(${r} ${r * 0.88})` }, /* @__PURE__ */ e.createElement("rect", { width: "142", height: "73", rx: "3", fill: "#b8d0c5" }), /* @__PURE__ */ e.createElement("path", { d: "M0 27L46 7h96v12H50L0 38Z", fill: "#728d81" }), /* @__PURE__ */ e.createElement("path", { d: "M12 38l36-17v43l-36 6z", fill: "#395c50" }), /* @__PURE__ */ e.createElement("path", { d: "M49 20h89v43H49z", fill: "#f1e3b8" }), /* @__PURE__ */ e.createElement("path", { d: "M57 33h45v30H57z", fill: "#557468" }), [37, 42, 47, 52, 57].map((l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "slat" + l, d: `M59 ${l}h41`, stroke: "#a5b6a3" })), /* @__PURE__ */ e.createElement("path", { d: "M0 69l49-7h93v11H0z", fill: "#84998a" }), /* @__PURE__ */ e.createElement("path", { d: "M12 73l40-7h65", fill: "none", stroke: "#e9b04e", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("rect", { x: "111", y: "34", width: "19", height: "27", fill: "#d1a45c" }), /* @__PURE__ */ e.createElement("rect", { x: "116", y: "39", width: "9", height: "12", rx: "2", fill: "#38574b" }), /* @__PURE__ */ e.createElement("circle", { cx: "120", cy: "42", r: "2", fill: "#f0a466" }), /* @__PURE__ */ e.createElement("text", { x: "59", y: "30", fontSize: "8", fontWeight: "bold", fill: "#354e40" }, "GATE B"));
}
function lt(t, d) {
  const r = t ? 9 : 49, l = t ? 20 : 23, a = t ? 144 : 181, f = t ? 183 : 370, p = t ? 35 : 40, s = t ? 164 : 255, u = t ? 119 : 147, o = 45, m = (y, w, g, x, h = "#243c32", v = "normal", C = "Arial, sans-serif") => /* @__PURE__ */ e.createElement("text", { transform: D(y, w), fill: h, fontSize: x, fontFamily: C, fontWeight: v }, g);
  return ({ state: y, d: w, draggedId: g }) => {
    const x = y.stage === "queued", h = y.stage === "resolved", v = f + (s - u) / 2, C = p + 138, M = x ? r + (a - u) / 2 : v, z = x ? l + 141 : C, W = "#233e33";
    return /* @__PURE__ */ e.createElement("g", { fontFamily: "Arial, sans-serif" }, /* @__PURE__ */ e.createElement("g", { id: "sync-cable" }, /* @__PURE__ */ e.createElement("path", { d: `M${r + a - 2} ${l + 180} C${r + a + 45} ${l + 235},${f - 24} ${p + 204},${f + 22} ${p + 159}`, fill: "none", stroke: x ? "#9aab9b" : "#2a7464", strokeWidth: "2.5", strokeDasharray: x ? "5 7" : "8 2" })), /* @__PURE__ */ e.createElement("g", { id: "field-phone", transform: D(r, l) }, /* @__PURE__ */ e.createElement("rect", { x: "3", y: "5", width: a, height: "202", rx: "18", fill: "#a6b3a5" }), /* @__PURE__ */ e.createElement("rect", { width: a, height: "202", rx: "18", fill: "#243d34" }), /* @__PURE__ */ e.createElement("rect", { x: "5", y: "5", width: a - 10, height: "192", rx: "14", fill: "#f4f1db" }), /* @__PURE__ */ e.createElement("rect", { x: a / 2 - 17, y: "7", width: "34", height: "5", rx: "3", fill: "#283b30" }), m(13, 27, "17:08", 9, W, "bold"), m(a - 50, 27, x ? "Offline" : "Online", 10, x ? "#835420" : "#266451", "bold"), m(13, 47, "Field log", t ? 18 : 20, W, "bold"), it(13, 55, (a - 26) / 142), m(13, t ? 132 : 134, "Noor · Gate B", t ? 10 : 12, W), /* @__PURE__ */ e.createElement("rect", { x: a / 2 - 19, y: "190", width: "38", height: "2.6", rx: "2", fill: "#697a69" })), /* @__PURE__ */ e.createElement("g", { id: "shared-notebook", transform: D(f, p) }, /* @__PURE__ */ e.createElement("path", { d: `M4 3l${s - 5} -3 5 190 -${s - 3} 5z`, fill: "#c6c4ab" }), /* @__PURE__ */ e.createElement("path", { d: `M-3 5l${s - 1} -3 3 183 -${s - 1} 6z`, fill: "#dccfb0", stroke: "#b2aa8c" }), /* @__PURE__ */ e.createElement("rect", { width: s, height: "184", fill: "#fffbea", stroke: "#b9ba9f" }), /* @__PURE__ */ e.createElement("path", { d: "M15 0v184", stroke: "#e1b9a6" }), [30, 65, 100, 135, 169].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "hole" + i, cx: "8", cy: i, r: "2.7", fill: "#bfbba7" })), /* @__PURE__ */ e.createElement("path", { d: "M29 7V1q0-7 6-7t6 7v16q0 5-4 5t-4-4V3", fill: "none", stroke: "#718273", strokeWidth: "2" }), m(23, 38, x ? "SHIFT HANDOFF" : h ? "CREW COPY" : "REVIEW QUEUE", t ? 10 : 12, "#586e5f", "bold", "monospace"), m(22, 69, "Gate B", t ? 30 : 37, W, "bold", "Georgia, serif"), /* @__PURE__ */ e.createElement("path", { d: `M23 79h${s - 42}`, stroke: "#bfc5b1" }), m(23, 101, (h && y.choice === "field" ? y.fieldNote : y.deskNote).slice(0, t ? 18 : 25), t ? 12 : 16, W, "bold"), m(23, 120, h && y.choice === "field" ? "Noor + Jules" : "Jules · Release desk", t ? 10 : 12, "#5a6c5d"), /* @__PURE__ */ e.createElement("g", { id: "desk-drop", transform: D((s - u) / 2, 138) }, /* @__PURE__ */ e.createElement("rect", { width: u, height: o, rx: "3", stroke: "#849785", strokeDasharray: "4 3", fill: "#f0f2df" }), m(11, 26, "Attach field edit", t ? 12 : 15, "#607465"))), /* @__PURE__ */ e.createElement(
      "g",
      {
        id: "field-edit",
        transform: D(M, z),
        dragologyZIndex: g === "field-edit" ? "/2" : !1,
        dragologyOnDrag: !d && x ? () => w.closest([y, ie(y)]).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("path", { d: `M2 3h${u - 2}v${o - 2}l-6 5H2z`, fill: "#a29165" }),
      /* @__PURE__ */ e.createElement("path", { d: `M0 0h${u}v${o - 7}l-7 7H0z`, fill: h ? "#c8ddbe" : "#ffcf72", stroke: "#ae8a42" }),
      /* @__PURE__ */ e.createElement("path", { d: `M${u - 7} ${o}v-7h7`, fill: "#ca9f55" }),
      [13, 18, 23].map((i) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "handle" + i, cx: "8", cy: i, r: "1.3", fill: "#84662e" })),
      m(17, 17, "BADGE TEST", t ? 9 : 11, "#72522e", "bold", "monospace"),
      m(17, 34, h ? "Reviewed" : y.fieldNote === Ze.fieldNote ? "Badge rejected" : "Field result", t ? 13 : 16, "#42351f", "bold")
    ));
  };
}
const st = `.sb-handoff .field-art{border-block:1px solid #bac3b1;background-color:#e8ede0;background-image:linear-gradient(90deg,#bdc9b742 1px,transparent 1px),linear-gradient(#bdc9b742 1px,transparent 1px);background-size:20px 20px;overflow:hidden}
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
function It({ value: t, onChange: d, readOnly: r = !1 }) {
  const [l, a] = I(null), [f, p] = I(null), [s, u] = I(0), [o, m] = I(!1), [y, w] = I(1), g = F(null), x = F(!1), h = F(t), v = qe(() => lt(o, r), [o, r]), C = r ? t : f ?? l ?? t, M = t.stage === "queued" && C.stage === "review";
  function z() {
    x.current = !1, p(null), a(null), u((i) => i + 1);
  }
  function W(i) {
    z(), !r && i.stage !== t.stage && d?.(i);
  }
  return O(() => {
    (x.current || f) && (r || h.current !== t) && z(), h.current = t;
  }, [t, r, f]), O(() => {
    const i = () => {
      const L = g.current.clientWidth;
      m(L < 510), w(Math.min(1, L / (L < 510 ? 360 : 685)));
    };
    i();
    const E = new ResizeObserver(i);
    return E.observe(g.current), () => E.disconnect();
  }, []), Q(() => {
    function i(E) {
      (x.current || f) && (!(E instanceof KeyboardEvent) || E.key === "Escape") && z();
    }
    return document.addEventListener("keydown", i), document.addEventListener("pointercancel", i), window.addEventListener("blur", i), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("pointercancel", i), window.removeEventListener("blur", i);
    };
  }, [f]), /* @__PURE__ */ e.createElement("section", { className: "sb-handoff", "data-stage": t.stage, "data-readonly": r, "aria-label": "Field handoff simulation" }, /* @__PURE__ */ e.createElement("style", null, st), /* @__PURE__ */ e.createElement("div", { className: "field-art", ref: g, style: { "--drawing-scale": y } }, /* @__PURE__ */ e.createElement(
    ne,
    {
      key: r ? "read-only" : s,
      state: f ?? t,
      draggable: v,
      width: o ? 360 : 685,
      height: o ? 254 : 262,
      onDragState: r ? void 0 : (i) => {
        x.current = !0, a(i.stage !== t.stage && t.stage === "queued" ? i : null);
      },
      onDropState: r ? void 0 : W
    }
  )), t.stage !== "resolved" ? /* @__PURE__ */ e.createElement("section", { className: "field-versions " + (C.stage === "review" ? "comparing" : ""), "aria-label": "Note versions" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Noor’s field test"), /* @__PURE__ */ e.createElement("p", null, t.fieldNote), /* @__PURE__ */ e.createElement("small", null, "17:08 · ", C.stage === "queued" ? "Saved on phone" : "Incoming edit")), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("h2", null, "Jules’s shared note"), /* @__PURE__ */ e.createElement("p", null, t.deskNote), /* @__PURE__ */ e.createElement("small", null, "17:05 · ", t.fallback))) : /* @__PURE__ */ e.createElement("section", { className: "field-outcome", "aria-label": "Published handoff" }, /* @__PURE__ */ e.createElement("h2", null, t.choice === "field" ? "Field test accepted" : "Shared note retained"), /* @__PURE__ */ e.createElement("p", null, Se(t)), /* @__PURE__ */ e.createElement("small", null, t.choice === "field" ? "Field result and fallback shared with the crew." : "Noor’s field test stays in the review history.")), /* @__PURE__ */ e.createElement("div", { className: "field-actions" }, t.stage !== "resolved" && /* @__PURE__ */ e.createElement("span", { role: "status" }, M ? "The two access reports disagree." : Se(t)), !r && (t.stage === "queued" ? M ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => W(ie(t)) }, "Send for review"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: z }, "Cancel preview")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => p(ie(t)) }, "Preview sync") : t.stage === "review" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => W(Ce(t, "field")) }, "Merge field test"), /* @__PURE__ */ e.createElement("button", { type: "button", className: "field-quiet", onClick: () => W(Ce(t, "desk")) }, "Keep shared note")) : /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => W(ie(t)) }, "Reopen review")), !r && t.stage !== "queued" && /* @__PURE__ */ e.createElement(
    "button",
    {
      type: "button",
      className: "field-quiet",
      onClick: () => W({ ...t, stage: "queued", choice: null })
    },
    "Start over"
  )));
}
function ct() {
  const t = window.AudioContext || window.webkitAudioContext;
  if (!t) throw new Error("Web Audio is unavailable");
  const d = new t(), r = d.sampleRate, l = r * 4, a = d.createBuffer(1, l, r), f = d.createBuffer(1, l, r), p = a.getChannelData(0), s = f.getChannelData(0);
  let u = 419;
  function o() {
    return u = 1664525 * u + 1013904223 >>> 0, u / 4294967296;
  }
  for (let y = 0; y < 100; y++) {
    const w = Math.floor(o() * l), g = 380 + o() * 1500, x = 0.09 + o() * 0.08;
    for (let h = 0; h < r * 0.12; h++) {
      const v = h / r, C = Math.sin(2 * Math.PI * g * v) + 0.22 * (o() * 2 - 1);
      p[(w + h) % l] += x * Math.exp(-v * 76) * C;
    }
  }
  [659.25, 987.77, 783.99, 1174.66].forEach((y, w) => {
    const g = Math.floor((w * 0.93 + 0.1) * r);
    for (let x = 0; x < r * 1.6; x++) {
      const h = x / r, v = Math.sin(h * y * 2 * Math.PI) + 0.23 * Math.sin(h * y * 5.42 * Math.PI);
      s[(g + x) % l] += 0.16 * Math.min(1, h * 250) * Math.exp(-h * 3.3) * v;
    }
  });
  const m = [a, f].map((y) => {
    const w = d.createBufferSource(), g = d.createGain();
    return g.gain.value = 0, w.buffer = y, w.loop = !0, w.connect(g).connect(d.destination), w.start(), g;
  });
  return {
    ctx: d,
    mix(y) {
      m[0].gain.setTargetAtTime(Math.cos(y * Math.PI / 2), d.currentTime, 0.035), m[1].gain.setTargetAtTime(Math.sin(y * Math.PI / 2), d.currentTime, 0.035);
    },
    stop() {
      d.close();
    }
  };
}
function Ae({ state: t, d, isTracking: r }, l) {
  const a = t.mix, f = 106 + 420 * a, p = D(f, 220);
  return r ? /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: p }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "276", fill: "#302342" }), /* @__PURE__ */ e.createElement("path", { d: "M0 200L95 174 285 184 440 161 640 194v82H0z", fill: "#3f2d4f" }), /* @__PURE__ */ e.createElement("path", { d: "M0 228l198-33 184 11 258-27M0 255l270-37 282-13 88 2", stroke: "#564063", fill: "none" }), Array.from({ length: 21 }, (s, u) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "star" + u, cx: 18 + u * 137 % 604, cy: 12 + u * 47 % 103, r: u % 4 === 0 ? 1.7 : 0.85, fill: "#c7b5cb" })), /* @__PURE__ */ e.createElement("g", { id: "copper-rain", opacity: 1 - a * 0.45 }, Array.from({ length: 30 }, (s, u) => {
    const o = 29 + u * 31 % 184, m = 24 + u * 19 % 58;
    return /* @__PURE__ */ e.createElement("path", { dragologyKey: "drop" + u, d: `M${o} ${m}l-3 8`, stroke: u % 3 === 0 ? "#e8d8d5" : "#b4c8d1", strokeWidth: u % 3 === 0 ? 2 : 1 });
  }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l91-44 132 42-91 49z", fill: "#eb9d64" }), /* @__PURE__ */ e.createElement("path", { d: "M21 111l132 47v8L21 120z", fill: "#96513e" }), /* @__PURE__ */ e.createElement("path", { d: "M153 158l91-49v8l-91 49z", fill: "#b76e4d" }), [0, 1, 2, 3, 4, 5, 6].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ridge" + s, d: `M${39 + s * 15} ${116 + s * 5.3}l89-44`, stroke: "#b96d50", strokeWidth: "2" })), /* @__PURE__ */ e.createElement("path", { d: "M43 128v52l7 3v-52m155-2v43l7-3v-43", fill: "#9f7466" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "121", cy: "183", rx: "75", ry: "7", fill: "#221e34" }), [0, 1, 2].map((s) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "ring" + s, d: `M${65 + s * 35} ${177 - s * 2}q13-4 22 0q-10 4-22 0`, fill: "none", stroke: "#d3a287", strokeWidth: "1.5" }))), /* @__PURE__ */ e.createElement("g", { id: "glass-chimes", opacity: 0.59 + a * 0.41 }, /* @__PURE__ */ e.createElement("path", { d: "M386 46l160-14 57 17-158 18z", fill: "#be9272" }), /* @__PURE__ */ e.createElement("path", { d: "M386 46v5l59 20 158-17v-5L445 67z", fill: "#865c60" }), [0, 1, 2, 3, 4, 5].map((s) => {
    const u = 407 + s * 32, o = 63 - s % 3 * 4, m = 52 + (s + 1) * 17 % 46;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: "tube" + s, transform: D(u, o) }, /* @__PURE__ */ e.createElement("path", { d: "M0 -9v23", stroke: "#d3d1bc" }), /* @__PURE__ */ e.createElement("path", { d: `M-7 14l8-4 8 3v${m}l-8 5-8-6z`, fill: s % 2 ? "#83c3b3" : "#d6bab9" }), /* @__PURE__ */ e.createElement("path", { d: `M1 11v${m + 7}l7-5V13z`, fill: s % 2 ? "#488b8b" : "#a38ea6" }), /* @__PURE__ */ e.createElement("path", { d: `M-5 18v${m - 9}`, stroke: "#f5f0da", strokeWidth: "2" }));
  }), /* @__PURE__ */ e.createElement("path", { d: "M550 143q14-6 9-23m9 31q18-12 10-32", fill: "none", stroke: "#b9d7ca", strokeWidth: "2", opacity: a })), /* @__PURE__ */ e.createElement("path", { d: "M63 233Q303 204 575 229", fill: "none", stroke: "#1d182b", strokeWidth: "8" }), /* @__PURE__ */ e.createElement("path", { d: "M63 232Q303 203 575 228", fill: "none", stroke: "#ad8c80", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("g", { id: "listening-horn", transform: p, dragologyOnDrag: l ? void 0 : () => d.vary(t, Qe("mix"), { constraint: (s) => Ve([0, s.mix, 1]) }) }, /* @__PURE__ */ e.createElement("rect", { x: "-42", y: "-67", width: "84", height: "90", fill: "transparent" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "0", cy: "12", rx: "39", ry: "6", fill: "#261c32" }), /* @__PURE__ */ e.createElement("path", { d: "M-24 2h48l6 8h-60z", fill: "#bd8c59" }), /* @__PURE__ */ e.createElement("circle", { cx: "-17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("circle", { cx: "17", cy: "11", r: "6", fill: "#e3c992" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 2v-13q0-10 10-13l4-2", stroke: "#ba8755", strokeWidth: "9", fill: "none" }), /* @__PURE__ */ e.createElement("g", { transform: `rotate(${-38 + a * 76} 3 -26)` }, /* @__PURE__ */ e.createElement("path", { d: "M1-20q-8-14-20-24l-13-8q18-21 42-18l-3 13q-4 20 2 30z", fill: "#efbc63", stroke: "#a97740", strokeWidth: "1.5" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "-12", cy: "-60", rx: "25", ry: "8", transform: "rotate(-22 -12 -60)", fill: "#72483c", stroke: "#f2cd7a", strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-1-51q-3 13 3 25", fill: "none", stroke: "#fff1ac", strokeWidth: "2.2" }))));
}
const dt = (t) => Ae(t, !1), pt = (t) => Ae(t, !0), ut = `
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
function Dt({ value: t, onChange: d, readOnly: r = !1 }) {
  const l = F(null), a = F(null), [f, p] = I(null), [s, u] = I(0), [o, m] = I(1), [y, w] = I(!1), [g, x] = I(!1), h = f ?? t, v = F(t), C = F(!1);
  function M() {
    C.current = !1, p(null), u((n) => n + 1);
  }
  O(() => {
    C.current && (r || t !== v.current) && M(), v.current = t;
  }, [t, r]), O(() => {
    const n = l.current, b = () => m(Math.min(1, n.clientWidth / 640));
    b();
    const $ = new ResizeObserver(b);
    return $.observe(n), () => $.disconnect();
  }, []), Q(() => {
    function n(b) {
      C.current && (!(b instanceof KeyboardEvent) || b.key === "Escape") && M();
    }
    return document.addEventListener("keydown", n), document.addEventListener("pointercancel", n), window.addEventListener("blur", n), () => {
      document.removeEventListener("keydown", n), document.removeEventListener("pointercancel", n), window.removeEventListener("blur", n);
    };
  }, []);
  function z(n) {
    C.current = !1, p(null), !r && n !== t.mix && d?.({ ...t, mix: n });
  }
  function W() {
    a.current?.stop(), a.current = null, w(!1);
  }
  Q(() => {
    a.current?.mix(h.mix);
  }, [h.mix]), Q(() => {
    const n = new IntersectionObserver(([$]) => {
      $.isIntersecting || W();
    });
    n.observe(l.current);
    const b = () => {
      document.hidden && W();
    };
    return document.addEventListener("visibilitychange", b), () => {
      n.disconnect(), document.removeEventListener("visibilitychange", b), a.current?.stop(), a.current = null;
    };
  }, []);
  async function i() {
    if (a.current) {
      W();
      return;
    }
    try {
      const n = ct();
      a.current = n, n.mix(h.mix), await n.ctx.resume(), a.current === n && w(!0);
    } catch {
      W(), x(!0);
    }
  }
  const E = t.leftLabel === We.leftLabel ? "rain" : t.leftLabel, L = t.rightLabel === We.rightLabel ? "glass" : t.rightLabel;
  return /* @__PURE__ */ e.createElement("section", { className: "sb-listening", "aria-label": "Listening room mix" }, /* @__PURE__ */ e.createElement("style", null, ut), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: l,
      className: "sb-listening-stage exhibit-stage",
      style: { "--horn-scale": o },
      role: "slider",
      "aria-label": "Listening horn",
      "aria-readonly": r,
      tabIndex: r ? -1 : 0,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": Math.round(h.mix * 100),
      "aria-valuetext": ze(h),
      onKeyDown: (n) => {
        if (r) return;
        const b = {
          ArrowLeft: h.mix - 0.01,
          ArrowRight: h.mix + 0.01,
          ArrowDown: h.mix - 0.01,
          ArrowUp: h.mix + 0.01,
          Home: 0,
          End: 1
        };
        Object.prototype.hasOwnProperty.call(b, n.key) && (n.preventDefault(), z(Math.round(100 * Math.min(1, Math.max(0, b[n.key]))) / 100));
      }
    },
    /* @__PURE__ */ e.createElement(
      ne,
      {
        key: r ? "read-only" : s,
        state: t,
        draggable: r ? pt : dt,
        width: 640,
        height: 276,
        onDragState: r ? void 0 : (n) => {
          C.current = n !== null, p(n);
        },
        onDropState: r ? void 0 : (n) => z(n.mix)
      }
    )
  ), !r && /* @__PURE__ */ e.createElement("div", { className: "sb-listening-choices" }, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => z(0) }, "Listen to ", E), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => z(0.5) }, "Blend both"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => z(1) }, "Listen to ", L)), /* @__PURE__ */ e.createElement("div", { className: "sb-listening-caption" }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", null, "Sound caption"), /* @__PURE__ */ e.createElement("output", { "aria-label": "Sound caption" }, ze(h))), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: i, "aria-pressed": y, disabled: g }, g ? "Audio unavailable" : y ? "Mute sound" : "Enable sound")));
}
function ft(t, d, r) {
  const l = [];
  let a = "";
  for (const f of t.split(/\s+/u)) {
    const p = a ? a + " " + f : f;
    if (r.measureText(p).width <= d) {
      a = p;
      continue;
    }
    a && l.push(a), a = "";
    for (const s of f)
      a && r.measureText(a + s).width > d && (l.push(a), a = ""), a += s;
  }
  return a && l.push(a), l;
}
const te = 12;
function mt(t, d, r = !1) {
  const l = r ? Math.max(...t.lanes.map((g) => g.station.column)) + 1 : t.lanes.length, a = r ? (l - 1) * te : 0, f = Math.min(r ? 202 : se.pitch, Math.max(r ? 108 : 124, Math.floor((d - a) / l))), p = f - 16, s = document.createElement("canvas").getContext("2d"), u = /* @__PURE__ */ new Map();
  function o(g, x, h) {
    s.font = h;
    let v = 1;
    for (const C of g) {
      const M = r && x === "choice-" ? 49 : 25, z = ft(C.label, p - M, s);
      u.set(x + C.id, z), v = Math.max(v, z.length);
    }
    return v;
  }
  const m = o(t.lanes, "heading-", r ? "bold 15px system-ui, sans-serif" : "bold 13px system-ui, sans-serif"), y = o(t.cards, "choice-", "14px system-ui, sans-serif");
  if (r) {
    const g = 16 * y + 22;
    return { labels: u, layout: { pitch: f, width: p, height: g, row: g + 6, top: 16 * m + 32 } };
  }
  const w = Math.max(se.height, 16 * y + 14);
  return { labels: u, layout: { pitch: f, width: p, height: w, row: w + 12, top: 16 * m + 45 } };
}
function bt(t, d) {
  const r = Je(t), l = d?.layout ?? se, { points: a } = ce(t, l, te), f = new Map(r.nodes.map((s) => [s.options.id, s])), p = [];
  for (const [s, u] of t.lanes.entries()) {
    const o = a[s], m = f.get("lane-" + u.id);
    Object.assign(m.options, {
      xPos: o.x + 8,
      yPos: o.y + 4,
      width: l.width,
      height: l.top - 12,
      text: (d?.labels.get("heading-" + u.id) ?? [u.label]).join(`
`),
      fontSize: 14,
      backgroundColor: "#edf4ee",
      foregroundColor: "#263e34",
      borderColor: "#9ab3a0",
      allowDrag: !1
    }), p.push(m);
    for (const [y, w] of t.cards.filter((g) => g.laneId === u.id).entries()) {
      const g = f.get("card-" + w.id);
      Object.assign(g.options, {
        xPos: o.x + 18,
        yPos: o.y + l.top + y * l.row,
        width: l.width - 20,
        height: l.height - 6,
        text: (d?.labels.get("choice-" + w.id) ?? [w.label]).join(`
`),
        fontSize: 14,
        backgroundColor: "#ffda75",
        foregroundColor: "#293629",
        borderColor: "#8e814a",
        allowDrag: !1
      }), p.push(g);
    }
  }
  return { ...r, nodes: p };
}
function gt({ board: t, fitted: d, width: r, height: l, children: a }) {
  const f = F(null), p = F(null);
  return O(() => {
    const s = f.current, u = p.current;
    s.setAttribute("inert", "");
    const o = document.createElement("div");
    o.style.cssText = "width:100%;height:100%", s.appendChild(o);
    const m = new at(o, {
      name: t.title,
      enabled: !1,
      showUndoRedo: !1,
      showMultiSelect: !1,
      viewPort: { originalWidth: r, originalHeight: l, showCoordinates: !1 },
      panZoom: { enabled: !1 },
      autoResizeNodesBasedOnText: !1
    }), y = m.canvas.node;
    y.removeAttribute("tabindex");
    let w = !0, g = 0, x = !1;
    const h = () => {
      if (g = 0, !x) return;
      const W = y.getScreenCTM();
      if (!W) return;
      const i = W.inverse();
      for (const E of u.querySelectorAll("[data-workshop-card]")) {
        const L = E.getScreenCTM(), n = m.nodes.one("card-" + E.dataset.workshopCard);
        if (!L || !n) continue;
        const b = new DOMPoint(L.e, L.f).matrixTransform(i);
        (Math.abs(b.x - (n.options.x ?? 0)) > 0.1 || Math.abs(b.y - (n.options.y ?? 0)) > 0.1) && n.position(b.x, b.y);
      }
    }, v = () => {
      g || (g = requestAnimationFrame(h));
    }, C = new MutationObserver(v);
    C.observe(u, { subtree: !0, childList: !0, attributes: !0, attributeFilter: ["transform", "style"] });
    const M = m.loadJSON(bt(t, d), !1, !0).then(() => {
      w && (x = !0, v());
    }), z = (W) => {
      const i = W.target?.closest("[data-workshop-station],[data-workshop-card]"), E = i?.dataset.workshopStation ? "lane-" + i.dataset.workshopStation : i?.dataset.workshopCard ? "card-" + i.dataset.workshopCard : "", L = m.nodes.one(E)?.svgGroup?.node;
      L && (L.style.outline = W.type === "focusin" ? "2px solid #305d99" : "");
    };
    return u.addEventListener("focusin", z), u.addEventListener("focusout", z), () => {
      w = !1, C.disconnect(), cancelAnimationFrame(g), u.removeEventListener("focusin", z), u.removeEventListener("focusout", z), o.remove(), M.finally(() => m.destroy());
    };
  }, [t, d, r, l]), /* @__PURE__ */ e.createElement("div", { style: { position: "relative", width: r, height: l, marginInline: "auto", isolation: "isolate" } }, /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: f,
      "data-native-workshop-map": "",
      "aria-hidden": "true",
      style: { position: "absolute", inset: 0, pointerEvents: "none" }
    }
  ), /* @__PURE__ */ e.createElement("div", { ref: p, "data-workshop-hit-surface": "", style: { position: "absolute", inset: 0, opacity: 0 } }, a));
}
function He(t, d, r, l = ee(d, r), a = de) {
  const f = l.map((s) => a(d, r.id, s.id));
  if (d.lanes[0].station || d.kind) return t.closest(f).withFloating();
  const p = l.map((s, u) => t.dropTarget("drop-" + s.id, f[u], { boundsState: d }));
  return t.closest(p).whenFar(d).withFloating();
}
function Ne(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((d) => d.trim()) ?? [t];
}
function pe({ state: t, d, draggedId: r, isTracking: l }, a, f, p = !1, s = !1, u = "", o = !1, m = !1) {
  const y = f?.layout ?? se, { width: w, row: g, height: x, top: h } = y, { points: v, height: C } = ce(t, y, o ? te : void 0), M = !!t.lanes[0].station, z = (i) => {
    const E = t.lanes.findIndex((n) => n.id === i.laneId), L = t.cards.filter((n) => n.laneId === i.laneId).indexOf(i);
    return D((M ? 18 : 8) + v[E].x, v[E].y + h + L * g);
  };
  if (l && r) {
    const i = t.cards.find((E) => "choice-" + E.id === r);
    if (i) return /* @__PURE__ */ e.createElement("g", { id: r, transform: z(i) });
  }
  const W = !M && !t.kind;
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, W && r && t.lanes.map((i, E) => /* @__PURE__ */ e.createElement(
    "rect",
    {
      id: "drop-" + i.id,
      x: v[E].x,
      y: 0,
      width: y.pitch,
      height: C,
      fill: "none",
      pointerEvents: "none",
      "aria-hidden": "true"
    }
  )), t.lanes.flatMap((i, E) => (i.station?.next ?? []).map((L) => {
    const n = v[E], b = v[t.lanes.findIndex((ue) => ue.id === L)], $ = w / 2 + 8, k = (h - 12) / 2 + 4, P = b.x - n.x, B = b.y - n.y, re = Math.min(P ? w / 2 / Math.abs(P) : 1 / 0, B ? (k - 4) / Math.abs(B) : 1 / 0), A = b.x + $ - P * re, H = b.y + k - B * re;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: i.id + "-" + L }, /* @__PURE__ */ e.createElement("line", { x1: n.x + $, y1: n.y + k, x2: A, y2: H, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${A} ${H}) rotate(${Math.atan2(B, P) * 180 / Math.PI})` }));
  })), t.lanes.map((i, E) => {
    const L = t.cards.filter(($) => $.laneId === i.id).length, n = t.kind === "release-plan" && Fe(t, i.id), b = t.kind === "release-plan" ? n + (i.capacity ? " / " + i.capacity : "") + " points" : i.station ? L ? "● Occupied" : "Open stop" : i.capacity ? `${L} of ${i.capacity} slots` : `${L} ${L === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + i.id, transform: D(8 + v[E].x, 4 + v[E].y) }, M && !o && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: w, height: h + Math.max(1, L) * g - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("g", { ...p && !a ? {
      ...M ? { "data-workshop-station": i.id } : { "data-workshop-lane": i.id },
      role: "button",
      tabIndex: 0,
      "aria-labelledby": u + "-edit-" + i.id,
      cursor: "pointer"
    } : {} }, /* @__PURE__ */ e.createElement("rect", { width: w, height: h - 12, rx: o ? 12 : M ? 6 : 9, stroke: o ? "#a0b9a6" : void 0, fill: o ? "#f4f8ef" : M ? "#253c36" : Oe[E] }), (f?.labels.get("heading-" + i.id) ?? Ne(i.label)).map(($, k) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + k, fill: o ? "#244b3d" : M ? "#fffdf3" : "#18302d", transform: D(12, (M ? 23 : 16) + k * 16), fontSize: o ? 15 : M ? 17 : 13, fontWeight: "bold" }, $)), !o && /* @__PURE__ */ e.createElement("text", { fill: M ? "#ebd29a" : "#18302d", transform: D(12, h - 23), fontSize: 12 }, b)), s && L < (i.capacity ?? 1 / 0) && /* @__PURE__ */ e.createElement(
      "g",
      {
        "data-workshop-add-card": i.id,
        transform: D(0, h + L * g - 4),
        role: "button",
        tabIndex: 0,
        "aria-labelledby": u + "-add-" + i.id,
        cursor: "pointer"
      },
      /* @__PURE__ */ e.createElement("rect", { width: w, height: 40, rx: 7, fill: "#fbfcf9", stroke: "#64796c", strokeDasharray: "4 3" }),
      /* @__PURE__ */ e.createElement("text", { transform: D(12, 25), fontSize: 14 }, "+ Add card")
    ));
  }), t.cards.map((i) => {
    const E = a ? [] : ee(t, i), L = "choice-" + i.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: L,
        "data-workshop-card": i.id,
        transform: z(i),
        ...m ? { role: "button", tabIndex: 0, "aria-labelledby": u + "-select-" + i.id } : {},
        dragologyZIndex: r === L ? "/1" : !1,
        dragologyOnDrag: E.length > 1 ? () => He(d, t, i, E) : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: M ? w - 20 : w, height: x - (M ? 6 : 0), fill: M ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: o ? 12 : M ? 1 : 8 }),
      M && !o && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: D(12, x - 10), fill: "#466358", fontSize: 12 }, i.points, " pts"),
      (f?.labels.get(L) ?? Ne(i.label)).map((n, b) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + b, transform: D(12, (o ? 21 : 17) + b * 16), fontSize: 14 }, n))
    );
  }));
}
const qt = (t, d, r) => {
  const l = t.cards.find((o) => o.id === d), a = et(t, d);
  if (!l || a.length < 2) return null;
  let f;
  const s = {
    draggable: (o) => (f ?? (f = o.d), pe(o, !1)),
    draggedPath: "",
    draggedId: "choice-" + d,
    anchorPos: Le(r.x, r.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (_e(s, t), !f) return null;
  const u = Ue(He(f, t, l, a, Re), s);
  return (o) => u({ pointer: Le(o.x, o.y) }).dropState;
};
function ht({ value: t, preview: d }) {
  const r = d ?? t, l = new Map(r.lanes.map((p) => [p.id, p.label])), a = new Map(r.cards.map((p) => [p.id, p])), f = r.cards.flatMap((p) => (p.dependsOn ?? []).map((s) => ({ feature: p, prerequisite: a.get(s) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), r.lanes.filter((p) => p.capacity !== void 0).map((p) => {
    const s = Fe(r, p.id);
    return /* @__PURE__ */ e.createElement("div", { key: p.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, p.label), /* @__PURE__ */ e.createElement("output", { "aria-label": p.label + " capacity" }, s, " / ", p.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": p.label + " point budget", min: 0, max: p.capacity, value: s, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), f.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, f.map(({ feature: p, prerequisite: s }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([p.id, s.id]) }, /* @__PURE__ */ e.createElement("strong", null, p.label), " needs ", s.label, " · ", l.get(s.laneId))))), d && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, r.cards.filter((p) => t.cards.find((s) => s.id === p.id)?.laneId !== p.laneId).map((p) => p.label + " → " + l.get(p.laneId)).join(" · ")));
}
function Et({ value: t, preview: d, stage: r, apply: l, cancel: a }) {
  const [f, p] = I(t.cards[0].id), s = t.cards.find((o) => o.id === f) ?? t.cards[0], u = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (o) => {
    o.key === "Escape" && (a(), o.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: u }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: u, value: s.id, onChange: (o) => {
    p(o.target.value), a();
  } }, t.cards.map((o) => /* @__PURE__ */ e.createElement("option", { key: o.id, value: o.id }, o.label))), /* @__PURE__ */ e.createElement("div", null, ee(t, s).filter((o) => o.id !== s.laneId).map((o) => /* @__PURE__ */ e.createElement("button", { key: o.id, type: "button", onClick: () => r(de(t, s.id, o.id), { cardId: s.id, laneId: o.id }) }, "Preview ", o.label))), d && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: l }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: a }, "Cancel preview")));
}
const Pe = [{ x: 90, y: 56 }, { x: 246, y: 56 }, { x: 402, y: 56 }], yt = [{ x: 55, y: 162 }, { x: 219, y: 174 }, { x: 455, y: 154 }], K = 148, J = 104;
function xt(t) {
  const d = (r, l, a) => {
    const f = Array.from({ length: 38 }, (p, s) => {
      const u = Math.min(K, 4 * s), o = t * K + u, m = r + l * (Math.sin(o / 46) + 0.39 * Math.cos(o / 19) + 0.09 * Math.sin(o / 7));
      return (s ? "L" : "M") + u + " " + m.toFixed(1);
    }).join("");
    return /* @__PURE__ */ e.createElement("path", { d: f + `L${K} ${J}H0z`, fill: a });
  };
  return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { x: "-4", y: "-4", width: K + 8, height: J + 8, fill: "#4b423c" }), /* @__PURE__ */ e.createElement("rect", { x: "-2", y: "-2", width: K + 4, height: J + 4, fill: "#caa67d" }), /* @__PURE__ */ e.createElement("rect", { width: K, height: J, fill: "#343b66" }), Array.from({ length: 13 }, (r, l) => /* @__PURE__ */ e.createElement("circle", { dragologyKey: "sky" + l, cx: 6 + (l * 77 + t * 19) % 136, cy: 4 + (l * 29 + t * 11) % 35, r: l % 4 === 0 ? 1.3 : 0.65, fill: "#f4e0bc" })), t === 1 && /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("circle", { cx: "90", cy: "22", r: "15", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("circle", { cx: "95", cy: "18", r: "3", fill: "#ebc68b" }), /* @__PURE__ */ e.createElement("circle", { cx: "85", cy: "28", r: "2", fill: "#ebc68b" })), d(48, 7, "#9b88aa"), d(59, 10, "#bf9492"), d(75, 7, "#596d83"), d(88, 6, "#2a4858"), Array.from({ length: 7 }, (r, l) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "water" + l, d: `M${4 + (l * 37 + t * 13) % 124} ${92 + l * 3 % 10}h${4 + l % 3 * 4}`, stroke: "#7d9b9a" })));
}
function kt(t, d) {
  return ({ state: r, d: l, draggedId: a, isTracking: f }) => {
    const p = (o) => o === 1 ? "panorama-panel" : "gallery-panel-" + o, s = (o) => (r.hung.includes(r.panels[o].id) ? Pe : yt)[o], u = r.panels.findIndex((o, m) => p(m) === a);
    if (f && u >= 0) {
      const o = s(u);
      return /* @__PURE__ */ e.createElement("g", { id: p(u), transform: D(o.x, o.y) });
    }
    return /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "640", height: "300", fill: "#d6c7b2" }), /* @__PURE__ */ e.createElement("path", { d: "M0 0h640v17H0z", fill: "#b8ad99" }), /* @__PURE__ */ e.createElement("path", { d: "M0 220h640v80H0z", fill: "#c19c79" }), /* @__PURE__ */ e.createElement("path", { d: "M0 218h640v7H0z", fill: "#a38d77" }), [0, 1, 2, 3, 4, 5, 6].map((o) => /* @__PURE__ */ e.createElement("path", { dragologyKey: "floor" + o, d: `M${40 + 83 * o} 225l${(o - 3) * 24} 75`, stroke: "#ae8b6c" })), [0, 1, 2].map((o) => /* @__PURE__ */ e.createElement("g", { dragologyKey: "light" + o, transform: D(163 + o * 156, 8) }, /* @__PURE__ */ e.createElement("path", { d: "M-10 0h20l-4 8H-6z", fill: "#67584b" }), /* @__PURE__ */ e.createElement("path", { d: "M-4 9h8l84 181H-84z", fill: "#f8e8bf", opacity: ".22" }))), r.panels.map((o, m) => {
      const y = Pe[m], w = s(m), g = !t && (!d || d.includes(o.id)) && Ee(r, o.id);
      return /* @__PURE__ */ e.createElement("g", { dragologyKey: o.id }, /* @__PURE__ */ e.createElement(
        "rect",
        {
          id: m === 1 ? "gallery-hook" : "gallery-hook-" + m,
          x: y.x,
          y: y.y,
          width: K,
          height: J,
          stroke: "#887e6b",
          strokeDasharray: "4 7",
          fill: "none"
        }
      ), /* @__PURE__ */ e.createElement("circle", { cx: y.x + K / 2, cy: y.y + 6, r: "3", fill: "#7a6c57" }), /* @__PURE__ */ e.createElement(
        "g",
        {
          id: p(m),
          transform: D(w.x, w.y),
          dragologyZIndex: a === p(m) ? "/1" : !1,
          dragologyOnDrag: g ? () => l.between([r, le(r, o.id)]) : void 0
        },
        xt(["dunes", "moon", "coast"].indexOf(o.artwork))
      ));
    }));
  };
}
function Ft({ value: t, onChange: d, onPreview: r, readOnly: l = !1, enabledIds: a }) {
  const f = e.useRef(null), [p, s] = e.useState(1), [u, o] = e.useState(0), [m, y] = e.useState(null), w = e.useRef(t);
  w.current = t;
  const g = e.useMemo(() => kt(l, a), [l, a]), x = (i) => {
    y(i), r?.(i);
  }, h = e.useRef(r);
  h.current = r;
  const v = e.useCallback(() => {
    y(null), h.current?.(null), o((i) => i + 1);
  }, []);
  e.useEffect(() => {
    const i = new ResizeObserver(() => {
      f.current && s(Math.min(1, f.current.clientWidth / 640));
    });
    return i.observe(f.current), () => i.disconnect();
  }, []), e.useEffect(() => {
    v();
    const i = (E) => {
      E.key === "Escape" && v();
    };
    return document.addEventListener("keydown", i), window.addEventListener("blur", v), () => {
      document.removeEventListener("keydown", i), window.removeEventListener("blur", v);
    };
  }, [t, l, v]);
  function C(i) {
    if (x(null), l || w.current !== t) return;
    const E = i.hung.find((L) => !t.hung.includes(L));
    E && (!a || a.includes(E)) && Ee(t, E) && d(le(t, E));
  }
  const M = m ?? t, z = M.panels.find((i) => M.hung.includes(i.id) && !t.hung.includes(i.id)), W = t.panels.filter((i) => !t.hung.includes(i.id));
  return /* @__PURE__ */ e.createElement("section", { "aria-label": "Panorama wall" }, /* @__PURE__ */ e.createElement("div", { className: "exhibit-stage", ref: f, onPointerCancel: v, style: { overflow: "hidden", background: "#d6c7b2" } }, /* @__PURE__ */ e.createElement("div", { style: { width: 640, zoom: p, margin: "auto" } }, /* @__PURE__ */ e.createElement(
    ne,
    {
      key: u,
      draggable: g,
      width: 640,
      height: 300,
      state: t,
      onDragState: x,
      onDropState: C
    }
  ))), /* @__PURE__ */ e.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ e.createElement("strong", null, "Visitor’s view"), /* @__PURE__ */ e.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 150 40", width: "150", height: "40", style: { maxWidth: "45%" } }, M.panels.map((i, E) => /* @__PURE__ */ e.createElement("svg", { key: i.id, x: E * 50, width: "50", height: "40", viewBox: "0 0 50 40" }, /* @__PURE__ */ e.createElement("rect", { width: "50", height: "40", fill: M.hung.includes(i.id) ? "#343b66" : "#c7b8a8" }), M.hung.includes(i.id) && /* @__PURE__ */ e.createElement("g", null, i.artwork === "moon" && /* @__PURE__ */ e.createElement("circle", { cx: "27", cy: "10", r: "6", fill: "#ffdf9a" }), /* @__PURE__ */ e.createElement("path", { d: i.artwork === "dunes" ? "M0 24Q14 8 50 25V40H0z" : i.artwork === "moon" ? "M0 25Q24 36 50 22V40H0z" : "M0 22Q25 8 50 18V40H0z", fill: "#bd969d" }), /* @__PURE__ */ e.createElement("path", { d: "M0 32q13-4 25-1t25 1v8H0z", fill: "#365566" })))))), /* @__PURE__ */ e.createElement("output", { "aria-label": "Panorama", style: { display: "block", marginBlock: 8 } }, z ? z.label + " lines up with its hook." : W.length ? t.hung.length + " of " + t.panels.length + " panels on the wall." : "The panorama is complete."), !l && W.filter((i) => (!a || a.includes(i.id)) && Ee(t, i.id)).map((i) => /* @__PURE__ */ e.createElement("button", { key: i.id, type: "button", onFocus: () => x(le(t, i.id)), onBlur: () => x(null), onClick: () => C(le(t, i.id)) }, "Hang ", i.label)));
}
const wt = ".focus-darkroom{background:#e7ece3;color:#1c3736;padding:clamp(14px,3vw,28px);font:15px/1.4 system-ui,sans-serif}.focus-darkroom h1{font:500 clamp(30px,5vw,45px)/1 Georgia,serif;letter-spacing:-.045em;margin:0}.focus-darkroom>p{margin:.45rem 0 1rem}.focus-darkroom .contact-sheet{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(5px,2vw,13px);background:#183237;padding:14px 12px 0}.focus-darkroom .contact-sheet button{background:#1d4a56;border:1px solid #779390;padding:0;color:#def0dc;min-width:0;cursor:zoom-in}.focus-darkroom .contact-sheet svg{width:100%;display:block;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom .contact-sheet span{display:block;text-align:left;padding:.3rem .45rem;background:#f0e9ce;color:#343b36;font:italic clamp(13px,2vw,19px) Georgia,serif}.focus-darkroom .contact-sheet button:focus,.focus-darkroom button:focus-visible{outline:3px solid #e3a522;outline-offset:2px}.focus-darkroom .return-circuit{background:#14282c;overflow:hidden}.focus-darkroom .return-circuit svg{zoom:var(--circuit-scale);display:block;margin:auto}.focus-darkroom .return-circuit #focus-ring{cursor:grab}.focus-darkroom .wire-controls{display:flex;gap:.4rem;flex-wrap:wrap;margin:.8rem 0 .55rem}.focus-darkroom .wire-controls button,.focus-darkroom dialog button{font:600 13px system-ui,sans-serif;border:1px solid #75918b;border-radius:3px;padding:.5rem .7rem;background:transparent;color:#1e3d3b}.focus-darkroom .wire-controls button[aria-pressed=true]{background:#284e4b;color:#fff}.focus-darkroom output{display:block}.focus-darkroom output:last-of-type{font:500 clamp(18px,3vw,24px)/1.1 Georgia,serif;margin:.45rem 0 0}.focus-darkroom dialog{border:1px solid #597475;background:#e8ebd9;color:#243d40;width:min(76vw,340px);padding:14px}.focus-darkroom dialog svg{display:block;width:100%;background:radial-gradient(ellipse at 62% 59%,#367188,#173e52)}.focus-darkroom dialog h2{font:italic 26px Georgia,serif;margin:.5rem 0}.focus-darkroom dialog::backdrop{background:#0b1b21bd}.focus-darkroom .return-circuit #focus-ring{touch-action:none}.focus-darkroom .contact-sheet span,.focus-darkroom dialog h2{overflow-wrap:anywhere}.focus-darkroom dialog{max-height:90vh;overflow:auto}.focus-darkroom dialog form{display:grid;gap:.4rem}.focus-darkroom dialog input{font:inherit;max-width:100%;min-width:0}.focus-darkroom dialog button{margin-right:.35rem}.focus-darkroom[data-readonly] #focus-ring{cursor:default}", ge = { start: 99, opener: 361 }, vt = { route: null }, Ie = "#ffcb62";
function De(t) {
  return t === 1 ? /* @__PURE__ */ e.createElement("g", { fill: "#d4e6db", stroke: "#8ebcbb", strokeWidth: "1" }, [-1, 1].map((d) => /* @__PURE__ */ e.createElement("g", { key: d, transform: "scale(" + d + " 1)" }, /* @__PURE__ */ e.createElement("path", { d: "M1 1Q20-26 54-33Q54-8 34 7Q54 11 40 29Q20 36 4 14Z" }), /* @__PURE__ */ e.createElement("path", { d: "M5 2L47-25M7 5L37-9M5 11L36 22M7 10L30 29", fill: "none" }), /* @__PURE__ */ e.createElement("ellipse", { cx: "29", cy: "-9", rx: "6", ry: "5", fill: "#3d7280" }), /* @__PURE__ */ e.createElement("circle", { cx: "29", cy: "-9", r: "2", fill: "#e4eee1" }), /* @__PURE__ */ e.createElement("path", { d: "M2-4Q5-17 12-22", fill: "none", stroke: "#d4e6db", strokeWidth: "2" }))), /* @__PURE__ */ e.createElement("ellipse", { cy: "4", rx: "3.3", ry: "15", fill: "#eaebcf" })) : t === 0 ? /* @__PURE__ */ e.createElement("g", { transform: "rotate(22)", stroke: "#cedfd0", fill: "#b6d1be" }, /* @__PURE__ */ e.createElement("path", { d: "M-3 42Q0 0 0-44", fill: "none", strokeWidth: "2" }), Array.from({ length: 11 }, (d, r) => {
    const l = 33 - r * 6, a = 9 + 16 * Math.sin(r / 10 * Math.PI);
    return /* @__PURE__ */ e.createElement("g", { key: r }, /* @__PURE__ */ e.createElement("path", { d: `M0 ${l}q${-a} -2 ${-a - 4} -15q${a} 1 ${a + 4} 15` }), /* @__PURE__ */ e.createElement("path", { d: `M0 ${l - 3}q${a - 1} -3 ${a + 2} -15q${-a} 3 ${-a - 2} 15` }));
  })) : /* @__PURE__ */ e.createElement("g", { stroke: "#d6d6bd", fill: "none", strokeLinecap: "round" }, Array.from({ length: 12 }, (d, r) => {
    const l = (r - 5.5) * 6, a = -18 - 22 * Math.sin(r * Math.PI / 11);
    return /* @__PURE__ */ e.createElement("g", { key: r }, /* @__PURE__ */ e.createElement("path", { d: `M0 39Q${l * 0.35} 6 ${l} ${a}`, strokeWidth: "1.6" }), [1, 2, 3, 4].map((f) => /* @__PURE__ */ e.createElement("path", { key: f, d: `M${l * f / 5} ${35 + (a - 35) * f / 5}q${l * 0.15 - 5} -4 ${l * 0.25 - 7} -13m${7 - l * 0.25} 13q6 -6 7 -13` })));
  }));
}
function Te({ state: t, d, isTracking: r }, l = !1) {
  const a = t.route ? ge[t.route] : 232, f = t.route ? 48 : 85;
  return r ? /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(a, f) }) : /* @__PURE__ */ e.createElement("g", null, /* @__PURE__ */ e.createElement("rect", { width: "460", height: "108", fill: "#14282c" }), [ge.start, ge.opener].map((p, s) => /* @__PURE__ */ e.createElement("g", { dragologyKey: String(p) }, /* @__PURE__ */ e.createElement("path", { d: `M232 85Q${p} 85 ${p} 48V0`, fill: "none", stroke: t.route === "start" && s === 0 || t.route === "opener" && s === 1 ? Ie : "#52727a", strokeWidth: "2", strokeDasharray: "3 5" }), /* @__PURE__ */ e.createElement("circle", { id: s ? "opener-jack" : "first-jack", cx: p, cy: "48", r: "12", fill: "#233d40", stroke: "#608185" }), /* @__PURE__ */ e.createElement("text", { x: p, y: "24", fill: "#dae9e1", fontFamily: "system-ui,sans-serif", fontSize: "13", textAnchor: "middle" }, s ? "Opening print" : "First print"))), /* @__PURE__ */ e.createElement("g", { id: "focus-ring", transform: D(a, f), dragologyOnDrag: l ? void 0 : () => d.closest([vt, { route: "start" }, { route: "opener" }]).withFloating() }, /* @__PURE__ */ e.createElement("circle", { r: "19", fill: "#132a2e", stroke: "#85693d", strokeWidth: "2" }), /* @__PURE__ */ e.createElement("circle", { r: "13.5", fill: "#203336", stroke: Ie, strokeWidth: "4" }), /* @__PURE__ */ e.createElement("path", { d: "M-5 -5L1 8l2-6 6-2z", fill: "#f8db94" })));
}
function Mt(t) {
  return Te(t, !0);
}
function Rt({ value: t, onChange: d, readOnly: r = !1, onEditPrint: l }) {
  const a = r || !d, [f, p] = I(null), [s, u] = I(0), [o, m] = I(1), [y, w] = I(""), [g, x] = I(null), [h, v] = I(1), C = F(null), M = F(null), z = F([]), W = Xe(), i = qe(() => ({ route: t.route }), [t.route]), E = (!a && f ? f : i).route;
  Q(() => {
    const k = C.current, P = new ResizeObserver(() => v(Math.min(1, k.clientWidth / 460)));
    return P.observe(k), () => P.disconnect();
  }, []);
  function L(k) {
    a || (p(null), w(""), d?.({ ...t, route: k.route }));
  }
  function n(k) {
    m(k), x(null), window.frameElement?.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" }), M.current?.showModal();
  }
  function b() {
    const k = t.route === "start" ? 0 : o;
    z.current[k]?.focus({ preventScroll: !0 });
    const P = t[X[k]];
    w(k === o ? "Focus returned to " + P + ", the print you opened." : "Focus jumped to " + P + ". You opened " + t[X[o]] + ".");
  }
  function $() {
    u((k) => k + 1), p(null);
  }
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "focus-darkroom",
      "aria-label": "Focus Darkroom",
      "data-readonly": a || void 0,
      onPointerCancel: $,
      onKeyDown: (k) => {
        k.key === "Escape" && !M.current?.open && $();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, wt),
    /* @__PURE__ */ e.createElement("h1", null, "Where does focus land?"),
    /* @__PURE__ */ e.createElement("p", null, a ? "" : "Wire the gold ring to a return path. ", "Open ", t.secondPrint, ", then close its viewer."),
    /* @__PURE__ */ e.createElement("div", { className: "contact-sheet" }, X.map((k, P) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: k,
        ref: (B) => {
          z.current[P] = B;
        },
        "aria-label": "Open " + t[k],
        onClick: () => n(P)
      },
      /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, De(P)),
      /* @__PURE__ */ e.createElement("span", null, t[k])
    ))),
    /* @__PURE__ */ e.createElement("div", { className: "return-circuit", ref: C, style: { "--circuit-scale": h } }, /* @__PURE__ */ e.createElement(
      ne,
      {
        key: a ? "locked" : s,
        state: i,
        width: 460,
        height: 108,
        draggable: a ? Mt : Te,
        onDragState: a ? void 0 : p,
        onDropState: a ? void 0 : L
      }
    )),
    !a && /* @__PURE__ */ e.createElement("div", { className: "wire-controls" }, /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": E === "start", onClick: () => L({ route: "start" }) }, "Wire first print"), /* @__PURE__ */ e.createElement("button", { type: "button", "aria-pressed": E === "opener", onClick: () => L({ route: "opener" }) }, "Wire opening print")),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Return path" }, E === "start" ? "Every viewer returns to the first print." : E === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path."),
    /* @__PURE__ */ e.createElement("output", { "aria-label": "Focus result" }, y || "Open " + t.secondPrint + " to try the return path."),
    /* @__PURE__ */ e.createElement("dialog", { ref: M, onClose: b, "aria-labelledby": W, onKeyDown: (k) => {
      k.key === "Escape" && (k.preventDefault(), k.stopPropagation(), k.currentTarget.close());
    } }, /* @__PURE__ */ e.createElement("svg", { viewBox: "-65 -50 130 100", "aria-hidden": "true" }, De(o)), /* @__PURE__ */ e.createElement("h2", { id: W }, t[X[o]]), !a && g !== null ? /* @__PURE__ */ e.createElement("form", { onSubmit: (k) => {
      k.preventDefault(), g.trim() && (d?.({ ...t, [X[o]]: g.trim() }), x(null), M.current?.querySelector("[data-close]")?.focus());
    } }, /* @__PURE__ */ e.createElement("label", null, "Print name ", /* @__PURE__ */ e.createElement("input", { autoFocus: !0, required: !0, maxLength: 48, value: g, onChange: (k) => x(k.target.value) })), /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "submit", disabled: !g.trim() }, "Save name"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => x(null) }, "Cancel rename"))) : null, /* @__PURE__ */ e.createElement("button", { type: "button", "data-close": !0, onClick: () => M.current?.close() }, "Close viewer"), !a && g === null && /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => {
      const k = X[o];
      l ? (M.current?.close(), l(k)) : x(t[k]);
    } }, "Rename print"))
  );
}
const Lt = '.pilot-board{--ink:#243d33;box-sizing:border-box;color:var(--ink);background:#efece3;padding:clamp(14px,3.5vw,35px);font:15px/1.4 system-ui,sans-serif}.pilot-board *,.pilot-board *:before{box-sizing:border-box}.pilot-board header{margin:0 0 1.4rem;color:inherit;background:none;display:block;position:static;padding:0;border:0}.pilot-board header h2{font:700 clamp(30px,5vw,52px)/1 "Pilot Narrow",sans-serif;margin:.28em 0;color:inherit;letter-spacing:-.025em}.pilot-board p{margin:0}.pilot-board .pilot-kicker{font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}.pilot-board button{font:inherit;cursor:pointer;color:inherit}.pilot-board button:focus-visible,.pilot-board a:focus-visible{outline:3px solid #007486;outline-offset:3px}.pilot-board footer{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;padding:14px 0 0;margin:0;background:none;color:inherit;border:0}.pilot-board footer a{color:inherit;text-underline-offset:.24em;font-weight:700}.pilot-board footer button{background:transparent;border:0;text-decoration:underline;text-underline-offset:.23em}.pilot-board .interview-desk{display:grid;grid-template-columns:minmax(0,.94fr) minmax(0,1.2fr);gap:clamp(12px,3vw,32px);align-items:center}.pilot-board .quote-stack{display:grid;gap:10px;padding:4px}.pilot-board .quote{border:1px solid #a79e88;border-radius:2px;box-shadow:2px 3px #756d592b;padding:11px 14px;display:grid;gap:6px;text-align:left;touch-action:none;cursor:grab;position:relative}.pilot-board .quote small{font:600 11px/1.3 ui-monospace,monospace}.pilot-board .quote strong{font:600 clamp(15px,2.1vw,22px)/1.15 Georgia,serif}.pilot-board .quote-preview{background:#f5d989}.pilot-board .quote-duplicate{background:#c5dacf}.pilot-board .quote-undo{background:#ded1ea}.pilot-board .quote[aria-pressed=true]{outline:2px solid #385947;outline-offset:1px}.pilot-board .prototype-slot{position:relative;background:#254a3e;color:#fcf9ee;padding:30px clamp(12px,3vw,26px) 16px;border:2px dashed transparent;border-radius:4px}.pilot-board .prototype-slot.drop-active{border-color:#edc65e}.pilot-board .prototype-screen{background:#fffdf7;color:#233a30;border:1px solid #162d25;border-radius:6px;box-shadow:3px 4px #102b2166;overflow:hidden}.pilot-board .prototype-screen>strong{display:block;padding:15px 12px 7px;font-size:clamp(16px,2.3vw,24px)}.pilot-board .prototype-bar,.pilot-board .prototype-row{display:flex;align-items:center;justify-content:space-between;gap:5px;padding:8px 12px;font-size:12px}.pilot-board .prototype-bar{background:#e8eade;border-bottom:1px solid #c3cbbe;font-weight:650}.pilot-board .prototype-bar span+span,.pilot-board .prototype-row span+span{font:11px/1.3 ui-monospace,monospace}.pilot-board .prototype-row{margin:0 10px;padding:8px 2px;border-bottom:1px solid #e1e5da}.pilot-board .prototype-screen p{padding:8px 12px 12px;color:#355d49;font-weight:650;font-size:12px}.pilot-board .test-brief{margin-top:14px}.pilot-board .test-brief strong{font-size:18px}.pilot-board .test-brief p{font-size:13px;margin-top:3px}.pilot-board .design-cursor{position:absolute;right:17px;top:5px;font:700 10px/1.5 ui-monospace,monospace;color:#f8d7bc;pointer-events:none}.pilot-board .design-cursor span{display:inline-block;transform:rotate(-126deg)}@media (prefers-reduced-motion:no-preference){.pilot-board .design-cursor{animation:point-to-screen .45s ease-out}@keyframes point-to-screen{0%{transform:translate(15px,12px)}to{transform:translate(0)}}}.pilot-board .budget-board{background:#e1e8dc}.pilot-board .budget-ledger{padding:clamp(12px,2.5vw,24px);background:#fcf9f0;border:1px solid #9fae9e}.pilot-board .budget-heading,.pilot-board .reserve{display:flex;justify-content:space-between;align-items:baseline;gap:12px}.pilot-board .budget-heading{font-weight:700}.pilot-board .budget-heading b{font:700 clamp(22px,3vw,32px)/1 "Pilot Narrow",sans-serif}.pilot-board .budget-heading small{font:400 12px/1.4 system-ui,sans-serif}.pilot-board .budget-bar{display:flex;gap:2px;margin:12px 0;height:10px}.pilot-board .budget-bar span{flex:1}.pilot-board .band-calls{background:#386759}.pilot-board .band-pilot{background:#b8804f}.pilot-board .band-newsletter{background:#80698c}.pilot-board .band-reserve{background:#dfded2}.pilot-board .budget-chips,.pilot-board .budget-targets{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.pilot-board .budget-chips{margin:14px 0 18px}.pilot-board .budget-chips button{background:#f4e6bd;border:1px solid #b7a46b;border-left:4px solid #a98b43;display:grid;justify-items:start;text-align:left;align-content:start;gap:3px;padding:9px 10px;touch-action:none;cursor:grab}.pilot-board .budget-chips button[aria-pressed=true]{outline:2px solid #485e49;outline-offset:1px}.pilot-board .budget-chips small{font:11px/1.2 ui-monospace,monospace}.pilot-board .budget-chips span{font-size:12px}.pilot-board .budget-chips strong,.pilot-board .budget-targets b{font:700 clamp(22px,4vw,38px)/1.1 "Pilot Narrow",sans-serif}.pilot-board .budget-targets button{border:1px dashed #969a8b;border-radius:4px;display:grid;grid-template-rows:1fr auto auto;text-align:left;gap:4px;padding:12px 10px}.pilot-board .budget-targets strong{font-size:14px;line-height:1.15}.pilot-board .budget-targets span{font-size:12px}.pilot-board .target-calls{background:#d6e5d9}.pilot-board .target-newsletter{background:#e6ddeb}.pilot-board .target-pilot{background:#f1ddc6}.pilot-board .reserve{width:100%;border:0;border-top:1px solid #b4baad;background:none;margin-top:14px;padding:10px 0 0;font-size:13px}.pilot-board .pilot-ghost{position:fixed;z-index:10;pointer-events:none;background:#25382e;color:#fff9ee;box-shadow:1px 4px 10px #0003;padding:6px 10px;border-radius:3px;font:600 12px/1.3 system-ui,sans-serif}@media (max-width:480px){.pilot-board .interview-desk{grid-template-columns:1fr;gap:12px}.pilot-board .quote-stack{gap:6px}.pilot-board .quote{padding:8px 10px;gap:3px}.pilot-board footer{font-size:14px}.pilot-board .budget-chips,.pilot-board .budget-targets{gap:5px}.pilot-board .budget-targets button,.pilot-board .budget-chips button{padding:8px 5px}.pilot-board .budget-targets strong{font-size:12px}.pilot-board .budget-targets span,.pilot-board .budget-chips span{font-size:11px}}.pilot-board button:disabled{cursor:default}';
function he(t, d, r) {
  const l = Re(t, d, r);
  return l === t ? null : l;
}
function Bt({ value: t, readOnly: d = !1, onChange: r }) {
  const l = tt(t), a = F(null), [f, p] = I(null), [s, u] = I(null), [o, m] = I(null), [y, w] = I("fund-1"), g = f?.base === t && !d ? f.next : t, x = t.cards.some((n) => n.id === y) ? y : t.cards[0]?.id;
  function h() {
    a.current = null, u(null), m(null), p(null);
  }
  Q(() => {
    if (!s) return;
    const n = (b) => {
      b.key === "Escape" && h();
    };
    return window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n);
  }, [s]);
  function v(n, b) {
    const $ = !d && he(t, n, b);
    $ && r?.($);
  }
  function C(n) {
    l === "customer-interviews" ? v(n, "prototype") : w(n);
  }
  function M(n) {
    const b = document.elementFromPoint(n.clientX, n.clientY)?.closest("[data-drop]");
    return b && b.closest(".pilot-board") === n.currentTarget.closest(".pilot-board") ? b.dataset.drop : void 0;
  }
  function z(n) {
    return {
      disabled: d,
      onClick: (b) => {
        b.detail === 0 && C(n);
      },
      onPointerDown: (b) => {
        d || !b.isPrimary || b.button !== 0 || (b.currentTarget.setPointerCapture(b.pointerId), a.current = { card: n, board: t, x: b.clientX, y: b.clientY, moved: !1 }, u(n));
      },
      onPointerMove: (b) => {
        const $ = a.current;
        if (!$ || $.card !== n) return;
        if ($.board !== t || d) return h();
        if ($.moved || ($.moved = Math.hypot(b.clientX - $.x, b.clientY - $.y) > 5), !$.moved) return;
        m({ left: b.clientX + 10, top: b.clientY + 10 });
        const k = M(b), P = k && he(t, n, k);
        p(P ? { base: t, next: P } : null);
      },
      onPointerUp: (b) => {
        const $ = a.current;
        if (!$ || $.card !== n) return;
        const k = M(b);
        h(), !(d || $.board !== t) && ($.moved ? k && v(n, k) : C(n));
      },
      onLostPointerCapture: h,
      onPointerCancel: h
    };
  }
  if (!l) return null;
  const W = g.cards.find((n) => n.laneId === "prototype"), i = Be(g).find((n) => n.cardId === W?.id && n.laneId === "prototype" && n.present), E = $e(g, "reserve")?.amount ?? 0, L = (n) => t.lanes.find((b) => b.id === n)?.label ?? "";
  return /* @__PURE__ */ e.createElement(
    "section",
    {
      className: "pilot-board " + (l === "customer-interviews" ? "interview-board" : "budget-board"),
      onKeyDown: (n) => {
        n.key === "Escape" && h();
      }
    },
    /* @__PURE__ */ e.createElement("style", null, Lt),
    l === "customer-interviews" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("header", null, /* @__PURE__ */ e.createElement("p", { className: "pilot-kicker" }, "Design partner interviews"), /* @__PURE__ */ e.createElement("h2", null, "What’s stopping the first import?"), !d && /* @__PURE__ */ e.createElement("p", null, "Pick a customer quote or drag it to the prototype. See what your designer would test.")), /* @__PURE__ */ e.createElement("div", { className: "interview-desk" }, /* @__PURE__ */ e.createElement("div", { className: "quote-stack" }, t.cards.map((n) => {
      const b = nt.find((k) => k.id === n.id), $ = n.label === b.who + " · " + b.quote;
      return /* @__PURE__ */ e.createElement(
        "button",
        {
          type: "button",
          className: "quote quote-" + n.id,
          key: n.id,
          "data-card": n.id,
          "aria-pressed": W?.id === n.id,
          ...z(n.id)
        },
        $ && /* @__PURE__ */ e.createElement("small", null, b.who),
        /* @__PURE__ */ e.createElement("strong", null, $ ? b.quote : n.label)
      );
    })), /* @__PURE__ */ e.createElement("div", { className: "prototype-slot" + (s ? " drop-active" : ""), "data-drop": "prototype", "aria-label": L("prototype") }, /* @__PURE__ */ e.createElement("div", { key: W?.id, className: "design-cursor", "aria-label": "Simulated designer Imani" }, /* @__PURE__ */ e.createElement("span", { "aria-hidden": "true" }, "➤"), " Imani"), W ? /* @__PURE__ */ e.createElement(St, { id: W.id }) : /* @__PURE__ */ e.createElement("p", null, "Choose an interview for the prototype."), i && /* @__PURE__ */ e.createElement("div", { className: "test-brief", "aria-live": "polite" }, /* @__PURE__ */ e.createElement("strong", null, i.label), /* @__PURE__ */ e.createElement("p", null, i.text))))) : /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("header", null, /* @__PURE__ */ e.createElement("p", { className: "pilot-kicker" }, "First ten design partners"), /* @__PURE__ */ e.createElement("h2", null, "Where would you spend $", t.cards.length * 200, "?"), !d && /* @__PURE__ */ e.createElement("p", null, "Drag a $200 allocation to an experiment, or select an allocation and then a destination.")), /* @__PURE__ */ e.createElement("div", { className: "budget-ledger" }, /* @__PURE__ */ e.createElement("div", { className: "budget-heading" }, /* @__PURE__ */ e.createElement("span", null, "Pilot budget"), /* @__PURE__ */ e.createElement("b", null, "$", t.cards.length * 200 - E, " ", /* @__PURE__ */ e.createElement("small", null, "committed"))), /* @__PURE__ */ e.createElement("div", { className: "budget-bar", "aria-hidden": "true" }, g.cards.map((n) => /* @__PURE__ */ e.createElement("span", { key: n.id, className: "band-" + n.laneId }))), /* @__PURE__ */ e.createElement("div", { className: "budget-chips" }, t.cards.map((n) => /* @__PURE__ */ e.createElement(
      "button",
      {
        type: "button",
        key: n.id,
        "data-card": n.id,
        "aria-label": n.label + ", " + L(n.laneId),
        "aria-pressed": x === n.id,
        ...z(n.id)
      },
      /* @__PURE__ */ e.createElement("small", null, n.label),
      /* @__PURE__ */ e.createElement("strong", null, "$200"),
      /* @__PURE__ */ e.createElement("span", null, L(n.laneId).split(" · ")[0])
    ))), /* @__PURE__ */ e.createElement("div", { className: "budget-targets" }, rt.map((n) => {
      const b = $e(g, n.id);
      return /* @__PURE__ */ e.createElement(
        "button",
        {
          type: "button",
          key: n.id,
          className: "target-" + n.id,
          "data-drop": n.id,
          disabled: d || !x || !he(t, x, n.id),
          onClick: () => v(x, n.id)
        },
        /* @__PURE__ */ e.createElement("strong", null, L(n.id).replace(" · " + n.rate, "")),
        /* @__PURE__ */ e.createElement("b", null, "$", b.amount),
        /* @__PURE__ */ e.createElement("span", null, b.description),
        /* @__PURE__ */ e.createElement("small", null, n.rate)
      );
    })), /* @__PURE__ */ e.createElement("button", { type: "button", className: "reserve", "data-drop": "reserve", disabled: d || !x, onClick: () => v(x, "reserve") }, L("reserve") === "Unallocated" ? "Return to unallocated funds" : L("reserve"), " ", /* @__PURE__ */ e.createElement("b", null, "$", E)))),
    o && s && /* @__PURE__ */ e.createElement("span", { className: "pilot-ghost", "aria-hidden": "true", style: o }, t.cards.find((n) => n.id === s)?.label)
  );
}
function St({ id: t }) {
  const d = t === "duplicate" ? [["Studio Oka", "Already a client"], ["Lowell Design", "New client"]] : t === "undo" ? [["Latest import", "10 clients added"], ["Previous list", "38 clients"]] : [["Studio Oka", "Ready"], ["Lowell Design", "Ready"]];
  return /* @__PURE__ */ e.createElement("div", { className: "prototype-screen", "aria-label": "Example product screen" }, /* @__PURE__ */ e.createElement("div", { className: "prototype-bar" }, /* @__PURE__ */ e.createElement("span", null, "Client list"), /* @__PURE__ */ e.createElement("span", null, "Prototype")), /* @__PURE__ */ e.createElement("strong", null, t === "duplicate" ? "1 matching client" : t === "undo" ? "Import history" : "Preview your first 10 rows"), d.map(([r, l]) => /* @__PURE__ */ e.createElement("div", { className: "prototype-row", key: r }, /* @__PURE__ */ e.createElement("span", null, r), /* @__PURE__ */ e.createElement("span", null, l))), /* @__PURE__ */ e.createElement("p", null, t === "duplicate" ? "Keep original record" : t === "undo" ? "Restore previous list" : "No emails will be sent"));
}
const Ct = (t) => pe(t, !1), Wt = (t) => pe(t, !0);
function At({ value: t, onChange: d, onPreview: r, onSelectCard: l, onEditCard: a, onEditStation: f, onEditLane: p, onAddCard: s, onUndo: u, canUndo: o, readOnly: m = !1, fitLanes: y = !1, mapCanvas: w = !1, showPlacementOutcomes: g = !0, showMoveControls: x = !0 }) {
  const h = e.useRef(null), v = e.useId(), C = e.useRef(null), M = e.useRef(!1), z = e.useRef(null), [W, i] = e.useState(0), E = w && !!t.lanes[0].station, L = E || y && !t.kind && !t.lanes[0].station;
  e.useLayoutEffect(() => {
    const c = h.current;
    if (!L || !c) return;
    const S = () => i(c.clientWidth);
    S();
    const N = new ResizeObserver(S);
    return N.observe(c), () => N.disconnect();
  }, [L]);
  const n = e.useMemo(() => L && W ? mt(t, W, E) : void 0, [L, W, t, E]), { width: b, height: $ } = ce(t, n?.layout, E ? te : void 0), k = t.kind === "release-plan", P = !!t.signals?.length, [B, re] = e.useState(0), A = e.useRef(!1), H = e.useRef(null), [ue, Ke] = e.useState(null), [j, V] = e.useState(null), [fe, ye] = e.useState(null), q = !m && j?.source === t ? j : null, xe = e.useRef(t), G = e.useCallback((c) => {
    (k || P) && Ke(c), r?.(c);
  }, [k, P, r]), T = e.useCallback(() => {
    A.current = !1, H.current = null, V(null), G(null), re((c) => c + 1);
  }, [G]);
  e.useLayoutEffect(() => {
    xe.current !== t && (A.current || j) && T(), xe.current = t;
  }, [t, j, T]);
  const _ = (c, S) => {
    A.current = !1, V(null), G(null), c !== t && (k && !u && ye({ before: t, after: c }), d(c, S));
  }, Ge = (c) => {
    const S = c.cards.find((N) => N.id === H.current);
    _(c, S && { cardId: S.id, laneId: S.laneId });
  }, je = e.useCallback((c) => {
    const S = c.type === "dragging" ? c : c.pendingDrag?.status;
    A.current = !!S, S ? (H.current = S.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, V(null)) : H.current !== null && (H.current = null, G(null));
  }, [G]);
  e.useEffect(() => {
    function c(S) {
      !A.current && !j || S instanceof KeyboardEvent && S.key !== "Escape" || T();
    }
    return document.addEventListener("keydown", c), document.addEventListener("pointercancel", c), window.addEventListener("blur", c), () => {
      document.removeEventListener("keydown", c), document.removeEventListener("pointercancel", c), window.removeEventListener("blur", c);
    };
  }, [T, j]);
  const oe = m ? null : q?.next ?? ue, R = !!(m || q), ke = !!t.lanes[0].station, U = !R && (ke ? !!f : (!k || !!l) && !!p), Z = !R && !ke && !k && !!s && t.cards.length < ot, Y = !R && !!l, Ye = e.useMemo(() => n || U || Z || E || Y ? (c) => pe(c, R, n, U, Z, v, E, Y) : R ? Wt : Ct, [n, R, U, Z, v, E, Y]), me = "[data-workshop-station],[data-workshop-lane],[data-workshop-add-card]", we = Y ? me + ",[data-workshop-card]" : me;
  function be(c) {
    R || (c.dataset.workshopCard ? l?.(c.dataset.workshopCard) : c.dataset.workshopStation ? f?.(c.dataset.workshopStation) : c.dataset.workshopLane ? p?.(c.dataset.workshopLane, c) : c.dataset.workshopAddCard && s?.(c.dataset.workshopAddCard, c));
  }
  const ve = oe ? Math.max($, ce(oe, n?.layout, E ? te : void 0).height) : $, Me = /* @__PURE__ */ e.createElement(
    ne,
    {
      key: m ? "read-only" : B,
      draggable: Ye,
      state: q?.next ?? t,
      onDropState: m ? void 0 : Ge,
      onDragState: m ? void 0 : G,
      onDragStatus: je,
      width: b,
      height: ve
    }
  );
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, (U || Z) && /* @__PURE__ */ e.createElement("div", { hidden: !0 }, t.lanes.map((c) => /* @__PURE__ */ e.createElement(e.Fragment, { key: c.id }, U && /* @__PURE__ */ e.createElement("span", { id: v + "-edit-" + c.id }, "Edit ", c.label), Z && /* @__PURE__ */ e.createElement("span", { id: v + "-add-" + c.id }, "Add card to ", c.label)))), Y && /* @__PURE__ */ e.createElement("div", { hidden: !0 }, t.cards.map((c) => /* @__PURE__ */ e.createElement("span", { key: c.id, id: v + "-select-" + c.id }, "Select ", c.label))), /* @__PURE__ */ e.createElement(
    "div",
    {
      ref: h,
      style: { maxWidth: "100%", overflowX: "auto" },
      onKeyDownCapture: (c) => {
        const S = c.target.closest(we);
        !S || !["Enter", " "].includes(c.key) || (c.preventDefault(), c.repeat || be(S));
      },
      onClickCapture: (c) => {
        const S = c.target.closest(we), N = c.detail === 0 || !M.current;
        M.current = !1, S && N && be(S);
      },
      onPointerDownCapture: (c) => {
        if (M.current = !0, C.current = null, R || !c.isPrimary || c.button !== 0) return;
        const S = c.target.closest(me + ",[data-workshop-card]");
        S && (C.current = { target: S, x: c.clientX, y: c.clientY });
      },
      onPointerMoveCapture: (c) => {
        C.current && Math.hypot(c.clientX - C.current.x, c.clientY - C.current.y) > 5 && (C.current = null, z.current = null);
      },
      onPointerCancelCapture: () => {
        C.current = null, z.current = null;
      },
      onPointerUpCapture: (c) => {
        const S = C.current;
        if (C.current = null, !S || R || Math.hypot(c.clientX - S.x, c.clientY - S.y) > 5) return;
        const N = S.target.dataset.workshopCard;
        if (!N || Y) {
          z.current = null, be(S.target);
          return;
        }
        a && (z.current?.id === N && c.timeStamp - z.current.at < 400 ? (z.current = null, a(N)) : z.current = { id: N, at: c.timeStamp });
      }
    },
    E ? /* @__PURE__ */ e.createElement(gt, { board: q?.next ?? t, fitted: n, width: b, height: ve }, Me) : Me
  ), P && g && /* @__PURE__ */ e.createElement("section", { "aria-label": "Placement outcomes", "aria-live": "polite", style: { overflowWrap: "anywhere" } }, Be(oe ?? t).map((c) => /* @__PURE__ */ e.createElement("p", { key: c.id }, /* @__PURE__ */ e.createElement("strong", null, c.label), /* @__PURE__ */ e.createElement("br", null), c.text))), k && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(ht, { value: t, preview: oe }), !m && /* @__PURE__ */ e.createElement(e.Fragment, null, x && /* @__PURE__ */ e.createElement(
    Et,
    {
      value: t,
      preview: q?.move ?? null,
      stage: (c, S) => {
        V({ source: t, next: c, move: S }), r?.(c);
      },
      cancel: T,
      apply: () => {
        q && (_(q.next, q.move), G(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(u ? o : fe?.after === t), onClick: () => {
    T(), u ? u() : fe?.after === t && (ye(null), d(fe.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((c) => {
    const S = t.lanes.find((N) => N.id === c.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: c.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, c.label, " · ", S.label), (!E || S.station.outcome !== S.label) && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("br", null), S.station.outcome)), S.station.image && /* @__PURE__ */ e.createElement(
      "img",
      {
        src: S.station.image.src,
        alt: S.station.image.alt,
        referrerPolicy: "no-referrer",
        style: { display: "block", maxWidth: "100%", width: 360, maxHeight: 240, objectFit: "contain", objectPosition: "left", marginBlock: "8px" }
      }
    ), ee(t, c).filter((N) => N.id !== c.laneId).map((N) => /* @__PURE__ */ e.createElement("button", { key: N.id, type: "button", disabled: m, onClick: () => _(de(t, c.id, N.id), { cardId: c.id, laneId: N.id }) }, c.label, " → ", N.label)));
  })), x && !k && !E && t.cards.length > 0 && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((c) => /* @__PURE__ */ e.createElement("label", { key: c.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, c.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: m,
      "aria-label": "Move " + c.label,
      value: q?.move.cardId === c.id ? q.move.laneId : c.laneId,
      onChange: (S) => {
        const N = { cardId: c.id, laneId: S.currentTarget.value }, ae = de(t, c.id, N.laneId);
        P ? ae === t ? T() : (V({ source: t, next: ae, move: N }), r?.(ae)) : _(ae, N);
      }
    },
    ee(t, c).map((S) => /* @__PURE__ */ e.createElement("option", { key: S.id, value: S.id }, S.label))
  ))), q && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: () => _(q.next, q.move) }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: T }, "Cancel move"))));
}
export {
  Zn as DEFAULT_NOTE_STYLE,
  Rt as FocusDarkroomBoard,
  Dt as ListeningRoomBoard,
  Ft as MoonGalleryBoard,
  It as OfflineHandoffBoard,
  ht as ReleasePlanReadout,
  Bt as StartupWorkshopBoard,
  At as WorkshopBoard,
  Kt as WorkshopReferenceError,
  Gt as addWorkshopBranch,
  jt as addWorkshopCard,
  Yt as addWorkshopLane,
  Xt as applyWorkshopEdits,
  Qt as attachWorkshop,
  ee as availableLanes,
  Ee as canHangPanel,
  rt as channels,
  Vt as checkWorkshopReplacement,
  _t as countWord,
  Ut as createBudgetWorkshop,
  Zt as createInterviewWorkshop,
  Jt as createLaneWorkshop,
  Ot as createWorkshopMap,
  en as decodeWorkshopFragment,
  tn as describeFocusDarkroom,
  nn as describeWorkshopEdits,
  qt as dragologyCandidates,
  rn as encodeWorkshopFragment,
  Se as handoffSummary,
  le as hangGalleryPanel,
  on as industrialWorkshop,
  an as initialFocusDarkroom,
  nt as interviews,
  Oe as laneColors,
  ln as listed,
  We as listeningRoom,
  ze as listeningRoomCaption,
  ot as maxWorkshopCards,
  sn as maxWorkshopLines,
  cn as moonGallery,
  de as moveWorkshopCard,
  dn as named,
  pn as nightTransfer,
  un as normalizeFocusDarkroom,
  fn as normalizeListeningRoom,
  mn as normalizeMoonGallery,
  bn as normalizeOfflineHandoff,
  Ze as offlineHandoff,
  gn as planStartupMove,
  hn as pointing,
  X as printFields,
  Fe as releaseLoad,
  En as releasePlan,
  Ce as resolveHandoff,
  Be as resolveWorkshopSignals,
  ie as reviewHandoff,
  yn as said,
  tt as startupExperienceKind,
  xn as unquoted,
  kn as validateWorkshop,
  wn as workshopBoardKind,
  $e as workshopBudgetResult,
  Re as workshopCandidate,
  vn as workshopCardAsNote,
  Mn as workshopCardAsNoteRefusal,
  Ln as workshopCardLabelOf,
  Sn as workshopCardLines,
  Cn as workshopCardLookOf,
  et as workshopDestinations,
  Wn as workshopEditKinds,
  zn as workshopFinder,
  $n as workshopKeepsLink,
  Nn as workshopKeepsPicture,
  Pn as workshopLaneCaption,
  In as workshopLanePlaces,
  se as workshopLayout,
  Dn as workshopLineRefusal,
  qn as workshopLinesOf,
  Fn as workshopNewLine,
  Rn as workshopNodeIds,
  Bn as workshopNoteCandidate,
  An as workshopNoteRefusal,
  ce as workshopPositions,
  Hn as workshopPresentationLanes,
  Tn as workshopPresentationScenes,
  Kn as workshopReferences,
  Gn as workshopRefusal,
  jn as workshopRenamedLines,
  Yn as workshopStandInId,
  Xn as workshopTakesNotes,
  Je as workshopToSlate,
  Qn as workshopWithLine,
  Vn as workshopWithoutCardLines,
  _n as workshopWithoutLine
};
