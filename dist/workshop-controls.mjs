import { appearanceChips as oe, registerRuleControls as ae } from "./workshop-model.mjs";
const G = 98, N = 88, X = 228, j = 24, q = 5, U = 6, z = 40, le = 30;
function se(o) {
  return o.kind === "pipeline" ? "pipeline" : o.kind === "launch-plan" || o.kind === "hiring-plan" ? "time" : o.kind === "nest" ? "nest" : o.kind || o.experience || o.lanes.some((f) => f.station) ? null : "lanes";
}
const J = (o) => o.behaviour?.rules ?? [], re = (o, f) => o.lanes.find((g) => g.id === f)?.label ?? f, V = (o, f) => o.cards.filter((g) => g.laneId === f).length, Y = (o, f, g) => Math.max(f, Math.min(g, o)), O = (o, f, g, k) => ({ x: Math.round(o - g / 2), y: Math.round(f - k / 2), width: Math.round(g), height: Math.round(k) }), de = (o, f, g = !0) => Math.ceil((o.length * 13 * 0.55 + (g ? 22 : 0) + 24) * f);
function ee(o, f) {
  const g = J(o).find((k) => k.kind === "capacity" && k.where === f.id);
  return g ? { max: g.max, rule: g } : f.capacity !== void 0 ? { max: f.capacity } : null;
}
function W(o, f, g) {
  const k = ee(o, f);
  return (k?.max ?? null) === g ? [] : k?.rule ? g === null ? [{ kind: "remove_rule", rule: k.rule.id }] : [{ kind: "set_rule", rule: k.rule.id, max: g }] : k || !o.behaviour ? [{ kind: "set_lane_capacity", lane: { id: f.id }, capacity: g }] : g === null ? [] : [{ kind: "add_rule", rule: { kind: "capacity", where: f.id, max: g } }];
}
const ue = (o, f, g = !1) => f === null ? o + " holds any number of cards" : o + " holds " + f + (g ? " (a warning only)" : "");
function ce(o, f, g = {}) {
  const k = se(o);
  if (!k) return [];
  const l = Y(g.scale ?? 1, 1, 3), r = 44 * l, u = { width: f?.width ?? o.lanes.length * 244, height: f?.height ?? G + N }, s = f?.places ?? [], M = [], L = J(o);
  let E = 0;
  const x = u.height + 18 * l, m = (a) => {
    const i = a.look.label ?? "", e = a.look.shape ?? "chip", n = e === "step" ? r : Math.max(r, de(i, l, !!a.look.icon));
    M.push({ ...a, look: { ...a.look, shape: e }, hit: { x: Math.round(E), y: Math.round(x), width: n, height: Math.round(r) } }), E += n + 8 * l;
  };
  if (k === "lanes" || k === "pipeline") {
    for (const a of o.lanes) {
      const i = s.find((b) => b.laneId === a.id);
      if (!i) continue;
      const e = ee(o, a), n = e?.rule?.severity === "warn", c = L.some((b) => b.kind === "bin" && b.lane === a.id), t = a.label, d = ue(t, e?.max ?? null, n), p = k === "lanes" ? Math.min(X, i.width) : i.width, h = i.y + (k === "lanes" ? G - 26 * l : 30 * l), w = e?.rule ? [{ kind: "set_rule", rule: e.rule.id, severity: n ? "refuse" : "warn" }] : void 0, $ = e && !e.rule ? Math.max(1, V(o, a.id)) : 1, C = e ? e.max <= 1 ? null : e.max - 1 : null, S = e ? Math.min(j, e.max + 1) : Math.max(1, V(o, a.id)), P = i.x + p - 6 * l;
      if (e && !c && (C === null || C >= $) && M.push({
        id: "capacity-minus:" + a.id,
        primitive: "capacity",
        anchor: { kind: "lane", id: a.id },
        hit: O(P - r * 1.5, h, r, r),
        state: { value: e.max, sentence: d, ...e.rule && { ruleId: e.rule.id } },
        label: e.max <= 1 ? "Remove the limit on " + t : t + ": hold one fewer card",
        look: { shape: "step", icon: "minus", on: !0 },
        gestures: { tap: W(o, a, C) }
      }), !c && (!e || e.max < j) && M.push({
        id: "capacity-plus:" + a.id,
        primitive: "capacity",
        anchor: { kind: "lane", id: a.id },
        hit: O(P - r * 0.5, h, r, r),
        state: { value: e?.max ?? null, sentence: d, ...e?.rule && { ruleId: e.rule.id } },
        label: e ? t + ": hold one more card" : "Give " + t + " a limit of " + S,
        look: { shape: "step", icon: "plus", on: !!e },
        gestures: { tap: W(o, a, S), ...w && { hold: w } }
      }), k === "lanes" && !c) {
        const b = (H) => i.y + G + H * N - 6, y = i.y + i.height, B = Math.min(e ? b(e.max) : y - 8 * l, y - 8 * l), K = (H) => {
          const T = B + H;
          return T > Math.max(y, B + N) + N * 0.75 ? null : Y(e ? e.max + Math.round(H / N) : Math.round((T + 6 - i.y - G) / N), $, j);
        }, ne = ({ dy: H }) => {
          const T = K(H);
          return !e && (T === null || T >= Math.max(1, V(o, a.id)) + 1) ? [] : W(o, a, T);
        }, ie = e ? "holds " + e.max : "no limit";
        M.push({
          id: "capacity:" + a.id,
          primitive: "capacity",
          anchor: { kind: "lane", id: a.id },
          hit: O(i.x + p / 2, B, Math.max(r * 2.4, 104 * l), r),
          state: { value: e?.max ?? null, sentence: d, ...e?.rule && { ruleId: e.rule.id } },
          label: d + ". Drag the line, or press the up and down arrows, to change it" + (e ? "; Delete removes it" : "") + (w ? "; Shift+Enter makes it " + (n ? "refuse" : "a warning only") : "") + ".",
          look: { shape: "line", label: ie, on: !!e, warn: n, x1: i.x + 6, x2: i.x + p - 6, y: B },
          gestures: {
            drag: ne,
            step: N,
            axis: "y",
            preview: (H) => {
              const T = K(H.dy);
              return T === null ? "No limit" : "holds " + T;
            },
            ...w && { hold: w },
            ...e && { remove: W(o, a, null) }
          }
        });
      }
      if (k === "lanes") {
        const b = L.find((y) => y.kind === "bin" && y.lane === a.id);
        M.push({
          id: "bin:" + a.id,
          primitive: "bin",
          anchor: { kind: "lane", id: a.id },
          hit: O(i.x + 6 * l + r / 2, h, r, r),
          state: { value: !!b, sentence: b ? t + " is a bin: it archives the cards dropped in it" : t + " is not a bin", ...b && { ruleId: b.id } },
          label: b ? t + " is a bin. Press to make it an ordinary column." : "Make " + t + " a bin that archives cards" + (e ? " (its limit goes)" : "") + ".",
          look: { shape: "badge", icon: "bin", on: !!b },
          gestures: { tap: b ? [{ kind: "remove_rule", rule: b.id }] : [...W(o, a, null), { kind: "add_rule", rule: { kind: "bin", lane: a.id } }] }
        });
      } else {
        const b = L.find((y) => y.kind === "gate" && y.into === a.id);
        (!a.role || a.role === "won") && M.push({
          id: "gate:" + a.id,
          primitive: "gate",
          anchor: { kind: "lane", id: a.id },
          hit: O(i.x + 6 * l + r / 2, h, r, r),
          state: { value: !!b, sentence: b ? t + " needs an amount" : t + " takes any deal", ...b && { ruleId: b.id } },
          label: b ? t + " needs an amount. Press to let any deal in." : "Make " + t + " need an amount.",
          look: { shape: "badge", icon: "gate", on: !!b },
          gestures: { tap: b ? [{ kind: "remove_rule", rule: b.id }] : [{ kind: "add_rule", rule: { kind: "gate", into: a.id, needs: ["amount"] } }] }
        });
      }
    }
    if (k === "lanes") {
      for (let i = 0; i + 1 < o.lanes.length; i++) {
        const e = o.lanes[i], n = o.lanes[i + 1], c = s.find((C) => C.laneId === e.id), t = s.find((C) => C.laneId === n.id);
        if (!c || !t || (c.row ?? 0) !== (t.row ?? 0)) continue;
        const d = L.find((C) => C.kind === "path" && C.from === e.id && Array.isArray(C.to)), p = !!d?.to.includes(n.id), h = d ? p ? d.to.length === 1 ? [{ kind: "remove_rule", rule: d.id }] : [{ kind: "set_rule", rule: d.id, to: d.to.filter((C) => C !== n.id) }] : d.to.length >= 4 ? [] : [{ kind: "set_rule", rule: d.id, to: [...d.to, n.id] }] : [{ kind: "add_rule", rule: { kind: "path", from: e.id, to: [n.id] } }], w = p ? e.label + " → " + d.to.map((C) => re(o, C)).join(" or ") + " only" : "Cards move freely between " + e.label + " and " + n.label, $ = (c.x + Math.min(X, c.width) + t.x) / 2;
        M.push({
          id: "path:" + e.id + ">" + n.id,
          primitive: "path",
          anchor: { kind: "edge", id: e.id, to: n.id },
          hit: O($, c.y + G + N / 2, r, r),
          state: { value: p, sentence: w, ...d && { ruleId: d.id } },
          label: p ? w + ". Press to let cards move freely." : "Make cards in " + e.label + " go only to " + n.label + ".",
          look: { shape: "badge", icon: p ? "oneway" : "twoway", on: p },
          gestures: { tap: h }
        });
      }
      if (o.lanes.length < q && s.length) {
        const i = s.filter((t) => (t.row ?? 0) === 0), e = i[i.length - 1], n = e.x + Math.min(X, e.width) + 16 * l;
        M.push({
          id: "add-lane",
          primitive: "addLane",
          anchor: { kind: "board" },
          hit: { x: Math.round(n), y: Math.round(e.y), width: Math.round(Math.max(r, 64 * l)), height: Math.round(Math.max(r, Math.min(e.height, G + N))) },
          state: { sentence: o.lanes.length + " of " + q + " columns" },
          label: "Add a column",
          look: { shape: "ghost", icon: "plus" },
          gestures: { tap: [{ kind: "add_lane", label: "New column" }] }
        });
      }
      const a = L.find((i) => i.kind === "path" && i.from === "any" && i.noSkip);
      m({
        id: "path:any",
        primitive: "path",
        anchor: { kind: "board" },
        state: { value: !!a, sentence: a ? "Cards move one column at a time" : "Cards may skip columns", ...a && { ruleId: a.id } },
        label: a ? "Cards move one column at a time. Press to let them skip columns." : "Make cards move one column at a time.",
        look: { label: "One column at a time", icon: "step", on: !!a },
        gestures: { tap: a ? [{ kind: "remove_rule", rule: a.id }] : [{ kind: "add_rule", rule: { kind: "path", from: "any", noSkip: !0 } }] }
      });
    }
  }
  if (k === "time") {
    const a = o.kind === "hiring-plan" ? "Hires" : "Tasks", i = L.find((n) => n.kind === "snap"), e = i?.unit;
    if (m({
      id: "snap",
      primitive: "snap",
      anchor: { kind: "axis" },
      state: { value: e ?? null, sentence: e ? a + " snap to whole " + e + "s" : a + " do not snap", ...i && { ruleId: i.id } },
      label: (e ? a + " snap to whole " + e + "s" : a + " do not snap") + ". Press for " + (e === "day" ? "whole weeks" : e === "week" ? "no snap" : "whole days") + ".",
      look: { label: "Snap: " + (e === "day" ? "Day" : e === "week" ? "Week" : "Off"), icon: "snap", on: !!e },
      gestures: { tap: i ? e === "day" ? [{ kind: "set_rule", rule: i.id, unit: "week" }] : [{ kind: "remove_rule", rule: i.id }] : [{ kind: "add_rule", rule: { kind: "snap", unit: "day" } }] }
    }), o.kind === "launch-plan") {
      const n = L.find((h) => h.kind === "deadline"), c = n?.severity === "warn", t = o.launch?.name === "go-live" ? "Go-live" : "Launch day";
      m({
        id: "deadline",
        primitive: "deadline",
        anchor: { kind: "axis" },
        state: { value: n ? c ? "soft" : "hard" : null, sentence: n ? t + " is a " + (c ? "soft" : "hard") + " line" : t + " has no rule yet", ...n && { ruleId: n.id } },
        label: n ? t + " is a " + (c ? "soft" : "hard") + " line. Press to make it " + (c ? "hard" : "soft") + "." : "Make " + t.toLowerCase() + " a hard line.",
        look: { label: n ? c ? "Soft line" : "Hard line" : "Line: none", icon: "flag", on: !!n, warn: c },
        gestures: {
          tap: n ? [{ kind: "set_rule", rule: n.id, severity: c ? "refuse" : "warn" }] : [{ kind: "add_rule", rule: { kind: "deadline", at: "launch" } }],
          ...n && { remove: [{ kind: "remove_rule", rule: n.id }] }
        }
      });
      const d = L.find((h) => h.kind === "cascade"), p = d?.onConflict;
      m({
        id: "cascade",
        primitive: "cascade",
        anchor: { kind: "board" },
        state: { value: p ?? null, sentence: p ? "A slip " + (p === "stop" ? "stops at" : "pushes") + " the tasks that wait on it" : "A slip does what the plan does by itself", ...d && { ruleId: d.id } },
        label: (p ? "A slip " + (p === "stop" ? "stops at" : "pushes") + " what waits on it" : "No rule for a slip") + ". Press for " + (p === "push" ? "stop" : p === "stop" ? "no rule" : "push") + ".",
        look: { label: "A slip: " + (p === "push" ? "pushes" : p === "stop" ? "stops" : "no rule"), icon: "push", on: !!p },
        gestures: { tap: d ? p === "push" ? [{ kind: "set_rule", rule: d.id, onConflict: "stop" }] : [{ kind: "remove_rule", rule: d.id }] : [{ kind: "add_rule", rule: { kind: "cascade", onConflict: "push" } }] }
      });
    }
  }
  if (k === "nest") {
    const a = o.nest?.layout;
    if (a !== "matrix") {
      const t = L.find((y) => y.kind === "depth"), d = t ? t.max : null, p = d ?? U, h = -44 * l, w = 8 * l, $ = le * l, C = w + (p - 1) * $, S = (y) => {
        const B = Math.round((C + y - w) / $) + 1;
        return B > U ? null : Y(B, 1, U);
      }, P = (y) => y === null ? "Cards nest as deep as they like" : y === 1 ? "Cards nest one level deep" : "Cards nest up to " + y + " levels deep", b = (y) => y === d ? [] : y === null ? [{ kind: "remove_rule", rule: t.id }] : t ? [{ kind: "set_rule", rule: t.id, max: y }] : [{ kind: "add_rule", rule: { kind: "depth", max: y } }];
      M.push({
        id: "depth",
        primitive: "depth",
        anchor: { kind: "board" },
        hit: O(h, C, r, r),
        state: { value: d, sentence: P(d), ...t && { ruleId: t.id } },
        label: P(d) + ". Drag the ladder, or press the up and down arrows, to change it" + (t ? "; Delete removes it" : "") + ".",
        look: { shape: "ladder", rungs: U, lit: p, on: !!t, y: w, x1: h, rungGap: $, label: d === null ? "any depth" : d + (d === 1 ? " level" : " levels") },
        gestures: { drag: ({ dy: y }) => b(S(y)), preview: ({ dy: y }) => P(S(y)), step: $, axis: "y", ...t && { remove: b(null) } }
      });
    }
    const i = L.find((t) => t.kind === "children" && !t.role), e = i ? i.max : null, n = Math.max(1, ...o.cards.map((t) => o.cards.filter((d) => d.parentId === t.id).length)), c = e === null ? "A card holds any number under it" : "A card holds at most " + e + " under it";
    if (m({
      id: "children",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: e, sentence: c, ...i && { ruleId: i.id } },
      label: c + ". Press to " + (i ? "remove the limit." : "give cards a limit of " + Math.min(z, Math.max(n, 3)) + "."),
      look: { label: e === null ? "Holds: any" : "Holds " + e, icon: "holds", on: !!i },
      gestures: { tap: i ? [{ kind: "remove_rule", rule: i.id }] : [{ kind: "add_rule", rule: { kind: "children", max: Math.min(z, Math.max(n, 3)) } }] }
    }), i && m({
      id: "children-minus",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: e, sentence: c },
      label: e === null ? "No limit on how many a card holds" : e <= 1 ? "Remove the limit on how many a card holds" : "A card holds one fewer",
      look: { shape: "step", icon: "minus", on: !!i },
      gestures: { tap: e <= 1 ? [{ kind: "remove_rule", rule: i.id }] : [{ kind: "set_rule", rule: i.id, max: e - 1 }] }
    }), i && e < z && m({
      id: "children-plus",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: e, sentence: c },
      label: "A card holds one more",
      look: { shape: "step", icon: "plus", on: !0 },
      gestures: { tap: [{ kind: "set_rule", rule: i.id, max: e + 1 }] }
    }), a === "clusters") {
      const t = L.find((y) => y.kind === "emptyDrop"), d = t?.drop, p = o.lanes[1]?.label ?? "Unsorted";
      m({
        id: "empty-drop",
        primitive: "emptyDrop",
        anchor: { kind: "board" },
        state: { value: d ?? null, sentence: d === "unsorted" ? "A card let go in empty space goes to " + p : "A card let go in empty space starts a new pile", ...t && { ruleId: t.id } },
        label: "Where a card let go in empty space goes: " + (d === "unsorted" ? p : d === "new-pile" ? "a new pile" : "a new pile (no rule)") + ". Press to change it.",
        look: { label: "Far drop: " + (d === "unsorted" ? p : d === "new-pile" ? "new pile" : "no rule"), icon: "drop", on: !!t },
        gestures: { tap: t ? d === "unsorted" ? [{ kind: "set_rule", rule: t.id, drop: "new-pile" }] : [{ kind: "remove_rule", rule: t.id }] : [{ kind: "add_rule", rule: { kind: "emptyDrop", drop: "unsorted" } }] }
      });
      const h = L.find((y) => y.kind === "rank"), w = h?.by, $ = (o.nest?.fields ?? []).filter((y) => !y.flag).map((y) => ({ id: y.id, label: y.label })), C = [{ id: "count", label: "count" }, { id: "sources", label: "customers" }, ...$], S = w ? C.findIndex((y) => y.id === w) : -1, P = C[S + 1], b = (y) => C.find((B) => B.id === y)?.label ?? y ?? "";
      m({
        id: "rank",
        primitive: "rank",
        anchor: { kind: "board" },
        state: { value: w ?? null, sentence: w ? "Piles rank by " + b(w) : "Piles keep their order", ...h && { ruleId: h.id } },
        label: (w ? "Piles rank by " + b(w) : "Piles keep their order") + ". Press for " + (P ? "rank by " + P.label : "no ranking") + ".",
        look: { label: "Rank: " + (w ? b(w) : "off"), icon: "rank", on: !!h },
        gestures: { tap: h ? P ? [{ kind: "set_rule", rule: h.id, by: P.id }] : [{ kind: "remove_rule", rule: h.id }] : [{ kind: "add_rule", rule: { kind: "rank", by: "count" } }] }
      });
    }
  }
  const { rail: _, swatches: A } = oe(o, s.map((a) => a.laneId)), D = k === "pipeline";
  for (const a of _) m({ id: a.id, primitive: "look", anchor: { kind: "board" }, state: { value: a.on, sentence: a.label }, label: a.said, look: { label: a.label, on: a.on }, gestures: { tap: [a.edit] } });
  for (const a of A) {
    const { x: i, y: e, width: n } = s.find((c) => c.laneId === a.key);
    M.push({
      id: "color:" + a.key,
      primitive: "look",
      anchor: { kind: "lane", id: a.key },
      hit: O(D ? i + n / 2 : i + Math.min(X, n) - r / 2 - 2 * l, D ? e + 30 * l : e + r / 2 + 2 * l, r, r),
      state: { value: a.now, sentence: a.sentence },
      label: a.said,
      look: { shape: "badge", on: !!a.now, swatch: a.swatch },
      gestures: { tap: [a.edit] }
    });
  }
  return M;
}
const ge = ["add_rule", "set_rule", "remove_rule", "set_lane_capacity", "add_lane", "set_appearance"], te = "http://www.w3.org/2000/svg", v = {
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
}, he = "var(--slatebox-board-font, system-ui, sans-serif)", Q = (o) => /var\([^,]+,\s*([^)]+)\)/.exec(o)?.[1].trim() ?? o;
function I(o, f, g) {
  const k = document.createElementNS(te, o);
  for (const [l, r] of Object.entries(f)) k.setAttribute(l, String(r));
  return g?.fill && (k.setAttribute("fill", Q(g.fill)), k.style.setProperty("fill", g.fill)), g?.stroke && (k.setAttribute("stroke", Q(g.stroke)), k.style.setProperty("stroke", g.stroke)), k;
}
function Z(o, f, g, k, l) {
  const r = {
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
  if (!o || !r[o]) return null;
  const u = k / 12;
  return I("path", {
    d: r[o],
    transform: `translate(${f} ${g}) scale(${u})`,
    fill: "none",
    "stroke-width": 1.7,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "vector-effect": "non-scaling-stroke",
    "pointer-events": "none"
  }, { stroke: l });
}
function R(o, f, g, k, l, r = "start", u = !1, s = !1) {
  const M = I("text", {
    x: o,
    y: f,
    "font-size": k,
    "text-anchor": r,
    "font-family": "system-ui, sans-serif",
    "pointer-events": "none",
    ...u ? { "font-weight": 600 } : {},
    ...s ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
  }, { fill: l, ...s ? { stroke: v.halo } : {} });
  return M.style.setProperty("font-family", he), M.textContent = g, M;
}
const F = (o, f, g, k, l) => `M${o + l},${f} H${o + g - l} A${l},${l} 0 0 1 ${o + g},${f + l} V${f + k - l} A${l},${l} 0 0 1 ${o + g - l},${f + k} H${o + l} A${l},${l} 0 0 1 ${o},${f + k - l} V${f + l} A${l},${l} 0 0 1 ${o + l},${f} Z`;
function pe(o) {
  const f = o.label.split(/\.\s/)[0].replace(/\.$/, "").replace(/\s*\([^)]*\)/g, "");
  return f.length > 42 ? f.slice(0, 41).replace(/\s+\S*$/, "") + "…" : f;
}
function fe(o, f, g, k) {
  const l = I("g", { "pointer-events": "none" }), { hit: r, look: u } = o, s = r.height / 44, M = r.x + r.width / 2, L = r.y + r.height / 2, E = u.warn ? v.warn : v.line;
  if (u.shape === "line") {
    const x = (u.y ?? L) + f.dy;
    l.appendChild(I("line", {
      x1: u.x1 ?? r.x,
      x2: u.x2 ?? r.x + r.width,
      y1: x,
      y2: x,
      "stroke-width": u.on ? 2.5 : 1.5,
      "stroke-dasharray": u.on ? "8 5" : "3 5",
      "stroke-linecap": "round",
      ...u.on ? {} : { opacity: 0.7 }
    }, { stroke: u.on ? E : v.offLine }));
    const m = g ?? u.label ?? "", _ = Math.max(84 * s, (m.length * 13 * 0.56 + 40) * s), A = 26 * s;
    l.appendChild(I("path", { d: F(M - _ / 2, x - A / 2, _, A, A / 2), "stroke-width": 1.5 }, { fill: u.on ? v.off : v.chip, stroke: u.on ? E : v.offLine })), l.appendChild(I("path", {
      d: `M${M - _ / 2 + 10 * s} ${x - 2 * s} l${4 * s} ${-4 * s} l${4 * s} ${4 * s} M${M - _ / 2 + 10 * s} ${x + 2 * s} l${4 * s} ${4 * s} l${4 * s} ${-4 * s}`,
      fill: "none",
      "stroke-width": 1.6,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, { stroke: u.on ? E : v.ink })), l.appendChild(R(M + 8 * s, x + 4.5 * s, k ? "Saving…" : m, 13 * s, (u.on, v.ink), "middle", !!u.on));
  } else if (u.shape === "chip") {
    const x = 30 * s, m = L - x / 2;
    l.appendChild(I(
      "path",
      { d: F(r.x, m, r.width, x, x / 2), "stroke-width": 1.2, ...u.warn ? { "stroke-dasharray": "3 3" } : {} },
      { fill: u.on ? v.on : v.chip, stroke: u.on ? v.on : v.offLine }
    ));
    const _ = u.on ? v.onInk : v.ink, A = Z(u.icon, r.x + 12 * s, L - 6.5 * s, 13 * s, _);
    A && l.appendChild(A), l.appendChild(R(r.x + (A ? 32 : 14) * s, L + 4.5 * s, k ? "Saving…" : u.label ?? "", 13 * s, _, "start", !!u.on));
  } else if (u.shape === "badge" || u.shape === "step") {
    const x = (u.shape === "step" ? 13 : 15) * s, m = u.shape === "badge" ? !!u.on : !1;
    l.appendChild(I(
      "circle",
      { cx: M, cy: L, r: x, "stroke-width": 1.4, ...u.shape === "badge" && !u.on ? { "stroke-dasharray": "3 3" } : {} },
      { fill: u.swatch ?? (m ? v.on : v.off), stroke: u.swatch ? v.ink : m ? v.on : u.shape === "step" && u.on ? E : v.offLine }
    ));
    const _ = Z(u.icon, M - 7 * s, L - 7 * s, 14 * s, m ? v.onInk : u.on || u.shape === "step" ? v.ink : v.offLine);
    _ && l.appendChild(_), k && l.appendChild(I("circle", { cx: M, cy: L, r: x + 3 * s, fill: "none", "stroke-width": 2, "stroke-dasharray": "4 4" }, { stroke: v.line }));
  } else if (u.shape === "ghost") {
    const x = Math.min(s, r.width / 64);
    l.appendChild(I("path", { d: F(r.x, r.y, r.width, r.height, 10 * x), "stroke-width": 1.6, "stroke-dasharray": "6 5" }, { fill: "none", stroke: v.ghost }));
    const m = Z("plus", M - 9 * x, L - 16 * x, 18 * x, v.ink);
    m && l.appendChild(m), l.appendChild(R(M, L + 18 * x, k ? "Adding…" : "Column", 12 * x, v.ink, "middle"));
  } else if (u.shape === "ladder") {
    const x = u.x1 ?? M, m = u.y ?? r.y, _ = u.rungGap ?? 30 * s, A = u.rungs ?? 6, D = Math.max(1, Math.min(A, Math.round((u.lit ?? A) + f.dy / _))), a = m + (A - 1) * _;
    for (const n of [-10 * s, 10 * s]) l.appendChild(I("line", { x1: x + n, x2: x + n, y1: m - 6 * s, y2: a + 6 * s, "stroke-width": 1.5 }, { stroke: v.offLine }));
    for (let n = 0; n < A; n++) {
      const c = n < D && (u.on || f.dy !== 0);
      l.appendChild(I("line", { x1: x - 10 * s, x2: x + 10 * s, y1: m + n * _, y2: m + n * _, "stroke-width": c ? 3 : 1.5, "stroke-linecap": "round" }, { stroke: c ? E : v.offLine }));
    }
    const i = m + (D - 1) * _, e = g ?? u.label ?? "";
    l.appendChild(I("circle", { cx: x, cy: i, r: 12 * s, "stroke-width": 1.6 }, { fill: v.off, stroke: u.on ? E : v.ink })), l.appendChild(I("path", { d: `M${x - 4 * s} ${i - 1 * s} l${4 * s} ${-4 * s} l${4 * s} ${4 * s} M${x - 4 * s} ${i + 1 * s} l${4 * s} ${4 * s} l${4 * s} ${-4 * s}`, fill: "none", "stroke-width": 1.5 }, { stroke: v.ink })), l.appendChild(R(x, m - 16 * s, k ? "Saving…" : "Depth", 12 * s, v.ink, "middle", !0, !0)), (g || f.dy) && l.appendChild(R(x + 18 * s, i + 4 * s, e, 12 * s, v.ink, "start", !0, !0));
  }
  return l;
}
function ke(o, f, g, k = {}) {
  const l = o?.canvas?.node;
  if (!l || typeof document > "u") return { update() {
  }, remove() {
  } };
  const r = document.createElementNS(te, "g");
  r.setAttribute("data-rule-controls", ""), r.setAttribute("data-board-scope", f), r.setAttribute("role", "group"), r.setAttribute("aria-label", "How this board behaves: controls");
  let u = g, s = k.origin ?? { x: 0, y: 0 }, M = !1, L = null, E = null, x, m = null;
  const _ = (i) => {
    const e = r.getScreenCTM?.();
    if (!e || typeof l.createSVGPoint != "function") return { x: i.clientX, y: i.clientY };
    const n = l.createSVGPoint();
    n.x = i.clientX, n.y = i.clientY;
    const c = n.matrixTransform(e.inverse());
    return { x: c.x, y: c.y };
  };
  async function A(i, e, n) {
    if (!e?.length || L || M) return;
    L = i.id, D();
    let c = !1;
    try {
      c = !!await k.onRuleEdit?.(e, n);
    } catch {
      c = !1;
    }
    if (L = null, M) return;
    E = { id: i.id, ok: c, until: Date.now() + 2e3 }, clearTimeout(x), x = setTimeout(() => {
      E = null, D();
    }, 2e3), D();
    const t = u.find((d) => d.id === i.id);
    k.announce?.(c ? (t?.state.sentence ?? n) + "." : "Not changed.");
  }
  function D() {
    if (M) return;
    const i = document.activeElement, e = i && r.contains(i) ? i.getAttribute("data-rule-control") : null;
    for (; r.firstChild; ) r.removeChild(r.firstChild);
    r.setAttribute("transform", `translate(${s.x} ${s.y})`);
    for (const n of u) {
      const c = m?.control.id === n.id && m.moved, t = c ? m.delta : { dx: 0, dy: 0 }, d = c ? n.gestures.preview?.(t) ?? null : null, p = I("g", {
        "data-rule-control": n.id,
        "data-primitive": n.primitive,
        role: n.gestures.drag ? "slider" : "button",
        tabindex: 0,
        "aria-label": n.label,
        ...n.look.on !== void 0 && !n.gestures.drag ? { "aria-pressed": String(!!n.look.on) } : {},
        ...n.gestures.drag ? { "aria-valuetext": n.state.sentence } : {},
        cursor: n.gestures.drag ? n.gestures.axis === "x" ? "ew-resize" : "ns-resize" : "pointer"
      });
      p.style.setProperty("outline", "none"), p.appendChild(fe(n, t, d, L === n.id));
      const { hit: h } = n, w = I("rect", {
        x: h.x,
        y: h.y + (n.look.shape === "line" || n.look.shape === "ladder" ? t.dy : 0),
        width: h.width,
        height: h.height,
        rx: Math.min(h.width, h.height) / 2,
        "pointer-events": "all",
        "data-rule-hit": ""
      }, { fill: "transparent" });
      w.style.setProperty("touch-action", "none"), p.appendChild(w);
      const $ = I("rect", {
        x: h.x - 3,
        y: h.y - 3 + (n.look.shape === "line" ? t.dy : 0),
        width: h.width + 6,
        height: h.height + 6,
        rx: Math.min(h.width, h.height) / 2 + 3,
        fill: "none",
        "stroke-width": 2.5,
        "pointer-events": "none",
        "data-rule-focus": "",
        opacity: 0
      }, { stroke: v.line });
      p.appendChild($);
      const C = I("title", {});
      C.textContent = n.label, p.appendChild(C);
      const S = n.look.shape === "line" || n.look.shape === "ladder" ? null : R(h.x + h.width / 2, h.y - 8 * (Math.min(h.width, h.height) / 44), pe(n), 12 * (Math.min(h.width, h.height) / 44), v.ink, "middle", !0, !0);
      S && (S.setAttribute("opacity", "0"), S.setAttribute("data-rule-hint", ""), p.appendChild(S));
      const P = (b) => S?.setAttribute("opacity", b ? "1" : "0");
      if (p.addEventListener("focus", () => {
        $.setAttribute("opacity", "1"), P(!0);
      }), p.addEventListener("blur", () => {
        $.setAttribute("opacity", "0"), P(!1);
      }), p.addEventListener("pointerenter", () => P(!0)), p.addEventListener("pointerleave", () => {
        document.activeElement !== p && P(!1);
      }), a(p, n), E?.id === n.id && E.until > Date.now()) {
        const b = E.ok ? n.state.sentence : "Not changed";
        p.appendChild(R(h.x + h.width / 2, h.y - 8 * (h.height / 44), b, 13 * (h.height / 44), E.ok ? v.line : v.refuse, "middle", !0, !0)), p.setAttribute("data-rule-flash", b);
      }
      r.appendChild(p);
    }
    l.lastChild !== r && l.appendChild(r), e && r.querySelector(`[data-rule-control="${CSS.escape ? CSS.escape(e) : e}"]`)?.focus({ preventScroll: !0 });
  }
  function a(i, e) {
    const n = (c) => c.stopPropagation();
    i.addEventListener("mousedown", n), i.addEventListener("touchstart", n, { passive: !0 }), i.addEventListener("dblclick", (c) => {
      c.stopPropagation(), c.preventDefault();
    }), i.addEventListener("pointerdown", (c) => {
      if (c.stopPropagation(), c.preventDefault(), L || m) return;
      const t = { control: e, start: _(c), delta: { dx: 0, dy: 0 }, moved: !1, holdDone: !1, pointerId: c.pointerId };
      m = t;
      const d = (h) => {
        if (m !== t || h.pointerId !== t.pointerId) return;
        const w = _(h), $ = { dx: w.x - t.start.x, dy: w.y - t.start.y };
        !t.moved && Math.hypot($.dx, $.dy) < 5 || t.control.gestures.drag && (h.preventDefault(), t.moved = !0, clearTimeout(t.holdTimer), t.delta = t.control.gestures.axis === "x" ? { dx: $.dx, dy: 0 } : { dx: 0, dy: $.dy }, D());
      }, p = (h) => {
        if (h.pointerId !== t.pointerId || (window.removeEventListener("pointermove", d, !0), window.removeEventListener("pointerup", p, !0), window.removeEventListener("pointercancel", p, !0), m !== t)) return;
        m = null, clearTimeout(t.holdTimer);
        const w = t.control;
        if (h.type === "pointercancel" || t.holdDone) {
          D();
          return;
        }
        if (h.stopPropagation(), t.moved && w.gestures.drag) {
          const $ = w.gestures.preview?.(t.delta) ?? w.label, C = w.gestures.drag(t.delta);
          D(), A(w, C, $);
        } else w.gestures.tap ? A(w, w.gestures.tap, w.label) : D();
      };
      window.addEventListener("pointermove", d, !0), window.addEventListener("pointerup", p, !0), window.addEventListener("pointercancel", p, !0), e.gestures.hold && (t.holdTimer = setTimeout(() => {
        m !== t || t.moved || (t.holdDone = !0, A(t.control, t.control.gestures.hold, t.control.label));
      }, 550));
    }), i.addEventListener("click", n), i.addEventListener("contextmenu", (c) => {
      c.preventDefault(), c.stopPropagation(), e.gestures.hold && A(e, e.gestures.hold, e.label);
    }), i.addEventListener("keydown", (c) => {
      const t = c.key, { gestures: d } = e;
      let p;
      if ((t === "Enter" || t === " ") && c.shiftKey && d.hold) p = d.hold;
      else if (t === "Enter" || t === " ") p = d.tap;
      else if ((t === "Delete" || t === "Backspace") && d.remove) p = d.remove;
      else if (d.drag && d.step && /^Arrow(Up|Down|Left|Right)$/.test(t)) {
        const h = t === "ArrowUp" || t === "ArrowLeft" ? -1 : 1;
        p = d.drag(d.axis === "x" ? { dx: h * d.step, dy: 0 } : { dx: 0, dy: h * d.step });
      } else return;
      c.preventDefault(), c.stopPropagation(), A(e, p, e.label);
    });
  }
  return D(), {
    update(i, e) {
      M || (u = i, e && (s = e), m && !i.some((n) => n.id === m.control.id) ? m = null : m && (m = { ...m, control: i.find((n) => n.id === m.control.id) }), D());
    },
    remove() {
      M = !0, clearTimeout(x), m && clearTimeout(m.holdTimer), r.remove();
    }
  };
}
ae({ controls: ce, draw: ke });
export {
  ge as RULE_CONTROL_EDITS,
  v as controlInk,
  ke as drawRuleControls,
  pe as hintOf,
  ce as ruleControls,
  se as ruleControlsFamily
};
