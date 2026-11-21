import { Vec2 as tt, getElementPositionCheap as bt, translate as Lt, dragSpecToBehavior as St, param as J, moreThan as K, lessThan as U, inOrder as $t } from "./dragology.mjs";
import { laneColors as A, workshopDestinations as rt, workshopCandidate as ct } from "./workshop-model.mjs";
import { money as _, pipelineForecast as dt, launchLinkRefusal as ht, launchPlanLimits as H, withTaskValue as T, launchOverrun as V, scheduleLaunch as Z, launchFinish as N, withLink as Ct, pipelineRefusal as zt, pipelineCaption as nt, budgetLimits as Et, budgetRefusal as At, budgetCaption as et, shiftBudget as it, budgetCommitted as _t } from "./workshop-rules.mjs";
import { amountLimits as rn, amountOf as cn, amountRules as dn, budgetRules as hn, budgetShiftLimits as un, budgetShiftRefusal as fn, currencyOf as xn, days as mn, downstreamTasks as pn, launchPlanCaption as yn, launchPlanRefusal as gn, launchPlanRules as wn, launchTaskText as kn, nextCardId as Mn, noteNumbers as vn, ownField as bn, pipelineLimits as Ln, pipelineRules as Sn, planBudgetMove as $n, planLaunchPlanMove as Cn, planPipelineMove as zn, readNoteNumbers as En, renamedNumbers as An, sampleBudget as _n, sampleLaunchPlan as On, samplePipeline as Tn, validateBudget as Pn, validateLaunchPlan as Rn, validatePipeline as Wn } from "./workshop-rules.mjs";
import B from "react";
const g = {
  ink: "var(--slatebox-board-ink, #34433f)",
  faint: "var(--slatebox-board-grid, #d9ddd5)",
  week: "var(--slatebox-board-week, #b5bdb3)",
  accept: "var(--slatebox-board-accept, #1f7a5c)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  bar: "var(--slatebox-board-bar, #3f6f8e)",
  track: "var(--slatebox-board-track, #e4e7df)",
  launch: "var(--slatebox-board-launch, #7b3fa0)"
}, Y = "http://www.w3.org/2000/svg", at = (t) => /var\([^,]+,\s*([^)]+)\)/.exec(t)?.[1].trim() ?? t;
function L(t, i, e) {
  const a = document.createElementNS(Y, t);
  for (const [o, s] of Object.entries(i)) a.setAttribute(o, String(s));
  return e?.fill && (a.setAttribute("fill", at(e.fill)), a.style.setProperty("fill", e.fill)), e?.stroke && (a.setAttribute("stroke", at(e.stroke)), a.style.setProperty("stroke", e.stroke)), a;
}
function ot(t, i, e, a) {
  const o = typeof document < "u" ? document.activeElement : null, s = o && t.contains(o) ? o.getAttribute("data-board-link") : null;
  for (; t.firstChild; ) t.removeChild(t.firstChild);
  const d = [];
  for (const n of i)
    if (n.t === "line")
      t.appendChild(L("line", {
        x1: n.x1,
        y1: n.y1,
        x2: n.x2,
        y2: n.y2,
        "stroke-width": n.width ?? 1,
        ...n.dash ? { "stroke-dasharray": n.dash } : {}
      }, { stroke: n.color }));
    else if (n.t === "rect")
      t.appendChild(L("rect", {
        x: n.x,
        y: n.y,
        width: Math.max(0, n.w),
        height: Math.max(0, n.h),
        rx: n.rx ?? 0,
        ...n.opacity !== void 0 ? { opacity: n.opacity } : {}
      }, { fill: n.color }));
    else if (n.t === "text") {
      const l = L("text", {
        x: n.x,
        y: n.y,
        "font-size": n.size ?? 13,
        "text-anchor": n.anchor ?? "start",
        "font-family": "system-ui, sans-serif",
        ...n.bold ? { "font-weight": 600 } : {},
        ...n.role ? { "data-board-layer": n.role } : {}
      }, { fill: n.color });
      n.lines && n.lines.length > 1 ? n.lines.forEach((r, c) => {
        const u = L("tspan", { x: n.x, dy: c ? n.lineHeight ?? Math.round((n.size ?? 13) * 1.25) : 0 });
        u.textContent = c < n.lines.length - 1 ? r + " " : r, l.appendChild(u);
      }) : l.textContent = n.text, t.appendChild(l);
    } else {
      if (n.unlink && e) {
        const { cardId: l, waitsOn: r, label: c } = n.unlink, u = r + ">" + l, x = a?.armed === u, f = L("path", {
          d: n.d,
          fill: "none",
          "stroke-width": 24,
          "stroke-linecap": "round",
          "pointer-events": "stroke",
          cursor: "pointer",
          "data-board-link": u,
          "aria-label": x ? c + ". Tap again to remove it." : c,
          role: "button",
          tabindex: 0,
          ...x ? { "data-armed": "", opacity: 0.3 } : {}
        }, { stroke: x ? g.refuse : "transparent" });
        let m = !1;
        f.addEventListener("pointerdown", (h) => {
          h.stopPropagation(), m = h.pointerType === "touch" || h.pointerType === "pen";
        }), f.addEventListener("click", (h) => {
          if (h.stopPropagation(), m && a && a.armed !== u) {
            a.arm(u);
            return;
          }
          a?.arm(null), e(l, r);
        }), f.addEventListener("keydown", (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), h.stopPropagation(), e(l, r));
        }), f.addEventListener("focus", () => {
          f.style.setProperty("stroke", g.accept), f.setAttribute("opacity", "0.35");
        }), f.addEventListener("blur", () => {
          x || (f.style.setProperty("stroke", "transparent"), f.removeAttribute("opacity"));
        }), t.appendChild(f), d.push(f);
      }
      if (t.appendChild(L("path", { d: n.d, fill: "none", "stroke-width": n.width ?? 1.5, "pointer-events": "none" }, { stroke: n.color })), n.arrow) {
        const { x: l, y: r, angle: c } = n.arrow;
        t.appendChild(L("path", { d: "M0 0 L-8 -4.5 L-8 4.5 Z", transform: `translate(${l} ${r}) rotate(${c})`, "pointer-events": "none" }, { fill: n.color }));
      }
      if (n.unlink && a?.armed === n.unlink.waitsOn + ">" + n.unlink.cardId && n.arrow) {
        const l = L("text", {
          x: n.arrow.x - 6,
          y: n.arrow.y - 14,
          "font-size": 13,
          "font-weight": 600,
          "text-anchor": "end",
          "font-family": "system-ui, sans-serif",
          "pointer-events": "none",
          "data-board-layer": "unlink-armed"
        }, { fill: g.refuse });
        l.textContent = "Tap again to remove this link", t.appendChild(l);
      }
    }
  s && d.find((n) => n.getAttribute("data-board-link") === s)?.focus({ preventScroll: !0 });
}
function j(t, i) {
  const e = t?.canvas?.node, a = document.createElementNS(Y, "g");
  a.setAttribute("data-board-layer", ""), a.setAttribute("pointer-events", "none");
  const o = document.createElementNS(Y, "g");
  o.setAttribute("data-board-layer-top", ""), o.setAttribute("pointer-events", "none");
  let s = !1, d = null, n;
  const l = {
    armed: null,
    arm(c) {
      clearTimeout(n), l.armed = c, c && (n = setTimeout(() => l.arm(null), 5e3), d?.[2].announce?.("Link selected. Tap it again to remove it.")), d && r.draw(...d);
    }
  }, r = {
    draw(c, u, x) {
      if (s || !e) return;
      d = [c, u, x];
      const { origin: f } = x, m = i(u ?? c, x, c), h = (w) => w.t === "text" && (w.role === "clamp" || w.role === "refusal");
      for (const w of [a, o]) w.setAttribute("transform", `translate(${f.x} ${f.y})`);
      ot(a, m.filter((w) => !h(w)), x.onUnlink, l), ot(o, m.filter(h));
      const y = x.above && x.above.parentNode === e ? x.above : null, p = y ? y.nextSibling : e.firstChild;
      (a.parentNode !== e || a.previousSibling !== y) && e.insertBefore(a, p === a ? a.nextSibling : p), o.firstChild && e.lastChild !== o ? e.appendChild(o) : !o.firstChild && o.parentNode && o.remove();
    },
    destroy() {
      s = !0, clearTimeout(n), a.remove(), o.remove();
    }
  };
  return r;
}
function W(t, i = []) {
  const e = t.filter((a) => a.name.startsWith("card-") || a.name.startsWith("handle-"));
  return B.createElement(
    "g",
    null,
    ...e.map((a) => /* @__PURE__ */ B.createElement("g", { id: a.name, transform: Lt(a.x, a.y) }, /* @__PURE__ */ B.createElement("rect", { width: a.width, height: a.height }))),
    ...t.filter((a) => i.includes(a.name)).map((a) => /* @__PURE__ */ B.createElement("rect", { id: "target-" + a.name.slice(5), x: a.x, y: a.y, width: a.width, height: a.height }))
  );
}
function O(t, i, e, a, o) {
  let s;
  const n = {
    draggable: (r) => (s ?? (s = r.d), a(r.state)),
    draggedPath: i + "/",
    draggedId: i,
    anchorPos: tt(e.x, e.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!bt(n, t) || !s) return null;
  const l = St(o(s, t), n);
  return (r) => l({ pointer: tt(r.x, r.y) }).dropState;
}
const F = (t, i, e = 0) => !!t && i.x >= t.x - e && i.x <= t.x + t.width + e && i.y >= t.y - e && i.y <= t.y + t.height + e;
function ut(t, i, e, a, o) {
  if (!t) return null;
  const s = i.cards.find((d) => d.id === e).laneId;
  return (d) => {
    const n = t(d);
    if (n !== i && JSON.stringify(n) !== JSON.stringify(i)) return n;
    const l = a.find((r) => r.name.startsWith("column-") && r.name !== "column-" + s && F(r, d));
    return l && o.find((r) => r.cards.find((c) => c.id === e).laneId === l.name.slice(7)) || n;
  };
}
function M(t, i) {
  const e = (a) => Math.round(parseInt(t.slice(a, a + 2), 16) * (1 - i) + 255 * i).toString(16).padStart(2, "0");
  return "#" + e(1) + e(3) + e(5);
}
function X(t, i) {
  const e = [], a = new Map(t.cards.map((n) => [n.id, n]));
  for (const n of i.cards) {
    const l = a.get(n.id), r = { id: n.id };
    if (!l) {
      e.push({
        kind: "add_card",
        lane: { id: n.laneId },
        label: n.label,
        ...n.duration !== void 0 && { duration: n.duration },
        ...n.lag && { lag: n.lag },
        ...n.dependsOn && { waitsOn: n.dependsOn.map((u) => ({ id: u })) },
        ...n.amount !== void 0 && { amount: n.amount }
      });
      continue;
    }
    l.label !== n.label && e.push({ kind: "rename_card", card: r, label: n.label });
    const c = e.length;
    for (const u of l.dependsOn ?? []) n.dependsOn?.includes(u) || e.push({ kind: "unlink_tasks", card: r, waitsOn: { id: u } });
    for (const u of n.dependsOn ?? []) l.dependsOn?.includes(u) || e.push({ kind: "link_tasks", card: r, waitsOn: { id: u } });
    l.laneId !== n.laneId && e.push({ kind: "move_card", card: r, lane: { id: n.laneId } }), (e.length > c && n.duration !== void 0 && e.slice(c).some((u) => u.kind !== "move_card") || l.duration !== n.duration || (l.lag ?? 0) !== (n.lag ?? 0)) && e.push({ kind: "set_task", card: r, duration: n.duration, lag: n.lag ?? 0 }), n.amount !== void 0 && l.amount !== n.amount && e.push({ kind: "set_amount", card: r, amount: n.amount });
  }
  for (const n of t.cards) i.cards.some((l) => l.id === n.id) || e.push({ kind: "remove_card", card: { id: n.id } });
  i.launch && t.launch?.day !== i.launch.day && e.push({ kind: "set_launch_day", day: i.launch.day }), i.forecast && t.forecast?.target !== i.forecast.target && e.push({ kind: "set_target", amount: i.forecast.target });
  const o = i.lanes.map((n) => ({ id: n.id, by: (n.allocation ?? 0) - (t.lanes.find((l) => l.id === n.id)?.allocation ?? 0) })), s = o.filter((n) => n.by < 0), d = o.filter((n) => n.by > 0);
  for (const n of d)
    for (const l of s) {
      const r = Math.min(n.by, -l.by);
      r <= 0 || (e.push({ kind: "shift_budget", from: { id: l.id }, to: { id: n.id }, amount: r }), n.by -= r, l.by += r);
    }
  for (const n of i.lanes) {
    const l = t.lanes.find((r) => r.id === n.id);
    l && l.label !== n.label && e.push({ kind: "rename_lane", lane: { id: n.id }, label: n.label }), l && l.capacity !== n.capacity && e.push({ kind: "set_lane_capacity", lane: { id: n.id }, capacity: n.capacity ?? null });
  }
  return t.title !== i.title && e.push({ kind: "rename_workshop", title: i.title }), e;
}
function Ot(t) {
  const i = t.forecast?.currency;
  return `Forecast ${_(dt(t), i)} of ${_(t.forecast?.target ?? 0, i)}`;
}
function Tt(t) {
  return `${_(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function ft(t, i) {
  return t.cards.filter((e) => ht(t, i, e.id) === null).map((e) => e.id);
}
function Pt(t, i, e, a) {
  for (let o = i; o > 11; o--) {
    const s = Math.max(1, Math.floor(e / (o * 0.55)));
    if (t.split(`
`).reduce((n, l) => n + Math.max(1, Math.ceil(l.length / s)), 0) * o * 1.3 <= a) return o;
  }
  return Math.min(i, 11);
}
function q(t, i, e, a) {
  const o = a.textColor ?? "#18302d", s = a.borderColor ?? "#667872", d = a.fontSize ?? 14;
  return t.map((n) => {
    const l = n.name.startsWith("handle-"), r = n.text ?? "";
    return { options: {
      id: n.name,
      text: r,
      name: i.cards.find((c) => "card-" + c.id === n.name)?.label ?? r,
      xPos: e.x + n.x,
      yPos: e.y + n.y,
      width: n.width,
      height: n.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${n.width} V ${n.height} H 0 Z`,
      backgroundColor: l ? "transparent" : n.fill ?? a.backgroundColor ?? "#fffdf6",
      foregroundColor: n.ink ?? o,
      borderColor: n.line ?? s,
      borderWidth: l ? 0 : n.lineWidth ?? 1,
      ...a.fontFamily ? { fontFamily: a.fontFamily } : {},
      fontSize: Pt(r, n.fontSize ?? d, n.width - 12, n.height - 6)
    }, relationships: { associations: [] } };
  });
}
function xt(t, i) {
  const e = i.slice(7);
  if (e === "launch") return `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const a = t.cards.find((s) => s.id === e);
  if (a) return `${a.label} length, ${a.duration} days. Left and Right change it.`;
  const o = t.lanes.findIndex((s) => s.id === e);
  return o >= 0 && t.lanes[o + 1] ? `Divider between ${t.lanes[o].label} and ${t.lanes[o + 1].label}. Left and Right move money.` : null;
}
const mt = "#c2410c", Rt = 32, Wt = 44, pt = (t) => t ? 0 : 22;
function E(t, i = {}) {
  const e = !!i.narrow, a = t.launch.day, o = Z(t), s = [], d = /* @__PURE__ */ new Map(), n = e ? Math.max(300, i.width ?? 390) : Math.max(720, i.width ?? 1200), l = e ? 8 : 168, r = e ? (n - 88) / a : (n - l - 40) / a, c = (h) => A[t.lanes.findIndex((y) => y.id === h) % A.length], u = (h, y) => {
    const p = t.cards.find(($) => $.id === h), w = o.get(h), k = { x: l + w.start * r, y, width: p.duration * r, height: e ? Wt : Rt };
    d.set(h, k), s.push({
      name: "card-" + h,
      ...k,
      text: e ? "" : `${p.label} · ${p.duration}d`,
      fill: e ? c(p.laneId) : "#fffdf6",
      line: w.critical ? mt : "#667872",
      lineWidth: w.critical ? 2.5 : 1,
      fontSize: 13
    }), s.push({ name: "handle-" + h, x: k.x + k.width - pt(e), y: k.y + k.height / 2 - 22, width: 44, height: 44 });
  };
  let x, f, m;
  if (e) {
    const h = (n - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((y, p) => {
      const w = 8 + p * (h + 8);
      s.push({ name: "column-" + y.id, x: w, y: 30, width: h, height: 72, fill: M(c(y.id), 0.6), line: M(c(y.id), 0.1) }), s.push({ name: "lane-" + y.id, x: w + 4, y: 34, width: h - 8, height: 28, text: y.label, fill: c(y.id), fontSize: 14 }), s.push({ name: "caption-" + y.id, x: w + 4, y: 64, width: h - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), m = 124, f = 130, x = 138;
    for (const y of t.cards)
      u(y.id, x + 20), x += 64;
  } else {
    m = 48, f = 56, x = f;
    for (const h of t.lanes) {
      const y = t.cards.filter((w) => w.laneId === h.id), p = Math.max(92, y.length * 44 + 20);
      s.push({ name: "column-" + h.id, x: 0, y: x, width: n, height: p, fill: M(c(h.id), 0.65), line: M(c(h.id), 0.1) }), s.push({ name: "lane-" + h.id, x: 8, y: x + 8, width: l - 24, height: 32, text: h.label, fill: c(h.id), fontSize: 15 }), s.push({ name: "caption-" + h.id, x: 8, y: x + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), y.forEach((w, k) => u(w.id, x + 10 + k * 44)), x += p + 4;
    }
  }
  return s.push({ name: "handle-launch", x: l + a * r - 22, y: e ? 104 : 4, width: 44, height: 44 }), { parts: s, width: n, height: x + 8, narrow: e, x0: l, dayW: r, gridTop: f, axisY: m, bars: d };
}
function Bt(t, i, e) {
  for (const a of i.parts) a.name.startsWith("caption-") && (a.text = e(a.name.slice(8)));
  return i;
}
function It(t, i) {
  const e = t.x + t.width, a = Math.max(t.x + 4, e - 10), s = i.y + i.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, d = i.y + i.height / 2;
  return { d: `M ${a} ${s} V ${d} H ${i.x}`, arrow: { x: i.x, y: d, angle: 0 } };
}
function Nt(t, i) {
  const e = E(t, i.layout), a = t.launch.day, o = Z(t), s = [];
  for (let l = 0; l <= a; l++) {
    const r = e.x0 + l * e.dayW, c = l % 7 === 0;
    !c && e.dayW < 6 || (s.push({ t: "line", x1: r, y1: e.gridTop, x2: r, y2: e.height - 8, color: c ? g.week : g.faint, width: c ? 1 : 0.5 }), c && s.push({ t: "text", x: r + 3, y: e.axisY, text: e.narrow ? "W" + (l / 7 + 1) : "Week " + (l / 7 + 1), color: g.ink, size: 12 }));
  }
  for (const l of t.cards) {
    for (const u of l.dependsOn ?? []) {
      const x = e.bars.get(u), f = e.bars.get(l.id);
      if (!x || !f) continue;
      const m = o.get(u).critical && o.get(l.id).critical, h = t.cards.find((y) => y.id === u).label;
      s.push({
        t: "path",
        ...It(x, f),
        color: m ? mt : g.ink,
        width: m ? 2 : 1.5,
        unlink: { cardId: l.id, waitsOn: u, label: `Remove the link: ${l.label} waits on ${h}` }
      });
    }
    const r = o.get(l.id), c = e.bars.get(l.id);
    e.narrow && s.push({ t: "text", x: 8, y: c.y - 6, text: `${l.label} · ${l.duration}d`, color: g.ink, size: 13, bold: r.critical }), r.critical || s.push({ t: "text", x: c.x + c.width + (e.narrow ? 48 : 24), y: c.y + c.height / 2 + 4, text: "+" + r.slack + "d", color: g.ink, size: 12, role: "slack-" + l.id });
  }
  const d = e.x0 + a * e.dayW;
  s.push({ t: "line", x1: d, y1: e.narrow ? 112 : 26, x2: d, y2: e.height - 8, color: g.launch, width: 2, dash: "6 4" }), s.push({ t: "rect", x: d - 4, y: e.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: g.launch });
  for (const l of t.cards) {
    const r = e.bars.get(l.id);
    s.push({ t: "rect", x: r.x + r.width + (e.narrow ? 4 : -5), y: r.y + 4, w: e.narrow ? 6 : 4, h: r.height - 8, rx: 2, color: g.ink, opacity: 0.55 });
  }
  const n = N(t);
  if (s.push({
    t: "text",
    x: e.narrow ? 8 : e.x0,
    y: e.narrow ? 18 : 20,
    text: `Done day ${n} · launch day ${a}`,
    color: i.refused ? g.refuse : g.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), i.clamp) {
    const l = e.parts.find((r) => r.name === i.clamp.name);
    l && s.push(...Vt(e, s, i.clamp.text, l, i.view));
  }
  return s;
}
const I = 13, st = 16, yt = (t, i) => t * (i ? 0.64 : 0.6), Ft = (t, i) => t.x + t.w <= i.x || i.x + i.w <= t.x || t.y + t.h <= i.y || i.y + i.h <= t.y;
function Dt(t) {
  const i = t.size ?? 13, e = t.text.length * yt(i, t.bold);
  return { x: t.anchor === "end" ? t.x - e : t.anchor === "middle" ? t.x - e / 2 : t.x, y: t.y - i, w: e, h: i * 1.3 };
}
function Ht(t, i) {
  const e = [];
  for (const a of t.split(/\s+/).filter(Boolean)) {
    const o = e.at(-1);
    o !== void 0 && o.length + 1 + a.length <= i ? e[e.length - 1] = o + " " + a : e.push(a);
  }
  return e;
}
let G = null;
function Vt(t, i, e, a, o) {
  const s = [...t.bars.values()].map((p) => ({ x: p.x - 4, y: p.y - 3, w: p.width + 8, h: p.height + 6 }));
  for (const p of i)
    p.t === "text" ? s.push(Dt(p)) : p.t === "rect" && s.push({ x: p.x - 2, y: p.y - 2, w: p.w + 4, h: p.h + 4 });
  let d = t.narrow ? 6 : t.x0 + 2, n = t.width - 4, l = t.gridTop + 2, r = t.height - 6;
  o && Math.min(n, o.x + o.width - 8) - Math.max(d, o.x + 8) >= 160 && (d = Math.max(d, o.x + 8), n = Math.min(n, o.x + o.width - 8), Math.min(r, o.y + o.height - 8) - Math.max(l, o.y + 8) >= 40 && (l = Math.max(l, o.y + 8), r = Math.min(r, o.y + o.height - 8)));
  const c = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, u = JSON.stringify([e, c, d, n, l, r, s.map((p) => [p.x, p.y, p.w, p.h].map(Math.round))]);
  if (G?.key === u) return G.shapes;
  const x = yt(I, !0), f = Math.floor((n - d) / x), m = /* @__PURE__ */ new Map();
  for (const p of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const w = Ht(e, Math.max(8, Math.floor(f * p)));
    w.length <= 4 && m.set(w.join(`
`), w);
  }
  let h = null;
  for (const p of m.values()) {
    const w = Math.max(...p.map(($) => $.length)) * x, k = p.length * st + 2;
    if (!(w > n - d))
      for (let $ = l; $ + k <= r; $ += 3)
        for (let D = d; D + w <= n; D += 6) {
          const b = { x: D, y: $, w, h: k }, kt = Math.max(b.x - c.x, 0, c.x - (b.x + b.w)), Mt = Math.max(b.y - c.y, 0, c.y - (b.y + b.h)), Q = Math.hypot(kt, Mt) + (p.length - 1) * 24;
          h && Q >= h.score || s.every((vt) => Ft(b, vt)) && (h = { box: b, lines: p, score: Q });
        }
  }
  const y = h ? [{ t: "text", x: h.box.x, y: h.box.y + I - 1, text: e, lines: h.lines, lineHeight: st, color: g.refuse, size: I, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(a.x + 40, t.width - 4),
    y: a.y + 14,
    text: e,
    color: g.refuse,
    size: I,
    anchor: a.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return G = { key: u, shapes: y }, y;
}
const P = (t) => ({ ...t, cards: t.cards.map((i) => {
  const e = { ...i, duration: Math.max(1, Math.round(i.duration)), lag: Math.max(0, Math.round(i.lag ?? 0)) };
  return e.lag || delete e.lag, e;
}), launch: { day: Math.round(t.launch.day) } });
function Gt(t, i, e) {
  if (e !== "l" && e !== "L") return null;
  const a = /^card-(.+)$/.exec(i), o = a && t.cards.find((n) => n.id === a[1]);
  if (!o) return null;
  const s = (n) => t.cards.find((l) => l.id === n)?.label ?? n, d = [
    ...ft(t, o.id).map((n) => ({
      said: `${o.label} waits on ${s(n)}`,
      edits: [{ kind: "link_tasks", card: { id: o.id }, waitsOn: { id: n } }]
    })),
    ...(o.dependsOn ?? []).map((n) => ({
      said: `${o.label} stops waiting on ${s(n)}`,
      edits: [{ kind: "unlink_tasks", card: { id: o.id }, waitsOn: { id: n } }]
    }))
  ];
  return d.length ? d : `${o.label} has no task it can wait on.`;
}
function Jt(t, i, { key: e, shiftKey: a }) {
  if (e !== "ArrowLeft" && e !== "ArrowRight") return null;
  const o = e === "ArrowLeft" ? -1 : 1;
  if (i === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + o }];
  const s = /^(card|handle)-(.+)$/.exec(i), d = s && t.cards.find((n) => n.id === s[2]);
  return d ? a || s[1] === "handle" ? [{ kind: "set_task", card: { id: d.id }, duration: d.duration + o }] : [{ kind: "set_task", card: { id: d.id }, lag: (d.lag ?? 0) + o }] : null;
}
const gt = {
  laneCues: !1,
  notes(t, i, e, a) {
    return q(gt.places(t, i).parts, t, e, a);
  },
  editsBetween: X,
  label: xt,
  places(t, i) {
    const e = Bt(t, E(t, i), (a) => {
      const o = t.cards.filter((d) => d.laneId === a), s = Z(t);
      return `${o.length} ${o.length === 1 ? "task" : "tasks"} · ${o.filter((d) => s.get(d.id).critical).length} on the critical path`;
    });
    return { parts: e.parts, width: e.width, height: e.height };
  },
  layer: (t) => j(t, Nt),
  chooser(t, i, e, a = {}) {
    const o = t.cards.findIndex((s) => s.id === i);
    return o < 0 ? null : Kt(t, i, o, ft(t, i), e, a);
  },
  refusalAt(t, i, e, a, o) {
    const s = E(t, o);
    for (const r of t.cards) {
      if (r.id === i || !F(s.bars.get(r.id), a)) continue;
      const c = ht(t, i, r.id);
      return c ? { laneId: r.laneId, reason: c } : null;
    }
    const d = t.cards.find((r) => r.id === i), n = (d.lag ?? 0) + Math.round((a.x - e.x - s.bars.get(i).x) / s.dayW), l = H(t, { cardId: i, field: "lag" });
    return n > l.max ? { laneId: d.laneId, reason: V(T(t, { cardId: i, field: "lag" }, n), i) ?? l.reasons.max } : null;
  },
  handleDrag(t, i, e, a) {
    const o = E(t, a), s = (f) => W(E(f, a).parts);
    if (i === "handle-launch") {
      const f = H(t, { field: "day" }), m = O(t, i, e, s, (h, y) => h.vary(y, J("launch", "day"), { constraint: (p) => [K(p.launch.day, N(p) - 1e-3), U(p.launch.day, 120)] }).onDrop(P));
      return (h) => {
        const y = Math.round((h.x - e.x + 22 - o.x0) / o.dayW), p = m?.(h) ?? T(t, { field: "day" }, Math.min(f.max, Math.max(f.min, y)));
        return y < f.min ? { next: p, clampedReason: f.reasons.min, refusal: V(T(t, { field: "day" }, Math.max(5, y))) ?? void 0 } : { next: p };
      };
    }
    const d = i.slice(7), n = t.cards.findIndex((f) => f.id === d);
    if (n < 0) return null;
    const l = { cardId: d, field: "duration" }, r = H(t, l), c = t.launch.day, u = O(t, i, e, s, (f, m) => f.vary(m, J("cards", n, "duration"), { constraint: (h) => [K(h.cards[n].duration, 1), U(N(h), c + 1e-3)] }).onDrop(P)), x = o.bars.get(d);
    return (f) => {
      const m = Math.round((f.x - e.x + pt(o.narrow) - x.x) / o.dayW), h = Math.min(r.max, Math.max(r.min, m)), y = u?.(f) ?? T(t, l, h);
      return m > r.max ? { next: y, clampedReason: `Launch is day ${c}.`, refusal: V(T(t, l, Math.min(60, m)), d) ?? r.reasons.max } : m < r.min ? { next: y, clampedReason: r.reasons.min } : { next: y };
    };
  },
  keyEdit: Jt,
  keyChoices: Gt,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on."
};
function Kt(t, i, e, a, o, s) {
  const d = t.launch.day, n = (r) => W(E(r, s).parts, a.map((c) => "card-" + c)), l = O(t, "card-" + i, o, n, (r, c) => {
    const u = s.narrow ? c.lanes.filter((f) => f.id === c.cards[e].laneId) : c.lanes, x = r.closest(u.map((f) => r.vary(
      { ...c, cards: c.cards.map((m, h) => h === e ? { ...m, laneId: f.id, lag: m.lag ?? 0 } : m) },
      J("cards", e, "lag"),
      { constraint: (m) => [K(m.cards[e].lag ?? 0, -1e-3), U(N(m), d + 1e-3)] }
    )));
    return a.length ? r.closest(a.map((f) => r.dropTarget("target-" + f, Ct(c, i, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop(P) : x.onDrop(P);
  });
  return l ? (r) => P(l(r)) : null;
}
const C = 76;
function z(t, i = {}) {
  const e = !!i.narrow, a = [], o = t.lanes.map((l) => t.cards.filter((r) => r.laneId === l.id).length), s = (l) => t.lanes[l].role === "won" ? "#bfe3cf" : t.lanes[l].role === "lost" ? "#e4dcdc" : A[l % A.length];
  let d, n;
  if (e) {
    d = Math.max(300, i.width ?? 390);
    let l = C;
    t.lanes.forEach((r, c) => {
      const u = 96 + (o[c] + 1) * 64;
      a.push({ name: "column-" + r.id, x: 2, y: l, width: d - 4, height: u, fill: M(s(c), 0.6), line: M(s(c), 0.1) });
      const x = (d - 16) * 0.36;
      a.push({ name: "lane-" + r.id, x: 8, y: l + 6, width: x, height: 36, text: r.label, fill: s(c), fontSize: 15 }), a.push({ name: "caption-" + r.id, x: 8 + x + 6, y: l + 6, width: d - 16 - x - 6, height: 56, text: nt(t, r.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((f) => f.laneId === r.id).forEach((f, m) => a.push({ name: "card-" + f.id, x: 8, y: l + 72 + m * 64, width: d - 16, height: 56, text: lt(t, f.id), fontSize: 15 })), l += u + 10;
    }), n = l;
  } else {
    const c = 116 + (Math.max(...o) + 1) * 88;
    t.lanes.forEach((u, x) => {
      const f = x * 244;
      a.push({ name: "column-" + u.id, x: f + 2, y: C, width: 240, height: c, fill: M(s(x), 0.6), line: M(s(x), 0.1) }), a.push({ name: "lane-" + u.id, x: f + 8, y: C + 6, width: 228, height: 58, text: u.label, fill: s(x), fontSize: 16 }), a.push({ name: "caption-" + u.id, x: f + 8, y: C + 66, width: 228, height: 48, text: nt(t, u.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((m) => m.laneId === u.id).forEach((m, h) => a.push({ name: "card-" + m.id, x: f + 8, y: C + 116 + h * 88, width: 228, height: 76, text: lt(t, m.id), fontSize: 15 }));
    }), d = t.lanes.length * 244, n = C + c;
  }
  return a.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(d, 520), height: 34, text: Ot(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), { parts: a, width: d, height: n };
}
function lt(t, i) {
  const e = t.cards.find((a) => a.id === i);
  return e.amount === void 0 ? e.label + `
no amount yet` : e.label + `
` + _(e.amount, t.forecast.currency);
}
function Ut(t, i) {
  const { width: e } = z(t, i.layout), a = t.forecast.target, o = dt(t), s = Math.max(a * 1.25, o), d = e - 8, n = o >= a;
  return [
    { t: "rect", x: 4, y: 42, w: d, h: 14, rx: 7, color: g.track },
    { t: "rect", x: 4, y: 42, w: d * o / s, h: 14, rx: 7, color: n ? g.accept : g.bar },
    { t: "line", x1: 4 + d * a / s, y1: 36, x2: 4 + d * a / s, y2: 62, color: g.ink, width: 2 },
    { t: "text", x: 4 + d * a / s, y: 72, text: "Target " + _(a, t.forecast.currency), color: g.ink, size: 14, anchor: "middle" }
  ];
}
const Yt = {
  laneCues: !0,
  places: (t, i) => z(t, i),
  notes: (t, i, e, a) => q(z(t, i).parts, t, e, a),
  editsBetween: X,
  layer: (t) => j(t, Ut),
  chooser(t, i, e, a = {}) {
    const o = rt(t, i).map((s) => ct(t, i, s.id));
    return o.length < 2 ? null : ut(O(t, "card-" + i, e, (s) => W(z(s, a).parts), (s, d) => s.closest(o, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(d, { gapIn: 40, gapOut: 56 })), t, i, z(t, a).parts, o);
  },
  refusalAt(t, i, e, a, o) {
    const { parts: s } = z(t, o), d = t.cards.find((n) => n.id === i);
    for (const n of t.lanes) {
      if (n.id === d.laneId || !F(s.find((r) => r.name === "column-" + n.id), a)) continue;
      const l = zt(t, i, n.id);
      return l ? { laneId: n.id, reason: l } : null;
    }
    return null;
  },
  handleDrag: () => null
}, v = 48, R = 960, wt = 900;
function S(t, i = {}) {
  const e = !!i.narrow, a = t.budget.total, o = [], s = [], d = t.lanes.map((r) => t.cards.filter((c) => c.laneId === r.id).length);
  let n, l;
  if (e) {
    n = Math.max(300, i.width ?? 390);
    let r = v;
    t.lanes.forEach((c, u) => {
      const x = Math.max(100 + (d[u] + 1) * 64, c.allocation / a * wt);
      s.push({ laneId: c.id, start: r, size: x }), r += x;
    }), l = r + 8;
  } else {
    n = R;
    let r = 0;
    for (const c of t.lanes)
      s.push({ laneId: c.id, start: r, size: c.allocation / a * R }), r += c.allocation / a * R;
    l = v + 100 + (Math.max(...d) + 1) * 64;
  }
  return t.lanes.forEach((r, c) => {
    const { start: u, size: x } = s[c], f = A[c % A.length], m = e ? { x: 2, y: u + 1, width: n - 4, height: x - 2 } : { x: u + 1, y: v, width: Math.max(4, x - 2), height: l - v }, h = { x: m.x + 5, y: m.y, width: Math.max(10, m.width - 10) };
    o.push({ name: "column-" + r.id, ...m, fill: M(f, 0.6), line: M(f, 0.1) });
    const y = e ? h.width * 0.36 : h.width;
    if (o.push({ name: "lane-" + r.id, x: h.x, y: h.y + 6, width: y, height: 32, text: r.label, fill: f, fontSize: 15 }), o.push({
      name: "caption-" + r.id,
      x: e ? h.x + y + 6 : h.x,
      y: h.y + (e ? 6 : 40),
      width: e ? h.width - y - 6 : h.width,
      height: e ? 50 : 40,
      text: e ? et(t, r.id).replace(" · ", `
`) : et(t, r.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: e ? 15 : 12
    }), t.cards.filter((p) => p.laneId === r.id).forEach((p, w) => o.push({
      name: "card-" + p.id,
      x: h.x,
      y: h.y + 100 + w * 64,
      width: h.width,
      height: 56,
      text: p.label + `
` + _(p.amount, t.budget.currency),
      fontSize: 14
    })), c < t.lanes.length - 1) {
      const p = u + x;
      o.push(e ? { name: "handle-" + r.id, x: n - 96, y: p - 22, width: 88, height: 44 } : { name: "handle-" + r.id, x: p - 22, y: v - 6, width: 44, height: 48 });
    }
  }), { parts: o, width: n, height: l, segments: s, narrow: e };
}
function Zt(t, i) {
  const e = S(t, i.layout), a = t.budget.total, o = [{ t: "text", x: 4, y: 28, text: Tt(t), color: g.ink, size: 16, bold: !0, role: "header" }];
  if (t.lanes.forEach((s, d) => {
    const n = e.segments[d], l = s.allocation, r = _t(t, s.id);
    if (e.narrow) {
      const c = n.start + 50, u = 8, x = e.width - 16;
      o.push({ t: "rect", x: u, y: c, w: x, h: 10, rx: 5, color: g.track }), o.push({ t: "rect", x: u, y: c, w: x * r / l || 0, h: 10, rx: 5, color: g.bar }), s.floor !== void 0 && o.push({ t: "line", x1: u + x * s.floor / l, y1: c - 4, x2: u + x * s.floor / l, y2: c + 14, color: g.ink, width: 2 });
    } else {
      const c = R / a, u = v + 86;
      o.push({ t: "rect", x: n.start + 6, y: u, w: n.size - 12, h: 10, rx: 5, color: g.track }), o.push({ t: "rect", x: n.start + 6, y: u, w: Math.max(0, (n.size - 12) * r / l || 0), h: 10, rx: 5, color: g.bar }), s.floor !== void 0 && o.push({ t: "line", x1: n.start + s.floor * c, y1: u - 6, x2: n.start + s.floor * c, y2: u + 16, color: g.ink, width: 2 }), s.cap !== void 0 && n.start + s.cap * c <= e.width && o.push({ t: "line", x1: n.start + s.cap * c, y1: u - 6, x2: n.start + s.cap * c, y2: u + 16, color: g.refuse, width: 2, dash: "3 2" });
    }
    if (d < t.lanes.length - 1) {
      const c = n.start + n.size;
      o.push(e.narrow ? { t: "line", x1: 2, y1: c, x2: e.width - 2, y2: c, color: g.ink, width: 2 } : { t: "line", x1: c, y1: v, x2: c, y2: e.height, color: g.ink, width: 2 }), o.push(e.narrow ? { t: "rect", x: e.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: g.ink } : { t: "rect", x: c - 4, y: v + 2, w: 8, h: 30, rx: 4, color: g.ink });
    }
  }), i.clamp) {
    const s = e.parts.find((d) => d.name === i.clamp.name);
    s && o.push({
      t: "text",
      x: e.narrow ? 8 : Math.min(Math.max(s.x + 22, 120), e.width - 120),
      y: e.narrow ? s.y + 8 : v - 12,
      text: i.clamp.text,
      color: g.refuse,
      size: 13,
      bold: !0,
      anchor: e.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return o;
}
const jt = (t, i) => Math.round(t / i) * i, Xt = {
  laneCues: !0,
  notes: (t, i, e, a) => q(S(t, i).parts, t, e, a),
  editsBetween: X,
  label: xt,
  places(t, i) {
    const { parts: e, width: a, height: o } = S(t, i);
    return { parts: e, width: a, height: o };
  },
  layer: (t) => j(t, Zt),
  chooser(t, i, e, a = {}) {
    const o = rt(t, i).map((s) => ct(t, i, s.id));
    return o.length < 2 ? null : ut(O(t, "card-" + i, e, (s) => W(S(s, a).parts), (s, d) => s.closest(o).withFloating({ ghost: { opacity: 0.3 } }).whenFar(d)), t, i, S(t, a).parts, o);
  },
  refusalAt(t, i, e, a, o) {
    const { parts: s } = S(t, o), d = t.cards.find((n) => n.id === i);
    for (const n of t.lanes) {
      if (n.id === d.laneId || !F(s.find((r) => r.name === "column-" + n.id), a)) continue;
      const l = At(t, i, n.id);
      return l ? { laneId: n.id, reason: l } : null;
    }
    return null;
  },
  handleDrag(t, i, e, a) {
    const o = i.slice(7), s = t.lanes.findIndex((m) => m.id === o), d = t.lanes[s + 1];
    if (s < 0 || !d) return null;
    const n = Et(t, { laneId: o }), l = t.budget.step, r = (m) => {
      const h = Math.min(n.max, Math.max(n.min, jt(m, l)));
      return it(t, d.id, o, h);
    }, c = S(t, a), u = c.narrow ? wt / t.budget.total : R / t.budget.total, x = c.parts.find((m) => m.name === i), f = O(t, i, e, (m) => W(S(m, a).parts), (m) => m.varyFunc([0], ([h]) => it(t, d.id, o, h), { constraint: (h) => [
      ...$t([n.min, h.lanes[s].allocation - t.lanes[s].allocation, n.max])
    ] }));
    return (m) => {
      const y = (c.narrow ? m.y - e.y - x.y : m.x - e.x - x.x) / u, p = f?.(m), w = p ? p.lanes[s].allocation - t.lanes[s].allocation : y, k = { next: r(w) };
      return y > n.max + l / 2 ? { ...k, clampedReason: n.reasons.max } : y < n.min - l / 2 ? { ...k, clampedReason: n.reasons.min } : k;
    };
  },
  keyEdit(t, i, { key: e }) {
    if (e !== "ArrowLeft" && e !== "ArrowRight" && e !== "ArrowUp" && e !== "ArrowDown") return null;
    const a = /^handle-(.+)$/.exec(i)?.[1], o = t.lanes.findIndex((r) => r.id === a), s = t.lanes[o + 1];
    if (o < 0 || !s) return null;
    const d = e === "ArrowRight" || e === "ArrowDown", n = t.budget.step;
    return [d ? { kind: "shift_budget", from: { id: s.id }, to: { id: a }, amount: n } : { kind: "shift_budget", from: { id: a }, to: { id: s.id }, amount: n }];
  }
}, qt = { "launch-plan": gt, pipeline: Yt, budget: Xt };
function an(t) {
  const i = qt[t];
  if (!i) throw new Error(`No board kit for "${t}". Only a launch plan, a pipeline and a budget have one.`);
  return i;
}
function on(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  rn as amountLimits,
  cn as amountOf,
  dn as amountRules,
  on as boardLayoutFor,
  et as budgetCaption,
  _t as budgetCommitted,
  Tt as budgetHeader,
  Xt as budgetKit,
  S as budgetLayout,
  Et as budgetLimits,
  At as budgetRefusal,
  hn as budgetRules,
  un as budgetShiftLimits,
  fn as budgetShiftRefusal,
  j as createBoardLayer,
  xn as currencyOf,
  mn as days,
  pn as downstreamTasks,
  xt as handleLabel,
  an as kitFor,
  N as launchFinish,
  E as launchLayout,
  ht as launchLinkRefusal,
  ft as launchLinkTargets,
  V as launchOverrun,
  yn as launchPlanCaption,
  gt as launchPlanKit,
  H as launchPlanLimits,
  gn as launchPlanRefusal,
  wn as launchPlanRules,
  kn as launchTaskText,
  g as layerInk,
  _ as money,
  Mn as nextCardId,
  vn as noteNumbers,
  bn as ownField,
  q as partNotes,
  nt as pipelineCaption,
  dt as pipelineForecast,
  Ot as pipelineGauge,
  Yt as pipelineKit,
  z as pipelineLayout,
  Ln as pipelineLimits,
  zt as pipelineRefusal,
  Sn as pipelineRules,
  $n as planBudgetMove,
  Cn as planLaunchPlanMove,
  zn as planPipelineMove,
  En as readNoteNumbers,
  An as renamedNumbers,
  ot as renderLayerShapes,
  _n as sampleBudget,
  On as sampleLaunchPlan,
  Tn as samplePipeline,
  Z as scheduleLaunch,
  it as shiftBudget,
  Pn as validateBudget,
  Rn as validateLaunchPlan,
  Wn as validatePipeline,
  Ct as withLink,
  T as withTaskValue,
  X as workshopEditsBetween
};
