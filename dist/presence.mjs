const et = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), kt = 6e3, Nt = 600, Lt = 6, Pt = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" }, B = (e) => {
  if (e == null) return null;
  const s = e instanceof Date ? e.getTime() : typeof e == "number" ? e : Date.parse(e);
  return Number.isFinite(s) ? s : null;
}, W = (e, s) => e.length > s ? e.slice(0, s - 1).trimEnd() + "…" : e, P = (e) => String(e ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim();
function It(e) {
  const s = e.plan?.steps ?? [];
  if (s.length) {
    const p = s.findIndex((i) => i.status === "doing"), c = s.findIndex((i) => i.status === "stopped");
    if (c >= 0) return "Stopped: " + P(s[c].text);
    if (s.every((i) => i.status === "done" || i.status === "skipped")) return "Done";
    const h = p >= 0 ? p : Math.min(Math.max(e.plan.current ?? 0, 0), s.length - 1);
    return P(s[h].text);
  }
  return P(e.message ?? "") || null;
}
function vt(e) {
  return (e.plan?.steps ?? []).map((s) => Pt[s.status] + " " + (s.status === "stopped" ? "Stopped: " : "") + P(s.text));
}
function St(e, s, { holdMs: m = kt, fadeMs: p = Nt, max: c = Lt } = {}) {
  const h = [];
  for (const i of e) {
    if (!i || typeof i.agentKey != "string") continue;
    const g = B(i.expiresAt), T = B(i.endedAt);
    if (i.status === "live" && T === null) {
      if (g === null || s >= g) continue;
      h.push({ record: i, opacity: 1, until: g });
      continue;
    }
    const A = (T ?? B(i.updatedAt) ?? s) + m;
    s >= A + p || h.push({ record: i, opacity: s <= A ? 1 : 1 - (s - A) / p, until: A + p });
  }
  return h.sort((i, g) => (B(g.record.updatedAt) ?? 0) - (B(i.record.updatedAt) ?? 0)), h.slice(0, c);
}
function jt() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const gt = 400, Ot = 250, zt = 5, ot = 240, Ht = 600, st = 40, rt = 30, V = (e, s) => Math.max(0, Math.min(e.x + e.w, s.x + s.w) - Math.max(e.x, s.x)) * Math.max(0, Math.min(e.y + e.h, s.y + s.h) - Math.max(e.y, s.y));
function Wt(e, s, m, p, c, h = [], i) {
  const g = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let T = g[0], E = 1 / 0;
  for (const A of g) {
    const D = yt(e, s, m, A, p, c, h, i);
    if (D <= 1e-9) return A;
    D < E && (T = A, E = D);
  }
  return T;
}
function it(e, s, m, p) {
  const c = p.right ? st : -(st + s.w), h = p.down ? rt : -(rt + s.h);
  return { x: e.x + c / m, y: e.y + h / m, w: s.w / m, h: s.h / m };
}
function Zt(e, s, m, p, c) {
  const h = it(e, s, m, p);
  if (!c || e.x < c.x || e.x > c.x + c.w || e.y < c.y || e.y > c.y + c.h) return h;
  const i = 4 / m;
  return h.w <= c.w - 2 * i && (h.x = Math.min(Math.max(h.x, c.x + i), c.x + c.w - i - h.w)), h.h <= c.h - 2 * i && (h.y = Math.min(Math.max(h.y, c.y + i), c.y + c.h - i - h.h)), h;
}
function Tt(e, s) {
  const m = W(P(e.label), 48), p = It(e), c = p ? W(p, 40) : "", h = Math.max(96, Math.min(ot, 16 + Math.max(7 * m.length, 6.3 * c.length))), i = c ? 38 : 22, g = s ? (e.plan?.steps ?? []).length : 0;
  return { width: h, height: i, w: Math.max(h, g ? ot : 0), h: i + (g ? 18 + g * 18 : 0) };
}
function qt(e, s, m, p, c = [], h) {
  const i = Math.min(8, e.w / 4, e.h / 4), g = [
    { x: e.x + e.w - i, y: e.y + e.h - i, side: { right: !0, down: !0 } },
    { x: e.x + i, y: e.y + e.h - i, side: { right: !1, down: !0 } },
    { x: e.x + e.w - i, y: e.y + i, side: { right: !0, down: !1 } },
    { x: e.x + i, y: e.y + i, side: { right: !1, down: !1 } }
  ];
  let T = g[0], E = 1 / 0;
  for (const A of g) {
    const D = yt(A, s, m, A.side, p, [e], c, h);
    if (D <= 1e-9) return A;
    D < E && (T = A, E = D);
  }
  return T;
}
function yt(e, s, m, p, c, h, i, g) {
  const T = it(e, s, m, p), E = c ? (T.w * T.h - V(T, c)) * 0.5 : 0;
  return Vt(Zt(e, s, m, p, c), c, h, i, g) + E;
}
function Vt(e, s, m, p, c) {
  const h = s ? e.w * e.h - V(e, s) : 0, i = (g) => g.reduce((T, E) => T + V(e, E), 0);
  return c?.length ? h * 10 + i(c) * 4 + i(m) + i(p) * 0.05 : h * 10 + i(m) * 3 + i(p);
}
function $t(e, s = {}) {
  const m = s.now ?? (() => Date.now()), p = s.reducedMotion ?? jt, c = s.holdMs ?? kt, h = s.fadeMs ?? Nt, i = s.maxAgents ?? Lt, g = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Set();
  let E = [], A = null, D = null, $ = null, j = !1, at = 0;
  const Et = () => (A && A.node?.isConnected !== !1 && A.node?.parentNode || (A = e.canvas.group(), A.attr({ "data-agent-presence": "", "pointer-events": "none" })), A);
  function pt() {
    try {
      const t = e.canvas.viewbox(), n = e.canvas.node?.getBoundingClientRect?.();
      if (!t?.width || !t?.height || !n?.width || !n?.height) return null;
      const o = String(e.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), u = n.width / t.width, a = n.height / t.height, l = o === "none" ? u : /slice/.test(o) ? Math.max(u, a) : Math.min(u, a), x = n.width / l, w = n.height / l, y = { x: t.x + (t.width - x) / 2, y: t.y + (t.height - w) / 2, w: x, h: w };
      let r = n.left, d = n.top, k = n.right, f = n.bottom;
      for (let N = e.canvas.node?.parentElement; N && N !== document.body; N = N.parentElement) {
        const v = getComputedStyle(N);
        if (v.overflow === "visible" && v.overflowX === "visible" && v.overflowY === "visible") continue;
        const _ = N.getBoundingClientRect();
        !_.width || !_.height || (r = Math.max(r, _.left), d = Math.max(d, _.top), k = Math.min(k, _.right), f = Math.min(f, _.bottom));
      }
      const L = s.insets?.() || {};
      return r += Math.max(0, L.left ?? 0), k -= Math.max(0, L.right ?? 0), d += Math.max(0, L.top ?? 0), f -= Math.max(0, L.bottom ?? 0), k - r < 1 || f - d < 1 ? { view: y, scale: l } : { view: { x: y.x + (r - n.left) / l, y: y.y + (d - n.top) / l, w: (k - r) / l, h: (f - d) / l }, scale: l };
    } catch {
      return null;
    }
  }
  function U() {
    const t = pt();
    if (t) return t.scale;
    try {
      const n = e.getZoom?.();
      if (typeof n == "number" && n > 0) return n;
    } catch {
    }
    return 1;
  }
  const _t = () => {
    try {
      return e.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function Dt(t) {
    const o = (e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((u) => u?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  function xt(t) {
    const n = t?.options;
    return !n || ![n.x, n.y, n.width, n.height].every((o) => typeof o == "number" && Number.isFinite(o)) ? null : { x: n.x, y: n.y, w: n.width, h: n.height };
  }
  const Ft = (t) => e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((n) => n?.options?.name === t), J = () => (e.nodes?.allNodes ?? []).map(xt).filter((t) => !!t), Kt = (t, n) => t.x === n.x && t.y === n.y && t.w === n.w && t.h === n.h;
  function mt(t) {
    try {
      const n = e.canvas?.node, o = n?.getScreenCTM?.()?.inverse?.();
      if (!n || !o) return [];
      const u = t ? A?.node?.querySelector?.(`[data-agent="${CSS.escape(t)}"]`) : null, a = [];
      for (const l of n.querySelectorAll("text")) {
        if (u?.contains(l) || !l.textContent?.trim()) continue;
        const x = l.getBoundingClientRect();
        if (x.width < 1 || x.height < 1) continue;
        const w = new DOMPoint(x.left, x.top).matrixTransform(o), y = new DOMPoint(x.right, x.bottom).matrixTransform(o);
        a.push({ x: Math.min(w.x, y.x), y: Math.min(w.y, y.y), w: Math.abs(y.x - w.x), h: Math.abs(y.y - w.y) });
      }
      return a;
    } catch {
      return [];
    }
  }
  function ct() {
    return J().map((t) => [t.x, t.y, t.w, t.h].map(Math.round).join(",")).join(";");
  }
  function lt() {
    const t = Q(), n = U();
    return t ? [t.x, t.y, t.w, t.h].map((o) => Math.round(o * n / 8)).join(":") : "";
  }
  function Q() {
    const t = pt();
    if (t) return t.view;
    try {
      const n = e.canvas.viewbox();
      if (n && [n.x, n.y, n.width, n.height].every((o) => Number.isFinite(o)) && n.width > 0 && n.height > 0)
        return { x: n.x, y: n.y, w: n.width, h: n.height };
    } catch {
    }
    return null;
  }
  function Rt(t, n = { w: ot, h: 38 }, o = 1, u = []) {
    const a = Q();
    if (a) {
      const w = 8 / o, y = 16 / o, r = t * 64 / o, d = [
        { x: a.x + w, y: a.y + w + r, side: { right: !0, down: !0 } },
        { x: a.x + a.w - w - y, y: a.y + w + r, side: { right: !1, down: !0 } },
        { x: a.x + w, y: a.y + a.h - w - y - r, side: { right: !0, down: !1 } },
        { x: a.x + a.w - w - y, y: a.y + a.h - w - y - r, side: { right: !1, down: !1 } }
      ], k = J();
      let f = d[0], L = 1 / 0;
      for (const N of d) {
        const v = yt(N, n, o, N.side, a, [], k, u);
        if (v <= 1e-9) return N;
        v < L && (f = N, L = v);
      }
      return f;
    }
    let l = 1 / 0, x = 1 / 0;
    for (const w of e.nodes?.allNodes ?? []) {
      const y = w?.options;
      typeof y?.x == "number" && typeof y?.y == "number" && (l = Math.min(l, y.x), x = Math.min(x, y.y));
    }
    return Number.isFinite(l) || (l = 100, x = 100), { x: l - 40, y: x - 40 + t * 64, side: null };
  }
  function Ct(t, n, o) {
    const { record: u } = t, a = et[(u.colorIndex % et.length + et.length) % et.length], l = It(u), x = vt(u), w = x.length > 0 && (t.open || !o), y = W(P(u.label), 48);
    t.body?.remove();
    const r = t.group.group();
    t.body = r, r.path("M0 0 L14 5 L7 7 L5 14 Z").fill(a).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const d = r.group().attr("data-agent-avatar", ""), k = 11, f = 24, L = 24, N = Array.from({ length: 6 }, (b, K) => {
      const R = Math.PI / 6 + K * Math.PI / 3;
      return (f + k * Math.cos(R)).toFixed(2) + "," + (L + k * Math.sin(R)).toFixed(2);
    }).join(" ");
    d.polygon(N).fill(a).stroke({ color: "#fff", width: 1.5 }), d.text((b) => b.plain(W(P(u.initial).toUpperCase(), 1) || "?")).font({ size: 11, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: f, y: L + 4 }), d.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: a, width: 0.8 });
    const v = r.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: x.length ? "pointer" : "default",
      role: "button",
      tabindex: x.length ? 0 : -1,
      "aria-expanded": String(w),
      "aria-label": y + (l ? ": " + l : "")
    }), _ = l ? W(l, 40) : "", S = Tt(u, w), { width: C, height: O } = S, F = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, M = Q(), ht = M && F.x >= M.x && F.x <= M.x + M.w && F.y >= M.y && F.y <= M.y + M.h;
    let I = t.routedSide ?? Wt(F, S, n, M, [], J(), mt(u.agentKey));
    M && !ht && (I = [I, { right: !I.right, down: I.down }, { right: I.right, down: !I.down }, { right: !I.right, down: !I.down }].reduce((K, R) => V(it(F, S, n, R), M) < V(it(F, S, n, K), M) ? R : K));
    let X = I.right ? st : -(st + S.w), Y = I.down ? rt : -(rt + S.h);
    if (M && ht) {
      const K = F, R = (M.x - K.x) * n + 4, q = (M.x + M.w - K.x) * n - 4, G = (M.y - K.y) * n + 4, dt = (M.y + M.h - K.y) * n - 4;
      S.w <= q - R && (X = Math.min(Math.max(X, R), q - S.w)), S.h <= dt - G && (Y = Math.min(Math.max(Y, G), dt - S.h));
    }
    t.side = I;
    let z = I.right, H = I.down;
    if (M && ht) {
      const b = 42 / n;
      z && F.x + b > M.x + M.w ? z = !1 : !z && F.x - b < M.x && (z = !0), H && F.y + b > M.y + M.h ? H = !1 : !H && F.y - b < M.y && (H = !0);
    }
    (!z || !H) && d.attr("transform", `translate(${z ? 0 : -2 * f} ${H ? 0 : -2 * L})`), v.attr("data-agent-side", (I.right ? "right" : "left") + "-" + (I.down ? "down" : "up")), v.rect(C, O).radius(7).move(X, Y).fill("#fff").stroke({ color: a, width: 1.5 }), v.text((b) => b.plain(y)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(a).attr({ x: X + 8, y: Y + 15 }), _ && v.text((b) => b.plain(_)).font({ size: 11, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: X + 8, y: Y + 31 });
    const At = (b) => {
      b.stopPropagation?.(), bt.expand(u.agentKey);
    };
    if (v.on("pointerdown", (b) => b.stopPropagation?.()), v.on("click", At), v.on("keydown", (b) => {
      (b.key === "Enter" || b.key === " ") && (b.preventDefault?.(), At(b));
    }), w) {
      const b = r.group().attr("data-agent-plan", ""), K = x.length;
      b.rect(ot, 12 + K * 18).radius(8).move(X, Y + O + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), x.forEach((R, q) => {
        const G = u.plan.steps[q].status;
        b.text((Gt) => Gt.plain(W(R, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: G === "doing" ? 600 : 400 }).fill(G === "done" || G === "skipped" ? "#6b7280" : "#111827").attr({ x: X + 10, y: Y + O + 6 + 20 + q * 18 }).attr("data-step-status", G);
      });
    }
    r.element("title").words(y + (l ? " — " + l : "")), t.compact = o, t.lines = x, t.step = l, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity), at = n;
  }
  function wt(t, n) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), t.group.attr("opacity", t.opacity);
  }
  function ft(t, n, o, u) {
    const a = Q(), l = J(), x = mt(t.agentKey), y = t.targets.map((d) => xt(Ft(d))).filter((d) => !!d).slice(0, zt).map((d) => qt(d, o, u, a, l.filter((k) => !Kt(k, d)), x));
    if (!y.length) {
      const d = Rt(n, o, u, x);
      return { legs: [{ x: d.x, y: d.y, ms: gt }], side: d.side };
    }
    const r = y.length === 1 ? gt : Ot;
    return { legs: y.map((d) => ({ x: d.x, y: d.y, ms: r })), side: y[y.length - 1].side };
  }
  const ut = (t) => t.targets.some((n) => Dt(n) !== null), Bt = (t) => 1 - Math.pow(1 - t, 3);
  function Mt(t) {
    let n = !1;
    for (const o of g.values())
      for (; o.path.length; ) {
        const u = o.path[0];
        if (p() || u.ms <= 0) {
          o.x = u.x, o.y = u.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const a = Math.min(1, (t - o.leg.startedAt) / u.ms), l = Bt(a);
        if (o.x = o.leg.fromX + (u.x - o.leg.fromX) * l, o.y = o.leg.fromY + (u.y - o.leg.fromY) * l, a < 1) {
          n = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return n;
  }
  function Z() {
    if (j) return;
    const t = m(), n = St(E, t, { holdMs: c, fadeMs: h, max: i }), o = new Set(n.map((r) => r.record.agentKey));
    for (const [r, d] of g) o.has(r) || (d.group.remove(), g.delete(r));
    if (!n.length) {
      tt(null);
      return;
    }
    const u = Et();
    u.front?.();
    const a = U(), l = n.length >= 2 || _t() < Ht;
    n.forEach(({ record: r, opacity: d }, k) => {
      let f = g.get(r.agentKey);
      const L = r.targets.join("\0"), N = T.has(r.agentKey), v = Tt(r, vt(r).length > 0 && (N || !l)), _ = [v.w, v.h, a.toFixed(4), lt(), ct()].join(",");
      if (f) {
        if (f.targetsKey !== L || !f.found && ut(r)) {
          const S = ft(r, k, v, a);
          f.path = S.legs, f.leg = null, f.found = ut(r), f.routedSide = S.side, f.routedFor = _;
        } else if (f.routedFor !== _ && f.found) {
          const S = ft(r, k, v, a), C = S.legs[S.legs.length - 1], O = f.path.length ? f.path[f.path.length - 1] : { x: f.x, y: f.y };
          (C.x !== O.x || C.y !== O.y) && (f.path = [{ ...C, ms: gt }], f.leg = null), f.routedSide = S.side, f.routedFor = _;
        }
      } else {
        const S = ft(r, k, v, a), C = S.legs[0];
        f = {
          key: r.agentKey,
          group: u.group().attr({ "data-agent": r.agentKey }),
          body: null,
          record: r,
          targetsKey: L,
          found: ut(r),
          x: C.x,
          y: C.y,
          path: S.legs.slice(1),
          leg: null,
          open: N,
          opacity: d,
          compact: l,
          lines: [],
          step: null,
          routedSide: S.side,
          routedFor: _
        }, g.set(r.agentKey, f);
      }
      f.targetsKey = L, f.record = r, f.opacity = Math.max(0, Math.min(1, d)), f.open = T.has(r.agentKey), Ct(f, a, l);
    });
    const x = Mt(t);
    for (const r of g.values()) wt(r, a);
    const w = n.some((r) => r.opacity < 1), y = Math.min(...n.map((r) => r.record.status === "live" && B(r.record.endedAt) === null ? r.until : (B(r.record.endedAt) ?? B(r.record.updatedAt) ?? t) + c));
    tt(x || w ? "frame" : Math.max(16, y - t));
  }
  function Xt() {
    if (D = null, j) return;
    const t = m(), n = Mt(t), o = U(), u = St(E, t, { holdMs: c, fadeMs: h, max: i });
    if (u.some((l) => l.opacity < 1) || g.size !== u.length || Math.abs(o - at) > 1e-6) {
      Z();
      return;
    }
    for (const l of g.values()) wt(l, o);
    n && tt("frame");
  }
  function tt(t) {
    D !== null && (cancelAnimationFrame(D), D = null), $ !== null && (clearTimeout($), $ = null), !(t === null || j) && (t === "frame" ? D = requestAnimationFrame(Xt) : $ = setTimeout(Z, Math.min(t, 6e4)));
  }
  let nt = null;
  const Yt = () => {
    if (nt !== null) return;
    let t = lt(), n = ct(), o = n;
    nt = setInterval(() => {
      if (j || !g.size) return;
      const u = lt(), a = ct(), l = a === n && a !== o;
      n = a, (Math.abs(U() - at) > 1e-6 || u !== t || l) && (t = u, o = a, Z());
    }, 250);
  }, bt = {
    set(t) {
      j || (E = Array.isArray(t) ? t.filter((n) => n && typeof n.agentKey == "string") : [], Z(), Yt());
    },
    expand(t, n) {
      const o = n ?? !T.has(t);
      o ? T.add(t) : T.delete(t), s.onToggle?.(t, o), Z();
    },
    shown() {
      return [...g.values()].map((t) => ({
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
      j = !0, tt(null), nt !== null && clearInterval(nt);
      for (const t of g.values()) t.group.remove();
      g.clear(), A?.remove(), A = null;
    }
  };
  return bt;
}
export {
  Nt as AGENT_FADE_MS,
  gt as AGENT_GLIDE_MS,
  kt as AGENT_HOLD_MS,
  Lt as AGENT_MAX_DRAWN,
  zt as AGENT_MAX_VISITS,
  et as AGENT_PALETTE,
  Ot as AGENT_VISIT_MS,
  qt as agentAnchor,
  vt as agentChecklist,
  It as agentStepText,
  it as agentTagBox,
  Zt as agentTagPlaced,
  Wt as agentTagSide,
  $t as createAgentPresence,
  St as visibleAgents
};
