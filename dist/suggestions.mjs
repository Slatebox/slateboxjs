import { agentName as Mt, plainLine as ot, canvasZoom as Et, boxOf as X, agentColor as Pt, clip as F, overlap as Dt, hexPoints as Nt } from "./presence.mjs";
function Ot(d) {
  const { xPos: a, yPos: u, ...A } = d;
  return { ...A, x: Number(a ?? d.x) || 0, y: Number(u ?? d.y) || 0 };
}
const Lt = "ghost-", z = (d) => Lt + d;
function J(d) {
  const a = [];
  for (const u of Array.isArray(d) ? d : [])
    if (!(!u || typeof u.actionId != "string"))
      for (const A of Array.isArray(u.items) ? u.items : [])
        A && A.state === "pending" && typeof A.id == "string" && a.push({ action: u, item: A });
  return a;
}
const Kt = Object.freeze({
  canMove: !1,
  canResize: !1,
  canRotate: !1,
  canDelete: !1,
  canDuplicate: !1,
  canConnect: !1,
  canEditText: !1,
  canSelect: !1,
  persist: !1,
  exportable: !1
}), ht = "Roboto, Helvetica, Arial, sans-serif", pt = "#b91c1c";
function yt(d, a) {
  const u = d.x + d.w / 2, A = d.y + d.h / 2, k = a.x + a.w / 2 - u, x = a.y + a.h / 2 - A;
  if (!k && !x) return { x: u, y: A };
  const I = k ? d.w / 2 / Math.abs(k) : 1 / 0, R = x ? d.h / 2 / Math.abs(x) : 1 / 0, G = Math.min(I, R, 1);
  return { x: u + k * G, y: A + x * G };
}
function mt(d) {
  const a = d.changes || {};
  if (typeof a.text == "string") return "Suggests: “" + F(ot(a.text), 48) + "”";
  const u = Object.keys(a), A = u.some((x) => ["xPos", "yPos", "x", "y"].includes(x)), k = u.some((x) => ["width", "height"].includes(x));
  return A && u.every((x) => ["xPos", "yPos", "x", "y"].includes(x)) ? "Suggests moving it here" : k && u.every((x) => ["width", "height"].includes(x)) ? "Suggests resizing it" : "Suggests restyling it";
}
const Rt = [["add", "note", "notes"], ["update", "change", "changes"], ["remove", "removal", "removals"], ["link", "line", "lines"], ["unlink", "line removed", "lines removed"]];
function Tt(d) {
  return Rt.map(([a, u, A]) => {
    const k = d.filter((x) => x.kind === a).length;
    return k ? k + " " + (k === 1 ? u : A) : "";
  }).filter(Boolean).join(", ");
}
const nt = (d, a) => !d || !a ? d || a : { x: Math.min(d.x, a.x), y: Math.min(d.y, a.y), w: Math.max(d.x + d.w, a.x + a.w) - Math.min(d.x, a.x), h: Math.max(d.y + d.h, a.y + a.h) - Math.min(d.y, a.y) };
function jt(d, a = {}) {
  const u = d?.v2 && typeof d.v2.canvas?.group == "function" ? d.v2 : d, A = a.toNode ?? Ot, k = () => a.canAct ? !!a.canAct() : !1;
  let x = [], I = null, R = !1, G = "";
  const O = /* @__PURE__ */ new Map();
  let it = [], H = [], T = null, V = "pointer", Z = !1;
  const xt = typeof u.setDragPolicy == "function" ? u.setDragPolicy({
    governs: (t) => typeof t?.id == "string" && O.has(t.id) ? Kt : null,
    onEnd: () => ({ accept: !1 }),
    // A load from the room replaced every note, the ghosts too: draw them again.
    onNotesReplaced() {
      O.clear(), ft(!0);
    }
  }) : () => {
  }, st = (t) => typeof u.withPolicyAuthority == "function" ? u.withPolicyAuthority(t) : t();
  function vt() {
    return I && I.node?.isConnected !== !1 && I.node?.parentNode || (I = u.canvas.group(), I.attr({ "data-agent-suggestions": "", "data-export-never": "" })), I;
  }
  const j = (t) => t ? u.nodes?.one?.(t) : void 0, q = (t) => t ? X(j(t)) ?? X(j(z(t))) : null, Q = (t) => Mt(t);
  function wt() {
    const t = /* @__PURE__ */ new Map();
    for (const { action: e, item: n } of J(x))
      n.kind === "add" && n.nodeId && n.node?.options && t.set(z(n.nodeId), { item: n, action: e });
    st(() => {
      for (const [e, n] of O) {
        const l = t.get(e);
        l && JSON.stringify(l.item.node) === n.json && u.nodes?.one?.(e) === n.node || (u.nodes?.one?.(e) === n.node && u.nodes.remove(e), O.delete(e));
      }
      for (const [e, { item: n, action: l }] of t) {
        if (O.has(e) || n.nodeId && j(n.nodeId)) continue;
        const h = { ...n.node.options, id: e };
        let s;
        try {
          s = u.nodes.add(A(h));
        } catch {
          continue;
        }
        O.set(e, { node: s, json: JSON.stringify(n.node) }), Promise.resolve(s?.ready).then(() => {
          if (R || O.get(e)?.node !== s) return;
          s.applyGovernance?.();
          const r = s.svgGroup?.node;
          r && (r.style.opacity = "0.72", r.style.pointerEvents = "none", r.setAttribute("data-agent-ghost", n.nodeId || ""), r.setAttribute("aria-label", "Suggested by " + Q(l) + ", not kept yet: " + ot(n.node?.options?.text ?? "")), et(!1), lt());
        }).catch(() => {
        });
      }
    });
  }
  function It(t, e, n, l, h, s, r, f = h ? "keep" : "discard") {
    const v = Math.round(18 + 6.8 * n.length), y = t.group().attr({
      role: "button",
      tabindex: 0,
      "aria-label": l,
      cursor: "pointer",
      "pointer-events": "all",
      "data-suggestion-button": f
    });
    y.rect(v, 22).radius(11).move(e, 0).fill(h ? s : "#ffffff").stroke({ color: s, width: 1.5 }), y.text((p) => p.plain(n)).font({ size: 12, weight: 600, family: ht, anchor: "middle" }).fill(h ? "#ffffff" : s).attr({ x: e + v / 2, y: 15 });
    const B = (p) => {
      p.stopPropagation?.(), p.preventDefault?.(), r();
    };
    let L = !1;
    return y.on("pointerdown", (p) => {
      L = !0, p.stopPropagation?.();
    }), y.on("mousedown", (p) => {
      p.stopPropagation?.(), L || p.preventDefault?.();
    }), y.on("click", (p) => {
      const i = L || !p.detail;
      L = !1, i ? B(p) : (p.stopPropagation?.(), p.preventDefault?.());
    }), y.on("keydown", (p) => {
      (p.key === "Enter" || p.key === " ") && B(p);
    }), v;
  }
  function U(t, e, n, l, h, s, r, f) {
    const v = t.group().attr(e), y = v.group();
    let B = 0;
    return s.forEach(([L, p, i, m], c) => {
      B += It(y, B, L, p, !c, h, m, i) + 6;
    }), v.transform({ translateX: n.x, translateY: n.y, scale: 1 / l, originX: 0, originY: 0 }), y.attr("transform", `translate(${r < 0 ? r - B + 6 : r} ${f})`), v;
  }
  const kt = (t) => Math.round(18 + 6.8 * t.length) + 6 + Math.round(18 + 6.8 * 11), tt = (t) => Math.round(28 + 7 * F(t, 64).length), at = (t, e, n, l) => {
    const h = e.card?.state, s = " the suggestion from " + Q(t).replace(/ · /g, ", ") + ": " + l, r = { actionId: t.actionId, itemId: e.id }, f = h === "unclear", v = f ? "Try again anyway" : h ? "Approve" : n, y = h ? "Decline" : "Discard";
    return /^(running|done|declined)$/.test(h) ? [] : [[v, v + s, "keep", () => f ? W.tryAgain(r) : W.keep(r)], [y, y + s, "discard", () => W.discard(r)]];
  };
  function rt(t, e, n, l, h) {
    const s = t.group().attr({ "data-suggestion-tag": "", "pointer-events": "none" }), r = F(l, 64);
    s.rect(tt(l), 22).radius(11).fill("#ffffff").stroke({ color: h, width: 1.2 }).attr("fill-opacity", 0.95), s.polygon(Nt(12, 12, 6)).fill(h), s.text((f) => f.plain(r)).font({ size: 12, family: ht }).fill("#111827").attr({ x: 22, y: 16 }), s.transform({ translateX: e.x, translateY: e.y, scale: 1 / n, originX: 0, originY: 0 });
  }
  function Y(t, e = "pointer") {
    e === "focus" && t !== null && t === T || (T = t, V = e, I?.node?.querySelectorAll?.("[data-on-hover]").forEach((n) => dt(n, n.getAttribute("data-suggestion-controls") === t)));
  }
  const dt = (t, e) => {
    t.style.display = e ? "" : "none", t.style.visibility = e ? "" : "hidden";
  };
  function ct(t) {
    const e = typeof document < "u" ? document.activeElement : null, n = !!(e && I?.node?.contains?.(e)), l = n ? e.closest("[data-suggestion-hit]")?.getAttribute("data-suggestion-hit") : null, h = n ? e.closest("[data-suggestion-button]") : null, s = h?.parentElement?.closest("[data-suggestion-controls], [data-suggestion-all]"), r = (v, y) => `[${v}="${String(y).replace(/["\\]/g, "\\$&")}"]`, f = l != null ? r("data-suggestion-hit", l) : h && s ? (s.hasAttribute("data-suggestion-all") ? r("data-suggestion-all", s.getAttribute("data-suggestion-all")) : r("data-suggestion-controls", s.getAttribute("data-suggestion-controls"))) + " " + r("data-suggestion-button", h.getAttribute("data-suggestion-button")) : null;
    Z = !0;
    try {
      t();
    } finally {
      Z = !1;
    }
    f && document.activeElement !== e && I?.node?.querySelector?.(f)?.focus?.({ preventScroll: !0 });
  }
  function lt() {
    const t = I?.node, e = t?.parentNode;
    if (!t || !e) return;
    const n = [...e.children].find((l) => l.hasAttribute("data-agent-presence"));
    t.nextElementSibling && t.nextElementSibling !== n && ct(() => e.appendChild(t)), n?.nextElementSibling && e.appendChild(n);
  }
  function et(t = !1) {
    if (R) return;
    const e = Et(u), n = J(x), l = JSON.stringify([e.toFixed(4), k(), At(n), n.map(({ action: r, item: f }) => [r.actionId, r.label, r.colorIndex, r.origin, r.via, r.invitedBy, f])]), h = !!I?.node?.isConnected;
    if (!t && l === G && (h || !n.length)) return;
    G = l, T && !n.some(({ item: r }) => r.id === T) && (T = null);
    const s = vt();
    ct(() => {
      s.clear(), bt(s, e, n);
    }), lt(), n.length || (I?.remove(), I = null, H = []);
  }
  function bt(t, e, n) {
    const l = k(), h = [], s = [], r = /* @__PURE__ */ new Map();
    for (const { action: i, item: m } of n) {
      const c = r.get(i.actionId) ?? { action: i, items: [], frame: null };
      c.items.push(m), r.set(i.actionId, c), m.kind === "add" && (c.frame = nt(c.frame, X(j(z(m.nodeId || "")))));
    }
    for (const i of r.values())
      if (!i.frame)
        for (const m of i.items)
          (m.kind === "link" || m.kind === "unlink") && (i.frame = nt(nt(i.frame, q(m.parentId ?? m.association?.parentId)), q(m.association?.childId)));
    const f = 6 / e, v = 28 / e, y = (i, m, c) => ({ x: i, y: m, w: c, h: 22 / e }), L = [...[...r.values()].filter((i) => i.frame).map((i) => i.frame = { x: i.frame.x - 2 * f, y: i.frame.y - 2 * f, w: i.frame.w + 4 * f, h: i.frame.h + 4 * f })];
    for (const i of u.nodes?.allNodes || []) if (!O.has(i?.id)) {
      const m = X(i);
      m && L.push(m);
    }
    const p = (i, m) => {
      const c = L.filter((N) => N !== m), D = (N) => c.reduce((o, w) => o + Dt(N, w), 0);
      let P = i.find((N) => !D(N));
      return P || (P = [...i, ...[1, 2, 3, 4].map((o) => ({ ...i[0], y: i[0].y - o * v })), ...[1, 2, 3, 4].map((o) => ({ ...i[1] ?? i[0], y: (i[1] ?? i[0]).y + o * v }))].reduce((o, w) => D(w) < D(o) ? w : o)), L.push(P), P;
    };
    for (const { action: i, items: m, frame: c } of r.values()) {
      const D = Pt(i.colorIndex), P = Q(i), N = t.group().attr({ "data-suggestion-group": i.actionId });
      if (c) {
        const o = Tt(m);
        N.rect(c.w, c.h).move(c.x, c.y).radius(10 / e).fill("none").stroke({ color: D, width: 1.5 / e, dasharray: `${10 / e} ${6 / e}` }).attr({ "pointer-events": "none", "data-suggestion-frame": i.actionId });
        const w = tt(P + " · " + o) / e, _ = p([y(c.x, c.y - v, w), y(c.x, c.y + c.h + f, w), y(c.x + f, c.y + f, w)], c);
        rt(N, _, e, P + " · " + o, D);
        const g = m.filter((K) => K.card).length, C = "Keep all" + (g ? " suggestions" : ""), E = kt(C) / e, S = c.x + c.w - E, b = l && g < m.length ? p([y(S, c.y + c.h + f, E), y(S, c.y - v, E), y(c.x, c.y + c.h + v + f, E)], c) : null, M = " of the suggestion from " + P.replace(/ · /g, ", ") + ": " + o;
        b && U(
          N,
          { "data-suggestion-all": i.actionId },
          b,
          e,
          D,
          [[C, C + M, "keep-all", () => W.keepAll(i.actionId)], ["Discard all", "Discard all" + M, "discard-all", () => W.discardAll(i.actionId)]],
          0,
          0
        ), s.push({ actionId: i.actionId, frame: c, tag: _, all: b, words: o });
      }
      for (const o of m) {
        const w = N.group().attr({ "data-suggestion": o.id, "data-suggestion-kind": o.kind, "data-action": i.actionId }), _ = { color: o.kind === "remove" || o.kind === "unlink" ? pt : D, width: 2 / e, dasharray: `${8 / e} ${5 / e}` };
        let g = null, C = !1;
        if (o.kind === "link" || o.kind === "unlink") {
          const E = q(o.parentId ?? o.association?.parentId), S = q(o.association?.childId);
          if (!E || !S) {
            w.remove();
            continue;
          }
          const b = yt(E, S), M = yt(S, E);
          w.line(b.x, b.y, M.x, M.y).stroke({ ..._, width: 2.5 / e }).attr({ "pointer-events": "none", "data-suggestion-line": "" }), g = { x: Math.min(b.x, M.x), y: Math.min(b.y, M.y), w: Math.abs(M.x - b.x), h: Math.abs(M.y - b.y) }, w.attr({ role: "img", "aria-label": P + (o.kind === "unlink" ? " suggests removing this line" : " suggests this line") });
        } else {
          if (g = X(j(o.kind === "add" ? z(o.nodeId || "") : o.nodeId)), !g) {
            w.remove();
            continue;
          }
          w.rect(g.w + 2 * f, g.h + 2 * f).move(g.x - f, g.y - f).radius(f).fill("none").stroke(_).attr({ "pointer-events": "none", "data-suggestion-outline": "" });
          const E = ot(o.kind === "add" ? o.node?.options?.text ?? "" : j(o.nodeId)?.options?.text ?? "");
          if (o.kind === "add") {
            const S = o.card?.state, b = at(i, o, "Keep", (S ? "" : "add ") + "“" + F(E, 40) + "”");
            if (l && b.length) {
              w.rect(g.w, g.h).move(g.x, g.y).fill("#fff").attr({
                "fill-opacity": 0,
                "pointer-events": "all",
                tabindex: 0,
                role: "group",
                "aria-label": "Suggested by " + P + ": " + F(E, 60) + ". " + (S ? b[0][0] + " or decline it." : "Keep or discard it alone."),
                "data-suggestion-hit": o.id
              });
              const M = U(w, { "data-suggestion-controls": o.id, "data-on-hover": "" }, { x: g.x + g.w, y: g.y + g.h }, e, D, b, -6, -28);
              T !== o.id && dt(M.node, !1);
              const K = w.node;
              K.addEventListener("pointerenter", ($) => {
                $.pointerType !== "touch" && Y(o.id);
              }), K.addEventListener("pointerleave", ($) => {
                $.pointerType !== "touch" && T === o.id && V === "pointer" && !K.contains(document.activeElement) && Y(null);
              }), K.addEventListener("pointerup", ($) => {
                if ($.pointerType !== "touch" || $.target?.closest?.("[data-suggestion-button]")) return;
                const gt = !(T === o.id && V !== "pointer");
                Y(gt ? o.id : null, "tap"), gt && K.querySelector("[data-suggestion-hit]")?.focus?.({ preventScroll: !0 });
              }), K.addEventListener("focusin", () => Y(o.id, "focus")), K.addEventListener("focusout", ($) => {
                !Z && T === o.id && !K.contains($.relatedTarget) && Y(null);
              }), C = !0;
            }
          } else {
            const S = o.kind === "update", b = P + " — " + (S ? mt(o) : "Suggests removing this note"), M = tt(b) / e;
            rt(w, p([y(g.x - f, g.y - f - v, M), y(g.x - f, g.y + g.h + 2 * f, M)], null), e, b, S ? D : pt), l && (U(w, { "data-suggestion-controls": o.id }, { x: g.x + g.w + f, y: g.y + g.h + f }, e, D, at(
              i,
              o,
              S ? "Keep" : "Remove",
              S ? mt(o).replace(/^Suggests/, "change “" + F(E, 24) + "”,").replace(/: “/, " to “") : "remove “" + F(E, 40) + "”"
            ), -1, 6), C = !0);
          }
        }
        h.push({
          actionId: i.actionId,
          itemId: o.id,
          kind: o.kind,
          nodeId: o.nodeId ?? null,
          ghostId: o.kind === "add" && o.nodeId ? z(o.nodeId) : null,
          label: P,
          box: g,
          controls: C,
          frame: c
        });
      }
    }
    H = s, it = h;
  }
  function At(t) {
    const e = /* @__PURE__ */ new Set();
    for (const { item: n } of t)
      n.nodeId && (e.add(n.nodeId), e.add(z(n.nodeId))), n.parentId && e.add(n.parentId), n.association?.childId && (e.add(n.association.childId), e.add(z(n.association.childId)));
    return [...e].map((n) => {
      const l = X(j(n));
      return l ? n + ":" + [l.x, l.y, l.w, l.h].map(Math.round).join(",") : "";
    }).join(";");
  }
  function ft(t = !1) {
    R || (wt(), et(t));
  }
  const St = setInterval(() => {
    !R && J(x).length && et(!1);
  }, 250);
  function ut(t, e) {
    if (!k()) return;
    const n = e ? a.onKeepAll : a.onDiscardAll;
    if (n) return n(t);
    const l = J(x).filter(({ action: s }) => s.actionId === t), h = l.some(({ item: s }) => s.kind === "add");
    for (const { item: s } of l) (!h || s.kind !== "link") && !(e && s.card) && (e ? a.onKeep : a.onDiscard)?.({ actionId: t, itemId: s.id });
  }
  const W = {
    set(t) {
      R || (x = Array.isArray(t) ? t.filter((e) => e && typeof e.actionId == "string") : [], ft());
    },
    shown: () => it.map((t) => ({ ...t, box: t.box && { ...t.box }, frame: t.frame && { ...t.frame } })),
    groups: () => H.map((t) => ({ ...t })),
    keep(t) {
      k() && a.onKeep?.(t);
    },
    discard(t) {
      k() && a.onDiscard?.(t);
    },
    tryAgain(t) {
      k() && (a.onTryAgain ?? a.onKeep)?.(t);
    },
    keepAll: (t) => ut(t, !0),
    discardAll: (t) => ut(t, !1),
    destroy() {
      if (!R) {
        R = !0, clearInterval(St), st(() => {
          for (const [t, e] of O) u.nodes?.one?.(t) === e.node && u.nodes.remove(t);
        }), O.clear();
        try {
          xt();
        } catch {
        }
        I?.remove(), I = null;
      }
    }
  };
  return W;
}
export {
  Lt as GHOST_PREFIX,
  jt as createAgentSuggestions,
  z as ghostIdOf,
  Tt as groupWords,
  J as pendingItems
};
