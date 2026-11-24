const Ln = 3e3;
function yn(e) {
  return e.origin === "invited" && e.invitedBy ? "added by " + K(e.invitedBy) : e.origin === "visiting" && e.via ? "via " + K(e.via) : "";
}
function bt(e, s = 56) {
  const c = K(e.label), m = yn(e), l = e.origin === "visiting" && e.via && c.endsWith("· " + K(e.via));
  return q(m && !l && !c.includes(m) ? c + " · " + m : c, s);
}
function pn(e) {
  if (typeof e != "string" || e.length > 2e5) return null;
  if (/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(e)) return e;
  try {
    const s = new URL(e);
    return s.protocol === "https:" ? s.href : null;
  } catch {
    return null;
  }
}
function Ct(e, s) {
  const c = K(e.say ?? ""), m = Y(e.sayAt ?? null);
  return !c || m === null || s < m || s >= m + 3e3 ? null : c;
}
const it = Object.freeze(["#6d28d9", "#0f766e", "#a16207", "#be185d", "#1d4ed8", "#4d7c0f"]), jt = 6e3, zt = 600, Wt = 6, xn = { todo: "○", doing: "◌", done: "✓", skipped: "–", stopped: "■" };
function Y(e) {
  if (e == null) return null;
  const s = e instanceof Date ? e.getTime() : typeof e == "number" ? e : Date.parse(e);
  return Number.isFinite(s) ? s : null;
}
const q = (e, s) => e.length > s ? e.slice(0, s - 1).trimEnd() + "…" : e, K = (e) => String(e ?? "").replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, "").replace(/\s+/g, " ").trim(), Ht = (e) => (e.targets ?? []).some((s) => typeof s == "string" && s.startsWith("ghost-")), Dt = "Suggesting…", mn = "Waiting for you";
function wn(e, { landing: s = !1 } = {}) {
  const c = e.plan?.steps ?? [], m = c.findIndex((g) => g.status === "stopped");
  if (m >= 0) return "Stopped: " + K(c[m].text);
  if (s) return Dt;
  if (e.waiting) return mn;
  if (e.status === "live" && Y(e.endedAt ?? null) === null && Ht(e)) return Dt;
  if (c.length) {
    const g = c.findIndex((p) => p.status === "doing");
    if (c.every((p) => p.status === "done" || p.status === "skipped")) return "Done";
    const h = g >= 0 ? g : Math.min(Math.max(e.plan.current ?? 0, 0), c.length - 1);
    return K(c[h].text);
  }
  return K(e.message ?? "") || null;
}
function Ft(e) {
  return (e.plan?.steps ?? []).map((s) => xn[s.status] + " " + (s.status === "stopped" ? "Stopped: " : "") + K(s.text));
}
function Yt(e, s, { holdMs: c = jt, fadeMs: m = zt, max: l = Wt } = {}) {
  const g = [];
  for (const h of e) {
    if (!h || typeof h.agentKey != "string") continue;
    const p = Y(h.expiresAt), S = Y(h.endedAt);
    if (h.status === "live" && S === null) {
      if (p === null || s >= p) continue;
      g.push({ record: h, opacity: 1, until: p });
      continue;
    }
    const v = (S ?? Y(h.updatedAt) ?? s) + c;
    s >= v + m || g.push({ record: h, opacity: s <= v ? 1 : 1 - (s - v) / m, until: v + m });
  }
  return g.sort((h, p) => (Y(p.record.updatedAt) ?? 0) - (Y(h.record.updatedAt) ?? 0)), g.slice(0, l);
}
function bn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const at = 400, $t = 450, Mn = 5, ct = 240, An = 600, lt = 40, ft = 30, Mt = "[data-suggestion-tag], [data-suggestion-all]", vn = "text, " + Mt, Sn = 0.3, tt = (e, s) => Math.max(0, Math.min(e.x + e.w, s.x + s.w) - Math.max(e.x, s.x)) * Math.max(0, Math.min(e.y + e.h, s.y + s.h) - Math.max(e.y, s.y));
function Kt(e) {
  const s = e?.options;
  return !s || ![s.x, s.y, s.width, s.height].every((c) => typeof c == "number" && Number.isFinite(c)) ? null : { x: s.x, y: s.y, w: s.width, h: s.height };
}
const Ot = (e) => it[((Number(e) || 0) % it.length + it.length) % it.length], kn = (e, s, c) => Array.from({ length: 6 }, (m, l) => {
  const g = Math.PI / 6 + l * Math.PI / 3;
  return (e + c * Math.cos(g)).toFixed(2) + "," + (s + c * Math.sin(g)).toFixed(2);
}).join(" ");
function qt(e) {
  try {
    const s = e.canvas.viewbox(), c = e.canvas.node?.getBoundingClientRect?.();
    if (!s?.width || !s?.height || !c?.width || !c?.height) return null;
    const m = String(e.canvas.node?.getAttribute?.("preserveAspectRatio") || "xMidYMid meet"), l = c.width / s.width, g = c.height / s.height;
    return { box: s, rect: c, scale: m === "none" ? l : /slice/.test(m) ? Math.max(l, g) : Math.min(l, g) };
  } catch {
    return null;
  }
}
function Tn(e) {
  const s = qt(e);
  if (s) return s.scale;
  try {
    const c = e.getZoom?.();
    if (typeof c == "number" && c > 0) return c;
  } catch {
  }
  return 1;
}
function Pt(e, s, c, m, l, g = [], h) {
  const p = [{ right: !0, down: !0 }, { right: !1, down: !0 }, { right: !0, down: !1 }, { right: !1, down: !1 }];
  let S = p[0], R = 1 / 0;
  for (const v of p) {
    const C = At(e, s, c, v, m, l, g, h);
    if (C <= 1e-9) return v;
    C < R && (S = v, R = C);
  }
  return S;
}
function ut(e, s, c, m) {
  const l = m.right ? lt : -(lt + s.w), g = m.down ? ft : -(ft + s.h);
  return { x: e.x + l / c, y: e.y + g / c, w: s.w / c, h: s.h / c };
}
function Nn(e, s, c, m, l) {
  const g = ut(e, s, c, m);
  if (!l || e.x < l.x || e.x > l.x + l.w || e.y < l.y || e.y > l.y + l.h) return g;
  const h = 4 / c;
  return g.w <= l.w - 2 * h && (g.x = Math.min(Math.max(g.x, l.x + h), l.x + l.w - h - g.w)), g.h <= l.h - 2 * h && (g.y = Math.min(Math.max(g.y, l.y + h), l.y + l.h - h - g.h)), g;
}
function Xt(e, s, c) {
  const m = bt(e), l = c ? q(c, 40) : "", g = Math.max(96, Math.min(ct, 16 + Math.max(7 * m.length, 6.8 * l.length))), h = l ? 40 : 22, p = s ? (e.plan?.steps ?? []).length : 0;
  return { width: g, height: h, w: Math.max(g, p ? ct : 0), h: h + (p ? 18 + p * 18 : 0) };
}
function En(e, s, c, m, l = [], g) {
  const h = Math.min(8, e.w / 4, e.h / 4), p = [
    { x: e.x + e.w - h, y: e.y + e.h - h, side: { right: !0, down: !0 } },
    { x: e.x + h, y: e.y + e.h - h, side: { right: !1, down: !0 } },
    { x: e.x + e.w - h, y: e.y + h, side: { right: !0, down: !1 } },
    { x: e.x + h, y: e.y + h, side: { right: !1, down: !1 } }
  ];
  let S = p[0], R = 1 / 0;
  for (const v of p) {
    const C = At(v, s, c, v.side, m, [e], l, g);
    if (C <= 1e-9) return v;
    C < R && (S = v, R = C);
  }
  return S;
}
function At(e, s, c, m, l, g, h, p) {
  const S = ut(e, s, c, m), R = l ? (S.w * S.h - tt(S, l)) * 0.5 : 0;
  return _n(Nn(e, s, c, m, l), l, g, h, p) + R;
}
function _n(e, s, c, m, l) {
  const g = s ? e.w * e.h - tt(e, s) : 0, h = (p) => p.reduce((S, R) => S + tt(e, R), 0);
  return l?.length ? g * 10 + h(l) * 4 + h(c) + h(m) * 0.05 : g * 10 + h(c) * 3 + h(m);
}
function In(e, s = {}) {
  const c = s.now ?? (() => Date.now()), m = s.reducedMotion ?? bn, l = s.holdMs ?? jt, g = s.fadeMs ?? zt, h = s.maxAgents ?? Wt, p = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set();
  let R = [], v = null, C = null, nt = null, z = !1, ht = 0;
  const vt = () => (v && v.node?.isConnected !== !1 && v.node?.parentNode || (v = e.canvas.group(), v.attr({ "data-agent-presence": "", "data-export-never": "", "pointer-events": "none" })), v);
  function Zt() {
    try {
      const t = qt(e);
      if (!t) return null;
      const { box: n, rect: o, scale: r } = t, a = o.width / r, u = o.height / r, y = { x: n.x + (n.width - a) / 2, y: n.y + (n.height - u) / 2, w: a, h: u };
      let x = o.left, f = o.top, w = o.right, i = o.bottom;
      for (let M = e.canvas.node?.parentElement; M && M !== document.body; M = M.parentElement) {
        const d = getComputedStyle(M);
        if (d.overflow === "visible" && d.overflowX === "visible" && d.overflowY === "visible") continue;
        const k = M.getBoundingClientRect();
        !k.width || !k.height || (x = Math.max(x, k.left), f = Math.max(f, k.top), w = Math.min(w, k.right), i = Math.min(i, k.bottom));
      }
      const T = s.insets?.() || {};
      return x += Math.max(0, T.left ?? 0), w -= Math.max(0, T.right ?? 0), f += Math.max(0, T.top ?? 0), i -= Math.max(0, T.bottom ?? 0), w - x < 1 || i - f < 1 ? { view: y, scale: r } : { view: { x: y.x + (x - o.left) / r, y: y.y + (f - o.top) / r, w: (w - x) / r, h: (i - f) / r }, scale: r };
    } catch {
      return null;
    }
  }
  const et = () => Tn(e), Ut = () => {
    try {
      return e.canvas.node?.getBoundingClientRect?.().width || (typeof window < "u" ? window.innerWidth : 1024);
    } catch {
      return 1024;
    }
  };
  function Vt(t) {
    const o = (e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((r) => r?.options?.name === t))?.options;
    return !o || typeof o.x != "number" || typeof o.y != "number" ? null : { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 };
  }
  const Jt = (t) => e.nodes?.one?.(t) ?? e.nodes?.allNodes?.find?.((n) => n?.options?.name === t), ot = () => (e.nodes?.allNodes ?? []).map(Kt).filter((t) => !!t), Qt = (t, n) => t.x === n.x && t.y === n.y && t.w === n.w && t.h === n.h;
  function St(t) {
    try {
      const n = e.canvas?.node, o = n?.getScreenCTM?.()?.inverse?.();
      if (!n || !o) return [];
      const r = t ? v?.node?.querySelector?.(`[data-agent="${CSS.escape(t)}"]`) : null, a = [];
      for (const u of n.querySelectorAll(vn)) {
        if (r?.contains(u) || !u.textContent?.trim()) continue;
        const y = u.getBoundingClientRect();
        if (y.width < 1 || y.height < 1) continue;
        const x = new DOMPoint(y.left, y.top).matrixTransform(o), f = new DOMPoint(y.right, y.bottom).matrixTransform(o);
        a.push({ x: Math.min(x.x, f.x), y: Math.min(x.y, f.y), w: Math.abs(f.x - x.x), h: Math.abs(f.y - x.y) });
      }
      return a;
    } catch {
      return [];
    }
  }
  function dt() {
    return ot().map((t) => [t.x, t.y, t.w, t.h].map(Math.round).join(",")).join(";");
  }
  function gt() {
    try {
      return [...e.canvas?.node?.querySelectorAll?.(Mt) ?? []].map((t) => {
        const n = t.getBoundingClientRect();
        return [n.left, n.top, n.width, n.height].map((o) => Math.round(o / 8)).join(",");
      }).join(";");
    } catch {
      return "";
    }
  }
  function yt() {
    const t = V(), n = et();
    return t ? [t.x, t.y, t.w, t.h].map((o) => Math.round(o * n / 8)).join(":") : "";
  }
  function V() {
    const t = Zt();
    if (t) return t.view;
    try {
      const n = e.canvas.viewbox();
      if (n && [n.x, n.y, n.width, n.height].every((o) => Number.isFinite(o)) && n.width > 0 && n.height > 0)
        return { x: n.x, y: n.y, w: n.width, h: n.height };
    } catch {
    }
    return null;
  }
  function tn(t, n = { w: ct, h: 38 }, o = 1, r = []) {
    const a = V();
    if (a) {
      const x = 8 / o, f = 16 / o, w = t * 64 / o, i = [
        { x: a.x + x, y: a.y + x + w, side: { right: !0, down: !0 } },
        { x: a.x + a.w - x - f, y: a.y + x + w, side: { right: !1, down: !0 } },
        { x: a.x + x, y: a.y + a.h - x - f - w, side: { right: !0, down: !1 } },
        { x: a.x + a.w - x - f, y: a.y + a.h - x - f - w, side: { right: !1, down: !1 } }
      ], T = ot();
      let M = i[0], d = 1 / 0;
      for (const k of i) {
        const L = At(k, n, o, k.side, a, [], T, r);
        if (L <= 1e-9) return k;
        L < d && (M = k, d = L);
      }
      return M;
    }
    let u = 1 / 0, y = 1 / 0;
    for (const x of e.nodes?.allNodes ?? []) {
      const f = x?.options;
      typeof f?.x == "number" && typeof f?.y == "number" && (u = Math.min(u, f.x), y = Math.min(y, f.y));
    }
    return Number.isFinite(u) || (u = 100, y = 100), { x: u - 40, y: y - 40 + t * 64, side: null };
  }
  function nn(t, n, o) {
    const { record: r } = t, a = Ot(r.colorIndex), u = Tt(t, r), y = Ft(r), x = y.length > 0 && (t.open || !o), f = bt(r);
    t.body?.remove();
    const w = t.group.group();
    t.body = w, w.path("M0 0 L14 5 L7 7 L5 14 Z").fill(a).stroke({ color: "#fff", width: 1.5 }).attr("stroke-linejoin", "round");
    const i = w.group().attr("data-agent-avatar", ""), T = 11, M = 24, d = 24;
    i.polygon(kn(M, d, T)).fill(a).stroke({ color: "#fff", width: 1.5 });
    const k = pn(r.iconUrl);
    if (k) {
      const A = i.clip();
      A.add(i.circle(14).center(M, d)), i.image(k).size(14, 14).move(M - 7, d - 7).attr({ "data-agent-icon": "", preserveAspectRatio: "xMidYMid slice" }).clipWith(A);
    } else
      i.text((A) => A.plain(q(K(r.initial).toUpperCase(), 1) || "?")).font({ size: 12, weight: 700, family: "Roboto, Helvetica, Arial, sans-serif", anchor: "middle" }).fill("#fff").attr({ x: M, y: d + 4 });
    i.path("M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z").fill("#fde68a").stroke({ color: a, width: 0.8 });
    const L = w.group().attr({
      "data-agent-tag": "",
      "pointer-events": "all",
      cursor: y.length ? "pointer" : "default",
      role: "button",
      tabindex: y.length ? 0 : -1,
      "aria-expanded": String(x),
      "aria-label": f + (u ? ": " + u : "")
    }), O = u ? q(u, 40) : "", E = Xt(r, x, u), { width: N, height: D } = E, _ = t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, b = V(), wt = b && _.x >= b.x && _.x <= b.x + b.w && _.y >= b.y && _.y <= b.y + b.h;
    let I = t.routedSide ?? Pt(_, E, n, b, [], ot(), St(r.agentKey));
    b && !wt && (I = [I, { right: !I.right, down: I.down }, { right: I.right, down: !I.down }, { right: !I.right, down: !I.down }].reduce((F, B) => tt(ut(_, E, n, B), b) < tt(ut(_, E, n, F), b) ? B : F));
    let W = I.right ? lt : -(lt + E.w), H = I.down ? ft : -(ft + E.h);
    if (b && wt) {
      const F = _, B = (b.x - F.x) * n + 4, $ = (b.x + b.w - F.x) * n - 4, G = (b.y - F.y) * n + 4, j = (b.y + b.h - F.y) * n - 4;
      E.w <= $ - B && (W = Math.min(Math.max(W, B), $ - E.w)), E.h <= j - G && (H = Math.min(Math.max(H, G), j - E.h));
    }
    t.side = I;
    let X = I.right, Z = I.down;
    if (b && wt) {
      const A = 42 / n;
      X && _.x + A > b.x + b.w ? X = !1 : !X && _.x - A < b.x && (X = !0), Z && _.y + A > b.y + b.h ? Z = !1 : !Z && _.y - A < b.y && (Z = !0);
    }
    (!X || !Z) && i.attr("transform", `translate(${X ? 0 : -2 * M} ${Z ? 0 : -2 * d})`), L.attr("data-agent-side", (I.right ? "right" : "left") + "-" + (I.down ? "down" : "up")), L.rect(N, D).radius(7).move(W, H).fill("#fff").stroke({ color: a, width: 1.5 }), L.text((A) => A.plain(f)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(a).attr({ x: W + 8, y: H + 15 }), O && L.text((A) => A.plain(O)).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#374151").attr({ x: W + 8, y: H + 32 });
    const Bt = (A) => {
      A.stopPropagation?.(), Rt.expand(r.agentKey);
    };
    if (L.on("pointerdown", (A) => A.stopPropagation?.()), L.on("click", Bt), L.on("keydown", (A) => {
      (A.key === "Enter" || A.key === " ") && (A.preventDefault?.(), Bt(A));
    }), x) {
      const A = w.group().attr("data-agent-plan", ""), F = y.length;
      A.rect(ct, 12 + F * 18).radius(8).move(W, H + D + 6).fill("#ffffff").stroke({ color: "#d1d5db", width: 1 }).attr("fill-opacity", 0.97), y.forEach((B, $) => {
        const G = r.plan.steps[$].status;
        A.text((U) => U.plain(q(B, 38))).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif", weight: G === "doing" ? 600 : 400 }).fill(G === "done" || G === "skipped" ? "#6b7280" : "#111827").attr({ x: W + 10, y: H + D + 6 + 20 + $ * 18 }).attr("data-step-status", G);
      });
    }
    const Gt = Ct(r, c());
    if (Gt) {
      const A = q(Gt, 60), F = Math.max(48, Math.min(260, 16 + 6.6 * A.length)), B = 24, $ = X ? 8 : -8 - F, G = I.down ? -B - 14 : 46, j = w.group().attr({ "data-agent-say": "", role: "status", "aria-label": f + " says: " + A });
      j.rect(F, B).radius(12).move($, G).fill("#ffffff").stroke({ color: a, width: 1.5 });
      const U = X ? $ + 14 : $ + F - 14;
      I.down && (j.path(`M${U - 5} ${G + B - 0.5} L${U} ${G + B + 7} L${U + 5} ${G + B - 0.5} Z`).fill("#ffffff").stroke({ color: a, width: 1.5 }), j.rect(12, 3).move(U - 6, G + B - 2).fill("#ffffff")), j.text((gn) => gn.plain(A)).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill("#111827").attr({ x: $ + 8, y: G + 16 });
    }
    w.element("title").words(f + (u ? " — " + u : "")), t.compact = o, t.lines = y, t.step = u, t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), pt(t), ht = n;
  }
  function kt(t, n) {
    t.group.transform({ translateX: t.x, translateY: t.y, scale: 1 / n, originX: 0, originY: 0 }), pt(t);
  }
  function Tt(t, n) {
    const o = Ht(n) && (!t || t.path.length > 0 || !t.found);
    return wn(n, { landing: o });
  }
  function Nt() {
    try {
      const t = [];
      for (const n of e.canvas?.node?.querySelectorAll?.(Mt) ?? []) {
        const o = n.getBoundingClientRect();
        o.width >= 1 && o.height >= 1 && n.style?.display !== "none" && t.push(o);
      }
      return t;
    } catch {
      return [];
    }
  }
  const en = (t, n) => t.left < n.right && n.left < t.right && t.top < n.bottom && n.top < t.bottom;
  function pt(t, n = Nt()) {
    let o = !1;
    if (n.length && t.opacity > 0)
      for (const x of t.body?.node?.querySelectorAll?.("[data-agent-tag], [data-agent-plan], [data-agent-say]") ?? []) {
        const f = x.getBoundingClientRect();
        if (f.width && n.some((w) => en(f, w))) {
          o = !0;
          break;
        }
      }
    const r = String(o ? Math.min(t.opacity, Sn) : t.opacity), a = t.group.node;
    a.getAttribute("opacity") !== r && a.setAttribute("opacity", r);
    const u = t.body?.node?.querySelector?.("[data-agent-tag]"), y = o ? "none" : "all";
    u && u.getAttribute("pointer-events") !== y && u.setAttribute("pointer-events", y), o ? a.setAttribute("data-agent-dimmed", "") : a.hasAttribute("data-agent-dimmed") && a.removeAttribute("data-agent-dimmed");
  }
  function on() {
    if (z || !p.size) return;
    const t = Nt();
    for (const n of p.values()) pt(n, t);
  }
  let J = null;
  const sn = () => {
    const t = e.canvas?.node;
    J || !t || typeof MutationObserver != "function" || (J = new MutationObserver((n) => {
      const o = v?.node;
      n.some((r) => !o || !o.contains(r.target)) && on();
    }), J.observe(t, { subtree: !0, childList: !0, attributes: !0, attributeFilter: ["transform", "viewBox", "x", "y", "width", "height", "style", "display", "visibility"] }));
  }, Et = () => {
    J?.disconnect(), J = null;
  };
  function xt(t, n, o, r) {
    const a = V(), u = ot(), y = St(t.agentKey), f = t.targets.map((M) => Kt(Jt(M))).filter((M) => !!M).slice(0, Mn).map((M) => En(M, o, r, a, u.filter((d) => !Qt(d, M)), y)), w = _t(t);
    if (!f.length) {
      if (w) return { legs: [{ x: w.x, y: w.y, ms: at }], side: Pt(w, o, r, a, [], u, y) };
      const M = tn(n, o, r, y);
      return { legs: [{ x: M.x, y: M.y, ms: at }], side: M.side };
    }
    const i = f.length === 1 && !w ? at : $t, T = f.map((M) => ({ x: M.x, y: M.y, ms: i }));
    return w && T.unshift({ x: w.x, y: w.y, ms: $t }), { legs: T, side: f[f.length - 1].side };
  }
  const mt = (t) => t.targets.some((n) => Vt(n) !== null), _t = (t) => {
    const n = t.point;
    return n && Number.isFinite(n.x) && Number.isFinite(n.y) ? { x: Number(n.x), y: Number(n.y) } : null;
  }, rn = (t) => {
    const n = _t(t);
    return t.targets.join("\0") + (n ? "@" + n.x + "," + n.y : "");
  }, an = (t) => 1 - Math.pow(1 - t, 3);
  function Lt(t) {
    let n = !1;
    for (const o of p.values())
      for (; o.path.length; ) {
        const r = o.path[0];
        if (m() || r.ms <= 0) {
          o.x = r.x, o.y = r.y, o.path.shift(), o.leg = null;
          continue;
        }
        o.leg || (o.leg = { fromX: o.x, fromY: o.y, startedAt: t });
        const a = Math.min(1, (t - o.leg.startedAt) / r.ms), u = an(a);
        if (o.x = o.leg.fromX + (r.x - o.leg.fromX) * u, o.y = o.leg.fromY + (r.y - o.leg.fromY) * u, a < 1) {
          n = !0;
          break;
        }
        o.path.shift(), o.leg = o.path.length ? { fromX: o.x, fromY: o.y, startedAt: t } : null;
      }
    return n;
  }
  const P = /* @__PURE__ */ new Map(), It = (t) => t.path.length ? t.path[t.path.length - 1] : { x: t.x, y: t.y }, cn = (t, n) => !!n && !(t.x >= n.x && t.x <= n.x + n.w && t.y >= n.y && t.y <= n.y + n.h);
  function ln(t, n) {
    const o = t.x < n.x ? -1 : t.x > n.x + n.w ? 1 : 0, r = t.y < n.y ? -1 : t.y > n.y + n.h ? 1 : 0;
    return { "-1,-1": "↖", "0,-1": "↑", "1,-1": "↗", "-1,0": "←", "1,0": "→", "-1,1": "↙", "0,1": "↓", "1,1": "↘" }[`${o},${r}`] || "→";
  }
  function fn(t, n) {
    if (s.goTo) return s.goTo(t, n);
    try {
      e.camera?.flyTo?.({ state: { cx: t.x, cy: t.y } }, { reduced: m() })?.catch?.(() => {
      });
    } catch {
    }
  }
  function un(t) {
    const n = V(), o = /* @__PURE__ */ new Set();
    for (const r of p.values()) {
      const a = It(r);
      if (!n || r.opacity <= 0 || !cn(a, n)) continue;
      o.add(r.key);
      const u = q(bt(r.record), 32), y = ln(a, n), x = `${u} is working`;
      let f = P.get(r.key);
      if (!f || f.words !== x || f.arrow !== y) {
        f?.group.remove();
        const L = Ot(r.record.colorIndex), E = y === "←" || y === "↖" || y === "↙" ? `${y} ${x}` : `${x} ${y}`, N = vt().group().attr({
          "data-agent-edge": r.key,
          "pointer-events": "all",
          cursor: "pointer",
          role: "button",
          tabindex: 0,
          "aria-label": `${x} out of view. Show where.`
        }), D = Math.round(20 + 7 * E.length);
        N.rect(D, 26).radius(13).fill("#ffffff").stroke({ color: L, width: 1.5 }).attr("fill-opacity", 0.97), N.text((b) => b.plain(E)).font({ size: 12, weight: 600, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(L).attr({ x: 10, y: 17 });
        const _ = (b) => {
          b.stopPropagation?.(), fn(It(p.get(r.key) ?? r), r.key);
        };
        N.on("pointerdown", (b) => b.stopPropagation?.()), N.on("click", _), N.on("keydown", (b) => {
          (b.key === "Enter" || b.key === " ") && (b.preventDefault?.(), _(b));
        }), f = { group: N, words: x, arrow: y }, f.width = D, P.set(r.key, f);
      }
      const w = 12 / t, i = f.width / t, T = 26 / t, M = [...o].indexOf(r.key) * (32 / t), d = Math.min(Math.max(a.x - i / 2, n.x + w), n.x + n.w - i - w), k = Math.min(Math.max(a.y - T / 2 + M, n.y + w), n.y + n.h - T - w);
      f.group.transform({ translateX: d, translateY: k, scale: 1 / t, originX: 0, originY: 0 });
    }
    for (const [r, a] of P) o.has(r) || (a.group.remove(), P.delete(r));
  }
  function Q() {
    if (z) return;
    const t = c(), n = Yt(R, t, { holdMs: l, fadeMs: g, max: h }), o = new Set(n.map((i) => i.record.agentKey));
    for (const [i, T] of p) o.has(i) || (T.group.remove(), p.delete(i));
    if (!n.length) {
      for (const i of P.values()) i.group.remove();
      P.clear(), Et(), st(null);
      return;
    }
    sn();
    const r = vt();
    r.front?.();
    const a = et(), u = n.length >= 2 || Ut() < An;
    n.forEach(({ record: i, opacity: T }, M) => {
      let d = p.get(i.agentKey);
      const k = rn(i), L = S.has(i.agentKey), O = Xt(i, Ft(i).length > 0 && (L || !u), Tt(d, i)), E = [O.w, O.h, a.toFixed(4), yt(), dt(), gt()].join(",");
      if (d) {
        if (d.targetsKey !== k || !d.found && mt(i)) {
          const N = xt(i, M, O, a);
          d.path = N.legs, d.leg = null, d.found = mt(i), d.routedSide = N.side, d.routedFor = E;
        } else if (d.routedFor !== E && d.found) {
          const N = xt(i, M, O, a), D = N.legs[N.legs.length - 1], _ = d.path.length ? d.path[d.path.length - 1] : { x: d.x, y: d.y };
          (D.x !== _.x || D.y !== _.y) && (d.path = [{ ...D, ms: at }], d.leg = null), d.routedSide = N.side, d.routedFor = E;
        }
      } else {
        const N = xt(i, M, O, a), D = N.legs[0];
        d = {
          key: i.agentKey,
          group: r.group().attr({ "data-agent": i.agentKey }),
          body: null,
          record: i,
          targetsKey: k,
          found: mt(i),
          x: D.x,
          y: D.y,
          path: N.legs.slice(1),
          leg: null,
          open: L,
          opacity: T,
          compact: u,
          lines: [],
          step: null,
          routedSide: N.side,
          routedFor: E
        }, p.set(i.agentKey, d);
      }
      d.targetsKey = k, d.record = i, d.opacity = Math.max(0, Math.min(1, T)), d.open = S.has(i.agentKey), nn(d, a, u);
    });
    const y = Lt(t);
    for (const i of p.values()) kt(i, a);
    un(a);
    const x = n.some((i) => i.opacity < 1), f = n.map((i) => Ct(i.record, t) ? (Y(i.record.sayAt ?? null) ?? t) + 3e3 : 1 / 0), w = Math.min(...f, ...n.map((i) => i.record.status === "live" && Y(i.record.endedAt) === null ? i.until : (Y(i.record.endedAt) ?? Y(i.record.updatedAt) ?? t) + l));
    st(y || x ? "frame" : Math.max(16, w - t));
  }
  function hn() {
    if (C = null, z) return;
    const t = c(), n = Lt(t), o = et(), r = Yt(R, t, { holdMs: l, fadeMs: g, max: h });
    if (r.some((u) => u.opacity < 1) || p.size !== r.length || !n || Math.abs(o - ht) > 1e-6) {
      Q();
      return;
    }
    for (const u of p.values()) kt(u, o);
    st("frame");
  }
  function st(t) {
    C !== null && (cancelAnimationFrame(C), C = null), nt !== null && (clearTimeout(nt), nt = null), !(t === null || z) && (t === "frame" ? C = requestAnimationFrame(hn) : nt = setTimeout(Q, Math.min(t, 6e4)));
  }
  let rt = null;
  const dn = () => {
    if (rt !== null) return;
    let t = yt(), n = dt(), o = n, r = gt();
    rt = setInterval(() => {
      if (z || !p.size) return;
      const a = yt(), u = dt(), y = gt(), x = u === n && u !== o;
      n = u, (Math.abs(et() - ht) > 1e-6 || a !== t || x || y !== r) && (t = a, o = u, r = y, Q());
    }, 250);
  }, Rt = {
    set(t) {
      z || (R = Array.isArray(t) ? t.filter((n) => n && typeof n.agentKey == "string") : [], Q(), dn());
    },
    expand(t, n) {
      const o = n ?? !S.has(t);
      o ? S.add(t) : S.delete(t), s.onToggle?.(t, o), Q();
    },
    shown() {
      return [...p.values()].map((t) => ({
        agentKey: t.key,
        label: t.record.label,
        step: t.step,
        x: t.x,
        y: t.y,
        opacity: t.opacity,
        compact: t.compact,
        lines: t.lines,
        side: t.side ?? { right: !0, down: !0 },
        offscreen: P.has(t.key)
      }));
    },
    destroy() {
      z = !0, st(null), Et(), rt !== null && clearInterval(rt);
      for (const t of p.values()) t.group.remove();
      p.clear(), P.clear(), v?.remove(), v = null;
    }
  };
  return Rt;
}
export {
  $t as AGENT_BEAT_MS,
  Sn as AGENT_DIM_OPACITY,
  zt as AGENT_FADE_MS,
  at as AGENT_GLIDE_MS,
  jt as AGENT_HOLD_MS,
  Wt as AGENT_MAX_DRAWN,
  Mn as AGENT_MAX_VISITS,
  it as AGENT_PALETTE,
  Ln as AGENT_SAY_MS,
  En as agentAnchor,
  Ft as agentChecklist,
  Ot as agentColor,
  bt as agentName,
  yn as agentOrigin,
  Ct as agentSaying,
  wn as agentStepText,
  ut as agentTagBox,
  Nn as agentTagPlaced,
  Pt as agentTagSide,
  Kt as boxOf,
  Tn as canvasZoom,
  q as clip,
  In as createAgentPresence,
  kn as hexPoints,
  tt as overlap,
  K as plainLine,
  pn as safeIconUrl,
  qt as screenScale,
  Yt as visibleAgents
};
