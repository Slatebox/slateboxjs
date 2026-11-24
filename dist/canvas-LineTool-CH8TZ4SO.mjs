import { a as z, b as j, n as q, c as B } from "./canvas-canvas-0lJsJ20e.mjs";
const U = 10, T = (e) => {
  const n = e?.options || {};
  return { x: n.x || 0, y: n.y || 0, width: n.width || 1, height: n.height || 1, rotation: n.rotate?.rotationAngle || 0 };
};
function X(e, n, i, h) {
  const a = document.elementFromPoint(n, i)?.closest?.("[data-node-id]")?.getAttribute("data-node-id");
  if (a) return e.nodes?.one?.(a) ?? null;
  for (const l of e.nodes?.allNodes || []) {
    if (!l || l.id === h) continue;
    const c = e.element?.querySelector?.(`[data-node-id="${CSS.escape(l.id)}"]`)?.getBoundingClientRect?.();
    if (c && n >= c.left && n <= c.right && i >= c.top && i <= c.bottom) return l;
  }
  return null;
}
function H(e, n) {
  e._lineTool?.cancel?.();
  const i = e.canvas;
  if (!i || !n?.relationships || e.isReadOnly?.() || e.isCommentOnly?.() || n.options?.isLocked || e.capabilitiesOf?.(n)?.canConnect === !1)
    return Promise.resolve({ result: "cancelled" });
  const h = e.markersContainer || i, L = h.path("M 0 0").fill("none").stroke({ color: "#1f6feb", width: 2.5, dasharray: "7,5", linecap: "round" }).addClass("line-tool-preview").attr("pointer-events", "none"), a = h.group().addClass("line-tool-tip").attr("pointer-events", "none");
  a.circle(20).center(0, 0).fill("#ffffff").attr("fill-opacity", 0.9), a.polygon("0,-8 8,0 0,8 -8,0").fill("#ffffff").stroke({ color: "#1f6feb", width: 2.5, linejoin: "round" }), a.hide();
  try {
    e.markersContainer?.front?.();
  } catch {
  }
  const l = e.element ?? i.node?.parentElement ?? null;
  l?.setAttribute?.("data-line-tool", "on");
  let c = null;
  const E = (p) => {
    if (c !== p) {
      try {
        c?.backgroundRect?.attr?.({ "stroke-dasharray": null });
      } catch {
      }
      c = p;
      try {
        p?.backgroundRect?.attr?.({ "stroke-dasharray": "8,4" });
      } catch {
      }
    }
  };
  return new Promise((p) => {
    let m = !1;
    const b = ["mousedown", "mouseup", "click", "pointerup", "touchstart", "touchend"];
    let v = !1, f = null;
    const I = () => {
      v = !1, f && clearTimeout(f), f = null, b.forEach((t) => window.removeEventListener(t, k, !0));
    }, d = (t) => {
      if (!m) {
        m = !0, E(null), window.removeEventListener("pointermove", x, !0), window.removeEventListener("pointerdown", A, !0), window.removeEventListener("pointerup", _, !0), window.removeEventListener("pointercancel", $, !0), window.removeEventListener("keydown", M, !0);
        try {
          L.remove(), a.remove();
        } catch {
        }
        l?.removeAttribute?.("data-line-tool"), e._lineTool === S && (e._lineTool = null), v || I(), p(t);
        try {
          t.associationId && t.nodeId && e.selectLine?.(t.nodeId, t.associationId), e.options?.events?.onLineToolChanged?.(!1);
        } catch (o) {
          console.warn("LINE_TOOL: after drawing", o);
        }
      }
    }, Y = i.root?.()?.node ?? i.node ?? null, y = (t) => {
      const o = t.target;
      return !o || typeof o.nodeType != "number" ? !1 : !!Y?.contains(o) || !!l?.contains(o);
    }, k = (t) => {
      v && (y(t) && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation?.()), t.type === "click" ? I() : (t.type === "pointerup" || t.type === "mouseup" || t.type === "touchend") && (f && clearTimeout(f), f = setTimeout(I, 350)));
    }, C = () => !e._destroyed && !n._removed && e.nodes?.one?.(n.id) === n, x = (t) => {
      if (!C()) return d({ result: "cancelled" });
      if (r && t.pointerId === r.id && Math.hypot(t.clientX - r.x, t.clientY - r.y) > U && (r = null), !y(t)) return;
      const o = i.point(t.clientX, t.clientY), s = X(e, t.clientX, t.clientY, n.id), g = s && s.id !== n.id && e.capabilitiesOf?.(s)?.canConnect !== !1 ? s : null;
      E(g);
      const u = z(T(n), j(T(n), o));
      L.plot(`M ${u.x} ${u.y} L ${o.x} ${o.y}`), g ? a.hide() : a.show().attr("transform", `translate(${o.x},${o.y})`);
    }, w = /* @__PURE__ */ new Set();
    let r = null;
    const O = (t) => t.pointerType === "touch" || t.pointerType === "pen", P = (t) => {
      try {
        if (!C()) return d({ result: "cancelled" });
        F(t);
      } catch (o) {
        console.warn("LINE_TOOL: press failed", o), d({ result: "cancelled" });
      }
    }, A = (t) => {
      if (!O(t)) return P(t);
      y(t) && (t.isPrimary && w.clear(), w.add(t.pointerId), r = w.size === 1 ? { id: t.pointerId, x: t.clientX, y: t.clientY } : null);
    }, _ = (t) => {
      O(t) && (w.delete(t.pointerId), !(!r || r.id !== t.pointerId) && (r = null, P(t)));
    }, $ = (t) => {
      w.delete(t.pointerId), r?.id === t.pointerId && (r = null);
    }, F = (t) => {
      if (!y(t) || t.button !== void 0 && t.button !== 0 && t.pointerType === "mouse") return;
      t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), v = !0, b.forEach((u) => window.addEventListener(u, k, !0));
      const o = i.point(t.clientX, t.clientY), s = X(e, t.clientX, t.clientY, n.id);
      if (s && s.id === n.id) return d({ result: "cancelled" });
      if (s) {
        if (e.capabilitiesOf?.(s)?.canConnect === !1) return;
        const u = q(T(s), o), D = B(u.x, u.y), R = n.relationships.addAssociation(s, D ? { targetAnchor: D } : void 0), N = n.relationships.hasAssociationId?.(R?.id);
        return d(N ? { result: "connected", associationId: R.id, nodeId: n.id } : { result: "cancelled" });
      }
      const g = n.relationships.addFloatingAssociation({ x: Math.round(o.x), y: Math.round(o.y) });
      d({ result: "free", associationId: g.id, nodeId: n.id });
    }, M = (t) => {
      t.key === "Escape" && (t.preventDefault(), t.stopPropagation(), d({ result: "cancelled" }));
    }, S = { nodeId: n.id, cancel: () => d({ result: "cancelled" }) };
    e._lineTool = S, window.addEventListener("pointermove", x, !0), window.addEventListener("pointerdown", A, !0), window.addEventListener("pointerup", _, !0), window.addEventListener("pointercancel", $, !0), window.addEventListener("keydown", M, !0), e.options?.events?.onLineToolChanged?.(!0);
  });
}
export {
  H as startLineTool
};
