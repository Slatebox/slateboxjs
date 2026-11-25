import { s as E, d as C } from "./canvas-canvas-kS-rdj93.mjs";
const M = /* @__PURE__ */ new Set(["collabBaseline", "viewPort"]), R = (r, t) => r === t || JSON.stringify(r) === JSON.stringify(t), w = (r) => r?.options?.id, D = (r) => r.relationships?.associations ?? [];
function y(r) {
  return r.id != null && r.id !== "" ? String(r.id) : `${r.parentId}->${r.childId}`;
}
function v(r, t, e) {
  const s = {}, n = [];
  for (const h of Object.keys(t))
    e?.has(h) || (!(h in r) || !R(r[h], t[h])) && (s[h] = t[h]);
  for (const h of Object.keys(r))
    e?.has(h) || h in t || n.push(h);
  return { set: s, unset: n };
}
const N = (r) => Object.keys(r.set).length === 0 && r.unset.length === 0;
function I(r) {
  const t = /* @__PURE__ */ new Map();
  for (const e of r ?? []) {
    const s = w(e);
    s != null && t.set(s, e);
  }
  return t;
}
function T(r, t) {
  const e = v(r?.options ?? {}, t?.options ?? {}, M), s = I(r?.nodes ?? []), n = I(t?.nodes ?? []), h = [], u = [], p = [];
  for (const [a, o] of n) {
    const i = s.get(a);
    if (!i) {
      h.push(o);
      continue;
    }
    if (R(i, o)) continue;
    const d = v(i.options ?? {}, o.options ?? {}), c = new Map(D(i).map((l) => [y(l), l])), f = new Map(D(o).map((l) => [y(l), l])), g = { set: [], removed: [] };
    for (const [l, k] of f) R(c.get(l), k) || g.set.push(k);
    for (const l of c.keys()) f.has(l) || g.removed.push(l);
    N(d) && g.set.length === 0 && g.removed.length === 0 || p.push({ id: a, ...d, links: g });
  }
  for (const a of s.keys()) n.has(a) || u.push(a);
  return N(e) && h.length === 0 && u.length === 0 && p.length === 0 ? null : { options: e, added: h, removed: u, changed: p };
}
function J(r, t) {
  const e = { ...r.options ?? {} };
  for (const [o, i] of Object.entries(t.options.set)) e[o] = i;
  for (const o of t.options.unset) delete e[o];
  const s = new Set(t.removed), n = new Map(t.changed.map((o) => [o.id, o])), h = new Map(t.added.map((o) => [w(o), o])), u = [];
  for (const o of r.nodes ?? []) {
    const i = w(o);
    if (i != null && s.has(i)) continue;
    if (i != null && h.has(i)) {
      u.push(h.get(i)), h.delete(i);
      continue;
    }
    const d = i != null ? n.get(i) : void 0;
    let c = o;
    if (d) {
      const f = { ...o.options ?? {} };
      for (const [l, k] of Object.entries(d.set)) f[l] = k;
      for (const l of d.unset) delete f[l];
      let g = D(o);
      if (d.links.set.length || d.links.removed.length) {
        const l = new Set(d.links.removed), k = new Map(d.links.set.map((m) => [y(m), m]));
        g = g.filter((m) => !l.has(y(m))).map((m) => {
          const O = y(m), H = k.get(O);
          return H ? (k.delete(O), H) : m;
        }), g.push(...k.values());
      }
      c = { ...o, options: f, relationships: { ...o.relationships ?? {}, associations: g } };
    }
    u.push(c);
  }
  u.push(...h.values());
  const p = new Set(u.map(w)), a = u.map((o) => {
    const i = D(o), d = i.filter((c) => c.targetPoint || c.childId == null || p.has(c.childId));
    return d.length === i.length ? o : { ...o, relationships: { ...o.relationships, associations: d } };
  });
  return { ...r, options: e, nodes: a };
}
const b = "Someone else changed that since, so there was nothing of yours to take back there.";
class S {
  constructor(t, e = {}) {
    this.undoStack = [], this.redoStack = [], this.undoHost = [], this.redoHost = [], this.debounceTimer = null, this.isRestoring = !1, this.restoreQueue = Promise.resolve(), this.pendingRestores = 0, this.gestureRecordDue = !1, this.undoSteps = [], this.redoSteps = [], this.undoTouched = [], this.redoTouched = [], this.gestureDepth = 0, this.gestureChanged = !1, this.listeners = /* @__PURE__ */ new Set(), this.lastState = "", this.carried = /* @__PURE__ */ new WeakMap(), this.slate = t, this.options = {
      enabled: !0,
      maxHistory: 50,
      // Coalesce a burst of edits into one undo step, but land the snapshot soon
      // after activity stops so undo is responsive.
      debounceMs: 500,
      ...e
    };
  }
  /**
   * Take a snapshot of the current state.
   * Debounced to avoid excessive snapshots during rapid changes.
   *
   * @param init - If true, take immediately without debounce (initial state)
   */
  snap(t = !1) {
    if (!(!this.options.enabled || this.isRestoring)) {
      if (t) {
        this.takeSnapshot();
        return;
      }
      if (!this.gestureRecordDue) {
        if (this.gestureDepth > 0) {
          this.gestureChanged = !0, this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null);
          return;
        }
        this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
          this.debounceTimer = null, this.takeSnapshot();
        }, this.options.debounceMs);
      }
    }
  }
  /**
   * Record a step as soon as the current gesture has made all its changes,
   * without the pause that groups a burst of edits into one step.
   *
   * Deleting is one deliberate act: two notes deleted one after the other are
   * two steps, and undo brings back the last one only. (Several selected notes
   * deleted by one key press are still one step: their packages are all sent
   * before this record is taken.)
   */
  snapAfterGesture() {
    if (!(!this.options.enabled || this.isRestoring)) {
      if (this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureDepth > 0) {
        this.gestureChanged = !0;
        return;
      }
      this.gestureRecordDue || (this.gestureRecordDue = !0, queueMicrotask(() => {
        this.gestureRecordDue && (this.gestureRecordDue = !1, !(!this.slate || this.isRestoring) && this.takeSnapshot());
      }));
    }
  }
  /**
   * Take an immediate snapshot, bypassing the debounce timer.
   * Useful for programmatic undo/redo sequences where you need
   * guaranteed snapshot state right now (e.g., tests, scripts).
   */
  forceSnapshot() {
    !this.options.enabled || this.isRestoring || (this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureRecordDue = !1, this.gestureChanged = !1, this.takeSnapshot());
  }
  /** True while a change of this person's own waits to be recorded. */
  hasPending() {
    return !!(this.debounceTimer || this.gestureRecordDue || this.gestureChanged);
  }
  /**
   * Record a change still waiting for its pause (or its gesture) now, as a step of
   * its own. Nothing happens when nothing is waiting.
   */
  flushPending() {
    this.hasPending() && this.forceSnapshot();
  }
  /**
   * A pointer gesture began on the canvas (a drag, a resize, a rotation, a line drawn):
   * whatever it changes is one step, recorded by {@link endGesture}. An edit already
   * waiting for its pause is recorded first, as a step of its own.
   */
  beginGesture() {
    this.options.enabled && (this.gestureDepth === 0 && this.debounceTimer && this.forceSnapshot(), this.gestureDepth += 1);
  }
  /** True while a pointer gesture on the canvas is under way. */
  inGesture() {
    return this.gestureDepth > 0;
  }
  /** The gesture begun with {@link beginGesture} is over: its changes, if any, are one step. */
  endGesture() {
    this.gestureDepth !== 0 && (this.gestureDepth -= 1, !(this.gestureDepth > 0 || !this.gestureChanged) && (this.gestureChanged = !1, this.gestureRecordDue = !0, queueMicrotask(() => {
      this.gestureRecordDue && (this.gestureRecordDue = !1, !(!this.slate || this.isRestoring) && this.takeSnapshot());
    })));
  }
  /**
   * Record a step a host made in its own state (see {@link HostStep}) as the next step
   * of this person's history. A change of the drawing still waiting to be recorded is
   * recorded first, as a step of its own. Redo history is cleared, as by any new step.
   */
  recordHostStep(t) {
    !this.options.enabled || !this.slate || !t || typeof t.undo != "function" || typeof t.redo != "function" || (this.flushPending(), this.takeSnapshot(t));
  }
  /** Whether there is something to undo and to redo now. */
  state() {
    const t = this.undoSteps[this.undoStack.length - 1], e = this.redoSteps[this.redoStack.length - 1];
    return {
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoLabel: this.canUndo() ? t?.label ?? null : null,
      redoLabel: this.canRedo() ? e?.label ?? null : null
    };
  }
  /**
   * Hear whenever there comes to be something, or nothing, to undo or redo, and what each
   * undo or redo did. Called at once with the state as it is. Returns a function that stops it.
   */
  subscribe(t) {
    if (typeof t != "function") return () => {
    };
    this.listeners.add(t);
    const e = this.state();
    this.lastState = JSON.stringify(e);
    try {
      t(e);
    } catch (s) {
      console.warn("UNDOREDO_DEBUG: listener threw", s);
    }
    return () => {
      this.listeners.delete(t);
    };
  }
  notify(t) {
    const e = this.state(), s = JSON.stringify(e);
    if (!(!t && s === this.lastState)) {
      this.lastState = s;
      for (const n of [...this.listeners])
        try {
          n(e, t);
        } catch (h) {
          console.warn("UNDOREDO_DEBUG: listener threw", h);
        }
      try {
        this.slate?.options?.events?.onUndoRedoChanged?.(e, t);
      } catch (n) {
        console.warn("UNDOREDO_DEBUG: onUndoRedoChanged threw", n);
      }
    }
  }
  /** Bring what the host keeps with the current record up to date (see Slate.beginHostStep). */
  refreshHostState() {
    !this.options.enabled || !this.slate || !this.undoStack.length || (this.undoHost[this.undoStack.length - 1] = this.hostState());
  }
  /** True when going back from record `index` to the one before changes nothing (drawing and host state alike). */
  sameAsBefore(t) {
    if (t < 1) return !1;
    try {
      if (T(this.undoStack[t - 1], this.undoStack[t]) !== null) return !1;
    } catch {
      return !1;
    }
    return S.sameHost(this.undoHost[t - 1], this.undoHost[t]);
  }
  /** True when redoing the top redo record changes nothing from the current record. */
  redoChangesNothing() {
    const t = this.redoStack[this.redoStack.length - 1], e = this.undoStack[this.undoStack.length - 1];
    if (!t || !e) return !1;
    try {
      if (T(e, t) !== null) return !1;
    } catch {
      return !1;
    }
    return S.sameHost(this.undoHost[this.undoStack.length - 1], this.redoHost[this.redoStack.length - 1]);
  }
  /** Whether two records' host states (Map of policy to state) hold the same. */
  static sameHost(t, e) {
    const s = (n) => {
      try {
        return JSON.stringify(n instanceof Map ? [...n.values()] : n ?? null);
      } catch {
        return String(Math.random());
      }
    };
    return s(t) === s(e);
  }
  /**
   * Undo this person's last step. A step someone else has since changed so that going
   * back would change nothing is passed over (and listeners are told so); the step
   * before it is undone instead. Returns false when there was nothing to undo.
   */
  undo() {
    this.hasPending() && this.forceSnapshot();
    let t = 0;
    for (; this.undoStack.length > 1; ) {
      const e = this.undoStack.length - 1, s = this.undoSteps[e];
      if (!s && this.undoTouched[e] && this.sameAsBefore(e)) {
        this.undoStack.splice(e, 1), this.undoHost.splice(e, 1), this.undoSteps.splice(e, 1), this.undoTouched.splice(e, 1), t += 1;
        continue;
      }
      this.redoStack.push(this.undoStack.pop()), this.redoHost.push(this.undoHost.pop()), this.redoSteps.push(this.undoSteps.pop() ?? null), this.redoTouched.push(this.undoTouched.pop() ?? !1);
      const n = this.undoStack[this.undoStack.length - 1], h = this.leavesTheirs(this.redoStack[this.redoStack.length - 1], n);
      return this.restore(n, "undo", this.undoHost[this.undoStack.length - 1], s ?? null, t, h), this.notify(), !0;
    }
    return t && this.notify({ action: "undo", done: !1, skipped: t, message: b }), !1;
  }
  /**
   * Redo the last undone step. A step someone else has since changed so that redoing it
   * would change nothing is passed over. Returns false when there was nothing to redo.
   */
  redo() {
    let t = 0;
    for (; this.redoStack.length > 0; ) {
      const e = this.redoStack.length - 1, s = this.redoSteps[e];
      if (!s && this.redoTouched[e] && this.redoChangesNothing()) {
        this.redoStack.pop(), this.redoHost.pop(), this.redoSteps.pop(), this.redoTouched.pop(), t += 1;
        continue;
      }
      const n = this.leavesTheirs(this.undoStack[this.undoStack.length - 1], this.redoStack[e]), h = this.redoStack.pop(), u = this.redoHost.pop();
      this.redoSteps.pop();
      const p = this.redoTouched.pop() ?? !1;
      return this.undoStack.push(h), this.undoHost.push(u), this.undoSteps.push(s ?? null), this.undoTouched.push(p), this.restore(h, "redo", u, s ?? null, t, n), this.notify(), !0;
    }
    return t && this.notify({ action: "redo", done: !1, skipped: t, message: b }), !1;
  }
  /**
   * The slate as it is now, taken just before other people's changes are
   * applied to it; pass it to {@link absorbRemote} once they have been. Null
   * when this slate keeps no history.
   */
  beforeRemote() {
    if (!this.options.enabled || !this.slate) return null;
    try {
      return S.capture(this.slate);
    } catch {
      return null;
    }
  }
  /**
   * Other people's changes were applied to the slate (ordinary edits, or a
   * whole-slate replacement from their undo or redo). Records are whole slates,
   * so going back to one would put back the slate as this person recorded it and
   * take away everything the others did since, however long ago this person's
   * own step was. Their change is therefore carried into every record, undo and
   * redo alike: an undo then takes back only this person's own step.
   *
   * @param before - the slate just before those changes (see {@link beforeRemote})
   */
  absorbRemote(t) {
    if (!this.options.enabled || !this.slate) return;
    let e;
    try {
      e = S.capture(this.slate);
    } catch {
      return;
    }
    if (t && typeof t == "object") {
      const s = T(t, e);
      s && (this.undoStack = this.undoStack.map((n) => this.absorbInto(n, t, s)), this.redoStack = this.redoStack.map((n) => this.absorbInto(n, t, s)), this.undoTouched = this.undoTouched.map(() => !0), this.redoTouched = this.redoTouched.map(() => !0));
    }
    this.isRestoring || this.hasPending() || this.undoStack.length === 0 || (this.undoStack[this.undoStack.length - 1] = e, this.undoHost[this.undoStack.length - 1] = this.hostState());
  }
  absorbInto(t, e, s) {
    const n = /* @__PURE__ */ new Set();
    for (const o of s.changed) {
      n.add(o.id);
      for (const i of o.links.set) typeof i.childId == "string" && n.add(i.childId);
    }
    for (const o of s.removed) n.delete(o);
    const h = S.noteIds(t), u = (e.nodes ?? []).filter((o) => n.has(o?.options?.id) && !h.has(o.options.id)), p = J(u.length ? { ...t, nodes: [...t.nodes ?? [], ...JSON.parse(JSON.stringify(u))] } : t, s), a = /* @__PURE__ */ new Set([...this.carried.get(t) ?? [], ...u.map((o) => o.options.id)]);
    return a.size && this.carried.set(p, a), p;
  }
  leavesTheirs(t, e) {
    const s = e ? this.carried.get(e) : void 0;
    if (!s) return !1;
    const n = t && this.carried.get(t) || /* @__PURE__ */ new Set();
    return [...s].some((h) => !n.has(h));
  }
  /** Check if undo is available */
  canUndo() {
    return this.undoStack.length > 1;
  }
  /** Check if redo is available */
  canRedo() {
    return this.redoStack.length > 0;
  }
  /** Clear all history */
  clear() {
    this.undoStack = [], this.redoStack = [], this.undoHost = [], this.redoHost = [], this.undoSteps = [], this.redoSteps = [], this.undoTouched = [], this.redoTouched = [], this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.gestureRecordDue = !1, this.gestureChanged = !1, this.notify();
  }
  /** Destroy the undo/redo system, clearing all history and references */
  destroy() {
    this.clear(), this.listeners.clear(), this.isRestoring = !1, this.gestureDepth = 0, this.slate = null;
  }
  // ─── Private ─────────────────────────────────────────────────────
  takeSnapshot(t = null) {
    let e;
    try {
      e = S.capture(this.slate);
    } catch {
      return;
    }
    this.redoStack = [], this.redoHost = [], this.redoSteps = [], this.redoTouched = [], this.undoStack.push(e), this.undoHost.push(this.hostState()), this.undoSteps.push(t), this.undoTouched.push(!1), this.undoStack.length > this.options.maxHistory && (this.undoStack.shift(), this.undoHost.shift(), this.undoSteps.shift(), this.undoTouched.shift(), this.undoSteps[0] = null), this.notify();
  }
  /**
   * The slate as a record: plain data, copied all the way down. A serialized note can share
   * nested objects with the live note (its `rotate` while it is not rotated), and a later
   * change to the live note would otherwise change the record with it (undoing a first
   * rotation left the note rotated).
   */
  static capture(t) {
    return JSON.parse(JSON.stringify(E(t)));
  }
  /** What the slate's host policies keep with a record taken now. */
  hostState() {
    try {
      return this.slate?.undoHostState?.() ?? null;
    } catch {
      return null;
    }
  }
  /** The ids of the ordinary notes a slate document holds. */
  static noteIds(t) {
    return new Set((t?.nodes ?? []).map((e) => e?.options?.id).filter((e) => typeof e == "string"));
  }
  /** A host step that did nothing is not offered the other way round. */
  dropStep(t, e) {
    const n = (e === "undo" ? this.redoSteps : this.undoSteps).lastIndexOf(t);
    if (!(n < 0))
      if (e === "undo") {
        if (n !== this.redoStack.length - 1) return;
        this.redoStack.pop(), this.redoHost.pop(), this.redoSteps.pop(), this.redoTouched.pop();
      } else {
        if (n !== this.undoStack.length - 1 || n < 1) return;
        this.undoStack.pop(), this.undoHost.pop(), this.undoSteps.pop(), this.undoTouched.pop();
      }
  }
  restore(t, e, s = null, n = null, h = 0, u = !1) {
    this.pendingRestores += 1, this.isRestoring = !0;
    let p = {
      action: e,
      done: !0,
      skipped: h,
      message: h || u ? b : null
    };
    this.restoreQueue = this.restoreQueue.then(async () => {
      await this.slate.collab?.whenApplied?.();
      let a = null;
      try {
        a = S.capture(this.slate);
      } catch {
        a = null;
      }
      let o = !0;
      if (n && a)
        try {
          o = T(a, t) !== null;
        } catch {
          o = !0;
        }
      if (o) {
        await C(JSON.stringify(t), this.slate, !1, !0);
        const i = S.noteIds(a), d = S.noteIds(t);
        this.slate.restoreUndoHostState?.(s, {
          added: [...d].filter((f) => !i.has(f)),
          removed: [...i].filter((f) => !d.has(f))
        });
        const c = JSON.stringify(t);
        this.slate.broadcast?.("onSlateReplaced", {
          action: e,
          snapshot: c
        }), this.slate.options.events?.onTakeSnapshot?.({
          action: e,
          slateId: this.slate.options.id,
          snapshot: c
        });
      }
      if (n) {
        let i;
        try {
          i = await (e === "undo" ? n.undo() : n.redo());
        } catch (f) {
          console.warn("UNDOREDO_DEBUG: host step failed", f), i = { ok: !1, message: null };
        }
        const d = i === void 0 || i === !0 || typeof i == "object" && i !== null && i.ok !== !1, c = typeof i == "object" && i !== null && typeof i.message == "string" ? i.message : null;
        d ? c && (p = { ...p, message: c }) : (this.dropStep(n, e), p = { action: e, done: o, skipped: h, message: c ?? (h ? b : null) });
      }
    }).catch(
      (a) => console.error("UNDOREDO_DEBUG: Restore failed", a)
    ).finally(() => {
      this.pendingRestores -= 1, this.pendingRestores === 0 && (this.isRestoring = !1), this.notify(p);
    });
  }
  /** Resolves once every undo and redo asked for so far has been carried out. */
  whenRestored() {
    return this.restoreQueue.then(() => {
    });
  }
}
export {
  b as OVERWRITTEN_SENTENCE,
  S as UndoRedo
};
