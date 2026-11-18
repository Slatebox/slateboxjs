import e, { useState as N } from "react";
import { DraggableRenderer as G, translate as L } from "./dragology.mjs";
import { releaseLoad as K, availableLanes as D, moveWorkshopCard as R, workshopPositions as F, workshopLayout as X, laneColors as Y } from "./workshop-model.mjs";
import { industrialWorkshop as U, nightTransfer as ee, releasePlan as te, validateWorkshop as ne, workshopToSlate as ae } from "./workshop-model.mjs";
function j({ value: t, preview: E }) {
  const d = E ?? t, b = new Map(d.lanes.map((a) => [a.id, a.label])), x = new Map(d.cards.map((a) => [a.id, a])), s = d.cards.flatMap((a) => (a.dependsOn ?? []).map((i) => ({ feature: a, prerequisite: x.get(i) })));
  return /* @__PURE__ */ e.createElement("div", { className: "release-plan-readout", style: { display: "flex", flexWrap: "wrap", gap: "1rem 2rem" } }, /* @__PURE__ */ e.createElement("section", { "aria-label": "Release capacity", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Release capacity"), d.lanes.filter((a) => a.capacity !== void 0).map((a) => {
    const i = K(d, a.id);
    return /* @__PURE__ */ e.createElement("div", { key: a.id, style: { display: "grid", gridTemplateColumns: "1fr auto", gap: "0 .75rem", marginBottom: ".65rem" } }, /* @__PURE__ */ e.createElement("span", null, a.label), /* @__PURE__ */ e.createElement("output", { "aria-label": a.label + " capacity" }, i, " / ", a.capacity, " points"), /* @__PURE__ */ e.createElement("meter", { "aria-label": a.label + " point budget", min: 0, max: a.capacity, value: i, style: { width: "100%", gridColumn: "1 / -1" } }));
  })), /* @__PURE__ */ e.createElement("section", { "aria-label": "Feature dependencies", style: { flex: "1 1 16rem" } }, /* @__PURE__ */ e.createElement("h3", null, "Feature dependencies"), s.length === 0 ? /* @__PURE__ */ e.createElement("p", null, "These features can ship independently.") : /* @__PURE__ */ e.createElement("ul", null, s.map(({ feature: a, prerequisite: i }) => /* @__PURE__ */ e.createElement("li", { key: JSON.stringify([a.id, i.id]) }, /* @__PURE__ */ e.createElement("strong", null, a.label), " needs ", i.label, " · ", b.get(i.laneId))))), E && /* @__PURE__ */ e.createElement("p", { role: "status", style: { flexBasis: "100%", margin: 0 } }, d.cards.filter((a) => t.cards.find((i) => i.id === a.id)?.laneId !== a.laneId).map((a) => a.label + " → " + b.get(a.laneId)).join(" · ")));
}
function A({ value: t, preview: E, stage: d, apply: b, cancel: x }) {
  const [s, a] = N(t.cards[0].id), i = t.cards.find((r) => r.id === s) ?? t.cards[0], u = e.useId();
  return /* @__PURE__ */ e.createElement("fieldset", { onKeyDown: (r) => {
    r.key === "Escape" && (x(), r.stopPropagation());
  } }, /* @__PURE__ */ e.createElement("legend", null, "Schedule a feature"), /* @__PURE__ */ e.createElement("label", { htmlFor: u }, "Feature"), " ", /* @__PURE__ */ e.createElement("select", { id: u, value: i.id, onChange: (r) => {
    a(r.target.value), x();
  } }, t.cards.map((r) => /* @__PURE__ */ e.createElement("option", { key: r.id, value: r.id }, r.label))), /* @__PURE__ */ e.createElement("div", null, D(t, i).filter((r) => r.id !== i.laneId).map((r) => /* @__PURE__ */ e.createElement("button", { key: r.id, type: "button", onClick: () => d(R(t, i.id, r.id), { cardId: i.id, laneId: r.id }) }, "Preview ", r.label))), E && /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("button", { type: "button", onClick: b }, "Apply move"), /* @__PURE__ */ e.createElement("button", { type: "button", onClick: x }, "Cancel preview")));
}
function $(t) {
  return t.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((E) => E.trim()) ?? [t];
}
function P({ state: t, d: E, draggedId: d, isTracking: b }, x) {
  const { width: s, row: a, height: i, top: u } = X, { points: r } = F(t), m = !!t.lanes[0].station, M = (l) => {
    const p = t.lanes.findIndex((c) => c.id === l.laneId), f = t.cards.filter((c) => c.laneId === l.laneId).indexOf(l);
    return L((m ? 18 : 8) + r[p].x, r[p].y + u + f * a);
  };
  if (b && d) {
    const l = t.cards.find((p) => "choice-" + p.id === d);
    if (l) return /* @__PURE__ */ e.createElement("g", { id: d, transform: M(l) });
  }
  return /* @__PURE__ */ e.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, t.lanes.flatMap((l, p) => (l.station?.next ?? []).map((f) => {
    const c = r[p], y = r[t.lanes.findIndex((B) => B.id === f)], h = s / 2 + 8, w = (u - 12) / 2 + 4, g = y.x - c.x, C = y.y - c.y, I = Math.min(g ? s / 2 / Math.abs(g) : 1 / 0, C ? (w - 4) / Math.abs(C) : 1 / 0), v = y.x + h - g * I, S = y.y + w - C * I;
    return /* @__PURE__ */ e.createElement("g", { dragologyKey: l.id + "-" + f }, /* @__PURE__ */ e.createElement("line", { x1: c.x + h, y1: c.y + w, x2: v, y2: S, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ e.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${v} ${S}) rotate(${Math.atan2(C, g) * 180 / Math.PI})` }));
  })), t.lanes.map((l, p) => {
    const f = t.cards.filter((h) => h.laneId === l.id).length, c = t.kind === "release-plan" && K(t, l.id), y = t.kind === "release-plan" ? c + (l.capacity ? " / " + l.capacity : "") + " points" : l.station ? f ? "● Occupied" : "Open stop" : l.capacity ? `${f} of ${l.capacity} slots` : `${f} ${f === 1 ? "choice" : "choices"}`;
    return /* @__PURE__ */ e.createElement("g", { id: "heading-" + l.id, transform: L(8 + r[p].x, 4 + r[p].y) }, m && /* @__PURE__ */ e.createElement("rect", { x: 0, y: 0, width: s, height: u + Math.max(1, f) * a - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ e.createElement("rect", { width: s, height: u - 12, rx: m ? 6 : 9, fill: m ? "#253c36" : Y[p] }), $(l.label).map((h, w) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + w, fill: m ? "#fffdf3" : "#18302d", transform: L(12, (m ? 23 : 16) + w * 16), fontSize: m ? 17 : 13, fontWeight: "bold" }, h)), /* @__PURE__ */ e.createElement("text", { fill: m ? "#ebd29a" : "#18302d", transform: L(12, u - 23), fontSize: 12 }, y));
  }), t.cards.map((l) => {
    const p = x ? [] : D(t, l), f = "choice-" + l.id;
    return /* @__PURE__ */ e.createElement(
      "g",
      {
        id: f,
        transform: M(l),
        dragologyZIndex: d === f ? "/1" : !1,
        dragologyOnDrag: p.length > 1 ? () => E.closest(p.map((c) => R(t, l.id, c.id))).withFloating() : void 0
      },
      /* @__PURE__ */ e.createElement("rect", { width: m ? s - 20 : s, height: i - (m ? 6 : 0), fill: m ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: m ? 1 : 8 }),
      m && /* @__PURE__ */ e.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      t.kind === "release-plan" && /* @__PURE__ */ e.createElement("text", { transform: L(12, i - 10), fill: "#466358", fontSize: 12 }, l.points, " pts"),
      $(l.label).map((c, y) => /* @__PURE__ */ e.createElement("text", { dragologyKey: "line-" + y, transform: L(12, 17 + y * 16), fontSize: 14 }, c))
    );
  }));
}
const H = (t) => P(t, !1), J = (t) => P(t, !0);
function _({ value: t, onChange: E, onPreview: d, onUndo: b, canUndo: x, readOnly: s = !1 }) {
  const { width: a, height: i } = F(t), u = t.kind === "release-plan", [r, m] = e.useState(0), M = e.useRef(!1), l = e.useRef(null), [p, f] = e.useState(null), [c, y] = e.useState(null), [h, w] = e.useState(null), g = !s && c?.source === t ? c : null, C = e.useRef(t), I = e.useCallback((n) => {
    u && f(n), d?.(n);
  }, [u, d]), v = e.useCallback(() => {
    M.current = !1, l.current = null, y(null), I(null), m((n) => n + 1);
  }, [I]);
  e.useLayoutEffect(() => {
    C.current !== t && (M.current || c) && v(), C.current = t;
  }, [t, c, v]);
  const S = (n, o) => {
    M.current = !1, y(null), n !== t && (u && !b && w({ before: t, after: n }), E(n, o));
  }, B = (n) => {
    const o = n.cards.find((k) => k.id === l.current);
    S(n, o && { cardId: o.id, laneId: o.laneId });
  }, T = e.useCallback((n) => {
    const o = n.type === "dragging" ? n : n.pendingDrag?.status;
    M.current = !!o, o ? (l.current = o.behaviorCtx.draggedId?.replace(/^choice-/, "") ?? null, y(null)) : l.current !== null && (l.current = null, I(null));
  }, [I]);
  e.useEffect(() => {
    function n(o) {
      !M.current && !c || o instanceof KeyboardEvent && o.key !== "Escape" || v();
    }
    return document.addEventListener("keydown", n), document.addEventListener("pointercancel", n), window.addEventListener("blur", n), () => {
      document.removeEventListener("keydown", n), document.removeEventListener("pointercancel", n), window.removeEventListener("blur", n);
    };
  }, [v, c]);
  const W = s ? null : g?.next ?? p, z = W ? Math.max(i, F(W).height) : i;
  return /* @__PURE__ */ e.createElement("section", { "aria-label": t.title }, /* @__PURE__ */ e.createElement("div", { style: { maxWidth: "100%", overflowX: "auto" } }, /* @__PURE__ */ e.createElement(
    G,
    {
      key: s ? "read-only" : r,
      draggable: s || g ? J : H,
      state: g?.next ?? t,
      onDropState: s ? void 0 : B,
      onDragState: s ? void 0 : I,
      onDragStatus: T,
      width: a,
      height: z
    }
  )), u && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(j, { value: t, preview: W }), !s && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    A,
    {
      value: t,
      preview: g?.move ?? null,
      stage: (n, o) => {
        y({ source: t, next: n, move: o }), d?.(n);
      },
      cancel: v,
      apply: () => {
        g && (S(g.next, g.move), I(null));
      }
    }
  ), /* @__PURE__ */ e.createElement("button", { type: "button", disabled: !(b ? x : h?.after === t), onClick: () => {
    v(), b ? b() : h?.after === t && (w(null), E(h.before));
  } }, "Undo move"))), t.lanes[0].station && /* @__PURE__ */ e.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, t.cards.map((n) => {
    const o = t.lanes.find((k) => k.id === n.laneId);
    return /* @__PURE__ */ e.createElement("div", { key: n.id }, /* @__PURE__ */ e.createElement("p", null, /* @__PURE__ */ e.createElement("strong", null, n.label, " · ", o.label), /* @__PURE__ */ e.createElement("br", null), o.station.outcome), D(t, n).filter((k) => k.id !== n.laneId).map((k) => /* @__PURE__ */ e.createElement("button", { key: k.id, type: "button", disabled: s, onClick: () => S(R(t, n.id, k.id), { cardId: n.id, laneId: k.id }) }, n.label, " → ", k.label)));
  })), !u && /* @__PURE__ */ e.createElement("details", null, /* @__PURE__ */ e.createElement("summary", null, "Move a card by name"), t.cards.map((n) => /* @__PURE__ */ e.createElement("label", { key: n.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, n.label, /* @__PURE__ */ e.createElement(
    "select",
    {
      disabled: s,
      "aria-label": "Move " + n.label,
      value: n.laneId,
      onChange: (o) => S(R(t, n.id, o.currentTarget.value), { cardId: n.id, laneId: o.currentTarget.value })
    },
    D(t, n).map((o) => /* @__PURE__ */ e.createElement("option", { key: o.id, value: o.id }, o.label))
  )))));
}
export {
  j as ReleasePlanReadout,
  _ as WorkshopBoard,
  D as availableLanes,
  U as industrialWorkshop,
  Y as laneColors,
  R as moveWorkshopCard,
  ee as nightTransfer,
  K as releaseLoad,
  te as releasePlan,
  ne as validateWorkshop,
  X as workshopLayout,
  F as workshopPositions,
  ae as workshopToSlate
};
