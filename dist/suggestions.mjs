import { agentName as At, plainLine as et, canvasZoom as St, boxOf as z, agentColor as Mt, clip as B, overlap as Et, hexPoints as Pt } from "./presence.mjs";
function Dt(r) {
  const { xPos: a, yPos: l, ...b } = r;
  return { ...b, x: Number(a ?? r.x) || 0, y: Number(l ?? r.y) || 0 };
}
const Nt = "ghost-", j = (r) => Nt + r;
function Y(r) {
  const a = [];
  for (const l of Array.isArray(r) ? r : [])
    if (!(!l || typeof l.actionId != "string"))
      for (const b of Array.isArray(l.items) ? l.items : [])
        b && b.state === "pending" && typeof b.id == "string" && a.push({ action: l, item: b });
  return a;
}
const Ot = Object.freeze({
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
}), ut = "Roboto, Helvetica, Arial, sans-serif", gt = "#b91c1c";
function pt(r, a) {
  const l = r.x + r.w / 2, b = r.y + r.h / 2, A = a.x + a.w / 2 - l, m = a.y + a.h / 2 - b;
  if (!A && !m) return { x: l, y: b };
  const I = A ? r.w / 2 / Math.abs(A) : 1 / 0, K = m ? r.h / 2 / Math.abs(m) : 1 / 0, F = Math.min(I, K, 1);
  return { x: l + A * F, y: b + m * F };
}
function ht(r) {
  const a = r.changes || {};
  if (typeof a.text == "string") return "Suggests: “" + B(et(a.text), 48) + "”";
  const l = Object.keys(a), b = l.some((m) => ["xPos", "yPos", "x", "y"].includes(m)), A = l.some((m) => ["width", "height"].includes(m));
  return b && l.every((m) => ["xPos", "yPos", "x", "y"].includes(m)) ? "Suggests moving it here" : A && l.every((m) => ["width", "height"].includes(m)) ? "Suggests resizing it" : "Suggests restyling it";
}
const Lt = [["add", "note", "notes"], ["update", "change", "changes"], ["remove", "removal", "removals"], ["link", "line", "lines"], ["unlink", "line removed", "lines removed"]];
function Kt(r) {
  return Lt.map(([a, l, b]) => {
    const A = r.filter((m) => m.kind === a).length;
    return A ? A + " " + (A === 1 ? l : b) : "";
  }).filter(Boolean).join(", ");
}
const tt = (r, a) => !r || !a ? r || a : { x: Math.min(r.x, a.x), y: Math.min(r.y, a.y), w: Math.max(r.x + r.w, a.x + a.w) - Math.min(r.x, a.x), h: Math.max(r.y + r.h, a.y + a.h) - Math.min(r.y, a.y) };
function $t(r, a = {}) {
  const l = r?.v2 && typeof r.v2.canvas?.group == "function" ? r.v2 : r, b = a.toNode ?? Dt, A = () => a.canAct ? !!a.canAct() : !1;
  let m = [], I = null, K = !1, F = "";
  const O = /* @__PURE__ */ new Map();
  let nt = [], q = [], R = null, J = "pointer", H = !1;
  const yt = typeof l.setDragPolicy == "function" ? l.setDragPolicy({
    governs: (t) => typeof t?.id == "string" && O.has(t.id) ? Ot : null,
    onEnd: () => ({ accept: !1 }),
    // A load from the room replaced every note, the ghosts too: draw them again.
    onNotesReplaced() {
      O.clear(), ct(!0);
    }
  }) : () => {
  }, ot = (t) => typeof l.withPolicyAuthority == "function" ? l.withPolicyAuthority(t) : t();
  function mt() {
    return I && I.node?.isConnected !== !1 && I.node?.parentNode || (I = l.canvas.group(), I.attr({ "data-agent-suggestions": "", "data-export-never": "" })), I;
  }
  const $ = (t) => t ? l.nodes?.one?.(t) : void 0, G = (t) => t ? z($(t)) ?? z($(j(t))) : null, V = (t) => At(t);
  function xt() {
    const t = /* @__PURE__ */ new Map();
    for (const { action: e, item: n } of Y(m))
      n.kind === "add" && n.nodeId && n.node?.options && t.set(j(n.nodeId), { item: n, action: e });
    ot(() => {
      for (const [e, n] of O) {
        const c = t.get(e);
        c && JSON.stringify(c.item.node) === n.json && l.nodes?.one?.(e) === n.node || (l.nodes?.one?.(e) === n.node && l.nodes.remove(e), O.delete(e));
      }
      for (const [e, { item: n, action: c }] of t) {
        if (O.has(e) || n.nodeId && $(n.nodeId)) continue;
        const p = { ...n.node.options, id: e };
        let s;
        try {
          s = l.nodes.add(b(p));
        } catch {
          continue;
        }
        O.set(e, { node: s, json: JSON.stringify(n.node) }), Promise.resolve(s?.ready).then(() => {
          if (K || O.get(e)?.node !== s) return;
          s.applyGovernance?.();
          const f = s.svgGroup?.node;
          f && (f.style.opacity = "0.72", f.style.pointerEvents = "none", f.setAttribute("data-agent-ghost", n.nodeId || ""), f.setAttribute("aria-label", "Suggested by " + V(c) + ", not kept yet: " + et(n.node?.options?.text ?? "")), U(!1), dt());
        }).catch(() => {
        });
      }
    });
  }
  function vt(t, e, n, c, p, s, f, u = p ? "keep" : "discard") {
    const S = Math.round(18 + 6.8 * n.length), x = t.group().attr({
      role: "button",
      tabindex: 0,
      "aria-label": c,
      cursor: "pointer",
      "pointer-events": "all",
      "data-suggestion-button": u
    });
    x.rect(S, 22).radius(11).move(e, 0).fill(p ? s : "#ffffff").stroke({ color: s, width: 1.5 }), x.text((h) => h.plain(n)).font({ size: 12, weight: 600, family: ut, anchor: "middle" }).fill(p ? "#ffffff" : s).attr({ x: e + S / 2, y: 15 });
    const T = (h) => {
      h.stopPropagation?.(), h.preventDefault?.(), f();
    };
    let L = !1;
    return x.on("pointerdown", (h) => {
      L = !0, h.stopPropagation?.();
    }), x.on("mousedown", (h) => {
      h.stopPropagation?.(), L || h.preventDefault?.();
    }), x.on("click", (h) => {
      const i = L || !h.detail;
      L = !1, i ? T(h) : (h.stopPropagation?.(), h.preventDefault?.());
    }), x.on("keydown", (h) => {
      (h.key === "Enter" || h.key === " ") && T(h);
    }), S;
  }
  function Z(t, e, n, c, p, s, f, u) {
    const S = t.group().attr(e), x = S.group();
    let T = 0;
    return s.forEach(([L, h, i, y], d) => {
      T += vt(x, T, L, h, !d, p, y, i) + 6;
    }), S.transform({ translateX: n.x, translateY: n.y, scale: 1 / c, originX: 0, originY: 0 }), x.attr("transform", `translate(${f < 0 ? f - T + 6 : f} ${u})`), S;
  }
  const It = Math.round(18 + 6.8 * 8) + 6 + Math.round(18 + 6.8 * 11), Q = (t) => Math.round(28 + 7 * B(t, 64).length), it = (t, e, n, c) => {
    const p = " the suggestion from " + V(t).replace(/ · /g, ", ") + ": " + c, s = { actionId: t.actionId, itemId: e.id };
    return [[n, n + p, "keep", () => X.keep(s)], ["Discard", "Discard" + p, "discard", () => X.discard(s)]];
  };
  function st(t, e, n, c, p) {
    const s = t.group().attr({ "data-suggestion-tag": "", "pointer-events": "none" }), f = B(c, 64);
    s.rect(Q(c), 22).radius(11).fill("#ffffff").stroke({ color: p, width: 1.2 }).attr("fill-opacity", 0.95), s.polygon(Pt(12, 12, 6)).fill(p), s.text((u) => u.plain(f)).font({ size: 12, family: ut }).fill("#111827").attr({ x: 22, y: 16 }), s.transform({ translateX: e.x, translateY: e.y, scale: 1 / n, originX: 0, originY: 0 });
  }
  function W(t, e = "pointer") {
    e === "focus" && t !== null && t === R || (R = t, J = e, I?.node?.querySelectorAll?.("[data-on-hover]").forEach((n) => at(n, n.getAttribute("data-suggestion-controls") === t)));
  }
  const at = (t, e) => {
    t.style.display = e ? "" : "none", t.style.visibility = e ? "" : "hidden";
  };
  function rt(t) {
    const e = typeof document < "u" ? document.activeElement : null, n = !!(e && I?.node?.contains?.(e)), c = n ? e.closest("[data-suggestion-hit]")?.getAttribute("data-suggestion-hit") : null, p = n ? e.closest("[data-suggestion-button]") : null, s = p?.parentElement?.closest("[data-suggestion-controls], [data-suggestion-all]"), f = (S, x) => `[${S}="${String(x).replace(/["\\]/g, "\\$&")}"]`, u = c != null ? f("data-suggestion-hit", c) : p && s ? (s.hasAttribute("data-suggestion-all") ? f("data-suggestion-all", s.getAttribute("data-suggestion-all")) : f("data-suggestion-controls", s.getAttribute("data-suggestion-controls"))) + " " + f("data-suggestion-button", p.getAttribute("data-suggestion-button")) : null;
    H = !0;
    try {
      t();
    } finally {
      H = !1;
    }
    u && document.activeElement !== e && I?.node?.querySelector?.(u)?.focus?.({ preventScroll: !0 });
  }
  function dt() {
    const t = I?.node, e = t?.parentNode;
    if (!t || !e) return;
    const n = [...e.children].find((c) => c.hasAttribute("data-agent-presence"));
    t.nextElementSibling && t.nextElementSibling !== n && rt(() => e.appendChild(t)), n?.nextElementSibling && e.appendChild(n);
  }
  function U(t = !1) {
    if (K) return;
    const e = St(l), n = Y(m), c = JSON.stringify([e.toFixed(4), A(), kt(n), n.map(({ action: f, item: u }) => [f.actionId, f.label, f.colorIndex, f.origin, f.via, f.invitedBy, u])]), p = !!I?.node?.isConnected;
    if (!t && c === F && (p || !n.length)) return;
    F = c, R && !n.some(({ item: f }) => f.id === R) && (R = null);
    const s = mt();
    rt(() => {
      s.clear(), wt(s, e, n);
    }), dt(), n.length || (I?.remove(), I = null, q = []);
  }
  function wt(t, e, n) {
    const c = A(), p = [], s = [], f = /* @__PURE__ */ new Map();
    for (const { action: i, item: y } of n) {
      const d = f.get(i.actionId) ?? { action: i, items: [], frame: null };
      d.items.push(y), f.set(i.actionId, d), y.kind === "add" && (d.frame = tt(d.frame, z($(j(y.nodeId || "")))));
    }
    for (const i of f.values())
      if (!i.frame)
        for (const y of i.items)
          (y.kind === "link" || y.kind === "unlink") && (i.frame = tt(tt(i.frame, G(y.parentId ?? y.association?.parentId)), G(y.association?.childId)));
    const u = 6 / e, S = 28 / e, x = (i, y, d) => ({ x: i, y, w: d, h: 22 / e }), L = [...[...f.values()].filter((i) => i.frame).map((i) => i.frame = { x: i.frame.x - 2 * u, y: i.frame.y - 2 * u, w: i.frame.w + 4 * u, h: i.frame.h + 4 * u })];
    for (const i of l.nodes?.allNodes || []) if (!O.has(i?.id)) {
      const y = z(i);
      y && L.push(y);
    }
    const h = (i, y) => {
      const d = L.filter((N) => N !== y), D = (N) => d.reduce((o, v) => o + Et(N, v), 0);
      let E = i.find((N) => !D(N));
      return E || (E = [...i, ...[1, 2, 3, 4].map((o) => ({ ...i[0], y: i[0].y - o * S })), ...[1, 2, 3, 4].map((o) => ({ ...i[1] ?? i[0], y: (i[1] ?? i[0]).y + o * S }))].reduce((o, v) => D(v) < D(o) ? v : o)), L.push(E), E;
    };
    for (const { action: i, items: y, frame: d } of f.values()) {
      const D = Mt(i.colorIndex), E = V(i), N = t.group().attr({ "data-suggestion-group": i.actionId });
      if (d) {
        const o = Kt(y);
        N.rect(d.w, d.h).move(d.x, d.y).radius(10 / e).fill("none").stroke({ color: D, width: 1.5 / e, dasharray: `${10 / e} ${6 / e}` }).attr({ "pointer-events": "none", "data-suggestion-frame": i.actionId });
        const v = Q(E + " · " + o) / e, _ = h([x(d.x, d.y - S, v), x(d.x, d.y + d.h + u, v), x(d.x + u, d.y + u, v)], d);
        st(N, _, e, E + " · " + o, D);
        const g = It / e, C = d.x + d.w - g, P = c ? h([x(C, d.y + d.h + u, g), x(C, d.y - S, g), x(d.x, d.y + d.h + S + u, g)], d) : null, M = " of the suggestion from " + E.replace(/ · /g, ", ") + ": " + o;
        P && Z(
          N,
          { "data-suggestion-all": i.actionId },
          P,
          e,
          D,
          [["Keep all", "Keep all" + M, "keep-all", () => X.keepAll(i.actionId)], ["Discard all", "Discard all" + M, "discard-all", () => X.discardAll(i.actionId)]],
          0,
          0
        ), s.push({ actionId: i.actionId, frame: d, tag: _, all: P, words: o });
      }
      for (const o of y) {
        const v = N.group().attr({ "data-suggestion": o.id, "data-suggestion-kind": o.kind, "data-action": i.actionId }), _ = { color: o.kind === "remove" || o.kind === "unlink" ? gt : D, width: 2 / e, dasharray: `${8 / e} ${5 / e}` };
        let g = null, C = !1;
        if (o.kind === "link" || o.kind === "unlink") {
          const P = G(o.parentId ?? o.association?.parentId), M = G(o.association?.childId);
          if (!P || !M) {
            v.remove();
            continue;
          }
          const w = pt(P, M), k = pt(M, P);
          v.line(w.x, w.y, k.x, k.y).stroke({ ..._, width: 2.5 / e }).attr({ "pointer-events": "none", "data-suggestion-line": "" }), g = { x: Math.min(w.x, k.x), y: Math.min(w.y, k.y), w: Math.abs(k.x - w.x), h: Math.abs(k.y - w.y) }, v.attr({ role: "img", "aria-label": E + (o.kind === "unlink" ? " suggests removing this line" : " suggests this line") });
        } else {
          if (g = z($(o.kind === "add" ? j(o.nodeId || "") : o.nodeId)), !g) {
            v.remove();
            continue;
          }
          v.rect(g.w + 2 * u, g.h + 2 * u).move(g.x - u, g.y - u).radius(u).fill("none").stroke(_).attr({ "pointer-events": "none", "data-suggestion-outline": "" });
          const P = et(o.kind === "add" ? o.node?.options?.text ?? "" : $(o.nodeId)?.options?.text ?? "");
          if (o.kind === "add") {
            if (c) {
              v.rect(g.w, g.h).move(g.x, g.y).fill("#fff").attr({
                "fill-opacity": 0,
                "pointer-events": "all",
                tabindex: 0,
                role: "group",
                "aria-label": "Suggested by " + E + ": " + B(P, 60) + ". Keep or discard it alone.",
                "data-suggestion-hit": o.id
              });
              const M = Z(v, { "data-suggestion-controls": o.id, "data-on-hover": "" }, { x: g.x + g.w, y: g.y + g.h }, e, D, it(i, o, "Keep", "add “" + B(P, 40) + "”"), -6, -28);
              R !== o.id && at(M.node, !1);
              const w = v.node;
              w.addEventListener("pointerenter", (k) => {
                k.pointerType !== "touch" && W(o.id);
              }), w.addEventListener("pointerleave", (k) => {
                k.pointerType !== "touch" && R === o.id && J === "pointer" && !w.contains(document.activeElement) && W(null);
              }), w.addEventListener("pointerup", (k) => {
                if (k.pointerType !== "touch" || k.target?.closest?.("[data-suggestion-button]")) return;
                const ft = !(R === o.id && J !== "pointer");
                W(ft ? o.id : null, "tap"), ft && w.querySelector("[data-suggestion-hit]")?.focus?.({ preventScroll: !0 });
              }), w.addEventListener("focusin", () => W(o.id, "focus")), w.addEventListener("focusout", (k) => {
                !H && R === o.id && !w.contains(k.relatedTarget) && W(null);
              }), C = !0;
            }
          } else {
            const M = o.kind === "update", w = E + " — " + (M ? ht(o) : "Suggests removing this note"), k = Q(w) / e;
            st(v, h([x(g.x - u, g.y - u - S, k), x(g.x - u, g.y + g.h + 2 * u, k)], null), e, w, M ? D : gt), c && (Z(v, { "data-suggestion-controls": o.id }, { x: g.x + g.w + u, y: g.y + g.h + u }, e, D, it(
              i,
              o,
              M ? "Keep" : "Remove",
              M ? ht(o).replace(/^Suggests/, "change “" + B(P, 24) + "”,").replace(/: “/, " to “") : "remove “" + B(P, 40) + "”"
            ), -1, 6), C = !0);
          }
        }
        p.push({
          actionId: i.actionId,
          itemId: o.id,
          kind: o.kind,
          nodeId: o.nodeId ?? null,
          ghostId: o.kind === "add" && o.nodeId ? j(o.nodeId) : null,
          label: E,
          box: g,
          controls: C,
          frame: d
        });
      }
    }
    q = s, nt = p;
  }
  function kt(t) {
    const e = /* @__PURE__ */ new Set();
    for (const { item: n } of t)
      n.nodeId && (e.add(n.nodeId), e.add(j(n.nodeId))), n.parentId && e.add(n.parentId), n.association?.childId && (e.add(n.association.childId), e.add(j(n.association.childId)));
    return [...e].map((n) => {
      const c = z($(n));
      return c ? n + ":" + [c.x, c.y, c.w, c.h].map(Math.round).join(",") : "";
    }).join(";");
  }
  function ct(t = !1) {
    K || (xt(), U(t));
  }
  const bt = setInterval(() => {
    !K && Y(m).length && U(!1);
  }, 250);
  function lt(t, e) {
    if (!A()) return;
    const n = e ? a.onKeepAll : a.onDiscardAll;
    if (n) return n(t);
    const c = Y(m).filter(({ action: s }) => s.actionId === t), p = c.some(({ item: s }) => s.kind === "add");
    for (const { item: s } of c) (!p || s.kind !== "link") && (e ? a.onKeep : a.onDiscard)?.({ actionId: t, itemId: s.id });
  }
  const X = {
    set(t) {
      K || (m = Array.isArray(t) ? t.filter((e) => e && typeof e.actionId == "string") : [], ct());
    },
    shown: () => nt.map((t) => ({ ...t, box: t.box && { ...t.box }, frame: t.frame && { ...t.frame } })),
    groups: () => q.map((t) => ({ ...t })),
    keep(t) {
      A() && a.onKeep?.(t);
    },
    discard(t) {
      A() && a.onDiscard?.(t);
    },
    // Without the host's own Keep all, each waiting item of the action is kept or discarded in turn.
    keepAll: (t) => lt(t, !0),
    discardAll: (t) => lt(t, !1),
    destroy() {
      if (!K) {
        K = !0, clearInterval(bt), ot(() => {
          for (const [t, e] of O) l.nodes?.one?.(t) === e.node && l.nodes.remove(t);
        }), O.clear();
        try {
          yt();
        } catch {
        }
        I?.remove(), I = null;
      }
    }
  };
  return X;
}
export {
  Nt as GHOST_PREFIX,
  $t as createAgentSuggestions,
  j as ghostIdOf,
  Kt as groupWords,
  Y as pendingItems
};
