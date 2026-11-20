import { Vec2 as K, getElementPositionCheap as ct, translate as ht, dragSpecToBehavior as dt, param as P, moreThan as N, lessThan as V, inOrder as ut } from "./dragology.mjs";
import { money as b, pipelineForecast as q, launchLinkRefusal as Q, launchPlanLimits as B, withTaskValue as W, launchOverrun as D, scheduleLaunch as H, laneColors as E, launchFinish as T, withLink as ft, pipelineRefusal as xt, workshopDestinations as tt, workshopCandidate as nt, pipelineCaption as Y, budgetLimits as mt, budgetRefusal as gt, budgetCaption as pt, shiftBudget as Z, budgetCommitted as yt } from "./workshop-model.mjs";
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
}, et = "http://www.w3.org/2000/svg", j = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function z(t, a, n) {
  const e = document.createElementNS(et, t);
  for (const [r, s] of Object.entries(a)) e.setAttribute(r, String(s));
  return n?.fill && (e.setAttribute("fill", j(n.fill)), e.style.setProperty("fill", n.fill)), n?.stroke && (e.setAttribute("stroke", j(n.stroke)), e.style.setProperty("stroke", n.stroke)), e;
}
function wt(t, a, n) {
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
        const { cardId: r, waitsOn: s, label: h } = e.unlink, i = z("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 12,
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": s + ">" + r,
          "aria-label": h,
          role: "button"
        }, { stroke: "transparent" });
        i.addEventListener("pointerdown", (l) => l.stopPropagation()), i.addEventListener("click", (l) => {
          l.stopPropagation(), n(r, s);
        }), t.appendChild(i);
      }
      if (t.appendChild(z("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: r, y: s, angle: h } = e.arrow;
        t.appendChild(z("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${r} ${s}) rotate(${h})`, "pointer-events": "none" }, { fill: e.color }));
      }
    }
}
function G(t, a) {
  const n = t?.canvas?.node, e = document.createElementNS(et, "g");
  e.setAttribute("data-board-layer", ""), e.setAttribute("pointer-events", "none");
  let r = !1;
  return {
    draw(s, h, i) {
      if (r || !n) return;
      const { origin: l } = i;
      e.setAttribute("transform", `translate(${l.x} ${l.y})`), wt(e, a(h ?? s, i, s), i.onUnlink);
      const o = i.above && i.above.parentNode === n ? i.above : null, c = o ? o.nextSibling : n.firstChild;
      (e.parentNode !== n || e.previousSibling !== o) && n.insertBefore(e, c === e ? e.nextSibling : c);
    },
    destroy() {
      r = !0, e.remove();
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
    draggable: (o) => (s ?? (s = o.d), e(o.state)),
    draggedPath: a + "/",
    draggedId: a,
    anchorPos: K(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!ct(i, t) || !s) return null;
  const l = dt(r(s, t), i);
  return (o) => l({ pointer: K(o.x, o.y) }).dropState;
}
const I = (t, a, n = 0) => !!t && a.x >= t.x - n && a.x <= t.x + t.width + n && a.y >= t.y - n && a.y <= t.y + t.height + n;
function it(t, a, n, e, r) {
  if (!t) return null;
  const s = a.cards.find((h) => h.id === n).laneId;
  return (h) => {
    const i = t(h);
    if (i !== a && JSON.stringify(i) !== JSON.stringify(a)) return i;
    const l = e.find((o) => o.name.startsWith("column-") && o.name !== "column-" + s && I(o, h));
    return l && r.find((o) => o.cards.find((c) => c.id === n).laneId === l.name.slice(7)) || i;
  };
}
function v(t, a) {
  const n = (e) => Math.round(parseInt(t.slice(e, e + 2), 16) * (1 - a) + 255 * a).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function U(t, a) {
  const n = [], e = new Map(t.cards.map((i) => [i.id, i]));
  for (const i of a.cards) {
    const l = e.get(i.id), o = { id: i.id };
    if (!l) {
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
    l.label !== i.label && n.push({ kind: "rename_card", card: o, label: i.label });
    const c = n.length;
    for (const u of l.dependsOn ?? []) i.dependsOn?.includes(u) || n.push({ kind: "unlink_tasks", card: o, waitsOn: { id: u } });
    for (const u of i.dependsOn ?? []) l.dependsOn?.includes(u) || n.push({ kind: "link_tasks", card: o, waitsOn: { id: u } });
    l.laneId !== i.laneId && n.push({ kind: "move_card", card: o, lane: { id: i.laneId } }), (n.length > c && i.duration !== void 0 && n.slice(c).some((u) => u.kind !== "move_card") || l.duration !== i.duration || (l.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: o, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && l.amount !== i.amount && n.push({ kind: "set_amount", card: o, amount: i.amount });
  }
  for (const i of t.cards) a.cards.some((l) => l.id === i.id) || n.push({ kind: "remove_card", card: { id: i.id } });
  a.launch && t.launch?.day !== a.launch.day && n.push({ kind: "set_launch_day", day: a.launch.day }), a.forecast && t.forecast?.target !== a.forecast.target && n.push({ kind: "set_target", amount: a.forecast.target });
  const r = a.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (t.lanes.find((l) => l.id === i.id)?.allocation ?? 0) })), s = r.filter((i) => i.by < 0), h = r.filter((i) => i.by > 0);
  for (const i of h)
    for (const l of s) {
      const o = Math.min(i.by, -l.by);
      o <= 0 || (n.push({ kind: "shift_budget", from: { id: l.id }, to: { id: i.id }, amount: o }), i.by -= o, l.by += o);
    }
  for (const i of a.lanes) {
    const l = t.lanes.find((o) => o.id === i.id);
    l && l.label !== i.label && n.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label });
  }
  return n;
}
function kt(t) {
  const a = t.forecast?.currency;
  return `Forecast ${b(q(t), a)} of ${b(t.forecast?.target ?? 0, a)}`;
}
function vt(t) {
  return `${b(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Mt(t, a) {
  return t.cards.filter((n) => Q(t, a, n.id) === null).map((n) => n.id);
}
function $t(t, a, n, e) {
  for (let r = a; r > 11; r--) {
    const s = Math.max(1, Math.floor(n / (r * 0.55)));
    if (t.split(`
`).reduce((i, l) => i + Math.max(1, Math.ceil(l.length / s)), 0) * r * 1.3 <= e) return r;
  }
  return Math.min(a, 11);
}
function J(t, a, n, e) {
  const r = e.textColor ?? "#18302d", s = e.borderColor ?? "#667872", h = e.fontSize ?? 14;
  return t.map((i) => {
    const l = i.name.startsWith("handle-"), o = i.text ?? "";
    return { options: {
      id: i.name,
      text: o,
      name: a.cards.find((c) => "card-" + c.id === i.name)?.label ?? o,
      xPos: n.x + i.x,
      yPos: n.y + i.y,
      width: i.width,
      height: i.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${i.width} V ${i.height} H 0 Z`,
      backgroundColor: l ? "transparent" : i.fill ?? e.backgroundColor ?? "#fffdf6",
      foregroundColor: i.ink ?? r,
      borderColor: i.line ?? s,
      borderWidth: l ? 0 : i.lineWidth ?? 1,
      ...e.fontFamily ? { fontFamily: e.fontFamily } : {},
      fontSize: $t(o, i.fontSize ?? h, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function at(t, a) {
  const n = a.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const e = t.cards.find((s) => s.id === n);
  if (e) return `${e.label} length, ${e.duration} days. Left and Right change it.`;
  const r = t.lanes.findIndex((s) => s.id === n);
  return r >= 0 && t.lanes[r + 1] ? `Divider between ${t.lanes[r].label} and ${t.lanes[r + 1].label}. Left and Right move money.` : null;
}
const st = "#c2410c", zt = 32;
function L(t, a = {}) {
  const n = !!a.narrow, e = t.launch.day, r = H(t), s = [], h = /* @__PURE__ */ new Map(), i = n ? Math.max(300, a.width ?? 390) : Math.max(720, a.width ?? 1200), l = n ? 8 : 168, o = n ? (i - 88) / e : (i - l - 40) / e, c = (d) => E[t.lanes.findIndex((g) => g.id === d) % E.length], u = (d, g) => {
    const y = t.cards.find((rt) => rt.id === d), w = r.get(d), k = { x: l + w.start * o, y: g, width: y.duration * o, height: n ? 28 : zt };
    h.set(d, k), s.push({
      name: "card-" + d,
      ...k,
      text: n ? "" : `${y.label} · ${y.duration}d`,
      fill: n ? c(y.laneId) : "#fffdf6",
      line: w.critical ? st : "#667872",
      lineWidth: w.critical ? 2.5 : 1,
      fontSize: 13
    }), s.push({ name: "handle-" + d, x: k.x + k.width - 22, y: k.y + k.height / 2 - 22, width: 44, height: 44 });
  };
  let x, m, f;
  if (n) {
    const d = (i - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((g, y) => {
      const w = 8 + y * (d + 8);
      s.push({ name: "column-" + g.id, x: w, y: 30, width: d, height: 72, fill: v(c(g.id), 0.6), line: v(c(g.id), 0.1) }), s.push({ name: "lane-" + g.id, x: w + 4, y: 34, width: d - 8, height: 28, text: g.label, fill: c(g.id), fontSize: 14 }), s.push({ name: "caption-" + g.id, x: w + 4, y: 64, width: d - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), f = 124, m = 130, x = 138;
    for (const g of t.cards)
      u(g.id, x + 20), x += 56;
  } else {
    f = 48, m = 56, x = m;
    for (const d of t.lanes) {
      const g = t.cards.filter((w) => w.laneId === d.id), y = Math.max(92, g.length * 44 + 20);
      s.push({ name: "column-" + d.id, x: 0, y: x, width: i, height: y, fill: v(c(d.id), 0.65), line: v(c(d.id), 0.1) }), s.push({ name: "lane-" + d.id, x: 8, y: x + 8, width: l - 24, height: 32, text: d.label, fill: c(d.id), fontSize: 15 }), s.push({ name: "caption-" + d.id, x: 8, y: x + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 12 }), g.forEach((w, k) => u(w.id, x + 10 + k * 44)), x += y + 4;
    }
  }
  return s.push({ name: "handle-launch", x: l + e * o - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: s, width: i, height: x + 8, narrow: n, x0: l, dayW: o, gridTop: m, axisY: f, bars: h };
}
function St(t, a, n) {
  for (const e of a.parts) e.name.startsWith("caption-") && (e.text = n(e.name.slice(8)));
  return a;
}
function Ct(t, a) {
  const n = t.x + t.width, e = Math.max(t.x + 4, n - 10), s = a.y + a.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, h = a.y + a.height / 2;
  return { d: `M ${e} ${s} V ${h} H ${a.x}`, arrow: { x: a.x, y: h, angle: 0 } };
}
function Lt(t, a) {
  const n = L(t, a.layout), e = t.launch.day, r = H(t), s = [];
  for (let l = 0; l <= e; l++) {
    const o = n.x0 + l * n.dayW, c = l % 7 === 0;
    !c && n.dayW < 6 || (s.push({ t: "line", x1: o, y1: n.gridTop, x2: o, y2: n.height - 8, color: c ? p.week : p.faint, width: c ? 1 : 0.5 }), c && s.push({ t: "text", x: o + 3, y: n.axisY, text: n.narrow ? "W" + (l / 7 + 1) : "Week " + (l / 7 + 1), color: p.ink, size: 11 }));
  }
  for (const l of t.cards) {
    for (const u of l.dependsOn ?? []) {
      const x = n.bars.get(u), m = n.bars.get(l.id);
      if (!x || !m) continue;
      const f = r.get(u).critical && r.get(l.id).critical, d = t.cards.find((g) => g.id === u).label;
      s.push({
        t: "path",
        ...Ct(x, m),
        color: f ? st : p.ink,
        width: f ? 2 : 1.5,
        unlink: { cardId: l.id, waitsOn: u, label: `Remove the link: ${l.label} waits on ${d}` }
      });
    }
    const o = r.get(l.id), c = n.bars.get(l.id);
    n.narrow && s.push({ t: "text", x: 8, y: c.y - 6, text: `${l.label} · ${l.duration}d`, color: p.ink, size: 13, bold: o.critical }), o.critical || s.push({ t: "text", x: c.x + c.width + 24, y: c.y + c.height / 2 + 4, text: "+" + o.slack + "d", color: p.ink, size: 11, role: "slack-" + l.id });
  }
  const h = n.x0 + e * n.dayW;
  s.push({ t: "line", x1: h, y1: n.narrow ? 112 : 26, x2: h, y2: n.height - 8, color: p.launch, width: 2, dash: "6 4" }), s.push({ t: "rect", x: h - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: p.launch });
  for (const l of t.cards) {
    const o = n.bars.get(l.id);
    s.push({ t: "rect", x: o.x + o.width - 5, y: o.y + 4, w: 4, h: o.height - 8, rx: 2, color: p.ink, opacity: 0.55 });
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
    const l = n.parts.find((o) => o.name === a.clamp.name);
    l && s.push({
      t: "text",
      x: Math.min(l.x + 40, n.width - 4),
      y: l.y + 14,
      text: a.clamp.text,
      color: p.refuse,
      size: 13,
      anchor: l.x + 40 > n.width - 160 ? "end" : "start",
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
function bt(t, a, { key: n, shiftKey: e }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const r = n === "ArrowLeft" ? -1 : 1;
  if (a === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + r }];
  const s = /^(card|handle)-(.+)$/.exec(a), h = s && t.cards.find((i) => i.id === s[2]);
  return h ? e || s[1] === "handle" ? [{ kind: "set_task", card: { id: h.id }, duration: h.duration + r }] : [{ kind: "set_task", card: { id: h.id }, lag: (h.lag ?? 0) + r }] : null;
}
const ot = {
  laneCues: !1,
  notes(t, a, n, e) {
    return J(ot.places(t, a).parts, t, n, e);
  },
  editsBetween: U,
  label: at,
  places(t, a) {
    const n = St(t, L(t, a), (e) => {
      const r = t.cards.filter((h) => h.laneId === e), s = H(t);
      return `${r.length} ${r.length === 1 ? "task" : "tasks"} · ${r.filter((h) => s.get(h.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => G(t, Lt),
  chooser(t, a, n, e = {}) {
    const r = t.cards.findIndex((s) => s.id === a);
    return r < 0 ? null : Et(t, a, r, Mt(t, a), n, e);
  },
  refusalAt(t, a, n, e, r) {
    const s = L(t, r);
    for (const o of t.cards) {
      if (o.id === a || !I(s.bars.get(o.id), e)) continue;
      const c = Q(t, a, o.id);
      return c ? { laneId: o.laneId, reason: c } : null;
    }
    const h = t.cards.find((o) => o.id === a), i = (h.lag ?? 0) + Math.round((e.x - n.x - s.bars.get(a).x) / s.dayW), l = B(t, { cardId: a, field: "lag" });
    return i > l.max ? { laneId: h.laneId, reason: D(W(t, { cardId: a, field: "lag" }, i), a) ?? l.reasons.max } : null;
  },
  handleDrag(t, a, n, e) {
    const r = L(t, e), s = (m) => R(L(m, e).parts);
    if (a === "handle-launch") {
      const m = B(t, { field: "day" }), f = A(t, a, n, s, (d, g) => d.vary(g, P("launch", "day"), { constraint: (y) => [N(y.launch.day, T(y) - 1e-3), V(y.launch.day, 120)] }).onDrop(_));
      return (d) => {
        const g = Math.round((d.x - n.x + 22 - r.x0) / r.dayW), y = f?.(d) ?? W(t, { field: "day" }, Math.min(m.max, Math.max(m.min, g)));
        return g < m.min ? { next: y, clampedReason: m.reasons.min, refusal: D(W(t, { field: "day" }, Math.max(5, g))) ?? void 0 } : { next: y };
      };
    }
    const h = a.slice(7), i = t.cards.findIndex((m) => m.id === h);
    if (i < 0) return null;
    const l = { cardId: h, field: "duration" }, o = B(t, l), c = t.launch.day, u = A(t, a, n, s, (m, f) => m.vary(f, P("cards", i, "duration"), { constraint: (d) => [N(d.cards[i].duration, 1), V(T(d), c + 1e-3)] }).onDrop(_)), x = r.bars.get(h);
    return (m) => {
      const f = Math.round((m.x - n.x + 22 - x.x) / r.dayW), d = Math.min(o.max, Math.max(o.min, f)), g = u?.(m) ?? W(t, l, d);
      return f > o.max ? { next: g, clampedReason: `Launch is day ${c}.`, refusal: D(W(t, l, Math.min(60, f)), h) ?? o.reasons.max } : f < o.min ? { next: g, clampedReason: o.reasons.min } : { next: g };
    };
  },
  keyEdit: bt
};
function Et(t, a, n, e, r, s) {
  const h = t.launch.day, i = (o) => R(L(o, s).parts, e.map((c) => "card-" + c)), l = A(t, "card-" + a, r, i, (o, c) => {
    const u = s.narrow ? c.lanes.filter((m) => m.id === c.cards[n].laneId) : c.lanes, x = o.closest(u.map((m) => o.vary(
      { ...c, cards: c.cards.map((f, d) => d === n ? { ...f, laneId: m.id, lag: f.lag ?? 0 } : f) },
      P("cards", n, "lag"),
      { constraint: (f) => [N(f.cards[n].lag ?? 0, -1e-3), V(T(f), h + 1e-3)] }
    )));
    return e.length ? o.closest(e.map((m) => o.dropTarget("target-" + m, ft(c, a, m)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop(_) : x.onDrop(_);
  });
  return l ? (o) => _(l(o)) : null;
}
const S = 76;
function C(t, a = {}) {
  const n = !!a.narrow, e = [], r = t.lanes.map((l) => t.cards.filter((o) => o.laneId === l.id).length), s = (l) => t.lanes[l].role === "won" ? "#bfe3cf" : t.lanes[l].role === "lost" ? "#e4dcdc" : E[l % E.length];
  let h, i;
  if (n) {
    h = Math.max(300, a.width ?? 390);
    let l = S;
    t.lanes.forEach((o, c) => {
      const u = 76 + (r[c] + 1) * 64;
      e.push({ name: "column-" + o.id, x: 2, y: l, width: h - 4, height: u, fill: v(s(c), 0.6), line: v(s(c), 0.1) }), e.push({ name: "lane-" + o.id, x: 8, y: l + 6, width: (h - 16) * 0.45, height: 36, text: o.label, fill: s(c), fontSize: 15 }), e.push({ name: "caption-" + o.id, x: 8 + (h - 16) * 0.45 + 6, y: l + 6, width: (h - 16) * 0.55 - 6, height: 36, text: Y(t, o.id), fill: "transparent", lineWidth: 0, fontSize: 12 }), t.cards.filter((x) => x.laneId === o.id).forEach((x, m) => e.push({ name: "card-" + x.id, x: 8, y: l + 52 + m * 64, width: h - 16, height: 56, text: X(t, x.id), fontSize: 15 })), l += u + 10;
    }), i = l;
  } else {
    const c = 98 + (Math.max(...r) + 1) * 88;
    t.lanes.forEach((u, x) => {
      const m = x * 244;
      e.push({ name: "column-" + u.id, x: m + 2, y: S, width: 240, height: c, fill: v(s(x), 0.6), line: v(s(x), 0.1) }), e.push({ name: "lane-" + u.id, x: m + 8, y: S + 6, width: 228, height: 58, text: u.label, fill: s(x), fontSize: 16 }), e.push({ name: "caption-" + u.id, x: m + 8, y: S + 66, width: 228, height: 30, text: Y(t, u.id), fill: "transparent", lineWidth: 0, fontSize: 13 }), t.cards.filter((f) => f.laneId === u.id).forEach((f, d) => e.push({ name: "card-" + f.id, x: m + 8, y: S + 98 + d * 88, width: 228, height: 76, text: X(t, f.id), fontSize: 15 }));
    }), h = t.lanes.length * 244, i = S + c;
  }
  return e.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(h, 520), height: 34, text: kt(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: e, width: h, height: i };
}
function X(t, a) {
  const n = t.cards.find((e) => e.id === a);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + b(n.amount, t.forecast.currency);
}
function At(t, a) {
  const { width: n } = C(t, a.layout), e = t.forecast.target, r = q(t), s = Math.max(e * 1.25, r), h = n - 8, i = r >= e;
  return [
    { t: "rect", x: 4, y: 42, w: h, h: 14, rx: 7, color: p.track },
    { t: "rect", x: 4, y: 42, w: h * r / s, h: 14, rx: 7, color: i ? p.accept : p.bar },
    { t: "line", x1: 4 + h * e / s, y1: 36, x2: 4 + h * e / s, y2: 62, color: p.ink, width: 2 },
    { t: "text", x: 4 + h * e / s, y: 72, text: "Target " + b(e, t.forecast.currency), color: p.ink, size: 11, anchor: "middle" }
  ];
}
const Wt = {
  laneCues: !0,
  places: (t, a) => C(t, a),
  notes: (t, a, n, e) => J(C(t, a).parts, t, n, e),
  editsBetween: U,
  layer: (t) => G(t, At),
  chooser(t, a, n, e = {}) {
    const r = tt(t, a).map((s) => nt(t, a, s.id));
    return r.length < 2 ? null : it(A(t, "card-" + a, n, (s) => R(C(s, e).parts), (s, h) => s.closest(r, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(h, { gapIn: 40, gapOut: 56 })), t, a, C(t, e).parts, r);
  },
  refusalAt(t, a, n, e, r) {
    const { parts: s } = C(t, r), h = t.cards.find((i) => i.id === a);
    for (const i of t.lanes) {
      if (i.id === h.laneId || !I(s.find((o) => o.name === "column-" + i.id), e)) continue;
      const l = xt(t, a, i.id);
      return l ? { laneId: i.id, reason: l } : null;
    }
    return null;
  },
  handleDrag: () => null
}, M = 48, O = 960, lt = 900;
function $(t, a = {}) {
  const n = !!a.narrow, e = t.budget.total, r = [], s = [], h = t.lanes.map((o) => t.cards.filter((c) => c.laneId === o.id).length);
  let i, l;
  if (n) {
    i = Math.max(300, a.width ?? 390);
    let o = M;
    t.lanes.forEach((c, u) => {
      const x = Math.max(100 + (h[u] + 1) * 64, c.allocation / e * lt);
      s.push({ laneId: c.id, start: o, size: x }), o += x;
    }), l = o + 8;
  } else {
    i = O;
    let o = 0;
    for (const c of t.lanes)
      s.push({ laneId: c.id, start: o, size: c.allocation / e * O }), o += c.allocation / e * O;
    l = M + 100 + (Math.max(...h) + 1) * 64;
  }
  return t.lanes.forEach((o, c) => {
    const { start: u, size: x } = s[c], m = E[c % E.length], f = n ? { x: 2, y: u + 1, width: i - 4, height: x - 2 } : { x: u + 1, y: M, width: Math.max(4, x - 2), height: l - M }, d = { x: f.x + 5, y: f.y, width: Math.max(10, f.width - 10) };
    if (r.push({ name: "column-" + o.id, ...f, fill: v(m, 0.6), line: v(m, 0.1) }), r.push({ name: "lane-" + o.id, x: d.x, y: d.y + 6, width: n ? d.width * 0.5 : d.width, height: 32, text: o.label, fill: m, fontSize: 15 }), r.push({
      name: "caption-" + o.id,
      x: n ? d.x + d.width * 0.5 + 6 : d.x,
      y: d.y + (n ? 6 : 40),
      width: n ? d.width * 0.5 - 6 : d.width,
      height: 40,
      text: pt(t, o.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: 12
    }), t.cards.filter((g) => g.laneId === o.id).forEach((g, y) => r.push({
      name: "card-" + g.id,
      x: d.x,
      y: d.y + 100 + y * 64,
      width: d.width,
      height: 56,
      text: g.label + `
` + b(g.amount, t.budget.currency),
      fontSize: 14
    })), c < t.lanes.length - 1) {
      const g = u + x;
      r.push(n ? { name: "handle-" + o.id, x: i - 96, y: g - 22, width: 88, height: 44 } : { name: "handle-" + o.id, x: g - 22, y: M - 6, width: 44, height: 48 });
    }
  }), { parts: r, width: i, height: l, segments: s, narrow: n };
}
function _t(t, a) {
  const n = $(t, a.layout), e = t.budget.total, r = [{ t: "text", x: 4, y: 28, text: vt(t), color: p.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((s, h) => {
    const i = n.segments[h], l = s.allocation, o = yt(t, s.id);
    if (n.narrow) {
      const c = i.start + 50, u = 8, x = n.width - 16;
      r.push({ t: "rect", x: u, y: c, w: x, h: 10, rx: 5, color: p.track }), r.push({ t: "rect", x: u, y: c, w: x * o / l || 0, h: 10, rx: 5, color: p.bar }), s.floor !== void 0 && r.push({ t: "line", x1: u + x * s.floor / l, y1: c - 4, x2: u + x * s.floor / l, y2: c + 14, color: p.ink, width: 2 });
    } else {
      const c = O / e, u = M + 86;
      r.push({ t: "rect", x: i.start + 6, y: u, w: i.size - 12, h: 10, rx: 5, color: p.track }), r.push({ t: "rect", x: i.start + 6, y: u, w: Math.max(0, (i.size - 12) * o / l || 0), h: 10, rx: 5, color: p.bar }), s.floor !== void 0 && r.push({ t: "line", x1: i.start + s.floor * c, y1: u - 6, x2: i.start + s.floor * c, y2: u + 16, color: p.ink, width: 2 }), s.cap !== void 0 && i.start + s.cap * c <= n.width && r.push({ t: "line", x1: i.start + s.cap * c, y1: u - 6, x2: i.start + s.cap * c, y2: u + 16, color: p.refuse, width: 2, dash: "3 2" });
    }
    if (h < t.lanes.length - 1) {
      const c = i.start + i.size;
      r.push(n.narrow ? { t: "line", x1: 2, y1: c, x2: n.width - 2, y2: c, color: p.ink, width: 2 } : { t: "line", x1: c, y1: M, x2: c, y2: n.height, color: p.ink, width: 2 }), r.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: p.ink } : { t: "rect", x: c - 4, y: M + 2, w: 8, h: 30, rx: 4, color: p.ink });
    }
  }), a.clamp) {
    const s = n.parts.find((h) => h.name === a.clamp.name);
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
  notes: (t, a, n, e) => J($(t, a).parts, t, n, e),
  editsBetween: U,
  label: at,
  places(t, a) {
    const { parts: n, width: e, height: r } = $(t, a);
    return { parts: n, width: e, height: r };
  },
  layer: (t) => G(t, _t),
  chooser(t, a, n, e = {}) {
    const r = tt(t, a).map((s) => nt(t, a, s.id));
    return r.length < 2 ? null : it(A(t, "card-" + a, n, (s) => R($(s, e).parts), (s, h) => s.closest(r).withFloating({ ghost: { opacity: 0.3 } }).whenFar(h)), t, a, $(t, e).parts, r);
  },
  refusalAt(t, a, n, e, r) {
    const { parts: s } = $(t, r), h = t.cards.find((i) => i.id === a);
    for (const i of t.lanes) {
      if (i.id === h.laneId || !I(s.find((o) => o.name === "column-" + i.id), e)) continue;
      const l = gt(t, a, i.id);
      return l ? { laneId: i.id, reason: l } : null;
    }
    return null;
  },
  handleDrag(t, a, n, e) {
    const r = a.slice(7), s = t.lanes.findIndex((f) => f.id === r), h = t.lanes[s + 1];
    if (s < 0 || !h) return null;
    const i = mt(t, { laneId: r }), l = t.budget.step, o = (f) => {
      const d = Math.min(i.max, Math.max(i.min, Ot(f, l)));
      return Z(t, h.id, r, d);
    }, c = $(t, e), u = c.narrow ? lt / t.budget.total : O / t.budget.total, x = c.parts.find((f) => f.name === a), m = A(t, a, n, (f) => R($(f, e).parts), (f) => f.varyFunc([0], ([d]) => Z(t, h.id, r, d), { constraint: (d) => [
      ...ut([i.min, d.lanes[s].allocation - t.lanes[s].allocation, i.max])
    ] }));
    return (f) => {
      const g = (c.narrow ? f.y - n.y - x.y : f.x - n.x - x.x) / u, y = m?.(f), w = y ? y.lanes[s].allocation - t.lanes[s].allocation : g, k = { next: o(w) };
      return g > i.max + l / 2 ? { ...k, clampedReason: i.reasons.max } : g < i.min - l / 2 ? { ...k, clampedReason: i.reasons.min } : k;
    };
  },
  keyEdit(t, a, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const e = /^handle-(.+)$/.exec(a)?.[1], r = t.lanes.findIndex((o) => o.id === e), s = t.lanes[r + 1];
    if (r < 0 || !s) return null;
    const h = n === "ArrowRight" || n === "ArrowDown", i = t.budget.step;
    return [h ? { kind: "shift_budget", from: { id: s.id }, to: { id: e }, amount: i } : { kind: "shift_budget", from: { id: e }, to: { id: s.id }, amount: i }];
  }
}, Ft = { "launch-plan": ot, pipeline: Wt, budget: Rt };
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
  G as createBoardLayer,
  at as handleLabel,
  Dt as kitFor,
  L as launchLayout,
  Mt as launchLinkTargets,
  ot as launchPlanKit,
  p as layerInk,
  J as partNotes,
  kt as pipelineGauge,
  Wt as pipelineKit,
  C as pipelineLayout,
  wt as renderLayerShapes,
  U as workshopEditsBetween
};
