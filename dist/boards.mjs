import { Vec2 as Wn, getElementPositionCheap as mt, translate as xt, dragSpecToBehavior as yt, param as on, moreThan as rn, lessThan as ln, inOrder as gt } from "./dragology.mjs";
import { laneColors as en, workshopDestinations as jn, workshopCandidate as Gn, applyWorkshopEdits as nn } from "./workshop-model.mjs";
import { m as V, G as Yn, I as fn, _ as U, Z as pn, Q as mn, u as wt, v as Zn, X as yn, z as Qn, V as Xn, a5 as kt, C as bn, W as Mt, a0 as vt, T as nt, a3 as zt, R as xn, $ as tt, w as Rn, j as Tn, s as Q, f as sn, a6 as St, ac as It, ad as _t, U as Pn } from "./plans-BI5v9TGn.mjs";
import { a as Oe, d as Ce, a8 as $e, c as We, p as Re, t as Te, ag as Pe, Y as De, P as Be, g as Fe, a7 as Ne, ab as He, h as Ke, i as qe, S as Ve, H as Ue, F as Je, N as je, l as Ge, J as Ye, e as Ze, n as Qe, q as Xe, b as be, o as ni, B as ti, M as ei, y as ii, E as si, x as ai, A as oi, L as ri, O as li, af as ci, r as di, ae as hi, aa as ui, K as fi, a4 as pi, a2 as mi, a1 as xi, a9 as yi, D as gi, k as wi } from "./plans-BI5v9TGn.mjs";
import cn from "react";
import { pipelineForecast as et, pipelineRefusal as At, pipelineCaption as Dn, budgetLimits as Et, budgetRefusal as Lt, budgetCaption as Bn, shiftBudget as Fn, budgetCommitted as Ot } from "./workshop-rules.mjs";
import { amountRules as Mi, behaviourEditsBetween as vi, budgetRules as zi, budgetShiftLimits as Si, budgetShiftRefusal as Ii, catalogSamples as _i, pipelineLimits as Ai, pipelineRules as Ei, planBudgetMove as Li, planPipelineMove as Oi, restoreWorkshop as Ci, sampleBudget as $i, samplePipeline as Wi, validateBudget as Ri, validatePipeline as Ti } from "./workshop-rules.mjs";
import { nestKids as W, nestAreas as R, nestSubtree as Sn, nestPlace as In, checkNest as Ct, nestLegal as $t, nestEmptyDrop as Wt, nestCardText as Rt, nestRules as Tt, nestRoots as it } from "./workshop-nest.mjs";
import { breakDownSample as Di, byOrder as Bi, checkNestMove as Fi, discoveryTreeSample as Ni, extend as Hi, incidentReviewSample as Ki, isOrderKey as qi, nestAlias as Vi, nestDepth as Ui, nestDrags as Ji, nestFamily as ji, nestMeasure as Gi, nestMeasureWords as Yi, nestSentence as Zi, orderBetween as Qi, orderKeys as Xi, registerNestPlus as bi, roleOf as ns, sortEvidenceSample as ts, tidyKeys as es, validateNest as is } from "./workshop-nest.mjs";
import { nestScores as tn, nestAxes as st, nestQuadrants as Pt, quadrantOf as Dt } from "./workshop-nest-plus.mjs";
import { goalsSample as as, impactEffortSample as os, isOrgChart as rs, reorgSample as ls, scoreBoard as cs, scoresIn as ds } from "./workshop-nest-plus.mjs";
const I = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, _n = "http://www.w3.org/2000/svg", Nn = (n) => /var\([^,]+,\s*([^)]+)\)/.exec(n)?.[1].trim() ?? n;
function N(n, e, t) {
  const s = document.createElementNS(_n, n);
  for (const [a, o] of Object.entries(e)) s.setAttribute(a, String(o));
  return t?.fill && (s.setAttribute("fill", Nn(t.fill)), s.style.setProperty("fill", t.fill)), t?.stroke && (s.setAttribute("stroke", Nn(t.stroke)), s.style.setProperty("stroke", t.stroke)), s;
}
function Hn(n, e, t, s) {
  const a = typeof document < "u" ? document.activeElement : null, o = a && n.contains(a) ? a.getAttribute("data-board-link") : null;
  for (; n.firstChild; ) n.removeChild(n.firstChild);
  const r = [];
  for (const i of e)
    if (i.t === "line")
      n.appendChild(N("line", {
        x1: i.x1,
        y1: i.y1,
        x2: i.x2,
        y2: i.y2,
        "stroke-width": i.width ?? 1,
        ...i.dash ? { "stroke-dasharray": i.dash } : {}
      }, { stroke: i.color }));
    else if (i.t === "rect")
      n.appendChild(N("rect", {
        x: i.x,
        y: i.y,
        width: Math.max(0, i.w),
        height: Math.max(0, i.h),
        rx: i.rx ?? 0,
        ...i.opacity !== void 0 ? { opacity: i.opacity } : {}
      }, { fill: i.color }));
    else if (i.t === "text") {
      const u = N("text", {
        x: i.x,
        y: i.y,
        "font-size": i.size ?? 13,
        "text-anchor": i.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...i.bold ? { "font-weight": 600 } : {},
        ...i.role ? { "data-board-layer": i.role } : {}
      }, { fill: i.color });
      i.lines && i.lines.length > 1 ? i.lines.forEach((l, p) => {
        const c = N("tspan", { x: i.x, dy: p ? i.lineHeight ?? Math.round((i.size ?? 13) * 1.25) : 0 });
        c.textContent = p < i.lines.length - 1 ? l + " " : l, u.appendChild(c);
      }) : u.textContent = i.text, n.appendChild(u);
    } else {
      if (i.unlink && t) {
        const { cardId: u, waitsOn: l, label: p } = i.unlink, c = l + ">" + u, y = s?.armed === c, m = N("path", {
          d: i.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": c,
          "aria-label": y ? p + ". Tap again to remove it." : p,
          role: "button",
          tabindex: 0,
          ...y ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: y ? I.refuse : "transparent" });
        let d = !1;
        m.addEventListener("pointerdown", (h) => {
          h.stopPropagation(), d = h.pointerType === "touch" || h.pointerType === "pen";
        }), m.addEventListener("click", (h) => {
          if (h.stopPropagation(), d && s && s.armed !== c) {
            s.arm(c);
            return;
          }
          s?.arm(null), t(u, l);
        }), m.addEventListener("keydown", (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), h.stopPropagation(), t(u, l));
        }), m.addEventListener("focus", () => {
          m.style.setProperty("stroke", I.accept), m.setAttribute("opacity", "0.35");
        }), m.addEventListener("blur", () => {
          y || (m.style.setProperty("stroke", "transparent"), m.removeAttribute("opacity"));
        }), n.appendChild(m), r.push(m);
      }
      if (n.appendChild(N("path", { d: i.d, fill: "none", "stroke-width": i.width ?? 1.5, "pointer-events": "none" }, { stroke: i.color })), i.arrow) {
        const { x: u, y: l, angle: p } = i.arrow;
        n.appendChild(N("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${u} ${l}) rotate(${p})`, "pointer-events": "none" }, { fill: i.color }));
      }
      if (i.unlink && s?.armed === i.unlink.waitsOn + ">" + i.unlink.cardId && i.arrow) {
        const u = N("text", {
          x: i.arrow.x - 6,
          y: i.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: I.refuse });
        u.textContent = "Tap again to remove this link", n.appendChild(u);
      }
    }
  o && r.find((i) => i.getAttribute("data-board-link") === o)?.focus({ preventScroll: !0 });
}
function gn(n, e) {
  const t = n?.canvas?.node, s = document.createElementNS(_n, "g");
  s.setAttribute("data-board-layer", ""), s.setAttribute("pointer-events", "none");
  const a = document.createElementNS(_n, "g");
  a.setAttribute("data-board-layer-top", ""), a.setAttribute("pointer-events", "none");
  let o = !1, r = null, i;
  const u = {
    armed: null,
    arm(p) {
      clearTimeout(i), u.armed = p, p && (i = setTimeout(() => u.arm(null), 5e3), r?.[2].announce?.("Link selected. Tap it again to remove it.")), r && l.draw(...r);
    }
  }, l = {
    draw(p, c, y) {
      if (o || !t) return;
      r = [p, c, y];
      const { origin: m } = y, d = e(c ?? p, y, p), h = (g) => g.t === "text" && (g.role === "clamp" || g.role === "refusal");
      for (const g of [s, a]) g.setAttribute("transform", `translate(${m.x} ${m.y})`);
      Hn(s, d.filter((g) => !h(g)), y.onUnlink, u), Hn(a, d.filter(h));
      const k = y.above && y.above.parentNode === t ? y.above : null, f = k ? k.nextSibling : t.firstChild;
      (s.parentNode !== t || s.previousSibling !== k) && t.insertBefore(s, f === s ? s.nextSibling : f), a.firstChild && t.lastChild !== a ? t.appendChild(a) : !a.firstChild && a.parentNode && a.remove();
    },
    destroy() {
      o = !0, clearTimeout(i), s.remove(), a.remove();
    }
  };
  return l;
}
function Y(n, e = []) {
  const t = n.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return cn.createElement(
    "g",
    null,
    ...t.map((s) => /* @__PURE__ */ cn.createElement("g", { id: s.name, transform: xt(s.x, s.y) }, /* @__PURE__ */ cn.createElement("rect", { width: s.width, height: s.height }))),
    ...n.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ cn.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function F(n, e, t, s, a) {
  let o;
  const i = {
    draggable: (l) => (o ?? (o = l.d), s(l.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: Wn(t.x, t.y),
    startState: n,
    debug: { varyVisualizer: !1 }
  };
  if (!mt(i, n) || !o) return null;
  const u = yt(a(o, n), i);
  return (l) => u({ pointer: Wn(l.x, l.y) }).dropState;
}
const T = (n, e, t = 0) => !!n && e.x >= n.x - t && e.x <= n.x + n.width + t && e.y >= n.y - t && e.y <= n.y + n.height + t;
function at(n, e, t, s, a) {
  if (!n) return null;
  const o = e.cards.find((r) => r.id === t).laneId;
  return (r) => {
    const i = n(r);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const u = s.find((l) => l.name.startsWith("column-") && l.name !== "column-" + o && T(l, r));
    return u && a.find((l) => l.cards.find((p) => p.id === t).laneId === u.name.slice(7)) || i;
  };
}
function L(n, e) {
  const t = (s) => Math.round(parseInt(n.slice(s, s + 2), 16) * (1 - e) + 255 * e).toString(16).padStart(2, "0");
  return "#" + t(1) + t(3) + t(5);
}
function Ln(n, e) {
  const t = [], s = new Map(n.cards.map((i) => [i.id, i]));
  for (const i of e.cards) {
    const u = s.get(i.id), l = { id: i.id };
    if (!u) {
      t.push({
        kind: "add_card",
        lane: { id: i.laneId },
        label: i.label,
        ...i.duration !== void 0 && { duration: i.duration },
        ...i.lag && { lag: i.lag },
        ...i.dependsOn && { waitsOn: i.dependsOn.map((c) => ({ id: c })) },
        ...i.amount !== void 0 && { amount: i.amount }
      });
      continue;
    }
    u.label !== i.label && t.push({ kind: "rename_card", card: l, label: i.label });
    const p = t.length;
    for (const c of u.dependsOn ?? []) i.dependsOn?.includes(c) || t.push({ kind: "unlink_tasks", card: l, waitsOn: { id: c } });
    for (const c of i.dependsOn ?? []) u.dependsOn?.includes(c) || t.push({ kind: "link_tasks", card: l, waitsOn: { id: c } });
    u.laneId !== i.laneId && t.push({ kind: "move_card", card: l, lane: { id: i.laneId } }), (t.length > p && i.duration !== void 0 && t.slice(p).some((c) => c.kind !== "move_card") || u.duration !== i.duration || (u.lag ?? 0) !== (i.lag ?? 0)) && t.push({ kind: "set_task", card: l, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && u.amount !== i.amount && t.push({ kind: "set_amount", card: l, amount: i.amount });
  }
  for (const i of n.cards) e.cards.some((u) => u.id === i.id) || t.push({ kind: "remove_card", card: { id: i.id } });
  e.launch && n.launch?.day !== e.launch.day && t.push({ kind: "set_launch_day", day: e.launch.day }), e.forecast && n.forecast?.target !== e.forecast.target && t.push({ kind: "set_target", amount: e.forecast.target });
  const a = e.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (n.lanes.find((u) => u.id === i.id)?.allocation ?? 0) })), o = a.filter((i) => i.by < 0), r = a.filter((i) => i.by > 0);
  for (const i of r)
    for (const u of o) {
      const l = Math.min(i.by, -u.by);
      l <= 0 || (t.push({ kind: "shift_budget", from: { id: u.id }, to: { id: i.id }, amount: l }), i.by -= l, u.by += l);
    }
  for (const i of e.lanes) {
    const u = n.lanes.find((l) => l.id === i.id);
    u && u.label !== i.label && t.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label }), u && u.capacity !== i.capacity && t.push({ kind: "set_lane_capacity", lane: { id: i.id }, capacity: i.capacity ?? null });
  }
  return n.title !== e.title && t.push({ kind: "rename_workshop", title: e.title }), t;
}
function Bt(n) {
  const e = n.forecast?.currency;
  return `Forecast ${V(et(n), e)} of ${V(n.forecast?.target ?? 0, e)}`;
}
function Ft(n) {
  return `${V(n.budget?.total ?? 0, n.budget?.currency)} · balanced`;
}
function ot(n, e) {
  return n.cards.filter((t) => Yn(n, e, t.id) === null).map((t) => t.id);
}
function Nt(n, e, t, s) {
  for (let a = e; a > 11; a--) {
    const o = Math.max(1, Math.floor(t / (a * 0.55)));
    if (n.split(`
`).reduce((i, u) => i + Math.max(1, Math.ceil(u.length / o)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function wn(n, e, t, s) {
  const a = s.textColor ?? "#18302d", o = s.borderColor ?? "#667872", r = s.fontSize ?? 14;
  return n.map((i) => {
    const u = i.name.startsWith("handle-"), l = i.text ?? "";
    return { options: {
      id: i.name,
      text: l,
      name: e.cards.find((p) => "card-" + p.id === i.name)?.label ?? l,
      xPos: t.x + i.x,
      yPos: t.y + i.y,
      width: i.width,
      height: i.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${i.width} V ${i.height} H 0 Z`,
      backgroundColor: u ? "transparent" : i.fill ?? s.backgroundColor ?? "#fffdf6",
      foregroundColor: i.ink ?? a,
      borderColor: i.line ?? o,
      borderWidth: u ? 0 : i.lineWidth ?? 1,
      ...s.fontFamily ? { fontFamily: s.fontFamily } : {},
      fontSize: Nt(l, i.fontSize ?? r, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function rt(n, e) {
  const t = e.slice(7);
  if (t === "launch") return `Launch day, day ${n.launch?.day}. Left and Right move it.`;
  const s = n.cards.find((o) => o.id === t);
  if (s) return `${s.label} length, ${s.duration} days. Left and Right change it.`;
  const a = n.lanes.findIndex((o) => o.id === t);
  return a >= 0 && n.lanes[a + 1] ? `Divider between ${n.lanes[a].label} and ${n.lanes[a + 1].label}. Left and Right move money.` : null;
}
const lt = "#c2410c", Ht = 32, Kt = 44, On = (n) => n ? 0 : 22;
function j(n, e = {}) {
  const t = !!e.narrow, s = n.kind === "hiring-plan", a = mn(n), o = s ? n.hiring.weeks * 7 : Xn(n) ? n.launch.day : Math.ceil(n.launch.day * 4 / 3), r = kt(n), i = [], u = /* @__PURE__ */ new Map(), l = t ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), p = t ? 8 : 168, c = t ? (l - 88) / o : (l - p - 40) / o, y = (f) => en[n.lanes.findIndex((g) => g.id === f) % en.length], m = (f, g) => {
    const v = n.cards.find((_) => _.id === f), z = a.get(f), w = { x: p + z.from * c, y: g, width: (z.to - z.from) * c, height: t ? Kt : Ht };
    u.set(f, w);
    const S = r.has(f);
    i.push({
      name: "card-" + f,
      ...w,
      text: t ? "" : s ? v.label : `${v.label} · ${v.duration}d`,
      fill: S ? "#fde3d7" : t ? y(v.laneId) : s ? L(y(v.laneId), 0.45) : "#fffdf6",
      line: S || z.critical && !s ? lt : "#667872",
      lineWidth: S || z.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), s && t || i.push({ name: "handle-" + f, x: w.x + w.width - On(t), y: w.y + w.height / 2 - 22, width: 44, height: 44 });
  };
  let d, h, k;
  if (t) {
    const f = (l - 16 - 8 * (n.lanes.length - 1)) / n.lanes.length;
    n.lanes.forEach((g, v) => {
      const z = 8 + v * (f + 8);
      i.push({ name: "column-" + g.id, x: z, y: 30, width: f, height: 72, fill: L(y(g.id), 0.6), line: L(y(g.id), 0.1) }), i.push({ name: "lane-" + g.id, x: z + 4, y: 34, width: f - 8, height: 28, text: g.label, fill: y(g.id), fontSize: 14 }), i.push({ name: "caption-" + g.id, x: z + 4, y: 64, width: f - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), k = 124, h = 130, d = 138;
    for (const g of n.cards)
      m(g.id, d + 20), d += 64;
  } else {
    k = 48, h = 56, d = h;
    for (const f of n.lanes) {
      const g = n.cards.filter((z) => z.laneId === f.id), v = Math.max(92, g.length * 44 + 20);
      i.push({ name: "column-" + f.id, x: 0, y: d, width: l, height: v, fill: L(y(f.id), 0.65), line: L(y(f.id), 0.1) }), i.push({ name: "lane-" + f.id, x: 8, y: d + 8, width: p - 24, height: 32, text: f.label, fill: y(f.id), fontSize: 15 }), i.push({ name: "caption-" + f.id, x: 8, y: d + 44, width: p - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), g.forEach((z, w) => m(z.id, d + 10 + w * 44)), d += v + 4;
    }
  }
  return s ? n.hiring.funding && !t && i.push({ name: "handle-funding", x: p + n.hiring.funding.day * c - 22, y: 4, width: 44, height: 44 }) : i.push({ name: "handle-launch", x: p + n.launch.day * c - 22, y: t ? 104 : 4, width: 44, height: 44 }), { parts: i, width: l, height: d + 8, narrow: t, x0: p, dayW: c, gridTop: h, axisY: k, bars: u };
}
function qt(n, e, t) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = t(s.name.slice(8)));
  return e;
}
function Vt(n, e) {
  const t = n.x + n.width, s = Math.max(n.x + 4, t - 10), o = e.y + e.height / 2 > n.y + n.height / 2 ? n.y + n.height : n.y, r = e.y + e.height / 2;
  return { d: `M ${s} ${o} V ${r} H ${e.x}`, arrow: { x: e.x, y: r, angle: 0 } };
}
function Ut(n, e) {
  const t = j(n, e.layout), s = n.kind === "hiring-plan", a = mn(n), o = Math.round((t.width - (t.narrow ? 88 : t.x0 + 40)) / t.dayW), r = Zn(n), i = [];
  if (r?.workdays)
    for (let c = 0; c < o; c++) Rn(r.origin, c) === 6 && i.push({ t: "rect", x: t.x0 + c * t.dayW, y: t.gridTop, w: 2 * t.dayW, h: t.height - 8 - t.gridTop, color: I.track, opacity: 0.7 });
  for (const c of n.behaviour?.rules ?? []) if (r && c.on && c.kind === "blackout") {
    const y = Tn(r.origin, c.start), m = Tn(r.origin, c.end) + 1, d = t.x0 + Math.max(0, y) * t.dayW, h = (Math.min(o, m) - Math.max(0, y)) * t.dayW;
    if (h <= 0) continue;
    i.push({ t: "rect", x: d, y: t.gridTop, w: h, h: t.height - 8 - t.gridTop, color: I.refuse, opacity: 0.12 });
    for (let k = d; k < d + h; k += 10) i.push({ t: "line", x1: k, y1: t.gridTop, x2: Math.min(d + h, k + 10), y2: t.gridTop + 10, color: I.refuse, width: 0.6 });
    i.push({ t: "text", x: d + 3, y: t.gridTop + 22, text: c.label + " · " + Q(c.start) + "–" + Q(c.end), color: I.refuse, size: 11, bold: !0 });
  }
  for (let c = 0; c <= o; c++) {
    const y = t.x0 + c * t.dayW, m = r ? Rn(r.origin, c) === 1 : c % 7 === 0;
    if (!m && t.dayW < 6) continue;
    i.push({ t: "line", x1: y, y1: t.gridTop, x2: y, y2: t.height - 8, color: m ? I.week : I.faint, width: m ? 1 : 0.5 });
    const d = s && r && sn(r.origin, c).slice(8) <= "07" && m, h = r ? s ? d ? Q(sn(r.origin, c)).replace(/^\d+ /, "") : "" : Q(sn(r.origin, c)) : (t.narrow ? "W" : "Week ") + (c / 7 + 1);
    m && h && (!r || s || t.dayW * 7 > 44) && i.push({ t: "text", x: y + 3, y: t.axisY, text: h, color: I.ink, size: 12 });
  }
  for (const c of n.cards) {
    for (const d of c.dependsOn ?? []) {
      const h = t.bars.get(d), k = t.bars.get(c.id);
      if (!h || !k) continue;
      const f = a.get(d).critical && a.get(c.id).critical, g = n.cards.find((v) => v.id === d).label;
      i.push({
        t: "path",
        ...Vt(h, k),
        color: f ? lt : I.ink,
        width: f ? 2 : 1.5,
        unlink: { cardId: c.id, waitsOn: d, label: `Remove the link: ${c.label} waits on ${g}` }
      });
    }
    const y = a.get(c.id), m = t.bars.get(c.id);
    if (s) {
      const d = n.hiring.bands.find((f) => f.id === c.band), h = m.x + m.width, k = t.x0 + o * t.dayW;
      k > h && i.push({ t: "rect", x: h, y: m.y + m.height / 2 - 3, w: k - h, h: 6, rx: 3, color: I.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: t.narrow ? 8 : Math.min(h + 6, k - 120),
        y: t.narrow ? m.y - 6 : m.y + m.height / 2 - 6,
        text: (t.narrow ? c.label + " · " : "") + "starts " + Q(sn(r.origin, St(n, c.id))) + (d ? " · " + V(d.monthly, n.hiring.currency) + "/mo" : ""),
        color: I.ink,
        size: 12,
        role: "start-" + c.id
      });
      continue;
    }
    t.narrow && i.push({ t: "text", x: 8, y: m.y - 6, text: `${c.label} · ${c.duration}d`, color: I.ink, size: 13, bold: y.critical }), y.critical || i.push({ t: "text", x: m.x + m.width + (t.narrow ? 48 : 24), y: m.y + m.height / 2 + 4, text: "+" + y.slack + "d", color: I.ink, size: 12, role: "slack-" + c.id });
  }
  if (s) {
    const c = It(n), y = n.behaviour?.rules.find((h) => h.on && h.kind === "deadline"), m = y && y.kind === "deadline" && c < y.floor;
    i.push({
      t: "text",
      x: t.narrow ? 8 : t.x0,
      y: t.narrow ? 18 : 20,
      text: "Runway with these hires: " + _t(c),
      color: m || e.refused ? I.refuse : I.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const d = n.hiring.funding;
    if (d && d.day <= o) {
      const h = t.x0 + d.day * t.dayW;
      i.push({ t: "line", x1: h, y1: 26, x2: h, y2: t.height - 8, color: I.accept, width: 2, dash: "6 4" }), t.narrow || i.push({ t: "rect", x: h - 4, y: 26, w: 8, h: 18, rx: 4, color: I.accept }), i.push({ t: "text", x: Math.max(h + 8, t.narrow ? 8 : t.x0 + 330), y: t.narrow ? 40 : 20, text: "Round +" + V(d.amount, n.hiring.currency) + " · " + Q(sn(r.origin, d.day)), color: I.accept, size: 12, bold: !0 });
    }
    if (t.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: I.ink, size: 12 }), e.clamp) {
      const h = t.parts.find((k) => k.name === e.clamp.name);
      h && i.push(...qn(t, i, e.clamp.text, h, e.view));
    }
    return i;
  }
  const u = t.x0 + n.launch.day * t.dayW;
  i.push({ t: "line", x1: u, y1: t.narrow ? 112 : 26, x2: u, y2: t.height - 8, color: I.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: u - 4, y: t.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: I.launch });
  for (const c of n.cards) {
    const y = t.bars.get(c.id);
    i.push({ t: "rect", x: y.x + y.width + (t.narrow ? 4 : -5), y: y.y + 4, w: t.narrow ? 6 : 4, h: y.height - 8, rx: 2, color: I.ink, opacity: 0.55 });
  }
  const l = xn(n), p = Math.max(0, ...[...a.values()].map((c) => c.to));
  if (i.push({
    t: "text",
    x: t.narrow ? 8 : t.x0,
    y: t.narrow ? 18 : 20,
    text: r ? "Done " + Pn(n, Math.ceil(p) - 1) + " · " + nt(n) + " " + Pn(n, n.launch.day) : `Done day ${l} · launch day ${n.launch.day}`,
    color: e.refused ? I.refuse : I.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), e.clamp) {
    const c = t.parts.find((y) => y.name === e.clamp.name);
    c && i.push(...qn(t, i, e.clamp.text, c, e.view));
  }
  return i;
}
const dn = 13, Kn = 16, ct = (n, e) => n * (e ? 0.64 : 0.6), Jt = (n, e) => n.x + n.w <= e.x || e.x + e.w <= n.x || n.y + n.h <= e.y || e.y + e.h <= n.y;
function jt(n) {
  const e = n.size ?? 13, t = n.text.length * ct(e, n.bold);
  return { x: n.anchor === "end" ? n.x - t : n.anchor === "middle" ? n.x - t / 2 : n.x, y: n.y - e, w: t, h: e * 1.3 };
}
function Gt(n, e) {
  const t = [];
  for (const s of n.split(/\s+/).filter(Boolean)) {
    const a = t.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? t[t.length - 1] = a + " " + s : t.push(s);
  }
  return t;
}
let Mn = null;
function qn(n, e, t, s, a) {
  const o = [...n.bars.values()].map((f) => ({ x: f.x - 4, y: f.y - 3, w: f.width + 8, h: f.height + 6 }));
  for (const f of e)
    f.t === "text" ? o.push(jt(f)) : f.t === "rect" && o.push({ x: f.x - 2, y: f.y - 2, w: f.w + 4, h: f.h + 4 });
  let r = n.narrow ? 6 : n.x0 + 2, i = n.width - 4, u = n.gridTop + 2, l = n.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(r, a.x + 8) >= 160 && (r = Math.max(r, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(l, a.y + a.height - 8) - Math.max(u, a.y + 8) >= 40 && (u = Math.max(u, a.y + 8), l = Math.min(l, a.y + a.height - 8)));
  const p = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, c = JSON.stringify([t, p, r, i, u, l, o.map((f) => [f.x, f.y, f.w, f.h].map(Math.round))]);
  if (Mn?.key === c) return Mn.shapes;
  const y = ct(dn, !0), m = Math.floor((i - r) / y), d = /* @__PURE__ */ new Map();
  for (const f of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const g = Gt(t, Math.max(8, Math.floor(m * f)));
    g.length <= 4 && d.set(g.join(`
`), g);
  }
  let h = null;
  for (const f of d.values()) {
    const g = Math.max(...f.map((z) => z.length)) * y, v = f.length * Kn + 2;
    if (!(g > i - r))
      for (let z = u; z + v <= l; z += 3)
        for (let w = r; w + g <= i; w += 6) {
          const S = { x: w, y: z, w: g, h: v }, _ = Math.max(S.x - p.x, 0, p.x - (S.x + S.w)), E = Math.max(S.y - p.y, 0, p.y - (S.y + S.h)), O = Math.hypot(_, E) + (f.length - 1) * 24;
          h && O >= h.score || o.every(($) => Jt(S, $)) && (h = { box: S, lines: f, score: O });
        }
  }
  const k = h ? [{ t: "text", x: h.box.x, y: h.box.y + dn - 1, text: t, lines: h.lines, lineHeight: Kn, color: I.refuse, size: dn, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(s.x + 40, n.width - 4),
    y: s.y + 14,
    text: t,
    color: I.refuse,
    size: dn,
    anchor: s.x + 40 > n.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return Mn = { key: c, shapes: k }, k;
}
const G = (n, e = 1, t) => {
  const s = (o, r) => Math.round(o / r) * r, a = { ...n, cards: n.cards.map((o) => {
    const r = o.id === t ? e : 1, i = { ...o, duration: Math.max(r, s(o.duration, r)), lag: Math.max(0, s(o.lag ?? 0, r)) };
    return i.lag || delete i.lag, i;
  }) };
  return n.launch && (a.launch = { ...n.launch, day: Math.round(n.launch.day) }), n.hiring?.funding && (a.hiring = { ...n.hiring, funding: { ...n.hiring.funding, day: Math.round(n.hiring.funding.day) } }), a;
}, vn = (n) => !!n.behaviour || n.kind === "hiring-plan";
function Yt(n, e, t) {
  if (t !== "l" && t !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && n.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const o = (i) => n.cards.find((u) => u.id === i)?.label ?? i, r = [
    ...ot(n, a.id).map((i) => ({
      said: `${a.label} waits on ${o(i)}`,
      edits: [{ kind: "link_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    })),
    ...(a.dependsOn ?? []).map((i) => ({
      said: `${a.label} stops waiting on ${o(i)}`,
      edits: [{ kind: "unlink_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    }))
  ];
  return r.length ? r : `${a.label} has no task it can wait on.`;
}
function Zt(n, e, { key: t, shiftKey: s }) {
  if (t !== "ArrowLeft" && t !== "ArrowRight") return null;
  const a = (t === "ArrowLeft" ? -1 : 1) * yn(n);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: n.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: n.hiring.funding.day + Math.sign(a) * 7 }];
  const o = /^(card|handle)-(.+)$/.exec(e), r = o && n.cards.find((i) => i.id === o[2]);
  return r ? s || o[1] === "handle" ? [{ kind: "set_task", card: { id: r.id }, duration: r.duration + a }] : [{ kind: "set_task", card: { id: r.id }, lag: (r.lag ?? 0) + a }] : null;
}
const An = {
  laneCues: !1,
  notes(n, e, t, s) {
    return wn(An.places(n, e).parts, n, t, s);
  },
  editsBetween: Ln,
  label: rt,
  places(n, e) {
    const t = qt(n, j(n, e), (s) => {
      const a = n.cards.filter((r) => r.laneId === s), o = mn(n);
      return n.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((r) => o.get(r.id).critical).length} on the critical path`;
    });
    return { parts: t.parts, width: t.width, height: t.height };
  },
  layer: (n) => gn(n, Ut),
  chooser(n, e, t, s = {}) {
    const a = n.cards.findIndex((o) => o.id === e);
    return a < 0 ? null : n.kind === "hiring-plan" && s.narrow ? () => n : (vn(n) ? Qt : ne)(n, e, a, ot(n, e), t, s);
  },
  refusalAt(n, e, t, s, a) {
    const o = j(n, a);
    for (const l of n.cards) {
      if (l.id === e || !T(o.bars.get(l.id), s)) continue;
      const p = Yn(n, e, l.id);
      return p ? { laneId: l.laneId, reason: p } : null;
    }
    const r = n.cards.find((l) => l.id === e), i = (r.lag ?? 0) + Math.round((s.x - t.x - o.bars.get(e).x) / o.dayW);
    if (vn(n)) {
      const l = mn(n).get(e), p = Math.round(l.from + (s.x - t.x - o.bars.get(e).x) / o.dayW), c = (r.lag ?? 0) + wt(Zn(n)).idx(p) - l.start, y = yn(n), m = Qn(n, e, { lag: Math.max(0, Math.round(c / y) * y) });
      return typeof m == "string" ? { laneId: r.laneId, reason: m, lands: !0 } : null;
    }
    const u = fn(n, { cardId: e, field: "lag" });
    return i > u.max ? { laneId: r.laneId, reason: pn(U(n, { cardId: e, field: "lag" }, i), e) ?? u.reasons.max } : null;
  },
  handleDrag(n, e, t, s) {
    const a = j(n, s), o = (m) => Y(j(m, s).parts);
    if (n.kind === "hiring-plan" && s.narrow) return null;
    if (vn(n)) return Xt(n, e, t, s, a, o);
    if (e === "handle-launch") {
      const m = fn(n, { field: "day" }), d = F(n, e, t, o, (h, k) => h.vary(k, on("launch", "day"), { constraint: (f) => [rn(f.launch.day, xn(f) - 1e-3), ln(f.launch.day, 120)] }).onDrop((f) => G(f)));
      return (h) => {
        const k = Math.round((h.x - t.x + 22 - a.x0) / a.dayW), f = d?.(h) ?? U(n, { field: "day" }, Math.min(m.max, Math.max(m.min, k)));
        return k < m.min ? { next: f, clampedReason: m.reasons.min, refusal: pn(U(n, { field: "day" }, Math.max(5, k))) ?? void 0 } : { next: f };
      };
    }
    const r = e.slice(7), i = n.cards.findIndex((m) => m.id === r);
    if (i < 0) return null;
    const u = { cardId: r, field: "duration" }, l = fn(n, u), p = n.launch.day, c = F(n, e, t, o, (m, d) => m.vary(d, on("cards", i, "duration"), { constraint: (h) => [rn(h.cards[i].duration, 1), ln(xn(h), p + 1e-3)] }).onDrop((h) => G(h))), y = a.bars.get(r);
    return (m) => {
      const d = Math.round((m.x - t.x + On(a.narrow) - y.x) / a.dayW), h = Math.min(l.max, Math.max(l.min, d)), k = c?.(m) ?? U(n, u, h);
      return d > l.max ? { next: k, clampedReason: `Launch is day ${p}.`, refusal: pn(U(n, u, Math.min(60, d)), r) ?? l.reasons.max } : d < l.min ? { next: k, clampedReason: l.reasons.min } : { next: k };
    };
  },
  keyEdit: Zt,
  keyChoices: Yt,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on."
};
function Qt(n, e, t, s, a, o) {
  const r = yn(n), i = Mt(n), u = n.cards[t].laneId, l = (h) => {
    if (!i) return h;
    const k = vt(n, h, /* @__PURE__ */ new Set([e]));
    return typeof k == "string" ? h : k;
  }, p = (h) => l(G(h, r, e)), c = (h) => Y(j(l(h), o).parts, s.map((k) => "card-" + k)), m = (o.narrow ? [u] : n.lanes.map((h) => h.id)).flatMap((h) => bn(n, e, "lag", h === u ? void 0 : h).map((k) => ({ laneId: h, run: k })));
  if (!m.length) return () => n;
  const d = F(n, "card-" + e, a, c, (h, k) => {
    const f = h.closest(m.map(({ laneId: g, run: [v, z] }) => h.vary(
      { ...k, cards: k.cards.map((w, S) => S === t ? { ...w, laneId: g, lag: Math.min(z, Math.max(v, w.lag ?? 0)) } : w) },
      on("cards", t, "lag"),
      { constraint: (w) => [rn(w.cards[t].lag ?? 0, v - 0.49), ln(w.cards[t].lag ?? 0, z + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? h.closest(s.map((g) => h.dropTarget("target-" + g, tt(k, e, g)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(f).withBranchTransition(120).onDrop(p) : f.onDrop(p);
  });
  return d ? (h) => p(d(h)) : null;
}
function Xt(n, e, t, s, a, o) {
  const r = (f, g) => {
    const v = [];
    for (const z of f) if (g(z)) {
      const w = v.at(-1);
      w && w[1] === z - (f[1] - f[0]) ? w[1] = z : v.push([z, z]);
    }
    return v;
  }, i = (f, g, v) => Array.from({ length: Math.floor((g - f) / v) + 1 }, (z, w) => f + w * v), u = (f, g, v, z, w) => F(n, e, t, o, (S, _) => S.closest(v.map(([E, O]) => S.vary(
    _,
    on(...f),
    { constraint: ($) => [rn(g($), E - 0.49), ln(g($), O + 0.49)] }
  ))).withBranchTransition(100).onDrop((E) => G(E, z, w))), l = (f, g, v, z) => (w) => {
    const S = g(w), _ = v(S), E = f?.(w) ?? (_ ? n : z(S));
    return _ ? { next: E, clampedReason: _, refusal: _ } : { next: E };
  };
  if (e === "handle-launch" || e === "handle-funding") {
    const f = e === "handle-launch", g = (_) => f ? U(n, { field: "day" }, _) : { ...n, hiring: { ...n.hiring, funding: { ...n.hiring.funding, day: _ } } }, v = (_) => f && (_ < 5 || _ > 120) ? "Launch day is a whole day from 5 to 120." : f && Xn(n) && _ < fn(n, { field: "day" }).min ? pn(g(_)) ?? "Every task ends by " + nt(n) + "." : bt(n, g(_)), z = f ? i(5, 120, 1) : i(0, n.hiring.weeks * 7, 1), w = r(z, (_) => !v(_)), S = w.length ? u(f ? ["launch", "day"] : ["hiring", "funding", "day"], (_) => f ? _.launch.day : _.hiring.funding.day, w, 1) : null;
    return l(S, (_) => Math.round((_.x - t.x + 22 - a.x0) / a.dayW), v, g);
  }
  const p = e.slice(7), c = n.cards.findIndex((f) => f.id === p);
  if (c < 0) return null;
  const y = yn(n), m = a.bars.get(p), d = bn(n, p, "duration"), h = d.length ? u(["cards", c, "duration"], (f) => f.cards[c].duration, d, y, p) : null;
  return l(
    h,
    (f) => n.cards[c].duration + Math.round((f.x - t.x + On(a.narrow) - m.x - m.width) / a.dayW),
    (f) => {
      const g = Qn(n, p, { duration: Math.max(y, Math.round(f / y) * y) });
      return typeof g == "string" ? g : null;
    },
    (f) => U(n, { cardId: p, field: "duration" }, f)
  );
}
function bt(n, e) {
  const t = n.behaviour ? zt(n, e) : null;
  return t && "refused" in t ? t.refused.sentence : null;
}
function ne(n, e, t, s, a, o) {
  const r = n.launch.day, i = (l) => Y(j(l, o).parts, s.map((p) => "card-" + p)), u = F(n, "card-" + e, a, i, (l, p) => {
    const c = o.narrow ? p.lanes.filter((m) => m.id === p.cards[t].laneId) : p.lanes, y = l.closest(c.map((m) => l.vary(
      { ...p, cards: p.cards.map((d, h) => h === t ? { ...d, laneId: m.id, lag: d.lag ?? 0 } : d) },
      on("cards", t, "lag"),
      { constraint: (d) => [rn(d.cards[t].lag ?? 0, -1e-3), ln(xn(d), r + 1e-3)] }
    )));
    return s.length ? l.closest(s.map((m) => l.dropTarget("target-" + m, tt(p, e, m)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(y).withBranchTransition(120).onDrop((m) => G(m)) : y.onDrop((m) => G(m));
  });
  return u ? (l) => G(u(l)) : null;
}
const X = 76;
function b(n, e = {}) {
  const t = !!e.narrow, s = [], a = n.lanes.map((u) => n.cards.filter((l) => l.laneId === u.id).length), o = (u) => n.lanes[u].role === "won" ? "#bfe3cf" : n.lanes[u].role === "lost" ? "#e4dcdc" : en[u % en.length];
  let r, i;
  if (t) {
    r = Math.max(300, e.width ?? 390);
    let u = X;
    n.lanes.forEach((l, p) => {
      const c = 96 + (a[p] + 1) * 64;
      s.push({ name: "column-" + l.id, x: 2, y: u, width: r - 4, height: c, fill: L(o(p), 0.6), line: L(o(p), 0.1) });
      const y = (r - 16) * 0.36;
      s.push({ name: "lane-" + l.id, x: 8, y: u + 6, width: y, height: 36, text: l.label, fill: o(p), fontSize: 15 }), s.push({ name: "caption-" + l.id, x: 8 + y + 6, y: u + 6, width: r - 16 - y - 6, height: 56, text: Dn(n, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), n.cards.filter((m) => m.laneId === l.id).forEach((m, d) => s.push({ name: "card-" + m.id, x: 8, y: u + 72 + d * 64, width: r - 16, height: 56, text: Vn(n, m.id), fontSize: 15 })), u += c + 10;
    }), i = u;
  } else {
    const p = 116 + (Math.max(...a) + 1) * 88;
    n.lanes.forEach((c, y) => {
      const m = y * 244;
      s.push({ name: "column-" + c.id, x: m + 2, y: X, width: 240, height: p, fill: L(o(y), 0.6), line: L(o(y), 0.1) }), s.push({ name: "lane-" + c.id, x: m + 8, y: X + 6, width: 228, height: 58, text: c.label, fill: o(y), fontSize: 16 }), s.push({ name: "caption-" + c.id, x: m + 8, y: X + 66, width: 228, height: 48, text: Dn(n, c.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), n.cards.filter((d) => d.laneId === c.id).forEach((d, h) => s.push({ name: "card-" + d.id, x: m + 8, y: X + 116 + h * 88, width: 228, height: 76, text: Vn(n, d.id), fontSize: 15 }));
    }), r = n.lanes.length * 244, i = X + p;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: Bt(n), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: s, width: r, height: i };
}
function Vn(n, e) {
  const t = n.cards.find((s) => s.id === e);
  return t.amount === void 0 ? t.label + `
no amount yet` : t.label + `
` + V(t.amount, n.forecast.currency);
}
function te(n, e) {
  const { width: t } = b(n, e.layout), s = n.forecast.target, a = et(n), o = Math.max(s * 1.25, a), r = t - 8, i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: r, h: 14, rx: 7, color: I.track },
    { t: "rect", x: 4, y: 42, w: r * a / o, h: 14, rx: 7, color: i ? I.accept : I.bar },
    { t: "line", x1: 4 + r * s / o, y1: 36, x2: 4 + r * s / o, y2: 62, color: I.ink, width: 2 },
    { t: "text", x: 4 + r * s / o, y: 72, text: "Target " + V(s, n.forecast.currency), color: I.ink, size: 14, anchor: "middle" }
  ];
}
const ee = {
  laneCues: !0,
  places: (n, e) => b(n, e),
  notes: (n, e, t, s) => wn(b(n, e).parts, n, t, s),
  editsBetween: Ln,
  layer: (n) => gn(n, te),
  chooser(n, e, t, s = {}) {
    const a = jn(n, e).map((o) => Gn(n, e, o.id));
    return a.length < 2 ? null : at(F(n, "card-" + e, t, (o) => Y(b(o, s).parts), (o, r) => o.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r, { gapIn: 40, gapOut: 56 })), n, e, b(n, s).parts, a);
  },
  refusalAt(n, e, t, s, a) {
    const { parts: o } = b(n, a), r = n.cards.find((i) => i.id === e);
    for (const i of n.lanes) {
      if (i.id === r.laneId || !T(o.find((l) => l.name === "column-" + i.id), s)) continue;
      const u = At(n, e, i.id);
      return u ? { laneId: i.id, reason: u } : null;
    }
    return null;
  },
  handleDrag: () => null
}, B = 48, an = 960, dt = 900;
function H(n, e = {}) {
  const t = !!e.narrow, s = n.budget.total, a = [], o = [], r = n.lanes.map((l) => n.cards.filter((p) => p.laneId === l.id).length);
  let i, u;
  if (t) {
    i = Math.max(300, e.width ?? 390);
    let l = B;
    n.lanes.forEach((p, c) => {
      const y = Math.max(100 + (r[c] + 1) * 64, p.allocation / s * dt);
      o.push({ laneId: p.id, start: l, size: y }), l += y;
    }), u = l + 8;
  } else {
    i = an;
    let l = 0;
    for (const p of n.lanes)
      o.push({ laneId: p.id, start: l, size: p.allocation / s * an }), l += p.allocation / s * an;
    u = B + 100 + (Math.max(...r) + 1) * 64;
  }
  return n.lanes.forEach((l, p) => {
    const { start: c, size: y } = o[p], m = en[p % en.length], d = t ? { x: 2, y: c + 1, width: i - 4, height: y - 2 } : { x: c + 1, y: B, width: Math.max(4, y - 2), height: u - B }, h = { x: d.x + 5, y: d.y, width: Math.max(10, d.width - 10) };
    a.push({ name: "column-" + l.id, ...d, fill: L(m, 0.6), line: L(m, 0.1) });
    const k = t ? h.width * 0.36 : h.width;
    if (a.push({ name: "lane-" + l.id, x: h.x, y: h.y + 6, width: k, height: 32, text: l.label, fill: m, fontSize: 15 }), a.push({
      name: "caption-" + l.id,
      x: t ? h.x + k + 6 : h.x,
      y: h.y + (t ? 6 : 40),
      width: t ? h.width - k - 6 : h.width,
      height: t ? 50 : 40,
      text: t ? Bn(n, l.id).replace(" · ", `
`) : Bn(n, l.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: t ? 15 : 12
    }), n.cards.filter((f) => f.laneId === l.id).forEach((f, g) => a.push({
      name: "card-" + f.id,
      x: h.x,
      y: h.y + 100 + g * 64,
      width: h.width,
      height: 56,
      text: f.label + `
` + V(f.amount, n.budget.currency),
      fontSize: 14
    })), p < n.lanes.length - 1) {
      const f = c + y;
      a.push(t ? { name: "handle-" + l.id, x: i - 96, y: f - 22, width: 88, height: 44 } : { name: "handle-" + l.id, x: f - 22, y: B - 6, width: 44, height: 48 });
    }
  }), { parts: a, width: i, height: u, segments: o, narrow: t };
}
function ie(n, e) {
  const t = H(n, e.layout), s = n.budget.total, a = [{ t: "text", x: 4, y: 28, text: Ft(n), color: I.ink, size: 16, bold: !0, role: "header" }];
  if (n.lanes.forEach((o, r) => {
    const i = t.segments[r], u = o.allocation, l = Ot(n, o.id);
    if (t.narrow) {
      const p = i.start + 50, c = 8, y = t.width - 16;
      a.push({ t: "rect", x: c, y: p, w: y, h: 10, rx: 5, color: I.track }), a.push({ t: "rect", x: c, y: p, w: y * l / u || 0, h: 10, rx: 5, color: I.bar }), o.floor !== void 0 && a.push({ t: "line", x1: c + y * o.floor / u, y1: p - 4, x2: c + y * o.floor / u, y2: p + 14, color: I.ink, width: 2 });
    } else {
      const p = an / s, c = B + 86;
      a.push({ t: "rect", x: i.start + 6, y: c, w: i.size - 12, h: 10, rx: 5, color: I.track }), a.push({ t: "rect", x: i.start + 6, y: c, w: Math.max(0, (i.size - 12) * l / u || 0), h: 10, rx: 5, color: I.bar }), o.floor !== void 0 && a.push({ t: "line", x1: i.start + o.floor * p, y1: c - 6, x2: i.start + o.floor * p, y2: c + 16, color: I.ink, width: 2 }), o.cap !== void 0 && i.start + o.cap * p <= t.width && a.push({ t: "line", x1: i.start + o.cap * p, y1: c - 6, x2: i.start + o.cap * p, y2: c + 16, color: I.refuse, width: 2, dash: "3 2" });
    }
    if (r < n.lanes.length - 1) {
      const p = i.start + i.size;
      a.push(t.narrow ? { t: "line", x1: 2, y1: p, x2: t.width - 2, y2: p, color: I.ink, width: 2 } : { t: "line", x1: p, y1: B, x2: p, y2: t.height, color: I.ink, width: 2 }), a.push(t.narrow ? { t: "rect", x: t.width - 68, y: p - 4, w: 32, h: 8, rx: 4, color: I.ink } : { t: "rect", x: p - 4, y: B + 2, w: 8, h: 30, rx: 4, color: I.ink });
    }
  }), e.clamp) {
    const o = t.parts.find((r) => r.name === e.clamp.name);
    o && a.push({
      t: "text",
      x: t.narrow ? 8 : Math.min(Math.max(o.x + 22, 120), t.width - 120),
      y: t.narrow ? o.y + 8 : B - 12,
      text: e.clamp.text,
      color: I.refuse,
      size: 13,
      bold: !0,
      anchor: t.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return a;
}
const se = (n, e) => Math.round(n / e) * e, ae = {
  laneCues: !0,
  notes: (n, e, t, s) => wn(H(n, e).parts, n, t, s),
  editsBetween: Ln,
  label: rt,
  places(n, e) {
    const { parts: t, width: s, height: a } = H(n, e);
    return { parts: t, width: s, height: a };
  },
  layer: (n) => gn(n, ie),
  chooser(n, e, t, s = {}) {
    const a = jn(n, e).map((o) => Gn(n, e, o.id));
    return a.length < 2 ? null : at(F(n, "card-" + e, t, (o) => Y(H(o, s).parts), (o, r) => o.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r)), n, e, H(n, s).parts, a);
  },
  refusalAt(n, e, t, s, a) {
    const { parts: o } = H(n, a), r = n.cards.find((i) => i.id === e);
    for (const i of n.lanes) {
      if (i.id === r.laneId || !T(o.find((l) => l.name === "column-" + i.id), s)) continue;
      const u = Lt(n, e, i.id);
      return u ? { laneId: i.id, reason: u } : null;
    }
    return null;
  },
  handleDrag(n, e, t, s) {
    const a = e.slice(7), o = n.lanes.findIndex((d) => d.id === a), r = n.lanes[o + 1];
    if (o < 0 || !r) return null;
    const i = Et(n, { laneId: a }), u = n.budget.step, l = (d) => {
      const h = Math.min(i.max, Math.max(i.min, se(d, u)));
      return Fn(n, r.id, a, h);
    }, p = H(n, s), c = p.narrow ? dt / n.budget.total : an / n.budget.total, y = p.parts.find((d) => d.name === e), m = F(n, e, t, (d) => Y(H(d, s).parts), (d) => d.varyFunc([0], ([h]) => Fn(n, r.id, a, h), { constraint: (h) => [
      ...gt([i.min, h.lanes[o].allocation - n.lanes[o].allocation, i.max])
    ] }));
    return (d) => {
      const k = (p.narrow ? d.y - t.y - y.y : d.x - t.x - y.x) / c, f = m?.(d), g = f ? f.lanes[o].allocation - n.lanes[o].allocation : k, v = { next: l(g) };
      return k > i.max + u / 2 ? { ...v, clampedReason: i.reasons.max } : k < i.min - u / 2 ? { ...v, clampedReason: i.reasons.min } : v;
    };
  },
  keyEdit(n, e, { key: t }) {
    if (t !== "ArrowLeft" && t !== "ArrowRight" && t !== "ArrowUp" && t !== "ArrowDown") return null;
    const s = /^handle-(.+)$/.exec(e)?.[1], a = n.lanes.findIndex((l) => l.id === s), o = n.lanes[a + 1];
    if (a < 0 || !o) return null;
    const r = t === "ArrowRight" || t === "ArrowDown", i = n.budget.step;
    return [r ? { kind: "shift_budget", from: { id: o.id }, to: { id: s }, amount: i } : { kind: "shift_budget", from: { id: s }, to: { id: o.id }, amount: i }];
  }
}, oe = {
  pile: "#fbdfac",
  theme: "#efd7dc",
  outcome: "#d5e9e3",
  opportunity: "#dedef4",
  problem: "#efd7dc",
  cause: "#fbdfac",
  action: "#dcebf3",
  objective: "#d5e9e3",
  "key result": "#dedef4",
  initiative: "#dcebf3",
  manager: "#d5e9e3",
  "open role": "#f3eee0",
  designer: "#efd7dc"
}, re = (n) => oe[n.role ?? ""] ?? "#fffdf6", P = 64, hn = 8, K = 220, q = 84, Un = { "do-now": "#d5e9e3", plan: "#dedef4", later: "#f3eee0", skip: "#efd7dc" }, J = (n, e) => n.nest?.layout === "matrix" ? "matrix" : e.narrow ? "outline" : n.nest?.layout ?? "clusters", ht = (n, e) => !e.narrow && !!n.nest?.owners?.length && n.nest?.layout === "tree";
function ut(n) {
  const e = !!n.narrow, t = e ? Math.max(260, Math.min(358, (n.width ?? 358) - 16)) : 560;
  return { narrow: e, size: t, left: e ? 8 : K + 16, top: e ? 56 : q + 26, w: e ? 92 : 136, h: e ? 34 : 44 };
}
function le(n, e, t, s = 0) {
  const a = n.left + e / 10 * n.size, o = n.top + (10 - t) / 10 * n.size;
  return { x: Math.min(n.left + n.size - n.w, Math.max(n.left, a - n.w / 2 + s)), y: Math.min(n.top + n.size - n.h, Math.max(n.top, o - n.h / 2 + s)) };
}
function ce(n, e) {
  const t = (s) => Math.max(0, Math.min(10, Math.round(s)));
  return { x: t((e.x + n.w / 2 - n.left) / n.size * 10), y: t(10 - (e.y + n.h / 2 - n.top) / n.size * 10) };
}
function zn(n, e) {
  const t = [], s = (a, o) => {
    t.push({ card: a, depth: o });
    for (const r of W(n, a.id)) s(r, o + 1);
  };
  for (const a of it(n, e)) s(a, 0);
  return t;
}
const Jn = Rt;
function D(n, e = {}) {
  const t = J(n, e), { main: s, tray: a } = R(n), o = [], r = (d, h, k, f, g) => {
    o.push({ name: "lane-" + d, x: h, y: k, width: f, height: 40, text: n.lanes.find((v) => v.id === d).label, fill: d === a ? "#e9e5da" : "#d5e9e3", fontSize: 16 }), o.push({ name: "caption-" + d, x: h, y: k + 44, width: f, height: 26, text: g, fill: "transparent", lineWidth: 0, fontSize: 14 });
  }, i = (d) => Tt.caption(n, d), u = (d, h, k, f, g = P) => o.push({ name: "card-" + d.id, x: h, y: k, width: f, height: g, text: Jn(n, d), fill: re(d), fontSize: 14 });
  if (t === "matrix") {
    const d = ut(e), h = st(n), k = (w) => (n.behaviour?.rules ?? []).find((S) => S.on && S.kind === "quadrant" && S.quadrant === w);
    for (const w of Pt) {
      const S = d.left + (w.high[0] ? d.size / 2 : 0), _ = d.top + (w.high[1] ? 0 : d.size / 2), E = n.cards.filter(($) => Dt(n, $) === w.id).length, O = k(w.id);
      o.push({ name: "column-q-" + w.id, x: S, y: _, width: d.size / 2, height: d.size / 2, fill: L(Un[w.id], 0.35), line: L(Un[w.id], 0.1) }), o.push({
        name: "caption-q-" + w.id,
        x: S + 6,
        y: _ + (w.high[1] ? 6 : d.size / 2 - 32),
        width: d.size / 2 - 12,
        height: 26,
        fill: "transparent",
        lineWidth: 0,
        fontSize: d.narrow ? 12 : 14,
        text: w.label + " · " + (O ? E + " of " + O.max : String(E)),
        ...O && E > O.max && { ink: "#c2410c" }
      });
    }
    o.push({ name: "caption-axis-y", x: d.left, y: d.top - 26, width: 200, height: 22, text: "↑ " + h.y.label, fill: "transparent", lineWidth: 0, fontSize: 13 }), o.push({ name: "caption-axis-x", x: d.left + d.size - 200, y: d.top + d.size + 4, width: 200, height: 22, text: h.x.label + " →", fill: "transparent", lineWidth: 0, fontSize: 13 });
    const f = /* @__PURE__ */ new Map();
    for (const w of n.cards) {
      const S = tn(n, w);
      if (!S) continue;
      const _ = S.x + ":" + S.y, E = (f.get(_) ?? 0) * 8;
      f.set(_, (f.get(_) ?? 0) + 1);
      const O = le(d, S.x, S.y, E);
      o.push({ name: "card-" + w.id, x: O.x, y: O.y, width: d.w, height: d.h, text: Jn(n, w), fill: "#fffdf6", fontSize: d.narrow ? 11 : 13 });
    }
    const g = zn(n, a);
    let v, z;
    if (d.narrow) {
      let w = d.top + d.size + 34;
      r(a, 8, w, d.size, i(a)), w += 76, g.forEach(({ card: S }) => {
        u(S, 8, w, d.size, 40), w += 46;
      }), v = d.size + 16, z = w + 10, o.unshift({ name: "column-" + a, x: 2, y: d.top + d.size + 30, width: v - 4, height: z - d.top - d.size - 30, fill: L("#e9e5da", 0.5), line: L("#e9e5da", 0.1) });
    } else
      r(a, 8, 6, K - 16, i(a)), g.forEach(({ card: w }, S) => u(w, 8, q + S * (P + hn), K - 16)), v = d.left + d.size + 16, z = Math.max(q + Math.max(1, g.length + 1) * (P + hn), d.top + d.size + 34), o.unshift({ name: "column-" + a, x: 2, y: 0, width: K - 4, height: z, fill: L("#e9e5da", 0.5), line: L("#e9e5da", 0.1) });
    return r(s, d.left, d.narrow ? 0 : 6, d.narrow ? d.size : Math.min(d.size, 640), i(s)), o.splice(o.findIndex((w) => w.name === "caption-" + s), 1), o.unshift({ name: "column-" + s, x: d.left - 6, y: (d.narrow, 0), width: d.size + 12, height: d.top + d.size + 30, fill: L("#d5e9e3", 0.75), line: L("#d5e9e3", 0.1) }), { parts: o, width: v, height: z };
  }
  if (t === "outline") {
    const d = Math.max(300, e.width ?? 358);
    let h = 0;
    for (const k of [s, a]) {
      const f = h;
      r(k, 8, h + 6, d - 16, i(k)), h += 82;
      for (const { card: g, depth: v } of zn(n, k))
        u(g, 8 + 20 * v, h, d - 16 - 20 * v, 44), h += 52;
      h += 44, o.unshift({ name: "column-" + k, x: 2, y: f, width: d - 4, height: h - f, fill: L(k === a ? "#e9e5da" : "#d5e9e3", 0.6), line: L("#d5e9e3", 0.1) }), h += 10;
    }
    return { parts: o, width: d, height: h };
  }
  const l = zn(n, a);
  r(a, 8, 6, K - 16, i(a)), l.forEach(({ card: d }, h) => u(d, 8, q + h * (P + hn), K - 16));
  const p = q + Math.max(1, l.length + 1) * (P + hn), c = K + 16;
  let y, m;
  if (t === "clusters") {
    const k = it(n, s);
    let f = q, g = 0;
    k.forEach((v, z) => {
      z && z % 4 === 0 && (f += g + 16, g = 0);
      const w = c + z % 4 * 220;
      let S = f;
      const _ = (E, O) => {
        u(E, w + 12 * O, S, 208 - 12 * O, O ? P : 56), S += (O ? P : 56) + 6;
        for (const $ of W(n, E.id)) _($, O + 1);
      };
      _(v, 0), g = Math.max(g, S - f);
    }), y = c + 4 * 220 + 8, m = Math.max(p, f + g + P + 40), r(s, c, 6, Math.min(y - c - 8, 640), i(s));
  } else {
    const h = P + 44, k = ht(n, e) ? n.nest.owners : [], f = q + (k.length ? 64 : 0);
    k.forEach((w, S) => {
      const _ = n.cards.filter((E) => E.owner === w.id).length;
      o.push({ name: "caption-owner-" + w.id, x: c + S * 152, y: q - 4, width: 140, height: 52, text: w.label + `
` + _ + (_ === 1 ? " card" : " cards"), fill: "#f3eee0", fontSize: 14 });
    });
    let g = 0, v = 0;
    const z = (w, S) => {
      v = Math.max(v, S);
      const E = W(n, w.id).map(($) => z($, S + 1)), O = E.length ? (E[0] + E[E.length - 1]) / 2 : g++;
      return u(w, c + O * 192, f + S * h, 176), O;
    };
    for (const w of W(n, null, s)) z(w, 0);
    y = c + Math.max(3, g, k.length * 152 / 192) * 192 + 8, m = Math.max(p, f + (v + 1) * h + 56), r(s, c, 6, Math.min(y - c - 8, 640), i(s));
  }
  return o.unshift(
    { name: "column-" + s, x: c - 6, y: 0, width: y - c + 4, height: m, fill: L("#d5e9e3", 0.75), line: L("#d5e9e3", 0.1) },
    { name: "column-" + a, x: 2, y: 0, width: K - 4, height: m, fill: L("#e9e5da", 0.5), line: L("#e9e5da", 0.1) }
  ), { parts: o, width: y, height: m };
}
function de(n, e) {
  if (J(n, e.layout) !== "tree") return [];
  const { parts: t } = D(n, e.layout), s = new Map(t.map((a) => [a.name, a]));
  return n.cards.flatMap((a) => {
    const o = a.parentId && s.get("card-" + a.parentId), r = s.get("card-" + a.id);
    if (!o || !r) return [];
    const i = o.x + o.width / 2, u = o.y + o.height, l = r.x + r.width / 2, p = r.y, c = (u + p) / 2;
    return [{ t: "path", d: `M ${i} ${u} V ${c} H ${l} V ${p}`, color: I.week, width: 2 }];
  });
}
function un(n, e, t) {
  for (let s = n.length - 1; s >= 0; s--) {
    const a = n[s];
    if (a.name.startsWith("card-") && !t.has(a.name.slice(5)) && T(a, e)) return a.name.slice(5);
  }
  return null;
}
function En(n, e, t) {
  const s = n.cards.find((a) => a.id === t);
  return s.laneId === R(n).tray ? null : e === "tree" || !s.parentId || n.cards.some((a) => a.parentId === t) ? t : s.parentId;
}
function he(n, e, t, s, a, o) {
  const r = n.cards.find((c) => c.id === t);
  if (En(n, e, t) === t) return { laneId: r.laneId, under: t, before: null };
  const u = r.parentId ?? null, l = (u ? W(n, u) : W(n, null, r.laneId)).filter((c) => c.id !== o), p = s.y > a.y + a.height / 2;
  return { laneId: r.laneId, under: u, before: p ? l[l.findIndex((c) => c.id === t) + 1]?.id ?? null : t };
}
const ue = (n, e) => n === e || JSON.stringify(n.cards) === JSON.stringify(e.cards), fe = (n, e) => n.cards.find((t) => t.id === e.parentId)?.owner;
function pe(n, e) {
  const t = [], s = new Set((n.nest?.aliases ?? []).map(([x]) => x));
  for (const [x, M] of e.nest?.aliases ?? [])
    !s.has(x) && n.cards.some((A) => A.id === x) && !e.cards.some((A) => A.id === x) && t.push({ kind: "merge_cards", card: { id: x }, into: { id: M } });
  let a = n;
  if (t.length) {
    const x = nn(n, t);
    "refused" in x || (a = x.workshop);
  }
  const o = new Map(a.cards.map((x) => [x.id, x])), r = /* @__PURE__ */ new Set(), i = [], u = [], l = [], p = [], c = [], y = [], m = [];
  for (const x of e.cards) {
    if (o.has(x.id) || x.parentId || x.role !== "pile") continue;
    const M = e.cards.filter((A) => A.parentId === x.id);
    M.length !== 1 || !o.has(M[0].id) || (i.push({ kind: "start_pile", card: { id: M[0].id }, ...x.label !== "New pile" && { label: x.label } }), r.add(x.id).add(M[0].id));
  }
  for (const x of a.cards) e.cards.some((M) => M.id === x.id) || u.push({ kind: "remove_card", card: { id: x.id } });
  for (const x of e.nest?.fields ?? [])
    (a.nest?.fields ?? []).some((M) => M.id === x.id) || l.push({ kind: "add_field", label: x.label, ...x.currency && { currency: x.currency }, ...x.flag && { flag: !0 } });
  for (const x of e.nest?.fields ?? []) {
    const M = (a.nest?.fields ?? []).find((A) => A.id === x.id);
    M && M.label !== x.label && l.push({ kind: "rename_field", field: x.id, label: x.label });
  }
  for (const x of e.nest?.owners ?? []) (a.nest?.owners ?? []).some((M) => M.id === x.id) || l.push({ kind: "add_owner", label: x.label });
  e.nest && a.nest?.layout !== e.nest.layout && l.push({ kind: "set_layout", layout: e.nest.layout });
  const d = st(e), h = new Set(d ? e.cards.filter((x) => {
    const M = o.get(x.id), A = tn(e, x);
    if (!M || !A) return !1;
    const C = tn(a, M);
    return !C || C.x !== A.x || C.y !== A.y;
  }).map((x) => x.id) : []), k = [...h].map((x) => {
    const M = tn(e, e.cards.find((A) => A.id === x));
    return { kind: "score_card", card: { id: x }, x: M.x, y: M.y };
  }), f = e.cards.filter((x) => !o.has(x.id) && !r.has(x.id)), g = /* @__PURE__ */ new Set();
  for (; g.size < f.length; ) {
    const x = f.filter((M) => !g.has(M.id) && (!M.parentId || !f.some((A) => A.id === M.parentId) || g.has(M.parentId)));
    if (!x.length) break;
    for (const M of x)
      g.add(M.id), p.push({
        kind: "add_card",
        lane: { id: M.laneId },
        label: M.label,
        ...M.parentId && { under: { id: M.parentId } },
        ...M.role && { role: M.role },
        ...M.source && { source: M.source }
      });
  }
  const v = (x) => {
    let M = 0;
    for (let A = e.cards.find((C) => C.id === x); A?.parentId && M < 12; A = e.cards.find((C) => C.id === A.parentId)) M++;
    return M;
  }, z = (x, M) => (M.parentId ? W(x, M.parentId) : W(x, null, M.laneId)).map((A) => A.id), w = e.cards.filter((x) => {
    const M = o.get(x.id);
    if (!M || r.has(x.id) || h.has(x.id)) return !1;
    if (M.parentId !== x.parentId || M.laneId !== x.laneId && !x.parentId) return !0;
    const A = z(e, x).filter((Z) => o.has(Z)), C = z(a, M).filter((Z) => A.includes(Z));
    return A[A.indexOf(x.id) - 1] !== C[C.indexOf(x.id) - 1];
  }), S = new Map(w.map((x) => [x.id, z(e, x).indexOf(x.id)]));
  w.sort((x, M) => v(x.id) - v(M.id) || (x.parentId ?? x.laneId).localeCompare(M.parentId ?? M.laneId) || S.get(M.id) - S.get(x.id));
  for (const x of w) {
    const M = z(e, x), A = M[M.indexOf(x.id) + 1];
    c.push({ kind: "nest_card", card: { id: x.id }, ...x.parentId ? { under: { id: x.parentId } } : { lane: { id: x.laneId } }, ...A && { before: { id: A } } });
  }
  for (const x of e.cards) {
    const M = o.get(x.id);
    !M || r.has(x.id) || (M.label !== x.label && m.push({ kind: "rename_card", card: { id: x.id }, label: x.label }), x.role && M.role !== x.role && y.push({ kind: "set_role", card: { id: x.id }, role: x.role }), x.source && M.source !== x.source && m.push({ kind: "set_source", card: { id: x.id }, source: x.source }));
  }
  for (const x of e.cards) {
    const M = o.get(x.id);
    for (const A of /* @__PURE__ */ new Set([...Object.keys(M?.fields ?? {}), ...Object.keys(x.fields ?? {})]))
      h.has(x.id) && (A === d.x.id || A === d.y.id) || M?.fields?.[A] !== x.fields?.[A] && m.push({ kind: "set_field", card: { id: x.id }, field: A, value: x.fields?.[A] ?? null });
  }
  const _ = [], E = e.cards.filter((x) => x.owner && x.owner !== (o.get(x.id)?.owner ?? fe(e, x))), O = /* @__PURE__ */ new Set();
  for (const x of E.sort((M, A) => v(M.id) - v(A.id))) {
    if (O.has(x.id)) continue;
    const M = o.get(x.id)?.owner, A = Sn(e, x.id).slice(1).filter((C) => E.some((Z) => Z.id === C && Z.owner === x.owner) && o.get(C)?.owner === M && o.has(C));
    A.forEach((C) => O.add(C)), _.push({ kind: "set_owner", card: { id: x.id }, owner: x.owner, ...o.has(x.id) && { carry: A.map((C) => ({ id: C })) } });
  }
  for (const x of e.lanes) {
    const M = a.lanes.find((A) => A.id === x.id);
    M && M.label !== x.label && m.push({ kind: "rename_lane", lane: { id: x.id }, label: x.label });
  }
  n.title !== e.title && m.push({ kind: "rename_workshop", title: e.title });
  const $ = [...t, ...i, ...u, ...l, ...p], Cn = [...k, ...m, ..._], kn = [...$, ...c, ...y, ...Cn];
  if (!c.length || !y.length) return kn;
  const $n = [...$, ...y, ...c, ...Cn];
  return "refused" in nn(n, kn) && !("refused" in nn(n, $n)) ? $n : kn;
}
function ft(n, e, t) {
  if (!ht(n, t)) return null;
  const s = D(n, t).parts.find((a) => a.name.startsWith("caption-owner-") && T(a, e));
  return s ? s.name.slice(14) : null;
}
function me(n, e, t) {
  const s = /* @__PURE__ */ new Map();
  return (a) => {
    const o = ft(n, a, t);
    if (o) {
      if (!s.has(o)) {
        const r = nn(n, [{ kind: "set_owner", card: { id: e }, owner: o }]);
        s.set(o, "refused" in r ? null : r.workshop);
      }
      return s.get(o);
    }
  };
}
function pt(n, e, t, s, a) {
  const o = ut(a), { parts: r } = D(n, a), i = n.cards.find((m) => m.id === e);
  if (i.laneId !== R(n).tray && T(r.find((m) => m.name === "column-" + R(n).tray), s)) {
    const m = In(n, e, { laneId: R(n).tray, under: null, before: null });
    return m ? { board: m } : null;
  }
  const u = { x: s.x - t.x, y: s.y - t.y };
  if (!T({ x: o.left - o.w / 2, y: o.top - o.h / 2, width: o.size + o.w, height: o.size + o.h }, { x: u.x + o.w / 2, y: u.y + o.h / 2 })) return null;
  const { x: l, y: p } = ce(o, u), c = tn(n, i);
  if (c && c.x === l && c.y === p) return { board: n };
  const y = nn(n, [{ kind: "score_card", card: { id: e }, x: l, y: p }]);
  return "refused" in y ? { refused: y.refused.reason } : { board: y.workshop };
}
function xe(n, e, t, s) {
  const a = /* @__PURE__ */ new Map();
  return (o) => {
    const r = Math.round(o.x) + ":" + Math.round(o.y);
    if (!a.has(r)) {
      const i = pt(n, e, t, o, s);
      a.size > 400 && a.clear(), a.set(r, i && "board" in i ? i.board : n);
    }
    return a.get(r);
  };
}
const ye = {
  laneCues: !0,
  places: (n, e) => D(n, e),
  notes: (n, e, t, s) => wn(D(n, e).parts, n, t, s),
  editsBetween: pe,
  layer: (n) => gn(n, de),
  cardKeys: "Right puts it under the card above it, Left takes it out, Up and Down move it among its neighbours.",
  label(n, e) {
    const t = n.cards.find((a) => "card-" + a.id === e);
    if (!t) return null;
    const s = n.cards.find((a) => a.id === t.parentId);
    return t.label + (t.role ? ", " + t.role : "") + (s ? ", under " + s.label : ", in " + n.lanes.find((a) => a.id === t.laneId).label);
  },
  chooser(n, e, t, s = {}) {
    if (J(n, s) === "matrix") return xe(n, e, t, s);
    const a = me(n, e, s), o = $t(n, e), r = o.map((h) => h.next), { main: i, tray: u } = R(n), l = n.cards.find((h) => h.id === e), p = J(n, s), c = r.length > 1 ? F(n, "card-" + e, t, (h) => Y(D(h, s).parts), (h, k) => h.closest(r, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(k, { gapIn: 40, gapOut: 56 })) : null, { parts: y } = D(n, s), m = new Set(Sn(n, e));
    let d;
    return (h) => {
      const k = a(h);
      if (k !== void 0) return k ?? n;
      const f = p === "outline" ? null : un(y, h, m);
      if (f) {
        const v = he(n, p, f, h, y.find((w) => w.name === "card-" + f), e), z = o.find((w) => w.spot.laneId === v.laneId && w.spot.under === v.under && w.spot.before === v.before);
        if (z) return z.next;
      }
      const g = c ? c(h) : n;
      return ue(g, n) ? l.laneId !== u && T(y.find((v) => v.name === "column-" + u), h) ? In(n, e, { laneId: u, under: null, before: null }) ?? n : T(y.find((v) => v.name === "column-" + i), h) && !un(y, h, /* @__PURE__ */ new Set()) ? (d === void 0 && (d = Wt(n, e)), d ?? n) : g : g;
    };
  },
  refusalAt(n, e, t, s, a) {
    const o = J(n, a);
    if (o === "matrix") {
      const m = pt(n, e, t, s, a);
      return m && "refused" in m ? { laneId: R(n).main, reason: m.refused } : null;
    }
    const r = ft(n, s, a);
    if (r) {
      const m = nn(n, [{ kind: "set_owner", card: { id: e }, owner: r }]);
      return "refused" in m ? { laneId: R(n).main, reason: m.refused.reason } : null;
    }
    if (o === "outline") return null;
    const { parts: i } = D(n, a), u = un(i, s, new Set(Sn(n, e))), l = u && En(n, o, u), p = n.cards.find((m) => m.id === e);
    if (!l || l === p.parentId) return null;
    const c = In(n, e, { laneId: R(n).main, under: l, before: null }), y = c && n.behaviour ? Ct(n, c) : null;
    return y && "refused" in y ? { laneId: R(n).main, reason: y.refused.sentence } : null;
  },
  noteUnder(n, e, t) {
    if (J(n, t) === "matrix") return null;
    const s = un(D(n, t).parts, e, /* @__PURE__ */ new Set());
    return s ? En(n, J(n, t), s) : null;
  },
  keyEdit(n, e, t) {
    const s = n.cards.find((l) => "card-" + l.id === e);
    if (!s) return null;
    const a = tn(n, s);
    if (n.nest?.layout === "matrix") {
      const l = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }, [p, c] = l[t.key] ?? [0, 0];
      if (!a || !p && !c) return null;
      const y = a.x + p, m = a.y + c;
      return y < 0 || y > 10 || m < 0 || m > 10 ? null : [{ kind: "score_card", card: { id: s.id }, x: y, y: m }];
    }
    const o = s.parentId ? W(n, s.parentId) : W(n, null, s.laneId), r = o.findIndex((l) => l.id === s.id), i = { id: s.id }, u = (l) => l ? { under: { id: l } } : { lane: { id: s.laneId } };
    switch (t.key) {
      case "ArrowRight":
        return r > 0 && s.laneId !== R(n).tray ? [{ kind: "nest_card", card: i, under: { id: o[r - 1].id } }] : null;
      case "ArrowLeft": {
        const l = n.cards.find((y) => y.id === s.parentId);
        if (!l) return null;
        const p = l.parentId ? W(n, l.parentId) : W(n, null, l.laneId), c = p[p.findIndex((y) => y.id === l.id) + 1];
        return [{ kind: "nest_card", card: i, ...u(l.parentId), ...c && { before: { id: c.id } } }];
      }
      case "ArrowUp":
        return r > 0 ? [{ kind: "nest_card", card: i, ...u(s.parentId), before: { id: o[r - 1].id } }] : null;
      case "ArrowDown":
        return r >= 0 && r < o.length - 1 ? [{ kind: "nest_card", card: i, ...u(s.parentId), ...o[r + 2] && { before: { id: o[r + 2].id } } }] : null;
    }
    return null;
  },
  handleDrag: () => null
}, ge = { "launch-plan": An, "hiring-plan": An, pipeline: ee, budget: ae, nest: ye };
function _e(n) {
  const e = ge[n];
  if (!e) throw new Error(`No board kit for "${n}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return e;
}
function Ae(n) {
  return n < 600 ? { narrow: !0, width: Math.max(300, Math.round(n - 32)) } : {};
}
export {
  Oe as amountLimits,
  Ce as amountOf,
  Mi as amountRules,
  $e as bandOf,
  vi as behaviourEditsBetween,
  Ae as boardLayoutFor,
  Di as breakDownSample,
  Bn as budgetCaption,
  Ot as budgetCommitted,
  Ft as budgetHeader,
  ae as budgetKit,
  H as budgetLayout,
  Et as budgetLimits,
  Lt as budgetRefusal,
  zi as budgetRules,
  Si as budgetShiftLimits,
  Ii as budgetShiftRefusal,
  Bi as byOrder,
  Mt as cascadeStops,
  _i as catalogSamples,
  Ct as checkNest,
  Fi as checkNestMove,
  zt as checkTime,
  Zn as clockOf,
  gn as createBoardLayer,
  We as currencyOf,
  Re as dateName,
  Te as dayFromWords,
  wt as dayMap,
  Pn as dayWords,
  Pe as days,
  Ni as discoveryTreeSample,
  De as downstreamTasks,
  Hi as extend,
  Be as extendWorkshopEdits,
  Fe as goLiveSample,
  as as goalsSample,
  rt as handleLabel,
  Ne as hireLagFor,
  St as hireStarts,
  He as hiringPlanRules,
  Ke as hiringPlanSample,
  vt as holdOthers,
  os as impactEffortSample,
  Ki as incidentReviewSample,
  qi as isOrderKey,
  rs as isOrgChart,
  sn as isoAt,
  qe as isoTime,
  _e as kitFor,
  xn as launchFinish,
  Xn as launchHard,
  Ve as launchIndex,
  j as launchLayout,
  Yn as launchLinkRefusal,
  ot as launchLinkTargets,
  pn as launchOverrun,
  Ue as launchPlanCaption,
  An as launchPlanKit,
  fn as launchPlanLimits,
  Je as launchPlanRefusal,
  je as launchPlanRules,
  Ge as launchPlanSample,
  Ye as launchTaskText,
  I as layerInk,
  bn as legalRuns,
  nt as lineWord,
  V as money,
  Ze as monthNames,
  Vi as nestAlias,
  R as nestAreas,
  st as nestAxes,
  Rt as nestCardText,
  Ui as nestDepth,
  Ji as nestDrags,
  pe as nestEditsBetween,
  Wt as nestEmptyDrop,
  ji as nestFamily,
  W as nestKids,
  ye as nestKit,
  D as nestLayout,
  $t as nestLegal,
  Gi as nestMeasure,
  Yi as nestMeasureWords,
  In as nestPlace,
  Pt as nestQuadrants,
  it as nestRoots,
  Tt as nestRules,
  tn as nestScores,
  Zi as nestSentence,
  Sn as nestSubtree,
  Qe as nextCardId,
  Xe as nextMonday,
  be as noteNumbers,
  Tn as offsetOf,
  Qi as orderBetween,
  Xi as orderKeys,
  ni as ownField,
  wn as partNotes,
  kt as pastTheLine,
  Dn as pipelineCaption,
  et as pipelineForecast,
  Bt as pipelineGauge,
  ee as pipelineKit,
  b as pipelineLayout,
  Ai as pipelineLimits,
  At as pipelineRefusal,
  Ei as pipelineRules,
  Li as planBudgetMove,
  ti as planDrags,
  ei as planEdit,
  ii as planFixed,
  si as planLaunchPlanMove,
  Oi as planPipelineMove,
  ai as planProblem,
  oi as planWords,
  ri as presetRules,
  Dt as quadrantOf,
  li as readClock,
  ci as readNoteNumbers,
  bi as registerNestPlus,
  di as renamedNumbers,
  Hn as renderLayerShapes,
  ls as reorgSample,
  Ci as restoreWorkshop,
  ns as roleOf,
  hi as runwayCap,
  ui as runwayHeader,
  It as runwayMonths,
  _t as runwayWords,
  $i as sampleBudget,
  fi as sampleLaunchPlan,
  Wi as samplePipeline,
  mn as scheduleLaunch,
  cs as scoreBoard,
  ds as scoresIn,
  Fn as shiftBudget,
  Q as shortDate,
  yn as snapStep,
  ts as sortEvidenceSample,
  es as tidyKeys,
  pi as timeFamily,
  mi as timeRuleKindIds,
  xi as timeSentence,
  Qn as tryTask,
  Ri as validateBudget,
  yi as validateHiringPlan,
  gi as validateLaunchPlan,
  is as validateNest,
  Ti as validatePipeline,
  Rn as weekdayAt,
  wi as weekendAt,
  tt as withLink,
  U as withTaskValue,
  Ln as workshopEditsBetween
};
