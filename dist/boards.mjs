import { Vec2 as kt, getElementPositionCheap as bt, translate as tn, dragSpecToBehavior as nn, param as q, moreThan as Q, lessThan as b, inOrder as en } from "./dragology.mjs";
import { laneColors as G, workshopDestinations as Pt, workshopCandidate as Dt, applyWorkshopEdits as ut } from "./workshop-model.mjs";
import { m as R, G as Bt, I as st, _ as D, Z as at, Q as ot, u as sn, v as Ft, X as lt, z as Nt, V as Ht, a5 as an, C as Kt, W as on, a0 as rn, T as Vt, a3 as ln, R as rt, $ as Jt, w as Mt, j as vt, s as K, f as j, a6 as cn, ac as dn, ad as hn, U as St } from "./plans-BI5v9TGn.mjs";
import { a as le, d as ce, a8 as de, c as he, p as ue, t as fe, ag as pe, Y as me, P as xe, g as ge, a7 as ye, ab as we, h as ke, i as Me, S as ve, H as Se, F as Ie, N as Le, l as _e, J as ze, e as Oe, n as $e, q as Ae, b as Ce, o as Ee, B as Te, M as Re, y as We, E as Pe, x as De, A as Be, L as Fe, O as Ne, af as He, r as Ke, ae as Ve, aa as Je, K as Ue, a4 as Ge, a2 as je, a1 as Ye, a9 as Ze, D as Xe, k as qe } from "./plans-BI5v9TGn.mjs";
import tt from "react";
import { pipelineForecast as Ut, pipelineRefusal as un, pipelineCaption as It, budgetLimits as fn, budgetRefusal as pn, budgetCaption as Lt, shiftBudget as _t, budgetCommitted as mn } from "./workshop-rules.mjs";
import { amountRules as be, behaviourEditsBetween as ti, budgetRules as ni, budgetShiftLimits as ei, budgetShiftRefusal as ii, catalogSamples as si, pipelineLimits as ai, pipelineRules as oi, planBudgetMove as ri, planPipelineMove as li, restoreWorkshop as ci, sampleBudget as di, samplePipeline as hi, validateBudget as ui, validatePipeline as fi } from "./workshop-rules.mjs";
import { nestKids as $, nestAreas as U, nestSubtree as zt, nestPlace as Ot, checkNest as xn, nestLegal as gn, nestEmptyDrop as yn, nestRules as wn, nestRoots as Gt, nestCardText as kn } from "./workshop-nest.mjs";
import { breakDownSample as mi, byOrder as xi, checkNestMove as gi, discoveryTreeSample as yi, incidentReviewSample as wi, isOrderKey as ki, nestAlias as Mi, nestDepth as vi, nestDrags as Si, nestFamily as Ii, nestMeasure as Li, nestMeasureWords as _i, nestSentence as zi, orderBetween as Oi, orderKeys as $i, roleOf as Ai, sortEvidenceSample as Ci, tidyKeys as Ei, validateNest as Ti } from "./workshop-nest.mjs";
const v = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, mt = "http://www.w3.org/2000/svg", $t = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function E(t, i, n) {
  const s = document.createElementNS(mt, t);
  for (const [a, o] of Object.entries(i)) s.setAttribute(a, String(o));
  return n?.fill && (s.setAttribute("fill", $t(n.fill)), s.style.setProperty("fill", n.fill)), n?.stroke && (s.setAttribute("stroke", $t(n.stroke)), s.style.setProperty("stroke", n.stroke)), s;
}
function At(t, i, n, s) {
  const a = typeof document < "u" ? document.activeElement : null, o = a && t.contains(a) ? a.getAttribute("data-board-link") : null;
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
      const c = E("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      e.lines && e.lines.length > 1 ? e.lines.forEach((d, f) => {
        const r = E("tspan", { x: e.x, dy: f ? e.lineHeight ?? Math.round((e.size ?? 13) * 1.25) : 0 });
        r.textContent = f < e.lines.length - 1 ? d + " " : d, c.appendChild(r);
      }) : c.textContent = e.text, t.appendChild(c);
    } else {
      if (e.unlink && n) {
        const { cardId: c, waitsOn: d, label: f } = e.unlink, r = d + ">" + c, g = s?.armed === r, x = E("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": r,
          "aria-label": g ? f + ". Tap again to remove it." : f,
          role: "button",
          tabindex: 0,
          ...g ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: g ? v.refuse : "transparent" });
        let p = !1;
        x.addEventListener("pointerdown", (h) => {
          h.stopPropagation(), p = h.pointerType === "touch" || h.pointerType === "pen";
        }), x.addEventListener("click", (h) => {
          if (h.stopPropagation(), p && s && s.armed !== r) {
            s.arm(r);
            return;
          }
          s?.arm(null), n(c, d);
        }), x.addEventListener("keydown", (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), h.stopPropagation(), n(c, d));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", v.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          g || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), t.appendChild(x), l.push(x);
      }
      if (t.appendChild(E("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: c, y: d, angle: f } = e.arrow;
        t.appendChild(E("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${c} ${d}) rotate(${f})`, "pointer-events": "none" }, { fill: e.color }));
      }
      if (e.unlink && s?.armed === e.unlink.waitsOn + ">" + e.unlink.cardId && e.arrow) {
        const c = E("text", {
          x: e.arrow.x - 6,
          y: e.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: v.refuse });
        c.textContent = "Tap again to remove this link", t.appendChild(c);
      }
    }
  o && l.find((e) => e.getAttribute("data-board-link") === o)?.focus({ preventScroll: !0 });
}
function ct(t, i) {
  const n = t?.canvas?.node, s = document.createElementNS(mt, "g");
  s.setAttribute("data-board-layer", ""), s.setAttribute("pointer-events", "none");
  const a = document.createElementNS(mt, "g");
  a.setAttribute("data-board-layer-top", ""), a.setAttribute("pointer-events", "none");
  let o = !1, l = null, e;
  const c = {
    armed: null,
    arm(f) {
      clearTimeout(e), c.armed = f, f && (e = setTimeout(() => c.arm(null), 5e3), l?.[2].announce?.("Link selected. Tap it again to remove it.")), l && d.draw(...l);
    }
  }, d = {
    draw(f, r, g) {
      if (o || !n) return;
      l = [f, r, g];
      const { origin: x } = g, p = i(r ?? f, g, f), h = (y) => y.t === "text" && (y.role === "clamp" || y.role === "refusal");
      for (const y of [s, a]) y.setAttribute("transform", `translate(${x.x} ${x.y})`);
      At(s, p.filter((y) => !h(y)), g.onUnlink, c), At(a, p.filter(h));
      const w = g.above && g.above.parentNode === n ? g.above : null, u = w ? w.nextSibling : n.firstChild;
      (s.parentNode !== n || s.previousSibling !== w) && n.insertBefore(s, u === s ? s.nextSibling : u), a.firstChild && n.lastChild !== a ? n.appendChild(a) : !a.firstChild && a.parentNode && a.remove();
    },
    destroy() {
      o = !0, clearTimeout(e), s.remove(), a.remove();
    }
  };
  return d;
}
function N(t, i = []) {
  const n = t.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return tt.createElement(
    "g",
    null,
    ...n.map((s) => /* @__PURE__ */ tt.createElement("g", { id: s.name, transform: tn(s.x, s.y) }, /* @__PURE__ */ tt.createElement("rect", { width: s.width, height: s.height }))),
    ...t.filter((s) => i.includes(s.name)).map((s) => /* @__PURE__ */ tt.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function C(t, i, n, s, a) {
  let o;
  const e = {
    draggable: (d) => (o ?? (o = d.d), s(d.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: kt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!bt(e, t) || !o) return null;
  const c = nn(a(o, t), e);
  return (d) => c({ pointer: kt(d.x, d.y) }).dropState;
}
const H = (t, i, n = 0) => !!t && i.x >= t.x - n && i.x <= t.x + t.width + n && i.y >= t.y - n && i.y <= t.y + t.height + n;
function jt(t, i, n, s, a) {
  if (!t) return null;
  const o = i.cards.find((l) => l.id === n).laneId;
  return (l) => {
    const e = t(l);
    if (e !== i && JSON.stringify(e) !== JSON.stringify(i)) return e;
    const c = s.find((d) => d.name.startsWith("column-") && d.name !== "column-" + o && H(d, l));
    return c && a.find((d) => d.cards.find((f) => f.id === n).laneId === c.name.slice(7)) || e;
  };
}
function z(t, i) {
  const n = (s) => Math.round(parseInt(t.slice(s, s + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function yt(t, i) {
  const n = [], s = new Map(t.cards.map((e) => [e.id, e]));
  for (const e of i.cards) {
    const c = s.get(e.id), d = { id: e.id };
    if (!c) {
      n.push({
        kind: "add_card",
        lane: { id: e.laneId },
        label: e.label,
        ...e.duration !== void 0 && { duration: e.duration },
        ...e.lag && { lag: e.lag },
        ...e.dependsOn && { waitsOn: e.dependsOn.map((r) => ({ id: r })) },
        ...e.amount !== void 0 && { amount: e.amount }
      });
      continue;
    }
    c.label !== e.label && n.push({ kind: "rename_card", card: d, label: e.label });
    const f = n.length;
    for (const r of c.dependsOn ?? []) e.dependsOn?.includes(r) || n.push({ kind: "unlink_tasks", card: d, waitsOn: { id: r } });
    for (const r of e.dependsOn ?? []) c.dependsOn?.includes(r) || n.push({ kind: "link_tasks", card: d, waitsOn: { id: r } });
    c.laneId !== e.laneId && n.push({ kind: "move_card", card: d, lane: { id: e.laneId } }), (n.length > f && e.duration !== void 0 && n.slice(f).some((r) => r.kind !== "move_card") || c.duration !== e.duration || (c.lag ?? 0) !== (e.lag ?? 0)) && n.push({ kind: "set_task", card: d, duration: e.duration, lag: e.lag ?? 0 }), e.amount !== void 0 && c.amount !== e.amount && n.push({ kind: "set_amount", card: d, amount: e.amount });
  }
  for (const e of t.cards) i.cards.some((c) => c.id === e.id) || n.push({ kind: "remove_card", card: { id: e.id } });
  i.launch && t.launch?.day !== i.launch.day && n.push({ kind: "set_launch_day", day: i.launch.day }), i.forecast && t.forecast?.target !== i.forecast.target && n.push({ kind: "set_target", amount: i.forecast.target });
  const a = i.lanes.map((e) => ({ id: e.id, by: (e.allocation ?? 0) - (t.lanes.find((c) => c.id === e.id)?.allocation ?? 0) })), o = a.filter((e) => e.by < 0), l = a.filter((e) => e.by > 0);
  for (const e of l)
    for (const c of o) {
      const d = Math.min(e.by, -c.by);
      d <= 0 || (n.push({ kind: "shift_budget", from: { id: c.id }, to: { id: e.id }, amount: d }), e.by -= d, c.by += d);
    }
  for (const e of i.lanes) {
    const c = t.lanes.find((d) => d.id === e.id);
    c && c.label !== e.label && n.push({ kind: "rename_lane", lane: { id: e.id }, label: e.label }), c && c.capacity !== e.capacity && n.push({ kind: "set_lane_capacity", lane: { id: e.id }, capacity: e.capacity ?? null });
  }
  return t.title !== i.title && n.push({ kind: "rename_workshop", title: i.title }), n;
}
function Mn(t) {
  const i = t.forecast?.currency;
  return `Forecast ${R(Ut(t), i)} of ${R(t.forecast?.target ?? 0, i)}`;
}
function vn(t) {
  return `${R(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Yt(t, i) {
  return t.cards.filter((n) => Bt(t, i, n.id) === null).map((n) => n.id);
}
function Sn(t, i, n, s) {
  for (let a = i; a > 11; a--) {
    const o = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((e, c) => e + Math.max(1, Math.ceil(c.length / o)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(i, 11);
}
function dt(t, i, n, s) {
  const a = s.textColor ?? "#18302d", o = s.borderColor ?? "#667872", l = s.fontSize ?? 14;
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
      backgroundColor: c ? "transparent" : e.fill ?? s.backgroundColor ?? "#fffdf6",
      foregroundColor: e.ink ?? a,
      borderColor: e.line ?? o,
      borderWidth: c ? 0 : e.lineWidth ?? 1,
      ...s.fontFamily ? { fontFamily: s.fontFamily } : {},
      fontSize: Sn(d, e.fontSize ?? l, e.width - 12, e.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Zt(t, i) {
  const n = i.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const s = t.cards.find((o) => o.id === n);
  if (s) return `${s.label} length, ${s.duration} days. Left and Right change it.`;
  const a = t.lanes.findIndex((o) => o.id === n);
  return a >= 0 && t.lanes[a + 1] ? `Divider between ${t.lanes[a].label} and ${t.lanes[a + 1].label}. Left and Right move money.` : null;
}
const Xt = "#c2410c", In = 32, Ln = 44, wt = (t) => t ? 0 : 22;
function B(t, i = {}) {
  const n = !!i.narrow, s = t.kind === "hiring-plan", a = ot(t), o = s ? t.hiring.weeks * 7 : Ht(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), l = an(t), e = [], c = /* @__PURE__ */ new Map(), d = n ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), f = n ? 8 : 168, r = n ? (d - 88) / o : (d - f - 40) / o, g = (u) => G[t.lanes.findIndex((y) => y.id === u) % G.length], x = (u, y) => {
    const M = t.cards.find((m) => m.id === u), S = a.get(u), I = { x: f + S.from * r, y, width: (S.to - S.from) * r, height: n ? Ln : In };
    c.set(u, I);
    const _ = l.has(u);
    e.push({
      name: "card-" + u,
      ...I,
      text: n ? "" : s ? M.label : `${M.label} · ${M.duration}d`,
      fill: _ ? "#fde3d7" : n ? g(M.laneId) : s ? z(g(M.laneId), 0.45) : "#fffdf6",
      line: _ || S.critical && !s ? Xt : "#667872",
      lineWidth: _ || S.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), s && n || e.push({ name: "handle-" + u, x: I.x + I.width - wt(n), y: I.y + I.height / 2 - 22, width: 44, height: 44 });
  };
  let p, h, w;
  if (n) {
    const u = (d - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((y, M) => {
      const S = 8 + M * (u + 8);
      e.push({ name: "column-" + y.id, x: S, y: 30, width: u, height: 72, fill: z(g(y.id), 0.6), line: z(g(y.id), 0.1) }), e.push({ name: "lane-" + y.id, x: S + 4, y: 34, width: u - 8, height: 28, text: y.label, fill: g(y.id), fontSize: 14 }), e.push({ name: "caption-" + y.id, x: S + 4, y: 64, width: u - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), w = 124, h = 130, p = 138;
    for (const y of t.cards)
      x(y.id, p + 20), p += 64;
  } else {
    w = 48, h = 56, p = h;
    for (const u of t.lanes) {
      const y = t.cards.filter((S) => S.laneId === u.id), M = Math.max(92, y.length * 44 + 20);
      e.push({ name: "column-" + u.id, x: 0, y: p, width: d, height: M, fill: z(g(u.id), 0.65), line: z(g(u.id), 0.1) }), e.push({ name: "lane-" + u.id, x: 8, y: p + 8, width: f - 24, height: 32, text: u.label, fill: g(u.id), fontSize: 15 }), e.push({ name: "caption-" + u.id, x: 8, y: p + 44, width: f - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), y.forEach((S, I) => x(S.id, p + 10 + I * 44)), p += M + 4;
    }
  }
  return s ? t.hiring.funding && !n && e.push({ name: "handle-funding", x: f + t.hiring.funding.day * r - 22, y: 4, width: 44, height: 44 }) : e.push({ name: "handle-launch", x: f + t.launch.day * r - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: e, width: d, height: p + 8, narrow: n, x0: f, dayW: r, gridTop: h, axisY: w, bars: c };
}
function _n(t, i, n) {
  for (const s of i.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return i;
}
function zn(t, i) {
  const n = t.x + t.width, s = Math.max(t.x + 4, n - 10), o = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, l = i.y + i.height / 2;
  return { d: `M ${s} ${o} V ${l} H ${i.x}`, arrow: { x: i.x, y: l, angle: 0 } };
}
function On(t, i) {
  const n = B(t, i.layout), s = t.kind === "hiring-plan", a = ot(t), o = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), l = Ft(t), e = [];
  if (l?.workdays)
    for (let r = 0; r < o; r++) Mt(l.origin, r) === 6 && e.push({ t: "rect", x: n.x0 + r * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: v.track, opacity: 0.7 });
  for (const r of t.behaviour?.rules ?? []) if (l && r.on && r.kind === "blackout") {
    const g = vt(l.origin, r.start), x = vt(l.origin, r.end) + 1, p = n.x0 + Math.max(0, g) * n.dayW, h = (Math.min(o, x) - Math.max(0, g)) * n.dayW;
    if (h <= 0) continue;
    e.push({ t: "rect", x: p, y: n.gridTop, w: h, h: n.height - 8 - n.gridTop, color: v.refuse, opacity: 0.12 });
    for (let w = p; w < p + h; w += 10) e.push({ t: "line", x1: w, y1: n.gridTop, x2: Math.min(p + h, w + 10), y2: n.gridTop + 10, color: v.refuse, width: 0.6 });
    e.push({ t: "text", x: p + 3, y: n.gridTop + 22, text: r.label + " · " + K(r.start) + "–" + K(r.end), color: v.refuse, size: 11, bold: !0 });
  }
  for (let r = 0; r <= o; r++) {
    const g = n.x0 + r * n.dayW, x = l ? Mt(l.origin, r) === 1 : r % 7 === 0;
    if (!x && n.dayW < 6) continue;
    e.push({ t: "line", x1: g, y1: n.gridTop, x2: g, y2: n.height - 8, color: x ? v.week : v.faint, width: x ? 1 : 0.5 });
    const p = s && l && j(l.origin, r).slice(8) <= "07" && x, h = l ? s ? p ? K(j(l.origin, r)).replace(/^\d+ /, "") : "" : K(j(l.origin, r)) : (n.narrow ? "W" : "Week ") + (r / 7 + 1);
    x && h && (!l || s || n.dayW * 7 > 44) && e.push({ t: "text", x: g + 3, y: n.axisY, text: h, color: v.ink, size: 12 });
  }
  for (const r of t.cards) {
    for (const p of r.dependsOn ?? []) {
      const h = n.bars.get(p), w = n.bars.get(r.id);
      if (!h || !w) continue;
      const u = a.get(p).critical && a.get(r.id).critical, y = t.cards.find((M) => M.id === p).label;
      e.push({
        t: "path",
        ...zn(h, w),
        color: u ? Xt : v.ink,
        width: u ? 2 : 1.5,
        unlink: { cardId: r.id, waitsOn: p, label: `Remove the link: ${r.label} waits on ${y}` }
      });
    }
    const g = a.get(r.id), x = n.bars.get(r.id);
    if (s) {
      const p = t.hiring.bands.find((u) => u.id === r.band), h = x.x + x.width, w = n.x0 + o * n.dayW;
      w > h && e.push({ t: "rect", x: h, y: x.y + x.height / 2 - 3, w: w - h, h: 6, rx: 3, color: v.bar, opacity: 0.45 }), e.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(h + 6, w - 120),
        y: n.narrow ? x.y - 6 : x.y + x.height / 2 - 6,
        text: (n.narrow ? r.label + " · " : "") + "starts " + K(j(l.origin, cn(t, r.id))) + (p ? " · " + R(p.monthly, t.hiring.currency) + "/mo" : ""),
        color: v.ink,
        size: 12,
        role: "start-" + r.id
      });
      continue;
    }
    n.narrow && e.push({ t: "text", x: 8, y: x.y - 6, text: `${r.label} · ${r.duration}d`, color: v.ink, size: 13, bold: g.critical }), g.critical || e.push({ t: "text", x: x.x + x.width + (n.narrow ? 48 : 24), y: x.y + x.height / 2 + 4, text: "+" + g.slack + "d", color: v.ink, size: 12, role: "slack-" + r.id });
  }
  if (s) {
    const r = dn(t), g = t.behaviour?.rules.find((h) => h.on && h.kind === "deadline"), x = g && g.kind === "deadline" && r < g.floor;
    e.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + hn(r),
      color: x || i.refused ? v.refuse : v.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const p = t.hiring.funding;
    if (p && p.day <= o) {
      const h = n.x0 + p.day * n.dayW;
      e.push({ t: "line", x1: h, y1: 26, x2: h, y2: n.height - 8, color: v.accept, width: 2, dash: "6 4" }), n.narrow || e.push({ t: "rect", x: h - 4, y: 26, w: 8, h: 18, rx: 4, color: v.accept }), e.push({ t: "text", x: Math.max(h + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + R(p.amount, t.hiring.currency) + " · " + K(j(l.origin, p.day)), color: v.accept, size: 12, bold: !0 });
    }
    if (n.narrow && e.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: v.ink, size: 12 }), i.clamp) {
      const h = n.parts.find((w) => w.name === i.clamp.name);
      h && e.push(...Et(n, e, i.clamp.text, h, i.view));
    }
    return e;
  }
  const c = n.x0 + t.launch.day * n.dayW;
  e.push({ t: "line", x1: c, y1: n.narrow ? 112 : 26, x2: c, y2: n.height - 8, color: v.launch, width: 2, dash: "6 4" }), e.push({ t: "rect", x: c - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: v.launch });
  for (const r of t.cards) {
    const g = n.bars.get(r.id);
    e.push({ t: "rect", x: g.x + g.width + (n.narrow ? 4 : -5), y: g.y + 4, w: n.narrow ? 6 : 4, h: g.height - 8, rx: 2, color: v.ink, opacity: 0.55 });
  }
  const d = rt(t), f = Math.max(0, ...[...a.values()].map((r) => r.to));
  if (e.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: l ? "Done " + St(t, Math.ceil(f) - 1) + " · " + Vt(t) + " " + St(t, t.launch.day) : `Done day ${d} · launch day ${t.launch.day}`,
    color: i.refused ? v.refuse : v.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const r = n.parts.find((g) => g.name === i.clamp.name);
    r && e.push(...Et(n, e, i.clamp.text, r, i.view));
  }
  return e;
}
const nt = 13, Ct = 16, qt = (t, i) => t * (i ? 0.64 : 0.6), $n = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function An(t) {
  const i = t.size ?? 13, n = t.text.length * qt(i, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - i, w: n, h: i * 1.3 };
}
function Cn(t, i) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= i ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let ft = null;
function Et(t, i, n, s, a) {
  const o = [...t.bars.values()].map((u) => ({ x: u.x - 4, y: u.y - 3, w: u.width + 8, h: u.height + 6 }));
  for (const u of i)
    u.t === "text" ? o.push(An(u)) : u.t === "rect" && o.push({ x: u.x - 2, y: u.y - 2, w: u.w + 4, h: u.h + 4 });
  let l = t.narrow ? 6 : t.x0 + 2, e = t.width - 4, c = t.gridTop + 2, d = t.height - 6;
  a && Math.min(e, a.x + a.width - 8) - Math.max(l, a.x + 8) >= 160 && (l = Math.max(l, a.x + 8), e = Math.min(e, a.x + a.width - 8), Math.min(d, a.y + a.height - 8) - Math.max(c, a.y + 8) >= 40 && (c = Math.max(c, a.y + 8), d = Math.min(d, a.y + a.height - 8)));
  const f = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, r = JSON.stringify([n, f, l, e, c, d, o.map((u) => [u.x, u.y, u.w, u.h].map(Math.round))]);
  if (ft?.key === r) return ft.shapes;
  const g = qt(nt, !0), x = Math.floor((e - l) / g), p = /* @__PURE__ */ new Map();
  for (const u of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const y = Cn(n, Math.max(8, Math.floor(x * u)));
    y.length <= 4 && p.set(y.join(`
`), y);
  }
  let h = null;
  for (const u of p.values()) {
    const y = Math.max(...u.map((S) => S.length)) * g, M = u.length * Ct + 2;
    if (!(y > e - l))
      for (let S = c; S + M <= d; S += 3)
        for (let I = l; I + y <= e; I += 6) {
          const _ = { x: I, y: S, w: y, h: M }, m = Math.max(_.x - f.x, 0, f.x - (_.x + _.w)), k = Math.max(_.y - f.y, 0, f.y - (_.y + _.h)), L = Math.hypot(m, k) + (u.length - 1) * 24;
          h && L >= h.score || o.every((O) => $n(_, O)) && (h = { box: _, lines: u, score: L });
        }
  }
  const w = h ? [{ t: "text", x: h.box.x, y: h.box.y + nt - 1, text: n, lines: h.lines, lineHeight: Ct, color: v.refuse, size: nt, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(s.x + 40, t.width - 4),
    y: s.y + 14,
    text: n,
    color: v.refuse,
    size: nt,
    anchor: s.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return ft = { key: r, shapes: w }, w;
}
const F = (t, i = 1, n) => {
  const s = (o, l) => Math.round(o / l) * l, a = { ...t, cards: t.cards.map((o) => {
    const l = o.id === n ? i : 1, e = { ...o, duration: Math.max(l, s(o.duration, l)), lag: Math.max(0, s(o.lag ?? 0, l)) };
    return e.lag || delete e.lag, e;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, pt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function En(t, i, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(i), a = s && t.cards.find((e) => e.id === s[1]);
  if (!a) return null;
  const o = (e) => t.cards.find((c) => c.id === e)?.label ?? e, l = [
    ...Yt(t, a.id).map((e) => ({
      said: `${a.label} waits on ${o(e)}`,
      edits: [{ kind: "link_tasks", card: { id: a.id }, waitsOn: { id: e } }]
    })),
    ...(a.dependsOn ?? []).map((e) => ({
      said: `${a.label} stops waiting on ${o(e)}`,
      edits: [{ kind: "unlink_tasks", card: { id: a.id }, waitsOn: { id: e } }]
    }))
  ];
  return l.length ? l : `${a.label} has no task it can wait on.`;
}
function Tn(t, i, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * lt(t);
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (i === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  const o = /^(card|handle)-(.+)$/.exec(i), l = o && t.cards.find((e) => e.id === o[2]);
  return l ? s || o[1] === "handle" ? [{ kind: "set_task", card: { id: l.id }, duration: l.duration + a }] : [{ kind: "set_task", card: { id: l.id }, lag: (l.lag ?? 0) + a }] : null;
}
const xt = {
  laneCues: !1,
  notes(t, i, n, s) {
    return dt(xt.places(t, i).parts, t, n, s);
  },
  editsBetween: yt,
  label: Zt,
  places(t, i) {
    const n = _n(t, B(t, i), (s) => {
      const a = t.cards.filter((l) => l.laneId === s), o = ot(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((l) => o.get(l.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => ct(t, On),
  chooser(t, i, n, s = {}) {
    const a = t.cards.findIndex((o) => o.id === i);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (pt(t) ? Rn : Dn)(t, i, a, Yt(t, i), n, s);
  },
  refusalAt(t, i, n, s, a) {
    const o = B(t, a);
    for (const d of t.cards) {
      if (d.id === i || !H(o.bars.get(d.id), s)) continue;
      const f = Bt(t, i, d.id);
      return f ? { laneId: d.laneId, reason: f } : null;
    }
    const l = t.cards.find((d) => d.id === i), e = (l.lag ?? 0) + Math.round((s.x - n.x - o.bars.get(i).x) / o.dayW);
    if (pt(t)) {
      const d = ot(t).get(i), f = Math.round(d.from + (s.x - n.x - o.bars.get(i).x) / o.dayW), r = (l.lag ?? 0) + sn(Ft(t)).idx(f) - d.start, g = lt(t), x = Nt(t, i, { lag: Math.max(0, Math.round(r / g) * g) });
      return typeof x == "string" ? { laneId: l.laneId, reason: x, lands: !0 } : null;
    }
    const c = st(t, { cardId: i, field: "lag" });
    return e > c.max ? { laneId: l.laneId, reason: at(D(t, { cardId: i, field: "lag" }, e), i) ?? c.reasons.max } : null;
  },
  handleDrag(t, i, n, s) {
    const a = B(t, s), o = (x) => N(B(x, s).parts);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    if (pt(t)) return Wn(t, i, n, s, a, o);
    if (i === "handle-launch") {
      const x = st(t, { field: "day" }), p = C(t, i, n, o, (h, w) => h.vary(w, q("launch", "day"), { constraint: (u) => [Q(u.launch.day, rt(u) - 1e-3), b(u.launch.day, 120)] }).onDrop((u) => F(u)));
      return (h) => {
        const w = Math.round((h.x - n.x + 22 - a.x0) / a.dayW), u = p?.(h) ?? D(t, { field: "day" }, Math.min(x.max, Math.max(x.min, w)));
        return w < x.min ? { next: u, clampedReason: x.reasons.min, refusal: at(D(t, { field: "day" }, Math.max(5, w))) ?? void 0 } : { next: u };
      };
    }
    const l = i.slice(7), e = t.cards.findIndex((x) => x.id === l);
    if (e < 0) return null;
    const c = { cardId: l, field: "duration" }, d = st(t, c), f = t.launch.day, r = C(t, i, n, o, (x, p) => x.vary(p, q("cards", e, "duration"), { constraint: (h) => [Q(h.cards[e].duration, 1), b(rt(h), f + 1e-3)] }).onDrop((h) => F(h))), g = a.bars.get(l);
    return (x) => {
      const p = Math.round((x.x - n.x + wt(a.narrow) - g.x) / a.dayW), h = Math.min(d.max, Math.max(d.min, p)), w = r?.(x) ?? D(t, c, h);
      return p > d.max ? { next: w, clampedReason: `Launch is day ${f}.`, refusal: at(D(t, c, Math.min(60, p)), l) ?? d.reasons.max } : p < d.min ? { next: w, clampedReason: d.reasons.min } : { next: w };
    };
  },
  keyEdit: Tn,
  keyChoices: En,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on."
};
function Rn(t, i, n, s, a, o) {
  const l = lt(t), e = on(t), c = t.cards[n].laneId, d = (h) => {
    if (!e) return h;
    const w = rn(t, h, /* @__PURE__ */ new Set([i]));
    return typeof w == "string" ? h : w;
  }, f = (h) => d(F(h, l, i)), r = (h) => N(B(d(h), o).parts, s.map((w) => "card-" + w)), x = (o.narrow ? [c] : t.lanes.map((h) => h.id)).flatMap((h) => Kt(t, i, "lag", h === c ? void 0 : h).map((w) => ({ laneId: h, run: w })));
  if (!x.length) return () => t;
  const p = C(t, "card-" + i, a, r, (h, w) => {
    const u = h.closest(x.map(({ laneId: y, run: [M, S] }) => h.vary(
      { ...w, cards: w.cards.map((I, _) => _ === n ? { ...I, laneId: y, lag: Math.min(S, Math.max(M, I.lag ?? 0)) } : I) },
      q("cards", n, "lag"),
      { constraint: (I) => [Q(I.cards[n].lag ?? 0, M - 0.49), b(I.cards[n].lag ?? 0, S + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? h.closest(s.map((y) => h.dropTarget("target-" + y, Jt(w, i, y)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(u).withBranchTransition(120).onDrop(f) : u.onDrop(f);
  });
  return p ? (h) => f(p(h)) : null;
}
function Wn(t, i, n, s, a, o) {
  const l = (u, y) => {
    const M = [];
    for (const S of u) if (y(S)) {
      const I = M.at(-1);
      I && I[1] === S - (u[1] - u[0]) ? I[1] = S : M.push([S, S]);
    }
    return M;
  }, e = (u, y, M) => Array.from({ length: Math.floor((y - u) / M) + 1 }, (S, I) => u + I * M), c = (u, y, M, S, I) => C(t, i, n, o, (_, m) => _.closest(M.map(([k, L]) => _.vary(
    m,
    q(...u),
    { constraint: (O) => [Q(y(O), k - 0.49), b(y(O), L + 0.49)] }
  ))).withBranchTransition(100).onDrop((k) => F(k, S, I))), d = (u, y, M, S) => (I) => {
    const _ = y(I), m = M(_), k = u?.(I) ?? (m ? t : S(_));
    return m ? { next: k, clampedReason: m, refusal: m } : { next: k };
  };
  if (i === "handle-launch" || i === "handle-funding") {
    const u = i === "handle-launch", y = (m) => u ? D(t, { field: "day" }, m) : { ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: m } } }, M = (m) => u && (m < 5 || m > 120) ? "Launch day is a whole day from 5 to 120." : u && Ht(t) && m < st(t, { field: "day" }).min ? at(y(m)) ?? "Every task ends by " + Vt(t) + "." : Pn(t, y(m)), S = u ? e(5, 120, 1) : e(0, t.hiring.weeks * 7, 1), I = l(S, (m) => !M(m)), _ = I.length ? c(u ? ["launch", "day"] : ["hiring", "funding", "day"], (m) => u ? m.launch.day : m.hiring.funding.day, I, 1) : null;
    return d(_, (m) => Math.round((m.x - n.x + 22 - a.x0) / a.dayW), M, y);
  }
  const f = i.slice(7), r = t.cards.findIndex((u) => u.id === f);
  if (r < 0) return null;
  const g = lt(t), x = a.bars.get(f), p = Kt(t, f, "duration"), h = p.length ? c(["cards", r, "duration"], (u) => u.cards[r].duration, p, g, f) : null;
  return d(
    h,
    (u) => t.cards[r].duration + Math.round((u.x - n.x + wt(a.narrow) - x.x - x.width) / a.dayW),
    (u) => {
      const y = Nt(t, f, { duration: Math.max(g, Math.round(u / g) * g) });
      return typeof y == "string" ? y : null;
    },
    (u) => D(t, { cardId: f, field: "duration" }, u)
  );
}
function Pn(t, i) {
  const n = t.behaviour ? ln(t, i) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function Dn(t, i, n, s, a, o) {
  const l = t.launch.day, e = (d) => N(B(d, o).parts, s.map((f) => "card-" + f)), c = C(t, "card-" + i, a, e, (d, f) => {
    const r = o.narrow ? f.lanes.filter((x) => x.id === f.cards[n].laneId) : f.lanes, g = d.closest(r.map((x) => d.vary(
      { ...f, cards: f.cards.map((p, h) => h === n ? { ...p, laneId: x.id, lag: p.lag ?? 0 } : p) },
      q("cards", n, "lag"),
      { constraint: (p) => [Q(p.cards[n].lag ?? 0, -1e-3), b(rt(p), l + 1e-3)] }
    )));
    return s.length ? d.closest(s.map((x) => d.dropTarget("target-" + x, Jt(f, i, x)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(g).withBranchTransition(120).onDrop((x) => F(x)) : g.onDrop((x) => F(x));
  });
  return c ? (d) => F(c(d)) : null;
}
const V = 76;
function J(t, i = {}) {
  const n = !!i.narrow, s = [], a = t.lanes.map((c) => t.cards.filter((d) => d.laneId === c.id).length), o = (c) => t.lanes[c].role === "won" ? "#bfe3cf" : t.lanes[c].role === "lost" ? "#e4dcdc" : G[c % G.length];
  let l, e;
  if (n) {
    l = Math.max(300, i.width ?? 390);
    let c = V;
    t.lanes.forEach((d, f) => {
      const r = 96 + (a[f] + 1) * 64;
      s.push({ name: "column-" + d.id, x: 2, y: c, width: l - 4, height: r, fill: z(o(f), 0.6), line: z(o(f), 0.1) });
      const g = (l - 16) * 0.36;
      s.push({ name: "lane-" + d.id, x: 8, y: c + 6, width: g, height: 36, text: d.label, fill: o(f), fontSize: 15 }), s.push({ name: "caption-" + d.id, x: 8 + g + 6, y: c + 6, width: l - 16 - g - 6, height: 56, text: It(t, d.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((x) => x.laneId === d.id).forEach((x, p) => s.push({ name: "card-" + x.id, x: 8, y: c + 72 + p * 64, width: l - 16, height: 56, text: Tt(t, x.id), fontSize: 15 })), c += r + 10;
    }), e = c;
  } else {
    const f = 116 + (Math.max(...a) + 1) * 88;
    t.lanes.forEach((r, g) => {
      const x = g * 244;
      s.push({ name: "column-" + r.id, x: x + 2, y: V, width: 240, height: f, fill: z(o(g), 0.6), line: z(o(g), 0.1) }), s.push({ name: "lane-" + r.id, x: x + 8, y: V + 6, width: 228, height: 58, text: r.label, fill: o(g), fontSize: 16 }), s.push({ name: "caption-" + r.id, x: x + 8, y: V + 66, width: 228, height: 48, text: It(t, r.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((p) => p.laneId === r.id).forEach((p, h) => s.push({ name: "card-" + p.id, x: x + 8, y: V + 116 + h * 88, width: 228, height: 76, text: Tt(t, p.id), fontSize: 15 }));
    }), l = t.lanes.length * 244, e = V + f;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(l, 520), height: 34, text: Mn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: s, width: l, height: e };
}
function Tt(t, i) {
  const n = t.cards.find((s) => s.id === i);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + R(n.amount, t.forecast.currency);
}
function Bn(t, i) {
  const { width: n } = J(t, i.layout), s = t.forecast.target, a = Ut(t), o = Math.max(s * 1.25, a), l = n - 8, e = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: l, h: 14, rx: 7, color: v.track },
    { t: "rect", x: 4, y: 42, w: l * a / o, h: 14, rx: 7, color: e ? v.accept : v.bar },
    { t: "line", x1: 4 + l * s / o, y1: 36, x2: 4 + l * s / o, y2: 62, color: v.ink, width: 2 },
    { t: "text", x: 4 + l * s / o, y: 72, text: "Target " + R(s, t.forecast.currency), color: v.ink, size: 14, anchor: "middle" }
  ];
}
const Fn = {
  laneCues: !0,
  places: (t, i) => J(t, i),
  notes: (t, i, n, s) => dt(J(t, i).parts, t, n, s),
  editsBetween: yt,
  layer: (t) => ct(t, Bn),
  chooser(t, i, n, s = {}) {
    const a = Pt(t, i).map((o) => Dt(t, i, o.id));
    return a.length < 2 ? null : jt(C(t, "card-" + i, n, (o) => N(J(o, s).parts), (o, l) => o.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l, { gapIn: 40, gapOut: 56 })), t, i, J(t, s).parts, a);
  },
  refusalAt(t, i, n, s, a) {
    const { parts: o } = J(t, a), l = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === l.laneId || !H(o.find((d) => d.name === "column-" + e.id), s)) continue;
      const c = un(t, i, e.id);
      return c ? { laneId: e.id, reason: c } : null;
    }
    return null;
  },
  handleDrag: () => null
}, A = 48, Z = 960, Qt = 900;
function T(t, i = {}) {
  const n = !!i.narrow, s = t.budget.total, a = [], o = [], l = t.lanes.map((d) => t.cards.filter((f) => f.laneId === d.id).length);
  let e, c;
  if (n) {
    e = Math.max(300, i.width ?? 390);
    let d = A;
    t.lanes.forEach((f, r) => {
      const g = Math.max(100 + (l[r] + 1) * 64, f.allocation / s * Qt);
      o.push({ laneId: f.id, start: d, size: g }), d += g;
    }), c = d + 8;
  } else {
    e = Z;
    let d = 0;
    for (const f of t.lanes)
      o.push({ laneId: f.id, start: d, size: f.allocation / s * Z }), d += f.allocation / s * Z;
    c = A + 100 + (Math.max(...l) + 1) * 64;
  }
  return t.lanes.forEach((d, f) => {
    const { start: r, size: g } = o[f], x = G[f % G.length], p = n ? { x: 2, y: r + 1, width: e - 4, height: g - 2 } : { x: r + 1, y: A, width: Math.max(4, g - 2), height: c - A }, h = { x: p.x + 5, y: p.y, width: Math.max(10, p.width - 10) };
    a.push({ name: "column-" + d.id, ...p, fill: z(x, 0.6), line: z(x, 0.1) });
    const w = n ? h.width * 0.36 : h.width;
    if (a.push({ name: "lane-" + d.id, x: h.x, y: h.y + 6, width: w, height: 32, text: d.label, fill: x, fontSize: 15 }), a.push({
      name: "caption-" + d.id,
      x: n ? h.x + w + 6 : h.x,
      y: h.y + (n ? 6 : 40),
      width: n ? h.width - w - 6 : h.width,
      height: n ? 50 : 40,
      text: n ? Lt(t, d.id).replace(" · ", `
`) : Lt(t, d.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((u) => u.laneId === d.id).forEach((u, y) => a.push({
      name: "card-" + u.id,
      x: h.x,
      y: h.y + 100 + y * 64,
      width: h.width,
      height: 56,
      text: u.label + `
` + R(u.amount, t.budget.currency),
      fontSize: 14
    })), f < t.lanes.length - 1) {
      const u = r + g;
      a.push(n ? { name: "handle-" + d.id, x: e - 96, y: u - 22, width: 88, height: 44 } : { name: "handle-" + d.id, x: u - 22, y: A - 6, width: 44, height: 48 });
    }
  }), { parts: a, width: e, height: c, segments: o, narrow: n };
}
function Nn(t, i) {
  const n = T(t, i.layout), s = t.budget.total, a = [{ t: "text", x: 4, y: 28, text: vn(t), color: v.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((o, l) => {
    const e = n.segments[l], c = o.allocation, d = mn(t, o.id);
    if (n.narrow) {
      const f = e.start + 50, r = 8, g = n.width - 16;
      a.push({ t: "rect", x: r, y: f, w: g, h: 10, rx: 5, color: v.track }), a.push({ t: "rect", x: r, y: f, w: g * d / c || 0, h: 10, rx: 5, color: v.bar }), o.floor !== void 0 && a.push({ t: "line", x1: r + g * o.floor / c, y1: f - 4, x2: r + g * o.floor / c, y2: f + 14, color: v.ink, width: 2 });
    } else {
      const f = Z / s, r = A + 86;
      a.push({ t: "rect", x: e.start + 6, y: r, w: e.size - 12, h: 10, rx: 5, color: v.track }), a.push({ t: "rect", x: e.start + 6, y: r, w: Math.max(0, (e.size - 12) * d / c || 0), h: 10, rx: 5, color: v.bar }), o.floor !== void 0 && a.push({ t: "line", x1: e.start + o.floor * f, y1: r - 6, x2: e.start + o.floor * f, y2: r + 16, color: v.ink, width: 2 }), o.cap !== void 0 && e.start + o.cap * f <= n.width && a.push({ t: "line", x1: e.start + o.cap * f, y1: r - 6, x2: e.start + o.cap * f, y2: r + 16, color: v.refuse, width: 2, dash: "3 2" });
    }
    if (l < t.lanes.length - 1) {
      const f = e.start + e.size;
      a.push(n.narrow ? { t: "line", x1: 2, y1: f, x2: n.width - 2, y2: f, color: v.ink, width: 2 } : { t: "line", x1: f, y1: A, x2: f, y2: n.height, color: v.ink, width: 2 }), a.push(n.narrow ? { t: "rect", x: n.width - 68, y: f - 4, w: 32, h: 8, rx: 4, color: v.ink } : { t: "rect", x: f - 4, y: A + 2, w: 8, h: 30, rx: 4, color: v.ink });
    }
  }), i.clamp) {
    const o = n.parts.find((l) => l.name === i.clamp.name);
    o && a.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(o.x + 22, 120), n.width - 120),
      y: n.narrow ? o.y + 8 : A - 12,
      text: i.clamp.text,
      color: v.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return a;
}
const Hn = (t, i) => Math.round(t / i) * i, Kn = {
  laneCues: !0,
  notes: (t, i, n, s) => dt(T(t, i).parts, t, n, s),
  editsBetween: yt,
  label: Zt,
  places(t, i) {
    const { parts: n, width: s, height: a } = T(t, i);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => ct(t, Nn),
  chooser(t, i, n, s = {}) {
    const a = Pt(t, i).map((o) => Dt(t, i, o.id));
    return a.length < 2 ? null : jt(C(t, "card-" + i, n, (o) => N(T(o, s).parts), (o, l) => o.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l)), t, i, T(t, s).parts, a);
  },
  refusalAt(t, i, n, s, a) {
    const { parts: o } = T(t, a), l = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === l.laneId || !H(o.find((d) => d.name === "column-" + e.id), s)) continue;
      const c = pn(t, i, e.id);
      return c ? { laneId: e.id, reason: c } : null;
    }
    return null;
  },
  handleDrag(t, i, n, s) {
    const a = i.slice(7), o = t.lanes.findIndex((p) => p.id === a), l = t.lanes[o + 1];
    if (o < 0 || !l) return null;
    const e = fn(t, { laneId: a }), c = t.budget.step, d = (p) => {
      const h = Math.min(e.max, Math.max(e.min, Hn(p, c)));
      return _t(t, l.id, a, h);
    }, f = T(t, s), r = f.narrow ? Qt / t.budget.total : Z / t.budget.total, g = f.parts.find((p) => p.name === i), x = C(t, i, n, (p) => N(T(p, s).parts), (p) => p.varyFunc([0], ([h]) => _t(t, l.id, a, h), { constraint: (h) => [
      ...en([e.min, h.lanes[o].allocation - t.lanes[o].allocation, e.max])
    ] }));
    return (p) => {
      const w = (f.narrow ? p.y - n.y - g.y : p.x - n.x - g.x) / r, u = x?.(p), y = u ? u.lanes[o].allocation - t.lanes[o].allocation : w, M = { next: d(y) };
      return w > e.max + c / 2 ? { ...M, clampedReason: e.reasons.max } : w < e.min - c / 2 ? { ...M, clampedReason: e.reasons.min } : M;
    };
  },
  keyEdit(t, i, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = /^handle-(.+)$/.exec(i)?.[1], a = t.lanes.findIndex((d) => d.id === s), o = t.lanes[a + 1];
    if (a < 0 || !o) return null;
    const l = n === "ArrowRight" || n === "ArrowDown", e = t.budget.step;
    return [l ? { kind: "shift_budget", from: { id: o.id }, to: { id: s }, amount: e } : { kind: "shift_budget", from: { id: s }, to: { id: o.id }, amount: e }];
  }
}, Vn = { pile: "#fbdfac", theme: "#efd7dc", outcome: "#d5e9e3", opportunity: "#dedef4", problem: "#efd7dc", cause: "#fbdfac", action: "#dcebf3" }, Jn = (t) => Vn[t.role ?? ""] ?? "#fffdf6", W = 64, Rt = 8, et = 220, Y = 84, X = (t, i) => i.narrow ? "outline" : t.nest?.layout ?? "clusters";
function Wt(t, i) {
  const n = [], s = (a, o) => {
    n.push({ card: a, depth: o });
    for (const l of $(t, a.id)) s(l, o + 1);
  };
  for (const a of Gt(t, i)) s(a, 0);
  return n;
}
const Un = kn;
function P(t, i = {}) {
  const n = X(t, i), { main: s, tray: a } = U(t), o = [], l = (p, h, w, u, y) => {
    o.push({ name: "lane-" + p, x: h, y: w, width: u, height: 40, text: t.lanes.find((M) => M.id === p).label, fill: p === a ? "#e9e5da" : "#d5e9e3", fontSize: 16 }), o.push({ name: "caption-" + p, x: h, y: w + 44, width: u, height: 26, text: y, fill: "transparent", lineWidth: 0, fontSize: 14 });
  }, e = (p) => wn.caption(t, p), c = (p, h, w, u, y = W) => o.push({ name: "card-" + p.id, x: h, y: w, width: u, height: y, text: Un(t, p), fill: Jn(p), fontSize: 14 });
  if (n === "outline") {
    const p = Math.max(300, i.width ?? 358);
    let h = 0;
    for (const w of [s, a]) {
      const u = h;
      l(w, 8, h + 6, p - 16, e(w)), h += 82;
      for (const { card: y, depth: M } of Wt(t, w))
        c(y, 8 + 20 * M, h, p - 16 - 20 * M, 44), h += 52;
      h += 44, o.unshift({ name: "column-" + w, x: 2, y: u, width: p - 4, height: h - u, fill: z(w === a ? "#e9e5da" : "#d5e9e3", 0.6), line: z("#d5e9e3", 0.1) }), h += 10;
    }
    return { parts: o, width: p, height: h };
  }
  const d = Wt(t, a);
  l(a, 8, 6, et - 16, e(a)), d.forEach(({ card: p }, h) => c(p, 8, Y + h * (W + Rt), et - 16));
  const f = Y + Math.max(1, d.length + 1) * (W + Rt), r = et + 16;
  let g, x;
  if (n === "clusters") {
    const w = Gt(t, s);
    let u = Y, y = 0;
    w.forEach((M, S) => {
      S && S % 4 === 0 && (u += y + 16, y = 0);
      const I = r + S % 4 * 220;
      let _ = u;
      const m = (k, L) => {
        c(k, I + 12 * L, _, 208 - 12 * L, L ? W : 56), _ += (L ? W : 56) + 6;
        for (const O of $(t, k.id)) m(O, L + 1);
      };
      m(M, 0), y = Math.max(y, _ - u);
    }), g = r + 4 * 220 + 8, x = Math.max(f, u + y + W + 40), l(s, r, 6, Math.min(g - r - 8, 640), e(s));
  } else {
    const h = W + 44;
    let w = 0, u = 0;
    const y = (M, S) => {
      u = Math.max(u, S);
      const _ = $(t, M.id).map((k) => y(k, S + 1)), m = _.length ? (_[0] + _[_.length - 1]) / 2 : w++;
      return c(M, r + m * 192, Y + S * h, 176), m;
    };
    for (const M of $(t, null, s)) y(M, 0);
    g = r + Math.max(3, w) * 192 + 8, x = Math.max(f, Y + (u + 1) * h + 56), l(s, r, 6, Math.min(g - r - 8, 640), e(s));
  }
  return o.unshift(
    { name: "column-" + s, x: r - 6, y: 0, width: g - r + 4, height: x, fill: z("#d5e9e3", 0.75), line: z("#d5e9e3", 0.1) },
    { name: "column-" + a, x: 2, y: 0, width: et - 4, height: x, fill: z("#e9e5da", 0.5), line: z("#e9e5da", 0.1) }
  ), { parts: o, width: g, height: x };
}
function Gn(t, i) {
  if (X(t, i.layout) !== "tree") return [];
  const { parts: n } = P(t, i.layout), s = new Map(n.map((a) => [a.name, a]));
  return t.cards.flatMap((a) => {
    const o = a.parentId && s.get("card-" + a.parentId), l = s.get("card-" + a.id);
    if (!o || !l) return [];
    const e = o.x + o.width / 2, c = o.y + o.height, d = l.x + l.width / 2, f = l.y, r = (c + f) / 2;
    return [{ t: "path", d: `M ${e} ${c} V ${r} H ${d} V ${f}`, color: v.week, width: 2 }];
  });
}
function it(t, i, n) {
  for (let s = t.length - 1; s >= 0; s--) {
    const a = t[s];
    if (a.name.startsWith("card-") && !n.has(a.name.slice(5)) && H(a, i)) return a.name.slice(5);
  }
  return null;
}
function gt(t, i, n) {
  const s = t.cards.find((a) => a.id === n);
  return s.laneId === U(t).tray ? null : i === "tree" || !s.parentId || t.cards.some((a) => a.parentId === n) ? n : s.parentId;
}
function jn(t, i, n, s, a, o) {
  const l = t.cards.find((r) => r.id === n);
  if (gt(t, i, n) === n) return { laneId: l.laneId, under: n, before: null };
  const c = l.parentId ?? null, d = (c ? $(t, c) : $(t, null, l.laneId)).filter((r) => r.id !== o), f = s.y > a.y + a.height / 2;
  return { laneId: l.laneId, under: c, before: f ? d[d.findIndex((r) => r.id === n) + 1]?.id ?? null : n };
}
const Yn = (t, i) => t === i || JSON.stringify(t.cards) === JSON.stringify(i.cards);
function Zn(t, i) {
  const n = [], s = new Set((t.nest?.aliases ?? []).map(([m]) => m));
  for (const [m, k] of i.nest?.aliases ?? [])
    !s.has(m) && t.cards.some((L) => L.id === m) && !i.cards.some((L) => L.id === m) && n.push({ kind: "merge_cards", card: { id: m }, into: { id: k } });
  let a = t;
  if (n.length) {
    const m = ut(t, n);
    "refused" in m || (a = m.workshop);
  }
  const o = new Map(a.cards.map((m) => [m.id, m])), l = /* @__PURE__ */ new Set(), e = [], c = [], d = [], f = [], r = [], g = [], x = [];
  for (const m of i.cards) {
    if (o.has(m.id) || m.parentId || m.role !== "pile") continue;
    const k = i.cards.filter((L) => L.parentId === m.id);
    k.length !== 1 || !o.has(k[0].id) || (e.push({ kind: "start_pile", card: { id: k[0].id }, ...m.label !== "New pile" && { label: m.label } }), l.add(m.id).add(k[0].id));
  }
  for (const m of a.cards) i.cards.some((k) => k.id === m.id) || c.push({ kind: "remove_card", card: { id: m.id } });
  for (const m of i.nest?.fields ?? [])
    (a.nest?.fields ?? []).some((k) => k.id === m.id) || d.push({ kind: "add_field", label: m.label, ...m.currency && { currency: m.currency } });
  i.nest && a.nest?.layout !== i.nest.layout && d.push({ kind: "set_layout", layout: i.nest.layout });
  const p = i.cards.filter((m) => !o.has(m.id) && !l.has(m.id)), h = /* @__PURE__ */ new Set();
  for (; h.size < p.length; ) {
    const m = p.filter((k) => !h.has(k.id) && (!k.parentId || !p.some((L) => L.id === k.parentId) || h.has(k.parentId)));
    if (!m.length) break;
    for (const k of m)
      h.add(k.id), f.push({
        kind: "add_card",
        lane: { id: k.laneId },
        label: k.label,
        ...k.parentId && { under: { id: k.parentId } },
        ...k.role && { role: k.role },
        ...k.source && { source: k.source }
      });
  }
  const w = (m) => {
    let k = 0;
    for (let L = i.cards.find((O) => O.id === m); L?.parentId && k < 12; L = i.cards.find((O) => O.id === L.parentId)) k++;
    return k;
  }, u = (m, k) => (k.parentId ? $(m, k.parentId) : $(m, null, k.laneId)).map((L) => L.id), y = i.cards.filter((m) => {
    const k = o.get(m.id);
    if (!k || l.has(m.id)) return !1;
    if (k.parentId !== m.parentId || k.laneId !== m.laneId && !m.parentId) return !0;
    const L = u(i, m).filter((ht) => o.has(ht)), O = u(a, k).filter((ht) => L.includes(ht));
    return L[L.indexOf(m.id) - 1] !== O[O.indexOf(m.id) - 1];
  }), M = new Map(y.map((m) => [m.id, u(i, m).indexOf(m.id)]));
  y.sort((m, k) => w(m.id) - w(k.id) || (m.parentId ?? m.laneId).localeCompare(k.parentId ?? k.laneId) || M.get(k.id) - M.get(m.id));
  for (const m of y) {
    const k = u(i, m), L = k[k.indexOf(m.id) + 1];
    r.push({ kind: "nest_card", card: { id: m.id }, ...m.parentId ? { under: { id: m.parentId } } : { lane: { id: m.laneId } }, ...L && { before: { id: L } } });
  }
  for (const m of i.cards) {
    const k = o.get(m.id);
    !k || l.has(m.id) || (k.label !== m.label && x.push({ kind: "rename_card", card: { id: m.id }, label: m.label }), m.role && k.role !== m.role && g.push({ kind: "set_role", card: { id: m.id }, role: m.role }), m.source && k.source !== m.source && x.push({ kind: "set_source", card: { id: m.id }, source: m.source }));
  }
  for (const m of i.cards) {
    const k = o.get(m.id);
    for (const L of /* @__PURE__ */ new Set([...Object.keys(k?.fields ?? {}), ...Object.keys(m.fields ?? {})]))
      k?.fields?.[L] !== m.fields?.[L] && x.push({ kind: "set_field", card: { id: m.id }, field: L, value: m.fields?.[L] ?? null });
  }
  for (const m of i.lanes) {
    const k = a.lanes.find((L) => L.id === m.id);
    k && k.label !== m.label && x.push({ kind: "rename_lane", lane: { id: m.id }, label: m.label });
  }
  t.title !== i.title && x.push({ kind: "rename_workshop", title: i.title });
  const S = [...n, ...e, ...c, ...d, ...f], I = [...S, ...r, ...g, ...x];
  if (!r.length || !g.length) return I;
  const _ = [...S, ...g, ...r, ...x];
  return "refused" in ut(t, I) && !("refused" in ut(t, _)) ? _ : I;
}
const Xn = {
  laneCues: !0,
  places: (t, i) => P(t, i),
  notes: (t, i, n, s) => dt(P(t, i).parts, t, n, s),
  editsBetween: Zn,
  layer: (t) => ct(t, Gn),
  cardKeys: "Right puts it under the card above it, Left takes it out, Up and Down move it among its neighbours.",
  label(t, i) {
    const n = t.cards.find((a) => "card-" + a.id === i);
    if (!n) return null;
    const s = t.cards.find((a) => a.id === n.parentId);
    return n.label + (n.role ? ", " + n.role : "") + (s ? ", under " + s.label : ", in " + t.lanes.find((a) => a.id === n.laneId).label);
  },
  chooser(t, i, n, s = {}) {
    const a = gn(t, i), o = a.map((p) => p.next), { main: l, tray: e } = U(t), c = t.cards.find((p) => p.id === i), d = X(t, s), f = o.length > 1 ? C(t, "card-" + i, n, (p) => N(P(p, s).parts), (p, h) => p.closest(o, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(h, { gapIn: 40, gapOut: 56 })) : null, { parts: r } = P(t, s), g = new Set(zt(t, i));
    let x;
    return (p) => {
      const h = d === "outline" ? null : it(r, p, g);
      if (h) {
        const u = jn(t, d, h, p, r.find((M) => M.name === "card-" + h), i), y = a.find((M) => M.spot.laneId === u.laneId && M.spot.under === u.under && M.spot.before === u.before);
        if (y) return y.next;
      }
      const w = f ? f(p) : t;
      return Yn(w, t) ? c.laneId !== e && H(r.find((u) => u.name === "column-" + e), p) ? Ot(t, i, { laneId: e, under: null, before: null }) ?? t : H(r.find((u) => u.name === "column-" + l), p) && !it(r, p, /* @__PURE__ */ new Set()) ? (x === void 0 && (x = yn(t, i)), x ?? t) : w : w;
    };
  },
  refusalAt(t, i, n, s, a) {
    const o = X(t, a);
    if (o === "outline") return null;
    const { parts: l } = P(t, a), e = it(l, s, new Set(zt(t, i))), c = e && gt(t, o, e), d = t.cards.find((g) => g.id === i);
    if (!c || c === d.parentId) return null;
    const f = Ot(t, i, { laneId: U(t).main, under: c, before: null }), r = f && t.behaviour ? xn(t, f) : null;
    return r && "refused" in r ? { laneId: U(t).main, reason: r.refused.sentence } : null;
  },
  noteUnder(t, i, n) {
    const s = it(P(t, n).parts, i, /* @__PURE__ */ new Set());
    return s ? gt(t, X(t, n), s) : null;
  },
  keyEdit(t, i, n) {
    const s = t.cards.find((c) => "card-" + c.id === i);
    if (!s) return null;
    const a = s.parentId ? $(t, s.parentId) : $(t, null, s.laneId), o = a.findIndex((c) => c.id === s.id), l = { id: s.id }, e = (c) => c ? { under: { id: c } } : { lane: { id: s.laneId } };
    switch (n.key) {
      case "ArrowRight":
        return o > 0 && s.laneId !== U(t).tray ? [{ kind: "nest_card", card: l, under: { id: a[o - 1].id } }] : null;
      case "ArrowLeft": {
        const c = t.cards.find((r) => r.id === s.parentId);
        if (!c) return null;
        const d = c.parentId ? $(t, c.parentId) : $(t, null, c.laneId), f = d[d.findIndex((r) => r.id === c.id) + 1];
        return [{ kind: "nest_card", card: l, ...e(c.parentId), ...f && { before: { id: f.id } } }];
      }
      case "ArrowUp":
        return o > 0 ? [{ kind: "nest_card", card: l, ...e(s.parentId), before: { id: a[o - 1].id } }] : null;
      case "ArrowDown":
        return o >= 0 && o < a.length - 1 ? [{ kind: "nest_card", card: l, ...e(s.parentId), ...a[o + 2] && { before: { id: a[o + 2].id } } }] : null;
    }
    return null;
  },
  handleDrag: () => null
}, qn = { "launch-plan": xt, "hiring-plan": xt, pipeline: Fn, budget: Kn, nest: Xn };
function se(t) {
  const i = qn[t];
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return i;
}
function ae(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  le as amountLimits,
  ce as amountOf,
  be as amountRules,
  de as bandOf,
  ti as behaviourEditsBetween,
  ae as boardLayoutFor,
  mi as breakDownSample,
  Lt as budgetCaption,
  mn as budgetCommitted,
  vn as budgetHeader,
  Kn as budgetKit,
  T as budgetLayout,
  fn as budgetLimits,
  pn as budgetRefusal,
  ni as budgetRules,
  ei as budgetShiftLimits,
  ii as budgetShiftRefusal,
  xi as byOrder,
  on as cascadeStops,
  si as catalogSamples,
  xn as checkNest,
  gi as checkNestMove,
  ln as checkTime,
  Ft as clockOf,
  ct as createBoardLayer,
  he as currencyOf,
  ue as dateName,
  fe as dayFromWords,
  sn as dayMap,
  St as dayWords,
  pe as days,
  yi as discoveryTreeSample,
  me as downstreamTasks,
  xe as extendWorkshopEdits,
  ge as goLiveSample,
  Zt as handleLabel,
  ye as hireLagFor,
  cn as hireStarts,
  we as hiringPlanRules,
  ke as hiringPlanSample,
  rn as holdOthers,
  wi as incidentReviewSample,
  ki as isOrderKey,
  j as isoAt,
  Me as isoTime,
  se as kitFor,
  rt as launchFinish,
  Ht as launchHard,
  ve as launchIndex,
  B as launchLayout,
  Bt as launchLinkRefusal,
  Yt as launchLinkTargets,
  at as launchOverrun,
  Se as launchPlanCaption,
  xt as launchPlanKit,
  st as launchPlanLimits,
  Ie as launchPlanRefusal,
  Le as launchPlanRules,
  _e as launchPlanSample,
  ze as launchTaskText,
  v as layerInk,
  Kt as legalRuns,
  Vt as lineWord,
  R as money,
  Oe as monthNames,
  Mi as nestAlias,
  U as nestAreas,
  kn as nestCardText,
  vi as nestDepth,
  Si as nestDrags,
  Zn as nestEditsBetween,
  yn as nestEmptyDrop,
  Ii as nestFamily,
  $ as nestKids,
  Xn as nestKit,
  P as nestLayout,
  gn as nestLegal,
  Li as nestMeasure,
  _i as nestMeasureWords,
  Ot as nestPlace,
  Gt as nestRoots,
  wn as nestRules,
  zi as nestSentence,
  zt as nestSubtree,
  $e as nextCardId,
  Ae as nextMonday,
  Ce as noteNumbers,
  vt as offsetOf,
  Oi as orderBetween,
  $i as orderKeys,
  Ee as ownField,
  dt as partNotes,
  an as pastTheLine,
  It as pipelineCaption,
  Ut as pipelineForecast,
  Mn as pipelineGauge,
  Fn as pipelineKit,
  J as pipelineLayout,
  ai as pipelineLimits,
  un as pipelineRefusal,
  oi as pipelineRules,
  ri as planBudgetMove,
  Te as planDrags,
  Re as planEdit,
  We as planFixed,
  Pe as planLaunchPlanMove,
  li as planPipelineMove,
  De as planProblem,
  Be as planWords,
  Fe as presetRules,
  Ne as readClock,
  He as readNoteNumbers,
  Ke as renamedNumbers,
  At as renderLayerShapes,
  ci as restoreWorkshop,
  Ai as roleOf,
  Ve as runwayCap,
  Je as runwayHeader,
  dn as runwayMonths,
  hn as runwayWords,
  di as sampleBudget,
  Ue as sampleLaunchPlan,
  hi as samplePipeline,
  ot as scheduleLaunch,
  _t as shiftBudget,
  K as shortDate,
  lt as snapStep,
  Ci as sortEvidenceSample,
  Ei as tidyKeys,
  Ge as timeFamily,
  je as timeRuleKindIds,
  Ye as timeSentence,
  Nt as tryTask,
  ui as validateBudget,
  Ze as validateHiringPlan,
  Xe as validateLaunchPlan,
  Ti as validateNest,
  fi as validatePipeline,
  Mt as weekdayAt,
  qe as weekendAt,
  Jt as withLink,
  D as withTaskValue,
  yt as workshopEditsBetween
};
