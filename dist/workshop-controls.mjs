import { appearanceChips as Me, H as we, a as Y, b as ne, workshopLaneHeader as Le, L as Ce, c as Ae, registerRuleControls as _e } from "./workshop-model.mjs";
import { r as Xe } from "./workshop-model.mjs";
const oe = 98, z = 88, ce = 228, re = 24, ke = 5, de = 6, he = 40, $e = 30;
function Ee(i) {
  return i.kind === "pipeline" ? "pipeline" : i.kind === "launch-plan" || i.kind === "hiring-plan" ? "time" : i.kind === "nest" ? "nest" : i.kind || i.experience || i.lanes.some((u) => u.station) ? null : "lanes";
}
const xe = (i) => i.behaviour?.rules ?? [], Be = (i, u) => i.lanes.find((p) => p.id === u)?.label ?? u, le = (i, u) => i.cards.filter((p) => p.laneId === u).length, ue = (i, u, p) => Math.max(u, Math.min(p, i)), R = (i, u, p, k) => ({ x: Math.round(i - p / 2), y: Math.round(u - k / 2), width: Math.round(p), height: Math.round(k) }), me = (i, u, p = !0) => Math.ceil((i.length * 13 * 0.55 + (p ? 22 : 0) + 24) * u);
function be(i, u) {
  const p = xe(i).find((k) => k.kind === "capacity" && k.where === u.id);
  return p ? { max: p.max, rule: p } : u.capacity !== void 0 ? { max: u.capacity } : null;
}
function ae(i, u, p) {
  const k = be(i, u);
  return (k?.max ?? null) === p ? [] : k?.rule ? p === null ? [{ kind: "remove_rule", rule: k.rule.id }] : [{ kind: "set_rule", rule: k.rule.id, max: p }] : k || !i.behaviour ? [{ kind: "set_lane_capacity", lane: { id: u.id }, capacity: p }] : p === null ? [] : [{ kind: "add_rule", rule: { kind: "capacity", where: u.id, max: p } }];
}
const Ie = (i, u, p = !1) => u === null ? i + " holds any number of cards" : i + " holds " + u + (p ? " (a warning only)" : "");
function ge(i, u, p) {
  const k = u === "lanes" && !p.label ? Le(i, p) : null, a = p.label ?? k?.label ?? { x: p.x + 6, y: p.y + 6, width: Math.min(ce, p.width - 12) - we, height: Ce }, h = p.value ?? k?.value, f = Math.max(a.y + a.height, p.caption ? p.caption.y + p.caption.height : -1 / 0) + ne;
  return { label: a, value: h, strip: f, below: (u === "lanes" || u === "pipeline" ? f + Y : a.y + a.height) + 14 };
}
function Se(i, u, p = {}) {
  const k = Ee(i);
  if (!k) return [];
  const a = ue(p.scale ?? 1, 1, 3), h = 44 * a, f = { width: u?.width ?? i.lanes.length * 244, height: u?.height ?? oe + z }, r = u?.places ?? [], L = [], C = xe(i);
  let P = 0;
  const x = f.height + 18 * a, m = (n) => {
    const o = n.look.label ?? "", e = n.look.shape ?? "chip", s = e === "step" ? h : Math.max(h, me(o, a, !!n.look.icon));
    L.push({ ...n, look: { ...n.look, shape: e }, hit: { x: Math.round(P), y: Math.round(x), width: s, height: Math.round(h) } }), P += s + 8 * a;
  }, { rail: $, swatches: E } = Me(i, r.map((n) => n.laneId)), D = (n) => {
    const o = E.find((y) => y.key === n), e = r.find((y) => y.laneId === n);
    if (!o || !e) return null;
    const s = ge(i, k, e), t = s.label.x + s.label.width + ne + Y / 2;
    if (t + Y / 2 > e.x + e.width + 0.5) return null;
    const l = i.lanes.find((y) => y.id === n)?.label ?? o.sentence.split(":")[0], d = o.now ?? "own", v = o.edit.color;
    let c = s.label.y + s.label.height / 2;
    for (const y of [e.caption, s.value]) y && Ae(R(t, c, Y, Y), y) && (c = Math.max(e.y + Y / 2, y.y - Y / 2));
    const g = R(t, c, Y, Y);
    return {
      id: "color:" + o.key,
      primitive: "look",
      anchor: { kind: "lane", id: o.key },
      hit: g,
      group: l,
      state: { value: o.now, sentence: o.sentence },
      label: l + " color: " + d + ". Press for " + (v && v !== "none" ? v : "its own color") + ".",
      hint: "Change color (now: " + d + ")",
      hintAt: { x: g.x + g.width / 2, y: s.below },
      hintBounds: { left: e.x + 4, right: e.x + (k === "lanes" ? Math.min(ce, e.width) : e.width) - 4 },
      look: { shape: "badge", icon: "color", swatch: o.swatch },
      gestures: { tap: [o.edit] }
    };
  }, F = /* @__PURE__ */ new Set();
  if (k === "lanes" || k === "pipeline") {
    for (const n of i.lanes) {
      const o = r.find((M) => M.laneId === n.id);
      if (!o) continue;
      const e = be(i, n), s = e?.rule?.severity === "warn", t = C.some((M) => M.kind === "bin" && M.lane === n.id), l = n.label, d = Ie(l, e?.max ?? null, s), v = k === "lanes" ? Math.min(ce, o.width) : o.width, c = ge(i, k, o), g = Y, y = c.strip + g / 2, A = Math.max(c.label.x + c.label.width + we, o.x + v - 6), G = (M) => ({ x: M.x + M.width / 2, y: c.below }), H = { left: o.x + 4, right: o.x + v - 4 }, B = (M) => L.push({ ...M, group: l, hintAt: G(M.hit), hintBounds: H }), b = D(n.id);
      if (b && (L.push(b), F.add(n.id)), k === "lanes") {
        const M = C.find((S) => S.kind === "bin" && S.lane === n.id);
        B({
          id: "bin:" + n.id,
          primitive: "bin",
          anchor: { kind: "lane", id: n.id },
          hit: R(c.label.x + g / 2, y, g, g),
          pressed: !!M,
          state: { value: !!M, sentence: M ? l + " is a bin: it archives the cards dropped in it" : l + " is not a bin", ...M && { ruleId: M.id } },
          label: M ? l + " is a bin. Press to make it an ordinary column." : "Make " + l + " a bin that archives cards" + (e ? " (its limit goes)" : "") + ".",
          look: { shape: "badge", icon: "bin", on: !!M },
          gestures: { tap: M ? [{ kind: "remove_rule", rule: M.id }] : [...ae(i, n, null), { kind: "add_rule", rule: { kind: "bin", lane: n.id } }] }
        });
      } else if (n.role === "won")
        B({
          id: "gate:" + n.id,
          primitive: "gate",
          anchor: { kind: "lane", id: n.id },
          hit: R(c.label.x + g / 2, y, g, g),
          pressed: !0,
          disabled: !0,
          state: { value: !0, sentence: l + " needs an amount" },
          label: l + " needs an amount. Every pipeline asks a won deal for one, so this stays on.",
          hint: "Always needs an amount",
          look: { shape: "badge", icon: "gate", on: !0 },
          gestures: {}
        });
      else if (!n.role) {
        const M = C.find((S) => S.kind === "gate" && S.into === n.id);
        B({
          id: "gate:" + n.id,
          primitive: "gate",
          anchor: { kind: "lane", id: n.id },
          hit: R(c.label.x + g / 2, y, g, g),
          pressed: !!M,
          state: { value: !!M, sentence: M ? l + " needs an amount" : l + " takes any deal", ...M && { ruleId: M.id } },
          label: M ? l + " needs an amount. Press to let any deal in." : "Make " + l + " need an amount.",
          look: { shape: "badge", icon: "gate", on: !!M },
          gestures: { tap: M ? [{ kind: "remove_rule", rule: M.id }] : [{ kind: "add_rule", rule: { kind: "gate", into: n.id, needs: ["amount"] } }] }
        });
      }
      const O = e?.rule ? [{ kind: "set_rule", rule: e.rule.id, severity: s ? "refuse" : "warn" }] : void 0, K = e && !e.rule ? Math.max(1, le(i, n.id)) : 1, q = e ? e.max <= 1 ? null : e.max - 1 : null, Q = e ? Math.min(re, e.max + 1) : Math.max(1, le(i, n.id)), J = k === "pipeline" ? "deal" : "card", T = !c.value && !t ? e ? "limit " + e.max : "no limit" : null, U = T ? Math.max(g, me(T, 1, !1)) : 0, ee = T ? R(A - g - ne - U / 2, y, U, g) : null, V = c.value ? c.value.x - ne - g / 2 : ee ? ee.x - ne - g / 2 : A - g * 1.5 - ne, ie = !!(e && q !== null && q < K);
      if (e && !t && B({
        id: "capacity-minus:" + n.id,
        primitive: "capacity",
        anchor: { kind: "lane", id: n.id },
        hit: R(V, y, g, g),
        state: { value: e.max, sentence: d, ...e.rule && { ruleId: e.rule.id } },
        ...ie ? {
          disabled: !0,
          label: l + " holds " + le(i, n.id) + " " + J + "s now, so its limit of " + e.max + " cannot go lower. Move a " + J + " out first.",
          hint: "Holds " + le(i, n.id) + ": cannot go lower",
          look: { shape: "step", icon: "minus", on: !1 },
          gestures: {}
        } : {
          label: e.max <= 1 ? "Remove the limit on " + l : l + ": hold one fewer " + J + " (now " + e.max + ")",
          hint: e.max <= 1 ? "Remove the limit" : "One fewer (now " + e.max + ")",
          look: { shape: "step", icon: "minus", on: !0 },
          gestures: { tap: ae(i, n, q) }
        }
      }), T && ee && B({
        id: "capacity-value:" + n.id,
        primitive: "capacity",
        anchor: { kind: "lane", id: n.id },
        hit: ee,
        state: { value: e?.max ?? null, sentence: d, ...e?.rule && { ruleId: e.rule.id } },
        label: d,
        look: { shape: "value", label: T, on: !!e },
        gestures: {}
      }), !t && (!e || e.max < re) && B({
        id: "capacity-plus:" + n.id,
        primitive: "capacity",
        anchor: { kind: "lane", id: n.id },
        hit: R(A - g / 2, y, g, g),
        state: { value: e?.max ?? null, sentence: d, ...e?.rule && { ruleId: e.rule.id } },
        label: e ? l + ": hold one more " + J + " (now " + e.max + ")" : "Give " + l + " a limit of " + Q,
        hint: e ? "One more (now " + e.max + ")" : "Give it a limit of " + Q,
        look: { shape: "step", icon: "plus", on: !!e },
        gestures: { tap: ae(i, n, Q), ...O && { hold: O } }
      }), k === "lanes" && !t) {
        const M = (N) => o.y + oe + N * z - 6, S = o.y + o.height, W = Math.min(e ? M(e.max) : S - 8 * a, S - 8 * a), te = (N) => {
          const j = W + N;
          return j > Math.max(S, W + z) + z * 0.75 ? null : ue(e ? e.max + Math.round(N / z) : Math.round((j + 6 - o.y - oe) / z), K, re);
        }, I = ({ dy: N }) => {
          const j = te(N);
          return !e && (j === null || j >= Math.max(1, le(i, n.id)) + 1) ? [] : ae(i, n, j);
        }, X = e ? "holds " + e.max : "no limit";
        L.push({
          id: "capacity:" + n.id,
          primitive: "capacity",
          anchor: { kind: "lane", id: n.id },
          group: l,
          pointerOnly: !0,
          // Its hit area stays inside the column (a wrapped row's next column starts just under its foot).
          hit: R(o.x + v / 2, Math.min(W, S - h / 2), Math.max(h * 2.4, 104 * a), h),
          state: { value: e?.max ?? null, sentence: d, ...e?.rule && { ruleId: e.rule.id } },
          label: d + ". Drag the line, or press the up and down arrows, to change it" + (e ? "; Delete removes it" : "") + (O ? "; Shift+Enter makes it " + (s ? "refuse" : "a warning only") : "") + ".",
          look: { shape: "line", label: X, on: !!e, warn: s, x1: o.x + 6, x2: o.x + v - 6, y: W },
          gestures: {
            drag: I,
            step: z,
            axis: "y",
            preview: (N) => {
              const j = te(N.dy);
              return j === null ? "No limit" : "holds " + j;
            },
            ...O && { hold: O },
            ...e && { remove: ae(i, n, null) }
          }
        });
      }
    }
    if (k === "lanes") {
      for (let o = 0; o + 1 < i.lanes.length; o++) {
        const e = i.lanes[o], s = i.lanes[o + 1], t = r.find((A) => A.laneId === e.id), l = r.find((A) => A.laneId === s.id);
        if (!t || !l || (t.row ?? 0) !== (l.row ?? 0)) continue;
        const d = C.find((A) => A.kind === "path" && A.from === e.id && Array.isArray(A.to)), v = !!d?.to.includes(s.id), c = d ? v ? d.to.length === 1 ? [{ kind: "remove_rule", rule: d.id }] : [{ kind: "set_rule", rule: d.id, to: d.to.filter((A) => A !== s.id) }] : d.to.length >= 4 ? [] : [{ kind: "set_rule", rule: d.id, to: [...d.to, s.id] }] : [{ kind: "add_rule", rule: { kind: "path", from: e.id, to: [s.id] } }], g = v ? e.label + " → " + d.to.map((A) => Be(i, A)).join(" or ") + " only" : "Cards move freely between " + e.label + " and " + s.label, y = (t.x + t.width + l.x) / 2;
        L.push({
          id: "path:" + e.id + ">" + s.id,
          primitive: "path",
          anchor: { kind: "edge", id: e.id, to: s.id },
          hit: R(y, t.y + oe + z / 2, h, h),
          pressed: v,
          state: { value: v, sentence: g, ...d && { ruleId: d.id } },
          label: v ? g + ". Press to let cards move freely." : "Make cards in " + e.label + " go only to " + s.label + ".",
          look: { shape: "badge", icon: v ? "oneway" : "twoway", on: v },
          gestures: { tap: c }
        });
      }
      if (i.lanes.length < ke && r.length) {
        const o = r.filter((l) => (l.row ?? 0) === 0), e = o[o.length - 1], s = e.x + Math.min(ce, e.width) + 16 * a;
        L.push({
          id: "add-lane",
          primitive: "addLane",
          anchor: { kind: "board" },
          hit: { x: Math.round(s), y: Math.round(e.y), width: Math.round(Math.max(h, 64 * a)), height: Math.round(Math.max(h, Math.min(e.height, oe + z))) },
          state: { sentence: i.lanes.length + " of " + ke + " columns" },
          label: "Add a column",
          look: { shape: "ghost", icon: "plus" },
          gestures: { tap: [{ kind: "add_lane", label: "New column" }] }
        });
      }
      const n = C.find((o) => o.kind === "path" && o.from === "any" && o.noSkip);
      m({
        id: "path:any",
        primitive: "path",
        anchor: { kind: "board" },
        pressed: !!n,
        state: { value: !!n, sentence: n ? "Cards move one column at a time" : "Cards may skip columns", ...n && { ruleId: n.id } },
        label: n ? "Cards move one column at a time. Press to let them skip columns." : "Make cards move one column at a time.",
        look: { label: "One column at a time", icon: "step", on: !!n },
        gestures: { tap: n ? [{ kind: "remove_rule", rule: n.id }] : [{ kind: "add_rule", rule: { kind: "path", from: "any", noSkip: !0 } }] }
      });
    }
  }
  if (k === "time") {
    const n = i.kind === "hiring-plan" ? "Hires" : "Tasks", o = C.find((s) => s.kind === "snap"), e = o?.unit;
    if (m({
      id: "snap",
      primitive: "snap",
      anchor: { kind: "axis" },
      state: { value: e ?? null, sentence: e ? n + " snap to whole " + e + "s" : n + " do not snap", ...o && { ruleId: o.id } },
      label: (e ? n + " snap to whole " + e + "s" : n + " do not snap") + ". Press for " + (e === "day" ? "whole weeks" : e === "week" ? "no snap" : "whole days") + ".",
      look: { label: "Snap: " + (e === "day" ? "Day" : e === "week" ? "Week" : "Off"), icon: "snap", on: !!e },
      gestures: { tap: o ? e === "day" ? [{ kind: "set_rule", rule: o.id, unit: "week" }] : [{ kind: "remove_rule", rule: o.id }] : [{ kind: "add_rule", rule: { kind: "snap", unit: "day" } }] }
    }), i.kind === "launch-plan") {
      const s = C.find((c) => c.kind === "deadline"), t = s?.severity === "warn", l = i.launch?.name === "go-live" ? "Go-live" : "Launch day";
      m({
        id: "deadline",
        primitive: "deadline",
        anchor: { kind: "axis" },
        state: { value: s ? t ? "soft" : "hard" : null, sentence: s ? l + " is a " + (t ? "soft" : "hard") + " line" : l + " has no rule yet", ...s && { ruleId: s.id } },
        label: s ? l + " is a " + (t ? "soft" : "hard") + " line. Press to make it " + (t ? "hard" : "soft") + "." : "Make " + l.toLowerCase() + " a hard line.",
        look: { label: s ? t ? "Soft line" : "Hard line" : "Line: none", icon: "flag", on: !!s, warn: t },
        gestures: {
          tap: s ? [{ kind: "set_rule", rule: s.id, severity: t ? "refuse" : "warn" }] : [{ kind: "add_rule", rule: { kind: "deadline", at: "launch" } }],
          ...s && { remove: [{ kind: "remove_rule", rule: s.id }] }
        }
      });
      const d = C.find((c) => c.kind === "cascade"), v = d?.onConflict;
      m({
        id: "cascade",
        primitive: "cascade",
        anchor: { kind: "board" },
        state: { value: v ?? null, sentence: v ? "A slip " + (v === "stop" ? "stops at" : "pushes") + " the tasks that wait on it" : "A slip does what the plan does by itself", ...d && { ruleId: d.id } },
        label: (v ? "A slip " + (v === "stop" ? "stops at" : "pushes") + " what waits on it" : "No rule for a slip") + ". Press for " + (v === "push" ? "stop" : v === "stop" ? "no rule" : "push") + ".",
        look: { label: "A slip: " + (v === "push" ? "pushes" : v === "stop" ? "stops" : "no rule"), icon: "push", on: !!v },
        gestures: { tap: d ? v === "push" ? [{ kind: "set_rule", rule: d.id, onConflict: "stop" }] : [{ kind: "remove_rule", rule: d.id }] : [{ kind: "add_rule", rule: { kind: "cascade", onConflict: "push" } }] }
      });
    }
  }
  if (k === "nest") {
    const n = i.nest?.layout;
    if (n !== "matrix") {
      const l = C.find((b) => b.kind === "depth"), d = l ? l.max : null, v = d ?? de, c = -44 * a, g = 8 * a, y = $e * a, A = g + (v - 1) * y, G = (b) => {
        const O = Math.round((A + b - g) / y) + 1;
        return O > de ? null : ue(O, 1, de);
      }, H = (b) => b === null ? "Cards nest as deep as they like" : b === 1 ? "Cards nest one level deep" : "Cards nest up to " + b + " levels deep", B = (b) => b === d ? [] : b === null ? [{ kind: "remove_rule", rule: l.id }] : l ? [{ kind: "set_rule", rule: l.id, max: b }] : [{ kind: "add_rule", rule: { kind: "depth", max: b } }];
      L.push({
        id: "depth",
        primitive: "depth",
        anchor: { kind: "board" },
        hit: R(c, A, h, h),
        state: { value: d, sentence: H(d), ...l && { ruleId: l.id } },
        label: H(d) + ". Drag the ladder, or press the up and down arrows, to change it" + (l ? "; Delete removes it" : "") + ".",
        look: { shape: "ladder", rungs: de, lit: v, on: !!l, y: g, x1: c, rungGap: y, label: d === null ? "any depth" : d + (d === 1 ? " level" : " levels") },
        gestures: { drag: ({ dy: b }) => B(G(b)), preview: ({ dy: b }) => H(G(b)), step: y, axis: "y", ...l && { remove: B(null) } }
      });
    }
    const o = C.find((l) => l.kind === "children" && !l.role), e = o ? o.max : null, s = Math.max(1, ...i.cards.map((l) => i.cards.filter((d) => d.parentId === l.id).length)), t = e === null ? "A card holds any number under it" : "A card holds at most " + e + " under it";
    if (m({
      id: "children",
      primitive: "children",
      anchor: { kind: "board" },
      pressed: !!o,
      state: { value: e, sentence: t, ...o && { ruleId: o.id } },
      label: t + ". Press to " + (o ? "remove the limit." : "give cards a limit of " + Math.min(he, Math.max(s, 3)) + "."),
      look: { label: e === null ? "Holds: any" : "Holds " + e, icon: "holds", on: !!o },
      gestures: { tap: o ? [{ kind: "remove_rule", rule: o.id }] : [{ kind: "add_rule", rule: { kind: "children", max: Math.min(he, Math.max(s, 3)) } }] }
    }), o && m({
      id: "children-minus",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: e, sentence: t },
      label: e === null ? "No limit on how many a card holds" : e <= 1 ? "Remove the limit on how many a card holds" : "A card holds one fewer",
      look: { shape: "step", icon: "minus", on: !!o },
      gestures: { tap: e <= 1 ? [{ kind: "remove_rule", rule: o.id }] : [{ kind: "set_rule", rule: o.id, max: e - 1 }] }
    }), o && e < he && m({
      id: "children-plus",
      primitive: "children",
      anchor: { kind: "board" },
      state: { value: e, sentence: t },
      label: "A card holds one more",
      look: { shape: "step", icon: "plus", on: !0 },
      gestures: { tap: [{ kind: "set_rule", rule: o.id, max: e + 1 }] }
    }), n === "clusters") {
      const l = C.find((b) => b.kind === "emptyDrop"), d = l?.drop, v = i.lanes[1]?.label ?? "Unsorted";
      m({
        id: "empty-drop",
        primitive: "emptyDrop",
        anchor: { kind: "board" },
        state: { value: d ?? null, sentence: d === "unsorted" ? "A card let go in empty space goes to " + v : "A card let go in empty space starts a new pile", ...l && { ruleId: l.id } },
        label: "Where a card let go in empty space goes: " + (d === "unsorted" ? v : d === "new-pile" ? "a new pile" : "a new pile (no rule)") + ". Press to change it.",
        look: { label: "Far drop: " + (d === "unsorted" ? v : d === "new-pile" ? "new pile" : "no rule"), icon: "drop", on: !!l },
        gestures: { tap: l ? d === "unsorted" ? [{ kind: "set_rule", rule: l.id, drop: "new-pile" }] : [{ kind: "remove_rule", rule: l.id }] : [{ kind: "add_rule", rule: { kind: "emptyDrop", drop: "unsorted" } }] }
      });
      const c = C.find((b) => b.kind === "rank"), g = c?.by, y = (i.nest?.fields ?? []).filter((b) => !b.flag).map((b) => ({ id: b.id, label: b.label })), A = [{ id: "count", label: "count" }, { id: "sources", label: "customers" }, ...y], G = g ? A.findIndex((b) => b.id === g) : -1, H = A[G + 1], B = (b) => A.find((O) => O.id === b)?.label ?? b ?? "";
      m({
        id: "rank",
        primitive: "rank",
        anchor: { kind: "board" },
        state: { value: g ?? null, sentence: g ? "Piles rank by " + B(g) : "Piles keep their order", ...c && { ruleId: c.id } },
        label: (g ? "Piles rank by " + B(g) : "Piles keep their order") + ". Press for " + (H ? "rank by " + H.label : "no ranking") + ".",
        look: { label: "Rank: " + (g ? B(g) : "off"), icon: "rank", on: !!c },
        gestures: { tap: c ? H ? [{ kind: "set_rule", rule: c.id, by: H.id }] : [{ kind: "remove_rule", rule: c.id }] : [{ kind: "add_rule", rule: { kind: "rank", by: "count" } }] }
      });
    }
  }
  for (const n of $) m({ id: n.id, primitive: "look", anchor: { kind: "board" }, pressed: n.on, state: { value: n.on, sentence: n.label }, label: n.said, look: { label: n.label, on: n.on }, gestures: { tap: [n.edit] } });
  for (const n of E) {
    if (F.has(n.key)) continue;
    const o = D(n.key);
    o && L.push(o);
  }
  return L;
}
const Re = ["add_rule", "set_rule", "remove_rule", "set_lane_capacity", "add_lane", "set_appearance"], fe = "http://www.w3.org/2000/svg", Pe = 400, w = {
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
}, De = "var(--slatebox-board-font, system-ui, sans-serif)", ve = (i) => /var\([^,]+,\s*([^)]+)\)/.exec(i)?.[1].trim() ?? i;
function _(i, u, p) {
  const k = document.createElementNS(fe, i);
  for (const [a, h] of Object.entries(u)) k.setAttribute(a, String(h));
  return p?.fill && (k.setAttribute("fill", ve(p.fill)), k.style.setProperty("fill", p.fill)), p?.stroke && (k.setAttribute("stroke", ve(p.stroke)), k.style.setProperty("stroke", p.stroke)), k;
}
function pe(i, u, p, k, a) {
  const h = {
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
    holds: "M6 1 L6 4 M2 7 L2 11 M6 7 L6 11 M10 7 L10 11 M2 7 L10 7 M6 4 L6 7",
    // A drop of paint: the lane's color.
    color: "M6 1.5 C6 1.5 2.5 5.6 2.5 7.8 A3.5 3.5 0 0 0 9.5 7.8 C9.5 5.6 6 1.5 6 1.5 Z"
  };
  if (!i || !h[i]) return null;
  const f = k / 12;
  return _("path", {
    d: h[i],
    transform: `translate(${u} ${p}) scale(${f})`,
    fill: "none",
    "stroke-width": 1.7,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "vector-effect": "non-scaling-stroke",
    "pointer-events": "none"
  }, { stroke: a });
}
function Z(i, u, p, k, a, h = "start", f = !1, r = !1) {
  const L = _("text", {
    x: i,
    y: u,
    "font-size": k,
    "text-anchor": h,
    "font-family": "system-ui, sans-serif",
    "pointer-events": "none",
    ...f ? { "font-weight": 600 } : {},
    ...r ? { "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" } : {}
  }, { fill: a, ...r ? { stroke: w.halo } : {} });
  return L.style.setProperty("font-family", De), L.textContent = p, L;
}
const se = (i, u, p, k, a) => `M${i + a},${u} H${i + p - a} A${a},${a} 0 0 1 ${i + p},${u + a} V${u + k - a} A${a},${a} 0 0 1 ${i + p - a},${u + k} H${i + a} A${a},${a} 0 0 1 ${i},${u + k - a} V${u + a} A${a},${a} 0 0 1 ${i + a},${u} Z`;
function Te(i) {
  if (i.hint) return i.hint.length > 42 ? i.hint.slice(0, 41).replace(/\s+\S*$/, "") + "…" : i.hint;
  const u = i.label.split(/\.\s/)[0].replace(/\.$/, "").replace(/\s*\([^)]*\)/g, "");
  return u.length > 42 ? u.slice(0, 41).replace(/\s+\S*$/, "") + "…" : u;
}
function Oe(i, u) {
  if (i.length <= u) return [i];
  const p = i.lastIndexOf(" ", u), k = p > 0 ? i.slice(0, p + 1) : i.slice(0, u);
  let a = i.slice(k.length);
  return a.length > u && (a = a.slice(0, u - 1).replace(/\s+\S*$/, "") + "…"), [k, a];
}
function ye(i, u, p, k) {
  const a = _("g", { "pointer-events": "none" }), { hit: h, look: f } = i, r = h.height / 44, L = h.x + h.width / 2, C = h.y + h.height / 2, P = f.warn ? w.warn : w.line;
  if (f.shape === "line") {
    const x = (f.y ?? C) + u.dy;
    a.appendChild(_("line", {
      x1: f.x1 ?? h.x,
      x2: f.x2 ?? h.x + h.width,
      y1: x,
      y2: x,
      "stroke-width": f.on ? 2.5 : 1.5,
      "stroke-dasharray": f.on ? "8 5" : "3 5",
      "stroke-linecap": "round",
      ...f.on ? {} : { opacity: 0.7 }
    }, { stroke: f.on ? P : w.offLine }));
    const m = p ?? (i.pointerOnly ? "" : f.label ?? ""), $ = m || k ? Math.max(84 * r, (Math.max(m.length, k ? 7 : 0) * 13 * 0.56 + 40) * r) : 40 * r, E = 26 * r;
    a.appendChild(_("path", { d: se(L - $ / 2, x - E / 2, $, E, E / 2), "stroke-width": 1.5 }, { fill: f.on ? w.off : w.chip, stroke: f.on ? P : w.offLine })), a.appendChild(_("path", {
      d: `M${L - $ / 2 + 10 * r} ${x - 2 * r} l${4 * r} ${-4 * r} l${4 * r} ${4 * r} M${L - $ / 2 + 10 * r} ${x + 2 * r} l${4 * r} ${4 * r} l${4 * r} ${-4 * r}`,
      fill: "none",
      "stroke-width": 1.6,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }, { stroke: f.on ? P : w.ink })), (m || k) && a.appendChild(Z(L + 8 * r, x + 4.5 * r, k ? "Saving…" : m, 13 * r, (f.on, w.ink), "middle", !!f.on));
  } else if (f.shape === "value") {
    const x = Math.min(30, h.height - 8), m = C - x / 2;
    a.appendChild(_("path", { d: se(h.x, m, h.width, x, x / 2), "stroke-width": 1 }, { fill: f.on ? w.off : w.chip, stroke: w.offLine })), a.appendChild(Z(L, C + 4.5, f.label ?? "", 13, w.ink, "middle", !!f.on));
  } else if (f.shape === "chip") {
    const x = 30 * r, m = C - x / 2;
    a.appendChild(_(
      "path",
      { d: se(h.x, m, h.width, x, x / 2), "stroke-width": 1.2, ...f.warn ? { "stroke-dasharray": "3 3" } : {} },
      { fill: f.on ? w.on : w.chip, stroke: f.on ? w.on : w.offLine }
    ));
    const $ = f.on ? w.onInk : w.ink, E = pe(f.icon, h.x + 12 * r, C - 6.5 * r, 13 * r, $);
    E && a.appendChild(E), a.appendChild(Z(h.x + (E ? 32 : 14) * r, C + 4.5 * r, k ? "Saving…" : f.label ?? "", 13 * r, $, "start", !!f.on));
  } else if (f.shape === "badge" || f.shape === "step") {
    const x = (f.shape === "step" ? 13 : 15) * r, m = f.shape === "badge" ? !!f.on : !1;
    a.appendChild(_(
      "circle",
      { cx: L, cy: C, r: x, "stroke-width": 1.4 },
      { fill: f.swatch ?? (m ? w.on : w.off), stroke: f.swatch ? w.ink : m ? w.on : f.shape === "step" && f.on ? P : w.offLine }
    ));
    const $ = pe(f.icon, L - 7 * r, C - 7 * r, 14 * r, m ? w.onInk : w.ink);
    $ && a.appendChild($), k && a.appendChild(_("circle", { cx: L, cy: C, r: x + 3 * r, fill: "none", "stroke-width": 2, "stroke-dasharray": "4 4" }, { stroke: w.line }));
  } else if (f.shape === "ghost") {
    const x = Math.min(r, h.width / 64);
    a.appendChild(_("path", { d: se(h.x, h.y, h.width, h.height, 10 * x), "stroke-width": 1.6, "stroke-dasharray": "6 5" }, { fill: "none", stroke: w.ghost }));
    const m = pe("plus", L - 9 * x, C - 16 * x, 18 * x, w.ink);
    m && a.appendChild(m), a.appendChild(Z(L, C + 18 * x, k ? "Adding…" : "Column", 12 * x, w.ink, "middle"));
  } else if (f.shape === "ladder") {
    const x = f.x1 ?? L, m = f.y ?? h.y, $ = f.rungGap ?? 30 * r, E = f.rungs ?? 6, D = Math.max(1, Math.min(E, Math.round((f.lit ?? E) + u.dy / $))), F = m + (E - 1) * $;
    for (const e of [-10 * r, 10 * r]) a.appendChild(_("line", { x1: x + e, x2: x + e, y1: m - 6 * r, y2: F + 6 * r, "stroke-width": 1.5 }, { stroke: w.offLine }));
    for (let e = 0; e < E; e++) {
      const s = e < D && (f.on || u.dy !== 0);
      a.appendChild(_("line", { x1: x - 10 * r, x2: x + 10 * r, y1: m + e * $, y2: m + e * $, "stroke-width": s ? 3 : 1.5, "stroke-linecap": "round" }, { stroke: s ? P : w.offLine }));
    }
    const n = m + (D - 1) * $, o = p ?? f.label ?? "";
    a.appendChild(_("circle", { cx: x, cy: n, r: 12 * r, "stroke-width": 1.6 }, { fill: w.off, stroke: f.on ? P : w.ink })), a.appendChild(_("path", { d: `M${x - 4 * r} ${n - 1 * r} l${4 * r} ${-4 * r} l${4 * r} ${4 * r} M${x - 4 * r} ${n + 1 * r} l${4 * r} ${4 * r} l${4 * r} ${-4 * r}`, fill: "none", "stroke-width": 1.5 }, { stroke: w.ink })), a.appendChild(Z(x, m - 16 * r, k ? "Saving…" : "Depth", 12 * r, w.ink, "middle", !0, !0)), (p || u.dy) && a.appendChild(Z(x + 18 * r, n + 4 * r, o, 12 * r, w.ink, "start", !0, !0));
  }
  return a;
}
function He(i, u, p, k = {}) {
  const a = i?.canvas?.node;
  if (!a || typeof document > "u") return { update() {
  }, remove() {
  } };
  const h = document.createElementNS(fe, "g");
  h.setAttribute("data-rule-controls", ""), h.setAttribute("data-board-scope", u), h.setAttribute("role", "group"), h.setAttribute("aria-label", "How this board behaves: controls"), h.setAttribute("data-export-never", "");
  let f = p, r = k.origin ?? { x: 0, y: 0 }, L = !1, C = null, P = null, x, m = null;
  const $ = (n) => {
    const o = h.getScreenCTM?.();
    if (!o || typeof a.createSVGPoint != "function") return { x: n.clientX, y: n.clientY };
    const e = a.createSVGPoint();
    e.x = n.clientX, e.y = n.clientY;
    const s = e.matrixTransform(o.inverse());
    return { x: s.x, y: s.y };
  };
  async function E(n, o, e) {
    if (!o?.length || C || L) return;
    C = n.id, D();
    let s = !1;
    try {
      s = !!await k.onRuleEdit?.(o, e);
    } catch {
      s = !1;
    }
    if (C = null, L) return;
    P = { id: n.id, ok: s, until: Date.now() + 2e3 }, clearTimeout(x), x = setTimeout(() => {
      P = null, D();
    }, 2e3), D();
    const t = f.find((l) => l.id === n.id);
    k.announce?.(s ? (t?.state.sentence ?? e) + "." : "Not changed.");
  }
  function D() {
    if (L) return;
    const n = document.activeElement, o = n && h.contains(n) ? n.getAttribute("data-rule-control") : null;
    for (; h.firstChild; ) h.removeChild(h.firstChild);
    h.setAttribute("transform", `translate(${r.x} ${r.y})`);
    const e = /* @__PURE__ */ new Map(), s = (t, l) => {
      if (!t.group) {
        h.appendChild(l);
        return;
      }
      let d = e.get(t.group);
      d || (d = _("g", { role: "group", "aria-label": t.group + " controls", "data-rule-group": t.group }), e.set(t.group, d), h.appendChild(d)), d.appendChild(l);
    };
    for (const t of f) {
      if (t.look.shape === "value") {
        const I = _("g", { "data-rule-readout": t.id, "aria-hidden": "true", "pointer-events": "none" });
        I.appendChild(ye(t, { dy: 0 }, null, !1)), s(t, I);
        continue;
      }
      const l = m?.control.id === t.id && m.moved, d = l ? m.delta : { dx: 0, dy: 0 }, v = l ? t.gestures.preview?.(d) ?? null : null, c = _("g", {
        "data-rule-control": t.id,
        "data-primitive": t.primitive,
        role: t.gestures.drag ? "slider" : "button",
        tabindex: t.pointerOnly ? -1 : 0,
        ...t.pointerOnly ? { "aria-hidden": "true" } : {},
        ...t.disabled ? { "aria-disabled": "true" } : {},
        "aria-label": t.label,
        ...t.pressed !== void 0 && !t.gestures.drag ? { "aria-pressed": String(t.pressed) } : {},
        ...t.gestures.drag ? { "aria-valuetext": t.state.sentence } : {},
        cursor: t.disabled ? "not-allowed" : t.gestures.drag ? t.gestures.axis === "x" ? "ew-resize" : "ns-resize" : "pointer"
      });
      c.style.setProperty("outline", "none");
      const g = ye(t, d, v, C === t.id);
      t.disabled && g.setAttribute("opacity", "0.5"), c.appendChild(g);
      const { hit: y } = t, A = _("rect", {
        x: y.x,
        y: y.y + (t.look.shape === "line" || t.look.shape === "ladder" ? d.dy : 0),
        width: y.width,
        height: y.height,
        rx: Math.min(y.width, y.height) / 2,
        "pointer-events": "all",
        "data-rule-hit": ""
      }, { fill: "transparent" });
      A.style.setProperty("touch-action", "none"), c.appendChild(A);
      const G = _("rect", {
        x: y.x - 3,
        y: y.y - 3 + (t.look.shape === "line" ? d.dy : 0),
        width: y.width + 6,
        height: y.height + 6,
        rx: Math.min(y.width, y.height) / 2 + 3,
        fill: "none",
        "stroke-width": 2.5,
        "pointer-events": "none",
        "data-rule-focus": "",
        opacity: 0
      }, { stroke: w.line });
      c.appendChild(G);
      const H = _("title", {});
      H.textContent = t.label, c.appendChild(H);
      const B = Math.min(y.width, y.height) / 44, b = t.look.shape === "line" || t.look.shape === "ladder" ? null : Te(t), O = 12 * B, K = O * 0.58, q = 8 * B, Q = O * 1.3, J = t.hintBounds ? t.hintBounds.right - t.hintBounds.left : 1 / 0, T = b ? Oe(b, Math.max(8, Math.floor((J - q * 2) / K))) : [], U = T.length ? Math.max(...T.map((I) => I.trimEnd().length)) * K + q * 2 : 0, ee = 22 * B + (T.length - 1) * Q;
      let V = t.hintAt?.x ?? y.x + y.width / 2;
      const ie = t.hintAt?.y ?? y.y - 8 * B;
      if (t.hintBounds) {
        const { left: I, right: X } = t.hintBounds;
        V = U >= X - I ? (I + X) / 2 : Math.max(I + U / 2, Math.min(X - U / 2, V));
      }
      const M = T.length ? _(
        "path",
        { d: se(V - U / 2, ie - 16 * B, U, ee, 11 * B), "stroke-width": 1, "pointer-events": "none", "data-rule-hint-back": "" },
        { fill: w.off, stroke: w.offLine }
      ) : null, S = T.length ? Z(V, ie, T.length === 1 ? T[0] : "", O, w.ink, "middle", !0, !1) : null;
      S && T.length > 1 && T.forEach((I, X) => {
        const N = document.createElementNS(fe, "tspan");
        N.setAttribute("x", String(V)), N.setAttribute("dy", String(X ? Q : 0)), N.textContent = I, S.appendChild(N);
      });
      const W = (I) => {
        for (const X of [M, S])
          X?.setAttribute("opacity", I ? "1" : "0"), X?.setAttribute("visibility", I ? "visible" : "hidden");
      };
      M && S && (S.setAttribute("data-rule-hint", ""), c.appendChild(M), c.appendChild(S), W(!1));
      let te;
      if (c.addEventListener("focus", () => {
        G.setAttribute("opacity", "1"), W(!0);
      }), c.addEventListener("blur", () => {
        G.setAttribute("opacity", "0"), W(!1);
      }), c.addEventListener("pointerenter", () => {
        clearTimeout(te), te = setTimeout(() => {
          !L && c.isConnected && W(!0);
        }, Pe);
      }), c.addEventListener("pointerleave", () => {
        clearTimeout(te), document.activeElement !== c && W(!1);
      }), F(c, t), P?.id === t.id && P.until > Date.now()) {
        const I = P.ok ? t.state.sentence : "Not changed";
        c.appendChild(Z(V, t.hintAt ? ie : y.y - 8 * (y.height / 44), I, 13 * B, P.ok ? w.line : w.refuse, "middle", !0, !0)), c.setAttribute("data-rule-flash", I);
      }
      s(t, c);
    }
    a.lastChild !== h && a.appendChild(h), o && h.querySelector(`[data-rule-control="${CSS.escape ? CSS.escape(o) : o}"]`)?.focus({ preventScroll: !0 });
  }
  function F(n, o) {
    const e = (s) => s.stopPropagation();
    n.addEventListener("mousedown", e), n.addEventListener("touchstart", e, { passive: !0 }), n.addEventListener("dblclick", (s) => {
      s.stopPropagation(), s.preventDefault();
    }), n.addEventListener("pointerdown", (s) => {
      if (s.stopPropagation(), s.preventDefault(), C || m) return;
      const t = { control: o, start: $(s), delta: { dx: 0, dy: 0 }, moved: !1, holdDone: !1, pointerId: s.pointerId };
      m = t;
      const l = (v) => {
        if (m !== t || v.pointerId !== t.pointerId) return;
        const c = $(v), g = { dx: c.x - t.start.x, dy: c.y - t.start.y };
        !t.moved && Math.hypot(g.dx, g.dy) < 5 || t.control.gestures.drag && (v.preventDefault(), t.moved = !0, clearTimeout(t.holdTimer), t.delta = t.control.gestures.axis === "x" ? { dx: g.dx, dy: 0 } : { dx: 0, dy: g.dy }, D());
      }, d = (v) => {
        if (v.pointerId !== t.pointerId || (window.removeEventListener("pointermove", l, !0), window.removeEventListener("pointerup", d, !0), window.removeEventListener("pointercancel", d, !0), m !== t)) return;
        m = null, clearTimeout(t.holdTimer);
        const c = t.control;
        if (v.type === "pointercancel" || t.holdDone) {
          D();
          return;
        }
        if (v.stopPropagation(), t.moved && c.gestures.drag) {
          const g = c.gestures.preview?.(t.delta) ?? c.label, y = c.gestures.drag(t.delta);
          D(), E(c, y, g);
        } else c.gestures.tap ? E(c, c.gestures.tap, c.label) : D();
      };
      window.addEventListener("pointermove", l, !0), window.addEventListener("pointerup", d, !0), window.addEventListener("pointercancel", d, !0), o.gestures.hold && (t.holdTimer = setTimeout(() => {
        m !== t || t.moved || (t.holdDone = !0, E(t.control, t.control.gestures.hold, t.control.label));
      }, 550));
    }), n.addEventListener("click", e), n.addEventListener("contextmenu", (s) => {
      s.preventDefault(), s.stopPropagation(), o.gestures.hold && E(o, o.gestures.hold, o.label);
    }), n.addEventListener("keydown", (s) => {
      const t = s.key, { gestures: l } = o;
      let d;
      if ((t === "Enter" || t === " ") && s.shiftKey && l.hold) d = l.hold;
      else if (t === "Enter" || t === " ") d = l.tap;
      else if ((t === "Delete" || t === "Backspace") && l.remove) d = l.remove;
      else if (l.drag && l.step && /^Arrow(Up|Down|Left|Right)$/.test(t)) {
        const v = t === "ArrowUp" || t === "ArrowLeft" ? -1 : 1;
        d = l.drag(l.axis === "x" ? { dx: v * l.step, dy: 0 } : { dx: 0, dy: v * l.step });
      } else return;
      s.preventDefault(), s.stopPropagation(), E(o, d, o.label);
    });
  }
  return D(), {
    update(n, o) {
      L || (f = n, o && (r = o), m && !n.some((e) => e.id === m.control.id) ? m = null : m && (m = { ...m, control: n.find((e) => e.id === m.control.id) }), D());
    },
    remove() {
      L = !0, clearTimeout(x), m && clearTimeout(m.holdTimer), h.remove();
    }
  };
}
_e({ controls: Se, draw: He });
export {
  Pe as HINT_DELAY,
  Re as RULE_CONTROL_EDITS,
  w as controlInk,
  He as drawRuleControls,
  Oe as hintLines,
  Te as hintOf,
  Se as ruleControls,
  Ee as ruleControlsFamily,
  Xe as ruleControlsLayoutOf
};
