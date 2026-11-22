import { Vec2 as ft, getElementPositionCheap as Gt, translate as Vt, dragSpecToBehavior as jt, param as Tt, moreThan as $t, lessThan as Rt, inOrder as Jt } from "./dragology.mjs";
import { laneColors as B, workshopDestinations as Ct, workshopCandidate as Et } from "./workshop-model.mjs";
import { B as Z, a3 as q, $ as I, p as nt, a2 as it, R as Ut, j as at, m as T, J as _t, u as Yt, v as zt, a6 as j, z as At, L as Zt, a9 as qt, aa as Xt, f as O, a4 as Qt, ah as bt, C as tn, P as gt, S as nn, T as en, a5 as an, F as sn, A as rn, af as on, ac as ln, ab as Ot, a0 as Pt, w as xt, s as z, ai as cn, ao as hn, ap as dn } from "./plans-Cbjy_vCa.mjs";
import { a as ne, d as ee, ak as ie, c as ae, t as se, as as re, a8 as oe, N as le, a7 as ce, _ as he, g as de, aj as ue, an as fe, h as ge, i as xe, M as pe, a1 as me, K as ye, I as we, Y as ke, l as Me, U as ve, O as Se, e as Le, n as We, q as Te, b as $e, o as Re, E as Ce, X as Ee, y as _e, H as ze, x as Ae, Q as Oe, D as Pe, W as Be, Z as Fe, ar as Ne, r as De, aq as He, am as Ie, V as Ke, ag as Ge, ae as Ve, ad as je, al as Je, G as Ue, k as Ye } from "./plans-Cbjy_vCa.mjs";
import J from "react";
import { pipelineForecast as lt, pipelineLimits as un, pipelineRefusal as fn, pipelineCaption as pt, budgetLimits as gn, budgetRefusal as xn, budgetCaption as mt, shiftBudget as yt, budgetCommitted as pn } from "./workshop-rules.mjs";
import { amountRules as qe, behaviourEditsBetween as Xe, budgetRules as Qe, budgetShiftLimits as be, budgetShiftRefusal as ti, pipelineRules as ni, planBudgetMove as ei, planPipelineMove as ii, planSamples as ai, restoreWorkshop as si, sampleBudget as ri, samplePipeline as oi, validateBudget as li, validatePipeline as ci } from "./workshop-rules.mjs";
import { byOrder as di, checkNest as ui, checkNestMove as fi, extend as gi, isOrderKey as xi, nestAlias as pi, nestAreas as mi, nestCardText as yi, nestDepth as wi, nestDrags as ki, nestEmptyDrop as Mi, nestFamily as vi, nestKids as Si, nestLegal as Li, nestMeasure as Wi, nestMeasureWords as Ti, nestPlace as $i, nestRoots as Ri, nestRules as Ci, nestSentence as Ei, nestSubtree as _i, orderBetween as zi, orderKeys as Ai, registerNestPlus as Oi, roleOf as Pi, tidyKeys as Bi, validateNest as Fi } from "./workshop-nest.mjs";
import { isOrgChart as Di, nestAxes as Hi, nestQuadrants as Ii, nestScores as Ki, quadrantOf as Gi, scoreBoard as Vi, scoresIn as ji } from "./workshop-nest-plus.mjs";
const y = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, st = "http://www.w3.org/2000/svg", wt = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function C(t, i, n) {
  const a = document.createElementNS(st, t);
  for (const [s, r] of Object.entries(i)) a.setAttribute(s, String(r));
  return n?.fill && (a.setAttribute("fill", wt(n.fill)), a.style.setProperty("fill", n.fill)), n?.stroke && (a.setAttribute("stroke", wt(n.stroke)), a.style.setProperty("stroke", n.stroke)), a;
}
function kt(t, i, n, a) {
  const s = typeof document < "u" ? document.activeElement : null, r = s && t.contains(s) ? s.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const c = [];
  for (const e of i)
    if (e.t === "line")
      t.appendChild(C("line", {
        x1: e.x1,
        y1: e.y1,
        x2: e.x2,
        y2: e.y2,
        "stroke-width": e.width ?? 1,
        ...e.dash ? { "stroke-dasharray": e.dash } : {}
      }, { stroke: e.color }));
    else if (e.t === "rect")
      t.appendChild(C("rect", {
        x: e.x,
        y: e.y,
        width: Math.max(0, e.w),
        height: Math.max(0, e.h),
        rx: e.rx ?? 0,
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const o = C("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      e.lines && e.lines.length > 1 ? e.lines.forEach((l, d) => {
        const h = C("tspan", { x: e.x, dy: d ? e.lineHeight ?? Math.round((e.size ?? 13) * 1.25) : 0 });
        h.textContent = d < e.lines.length - 1 ? l + " " : l, o.appendChild(h);
      }) : o.textContent = e.text, t.appendChild(o);
    } else {
      if (e.unlink && n) {
        const { cardId: o, waitsOn: l, label: d } = e.unlink, h = l + ">" + o, g = a?.armed === h, f = C("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": h,
          "aria-label": g ? d + ". Tap again to remove it." : d,
          role: "button",
          tabindex: 0,
          ...g ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: g ? y.refuse : "transparent" });
        let x = !1;
        f.addEventListener("pointerdown", (u) => {
          u.stopPropagation(), x = u.pointerType === "touch" || u.pointerType === "pen";
        }), f.addEventListener("click", (u) => {
          if (u.stopPropagation(), x && a && a.armed !== h) {
            a.arm(h);
            return;
          }
          a?.arm(null), n(o, l);
        }), f.addEventListener("keydown", (u) => {
          u.key !== "Enter" && u.key !== " " || (u.preventDefault(), u.stopPropagation(), n(o, l));
        }), f.addEventListener("focus", () => {
          f.style.setProperty("stroke", y.accept), f.setAttribute("opacity", "0.35");
        }), f.addEventListener("blur", () => {
          g || (f.style.setProperty("stroke", "transparent"), f.removeAttribute("opacity"));
        }), t.appendChild(f), c.push(f);
      }
      if (t.appendChild(C("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: o, y: l, angle: d } = e.arrow;
        t.appendChild(C("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${o} ${l}) rotate(${d})`, "pointer-events": "none" }, { fill: e.color }));
      }
      if (e.unlink && a?.armed === e.unlink.waitsOn + ">" + e.unlink.cardId && e.arrow) {
        const o = C("text", {
          x: e.arrow.x - 6,
          y: e.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: y.refuse });
        o.textContent = "Tap again to remove this link", t.appendChild(o);
      }
    }
  r && c.find((e) => e.getAttribute("data-board-link") === r)?.focus({ preventScroll: !0 });
}
function ct(t, i) {
  const n = t?.canvas?.node, a = document.createElementNS(st, "g");
  a.setAttribute("data-board-layer", ""), a.setAttribute("pointer-events", "none");
  const s = document.createElementNS(st, "g");
  s.setAttribute("data-board-layer-top", ""), s.setAttribute("pointer-events", "none");
  let r = !1, c = null, e;
  const o = {
    armed: null,
    arm(d) {
      clearTimeout(e), o.armed = d, d && (e = setTimeout(() => o.arm(null), 5e3), c?.[2].announce?.("Link selected. Tap it again to remove it.")), c && l.draw(...c);
    }
  }, l = {
    draw(d, h, g) {
      if (r || !n) return;
      c = [d, h, g];
      const { origin: f } = g, x = i(h ?? d, g, d), u = (k) => k.t === "text" && (k.role === "clamp" || k.role === "refusal") || k.t === "rect" && !!k.role?.startsWith("grip-");
      for (const k of [a, s]) k.setAttribute("transform", `translate(${f.x} ${f.y})`);
      kt(a, x.filter((k) => !u(k)), g.onUnlink, o), kt(s, x.filter(u));
      const m = g.above && g.above.parentNode === n ? g.above : null, p = m ? m.nextSibling : n.firstChild;
      (a.parentNode !== n || a.previousSibling !== m) && n.insertBefore(a, p === a ? a.nextSibling : p), s.firstChild && n.lastChild !== s ? n.appendChild(s) : !s.firstChild && s.parentNode && s.remove();
    },
    destroy() {
      r = !0, clearTimeout(e), a.remove(), s.remove();
    }
  };
  return l;
}
function K(t, i = []) {
  const n = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return J.createElement(
    "g",
    null,
    ...n.map((a) => /* @__PURE__ */ J.createElement("g", { id: a.name, transform: Vt(a.x, a.y) }, /* @__PURE__ */ J.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ J.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
  );
}
function G(t, i, n, a, s) {
  let r;
  const e = {
    draggable: (l) => (r ?? (r = l.d), a(l.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: ft(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!Gt(e, t) || !r) return null;
  const o = jt(s(r, t), e);
  return (l) => o({ pointer: ft(l.x, l.y) }).dropState;
}
const X = (t, i, n = 0) => !!t && i.x >= t.x - n && i.x <= t.x + t.width + n && i.y >= t.y - n && i.y <= t.y + t.height + n;
function Bt(t, i, n, a, s) {
  if (!t) return null;
  const r = i.cards.find((c) => c.id === n).laneId;
  return (c) => {
    const e = t(c);
    if (e !== i && JSON.stringify(e) !== JSON.stringify(i)) return e;
    const o = a.find((l) => l.name.startsWith("column-") && l.name !== "column-" + r && X(l, c));
    return o && s.find((l) => l.cards.find((d) => d.id === n).laneId === o.name.slice(7)) || e;
  };
}
function W(t, i) {
  const n = (a) => Math.round(parseInt(t.slice(a, a + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function Q(t, i) {
  if (t.clock && i.clock && t.clock.origin !== i.clock.origin) {
    const e = Ut(t, at(t.clock.origin, i.clock.origin));
    return [{ kind: "set_plan_start", start: i.clock.origin }, ...Q(e, i)];
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
    const d = n.length;
    for (const h of o.dependsOn ?? []) e.dependsOn?.includes(h) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: h } });
    for (const h of e.dependsOn ?? []) o.dependsOn?.includes(h) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: h } });
    o.laneId !== e.laneId && n.push({ kind: "move_card", card: l, lane: { id: e.laneId } }), (n.length > d && e.duration !== void 0 && n.slice(d).some((h) => h.kind !== "move_card") || o.duration !== e.duration || (o.lag ?? 0) !== (e.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: e.duration, lag: e.lag ?? 0 }), e.amount !== void 0 && o.amount !== e.amount && n.push({ kind: "set_amount", card: l, amount: e.amount });
  }
  for (const e of t.cards) i.cards.some((o) => o.id === e.id) || n.push({ kind: "remove_card", card: { id: e.id } });
  i.launch && t.launch?.day !== i.launch.day && n.push({ kind: "set_launch_day", day: i.launch.day }), i.hiring?.funding && t.hiring?.funding?.day !== i.hiring.funding.day && n.push({ kind: "set_funding", day: i.hiring.funding.day }), i.forecast && t.forecast?.target !== i.forecast.target && n.push({ kind: "set_target", amount: i.forecast.target });
  const s = i.lanes.map((e) => ({ id: e.id, by: (e.allocation ?? 0) - (t.lanes.find((o) => o.id === e.id)?.allocation ?? 0) })), r = s.filter((e) => e.by < 0), c = s.filter((e) => e.by > 0);
  for (const e of c)
    for (const o of r) {
      const l = Math.min(e.by, -o.by);
      l <= 0 || (n.push({ kind: "shift_budget", from: { id: o.id }, to: { id: e.id }, amount: l }), e.by -= l, o.by += l);
    }
  for (const e of i.lanes) {
    const o = t.lanes.find((l) => l.id === e.id);
    o && o.label !== e.label && n.push({ kind: "rename_lane", lane: { id: e.id }, label: e.label }), o && o.capacity !== e.capacity && n.push({ kind: "set_lane_capacity", lane: { id: e.id }, capacity: e.capacity ?? null });
  }
  return t.title !== i.title && n.push({ kind: "rename_workshop", title: i.title }), n;
}
function mn(t) {
  const i = t.forecast?.currency;
  return `Forecast ${T(lt(t), i)} of ${T(t.forecast?.target ?? 0, i)}`;
}
function yn(t) {
  return `${T(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Ft(t, i) {
  return t.cards.filter((n) => _t(t, i, n.id) === null).map((n) => n.id);
}
function wn(t, i, n, a) {
  for (let s = i; s > 11; s--) {
    const r = Math.max(1, Math.floor(n / (s * 0.55)));
    if (t.split(`
`).reduce((e, o) => e + Math.max(1, Math.ceil(o.length / r)), 0) * s * 1.3 <= a) return s;
  }
  return Math.min(i, 11);
}
function ht(t, i, n, a) {
  const s = a.textColor ?? "#18302d", r = a.borderColor ?? "#667872", c = a.fontSize ?? 14;
  return t.map((e) => {
    const o = e.name.startsWith("handle-"), l = e.text ?? "";
    return { options: {
      id: e.name,
      text: l,
      name: i.cards.find((d) => "card-" + d.id === e.name)?.label ?? l,
      xPos: n.x + e.x,
      yPos: n.y + e.y,
      width: e.width,
      height: e.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${e.width} V ${e.height} H 0 Z`,
      backgroundColor: o ? "transparent" : e.fill ?? a.backgroundColor ?? "#fffdf6",
      foregroundColor: e.ink ?? s,
      borderColor: e.line ?? r,
      borderWidth: o ? 0 : e.lineWidth ?? 1,
      ...a.fontFamily ? { fontFamily: a.fontFamily } : {},
      fontSize: wn(l, e.fontSize ?? c, e.width - 12, e.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Nt(t, i) {
  const n = i.slice(7), a = Z(i), s = a !== null && t.cards.find((e) => e.id === a);
  if (s) return `${s.label} start, ${q(t, I(t).get(s.id).from)}. Left and Right move it; the end stays.`;
  if (n === "_first" && t.clock) return `First day, ${nt(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${nt(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${nt(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${it(t).charAt(0).toUpperCase() + it(t).slice(1)}, ${q(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const r = t.cards.find((e) => e.id === n);
  if (r) return `${r.label} length, ${r.duration} days. Left and Right change it.`;
  const c = t.lanes.findIndex((e) => e.id === n);
  return c >= 0 && t.lanes[c + 1] ? `Divider between ${t.lanes[c].label} and ${t.lanes[c + 1].label}. Left and Right move money.` : null;
}
const Dt = "#c2410c", b = "handle-_first", tt = "handle-_last", kn = 32, Mn = 44, vn = (t, i) => t ? 0 : Math.min(22, Math.max(4, Math.floor(i / 3)));
function P(t, i = {}) {
  const n = !!i.narrow, a = t.kind === "hiring-plan", s = I(t), r = a ? t.hiring.weeks * 7 : Qt(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), c = bt(t), e = [], o = /* @__PURE__ */ new Map(), l = n ? 8 : 168, d = n ? 88 : l + 40, h = n ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), g = i.dayWidth ? Math.max(h, Math.ceil(d + r * i.dayWidth)) : h, f = i.dayWidth ?? (g - d) / r, x = (w) => B[t.lanes.findIndex((M) => M.id === w) % B.length], u = (w, M) => {
    const S = t.cards.find((R) => R.id === w), v = s.get(w), L = { x: l + v.from * f, y: M, width: (v.to - v.from) * f, height: n ? Mn : kn };
    o.set(w, L);
    const F = c.has(w);
    if (e.push({
      name: "card-" + w,
      ...L,
      text: n ? "" : a ? S.label : `${S.label} · ${S.duration}d`,
      fill: F ? "#fde3d7" : n ? x(S.laneId) : a ? W(x(S.laneId), 0.45) : "#fffdf6",
      line: F || v.critical && !a ? Dt : "#667872",
      lineWidth: F || v.critical && !a ? 2.5 : 1,
      fontSize: 13
    }), !(a && n)) {
      const R = vn(n, L.width), N = n ? 44 : 22, dt = L.y + L.height / 2 - 22, ut = n ? Math.max(-12, L.x - N) : L.x - N;
      e.push({ name: rn(w), x: ut, y: dt, width: Math.max(24, L.x + R - ut), height: 44 }), e.push({ name: "handle-" + w, x: L.x + L.width - R, y: dt, width: R + N, height: 44 });
    }
  };
  let m, p, k;
  if (n) {
    const w = (g - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((M, S) => {
      const v = 8 + S * (w + 8);
      e.push({ name: "column-" + M.id, x: v, y: 30, width: w, height: 72, fill: W(x(M.id), 0.6), line: W(x(M.id), 0.1) }), e.push({ name: "lane-" + M.id, x: v + 4, y: 34, width: w - 8, height: 28, text: M.label, fill: x(M.id), fontSize: 14 }), e.push({ name: "caption-" + M.id, x: v + 4, y: 64, width: w - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), k = 124, p = 130, m = 138;
    for (const M of t.cards)
      u(M.id, m + 20), m += 64;
  } else {
    k = 48, p = 56, m = p;
    for (const w of t.lanes) {
      const M = t.cards.filter((v) => v.laneId === w.id), S = Math.max(92, M.length * 44 + 20);
      e.push({ name: "column-" + w.id, x: 0, y: m, width: g, height: S, fill: W(x(w.id), 0.65), line: W(x(w.id), 0.1) }), e.push({ name: "lane-" + w.id, x: 8, y: m + 8, width: l - 24, height: 32, text: w.label, fill: x(w.id), fontSize: 15 }), e.push({ name: "caption-" + w.id, x: 8, y: m + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((v, L) => u(v.id, m + 10 + L * 44)), m += S + 4;
    }
  }
  return a ? t.hiring.funding && !n && e.push({ name: "handle-funding", x: l + t.hiring.funding.day * f - 22, y: 4, width: 44, height: 44 }) : e.push({ name: "handle-launch", x: l + t.launch.day * f - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(a && n) && e.push({ name: b, x: l - 22, y: n ? 104 : 8, width: 44, height: 44 }), a && !n && e.push({ name: tt, x: l + r * f - 22, y: 8, width: 44, height: 44 }), { parts: e, width: g, height: m + 8, narrow: n, x0: l, dayW: f, gridTop: p, axisY: k, bars: o };
}
function Sn(t, i, n) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = n(a.name.slice(8)));
  return i;
}
function Ln(t, i) {
  const n = t.x + t.width, a = Math.max(t.x + 4, n - 10), r = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, c = i.y + i.height / 2;
  return { d: `M ${a} ${r} V ${c} H ${i.x}`, arrow: { x: i.x, y: c, angle: 0 } };
}
function Wn(t, i) {
  const n = P(t, i.layout), a = t.kind === "hiring-plan", s = I(t), r = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), c = zt(t), e = [];
  if (c?.workdays)
    for (let h = 0; h < r; h++) xt(c.origin, h) === 6 && e.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: y.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (c && h.on && h.kind === "blackout") {
    const g = at(c.origin, h.start), f = at(c.origin, h.end) + 1, x = n.x0 + Math.max(0, g) * n.dayW, u = (Math.min(r, f) - Math.max(0, g)) * n.dayW;
    if (u <= 0) continue;
    e.push({ t: "rect", x, y: n.gridTop, w: u, h: n.height - 8 - n.gridTop, color: y.refuse, opacity: 0.12 });
    for (let m = x; m < x + u; m += 10) e.push({ t: "line", x1: m, y1: n.gridTop, x2: Math.min(x + u, m + 10), y2: n.gridTop + 10, color: y.refuse, width: 0.6 });
    e.push({ t: "text", x: x + 3, y: n.gridTop + 22, text: h.label + " · " + z(h.start) + "–" + z(h.end), color: y.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= r; h++) {
    const g = n.x0 + h * n.dayW, f = c ? xt(c.origin, h) === 1 : h % 7 === 0;
    if (!f && n.dayW < 6) continue;
    e.push({ t: "line", x1: g, y1: n.gridTop, x2: g, y2: n.height - 8, color: f ? y.week : y.faint, width: f ? 1 : 0.5 });
    const x = a && c && O(c.origin, h).slice(8) <= "07" && f, u = c ? a ? x ? z(O(c.origin, h)).replace(/^\d+ /, "") : "" : z(O(c.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    f && u && (!c || a || n.dayW * 7 > 44) && e.push({ t: "text", x: g + 3, y: n.axisY, text: u, color: y.ink, size: 12 });
  }
  for (const h of t.cards) {
    for (const x of h.dependsOn ?? []) {
      const u = n.bars.get(x), m = n.bars.get(h.id);
      if (!u || !m) continue;
      const p = s.get(x).critical && s.get(h.id).critical, k = t.cards.find((w) => w.id === x).label;
      e.push({
        t: "path",
        ...Ln(u, m),
        color: p ? Dt : y.ink,
        width: p ? 2 : 1.5,
        unlink: { cardId: h.id, waitsOn: x, label: `Remove the link: ${h.label} waits on ${k}` }
      });
    }
    const g = s.get(h.id), f = n.bars.get(h.id);
    if (a) {
      const x = t.hiring.bands.find((p) => p.id === h.band), u = f.x + f.width, m = n.x0 + r * n.dayW;
      m > u && e.push({ t: "rect", x: u, y: f.y + f.height / 2 - 3, w: m - u, h: 6, rx: 3, color: y.bar, opacity: 0.45 }), e.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(u + 6, m - 120),
        y: n.narrow ? f.y - 6 : f.y + f.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + z(O(c.origin, cn(t, h.id))) + (x ? " · " + T(x.monthly, t.hiring.currency) + "/mo" : ""),
        color: y.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    n.narrow && e.push({ t: "text", x: 8, y: f.y - 6, text: `${h.label} · ${h.duration}d`, color: y.ink, size: 13, bold: g.critical }), g.critical || e.push({ t: "text", x: f.x + f.width + (n.narrow ? 48 : 24), y: f.y + f.height / 2 + 4, text: "+" + g.slack + "d", color: y.ink, size: 12, role: "slack-" + h.id });
  }
  if (c && !(a && n.narrow) && e.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: y.ink, opacity: 0.7, role: "edge-first" }), a && !n.narrow && e.push({ t: "rect", x: n.x0 + r * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: y.ink, opacity: 0.7, role: "edge-last" }), !(a && n.narrow)) for (const h of t.cards) {
    if (!n.narrow && i.focus !== h.id) continue;
    const g = n.bars.get(h.id), f = g.y + 6, x = g.height - 12, [u, m] = n.narrow ? [g.x - 10, g.x + g.width + 4] : [g.x + 3, g.x + g.width - 9], p = n.narrow ? 0.55 : 0.8;
    e.push(
      { t: "rect", x: u, y: f, w: 6, h: x, rx: 3, color: y.ink, opacity: p, role: "grip-start-" + h.id },
      { t: "rect", x: m, y: f, w: 6, h: x, rx: 3, color: y.ink, opacity: p, role: "grip-end-" + h.id }
    );
  }
  if (a) {
    const h = hn(t), g = t.behaviour?.rules.find((u) => u.on && u.kind === "deadline"), f = g && g.kind === "deadline" && h < g.floor;
    e.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + dn(h),
      color: f || i.refused ? y.refuse : y.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const x = t.hiring.funding;
    if (x && x.day <= r) {
      const u = n.x0 + x.day * n.dayW;
      e.push({ t: "line", x1: u, y1: 26, x2: u, y2: n.height - 8, color: y.accept, width: 2, dash: "6 4" }), n.narrow || e.push({ t: "rect", x: u - 4, y: 26, w: 8, h: 18, rx: 4, color: y.accept }), e.push({ t: "text", x: Math.max(u + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + T(x.amount, t.hiring.currency) + " · " + z(O(c.origin, x.day)), color: y.accept, size: 12, bold: !0 });
    }
    if (n.narrow && e.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: y.ink, size: 12 }), i.clamp) {
      const u = n.parts.find((m) => m.name === i.clamp.name);
      u && e.push(...vt(n, e, i.clamp.text, u, i.view));
    }
    return e;
  }
  const o = n.x0 + t.launch.day * n.dayW;
  e.push({ t: "line", x1: o, y1: n.narrow ? 112 : 26, x2: o, y2: n.height - 8, color: y.launch, width: 2, dash: "6 4" }), e.push({ t: "rect", x: o - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: y.launch });
  const l = Pt(t), d = Math.max(0, ...[...s.values()].map((h) => h.to));
  if (e.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: c ? "Done " + q(t, Math.ceil(d) - 1) + " · " + it(t) + " " + q(t, t.launch.day) : `Done day ${l} · launch day ${t.launch.day}`,
    color: i.refused ? y.refuse : y.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const h = n.parts.find((g) => g.name === i.clamp.name);
    h && e.push(...vt(n, e, i.clamp.text, h, i.view));
  }
  return e;
}
const U = 13, Mt = 16, Ht = (t, i) => t * (i ? 0.64 : 0.6), Tn = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function $n(t) {
  const i = t.size ?? 13, n = t.text.length * Ht(i, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - i, w: n, h: i * 1.3 };
}
function Rn(t, i) {
  const n = [];
  for (const a of t.split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= i ? n[n.length - 1] = s + " " + a : n.push(a);
  }
  return n;
}
let et = null;
function vt(t, i, n, a, s) {
  const r = [...t.bars.values()].map((p) => ({ x: p.x - 4, y: p.y - 3, w: p.width + 8, h: p.height + 6 }));
  for (const p of i)
    p.t === "text" ? r.push($n(p)) : p.t === "rect" && r.push({ x: p.x - 2, y: p.y - 2, w: p.w + 4, h: p.h + 4 });
  let c = t.narrow ? 6 : t.x0 + 2, e = t.width - 4, o = t.gridTop + 2, l = t.height - 6;
  s && Math.min(e, s.x + s.width - 8) - Math.max(c, s.x + 8) >= 160 && (c = Math.max(c, s.x + 8), e = Math.min(e, s.x + s.width - 8), Math.min(l, s.y + s.height - 8) - Math.max(o, s.y + 8) >= 40 && (o = Math.max(o, s.y + 8), l = Math.min(l, s.y + s.height - 8)));
  const d = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, h = JSON.stringify([n, d, c, e, o, l, r.map((p) => [p.x, p.y, p.w, p.h].map(Math.round))]);
  if (et?.key === h) return et.shapes;
  const g = Ht(U, !0), f = Math.floor((e - c) / g), x = /* @__PURE__ */ new Map();
  for (const p of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const k = Rn(n, Math.max(8, Math.floor(f * p)));
    k.length <= 4 && x.set(k.join(`
`), k);
  }
  let u = null;
  for (const p of x.values()) {
    const k = Math.max(...p.map((M) => M.length)) * g, w = p.length * Mt + 2;
    if (!(k > e - c))
      for (let M = o; M + w <= l; M += 3)
        for (let S = c; S + k <= e; S += 6) {
          const v = { x: S, y: M, w: k, h: w }, L = Math.max(v.x - d.x, 0, d.x - (v.x + v.w)), F = Math.max(v.y - d.y, 0, d.y - (v.y + v.h)), R = Math.hypot(L, F) + (p.length - 1) * 24;
          u && R >= u.score || r.every((N) => Tn(v, N)) && (u = { box: v, lines: p, score: R });
        }
  }
  const m = u ? [{ t: "text", x: u.box.x, y: u.box.y + U - 1, text: n, lines: u.lines, lineHeight: Mt, color: y.refuse, size: U, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: n,
    color: y.refuse,
    size: U,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return et = { key: h, shapes: m }, m;
}
const Y = (t, i = 1, n) => {
  const a = (r, c) => Math.round(r / c) * c, s = { ...t, cards: t.cards.map((r) => {
    const c = r.id === n ? i : 1, e = { ...r, duration: Math.max(c, a(r.duration, c)), lag: Math.max(0, a(r.lag ?? 0, c)) };
    return e.lag || delete e.lag, e;
  }) };
  return t.launch && (s.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (s.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), s;
}, St = (t) => !!t.behaviour || t.kind === "hiring-plan";
function Cn(t, i, n) {
  if (n !== "l" && n !== "L") return null;
  const a = /^card-(.+)$/.exec(i), s = a && t.cards.find((e) => e.id === a[1]);
  if (!s) return null;
  const r = (e) => t.cards.find((o) => o.id === e)?.label ?? e, c = [
    ...Ft(t, s.id).map((e) => ({
      said: `${s.label} waits on ${r(e)}`,
      edits: [{ kind: "link_tasks", card: { id: s.id }, waitsOn: { id: e } }]
    })),
    ...(s.dependsOn ?? []).map((e) => ({
      said: `${s.label} stops waiting on ${r(e)}`,
      edits: [{ kind: "unlink_tasks", card: { id: s.id }, waitsOn: { id: e } }]
    }))
  ];
  return c.length ? c : `${s.label} has no task it can wait on.`;
}
function En(t, i, { key: n, shiftKey: a }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = (n === "ArrowLeft" ? -1 : 1) * j(t);
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(s) }];
  if (i === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(s) * 7 }];
  if (i === b && t.clock) return [{ kind: "set_plan_start", start: O(t.clock.origin, Math.sign(s) * (t.kind === "hiring-plan" || Math.abs(s) > 1 ? 7 : 1)) }];
  if (i === tt && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(s) }];
  const r = Z(i), c = r !== null && t.cards.find((l) => l.id === r);
  if (c) return [{ kind: "set_task", card: { id: c.id }, duration: c.duration - s, lag: (c.lag ?? 0) + s }];
  const e = /^(card|handle)-(.+)$/.exec(i), o = e && t.cards.find((l) => l.id === e[2]);
  return o ? a || e[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + s }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + s }] : null;
}
const rt = {
  laneCues: !1,
  notes(t, i, n, a) {
    return ht(rt.places(t, i).parts, t, n, a);
  },
  editsBetween: Q,
  label: Nt,
  places(t, i) {
    const n = Sn(t, P(t, i), (a) => {
      const s = t.cards.filter((c) => c.laneId === a), r = I(t);
      return t.kind === "hiring-plan" ? s.length + (s.length === 1 ? " hire" : " hires") : `${s.length} ${s.length === 1 ? "task" : "tasks"} · ${s.filter((c) => r.get(c.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => ct(t, Wn),
  chooser(t, i, n, a = {}) {
    const s = t.cards.findIndex((r) => r.id === i);
    return s < 0 ? null : t.kind === "hiring-plan" && a.narrow ? () => t : (St(t) ? zn : Nn)(t, i, s, Ft(t, i), n, a);
  },
  refusalAt(t, i, n, a, s) {
    const r = P(t, s);
    for (const l of t.cards) {
      if (l.id === i || !X(r.bars.get(l.id), a)) continue;
      const d = _t(t, i, l.id);
      return d ? { laneId: l.laneId, reason: d } : null;
    }
    const c = t.cards.find((l) => l.id === i), e = (c.lag ?? 0) + Math.round((a.x - n.x - r.bars.get(i).x) / r.dayW);
    if (St(t)) {
      const l = I(t).get(i), d = Math.round(l.from + (a.x - n.x - r.bars.get(i).x) / r.dayW), h = (c.lag ?? 0) + Yt(zt(t)).idx(d) - l.start, g = j(t), f = At(t, i, { lag: Math.max(0, Math.round(h / g) * g) });
      return typeof f == "string" ? { laneId: c.laneId, reason: f, lands: !0 } : null;
    }
    const o = Zt(t, { cardId: i, field: "lag" });
    return e > o.max ? { laneId: c.laneId, reason: qt(Xt(t, { cardId: i, field: "lag" }, e), i) ?? o.reasons.max } : null;
  },
  handleDrag(t, i, n, a) {
    const s = P(t, a);
    if (t.kind === "hiring-plan" && a.narrow) return null;
    const r = Z(i);
    if (r !== null) return t.cards.some((e) => e.id === r) ? Lt(t, r, "start", n, s, i) : null;
    const c = i.slice(7);
    return t.cards.some((e) => e.id === c) ? Lt(t, c, "end", n, s, i) : i === "handle-launch" ? An(t, n, s, a) : i === "handle-funding" && t.hiring?.funding ? Bn(t, n, s) : i === b && t.clock ? On(t, n, s, a) : i === tt && t.hiring ? Pn(t, n, s, a) : null;
  },
  keyEdit: En,
  keyChoices: Cn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, i) {
    const n = Z(i) ?? /^(?:card|handle)-(.+)$/.exec(i)?.[1] ?? null;
    return n !== null && t.cards.some((a) => a.id === n) ? n : null;
  }
};
function Lt(t, i, n, a, s, r) {
  const c = s.parts.find((e) => e.name === r);
  return c ? (e) => {
    const o = tn(t, i, n, (e.x - a.x - c.x) / s.dayW);
    return o.next ? { next: o.next, ...o.reason && { clampedReason: o.reason } } : { next: _n(t, i, o.values) ?? t, clampedReason: o.refusal, refusal: o.refusal };
  } : null;
}
function _n(t, i, n) {
  const a = t.cards.find((o) => o.id === i), s = j(t), r = a.lag ?? 0, c = a.duration ?? 1, e = (o, l) => Math.sign(l - o) * s;
  for (let o = { ...n }; o.lag !== r || o.duration !== c; ) {
    if (o.lag !== r) {
      const d = e(o.lag, r);
      o = { lag: o.lag + d, duration: o.duration - d };
    } else o = { lag: r, duration: o.duration + e(o.duration, c) };
    const l = At(t, i, { lag: o.lag, duration: o.duration });
    if (typeof l != "string") return l;
  }
  return null;
}
function zn(t, i, n, a, s, r) {
  const c = j(t), e = an(t), o = t.cards[n].laneId, l = (u) => {
    if (!e) return u;
    const m = ln(t, u, /* @__PURE__ */ new Set([i]));
    return typeof m == "string" ? u : m;
  }, d = (u) => l(Y(u, c, i)), h = (u) => K(P(l(u), r).parts, a.map((m) => "card-" + m)), f = (r.narrow ? [o] : t.lanes.map((u) => u.id)).flatMap((u) => sn(t, i, "lag", u === o ? void 0 : u).map((m) => ({ laneId: u, run: m })));
  if (!f.length) return () => t;
  const x = G(t, "card-" + i, s, h, (u, m) => {
    const p = u.closest(f.map(({ laneId: k, run: [w, M] }) => u.vary(
      { ...m, cards: m.cards.map((S, v) => v === n ? { ...S, laneId: k, lag: Math.min(M, Math.max(w, S.lag ?? 0)) } : S) },
      Tt("cards", n, "lag"),
      { constraint: (S) => [$t(S.cards[n].lag ?? 0, w - 0.49), Rt(S.cards[n].lag ?? 0, M + 0.49)] }
    ))).withBranchTransition(100);
    return a.length ? u.closest(a.map((k) => u.dropTarget("target-" + k, Ot(m, i, k)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(p).withBranchTransition(120).onDrop(d) : p.onDrop(d);
  });
  return x ? (u) => d(x(u)) : null;
}
function An(t, i, n, a) {
  const s = n.parts.find((c) => c.name === "handle-launch");
  if (!s) return null;
  const r = { ...a, dayWidth: n.dayW };
  return (c) => {
    const e = gt(t, t.launch.day + Math.round((c.x - i.x - s.x) / n.dayW));
    if (e.next) return { next: e.next, layout: r, ...e.reason && { clampedReason: e.reason } };
    let o = t;
    const l = Math.sign(t.launch.day - e.day);
    for (let d = e.day + l; l && d !== t.launch.day; d += l) {
      const h = gt(t, d);
      if (h.next) {
        o = h.next;
        break;
      }
    }
    return { next: o, layout: r, clampedReason: e.refusal, refusal: e.refusal };
  };
}
function On(t, i, n, a) {
  const s = n.parts.find((c) => c.name === b);
  if (!s) return null;
  const r = { ...a, dayWidth: n.dayW };
  return (c) => {
    const e = nn(t, (c.x - i.x - s.x) / n.dayW);
    return e.next ? { next: e.next, layout: r } : { next: t, layout: r, clampedReason: e.refusal, refusal: e.refusal };
  };
}
function Pn(t, i, n, a) {
  const s = n.parts.find((e) => e.name === tt);
  if (!s) return null;
  const r = { ...a, dayWidth: n.dayW }, c = t.hiring.weeks;
  return (e) => {
    const o = c + Math.round((e.x - i.x - s.x) / n.dayW / 7), l = en(t, o);
    return l ? { next: t, layout: r, clampedReason: l, refusal: l } : { next: { ...t, hiring: { ...t.hiring, weeks: o } }, layout: r };
  };
}
function Bn(t, i, n) {
  const a = n.parts.find((o) => o.name === "handle-funding");
  if (!a) return null;
  const s = t.hiring.funding.day, r = j(t), c = t.hiring.weeks * 7, e = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const l = s + Math.round((o.x - i.x - a.x) / n.dayW / r) * r, d = Math.min(c, Math.max(0, l)), h = Fn(t, e(d));
    return h ? { next: t, clampedReason: h, refusal: h } : { next: e(d), ...d !== l && { clampedReason: d > l ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function Fn(t, i) {
  const n = t.behaviour ? on(t, i) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function Nn(t, i, n, a, s, r) {
  const c = t.launch.day, e = (l) => K(P(l, r).parts, a.map((d) => "card-" + d)), o = G(t, "card-" + i, s, e, (l, d) => {
    const h = r.narrow ? d.lanes.filter((f) => f.id === d.cards[n].laneId) : d.lanes, g = l.closest(h.map((f) => l.vary(
      { ...d, cards: d.cards.map((x, u) => u === n ? { ...x, laneId: f.id, lag: x.lag ?? 0 } : x) },
      Tt("cards", n, "lag"),
      { constraint: (x) => [$t(x.cards[n].lag ?? 0, -1e-3), Rt(Pt(x), c + 1e-3)] }
    )));
    return a.length ? l.closest(a.map((f) => l.dropTarget("target-" + f, Ot(d, i, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(g).withBranchTransition(120).onDrop((f) => Y(f)) : g.onDrop((f) => Y(f));
  });
  return o ? (l) => Y(o(l)) : null;
}
const A = 76;
function _(t, i = {}) {
  const n = !!i.narrow, a = [], s = t.lanes.map((o) => t.cards.filter((l) => l.laneId === o.id).length), r = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : B[o % B.length];
  let c, e;
  if (n) {
    c = Math.max(300, i.width ?? 390);
    let o = A;
    t.lanes.forEach((l, d) => {
      const h = 96 + (s[d] + 1) * 64;
      a.push({ name: "column-" + l.id, x: 2, y: o, width: c - 4, height: h, fill: W(r(d), 0.6), line: W(r(d), 0.1) });
      const g = (c - 16) * 0.36;
      a.push({ name: "lane-" + l.id, x: 8, y: o + 6, width: g, height: 36, text: l.label, fill: r(d), fontSize: 15 }), a.push({ name: "caption-" + l.id, x: 8 + g + 6, y: o + 6, width: c - 16 - g - 6, height: 56, text: pt(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((f) => f.laneId === l.id).forEach((f, x) => a.push({ name: "card-" + f.id, x: 8, y: o + 72 + x * 64, width: c - 16, height: 56, text: Wt(t, f.id), fontSize: 15 })), o += h + 10;
    }), e = o;
  } else {
    const d = 116 + (Math.max(...s) + 1) * 88;
    t.lanes.forEach((h, g) => {
      const f = g * 244;
      a.push({ name: "column-" + h.id, x: f + 2, y: A, width: 240, height: d, fill: W(r(g), 0.6), line: W(r(g), 0.1) }), a.push({ name: "lane-" + h.id, x: f + 8, y: A + 6, width: 228, height: 58, text: h.label, fill: r(g), fontSize: 16 }), a.push({ name: "caption-" + h.id, x: f + 8, y: A + 66, width: 228, height: 48, text: pt(t, h.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((x) => x.laneId === h.id).forEach((x, u) => a.push({ name: "card-" + x.id, x: f + 8, y: A + 116 + u * 88, width: 228, height: 76, text: Wt(t, x.id), fontSize: 15 }));
    }), c = t.lanes.length * 244, e = A + d;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(c, 520), height: 34, text: mn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), a.push({ name: "handle-target", x: D(t, i, c) - 22, y: 27, width: 44, height: 44 }), { parts: a, width: c, height: e };
}
const V = (t, i = {}) => i.gaugeScale ?? Math.max(t.forecast.target * 1.25, lt(t)), D = (t, i, n) => 4 + (n - 8) * t.forecast.target / V(t, i);
function ot(t) {
  for (const i of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (i * 100 >= t) return i;
  return 5e7;
}
function Dn(t, i, { key: n }) {
  if (i !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = ot(V(t));
  return [{ kind: "set_target", amount: Math.max(a, t.forecast.target + (n === "ArrowLeft" ? -a : a)) }];
}
function Wt(t, i) {
  const n = t.cards.find((a) => a.id === i);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + T(n.amount, t.forecast.currency);
}
function Hn(t, i) {
  const { width: n } = _(t, i.layout), a = t.forecast.target, s = lt(t), r = V(t, i.layout), c = Math.max(n - 8, (n - 8) * a * 1.1 / r), e = s >= a;
  return [
    { t: "rect", x: 4, y: 42, w: c, h: 14, rx: 7, color: y.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * s / r, h: 14, rx: 7, color: e ? y.accept : y.bar },
    { t: "line", x1: D(t, i.layout, n), y1: 36, x2: D(t, i.layout, n), y2: 62, color: y.ink, width: 2 },
    { t: "rect", x: D(t, i.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: y.ink, role: "edge-target" },
    { t: "text", x: D(t, i.layout, n), y: 72, text: "Target " + T(a, t.forecast.currency), color: y.ink, size: 14, anchor: "middle" }
  ];
}
const In = {
  laneCues: !0,
  places: (t, i) => _(t, i),
  notes: (t, i, n, a) => ht(_(t, i).parts, t, n, a),
  editsBetween: Q,
  layer: (t) => ct(t, Hn),
  chooser(t, i, n, a = {}) {
    const s = Ct(t, i).map((r) => Et(t, i, r.id));
    return s.length < 2 ? null : Bt(G(t, "card-" + i, n, (r) => K(_(r, a).parts), (r, c) => r.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c, { gapIn: 40, gapOut: 56 })), t, i, _(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: r } = _(t, s), c = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === c.laneId || !X(r.find((l) => l.name === "column-" + e.id), a)) continue;
      const o = fn(t, i, e.id);
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
    const s = _(t, a), r = s.parts.find((h) => h.name === "handle-target"), c = V(t, a), e = ot(c), o = c / (s.width - 8), l = { ...a, gaugeScale: c }, d = un(t, { field: "target" });
    return (h) => {
      const g = t.forecast.target + Math.round((h.x - n.x - r.x) * o / e) * e, f = Math.min(d.max, Math.max(e, g));
      return { next: { ...t, forecast: { ...t.forecast, target: f } }, layout: l, ...f !== g && { clampedReason: f < g ? d.reasons.max : "A target is at least " + T(e, t.forecast.currency) + "." } };
    };
  },
  keyEdit: Dn,
  label: (t, i) => i === "handle-target" ? "Target, " + T(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + T(ot(V(t)), t.forecast.currency) + "." : null
}, $ = 48, H = 960, It = 900;
function E(t, i = {}) {
  const n = !!i.narrow, a = t.budget.total, s = [], r = [], c = t.lanes.map((l) => t.cards.filter((d) => d.laneId === l.id).length);
  let e, o;
  if (n) {
    e = Math.max(300, i.width ?? 390);
    let l = $;
    t.lanes.forEach((d, h) => {
      const g = Math.max(100 + (c[h] + 1) * 64, d.allocation / a * It);
      r.push({ laneId: d.id, start: l, size: g }), l += g;
    }), o = l + 8;
  } else {
    e = H;
    let l = 0;
    for (const d of t.lanes)
      r.push({ laneId: d.id, start: l, size: d.allocation / a * H }), l += d.allocation / a * H;
    o = $ + 100 + (Math.max(...c) + 1) * 64;
  }
  return t.lanes.forEach((l, d) => {
    const { start: h, size: g } = r[d], f = B[d % B.length], x = n ? { x: 2, y: h + 1, width: e - 4, height: g - 2 } : { x: h + 1, y: $, width: Math.max(4, g - 2), height: o - $ }, u = { x: x.x + 5, y: x.y, width: Math.max(10, x.width - 10) };
    s.push({ name: "column-" + l.id, ...x, fill: W(f, 0.6), line: W(f, 0.1) });
    const m = n ? u.width * 0.36 : u.width;
    if (s.push({ name: "lane-" + l.id, x: u.x, y: u.y + 6, width: m, height: 32, text: l.label, fill: f, fontSize: 15 }), s.push({
      name: "caption-" + l.id,
      x: n ? u.x + m + 6 : u.x,
      y: u.y + (n ? 6 : 40),
      width: n ? u.width - m - 6 : u.width,
      height: n ? 50 : 40,
      text: n ? mt(t, l.id).replace(" · ", `
`) : mt(t, l.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((p) => p.laneId === l.id).forEach((p, k) => s.push({
      name: "card-" + p.id,
      x: u.x,
      y: u.y + 100 + k * 64,
      width: u.width,
      height: 56,
      text: p.label + `
` + T(p.amount, t.budget.currency),
      fontSize: 14
    })), d < t.lanes.length - 1) {
      const p = h + g;
      s.push(n ? { name: "handle-" + l.id, x: e - 96, y: p - 22, width: 88, height: 44 } : { name: "handle-" + l.id, x: p - 22, y: $ - 6, width: 44, height: 48 });
    }
  }), { parts: s, width: e, height: o, segments: r, narrow: n };
}
function Kn(t, i) {
  const n = E(t, i.layout), a = t.budget.total, s = [{ t: "text", x: 4, y: 28, text: yn(t), color: y.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((r, c) => {
    const e = n.segments[c], o = r.allocation, l = pn(t, r.id);
    if (n.narrow) {
      const d = e.start + 50, h = 8, g = n.width - 16;
      s.push({ t: "rect", x: h, y: d, w: g, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x: h, y: d, w: g * l / o || 0, h: 10, rx: 5, color: y.bar }), r.floor !== void 0 && s.push({ t: "line", x1: h + g * r.floor / o, y1: d - 4, x2: h + g * r.floor / o, y2: d + 14, color: y.ink, width: 2 });
    } else {
      const d = H / a, h = $ + 86;
      s.push({ t: "rect", x: e.start + 6, y: h, w: e.size - 12, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x: e.start + 6, y: h, w: Math.max(0, (e.size - 12) * l / o || 0), h: 10, rx: 5, color: y.bar }), r.floor !== void 0 && s.push({ t: "line", x1: e.start + r.floor * d, y1: h - 6, x2: e.start + r.floor * d, y2: h + 16, color: y.ink, width: 2 }), r.cap !== void 0 && e.start + r.cap * d <= n.width && s.push({ t: "line", x1: e.start + r.cap * d, y1: h - 6, x2: e.start + r.cap * d, y2: h + 16, color: y.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const d = e.start + e.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: d, x2: n.width - 2, y2: d, color: y.ink, width: 2 } : { t: "line", x1: d, y1: $, x2: d, y2: n.height, color: y.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: d - 4, w: 32, h: 8, rx: 4, color: y.ink } : { t: "rect", x: d - 4, y: $ + 2, w: 8, h: 30, rx: 4, color: y.ink });
    }
  }), i.clamp) {
    const r = n.parts.find((c) => c.name === i.clamp.name);
    r && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(r.x + 22, 120), n.width - 120),
      y: n.narrow ? r.y + 8 : $ - 12,
      text: i.clamp.text,
      color: y.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const Gn = (t, i) => Math.round(t / i) * i, Vn = {
  laneCues: !0,
  notes: (t, i, n, a) => ht(E(t, i).parts, t, n, a),
  editsBetween: Q,
  label: Nt,
  places(t, i) {
    const { parts: n, width: a, height: s } = E(t, i);
    return { parts: n, width: a, height: s };
  },
  layer: (t) => ct(t, Kn),
  chooser(t, i, n, a = {}) {
    const s = Ct(t, i).map((r) => Et(t, i, r.id));
    return s.length < 2 ? null : Bt(G(t, "card-" + i, n, (r) => K(E(r, a).parts), (r, c) => r.closest(s).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c)), t, i, E(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: r } = E(t, s), c = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === c.laneId || !X(r.find((l) => l.name === "column-" + e.id), a)) continue;
      const o = xn(t, i, e.id);
      return o ? { laneId: e.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, i, n, a) {
    const s = i.slice(7), r = t.lanes.findIndex((x) => x.id === s), c = t.lanes[r + 1];
    if (r < 0 || !c) return null;
    const e = gn(t, { laneId: s }), o = t.budget.step, l = (x) => {
      const u = Math.min(e.max, Math.max(e.min, Gn(x, o)));
      return yt(t, c.id, s, u);
    }, d = E(t, a), h = d.narrow ? It / t.budget.total : H / t.budget.total, g = d.parts.find((x) => x.name === i), f = G(t, i, n, (x) => K(E(x, a).parts), (x) => x.varyFunc([0], ([u]) => yt(t, c.id, s, u), { constraint: (u) => [
      ...Jt([e.min, u.lanes[r].allocation - t.lanes[r].allocation, e.max])
    ] }));
    return (x) => {
      const m = (d.narrow ? x.y - n.y - g.y : x.x - n.x - g.x) / h, p = f?.(x), k = p ? p.lanes[r].allocation - t.lanes[r].allocation : m, w = { next: l(k) };
      return m > e.max + o / 2 ? { ...w, clampedReason: e.reasons.max } : m < e.min - o / 2 ? { ...w, clampedReason: e.reasons.min } : w;
    };
  },
  keyEdit(t, i, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const a = /^handle-(.+)$/.exec(i)?.[1], s = t.lanes.findIndex((l) => l.id === a), r = t.lanes[s + 1];
    if (s < 0 || !r) return null;
    const c = n === "ArrowRight" || n === "ArrowDown", e = t.budget.step;
    return [c ? { kind: "shift_budget", from: { id: r.id }, to: { id: a }, amount: e } : { kind: "shift_budget", from: { id: a }, to: { id: r.id }, amount: e }];
  }
}, Kt = { "launch-plan": rt, "hiring-plan": rt, pipeline: In, budget: Vn };
function qn(t, i) {
  Kt[t] = i;
}
function Xn(t) {
  const i = Kt[t];
  if (!i && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return i;
}
function Qn(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  ne as amountLimits,
  ee as amountOf,
  qe as amountRules,
  ie as bandOf,
  Xe as behaviourEditsBetween,
  Qn as boardLayoutFor,
  mt as budgetCaption,
  pn as budgetCommitted,
  yn as budgetHeader,
  Vn as budgetKit,
  E as budgetLayout,
  gn as budgetLimits,
  xn as budgetRefusal,
  Qe as budgetRules,
  be as budgetShiftLimits,
  ti as budgetShiftRefusal,
  di as byOrder,
  an as cascadeStops,
  ui as checkNest,
  fi as checkNestMove,
  on as checkTime,
  zt as clockOf,
  ct as createBoardLayer,
  ae as currencyOf,
  nt as dateName,
  se as dayFromWords,
  Yt as dayMap,
  q as dayWords,
  re as days,
  oe as downstreamTasks,
  tn as dragTaskEdge,
  le as earliestLaunch,
  ce as edgeValues,
  gi as extend,
  he as extendWorkshopEdits,
  de as goLiveSample,
  Nt as handleLabel,
  G as headlessDrag,
  ue as hireLagFor,
  cn as hireStarts,
  fe as hiringPlanRules,
  ge as hiringPlanSample,
  ln as holdOthers,
  X as inside,
  xi as isOrderKey,
  Di as isOrgChart,
  O as isoAt,
  xe as isoTime,
  Xn as kitFor,
  pe as launchDayOn,
  Pt as launchFinish,
  Qt as launchHard,
  me as launchIndex,
  P as launchLayout,
  _t as launchLinkRefusal,
  Ft as launchLinkTargets,
  qt as launchOverrun,
  ye as launchPlanCaption,
  rt as launchPlanKit,
  Zt as launchPlanLimits,
  we as launchPlanRefusal,
  ke as launchPlanRules,
  Me as launchPlanSample,
  ve as launchTaskText,
  Se as launchTooEarly,
  y as layerInk,
  sn as legalRuns,
  it as lineWord,
  T as money,
  Le as monthNames,
  gt as moveLaunch,
  nn as movePlanStart,
  pi as nestAlias,
  mi as nestAreas,
  Hi as nestAxes,
  yi as nestCardText,
  wi as nestDepth,
  ki as nestDrags,
  Mi as nestEmptyDrop,
  vi as nestFamily,
  Si as nestKids,
  Li as nestLegal,
  Wi as nestMeasure,
  Ti as nestMeasureWords,
  $i as nestPlace,
  Ii as nestQuadrants,
  Ri as nestRoots,
  Ci as nestRules,
  Ki as nestScores,
  Ei as nestSentence,
  _i as nestSubtree,
  We as nextCardId,
  Te as nextMonday,
  $e as noteNumbers,
  at as offsetOf,
  zi as orderBetween,
  Ai as orderKeys,
  Re as ownField,
  ht as partNotes,
  K as partsGeometry,
  bt as pastTheLine,
  pt as pipelineCaption,
  lt as pipelineForecast,
  mn as pipelineGauge,
  In as pipelineKit,
  _ as pipelineLayout,
  un as pipelineLimits,
  fn as pipelineRefusal,
  ni as pipelineRules,
  ei as planBudgetMove,
  Ce as planDrags,
  Ee as planEdit,
  _e as planFixed,
  ze as planLaunchPlanMove,
  ii as planPipelineMove,
  Ae as planProblem,
  ai as planSamples,
  Oe as planStartBy,
  en as planWeeksProblem,
  Pe as planWords,
  Be as presetRules,
  Gi as quadrantOf,
  Fe as readClock,
  Ne as readNoteNumbers,
  qn as registerBoardKit,
  Oi as registerNestPlus,
  De as renamedNumbers,
  kt as renderLayerShapes,
  si as restoreWorkshop,
  Pi as roleOf,
  He as runwayCap,
  Ie as runwayHeader,
  hn as runwayMonths,
  dn as runwayWords,
  ri as sampleBudget,
  Ke as sampleLaunchPlan,
  oi as samplePipeline,
  I as scheduleLaunch,
  Vi as scoreBoard,
  ji as scoresIn,
  yt as shiftBudget,
  z as shortDate,
  j as snapStep,
  rn as startHandle,
  Z as startHandleCard,
  Bi as tidyKeys,
  Ge as timeFamily,
  Ve as timeRuleKindIds,
  je as timeSentence,
  W as tint,
  At as tryTask,
  li as validateBudget,
  Je as validateHiringPlan,
  Ue as validateLaunchPlan,
  Fi as validateNest,
  ci as validatePipeline,
  xt as weekdayAt,
  Ye as weekendAt,
  Ot as withLink,
  Ut as withPlanStart,
  Xt as withTaskValue,
  Q as workshopEditsBetween
};
