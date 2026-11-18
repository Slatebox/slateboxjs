import t from "react";
import { DraggableRenderer as $, translate as u } from "./dragology.mjs";
import { workshopPositions as D, availableLanes as k, moveWorkshopCard as w, workshopLayout as B, laneColors as z } from "./workshop-model.mjs";
import { industrialWorkshop as N, nightTransfer as Z, validateWorkshop as j, workshopToSlate as q } from "./workshop-model.mjs";
function L(n) {
  return n.match(/.{1,23}(?:\s+|$)|.{1,23}/gu)?.map((f) => f.trim()) ?? [n];
}
function S({ state: n, d: f, draggedId: p }, d) {
  const { width: m, row: y, height: x, top: g } = B, { points: l } = D(n), o = !!n.lanes[0].station;
  return /* @__PURE__ */ t.createElement("g", { fontFamily: "system-ui, sans-serif", fill: "#18302d" }, n.lanes.flatMap((e, a) => (e.station?.next ?? []).map((r) => {
    const i = l[a], s = l[n.lanes.findIndex((W) => W.id === r)], c = m / 2 + 8, h = (g - 12) / 2 + 4, E = s.x - i.x, b = s.y - i.y, I = Math.min(E ? m / 2 / Math.abs(E) : 1 / 0, b ? (h - 4) / Math.abs(b) : 1 / 0), v = s.x + c - E * I, M = s.y + h - b * I;
    return /* @__PURE__ */ t.createElement("g", { dragologyKey: e.id + "-" + r }, /* @__PURE__ */ t.createElement("line", { x1: i.x + c, y1: i.y + h, x2: v, y2: M, stroke: "#506b61", strokeWidth: 3 }), /* @__PURE__ */ t.createElement("path", { d: "M0 0l-11 -5v10z", fill: "#315044", transform: `translate(${v} ${M}) rotate(${Math.atan2(b, E) * 180 / Math.PI})` }));
  })), n.lanes.map((e, a) => {
    const r = n.cards.filter((i) => i.laneId === e.id).length;
    return /* @__PURE__ */ t.createElement("g", { id: "heading-" + e.id, transform: u(8 + l[a].x, 4 + l[a].y) }, o && /* @__PURE__ */ t.createElement("rect", { x: 0, y: 0, width: m, height: g + Math.max(1, r) * y - 10, rx: 9, fill: "#fcf9ed", stroke: "#a8b5aa", strokeDasharray: "4 4" }), /* @__PURE__ */ t.createElement("rect", { width: m, height: g - 12, rx: o ? 6 : 9, fill: o ? "#253c36" : z[a] }), L(e.label).map((i, s) => /* @__PURE__ */ t.createElement("text", { dragologyKey: "line-" + s, fill: o ? "#fffdf3" : "#18302d", transform: u(12, (o ? 23 : 16) + s * 16), fontSize: o ? 17 : 13, fontWeight: "bold" }, i)), /* @__PURE__ */ t.createElement("text", { fill: o ? "#ebd29a" : "#18302d", transform: u(12, g - 23), fontSize: 12 }, e.station ? r ? "● Occupied" : "Open stop" : e.capacity ? `${r} of ${e.capacity} slots` : `${r} ${r === 1 ? "choice" : "choices"}`));
  }), n.cards.map((e) => {
    const a = n.lanes.findIndex((c) => c.id === e.laneId), r = n.cards.filter((c) => c.laneId === e.laneId).indexOf(e), i = k(n, e), s = "choice-" + e.id;
    return /* @__PURE__ */ t.createElement(
      "g",
      {
        id: s,
        transform: u((o ? 18 : 8) + l[a].x, l[a].y + g + r * y),
        dragologyZIndex: p === s ? "/1" : !1,
        dragologyOnDrag: !d && i.length > 1 ? () => f.closest(i.map((c) => w(n, e.id, c.id))).withFloating() : void 0
      },
      /* @__PURE__ */ t.createElement("rect", { width: o ? m - 20 : m, height: x - (o ? 6 : 0), fill: o ? "#ffda75" : "#fffdf6", stroke: "#78857d", rx: o ? 1 : 8 }),
      o && /* @__PURE__ */ t.createElement("path", { d: "M198 0v70", stroke: "#897530", strokeDasharray: "4 5" }),
      L(e.label).map((c, h) => /* @__PURE__ */ t.createElement("text", { dragologyKey: "line-" + h, transform: u(12, 17 + h * 16), fontSize: 14 }, c))
    );
  }));
}
const K = (n) => S(n, !1), C = (n) => S(n, !0);
function X({ value: n, onChange: f, onPreview: p, readOnly: d = !1 }) {
  const { width: m, height: y } = D(n), [x, g] = t.useState(0), l = t.useRef(!1), o = t.useCallback((e) => {
    l.current = e.type === "dragging" || !!e.pendingDrag, l.current || p?.(null);
  }, [p]);
  return t.useEffect(() => {
    function e(a) {
      !l.current || a instanceof KeyboardEvent && a.key !== "Escape" || (l.current = !1, p?.(null), g((r) => r + 1));
    }
    return document.addEventListener("keydown", e), document.addEventListener("pointercancel", e), window.addEventListener("blur", e), () => {
      document.removeEventListener("keydown", e), document.removeEventListener("pointercancel", e), window.removeEventListener("blur", e);
    };
  }, [p]), /* @__PURE__ */ t.createElement("section", { "aria-label": n.title }, /* @__PURE__ */ t.createElement("div", { style: { maxWidth: "100%", overflowX: "auto" } }, /* @__PURE__ */ t.createElement(
    $,
    {
      key: d ? "read-only" : x,
      draggable: d ? C : K,
      state: n,
      onDropState: d ? void 0 : f,
      onDragState: d ? void 0 : p,
      onDragStatus: o,
      width: m,
      height: y
    }
  )), n.lanes[0].station && /* @__PURE__ */ t.createElement("div", { className: "workshop-outcomes", "aria-live": "polite" }, n.cards.map((e) => {
    const a = n.lanes.find((r) => r.id === e.laneId);
    return /* @__PURE__ */ t.createElement("div", { key: e.id }, /* @__PURE__ */ t.createElement("p", null, /* @__PURE__ */ t.createElement("strong", null, e.label, " · ", a.label), /* @__PURE__ */ t.createElement("br", null), a.station.outcome), k(n, e).filter((r) => r.id !== e.laneId).map((r) => /* @__PURE__ */ t.createElement("button", { key: r.id, type: "button", disabled: d, onClick: () => f(w(n, e.id, r.id)) }, e.label, " → ", r.label)));
  })), /* @__PURE__ */ t.createElement("details", null, /* @__PURE__ */ t.createElement("summary", null, "Move a card by name"), n.cards.map((e) => /* @__PURE__ */ t.createElement("label", { key: e.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBlock: 6 } }, e.label, /* @__PURE__ */ t.createElement(
    "select",
    {
      disabled: d,
      "aria-label": "Move " + e.label,
      value: e.laneId,
      onChange: (a) => f(w(n, e.id, a.currentTarget.value))
    },
    k(n, e).map((a) => /* @__PURE__ */ t.createElement("option", { key: a.id, value: a.id }, a.label))
  )))));
}
export {
  X as WorkshopBoard,
  k as availableLanes,
  N as industrialWorkshop,
  z as laneColors,
  w as moveWorkshopCard,
  Z as nightTransfer,
  j as validateWorkshop,
  B as workshopLayout,
  D as workshopPositions,
  q as workshopToSlate
};
