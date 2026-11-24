import { registerRuleControls as te } from "./workshop-model.mjs";
const O = 98, S = 88, j = 228, G = 24, Z = 5, W = 6, U = 40, ne = 30;
function ie(n) {
  return n.kind === "pipeline" ? "pipeline" : n.kind === "launch-plan" || n.kind === "hiring-plan" ? "time" : n.kind === "nest" ? "nest" : n.kind || n.experience || n.lanes.some((f) => f.station) ? null : "lanes";
}
const K = (n) => n.behaviour?.rules ?? [], oe = (n, f) => n.lanes.find((g) => g.id === f)?.label ?? f, Y = (n, f) => n.cards.filter((g) => g.laneId === f).length, X = (n, f, g) => Math.max(f, Math.min(g, n)), N = (n, f, g, k) => ({ x: Math.round(n - g / 2), y: Math.round(f - k / 2), width: Math.round(g), height: Math.round(k) }), le = (n, f, g = !0) => Math.ceil((n.length * 13 * 0.55 + (g ? 22 : 0) + 24) * f);
function q(n, f) {
  const g = K(n).find((k) => k.kind === "capacity" && k.where === f.id);
  return g ? { max: g.max, rule: g } : f.capacity !== void 0 ? { max: f.capacity } : null;
}
function R(n, f, g) {
  const k = q(n, f);
  return (k?.max ?? null) === g ? [] : k?.rule ? g === null ? [{ kind: "remove_rule", rule: k.rule.id }] : [{ kind: "set_rule", rule: k.rule.id, max: g }] : k || !n.behaviour ? [{ kind: "set_lane_capacity", lane: { id: f.id }, capacity: g }] : g === null ? [] : [{ kind: "add_rule", rule: { kind: "capacity", where: f.id, max: g } }];
}
const ae = (n, f, g = !1) => f === null ? n + " holds any number of cards" : n + " holds " + f + (g ? " (a warning only)" : "");
function re(n, f, g = {}) {
  const k = ie(n);
  if (!k) return [];
  const r = X(g.scale ?? 1, 1, 3), s = 44 * r, h = { width: f?.width ?? n.lanes.length * 244, height: f?.height ?? O + S }, l = f?.places ?? [], $ = [], C = K(n);
  let E = 0;
  const M = h.height + 18 * r, m = (o) => {
    const a = o.look.label ?? "", t = o.look.shape ?? "chip", v = t === "step" ? s : Math.max(s, le(a, r, !!o.look.icon));
    $.push({ ...o, look: { ...o.look, shape: t }, hit: { x: Math.round(E), y: Math.round(M), width: v, height: Math.round(s) } }), E += v + 8 * r;
  };
  if (k === "lanes" || k === "pipeline") {
    for (const o of n.lanes) {
      const a = l.find((L) => L.laneId === o.id);
      if (!a) continue;
      const t = q(n, o), v = t?.rule?.severity === "warn", p = C.some((L) => L.kind === "bin" && L.lane === o.id), i = o.label, e = ae(i, t?.max ?? null, v), u = k === "lanes" ? Math.min(j, a.width) : a.width, d = a.y + (k === "lanes" ? O - 26 * r : 30 * r), w = t?.rule ? [{ kind: "set_rule", rule: t.rule.id, severity: v ? "refuse" : "warn" }] : void 0, x = t && !t.rule ? Math.max(1, Y(n, o.id)) : 1, c = t ? t.max <= 1 ? null : t.max - 1 : null, _ = t ? Math.min(G, t.max + 1) : Math.max(1, Y(n, o.id)), A = a.x + u - 6 * r;
      if (t && !p && (c === null || c >= x) && $.push({
        id: "capacity-minus:" + o.id,
        primitive: "capacity",
        anchor: { kind: "lane", id: o.id },
        hit: N(A - s * 1.5, d, s, s),
        state: { value: t.max, sentence: e, ...t.rule && { ruleId: t.rule.id } },
        label: t.max <= 1 ? "Remove the limit on " + i : i + ": hold one fewer card",
        look: { shape: "step", icon: "minus", on: !0 },
        gestures: { tap: R(n, o, c) }
      }), !p && (!t || t.max < G) && $.push({
        id: "capacity-plus:" + o.id,
        primitive: "capacity",
        anchor: { kind: "lane", id: o.id },
        hit: N(A - s * 0.5, d, s, s),
        state: { value: t?.max ?? null, sentence: e, ...t?.rule && { ruleId: t.rule.id } },
        label: t ? i + ": hold one more card" : "Give " + i + " a limit of " + _,
        look: { shape: "step", icon: "plus", on: !!t },
        gestures: { tap: R(n, o, _), ...w && { hold: w } }
      }), k === "lanes" && !p) {
        const L = (B) => a.y + O + B * S - 6, y = a.y + a.height, P = Math.min(t ? L(t.max) : y - 8 * r, y - 8 * r), T = (B) => {
          const D = P + B;
          return D > Math.max(y, P + S) + S * 0.75 ? null : X(t ? t.max + Math.round(B / S) : Math.round((D + 6 - a.y - O) / S), x, G);
        }, J = ({ dy: B }) => {
          const D = T(B);
          return !t && (D === null || D >= Math.max(1, Y(n, o.id)) + 1) ? [] : R(n, o, D);
        }, ee = t ? "holds " + t.max : "no limit";
        $.push({
          id: "capacity:" + o.id,
          primitive: "capacity",
          anchor: { kind: "lane", id: o.id },
          hit: N(a.x + u / 2, P, Math.max(s * 2.4, 104 * r), s),
          state: { value: t?.max ?? null, sentence: e, ...t?.rule && { ruleId: t.rule.id } },
          label: e + ". Drag the line, or press the up and down arrows, to change it" + (t ? "; Delete removes it" : "") + (w ? "; Shift+Enter makes it " + (v ? "refuse" : "a warning only") : "") + ".",
          look: { shape: "line", label: ee, on: !!t, warn: v, x1: a.x + 6, x2: a.x + u - 6, y: P },
          gestures: {
            drag: J,
            step: S,
            axis: "y",
            preview: (B) => {
              const D = T(B.dy);
              return D === null ? "No limit" : "holds " + D;
            },
            ...w && { hold: w },
            ...t && { remove: R(n, o, null) }
          }
        });
      }
      if (k === "lanes") {
        const L = C.find((y) => y.kind === "bin" && y.lane === o.id);
        $.push({
          id: "bin:" + o.id,
          primitive: "bin",
          anchor: { kind: "lane", id: o.id },
          hit: N(a.x + 6 * r + s / 2, d, s, s),
          state: { value: !!L, sentence: L ? i + " is a bin: it archives the cards dropped in it" : i + " is not a bin", ...L && { ruleId: L.id } },
          label: L ? i + " is a bin. Press to make it an ordinary column." : "Make " + i + " a bin that archives cards" + (t ? " (its limit goes)" : "") + ".",
          look: { shape: "badge", icon: "bin", on: !!L },
          gestures: { tap: L ? [{ kind: "remove_rule", rule: L.id }] : [...R(n, o, null), { kind: "add_rule", rule: { kind: "bin", lane: o.id } }] }
        });
      } else {
        const L = C.find((y) => y.kind === "gate" && y.into === o.id);
        (!o.role || o.role === "won") && $.push({
          id: "gate:" + o.id,
          primitive: "gate",
          anchor: { kind: "lane", id: o.id },
          hit: N(a.x + 6 * r + s / 2, d, s, s),
          state: { value: !!L, sentence: L ? i + " needs an amount" : i + " takes any deal", ...L && { ruleId: L.id } },
          label: L ? i + " needs an amount. Press to let any deal in." : "Make " + i + " need an amount.",
          look: { shape: "badge", icon: "gate", on: !!L },
          gestures: { tap: L ? [{ kind: "remove_rule", rule: L.id }] : [{ kind: "add_rule", rule: { kind: "gate", into: o.id, needs: ["amount"] } }] }
        });
      }
    }
    if (k === "lanes") {
      for (let a = 0; a + 1 < n.lanes.length; a++) {
        const t = n.lanes[a], v = n.lanes[a + 1], p = l.find((c) => c.laneId === t.id), i = l.find((c) => c.laneId === v.id);
        if (!p || !i || (p.row ?? 0) !== (i.row ?? 0)) continue;
        const e = C.find((c) => c.kind === "path" && c.from === t.id && Array.isArray(c.to)), u = !!e?.to.includes(v.id), d = e ? u ? e.to.length === 1 ? [{ kind: "remove_rule", rule: e.id }] : [{ kind: "set_rule", rule: e.id, to: e.to.filter((c) => c !== v.id) }] : e.to.length >= 4 ? [] : [{ kind: "set_rule", rule: e.id, to: [...e.to, v.id] }] : [{ kind: "add_rule", rule: { kind: "path", from: t.id, to: [v.id] } }], w = u ? t.label + " → " + e.to.map((c) => oe(n, c)).join(" or ") + " only" : "Cards move freely between " + t.label + " and " + v.label, x = (p.x + Math.min(j, p.width) + i.x) / 2;
        $.push({
          id: "path:" + t.id + ">" + v.id,
          primitive: "path",
          anchor: { kind: "edge", id: t.id, to: v.id },
          hit: N(x, p.y + O + S / 2, s, s),
          state: { value: u, sentence: w, ...e && { ruleId: e.id } },
          label: u ? w + ". Press to let cards move freely." : "Make cards in " + t.label + " go only to " + v.label + ".",
          look: { shape: "badge", icon: u ? "oneway" : "twoway", on: u },
          gestures: { tap: d }
        });
      }
      if (n.lanes.length < Z && l.length) {
        const a = l.filter((i) => (i.row ?? 0) === 0), t = a[a.length - 1], v = t.x + Math.min(j, t.width) + 16 * r;
        $.push({
          id: "add-lane",
          primitive: "addLane",
          anchor: { kind: "board" },
          hit: { x: Math.round(v), y: Math.round(t.y), width: Math.round(Math.max(s, 64 * r)), height: Math.round(Math.max(s, Math.min(t.height, O + S))) },
          state: { sentence: n.lanes.length + " of " + Z + " columns" },
          label: "Add a column",
          look: { shape: "ghost", icon: "plus" },
          gestures: { tap: [{ kind: "add_lane", label: "New column" }] }
        });
      }
      const o = C.find((a) => a.kind === "path" && a.from === "any" && a.noSkip);
      m({
        id: "path:any",
        primitive: "path",
        anchor: { kind: "board" },
        state: { value: !!o, sentence: o ? "Cards move one column at a time" : "Cards may skip columns", ...o && { ruleId: o.id } },
        label: o ? "Cards move one column at a time. Press to let them skip columns." : "Make cards move one column at a time.",
        look: { label: "One column at a time", icon: "step", on: !!o },
        gestures: { tap: o ? [{ kind: "remove_rule", rule: o.id }] : [{ kind: "add_rule", rule: { kind: "path", from: "any", noSkip: !0 } }] }
      });
    }
  }
  if (k === "time") {
    const o = n.kind === "hiring-plan" ? "Hires" : "Tasks", a = C.find((v) => v.kind === "snap"), t = a?.unit;
    if (m({
      id: "snap",
      primitive: "snap",
      anchor: { kind: "axis" },
      state: { value: t ?? null, sentence: t ? o + " snap to whole " + t + "s" : o + " do not snap", ...a && { ruleId: a.id } },
      label: (t ? o + " snap to whole " + t + "s" : o + " do not snap") + ". Press for " + (t === "day" ? "whole weeks" : t === "week" ? "no snap" : "whole days") + ".",
      look: { label: "Snap: " + (t === "day" ? "Day" : t === "week" ? "Week" : "Off"), icon: "snap", on: !!t },
      gestures: { tap: a ? t === "day" ? [{ kind: "set_rule", rule: a.id, unit: "week" }] : [{ kind: "remove_rule", rule: a.id }] : [{ kind: "add_rule", rule: { kind: "snap", unit: "day" } }] }
    }), n.kind === "launch-plan") {
      const v = C.find((d) => d.kind === "deadline"), p = v?.severity === "warn", i = n.launch?.name === "go-live" ? "Go-live" : "Launch day";
      m({
        id: "deadline",
        primitive: "deadline",
        anchor: { kind: "axis" },
        state: { value: v ? p ? "soft" : "hard" : null, sentence: v ? i + " is a " + (p ? "soft" : "hard") + " line" : i + " has no rule yet", ...v && { ruleId: v.id } },
        label: v ? i + " is a " + (p ? "soft" : "hard") + " line. Press to make it " + (p ? "hard" : "soft") + "." : "Make " + i.toLowerCase() + " a hard line.",
        look: { label: v ? p ? "Soft line" : "Hard line" : "Line: none", icon: "flag", on: !!v, warn: p },
        gestures: {
          tap: v ? [{ kind: "set_rule", rule: v.id, severity: p ? "refuse" : "warn" }] : [{ kind: "add_rule", rule: { kind: "deadline", at: "launch" } }],
          ...v && { remove: [{ kind: "remove_rule", rule: v.id }] }
        }
      });
      const e = C.find((d) => d.kind === "cascade"), u = e?.onConflict;
      m({
        id: "cascade",
        primitive: "cascade",
        anchor: { kind: "board" },
        state: { value: u ?? null, sentence: u ? "A slip " + (u === "stop" ? "stops at" : "pushes") + " the tasks that wait on it" : "A slip does what the plan does by itself", ...e && { ruleId: e.id } },
        label: (u ? "A slip " + (u === "stop" ? "stops at" : "pushes") + " what waits on it" : "No rule for a slip") + ". Press for " + (u === "push" ? "stop" : u === "stop" ? "no rule" : "push") + ".",
        look: { label: "A slip: " + (u === "push" ? "pushes" : u === "stop" ? "stops" : "no rule"), icon: "push", on: !!u },
        gestures: { tap: e ? u === "push" ? [{ kind: "set_rule", rule: e.id, onConflict: "stop" }] : [{ kind: "remove_rule", rule: e.id }] : [{ kind: "add_rule", rule: { kind: "cascade", onConflict: "push" } }] }
      });
    }
  }
  if (k === "nest") {
    const o = n.nest?.layout;
    if (o !== "matrix") {
      const i = C.find((y) => y.kind === "depth"), e = i ? i.max : null, u = e ?? W, d = -44 * r, w = 8 * r, x = ne * r, c = w + (u - 1) * x, _ = (y) => {
        const P = Math.round((c + y - w) / x) + 1;
        return P > W ? null : X(P, 1, W);
      }, A = (y) => y === null ? "Cards nest as deep as they like" : y === 1 ? "Cards nest one level deep" : "Cards nest up to " + y + " levels deep", L = (y) => y === e ? [] : y === null ? [{ kind: "remove_rule", rule: i.id }] : i ? [{ kind: "set_rule", rule: i.id, max: y }] : [{ kind: "add_rule", rule: { kind: "depth", max: y } }];
      $.push({
        id: "depth",
        primitive: "depth",
        anchor: { kind: "board" },
        hit: N(d, c, s, s),
        state: { value: e, sentence: A(e), ...i && { ruleId: i.id } },
        label: A(e) + ". Drag the ladder, or press the up and down arrows, to change it" + (i ? "; Delete removes it" : "") + ".",
        look: { shape: "ladder", rungs: W, lit: u, on: !!i, y: w, x1: d, rungGap: x, label: e === null ? "any depth" : e + (e === 1 ? " level" : " levels") },
        gestures: { drag: ({ dy: y }) => L(_(y)), preview: ({ dy: y }) => A(_(y)), step: x, axis: "y", ...i && { remove: L(null) } }
      });
    }
    const a = C.find((i) => i.kind === "children" && !i.role), t = a ? a.max : null, v = Math.max(1, ...n.cards.map((i) => n.cards.filter((e) => e.parentId === i.id).length)), p = t === null ? "A card holds any number under it" : "A card holds at most " + t + " under it";
    if (m({
      id: "children",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: t, sentence: p, ...a && { ruleId: a.id } },
      label: p + ". Press to " + (a ? "remove the limit." : "give cards a limit of " + Math.min(U, Math.max(v, 3)) + "."),
      look: { label: t === null ? "Holds: any" : "Holds " + t, icon: "holds", on: !!a },
      gestures: { tap: a ? [{ kind: "remove_rule", rule: a.id }] : [{ kind: "add_rule", rule: { kind: "children", max: Math.min(U, Math.max(v, 3)) } }] }
    }), a && m({
      id: "children-minus",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: t, sentence: p },
      label: t === null ? "No limit on how many a card holds" : t <= 1 ? "Remove the limit on how many a card holds" : "A card holds one fewer",
      look: { shape: "step", icon: "minus", on: !!a },
      gestures: { tap: t <= 1 ? [{ kind: "remove_rule", rule: a.id }] : [{ kind: "set_rule", rule: a.id, max: t - 1 }] }
    }), a && t < U && m({
      id: "children-plus",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: t, sentence: p },
      label: "A card holds one more",
      look: { shape: "step", icon: "plus", on: !0 },
      gestures: { tap: [{ kind: "set_rule", rule: a.id, max: t + 1 }] }
    }), o === "clusters") {
      const i = C.find((y) => y.kind === "emptyDrop"), e = i?.drop, u = n.lanes[1]?.label ?? "Unsorted";
      m({
        id: "empty-drop",
        primitive: "emptyDrop",
        anchor: { kind: "board" },
        state: { value: e ?? null, sentence: e === "unsorted" ? "A card let go in empty space goes to " + u : "A card let go in empty space starts a new pile", ...i && { ruleId: i.id } },
        label: "Where a card let go in empty space goes: " + (e === "unsorted" ? u : e === "new-pile" ? "a new pile" : "a new pile (no rule)") + ". Press to change it.",
        look: { label: "Far drop: " + (e === "unsorted" ? u : e === "new-pile" ? "new pile" : "no rule"), icon: "drop", on: !!i },
        gestures: { tap: i ? e === "unsorted" ? [{ kind: "set_rule", rule: i.id, drop: "new-pile" }] : [{ kind: "remove_rule", rule: i.id }] : [{ kind: "add_rule", rule: { kind: "emptyDrop", drop: "unsorted" } }] }
      });
      const d = C.find((y) => y.kind === "rank"), w = d?.by, x = (n.nest?.fields ?? []).filter((y) => !y.flag).map((y) => ({ id: y.id, label: y.label })), c = [{ id: "count", label: "count" }, { id: "sources", label: "customers" }, ...x], _ = w ? c.findIndex((y) => y.id === w) : -1, A = c[_ + 1], L = (y) => c.find((P) => P.id === y)?.label ?? y ?? "";
      m({
        id: "rank",
        primitive: "rank",
        anchor: { kind: "board" },
        state: { value: w ?? null, sentence: w ? "Piles rank by " + L(w) : "Piles keep their order", ...d && { ruleId: d.id } },
        label: (w ? "Piles rank by " + L(w) : "Piles keep their order") + ". Press for " + (A ? "rank by " + A.label : "no ranking") + ".",
        look: { label: "Rank: " + (w ? L(w) : "off"), icon: "rank", on: !!d },
        gestures: { tap: d ? A ? [{ kind: "set_rule", rule: d.id, by: A.id }] : [{ kind: "remove_rule", rule: d.id }] : [{ kind: "add_rule", rule: { kind: "rank", by: "count" } }] }
      });
    }
  }
  return $;
}
const pe = ["add_rule", "set_rule", "remove_rule", "set_lane_capacity", "add_lane"], Q = "http://www.w3.org/2000/svg", b = {
  on: "var(--slatebox-board-focus, #1f4a3a)",
  onInk: "var(--slatebox-board-focus-ink, #ffffff)",
  off: "var(--slatebox-board-badge, #ffffff)",
  offLine: "var(--slatebox-board-control-line, #9aa69f)",
  ink: "var(--slatebox-board-ink, #34433f)",
  line: "var(--slatebox-board-accept, #1f7a5c)",
  warn: "var(--slatebox-board-preview, #a8761b)",
  refuse: "var(--slatebox-board-refuse, #c2410c)",
  halo: "var(--slatebox-board-halo, #ffffff)",
  ghost: "var(--slatebox-board-grid, #b9c2bb)",
  chip: "var(--slatebox-board-chip, #f2efe4)"
}, se = "var(--slatebox-board-font, system-ui, sans-serif)", F = (n) => /var\([^,]+,\s*([^)]+)\)/.exec(n)?.[1].trim() ?? n;
function I(n, f, g) {
  const k = document.createElementNS(Q, n);
  for (const [r, s] of Object.entries(f)) k.setAttribute(r, String(s));
  return g?.fill && (k.setAttribute("fill", F(g.fill)), k.style.setProperty("fill", g.fill)), g?.stroke && (k.setAttribute("stroke", F(g.stroke)), k.style.setProperty("stroke", g.stroke)), k;
}
function z(n, f, g, k, r) {
  const s = {
    // An archive box (a bin keeps what is dropped in it; it never deletes): a lid, a box, a handle.
    bin: "M1.5 2 L10.5 2 L10.5 4.5 L1.5 4.5 Z M2.5 4.5 L2.5 10.5 L9.5 10.5 L9.5 4.5 M4.5 6.8 L7.5 6.8",
    gate: "M3 6 L9 6 L9 11 L3 11 Z M4.5 6 L4.5 4 Q6 1.5 7.5 4 L7.5 6",
    oneway: "M1 6 L10 6 M7 3 L10 6 L7 9",
    twoway: "M1 6 L11 6 M4 3 L1 6 L4 9 M8 3 L11 6 L8 9",
    step: "M4 2 L8 6 L4 10",
    minus: "M2.5 6 L9.5 6",
    plus: "M2.5 6 L9.5 6 M6 2.5 L6 9.5",
    flag: "M3 11 L3 1.5 L10 3.5 L3 6",
    push: "M1 6 L7 6 M4.5 3.5 L7 6 L4.5 8.5 M9.5 2 L9.5 10",
    snap: "M1 2 L1 10 M4 2 L4 10 M7 2 L7 10 M10 2 L10 10 M1 6 L10 6",
    drop: "M6 1 L6 8 M3 5 L6 8 L9 5 M2 11 L10 11",
    rank: "M2 10 L2 6 M6 10 L6 3 M10 10 L10 1",
    depth: "M3 1 L3 11 M9 1 L9 11 M3 3 L9 3 M3 6 L9 6 M3 9 L9 9",
    holds: "M6 1 L6 4 M2 7 L2 11 M6 7 L6 11 M10 7 L10 11 M2 7 L10 7 M6 4 L6 7"
  };
  if (!n || !s[n]) return null;
  const h = k / 12;
  return I("path", {
    d: s[n],
    transform: `translate(${f} ${g}) scale(${h})`,
    fill: "none",
    "stroke-width": 1.7,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "vector-effect": "non-scaling-stroke",
    "pointer-events": "none"
  }, { stroke: r });
}
function H(n, f, g, k, r, s = "start", h = !1, l = !1) {
  const $ = I("text", {
    x: n,
    y: f,
    "font-size": k,
    "text-anchor": s,
    "font-family": "system-ui, sans-serif",
    "pointer-events": "none",
    ...h ? { "font-weight": 600 } : {},
    ...l ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
  }, { fill: r, ...l ? { stroke: b.halo } : {} });
  return $.style.setProperty("font-family", se), $.textContent = g, $;
}
const V = (n, f, g, k, r) => `M${n + r},${f} H${n + g - r} A${r},${r} 0 0 1 ${n + g},${f + r} V${f + k - r} A${r},${r} 0 0 1 ${n + g - r},${f + k} H${n + r} A${r},${r} 0 0 1 ${n},${f + k - r} V${f + r} A${r},${r} 0 0 1 ${n + r},${f} Z`;
function de(n) {
  const f = n.label.split(/\.\s/)[0].replace(/\.$/, "").replace(/\s*\([^)]*\)/g, "");
  return f.length > 42 ? f.slice(0, 41).replace(/\s+\S*$/, "") + "…" : f;
}
function ue(n, f, g, k) {
  const r = I("g", { "pointer-events": "none" }), { hit: s, look: h } = n, l = s.height / 44, $ = s.x + s.width / 2, C = s.y + s.height / 2, E = h.warn ? b.warn : b.line;
  if (h.shape === "line") {
    const M = (h.y ?? C) + f.dy;
    r.appendChild(I("line", {
      x1: h.x1 ?? s.x,
      x2: h.x2 ?? s.x + s.width,
      y1: M,
      y2: M,
      "stroke-width": h.on ? 2.5 : 1.5,
      "stroke-dasharray": h.on ? "8 5" : "3 5",
      "stroke-linecap": "round",
      ...h.on ? {} : { opacity: 0.7 }
    }, { stroke: h.on ? E : b.offLine }));
    const m = g ?? h.label ?? "", o = Math.max(84 * l, (m.length * 13 * 0.56 + 40) * l), a = 26 * l;
    r.appendChild(I("path", { d: V($ - o / 2, M - a / 2, o, a, a / 2), "stroke-width": 1.5 }, { fill: h.on ? b.off : b.chip, stroke: h.on ? E : b.offLine })), r.appendChild(I("path", {
      d: `M${$ - o / 2 + 10 * l} ${M - 2 * l} l${4 * l} ${-4 * l} l${4 * l} ${4 * l} M${$ - o / 2 + 10 * l} ${M + 2 * l} l${4 * l} ${4 * l} l${4 * l} ${-4 * l}`,
      fill: "none",
      "stroke-width": 1.6,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, { stroke: h.on ? E : b.ink })), r.appendChild(H($ + 8 * l, M + 4.5 * l, k ? "Saving…" : m, 13 * l, (h.on, b.ink), "middle", !!h.on));
  } else if (h.shape === "chip") {
    const M = 30 * l, m = C - M / 2;
    r.appendChild(I(
      "path",
      { d: V(s.x, m, s.width, M, M / 2), "stroke-width": 1.2, ...h.warn ? { "stroke-dasharray": "3 3" } : {} },
      { fill: h.on ? b.on : b.chip, stroke: h.on ? b.on : b.offLine }
    ));
    const o = h.on ? b.onInk : b.ink, a = z(h.icon, s.x + 12 * l, C - 6.5 * l, 13 * l, o);
    a && r.appendChild(a), r.appendChild(H(s.x + (a ? 32 : 14) * l, C + 4.5 * l, k ? "Saving…" : h.label ?? "", 13 * l, o, "start", !!h.on));
  } else if (h.shape === "badge" || h.shape === "step") {
    const M = (h.shape === "step" ? 13 : 15) * l, m = h.shape === "badge" ? !!h.on : !1;
    r.appendChild(I(
      "circle",
      { cx: $, cy: C, r: M, "stroke-width": 1.4, ...h.shape === "badge" && !h.on ? { "stroke-dasharray": "3 3" } : {} },
      { fill: m ? b.on : b.off, stroke: m ? b.on : h.shape === "step" && h.on ? E : b.offLine }
    ));
    const o = z(h.icon, $ - 7 * l, C - 7 * l, 14 * l, m ? b.onInk : h.on || h.shape === "step" ? b.ink : b.offLine);
    o && r.appendChild(o), k && r.appendChild(I("circle", { cx: $, cy: C, r: M + 3 * l, fill: "none", "stroke-width": 2, "stroke-dasharray": "4 4" }, { stroke: b.line }));
  } else if (h.shape === "ghost") {
    const M = Math.min(l, s.width / 64);
    r.appendChild(I("path", { d: V(s.x, s.y, s.width, s.height, 10 * M), "stroke-width": 1.6, "stroke-dasharray": "6 5" }, { fill: "none", stroke: b.ghost }));
    const m = z("plus", $ - 9 * M, C - 16 * M, 18 * M, b.ink);
    m && r.appendChild(m), r.appendChild(H($, C + 18 * M, k ? "Adding…" : "Column", 12 * M, b.ink, "middle"));
  } else if (h.shape === "ladder") {
    const M = h.x1 ?? $, m = h.y ?? s.y, o = h.rungGap ?? 30 * l, a = h.rungs ?? 6, t = Math.max(1, Math.min(a, Math.round((h.lit ?? a) + f.dy / o))), v = m + (a - 1) * o;
    for (const e of [-10 * l, 10 * l]) r.appendChild(I("line", { x1: M + e, x2: M + e, y1: m - 6 * l, y2: v + 6 * l, "stroke-width": 1.5 }, { stroke: b.offLine }));
    for (let e = 0; e < a; e++) {
      const u = e < t && (h.on || f.dy !== 0);
      r.appendChild(I("line", { x1: M - 10 * l, x2: M + 10 * l, y1: m + e * o, y2: m + e * o, "stroke-width": u ? 3 : 1.5, "stroke-linecap": "round" }, { stroke: u ? E : b.offLine }));
    }
    const p = m + (t - 1) * o, i = g ?? h.label ?? "";
    r.appendChild(I("circle", { cx: M, cy: p, r: 12 * l, "stroke-width": 1.6 }, { fill: b.off, stroke: h.on ? E : b.ink })), r.appendChild(I("path", { d: `M${M - 4 * l} ${p - 1 * l} l${4 * l} ${-4 * l} l${4 * l} ${4 * l} M${M - 4 * l} ${p + 1 * l} l${4 * l} ${4 * l} l${4 * l} ${-4 * l}`, fill: "none", "stroke-width": 1.5 }, { stroke: b.ink })), r.appendChild(H(M, m - 16 * l, k ? "Saving…" : "Depth", 12 * l, b.ink, "middle", !0, !0)), (g || f.dy) && r.appendChild(H(M + 18 * l, p + 4 * l, i, 12 * l, b.ink, "start", !0, !0));
  }
  return r;
}
function ce(n, f, g, k = {}) {
  const r = n?.canvas?.node;
  if (!r || typeof document > "u") return { update() {
  }, remove() {
  } };
  const s = document.createElementNS(Q, "g");
  s.setAttribute("data-rule-controls", ""), s.setAttribute("data-board-scope", f), s.setAttribute("role", "group"), s.setAttribute("aria-label", "How this board behaves: controls");
  let h = g, l = k.origin ?? { x: 0, y: 0 }, $ = !1, C = null, E = null, M, m = null;
  const o = (p) => {
    const i = s.getScreenCTM?.();
    if (!i || typeof r.createSVGPoint != "function") return { x: p.clientX, y: p.clientY };
    const e = r.createSVGPoint();
    e.x = p.clientX, e.y = p.clientY;
    const u = e.matrixTransform(i.inverse());
    return { x: u.x, y: u.y };
  };
  async function a(p, i, e) {
    if (!i?.length || C || $) return;
    C = p.id, t();
    let u = !1;
    try {
      u = !!await k.onRuleEdit?.(i, e);
    } catch {
      u = !1;
    }
    if (C = null, $) return;
    E = { id: p.id, ok: u, until: Date.now() + 2e3 }, clearTimeout(M), M = setTimeout(() => {
      E = null, t();
    }, 2e3), t();
    const d = h.find((w) => w.id === p.id);
    k.announce?.(u ? (d?.state.sentence ?? e) + "." : "Not changed.");
  }
  function t() {
    if ($) return;
    const p = document.activeElement, i = p && s.contains(p) ? p.getAttribute("data-rule-control") : null;
    for (; s.firstChild; ) s.removeChild(s.firstChild);
    s.setAttribute("transform", `translate(${l.x} ${l.y})`);
    for (const e of h) {
      const u = m?.control.id === e.id && m.moved, d = u ? m.delta : { dx: 0, dy: 0 }, w = u ? e.gestures.preview?.(d) ?? null : null, x = I("g", {
        "data-rule-control": e.id,
        "data-primitive": e.primitive,
        role: e.gestures.drag ? "slider" : "button",
        tabindex: 0,
        "aria-label": e.label,
        ...e.look.on !== void 0 && !e.gestures.drag ? { "aria-pressed": String(!!e.look.on) } : {},
        ...e.gestures.drag ? { "aria-valuetext": e.state.sentence } : {},
        cursor: e.gestures.drag ? e.gestures.axis === "x" ? "ew-resize" : "ns-resize" : "pointer"
      });
      x.style.setProperty("outline", "none"), x.appendChild(ue(e, d, w, C === e.id));
      const { hit: c } = e, _ = I("rect", {
        x: c.x,
        y: c.y + (e.look.shape === "line" || e.look.shape === "ladder" ? d.dy : 0),
        width: c.width,
        height: c.height,
        rx: Math.min(c.width, c.height) / 2,
        "pointer-events": "all",
        "data-rule-hit": ""
      }, { fill: "transparent" });
      _.style.setProperty("touch-action", "none"), x.appendChild(_);
      const A = I("rect", {
        x: c.x - 3,
        y: c.y - 3 + (e.look.shape === "line" ? d.dy : 0),
        width: c.width + 6,
        height: c.height + 6,
        rx: Math.min(c.width, c.height) / 2 + 3,
        fill: "none",
        "stroke-width": 2.5,
        "pointer-events": "none",
        "data-rule-focus": "",
        opacity: 0
      }, { stroke: b.line });
      x.appendChild(A);
      const L = I("title", {});
      L.textContent = e.label, x.appendChild(L);
      const y = e.look.shape === "line" || e.look.shape === "ladder" ? null : H(c.x + c.width / 2, c.y - 8 * (Math.min(c.width, c.height) / 44), de(e), 12 * (Math.min(c.width, c.height) / 44), b.ink, "middle", !0, !0);
      y && (y.setAttribute("opacity", "0"), y.setAttribute("data-rule-hint", ""), x.appendChild(y));
      const P = (T) => y?.setAttribute("opacity", T ? "1" : "0");
      if (x.addEventListener("focus", () => {
        A.setAttribute("opacity", "1"), P(!0);
      }), x.addEventListener("blur", () => {
        A.setAttribute("opacity", "0"), P(!1);
      }), x.addEventListener("pointerenter", () => P(!0)), x.addEventListener("pointerleave", () => {
        document.activeElement !== x && P(!1);
      }), v(x, e), E?.id === e.id && E.until > Date.now()) {
        const T = E.ok ? e.state.sentence : "Not changed";
        x.appendChild(H(c.x + c.width / 2, c.y - 8 * (c.height / 44), T, 13 * (c.height / 44), E.ok ? b.line : b.refuse, "middle", !0, !0)), x.setAttribute("data-rule-flash", T);
      }
      s.appendChild(x);
    }
    r.lastChild !== s && r.appendChild(s), i && s.querySelector(`[data-rule-control="${CSS.escape ? CSS.escape(i) : i}"]`)?.focus({ preventScroll: !0 });
  }
  function v(p, i) {
    const e = (u) => u.stopPropagation();
    p.addEventListener("mousedown", e), p.addEventListener("touchstart", e, { passive: !0 }), p.addEventListener("dblclick", (u) => {
      u.stopPropagation(), u.preventDefault();
    }), p.addEventListener("pointerdown", (u) => {
      if (u.stopPropagation(), u.preventDefault(), C || m) return;
      const d = { control: i, start: o(u), delta: { dx: 0, dy: 0 }, moved: !1, holdDone: !1, pointerId: u.pointerId };
      m = d;
      const w = (c) => {
        if (m !== d || c.pointerId !== d.pointerId) return;
        const _ = o(c), A = { dx: _.x - d.start.x, dy: _.y - d.start.y };
        !d.moved && Math.hypot(A.dx, A.dy) < 5 || d.control.gestures.drag && (c.preventDefault(), d.moved = !0, clearTimeout(d.holdTimer), d.delta = d.control.gestures.axis === "x" ? { dx: A.dx, dy: 0 } : { dx: 0, dy: A.dy }, t());
      }, x = (c) => {
        if (c.pointerId !== d.pointerId || (window.removeEventListener("pointermove", w, !0), window.removeEventListener("pointerup", x, !0), window.removeEventListener("pointercancel", x, !0), m !== d)) return;
        m = null, clearTimeout(d.holdTimer);
        const _ = d.control;
        if (c.type === "pointercancel" || d.holdDone) {
          t();
          return;
        }
        if (c.stopPropagation(), d.moved && _.gestures.drag) {
          const A = _.gestures.preview?.(d.delta) ?? _.label, L = _.gestures.drag(d.delta);
          t(), a(_, L, A);
        } else _.gestures.tap ? a(_, _.gestures.tap, _.label) : t();
      };
      window.addEventListener("pointermove", w, !0), window.addEventListener("pointerup", x, !0), window.addEventListener("pointercancel", x, !0), i.gestures.hold && (d.holdTimer = setTimeout(() => {
        m !== d || d.moved || (d.holdDone = !0, a(d.control, d.control.gestures.hold, d.control.label));
      }, 550));
    }), p.addEventListener("click", e), p.addEventListener("contextmenu", (u) => {
      u.preventDefault(), u.stopPropagation(), i.gestures.hold && a(i, i.gestures.hold, i.label);
    }), p.addEventListener("keydown", (u) => {
      const d = u.key, { gestures: w } = i;
      let x;
      if ((d === "Enter" || d === " ") && u.shiftKey && w.hold) x = w.hold;
      else if (d === "Enter" || d === " ") x = w.tap;
      else if ((d === "Delete" || d === "Backspace") && w.remove) x = w.remove;
      else if (w.drag && w.step && /^Arrow(Up|Down|Left|Right)$/.test(d)) {
        const c = d === "ArrowUp" || d === "ArrowLeft" ? -1 : 1;
        x = w.drag(w.axis === "x" ? { dx: c * w.step, dy: 0 } : { dx: 0, dy: c * w.step });
      } else return;
      u.preventDefault(), u.stopPropagation(), a(i, x, i.label);
    });
  }
  return t(), {
    update(p, i) {
      $ || (h = p, i && (l = i), m && !p.some((e) => e.id === m.control.id) ? m = null : m && (m = { ...m, control: p.find((e) => e.id === m.control.id) }), t());
    },
    remove() {
      $ = !0, clearTimeout(M), m && clearTimeout(m.holdTimer), s.remove();
    }
  };
}
te({ controls: re, draw: ce });
export {
  pe as RULE_CONTROL_EDITS,
  b as controlInk,
  ce as drawRuleControls,
  de as hintOf,
  re as ruleControls,
  ie as ruleControlsFamily
};
