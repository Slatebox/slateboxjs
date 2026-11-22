import { Vec2 as ct, getElementPositionCheap as Nt, translate as Ft, dragSpecToBehavior as It, param as K, moreThan as V, lessThan as b, inOrder as Ht } from "./dragology.mjs";
import { laneColors as N, workshopDestinations as Mt, workshopCandidate as vt } from "./workshop-model.mjs";
import { m as W, G as St, I as Y, _ as O, Z, Q as q, u as Kt, v as Lt, X, z as Ct, V as zt, a5 as Vt, C as Tt, W as bt, a0 as Gt, T as Et, a3 as Jt, R as Q, $ as $t, w as ht, j as dt, s as _, f as I, a6 as jt, ac as Ut, ad as Yt, U as ut } from "./plans-BI5v9TGn.mjs";
import { a as Rn, d as Pn, a8 as _n, c as Bn, p as Dn, t as Nn, ag as Fn, Y as In, P as Hn, g as Kn, a7 as Vn, ab as bn, h as Gn, i as Jn, S as jn, H as Un, F as Yn, N as Zn, l as qn, J as Qn, e as Xn, n as te, q as ne, b as ee, o as ie, B as ae, M as se, y as oe, E as re, x as le, A as ce, L as he, O as de, af as ue, r as fe, ae as xe, aa as pe, K as me, a4 as ye, a2 as ge, a1 as we, a9 as ke, D as Me, k as ve } from "./plans-BI5v9TGn.mjs";
import j from "react";
import { pipelineForecast as Wt, pipelineRefusal as Zt, pipelineCaption as ft, budgetLimits as qt, budgetRefusal as Qt, budgetCaption as xt, shiftBudget as pt, budgetCommitted as Xt } from "./workshop-rules.mjs";
import { amountRules as Le, behaviourEditsBetween as Ce, budgetRules as ze, budgetShiftLimits as Te, budgetShiftRefusal as Ee, pipelineLimits as $e, pipelineRules as We, planBudgetMove as Ae, planPipelineMove as Oe, planSamples as Re, restoreWorkshop as Pe, sampleBudget as _e, samplePipeline as Be, validateBudget as De, validatePipeline as Ne } from "./workshop-rules.mjs";
import { byOrder as Ie, checkNest as He, checkNestMove as Ke, extend as Ve, isOrderKey as be, nestAlias as Ge, nestAreas as Je, nestCardText as je, nestDepth as Ue, nestDrags as Ye, nestEmptyDrop as Ze, nestFamily as qe, nestKids as Qe, nestLegal as Xe, nestMeasure as ti, nestMeasureWords as ni, nestPlace as ei, nestRoots as ii, nestRules as ai, nestSentence as si, nestSubtree as oi, orderBetween as ri, orderKeys as li, registerNestPlus as ci, roleOf as hi, tidyKeys as di, validateNest as ui } from "./workshop-nest.mjs";
import { isOrgChart as xi, nestAxes as pi, nestQuadrants as mi, nestScores as yi, quadrantOf as gi, scoreBoard as wi, scoresIn as ki } from "./workshop-nest-plus.mjs";
const w = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, it = "http://www.w3.org/2000/svg", mt = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function E(t, i, n) {
  const a = document.createElementNS(it, t);
  for (const [s, o] of Object.entries(i)) a.setAttribute(s, String(o));
  return n?.fill && (a.setAttribute("fill", mt(n.fill)), a.style.setProperty("fill", n.fill)), n?.stroke && (a.setAttribute("stroke", mt(n.stroke)), a.style.setProperty("stroke", n.stroke)), a;
}
function yt(t, i, n, a) {
  const s = typeof document < "u" ? document.activeElement : null, o = s && t.contains(s) ? s.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const l = [];
  for (const e of i)
    if (e.t === "line")
      t.appendChild(E("line", {
        x1: e.x1,
        y1: e.y1,
        x2: e.x2,
        y2: e.y2,
        "stroke-width": e.width ?? 1,
        ...e.dash ? { "stroke-dasharray": e.dash } : {}
      }, { stroke: e.color }));
    else if (e.t === "rect")
      t.appendChild(E("rect", {
        x: e.x,
        y: e.y,
        width: Math.max(0, e.w),
        height: Math.max(0, e.h),
        rx: e.rx ?? 0,
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const h = E("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      e.lines && e.lines.length > 1 ? e.lines.forEach((r, u) => {
        const c = E("tspan", { x: e.x, dy: u ? e.lineHeight ?? Math.round((e.size ?? 13) * 1.25) : 0 });
        c.textContent = u < e.lines.length - 1 ? r + " " : r, h.appendChild(c);
      }) : h.textContent = e.text, t.appendChild(h);
    } else {
      if (e.unlink && n) {
        const { cardId: h, waitsOn: r, label: u } = e.unlink, c = r + ">" + h, m = a?.armed === c, x = E("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": c,
          "aria-label": m ? u + ". Tap again to remove it." : u,
          role: "button",
          tabindex: 0,
          ...m ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: m ? w.refuse : "transparent" });
        let p = !1;
        x.addEventListener("pointerdown", (d) => {
          d.stopPropagation(), p = d.pointerType === "touch" || d.pointerType === "pen";
        }), x.addEventListener("click", (d) => {
          if (d.stopPropagation(), p && a && a.armed !== c) {
            a.arm(c);
            return;
          }
          a?.arm(null), n(h, r);
        }), x.addEventListener("keydown", (d) => {
          d.key !== "Enter" && d.key !== " " || (d.preventDefault(), d.stopPropagation(), n(h, r));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", w.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          m || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), t.appendChild(x), l.push(x);
      }
      if (t.appendChild(E("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: h, y: r, angle: u } = e.arrow;
        t.appendChild(E("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${h} ${r}) rotate(${u})`, "pointer-events": "none" }, { fill: e.color }));
      }
      if (e.unlink && a?.armed === e.unlink.waitsOn + ">" + e.unlink.cardId && e.arrow) {
        const h = E("text", {
          x: e.arrow.x - 6,
          y: e.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: w.refuse });
        h.textContent = "Tap again to remove this link", t.appendChild(h);
      }
    }
  o && l.find((e) => e.getAttribute("data-board-link") === o)?.focus({ preventScroll: !0 });
}
function st(t, i) {
  const n = t?.canvas?.node, a = document.createElementNS(it, "g");
  a.setAttribute("data-board-layer", ""), a.setAttribute("pointer-events", "none");
  const s = document.createElementNS(it, "g");
  s.setAttribute("data-board-layer-top", ""), s.setAttribute("pointer-events", "none");
  let o = !1, l = null, e;
  const h = {
    armed: null,
    arm(u) {
      clearTimeout(e), h.armed = u, u && (e = setTimeout(() => h.arm(null), 5e3), l?.[2].announce?.("Link selected. Tap it again to remove it.")), l && r.draw(...l);
    }
  }, r = {
    draw(u, c, m) {
      if (o || !n) return;
      l = [u, c, m];
      const { origin: x } = m, p = i(c ?? u, m, u), d = (y) => y.t === "text" && (y.role === "clamp" || y.role === "refusal");
      for (const y of [a, s]) y.setAttribute("transform", `translate(${x.x} ${x.y})`);
      yt(a, p.filter((y) => !d(y)), m.onUnlink, h), yt(s, p.filter(d));
      const g = m.above && m.above.parentNode === n ? m.above : null, f = g ? g.nextSibling : n.firstChild;
      (a.parentNode !== n || a.previousSibling !== g) && n.insertBefore(a, f === a ? a.nextSibling : f), s.firstChild && n.lastChild !== s ? n.appendChild(s) : !s.firstChild && s.parentNode && s.remove();
    },
    destroy() {
      o = !0, clearTimeout(e), a.remove(), s.remove();
    }
  };
  return r;
}
function F(t, i = []) {
  const n = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return j.createElement(
    "g",
    null,
    ...n.map((a) => /* @__PURE__ */ j.createElement("g", { id: a.name, transform: Ft(a.x, a.y) }, /* @__PURE__ */ j.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ j.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
  );
}
function A(t, i, n, a, s) {
  let o;
  const e = {
    draggable: (r) => (o ?? (o = r.d), a(r.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: ct(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!Nt(e, t) || !o) return null;
  const h = It(s(o, t), e);
  return (r) => h({ pointer: ct(r.x, r.y) }).dropState;
}
const tt = (t, i, n = 0) => !!t && i.x >= t.x - n && i.x <= t.x + t.width + n && i.y >= t.y - n && i.y <= t.y + t.height + n;
function At(t, i, n, a, s) {
  if (!t) return null;
  const o = i.cards.find((l) => l.id === n).laneId;
  return (l) => {
    const e = t(l);
    if (e !== i && JSON.stringify(e) !== JSON.stringify(i)) return e;
    const h = a.find((r) => r.name.startsWith("column-") && r.name !== "column-" + o && tt(r, l));
    return h && s.find((r) => r.cards.find((u) => u.id === n).laneId === h.name.slice(7)) || e;
  };
}
function C(t, i) {
  const n = (a) => Math.round(parseInt(t.slice(a, a + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function ot(t, i) {
  const n = [], a = new Map(t.cards.map((e) => [e.id, e]));
  for (const e of i.cards) {
    const h = a.get(e.id), r = { id: e.id };
    if (!h) {
      n.push({
        kind: "add_card",
        lane: { id: e.laneId },
        label: e.label,
        ...e.duration !== void 0 && { duration: e.duration },
        ...e.lag && { lag: e.lag },
        ...e.dependsOn && { waitsOn: e.dependsOn.map((c) => ({ id: c })) },
        ...e.amount !== void 0 && { amount: e.amount }
      });
      continue;
    }
    h.label !== e.label && n.push({ kind: "rename_card", card: r, label: e.label });
    const u = n.length;
    for (const c of h.dependsOn ?? []) e.dependsOn?.includes(c) || n.push({ kind: "unlink_tasks", card: r, waitsOn: { id: c } });
    for (const c of e.dependsOn ?? []) h.dependsOn?.includes(c) || n.push({ kind: "link_tasks", card: r, waitsOn: { id: c } });
    h.laneId !== e.laneId && n.push({ kind: "move_card", card: r, lane: { id: e.laneId } }), (n.length > u && e.duration !== void 0 && n.slice(u).some((c) => c.kind !== "move_card") || h.duration !== e.duration || (h.lag ?? 0) !== (e.lag ?? 0)) && n.push({ kind: "set_task", card: r, duration: e.duration, lag: e.lag ?? 0 }), e.amount !== void 0 && h.amount !== e.amount && n.push({ kind: "set_amount", card: r, amount: e.amount });
  }
  for (const e of t.cards) i.cards.some((h) => h.id === e.id) || n.push({ kind: "remove_card", card: { id: e.id } });
  i.launch && t.launch?.day !== i.launch.day && n.push({ kind: "set_launch_day", day: i.launch.day }), i.forecast && t.forecast?.target !== i.forecast.target && n.push({ kind: "set_target", amount: i.forecast.target });
  const s = i.lanes.map((e) => ({ id: e.id, by: (e.allocation ?? 0) - (t.lanes.find((h) => h.id === e.id)?.allocation ?? 0) })), o = s.filter((e) => e.by < 0), l = s.filter((e) => e.by > 0);
  for (const e of l)
    for (const h of o) {
      const r = Math.min(e.by, -h.by);
      r <= 0 || (n.push({ kind: "shift_budget", from: { id: h.id }, to: { id: e.id }, amount: r }), e.by -= r, h.by += r);
    }
  for (const e of i.lanes) {
    const h = t.lanes.find((r) => r.id === e.id);
    h && h.label !== e.label && n.push({ kind: "rename_lane", lane: { id: e.id }, label: e.label }), h && h.capacity !== e.capacity && n.push({ kind: "set_lane_capacity", lane: { id: e.id }, capacity: e.capacity ?? null });
  }
  return t.title !== i.title && n.push({ kind: "rename_workshop", title: i.title }), n;
}
function tn(t) {
  const i = t.forecast?.currency;
  return `Forecast ${W(Wt(t), i)} of ${W(t.forecast?.target ?? 0, i)}`;
}
function nn(t) {
  return `${W(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Ot(t, i) {
  return t.cards.filter((n) => St(t, i, n.id) === null).map((n) => n.id);
}
function en(t, i, n, a) {
  for (let s = i; s > 11; s--) {
    const o = Math.max(1, Math.floor(n / (s * 0.55)));
    if (t.split(`
`).reduce((e, h) => e + Math.max(1, Math.ceil(h.length / o)), 0) * s * 1.3 <= a) return s;
  }
  return Math.min(i, 11);
}
function rt(t, i, n, a) {
  const s = a.textColor ?? "#18302d", o = a.borderColor ?? "#667872", l = a.fontSize ?? 14;
  return t.map((e) => {
    const h = e.name.startsWith("handle-"), r = e.text ?? "";
    return { options: {
      id: e.name,
      text: r,
      name: i.cards.find((u) => "card-" + u.id === e.name)?.label ?? r,
      xPos: n.x + e.x,
      yPos: n.y + e.y,
      width: e.width,
      height: e.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${e.width} V ${e.height} H 0 Z`,
      backgroundColor: h ? "transparent" : e.fill ?? a.backgroundColor ?? "#fffdf6",
      foregroundColor: e.ink ?? s,
      borderColor: e.line ?? o,
      borderWidth: h ? 0 : e.lineWidth ?? 1,
      ...a.fontFamily ? { fontFamily: a.fontFamily } : {},
      fontSize: en(r, e.fontSize ?? l, e.width - 12, e.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Rt(t, i) {
  const n = i.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const a = t.cards.find((o) => o.id === n);
  if (a) return `${a.label} length, ${a.duration} days. Left and Right change it.`;
  const s = t.lanes.findIndex((o) => o.id === n);
  return s >= 0 && t.lanes[s + 1] ? `Divider between ${t.lanes[s].label} and ${t.lanes[s + 1].label}. Left and Right move money.` : null;
}
const Pt = "#c2410c", an = 32, sn = 44, lt = (t) => t ? 0 : 22;
function R(t, i = {}) {
  const n = !!i.narrow, a = t.kind === "hiring-plan", s = q(t), o = a ? t.hiring.weeks * 7 : zt(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), l = Vt(t), e = [], h = /* @__PURE__ */ new Map(), r = n ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), u = n ? 8 : 168, c = n ? (r - 88) / o : (r - u - 40) / o, m = (f) => N[t.lanes.findIndex((y) => y.id === f) % N.length], x = (f, y) => {
    const k = t.cards.find((S) => S.id === f), M = s.get(f), v = { x: u + M.from * c, y, width: (M.to - M.from) * c, height: n ? sn : an };
    h.set(f, v);
    const L = l.has(f);
    e.push({
      name: "card-" + f,
      ...v,
      text: n ? "" : a ? k.label : `${k.label} · ${k.duration}d`,
      fill: L ? "#fde3d7" : n ? m(k.laneId) : a ? C(m(k.laneId), 0.45) : "#fffdf6",
      line: L || M.critical && !a ? Pt : "#667872",
      lineWidth: L || M.critical && !a ? 2.5 : 1,
      fontSize: 13
    }), a && n || e.push({ name: "handle-" + f, x: v.x + v.width - lt(n), y: v.y + v.height / 2 - 22, width: 44, height: 44 });
  };
  let p, d, g;
  if (n) {
    const f = (r - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((y, k) => {
      const M = 8 + k * (f + 8);
      e.push({ name: "column-" + y.id, x: M, y: 30, width: f, height: 72, fill: C(m(y.id), 0.6), line: C(m(y.id), 0.1) }), e.push({ name: "lane-" + y.id, x: M + 4, y: 34, width: f - 8, height: 28, text: y.label, fill: m(y.id), fontSize: 14 }), e.push({ name: "caption-" + y.id, x: M + 4, y: 64, width: f - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), g = 124, d = 130, p = 138;
    for (const y of t.cards)
      x(y.id, p + 20), p += 64;
  } else {
    g = 48, d = 56, p = d;
    for (const f of t.lanes) {
      const y = t.cards.filter((M) => M.laneId === f.id), k = Math.max(92, y.length * 44 + 20);
      e.push({ name: "column-" + f.id, x: 0, y: p, width: r, height: k, fill: C(m(f.id), 0.65), line: C(m(f.id), 0.1) }), e.push({ name: "lane-" + f.id, x: 8, y: p + 8, width: u - 24, height: 32, text: f.label, fill: m(f.id), fontSize: 15 }), e.push({ name: "caption-" + f.id, x: 8, y: p + 44, width: u - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), y.forEach((M, v) => x(M.id, p + 10 + v * 44)), p += k + 4;
    }
  }
  return a ? t.hiring.funding && !n && e.push({ name: "handle-funding", x: u + t.hiring.funding.day * c - 22, y: 4, width: 44, height: 44 }) : e.push({ name: "handle-launch", x: u + t.launch.day * c - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: e, width: r, height: p + 8, narrow: n, x0: u, dayW: c, gridTop: d, axisY: g, bars: h };
}
function on(t, i, n) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = n(a.name.slice(8)));
  return i;
}
function rn(t, i) {
  const n = t.x + t.width, a = Math.max(t.x + 4, n - 10), o = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, l = i.y + i.height / 2;
  return { d: `M ${a} ${o} V ${l} H ${i.x}`, arrow: { x: i.x, y: l, angle: 0 } };
}
function ln(t, i) {
  const n = R(t, i.layout), a = t.kind === "hiring-plan", s = q(t), o = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), l = Lt(t), e = [];
  if (l?.workdays)
    for (let c = 0; c < o; c++) ht(l.origin, c) === 6 && e.push({ t: "rect", x: n.x0 + c * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: w.track, opacity: 0.7 });
  for (const c of t.behaviour?.rules ?? []) if (l && c.on && c.kind === "blackout") {
    const m = dt(l.origin, c.start), x = dt(l.origin, c.end) + 1, p = n.x0 + Math.max(0, m) * n.dayW, d = (Math.min(o, x) - Math.max(0, m)) * n.dayW;
    if (d <= 0) continue;
    e.push({ t: "rect", x: p, y: n.gridTop, w: d, h: n.height - 8 - n.gridTop, color: w.refuse, opacity: 0.12 });
    for (let g = p; g < p + d; g += 10) e.push({ t: "line", x1: g, y1: n.gridTop, x2: Math.min(p + d, g + 10), y2: n.gridTop + 10, color: w.refuse, width: 0.6 });
    e.push({ t: "text", x: p + 3, y: n.gridTop + 22, text: c.label + " · " + _(c.start) + "–" + _(c.end), color: w.refuse, size: 11, bold: !0 });
  }
  for (let c = 0; c <= o; c++) {
    const m = n.x0 + c * n.dayW, x = l ? ht(l.origin, c) === 1 : c % 7 === 0;
    if (!x && n.dayW < 6) continue;
    e.push({ t: "line", x1: m, y1: n.gridTop, x2: m, y2: n.height - 8, color: x ? w.week : w.faint, width: x ? 1 : 0.5 });
    const p = a && l && I(l.origin, c).slice(8) <= "07" && x, d = l ? a ? p ? _(I(l.origin, c)).replace(/^\d+ /, "") : "" : _(I(l.origin, c)) : (n.narrow ? "W" : "Week ") + (c / 7 + 1);
    x && d && (!l || a || n.dayW * 7 > 44) && e.push({ t: "text", x: m + 3, y: n.axisY, text: d, color: w.ink, size: 12 });
  }
  for (const c of t.cards) {
    for (const p of c.dependsOn ?? []) {
      const d = n.bars.get(p), g = n.bars.get(c.id);
      if (!d || !g) continue;
      const f = s.get(p).critical && s.get(c.id).critical, y = t.cards.find((k) => k.id === p).label;
      e.push({
        t: "path",
        ...rn(d, g),
        color: f ? Pt : w.ink,
        width: f ? 2 : 1.5,
        unlink: { cardId: c.id, waitsOn: p, label: `Remove the link: ${c.label} waits on ${y}` }
      });
    }
    const m = s.get(c.id), x = n.bars.get(c.id);
    if (a) {
      const p = t.hiring.bands.find((f) => f.id === c.band), d = x.x + x.width, g = n.x0 + o * n.dayW;
      g > d && e.push({ t: "rect", x: d, y: x.y + x.height / 2 - 3, w: g - d, h: 6, rx: 3, color: w.bar, opacity: 0.45 }), e.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(d + 6, g - 120),
        y: n.narrow ? x.y - 6 : x.y + x.height / 2 - 6,
        text: (n.narrow ? c.label + " · " : "") + "starts " + _(I(l.origin, jt(t, c.id))) + (p ? " · " + W(p.monthly, t.hiring.currency) + "/mo" : ""),
        color: w.ink,
        size: 12,
        role: "start-" + c.id
      });
      continue;
    }
    n.narrow && e.push({ t: "text", x: 8, y: x.y - 6, text: `${c.label} · ${c.duration}d`, color: w.ink, size: 13, bold: m.critical }), m.critical || e.push({ t: "text", x: x.x + x.width + (n.narrow ? 48 : 24), y: x.y + x.height / 2 + 4, text: "+" + m.slack + "d", color: w.ink, size: 12, role: "slack-" + c.id });
  }
  if (a) {
    const c = Ut(t), m = t.behaviour?.rules.find((d) => d.on && d.kind === "deadline"), x = m && m.kind === "deadline" && c < m.floor;
    e.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + Yt(c),
      color: x || i.refused ? w.refuse : w.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const p = t.hiring.funding;
    if (p && p.day <= o) {
      const d = n.x0 + p.day * n.dayW;
      e.push({ t: "line", x1: d, y1: 26, x2: d, y2: n.height - 8, color: w.accept, width: 2, dash: "6 4" }), n.narrow || e.push({ t: "rect", x: d - 4, y: 26, w: 8, h: 18, rx: 4, color: w.accept }), e.push({ t: "text", x: Math.max(d + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + W(p.amount, t.hiring.currency) + " · " + _(I(l.origin, p.day)), color: w.accept, size: 12, bold: !0 });
    }
    if (n.narrow && e.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: w.ink, size: 12 }), i.clamp) {
      const d = n.parts.find((g) => g.name === i.clamp.name);
      d && e.push(...wt(n, e, i.clamp.text, d, i.view));
    }
    return e;
  }
  const h = n.x0 + t.launch.day * n.dayW;
  e.push({ t: "line", x1: h, y1: n.narrow ? 112 : 26, x2: h, y2: n.height - 8, color: w.launch, width: 2, dash: "6 4" }), e.push({ t: "rect", x: h - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: w.launch });
  for (const c of t.cards) {
    const m = n.bars.get(c.id);
    e.push({ t: "rect", x: m.x + m.width + (n.narrow ? 4 : -5), y: m.y + 4, w: n.narrow ? 6 : 4, h: m.height - 8, rx: 2, color: w.ink, opacity: 0.55 });
  }
  const r = Q(t), u = Math.max(0, ...[...s.values()].map((c) => c.to));
  if (e.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: l ? "Done " + ut(t, Math.ceil(u) - 1) + " · " + Et(t) + " " + ut(t, t.launch.day) : `Done day ${r} · launch day ${t.launch.day}`,
    color: i.refused ? w.refuse : w.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const c = n.parts.find((m) => m.name === i.clamp.name);
    c && e.push(...wt(n, e, i.clamp.text, c, i.view));
  }
  return e;
}
const U = 13, gt = 16, _t = (t, i) => t * (i ? 0.64 : 0.6), cn = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function hn(t) {
  const i = t.size ?? 13, n = t.text.length * _t(i, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - i, w: n, h: i * 1.3 };
}
function dn(t, i) {
  const n = [];
  for (const a of t.split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= i ? n[n.length - 1] = s + " " + a : n.push(a);
  }
  return n;
}
let nt = null;
function wt(t, i, n, a, s) {
  const o = [...t.bars.values()].map((f) => ({ x: f.x - 4, y: f.y - 3, w: f.width + 8, h: f.height + 6 }));
  for (const f of i)
    f.t === "text" ? o.push(hn(f)) : f.t === "rect" && o.push({ x: f.x - 2, y: f.y - 2, w: f.w + 4, h: f.h + 4 });
  let l = t.narrow ? 6 : t.x0 + 2, e = t.width - 4, h = t.gridTop + 2, r = t.height - 6;
  s && Math.min(e, s.x + s.width - 8) - Math.max(l, s.x + 8) >= 160 && (l = Math.max(l, s.x + 8), e = Math.min(e, s.x + s.width - 8), Math.min(r, s.y + s.height - 8) - Math.max(h, s.y + 8) >= 40 && (h = Math.max(h, s.y + 8), r = Math.min(r, s.y + s.height - 8)));
  const u = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, c = JSON.stringify([n, u, l, e, h, r, o.map((f) => [f.x, f.y, f.w, f.h].map(Math.round))]);
  if (nt?.key === c) return nt.shapes;
  const m = _t(U, !0), x = Math.floor((e - l) / m), p = /* @__PURE__ */ new Map();
  for (const f of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const y = dn(n, Math.max(8, Math.floor(x * f)));
    y.length <= 4 && p.set(y.join(`
`), y);
  }
  let d = null;
  for (const f of p.values()) {
    const y = Math.max(...f.map((M) => M.length)) * m, k = f.length * gt + 2;
    if (!(y > e - l))
      for (let M = h; M + k <= r; M += 3)
        for (let v = l; v + y <= e; v += 6) {
          const L = { x: v, y: M, w: y, h: k }, S = Math.max(L.x - u.x, 0, u.x - (L.x + L.w)), T = Math.max(L.y - u.y, 0, u.y - (L.y + L.h)), G = Math.hypot(S, T) + (f.length - 1) * 24;
          d && G >= d.score || o.every((J) => cn(L, J)) && (d = { box: L, lines: f, score: G });
        }
  }
  const g = d ? [{ t: "text", x: d.box.x, y: d.box.y + U - 1, text: n, lines: d.lines, lineHeight: gt, color: w.refuse, size: U, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: n,
    color: w.refuse,
    size: U,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return nt = { key: c, shapes: g }, g;
}
const P = (t, i = 1, n) => {
  const a = (o, l) => Math.round(o / l) * l, s = { ...t, cards: t.cards.map((o) => {
    const l = o.id === n ? i : 1, e = { ...o, duration: Math.max(l, a(o.duration, l)), lag: Math.max(0, a(o.lag ?? 0, l)) };
    return e.lag || delete e.lag, e;
  }) };
  return t.launch && (s.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (s.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), s;
}, et = (t) => !!t.behaviour || t.kind === "hiring-plan";
function un(t, i, n) {
  if (n !== "l" && n !== "L") return null;
  const a = /^card-(.+)$/.exec(i), s = a && t.cards.find((e) => e.id === a[1]);
  if (!s) return null;
  const o = (e) => t.cards.find((h) => h.id === e)?.label ?? e, l = [
    ...Ot(t, s.id).map((e) => ({
      said: `${s.label} waits on ${o(e)}`,
      edits: [{ kind: "link_tasks", card: { id: s.id }, waitsOn: { id: e } }]
    })),
    ...(s.dependsOn ?? []).map((e) => ({
      said: `${s.label} stops waiting on ${o(e)}`,
      edits: [{ kind: "unlink_tasks", card: { id: s.id }, waitsOn: { id: e } }]
    }))
  ];
  return l.length ? l : `${s.label} has no task it can wait on.`;
}
function fn(t, i, { key: n, shiftKey: a }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = (n === "ArrowLeft" ? -1 : 1) * X(t);
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(s) }];
  if (i === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(s) * 7 }];
  const o = /^(card|handle)-(.+)$/.exec(i), l = o && t.cards.find((e) => e.id === o[2]);
  return l ? a || o[1] === "handle" ? [{ kind: "set_task", card: { id: l.id }, duration: l.duration + s }] : [{ kind: "set_task", card: { id: l.id }, lag: (l.lag ?? 0) + s }] : null;
}
const at = {
  laneCues: !1,
  notes(t, i, n, a) {
    return rt(at.places(t, i).parts, t, n, a);
  },
  editsBetween: ot,
  label: Rt,
  places(t, i) {
    const n = on(t, R(t, i), (a) => {
      const s = t.cards.filter((l) => l.laneId === a), o = q(t);
      return t.kind === "hiring-plan" ? s.length + (s.length === 1 ? " hire" : " hires") : `${s.length} ${s.length === 1 ? "task" : "tasks"} · ${s.filter((l) => o.get(l.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => st(t, ln),
  chooser(t, i, n, a = {}) {
    const s = t.cards.findIndex((o) => o.id === i);
    return s < 0 ? null : t.kind === "hiring-plan" && a.narrow ? () => t : (et(t) ? xn : yn)(t, i, s, Ot(t, i), n, a);
  },
  refusalAt(t, i, n, a, s) {
    const o = R(t, s);
    for (const r of t.cards) {
      if (r.id === i || !tt(o.bars.get(r.id), a)) continue;
      const u = St(t, i, r.id);
      return u ? { laneId: r.laneId, reason: u } : null;
    }
    const l = t.cards.find((r) => r.id === i), e = (l.lag ?? 0) + Math.round((a.x - n.x - o.bars.get(i).x) / o.dayW);
    if (et(t)) {
      const r = q(t).get(i), u = Math.round(r.from + (a.x - n.x - o.bars.get(i).x) / o.dayW), c = (l.lag ?? 0) + Kt(Lt(t)).idx(u) - r.start, m = X(t), x = Ct(t, i, { lag: Math.max(0, Math.round(c / m) * m) });
      return typeof x == "string" ? { laneId: l.laneId, reason: x, lands: !0 } : null;
    }
    const h = Y(t, { cardId: i, field: "lag" });
    return e > h.max ? { laneId: l.laneId, reason: Z(O(t, { cardId: i, field: "lag" }, e), i) ?? h.reasons.max } : null;
  },
  handleDrag(t, i, n, a) {
    const s = R(t, a), o = (x) => F(R(x, a).parts);
    if (t.kind === "hiring-plan" && a.narrow) return null;
    if (et(t)) return pn(t, i, n, a, s, o);
    if (i === "handle-launch") {
      const x = Y(t, { field: "day" }), p = A(t, i, n, o, (d, g) => d.vary(g, K("launch", "day"), { constraint: (f) => [V(f.launch.day, Q(f) - 1e-3), b(f.launch.day, 120)] }).onDrop((f) => P(f)));
      return (d) => {
        const g = Math.round((d.x - n.x + 22 - s.x0) / s.dayW), f = p?.(d) ?? O(t, { field: "day" }, Math.min(x.max, Math.max(x.min, g)));
        return g < x.min ? { next: f, clampedReason: x.reasons.min, refusal: Z(O(t, { field: "day" }, Math.max(5, g))) ?? void 0 } : { next: f };
      };
    }
    const l = i.slice(7), e = t.cards.findIndex((x) => x.id === l);
    if (e < 0) return null;
    const h = { cardId: l, field: "duration" }, r = Y(t, h), u = t.launch.day, c = A(t, i, n, o, (x, p) => x.vary(p, K("cards", e, "duration"), { constraint: (d) => [V(d.cards[e].duration, 1), b(Q(d), u + 1e-3)] }).onDrop((d) => P(d))), m = s.bars.get(l);
    return (x) => {
      const p = Math.round((x.x - n.x + lt(s.narrow) - m.x) / s.dayW), d = Math.min(r.max, Math.max(r.min, p)), g = c?.(x) ?? O(t, h, d);
      return p > r.max ? { next: g, clampedReason: `Launch is day ${u}.`, refusal: Z(O(t, h, Math.min(60, p)), l) ?? r.reasons.max } : p < r.min ? { next: g, clampedReason: r.reasons.min } : { next: g };
    };
  },
  keyEdit: fn,
  keyChoices: un,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on."
};
function xn(t, i, n, a, s, o) {
  const l = X(t), e = bt(t), h = t.cards[n].laneId, r = (d) => {
    if (!e) return d;
    const g = Gt(t, d, /* @__PURE__ */ new Set([i]));
    return typeof g == "string" ? d : g;
  }, u = (d) => r(P(d, l, i)), c = (d) => F(R(r(d), o).parts, a.map((g) => "card-" + g)), x = (o.narrow ? [h] : t.lanes.map((d) => d.id)).flatMap((d) => Tt(t, i, "lag", d === h ? void 0 : d).map((g) => ({ laneId: d, run: g })));
  if (!x.length) return () => t;
  const p = A(t, "card-" + i, s, c, (d, g) => {
    const f = d.closest(x.map(({ laneId: y, run: [k, M] }) => d.vary(
      { ...g, cards: g.cards.map((v, L) => L === n ? { ...v, laneId: y, lag: Math.min(M, Math.max(k, v.lag ?? 0)) } : v) },
      K("cards", n, "lag"),
      { constraint: (v) => [V(v.cards[n].lag ?? 0, k - 0.49), b(v.cards[n].lag ?? 0, M + 0.49)] }
    ))).withBranchTransition(100);
    return a.length ? d.closest(a.map((y) => d.dropTarget("target-" + y, $t(g, i, y)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(f).withBranchTransition(120).onDrop(u) : f.onDrop(u);
  });
  return p ? (d) => u(p(d)) : null;
}
function pn(t, i, n, a, s, o) {
  const l = (f, y) => {
    const k = [];
    for (const M of f) if (y(M)) {
      const v = k.at(-1);
      v && v[1] === M - (f[1] - f[0]) ? v[1] = M : k.push([M, M]);
    }
    return k;
  }, e = (f, y, k) => Array.from({ length: Math.floor((y - f) / k) + 1 }, (M, v) => f + v * k), h = (f, y, k, M, v) => A(t, i, n, o, (L, S) => L.closest(k.map(([T, G]) => L.vary(
    S,
    K(...f),
    { constraint: (J) => [V(y(J), T - 0.49), b(y(J), G + 0.49)] }
  ))).withBranchTransition(100).onDrop((T) => P(T, M, v))), r = (f, y, k, M) => (v) => {
    const L = y(v), S = k(L), T = f?.(v) ?? (S ? t : M(L));
    return S ? { next: T, clampedReason: S, refusal: S } : { next: T };
  };
  if (i === "handle-launch" || i === "handle-funding") {
    const f = i === "handle-launch", y = (S) => f ? O(t, { field: "day" }, S) : { ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: S } } }, k = (S) => f && (S < 5 || S > 120) ? "Launch day is a whole day from 5 to 120." : f && zt(t) && S < Y(t, { field: "day" }).min ? Z(y(S)) ?? "Every task ends by " + Et(t) + "." : mn(t, y(S)), M = f ? e(5, 120, 1) : e(0, t.hiring.weeks * 7, 1), v = l(M, (S) => !k(S)), L = v.length ? h(f ? ["launch", "day"] : ["hiring", "funding", "day"], (S) => f ? S.launch.day : S.hiring.funding.day, v, 1) : null;
    return r(L, (S) => Math.round((S.x - n.x + 22 - s.x0) / s.dayW), k, y);
  }
  const u = i.slice(7), c = t.cards.findIndex((f) => f.id === u);
  if (c < 0) return null;
  const m = X(t), x = s.bars.get(u), p = Tt(t, u, "duration"), d = p.length ? h(["cards", c, "duration"], (f) => f.cards[c].duration, p, m, u) : null;
  return r(
    d,
    (f) => t.cards[c].duration + Math.round((f.x - n.x + lt(s.narrow) - x.x - x.width) / s.dayW),
    (f) => {
      const y = Ct(t, u, { duration: Math.max(m, Math.round(f / m) * m) });
      return typeof y == "string" ? y : null;
    },
    (f) => O(t, { cardId: u, field: "duration" }, f)
  );
}
function mn(t, i) {
  const n = t.behaviour ? Jt(t, i) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function yn(t, i, n, a, s, o) {
  const l = t.launch.day, e = (r) => F(R(r, o).parts, a.map((u) => "card-" + u)), h = A(t, "card-" + i, s, e, (r, u) => {
    const c = o.narrow ? u.lanes.filter((x) => x.id === u.cards[n].laneId) : u.lanes, m = r.closest(c.map((x) => r.vary(
      { ...u, cards: u.cards.map((p, d) => d === n ? { ...p, laneId: x.id, lag: p.lag ?? 0 } : p) },
      K("cards", n, "lag"),
      { constraint: (p) => [V(p.cards[n].lag ?? 0, -1e-3), b(Q(p), l + 1e-3)] }
    )));
    return a.length ? r.closest(a.map((x) => r.dropTarget("target-" + x, $t(u, i, x)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(m).withBranchTransition(120).onDrop((x) => P(x)) : m.onDrop((x) => P(x));
  });
  return h ? (r) => P(h(r)) : null;
}
const B = 76;
function D(t, i = {}) {
  const n = !!i.narrow, a = [], s = t.lanes.map((h) => t.cards.filter((r) => r.laneId === h.id).length), o = (h) => t.lanes[h].role === "won" ? "#bfe3cf" : t.lanes[h].role === "lost" ? "#e4dcdc" : N[h % N.length];
  let l, e;
  if (n) {
    l = Math.max(300, i.width ?? 390);
    let h = B;
    t.lanes.forEach((r, u) => {
      const c = 96 + (s[u] + 1) * 64;
      a.push({ name: "column-" + r.id, x: 2, y: h, width: l - 4, height: c, fill: C(o(u), 0.6), line: C(o(u), 0.1) });
      const m = (l - 16) * 0.36;
      a.push({ name: "lane-" + r.id, x: 8, y: h + 6, width: m, height: 36, text: r.label, fill: o(u), fontSize: 15 }), a.push({ name: "caption-" + r.id, x: 8 + m + 6, y: h + 6, width: l - 16 - m - 6, height: 56, text: ft(t, r.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((x) => x.laneId === r.id).forEach((x, p) => a.push({ name: "card-" + x.id, x: 8, y: h + 72 + p * 64, width: l - 16, height: 56, text: kt(t, x.id), fontSize: 15 })), h += c + 10;
    }), e = h;
  } else {
    const u = 116 + (Math.max(...s) + 1) * 88;
    t.lanes.forEach((c, m) => {
      const x = m * 244;
      a.push({ name: "column-" + c.id, x: x + 2, y: B, width: 240, height: u, fill: C(o(m), 0.6), line: C(o(m), 0.1) }), a.push({ name: "lane-" + c.id, x: x + 8, y: B + 6, width: 228, height: 58, text: c.label, fill: o(m), fontSize: 16 }), a.push({ name: "caption-" + c.id, x: x + 8, y: B + 66, width: 228, height: 48, text: ft(t, c.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((p) => p.laneId === c.id).forEach((p, d) => a.push({ name: "card-" + p.id, x: x + 8, y: B + 116 + d * 88, width: 228, height: 76, text: kt(t, p.id), fontSize: 15 }));
    }), l = t.lanes.length * 244, e = B + u;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(l, 520), height: 34, text: tn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: a, width: l, height: e };
}
function kt(t, i) {
  const n = t.cards.find((a) => a.id === i);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + W(n.amount, t.forecast.currency);
}
function gn(t, i) {
  const { width: n } = D(t, i.layout), a = t.forecast.target, s = Wt(t), o = Math.max(a * 1.25, s), l = n - 8, e = s >= a;
  return [
    { t: "rect", x: 4, y: 42, w: l, h: 14, rx: 7, color: w.track },
    { t: "rect", x: 4, y: 42, w: l * s / o, h: 14, rx: 7, color: e ? w.accept : w.bar },
    { t: "line", x1: 4 + l * a / o, y1: 36, x2: 4 + l * a / o, y2: 62, color: w.ink, width: 2 },
    { t: "text", x: 4 + l * a / o, y: 72, text: "Target " + W(a, t.forecast.currency), color: w.ink, size: 14, anchor: "middle" }
  ];
}
const wn = {
  laneCues: !0,
  places: (t, i) => D(t, i),
  notes: (t, i, n, a) => rt(D(t, i).parts, t, n, a),
  editsBetween: ot,
  layer: (t) => st(t, gn),
  chooser(t, i, n, a = {}) {
    const s = Mt(t, i).map((o) => vt(t, i, o.id));
    return s.length < 2 ? null : At(A(t, "card-" + i, n, (o) => F(D(o, a).parts), (o, l) => o.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l, { gapIn: 40, gapOut: 56 })), t, i, D(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: o } = D(t, s), l = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === l.laneId || !tt(o.find((r) => r.name === "column-" + e.id), a)) continue;
      const h = Zt(t, i, e.id);
      return h ? { laneId: e.id, reason: h } : null;
    }
    return null;
  },
  handleDrag: () => null
}, z = 48, H = 960, Bt = 900;
function $(t, i = {}) {
  const n = !!i.narrow, a = t.budget.total, s = [], o = [], l = t.lanes.map((r) => t.cards.filter((u) => u.laneId === r.id).length);
  let e, h;
  if (n) {
    e = Math.max(300, i.width ?? 390);
    let r = z;
    t.lanes.forEach((u, c) => {
      const m = Math.max(100 + (l[c] + 1) * 64, u.allocation / a * Bt);
      o.push({ laneId: u.id, start: r, size: m }), r += m;
    }), h = r + 8;
  } else {
    e = H;
    let r = 0;
    for (const u of t.lanes)
      o.push({ laneId: u.id, start: r, size: u.allocation / a * H }), r += u.allocation / a * H;
    h = z + 100 + (Math.max(...l) + 1) * 64;
  }
  return t.lanes.forEach((r, u) => {
    const { start: c, size: m } = o[u], x = N[u % N.length], p = n ? { x: 2, y: c + 1, width: e - 4, height: m - 2 } : { x: c + 1, y: z, width: Math.max(4, m - 2), height: h - z }, d = { x: p.x + 5, y: p.y, width: Math.max(10, p.width - 10) };
    s.push({ name: "column-" + r.id, ...p, fill: C(x, 0.6), line: C(x, 0.1) });
    const g = n ? d.width * 0.36 : d.width;
    if (s.push({ name: "lane-" + r.id, x: d.x, y: d.y + 6, width: g, height: 32, text: r.label, fill: x, fontSize: 15 }), s.push({
      name: "caption-" + r.id,
      x: n ? d.x + g + 6 : d.x,
      y: d.y + (n ? 6 : 40),
      width: n ? d.width - g - 6 : d.width,
      height: n ? 50 : 40,
      text: n ? xt(t, r.id).replace(" · ", `
`) : xt(t, r.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((f) => f.laneId === r.id).forEach((f, y) => s.push({
      name: "card-" + f.id,
      x: d.x,
      y: d.y + 100 + y * 64,
      width: d.width,
      height: 56,
      text: f.label + `
` + W(f.amount, t.budget.currency),
      fontSize: 14
    })), u < t.lanes.length - 1) {
      const f = c + m;
      s.push(n ? { name: "handle-" + r.id, x: e - 96, y: f - 22, width: 88, height: 44 } : { name: "handle-" + r.id, x: f - 22, y: z - 6, width: 44, height: 48 });
    }
  }), { parts: s, width: e, height: h, segments: o, narrow: n };
}
function kn(t, i) {
  const n = $(t, i.layout), a = t.budget.total, s = [{ t: "text", x: 4, y: 28, text: nn(t), color: w.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((o, l) => {
    const e = n.segments[l], h = o.allocation, r = Xt(t, o.id);
    if (n.narrow) {
      const u = e.start + 50, c = 8, m = n.width - 16;
      s.push({ t: "rect", x: c, y: u, w: m, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: c, y: u, w: m * r / h || 0, h: 10, rx: 5, color: w.bar }), o.floor !== void 0 && s.push({ t: "line", x1: c + m * o.floor / h, y1: u - 4, x2: c + m * o.floor / h, y2: u + 14, color: w.ink, width: 2 });
    } else {
      const u = H / a, c = z + 86;
      s.push({ t: "rect", x: e.start + 6, y: c, w: e.size - 12, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: e.start + 6, y: c, w: Math.max(0, (e.size - 12) * r / h || 0), h: 10, rx: 5, color: w.bar }), o.floor !== void 0 && s.push({ t: "line", x1: e.start + o.floor * u, y1: c - 6, x2: e.start + o.floor * u, y2: c + 16, color: w.ink, width: 2 }), o.cap !== void 0 && e.start + o.cap * u <= n.width && s.push({ t: "line", x1: e.start + o.cap * u, y1: c - 6, x2: e.start + o.cap * u, y2: c + 16, color: w.refuse, width: 2, dash: "3 2" });
    }
    if (l < t.lanes.length - 1) {
      const u = e.start + e.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: u, x2: n.width - 2, y2: u, color: w.ink, width: 2 } : { t: "line", x1: u, y1: z, x2: u, y2: n.height, color: w.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: u - 4, w: 32, h: 8, rx: 4, color: w.ink } : { t: "rect", x: u - 4, y: z + 2, w: 8, h: 30, rx: 4, color: w.ink });
    }
  }), i.clamp) {
    const o = n.parts.find((l) => l.name === i.clamp.name);
    o && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(o.x + 22, 120), n.width - 120),
      y: n.narrow ? o.y + 8 : z - 12,
      text: i.clamp.text,
      color: w.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const Mn = (t, i) => Math.round(t / i) * i, vn = {
  laneCues: !0,
  notes: (t, i, n, a) => rt($(t, i).parts, t, n, a),
  editsBetween: ot,
  label: Rt,
  places(t, i) {
    const { parts: n, width: a, height: s } = $(t, i);
    return { parts: n, width: a, height: s };
  },
  layer: (t) => st(t, kn),
  chooser(t, i, n, a = {}) {
    const s = Mt(t, i).map((o) => vt(t, i, o.id));
    return s.length < 2 ? null : At(A(t, "card-" + i, n, (o) => F($(o, a).parts), (o, l) => o.closest(s).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l)), t, i, $(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: o } = $(t, s), l = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === l.laneId || !tt(o.find((r) => r.name === "column-" + e.id), a)) continue;
      const h = Qt(t, i, e.id);
      return h ? { laneId: e.id, reason: h } : null;
    }
    return null;
  },
  handleDrag(t, i, n, a) {
    const s = i.slice(7), o = t.lanes.findIndex((p) => p.id === s), l = t.lanes[o + 1];
    if (o < 0 || !l) return null;
    const e = qt(t, { laneId: s }), h = t.budget.step, r = (p) => {
      const d = Math.min(e.max, Math.max(e.min, Mn(p, h)));
      return pt(t, l.id, s, d);
    }, u = $(t, a), c = u.narrow ? Bt / t.budget.total : H / t.budget.total, m = u.parts.find((p) => p.name === i), x = A(t, i, n, (p) => F($(p, a).parts), (p) => p.varyFunc([0], ([d]) => pt(t, l.id, s, d), { constraint: (d) => [
      ...Ht([e.min, d.lanes[o].allocation - t.lanes[o].allocation, e.max])
    ] }));
    return (p) => {
      const g = (u.narrow ? p.y - n.y - m.y : p.x - n.x - m.x) / c, f = x?.(p), y = f ? f.lanes[o].allocation - t.lanes[o].allocation : g, k = { next: r(y) };
      return g > e.max + h / 2 ? { ...k, clampedReason: e.reasons.max } : g < e.min - h / 2 ? { ...k, clampedReason: e.reasons.min } : k;
    };
  },
  keyEdit(t, i, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const a = /^handle-(.+)$/.exec(i)?.[1], s = t.lanes.findIndex((r) => r.id === a), o = t.lanes[s + 1];
    if (s < 0 || !o) return null;
    const l = n === "ArrowRight" || n === "ArrowDown", e = t.budget.step;
    return [l ? { kind: "shift_budget", from: { id: o.id }, to: { id: a }, amount: e } : { kind: "shift_budget", from: { id: a }, to: { id: o.id }, amount: e }];
  }
}, Dt = { "launch-plan": at, "hiring-plan": at, pipeline: wn, budget: vn };
function En(t, i) {
  Dt[t] = i;
}
function $n(t) {
  const i = Dt[t];
  if (!i && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return i;
}
function Wn(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Rn as amountLimits,
  Pn as amountOf,
  Le as amountRules,
  _n as bandOf,
  Ce as behaviourEditsBetween,
  Wn as boardLayoutFor,
  xt as budgetCaption,
  Xt as budgetCommitted,
  nn as budgetHeader,
  vn as budgetKit,
  $ as budgetLayout,
  qt as budgetLimits,
  Qt as budgetRefusal,
  ze as budgetRules,
  Te as budgetShiftLimits,
  Ee as budgetShiftRefusal,
  Ie as byOrder,
  bt as cascadeStops,
  He as checkNest,
  Ke as checkNestMove,
  Jt as checkTime,
  Lt as clockOf,
  st as createBoardLayer,
  Bn as currencyOf,
  Dn as dateName,
  Nn as dayFromWords,
  Kt as dayMap,
  ut as dayWords,
  Fn as days,
  In as downstreamTasks,
  Ve as extend,
  Hn as extendWorkshopEdits,
  Kn as goLiveSample,
  Rt as handleLabel,
  A as headlessDrag,
  Vn as hireLagFor,
  jt as hireStarts,
  bn as hiringPlanRules,
  Gn as hiringPlanSample,
  Gt as holdOthers,
  tt as inside,
  be as isOrderKey,
  xi as isOrgChart,
  I as isoAt,
  Jn as isoTime,
  $n as kitFor,
  Q as launchFinish,
  zt as launchHard,
  jn as launchIndex,
  R as launchLayout,
  St as launchLinkRefusal,
  Ot as launchLinkTargets,
  Z as launchOverrun,
  Un as launchPlanCaption,
  at as launchPlanKit,
  Y as launchPlanLimits,
  Yn as launchPlanRefusal,
  Zn as launchPlanRules,
  qn as launchPlanSample,
  Qn as launchTaskText,
  w as layerInk,
  Tt as legalRuns,
  Et as lineWord,
  W as money,
  Xn as monthNames,
  Ge as nestAlias,
  Je as nestAreas,
  pi as nestAxes,
  je as nestCardText,
  Ue as nestDepth,
  Ye as nestDrags,
  Ze as nestEmptyDrop,
  qe as nestFamily,
  Qe as nestKids,
  Xe as nestLegal,
  ti as nestMeasure,
  ni as nestMeasureWords,
  ei as nestPlace,
  mi as nestQuadrants,
  ii as nestRoots,
  ai as nestRules,
  yi as nestScores,
  si as nestSentence,
  oi as nestSubtree,
  te as nextCardId,
  ne as nextMonday,
  ee as noteNumbers,
  dt as offsetOf,
  ri as orderBetween,
  li as orderKeys,
  ie as ownField,
  rt as partNotes,
  F as partsGeometry,
  Vt as pastTheLine,
  ft as pipelineCaption,
  Wt as pipelineForecast,
  tn as pipelineGauge,
  wn as pipelineKit,
  D as pipelineLayout,
  $e as pipelineLimits,
  Zt as pipelineRefusal,
  We as pipelineRules,
  Ae as planBudgetMove,
  ae as planDrags,
  se as planEdit,
  oe as planFixed,
  re as planLaunchPlanMove,
  Oe as planPipelineMove,
  le as planProblem,
  Re as planSamples,
  ce as planWords,
  he as presetRules,
  gi as quadrantOf,
  de as readClock,
  ue as readNoteNumbers,
  En as registerBoardKit,
  ci as registerNestPlus,
  fe as renamedNumbers,
  yt as renderLayerShapes,
  Pe as restoreWorkshop,
  hi as roleOf,
  xe as runwayCap,
  pe as runwayHeader,
  Ut as runwayMonths,
  Yt as runwayWords,
  _e as sampleBudget,
  me as sampleLaunchPlan,
  Be as samplePipeline,
  q as scheduleLaunch,
  wi as scoreBoard,
  ki as scoresIn,
  pt as shiftBudget,
  _ as shortDate,
  X as snapStep,
  di as tidyKeys,
  ye as timeFamily,
  ge as timeRuleKindIds,
  we as timeSentence,
  C as tint,
  Ct as tryTask,
  De as validateBudget,
  ke as validateHiringPlan,
  Me as validateLaunchPlan,
  ui as validateNest,
  Ne as validatePipeline,
  ht as weekdayAt,
  ve as weekendAt,
  $t as withLink,
  O as withTaskValue,
  ot as workshopEditsBetween
};
