import { Vec2 as Y, getElementPositionCheap as ht, translate as ut, dragSpecToBehavior as ft, param as N, moreThan as D, lessThan as V, inOrder as xt } from "./dragology.mjs";
import { laneColors as z, workshopDestinations as nt, workshopCandidate as et } from "./workshop-model.mjs";
import { money as E, pipelineForecast as it, launchLinkRefusal as at, launchPlanLimits as B, withTaskValue as R, launchOverrun as I, scheduleLaunch as G, launchFinish as T, withLink as mt, pipelineRefusal as pt, pipelineCaption as Z, budgetLimits as gt, budgetRefusal as yt, budgetCaption as j, shiftBudget as X, budgetCommitted as wt } from "./workshop-rules.mjs";
import { amountLimits as Gt, amountOf as Ut, amountRules as Jt, budgetRules as Kt, budgetShiftLimits as Yt, budgetShiftRefusal as Zt, currencyOf as jt, days as Xt, downstreamTasks as qt, launchPlanCaption as Qt, launchPlanRefusal as tn, launchPlanRules as nn, launchTaskText as en, nextCardId as an, noteNumbers as sn, ownField as on, pipelineLimits as ln, pipelineRules as rn, planBudgetMove as cn, planLaunchPlanMove as dn, planPipelineMove as hn, readNoteNumbers as un, renamedNumbers as fn, sampleBudget as xn, sampleLaunchPlan as mn, samplePipeline as pn, validateBudget as gn, validateLaunchPlan as yn, validatePipeline as wn } from "./workshop-rules.mjs";
import _ from "react";
const g = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, H = "http://www.w3.org/2000/svg", q = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function C(t, a, n) {
  const e = document.createElementNS(H, t);
  for (const [l, s] of Object.entries(a)) e.setAttribute(l, String(s));
  return n?.fill && (e.setAttribute("fill", q(n.fill)), e.style.setProperty("fill", n.fill)), n?.stroke && (e.setAttribute("stroke", q(n.stroke)), e.style.setProperty("stroke", n.stroke)), e;
}
function Q(t, a, n) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  for (const e of a)
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
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const l = C("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      l.textContent = e.text, t.appendChild(l);
    } else {
      if (e.unlink && n) {
        const { cardId: l, waitsOn: s, label: d } = e.unlink, i = C("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 12,
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": s + ">" + l,
          "aria-label": d,
          role: "button"
        }, { stroke: "transparent" });
        i.addEventListener("pointerdown", (o) => o.stopPropagation()), i.addEventListener("click", (o) => {
          o.stopPropagation(), n(l, s);
        }), t.appendChild(i);
      }
      if (t.appendChild(C("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: l, y: s, angle: d } = e.arrow;
        t.appendChild(C("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${l} ${s}) rotate(${d})`, "pointer-events": "none" }, { fill: e.color }));
      }
    }
}
function U(t, a) {
  const n = t?.canvas?.node, e = document.createElementNS(H, "g");
  e.setAttribute("data-board-layer", ""), e.setAttribute("pointer-events", "none");
  const l = document.createElementNS(H, "g");
  l.setAttribute("data-board-layer-top", ""), l.setAttribute("pointer-events", "none");
  let s = !1;
  return {
    draw(d, i, o) {
      if (s || !n) return;
      const { origin: r } = o, c = a(i ?? d, o, d), f = (u) => u.t === "text" && (u.role === "clamp" || u.role === "refusal");
      for (const u of [e, l]) u.setAttribute("transform", `translate(${r.x} ${r.y})`);
      Q(e, c.filter((u) => !f(u)), o.onUnlink), Q(l, c.filter(f));
      const m = o.above && o.above.parentNode === n ? o.above : null, x = m ? m.nextSibling : n.firstChild;
      (e.parentNode !== n || e.previousSibling !== m) && n.insertBefore(e, x === e ? e.nextSibling : x), l.firstChild && n.lastChild !== l ? n.appendChild(l) : !l.firstChild && l.parentNode && l.remove();
    },
    destroy() {
      s = !0, e.remove(), l.remove();
    }
  };
}
function W(t, a = []) {
  const n = t.filter((e) => e.name.startsWith("card-") || e.name.startsWith("handle-"));
  return _.createElement(
    "g",
    null,
    ...n.map((e) => /* @__PURE__ */ _.createElement("g", { id: e.name, transform: ut(e.x, e.y) }, /* @__PURE__ */ _.createElement("rect", { width: e.width, height: e.height }))),
    ...t.filter((e) => a.includes(e.name)).map((e) => /* @__PURE__ */ _.createElement("rect", { id: "target-" + e.name.slice(5), x: e.x, y: e.y, width: e.width, height: e.height }))
  );
}
function A(t, a, n, e, l) {
  let s;
  const i = {
    draggable: (r) => (s ?? (s = r.d), e(r.state)),
    draggedPath: a + "/",
    draggedId: a,
    anchorPos: Y(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!ht(i, t) || !s) return null;
  const o = ft(l(s, t), i);
  return (r) => o({ pointer: Y(r.x, r.y) }).dropState;
}
const F = (t, a, n = 0) => !!t && a.x >= t.x - n && a.x <= t.x + t.width + n && a.y >= t.y - n && a.y <= t.y + t.height + n;
function st(t, a, n, e, l) {
  if (!t) return null;
  const s = a.cards.find((d) => d.id === n).laneId;
  return (d) => {
    const i = t(d);
    if (i !== a && JSON.stringify(i) !== JSON.stringify(a)) return i;
    const o = e.find((r) => r.name.startsWith("column-") && r.name !== "column-" + s && F(r, d));
    return o && l.find((r) => r.cards.find((c) => c.id === n).laneId === o.name.slice(7)) || i;
  };
}
function v(t, a) {
  const n = (e) => Math.round(parseInt(t.slice(e, e + 2), 16) * (1 - a) + 255 * a).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function J(t, a) {
  const n = [], e = new Map(t.cards.map((i) => [i.id, i]));
  for (const i of a.cards) {
    const o = e.get(i.id), r = { id: i.id };
    if (!o) {
      n.push({
        kind: "add_card",
        lane: { id: i.laneId },
        label: i.label,
        ...i.duration !== void 0 && { duration: i.duration },
        ...i.lag && { lag: i.lag },
        ...i.dependsOn && { waitsOn: i.dependsOn.map((f) => ({ id: f })) },
        ...i.amount !== void 0 && { amount: i.amount }
      });
      continue;
    }
    o.label !== i.label && n.push({ kind: "rename_card", card: r, label: i.label });
    const c = n.length;
    for (const f of o.dependsOn ?? []) i.dependsOn?.includes(f) || n.push({ kind: "unlink_tasks", card: r, waitsOn: { id: f } });
    for (const f of i.dependsOn ?? []) o.dependsOn?.includes(f) || n.push({ kind: "link_tasks", card: r, waitsOn: { id: f } });
    o.laneId !== i.laneId && n.push({ kind: "move_card", card: r, lane: { id: i.laneId } }), (n.length > c && i.duration !== void 0 && n.slice(c).some((f) => f.kind !== "move_card") || o.duration !== i.duration || (o.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: r, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && o.amount !== i.amount && n.push({ kind: "set_amount", card: r, amount: i.amount });
  }
  for (const i of t.cards) a.cards.some((o) => o.id === i.id) || n.push({ kind: "remove_card", card: { id: i.id } });
  a.launch && t.launch?.day !== a.launch.day && n.push({ kind: "set_launch_day", day: a.launch.day }), a.forecast && t.forecast?.target !== a.forecast.target && n.push({ kind: "set_target", amount: a.forecast.target });
  const l = a.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (t.lanes.find((o) => o.id === i.id)?.allocation ?? 0) })), s = l.filter((i) => i.by < 0), d = l.filter((i) => i.by > 0);
  for (const i of d)
    for (const o of s) {
      const r = Math.min(i.by, -o.by);
      r <= 0 || (n.push({ kind: "shift_budget", from: { id: o.id }, to: { id: i.id }, amount: r }), i.by -= r, o.by += r);
    }
  for (const i of a.lanes) {
    const o = t.lanes.find((r) => r.id === i.id);
    o && o.label !== i.label && n.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label });
  }
  return n;
}
function kt(t) {
  const a = t.forecast?.currency;
  return `Forecast ${E(it(t), a)} of ${E(t.forecast?.target ?? 0, a)}`;
}
function vt(t) {
  return `${E(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Mt(t, a) {
  return t.cards.filter((n) => at(t, a, n.id) === null).map((n) => n.id);
}
function bt(t, a, n, e) {
  for (let l = a; l > 11; l--) {
    const s = Math.max(1, Math.floor(n / (l * 0.55)));
    if (t.split(`
`).reduce((i, o) => i + Math.max(1, Math.ceil(o.length / s)), 0) * l * 1.3 <= e) return l;
  }
  return Math.min(a, 11);
}
function K(t, a, n, e) {
  const l = e.textColor ?? "#18302d", s = e.borderColor ?? "#667872", d = e.fontSize ?? 14;
  return t.map((i) => {
    const o = i.name.startsWith("handle-"), r = i.text ?? "";
    return { options: {
      id: i.name,
      text: r,
      name: a.cards.find((c) => "card-" + c.id === i.name)?.label ?? r,
      xPos: n.x + i.x,
      yPos: n.y + i.y,
      width: i.width,
      height: i.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${i.width} V ${i.height} H 0 Z`,
      backgroundColor: o ? "transparent" : i.fill ?? e.backgroundColor ?? "#fffdf6",
      foregroundColor: i.ink ?? l,
      borderColor: i.line ?? s,
      borderWidth: o ? 0 : i.lineWidth ?? 1,
      ...e.fontFamily ? { fontFamily: e.fontFamily } : {},
      fontSize: bt(r, i.fontSize ?? d, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function ot(t, a) {
  const n = a.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const e = t.cards.find((s) => s.id === n);
  if (e) return `${e.label} length, ${e.duration} days. Left and Right change it.`;
  const l = t.lanes.findIndex((s) => s.id === n);
  return l >= 0 && t.lanes[l + 1] ? `Divider between ${t.lanes[l].label} and ${t.lanes[l + 1].label}. Left and Right move money.` : null;
}
const lt = "#c2410c", Ct = 32;
function $(t, a = {}) {
  const n = !!a.narrow, e = t.launch.day, l = G(t), s = [], d = /* @__PURE__ */ new Map(), i = n ? Math.max(300, a.width ?? 390) : Math.max(720, a.width ?? 1200), o = n ? 8 : 168, r = n ? (i - 88) / e : (i - o - 40) / e, c = (h) => z[t.lanes.findIndex((p) => p.id === h) % z.length], f = (h, p) => {
    const y = t.cards.find((dt) => dt.id === h), w = l.get(h), k = { x: o + w.start * r, y: p, width: y.duration * r, height: n ? 28 : Ct };
    d.set(h, k), s.push({
      name: "card-" + h,
      ...k,
      text: n ? "" : `${y.label} · ${y.duration}d`,
      fill: n ? c(y.laneId) : "#fffdf6",
      line: w.critical ? lt : "#667872",
      lineWidth: w.critical ? 2.5 : 1,
      fontSize: 13
    }), s.push({ name: "handle-" + h, x: k.x + k.width - 22, y: k.y + k.height / 2 - 22, width: 44, height: 44 });
  };
  let m, x, u;
  if (n) {
    const h = (i - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((p, y) => {
      const w = 8 + y * (h + 8);
      s.push({ name: "column-" + p.id, x: w, y: 30, width: h, height: 72, fill: v(c(p.id), 0.6), line: v(c(p.id), 0.1) }), s.push({ name: "lane-" + p.id, x: w + 4, y: 34, width: h - 8, height: 28, text: p.label, fill: c(p.id), fontSize: 14 }), s.push({ name: "caption-" + p.id, x: w + 4, y: 64, width: h - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), u = 124, x = 130, m = 138;
    for (const p of t.cards)
      f(p.id, m + 20), m += 56;
  } else {
    u = 48, x = 56, m = x;
    for (const h of t.lanes) {
      const p = t.cards.filter((w) => w.laneId === h.id), y = Math.max(92, p.length * 44 + 20);
      s.push({ name: "column-" + h.id, x: 0, y: m, width: i, height: y, fill: v(c(h.id), 0.65), line: v(c(h.id), 0.1) }), s.push({ name: "lane-" + h.id, x: 8, y: m + 8, width: o - 24, height: 32, text: h.label, fill: c(h.id), fontSize: 15 }), s.push({ name: "caption-" + h.id, x: 8, y: m + 44, width: o - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), p.forEach((w, k) => f(w.id, m + 10 + k * 44)), m += y + 4;
    }
  }
  return s.push({ name: "handle-launch", x: o + e * r - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: s, width: i, height: m + 8, narrow: n, x0: o, dayW: r, gridTop: x, axisY: u, bars: d };
}
function Lt(t, a, n) {
  for (const e of a.parts) e.name.startsWith("caption-") && (e.text = n(e.name.slice(8)));
  return a;
}
function St(t, a) {
  const n = t.x + t.width, e = Math.max(t.x + 4, n - 10), s = a.y + a.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, d = a.y + a.height / 2;
  return { d: `M ${e} ${s} V ${d} H ${a.x}`, arrow: { x: a.x, y: d, angle: 0 } };
}
function $t(t, a) {
  const n = $(t, a.layout), e = t.launch.day, l = G(t), s = [];
  for (let o = 0; o <= e; o++) {
    const r = n.x0 + o * n.dayW, c = o % 7 === 0;
    !c && n.dayW < 6 || (s.push({ t: "line", x1: r, y1: n.gridTop, x2: r, y2: n.height - 8, color: c ? g.week : g.faint, width: c ? 1 : 0.5 }), c && s.push({ t: "text", x: r + 3, y: n.axisY, text: n.narrow ? "W" + (o / 7 + 1) : "Week " + (o / 7 + 1), color: g.ink, size: 12 }));
  }
  for (const o of t.cards) {
    for (const f of o.dependsOn ?? []) {
      const m = n.bars.get(f), x = n.bars.get(o.id);
      if (!m || !x) continue;
      const u = l.get(f).critical && l.get(o.id).critical, h = t.cards.find((p) => p.id === f).label;
      s.push({
        t: "path",
        ...St(m, x),
        color: u ? lt : g.ink,
        width: u ? 2 : 1.5,
        unlink: { cardId: o.id, waitsOn: f, label: `Remove the link: ${o.label} waits on ${h}` }
      });
    }
    const r = l.get(o.id), c = n.bars.get(o.id);
    n.narrow && s.push({ t: "text", x: 8, y: c.y - 6, text: `${o.label} · ${o.duration}d`, color: g.ink, size: 13, bold: r.critical }), r.critical || s.push({ t: "text", x: c.x + c.width + 24, y: c.y + c.height / 2 + 4, text: "+" + r.slack + "d", color: g.ink, size: 12, role: "slack-" + o.id });
  }
  const d = n.x0 + e * n.dayW;
  s.push({ t: "line", x1: d, y1: n.narrow ? 112 : 26, x2: d, y2: n.height - 8, color: g.launch, width: 2, dash: "6 4" }), s.push({ t: "rect", x: d - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: g.launch });
  for (const o of t.cards) {
    const r = n.bars.get(o.id);
    s.push({ t: "rect", x: r.x + r.width - 5, y: r.y + 4, w: 4, h: r.height - 8, rx: 2, color: g.ink, opacity: 0.55 });
  }
  const i = T(t);
  if (s.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: `Done day ${i} · launch day ${e}`,
    color: a.refused ? g.refuse : g.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), a.clamp) {
    const o = n.parts.find((r) => r.name === a.clamp.name);
    o && s.push({
      t: "text",
      x: Math.min(o.x + 40, n.width - 4),
      y: o.y + 14,
      text: a.clamp.text,
      color: g.refuse,
      size: 13,
      anchor: o.x + 40 > n.width - 160 ? "end" : "start",
      bold: !0,
      role: "clamp"
    });
  }
  return s;
}
const O = (t) => ({ ...t, cards: t.cards.map((a) => {
  const n = { ...a, duration: Math.max(1, Math.round(a.duration)), lag: Math.max(0, Math.round(a.lag ?? 0)) };
  return n.lag || delete n.lag, n;
}), launch: { day: Math.round(t.launch.day) } });
function zt(t, a, { key: n, shiftKey: e }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const l = n === "ArrowLeft" ? -1 : 1;
  if (a === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + l }];
  const s = /^(card|handle)-(.+)$/.exec(a), d = s && t.cards.find((i) => i.id === s[2]);
  return d ? e || s[1] === "handle" ? [{ kind: "set_task", card: { id: d.id }, duration: d.duration + l }] : [{ kind: "set_task", card: { id: d.id }, lag: (d.lag ?? 0) + l }] : null;
}
const rt = {
  laneCues: !1,
  notes(t, a, n, e) {
    return K(rt.places(t, a).parts, t, n, e);
  },
  editsBetween: J,
  label: ot,
  places(t, a) {
    const n = Lt(t, $(t, a), (e) => {
      const l = t.cards.filter((d) => d.laneId === e), s = G(t);
      return `${l.length} ${l.length === 1 ? "task" : "tasks"} · ${l.filter((d) => s.get(d.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => U(t, $t),
  chooser(t, a, n, e = {}) {
    const l = t.cards.findIndex((s) => s.id === a);
    return l < 0 ? null : Et(t, a, l, Mt(t, a), n, e);
  },
  refusalAt(t, a, n, e, l) {
    const s = $(t, l);
    for (const r of t.cards) {
      if (r.id === a || !F(s.bars.get(r.id), e)) continue;
      const c = at(t, a, r.id);
      return c ? { laneId: r.laneId, reason: c } : null;
    }
    const d = t.cards.find((r) => r.id === a), i = (d.lag ?? 0) + Math.round((e.x - n.x - s.bars.get(a).x) / s.dayW), o = B(t, { cardId: a, field: "lag" });
    return i > o.max ? { laneId: d.laneId, reason: I(R(t, { cardId: a, field: "lag" }, i), a) ?? o.reasons.max } : null;
  },
  handleDrag(t, a, n, e) {
    const l = $(t, e), s = (x) => W($(x, e).parts);
    if (a === "handle-launch") {
      const x = B(t, { field: "day" }), u = A(t, a, n, s, (h, p) => h.vary(p, N("launch", "day"), { constraint: (y) => [D(y.launch.day, T(y) - 1e-3), V(y.launch.day, 120)] }).onDrop(O));
      return (h) => {
        const p = Math.round((h.x - n.x + 22 - l.x0) / l.dayW), y = u?.(h) ?? R(t, { field: "day" }, Math.min(x.max, Math.max(x.min, p)));
        return p < x.min ? { next: y, clampedReason: x.reasons.min, refusal: I(R(t, { field: "day" }, Math.max(5, p))) ?? void 0 } : { next: y };
      };
    }
    const d = a.slice(7), i = t.cards.findIndex((x) => x.id === d);
    if (i < 0) return null;
    const o = { cardId: d, field: "duration" }, r = B(t, o), c = t.launch.day, f = A(t, a, n, s, (x, u) => x.vary(u, N("cards", i, "duration"), { constraint: (h) => [D(h.cards[i].duration, 1), V(T(h), c + 1e-3)] }).onDrop(O)), m = l.bars.get(d);
    return (x) => {
      const u = Math.round((x.x - n.x + 22 - m.x) / l.dayW), h = Math.min(r.max, Math.max(r.min, u)), p = f?.(x) ?? R(t, o, h);
      return u > r.max ? { next: p, clampedReason: `Launch is day ${c}.`, refusal: I(R(t, o, Math.min(60, u)), d) ?? r.reasons.max } : u < r.min ? { next: p, clampedReason: r.reasons.min } : { next: p };
    };
  },
  keyEdit: zt
};
function Et(t, a, n, e, l, s) {
  const d = t.launch.day, i = (r) => W($(r, s).parts, e.map((c) => "card-" + c)), o = A(t, "card-" + a, l, i, (r, c) => {
    const f = s.narrow ? c.lanes.filter((x) => x.id === c.cards[n].laneId) : c.lanes, m = r.closest(f.map((x) => r.vary(
      { ...c, cards: c.cards.map((u, h) => h === n ? { ...u, laneId: x.id, lag: u.lag ?? 0 } : u) },
      N("cards", n, "lag"),
      { constraint: (u) => [D(u.cards[n].lag ?? 0, -1e-3), V(T(u), d + 1e-3)] }
    )));
    return e.length ? r.closest(e.map((x) => r.dropTarget("target-" + x, mt(c, a, x)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(m).withBranchTransition(120).onDrop(O) : m.onDrop(O);
  });
  return o ? (r) => O(o(r)) : null;
}
const L = 76;
function S(t, a = {}) {
  const n = !!a.narrow, e = [], l = t.lanes.map((o) => t.cards.filter((r) => r.laneId === o.id).length), s = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : z[o % z.length];
  let d, i;
  if (n) {
    d = Math.max(300, a.width ?? 390);
    let o = L;
    t.lanes.forEach((r, c) => {
      const f = 96 + (l[c] + 1) * 64;
      e.push({ name: "column-" + r.id, x: 2, y: o, width: d - 4, height: f, fill: v(s(c), 0.6), line: v(s(c), 0.1) });
      const m = (d - 16) * 0.36;
      e.push({ name: "lane-" + r.id, x: 8, y: o + 6, width: m, height: 36, text: r.label, fill: s(c), fontSize: 15 }), e.push({ name: "caption-" + r.id, x: 8 + m + 6, y: o + 6, width: d - 16 - m - 6, height: 56, text: Z(t, r.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((x) => x.laneId === r.id).forEach((x, u) => e.push({ name: "card-" + x.id, x: 8, y: o + 72 + u * 64, width: d - 16, height: 56, text: tt(t, x.id), fontSize: 15 })), o += f + 10;
    }), i = o;
  } else {
    const c = 116 + (Math.max(...l) + 1) * 88;
    t.lanes.forEach((f, m) => {
      const x = m * 244;
      e.push({ name: "column-" + f.id, x: x + 2, y: L, width: 240, height: c, fill: v(s(m), 0.6), line: v(s(m), 0.1) }), e.push({ name: "lane-" + f.id, x: x + 8, y: L + 6, width: 228, height: 58, text: f.label, fill: s(m), fontSize: 16 }), e.push({ name: "caption-" + f.id, x: x + 8, y: L + 66, width: 228, height: 48, text: Z(t, f.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((u) => u.laneId === f.id).forEach((u, h) => e.push({ name: "card-" + u.id, x: x + 8, y: L + 116 + h * 88, width: 228, height: 76, text: tt(t, u.id), fontSize: 15 }));
    }), d = t.lanes.length * 244, i = L + c;
  }
  return e.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(d, 520), height: 34, text: kt(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: e, width: d, height: i };
}
function tt(t, a) {
  const n = t.cards.find((e) => e.id === a);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + E(n.amount, t.forecast.currency);
}
function At(t, a) {
  const { width: n } = S(t, a.layout), e = t.forecast.target, l = it(t), s = Math.max(e * 1.25, l), d = n - 8, i = l >= e;
  return [
    { t: "rect", x: 4, y: 42, w: d, h: 14, rx: 7, color: g.track },
    { t: "rect", x: 4, y: 42, w: d * l / s, h: 14, rx: 7, color: i ? g.accept : g.bar },
    { t: "line", x1: 4 + d * e / s, y1: 36, x2: 4 + d * e / s, y2: 62, color: g.ink, width: 2 },
    { t: "text", x: 4 + d * e / s, y: 72, text: "Target " + E(e, t.forecast.currency), color: g.ink, size: 14, anchor: "middle" }
  ];
}
const Rt = {
  laneCues: !0,
  places: (t, a) => S(t, a),
  notes: (t, a, n, e) => K(S(t, a).parts, t, n, e),
  editsBetween: J,
  layer: (t) => U(t, At),
  chooser(t, a, n, e = {}) {
    const l = nt(t, a).map((s) => et(t, a, s.id));
    return l.length < 2 ? null : st(A(t, "card-" + a, n, (s) => W(S(s, e).parts), (s, d) => s.closest(l, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(d, { gapIn: 40, gapOut: 56 })), t, a, S(t, e).parts, l);
  },
  refusalAt(t, a, n, e, l) {
    const { parts: s } = S(t, l), d = t.cards.find((i) => i.id === a);
    for (const i of t.lanes) {
      if (i.id === d.laneId || !F(s.find((r) => r.name === "column-" + i.id), e)) continue;
      const o = pt(t, a, i.id);
      return o ? { laneId: i.id, reason: o } : null;
    }
    return null;
  },
  handleDrag: () => null
}, M = 48, P = 960, ct = 900;
function b(t, a = {}) {
  const n = !!a.narrow, e = t.budget.total, l = [], s = [], d = t.lanes.map((r) => t.cards.filter((c) => c.laneId === r.id).length);
  let i, o;
  if (n) {
    i = Math.max(300, a.width ?? 390);
    let r = M;
    t.lanes.forEach((c, f) => {
      const m = Math.max(100 + (d[f] + 1) * 64, c.allocation / e * ct);
      s.push({ laneId: c.id, start: r, size: m }), r += m;
    }), o = r + 8;
  } else {
    i = P;
    let r = 0;
    for (const c of t.lanes)
      s.push({ laneId: c.id, start: r, size: c.allocation / e * P }), r += c.allocation / e * P;
    o = M + 100 + (Math.max(...d) + 1) * 64;
  }
  return t.lanes.forEach((r, c) => {
    const { start: f, size: m } = s[c], x = z[c % z.length], u = n ? { x: 2, y: f + 1, width: i - 4, height: m - 2 } : { x: f + 1, y: M, width: Math.max(4, m - 2), height: o - M }, h = { x: u.x + 5, y: u.y, width: Math.max(10, u.width - 10) };
    l.push({ name: "column-" + r.id, ...u, fill: v(x, 0.6), line: v(x, 0.1) });
    const p = n ? h.width * 0.36 : h.width;
    if (l.push({ name: "lane-" + r.id, x: h.x, y: h.y + 6, width: p, height: 32, text: r.label, fill: x, fontSize: 15 }), l.push({
      name: "caption-" + r.id,
      x: n ? h.x + p + 6 : h.x,
      y: h.y + (n ? 6 : 40),
      width: n ? h.width - p - 6 : h.width,
      height: n ? 50 : 40,
      text: n ? j(t, r.id).replace(" · ", `
`) : j(t, r.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((y) => y.laneId === r.id).forEach((y, w) => l.push({
      name: "card-" + y.id,
      x: h.x,
      y: h.y + 100 + w * 64,
      width: h.width,
      height: 56,
      text: y.label + `
` + E(y.amount, t.budget.currency),
      fontSize: 14
    })), c < t.lanes.length - 1) {
      const y = f + m;
      l.push(n ? { name: "handle-" + r.id, x: i - 96, y: y - 22, width: 88, height: 44 } : { name: "handle-" + r.id, x: y - 22, y: M - 6, width: 44, height: 48 });
    }
  }), { parts: l, width: i, height: o, segments: s, narrow: n };
}
function Ot(t, a) {
  const n = b(t, a.layout), e = t.budget.total, l = [{ t: "text", x: 4, y: 28, text: vt(t), color: g.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((s, d) => {
    const i = n.segments[d], o = s.allocation, r = wt(t, s.id);
    if (n.narrow) {
      const c = i.start + 50, f = 8, m = n.width - 16;
      l.push({ t: "rect", x: f, y: c, w: m, h: 10, rx: 5, color: g.track }), l.push({ t: "rect", x: f, y: c, w: m * r / o || 0, h: 10, rx: 5, color: g.bar }), s.floor !== void 0 && l.push({ t: "line", x1: f + m * s.floor / o, y1: c - 4, x2: f + m * s.floor / o, y2: c + 14, color: g.ink, width: 2 });
    } else {
      const c = P / e, f = M + 86;
      l.push({ t: "rect", x: i.start + 6, y: f, w: i.size - 12, h: 10, rx: 5, color: g.track }), l.push({ t: "rect", x: i.start + 6, y: f, w: Math.max(0, (i.size - 12) * r / o || 0), h: 10, rx: 5, color: g.bar }), s.floor !== void 0 && l.push({ t: "line", x1: i.start + s.floor * c, y1: f - 6, x2: i.start + s.floor * c, y2: f + 16, color: g.ink, width: 2 }), s.cap !== void 0 && i.start + s.cap * c <= n.width && l.push({ t: "line", x1: i.start + s.cap * c, y1: f - 6, x2: i.start + s.cap * c, y2: f + 16, color: g.refuse, width: 2, dash: "3 2" });
    }
    if (d < t.lanes.length - 1) {
      const c = i.start + i.size;
      l.push(n.narrow ? { t: "line", x1: 2, y1: c, x2: n.width - 2, y2: c, color: g.ink, width: 2 } : { t: "line", x1: c, y1: M, x2: c, y2: n.height, color: g.ink, width: 2 }), l.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: g.ink } : { t: "rect", x: c - 4, y: M + 2, w: 8, h: 30, rx: 4, color: g.ink });
    }
  }), a.clamp) {
    const s = n.parts.find((d) => d.name === a.clamp.name);
    s && l.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(s.x + 22, 120), n.width - 120),
      y: n.narrow ? s.y + 8 : M - 12,
      text: a.clamp.text,
      color: g.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return l;
}
const Pt = (t, a) => Math.round(t / a) * a, Wt = {
  laneCues: !0,
  notes: (t, a, n, e) => K(b(t, a).parts, t, n, e),
  editsBetween: J,
  label: ot,
  places(t, a) {
    const { parts: n, width: e, height: l } = b(t, a);
    return { parts: n, width: e, height: l };
  },
  layer: (t) => U(t, Ot),
  chooser(t, a, n, e = {}) {
    const l = nt(t, a).map((s) => et(t, a, s.id));
    return l.length < 2 ? null : st(A(t, "card-" + a, n, (s) => W(b(s, e).parts), (s, d) => s.closest(l).withFloating({ ghost: { opacity: 0.3 } }).whenFar(d)), t, a, b(t, e).parts, l);
  },
  refusalAt(t, a, n, e, l) {
    const { parts: s } = b(t, l), d = t.cards.find((i) => i.id === a);
    for (const i of t.lanes) {
      if (i.id === d.laneId || !F(s.find((r) => r.name === "column-" + i.id), e)) continue;
      const o = yt(t, a, i.id);
      return o ? { laneId: i.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, a, n, e) {
    const l = a.slice(7), s = t.lanes.findIndex((u) => u.id === l), d = t.lanes[s + 1];
    if (s < 0 || !d) return null;
    const i = gt(t, { laneId: l }), o = t.budget.step, r = (u) => {
      const h = Math.min(i.max, Math.max(i.min, Pt(u, o)));
      return X(t, d.id, l, h);
    }, c = b(t, e), f = c.narrow ? ct / t.budget.total : P / t.budget.total, m = c.parts.find((u) => u.name === a), x = A(t, a, n, (u) => W(b(u, e).parts), (u) => u.varyFunc([0], ([h]) => X(t, d.id, l, h), { constraint: (h) => [
      ...xt([i.min, h.lanes[s].allocation - t.lanes[s].allocation, i.max])
    ] }));
    return (u) => {
      const p = (c.narrow ? u.y - n.y - m.y : u.x - n.x - m.x) / f, y = x?.(u), w = y ? y.lanes[s].allocation - t.lanes[s].allocation : p, k = { next: r(w) };
      return p > i.max + o / 2 ? { ...k, clampedReason: i.reasons.max } : p < i.min - o / 2 ? { ...k, clampedReason: i.reasons.min } : k;
    };
  },
  keyEdit(t, a, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const e = /^handle-(.+)$/.exec(a)?.[1], l = t.lanes.findIndex((r) => r.id === e), s = t.lanes[l + 1];
    if (l < 0 || !s) return null;
    const d = n === "ArrowRight" || n === "ArrowDown", i = t.budget.step;
    return [d ? { kind: "shift_budget", from: { id: s.id }, to: { id: e }, amount: i } : { kind: "shift_budget", from: { id: e }, to: { id: s.id }, amount: i }];
  }
}, _t = { "launch-plan": rt, pipeline: Rt, budget: Wt };
function Nt(t) {
  const a = _t[t];
  if (!a) throw new Error(`No board kit for "${t}". Only a launch plan, a pipeline and a budget have one.`);
  return a;
}
function Dt(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Gt as amountLimits,
  Ut as amountOf,
  Jt as amountRules,
  Dt as boardLayoutFor,
  j as budgetCaption,
  wt as budgetCommitted,
  vt as budgetHeader,
  Wt as budgetKit,
  b as budgetLayout,
  gt as budgetLimits,
  yt as budgetRefusal,
  Kt as budgetRules,
  Yt as budgetShiftLimits,
  Zt as budgetShiftRefusal,
  U as createBoardLayer,
  jt as currencyOf,
  Xt as days,
  qt as downstreamTasks,
  ot as handleLabel,
  Nt as kitFor,
  T as launchFinish,
  $ as launchLayout,
  at as launchLinkRefusal,
  Mt as launchLinkTargets,
  I as launchOverrun,
  Qt as launchPlanCaption,
  rt as launchPlanKit,
  B as launchPlanLimits,
  tn as launchPlanRefusal,
  nn as launchPlanRules,
  en as launchTaskText,
  g as layerInk,
  E as money,
  an as nextCardId,
  sn as noteNumbers,
  on as ownField,
  K as partNotes,
  Z as pipelineCaption,
  it as pipelineForecast,
  kt as pipelineGauge,
  Rt as pipelineKit,
  S as pipelineLayout,
  ln as pipelineLimits,
  pt as pipelineRefusal,
  rn as pipelineRules,
  cn as planBudgetMove,
  dn as planLaunchPlanMove,
  hn as planPipelineMove,
  un as readNoteNumbers,
  fn as renamedNumbers,
  Q as renderLayerShapes,
  xn as sampleBudget,
  mn as sampleLaunchPlan,
  pn as samplePipeline,
  G as scheduleLaunch,
  X as shiftBudget,
  gn as validateBudget,
  yn as validateLaunchPlan,
  wn as validatePipeline,
  mt as withLink,
  R as withTaskValue,
  J as workshopEditsBetween
};
