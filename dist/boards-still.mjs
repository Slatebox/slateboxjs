const I = ["launch-plan", "hiring-plan", "pipeline", "budget", "nest"], k = {
  fontFamily: "Manrope",
  fontSize: 18,
  laneFontSize: 20,
  captionFontSize: 14,
  textColor: "#1d2b2a",
  borderColor: "#c5ccc4",
  borderWidth: 1,
  cornerRadius: 10
}, z = 244, w = (t) => Number.isFinite(t);
function D(t, r) {
  const n = r?.lanes?.length ?? 0;
  if (!n || r.lanes[0].station) return;
  if (t < 600) return 1;
  const o = Math.floor(t / (z * 0.7));
  return o >= n ? void 0 : Math.max(2, o);
}
function W(t, r) {
  const n = t?.workshopOrigin;
  if (w(n?.x) && w(n?.y)) return { x: n.x, y: n.y };
  const o = (r ?? []).filter((i) => w(i?.options?.xPos) && w(i?.options?.yPos));
  if (!o.length) return { x: 40, y: 40 };
  const a = Math.max(...o.map(({ options: i }) => i.xPos + (Number(i.width) || 0))), e = Math.min(...o.map(({ options: i }) => i.yPos));
  return { x: Math.round(a + 80), y: Math.round(e) };
}
function E(t) {
  if (typeof t == "number") return t;
  const r = /^([\d.]+)\s*(pt|px)?$/.exec(String(t ?? "").trim());
  if (r)
    return Math.round(Number(r[1]) * (r[2] === "pt" ? 4 / 3 : 1));
}
function T(t, r, n = k) {
  const o = (t ?? []).map((i) => i?.options ?? {}).find((i) => String(i.text ?? "").trim() && !i.isComment && !i.image);
  if (!o) {
    const i = r.DEFAULT_NOTE_STYLE;
    return {
      backgroundColor: i.backgroundColor,
      textColor: i.fontColor,
      fontFamily: i.fontFamily,
      fontSize: n.fontSize,
      borderColor: i.borderColor,
      borderWidth: i.borderWidth,
      cornerRadius: 0
    };
  }
  const a = [o.vectorPath, o.shape, o.shapeHint].some((i) => /rounded/i.test(String(i ?? ""))), e = r.workshopCardLookOf({
    backgroundColor: o.backgroundColor,
    textColor: o.fontColor ?? o.foregroundColor,
    fontFamily: o.fontFamily,
    fontSize: E(o.fontSize),
    borderColor: o.borderColor,
    borderWidth: o.borderWidth
  });
  return e || a ? { ...e, cornerRadius: a ? n.cornerRadius : 0 } : void 0;
}
function F(t, r, n = k) {
  const o = T(t, r, n);
  return o ? { ...n, card: o } : n;
}
const L = /^[a-z0-9]{1,12}$/, O = (t) => t?.model?.kind === "workshop" && !!t.model.workshop, B = (t) => Number(/^b(\d+)$/.exec(t)?.[1] ?? 1 / 0);
function N(t) {
  const r = [];
  O(t?.creative) && r.push({ id: "main", workshop: t.creative.model.workshop, origin: W(t.options, t.nodes) });
  const n = t?.boards && typeof t.boards == "object" && !Array.isArray(t.boards) ? t.boards : {}, o = Object.entries(n).filter(([a, e]) => L.test(a) && a !== "main" && O(e)).sort(([a], [e]) => B(a) - B(e) || (a < e ? -1 : a > e ? 1 : 0));
  for (const [a, e] of o)
    r.push({ id: a, workshop: e.model.workshop, origin: w(e.origin?.x) && w(e.origin?.y) ? { x: e.origin.x, y: e.origin.y } : null });
  return r;
}
const $ = (t) => N(t).length > 0;
function q(t, r) {
  return { options: { name: r ?? t?.title ?? "Board", workshopOrigin: { x: 40, y: 40 } }, nodes: [], creative: { model: { kind: "workshop", workshop: t } } };
}
function _(t) {
  const r = (t ?? []).map((n) => n?.options ?? {}).filter((n) => w(n.xPos) && w(n.yPos)).map((n) => ({ x: n.xPos, y: n.yPos, width: Number(n.width) || 0, height: Number(n.height) || 0 }));
  return R(r);
}
function R(t) {
  if (!t.length) return null;
  const r = Math.min(...t.map((e) => e.x)), n = Math.min(...t.map((e) => e.y)), o = Math.max(...t.map((e) => e.x + e.width)), a = Math.max(...t.map((e) => e.y + e.height));
  return { x: r, y: n, width: o - r, height: a - n };
}
function K(t) {
  const r = t.querySelector("svg"), n = r?.getScreenCTM?.()?.inverse?.();
  if (!n || typeof DOMPoint > "u") return null;
  let o = 1 / 0, a = 1 / 0, e = -1 / 0, i = -1 / 0;
  for (const y of r.querySelectorAll("rect, text, path, image, circle, ellipse, line, polygon, polyline, foreignObject")) {
    let c, s;
    try {
      c = y.getBBox(), s = y.getScreenCTM();
    } catch {
      continue;
    }
    if (!s || !c.width && !c.height || y.closest('[display="none"], [visibility="hidden"]')) continue;
    const d = n.multiply(s);
    for (const [h, u] of [[c.x, c.y], [c.x + c.width, c.y], [c.x, c.y + c.height], [c.x + c.width, c.y + c.height]]) {
      const l = new DOMPoint(h, u).matrixTransform(d);
      o = Math.min(o, l.x), a = Math.min(a, l.y), e = Math.max(e, l.x), i = Math.max(i, l.y);
    }
  }
  return Number.isFinite(o) && e > o && i > a ? { x: o, y: a, width: e - o, height: i - a } : null;
}
function j(t, r, n, o = 24) {
  const a = t.width + o * 2, e = t.height + o * 2, i = Math.min(r / a, n / e), y = r / i, c = n / i;
  return { x: t.x - o + (a - y) / 2, y: t.y - o + (e - c) / 2, width: y, height: c };
}
function H(t) {
  let r = null;
  const n = () => r ?? (r = t.model()), o = { ...k, ...t.noteStyle };
  function a(s) {
    const d = s.boardChromeStyles;
    if (!d || typeof document > "u" || document.getElementById("sb-board-chrome")) return;
    const h = document.createElement("style");
    h.id = "sb-board-chrome", h.textContent = d, document.head.appendChild(h);
  }
  async function e(s) {
    const d = I.includes(s?.kind), h = await n(), [u] = await Promise.all([
      d ? t.boards() : null,
      s?.kind === "nest" ? t.nest() : null,
      // A kit board's legend is its rulebook's sentences (boardChrome kitLegend), so a kit board needs it too.
      (s?.behaviour || d) && !h.rulebookLoaded() ? t.behaviour() : null
    ]);
    return u ? { kit: u.kitFor(s.kind), layoutFor: (l) => u.boardLayoutFor(l) } : { kit: void 0, layoutFor: (l) => ({ lanesPerRow: D(l, s) }) };
  }
  async function i(s, d, { how: h = "still", origin: u, scope: l, width: f = 1440, style: m } = {}) {
    const g = await n();
    a(g);
    const { kit: p, layoutFor: x } = await e(d);
    return g.attachWorkshop(s, d, {
      readOnly: !0,
      origin: u,
      layout: x(f),
      style: m ?? F(s.freeNodes?.() ?? [], g, o),
      // A draft wears its dashed frame; a still's chrome scales with the board, as an export's does.
      ...h === "draft" ? { draft: !0 } : { still: !0 },
      ...(l || h === "draft") && { scope: l ?? "pv" },
      ...p ? { kit: p } : {}
    });
  }
  async function y(s, d, { width: h = 1440 } = {}) {
    const u = Array.isArray(d?.nodes) ? d.nodes : [], l = F(u, await n(), o), f = [];
    for (const m of N(d)) {
      if (!m.origin) continue;
      const g = m.id === "main";
      try {
        const p = await i(s, m.workshop, { how: "still", origin: m.origin, scope: g ? void 0 : m.id, width: h, style: l });
        await p.whenDrawn?.(), f.push(p);
      } catch (p) {
        console.warn("A board on this slate could not be drawn on its picture.", p);
      }
    }
    return f;
  }
  async function c(s, d, { frame: h, width: u = 1440 } = {}) {
    if (!t.Slate) throw new Error("renderStill needs the canvas: pass a Slate loader to createStillRenderer.");
    const l = await t.Slate(), f = new l(s, {
      name: d?.options?.name,
      enabled: !1,
      showMultiSelect: !1,
      showUndoRedo: !1,
      showZoom: !1,
      showbirdsEye: !1,
      viewPort: { showCoordinates: !1, allowDrag: !1 },
      panZoom: { enabled: !1 },
      events: { isReadOnly: () => !0 }
    }), { creative: m, boards: g, ...p } = d ?? {};
    await f.loadJSON({ ...p, nodes: Array.isArray(d?.nodes) ? d.nodes : [] }, !1, !0);
    const x = await y(f, d, { width: u }), A = R([_(d?.nodes), ...x.map((b) => b.frame ?? b.bounds)].filter(Boolean)), C = h ?? K(s) ?? A ?? { x: 0, y: 0, width: 800, height: 450 }, S = () => {
      const b = s.clientWidth, P = s.clientHeight;
      if (!b || !P) return;
      const v = j(C, b, P);
      f.canvas?.viewbox?.(v.x, v.y, v.width, v.height);
    };
    S();
    const M = typeof ResizeObserver > "u" ? null : new ResizeObserver(S);
    return M?.observe(s), s.dataset.stillDrawn = "true", {
      slate: f,
      boards: x,
      frame: C,
      fit: S,
      destroy() {
        M?.disconnect();
        for (const b of x)
          try {
            b.destroy();
          } catch {
          }
        try {
          f.destroy?.();
        } catch {
        }
        s.replaceChildren(), delete s.dataset.stillDrawn;
      }
    };
  }
  return { loadBoardKit: e, drawBoard: i, drawSlateBoards: y, renderStill: c };
}
export {
  I as KIT_KINDS,
  q as componentSlate,
  H as createStillRenderer,
  K as drawnBox,
  j as fitViewbox,
  $ as holdsBoards,
  D as lanesPerRow,
  _ as notesBox,
  N as slateBoards,
  T as workshopCardLook,
  k as workshopNoteStyle,
  W as workshopOrigin,
  F as workshopStyle
};
