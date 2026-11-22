import { Vec2 as yt, getElementPositionCheap as qt, translate as Qt, dragSpecToBehavior as bt, param as q, moreThan as Q, lessThan as b, inOrder as tn } from "./dragology.mjs";
import { laneColors as G, workshopDestinations as Ot, workshopCandidate as Wt } from "./workshop-model.mjs";
import { m as _, G as Pt, I as at, _ as P, Z as st, Q as ot, u as nn, v as Dt, X as lt, z as Bt, V as Ft, a5 as en, C as Nt, W as an, a0 as sn, T as Ht, a3 as on, R as rt, $ as Kt, w as wt, j as kt, s as K, f as Y, a6 as rn, ac as ln, ad as cn, U as Mt } from "./plans-BI5v9TGn.mjs";
import { a as oe, d as re, a8 as le, c as ce, p as de, t as he, ag as ue, Y as fe, P as pe, g as me, a7 as xe, ab as ge, h as ye, i as we, S as ke, H as Me, F as ve, N as Se, l as Ie, J as Le, e as $e, n as ze, q as Ae, b as Ce, o as Ee, B as Te, M as Re, y as _e, E as Oe, x as We, A as Pe, L as De, O as Be, af as Fe, r as Ne, ae as He, aa as Ke, K as Ve, a4 as Je, a2 as Ue, a1 as Ge, a9 as Ye, D as Ze, k as je } from "./plans-BI5v9TGn.mjs";
import tt from "react";
import { pipelineForecast as Vt, pipelineRefusal as dn, pipelineCaption as vt, budgetLimits as hn, budgetRefusal as un, budgetCaption as St, shiftBudget as It, budgetCommitted as fn } from "./workshop-rules.mjs";
import { amountRules as qe, behaviourEditsBetween as Qe, budgetRules as be, budgetShiftLimits as ti, budgetShiftRefusal as ni, catalogSamples as ei, pipelineLimits as ii, pipelineRules as ai, planBudgetMove as si, planPipelineMove as oi, restoreWorkshop as ri, sampleBudget as li, samplePipeline as ci, validateBudget as di, validatePipeline as hi } from "./workshop-rules.mjs";
import { nestKids as z, nestAreas as U, nestSubtree as Lt, nestPlace as $t, checkNest as pn, nestLegal as mn, nestEmptyDrop as xn, nestRules as gn, nestRoots as Jt, nestCardText as yn } from "./workshop-nest.mjs";
import { breakDownSample as fi, byOrder as pi, checkNestMove as mi, discoveryTreeSample as xi, incidentReviewSample as gi, isOrderKey as yi, nestAlias as wi, nestDepth as ki, nestDrags as Mi, nestFamily as vi, nestMeasure as Si, nestMeasureWords as Ii, nestSentence as Li, orderBetween as $i, orderKeys as zi, roleOf as Ai, sortEvidenceSample as Ci, validateNest as Ei } from "./workshop-nest.mjs";
const k = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, ft = "http://www.w3.org/2000/svg", zt = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function T(t, i, n) {
  const a = document.createElementNS(ft, t);
  for (const [o, s] of Object.entries(i)) a.setAttribute(o, String(s));
  return n?.fill && (a.setAttribute("fill", zt(n.fill)), a.style.setProperty("fill", n.fill)), n?.stroke && (a.setAttribute("stroke", zt(n.stroke)), a.style.setProperty("stroke", n.stroke)), a;
}
function At(t, i, n, a) {
  const o = typeof document < "u" ? document.activeElement : null, s = o && t.contains(o) ? o.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const r = [];
  for (const e of i)
    if (e.t === "line")
      t.appendChild(T("line", {
        x1: e.x1,
        y1: e.y1,
        x2: e.x2,
        y2: e.y2,
        "stroke-width": e.width ?? 1,
        ...e.dash ? { "stroke-dasharray": e.dash } : {}
      }, { stroke: e.color }));
    else if (e.t === "rect")
      t.appendChild(T("rect", {
        x: e.x,
        y: e.y,
        width: Math.max(0, e.w),
        height: Math.max(0, e.h),
        rx: e.rx ?? 0,
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const c = T("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      e.lines && e.lines.length > 1 ? e.lines.forEach((d, f) => {
        const l = T("tspan", { x: e.x, dy: f ? e.lineHeight ?? Math.round((e.size ?? 13) * 1.25) : 0 });
        l.textContent = f < e.lines.length - 1 ? d + " " : d, c.appendChild(l);
      }) : c.textContent = e.text, t.appendChild(c);
    } else {
      if (e.unlink && n) {
        const { cardId: c, waitsOn: d, label: f } = e.unlink, l = d + ">" + c, x = a?.armed === l, m = T("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": l,
          "aria-label": x ? f + ". Tap again to remove it." : f,
          role: "button",
          tabindex: 0,
          ...x ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: x ? k.refuse : "transparent" });
        let p = !1;
        m.addEventListener("pointerdown", (h) => {
          h.stopPropagation(), p = h.pointerType === "touch" || h.pointerType === "pen";
        }), m.addEventListener("click", (h) => {
          if (h.stopPropagation(), p && a && a.armed !== l) {
            a.arm(l);
            return;
          }
          a?.arm(null), n(c, d);
        }), m.addEventListener("keydown", (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), h.stopPropagation(), n(c, d));
        }), m.addEventListener("focus", () => {
          m.style.setProperty("stroke", k.accept), m.setAttribute("opacity", "0.35");
        }), m.addEventListener("blur", () => {
          x || (m.style.setProperty("stroke", "transparent"), m.removeAttribute("opacity"));
        }), t.appendChild(m), r.push(m);
      }
      if (t.appendChild(T("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: c, y: d, angle: f } = e.arrow;
        t.appendChild(T("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${c} ${d}) rotate(${f})`, "pointer-events": "none" }, { fill: e.color }));
      }
      if (e.unlink && a?.armed === e.unlink.waitsOn + ">" + e.unlink.cardId && e.arrow) {
        const c = T("text", {
          x: e.arrow.x - 6,
          y: e.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: k.refuse });
        c.textContent = "Tap again to remove this link", t.appendChild(c);
      }
    }
  s && r.find((e) => e.getAttribute("data-board-link") === s)?.focus({ preventScroll: !0 });
}
function ct(t, i) {
  const n = t?.canvas?.node, a = document.createElementNS(ft, "g");
  a.setAttribute("data-board-layer", ""), a.setAttribute("pointer-events", "none");
  const o = document.createElementNS(ft, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let s = !1, r = null, e;
  const c = {
    armed: null,
    arm(f) {
      clearTimeout(e), c.armed = f, f && (e = setTimeout(() => c.arm(null), 5e3), r?.[2].announce?.("Link selected. Tap it again to remove it.")), r && d.draw(...r);
    }
  }, d = {
    draw(f, l, x) {
      if (s || !n) return;
      r = [f, l, x];
      const { origin: m } = x, p = i(l ?? f, x, f), h = (g) => g.t === "text" && (g.role === "clamp" || g.role === "refusal");
      for (const g of [a, o]) g.setAttribute("transform", `translate(${m.x} ${m.y})`);
      At(a, p.filter((g) => !h(g)), x.onUnlink, c), At(o, p.filter(h));
      const y = x.above && x.above.parentNode === n ? x.above : null, u = y ? y.nextSibling : n.firstChild;
      (a.parentNode !== n || a.previousSibling !== y) && n.insertBefore(a, u === a ? a.nextSibling : u), o.firstChild && n.lastChild !== o ? n.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
    },
    destroy() {
      s = !0, clearTimeout(e), a.remove(), o.remove();
    }
  };
  return d;
}
function F(t, i = []) {
  const n = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return tt.createElement(
    "g",
    null,
    ...n.map((a) => /* @__PURE__ */ tt.createElement("g", { id: a.name, transform: Qt(a.x, a.y) }, /* @__PURE__ */ tt.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ tt.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
  );
}
function E(t, i, n, a, o) {
  let s;
  const e = {
    draggable: (d) => (s ?? (s = d.d), a(d.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: yt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!qt(e, t) || !s) return null;
  const c = bt(o(s, t), e);
  return (d) => c({ pointer: yt(d.x, d.y) }).dropState;
}
const N = (t, i, n = 0) => !!t && i.x >= t.x - n && i.x <= t.x + t.width + n && i.y >= t.y - n && i.y <= t.y + t.height + n;
function Ut(t, i, n, a, o) {
  if (!t) return null;
  const s = i.cards.find((r) => r.id === n).laneId;
  return (r) => {
    const e = t(r);
    if (e !== i && JSON.stringify(e) !== JSON.stringify(i)) return e;
    const c = a.find((d) => d.name.startsWith("column-") && d.name !== "column-" + s && N(d, r));
    return c && o.find((d) => d.cards.find((f) => f.id === n).laneId === c.name.slice(7)) || e;
  };
}
function L(t, i) {
  const n = (a) => Math.round(parseInt(t.slice(a, a + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function xt(t, i) {
  const n = [], a = new Map(t.cards.map((e) => [e.id, e]));
  for (const e of i.cards) {
    const c = a.get(e.id), d = { id: e.id };
    if (!c) {
      n.push({
        kind: "add_card",
        lane: { id: e.laneId },
        label: e.label,
        ...e.duration !== void 0 && { duration: e.duration },
        ...e.lag && { lag: e.lag },
        ...e.dependsOn && { waitsOn: e.dependsOn.map((l) => ({ id: l })) },
        ...e.amount !== void 0 && { amount: e.amount }
      });
      continue;
    }
    c.label !== e.label && n.push({ kind: "rename_card", card: d, label: e.label });
    const f = n.length;
    for (const l of c.dependsOn ?? []) e.dependsOn?.includes(l) || n.push({ kind: "unlink_tasks", card: d, waitsOn: { id: l } });
    for (const l of e.dependsOn ?? []) c.dependsOn?.includes(l) || n.push({ kind: "link_tasks", card: d, waitsOn: { id: l } });
    c.laneId !== e.laneId && n.push({ kind: "move_card", card: d, lane: { id: e.laneId } }), (n.length > f && e.duration !== void 0 && n.slice(f).some((l) => l.kind !== "move_card") || c.duration !== e.duration || (c.lag ?? 0) !== (e.lag ?? 0)) && n.push({ kind: "set_task", card: d, duration: e.duration, lag: e.lag ?? 0 }), e.amount !== void 0 && c.amount !== e.amount && n.push({ kind: "set_amount", card: d, amount: e.amount });
  }
  for (const e of t.cards) i.cards.some((c) => c.id === e.id) || n.push({ kind: "remove_card", card: { id: e.id } });
  i.launch && t.launch?.day !== i.launch.day && n.push({ kind: "set_launch_day", day: i.launch.day }), i.forecast && t.forecast?.target !== i.forecast.target && n.push({ kind: "set_target", amount: i.forecast.target });
  const o = i.lanes.map((e) => ({ id: e.id, by: (e.allocation ?? 0) - (t.lanes.find((c) => c.id === e.id)?.allocation ?? 0) })), s = o.filter((e) => e.by < 0), r = o.filter((e) => e.by > 0);
  for (const e of r)
    for (const c of s) {
      const d = Math.min(e.by, -c.by);
      d <= 0 || (n.push({ kind: "shift_budget", from: { id: c.id }, to: { id: e.id }, amount: d }), e.by -= d, c.by += d);
    }
  for (const e of i.lanes) {
    const c = t.lanes.find((d) => d.id === e.id);
    c && c.label !== e.label && n.push({ kind: "rename_lane", lane: { id: e.id }, label: e.label }), c && c.capacity !== e.capacity && n.push({ kind: "set_lane_capacity", lane: { id: e.id }, capacity: e.capacity ?? null });
  }
  return t.title !== i.title && n.push({ kind: "rename_workshop", title: i.title }), n;
}
function wn(t) {
  const i = t.forecast?.currency;
  return `Forecast ${_(Vt(t), i)} of ${_(t.forecast?.target ?? 0, i)}`;
}
function kn(t) {
  return `${_(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Gt(t, i) {
  return t.cards.filter((n) => Pt(t, i, n.id) === null).map((n) => n.id);
}
function Mn(t, i, n, a) {
  for (let o = i; o > 11; o--) {
    const s = Math.max(1, Math.floor(n / (o * 0.55)));
    if (t.split(`
`).reduce((e, c) => e + Math.max(1, Math.ceil(c.length / s)), 0) * o * 1.3 <= a) return o;
  }
  return Math.min(i, 11);
}
function dt(t, i, n, a) {
  const o = a.textColor ?? "#18302d", s = a.borderColor ?? "#667872", r = a.fontSize ?? 14;
  return t.map((e) => {
    const c = e.name.startsWith("handle-"), d = e.text ?? "";
    return { options: {
      id: e.name,
      text: d,
      name: i.cards.find((f) => "card-" + f.id === e.name)?.label ?? d,
      xPos: n.x + e.x,
      yPos: n.y + e.y,
      width: e.width,
      height: e.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${e.width} V ${e.height} H 0 Z`,
      backgroundColor: c ? "transparent" : e.fill ?? a.backgroundColor ?? "#fffdf6",
      foregroundColor: e.ink ?? o,
      borderColor: e.line ?? s,
      borderWidth: c ? 0 : e.lineWidth ?? 1,
      ...a.fontFamily ? { fontFamily: a.fontFamily } : {},
      fontSize: Mn(d, e.fontSize ?? r, e.width - 12, e.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Yt(t, i) {
  const n = i.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const a = t.cards.find((s) => s.id === n);
  if (a) return `${a.label} length, ${a.duration} days. Left and Right change it.`;
  const o = t.lanes.findIndex((s) => s.id === n);
  return o >= 0 && t.lanes[o + 1] ? `Divider between ${t.lanes[o].label} and ${t.lanes[o + 1].label}. Left and Right move money.` : null;
}
const Zt = "#c2410c", vn = 32, Sn = 44, gt = (t) => t ? 0 : 22;
function D(t, i = {}) {
  const n = !!i.narrow, a = t.kind === "hiring-plan", o = ot(t), s = a ? t.hiring.weeks * 7 : Ft(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), r = en(t), e = [], c = /* @__PURE__ */ new Map(), d = n ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), f = n ? 8 : 168, l = n ? (d - 88) / s : (d - f - 40) / s, x = (u) => G[t.lanes.findIndex((g) => g.id === u) % G.length], m = (u, g) => {
    const w = t.cards.find((S) => S.id === u), M = o.get(u), v = { x: f + M.from * l, y: g, width: (M.to - M.from) * l, height: n ? Sn : vn };
    c.set(u, v);
    const I = r.has(u);
    e.push({
      name: "card-" + u,
      ...v,
      text: n ? "" : a ? w.label : `${w.label} · ${w.duration}d`,
      fill: I ? "#fde3d7" : n ? x(w.laneId) : a ? L(x(w.laneId), 0.45) : "#fffdf6",
      line: I || M.critical && !a ? Zt : "#667872",
      lineWidth: I || M.critical && !a ? 2.5 : 1,
      fontSize: 13
    }), a && n || e.push({ name: "handle-" + u, x: v.x + v.width - gt(n), y: v.y + v.height / 2 - 22, width: 44, height: 44 });
  };
  let p, h, y;
  if (n) {
    const u = (d - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((g, w) => {
      const M = 8 + w * (u + 8);
      e.push({ name: "column-" + g.id, x: M, y: 30, width: u, height: 72, fill: L(x(g.id), 0.6), line: L(x(g.id), 0.1) }), e.push({ name: "lane-" + g.id, x: M + 4, y: 34, width: u - 8, height: 28, text: g.label, fill: x(g.id), fontSize: 14 }), e.push({ name: "caption-" + g.id, x: M + 4, y: 64, width: u - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), y = 124, h = 130, p = 138;
    for (const g of t.cards)
      m(g.id, p + 20), p += 64;
  } else {
    y = 48, h = 56, p = h;
    for (const u of t.lanes) {
      const g = t.cards.filter((M) => M.laneId === u.id), w = Math.max(92, g.length * 44 + 20);
      e.push({ name: "column-" + u.id, x: 0, y: p, width: d, height: w, fill: L(x(u.id), 0.65), line: L(x(u.id), 0.1) }), e.push({ name: "lane-" + u.id, x: 8, y: p + 8, width: f - 24, height: 32, text: u.label, fill: x(u.id), fontSize: 15 }), e.push({ name: "caption-" + u.id, x: 8, y: p + 44, width: f - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), g.forEach((M, v) => m(M.id, p + 10 + v * 44)), p += w + 4;
    }
  }
  return a ? t.hiring.funding && !n && e.push({ name: "handle-funding", x: f + t.hiring.funding.day * l - 22, y: 4, width: 44, height: 44 }) : e.push({ name: "handle-launch", x: f + t.launch.day * l - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: e, width: d, height: p + 8, narrow: n, x0: f, dayW: l, gridTop: h, axisY: y, bars: c };
}
function In(t, i, n) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = n(a.name.slice(8)));
  return i;
}
function Ln(t, i) {
  const n = t.x + t.width, a = Math.max(t.x + 4, n - 10), s = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, r = i.y + i.height / 2;
  return { d: `M ${a} ${s} V ${r} H ${i.x}`, arrow: { x: i.x, y: r, angle: 0 } };
}
function $n(t, i) {
  const n = D(t, i.layout), a = t.kind === "hiring-plan", o = ot(t), s = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), r = Dt(t), e = [];
  if (r?.workdays)
    for (let l = 0; l < s; l++) wt(r.origin, l) === 6 && e.push({ t: "rect", x: n.x0 + l * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: k.track, opacity: 0.7 });
  for (const l of t.behaviour?.rules ?? []) if (r && l.on && l.kind === "blackout") {
    const x = kt(r.origin, l.start), m = kt(r.origin, l.end) + 1, p = n.x0 + Math.max(0, x) * n.dayW, h = (Math.min(s, m) - Math.max(0, x)) * n.dayW;
    if (h <= 0) continue;
    e.push({ t: "rect", x: p, y: n.gridTop, w: h, h: n.height - 8 - n.gridTop, color: k.refuse, opacity: 0.12 });
    for (let y = p; y < p + h; y += 10) e.push({ t: "line", x1: y, y1: n.gridTop, x2: Math.min(p + h, y + 10), y2: n.gridTop + 10, color: k.refuse, width: 0.6 });
    e.push({ t: "text", x: p + 3, y: n.gridTop + 22, text: l.label + " · " + K(l.start) + "–" + K(l.end), color: k.refuse, size: 11, bold: !0 });
  }
  for (let l = 0; l <= s; l++) {
    const x = n.x0 + l * n.dayW, m = r ? wt(r.origin, l) === 1 : l % 7 === 0;
    if (!m && n.dayW < 6) continue;
    e.push({ t: "line", x1: x, y1: n.gridTop, x2: x, y2: n.height - 8, color: m ? k.week : k.faint, width: m ? 1 : 0.5 });
    const p = a && r && Y(r.origin, l).slice(8) <= "07" && m, h = r ? a ? p ? K(Y(r.origin, l)).replace(/^\d+ /, "") : "" : K(Y(r.origin, l)) : (n.narrow ? "W" : "Week ") + (l / 7 + 1);
    m && h && (!r || a || n.dayW * 7 > 44) && e.push({ t: "text", x: x + 3, y: n.axisY, text: h, color: k.ink, size: 12 });
  }
  for (const l of t.cards) {
    for (const p of l.dependsOn ?? []) {
      const h = n.bars.get(p), y = n.bars.get(l.id);
      if (!h || !y) continue;
      const u = o.get(p).critical && o.get(l.id).critical, g = t.cards.find((w) => w.id === p).label;
      e.push({
        t: "path",
        ...Ln(h, y),
        color: u ? Zt : k.ink,
        width: u ? 2 : 1.5,
        unlink: { cardId: l.id, waitsOn: p, label: `Remove the link: ${l.label} waits on ${g}` }
      });
    }
    const x = o.get(l.id), m = n.bars.get(l.id);
    if (a) {
      const p = t.hiring.bands.find((u) => u.id === l.band), h = m.x + m.width, y = n.x0 + s * n.dayW;
      y > h && e.push({ t: "rect", x: h, y: m.y + m.height / 2 - 3, w: y - h, h: 6, rx: 3, color: k.bar, opacity: 0.45 }), e.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(h + 6, y - 120),
        y: n.narrow ? m.y - 6 : m.y + m.height / 2 - 6,
        text: (n.narrow ? l.label + " · " : "") + "starts " + K(Y(r.origin, rn(t, l.id))) + (p ? " · " + _(p.monthly, t.hiring.currency) + "/mo" : ""),
        color: k.ink,
        size: 12,
        role: "start-" + l.id
      });
      continue;
    }
    n.narrow && e.push({ t: "text", x: 8, y: m.y - 6, text: `${l.label} · ${l.duration}d`, color: k.ink, size: 13, bold: x.critical }), x.critical || e.push({ t: "text", x: m.x + m.width + (n.narrow ? 48 : 24), y: m.y + m.height / 2 + 4, text: "+" + x.slack + "d", color: k.ink, size: 12, role: "slack-" + l.id });
  }
  if (a) {
    const l = ln(t), x = t.behaviour?.rules.find((h) => h.on && h.kind === "deadline"), m = x && x.kind === "deadline" && l < x.floor;
    e.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + cn(l),
      color: m || i.refused ? k.refuse : k.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const p = t.hiring.funding;
    if (p && p.day <= s) {
      const h = n.x0 + p.day * n.dayW;
      e.push({ t: "line", x1: h, y1: 26, x2: h, y2: n.height - 8, color: k.accept, width: 2, dash: "6 4" }), n.narrow || e.push({ t: "rect", x: h - 4, y: 26, w: 8, h: 18, rx: 4, color: k.accept }), e.push({ t: "text", x: Math.max(h + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + _(p.amount, t.hiring.currency) + " · " + K(Y(r.origin, p.day)), color: k.accept, size: 12, bold: !0 });
    }
    if (n.narrow && e.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: k.ink, size: 12 }), i.clamp) {
      const h = n.parts.find((y) => y.name === i.clamp.name);
      h && e.push(...Et(n, e, i.clamp.text, h, i.view));
    }
    return e;
  }
  const c = n.x0 + t.launch.day * n.dayW;
  e.push({ t: "line", x1: c, y1: n.narrow ? 112 : 26, x2: c, y2: n.height - 8, color: k.launch, width: 2, dash: "6 4" }), e.push({ t: "rect", x: c - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: k.launch });
  for (const l of t.cards) {
    const x = n.bars.get(l.id);
    e.push({ t: "rect", x: x.x + x.width + (n.narrow ? 4 : -5), y: x.y + 4, w: n.narrow ? 6 : 4, h: x.height - 8, rx: 2, color: k.ink, opacity: 0.55 });
  }
  const d = rt(t), f = Math.max(0, ...[...o.values()].map((l) => l.to));
  if (e.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: r ? "Done " + Mt(t, Math.ceil(f) - 1) + " · " + Ht(t) + " " + Mt(t, t.launch.day) : `Done day ${d} · launch day ${t.launch.day}`,
    color: i.refused ? k.refuse : k.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const l = n.parts.find((x) => x.name === i.clamp.name);
    l && e.push(...Et(n, e, i.clamp.text, l, i.view));
  }
  return e;
}
const nt = 13, Ct = 16, jt = (t, i) => t * (i ? 0.64 : 0.6), zn = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function An(t) {
  const i = t.size ?? 13, n = t.text.length * jt(i, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - i, w: n, h: i * 1.3 };
}
function Cn(t, i) {
  const n = [];
  for (const a of t.split(/\s+/).filter(Boolean)) {
    const o = n.at(-1);
    o !== void 0 && o.length + 1 + a.length <= i ? n[n.length - 1] = o + " " + a : n.push(a);
  }
  return n;
}
let ht = null;
function Et(t, i, n, a, o) {
  const s = [...t.bars.values()].map((u) => ({ x: u.x - 4, y: u.y - 3, w: u.width + 8, h: u.height + 6 }));
  for (const u of i)
    u.t === "text" ? s.push(An(u)) : u.t === "rect" && s.push({ x: u.x - 2, y: u.y - 2, w: u.w + 4, h: u.h + 4 });
  let r = t.narrow ? 6 : t.x0 + 2, e = t.width - 4, c = t.gridTop + 2, d = t.height - 6;
  o && Math.min(e, o.x + o.width - 8) - Math.max(r, o.x + 8) >= 160 && (r = Math.max(r, o.x + 8), e = Math.min(e, o.x + o.width - 8), Math.min(d, o.y + o.height - 8) - Math.max(c, o.y + 8) >= 40 && (c = Math.max(c, o.y + 8), d = Math.min(d, o.y + o.height - 8)));
  const f = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, l = JSON.stringify([n, f, r, e, c, d, s.map((u) => [u.x, u.y, u.w, u.h].map(Math.round))]);
  if (ht?.key === l) return ht.shapes;
  const x = jt(nt, !0), m = Math.floor((e - r) / x), p = /* @__PURE__ */ new Map();
  for (const u of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const g = Cn(n, Math.max(8, Math.floor(m * u)));
    g.length <= 4 && p.set(g.join(`
`), g);
  }
  let h = null;
  for (const u of p.values()) {
    const g = Math.max(...u.map((M) => M.length)) * x, w = u.length * Ct + 2;
    if (!(g > e - r))
      for (let M = c; M + w <= d; M += 3)
        for (let v = r; v + g <= e; v += 6) {
          const I = { x: v, y: M, w: g, h: w }, S = Math.max(I.x - f.x, 0, f.x - (I.x + I.w)), $ = Math.max(I.y - f.y, 0, f.y - (I.y + I.h)), A = Math.hypot(S, $) + (u.length - 1) * 24;
          h && A >= h.score || s.every((H) => zn(I, H)) && (h = { box: I, lines: u, score: A });
        }
  }
  const y = h ? [{ t: "text", x: h.box.x, y: h.box.y + nt - 1, text: n, lines: h.lines, lineHeight: Ct, color: k.refuse, size: nt, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: n,
    color: k.refuse,
    size: nt,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return ht = { key: l, shapes: y }, y;
}
const B = (t, i = 1, n) => {
  const a = (s, r) => Math.round(s / r) * r, o = { ...t, cards: t.cards.map((s) => {
    const r = s.id === n ? i : 1, e = { ...s, duration: Math.max(r, a(s.duration, r)), lag: Math.max(0, a(s.lag ?? 0, r)) };
    return e.lag || delete e.lag, e;
  }) };
  return t.launch && (o.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (o.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), o;
}, ut = (t) => !!t.behaviour || t.kind === "hiring-plan";
function En(t, i, n) {
  if (n !== "l" && n !== "L") return null;
  const a = /^card-(.+)$/.exec(i), o = a && t.cards.find((e) => e.id === a[1]);
  if (!o) return null;
  const s = (e) => t.cards.find((c) => c.id === e)?.label ?? e, r = [
    ...Gt(t, o.id).map((e) => ({
      said: `${o.label} waits on ${s(e)}`,
      edits: [{ kind: "link_tasks", card: { id: o.id }, waitsOn: { id: e } }]
    })),
    ...(o.dependsOn ?? []).map((e) => ({
      said: `${o.label} stops waiting on ${s(e)}`,
      edits: [{ kind: "unlink_tasks", card: { id: o.id }, waitsOn: { id: e } }]
    }))
  ];
  return r.length ? r : `${o.label} has no task it can wait on.`;
}
function Tn(t, i, { key: n, shiftKey: a }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const o = (n === "ArrowLeft" ? -1 : 1) * lt(t);
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(o) }];
  if (i === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(o) * 7 }];
  const s = /^(card|handle)-(.+)$/.exec(i), r = s && t.cards.find((e) => e.id === s[2]);
  return r ? a || s[1] === "handle" ? [{ kind: "set_task", card: { id: r.id }, duration: r.duration + o }] : [{ kind: "set_task", card: { id: r.id }, lag: (r.lag ?? 0) + o }] : null;
}
const pt = {
  laneCues: !1,
  notes(t, i, n, a) {
    return dt(pt.places(t, i).parts, t, n, a);
  },
  editsBetween: xt,
  label: Yt,
  places(t, i) {
    const n = In(t, D(t, i), (a) => {
      const o = t.cards.filter((r) => r.laneId === a), s = ot(t);
      return t.kind === "hiring-plan" ? o.length + (o.length === 1 ? " hire" : " hires") : `${o.length} ${o.length === 1 ? "task" : "tasks"} · ${o.filter((r) => s.get(r.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => ct(t, $n),
  chooser(t, i, n, a = {}) {
    const o = t.cards.findIndex((s) => s.id === i);
    return o < 0 ? null : t.kind === "hiring-plan" && a.narrow ? () => t : (ut(t) ? Rn : Wn)(t, i, o, Gt(t, i), n, a);
  },
  refusalAt(t, i, n, a, o) {
    const s = D(t, o);
    for (const d of t.cards) {
      if (d.id === i || !N(s.bars.get(d.id), a)) continue;
      const f = Pt(t, i, d.id);
      return f ? { laneId: d.laneId, reason: f } : null;
    }
    const r = t.cards.find((d) => d.id === i), e = (r.lag ?? 0) + Math.round((a.x - n.x - s.bars.get(i).x) / s.dayW);
    if (ut(t)) {
      const d = ot(t).get(i), f = Math.round(d.from + (a.x - n.x - s.bars.get(i).x) / s.dayW), l = (r.lag ?? 0) + nn(Dt(t)).idx(f) - d.start, x = lt(t), m = Bt(t, i, { lag: Math.max(0, Math.round(l / x) * x) });
      return typeof m == "string" ? { laneId: r.laneId, reason: m, lands: !0 } : null;
    }
    const c = at(t, { cardId: i, field: "lag" });
    return e > c.max ? { laneId: r.laneId, reason: st(P(t, { cardId: i, field: "lag" }, e), i) ?? c.reasons.max } : null;
  },
  handleDrag(t, i, n, a) {
    const o = D(t, a), s = (m) => F(D(m, a).parts);
    if (t.kind === "hiring-plan" && a.narrow) return null;
    if (ut(t)) return _n(t, i, n, a, o, s);
    if (i === "handle-launch") {
      const m = at(t, { field: "day" }), p = E(t, i, n, s, (h, y) => h.vary(y, q("launch", "day"), { constraint: (u) => [Q(u.launch.day, rt(u) - 1e-3), b(u.launch.day, 120)] }).onDrop((u) => B(u)));
      return (h) => {
        const y = Math.round((h.x - n.x + 22 - o.x0) / o.dayW), u = p?.(h) ?? P(t, { field: "day" }, Math.min(m.max, Math.max(m.min, y)));
        return y < m.min ? { next: u, clampedReason: m.reasons.min, refusal: st(P(t, { field: "day" }, Math.max(5, y))) ?? void 0 } : { next: u };
      };
    }
    const r = i.slice(7), e = t.cards.findIndex((m) => m.id === r);
    if (e < 0) return null;
    const c = { cardId: r, field: "duration" }, d = at(t, c), f = t.launch.day, l = E(t, i, n, s, (m, p) => m.vary(p, q("cards", e, "duration"), { constraint: (h) => [Q(h.cards[e].duration, 1), b(rt(h), f + 1e-3)] }).onDrop((h) => B(h))), x = o.bars.get(r);
    return (m) => {
      const p = Math.round((m.x - n.x + gt(o.narrow) - x.x) / o.dayW), h = Math.min(d.max, Math.max(d.min, p)), y = l?.(m) ?? P(t, c, h);
      return p > d.max ? { next: y, clampedReason: `Launch is day ${f}.`, refusal: st(P(t, c, Math.min(60, p)), r) ?? d.reasons.max } : p < d.min ? { next: y, clampedReason: d.reasons.min } : { next: y };
    };
  },
  keyEdit: Tn,
  keyChoices: En,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on."
};
function Rn(t, i, n, a, o, s) {
  const r = lt(t), e = an(t), c = t.cards[n].laneId, d = (h) => {
    if (!e) return h;
    const y = sn(t, h, /* @__PURE__ */ new Set([i]));
    return typeof y == "string" ? h : y;
  }, f = (h) => d(B(h, r, i)), l = (h) => F(D(d(h), s).parts, a.map((y) => "card-" + y)), m = (s.narrow ? [c] : t.lanes.map((h) => h.id)).flatMap((h) => Nt(t, i, "lag", h === c ? void 0 : h).map((y) => ({ laneId: h, run: y })));
  if (!m.length) return () => t;
  const p = E(t, "card-" + i, o, l, (h, y) => {
    const u = h.closest(m.map(({ laneId: g, run: [w, M] }) => h.vary(
      { ...y, cards: y.cards.map((v, I) => I === n ? { ...v, laneId: g, lag: Math.min(M, Math.max(w, v.lag ?? 0)) } : v) },
      q("cards", n, "lag"),
      { constraint: (v) => [Q(v.cards[n].lag ?? 0, w - 0.49), b(v.cards[n].lag ?? 0, M + 0.49)] }
    ))).withBranchTransition(100);
    return a.length ? h.closest(a.map((g) => h.dropTarget("target-" + g, Kt(y, i, g)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(u).withBranchTransition(120).onDrop(f) : u.onDrop(f);
  });
  return p ? (h) => f(p(h)) : null;
}
function _n(t, i, n, a, o, s) {
  const r = (u, g) => {
    const w = [];
    for (const M of u) if (g(M)) {
      const v = w.at(-1);
      v && v[1] === M - (u[1] - u[0]) ? v[1] = M : w.push([M, M]);
    }
    return w;
  }, e = (u, g, w) => Array.from({ length: Math.floor((g - u) / w) + 1 }, (M, v) => u + v * w), c = (u, g, w, M, v) => E(t, i, n, s, (I, S) => I.closest(w.map(([$, A]) => I.vary(
    S,
    q(...u),
    { constraint: (H) => [Q(g(H), $ - 0.49), b(g(H), A + 0.49)] }
  ))).withBranchTransition(100).onDrop(($) => B($, M, v))), d = (u, g, w, M) => (v) => {
    const I = g(v), S = w(I), $ = u?.(v) ?? (S ? t : M(I));
    return S ? { next: $, clampedReason: S, refusal: S } : { next: $ };
  };
  if (i === "handle-launch" || i === "handle-funding") {
    const u = i === "handle-launch", g = (S) => u ? P(t, { field: "day" }, S) : { ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: S } } }, w = (S) => u && (S < 5 || S > 120) ? "Launch day is a whole day from 5 to 120." : u && Ft(t) && S < at(t, { field: "day" }).min ? st(g(S)) ?? "Every task ends by " + Ht(t) + "." : On(t, g(S)), M = u ? e(5, 120, 1) : e(0, t.hiring.weeks * 7, 1), v = r(M, (S) => !w(S)), I = v.length ? c(u ? ["launch", "day"] : ["hiring", "funding", "day"], (S) => u ? S.launch.day : S.hiring.funding.day, v, 1) : null;
    return d(I, (S) => Math.round((S.x - n.x + 22 - o.x0) / o.dayW), w, g);
  }
  const f = i.slice(7), l = t.cards.findIndex((u) => u.id === f);
  if (l < 0) return null;
  const x = lt(t), m = o.bars.get(f), p = Nt(t, f, "duration"), h = p.length ? c(["cards", l, "duration"], (u) => u.cards[l].duration, p, x, f) : null;
  return d(
    h,
    (u) => t.cards[l].duration + Math.round((u.x - n.x + gt(o.narrow) - m.x - m.width) / o.dayW),
    (u) => {
      const g = Bt(t, f, { duration: Math.max(x, Math.round(u / x) * x) });
      return typeof g == "string" ? g : null;
    },
    (u) => P(t, { cardId: f, field: "duration" }, u)
  );
}
function On(t, i) {
  const n = t.behaviour ? on(t, i) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function Wn(t, i, n, a, o, s) {
  const r = t.launch.day, e = (d) => F(D(d, s).parts, a.map((f) => "card-" + f)), c = E(t, "card-" + i, o, e, (d, f) => {
    const l = s.narrow ? f.lanes.filter((m) => m.id === f.cards[n].laneId) : f.lanes, x = d.closest(l.map((m) => d.vary(
      { ...f, cards: f.cards.map((p, h) => h === n ? { ...p, laneId: m.id, lag: p.lag ?? 0 } : p) },
      q("cards", n, "lag"),
      { constraint: (p) => [Q(p.cards[n].lag ?? 0, -1e-3), b(rt(p), r + 1e-3)] }
    )));
    return a.length ? d.closest(a.map((m) => d.dropTarget("target-" + m, Kt(f, i, m)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop((m) => B(m)) : x.onDrop((m) => B(m));
  });
  return c ? (d) => B(c(d)) : null;
}
const V = 76;
function J(t, i = {}) {
  const n = !!i.narrow, a = [], o = t.lanes.map((c) => t.cards.filter((d) => d.laneId === c.id).length), s = (c) => t.lanes[c].role === "won" ? "#bfe3cf" : t.lanes[c].role === "lost" ? "#e4dcdc" : G[c % G.length];
  let r, e;
  if (n) {
    r = Math.max(300, i.width ?? 390);
    let c = V;
    t.lanes.forEach((d, f) => {
      const l = 96 + (o[f] + 1) * 64;
      a.push({ name: "column-" + d.id, x: 2, y: c, width: r - 4, height: l, fill: L(s(f), 0.6), line: L(s(f), 0.1) });
      const x = (r - 16) * 0.36;
      a.push({ name: "lane-" + d.id, x: 8, y: c + 6, width: x, height: 36, text: d.label, fill: s(f), fontSize: 15 }), a.push({ name: "caption-" + d.id, x: 8 + x + 6, y: c + 6, width: r - 16 - x - 6, height: 56, text: vt(t, d.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((m) => m.laneId === d.id).forEach((m, p) => a.push({ name: "card-" + m.id, x: 8, y: c + 72 + p * 64, width: r - 16, height: 56, text: Tt(t, m.id), fontSize: 15 })), c += l + 10;
    }), e = c;
  } else {
    const f = 116 + (Math.max(...o) + 1) * 88;
    t.lanes.forEach((l, x) => {
      const m = x * 244;
      a.push({ name: "column-" + l.id, x: m + 2, y: V, width: 240, height: f, fill: L(s(x), 0.6), line: L(s(x), 0.1) }), a.push({ name: "lane-" + l.id, x: m + 8, y: V + 6, width: 228, height: 58, text: l.label, fill: s(x), fontSize: 16 }), a.push({ name: "caption-" + l.id, x: m + 8, y: V + 66, width: 228, height: 48, text: vt(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((p) => p.laneId === l.id).forEach((p, h) => a.push({ name: "card-" + p.id, x: m + 8, y: V + 116 + h * 88, width: 228, height: 76, text: Tt(t, p.id), fontSize: 15 }));
    }), r = t.lanes.length * 244, e = V + f;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: wn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: a, width: r, height: e };
}
function Tt(t, i) {
  const n = t.cards.find((a) => a.id === i);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + _(n.amount, t.forecast.currency);
}
function Pn(t, i) {
  const { width: n } = J(t, i.layout), a = t.forecast.target, o = Vt(t), s = Math.max(a * 1.25, o), r = n - 8, e = o >= a;
  return [
    { t: "rect", x: 4, y: 42, w: r, h: 14, rx: 7, color: k.track },
    { t: "rect", x: 4, y: 42, w: r * o / s, h: 14, rx: 7, color: e ? k.accept : k.bar },
    { t: "line", x1: 4 + r * a / s, y1: 36, x2: 4 + r * a / s, y2: 62, color: k.ink, width: 2 },
    { t: "text", x: 4 + r * a / s, y: 72, text: "Target " + _(a, t.forecast.currency), color: k.ink, size: 14, anchor: "middle" }
  ];
}
const Dn = {
  laneCues: !0,
  places: (t, i) => J(t, i),
  notes: (t, i, n, a) => dt(J(t, i).parts, t, n, a),
  editsBetween: xt,
  layer: (t) => ct(t, Pn),
  chooser(t, i, n, a = {}) {
    const o = Ot(t, i).map((s) => Wt(t, i, s.id));
    return o.length < 2 ? null : Ut(E(t, "card-" + i, n, (s) => F(J(s, a).parts), (s, r) => s.closest(o, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r, { gapIn: 40, gapOut: 56 })), t, i, J(t, a).parts, o);
  },
  refusalAt(t, i, n, a, o) {
    const { parts: s } = J(t, o), r = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === r.laneId || !N(s.find((d) => d.name === "column-" + e.id), a)) continue;
      const c = dn(t, i, e.id);
      return c ? { laneId: e.id, reason: c } : null;
    }
    return null;
  },
  handleDrag: () => null
}, C = 48, j = 960, Xt = 900;
function R(t, i = {}) {
  const n = !!i.narrow, a = t.budget.total, o = [], s = [], r = t.lanes.map((d) => t.cards.filter((f) => f.laneId === d.id).length);
  let e, c;
  if (n) {
    e = Math.max(300, i.width ?? 390);
    let d = C;
    t.lanes.forEach((f, l) => {
      const x = Math.max(100 + (r[l] + 1) * 64, f.allocation / a * Xt);
      s.push({ laneId: f.id, start: d, size: x }), d += x;
    }), c = d + 8;
  } else {
    e = j;
    let d = 0;
    for (const f of t.lanes)
      s.push({ laneId: f.id, start: d, size: f.allocation / a * j }), d += f.allocation / a * j;
    c = C + 100 + (Math.max(...r) + 1) * 64;
  }
  return t.lanes.forEach((d, f) => {
    const { start: l, size: x } = s[f], m = G[f % G.length], p = n ? { x: 2, y: l + 1, width: e - 4, height: x - 2 } : { x: l + 1, y: C, width: Math.max(4, x - 2), height: c - C }, h = { x: p.x + 5, y: p.y, width: Math.max(10, p.width - 10) };
    o.push({ name: "column-" + d.id, ...p, fill: L(m, 0.6), line: L(m, 0.1) });
    const y = n ? h.width * 0.36 : h.width;
    if (o.push({ name: "lane-" + d.id, x: h.x, y: h.y + 6, width: y, height: 32, text: d.label, fill: m, fontSize: 15 }), o.push({
      name: "caption-" + d.id,
      x: n ? h.x + y + 6 : h.x,
      y: h.y + (n ? 6 : 40),
      width: n ? h.width - y - 6 : h.width,
      height: n ? 50 : 40,
      text: n ? St(t, d.id).replace(" · ", `
`) : St(t, d.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((u) => u.laneId === d.id).forEach((u, g) => o.push({
      name: "card-" + u.id,
      x: h.x,
      y: h.y + 100 + g * 64,
      width: h.width,
      height: 56,
      text: u.label + `
` + _(u.amount, t.budget.currency),
      fontSize: 14
    })), f < t.lanes.length - 1) {
      const u = l + x;
      o.push(n ? { name: "handle-" + d.id, x: e - 96, y: u - 22, width: 88, height: 44 } : { name: "handle-" + d.id, x: u - 22, y: C - 6, width: 44, height: 48 });
    }
  }), { parts: o, width: e, height: c, segments: s, narrow: n };
}
function Bn(t, i) {
  const n = R(t, i.layout), a = t.budget.total, o = [{ t: "text", x: 4, y: 28, text: kn(t), color: k.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((s, r) => {
    const e = n.segments[r], c = s.allocation, d = fn(t, s.id);
    if (n.narrow) {
      const f = e.start + 50, l = 8, x = n.width - 16;
      o.push({ t: "rect", x: l, y: f, w: x, h: 10, rx: 5, color: k.track }), o.push({ t: "rect", x: l, y: f, w: x * d / c || 0, h: 10, rx: 5, color: k.bar }), s.floor !== void 0 && o.push({ t: "line", x1: l + x * s.floor / c, y1: f - 4, x2: l + x * s.floor / c, y2: f + 14, color: k.ink, width: 2 });
    } else {
      const f = j / a, l = C + 86;
      o.push({ t: "rect", x: e.start + 6, y: l, w: e.size - 12, h: 10, rx: 5, color: k.track }), o.push({ t: "rect", x: e.start + 6, y: l, w: Math.max(0, (e.size - 12) * d / c || 0), h: 10, rx: 5, color: k.bar }), s.floor !== void 0 && o.push({ t: "line", x1: e.start + s.floor * f, y1: l - 6, x2: e.start + s.floor * f, y2: l + 16, color: k.ink, width: 2 }), s.cap !== void 0 && e.start + s.cap * f <= n.width && o.push({ t: "line", x1: e.start + s.cap * f, y1: l - 6, x2: e.start + s.cap * f, y2: l + 16, color: k.refuse, width: 2, dash: "3 2" });
    }
    if (r < t.lanes.length - 1) {
      const f = e.start + e.size;
      o.push(n.narrow ? { t: "line", x1: 2, y1: f, x2: n.width - 2, y2: f, color: k.ink, width: 2 } : { t: "line", x1: f, y1: C, x2: f, y2: n.height, color: k.ink, width: 2 }), o.push(n.narrow ? { t: "rect", x: n.width - 68, y: f - 4, w: 32, h: 8, rx: 4, color: k.ink } : { t: "rect", x: f - 4, y: C + 2, w: 8, h: 30, rx: 4, color: k.ink });
    }
  }), i.clamp) {
    const s = n.parts.find((r) => r.name === i.clamp.name);
    s && o.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(s.x + 22, 120), n.width - 120),
      y: n.narrow ? s.y + 8 : C - 12,
      text: i.clamp.text,
      color: k.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return o;
}
const Fn = (t, i) => Math.round(t / i) * i, Nn = {
  laneCues: !0,
  notes: (t, i, n, a) => dt(R(t, i).parts, t, n, a),
  editsBetween: xt,
  label: Yt,
  places(t, i) {
    const { parts: n, width: a, height: o } = R(t, i);
    return { parts: n, width: a, height: o };
  },
  layer: (t) => ct(t, Bn),
  chooser(t, i, n, a = {}) {
    const o = Ot(t, i).map((s) => Wt(t, i, s.id));
    return o.length < 2 ? null : Ut(E(t, "card-" + i, n, (s) => F(R(s, a).parts), (s, r) => s.closest(o).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r)), t, i, R(t, a).parts, o);
  },
  refusalAt(t, i, n, a, o) {
    const { parts: s } = R(t, o), r = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === r.laneId || !N(s.find((d) => d.name === "column-" + e.id), a)) continue;
      const c = un(t, i, e.id);
      return c ? { laneId: e.id, reason: c } : null;
    }
    return null;
  },
  handleDrag(t, i, n, a) {
    const o = i.slice(7), s = t.lanes.findIndex((p) => p.id === o), r = t.lanes[s + 1];
    if (s < 0 || !r) return null;
    const e = hn(t, { laneId: o }), c = t.budget.step, d = (p) => {
      const h = Math.min(e.max, Math.max(e.min, Fn(p, c)));
      return It(t, r.id, o, h);
    }, f = R(t, a), l = f.narrow ? Xt / t.budget.total : j / t.budget.total, x = f.parts.find((p) => p.name === i), m = E(t, i, n, (p) => F(R(p, a).parts), (p) => p.varyFunc([0], ([h]) => It(t, r.id, o, h), { constraint: (h) => [
      ...tn([e.min, h.lanes[s].allocation - t.lanes[s].allocation, e.max])
    ] }));
    return (p) => {
      const y = (f.narrow ? p.y - n.y - x.y : p.x - n.x - x.x) / l, u = m?.(p), g = u ? u.lanes[s].allocation - t.lanes[s].allocation : y, w = { next: d(g) };
      return y > e.max + c / 2 ? { ...w, clampedReason: e.reasons.max } : y < e.min - c / 2 ? { ...w, clampedReason: e.reasons.min } : w;
    };
  },
  keyEdit(t, i, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const a = /^handle-(.+)$/.exec(i)?.[1], o = t.lanes.findIndex((d) => d.id === a), s = t.lanes[o + 1];
    if (o < 0 || !s) return null;
    const r = n === "ArrowRight" || n === "ArrowDown", e = t.budget.step;
    return [r ? { kind: "shift_budget", from: { id: s.id }, to: { id: a }, amount: e } : { kind: "shift_budget", from: { id: a }, to: { id: s.id }, amount: e }];
  }
}, Hn = { pile: "#fbdfac", theme: "#efd7dc", outcome: "#d5e9e3", opportunity: "#dedef4", problem: "#efd7dc", cause: "#fbdfac", action: "#dcebf3" }, Kn = (t) => Hn[t.role ?? ""] ?? "#fffdf6", O = 64, Rt = 8, et = 220, Z = 84, X = (t, i) => i.narrow ? "outline" : t.nest?.layout ?? "clusters";
function _t(t, i) {
  const n = [], a = (o, s) => {
    n.push({ card: o, depth: s });
    for (const r of z(t, o.id)) a(r, s + 1);
  };
  for (const o of Jt(t, i)) a(o, 0);
  return n;
}
const Vn = yn;
function W(t, i = {}) {
  const n = X(t, i), { main: a, tray: o } = U(t), s = [], r = (p, h, y, u, g) => {
    s.push({ name: "lane-" + p, x: h, y, width: u, height: 40, text: t.lanes.find((w) => w.id === p).label, fill: p === o ? "#e9e5da" : "#d5e9e3", fontSize: 16 }), s.push({ name: "caption-" + p, x: h, y: y + 44, width: u, height: 26, text: g, fill: "transparent", lineWidth: 0, fontSize: 14 });
  }, e = (p) => gn.caption(t, p), c = (p, h, y, u, g = O) => s.push({ name: "card-" + p.id, x: h, y, width: u, height: g, text: Vn(t, p), fill: Kn(p), fontSize: 14 });
  if (n === "outline") {
    const p = Math.max(300, i.width ?? 358);
    let h = 0;
    for (const y of [a, o]) {
      const u = h;
      r(y, 8, h + 6, p - 16, e(y)), h += 82;
      for (const { card: g, depth: w } of _t(t, y))
        c(g, 8 + 20 * w, h, p - 16 - 20 * w, 44), h += 52;
      h += 44, s.unshift({ name: "column-" + y, x: 2, y: u, width: p - 4, height: h - u, fill: L(y === o ? "#e9e5da" : "#d5e9e3", 0.6), line: L("#d5e9e3", 0.1) }), h += 10;
    }
    return { parts: s, width: p, height: h };
  }
  const d = _t(t, o);
  r(o, 8, 6, et - 16, e(o)), d.forEach(({ card: p }, h) => c(p, 8, Z + h * (O + Rt), et - 16));
  const f = Z + Math.max(1, d.length + 1) * (O + Rt), l = et + 16;
  let x, m;
  if (n === "clusters") {
    const y = Jt(t, a);
    let u = Z, g = 0;
    y.forEach((w, M) => {
      M && M % 4 === 0 && (u += g + 16, g = 0);
      const v = l + M % 4 * 220;
      let I = u;
      const S = ($, A) => {
        c($, v + 12 * A, I, 208 - 12 * A, A ? O : 56), I += (A ? O : 56) + 6;
        for (const H of z(t, $.id)) S(H, A + 1);
      };
      S(w, 0), g = Math.max(g, I - u);
    }), x = l + 4 * 220 + 8, m = Math.max(f, u + g + O + 40), r(a, l, 6, Math.min(x - l - 8, 640), e(a));
  } else {
    const h = O + 44;
    let y = 0, u = 0;
    const g = (w, M) => {
      u = Math.max(u, M);
      const I = z(t, w.id).map(($) => g($, M + 1)), S = I.length ? (I[0] + I[I.length - 1]) / 2 : y++;
      return c(w, l + S * 192, Z + M * h, 176), S;
    };
    for (const w of z(t, null, a)) g(w, 0);
    x = l + Math.max(3, y) * 192 + 8, m = Math.max(f, Z + (u + 1) * h + 56), r(a, l, 6, Math.min(x - l - 8, 640), e(a));
  }
  return s.unshift(
    { name: "column-" + a, x: l - 6, y: 0, width: x - l + 4, height: m, fill: L("#d5e9e3", 0.75), line: L("#d5e9e3", 0.1) },
    { name: "column-" + o, x: 2, y: 0, width: et - 4, height: m, fill: L("#e9e5da", 0.5), line: L("#e9e5da", 0.1) }
  ), { parts: s, width: x, height: m };
}
function Jn(t, i) {
  if (X(t, i.layout) !== "tree") return [];
  const { parts: n } = W(t, i.layout), a = new Map(n.map((o) => [o.name, o]));
  return t.cards.flatMap((o) => {
    const s = o.parentId && a.get("card-" + o.parentId), r = a.get("card-" + o.id);
    if (!s || !r) return [];
    const e = s.x + s.width / 2, c = s.y + s.height, d = r.x + r.width / 2, f = r.y, l = (c + f) / 2;
    return [{ t: "path", d: `M ${e} ${c} V ${l} H ${d} V ${f}`, color: k.week, width: 2 }];
  });
}
function it(t, i, n) {
  for (let a = t.length - 1; a >= 0; a--) {
    const o = t[a];
    if (o.name.startsWith("card-") && !n.has(o.name.slice(5)) && N(o, i)) return o.name.slice(5);
  }
  return null;
}
function mt(t, i, n) {
  const a = t.cards.find((o) => o.id === n);
  return a.laneId === U(t).tray ? null : i === "tree" || !a.parentId || t.cards.some((o) => o.parentId === n) ? n : a.parentId;
}
function Un(t, i, n, a, o, s) {
  const r = t.cards.find((l) => l.id === n);
  if (mt(t, i, n) === n) return { laneId: r.laneId, under: n, before: null };
  const c = r.parentId ?? null, d = (c ? z(t, c) : z(t, null, r.laneId)).filter((l) => l.id !== s), f = a.y > o.y + o.height / 2;
  return { laneId: r.laneId, under: c, before: f ? d[d.findIndex((l) => l.id === n) + 1]?.id ?? null : n };
}
const Gn = (t, i) => t === i || JSON.stringify(t.cards) === JSON.stringify(i.cards);
function Yn(t, i) {
  const n = [], a = new Map(t.cards.map((s) => [s.id, s])), o = /* @__PURE__ */ new Set();
  for (const s of i.cards) {
    if (a.has(s.id) || s.parentId || s.role !== "pile") continue;
    const r = i.cards.filter((e) => e.parentId === s.id);
    r.length !== 1 || !a.has(r[0].id) || (n.push({ kind: "start_pile", card: { id: r[0].id }, ...s.label !== "New pile" && { label: s.label } }), o.add(s.id).add(r[0].id));
  }
  for (const s of i.cards) {
    if (o.has(s.id)) continue;
    const r = a.get(s.id);
    if (!r) {
      n.push({
        kind: "add_card",
        lane: { id: s.laneId },
        label: s.label,
        ...s.parentId && { under: { id: s.parentId } },
        ...s.role && { role: s.role },
        ...s.source && { source: s.source }
      });
      continue;
    }
    if (r.label !== s.label && n.push({ kind: "rename_card", card: { id: s.id }, label: s.label }), r.parentId !== s.parentId || r.order !== s.order || r.laneId !== s.laneId && !s.parentId) {
      const e = s.parentId ? z(i, s.parentId) : z(i, null, s.laneId), c = e[e.findIndex((d) => d.id === s.id) + 1];
      n.push({ kind: "nest_card", card: { id: s.id }, ...s.parentId ? { under: { id: s.parentId } } : { lane: { id: s.laneId } }, ...c && { before: { id: c.id } } });
    }
    s.role && r.role !== s.role && n.push({ kind: "set_role", card: { id: s.id }, role: s.role });
  }
  for (const s of t.cards) i.cards.some((r) => r.id === s.id) || n.push({ kind: "remove_card", card: { id: s.id } });
  for (const s of i.lanes) {
    const r = t.lanes.find((e) => e.id === s.id);
    r && r.label !== s.label && n.push({ kind: "rename_lane", lane: { id: s.id }, label: s.label });
  }
  return i.nest && t.nest?.layout !== i.nest.layout && n.push({ kind: "set_layout", layout: i.nest.layout }), t.title !== i.title && n.push({ kind: "rename_workshop", title: i.title }), n;
}
const Zn = {
  laneCues: !0,
  places: (t, i) => W(t, i),
  notes: (t, i, n, a) => dt(W(t, i).parts, t, n, a),
  editsBetween: Yn,
  layer: (t) => ct(t, Jn),
  cardKeys: "Right puts it under the card above it, Left takes it out, Up and Down move it among its neighbours.",
  label(t, i) {
    const n = t.cards.find((o) => "card-" + o.id === i);
    if (!n) return null;
    const a = t.cards.find((o) => o.id === n.parentId);
    return n.label + (n.role ? ", " + n.role : "") + (a ? ", under " + a.label : ", in " + t.lanes.find((o) => o.id === n.laneId).label);
  },
  chooser(t, i, n, a = {}) {
    const o = mn(t, i), s = o.map((p) => p.next), { main: r, tray: e } = U(t), c = t.cards.find((p) => p.id === i), d = X(t, a), f = s.length > 1 ? E(t, "card-" + i, n, (p) => F(W(p, a).parts), (p, h) => p.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(h, { gapIn: 40, gapOut: 56 })) : null, { parts: l } = W(t, a), x = new Set(Lt(t, i));
    let m;
    return (p) => {
      const h = d === "outline" ? null : it(l, p, x);
      if (h) {
        const u = Un(t, d, h, p, l.find((w) => w.name === "card-" + h), i), g = o.find((w) => w.spot.laneId === u.laneId && w.spot.under === u.under && w.spot.before === u.before);
        if (g) return g.next;
      }
      const y = f ? f(p) : t;
      return Gn(y, t) ? c.laneId !== e && N(l.find((u) => u.name === "column-" + e), p) ? $t(t, i, { laneId: e, under: null, before: null }) ?? t : N(l.find((u) => u.name === "column-" + r), p) && !it(l, p, /* @__PURE__ */ new Set()) ? (m === void 0 && (m = xn(t, i)), m ?? t) : y : y;
    };
  },
  refusalAt(t, i, n, a, o) {
    const s = X(t, o);
    if (s === "outline") return null;
    const { parts: r } = W(t, o), e = it(r, a, new Set(Lt(t, i))), c = e && mt(t, s, e), d = t.cards.find((x) => x.id === i);
    if (!c || c === d.parentId) return null;
    const f = $t(t, i, { laneId: U(t).main, under: c, before: null }), l = f && t.behaviour ? pn(t, f) : null;
    return l && "refused" in l ? { laneId: U(t).main, reason: l.refused.sentence } : null;
  },
  noteUnder(t, i, n) {
    const a = it(W(t, n).parts, i, /* @__PURE__ */ new Set());
    return a ? mt(t, X(t, n), a) : null;
  },
  keyEdit(t, i, n) {
    const a = t.cards.find((c) => "card-" + c.id === i);
    if (!a) return null;
    const o = a.parentId ? z(t, a.parentId) : z(t, null, a.laneId), s = o.findIndex((c) => c.id === a.id), r = { id: a.id }, e = (c) => c ? { under: { id: c } } : { lane: { id: a.laneId } };
    switch (n.key) {
      case "ArrowRight":
        return s > 0 && a.laneId !== U(t).tray ? [{ kind: "nest_card", card: r, under: { id: o[s - 1].id } }] : null;
      case "ArrowLeft": {
        const c = t.cards.find((l) => l.id === a.parentId);
        if (!c) return null;
        const d = c.parentId ? z(t, c.parentId) : z(t, null, c.laneId), f = d[d.findIndex((l) => l.id === c.id) + 1];
        return [{ kind: "nest_card", card: r, ...e(c.parentId), ...f && { before: { id: f.id } } }];
      }
      case "ArrowUp":
        return s > 0 ? [{ kind: "nest_card", card: r, ...e(a.parentId), before: { id: o[s - 1].id } }] : null;
      case "ArrowDown":
        return s >= 0 && s < o.length - 1 ? [{ kind: "nest_card", card: r, ...e(a.parentId), ...o[s + 2] && { before: { id: o[s + 2].id } } }] : null;
    }
    return null;
  },
  handleDrag: () => null
}, jn = { "launch-plan": pt, "hiring-plan": pt, pipeline: Dn, budget: Nn, nest: Zn };
function ee(t) {
  const i = jn[t];
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return i;
}
function ie(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  oe as amountLimits,
  re as amountOf,
  qe as amountRules,
  le as bandOf,
  Qe as behaviourEditsBetween,
  ie as boardLayoutFor,
  fi as breakDownSample,
  St as budgetCaption,
  fn as budgetCommitted,
  kn as budgetHeader,
  Nn as budgetKit,
  R as budgetLayout,
  hn as budgetLimits,
  un as budgetRefusal,
  be as budgetRules,
  ti as budgetShiftLimits,
  ni as budgetShiftRefusal,
  pi as byOrder,
  an as cascadeStops,
  ei as catalogSamples,
  pn as checkNest,
  mi as checkNestMove,
  on as checkTime,
  Dt as clockOf,
  ct as createBoardLayer,
  ce as currencyOf,
  de as dateName,
  he as dayFromWords,
  nn as dayMap,
  Mt as dayWords,
  ue as days,
  xi as discoveryTreeSample,
  fe as downstreamTasks,
  pe as extendWorkshopEdits,
  me as goLiveSample,
  Yt as handleLabel,
  xe as hireLagFor,
  rn as hireStarts,
  ge as hiringPlanRules,
  ye as hiringPlanSample,
  sn as holdOthers,
  gi as incidentReviewSample,
  yi as isOrderKey,
  Y as isoAt,
  we as isoTime,
  ee as kitFor,
  rt as launchFinish,
  Ft as launchHard,
  ke as launchIndex,
  D as launchLayout,
  Pt as launchLinkRefusal,
  Gt as launchLinkTargets,
  st as launchOverrun,
  Me as launchPlanCaption,
  pt as launchPlanKit,
  at as launchPlanLimits,
  ve as launchPlanRefusal,
  Se as launchPlanRules,
  Ie as launchPlanSample,
  Le as launchTaskText,
  k as layerInk,
  Nt as legalRuns,
  Ht as lineWord,
  _ as money,
  $e as monthNames,
  wi as nestAlias,
  U as nestAreas,
  yn as nestCardText,
  ki as nestDepth,
  Mi as nestDrags,
  Yn as nestEditsBetween,
  xn as nestEmptyDrop,
  vi as nestFamily,
  z as nestKids,
  Zn as nestKit,
  W as nestLayout,
  mn as nestLegal,
  Si as nestMeasure,
  Ii as nestMeasureWords,
  $t as nestPlace,
  Jt as nestRoots,
  gn as nestRules,
  Li as nestSentence,
  Lt as nestSubtree,
  ze as nextCardId,
  Ae as nextMonday,
  Ce as noteNumbers,
  kt as offsetOf,
  $i as orderBetween,
  zi as orderKeys,
  Ee as ownField,
  dt as partNotes,
  en as pastTheLine,
  vt as pipelineCaption,
  Vt as pipelineForecast,
  wn as pipelineGauge,
  Dn as pipelineKit,
  J as pipelineLayout,
  ii as pipelineLimits,
  dn as pipelineRefusal,
  ai as pipelineRules,
  si as planBudgetMove,
  Te as planDrags,
  Re as planEdit,
  _e as planFixed,
  Oe as planLaunchPlanMove,
  oi as planPipelineMove,
  We as planProblem,
  Pe as planWords,
  De as presetRules,
  Be as readClock,
  Fe as readNoteNumbers,
  Ne as renamedNumbers,
  At as renderLayerShapes,
  ri as restoreWorkshop,
  Ai as roleOf,
  He as runwayCap,
  Ke as runwayHeader,
  ln as runwayMonths,
  cn as runwayWords,
  li as sampleBudget,
  Ve as sampleLaunchPlan,
  ci as samplePipeline,
  ot as scheduleLaunch,
  It as shiftBudget,
  K as shortDate,
  lt as snapStep,
  Ci as sortEvidenceSample,
  Je as timeFamily,
  Ue as timeRuleKindIds,
  Ge as timeSentence,
  Bt as tryTask,
  di as validateBudget,
  Ye as validateHiringPlan,
  Ze as validateLaunchPlan,
  Ei as validateNest,
  hi as validatePipeline,
  wt as weekdayAt,
  je as weekendAt,
  Kt as withLink,
  P as withTaskValue,
  xt as workshopEditsBetween
};
