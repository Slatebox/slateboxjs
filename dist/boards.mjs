import { Vec2 as Q, getElementPositionCheap as kt, translate as vt, dragSpecToBehavior as Mt, param as G, moreThan as J, lessThan as U, inOrder as St } from "./dragology.mjs";
import { laneColors as E, workshopDestinations as lt, workshopCandidate as rt } from "./workshop-model.mjs";
import { money as A, pipelineForecast as ct, launchLinkRefusal as ht, launchPlanLimits as D, withTaskValue as _, launchOverrun as H, scheduleLaunch as Y, launchFinish as N, withLink as zt, pipelineRefusal as Ct, pipelineCaption as tt, budgetLimits as Lt, budgetRefusal as $t, budgetCaption as nt, shiftBudget as et, budgetCommitted as bt } from "./workshop-rules.mjs";
import { amountLimits as an, amountOf as on, amountRules as sn, budgetRules as ln, budgetShiftLimits as rn, budgetShiftRefusal as cn, currencyOf as hn, days as dn, downstreamTasks as un, launchPlanCaption as fn, launchPlanRefusal as xn, launchPlanRules as mn, launchTaskText as pn, nextCardId as gn, noteNumbers as yn, ownField as wn, pipelineLimits as kn, pipelineRules as vn, planBudgetMove as Mn, planLaunchPlanMove as Sn, planPipelineMove as zn, readNoteNumbers as Cn, renamedNumbers as Ln, sampleBudget as $n, sampleLaunchPlan as bn, samplePipeline as En, validateBudget as An, validateLaunchPlan as Rn, validatePipeline as On } from "./workshop-rules.mjs";
import T from "react";
const y = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, K = "http://www.w3.org/2000/svg", it = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function C(t, i, n) {
  const e = document.createElementNS(K, t);
  for (const [s, o] of Object.entries(i)) e.setAttribute(s, String(o));
  return n?.fill && (e.setAttribute("fill", it(n.fill)), e.style.setProperty("fill", n.fill)), n?.stroke && (e.setAttribute("stroke", it(n.stroke)), e.style.setProperty("stroke", n.stroke)), e;
}
function at(t, i, n) {
  for (; t.firstChild; ) t.removeChild(t.firstChild);
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
        ...e.opacity !== void 0 ? { opacity: e.opacity } : {}
      }, { fill: e.color }));
    else if (e.t === "text") {
      const s = C("text", {
        x: e.x,
        y: e.y,
        "font-size": e.size ?? 13,
        "text-anchor": e.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...e.bold ? { "font-weight": 600 } : {},
        ...e.role ? { "data-board-layer": e.role } : {}
      }, { fill: e.color });
      e.lines && e.lines.length > 1 ? e.lines.forEach((o, c) => {
        const a = C("tspan", { x: e.x, dy: c ? e.lineHeight ?? Math.round((e.size ?? 13) * 1.25) : 0 });
        a.textContent = c < e.lines.length - 1 ? o + " " : o, s.appendChild(a);
      }) : s.textContent = e.text, t.appendChild(s);
    } else {
      if (e.unlink && n) {
        const { cardId: s, waitsOn: o, label: c } = e.unlink, a = C("path", {
          d: e.d,
          fill: "none",
          "stroke-width": 12,
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": o + ">" + s,
          "aria-label": c,
          role: "button"
        }, { stroke: "transparent" });
        a.addEventListener("pointerdown", (r) => r.stopPropagation()), a.addEventListener("click", (r) => {
          r.stopPropagation(), n(s, o);
        }), t.appendChild(a);
      }
      if (t.appendChild(C("path", { d: e.d, fill: "none", "stroke-width": e.width ?? 1.5, "pointer-events": "none" }, { stroke: e.color })), e.arrow) {
        const { x: s, y: o, angle: c } = e.arrow;
        t.appendChild(C("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${s} ${o}) rotate(${c})`, "pointer-events": "none" }, { fill: e.color }));
      }
    }
}
function Z(t, i) {
  const n = t?.canvas?.node, e = document.createElementNS(K, "g");
  e.setAttribute("data-board-layer", ""), e.setAttribute("pointer-events", "none");
  const s = document.createElementNS(K, "g");
  s.setAttribute("data-board-layer-top", ""), s.setAttribute("pointer-events", "none");
  let o = !1;
  return {
    draw(c, a, r) {
      if (o || !n) return;
      const { origin: l } = r, h = i(a ?? c, r, c), x = (d) => d.t === "text" && (d.role === "clamp" || d.role === "refusal");
      for (const d of [e, s]) d.setAttribute("transform", `translate(${l.x} ${l.y})`);
      at(e, h.filter((d) => !x(d)), r.onUnlink), at(s, h.filter(x));
      const p = r.above && r.above.parentNode === n ? r.above : null, m = p ? p.nextSibling : n.firstChild;
      (e.parentNode !== n || e.previousSibling !== p) && n.insertBefore(e, m === e ? e.nextSibling : m), s.firstChild && n.lastChild !== s ? n.appendChild(s) : !s.firstChild && s.parentNode && s.remove();
    },
    destroy() {
      o = !0, e.remove(), s.remove();
    }
  };
}
function I(t, i = []) {
  const n = t.filter((e) => e.name.startsWith("card-") || e.name.startsWith("handle-"));
  return T.createElement(
    "g",
    null,
    ...n.map((e) => /* @__PURE__ */ T.createElement("g", { id: e.name, transform: vt(e.x, e.y) }, /* @__PURE__ */ T.createElement("rect", { width: e.width, height: e.height }))),
    ...t.filter((e) => i.includes(e.name)).map((e) => /* @__PURE__ */ T.createElement("rect", { id: "target-" + e.name.slice(5), x: e.x, y: e.y, width: e.width, height: e.height }))
  );
}
function R(t, i, n, e, s) {
  let o;
  const a = {
    draggable: (l) => (o ?? (o = l.d), e(l.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: Q(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!kt(a, t) || !o) return null;
  const r = Mt(s(o, t), a);
  return (l) => r({ pointer: Q(l.x, l.y) }).dropState;
}
const F = (t, i, n = 0) => !!t && i.x >= t.x - n && i.x <= t.x + t.width + n && i.y >= t.y - n && i.y <= t.y + t.height + n;
function dt(t, i, n, e, s) {
  if (!t) return null;
  const o = i.cards.find((c) => c.id === n).laneId;
  return (c) => {
    const a = t(c);
    if (a !== i && JSON.stringify(a) !== JSON.stringify(i)) return a;
    const r = e.find((l) => l.name.startsWith("column-") && l.name !== "column-" + o && F(l, c));
    return r && s.find((l) => l.cards.find((h) => h.id === n).laneId === r.name.slice(7)) || a;
  };
}
function v(t, i) {
  const n = (e) => Math.round(parseInt(t.slice(e, e + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function j(t, i) {
  const n = [], e = new Map(t.cards.map((a) => [a.id, a]));
  for (const a of i.cards) {
    const r = e.get(a.id), l = { id: a.id };
    if (!r) {
      n.push({
        kind: "add_card",
        lane: { id: a.laneId },
        label: a.label,
        ...a.duration !== void 0 && { duration: a.duration },
        ...a.lag && { lag: a.lag },
        ...a.dependsOn && { waitsOn: a.dependsOn.map((x) => ({ id: x })) },
        ...a.amount !== void 0 && { amount: a.amount }
      });
      continue;
    }
    r.label !== a.label && n.push({ kind: "rename_card", card: l, label: a.label });
    const h = n.length;
    for (const x of r.dependsOn ?? []) a.dependsOn?.includes(x) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: x } });
    for (const x of a.dependsOn ?? []) r.dependsOn?.includes(x) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: x } });
    r.laneId !== a.laneId && n.push({ kind: "move_card", card: l, lane: { id: a.laneId } }), (n.length > h && a.duration !== void 0 && n.slice(h).some((x) => x.kind !== "move_card") || r.duration !== a.duration || (r.lag ?? 0) !== (a.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: a.duration, lag: a.lag ?? 0 }), a.amount !== void 0 && r.amount !== a.amount && n.push({ kind: "set_amount", card: l, amount: a.amount });
  }
  for (const a of t.cards) i.cards.some((r) => r.id === a.id) || n.push({ kind: "remove_card", card: { id: a.id } });
  i.launch && t.launch?.day !== i.launch.day && n.push({ kind: "set_launch_day", day: i.launch.day }), i.forecast && t.forecast?.target !== i.forecast.target && n.push({ kind: "set_target", amount: i.forecast.target });
  const s = i.lanes.map((a) => ({ id: a.id, by: (a.allocation ?? 0) - (t.lanes.find((r) => r.id === a.id)?.allocation ?? 0) })), o = s.filter((a) => a.by < 0), c = s.filter((a) => a.by > 0);
  for (const a of c)
    for (const r of o) {
      const l = Math.min(a.by, -r.by);
      l <= 0 || (n.push({ kind: "shift_budget", from: { id: r.id }, to: { id: a.id }, amount: l }), a.by -= l, r.by += l);
    }
  for (const a of i.lanes) {
    const r = t.lanes.find((l) => l.id === a.id);
    r && r.label !== a.label && n.push({ kind: "rename_lane", lane: { id: a.id }, label: a.label });
  }
  return n;
}
function Et(t) {
  const i = t.forecast?.currency;
  return `Forecast ${A(ct(t), i)} of ${A(t.forecast?.target ?? 0, i)}`;
}
function At(t) {
  return `${A(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Rt(t, i) {
  return t.cards.filter((n) => ht(t, i, n.id) === null).map((n) => n.id);
}
function Ot(t, i, n, e) {
  for (let s = i; s > 11; s--) {
    const o = Math.max(1, Math.floor(n / (s * 0.55)));
    if (t.split(`
`).reduce((a, r) => a + Math.max(1, Math.ceil(r.length / o)), 0) * s * 1.3 <= e) return s;
  }
  return Math.min(i, 11);
}
function X(t, i, n, e) {
  const s = e.textColor ?? "#18302d", o = e.borderColor ?? "#667872", c = e.fontSize ?? 14;
  return t.map((a) => {
    const r = a.name.startsWith("handle-"), l = a.text ?? "";
    return { options: {
      id: a.name,
      text: l,
      name: i.cards.find((h) => "card-" + h.id === a.name)?.label ?? l,
      xPos: n.x + a.x,
      yPos: n.y + a.y,
      width: a.width,
      height: a.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${a.width} V ${a.height} H 0 Z`,
      backgroundColor: r ? "transparent" : a.fill ?? e.backgroundColor ?? "#fffdf6",
      foregroundColor: a.ink ?? s,
      borderColor: a.line ?? o,
      borderWidth: r ? 0 : a.lineWidth ?? 1,
      ...e.fontFamily ? { fontFamily: e.fontFamily } : {},
      fontSize: Ot(l, a.fontSize ?? c, a.width - 12, a.height - 6)
    }, relationships: { associations: [] } };
  });
}
function ut(t, i) {
  const n = i.slice(7);
  if (n === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const e = t.cards.find((o) => o.id === n);
  if (e) return `${e.label} length, ${e.duration} days. Left and Right change it.`;
  const s = t.lanes.findIndex((o) => o.id === n);
  return s >= 0 && t.lanes[s + 1] ? `Divider between ${t.lanes[s].label} and ${t.lanes[s + 1].label}. Left and Right move money.` : null;
}
const ft = "#c2410c", _t = 32;
function b(t, i = {}) {
  const n = !!i.narrow, e = t.launch.day, s = Y(t), o = [], c = /* @__PURE__ */ new Map(), a = n ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), r = n ? 8 : 168, l = n ? (a - 88) / e : (a - r - 40) / e, h = (f) => E[t.lanes.findIndex((u) => u.id === f) % E.length], x = (f, u) => {
    const g = t.cards.find((O) => O.id === f), w = s.get(f), k = { x: r + w.start * l, y: u, width: g.duration * l, height: n ? 28 : _t };
    c.set(f, k), o.push({
      name: "card-" + f,
      ...k,
      text: n ? "" : `${g.label} · ${g.duration}d`,
      fill: n ? h(g.laneId) : "#fffdf6",
      line: w.critical ? ft : "#667872",
      lineWidth: w.critical ? 2.5 : 1,
      fontSize: 13
    }), o.push({ name: "handle-" + f, x: k.x + k.width - 22, y: k.y + k.height / 2 - 22, width: 44, height: 44 });
  };
  let p, m, d;
  if (n) {
    const f = (a - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((u, g) => {
      const w = 8 + g * (f + 8);
      o.push({ name: "column-" + u.id, x: w, y: 30, width: f, height: 72, fill: v(h(u.id), 0.6), line: v(h(u.id), 0.1) }), o.push({ name: "lane-" + u.id, x: w + 4, y: 34, width: f - 8, height: 28, text: u.label, fill: h(u.id), fontSize: 14 }), o.push({ name: "caption-" + u.id, x: w + 4, y: 64, width: f - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), d = 124, m = 130, p = 138;
    for (const u of t.cards)
      x(u.id, p + 20), p += 56;
  } else {
    d = 48, m = 56, p = m;
    for (const f of t.lanes) {
      const u = t.cards.filter((w) => w.laneId === f.id), g = Math.max(92, u.length * 44 + 20);
      o.push({ name: "column-" + f.id, x: 0, y: p, width: a, height: g, fill: v(h(f.id), 0.65), line: v(h(f.id), 0.1) }), o.push({ name: "lane-" + f.id, x: 8, y: p + 8, width: r - 24, height: 32, text: f.label, fill: h(f.id), fontSize: 15 }), o.push({ name: "caption-" + f.id, x: 8, y: p + 44, width: r - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), u.forEach((w, k) => x(w.id, p + 10 + k * 44)), p += g + 4;
    }
  }
  return o.push({ name: "handle-launch", x: r + e * l - 22, y: n ? 104 : 4, width: 44, height: 44 }), { parts: o, width: a, height: p + 8, narrow: n, x0: r, dayW: l, gridTop: m, axisY: d, bars: c };
}
function Pt(t, i, n) {
  for (const e of i.parts) e.name.startsWith("caption-") && (e.text = n(e.name.slice(8)));
  return i;
}
function Wt(t, i) {
  const n = t.x + t.width, e = Math.max(t.x + 4, n - 10), o = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, c = i.y + i.height / 2;
  return { d: `M ${e} ${o} V ${c} H ${i.x}`, arrow: { x: i.x, y: c, angle: 0 } };
}
function It(t, i) {
  const n = b(t, i.layout), e = t.launch.day, s = Y(t), o = [];
  for (let r = 0; r <= e; r++) {
    const l = n.x0 + r * n.dayW, h = r % 7 === 0;
    !h && n.dayW < 6 || (o.push({ t: "line", x1: l, y1: n.gridTop, x2: l, y2: n.height - 8, color: h ? y.week : y.faint, width: h ? 1 : 0.5 }), h && o.push({ t: "text", x: l + 3, y: n.axisY, text: n.narrow ? "W" + (r / 7 + 1) : "Week " + (r / 7 + 1), color: y.ink, size: 12 }));
  }
  for (const r of t.cards) {
    for (const x of r.dependsOn ?? []) {
      const p = n.bars.get(x), m = n.bars.get(r.id);
      if (!p || !m) continue;
      const d = s.get(x).critical && s.get(r.id).critical, f = t.cards.find((u) => u.id === x).label;
      o.push({
        t: "path",
        ...Wt(p, m),
        color: d ? ft : y.ink,
        width: d ? 2 : 1.5,
        unlink: { cardId: r.id, waitsOn: x, label: `Remove the link: ${r.label} waits on ${f}` }
      });
    }
    const l = s.get(r.id), h = n.bars.get(r.id);
    n.narrow && o.push({ t: "text", x: 8, y: h.y - 6, text: `${r.label} · ${r.duration}d`, color: y.ink, size: 13, bold: l.critical }), l.critical || o.push({ t: "text", x: h.x + h.width + 24, y: h.y + h.height / 2 + 4, text: "+" + l.slack + "d", color: y.ink, size: 12, role: "slack-" + r.id });
  }
  const c = n.x0 + e * n.dayW;
  o.push({ t: "line", x1: c, y1: n.narrow ? 112 : 26, x2: c, y2: n.height - 8, color: y.launch, width: 2, dash: "6 4" }), o.push({ t: "rect", x: c - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: y.launch });
  for (const r of t.cards) {
    const l = n.bars.get(r.id);
    o.push({ t: "rect", x: l.x + l.width - 5, y: l.y + 4, w: 4, h: l.height - 8, rx: 2, color: y.ink, opacity: 0.55 });
  }
  const a = N(t);
  if (o.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: `Done day ${a} · launch day ${e}`,
    color: i.refused ? y.refuse : y.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const r = n.parts.find((l) => l.name === i.clamp.name);
    r && o.push(...Ft(n, o, i.clamp.text, r));
  }
  return o;
}
const B = 13, ot = 16, xt = (t, i) => t * (i ? 0.64 : 0.6), Tt = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function Bt(t) {
  const i = t.size ?? 13, n = t.text.length * xt(i, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - i, w: n, h: i * 1.3 };
}
function Nt(t, i) {
  const n = [];
  for (const e of t.split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + e.length <= i ? n[n.length - 1] = s + " " + e : n.push(e);
  }
  return n;
}
let V = null;
function Ft(t, i, n, e) {
  const s = [...t.bars.values()].map((u) => ({ x: u.x - 4, y: u.y - 3, w: u.width + 8, h: u.height + 6 }));
  for (const u of i)
    u.t === "text" ? s.push(Bt(u)) : u.t === "rect" && s.push({ x: u.x - 2, y: u.y - 2, w: u.w + 4, h: u.h + 4 });
  const o = t.narrow ? 6 : t.x0 + 2, c = t.width - 4, a = t.gridTop + 2, r = t.height - 6, l = { x: e.x + e.width / 2, y: e.y + e.height / 2 }, h = JSON.stringify([n, l, o, c, a, r, s.map((u) => [u.x, u.y, u.w, u.h].map(Math.round))]);
  if (V?.key === h) return V.shapes;
  const x = xt(B, !0), p = Math.floor((c - o) / x), m = /* @__PURE__ */ new Map();
  for (const u of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const g = Nt(n, Math.max(8, Math.floor(p * u)));
    g.length <= 4 && m.set(g.join(`
`), g);
  }
  let d = null;
  for (const u of m.values()) {
    const g = Math.max(...u.map((k) => k.length)) * x, w = u.length * ot + 2;
    if (!(g > c - o))
      for (let k = a; k + w <= r; k += 3)
        for (let O = o; O + g <= c; O += 6) {
          const S = { x: O, y: k, w: g, h: w }, gt = Math.max(S.x - l.x, 0, l.x - (S.x + S.w)), yt = Math.max(S.y - l.y, 0, l.y - (S.y + S.h)), q = Math.hypot(gt, yt) + (u.length - 1) * 24;
          d && q >= d.score || s.every((wt) => Tt(S, wt)) && (d = { box: S, lines: u, score: q });
        }
  }
  const f = d ? [{ t: "text", x: d.box.x, y: d.box.y + B - 1, text: n, lines: d.lines, lineHeight: ot, color: y.refuse, size: B, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(e.x + 40, t.width - 4),
    y: e.y + 14,
    text: n,
    color: y.refuse,
    size: B,
    anchor: e.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return V = { key: h, shapes: f }, f;
}
const P = (t) => ({ ...t, cards: t.cards.map((i) => {
  const n = { ...i, duration: Math.max(1, Math.round(i.duration)), lag: Math.max(0, Math.round(i.lag ?? 0)) };
  return n.lag || delete n.lag, n;
}), launch: { day: Math.round(t.launch.day) } });
function Dt(t, i, { key: n, shiftKey: e }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = n === "ArrowLeft" ? -1 : 1;
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + s }];
  const o = /^(card|handle)-(.+)$/.exec(i), c = o && t.cards.find((a) => a.id === o[2]);
  return c ? e || o[1] === "handle" ? [{ kind: "set_task", card: { id: c.id }, duration: c.duration + s }] : [{ kind: "set_task", card: { id: c.id }, lag: (c.lag ?? 0) + s }] : null;
}
const mt = {
  laneCues: !1,
  notes(t, i, n, e) {
    return X(mt.places(t, i).parts, t, n, e);
  },
  editsBetween: j,
  label: ut,
  places(t, i) {
    const n = Pt(t, b(t, i), (e) => {
      const s = t.cards.filter((c) => c.laneId === e), o = Y(t);
      return `${s.length} ${s.length === 1 ? "task" : "tasks"} · ${s.filter((c) => o.get(c.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => Z(t, It),
  chooser(t, i, n, e = {}) {
    const s = t.cards.findIndex((o) => o.id === i);
    return s < 0 ? null : Ht(t, i, s, Rt(t, i), n, e);
  },
  refusalAt(t, i, n, e, s) {
    const o = b(t, s);
    for (const l of t.cards) {
      if (l.id === i || !F(o.bars.get(l.id), e)) continue;
      const h = ht(t, i, l.id);
      return h ? { laneId: l.laneId, reason: h } : null;
    }
    const c = t.cards.find((l) => l.id === i), a = (c.lag ?? 0) + Math.round((e.x - n.x - o.bars.get(i).x) / o.dayW), r = D(t, { cardId: i, field: "lag" });
    return a > r.max ? { laneId: c.laneId, reason: H(_(t, { cardId: i, field: "lag" }, a), i) ?? r.reasons.max } : null;
  },
  handleDrag(t, i, n, e) {
    const s = b(t, e), o = (m) => I(b(m, e).parts);
    if (i === "handle-launch") {
      const m = D(t, { field: "day" }), d = R(t, i, n, o, (f, u) => f.vary(u, G("launch", "day"), { constraint: (g) => [J(g.launch.day, N(g) - 1e-3), U(g.launch.day, 120)] }).onDrop(P));
      return (f) => {
        const u = Math.round((f.x - n.x + 22 - s.x0) / s.dayW), g = d?.(f) ?? _(t, { field: "day" }, Math.min(m.max, Math.max(m.min, u)));
        return u < m.min ? { next: g, clampedReason: m.reasons.min, refusal: H(_(t, { field: "day" }, Math.max(5, u))) ?? void 0 } : { next: g };
      };
    }
    const c = i.slice(7), a = t.cards.findIndex((m) => m.id === c);
    if (a < 0) return null;
    const r = { cardId: c, field: "duration" }, l = D(t, r), h = t.launch.day, x = R(t, i, n, o, (m, d) => m.vary(d, G("cards", a, "duration"), { constraint: (f) => [J(f.cards[a].duration, 1), U(N(f), h + 1e-3)] }).onDrop(P)), p = s.bars.get(c);
    return (m) => {
      const d = Math.round((m.x - n.x + 22 - p.x) / s.dayW), f = Math.min(l.max, Math.max(l.min, d)), u = x?.(m) ?? _(t, r, f);
      return d > l.max ? { next: u, clampedReason: `Launch is day ${h}.`, refusal: H(_(t, r, Math.min(60, d)), c) ?? l.reasons.max } : d < l.min ? { next: u, clampedReason: l.reasons.min } : { next: u };
    };
  },
  keyEdit: Dt
};
function Ht(t, i, n, e, s, o) {
  const c = t.launch.day, a = (l) => I(b(l, o).parts, e.map((h) => "card-" + h)), r = R(t, "card-" + i, s, a, (l, h) => {
    const x = o.narrow ? h.lanes.filter((m) => m.id === h.cards[n].laneId) : h.lanes, p = l.closest(x.map((m) => l.vary(
      { ...h, cards: h.cards.map((d, f) => f === n ? { ...d, laneId: m.id, lag: d.lag ?? 0 } : d) },
      G("cards", n, "lag"),
      { constraint: (d) => [J(d.cards[n].lag ?? 0, -1e-3), U(N(d), c + 1e-3)] }
    )));
    return e.length ? l.closest(e.map((m) => l.dropTarget("target-" + m, zt(h, i, m)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(p).withBranchTransition(120).onDrop(P) : p.onDrop(P);
  });
  return r ? (l) => P(r(l)) : null;
}
const L = 76;
function $(t, i = {}) {
  const n = !!i.narrow, e = [], s = t.lanes.map((r) => t.cards.filter((l) => l.laneId === r.id).length), o = (r) => t.lanes[r].role === "won" ? "#bfe3cf" : t.lanes[r].role === "lost" ? "#e4dcdc" : E[r % E.length];
  let c, a;
  if (n) {
    c = Math.max(300, i.width ?? 390);
    let r = L;
    t.lanes.forEach((l, h) => {
      const x = 96 + (s[h] + 1) * 64;
      e.push({ name: "column-" + l.id, x: 2, y: r, width: c - 4, height: x, fill: v(o(h), 0.6), line: v(o(h), 0.1) });
      const p = (c - 16) * 0.36;
      e.push({ name: "lane-" + l.id, x: 8, y: r + 6, width: p, height: 36, text: l.label, fill: o(h), fontSize: 15 }), e.push({ name: "caption-" + l.id, x: 8 + p + 6, y: r + 6, width: c - 16 - p - 6, height: 56, text: tt(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((m) => m.laneId === l.id).forEach((m, d) => e.push({ name: "card-" + m.id, x: 8, y: r + 72 + d * 64, width: c - 16, height: 56, text: st(t, m.id), fontSize: 15 })), r += x + 10;
    }), a = r;
  } else {
    const h = 116 + (Math.max(...s) + 1) * 88;
    t.lanes.forEach((x, p) => {
      const m = p * 244;
      e.push({ name: "column-" + x.id, x: m + 2, y: L, width: 240, height: h, fill: v(o(p), 0.6), line: v(o(p), 0.1) }), e.push({ name: "lane-" + x.id, x: m + 8, y: L + 6, width: 228, height: 58, text: x.label, fill: o(p), fontSize: 16 }), e.push({ name: "caption-" + x.id, x: m + 8, y: L + 66, width: 228, height: 48, text: tt(t, x.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((d) => d.laneId === x.id).forEach((d, f) => e.push({ name: "card-" + d.id, x: m + 8, y: L + 116 + f * 88, width: 228, height: 76, text: st(t, d.id), fontSize: 15 }));
    }), c = t.lanes.length * 244, a = L + h;
  }
  return e.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(c, 520), height: 34, text: Et(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: e, width: c, height: a };
}
function st(t, i) {
  const n = t.cards.find((e) => e.id === i);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + A(n.amount, t.forecast.currency);
}
function Vt(t, i) {
  const { width: n } = $(t, i.layout), e = t.forecast.target, s = ct(t), o = Math.max(e * 1.25, s), c = n - 8, a = s >= e;
  return [
    { t: "rect", x: 4, y: 42, w: c, h: 14, rx: 7, color: y.track },
    { t: "rect", x: 4, y: 42, w: c * s / o, h: 14, rx: 7, color: a ? y.accept : y.bar },
    { t: "line", x1: 4 + c * e / o, y1: 36, x2: 4 + c * e / o, y2: 62, color: y.ink, width: 2 },
    { t: "text", x: 4 + c * e / o, y: 72, text: "Target " + A(e, t.forecast.currency), color: y.ink, size: 14, anchor: "middle" }
  ];
}
const Gt = {
  laneCues: !0,
  places: (t, i) => $(t, i),
  notes: (t, i, n, e) => X($(t, i).parts, t, n, e),
  editsBetween: j,
  layer: (t) => Z(t, Vt),
  chooser(t, i, n, e = {}) {
    const s = lt(t, i).map((o) => rt(t, i, o.id));
    return s.length < 2 ? null : dt(R(t, "card-" + i, n, (o) => I($(o, e).parts), (o, c) => o.closest(s, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c, { gapIn: 40, gapOut: 56 })), t, i, $(t, e).parts, s);
  },
  refusalAt(t, i, n, e, s) {
    const { parts: o } = $(t, s), c = t.cards.find((a) => a.id === i);
    for (const a of t.lanes) {
      if (a.id === c.laneId || !F(o.find((l) => l.name === "column-" + a.id), e)) continue;
      const r = Ct(t, i, a.id);
      return r ? { laneId: a.id, reason: r } : null;
    }
    return null;
  },
  handleDrag: () => null
}, M = 48, W = 960, pt = 900;
function z(t, i = {}) {
  const n = !!i.narrow, e = t.budget.total, s = [], o = [], c = t.lanes.map((l) => t.cards.filter((h) => h.laneId === l.id).length);
  let a, r;
  if (n) {
    a = Math.max(300, i.width ?? 390);
    let l = M;
    t.lanes.forEach((h, x) => {
      const p = Math.max(100 + (c[x] + 1) * 64, h.allocation / e * pt);
      o.push({ laneId: h.id, start: l, size: p }), l += p;
    }), r = l + 8;
  } else {
    a = W;
    let l = 0;
    for (const h of t.lanes)
      o.push({ laneId: h.id, start: l, size: h.allocation / e * W }), l += h.allocation / e * W;
    r = M + 100 + (Math.max(...c) + 1) * 64;
  }
  return t.lanes.forEach((l, h) => {
    const { start: x, size: p } = o[h], m = E[h % E.length], d = n ? { x: 2, y: x + 1, width: a - 4, height: p - 2 } : { x: x + 1, y: M, width: Math.max(4, p - 2), height: r - M }, f = { x: d.x + 5, y: d.y, width: Math.max(10, d.width - 10) };
    s.push({ name: "column-" + l.id, ...d, fill: v(m, 0.6), line: v(m, 0.1) });
    const u = n ? f.width * 0.36 : f.width;
    if (s.push({ name: "lane-" + l.id, x: f.x, y: f.y + 6, width: u, height: 32, text: l.label, fill: m, fontSize: 15 }), s.push({
      name: "caption-" + l.id,
      x: n ? f.x + u + 6 : f.x,
      y: f.y + (n ? 6 : 40),
      width: n ? f.width - u - 6 : f.width,
      height: n ? 50 : 40,
      text: n ? nt(t, l.id).replace(" · ", `
`) : nt(t, l.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((g) => g.laneId === l.id).forEach((g, w) => s.push({
      name: "card-" + g.id,
      x: f.x,
      y: f.y + 100 + w * 64,
      width: f.width,
      height: 56,
      text: g.label + `
` + A(g.amount, t.budget.currency),
      fontSize: 14
    })), h < t.lanes.length - 1) {
      const g = x + p;
      s.push(n ? { name: "handle-" + l.id, x: a - 96, y: g - 22, width: 88, height: 44 } : { name: "handle-" + l.id, x: g - 22, y: M - 6, width: 44, height: 48 });
    }
  }), { parts: s, width: a, height: r, segments: o, narrow: n };
}
function Jt(t, i) {
  const n = z(t, i.layout), e = t.budget.total, s = [{ t: "text", x: 4, y: 28, text: At(t), color: y.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((o, c) => {
    const a = n.segments[c], r = o.allocation, l = bt(t, o.id);
    if (n.narrow) {
      const h = a.start + 50, x = 8, p = n.width - 16;
      s.push({ t: "rect", x, y: h, w: p, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x, y: h, w: p * l / r || 0, h: 10, rx: 5, color: y.bar }), o.floor !== void 0 && s.push({ t: "line", x1: x + p * o.floor / r, y1: h - 4, x2: x + p * o.floor / r, y2: h + 14, color: y.ink, width: 2 });
    } else {
      const h = W / e, x = M + 86;
      s.push({ t: "rect", x: a.start + 6, y: x, w: a.size - 12, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x: a.start + 6, y: x, w: Math.max(0, (a.size - 12) * l / r || 0), h: 10, rx: 5, color: y.bar }), o.floor !== void 0 && s.push({ t: "line", x1: a.start + o.floor * h, y1: x - 6, x2: a.start + o.floor * h, y2: x + 16, color: y.ink, width: 2 }), o.cap !== void 0 && a.start + o.cap * h <= n.width && s.push({ t: "line", x1: a.start + o.cap * h, y1: x - 6, x2: a.start + o.cap * h, y2: x + 16, color: y.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const h = a.start + a.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: h, x2: n.width - 2, y2: h, color: y.ink, width: 2 } : { t: "line", x1: h, y1: M, x2: h, y2: n.height, color: y.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: h - 4, w: 32, h: 8, rx: 4, color: y.ink } : { t: "rect", x: h - 4, y: M + 2, w: 8, h: 30, rx: 4, color: y.ink });
    }
  }), i.clamp) {
    const o = n.parts.find((c) => c.name === i.clamp.name);
    o && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(o.x + 22, 120), n.width - 120),
      y: n.narrow ? o.y + 8 : M - 12,
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
const Ut = (t, i) => Math.round(t / i) * i, Kt = {
  laneCues: !0,
  notes: (t, i, n, e) => X(z(t, i).parts, t, n, e),
  editsBetween: j,
  label: ut,
  places(t, i) {
    const { parts: n, width: e, height: s } = z(t, i);
    return { parts: n, width: e, height: s };
  },
  layer: (t) => Z(t, Jt),
  chooser(t, i, n, e = {}) {
    const s = lt(t, i).map((o) => rt(t, i, o.id));
    return s.length < 2 ? null : dt(R(t, "card-" + i, n, (o) => I(z(o, e).parts), (o, c) => o.closest(s).withFloating({ ghost: { opacity: 0.3 } }).whenFar(c)), t, i, z(t, e).parts, s);
  },
  refusalAt(t, i, n, e, s) {
    const { parts: o } = z(t, s), c = t.cards.find((a) => a.id === i);
    for (const a of t.lanes) {
      if (a.id === c.laneId || !F(o.find((l) => l.name === "column-" + a.id), e)) continue;
      const r = $t(t, i, a.id);
      return r ? { laneId: a.id, reason: r } : null;
    }
    return null;
  },
  handleDrag(t, i, n, e) {
    const s = i.slice(7), o = t.lanes.findIndex((d) => d.id === s), c = t.lanes[o + 1];
    if (o < 0 || !c) return null;
    const a = Lt(t, { laneId: s }), r = t.budget.step, l = (d) => {
      const f = Math.min(a.max, Math.max(a.min, Ut(d, r)));
      return et(t, c.id, s, f);
    }, h = z(t, e), x = h.narrow ? pt / t.budget.total : W / t.budget.total, p = h.parts.find((d) => d.name === i), m = R(t, i, n, (d) => I(z(d, e).parts), (d) => d.varyFunc([0], ([f]) => et(t, c.id, s, f), { constraint: (f) => [
      ...St([a.min, f.lanes[o].allocation - t.lanes[o].allocation, a.max])
    ] }));
    return (d) => {
      const u = (h.narrow ? d.y - n.y - p.y : d.x - n.x - p.x) / x, g = m?.(d), w = g ? g.lanes[o].allocation - t.lanes[o].allocation : u, k = { next: l(w) };
      return u > a.max + r / 2 ? { ...k, clampedReason: a.reasons.max } : u < a.min - r / 2 ? { ...k, clampedReason: a.reasons.min } : k;
    };
  },
  keyEdit(t, i, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const e = /^handle-(.+)$/.exec(i)?.[1], s = t.lanes.findIndex((l) => l.id === e), o = t.lanes[s + 1];
    if (s < 0 || !o) return null;
    const c = n === "ArrowRight" || n === "ArrowDown", a = t.budget.step;
    return [c ? { kind: "shift_budget", from: { id: o.id }, to: { id: e }, amount: a } : { kind: "shift_budget", from: { id: e }, to: { id: o.id }, amount: a }];
  }
}, Yt = { "launch-plan": mt, pipeline: Gt, budget: Kt };
function Qt(t) {
  const i = Yt[t];
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a pipeline and a budget have one.`);
  return i;
}
function tn(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  an as amountLimits,
  on as amountOf,
  sn as amountRules,
  tn as boardLayoutFor,
  nt as budgetCaption,
  bt as budgetCommitted,
  At as budgetHeader,
  Kt as budgetKit,
  z as budgetLayout,
  Lt as budgetLimits,
  $t as budgetRefusal,
  ln as budgetRules,
  rn as budgetShiftLimits,
  cn as budgetShiftRefusal,
  Z as createBoardLayer,
  hn as currencyOf,
  dn as days,
  un as downstreamTasks,
  ut as handleLabel,
  Qt as kitFor,
  N as launchFinish,
  b as launchLayout,
  ht as launchLinkRefusal,
  Rt as launchLinkTargets,
  H as launchOverrun,
  fn as launchPlanCaption,
  mt as launchPlanKit,
  D as launchPlanLimits,
  xn as launchPlanRefusal,
  mn as launchPlanRules,
  pn as launchTaskText,
  y as layerInk,
  A as money,
  gn as nextCardId,
  yn as noteNumbers,
  wn as ownField,
  X as partNotes,
  tt as pipelineCaption,
  ct as pipelineForecast,
  Et as pipelineGauge,
  Gt as pipelineKit,
  $ as pipelineLayout,
  kn as pipelineLimits,
  Ct as pipelineRefusal,
  vn as pipelineRules,
  Mn as planBudgetMove,
  Sn as planLaunchPlanMove,
  zn as planPipelineMove,
  Cn as readNoteNumbers,
  Ln as renamedNumbers,
  at as renderLayerShapes,
  $n as sampleBudget,
  bn as sampleLaunchPlan,
  En as samplePipeline,
  Y as scheduleLaunch,
  et as shiftBudget,
  An as validateBudget,
  Rn as validateLaunchPlan,
  On as validatePipeline,
  zt as withLink,
  _ as withTaskValue,
  j as workshopEditsBetween
};
