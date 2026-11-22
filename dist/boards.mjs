import { Vec2 as Rn, getElementPositionCheap as yt, translate as gt, dragSpecToBehavior as wt, param as on, moreThan as rn, lessThan as ln, inOrder as kt } from "./dragology.mjs";
import { laneColors as en, workshopDestinations as Gn, workshopCandidate as Yn, applyWorkshopEdits as nn } from "./workshop-model.mjs";
import { m as U, G as Zn, I as fn, _ as J, Z as pn, Q as mn, u as Mt, v as Qn, X as yn, z as Xn, V as bn, a5 as vt, C as nt, W as zt, a0 as St, T as tt, a3 as It, R as xn, $ as et, w as Tn, j as Pn, s as Q, f as sn, a6 as At, ac as _t, ad as Et, U as Dn } from "./plans-BI5v9TGn.mjs";
import { a as Ce, d as $e, a8 as We, c as Re, p as Te, t as Pe, ag as De, Y as Be, P as Fe, g as Ne, a7 as He, ab as Ke, h as qe, i as Ve, S as Ue, H as Je, F as je, N as Ge, l as Ye, J as Ze, e as Qe, n as Xe, q as be, b as ni, o as ti, B as ei, M as ii, y as si, E as ai, x as oi, A as ri, L as li, O as ci, af as di, r as hi, ae as ui, aa as fi, K as pi, a4 as mi, a2 as xi, a1 as yi, a9 as gi, D as wi, k as ki } from "./plans-BI5v9TGn.mjs";
import cn from "react";
import { pipelineForecast as it, pipelineRefusal as Lt, pipelineCaption as Bn, budgetLimits as Ot, budgetRefusal as Ct, budgetCaption as Fn, shiftBudget as Nn, budgetCommitted as $t } from "./workshop-rules.mjs";
import { amountRules as vi, behaviourEditsBetween as zi, budgetRules as Si, budgetShiftLimits as Ii, budgetShiftRefusal as Ai, catalogSamples as _i, pipelineLimits as Ei, pipelineRules as Li, planBudgetMove as Oi, planPipelineMove as Ci, restoreWorkshop as $i, sampleBudget as Wi, samplePipeline as Ri, validateBudget as Ti, validatePipeline as Pi } from "./workshop-rules.mjs";
import { nestKids as W, nestAreas as R, nestSubtree as Sn, nestPlace as In, checkNest as Wt, nestLegal as Rt, nestEmptyDrop as Tt, nestCardText as Pt, nestRules as Dt, nestRoots as st } from "./workshop-nest.mjs";
import { breakDownSample as Bi, byOrder as Fi, checkNestMove as Ni, discoveryTreeSample as Hi, extend as Ki, incidentReviewSample as qi, isOrderKey as Vi, nestAlias as Ui, nestDepth as Ji, nestDrags as ji, nestFamily as Gi, nestMeasure as Yi, nestMeasureWords as Zi, nestSentence as Qi, orderBetween as Xi, orderKeys as bi, registerNestPlus as ns, roleOf as ts, sortEvidenceSample as es, tidyKeys as is, validateNest as ss } from "./workshop-nest.mjs";
import { nestScores as tn, nestAxes as at, nestQuadrants as Bt, quadrantOf as Ft } from "./workshop-nest-plus.mjs";
import { goalsSample as os, impactEffortSample as rs, isOrgChart as ls, reorgSample as cs, scoreBoard as ds, scoresIn as hs } from "./workshop-nest-plus.mjs";
const I = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, An = "http://www.w3.org/2000/svg", Hn = (n) => /var\([^,]+,\s*([^)]+)\)/.exec(n)?.[1].trim() ?? n;
function H(n, e, t) {
  const s = document.createElementNS(An, n);
  for (const [a, o] of Object.entries(e)) s.setAttribute(a, String(o));
  return t?.fill && (s.setAttribute("fill", Hn(t.fill)), s.style.setProperty("fill", t.fill)), t?.stroke && (s.setAttribute("stroke", Hn(t.stroke)), s.style.setProperty("stroke", t.stroke)), s;
}
function Kn(n, e, t, s) {
  const a = typeof document < "u" ? document.activeElement : null, o = a && n.contains(a) ? a.getAttribute("data-board-link") : null;
  for (; n.firstChild; ) n.removeChild(n.firstChild);
  const r = [];
  for (const i of e)
    if (i.t === "line")
      n.appendChild(H("line", {
        x1: i.x1,
        y1: i.y1,
        x2: i.x2,
        y2: i.y2,
        "stroke-width": i.width ?? 1,
        ...i.dash ? { "stroke-dasharray": i.dash } : {}
      }, { stroke: i.color }));
    else if (i.t === "rect")
      n.appendChild(H("rect", {
        x: i.x,
        y: i.y,
        width: Math.max(0, i.w),
        height: Math.max(0, i.h),
        rx: i.rx ?? 0,
        ...i.opacity !== void 0 ? { opacity: i.opacity } : {}
      }, { fill: i.color }));
    else if (i.t === "text") {
      const u = H("text", {
        x: i.x,
        y: i.y,
        "font-size": i.size ?? 13,
        "text-anchor": i.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...i.bold ? { "font-weight": 600 } : {},
        ...i.role ? { "data-board-layer": i.role } : {}
      }, { fill: i.color });
      i.lines && i.lines.length > 1 ? i.lines.forEach((l, p) => {
        const c = H("tspan", { x: i.x, dy: p ? i.lineHeight ?? Math.round((i.size ?? 13) * 1.25) : 0 });
        c.textContent = p < i.lines.length - 1 ? l + " " : l, u.appendChild(c);
      }) : u.textContent = i.text, n.appendChild(u);
    } else {
      if (i.unlink && t) {
        const { cardId: u, waitsOn: l, label: p } = i.unlink, c = l + ">" + u, y = s?.armed === c, x = H("path", {
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
        x.addEventListener("pointerdown", (h) => {
          h.stopPropagation(), d = h.pointerType === "touch" || h.pointerType === "pen";
        }), x.addEventListener("click", (h) => {
          if (h.stopPropagation(), d && s && s.armed !== c) {
            s.arm(c);
            return;
          }
          s?.arm(null), t(u, l);
        }), x.addEventListener("keydown", (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), h.stopPropagation(), t(u, l));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", I.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          y || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), n.appendChild(x), r.push(x);
      }
      if (n.appendChild(H("path", { d: i.d, fill: "none", "stroke-width": i.width ?? 1.5, "pointer-events": "none" }, { stroke: i.color })), i.arrow) {
        const { x: u, y: l, angle: p } = i.arrow;
        n.appendChild(H("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${u} ${l}) rotate(${p})`, "pointer-events": "none" }, { fill: i.color }));
      }
      if (i.unlink && s?.armed === i.unlink.waitsOn + ">" + i.unlink.cardId && i.arrow) {
        const u = H("text", {
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
  const t = n?.canvas?.node, s = document.createElementNS(An, "g");
  s.setAttribute("data-board-layer", ""), s.setAttribute("pointer-events", "none");
  const a = document.createElementNS(An, "g");
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
      const { origin: x } = y, d = e(c ?? p, y, p), h = (g) => g.t === "text" && (g.role === "clamp" || g.role === "refusal");
      for (const g of [s, a]) g.setAttribute("transform", `translate(${x.x} ${x.y})`);
      Kn(s, d.filter((g) => !h(g)), y.onUnlink, u), Kn(a, d.filter(h));
      const k = y.above && y.above.parentNode === t ? y.above : null, f = k ? k.nextSibling : t.firstChild;
      (s.parentNode !== t || s.previousSibling !== k) && t.insertBefore(s, f === s ? s.nextSibling : f), a.firstChild && t.lastChild !== a ? t.appendChild(a) : !a.firstChild && a.parentNode && a.remove();
    },
    destroy() {
      o = !0, clearTimeout(i), s.remove(), a.remove();
    }
  };
  return l;
}
function Z(n, e = []) {
  const t = n.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return cn.createElement(
    "g",
    null,
    ...t.map((s) => /* @__PURE__ */ cn.createElement("g", { id: s.name, transform: gt(s.x, s.y) }, /* @__PURE__ */ cn.createElement("rect", { width: s.width, height: s.height }))),
    ...n.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ cn.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function N(n, e, t, s, a) {
  let o;
  const i = {
    draggable: (l) => (o ?? (o = l.d), s(l.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: Rn(t.x, t.y),
    startState: n,
    debug: { varyVisualizer: !1 }
  };
  if (!yt(i, n) || !o) return null;
  const u = wt(a(o, n), i);
  return (l) => u({ pointer: Rn(l.x, l.y) }).dropState;
}
const P = (n, e, t = 0) => !!n && e.x >= n.x - t && e.x <= n.x + n.width + t && e.y >= n.y - t && e.y <= n.y + n.height + t;
function ot(n, e, t, s, a) {
  if (!n) return null;
  const o = e.cards.find((r) => r.id === t).laneId;
  return (r) => {
    const i = n(r);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const u = s.find((l) => l.name.startsWith("column-") && l.name !== "column-" + o && P(l, r));
    return u && a.find((l) => l.cards.find((p) => p.id === t).laneId === u.name.slice(7)) || i;
  };
}
function O(n, e) {
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
function Nt(n) {
  const e = n.forecast?.currency;
  return `Forecast ${U(it(n), e)} of ${U(n.forecast?.target ?? 0, e)}`;
}
function Ht(n) {
  return `${U(n.budget?.total ?? 0, n.budget?.currency)} · balanced`;
}
function rt(n, e) {
  return n.cards.filter((t) => Zn(n, e, t.id) === null).map((t) => t.id);
}
function Kt(n, e, t, s) {
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
      fontSize: Kt(l, i.fontSize ?? r, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function lt(n, e) {
  const t = e.slice(7);
  if (t === "launch") return `Launch day, day ${n.launch?.day}. Left and Right move it.`;
  const s = n.cards.find((o) => o.id === t);
  if (s) return `${s.label} length, ${s.duration} days. Left and Right change it.`;
  const a = n.lanes.findIndex((o) => o.id === t);
  return a >= 0 && n.lanes[a + 1] ? `Divider between ${n.lanes[a].label} and ${n.lanes[a + 1].label}. Left and Right move money.` : null;
}
const ct = "#c2410c", qt = 32, Vt = 44, On = (n) => n ? 0 : 22;
function G(n, e = {}) {
  const t = !!e.narrow, s = n.kind === "hiring-plan", a = mn(n), o = s ? n.hiring.weeks * 7 : bn(n) ? n.launch.day : Math.ceil(n.launch.day * 4 / 3), r = vt(n), i = [], u = /* @__PURE__ */ new Map(), l = t ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), p = t ? 8 : 168, c = t ? (l - 88) / o : (l - p - 40) / o, y = (f) => en[n.lanes.findIndex((g) => g.id === f) % en.length], x = (f, g) => {
    const v = n.cards.find((A) => A.id === f), z = a.get(f), w = { x: p + z.from * c, y: g, width: (z.to - z.from) * c, height: t ? Vt : qt };
    u.set(f, w);
    const S = r.has(f);
    i.push({
      name: "card-" + f,
      ...w,
      text: t ? "" : s ? v.label : `${v.label} · ${v.duration}d`,
      fill: S ? "#fde3d7" : t ? y(v.laneId) : s ? O(y(v.laneId), 0.45) : "#fffdf6",
      line: S || z.critical && !s ? ct : "#667872",
      lineWidth: S || z.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), s && t || i.push({ name: "handle-" + f, x: w.x + w.width - On(t), y: w.y + w.height / 2 - 22, width: 44, height: 44 });
  };
  let d, h, k;
  if (t) {
    const f = (l - 16 - 8 * (n.lanes.length - 1)) / n.lanes.length;
    n.lanes.forEach((g, v) => {
      const z = 8 + v * (f + 8);
      i.push({ name: "column-" + g.id, x: z, y: 30, width: f, height: 72, fill: O(y(g.id), 0.6), line: O(y(g.id), 0.1) }), i.push({ name: "lane-" + g.id, x: z + 4, y: 34, width: f - 8, height: 28, text: g.label, fill: y(g.id), fontSize: 14 }), i.push({ name: "caption-" + g.id, x: z + 4, y: 64, width: f - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), k = 124, h = 130, d = 138;
    for (const g of n.cards)
      x(g.id, d + 20), d += 64;
  } else {
    k = 48, h = 56, d = h;
    for (const f of n.lanes) {
      const g = n.cards.filter((z) => z.laneId === f.id), v = Math.max(92, g.length * 44 + 20);
      i.push({ name: "column-" + f.id, x: 0, y: d, width: l, height: v, fill: O(y(f.id), 0.65), line: O(y(f.id), 0.1) }), i.push({ name: "lane-" + f.id, x: 8, y: d + 8, width: p - 24, height: 32, text: f.label, fill: y(f.id), fontSize: 15 }), i.push({ name: "caption-" + f.id, x: 8, y: d + 44, width: p - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), g.forEach((z, w) => x(z.id, d + 10 + w * 44)), d += v + 4;
    }
  }
  return s ? n.hiring.funding && !t && i.push({ name: "handle-funding", x: p + n.hiring.funding.day * c - 22, y: 4, width: 44, height: 44 }) : i.push({ name: "handle-launch", x: p + n.launch.day * c - 22, y: t ? 104 : 4, width: 44, height: 44 }), { parts: i, width: l, height: d + 8, narrow: t, x0: p, dayW: c, gridTop: h, axisY: k, bars: u };
}
function Ut(n, e, t) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = t(s.name.slice(8)));
  return e;
}
function Jt(n, e) {
  const t = n.x + n.width, s = Math.max(n.x + 4, t - 10), o = e.y + e.height / 2 > n.y + n.height / 2 ? n.y + n.height : n.y, r = e.y + e.height / 2;
  return { d: `M ${s} ${o} V ${r} H ${e.x}`, arrow: { x: e.x, y: r, angle: 0 } };
}
function jt(n, e) {
  const t = G(n, e.layout), s = n.kind === "hiring-plan", a = mn(n), o = Math.round((t.width - (t.narrow ? 88 : t.x0 + 40)) / t.dayW), r = Qn(n), i = [];
  if (r?.workdays)
    for (let c = 0; c < o; c++) Tn(r.origin, c) === 6 && i.push({ t: "rect", x: t.x0 + c * t.dayW, y: t.gridTop, w: 2 * t.dayW, h: t.height - 8 - t.gridTop, color: I.track, opacity: 0.7 });
  for (const c of n.behaviour?.rules ?? []) if (r && c.on && c.kind === "blackout") {
    const y = Pn(r.origin, c.start), x = Pn(r.origin, c.end) + 1, d = t.x0 + Math.max(0, y) * t.dayW, h = (Math.min(o, x) - Math.max(0, y)) * t.dayW;
    if (h <= 0) continue;
    i.push({ t: "rect", x: d, y: t.gridTop, w: h, h: t.height - 8 - t.gridTop, color: I.refuse, opacity: 0.12 });
    for (let k = d; k < d + h; k += 10) i.push({ t: "line", x1: k, y1: t.gridTop, x2: Math.min(d + h, k + 10), y2: t.gridTop + 10, color: I.refuse, width: 0.6 });
    i.push({ t: "text", x: d + 3, y: t.gridTop + 22, text: c.label + " · " + Q(c.start) + "–" + Q(c.end), color: I.refuse, size: 11, bold: !0 });
  }
  for (let c = 0; c <= o; c++) {
    const y = t.x0 + c * t.dayW, x = r ? Tn(r.origin, c) === 1 : c % 7 === 0;
    if (!x && t.dayW < 6) continue;
    i.push({ t: "line", x1: y, y1: t.gridTop, x2: y, y2: t.height - 8, color: x ? I.week : I.faint, width: x ? 1 : 0.5 });
    const d = s && r && sn(r.origin, c).slice(8) <= "07" && x, h = r ? s ? d ? Q(sn(r.origin, c)).replace(/^\d+ /, "") : "" : Q(sn(r.origin, c)) : (t.narrow ? "W" : "Week ") + (c / 7 + 1);
    x && h && (!r || s || t.dayW * 7 > 44) && i.push({ t: "text", x: y + 3, y: t.axisY, text: h, color: I.ink, size: 12 });
  }
  for (const c of n.cards) {
    for (const d of c.dependsOn ?? []) {
      const h = t.bars.get(d), k = t.bars.get(c.id);
      if (!h || !k) continue;
      const f = a.get(d).critical && a.get(c.id).critical, g = n.cards.find((v) => v.id === d).label;
      i.push({
        t: "path",
        ...Jt(h, k),
        color: f ? ct : I.ink,
        width: f ? 2 : 1.5,
        unlink: { cardId: c.id, waitsOn: d, label: `Remove the link: ${c.label} waits on ${g}` }
      });
    }
    const y = a.get(c.id), x = t.bars.get(c.id);
    if (s) {
      const d = n.hiring.bands.find((f) => f.id === c.band), h = x.x + x.width, k = t.x0 + o * t.dayW;
      k > h && i.push({ t: "rect", x: h, y: x.y + x.height / 2 - 3, w: k - h, h: 6, rx: 3, color: I.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: t.narrow ? 8 : Math.min(h + 6, k - 120),
        y: t.narrow ? x.y - 6 : x.y + x.height / 2 - 6,
        text: (t.narrow ? c.label + " · " : "") + "starts " + Q(sn(r.origin, At(n, c.id))) + (d ? " · " + U(d.monthly, n.hiring.currency) + "/mo" : ""),
        color: I.ink,
        size: 12,
        role: "start-" + c.id
      });
      continue;
    }
    t.narrow && i.push({ t: "text", x: 8, y: x.y - 6, text: `${c.label} · ${c.duration}d`, color: I.ink, size: 13, bold: y.critical }), y.critical || i.push({ t: "text", x: x.x + x.width + (t.narrow ? 48 : 24), y: x.y + x.height / 2 + 4, text: "+" + y.slack + "d", color: I.ink, size: 12, role: "slack-" + c.id });
  }
  if (s) {
    const c = _t(n), y = n.behaviour?.rules.find((h) => h.on && h.kind === "deadline"), x = y && y.kind === "deadline" && c < y.floor;
    i.push({
      t: "text",
      x: t.narrow ? 8 : t.x0,
      y: t.narrow ? 18 : 20,
      text: "Runway with these hires: " + Et(c),
      color: x || e.refused ? I.refuse : I.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const d = n.hiring.funding;
    if (d && d.day <= o) {
      const h = t.x0 + d.day * t.dayW;
      i.push({ t: "line", x1: h, y1: 26, x2: h, y2: t.height - 8, color: I.accept, width: 2, dash: "6 4" }), t.narrow || i.push({ t: "rect", x: h - 4, y: 26, w: 8, h: 18, rx: 4, color: I.accept }), i.push({ t: "text", x: Math.max(h + 8, t.narrow ? 8 : t.x0 + 330), y: t.narrow ? 40 : 20, text: "Round +" + U(d.amount, n.hiring.currency) + " · " + Q(sn(r.origin, d.day)), color: I.accept, size: 12, bold: !0 });
    }
    if (t.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: I.ink, size: 12 }), e.clamp) {
      const h = t.parts.find((k) => k.name === e.clamp.name);
      h && i.push(...Vn(t, i, e.clamp.text, h, e.view));
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
    text: r ? "Done " + Dn(n, Math.ceil(p) - 1) + " · " + tt(n) + " " + Dn(n, n.launch.day) : `Done day ${l} · launch day ${n.launch.day}`,
    color: e.refused ? I.refuse : I.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), e.clamp) {
    const c = t.parts.find((y) => y.name === e.clamp.name);
    c && i.push(...Vn(t, i, e.clamp.text, c, e.view));
  }
  return i;
}
const dn = 13, qn = 16, dt = (n, e) => n * (e ? 0.64 : 0.6), Gt = (n, e) => n.x + n.w <= e.x || e.x + e.w <= n.x || n.y + n.h <= e.y || e.y + e.h <= n.y;
function Yt(n) {
  const e = n.size ?? 13, t = n.text.length * dt(e, n.bold);
  return { x: n.anchor === "end" ? n.x - t : n.anchor === "middle" ? n.x - t / 2 : n.x, y: n.y - e, w: t, h: e * 1.3 };
}
function Zt(n, e) {
  const t = [];
  for (const s of n.split(/\s+/).filter(Boolean)) {
    const a = t.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? t[t.length - 1] = a + " " + s : t.push(s);
  }
  return t;
}
let Mn = null;
function Vn(n, e, t, s, a) {
  const o = [...n.bars.values()].map((f) => ({ x: f.x - 4, y: f.y - 3, w: f.width + 8, h: f.height + 6 }));
  for (const f of e)
    f.t === "text" ? o.push(Yt(f)) : f.t === "rect" && o.push({ x: f.x - 2, y: f.y - 2, w: f.w + 4, h: f.h + 4 });
  let r = n.narrow ? 6 : n.x0 + 2, i = n.width - 4, u = n.gridTop + 2, l = n.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(r, a.x + 8) >= 160 && (r = Math.max(r, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(l, a.y + a.height - 8) - Math.max(u, a.y + 8) >= 40 && (u = Math.max(u, a.y + 8), l = Math.min(l, a.y + a.height - 8)));
  const p = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, c = JSON.stringify([t, p, r, i, u, l, o.map((f) => [f.x, f.y, f.w, f.h].map(Math.round))]);
  if (Mn?.key === c) return Mn.shapes;
  const y = dt(dn, !0), x = Math.floor((i - r) / y), d = /* @__PURE__ */ new Map();
  for (const f of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const g = Zt(t, Math.max(8, Math.floor(x * f)));
    g.length <= 4 && d.set(g.join(`
`), g);
  }
  let h = null;
  for (const f of d.values()) {
    const g = Math.max(...f.map((z) => z.length)) * y, v = f.length * qn + 2;
    if (!(g > i - r))
      for (let z = u; z + v <= l; z += 3)
        for (let w = r; w + g <= i; w += 6) {
          const S = { x: w, y: z, w: g, h: v }, A = Math.max(S.x - p.x, 0, p.x - (S.x + S.w)), L = Math.max(S.y - p.y, 0, p.y - (S.y + S.h)), E = Math.hypot(A, L) + (f.length - 1) * 24;
          h && E >= h.score || o.every(($) => Gt(S, $)) && (h = { box: S, lines: f, score: E });
        }
  }
  const k = h ? [{ t: "text", x: h.box.x, y: h.box.y + dn - 1, text: t, lines: h.lines, lineHeight: qn, color: I.refuse, size: dn, bold: !0, role: "clamp" }] : [{
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
const Y = (n, e = 1, t) => {
  const s = (o, r) => Math.round(o / r) * r, a = { ...n, cards: n.cards.map((o) => {
    const r = o.id === t ? e : 1, i = { ...o, duration: Math.max(r, s(o.duration, r)), lag: Math.max(0, s(o.lag ?? 0, r)) };
    return i.lag || delete i.lag, i;
  }) };
  return n.launch && (a.launch = { ...n.launch, day: Math.round(n.launch.day) }), n.hiring?.funding && (a.hiring = { ...n.hiring, funding: { ...n.hiring.funding, day: Math.round(n.hiring.funding.day) } }), a;
}, vn = (n) => !!n.behaviour || n.kind === "hiring-plan";
function Qt(n, e, t) {
  if (t !== "l" && t !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && n.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const o = (i) => n.cards.find((u) => u.id === i)?.label ?? i, r = [
    ...rt(n, a.id).map((i) => ({
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
function Xt(n, e, { key: t, shiftKey: s }) {
  if (t !== "ArrowLeft" && t !== "ArrowRight") return null;
  const a = (t === "ArrowLeft" ? -1 : 1) * yn(n);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: n.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: n.hiring.funding.day + Math.sign(a) * 7 }];
  const o = /^(card|handle)-(.+)$/.exec(e), r = o && n.cards.find((i) => i.id === o[2]);
  return r ? s || o[1] === "handle" ? [{ kind: "set_task", card: { id: r.id }, duration: r.duration + a }] : [{ kind: "set_task", card: { id: r.id }, lag: (r.lag ?? 0) + a }] : null;
}
const _n = {
  laneCues: !1,
  notes(n, e, t, s) {
    return wn(_n.places(n, e).parts, n, t, s);
  },
  editsBetween: Ln,
  label: lt,
  places(n, e) {
    const t = Ut(n, G(n, e), (s) => {
      const a = n.cards.filter((r) => r.laneId === s), o = mn(n);
      return n.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((r) => o.get(r.id).critical).length} on the critical path`;
    });
    return { parts: t.parts, width: t.width, height: t.height };
  },
  layer: (n) => gn(n, jt),
  chooser(n, e, t, s = {}) {
    const a = n.cards.findIndex((o) => o.id === e);
    return a < 0 ? null : n.kind === "hiring-plan" && s.narrow ? () => n : (vn(n) ? bt : ee)(n, e, a, rt(n, e), t, s);
  },
  refusalAt(n, e, t, s, a) {
    const o = G(n, a);
    for (const l of n.cards) {
      if (l.id === e || !P(o.bars.get(l.id), s)) continue;
      const p = Zn(n, e, l.id);
      return p ? { laneId: l.laneId, reason: p } : null;
    }
    const r = n.cards.find((l) => l.id === e), i = (r.lag ?? 0) + Math.round((s.x - t.x - o.bars.get(e).x) / o.dayW);
    if (vn(n)) {
      const l = mn(n).get(e), p = Math.round(l.from + (s.x - t.x - o.bars.get(e).x) / o.dayW), c = (r.lag ?? 0) + Mt(Qn(n)).idx(p) - l.start, y = yn(n), x = Xn(n, e, { lag: Math.max(0, Math.round(c / y) * y) });
      return typeof x == "string" ? { laneId: r.laneId, reason: x, lands: !0 } : null;
    }
    const u = fn(n, { cardId: e, field: "lag" });
    return i > u.max ? { laneId: r.laneId, reason: pn(J(n, { cardId: e, field: "lag" }, i), e) ?? u.reasons.max } : null;
  },
  handleDrag(n, e, t, s) {
    const a = G(n, s), o = (x) => Z(G(x, s).parts);
    if (n.kind === "hiring-plan" && s.narrow) return null;
    if (vn(n)) return ne(n, e, t, s, a, o);
    if (e === "handle-launch") {
      const x = fn(n, { field: "day" }), d = N(n, e, t, o, (h, k) => h.vary(k, on("launch", "day"), { constraint: (f) => [rn(f.launch.day, xn(f) - 1e-3), ln(f.launch.day, 120)] }).onDrop((f) => Y(f)));
      return (h) => {
        const k = Math.round((h.x - t.x + 22 - a.x0) / a.dayW), f = d?.(h) ?? J(n, { field: "day" }, Math.min(x.max, Math.max(x.min, k)));
        return k < x.min ? { next: f, clampedReason: x.reasons.min, refusal: pn(J(n, { field: "day" }, Math.max(5, k))) ?? void 0 } : { next: f };
      };
    }
    const r = e.slice(7), i = n.cards.findIndex((x) => x.id === r);
    if (i < 0) return null;
    const u = { cardId: r, field: "duration" }, l = fn(n, u), p = n.launch.day, c = N(n, e, t, o, (x, d) => x.vary(d, on("cards", i, "duration"), { constraint: (h) => [rn(h.cards[i].duration, 1), ln(xn(h), p + 1e-3)] }).onDrop((h) => Y(h))), y = a.bars.get(r);
    return (x) => {
      const d = Math.round((x.x - t.x + On(a.narrow) - y.x) / a.dayW), h = Math.min(l.max, Math.max(l.min, d)), k = c?.(x) ?? J(n, u, h);
      return d > l.max ? { next: k, clampedReason: `Launch is day ${p}.`, refusal: pn(J(n, u, Math.min(60, d)), r) ?? l.reasons.max } : d < l.min ? { next: k, clampedReason: l.reasons.min } : { next: k };
    };
  },
  keyEdit: Xt,
  keyChoices: Qt,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on."
};
function bt(n, e, t, s, a, o) {
  const r = yn(n), i = zt(n), u = n.cards[t].laneId, l = (h) => {
    if (!i) return h;
    const k = St(n, h, /* @__PURE__ */ new Set([e]));
    return typeof k == "string" ? h : k;
  }, p = (h) => l(Y(h, r, e)), c = (h) => Z(G(l(h), o).parts, s.map((k) => "card-" + k)), x = (o.narrow ? [u] : n.lanes.map((h) => h.id)).flatMap((h) => nt(n, e, "lag", h === u ? void 0 : h).map((k) => ({ laneId: h, run: k })));
  if (!x.length) return () => n;
  const d = N(n, "card-" + e, a, c, (h, k) => {
    const f = h.closest(x.map(({ laneId: g, run: [v, z] }) => h.vary(
      { ...k, cards: k.cards.map((w, S) => S === t ? { ...w, laneId: g, lag: Math.min(z, Math.max(v, w.lag ?? 0)) } : w) },
      on("cards", t, "lag"),
      { constraint: (w) => [rn(w.cards[t].lag ?? 0, v - 0.49), ln(w.cards[t].lag ?? 0, z + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? h.closest(s.map((g) => h.dropTarget("target-" + g, et(k, e, g)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(f).withBranchTransition(120).onDrop(p) : f.onDrop(p);
  });
  return d ? (h) => p(d(h)) : null;
}
function ne(n, e, t, s, a, o) {
  const r = (f, g) => {
    const v = [];
    for (const z of f) if (g(z)) {
      const w = v.at(-1);
      w && w[1] === z - (f[1] - f[0]) ? w[1] = z : v.push([z, z]);
    }
    return v;
  }, i = (f, g, v) => Array.from({ length: Math.floor((g - f) / v) + 1 }, (z, w) => f + w * v), u = (f, g, v, z, w) => N(n, e, t, o, (S, A) => S.closest(v.map(([L, E]) => S.vary(
    A,
    on(...f),
    { constraint: ($) => [rn(g($), L - 0.49), ln(g($), E + 0.49)] }
  ))).withBranchTransition(100).onDrop((L) => Y(L, z, w))), l = (f, g, v, z) => (w) => {
    const S = g(w), A = v(S), L = f?.(w) ?? (A ? n : z(S));
    return A ? { next: L, clampedReason: A, refusal: A } : { next: L };
  };
  if (e === "handle-launch" || e === "handle-funding") {
    const f = e === "handle-launch", g = (A) => f ? J(n, { field: "day" }, A) : { ...n, hiring: { ...n.hiring, funding: { ...n.hiring.funding, day: A } } }, v = (A) => f && (A < 5 || A > 120) ? "Launch day is a whole day from 5 to 120." : f && bn(n) && A < fn(n, { field: "day" }).min ? pn(g(A)) ?? "Every task ends by " + tt(n) + "." : te(n, g(A)), z = f ? i(5, 120, 1) : i(0, n.hiring.weeks * 7, 1), w = r(z, (A) => !v(A)), S = w.length ? u(f ? ["launch", "day"] : ["hiring", "funding", "day"], (A) => f ? A.launch.day : A.hiring.funding.day, w, 1) : null;
    return l(S, (A) => Math.round((A.x - t.x + 22 - a.x0) / a.dayW), v, g);
  }
  const p = e.slice(7), c = n.cards.findIndex((f) => f.id === p);
  if (c < 0) return null;
  const y = yn(n), x = a.bars.get(p), d = nt(n, p, "duration"), h = d.length ? u(["cards", c, "duration"], (f) => f.cards[c].duration, d, y, p) : null;
  return l(
    h,
    (f) => n.cards[c].duration + Math.round((f.x - t.x + On(a.narrow) - x.x - x.width) / a.dayW),
    (f) => {
      const g = Xn(n, p, { duration: Math.max(y, Math.round(f / y) * y) });
      return typeof g == "string" ? g : null;
    },
    (f) => J(n, { cardId: p, field: "duration" }, f)
  );
}
function te(n, e) {
  const t = n.behaviour ? It(n, e) : null;
  return t && "refused" in t ? t.refused.sentence : null;
}
function ee(n, e, t, s, a, o) {
  const r = n.launch.day, i = (l) => Z(G(l, o).parts, s.map((p) => "card-" + p)), u = N(n, "card-" + e, a, i, (l, p) => {
    const c = o.narrow ? p.lanes.filter((x) => x.id === p.cards[t].laneId) : p.lanes, y = l.closest(c.map((x) => l.vary(
      { ...p, cards: p.cards.map((d, h) => h === t ? { ...d, laneId: x.id, lag: d.lag ?? 0 } : d) },
      on("cards", t, "lag"),
      { constraint: (d) => [rn(d.cards[t].lag ?? 0, -1e-3), ln(xn(d), r + 1e-3)] }
    )));
    return s.length ? l.closest(s.map((x) => l.dropTarget("target-" + x, et(p, e, x)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(y).withBranchTransition(120).onDrop((x) => Y(x)) : y.onDrop((x) => Y(x));
  });
  return u ? (l) => Y(u(l)) : null;
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
      s.push({ name: "column-" + l.id, x: 2, y: u, width: r - 4, height: c, fill: O(o(p), 0.6), line: O(o(p), 0.1) });
      const y = (r - 16) * 0.36;
      s.push({ name: "lane-" + l.id, x: 8, y: u + 6, width: y, height: 36, text: l.label, fill: o(p), fontSize: 15 }), s.push({ name: "caption-" + l.id, x: 8 + y + 6, y: u + 6, width: r - 16 - y - 6, height: 56, text: Bn(n, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), n.cards.filter((x) => x.laneId === l.id).forEach((x, d) => s.push({ name: "card-" + x.id, x: 8, y: u + 72 + d * 64, width: r - 16, height: 56, text: Un(n, x.id), fontSize: 15 })), u += c + 10;
    }), i = u;
  } else {
    const p = 116 + (Math.max(...a) + 1) * 88;
    n.lanes.forEach((c, y) => {
      const x = y * 244;
      s.push({ name: "column-" + c.id, x: x + 2, y: X, width: 240, height: p, fill: O(o(y), 0.6), line: O(o(y), 0.1) }), s.push({ name: "lane-" + c.id, x: x + 8, y: X + 6, width: 228, height: 58, text: c.label, fill: o(y), fontSize: 16 }), s.push({ name: "caption-" + c.id, x: x + 8, y: X + 66, width: 228, height: 48, text: Bn(n, c.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), n.cards.filter((d) => d.laneId === c.id).forEach((d, h) => s.push({ name: "card-" + d.id, x: x + 8, y: X + 116 + h * 88, width: 228, height: 76, text: Un(n, d.id), fontSize: 15 }));
    }), r = n.lanes.length * 244, i = X + p;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: Nt(n), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: s, width: r, height: i };
}
function Un(n, e) {
  const t = n.cards.find((s) => s.id === e);
  return t.amount === void 0 ? t.label + `
no amount yet` : t.label + `
` + U(t.amount, n.forecast.currency);
}
function ie(n, e) {
  const { width: t } = b(n, e.layout), s = n.forecast.target, a = it(n), o = Math.max(s * 1.25, a), r = t - 8, i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: r, h: 14, rx: 7, color: I.track },
    { t: "rect", x: 4, y: 42, w: r * a / o, h: 14, rx: 7, color: i ? I.accept : I.bar },
    { t: "line", x1: 4 + r * s / o, y1: 36, x2: 4 + r * s / o, y2: 62, color: I.ink, width: 2 },
    { t: "text", x: 4 + r * s / o, y: 72, text: "Target " + U(s, n.forecast.currency), color: I.ink, size: 14, anchor: "middle" }
  ];
}
const se = {
  laneCues: !0,
  places: (n, e) => b(n, e),
  notes: (n, e, t, s) => wn(b(n, e).parts, n, t, s),
  editsBetween: Ln,
  layer: (n) => gn(n, ie),
  chooser(n, e, t, s = {}) {
    const a = Gn(n, e).map((o) => Yn(n, e, o.id));
    return a.length < 2 ? null : ot(N(n, "card-" + e, t, (o) => Z(b(o, s).parts), (o, r) => o.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r, { gapIn: 40, gapOut: 56 })), n, e, b(n, s).parts, a);
  },
  refusalAt(n, e, t, s, a) {
    const { parts: o } = b(n, a), r = n.cards.find((i) => i.id === e);
    for (const i of n.lanes) {
      if (i.id === r.laneId || !P(o.find((l) => l.name === "column-" + i.id), s)) continue;
      const u = Lt(n, e, i.id);
      return u ? { laneId: i.id, reason: u } : null;
    }
    return null;
  },
  handleDrag: () => null
}, F = 48, an = 960, ht = 900;
function K(n, e = {}) {
  const t = !!e.narrow, s = n.budget.total, a = [], o = [], r = n.lanes.map((l) => n.cards.filter((p) => p.laneId === l.id).length);
  let i, u;
  if (t) {
    i = Math.max(300, e.width ?? 390);
    let l = F;
    n.lanes.forEach((p, c) => {
      const y = Math.max(100 + (r[c] + 1) * 64, p.allocation / s * ht);
      o.push({ laneId: p.id, start: l, size: y }), l += y;
    }), u = l + 8;
  } else {
    i = an;
    let l = 0;
    for (const p of n.lanes)
      o.push({ laneId: p.id, start: l, size: p.allocation / s * an }), l += p.allocation / s * an;
    u = F + 100 + (Math.max(...r) + 1) * 64;
  }
  return n.lanes.forEach((l, p) => {
    const { start: c, size: y } = o[p], x = en[p % en.length], d = t ? { x: 2, y: c + 1, width: i - 4, height: y - 2 } : { x: c + 1, y: F, width: Math.max(4, y - 2), height: u - F }, h = { x: d.x + 5, y: d.y, width: Math.max(10, d.width - 10) };
    a.push({ name: "column-" + l.id, ...d, fill: O(x, 0.6), line: O(x, 0.1) });
    const k = t ? h.width * 0.36 : h.width;
    if (a.push({ name: "lane-" + l.id, x: h.x, y: h.y + 6, width: k, height: 32, text: l.label, fill: x, fontSize: 15 }), a.push({
      name: "caption-" + l.id,
      x: t ? h.x + k + 6 : h.x,
      y: h.y + (t ? 6 : 40),
      width: t ? h.width - k - 6 : h.width,
      height: t ? 50 : 40,
      text: t ? Fn(n, l.id).replace(" · ", `
`) : Fn(n, l.id),
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
` + U(f.amount, n.budget.currency),
      fontSize: 14
    })), p < n.lanes.length - 1) {
      const f = c + y;
      a.push(t ? { name: "handle-" + l.id, x: i - 96, y: f - 22, width: 88, height: 44 } : { name: "handle-" + l.id, x: f - 22, y: F - 6, width: 44, height: 48 });
    }
  }), { parts: a, width: i, height: u, segments: o, narrow: t };
}
function ae(n, e) {
  const t = K(n, e.layout), s = n.budget.total, a = [{ t: "text", x: 4, y: 28, text: Ht(n), color: I.ink, size: 16, bold: !0, role: "header" }];
  if (n.lanes.forEach((o, r) => {
    const i = t.segments[r], u = o.allocation, l = $t(n, o.id);
    if (t.narrow) {
      const p = i.start + 50, c = 8, y = t.width - 16;
      a.push({ t: "rect", x: c, y: p, w: y, h: 10, rx: 5, color: I.track }), a.push({ t: "rect", x: c, y: p, w: y * l / u || 0, h: 10, rx: 5, color: I.bar }), o.floor !== void 0 && a.push({ t: "line", x1: c + y * o.floor / u, y1: p - 4, x2: c + y * o.floor / u, y2: p + 14, color: I.ink, width: 2 });
    } else {
      const p = an / s, c = F + 86;
      a.push({ t: "rect", x: i.start + 6, y: c, w: i.size - 12, h: 10, rx: 5, color: I.track }), a.push({ t: "rect", x: i.start + 6, y: c, w: Math.max(0, (i.size - 12) * l / u || 0), h: 10, rx: 5, color: I.bar }), o.floor !== void 0 && a.push({ t: "line", x1: i.start + o.floor * p, y1: c - 6, x2: i.start + o.floor * p, y2: c + 16, color: I.ink, width: 2 }), o.cap !== void 0 && i.start + o.cap * p <= t.width && a.push({ t: "line", x1: i.start + o.cap * p, y1: c - 6, x2: i.start + o.cap * p, y2: c + 16, color: I.refuse, width: 2, dash: "3 2" });
    }
    if (r < n.lanes.length - 1) {
      const p = i.start + i.size;
      a.push(t.narrow ? { t: "line", x1: 2, y1: p, x2: t.width - 2, y2: p, color: I.ink, width: 2 } : { t: "line", x1: p, y1: F, x2: p, y2: t.height, color: I.ink, width: 2 }), a.push(t.narrow ? { t: "rect", x: t.width - 68, y: p - 4, w: 32, h: 8, rx: 4, color: I.ink } : { t: "rect", x: p - 4, y: F + 2, w: 8, h: 30, rx: 4, color: I.ink });
    }
  }), e.clamp) {
    const o = t.parts.find((r) => r.name === e.clamp.name);
    o && a.push({
      t: "text",
      x: t.narrow ? 8 : Math.min(Math.max(o.x + 22, 120), t.width - 120),
      y: t.narrow ? o.y + 8 : F - 12,
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
const oe = (n, e) => Math.round(n / e) * e, re = {
  laneCues: !0,
  notes: (n, e, t, s) => wn(K(n, e).parts, n, t, s),
  editsBetween: Ln,
  label: lt,
  places(n, e) {
    const { parts: t, width: s, height: a } = K(n, e);
    return { parts: t, width: s, height: a };
  },
  layer: (n) => gn(n, ae),
  chooser(n, e, t, s = {}) {
    const a = Gn(n, e).map((o) => Yn(n, e, o.id));
    return a.length < 2 ? null : ot(N(n, "card-" + e, t, (o) => Z(K(o, s).parts), (o, r) => o.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r)), n, e, K(n, s).parts, a);
  },
  refusalAt(n, e, t, s, a) {
    const { parts: o } = K(n, a), r = n.cards.find((i) => i.id === e);
    for (const i of n.lanes) {
      if (i.id === r.laneId || !P(o.find((l) => l.name === "column-" + i.id), s)) continue;
      const u = Ct(n, e, i.id);
      return u ? { laneId: i.id, reason: u } : null;
    }
    return null;
  },
  handleDrag(n, e, t, s) {
    const a = e.slice(7), o = n.lanes.findIndex((d) => d.id === a), r = n.lanes[o + 1];
    if (o < 0 || !r) return null;
    const i = Ot(n, { laneId: a }), u = n.budget.step, l = (d) => {
      const h = Math.min(i.max, Math.max(i.min, oe(d, u)));
      return Nn(n, r.id, a, h);
    }, p = K(n, s), c = p.narrow ? ht / n.budget.total : an / n.budget.total, y = p.parts.find((d) => d.name === e), x = N(n, e, t, (d) => Z(K(d, s).parts), (d) => d.varyFunc([0], ([h]) => Nn(n, r.id, a, h), { constraint: (h) => [
      ...kt([i.min, h.lanes[o].allocation - n.lanes[o].allocation, i.max])
    ] }));
    return (d) => {
      const k = (p.narrow ? d.y - t.y - y.y : d.x - t.x - y.x) / c, f = x?.(d), g = f ? f.lanes[o].allocation - n.lanes[o].allocation : k, v = { next: l(g) };
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
}, le = {
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
}, ce = (n) => le[n.role ?? ""] ?? "#fffdf6", D = 64, hn = 8, q = 220, V = 84, Jn = { "do-now": "#d5e9e3", plan: "#dedef4", later: "#f3eee0", skip: "#efd7dc" }, j = (n, e) => n.nest?.layout === "matrix" ? "matrix" : e.narrow ? "outline" : n.nest?.layout ?? "clusters", ut = (n, e) => !e.narrow && !!n.nest?.owners?.length && n.nest?.layout === "tree";
function ft(n) {
  const e = !!n.narrow, t = e ? Math.max(260, Math.min(358, (n.width ?? 358) - 16)) : 560;
  return { narrow: e, size: t, left: e ? 8 : q + 16, top: e ? 56 : V + 26, w: e ? 92 : 136, h: e ? 34 : 44 };
}
function de(n, e, t, s = 0) {
  const a = n.left + e / 10 * n.size, o = n.top + (10 - t) / 10 * n.size;
  return { x: Math.min(n.left + n.size - n.w, Math.max(n.left, a - n.w / 2 + s)), y: Math.min(n.top + n.size - n.h, Math.max(n.top, o - n.h / 2 + s)) };
}
function he(n, e) {
  const t = (s) => Math.max(0, Math.min(10, Math.round(s)));
  return { x: t((e.x + n.w / 2 - n.left) / n.size * 10), y: t(10 - (e.y + n.h / 2 - n.top) / n.size * 10) };
}
function zn(n, e) {
  const t = [], s = (a, o) => {
    t.push({ card: a, depth: o });
    for (const r of W(n, a.id)) s(r, o + 1);
  };
  for (const a of st(n, e)) s(a, 0);
  return t;
}
const jn = Pt;
function B(n, e = {}) {
  const t = j(n, e), { main: s, tray: a } = R(n), o = [], r = (d, h, k, f, g) => {
    o.push({ name: "lane-" + d, x: h, y: k, width: f, height: 40, text: n.lanes.find((v) => v.id === d).label, fill: d === a ? "#e9e5da" : "#d5e9e3", fontSize: 16 }), o.push({ name: "caption-" + d, x: h, y: k + 44, width: f, height: 26, text: g, fill: "transparent", lineWidth: 0, fontSize: 14 });
  }, i = (d) => Dt.caption(n, d), u = (d, h, k, f, g = D) => o.push({ name: "card-" + d.id, x: h, y: k, width: f, height: g, text: jn(n, d), fill: ce(d), fontSize: 14 });
  if (t === "matrix") {
    const d = ft(e), h = at(n), k = (w) => (n.behaviour?.rules ?? []).find((S) => S.on && S.kind === "quadrant" && S.quadrant === w);
    for (const w of Bt) {
      const S = d.left + (w.high[0] ? d.size / 2 : 0), A = d.top + (w.high[1] ? 0 : d.size / 2), L = n.cards.filter(($) => Ft(n, $) === w.id).length, E = k(w.id);
      o.push({ name: "column-q-" + w.id, x: S, y: A, width: d.size / 2, height: d.size / 2, fill: O(Jn[w.id], 0.35), line: O(Jn[w.id], 0.1) }), o.push({
        name: "caption-q-" + w.id,
        x: S + 6,
        y: A + (w.high[1] ? 6 : d.size / 2 - 32),
        width: d.size / 2 - 12,
        height: 26,
        fill: "transparent",
        lineWidth: 0,
        fontSize: d.narrow ? 12 : 14,
        text: w.label + " · " + (E ? L + " of " + E.max : String(L)),
        ...E && L > E.max && { ink: "#c2410c" }
      });
    }
    o.push({ name: "caption-axis-y", x: d.left, y: d.top - 26, width: 200, height: 22, text: "↑ " + h.y.label, fill: "transparent", lineWidth: 0, fontSize: 13 }), o.push({ name: "caption-axis-x", x: d.left + d.size - 200, y: d.top + d.size + 4, width: 200, height: 22, text: h.x.label + " →", fill: "transparent", lineWidth: 0, fontSize: 13 });
    const f = /* @__PURE__ */ new Map();
    for (const w of n.cards) {
      const S = tn(n, w);
      if (!S) continue;
      const A = S.x + ":" + S.y, L = (f.get(A) ?? 0) * 8;
      f.set(A, (f.get(A) ?? 0) + 1);
      const E = de(d, S.x, S.y, L);
      o.push({ name: "card-" + w.id, x: E.x, y: E.y, width: d.w, height: d.h, text: jn(n, w), fill: "#fffdf6", fontSize: d.narrow ? 11 : 13 });
    }
    const g = zn(n, a);
    let v, z;
    if (d.narrow) {
      let w = d.top + d.size + 34;
      r(a, 8, w, d.size, i(a)), w += 76, g.forEach(({ card: S }) => {
        u(S, 8, w, d.size, 40), w += 46;
      }), v = d.size + 16, z = w + 10, o.unshift({ name: "column-" + a, x: 2, y: d.top + d.size + 30, width: v - 4, height: z - d.top - d.size - 30, fill: O("#e9e5da", 0.5), line: O("#e9e5da", 0.1) });
    } else
      r(a, 8, 6, q - 16, i(a)), g.forEach(({ card: w }, S) => u(w, 8, V + S * (D + hn), q - 16)), v = d.left + d.size + 16, z = Math.max(V + Math.max(1, g.length + 1) * (D + hn), d.top + d.size + 34), o.unshift({ name: "column-" + a, x: 2, y: 0, width: q - 4, height: z, fill: O("#e9e5da", 0.5), line: O("#e9e5da", 0.1) });
    return r(s, d.left, d.narrow ? 0 : 6, d.narrow ? d.size : Math.min(d.size, 640), i(s)), o.splice(o.findIndex((w) => w.name === "caption-" + s), 1), o.unshift({ name: "column-" + s, x: d.left - 6, y: (d.narrow, 0), width: d.size + 12, height: d.top + d.size + 30, fill: O("#d5e9e3", 0.75), line: O("#d5e9e3", 0.1) }), { parts: o, width: v, height: z };
  }
  if (t === "outline") {
    const d = Math.max(300, e.width ?? 358);
    let h = 0;
    for (const k of [s, a]) {
      const f = h;
      r(k, 8, h + 6, d - 16, i(k)), h += 82;
      for (const { card: g, depth: v } of zn(n, k))
        u(g, 8 + 20 * v, h, d - 16 - 20 * v, 44), h += 52;
      h += 44, o.unshift({ name: "column-" + k, x: 2, y: f, width: d - 4, height: h - f, fill: O(k === a ? "#e9e5da" : "#d5e9e3", 0.6), line: O("#d5e9e3", 0.1) }), h += 10;
    }
    return { parts: o, width: d, height: h };
  }
  const l = zn(n, a);
  r(a, 8, 6, q - 16, i(a)), l.forEach(({ card: d }, h) => u(d, 8, V + h * (D + hn), q - 16));
  const p = V + Math.max(1, l.length + 1) * (D + hn), c = q + 16;
  let y, x;
  if (t === "clusters") {
    const k = st(n, s);
    let f = V, g = 0;
    k.forEach((v, z) => {
      z && z % 4 === 0 && (f += g + 16, g = 0);
      const w = c + z % 4 * 220;
      let S = f;
      const A = (L, E) => {
        u(L, w + 12 * E, S, 208 - 12 * E, E ? D : 56), S += (E ? D : 56) + 6;
        for (const $ of W(n, L.id)) A($, E + 1);
      };
      A(v, 0), g = Math.max(g, S - f);
    }), y = c + 4 * 220 + 8, x = Math.max(p, f + g + D + 40), r(s, c, 6, Math.min(y - c - 8, 640), i(s));
  } else {
    const h = D + 44, k = ut(n, e) ? n.nest.owners : [], f = V + (k.length ? 64 : 0);
    k.forEach((w, S) => {
      const A = n.cards.filter((L) => L.owner === w.id).length;
      o.push({ name: "caption-owner-" + w.id, x: c + S * 152, y: V - 4, width: 140, height: 52, text: w.label + `
` + A + (A === 1 ? " card" : " cards"), fill: "#f3eee0", fontSize: 14 });
    });
    let g = 0, v = 0;
    const z = (w, S) => {
      v = Math.max(v, S);
      const L = W(n, w.id).map(($) => z($, S + 1)), E = L.length ? (L[0] + L[L.length - 1]) / 2 : g++;
      return u(w, c + E * 192, f + S * h, 176), E;
    };
    for (const w of W(n, null, s)) z(w, 0);
    y = c + Math.max(3, g, k.length * 152 / 192) * 192 + 8, x = Math.max(p, f + (v + 1) * h + 56), r(s, c, 6, Math.min(y - c - 8, 640), i(s));
  }
  return o.unshift(
    { name: "column-" + s, x: c - 6, y: 0, width: y - c + 4, height: x, fill: O("#d5e9e3", 0.75), line: O("#d5e9e3", 0.1) },
    { name: "column-" + a, x: 2, y: 0, width: q - 4, height: x, fill: O("#e9e5da", 0.5), line: O("#e9e5da", 0.1) }
  ), { parts: o, width: y, height: x };
}
function ue(n, e) {
  if (j(n, e.layout) !== "tree") return [];
  const { parts: t } = B(n, e.layout), s = new Map(t.map((a) => [a.name, a]));
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
    if (a.name.startsWith("card-") && !t.has(a.name.slice(5)) && P(a, e)) return a.name.slice(5);
  }
  return null;
}
function En(n, e, t) {
  const s = n.cards.find((a) => a.id === t);
  return s.laneId === R(n).tray ? null : e === "tree" || !s.parentId || n.cards.some((a) => a.parentId === t) ? t : s.parentId;
}
function fe(n, e, t, s, a, o) {
  const r = n.cards.find((c) => c.id === t);
  if (En(n, e, t) === t) return { laneId: r.laneId, under: t, before: null };
  const u = r.parentId ?? null, l = (u ? W(n, u) : W(n, null, r.laneId)).filter((c) => c.id !== o), p = s.y > a.y + a.height / 2;
  return { laneId: r.laneId, under: u, before: p ? l[l.findIndex((c) => c.id === t) + 1]?.id ?? null : t };
}
const pe = (n, e) => n === e || JSON.stringify(n.cards) === JSON.stringify(e.cards);
function me(n, e) {
  const t = [], s = new Set((n.nest?.aliases ?? []).map(([m]) => m));
  for (const [m, M] of e.nest?.aliases ?? [])
    !s.has(m) && n.cards.some((_) => _.id === m) && !e.cards.some((_) => _.id === m) && t.push({ kind: "merge_cards", card: { id: m }, into: { id: M } });
  let a = n;
  if (t.length) {
    const m = nn(n, t);
    "refused" in m || (a = m.workshop);
  }
  const o = new Map(a.cards.map((m) => [m.id, m])), r = /* @__PURE__ */ new Set(), i = [], u = [], l = [], p = [], c = [], y = [], x = [];
  for (const m of e.cards) {
    if (o.has(m.id) || m.parentId || m.role !== "pile") continue;
    const M = e.cards.filter((_) => _.parentId === m.id);
    M.length !== 1 || !o.has(M[0].id) || (i.push({ kind: "start_pile", card: { id: M[0].id }, ...m.label !== "New pile" && { label: m.label } }), r.add(m.id).add(M[0].id));
  }
  for (const m of a.cards) e.cards.some((M) => M.id === m.id) || u.push({ kind: "remove_card", card: { id: m.id } });
  for (const m of e.nest?.fields ?? [])
    (a.nest?.fields ?? []).some((M) => M.id === m.id) || l.push({ kind: "add_field", label: m.label, ...m.currency && { currency: m.currency }, ...m.flag && { flag: !0 } });
  for (const m of e.nest?.fields ?? []) {
    const M = (a.nest?.fields ?? []).find((_) => _.id === m.id);
    M && M.label !== m.label && l.push({ kind: "rename_field", field: m.id, label: m.label });
  }
  for (const m of e.nest?.owners ?? []) (a.nest?.owners ?? []).some((M) => M.id === m.id) || l.push({ kind: "add_owner", label: m.label });
  e.nest && a.nest?.layout !== e.nest.layout && l.push({ kind: "set_layout", layout: e.nest.layout });
  const d = at(e), h = new Set(d ? e.cards.filter((m) => {
    const M = o.get(m.id), _ = tn(e, m);
    if (!_ || r.has(m.id)) return !1;
    const C = M && tn(a, M);
    return !C || C.x !== _.x || C.y !== _.y;
  }).map((m) => m.id) : []), k = [...h].map((m) => {
    const M = tn(e, e.cards.find((_) => _.id === m));
    return { kind: "score_card", card: { id: m }, x: M.x, y: M.y };
  }), f = e.cards.filter((m) => !o.has(m.id) && !r.has(m.id)), g = /* @__PURE__ */ new Set();
  for (; g.size < f.length; ) {
    const m = f.filter((M) => !g.has(M.id) && (!M.parentId || !f.some((_) => _.id === M.parentId) || g.has(M.parentId)));
    if (!m.length) break;
    for (const M of m)
      g.add(M.id), p.push({
        kind: "add_card",
        lane: { id: M.laneId },
        label: M.label,
        ...M.parentId && { under: { id: M.parentId } },
        ...M.role && { role: M.role },
        ...M.source && { source: M.source }
      });
  }
  const v = (m) => {
    let M = 0;
    for (let _ = e.cards.find((C) => C.id === m); _?.parentId && M < 12; _ = e.cards.find((C) => C.id === _.parentId)) M++;
    return M;
  }, z = (m, M) => (M.parentId ? W(m, M.parentId) : W(m, null, M.laneId)).map((_) => _.id), w = e.cards.filter((m) => {
    const M = o.get(m.id);
    if (!M || r.has(m.id) || h.has(m.id)) return !1;
    if (M.parentId !== m.parentId || M.laneId !== m.laneId && !m.parentId) return !0;
    const _ = z(e, m).filter((T) => o.has(T)), C = z(a, M).filter((T) => _.includes(T));
    return _[_.indexOf(m.id) - 1] !== C[C.indexOf(m.id) - 1];
  }), S = new Map(w.map((m) => [m.id, z(e, m).indexOf(m.id)]));
  w.sort((m, M) => v(m.id) - v(M.id) || (m.parentId ?? m.laneId).localeCompare(M.parentId ?? M.laneId) || S.get(M.id) - S.get(m.id));
  for (const m of w) {
    const M = z(e, m), _ = M[M.indexOf(m.id) + 1];
    c.push({ kind: "nest_card", card: { id: m.id }, ...m.parentId ? { under: { id: m.parentId } } : { lane: { id: m.laneId } }, ..._ && { before: { id: _ } } });
  }
  for (const m of e.cards) {
    const M = o.get(m.id);
    !M || r.has(m.id) || (M.label !== m.label && x.push({ kind: "rename_card", card: { id: m.id }, label: m.label }), m.role && M.role !== m.role && y.push({ kind: "set_role", card: { id: m.id }, role: m.role }), m.source && M.source !== m.source && x.push({ kind: "set_source", card: { id: m.id }, source: m.source }));
  }
  for (const m of e.cards) {
    const M = o.get(m.id);
    for (const _ of /* @__PURE__ */ new Set([...Object.keys(M?.fields ?? {}), ...Object.keys(m.fields ?? {})]))
      h.has(m.id) && (_ === d.x.id || _ === d.y.id) || M?.fields?.[_] !== m.fields?.[_] && x.push({ kind: "set_field", card: { id: m.id }, field: _, value: m.fields?.[_] ?? null });
  }
  const A = [], L = (a.behaviour?.rules ?? []).some((m) => m.on && m.kind === "sameOwnerAs" && m.mode === "carry"), E = /* @__PURE__ */ new Map(), $ = (m) => {
    if (E.has(m.id)) return E.get(m.id);
    const M = e.cards.find((C) => C.id === m.parentId), _ = o.has(m.id) ? o.get(m.id).owner : M ? o.has(M.id) ? o.get(M.id).owner : $(M) : void 0;
    return E.set(m.id, _), _;
  };
  e.cards.forEach($);
  for (const m of [...e.cards].sort((M, _) => v(M.id) - v(_.id))) {
    const M = E.get(m.id);
    if (!m.owner || m.owner === M) continue;
    const C = Sn(e, m.id).slice(1).filter((T) => E.get(T) === M && (L || e.cards.find((xt) => xt.id === T).owner === m.owner));
    A.push({ kind: "set_owner", card: { id: m.id }, owner: m.owner, carry: C.map((T) => ({ id: T })) });
    for (const T of [m.id, ...C]) E.set(T, m.owner);
  }
  for (const m of e.lanes) {
    const M = a.lanes.find((_) => _.id === m.id);
    M && M.label !== m.label && x.push({ kind: "rename_lane", lane: { id: m.id }, label: m.label });
  }
  n.title !== e.title && x.push({ kind: "rename_workshop", title: e.title });
  const Cn = [...t, ...i, ...u, ...l, ...p], $n = [...k, ...x, ...A], kn = [...Cn, ...c, ...y, ...$n];
  if (!c.length || !y.length) return kn;
  const Wn = [...Cn, ...y, ...c, ...$n];
  return "refused" in nn(n, kn) && !("refused" in nn(n, Wn)) ? Wn : kn;
}
function pt(n, e, t) {
  if (!ut(n, t)) return null;
  const s = B(n, t).parts.find((a) => a.name.startsWith("caption-owner-") && P(a, e));
  return s ? s.name.slice(14) : null;
}
function xe(n, e, t) {
  const s = /* @__PURE__ */ new Map();
  return (a) => {
    const o = pt(n, a, t);
    if (o) {
      if (!s.has(o)) {
        const r = nn(n, [{ kind: "set_owner", card: { id: e }, owner: o }]);
        s.set(o, "refused" in r ? null : r.workshop);
      }
      return s.get(o);
    }
  };
}
function mt(n, e, t, s, a) {
  const o = ft(a), { parts: r } = B(n, a), i = n.cards.find((x) => x.id === e);
  if (i.laneId !== R(n).tray && P(r.find((x) => x.name === "column-" + R(n).tray), s)) {
    const x = In(n, e, { laneId: R(n).tray, under: null, before: null });
    return x ? { board: x } : null;
  }
  const u = { x: s.x - t.x, y: s.y - t.y };
  if (!P({ x: o.left - o.w / 2, y: o.top - o.h / 2, width: o.size + o.w, height: o.size + o.h }, { x: u.x + o.w / 2, y: u.y + o.h / 2 })) return null;
  const { x: l, y: p } = he(o, u), c = tn(n, i);
  if (c && c.x === l && c.y === p) return { board: n };
  const y = nn(n, [{ kind: "score_card", card: { id: e }, x: l, y: p }]);
  return "refused" in y ? { refused: y.refused.reason } : { board: y.workshop };
}
function ye(n, e, t, s) {
  const a = /* @__PURE__ */ new Map();
  return (o) => {
    const r = Math.round(o.x) + ":" + Math.round(o.y);
    if (!a.has(r)) {
      const i = mt(n, e, t, o, s);
      a.size > 400 && a.clear(), a.set(r, i && "board" in i ? i.board : n);
    }
    return a.get(r);
  };
}
const ge = {
  laneCues: !0,
  places: (n, e) => B(n, e),
  notes: (n, e, t, s) => wn(B(n, e).parts, n, t, s),
  editsBetween: me,
  layer: (n) => gn(n, ue),
  cardKeys: "Right puts it under the card above it, Left takes it out, Up and Down move it among its neighbours.",
  label(n, e) {
    const t = n.cards.find((a) => "card-" + a.id === e);
    if (!t) return null;
    const s = n.cards.find((a) => a.id === t.parentId);
    return t.label + (t.role ? ", " + t.role : "") + (s ? ", under " + s.label : ", in " + n.lanes.find((a) => a.id === t.laneId).label);
  },
  chooser(n, e, t, s = {}) {
    if (j(n, s) === "matrix") return ye(n, e, t, s);
    const a = xe(n, e, s), o = Rt(n, e), r = o.map((h) => h.next), { main: i, tray: u } = R(n), l = n.cards.find((h) => h.id === e), p = j(n, s), c = r.length > 1 ? N(n, "card-" + e, t, (h) => Z(B(h, s).parts), (h, k) => h.closest(r, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(k, { gapIn: 40, gapOut: 56 })) : null, { parts: y } = B(n, s), x = new Set(Sn(n, e));
    let d;
    return (h) => {
      const k = a(h);
      if (k !== void 0) return k ?? n;
      const f = p === "outline" ? null : un(y, h, x);
      if (f) {
        const v = fe(n, p, f, h, y.find((w) => w.name === "card-" + f), e), z = o.find((w) => w.spot.laneId === v.laneId && w.spot.under === v.under && w.spot.before === v.before);
        if (z) return z.next;
      }
      const g = c ? c(h) : n;
      return pe(g, n) ? l.laneId !== u && P(y.find((v) => v.name === "column-" + u), h) ? In(n, e, { laneId: u, under: null, before: null }) ?? n : P(y.find((v) => v.name === "column-" + i), h) && !un(y, h, /* @__PURE__ */ new Set()) ? (d === void 0 && (d = Tt(n, e)), d ?? n) : g : g;
    };
  },
  refusalAt(n, e, t, s, a) {
    const o = j(n, a);
    if (o === "matrix") {
      const x = mt(n, e, t, s, a);
      return x && "refused" in x ? { laneId: R(n).main, reason: x.refused } : null;
    }
    const r = pt(n, s, a);
    if (r) {
      const x = nn(n, [{ kind: "set_owner", card: { id: e }, owner: r }]);
      return "refused" in x ? { laneId: R(n).main, reason: x.refused.reason } : null;
    }
    if (o === "outline") return null;
    const { parts: i } = B(n, a), u = un(i, s, new Set(Sn(n, e))), l = u && En(n, o, u), p = n.cards.find((x) => x.id === e);
    if (!l || l === p.parentId) return null;
    const c = In(n, e, { laneId: R(n).main, under: l, before: null }), y = c && n.behaviour ? Wt(n, c) : null;
    return y && "refused" in y ? { laneId: R(n).main, reason: y.refused.sentence } : null;
  },
  noteUnder(n, e, t) {
    if (j(n, t) === "matrix") return null;
    const s = un(B(n, t).parts, e, /* @__PURE__ */ new Set());
    return s ? En(n, j(n, t), s) : null;
  },
  keyEdit(n, e, t) {
    const s = n.cards.find((l) => "card-" + l.id === e);
    if (!s) return null;
    const a = tn(n, s);
    if (n.nest?.layout === "matrix") {
      const l = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }, [p, c] = l[t.key] ?? [0, 0];
      if (!a || !p && !c) return null;
      const y = a.x + p, x = a.y + c;
      return y < 0 || y > 10 || x < 0 || x > 10 ? null : [{ kind: "score_card", card: { id: s.id }, x: y, y: x }];
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
}, we = { "launch-plan": _n, "hiring-plan": _n, pipeline: se, budget: re, nest: ge };
function _e(n) {
  const e = we[n];
  if (!e) throw new Error(`No board kit for "${n}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return e;
}
function Ee(n) {
  return n < 600 ? { narrow: !0, width: Math.max(300, Math.round(n - 32)) } : {};
}
export {
  Ce as amountLimits,
  $e as amountOf,
  vi as amountRules,
  We as bandOf,
  zi as behaviourEditsBetween,
  Ee as boardLayoutFor,
  Bi as breakDownSample,
  Fn as budgetCaption,
  $t as budgetCommitted,
  Ht as budgetHeader,
  re as budgetKit,
  K as budgetLayout,
  Ot as budgetLimits,
  Ct as budgetRefusal,
  Si as budgetRules,
  Ii as budgetShiftLimits,
  Ai as budgetShiftRefusal,
  Fi as byOrder,
  zt as cascadeStops,
  _i as catalogSamples,
  Wt as checkNest,
  Ni as checkNestMove,
  It as checkTime,
  Qn as clockOf,
  gn as createBoardLayer,
  Re as currencyOf,
  Te as dateName,
  Pe as dayFromWords,
  Mt as dayMap,
  Dn as dayWords,
  De as days,
  Hi as discoveryTreeSample,
  Be as downstreamTasks,
  Ki as extend,
  Fe as extendWorkshopEdits,
  Ne as goLiveSample,
  os as goalsSample,
  lt as handleLabel,
  He as hireLagFor,
  At as hireStarts,
  Ke as hiringPlanRules,
  qe as hiringPlanSample,
  St as holdOthers,
  rs as impactEffortSample,
  qi as incidentReviewSample,
  Vi as isOrderKey,
  ls as isOrgChart,
  sn as isoAt,
  Ve as isoTime,
  _e as kitFor,
  xn as launchFinish,
  bn as launchHard,
  Ue as launchIndex,
  G as launchLayout,
  Zn as launchLinkRefusal,
  rt as launchLinkTargets,
  pn as launchOverrun,
  Je as launchPlanCaption,
  _n as launchPlanKit,
  fn as launchPlanLimits,
  je as launchPlanRefusal,
  Ge as launchPlanRules,
  Ye as launchPlanSample,
  Ze as launchTaskText,
  I as layerInk,
  nt as legalRuns,
  tt as lineWord,
  U as money,
  Qe as monthNames,
  Ui as nestAlias,
  R as nestAreas,
  at as nestAxes,
  Pt as nestCardText,
  Ji as nestDepth,
  ji as nestDrags,
  me as nestEditsBetween,
  Tt as nestEmptyDrop,
  Gi as nestFamily,
  W as nestKids,
  ge as nestKit,
  B as nestLayout,
  Rt as nestLegal,
  Yi as nestMeasure,
  Zi as nestMeasureWords,
  In as nestPlace,
  Bt as nestQuadrants,
  st as nestRoots,
  Dt as nestRules,
  tn as nestScores,
  Qi as nestSentence,
  Sn as nestSubtree,
  Xe as nextCardId,
  be as nextMonday,
  ni as noteNumbers,
  Pn as offsetOf,
  Xi as orderBetween,
  bi as orderKeys,
  ti as ownField,
  wn as partNotes,
  vt as pastTheLine,
  Bn as pipelineCaption,
  it as pipelineForecast,
  Nt as pipelineGauge,
  se as pipelineKit,
  b as pipelineLayout,
  Ei as pipelineLimits,
  Lt as pipelineRefusal,
  Li as pipelineRules,
  Oi as planBudgetMove,
  ei as planDrags,
  ii as planEdit,
  si as planFixed,
  ai as planLaunchPlanMove,
  Ci as planPipelineMove,
  oi as planProblem,
  ri as planWords,
  li as presetRules,
  Ft as quadrantOf,
  ci as readClock,
  di as readNoteNumbers,
  ns as registerNestPlus,
  hi as renamedNumbers,
  Kn as renderLayerShapes,
  cs as reorgSample,
  $i as restoreWorkshop,
  ts as roleOf,
  ui as runwayCap,
  fi as runwayHeader,
  _t as runwayMonths,
  Et as runwayWords,
  Wi as sampleBudget,
  pi as sampleLaunchPlan,
  Ri as samplePipeline,
  mn as scheduleLaunch,
  ds as scoreBoard,
  hs as scoresIn,
  Nn as shiftBudget,
  Q as shortDate,
  yn as snapStep,
  es as sortEvidenceSample,
  is as tidyKeys,
  mi as timeFamily,
  xi as timeRuleKindIds,
  yi as timeSentence,
  Xn as tryTask,
  Ti as validateBudget,
  gi as validateHiringPlan,
  wi as validateLaunchPlan,
  ss as validateNest,
  Pi as validatePipeline,
  Tn as weekdayAt,
  ki as weekendAt,
  et as withLink,
  J as withTaskValue,
  Ln as workshopEditsBetween
};
