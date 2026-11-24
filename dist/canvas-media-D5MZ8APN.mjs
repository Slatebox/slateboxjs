const w = ["youtube", "vimeo", "loom"], b = Object.freeze({
  youtube: "YouTube",
  vimeo: "Vimeo",
  loom: "Loom"
}), I = Object.freeze({ width: 320, height: 180 }), m = Object.freeze({ urlLength: 2e3, titleLength: 300, authorLength: 120, startSeconds: 86400 }), f = /^[A-Za-z0-9_-]{11}$/, a = /^\d{1,12}$/, c = /^[0-9a-f]{6,20}$/i, d = /^[0-9a-f]{32}$/i, v = /* @__PURE__ */ new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]), g = /* @__PURE__ */ new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]), y = /* @__PURE__ */ new Set(["loom.com", "www.loom.com"]);
function i(t) {
  if (!t) return;
  const o = String(t).trim().toLowerCase();
  let r;
  if (/^\d+$/.test(o)) r = Number(o);
  else {
    const e = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(o);
    if (!e || !e[0]) return;
    r = Number(e[1] || 0) * 3600 + Number(e[2] || 0) * 60 + Number(e[3] || 0);
  }
  return Number.isSafeInteger(r) && r > 0 && r <= m.startSeconds ? r : void 0;
}
function l(t) {
  return t.hostname.toLowerCase().replace(/\.$/, "");
}
function S(t) {
  const o = l(t), r = t.pathname.split("/").filter(Boolean);
  let e;
  if (o === "youtu.be" ? e = r[0] : r[0] === "watch" ? e = t.searchParams.get("v") ?? void 0 : ["shorts", "embed", "live", "v"].includes(r[0]) && (e = r[1]), !e || !f.test(e)) return null;
  const s = i(t.searchParams.get("t") ?? t.searchParams.get("start"));
  return { provider: "youtube", id: e, url: `https://www.youtube.com/watch?v=${e}`, ...s ? { start: s } : {} };
}
function $(t) {
  const o = l(t), r = t.pathname.split("/").filter(Boolean);
  let e, s;
  if (o === "player.vimeo.com") {
    if (r[0] !== "video") return null;
    e = r[1], s = t.searchParams.get("h") ?? void 0;
  } else {
    const n = r.findIndex((p) => a.test(p));
    if (n < 0) return null;
    e = r[n];
    const u = r[n + 1];
    u && c.test(u) && (s = u);
  }
  if (!e || !a.test(e)) return null;
  s !== void 0 && !c.test(s) && (s = void 0);
  const h = i((t.hash.match(/t=([0-9hms]+)/i) || [])[1]);
  return {
    provider: "vimeo",
    id: e,
    url: s ? `https://vimeo.com/${e}/${s}` : `https://vimeo.com/${e}`,
    ...s ? { hash: s } : {},
    ...h ? { start: h } : {}
  };
}
function O(t) {
  const o = t.pathname.split("/").filter(Boolean);
  if (!["share", "embed"].includes(o[0])) return null;
  const r = o[1] ? o[1].split("-").pop() : void 0;
  if (!r || !d.test(r)) return null;
  const e = r.toLowerCase(), s = i(t.searchParams.get("t"));
  return { provider: "loom", id: e, url: `https://www.loom.com/share/${e}`, ...s ? { start: s } : {} };
}
function L(t) {
  if (typeof t != "string") return null;
  const o = t.trim();
  if (!o || o.length > m.urlLength || /\s/.test(o)) return null;
  let r;
  try {
    r = new URL(/^[a-z][a-z0-9+.-]*:/i.test(o) ? o : `https://${o}`);
  } catch {
    return null;
  }
  if (r.protocol !== "https:" && r.protocol !== "http:" || r.username || r.password || r.port) return null;
  const e = l(r);
  return v.has(e) ? S(r) : g.has(e) ? $(r) : y.has(e) ? O(r) : null;
}
function E(t, { play: o = !1 } = {}) {
  const r = o ? "1" : "0";
  switch (t?.provider) {
    case "youtube": {
      if (!f.test(t.id)) return null;
      const e = new URLSearchParams({ autoplay: r, rel: "0", playsinline: "1", modestbranding: "1" });
      return t.start && e.set("start", String(t.start)), `https://www.youtube-nocookie.com/embed/${t.id}?${e}`;
    }
    case "vimeo": {
      if (!a.test(t.id)) return null;
      const e = new URLSearchParams({ autoplay: r, dnt: "1" });
      return t.hash && c.test(t.hash) && e.set("h", t.hash), `https://player.vimeo.com/video/${t.id}?${e}${t.start ? `#t=${t.start}s` : ""}`;
    }
    case "loom": {
      if (!d.test(t.id)) return null;
      const e = new URLSearchParams({ autoplay: r, hide_owner: "true", hideEmbedTopBar: "true" });
      return t.start && e.set("t", String(t.start)), `https://www.loom.com/embed/${t.id}?${e}`;
    }
    default:
      return null;
  }
}
function _(t, o) {
  t.media = { ...o }, t.text = "", t.shape = "rectangle", t.vectorPath = "rectangle", t.shapeHint = "rectangle", t.imageFit = "cover", t.backgroundColor = "#111418", t.borderColor = "#111418", t.showTextTab = !1, o.poster ? (t.image = o.poster, t.imageOrigWidth = o.posterWidth || 480, t.imageOrigHeight = o.posterHeight || 360) : delete t.image;
}
function M(t) {
  if (!t || !w.includes(t.provider)) return "Video";
  const o = b[t.provider];
  return t.title ? `Video: ${t.title} (${o})` : `${o} video`;
}
export {
  I as M,
  b as a,
  E as b,
  M as m,
  L as p,
  _ as s
};
