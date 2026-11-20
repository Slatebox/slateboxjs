import { Vec2 as Y, getElementPositionCheap as dt, translate as ht, dragSpecToBehavior as ut, param as P, moreThan as N, lessThan as V, inOrder as ft } from "./dragology.mjs";
import { money as L, pipelineForecast as tt, launchLinkRefusal as nt, launchPlanLimits as B, withTaskValue as W, launchOverrun as D, scheduleLaunch as G, laneColors as E, launchFinish as T, withLink as xt, pipelineRefusal as mt, workshopDestinations as et, workshopCandidate as it, pipelineCaption as Z, budgetLimits as gt, budgetRefusal as pt, budgetCaption as yt, shiftBudget as j, budgetCommitted as wt } from "./workshop-model.mjs";
import F from "react";
const p = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, H = "http://www.w3.org/2000/svg", X = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function z(t, a, n) {
  const e = document.createElementNS(H, t);
  for (const [r, s] of Object.entries(a)) e.setAttribute(r, String(s));
  return n?.fill && (e.setAttribute("fill", X(n.fill)), e.style.setProperty("fill", n.fill)), n?.stroke && (e.setAttribute("stroke", X(n.stroke)), e.style.setProperty("stroke", n.stroke)), e;
}
function q(t, a, n) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  for (const e of a)
    if (e.t === "line")
      t.appendChild(z("line", {
        x1: e.x1,
        y1: e.y1,
        x2: e.x2,
        y2: e.y2,
        "stroke-width": e.width ?? 1,
        ...e.dash ? { "stroke-dasharray": e.dash } : {}
      }, { stroke: e.color }));
    else if (e.t === "rect")
      t.appendChild(z("rect", {
        x: e.x,
        y: e.y,
        width: Math.max(0, e.w),
        height: Math.max(0, e.h),
        rx: e.rx ?? 0,
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const r = z("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      r.textContent = e.text, t.appendChild(r);
    } else {
      if (e.unlink && n) {
        const { cardId: r, waitsOn: s, label: d } = e.unlink, i = z("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 12,
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": s + ">" + r,
          "aria-label": d,
          role: "button"
        }, { stroke: "transparent" });
        i.addEventListener("pointerdown", (o) => o.stopPropagation()), i.addEventListener("click", (o) => {
          o.stopPropagation(), n(r, s);
        }), t.appendChild(i);
      }
      if (t.appendChild(z("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: r, y: s, angle: d } = e.arrow;
        t.appendChild(z("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${r} ${s}) rotate(${d})`, "pointer-events": "none" }, { fill: e.color }));
      }
    }
}
function U(t, a) {
  const n = t?.canvas?.node, e = document.createElementNS(H, "g");
  e.setAttribute("data-board-layer", ""), e.setAttribute("pointer-events", "none");
  const r = document.createElementNS(H, "g");
  r.setAttribute("data-board-layer-top", ""), r.setAttribute("pointer-events", "none");
  let s = !1;
  return {
    draw(d, i, o) {
      if (s || !n) return;
      const { origin: l } = o, c = a(i ?? d, o, d), u = (f) => f.t === "text" && (f.role === "clamp" || f.role === "refusal");
      for (const f of [e, r]) f.setAttribute("transform", `translate(${l.x} ${l.y})`);
      q(e, c.filter((f) => !u(f)), o.onUnlink), q(r, c.filter(u));
      const x = o.above && o.above.parentNode === n ? o.above : null, m = x ? x.nextSibling : n.firstChild;
      (e.parentNode !== n || e.previousSibling !== x) && n.insertBefore(e, m === e ? e.nextSibling : m), r.firstChild && n.lastChild !== r ? n.appendChild(r) : !r.firstChild && r.parentNode && r.remove();
    },
    destroy() {
      s = !0, e.remove(), r.remove();
    }
  };
}
function R(t, a = []) {
  const n = t.filter((e) => e.name.startsWith("card-") || e.name.startsWith("handle-"));
  return F.createElement(
    "g",
    null,
    ...n.map((e) => /* @__PURE__ */ F.createElement("g", { id: e.name, transform: ht(e.x, e.y) }, /* @__PURE__ */ F.createElement("rect", { width: e.width, height: e.height }))),
    ...t.filter((e) => a.includes(e.name)).map((e) => /* @__PURE__ */ F.createElement("rect", { id: "target-" + e.name.slice(5), x: e.x, y: e.y, width: e.width, height: e.height }))
  );
}
function A(t, a, n, e, r) {
  let s;
  const i = {
    draggable: (l) => (s ?? (s = l.d), e(l.state)),
    draggedPath: a + "/",
    draggedId: a,
    anchorPos: Y(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!dt(i, t) || !s) return null;
  const o = ut(r(s, t), i);
  return (l) => o({ pointer: Y(l.x, l.y) }).dropState;
}
const I = (t, a, n = 0) => !!t && a.x >= t.x - n && a.x <= t.x + t.width + n && a.y >= t.y - n && a.y <= t.y + t.height + n;
function at(t, a, n, e, r) {
  if (!t) return null;
  const s = a.cards.find((d) => d.id === n).laneId;
  return (d) => {
    const i = t(d);
    if (i !== a && JSON.stringify(i) !== JSON.stringify(a)) return i;
    const o = e.find((l) => l.name.startsWith("column-") && l.name !== "column-" + s && I(l, d));
    return o && r.find((l) => l.cards.find((c) => c.id === n).laneId === o.name.slice(7)) || i;
  };
}
function v(t, a) {
  const n = (e) => Math.round(parseInt(t.slice(e, e + 2), 16) * (1 - a) + 255 * a).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function J(t, a) {
  const n = [], e = new Map(t.cards.map((i) => [i.id, i]));
  for (const i of a.cards) {
    const o = e.get(i.id), l = { id: i.id };
    if (!o) {
      n.push({
        kind: "add_card",
        lane: { id: i.laneId },
        label: i.label,
        ...i.duration !== void 0 && { duration: i.duration },
        ...i.lag && { lag: i.lag },
        ...i.dependsOn && { waitsOn: i.dependsOn.map((u) => ({ id: u })) },
        ...i.amount !== void 0 && { amount: i.amount }
      });
      continue;
    }
    o.label !== i.label && n.push({ kind: "rename_card", card: l, label: i.label });
    const c = n.length;
    for (const u of o.dependsOn ?? []) i.dependsOn?.includes(u) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: u } });
    for (const u of i.dependsOn ?? []) o.dependsOn?.includes(u) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: u } });
    o.laneId !== i.laneId && n.push({ kind: "move_card", card: l, lane: { id: i.laneId } }), (n.length > c && i.duration !== void 0 && n.slice(c).some((u) => u.kind !== "move_card") || o.duration !== i.duration || (o.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && o.amount !== i.amount && n.push({ kind: "set_amount", card: l, amount: i.amount });
  }
  for (const i of t.cards) a.cards.some((o) => o.id === i.id) || n.push({ kind: "remove_card", card: { id: i.id } });
  a.launch && t.launch?.day !== a.launch.day && n.push({ kind: "set_launch_day", day: a.launch.day }), a.forecast && t.forecast?.target !== a.forecast.target && n.push({ kind: "set_target", amount: a.forecast.target });
  const r = a.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (t.lanes.find((o) => o.id === i.id)?.allocation ?? 0) })), s = r.filter((i) => i.by < 0), d = r.filter((i) => i.by > 0);
  for (const i of d)
    for (const o of s) {
      const l = Math.min(i.by, -o.by);
      l <= 0 || (n.push({ kind: "shift_budget", from: { id: o.id }, to: { id: i.id }, amount: l }), i.by -= l, o.by += l);
    }
  for (const i of a.lanes) {
    const o = t.lanes.find((l) => l.id === i.id);
    o && o.label !== i.label && n.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label });
  }
  return n;
}
function kt(t) {
  const a = t.forecast?.currency;
  return `Forecast ${L(tt(t), a)} of ${L(t.forecast?.target ?? 0, a)}`;
}
function vt(t) {
  return `${L(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Mt(t, a) {
  return t.cards.filter((n) => nt(t, a, n.id) === null).map((n) => n.id);
}
function $t(t, a, n, e) {
  for (let r = a; r > 11; r--) {
    const s = Math.max(1, Math.floor(n / (r * 0.55)));
    if (t.split(`
`).reduce((i, o) => i + Math.max(1, Math.ceil(o.length / s)), 0) * r * 1.3 <= e) return r;
  }
  return Math.min(a, 11);
}
function K(t, a, n, e) {
  const r = e.textColor ?? "#18302d", s = e.borderColor ?? "#667872", d = e.fontSize ?? 14;
  return t.map((i) => {
    const o = i.name.startsWith("handle-"), l = i.text ?? "";
    return { options: {
      id: i.name,
      text: l,
      name: a.cards.find((c) => "card-" + c.id === i.name)?.label ?? l,
      xPos: n.x + i.x,
      yPos: n.y + i.y,
      width: i.width,
      height: i.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${i.width} V ${i.height} H 0 Z`,
      backgroundColor: o ? "transparent" : i.fill ?? e.backgroundColor ?? "#fffdf6",
      foregroundColor: i.ink ?? r,
      borderColor: i.line ?? s,
      borderWidth: o ? 0 : i.lineWidth ?? 1,
      ...e.fontFamily ? { fontFamily: e.fontFamily } : {},
      fontSize: $t(l, i.fontSize ?? d, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function st(t, a) {
  const n = a.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const e = t.cards.find((s) => s.id === n);
  if (e) return `${e.label} length, ${e.duration} days. Left and Right change it.`;
  const r = t.lanes.findIndex((s) => s.id === n);
  return r >= 0 && t.lanes[r + 1] ? `Divider between ${t.lanes[r].label} and ${t.lanes[r + 1].label}. Left and Right move money.` : null;
}
const ot = "#c2410c", zt = 32;
function b(t, a = {}) {
  const n = !!a.narrow, e = t.launch.day, r = G(t), s = [], d = /* @__PURE__ */ new Map(), i = n ? Math.max(300, a.width ?? 390) : Math.max(720, a.width ?? 1200), o = n ? 8 : 168, l = n ? (i - 88) / e : (i - o - 40) / e, c = (h) => E[t.lanes.findIndex((g) => g.id === h) % E.length], u = (h, g) => {
    const y = t.cards.find((ct) => ct.id === h), w = r.get(h), k = { x: o + w.start * l, y: g, width: y.duration * l, height: n ? 28 : zt };
    d.set(h, k), s.push({
      name: "card-" + h,
      ...k,
      text: n ? "" : `${y.label} · ${y.duration}d`,
      fill: n ? c(y.laneId) : "#fffdf6",
      line: w.critical ? ot : "#667872",
      lineWidth: w.critical ? 2.5 : 1,
      fontSize: 13
    }), s.push({ name: "handle-" + h, x: k.x + k.width - 22, y: k.y + k.height / 2 - 22, width: 44, height: 44 });
  };
  let x, m, f;
  if (n) {
    const h = (i - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((g, y) => {
      const w = 8 + y * (h + 8);
      s.push({ name: "column-" + g.id, x: w, y: 30, width: h, height: 72, fill: v(c(g.id), 0.6), line: v(c(g.id), 0.1) }), s.push({ name: "lane-" + g.id, x: w + 4, y: 34, width: h - 8, height: 28, text: g.label, fill: c(g.id), fontSize: 14 }), s.push({ name: "caption-" + g.id, x: w + 4, y: 64, width: h - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), f = 124, m = 130, x = 138;
    for (const g of t.cards)
      u(g.id, x + 20), x += 56;
  } else {
    f = 48, m = 56, x = m;
    for (const h of t.lanes) {
      const g = t.cards.filter((w) => w.laneId === h.id), y = Math.max(92, g.length * 44 + 20);
      s.push({ name: "column-" + h.id, x: 0, y: x, width: i, height: y, fill: v(c(h.id), 0.65), line: v(c(h.id), 0.1) }), s.push({ name: "lane-" + h.id, x: 8, y: x + 8, width: o - 24, height: 32, text: h.label, fill: c(h.id), fontSize: 15 }), s.push({ name: "caption-" + h.id, x: 8, y: x + 44, width: o - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 12 }), g.forEach((w, k) => u(w.id, x + 10 + k * 44)), x += y + 4;
    }
  }
  return s.push({ name: "handle-launch", x: o + e * l - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: s, width: i, height: x + 8, narrow: n, x0: o, dayW: l, gridTop: m, axisY: f, bars: d };
}
function Ct(t, a, n) {
  for (const e of a.parts) e.name.startsWith("caption-") && (e.text = n(e.name.slice(8)));
  return a;
}
function St(t, a) {
  const n = t.x + t.width, e = Math.max(t.x + 4, n - 10), s = a.y + a.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, d = a.y + a.height / 2;
  return { d: `M ${e} ${s} V ${d} H ${a.x}`, arrow: { x: a.x, y: d, angle: 0 } };
}
function bt(t, a) {
  const n = b(t, a.layout), e = t.launch.day, r = G(t), s = [];
  for (let o = 0; o <= e; o++) {
    const l = n.x0 + o * n.dayW, c = o % 7 === 0;
    !c && n.dayW < 6 || (s.push({ t: "line", x1: l, y1: n.gridTop, x2: l, y2: n.height - 8, color: c ? p.week : p.faint, width: c ? 1 : 0.5 }), c && s.push({ t: "text", x: l + 3, y: n.axisY, text: n.narrow ? "W" + (o / 7 + 1) : "Week " + (o / 7 + 1), color: p.ink, size: 11 }));
  }
  for (const o of t.cards) {
    for (const u of o.dependsOn ?? []) {
      const x = n.bars.get(u), m = n.bars.get(o.id);
      if (!x || !m) continue;
      const f = r.get(u).critical && r.get(o.id).critical, h = t.cards.find((g) => g.id === u).label;
      s.push({
        t: "path",
        ...St(x, m),
        color: f ? ot : p.ink,
        width: f ? 2 : 1.5,
        unlink: { cardId: o.id, waitsOn: u, label: `Remove the link: ${o.label} waits on ${h}` }
      });
    }
    const l = r.get(o.id), c = n.bars.get(o.id);
    n.narrow && s.push({ t: "text", x: 8, y: c.y - 6, text: `${o.label} · ${o.duration}d`, color: p.ink, size: 13, bold: l.critical }), l.critical || s.push({ t: "text", x: c.x + c.width + 24, y: c.y + c.height / 2 + 4, text: "+" + l.slack + "d", color: p.ink, size: 11, role: "slack-" + o.id });
  }
  const d = n.x0 + e * n.dayW;
  s.push({ t: "line", x1: d, y1: n.narrow ? 112 : 26, x2: d, y2: n.height - 8, color: p.launch, width: 2, dash: "6 4" }), s.push({ t: "rect", x: d - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: p.launch });
  for (const o of t.cards) {
    const l = n.bars.get(o.id);
    s.push({ t: "rect", x: l.x + l.width - 5, y: l.y + 4, w: 4, h: l.height - 8, rx: 2, color: p.ink, opacity: 0.55 });
  }
  const i = T(t);
  if (s.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: `Done day ${i} · launch day ${e}`,
    color: a.refused ? p.refuse : p.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), a.clamp) {
    const o = n.parts.find((l) => l.name === a.clamp.name);
    o && s.push({
      t: "text",
      x: Math.min(o.x + 40, n.width - 4),
      y: o.y + 14,
      text: a.clamp.text,
      color: p.refuse,
      size: 13,
      anchor: o.x + 40 > n.width - 160 ? "end" : "start",
      bold: !0,
      role: "clamp"
    });
  }
  return s;
}
const _ = (t) => ({ ...t, cards: t.cards.map((a) => {
  const n = { ...a, duration: Math.max(1, Math.round(a.duration)), lag: Math.max(0, Math.round(a.lag ?? 0)) };
  return n.lag || delete n.lag, n;
}), launch: { day: Math.round(t.launch.day) } });
function Lt(t, a, { key: n, shiftKey: e }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const r = n === "ArrowLeft" ? -1 : 1;
  if (a === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + r }];
  const s = /^(card|handle)-(.+)$/.exec(a), d = s && t.cards.find((i) => i.id === s[2]);
  return d ? e || s[1] === "handle" ? [{ kind: "set_task", card: { id: d.id }, duration: d.duration + r }] : [{ kind: "set_task", card: { id: d.id }, lag: (d.lag ?? 0) + r }] : null;
}
const rt = {
  laneCues: !1,
  notes(t, a, n, e) {
    return K(rt.places(t, a).parts, t, n, e);
  },
  editsBetween: J,
  label: st,
  places(t, a) {
    const n = Ct(t, b(t, a), (e) => {
      const r = t.cards.filter((d) => d.laneId === e), s = G(t);
      return `${r.length} ${r.length === 1 ? "task" : "tasks"} · ${r.filter((d) => s.get(d.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => U(t, bt),
  chooser(t, a, n, e = {}) {
    const r = t.cards.findIndex((s) => s.id === a);
    return r < 0 ? null : Et(t, a, r, Mt(t, a), n, e);
  },
  refusalAt(t, a, n, e, r) {
    const s = b(t, r);
    for (const l of t.cards) {
      if (l.id === a || !I(s.bars.get(l.id), e)) continue;
      const c = nt(t, a, l.id);
      return c ? { laneId: l.laneId, reason: c } : null;
    }
    const d = t.cards.find((l) => l.id === a), i = (d.lag ?? 0) + Math.round((e.x - n.x - s.bars.get(a).x) / s.dayW), o = B(t, { cardId: a, field: "lag" });
    return i > o.max ? { laneId: d.laneId, reason: D(W(t, { cardId: a, field: "lag" }, i), a) ?? o.reasons.max } : null;
  },
  handleDrag(t, a, n, e) {
    const r = b(t, e), s = (m) => R(b(m, e).parts);
    if (a === "handle-launch") {
      const m = B(t, { field: "day" }), f = A(t, a, n, s, (h, g) => h.vary(g, P("launch", "day"), { constraint: (y) => [N(y.launch.day, T(y) - 1e-3), V(y.launch.day, 120)] }).onDrop(_));
      return (h) => {
        const g = Math.round((h.x - n.x + 22 - r.x0) / r.dayW), y = f?.(h) ?? W(t, { field: "day" }, Math.min(m.max, Math.max(m.min, g)));
        return g < m.min ? { next: y, clampedReason: m.reasons.min, refusal: D(W(t, { field: "day" }, Math.max(5, g))) ?? void 0 } : { next: y };
      };
    }
    const d = a.slice(7), i = t.cards.findIndex((m) => m.id === d);
    if (i < 0) return null;
    const o = { cardId: d, field: "duration" }, l = B(t, o), c = t.launch.day, u = A(t, a, n, s, (m, f) => m.vary(f, P("cards", i, "duration"), { constraint: (h) => [N(h.cards[i].duration, 1), V(T(h), c + 1e-3)] }).onDrop(_)), x = r.bars.get(d);
    return (m) => {
      const f = Math.round((m.x - n.x + 22 - x.x) / r.dayW), h = Math.min(l.max, Math.max(l.min, f)), g = u?.(m) ?? W(t, o, h);
      return f > l.max ? { next: g, clampedReason: `Launch is day ${c}.`, refusal: D(W(t, o, Math.min(60, f)), d) ?? l.reasons.max } : f < l.min ? { next: g, clampedReason: l.reasons.min } : { next: g };
    };
  },
  keyEdit: Lt
};
function Et(t, a, n, e, r, s) {
  const d = t.launch.day, i = (l) => R(b(l, s).parts, e.map((c) => "card-" + c)), o = A(t, "card-" + a, r, i, (l, c) => {
    const u = s.narrow ? c.lanes.filter((m) => m.id === c.cards[n].laneId) : c.lanes, x = l.closest(u.map((m) => l.vary(
      { ...c, cards: c.cards.map((f, h) => h === n ? { ...f, laneId: m.id, lag: f.lag ?? 0 } : f) },
      P("cards", n, "lag"),
      { constraint: (f) => [N(f.cards[n].lag ?? 0, -1e-3), V(T(f), d + 1e-3)] }
    )));
    return e.length ? l.closest(e.map((m) => l.dropTarget("target-" + m, xt(c, a, m)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop(_) : x.onDrop(_);
  });
  return o ? (l) => _(o(l)) : null;
}
const C = 76;
function S(t, a = {}) {
  const n = !!a.narrow, e = [], r = t.lanes.map((o) => t.cards.filter((l) => l.laneId === o.id).length), s = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : E[o % E.length];
  let d, i;
  if (n) {
    d = Math.max(300, a.width ?? 390);
    let o = C;
    t.lanes.forEach((l, c) => {
      const u = 76 + (r[c] + 1) * 64;
      e.push({ name: "column-" + l.id, x: 2, y: o, width: d - 4, height: u, fill: v(s(c), 0.6), line: v(s(c), 0.1) }), e.push({ name: "lane-" + l.id, x: 8, y: o + 6, width: (d - 16) * 0.45, height: 36, text: l.label, fill: s(c), fontSize: 15 }), e.push({ name: "caption-" + l.id, x: 8 + (d - 16) * 0.45 + 6, y: o + 6, width: (d - 16) * 0.55 - 6, height: 36, text: Z(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 12 }), t.cards.filter((x) => x.laneId === l.id).forEach((x, m) => e.push({ name: "card-" + x.id, x: 8, y: o + 52 + m * 64, width: d - 16, height: 56, text: Q(t, x.id), fontSize: 15 })), o += u + 10;
    }), i = o;
  } else {
    const c = 98 + (Math.max(...r) + 1) * 88;
    t.lanes.forEach((u, x) => {
      const m = x * 244;
      e.push({ name: "column-" + u.id, x: m + 2, y: C, width: 240, height: c, fill: v(s(x), 0.6), line: v(s(x), 0.1) }), e.push({ name: "lane-" + u.id, x: m + 8, y: C + 6, width: 228, height: 58, text: u.label, fill: s(x), fontSize: 16 }), e.push({ name: "caption-" + u.id, x: m + 8, y: C + 66, width: 228, height: 30, text: Z(t, u.id), fill: "transparent", lineWidth: 0, fontSize: 13 }), t.cards.filter((f) => f.laneId === u.id).forEach((f, h) => e.push({ name: "card-" + f.id, x: m + 8, y: C + 98 + h * 88, width: 228, height: 76, text: Q(t, f.id), fontSize: 15 }));
    }), d = t.lanes.length * 244, i = C + c;
  }
  return e.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(d, 520), height: 34, text: kt(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: e, width: d, height: i };
}
function Q(t, a) {
  const n = t.cards.find((e) => e.id === a);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + L(n.amount, t.forecast.currency);
}
function At(t, a) {
  const { width: n } = S(t, a.layout), e = t.forecast.target, r = tt(t), s = Math.max(e * 1.25, r), d = n - 8, i = r >= e;
  return [
    { t: "rect", x: 4, y: 42, w: d, h: 14, rx: 7, color: p.track },
    { t: "rect", x: 4, y: 42, w: d * r / s, h: 14, rx: 7, color: i ? p.accept : p.bar },
    { t: "line", x1: 4 + d * e / s, y1: 36, x2: 4 + d * e / s, y2: 62, color: p.ink, width: 2 },
    { t: "text", x: 4 + d * e / s, y: 72, text: "Target " + L(e, t.forecast.currency), color: p.ink, size: 11, anchor: "middle" }
  ];
}
const Wt = {
  laneCues: !0,
  places: (t, a) => S(t, a),
  notes: (t, a, n, e) => K(S(t, a).parts, t, n, e),
  editsBetween: J,
  layer: (t) => U(t, At),
  chooser(t, a, n, e = {}) {
    const r = et(t, a).map((s) => it(t, a, s.id));
    return r.length < 2 ? null : at(A(t, "card-" + a, n, (s) => R(S(s, e).parts), (s, d) => s.closest(r, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(d, { gapIn: 40, gapOut: 56 })), t, a, S(t, e).parts, r);
  },
  refusalAt(t, a, n, e, r) {
    const { parts: s } = S(t, r), d = t.cards.find((i) => i.id === a);
    for (const i of t.lanes) {
      if (i.id === d.laneId || !I(s.find((l) => l.name === "column-" + i.id), e)) continue;
      const o = mt(t, a, i.id);
      return o ? { laneId: i.id, reason: o } : null;
    }
    return null;
  },
  handleDrag: () => null
}, M = 48, O = 960, lt = 900;
function $(t, a = {}) {
  const n = !!a.narrow, e = t.budget.total, r = [], s = [], d = t.lanes.map((l) => t.cards.filter((c) => c.laneId === l.id).length);
  let i, o;
  if (n) {
    i = Math.max(300, a.width ?? 390);
    let l = M;
    t.lanes.forEach((c, u) => {
      const x = Math.max(100 + (d[u] + 1) * 64, c.allocation / e * lt);
      s.push({ laneId: c.id, start: l, size: x }), l += x;
    }), o = l + 8;
  } else {
    i = O;
    let l = 0;
    for (const c of t.lanes)
      s.push({ laneId: c.id, start: l, size: c.allocation / e * O }), l += c.allocation / e * O;
    o = M + 100 + (Math.max(...d) + 1) * 64;
  }
  return t.lanes.forEach((l, c) => {
    const { start: u, size: x } = s[c], m = E[c % E.length], f = n ? { x: 2, y: u + 1, width: i - 4, height: x - 2 } : { x: u + 1, y: M, width: Math.max(4, x - 2), height: o - M }, h = { x: f.x + 5, y: f.y, width: Math.max(10, f.width - 10) };
    if (r.push({ name: "column-" + l.id, ...f, fill: v(m, 0.6), line: v(m, 0.1) }), r.push({ name: "lane-" + l.id, x: h.x, y: h.y + 6, width: n ? h.width * 0.5 : h.width, height: 32, text: l.label, fill: m, fontSize: 15 }), r.push({
      name: "caption-" + l.id,
      x: n ? h.x + h.width * 0.5 + 6 : h.x,
      y: h.y + (n ? 6 : 40),
      width: n ? h.width * 0.5 - 6 : h.width,
      height: 40,
      text: yt(t, l.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: 12
    }), t.cards.filter((g) => g.laneId === l.id).forEach((g, y) => r.push({
      name: "card-" + g.id,
      x: h.x,
      y: h.y + 100 + y * 64,
      width: h.width,
      height: 56,
      text: g.label + `
` + L(g.amount, t.budget.currency),
      fontSize: 14
    })), c < t.lanes.length - 1) {
      const g = u + x;
      r.push(n ? { name: "handle-" + l.id, x: i - 96, y: g - 22, width: 88, height: 44 } : { name: "handle-" + l.id, x: g - 22, y: M - 6, width: 44, height: 48 });
    }
  }), { parts: r, width: i, height: o, segments: s, narrow: n };
}
function _t(t, a) {
  const n = $(t, a.layout), e = t.budget.total, r = [{ t: "text", x: 4, y: 28, text: vt(t), color: p.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((s, d) => {
    const i = n.segments[d], o = s.allocation, l = wt(t, s.id);
    if (n.narrow) {
      const c = i.start + 50, u = 8, x = n.width - 16;
      r.push({ t: "rect", x: u, y: c, w: x, h: 10, rx: 5, color: p.track }), r.push({ t: "rect", x: u, y: c, w: x * l / o || 0, h: 10, rx: 5, color: p.bar }), s.floor !== void 0 && r.push({ t: "line", x1: u + x * s.floor / o, y1: c - 4, x2: u + x * s.floor / o, y2: c + 14, color: p.ink, width: 2 });
    } else {
      const c = O / e, u = M + 86;
      r.push({ t: "rect", x: i.start + 6, y: u, w: i.size - 12, h: 10, rx: 5, color: p.track }), r.push({ t: "rect", x: i.start + 6, y: u, w: Math.max(0, (i.size - 12) * l / o || 0), h: 10, rx: 5, color: p.bar }), s.floor !== void 0 && r.push({ t: "line", x1: i.start + s.floor * c, y1: u - 6, x2: i.start + s.floor * c, y2: u + 16, color: p.ink, width: 2 }), s.cap !== void 0 && i.start + s.cap * c <= n.width && r.push({ t: "line", x1: i.start + s.cap * c, y1: u - 6, x2: i.start + s.cap * c, y2: u + 16, color: p.refuse, width: 2, dash: "3 2" });
    }
    if (d < t.lanes.length - 1) {
      const c = i.start + i.size;
      r.push(n.narrow ? { t: "line", x1: 2, y1: c, x2: n.width - 2, y2: c, color: p.ink, width: 2 } : { t: "line", x1: c, y1: M, x2: c, y2: n.height, color: p.ink, width: 2 }), r.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: p.ink } : { t: "rect", x: c - 4, y: M + 2, w: 8, h: 30, rx: 4, color: p.ink });
    }
  }), a.clamp) {
    const s = n.parts.find((d) => d.name === a.clamp.name);
    s && r.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(s.x + 22, 120), n.width - 120),
      y: n.narrow ? s.y + 8 : M - 12,
      text: a.clamp.text,
      color: p.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return r;
}
const Ot = (t, a) => Math.round(t / a) * a, Rt = {
  laneCues: !0,
  notes: (t, a, n, e) => K($(t, a).parts, t, n, e),
  editsBetween: J,
  label: st,
  places(t, a) {
    const { parts: n, width: e, height: r } = $(t, a);
    return { parts: n, width: e, height: r };
  },
  layer: (t) => U(t, _t),
  chooser(t, a, n, e = {}) {
    const r = et(t, a).map((s) => it(t, a, s.id));
    return r.length < 2 ? null : at(A(t, "card-" + a, n, (s) => R($(s, e).parts), (s, d) => s.closest(r).withFloating({ ghost: { opacity: 0.3 } }).whenFar(d)), t, a, $(t, e).parts, r);
  },
  refusalAt(t, a, n, e, r) {
    const { parts: s } = $(t, r), d = t.cards.find((i) => i.id === a);
    for (const i of t.lanes) {
      if (i.id === d.laneId || !I(s.find((l) => l.name === "column-" + i.id), e)) continue;
      const o = pt(t, a, i.id);
      return o ? { laneId: i.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, a, n, e) {
    const r = a.slice(7), s = t.lanes.findIndex((f) => f.id === r), d = t.lanes[s + 1];
    if (s < 0 || !d) return null;
    const i = gt(t, { laneId: r }), o = t.budget.step, l = (f) => {
      const h = Math.min(i.max, Math.max(i.min, Ot(f, o)));
      return j(t, d.id, r, h);
    }, c = $(t, e), u = c.narrow ? lt / t.budget.total : O / t.budget.total, x = c.parts.find((f) => f.name === a), m = A(t, a, n, (f) => R($(f, e).parts), (f) => f.varyFunc([0], ([h]) => j(t, d.id, r, h), { constraint: (h) => [
      ...ft([i.min, h.lanes[s].allocation - t.lanes[s].allocation, i.max])
    ] }));
    return (f) => {
      const g = (c.narrow ? f.y - n.y - x.y : f.x - n.x - x.x) / u, y = m?.(f), w = y ? y.lanes[s].allocation - t.lanes[s].allocation : g, k = { next: l(w) };
      return g > i.max + o / 2 ? { ...k, clampedReason: i.reasons.max } : g < i.min - o / 2 ? { ...k, clampedReason: i.reasons.min } : k;
    };
  },
  keyEdit(t, a, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const e = /^handle-(.+)$/.exec(a)?.[1], r = t.lanes.findIndex((l) => l.id === e), s = t.lanes[r + 1];
    if (r < 0 || !s) return null;
    const d = n === "ArrowRight" || n === "ArrowDown", i = t.budget.step;
    return [d ? { kind: "shift_budget", from: { id: s.id }, to: { id: e }, amount: i } : { kind: "shift_budget", from: { id: e }, to: { id: s.id }, amount: i }];
  }
}, Ft = { "launch-plan": rt, pipeline: Wt, budget: Rt };
function Dt(t) {
  const a = Ft[t];
  if (!a) throw new Error(`No board kit for "${t}". Only a launch plan, a pipeline and a budget have one.`);
  return a;
}
function Pt(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Pt as boardLayoutFor,
  vt as budgetHeader,
  Rt as budgetKit,
  $ as budgetLayout,
  U as createBoardLayer,
  st as handleLabel,
  Dt as kitFor,
  b as launchLayout,
  Mt as launchLinkTargets,
  rt as launchPlanKit,
  p as layerInk,
  K as partNotes,
  kt as pipelineGauge,
  Wt as pipelineKit,
  S as pipelineLayout,
  q as renderLayerShapes,
  J as workshopEditsBetween
};
