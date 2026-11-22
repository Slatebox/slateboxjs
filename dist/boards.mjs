import { Vec2 as xt, getElementPositionCheap as Zt, translate as qt, dragSpecToBehavior as Xt, param as Wt, moreThan as At, lessThan as Ct, inOrder as Qt } from "./dragology.mjs";
import { laneColors as F, workshopDestinations as zt, workshopCandidate as Et } from "./workshop-model.mjs";
import { C as X, a4 as Q, a0 as G, e as Ot, m as _, q as et, a3 as at, S as bt, k as st, K as Pt, v as tn, x as Bt, a7 as U, A as Ft, M as nn, aa as en, ab as an, j as O, a5 as sn, ai as rn, D as on, Q as pt, T as ln, U as cn, a6 as hn, G as dn, B as un, ag as fn, ad as gn, ac as Nt, a1 as Dt, w as mt, s as z, aj as xn, ap as pn, aq as mn } from "./plans-CGWYYf2z.mjs";
import { a as le, d as ce, al as he, c as de, u as ue, at as fe, a9 as ge, O as xe, a8 as pe, $ as me, g as ye, ak as we, ao as ke, h as Me, i as ve, N as Se, a2 as Le, L as $e, J as Te, Z as _e, l as Re, V as We, P as Ae, f as Ce, n as ze, t as Ee, b as Oe, o as Pe, F as Be, Y as Fe, z as Ne, I as De, y as He, R as Ge, E as Ie, X as Ke, _ as Ve, as as Je, r as Ue, ar as je, an as Ye, W as Ze, ah as qe, af as Xe, ae as Qe, am as be, H as ti, p as ni } from "./plans-CGWYYf2z.mjs";
import j from "react";
import { withBudgetTotal as rt, pipelineForecast as ht, pipelineLimits as yn, pipelineRefusal as wn, pipelineCaption as yt, budgetLimits as kn, budgetRefusal as Mn, budgetCaption as wt, budgetTotalBounds as vn, shiftBudget as kt, budgetCommitted as Sn } from "./workshop-rules.mjs";
import { amountRules as ii, behaviourEditsBetween as ai, budgetRules as si, budgetShiftLimits as ri, budgetShiftRefusal as oi, budgetTotalFixed as li, pipelineRules as ci, planBudgetMove as hi, planPipelineMove as di, planSamples as ui, restoreWorkshop as fi, sampleBudget as gi, samplePipeline as xi, validateBudget as pi, validatePipeline as mi } from "./workshop-rules.mjs";
import { byOrder as wi, checkNest as ki, checkNestMove as Mi, extend as vi, isOrderKey as Si, nestAlias as Li, nestAreas as $i, nestCardText as Ti, nestDepth as _i, nestDrags as Ri, nestEmptyDrop as Wi, nestFamily as Ai, nestKids as Ci, nestLegal as zi, nestMeasure as Ei, nestMeasureWords as Oi, nestPlace as Pi, nestRoots as Bi, nestRules as Fi, nestSentence as Ni, nestSubtree as Di, orderBetween as Hi, orderKeys as Gi, registerNestPlus as Ii, roleOf as Ki, tidyKeys as Vi, validateNest as Ji } from "./workshop-nest.mjs";
import { isOrgChart as ji, nestAxes as Yi, nestQuadrants as Zi, nestScores as qi, quadrantOf as Xi, scoreBoard as Qi, scoresIn as bi } from "./workshop-nest-plus.mjs";
const m = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, ot = "http://www.w3.org/2000/svg", Mt = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function A(t, i, n) {
  const a = document.createElementNS(ot, t);
  for (const [s, c] of Object.entries(i)) a.setAttribute(s, String(c));
  return n?.fill && (a.setAttribute("fill", Mt(n.fill)), a.style.setProperty("fill", n.fill)), n?.stroke && (a.setAttribute("stroke", Mt(n.stroke)), a.style.setProperty("stroke", n.stroke)), a;
}
function vt(t, i, n, a) {
  const s = typeof document < "u" ? document.activeElement : null, c = s && t.contains(s) ? s.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const r = [];
  for (const e of i)
    if (e.t === "line")
      t.appendChild(A("line", {
        x1: e.x1,
        y1: e.y1,
        x2: e.x2,
        y2: e.y2,
        "stroke-width": e.width ?? 1,
        ...e.dash ? { "stroke-dasharray": e.dash } : {}
      }, { stroke: e.color }));
    else if (e.t === "rect")
      t.appendChild(A("rect", {
        x: e.x,
        y: e.y,
        width: Math.max(0, e.w),
        height: Math.max(0, e.h),
        rx: e.rx ?? 0,
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const o = A("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      e.lines && e.lines.length > 1 ? e.lines.forEach((l, u) => {
        const h = A("tspan", { x: e.x, dy: u ? e.lineHeight ?? Math.round((e.size ?? 13) * 1.25) : 0 });
        h.textContent = u < e.lines.length - 1 ? l + " " : l, o.appendChild(h);
      }) : o.textContent = e.text, t.appendChild(o);
    } else {
      if (e.unlink && n) {
        const { cardId: o, waitsOn: l, label: u } = e.unlink, h = l + ">" + o, x = a?.armed === h, d = A("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": h,
          "aria-label": x ? u + ". Tap again to remove it." : u,
          role: "button",
          tabindex: 0,
          ...x ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: x ? m.refuse : "transparent" });
        let g = !1;
        d.addEventListener("pointerdown", (f) => {
          f.stopPropagation(), g = f.pointerType === "touch" || f.pointerType === "pen";
        }), d.addEventListener("click", (f) => {
          if (f.stopPropagation(), g && a && a.armed !== h) {
            a.arm(h);
            return;
          }
          a?.arm(null), n(o, l);
        }), d.addEventListener("keydown", (f) => {
          f.key !== "Enter" && f.key !== " " || (f.preventDefault(), f.stopPropagation(), n(o, l));
        }), d.addEventListener("focus", () => {
          d.style.setProperty("stroke", m.accept), d.setAttribute("opacity", "0.35");
        }), d.addEventListener("blur", () => {
          x || (d.style.setProperty("stroke", "transparent"), d.removeAttribute("opacity"));
        }), t.appendChild(d), r.push(d);
      }
      if (t.appendChild(A("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: o, y: l, angle: u } = e.arrow;
        t.appendChild(A("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${o} ${l}) rotate(${u})`, "pointer-events": "none" }, { fill: e.color }));
      }
      if (e.unlink && a?.armed === e.unlink.waitsOn + ">" + e.unlink.cardId && e.arrow) {
        const o = A("text", {
          x: e.arrow.x - 6,
          y: e.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: m.refuse });
        o.textContent = "Tap again to remove this link", t.appendChild(o);
      }
    }
  c && r.find((e) => e.getAttribute("data-board-link") === c)?.focus({ preventScroll: !0 });
}
function dt(t, i) {
  const n = t?.canvas?.node, a = document.createElementNS(ot, "g");
  a.setAttribute("data-board-layer", ""), a.setAttribute("pointer-events", "none");
  const s = document.createElementNS(ot, "g");
  s.setAttribute("data-board-layer-top", ""), s.setAttribute("pointer-events", "none");
  let c = !1, r = null, e;
  const o = {
    armed: null,
    arm(u) {
      clearTimeout(e), o.armed = u, u && (e = setTimeout(() => o.arm(null), 5e3), r?.[2].announce?.("Link selected. Tap it again to remove it.")), r && l.draw(...r);
    }
  }, l = {
    draw(u, h, x) {
      if (c || !n) return;
      r = [u, h, x];
      const { origin: d } = x, g = i(h ?? u, x, u), f = (k) => k.t === "text" && (k.role === "clamp" || k.role === "refusal") || k.t === "rect" && !!k.role?.startsWith("grip-");
      for (const k of [a, s]) k.setAttribute("transform", `translate(${d.x} ${d.y})`);
      vt(a, g.filter((k) => !f(k)), x.onUnlink, o), vt(s, g.filter(f));
      const p = x.above && x.above.parentNode === n ? x.above : null, y = p ? p.nextSibling : n.firstChild;
      (a.parentNode !== n || a.previousSibling !== p) && n.insertBefore(a, y === a ? a.nextSibling : y), s.firstChild && n.lastChild !== s ? n.appendChild(s) : !s.firstChild && s.parentNode && s.remove();
    },
    destroy() {
      c = !0, clearTimeout(e), a.remove(), s.remove();
    }
  };
  return l;
}
function I(t, i = []) {
  const n = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return j.createElement(
    "g",
    null,
    ...n.map((a) => /* @__PURE__ */ j.createElement("g", { id: a.name, transform: qt(a.x, a.y) }, /* @__PURE__ */ j.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ j.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
  );
}
function K(t, i, n, a, s) {
  let c;
  const e = {
    draggable: (l) => (c ?? (c = l.d), a(l.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: xt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!Zt(e, t) || !c) return null;
  const o = Xt(s(c, t), e);
  return (l) => o({ pointer: xt(l.x, l.y) }).dropState;
}
const b = (t, i, n = 0) => !!t && i.x >= t.x - n && i.x <= t.x + t.width + n && i.y >= t.y - n && i.y <= t.y + t.height + n;
function Ht(t, i, n, a, s) {
  if (!t) return null;
  const c = i.cards.find((r) => r.id === n).laneId;
  return (r) => {
    const e = t(r);
    if (e !== i && JSON.stringify(e) !== JSON.stringify(i)) return e;
    const o = a.find((l) => l.name.startsWith("column-") && l.name !== "column-" + c && b(l, r));
    return o && s.find((l) => l.cards.find((u) => u.id === n).laneId === o.name.slice(7)) || e;
  };
}
function T(t, i) {
  const n = (a) => Math.round(parseInt(t.slice(a, a + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function V(t, i) {
  if (t.clock && i.clock && t.clock.origin !== i.clock.origin) {
    const e = bt(t, st(t.clock.origin, i.clock.origin));
    return [{ kind: "set_plan_start", start: i.clock.origin }, ...V(e, i)];
  }
  if (t.budget && i.budget && t.budget.total !== i.budget.total) {
    const e = (u) => JSON.stringify(u.lanes.map((h) => h.allocation)), o = ["end", "start"].map((u) => ({ edge: u, made: rt(t, i.budget.total, u) })).filter((u) => typeof u.made != "string"), l = o.find((u) => e(u.made) === e(i)) ?? o[0];
    if (l) return [{ kind: "set_budget_total", amount: i.budget.total, ...l.edge === "start" && { edge: "start" } }, ...V(l.made, i)];
  }
  const n = [];
  t.hiring && i.hiring && t.hiring.weeks !== i.hiring.weeks && n.push({ kind: "set_plan_weeks", weeks: i.hiring.weeks });
  const a = new Map(t.cards.map((e) => [e.id, e]));
  for (const e of i.cards) {
    const o = a.get(e.id), l = { id: e.id };
    if (!o) {
      n.push({
        kind: "add_card",
        lane: { id: e.laneId },
        label: e.label,
        ...e.duration !== void 0 && { duration: e.duration },
        ...e.lag && { lag: e.lag },
        ...e.dependsOn && { waitsOn: e.dependsOn.map((h) => ({ id: h })) },
        ...e.amount !== void 0 && { amount: e.amount }
      });
      continue;
    }
    o.label !== e.label && n.push({ kind: "rename_card", card: l, label: e.label });
    const u = n.length;
    for (const h of o.dependsOn ?? []) e.dependsOn?.includes(h) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: h } });
    for (const h of e.dependsOn ?? []) o.dependsOn?.includes(h) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: h } });
    o.laneId !== e.laneId && n.push({ kind: "move_card", card: l, lane: { id: e.laneId } }), (n.length > u && e.duration !== void 0 && n.slice(u).some((h) => h.kind !== "move_card") || o.duration !== e.duration || (o.lag ?? 0) !== (e.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: e.duration, lag: e.lag ?? 0 }), e.amount !== void 0 && o.amount !== e.amount && n.push({ kind: "set_amount", card: l, amount: e.amount });
  }
  for (const e of t.cards) i.cards.some((o) => o.id === e.id) || n.push({ kind: "remove_card", card: { id: e.id } });
  i.launch && t.launch?.day !== i.launch.day && n.push({ kind: "set_launch_day", day: i.launch.day }), i.hiring?.funding && t.hiring?.funding?.day !== i.hiring.funding.day && n.push({ kind: "set_funding", day: i.hiring.funding.day }), i.forecast && t.forecast?.target !== i.forecast.target && n.push({ kind: "set_target", amount: i.forecast.target });
  const s = i.lanes.map((e) => ({ id: e.id, by: (e.allocation ?? 0) - (t.lanes.find((o) => o.id === e.id)?.allocation ?? 0) })), c = s.filter((e) => e.by < 0), r = s.filter((e) => e.by > 0);
  for (const e of r)
    for (const o of c) {
      const l = Math.min(e.by, -o.by);
      l <= 0 || (n.push({ kind: "shift_budget", from: { id: o.id }, to: { id: e.id }, amount: l }), e.by -= l, o.by += l);
    }
  for (const e of i.lanes) {
    const o = t.lanes.find((l) => l.id === e.id);
    o && o.label !== e.label && n.push({ kind: "rename_lane", lane: { id: e.id }, label: e.label }), o && o.capacity !== e.capacity && n.push({ kind: "set_lane_capacity", lane: { id: e.id }, capacity: e.capacity ?? null });
  }
  return t.title !== i.title && n.push({ kind: "rename_workshop", title: i.title }), n;
}
function Ln(t) {
  const i = t.forecast?.currency;
  return `Forecast ${_(ht(t), i)} of ${_(t.forecast?.target ?? 0, i)}`;
}
function $n(t) {
  return `${Ot(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Gt(t, i) {
  return t.cards.filter((n) => Pt(t, i, n.id) === null).map((n) => n.id);
}
function Tn(t, i, n, a) {
  for (let s = i; s > 11; s--) {
    const c = Math.max(1, Math.floor(n / (s * 0.55)));
    if (t.split(`
`).reduce((e, o) => e + Math.max(1, Math.ceil(o.length / c)), 0) * s * 1.3 <= a) return s;
  }
  return Math.min(i, 11);
}
function ut(t, i, n, a) {
  const s = a.textColor ?? "#18302d", c = a.borderColor ?? "#667872", r = a.fontSize ?? 14;
  return t.map((e) => {
    const o = e.name.startsWith("handle-"), l = e.text ?? "";
    return { options: {
      id: e.name,
      text: l,
      name: i.cards.find((u) => "card-" + u.id === e.name)?.label ?? l,
      xPos: n.x + e.x,
      yPos: n.y + e.y,
      width: e.width,
      height: e.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${e.width} V ${e.height} H 0 Z`,
      backgroundColor: o ? "transparent" : e.fill ?? a.backgroundColor ?? "#fffdf6",
      foregroundColor: e.ink ?? s,
      borderColor: e.line ?? c,
      borderWidth: o ? 0 : e.lineWidth ?? 1,
      ...a.fontFamily ? { fontFamily: a.fontFamily } : {},
      fontSize: Tn(l, e.fontSize ?? r, e.width - 12, e.height - 6)
    }, relationships: { associations: [] } };
  });
}
function It(t, i) {
  const n = i.slice(7), a = X(i), s = a !== null && t.cards.find((e) => e.id === a);
  if (s) return `${s.label} start, ${Q(t, G(t).get(s.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const e = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${Ot(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${_(t.budget.step, t.budget.currency)}; ${e.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${et(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${et(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${et(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${at(t).charAt(0).toUpperCase() + at(t).slice(1)}, ${Q(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const c = t.cards.find((e) => e.id === n);
  if (c) return `${c.label} length, ${c.duration} days. Left and Right change it.`;
  const r = t.lanes.findIndex((e) => e.id === n);
  return r >= 0 && t.lanes[r + 1] ? `Divider between ${t.lanes[r].label} and ${t.lanes[r + 1].label}. Left and Right move money.` : null;
}
const Kt = "#c2410c", tt = "handle-_first", nt = "handle-_last", _n = 32, Rn = 44, Wn = (t, i) => t ? 0 : Math.min(22, Math.max(4, Math.floor(i / 3)));
function B(t, i = {}) {
  const n = !!i.narrow, a = t.kind === "hiring-plan", s = G(t), c = a ? t.hiring.weeks * 7 : sn(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), r = rn(t), e = [], o = /* @__PURE__ */ new Map(), l = n ? 8 : 168, u = n ? 88 : l + 40, h = n ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), x = i.dayWidth ? Math.max(h, Math.ceil(u + c * i.dayWidth)) : h, d = i.dayWidth ?? (x - u) / c, g = (w) => F[t.lanes.findIndex((M) => M.id === w) % F.length], f = (w, M) => {
    const v = t.cards.find((W) => W.id === w), S = s.get(w), L = { x: l + S.from * d, y: M, width: (S.to - S.from) * d, height: n ? Rn : _n };
    o.set(w, L);
    const N = r.has(w);
    if (e.push({
      name: "card-" + w,
      ...L,
      text: n ? "" : a ? v.label : `${v.label} · ${v.duration}d`,
      fill: N ? "#fde3d7" : n ? g(v.laneId) : a ? T(g(v.laneId), 0.45) : "#fffdf6",
      line: N || S.critical && !a ? Kt : "#667872",
      lineWidth: N || S.critical && !a ? 2.5 : 1,
      fontSize: 13
    }), !(a && n)) {
      const W = Wn(n, L.width), D = n ? 44 : 22, ft = L.y + L.height / 2 - 22, gt = n ? Math.max(-12, L.x - D) : L.x - D;
      e.push({ name: un(w), x: gt, y: ft, width: Math.max(24, L.x + W - gt), height: 44 }), e.push({ name: "handle-" + w, x: L.x + L.width - W, y: ft, width: W + D, height: 44 });
    }
  };
  let p, y, k;
  if (n) {
    const w = (x - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((M, v) => {
      const S = 8 + v * (w + 8);
      e.push({ name: "column-" + M.id, x: S, y: 30, width: w, height: 72, fill: T(g(M.id), 0.6), line: T(g(M.id), 0.1) }), e.push({ name: "lane-" + M.id, x: S + 4, y: 34, width: w - 8, height: 28, text: M.label, fill: g(M.id), fontSize: 14 }), e.push({ name: "caption-" + M.id, x: S + 4, y: 64, width: w - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), k = 124, y = 130, p = 138;
    for (const M of t.cards)
      f(M.id, p + 20), p += 64;
  } else {
    k = 48, y = 56, p = y;
    for (const w of t.lanes) {
      const M = t.cards.filter((S) => S.laneId === w.id), v = Math.max(92, M.length * 44 + 20);
      e.push({ name: "column-" + w.id, x: 0, y: p, width: x, height: v, fill: T(g(w.id), 0.65), line: T(g(w.id), 0.1) }), e.push({ name: "lane-" + w.id, x: 8, y: p + 8, width: l - 24, height: 32, text: w.label, fill: g(w.id), fontSize: 15 }), e.push({ name: "caption-" + w.id, x: 8, y: p + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((S, L) => f(S.id, p + 10 + L * 44)), p += v + 4;
    }
  }
  return a ? t.hiring.funding && !n && e.push({ name: "handle-funding", x: l + t.hiring.funding.day * d - 22, y: 4, width: 44, height: 44 }) : e.push({ name: "handle-launch", x: l + t.launch.day * d - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(a && n) && e.push({ name: tt, x: l - 22, y: n ? 104 : 8, width: 44, height: 44 }), a && !n && e.push({ name: nt, x: l + c * d - 22, y: 8, width: 44, height: 44 }), { parts: e, width: x, height: p + 8, narrow: n, x0: l, dayW: d, gridTop: y, axisY: k, bars: o };
}
function An(t, i, n) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = n(a.name.slice(8)));
  return i;
}
function Cn(t, i) {
  const n = t.x + t.width, a = Math.max(t.x + 4, n - 10), c = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, r = i.y + i.height / 2;
  return { d: `M ${a} ${c} V ${r} H ${i.x}`, arrow: { x: i.x, y: r, angle: 0 } };
}
function zn(t, i) {
  const n = B(t, i.layout), a = t.kind === "hiring-plan", s = G(t), c = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), r = Bt(t), e = [];
  if (r?.workdays)
    for (let h = 0; h < c; h++) mt(r.origin, h) === 6 && e.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: m.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (r && h.on && h.kind === "blackout") {
    const x = st(r.origin, h.start), d = st(r.origin, h.end) + 1, g = n.x0 + Math.max(0, x) * n.dayW, f = (Math.min(c, d) - Math.max(0, x)) * n.dayW;
    if (f <= 0) continue;
    e.push({ t: "rect", x: g, y: n.gridTop, w: f, h: n.height - 8 - n.gridTop, color: m.refuse, opacity: 0.12 });
    for (let p = g; p < g + f; p += 10) e.push({ t: "line", x1: p, y1: n.gridTop, x2: Math.min(g + f, p + 10), y2: n.gridTop + 10, color: m.refuse, width: 0.6 });
    e.push({ t: "text", x: g + 3, y: n.gridTop + 22, text: h.label + " · " + z(h.start) + "–" + z(h.end), color: m.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= c; h++) {
    const x = n.x0 + h * n.dayW, d = r ? mt(r.origin, h) === 1 : h % 7 === 0;
    if (!d && n.dayW < 6) continue;
    e.push({ t: "line", x1: x, y1: n.gridTop, x2: x, y2: n.height - 8, color: d ? m.week : m.faint, width: d ? 1 : 0.5 });
    const g = a && r && O(r.origin, h).slice(8) <= "07" && d, f = r ? a ? g ? z(O(r.origin, h)).replace(/^\d+ /, "") : "" : z(O(r.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    d && f && (!r || a || n.dayW * 7 > 44) && e.push({ t: "text", x: x + 3, y: n.axisY, text: f, color: m.ink, size: 12 });
  }
  for (const h of t.cards) {
    for (const g of h.dependsOn ?? []) {
      const f = n.bars.get(g), p = n.bars.get(h.id);
      if (!f || !p) continue;
      const y = s.get(g).critical && s.get(h.id).critical, k = t.cards.find((w) => w.id === g).label;
      e.push({
        t: "path",
        ...Cn(f, p),
        color: y ? Kt : m.ink,
        width: y ? 2 : 1.5,
        unlink: { cardId: h.id, waitsOn: g, label: `Remove the link: ${h.label} waits on ${k}` }
      });
    }
    const x = s.get(h.id), d = n.bars.get(h.id);
    if (a) {
      const g = t.hiring.bands.find((y) => y.id === h.band), f = d.x + d.width, p = n.x0 + c * n.dayW;
      p > f && e.push({ t: "rect", x: f, y: d.y + d.height / 2 - 3, w: p - f, h: 6, rx: 3, color: m.bar, opacity: 0.45 }), e.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(f + 6, p - 120),
        y: n.narrow ? d.y - 6 : d.y + d.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + z(O(r.origin, xn(t, h.id))) + (g ? " · " + _(g.monthly, t.hiring.currency) + "/mo" : ""),
        color: m.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    n.narrow && e.push({ t: "text", x: 8, y: d.y - 6, text: `${h.label} · ${h.duration}d`, color: m.ink, size: 13, bold: x.critical }), x.critical || e.push({ t: "text", x: d.x + d.width + (n.narrow ? 48 : 24), y: d.y + d.height / 2 + 4, text: "+" + x.slack + "d", color: m.ink, size: 12, role: "slack-" + h.id });
  }
  if (r && !(a && n.narrow) && e.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: m.ink, opacity: 0.7, role: "edge-first" }), a && !n.narrow && e.push({ t: "rect", x: n.x0 + c * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: m.ink, opacity: 0.7, role: "edge-last" }), !(a && n.narrow)) for (const h of t.cards) {
    if (!n.narrow && i.focus !== h.id) continue;
    const x = n.bars.get(h.id), d = x.y + 6, g = x.height - 12, [f, p] = n.narrow ? [x.x - 10, x.x + x.width + 4] : [x.x + 3, x.x + x.width - 9], y = n.narrow ? 0.55 : 0.8;
    e.push(
      { t: "rect", x: f, y: d, w: 6, h: g, rx: 3, color: m.ink, opacity: y, role: "grip-start-" + h.id },
      { t: "rect", x: p, y: d, w: 6, h: g, rx: 3, color: m.ink, opacity: y, role: "grip-end-" + h.id }
    );
  }
  if (a) {
    const h = pn(t), x = t.behaviour?.rules.find((f) => f.on && f.kind === "deadline"), d = x && x.kind === "deadline" && h < x.floor;
    e.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + mn(h),
      color: d || i.refused ? m.refuse : m.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const g = t.hiring.funding;
    if (g && g.day <= c) {
      const f = n.x0 + g.day * n.dayW;
      e.push({ t: "line", x1: f, y1: 26, x2: f, y2: n.height - 8, color: m.accept, width: 2, dash: "6 4" }), n.narrow || e.push({ t: "rect", x: f - 4, y: 26, w: 8, h: 18, rx: 4, color: m.accept }), e.push({ t: "text", x: Math.max(f + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + _(g.amount, t.hiring.currency) + " · " + z(O(r.origin, g.day)), color: m.accept, size: 12, bold: !0 });
    }
    if (n.narrow && e.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: m.ink, size: 12 }), i.clamp) {
      const f = n.parts.find((p) => p.name === i.clamp.name);
      f && e.push(...Lt(n, e, i.clamp.text, f, i.view));
    }
    return e;
  }
  const o = n.x0 + t.launch.day * n.dayW;
  e.push({ t: "line", x1: o, y1: n.narrow ? 112 : 26, x2: o, y2: n.height - 8, color: m.launch, width: 2, dash: "6 4" }), e.push({ t: "rect", x: o - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: m.launch });
  const l = Dt(t), u = Math.max(0, ...[...s.values()].map((h) => h.to));
  if (e.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: r ? "Done " + Q(t, Math.ceil(u) - 1) + " · " + at(t) + " " + Q(t, t.launch.day) : `Done day ${l} · launch day ${t.launch.day}`,
    color: i.refused ? m.refuse : m.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const h = n.parts.find((x) => x.name === i.clamp.name);
    h && e.push(...Lt(n, e, i.clamp.text, h, i.view));
  }
  return e;
}
const Y = 13, St = 16, Vt = (t, i) => t * (i ? 0.64 : 0.6), En = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function On(t) {
  const i = t.size ?? 13, n = t.text.length * Vt(i, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - i, w: n, h: i * 1.3 };
}
function Pn(t, i) {
  const n = [];
  for (const a of t.split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= i ? n[n.length - 1] = s + " " + a : n.push(a);
  }
  return n;
}
let it = null;
function Lt(t, i, n, a, s) {
  const c = [...t.bars.values()].map((y) => ({ x: y.x - 4, y: y.y - 3, w: y.width + 8, h: y.height + 6 }));
  for (const y of i)
    y.t === "text" ? c.push(On(y)) : y.t === "rect" && c.push({ x: y.x - 2, y: y.y - 2, w: y.w + 4, h: y.h + 4 });
  let r = t.narrow ? 6 : t.x0 + 2, e = t.width - 4, o = t.gridTop + 2, l = t.height - 6;
  s && Math.min(e, s.x + s.width - 8) - Math.max(r, s.x + 8) >= 160 && (r = Math.max(r, s.x + 8), e = Math.min(e, s.x + s.width - 8), Math.min(l, s.y + s.height - 8) - Math.max(o, s.y + 8) >= 40 && (o = Math.max(o, s.y + 8), l = Math.min(l, s.y + s.height - 8)));
  const u = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, h = JSON.stringify([n, u, r, e, o, l, c.map((y) => [y.x, y.y, y.w, y.h].map(Math.round))]);
  if (it?.key === h) return it.shapes;
  const x = Vt(Y, !0), d = Math.floor((e - r) / x), g = /* @__PURE__ */ new Map();
  for (const y of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const k = Pn(n, Math.max(8, Math.floor(d * y)));
    k.length <= 4 && g.set(k.join(`
`), k);
  }
  let f = null;
  for (const y of g.values()) {
    const k = Math.max(...y.map((M) => M.length)) * x, w = y.length * St + 2;
    if (!(k > e - r))
      for (let M = o; M + w <= l; M += 3)
        for (let v = r; v + k <= e; v += 6) {
          const S = { x: v, y: M, w: k, h: w }, L = Math.max(S.x - u.x, 0, u.x - (S.x + S.w)), N = Math.max(S.y - u.y, 0, u.y - (S.y + S.h)), W = Math.hypot(L, N) + (y.length - 1) * 24;
          f && W >= f.score || c.every((D) => En(S, D)) && (f = { box: S, lines: y, score: W });
        }
  }
  const p = f ? [{ t: "text", x: f.box.x, y: f.box.y + Y - 1, text: n, lines: f.lines, lineHeight: St, color: m.refuse, size: Y, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: n,
    color: m.refuse,
    size: Y,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return it = { key: h, shapes: p }, p;
}
const Z = (t, i = 1, n) => {
  const a = (c, r) => Math.round(c / r) * r, s = { ...t, cards: t.cards.map((c) => {
    const r = c.id === n ? i : 1, e = { ...c, duration: Math.max(r, a(c.duration, r)), lag: Math.max(0, a(c.lag ?? 0, r)) };
    return e.lag || delete e.lag, e;
  }) };
  return t.launch && (s.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (s.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), s;
}, $t = (t) => !!t.behaviour || t.kind === "hiring-plan";
function Bn(t, i, n) {
  if (n !== "l" && n !== "L") return null;
  const a = /^card-(.+)$/.exec(i), s = a && t.cards.find((e) => e.id === a[1]);
  if (!s) return null;
  const c = (e) => t.cards.find((o) => o.id === e)?.label ?? e, r = [
    ...Gt(t, s.id).map((e) => ({
      said: `${s.label} waits on ${c(e)}`,
      edits: [{ kind: "link_tasks", card: { id: s.id }, waitsOn: { id: e } }]
    })),
    ...(s.dependsOn ?? []).map((e) => ({
      said: `${s.label} stops waiting on ${c(e)}`,
      edits: [{ kind: "unlink_tasks", card: { id: s.id }, waitsOn: { id: e } }]
    }))
  ];
  return r.length ? r : `${s.label} has no task it can wait on.`;
}
function Fn(t, i, { key: n, shiftKey: a }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = (n === "ArrowLeft" ? -1 : 1) * U(t);
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(s) }];
  if (i === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(s) * 7 }];
  if (i === tt && t.clock) return [{ kind: "set_plan_start", start: O(t.clock.origin, Math.sign(s) * (t.kind === "hiring-plan" || Math.abs(s) > 1 ? 7 : 1)) }];
  if (i === nt && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(s) }];
  const c = X(i), r = c !== null && t.cards.find((l) => l.id === c);
  if (r) return [{ kind: "set_task", card: { id: r.id }, duration: r.duration - s, lag: (r.lag ?? 0) + s }];
  const e = /^(card|handle)-(.+)$/.exec(i), o = e && t.cards.find((l) => l.id === e[2]);
  return o ? a || e[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + s }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + s }] : null;
}
const lt = {
  laneCues: !1,
  notes(t, i, n, a) {
    return ut(lt.places(t, i).parts, t, n, a);
  },
  editsBetween: V,
  label: It,
  places(t, i) {
    const n = An(t, B(t, i), (a) => {
      const s = t.cards.filter((r) => r.laneId === a), c = G(t);
      return t.kind === "hiring-plan" ? s.length + (s.length === 1 ? " hire" : " hires") : `${s.length} ${s.length === 1 ? "task" : "tasks"} · ${s.filter((r) => c.get(r.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => dt(t, zn),
  chooser(t, i, n, a = {}) {
    const s = t.cards.findIndex((c) => c.id === i);
    return s < 0 ? null : t.kind === "hiring-plan" && a.narrow ? () => t : ($t(t) ? Dn : Jn)(t, i, s, Gt(t, i), n, a);
  },
  refusalAt(t, i, n, a, s) {
    const c = B(t, s);
    for (const l of t.cards) {
      if (l.id === i || !b(c.bars.get(l.id), a)) continue;
      const u = Pt(t, i, l.id);
      return u ? { laneId: l.laneId, reason: u } : null;
    }
    const r = t.cards.find((l) => l.id === i), e = (r.lag ?? 0) + Math.round((a.x - n.x - c.bars.get(i).x) / c.dayW);
    if ($t(t)) {
      const l = G(t).get(i), u = Math.round(l.from + (a.x - n.x - c.bars.get(i).x) / c.dayW), h = (r.lag ?? 0) + tn(Bt(t)).idx(u) - l.start, x = U(t), d = Ft(t, i, { lag: Math.max(0, Math.round(h / x) * x) });
      return typeof d == "string" ? { laneId: r.laneId, reason: d, lands: !0 } : null;
    }
    const o = nn(t, { cardId: i, field: "lag" });
    return e > o.max ? { laneId: r.laneId, reason: en(an(t, { cardId: i, field: "lag" }, e), i) ?? o.reasons.max } : null;
  },
  handleDrag(t, i, n, a) {
    const s = B(t, a);
    if (t.kind === "hiring-plan" && a.narrow) return null;
    const c = X(i);
    if (c !== null) return t.cards.some((e) => e.id === c) ? Tt(t, c, "start", n, s, i) : null;
    const r = i.slice(7);
    return t.cards.some((e) => e.id === r) ? Tt(t, r, "end", n, s, i) : i === "handle-launch" ? Hn(t, n, s, a) : i === "handle-funding" && t.hiring?.funding ? Kn(t, n, s) : i === tt && t.clock ? Gn(t, n, s, a) : i === nt && t.hiring ? In(t, n, s, a) : null;
  },
  keyEdit: Fn,
  keyChoices: Bn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, i) {
    const n = X(i) ?? /^(?:card|handle)-(.+)$/.exec(i)?.[1] ?? null;
    return n !== null && t.cards.some((a) => a.id === n) ? n : null;
  }
};
function Tt(t, i, n, a, s, c) {
  const r = s.parts.find((e) => e.name === c);
  return r ? (e) => {
    const o = on(t, i, n, (e.x - a.x - r.x) / s.dayW);
    return o.next ? { next: o.next, ...o.reason && { clampedReason: o.reason } } : { next: Nn(t, i, o.values) ?? t, clampedReason: o.refusal, refusal: o.refusal };
  } : null;
}
function Nn(t, i, n) {
  const a = t.cards.find((o) => o.id === i), s = U(t), c = a.lag ?? 0, r = a.duration ?? 1, e = (o, l) => Math.sign(l - o) * s;
  for (let o = { ...n }; o.lag !== c || o.duration !== r; ) {
    if (o.lag !== c) {
      const u = e(o.lag, c);
      o = { lag: o.lag + u, duration: o.duration - u };
    } else o = { lag: c, duration: o.duration + e(o.duration, r) };
    const l = Ft(t, i, { lag: o.lag, duration: o.duration });
    if (typeof l != "string") return l;
  }
  return null;
}
function Dn(t, i, n, a, s, c) {
  const r = U(t), e = hn(t), o = t.cards[n].laneId, l = (f) => {
    if (!e) return f;
    const p = gn(t, f, /* @__PURE__ */ new Set([i]));
    return typeof p == "string" ? f : p;
  }, u = (f) => l(Z(f, r, i)), h = (f) => I(B(l(f), c).parts, a.map((p) => "card-" + p)), d = (c.narrow ? [o] : t.lanes.map((f) => f.id)).flatMap((f) => dn(t, i, "lag", f === o ? void 0 : f).map((p) => ({ laneId: f, run: p })));
  if (!d.length) return () => t;
  const g = K(t, "card-" + i, s, h, (f, p) => {
    const y = f.closest(d.map(({ laneId: k, run: [w, M] }) => f.vary(
      { ...p, cards: p.cards.map((v, S) => S === n ? { ...v, laneId: k, lag: Math.min(M, Math.max(w, v.lag ?? 0)) } : v) },
      Wt("cards", n, "lag"),
      { constraint: (v) => [At(v.cards[n].lag ?? 0, w - 0.49), Ct(v.cards[n].lag ?? 0, M + 0.49)] }
    ))).withBranchTransition(100);
    return a.length ? f.closest(a.map((k) => f.dropTarget("target-" + k, Nt(p, i, k)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(y).withBranchTransition(120).onDrop(u) : y.onDrop(u);
  });
  return g ? (f) => u(g(f)) : null;
}
function Hn(t, i, n, a) {
  const s = n.parts.find((r) => r.name === "handle-launch");
  if (!s) return null;
  const c = { ...a, dayWidth: n.dayW };
  return (r) => {
    const e = pt(t, t.launch.day + Math.round((r.x - i.x - s.x) / n.dayW));
    if (e.next) return { next: e.next, layout: c, ...e.reason && { clampedReason: e.reason } };
    let o = t;
    const l = Math.sign(t.launch.day - e.day);
    for (let u = e.day + l; l && u !== t.launch.day; u += l) {
      const h = pt(t, u);
      if (h.next) {
        o = h.next;
        break;
      }
    }
    return { next: o, layout: c, clampedReason: e.refusal, refusal: e.refusal };
  };
}
function Gn(t, i, n, a) {
  const s = n.parts.find((r) => r.name === tt);
  if (!s) return null;
  const c = { ...a, dayWidth: n.dayW };
  return (r) => {
    const e = ln(t, (r.x - i.x - s.x) / n.dayW);
    return e.next ? { next: e.next, layout: c } : { next: t, layout: c, clampedReason: e.refusal, refusal: e.refusal };
  };
}
function In(t, i, n, a) {
  const s = n.parts.find((e) => e.name === nt);
  if (!s) return null;
  const c = { ...a, dayWidth: n.dayW }, r = t.hiring.weeks;
  return (e) => {
    const o = r + Math.round((e.x - i.x - s.x) / n.dayW / 7), l = cn(t, o);
    return l ? { next: t, layout: c, clampedReason: l, refusal: l } : { next: { ...t, hiring: { ...t.hiring, weeks: o } }, layout: c };
  };
}
function Kn(t, i, n) {
  const a = n.parts.find((o) => o.name === "handle-funding");
  if (!a) return null;
  const s = t.hiring.funding.day, c = U(t), r = t.hiring.weeks * 7, e = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const l = s + Math.round((o.x - i.x - a.x) / n.dayW / c) * c, u = Math.min(r, Math.max(0, l)), h = Vn(t, e(u));
    return h ? { next: t, clampedReason: h, refusal: h } : { next: e(u), ...u !== l && { clampedReason: u > l ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function Vn(t, i) {
  const n = t.behaviour ? fn(t, i) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function Jn(t, i, n, a, s, c) {
  const r = t.launch.day, e = (l) => I(B(l, c).parts, a.map((u) => "card-" + u)), o = K(t, "card-" + i, s, e, (l, u) => {
    const h = c.narrow ? u.lanes.filter((d) => d.id === u.cards[n].laneId) : u.lanes, x = l.closest(h.map((d) => l.vary(
      { ...u, cards: u.cards.map((g, f) => f === n ? { ...g, laneId: d.id, lag: g.lag ?? 0 } : g) },
      Wt("cards", n, "lag"),
      { constraint: (g) => [At(g.cards[n].lag ?? 0, -1e-3), Ct(Dt(g), r + 1e-3)] }
    )));
    return a.length ? l.closest(a.map((d) => l.dropTarget("target-" + d, Nt(u, i, d)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop((d) => Z(d)) : x.onDrop((d) => Z(d));
  });
  return o ? (l) => Z(o(l)) : null;
}
const E = 76;
function C(t, i = {}) {
  const n = !!i.narrow, a = [], s = t.lanes.map((o) => t.cards.filter((l) => l.laneId === o.id).length), c = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : F[o % F.length];
  let r, e;
  if (n) {
    r = Math.max(300, i.width ?? 390);
    let o = E;
    t.lanes.forEach((l, u) => {
      const h = 96 + (s[u] + 1) * 64;
      a.push({ name: "column-" + l.id, x: 2, y: o, width: r - 4, height: h, fill: T(c(u), 0.6), line: T(c(u), 0.1) });
      const x = (r - 16) * 0.36;
      a.push({ name: "lane-" + l.id, x: 8, y: o + 6, width: x, height: 36, text: l.label, fill: c(u), fontSize: 15 }), a.push({ name: "caption-" + l.id, x: 8 + x + 6, y: o + 6, width: r - 16 - x - 6, height: 56, text: yt(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((d) => d.laneId === l.id).forEach((d, g) => a.push({ name: "card-" + d.id, x: 8, y: o + 72 + g * 64, width: r - 16, height: 56, text: _t(t, d.id), fontSize: 15 })), o += h + 10;
    }), e = o;
  } else {
    const u = 116 + (Math.max(...s) + 1) * 88;
    t.lanes.forEach((h, x) => {
      const d = x * 244;
      a.push({ name: "column-" + h.id, x: d + 2, y: E, width: 240, height: u, fill: T(c(x), 0.6), line: T(c(x), 0.1) }), a.push({ name: "lane-" + h.id, x: d + 8, y: E + 6, width: 228, height: 58, text: h.label, fill: c(x), fontSize: 16 }), a.push({ name: "caption-" + h.id, x: d + 8, y: E + 66, width: 228, height: 48, text: yt(t, h.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((g) => g.laneId === h.id).forEach((g, f) => a.push({ name: "card-" + g.id, x: d + 8, y: E + 116 + f * 88, width: 228, height: 76, text: _t(t, g.id), fontSize: 15 }));
    }), r = t.lanes.length * 244, e = E + u;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: Ln(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), a.push({ name: "handle-target", x: H(t, i, r) - 22, y: 27, width: 44, height: 44 }), { parts: a, width: r, height: e };
}
const J = (t, i = {}) => i.gaugeScale ?? Math.max(t.forecast.target * 1.25, ht(t)), H = (t, i, n) => 4 + (n - 8) * t.forecast.target / J(t, i);
function ct(t) {
  for (const i of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (i * 100 >= t) return i;
  return 5e7;
}
function Un(t, i, { key: n }) {
  if (i !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = ct(J(t));
  return [{ kind: "set_target", amount: Math.max(a, t.forecast.target + (n === "ArrowLeft" ? -a : a)) }];
}
function _t(t, i) {
  const n = t.cards.find((a) => a.id === i);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + _(n.amount, t.forecast.currency);
}
function jn(t, i) {
  const { width: n } = C(t, i.layout), a = t.forecast.target, s = ht(t), c = J(t, i.layout), r = Math.max(n - 8, (n - 8) * a * 1.1 / c), e = s >= a;
  return [
    { t: "rect", x: 4, y: 42, w: r, h: 14, rx: 7, color: m.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * s / c, h: 14, rx: 7, color: e ? m.accept : m.bar },
    { t: "line", x1: H(t, i.layout, n), y1: 36, x2: H(t, i.layout, n), y2: 62, color: m.ink, width: 2 },
    { t: "rect", x: H(t, i.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: m.ink, role: "edge-target" },
    { t: "text", x: H(t, i.layout, n), y: 72, text: "Target " + _(a, t.forecast.currency), color: m.ink, size: 14, anchor: "middle" }
  ];
}
const Yn = {
  laneCues: !0,
  places: (t, i) => C(t, i),
  notes: (t, i, n, a) => ut(C(t, i).parts, t, n, a),
  editsBetween: V,
  layer: (t) => dt(t, jn),
  chooser(t, i, n, a = {}) {
    const s = zt(t, i).map((c) => Et(t, i, c.id));
    return s.length < 2 ? null : Ht(K(t, "card-" + i, n, (c) => I(C(c, a).parts), (c, r) => c.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r, { gapIn: 40, gapOut: 56 })), t, i, C(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: c } = C(t, s), r = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === r.laneId || !b(c.find((l) => l.name === "column-" + e.id), a)) continue;
      const o = wn(t, i, e.id);
      return o ? { laneId: e.id, reason: o } : null;
    }
    return null;
  },
  /**
   * The target's grip: dragged right it raises the target, left it lowers it, in the gauge's steps, on the scale the
   * drag started with (the gauge draws on past its end for a target held beyond it). One set_target on the drop.
   */
  handleDrag(t, i, n, a) {
    if (i !== "handle-target") return null;
    const s = C(t, a), c = s.parts.find((h) => h.name === "handle-target"), r = J(t, a), e = ct(r), o = r / (s.width - 8), l = { ...a, gaugeScale: r }, u = yn(t, { field: "target" });
    return (h) => {
      const x = t.forecast.target + Math.round((h.x - n.x - c.x) * o / e) * e, d = Math.min(u.max, Math.max(e, x));
      return { next: { ...t, forecast: { ...t.forecast, target: d } }, layout: l, ...d !== x && { clampedReason: d < x ? u.reasons.max : "A target is at least " + _(e, t.forecast.currency) + "." } };
    };
  },
  keyEdit: Un,
  label: (t, i) => i === "handle-target" ? "Target, " + _(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + _(ct(J(t)), t.forecast.currency) + "." : null
}, $ = 48, P = 960, q = 900;
function R(t, i = {}) {
  const n = !!i.narrow, a = t.budget.total, s = i.gaugeScale ?? a, c = i.gaugeAnchor === "start" ? s - a : 0, r = [], e = [], o = t.lanes.map((d) => t.cards.filter((g) => g.laneId === d.id).length);
  let l, u;
  if (n) {
    l = Math.max(300, i.width ?? 390);
    let d = $ + c / s * q;
    t.lanes.forEach((g, f) => {
      const p = Math.max(100 + (o[f] + 1) * 64, g.allocation / s * q);
      e.push({ laneId: g.id, start: d, size: p }), d += p;
    }), u = d + 8;
  } else {
    let d = c / s * P;
    for (const g of t.lanes)
      e.push({ laneId: g.id, start: d, size: g.allocation / s * P }), d += g.allocation / s * P;
    l = Math.max(P, d), u = $ + 100 + (Math.max(...o) + 1) * 64;
  }
  t.lanes.forEach((d, g) => {
    const { start: f, size: p } = e[g], y = F[g % F.length], k = n ? { x: 2, y: f + 1, width: l - 4, height: p - 2 } : { x: f + 1, y: $, width: Math.max(4, p - 2), height: u - $ }, w = { x: k.x + 5, y: k.y, width: Math.max(10, k.width - 10) };
    r.push({ name: "column-" + d.id, ...k, fill: T(y, 0.6), line: T(y, 0.1) });
    const M = n ? w.width * 0.36 : w.width;
    if (r.push({ name: "lane-" + d.id, x: w.x, y: w.y + 6, width: M, height: 32, text: d.label, fill: y, fontSize: 15 }), r.push({
      name: "caption-" + d.id,
      x: n ? w.x + M + 6 : w.x,
      y: w.y + (n ? 6 : 40),
      width: n ? w.width - M - 6 : w.width,
      height: n ? 50 : 40,
      text: n ? wt(t, d.id).replace(" · ", `
`) : wt(t, d.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((v) => v.laneId === d.id).forEach((v, S) => r.push({
      name: "card-" + v.id,
      x: w.x,
      y: w.y + 100 + S * 64,
      width: w.width,
      height: 56,
      text: v.label + `
` + _(v.amount, t.budget.currency),
      fontSize: 14
    })), g < t.lanes.length - 1) {
      const v = f + p;
      r.push(n ? { name: "handle-" + d.id, x: l - 96, y: v - 22, width: 88, height: 44 } : { name: "handle-" + d.id, x: v - 22, y: $ - 6, width: 44, height: 48 });
    }
  });
  const h = e[0], x = e.at(-1);
  for (const [d, g] of [[Jt, h.start], [Ut, x.start + x.size]])
    r.push(n ? { name: d, x: l - 96, y: g - 22, width: 88, height: 44 } : { name: d, x: g - 22, y: $ - 6, width: 44, height: 48 });
  return { parts: r, width: l, height: u, segments: e, narrow: n, k: (n ? q : P) / s };
}
const Jt = "handle-_first", Ut = "handle-_last", Rt = (t) => t === Jt ? "start" : t === Ut ? "end" : null;
function Zn(t, i) {
  const n = R(t, i.layout);
  t.budget.total;
  const a = [{ t: "text", x: 4, y: 28, text: $n(t), color: m.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((s, c) => {
    const r = n.segments[c], e = s.allocation, o = Sn(t, s.id);
    if (n.narrow) {
      const l = r.start + 50, u = 8, h = n.width - 16;
      a.push({ t: "rect", x: u, y: l, w: h, h: 10, rx: 5, color: m.track }), a.push({ t: "rect", x: u, y: l, w: h * o / e || 0, h: 10, rx: 5, color: m.bar }), s.floor !== void 0 && a.push({ t: "line", x1: u + h * s.floor / e, y1: l - 4, x2: u + h * s.floor / e, y2: l + 14, color: m.ink, width: 2 });
    } else {
      const l = n.k, u = $ + 86;
      a.push({ t: "rect", x: r.start + 6, y: u, w: r.size - 12, h: 10, rx: 5, color: m.track }), a.push({ t: "rect", x: r.start + 6, y: u, w: Math.max(0, (r.size - 12) * o / e || 0), h: 10, rx: 5, color: m.bar }), s.floor !== void 0 && a.push({ t: "line", x1: r.start + s.floor * l, y1: u - 6, x2: r.start + s.floor * l, y2: u + 16, color: m.ink, width: 2 }), s.cap !== void 0 && r.start + s.cap * l <= n.width && a.push({ t: "line", x1: r.start + s.cap * l, y1: u - 6, x2: r.start + s.cap * l, y2: u + 16, color: m.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const l = r.start + r.size;
      a.push(n.narrow ? { t: "line", x1: 2, y1: l, x2: n.width - 2, y2: l, color: m.ink, width: 2 } : { t: "line", x1: l, y1: $, x2: l, y2: n.height, color: m.ink, width: 2 }), a.push(n.narrow ? { t: "rect", x: n.width - 68, y: l - 4, w: 32, h: 8, rx: 4, color: m.ink } : { t: "rect", x: l - 4, y: $ + 2, w: 8, h: 30, rx: 4, color: m.ink });
    }
  });
  for (const s of [n.segments[0], n.segments.at(-1)]) {
    const c = s === n.segments[0] ? s.start : s.start + s.size;
    a.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: m.ink, opacity: 0.7, role: "edge-" + (s === n.segments[0] ? "first" : "last") } : { t: "rect", x: c - 4, y: $ + 2, w: 8, h: 30, rx: 4, color: m.ink, opacity: 0.7, role: "edge-" + (s === n.segments[0] ? "first" : "last") });
  }
  if (i.clamp) {
    const s = n.parts.find((c) => c.name === i.clamp.name);
    s && a.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(s.x + 22, 120), n.width - 120),
      y: n.narrow ? s.y + 8 : $ - 12,
      text: i.clamp.text,
      color: m.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return a;
}
const jt = (t, i) => Math.round(t / i) * i, qn = {
  laneCues: !0,
  notes: (t, i, n, a) => ut(R(t, i).parts, t, n, a),
  editsBetween: V,
  label: It,
  places(t, i) {
    const { parts: n, width: a, height: s } = R(t, i);
    return { parts: n, width: a, height: s };
  },
  layer: (t) => dt(t, Zn),
  chooser(t, i, n, a = {}) {
    const s = zt(t, i).map((c) => Et(t, i, c.id));
    return s.length < 2 ? null : Ht(K(t, "card-" + i, n, (c) => I(R(c, a).parts), (c, r) => c.closest(s).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r)), t, i, R(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: c } = R(t, s), r = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === r.laneId || !b(c.find((l) => l.name === "column-" + e.id), a)) continue;
      const o = Mn(t, i, e.id);
      return o ? { laneId: e.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, i, n, a) {
    const s = Rt(i);
    if (s) return Xn(t, s, i, n, a);
    const c = i.slice(7), r = t.lanes.findIndex((f) => f.id === c), e = t.lanes[r + 1];
    if (r < 0 || !e) return null;
    const o = kn(t, { laneId: c }), l = t.budget.step, u = (f) => {
      const p = Math.min(o.max, Math.max(o.min, jt(f, l)));
      return kt(t, e.id, c, p);
    }, h = R(t, a), x = h.narrow ? q / t.budget.total : P / t.budget.total, d = h.parts.find((f) => f.name === i), g = K(t, i, n, (f) => I(R(f, a).parts), (f) => f.varyFunc([0], ([p]) => kt(t, e.id, c, p), { constraint: (p) => [
      ...Qt([o.min, p.lanes[r].allocation - t.lanes[r].allocation, o.max])
    ] }));
    return (f) => {
      const y = (h.narrow ? f.y - n.y - d.y : f.x - n.x - d.x) / x, k = g?.(f), w = k ? k.lanes[r].allocation - t.lanes[r].allocation : y, M = { next: u(w) };
      return y > o.max + l / 2 ? { ...M, clampedReason: o.reasons.max } : y < o.min - l / 2 ? { ...M, clampedReason: o.reasons.min } : M;
    };
  },
  keyEdit(t, i, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const a = Rt(i);
    if (a) {
      const u = a === "start" ? n === "ArrowLeft" || n === "ArrowUp" : n === "ArrowRight" || n === "ArrowDown";
      return [{ kind: "set_budget_total", amount: t.budget.total + (u ? 1 : -1) * t.budget.step, edge: a }];
    }
    const s = /^handle-(.+)$/.exec(i)?.[1], c = t.lanes.findIndex((u) => u.id === s), r = t.lanes[c + 1];
    if (c < 0 || !r) return null;
    const e = n === "ArrowRight" || n === "ArrowDown", o = t.budget.step;
    return [e ? { kind: "shift_budget", from: { id: r.id }, to: { id: s }, amount: o } : { kind: "shift_budget", from: { id: s }, to: { id: r.id }, amount: o }];
  }
};
function Xn(t, i, n, a, s) {
  const c = R(t, s), r = c.parts.find((h) => h.name === n);
  if (!r) return null;
  const e = t.budget.total, o = t.budget.step, l = { ...s, gaugeScale: e, ...i === "start" && { gaugeAnchor: "start" } }, u = vn(t);
  return (h) => {
    const x = (c.narrow ? h.y - a.y - r.y : h.x - a.x - r.x) / c.k, d = e + jt(i === "end" ? x : -x, o), g = rt(t, d, i);
    if (typeof g != "string") return { next: g, layout: l };
    const f = rt(t, Math.min(u.max, Math.max(u.min, d)), i);
    return { next: typeof f == "string" ? t : f, layout: l, clampedReason: g, refusal: g };
  };
}
const Yt = { "launch-plan": lt, "hiring-plan": lt, pipeline: Yn, budget: qn };
function ie(t, i) {
  Yt[t] = i;
}
function ae(t) {
  const i = Yt[t];
  if (!i && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return i;
}
function se(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  le as amountLimits,
  ce as amountOf,
  ii as amountRules,
  he as bandOf,
  ai as behaviourEditsBetween,
  se as boardLayoutFor,
  wt as budgetCaption,
  Sn as budgetCommitted,
  $n as budgetHeader,
  qn as budgetKit,
  R as budgetLayout,
  kn as budgetLimits,
  Mn as budgetRefusal,
  si as budgetRules,
  ri as budgetShiftLimits,
  oi as budgetShiftRefusal,
  vn as budgetTotalBounds,
  li as budgetTotalFixed,
  wi as byOrder,
  hn as cascadeStops,
  ki as checkNest,
  Mi as checkNestMove,
  fn as checkTime,
  Bt as clockOf,
  dt as createBoardLayer,
  de as currencyOf,
  et as dateName,
  ue as dayFromWords,
  tn as dayMap,
  Q as dayWords,
  fe as days,
  ge as downstreamTasks,
  on as dragTaskEdge,
  xe as earliestLaunch,
  pe as edgeValues,
  vi as extend,
  me as extendWorkshopEdits,
  ye as goLiveSample,
  It as handleLabel,
  K as headlessDrag,
  we as hireLagFor,
  xn as hireStarts,
  ke as hiringPlanRules,
  Me as hiringPlanSample,
  gn as holdOthers,
  b as inside,
  Si as isOrderKey,
  ji as isOrgChart,
  O as isoAt,
  ve as isoTime,
  ae as kitFor,
  Se as launchDayOn,
  Dt as launchFinish,
  sn as launchHard,
  Le as launchIndex,
  B as launchLayout,
  Pt as launchLinkRefusal,
  Gt as launchLinkTargets,
  en as launchOverrun,
  $e as launchPlanCaption,
  lt as launchPlanKit,
  nn as launchPlanLimits,
  Te as launchPlanRefusal,
  _e as launchPlanRules,
  Re as launchPlanSample,
  We as launchTaskText,
  Ae as launchTooEarly,
  m as layerInk,
  dn as legalRuns,
  at as lineWord,
  _ as money,
  Ot as moneyExact,
  Ce as monthNames,
  pt as moveLaunch,
  ln as movePlanStart,
  Li as nestAlias,
  $i as nestAreas,
  Yi as nestAxes,
  Ti as nestCardText,
  _i as nestDepth,
  Ri as nestDrags,
  Wi as nestEmptyDrop,
  Ai as nestFamily,
  Ci as nestKids,
  zi as nestLegal,
  Ei as nestMeasure,
  Oi as nestMeasureWords,
  Pi as nestPlace,
  Zi as nestQuadrants,
  Bi as nestRoots,
  Fi as nestRules,
  qi as nestScores,
  Ni as nestSentence,
  Di as nestSubtree,
  ze as nextCardId,
  Ee as nextMonday,
  Oe as noteNumbers,
  st as offsetOf,
  Hi as orderBetween,
  Gi as orderKeys,
  Pe as ownField,
  ut as partNotes,
  I as partsGeometry,
  rn as pastTheLine,
  yt as pipelineCaption,
  ht as pipelineForecast,
  Ln as pipelineGauge,
  Yn as pipelineKit,
  C as pipelineLayout,
  yn as pipelineLimits,
  wn as pipelineRefusal,
  ci as pipelineRules,
  hi as planBudgetMove,
  Be as planDrags,
  Fe as planEdit,
  Ne as planFixed,
  De as planLaunchPlanMove,
  di as planPipelineMove,
  He as planProblem,
  ui as planSamples,
  Ge as planStartBy,
  cn as planWeeksProblem,
  Ie as planWords,
  Ke as presetRules,
  Xi as quadrantOf,
  Ve as readClock,
  Je as readNoteNumbers,
  ie as registerBoardKit,
  Ii as registerNestPlus,
  Ue as renamedNumbers,
  vt as renderLayerShapes,
  fi as restoreWorkshop,
  Ki as roleOf,
  je as runwayCap,
  Ye as runwayHeader,
  pn as runwayMonths,
  mn as runwayWords,
  gi as sampleBudget,
  Ze as sampleLaunchPlan,
  xi as samplePipeline,
  G as scheduleLaunch,
  Qi as scoreBoard,
  bi as scoresIn,
  kt as shiftBudget,
  z as shortDate,
  U as snapStep,
  un as startHandle,
  X as startHandleCard,
  Vi as tidyKeys,
  qe as timeFamily,
  Xe as timeRuleKindIds,
  Qe as timeSentence,
  T as tint,
  Ft as tryTask,
  pi as validateBudget,
  be as validateHiringPlan,
  ti as validateLaunchPlan,
  Ji as validateNest,
  mi as validatePipeline,
  mt as weekdayAt,
  ni as weekendAt,
  rt as withBudgetTotal,
  Nt as withLink,
  bt as withPlanStart,
  an as withTaskValue,
  V as workshopEditsBetween
};
