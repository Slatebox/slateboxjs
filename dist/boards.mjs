import { Vec2 as st, getElementPositionCheap as Nt, translate as Ft, dragSpecToBehavior as Dt, param as wt, moreThan as kt, lessThan as Mt, inOrder as Ht } from "./dragology.mjs";
import { laneColors as _, workshopDestinations as vt, workshopCandidate as St } from "./workshop-model.mjs";
import { B as J, $ as U, X as H, _ as q, m as E, J as Lt, u as It, v as Ct, a2 as b, z as Tt, L as Kt, a5 as bt, a6 as Gt, a0 as Vt, ad as jt, C as Jt, P as ot, a1 as Ut, F as Yt, A as Zt, ab as qt, a8 as Qt, a7 as Wt, Y as $t, w as rt, j as lt, s as R, f as F, ae as Xt, ak as tn, al as nn } from "./plans-9hluCcMm.mjs";
import { a as Kn, d as bn, ag as Gn, c as Vn, p as jn, t as Jn, ao as Un, a4 as Yn, N as Zn, a3 as qn, W as Qn, g as Xn, af as te, aj as ne, h as ee, i as ie, M as ae, Z as se, K as oe, I as re, U as le, l as ce, Q as he, O as de, e as ue, n as fe, q as xe, b as pe, o as ge, E as me, T as ye, y as we, H as ke, x as Me, D as ve, S as Se, V as Le, an as Ce, r as Te, am as We, ai as $e, R as ze, ac as Ee, aa as Re, a9 as Oe, ah as Ae, G as Pe, k as _e } from "./plans-9hluCcMm.mjs";
import G from "react";
import { pipelineForecast as zt, pipelineRefusal as en, pipelineCaption as ct, budgetLimits as an, budgetRefusal as sn, budgetCaption as ht, shiftBudget as dt, budgetCommitted as on } from "./workshop-rules.mjs";
import { amountRules as Ne, behaviourEditsBetween as Fe, budgetRules as De, budgetShiftLimits as He, budgetShiftRefusal as Ie, pipelineLimits as Ke, pipelineRules as be, planBudgetMove as Ge, planPipelineMove as Ve, planSamples as je, restoreWorkshop as Je, sampleBudget as Ue, samplePipeline as Ye, validateBudget as Ze, validatePipeline as qe } from "./workshop-rules.mjs";
import { byOrder as Xe, checkNest as ti, checkNestMove as ni, extend as ei, isOrderKey as ii, nestAlias as ai, nestAreas as si, nestCardText as oi, nestDepth as ri, nestDrags as li, nestEmptyDrop as ci, nestFamily as hi, nestKids as di, nestLegal as ui, nestMeasure as fi, nestMeasureWords as xi, nestPlace as pi, nestRoots as gi, nestRules as mi, nestSentence as yi, nestSubtree as wi, orderBetween as ki, orderKeys as Mi, registerNestPlus as vi, roleOf as Si, tidyKeys as Li, validateNest as Ci } from "./workshop-nest.mjs";
import { isOrgChart as Wi, nestAxes as $i, nestQuadrants as zi, nestScores as Ei, quadrantOf as Ri, scoreBoard as Oi, scoresIn as Ai } from "./workshop-nest-plus.mjs";
const y = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, Q = "http://www.w3.org/2000/svg", ut = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function $(t, i, e) {
  const a = document.createElementNS(Q, t);
  for (const [s, r] of Object.entries(i)) a.setAttribute(s, String(r));
  return e?.fill && (a.setAttribute("fill", ut(e.fill)), a.style.setProperty("fill", e.fill)), e?.stroke && (a.setAttribute("stroke", ut(e.stroke)), a.style.setProperty("stroke", e.stroke)), a;
}
function ft(t, i, e, a) {
  const s = typeof document < "u" ? document.activeElement : null, r = s && t.contains(s) ? s.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const c = [];
  for (const n of i)
    if (n.t === "line")
      t.appendChild($("line", {
        x1: n.x1,
        y1: n.y1,
        x2: n.x2,
        y2: n.y2,
        "stroke-width": n.width ?? 1,
        ...n.dash ? { "stroke-dasharray": n.dash } : {}
      }, { stroke: n.color }));
    else if (n.t === "rect")
      t.appendChild($("rect", {
        x: n.x,
        y: n.y,
        width: Math.max(0, n.w),
        height: Math.max(0, n.h),
        rx: n.rx ?? 0,
        ...n.opacity !== void 0 ? { opacity: n.opacity } : {},
        ...n.role ? { "data-board-layer": n.role } : {}
      }, { fill: n.color }));
    else if (n.t === "text") {
      const o = $("text", {
        x: n.x,
        y: n.y,
        "font-size": n.size ?? 13,
        "text-anchor": n.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...n.bold ? { "font-weight": 600 } : {},
        ...n.role ? { "data-board-layer": n.role } : {}
      }, { fill: n.color });
      n.lines && n.lines.length > 1 ? n.lines.forEach((l, d) => {
        const h = $("tspan", { x: n.x, dy: d ? n.lineHeight ?? Math.round((n.size ?? 13) * 1.25) : 0 });
        h.textContent = d < n.lines.length - 1 ? l + " " : l, o.appendChild(h);
      }) : o.textContent = n.text, t.appendChild(o);
    } else {
      if (n.unlink && e) {
        const { cardId: o, waitsOn: l, label: d } = n.unlink, h = l + ">" + o, p = a?.armed === h, f = $("path", {
          d: n.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": h,
          "aria-label": p ? d + ". Tap again to remove it." : d,
          role: "button",
          tabindex: 0,
          ...p ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: p ? y.refuse : "transparent" });
        let x = !1;
        f.addEventListener("pointerdown", (u) => {
          u.stopPropagation(), x = u.pointerType === "touch" || u.pointerType === "pen";
        }), f.addEventListener("click", (u) => {
          if (u.stopPropagation(), x && a && a.armed !== h) {
            a.arm(h);
            return;
          }
          a?.arm(null), e(o, l);
        }), f.addEventListener("keydown", (u) => {
          u.key !== "Enter" && u.key !== " " || (u.preventDefault(), u.stopPropagation(), e(o, l));
        }), f.addEventListener("focus", () => {
          f.style.setProperty("stroke", y.accept), f.setAttribute("opacity", "0.35");
        }), f.addEventListener("blur", () => {
          p || (f.style.setProperty("stroke", "transparent"), f.removeAttribute("opacity"));
        }), t.appendChild(f), c.push(f);
      }
      if (t.appendChild($("path", { d: n.d, fill: "none", "stroke-width": n.width ?? 1.5, "pointer-events": "none" }, { stroke: n.color })), n.arrow) {
        const { x: o, y: l, angle: d } = n.arrow;
        t.appendChild($("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${o} ${l}) rotate(${d})`, "pointer-events": "none" }, { fill: n.color }));
      }
      if (n.unlink && a?.armed === n.unlink.waitsOn + ">" + n.unlink.cardId && n.arrow) {
        const o = $("text", {
          x: n.arrow.x - 6,
          y: n.arrow.y - 14,
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
  r && c.find((n) => n.getAttribute("data-board-link") === r)?.focus({ preventScroll: !0 });
}
function tt(t, i) {
  const e = t?.canvas?.node, a = document.createElementNS(Q, "g");
  a.setAttribute("data-board-layer", ""), a.setAttribute("pointer-events", "none");
  const s = document.createElementNS(Q, "g");
  s.setAttribute("data-board-layer-top", ""), s.setAttribute("pointer-events", "none");
  let r = !1, c = null, n;
  const o = {
    armed: null,
    arm(d) {
      clearTimeout(n), o.armed = d, d && (n = setTimeout(() => o.arm(null), 5e3), c?.[2].announce?.("Link selected. Tap it again to remove it.")), c && l.draw(...c);
    }
  }, l = {
    draw(d, h, p) {
      if (r || !e) return;
      c = [d, h, p];
      const { origin: f } = p, x = i(h ?? d, p, d), u = (k) => k.t === "text" && (k.role === "clamp" || k.role === "refusal") || k.t === "rect" && !!k.role?.startsWith("grip-");
      for (const k of [a, s]) k.setAttribute("transform", `translate(${f.x} ${f.y})`);
      ft(a, x.filter((k) => !u(k)), p.onUnlink, o), ft(s, x.filter(u));
      const m = p.above && p.above.parentNode === e ? p.above : null, g = m ? m.nextSibling : e.firstChild;
      (a.parentNode !== e || a.previousSibling !== m) && e.insertBefore(a, g === a ? a.nextSibling : g), s.firstChild && e.lastChild !== s ? e.appendChild(s) : !s.firstChild && s.parentNode && s.remove();
    },
    destroy() {
      r = !0, clearTimeout(n), a.remove(), s.remove();
    }
  };
  return l;
}
function I(t, i = []) {
  const e = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return G.createElement(
    "g",
    null,
    ...e.map((a) => /* @__PURE__ */ G.createElement("g", { id: a.name, transform: Ft(a.x, a.y) }, /* @__PURE__ */ G.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ G.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
  );
}
function K(t, i, e, a, s) {
  let r;
  const n = {
    draggable: (l) => (r ?? (r = l.d), a(l.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: st(e.x, e.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!Nt(n, t) || !r) return null;
  const o = Dt(s(r, t), n);
  return (l) => o({ pointer: st(l.x, l.y) }).dropState;
}
const Y = (t, i, e = 0) => !!t && i.x >= t.x - e && i.x <= t.x + t.width + e && i.y >= t.y - e && i.y <= t.y + t.height + e;
function Et(t, i, e, a, s) {
  if (!t) return null;
  const r = i.cards.find((c) => c.id === e).laneId;
  return (c) => {
    const n = t(c);
    if (n !== i && JSON.stringify(n) !== JSON.stringify(i)) return n;
    const o = a.find((l) => l.name.startsWith("column-") && l.name !== "column-" + r && Y(l, c));
    return o && s.find((l) => l.cards.find((d) => d.id === e).laneId === o.name.slice(7)) || n;
  };
}
function C(t, i) {
  const e = (a) => Math.round(parseInt(t.slice(a, a + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + e(1) + e(3) + e(5);
}
function nt(t, i) {
  const e = [], a = new Map(t.cards.map((n) => [n.id, n]));
  for (const n of i.cards) {
    const o = a.get(n.id), l = { id: n.id };
    if (!o) {
      e.push({
        kind: "add_card",
        lane: { id: n.laneId },
        label: n.label,
        ...n.duration !== void 0 && { duration: n.duration },
        ...n.lag && { lag: n.lag },
        ...n.dependsOn && { waitsOn: n.dependsOn.map((h) => ({ id: h })) },
        ...n.amount !== void 0 && { amount: n.amount }
      });
      continue;
    }
    o.label !== n.label && e.push({ kind: "rename_card", card: l, label: n.label });
    const d = e.length;
    for (const h of o.dependsOn ?? []) n.dependsOn?.includes(h) || e.push({ kind: "unlink_tasks", card: l, waitsOn: { id: h } });
    for (const h of n.dependsOn ?? []) o.dependsOn?.includes(h) || e.push({ kind: "link_tasks", card: l, waitsOn: { id: h } });
    o.laneId !== n.laneId && e.push({ kind: "move_card", card: l, lane: { id: n.laneId } }), (e.length > d && n.duration !== void 0 && e.slice(d).some((h) => h.kind !== "move_card") || o.duration !== n.duration || (o.lag ?? 0) !== (n.lag ?? 0)) && e.push({ kind: "set_task", card: l, duration: n.duration, lag: n.lag ?? 0 }), n.amount !== void 0 && o.amount !== n.amount && e.push({ kind: "set_amount", card: l, amount: n.amount });
  }
  for (const n of t.cards) i.cards.some((o) => o.id === n.id) || e.push({ kind: "remove_card", card: { id: n.id } });
  i.launch && t.launch?.day !== i.launch.day && e.push({ kind: "set_launch_day", day: i.launch.day }), i.forecast && t.forecast?.target !== i.forecast.target && e.push({ kind: "set_target", amount: i.forecast.target });
  const s = i.lanes.map((n) => ({ id: n.id, by: (n.allocation ?? 0) - (t.lanes.find((o) => o.id === n.id)?.allocation ?? 0) })), r = s.filter((n) => n.by < 0), c = s.filter((n) => n.by > 0);
  for (const n of c)
    for (const o of r) {
      const l = Math.min(n.by, -o.by);
      l <= 0 || (e.push({ kind: "shift_budget", from: { id: o.id }, to: { id: n.id }, amount: l }), n.by -= l, o.by += l);
    }
  for (const n of i.lanes) {
    const o = t.lanes.find((l) => l.id === n.id);
    o && o.label !== n.label && e.push({ kind: "rename_lane", lane: { id: n.id }, label: n.label }), o && o.capacity !== n.capacity && e.push({ kind: "set_lane_capacity", lane: { id: n.id }, capacity: n.capacity ?? null });
  }
  return t.title !== i.title && e.push({ kind: "rename_workshop", title: i.title }), e;
}
function rn(t) {
  const i = t.forecast?.currency;
  return `Forecast ${E(zt(t), i)} of ${E(t.forecast?.target ?? 0, i)}`;
}
function ln(t) {
  return `${E(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Rt(t, i) {
  return t.cards.filter((e) => Lt(t, i, e.id) === null).map((e) => e.id);
}
function cn(t, i, e, a) {
  for (let s = i; s > 11; s--) {
    const r = Math.max(1, Math.floor(e / (s * 0.55)));
    if (t.split(`
`).reduce((n, o) => n + Math.max(1, Math.ceil(o.length / r)), 0) * s * 1.3 <= a) return s;
  }
  return Math.min(i, 11);
}
function et(t, i, e, a) {
  const s = a.textColor ?? "#18302d", r = a.borderColor ?? "#667872", c = a.fontSize ?? 14;
  return t.map((n) => {
    const o = n.name.startsWith("handle-"), l = n.text ?? "";
    return { options: {
      id: n.name,
      text: l,
      name: i.cards.find((d) => "card-" + d.id === n.name)?.label ?? l,
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
      fontSize: cn(l, n.fontSize ?? c, n.width - 12, n.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Ot(t, i) {
  const e = i.slice(7), a = J(i), s = a !== null && t.cards.find((n) => n.id === a);
  if (s) return `${s.label} start, ${U(t, H(t).get(s.id).from)}. Left and Right move it; the end stays.`;
  if (e === "launch") return t.clock ? `${q(t).charAt(0).toUpperCase() + q(t).slice(1)}, ${U(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const r = t.cards.find((n) => n.id === e);
  if (r) return `${r.label} length, ${r.duration} days. Left and Right change it.`;
  const c = t.lanes.findIndex((n) => n.id === e);
  return c >= 0 && t.lanes[c + 1] ? `Divider between ${t.lanes[c].label} and ${t.lanes[c + 1].label}. Left and Right move money.` : null;
}
const At = "#c2410c", hn = 32, dn = 44, un = (t, i) => t ? 0 : Math.min(22, Math.max(4, Math.floor(i / 3)));
function P(t, i = {}) {
  const e = !!i.narrow, a = t.kind === "hiring-plan", s = H(t), r = a ? t.hiring.weeks * 7 : Vt(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), c = jt(t), n = [], o = /* @__PURE__ */ new Map(), l = e ? 8 : 168, d = e ? 88 : l + 40, h = e ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), p = i.dayWidth ? Math.max(h, Math.ceil(d + r * i.dayWidth)) : h, f = i.dayWidth ?? (p - d) / r, x = (w) => _[t.lanes.findIndex((M) => M.id === w) % _.length], u = (w, M) => {
    const S = t.cards.find((W) => W.id === w), v = s.get(w), L = { x: l + v.from * f, y: M, width: (v.to - v.from) * f, height: e ? dn : hn };
    o.set(w, L);
    const B = c.has(w);
    if (n.push({
      name: "card-" + w,
      ...L,
      text: e ? "" : a ? S.label : `${S.label} · ${S.duration}d`,
      fill: B ? "#fde3d7" : e ? x(S.laneId) : a ? C(x(S.laneId), 0.45) : "#fffdf6",
      line: B || v.critical && !a ? At : "#667872",
      lineWidth: B || v.critical && !a ? 2.5 : 1,
      fontSize: 13
    }), !(a && e)) {
      const W = un(e, L.width), N = e ? 44 : 22, it = L.y + L.height / 2 - 22, at = e ? Math.max(-12, L.x - N) : L.x - N;
      n.push({ name: Zt(w), x: at, y: it, width: Math.max(24, L.x + W - at), height: 44 }), n.push({ name: "handle-" + w, x: L.x + L.width - W, y: it, width: W + N, height: 44 });
    }
  };
  let m, g, k;
  if (e) {
    const w = (p - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((M, S) => {
      const v = 8 + S * (w + 8);
      n.push({ name: "column-" + M.id, x: v, y: 30, width: w, height: 72, fill: C(x(M.id), 0.6), line: C(x(M.id), 0.1) }), n.push({ name: "lane-" + M.id, x: v + 4, y: 34, width: w - 8, height: 28, text: M.label, fill: x(M.id), fontSize: 14 }), n.push({ name: "caption-" + M.id, x: v + 4, y: 64, width: w - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), k = 124, g = 130, m = 138;
    for (const M of t.cards)
      u(M.id, m + 20), m += 64;
  } else {
    k = 48, g = 56, m = g;
    for (const w of t.lanes) {
      const M = t.cards.filter((v) => v.laneId === w.id), S = Math.max(92, M.length * 44 + 20);
      n.push({ name: "column-" + w.id, x: 0, y: m, width: p, height: S, fill: C(x(w.id), 0.65), line: C(x(w.id), 0.1) }), n.push({ name: "lane-" + w.id, x: 8, y: m + 8, width: l - 24, height: 32, text: w.label, fill: x(w.id), fontSize: 15 }), n.push({ name: "caption-" + w.id, x: 8, y: m + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((v, L) => u(v.id, m + 10 + L * 44)), m += S + 4;
    }
  }
  return a ? t.hiring.funding && !e && n.push({ name: "handle-funding", x: l + t.hiring.funding.day * f - 22, y: 4, width: 44, height: 44 }) : n.push({ name: "handle-launch", x: l + t.launch.day * f - 22, y: e ? 104 : 4, width: 44, height: 44 }), { parts: n, width: p, height: m + 8, narrow: e, x0: l, dayW: f, gridTop: g, axisY: k, bars: o };
}
function fn(t, i, e) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = e(a.name.slice(8)));
  return i;
}
function xn(t, i) {
  const e = t.x + t.width, a = Math.max(t.x + 4, e - 10), r = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, c = i.y + i.height / 2;
  return { d: `M ${a} ${r} V ${c} H ${i.x}`, arrow: { x: i.x, y: c, angle: 0 } };
}
function pn(t, i) {
  const e = P(t, i.layout), a = t.kind === "hiring-plan", s = H(t), r = Math.round((e.width - (e.narrow ? 88 : e.x0 + 40)) / e.dayW), c = Ct(t), n = [];
  if (c?.workdays)
    for (let h = 0; h < r; h++) rt(c.origin, h) === 6 && n.push({ t: "rect", x: e.x0 + h * e.dayW, y: e.gridTop, w: 2 * e.dayW, h: e.height - 8 - e.gridTop, color: y.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (c && h.on && h.kind === "blackout") {
    const p = lt(c.origin, h.start), f = lt(c.origin, h.end) + 1, x = e.x0 + Math.max(0, p) * e.dayW, u = (Math.min(r, f) - Math.max(0, p)) * e.dayW;
    if (u <= 0) continue;
    n.push({ t: "rect", x, y: e.gridTop, w: u, h: e.height - 8 - e.gridTop, color: y.refuse, opacity: 0.12 });
    for (let m = x; m < x + u; m += 10) n.push({ t: "line", x1: m, y1: e.gridTop, x2: Math.min(x + u, m + 10), y2: e.gridTop + 10, color: y.refuse, width: 0.6 });
    n.push({ t: "text", x: x + 3, y: e.gridTop + 22, text: h.label + " · " + R(h.start) + "–" + R(h.end), color: y.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= r; h++) {
    const p = e.x0 + h * e.dayW, f = c ? rt(c.origin, h) === 1 : h % 7 === 0;
    if (!f && e.dayW < 6) continue;
    n.push({ t: "line", x1: p, y1: e.gridTop, x2: p, y2: e.height - 8, color: f ? y.week : y.faint, width: f ? 1 : 0.5 });
    const x = a && c && F(c.origin, h).slice(8) <= "07" && f, u = c ? a ? x ? R(F(c.origin, h)).replace(/^\d+ /, "") : "" : R(F(c.origin, h)) : (e.narrow ? "W" : "Week ") + (h / 7 + 1);
    f && u && (!c || a || e.dayW * 7 > 44) && n.push({ t: "text", x: p + 3, y: e.axisY, text: u, color: y.ink, size: 12 });
  }
  for (const h of t.cards) {
    for (const x of h.dependsOn ?? []) {
      const u = e.bars.get(x), m = e.bars.get(h.id);
      if (!u || !m) continue;
      const g = s.get(x).critical && s.get(h.id).critical, k = t.cards.find((w) => w.id === x).label;
      n.push({
        t: "path",
        ...xn(u, m),
        color: g ? At : y.ink,
        width: g ? 2 : 1.5,
        unlink: { cardId: h.id, waitsOn: x, label: `Remove the link: ${h.label} waits on ${k}` }
      });
    }
    const p = s.get(h.id), f = e.bars.get(h.id);
    if (a) {
      const x = t.hiring.bands.find((g) => g.id === h.band), u = f.x + f.width, m = e.x0 + r * e.dayW;
      m > u && n.push({ t: "rect", x: u, y: f.y + f.height / 2 - 3, w: m - u, h: 6, rx: 3, color: y.bar, opacity: 0.45 }), n.push({
        t: "text",
        x: e.narrow ? 8 : Math.min(u + 6, m - 120),
        y: e.narrow ? f.y - 6 : f.y + f.height / 2 - 6,
        text: (e.narrow ? h.label + " · " : "") + "starts " + R(F(c.origin, Xt(t, h.id))) + (x ? " · " + E(x.monthly, t.hiring.currency) + "/mo" : ""),
        color: y.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    e.narrow && n.push({ t: "text", x: 8, y: f.y - 6, text: `${h.label} · ${h.duration}d`, color: y.ink, size: 13, bold: p.critical }), p.critical || n.push({ t: "text", x: f.x + f.width + (e.narrow ? 48 : 24), y: f.y + f.height / 2 + 4, text: "+" + p.slack + "d", color: y.ink, size: 12, role: "slack-" + h.id });
  }
  if (!(a && e.narrow)) for (const h of t.cards) {
    if (!e.narrow && i.focus !== h.id) continue;
    const p = e.bars.get(h.id), f = p.y + 6, x = p.height - 12, [u, m] = e.narrow ? [p.x - 10, p.x + p.width + 4] : [p.x + 3, p.x + p.width - 9], g = e.narrow ? 0.55 : 0.8;
    n.push(
      { t: "rect", x: u, y: f, w: 6, h: x, rx: 3, color: y.ink, opacity: g, role: "grip-start-" + h.id },
      { t: "rect", x: m, y: f, w: 6, h: x, rx: 3, color: y.ink, opacity: g, role: "grip-end-" + h.id }
    );
  }
  if (a) {
    const h = tn(t), p = t.behaviour?.rules.find((u) => u.on && u.kind === "deadline"), f = p && p.kind === "deadline" && h < p.floor;
    n.push({
      t: "text",
      x: e.narrow ? 8 : e.x0,
      y: e.narrow ? 18 : 20,
      text: "Runway with these hires: " + nn(h),
      color: f || i.refused ? y.refuse : y.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const x = t.hiring.funding;
    if (x && x.day <= r) {
      const u = e.x0 + x.day * e.dayW;
      n.push({ t: "line", x1: u, y1: 26, x2: u, y2: e.height - 8, color: y.accept, width: 2, dash: "6 4" }), e.narrow || n.push({ t: "rect", x: u - 4, y: 26, w: 8, h: 18, rx: 4, color: y.accept }), n.push({ t: "text", x: Math.max(u + 8, e.narrow ? 8 : e.x0 + 330), y: e.narrow ? 40 : 20, text: "Round +" + E(x.amount, t.hiring.currency) + " · " + R(F(c.origin, x.day)), color: y.accept, size: 12, bold: !0 });
    }
    if (e.narrow && n.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: y.ink, size: 12 }), i.clamp) {
      const u = e.parts.find((m) => m.name === i.clamp.name);
      u && n.push(...pt(e, n, i.clamp.text, u, i.view));
    }
    return n;
  }
  const o = e.x0 + t.launch.day * e.dayW;
  n.push({ t: "line", x1: o, y1: e.narrow ? 112 : 26, x2: o, y2: e.height - 8, color: y.launch, width: 2, dash: "6 4" }), n.push({ t: "rect", x: o - 4, y: e.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: y.launch });
  const l = $t(t), d = Math.max(0, ...[...s.values()].map((h) => h.to));
  if (n.push({
    t: "text",
    x: e.narrow ? 8 : e.x0,
    y: e.narrow ? 18 : 20,
    text: c ? "Done " + U(t, Math.ceil(d) - 1) + " · " + q(t) + " " + U(t, t.launch.day) : `Done day ${l} · launch day ${t.launch.day}`,
    color: i.refused ? y.refuse : y.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const h = e.parts.find((p) => p.name === i.clamp.name);
    h && n.push(...pt(e, n, i.clamp.text, h, i.view));
  }
  return n;
}
const V = 13, xt = 16, Pt = (t, i) => t * (i ? 0.64 : 0.6), gn = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function mn(t) {
  const i = t.size ?? 13, e = t.text.length * Pt(i, t.bold);
  return { x: t.anchor === "end" ? t.x - e : t.anchor === "middle" ? t.x - e / 2 : t.x, y: t.y - i, w: e, h: i * 1.3 };
}
function yn(t, i) {
  const e = [];
  for (const a of t.split(/\s+/).filter(Boolean)) {
    const s = e.at(-1);
    s !== void 0 && s.length + 1 + a.length <= i ? e[e.length - 1] = s + " " + a : e.push(a);
  }
  return e;
}
let Z = null;
function pt(t, i, e, a, s) {
  const r = [...t.bars.values()].map((g) => ({ x: g.x - 4, y: g.y - 3, w: g.width + 8, h: g.height + 6 }));
  for (const g of i)
    g.t === "text" ? r.push(mn(g)) : g.t === "rect" && r.push({ x: g.x - 2, y: g.y - 2, w: g.w + 4, h: g.h + 4 });
  let c = t.narrow ? 6 : t.x0 + 2, n = t.width - 4, o = t.gridTop + 2, l = t.height - 6;
  s && Math.min(n, s.x + s.width - 8) - Math.max(c, s.x + 8) >= 160 && (c = Math.max(c, s.x + 8), n = Math.min(n, s.x + s.width - 8), Math.min(l, s.y + s.height - 8) - Math.max(o, s.y + 8) >= 40 && (o = Math.max(o, s.y + 8), l = Math.min(l, s.y + s.height - 8)));
  const d = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, h = JSON.stringify([e, d, c, n, o, l, r.map((g) => [g.x, g.y, g.w, g.h].map(Math.round))]);
  if (Z?.key === h) return Z.shapes;
  const p = Pt(V, !0), f = Math.floor((n - c) / p), x = /* @__PURE__ */ new Map();
  for (const g of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const k = yn(e, Math.max(8, Math.floor(f * g)));
    k.length <= 4 && x.set(k.join(`
`), k);
  }
  let u = null;
  for (const g of x.values()) {
    const k = Math.max(...g.map((M) => M.length)) * p, w = g.length * xt + 2;
    if (!(k > n - c))
      for (let M = o; M + w <= l; M += 3)
        for (let S = c; S + k <= n; S += 6) {
          const v = { x: S, y: M, w: k, h: w }, L = Math.max(v.x - d.x, 0, d.x - (v.x + v.w)), B = Math.max(v.y - d.y, 0, d.y - (v.y + v.h)), W = Math.hypot(L, B) + (g.length - 1) * 24;
          u && W >= u.score || r.every((N) => gn(v, N)) && (u = { box: v, lines: g, score: W });
        }
  }
  const m = u ? [{ t: "text", x: u.box.x, y: u.box.y + V - 1, text: e, lines: u.lines, lineHeight: xt, color: y.refuse, size: V, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: e,
    color: y.refuse,
    size: V,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return Z = { key: h, shapes: m }, m;
}
const j = (t, i = 1, e) => {
  const a = (r, c) => Math.round(r / c) * c, s = { ...t, cards: t.cards.map((r) => {
    const c = r.id === e ? i : 1, n = { ...r, duration: Math.max(c, a(r.duration, c)), lag: Math.max(0, a(r.lag ?? 0, c)) };
    return n.lag || delete n.lag, n;
  }) };
  return t.launch && (s.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (s.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), s;
}, gt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function wn(t, i, e) {
  if (e !== "l" && e !== "L") return null;
  const a = /^card-(.+)$/.exec(i), s = a && t.cards.find((n) => n.id === a[1]);
  if (!s) return null;
  const r = (n) => t.cards.find((o) => o.id === n)?.label ?? n, c = [
    ...Rt(t, s.id).map((n) => ({
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
function kn(t, i, { key: e, shiftKey: a }) {
  if (e !== "ArrowLeft" && e !== "ArrowRight") return null;
  const s = (e === "ArrowLeft" ? -1 : 1) * b(t);
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(s) }];
  if (i === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(s) * 7 }];
  const r = J(i), c = r !== null && t.cards.find((l) => l.id === r);
  if (c) return [{ kind: "set_task", card: { id: c.id }, duration: c.duration - s, lag: (c.lag ?? 0) + s }];
  const n = /^(card|handle)-(.+)$/.exec(i), o = n && t.cards.find((l) => l.id === n[2]);
  return o ? a || n[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + s }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + s }] : null;
}
const X = {
  laneCues: !1,
  notes(t, i, e, a) {
    return et(X.places(t, i).parts, t, e, a);
  },
  editsBetween: nt,
  label: Ot,
  places(t, i) {
    const e = fn(t, P(t, i), (a) => {
      const s = t.cards.filter((c) => c.laneId === a), r = H(t);
      return t.kind === "hiring-plan" ? s.length + (s.length === 1 ? " hire" : " hires") : `${s.length} ${s.length === 1 ? "task" : "tasks"} · ${s.filter((c) => r.get(c.id).critical).length} on the critical path`;
    });
    return { parts: e.parts, width: e.width, height: e.height };
  },
  layer: (t) => tt(t, pn),
  chooser(t, i, e, a = {}) {
    const s = t.cards.findIndex((r) => r.id === i);
    return s < 0 ? null : t.kind === "hiring-plan" && a.narrow ? () => t : (gt(t) ? vn : Tn)(t, i, s, Rt(t, i), e, a);
  },
  refusalAt(t, i, e, a, s) {
    const r = P(t, s);
    for (const l of t.cards) {
      if (l.id === i || !Y(r.bars.get(l.id), a)) continue;
      const d = Lt(t, i, l.id);
      return d ? { laneId: l.laneId, reason: d } : null;
    }
    const c = t.cards.find((l) => l.id === i), n = (c.lag ?? 0) + Math.round((a.x - e.x - r.bars.get(i).x) / r.dayW);
    if (gt(t)) {
      const l = H(t).get(i), d = Math.round(l.from + (a.x - e.x - r.bars.get(i).x) / r.dayW), h = (c.lag ?? 0) + It(Ct(t)).idx(d) - l.start, p = b(t), f = Tt(t, i, { lag: Math.max(0, Math.round(h / p) * p) });
      return typeof f == "string" ? { laneId: c.laneId, reason: f, lands: !0 } : null;
    }
    const o = Kt(t, { cardId: i, field: "lag" });
    return n > o.max ? { laneId: c.laneId, reason: bt(Gt(t, { cardId: i, field: "lag" }, n), i) ?? o.reasons.max } : null;
  },
  handleDrag(t, i, e, a) {
    const s = P(t, a);
    if (t.kind === "hiring-plan" && a.narrow) return null;
    const r = J(i);
    if (r !== null) return t.cards.some((n) => n.id === r) ? mt(t, r, "start", e, s, i) : null;
    const c = i.slice(7);
    return t.cards.some((n) => n.id === c) ? mt(t, c, "end", e, s, i) : i === "handle-launch" ? Sn(t, e, s, a) : i === "handle-funding" && t.hiring?.funding ? Ln(t, e, s) : null;
  },
  keyEdit: kn,
  keyChoices: wn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, i) {
    const e = J(i) ?? /^(?:card|handle)-(.+)$/.exec(i)?.[1] ?? null;
    return e !== null && t.cards.some((a) => a.id === e) ? e : null;
  }
};
function mt(t, i, e, a, s, r) {
  const c = s.parts.find((n) => n.name === r);
  return c ? (n) => {
    const o = Jt(t, i, e, (n.x - a.x - c.x) / s.dayW);
    return o.next ? { next: o.next, ...o.reason && { clampedReason: o.reason } } : { next: Mn(t, i, o.values) ?? t, clampedReason: o.refusal, refusal: o.refusal };
  } : null;
}
function Mn(t, i, e) {
  const a = t.cards.find((o) => o.id === i), s = b(t), r = a.lag ?? 0, c = a.duration ?? 1, n = (o, l) => Math.sign(l - o) * s;
  for (let o = { ...e }; o.lag !== r || o.duration !== c; ) {
    if (o.lag !== r) {
      const d = n(o.lag, r);
      o = { lag: o.lag + d, duration: o.duration - d };
    } else o = { lag: r, duration: o.duration + n(o.duration, c) };
    const l = Tt(t, i, { lag: o.lag, duration: o.duration });
    if (typeof l != "string") return l;
  }
  return null;
}
function vn(t, i, e, a, s, r) {
  const c = b(t), n = Ut(t), o = t.cards[e].laneId, l = (u) => {
    if (!n) return u;
    const m = Qt(t, u, /* @__PURE__ */ new Set([i]));
    return typeof m == "string" ? u : m;
  }, d = (u) => l(j(u, c, i)), h = (u) => I(P(l(u), r).parts, a.map((m) => "card-" + m)), f = (r.narrow ? [o] : t.lanes.map((u) => u.id)).flatMap((u) => Yt(t, i, "lag", u === o ? void 0 : u).map((m) => ({ laneId: u, run: m })));
  if (!f.length) return () => t;
  const x = K(t, "card-" + i, s, h, (u, m) => {
    const g = u.closest(f.map(({ laneId: k, run: [w, M] }) => u.vary(
      { ...m, cards: m.cards.map((S, v) => v === e ? { ...S, laneId: k, lag: Math.min(M, Math.max(w, S.lag ?? 0)) } : S) },
      wt("cards", e, "lag"),
      { constraint: (S) => [kt(S.cards[e].lag ?? 0, w - 0.49), Mt(S.cards[e].lag ?? 0, M + 0.49)] }
    ))).withBranchTransition(100);
    return a.length ? u.closest(a.map((k) => u.dropTarget("target-" + k, Wt(m, i, k)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(g).withBranchTransition(120).onDrop(d) : g.onDrop(d);
  });
  return x ? (u) => d(x(u)) : null;
}
function Sn(t, i, e, a) {
  const s = e.parts.find((c) => c.name === "handle-launch");
  if (!s) return null;
  const r = { ...a, dayWidth: e.dayW };
  return (c) => {
    const n = ot(t, t.launch.day + Math.round((c.x - i.x - s.x) / e.dayW));
    if (n.next) return { next: n.next, layout: r, ...n.reason && { clampedReason: n.reason } };
    let o = t;
    const l = Math.sign(t.launch.day - n.day);
    for (let d = n.day + l; l && d !== t.launch.day; d += l) {
      const h = ot(t, d);
      if (h.next) {
        o = h.next;
        break;
      }
    }
    return { next: o, layout: r, clampedReason: n.refusal, refusal: n.refusal };
  };
}
function Ln(t, i, e) {
  const a = e.parts.find((o) => o.name === "handle-funding");
  if (!a) return null;
  const s = t.hiring.funding.day, r = b(t), c = t.hiring.weeks * 7, n = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const l = s + Math.round((o.x - i.x - a.x) / e.dayW / r) * r, d = Math.min(c, Math.max(0, l)), h = Cn(t, n(d));
    return h ? { next: t, clampedReason: h, refusal: h } : { next: n(d), ...d !== l && { clampedReason: d > l ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function Cn(t, i) {
  const e = t.behaviour ? qt(t, i) : null;
  return e && "refused" in e ? e.refused.sentence : null;
}
function Tn(t, i, e, a, s, r) {
  const c = t.launch.day, n = (l) => I(P(l, r).parts, a.map((d) => "card-" + d)), o = K(t, "card-" + i, s, n, (l, d) => {
    const h = r.narrow ? d.lanes.filter((f) => f.id === d.cards[e].laneId) : d.lanes, p = l.closest(h.map((f) => l.vary(
      { ...d, cards: d.cards.map((x, u) => u === e ? { ...x, laneId: f.id, lag: x.lag ?? 0 } : x) },
      wt("cards", e, "lag"),
      { constraint: (x) => [kt(x.cards[e].lag ?? 0, -1e-3), Mt($t(x), c + 1e-3)] }
    )));
    return a.length ? l.closest(a.map((f) => l.dropTarget("target-" + f, Wt(d, i, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(p).withBranchTransition(120).onDrop((f) => j(f)) : p.onDrop((f) => j(f));
  });
  return o ? (l) => j(o(l)) : null;
}
const O = 76;
function A(t, i = {}) {
  const e = !!i.narrow, a = [], s = t.lanes.map((o) => t.cards.filter((l) => l.laneId === o.id).length), r = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : _[o % _.length];
  let c, n;
  if (e) {
    c = Math.max(300, i.width ?? 390);
    let o = O;
    t.lanes.forEach((l, d) => {
      const h = 96 + (s[d] + 1) * 64;
      a.push({ name: "column-" + l.id, x: 2, y: o, width: c - 4, height: h, fill: C(r(d), 0.6), line: C(r(d), 0.1) });
      const p = (c - 16) * 0.36;
      a.push({ name: "lane-" + l.id, x: 8, y: o + 6, width: p, height: 36, text: l.label, fill: r(d), fontSize: 15 }), a.push({ name: "caption-" + l.id, x: 8 + p + 6, y: o + 6, width: c - 16 - p - 6, height: 56, text: ct(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((f) => f.laneId === l.id).forEach((f, x) => a.push({ name: "card-" + f.id, x: 8, y: o + 72 + x * 64, width: c - 16, height: 56, text: yt(t, f.id), fontSize: 15 })), o += h + 10;
    }), n = o;
  } else {
    const d = 116 + (Math.max(...s) + 1) * 88;
    t.lanes.forEach((h, p) => {
      const f = p * 244;
      a.push({ name: "column-" + h.id, x: f + 2, y: O, width: 240, height: d, fill: C(r(p), 0.6), line: C(r(p), 0.1) }), a.push({ name: "lane-" + h.id, x: f + 8, y: O + 6, width: 228, height: 58, text: h.label, fill: r(p), fontSize: 16 }), a.push({ name: "caption-" + h.id, x: f + 8, y: O + 66, width: 228, height: 48, text: ct(t, h.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((x) => x.laneId === h.id).forEach((x, u) => a.push({ name: "card-" + x.id, x: f + 8, y: O + 116 + u * 88, width: 228, height: 76, text: yt(t, x.id), fontSize: 15 }));
    }), c = t.lanes.length * 244, n = O + d;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(c, 520), height: 34, text: rn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: a, width: c, height: n };
}
function yt(t, i) {
  const e = t.cards.find((a) => a.id === i);
  return e.amount === void 0 ? e.label + `
no amount yet` : e.label + `
` + E(e.amount, t.forecast.currency);
}
function Wn(t, i) {
  const { width: e } = A(t, i.layout), a = t.forecast.target, s = zt(t), r = Math.max(a * 1.25, s), c = e - 8, n = s >= a;
  return [
    { t: "rect", x: 4, y: 42, w: c, h: 14, rx: 7, color: y.track },
    { t: "rect", x: 4, y: 42, w: c * s / r, h: 14, rx: 7, color: n ? y.accept : y.bar },
    { t: "line", x1: 4 + c * a / r, y1: 36, x2: 4 + c * a / r, y2: 62, color: y.ink, width: 2 },
    { t: "text", x: 4 + c * a / r, y: 72, text: "Target " + E(a, t.forecast.currency), color: y.ink, size: 14, anchor: "middle" }
  ];
}
const $n = {
  laneCues: !0,
  places: (t, i) => A(t, i),
  notes: (t, i, e, a) => et(A(t, i).parts, t, e, a),
  editsBetween: nt,
  layer: (t) => tt(t, Wn),
  chooser(t, i, e, a = {}) {
    const s = vt(t, i).map((r) => St(t, i, r.id));
    return s.length < 2 ? null : Et(K(t, "card-" + i, e, (r) => I(A(r, a).parts), (r, c) => r.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c, { gapIn: 40, gapOut: 56 })), t, i, A(t, a).parts, s);
  },
  refusalAt(t, i, e, a, s) {
    const { parts: r } = A(t, s), c = t.cards.find((n) => n.id === i);
    for (const n of t.lanes) {
      if (n.id === c.laneId || !Y(r.find((l) => l.name === "column-" + n.id), a)) continue;
      const o = en(t, i, n.id);
      return o ? { laneId: n.id, reason: o } : null;
    }
    return null;
  },
  handleDrag: () => null
}, T = 48, D = 960, _t = 900;
function z(t, i = {}) {
  const e = !!i.narrow, a = t.budget.total, s = [], r = [], c = t.lanes.map((l) => t.cards.filter((d) => d.laneId === l.id).length);
  let n, o;
  if (e) {
    n = Math.max(300, i.width ?? 390);
    let l = T;
    t.lanes.forEach((d, h) => {
      const p = Math.max(100 + (c[h] + 1) * 64, d.allocation / a * _t);
      r.push({ laneId: d.id, start: l, size: p }), l += p;
    }), o = l + 8;
  } else {
    n = D;
    let l = 0;
    for (const d of t.lanes)
      r.push({ laneId: d.id, start: l, size: d.allocation / a * D }), l += d.allocation / a * D;
    o = T + 100 + (Math.max(...c) + 1) * 64;
  }
  return t.lanes.forEach((l, d) => {
    const { start: h, size: p } = r[d], f = _[d % _.length], x = e ? { x: 2, y: h + 1, width: n - 4, height: p - 2 } : { x: h + 1, y: T, width: Math.max(4, p - 2), height: o - T }, u = { x: x.x + 5, y: x.y, width: Math.max(10, x.width - 10) };
    s.push({ name: "column-" + l.id, ...x, fill: C(f, 0.6), line: C(f, 0.1) });
    const m = e ? u.width * 0.36 : u.width;
    if (s.push({ name: "lane-" + l.id, x: u.x, y: u.y + 6, width: m, height: 32, text: l.label, fill: f, fontSize: 15 }), s.push({
      name: "caption-" + l.id,
      x: e ? u.x + m + 6 : u.x,
      y: u.y + (e ? 6 : 40),
      width: e ? u.width - m - 6 : u.width,
      height: e ? 50 : 40,
      text: e ? ht(t, l.id).replace(" · ", `
`) : ht(t, l.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: e ? 15 : 12
    }), t.cards.filter((g) => g.laneId === l.id).forEach((g, k) => s.push({
      name: "card-" + g.id,
      x: u.x,
      y: u.y + 100 + k * 64,
      width: u.width,
      height: 56,
      text: g.label + `
` + E(g.amount, t.budget.currency),
      fontSize: 14
    })), d < t.lanes.length - 1) {
      const g = h + p;
      s.push(e ? { name: "handle-" + l.id, x: n - 96, y: g - 22, width: 88, height: 44 } : { name: "handle-" + l.id, x: g - 22, y: T - 6, width: 44, height: 48 });
    }
  }), { parts: s, width: n, height: o, segments: r, narrow: e };
}
function zn(t, i) {
  const e = z(t, i.layout), a = t.budget.total, s = [{ t: "text", x: 4, y: 28, text: ln(t), color: y.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((r, c) => {
    const n = e.segments[c], o = r.allocation, l = on(t, r.id);
    if (e.narrow) {
      const d = n.start + 50, h = 8, p = e.width - 16;
      s.push({ t: "rect", x: h, y: d, w: p, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x: h, y: d, w: p * l / o || 0, h: 10, rx: 5, color: y.bar }), r.floor !== void 0 && s.push({ t: "line", x1: h + p * r.floor / o, y1: d - 4, x2: h + p * r.floor / o, y2: d + 14, color: y.ink, width: 2 });
    } else {
      const d = D / a, h = T + 86;
      s.push({ t: "rect", x: n.start + 6, y: h, w: n.size - 12, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x: n.start + 6, y: h, w: Math.max(0, (n.size - 12) * l / o || 0), h: 10, rx: 5, color: y.bar }), r.floor !== void 0 && s.push({ t: "line", x1: n.start + r.floor * d, y1: h - 6, x2: n.start + r.floor * d, y2: h + 16, color: y.ink, width: 2 }), r.cap !== void 0 && n.start + r.cap * d <= e.width && s.push({ t: "line", x1: n.start + r.cap * d, y1: h - 6, x2: n.start + r.cap * d, y2: h + 16, color: y.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const d = n.start + n.size;
      s.push(e.narrow ? { t: "line", x1: 2, y1: d, x2: e.width - 2, y2: d, color: y.ink, width: 2 } : { t: "line", x1: d, y1: T, x2: d, y2: e.height, color: y.ink, width: 2 }), s.push(e.narrow ? { t: "rect", x: e.width - 68, y: d - 4, w: 32, h: 8, rx: 4, color: y.ink } : { t: "rect", x: d - 4, y: T + 2, w: 8, h: 30, rx: 4, color: y.ink });
    }
  }), i.clamp) {
    const r = e.parts.find((c) => c.name === i.clamp.name);
    r && s.push({
      t: "text",
      x: e.narrow ? 8 : Math.min(Math.max(r.x + 22, 120), e.width - 120),
      y: e.narrow ? r.y + 8 : T - 12,
      text: i.clamp.text,
      color: y.refuse,
      size: 13,
      bold: !0,
      anchor: e.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const En = (t, i) => Math.round(t / i) * i, Rn = {
  laneCues: !0,
  notes: (t, i, e, a) => et(z(t, i).parts, t, e, a),
  editsBetween: nt,
  label: Ot,
  places(t, i) {
    const { parts: e, width: a, height: s } = z(t, i);
    return { parts: e, width: a, height: s };
  },
  layer: (t) => tt(t, zn),
  chooser(t, i, e, a = {}) {
    const s = vt(t, i).map((r) => St(t, i, r.id));
    return s.length < 2 ? null : Et(K(t, "card-" + i, e, (r) => I(z(r, a).parts), (r, c) => r.closest(s).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c)), t, i, z(t, a).parts, s);
  },
  refusalAt(t, i, e, a, s) {
    const { parts: r } = z(t, s), c = t.cards.find((n) => n.id === i);
    for (const n of t.lanes) {
      if (n.id === c.laneId || !Y(r.find((l) => l.name === "column-" + n.id), a)) continue;
      const o = sn(t, i, n.id);
      return o ? { laneId: n.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, i, e, a) {
    const s = i.slice(7), r = t.lanes.findIndex((x) => x.id === s), c = t.lanes[r + 1];
    if (r < 0 || !c) return null;
    const n = an(t, { laneId: s }), o = t.budget.step, l = (x) => {
      const u = Math.min(n.max, Math.max(n.min, En(x, o)));
      return dt(t, c.id, s, u);
    }, d = z(t, a), h = d.narrow ? _t / t.budget.total : D / t.budget.total, p = d.parts.find((x) => x.name === i), f = K(t, i, e, (x) => I(z(x, a).parts), (x) => x.varyFunc([0], ([u]) => dt(t, c.id, s, u), { constraint: (u) => [
      ...Ht([n.min, u.lanes[r].allocation - t.lanes[r].allocation, n.max])
    ] }));
    return (x) => {
      const m = (d.narrow ? x.y - e.y - p.y : x.x - e.x - p.x) / h, g = f?.(x), k = g ? g.lanes[r].allocation - t.lanes[r].allocation : m, w = { next: l(k) };
      return m > n.max + o / 2 ? { ...w, clampedReason: n.reasons.max } : m < n.min - o / 2 ? { ...w, clampedReason: n.reasons.min } : w;
    };
  },
  keyEdit(t, i, { key: e }) {
    if (e !== "ArrowLeft" && e !== "ArrowRight" && e !== "ArrowUp" && e !== "ArrowDown") return null;
    const a = /^handle-(.+)$/.exec(i)?.[1], s = t.lanes.findIndex((l) => l.id === a), r = t.lanes[s + 1];
    if (s < 0 || !r) return null;
    const c = e === "ArrowRight" || e === "ArrowDown", n = t.budget.step;
    return [c ? { kind: "shift_budget", from: { id: r.id }, to: { id: a }, amount: n } : { kind: "shift_budget", from: { id: a }, to: { id: r.id }, amount: n }];
  }
}, Bt = { "launch-plan": X, "hiring-plan": X, pipeline: $n, budget: Rn };
function Nn(t, i) {
  Bt[t] = i;
}
function Fn(t) {
  const i = Bt[t];
  if (!i && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return i;
}
function Dn(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Kn as amountLimits,
  bn as amountOf,
  Ne as amountRules,
  Gn as bandOf,
  Fe as behaviourEditsBetween,
  Dn as boardLayoutFor,
  ht as budgetCaption,
  on as budgetCommitted,
  ln as budgetHeader,
  Rn as budgetKit,
  z as budgetLayout,
  an as budgetLimits,
  sn as budgetRefusal,
  De as budgetRules,
  He as budgetShiftLimits,
  Ie as budgetShiftRefusal,
  Xe as byOrder,
  Ut as cascadeStops,
  ti as checkNest,
  ni as checkNestMove,
  qt as checkTime,
  Ct as clockOf,
  tt as createBoardLayer,
  Vn as currencyOf,
  jn as dateName,
  Jn as dayFromWords,
  It as dayMap,
  U as dayWords,
  Un as days,
  Yn as downstreamTasks,
  Jt as dragTaskEdge,
  Zn as earliestLaunch,
  qn as edgeValues,
  ei as extend,
  Qn as extendWorkshopEdits,
  Xn as goLiveSample,
  Ot as handleLabel,
  K as headlessDrag,
  te as hireLagFor,
  Xt as hireStarts,
  ne as hiringPlanRules,
  ee as hiringPlanSample,
  Qt as holdOthers,
  Y as inside,
  ii as isOrderKey,
  Wi as isOrgChart,
  F as isoAt,
  ie as isoTime,
  Fn as kitFor,
  ae as launchDayOn,
  $t as launchFinish,
  Vt as launchHard,
  se as launchIndex,
  P as launchLayout,
  Lt as launchLinkRefusal,
  Rt as launchLinkTargets,
  bt as launchOverrun,
  oe as launchPlanCaption,
  X as launchPlanKit,
  Kt as launchPlanLimits,
  re as launchPlanRefusal,
  le as launchPlanRules,
  ce as launchPlanSample,
  he as launchTaskText,
  de as launchTooEarly,
  y as layerInk,
  Yt as legalRuns,
  q as lineWord,
  E as money,
  ue as monthNames,
  ot as moveLaunch,
  ai as nestAlias,
  si as nestAreas,
  $i as nestAxes,
  oi as nestCardText,
  ri as nestDepth,
  li as nestDrags,
  ci as nestEmptyDrop,
  hi as nestFamily,
  di as nestKids,
  ui as nestLegal,
  fi as nestMeasure,
  xi as nestMeasureWords,
  pi as nestPlace,
  zi as nestQuadrants,
  gi as nestRoots,
  mi as nestRules,
  Ei as nestScores,
  yi as nestSentence,
  wi as nestSubtree,
  fe as nextCardId,
  xe as nextMonday,
  pe as noteNumbers,
  lt as offsetOf,
  ki as orderBetween,
  Mi as orderKeys,
  ge as ownField,
  et as partNotes,
  I as partsGeometry,
  jt as pastTheLine,
  ct as pipelineCaption,
  zt as pipelineForecast,
  rn as pipelineGauge,
  $n as pipelineKit,
  A as pipelineLayout,
  Ke as pipelineLimits,
  en as pipelineRefusal,
  be as pipelineRules,
  Ge as planBudgetMove,
  me as planDrags,
  ye as planEdit,
  we as planFixed,
  ke as planLaunchPlanMove,
  Ve as planPipelineMove,
  Me as planProblem,
  je as planSamples,
  ve as planWords,
  Se as presetRules,
  Ri as quadrantOf,
  Le as readClock,
  Ce as readNoteNumbers,
  Nn as registerBoardKit,
  vi as registerNestPlus,
  Te as renamedNumbers,
  ft as renderLayerShapes,
  Je as restoreWorkshop,
  Si as roleOf,
  We as runwayCap,
  $e as runwayHeader,
  tn as runwayMonths,
  nn as runwayWords,
  Ue as sampleBudget,
  ze as sampleLaunchPlan,
  Ye as samplePipeline,
  H as scheduleLaunch,
  Oi as scoreBoard,
  Ai as scoresIn,
  dt as shiftBudget,
  R as shortDate,
  b as snapStep,
  Zt as startHandle,
  J as startHandleCard,
  Li as tidyKeys,
  Ee as timeFamily,
  Re as timeRuleKindIds,
  Oe as timeSentence,
  C as tint,
  Tt as tryTask,
  Ze as validateBudget,
  Ae as validateHiringPlan,
  Pe as validateLaunchPlan,
  Ci as validateNest,
  qe as validatePipeline,
  rt as weekdayAt,
  _e as weekendAt,
  Wt as withLink,
  Gt as withTaskValue,
  nt as workshopEditsBetween
};
