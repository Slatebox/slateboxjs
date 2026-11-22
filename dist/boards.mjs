import { Vec2 as ht, getElementPositionCheap as Dt, translate as Ft, dragSpecToBehavior as Ht, param as U, moreThan as Y, lessThan as Z, inOrder as Kt } from "./dragology.mjs";
import { laneColors as B, workshopDestinations as vt, workshopCandidate as St } from "./workshop-model.mjs";
import { B as J, X as nt, T as I, m as E, J as Lt, L as et, a2 as j, a1 as it, u as It, v as Ct, _ as q, z as Tt, Y as zt, a9 as Vt, C as bt, Z as Gt, F as jt, A as Jt, a4 as Ut, W as Et, a7 as Yt, U as ot, a3 as $t, w as dt, j as ut, s as A, f as H, aa as Zt, ag as qt, ah as Qt } from "./plans-BUZl1vuh.mjs";
import { a as Dn, d as Fn, ac as Hn, c as Kn, p as In, t as Vn, ak as bn, a0 as Gn, $ as jn, S as Jn, g as Un, ab as Yn, af as Zn, h as qn, i as Qn, V as Xn, K as te, I as ne, Q as ee, l as ie, M as ae, e as se, n as oe, q as re, b as le, o as ce, E as he, P as de, y as ue, H as fe, x as xe, D as ge, O as pe, R as me, aj as ye, r as we, ai as ke, ae as Me, N as ve, a8 as Se, a6 as Le, a5 as Ce, ad as Te, G as ze, k as Ee } from "./plans-BUZl1vuh.mjs";
import b from "react";
import { pipelineForecast as Wt, pipelineRefusal as Xt, pipelineCaption as ft, budgetLimits as tn, budgetRefusal as nn, budgetCaption as xt, shiftBudget as gt, budgetCommitted as en } from "./workshop-rules.mjs";
import { amountRules as We, behaviourEditsBetween as Oe, budgetRules as Ae, budgetShiftLimits as Re, budgetShiftRefusal as Pe, pipelineLimits as _e, pipelineRules as Be, planBudgetMove as Ne, planPipelineMove as De, planSamples as Fe, restoreWorkshop as He, sampleBudget as Ke, samplePipeline as Ie, validateBudget as Ve, validatePipeline as be } from "./workshop-rules.mjs";
import { byOrder as je, checkNest as Je, checkNestMove as Ue, extend as Ye, isOrderKey as Ze, nestAlias as qe, nestAreas as Qe, nestCardText as Xe, nestDepth as ti, nestDrags as ni, nestEmptyDrop as ei, nestFamily as ii, nestKids as ai, nestLegal as si, nestMeasure as oi, nestMeasureWords as ri, nestPlace as li, nestRoots as ci, nestRules as hi, nestSentence as di, nestSubtree as ui, orderBetween as fi, orderKeys as xi, registerNestPlus as gi, roleOf as pi, tidyKeys as mi, validateNest as yi } from "./workshop-nest.mjs";
import { isOrgChart as ki, nestAxes as Mi, nestQuadrants as vi, nestScores as Si, quadrantOf as Li, scoreBoard as Ci, scoresIn as Ti } from "./workshop-nest-plus.mjs";
const w = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, at = "http://www.w3.org/2000/svg", pt = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function T(t, i, e) {
  const a = document.createElementNS(at, t);
  for (const [s, r] of Object.entries(i)) a.setAttribute(s, String(r));
  return e?.fill && (a.setAttribute("fill", pt(e.fill)), a.style.setProperty("fill", e.fill)), e?.stroke && (a.setAttribute("stroke", pt(e.stroke)), a.style.setProperty("stroke", e.stroke)), a;
}
function mt(t, i, e, a) {
  const s = typeof document < "u" ? document.activeElement : null, r = s && t.contains(s) ? s.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const c = [];
  for (const n of i)
    if (n.t === "line")
      t.appendChild(T("line", {
        x1: n.x1,
        y1: n.y1,
        x2: n.x2,
        y2: n.y2,
        "stroke-width": n.width ?? 1,
        ...n.dash ? { "stroke-dasharray": n.dash } : {}
      }, { stroke: n.color }));
    else if (n.t === "rect")
      t.appendChild(T("rect", {
        x: n.x,
        y: n.y,
        width: Math.max(0, n.w),
        height: Math.max(0, n.h),
        rx: n.rx ?? 0,
        ...n.opacity !== void 0 ? { opacity: n.opacity } : {},
        ...n.role ? { "data-board-layer": n.role } : {}
      }, { fill: n.color }));
    else if (n.t === "text") {
      const o = T("text", {
        x: n.x,
        y: n.y,
        "font-size": n.size ?? 13,
        "text-anchor": n.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...n.bold ? { "font-weight": 600 } : {},
        ...n.role ? { "data-board-layer": n.role } : {}
      }, { fill: n.color });
      n.lines && n.lines.length > 1 ? n.lines.forEach((h, d) => {
        const l = T("tspan", { x: n.x, dy: d ? n.lineHeight ?? Math.round((n.size ?? 13) * 1.25) : 0 });
        l.textContent = d < n.lines.length - 1 ? h + " " : h, o.appendChild(l);
      }) : o.textContent = n.text, t.appendChild(o);
    } else {
      if (n.unlink && e) {
        const { cardId: o, waitsOn: h, label: d } = n.unlink, l = h + ">" + o, f = a?.armed === l, g = T("path", {
          d: n.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": l,
          "aria-label": f ? d + ". Tap again to remove it." : d,
          role: "button",
          tabindex: 0,
          ...f ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: f ? w.refuse : "transparent" });
        let x = !1;
        g.addEventListener("pointerdown", (u) => {
          u.stopPropagation(), x = u.pointerType === "touch" || u.pointerType === "pen";
        }), g.addEventListener("click", (u) => {
          if (u.stopPropagation(), x && a && a.armed !== l) {
            a.arm(l);
            return;
          }
          a?.arm(null), e(o, h);
        }), g.addEventListener("keydown", (u) => {
          u.key !== "Enter" && u.key !== " " || (u.preventDefault(), u.stopPropagation(), e(o, h));
        }), g.addEventListener("focus", () => {
          g.style.setProperty("stroke", w.accept), g.setAttribute("opacity", "0.35");
        }), g.addEventListener("blur", () => {
          f || (g.style.setProperty("stroke", "transparent"), g.removeAttribute("opacity"));
        }), t.appendChild(g), c.push(g);
      }
      if (t.appendChild(T("path", { d: n.d, fill: "none", "stroke-width": n.width ?? 1.5, "pointer-events": "none" }, { stroke: n.color })), n.arrow) {
        const { x: o, y: h, angle: d } = n.arrow;
        t.appendChild(T("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${o} ${h}) rotate(${d})`, "pointer-events": "none" }, { fill: n.color }));
      }
      if (n.unlink && a?.armed === n.unlink.waitsOn + ">" + n.unlink.cardId && n.arrow) {
        const o = T("text", {
          x: n.arrow.x - 6,
          y: n.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: w.refuse });
        o.textContent = "Tap again to remove this link", t.appendChild(o);
      }
    }
  r && c.find((n) => n.getAttribute("data-board-link") === r)?.focus({ preventScroll: !0 });
}
function rt(t, i) {
  const e = t?.canvas?.node, a = document.createElementNS(at, "g");
  a.setAttribute("data-board-layer", ""), a.setAttribute("pointer-events", "none");
  const s = document.createElementNS(at, "g");
  s.setAttribute("data-board-layer-top", ""), s.setAttribute("pointer-events", "none");
  let r = !1, c = null, n;
  const o = {
    armed: null,
    arm(d) {
      clearTimeout(n), o.armed = d, d && (n = setTimeout(() => o.arm(null), 5e3), c?.[2].announce?.("Link selected. Tap it again to remove it.")), c && h.draw(...c);
    }
  }, h = {
    draw(d, l, f) {
      if (r || !e) return;
      c = [d, l, f];
      const { origin: g } = f, x = i(l ?? d, f, d), u = (y) => y.t === "text" && (y.role === "clamp" || y.role === "refusal") || y.t === "rect" && !!y.role?.startsWith("grip-");
      for (const y of [a, s]) y.setAttribute("transform", `translate(${g.x} ${g.y})`);
      mt(a, x.filter((y) => !u(y)), f.onUnlink, o), mt(s, x.filter(u));
      const m = f.above && f.above.parentNode === e ? f.above : null, p = m ? m.nextSibling : e.firstChild;
      (a.parentNode !== e || a.previousSibling !== m) && e.insertBefore(a, p === a ? a.nextSibling : p), s.firstChild && e.lastChild !== s ? e.appendChild(s) : !s.firstChild && s.parentNode && s.remove();
    },
    destroy() {
      r = !0, clearTimeout(n), a.remove(), s.remove();
    }
  };
  return h;
}
function N(t, i = []) {
  const e = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return b.createElement(
    "g",
    null,
    ...e.map((a) => /* @__PURE__ */ b.createElement("g", { id: a.name, transform: Ft(a.x, a.y) }, /* @__PURE__ */ b.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ b.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
  );
}
function O(t, i, e, a, s) {
  let r;
  const n = {
    draggable: (h) => (r ?? (r = h.d), a(h.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: ht(e.x, e.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!Dt(n, t) || !r) return null;
  const o = Ht(s(r, t), n);
  return (h) => o({ pointer: ht(h.x, h.y) }).dropState;
}
const Q = (t, i, e = 0) => !!t && i.x >= t.x - e && i.x <= t.x + t.width + e && i.y >= t.y - e && i.y <= t.y + t.height + e;
function Ot(t, i, e, a, s) {
  if (!t) return null;
  const r = i.cards.find((c) => c.id === e).laneId;
  return (c) => {
    const n = t(c);
    if (n !== i && JSON.stringify(n) !== JSON.stringify(i)) return n;
    const o = a.find((h) => h.name.startsWith("column-") && h.name !== "column-" + r && Q(h, c));
    return o && s.find((h) => h.cards.find((d) => d.id === e).laneId === o.name.slice(7)) || n;
  };
}
function L(t, i) {
  const e = (a) => Math.round(parseInt(t.slice(a, a + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + e(1) + e(3) + e(5);
}
function lt(t, i) {
  const e = [], a = new Map(t.cards.map((n) => [n.id, n]));
  for (const n of i.cards) {
    const o = a.get(n.id), h = { id: n.id };
    if (!o) {
      e.push({
        kind: "add_card",
        lane: { id: n.laneId },
        label: n.label,
        ...n.duration !== void 0 && { duration: n.duration },
        ...n.lag && { lag: n.lag },
        ...n.dependsOn && { waitsOn: n.dependsOn.map((l) => ({ id: l })) },
        ...n.amount !== void 0 && { amount: n.amount }
      });
      continue;
    }
    o.label !== n.label && e.push({ kind: "rename_card", card: h, label: n.label });
    const d = e.length;
    for (const l of o.dependsOn ?? []) n.dependsOn?.includes(l) || e.push({ kind: "unlink_tasks", card: h, waitsOn: { id: l } });
    for (const l of n.dependsOn ?? []) o.dependsOn?.includes(l) || e.push({ kind: "link_tasks", card: h, waitsOn: { id: l } });
    o.laneId !== n.laneId && e.push({ kind: "move_card", card: h, lane: { id: n.laneId } }), (e.length > d && n.duration !== void 0 && e.slice(d).some((l) => l.kind !== "move_card") || o.duration !== n.duration || (o.lag ?? 0) !== (n.lag ?? 0)) && e.push({ kind: "set_task", card: h, duration: n.duration, lag: n.lag ?? 0 }), n.amount !== void 0 && o.amount !== n.amount && e.push({ kind: "set_amount", card: h, amount: n.amount });
  }
  for (const n of t.cards) i.cards.some((o) => o.id === n.id) || e.push({ kind: "remove_card", card: { id: n.id } });
  i.launch && t.launch?.day !== i.launch.day && e.push({ kind: "set_launch_day", day: i.launch.day }), i.forecast && t.forecast?.target !== i.forecast.target && e.push({ kind: "set_target", amount: i.forecast.target });
  const s = i.lanes.map((n) => ({ id: n.id, by: (n.allocation ?? 0) - (t.lanes.find((o) => o.id === n.id)?.allocation ?? 0) })), r = s.filter((n) => n.by < 0), c = s.filter((n) => n.by > 0);
  for (const n of c)
    for (const o of r) {
      const h = Math.min(n.by, -o.by);
      h <= 0 || (e.push({ kind: "shift_budget", from: { id: o.id }, to: { id: n.id }, amount: h }), n.by -= h, o.by += h);
    }
  for (const n of i.lanes) {
    const o = t.lanes.find((h) => h.id === n.id);
    o && o.label !== n.label && e.push({ kind: "rename_lane", lane: { id: n.id }, label: n.label }), o && o.capacity !== n.capacity && e.push({ kind: "set_lane_capacity", lane: { id: n.id }, capacity: n.capacity ?? null });
  }
  return t.title !== i.title && e.push({ kind: "rename_workshop", title: i.title }), e;
}
function an(t) {
  const i = t.forecast?.currency;
  return `Forecast ${E(Wt(t), i)} of ${E(t.forecast?.target ?? 0, i)}`;
}
function sn(t) {
  return `${E(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function At(t, i) {
  return t.cards.filter((e) => Lt(t, i, e.id) === null).map((e) => e.id);
}
function on(t, i, e, a) {
  for (let s = i; s > 11; s--) {
    const r = Math.max(1, Math.floor(e / (s * 0.55)));
    if (t.split(`
`).reduce((n, o) => n + Math.max(1, Math.ceil(o.length / r)), 0) * s * 1.3 <= a) return s;
  }
  return Math.min(i, 11);
}
function ct(t, i, e, a) {
  const s = a.textColor ?? "#18302d", r = a.borderColor ?? "#667872", c = a.fontSize ?? 14;
  return t.map((n) => {
    const o = n.name.startsWith("handle-"), h = n.text ?? "";
    return { options: {
      id: n.name,
      text: h,
      name: i.cards.find((d) => "card-" + d.id === n.name)?.label ?? h,
      xPos: e.x + n.x,
      yPos: e.y + n.y,
      width: n.width,
      height: n.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${n.width} V ${n.height} H 0 Z`,
      backgroundColor: o ? "transparent" : n.fill ?? a.backgroundColor ?? "#fffdf6",
      foregroundColor: n.ink ?? s,
      borderColor: n.line ?? r,
      borderWidth: o ? 0 : n.lineWidth ?? 1,
      ...a.fontFamily ? { fontFamily: a.fontFamily } : {},
      fontSize: on(h, n.fontSize ?? c, n.width - 12, n.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Rt(t, i) {
  const e = i.slice(7), a = J(i), s = a !== null && t.cards.find((n) => n.id === a);
  if (s) return `${s.label} start, ${nt(t, I(t).get(s.id).from)}. Left and Right move it; the end stays.`;
  if (e === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const r = t.cards.find((n) => n.id === e);
  if (r) return `${r.label} length, ${r.duration} days. Left and Right change it.`;
  const c = t.lanes.findIndex((n) => n.id === e);
  return c >= 0 && t.lanes[c + 1] ? `Divider between ${t.lanes[c].label} and ${t.lanes[c + 1].label}. Left and Right move money.` : null;
}
const Pt = "#c2410c", rn = 32, ln = 44, cn = (t, i) => t ? 0 : Math.min(22, Math.max(4, Math.floor(i / 3)));
function W(t, i = {}) {
  const e = !!i.narrow, a = t.kind === "hiring-plan", s = I(t), r = a ? t.hiring.weeks * 7 : zt(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), c = Vt(t), n = [], o = /* @__PURE__ */ new Map(), h = e ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), d = e ? 8 : 168, l = e ? (h - 88) / r : (h - d - 40) / r, f = (p) => B[t.lanes.findIndex((y) => y.id === p) % B.length], g = (p, y) => {
    const k = t.cards.find(($) => $.id === p), v = s.get(p), M = { x: d + v.from * l, y, width: (v.to - v.from) * l, height: e ? ln : rn };
    o.set(p, M);
    const S = c.has(p);
    if (n.push({
      name: "card-" + p,
      ...M,
      text: e ? "" : a ? k.label : `${k.label} · ${k.duration}d`,
      fill: S ? "#fde3d7" : e ? f(k.laneId) : a ? L(f(k.laneId), 0.45) : "#fffdf6",
      line: S || v.critical && !a ? Pt : "#667872",
      lineWidth: S || v.critical && !a ? 2.5 : 1,
      fontSize: 13
    }), !(a && e)) {
      const $ = cn(e, M.width), D = e ? 44 : 22, F = M.y + M.height / 2 - 22, V = e ? Math.max(-12, M.x - D) : M.x - D;
      n.push({ name: Jt(p), x: V, y: F, width: Math.max(24, M.x + $ - V), height: 44 }), n.push({ name: "handle-" + p, x: M.x + M.width - $, y: F, width: $ + D, height: 44 });
    }
  };
  let x, u, m;
  if (e) {
    const p = (h - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((y, k) => {
      const v = 8 + k * (p + 8);
      n.push({ name: "column-" + y.id, x: v, y: 30, width: p, height: 72, fill: L(f(y.id), 0.6), line: L(f(y.id), 0.1) }), n.push({ name: "lane-" + y.id, x: v + 4, y: 34, width: p - 8, height: 28, text: y.label, fill: f(y.id), fontSize: 14 }), n.push({ name: "caption-" + y.id, x: v + 4, y: 64, width: p - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), m = 124, u = 130, x = 138;
    for (const y of t.cards)
      g(y.id, x + 20), x += 64;
  } else {
    m = 48, u = 56, x = u;
    for (const p of t.lanes) {
      const y = t.cards.filter((v) => v.laneId === p.id), k = Math.max(92, y.length * 44 + 20);
      n.push({ name: "column-" + p.id, x: 0, y: x, width: h, height: k, fill: L(f(p.id), 0.65), line: L(f(p.id), 0.1) }), n.push({ name: "lane-" + p.id, x: 8, y: x + 8, width: d - 24, height: 32, text: p.label, fill: f(p.id), fontSize: 15 }), n.push({ name: "caption-" + p.id, x: 8, y: x + 44, width: d - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), y.forEach((v, M) => g(v.id, x + 10 + M * 44)), x += k + 4;
    }
  }
  return a ? t.hiring.funding && !e && n.push({ name: "handle-funding", x: d + t.hiring.funding.day * l - 22, y: 4, width: 44, height: 44 }) : n.push({ name: "handle-launch", x: d + t.launch.day * l - 22, y: e ? 104 : 4, width: 44, height: 44 }), { parts: n, width: h, height: x + 8, narrow: e, x0: d, dayW: l, gridTop: u, axisY: m, bars: o };
}
function hn(t, i, e) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = e(a.name.slice(8)));
  return i;
}
function dn(t, i) {
  const e = t.x + t.width, a = Math.max(t.x + 4, e - 10), r = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, c = i.y + i.height / 2;
  return { d: `M ${a} ${r} V ${c} H ${i.x}`, arrow: { x: i.x, y: c, angle: 0 } };
}
function un(t, i) {
  const e = W(t, i.layout), a = t.kind === "hiring-plan", s = I(t), r = Math.round((e.width - (e.narrow ? 88 : e.x0 + 40)) / e.dayW), c = Ct(t), n = [];
  if (c?.workdays)
    for (let l = 0; l < r; l++) dt(c.origin, l) === 6 && n.push({ t: "rect", x: e.x0 + l * e.dayW, y: e.gridTop, w: 2 * e.dayW, h: e.height - 8 - e.gridTop, color: w.track, opacity: 0.7 });
  for (const l of t.behaviour?.rules ?? []) if (c && l.on && l.kind === "blackout") {
    const f = ut(c.origin, l.start), g = ut(c.origin, l.end) + 1, x = e.x0 + Math.max(0, f) * e.dayW, u = (Math.min(r, g) - Math.max(0, f)) * e.dayW;
    if (u <= 0) continue;
    n.push({ t: "rect", x, y: e.gridTop, w: u, h: e.height - 8 - e.gridTop, color: w.refuse, opacity: 0.12 });
    for (let m = x; m < x + u; m += 10) n.push({ t: "line", x1: m, y1: e.gridTop, x2: Math.min(x + u, m + 10), y2: e.gridTop + 10, color: w.refuse, width: 0.6 });
    n.push({ t: "text", x: x + 3, y: e.gridTop + 22, text: l.label + " · " + A(l.start) + "–" + A(l.end), color: w.refuse, size: 11, bold: !0 });
  }
  for (let l = 0; l <= r; l++) {
    const f = e.x0 + l * e.dayW, g = c ? dt(c.origin, l) === 1 : l % 7 === 0;
    if (!g && e.dayW < 6) continue;
    n.push({ t: "line", x1: f, y1: e.gridTop, x2: f, y2: e.height - 8, color: g ? w.week : w.faint, width: g ? 1 : 0.5 });
    const x = a && c && H(c.origin, l).slice(8) <= "07" && g, u = c ? a ? x ? A(H(c.origin, l)).replace(/^\d+ /, "") : "" : A(H(c.origin, l)) : (e.narrow ? "W" : "Week ") + (l / 7 + 1);
    g && u && (!c || a || e.dayW * 7 > 44) && n.push({ t: "text", x: f + 3, y: e.axisY, text: u, color: w.ink, size: 12 });
  }
  for (const l of t.cards) {
    for (const x of l.dependsOn ?? []) {
      const u = e.bars.get(x), m = e.bars.get(l.id);
      if (!u || !m) continue;
      const p = s.get(x).critical && s.get(l.id).critical, y = t.cards.find((k) => k.id === x).label;
      n.push({
        t: "path",
        ...dn(u, m),
        color: p ? Pt : w.ink,
        width: p ? 2 : 1.5,
        unlink: { cardId: l.id, waitsOn: x, label: `Remove the link: ${l.label} waits on ${y}` }
      });
    }
    const f = s.get(l.id), g = e.bars.get(l.id);
    if (a) {
      const x = t.hiring.bands.find((p) => p.id === l.band), u = g.x + g.width, m = e.x0 + r * e.dayW;
      m > u && n.push({ t: "rect", x: u, y: g.y + g.height / 2 - 3, w: m - u, h: 6, rx: 3, color: w.bar, opacity: 0.45 }), n.push({
        t: "text",
        x: e.narrow ? 8 : Math.min(u + 6, m - 120),
        y: e.narrow ? g.y - 6 : g.y + g.height / 2 - 6,
        text: (e.narrow ? l.label + " · " : "") + "starts " + A(H(c.origin, Zt(t, l.id))) + (x ? " · " + E(x.monthly, t.hiring.currency) + "/mo" : ""),
        color: w.ink,
        size: 12,
        role: "start-" + l.id
      });
      continue;
    }
    e.narrow && n.push({ t: "text", x: 8, y: g.y - 6, text: `${l.label} · ${l.duration}d`, color: w.ink, size: 13, bold: f.critical }), f.critical || n.push({ t: "text", x: g.x + g.width + (e.narrow ? 48 : 24), y: g.y + g.height / 2 + 4, text: "+" + f.slack + "d", color: w.ink, size: 12, role: "slack-" + l.id });
  }
  if (!(a && e.narrow)) for (const l of t.cards) {
    if (!e.narrow && i.focus !== l.id) continue;
    const f = e.bars.get(l.id), g = f.y + 6, x = f.height - 12, [u, m] = e.narrow ? [f.x - 10, f.x + f.width + 4] : [f.x + 3, f.x + f.width - 9], p = e.narrow ? 0.55 : 0.8;
    n.push(
      { t: "rect", x: u, y: g, w: 6, h: x, rx: 3, color: w.ink, opacity: p, role: "grip-start-" + l.id },
      { t: "rect", x: m, y: g, w: 6, h: x, rx: 3, color: w.ink, opacity: p, role: "grip-end-" + l.id }
    );
  }
  if (a) {
    const l = qt(t), f = t.behaviour?.rules.find((u) => u.on && u.kind === "deadline"), g = f && f.kind === "deadline" && l < f.floor;
    n.push({
      t: "text",
      x: e.narrow ? 8 : e.x0,
      y: e.narrow ? 18 : 20,
      text: "Runway with these hires: " + Qt(l),
      color: g || i.refused ? w.refuse : w.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const x = t.hiring.funding;
    if (x && x.day <= r) {
      const u = e.x0 + x.day * e.dayW;
      n.push({ t: "line", x1: u, y1: 26, x2: u, y2: e.height - 8, color: w.accept, width: 2, dash: "6 4" }), e.narrow || n.push({ t: "rect", x: u - 4, y: 26, w: 8, h: 18, rx: 4, color: w.accept }), n.push({ t: "text", x: Math.max(u + 8, e.narrow ? 8 : e.x0 + 330), y: e.narrow ? 40 : 20, text: "Round +" + E(x.amount, t.hiring.currency) + " · " + A(H(c.origin, x.day)), color: w.accept, size: 12, bold: !0 });
    }
    if (e.narrow && n.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: w.ink, size: 12 }), i.clamp) {
      const u = e.parts.find((m) => m.name === i.clamp.name);
      u && n.push(...wt(e, n, i.clamp.text, u, i.view));
    }
    return n;
  }
  const o = e.x0 + t.launch.day * e.dayW;
  n.push({ t: "line", x1: o, y1: e.narrow ? 112 : 26, x2: o, y2: e.height - 8, color: w.launch, width: 2, dash: "6 4" }), n.push({ t: "rect", x: o - 4, y: e.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: w.launch });
  const h = ot(t), d = Math.max(0, ...[...s.values()].map((l) => l.to));
  if (n.push({
    t: "text",
    x: e.narrow ? 8 : e.x0,
    y: e.narrow ? 18 : 20,
    text: c ? "Done " + nt(t, Math.ceil(d) - 1) + " · " + Et(t) + " " + nt(t, t.launch.day) : `Done day ${h} · launch day ${t.launch.day}`,
    color: i.refused ? w.refuse : w.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const l = e.parts.find((f) => f.name === i.clamp.name);
    l && n.push(...wt(e, n, i.clamp.text, l, i.view));
  }
  return n;
}
const G = 13, yt = 16, _t = (t, i) => t * (i ? 0.64 : 0.6), fn = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function xn(t) {
  const i = t.size ?? 13, e = t.text.length * _t(i, t.bold);
  return { x: t.anchor === "end" ? t.x - e : t.anchor === "middle" ? t.x - e / 2 : t.x, y: t.y - i, w: e, h: i * 1.3 };
}
function gn(t, i) {
  const e = [];
  for (const a of t.split(/\s+/).filter(Boolean)) {
    const s = e.at(-1);
    s !== void 0 && s.length + 1 + a.length <= i ? e[e.length - 1] = s + " " + a : e.push(a);
  }
  return e;
}
let X = null;
function wt(t, i, e, a, s) {
  const r = [...t.bars.values()].map((p) => ({ x: p.x - 4, y: p.y - 3, w: p.width + 8, h: p.height + 6 }));
  for (const p of i)
    p.t === "text" ? r.push(xn(p)) : p.t === "rect" && r.push({ x: p.x - 2, y: p.y - 2, w: p.w + 4, h: p.h + 4 });
  let c = t.narrow ? 6 : t.x0 + 2, n = t.width - 4, o = t.gridTop + 2, h = t.height - 6;
  s && Math.min(n, s.x + s.width - 8) - Math.max(c, s.x + 8) >= 160 && (c = Math.max(c, s.x + 8), n = Math.min(n, s.x + s.width - 8), Math.min(h, s.y + s.height - 8) - Math.max(o, s.y + 8) >= 40 && (o = Math.max(o, s.y + 8), h = Math.min(h, s.y + s.height - 8)));
  const d = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, l = JSON.stringify([e, d, c, n, o, h, r.map((p) => [p.x, p.y, p.w, p.h].map(Math.round))]);
  if (X?.key === l) return X.shapes;
  const f = _t(G, !0), g = Math.floor((n - c) / f), x = /* @__PURE__ */ new Map();
  for (const p of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const y = gn(e, Math.max(8, Math.floor(g * p)));
    y.length <= 4 && x.set(y.join(`
`), y);
  }
  let u = null;
  for (const p of x.values()) {
    const y = Math.max(...p.map((v) => v.length)) * f, k = p.length * yt + 2;
    if (!(y > n - c))
      for (let v = o; v + k <= h; v += 3)
        for (let M = c; M + y <= n; M += 6) {
          const S = { x: M, y: v, w: y, h: k }, $ = Math.max(S.x - d.x, 0, d.x - (S.x + S.w)), D = Math.max(S.y - d.y, 0, d.y - (S.y + S.h)), F = Math.hypot($, D) + (p.length - 1) * 24;
          u && F >= u.score || r.every((V) => fn(S, V)) && (u = { box: S, lines: p, score: F });
        }
  }
  const m = u ? [{ t: "text", x: u.box.x, y: u.box.y + G - 1, text: e, lines: u.lines, lineHeight: yt, color: w.refuse, size: G, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: e,
    color: w.refuse,
    size: G,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return X = { key: l, shapes: m }, m;
}
const _ = (t, i = 1, e) => {
  const a = (r, c) => Math.round(r / c) * c, s = { ...t, cards: t.cards.map((r) => {
    const c = r.id === e ? i : 1, n = { ...r, duration: Math.max(c, a(r.duration, c)), lag: Math.max(0, a(r.lag ?? 0, c)) };
    return n.lag || delete n.lag, n;
  }) };
  return t.launch && (s.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (s.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), s;
}, tt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function pn(t, i, e) {
  if (e !== "l" && e !== "L") return null;
  const a = /^card-(.+)$/.exec(i), s = a && t.cards.find((n) => n.id === a[1]);
  if (!s) return null;
  const r = (n) => t.cards.find((o) => o.id === n)?.label ?? n, c = [
    ...At(t, s.id).map((n) => ({
      said: `${s.label} waits on ${r(n)}`,
      edits: [{ kind: "link_tasks", card: { id: s.id }, waitsOn: { id: n } }]
    })),
    ...(s.dependsOn ?? []).map((n) => ({
      said: `${s.label} stops waiting on ${r(n)}`,
      edits: [{ kind: "unlink_tasks", card: { id: s.id }, waitsOn: { id: n } }]
    }))
  ];
  return c.length ? c : `${s.label} has no task it can wait on.`;
}
function mn(t, i, { key: e, shiftKey: a }) {
  if (e !== "ArrowLeft" && e !== "ArrowRight") return null;
  const s = (e === "ArrowLeft" ? -1 : 1) * q(t);
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(s) }];
  if (i === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(s) * 7 }];
  const r = J(i), c = r !== null && t.cards.find((h) => h.id === r);
  if (c) return [{ kind: "set_task", card: { id: c.id }, duration: c.duration - s, lag: (c.lag ?? 0) + s }];
  const n = /^(card|handle)-(.+)$/.exec(i), o = n && t.cards.find((h) => h.id === n[2]);
  return o ? a || n[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + s }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + s }] : null;
}
const st = {
  laneCues: !1,
  notes(t, i, e, a) {
    return ct(st.places(t, i).parts, t, e, a);
  },
  editsBetween: lt,
  label: Rt,
  places(t, i) {
    const e = hn(t, W(t, i), (a) => {
      const s = t.cards.filter((c) => c.laneId === a), r = I(t);
      return t.kind === "hiring-plan" ? s.length + (s.length === 1 ? " hire" : " hires") : `${s.length} ${s.length === 1 ? "task" : "tasks"} · ${s.filter((c) => r.get(c.id).critical).length} on the critical path`;
    });
    return { parts: e.parts, width: e.width, height: e.height };
  },
  layer: (t) => rt(t, un),
  chooser(t, i, e, a = {}) {
    const s = t.cards.findIndex((r) => r.id === i);
    return s < 0 ? null : t.kind === "hiring-plan" && a.narrow ? () => t : (tt(t) ? wn : vn)(t, i, s, At(t, i), e, a);
  },
  refusalAt(t, i, e, a, s) {
    const r = W(t, s);
    for (const h of t.cards) {
      if (h.id === i || !Q(r.bars.get(h.id), a)) continue;
      const d = Lt(t, i, h.id);
      return d ? { laneId: h.laneId, reason: d } : null;
    }
    const c = t.cards.find((h) => h.id === i), n = (c.lag ?? 0) + Math.round((a.x - e.x - r.bars.get(i).x) / r.dayW);
    if (tt(t)) {
      const h = I(t).get(i), d = Math.round(h.from + (a.x - e.x - r.bars.get(i).x) / r.dayW), l = (c.lag ?? 0) + It(Ct(t)).idx(d) - h.start, f = q(t), g = Tt(t, i, { lag: Math.max(0, Math.round(l / f) * f) });
      return typeof g == "string" ? { laneId: c.laneId, reason: g, lands: !0 } : null;
    }
    const o = et(t, { cardId: i, field: "lag" });
    return n > o.max ? { laneId: c.laneId, reason: it(j(t, { cardId: i, field: "lag" }, n), i) ?? o.reasons.max } : null;
  },
  handleDrag(t, i, e, a) {
    const s = W(t, a), r = (o) => N(W(o, a).parts);
    if (t.kind === "hiring-plan" && a.narrow) return null;
    const c = J(i);
    if (c !== null) return t.cards.some((o) => o.id === c) ? kt(t, c, "start", e, s, i) : null;
    const n = i.slice(7);
    if (t.cards.some((o) => o.id === n)) return kt(t, n, "end", e, s, i);
    if (tt(t)) return kn(t, i, e, a, s, r);
    if (i === "handle-launch") {
      const o = et(t, { field: "day" }), h = O(t, i, e, r, (d, l) => d.vary(l, U("launch", "day"), { constraint: (f) => [Y(f.launch.day, ot(f) - 1e-3), Z(f.launch.day, 120)] }).onDrop((f) => _(f)));
      return (d) => {
        const l = Math.round((d.x - e.x + 22 - s.x0) / s.dayW), f = h?.(d) ?? j(t, { field: "day" }, Math.min(o.max, Math.max(o.min, l)));
        return l < o.min ? { next: f, clampedReason: o.reasons.min, refusal: it(j(t, { field: "day" }, Math.max(5, l))) ?? void 0 } : { next: f };
      };
    }
    return null;
  },
  keyEdit: mn,
  keyChoices: pn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, i) {
    const e = J(i) ?? /^(?:card|handle)-(.+)$/.exec(i)?.[1] ?? null;
    return e !== null && t.cards.some((a) => a.id === e) ? e : null;
  }
};
function kt(t, i, e, a, s, r) {
  const c = s.parts.find((n) => n.name === r);
  return c ? (n) => {
    const o = bt(t, i, e, (n.x - a.x - c.x) / s.dayW);
    return o.next ? { next: o.next, ...o.reason && { clampedReason: o.reason } } : { next: yn(t, i, o.values) ?? t, clampedReason: o.refusal, refusal: o.refusal };
  } : null;
}
function yn(t, i, e) {
  const a = t.cards.find((o) => o.id === i), s = q(t), r = a.lag ?? 0, c = a.duration ?? 1, n = (o, h) => Math.sign(h - o) * s;
  for (let o = { ...e }; o.lag !== r || o.duration !== c; ) {
    if (o.lag !== r) {
      const d = n(o.lag, r);
      o = { lag: o.lag + d, duration: o.duration - d };
    } else o = { lag: r, duration: o.duration + n(o.duration, c) };
    const h = Tt(t, i, { lag: o.lag, duration: o.duration });
    if (typeof h != "string") return h;
  }
  return null;
}
function wn(t, i, e, a, s, r) {
  const c = q(t), n = Gt(t), o = t.cards[e].laneId, h = (u) => {
    if (!n) return u;
    const m = Ut(t, u, /* @__PURE__ */ new Set([i]));
    return typeof m == "string" ? u : m;
  }, d = (u) => h(_(u, c, i)), l = (u) => N(W(h(u), r).parts, a.map((m) => "card-" + m)), g = (r.narrow ? [o] : t.lanes.map((u) => u.id)).flatMap((u) => jt(t, i, "lag", u === o ? void 0 : u).map((m) => ({ laneId: u, run: m })));
  if (!g.length) return () => t;
  const x = O(t, "card-" + i, s, l, (u, m) => {
    const p = u.closest(g.map(({ laneId: y, run: [k, v] }) => u.vary(
      { ...m, cards: m.cards.map((M, S) => S === e ? { ...M, laneId: y, lag: Math.min(v, Math.max(k, M.lag ?? 0)) } : M) },
      U("cards", e, "lag"),
      { constraint: (M) => [Y(M.cards[e].lag ?? 0, k - 0.49), Z(M.cards[e].lag ?? 0, v + 0.49)] }
    ))).withBranchTransition(100);
    return a.length ? u.closest(a.map((y) => u.dropTarget("target-" + y, $t(m, i, y)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(p).withBranchTransition(120).onDrop(d) : p.onDrop(d);
  });
  return x ? (u) => d(x(u)) : null;
}
function kn(t, i, e, a, s, r) {
  const c = (d, l) => {
    const f = [];
    for (const g of d) if (l(g)) {
      const x = f.at(-1);
      x && x[1] === g - (d[1] - d[0]) ? x[1] = g : f.push([g, g]);
    }
    return f;
  }, n = (d, l, f) => Array.from({ length: Math.floor((l - d) / f) + 1 }, (g, x) => d + x * f), o = (d, l, f, g, x) => O(t, i, e, r, (u, m) => u.closest(f.map(([p, y]) => u.vary(
    m,
    U(...d),
    { constraint: (k) => [Y(l(k), p - 0.49), Z(l(k), y + 0.49)] }
  ))).withBranchTransition(100).onDrop((p) => _(p, g, x))), h = (d, l, f, g) => (x) => {
    const u = l(x), m = f(u), p = d?.(x) ?? (m ? t : g(u));
    return m ? { next: p, clampedReason: m, refusal: m } : { next: p };
  };
  if (i === "handle-launch" || i === "handle-funding") {
    const d = i === "handle-launch", l = (m) => d ? j(t, { field: "day" }, m) : { ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: m } } }, f = (m) => d && (m < 5 || m > 120) ? "Launch day is a whole day from 5 to 120." : d && zt(t) && m < et(t, { field: "day" }).min ? it(l(m)) ?? "Every task ends by " + Et(t) + "." : Mn(t, l(m)), g = d ? n(5, 120, 1) : n(0, t.hiring.weeks * 7, 1), x = c(g, (m) => !f(m)), u = x.length ? o(d ? ["launch", "day"] : ["hiring", "funding", "day"], (m) => d ? m.launch.day : m.hiring.funding.day, x, 1) : null;
    return h(u, (m) => Math.round((m.x - e.x + 22 - s.x0) / s.dayW), f, l);
  }
  return null;
}
function Mn(t, i) {
  const e = t.behaviour ? Yt(t, i) : null;
  return e && "refused" in e ? e.refused.sentence : null;
}
function vn(t, i, e, a, s, r) {
  const c = t.launch.day, n = (h) => N(W(h, r).parts, a.map((d) => "card-" + d)), o = O(t, "card-" + i, s, n, (h, d) => {
    const l = r.narrow ? d.lanes.filter((g) => g.id === d.cards[e].laneId) : d.lanes, f = h.closest(l.map((g) => h.vary(
      { ...d, cards: d.cards.map((x, u) => u === e ? { ...x, laneId: g.id, lag: x.lag ?? 0 } : x) },
      U("cards", e, "lag"),
      { constraint: (x) => [Y(x.cards[e].lag ?? 0, -1e-3), Z(ot(x), c + 1e-3)] }
    )));
    return a.length ? h.closest(a.map((g) => h.dropTarget("target-" + g, $t(d, i, g)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(f).withBranchTransition(120).onDrop((g) => _(g)) : f.onDrop((g) => _(g));
  });
  return o ? (h) => _(o(h)) : null;
}
const R = 76;
function P(t, i = {}) {
  const e = !!i.narrow, a = [], s = t.lanes.map((o) => t.cards.filter((h) => h.laneId === o.id).length), r = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : B[o % B.length];
  let c, n;
  if (e) {
    c = Math.max(300, i.width ?? 390);
    let o = R;
    t.lanes.forEach((h, d) => {
      const l = 96 + (s[d] + 1) * 64;
      a.push({ name: "column-" + h.id, x: 2, y: o, width: c - 4, height: l, fill: L(r(d), 0.6), line: L(r(d), 0.1) });
      const f = (c - 16) * 0.36;
      a.push({ name: "lane-" + h.id, x: 8, y: o + 6, width: f, height: 36, text: h.label, fill: r(d), fontSize: 15 }), a.push({ name: "caption-" + h.id, x: 8 + f + 6, y: o + 6, width: c - 16 - f - 6, height: 56, text: ft(t, h.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((g) => g.laneId === h.id).forEach((g, x) => a.push({ name: "card-" + g.id, x: 8, y: o + 72 + x * 64, width: c - 16, height: 56, text: Mt(t, g.id), fontSize: 15 })), o += l + 10;
    }), n = o;
  } else {
    const d = 116 + (Math.max(...s) + 1) * 88;
    t.lanes.forEach((l, f) => {
      const g = f * 244;
      a.push({ name: "column-" + l.id, x: g + 2, y: R, width: 240, height: d, fill: L(r(f), 0.6), line: L(r(f), 0.1) }), a.push({ name: "lane-" + l.id, x: g + 8, y: R + 6, width: 228, height: 58, text: l.label, fill: r(f), fontSize: 16 }), a.push({ name: "caption-" + l.id, x: g + 8, y: R + 66, width: 228, height: 48, text: ft(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((x) => x.laneId === l.id).forEach((x, u) => a.push({ name: "card-" + x.id, x: g + 8, y: R + 116 + u * 88, width: 228, height: 76, text: Mt(t, x.id), fontSize: 15 }));
    }), c = t.lanes.length * 244, n = R + d;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(c, 520), height: 34, text: an(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: a, width: c, height: n };
}
function Mt(t, i) {
  const e = t.cards.find((a) => a.id === i);
  return e.amount === void 0 ? e.label + `
no amount yet` : e.label + `
` + E(e.amount, t.forecast.currency);
}
function Sn(t, i) {
  const { width: e } = P(t, i.layout), a = t.forecast.target, s = Wt(t), r = Math.max(a * 1.25, s), c = e - 8, n = s >= a;
  return [
    { t: "rect", x: 4, y: 42, w: c, h: 14, rx: 7, color: w.track },
    { t: "rect", x: 4, y: 42, w: c * s / r, h: 14, rx: 7, color: n ? w.accept : w.bar },
    { t: "line", x1: 4 + c * a / r, y1: 36, x2: 4 + c * a / r, y2: 62, color: w.ink, width: 2 },
    { t: "text", x: 4 + c * a / r, y: 72, text: "Target " + E(a, t.forecast.currency), color: w.ink, size: 14, anchor: "middle" }
  ];
}
const Ln = {
  laneCues: !0,
  places: (t, i) => P(t, i),
  notes: (t, i, e, a) => ct(P(t, i).parts, t, e, a),
  editsBetween: lt,
  layer: (t) => rt(t, Sn),
  chooser(t, i, e, a = {}) {
    const s = vt(t, i).map((r) => St(t, i, r.id));
    return s.length < 2 ? null : Ot(O(t, "card-" + i, e, (r) => N(P(r, a).parts), (r, c) => r.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c, { gapIn: 40, gapOut: 56 })), t, i, P(t, a).parts, s);
  },
  refusalAt(t, i, e, a, s) {
    const { parts: r } = P(t, s), c = t.cards.find((n) => n.id === i);
    for (const n of t.lanes) {
      if (n.id === c.laneId || !Q(r.find((h) => h.name === "column-" + n.id), a)) continue;
      const o = Xt(t, i, n.id);
      return o ? { laneId: n.id, reason: o } : null;
    }
    return null;
  },
  handleDrag: () => null
}, C = 48, K = 960, Bt = 900;
function z(t, i = {}) {
  const e = !!i.narrow, a = t.budget.total, s = [], r = [], c = t.lanes.map((h) => t.cards.filter((d) => d.laneId === h.id).length);
  let n, o;
  if (e) {
    n = Math.max(300, i.width ?? 390);
    let h = C;
    t.lanes.forEach((d, l) => {
      const f = Math.max(100 + (c[l] + 1) * 64, d.allocation / a * Bt);
      r.push({ laneId: d.id, start: h, size: f }), h += f;
    }), o = h + 8;
  } else {
    n = K;
    let h = 0;
    for (const d of t.lanes)
      r.push({ laneId: d.id, start: h, size: d.allocation / a * K }), h += d.allocation / a * K;
    o = C + 100 + (Math.max(...c) + 1) * 64;
  }
  return t.lanes.forEach((h, d) => {
    const { start: l, size: f } = r[d], g = B[d % B.length], x = e ? { x: 2, y: l + 1, width: n - 4, height: f - 2 } : { x: l + 1, y: C, width: Math.max(4, f - 2), height: o - C }, u = { x: x.x + 5, y: x.y, width: Math.max(10, x.width - 10) };
    s.push({ name: "column-" + h.id, ...x, fill: L(g, 0.6), line: L(g, 0.1) });
    const m = e ? u.width * 0.36 : u.width;
    if (s.push({ name: "lane-" + h.id, x: u.x, y: u.y + 6, width: m, height: 32, text: h.label, fill: g, fontSize: 15 }), s.push({
      name: "caption-" + h.id,
      x: e ? u.x + m + 6 : u.x,
      y: u.y + (e ? 6 : 40),
      width: e ? u.width - m - 6 : u.width,
      height: e ? 50 : 40,
      text: e ? xt(t, h.id).replace(" · ", `
`) : xt(t, h.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: e ? 15 : 12
    }), t.cards.filter((p) => p.laneId === h.id).forEach((p, y) => s.push({
      name: "card-" + p.id,
      x: u.x,
      y: u.y + 100 + y * 64,
      width: u.width,
      height: 56,
      text: p.label + `
` + E(p.amount, t.budget.currency),
      fontSize: 14
    })), d < t.lanes.length - 1) {
      const p = l + f;
      s.push(e ? { name: "handle-" + h.id, x: n - 96, y: p - 22, width: 88, height: 44 } : { name: "handle-" + h.id, x: p - 22, y: C - 6, width: 44, height: 48 });
    }
  }), { parts: s, width: n, height: o, segments: r, narrow: e };
}
function Cn(t, i) {
  const e = z(t, i.layout), a = t.budget.total, s = [{ t: "text", x: 4, y: 28, text: sn(t), color: w.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((r, c) => {
    const n = e.segments[c], o = r.allocation, h = en(t, r.id);
    if (e.narrow) {
      const d = n.start + 50, l = 8, f = e.width - 16;
      s.push({ t: "rect", x: l, y: d, w: f, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: l, y: d, w: f * h / o || 0, h: 10, rx: 5, color: w.bar }), r.floor !== void 0 && s.push({ t: "line", x1: l + f * r.floor / o, y1: d - 4, x2: l + f * r.floor / o, y2: d + 14, color: w.ink, width: 2 });
    } else {
      const d = K / a, l = C + 86;
      s.push({ t: "rect", x: n.start + 6, y: l, w: n.size - 12, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: n.start + 6, y: l, w: Math.max(0, (n.size - 12) * h / o || 0), h: 10, rx: 5, color: w.bar }), r.floor !== void 0 && s.push({ t: "line", x1: n.start + r.floor * d, y1: l - 6, x2: n.start + r.floor * d, y2: l + 16, color: w.ink, width: 2 }), r.cap !== void 0 && n.start + r.cap * d <= e.width && s.push({ t: "line", x1: n.start + r.cap * d, y1: l - 6, x2: n.start + r.cap * d, y2: l + 16, color: w.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const d = n.start + n.size;
      s.push(e.narrow ? { t: "line", x1: 2, y1: d, x2: e.width - 2, y2: d, color: w.ink, width: 2 } : { t: "line", x1: d, y1: C, x2: d, y2: e.height, color: w.ink, width: 2 }), s.push(e.narrow ? { t: "rect", x: e.width - 68, y: d - 4, w: 32, h: 8, rx: 4, color: w.ink } : { t: "rect", x: d - 4, y: C + 2, w: 8, h: 30, rx: 4, color: w.ink });
    }
  }), i.clamp) {
    const r = e.parts.find((c) => c.name === i.clamp.name);
    r && s.push({
      t: "text",
      x: e.narrow ? 8 : Math.min(Math.max(r.x + 22, 120), e.width - 120),
      y: e.narrow ? r.y + 8 : C - 12,
      text: i.clamp.text,
      color: w.refuse,
      size: 13,
      bold: !0,
      anchor: e.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const Tn = (t, i) => Math.round(t / i) * i, zn = {
  laneCues: !0,
  notes: (t, i, e, a) => ct(z(t, i).parts, t, e, a),
  editsBetween: lt,
  label: Rt,
  places(t, i) {
    const { parts: e, width: a, height: s } = z(t, i);
    return { parts: e, width: a, height: s };
  },
  layer: (t) => rt(t, Cn),
  chooser(t, i, e, a = {}) {
    const s = vt(t, i).map((r) => St(t, i, r.id));
    return s.length < 2 ? null : Ot(O(t, "card-" + i, e, (r) => N(z(r, a).parts), (r, c) => r.closest(s).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c)), t, i, z(t, a).parts, s);
  },
  refusalAt(t, i, e, a, s) {
    const { parts: r } = z(t, s), c = t.cards.find((n) => n.id === i);
    for (const n of t.lanes) {
      if (n.id === c.laneId || !Q(r.find((h) => h.name === "column-" + n.id), a)) continue;
      const o = nn(t, i, n.id);
      return o ? { laneId: n.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, i, e, a) {
    const s = i.slice(7), r = t.lanes.findIndex((x) => x.id === s), c = t.lanes[r + 1];
    if (r < 0 || !c) return null;
    const n = tn(t, { laneId: s }), o = t.budget.step, h = (x) => {
      const u = Math.min(n.max, Math.max(n.min, Tn(x, o)));
      return gt(t, c.id, s, u);
    }, d = z(t, a), l = d.narrow ? Bt / t.budget.total : K / t.budget.total, f = d.parts.find((x) => x.name === i), g = O(t, i, e, (x) => N(z(x, a).parts), (x) => x.varyFunc([0], ([u]) => gt(t, c.id, s, u), { constraint: (u) => [
      ...Kt([n.min, u.lanes[r].allocation - t.lanes[r].allocation, n.max])
    ] }));
    return (x) => {
      const m = (d.narrow ? x.y - e.y - f.y : x.x - e.x - f.x) / l, p = g?.(x), y = p ? p.lanes[r].allocation - t.lanes[r].allocation : m, k = { next: h(y) };
      return m > n.max + o / 2 ? { ...k, clampedReason: n.reasons.max } : m < n.min - o / 2 ? { ...k, clampedReason: n.reasons.min } : k;
    };
  },
  keyEdit(t, i, { key: e }) {
    if (e !== "ArrowLeft" && e !== "ArrowRight" && e !== "ArrowUp" && e !== "ArrowDown") return null;
    const a = /^handle-(.+)$/.exec(i)?.[1], s = t.lanes.findIndex((h) => h.id === a), r = t.lanes[s + 1];
    if (s < 0 || !r) return null;
    const c = e === "ArrowRight" || e === "ArrowDown", n = t.budget.step;
    return [c ? { kind: "shift_budget", from: { id: r.id }, to: { id: a }, amount: n } : { kind: "shift_budget", from: { id: a }, to: { id: r.id }, amount: n }];
  }
}, Nt = { "launch-plan": st, "hiring-plan": st, pipeline: Ln, budget: zn };
function Rn(t, i) {
  Nt[t] = i;
}
function Pn(t) {
  const i = Nt[t];
  if (!i && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return i;
}
function _n(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Dn as amountLimits,
  Fn as amountOf,
  We as amountRules,
  Hn as bandOf,
  Oe as behaviourEditsBetween,
  _n as boardLayoutFor,
  xt as budgetCaption,
  en as budgetCommitted,
  sn as budgetHeader,
  zn as budgetKit,
  z as budgetLayout,
  tn as budgetLimits,
  nn as budgetRefusal,
  Ae as budgetRules,
  Re as budgetShiftLimits,
  Pe as budgetShiftRefusal,
  je as byOrder,
  Gt as cascadeStops,
  Je as checkNest,
  Ue as checkNestMove,
  Yt as checkTime,
  Ct as clockOf,
  rt as createBoardLayer,
  Kn as currencyOf,
  In as dateName,
  Vn as dayFromWords,
  It as dayMap,
  nt as dayWords,
  bn as days,
  Gn as downstreamTasks,
  bt as dragTaskEdge,
  jn as edgeValues,
  Ye as extend,
  Jn as extendWorkshopEdits,
  Un as goLiveSample,
  Rt as handleLabel,
  O as headlessDrag,
  Yn as hireLagFor,
  Zt as hireStarts,
  Zn as hiringPlanRules,
  qn as hiringPlanSample,
  Ut as holdOthers,
  Q as inside,
  Ze as isOrderKey,
  ki as isOrgChart,
  H as isoAt,
  Qn as isoTime,
  Pn as kitFor,
  ot as launchFinish,
  zt as launchHard,
  Xn as launchIndex,
  W as launchLayout,
  Lt as launchLinkRefusal,
  At as launchLinkTargets,
  it as launchOverrun,
  te as launchPlanCaption,
  st as launchPlanKit,
  et as launchPlanLimits,
  ne as launchPlanRefusal,
  ee as launchPlanRules,
  ie as launchPlanSample,
  ae as launchTaskText,
  w as layerInk,
  jt as legalRuns,
  Et as lineWord,
  E as money,
  se as monthNames,
  qe as nestAlias,
  Qe as nestAreas,
  Mi as nestAxes,
  Xe as nestCardText,
  ti as nestDepth,
  ni as nestDrags,
  ei as nestEmptyDrop,
  ii as nestFamily,
  ai as nestKids,
  si as nestLegal,
  oi as nestMeasure,
  ri as nestMeasureWords,
  li as nestPlace,
  vi as nestQuadrants,
  ci as nestRoots,
  hi as nestRules,
  Si as nestScores,
  di as nestSentence,
  ui as nestSubtree,
  oe as nextCardId,
  re as nextMonday,
  le as noteNumbers,
  ut as offsetOf,
  fi as orderBetween,
  xi as orderKeys,
  ce as ownField,
  ct as partNotes,
  N as partsGeometry,
  Vt as pastTheLine,
  ft as pipelineCaption,
  Wt as pipelineForecast,
  an as pipelineGauge,
  Ln as pipelineKit,
  P as pipelineLayout,
  _e as pipelineLimits,
  Xt as pipelineRefusal,
  Be as pipelineRules,
  Ne as planBudgetMove,
  he as planDrags,
  de as planEdit,
  ue as planFixed,
  fe as planLaunchPlanMove,
  De as planPipelineMove,
  xe as planProblem,
  Fe as planSamples,
  ge as planWords,
  pe as presetRules,
  Li as quadrantOf,
  me as readClock,
  ye as readNoteNumbers,
  Rn as registerBoardKit,
  gi as registerNestPlus,
  we as renamedNumbers,
  mt as renderLayerShapes,
  He as restoreWorkshop,
  pi as roleOf,
  ke as runwayCap,
  Me as runwayHeader,
  qt as runwayMonths,
  Qt as runwayWords,
  Ke as sampleBudget,
  ve as sampleLaunchPlan,
  Ie as samplePipeline,
  I as scheduleLaunch,
  Ci as scoreBoard,
  Ti as scoresIn,
  gt as shiftBudget,
  A as shortDate,
  q as snapStep,
  Jt as startHandle,
  J as startHandleCard,
  mi as tidyKeys,
  Se as timeFamily,
  Le as timeRuleKindIds,
  Ce as timeSentence,
  L as tint,
  Tt as tryTask,
  Ve as validateBudget,
  Te as validateHiringPlan,
  ze as validateLaunchPlan,
  yi as validateNest,
  be as validatePipeline,
  dt as weekdayAt,
  Ee as weekendAt,
  $t as withLink,
  j as withTaskValue,
  lt as workshopEditsBetween
};
