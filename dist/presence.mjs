const et = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), St = 6e3, kt = 600, Tt = 6, Bt = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, F = (n) => {
  if (n == null) return null;
  const r = n instanceof Date ? n.getTime() : typeof n == "number" ? n : Date.parse(n);
  return Number.isFinite(r) ? r : null;
}, O = (n, r) => n.length > r ? n.slice(0, r - 1).trimEnd() + "…" : n, B = (n) => String(n ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function Nt(n) {
  const r = n.plan?.steps ?? [];
  if (r.length) {
    const x = r.findIndex((c) => c.status === "doing"), b = r.findIndex((c) => c.status === "stopped");
    if (b >= 0) return "Stopped: " + B(r[b].text);
    if (r.every((c) => c.status === "done" || c.status === "skipped")) return "Done";
    const u = x >= 0 ? x : Math.min(Math.max(n.plan.current ?? 0, 0), r.length - 1);
    return B(r[u].text);
  }
  return B(n.message ?? "") || null;
}
function vt(n) {
  return (n.plan?.steps ?? []).map((r) => Bt[r.status] + " " + (r.status === "stopped" ? "Stopped: " : "") + B(r.text));
}
function bt(n, r, { holdMs: v = St, fadeMs: x = kt, max: b = Tt } = {}) {
  const u = [];
  for (const c of n) {
    if (!c || typeof c.agentKey != "string") continue;
    const d = F(c.expiresAt), k = F(c.endedAt);
    if (c.status === "live" && k === null) {
      if (d === null || r >= d) continue;
      u.push({ record: c, opacity: 1, until: d });
      continue;
    }
    const y = (k ?? F(c.updatedAt) ?? r) + v;
    r >= y + x || u.push({ record: c, opacity: r <= y ? 1 : 1 - (r - y) / x, until: y + x });
  }
  return u.sort((c, d) => (F(d.record.updatedAt) ?? 0) - (F(c.record.updatedAt) ?? 0)), u.slice(0, b);
}
function Ct() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const ut = 400, jt = 250, zt = 5, nt = 240, Pt = 600, ot = 40, st = 30, dt = (n, r) => Math.max(0, Math.min(n.x + n.w, r.x + r.w) - Math.max(n.x, r.x)) * Math.max(0, Math.min(n.y + n.h, r.y + r.h) - Math.max(n.y, r.y));
function Ht(n, r, v, x, b, u = []) {
  const c = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let d = c[0], k = 1 / 0;
  for (const L of c) {
    const y = gt(ht(n, r, v, L), x, b, u);
    if (y <= 1e-9) return L;
    y < k && (d = L, k = y);
  }
  return d;
}
function ht(n, r, v, x) {
  const b = x.right ? ot : -(ot + r.w), u = x.down ? st : -(st + r.h);
  return { x: n.x + b / v, y: n.y + u / v, w: r.w / v, h: r.h / v };
}
function At(n, r) {
  const v = O(B(n.label), 48), x = Nt(n), b = x ? O(x, 40) : "", u = Math.max(96, Math.min(nt, 16 + Math.max(7 * v.length, 6.3 * b.length))), c = b ? 38 : 22, d = r ? (n.plan?.steps ?? []).length : 0;
  return { width: u, height: c, w: Math.max(u, d ? nt : 0), h: c + (d ? 18 + d * 18 : 0) };
}
function Ot(n, r, v, x, b = []) {
  const u = Math.min(8, n.w / 4, n.h / 4), c = [
    { x: n.x + n.w - u, y: n.y + n.h - u, side: { right: !0, down: !0 } },
    { x: n.x + u, y: n.y + n.h - u, side: { right: !1, down: !0 } },
    { x: n.x + n.w - u, y: n.y + u, side: { right: !0, down: !1 } },
    { x: n.x + u, y: n.y + u, side: { right: !1, down: !1 } }
  ];
  let d = c[0], k = 1 / 0;
  for (const L of c) {
    const y = gt(ht(L, r, v, L.side), x, [n], b);
    if (y <= 1e-9) return L;
    y < k && (d = L, k = y);
  }
  return d;
}
function gt(n, r, v, x) {
  return (r ? n.w * n.h - dt(n, r) : 0) * 10 + v.reduce((u, c) => u + dt(n, c), 0) * 3 + x.reduce((u, c) => u + dt(n, c), 0);
}
function Wt(n, r = {}) {
  const v = r.now ?? (() => Date.now()), x = r.reducedMotion ?? Ct, b = r.holdMs ?? St, u = r.fadeMs ?? kt, c = r.maxAgents ?? Tt, d = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Set();
  let L = [], y = null, W = null, q = null, C = !1, rt = 0;
  const Lt = () => (y && y.node?.isConnected !== !1 && y.node?.parentNode || (y = n.canvas.group(), y.attr({ "data-agent-presence": "", "pointer-events": "none" })), y);
  function pt() {
    try {
      const t = n.canvas.viewbox(), e = n.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !e?.width || !e?.height) return null;
      const o = String(n.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), i = e.width / t.width, f = e.height / t.height, l = o === "none" ? i : /slice/.test(o) ? Math.max(i, f) : Math.min(i, f), p = e.width / l, h = e.height / l, T = { x: t.x + (t.width - p) / 2, y: t.y + (t.height - h) / 2, w: p, h };
      let s = e.left, w = e.top, S = e.right, a = e.bottom;
      for (let A = n.canvas.node?.parentElement; A && A !== document.body; A = A.parentElement) {
        const I = getComputedStyle(A);
        if (I.overflow === "visible" && I.overflowX === "visible" && I.overflowY === "visible") continue;
        const m = A.getBoundingClientRect();
        !m.width || !m.height || (s = Math.max(s, m.left), w = Math.max(w, m.top), S = Math.min(S, m.right), a = Math.min(a, m.bottom));
      }
      return S - s < 1 || a - w < 1 ? { view: T, scale: l } : { view: { x: T.x + (s - e.left) / l, y: T.y + (w - e.top) / l, w: (S - s) / l, h: (a - w) / l }, scale: l };
    } catch {
      return null;
    }
  }
  function U() {
    const t = pt();
    if (t) return t.scale;
    try {
      const e = n.getZoom?.();
      if (typeof e == "number" && e > 0) return e;
    } catch {
    }
    return 1;
  }
  const It = () => {
    try {
      return n.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function Et(t) {
    const o = (n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((i) => i?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function yt(t) {
    const e = t?.options;
    return !e || ![e.x, e.y, e.width, e.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: e.x, y: e.y, w: e.width, h: e.height };
  }
  const _t = (t) => n.nodes?.one?.(t) ?? n.nodes?.allNodes?.find?.((e) => e?.options?.name === t), J = () => (n.nodes?.allNodes ?? []).map(yt).filter((t) => !!t), Ft = (t, e) => t.x === e.x && t.y === e.y && t.w === e.w && t.h === e.h;
  function it() {
    return J().map((t) => [t.x, t.y, t.w, t.h].map(Math.round).join(",")).join(";");
  }
  function at() {
    const t = Z(), e = U();
    return t ? [t.x, t.y, t.w, t.h].map((o) => Math.round(o * e / 8)).join(":") : "";
  }
  function Z() {
    const t = pt();
    if (t) return t.view;
    try {
      const e = n.canvas.viewbox();
      if (e && [e.x, e.y, e.width, e.height].every((o) => Number.isFinite(o)) && e.width > 0 && e.height > 0)
        return { x: e.x, y: e.y, w: e.width, h: e.height };
    } catch {
    }
    return null;
  }
  function Dt(t, e = { w: nt, h: 38 }, o = 1) {
    const i = Z();
    if (i) {
      const p = 8 / o, h = t * 64 / o, T = [
        { x: i.x + p, y: i.y + p + h, side: { right: !0, down: !0 } },
        { x: i.x + i.w - p, y: i.y + p + h, side: { right: !1, down: !0 } },
        { x: i.x + p, y: i.y + i.h - p - h, side: { right: !0, down: !1 } },
        { x: i.x + i.w - p, y: i.y + i.h - p - h, side: { right: !1, down: !1 } }
      ], s = J();
      let w = T[0], S = 1 / 0;
      for (const a of T) {
        const A = gt(ht(a, e, o, a.side), i, [], s);
        if (A <= 1e-9) return a;
        A < S && (w = a, S = A);
      }
      return w;
    }
    let f = 1 / 0, l = 1 / 0;
    for (const p of n.nodes?.allNodes ?? []) {
      const h = p?.options;
      typeof h?.x == "number" && typeof h?.y == "number" && (f = Math.min(f, h.x), l = Math.min(l, h.y));
    }
    return Number.isFinite(f) || (f = 100, l = 100), { x: f - 40, y: l - 40 + t * 64, side: null };
  }
  function Rt(t, e, o) {
    const { record: i } = t, f = et[(i.colorIndex % et.length + et.length) % et.length], l = Nt(i), p = vt(i), h = p.length > 0 && (t.open || !o), T = O(B(i.label), 48);
    t.body?.remove();
    const s = t.group.group();
    t.body = s, s.path("M0 0 L14 5 L7 7 L5 14 Z").fill(f).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const w = s.group().attr("data-agent-avatar", ""), S = 11, a = 24, A = 24, I = Array.from({ length: 6 }, (g, _) => {
      const Y = Math.PI / 6 + _ * Math.PI / 3;
      return (a + S * Math.cos(Y)).toFixed(2) + "," + (A + S * Math.sin(Y)).toFixed(2);
    }).join(" ");
    w.polygon(I).fill(f).stroke({ color: "#fff", width: 1.5 }), w.text((g) => g.plain(O(B(i.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: a, y: A + 4 }), w.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: f, width: 0.8 });
    const m = s.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: p.length ? "pointer" : "default",
      role: "button",
      tabindex: p.length ? 0 : -1,
      "aria-expanded": String(h),
      "aria-label": T + (l ? ": " + l : "")
    }), D = l ? O(l, 40) : "", M = At(i, h), { width: E, height: j } = M, z = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, R = t.routedSide ?? Ht(z, M, e, Z(), [], J());
    let K = R.right ? ot : -(ot + M.w), X = R.down ? st : -(st + M.h);
    const N = Z();
    if (N) {
      const _ = z, Y = (N.x - _.x) * e + 4, $ = (N.x + N.w - _.x) * e - 4, G = (N.y - _.y) * e + 4, ft = (N.y + N.h - _.y) * e - 4;
      M.w <= $ - Y && (K = Math.min(Math.max(K, Y), $ - M.w)), M.h <= ft - G && (X = Math.min(Math.max(X, G), ft - M.h));
    }
    t.side = R;
    let P = R.right, H = R.down;
    if (N) {
      const g = (a + S + 2) / e;
      P && z.x + g > N.x + N.w ? P = !1 : !P && z.x - g < N.x && (P = !0), H && z.y + g > N.y + N.h ? H = !1 : !H && z.y - g < N.y && (H = !0);
    }
    (!P || !H) && w.attr("transform", `translate(${P ? 0 : -2 * a} ${H ? 0 : -2 * A})`), m.attr("data-agent-side", (R.right ? "right" : "left") + "-" + (R.down ? "down" : "up")), m.rect(E, j).radius(7).move(K, X).fill("#fff").stroke({ color: f, width: 1.5 }), m.text((g) => g.plain(T)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(f).attr({ x: K + 8, y: X + 15 }), D && m.text((g) => g.plain(D)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: K + 8, y: X + 31 });
    const Mt = (g) => {
      g.stopPropagation?.(), mt.expand(i.agentKey);
    };
    if (m.on("pointerdown", (g) => g.stopPropagation?.()), m.on("click", Mt), m.on("keydown", (g) => {
      (g.key === "Enter" || g.key === " ") && (g.preventDefault?.(), Mt(g));
    }), h) {
      const g = s.group().attr("data-agent-plan", ""), _ = p.length;
      g.rect(nt, 12 + _ * 18).radius(8).move(K, X + j + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), p.forEach((Y, $) => {
        const G = i.plan.steps[$].status;
        g.text((Gt) => Gt.plain(O(Y, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: G === "doing" ? 600 : 400 }).fill(G === "done" || G === "skipped" ? "#6b7280" : "#111827").attr({ x: K + 10, y: X + j + 6 + 20 + $ * 18 }).attr("data-step-status", G);
      });
    }
    s.element("title").words(T + (l ? " — " + l : "")), t.compact = o, t.lines = p, t.step = l, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), rt = e;
  }
  function xt(t, e) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / e, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function lt(t, e, o, i) {
    const f = Z(), l = J(), h = t.targets.map((s) => yt(_t(s))).filter((s) => !!s).slice(0, zt).map((s) => Ot(s, o, i, f, l.filter((w) => !Ft(w, s))));
    if (!h.length) {
      const s = Dt(e, o, i);
      return { legs: [{ x: s.x, y: s.y, ms: ut }], side: s.side };
    }
    const T = h.length === 1 ? ut : jt;
    return { legs: h.map((s) => ({ x: s.x, y: s.y, ms: T })), side: h[h.length - 1].side };
  }
  const ct = (t) => t.targets.some((e) => Et(e) !== null), Kt = (t) => 1 - Math.pow(1 - t, 3);
  function wt(t) {
    let e = !1;
    for (const o of d.values())
      for (; o.path.length; ) {
        const i = o.path[0];
        if (x() || i.ms <= 0) {
          o.x = i.x, o.y = i.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const f = Math.min(1, (t - o.leg.startedAt) / i.ms), l = Kt(f);
        if (o.x = o.leg.fromX + (i.x - o.leg.fromX) * l, o.y = o.leg.fromY + (i.y - o.leg.fromY) * l, f < 1) {
          e = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return e;
  }
  function V() {
    if (C) return;
    const t = v(), e = bt(L, t, { holdMs: b, fadeMs: u, max: c }), o = new Set(e.map((s) => s.record.agentKey));
    for (const [s, w] of d) o.has(s) || (w.group.remove(), d.delete(s));
    if (!e.length) {
      Q(null);
      return;
    }
    const i = Lt();
    i.front?.();
    const f = U(), l = e.length >= 2 || It() < Pt;
    e.forEach(({ record: s, opacity: w }, S) => {
      let a = d.get(s.agentKey);
      const A = s.targets.join("\0"), I = k.has(s.agentKey), m = At(s, vt(s).length > 0 && (I || !l)), D = [m.w, m.h, f.toFixed(4), at(), it()].join(",");
      if (a) {
        if (a.targetsKey !== A || !a.found && ct(s)) {
          const M = lt(s, S, m, f);
          a.path = M.legs, a.leg = null, a.found = ct(s), a.routedSide = M.side, a.routedFor = D;
        } else if (a.routedFor !== D && a.found) {
          const M = lt(s, S, m, f), E = M.legs[M.legs.length - 1], j = a.path.length ? a.path[a.path.length - 1] : { x: a.x, y: a.y };
          (E.x !== j.x || E.y !== j.y) && (a.path = [{ ...E, ms: ut }], a.leg = null), a.routedSide = M.side, a.routedFor = D;
        }
      } else {
        const M = lt(s, S, m, f), E = M.legs[0];
        a = {
          key: s.agentKey,
          group: i.group().attr({ "data-agent": s.agentKey }),
          body: null,
          record: s,
          targetsKey: A,
          found: ct(s),
          x: E.x,
          y: E.y,
          path: M.legs.slice(1),
          leg: null,
          open: I,
          opacity: w,
          compact: l,
          lines: [],
          step: null,
          routedSide: M.side,
          routedFor: D
        }, d.set(s.agentKey, a);
      }
      a.targetsKey = A, a.record = s, a.opacity = Math.max(0, Math.min(1, w)), a.open = k.has(s.agentKey), Rt(a, f, l);
    });
    const p = wt(t);
    for (const s of d.values()) xt(s, f);
    const h = e.some((s) => s.opacity < 1), T = Math.min(...e.map((s) => s.record.status === "live" && F(s.record.endedAt) === null ? s.until : (F(s.record.endedAt) ?? F(s.record.updatedAt) ?? t) + b));
    Q(p || h ? "frame" : Math.max(16, T - t));
  }
  function Xt() {
    if (W = null, C) return;
    const t = v(), e = wt(t), o = U(), i = bt(L, t, { holdMs: b, fadeMs: u, max: c });
    if (i.some((l) => l.opacity < 1) || d.size !== i.length || Math.abs(o - rt) > 1e-6) {
      V();
      return;
    }
    for (const l of d.values()) xt(l, o);
    e && Q("frame");
  }
  function Q(t) {
    W !== null && (cancelAnimationFrame(W), W = null), q !== null && (clearTimeout(q), q = null), !(t === null || C) && (t === "frame" ? W = requestAnimationFrame(Xt) : q = setTimeout(V, Math.min(t, 6e4)));
  }
  let tt = null;
  const Yt = () => {
    if (tt !== null) return;
    let t = at(), e = it(), o = e;
    tt = setInterval(() => {
      if (C || !d.size) return;
      const i = at(), f = it(), l = f === e && f !== o;
      e = f, (Math.abs(U() - rt) > 1e-6 || i !== t || l) && (t = i, o = f, V());
    }, 250);
  }, mt = {
    set(t) {
      C || (L = Array.isArray(t) ? t.filter((e) => e && typeof e.agentKey == "string") : [], V(), Yt());
    },
    expand(t, e) {
      const o = e ?? !k.has(t);
      o ? k.add(t) : k.delete(t), r.onToggle?.(t, o), V();
    },
    shown() {
      return [...d.values()].map((t) => ({
        agentKey: t.key,
        label: t.record.label,
        step: t.step,
        x: t.x,
        y: t.y,
        opacity: t.opacity,
        compact: t.compact,
        lines: t.lines,
        side: t.side ?? { right: !0, down: !0 }
      }));
    },
    destroy() {
      C = !0, Q(null), tt !== null && clearInterval(tt);
      for (const t of d.values()) t.group.remove();
      d.clear(), y?.remove(), y = null;
    }
  };
  return mt;
}
export {
  kt as AGENT_FADE_MS,
  ut as AGENT_GLIDE_MS,
  St as AGENT_HOLD_MS,
  Tt as AGENT_MAX_DRAWN,
  zt as AGENT_MAX_VISITS,
  et as AGENT_PALETTE,
  jt as AGENT_VISIT_MS,
  Ot as agentAnchor,
  vt as agentChecklist,
  Nt as agentStepText,
  ht as agentTagBox,
  Ht as agentTagSide,
  Wt as createAgentPresence,
  bt as visibleAgents
};
