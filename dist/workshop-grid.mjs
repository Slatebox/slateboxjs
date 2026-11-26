import { registerWorkshopRules as Se, workshopEditKinds as Q, workshopRuleSchema as K, said as b, nextWorkshopId as Me, workshopKeepsPicture as me, workshopFreshOverride as Oe, workshopOverrideMark as Le } from "./workshop-model.mjs";
const C = 96, V = 72, L = (e) => Math.round(e * 100) / 100, Ne = { letter: [816, 1056], a4: [793.7, 1122.52] }, qe = { letter: [8.5, 11], a4: [8.27, 11.69] }, Ce = { letter: [612, 792], a4: [595.28, 841.89] }, ee = (e, t) => t === "landscape" ? [e[1], e[0]] : e, se = (e) => e === "a4" ? "A4" : "Letter";
function be(e) {
  const [t, s] = ee(Ne[e.page.size], e.page.orientation);
  return { width: t, height: s };
}
function pt(e) {
  return { in: ee(qe[e.page.size], e.page.orientation), pt: ee(Ce[e.page.size], e.page.orientation) };
}
function D(e) {
  const { width: t, height: s } = be(e), o = e.page.margin * C, n = e.cells.gutter * C;
  return { width: L((t - 2 * o - (e.cells.cols - 1) * n) / e.cells.cols), height: L((s - 2 * o - (e.cells.rows - 1) * n) / e.cells.rows) };
}
function pe(e, t) {
  for (let s = t === "cols" ? 8 : 12; s > 1; s--) {
    const o = D({ ...e, cells: { ...e.cells, [t]: s } });
    if ((t === "cols" ? o.width : o.height) >= V) return s;
  }
  return 1;
}
function ke(e) {
  const t = D(e), s = se(e.page.size) + " " + e.page.orientation;
  if (t.width < V) {
    const o = pe(e, "cols");
    return `Cells would be under ¾ inch wide: use ${o} ${o === 1 ? "column" : "columns"} or fewer on ${s}.`;
  }
  if (t.height < V) {
    const o = pe(e, "rows");
    return `Cells would be under ¾ inch tall: use ${o} ${o === 1 ? "row" : "rows"} or fewer on ${s}.`;
  }
  return null;
}
const I = (e) => ({ rows: e.rows ?? 1, cols: e.cols ?? 1 });
function ut(e, t) {
  const s = D(e), o = e.page.margin * C, n = e.cells.gutter * C, { rows: a, cols: l } = I(t);
  return {
    x: L(o + t.col * (s.width + n)),
    y: L(o + t.row * (s.height + n)),
    width: L(l * s.width + (l - 1) * n),
    height: L(a * s.height + (a - 1) * n)
  };
}
function ht(e, t) {
  const { width: s, height: o } = be(e);
  if (t.x < 0 || t.y < 0 || t.x > s || t.y > o) return null;
  const n = D(e), a = e.page.margin * C, l = e.cells.gutter * C, d = (f, c) => Math.max(0, Math.min(c - 1, f));
  return { row: d(Math.floor((t.y - a + l / 2) / (n.height + l)), e.cells.rows), col: d(Math.floor((t.x - a + l / 2) / (n.width + l)), e.cells.cols) };
}
const oe = (e, t) => {
  const { rows: s, cols: o } = I(t);
  return t.row >= 0 && t.col >= 0 && t.row + s <= e.cells.rows && t.col + o <= e.cells.cols;
}, ve = (e) => {
  const { rows: t, cols: s } = I(e), o = [];
  for (let n = e.row; n < e.row + t; n++) for (let a = e.col; a < e.col + s; a++) o.push(n + ":" + a);
  return o;
}, Re = (e, t) => e.cards.filter((s) => s.laneId === t && s.cell);
function Ae(e, t, s) {
  const o = /* @__PURE__ */ new Map();
  for (const n of Re(e, t))
    if (n.id !== s)
      for (const a of ve(n.cell)) o.has(a) || o.set(a, n.id);
  return o;
}
function re(e, t, s, o) {
  if (!e.grid || !oe(e.grid, s)) return { reason: "bounds" };
  const n = Ae(e, t, o);
  for (const a of ve(s)) {
    const l = n.get(a);
    if (l) return { reason: "taken", by: l };
  }
  return null;
}
function xe(e, t, s = {}, o) {
  const n = e.grid;
  if (!n) return [];
  const a = [];
  for (let l = 0; l < n.cells.rows; l++) for (let d = 0; d < n.cells.cols; d++)
    re(e, t, { row: l, col: d, ...s }, o) || a.push({ row: l, col: d });
  return a;
}
const ze = (e, t) => Ae(e, t).size;
function H(e) {
  const t = (s) => e.lanes.findIndex((o) => o.id === s.laneId);
  return [...e.cards].sort((s, o) => t(s) - t(o) || (s.cell?.row ?? 0) - (o.cell?.row ?? 0) || (s.cell?.col ?? 0) - (o.cell?.col ?? 0));
}
function je(e, t) {
  const s = e.grid, o = H(e).filter((c) => c.cell && c.laneId !== t), n = e.cards.filter((c) => !c.cell || c.laneId === t).map((c) => ({ ...c })), a = [], l = [], d = () => ({ cards: n, grid: s });
  for (const c of o) {
    const r = { ...c.cell };
    oe(s, r) && !re(d(), c.laneId, r) ? n.push({ ...c, cell: r }) : l.push(c);
  }
  for (const c of l) {
    const r = I(c.cell), i = [];
    for (let p = Math.min(r.rows, s.cells.rows); p >= 1; p--) for (let h = Math.min(r.cols, s.cells.cols); h >= 1; h--) i.push({ rows: p, cols: h });
    i.sort((p, h) => h.rows * h.cols - p.rows * p.cols);
    let u = !1;
    for (const p of i) {
      const h = xe(d(), c.laneId, p)[0];
      if (!h) continue;
      const g = { row: h.row, col: h.col, ...p.rows > 1 && { rows: p.rows }, ...p.cols > 1 && { cols: p.cols } };
      n.push({ ...c, cell: g }), u = !0;
      break;
    }
    if (!u) {
      const { cell: p, ...h } = c;
      n.push({ ...h, laneId: t }), a.push({ label: c.label, span: r });
    }
  }
  const f = new Map(e.cards.map((c, r) => [c.id, r]));
  return n.sort((c, r) => f.get(c.id) - f.get(r.id)), { board: { ...e, cards: n }, sent: a };
}
const w = "tray", N = 120, P = 12, $ = ["heading", "text", "image", "question", "answer-lines", "word-bank", "diagram", "qr", "panel", "speech", "term", "sticker"], M = {
  heading: ["heading", "headings"],
  text: ["text block", "text blocks"],
  image: ["picture", "pictures"],
  question: ["question", "questions"],
  "answer-lines": ["set of answer lines", "answer lines"],
  "word-bank": ["word bank", "word banks"],
  diagram: ["diagram", "diagrams"],
  qr: ["QR code", "QR codes"],
  panel: ["panel", "panels"],
  speech: ["speech bubble", "speech bubbles"],
  term: ["term", "terms"],
  sticker: ["sticker", "stickers"]
};
function W(e, t) {
  const [s, o] = M[e];
  return t === 1 ? e === "answer-lines" ? "a set of answer lines" : (/^[aeiou]/i.test(s) ? "an " : "a ") + s : t + " " + o;
}
const q = (e) => M[e][1], ne = (e) => e.charAt(0).toUpperCase() + e.slice(1), j = (e) => e.length > 1 ? e.slice(0, -1).join(", ") + " and " + e.at(-1) : e[0] ?? "", F = (e) => ne(e === "answer-lines" ? "answer lines" : M[e][0]);
function ft(e) {
  const t = String(e ?? "").toLowerCase().replace(/[^a-z ]+/g, " ").replace(/\s+/g, " ").trim();
  if (!t) return null;
  for (const o of $) if (t === o.replace("-", " ") || t === M[o][0].toLowerCase() || t === M[o][1].toLowerCase()) return o;
  return [
    [/^(?:title|titles|headings?|headers?)$/, "heading"],
    [/^(?:text|texts|paragraphs?|text boxes|text box|captions?|instructions?)$/, "text"],
    [/^(?:pictures?|images?|photos?|illustrations?|drawings?)$/, "image"],
    [/^questions?$/, "question"],
    [/^(?:answer ?lines?|lines|writing lines|answer space)$/, "answer-lines"],
    [/^(?:word ?banks?|word lists?|vocabulary boxes?)$/, "word-bank"],
    [/^(?:diagrams?|charts?)$/, "diagram"],
    [/^(?:qr ?codes?|qrs?|qr)$/, "qr"],
    [/^(?:panels?|comic panels?|frames?)$/, "panel"],
    [/^(?:speech ?bubbles?|bubbles?|speech)$/, "speech"],
    [/^(?:terms?|words?|cards?|squares?)$/, "term"],
    [/^stickers?$/, "sticker"]
  ].find(([o]) => o.test(t))?.[1] ?? null;
}
const ae = (e) => e.lanes.slice(1), te = (e, t) => e.lanes.find((s) => s.id === t)?.label ?? "The page", G = (e) => "row " + (e.row + 1) + ", column " + (e.col + 1), B = (e) => e.rows + " by " + e.cols;
function ue(e, t) {
  return t === "heading" ? { rows: 1, cols: e.grid.cells.cols } : { rows: 1, cols: 1 };
}
const J = (e, t, s, o = !1) => {
  if (typeof e != "string") throw new Error(s);
  const n = (o ? e.replace(/\r\n?/g, `
`).replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "") : e.replace(/[\u0000-\u001f\u007f]/g, " ")).replace(/[ \t]+/g, " ").replace(/ *\n */g, `
`).trim();
  if (n.length > t) throw new Error(s);
  return n;
}, he = (e, t) => Math.abs(Math.round(e / t) * t - e) < 1e-9;
function Ge(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A grid sheet says its page and its cells.");
  const { page: t, cells: s } = e;
  if (!t || typeof t != "object" || !s || typeof s != "object") throw new Error("A grid sheet says its page and its cells.");
  if (t.size !== "letter" && t.size !== "a4") throw new Error("A page is Letter or A4.");
  if (t.orientation !== "portrait" && t.orientation !== "landscape") throw new Error("A page is portrait or landscape.");
  const o = t.margin ?? 0.5;
  if (typeof o != "number" || o < 0.25 || o > 1 || !he(o, 0.125)) throw new Error("A page’s margins are ¼ inch to 1 inch, in eighths of an inch.");
  const n = (l, d, f) => {
    if (typeof l != "number" || !Number.isInteger(l) || l < 1 || l > d) throw new Error(`A page has 1 to ${d} ${f}.`);
    return l;
  }, a = s.gutter ?? 0.125;
  if (typeof a != "number" || a < 0 || a > 0.5 || !he(a, 0.0625)) throw new Error("The gap between cells is up to ½ inch, in sixteenths of an inch.");
  return { page: { size: t.size, orientation: t.orientation, margin: o }, cells: { rows: n(s.rows, 12, "rows"), cols: n(s.cols, 8, "columns"), gutter: a } };
}
function Pe(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Every tile says what kind it is.");
  const t = e;
  if (!$.includes(t.type)) throw new Error("Every tile says what kind it is: " + j($.map((o) => F(o).toLowerCase())) + ".");
  const s = { type: t.type };
  for (const o of Object.keys(t)) if (!["type", "body", "words", "image", "link", "stamp"].includes(o)) throw new Error("A tile does not take " + o + ".");
  if (t.body !== void 0) {
    const o = J(t.body, 600, "A tile holds up to 600 characters.", !0);
    o && (s.body = o);
  }
  if (t.words !== void 0) {
    if (s.type !== "word-bank") throw new Error("Only a word bank holds a list of words.");
    if (!Array.isArray(t.words) || t.words.length < 3 || t.words.length > 24) throw new Error("A word bank holds 3 to 24 words.");
    s.words = t.words.map((o) => {
      const n = J(o, 40, "A word in a word bank is up to 40 characters.");
      if (!n) throw new Error("A word bank holds 3 to 24 words.");
      return n;
    });
  } else if (s.type === "word-bank") throw new Error("A word bank holds 3 to 24 words.");
  if (t.image !== void 0) {
    if (!["image", "diagram", "sticker", "panel"].includes(s.type)) throw new Error("Only a picture, a diagram, a sticker or a panel shows a picture.");
    const o = t.image;
    if (!o || typeof o != "object" || Array.isArray(o)) throw new Error("A picture says what it shows.");
    const n = J(o.alt, 120, "Say what the picture shows in up to 120 characters.");
    if (!n) throw new Error("Say what the picture shows in up to 120 characters.");
    if (s.image = { alt: n }, o.src !== void 0 && o.src !== "") {
      if (!me(o.src)) throw new Error("A tile keeps a picture by its web address, or held in the page.");
      s.image.src = o.src;
    }
  }
  if (t.link !== void 0) {
    if (s.type !== "qr") throw new Error("Only a QR code links to a web address.");
    let o = null;
    try {
      o = typeof t.link == "string" && t.link.length <= 2048 ? new URL(t.link) : null;
    } catch {
      o = null;
    }
    if (!o || o.protocol !== "https:" && o.protocol !== "http:" || o.username || o.password) throw new Error("A QR code links to a web address.");
    s.link = o.href;
  }
  if (t.stamp !== void 0) {
    if (t.stamp !== !0) throw new Error("A stamp is marked true.");
    s.stamp = !0;
  }
  return s;
}
function We(e) {
  const t = () => new Error("A tile’s cell is a row and a column.");
  if (!e || typeof e != "object" || Array.isArray(e)) throw t();
  const s = e;
  for (const a of Object.keys(s)) if (!["row", "col", "rows", "cols"].includes(a)) throw t();
  const o = (a, l) => {
    if (typeof a != "number" || !Number.isInteger(a) || a < l || a > 12) throw t();
    return a;
  }, n = { row: o(s.row, 0), col: o(s.col, 0) };
  return s.rows !== void 0 && o(s.rows, 1) > 1 && (n.rows = s.rows), s.cols !== void 0 && o(s.cols, 1) > 1 && (n.cols = s.cols), n;
}
function Fe(e) {
  const t = e.grid;
  if (!t) return "A grid sheet says its page and its cells.";
  if (e.lanes[0].id !== w) return "A grid sheet’s first area is its tray.";
  const s = ke(t);
  if (s) return s;
  let o = 0;
  for (const n of e.cards) {
    if (!n.tile) return "Every tile says what kind it is.";
    const a = n.laneId === w;
    if (n.tile.stamp && (o++, !a))
      return "A stamp stays in the tray.";
    if (a && n.cell) return "A tile in the tray has no cell.";
    if (!a && !n.cell) return "A tile on a page sits in a cell.";
    if (n.cell && !oe(t, n.cell)) return Be(t, n);
  }
  if (o > P) return `A sheet holds up to ${P} stamps.`;
  for (const n of ae(e)) {
    const a = /* @__PURE__ */ new Map();
    for (const l of H(e).filter((d) => d.laneId === n.id)) {
      const { rows: d, cols: f } = I(l.cell);
      for (let c = l.cell.row; c < l.cell.row + d; c++) for (let r = l.cell.col; r < l.cell.col + f; r++) {
        const i = a.get(c + ":" + r);
        if (i) return `${b(l.label)} and ${b(i.label)} both sit on ${G({ row: c, col: r })} of ${n.label}.`;
        a.set(c + ":" + r, l);
      }
    }
  }
  return null;
}
function Be(e, t) {
  const s = t.cell, { rows: o, cols: n } = I(s), a = b(t.label) + " runs past the page’s edge: ";
  return s.col + n > e.cells.cols ? s.col >= e.cells.cols ? a + `it sits in column ${s.col + 1}, and the page has ${e.cells.cols}.` : a + `it’s ${n} ${n === 1 ? "column" : "columns"} wide from column ${s.col + 1} of ${e.cells.cols}.` : s.row >= e.cells.rows ? a + `it sits on row ${s.row + 1}, and the page has ${e.cells.rows}.` : a + `it’s ${o} ${o === 1 ? "row" : "rows"} tall from row ${s.row + 1} of ${e.cells.rows}.`;
}
const le = (e) => (e.behaviour?.rules ?? []).filter((t) => t.on);
function _e(e) {
  const t = e;
  let s;
  switch (e.kind) {
    case "tileTypes":
      s = "This sheet uses " + j(t.types.map(q)) + ".";
      break;
    case "tileMax":
      s = (t.per === "sheet" ? "The sheet holds" : "A page holds") + " at most " + t.max + " " + (t.max === 1 ? M[t.type][0] : q(t.type)) + ".";
      break;
    case "tileNeeds":
      s = "Every page needs " + W(t.type, t.atLeast) + ".";
      break;
    case "tileSpan":
      s = ne(q(t.type)) + " can span up to " + t.rows + " by " + t.cols + " cells.";
      break;
    default:
      s = "This sheet has a rule it does not know.";
  }
  return e.severity === "warn" ? s.replace(/\.$/, " (a warning only).") : s;
}
function De(e) {
  const t = e.rules.filter((o) => o.on), s = t.find((o) => o.kind === "tileTypes");
  for (const o of t.filter((n) => n.kind === "tileNeeds")) {
    const n = t.find((a) => a.kind === "tileMax" && a.type === o.type && a.per === "page");
    if (n && n.max < o.atLeast) return `Every page needs ${W(o.type, o.atLeast)}, but a page holds at most ${n.max}.`;
    if (s && !s.types.includes(o.type)) return `Every page needs ${W(o.type, o.atLeast)}, but ${q(o.type)} aren’t one of this sheet’s tiles.`;
  }
  return t.filter((o) => o.kind === "tileTypes").length > 1 ? "A sheet says its tiles once." : null;
}
function He(e, t, s) {
  const o = (l) => {
    const d = Object.keys(e).find((f) => !["id", "on", "severity", "set", "kind", ...l].includes(f));
    if (d) throw new Error("A " + String(e.kind) + " rule does not take " + d + ".");
  }, n = (l) => {
    if (!$.includes(l)) throw new Error("Name a kind of tile: " + j($.map((d) => F(d).toLowerCase())) + ".");
    return l;
  }, a = (l, d, f, c) => {
    if (typeof l != "number" || !Number.isInteger(l) || l < d || l > f) throw new Error(c);
    return l;
  };
  switch (e.kind) {
    case "tileTypes": {
      if (o(["types"]), !Array.isArray(e.types) || !e.types.length || e.types.length > $.length) throw new Error("Say which tiles the sheet uses.");
      return { ...t, kind: "tileTypes", types: [...new Set(e.types.map(n))] };
    }
    case "tileMax": {
      o(["type", "max", "per"]);
      const l = e.per ?? "page";
      if (l !== "page" && l !== "sheet") throw new Error("A limit is per page or for the whole sheet.");
      return { ...t, kind: "tileMax", type: n(e.type), max: a(e.max, 1, 60, "A page holds 1 to 60 tiles of a kind."), per: l };
    }
    case "tileNeeds": {
      if (o(["type", "atLeast", "per"]), (e.per ?? "page") !== "page") throw new Error("What a page needs is said per page.");
      return { ...t, kind: "tileNeeds", type: n(e.type), atLeast: a(e.atLeast ?? 1, 1, 12, "A page needs 1 to 12 tiles of a kind."), per: "page" };
    }
    case "tileSpan": {
      o(["type", "rows", "cols"]);
      const l = s.grid;
      return {
        ...t,
        kind: "tileSpan",
        type: n(e.type),
        rows: a(e.rows, 1, l?.cells.rows ?? 12, "A tile spans 1 to as many rows as the page has."),
        cols: a(e.cols, 1, l?.cells.cols ?? 8, "A tile spans 1 to as many columns as the page has.")
      };
    }
  }
  throw new Error("This board does not know the rule " + String(e.kind) + ".");
}
const z = (e, t, s) => e.cards.filter((o) => o.tile?.type === t && o.laneId !== w && (s === null || o.laneId === s)).length;
function Qe(e, t) {
  const s = new Map(e.cards.map((o) => [o.id, o]));
  return t.cards.flatMap((o) => {
    const n = s.get(o.id), a = o.cell ? I(o.cell) : null, l = n?.cell ? I(n.cell) : null, d = !n || o.laneId !== w && (n.laneId !== o.laneId || n.tile?.type !== o.tile?.type), f = !!(a && (!l || a.rows > l.rows || a.cols > l.cols));
    return d || f ? [{ card: o, arrived: d, grew: f }] : [];
  });
}
function $e(e, t) {
  const s = le(e), o = [];
  if (!s.length) return { ok: !0, warnings: o };
  for (const { card: n, arrived: a, grew: l } of Qe(e, t)) {
    const d = n.tile?.type;
    if (!d) continue;
    const f = Oe(e, n) || !!(n.override && e.cards.find((c) => c.id === n.id)?.override);
    for (const c of s) {
      let r = null;
      if (c.kind === "tileTypes" && a && !f && !c.types.includes(d) && (r = ne(q(d)) + " aren’t one of this sheet’s tiles."), c.kind === "tileMax" && a && !f && n.laneId !== w && c.type === d) {
        const { max: i, per: u } = c, p = u === "sheet" ? null : n.laneId;
        z(t, d, p) > i && z(t, d, p) > z(e, d, p) && (r = (u === "sheet" ? "The sheet" : te(t, n.laneId)) + " already has its " + i + " " + (i === 1 ? M[d][0] : q(d)) + ".");
      }
      if (c.kind === "tileSpan" && (l || a) && n.cell && c.type === d) {
        const i = I(n.cell), u = c;
        (i.rows > u.rows || i.cols > u.cols) && (r = _e({ ...c, severity: "refuse" }));
      }
      if (r) {
        if (c.severity === "warn") {
          o.includes(r) || o.push(r);
          continue;
        }
        return { refused: { sentence: r, ruleId: c.id, set: c.set, cardId: n.id, laneId: n.laneId } };
      }
    }
  }
  return { ok: !0, warnings: o };
}
function Ke(e, t) {
  const s = (e.behaviour?.rules ?? []).find((o) => o.id === t);
  return !!(s && (s.kind === "tileMax" || s.kind === "tileTypes"));
}
function Ie(e, t) {
  return le(e).filter((s) => s.kind === "tileNeeds").filter((s) => z(e, s.type, t) < s.atLeast).map((s) => W(s.type, s.atLeast - z(e, s.type, t)));
}
const Je = { tileTypes: "types", tileMax: "type max per", tileNeeds: "type atLeast per", tileSpan: "type rows cols" }, Xe = {
  keys: Je,
  read: (e, t, s) => He(e, t, s),
  sentence: (e) => _e(e),
  contradiction: (e) => De(e),
  check: $e,
  builtIn: () => ["Tiles snap to free cells; none overlap."]
};
function Ue(e, t) {
  const s = e.grid;
  if (t === w) {
    const n = e.cards.filter((f) => f.laneId === w), a = n.filter((f) => f.tile?.stamp).length, l = n.length - a, d = [a ? a + (a === 1 ? " stamp" : " stamps") : "", l ? l + (l === 1 ? " tile" : " tiles") : ""].filter(Boolean);
    return d.length ? d.join(" · ") + " · drag onto a page" : "Drag a tile here to take it off the page";
  }
  const o = Ie(e, t);
  return [
    se(s.page.size),
    s.cells.rows + " × " + s.cells.cols,
    ze(e, t) + " of " + s.cells.rows * s.cells.cols + " cells",
    ...o.length ? ["Needs " + j(o)] : []
  ].join(" · ");
}
function Ye(e, t) {
  const s = t.tile;
  if (!s) return t.label;
  const o = (n) => n?.trim() ? n : t.label;
  switch (s.type) {
    case "word-bank":
      return (s.words ?? []).length ? (s.words ?? []).join(" · ") : t.label;
    case "image":
    case "diagram":
      return s.image?.src ? "" : s.image?.alt ?? t.label;
    case "answer-lines":
      return t.label;
    default:
      return o(s.body);
  }
}
function Ze(e, t) {
  const s = t.tile;
  return s ? s.type === "word-bank" ? t.label + `
` + (s.words ?? []).join(", ") : s.type === "text" && s.body ? s.body : s.type === "qr" && s.link ? t.label + `
` + s.link : s.body ? t.label + `
` + s.body : t.label : t.label;
}
function Ve(e, t, s, o) {
  const n = (o?.asNote?.text ?? t ?? "").replace(/\r\n?/g, `
`).trim(), a = n.split(`
`).map((c) => c.trim()).filter(Boolean), l = (c, r) => c.length <= r ? c : c.slice(0, r - 1).replace(/\s+\S*$/, "") + "…", d = o?.asNote?.image?.src;
  if (d && me(d)) {
    const c = l(a.join(" ") || "Picture", 120);
    return { label: l(a.join(" ") || s, 80), type: "image", image: { src: d, alt: c } };
  }
  return a.length >= 2 && /\?\s*$/.test(n) ? { label: l(a[0], 80), type: "question", body: l(a.slice(1).join(`
`), 600) } : { label: l(a.join(" ") || s, 80), type: "text", ...n && (n.length > 80 || a.length > 1) && { body: l(n, 600) } };
}
function wt(e, t) {
  const s = ae(e).filter((n) => !t || t.includes(n.id)), o = [];
  for (const n of s) {
    const a = Ie(e, n.id);
    a.length && o.push(n.label + " needs " + j(a) + ".");
    for (const l of H(e).filter((d) => d.laneId === n.id))
      (l.tile?.type === "image" || l.tile?.type === "diagram") && !l.tile.image?.src && o.push(b(l.label) + " on " + n.label + " has no picture yet: it prints as an empty frame."), l.tile?.type === "qr" && !l.tile.link && o.push(b(l.label) + " on " + n.label + " has no web address, so it prints no code.");
  }
  return o;
}
const fe = (e) => ({ type: "ref", of: "card", about: e }), X = (e, t = !1) => ({ type: "ref", of: "lane", about: e, ...t && { optional: t } }), R = (e, t, s = !0) => ({ type: "text", max: e, about: t, ...s && { optional: s } }), A = (e, t, s, o = !0) => ({ type: "integer", min: e, max: t, about: s, ...o && { optional: o } }), E = ["grid"], U = (e) => ({ type: "choice", values: [...$], about: "The kind of tile: " + $.join(", ") + ".", ...e && { optional: e } });
function et(e) {
  const t = (s) => Q.find((o) => o.kind === s);
  for (const s of e.kinds) Q.some((o) => o.kind === s.kind) || Q.push(s);
  for (const [s, o] of Object.entries(e.boards)) for (const n of o) {
    const a = t(s);
    a.boards.includes(n) || (a.boards.push(n), delete a.refusals[n]);
  }
  for (const [s, o] of Object.entries(e.fields)) Object.assign(t(s).fields, o);
  K.kinds.push(...e.rules.kinds.filter((s) => !K.kinds.includes(s))), Object.assign(K.keys, e.rules.keys);
}
const Y = {
  label: R(80, "What the tile is called in the tray and in chat (“Adding fractions”). It prints only on a tile with no words of its own. Left out, its kind: “Heading”."),
  body: R(600, "Its words, which are all a page prints of it: a heading’s title, a text block’s text, a question’s question, a term and its meaning on two lines, how many answer lines. Line breaks are kept."),
  words: { type: "words", min: 3, max: 24, each: 40, optional: !0, about: "A word bank’s words, 3 to 24." },
  image: { type: "image", optional: !0, about: "A picture it shows (src and alt). Left out, an image tile is an empty frame that prints its words." },
  alt: R(120, "What the picture shows, for an empty frame."),
  link: R(2048, "A QR code’s web address (http or https).")
};
et({
  kinds: [
    {
      kind: "set_page",
      summary: "Grid sheet: set the page’s size (letter or a4), orientation and margin (inches, ¼ to 1). Tiles that no longer fit go to the first free cell, or back to the tray.",
      intent: !1,
      fields: {
        size: { type: "choice", values: ["letter", "a4"], optional: !0, about: "letter or a4." },
        orientation: { type: "choice", values: ["portrait", "landscape"], optional: !0, about: "portrait or landscape." },
        margin: { type: "number", min: 0.25, max: 1, optional: !0, about: "Inches, in eighths: 0.25 to 1." }
      },
      boards: E,
      refusals: {}
    },
    {
      kind: "set_grid",
      summary: "Grid sheet: set how many rows (1 to 12) and columns (1 to 8) of cells a page has, and the gap between them (inches, 0 to ½). Tiles that no longer fit move to the first free cell, or back to the tray.",
      intent: !1,
      fields: { rows: A(1, 12, "Rows of cells."), cols: A(1, 8, "Columns of cells."), gutter: { type: "number", min: 0, max: 0.5, optional: !0, about: "The gap between cells, inches in sixteenths." } },
      boards: E,
      refusals: {}
    },
    {
      kind: "add_tile",
      summary: "Grid sheet: add a tile: a stamp to the tray (each drop makes a copy), or a tile on a page at a row and column (1-based). Left without a page, the first free cell of page 1, else the tray.",
      intent: !1,
      fields: {
        type: U(!1),
        ...Y,
        stamp: { type: "flag", optional: !0, about: "True for a stamp that stays in the tray." },
        page: X("The page it goes on.", !0),
        row: A(1, 12, "Its row, from 1."),
        col: A(1, 8, "Its column, from 1."),
        rows: A(1, 12, "Rows it spans."),
        cols: A(1, 8, "Columns it spans.")
      },
      boards: E,
      refusals: {}
    },
    {
      kind: "place_tile",
      summary: "Grid sheet: put a tile in a cell of a page (row and column from 1), spanning rows by columns. A stamp is copied there and stays in the tray.",
      intent: !0,
      fields: {
        card: fe("The tile, or a stamp in the tray."),
        page: X("The page, or the tray to take it off the page."),
        row: A(1, 12, "Its row, from 1.", !1),
        col: A(1, 8, "Its column, from 1.", !1),
        rows: A(1, 12, "Rows it spans."),
        cols: A(1, 8, "Columns it spans."),
        override: { type: "flag", optional: !0, about: "True to place it anyway when a limit or the sheet’s tiles refuse it, once the person agreed. Never past a page’s edge or over another tile." }
      },
      boards: E,
      refusals: {}
    },
    {
      kind: "set_tile",
      summary: "Grid sheet: change what a tile holds: its words, word bank, picture (null takes it away), QR address (null takes it away) or kind.",
      intent: !1,
      fields: {
        card: fe("The tile."),
        ...(({ label: e, ...t }) => t)(Y),
        image: { type: "image", optional: !0, about: "A picture (src and alt), or null to take it away." },
        link: { type: "text", max: 2048, min: 0, optional: !0, about: "A QR code’s web address; empty takes it away." },
        type: U(!0)
      },
      boards: E,
      refusals: {}
    },
    {
      kind: "add_page",
      summary: "Grid sheet: add a page (up to 4), empty or a copy of another (copyOf) with new tiles; shuffle reorders a copy’s terms (a different bingo card per player).",
      intent: !1,
      fields: { copyOf: X("The page to copy.", !0), shuffle: { type: "flag", optional: !0, about: "True to shuffle the copied terms among their cells." }, label: R(80, "Its name. Left out, “Page N”.") },
      boards: E,
      refusals: {}
    }
  ],
  boards: { add_rule: E, set_rule: E, remove_rule: E },
  fields: {
    set_rule: {
      types: { type: "words", min: 1, max: 12, each: 20, optional: !0, about: "Grid sheet: the kinds of tile the sheet uses." },
      per: { type: "choice", values: ["page", "sheet"], optional: !0, about: "Grid sheet: a limit per page or for the whole sheet." },
      atLeast: A(1, 12, "Grid sheet: how many of a kind every page needs."),
      rows: A(1, 12, "Grid sheet: rows a kind may span."),
      cols: A(1, 8, "Grid sheet: columns a kind may span.")
    },
    add_card: { type: U(!0), body: Y.body, image: { type: "image", optional: !0, about: "Grid sheet: the picture a note brought." }, row: A(1, 12, "Grid sheet: its row, from 1."), col: A(1, 8, "Grid sheet: its column, from 1.") }
  },
  rules: {
    kinds: ["tileTypes", "tileMax", "tileNeeds", "tileSpan"],
    keys: {
      types: { type: "array", items: { enum: [...$] }, minItems: 1, maxItems: $.length },
      type: { enum: [...$] },
      atLeast: { type: "integer", minimum: 1, maximum: 12 },
      per: { enum: ["page", "sheet"] },
      rows: { type: "integer", minimum: 1, maximum: 12 },
      cols: { type: "integer", minimum: 1, maximum: 8 }
    }
  }
});
const Z = (e) => Me(e, "tile");
function tt(e, t) {
  let s = 2166136261;
  for (const a of t) s = Math.imul(s ^ a.charCodeAt(0), 16777619);
  const o = () => (s = Math.imul(s ^ s >>> 15, 2246822507), s = Math.imul(s ^ s >>> 13, 3266489909), s ^= s >>> 16, (s >>> 0) / 4294967296), n = [...e];
  for (let a = n.length - 1; a > 0; a--) {
    const l = Math.floor(o() * (a + 1));
    [n[a], n[l]] = [n[l], n[a]];
  }
  return n.length > 1 && n.every((a, l) => a === e[l]) && n.push(n.shift()), n;
}
const st = (e) => /^free(?: space)?!?$/i.test(e.label.trim());
function we(e) {
  const t = e.image ? { alt: e.image.alt || e.alt || "", ...e.image.src && { src: e.image.src } } : e.alt && ["image", "diagram", "sticker", "panel"].includes(e.type) ? { alt: e.alt } : void 0;
  return { type: e.type, ...e.body && { body: e.body }, ...e.words && { words: e.words }, ...t && { image: t }, ...e.link && { link: e.link }, ...e.stamp && { stamp: !0 } };
}
function ge(e, t, s, o, n) {
  const a = e.grid, l = re(e, t, s, o);
  if (!l) return null;
  const { rows: d, cols: f } = I(s);
  if (l.reason === "taken") {
    const r = e.cards.find((i) => i.id === l.by);
    return d * f > 1 ? `That spot needs ${B({ rows: d, cols: f })} free cells, and ${b(r?.label ?? "a tile")} is in the way.` : `That cell holds ${b(r?.label ?? "a tile")}.`;
  }
  const c = (d * f > 1 ? "A " + B({ rows: d, cols: f }) + " " : "A ") + M[n][0];
  return s.row + d > a.cells.rows ? `${c} needs ${d} free ${d === 1 ? "row" : "rows"} here; row ${a.cells.rows} is the last.` : `${c} needs ${f} free ${f === 1 ? "column" : "columns"} here; column ${a.cells.cols} is the last.`;
}
function ot(e, t) {
  return t.lanes[0]?.id !== w ? "A grid sheet keeps its tray first. Add a page, or remove one, instead." : null;
}
function Te(e, t, s) {
  const o = e, n = o.grid, a = ae(o), l = (r, i) => {
    o.cards.length + r > N && s.refuse(`A grid sheet holds up to ${N} tiles. Remove one first.`);
  }, d = (r) => s.lane(r), f = (r, i, u, p, h, g) => {
    if (u) {
      const m = o.behaviour ? $e(o, r) : null;
      if (m && "refused" in m) {
        Ke(o, m.refused.ruleId) || s.refuse(m.refused.sentence, { laneId: h, cardId: i });
        const S = r.cards.find((y) => y.id === i), x = o.cards.find((y) => y.id === i) ?? g, v = Le(x ?? S, m.refused.sentence, s.who ?? { by: "an agent", at: (/* @__PURE__ */ new Date()).toISOString() });
        return r = { ...r, cards: r.cards.map((y) => y.id === i ? { ...y, override: v } : y) }, s.done(s.settle(r, h, i), p.replace(/\.$/, " anyway. ") + m.refused.sentence, { laneId: h, cardId: i });
      }
    }
    return s.done(s.settle(r, h, i), p, { laneId: h, cardId: i });
  }, c = (r, i, u) => {
    l(1), r.stamp && o.cards.filter((v) => v.tile?.stamp).length >= P && s.refuse(`A sheet holds up to ${P} stamps.`);
    const p = Z(o), h = { ...ue(o, r.type), ...u.rows && { rows: u.rows }, ...u.cols && { cols: u.cols } };
    let g = r.stamp ? w : u.laneId, m;
    if (g !== w)
      if (u.row !== void 0 || u.col !== void 0) {
        m = { row: (u.row ?? 1) - 1, col: (u.col ?? 1) - 1, ...h.rows > 1 && { rows: h.rows }, ...h.cols > 1 && { cols: h.cols } };
        const v = ge(o, g, m, void 0, r.type);
        v && s.refuse(v, { laneId: g });
      } else {
        const v = [h, { rows: 1, cols: h.cols }, { rows: 1, cols: 1 }];
        for (const y of v) {
          const _ = xe(o, g, y)[0];
          if (_) {
            m = { ..._, ...y.rows > 1 && { rows: y.rows }, ...y.cols > 1 && { cols: y.cols } };
            break;
          }
        }
        m || (g = w);
      }
    const S = { id: p, label: i, laneId: g, tile: r, ...m && { cell: m } }, x = m ? te(o, g) + ", " + G(m) : r.stamp ? "the tray, as a stamp" : u.laneId === w ? "the tray" : "the tray: " + te(o, u.laneId) + " has no free cell";
    return s.done(s.settle({ ...o, cards: [...o.cards, S] }, g, p), "Added " + b(i) + " to " + x + ".", { laneId: g, cardId: p });
  };
  switch (t.kind) {
    case "add_card": {
      const r = s.lane(t.lane), i = t.type ?? "text", u = we({ type: i, body: t.body, image: t.image });
      return c(u, (t.label?.trim() || F(i)).slice(0, 80), { laneId: r.id, row: t.row, col: t.col });
    }
    case "add_tile": {
      t.type === "word-bank" && !t.words?.length && s.refuse("Say the words that go in the bank: 3 to 24 of them.");
      const r = we(t), i = t.page !== void 0 ? d(t.page) : a[0];
      return c(r, (t.label?.trim() || F(t.type)).slice(0, 80), { laneId: i.id, row: t.row, col: t.col, rows: t.rows, cols: t.cols });
    }
    case "place_tile": {
      const r = s.card(t.card), i = d(t.page), u = r.tile.type;
      if (i.id === w) {
        if (r.tile?.stamp || r.laneId === w) return s.done(o, b(r.label) + " is in the tray already.", { laneId: w, cardId: r.id });
        const { cell: y, override: _, ...T } = r, k = { ...o, cards: [...o.cards.filter((O) => O.id !== r.id), { ...T, laneId: w }] };
        return s.done(s.settle(k, w, r.id), "Put " + b(r.label) + " back in the tray.", { laneId: w, cardId: r.id });
      }
      const p = r.laneId === i.id && r.cell ? I(r.cell) : ue(o, u), h = { rows: t.rows ?? p.rows, cols: t.cols ?? p.cols }, g = { row: t.row - 1, col: t.col - 1, ...h.rows > 1 && { rows: h.rows }, ...h.cols > 1 && { cols: h.cols } }, m = !!r.tile?.stamp, S = ge(o, i.id, g, m ? void 0 : r.id, u);
      S && s.refuse(S, { laneId: i.id, cardId: r.id });
      const x = h.rows * h.cols > 1 ? ", spanning " + B(h) : "";
      if (m) {
        l(1);
        const y = Z(o), { stamp: _, ...T } = r.tile, k = { id: y, label: r.label, laneId: i.id, tile: T, cell: g, ...r.look && { look: r.look } };
        return f({ ...o, cards: [...o.cards, k] }, y, t.override, "Put a copy of " + b(r.label) + " on " + i.label + ", " + G(g) + x + ".", i.id, r);
      }
      if (r.laneId === i.id && r.cell && JSON.stringify(r.cell) === JSON.stringify(g)) return s.done(o, b(r.label) + " is there already.", { laneId: i.id, cardId: r.id });
      const v = { ...r, laneId: i.id, cell: g };
      return f({ ...o, cards: o.cards.map((y) => y.id === r.id ? v : y) }, r.id, t.override, "Put " + b(r.label) + " on " + i.label + ", " + G(g) + x + ".", i.id);
    }
    case "move_card": {
      const r = s.card(t.card), i = s.lane(t.lane);
      return i.id === w ? Te(e, { kind: "place_tile", card: { id: r.id }, page: { id: w }, row: 1, col: 1 }, s) : r.laneId === i.id ? s.done(o, b(r.label) + " is on " + i.label + " already.", { laneId: i.id, cardId: r.id }) : s.refuse("Say where on the page: row and column.", { laneId: i.id, cardId: r.id });
    }
    case "set_tile": {
      const r = s.card(t.card), i = { ...r.tile };
      t.type !== void 0 && (i.type = t.type), t.body !== void 0 && (t.body.trim() ? i.body = t.body : delete i.body), t.words !== void 0 && (i.words = t.words), i.type !== "word-bank" && delete i.words, t.image === null ? delete i.image : t.image !== void 0 ? i.image = { alt: t.image.alt, ...t.image.src && { src: t.image.src } } : t.alt !== void 0 && (i.image = { ...i.image, alt: t.alt }), t.link === null || t.link === "" ? delete i.link : t.link !== void 0 && (i.link = t.link), i.type === "word-bank" && !i.words && s.refuse("Say the words that go in the bank: 3 to 24 of them.", { cardId: r.id });
      const u = { ...o, cards: o.cards.map((p) => p.id === r.id ? { ...p, tile: i } : p) };
      return s.done(s.settle(u, r.laneId, r.id), "Changed " + b(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_page":
    case "set_grid": {
      const r = t.kind === "set_page" ? { ...n, page: { size: t.size ?? n.page.size, orientation: t.orientation ?? n.page.orientation, margin: t.margin ?? n.page.margin } } : { ...n, cells: { rows: t.rows ?? n.cells.rows, cols: t.cols ?? n.cells.cols, gutter: t.gutter ?? n.cells.gutter } }, i = ke(r);
      i && s.refuse(i);
      const u = je({ ...o, grid: r }, w), p = t.kind === "set_page" ? "Made it " + se(r.page.size) + " " + r.page.orientation + (t.margin !== void 0 ? ", with " + ye(r.page.margin) + " margins" : "") + "." : t.rows !== void 0 && t.cols !== void 0 ? `Made it ${r.cells.rows} ${r.cells.rows === 1 ? "row" : "rows"} by ${r.cells.cols} ${r.cells.cols === 1 ? "column" : "columns"}.` : t.cols !== void 0 ? `Made it ${r.cells.cols} ${r.cells.cols === 1 ? "column" : "columns"}.` : t.rows !== void 0 ? `Made it ${r.cells.rows} ${r.cells.rows === 1 ? "row" : "rows"}.` : r.cells.gutter ? `Cells are ${ye(r.cells.gutter)} apart now.` : "Cells touch now: no gaps.", h = u.sent.map((g) => ` ${b(g.label)} went back to the tray: no ${B(g.span)} room left.`).join("");
      return s.done(s.settle(u.board), p + h);
    }
    case "add_page": {
      o.lanes.length >= 5 && s.refuse("A grid sheet holds up to 4 pages. Remove one first.");
      let r = 1;
      for (; o.lanes.some((x) => x.id === "page-" + r); ) r++;
      const i = "page-" + r, u = (t.label?.trim() || "Page " + (a.length + 1)).slice(0, 80), p = t.copyOf !== void 0 ? d(t.copyOf) : null;
      p?.id === w && s.refuse("Copy a page, not the tray.");
      let h = o.cards;
      const g = [...o.lanes, { id: i, label: u }];
      if (p) {
        const x = H(o).filter((_) => _.laneId === p.id);
        o.cards.length + x.length > N && s.refuse(`${u} would need ${x.length} more tiles; a sheet holds ${N}.`);
        let v = { ...o, lanes: g };
        const y = x.map((_) => {
          const T = Z(v), { override: k, noteId: O, ...Ee } = _, de = { ...Ee, id: T, laneId: i };
          return v = { ...v, cards: [...v.cards, de] }, de;
        });
        if (t.shuffle) {
          const _ = y.filter((k) => k.tile?.type === "term" && !st(k)), T = tt(_.map((k) => ({ label: k.label, tile: k.tile, look: k.look })), i);
          _.forEach((k, O) => {
            k.label = T[O].label, k.tile = T[O].tile, T[O].look ? k.look = T[O].look : delete k.look;
          });
        }
        h = [...o.cards, ...y];
      }
      const m = { ...o, lanes: g, cards: h, ...o.presentationOrder && { presentationOrder: [...o.presentationOrder, i] } }, S = p ? "a copy of " + p.label + (t.shuffle ? ", its terms shuffled" : "") : "an empty page";
      return s.done(s.settle(m, i), "Added " + b(u) + ": " + S + ".", { laneId: i });
    }
    case "remove_lane": {
      const r = s.lane(t.lane);
      r.id === w && s.refuse("The tray stays: it holds the tiles people add.", { laneId: r.id }), r.id === o.lanes[1].id && s.refuse(r.label + " stays: a sheet has at least one page.", { laneId: r.id });
      const i = o.cards.filter((p) => p.laneId === r.id).length, u = {
        ...o,
        lanes: o.lanes.filter((p) => p.id !== r.id),
        cards: o.cards.filter((p) => p.laneId !== r.id),
        ...o.presentationOrder && { presentationOrder: o.presentationOrder.filter((p) => p !== r.id) }
      };
      return s.done(s.settle(u), "Removed " + b(r.label) + (i ? " and its " + i + (i === 1 ? " tile" : " tiles") : "") + ".");
    }
    case "remove_card": {
      const r = s.card(t.card), i = { ...o, cards: o.cards.filter((u) => u.id !== r.id) };
      return s.done(s.settle(i, r.laneId), "Removed the tile " + b(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_lane_capacity":
      return s.refuse("A page holds as many tiles as it has cells: change the grid instead.", { code: "not_on_this_board" });
  }
  return null;
}
const ye = (e) => ({ 0.25: "quarter-inch", 0.5: "half-inch", 0.75: "three-quarter-inch", 1: "one-inch", 0.125: "eighth-inch", 0.0625: "sixteenth-inch" })[e] ?? e + "-inch", rt = {
  kind: "grid",
  cards: [N, `A grid sheet holds up to ${N} tiles.`],
  rulebook: Xe,
  drags: (e) => JSON.stringify([e.grid, le(e)]),
  fixed: ot,
  readCard(e, t) {
    t.tile = Pe(e.tile), e.cell !== void 0 && (t.cell = We(e.cell));
  },
  readBoard(e, t) {
    t.grid = Ge(e.grid);
  },
  validate: Fe,
  planMove(e, t, s) {
    const o = e.cards.find((l) => l.id === t);
    if (!o || !e.lanes.some((l) => l.id === s)) return null;
    if (o.laneId === s) return e;
    if (s !== w || o.tile?.stamp) return null;
    const { cell: n, ...a } = o;
    return { ...e, cards: [...e.cards.filter((l) => l.id !== t), { ...a, laneId: s }] };
  },
  refusal(e, t, s) {
    const o = e.cards.find((n) => n.id === t);
    return !o || o.laneId === s || s === w ? null : "Say where on the page: row and column.";
  },
  caption: Ue,
  cardText: Ye,
  noteText: Ze,
  fromNote: Ve,
  newCard: () => "tile",
  renamed: (e, t, s) => ({ label: s.replace(/\s+/g, " ").trim().slice(0, 80), edits: [] }),
  edit: Te
};
Se(rt);
const nt = (e) => ({
  version: 1,
  rev: 0,
  rules: e.map((t, s) => ({ id: "rule-" + (s + 1), on: !0, severity: "refuse", set: { by: "Slatebox", at: "2026-11-25T00:00:00.000Z", via: "preset" }, ...t }))
});
function ie(e, t, s, o, n, a = {}) {
  let l = 0;
  const d = () => "tile-" + ++l, f = (c, r) => c.map(([i, u, p]) => ({ id: d(), label: i, laneId: r, tile: u, cell: p }));
  return {
    version: 1,
    kind: "grid",
    title: e,
    grid: t,
    lanes: [{ id: w, label: "Tiles" }, { id: "page-1", label: "Page 1" }, ...(a.pages ?? []).map((c, r) => ({ id: "page-" + (r + 2), label: "Page " + (r + 2) }))],
    cards: [
      ...s.map(([c, r]) => ({ id: d(), label: c, laneId: w, tile: { ...r, stamp: !0 } })),
      ...f(o, "page-1"),
      ...(a.pages ?? []).flatMap((c, r) => f(c, "page-" + (r + 2)))
    ],
    behaviour: nt(n)
  };
}
const ce = (e, t, s = 0.125) => ({ page: { size: "letter", orientation: "portrait", margin: 0.5 }, cells: { rows: e, cols: t, gutter: s } });
function at() {
  return ie("Fractions practice", ce(6, 2), [
    ["Heading", { type: "heading", body: `Worksheet
Name: ______  Date: ______` }],
    ["Question", { type: "question", body: "What is 1/2 + 1/4?" }],
    ["Answer lines", { type: "answer-lines", body: "3" }],
    ["Word bank", { type: "word-bank", words: ["numerator", "denominator", "equivalent"] }]
  ], [
    ["Fractions practice", { type: "heading", body: `Fractions practice
Name: ______  Date: ______` }, { row: 0, col: 0, cols: 2 }],
    ["Adding fractions", { type: "question", body: "What is 1/2 + 1/4?" }, { row: 1, col: 0 }],
    ["Show your work", { type: "answer-lines", body: "3" }, { row: 1, col: 1 }],
    ["Shade the bar", { type: "question", body: "Shade 3/8 of a bar split into 8 equal parts." }, { row: 2, col: 0 }],
    ["Your answer", { type: "answer-lines", body: "2" }, { row: 2, col: 1 }],
    ["Compare", { type: "question", body: "Which is larger, 2/3 or 3/5? Explain how you know." }, { row: 3, col: 0 }],
    ["Words to use", { type: "word-bank", words: ["numerator", "denominator", "equivalent", "whole"] }, { row: 5, col: 0, cols: 2 }]
  ], [{ kind: "tileMax", type: "heading", max: 1, per: "page" }, { kind: "tileNeeds", type: "heading", atLeast: 1, per: "page" }, { kind: "tileMax", type: "question", max: 6, per: "page" }]);
}
const lt = [
  "Lion",
  "Tiger",
  "Zebra",
  "Giraffe",
  "Panda",
  "Koala",
  "Otter",
  "Eagle",
  "Shark",
  "Whale",
  "Camel",
  "Rhino",
  "Hippo",
  "Moose",
  "Bison",
  "Llama",
  "Gecko",
  "Parrot",
  "Penguin",
  "Dolphin",
  "Fox",
  "Wolf",
  "Bear",
  "Owl"
];
function it() {
  const e = [];
  let t = 0;
  for (let s = 1; s <= 5; s++) for (let o = 0; o < 5; o++)
    e.push(s === 3 && o === 2 ? ["Free", { type: "term" }, { row: s, col: o }] : [lt[t++], { type: "term" }, { row: s, col: o }]);
  return ie(
    "Animal bingo",
    ce(6, 5),
    [["Title", { type: "heading" }], ["Animal", { type: "term" }]],
    [["Animal bingo", { type: "heading" }, { row: 0, col: 0, cols: 5 }], ...e],
    [{ kind: "tileMax", type: "heading", max: 1, per: "page" }, { kind: "tileNeeds", type: "heading", atLeast: 1, per: "page" }, { kind: "tileTypes", types: ["heading", "term"] }]
  );
}
function ct() {
  const e = [
    ["Photosynthesis", "How plants make food from light"],
    ["Mitosis", "A cell splitting into two"],
    ["Evaporation", "Liquid turning into gas"],
    ["Gravity", "The pull between masses"],
    ["Habitat", "Where a living thing lives"],
    ["Predator", "An animal that hunts others"],
    ["Erosion", "Land worn away by wind or water"],
    ["Fossil", "Remains kept in rock"]
  ];
  return ie(
    "Science flashcards",
    ce(4, 2, 0.25),
    [["Term", { type: "term", body: `A term
What it means` }], ["Picture", { type: "image", image: { alt: "A picture of the term" } }]],
    e.map(([t, s], o) => [t, { type: "term", body: t + `
` + s }, { row: Math.floor(o / 2), col: o % 2 }]),
    [{ kind: "tileTypes", types: ["term", "image"] }]
  );
}
const gt = { worksheet: at, bingo: it, flashcards: ct };
export {
  P as GRID_MAX_STAMPS,
  N as GRID_MAX_TILES,
  w as GRID_TRAY,
  V as MIN_CELL,
  C as PX_PER_INCH,
  it as bingoSample,
  ht as cellAt,
  ut as cellBox,
  D as cellSize,
  ke as cellSizeProblem,
  $e as checkGrid,
  ue as defaultSpan,
  re as fits,
  ct as flashcardSample,
  xe as freeCells,
  Ue as gridCaption,
  Ye as gridCardText,
  Xe as gridFamily,
  Ve as gridFromNote,
  Ie as gridNeeds,
  Ze as gridNoteText,
  Ke as gridOverridable,
  ae as gridPages,
  wt as gridPrintProblems,
  _e as gridRuleSentence,
  rt as gridRules,
  gt as gridSamples,
  ie as gridSheet,
  $ as gridTileTypes,
  oe as inBounds,
  Ae as occupancy,
  se as pageName,
  be as pageSize,
  pt as printSize,
  H as readingOrder,
  je as reflow,
  I as spanOf,
  F as tileName,
  ft as tileTypeOf,
  W as tileWords,
  ze as usedCells,
  Fe as validateGrid,
  at as worksheetSample
};
