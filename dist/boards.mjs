import { Vec2 as ct, getElementPositionCheap as Ft, translate as Dt, dragSpecToBehavior as Nt, param as V, moreThan as K, lessThan as G, inOrder as It } from "./dragology.mjs";
import { laneColors as D, workshopDestinations as Mt, workshopCandidate as vt } from "./workshop-model.mjs";
import { m as W, G as St, I as j, _ as R, Z as X, Q as q, u as Ht, v as Lt, X as b, z as zt, V as Ct, a5 as Vt, C as Tt, W as Kt, a0 as Gt, T as $t, a3 as Jt, R as Q, $ as Et, w as ht, j as dt, s as _, f as I, a6 as Ut, ac as Yt, ad as Zt, U as ut } from "./plans-BI5v9TGn.mjs";
import { a as Rn, d as On, a8 as Pn, c as _n, p as Bn, t as Fn, ag as Dn, Y as Nn, P as In, g as Hn, a7 as Vn, ab as Kn, h as Gn, i as Jn, S as Un, H as Yn, F as Zn, N as jn, l as Xn, J as qn, e as Qn, n as bn, q as te, b as ne, o as ee, B as ie, M as ae, y as se, E as oe, x as re, A as le, L as ce, O as he, af as de, r as ue, ae as fe, aa as xe, K as me, a4 as pe, a2 as ge, a1 as ye, a9 as we, D as ke, k as Me } from "./plans-BI5v9TGn.mjs";
import Y from "react";
import { pipelineForecast as Wt, pipelineRefusal as jt, pipelineCaption as ft, budgetLimits as Xt, budgetRefusal as qt, budgetCaption as xt, shiftBudget as mt, budgetCommitted as Qt } from "./workshop-rules.mjs";
import { amountRules as Se, behaviourEditsBetween as Le, budgetRules as ze, budgetShiftLimits as Ce, budgetShiftRefusal as Te, catalogSamples as $e, pipelineLimits as Ee, pipelineRules as We, planBudgetMove as Ae, planPipelineMove as Re, restoreWorkshop as Oe, sampleBudget as Pe, samplePipeline as _e, validateBudget as Be, validatePipeline as Fe } from "./workshop-rules.mjs";
const w = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, it = "http://www.w3.org/2000/svg", pt = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function $(t, i, n) {
  const a = document.createElementNS(it, t);
  for (const [s, o] of Object.entries(i)) a.setAttribute(s, String(o));
  return n?.fill && (a.setAttribute("fill", pt(n.fill)), a.style.setProperty("fill", n.fill)), n?.stroke && (a.setAttribute("stroke", pt(n.stroke)), a.style.setProperty("stroke", n.stroke)), a;
}
function gt(t, i, n, a) {
  const s = typeof document < "u" ? document.activeElement : null, o = s && t.contains(s) ? s.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const l = [];
  for (const e of i)
    if (e.t === "line")
      t.appendChild($("line", {
        x1: e.x1,
        y1: e.y1,
        x2: e.x2,
        y2: e.y2,
        "stroke-width": e.width ?? 1,
        ...e.dash ? { "stroke-dasharray": e.dash } : {}
      }, { stroke: e.color }));
    else if (e.t === "rect")
      t.appendChild($("rect", {
        x: e.x,
        y: e.y,
        width: Math.max(0, e.w),
        height: Math.max(0, e.h),
        rx: e.rx ?? 0,
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const h = $("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      e.lines && e.lines.length > 1 ? e.lines.forEach((r, u) => {
        const c = $("tspan", { x: e.x, dy: u ? e.lineHeight ?? Math.round((e.size ?? 13) * 1.25) : 0 });
        c.textContent = u < e.lines.length - 1 ? r + " " : r, h.appendChild(c);
      }) : h.textContent = e.text, t.appendChild(h);
    } else {
      if (e.unlink && n) {
        const { cardId: h, waitsOn: r, label: u } = e.unlink, c = r + ">" + h, p = a?.armed === c, x = $("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": c,
          "aria-label": p ? u + ". Tap again to remove it." : u,
          role: "button",
          tabindex: 0,
          ...p ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: p ? w.refuse : "transparent" });
        let m = !1;
        x.addEventListener("pointerdown", (d) => {
          d.stopPropagation(), m = d.pointerType === "touch" || d.pointerType === "pen";
        }), x.addEventListener("click", (d) => {
          if (d.stopPropagation(), m && a && a.armed !== c) {
            a.arm(c);
            return;
          }
          a?.arm(null), n(h, r);
        }), x.addEventListener("keydown", (d) => {
          d.key !== "Enter" && d.key !== " " || (d.preventDefault(), d.stopPropagation(), n(h, r));
        }), x.addEventListener("focus", () => {
          x.style.setProperty("stroke", w.accept), x.setAttribute("opacity", "0.35");
        }), x.addEventListener("blur", () => {
          p || (x.style.setProperty("stroke", "transparent"), x.removeAttribute("opacity"));
        }), t.appendChild(x), l.push(x);
      }
      if (t.appendChild($("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: h, y: r, angle: u } = e.arrow;
        t.appendChild($("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${h} ${r}) rotate(${u})`, "pointer-events": "none" }, { fill: e.color }));
      }
      if (e.unlink && a?.armed === e.unlink.waitsOn + ">" + e.unlink.cardId && e.arrow) {
        const h = $("text", {
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
    draw(u, c, p) {
      if (o || !n) return;
      l = [u, c, p];
      const { origin: x } = p, m = i(c ?? u, p, u), d = (g) => g.t === "text" && (g.role === "clamp" || g.role === "refusal");
      for (const g of [a, s]) g.setAttribute("transform", `translate(${x.x} ${x.y})`);
      gt(a, m.filter((g) => !d(g)), p.onUnlink, h), gt(s, m.filter(d));
      const y = p.above && p.above.parentNode === n ? p.above : null, f = y ? y.nextSibling : n.firstChild;
      (a.parentNode !== n || a.previousSibling !== y) && n.insertBefore(a, f === a ? a.nextSibling : f), s.firstChild && n.lastChild !== s ? n.appendChild(s) : !s.firstChild && s.parentNode && s.remove();
    },
    destroy() {
      o = !0, clearTimeout(e), a.remove(), s.remove();
    }
  };
  return r;
}
function N(t, i = []) {
  const n = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return Y.createElement(
    "g",
    null,
    ...n.map((a) => /* @__PURE__ */ Y.createElement("g", { id: a.name, transform: Dt(a.x, a.y) }, /* @__PURE__ */ Y.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ Y.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
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
  if (!Ft(e, t) || !o) return null;
  const h = Nt(s(o, t), e);
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
function z(t, i) {
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
function bt(t) {
  const i = t.forecast?.currency;
  return `Forecast ${W(Wt(t), i)} of ${W(t.forecast?.target ?? 0, i)}`;
}
function tn(t) {
  return `${W(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Rt(t, i) {
  return t.cards.filter((n) => St(t, i, n.id) === null).map((n) => n.id);
}
function nn(t, i, n, a) {
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
      fontSize: nn(r, e.fontSize ?? l, e.width - 12, e.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Ot(t, i) {
  const n = i.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const a = t.cards.find((o) => o.id === n);
  if (a) return `${a.label} length, ${a.duration} days. Left and Right change it.`;
  const s = t.lanes.findIndex((o) => o.id === n);
  return s >= 0 && t.lanes[s + 1] ? `Divider between ${t.lanes[s].label} and ${t.lanes[s + 1].label}. Left and Right move money.` : null;
}
const Pt = "#c2410c", en = 32, an = 44, lt = (t) => t ? 0 : 22;
function O(t, i = {}) {
  const n = !!i.narrow, a = t.kind === "hiring-plan", s = q(t), o = a ? t.hiring.weeks * 7 : Ct(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), l = Vt(t), e = [], h = /* @__PURE__ */ new Map(), r = n ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), u = n ? 8 : 168, c = n ? (r - 88) / o : (r - u - 40) / o, p = (f) => D[t.lanes.findIndex((g) => g.id === f) % D.length], x = (f, g) => {
    const k = t.cards.find((S) => S.id === f), M = s.get(f), v = { x: u + M.from * c, y: g, width: (M.to - M.from) * c, height: n ? an : en };
    h.set(f, v);
    const L = l.has(f);
    e.push({
      name: "card-" + f,
      ...v,
      text: n ? "" : a ? k.label : `${k.label} · ${k.duration}d`,
      fill: L ? "#fde3d7" : n ? p(k.laneId) : a ? z(p(k.laneId), 0.45) : "#fffdf6",
      line: L || M.critical && !a ? Pt : "#667872",
      lineWidth: L || M.critical && !a ? 2.5 : 1,
      fontSize: 13
    }), a && n || e.push({ name: "handle-" + f, x: v.x + v.width - lt(n), y: v.y + v.height / 2 - 22, width: 44, height: 44 });
  };
  let m, d, y;
  if (n) {
    const f = (r - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((g, k) => {
      const M = 8 + k * (f + 8);
      e.push({ name: "column-" + g.id, x: M, y: 30, width: f, height: 72, fill: z(p(g.id), 0.6), line: z(p(g.id), 0.1) }), e.push({ name: "lane-" + g.id, x: M + 4, y: 34, width: f - 8, height: 28, text: g.label, fill: p(g.id), fontSize: 14 }), e.push({ name: "caption-" + g.id, x: M + 4, y: 64, width: f - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), y = 124, d = 130, m = 138;
    for (const g of t.cards)
      x(g.id, m + 20), m += 64;
  } else {
    y = 48, d = 56, m = d;
    for (const f of t.lanes) {
      const g = t.cards.filter((M) => M.laneId === f.id), k = Math.max(92, g.length * 44 + 20);
      e.push({ name: "column-" + f.id, x: 0, y: m, width: r, height: k, fill: z(p(f.id), 0.65), line: z(p(f.id), 0.1) }), e.push({ name: "lane-" + f.id, x: 8, y: m + 8, width: u - 24, height: 32, text: f.label, fill: p(f.id), fontSize: 15 }), e.push({ name: "caption-" + f.id, x: 8, y: m + 44, width: u - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), g.forEach((M, v) => x(M.id, m + 10 + v * 44)), m += k + 4;
    }
  }
  return a ? t.hiring.funding && !n && e.push({ name: "handle-funding", x: u + t.hiring.funding.day * c - 22, y: 4, width: 44, height: 44 }) : e.push({ name: "handle-launch", x: u + t.launch.day * c - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: e, width: r, height: m + 8, narrow: n, x0: u, dayW: c, gridTop: d, axisY: y, bars: h };
}
function sn(t, i, n) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = n(a.name.slice(8)));
  return i;
}
function on(t, i) {
  const n = t.x + t.width, a = Math.max(t.x + 4, n - 10), o = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, l = i.y + i.height / 2;
  return { d: `M ${a} ${o} V ${l} H ${i.x}`, arrow: { x: i.x, y: l, angle: 0 } };
}
function rn(t, i) {
  const n = O(t, i.layout), a = t.kind === "hiring-plan", s = q(t), o = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), l = Lt(t), e = [];
  if (l?.workdays)
    for (let c = 0; c < o; c++) ht(l.origin, c) === 6 && e.push({ t: "rect", x: n.x0 + c * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: w.track, opacity: 0.7 });
  for (const c of t.behaviour?.rules ?? []) if (l && c.on && c.kind === "blackout") {
    const p = dt(l.origin, c.start), x = dt(l.origin, c.end) + 1, m = n.x0 + Math.max(0, p) * n.dayW, d = (Math.min(o, x) - Math.max(0, p)) * n.dayW;
    if (d <= 0) continue;
    e.push({ t: "rect", x: m, y: n.gridTop, w: d, h: n.height - 8 - n.gridTop, color: w.refuse, opacity: 0.12 });
    for (let y = m; y < m + d; y += 10) e.push({ t: "line", x1: y, y1: n.gridTop, x2: Math.min(m + d, y + 10), y2: n.gridTop + 10, color: w.refuse, width: 0.6 });
    e.push({ t: "text", x: m + 3, y: n.gridTop + 22, text: c.label + " · " + _(c.start) + "–" + _(c.end), color: w.refuse, size: 11, bold: !0 });
  }
  for (let c = 0; c <= o; c++) {
    const p = n.x0 + c * n.dayW, x = l ? ht(l.origin, c) === 1 : c % 7 === 0;
    if (!x && n.dayW < 6) continue;
    e.push({ t: "line", x1: p, y1: n.gridTop, x2: p, y2: n.height - 8, color: x ? w.week : w.faint, width: x ? 1 : 0.5 });
    const m = a && l && I(l.origin, c).slice(8) <= "07" && x, d = l ? a ? m ? _(I(l.origin, c)).replace(/^\d+ /, "") : "" : _(I(l.origin, c)) : (n.narrow ? "W" : "Week ") + (c / 7 + 1);
    x && d && (!l || a || n.dayW * 7 > 44) && e.push({ t: "text", x: p + 3, y: n.axisY, text: d, color: w.ink, size: 12 });
  }
  for (const c of t.cards) {
    for (const m of c.dependsOn ?? []) {
      const d = n.bars.get(m), y = n.bars.get(c.id);
      if (!d || !y) continue;
      const f = s.get(m).critical && s.get(c.id).critical, g = t.cards.find((k) => k.id === m).label;
      e.push({
        t: "path",
        ...on(d, y),
        color: f ? Pt : w.ink,
        width: f ? 2 : 1.5,
        unlink: { cardId: c.id, waitsOn: m, label: `Remove the link: ${c.label} waits on ${g}` }
      });
    }
    const p = s.get(c.id), x = n.bars.get(c.id);
    if (a) {
      const m = t.hiring.bands.find((f) => f.id === c.band), d = x.x + x.width, y = n.x0 + o * n.dayW;
      y > d && e.push({ t: "rect", x: d, y: x.y + x.height / 2 - 3, w: y - d, h: 6, rx: 3, color: w.bar, opacity: 0.45 }), e.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(d + 6, y - 120),
        y: n.narrow ? x.y - 6 : x.y + x.height / 2 - 6,
        text: (n.narrow ? c.label + " · " : "") + "starts " + _(I(l.origin, Ut(t, c.id))) + (m ? " · " + W(m.monthly, t.hiring.currency) + "/mo" : ""),
        color: w.ink,
        size: 12,
        role: "start-" + c.id
      });
      continue;
    }
    n.narrow && e.push({ t: "text", x: 8, y: x.y - 6, text: `${c.label} · ${c.duration}d`, color: w.ink, size: 13, bold: p.critical }), p.critical || e.push({ t: "text", x: x.x + x.width + (n.narrow ? 48 : 24), y: x.y + x.height / 2 + 4, text: "+" + p.slack + "d", color: w.ink, size: 12, role: "slack-" + c.id });
  }
  if (a) {
    const c = Yt(t), p = t.behaviour?.rules.find((d) => d.on && d.kind === "deadline"), x = p && p.kind === "deadline" && c < p.floor;
    e.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + Zt(c),
      color: x || i.refused ? w.refuse : w.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const m = t.hiring.funding;
    if (m && m.day <= o) {
      const d = n.x0 + m.day * n.dayW;
      e.push({ t: "line", x1: d, y1: 26, x2: d, y2: n.height - 8, color: w.accept, width: 2, dash: "6 4" }), n.narrow || e.push({ t: "rect", x: d - 4, y: 26, w: 8, h: 18, rx: 4, color: w.accept }), e.push({ t: "text", x: Math.max(d + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + W(m.amount, t.hiring.currency) + " · " + _(I(l.origin, m.day)), color: w.accept, size: 12, bold: !0 });
    }
    if (n.narrow && e.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: w.ink, size: 12 }), i.clamp) {
      const d = n.parts.find((y) => y.name === i.clamp.name);
      d && e.push(...wt(n, e, i.clamp.text, d, i.view));
    }
    return e;
  }
  const h = n.x0 + t.launch.day * n.dayW;
  e.push({ t: "line", x1: h, y1: n.narrow ? 112 : 26, x2: h, y2: n.height - 8, color: w.launch, width: 2, dash: "6 4" }), e.push({ t: "rect", x: h - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: w.launch });
  for (const c of t.cards) {
    const p = n.bars.get(c.id);
    e.push({ t: "rect", x: p.x + p.width + (n.narrow ? 4 : -5), y: p.y + 4, w: n.narrow ? 6 : 4, h: p.height - 8, rx: 2, color: w.ink, opacity: 0.55 });
  }
  const r = Q(t), u = Math.max(0, ...[...s.values()].map((c) => c.to));
  if (e.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: l ? "Done " + ut(t, Math.ceil(u) - 1) + " · " + $t(t) + " " + ut(t, t.launch.day) : `Done day ${r} · launch day ${t.launch.day}`,
    color: i.refused ? w.refuse : w.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const c = n.parts.find((p) => p.name === i.clamp.name);
    c && e.push(...wt(n, e, i.clamp.text, c, i.view));
  }
  return e;
}
const Z = 13, yt = 16, _t = (t, i) => t * (i ? 0.64 : 0.6), ln = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function cn(t) {
  const i = t.size ?? 13, n = t.text.length * _t(i, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - i, w: n, h: i * 1.3 };
}
function hn(t, i) {
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
    f.t === "text" ? o.push(cn(f)) : f.t === "rect" && o.push({ x: f.x - 2, y: f.y - 2, w: f.w + 4, h: f.h + 4 });
  let l = t.narrow ? 6 : t.x0 + 2, e = t.width - 4, h = t.gridTop + 2, r = t.height - 6;
  s && Math.min(e, s.x + s.width - 8) - Math.max(l, s.x + 8) >= 160 && (l = Math.max(l, s.x + 8), e = Math.min(e, s.x + s.width - 8), Math.min(r, s.y + s.height - 8) - Math.max(h, s.y + 8) >= 40 && (h = Math.max(h, s.y + 8), r = Math.min(r, s.y + s.height - 8)));
  const u = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, c = JSON.stringify([n, u, l, e, h, r, o.map((f) => [f.x, f.y, f.w, f.h].map(Math.round))]);
  if (nt?.key === c) return nt.shapes;
  const p = _t(Z, !0), x = Math.floor((e - l) / p), m = /* @__PURE__ */ new Map();
  for (const f of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const g = hn(n, Math.max(8, Math.floor(x * f)));
    g.length <= 4 && m.set(g.join(`
`), g);
  }
  let d = null;
  for (const f of m.values()) {
    const g = Math.max(...f.map((M) => M.length)) * p, k = f.length * yt + 2;
    if (!(g > e - l))
      for (let M = h; M + k <= r; M += 3)
        for (let v = l; v + g <= e; v += 6) {
          const L = { x: v, y: M, w: g, h: k }, S = Math.max(L.x - u.x, 0, u.x - (L.x + L.w)), T = Math.max(L.y - u.y, 0, u.y - (L.y + L.h)), J = Math.hypot(S, T) + (f.length - 1) * 24;
          d && J >= d.score || o.every((U) => ln(L, U)) && (d = { box: L, lines: f, score: J });
        }
  }
  const y = d ? [{ t: "text", x: d.box.x, y: d.box.y + Z - 1, text: n, lines: d.lines, lineHeight: yt, color: w.refuse, size: Z, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: n,
    color: w.refuse,
    size: Z,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return nt = { key: c, shapes: y }, y;
}
const P = (t, i = 1, n) => {
  const a = (o, l) => Math.round(o / l) * l, s = { ...t, cards: t.cards.map((o) => {
    const l = o.id === n ? i : 1, e = { ...o, duration: Math.max(l, a(o.duration, l)), lag: Math.max(0, a(o.lag ?? 0, l)) };
    return e.lag || delete e.lag, e;
  }) };
  return t.launch && (s.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (s.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), s;
}, et = (t) => !!t.behaviour || t.kind === "hiring-plan";
function dn(t, i, n) {
  if (n !== "l" && n !== "L") return null;
  const a = /^card-(.+)$/.exec(i), s = a && t.cards.find((e) => e.id === a[1]);
  if (!s) return null;
  const o = (e) => t.cards.find((h) => h.id === e)?.label ?? e, l = [
    ...Rt(t, s.id).map((e) => ({
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
function un(t, i, { key: n, shiftKey: a }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = (n === "ArrowLeft" ? -1 : 1) * b(t);
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
  label: Ot,
  places(t, i) {
    const n = sn(t, O(t, i), (a) => {
      const s = t.cards.filter((l) => l.laneId === a), o = q(t);
      return t.kind === "hiring-plan" ? s.length + (s.length === 1 ? " hire" : " hires") : `${s.length} ${s.length === 1 ? "task" : "tasks"} · ${s.filter((l) => o.get(l.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => st(t, rn),
  chooser(t, i, n, a = {}) {
    const s = t.cards.findIndex((o) => o.id === i);
    return s < 0 ? null : t.kind === "hiring-plan" && a.narrow ? () => t : (et(t) ? fn : pn)(t, i, s, Rt(t, i), n, a);
  },
  refusalAt(t, i, n, a, s) {
    const o = O(t, s);
    for (const r of t.cards) {
      if (r.id === i || !tt(o.bars.get(r.id), a)) continue;
      const u = St(t, i, r.id);
      return u ? { laneId: r.laneId, reason: u } : null;
    }
    const l = t.cards.find((r) => r.id === i), e = (l.lag ?? 0) + Math.round((a.x - n.x - o.bars.get(i).x) / o.dayW);
    if (et(t)) {
      const r = q(t).get(i), u = Math.round(r.from + (a.x - n.x - o.bars.get(i).x) / o.dayW), c = (l.lag ?? 0) + Ht(Lt(t)).idx(u) - r.start, p = b(t), x = zt(t, i, { lag: Math.max(0, Math.round(c / p) * p) });
      return typeof x == "string" ? { laneId: l.laneId, reason: x, lands: !0 } : null;
    }
    const h = j(t, { cardId: i, field: "lag" });
    return e > h.max ? { laneId: l.laneId, reason: X(R(t, { cardId: i, field: "lag" }, e), i) ?? h.reasons.max } : null;
  },
  handleDrag(t, i, n, a) {
    const s = O(t, a), o = (x) => N(O(x, a).parts);
    if (t.kind === "hiring-plan" && a.narrow) return null;
    if (et(t)) return xn(t, i, n, a, s, o);
    if (i === "handle-launch") {
      const x = j(t, { field: "day" }), m = A(t, i, n, o, (d, y) => d.vary(y, V("launch", "day"), { constraint: (f) => [K(f.launch.day, Q(f) - 1e-3), G(f.launch.day, 120)] }).onDrop((f) => P(f)));
      return (d) => {
        const y = Math.round((d.x - n.x + 22 - s.x0) / s.dayW), f = m?.(d) ?? R(t, { field: "day" }, Math.min(x.max, Math.max(x.min, y)));
        return y < x.min ? { next: f, clampedReason: x.reasons.min, refusal: X(R(t, { field: "day" }, Math.max(5, y))) ?? void 0 } : { next: f };
      };
    }
    const l = i.slice(7), e = t.cards.findIndex((x) => x.id === l);
    if (e < 0) return null;
    const h = { cardId: l, field: "duration" }, r = j(t, h), u = t.launch.day, c = A(t, i, n, o, (x, m) => x.vary(m, V("cards", e, "duration"), { constraint: (d) => [K(d.cards[e].duration, 1), G(Q(d), u + 1e-3)] }).onDrop((d) => P(d))), p = s.bars.get(l);
    return (x) => {
      const m = Math.round((x.x - n.x + lt(s.narrow) - p.x) / s.dayW), d = Math.min(r.max, Math.max(r.min, m)), y = c?.(x) ?? R(t, h, d);
      return m > r.max ? { next: y, clampedReason: `Launch is day ${u}.`, refusal: X(R(t, h, Math.min(60, m)), l) ?? r.reasons.max } : m < r.min ? { next: y, clampedReason: r.reasons.min } : { next: y };
    };
  },
  keyEdit: un,
  keyChoices: dn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on."
};
function fn(t, i, n, a, s, o) {
  const l = b(t), e = Kt(t), h = t.cards[n].laneId, r = (d) => {
    if (!e) return d;
    const y = Gt(t, d, /* @__PURE__ */ new Set([i]));
    return typeof y == "string" ? d : y;
  }, u = (d) => r(P(d, l, i)), c = (d) => N(O(r(d), o).parts, a.map((y) => "card-" + y)), x = (o.narrow ? [h] : t.lanes.map((d) => d.id)).flatMap((d) => Tt(t, i, "lag", d === h ? void 0 : d).map((y) => ({ laneId: d, run: y })));
  if (!x.length) return () => t;
  const m = A(t, "card-" + i, s, c, (d, y) => {
    const f = d.closest(x.map(({ laneId: g, run: [k, M] }) => d.vary(
      { ...y, cards: y.cards.map((v, L) => L === n ? { ...v, laneId: g, lag: Math.min(M, Math.max(k, v.lag ?? 0)) } : v) },
      V("cards", n, "lag"),
      { constraint: (v) => [K(v.cards[n].lag ?? 0, k - 0.49), G(v.cards[n].lag ?? 0, M + 0.49)] }
    ))).withBranchTransition(100);
    return a.length ? d.closest(a.map((g) => d.dropTarget("target-" + g, Et(y, i, g)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(f).withBranchTransition(120).onDrop(u) : f.onDrop(u);
  });
  return m ? (d) => u(m(d)) : null;
}
function xn(t, i, n, a, s, o) {
  const l = (f, g) => {
    const k = [];
    for (const M of f) if (g(M)) {
      const v = k.at(-1);
      v && v[1] === M - (f[1] - f[0]) ? v[1] = M : k.push([M, M]);
    }
    return k;
  }, e = (f, g, k) => Array.from({ length: Math.floor((g - f) / k) + 1 }, (M, v) => f + v * k), h = (f, g, k, M, v) => A(t, i, n, o, (L, S) => L.closest(k.map(([T, J]) => L.vary(
    S,
    V(...f),
    { constraint: (U) => [K(g(U), T - 0.49), G(g(U), J + 0.49)] }
  ))).withBranchTransition(100).onDrop((T) => P(T, M, v))), r = (f, g, k, M) => (v) => {
    const L = g(v), S = k(L), T = f?.(v) ?? (S ? t : M(L));
    return S ? { next: T, clampedReason: S, refusal: S } : { next: T };
  };
  if (i === "handle-launch" || i === "handle-funding") {
    const f = i === "handle-launch", g = (S) => f ? R(t, { field: "day" }, S) : { ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: S } } }, k = (S) => f && (S < 5 || S > 120) ? "Launch day is a whole day from 5 to 120." : f && Ct(t) && S < j(t, { field: "day" }).min ? X(g(S)) ?? "Every task ends by " + $t(t) + "." : mn(t, g(S)), M = f ? e(5, 120, 1) : e(0, t.hiring.weeks * 7, 1), v = l(M, (S) => !k(S)), L = v.length ? h(f ? ["launch", "day"] : ["hiring", "funding", "day"], (S) => f ? S.launch.day : S.hiring.funding.day, v, 1) : null;
    return r(L, (S) => Math.round((S.x - n.x + 22 - s.x0) / s.dayW), k, g);
  }
  const u = i.slice(7), c = t.cards.findIndex((f) => f.id === u);
  if (c < 0) return null;
  const p = b(t), x = s.bars.get(u), m = Tt(t, u, "duration"), d = m.length ? h(["cards", c, "duration"], (f) => f.cards[c].duration, m, p, u) : null;
  return r(
    d,
    (f) => t.cards[c].duration + Math.round((f.x - n.x + lt(s.narrow) - x.x - x.width) / s.dayW),
    (f) => {
      const g = zt(t, u, { duration: Math.max(p, Math.round(f / p) * p) });
      return typeof g == "string" ? g : null;
    },
    (f) => R(t, { cardId: u, field: "duration" }, f)
  );
}
function mn(t, i) {
  const n = t.behaviour ? Jt(t, i) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function pn(t, i, n, a, s, o) {
  const l = t.launch.day, e = (r) => N(O(r, o).parts, a.map((u) => "card-" + u)), h = A(t, "card-" + i, s, e, (r, u) => {
    const c = o.narrow ? u.lanes.filter((x) => x.id === u.cards[n].laneId) : u.lanes, p = r.closest(c.map((x) => r.vary(
      { ...u, cards: u.cards.map((m, d) => d === n ? { ...m, laneId: x.id, lag: m.lag ?? 0 } : m) },
      V("cards", n, "lag"),
      { constraint: (m) => [K(m.cards[n].lag ?? 0, -1e-3), G(Q(m), l + 1e-3)] }
    )));
    return a.length ? r.closest(a.map((x) => r.dropTarget("target-" + x, Et(u, i, x)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(p).withBranchTransition(120).onDrop((x) => P(x)) : p.onDrop((x) => P(x));
  });
  return h ? (r) => P(h(r)) : null;
}
const B = 76;
function F(t, i = {}) {
  const n = !!i.narrow, a = [], s = t.lanes.map((h) => t.cards.filter((r) => r.laneId === h.id).length), o = (h) => t.lanes[h].role === "won" ? "#bfe3cf" : t.lanes[h].role === "lost" ? "#e4dcdc" : D[h % D.length];
  let l, e;
  if (n) {
    l = Math.max(300, i.width ?? 390);
    let h = B;
    t.lanes.forEach((r, u) => {
      const c = 96 + (s[u] + 1) * 64;
      a.push({ name: "column-" + r.id, x: 2, y: h, width: l - 4, height: c, fill: z(o(u), 0.6), line: z(o(u), 0.1) });
      const p = (l - 16) * 0.36;
      a.push({ name: "lane-" + r.id, x: 8, y: h + 6, width: p, height: 36, text: r.label, fill: o(u), fontSize: 15 }), a.push({ name: "caption-" + r.id, x: 8 + p + 6, y: h + 6, width: l - 16 - p - 6, height: 56, text: ft(t, r.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((x) => x.laneId === r.id).forEach((x, m) => a.push({ name: "card-" + x.id, x: 8, y: h + 72 + m * 64, width: l - 16, height: 56, text: kt(t, x.id), fontSize: 15 })), h += c + 10;
    }), e = h;
  } else {
    const u = 116 + (Math.max(...s) + 1) * 88;
    t.lanes.forEach((c, p) => {
      const x = p * 244;
      a.push({ name: "column-" + c.id, x: x + 2, y: B, width: 240, height: u, fill: z(o(p), 0.6), line: z(o(p), 0.1) }), a.push({ name: "lane-" + c.id, x: x + 8, y: B + 6, width: 228, height: 58, text: c.label, fill: o(p), fontSize: 16 }), a.push({ name: "caption-" + c.id, x: x + 8, y: B + 66, width: 228, height: 48, text: ft(t, c.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((m) => m.laneId === c.id).forEach((m, d) => a.push({ name: "card-" + m.id, x: x + 8, y: B + 116 + d * 88, width: 228, height: 76, text: kt(t, m.id), fontSize: 15 }));
    }), l = t.lanes.length * 244, e = B + u;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(l, 520), height: 34, text: bt(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: a, width: l, height: e };
}
function kt(t, i) {
  const n = t.cards.find((a) => a.id === i);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + W(n.amount, t.forecast.currency);
}
function gn(t, i) {
  const { width: n } = F(t, i.layout), a = t.forecast.target, s = Wt(t), o = Math.max(a * 1.25, s), l = n - 8, e = s >= a;
  return [
    { t: "rect", x: 4, y: 42, w: l, h: 14, rx: 7, color: w.track },
    { t: "rect", x: 4, y: 42, w: l * s / o, h: 14, rx: 7, color: e ? w.accept : w.bar },
    { t: "line", x1: 4 + l * a / o, y1: 36, x2: 4 + l * a / o, y2: 62, color: w.ink, width: 2 },
    { t: "text", x: 4 + l * a / o, y: 72, text: "Target " + W(a, t.forecast.currency), color: w.ink, size: 14, anchor: "middle" }
  ];
}
const yn = {
  laneCues: !0,
  places: (t, i) => F(t, i),
  notes: (t, i, n, a) => rt(F(t, i).parts, t, n, a),
  editsBetween: ot,
  layer: (t) => st(t, gn),
  chooser(t, i, n, a = {}) {
    const s = Mt(t, i).map((o) => vt(t, i, o.id));
    return s.length < 2 ? null : At(A(t, "card-" + i, n, (o) => N(F(o, a).parts), (o, l) => o.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l, { gapIn: 40, gapOut: 56 })), t, i, F(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: o } = F(t, s), l = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === l.laneId || !tt(o.find((r) => r.name === "column-" + e.id), a)) continue;
      const h = jt(t, i, e.id);
      return h ? { laneId: e.id, reason: h } : null;
    }
    return null;
  },
  handleDrag: () => null
}, C = 48, H = 960, Bt = 900;
function E(t, i = {}) {
  const n = !!i.narrow, a = t.budget.total, s = [], o = [], l = t.lanes.map((r) => t.cards.filter((u) => u.laneId === r.id).length);
  let e, h;
  if (n) {
    e = Math.max(300, i.width ?? 390);
    let r = C;
    t.lanes.forEach((u, c) => {
      const p = Math.max(100 + (l[c] + 1) * 64, u.allocation / a * Bt);
      o.push({ laneId: u.id, start: r, size: p }), r += p;
    }), h = r + 8;
  } else {
    e = H;
    let r = 0;
    for (const u of t.lanes)
      o.push({ laneId: u.id, start: r, size: u.allocation / a * H }), r += u.allocation / a * H;
    h = C + 100 + (Math.max(...l) + 1) * 64;
  }
  return t.lanes.forEach((r, u) => {
    const { start: c, size: p } = o[u], x = D[u % D.length], m = n ? { x: 2, y: c + 1, width: e - 4, height: p - 2 } : { x: c + 1, y: C, width: Math.max(4, p - 2), height: h - C }, d = { x: m.x + 5, y: m.y, width: Math.max(10, m.width - 10) };
    s.push({ name: "column-" + r.id, ...m, fill: z(x, 0.6), line: z(x, 0.1) });
    const y = n ? d.width * 0.36 : d.width;
    if (s.push({ name: "lane-" + r.id, x: d.x, y: d.y + 6, width: y, height: 32, text: r.label, fill: x, fontSize: 15 }), s.push({
      name: "caption-" + r.id,
      x: n ? d.x + y + 6 : d.x,
      y: d.y + (n ? 6 : 40),
      width: n ? d.width - y - 6 : d.width,
      height: n ? 50 : 40,
      text: n ? xt(t, r.id).replace(" · ", `
`) : xt(t, r.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((f) => f.laneId === r.id).forEach((f, g) => s.push({
      name: "card-" + f.id,
      x: d.x,
      y: d.y + 100 + g * 64,
      width: d.width,
      height: 56,
      text: f.label + `
` + W(f.amount, t.budget.currency),
      fontSize: 14
    })), u < t.lanes.length - 1) {
      const f = c + p;
      s.push(n ? { name: "handle-" + r.id, x: e - 96, y: f - 22, width: 88, height: 44 } : { name: "handle-" + r.id, x: f - 22, y: C - 6, width: 44, height: 48 });
    }
  }), { parts: s, width: e, height: h, segments: o, narrow: n };
}
function wn(t, i) {
  const n = E(t, i.layout), a = t.budget.total, s = [{ t: "text", x: 4, y: 28, text: tn(t), color: w.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((o, l) => {
    const e = n.segments[l], h = o.allocation, r = Qt(t, o.id);
    if (n.narrow) {
      const u = e.start + 50, c = 8, p = n.width - 16;
      s.push({ t: "rect", x: c, y: u, w: p, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: c, y: u, w: p * r / h || 0, h: 10, rx: 5, color: w.bar }), o.floor !== void 0 && s.push({ t: "line", x1: c + p * o.floor / h, y1: u - 4, x2: c + p * o.floor / h, y2: u + 14, color: w.ink, width: 2 });
    } else {
      const u = H / a, c = C + 86;
      s.push({ t: "rect", x: e.start + 6, y: c, w: e.size - 12, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: e.start + 6, y: c, w: Math.max(0, (e.size - 12) * r / h || 0), h: 10, rx: 5, color: w.bar }), o.floor !== void 0 && s.push({ t: "line", x1: e.start + o.floor * u, y1: c - 6, x2: e.start + o.floor * u, y2: c + 16, color: w.ink, width: 2 }), o.cap !== void 0 && e.start + o.cap * u <= n.width && s.push({ t: "line", x1: e.start + o.cap * u, y1: c - 6, x2: e.start + o.cap * u, y2: c + 16, color: w.refuse, width: 2, dash: "3 2" });
    }
    if (l < t.lanes.length - 1) {
      const u = e.start + e.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: u, x2: n.width - 2, y2: u, color: w.ink, width: 2 } : { t: "line", x1: u, y1: C, x2: u, y2: n.height, color: w.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: u - 4, w: 32, h: 8, rx: 4, color: w.ink } : { t: "rect", x: u - 4, y: C + 2, w: 8, h: 30, rx: 4, color: w.ink });
    }
  }), i.clamp) {
    const o = n.parts.find((l) => l.name === i.clamp.name);
    o && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(o.x + 22, 120), n.width - 120),
      y: n.narrow ? o.y + 8 : C - 12,
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
const kn = (t, i) => Math.round(t / i) * i, Mn = {
  laneCues: !0,
  notes: (t, i, n, a) => rt(E(t, i).parts, t, n, a),
  editsBetween: ot,
  label: Ot,
  places(t, i) {
    const { parts: n, width: a, height: s } = E(t, i);
    return { parts: n, width: a, height: s };
  },
  layer: (t) => st(t, wn),
  chooser(t, i, n, a = {}) {
    const s = Mt(t, i).map((o) => vt(t, i, o.id));
    return s.length < 2 ? null : At(A(t, "card-" + i, n, (o) => N(E(o, a).parts), (o, l) => o.closest(s).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l)), t, i, E(t, a).parts, s);
  },
  refusalAt(t, i, n, a, s) {
    const { parts: o } = E(t, s), l = t.cards.find((e) => e.id === i);
    for (const e of t.lanes) {
      if (e.id === l.laneId || !tt(o.find((r) => r.name === "column-" + e.id), a)) continue;
      const h = qt(t, i, e.id);
      return h ? { laneId: e.id, reason: h } : null;
    }
    return null;
  },
  handleDrag(t, i, n, a) {
    const s = i.slice(7), o = t.lanes.findIndex((m) => m.id === s), l = t.lanes[o + 1];
    if (o < 0 || !l) return null;
    const e = Xt(t, { laneId: s }), h = t.budget.step, r = (m) => {
      const d = Math.min(e.max, Math.max(e.min, kn(m, h)));
      return mt(t, l.id, s, d);
    }, u = E(t, a), c = u.narrow ? Bt / t.budget.total : H / t.budget.total, p = u.parts.find((m) => m.name === i), x = A(t, i, n, (m) => N(E(m, a).parts), (m) => m.varyFunc([0], ([d]) => mt(t, l.id, s, d), { constraint: (d) => [
      ...It([e.min, d.lanes[o].allocation - t.lanes[o].allocation, e.max])
    ] }));
    return (m) => {
      const y = (u.narrow ? m.y - n.y - p.y : m.x - n.x - p.x) / c, f = x?.(m), g = f ? f.lanes[o].allocation - t.lanes[o].allocation : y, k = { next: r(g) };
      return y > e.max + h / 2 ? { ...k, clampedReason: e.reasons.max } : y < e.min - h / 2 ? { ...k, clampedReason: e.reasons.min } : k;
    };
  },
  keyEdit(t, i, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const a = /^handle-(.+)$/.exec(i)?.[1], s = t.lanes.findIndex((r) => r.id === a), o = t.lanes[s + 1];
    if (s < 0 || !o) return null;
    const l = n === "ArrowRight" || n === "ArrowDown", e = t.budget.step;
    return [l ? { kind: "shift_budget", from: { id: o.id }, to: { id: a }, amount: e } : { kind: "shift_budget", from: { id: a }, to: { id: o.id }, amount: e }];
  }
}, vn = { "launch-plan": at, "hiring-plan": at, pipeline: yn, budget: Mn };
function $n(t) {
  const i = vn[t];
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline and a budget have one.`);
  return i;
}
function En(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Rn as amountLimits,
  On as amountOf,
  Se as amountRules,
  Pn as bandOf,
  Le as behaviourEditsBetween,
  En as boardLayoutFor,
  xt as budgetCaption,
  Qt as budgetCommitted,
  tn as budgetHeader,
  Mn as budgetKit,
  E as budgetLayout,
  Xt as budgetLimits,
  qt as budgetRefusal,
  ze as budgetRules,
  Ce as budgetShiftLimits,
  Te as budgetShiftRefusal,
  Kt as cascadeStops,
  $e as catalogSamples,
  Jt as checkTime,
  Lt as clockOf,
  st as createBoardLayer,
  _n as currencyOf,
  Bn as dateName,
  Fn as dayFromWords,
  Ht as dayMap,
  ut as dayWords,
  Dn as days,
  Nn as downstreamTasks,
  In as extendWorkshopEdits,
  Hn as goLiveSample,
  Ot as handleLabel,
  Vn as hireLagFor,
  Ut as hireStarts,
  Kn as hiringPlanRules,
  Gn as hiringPlanSample,
  Gt as holdOthers,
  I as isoAt,
  Jn as isoTime,
  $n as kitFor,
  Q as launchFinish,
  Ct as launchHard,
  Un as launchIndex,
  O as launchLayout,
  St as launchLinkRefusal,
  Rt as launchLinkTargets,
  X as launchOverrun,
  Yn as launchPlanCaption,
  at as launchPlanKit,
  j as launchPlanLimits,
  Zn as launchPlanRefusal,
  jn as launchPlanRules,
  Xn as launchPlanSample,
  qn as launchTaskText,
  w as layerInk,
  Tt as legalRuns,
  $t as lineWord,
  W as money,
  Qn as monthNames,
  bn as nextCardId,
  te as nextMonday,
  ne as noteNumbers,
  dt as offsetOf,
  ee as ownField,
  rt as partNotes,
  Vt as pastTheLine,
  ft as pipelineCaption,
  Wt as pipelineForecast,
  bt as pipelineGauge,
  yn as pipelineKit,
  F as pipelineLayout,
  Ee as pipelineLimits,
  jt as pipelineRefusal,
  We as pipelineRules,
  Ae as planBudgetMove,
  ie as planDrags,
  ae as planEdit,
  se as planFixed,
  oe as planLaunchPlanMove,
  Re as planPipelineMove,
  re as planProblem,
  le as planWords,
  ce as presetRules,
  he as readClock,
  de as readNoteNumbers,
  ue as renamedNumbers,
  gt as renderLayerShapes,
  Oe as restoreWorkshop,
  fe as runwayCap,
  xe as runwayHeader,
  Yt as runwayMonths,
  Zt as runwayWords,
  Pe as sampleBudget,
  me as sampleLaunchPlan,
  _e as samplePipeline,
  q as scheduleLaunch,
  mt as shiftBudget,
  _ as shortDate,
  b as snapStep,
  pe as timeFamily,
  ge as timeRuleKindIds,
  ye as timeSentence,
  zt as tryTask,
  Be as validateBudget,
  we as validateHiringPlan,
  ke as validateLaunchPlan,
  Fe as validatePipeline,
  ht as weekdayAt,
  Me as weekendAt,
  Et as withLink,
  R as withTaskValue,
  ot as workshopEditsBetween
};
