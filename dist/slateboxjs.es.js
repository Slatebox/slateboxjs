const $e = {}, Jn = [];
function R(i, t) {
  if (Array.isArray(i)) {
    for (const e of i)
      R(e, t);
    return;
  }
  if (typeof i == "object") {
    for (const e in i)
      R(e, i[e]);
    return;
  }
  ti(Object.getOwnPropertyNames(t)), $e[i] = Object.assign($e[i] || {}, t);
}
function st(i) {
  return $e[i] || {};
}
function ks() {
  return [...new Set(Jn)];
}
function ti(i) {
  Jn.push(...i);
}
function hn(i, t) {
  let e;
  const n = i.length, s = [];
  for (e = 0; e < n; e++)
    s.push(t(i[e]));
  return s;
}
function As(i, t) {
  let e;
  const n = i.length, s = [];
  for (e = 0; e < n; e++)
    t(i[e]) && s.push(i[e]);
  return s;
}
function Be(i) {
  return i % 360 * Math.PI / 180;
}
function Rs(i) {
  return i.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function ei(i) {
  return i.charAt(0).toUpperCase() + i.slice(1);
}
function Yt(i, t, e, n) {
  return (t == null || e == null) && (n = n || i.bbox(), t == null ? t = n.width / n.height * e : e == null && (e = n.height / n.width * t)), {
    width: t,
    height: e
  };
}
function We(i, t) {
  const e = i.origin;
  let n = i.ox != null ? i.ox : i.originX != null ? i.originX : "center", s = i.oy != null ? i.oy : i.originY != null ? i.originY : "center";
  e != null && ([n, s] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof n == "string", r = typeof s == "string";
  if (o || r) {
    const { height: a, width: l, x: c, y: h } = t.bbox();
    o && (n = n.includes("left") ? c : n.includes("right") ? c + l : c + l / 2), r && (s = s.includes("top") ? h : s.includes("bottom") ? h + a : h + a / 2);
  }
  return [n, s];
}
const Ns = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), je = (i) => Ns.has(i.nodeName), ni = (i, t, e = {}) => {
  const n = { ...t };
  for (const s in n)
    n[s].valueOf() === e[s] && delete n[s];
  Object.keys(n).length ? i.node.setAttribute("data-svgjs", JSON.stringify(n)) : (i.node.removeAttribute("data-svgjs"), i.node.removeAttribute("svgjs:data"));
}, dn = "http://www.w3.org/2000/svg", Ds = "http://www.w3.org/1999/xhtml", Ge = "http://www.w3.org/2000/xmlns/", ce = "http://www.w3.org/1999/xlink", D = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function un() {
  return D.window;
}
class fn {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}
const Dt = {}, pn = "___SYMBOL___ROOT___";
function se(i, t = dn) {
  return D.document.createElementNS(t, i);
}
function it(i, t = !1) {
  if (i instanceof fn) return i;
  if (typeof i == "object")
    return He(i);
  if (i == null)
    return new Dt[pn]();
  if (typeof i == "string" && i.trim().charAt(0) !== "<")
    return He(D.document.querySelector(i));
  const e = t ? D.document.createElement("div") : se("svg");
  return e.innerHTML = i.trim(), i = He(e.firstElementChild), e.removeChild(e.firstElementChild), i;
}
function F(i, t) {
  return t && (t instanceof D.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : se(i);
}
function pt(i) {
  if (!i) return null;
  if (i.instance instanceof fn) return i.instance;
  if (i.nodeName === "#document-fragment")
    return new Dt.Fragment(i);
  let t = ei(i.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : Dt[t] || (t = "Dom"), new Dt[t](i);
}
let He = pt;
function P(i, t = i.name, e = !1) {
  return Dt[t] = i, e && (Dt[pn] = i), ti(Object.getOwnPropertyNames(i.prototype)), i;
}
function Ps(i) {
  return Dt[i];
}
let Is = 1e3;
function ii(i) {
  return "Svgjs" + ei(i) + Is++;
}
function si(i) {
  for (let t = i.children.length - 1; t >= 0; t--)
    si(i.children[t]);
  return i.id && (i.id = ii(i.nodeName)), i;
}
function k(i, t) {
  let e, n;
  for (i = Array.isArray(i) ? i : [i], n = i.length - 1; n >= 0; n--)
    for (e in t)
      i[n].prototype[e] = t[e];
}
function U(i) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? i.apply(this, t.slice(0, -1)).attr(e) : i.apply(this, t);
  };
}
function Os() {
  return this.parent().children();
}
function zs() {
  return this.parent().index(this);
}
function Ls() {
  return this.siblings()[this.position() + 1];
}
function Bs() {
  return this.siblings()[this.position() - 1];
}
function Gs() {
  const i = this.position();
  return this.parent().add(this.remove(), i + 1), this;
}
function Hs() {
  const i = this.position();
  return this.parent().add(this.remove(), i ? i - 1 : 0), this;
}
function Us() {
  return this.parent().add(this.remove()), this;
}
function Fs() {
  return this.parent().add(this.remove(), 0), this;
}
function Zs(i) {
  i = it(i), i.remove();
  const t = this.position();
  return this.parent().add(i, t), this;
}
function Ys(i) {
  i = it(i), i.remove();
  const t = this.position();
  return this.parent().add(i, t + 1), this;
}
function Xs(i) {
  return i = it(i), i.before(this), this;
}
function $s(i) {
  return i = it(i), i.after(this), this;
}
R("Dom", {
  siblings: Os,
  position: zs,
  next: Ls,
  prev: Bs,
  forward: Gs,
  backward: Hs,
  front: Us,
  back: Fs,
  before: Zs,
  after: Ys,
  insertBefore: Xs,
  insertAfter: $s
});
const oi = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, Ws = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, js = /rgb\((\d+),(\d+),(\d+)\)/, Vs = /(#[a-z_][a-z0-9\-_]*)/i, qs = /\)\s*,?\s*/, Ks = /\s/g, zn = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, Ln = /^rgb\(/, Bn = /^(\s+)?$/, Gn = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Qs = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, _t = /[\s,]+/, gn = /[MLHVCSQTAZ]/i;
function Js() {
  const i = this.attr("class");
  return i == null ? [] : i.trim().split(_t);
}
function to(i) {
  return this.classes().indexOf(i) !== -1;
}
function eo(i) {
  if (!this.hasClass(i)) {
    const t = this.classes();
    t.push(i), this.attr("class", t.join(" "));
  }
  return this;
}
function no(i) {
  return this.hasClass(i) && this.attr(
    "class",
    this.classes().filter(function(t) {
      return t !== i;
    }).join(" ")
  ), this;
}
function io(i) {
  return this.hasClass(i) ? this.removeClass(i) : this.addClass(i);
}
R("Dom", {
  classes: Js,
  hasClass: to,
  addClass: eo,
  removeClass: no,
  toggleClass: io
});
function so(i, t) {
  const e = {};
  if (arguments.length === 0)
    return this.node.style.cssText.split(/\s*;\s*/).filter(function(n) {
      return !!n.length;
    }).forEach(function(n) {
      const s = n.split(/\s*:\s*/);
      e[s[0]] = s[1];
    }), e;
  if (arguments.length < 2) {
    if (Array.isArray(i)) {
      for (const n of i) {
        const s = n;
        e[n] = this.node.style.getPropertyValue(s);
      }
      return e;
    }
    if (typeof i == "string")
      return this.node.style.getPropertyValue(i);
    if (typeof i == "object")
      for (const n in i)
        this.node.style.setProperty(
          n,
          i[n] == null || Bn.test(i[n]) ? "" : i[n]
        );
  }
  return arguments.length === 2 && this.node.style.setProperty(
    i,
    t == null || Bn.test(t) ? "" : t
  ), this;
}
function oo() {
  return this.css("display", "");
}
function ro() {
  return this.css("display", "none");
}
function ao() {
  return this.css("display") !== "none";
}
R("Dom", {
  css: so,
  show: oo,
  hide: ro,
  visible: ao
});
function lo(i, t, e) {
  if (i == null)
    return this.data(
      hn(
        As(
          this.node.attributes,
          (n) => n.nodeName.indexOf("data-") === 0
        ),
        (n) => n.nodeName.slice(5)
      )
    );
  if (i instanceof Array) {
    const n = {};
    for (const s of i)
      n[s] = this.data(s);
    return n;
  } else if (typeof i == "object")
    for (t in i)
      this.data(t, i[t]);
  else if (arguments.length < 2)
    try {
      return JSON.parse(this.attr("data-" + i));
    } catch {
      return this.attr("data-" + i);
    }
  else
    this.attr(
      "data-" + i,
      t === null ? null : e === !0 || typeof t == "string" || typeof t == "number" ? t : JSON.stringify(t)
    );
  return this;
}
R("Dom", { data: lo });
function co(i, t) {
  if (typeof arguments[0] == "object")
    for (const e in i)
      this.remember(e, i[e]);
  else {
    if (arguments.length === 1)
      return this.memory()[i];
    this.memory()[i] = t;
  }
  return this;
}
function ho() {
  if (arguments.length === 0)
    this._memory = {};
  else
    for (let i = arguments.length - 1; i >= 0; i--)
      delete this.memory()[arguments[i]];
  return this;
}
function uo() {
  return this._memory = this._memory || {};
}
R("Dom", { remember: co, forget: ho, memory: uo });
function fo(i) {
  return i.length === 4 ? [
    "#",
    i.substring(1, 2),
    i.substring(1, 2),
    i.substring(2, 3),
    i.substring(2, 3),
    i.substring(3, 4),
    i.substring(3, 4)
  ].join("") : i;
}
function po(i) {
  const t = Math.round(i), n = Math.max(0, Math.min(255, t)).toString(16);
  return n.length === 1 ? "0" + n : n;
}
function Lt(i, t) {
  for (let e = t.length; e--; )
    if (i[t[e]] == null)
      return !1;
  return !0;
}
function go(i, t) {
  const e = Lt(i, "rgb") ? { _a: i.r, _b: i.g, _c: i.b, _d: 0, space: "rgb" } : Lt(i, "xyz") ? { _a: i.x, _b: i.y, _c: i.z, _d: 0, space: "xyz" } : Lt(i, "hsl") ? { _a: i.h, _b: i.s, _c: i.l, _d: 0, space: "hsl" } : Lt(i, "lab") ? { _a: i.l, _b: i.a, _c: i.b, _d: 0, space: "lab" } : Lt(i, "lch") ? { _a: i.l, _b: i.c, _c: i.h, _d: 0, space: "lch" } : Lt(i, "cmyk") ? { _a: i.c, _b: i.m, _c: i.y, _d: i.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
  return e.space = t || e.space, e;
}
function mo(i) {
  return i === "lab" || i === "xyz" || i === "lch";
}
function Ue(i, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? i + (t - i) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? i + (t - i) * (2 / 3 - e) * 6 : i;
}
class L {
  constructor(...t) {
    this.init(...t);
  }
  // Test if given value is a color
  static isColor(t) {
    return t && (t instanceof L || this.isRgb(t) || this.test(t));
  }
  // Test if given value is an rgb object
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  /*
  Generating random colors
  */
  static random(t = "vibrant", e) {
    const { random: n, round: s, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * n() + 57, l = 38 * n() + 45, c = 360 * n();
      return new L(a, l, c, "lch");
    } else if (t === "sine") {
      e = e ?? n();
      const a = s(80 * o(2 * r * e / 0.5 + 0.01) + 150), l = s(50 * o(2 * r * e / 0.5 + 4.6) + 200), c = s(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new L(a, l, c);
    } else if (t === "pastel") {
      const a = 8 * n() + 86, l = 17 * n() + 9, c = 360 * n();
      return new L(a, l, c, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * n(), l = 50 * n() + 86, c = 360 * n();
      return new L(a, l, c, "lch");
    } else if (t === "rgb") {
      const a = 255 * n(), l = 255 * n(), c = 255 * n();
      return new L(a, l, c);
    } else if (t === "lab") {
      const a = 100 * n(), l = 256 * n() - 128, c = 256 * n() - 128;
      return new L(a, l, c, "lab");
    } else if (t === "grey") {
      const a = 255 * n();
      return new L(a, a, a);
    } else
      throw new Error("Unsupported random color mode");
  }
  // Test if given value is a color string
  static test(t) {
    return typeof t == "string" && (zn.test(t) || Ln.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: n } = this.rgb(), [s, o, r] = [t, e, n].map((u) => u / 255), a = Math.min(1 - s, 1 - o, 1 - r);
    if (a === 1)
      return new L(0, 0, 0, 1, "cmyk");
    const l = (1 - s - a) / (1 - a), c = (1 - o - a) / (1 - a), h = (1 - r - a) / (1 - a);
    return new L(l, c, h, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: n } = this.rgb(), [s, o, r] = [t, e, n].map((p) => p / 255), a = Math.max(s, o, r), l = Math.min(s, o, r), c = (a + l) / 2, h = a === l, d = a - l, u = h ? 0 : c > 0.5 ? d / (2 - a - l) : d / (a + l), f = h ? 0 : a === s ? ((o - r) / d + (o < r ? 6 : 0)) / 6 : a === o ? ((r - s) / d + 2) / 6 : a === r ? ((s - o) / d + 4) / 6 : 0;
    return new L(360 * f, 100 * u, 100 * c, "hsl");
  }
  init(t = 0, e = 0, n = 0, s = 0, o = "rgb") {
    if (t = t || 0, this.space)
      for (const d in this.space)
        delete this[this.space[d]];
    if (typeof t == "number")
      o = typeof s == "string" ? s : o, s = typeof s == "string" ? 0 : s, Object.assign(this, { _a: t, _b: e, _c: n, _d: s, space: o });
    else if (t instanceof Array)
      this.space = e || (typeof t[3] == "string" ? t[3] : t[4]) || "rgb", Object.assign(this, { _a: t[0], _b: t[1], _c: t[2], _d: t[3] || 0 });
    else if (t instanceof Object) {
      const d = go(t, e);
      Object.assign(this, d);
    } else if (typeof t == "string")
      if (Ln.test(t)) {
        const d = t.replace(Ks, ""), [u, f, g] = js.exec(d).slice(1, 4).map((p) => parseInt(p));
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else if (zn.test(t)) {
        const d = (p) => parseInt(p, 16), [, u, f, g] = Ws.exec(fo(t)).map(d);
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: l, _d: c } = this, h = this.space === "rgb" ? { r, g: a, b: l } : this.space === "xyz" ? { x: r, y: a, z: l } : this.space === "hsl" ? { h: r, s: a, l } : this.space === "lab" ? { l: r, a, b: l } : this.space === "lch" ? { l: r, c: a, h: l } : this.space === "cmyk" ? { c: r, m: a, y: l, k: c } : {};
    Object.assign(this, h);
  }
  lab() {
    const { x: t, y: e, z: n } = this.xyz(), s = 116 * e - 16, o = 500 * (t - e), r = 200 * (e - n);
    return new L(s, o, r, "lab");
  }
  lch() {
    const { l: t, a: e, b: n } = this.lab(), s = Math.sqrt(e ** 2 + n ** 2);
    let o = 180 * Math.atan2(n, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new L(t, s, o, "lch");
  }
  /*
  Conversion Methods
  */
  rgb() {
    if (this.space === "rgb")
      return this;
    if (mo(this.space)) {
      let { x: t, y: e, z: n } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: f, a: g, b: p } = this;
        if (this.space === "lch") {
          const { c: v, h: C } = this, A = Math.PI / 180;
          g = v * Math.cos(A * C), p = v * Math.sin(A * C);
        }
        const y = (f + 16) / 116, m = g / 500 + y, b = y - p / 200, w = 16 / 116, x = 8856e-6, _ = 7.787;
        t = 0.95047 * (m ** 3 > x ? m ** 3 : (m - w) / _), e = 1 * (y ** 3 > x ? y ** 3 : (y - w) / _), n = 1.08883 * (b ** 3 > x ? b ** 3 : (b - w) / _);
      }
      const s = t * 3.2406 + e * -1.5372 + n * -0.4986, o = t * -0.9689 + e * 1.8758 + n * 0.0415, r = t * 0.0557 + e * -0.204 + n * 1.057, a = Math.pow, l = 31308e-7, c = s > l ? 1.055 * a(s, 1 / 2.4) - 0.055 : 12.92 * s, h = o > l ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, d = r > l ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new L(255 * c, 255 * h, 255 * d);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: n } = this;
      if (t /= 360, e /= 100, n /= 100, e === 0)
        return n *= 255, new L(n, n, n);
      const s = n < 0.5 ? n * (1 + e) : n + e - n * e, o = 2 * n - s, r = 255 * Ue(o, s, t + 1 / 3), a = 255 * Ue(o, s, t), l = 255 * Ue(o, s, t - 1 / 3);
      return new L(r, a, l);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: n, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), r = 255 * (1 - Math.min(1, e * (1 - s) + s)), a = 255 * (1 - Math.min(1, n * (1 - s) + s));
      return new L(o, r, a);
    } else
      return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: n, _d: s, space: o } = this;
    return [t, e, n, s, o];
  }
  toHex() {
    const [t, e, n] = this._clamped().map(po);
    return `#${t}${e}${n}`;
  }
  toRgb() {
    const [t, e, n] = this._clamped();
    return `rgb(${t},${e},${n})`;
  }
  toString() {
    return this.toHex();
  }
  xyz() {
    const { _a: t, _b: e, _c: n } = this.rgb(), [s, o, r] = [t, e, n].map((m) => m / 255), a = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, l = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, c = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, h = (a * 0.4124 + l * 0.3576 + c * 0.1805) / 0.95047, d = (a * 0.2126 + l * 0.7152 + c * 0.0722) / 1, u = (a * 0.0193 + l * 0.1192 + c * 0.9505) / 1.08883, f = h > 8856e-6 ? Math.pow(h, 1 / 3) : 7.787 * h + 16 / 116, g = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, p = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116;
    return new L(f, g, p, "xyz");
  }
  /*
  Input and Output methods
  */
  _clamped() {
    const { _a: t, _b: e, _c: n } = this.rgb(), { max: s, min: o, round: r } = Math, a = (l) => s(0, o(r(l), 255));
    return [t, e, n].map(a);
  }
  /*
  Constructing colors
  */
}
class X {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  // Clone point
  clone() {
    return new X(this);
  }
  init(t, e) {
    const n = { x: 0, y: 0 }, s = Array.isArray(t) ? { x: t[0], y: t[1] } : typeof t == "object" ? { x: t.x, y: t.y } : { x: t, y: e };
    return this.x = s.x == null ? n.x : s.x, this.y = s.y == null ? n.y : s.y, this;
  }
  toArray() {
    return [this.x, this.y];
  }
  transform(t) {
    return this.clone().transformO(t);
  }
  // Transform point with matrix
  transformO(t) {
    N.isMatrixLike(t) || (t = new N(t));
    const { x: e, y: n } = this;
    return this.x = t.a * e + t.c * n + t.e, this.y = t.b * e + t.d * n + t.f, this;
  }
}
function yo(i, t) {
  return new X(i, t).transformO(this.screenCTM().inverseO());
}
function Bt(i, t, e) {
  return Math.abs(t - i) < 1e-6;
}
let N = class $ {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, n = t.flip && (e || t.flip === "x") ? -1 : 1, s = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * n : isFinite(t.scale) ? t.scale * n : isFinite(t.scaleX) ? t.scaleX * n : n, l = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, c = t.shear || 0, h = t.rotate || t.theta || 0, d = new X(
      t.origin || t.around || t.ox || t.originX,
      t.oy || t.originY
    ), u = d.x, f = d.y, g = new X(
      t.position || t.px || t.positionX || NaN,
      t.py || t.positionY || NaN
    ), p = g.x, y = g.y, m = new X(
      t.translate || t.tx || t.translateX,
      t.ty || t.translateY
    ), b = m.x, w = m.y, x = new X(
      t.relative || t.rx || t.relativeX,
      t.ry || t.relativeY
    ), _ = x.x, v = x.y;
    return {
      scaleX: a,
      scaleY: l,
      skewX: o,
      skewY: r,
      shear: c,
      theta: h,
      rx: _,
      ry: v,
      tx: b,
      ty: w,
      ox: u,
      oy: f,
      px: p,
      py: y
    };
  }
  static fromArray(t) {
    return { a: t[0], b: t[1], c: t[2], d: t[3], e: t[4], f: t[5] };
  }
  static isMatrixLike(t) {
    return t.a != null || t.b != null || t.c != null || t.d != null || t.e != null || t.f != null;
  }
  // left matrix, right matrix, target matrix which is overwritten
  static matrixMultiply(t, e, n) {
    const s = t.a * e.a + t.c * e.b, o = t.b * e.a + t.d * e.b, r = t.a * e.c + t.c * e.d, a = t.b * e.c + t.d * e.d, l = t.e + t.a * e.e + t.c * e.f, c = t.f + t.b * e.e + t.d * e.f;
    return n.a = s, n.b = o, n.c = r, n.d = a, n.e = l, n.f = c, n;
  }
  around(t, e, n) {
    return this.clone().aroundO(t, e, n);
  }
  // Transform around a center point
  aroundO(t, e, n) {
    const s = t || 0, o = e || 0;
    return this.translateO(-s, -o).lmultiplyO(n).translateO(s, o);
  }
  // Clones this matrix
  clone() {
    return new $(this);
  }
  // Decomposes this matrix into its affine parameters
  decompose(t = 0, e = 0) {
    const n = this.a, s = this.b, o = this.c, r = this.d, a = this.e, l = this.f, c = n * r - s * o, h = c > 0 ? 1 : -1, d = h * Math.sqrt(n * n + s * s), u = Math.atan2(h * s, h * n), f = 180 / Math.PI * u, g = Math.cos(u), p = Math.sin(u), y = (n * o + s * r) / c, m = o * d / (y * n - s) || r * d / (y * s + n), b = a - t + t * g * d + e * (y * g * d - p * m), w = l - e + t * p * d + e * (y * p * d + g * m);
    return {
      // Return the affine parameters
      scaleX: d,
      scaleY: m,
      shear: y,
      rotate: f,
      translateX: b,
      translateY: w,
      originX: t,
      originY: e,
      // Return the matrix parameters
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    };
  }
  // Check if two matrices are equal
  equals(t) {
    if (t === this) return !0;
    const e = new $(t);
    return Bt(this.a, e.a) && Bt(this.b, e.b) && Bt(this.c, e.c) && Bt(this.d, e.d) && Bt(this.e, e.e) && Bt(this.f, e.f);
  }
  // Flip matrix on x or y, at a given offset
  flip(t, e) {
    return this.clone().flipO(t, e);
  }
  flipO(t, e) {
    return t === "x" ? this.scaleO(-1, 1, e, 0) : t === "y" ? this.scaleO(1, -1, 0, e) : this.scaleO(-1, -1, t, e || t);
  }
  // Initialize
  init(t) {
    const e = $.fromArray([1, 0, 0, 1, 0, 0]);
    return t = t instanceof ot ? t.matrixify() : typeof t == "string" ? $.fromArray(t.split(_t).map(parseFloat)) : Array.isArray(t) ? $.fromArray(t) : typeof t == "object" && $.isMatrixLike(t) ? t : typeof t == "object" ? new $().transform(t) : arguments.length === 6 ? $.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  // Inverses matrix
  inverseO() {
    const t = this.a, e = this.b, n = this.c, s = this.d, o = this.e, r = this.f, a = t * s - e * n;
    if (!a) throw new Error("Cannot invert " + this);
    const l = s / a, c = -e / a, h = -n / a, d = t / a, u = -(l * o + h * r), f = -(c * o + d * r);
    return this.a = l, this.b = c, this.c = h, this.d = d, this.e = u, this.f = f, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, n = t instanceof $ ? t : new $(t);
    return $.matrixMultiply(n, e, this);
  }
  // Left multiplies by the given matrix
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, n = t instanceof $ ? t : new $(t);
    return $.matrixMultiply(e, n, this);
  }
  // Rotate matrix
  rotate(t, e, n) {
    return this.clone().rotateO(t, e, n);
  }
  rotateO(t, e = 0, n = 0) {
    t = Be(t);
    const s = Math.cos(t), o = Math.sin(t), { a: r, b: a, c: l, d: c, e: h, f: d } = this;
    return this.a = r * s - a * o, this.b = a * s + r * o, this.c = l * s - c * o, this.d = c * s + l * o, this.e = h * s - d * o + n * o - e * s + e, this.f = d * s + h * o - e * o - n * s + n, this;
  }
  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, n = 0, s = 0) {
    arguments.length === 3 && (s = n, n = e, e = t);
    const { a: o, b: r, c: a, d: l, e: c, f: h } = this;
    return this.a = o * t, this.b = r * e, this.c = a * t, this.d = l * e, this.e = c * t - n * t + n, this.f = h * e - s * e + s, this;
  }
  // Shear matrix
  shear(t, e, n) {
    return this.clone().shearO(t, e, n);
  }
  // eslint-disable-next-line no-unused-vars
  shearO(t, e = 0, n = 0) {
    const { a: s, b: o, c: r, d: a, e: l, f: c } = this;
    return this.a = s + o * t, this.c = r + a * t, this.e = l + c * t - n * t, this;
  }
  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, n = 0, s = 0) {
    arguments.length === 3 && (s = n, n = e, e = t), t = Be(t), e = Be(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: l, c, d: h, e: d, f: u } = this;
    return this.a = a + l * o, this.b = l + a * r, this.c = c + h * o, this.d = h + c * r, this.e = d + u * o - s * o, this.f = u + d * r - n * r, this;
  }
  // SkewX
  skewX(t, e, n) {
    return this.skew(t, 0, e, n);
  }
  // SkewY
  skewY(t, e, n) {
    return this.skew(0, t, e, n);
  }
  toArray() {
    return [this.a, this.b, this.c, this.d, this.e, this.f];
  }
  // Convert matrix to string
  toString() {
    return "matrix(" + this.a + "," + this.b + "," + this.c + "," + this.d + "," + this.e + "," + this.f + ")";
  }
  // Transform a matrix into another matrix by manipulating the space
  transform(t) {
    if ($.isMatrixLike(t))
      return new $(t).multiplyO(this);
    const e = $.formatTransforms(t), n = this, { x: s, y: o } = new X(e.ox, e.oy).transform(n), r = new $().translateO(e.rx, e.ry).lmultiplyO(n).translateO(-s, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(s, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const a = new X(s, o).transform(r), l = isFinite(e.px) ? e.px - a.x : 0, c = isFinite(e.py) ? e.py - a.y : 0;
      r.translateO(l, c);
    }
    return r.translateO(e.tx, e.ty), r;
  }
  // Translate matrix
  translate(t, e) {
    return this.clone().translateO(t, e);
  }
  translateO(t, e) {
    return this.e += t || 0, this.f += e || 0, this;
  }
  valueOf() {
    return {
      a: this.a,
      b: this.b,
      c: this.c,
      d: this.d,
      e: this.e,
      f: this.f
    };
  }
};
function bo() {
  return new N(this.node.getCTM());
}
function wo() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const i = this.rect(1, 1), t = i.node.getScreenCTM();
      return i.remove(), new N(t);
    }
    return new N(this.node.getScreenCTM());
  } catch {
    return console.warn(
      `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
    ), new N();
  }
}
P(N, "Matrix");
function St() {
  if (!St.nodes) {
    const i = it().size(2, 0);
    i.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), i.attr("focusable", "false"), i.attr("aria-hidden", "true");
    const t = i.path().node;
    St.nodes = { svg: i, path: t };
  }
  if (!St.nodes.svg.node.parentNode) {
    const i = D.document.body || D.document.documentElement;
    St.nodes.svg.addTo(i);
  }
  return St.nodes;
}
function ri(i) {
  return !i.width && !i.height && !i.x && !i.y;
}
function vo(i) {
  return i === D.document || (D.document.documentElement.contains || function(t) {
    for (; t.parentNode; )
      t = t.parentNode;
    return t === D.document;
  }).call(D.document.documentElement, i);
}
class Y {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += D.window.pageXOffset, this.y += D.window.pageYOffset, new Y(this);
  }
  init(t) {
    const e = [0, 0, 0, 0];
    return t = typeof t == "string" ? t.split(_t).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
      t.left != null ? t.left : t.x,
      t.top != null ? t.top : t.y,
      t.width,
      t.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : e, this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
  }
  isNulled() {
    return ri(this);
  }
  // Merge rect box with another, return a new instance
  merge(t) {
    const e = Math.min(this.x, t.x), n = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - n;
    return new Y(e, n, s, o);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof N || (t = new N(t));
    let e = 1 / 0, n = -1 / 0, s = 1 / 0, o = -1 / 0;
    return [
      new X(this.x, this.y),
      new X(this.x2, this.y),
      new X(this.x, this.y2),
      new X(this.x2, this.y2)
    ].forEach(function(a) {
      a = a.transform(t), e = Math.min(e, a.x), n = Math.max(n, a.x), s = Math.min(s, a.y), o = Math.max(o, a.y);
    }), new Y(e, s, n - e, o - s);
  }
}
function ai(i, t, e) {
  let n;
  try {
    if (n = t(i.node), ri(n) && !vo(i.node))
      throw new Error("Element not in the dom");
  } catch {
    n = e(i);
  }
  return n;
}
function xo() {
  const e = ai(this, (s) => s.getBBox(), (s) => {
    try {
      const o = s.clone().addTo(St().svg).show(), r = o.node.getBBox();
      return o.remove(), r;
    } catch (o) {
      throw new Error(
        `Getting bbox of element "${s.node.nodeName}" is not possible: ${o.toString()}`
      );
    }
  });
  return new Y(e);
}
function _o(i) {
  const n = ai(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(
      `Getting rbox of element "${o.node.nodeName}" is not possible`
    );
  }), s = new Y(n);
  return i ? s.transform(i.screenCTM().inverseO()) : s.addOffset();
}
function Co(i, t) {
  const e = this.bbox();
  return i > e.x && t > e.y && i < e.x + e.width && t < e.y + e.height;
}
R({
  viewbox: {
    viewbox(i, t, e, n) {
      return i == null ? new Y(this.attr("viewBox")) : this.attr("viewBox", new Y(i, t, e, n));
    },
    zoom(i, t) {
      let { width: e, height: n } = this.attr(["width", "height"]);
      if ((!e && !n || typeof e == "string" || typeof n == "string") && (e = this.node.clientWidth, n = this.node.clientHeight), !e || !n)
        throw new Error(
          "Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element"
        );
      const s = this.viewbox(), o = e / s.width, r = n / s.height, a = Math.min(o, r);
      if (i == null)
        return a;
      let l = a / i;
      l === 1 / 0 && (l = Number.MAX_SAFE_INTEGER / 100), t = t || new X(e / 2 / o + s.x, n / 2 / r + s.y);
      const c = new Y(s).transform(
        new N({ scale: l, origin: t })
      );
      return this.viewbox(c);
    }
  }
});
P(Y, "Box");
class Pt extends Array {
  constructor(t = [], ...e) {
    if (super(t, ...e), typeof t == "number") return this;
    this.length = 0, this.push(...t);
  }
}
k([Pt], {
  each(i, ...t) {
    return typeof i == "function" ? this.map((e, n, s) => i.call(e, e, n, s)) : this.map((e) => e[i](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const Eo = ["toArray", "constructor", "each"];
Pt.extend = function(i) {
  i = i.reduce((t, e) => (Eo.includes(e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...n) {
    return this.each(e, ...n);
  }), t), {}), k([Pt], i);
};
function Xt(i, t) {
  return new Pt(
    hn((t || D.document).querySelectorAll(i), function(e) {
      return pt(e);
    })
  );
}
function So(i) {
  return Xt(i, this.node);
}
function Mo(i) {
  return pt(this.node.querySelector(i));
}
let To = 0;
const li = {};
function ci(i) {
  let t = i.getEventHolder();
  return t === D.window && (t = li), t.events || (t.events = {}), t.events;
}
function mn(i) {
  return i.getEventTarget();
}
function ko(i) {
  let t = i.getEventHolder();
  t === D.window && (t = li), t.events && (t.events = {});
}
function ct(i, t, e, n, s) {
  const o = e.bind(n || i), r = it(i), a = ci(r), l = mn(r);
  t = Array.isArray(t) ? t : t.split(_t), e._svgjsListenerId || (e._svgjsListenerId = ++To), t.forEach(function(c) {
    const h = c.split(".")[0], d = c.split(".")[1] || "*";
    a[h] = a[h] || {}, a[h][d] = a[h][d] || {}, a[h][d][e._svgjsListenerId] = o, l.addEventListener(h, o, s || !1);
  });
}
function J(i, t, e, n) {
  const s = it(i), o = ci(s), r = mn(s);
  typeof e == "function" && (e = e._svgjsListenerId, !e) || (t = Array.isArray(t) ? t : (t || "").split(_t), t.forEach(function(a) {
    const l = a && a.split(".")[0], c = a && a.split(".")[1];
    let h, d;
    if (e)
      o[l] && o[l][c || "*"] && (r.removeEventListener(
        l,
        o[l][c || "*"][e],
        n || !1
      ), delete o[l][c || "*"][e]);
    else if (l && c) {
      if (o[l] && o[l][c]) {
        for (d in o[l][c])
          J(r, [l, c].join("."), d);
        delete o[l][c];
      }
    } else if (c)
      for (a in o)
        for (h in o[a])
          c === h && J(r, [a, c].join("."));
    else if (l) {
      if (o[l]) {
        for (h in o[l])
          J(r, [l, h].join("."));
        delete o[l];
      }
    } else {
      for (a in o)
        J(r, a);
      ko(s);
    }
  }));
}
function Ao(i, t, e, n) {
  const s = mn(i);
  return t instanceof D.window.Event || (t = new D.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...n
  })), s.dispatchEvent(t), t;
}
class he extends fn {
  addEventListener() {
  }
  dispatch(t, e, n) {
    return Ao(this, t, e, n);
  }
  dispatchEvent(t) {
    const e = this.getEventHolder().events;
    if (!e) return !0;
    const n = e[t.type];
    for (const s in n)
      for (const o in n[s])
        n[s][o](t);
    return !t.defaultPrevented;
  }
  // Fire given event
  fire(t, e, n) {
    return this.dispatch(t, e, n), this;
  }
  getEventHolder() {
    return this;
  }
  getEventTarget() {
    return this;
  }
  // Unbind event from listener
  off(t, e, n) {
    return J(this, t, e, n), this;
  }
  // Bind given event to listener
  on(t, e, n, s) {
    return ct(this, t, e, n, s), this;
  }
  removeEventListener() {
  }
}
P(he, "EventTarget");
function Hn() {
}
const ie = {
  duration: 400,
  ease: ">",
  delay: 0
}, Ro = {
  // fill and stroke
  "fill-opacity": 1,
  "stroke-opacity": 1,
  "stroke-width": 0,
  "stroke-linejoin": "miter",
  "stroke-linecap": "butt",
  fill: "#000000",
  stroke: "#000000",
  opacity: 1,
  // position
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,
  // size
  width: 0,
  height: 0,
  // radius
  r: 0,
  rx: 0,
  ry: 0,
  // gradient
  offset: 0,
  "stop-opacity": 1,
  "stop-color": "#000000",
  // text
  "text-anchor": "start"
};
class Ut extends Array {
  constructor(...t) {
    super(...t), this.init(...t);
  }
  clone() {
    return new this.constructor(this);
  }
  init(t) {
    return typeof t == "number" ? this : (this.length = 0, this.push(...this.parse(t)), this);
  }
  // Parse whitespace separated string
  parse(t = []) {
    return t instanceof Array ? t : t.trim().split(_t).map(parseFloat);
  }
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
  toSet() {
    return new Set(this);
  }
  toString() {
    return this.join(" ");
  }
  // Flattens the array if needed
  valueOf() {
    const t = [];
    return t.push(...this), t;
  }
}
class M {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new M(this.value, t);
  }
  // Divide number
  divide(t) {
    return t = new M(t), new M(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(oi), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof M && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  // Subtract number
  minus(t) {
    return t = new M(t), new M(this - t, this.unit || t.unit);
  }
  // Add number
  plus(t) {
    return t = new M(t), new M(this + t, this.unit || t.unit);
  }
  // Multiply number
  times(t) {
    return t = new M(t), new M(this * t, this.unit || t.unit);
  }
  toArray() {
    return [this.value, this.unit];
  }
  toJSON() {
    return this.toString();
  }
  toString() {
    return (this.unit === "%" ? ~~(this.value * 1e8) / 1e6 : this.unit === "s" ? this.value / 1e3 : this.value) + this.unit;
  }
  valueOf() {
    return this.value;
  }
}
const No = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), hi = [];
function Do(i) {
  hi.push(i);
}
function Po(i, t, e) {
  if (i == null) {
    i = {}, t = this.node.attributes;
    for (const n of t)
      i[n.nodeName] = Gn.test(n.nodeValue) ? parseFloat(n.nodeValue) : n.nodeValue;
    return i;
  } else {
    if (i instanceof Array)
      return i.reduce((n, s) => (n[s] = this.attr(s), n), {});
    if (typeof i == "object" && i.constructor === Object)
      for (t in i) this.attr(t, i[t]);
    else if (t === null)
      this.node.removeAttribute(i);
    else {
      if (t == null)
        return t = this.node.getAttribute(i), t == null ? Ro[i] : Gn.test(t) ? parseFloat(t) : t;
      t = hi.reduce((n, s) => s(i, n, this), t), typeof t == "number" ? t = new M(t) : No.has(i) && L.isColor(t) ? t = new L(t) : t.constructor === Array && (t = new Ut(t)), i === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, i, t.toString()) : this.node.setAttribute(i, t.toString()), this.rebuild && (i === "font-size" || i === "x") && this.rebuild();
    }
  }
  return this;
}
class kt extends he {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  // Add given element at a position
  add(t, e) {
    return t = it(t), t.removeNamespace && this.node instanceof D.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  // Add element to given container and return self
  addTo(t, e) {
    return it(t).put(this, e);
  }
  // Returns all child elements
  children() {
    return new Pt(
      hn(this.node.children, function(t) {
        return pt(t);
      })
    );
  }
  // Remove all elements in this container
  clear() {
    for (; this.node.hasChildNodes(); )
      this.node.removeChild(this.node.lastChild);
    return this;
  }
  // Clone element
  clone(t = !0, e = !0) {
    this.writeDataToDom();
    let n = this.node.cloneNode(t);
    return e && (n = si(n)), new this.constructor(n);
  }
  // Iterates over all children and invokes a given block
  each(t, e) {
    const n = this.children();
    let s, o;
    for (s = 0, o = n.length; s < o; s++)
      t.apply(n[s], [s, n]), e && n[s].each(t, e);
    return this;
  }
  element(t, e) {
    return this.put(new kt(se(t), e));
  }
  // Get first child
  first() {
    return pt(this.node.firstChild);
  }
  // Get a element at the given index
  get(t) {
    return pt(this.node.childNodes[t]);
  }
  getEventHolder() {
    return this.node;
  }
  getEventTarget() {
    return this.node;
  }
  // Checks if the given element is a child
  has(t) {
    return this.index(t) >= 0;
  }
  html(t, e) {
    return this.xml(t, e, Ds);
  }
  // Get / set id
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = ii(this.type)), this.attr("id", t);
  }
  // Gets index of given element
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  // Get the last child
  last() {
    return pt(this.node.lastChild);
  }
  // matches the element vs a css selector
  matches(t) {
    const e = this.node, n = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return n && n.call(e, t);
  }
  // Returns the parent element instance
  parent(t) {
    let e = this;
    if (!e.node.parentNode) return null;
    if (e = pt(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t)
        return e;
    while (e = pt(e.node.parentNode));
    return e;
  }
  // Basically does the same as `add()` but returns the added element instead
  put(t, e) {
    return t = it(t), this.add(t, e), t;
  }
  // Add element to given container and return container
  putIn(t, e) {
    return it(t).add(this, e);
  }
  // Remove element
  remove() {
    return this.parent() && this.parent().removeElement(this), this;
  }
  // Remove a given child
  removeElement(t) {
    return this.node.removeChild(t.node), this;
  }
  // Replace this with element
  replace(t) {
    return t = it(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const n = 10 ** t, s = this.attr(e);
    for (const o in s)
      typeof s[o] == "number" && (s[o] = Math.round(s[o] * n) / n);
    return this.attr(s), this;
  }
  // Import / Export raw svg
  svg(t, e) {
    return this.xml(t, e, dn);
  }
  // Return id on string conversion
  toString() {
    return this.id();
  }
  words(t) {
    return this.node.textContent = t, this;
  }
  wrap(t) {
    const e = this.parent();
    if (!e)
      return this.addTo(t);
    const n = e.index(this);
    return e.put(t, n).put(this);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return this.each(function() {
      this.writeDataToDom();
    }), this;
  }
  // Import / Export raw svg
  xml(t, e, n) {
    if (typeof t == "boolean" && (n = e, e = t, t = null), t == null || typeof t == "function") {
      e = e ?? !0, this.writeDataToDom();
      let a = this;
      if (t != null) {
        if (a = pt(a.node.cloneNode(!0)), e) {
          const l = t(a);
          if (a = l || a, l === !1) return "";
        }
        a.each(function() {
          const l = t(this), c = l || this;
          l === !1 ? this.remove() : l && this !== c && this.replace(c);
        }, !0);
      }
      return e ? a.node.outerHTML : a.node.innerHTML;
    }
    e = e ?? !1;
    const s = se("wrapper", n), o = D.document.createDocumentFragment();
    s.innerHTML = t;
    for (let a = s.children.length; a--; )
      o.appendChild(s.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
}
k(kt, { attr: Po, find: So, findOne: Mo });
P(kt, "Dom");
class ot extends kt {
  constructor(t, e) {
    super(t, e), this.dom = {}, this.node.instance = this, (t.hasAttribute("data-svgjs") || t.hasAttribute("svgjs:data")) && this.setData(
      JSON.parse(t.getAttribute("data-svgjs")) ?? JSON.parse(t.getAttribute("svgjs:data")) ?? {}
    );
  }
  // Move element by its center
  center(t, e) {
    return this.cx(t).cy(e);
  }
  // Move by center over x-axis
  cx(t) {
    return t == null ? this.x() + this.width() / 2 : this.x(t - this.width() / 2);
  }
  // Move by center over y-axis
  cy(t) {
    return t == null ? this.y() + this.height() / 2 : this.y(t - this.height() / 2);
  }
  // Get defs
  defs() {
    const t = this.root();
    return t && t.defs();
  }
  // Relative move over x and y axes
  dmove(t, e) {
    return this.dx(t).dy(e);
  }
  // Relative move over x axis
  dx(t = 0) {
    return this.x(new M(t).plus(this.x()));
  }
  // Relative move over y axis
  dy(t = 0) {
    return this.y(new M(t).plus(this.y()));
  }
  getEventHolder() {
    return this;
  }
  // Set height of element
  height(t) {
    return this.attr("height", t);
  }
  // Move element to given x and y values
  move(t, e) {
    return this.x(t).y(e);
  }
  // return array of all ancestors of given type up to the root svg
  parents(t = this.root()) {
    const e = typeof t == "string";
    e || (t = it(t));
    const n = new Pt();
    let s = this;
    for (; (s = s.parent()) && s.node !== D.document && s.nodeName !== "#document-fragment" && (n.push(s), !(!e && s.node === t.node || e && s.matches(t))); )
      if (s.node === this.root().node)
        return null;
    return n;
  }
  // Get referenced element form attribute value
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = (t + "").match(Vs);
    return e ? it(e[1]) : null;
  }
  // Get parent document
  root() {
    const t = this.parent(Ps(pn));
    return t && t.root();
  }
  // set given data to the elements data property
  setData(t) {
    return this.dom = t, this;
  }
  // Set element size to given width and height
  size(t, e) {
    const n = Yt(this, t, e);
    return this.width(new M(n.width)).height(new M(n.height));
  }
  // Set width of element
  width(t) {
    return this.attr("width", t);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return ni(this, this.dom), super.writeDataToDom();
  }
  // Move over x-axis
  x(t) {
    return this.attr("x", t);
  }
  // Move over y-axis
  y(t) {
    return this.attr("y", t);
  }
}
k(ot, {
  bbox: xo,
  rbox: _o,
  inside: Co,
  point: yo,
  ctm: bo,
  screenCTM: wo
});
P(ot, "Element");
const Jt = {
  stroke: [
    "color",
    "width",
    "opacity",
    "linecap",
    "linejoin",
    "miterlimit",
    "dasharray",
    "dashoffset"
  ],
  fill: ["color", "opacity", "rule"],
  prefix: function(i, t) {
    return t === "color" ? i : i + "-" + t;
  }
};
["fill", "stroke"].forEach(function(i) {
  const t = {};
  let e;
  t[i] = function(n) {
    if (typeof n > "u")
      return this.attr(i);
    if (typeof n == "string" || n instanceof L || L.isRgb(n) || n instanceof ot)
      this.attr(i, n);
    else
      for (e = Jt[i].length - 1; e >= 0; e--)
        n[Jt[i][e]] != null && this.attr(Jt.prefix(i, Jt[i][e]), n[Jt[i][e]]);
    return this;
  }, R(["Element", "Runner"], t);
});
R(["Element", "Runner"], {
  // Let the user set the matrix directly
  matrix: function(i, t, e, n, s, o) {
    return i == null ? new N(this) : this.attr("transform", new N(i, t, e, n, s, o));
  },
  // Map rotation to transform
  rotate: function(i, t, e) {
    return this.transform({ rotate: i, ox: t, oy: e }, !0);
  },
  // Map skew to transform
  skew: function(i, t, e, n) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ skew: i, ox: t, oy: e }, !0) : this.transform({ skew: [i, t], ox: e, oy: n }, !0);
  },
  shear: function(i, t, e) {
    return this.transform({ shear: i, ox: t, oy: e }, !0);
  },
  // Map scale to transform
  scale: function(i, t, e, n) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ scale: i, ox: t, oy: e }, !0) : this.transform({ scale: [i, t], ox: e, oy: n }, !0);
  },
  // Map translate to transform
  translate: function(i, t) {
    return this.transform({ translate: [i, t] }, !0);
  },
  // Map relative translations to transform
  relative: function(i, t) {
    return this.transform({ relative: [i, t] }, !0);
  },
  // Map flip to transform
  flip: function(i = "both", t = "center") {
    return "xybothtrue".indexOf(i) === -1 && (t = i, i = "both"), this.transform({ flip: i, origin: t }, !0);
  },
  // Opacity
  opacity: function(i) {
    return this.attr("opacity", i);
  }
});
R("radius", {
  // Add x and y radius
  radius: function(i, t = i) {
    return (this._element || this).type === "radialGradient" ? this.attr("r", new M(i)) : this.rx(i).ry(t);
  }
});
R("Path", {
  // Get path length
  length: function() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function(i) {
    return new X(this.node.getPointAtLength(i));
  }
});
R(["Element", "Runner"], {
  // Set font
  font: function(i, t) {
    if (typeof i == "object") {
      for (t in i) this.font(t, i[t]);
      return this;
    }
    return i === "leading" ? this.leading(t) : i === "anchor" ? this.attr("text-anchor", t) : i === "size" || i === "family" || i === "weight" || i === "stretch" || i === "variant" || i === "style" ? this.attr("font-" + i, t) : this.attr(i, t);
  }
});
const Io = [
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousemove",
  "mouseenter",
  "mouseleave",
  "touchstart",
  "touchmove",
  "touchleave",
  "touchend",
  "touchcancel",
  "contextmenu",
  "wheel",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointerleave",
  "pointercancel"
].reduce(function(i, t) {
  const e = function(n) {
    return n === null ? this.off(t) : this.on(t, n), this;
  };
  return i[t] = e, i;
}, {});
R("Element", Io);
function Oo() {
  return this.attr("transform", null);
}
function zo() {
  return (this.attr("transform") || "").split(qs).slice(0, -1).map(function(t) {
    const e = t.trim().split("(");
    return [
      e[0],
      e[1].split(_t).map(function(n) {
        return parseFloat(n);
      })
    ];
  }).reverse().reduce(function(t, e) {
    return e[0] === "matrix" ? t.lmultiply(N.fromArray(e[1])) : t[e[0]].apply(t, e[1]);
  }, new N());
}
function Lo(i, t) {
  if (this === i) return this;
  if (je(this.node)) return this.addTo(i, t);
  const e = this.screenCTM(), n = i.screenCTM().inverse();
  return this.addTo(i, t).untransform().transform(n.multiply(e)), this;
}
function Bo(i) {
  return this.toParent(this.root(), i);
}
function Go(i, t) {
  if (i == null || typeof i == "string") {
    const s = new N(this).decompose();
    return i == null ? s : s[i];
  }
  N.isMatrixLike(i) || (i = { ...i, origin: We(i, this) });
  const e = t === !0 ? this : t || !1, n = new N(e).transform(i);
  return this.attr("transform", n);
}
R("Element", {
  untransform: Oo,
  matrixify: zo,
  toParent: Lo,
  toRoot: Bo,
  transform: Go
});
class rt extends ot {
  flatten() {
    return this.each(function() {
      if (this instanceof rt)
        return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(n, s) {
      return s[s.length - n - 1].toParent(t, e);
    }), this.remove();
  }
}
P(rt, "Container");
class yn extends rt {
  constructor(t, e = t) {
    super(F("defs", t), e);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
}
P(yn, "Defs");
class dt extends ot {
}
P(dt, "Shape");
function bn(i) {
  return this.attr("rx", i);
}
function wn(i) {
  return this.attr("ry", i);
}
function di(i) {
  return i == null ? this.cx() - this.rx() : this.cx(i + this.rx());
}
function ui(i) {
  return i == null ? this.cy() - this.ry() : this.cy(i + this.ry());
}
function fi(i) {
  return this.attr("cx", i);
}
function pi(i) {
  return this.attr("cy", i);
}
function gi(i) {
  return i == null ? this.rx() * 2 : this.rx(new M(i).divide(2));
}
function mi(i) {
  return i == null ? this.ry() * 2 : this.ry(new M(i).divide(2));
}
const Ho = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cx: fi,
  cy: pi,
  height: mi,
  rx: bn,
  ry: wn,
  width: gi,
  x: di,
  y: ui
}, Symbol.toStringTag, { value: "Module" }));
class de extends dt {
  constructor(t, e = t) {
    super(F("ellipse", t), e);
  }
  size(t, e) {
    const n = Yt(this, t, e);
    return this.rx(new M(n.width).divide(2)).ry(
      new M(n.height).divide(2)
    );
  }
}
k(de, Ho);
R("Container", {
  // Create an ellipse
  ellipse: U(function(i = 0, t = i) {
    return this.put(new de()).size(i, t).move(0, 0);
  })
});
P(de, "Ellipse");
class yi extends kt {
  constructor(t = D.document.createDocumentFragment()) {
    super(t);
  }
  // Import / Export raw xml
  xml(t, e, n) {
    if (typeof t == "boolean" && (n = e, e = t, t = null), t == null || typeof t == "function") {
      const s = new kt(se("wrapper", n));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, n);
    }
    return super.xml(t, !1, n);
  }
}
P(yi, "Fragment");
function bi(i, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ fx: new M(i), fy: new M(t) }) : this.attr({ x1: new M(i), y1: new M(t) });
}
function wi(i, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ cx: new M(i), cy: new M(t) }) : this.attr({ x2: new M(i), y2: new M(t) });
}
const Uo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  from: bi,
  to: wi
}, Symbol.toStringTag, { value: "Module" }));
class ue extends rt {
  constructor(t, e) {
    super(
      F(t + "Gradient", typeof t == "string" ? null : t),
      e
    );
  }
  // custom attr to handle transform
  attr(t, e, n) {
    return t === "transform" && (t = "gradientTransform"), super.attr(t, e, n);
  }
  bbox() {
    return new Y();
  }
  targets() {
    return Xt("svg [fill*=" + this.id() + "]");
  }
  // Alias string conversion to fill
  toString() {
    return this.url();
  }
  // Update gradient
  update(t) {
    return this.clear(), typeof t == "function" && t.call(this, this), this;
  }
  // Return the fill id
  url() {
    return "url(#" + this.id() + ")";
  }
}
k(ue, Uo);
R({
  Container: {
    // Create gradient element in defs
    gradient(...i) {
      return this.defs().gradient(...i);
    }
  },
  // define gradient
  Defs: {
    gradient: U(function(i, t) {
      return this.put(new ue(i)).update(t);
    })
  }
});
P(ue, "Gradient");
class oe extends rt {
  // Initialize node
  constructor(t, e = t) {
    super(F("pattern", t), e);
  }
  // custom attr to handle transform
  attr(t, e, n) {
    return t === "transform" && (t = "patternTransform"), super.attr(t, e, n);
  }
  bbox() {
    return new Y();
  }
  targets() {
    return Xt("svg [fill*=" + this.id() + "]");
  }
  // Alias string conversion to fill
  toString() {
    return this.url();
  }
  // Update pattern by rebuilding
  update(t) {
    return this.clear(), typeof t == "function" && t.call(this, this), this;
  }
  // Return the fill id
  url() {
    return "url(#" + this.id() + ")";
  }
}
R({
  Container: {
    // Create pattern element in defs
    pattern(...i) {
      return this.defs().pattern(...i);
    }
  },
  Defs: {
    pattern: U(function(i, t, e) {
      return this.put(new oe()).update(e).attr({
        x: 0,
        y: 0,
        width: i,
        height: t,
        patternUnits: "userSpaceOnUse"
      });
    })
  }
});
P(oe, "Pattern");
let ke = class extends dt {
  constructor(t, e = t) {
    super(F("image", t), e);
  }
  // (re)load image
  load(t, e) {
    if (!t) return this;
    const n = new D.window.Image();
    return ct(
      n,
      "load",
      function(s) {
        const o = this.parent(oe);
        this.width() === 0 && this.height() === 0 && this.size(n.width, n.height), o instanceof oe && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, s);
      },
      this
    ), ct(n, "load error", function() {
      J(n);
    }), this.attr("href", n.src = t, ce);
  }
};
Do(function(i, t, e) {
  return (i === "fill" || i === "stroke") && Qs.test(t) && (t = e.root().defs().image(t)), t instanceof ke && (t = e.root().defs().pattern(0, 0, (n) => {
    n.add(t);
  })), t;
});
R({
  Container: {
    // create image element, load image and set its size
    image: U(function(i, t) {
      return this.put(new ke()).size(0, 0).load(i, t);
    })
  }
});
P(ke, "Image");
class At extends Ut {
  // Get bounding box of points
  bbox() {
    let t = -1 / 0, e = -1 / 0, n = 1 / 0, s = 1 / 0;
    return this.forEach(function(o) {
      t = Math.max(o[0], t), e = Math.max(o[1], e), n = Math.min(o[0], n), s = Math.min(o[1], s);
    }), new Y(n, s, t - n, e - s);
  }
  // Move point string
  move(t, e) {
    const n = this.bbox();
    if (t -= n.x, e -= n.y, !isNaN(t) && !isNaN(e))
      for (let s = this.length - 1; s >= 0; s--)
        this[s] = [this[s][0] + t, this[s][1] + e];
    return this;
  }
  // Parse point string and flat array
  parse(t = [0, 0]) {
    const e = [];
    t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(_t).map(parseFloat), t.length % 2 !== 0 && t.pop();
    for (let n = 0, s = t.length; n < s; n = n + 2)
      e.push([t[n], t[n + 1]]);
    return e;
  }
  // Resize poly string
  size(t, e) {
    let n;
    const s = this.bbox();
    for (n = this.length - 1; n >= 0; n--)
      s.width && (this[n][0] = (this[n][0] - s.x) * t / s.width + s.x), s.height && (this[n][1] = (this[n][1] - s.y) * e / s.height + s.y);
    return this;
  }
  // Convert array to line object
  toLine() {
    return {
      x1: this[0][0],
      y1: this[0][1],
      x2: this[1][0],
      y2: this[1][1]
    };
  }
  // Convert array to string
  toString() {
    const t = [];
    for (let e = 0, n = this.length; e < n; e++)
      t.push(this[e].join(","));
    return t.join(" ");
  }
  transform(t) {
    return this.clone().transformO(t);
  }
  // transform points with matrix (similar to Point.transform)
  transformO(t) {
    N.isMatrixLike(t) || (t = new N(t));
    for (let e = this.length; e--; ) {
      const [n, s] = this[e];
      this[e][0] = t.a * n + t.c * s + t.e, this[e][1] = t.b * n + t.d * s + t.f;
    }
    return this;
  }
}
const Fo = At;
function Zo(i) {
  return i == null ? this.bbox().x : this.move(i, this.bbox().y);
}
function Yo(i) {
  return i == null ? this.bbox().y : this.move(this.bbox().x, i);
}
function Xo(i) {
  const t = this.bbox();
  return i == null ? t.width : this.size(i, t.height);
}
function $o(i) {
  const t = this.bbox();
  return i == null ? t.height : this.size(t.width, i);
}
const vn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MorphArray: Fo,
  height: $o,
  width: Xo,
  x: Zo,
  y: Yo
}, Symbol.toStringTag, { value: "Module" }));
class Ft extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("line", t), e);
  }
  // Get array
  array() {
    return new At([
      [this.attr("x1"), this.attr("y1")],
      [this.attr("x2"), this.attr("y2")]
    ]);
  }
  // Move by left top corner
  move(t, e) {
    return this.attr(this.array().move(t, e).toLine());
  }
  // Overwrite native plot() method
  plot(t, e, n, s) {
    return t == null ? this.array() : (typeof e < "u" ? t = { x1: t, y1: e, x2: n, y2: s } : t = new At(t).toLine(), this.attr(t));
  }
  // Set element size to given width and height
  size(t, e) {
    const n = Yt(this, t, e);
    return this.attr(this.array().size(n.width, n.height).toLine());
  }
}
k(Ft, vn);
R({
  Container: {
    // Create a line element
    line: U(function(...i) {
      return Ft.prototype.plot.apply(
        this.put(new Ft()),
        i[0] != null ? i : [0, 0, 0, 0]
      );
    })
  }
});
P(Ft, "Line");
class _e extends rt {
  // Initialize node
  constructor(t, e = t) {
    super(F("marker", t), e);
  }
  // Set height of element
  height(t) {
    return this.attr("markerHeight", t);
  }
  orient(t) {
    return this.attr("orient", t);
  }
  // Set marker refX and refY
  ref(t, e) {
    return this.attr("refX", t).attr("refY", e);
  }
  // Return the fill id
  toString() {
    return "url(#" + this.id() + ")";
  }
  // Update marker
  update(t) {
    return this.clear(), typeof t == "function" && t.call(this, this), this;
  }
  // Set width of element
  width(t) {
    return this.attr("markerWidth", t);
  }
}
R({
  Container: {
    marker(...i) {
      return this.defs().marker(...i);
    }
  },
  Defs: {
    // Create marker
    marker: U(function(i, t, e) {
      return this.put(new _e()).size(i, t).ref(i / 2, t / 2).viewbox(0, 0, i, t).attr("orient", "auto").update(e);
    })
  },
  marker: {
    // Create and attach markers
    marker(i, t, e, n) {
      let s = ["marker"];
      return i !== "all" && s.push(i), s = s.join("-"), i = arguments[1] instanceof _e ? arguments[1] : this.defs().marker(t, e, n), this.attr(s, i);
    }
  }
});
P(_e, "Marker");
function Gt(i, t) {
  return function(e) {
    return e == null ? this[i] : (this[i] = e, t && t.call(this), this);
  };
}
const Wo = {
  "-": function(i) {
    return i;
  },
  "<>": function(i) {
    return -Math.cos(i * Math.PI) / 2 + 0.5;
  },
  ">": function(i) {
    return Math.sin(i * Math.PI / 2);
  },
  "<": function(i) {
    return -Math.cos(i * Math.PI / 2) + 1;
  },
  bezier: function(i, t, e, n) {
    return function(s) {
      return s < 0 ? i > 0 ? t / i * s : e > 0 ? n / e * s : 0 : s > 1 ? e < 1 ? (1 - n) / (1 - e) * s + (n - e) / (1 - e) : i < 1 ? (1 - t) / (1 - i) * s + (t - i) / (1 - i) : 1 : 3 * s * (1 - s) ** 2 * t + 3 * s ** 2 * (1 - s) * n + s ** 3;
    };
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function(i, t = "end") {
    t = t.split("-").reverse()[0];
    let e = i;
    return t === "none" ? --e : t === "both" && ++e, (n, s = !1) => {
      let o = Math.floor(n * i);
      const r = n * o % 1 === 0;
      return (t === "start" || t === "both") && ++o, s && r && --o, n >= 0 && o < 0 && (o = 0), n <= 1 && o > e && (o = e), o / e;
    };
  }
};
class xn {
  done() {
    return !1;
  }
}
class Ve extends xn {
  constructor(t = ie.ease) {
    super(), this.ease = Wo[t] || t;
  }
  step(t, e, n) {
    return typeof t != "number" ? n < 1 ? t : e : t + (e - t) * this.ease(n);
  }
}
class Ce extends xn {
  constructor(t) {
    super(), this.stepper = t;
  }
  done(t) {
    return t.done;
  }
  step(t, e, n, s) {
    return this.stepper(t, e, n, s);
  }
}
function Un() {
  const i = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, n = Math.PI, s = Math.log(t / 100 + e), o = -s / Math.sqrt(n * n + s * s), r = 3.9 / (o * i);
  this.d = 2 * o * r, this.k = r * r;
}
class jo extends Ce {
  constructor(t = 500, e = 0) {
    super(), this.duration(t).overshoot(e);
  }
  step(t, e, n, s) {
    if (typeof t == "string") return t;
    if (s.done = n === 1 / 0, n === 1 / 0) return e;
    if (n === 0) return t;
    n > 100 && (n = 16), n /= 1e3;
    const o = s.velocity || 0, r = -this.d * o - this.k * (t - e), a = t + o * n + r * n * n / 2;
    return s.velocity = o + r * n, s.done = Math.abs(e - a) + Math.abs(o) < 2e-3, s.done ? e : a;
  }
}
k(jo, {
  duration: Gt("_duration", Un),
  overshoot: Gt("_overshoot", Un)
});
class Vo extends Ce {
  constructor(t = 0.1, e = 0.01, n = 0, s = 1e3) {
    super(), this.p(t).i(e).d(n).windup(s);
  }
  step(t, e, n, s) {
    if (typeof t == "string") return t;
    if (s.done = n === 1 / 0, n === 1 / 0) return e;
    if (n === 0) return t;
    const o = e - t;
    let r = (s.integral || 0) + o * n;
    const a = (o - (s.error || 0)) / n, l = this._windup;
    return l !== !1 && (r = Math.max(-l, Math.min(r, l))), s.error = o, s.integral = r, s.done = Math.abs(o) < 1e-3, s.done ? e : t + (this.P * o + this.I * r + this.D * a);
  }
}
k(Vo, {
  windup: Gt("_windup"),
  p: Gt("P"),
  i: Gt("I"),
  d: Gt("D")
});
const qo = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0
}, qe = {
  M: function(i, t, e) {
    return t.x = e.x = i[0], t.y = e.y = i[1], ["M", t.x, t.y];
  },
  L: function(i, t) {
    return t.x = i[0], t.y = i[1], ["L", i[0], i[1]];
  },
  H: function(i, t) {
    return t.x = i[0], ["H", i[0]];
  },
  V: function(i, t) {
    return t.y = i[0], ["V", i[0]];
  },
  C: function(i, t) {
    return t.x = i[4], t.y = i[5], ["C", i[0], i[1], i[2], i[3], i[4], i[5]];
  },
  S: function(i, t) {
    return t.x = i[2], t.y = i[3], ["S", i[0], i[1], i[2], i[3]];
  },
  Q: function(i, t) {
    return t.x = i[2], t.y = i[3], ["Q", i[0], i[1], i[2], i[3]];
  },
  T: function(i, t) {
    return t.x = i[0], t.y = i[1], ["T", i[0], i[1]];
  },
  Z: function(i, t, e) {
    return t.x = e.x, t.y = e.y, ["Z"];
  },
  A: function(i, t) {
    return t.x = i[5], t.y = i[6], ["A", i[0], i[1], i[2], i[3], i[4], i[5], i[6]];
  }
}, Fe = "mlhvqtcsaz".split("");
for (let i = 0, t = Fe.length; i < t; ++i)
  qe[Fe[i]] = /* @__PURE__ */ function(e) {
    return function(n, s, o) {
      if (e === "H") n[0] = n[0] + s.x;
      else if (e === "V") n[0] = n[0] + s.y;
      else if (e === "A")
        n[5] = n[5] + s.x, n[6] = n[6] + s.y;
      else
        for (let r = 0, a = n.length; r < a; ++r)
          n[r] = n[r] + (r % 2 ? s.y : s.x);
      return qe[e](n, s, o);
    };
  }(Fe[i].toUpperCase());
function Ko(i) {
  const t = i.segment[0];
  return qe[t](i.segment.slice(1), i.p, i.p0);
}
function Ke(i) {
  return i.segment.length && i.segment.length - 1 === qo[i.segment[0].toUpperCase()];
}
function Qo(i, t) {
  i.inNumber && Rt(i, !1);
  const e = gn.test(t);
  if (e)
    i.segment = [t];
  else {
    const n = i.lastCommand, s = n.toLowerCase(), o = n === s;
    i.segment = [s === "m" ? o ? "l" : "L" : n];
  }
  return i.inSegment = !0, i.lastCommand = i.segment[0], e;
}
function Rt(i, t) {
  if (!i.inNumber) throw new Error("Parser Error");
  i.number && i.segment.push(parseFloat(i.number)), i.inNumber = t, i.number = "", i.pointSeen = !1, i.hasExponent = !1, Ke(i) && Qe(i);
}
function Qe(i) {
  i.inSegment = !1, i.absolute && (i.segment = Ko(i)), i.segments.push(i.segment);
}
function Jo(i) {
  if (!i.segment.length) return !1;
  const t = i.segment[0].toUpperCase() === "A", e = i.segment.length;
  return t && (e === 4 || e === 5);
}
function tr(i) {
  return i.lastToken.toUpperCase() === "E";
}
const er = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
function nr(i, t = !0) {
  let e = 0, n = "";
  const s = {
    segment: [],
    inNumber: !1,
    number: "",
    lastToken: "",
    inSegment: !1,
    segments: [],
    pointSeen: !1,
    hasExponent: !1,
    absolute: t,
    p0: new X(),
    p: new X()
  };
  for (; s.lastToken = n, n = i.charAt(e++); )
    if (!(!s.inSegment && Qo(s, n))) {
      if (n === ".") {
        if (s.pointSeen || s.hasExponent) {
          Rt(s, !1), --e;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += n;
        continue;
      }
      if (!isNaN(parseInt(n))) {
        if (s.number === "0" || Jo(s)) {
          s.inNumber = !0, s.number = n, Rt(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += n;
        continue;
      }
      if (er.has(n)) {
        s.inNumber && Rt(s, !1);
        continue;
      }
      if (n === "-" || n === "+") {
        if (s.inNumber && !tr(s)) {
          Rt(s, !1), --e;
          continue;
        }
        s.number += n, s.inNumber = !0;
        continue;
      }
      if (n.toUpperCase() === "E") {
        s.number += n, s.hasExponent = !0;
        continue;
      }
      if (gn.test(n)) {
        if (s.inNumber)
          Rt(s, !1);
        else if (Ke(s))
          Qe(s);
        else
          throw new Error("parser Error");
        --e;
      }
    }
  return s.inNumber && Rt(s, !1), s.inSegment && Ke(s) && Qe(s), s.segments;
}
function ir(i) {
  let t = "";
  for (let e = 0, n = i.length; e < n; e++)
    t += i[e][0], i[e][1] != null && (t += i[e][1], i[e][2] != null && (t += " ", t += i[e][2], i[e][3] != null && (t += " ", t += i[e][3], t += " ", t += i[e][4], i[e][5] != null && (t += " ", t += i[e][5], t += " ", t += i[e][6], i[e][7] != null && (t += " ", t += i[e][7])))));
  return t + " ";
}
class It extends Ut {
  // Get bounding box of path
  bbox() {
    return St().path.setAttribute("d", this.toString()), new Y(St.nodes.path.getBBox());
  }
  // Move path string
  move(t, e) {
    const n = this.bbox();
    if (t -= n.x, e -= n.y, !isNaN(t) && !isNaN(e))
      for (let s, o = this.length - 1; o >= 0; o--)
        s = this[o][0], s === "M" || s === "L" || s === "T" ? (this[o][1] += t, this[o][2] += e) : s === "H" ? this[o][1] += t : s === "V" ? this[o][1] += e : s === "C" || s === "S" || s === "Q" ? (this[o][1] += t, this[o][2] += e, this[o][3] += t, this[o][4] += e, s === "C" && (this[o][5] += t, this[o][6] += e)) : s === "A" && (this[o][6] += t, this[o][7] += e);
    return this;
  }
  // Absolutize and parse path to array
  parse(t = "M0 0") {
    return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), nr(t);
  }
  // Resize path string
  size(t, e) {
    const n = this.bbox();
    let s, o;
    for (n.width = n.width === 0 ? 1 : n.width, n.height = n.height === 0 ? 1 : n.height, s = this.length - 1; s >= 0; s--)
      o = this[s][0], o === "M" || o === "L" || o === "T" ? (this[s][1] = (this[s][1] - n.x) * t / n.width + n.x, this[s][2] = (this[s][2] - n.y) * e / n.height + n.y) : o === "H" ? this[s][1] = (this[s][1] - n.x) * t / n.width + n.x : o === "V" ? this[s][1] = (this[s][1] - n.y) * e / n.height + n.y : o === "C" || o === "S" || o === "Q" ? (this[s][1] = (this[s][1] - n.x) * t / n.width + n.x, this[s][2] = (this[s][2] - n.y) * e / n.height + n.y, this[s][3] = (this[s][3] - n.x) * t / n.width + n.x, this[s][4] = (this[s][4] - n.y) * e / n.height + n.y, o === "C" && (this[s][5] = (this[s][5] - n.x) * t / n.width + n.x, this[s][6] = (this[s][6] - n.y) * e / n.height + n.y)) : o === "A" && (this[s][1] = this[s][1] * t / n.width, this[s][2] = this[s][2] * e / n.height, this[s][6] = (this[s][6] - n.x) * t / n.width + n.x, this[s][7] = (this[s][7] - n.y) * e / n.height + n.y);
    return this;
  }
  // Convert array to string
  toString() {
    return ir(this);
  }
}
const vi = (i) => {
  const t = typeof i;
  return t === "number" ? M : t === "string" ? L.isColor(i) ? L : _t.test(i) ? gn.test(i) ? It : Ut : oi.test(i) ? M : Je : _n.indexOf(i.constructor) > -1 ? i.constructor : Array.isArray(i) ? Ut : t === "object" ? re : Je;
};
class Nt {
  constructor(t) {
    this._stepper = t || new Ve("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
  }
  at(t) {
    return this._morphObj.morph(
      this._from,
      this._to,
      t,
      this._stepper,
      this._context
    );
  }
  done() {
    return this._context.map(this._stepper.done).reduce(function(e, n) {
      return e && n;
    }, !0);
  }
  from(t) {
    return t == null ? this._from : (this._from = this._set(t), this);
  }
  stepper(t) {
    return t == null ? this._stepper : (this._stepper = t, this);
  }
  to(t) {
    return t == null ? this._to : (this._to = this._set(t), this);
  }
  type(t) {
    return t == null ? this._type : (this._type = t, this);
  }
  _set(t) {
    this._type || this.type(vi(t));
    let e = new this._type(t);
    return this._type === L && (e = this._to ? e[this._to[4]]() : this._from ? e[this._from[4]]() : e), this._type === re && (e = this._to ? e.align(this._to) : this._from ? e.align(this._from) : e), e = e.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(e.length)).map(Object).map(function(n) {
      return n.done = !0, n;
    }), e;
  }
}
class Je {
  constructor(...t) {
    this.init(...t);
  }
  init(t) {
    return t = Array.isArray(t) ? t[0] : t, this.value = t, this;
  }
  toArray() {
    return [this.value];
  }
  valueOf() {
    return this.value;
  }
}
class fe {
  constructor(...t) {
    this.init(...t);
  }
  init(t) {
    return Array.isArray(t) && (t = {
      scaleX: t[0],
      scaleY: t[1],
      shear: t[2],
      rotate: t[3],
      translateX: t[4],
      translateY: t[5],
      originX: t[6],
      originY: t[7]
    }), Object.assign(this, fe.defaults, t), this;
  }
  toArray() {
    const t = this;
    return [
      t.scaleX,
      t.scaleY,
      t.shear,
      t.rotate,
      t.translateX,
      t.translateY,
      t.originX,
      t.originY
    ];
  }
}
fe.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const sr = (i, t) => i[0] < t[0] ? -1 : i[0] > t[0] ? 1 : 0;
class re {
  constructor(...t) {
    this.init(...t);
  }
  align(t) {
    const e = this.values;
    for (let n = 0, s = e.length; n < s; ++n) {
      if (e[n + 1] === t[n + 1]) {
        if (e[n + 1] === L && t[n + 7] !== e[n + 7]) {
          const a = t[n + 7], l = new L(this.values.splice(n + 3, 5))[a]().toArray();
          this.values.splice(n + 3, 0, ...l);
        }
        n += e[n + 2] + 2;
        continue;
      }
      if (!t[n + 1])
        return this;
      const o = new t[n + 1]().toArray(), r = e[n + 2] + 3;
      e.splice(
        n,
        r,
        t[n],
        t[n + 1],
        t[n + 2],
        ...o
      ), n += e[n + 2] + 2;
    }
    return this;
  }
  init(t) {
    if (this.values = [], Array.isArray(t)) {
      this.values = t.slice();
      return;
    }
    t = t || {};
    const e = [];
    for (const n in t) {
      const s = vi(t[n]), o = new s(t[n]).toArray();
      e.push([n, s, o.length, ...o]);
    }
    return e.sort(sr), this.values = e.reduce((n, s) => n.concat(s), []), this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const t = {}, e = this.values;
    for (; e.length; ) {
      const n = e.shift(), s = e.shift(), o = e.shift(), r = e.splice(0, o);
      t[n] = new s(r);
    }
    return t;
  }
}
const _n = [Je, fe, re];
function or(i = []) {
  _n.push(...[].concat(i));
}
function rr() {
  k(_n, {
    to(i) {
      return new Nt().type(this.constructor).from(this.toArray()).to(i);
    },
    fromArray(i) {
      return this.init(i), this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(i, t, e, n, s) {
      const o = function(r, a) {
        return n.step(r, t[a], e, s[a], s);
      };
      return this.fromArray(i.map(o));
    }
  });
}
class $t extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("path", t), e);
  }
  // Get array
  array() {
    return this._array || (this._array = new It(this.attr("d")));
  }
  // Clear array cache
  clear() {
    return delete this._array, this;
  }
  // Set height of element
  height(t) {
    return t == null ? this.bbox().height : this.size(this.bbox().width, t);
  }
  // Move by left top corner
  move(t, e) {
    return this.attr("d", this.array().move(t, e));
  }
  // Plot new path
  plot(t) {
    return t == null ? this.array() : this.clear().attr(
      "d",
      typeof t == "string" ? t : this._array = new It(t)
    );
  }
  // Set element size to given width and height
  size(t, e) {
    const n = Yt(this, t, e);
    return this.attr("d", this.array().size(n.width, n.height));
  }
  // Set width of element
  width(t) {
    return t == null ? this.bbox().width : this.size(t, this.bbox().height);
  }
  // Move by left top corner over x-axis
  x(t) {
    return t == null ? this.bbox().x : this.move(t, this.bbox().y);
  }
  // Move by left top corner over y-axis
  y(t) {
    return t == null ? this.bbox().y : this.move(this.bbox().x, t);
  }
}
$t.prototype.MorphArray = It;
R({
  Container: {
    // Create a wrapped path element
    path: U(function(i) {
      return this.put(new $t()).plot(i || new It());
    })
  }
});
P($t, "Path");
function ar() {
  return this._array || (this._array = new At(this.attr("points")));
}
function lr() {
  return delete this._array, this;
}
function cr(i, t) {
  return this.attr("points", this.array().move(i, t));
}
function hr(i) {
  return i == null ? this.array() : this.clear().attr(
    "points",
    typeof i == "string" ? i : this._array = new At(i)
  );
}
function dr(i, t) {
  const e = Yt(this, i, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
const xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array: ar,
  clear: lr,
  move: cr,
  plot: hr,
  size: dr
}, Symbol.toStringTag, { value: "Module" }));
class Wt extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("polygon", t), e);
  }
}
R({
  Container: {
    // Create a wrapped polygon element
    polygon: U(function(i) {
      return this.put(new Wt()).plot(i || new At());
    })
  }
});
k(Wt, vn);
k(Wt, xi);
P(Wt, "Polygon");
class jt extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("polyline", t), e);
  }
}
R({
  Container: {
    // Create a wrapped polygon element
    polyline: U(function(i) {
      return this.put(new jt()).plot(i || new At());
    })
  }
});
k(jt, vn);
k(jt, xi);
P(jt, "Polyline");
class pe extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("rect", t), e);
  }
}
k(pe, { rx: bn, ry: wn });
R({
  Container: {
    // Create a rect element
    rect: U(function(i, t) {
      return this.put(new pe()).size(i, t);
    })
  }
});
P(pe, "Rect");
class Ze {
  constructor() {
    this._first = null, this._last = null;
  }
  // Shows us the first item in the list
  first() {
    return this._first && this._first.value;
  }
  // Shows us the last item in the list
  last() {
    return this._last && this._last.value;
  }
  push(t) {
    const e = typeof t.next < "u" ? t : { value: t, next: null, prev: null };
    return this._last ? (e.prev = this._last, this._last.next = e, this._last = e) : (this._last = e, this._first = e), e;
  }
  // Removes the item that was returned from the push
  remove(t) {
    t.prev && (t.prev.next = t.next), t.next && (t.next.prev = t.prev), t === this._last && (this._last = t.prev), t === this._first && (this._first = t.next), t.prev = null, t.next = null;
  }
  shift() {
    const t = this._first;
    return t ? (this._first = t.next, this._first && (this._first.prev = null), this._last = this._first ? this._last : null, t.value) : null;
  }
}
const z = {
  nextDraw: null,
  frames: new Ze(),
  timeouts: new Ze(),
  immediates: new Ze(),
  timer: () => D.window.performance || D.window.Date,
  transforms: [],
  frame(i) {
    const t = z.frames.push({ run: i });
    return z.nextDraw === null && (z.nextDraw = D.window.requestAnimationFrame(z._draw)), t;
  },
  timeout(i, t) {
    t = t || 0;
    const e = z.timer().now() + t, n = z.timeouts.push({ run: i, time: e });
    return z.nextDraw === null && (z.nextDraw = D.window.requestAnimationFrame(z._draw)), n;
  },
  immediate(i) {
    const t = z.immediates.push(i);
    return z.nextDraw === null && (z.nextDraw = D.window.requestAnimationFrame(z._draw)), t;
  },
  cancelFrame(i) {
    i != null && z.frames.remove(i);
  },
  clearTimeout(i) {
    i != null && z.timeouts.remove(i);
  },
  cancelImmediate(i) {
    i != null && z.immediates.remove(i);
  },
  _draw(i) {
    let t = null;
    const e = z.timeouts.last();
    for (; (t = z.timeouts.shift()) && (i >= t.time ? t.run() : z.timeouts.push(t), t !== e); )
      ;
    let n = null;
    const s = z.frames.last();
    for (; n !== s && (n = z.frames.shift()); )
      n.run(i);
    let o = null;
    for (; o = z.immediates.shift(); )
      o();
    z.nextDraw = z.timeouts.first() || z.frames.first() ? D.window.requestAnimationFrame(z._draw) : null;
  }
}, ur = function(i) {
  const t = i.start, e = i.runner.duration(), n = t + e;
  return {
    start: t,
    duration: e,
    end: n,
    runner: i.runner
  };
}, fr = function() {
  const i = D.window;
  return (i.performance || i.Date).now();
};
class _i extends he {
  // Construct a new timeline on the given element
  constructor(t = fr) {
    super(), this._timeSource = t, this.terminate();
  }
  active() {
    return !!this._nextFrame;
  }
  finish() {
    return this.time(this.getEndTimeOfTimeline() + 1), this.pause();
  }
  // Calculates the end of the timeline
  getEndTime() {
    const t = this.getLastRunnerInfo(), e = t ? t.runner.duration() : 0;
    return (t ? t.start : this._time) + e;
  }
  getEndTimeOfTimeline() {
    const t = this._runners.map((e) => e.start + e.runner.duration());
    return Math.max(0, ...t);
  }
  getLastRunnerInfo() {
    return this.getRunnerInfoById(this._lastRunnerId);
  }
  getRunnerInfoById(t) {
    return this._runners[this._runnerIds.indexOf(t)] || null;
  }
  pause() {
    return this._paused = !0, this._continue();
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  play() {
    return this._paused = !1, this.updateTime()._continue();
  }
  reverse(t) {
    const e = this.speed();
    if (t == null) return this.speed(-e);
    const n = Math.abs(e);
    return this.speed(t ? -n : n);
  }
  // schedules a runner on the timeline
  schedule(t, e, n) {
    if (t == null)
      return this._runners.map(ur);
    let s = 0;
    const o = this.getEndTime();
    if (e = e || 0, n == null || n === "last" || n === "after")
      s = o;
    else if (n === "absolute" || n === "start")
      s = e, e = 0;
    else if (n === "now")
      s = this._time;
    else if (n === "relative") {
      const l = this.getRunnerInfoById(t.id);
      l && (s = l.start + e, e = 0);
    } else if (n === "with-last") {
      const l = this.getLastRunnerInfo();
      s = l ? l.start : this._time;
    } else
      throw new Error('Invalid value for the "when" parameter');
    t.unschedule(), t.timeline(this);
    const r = t.persist(), a = {
      persist: r === null ? this._persist : r,
      start: s + e,
      runner: t
    };
    return this._lastRunnerId = t.id, this._runners.push(a), this._runners.sort((l, c) => l.start - c.start), this._runnerIds = this._runners.map((l) => l.runner.id), this.updateTime()._continue(), this;
  }
  seek(t) {
    return this.time(this._time + t);
  }
  source(t) {
    return t == null ? this._timeSource : (this._timeSource = t, this);
  }
  speed(t) {
    return t == null ? this._speed : (this._speed = t, this);
  }
  stop() {
    return this.time(0), this.pause();
  }
  time(t) {
    return t == null ? this._time : (this._time = t, this._continue(!0));
  }
  // Remove the runner from this timeline
  unschedule(t) {
    const e = this._runnerIds.indexOf(t.id);
    return e < 0 ? this : (this._runners.splice(e, 1), this._runnerIds.splice(e, 1), t.timeline(null), this);
  }
  // Makes sure, that after pausing the time doesn't jump
  updateTime() {
    return this.active() || (this._lastSourceTime = this._timeSource()), this;
  }
  // Checks if we are running and continues the animation
  _continue(t = !1) {
    return z.cancelFrame(this._nextFrame), this._nextFrame = null, t ? this._stepImmediate() : this._paused ? this : (this._nextFrame = z.frame(this._step), this);
  }
  _stepFn(t = !1) {
    const e = this._timeSource();
    let n = e - this._lastSourceTime;
    t && (n = 0);
    const s = this._speed * n + (this._time - this._lastStepTime);
    this._lastSourceTime = e, t || (this._time += s, this._time = this._time < 0 ? 0 : this._time), this._lastStepTime = this._time, this.fire("time", this._time);
    for (let r = this._runners.length; r--; ) {
      const a = this._runners[r], l = a.runner;
      this._time - a.start <= 0 && l.reset();
    }
    let o = !1;
    for (let r = 0, a = this._runners.length; r < a; r++) {
      const l = this._runners[r], c = l.runner;
      let h = s;
      const d = this._time - l.start;
      if (d <= 0) {
        o = !0;
        continue;
      } else d < h && (h = d);
      if (!c.active()) continue;
      c.step(h).done ? l.persist !== !0 && c.duration() - c.time() + this._time + l.persist < this._time && (c.unschedule(), --r, --a) : o = !0;
    }
    return o && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this;
  }
  terminate() {
    this._startTime = 0, this._speed = 1, this._persist = 0, this._nextFrame = null, this._paused = !0, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
}
R({
  Element: {
    timeline: function(i) {
      return i == null ? (this._timeline = this._timeline || new _i(), this._timeline) : (this._timeline = i, this);
    }
  }
});
class ht extends he {
  constructor(t) {
    super(), this.id = ht.id++, t = t ?? ie.duration, t = typeof t == "function" ? new Ce(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof Ce, this._stepper = this._isDeclarative ? t : new Ve(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new N(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, n) {
    let s = 1, o = !1, r = 0;
    return t = t ?? ie.duration, e = e ?? ie.delay, n = n || "last", typeof t == "object" && !(t instanceof xn) && (e = t.delay ?? e, n = t.when ?? n, o = t.swing || o, s = t.times ?? s, r = t.wait ?? r, t = t.duration ?? ie.duration), {
      duration: t,
      delay: e,
      swing: o,
      times: s,
      wait: r,
      when: n
    };
  }
  active(t) {
    return t == null ? this.enabled : (this.enabled = t, this);
  }
  /*
  Private Methods
  ===============
  Methods that shouldn't be used externally
  */
  addTransform(t) {
    return this.transforms.lmultiplyO(t), this;
  }
  after(t) {
    return this.on("finished", t);
  }
  animate(t, e, n) {
    const s = ht.sanitise(t, e, n), o = new ht(s.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(s).schedule(s.delay, s.when);
  }
  clearTransform() {
    return this.transforms = new N(), this;
  }
  // TODO: Keep track of all transformations so that deletion is faster
  clearTransformsFromQueue() {
    (!this.done || !this._timeline || !this._timeline._runnerIds.includes(this.id)) && (this._queue = this._queue.filter((t) => !t.isTransform));
  }
  delay(t) {
    return this.animate(0, t);
  }
  duration() {
    return this._times * (this._wait + this._duration) - this._wait;
  }
  during(t) {
    return this.queue(null, t);
  }
  ease(t) {
    return this._stepper = new Ve(t), this;
  }
  /*
  Runner Definitions
  ==================
  These methods help us define the runtime behaviour of the Runner or they
  help us make new runners from the current runner
  */
  element(t) {
    return t == null ? this._element : (this._element = t, t._prepareRunner(), this);
  }
  finish() {
    return this.step(1 / 0);
  }
  loop(t, e, n) {
    return typeof t == "object" && (e = t.swing, n = t.wait, t = t.times), this._times = t || 1 / 0, this._swing = e || !1, this._wait = n || 0, this._times === !0 && (this._times = 1 / 0), this;
  }
  loops(t) {
    const e = this._duration + this._wait;
    if (t == null) {
      const r = Math.floor(this._time / e), l = (this._time - r * e) / this._duration;
      return Math.min(r + l, this._times);
    }
    const n = Math.floor(t), s = t % 1, o = e * n + this._duration * s;
    return this.time(o);
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  position(t) {
    const e = this._time, n = this._duration, s = this._wait, o = this._times, r = this._swing, a = this._reverse;
    let l;
    if (t == null) {
      const u = function(g) {
        const p = r * Math.floor(g % (2 * (s + n)) / (s + n)), y = p && !a || !p && a, m = Math.pow(-1, y) * (g % (s + n)) / n + y;
        return Math.max(Math.min(m, 1), 0);
      }, f = o * (s + n) - s;
      return l = e <= 0 ? Math.round(u(1e-5)) : e < f ? u(e) : Math.round(u(f - 1e-5)), l;
    }
    const c = Math.floor(this.loops()), h = r && c % 2 === 0;
    return l = c + (h && !a || a && h ? t : 1 - t), this.loops(l);
  }
  progress(t) {
    return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
  }
  /*
  Basic Functionality
  ===================
  These methods allow us to attach basic functions to the runner directly
  */
  queue(t, e, n, s) {
    return this._queue.push({
      initialiser: t || Hn,
      runner: e || Hn,
      retarget: n,
      isTransform: s,
      initialised: !1,
      finished: !1
    }), this.timeline() && this.timeline()._continue(), this;
  }
  reset() {
    return this._reseted ? this : (this.time(0), this._reseted = !0, this);
  }
  reverse(t) {
    return this._reverse = t ?? !this._reverse, this;
  }
  schedule(t, e, n) {
    if (t instanceof _i || (n = e, e = t, t = this.timeline()), !t)
      throw Error("Runner cannot be scheduled without timeline");
    return t.schedule(this, e, n), this;
  }
  step(t) {
    if (!this.enabled) return this;
    t = t ?? 16, this._time += t;
    const e = this.position(), n = this._lastPosition !== e && this._time >= 0;
    this._lastPosition = e;
    const s = this.duration(), o = this._lastTime <= 0 && this._time > 0, r = this._lastTime < s && this._time >= s;
    this._lastTime = this._time, o && this.fire("start", this);
    const a = this._isDeclarative;
    this.done = !a && !r && this._time >= s, this._reseted = !1;
    let l = !1;
    return (n || a) && (this._initialise(n), this.transforms = new N(), l = this._run(a ? t : e), this.fire("step", this)), this.done = this.done || l && a, r && this.fire("finished", this), this;
  }
  /*
  Runner animation methods
  ========================
  Control how the animation plays
  */
  time(t) {
    if (t == null)
      return this._time;
    const e = t - this._time;
    return this.step(e), this;
  }
  timeline(t) {
    return typeof t > "u" ? this._timeline : (this._timeline = t, this);
  }
  unschedule() {
    const t = this.timeline();
    return t && t.unschedule(this), this;
  }
  // Run each initialise function in the runner if required
  _initialise(t) {
    if (!(!t && !this._isDeclarative))
      for (let e = 0, n = this._queue.length; e < n; ++e) {
        const s = this._queue[e], o = this._isDeclarative || !s.initialised && t;
        t = !s.finished, o && t && (s.initialiser.call(this), s.initialised = !0);
      }
  }
  // Save a morpher to the morpher list so that we can retarget it later
  _rememberMorpher(t, e) {
    if (this._history[t] = {
      morpher: e,
      caller: this._queue[this._queue.length - 1]
    }, this._isDeclarative) {
      const n = this.timeline();
      n && n.play();
    }
  }
  // Try to set the target for a morpher if the morpher exists, otherwise
  // Run each run function for the position or dt given
  _run(t) {
    let e = !0;
    for (let n = 0, s = this._queue.length; n < s; ++n) {
      const o = this._queue[n], r = o.runner.call(this, t);
      o.finished = o.finished || r === !0, e = e && o.finished;
    }
    return e;
  }
  // do nothing and return false
  _tryRetarget(t, e, n) {
    if (this._history[t]) {
      if (!this._history[t].caller.initialised) {
        const o = this._queue.indexOf(this._history[t].caller);
        return this._queue.splice(o, 1), !1;
      }
      this._history[t].caller.retarget ? this._history[t].caller.retarget.call(this, e, n) : this._history[t].morpher.to(e), this._history[t].caller.finished = !1;
      const s = this.timeline();
      return s && s.play(), !0;
    }
    return !1;
  }
}
ht.id = 0;
class Ee {
  constructor(t = new N(), e = -1, n = !0) {
    this.transforms = t, this.id = e, this.done = n;
  }
  clearTransformsFromQueue() {
  }
}
k([ht, Ee], {
  mergeWith(i) {
    return new Ee(
      i.transforms.lmultiply(this.transforms),
      i.id
    );
  }
});
const Ci = (i, t) => i.lmultiplyO(t), Ei = (i) => i.transforms;
function pr() {
  const t = this._transformationRunners.runners.map(Ei).reduce(Ci, new N());
  this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
class gr {
  constructor() {
    this.runners = [], this.ids = [];
  }
  add(t) {
    if (this.runners.includes(t)) return;
    const e = t.id + 1;
    return this.runners.push(t), this.ids.push(e), this;
  }
  clearBefore(t) {
    const e = this.ids.indexOf(t + 1) || 1;
    return this.ids.splice(0, e, 0), this.runners.splice(0, e, new Ee()).forEach((n) => n.clearTransformsFromQueue()), this;
  }
  edit(t, e) {
    const n = this.ids.indexOf(t + 1);
    return this.ids.splice(n, 1, t + 1), this.runners.splice(n, 1, e), this;
  }
  getByID(t) {
    return this.runners[this.ids.indexOf(t + 1)];
  }
  length() {
    return this.ids.length;
  }
  merge() {
    let t = null;
    for (let e = 0; e < this.runners.length; ++e) {
      const n = this.runners[e];
      if (t && n.done && t.done && // don't merge runner when persisted on timeline
      (!n._timeline || !n._timeline._runnerIds.includes(n.id)) && (!t._timeline || !t._timeline._runnerIds.includes(t.id))) {
        this.remove(n.id);
        const o = n.mergeWith(t);
        this.edit(t.id, o), t = o, --e;
      } else
        t = n;
    }
    return this;
  }
  remove(t) {
    const e = this.ids.indexOf(t + 1);
    return this.ids.splice(e, 1), this.runners.splice(e, 1), this;
  }
}
R({
  Element: {
    animate(i, t, e) {
      const n = ht.sanitise(i, t, e), s = this.timeline();
      return new ht(n.duration).loop(n).element(this).timeline(s.play()).schedule(n.delay, n.when);
    },
    delay(i, t) {
      return this.animate(0, i, t);
    },
    // this function searches for all runners on the element and deletes the ones
    // which run before the current one. This is because absolute transformations
    // overwrite anything anyway so there is no need to waste time computing
    // other runners
    _clearTransformRunnersBefore(i) {
      this._transformationRunners.clearBefore(i.id);
    },
    _currentTransform(i) {
      return this._transformationRunners.runners.filter((t) => t.id <= i.id).map(Ei).reduce(Ci, new N());
    },
    _addRunner(i) {
      this._transformationRunners.add(i), z.cancelImmediate(this._frameId), this._frameId = z.immediate(pr.bind(this));
    },
    _prepareRunner() {
      this._frameId == null && (this._transformationRunners = new gr().add(
        new Ee(new N(this))
      ));
    }
  }
});
const mr = (i, t) => i.filter((e) => !t.includes(e));
k(ht, {
  attr(i, t) {
    return this.styleAttr("attr", i, t);
  },
  // Add animatable styles
  css(i, t) {
    return this.styleAttr("css", i, t);
  },
  styleAttr(i, t, e) {
    if (typeof t == "string")
      return this.styleAttr(i, { [t]: e });
    let n = t;
    if (this._tryRetarget(i, n)) return this;
    let s = new Nt(this._stepper).to(n), o = Object.keys(n);
    return this.queue(
      function() {
        s = s.from(this.element()[i](o));
      },
      function(r) {
        return this.element()[i](s.at(r).valueOf()), s.done();
      },
      function(r) {
        const a = Object.keys(r), l = mr(a, o);
        if (l.length) {
          const h = this.element()[i](l), d = new re(s.from()).valueOf();
          Object.assign(d, h), s.from(d);
        }
        const c = new re(s.to()).valueOf();
        Object.assign(c, r), s.to(c), o = a, n = r;
      }
    ), this._rememberMorpher(i, s), this;
  },
  zoom(i, t) {
    if (this._tryRetarget("zoom", i, t)) return this;
    let e = new Nt(this._stepper).to(new M(i));
    return this.queue(
      function() {
        e = e.from(this.element().zoom());
      },
      function(n) {
        return this.element().zoom(e.at(n), t), e.done();
      },
      function(n, s) {
        t = s, e.to(n);
      }
    ), this._rememberMorpher("zoom", e), this;
  },
  /**
   ** absolute transformations
   **/
  //
  // M v -----|-----(D M v = F v)------|----->  T v
  //
  // 1. define the final state (T) and decompose it (once)
  //    t = [tx, ty, the, lam, sy, sx]
  // 2. on every frame: pull the current state of all previous transforms
  //    (M - m can change)
  //   and then write this as m = [tx0, ty0, the0, lam0, sy0, sx0]
  // 3. Find the interpolated matrix F(pos) = m + pos * (t - m)
  //   - Note F(0) = M
  //   - Note F(1) = T
  // 4. Now you get the delta matrix as a result: D = F * inv(M)
  transform(i, t, e) {
    if (t = i.relative || t, this._isDeclarative && !t && this._tryRetarget("transform", i))
      return this;
    const n = N.isMatrixLike(i);
    e = i.affine != null ? i.affine : e ?? !n;
    const s = new Nt(this._stepper).type(
      e ? fe : N
    );
    let o, r, a, l, c;
    function h() {
      r = r || this.element(), o = o || We(i, r), c = new N(t ? void 0 : r), r._addRunner(this), t || r._clearTransformRunnersBefore(this);
    }
    function d(f) {
      t || this.clearTransform();
      const { x: g, y: p } = new X(o).transform(
        r._currentTransform(this)
      );
      let y = new N({ ...i, origin: [g, p] }), m = this._isDeclarative && a ? a : c;
      if (e) {
        y = y.decompose(g, p), m = m.decompose(g, p);
        const w = y.rotate, x = m.rotate, _ = [w - 360, w, w + 360], v = _.map((B) => Math.abs(B - x)), C = Math.min(...v), A = v.indexOf(C);
        y.rotate = _[A];
      }
      t && (n || (y.rotate = i.rotate || 0), this._isDeclarative && l && (m.rotate = l)), s.from(m), s.to(y);
      const b = s.at(f);
      return l = b.rotate, a = new N(b), this.addTransform(a), r._addRunner(this), s.done();
    }
    function u(f) {
      (f.origin || "center").toString() !== (i.origin || "center").toString() && (o = We(f, r)), i = { ...f, origin: o };
    }
    return this.queue(h, d, u, !0), this._isDeclarative && this._rememberMorpher("transform", s), this;
  },
  // Animatable x-axis
  x(i) {
    return this._queueNumber("x", i);
  },
  // Animatable y-axis
  y(i) {
    return this._queueNumber("y", i);
  },
  ax(i) {
    return this._queueNumber("ax", i);
  },
  ay(i) {
    return this._queueNumber("ay", i);
  },
  dx(i = 0) {
    return this._queueNumberDelta("x", i);
  },
  dy(i = 0) {
    return this._queueNumberDelta("y", i);
  },
  dmove(i, t) {
    return this.dx(i).dy(t);
  },
  _queueNumberDelta(i, t) {
    if (t = new M(t), this._tryRetarget(i, t)) return this;
    const e = new Nt(this._stepper).to(t);
    let n = null;
    return this.queue(
      function() {
        n = this.element()[i](), e.from(n), e.to(n + t);
      },
      function(s) {
        return this.element()[i](e.at(s)), e.done();
      },
      function(s) {
        e.to(n + new M(s));
      }
    ), this._rememberMorpher(i, e), this;
  },
  _queueObject(i, t) {
    if (this._tryRetarget(i, t)) return this;
    const e = new Nt(this._stepper).to(t);
    return this.queue(
      function() {
        e.from(this.element()[i]());
      },
      function(n) {
        return this.element()[i](e.at(n)), e.done();
      }
    ), this._rememberMorpher(i, e), this;
  },
  _queueNumber(i, t) {
    return this._queueObject(i, new M(t));
  },
  // Animatable center x-axis
  cx(i) {
    return this._queueNumber("cx", i);
  },
  // Animatable center y-axis
  cy(i) {
    return this._queueNumber("cy", i);
  },
  // Add animatable move
  move(i, t) {
    return this.x(i).y(t);
  },
  amove(i, t) {
    return this.ax(i).ay(t);
  },
  // Add animatable center
  center(i, t) {
    return this.cx(i).cy(t);
  },
  // Add animatable size
  size(i, t) {
    let e;
    return (!i || !t) && (e = this._element.bbox()), i || (i = e.width / e.height * t), t || (t = e.height / e.width * i), this.width(i).height(t);
  },
  // Add animatable width
  width(i) {
    return this._queueNumber("width", i);
  },
  // Add animatable height
  height(i) {
    return this._queueNumber("height", i);
  },
  // Add animatable plot
  plot(i, t, e, n) {
    if (arguments.length === 4)
      return this.plot([i, t, e, n]);
    if (this._tryRetarget("plot", i)) return this;
    const s = new Nt(this._stepper).type(this._element.MorphArray).to(i);
    return this.queue(
      function() {
        s.from(this._element.array());
      },
      function(o) {
        return this._element.plot(s.at(o)), s.done();
      }
    ), this._rememberMorpher("plot", s), this;
  },
  // Add leading method
  leading(i) {
    return this._queueNumber("leading", i);
  },
  // Add animatable viewbox
  viewbox(i, t, e, n) {
    return this._queueObject("viewbox", new Y(i, t, e, n));
  },
  update(i) {
    return typeof i != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (i.opacity != null && this.attr("stop-opacity", i.opacity), i.color != null && this.attr("stop-color", i.color), i.offset != null && this.attr("offset", i.offset), this);
  }
});
k(ht, { rx: bn, ry: wn, from: bi, to: wi });
P(ht, "Runner");
class Ae extends rt {
  constructor(t, e = t) {
    super(F("svg", t), e), this.namespace();
  }
  // Creates and returns defs element
  defs() {
    return this.isRoot() ? pt(this.node.querySelector("defs")) || this.put(new yn()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof D.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  // Add namespaces
  namespace() {
    return this.isRoot() ? this.attr({ xmlns: dn, version: "1.1" }).attr(
      "xmlns:xlink",
      ce,
      Ge
    ) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, Ge).attr("xmlns:svgjs", null, Ge);
  }
  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    return this.isRoot() ? this : super.root();
  }
}
R({
  Container: {
    // Create nested svg document
    nested: U(function() {
      return this.put(new Ae());
    })
  }
});
P(Ae, "Svg", !0);
let Cn = class extends rt {
  // Initialize node
  constructor(t, e = t) {
    super(F("symbol", t), e);
  }
};
R({
  Container: {
    symbol: U(function() {
      return this.put(new Cn());
    })
  }
});
P(Cn, "Symbol");
function yr(i) {
  return this._build === !1 && this.clear(), this.node.appendChild(D.document.createTextNode(i)), this;
}
function br() {
  return this.node.getComputedTextLength();
}
function wr(i, t = this.bbox()) {
  return i == null ? t.x : this.attr("x", this.attr("x") + i - t.x);
}
function vr(i, t = this.bbox()) {
  return i == null ? t.y : this.attr("y", this.attr("y") + i - t.y);
}
function xr(i, t, e = this.bbox()) {
  return this.x(i, e).y(t, e);
}
function _r(i, t = this.bbox()) {
  return i == null ? t.cx : this.attr("x", this.attr("x") + i - t.cx);
}
function Cr(i, t = this.bbox()) {
  return i == null ? t.cy : this.attr("y", this.attr("y") + i - t.cy);
}
function Er(i, t, e = this.bbox()) {
  return this.cx(i, e).cy(t, e);
}
function Sr(i) {
  return this.attr("x", i);
}
function Mr(i) {
  return this.attr("y", i);
}
function Tr(i, t) {
  return this.ax(i).ay(t);
}
function kr(i) {
  return this._build = !!i, this;
}
const Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amove: Tr,
  ax: Sr,
  ay: Mr,
  build: kr,
  center: Er,
  cx: _r,
  cy: Cr,
  length: br,
  move: xr,
  plain: yr,
  x: wr,
  y: vr
}, Symbol.toStringTag, { value: "Module" }));
class yt extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("text", t), e), this.dom.leading = this.dom.leading ?? new M(1.3), this._rebuild = !0, this._build = !1;
  }
  // Set / get leading
  leading(t) {
    return t == null ? this.dom.leading : (this.dom.leading = new M(t), this.rebuild());
  }
  // Rebuild appearance type
  rebuild(t) {
    if (typeof t == "boolean" && (this._rebuild = t), this._rebuild) {
      const e = this;
      let n = 0;
      const s = this.dom.leading;
      this.each(function(o) {
        if (je(this.node)) return;
        const r = D.window.getComputedStyle(this.node).getPropertyValue("font-size"), a = s * new M(r);
        this.dom.newLined && (this.attr("x", e.attr("x")), this.text() === `
` ? n += a : (this.attr("dy", o ? a + n : 0), n = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  // overwrite method from parent to set data properly
  setData(t) {
    return this.dom = t, this.dom.leading = new M(t.leading || 1.3), this;
  }
  writeDataToDom() {
    return ni(this, this.dom, { leading: 1.3 }), this;
  }
  // Set the text content
  text(t) {
    if (t === void 0) {
      const e = this.node.childNodes;
      let n = 0;
      t = "";
      for (let s = 0, o = e.length; s < o; ++s) {
        if (e[s].nodeName === "textPath" || je(e[s])) {
          s === 0 && (n = s + 1);
          continue;
        }
        s !== n && e[s].nodeType !== 3 && pt(e[s]).dom.newLined === !0 && (t += `
`), t += e[s].textContent;
      }
      return t;
    }
    if (this.clear().build(!0), typeof t == "function")
      t.call(this, this);
    else {
      t = (t + "").split(`
`);
      for (let e = 0, n = t.length; e < n; e++)
        this.newLine(t[e]);
    }
    return this.build(!1).rebuild();
  }
}
k(yt, Si);
R({
  Container: {
    // Create text element
    text: U(function(i = "") {
      return this.put(new yt()).text(i);
    }),
    // Create plain text element
    plain: U(function(i = "") {
      return this.put(new yt()).plain(i);
    })
  }
});
P(yt, "Text");
class Re extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("tspan", t), e), this._build = !1;
  }
  // Shortcut dx
  dx(t) {
    return this.attr("dx", t);
  }
  // Shortcut dy
  dy(t) {
    return this.attr("dy", t);
  }
  // Create new line
  newLine() {
    this.dom.newLined = !0;
    const t = this.parent();
    if (!(t instanceof yt))
      return this;
    const e = t.index(this), n = D.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = t.dom.leading * new M(n);
    return this.dy(e ? s : 0).attr("x", t.x());
  }
  // Set text content
  text(t) {
    return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
  }
}
k(Re, Si);
R({
  Tspan: {
    tspan: U(function(i = "") {
      const t = new Re();
      return this._build || this.clear(), this.put(t).text(i);
    })
  },
  Text: {
    newLine: function(i = "") {
      return this.tspan(i).newLine();
    }
  }
});
P(Re, "Tspan");
class Ne extends dt {
  constructor(t, e = t) {
    super(F("circle", t), e);
  }
  radius(t) {
    return this.attr("r", t);
  }
  // Radius x value
  rx(t) {
    return this.attr("r", t);
  }
  // Alias radius x value
  ry(t) {
    return this.rx(t);
  }
  size(t) {
    return this.radius(new M(t).divide(2));
  }
}
k(Ne, { x: di, y: ui, cx: fi, cy: pi, width: gi, height: mi });
R({
  Container: {
    // Create circle element
    circle: U(function(i = 0) {
      return this.put(new Ne()).size(i).move(0, 0);
    })
  }
});
P(Ne, "Circle");
class tn extends rt {
  constructor(t, e = t) {
    super(F("clipPath", t), e);
  }
  // Unclip all clipped elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unclip();
    }), super.remove();
  }
  targets() {
    return Xt("svg [clip-path*=" + this.id() + "]");
  }
}
R({
  Container: {
    // Create clipping element
    clip: U(function() {
      return this.defs().put(new tn());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(i) {
      const t = i instanceof tn ? i : this.parent().clip().add(i);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    // Unclip element
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
P(tn, "ClipPath");
class Mi extends ot {
  constructor(t, e = t) {
    super(F("foreignObject", t), e);
  }
}
R({
  Container: {
    foreignObject: U(function(i, t) {
      return this.put(new Mi()).size(i, t);
    })
  }
});
P(Mi, "ForeignObject");
function Ar(i, t) {
  return this.children().forEach((e) => {
    let n;
    try {
      n = e.node instanceof un().SVGSVGElement ? new Y(e.attr(["x", "y", "width", "height"])) : e.bbox();
    } catch {
      return;
    }
    const s = new N(e), o = s.translate(i, t).transform(s.inverse()), r = new X(n.x, n.y).transform(o);
    e.move(r.x, r.y);
  }), this;
}
function Rr(i) {
  return this.dmove(i, 0);
}
function Nr(i) {
  return this.dmove(0, i);
}
function Dr(i, t = this.bbox()) {
  return i == null ? t.height : this.size(t.width, i, t);
}
function Pr(i = 0, t = 0, e = this.bbox()) {
  const n = i - e.x, s = t - e.y;
  return this.dmove(n, s);
}
function Ir(i, t, e = this.bbox()) {
  const n = Yt(this, i, t, e), s = n.width / e.width, o = n.height / e.height;
  return this.children().forEach((r) => {
    const a = new X(e).transform(new N(r).inverse());
    r.scale(s, o, a.x, a.y);
  }), this;
}
function Or(i, t = this.bbox()) {
  return i == null ? t.width : this.size(i, t.height, t);
}
function zr(i, t = this.bbox()) {
  return i == null ? t.x : this.move(i, t.y, t);
}
function Lr(i, t = this.bbox()) {
  return i == null ? t.y : this.move(t.x, i, t);
}
const Ti = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dmove: Ar,
  dx: Rr,
  dy: Nr,
  height: Dr,
  move: Pr,
  size: Ir,
  width: Or,
  x: zr,
  y: Lr
}, Symbol.toStringTag, { value: "Module" }));
class Vt extends rt {
  constructor(t, e = t) {
    super(F("g", t), e);
  }
}
k(Vt, Ti);
R({
  Container: {
    // Create a group element
    group: U(function() {
      return this.put(new Vt());
    })
  }
});
P(Vt, "G");
class Se extends rt {
  constructor(t, e = t) {
    super(F("a", t), e);
  }
  // Link target attribute
  target(t) {
    return this.attr("target", t);
  }
  // Link url
  to(t) {
    return this.attr("href", t, ce);
  }
}
k(Se, Ti);
R({
  Container: {
    // Create a hyperlink element
    link: U(function(i) {
      return this.put(new Se()).to(i);
    })
  },
  Element: {
    unlink() {
      const i = this.linker();
      if (!i) return this;
      const t = i.parent();
      if (!t)
        return this.remove();
      const e = t.index(i);
      return t.add(this, e), i.remove(), this;
    },
    linkTo(i) {
      let t = this.linker();
      return t || (t = new Se(), this.wrap(t)), typeof i == "function" ? i.call(t, t) : t.to(i), this;
    },
    linker() {
      const i = this.parent();
      return i && i.node.nodeName.toLowerCase() === "a" ? i : null;
    }
  }
});
P(Se, "A");
class en extends rt {
  // Initialize node
  constructor(t, e = t) {
    super(F("mask", t), e);
  }
  // Unmask all masked elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unmask();
    }), super.remove();
  }
  targets() {
    return Xt("svg [mask*=" + this.id() + "]");
  }
}
R({
  Container: {
    mask: U(function() {
      return this.defs().put(new en());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference("mask");
    },
    maskWith(i) {
      const t = i instanceof en ? i : this.parent().mask().add(i);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    // Unmask element
    unmask() {
      return this.attr("mask", null);
    }
  }
});
P(en, "Mask");
class ki extends ot {
  constructor(t, e = t) {
    super(F("stop", t), e);
  }
  // add color stops
  update(t) {
    return (typeof t == "number" || t instanceof M) && (t = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), t.opacity != null && this.attr("stop-opacity", t.opacity), t.color != null && this.attr("stop-color", t.color), t.offset != null && this.attr("offset", new M(t.offset)), this;
  }
}
R({
  Gradient: {
    // Add a color stop
    stop: function(i, t, e) {
      return this.put(new ki()).update(i, t, e);
    }
  }
});
P(ki, "Stop");
function Br(i, t) {
  if (!i) return "";
  if (!t) return i;
  let e = i + "{";
  for (const n in t)
    e += Rs(n) + ":" + t[n] + ";";
  return e += "}", e;
}
class nn extends ot {
  constructor(t, e = t) {
    super(F("style", t), e);
  }
  addText(t = "") {
    return this.node.textContent += t, this;
  }
  font(t, e, n = {}) {
    return this.rule("@font-face", {
      fontFamily: t,
      src: e,
      ...n
    });
  }
  rule(t, e) {
    return this.addText(Br(t, e));
  }
}
R("Dom", {
  style(i, t) {
    return this.put(new nn()).rule(i, t);
  },
  fontface(i, t, e) {
    return this.put(new nn()).font(i, t, e);
  }
});
P(nn, "Style");
class En extends yt {
  // Initialize node
  constructor(t, e = t) {
    super(F("textPath", t), e);
  }
  // return the array of the path track element
  array() {
    const t = this.track();
    return t ? t.array() : null;
  }
  // Plot path if any
  plot(t) {
    const e = this.track();
    let n = null;
    return e && (n = e.plot(t)), t == null ? n : this;
  }
  // Get the path element
  track() {
    return this.reference("href");
  }
}
R({
  Container: {
    textPath: U(function(i, t) {
      return i instanceof yt || (i = this.text(i)), i.path(t);
    })
  },
  Text: {
    // Create path for text to run on
    path: U(function(i, t = !0) {
      const e = new En();
      i instanceof $t || (i = this.defs().path(i)), e.attr("href", "#" + i, ce);
      let n;
      if (t)
        for (; n = this.node.firstChild; )
          e.node.appendChild(n);
      return this.put(e);
    }),
    // Get the textPath children
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    // creates a textPath from this path
    text: U(function(i) {
      return i instanceof yt || (i = new yt().addTo(this.parent()).text(i)), i.path(this);
    }),
    targets() {
      return Xt("svg textPath").filter((i) => (i.attr("href") || "").includes(this.id()));
    }
  }
});
En.prototype.MorphArray = It;
P(En, "TextPath");
class Ai extends dt {
  constructor(t, e = t) {
    super(F("use", t), e);
  }
  // Use element as a reference
  use(t, e) {
    return this.attr("href", (e || "") + "#" + t, ce);
  }
}
R({
  Container: {
    // Create a use element
    use: U(function(i, t) {
      return this.put(new Ai()).use(i, t);
    })
  }
});
P(Ai, "Use");
const De = it;
k([Ae, Cn, ke, oe, _e], st("viewbox"));
k([Ft, jt, Wt, $t], st("marker"));
k(yt, st("Text"));
k($t, st("Path"));
k(yn, st("Defs"));
k([yt, Re], st("Tspan"));
k([pe, de, ue, ht], st("radius"));
k(he, st("EventTarget"));
k(kt, st("Dom"));
k(ot, st("Element"));
k(dt, st("Shape"));
k([rt, yi], st("Container"));
k(ue, st("Gradient"));
k(ht, st("Runner"));
Pt.extend(ks());
or([
  M,
  L,
  Y,
  N,
  Ut,
  At,
  It,
  X
]);
rr();
const Fn = (i) => (i.changedTouches && (i = i.changedTouches[0]), { x: i.clientX, y: i.clientY });
class Gr {
  constructor(t) {
    t.remember("_draggable", this), this.el = t, this.drag = this.drag.bind(this), this.startDrag = this.startDrag.bind(this), this.endDrag = this.endDrag.bind(this);
  }
  // Enables or disabled drag based on input
  init(t) {
    t ? (this.el.on("mousedown.drag", this.startDrag), this.el.on("touchstart.drag", this.startDrag, { passive: !1 })) : (this.el.off("mousedown.drag"), this.el.off("touchstart.drag"));
  }
  // Start dragging
  startDrag(t) {
    const e = !t.type.indexOf("mouse");
    if (e && t.which !== 1 && t.buttons !== 0 || this.el.dispatch("beforedrag", { event: t, handler: this }).defaultPrevented)
      return;
    t.preventDefault(), t.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Fn(t));
    const n = (e ? "mousemove" : "touchmove") + ".drag", s = (e ? "mouseup" : "touchend") + ".drag";
    ct(window, n, this.drag, this, { passive: !1 }), ct(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: t, handler: this, box: this.box });
  }
  // While dragging
  drag(t) {
    const { box: e, lastClick: n } = this, s = this.el.point(Fn(t)), o = s.x - n.x, r = s.y - n.y;
    if (!o && !r) return e;
    const a = e.x + o, l = e.y + r;
    this.box = new Y(a, l, e.w, e.h), this.lastClick = s, !this.el.dispatch("dragmove", {
      event: t,
      handler: this,
      box: this.box,
      dx: o,
      dy: r
    }).defaultPrevented && this.move(a, l);
  }
  move(t, e) {
    this.el.type === "svg" ? Vt.prototype.move.call(this.el, t, e) : this.el.move(t, e);
  }
  endDrag(t) {
    this.drag(t), this.el.fire("dragend", { event: t, handler: this, box: this.box }), J(window, "mousemove.drag"), J(window, "touchmove.drag"), J(window, "mouseup.drag"), J(window, "touchend.drag"), this.init(!0);
  }
}
k(ot, {
  draggable(i = !0) {
    return (this.remember("_draggable") || new Gr(this)).init(i), this;
  }
});
var te = function(t) {
  return t.touches || [{
    clientX: t.clientX,
    clientY: t.clientY
  }];
};
k(Ae, {
  panZoom: function(t) {
    var e, n, s, o, r, a, l, c, h, d, u, f, g = this;
    if (this.off(".panZoom"), t === !1) return this;
    t = (e = t) != null ? e : {};
    var p = (n = t.zoomFactor) != null ? n : 2, y = (s = t.zoomMin) != null ? s : Number.MIN_VALUE, m = (o = t.zoomMax) != null ? o : Number.MAX_VALUE, b = (r = t.wheelZoom) != null ? r : !0, w = (a = t.pinchZoom) != null ? a : !0, x = (l = t.panning) != null ? l : !0, _ = (c = t.panButton) != null ? c : 0, v = (h = t.oneFingerPan) != null ? h : !1, C = (d = t.margins) != null ? d : !1, A = (u = t.wheelZoomDeltaModeLinePixels) != null ? u : 17, B = (f = t.wheelZoomDeltaModeScreenPixels) != null ? f : 53, I, T, Z = !1, H = this.viewbox(), q = function(E) {
      if (!C) return E;
      var O = C.top, j = C.left, ut = C.bottom, ft = C.right, nt = g.attr(["width", "height"]), lt = nt.width, zt = nt.height, S = g.node.preserveAspectRatio.baseVal, vt = 0, xt = 0, Kt = 0, Qt = 0;
      if (S.align !== S.SVG_PRESERVEASPECTRATIO_NONE) {
        var ge = lt / zt, me = H.width / H.height;
        if (me !== ge) {
          var Pn = S.meetOrSlice !== S.SVG_MEETORSLICE_SLICE, Le = ge > me ? "width" : "height", In = Le === "width", On = Pn && In || !Pn && !In, Cs = On ? ge / me : me / ge, Ct = E[Le] - E[Le] * Cs;
          On ? S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (vt = Ct / 2, xt = -Ct / 2) : S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMAX ? xt = -Ct : (S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (vt = Ct) : S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (Kt = Ct / 2, Qt = -Ct / 2) : S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? Qt = -Ct : (S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMAX || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMAX || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (Kt = Ct);
        }
      }
      var Es = H.width + H.x - j - vt, Ss = H.x + ft - E.width - xt, Ms = H.height + H.y - O - Kt, Ts = H.y + ut - E.height - Qt;
      return E.x = Math.min(Es, Math.max(Ss, E.x)), E.y = Math.min(Ms, Math.max(Ts, E.y)), E;
    }, G = function(E) {
      E.preventDefault();
      var O;
      switch (E.deltaMode) {
        case 1:
          O = E.deltaY * A;
          break;
        case 2:
          O = E.deltaY * B;
          break;
        default:
          O = E.deltaY;
          break;
      }
      var j = Math.pow(1 + p, -1 * O / 100) * this.zoom(), ut = this.point(E.clientX, E.clientY);
      if (j > m && (j = m), j < y && (j = y), this.dispatch("zoom", {
        level: j,
        focus: ut
      }).defaultPrevented)
        return this;
      if (this.zoom(j, ut), C) {
        var ft = q(this.viewbox());
        this.viewbox(ft);
      }
    }, W = function et(E) {
      if (T = te(E), T.length < 2) {
        x && v && at.call(this, E);
        return;
      }
      x && v && wt.call(this, E), E.preventDefault(), !this.dispatch("pinchZoomStart", {
        event: E
      }).defaultPrevented && (this.off("touchstart.panZoom", et), Z = !0, ct(document, "touchmove.panZoom", tt, this, {
        passive: !1
      }), ct(document, "touchend.panZoom", K, this, {
        passive: !1
      }));
    }, K = function et(E) {
      E.preventDefault();
      var O = te(E);
      O.length > 1 || (Z = !1, this.dispatch("pinchZoomEnd", {
        event: E
      }), J(document, "touchmove.panZoom", tt), J(document, "touchend.panZoom", et), this.on("touchstart.panZoom", W), O.length && x && v && at.call(this, E));
    }, tt = function(E) {
      E.preventDefault();
      var O = te(E), j = this.zoom(), ut = Math.sqrt(Math.pow(T[0].clientX - T[1].clientX, 2) + Math.pow(T[0].clientY - T[1].clientY, 2)), ft = Math.sqrt(Math.pow(O[0].clientX - O[1].clientX, 2) + Math.pow(O[0].clientY - O[1].clientY, 2)), nt = ut / ft;
      (j < y && nt > 1 || j > m && nt < 1) && (nt = 1);
      var lt = {
        x: O[0].clientX + 0.5 * (O[1].clientX - O[0].clientX),
        y: O[0].clientY + 0.5 * (O[1].clientY - O[0].clientY)
      }, zt = {
        x: T[0].clientX + 0.5 * (T[1].clientX - T[0].clientX),
        y: T[0].clientY + 0.5 * (T[1].clientY - T[0].clientY)
      }, S = this.point(lt.x, lt.y), vt = this.point(2 * lt.x - zt.x, 2 * lt.y - zt.y), xt = new Y(this.viewbox()).transform(new N().translate(-vt.x, -vt.y).scale(nt, 0, 0).translate(S.x, S.y));
      q(xt), this.viewbox(xt), T = O, this.dispatch("zoom", {
        box: xt,
        focus: vt
      });
    }, at = function et(E) {
      var O = E.type.indexOf("mouse") > -1;
      O && E.button !== _ && E.which !== _ + 1 || (E.preventDefault(), this.off("mousedown.panZoom", et), T = te(E), !Z && (this.dispatch("panStart", {
        event: E
      }), I = {
        x: T[0].clientX,
        y: T[0].clientY
      }, ct(document, "touchmove.panZoom mousemove.panZoom", Ot, this, {
        passive: !1
      }), ct(document, "touchend.panZoom mouseup.panZoom", wt, this, {
        passive: !1
      })));
    }, wt = function et(E) {
      E.preventDefault(), J(document, "touchmove.panZoom mousemove.panZoom", Ot), J(document, "touchend.panZoom mouseup.panZoom", et), this.on("mousedown.panZoom", at), this.dispatch("panEnd", {
        event: E
      });
    }, Ot = function(E) {
      E.preventDefault();
      var O = te(E), j = {
        x: O[0].clientX,
        y: O[0].clientY
      }, ut = this.point(j.x, j.y), ft = this.point(I.x, I.y), nt = [ft.x - ut.x, ft.y - ut.y];
      if (!(!nt[0] && !nt[1])) {
        var lt = new Y(this.viewbox()).transform(new N().translate(nt[0], nt[1]));
        I = j, q(lt), !this.dispatch("panning", {
          box: lt,
          event: E
        }).defaultPrevented && this.viewbox(lt);
      }
    };
    return b && this.on("wheel.panZoom", G, this, {
      passive: !1
    }), w && this.on("touchstart.panZoom", W, this, {
      passive: !1
    }), x && this.on("mousedown.panZoom", at, this, {
      passive: !1
    }), this;
  }
});
/*!
* @svgdotjs/svg.select.js - An extension of svg.js which allows to select elements with mouse
* @version 4.0.3
* https://github.com/svgdotjs/svg.select.js
*
* @copyright Ulrich-Matthias Schäfer
* @license MIT
*
* BUILT: Tue May 06 2025 16:29:41 GMT+0200 (Central European Summer Time)
*/
function sn(i, t, e, n = null) {
  return function(s) {
    s.preventDefault(), s.stopPropagation();
    var o = s.pageX || s.touches[0].pageX, r = s.pageY || s.touches[0].pageY;
    t.fire(i, { x: o, y: r, event: s, index: n, points: e });
  };
}
function on([i, t], { a: e, b: n, c: s, d: o, e: r, f: a }) {
  return [i * e + t * s + r, i * n + t * o + a];
}
class Ri {
  constructor(t) {
    this.el = t, t.remember("_selectHandler", this), this.selection = new Vt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = un();
    this.observer = new e.MutationObserver(this.mutationHandler);
  }
  init(t) {
    this.createHandle = t.createHandle || this.createHandleFn, this.createRot = t.createRot || this.createRotFn, this.updateHandle = t.updateHandle || this.updateHandleFn, this.updateRot = t.updateRot || this.updateRotFn, this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createResizeHandles(), this.updateResizeHandles(), this.createRotationHandle(), this.updateRotationHandle(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(t, e) {
    if (!t) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(e);
  }
  createSelection() {
    this.selection.polygon(this.handlePoints).addClass("svg_select_shape");
  }
  updateSelection() {
    this.selection.get(0).plot(this.handlePoints);
  }
  createResizeHandles() {
    this.handlePoints.forEach((t, e, n) => {
      const s = this.order[e];
      this.createHandle.call(this, this.selection, t, e, n, s), this.selection.get(e + 1).addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection touchstart.selection", sn(s, this.el, this.handlePoints, e));
    });
  }
  createHandleFn(t) {
    t.polyline();
  }
  updateHandleFn(t, e, n, s) {
    const o = s.at(n - 1), r = s[(n + 1) % s.length], a = e, l = [a[0] - o[0], a[1] - o[1]], c = [a[0] - r[0], a[1] - r[1]], h = Math.sqrt(l[0] * l[0] + l[1] * l[1]), d = Math.sqrt(c[0] * c[0] + c[1] * c[1]), u = [l[0] / h, l[1] / h], f = [c[0] / d, c[1] / d], g = [a[0] - u[0] * 10, a[1] - u[1] * 10], p = [a[0] - f[0] * 10, a[1] - f[1] * 10];
    t.plot([g, a, p]);
  }
  updateResizeHandles() {
    this.handlePoints.forEach((t, e, n) => {
      const s = this.order[e];
      this.updateHandle.call(this, this.selection.get(e + 1), t, e, n, s);
    });
  }
  createRotFn(t) {
    t.line(), t.circle(5);
  }
  getPoint(t) {
    return this.handlePoints[this.order.indexOf(t)];
  }
  getPointHandle(t) {
    return this.selection.get(this.order.indexOf(t) + 1);
  }
  updateRotFn(t, e) {
    const n = this.getPoint("t");
    t.get(0).plot(n[0], n[1], e[0], e[1]), t.get(1).center(e[0], e[1]);
  }
  createRotationHandle() {
    const t = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection touchstart.selection", sn("rot", this.el, this.handlePoints));
    this.createRot.call(this, t);
  }
  updateRotationHandle() {
    const t = this.selection.findOne("g.svg_select_handle_rot");
    this.updateRot(t, this.rotationPoint, this.handlePoints);
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.bbox(), e = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(t).map((n) => on(n, e)), this.rotationPoint = on(this.getRotationPoint(t), e);
  }
  // A collection of all the points we need to draw our ui
  getHandlePoints({ x: t, x2: e, y: n, y2: s, cx: o, cy: r } = this.el.bbox()) {
    return [
      [t, n],
      [o, n],
      [e, n],
      [e, r],
      [e, s],
      [o, s],
      [t, s],
      [t, r]
    ];
  }
  // A collection of all the points we need to draw our ui
  getRotationPoint({ y: t, cx: e } = this.el.bbox()) {
    return [e, t - 20];
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updateResizeHandles(), this.updateRotationHandle();
  }
}
class Hr {
  constructor(t) {
    this.el = t, t.remember("_pointSelectHandler", this), this.selection = new Vt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = un();
    this.observer = new e.MutationObserver(this.mutationHandler);
  }
  init(t) {
    this.createHandle = t.createHandle || this.createHandleFn, this.updateHandle = t.updateHandle || this.updateHandleFn, this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createPointHandles(), this.updatePointHandles(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(t, e) {
    if (!t) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(e);
  }
  createSelection() {
    this.selection.polygon(this.points).addClass("svg_select_shape_pointSelect");
  }
  updateSelection() {
    this.selection.get(0).plot(this.points);
  }
  createPointHandles() {
    this.points.forEach((t, e, n) => {
      this.createHandle.call(this, this.selection, t, e, n), this.selection.get(e + 1).addClass("svg_select_handle_point").on("mousedown.selection touchstart.selection", sn("point", this.el, this.points, e));
    });
  }
  createHandleFn(t) {
    t.circle(5);
  }
  updateHandleFn(t, e) {
    t.center(e[0], e[1]);
  }
  updatePointHandles() {
    this.points.forEach((t, e, n) => {
      this.updateHandle.call(this, this.selection.get(e + 1), t, e, n);
    });
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.points = this.el.array().map((e) => on(e, t));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}
const Ni = (i) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let n = this.remember("_" + i.name);
  return n || (t.prototype instanceof Ri ? (n = new t(this), t = !0) : n = new i(this), this.remember("_" + i.name, n)), n.active(t, e), this;
};
k(ot, {
  select: Ni(Ri)
});
k([Wt, jt, Ft], {
  pointSelect: Ni(Hr)
});
/*!
* @svgdotjs/svg.resize.js - An extension for svg.js which allows to resize elements which are selected
* @version 2.0.5
* https://github.com/svgdotjs/svg.resize.js
*
* @copyright [object Object]
* @license MIT
*
* BUILT: Wed Nov 20 2024 23:15:57 GMT+0100 (Central European Standard Time)
*/
const ye = (i) => (i.changedTouches && (i = i.changedTouches[0]), { x: i.clientX, y: i.clientY }), Di = (i) => {
  let t = 1 / 0, e = 1 / 0, n = -1 / 0, s = -1 / 0;
  for (let o = 0; o < i.length; o++) {
    const r = i[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), n = Math.max(n, r[0]), s = Math.max(s, r[1]);
  }
  return new Y(t, e, n - t, s - e);
};
function Ur(i, t, e) {
  const s = [
    [i.x, i.y],
    [i.x + i.width, i.y],
    [i.x + i.width, i.y + i.height],
    [i.x, i.y + i.height]
  ].map(([o, r]) => {
    const a = o - t[0], l = r - t[1], c = a * e, h = l * e;
    return [c + t[0], h + t[1]];
  });
  return Di(s);
}
class Zn {
  constructor(t) {
    this.el = t, t.remember("_ResizeHandler", this), this.lastCoordinates = null, this.eventType = "", this.lastEvent = null, this.handleResize = this.handleResize.bind(this), this.resize = this.resize.bind(this), this.endResize = this.endResize.bind(this), this.rotate = this.rotate.bind(this), this.movePoint = this.movePoint.bind(this);
  }
  active(t, e) {
    this.preserveAspectRatio = e.preserveAspectRatio ?? !1, this.aroundCenter = e.aroundCenter ?? !1, this.grid = e.grid ?? 0, this.degree = e.degree ?? 0, this.el.off(".resize"), t && (this.el.on(
      [
        "lt.resize",
        "rt.resize",
        "rb.resize",
        "lb.resize",
        "t.resize",
        "r.resize",
        "b.resize",
        "l.resize",
        "rot.resize",
        "point.resize"
      ],
      this.handleResize
    ), this.lastEvent && (this.eventType === "rot" ? this.rotate(this.lastEvent) : this.eventType === "point" ? this.movePoint(this.lastEvent) : this.resize(this.lastEvent)));
  }
  // This is called when a user clicks on one of the resize points
  handleResize(t) {
    this.eventType = t.type;
    const { event: e, index: n, points: s } = t.detail, o = !e.type.indexOf("mouse");
    if (o && (e.which || e.buttons) !== 1 || this.el.dispatch("beforeresize", { event: t, handler: this }).defaultPrevented)
      return;
    this.box = this.el.bbox(), this.startPoint = this.el.point(ye(e)), this.index = n, this.points = s.slice();
    const r = (o ? "mousemove" : "touchmove") + ".resize", a = (o ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    t.type === "point" ? ct(window, r, this.movePoint) : t.type === "rot" ? ct(window, r, this.rotate) : ct(window, r, this.resize), ct(window, a, this.endResize);
  }
  resize(t) {
    this.lastEvent = t;
    const e = this.snapToGrid(this.el.point(ye(t)));
    let n = e.x - this.startPoint.x, s = e.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (n *= 2, s *= 2);
    const o = this.box.x + n, r = this.box.y + s, a = this.box.x2 + n, l = this.box.y2 + s;
    let c = new Y(this.box);
    if (this.eventType.includes("l") && (c.x = Math.min(o, this.box.x2), c.x2 = Math.max(o, this.box.x2)), this.eventType.includes("r") && (c.x = Math.min(a, this.box.x), c.x2 = Math.max(a, this.box.x)), this.eventType.includes("t") && (c.y = Math.min(r, this.box.y2), c.y2 = Math.max(r, this.box.y2)), this.eventType.includes("b") && (c.y = Math.min(l, this.box.y), c.y2 = Math.max(l, this.box.y)), c.width = c.x2 - c.x, c.height = c.y2 - c.y, this.preserveAspectRatio) {
      const h = c.width / this.box.width, d = c.height / this.box.height, u = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], f = (u.indexOf(this.eventType) + 4) % u.length, g = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[f];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? d : h;
      p = this.eventType.length === 2 ? Math.max(h, d) : p, c = Ur(this.box, g, p);
    }
    this.el.dispatch("resize", {
      box: new Y(c),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.size(c.width, c.height).move(c.x, c.y);
  }
  movePoint(t) {
    this.lastEvent = t;
    const { x: e, y: n } = this.snapToGrid(this.el.point(ye(t))), s = this.el.array().slice();
    s[this.index] = [e, n], !this.el.dispatch("resize", {
      box: Di(s),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(t) {
    this.lastEvent = t;
    const e = this.startPoint, n = this.el.point(ye(t)), { cx: s, cy: o } = this.box, r = e.x - s, a = e.y - o, l = n.x - s, c = n.y - o, h = Math.sqrt(r * r + a * a) * Math.sqrt(l * l + c * c);
    if (h === 0)
      return;
    let d = Math.acos((r * l + a * c) / h) / Math.PI * 180;
    if (!d) return;
    n.x < e.x && (d = -d);
    const u = new N(this.el), { x: f, y: g } = new X(s, o).transformO(u), { rotate: p } = u.decompose(), y = this.snapToAngle(p + d) - p;
    this.el.dispatch("resize", {
      box: this.box,
      angle: y,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.transform(u.rotateO(y, f, g));
  }
  endResize(t) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(t), this.lastEvent = null, this.eventType = "", J(window, "mousemove.resize touchmove.resize"), J(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(t) {
    return this.grid && (t.x = Math.round(t.x / this.grid) * this.grid, t.y = Math.round(t.y / this.grid) * this.grid), t;
  }
  snapToAngle(t) {
    return this.degree && (t = Math.round(t / this.degree) * this.degree), t;
  }
}
k(ot, {
  // Resize element with mouse
  resize: function(i = !0, t = {}) {
    typeof i == "object" && (t = i, i = !0);
    let e = this.remember("_ResizeHandler");
    return e || (i.prototype instanceof Zn ? (e = new i(this), i = !0) : e = new Zn(this), this.remember("_resizeHandler", e)), e.active(i, t), this;
  }
});
function Mt(i, t, e) {
  try {
    const n = i.node.ownerSVGElement || i.node, s = i.node.getScreenCTM(), o = n.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = s.a * t + s.c * e + s.e, a = s.b * t + s.d * e + s.f, l = o.a * o.d - o.b * o.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = o.d / l, h = -o.b / l, d = -o.c / l, u = o.a / l, f = (o.c * o.f - o.d * o.e) / l, g = (o.b * o.e - o.a * o.f) / l, p = c * r + d * a + f, y = h * r + u * a + g;
    return [p, y];
  } catch {
    return [t, e];
  }
}
function Pe(i, t, e) {
  try {
    const n = i.node.ownerSVGElement || i.node, s = i.node.getScreenCTM(), o = n.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = o.a * t + o.c * e + o.e, a = o.b * t + o.d * e + o.f, l = s.a * s.d - s.b * s.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = s.d / l, h = -s.b / l, d = -s.c / l, u = s.a / l, f = (s.c * s.f - s.d * s.e) / l, g = (s.b * s.e - s.a * s.f) / l, p = c * r + d * a + f, y = h * r + u * a + g;
    return [p, y];
  } catch {
    return [t, e];
  }
}
function ae(i) {
  const t = i.bbox();
  return Mt(i, t.cx, t.cy);
}
function Fr(i, t) {
  try {
    const e = i && i.node, n = e && e.querySelector && e.querySelector("path[data-shape-path]");
    if (!n || typeof n.getTotalLength != "function") return null;
    const s = n.getTotalLength();
    if (!s || !isFinite(s)) return null;
    let o = n.ownerSVGElement;
    for (; o && o.ownerSVGElement; ) o = o.ownerSVGElement;
    const r = n.getScreenCTM && n.getScreenCTM(), a = o && o.getScreenCTM && o.getScreenCTM();
    if (!o || !r || !a) return null;
    const l = a.inverse(), c = o.createSVGPoint(), h = (v, C) => {
      c.x = v, c.y = C;
      const A = c.matrixTransform(r).matrixTransform(l);
      return [A.x, A.y];
    }, [d, u] = ae(i), f = t[0] - d, g = t[1] - u, p = Math.sqrt(f * f + g * g) || 1, y = f / p, m = g / p;
    let b = null, w = -1 / 0;
    const x = 96;
    let _ = n.__outlineSamples;
    if (!_ || n.__outlineLen !== s) {
      _ = new Array(x);
      for (let v = 0; v < x; v++) {
        const C = n.getPointAtLength(v / x * s);
        _[v] = [C.x, C.y];
      }
      n.__outlineSamples = _, n.__outlineLen = s;
    }
    for (let v = 0; v < _.length; v++) {
      const [C, A] = h(_[v][0], _[v][1]);
      if (!isFinite(C) || !isFinite(A)) continue;
      const B = C - d, I = A - u, T = B * y + I * m, Z = Math.abs(B * m - I * y), H = T - Z * 1.5;
      H > w && (w = H, b = [C, A]);
    }
    return b;
  } catch {
    return null;
  }
}
function rn(i, t) {
  const e = Fr(i, t);
  if (e && isFinite(e[0]) && isFinite(e[1])) {
    const y = i.bbox(), [m, b] = Mt(i, y.cx, y.cy), w = Math.max(y.width, y.height, 1) * 3;
    if (Math.hypot(e[0] - m, e[1] - b) <= w)
      return e;
  }
  const n = i.bbox(), [s, o] = Pe(i, t[0], t[1]), r = n.cx, a = n.cy, l = s - r, c = o - a, h = Math.sqrt(l * l + c * c);
  if (h === 0)
    return Mt(i, r, a);
  const d = l / h, u = c / h;
  let f;
  if (i.type === "circle") {
    const y = parseFloat(i.attr("r")) || 0;
    f = [r + y * d, a + y * u];
  } else if (i.type === "ellipse") {
    const y = parseFloat(i.attr("rx")) || 0, m = parseFloat(i.attr("ry")) || 0, b = Math.atan2(u, d);
    f = [
      r + y * Math.cos(b),
      a + m * Math.sin(b)
    ];
  } else {
    const y = n.x, m = n.x + n.width, b = n.y, w = n.y + n.height, x = [];
    if (d !== 0) {
      const _ = (y - r) / d, v = a + _ * u;
      v >= b && v <= w && _ > 0 && x.push([y, v, _]);
    }
    if (d !== 0) {
      const _ = (m - r) / d, v = a + _ * u;
      v >= b && v <= w && _ > 0 && x.push([m, v, _]);
    }
    if (u !== 0) {
      const _ = (b - a) / u, v = r + _ * d;
      v >= y && v <= m && _ > 0 && x.push([v, b, _]);
    }
    if (u !== 0) {
      const _ = (w - a) / u, v = r + _ * d;
      v >= y && v <= m && _ > 0 && x.push([v, w, _]);
    }
    x.length > 0 ? (x.sort(function(_, v) {
      return _[2] - v[2];
    }), f = [x[0][0], x[0][1]]) : f = [r, a];
  }
  const [g, p] = Mt(i, f[0], f[1]);
  return isNaN(g) || isNaN(p) || !isFinite(g) || !isFinite(p) ? Mt(i, r, a) : [g, p];
}
function Yn(i, t) {
  const e = i.bbox(), n = e.x + (t.x != null ? t.x : 0.5) * e.width, s = e.y + (t.y != null ? t.y : 0.5) * e.height, [o, r] = Mt(i, n, s);
  return isNaN(o) || isNaN(r) || !isFinite(o) || !isFinite(r) ? ae(i) : [o, r];
}
function Xn(i, t) {
  try {
    const e = i.bbox();
    if (!e || !e.width || !e.height) return null;
    const [n, s] = Pe(i, t[0], t[1]), o = (n - e.x) / e.width, r = (s - e.y) / e.height, a = o, l = 1 - o, c = r, h = 1 - r, d = Math.min(a, l, c, h);
    let u = 0, f = 0;
    d === a ? u = -1 : d === l ? u = 1 : d === c ? f = -1 : f = 1;
    const g = Mt(i, e.cx, e.cy), p = Mt(i, e.cx + u, e.cy + f), y = p[0] - g[0], m = p[1] - g[1], b = Math.hypot(y, m);
    return b > 1e-4 ? [y / b, m / b] : null;
  } catch {
    return null;
  }
}
function Sn(i) {
  const t = {};
  if (!i.source || !i.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = ae(i.source), n = ae(i.target);
  i.sourceAnchor ? t.point1 = Yn(i.source, i.sourceAnchor) : i.sourceAttach === "center" ? t.point1 = e : t.point1 = rn(i.source, n), i.targetAnchor ? t.point2 = Yn(i.target, i.targetAnchor) : i.targetAttach === "center" ? t.point2 = n : t.point2 = rn(i.target, e);
  const s = t.point1, o = t.point2;
  let r;
  if (i.type === "curved") {
    const a = o[0] - s[0], l = o[1] - s[1], c = Math.sqrt(a * a + l * l);
    if (c < 1)
      return [["M", s[0], s[1]], ["L", o[0], o[1]]];
    const h = (m, b, w, x) => {
      const _ = Math.sqrt(m * m + b * b);
      if (_ > 1e-4) return [m / _, b / _];
      const v = Math.sqrt(w * w + x * x) || 1;
      return [w / v, x / v];
    }, d = i.sourceAnchor && Xn(i.source, s) || h(s[0] - e[0], s[1] - e[1], a, l), u = i.targetAnchor && Xn(i.target, o) || h(o[0] - n[0], o[1] - n[1], -a, -l), f = typeof i.lineCurviness == "number" ? i.lineCurviness : 0.3, g = Math.max(20, c * (0.12 + f * 0.55)), p = [s[0] + d[0] * g, s[1] + d[1] * g], y = [o[0] + u[0] * g, o[1] + u[1] * g];
    r = [
      ["M", s[0], s[1]],
      ["C", p[0], p[1], y[0], y[1], o[0], o[1]]
    ];
  } else if (i.type === "orthogonal") {
    const a = o[0] - s[0], l = o[1] - s[1], c = s[0] < e[0], h = s[1] < e[1], d = o[0] < n[0], u = o[1] < n[1];
    let f, g;
    if (Math.abs(a) > Math.abs(l))
      if (c && d || !c && !d) {
        const p = Math.max(i.curveRadius, Math.abs(l) / 2);
        g = s[1] + (l > 0 ? -p : p), r = [
          ["M", s[0], s[1]],
          ["L", s[0], g],
          ["L", o[0], g],
          ["L", o[0], o[1]]
        ];
      } else
        f = s[0] + a / 2, r = [
          ["M", s[0], s[1]],
          ["L", f, s[1]],
          ["L", f, o[1]],
          ["L", o[0], o[1]]
        ];
    else if (h && u || !h && !u) {
      const p = Math.max(i.curveRadius, Math.abs(a) / 2);
      f = s[0] + (a > 0 ? -p : p), r = [
        ["M", s[0], s[1]],
        ["L", f, s[1]],
        ["L", f, o[1]],
        ["L", o[0], o[1]]
      ];
    } else
      g = s[1] + l / 2, r = [
        ["M", s[0], s[1]],
        ["L", s[0], g],
        ["L", o[0], g],
        ["L", o[0], o[1]]
      ];
  } else
    r = [
      ["M", s[0], s[1]],
      ["L", o[0], o[1]]
    ];
  return r;
}
function $n(i, t, e, n, s, o) {
  if (!i || i === "null") return null;
  const a = Math.max(12, n * 3 + 6), l = a, c = a * 0.8, h = (e ? "source-" : "target-") + "triangle-" + Math.random().toString(16).substr(2, 8), d = s.defs().marker(l, c);
  d.attr({
    id: h,
    viewBox: "0 0 " + l + " " + c,
    // Anchor the marker at its TIP so the arrow point sits exactly on the line's
    // endpoint (the node edge) instead of overshooting into the node. The target
    // arrow's tip is at x=arrowWidth; the source arrow's tip is at x=0.
    refX: e ? "0" : l,
    refY: c / 2,
    // Center vertically
    // userSpaceOnUse (was "strokeWidth"): with strokeWidth units the rendered
    // marker is markerWidth × strokeWidth, but markerSize ALREADY scales with
    // strokeWidth (strokeWidth*3+6) — so the arrowhead was double-scaled and grew
    // ~10× the line width (a huge triangle). In user space the arrowhead is a
    // sensible absolute size that still grows with thicker lines via markerSize,
    // matching Miro's slim proportional heads.
    markerUnits: "userSpaceOnUse",
    markerWidth: l,
    // absolute px (viewBox already 0..arrowWidth)
    markerHeight: c,
    orient: "auto"
  });
  const u = d.path(), f = c / 2;
  return e ? u.attr({
    d: "M 0 " + f + " L " + l + " 0 L " + l + " " + c + " z"
  }) : u.attr({
    d: "M 0 0 L 0 " + c + " L " + l + " " + f + " z"
  }), u.fill(o), {
    element: d,
    id: h,
    size: a
  };
}
function Me(i, t, e, n) {
  return n && (i.markers = n), i.markerSource && (i.markerSource.element.remove(), i.connector.attr("marker-start", null)), i.markerTarget && (i.markerTarget.element.remove(), i.connector.attr("marker-end", null)), t && t !== "null" ? (i.markerSource = $n(
    t,
    0,
    !0,
    i.strokeWidth,
    i.markers || n,
    i.color
  ), i.connector.attr("marker-start", "url(#" + i.markerSource.id + ")")) : i.markerSource = null, e && e !== "null" ? (i.markerTarget = $n(
    e,
    0,
    !1,
    i.strokeWidth,
    i.markers || n,
    i.color
  ), i.connector.attr("marker-end", "url(#" + i.markerTarget.id + ")")) : i.markerTarget = null, i;
}
function Zr(i, t, e) {
  return i.markerSourceType = t || "null", i.markerTargetType = e || "null", Me(i, i.markerSourceType, i.markerTargetType), i;
}
function Yr(i, t) {
  return i.strokeWidth = t || 2, i.connector.attr("stroke-width", i.strokeWidth), Me(i, i.markerSourceType, i.markerTargetType), i;
}
function Wn(i, t) {
  i.color = t, i.connector.stroke(t).attr("stroke-width", i.strokeWidth), i.markerSource && i.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), i.markerTarget && i.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
function Xr(i, t) {
  try {
    const [e, n] = Pe(i, t[0], t[1]), s = i.bbox();
    if (!s || !s.width || !s.height) return null;
    let o = Math.max(0, Math.min(1, (e - s.x) / s.width)), r = Math.max(0, Math.min(1, (n - s.y) / s.height));
    const a = o, l = 1 - o, c = r, h = 1 - r, d = Math.min(a, l, c, h);
    return d === a ? o = 0 : d === l ? o = 1 : d === c ? r = 0 : r = 1, { x: o, y: r };
  } catch {
    return null;
  }
}
function $r(i, t) {
  return i && typeof i[t] == "function";
}
function jn(i, t, e) {
  if (!i.showHandles) return null;
  const n = i.container.circle(i.handleRadius * 2).attr({
    cx: e[0],
    cy: e[1],
    fill: i.handleFill,
    stroke: i.handleStroke,
    "stroke-width": i.handleStrokeWidth,
    "pointer-events": "all"
  }).addClass("connector-handle").addClass(t ? "connector-handle-source" : "connector-handle-target");
  try {
    n.node.style.cursor = "grab";
  } catch {
    n.node.setAttribute("style", "cursor: grab");
  }
  const s = {
    element: n,
    isSource: t,
    position: e,
    isDetached: !1,
    originalTarget: t ? i.source : i.target
  };
  return Wr(i, s), s;
}
function Wr(i, t) {
  let e = null;
  if (!$r(t.element, "draggable")) {
    console.warn(
      "svg.draggable.js plugin not available for connector handles. Install @svgdotjs/svg.draggable.js for proper drag functionality."
    );
    return;
  }
  t.element.draggable(), t.element.on("beforedrag", function(n) {
    t.element.cx(), t.element.cy();
    try {
      t.element.node.style.cursor = "grabbing";
    } catch {
      t.element.node.setAttribute("style", "cursor: grabbing");
    }
    t.element.front(), jr(i, t);
  }).on("dragmove", function(n) {
    const s = [t.element.cx(), t.element.cy()];
    t.position = s;
    const o = n.detail.event;
    e = Qr(i, o, t), Jr(e), Vr(i, t, s, e);
  }).on("dragend", function(n) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (i.debugMode && Pi(i.container), e)
      Vn(i, t, e), Ii();
    else {
      const s = [t.element.cx(), t.element.cy()], o = ta(i, s);
      t.isSource ? i._sourcePhantomRect = o : i._targetPhantomRect = o, Vn(i, t, o);
    }
    e = null;
  });
}
function jr(i, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? i.source : i.target), t.originalType || (t.originalType = i.type);
  const e = t.isSource ? i.source : i.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? i._sourcePhantomRect = null : i._targetPhantomRect = null), t.isSource ? i.source = null : i.target = null;
}
function Vr(i, t, e, n) {
  const s = t.originalType || i.type;
  let o = null, r = null;
  n && typeof n.bbox == "function" && !n._isPhantomRect && !(n.hasClass && n.hasClass("connector-handle")) && (r = Xr(n, e), r && (o = n));
  const a = {
    bbox: function() {
      return {
        x: e[0] - 5,
        y: e[1] - 5,
        width: 10,
        height: 10,
        cx: e[0],
        cy: e[1]
      };
    },
    node: {
      getCTM: function() {
        return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
      }
    }
  }, l = i.source, c = i.target, h = i.type, d = i.sourceAnchor, u = i.targetAnchor;
  try {
    i.type = s, t.isSource ? (o ? (i.source = o, i.sourceAnchor = r) : (i.source = a, i.sourceAnchor = null), i.target || (i.target = {
      bbox: function() {
        return {
          x: e[0] + 45,
          y: e[1] - 5,
          width: 10,
          height: 10,
          cx: e[0] + 50,
          cy: e[1]
        };
      },
      node: {
        getCTM: function() {
          return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        }
      }
    })) : (o ? (i.target = o, i.targetAnchor = r) : (i.target = a, i.targetAnchor = null), i.source || (i.source = {
      bbox: function() {
        return {
          x: e[0] - 55,
          y: e[1] - 5,
          width: 10,
          height: 10,
          cx: e[0] - 50,
          cy: e[1]
        };
      },
      node: {
        getCTM: function() {
          return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        }
      }
    }));
    const f = Sn(i);
    i.connector.plot(f), i.hitArea.plot(f);
  } finally {
    i.source = l, i.target = c, i.type = h, i.sourceAnchor = d, i.targetAnchor = u;
  }
}
function qr(i, t, e = !1) {
  try {
    const n = i.node.getCTM(), s = i.bbox();
    e && console.log("Hit test debug:", {
      element: i.type,
      point: t,
      bbox: s,
      ctm: n
    });
    const o = n.a * n.d - n.b * n.c;
    if (Math.abs(o) < 1e-10)
      return e && console.log("Using fallback bbox test due to singular matrix"), t[0] >= s.x && t[0] <= s.x + s.width && t[1] >= s.y && t[1] <= s.y + s.height;
    const r = n.d / o, a = -n.b / o, l = -n.c / o, c = n.a / o, h = (n.c * n.f - n.d * n.e) / o, d = (n.b * n.e - n.a * n.f) / o, u = r * t[0] + l * t[1] + h, f = a * t[0] + c * t[1] + d;
    e && console.log("Local coordinates:", { localX: u, localY: f });
    let g = !1;
    if (i.type === "circle") {
      const p = parseFloat(i.attr("cx")) || s.cx, y = parseFloat(i.attr("cy")) || s.cy, m = parseFloat(i.attr("r")) || 0, b = u - p, w = f - y;
      g = b * b + w * w <= m * m, e && console.log("Circle test:", {
        cx: p,
        cy: y,
        r: m,
        dx: b,
        dy: w,
        distance: Math.sqrt(b * b + w * w),
        result: g
      });
    } else if (i.type === "ellipse") {
      const p = parseFloat(i.attr("cx")) || s.cx, y = parseFloat(i.attr("cy")) || s.cy, m = parseFloat(i.attr("rx")) || 0, b = parseFloat(i.attr("ry")) || 0, w = u - p, x = f - y;
      g = w * w / (m * m) + x * x / (b * b) <= 1, e && console.log("Ellipse test:", { cx: p, cy: y, rx: m, ry: b, dx: w, dy: x, result: g });
    } else
      g = u >= s.x && u <= s.x + s.width && f >= s.y && f <= s.y + s.height, e && console.log("Rect test:", {
        localX: u,
        localY: f,
        bboxX: s.x,
        bboxY: s.y,
        bboxWidth: s.width,
        bboxHeight: s.height,
        result: g
      });
    return g;
  } catch (n) {
    e && console.log("Exception in hit test, using fallback:", n);
    const s = i.bbox();
    return t[0] >= s.x && t[0] <= s.x + s.width && t[1] >= s.y && t[1] <= s.y + s.height;
  }
}
function Kr(i, t) {
  try {
    const e = i.bbox(), n = i.node.getCTM(), s = t.group().addClass("debug-hit-zone"), o = s.rect(e.width, e.height).attr({
      x: e.x,
      y: e.y,
      fill: "none",
      stroke: "#ffcccc",
      "stroke-width": 1,
      "stroke-dasharray": "2,2"
    });
    if (n) {
      const h = [
        [e.x, e.y],
        [e.x + e.width, e.y],
        [e.x + e.width, e.y + e.height],
        [e.x, e.y + e.height]
      ].map((d) => [
        n.a * d[0] + n.c * d[1] + n.e,
        n.b * d[0] + n.d * d[1] + n.f
      ]).map(
        (d, u) => (u === 0 ? "M" : "L") + d[0] + "," + d[1]
      ).join(" ") + " Z";
      s.path(h).attr({
        fill: "rgba(255, 0, 0, 0.1)",
        stroke: "#ff0000",
        "stroke-width": 2,
        "stroke-dasharray": "5,3"
      });
    }
    let r, a;
    try {
      r = n.a * e.cx + n.c * e.cy + n.e, a = n.b * e.cx + n.d * e.cy + n.f;
    } catch {
      r = e.cx, a = e.cy;
    }
    return s.circle(4).attr({
      cx: r,
      cy: a,
      fill: "#ff0000"
    }), s;
  } catch (e) {
    return console.warn("Error creating hit zone visualization:", e), null;
  }
}
function Pi(i) {
  try {
    i.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function Qr(i, t, e) {
  const n = i.debugMode || !1;
  n && Pi(i.container);
  function s(u) {
    const f = [];
    function g(p) {
      o(p) && f.push(p), p.children && typeof p.children == "function" && p.children().forEach(g);
    }
    return g(u), f;
  }
  function o(u) {
    if (!["circle", "rect", "ellipse", "polygon", "path"].includes(u.type) || u.attr("connectortype") || u.hasClass && u.hasClass("connector-handle") || u._isPhantomRect || u.hasClass && u.hasClass("debug-hit-zone"))
      return !1;
    if (u.hasClass) {
      const x = u.node.classList;
      if (x && (x.contains("svg_select_boundingRect") || x.contains("svg_select_points") || x.contains("svg_select_selector") || x.contains("svg_resize_rotationPoint") || x.contains("svg_resize_handle") || x.contains("svg_resize_point") || x.contains("svg_draggable_handle") || x.contains("plugin-ui") || x.contains("ui-element")))
        return !1;
    }
    const g = u.bbox();
    if (g.width < 10 || g.height < 10)
      return !1;
    try {
      const _ = window.getComputedStyle(u.node).cursor;
      if (_ === "nw-resize" || _ === "ne-resize" || _ === "sw-resize" || _ === "se-resize" || _ === "ew-resize" || _ === "ns-resize" || _ === "crosshair")
        return !1;
    } catch {
    }
    const p = u.node.dataset;
    if (p && (p.svgjs || p.plugin || p.handle || p.ui))
      return !1;
    let y = u.parent();
    for (; y && y.type !== "svg"; ) {
      if (y.hasClass) {
        const _ = y.node.classList;
        if (_ && (_.contains("svg_select_group") || _.contains("svg_resize_group") || _.contains("plugin-ui-group")))
          return !1;
      }
      const x = y.attr("id");
      if (x && (x.includes("_select_") || x.includes("_resize_") || x.includes("plugin")))
        return !1;
      y = y.parent();
    }
    const m = u.attr("id");
    if (m && (m.includes("_select_") || m.includes("_resize_") || m.includes("_handle_") || m.includes("_rotation_") || m.includes("plugin") || m.startsWith("svg_")))
      return !1;
    const b = u.attr("fill"), w = u.attr("stroke");
    return !(!b && !w || (b === "transparent" || b === "none") && (!w || w === "none" || w === "transparent"));
  }
  const r = i.container.root(), a = r.node.getBoundingClientRect(), l = t.clientX - a.left, c = t.clientY - a.top;
  n && console.log("Drop target search at:", { svgX: l, svgY: c });
  const h = s(r);
  n && (console.log("Found target shapes:", h.length), h.forEach((u, f) => {
    console.log(`Target shape ${f}:`, {
      type: u.type,
      id: u.attr("id"),
      classes: u.node.classList ? Array.from(u.node.classList) : [],
      fill: u.attr("fill"),
      stroke: u.attr("stroke"),
      bbox: u.bbox(),
      isValid: Ye(i, u, e)
    });
  }), h.forEach((u) => {
    Ye(i, u, e) && Kr(u, i.container);
  }));
  const d = [];
  return h.forEach(function(u) {
    if (Ye(i, u, e))
      try {
        if (qr(u, [l, c], n)) {
          let g, p;
          try {
            const m = u.bbox(), b = u.node.getCTM();
            g = b.a * m.cx + b.c * m.cy + b.e, p = b.b * m.cx + b.d * m.cy + b.f;
          } catch {
            const b = u.bbox();
            g = b.cx, p = b.cy;
          }
          const y = Math.sqrt(
            Math.pow(l - g, 2) + Math.pow(c - p, 2)
          );
          n && console.log("Found candidate:", {
            element: u.type,
            distance: y
          }), d.push({ element: u, distance: y });
        }
      } catch (f) {
        console.warn("Error checking element for drop target:", f);
      }
  }), d.length > 0 ? (d.sort(function(u, f) {
    return u.distance - f.distance;
  }), n && console.log("Selected closest candidate:", d[0]), d[0].element) : (n && console.log("No drop target found"), null);
}
function Ye(i, t, e) {
  const n = e.isSource ? i.source : i.target;
  if (t === n || t.attr("connectortype") || t.hasClass && t.hasClass("connector-handle") || t._isPhantomRect) return !1;
  const s = e.isSource ? i.target : i.source;
  return t !== s;
}
function Vn(i, t, e) {
  let n = null;
  try {
    n = { x: t.element.cx(), y: t.element.cy() };
  } catch {
  }
  const s = t.isSource ? i.source : i.target;
  if (s && s._isPhantomRect && (s.remove(), t.isSource ? i._sourcePhantomRect = null : i._targetPhantomRect = null), t.isSource ? i.source = e : i.target = e, t.isDetached = !1, !s || s !== e) {
    let o;
    t.isSource ? o = function(l) {
      i.update();
    } : o = function(l) {
      i.update();
    };
    const r = t.isSource ? "_sourceUpdateFunction" : "_targetUpdateFunction", a = i[r];
    if (a && s && (s.off("dragmove", a), s.off("beforedrag", a), s.off("dragstart", a), s.off("dragend", a), s.off("resize", a), s.off("rotate", a), s.off("transform", a)), t.isSource) {
      if (s && s.cons) {
        const l = s.cons.indexOf(i);
        l > -1 && s.cons.splice(l, 1);
      }
      e.cons = e.cons || [], e.cons.indexOf(i) === -1 && e.cons.push(i);
    } else {
      if (s && s.targetCons) {
        const l = s.targetCons.indexOf(i);
        l > -1 && s.targetCons.splice(l, 1);
      }
      e.targetCons = e.targetCons || [], e.targetCons.indexOf(i) === -1 && e.targetCons.push(i);
    }
    i[r] = o, e.on("dragmove", o), e.on("beforedrag", o), e.on("dragstart", o), e.on("dragend", o), e.on("resize", o), e.on("rotate", o), e.on("transform", o);
  }
  if (i.update(), i.source && i.target) {
    const o = Sn(i);
    if (o && o.length >= 2) {
      let r;
      if (t.isSource)
        r = [o[0][1], o[0][2]];
      else {
        const a = o[o.length - 1];
        r = [
          a[a.length - 2],
          a[a.length - 1]
        ];
      }
      t.position = r, t.element.center(r[0], r[1]);
    }
  }
  if (typeof i.onEndpointChange == "function") {
    const o = !!e._isPhantomRect;
    let r = null;
    if (!o)
      try {
        let l = e.node || null;
        for (; l && l.getAttribute && !l.getAttribute("data-node-id"); )
          l = l.parentNode;
        r = l && l.getAttribute && l.getAttribute("data-node-id") || null;
      } catch {
      }
    let a = n;
    if (!a)
      try {
        a = { x: e.cx(), y: e.cy() };
      } catch {
      }
    i.onEndpointChange({
      which: t.isSource ? "source" : "target",
      targetNodeId: r,
      isPhantom: o,
      point: a
    });
  }
}
let Q = null;
function Jr(i) {
  if (i !== Q)
    if (Ii(), i) {
      Q = i, i._originalStroke = i.attr("stroke"), i._originalStrokeWidth = i.attr("stroke-width"), i._originalStrokeDasharray = i.attr("stroke-dasharray"), i._originalStrokeOpacity = i.attr("stroke-opacity"), i.attr({
        stroke: "#007cff",
        // Professional blue
        "stroke-width": 3,
        // Clean consistent width
        "stroke-dasharray": "8,4",
        // Longer dashes for cleaner look
        "stroke-opacity": 0.8
        // Slightly transparent
      });
      try {
        const t = i.node.style;
        if (t.strokeDashoffset = "0", t.animation = "connector-dash-flow 1.5s linear infinite", !document.getElementById("connector-highlight-styles")) {
          const e = document.createElement("style");
          e.id = "connector-highlight-styles", e.textContent = `
          @keyframes connector-dash-flow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 24; }
          }
        `, document.head.appendChild(e);
        }
      } catch (t) {
        console.warn("Could not apply highlight animation:", t);
      }
    } else
      Q = null;
}
function Ii() {
  if (Q && Q._originalStroke !== void 0) {
    Q.attr({
      stroke: Q._originalStroke,
      "stroke-width": Q._originalStrokeWidth,
      "stroke-dasharray": Q._originalStrokeDasharray,
      "stroke-opacity": Q._originalStrokeOpacity
    });
    try {
      const i = Q.node.style;
      i.animation = "", i.strokeDashoffset = "";
    } catch {
    }
    delete Q._originalStroke, delete Q._originalStrokeWidth, delete Q._originalStrokeDasharray, delete Q._originalStrokeOpacity;
  }
  Q = null;
}
function qn(i, t) {
  if (!i.showHandles || !t || t.length < 2) {
    i.sourceHandle && (i.sourceHandle.element.remove(), i.sourceHandle = null), i.targetHandle && (i.targetHandle.element.remove(), i.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], n = t[t.length - 1], s = [n[n.length - 2], n[n.length - 1]];
  i.sourceHandle ? (i.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), i.sourceHandle.position = e) : i.sourceHandle = jn(i, !0, e), i.targetHandle ? (i.targetHandle.element.attr({
    cx: s[0],
    cy: s[1]
  }), i.targetHandle.position = s) : i.targetHandle = jn(i, !1, s);
}
function ta(i, t) {
  const e = i.container.rect(20, 20).attr({
    x: t[0] - 10,
    y: t[1] - 10,
    fill: "transparent",
    stroke: "none",
    "pointer-events": "none"
  }).addClass("connector-phantom-rect");
  return e._isPhantomRect = !0, e;
}
function gt(i, t) {
  return i && typeof i[t] == "function";
}
function Oi(i, t) {
  t.current && t.current !== i && Mn(t.current), t.current = i, i.isSelected = !0, i.showHandles = !0, i.update();
}
function Mn(i) {
  i.isSelected = !1, i.showHandles = !1, i.update();
}
function ea(i, t) {
  i.isSelected ? (Mn(i), t.current === i && (t.current = null)) : Oi(i, t);
}
function na(i, t) {
  let e = null;
  const n = 5;
  function s(r) {
    e = { x: r.clientX, y: r.clientY };
  }
  function o(r) {
    if (!e) return;
    const a = r.clientX - e.x, l = r.clientY - e.y;
    Math.sqrt(a * a + l * l) < n && typeof i.onLineClick == "function" && i.onLineClick(r), e = null;
  }
  i.hitArea.on("mousedown", s), i.hitArea.on("mouseup", o), i.connector.on("mousedown", s), i.connector.on("mouseup", o);
}
function ia(i, t, e) {
  i[t + "Attach"] = e, i.update();
}
function sa(i, t) {
  return i.showHandles = t, i.update(), i;
}
function oa(i) {
  return {
    sourceHandle: i.sourceHandle,
    targetHandle: i.targetHandle
  };
}
function ra(i, t) {
  return i.clickAreaWidth = Math.max(6, t || 12), i.hitArea.attr("stroke-width", i.clickAreaWidth), i;
}
function aa(i, t) {
  t && (i.connector.remove(), t == "default" ? (i.connector = i.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), i.connector.stroke(i.color).attr("stroke-width", i.strokeWidth)) : i.connector = t, i.update());
}
function la(i, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && i.type != t && (i.type = t, i.update());
}
function zi(i, t) {
  return i.debugMode = t, i.hitArea.attr({
    stroke: i.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": i.debugMode ? 0.5 : 0.01
  }), i;
}
function ca(i) {
  return zi(i, !i.debugMode);
}
function Li(i, t) {
  return t = t || {}, gt(i.source, "select") ? i.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), gt(i.target, "select") ? i.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), i;
}
function Bi(i, t) {
  return gt(i.source, "draggable") ? i.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), gt(i.target, "draggable") ? i.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), i;
}
function Gi(i, t) {
  return t = t || {}, gt(i.source, "resize") ? i.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), gt(i.target, "resize") ? i.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), i;
}
function ha(i, t, e, n, s) {
  return t = t || {}, n = n || {}, gt(i.source, "draggable") && gt(i.target, "draggable"), gt(i.source, "select") && gt(i.target, "select"), gt(i.source, "resize") && gt(i.target, "resize"), Bi(i), Li(i, t), Gi(i, n), i;
}
/*!
 * SVG.js Connectable Plugin v2.2.0
 * =================================
 *
 * A JavaScript library for connecting SVG things - compatible with SVG.js 3.x
 *
 * svg.connectable.js 2.2.0
 * Licensed under the MIT license.
 * Copyright (c) 2014-15 jillix
 * Copyright (c) 2015-17 Loredana Cirstea
 * Copyright (c) 2015 Christian Tzurcanu - Algorithm for creating connector curves, connector paths.
 * Copyright (c) 2025 - Updated for SVG.js 3.x compatibility with optional interactive features
 *
 * */
let ee = null, Xe = null;
const be = { current: null };
function da(i, t) {
  const e = {};
  t === void 0 && (t = i, i = {}), ee = i.container || this.parent() || ee;
  const n = this;
  if (Xe = i.markers || this.parent() || Xe, e.container = ee, e.source = n, e.target = t, e.type = i.type || "straight", e.strokeWidth = i.strokeWidth || 2, e.color = i.color || "#000000", e.clickAreaWidth = i.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = i.debugMode || !1, i.connector) {
    const a = De.find(
      "#" + i.connector.node.getAttribute("href").slice(1)
    )[0];
    if (a && a.type == "path") {
      e.connector = i.connector;
      const l = a.array();
      if (!(l[1] && l[1][0] == "M") || !(l[2] && l[2][0] == "M")) {
        const c = a.bbox();
        l.splice(
          0,
          0,
          ["M", c.x + c.width / 2, c.y],
          ["M", c.x + c.width / 2, c.y + c.height]
        ), a.plot(l);
      }
      e.connector.target = a;
    }
  }
  e.connector || (e.connector = ee.path().attr("connectortype", "default").fill("none").stroke(e.color).attr("stroke-width", e.strokeWidth)), e.hitArea = ee.path().attr({
    connectortype: "hitarea",
    fill: "none",
    stroke: e.debugMode ? "#ff0000" : "#000000",
    "stroke-width": e.clickAreaWidth,
    "stroke-opacity": e.debugMode ? 0.5 : 0.01,
    // Visible in debug mode, nearly invisible otherwise
    "pointer-events": "stroke"
  });
  try {
    e.connector.node.style.cursor = "pointer", e.hitArea.node.style.cursor = "pointer";
  } catch {
    e.connector.node.setAttribute("style", "cursor: pointer"), e.hitArea.node.setAttribute("style", "cursor: pointer");
  }
  e.hitArea.back(), e.sourceAttach = i.sourceAttach || "perifery", e.targetAttach = i.targetAttach || "perifery", e.sourceAnchor = i.sourceAnchor || null, e.targetAnchor = i.targetAnchor || null, e.curveRadius = i.curveRadius || 20, e.lineCurviness = typeof i.lineCurviness == "number" ? i.lineCurviness : 0.3, e.markerSourceType = i.markerSource || "null", e.markerTargetType = i.markerTarget || i.marker || "default", e.showHandles = i.showHandles || !1, e.handleRadius = i.handleRadius || 6, e.handleStrokeWidth = i.handleStrokeWidth || 2, e.handleStroke = i.handleStroke || "#007cff", e.handleFill = i.handleFill || "none", e.isSelected = !1, e.computeConnectorCoordinates = function(a) {
    return Sn(a || e);
  }, n.cons = n.cons || [], n.cons.push(e), t.targetCons = t.targetCons || [], t.targetCons.push(e), e.update = function() {
    if (e.connector.attr("connectortype") == "default") {
      const a = e.computeConnectorCoordinates(e);
      let l = !0;
      for (let c = 0; c < a.length; c++)
        for (let h = 1; h < a[c].length; h++)
          (isNaN(a[c][h]) || !isFinite(a[c][h])) && (console.error(
            "Invalid coordinate in path data:",
            a[c][h],
            "at",
            [c, h]
          ), l = !1);
      l ? (e.connector.plot(a), e.hitArea.plot(a), qn(e, a)) : console.error("Skipping plot due to invalid path data");
    }
  }, Me(e, e.markerSourceType, e.markerTargetType, Xe), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(a, l, c) {
    return Me(e, a, l, c);
  }, e.setMarkerSettings = function(a, l) {
    return Zr(e, a, l);
  }, e.setStrokeWidth = function(a) {
    return Yr(e, a);
  }, e.setConnectorColor = function(a) {
    return Wn(e, a), e;
  }, e.remove = function() {
    const a = (l) => {
      try {
        l && l.remove && l.remove();
      } catch {
      }
    };
    return a(e.connector), a(e.hitArea), a(e.sourceHandle && e.sourceHandle.element), a(e.targetHandle && e.targetHandle.element), a(e.markerSource), a(e.markerTarget), a(e._sourcePhantomRect), a(e._targetPhantomRect), e;
  }, e.getCurrentAnchor = function(a) {
    const l = a === "source" ? e.source : e.target, c = a === "source" ? e.target : e.source;
    if (!l || !l.bbox || !c) return { x: 0.5, y: 0.5 };
    try {
      const h = ae(c), d = rn(l, h), u = Pe(l, d[0], d[1]), f = l.bbox();
      return !f.width || !f.height ? { x: 0.5, y: 0.5 } : {
        x: (u[0] - f.x) / f.width,
        y: (u[1] - f.y) / f.height
      };
    } catch {
      return { x: 0.5, y: 0.5 };
    }
  }, e.setAttachmentAnchor = function(a, l) {
    return a === "source" ? e.sourceAnchor = l || null : a === "target" && (e.targetAnchor = l || null), e.update(), e;
  }, e.updateHandles = function(a) {
    qn(e, a);
  }, e.selectConnector = function() {
    Oi(e, be);
  }, e.deselectConnector = function() {
    Mn(e), be.current === e && (be.current = null);
  }, e.toggleSelection = function() {
    ea(e, be);
  }, e.setConnectorAttachment = function(a, l) {
    ia(e, a, l);
  }, e.setHandleVisibility = function(a) {
    return sa(e, a);
  }, e.getHandles = function() {
    return oa(e);
  }, e.setClickAreaWidth = function(a) {
    return ra(e, a);
  }, e.setConnector = function(a) {
    aa(e, a);
  }, e.setType = function(a) {
    la(e, a);
  }, e.setDebugMode = function(a) {
    return zi(e, a);
  }, e.toggleDebugMode = function() {
    return ca(e);
  }, e.makeSelectable = function(a) {
    return Li(e, a);
  }, e.makeDraggable = function(a) {
    return Bi(e);
  }, e.makeResizable = function(a) {
    return Gi(e, a);
  }, e.makeInteractive = function(a, l, c) {
    return ha(e, a, l, c);
  }, na(e), e.update();
  function s(a) {
    e.update();
  }
  function o(a) {
    e.update();
  }
  function r(a) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = r, n.on("dragmove", o), t.on("dragmove", r), n.on("beforedrag", o), n.on("dragstart", o), n.on("dragend", o), t.on("beforedrag", r), t.on("dragstart", r), t.on("dragend", r), n.on("resize", o), t.on("resize", r), n.on("rotate", o), t.on("rotate", r), n.on("transform", o), t.on("transform", r), e.updateConnector = s, Wn(e, e.color), e;
}
k(ot, {
  connectable: da,
  /**
   * makeConnectableAndInteractive
   * Creates a connection to target and makes both elements interactive
   *
   * @param {Object} connectOptions Options for the connectable plugin
   * @param {SVGElement} target The target element to connect to
   * @param {Object} selectOptions Options for the select plugin
   * @param {Object} dragOptions Options for the draggable plugin
   * @return {Connectable} The connectable instance.
   */
  makeConnectableAndInteractive: function(i, t, e, n) {
    const s = this.connectable(i, t);
    return s.makeInteractive(e, n), s;
  }
});
function ua(i, t, e) {
  const n = i, s = [n[0] - t[0], n[1] - t[1]], o = [n[0] - e[0], n[1] - e[1]], r = Math.sqrt(s[0] * s[0] + s[1] * s[1]) || 1, a = Math.sqrt(o[0] * o[0] + o[1] * o[1]) || 1, l = [s[0] / r, s[1] / r], c = [o[0] / a, o[1] / a], h = [n[0] - 10 * l[0], n[1] - 10 * l[1]], d = [n[0] - 10 * c[0], n[1] - 10 * c[1]], u = [h, n, d];
  return u.every(
    (g) => Number.isFinite(g[0]) && Number.isFinite(g[1])
  ) ? u : null;
}
class Hi {
  /**
   * Creates resize/rotate handle management for a node.
   *
   * @param node    - The parent Node instance
   * @param options - Resize/rotate configuration
   */
  constructor(t, e = {}) {
    this.isActive = !1, this._interacting = !1, this._didRotate = !1, this._didResize = !1, this._endListener = null, this._preInteractionPos = null, this.node = t, this.target = t.backgroundRect, this.options = {
      resizeEnabled: !0,
      rotateEnabled: !0,
      preserveAspectRatio: !1,
      aroundCenter: !1,
      grid: 0,
      degree: 0,
      ...e
    };
  }
  /** Enable resize and rotate handles on the node. */
  enable() {
    if (!this.isActive) {
      if (!this.target) {
        console.warn("RESIZE_ROTATE_DEBUG: Cannot enable — target (backgroundRect) not available on", this.node?.id);
        return;
      }
      try {
        const t = this.target;
        typeof t.select == "function" && t.select({
          rotationPoint: this.options.rotateEnabled,
          // svg.select.js' default updateHandle divides by the distance between
          // adjacent handle points; when a transient/degenerate bbox makes points
          // coincide (or the screenCTM collapses), that divide-by-zero plots
          // "NaN" polyline points and floods the console (notably on multi-select
          // via the keyboard). This replicates the default L-bracket exactly but
          // guards the division and never plots non-finite points.
          updateHandle: (e, n, s, o) => {
            const r = o[(s - 1 + o.length) % o.length], a = o[(s + 1) % o.length], l = ua(n, r, a);
            l && e.plot(l);
          }
        }), this.options.resizeEnabled && typeof t.resize == "function" && t.resize({
          preserveAspectRatio: this.options.preserveAspectRatio,
          aroundCenter: this.options.aroundCenter,
          grid: this.options.grid ?? 1,
          degree: this.options.degree ?? 0.1
        }), this.styleSelectionUi(), this.addEventListeners(), this.isActive = !0;
      } catch (t) {
        console.warn("Failed to enable resize/rotate:", t);
      }
    }
  }
  /**
   * Keep svg.select.js' generated control layer non-obscuring and make the
   * L-shaped polyline handles easier to grab. These inline attributes are
   * intentional because consumers can use the built JS without loading CSS.
   */
  styleSelectionUi() {
    requestAnimationFrame(() => {
      try {
        const t = this.target.node, e = t.ownerSVGElement || t;
        e.querySelectorAll(
          ".svg_select_shape, .svg_select_shape_pointSelect"
        ).forEach((o) => {
          o.setAttribute("fill", "none"), o.setAttribute("fill-opacity", "0"), o.setAttribute("pointer-events", "none"), o.style.fill = "none", o.style.fillOpacity = "0", o.style.pointerEvents = "none";
        }), e.querySelectorAll(".svg_select_handle").forEach((o) => {
          o.setAttribute("stroke-width", "6"), o.setAttribute("stroke", "#4A90E2"), o.style.pointerEvents = "all";
        });
      } catch (t) {
        console.warn("RESIZE_ROTATE_DEBUG: Failed to widen handle hit areas:", t);
      }
    });
  }
  /** Disable resize and rotate handles on the node. */
  disable() {
    if (this.isActive)
      try {
        const t = this.target;
        typeof t.select == "function" && t.select(!1), typeof t.resize == "function" && t.resize(!1), this.removeEventListeners(), this.isActive = !1;
      } catch (t) {
        console.warn("Failed to disable resize/rotate:", t);
      }
  }
  addEventListeners() {
    this.target.on("mousedown.resizerotate touchstart.resizerotate", (t) => {
      this.isResizeRotateHandle(t.target) && (this.node.isConnectionHandlesEnabled() && this.node.disableConnectionHandles(), this._interacting = !0, this._didRotate = !1, this._didResize = !1);
    }), this._endListener = () => {
      if (!this._interacting) return;
      this._interacting = !1, (this._didRotate || this._didResize) && this.node.finalizeInteraction && this.node.finalizeInteraction(), this._preInteractionPos = null;
      const t = this.node.slate;
      this._didRotate ? t?.broadcast?.("onNodeRotated", {
        id: this.node.id,
        rotate: this.node.options.rotate,
        width: this.node.options.width,
        height: this.node.options.height
      }) : this._didResize && t?.broadcast?.("onNodeResized", {
        id: this.node.id,
        width: this.node.options.width,
        height: this.node.options.height,
        rotate: this.node.options.rotate,
        vectorPath: this.node.options.vectorPath
      }), this._didRotate = !1, this._didResize = !1;
    }, window.addEventListener("pointerup", this._endListener), window.addEventListener("touchend", this._endListener), this.target.on("resize", (t) => {
      this._preInteractionPos === null && (this._preInteractionPos = {
        x: this.node.options.x ?? 0,
        y: this.node.options.y ?? 0
      }), this._interacting = !0, t.detail?.box && (this._didResize = !0), typeof t.detail?.angle == "number" && t.detail.angle !== 0 && (this._didRotate = !0), this.handleResize(t), this.options.onResize?.(t), this.node.slate && this.node.slate.getSelectedNodes().includes(this.node) && setTimeout(() => {
        this.node.enableConnectionHandles();
      }, 50), this.node.slate?.notifyNodeChanged(this.node);
    });
  }
  isResizeRotateHandle(t) {
    if (!t || !t.classList) return !1;
    const e = [
      "svg_select_handle",
      "svg_select_handle_rot",
      "svg_select_handle_lt",
      "svg_select_handle_rt",
      "svg_select_handle_rb",
      "svg_select_handle_lb",
      "svg_select_handle_t",
      "svg_select_handle_r",
      "svg_select_handle_b",
      "svg_select_handle_l"
    ];
    for (const n of e)
      if (t.classList.contains(n))
        return !0;
    return !1;
  }
  removeEventListeners() {
    this.target.off("resize"), this.target.off("mousedown.resizerotate touchstart.resizerotate"), this._endListener && (window.removeEventListener("pointerup", this._endListener), window.removeEventListener("touchend", this._endListener), this._endListener = null);
  }
  handleResize(t) {
    if (t.detail && t.detail.box) {
      const e = t.detail.box;
      this.node.options.width = e.width, this.node.options.height = e.height;
      const n = this._preInteractionPos ?? {
        x: this.node.options.x ?? 0,
        y: this.node.options.y ?? 0
      };
      this.node.options.x = n.x + e.x, this.node.options.y = n.y + e.y, this.node.setSize(e.width, e.height), this.node.centerText();
      try {
        this.node.svgGroup?.fire?.("transform");
      } catch {
      }
      if (t.detail && typeof t.detail.angle == "number") {
        const s = t.detail.angle;
        let o = 0;
        try {
          o = this.target.transform()?.rotate || 0;
        } catch (l) {
          console.warn("RESIZE_ROTATE_DEBUG: Failed to read backgroundRect rotation:", l);
        }
        let r = 0;
        try {
          r = this.node.svgGroup.transform()?.rotate || 0;
        } catch (l) {
          console.warn("RESIZE_ROTATE_DEBUG: Failed to read svgGroup rotation:", l);
        }
        const a = r + o;
        if (this.node.options.rotate || (this.node.options.rotate = { rotationAngle: 0 }), this.node.options.rotate.rotationAngle = a, this.node.textElement && typeof this.node.textElement.rotate == "function") {
          const l = this.target.bbox();
          this.node.textElement.rotate(s, l.cx, l.cy);
        } else if (this.node.nestedSvg && typeof this.node.nestedSvg.rotate == "function") {
          const l = this.target.bbox();
          this.node.nestedSvg.rotate(s, l.cx, l.cy);
        }
      }
    }
  }
  isEnabled() {
    return this.isActive;
  }
  /** Destroy the resize/rotate instance, disabling all plugins and clearing references */
  destroy() {
    this.disable(), this.node = null, this.target = null;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, this.isActive && (this.disable(), this.enable());
  }
  refresh() {
    this.isActive && (this.disable(), this.enable());
  }
}
typeof window < "u" && (window.SVG = De);
class Ie {
  /**
   * Creates a connector for a node. Manages connection lines to other nodes.
   *
   * @param node    - The parent Node instance
   * @param options - Connector configuration (line color, width, type, etc.)
   */
  constructor(t, e = {}) {
    this.connections = /* @__PURE__ */ new Map(), this.isActive = !1, this.node = t, this.slate = t.slate, this.options = {
      enabled: !1,
      padEllipse: !0,
      defaultLineColor: "#666666",
      defaultLineWidth: 2,
      // svg.connectable.js defaults as specified by user
      type: "curved",
      color: "#007cff",
      strokeWidth: 3,
      sourceAttach: "perifery",
      targetAttach: "perifery",
      markerSource: "null",
      markerTarget: "default",
      showHandles: !0,
      curveRadius: 30,
      ...e
    }, console.log("CONNECTOR_DEBUG: Created connector for node", this.node.id);
  }
  /** Enable the connector, making connection handles available. */
  enable() {
    if (!this.isActive)
      try {
        console.log("CONNECTOR_DEBUG: Enabling connector for node", this.node.id), this.node.svgGroup.connectable || (console.warn(
          "CONNECTOR_DEBUG: svg.connectable.js not available - may need SVG.js 3+ compatibility update"
        ), console.warn(
          "CONNECTOR_DEBUG: Connector functionality will be limited until svg.connectable.js is updated"
        )), this.ensureContainers(), this.isActive = !0, console.log("CONNECTOR_DEBUG: Connector enabled for node", this.node.id);
      } catch (t) {
        console.warn("CONNECTOR_DEBUG: Failed to enable connector:", t);
      }
  }
  /** Disable the connector and remove all connections. */
  disable() {
    if (this.isActive)
      try {
        console.log(
          "CONNECTOR_DEBUG: Disabling connector for node",
          this.node.id
        ), this.disconnectAll(), this.isActive = !1, console.log("CONNECTOR_DEBUG: Connector disabled for node", this.node.id);
      } catch (t) {
        console.warn("CONNECTOR_DEBUG: Failed to disable connector:", t);
      }
  }
  destroy() {
    this.disable(), this.connections.clear();
  }
  ensureContainers() {
    this.options.lineContainer || (this.slate.linesContainer || (this.slate.linesContainer = this.slate.canvas.group(), console.log("CONNECTOR_DEBUG: Created global lines container")), this.options.lineContainer = this.slate.linesContainer), this.options.markerContainer || (this.slate.markersContainer || (this.slate.markersContainer = this.slate.canvas.group(), console.log("CONNECTOR_DEBUG: Created global markers container")), this.options.markerContainer = this.slate.markersContainer);
  }
  connectTo(t, e = {}) {
    if (!this.isActive)
      return console.warn(
        "CONNECTOR_DEBUG: Connector not enabled for node",
        this.node.id
      ), null;
    try {
      console.log(
        "CONNECTOR_DEBUG: Connecting",
        this.node.id,
        "to",
        t.id
      );
      const n = `${this.node.id}->${t.id}`;
      if (this.connections.has(n))
        return console.warn(
          "CONNECTOR_DEBUG: Connection already exists:",
          n
        ), this.connections.get(n);
      if (!this.node.svgGroup.connectable)
        return console.error(
          "CONNECTOR_DEBUG: svg.connectable.js not properly loaded or incompatible with SVG.js 3+"
        ), null;
      const s = e, o = {
        bezier: "curved",
        curved: "curved",
        orthogonal: "orthogonal",
        straight: "straight",
        linear: "straight"
      }, r = s.lineType ? o[s.lineType] || "curved" : this.options.type, a = s.showParentArrow != null ? s.showParentArrow ? this.options.markerSource || "arrow" : "null" : this.options.markerSource, l = s.showChildArrow != null ? s.showChildArrow ? this.options.markerTarget || "arrow" : "null" : this.options.markerTarget, c = this.node.svgGroup.connectable(
        {
          container: this.options.lineContainer,
          markers: this.options.markerContainer,
          type: r,
          color: s.lineColor || this.options.color,
          strokeWidth: s.lineWidth || this.options.strokeWidth,
          sourceAttach: this.options.sourceAttach,
          targetAttach: this.options.targetAttach,
          markerSource: a,
          markerTarget: l,
          showHandles: this.options.showHandles,
          curveRadius: this.options.curveRadius,
          lineCurviness: s.lineCurviness,
          // Edge-pin mode (optional): normalized local anchors {x,y} 0..1
          sourceAnchor: e.sourceAnchor,
          targetAnchor: e.targetAnchor
        },
        t.svgGroup
      );
      if (!c)
        return console.error("CONNECTOR_DEBUG: Failed to create connectable object"), null;
      const h = {
        id: n,
        source: this.node,
        target: t,
        connectable: c,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      h.lineColor && c.setLineColor && c.setLineColor(h.lineColor), this.connections.set(n, h);
      try {
        this.slate.markersContainer?.front?.();
      } catch {
      }
      if (c.onEndpointChange = (d) => this.handleEndpointChange(h, d), t.connector) {
        const d = `${t.id}<-${this.node.id}`;
        t.connector.connections.set(d, h);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", n), c.onLineClick = () => {
        this.node.slate?.isReadOnly?.() || this.showLineCog(h, c, t.id);
      }, this.wireHandleReveal(c), this.options.onConnect?.(h), h;
    } catch (n) {
      return console.error("CONNECTOR_DEBUG: Failed to create connection:", n), console.error(
        "CONNECTOR_DEBUG: This might be due to SVG.js 3+ compatibility issues with svg.connectable.js"
      ), null;
    }
  }
  /**
   * Connect this node to a bare WORLD point (free-floating endpoint, L1b).
   * Backed by an invisible 1px "phantom" rect at the point so the existing
   * svg.connectable geometry (edge-solve on the target's bbox) works unchanged.
   * The synthetic id keys the connection like a normal one.
   */
  connectToPoint(t, e, n = {}) {
    this.isActive || this.enable();
    const s = this.options.lineContainer || this.slate.canvas;
    if (!s) return null;
    const o = s.rect(1, 1).move(t.x - 0.5, t.y - 0.5).fill("none").opacity(0);
    o._isPhantomRect = !0;
    const r = { id: e, svgGroup: o, _isFloating: !0 }, a = this.connectTo(r, n);
    return a && (a._phantom = o), a;
  }
  disconnectFrom(t) {
    const e = `${this.node.id}->${t.id}`;
    return this.disconnectById(e);
  }
  disconnectById(t) {
    try {
      const e = this.connections.get(t);
      if (!e)
        return console.warn("CONNECTOR_DEBUG: Connection not found:", t), !1;
      console.log("CONNECTOR_DEBUG: Disconnecting", t);
      try {
        e.connectable?.remove ? e.connectable.remove() : (e.connectable?.connector?.remove?.(), e.connectable?.hitArea?.remove?.()), e._phantom?.remove?.();
      } catch {
      }
      if (this.connections.delete(t), e.target && e.target.connector) {
        const n = `${e.target.id}<-${this.node.id}`;
        e.target.connector.connections.delete(n);
      }
      return console.log("CONNECTOR_DEBUG: Successfully disconnected", t), this.options.onDisconnect?.(e), !0;
    } catch (e) {
      return console.error("CONNECTOR_DEBUG: Failed to disconnect:", e), !1;
    }
  }
  disconnectAll() {
    console.log(
      "CONNECTOR_DEBUG: Disconnecting all connections for node",
      this.node.id
    );
    const t = Array.from(this.connections.keys());
    for (const e of t)
      this.disconnectById(e);
  }
  getConnections() {
    return Array.from(this.connections.values());
  }
  getConnection(t) {
    const e = `${this.node.id}->${t}`;
    return this.connections.get(e) || null;
  }
  updateConnection(t, e) {
    try {
      const n = this.connections.get(t);
      if (!n)
        return console.warn(
          "CONNECTOR_DEBUG: Connection not found for update:",
          t
        ), !1;
      Object.assign(n, e);
      const s = n.connectable;
      if (s) {
        if (e.lineColor != null && s.setConnectorColor && s.setConnectorColor(e.lineColor), e.lineWidth != null && s.setStrokeWidth && s.setStrokeWidth(e.lineWidth), e.lineType != null && s.setType) {
          const o = {
            bezier: "curved",
            curved: "curved",
            orthogonal: "orthogonal",
            straight: "straight",
            linear: "straight"
          };
          s.setType(o[e.lineType] || "curved");
        }
        if (e.lineCurviness != null && (s.lineCurviness = e.lineCurviness), e.showParentArrow != null || e.showChildArrow != null) {
          const o = e.showParentArrow ?? n.showParentArrow ? "arrow" : "null", r = e.showChildArrow ?? n.showChildArrow ?? !0 ? "arrow" : "null";
          s.setMarker?.(o, r);
        }
        s.update?.();
      }
      return console.log("CONNECTOR_DEBUG: Updated connection", t), !0;
    } catch (n) {
      return console.error("CONNECTOR_DEBUG: Failed to update connection:", n), !1;
    }
  }
  /**
   * Edge-pin mode: pin (or unpin with null) a connection's endpoint to a
   * normalized local anchor {x,y} in 0..1 on the source or target node.
   * A pinned endpoint stays on that point and rotates with the node; null
   * restores auto-flow (nearest-edge). Re-solves immediately.
   */
  setConnectionAnchor(t, e, n) {
    const s = this.connections.get(`${this.node.id}->${t}`);
    return s ? (e === "source" ? s.sourceAnchor = n : s.targetAnchor = n, s.connectable?.setAttachmentAnchor?.(e, n), !0) : !1;
  }
  /**
   * Endpoint-drag → model (L1). The vendored lib has already reattached the
   * VIEW when this fires; we reconcile the association MODEL so the change
   * broadcasts to peers and persists. Reattaching to a node rebuilds the
   * association (remove old + add new) through the already-synced/persisted
   * addAssociation/removeAssociation. Deferred a tick so the lib's dragend
   * finishes before we tear down/recreate the connection.
   *
   * Free-floating (phantom) drops are L1b — not yet persisted; left as a
   * view-only endpoint for now (no rogue model state).
   */
  handleEndpointChange(t, e) {
    const { which: n, targetNodeId: s, isPhantom: o, point: r } = e, a = {
      lineColor: t.lineColor,
      lineWidth: t.lineWidth,
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow
    }, l = (t.id.split("->")[1] || "").trim();
    setTimeout(() => {
      try {
        if (n === "target") {
          const c = t.source;
          if (!c?.relationships) return;
          if (o || !s) {
            if (!r) return;
            l && c.relationships.removeAssociation(l), c.relationships.addFloatingAssociation(r, a);
          } else {
            const h = this.slate.nodes.one(s);
            if (!h) return;
            if (h.id === l) {
              this.pinDropAnchor(c, l, h, "targetAnchor", r);
              return;
            }
            l && c.relationships.removeAssociation(l), c.relationships.addAssociation(h, a), this.pinDropAnchor(c, h.id, h, "targetAnchor", r);
          }
        } else {
          if (o || !s) return;
          const c = t.source, h = t.target, d = this.slate.nodes.one(s);
          if (!d || !h || !c?.relationships) return;
          if (d.id === c.id) {
            this.pinDropAnchor(c, h.id, d, "sourceAnchor", r);
            return;
          }
          c.relationships.removeAssociation(h.id), d.relationships?.addAssociation(h, a), this.pinDropAnchor(d, h.id, d, "sourceAnchor", r);
        }
      } catch (c) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", c);
      }
    }, 0);
  }
  /**
   * U3: pin an endpoint at the exact drop point on a node. Converts the world
   * drop point into a normalized [0,1] anchor on the node's box and stores it as
   * the source/target anchor (persists + renders there). Skipped for rotated
   * nodes (world→local normalization would be wrong) — those fall back to
   * auto-flow. relationships owner is `ownerNode`; the association is childId.
   */
  pinDropAnchor(t, e, n, s, o) {
    try {
      if (!o) return;
      const r = n?.options || {};
      if (!r.width || !r.height || r.rotate?.rotationAngle) return;
      const a = (b) => Math.max(0, Math.min(1, b));
      let l = a((o.x - (r.x || 0)) / r.width), c = a((o.y - (r.y || 0)) / r.height);
      const h = l, d = 1 - l, u = c, f = 1 - c, g = Math.min(h, d, u, f);
      g === h ? l = 0 : g === d ? l = 1 : g === u ? c = 0 : c = 1;
      const p = { x: l, y: c }, y = t?.relationships, m = y?.associations?.find((b) => b.childId === e);
      m?.id && (y.applyLineProperty(m.id, s, p), t.slate?.broadcast?.("onLinePropertiesChanged", {
        id: t.id,
        prop: s,
        val: p,
        associationId: m.id
      }));
    } catch {
    }
  }
  /**
   * L5 per-endpoint locking. mode "absolute" freezes the endpoint at its
   * current spot on the node (a normalized local anchor that then moves/rotates
   * with the node); "relative" clears it back to auto-flow (nearest-edge).
   * Returns the anchor that was set (or null) so callers can persist it.
   */
  setEndpointLock(t, e, n) {
    const s = this.connections.get(t);
    if (!s) return null;
    const o = s.connectable;
    if (n === "absolute") {
      const r = o?.getCurrentAnchor?.(e) || { x: 0.5, y: 0.5 };
      return s[e + "Anchor"] = r, o?.setAttachmentAnchor?.(e, r), r;
    }
    return s[e + "Anchor"] = null, o?.setAttachmentAnchor?.(e, null), null;
  }
  /**
   * Show a cog affordance at the midpoint of a clicked line (M1/M2). Clicking
   * the cog opens the host's line-properties pane. Only one cog is shown at a
   * time (tracked on the slate) and it clears on canvas/node interaction.
   */
  /**
   * Miro-style hover reveal for a connection's endpoint handles. Handles are
   * hidden by default (CSS) and shown while the pointer is over the line, its
   * hit area, or a handle — then hidden again on leave, UNLESS the connection is
   * selected (`_handlesPinned`, set by showLineCog / cleared by clearLineCog).
   * Handles are created lazily by the vendored lib, so we resolve them at event
   * time rather than capturing them now.
   */
  wireHandleReveal(t) {
    const e = () => [t.sourceHandle?.element, t.targetHandle?.element].filter(
      (o) => o && o.node
    ), n = (o) => {
      e().forEach((r) => {
        o ? r.node.classList.add("connector-handle--revealed") : !t._handlesPinned && !t._handlesDragging && r.node.classList.remove("connector-handle--revealed");
      });
    };
    t._revealHandles = n;
    const s = () => e().forEach((o) => {
      o._revealArmed || (o._revealArmed = !0, o.on?.("mouseenter", () => n(!0)), o.on?.("mouseleave", () => n(!1)), o.on?.("dragstart", () => {
        t._handlesDragging = !0, n(!0);
      }), o.on?.("dragend", () => {
        t._handlesDragging = !1, t._handlesPinned || n(!1);
      }));
    });
    [t.hitArea, t.connector].forEach((o) => {
      o?.on?.("mouseenter", () => {
        n(!0), s();
      }), o?.on?.("mouseleave", () => n(!1));
    });
  }
  showLineCog(t, e, n) {
    const s = this.slate;
    s.clearLineCog?.();
    const o = e?.connector;
    let r, a;
    try {
      const w = o.bbox();
      r = w.cx, a = w.cy;
    } catch {
      return;
    }
    const l = s.markersContainer || s.canvas;
    if (!l) return;
    const c = 15, h = 6, u = [
      {
        key: "delete",
        color: "#e5484d",
        onClick: () => {
          this.node.relationships?.removeAssociation?.(n), s.clearLineCog?.();
        }
      },
      {
        key: "cog",
        color: "#5b6472",
        onClick: () => {
          this.openLinePane(t, e, n), this.showEndpointLockToggles(t, e, n);
        }
      }
    ], f = u.length, g = c * 2 + h, p = f * (c * 2) + (f - 1) * h, y = r - p / 2 + c, m = l.group().addClass("line-cog").addClass("line-toolbar");
    m.rect(p + 14, c * 2 + 10).radius((c * 2 + 10) / 2).center(r, a).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 });
    const b = this.node.constructor;
    u.forEach((w, x) => {
      const _ = y + x * g, v = m.group().addClass(`line-tool-${w.key}`);
      v.circle(c * 2).center(_, a).fill("#ffffff").attr("fill-opacity", 1e-3), b.drawToolIcon?.(v, w.key, _, a, w.color), v.attr("pointer-events", "all");
      try {
        v.node.style.cursor = "pointer";
      } catch {
      }
      v.on("mousedown", (C) => C.stopPropagation?.()), v.on("click", (C) => {
        C.stopPropagation?.(), w.onClick();
      });
    }), m.attr("pointer-events", "all"), s._activeLineCog = m;
    try {
      e.selectConnector?.(), s._activeLineConnectable = e, e._handlesPinned = !0, e._revealHandles?.(!0);
    } catch {
    }
    try {
      s.markersContainer?.front?.();
    } catch {
    }
  }
  openLinePane(t, e, n) {
    const s = this.node.slate?.options?.events;
    if (!s?.onLineMenuRequested) return;
    const o = this.node.relationships, r = o?.associations?.find((a) => a.childId === n) ?? o?.getAssociation?.(n) ?? t;
    s.onLineMenuRequested(this.node, r, (a = {}) => {
      if (r?.id && this.node.relationships)
        for (const [l, c] of Object.entries(a))
          this.node.relationships.applyLineProperty(
            r.id,
            l,
            c
          );
    });
  }
  /**
   * Q3: show a lock/relative toggle at EACH endpoint (source + target) when the
   * line cog is clicked. Clicking a toggle flips absolute (pinned anchor) ↔
   * relative (auto-flow) via applyLineProperty, and broadcasts for collab parity.
   */
  showEndpointLockToggles(t, e, n) {
    const s = this.slate;
    s._activeEndpointToggles && s._activeEndpointToggles.forEach((v) => {
      try {
        v.remove();
      } catch {
      }
    }), s._activeEndpointToggles = [];
    const o = e?.connector?.node;
    if (!o || !o.getPointAtLength) return;
    let r = 0;
    try {
      r = o.getTotalLength();
    } catch {
      return;
    }
    const a = o.getPointAtLength(0), l = o.getPointAtLength(r), c = this.node.relationships, h = c?.associations?.find((v) => v.childId === n);
    if (!h) return;
    const d = (v) => {
      const C = v?.options || {};
      return { x: (C.x || 0) + (C.width || 0) / 2, y: (C.y || 0) + (C.height || 0) / 2 };
    }, u = (v, C) => Math.hypot(v.x - C.x, v.y - C.y), f = d(this.node), g = u(a, f) <= u(l, f), p = Math.min(34, r * 0.28), y = o.getPointAtLength(g ? p : r - p), m = o.getPointAtLength(g ? r - p : p), b = s.markersContainer || s.canvas, w = "#5b6472", x = "#4051B5", _ = (v, C) => {
      const A = C === "source" ? !!h.sourceAnchor : !!h.targetAnchor, B = A ? x : w, I = b.group().addClass("endpoint-lock").addClass(`endpoint-lock-${C}`).addClass(A ? "endpoint-lock-absolute" : "endpoint-lock-relative");
      I.circle(24).center(v.x, v.y).fill("#ffffff").stroke({ color: B, width: 1.5 }), Ie.drawLockIcon(I, v.x, v.y, B, A), I.circle(24).center(v.x, v.y).fill("#ffffff").attr("fill-opacity", 1e-3), I.attr("pointer-events", "all");
      try {
        I.node.style.cursor = "pointer";
      } catch {
      }
      I.on("mousedown", (T) => T.stopPropagation?.()), I.on("click", (T) => {
        T.stopPropagation?.();
        const Z = C === "source" ? "sourceLock" : "targetLock", H = A ? "relative" : "absolute";
        try {
          c.applyLineProperty(h.id, Z, H);
        } catch {
        }
        try {
          s.broadcast?.("onLinePropertiesChanged", {
            id: this.node.id,
            associationId: h.id,
            prop: Z,
            val: H
          });
        } catch {
        }
        this.showEndpointLockToggles(t, e, n);
      }), s._activeEndpointToggles.push(I);
    };
    _(y, "source"), _(m, "target");
    try {
      s.markersContainer?.front?.();
    } catch {
    }
  }
  /** Draw a small padlock (closed = absolute/locked, open = relative). */
  static drawLockIcon(t, e, n, s, o) {
    const r = { color: s, width: 1.4, linecap: "round", linejoin: "round" };
    t.rect(11, 8).radius(1.5).move(e - 5.5, n - 0.5).fill("none").stroke(r), o ? t.path(
      `M ${e - 3.4} ${n - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 0 v 2.2`
    ).fill("none").stroke(r) : t.path(`M ${e - 3.4} ${n - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 -0.6`).fill("none").stroke(r), t.circle(1.6).center(e, n + 3).fill(s);
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
function an(i, t, e) {
  return {
    id: `${i}->${t}`,
    parentId: i,
    childId: t,
    lineColor: "#000",
    lineOpacity: 1,
    lineEffect: "",
    lineType: "bezier",
    lineCurveType: "cubic",
    lineCurviness: 0.1,
    lineWidth: 6,
    isStraightLine: !1,
    showParentArrow: !1,
    showChildArrow: !0,
    ...e
  };
}
const fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultAssociation: an
}, Symbol.toStringTag, { value: "Module" }));
class Ui {
  constructor(t, e = {}) {
    this.assocMap = /* @__PURE__ */ new Map(), this.isActive = !1, this.node = t, this.slate = t.slate, this.isActive = e.enabled ?? !0;
  }
  /**
   * v1 contract: `.associations` is a plain ARRAY whose entries carry live
   * `parent`/`child` node references (host apps read `a.parent.options.id`
   * and PropType it as an array). The Map stays internal.
   */
  get associations() {
    const t = this.node?.slate;
    return Array.from(this.assocMap.values()).map((e) => ({
      ...e,
      parent: t?.nodes?.one?.(e.parentId) ?? (e.parentId === this.node.id ? this.node : void 0),
      child: t?.nodes?.one?.(e.childId) ?? (e.childId === this.node.id ? this.node : void 0)
    }));
  }
  // ─── Association management ──────────────────────────────────────
  /**
   * Add an association from this node (parent) to a child node.
   * Creates the visual connection via the Connector system.
   */
  addAssociation(t, e) {
    const n = an(this.node.id, t.id, e);
    return this.assocMap.set(n.id, n), this.renderAssociation(n, t), this.node.slate?.broadcast?.("addRelationship", { ...n }), console.log(
      "RELATIONSHIP_DEBUG: Added association",
      n.id,
      "from",
      this.node.id,
      "to",
      t.id
    ), n;
  }
  /**
   * Remove a specific association by child node ID.
   */
  removeAssociation(t) {
    const e = `${this.node.id}->${t}`, n = this.assocMap.get(e);
    if (!n)
      return console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        e
      ), !1;
    if (n.targetPoint && this.node.connector)
      this.node.connector.disconnectById(e);
    else {
      const s = this.slate.nodes.one(t);
      s && this.node.connector && this.node.connector.disconnectFrom(s);
    }
    return this.assocMap.delete(e), console.log("RELATIONSHIP_DEBUG: Removed association", e), this.node.slate?.broadcast?.("removeRelationship", {
      parentId: this.node.id,
      childId: t
    }), !0;
  }
  /**
   * Remove all associations from this node.
   */
  removeAll() {
    const t = Array.from(this.assocMap.keys());
    for (const e of t) {
      const n = this.assocMap.get(e);
      this.removeAssociation(n.childId);
    }
  }
  /**
   * Apply a single line property (from the line-properties pane) to one
   * association: update the stored record (so it serializes/persists) AND
   * re-render the connector. Used by the onLinePropertiesChanged apply path
   * (local invoke + remote collab), which is why line edits now sync + persist.
   */
  applyLineProperty(t, e, n) {
    let s = this.assocMap.get(t);
    if (!s) {
      for (const r of this.assocMap.values())
        if (r.id === t) {
          s = r;
          break;
        }
    }
    if (!s) return !1;
    const o = `${this.node.id}->${s.childId}`;
    if (e === "sourceLock" || e === "targetLock") {
      const r = e === "sourceLock" ? "source" : "target", a = this.node.connector?.setEndpointLock(
        o,
        r,
        n === "absolute" ? "absolute" : "relative"
      );
      return s[r + "Anchor"] = a ?? null, !0;
    }
    if (s[e] = n, e === "sourceAnchor" || e === "targetAnchor") {
      const r = e === "sourceAnchor" ? "source" : "target";
      this.node.connector?.getConnections?.().find((l) => l.id === o)?.connectable?.setAttachmentAnchor?.(r, n);
    } else
      this.node.connector?.updateConnection(o, { [e]: n });
    return !0;
  }
  /**
   * Update all associations with new options (e.g., line color change).
   */
  updateAssociationsWith(t) {
    for (const [e, n] of this.assocMap)
      if (Object.assign(n, t), this.node.connector) {
        const s = `${this.node.id}->${n.childId}`;
        this.node.connector.updateConnection(s, {
          lineColor: n.lineColor,
          lineWidth: n.lineWidth
        });
      }
  }
  /**
   * Refresh all visual connections (e.g., after drag/move).
   * Called during node drag to update connector positions.
   */
  refresh() {
    console.log(
      "RELATIONSHIP_DEBUG: Refreshing associations for",
      this.node.id
    );
  }
  /**
   * Refresh only this node's own relationships (as parent).
   * Used by Invoker when line color changes.
   */
  refreshOwnRelationships() {
    for (const [t, e] of this.assocMap)
      if (this.slate.nodes.one(e.childId) && this.node.connector) {
        const s = `${this.node.id}->${e.childId}`;
        this.node.connector.updateConnection(s, {
          lineColor: e.lineColor,
          lineWidth: e.lineWidth
        });
      }
  }
  // ─── Query methods ───────────────────────────────────────────────
  /** Get all associations where this node is the parent */
  getAssociations() {
    return Array.from(this.assocMap.values());
  }
  /** Get a specific association by child ID */
  getAssociation(t) {
    return this.assocMap.get(`${this.node.id}->${t}`);
  }
  /** Check if this node has any associations */
  hasAssociations() {
    return this.assocMap.size > 0;
  }
  /** Get count of associations */
  count() {
    return this.assocMap.size;
  }
  // ─── Serialization ───────────────────────────────────────────────
  /** Serialize all associations to JSON-compatible format */
  serialize() {
    return {
      associations: Array.from(this.assocMap.values())
    };
  }
  // ─── Lifecycle ───────────────────────────────────────────────────
  enable() {
    this.isActive = !0;
  }
  disable() {
    this.isActive = !1;
  }
  isEnabled() {
    return this.isActive;
  }
  /** Destroy the relationships, removing all associations and clearing references */
  destroy() {
    this.removeAll(), this.disable(), this.assocMap.clear(), this.node = null, this.slate = null;
  }
  // ─── Private helpers ─────────────────────────────────────────────
  renderAssociation(t, e) {
    if (!this.node.connector) return;
    this.node.connector.isEnabled() || this.node.connector.enable();
    const n = {
      lineColor: t.lineColor,
      lineWidth: t.lineWidth,
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow,
      sourceAnchor: t.sourceAnchor,
      targetAnchor: t.targetAnchor
    };
    if (t.targetPoint) {
      this.node.connector.connectToPoint(
        t.targetPoint,
        t.childId,
        n
      );
      return;
    }
    e && this.node.connector.connectTo(e, n);
  }
  /**
   * Add a free-floating association whose target is a bare world point rather
   * than a node (L1b). Backed by a phantom endpoint; broadcasts + persists like
   * a normal association (targetPoint travels in the record).
   */
  addFloatingAssociation(t, e) {
    const n = e?.childId || `__free_${Math.random().toString(36).slice(2, 10)}`, s = an(this.node.id, n, {
      ...e,
      childId: n,
      targetPoint: t
    });
    return this.assocMap.set(s.id, s), this.renderAssociation(s, null), this.node.slate?.broadcast?.("addRelationship", { ...s }), s;
  }
}
class Fi {
  constructor(t) {
    this.patternElement = null, this.imageUrl = "", this.origWidth = 0, this.origHeight = 0, this.preserveAspectRatio = !0, this.node = t;
  }
  /**
   * Set an image fill on the node's background.
   *
   * Uses SVG pattern fills for proper scaling within the shape.
   */
  set(t, e, n, s = !0) {
    this.imageUrl = t, this.origWidth = e || this.node.options.width || 100, this.origHeight = n || this.node.options.height || 60, this.preserveAspectRatio = s, this.node.options.image = t, this.node.options.imageOrigWidth = this.origWidth, this.node.options.imageOrigHeight = this.origHeight, this.render();
  }
  /**
   * Clear the image fill and restore the background color.
   */
  clear() {
    this.patternElement && (this.patternElement.remove(), this.patternElement = null), this.imageUrl = "", this.node.options.image = void 0, this.node.backgroundRect && this.node.backgroundRect.fill(
      this.node.options.backgroundColor || "#f0f0f0"
    );
  }
  /** Destroy the images instance, clearing all image data */
  destroy() {
    this.clear(), this.node = null;
  }
  /**
   * Update the image (e.g., after resize).
   */
  update() {
    this.imageUrl && this.render();
  }
  /** Check if an image is set */
  hasImage() {
    return !!this.imageUrl;
  }
  // ─── Private ─────────────────────────────────────────────────────
  render() {
    if (!(!this.imageUrl || !this.node.backgroundRect))
      try {
        this.patternElement && this.patternElement.remove();
        const t = this.node.options.width || 100, e = this.node.options.height || 60, n = this.node.svgGroup.root();
        if (!n) return;
        let s = n.defs();
        this.patternElement = s.pattern(t, e, (o) => {
          o.image(this.imageUrl).size(t, e).attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid meet" : "xMidYMid slice");
        }).attr("patternUnits", "objectBoundingBox").attr("width", "100%").attr("height", "100%"), this.node.backgroundRect.fill(this.patternElement), console.log(
          "IMAGES_DEBUG: Set image fill for",
          this.node.id,
          "url:",
          this.imageUrl
        );
      } catch (t) {
        console.error("IMAGES_DEBUG: Failed to set image:", t);
      }
  }
}
const xe = /* @__PURE__ */ new Set(), ne = /* @__PURE__ */ new Map(), pa = /* @__PURE__ */ new Set([
  "arial",
  "arial, sans-serif",
  "helvetica",
  "helvetica, sans-serif",
  "times new roman",
  "times",
  "courier",
  "courier new",
  "georgia",
  "verdana",
  "tahoma",
  "trebuchet ms",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy"
]);
function Tn(i) {
  const t = i.trim(), e = t.toLowerCase();
  if (pa.has(e) || xe.has(e))
    return Promise.resolve();
  if (ne.has(e))
    return ne.get(e);
  const n = new Promise((s, o) => {
    if (typeof document > "u") {
      s();
      return;
    }
    const r = t.split(",")[0].trim().replace(/['"]/g, "");
    try {
      if (document.fonts?.check?.(`12px "${r}"`)) {
        xe.add(e), s();
        return;
      }
    } catch {
    }
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      r
    )}:wght@300;400;500;600;700&display=swap`, a.onload = () => {
      xe.add(e), ne.delete(e), console.log("FONT_DEBUG: Loaded font:", r), s();
    }, a.onerror = () => {
      ne.delete(e), console.warn("FONT_DEBUG: Failed to load font:", r), s();
    }, document.head.appendChild(a);
  });
  return ne.set(e, n), n;
}
async function Zi(i) {
  const t = /* @__PURE__ */ new Set(), e = i.nodes?.allNodes || [];
  for (const s of e)
    s.options?.fontFamily && t.add(s.options.fontFamily);
  const n = Array.from(t).map((s) => Tn(s));
  await Promise.all(n), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function ga(i) {
  return xe.has(i.toLowerCase().trim());
}
const ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isFontLoaded: ga,
  loadAllFonts: Zi,
  loadFont: Tn
}, Symbol.toStringTag, { value: "Module" }));
class Yi {
  constructor(t) {
    this._inlineEditing = !1, this._inlineFO = null, this.node = t;
  }
  /** Destroy the editor, clearing all references */
  destroy() {
    this._inlineEditing && this.cancelInline(), this.node = null;
  }
  /** Whether an inline (on-canvas) edit is currently active. */
  isInlineEditing() {
    return this._inlineEditing;
  }
  /**
   * Start inline (on-canvas) text editing — Miro-style. Overlays a
   * contenteditable box exactly on the node (inside its group so it tracks
   * pan/zoom/position), pre-filled + all-selected. Enter commits, Shift+Enter
   * inserts a newline, Escape cancels, blur commits.
   *
   * Commit routes through collab.invoke + collab.send (the same persist/sync path
   * the drawer uses via onNodeTextChanged), so the edit survives reload and syncs
   * to collaborators. SVG-content nodes (no textElement) are skipped.
   */
  startInline() {
    const t = this.node;
    if (this._inlineEditing || !t || t.nestedSvg) return;
    const e = t.svgGroup?.node;
    if (!e) return;
    const n = t.options.width || 100, s = t.options.height || 60, r = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    r.setAttribute("x", "0"), r.setAttribute("y", "0"), r.setAttribute("width", String(n)), r.setAttribute("height", String(s)), r.style.overflow = "visible";
    const a = document.createElement("div");
    a.setAttribute("contenteditable", "true"), a.className = "sb-inline-editor", a.textContent = t.options.text || "", a.style.cssText = [
      `width:${n}px`,
      `height:${s}px`,
      "box-sizing:border-box",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "text-align:center",
      "outline:none",
      "padding:4px",
      "cursor:text",
      "word-break:break-word",
      "overflow:hidden",
      "white-space:pre-wrap",
      `font-family:${t.options.fontFamily || "Arial, sans-serif"}`,
      `font-size:${t.options.fontSize || 14}px`,
      `color:${t.options.fontColor || "#000000"}`
    ].join(";"), r.appendChild(a), e.appendChild(r), this._inlineFO = r, this._inlineEditing = !0, t.textElement?.hide?.();
    const l = (c) => {
      if (!this._inlineEditing) return;
      this._inlineEditing = !1;
      const h = (a.innerText || "").replace(/\n+$/, "");
      try {
        r.remove();
      } catch {
      }
      if (this._inlineFO = null, t.textElement?.show?.(), c && h !== (t.options.text || "")) {
        const d = {
          type: "onNodeTextChanged",
          data: { id: t.id, text: h }
        }, u = t.slate, f = u?.collab;
        f?.invoke ? (f.invoke(d), typeof u.broadcast == "function" ? u.broadcast("onNodeTextChanged", d.data) : f.send?.(d)) : t.setText?.(h);
      }
    };
    a.addEventListener("keydown", (c) => {
      c.stopPropagation(), c.key === "Enter" && !c.shiftKey ? (c.preventDefault(), l(!0)) : c.key === "Escape" && (c.preventDefault(), l(!1));
    }), a.addEventListener("blur", () => l(!0)), setTimeout(() => {
      try {
        a.focus();
        const c = document.createRange();
        c.selectNodeContents(a);
        const h = window.getSelection();
        h?.removeAllRanges(), h?.addRange(c);
      } catch {
      }
    }, 0);
  }
  /** Cancel an in-progress inline edit without saving. */
  cancelInline() {
    if (this._inlineEditing) {
      this._inlineEditing = !1;
      try {
        this._inlineFO?.remove();
      } catch {
      }
      this._inlineFO = null, this.node?.textElement?.show?.();
    }
  }
  /**
   * Set text content and properties on the node.
   * This is the primary method used by collaboration events
   * and the text editing pane.
   */
  async set(t, e, n, s, o, r, a) {
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), s !== void 0 && (this.node.options.fontColor = s), o !== void 0 && (this.node.options.textOpacity = o), r !== void 0 && (this.node.options.textXAlign = r), a !== void 0 && (this.node.options.textYAlign = a), n !== void 0 && n !== this.node.options.fontFamily && (this.node.options.fontFamily = n, await Tn(n)), this.applyText();
  }
  /**
   * Get current text properties.
   */
  get() {
    return {
      text: this.node.options.text || "",
      fontSize: this.node.options.fontSize || 14,
      fontFamily: this.node.options.fontFamily || "Arial, sans-serif",
      fontColor: this.node.options.fontColor || "#000000",
      textOpacity: this.node.options.textOpacity ?? 1,
      textXAlign: this.node.options.textXAlign || "center",
      textYAlign: this.node.options.textYAlign || "middle"
    };
  }
  /**
   * Calculate auto text offset based on node shape and text size.
   */
  calculateAutoOffset() {
    if (!this.node.textElement)
      return { x: 0, y: 0 };
    try {
      const t = this.node.textElement.bbox(), e = this.node.options.width || 100, n = this.node.options.height || 60;
      return {
        x: (e - t.width) / 2,
        y: (n - t.height) / 2
      };
    } catch {
      return { x: 0, y: 0 };
    }
  }
  // ─── Private ─────────────────────────────────────────────────────
  applyText() {
    if (!this.node.textElement) return;
    const { text: t, fontSize: e, fontFamily: n, fontColor: s, textOpacity: o } = this.node.options;
    this.node.textElement.text(t || ""), this.node.textElement.font({
      family: n || "Arial, sans-serif",
      size: e || 14,
      fill: s || "#000000",
      opacity: o ?? 1
    }), typeof this.node.centerText == "function" && this.node.centerText(), this.node.slate?.options?.autoResizeNodesBasedOnText && this.autoResize();
  }
  autoResize() {
    if (this.node.textElement)
      try {
        const t = this.node.textElement.bbox(), e = 20, n = t.width + e * 2, s = t.height + e * 2, o = this.node.options.width || 100, r = this.node.options.height || 60;
        if (n > o || s > r) {
          const a = Math.max(o, n), l = Math.max(r, s);
          this.node.setSize(a, l);
        }
      } catch {
      }
  }
}
class Xi {
  constructor(t) {
    this.linkData = null, this.node = t, t.options.link?.show && (this.linkData = { ...t.options.link });
  }
  /**
   * Set a link on this node.
   *
   * @param linkOptions - Link configuration
   * @param sendCollab - If true, broadcast via collaboration
   */
  set(t, e = !0) {
    this.linkData = {
      show: !0,
      ...t
    }, this.node.options.link = { ...this.linkData }, this.node.updateLinkIndicator?.(), console.log("LINKS_DEBUG: Set link on", this.node.id, this.linkData), e && this.node.slate?.collab?.isCollabConnected() && this.node.slate.collab.send({
      type: "onNodeLinkAdded",
      data: {
        id: this.node.id,
        link: this.linkData
      }
    });
  }
  /**
   * Remove the link from this node.
   *
   * @param sendCollab - If true, broadcast via collaboration
   */
  unset(t = !0) {
    this.linkData = null, this.node.options.link = void 0, this.node.updateLinkIndicator?.(), console.log("LINKS_DEBUG: Removed link from", this.node.id), t && this.node.slate?.collab?.isCollabConnected() && this.node.slate.collab.send({
      type: "onNodeLinkRemoved",
      data: { id: this.node.id }
    });
  }
  /** Get current link data */
  get() {
    return this.linkData;
  }
  /** Check if a link is set */
  hasLink() {
    return this.linkData?.show === !0;
  }
  /** Get link type */
  getType() {
    return this.linkData?.type;
  }
  /** Navigate to the link (opens URL or fires slate event) */
  navigate() {
    if (this.linkData)
      switch (this.linkData.type) {
        case "url":
          this.linkData.data && typeof window < "u" && window.open(this.linkData.data, "_blank");
          break;
        case "currentSlate":
        case "externalSlate":
          console.log(
            "LINKS_DEBUG: Navigate to slate",
            this.linkData.data
          );
          break;
      }
  }
  /** Destroy the links instance, unsetting any active link */
  destroy() {
    this.linkData && this.unset(!1), this.linkData = null, this.node = null;
  }
}
const mt = /* @__PURE__ */ new Map();
mt.set("dropShadow", {
  name: "dropShadow",
  types: ["text", "vect", "image"],
  apply: (i) => {
    try {
      i.attr(
        "filter",
        "drop-shadow(3px 3px 4px rgba(0,0,0,0.3))"
      );
    } catch {
    }
  },
  remove: (i) => {
    try {
      i.attr("filter", null);
    } catch {
    }
  }
});
mt.set("blur", {
  name: "blur",
  types: ["text", "vect", "image"],
  apply: (i) => {
    try {
      i.attr("filter", "blur(2px)");
    } catch {
    }
  },
  remove: (i) => {
    try {
      i.attr("filter", null);
    } catch {
    }
  }
});
mt.set("outline", {
  name: "outline",
  types: ["text", "vect"],
  apply: (i) => {
    try {
      const t = i.attr("stroke"), e = i.attr("stroke-width");
      i.data("original-stroke", t || "#333"), i.data("original-stroke-width", e || 2), i.stroke({ color: "#ff0000", width: 3 });
    } catch {
    }
  },
  remove: (i) => {
    try {
      i.stroke({
        color: i.data("original-stroke") || "#333",
        width: i.data("original-stroke-width") || 2
      });
    } catch {
    }
  }
});
mt.set("postItNote", {
  name: "postItNote",
  types: ["text", "vect", "image"],
  apply: (i) => {
    try {
      i.attr("filter", "drop-shadow(0 4px 2px rgba(0,0,0,0.5))");
    } catch {
    }
  },
  remove: (i) => {
    try {
      i.attr("filter", null);
    } catch {
    }
  }
});
mt.set("pencil", {
  name: "pencil",
  types: ["text", "vect", "image"],
  apply: (i) => {
    try {
      const e = i.root?.()?.defs?.();
      if (e && !e.findOne?.("#sb-pencil-filter")) {
        const n = e.element("filter").id("sb-pencil-filter");
        n.attr({
          x: "-10%",
          y: "-10%",
          width: "120%",
          height: "120%"
        }), n.node.innerHTML = '<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="1" result="noise"/><feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="3" in="SourceGraphic" in2="noise"/>';
      }
      i.attr("filter", "url(#sb-pencil-filter)");
    } catch {
    }
  },
  remove: (i) => {
    try {
      i.attr("filter", null);
    } catch {
    }
  }
});
class $i {
  constructor(t) {
    this.activeFilters = /* @__PURE__ */ new Set(), this.hidden = !1, this.node = t;
  }
  /**
   * Apply a named filter to the node.
   *
   * @param filterName - Name of the filter (e.g., "dropShadow", "blur")
   * @param target - "vect" for shape, "text" for text, or both
   */
  apply(t, e = "both") {
    const n = mt.get(t);
    if (!n) {
      console.warn("FILTERS_DEBUG: Unknown filter:", t);
      return;
    }
    (e === "vect" || e === "both") && this.node.backgroundRect && n.apply(this.node.backgroundRect), (e === "text" || e === "both") && this.node.textElement && n.apply(this.node.textElement), this.activeFilters.add(t), this.node.options.filters || (this.node.options.filters = {}), (e === "vect" || e === "both") && (this.node.options.filters.vect = t), (e === "text" || e === "both") && (this.node.options.filters.text = t), console.log(
      "FILTERS_DEBUG: Applied",
      t,
      "to",
      this.node.id,
      "target:",
      e
    );
  }
  /**
   * Remove a specific filter from the node.
   */
  remove(t) {
    const e = mt.get(t);
    e && (this.node.backgroundRect && e.remove(this.node.backgroundRect), this.node.textElement && e.remove(this.node.textElement), this.activeFilters.delete(t));
  }
  /**
   * Remove all filters from the node.
   */
  removeAll() {
    for (const t of this.activeFilters)
      this.remove(t);
    this.activeFilters.clear();
  }
  /**
   * Toggle filter visibility (hide/show without removing).
   */
  toggleVisibility(t) {
    if (this.hidden = t, t)
      for (const e of this.activeFilters) {
        const n = mt.get(e);
        n && (this.node.backgroundRect && n.remove(this.node.backgroundRect), this.node.textElement && n.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const n = mt.get(e);
        n && (this.node.backgroundRect && n.apply(this.node.backgroundRect), this.node.textElement && n.apply(this.node.textElement));
      }
  }
  /** Get list of active filter names */
  getActive() {
    return Array.from(this.activeFilters);
  }
  /** Check if a specific filter is active */
  isActive(t) {
    return this.activeFilters.has(t);
  }
  /** Destroy the filters instance, removing all active filters */
  destroy() {
    this.removeAll(), this.activeFilters.clear(), this.hidden = !1, this.node = null;
  }
}
function bl(i) {
  mt.set(i.name, i);
}
function wl() {
  return Array.from(mt.keys());
}
function Wi() {
  const i = {};
  for (const [t, e] of mt)
    i[t] = { types: e.types || ["text", "vect"] };
  return i;
}
class ji {
  constructor(t, e = {}) {
    this.isOpen = !1, this.node = t, this.slate = t.slate, this.options = {
      enabled: !0,
      ...e
    };
  }
  /**
   * Open the menu for this node.
   * Delegates to the slate's onMenuRequested event for actual UI rendering.
   */
  open() {
    if (!this.options.enabled || this.node.options.allowMenu === !1) return;
    const t = this.getVisibleTabs();
    this.slate.options.events?.onMenuRequested ? (this.isOpen = !0, this.slate.options.events.onMenuRequested(this.node, (e) => {
      this.isOpen = !1, console.log("MENU_DEBUG: Menu closed for", this.node.id);
    })) : this.isOpen = !1, console.log(
      "MENU_DEBUG: Menu opened for",
      this.node.id,
      "tabs:",
      t
    );
  }
  /** Close the menu */
  close() {
    this.isOpen = !1;
  }
  /** Check if menu is currently open */
  isMenuOpen() {
    return this.isOpen;
  }
  /** Get list of visible tabs based on node options */
  getVisibleTabs() {
    const t = [], e = this.node.options;
    return e.showColorTab !== !1 && t.push("color"), e.showTextTab !== !1 && t.push("text"), e.showShapeTab !== !1 && t.push("shape"), e.showImageTab !== !1 && t.push("image"), e.showEffectTab !== !1 && t.push("effect"), e.showAITab !== !1 && t.push("ai"), t;
  }
  /** Enable/disable the menu */
  enable() {
    this.options.enabled = !0;
  }
  disable() {
    this.options.enabled = !1, this.close();
  }
  isEnabled() {
    return this.options.enabled;
  }
  /** Destroy the menu, closing it and clearing references */
  destroy() {
    this.close(), this.options.enabled = !1, this.node = null, this.slate = null;
  }
}
const V = /* @__PURE__ */ new Map();
V.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
V.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
V.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
V.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
V.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
V.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
V.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
V.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
V.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
V.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
V.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
V.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
V.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
V.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
function ln(i) {
  return V.get(i.toLowerCase());
}
function ya(i) {
  return V.has(i.toLowerCase());
}
function ba(i, t) {
  V.set(i.toLowerCase(), t);
}
function wa() {
  return Array.from(V.keys());
}
function Vi(i) {
  return ["rectangle", "circle", "ellipse"].includes(i.toLowerCase());
}
function qi(i, t) {
  if (t) {
    const e = ln(t);
    if (e) return e;
    if (t.trim().startsWith("M") || t.trim().startsWith("m"))
      return {
        path: t,
        defaultWidth: 100,
        defaultHeight: 60,
        viewBox: "0 0 100 60"
        // Caller should recalculate from path bounds
      };
  }
  if (i) {
    const e = ln(i);
    if (e) return e;
    if (i.trim().startsWith("M") || i.trim().startsWith("m"))
      return {
        path: i,
        defaultWidth: 100,
        defaultHeight: 60,
        viewBox: "0 0 100 60"
        // caller recalculates from path bounds
      };
  }
}
const va = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getShape: ln,
  getShapeNames: wa,
  hasShape: ya,
  isNativeShape: Vi,
  registerShape: ba,
  resolveShapePath: qi
}, Symbol.toStringTag, { value: "Module" }));
function qt(i) {
  const t = { ...i };
  return i.xPos !== void 0 && t.x === void 0 && (t.x = i.xPos, delete t.xPos), i.yPos !== void 0 && t.y === void 0 && (t.y = i.yPos, delete t.yPos), i.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = i.foregroundColor, delete t.foregroundColor), i.shapeHint !== void 0 && t.shape === void 0 && (t.shape = xa(i.shapeHint), delete t.shapeHint), i.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = i.svgString, delete t.svgString), i.blnStraight !== void 0 && (t.isStraightLine = i.blnStraight, delete t.blnStraight), t;
}
function bt(i) {
  const t = { ...i };
  return t.xPos = i.x, t.yPos = i.y, t.foregroundColor = i.fontColor, i.shape && (t.shapeHint = i.shape), i.svgContent && (t.svgString = i.svgContent), t;
}
function kn(i) {
  const t = { ...i };
  return i.showbirdsEye !== void 0 && (t.birdsEye = {
    enabled: !!i.showbirdsEye,
    // Top-right by default so it doesn't collide with the host's bottom
    // chat/huddle panel (slatebox docks those bottom-right).
    position: "top-right",
    ...i.sizeOfbirdsEye ? { width: i.sizeOfbirdsEye, height: i.sizeOfbirdsEye } : {},
    ...i.birdsEye || {}
  }), t;
}
function Ki(i) {
  return { ...i };
}
function An(i) {
  return {
    id: i.id || `${i.parentId}->${i.childId}`,
    childId: i.childId,
    parentId: i.parentId,
    isStraightLine: i.isStraightLine ?? i.blnStraight ?? !1,
    lineColor: i.lineColor || "#000",
    lineEffect: i.lineEffect || "",
    lineOpacity: i.lineOpacity ?? 1,
    lineType: i.lineType || "bezier",
    lineCurveType: i.lineCurveType || "cubic",
    lineCurviness: i.lineCurviness ?? 0.1,
    lineWidth: i.lineWidth ?? 6,
    showParentArrow: i.showParentArrow ?? !1,
    showChildArrow: i.showChildArrow ?? !0,
    sourcePoint: i.sourcePoint ?? null,
    targetPoint: i.targetPoint ?? null,
    sourceAnchor: i.sourceAnchor ?? null,
    targetAnchor: i.targetAnchor ?? null
  };
}
function Rn(i) {
  return {
    childId: i.childId,
    parentId: i.parentId,
    isStraightLine: i.isStraightLine,
    lineColor: i.lineColor,
    lineEffect: i.lineEffect,
    lineOpacity: i.lineOpacity,
    lineType: i.lineType,
    lineCurveType: i.lineCurveType,
    lineCurviness: i.lineCurviness,
    lineWidth: i.lineWidth,
    showParentArrow: i.showParentArrow,
    showChildArrow: i.showChildArrow,
    sourcePoint: i.sourcePoint ?? null,
    targetPoint: i.targetPoint ?? null,
    sourceAnchor: i.sourceAnchor ?? null,
    targetAnchor: i.targetAnchor ?? null
  };
}
function xa(i) {
  return {
    rect: "rectangle",
    rectangle: "rectangle",
    roundedrectangle: "roundedrectangle",
    ellipse: "ellipse",
    circle: "circle",
    star: "star",
    trapezium: "trapezium",
    triangle: "triangle",
    pentagon: "pentagon",
    parallelogram: "parallelogram",
    octagon: "octagon",
    hexagon: "hexagon",
    rarrow: "rarrow",
    larrow: "larrow"
  }[i.toLowerCase()] || i;
}
function _a(i) {
  const t = {
    options: kn(i.options || {}),
    nodes: [],
    shareId: i.shareId || ""
  };
  return Array.isArray(i.nodes) && (t.nodes = i.nodes.map((e) => {
    const n = qt(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => An(o)
    )), {
      options: n,
      relationships: s
    };
  })), t;
}
function Ca(i) {
  const t = {
    options: Ki(i.options || {}),
    nodes: [],
    shareId: i.shareId || ""
  };
  return Array.isArray(i.nodes) && (t.nodes = i.nodes.map((e) => {
    const n = bt(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => Rn(o)
    )), {
      options: n,
      relationships: s
    };
  })), t;
}
const Ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  convertV1JsonToV2: _a,
  convertV2JsonToV1: Ca,
  v1AssociationToV2: An,
  v1NodeToV2: qt,
  v1SlateToV2: kn,
  v2AssociationToV1: Rn,
  v2NodeToV1: bt,
  v2SlateToV1: Ki
}, Symbol.toStringTag, { value: "Module" })), Tt = `	
\v\f\r   ᠎             　\u2028\u2029`, Sa = new RegExp(
  `([a-z])[${Tt},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${Tt}]*,?[${Tt}]*)+)`,
  "ig"
), Qi = new RegExp(
  `(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${Tt}]*,?[${Tt}]*`,
  "ig"
), Ma = new RegExp(
  `([rstm])[${Tt},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${Tt}]*,?[${Tt}]*)+)`,
  "ig"
);
function Ta(i) {
  if (!i) return [];
  if (Array.isArray(i)) return i;
  const t = {
    a: 7,
    c: 6,
    h: 1,
    l: 2,
    m: 2,
    r: 4,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    z: 0
  }, e = [];
  return String(i).replace(
    Sa,
    (n, s, o) => {
      const r = [];
      let a = s.toLowerCase();
      if (o.replace(Qi, (l, c) => (c && r.push(+c), "")), a === "m" && r.length > 2 && (e.push([s, ...r.splice(0, 2)]), a = "l", s = s === "m" ? "l" : "L"), a === "r")
        e.push([s, ...r]);
      else
        for (; r.length >= t[a] && (e.push([s, ...r.splice(0, t[a])]), !!t[a]); )
          ;
      return "";
    }
  ), e;
}
function ka(i) {
  const t = Ta(i);
  if (!t.length) return [["M", 0, 0]];
  const e = [];
  let n = 0, s = 0, o = 0, r = 0, a = 0;
  t[0][0] === "M" && (n = +t[0][1], s = +t[0][2], o = n, r = s, a++, e[0] = ["M", n, s]);
  for (let l = a; l < t.length; l++) {
    const c = [""], h = t[l];
    if (e.push(c), h[0] !== h[0].toUpperCase())
      switch (c[0] = h[0].toUpperCase(), c[0]) {
        case "A":
          c[1] = h[1], c[2] = h[2], c[3] = h[3], c[4] = h[4], c[5] = h[5], c[6] = +h[6] + n, c[7] = +h[7] + s;
          break;
        case "V":
          c[1] = +h[1] + s;
          break;
        case "H":
          c[1] = +h[1] + n;
          break;
        case "M":
          o = +h[1] + n, r = +h[2] + s, c[1] = o, c[2] = r;
          break;
        default:
          for (let d = 1; d < h.length; d++)
            c[d] = +h[d] + (d % 2 ? n : s);
      }
    else
      for (let d = 0; d < h.length; d++) c[d] = h[d];
    switch (c[0]) {
      case "Z":
        n = o, s = r;
        break;
      case "H":
        n = c[1];
        break;
      case "V":
        s = c[1];
        break;
      case "M":
        o = c[c.length - 2], r = c[c.length - 1], n = c[c.length - 2], s = c[c.length - 1];
        break;
      default:
        n = c[c.length - 2], s = c[c.length - 1];
    }
  }
  return e;
}
function we(i, t, e, n) {
  return [i, t, e, n, e, n];
}
function Kn(i, t, e, n, s, o) {
  const r = 0.3333333333333333, a = 2 / 3;
  return [
    r * i + a * e,
    r * t + a * n,
    r * s + a * e,
    r * o + a * n,
    s,
    o
  ];
}
function ve(i, t, e) {
  return { x: i * Math.cos(e) - t * Math.sin(e), y: i * Math.sin(e) + t * Math.cos(e) };
}
function Ji(i, t, e, n, s, o, r, a, l, c) {
  const h = Math.PI * 120 / 180, d = Math.PI / 180 * (+s || 0);
  let u = [], f, g = 0, p = 0, y = 0, m = 0;
  if (c)
    g = c[0], p = c[1], y = c[2], m = c[3];
  else {
    f = ve(i, t, -d), i = f.x, t = f.y, f = ve(a, l, -d), a = f.x, l = f.y;
    const G = (i - a) / 2, W = (t - l) / 2;
    let K = G * G / (e * e) + W * W / (n * n);
    K > 1 && (K = Math.sqrt(K), e = K * e, n = K * n);
    const tt = e * e, at = n * n, wt = (o === r ? -1 : 1) * Math.sqrt(Math.abs((tt * at - tt * W * W - at * G * G) / (tt * W * W + at * G * G)));
    y = wt * e * W / n + (i + a) / 2, m = wt * -n * G / e + (t + l) / 2, g = Math.asin(Number(((t - m) / n).toFixed(9))), p = Math.asin(Number(((l - m) / n).toFixed(9))), g = i < y ? Math.PI - g : g, p = a < y ? Math.PI - p : p, g < 0 && (g = Math.PI * 2 + g), p < 0 && (p = Math.PI * 2 + p), r && g > p && (g -= Math.PI * 2), !r && p > g && (p -= Math.PI * 2);
  }
  let b = p - g;
  if (Math.abs(b) > h) {
    const G = p, W = a, K = l;
    p = g + h * (r && p > g ? 1 : -1), a = y + e * Math.cos(p), l = m + n * Math.sin(p), u = Ji(a, l, e, n, s, 0, r, W, K, [p, G, y, m]);
  }
  b = p - g;
  const w = Math.cos(g), x = Math.sin(g), _ = Math.cos(p), v = Math.sin(p), C = Math.tan(b / 4), A = 4 / 3 * e * C, B = 4 / 3 * n * C, I = [i, t], T = [i + A * x, t - B * w], Z = [a + A * v, l - B * _], H = [a, l];
  if (T[0] = 2 * I[0] - T[0], T[1] = 2 * I[1] - T[1], c)
    return [T[0], T[1], Z[0], Z[1], H[0], H[1]].concat(u);
  u = [T[0], T[1], Z[0], Z[1], H[0], H[1]].concat(u);
  const q = [];
  for (let G = 0; G < u.length; G++)
    q[G] = G % 2 ? ve(u[G - 1], u[G], d).y : ve(u[G], u[G + 1], d).x;
  return q;
}
function ts(i) {
  const t = ka(i), e = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }, n = (l, c, h) => {
    if (!l) return ["C", c.x, c.y, c.x, c.y, c.x, c.y];
    switch (l[0] !== "T" && l[0] !== "Q" && (c.qx = null, c.qy = null), l[0]) {
      case "M":
        c.X = l[1], c.Y = l[2];
        break;
      case "A":
        return ["C", ...Ji(c.x, c.y, ...l.slice(1))];
      case "S": {
        let d, u;
        return h === "C" || h === "S" ? (d = c.x * 2 - c.bx, u = c.y * 2 - c.by) : (d = c.x, u = c.y), ["C", d, u, ...l.slice(1)];
      }
      case "T":
        return h === "Q" || h === "T" ? (c.qx = c.x * 2 - c.qx, c.qy = c.y * 2 - c.qy) : (c.qx = c.x, c.qy = c.y), ["C", ...Kn(c.x, c.y, c.qx, c.qy, l[1], l[2])];
      case "Q":
        return c.qx = l[1], c.qy = l[2], ["C", ...Kn(c.x, c.y, l[1], l[2], l[3], l[4])];
      case "L":
        return ["C", ...we(c.x, c.y, l[1], l[2])];
      case "H":
        return ["C", ...we(c.x, c.y, l[1], c.y)];
      case "V":
        return ["C", ...we(c.x, c.y, c.x, l[1])];
      case "Z":
        return ["C", ...we(c.x, c.y, c.X, c.Y)];
    }
    return l;
  }, s = (l, c, h) => {
    if (l[c].length > 7) {
      l[c].shift();
      const d = l[c];
      for (; d.length; )
        h[c] = "A", l.splice(c++, 0, ["C", ...d.splice(0, 6)]);
      l.splice(c, 1);
    }
  }, o = [];
  let r = "", a = "";
  for (let l = 0; l < t.length; l++) {
    r = "", t[l] && (r = t[l][0]), r !== "C" && (o[l] = r, l && (a = o[l - 1])), t[l] = n(t[l], e, a), o[l] !== "A" && r === "C" && (o[l] = "C"), s(t, l, o);
    const c = t[l], h = c.length;
    e.x = c[h - 2], e.y = c[h - 1], e.bx = parseFloat(c[h - 4]) || e.x, e.by = parseFloat(c[h - 3]) || e.y;
  }
  return t;
}
function Aa(i, t, e, n, s, o, r, a) {
  const l = (f, g, p, y, m) => {
    const b = 1 - f;
    return b * b * b * g + 3 * b * b * f * p + 3 * b * f * f * y + f * f * f * m;
  }, c = [i, r], h = [t, a], d = (f, g, p) => {
    const y = [];
    if (Math.abs(f) < 1e-12) {
      if (Math.abs(g) > 1e-12) {
        const m = -p / g;
        m > 0 && m < 1 && y.push(m);
      }
    } else {
      const m = g * g - 4 * f * p;
      if (m >= 0) {
        const b = Math.sqrt(m), w = (-g + b) / (2 * f), x = (-g - b) / (2 * f);
        w > 0 && w < 1 && y.push(w), x > 0 && x < 1 && y.push(x);
      }
    }
    return y;
  }, u = (f, g, p, y) => {
    const m = 3 * (y - 3 * p + 3 * g - f), b = 6 * (p - 2 * g + f), w = 3 * (g - f);
    return d(m, b, w);
  };
  return u(i, e, s, r).forEach((f) => c.push(l(f, i, e, s, r))), u(t, n, o, a).forEach((f) => h.push(l(f, t, n, o, a))), {
    min: { x: Math.min(...c), y: Math.min(...h) },
    max: { x: Math.max(...c), y: Math.max(...h) }
  };
}
function es(i) {
  const t = ts(i);
  if (!t.length)
    return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0, cx: 0, cy: 0 };
  let e = 0, n = 0;
  const s = [], o = [];
  for (const u of t)
    if (u[0] === "M")
      e = u[1], n = u[2], s.push(e), o.push(n);
    else {
      const f = Aa(e, n, ...u.slice(1));
      s.push(f.min.x, f.max.x), o.push(f.min.y, f.max.y), e = u[5], n = u[6];
    }
  const r = Math.min(...s), a = Math.min(...o), l = Math.max(...s), c = Math.max(...o), h = l - r, d = c - a;
  return {
    x: r,
    y: a,
    x2: l,
    y2: c,
    width: h,
    height: d,
    cx: r + h / 2,
    cy: a + d / 2
  };
}
class Qn {
  constructor(t, e, n, s, o, r) {
    this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, t != null && (this.a = +t, this.b = +e, this.c = +n, this.d = +s, this.e = +o, this.f = +r);
  }
  add(t, e, n, s, o, r) {
    const a = [
      [this.a, this.c, this.e],
      [this.b, this.d, this.f],
      [0, 0, 1]
    ], l = [
      [t, n, o],
      [e, s, r],
      [0, 0, 1]
    ], c = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let h = 0; h < 3; h++)
      for (let d = 0; d < 3; d++) {
        let u = 0;
        for (let f = 0; f < 3; f++)
          u += a[h][f] * l[f][d];
        c[h][d] = u;
      }
    this.a = c[0][0], this.b = c[1][0], this.c = c[0][1], this.d = c[1][1], this.e = c[0][2], this.f = c[1][2];
  }
  translate(t, e) {
    this.add(1, 0, 0, 1, t, e);
  }
  scale(t, e, n, s) {
    e == null && (e = t), (n || s) && this.add(1, 0, 0, 1, n || 0, s || 0), this.add(t, 0, 0, e, 0, 0), (n || s) && this.add(1, 0, 0, 1, -(n || 0), -(s || 0));
  }
  rotate(t, e, n) {
    t = t * Math.PI / 180, e = e || 0, n = n || 0;
    const s = +Math.cos(t).toFixed(9), o = +Math.sin(t).toFixed(9);
    this.add(s, o, -o, s, e, n), this.add(1, 0, 0, 1, -e, -n);
  }
  x(t, e) {
    return t * this.a + e * this.c + this.e;
  }
  y(t, e) {
    return t * this.b + e * this.d + this.f;
  }
}
function Ra(i) {
  if (!i) return [];
  if (Array.isArray(i)) return i;
  const t = [];
  return String(i).replace(Ma, (e, n, s) => {
    const o = [];
    return s.replace(Qi, (r, a) => (a && o.push(+a), "")), t.push([n, ...o]), "";
  }), t;
}
function Na(i, t) {
  const e = Ra(i), n = new Qn();
  for (const s of e) {
    const o = s.length, r = String(s[0]).toLowerCase(), a = s[0] !== r, l = a ? new Qn() : null;
    if (r === "t" && o === 3)
      if (a) {
        const c = l.x(0, 0), h = l.y(0, 0);
        n.translate(s[1] - c, s[2] - h);
      } else
        n.translate(s[1], s[2]);
    else if (r === "r") {
      if (o === 2)
        n.rotate(s[1], t.x + t.width / 2, t.y + t.height / 2);
      else if (o === 4)
        if (a) {
          const c = l.x(s[2], s[3]), h = l.y(s[2], s[3]);
          n.rotate(s[1], c, h);
        } else
          n.rotate(s[1], s[2], s[3]);
    } else if (r === "s") {
      if (o === 2 || o === 3)
        n.scale(s[1], s[o - 1], t.x + t.width / 2, t.y + t.height / 2);
      else if (o === 4)
        if (a) {
          const c = l.x(s[2], s[3]), h = l.y(s[2], s[3]);
          n.scale(s[1], s[1], c, h);
        } else
          n.scale(s[1], s[1], s[2], s[3]);
      else if (o === 5)
        if (a) {
          const c = l.x(s[3], s[4]), h = l.y(s[3], s[4]);
          n.scale(s[1], s[2], c, h);
        } else
          n.scale(s[1], s[2], s[3], s[4]);
    } else r === "m" && o === 7 && n.add(s[1], s[2], s[3], s[4], s[5], s[6]);
  }
  return n;
}
function Da(i, t) {
  if (!t || !i) return i;
  const e = [];
  for (let n = 0; n < i.length; n++) {
    const s = i[n], o = [s[0]];
    for (let r = 1; r < s.length; r += 2) {
      const a = t.x(s[r], s[r + 1]), l = t.y(s[r], s[r + 1]);
      o[r] = a, o[r + 1] = l;
    }
    e.push(o);
  }
  return e;
}
function Pa(i, t) {
  const e = ts(i), n = es(e), s = Na(t, n);
  return Da(e, s).map((o) => o[0] + o.slice(1).join(",")).join("");
}
function Zt(i = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let n = 0; n < i; n++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function ns(i) {
  function t(a) {
    return parseInt(a, 16) || 0;
  }
  function e(a) {
    const l = t(a) / 255;
    return l <= 0.03928 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4);
  }
  function n(a) {
    return 0.2126 * e(a.substr(1, 2)) + 0.7152 * e(a.substr(3, 2)) + 0.0722 * e(a.substr(-2));
  }
  function s(a, l) {
    const c = n(a), h = n(l);
    return (Math.max(c, h) + 0.05) / (Math.min(c, h) + 0.05);
  }
  const o = s(i || "#fff", "#ffffff"), r = s(i || "#fff", "#000000");
  return o > r ? "#ffffff" : "#000000";
}
function Ia(i, t = "normal 10pt Arial") {
  const e = String(i).split(`
`), n = t.split(" "), s = "normal", o = n?.[0]?.includes("pt") ? parseFloat(n?.[0]?.replace(/pt/gi, "")) : 10, r = n?.slice(1).join(" ").trim();
  if (typeof document > "u")
    return {
      width: Math.max(...e.map((d) => d.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  const a = document.createElement("canvas"), l = [], c = 0.98;
  if (e.forEach((d) => {
    const u = a.getContext("2d");
    if (!u) return;
    const f = o * c;
    u.font = `${s} ${f}pt ${r}`, l.push(u.measureText(d));
  }), a.remove(), l.length === 0)
    return {
      width: Math.max(...e.map((d) => d.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  let h = 0;
  return l.forEach((d) => {
    h += (d.actualBoundingBoxAscent || o) + (d.actualBoundingBoxDescent || o * 0.3) + 5;
  }), {
    width: Math.max(...l.map((d) => d.width)),
    height: h + 10
  };
}
function is(i, t) {
  const e = (o) => {
    const r = (o || "").replace("#", "");
    if (r.length < 6) return 0;
    const a = (d) => {
      const u = d / 255;
      return u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
    }, l = a(parseInt(r.substr(0, 2), 16) || 0), c = a(parseInt(r.substr(2, 2), 16) || 0), h = a(parseInt(r.substr(4, 2), 16) || 0);
    return 0.2126 * l + 0.7152 * c + 0.0722 * h;
  }, n = e(i), s = e(t);
  return (Math.max(n, s) + 0.05) / (Math.min(n, s) + 0.05);
}
function Oa(i) {
  return i?.path ? es(i.path) : { x: 0, y: 0, x2: 100, y2: 100, width: 100, height: 100, cx: 50, cy: 50 };
}
function za(i, t) {
  return Pa(i, t);
}
function La(i, t) {
  const e = String(i).split(/ /g), s = String(i).split("").length / t, o = [];
  let r = [], a = 0;
  return e.forEach((l) => {
    a += l.length, a < s || o.length === t - 1 ? r.push(l) : (o.push(r.join(" ")), a = l.length, r = [l]);
  }), r.length > 0 && o.push(r.join(" ")), o.join(`
`);
}
function Ba(i, t) {
  return Math.floor(Math.random() * (t - i + 1)) + i;
}
function Ga(i, t, e, n, s = !0) {
  if (!s)
    return { width: e, height: n };
  const o = Math.min(
    e / i,
    n / t
  );
  return {
    width: i * o,
    height: t * o
  };
}
function Ha(i) {
  const { buildNodeStyleFromTheme: t } = require("./core/Theme");
  return t(i.theme, i.childNumber);
}
function Ua(i) {
  return i.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
}
function Fa(i) {
  return i instanceof HTMLElement || i instanceof SVGElement;
}
function Za(i) {
  return typeof document > "u" ? null : document.getElementById(i);
}
function Ya() {
  return typeof navigator > "u" ? !1 : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function Xa() {
  return typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function $a(i) {
  i && (i.preventDefault(), i.stopPropagation());
}
function Wa(i, t) {
  const e = [];
  for (let n = 0; n < i.length; n += t)
    e.push(i.slice(n, n + t));
  return e;
}
const ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _transformPath: za,
  buildNodeStyleFromTheme: Ha,
  chunk: Wa,
  contrastRatio: is,
  createMultiLineText: La,
  el: Za,
  getBBox: Oa,
  getTextWidth: Ia,
  guid: Zt,
  isElement: Fa,
  isMobile: Xa,
  isSafari: Ya,
  obtainProportionateWidthAndHeightForResizing: Ga,
  randomInt: Ba,
  safeForUrls: Ua,
  stopEvent: $a,
  whiteOrBlack: ns
}, Symbol.toStringTag, { value: "Module" }));
function Va(i, t, e = 8) {
  const { x: n, y: s, width: o, height: r } = i, a = [n, n + o / 2, n + o], l = [s, s + r / 2, s + r];
  let c = n, h = s, d = e, u = e;
  for (const f of t) {
    const g = [f.x, f.x + f.width / 2, f.x + f.width], p = [f.y, f.y + f.height / 2, f.y + f.height];
    for (const y of a)
      for (const m of g) {
        const b = Math.abs(y - m);
        b < d && (d = b, c = n + (m - y));
      }
    for (const y of l)
      for (const m of p) {
        const b = Math.abs(y - m);
        b < u && (u = b, h = s + (m - y));
      }
  }
  return { x: c, y: h };
}
class Oe {
  /**
   * Creates a new diagram node.
   *
   * Nodes support two mutually exclusive content types: text content (default)
   * and SVG content (when `options.svgContent` is set). The node is created
   * asynchronously — await `node.ready` before using sub-modules.
   *
   * @param options - Node configuration (position, size, shape, text, colors, etc.)
   * @param slate  - The parent Slate instance
   *
   * @example
   * ```ts
   * const node = slate.addNode({
   *   x: 100, y: 100, width: 120, height: 80,
   *   text: 'Hello', shape: 'rectangle', backgroundColor: '#4ecdc4'
   * });
   * await node.ready;
   * node.setRotation(45);
   * ```
   */
  constructor(t, e) {
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this._connHandleHideTimer = null, this._connHandlesPinned = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this._groupDragSiblings = [], this._lastClickTime = 0, this._initFailed = !1, this._destroyed = !1, this._svgViewboxTimeoutId = null, this._dragEndTimeoutId = null, this._previewViewboxTimeoutId = null, this._connectTimeoutId = null, this.id = t.id || this.generateId(), this.slate = e, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: t }), this.options = {
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      text: "Node",
      fontSize: 14,
      fontFamily: "Arial, sans-serif",
      fontColor: "#000000",
      textOpacity: 1,
      textXAlign: "center",
      textYAlign: "middle",
      backgroundColor: "#f0f0f0",
      borderColor: "#cccccc",
      borderWidth: 1,
      allowDrag: !0,
      isLocked: !1,
      shape: "rectangle",
      // v1 UI-affordance defaults — host apps gate their node UI (drawer
      // tabs, delete/add buttons, relationship controls) on these flags
      showDelete: !0,
      showResize: !0,
      showAdd: !0,
      showRotate: !0,
      showMenu: !0,
      showColorTab: !0,
      showTextTab: !0,
      showAITab: !0,
      showShapeTab: !0,
      showImageTab: !0,
      showEffectTab: !0,
      showRelationshipConnector: !0,
      showRelationshipDelete: !0,
      showRelationshipProperties: !0,
      showRelationshipReassign: !0,
      allowMenu: !0,
      allowContext: !0,
      rotate: {
        rotationAngle: 0
      },
      textOffset: {
        x: 0,
        y: 0
      },
      resizeRotate: {
        resizeEnabled: !0,
        rotateEnabled: !0,
        preserveAspectRatio: !1,
        aroundCenter: !1,
        grid: 0,
        degree: 0
      },
      ...t
    }, this.ready = new Promise((n, s) => {
      this._resolveReady = n, this._rejectReady = s;
    }), console.log("NODE_DEBUG: Calling createAsync for", this.id), this.createAsync();
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }
  async createAsync() {
    console.log("NODE_DEBUG: createAsync started for", this.id);
    try {
      const t = await this.slate.getViewportAsync();
      console.log("NODE_DEBUG: Got viewport for", this.id, t), this.svgGroup = t.group(), this.svgGroup.attr("data-node-id", this.id), this.svgGroup.node.setAttribute("tabindex", "0"), this.svgGroup.node.setAttribute("role", "button"), this.svgGroup.node.style && (this.svgGroup.node.style.cursor = "move"), this.wireConnectionHandleHover(), console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup), this.finishCreate();
    } catch (t) {
      console.error("NODE_DEBUG: Error in createAsync for", this.id, t), this._initFailed = !0, this._rejectReady(t);
    }
  }
  finishCreate() {
    console.log("NODE_DEBUG: finishCreate started for", this.id);
    const t = !!this.options.svgContent;
    if (console.log("NODE_DEBUG: hasSvg =", t, "for", this.id), t && (this.options.backgroundColor = "none", this.options.borderWidth = 0, console.log("NODE_DEBUG: Updated options for SVG content", this.id)), console.log("NODE_DEBUG: About to call createBackground for", this.id), this.createBackground(), t ? console.log("NODE_DEBUG: Skipping createText (SVG content) for", this.id) : (console.log("NODE_DEBUG: About to call createText for", this.id), this.createText()), console.log(
      "NODE_DEBUG: About to position node",
      this.id,
      "at",
      this.options.x,
      this.options.y
    ), this.position(this.options.x, this.options.y), this.options.svgContent) {
      const n = this.options.width, s = this.options.height, o = this.backgroundRect.x?.() ?? 0, r = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(n, s).move(o, r), this.nestedSvg.svg(this.options.svgContent), this._svgViewboxTimeoutId = setTimeout(() => {
        if (this._destroyed || !this.nestedSvg) return;
        const a = this.nestedSvg.children()[0];
        if (a) {
          let l = a.bbox();
          console.log("NODE_DEBUG: Delayed bbox:", l, "Node size:", n, s), (l.width <= 0 || l.height <= 0) && (l = this.calculatePathBounds(this.options.svgContent, n, s), console.log("NODE_DEBUG: Calculated bounds:", l)), l.width > 0 && l.height > 0 ? (this.nestedSvg.viewbox(l.x, l.y, l.width, l.height), this.nestedSvg.node.setAttribute(
            "preserveAspectRatio",
            "xMidYMid meet"
          ), console.log(
            `NODE_DEBUG: Set viewbox(${l.x}, ${l.y}, ${l.width}, ${l.height}) with preserveAspectRatio="xMidYMid meet"`
          )) : (console.log("NODE_DEBUG: Invalid bounds, trying default viewbox approach"), this.nestedSvg.viewbox(0, 0, 24, 24), this.nestedSvg.node.setAttribute(
            "preserveAspectRatio",
            "xMidYMid meet"
          ));
        }
      }, 10);
    }
    const e = { ...this.options.resizeRotate };
    this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new Hi(this, e), this.connector = new Ie(this, this.options.connector), this.relationships = new Ui(this), this.images = new Fi(this), this.editor = new Yi(this), this.links = new Xi(this), this.filters = new $i(this), this.menu = new ji(this), this.options.image && this.images.set(
      this.options.image,
      this.options.imageOrigWidth,
      this.options.imageOrigHeight
    ), this.options.filters?.vect && this.filters.apply(this.options.filters.vect, "vect"), this.options.filters?.text && this.filters.apply(this.options.filters.text, "text"), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), this.options.rotate?.rotationAngle && this.applyPositionAndRotation(), console.log("NODE_DEBUG: finishCreate continuing for", this.id), this.svgGroup.node.setAttribute("aria-label", this.options.text || "Unnamed node");
    try {
      this.slate.markersContainer?.front?.();
    } catch {
    }
    this.updateLinkIndicator(), this._resolveReady();
  }
  updateLinkIndicator() {
    try {
      this._linkBadge && (this._linkBadge.remove(), this._linkBadge = void 0);
      const t = this.options.link;
      if (!t?.show || !t.data) return;
      const e = this.options.width || 0, n = this.options.height || 0, s = 11;
      let o = e - s - 3, r = s + 3;
      const a = this.options.shape;
      this.contentPath || this.nestedSvg ? (o = e * 0.72, r = n * 0.28) : (a === "circle" || a === "ellipse") && (o = e * 0.85, r = n * 0.15);
      const l = this.svgGroup.group();
      l.node.setAttribute("class", "node-link-badge"), l.node.setAttribute("style", "cursor:pointer"), l.circle(s * 2).move(o - s, r - s).fill("#2d6cdf").stroke({ color: "#fff", width: 1.5 });
      const h = document.createElementNS("http://www.w3.org/2000/svg", "text");
      h.setAttribute("x", String(o)), h.setAttribute("y", String(r)), h.setAttribute("text-anchor", "middle"), h.setAttribute("dominant-baseline", "central"), h.setAttribute("font-family", "sans-serif"), h.setAttribute("font-size", "15"), h.setAttribute("font-weight", "bold"), h.setAttribute("fill", "#fff"), h.setAttribute("pointer-events", "none"), h.textContent = "↗", l.node.appendChild(h), l.on("click", (d) => {
        d.stopPropagation(), d.preventDefault?.(), this.links?.navigate();
      }), this._linkBadge = l;
    } catch {
    }
  }
  createBackground() {
    console.log(
      "NODE_DEBUG: createBackground called for",
      this.id,
      "shape:",
      this.options.shape
    );
    const {
      width: t,
      height: e,
      backgroundColor: n,
      borderColor: s,
      borderWidth: o,
      borderStyle: r,
      borderOpacity: a,
      shape: l,
      vectorPath: c,
      opacity: h
    } = this.options, d = { color: s, width: o }, u = this.borderDashArray();
    u !== "none" && (d.dasharray = u), a !== void 0 && (d.opacity = a);
    const f = qi(l, c);
    if (f && !Vi(l || "")) {
      const g = this.svgGroup.nested().size(t, e), p = g.path(f.path).fill(n).stroke(d);
      try {
        const y = p.bbox();
        y.width > 0 && y.height > 0 ? g.viewbox(y.x, y.y, y.width, y.height) : g.viewbox(f.viewBox);
      } catch {
        g.viewbox(f.viewBox);
      }
      h !== void 0 && p.opacity(h), this.backgroundRect = g, this.contentPath = p;
      try {
        p.node.setAttribute("data-shape-path", "1");
      } catch {
      }
    } else {
      switch (this.contentPath = void 0, l) {
        case "circle": {
          const g = Math.min(t, e) / 2;
          this.backgroundRect = this.svgGroup.circle(g * 2).fill(n).stroke(d);
          break;
        }
        case "ellipse":
          this.backgroundRect = this.svgGroup.ellipse(t, e).fill(n).stroke(d);
          break;
        default:
          this.backgroundRect = this.svgGroup.rect(t, e).fill(n).stroke(d).radius(4);
          break;
      }
      h !== void 0 && this.backgroundRect.opacity(h);
    }
    n && String(n).includes("-") && this.applyShapeFill(this.contentPath ?? this.backgroundRect, n), console.log(
      "NODE_DEBUG: createBackground completed for",
      this.id,
      "backgroundRect:",
      this.backgroundRect
    );
  }
  /**
   * Change the node's shape at runtime (U5). `shape` may be a named shape or a
   * raw SVG path string. Removes the old shape element, re-renders the new one
   * behind the text/content, and re-binds selection so resize/rotate follow the
   * new shape. No-op for SVG-content nodes.
   */
  setShape(t, e) {
    if (!this.svgGroup || this.nestedSvg) return;
    const n = !!this.resizeRotate && this.resizeRotate.isEnabled();
    try {
      n && this.resizeRotate.disable();
    } catch {
    }
    try {
      this.backgroundRect?.remove?.();
    } catch {
    }
    this.backgroundRect = void 0, this.options.shape = t, this.options.vectorPath = e, this.createBackground();
    try {
      this.backgroundRect?.back?.();
    } catch {
    }
    try {
      this.centerText();
    } catch {
    }
    this.applyPositionAndRotation();
    try {
      n && this.slate?.updateSelectionResizeRotate?.();
    } catch {
    }
  }
  createText() {
    console.log("NODE_DEBUG: createText called for", this.id);
    const { text: t, fontSize: e, fontFamily: n, fontColor: s, textOpacity: o } = this.options;
    this.textElement = this.svgGroup.text(this.wrapTextToWidth(t)).font({
      family: n,
      size: e,
      fill: s,
      opacity: o
    }), this.textElement.attr({
      "text-anchor": "middle",
      "dominant-baseline": "central"
    }), console.log(
      "NODE_DEBUG: createText completed for",
      this.id,
      "textElement:",
      this.textElement
    ), this.centerText(), this.fitHeightToText();
  }
  /**
   * Apply the node's fill opacity (options.opacity) to the shape element. Mirrors
   * what createBackground does on load, for the edit path (color pane opacity
   * slider), which otherwise only updated options.
   */
  applyOpacity() {
    const t = this.contentPath ?? this.backgroundRect;
    t?.opacity && this.options.opacity !== void 0 && t.opacity(this.options.opacity);
  }
  /**
   * Re-apply font (size / family / color / opacity) from options to the text
   * element and re-center for alignment. The text pane sends font changes via
   * onNodeTextChanged; without this they only updated options, never the render.
   */
  applyTextStyle() {
    if (!this.textElement) return;
    const { fontSize: t, fontFamily: e, fontColor: n, textOpacity: s } = this.options;
    this.textElement.font({
      family: e,
      size: t,
      fill: n,
      opacity: s
    }), this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText();
  }
  /**
   * "Snap to neighbors" (Miro smart-align): nudge (x, y) so one of this node's
   * edges or center lines up with a nearby node's matching edge/center. Gated by
   * the caller on viewPort.snapToObjects.
   */
  snapToNeighbors(t, e) {
    const n = {
      x: t,
      y: e,
      width: this.options.width || 0,
      height: this.options.height || 0
    }, s = this.slate.nodes.allNodes.filter((o) => o !== this).map((o) => ({
      x: o.options.x || 0,
      y: o.options.y || 0,
      width: o.options.width || 0,
      height: o.options.height || 0
    }));
    return Va(n, s);
  }
  /**
   * Word-wrap `text` to the node's inner width, returning it with newlines
   * inserted at break points (SVG.js renders one tspan per line). Explicit
   * newlines are preserved; a single word longer than the width stays on its own
   * line rather than being split mid-word. Falls back to a character estimate
   * when canvas measurement isn't available.
   */
  wrapTextToWidth(t) {
    if (!t) return t;
    const e = Math.max(24, (this.options.width || 100) - 14), n = this.options.fontSize || 14, s = this.options.fontFamily || "sans-serif";
    let o = null;
    try {
      o = (this._measureCanvas || (this._measureCanvas = document.createElement("canvas"))).getContext("2d"), o && (o.font = `${n}px ${s}`);
    } catch {
      o = null;
    }
    const r = (l) => o ? o.measureText(l).width : l.length * n * 0.55, a = [];
    for (const l of String(t).split(`
`)) {
      const c = l.split(/\s+/).filter(Boolean);
      if (!c.length) {
        a.push("");
        continue;
      }
      let h = "";
      for (const d of c) {
        if (r(d) > e) {
          h && (a.push(h), h = "");
          let f = "";
          for (const g of d)
            f && r(f + g) > e ? (a.push(f), f = g) : f += g;
          h = f;
          continue;
        }
        const u = h ? `${h} ${d}` : d;
        h && r(u) > e ? (a.push(h), h = d) : h = u;
      }
      h && a.push(h);
    }
    return a.join(`
`);
  }
  /**
   * Grow the node's height so wrapped text fits inside it (Miro-style: nodes
   * grow to fit typed content). Only ever grows — never shrinks — to avoid
   * jumpiness when text is removed. Derived from the text, so it's re-applied on
   * load without needing to be persisted separately. No-op in headless tests
   * where getBBox is unavailable.
   */
  fitHeightToText() {
    if (!this.textElement || this.nestedSvg) return;
    let t = 0;
    try {
      t = this.textElement.node.getBBox?.()?.height || 0;
    } catch {
      return;
    }
    if (!t) return;
    const e = Math.ceil(t) + 14;
    e > (this.options.height || 0) + 1 && this.setSize(this.options.width || 100, e);
  }
  /** Position the text element within the background shape based on alignment settings. */
  centerText() {
    if (!this.textElement) return;
    const { width: t, height: e, textXAlign: n, textYAlign: s, textOffset: o } = this.options, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0;
    let l = r + t / 2 + (o?.x || 0), c = a + e / 2 + (o?.y || 0);
    switch (n) {
      case "left":
        l = r + 5 + (o?.x || 0), this.textElement.attr("text-anchor", "start");
        break;
      case "right":
        l = r + t - 5 + (o?.x || 0), this.textElement.attr("text-anchor", "end");
        break;
      default:
        this.textElement.attr("text-anchor", "middle");
        break;
    }
    switch (s) {
      case "top":
        c = a + 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "hanging");
        break;
      case "bottom":
        c = a + e - 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "auto");
        break;
      default:
        this.textElement.attr("dominant-baseline", "central");
        break;
    }
    const h = this.textElement.node.querySelectorAll?.("tspan")?.length || 1;
    if (h > 1 && s !== "top" && s !== "bottom") {
      const d = (this.options.fontSize || 14) * 1.3;
      c -= (h - 1) * d / 2;
    }
    this.textElement.attr({ x: l, y: c });
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("dragstart.node", (t) => {
      console.log("DRAG_DEBUG: Drag started on", this.id), this.toFront(!1);
      const e = this.slate.getSelectedNodes().includes(this), n = t.detail?.event || t, s = n?.ctrlKey || n?.metaKey || n?.shiftKey;
      e ? console.log(
        "SELECTION_DEBUG: Drag started on already selected node",
        this.id
      ) : (console.log(
        "SELECTION_DEBUG: Drag started on unselected node",
        this.id,
        "- selecting it, addToSelection:",
        s
      ), this.slate.selectNodes([this], s)), this.isDragging = !0, this.wasSelectedBeforeDrag = !0, this.hideConnectionHandles(), this.slate.getSelectedNodes?.().forEach((r) => {
        r !== this && r.hideConnectionHandles?.();
      });
      const o = this.svgGroup.transform();
      this.preDragTransform = {
        translateX: o.translateX || 0,
        translateY: o.translateY || 0
      }, this.preDragPosition = {
        x: this.options.x ?? 0,
        y: this.options.y ?? 0
      }, this._dragStartPointer = this.pointerFromDragEvent(t), this._groupDragSiblings = [];
      try {
        const r = this.slate.getSelectedNodes?.() || [];
        if (r.length > 1 && r.includes(this))
          for (const a of r)
            a !== this && this._groupDragSiblings.push({
              node: a,
              x: a.options.x ?? 0,
              y: a.options.y ?? 0
            });
      } catch {
      }
      console.log("DRAG_DEBUG: Stored pre-drag transform:", this.preDragTransform, "position:", this.preDragPosition), this.slate.disableNodeResizeRotate(this), this.hideNodeCog();
    }), this.svgGroup.on("dragend.node", (t) => {
      console.log("DRAG_DEBUG: Drag ended on", this.id);
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        const d = this.slate.getZoom?.() || 1, u = (e.x - this._dragStartPointer.x) / d, f = (e.y - this._dragStartPointer.y) / d;
        this.options.x = this.preDragPosition.x + u, this.options.y = this.preDragPosition.y + f;
        let g = u, p = f;
        const y = this.slate.grid?.snapPoint?.(
          this.options.x,
          this.options.y
        );
        if (y && (this.options.x = y.x, this.options.y = y.y, g = y.x - this.preDragPosition.x, p = y.y - this.preDragPosition.y), this.slate.options.viewPort?.snapToObjects) {
          const m = this.snapToNeighbors(this.options.x, this.options.y);
          this.options.x = m.x, this.options.y = m.y, g = this.options.x - this.preDragPosition.x, p = this.options.y - this.preDragPosition.y;
        }
        for (const m of this._groupDragSiblings)
          m.node.options.x = m.x + g, m.node.options.y = m.y + p, m.node.applyPositionAndRotation();
      }
      const n = this._groupDragSiblings;
      this._groupDragSiblings = [];
      const s = this.preDragPosition, o = 0.5, r = this.options.x ?? 0, a = this.options.y ?? 0, l = !s || Math.abs(r - s.x) > o || Math.abs(a - s.y) > o, c = n.some(
        (d) => Math.abs((d.node.options.x ?? 0) - d.x) > o || Math.abs((d.node.options.y ?? 0) - d.y) > o
      ), h = l || c;
      this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this.applyPositionAndRotation(), h && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [
          bt(this.options),
          ...n.map((d) => bt(d.node.options))
        ]
      }), this._dragEndTimeoutId = setTimeout(() => {
        if (this._destroyed) return;
        this.isDragging = !1, this.slate.getSelectedNodes().includes(this) ? (console.log(
          "SELECTION_DEBUG: Drag ended on selected node",
          this.id,
          "- re-enabling resize/rotate"
        ), this.slate.updateSelectionResizeRotate()) : (console.log(
          "SELECTION_DEBUG: Drag ended on unselected node",
          this.id,
          "- selecting it"
        ), this.slate.selectNodes([this], !1)), this.slate.notifyNodeChanged(this), this._connHandlesPinned && this.showConnectionHandles();
      }, 10);
    }), this.svgGroup.on("dragmove.node", (t) => {
      this.isDragging = !0;
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        t.preventDefault?.();
        const n = this.slate.getZoom?.() || 1, s = (e.x - this._dragStartPointer.x) / n, o = (e.y - this._dragStartPointer.y) / n;
        this.options.x = this.preDragPosition.x + s, this.options.y = this.preDragPosition.y + o;
        let r = s, a = o;
        const l = this.slate.grid?.snapPoint?.(
          this.options.x,
          this.options.y
        );
        if (l && (this.options.x = l.x, this.options.y = l.y, r = l.x - this.preDragPosition.x, a = l.y - this.preDragPosition.y), this.slate.options.viewPort?.snapToObjects) {
          const c = this.snapToNeighbors(this.options.x, this.options.y);
          this.options.x = c.x, this.options.y = c.y, r = this.options.x - this.preDragPosition.x, a = this.options.y - this.preDragPosition.y;
        }
        this.applyPositionAndRotation();
        for (const c of this._groupDragSiblings)
          c.node.options.x = c.x + r, c.node.options.y = c.y + a, c.node.applyPositionAndRotation();
        try {
          this.slate.markersContainer?.front?.();
        } catch {
        }
      }
    });
  }
  /**
   * Extract the pointer position in client coordinates from an svg.draggable
   * event (or a raw DOM event). svg.draggable exposes the source event at
   * event.detail.event; touch events carry it under touches/changedTouches.
   */
  pointerFromDragEvent(t) {
    const e = t?.detail?.event ?? t;
    if (!e) return null;
    const n = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    return typeof n.clientX == "number" && typeof n.clientY == "number" ? { x: n.clientX, y: n.clientY } : null;
  }
  position(t, e, n, s, o) {
    console.log(
      "NODE_DEBUG: position called for",
      this.id,
      "x:",
      t,
      "y:",
      e,
      "duration:",
      o
    );
    const r = this.options.x ?? t, a = this.options.y ?? e;
    if (this.options.x = t, this.options.y = e, !!o && o > 0 && typeof requestAnimationFrame < "u" && typeof performance < "u" && (r !== t || a !== e)) {
      const c = performance.now(), h = () => {
        if (this._destroyed || !this.svgGroup) return;
        const d = Math.min(1, (performance.now() - c) / o), u = d < 0.5 ? 2 * d * d : 1 - Math.pow(-2 * d + 2, 2) / 2;
        this.options.x = r + (t - r) * u, this.options.y = a + (e - a) * u, this.applyPositionAndRotation(), d < 1 ? requestAnimationFrame(h) : (this.options.x = t, this.options.y = e, this.applyPositionAndRotation(), n && n());
      };
      requestAnimationFrame(h);
    } else
      this.applyPositionAndRotation(), n && n();
  }
  /** Bring the node to the front of the SVG z-order. */
  /**
   * Raise this node to the top of the SVG z-order. When `persist` is true
   * (deliberate "bring to front"), it broadcasts + records an undo step. Pass
   * false for the transient raise on pointer-down/drag-start so a plain click
   * doesn't persist a z-order change or pollute the undo stack.
   */
  toFront(t = !0) {
    this.svgGroup.front(), t && this.slate.broadcast?.("onNodeToFront", { id: this.id });
  }
  /** Send the node to the back of the SVG z-order. */
  toBack(t = !0) {
    this.svgGroup.back(), t && this.slate.broadcast?.("onNodeToBack", { id: this.id });
  }
  /**
   * Comment-count badge (Miro-style): a small count bubble at the node's
   * top-right corner. NON-destructive — it lives in the node's SVG group (so it
   * tracks pan/zoom/position/rotation for free) and never touches the node's text
   * or fill. `resolved` picks the color (green = resolved, red = unresolved,
   * grey = unknown/empty). Pass count <= 0 (or call clearCommentBadge) to remove.
   */
  setCommentBadge(t, e = "unresolved") {
    if (this.clearCommentBadge(), !t || t < 0 || !this.svgGroup) return;
    const n = this.options.width || 100, s = this.options.height || 100, o = 11;
    let r = n - 2, a = 2;
    const l = this.options.shape;
    this.contentPath || this.nestedSvg ? (r = n * 0.72, a = s * 0.28) : (l === "circle" || l === "ellipse") && (r = n * 0.85, a = s * 0.15);
    const c = e === "resolved" ? "#2e7d32" : e === "empty" ? "#6b7280" : "#e5484d", h = this.svgGroup.group().addClass("comment-badge");
    h.circle(o * 2).center(r, a).fill(c).stroke({
      color: "#ffffff",
      width: 1.5
    });
    const d = t > 99 ? "99+" : String(t);
    h.text(d).font({
      size: 12,
      anchor: "middle",
      family: "sans-serif",
      weight: "bold"
    }).fill("#ffffff").center(r, a).attr("dy", "0.05em"), h.attr("pointer-events", "none"), this._commentBadge = h, this._commentBadgeState = { count: t, kind: e };
  }
  /** Remove the comment-count badge if present. */
  clearCommentBadge() {
    const t = this._commentBadge;
    if (t) {
      try {
        t.remove();
      } catch {
      }
      this._commentBadge = void 0;
    }
    this._commentBadgeState = void 0;
  }
  /**
   * Remove the node from the canvas (light teardown).
   * Cleans up DOM elements but does NOT disable sub-modules. Use `destroy()` for full teardown.
   */
  remove() {
    this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.svgGroup.remove();
  }
  /**
   * Destroy the node completely, cleaning up all timers, event handlers,
   * and owned sub-modules. Pattern matches PanZoom.ts.
   */
  destroy() {
    this._destroyed = !0, this._svgViewboxTimeoutId !== null && (clearTimeout(this._svgViewboxTimeoutId), this._svgViewboxTimeoutId = null), this._dragEndTimeoutId !== null && (clearTimeout(this._dragEndTimeoutId), this._dragEndTimeoutId = null), this._previewViewboxTimeoutId !== null && (clearTimeout(this._previewViewboxTimeoutId), this._previewViewboxTimeoutId = null), this._connectTimeoutId !== null && (clearTimeout(this._connectTimeoutId), this._connectTimeoutId = null), this.resizeRotate && this.resizeRotate.isEnabled() && this.resizeRotate.disable(), this.connector && this.connector.isActive && this.connector.disable(), this.relationships && (this.relationships.disable(), this.relationships.removeAll()), this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.svgGroup.remove(), this.isDragging = !1;
  }
  /** Hide the node visually (sets display:none). */
  hide() {
    this.svgGroup.hide();
  }
  /** Show the node after hide(). */
  show() {
    this.svgGroup.show();
  }
  /**
   * Set the node[s text content. No-op on SVG content nodes.
   *
   * @param text - New text string
   */
  setText(t) {
    if (!this.textElement) return;
    const e = this.options.text !== t;
    this.options.text = t, this.textElement.text(this.wrapTextToWidth(t)), this.centerText(), this.fitHeightToText(), this.svgGroup.node.setAttribute("aria-label", t || "Unnamed node"), e && this.slate.broadcast?.("onNodeTextChanged", { id: this.id, text: t });
  }
  /**
   * Resize the node to new dimensions. For circles, forces width === height.
   *
   * @param width  - New width
   * @param height - New height
   */
  setSize(t, e) {
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof pe)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof Ne) {
      const s = Math.min(t, e);
      this.backgroundRect.size(s, s), this.options.width = s, this.options.height = s;
    } else if (this.backgroundRect instanceof de)
      this.backgroundRect.size(t, e);
    else
      try {
        this.backgroundRect.size?.(t, e);
      } catch (s) {
        console.warn("NODE_DEBUG: Failed to resize custom shape backgroundRect:", s);
      }
    if (this.nestedSvg) {
      const s = this.backgroundRect.x?.() ?? 0, o = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg.size(t, e).move(s, o);
    }
    this.textElement && this.options.text && this.textElement.text(this.wrapTextToWidth(this.options.text)), this.centerText(), this._linkBadge && this.updateLinkIndicator();
    const n = this._commentBadgeState;
    n && this.setCommentBadge(n.count, n.kind);
  }
  /**
   * Change the node[s background and/or border colors.
   *
   * @param backgroundColor - New fill color (or undefined to keep current)
   * @param borderColor     - New stroke color (or undefined to keep current)
   */
  /**
   * Apply a fill to `el` that may be a solid hex OR a v1-style "colorA-colorB"
   * gradient (slatebox.com stores gradient fills dash-separated). Without this a
   * gradient string was passed straight to SVG fill and rendered black.
   */
  applyShapeFill(t, e) {
    if (!t?.fill || !e) return;
    const n = String(e).split("-").filter(Boolean);
    if (n.length >= 2)
      try {
        const s = this.svgGroup.gradient("linear", (o) => {
          o.stop(0, n[0]), o.stop(1, n[n.length - 1]);
        });
        t.fill(s);
        return;
      } catch {
      }
    t.fill(n[0] || e);
  }
  setColors(t, e) {
    const n = this.contentPath ?? this.backgroundRect;
    if (t) {
      this.options.backgroundColor = t, this.applyShapeFill(n, t);
      const s = String(this.options.fontColor || "").toLowerCase(), o = [
        "",
        "#fff",
        "#ffffff",
        "#000",
        "#000000",
        "white",
        "black"
      ].includes(s), r = this.options.fontColor || "#000000";
      if (o && this.textElement && t.startsWith("#") && is(r, t) < 3) {
        const a = ns(t);
        this.options.fontColor = a;
        try {
          this.textElement.font({ fill: a });
        } catch {
        }
      }
    }
    e && (this.options.borderColor = e, n.stroke({ color: e })), (t || e) && this.slate.broadcast?.("onNodeColorChanged", {
      id: this.id,
      color: this.options.backgroundColor,
      borderColor: this.options.borderColor
    });
  }
  /**
   * Re-apply the border stroke (color / width / style / opacity) from options.
   * The app's border pane sends one { prop, val } at a time, so we repaint the
   * whole stroke from current options each change. borderStyle accepts the app's
   * symbols ('-', '.', '--.') or words ('dashed', 'dotted'); dash lengths scale
   * with the border width. No-op when there's no plain shape stroke (e.g. SVG
   * content / nested path shapes).
   */
  applyBorder() {
    const t = this.contentPath ?? this.backgroundRect;
    if (!t || typeof t.stroke != "function") return;
    const { borderColor: e, borderWidth: n, borderOpacity: s } = this.options, o = { dasharray: this.borderDashArray() };
    e && (o.color = e), n !== void 0 && (o.width = n), s !== void 0 && (o.opacity = s), t.stroke(o);
  }
  /**
   * SVG stroke-dasharray for the current borderStyle, scaled by border width.
   * Accepts the app's symbols ('-', '.', '--.') and words ('dashed', 'dotted').
   * Returns "none" for solid. Shared by createBackground (load path) and
   * applyBorder (edit path) so border style survives a reload.
   */
  borderDashArray() {
    const { borderStyle: t, borderWidth: e } = this.options, n = e || 1, s = {
      "-": [3, 1],
      dashed: [3, 1],
      ".": [1, 1],
      dotted: [1, 1],
      "--.": [8, 3, 1, 3],
      combo: [8, 3, 1, 3]
    };
    return t && s[t] ? s[t].map((o) => o * n).join(",") : "none";
  }
  /** Lock the node, disabling drag and resize/rotate. */
  lock() {
    this.options.isLocked = !0, this.options.allowDrag = !1, this.svgGroup.draggable && this.svgGroup.draggable(!1), this.disableResizeRotate();
  }
  /** Unlock the node, re-enabling drag and resize/rotate. */
  unlock() {
    this.options.isLocked = !1, this.options.allowDrag = !0, this.makeDraggable(), this.enableResizeRotate();
  }
  // Resize/Rotate functionality - managed by Slate
  /** Enable resize and rotate handles. Delegates to the Slate for centralized selection management. */
  enableResizeRotate() {
    console.log(
      "NODE_DEBUG: enableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    ), this.slate.enableNodeResizeRotate(this);
  }
  /** Disable resize and rotate handles. Delegates to the Slate. */
  disableResizeRotate() {
    console.log(
      "NODE_DEBUG: disableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    ), this.slate.disableNodeResizeRotate(this);
  }
  /** Enable resize handles only. */
  enableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: !0 });
  }
  /** Disable resize handles only. */
  disableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: !1 });
  }
  /** Enable rotate handle only. */
  enableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: !0 });
  }
  /** Disable rotate handle only. */
  disableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: !1 });
  }
  isResizeRotateEnabled() {
    return this.resizeRotate.isEnabled();
  }
  /**
   * Set the node[s rotation angle.
   *
   * @param angle - Rotation in degrees (positive = clockwise)
   */
  setRotation(t, e) {
    this.options.rotate || (this.options.rotate = { rotationAngle: 0 });
    const n = this.options.rotate.rotationAngle || 0;
    if (!!e && e > 0 && typeof requestAnimationFrame < "u" && typeof performance < "u" && n !== t) {
      const o = t - n, r = performance.now(), a = () => {
        if (this._destroyed || !this.svgGroup || !this.options.rotate) return;
        const l = Math.min(1, (performance.now() - r) / e), c = l < 0.5 ? 2 * l * l : 1 - Math.pow(-2 * l + 2, 2) / 2;
        this.options.rotate.rotationAngle = n + o * c, this.applyPositionAndRotation(), l < 1 ? requestAnimationFrame(a) : (this.options.rotate.rotationAngle = t, this.applyPositionAndRotation());
      };
      requestAnimationFrame(a);
    } else
      this.options.rotate.rotationAngle = t, this.applyPositionAndRotation();
  }
  /**
   * Set the group's transform to translate(options.x, options.y) followed by a
   * rotation around the node's visual center. The shape/text are drawn at the
   * group's local origin, so position is a pure translate and rotation must be
   * COMPOSED on top of it — replacing the matrix (as an origin:'center' rotate
   * alone does) would drop the translate and fling the node far off-screen on
   * reload. Single source of truth for the group transform.
   */
  applyPositionAndRotation() {
    if (!this.svgGroup) return;
    const t = this.options.x || 0, e = this.options.y || 0, n = this.options.width || 0, s = this.options.height || 0, o = this.options.rotate?.rotationAngle || 0;
    if (typeof this.svgGroup.node?.removeAttribute == "function" && typeof this.svgGroup.bbox == "function")
      try {
        this.svgGroup.node.removeAttribute("transform");
        const a = this.svgGroup.bbox();
        a && (Math.abs(a.x) > 0.01 || Math.abs(a.y) > 0.01) && this.svgGroup.children().forEach((l) => {
          typeof l?.dmove == "function" && l.dmove(-a.x, -a.y);
        });
      } catch (a) {
        console.warn("NODE_DEBUG: child normalization failed:", a);
      }
    const r = o ? `translate(${t} ${e}) rotate(${o} ${n / 2} ${s / 2})` : `translate(${t} ${e})`;
    this.svgGroup.node.setAttribute("transform", r);
    try {
      this.svgGroup.fire?.("transform");
    } catch {
    }
    try {
      (this.slate._activeLineCog || this.slate._activeEndpointToggles) && this.slate.clearLineCog?.();
    } catch {
    }
  }
  /**
   * Re-assert the canonical model after a resize/rotate interaction. During the
   * interaction svg.resize.js transforms the backgroundRect (and we rotate the
   * text/nested separately) — rotation is baked into those CHILDREN. Here we
   * strip those child transforms so rotation lives only on the group, then
   * apply the canonical group transform (which also normalizes child position
   * back to the local origin). Without this the shape carries a baked rotation
   * AND the group re-applies rotation on reload → double rotation / fly-off.
   */
  finalizeInteraction() {
    const t = (e) => {
      try {
        e?.node?.removeAttribute && e.node.removeAttribute("transform");
      } catch {
      }
    };
    t(this.backgroundRect), t(this.textElement), t(this.nestedSvg), this.applyPositionAndRotation(), this.textElement && this.centerText();
  }
  /**
   * Get the current rotation angle. Reads from options.rotate first,
   * then falls back to svgGroup transform and backgroundRect transform.
   *
   * @returns Rotation angle in degrees
   */
  getRotation() {
    if (this.options.rotate?.rotationAngle !== void 0 && this.options.rotate.rotationAngle !== 0)
      return this.options.rotate.rotationAngle;
    if (this.svgGroup)
      try {
        const t = this.svgGroup.transform();
        if (t && typeof t.rotate < "u" && t.rotate !== 0)
          return t.rotate;
      } catch (t) {
        console.warn("NODE_DEBUG: Failed to read svgGroup transform for rotation:", t);
      }
    if (this.backgroundRect)
      try {
        const t = this.backgroundRect.transform();
        if (t && typeof t.rotation < "u")
          return t.rotation;
        if (t && typeof t.rotate < "u")
          return t.rotate;
      } catch (t) {
        console.warn("NODE_DEBUG: Failed to read backgroundRect transform for rotation:", t);
      }
    return 0;
  }
  // Connector functionality
  /** Enable the node[s connector so it can form connections to other nodes. */
  enableConnector() {
    this.connector.enable();
  }
  /**
   * Enable connector with interactive features (selectable, draggable lines).
   *
   * @param makeInteractiveCallback - Optional callback after interactive features are set up
   */
  enableConnectorWithInteractive(t) {
    console.log(
      "NODE_DEBUG: enableConnectorWithInteractive called for",
      this.id
    ), this.connector.enable();
    const e = this.svgGroup;
    if (e && typeof e.connectable == "function") {
      if (console.log(
        "NODE_DEBUG: svg.connectable.js detected, setting up interactive features for",
        this.id
      ), t)
        try {
          const n = e.connectable({}, e);
          n && typeof n.makeInteractive == "function" ? (console.log(
            "NODE_DEBUG: makeInteractive method available, enabling connection handles for",
            this.id
          ), this.enableConnectionHandles(), n.makeInteractive(), n.connector && n.connector.remove && n.connector.remove()) : console.log(
            "NODE_DEBUG: makeInteractive method not available for",
            this.id
          );
        } catch (n) {
          console.warn(
            "NODE_DEBUG: Error testing svg.connectable.js makeInteractive:",
            n
          );
        }
    } else
      console.log("NODE_DEBUG: svg.connectable.js not available for", this.id);
  }
  /** Disable the node[s connector and remove all connections. */
  disableConnector() {
    this.connector.disable();
  }
  /**
   * Create a connection line from this node to a target node.
   *
   * @param targetNode - The node to connect to
   * @param connectionOptions - Line color, width, type, etc.
   * @returns The connection object
   *
   * @example
   * ```ts
   * node1.connectTo(node2, { lineColor: '#e94560', lineWidth: 3, type: 'curved' });
   * ```
   */
  connectTo(t, e) {
    return this.connector.connectTo(t, e);
  }
  disconnectFrom(t) {
    return this.connector.disconnectFrom(t);
  }
  disconnectAll() {
    this.connector.disconnectAll();
  }
  /** @returns All connection objects for this node. */
  getConnections() {
    return this.connector.getConnections();
  }
  /**
   * Get a specific connection by target node ID.
   *
   * @param targetNodeId - The target node[s ID
   * @returns The connection object or null if not found
   */
  getConnection(t) {
    return this.connector.getConnection(t);
  }
  isConnectorEnabled() {
    return this.connector.isEnabled();
  }
  centerTextInitial() {
    this.centerText();
  }
  calculatePathBounds(t, e, n) {
    const s = t.match(/viewBox=["']([^"']+)["']/);
    if (s) {
      const a = s[1].split(/\s+/).map(Number);
      if (a.length === 4)
        return {
          x: a[0],
          y: a[1],
          width: a[2],
          height: a[3]
        };
    }
    const o = t.match(/width=["']([^"']+)["']/), r = t.match(/height=["']([^"']+)["']/);
    if (o && r) {
      const a = parseInt(o[1]), l = parseInt(r[1]);
      if (!isNaN(a) && !isNaN(l))
        return { x: 0, y: 0, width: a, height: l };
    }
    return { x: 0, y: 0, width: 24, height: 24 };
  }
  // Selection Management
  setupSelectionBehavior() {
    this.svgGroup.on("dblclick", (n) => {
      this.isResizeRotateHandle(n.target) || this.handleDoubleClickEdit();
    });
    let t = null;
    const e = 5;
    this.svgGroup.on("pointerdown", (n) => {
      if (this.isResizeRotateHandle(n.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        );
        return;
      }
      t = {
        x: n.clientX || n.detail?.x || 0,
        y: n.clientY || n.detail?.y || 0
      };
    }), this.svgGroup.on("pointerup", (n) => {
      if (this.isResizeRotateHandle(n.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        ), t = null;
        return;
      }
      if (t) {
        const s = {
          x: n.clientX || n.detail?.x || 0,
          y: n.clientY || n.detail?.y || 0
        };
        if (Math.sqrt(
          Math.pow(s.x - t.x, 2) + Math.pow(s.y - t.y, 2)
        ) <= e)
          if (console.log(
            "SELECTION_DEBUG: Node clicked (position-based detection)",
            this.id
          ), this.links?.hasLink?.() && this.slate.isReadOnly?.())
            this.links.navigate();
          else {
            const r = n.ctrlKey || n.metaKey || n.shiftKey;
            this.slate.selectNodes([this], r);
            const a = Date.now();
            a - this._lastClickTime < 400 ? (this._lastClickTime = 0, this.handleDoubleClickEdit()) : this._lastClickTime = a;
          }
        t = null;
      }
    });
  }
  /**
   * Ask the host application to render its text-editing pane (v1's
   * onTextPaneRequested contract). The callback the host invokes applies
   * the edits via the Editor. No-op for read-only viewers, locked nodes,
   * or when the host registered no handler.
   */
  requestTextPane() {
    const t = this.slate.options.events;
    t?.onTextPaneRequested && (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.() || this.options.isLocked || t.onTextPaneRequested(this, (e = {}) => {
      this.editor?.set(
        e.text ?? this.options.text ?? "",
        e.fontSize,
        e.fontFamily,
        e.fontColor ?? e.foregroundColor,
        e.textOpacity ?? e.opacity,
        e.textXAlign,
        e.textYAlign
      );
    }));
  }
  /**
   * Double-click behaviour. Miro parity: double-clicking an ordinary text node
   * edits its text inline on the canvas. Comment nodes, SVG-content nodes, locked
   * / read-only nodes have no inline-editable text, so they fall back to the host
   * text pane. The properties drawer stays reachable either way via the selection
   * cog (which opens the same pane), so this doesn't remove drawer access.
   */
  handleDoubleClickEdit() {
    !this.options.isComment && !this.nestedSvg && !this.options.isLocked && !this.slate.isReadOnly?.() && !this.slate.isCommentOnly?.() && typeof this.editor?.startInline == "function" ? this.editor.startInline() : this.requestTextPane();
  }
  // Helper method to identify resize/rotate handles
  isResizeRotateHandle(t) {
    if (!t || !t.classList) return !1;
    const e = [
      "svg-select-point",
      "svg-resize-handle",
      "svg_select_handle",
      "svg_select_handle_rot",
      "svg_select_handle_lt",
      "svg_select_handle_rt",
      "svg_select_handle_rb",
      "svg_select_handle_lb",
      "svg_select_handle_t",
      "svg_select_handle_r",
      "svg_select_handle_b",
      "svg_select_handle_l",
      "svg_select_handle_point"
    ];
    for (const n of e)
      if (t.classList.contains(n))
        return !0;
    return !!(t.getAttribute && (t.getAttribute("data-handle") || t.getAttribute("data-resize") || t.getAttribute("data-rotate")));
  }
  // Selection state management (handled by Slate)
  /** Called by the Slate when this node is selected. */
  onSelected() {
    console.log("SELECTION_DEBUG: Node selected", this.id);
  }
  /**
   * Show the node context toolbar (G1) — a compact strip CENTERED ABOVE the
   * node (legacy parity) with: delete, plug (drag-to-connect), cog (settings).
   * Only shown on single selection (Slate.updateSelectionResizeRotate drives it).
   */
  showNodeCog() {
    if (this.options.allowMenu === !1) return;
    this.hideNodeCog();
    const t = this.slate, e = t.markersContainer || t.canvas;
    if (!e || !this.svgGroup) return;
    let n, s;
    try {
      const p = this.svgGroup.rbox(t.canvas);
      n = p.x + p.width / 2, s = p.y;
    } catch {
      n = (this.options.x || 0) + (this.options.width || 0) / 2, s = this.options.y || 0;
    }
    const o = 15, r = 6, a = "#5b6472", l = [
      { key: "delete", color: "#e5484d", onClick: () => this.slate.removeNode(this.id) },
      // plug: press-drag-to-connect (G3) — starts on pointerdown, not click.
      { key: "plug", color: a, onPress: (p) => this.startConnectDrag(p) },
      { key: "cog", color: a, onClick: () => this.menu?.open?.() }
    ], c = l.length, h = o * 2 + r, d = c * (o * 2) + (c - 1) * r, u = n - d / 2 + o, f = s - (o + 18 + 36), g = e.group().addClass("node-cog").addClass("node-toolbar");
    g.rect(d + 14, o * 2 + 10).radius((o * 2 + 10) / 2).center(n, f).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 }), l.forEach((p, y) => {
      const m = u + y * h, b = g.group().addClass(`node-tool-${p.key}`);
      b.circle(o * 2).center(m, f).fill("#ffffff").attr("fill-opacity", 1e-3), Oe.drawToolIcon(b, p.key, m, f, p.color), b.attr("pointer-events", "all");
      try {
        b.node.style.cursor = "pointer";
      } catch {
      }
      b.on("mousedown", (w) => {
        w.stopPropagation?.(), p.onPress && p.onPress(w);
      }), b.on("click", (w) => {
        w.stopPropagation?.(), p.onClick?.();
      });
    }), g.attr("pointer-events", "all"), this._nodeCog = g;
    try {
      t.markersContainer?.front?.();
    } catch {
    }
  }
  /** Draw a crisp monochrome line-icon (delete/plug/cog) centered at (cx,cy). */
  static drawToolIcon(t, e, n, s, o) {
    const r = { color: o, width: 1.6, linecap: "round", linejoin: "round" };
    e === "delete" ? (t.line(n - 6, s - 5, n + 6, s - 5).stroke(r), t.line(n - 2.5, s - 5, n - 2, s - 7.5).stroke(r), t.line(n + 2.5, s - 5, n + 2, s - 7.5).stroke(r), t.line(n - 2, s - 7.5, n + 2, s - 7.5).stroke(r), t.path(`M ${n - 4.5} ${s - 4} L ${n - 3.8} ${s + 6.5} L ${n + 3.8} ${s + 6.5} L ${n + 4.5} ${s - 4}`).fill("none").stroke(r), t.line(n - 1.3, s - 2, n - 1.3, s + 4).stroke({ color: o, width: 1.1, linecap: "round" }), t.line(n + 1.3, s - 2, n + 1.3, s + 4).stroke({ color: o, width: 1.1, linecap: "round" })) : e === "plug" ? (t.line(n - 4, s + 4, n + 4, s - 4).stroke(r), t.circle(4.4).center(n - 4.5, s + 4.5).fill(o), t.circle(4.4).center(n + 4.5, s - 4.5).fill("#ffffff").stroke(r)) : t.text("⚙").font({ size: 17, anchor: "middle", family: "sans-serif" }).fill(o).center(n, s).attr("dy", "0.05em");
  }
  hideNodeCog() {
    if (this._nodeCog) {
      try {
        this._nodeCog.remove();
      } catch {
      }
      this._nodeCog = void 0;
    }
  }
  /**
   * Plug drag-to-connect (G3): press the plug and drag — a dashed rubber-band
   * line follows the pointer from this node; dropping on another node creates an
   * association (connector) to it. Dropping on empty canvas does nothing.
   */
  startConnectDrag(t) {
    const e = this.slate, n = e.canvas;
    if (!n || this._connectDragging) return;
    this._connectDragging = !0;
    const s = e.markersContainer || n;
    let o, r;
    try {
      const m = this.svgGroup.rbox(n);
      o = m.cx, r = m.cy;
    } catch {
      o = (this.options.x || 0) + (this.options.width || 0) / 2, r = (this.options.y || 0) + (this.options.height || 0) / 2;
    }
    const a = s.path(`M ${o} ${r} L ${o} ${r}`).fill("none").stroke({ color: "#007cff", width: 2, dasharray: "6,4", linecap: "round" }).addClass("connect-drag-line");
    a.attr("pointer-events", "none");
    let l = null;
    try {
      l = s.marker(7, 7, (m) => {
        m.path("M0,0 L7,3.5 L0,7 z").fill("#007cff").attr("pointer-events", "none");
      }), l.ref(6, 3.5), l.attr("pointer-events", "none"), a.marker("end", l);
    } catch {
    }
    try {
      e.markersContainer?.front?.();
    } catch {
    }
    const c = (m, b, w, x) => {
      const _ = Math.hypot(m, b);
      if (_ > 1e-4) return [m / _, b / _];
      const v = Math.hypot(w, x) || 1;
      return [w / v, x / v];
    }, h = (m, b, w) => {
      const x = (m.x || 0) + (m.width || 0) / 2, _ = (m.y || 0) + (m.height || 0) / 2, v = b - x, C = w - _;
      if (Math.abs(v) < 1e-3 && Math.abs(C) < 1e-3) return { x, y: _ };
      const A = v !== 0 ? (m.width || 0) / 2 / Math.abs(v) : 1 / 0, B = C !== 0 ? (m.height || 0) / 2 / Math.abs(C) : 1 / 0, I = Math.min(A, B);
      return { x: x + v * I, y: _ + C * I };
    };
    let d = null;
    const u = () => {
      if (d) {
        try {
          d._preHiStroke !== void 0 && d.node.backgroundRect?.attr?.("stroke", d._preHiStroke), d.node.backgroundRect?.attr?.({
            "stroke-dasharray": null,
            "stroke-opacity": null
          });
        } catch {
        }
        d = null;
      }
    }, f = (m, b) => {
      try {
        return n.point(m, b);
      } catch {
        return { x: o, y: r };
      }
    }, g = (m, b) => {
      let w;
      try {
        w = a.node.style.display, a.node.style.display = "none";
      } catch {
      }
      const x = document.elementFromPoint(m, b);
      try {
        w !== void 0 && (a.node.style.display = w);
      } catch {
      }
      const v = x?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
      return !v || v === this.id ? null : e.nodes?.one?.(v) || null;
    }, p = (m) => {
      const b = f(m.clientX, m.clientY), w = g(m.clientX, m.clientY);
      if (w && w.options) {
        const x = w.options, _ = (x.x || 0) + (x.width || 0) / 2, v = (x.y || 0) + (x.height || 0) / 2, C = h(x, o, r), A = h(this.options, _, v), B = C.x - A.x, I = C.y - A.y, T = Math.hypot(B, I) || 1, Z = c(A.x - o, A.y - r, B, I), H = c(C.x - _, C.y - v, -B, -I), q = Math.max(30, Math.min(T * 0.45, 90)), G = A.x + Z[0] * q, W = A.y + Z[1] * q, K = C.x + H[0] * q, tt = C.y + H[1] * q;
        a.plot(
          `M ${A.x} ${A.y} C ${G} ${W} ${K} ${tt} ${C.x} ${C.y}`
        );
      } else
        a.plot(`M ${o} ${r} L ${b.x} ${b.y}`);
      if (w !== (d?.node || null) && (u(), w && w.backgroundRect)) {
        const x = w.backgroundRect;
        d = { node: w, _preHiStroke: x.attr("stroke") };
        try {
          x.attr({ stroke: "#007cff", "stroke-dasharray": "8,4", "stroke-opacity": 0.9 });
        } catch {
        }
      }
    }, y = (m) => {
      window.removeEventListener("pointermove", p, !0), window.removeEventListener("pointerup", y, !0), this._connectDragging = !1;
      try {
        a.remove(), l?.remove?.(), n.node.querySelectorAll(
          ".connect-drag-line"
        ).forEach((x) => x.remove());
      } catch {
      }
      const b = g(m.clientX, m.clientY);
      if (u(), b && b.id !== this.id)
        try {
          this.relationships.addAssociation(b);
        } catch {
        }
    };
    window.addEventListener("pointermove", p, !0), window.addEventListener("pointerup", y, !0);
  }
  /** Called by the Slate when this node is deselected. */
  onDeselected() {
    console.log("SELECTION_DEBUG: Node deselected", this.id);
  }
  // Connection Handles for New Node Creation
  createConnectionHandles() {
    if (this.connectionHandles.container) {
      console.log(
        "CONNECTION_HANDLES_DEBUG: Handles already exist for",
        this.id
      );
      return;
    }
    console.log(
      "CONNECTION_HANDLES_DEBUG: Creating connection handles for",
      this.id
    ), this.connectionHandles.container = this.slate.canvas.group(), this.connectionHandles.container.on(
      "mouseenter",
      () => this.revealConnHandlesOnHover()
    ), this.connectionHandles.container.on(
      "mouseleave",
      () => this.scheduleConnHandlesHide()
    );
    const t = 8, e = "#007cff", n = "#ffffff", s = 2, o = {
      top: { x: 0, y: -t - 5 },
      right: { x: t + 5, y: 0 },
      bottom: { x: 0, y: t + 5 },
      left: { x: -t - 5, y: 0 }
    };
    Object.entries(o).forEach(([r, a]) => {
      if (!this.connectionHandles.container) return;
      const l = this.connectionHandles.container.circle(t * 2).fill(e).stroke({ color: n, width: s }).addClass(`connection-handle connection-handle-${r}`);
      l.node.style.cursor = "pointer", this.connectionHandles[r] = l, l.on(
        "mouseenter",
        () => this.showConnectionPreview(
          r
        )
      ), l.on("mouseleave", () => this.hideConnectionPreview()), l.on("click", (c) => {
        c.stopPropagation(), console.log(
          `CONNECTION_HANDLES_DEBUG: ${r} handle clicked on`,
          this.id
        ), this.createConnectedNode(
          r
        );
      }), l.on("pointerdown", (c) => {
        if (this.slate?.isReadOnly?.()) return;
        c.stopPropagation();
        const h = c.clientX, d = c.clientY;
        let u = !1;
        const f = () => {
          window.removeEventListener("pointermove", g, !0), window.removeEventListener("pointerup", p, !0);
        }, g = (y) => {
          if (!u && Math.hypot(y.clientX - h, y.clientY - d) > 5) {
            u = !0, f();
            const m = (b) => {
              b.stopPropagation(), l.node.removeEventListener("click", m, !0);
            };
            l.node.addEventListener("click", m, !0), this.startConnectDrag(c);
          }
        }, p = () => f();
        window.addEventListener("pointermove", g, !0), window.addEventListener("pointerup", p, !0);
      });
    }), this.connectionHandles.container && this.connectionHandles.container.hide(), this.updateConnectionHandlePositions();
  }
  updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;
    const t = this.backgroundRect.bbox(), e = this.backgroundRect.screenCTM(), s = this.backgroundRect.root().screenCTM().inverseO().multiplyO(e), o = ([d, u], { a: f, b: g, c: p, d: y, e: m, f: b }) => [d * f + u * p + m, d * g + u * y + b], r = t.x + t.width / 2, a = t.y + t.height / 2, l = 35, c = 20, h = {
      top: [r, t.y - l],
      right: [t.x + t.width + c, a],
      bottom: [r, t.y + t.height + c],
      left: [t.x - c, a]
    };
    Object.entries(h).forEach(([d, u]) => {
      const f = this.connectionHandles[d];
      if (f) {
        const [g, p] = o(u, s);
        f.center(g, p);
      }
    });
  }
  /**
   * Miro-style: reveal the plug-circles when the node is hovered (not just when
   * selected), so you can drag-to-connect without selecting first. A hide
   * debounce bridges the small gap between the node edge and the offset circles;
   * selection pins them (`_connHandlesPinned`); a connect-drag keeps them alive.
   */
  wireConnectionHandleHover() {
    this.svgGroup && (this.svgGroup.on("mouseenter", () => this.revealConnHandlesOnHover()), this.svgGroup.on("mouseleave", () => this.scheduleConnHandlesHide()));
  }
  revealConnHandlesOnHover() {
    this.slate?.isReadOnly?.() || (this._connHandleHideTimer && (clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = null), this.connectionHandlesVisible || this.showConnectionHandles());
  }
  scheduleConnHandlesHide() {
    this._connHandlesPinned || (this._connHandleHideTimer && clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = setTimeout(() => {
      this._connHandleHideTimer = null, !(this._connHandlesPinned || this._connectDragging) && this.hideConnectionHandles();
    }, 220));
  }
  showConnectionHandles() {
    this.connectionHandles.container || this.createConnectionHandles(), console.log(
      "CONNECTION_HANDLES_DEBUG: Showing connection handles for",
      this.id
    ), this.connectionHandlesVisible = !0, this.connectionHandles.container && this.connectionHandles.container.show(), this.updateConnectionHandlePositions();
  }
  hideConnectionHandles() {
    this.connectionHandles.container && (console.log(
      "CONNECTION_HANDLES_DEBUG: Hiding connection handles for",
      this.id
    ), this.connectionHandlesVisible = !1, this.connectionHandles.container && this.connectionHandles.container.hide(), this.hideConnectionPreview());
  }
  showConnectionPreview(t) {
    if (this.connectionPreview?.container)
      return;
    console.log(
      "CONNECTION_HANDLES_DEBUG: Showing preview for",
      t,
      "on",
      this.id
    ), this.hideConnectionPreview();
    const e = this.svgGroup.root();
    this.connectionPreview = {
      container: e.group().attr("pointer-events", "none")
    };
    const n = this.options.width, s = this.options.height, o = 75, r = this.getRotation(), a = this.backgroundRect.rbox(this.backgroundRect.root()), l = a.cx, c = a.cy, h = this.connectionHandles[t];
    if (!h) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const d = h.bbox(), u = {
      x: d.x + d.width / 2,
      y: d.y + d.height / 2
    }, f = u.x - l, g = u.y - c, p = Math.sqrt(f * f + g * g), y = f / p, m = g / p, b = this.backgroundRect.bbox(), w = b.x + b.width / 2, x = b.y + b.height / 2, _ = this.backgroundRect.screenCTM(), C = this.backgroundRect.root().screenCTM().inverseO().multiplyO(_), A = C.inverse(), B = y * A.a + m * A.c, I = y * A.b + m * A.d;
    let T, Z;
    const H = Math.abs(B);
    Math.abs(I) > H ? I < 0 ? (T = w, Z = b.y) : (T = w, Z = b.y + b.height) : B < 0 ? (T = b.x, Z = x) : (T = b.x + b.width, Z = x);
    const G = ([nt, lt], { a: zt, b: S, c: vt, d: xt, e: Kt, f: Qt }) => [nt * zt + lt * vt + Kt, nt * S + lt * xt + Qt], [W, K] = G([T, Z], C), tt = Math.sqrt(
      Math.pow(W - l, 2) + Math.pow(K - c, 2)
    ), at = tt, wt = tt + o + at, Ot = l + y * wt, et = c + m * wt, E = Ot - n / 2, O = et - s / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      E,
      O,
      n,
      s,
      r
      // Pass rotation angle to preview
    );
    const ut = tt + o - p, ft = {
      x: u.x + y * ut,
      y: u.y + m * ut
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(u.x, u.y, ft.x, ft.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      u,
      ft
    );
  }
  createPreviewShape(t, e, n, s, o, r = 0) {
    let a;
    const l = this.options.backgroundColor || "#007cff", c = "#ffffff", h = 2, d = 0.6, u = e + s / 2, f = n + o / 2;
    switch (this.options.shape) {
      case "circle":
        const g = Math.min(s, o) / 2;
        a = t.circle(g * 2).center(u, f).fill(l).stroke({ color: c, width: h }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      case "ellipse":
        a = t.ellipse(s, o).center(u, f).fill(l).stroke({ color: c, width: h }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      default:
        if (this.options.svgContent) {
          a = t.rect(s, o).move(e, n).fill("none").stroke({ color: c, width: h }).opacity(d).radius(4);
          const p = t.nested().size(s, o).move(e, n);
          p.svg(this.options.svgContent), this._previewViewboxTimeoutId = setTimeout(() => {
            if (this._destroyed) return;
            const y = p.children()[0];
            if (y) {
              let m = y.bbox();
              (m.width <= 0 || m.height <= 0) && (m = this.calculatePathBounds(
                this.options.svgContent,
                s,
                o
              )), m.width > 0 && m.height > 0 && (p.viewbox(m.x, m.y, m.width, m.height), p.node.setAttribute(
                "preserveAspectRatio",
                "xMidYMid meet"
              )), y.fill(l).opacity(d);
            }
          }, 1), p.attr("pointer-events", "none"), r !== 0 && (a.rotate(r, u, f), p.rotate(r, u, f));
        } else
          a = t.rect(s, o).move(e, n).fill(l).stroke({ color: c, width: h }).opacity(d).radius(4), r !== 0 && a.rotate(r, u, f);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, n) {
    const s = n.x - e.x, o = n.y - e.y, r = Math.sqrt(s * s + o * o);
    if (r === 0) return;
    const a = s / r, l = o / r, c = 12, h = 6, d = n.x, u = n.y, f = d - a * c, g = u - l * c, p = -l * h, y = a * h, m = [
      [d, u],
      [f + p, g + y],
      [f - p, g - y],
      [d, u]
    ];
    t.polygon(m).fill("#007cff").opacity(0.8).attr("pointer-events", "none");
  }
  hideConnectionPreview() {
    this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview = void 0);
  }
  /** Show connection handles (4 blue dots) on this node for creating connected siblings. */
  enableConnectionHandles() {
    console.log(
      "CONNECTION_HANDLES_DEBUG: enableConnectionHandles called for",
      this.id
    ), this._connHandlesPinned = !0, this._connHandleHideTimer && (clearTimeout(this._connHandleHideTimer), this._connHandleHideTimer = null), this.showConnectionHandles();
  }
  /** Hide connection handles on this node. */
  disableConnectionHandles() {
    console.log(
      "CONNECTION_HANDLES_DEBUG: disableConnectionHandles called for",
      this.id
    ), this._connHandlesPinned = !1, this.hideConnectionHandles();
  }
  isConnectionHandlesEnabled() {
    return this.connectionHandlesVisible;
  }
  getNodeEdgePoint(t, e) {
    const n = t.x + t.width / 2, s = t.y + t.height / 2;
    switch (e) {
      case "top":
        return { x: n, y: t.y };
      case "right":
        return { x: t.x + t.width, y: s };
      case "bottom":
        return { x: n, y: t.y + t.height };
      case "left":
        return { x: t.x, y: s };
    }
  }
  createConnectedNode(t) {
    console.log(
      "CONNECTION_HANDLES_DEBUG: Creating connected node in direction",
      t,
      "from",
      this.id
    );
    try {
      const e = this.options.width, n = this.options.height, s = 75, o = this.getRotation(), r = o * Math.PI / 180;
      let a = 0, l = 0;
      switch (t) {
        case "top":
          a = 0, l = -1;
          break;
        case "right":
          a = 1, l = 0;
          break;
        case "bottom":
          a = 0, l = 1;
          break;
        case "left":
          a = -1, l = 0;
          break;
      }
      const c = a * Math.cos(r) - l * Math.sin(r), h = a * Math.sin(r) + l * Math.cos(r), d = this.backgroundRect.rbox(this.backgroundRect.root()), u = d.cx, f = d.cy, g = this.backgroundRect.bbox(), p = g.x + g.width / 2, y = g.y + g.height / 2;
      let m, b;
      switch (t) {
        case "top":
          m = p, b = g.y;
          break;
        case "right":
          m = g.x + g.width, b = y;
          break;
        case "bottom":
          m = p, b = g.y + g.height;
          break;
        case "left":
          m = g.x, b = y;
          break;
      }
      const w = this.backgroundRect.screenCTM(), _ = this.backgroundRect.root().screenCTM().inverseO().multiplyO(w), v = ([tt, at], { a: wt, b: Ot, c: et, d: E, e: O, f: j }) => [tt * wt + at * et + O, tt * Ot + at * E + j], [C, A] = v([m, b], _), B = Math.sqrt(
        Math.pow(C - u, 2) + Math.pow(A - f, 2)
      ), I = B, T = B + s + I, Z = u + c * T, H = f + h * T, q = Z - e / 2, G = H - n / 2, W = this.cloneNodeOptions(q, G, o), K = this.slate.addNode(W);
      if (!K) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        K.id,
        "at",
        q,
        G
      ), this.hideConnectionPreview(), this._connectTimeoutId = setTimeout(() => {
        this._destroyed || this.connectToNode(K);
      }, 100);
    } catch (e) {
      console.error(
        "CONNECTION_HANDLES_DEBUG: Error creating connected node:",
        e
      );
    }
  }
  cloneNodeOptions(t, e, n) {
    const s = "node_" + Math.random().toString(36).substr(2, 9), o = {
      ...this.options,
      id: s,
      x: t,
      y: e,
      text: `Node ${s.split("_")[1]}`
      // Give it a different default text
      // Keep the same visual properties (shape, color, size, etc.)
    };
    return n !== void 0 && n !== 0 && (o.rotate = {
      ...o.rotate,
      rotationAngle: n
    }), o;
  }
  connectToNode(t) {
    if (this.relationships) {
      if (this.relationships.getAssociation?.(t.id))
        return;
      this.relationships.addAssociation(t);
      return;
    }
    if (!this.connector) {
      console.warn(
        "CONNECTION_HANDLES_DEBUG: Connector not initialized for",
        this.id
      );
      return;
    }
    this.connector.isEnabled() || this.connector.enable(), this.connector.connectTo(t);
  }
}
class qa {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Oe(t, this.slate);
    return this.nodes.set(e.id, e), e;
  }
  remove(t) {
    const e = this.nodes.get(t);
    if (e) {
      try {
        e.relationships?.removeAll?.();
      } catch {
      }
      return this.allNodes.forEach((n) => {
        if (n.id !== t)
          try {
            n.relationships?.getAssociation?.(t) && n.relationships.removeAssociation(t);
          } catch {
          }
      }), e.remove(), this.nodes.delete(t), !0;
    }
    return !1;
  }
  one(t) {
    return this.nodes.get(t);
  }
  get allNodes() {
    return Array.from(this.nodes.values());
  }
  clear() {
    this.allNodes.forEach((t) => t.remove()), this.nodes.clear();
  }
  /** Destroy the nodes manager, clearing all nodes */
  destroy() {
    this.clear(), this.slate = null;
  }
  /**
   * Move nodes from a collab package. Accepts BOTH shapes:
   *  - v2: `data.nodes: [{id, x, y}]`
   *  - v1: `data.nodeOptions: [{id, xPos, yPos}]` (what drag-end broadcasts)
   */
  moveNodes(t, e = {}) {
    const n = t?.data ?? t ?? {}, s = e.animate === !1 || n.dur === 0 ? 0 : n.dur ?? 400, o = [];
    Array.isArray(n.nodes) && n.nodes.forEach((r) => o.push({ id: r.id, x: r.x, y: r.y })), Array.isArray(n.nodeOptions) && n.nodeOptions.forEach(
      (r) => o.push({ id: r.id, x: r.xPos ?? r.x, y: r.yPos ?? r.y })
    ), o.forEach((r) => {
      const a = this.one(r.id);
      a && typeof r.x == "number" && typeof r.y == "number" && a.position(r.x, r.y, void 0, void 0, s);
    });
  }
  /** Create an association from a collab package: `{parentId, childId, ...opts}` */
  addRelationship(t) {
    const { parentId: e, childId: n, targetPoint: s } = t || {}, o = e ? this.one(e) : void 0;
    if (!o) {
      console.warn("NODESMANAGER_DEBUG: addRelationship missing parent", e);
      return;
    }
    if (o.relationships?.getAssociation?.(n)) return;
    if (s) {
      o.relationships?.addFloatingAssociation(
        s,
        t
      );
      return;
    }
    const r = n ? this.one(n) : void 0;
    if (!r) {
      console.warn(
        "NODESMANAGER_DEBUG: addRelationship missing child",
        e,
        n
      );
      return;
    }
    o.relationships?.addAssociation(r, t);
  }
  /** Remove an association from a collab package: `{parentId, childId}` */
  removeRelationship(t) {
    const { parentId: e, childId: n } = t || {}, s = e ? this.one(e) : void 0;
    !s || !n || s.relationships?.removeAssociation(n);
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
  }
  count() {
    return this.nodes.size;
  }
  forEach(t) {
    this.nodes.forEach(t);
  }
  filter(t) {
    return this.allNodes.filter(t);
  }
  find(t) {
    return this.allNodes.find(t);
  }
}
class Ka {
  constructor(t) {
    this.slate = t;
  }
  /** Destroy the invoker, clearing all callback references */
  destroy() {
    this.slate = null;
  }
  onZoom(t) {
    if (this.slate.options.followMe) {
      const e = t.data.zoomLevel;
      typeof e == "number" && e > 0 && this.slate.panZoom?.zoom(e);
    }
  }
  onNodePositioned(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.position(
      t.data.location.x,
      t.data.location.y,
      () => {
      },
      t.data.easing,
      t.data.duration || 500
    );
  }
  onNodeLinkRemoved(t) {
    const e = this.slate.nodes.one(t.data.id);
    e?.links && e.links.unset(!1);
  }
  onNodeLinkAdded(t) {
    const e = this.slate.nodes.one(t.data.id), n = t.data?.link;
    e?.links && n && e.links.set(n, !1);
  }
  onNodeUnlocked(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.unlock();
  }
  onNodeLocked(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.lock();
  }
  onNodeBehaviorChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && t.data.behaviorChanges.forEach((n) => {
      typeof n.value == "object" ? (e.options[n.name] = n.value.val, Object.keys(n.value).forEach((s) => {
        s !== "val" && (e.options[s] = n.value[s]);
      })) : e.options[n.name] = n.value;
    });
  }
  onNodeToBack(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.toBack();
  }
  onNodeToFront(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.toFront();
  }
  onNodeShapeChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e) return;
    const n = t.data.shape ?? t.data.vectorPath;
    Object.assign(e.options, t.data), n && e.setShape(n, t.data.vectorPath);
  }
  onNodeAdded(t) {
    if (t.data?.multiSelectCopy)
      console.log("Multi-select copy:", t.data);
    else if (t.data.id && t.data.options && !t.data.nodeOptions)
      this.slate.nodes.one(t.data.id) && this.slate.nodes.add({
        ...t.data.options,
        x: t.data.targetXPos || 100,
        y: t.data.targetYPos || 100
      });
    else {
      let e = t.data.nodeOptions;
      Array.isArray(e) || (e = [e]), e.filter(Boolean).forEach((n) => {
        this.slate.nodes.one(n.id) || this.slate.nodes.add(qt(n));
      });
    }
  }
  onNodeImageChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e?.images) return;
    const n = t.data.img ?? t.data.image;
    n ? e.images.set(n, t.data.w, t.data.h) : e.images.clear();
  }
  onNodeDeleted(t) {
    this.slate.nodes.remove(t.data.id);
  }
  onNodeResized(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (Object.assign(e.options, t.data), e.setSize(t.data.width, t.data.height));
  }
  onNodeRotated(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (e) {
      t.data.textOffset !== void 0 && (e.options.textOffset = t.data.textOffset);
      const n = t.data.rotate?.rotationAngle ?? t.data.rotationAngle;
      typeof n == "number" && e.setRotation(n, 400), t.data.width && t.data.height && e.setSize(t.data.width, t.data.height);
    }
  }
  onNodeColorChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (e.setColors(
      t.data.color ?? t.data.backgroundColor,
      t.data.borderColor
    ), t.data.opacity !== void 0 && (e.options.opacity = t.data.opacity, e.applyOpacity()));
  }
  onNodeTextChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (t.data.fontSize !== void 0 && (e.options.fontSize = t.data.fontSize), t.data.fontFamily !== void 0 && (e.options.fontFamily = t.data.fontFamily), t.data.fontColor !== void 0 && (e.options.fontColor = t.data.fontColor), t.data.textOpacity !== void 0 && (e.options.textOpacity = t.data.textOpacity), t.data.textXAlign !== void 0 && (e.options.textXAlign = t.data.textXAlign), t.data.textYAlign !== void 0 && (e.options.textYAlign = t.data.textYAlign), t.data.text !== void 0 && e.setText(t.data.text), e.applyTextStyle());
  }
  onNodeAITextChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (e.options.ai = { ...e.options.ai, ...t.data.ai });
  }
  addRelationship(t) {
    this.slate.nodes.addRelationship(t.data);
  }
  removeRelationship(t) {
    this.slate.nodes.removeRelationship(t.data);
  }
  onNodesMove(t) {
    this.slate.nodes.moveNodes(t);
  }
  onNodeEffectChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e?.filters) return;
    const n = t.data.filter;
    if (!n) return;
    const s = n.apply === "text" ? "text" : "vect", o = s === "text" ? "text" : "vect", r = e.options.filters?.[o];
    r && e.filters.remove(r), n.id ? e.filters.apply(n.id, s) : e.options.filters && (e.options.filters[o] = void 0);
  }
  onNodeBorderPropertiesChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e) return;
    const { prop: n, val: s } = t.data;
    n !== void 0 ? e.options[n] = s : (t.data.borderColor !== void 0 && (e.options.borderColor = t.data.borderColor), t.data.borderWidth !== void 0 && (e.options.borderWidth = t.data.borderWidth)), e.applyBorder();
  }
  onLinePropertiesChanged(t) {
    (Array.isArray(t.data) ? t.data : [t.data]).forEach((n) => {
      const s = this.slate.nodes.one(n.id);
      s && (n.associationId && n.prop !== void 0 && s.relationships ? s.relationships.applyLineProperty(n.associationId, n.prop, n.val) : n.options && Object.assign(s.options, n.options));
    });
  }
  onFollowMeChanged(t) {
    this.slate.options.followMe = t.data?.followMe;
  }
  onCanvasMove(t) {
    if (this.slate.options.followMe) {
      const { left: e, top: n } = t.data || {};
      typeof e == "number" && typeof n == "number" && this.slate.pan({ x: e, y: n });
    }
  }
  onSlateThemeChanged(t) {
    const e = t.data?.theme;
    e?._id && (this.slate.options.themeId = e._id), e && this.slate.applyTheme(e, t.data?.syncWithTheme);
  }
  onSlateLayoutTypeChanged(t) {
    t.data.layoutType != null && (this.slate.options.layoutType = t.data.layoutType), t.data.disableAutoLayoutOfManuallyPositionedNodes != null && (this.slate.options.disableAutoLayoutOfManuallyPositionedNodes = t.data.disableAutoLayoutOfManuallyPositionedNodes);
  }
  onSlateBackgroundEffectChanged(t) {
    this.slate.options.containerStyle.backgroundEffect = t.data.effect, console.log("Background effect changed:", t.data.effect);
  }
  onSlateBackgroundImageChanged(t) {
    if (t.data.bg)
      this.slate.options.containerStyle.backgroundImage = t.data.bg.url, this.slate.options.containerStyle.backgroundSize = t.data.bg.size, this.slate.options.containerStyle.backgroundColorAsGradient = !1;
    else {
      const e = this.slate.options.containerStyle?.prevBackgroundColor || "#fff";
      this.slate.options.containerStyle.backgroundColor = e, this.slate.options.containerStyle.backgroundImage = void 0, this.slate.options.containerStyle.backgroundEffect = void 0;
    }
    this.slate.applyContainerStyle();
  }
  onSlateBackgroundColorChanged(t) {
    const e = this.slate.options.containerStyle;
    e.backgroundColor = t.data.color, e.backgroundColorAsGradient = t.data.asGradient, e.backgroundGradientType = t.data.gradientType, e.backgroundGradientColors = t.data.gradientColors, e.backgroundGradientStrategy = t.data.gradientStrategy, e.backgroundImage = void 0, e.backgroundEffect = void 0, this.slate.applyContainerStyle();
  }
  onLineColorChanged(t) {
    this.slate.options.defaultLineColor = t.data.color, this.slate.nodes.allNodes.forEach((e) => {
      e.options.lineColor = t.data.color, e.relationships?.associations && (e.relationships.associations.forEach((n) => {
        n.lineColor = t.data.color;
      }), e.relationships.refreshOwnRelationships());
    });
  }
  onSlateAISet(t) {
    this.slate.options.ai = {
      ...this.slate.options.ai || {},
      ...t.data
    };
  }
  onSlateNameChanged(t) {
    this.slate.options.name = t.data.name;
  }
  onSlateDescriptionChanged(t) {
    this.slate.options.description = t.data.description;
  }
  onSlateShowGridChanged(t) {
    this.slate.options.viewPort.showGrid = t.data.showGrid, t.data.showGrid ? this.slate.grid?.show() : this.slate.grid?.hide();
  }
  onSlateMindMapModeChanged(t) {
    this.slate.options.mindMapMode = t.data.mindMapMode;
  }
  onSlateAutoResizeNodesBasedOnTextChanged(t) {
    this.slate.options.autoResizeNodesBasedOnText = t.data.autoResizeNodesBasedOnText;
  }
  onSlateTagsAndTemplateMarkdownChanged(t) {
    this.slate.options.tags = t.data.tags, this.slate.options.templateMarkdown = t.data.templateMarkdown, this.slate.options.templatePrompt = t.data.templatePrompt;
  }
  onSlateTemplateChanged(t) {
    this.slate.options.isTemplate = t.data.isTemplate;
  }
  onSlateSnapToObjectsChanged(t) {
    this.slate.options.viewPort.snapToObjects = t.data.snapToObjects;
  }
  onSlateSnapToGridChanged(t) {
    this.slate.options.viewPort.snapToGrid = t.data.snapToGrid, this.slate.grid?.updateOptions({ snapToGrid: !!t.data.snapToGrid });
  }
  onSlateFollowMeChanged(t) {
    this.slate.options.followMe = t.data.followMe;
  }
  onSlateHuddleChanged(t) {
    t.data.huddleType != null && (this.slate.options.huddleType = t.data.huddleType), t.data.huddleEnabled != null && (this.slate.options.huddleEnabled = t.data.huddleEnabled);
  }
}
class ss {
  /**
   * Creates the pan/zoom handler. Enables panning and zooming on the canvas.
   *
   * @param slate   - The parent Slate instance
   * @param options - Pan/zoom configuration (zoom factor, min/max, controls, etc.)
   */
  constructor(t, e = {}) {
    this.isEnabled = !1, this.controlsContainer = null, this._wheelHandler = null, this.slate = t, this.canvas = t.canvas, this.options = {
      enabled: !0,
      panning: !0,
      pinchZoom: !0,
      wheelZoom: !0,
      // Enable wheel zoom for Ctrl+scroll
      // Middle-mouse drag pans (Miro/Figma convention). This frees LEFT-drag on
      // empty canvas for rubber-band multi-select (MultiSelection) instead of
      // both firing at once. Trackpad/wheel pan is a separate custom handler.
      panButton: 1,
      oneFingerPan: !1,
      margins: !1,
      zoomFactor: 0.3,
      zoomMin: 0.1,
      zoomMax: 10,
      wheelZoomDeltaModeLinePixels: 17,
      wheelZoomDeltaModeScreenPixels: 53,
      momentum: !0,
      // Enable kinetic scrolling with inertia
      momentumSlowdown: 0.8,
      // Slowdown factor for momentum panning
      showControls: !1,
      // BirdsEye has integrated zoom controls now
      controlsPosition: "bottom-right",
      ...e
    }, this.options.enabled && this.init();
  }
  init() {
    try {
      this.canvas.panZoom({
        panning: this.options.panning,
        pinchZoom: this.options.pinchZoom,
        wheelZoom: !1,
        panButton: this.options.panButton,
        oneFingerPan: this.options.oneFingerPan,
        margins: this.options.margins,
        zoomFactor: this.options.zoomFactor,
        zoomMin: this.options.zoomMin,
        zoomMax: this.options.zoomMax,
        wheelZoomDeltaModeLinePixels: this.options.wheelZoomDeltaModeLinePixels,
        wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels,
        momentum: this.options.momentum,
        momentumSlowdown: this.options.momentumSlowdown
      }), this.attachWheelHandler(), this.isEnabled = !0, this.options.onPanStart && this.canvas.on("panStart", this.options.onPanStart), this.options.onPan && this.canvas.on("panning", this.options.onPan), this.options.onPanEnd && this.canvas.on("panEnd", this.options.onPanEnd), this.options.onZoom && this.canvas.on("zoom", this.options.onZoom), this.options.showControls && this.createZoomControls(), console.log("PanZoom initialized successfully with svg.panzoom.js");
    } catch (t) {
      console.warn("Failed to initialize pan/zoom:", t);
    }
  }
  /**
   * Miro-style wheel behavior on the canvas:
   *  - two-finger trackpad scroll (plain wheel) → PAN
   *  - ctrl/⌘ + wheel (pinch on trackpads, or modifier + wheel) → ZOOM at
   *    the cursor
   * Works directly on the viewBox so it's consistent with the infinite
   * canvas and independent of the plugin's wheel logic.
   */
  attachWheelHandler() {
    const t = this.canvas.node;
    !t || typeof t.addEventListener != "function" || (this._wheelHandler = (e) => {
      if (!this.isEnabled) return;
      e.preventDefault();
      const n = this.canvas.viewbox(), s = t.getBoundingClientRect(), o = s.width || n.width, r = n.width / o;
      if (e.ctrlKey || e.metaKey) {
        const a = Math.exp(-e.deltaY * 25e-4), l = this.options.zoomMin ?? 0.1, c = this.options.zoomMax ?? 10;
        let d = o / n.width * a;
        d = Math.max(l, Math.min(c, d));
        const u = o / d, f = n.height / n.width * u, g = e.clientX - s.left, p = e.clientY - s.top, y = n.x + g * r, m = n.y + p * (n.height / s.height || r), b = y - g / o * u, w = m - p / (s.height || o) * f;
        this.canvas.viewbox(b, w, u, f);
      } else
        this.canvas.viewbox(
          n.x + e.deltaX * r,
          n.y + e.deltaY * r,
          n.width,
          n.height
        );
      this.options.onPan?.(e), this.options.onZoom?.(e);
    }, t.addEventListener("wheel", this._wheelHandler, { passive: !1 }));
  }
  createZoomControls() {
    this.controlsContainer = document.createElement("div"), this.controlsContainer.className = "svg-pan-zoom-controls";
    const t = this.options.controlsPosition || "top-left";
    switch (this.controlsContainer.style.position = "absolute", this.controlsContainer.style.zIndex = "100", t) {
      case "top-left":
        this.controlsContainer.style.top = "10px", this.controlsContainer.style.left = "10px";
        break;
      case "top-right":
        this.controlsContainer.style.top = "10px", this.controlsContainer.style.right = "10px";
        break;
      case "bottom-left":
        this.controlsContainer.style.bottom = "10px", this.controlsContainer.style.left = "10px";
        break;
      case "bottom-right":
        this.controlsContainer.style.bottom = "10px", this.controlsContainer.style.right = "10px";
        break;
    }
    const e = document.createElement("button");
    e.textContent = "+", e.title = "Zoom In", e.addEventListener("click", () => this.zoomIn()), this.controlsContainer.appendChild(e);
    const n = document.createElement("button");
    n.textContent = "−", n.title = "Zoom Out", n.addEventListener("click", () => this.zoomOut()), this.controlsContainer.appendChild(n);
    const s = document.createElement("button");
    s.textContent = "⟲", s.title = "Reset View", s.addEventListener("click", () => this.reset()), this.controlsContainer.appendChild(s), this.slate.element.appendChild(this.controlsContainer);
  }
  removeZoomControls() {
    this.controlsContainer && this.controlsContainer.parentNode && (this.controlsContainer.parentNode.removeChild(this.controlsContainer), this.controlsContainer = null);
  }
  enable() {
    this.isEnabled || this.init(), this.options.enabled = !0;
  }
  disable() {
    this.isEnabled && (this.canvas.panZoom(!1), this.isEnabled = !1), this.options.enabled = !1;
  }
  enablePan() {
    this.options.panning = !0, this.isEnabled && this.canvas.panZoom({ ...this.getAllOptions(), panning: !0 });
  }
  disablePan() {
    this.options.panning = !1, this.isEnabled && this.canvas.panZoom({ ...this.getAllOptions(), panning: !1 });
  }
  enableZoom() {
    this.options.wheelZoom = !0, this.options.pinchZoom = !0, this.isEnabled && this.canvas.panZoom({ ...this.getAllOptions(), wheelZoom: !0, pinchZoom: !0 });
  }
  disableZoom() {
    this.options.wheelZoom = !1, this.options.pinchZoom = !1, this.isEnabled && this.canvas.panZoom({ ...this.getAllOptions(), wheelZoom: !1, pinchZoom: !1 });
  }
  pan(t) {
    if (this.isEnabled) {
      const e = this.canvas.viewbox();
      this.canvas.viewbox(t.x, t.y, e.width, e.height);
    }
  }
  panBy(t) {
    if (this.isEnabled) {
      const e = this.canvas.viewbox();
      this.canvas.viewbox(e.x + t.x, e.y + t.y, e.width, e.height);
    }
  }
  zoom(t, e) {
    this.isEnabled && (e ? this.canvas.zoom(t, e) : this.canvas.zoom(t));
  }
  zoomBy(t) {
    if (this.isEnabled) {
      const e = this.getZoom();
      this.canvas.zoom(e * t);
    }
  }
  /** Zoom in one step. */
  zoomIn() {
    if (this.isEnabled) {
      const t = this.getZoom();
      this.canvas.zoom(t * 1.25);
    }
  }
  /** Zoom out one step. */
  zoomOut() {
    if (this.isEnabled) {
      const t = this.getZoom();
      this.canvas.zoom(t * 0.8);
    }
  }
  zoomAtPoint(t, e) {
    this.isEnabled && this.canvas.zoom(t, e);
  }
  reset() {
    if (!this.isEnabled) return;
    const t = this.containerPx(), e = this.canvas.viewbox() || { x: 0, y: 0, width: t.w, height: t.h }, n = (e.x || 0) + (e.width || t.w) / 2, s = (e.y || 0) + (e.height || t.h) / 2;
    this.canvas.viewbox(n - t.w / 2, s - t.h / 2, t.w, t.h), this.fit();
  }
  /** Container pixel size (the infinite canvas fills its element). */
  containerPx() {
    const e = this.slate?.element?.getBoundingClientRect?.();
    return {
      w: Math.max(1, Math.round(e?.width || this.canvas.node.clientWidth || 800)),
      h: Math.max(1, Math.round(e?.height || this.canvas.node.clientHeight || 600))
    };
  }
  resetZoom() {
    this.isEnabled && this.canvas.zoom(1);
  }
  resetPan() {
    if (this.isEnabled) {
      const t = this.canvas.viewbox();
      this.canvas.viewbox(0, 0, t.width, t.height);
    }
  }
  fit() {
    if (!this.isEnabled) return;
    const t = this.slate?.nodes?.allNodes;
    if (!t || t.length === 0) return;
    let e = 1 / 0, n = 1 / 0, s = -1 / 0, o = -1 / 0;
    for (const b of t) {
      const w = b.options.x ?? 0, x = b.options.y ?? 0, _ = b.options.width ?? 100, v = b.options.height ?? 60;
      e = Math.min(e, w), n = Math.min(n, x), s = Math.max(s, w + _), o = Math.max(o, x + v);
    }
    if (!isFinite(e)) return;
    const r = s - e, a = o - n, l = 50, c = r + l * 2, h = a + l * 2, d = this.containerPx(), u = d.w / d.h, f = c / h;
    let g = c, p = h;
    f > u ? p = g / u : g = p * u, g < d.w && (g = d.w, p = d.h);
    const y = e + r / 2, m = n + a / 2;
    this.canvas.viewbox(
      y - g / 2,
      m - p / 2,
      g,
      p
    );
  }
  center() {
    if (!this.isEnabled) return;
    const t = this.slate?.nodes?.allNodes, e = this.canvas.viewbox();
    if (!t || t.length === 0) return;
    let n = 1 / 0, s = 1 / 0, o = -1 / 0, r = -1 / 0;
    for (const c of t) {
      const h = c.options.x ?? 0, d = c.options.y ?? 0, u = c.options.width ?? 100, f = c.options.height ?? 60;
      n = Math.min(n, h), s = Math.min(s, d), o = Math.max(o, h + u), r = Math.max(r, d + f);
    }
    if (!isFinite(n)) return;
    const a = (n + o) / 2, l = (s + r) / 2;
    this.canvas.viewbox(a - e.width / 2, l - e.height / 2, e.width, e.height);
  }
  /** @returns Current zoom level (1 = 100%). */
  getZoom() {
    if (!this.isEnabled) return 1;
    try {
      return this.canvas.zoom() || 1;
    } catch {
      return 1;
    }
  }
  /** @returns Current pan position as { x, y }. */
  getPan() {
    if (!this.isEnabled) return { x: 0, y: 0 };
    try {
      const t = this.canvas.viewbox();
      return { x: t.x, y: t.y };
    } catch {
      return { x: 0, y: 0 };
    }
  }
  resize() {
  }
  destroy() {
    this._wheelHandler && this.canvas.node?.removeEventListener && (this.canvas.node.removeEventListener("wheel", this._wheelHandler), this._wheelHandler = null), this.isEnabled && (this.canvas.panZoom(!1), this.canvas.off("panStart"), this.canvas.off("panning"), this.canvas.off("panEnd"), this.canvas.off("zoom"), this.removeZoomControls(), this.isEnabled = !1);
  }
  /** @returns Whether pan/zoom is initialized and enabled. */
  isInitialized() {
    return this.isEnabled;
  }
  getAllOptions() {
    return {
      panning: this.options.panning,
      pinchZoom: this.options.pinchZoom,
      wheelZoom: this.options.wheelZoom,
      panButton: this.options.panButton,
      oneFingerPan: this.options.oneFingerPan,
      margins: this.options.margins,
      zoomFactor: this.options.zoomFactor,
      zoomMin: this.options.zoomMin,
      zoomMax: this.options.zoomMax,
      wheelZoomDeltaModeLinePixels: this.options.wheelZoomDeltaModeLinePixels,
      wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels,
      momentum: this.options.momentum,
      momentumSlowdown: this.options.momentumSlowdown
    };
  }
}
class os {
  constructor(t, e = {}) {
    this.container = null, this.miniCanvas = null, this.viewportIndicator = null, this.nodeShapes = /* @__PURE__ */ new Map(), this._enabled = !1, this.isDragging = !1, this.scale = 0.1, this.dragStartX = 0, this.dragStartY = 0, this.viewportStartX = 0, this.viewportStartY = 0, this.zoomControlsContainer = null, this.boundMouseMove = null, this.boundMouseUp = null, this.refreshTimeoutId = null, this.pollIntervalId = null, this.zoomDisplayIntervalId = null, this.slate = t, this.options = {
      enabled: !1,
      position: "bottom-right",
      // Miro-style: bottom-right by default
      width: 200,
      height: 150,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      viewportColor: "rgba(66, 133, 244, 0.3)",
      viewportBorderColor: "#4285f4",
      nodeColor: "#666666",
      borderRadius: 4,
      margin: 10,
      showZoomControls: !0,
      // Show zoom controls by default
      ...e
    };
  }
  enable() {
    this._enabled || (this._enabled = !0, this.createContainer(), this.createMiniCanvas(), this.renderNodes(), this.createViewportIndicator(), this.setupEventListeners(), this.updateViewport(), this.options.showZoomControls && this.createZoomControls(), console.log("BIRDSEYE_DEBUG: BirdsEye enabled"));
  }
  disable() {
    this._enabled && (this._enabled = !1, this.removeEventListeners(), this.removeZoomControls(), this.container && this.container.parentNode && this.container.parentNode.removeChild(this.container), this.container = null, this.miniCanvas = null, this.viewportIndicator = null, this.nodeShapes.clear(), console.log("BIRDSEYE_DEBUG: BirdsEye disabled"));
  }
  isEnabled() {
    return this._enabled;
  }
  refresh() {
    this._enabled && (this.renderNodes(), this.updateViewport());
  }
  updateViewport() {
    if (!this._enabled || !this.viewportIndicator || !this.miniCanvas) return;
    const t = this.slate.panZoom;
    if (!t) return;
    const e = t.getZoom() || 1, n = t.getPan() || { x: 0, y: 0 }, s = this.options.width || 200, o = this.options.height || 150, r = this.calculateContentBounds(), a = Math.max(r.maxX - r.minX, 1), l = Math.max(r.maxY - r.minY, 1), c = 100, h = a + c * 2, d = l + c * 2;
    this.scale = Math.min(
      s / h,
      o / d
    );
    const u = (this.slate.options.viewPort?.originalWidth || 800) / e, f = (this.slate.options.viewPort?.originalHeight || 600) / e, g = (n.x - r.minX + c) * this.scale, p = (n.y - r.minY + c) * this.scale, y = u * this.scale, m = f * this.scale;
    this.viewportIndicator.move(g, p), this.viewportIndicator.size(Math.max(y, 10), Math.max(m, 10));
  }
  updateNodePosition(t) {
    if (!this._enabled) return;
    const e = this.nodeShapes.get(t.id);
    if (!e) return;
    const n = this.calculateContentBounds(), s = 100, o = (t.options.x - n.minX + s) * this.scale, r = (t.options.y - n.minY + s) * this.scale;
    this.animateShapeMove(e, o, r);
    const a = (t.options.width || 100) * this.scale, l = (t.options.height || 60) * this.scale;
    this.applyShapeRotation(e, t, o, r, a, l);
  }
  /**
   * Rotate a minimap shape to match the node's rotation, about its center.
   * Absolute (transform, not the relative .rotate()) so repeated updates don't
   * accumulate. Position (x/y attrs from move) is unaffected.
   */
  applyShapeRotation(t, e, n, s, o, r) {
    const a = e.options.rotate?.rotationAngle || 0;
    try {
      t.transform({ rotate: a, origin: [n + o / 2, s + r / 2] });
    } catch {
    }
  }
  /**
   * Q4: tween a minimap shape to (x,y) with a short easeInOutQuad rAF animation,
   * cancelling any in-flight tween so it retargets smoothly (e.g. during a drag).
   */
  animateShapeMove(t, e, n, s = 220) {
    if (typeof requestAnimationFrame > "u") {
      try {
        t.move(e, n);
      } catch {
      }
      return;
    }
    let o = e, r = n;
    try {
      o = t.x(), r = t.y();
    } catch {
    }
    if (t._beRaf)
      try {
        cancelAnimationFrame(t._beRaf);
      } catch {
      }
    const a = (h) => h < 0.5 ? 2 * h * h : 1 - Math.pow(-2 * h + 2, 2) / 2;
    let l = null;
    const c = (h) => {
      l === null && (l = h);
      const d = Math.min(1, (h - l) / s), u = a(d);
      try {
        t.move(o + (e - o) * u, r + (n - r) * u);
      } catch {
      }
      d < 1 ? t._beRaf = requestAnimationFrame(c) : t._beRaf = null;
    };
    t._beRaf = requestAnimationFrame(c);
  }
  addNodeShape(t) {
    if (!this._enabled || !this.miniCanvas) return;
    const e = this.calculateContentBounds(), n = 100, s = (t.options.x - e.minX + n) * this.scale, o = (t.options.y - e.minY + n) * this.scale, r = (t.options.width || 100) * this.scale, a = (t.options.height || 60) * this.scale;
    let l;
    if (t.options.shape === "circle") {
      const c = Math.min(r, a) / 2;
      l = this.miniCanvas.circle(c * 2).move(s, o);
    } else
      l = this.miniCanvas.rect(r, a).move(s, o);
    l.fill(t.options.backgroundColor || this.options.nodeColor), l.stroke({ width: 0 }), this.applyShapeRotation(l, t, s, o, r, a), this.nodeShapes.set(t.id, l);
    try {
      l.opacity(0), l.animate(220).opacity(1);
    } catch {
    }
    this.viewportIndicator && this.viewportIndicator.front();
  }
  removeNodeShape(t) {
    const e = this.nodeShapes.get(t);
    if (e) {
      try {
        e._beRaf && cancelAnimationFrame(e._beRaf), e.animate(180).opacity(0).after(() => {
          try {
            e.remove();
          } catch {
          }
        });
      } catch {
        try {
          e.remove();
        } catch {
        }
      }
      this.nodeShapes.delete(t);
    }
  }
  createContainer() {
    this.container = document.createElement("div"), this.container.className = "slateboxjs-birdseye";
    const t = this.options.position || "bottom-right", e = this.options.margin || 10;
    switch (this.container.style.position = "absolute", this.container.style.width = `${this.options.width}px`, this.container.style.height = `${this.options.height}px`, this.container.style.backgroundColor = this.options.backgroundColor, this.container.style.borderRadius = `${this.options.borderRadius}px`, this.container.style.border = "1px solid #ccc", this.container.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)", this.container.style.overflow = "hidden", this.container.style.zIndex = "100", t) {
      case "top-left":
        this.container.style.top = `${e}px`, this.container.style.left = `${e}px`;
        break;
      case "top-right":
        this.container.style.top = `${e}px`, this.container.style.right = `${e}px`;
        break;
      case "bottom-left":
        this.container.style.bottom = `${e}px`, this.container.style.left = `${e}px`;
        break;
      case "bottom-right":
      default:
        this.container.style.bottom = `${e}px`, this.container.style.right = `${e}px`;
        break;
    }
    this.slate.element.appendChild(this.container);
  }
  createMiniCanvas() {
    this.container && (this.miniCanvas = De().addTo(this.container).size(this.options.width, this.options.height), this.miniCanvas.rect(this.options.width, this.options.height).fill("#f8f9fa"));
  }
  renderNodes() {
    if (!this.miniCanvas) return;
    this.nodeShapes.forEach((l) => l.remove()), this.nodeShapes.clear();
    const t = this.calculateContentBounds(), e = 100, n = Math.max(t.maxX - t.minX, 1), s = Math.max(t.maxY - t.minY, 1), o = n + e * 2, r = s + e * 2;
    this.scale = Math.min(
      this.options.width / o,
      this.options.height / r
    ), this.slate.getAllNodes().forEach((l) => {
      const c = (l.options.x - t.minX + e) * this.scale, h = (l.options.y - t.minY + e) * this.scale, d = Math.max((l.options.width || 100) * this.scale, 2), u = Math.max((l.options.height || 60) * this.scale, 2);
      let f;
      if (l.options.shape === "circle") {
        const p = Math.min(d, u) / 2;
        f = this.miniCanvas.circle(p * 2).move(c, h);
      } else
        f = this.miniCanvas.rect(d, u).move(c, h);
      f.fill(l.options.backgroundColor || this.options.nodeColor), f.stroke({ width: 0 });
      const g = l.options.rotate?.rotationAngle || 0;
      if (g !== 0) {
        const p = c + d / 2, y = h + u / 2;
        f.rotate(g, p, y);
      }
      this.nodeShapes.set(l.id, f);
    });
  }
  createViewportIndicator() {
    this.miniCanvas && (this.viewportIndicator = this.miniCanvas.rect(50, 40).fill(this.options.viewportColor).stroke({ color: this.options.viewportBorderColor, width: 2 }).css({ cursor: "move" }), this.viewportIndicator.on("mousedown", (t) => {
      t.preventDefault(), t.stopPropagation();
      const e = t;
      this.isDragging = !0, this.dragStartX = e.clientX, this.dragStartY = e.clientY;
      const n = this.viewportIndicator.bbox();
      this.viewportStartX = n.x, this.viewportStartY = n.y, this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseUp = this.handleMouseUp.bind(this), document.addEventListener("mousemove", this.boundMouseMove), document.addEventListener("mouseup", this.boundMouseUp);
    }));
  }
  handleMouseMove(t) {
    if (!this.isDragging || !this.viewportIndicator) return;
    const e = t.clientX - this.dragStartX, n = t.clientY - this.dragStartY, s = this.viewportStartX + e, o = this.viewportStartY + n;
    this.viewportIndicator.move(s, o);
    const r = this.calculateContentBounds(), a = 100, l = s / this.scale + r.minX - a, c = o / this.scale + r.minY - a;
    this.slate.panZoom?.pan({ x: l, y: c });
  }
  handleMouseUp() {
    this.isDragging = !1, this.boundMouseMove && (document.removeEventListener("mousemove", this.boundMouseMove), this.boundMouseMove = null), this.boundMouseUp && (document.removeEventListener("mouseup", this.boundMouseUp), this.boundMouseUp = null);
  }
  setupEventListeners() {
    this.slate.canvas && (this.slate.canvas.on?.("zoom.birdseye", () => {
      this.updateViewport();
    }), this.slate.canvas.on?.("panning.birdseye", () => {
      this.updateViewport();
    }), this.slate.canvas.on?.("panEnd.birdseye", () => {
      this.updateViewport();
    })), this.startPolling();
  }
  /**
   * Schedule a refresh using trailing-edge debounce.
   * Waits until events settle (300ms of no activity) before refreshing.
   * This avoids unnecessary updates during continuous operations like rotation.
   */
  scheduleRefresh() {
    this.refreshTimeoutId !== null && window.clearTimeout(this.refreshTimeoutId), this.refreshTimeoutId = window.setTimeout(() => {
      this.refresh(), this.refreshTimeoutId = null;
    }, 300);
  }
  removeEventListeners() {
    this.boundMouseMove && (document.removeEventListener("mousemove", this.boundMouseMove), this.boundMouseMove = null), this.boundMouseUp && (document.removeEventListener("mouseup", this.boundMouseUp), this.boundMouseUp = null), this.isDragging = !1, this.slate.canvas && this.slate.canvas.off?.(".birdseye"), this.refreshTimeoutId !== null && (window.clearTimeout(this.refreshTimeoutId), this.refreshTimeoutId = null), this.stopPolling();
  }
  startPolling() {
    this.pollIntervalId = window.setInterval(() => {
      this._enabled && this.updateViewport();
    }, 100);
  }
  stopPolling() {
    this.pollIntervalId !== null && (window.clearInterval(this.pollIntervalId), this.pollIntervalId = null);
  }
  createZoomControls() {
    if (!this.container) return;
    this.zoomControlsContainer = document.createElement("div"), this.zoomControlsContainer.className = "slateboxjs-birdseye-zoom-controls", this.zoomControlsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding: 6px 8px;
      background: rgba(255, 255, 255, 0.95);
      border-top: 1px solid #e0e0e0;
      border-radius: 0 0 ${this.options.borderRadius}px ${this.options.borderRadius}px;
    `;
    const t = document.createElement("button");
    t.textContent = "−", t.title = "Zoom Out", t.style.cssText = this.getZoomButtonStyle(), t.addEventListener("click", () => this.slate.panZoom?.zoomOut()), this.zoomControlsContainer.appendChild(t);
    const e = document.createElement("span");
    e.id = "birdseye-zoom-display", e.style.cssText = `
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      color: #333;
      min-width: 45px;
      text-align: center;
      cursor: pointer;
    `, e.textContent = "100%", e.title = "Reset to 100%", e.addEventListener("click", () => {
      this.slate.panZoom?.reset(), this.updateZoomDisplay();
    }), this.zoomControlsContainer.appendChild(e);
    const n = document.createElement("button");
    n.textContent = "+", n.title = "Zoom In", n.style.cssText = this.getZoomButtonStyle(), n.addEventListener("click", () => this.slate.panZoom?.zoomIn()), this.zoomControlsContainer.appendChild(n), this.container.appendChild(this.zoomControlsContainer), this.startZoomDisplayUpdates();
  }
  getZoomButtonStyle() {
    return `
      width: 28px;
      height: 28px;
      border: 1px solid #e0e0e0;
      background: #f8f9fa;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    `;
  }
  updateZoomDisplay() {
    const t = this.container?.querySelector("#birdseye-zoom-display");
    if (t && this.slate.panZoom) {
      const e = this.slate.panZoom.getZoom() || 1;
      t.textContent = `${Math.round(e * 100)}%`;
    }
  }
  startZoomDisplayUpdates() {
    this.zoomDisplayIntervalId = window.setInterval(() => {
      this._enabled && this.updateZoomDisplay();
    }, 200);
  }
  removeZoomControls() {
    this.zoomDisplayIntervalId !== null && (window.clearInterval(this.zoomDisplayIntervalId), this.zoomDisplayIntervalId = null), this.zoomControlsContainer && this.zoomControlsContainer.parentNode && (this.zoomControlsContainer.parentNode.removeChild(this.zoomControlsContainer), this.zoomControlsContainer = null);
  }
  calculateContentBounds() {
    const t = this.slate.getAllNodes();
    if (t.length === 0) {
      const r = this.slate.options.viewPort?.originalWidth || 800, a = this.slate.options.viewPort?.originalHeight || 600;
      return { minX: 0, minY: 0, maxX: r, maxY: a };
    }
    let e = 1 / 0, n = 1 / 0, s = -1 / 0, o = -1 / 0;
    return t.forEach((r) => {
      const a = r.options.x || 0, l = r.options.y || 0, c = r.options.width || 100, h = r.options.height || 60;
      e = Math.min(e, a), n = Math.min(n, l), s = Math.max(s, a + c), o = Math.max(o, l + h);
    }), { minX: e, minY: n, maxX: s, maxY: o };
  }
}
function ze(i, t, e) {
  const s = (t || i.nodes.allNodes).map(
    (o) => rs(o)
  );
  return e && s.forEach((o, r) => {
    o.options._presentationIndex = r;
  }), {
    options: Ja(i.options),
    nodes: s,
    shareId: i.options.shareId || ""
  };
}
async function Nn(i, t, e = !1, n = !1) {
  const s = typeof i == "string" ? JSON.parse(i) : i;
  t.beginRemoteApply?.();
  try {
    await Qa(s, t, e, n);
  } finally {
    t.endRemoteApply?.();
  }
}
async function Qa(i, t, e, n) {
  if (i.options) {
    const o = i.options;
    Object.assign(t.options, o), i.shareId && (t.options.shareId = i.shareId), t.applyContainerStyle?.();
  }
  e || t.nodes.clear();
  const s = /* @__PURE__ */ new Map();
  if (Array.isArray(i.nodes)) {
    for (const r of i.nodes) {
      const a = as(r.options), l = t.nodes.one(a.id);
      if (l)
        Object.assign(l.options, a), a.x !== void 0 && a.y !== void 0 && l.position(a.x, a.y), s.set(a.id, l);
      else {
        const c = t.addNode(a);
        c && s.set(c.id, c);
      }
    }
    const o = [];
    for (const r of s.values())
      r.ready && o.push(r.ready);
    o.length > 0 && await Promise.all(o);
    for (const r of i.nodes) {
      const a = r.options.id || r.options.xPos !== void 0 ? qt(r.options).id : r.options.id;
      if (!a) continue;
      const l = s.get(a) || t.nodes.one(a);
      if (!l) continue;
      const c = r.relationships?.associations;
      if (!(!Array.isArray(c) || c.length === 0))
        for (const h of c) {
          const d = An(h);
          if (d.targetPoint && l?.relationships) {
            l.relationships.addFloatingAssociation(
              d.targetPoint,
              d
            );
            continue;
          }
          const u = s.get(d.childId) || t.nodes.one(d.childId);
          if (u && l)
            if (l.relationships)
              l.relationships.addAssociation(u, d);
            else
              try {
                l.connector.isEnabled() || l.connector.enable(), l.connector.connectTo(u, {
                  lineColor: d.lineColor,
                  lineWidth: d.lineWidth
                });
              } catch (f) {
                console.warn(
                  "SERIALIZATION_DEBUG: Failed to create connection",
                  d.parentId,
                  "->",
                  d.childId,
                  f
                );
              }
        }
    }
  }
  if (!n && t.panZoom) {
    const o = () => {
      const a = t.nodes?.allNodes ?? [];
      if (!a.length) return null;
      let l = 1 / 0, c = -1 / 0;
      for (const h of a) {
        const d = h.options.x ?? 0, u = h.options.width ?? 100;
        l = Math.min(l, d), c = Math.max(c, d + u);
      }
      return (l + c) / 2;
    }, r = (a) => {
      if (t._destroyed) return;
      const l = t.element?.getBoundingClientRect?.(), c = !!l && l.width > 1 && l.height > 1, h = o();
      if (c && h !== null) {
        try {
          t.fitToContent();
        } catch {
        }
        const d = t.canvas?.viewbox?.();
        if (d && Math.abs(d.x + d.width / 2 - h) < d.width / 2) {
          typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
            try {
              t.fitToContent();
            } catch {
            }
          });
          return;
        }
      }
      a < 60 && setTimeout(() => r(a + 1), 50);
    };
    r(0);
  }
}
function rs(i) {
  const t = bt(i.options);
  if (i.svgGroup)
    try {
      const n = i.svgGroup.bbox();
      t.xPos = i.options.x ?? n.x, t.yPos = i.options.y ?? n.y;
    } catch {
      t.xPos = i.options.x ?? 0, t.yPos = i.options.y ?? 0;
    }
  if (i.getRotation) {
    const n = i.getRotation();
    n !== 0 && (t.rotate = { rotationAngle: n });
  }
  const e = [];
  if (i.relationships && typeof i.relationships.serialize == "function") {
    const n = i.relationships.serialize();
    n?.associations && e.push(
      ...n.associations.map((s) => Rn(s))
    );
  } else if (i.connector) {
    const n = i.connector.getConnections();
    for (const s of n)
      (s.source === i || s.source?.id === i.id) && e.push({
        childId: s.target?.id || s.target,
        parentId: i.id,
        isStraightLine: !1,
        lineColor: s.lineColor || "#000",
        lineEffect: "",
        lineOpacity: 1,
        lineType: "bezier",
        lineCurviness: 0.1,
        lineCurveType: "cubic",
        lineWidth: s.lineWidth || 6
      });
  }
  return {
    options: t,
    relationships: {
      associations: e
    }
  };
}
function as(i) {
  return qt(i);
}
function Ja(i) {
  const t = {}, e = [
    "id",
    "name",
    "description",
    "container",
    "instance",
    "shareId",
    "enabled",
    "allowDrag",
    "followMe",
    "mindMapMode",
    "autoResizeNodesBasedOnText",
    "useLayoutQuadrants",
    "autoEnableDefaultFilters",
    "showbirdsEye",
    "sizeOfbirdsEye",
    "showMultiSelect",
    "showZoom",
    "showUndoRedo",
    "showStatus",
    "showLocks",
    "isPublic",
    "isUnlisted",
    "isPrivate",
    "isTemplate",
    "basedOnTemplate",
    "basedOnThemeId",
    "syncWithTheme",
    "allowCollaboration",
    "eligibleForThemeCompilation",
    "defaultLineColor",
    "themeId",
    "layoutType",
    "disableAutoLayoutOfManuallyPositionedNodes",
    "nodeOrder",
    "huddleType",
    "huddleEnabled",
    "tags",
    "templateMarkdown",
    "templatePrompt",
    "ai"
  ];
  for (const n of e)
    i[n] !== void 0 && (t[n] = i[n]);
  return i.viewPort && (t.viewPort = { ...i.viewPort }), i.containerStyle && (t.containerStyle = { ...i.containerStyle }), t;
}
function ls(i) {
  return ze(i);
}
const tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deserialize: Nn,
  deserializeNodeOptions: as,
  serialize: ze,
  serializeNode: rs,
  snapshot: ls
}, Symbol.toStringTag, { value: "Module" }));
class cs {
  constructor(t, e = {}) {
    this.undoStack = [], this.redoStack = [], this.debounceTimer = null, this.isRestoring = !1, this.slate = t, this.options = {
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
      this.debounceTimer && clearTimeout(this.debounceTimer), this.debounceTimer = setTimeout(() => {
        this.debounceTimer = null, this.takeSnapshot();
      }, this.options.debounceMs);
    }
  }
  /**
   * Take an immediate snapshot, bypassing the debounce timer.
   * Useful for programmatic undo/redo sequences where you need
   * guaranteed snapshot state right now (e.g., tests, scripts).
   */
  forceSnapshot() {
    !this.options.enabled || this.isRestoring || (this.debounceTimer && (clearTimeout(this.debounceTimer), this.debounceTimer = null), this.takeSnapshot());
  }
  /**
   * Undo the last change. Restores the previous snapshot.
   */
  undo() {
    if (this.debounceTimer && this.forceSnapshot(), this.undoStack.length <= 1)
      return console.log("UNDOREDO_DEBUG: Nothing to undo"), !1;
    const t = this.undoStack.pop();
    this.redoStack.push(t);
    const e = this.undoStack[this.undoStack.length - 1];
    return this.restore(e), console.log(
      "UNDOREDO_DEBUG: Undo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    ), this.slate.options.events?.onTakeSnapshot?.({ action: "undo" }), !0;
  }
  /**
   * Redo the last undone change.
   */
  redo() {
    if (this.redoStack.length === 0)
      return console.log("UNDOREDO_DEBUG: Nothing to redo"), !1;
    const t = this.redoStack.pop();
    return this.undoStack.push(t), this.restore(t), console.log(
      "UNDOREDO_DEBUG: Redo performed. Undo stack:",
      this.undoStack.length,
      "Redo stack:",
      this.redoStack.length
    ), this.slate.options.events?.onTakeSnapshot?.({ action: "redo" }), !0;
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
    this.undoStack = [], this.redoStack = [], this.debounceTimer && clearTimeout(this.debounceTimer);
  }
  /** Destroy the undo/redo system, clearing all history and references */
  destroy() {
    this.clear(), this.isRestoring = !1, this.slate = null;
  }
  // ─── Private ─────────────────────────────────────────────────────
  takeSnapshot() {
    let t;
    try {
      t = ze(this.slate);
    } catch {
      return;
    }
    this.redoStack = [], this.undoStack.push(t), this.undoStack.length > this.options.maxHistory && this.undoStack.shift(), console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
  }
  restore(t) {
    this.isRestoring = !0, Nn(t, this.slate, !1, !0).catch((e) => console.error("UNDOREDO_DEBUG: Restore failed", e)).finally(() => {
      this.isRestoring = !1;
    });
  }
}
class hs {
  constructor(t, e = {}) {
    this.selectionRect = null, this.startPoint = null, this.isSelecting = !1, this._winMove = null, this._winUp = null, this.slate = t, this.options = {
      enabled: !0,
      selectionColor: "#4a90e2",
      selectionOpacity: 0.15,
      ...e
    }, this.options.enabled && this.bindEvents();
  }
  enable() {
    this.options.enabled = !0, this.bindEvents();
  }
  disable() {
    this.options.enabled = !1, this.unbindEvents(), this.cancelSelection();
  }
  isEnabled() {
    return this.options.enabled;
  }
  // ─── Event binding ───────────────────────────────────────────────
  bindEvents() {
    const t = this.slate.canvas;
    t && t.on("pointerdown.multiselect", (e) => {
      if (!this.options.enabled) return;
      const n = e.target;
      if (!(n === t.node || n?.tagName === "svg")) return;
      const o = this.getSvgPoint(e);
      o && (this.startPoint = o, this.isSelecting = !0, this.selectionRect = t.rect(0, 0).move(o.x, o.y).fill({
        color: this.options.selectionColor,
        opacity: this.options.selectionOpacity
      }).stroke({
        color: this.options.selectionColor,
        width: 1,
        dasharray: "4,4"
      }).attr("pointer-events", "none"), this._winMove = (r) => this.onSelectMove(r), this._winUp = (r) => this.onSelectUp(r), window.addEventListener("pointermove", this._winMove, !0), window.addEventListener("pointerup", this._winUp, !0));
    });
  }
  onSelectMove(t) {
    if (!this.isSelecting || !this.startPoint || !this.selectionRect) return;
    const e = this.getSvgPoint(t);
    if (!e) return;
    const n = Math.min(this.startPoint.x, e.x), s = Math.min(this.startPoint.y, e.y), o = Math.abs(e.x - this.startPoint.x), r = Math.abs(e.y - this.startPoint.y);
    this.selectionRect.move(n, s).size(o, r);
  }
  onSelectUp(t) {
    if (this.detachWindowHandlers(), !this.isSelecting || !this.startPoint) {
      this.cancelSelection();
      return;
    }
    const e = this.getSvgPoint(t);
    if (e) {
      const n = Math.min(this.startPoint.x, e.x), s = Math.min(this.startPoint.y, e.y), o = Math.abs(e.x - this.startPoint.x), r = Math.abs(e.y - this.startPoint.y);
      o > 5 && r > 5 && this.selectNodesInRect(n, s, o, r, t.shiftKey);
    }
    this.cancelSelection();
  }
  detachWindowHandlers() {
    this._winMove && (window.removeEventListener("pointermove", this._winMove, !0), this._winMove = null), this._winUp && (window.removeEventListener("pointerup", this._winUp, !0), this._winUp = null);
  }
  unbindEvents() {
    const t = this.slate.canvas;
    t && (t.off("pointerdown.multiselect"), this.detachWindowHandlers());
  }
  cancelSelection() {
    this.isSelecting = !1, this.startPoint = null, this.selectionRect && (this.selectionRect.remove(), this.selectionRect = null);
  }
  // ─── Node selection ──────────────────────────────────────────────
  selectNodesInRect(t, e, n, s, o) {
    const r = [], a = this.slate.nodes.allNodes;
    for (const l of a)
      try {
        const c = l.options, h = c.x ?? 0, d = c.y ?? 0, u = c.width ?? 0, f = c.height ?? 0;
        h < t + n && h + u > t && d < e + s && d + f > e && r.push(l);
      } catch {
      }
    r.length > 0 && (this.slate.selectNodes(r, o), this.slate._rubberBandSelectedAt = Date.now(), console.log(
      "MULTISELECT_DEBUG: Selected",
      r.length,
      "nodes in rectangle"
    ));
  }
  // ─── Helpers ─────────────────────────────────────────────────────
  getSvgPoint(t) {
    try {
      const n = this.slate.canvas.node, s = n.createSVGPoint();
      s.x = t.clientX, s.y = t.clientY;
      const o = s.matrixTransform(n.getScreenCTM().inverse());
      return { x: o.x, y: o.y };
    } catch {
      return null;
    }
  }
  // ─── Group operations ────────────────────────────────────────────
  /** Delete all selected nodes */
  deleteSelected() {
    const t = this.slate.getSelectedNodes();
    for (const e of t)
      this.slate.removeNode(e.id);
    this.slate.clearSelection();
  }
  /** Move all selected nodes by a delta */
  moveSelected(t, e) {
    const n = this.slate.getSelectedNodes();
    for (const s of n) {
      const o = (s.options.x || 0) + t, r = (s.options.y || 0) + e;
      s.position(o, r);
    }
  }
}
class ds {
  constructor(t, e = {}) {
    this.gridGroup = null, this.isVisible = !1, this.slate = t, this.options = {
      enabled: !1,
      gridSize: 20,
      gridColor: "#e0e0e0",
      gridOpacity: 0.5,
      snapToGrid: !1,
      snapToObjects: !1,
      ...e
    };
  }
  /** Show the grid overlay */
  show() {
    this.isVisible || (this.isVisible = !0, this.render());
  }
  /** Hide the grid overlay */
  hide() {
    this.isVisible = !1, this.gridGroup && (this.gridGroup.remove(), this.gridGroup = null);
  }
  /** Destroy the grid and clean up */
  destroy() {
    this.hide();
  }
  /** Toggle grid visibility */
  toggle() {
    this.isVisible ? this.hide() : this.show();
  }
  /** Check if grid is currently visible */
  isShown() {
    return this.isVisible;
  }
  /** Snap a coordinate to the nearest grid point */
  snapPoint(t, e) {
    if (!this.options.snapToGrid) return { x: t, y: e };
    const n = this.options.gridSize;
    return {
      x: Math.round(t / n) * n,
      y: Math.round(e / n) * n
    };
  }
  /** Update grid options */
  updateOptions(t) {
    Object.assign(this.options, t), this.isVisible && (this.hide(), this.show());
  }
  // ─── Private ─────────────────────────────────────────────────────
  render() {
    if (!this.slate.canvas) return;
    this.gridGroup && this.gridGroup.remove();
    const t = this.slate.canvas, e = t.viewbox(), n = this.options.gridSize, s = this.options.gridColor, o = this.options.gridOpacity, r = Math.floor(e.x / n) * n - n * 5, a = Math.floor(e.y / n) * n - n * 5, l = e.x + e.width + n * 5, c = e.y + e.height + n * 5;
    this.gridGroup = t.group().attr("pointer-events", "none");
    for (let h = r; h <= l; h += n)
      this.gridGroup.line(h, a, h, c).stroke({ color: s, width: 0.5, opacity: o });
    for (let h = a; h <= c; h += n)
      this.gridGroup.line(r, h, l, h).stroke({ color: s, width: 0.5, opacity: o });
    this.gridGroup.back();
  }
}
class us {
  constructor(t, e = {}) {
    this.boundHandler = null, this.clipboard = [], this.nudgeTimer = null, this.slate = t, this.options = {
      enabled: !0,
      nudgeDistance: 5,
      ...e
    };
  }
  /** Bind global keyboard shortcuts */
  bindGlobal() {
    this.boundHandler || (this.boundHandler = (t) => this.handleKeyDown(t), document.addEventListener("keydown", this.boundHandler), console.log("KEYBOARD_DEBUG: Global bindings active"));
  }
  /** Unbind global keyboard shortcuts */
  unbindGlobal() {
    this.boundHandler && (document.removeEventListener("keydown", this.boundHandler), this.boundHandler = null, console.log("KEYBOARD_DEBUG: Global bindings removed"));
  }
  /** Enable keyboard shortcuts */
  enable() {
    this.options.enabled = !0;
  }
  /** Disable keyboard shortcuts (keeps bindings, ignores events) */
  disable() {
    this.options.enabled = !1;
  }
  // ─── Private ─────────────────────────────────────────────────────
  handleKeyDown(t) {
    if (!this.options.enabled) return;
    const e = t.target;
    if (e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable)
      return;
    const n = t.ctrlKey || t.metaKey;
    switch (t.key) {
      case "Delete":
      case "Backspace":
        this.deleteSelected(t);
        break;
      case "z":
        n && t.shiftKey ? this.redo(t) : n && this.undo(t);
        break;
      case "y":
        n && this.redo(t);
        break;
      case "a":
        n && this.selectAll(t);
        break;
      case "c":
        n && this.copySelected(t);
        break;
      case "v":
        n && this.pasteClipboard(t);
        break;
      case "d":
        n && this.duplicateSelected(t);
        break;
      case "]":
        n && this.bringToFront(t);
        break;
      case "[":
        n && this.sendToBack(t);
        break;
      case "Escape":
        this.deselect(t);
        break;
      case "?":
        console.log(
          `SlateboxJS Keyboard Shortcuts:
  Delete/Backspace — remove selected
  Ctrl+Z — undo
  Ctrl+Y — redo
  Ctrl+A — select all
  Ctrl+C / Ctrl+V — copy / paste
  Ctrl+D — duplicate
  Ctrl+] / Ctrl+[ — bring to front / send to back
  Escape — deselect
  Arrow keys — nudge selected (1px)
  Tab — focus next node
  Enter/Space — select focused node
  ? — show this help`
        ), this.slate.announce?.("Keyboard shortcuts reference logged to console");
        break;
      case "F2":
        this.startInlineEditSelected(t);
        break;
      case "Enter":
        if (this.startInlineEditSelected(t)) break;
        this.selectFocused(t);
        break;
      case " ":
        this.selectFocused(t);
        break;
      case "Tab":
        break;
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        this.handleArrowKey(t);
        break;
    }
  }
  deleteSelected(t) {
    const e = this.slate.getSelectedNodes();
    if (e.length !== 0 && !(this.slate.isReadOnly?.() || this.slate.isCommentOnly?.())) {
      t.preventDefault();
      for (const n of [...e])
        n.options?.isComment && !this.slate.canRemoveComments?.() || this.slate.removeNode(n.id);
      this.slate.clearSelection();
    }
  }
  undo(t) {
    t.preventDefault(), this.slate.undoRedo && this.slate.undoRedo.undo();
  }
  redo(t) {
    t.preventDefault(), this.slate.undoRedo && this.slate.undoRedo.redo();
  }
  selectAll(t) {
    t.preventDefault();
    const e = this.slate.nodes.allNodes;
    e.length > 0 && this.slate.selectNodes(e, !1);
  }
  deselect(t) {
    t.preventDefault(), this.slate.clearSelection();
  }
  /**
   * A serializable snapshot of a node's paintable options — enough to recreate
   * it, minus identity (id) and relationship arrays (which reference the OLD node
   * ids and would create dangling connections on a copy).
   */
  snapshotNode(t) {
    let e = {};
    try {
      e = JSON.parse(JSON.stringify(t.options || {}));
    } catch {
      e = { ...t.options || {} };
    }
    return delete e.id, delete e.parentArrowForChildren, delete e.noChildArrowForChildren, delete e.associations, delete e.relationships, e;
  }
  /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
  copySelected(t) {
    const e = this.slate.getSelectedNodes?.() || [];
    e.length !== 0 && (t.preventDefault(), this.clipboard = e.map((n) => this.snapshotNode(n)), this.slate.announce?.(`Copied ${this.clipboard.length} node(s)`));
  }
  /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
  pasteClipboard(t) {
    this.clipboard.length !== 0 && (t.preventDefault(), this.createCopies(this.clipboard, 20));
  }
  /** Ctrl/Cmd+] — bring the selected node(s) to the front of the z-order. */
  bringToFront(t) {
    const e = this.slate.getSelectedNodes?.() || [];
    if (e.length !== 0) {
      t.preventDefault();
      for (const n of e) n.toFront?.();
    }
  }
  /** Ctrl/Cmd+[ — send the selected node(s) to the back of the z-order. */
  sendToBack(t) {
    const e = this.slate.getSelectedNodes?.() || [];
    if (e.length !== 0) {
      t.preventDefault();
      for (const n of e) n.toBack?.();
    }
  }
  /** Ctrl/Cmd+D — duplicate the current selection in place (offset). */
  duplicateSelected(t) {
    const e = this.slate.getSelectedNodes?.() || [];
    if (e.length === 0) return;
    t.preventDefault();
    const n = e.map((s) => this.snapshotNode(s));
    this.createCopies(n, 20);
  }
  /**
   * Create fresh nodes from option snapshots, offset by (offset,offset) and each
   * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
   * so copies persist + sync to collab peers like any other added node.
   */
  createCopies(t, e) {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const n = [];
    for (const s of t) {
      const o = { ...s };
      o.id = Zt(), o.x = (o.x || 0) + e, o.y = (o.y || 0) + e;
      try {
        const r = this.slate.addNode(o);
        r && n.push(r);
      } catch {
      }
    }
    if (n.length > 0) {
      const s = () => this.slate.selectNodes?.(n, !1), o = n.map((r) => r?.ready).filter(Boolean);
      o.length ? Promise.all(o).then(s).catch(s) : setTimeout(s, 120), this.slate.announce?.(`Pasted ${n.length} node(s)`);
    }
  }
  nudge(t, e, n) {
    const s = this.slate.getSelectedNodes();
    if (s.length !== 0) {
      n.preventDefault();
      for (const o of s) {
        const r = (o.options.x || 0) + t, a = (o.options.y || 0) + e;
        o.position(r, a);
      }
      this.nudgeTimer && clearTimeout(this.nudgeTimer), this.nudgeTimer = setTimeout(() => {
        this.nudgeTimer = null;
        const o = this.slate.getSelectedNodes?.() || [];
        o.length > 0 && this.slate.broadcast?.("onNodesMove", {
          nodeOptions: o.map((r) => bt(r.options))
        });
      }, 250);
    }
  }
  handleArrowKey(t) {
    if (this.slate.getSelectedNodes().length > 0) {
      const n = this.options.nudgeDistance;
      switch (t.key) {
        case "ArrowUp":
          this.nudge(0, -n, t);
          break;
        case "ArrowDown":
          this.nudge(0, n, t);
          break;
        case "ArrowLeft":
          this.nudge(-n, 0, t);
          break;
        case "ArrowRight":
          this.nudge(n, 0, t);
          break;
      }
    } else {
      const n = this.slate.getAllNodes();
      if (n.length === 0) return;
      const s = document.activeElement, o = n.findIndex((a) => a.svgGroup?.node === s);
      let r = o;
      t.key === "ArrowRight" || t.key === "ArrowDown" ? r = o < 0 ? 0 : Math.min(o + 1, n.length - 1) : r = o < 0 ? n.length - 1 : Math.max(o - 1, 0), r >= 0 && r < n.length && (t.preventDefault(), n[r].svgGroup?.node?.focus());
    }
  }
  selectFocused(t) {
    const e = document.activeElement, s = this.slate.getAllNodes().find((o) => o.svgGroup?.node === e);
    s && (t.preventDefault(), this.slate.selectNodes([s], !1));
  }
  /**
   * If exactly one node is selected, begin inline text editing on it.
   * Returns true when it started an edit (so callers can stop falling through).
   * Skips SVG-content nodes (they have no editable text).
   */
  startInlineEditSelected(t) {
    const e = this.slate.selectedNodes || [];
    if (e.length !== 1) return !1;
    const n = e[0];
    return !n?.editor?.startInline || n.nestedSvg ? !1 : (t.preventDefault(), n.editor.startInline(), !0);
  }
}
class fs {
  constructor(t) {
    this.el = null, this.targetNodes = [], this.boundContext = null, this.boundDismiss = null, this.boundEsc = null, this.slate = t;
  }
  /** Bind the global contextmenu handler. */
  enable() {
    this.boundContext || (this.boundContext = (t) => this.onContextMenu(t), document.addEventListener("contextmenu", this.boundContext, !0));
  }
  /** Unbind + close. */
  disable() {
    this.boundContext && (document.removeEventListener("contextmenu", this.boundContext, !0), this.boundContext = null), this.close();
  }
  // ─── Private ─────────────────────────────────────────────────────
  onContextMenu(t) {
    const s = t.target?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
    if (!s) {
      this.close();
      return;
    }
    const o = this.slate.nodes?.one?.(s);
    if (!o) return;
    t.preventDefault(), (this.slate.getSelectedNodes?.() || []).includes(o) || this.slate.selectNodes?.([o], !1), this.open(t.clientX, t.clientY);
  }
  open(t, e) {
    this.close();
    const n = document.createElement("div");
    n.className = "sb-context-menu", n.style.cssText = "position:fixed;z-index:100000;background:#fff;border:1px solid #e3e5ea;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,0.18);padding:4px 0;min-width:180px;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#222;user-select:none;", n.style.left = `${t}px`, n.style.top = `${e}px`, this.targetNodes = [...this.slate.getSelectedNodes?.() || []];
    const s = this.targetNodes.length, o = [
      { label: "Bring to front", act: () => this.forEachTarget((a) => a.toFront?.()) },
      { label: "Send to back", act: () => this.forEachTarget((a) => a.toBack?.()) },
      { label: "Duplicate", act: () => this.duplicateTargets() },
      { label: "Delete", act: () => this.deleteTargets(), danger: !0 }
    ];
    s >= 2 && o.push(
      { divider: !0 },
      { label: "Align left", act: () => this.slate.alignNodes?.("left", this.targetNodes) },
      { label: "Align center", act: () => this.slate.alignNodes?.("centerH", this.targetNodes) },
      { label: "Align right", act: () => this.slate.alignNodes?.("right", this.targetNodes) },
      { label: "Align top", act: () => this.slate.alignNodes?.("top", this.targetNodes) },
      { label: "Align middle", act: () => this.slate.alignNodes?.("middle", this.targetNodes) },
      { label: "Align bottom", act: () => this.slate.alignNodes?.("bottom", this.targetNodes) }
    ), s >= 3 && o.push(
      { label: "Distribute horizontally", act: () => this.slate.distributeNodes?.("horizontal", this.targetNodes) },
      { label: "Distribute vertically", act: () => this.slate.distributeNodes?.("vertical", this.targetNodes) }
    );
    for (const a of o) {
      if (a.divider) {
        const c = document.createElement("div");
        c.style.cssText = "height:1px;background:#e3e5ea;margin:4px 0;", n.appendChild(c);
        continue;
      }
      const l = document.createElement("div");
      l.textContent = a.label || "", l.style.cssText = "padding:7px 16px;cursor:pointer;white-space:nowrap;" + (a.danger ? "color:#d32f2f;" : ""), l.addEventListener("mouseenter", () => {
        l.style.background = a.danger ? "#fdecea" : "#f2f4f7";
      }), l.addEventListener("mouseleave", () => {
        l.style.background = "";
      }), l.addEventListener("click", (c) => {
        c.stopPropagation();
        try {
          a.act?.();
        } catch {
        }
        this.close();
      }), n.appendChild(l);
    }
    document.body.appendChild(n), this.el = n;
    const r = n.getBoundingClientRect();
    r.right > window.innerWidth && (n.style.left = `${Math.max(4, window.innerWidth - r.width - 8)}px`), r.bottom > window.innerHeight && (n.style.top = `${Math.max(4, window.innerHeight - r.height - 8)}px`), this.boundDismiss = (a) => {
      this.el && !this.el.contains(a.target) && this.close();
    }, this.boundEsc = (a) => {
      a.key === "Escape" && this.close();
    }, setTimeout(() => {
      this.boundDismiss && document.addEventListener("pointerdown", this.boundDismiss, !0), this.boundEsc && document.addEventListener("keydown", this.boundEsc, !0);
    }, 0);
  }
  close() {
    this.el && (this.el.remove(), this.el = null), this.boundDismiss && (document.removeEventListener("pointerdown", this.boundDismiss, !0), this.boundDismiss = null), this.boundEsc && (document.removeEventListener("keydown", this.boundEsc, !0), this.boundEsc = null);
  }
  forEachTarget(t) {
    for (const e of this.targetNodes) t(e);
  }
  /** Delete the target nodes (removeNode broadcasts onNodeDeleted → persists). */
  deleteTargets() {
    if (!(this.slate.isReadOnly?.() || this.slate.isCommentOnly?.())) {
      for (const t of [...this.targetNodes]) this.slate.removeNode?.(t.id);
      this.slate.clearSelection?.();
    }
  }
  /** Duplicate the target nodes offset (+20,+20); addNode broadcasts → persists. */
  duplicateTargets() {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const t = [];
    for (const e of this.targetNodes) {
      let n;
      try {
        n = JSON.parse(JSON.stringify(e.options || {}));
      } catch {
        n = { ...e.options || {} };
      }
      n.id = Zt(), n.x = (n.x || 0) + 20, n.y = (n.y || 0) + 20, delete n.parentArrowForChildren, delete n.noChildArrowForChildren, delete n.associations;
      try {
        const s = this.slate.addNode?.(n);
        s && t.push(s);
      } catch {
      }
    }
    t.length > 0 && setTimeout(() => this.slate.selectNodes?.(t, !1), 100);
  }
}
function Dn(i, t = {}, e) {
  const n = i.canvas;
  if (!n) {
    const s = "";
    return e?.(s), s;
  }
  try {
    const s = n.node.cloneNode(!0), o = [
      // All svg.select.js overlays (handles, rotate handle, bounding rect,
      // selection shape) — matched by prefix so none are missed.
      '[class*="svg_select"]',
      ".connection-handle",
      // node drag-to-connect plugs
      ".connector-handle",
      // line endpoint drag handles (distinct class!)
      // UI chrome that shouldn't appear in an exported diagram:
      ".comment-badge",
      // comment-count badges (rendered in the node group)
      ".node-link-badge",
      // link indicator badge (also in the node group)
      ".node-cog",
      // selection toolbar (delete/connect/cog pill)
      ".node-toolbar",
      ".line-cog",
      // line selection pill (delete/cog) — parallel to the node cog
      ".line-toolbar",
      "#slate-coordinates"
    ];
    for (const l of o)
      s.querySelectorAll(l).forEach((h) => h.remove());
    if (t.noBackground) {
      const l = s.querySelector("rect[data-background]");
      l && l.remove();
    }
    if (t.backgroundOnly)
      s.querySelectorAll("[data-node-id]").forEach((c) => c.remove());
    else if (t.nodes) {
      const l = new Set(
        t.nodes.map((h) => typeof h == "string" ? h : h.id)
      );
      s.querySelectorAll("[data-node-id]").forEach((h) => {
        const d = h.getAttribute("data-node-id");
        d && !l.has(d) && h.remove();
      });
    }
    let a = new XMLSerializer().serializeToString(s);
    return a = `<?xml version="1.0" encoding="UTF-8"?>
` + a, e?.(a), a;
  } catch (s) {
    console.error("EXPORT_DEBUG: SVG export failed:", s);
    const o = "";
    return e?.(o), o;
  }
}
async function ps(i, t = {}, e) {
  const n = Dn(i, t);
  if (!n) {
    const o = t.asBinary ? new Blob() : "";
    return e?.(o), o;
  }
  const s = t.scale || 2;
  try {
    const r = i.canvas.viewbox(), a = r.width * s, l = r.height * s, c = document.createElement("canvas");
    c.width = a, c.height = l;
    const h = c.getContext("2d");
    t.alpha || (h.fillStyle = i.options.containerStyle?.backgroundColor || "#ffffff", h.fillRect(0, 0, a, l));
    const d = new Image(), u = new Blob([n], {
      type: "image/svg+xml;charset=utf-8"
    }), f = URL.createObjectURL(u);
    return new Promise((g, p) => {
      d.onload = () => {
        if (h.drawImage(d, 0, 0, a, l), URL.revokeObjectURL(f), t.asBinary)
          c.toBlob(
            (y) => {
              const m = y || new Blob();
              e?.(m), g(m);
            },
            "image/png"
          );
        else {
          const y = c.toDataURL("image/png"), m = t.base64 ? y.split(",")[1] : y;
          e?.(m), g(m);
        }
      }, d.onerror = (y) => {
        URL.revokeObjectURL(f), console.error("EXPORT_DEBUG: PNG rendering failed:", y);
        const m = t.asBinary ? new Blob() : "";
        e?.(m), g(m);
      }, d.src = f;
    });
  } catch (o) {
    console.error("EXPORT_DEBUG: PNG export failed:", o);
    const r = t.asBinary ? new Blob() : "";
    return e?.(r), r;
  }
}
const el = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPNG: ps,
  exportSVG: Dn
}, Symbol.toStringTag, { value: "Module" }));
class gs {
  constructor(t, e = {}) {
    this.doc = null, this.provider = null, this.collabMap = null, this.awareness = null, this.isConnected = !1, this.clientID = 0, this.cursorElements = /* @__PURE__ */ new Map(), this._cursorMoveHandler = null, this._cursorTrackingNode = null, this.slate = t, this.options = {
      wsUrl: "ws://localhost:1234",
      roomName: "default-slate",
      userName: "Anonymous",
      userColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      ...e
    };
  }
  /**
   * Initialize collaboration.
   * Requires yjs and y-websocket to be installed.
   */
  async init(t) {
    t && Object.assign(this.options, t);
    try {
      const e = this.options.Y || await import(
        /* @vite-ignore */
        "yjs"
      ), n = this.options.WebsocketProvider || (await import(
        /* @vite-ignore */
        "y-websocket"
      )).WebsocketProvider;
      this.doc = new e.Doc(), this.clientID = this.doc.clientID;
      let s;
      const o = this.slate.options.events?.onInitCollaboration;
      if (o)
        try {
          s = await o(this.clientID.toString()) || void 0;
        } catch (a) {
          console.warn(
            "COLLAB_DEBUG: onInitCollaboration threw; using static options",
            a
          );
        }
      s && (this.userBaseData = s, s.websocketUrl && (this.options.wsUrl = s.websocketUrl), s.websocketParams && (this.options.wsParams = s.websocketParams), s.userName && (this.options.userName = s.userName), s.color && (this.options.userColor = s.color)), this.collabMap = this.doc.getMap("collabPackages"), this.collabMap.observe((a) => {
        a.transaction.local || a.changes.keys.forEach((l, c) => {
          if (l.action === "add" || l.action === "update") {
            const h = this.collabMap.get(c);
            h && this.handleRemotePackage(h);
          }
        });
      }), this.provider = new n(
        this.options.wsUrl,
        this.options.roomName,
        this.doc,
        {
          connect: !0,
          params: this.options.wsParams || {}
        }
      ), this.awareness = this.provider.awareness, this.awareness.setLocalStateField("user", {
        name: this.options.userName,
        color: this.options.userColor
      });
      const r = () => {
        const a = this.getCollabUsers();
        this.options.onAwarenessChange?.(a), this.slate.options.events?.onCollaborationUsersChanged?.(a), this.renderRemoteCursors(a);
      };
      this.awareness.on("change", r), this.setupCursorTracking(), this.getCollabUsers().length > 0 && r(), this.provider.on("status", (a) => {
        this.isConnected = a.status === "connected", this.options.onStatusChange?.(a.status);
      }), console.log(
        "COLLAB_DEBUG: Initialized collaboration for room",
        this.options.roomName,
        "clientID:",
        this.clientID
      );
    } catch (e) {
      const n = e;
      n.code === "MODULE_NOT_FOUND" || n.message?.includes("Cannot find module") ? console.warn(
        "COLLAB_DEBUG: yjs/y-websocket not installed. Collaboration disabled.",
        "Install with: npm install yjs y-websocket"
      ) : console.error("COLLAB_DEBUG: Failed to initialize collaboration:", n);
    }
  }
  /**
   * Execute collab packages locally (from Invoker).
   */
  invoke(t) {
    const e = Array.isArray(t) ? t : [t];
    for (const n of e)
      this.exe(n);
  }
  /**
   * Send collab packages to remote peers.
   *
   * v1 contract: every send() surfaced back to the host through
   * `onSlateChanged` (the yjs local-echo drove the app's save flow), so
   * emit for each package after transmitting — the host's persistence
   * depends on it even when no collab server is connected.
   */
  send(t) {
    const e = Array.isArray(t) ? t : [t];
    if (this.collabMap)
      for (const n of e) {
        const s = `${n.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (n.type === "onLinePropertiesChanged" && this.pruneSupersededLineProperty(n.data), this.collabMap.set(s, {
          ...n,
          clientID: this.clientID,
          timestamp: Date.now()
        }), n.type === "onNodeDeleted") {
          const o = n.data?.id;
          o != null && this.pruneNodePackages(o);
        }
      }
    else
      console.log(
        "COLLAB_DEBUG: send() before collab init — emitting locally only"
      );
    for (const n of e)
      this.slate.emitSlateChange?.(n.type, n.data);
  }
  /**
   * Remove a node's accumulated packages (onNodeAdded + onNodeXXXChanged) from
   * the shared collab doc so a reload/sync replay can't recreate a deleted node.
   * Keeps onNodeDeleted tombstones (harmless no-ops on replay). Node packages
   * carry data.id; move/batch packages use array data and are left alone.
   */
  pruneNodePackages(t) {
    if (this.collabMap)
      try {
        const e = [];
        this.collabMap.forEach((n, s) => {
          const o = n?.data;
          (o && !Array.isArray(o) ? o.id : void 0) === t && n?.type !== "onNodeDeleted" && e.push(s);
        });
        for (const n of e) this.collabMap.delete(n);
      } catch {
      }
  }
  /**
   * Remove earlier onLinePropertiesChanged packages that target the SAME
   * property on the SAME association, so a reload/sync replay applies only the
   * latest value. Matches on (node id, associationId, prop). Guards the "the
   * Absolute/Relative (and Bezier/Orthogonal) toggle reverts after reload" bug:
   * the doc kept both the old and new value and replay order — not recency —
   * decided the winner.
   */
  pruneSupersededLineProperty(t) {
    if (!this.collabMap || !t || Array.isArray(t)) return;
    const { id: e, associationId: n, prop: s } = t;
    if (s != null)
      try {
        const o = [];
        this.collabMap.forEach((r, a) => {
          if (r?.type !== "onLinePropertiesChanged") return;
          const l = r?.data;
          !l || Array.isArray(l) || l.id === e && l.associationId === n && l.prop === s && o.push(a);
        });
        for (const r of o) this.collabMap.delete(r);
      } catch {
      }
  }
  /**
   * Execute a single collab package using the Invoker.
   */
  exe(t) {
    const e = this.slate.invoker;
    if (!e) {
      console.warn("COLLAB_DEBUG: No invoker available");
      return;
    }
    const n = t.type;
    if (typeof e[n] == "function") {
      this.slate.beginRemoteApply?.();
      try {
        e[n](t);
      } finally {
        this.slate.endRemoteApply?.();
      }
    } else
      console.warn("COLLAB_DEBUG: Unknown collab type:", n);
    this.slate.options.events?.onCollaboration?.(t);
  }
  /**
   * Update local cursor position and broadcast to peers.
   */
  /**
   * Merge additional data into this client's awareness "user" state
   * (v1 parity: `collab.updateUserData(data)`), e.g. custom status the
   * host app broadcasts to other collaborators.
   */
  updateUserData(t) {
    if (!this.awareness) return;
    const e = this.awareness.getLocalState()?.user || {};
    this.awareness.setLocalStateField("user", { ...e, ...t });
  }
  updateCursor(t, e) {
    this.awareness && this.awareness.setLocalStateField("cursor", {
      x: t,
      y: e,
      zoom: this.slate.getZoom?.() || 1
    });
  }
  /**
   * Track this client's pointer over the canvas and broadcast its WORLD
   * position (via the SVG CTM, so it's pan/zoom-independent) to peers. Remote
   * clients render it through renderCursor(). Throttled to ~25fps.
   */
  setupCursorTracking() {
    const t = this.slate.canvas?.node;
    if (!t || typeof t.addEventListener != "function" || this._cursorMoveHandler) return;
    let e = 0;
    this._cursorMoveHandler = (n) => {
      const s = typeof performance < "u" ? performance.now() : +/* @__PURE__ */ new Date();
      if (!(s - e < 40)) {
        e = s;
        try {
          const o = this.slate.canvas.point(n.clientX, n.clientY);
          this.updateCursor(o.x, o.y);
        } catch {
        }
      }
    }, t.addEventListener("pointermove", this._cursorMoveHandler), this._cursorTrackingNode = t;
  }
  /**
   * Render (or update) remote collaborators' cursors and remove cursors for
   * clients that have left. Called on every awareness change.
   */
  renderRemoteCursors(t) {
    if (!this.slate.canvas) return;
    const e = new Set(t.map((n) => n.clientID));
    for (const [n, s] of this.cursorElements)
      if (!e.has(n)) {
        try {
          s.remove();
        } catch {
        }
        this.cursorElements.delete(n);
      }
    for (const n of t)
      n.cursor && this.renderCursor(n);
  }
  /**
   * Render a remote cursor on the canvas, reusing its group across updates so
   * frequent cursor moves don't thrash the DOM.
   */
  renderCursor(t) {
    if (!t.cursor || !this.slate.canvas) return;
    let e = this.cursorElements.get(t.clientID);
    if (!e || !e.node || !e.node.parentNode) {
      e = this.slate.canvas.group(), e.polygon("0,0 0,17 4.5,13 7.5,19.5 10.5,18 7.5,11.5 13,11.5").fill(t.color).stroke({ color: "#fff", width: 1.2 }).attr("stroke-linejoin", "round");
      const n = e.group(), s = t.userName || "Anonymous", o = n.text(s).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(t.color);
      let r = 60, a = 16;
      try {
        const d = o.bbox();
        d && d.width && (r = d.width, a = d.height);
      } catch {
      }
      const l = 8, c = 4;
      n.rect(r + l * 2, a + c * 2).radius(6).fill("#fff").stroke({ color: t.color, width: 1 }).back(), o.move(l, c), n.transform({ translateX: 16, translateY: 6 }), e.attr("pointer-events", "none"), this.cursorElements.set(t.clientID, e);
    }
    e.transform({ translateX: t.cursor.x, translateY: t.cursor.y });
  }
  /**
   * Get all connected collaboration users.
   */
  getCollabUsers() {
    if (!this.awareness) return [];
    const t = [];
    return this.awareness.getStates().forEach((n, s) => {
      s !== this.clientID && t.push({
        clientID: s,
        userName: n.user?.name || "Anonymous",
        color: n.user?.color || "#999",
        cursor: n.cursor
      });
    }), t;
  }
  /**
   * Disconnect from collaboration.
   */
  disconnect() {
    if (this._cursorMoveHandler && this._cursorTrackingNode)
      try {
        this._cursorTrackingNode.removeEventListener(
          "pointermove",
          this._cursorMoveHandler
        );
      } catch {
      }
    this._cursorMoveHandler = null, this._cursorTrackingNode = null;
    for (const [, t] of this.cursorElements)
      t.remove();
    this.cursorElements.clear(), this.provider && (this.provider.disconnect(), this.provider = null), this.doc && (this.doc.destroy(), this.doc = null), this.collabMap = null, this.awareness = null, this.isConnected = !1, console.log("COLLAB_DEBUG: Disconnected");
  }
  /** Check if collaboration is connected */
  isCollabConnected() {
    return this.isConnected;
  }
  /** Destroy the collab instance, disconnecting and cleaning up all resources */
  destroy() {
    this.disconnect(), this.slate = null, this.options = {};
  }
  /** Get client ID */
  getClientID() {
    return this.clientID;
  }
  // ─── Private ─────────────────────────────────────────────────────
  handleRemotePackage(t) {
    console.log("COLLAB_DEBUG: Received remote package:", t.type), this.exe(t), this.options.onReceive?.(t);
  }
}
function ms(i, t, e = !1, n = !1) {
  if (!t) return;
  t._id && (i.options.themeId = t._id), e && (i.options.syncWithTheme = !0), t.containerStyle?.backgroundColor && (i.options.containerStyle = i.options.containerStyle || {}, i.options.containerStyle.backgroundColor = t.containerStyle.backgroundColor, i.applyContainerStyle?.()), t.defaultLineColor && (i.options.defaultLineColor = t.defaultLineColor);
  const s = i.nodes.allNodes;
  if (!s || s.length === 0 || !t.styles) return;
  const o = nl(i, s);
  s.forEach((r, a) => {
    const l = o ? o.get(r.options.id) ?? 0 : a, c = ys(t, l);
    c && il(r, c);
  }), console.log("THEME_DEBUG: Applied theme", t.name || t._id);
}
function nl(i, t) {
  if (!i?.options?.mindMapMode) return null;
  const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map();
  let s = !1;
  for (const a of t) {
    const l = a.relationships?.assocMap, c = l ? Array.from(l.values()).map((h) => h.childId || h.child?.id).filter(Boolean) : [];
    c.length && (s = !0), n.set(a.options.id, c), c.forEach((h) => e.add(h));
  }
  if (!s) return null;
  const o = /* @__PURE__ */ new Map(), r = [];
  for (const a of t)
    e.has(a.options.id) || r.push([a.options.id, 0]);
  for (; r.length; ) {
    const [a, l] = r.shift();
    if (!o.has(a)) {
      o.set(a, l);
      for (const c of n.get(a) || []) r.push([c, l + 1]);
    }
  }
  for (const a of t)
    o.has(a.options.id) || o.set(a.options.id, 0);
  return o;
}
function ys(i, t) {
  if (!i.styles) return null;
  if (t === 0 && i.styles.parent)
    return i.styles.parent;
  const e = Object.keys(i.styles).filter(
    (o) => o.startsWith("child_")
  );
  if (e.length === 0)
    return i.styles.parent || null;
  const s = `child_${(t - 1) % e.length + 1}`;
  return i.styles[s] || i.styles.parent || null;
}
function il(i, t) {
  const e = t, n = t.backgroundColor ?? e.nodeColor, s = t.fontColor ?? e.foregroundColor;
  n && (i.options.backgroundColor = n), t.borderColor && (i.options.borderColor = t.borderColor), t.borderWidth !== void 0 && (i.options.borderWidth = t.borderWidth), s && (i.options.fontColor = s), t.fontFamily && (i.options.fontFamily = t.fontFamily), t.fontSize !== void 0 && (i.options.fontSize = t.fontSize), t.lineColor && (i.options.lineColor = t.lineColor), t.opacity !== void 0 && (i.options.opacity = t.opacity), i.setColors?.(n, t.borderColor), i.textElement && (s || t.fontSize || t.fontFamily) && i.textElement.font({
    fill: s || i.options.fontColor,
    size: t.fontSize || i.options.fontSize,
    family: t.fontFamily || i.options.fontFamily
  });
}
const sl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTheme: ms,
  buildNodeStyleFromTheme: ys
}, Symbol.toStringTag, { value: "Module" }));
function bs(i, t = !1, e = 20) {
  const n = i.nodes.allNodes;
  if (n.length < 2) return;
  const s = 100;
  let o = !0, r = 0;
  for (; o && r < s; ) {
    o = !1, r++;
    for (let a = 0; a < n.length; a++)
      for (let l = a + 1; l < n.length; l++) {
        const c = n[a], h = n[l], d = c.options.x || 0, u = c.options.y || 0, f = c.options.width || 100, g = c.options.height || 60, p = h.options.x || 0, y = h.options.y || 0, m = h.options.width || 100, b = h.options.height || 60, w = d < p + m + e && d + f + e > p, x = u < y + b + e && u + g + e > y;
        if (w && x) {
          o = !0;
          const _ = d + f / 2 - (p + m / 2), v = u + g / 2 - (y + b / 2), C = Math.sqrt(_ * _ + v * v) || 1, A = _ / C * (e / 2), B = v / C * (e / 2);
          c.position(d + A, u + B), h.position(p - A, y - B);
        }
      }
  }
  if (t) {
    const a = n.reduce((c, h) => c + (h.options.x || 0), 0) / n.length, l = n.reduce((c, h) => c + (h.options.y || 0), 0) / n.length;
    for (const c of n) {
      const h = c.options.x || 0, d = c.options.y || 0, u = a - h, f = l - d;
      c.position(h + u * 0.05, d + f * 0.05);
    }
  }
  console.log(
    "LAYOUT_DEBUG: Overlap removal completed in",
    r,
    "iterations"
  );
}
function ws(i, t, e, n = !1) {
  const s = n ? 0 : 500;
  let o = 0;
  for (const r of t) {
    const a = i.nodes.one(r.id);
    a ? a.position(r.x, r.y, () => {
      o++, o >= t.length && e && e();
    }, void 0, s) : o++;
  }
  t.length === 0 && e && e();
}
function vs(i) {
  return i.nodes.allNodes.map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
const ol = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyLayout: ws,
  packageLayout: vs,
  removeLayoutOverlaps: bs
}, Symbol.toStringTag, { value: "Module" }));
class xs {
  constructor(t, e = {}) {
    this.container = null, this.slider = null, this.label = null, this._intervalId = null, this.slate = t, this.options = {
      enabled: !1,
      position: "bottom-right",
      minZoom: 0.1,
      maxZoom: 10,
      ...e
    }, this.options.enabled && this.create();
  }
  /** Show the zoom slider */
  show() {
    this.container || this.create(), this.container && (this.container.style.display = "flex");
  }
  /** Hide the zoom slider */
  hide() {
    this.container && (this.container.style.display = "none");
  }
  /** Destroy the zoom slider */
  destroy() {
    this._intervalId !== null && (clearInterval(this._intervalId), this._intervalId = null), this.container && (this.container.remove(), this.container = null, this.slider = null, this.label = null);
  }
  /** Update the slider to reflect current zoom level */
  update() {
    if (!this.slider || !this.label) return;
    const t = this.slate.getZoom?.() || 1;
    this.slider.value = String(t), this.label.textContent = `${Math.round(t * 100)}%`;
  }
  // ─── Private ─────────────────────────────────────────────────────
  create() {
    if (!this.slate.element) return;
    this.slate.element.style.position = this.slate.element.style.position || "relative", this.container = document.createElement("div"), this.container.className = "slatebox-zoom-slider";
    const t = {
      "bottom-right": "bottom: 10px; right: 10px;",
      "bottom-left": "bottom: 10px; left: 10px;",
      "top-right": "top: 10px; right: 10px;",
      "top-left": "top: 10px; left: 10px;"
    };
    this.container.style.cssText = `
      position: absolute;
      ${t[this.options.position]}
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      z-index: 1000;
      font-family: sans-serif;
      font-size: 12px;
    `;
    const e = document.createElement("button");
    e.textContent = "-", e.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;", e.onclick = () => this.slate.zoomOut?.(), this.container.appendChild(e), this.slider = document.createElement("input"), this.slider.type = "range", this.slider.min = String(this.options.minZoom), this.slider.max = String(this.options.maxZoom), this.slider.step = "0.1", this.slider.value = "1", this.slider.style.cssText = "width: 100px; cursor: pointer;", this.slider.oninput = () => {
      const o = parseFloat(this.slider.value);
      this.slate.zoom?.(o), this.update();
    }, this.container.appendChild(this.slider);
    const n = document.createElement("button");
    n.textContent = "+", n.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;", n.onclick = () => this.slate.zoomIn?.(), this.container.appendChild(n), this.label = document.createElement("span"), this.label.textContent = "100%", this.label.style.cssText = "min-width: 40px; text-align: right;", this.container.appendChild(this.label);
    const s = document.createElement("button");
    s.textContent = "⤢", s.title = "Fit to content", s.setAttribute("aria-label", "fitToContent"), s.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:15px;padding:0 4px;line-height:1;", s.onclick = () => this.slate.fitToContent?.(), this.container.insertBefore(s, this.container.firstChild), this.slate.element.appendChild(this.container), this._intervalId = setInterval(() => this.update(), 500);
  }
}
class _s {
  constructor(t) {
    this.steps = [], this.currentStep = -1, this.isActive = !1, this.zoomLevel = 1.5, this._animRaf = null, this.slate = t;
  }
  /**
   * Extract presentation layout from current nodes.
   * Orders nodes by their _presentationIndex or by position (top-to-bottom, left-to-right).
   */
  extractLayout(t) {
    let e = this.slate.nodes.allNodes;
    if (t?.nodeIds) {
      const n = new Set(t.nodeIds);
      e = e.filter((s) => n.has(s.id));
    }
    return e.sort((n, s) => {
      const o = n.options._presentationIndex, r = s.options._presentationIndex;
      if (o !== void 0 && r !== void 0) return o - r;
      const a = (n.options.y || 0) - (s.options.y || 0);
      return Math.abs(a) > 30 ? a : (n.options.x || 0) - (s.options.x || 0);
    }), this.steps = e.map((n, s) => ({
      nodeId: n.id,
      index: s
    })), this.steps;
  }
  /**
   * Build the hierarchical presentation layout (preziData) — a tree of root
   * nodes → children with per-node metrics + descriptions. This is the structure
   * the AI consumes to decide the presentation ORDER (ported from v1
   * slate.extractPresentationLayout). Bbox is relative to the content top-left.
   */
  extractPresentationLayout() {
    const e = (this.slate.nodes?.allNodes || []).filter((g) => !g.options?.isCategory);
    let n = 1 / 0, s = 1 / 0, o = -1 / 0, r = -1 / 0;
    e.forEach((g) => {
      const p = g.options || {};
      n = Math.min(n, p.x || 0), s = Math.min(s, p.y || 0), o = Math.max(o, (p.x || 0) + (p.width || 0)), r = Math.max(r, (p.y || 0) + (p.height || 0));
    }), isFinite(n) || (n = 0, s = 0, o = 0, r = 0);
    const a = { left: n, top: s, width: o - n, height: r - s }, l = new Map(e.map((g) => [g.id, g])), c = (g) => (g.relationships?.associations || []).map((p) => p.childId).filter((p) => l.has(p)), h = (g) => e.some(
      (p) => (p.relationships?.associations || []).some((y) => y.childId === g.id)
    ), d = /* @__PURE__ */ new Set(), u = (g) => {
      if (d.has(g.id)) return null;
      d.add(g.id);
      const p = g.options || {}, y = c(g).map((m) => l.get(m)).filter(Boolean);
      return {
        nodeId: g.id,
        metrics: {
          rotation: Math.ceil(p.rotate?.rotationAngle || 0),
          bbox: {
            x: Number(((p.x || 0) - a.left).toFixed(2)),
            y: Number(((p.y || 0) - a.top).toFixed(2)),
            width: Number((p.width || 0).toFixed(2)),
            height: Number((p.height || 0).toFixed(2))
          }
        },
        description: p.text || p.description || "",
        image: p.image,
        numberOfChildrenNodes: y.length,
        childrenNodes: y.map(u).filter(Boolean)
      };
    }, f = e.filter((g) => !h(g));
    return {
      presentationHeight: Math.ceil(a.height),
      presentationWidth: Math.ceil(a.width),
      nodes: f.map(u).filter(Boolean)
    };
  }
  /**
   * Set the step order explicitly (e.g. from the AI's returned ordering). IDs
   * that don't exist are skipped; any nodes the AI omitted are appended in the
   * default layout order so nothing is lost.
   */
  setStepOrder(t) {
    const e = this.slate.nodes?.allNodes || [], n = new Set(e.map((r) => r.id)), s = /* @__PURE__ */ new Set(), o = [];
    return (t || []).forEach((r) => {
      n.has(r) && !s.has(r) && (s.add(r), o.push(r));
    }), this.extractLayout().forEach((r) => {
      s.has(r.nodeId) || (s.add(r.nodeId), o.push(r.nodeId));
    }), this.steps = o.map((r, a) => ({ nodeId: r, index: a })), this.currentStep = -1, this.steps;
  }
  /** Start presentation mode */
  start() {
    this.steps.length === 0 && this.extractLayout(), this.isActive = !0, this.currentStep = -1, this.next();
  }
  /** Stop presentation mode */
  stop() {
    this.isActive = !1, this.currentStep = -1;
  }
  /** Go to next step */
  next() {
    return this.currentStep >= this.steps.length - 1 ? !1 : (this.currentStep++, this.goToStep(this.currentStep), !0);
  }
  /** Go to previous step */
  previous() {
    return this.currentStep <= 0 ? !1 : (this.currentStep--, this.goToStep(this.currentStep), !0);
  }
  /**
   * Go to a specific step, smoothly panning+zooming the viewport so the step's
   * node is centered (P3). Pass duration 0 for an instant jump.
   */
  goToStep(t, e = 450) {
    if (t < 0 || t >= this.steps.length) return;
    this.currentStep = t;
    const n = this.steps[t], s = this.slate.nodes.one(n.nodeId);
    if (s)
      try {
        const o = s.options || {}, r = (o.x || 0) + (o.width || 0) / 2, a = (o.y || 0) + (o.height || 0) / 2, c = this.slate.canvas.viewbox(), h = this.slate.panZoom?.getZoom?.() ?? 1, d = c.width * h / this.zoomLevel, u = c.height * h / this.zoomLevel, f = { x: r - d / 2, y: a - u / 2, width: d, height: u };
        this.animateViewbox(
          { x: c.x, y: c.y, width: c.width, height: c.height },
          f,
          e
        );
      } catch {
      }
  }
  /** Tween the canvas viewbox from → to over `duration` ms (easeInOutQuad). */
  animateViewbox(t, e, n) {
    const s = this.slate.canvas, o = (c, h, d, u) => {
      try {
        s.viewbox(c, h, d, u);
      } catch {
      }
    };
    if (this._animRaf != null) {
      try {
        cancelAnimationFrame(this._animRaf);
      } catch {
      }
      this._animRaf = null;
    }
    if (!n || n <= 0 || typeof requestAnimationFrame > "u") {
      o(e.x, e.y, e.width, e.height);
      return;
    }
    const r = (c) => c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
    let a = null;
    const l = (c) => {
      a === null && (a = c);
      const h = Math.min(1, (c - a) / n), d = r(h);
      o(
        t.x + (e.x - t.x) * d,
        t.y + (e.y - t.y) * d,
        t.width + (e.width - t.width) * d,
        t.height + (e.height - t.height) * d
      ), h < 1 ? this._animRaf = requestAnimationFrame(l) : this._animRaf = null;
    };
    this._animRaf = requestAnimationFrame(l);
  }
  /** Get current step index */
  getCurrentStep() {
    return this.currentStep;
  }
  /** Get total steps */
  getTotalSteps() {
    return this.steps.length;
  }
  /** Check if presentation is active */
  isPresenting() {
    return this.isActive;
  }
  /** Destroy the presentation, stopping if active */
  destroy() {
    this.stop(), this.steps = [], this.currentStep = -1, this.slate = null;
  }
}
const Te = class Te {
  /**
   * Creates a new Slate — the main orchestrator for a diagramming canvas.
   *
   * Initializes the SVG canvas, sets up all sub-modules (nodes manager,
   * pan/zoom, selection, grid, keyboard shortcuts, undo/redo, etc.),
   * and attaches event handlers.
   *
   * @param element - CSS selector string or HTMLElement to mount the canvas on
   * @param options - Full slate configuration (see SlateOptions interface)
   * @throws If element is a selector string and no matching element is found
   *
   * @example
   * ```ts
   * import { Slate } from 'slateboxjs-v2';
   * const slate = new Slate('#canvas', {
   *   viewPort: { originalWidth: 1200, originalHeight: 800 },
   *   panZoom: { enabled: true }
   * });
   * ```
   */
  constructor(t, e = {}) {
    if (this.selectedNodes = [], this.groupResizeRotate = null, this._coordinateIntervalId = null, this._destroyed = !1, this._applyingRemote = !1, this._hadGroupSelection = !1, this._emitDeferred = !1, this._emitQueue = [], this._birdsEyeTimeoutId = null, this._coordDisplayTimeoutId = null, this._nodeNotifyTimeoutId = null, this._liveRegion = null, this._resizeObserver = null, typeof t == "string") {
      const n = document.querySelector(t);
      if (!n)
        throw new Error(`Element with selector "${t}" not found`);
      this.element = n;
    } else
      this.element = t;
    if (typeof window < "u") {
      const n = window;
      n.__slateboxInstances = n.__slateboxInstances || [], n.__slateboxInstances.push(this);
    }
    this.options = {
      name: "Untitled Slate",
      description: "",
      followMe: !0,
      mindMapMode: !1,
      autoResizeNodesBasedOnText: !0,
      viewPort: {
        originalWidth: 800,
        originalHeight: 600,
        showGrid: !1,
        snapToObjects: !1,
        showCoordinates: !0
      },
      containerStyle: {
        backgroundColor: "#ffffff",
        backgroundColorAsGradient: !1,
        backgroundGradientType: "linear",
        backgroundGradientColors: [],
        backgroundGradientStrategy: "horizontal",
        backgroundImage: void 0,
        backgroundSize: "contain",
        backgroundEffect: void 0,
        prevBackgroundColor: "#ffffff"
      },
      defaultLineColor: "#000000",
      themeId: void 0,
      layoutType: "manual",
      disableAutoLayoutOfManuallyPositionedNodes: !1,
      huddleType: "none",
      huddleEnabled: !1,
      tags: [],
      templateMarkdown: "",
      templatePrompt: "",
      isTemplate: !1,
      ai: {},
      panZoom: {
        enabled: !0,
        panning: !0,
        pinchZoom: !0,
        wheelZoom: !1,
        // Disable wheel zoom - use pinch to zoom, scroll to pan
        zoomFactor: 0.3,
        zoomMin: 0.1,
        zoomMax: 10
      },
      ...e
    }, this.init();
  }
  /**
   * v1-parity `slate.filters.availableFilters` — the node Effects pane reads
   * `node.slate.filters.availableFilters` (keyed by name, each with `types`) to
   * decide which effects to offer. Per-node application lives on `node.filters`.
   */
  get filters() {
    return { availableFilters: Wi() };
  }
  init() {
    this.canvas = De().addTo(this.element), this.canvas.node.setAttribute("role", "img"), this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas"), this.canvas.node.setAttribute("tabindex", "0"), this._liveRegion = document.createElement("div"), this._liveRegion.setAttribute("aria-live", "polite"), this._liveRegion.setAttribute("aria-atomic", "true"), this._liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;", this.element.appendChild(this._liveRegion), this.element.style.overflow = this.element.style.overflow || "hidden", getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative");
    const t = this.canvas.node;
    t?.style && (t.style.width = "100%", t.style.height = "100%", t.style.display = "block"), t?.removeAttribute?.("width"), t?.removeAttribute?.("height"), t?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");
    const e = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    const n = this.options.viewPort.originalWidth || Math.round(e.width) || 800, s = this.options.viewPort.originalHeight || Math.round(e.height) || 600;
    this.options.viewPort.originalWidth = n, this.options.viewPort.originalHeight = s;
    const o = this.options.viewPort.left ?? 0, r = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(o, r, n, s), this._setupResizeObserver(), this.nodes = new qa(this), this.invoker = new Ka(this), this.applyContainerStyle(), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new ss(this, this.options.panZoom), this.birdsEye = new os(this, this.options.birdsEye), this.options.birdsEye?.enabled && (this._birdsEyeTimeoutId = setTimeout(() => {
      this._destroyed || this.birdsEye.enable();
    }, 200)), this.undoRedo = new cs(this, {
      enabled: this.options.showUndoRedo !== !1
    }), this.undoRedo.snap?.(!0), this.multiSelection = new hs(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new ds(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20,
      // Re-apply the persisted snap-to-grid setting so it survives reload.
      snapToGrid: this.options.viewPort?.snapToGrid || !1
    }), this.options.viewPort?.showGrid && this.grid.show(), this.keyboard = new us(this), this.options.enabled !== !1 && this.keyboard.bindGlobal(), this.contextMenu = new fs(this), this.options.enabled !== !1 && this.contextMenu.enable(), this.collab = new gs(this), this.zoomSlider = new xs(this, {
      enabled: this.options.showZoom || !1
    }), this.presentation = new _s(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && (this._coordDisplayTimeoutId = setTimeout(() => {
      this._destroyed || this.addCoordinateDisplay();
    }, 150));
  }
  /**
   * Destroy the Slate, cleaning up all sub-modules, timers, and event listeners.
   * Follows the PanZoom.ts pattern: clear timers → remove listeners → chain to owned objects.
   */
  destroy() {
    if (this._destroyed = !0, this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null), typeof window < "u") {
      const e = window;
      Array.isArray(e.__slateboxInstances) && (e.__slateboxInstances = e.__slateboxInstances.filter(
        (n) => n !== this
      ));
    }
    this._birdsEyeTimeoutId !== null && (clearTimeout(this._birdsEyeTimeoutId), this._birdsEyeTimeoutId = null), this._coordDisplayTimeoutId !== null && (clearTimeout(this._coordDisplayTimeoutId), this._coordDisplayTimeoutId = null), this._nodeNotifyTimeoutId !== null && (clearTimeout(this._nodeNotifyTimeoutId), this._nodeNotifyTimeoutId = null), this._coordinateIntervalId !== null && (clearInterval(this._coordinateIntervalId), this._coordinateIntervalId = null);
    const t = this.element.querySelector("#slate-coordinates");
    t && t.remove(), this.canvas.off("click"), this.panZoom && this.panZoom.destroy(), this.birdsEye && this.birdsEye.disable(), this.zoomSlider && this.zoomSlider.destroy(), this.keyboard && this.keyboard.unbindGlobal(), this.contextMenu && this.contextMenu.disable(), this.multiSelection && this.multiSelection.disable(), this.undoRedo && this.undoRedo.clear(), this.collab && this.collab.disconnect(), this.presentation && this.presentation.stop(), this.grid && this.grid.hide(), this.nodes && this.nodes.clear(), this.canvas && this.canvas.remove(), this._liveRegion && (this._liveRegion.remove(), this._liveRegion = null);
  }
  /**
   * Announce a message to screen readers via the hidden aria-live region.
   * Used for state changes: node add/remove, selection changes, zoom changes.
   */
  announce(t) {
    this._liveRegion && (this._liveRegion.textContent = "", setTimeout(() => {
      this._liveRegion && (this._liveRegion.textContent = t);
    }, 50));
  }
  /**
   * Emit a v1-compatible change package to the host application via
   * `options.events.onSlateChanged(pkg, collabUsers)`.
   *
   * Suppressed while a remote package is being applied (see
   * {@link beginRemoteApply}) so remote changes are never echoed back to the
   * host as local ones — mirroring v1's clientID filtering.
   *
   * @param type - v1 package type (e.g. "onNodeAdded", "onNodesMove")
   * @param data - v1-shaped package data
   */
  emitSlateChange(t, e = {}) {
    if (this._applyingRemote || this._destroyed) return;
    const n = this.options.events?.onSlateChanged;
    if (!n) return;
    const s = { type: t, data: e };
    if (this.options.instance && (s.instanceId = this.options.instance), this._emitDeferred) {
      this._emitQueue.push(s);
      return;
    }
    let o = [];
    try {
      o = this.collab?.getCollabUsers?.() ?? [];
    } catch {
    }
    try {
      n(s, o)?.catch?.(
        (a) => console.warn("SLATE_EVENTS_DEBUG: onSlateChanged handler rejected", a)
      );
    } catch (r) {
      console.warn("SLATE_EVENTS_DEBUG: onSlateChanged handler threw", r);
    }
  }
  /**
   * Broadcast a library-originated change to collaborators AND surface it to
   * the host (collab.send emits onSlateChanged — v1 echo semantics). This is
   * what interactive mutations (drag, resize, rotate, z-order, delete…) call:
   * in v1 every one of them went out through collab.send. Suppressed while a
   * remote package is being applied so remote changes never re-broadcast.
   */
  broadcast(t, e = {}) {
    this._applyingRemote || this._destroyed || (typeof this.collab?.send == "function" ? this.collab.send({ type: t, data: e }) : this.emitSlateChange(t, e), this.undoRedo && !Te.NON_UNDOABLE.has(t) && this.undoRedo.snap?.());
  }
  /** Queue onSlateChanged packages until flushEmits() (v1 collab-init timing). */
  deferEmits() {
    this._emitDeferred = !0;
  }
  /** Deliver queued packages and resume synchronous emission. */
  flushEmits() {
    this._emitDeferred = !1;
    const t = this._emitQueue.splice(0);
    for (const e of t)
      this.emitSlateChange(e.type, e.data);
  }
  /**
   * Apply `options.containerStyle` (background color / gradient / image) to
   * the container element. v1's canvas.refreshBackground equivalent — called
   * during init and again after loadJSON replaces the options.
   */
  applyContainerStyle() {
    const t = this.options.containerStyle;
    if (!t || !this.element) return;
    const e = this.element;
    if (t.backgroundColorAsGradient && Array.isArray(t.backgroundGradientColors) && t.backgroundGradientColors.length > 1) {
      const n = t.backgroundGradientColors.join(", ");
      e.style.backgroundImage = t.backgroundGradientType === "radial" ? `radial-gradient(circle, ${n})` : `linear-gradient(${n})`;
    } else t.backgroundImage ? (e.style.backgroundImage = `url(${t.backgroundImage})`, t.backgroundSize && (e.style.backgroundSize = t.backgroundSize)) : e.style.backgroundImage = "";
    t.backgroundColor && (e.style.backgroundColor = t.backgroundColor);
  }
  /** v1: host-supplied permission check — true when the viewer cannot edit. */
  isReadOnly() {
    return !!this.options.events?.isReadOnly?.();
  }
  /** v1: host-supplied permission check — true when only comments are allowed. */
  isCommentOnly() {
    return !!this.options.events?.isCommentOnly?.();
  }
  /** v1: host-supplied permission check for removing comment nodes. */
  canRemoveComments() {
    return !!this.options.events?.canRemoveComments?.();
  }
  /** Suppress emitSlateChange while applying a remote package (v1 echo semantics). */
  beginRemoteApply() {
    this._applyingRemote = !0;
  }
  /** Re-enable emitSlateChange after a remote package has been applied. */
  endRemoteApply() {
    this._applyingRemote = !1;
  }
  setupCoordinateCallbacks() {
    const t = this.options.panZoom?.onPan, e = this.options.panZoom?.onZoom;
    this.options.panZoom || (this.options.panZoom = {}), this.options.panZoom.onPan = (s) => {
      this.updateCoordinateDisplay(), t && t(s);
    }, this.options.panZoom.onZoom = (s) => {
      this.updateCoordinateDisplay(), e && e(s);
    };
    const n = this.options.panZoom.onPanEnd;
    this.options.panZoom.onPanEnd = (s) => {
      n && n(s);
      try {
        const o = this.getPan();
        this.broadcast("onCanvasMove", {
          left: o.x,
          top: o.y,
          relative: { x: o.x, y: o.y },
          orient: this.getOrientation()
        });
      } catch {
      }
    };
  }
  addCoordinateDisplay() {
    if (!this.options.showCoordinates) return;
    console.log("COORD_DEBUG: Starting coordinate display creation");
    const t = document.createElement("div");
    t.id = "slate-coordinates", t.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
      min-width: 150px;
    `, this.element.style.position = this.element.style.position || "relative", this.element.appendChild(t), console.log(
      "COORD_DEBUG: Coordinate display element created and added to DOM"
    ), console.log("COORD_DEBUG: Element style:", t.style.cssText), console.log("COORD_DEBUG: Parent element:", this.element), t.textContent = "x: 0, y: 0, zoom: 1.00", this.updateCoordinateDisplay(), this.startCoordinatePolling();
  }
  startCoordinatePolling() {
    this._destroyed || (console.log("COORD_DEBUG: Starting coordinate polling"), this._coordinateIntervalId = setInterval(() => {
      this._destroyed || this.updateCoordinateDisplay();
    }, 200));
  }
  updateCoordinateDisplay() {
    const t = this.element.querySelector(
      "#slate-coordinates"
    );
    if (!t) {
      console.log("COORD_DEBUG: No coordinate display element found in DOM");
      return;
    }
    try {
      let e = { x: 0, y: 0 }, n = 1;
      if (this.panZoom && this.panZoom.isInitialized())
        e = this.getPan(), n = this.getZoom(), console.log(
          "COORD_DEBUG: Got values from panZoom - pan:",
          e,
          "zoom:",
          n
        );
      else {
        const o = this.canvas.viewbox();
        e = { x: o.x, y: o.y }, n = (this.element.getBoundingClientRect().width || o.width) / o.width || 1, console.log(
          "COORD_DEBUG: Got fallback values from viewBox - pan:",
          e,
          "zoom:",
          n
        );
      }
      const s = `x: ${Math.round(e.x)}, y: ${Math.round(
        e.y
      )}, zoom: ${n.toFixed(2)}`;
      t.textContent = s, Math.random() < 0.1 && console.log("COORD_DEBUG: Updated coordinates to:", s);
    } catch (e) {
      console.error("COORD_DEBUG: Error updating coordinates:", e), t.textContent = "x: ?, y: ?, zoom: ?";
    }
  }
  makeResponsive() {
  }
  /**
   * Add a new node to the slate.
   *
   * @param options - Node options including position, size, text, shape, colors, etc.
   * @returns The newly created Node instance
   *
   * @example
   * ```ts
   * slate.addNode({
   *   id: 'my-node', x: 200, y: 150,
   *   width: 120, height: 80, text: 'Hello',
   *   shape: 'rectangle', backgroundColor: '#4ecdc4'
   * });
   * ```
   */
  addNode(t = {}) {
    const e = this.nodes.add(t);
    return this._nodeNotifyTimeoutId = setTimeout(() => {
      this._destroyed || this.notifyNodeChanged(), this.announce(`Node added: ${e.options.text || "(unnamed)"}`);
    }, 100), this.broadcast("onNodeAdded", {
      id: e.id,
      nodeOptions: bt(e.options)
    }), e;
  }
  /** Remove a node by ID. */
  removeNode(t) {
    const e = this.nodes.one(t), n = e?.options?.text || "(unnamed)", s = !!e?.options?.isComment, o = this.nodes.remove(t);
    return this.notifyNodeChanged(), this.announce(`Node removed: ${n}`), o && this.broadcast("onNodeDeleted", { id: t, isComment: s }), o;
  }
  /**
   * Notify that a node has changed (position, rotation, added, removed)
   * This triggers BirdsEye refresh if enabled
   */
  notifyNodeChanged(t) {
    this.birdsEye?.isEnabled() && this.birdsEye.scheduleRefresh();
  }
  /** @returns The node with the given ID, or undefined if not found. */
  getNode(t) {
    return this.nodes.one(t);
  }
  /** @returns All nodes currently on the slate. */
  getAllNodes() {
    return this.nodes.allNodes;
  }
  // Get the pan/zoom viewport for adding content that should pan/zoom
  /** @returns The SVG root canvas (used as the viewport for pan/zoom). */
  getViewport() {
    return console.log("VIEWPORT_DEBUG: Using root canvas (SVG.js panzoom)"), this.canvas;
  }
  // Get viewport with retry logic for proper initialization
  /** @returns Promise resolving to the SVG root canvas. */
  getViewportAsync() {
    return console.log(
      "VIEWPORT_DEBUG: Returning root canvas immediately (SVG.js panzoom)"
    ), Promise.resolve(this.canvas);
  }
  // Pan/Zoom API methods
  /** Enable pan and zoom interactions. */
  enablePanZoom() {
    this.panZoom.enable();
  }
  /** Disable pan and zoom interactions. */
  disablePanZoom() {
    this.panZoom.disable();
  }
  /** Enable canvas panning. */
  enablePan() {
    this.panZoom.enablePan();
  }
  /** Disable canvas panning. */
  disablePan() {
    this.panZoom.disablePan();
  }
  /** Enable canvas zoom. */
  enableZoom() {
    this.panZoom.enableZoom();
  }
  /** Disable canvas zoom. */
  disableZoom() {
    this.panZoom.disableZoom();
  }
  /**
   * Pan to a specific position.
   * @param point - { x, y } target position
   */
  pan(t) {
    this.panZoom.pan(t);
  }
  /**
   * Pan by a relative delta.
   * @param delta - { dx, dy } distance to pan
   */
  panBy(t) {
    this.panZoom.panBy(t);
  }
  /**
   * Set the zoom level.
   * @param level - Zoom factor (1 = 100%)
   */
  zoom(t) {
    this.panZoom.zoom(t), this.announce(`Zoom: ${Math.round(t * 100)}%`), this.broadcast("onZoom", { zoomLevel: t });
  }
  /**
   * Zoom by a relative factor.
   * @param factor - Multiplier applied to current zoom
   */
  zoomBy(t) {
    this.panZoom.zoomBy(t);
  }
  /** Zoom in one step. */
  zoomIn() {
    this.panZoom.zoomIn();
  }
  /** Zoom out one step. */
  zoomOut() {
    this.panZoom.zoomOut();
  }
  /**
   * Zoom centered on a point.
   * @param level - Target zoom level
   * @param point - { x, y } focus point
   */
  zoomAtPoint(t, e) {
    this.panZoom.zoomAtPoint(t, e);
  }
  /** Reset both pan and zoom to defaults. */
  resetPanZoom() {
    this.panZoom.reset();
  }
  /** Reset zoom to 100%. */
  resetZoom() {
    this.panZoom.resetZoom();
  }
  /** Reset pan position to origin. */
  resetPan() {
    this.panZoom.resetPan();
  }
  /** Zoom/pan to fit all nodes in the viewport. */
  fitToContent() {
    this.panZoom.fit();
  }
  /** Pan to center all nodes in the viewport. */
  centerContent() {
    this.panZoom.center();
  }
  /** @returns Current zoom level (1 = 100%). */
  getZoom() {
    return this.panZoom.getZoom();
  }
  /** @returns Current pan position as { x, y }. */
  getPan() {
    return this.panZoom.getPan();
  }
  /** Notify pan/zoom that the viewport was resized. */
  resizePanZoom() {
    this.panZoom.resize();
  }
  /**
   * Keep the viewBox 1:1 with the container pixel size across resizes so the
   * infinite canvas always fills its element and never distorts. Preserves
   * the current zoom level and the world-point at the viewBox center.
   */
  _setupResizeObserver() {
    if (typeof ResizeObserver > "u") return;
    let t = 0, e = 0;
    this._resizeObserver = new ResizeObserver(() => {
      if (this._destroyed) return;
      const n = this.element.getBoundingClientRect(), s = Math.max(1, Math.round(n.width)), o = Math.max(1, Math.round(n.height));
      if (s === t && o === e) return;
      const r = this.canvas.viewbox(), a = r.width / (t || s);
      t = s, e = o;
      const l = r.x + r.width / 2, c = r.y + r.height / 2, h = s * a, d = o * a;
      this.canvas.viewbox(l - h / 2, c - d / 2, h, d), this.options.viewPort = this.options.viewPort || {}, this.options.viewPort.originalWidth = s, this.options.viewPort.originalHeight = o;
    }), this._resizeObserver.observe(this.element);
  }
  /**
   * Bounding-box orientation of the current content (v1 contract):
   * `{orientation, width, height, left, top}` computed over all nodes with
   * 10px padding, falling back to the viewport dimensions when empty.
   */
  getOrientation() {
    const t = this.nodes?.allNodes ?? [], e = this.options.viewPort || {};
    let n = e.width ?? e.originalWidth ?? 800, s = e.height ?? e.originalHeight ?? 600, o = 0, r = 0, a = "landscape";
    if (t.length > 0) {
      let c = 1 / 0, h = 1 / 0, d = -1 / 0, u = -1 / 0;
      t.forEach((f) => {
        const g = f.options.x ?? 0, p = f.options.y ?? 0, y = f.options.width ?? 0, m = f.options.height ?? 0;
        c = Math.min(c, g - 10), h = Math.min(h, p - 10), d = Math.max(d, g + y + 10), u = Math.max(u, p + m + 10);
      }), o = Math.abs(c), r = Math.abs(h), n = d - c, s = u - h, s > n && (a = "portrait");
    }
    return { orientation: a, width: n, height: s, left: o, top: r };
  }
  // Selection Management
  setupSelectionHandling() {
    this.canvas.on("click", (t) => {
      console.log(
        "SELECTION_DEBUG: Canvas click detected",
        t.target,
        "vs",
        this.canvas.node
      );
      const e = t.target === this.canvas.node || t.target && t.target.tagName === "svg";
      if (Date.now() - (this._rubberBandSelectedAt || 0) < 400) {
        this._rubberBandSelectedAt = 0;
        return;
      }
      e ? (console.log("SELECTION_DEBUG: Canvas clicked - deselecting all"), this.clearSelection(), this.clearLineCog(), this.options.events?.onCanvasClicked?.(t)) : console.log(
        "SELECTION_DEBUG: Click on non-canvas element, not deselecting"
      );
    });
  }
  /**
   * Select one or more nodes on the slate.
   *
   * This is the SINGLE ORCHESTRATOR for selection. It:
   * 1. Clears current selection unless addToSelection is true
   * 2. Adds the specified nodes to the selection set
   * 3. Calls updateSelectionResizeRotate() to enable handles on selected nodes
   * 4. Fires onSelectionChanged event
   *
   * @param nodes - Array of nodes to select
   * @param addToSelection - If true, adds to existing selection instead of replacing it
   *
   * @example
   * ```ts
   * // Select a single node
   * slate.selectNodes([node]);
   * // Add to existing selection
   * slate.selectNodes([node2, node3], true);
   * ```
   */
  selectNodes(t, e = !1) {
    console.log(
      "SELECTION_DEBUG: Selecting nodes",
      t.map((s) => s.id),
      "addToSelection:",
      e
    ), this.clearLineCog(), e || this.clearSelection(), t.forEach((s) => {
      this.selectedNodes.includes(s) || (this.selectedNodes.push(s), s.onSelected());
    }), this.updateSelectionResizeRotate();
    const n = this.selectedNodes.length;
    n === 0 ? this.announce("No nodes selected") : n === 1 ? this.announce(`Node selected: ${this.selectedNodes[0].options.text || "(unnamed)"}`) : this.announce(`${n} nodes selected`), n > 1 && (this._hadGroupSelection = !0, this.options.events?.onGroupSelection?.(this.selectedNodes.slice()));
  }
  // SINGLE ORCHESTRATOR for resize/rotate management
  /** Re-evaluate which nodes should have resize/rotate handles based on current selection. */
  updateSelectionResizeRotate() {
    if (console.log(
      "SELECTION_DEBUG: Updating resize/rotate for",
      this.selectedNodes.length,
      "selected nodes"
    ), this.nodes.allNodes.forEach((t) => {
      t.resizeRotate.isEnabled() && (t.resizeRotate.disable(), console.log("SELECTION_DEBUG: Disabled resize/rotate on", t.id)), t.isConnectionHandlesEnabled() && (t.disableConnectionHandles(), console.log("SELECTION_DEBUG: Disabled connection handles on", t.id)), t.hideNodeCog?.();
    }), this.disableGroupResizeRotate(), this.selectedNodes.length === 0) {
      console.log(
        "SELECTION_DEBUG: No nodes selected - all resize/rotate disabled"
      );
      return;
    }
    if (this.selectedNodes.length === 1) {
      const t = this.selectedNodes[0];
      t.resizeRotate.enable(), t.enableConnectionHandles(), t.showNodeCog?.(), console.log(
        "SELECTION_DEBUG: Enabled individual resize/rotate and connection handles on",
        t.id
      );
    } else
      console.log(
        "SELECTION_DEBUG: Creating group resize/rotate for",
        this.selectedNodes.length,
        "nodes (connection handles disabled for multi-selection)"
      ), this.createGroupResizeRotate();
  }
  // Node-level resize/rotate control (called by Node methods)
  /** Request resize/rotate enable for a specific node (checked against selection). */
  enableNodeResizeRotate(t) {
    this.selectedNodes.includes(t) ? console.log(
      "SELECTION_DEBUG: Node",
      t.id,
      "requested resize/rotate enable - already selected"
    ) : (console.log(
      "SELECTION_DEBUG: Node",
      t.id,
      "requested resize/rotate enable - selecting it"
    ), this.selectNodes([t], !1));
  }
  /** Disable resize/rotate for a specific node. */
  disableNodeResizeRotate(t) {
    console.log(
      "SELECTION_DEBUG: Node",
      t.id,
      "requested resize/rotate disable"
    ), t.resizeRotate.isEnabled() && t.resizeRotate.disable(), t.isConnectionHandlesEnabled() && t.disableConnectionHandles();
  }
  disableGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Disabling group resize/rotate"), this.selectedNodes.forEach((t) => {
      t.disableResizeRotate();
    }), this.groupResizeRotate && (this.groupResizeRotate.remove(), this.groupResizeRotate = null);
  }
  createGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Creating group resize/rotate controller"), this.groupResizeRotate && this.groupResizeRotate.remove();
    const t = this.calculateGroupBoundingBox();
    ![t.x, t.y, t.width, t.height].every(
      Number.isFinite
    ) || t.width <= 0 || t.height <= 0 || (this.groupResizeRotate = this.canvas.group(), this.groupResizeRotate.rect(t.width, t.height).move(t.x, t.y).fill("transparent").stroke({ color: "#4a90e2", width: 2, dasharray: "5,5" }).attr("pointer-events", "none"));
  }
  calculateGroupBoundingBox() {
    if (this.selectedNodes.length === 0)
      return { x: 0, y: 0, width: 100, height: 100 };
    let t = 1 / 0, e = 1 / 0, n = -1 / 0, s = -1 / 0;
    return this.selectedNodes.forEach((o) => {
      const r = o.options.x ?? 0, a = o.options.y ?? 0, l = o.options.width ?? 0, c = o.options.height ?? 0;
      t = Math.min(t, r), e = Math.min(e, a), n = Math.max(n, r + l), s = Math.max(s, a + c);
    }), {
      x: t,
      y: e,
      width: n - t,
      height: s - e
    };
  }
  createGroupHandle(t, e, n, s) {
    t.circle(8).fill("#4a90e2").stroke("#ffffff").attr("stroke-width", 2);
  }
  updateGroupHandle(t, e, n, s) {
    t.center(e[0], e[1]);
  }
  handleGroupResize(t) {
    console.log("SELECTION_DEBUG: Group resize event", t);
    const { box: e } = t.detail, n = this.calculateGroupBoundingBox(), s = e.width / n.width, o = e.height / n.height;
    this.selectedNodes.forEach((r) => {
      const a = r.svgGroup.bbox(), l = (a.x - n.x) * s, c = (a.y - n.y) * o, h = a.width * s, d = a.height * o;
      r.setSize(h, d), r.position(e.x + l, e.y + c);
    });
  }
  handleGroupRotate(t) {
    console.log("SELECTION_DEBUG: Group rotate event", t);
    const { angle: e } = t.detail, n = this.calculateGroupBoundingBox();
    n.x + n.width / 2, n.y + n.height / 2, this.selectedNodes.forEach((s) => {
      const o = s.getRotation();
      s.setRotation(o + e);
    });
  }
  /** Select a single node (convenience wrapper for selectNodes). */
  selectNode(t) {
    this.selectNodes([t], !1);
  }
  /** Deselect a single node. */
  deselectNode(t) {
    this.selectedNodes.includes(t) && (console.log("SELECTION_DEBUG: Deselecting node", t.id), this.selectedNodes = this.selectedNodes.filter((e) => e !== t), t.onDeselected(), this.selectedNodes.length === 0 ? this.disableGroupResizeRotate() : this.updateSelectionResizeRotate());
  }
  /** Deselect all currently selected nodes. */
  /** Remove the active line cog + endpoint handles (M1/L1), if any. */
  clearLineCog() {
    if (this._activeLineCog) {
      try {
        this._activeLineCog.remove();
      } catch {
      }
      this._activeLineCog = void 0;
    }
    if (this._activeLineConnectable) {
      try {
        this._activeLineConnectable._handlesPinned = !1, this._activeLineConnectable._revealHandles?.(!1), this._activeLineConnectable.deselectConnector?.();
      } catch {
      }
      this._activeLineConnectable = void 0;
    }
    this._activeEndpointToggles && (this._activeEndpointToggles.forEach((t) => {
      try {
        t.remove();
      } catch {
      }
    }), this._activeEndpointToggles = void 0);
  }
  clearSelection() {
    console.log("SELECTION_DEBUG: Clearing selection"), this.selectedNodes.forEach((t) => {
      t.onDeselected();
    }), this.selectedNodes = [], this.updateSelectionResizeRotate(), this._hadGroupSelection && (this._hadGroupSelection = !1, this.options.events?.onGroupSelection?.([]));
  }
  /** @returns Array of currently selected nodes. */
  getSelectedNodes() {
    return this.selectedNodes;
  }
  // Backward compatibility
  /** @returns The first selected node, or null if none selected. */
  getSelectedNode() {
    return this.selectedNodes.length > 0 ? this.selectedNodes[0] : null;
  }
  /**
   * Align the selected (or given) nodes to their shared bounding box (Miro-style).
   * mode: left | centerH | right | top | middle | bottom. Broadcasts onNodesMove
   * so the change persists + syncs to collab. No-op for < 2 nodes.
   */
  alignNodes(t, e) {
    const n = e || this.getSelectedNodes();
    if (!n || n.length < 2) return;
    const s = n.map((d) => ({
      n: d,
      x: d.options.x || 0,
      y: d.options.y || 0,
      w: d.options.width || 0,
      h: d.options.height || 0
    })), o = Math.min(...s.map((d) => d.x)), r = Math.max(...s.map((d) => d.x + d.w)), a = Math.min(...s.map((d) => d.y)), l = Math.max(...s.map((d) => d.y + d.h)), c = (o + r) / 2, h = (a + l) / 2;
    for (const d of s) {
      let u = d.x, f = d.y;
      switch (t) {
        case "left":
          u = o;
          break;
        case "right":
          u = r - d.w;
          break;
        case "centerH":
          u = c - d.w / 2;
          break;
        case "top":
          f = a;
          break;
        case "bottom":
          f = l - d.h;
          break;
        case "middle":
          f = h - d.h / 2;
          break;
        default:
          return;
      }
      d.n.position(u, f);
    }
    this.broadcast("onNodesMove", {
      nodeOptions: n.map((d) => bt(d.options))
    });
  }
  /**
   * Evenly distribute the selected (or given) nodes along an axis so the gaps
   * between them are equal; the outermost two stay put. axis: horizontal |
   * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
   */
  distributeNodes(t, e) {
    const n = e || this.getSelectedNodes();
    if (!n || n.length < 3) return;
    const s = n.map((o) => ({
      n: o,
      x: o.options.x || 0,
      y: o.options.y || 0,
      w: o.options.width || 0,
      h: o.options.height || 0
    }));
    if (t === "horizontal") {
      s.sort((h, d) => h.x - d.x);
      const o = s[0].x, r = s[s.length - 1].x + s[s.length - 1].w, a = s.reduce((h, d) => h + d.w, 0), l = (r - o - a) / (s.length - 1);
      let c = o;
      for (const h of s)
        h.n.position(c, h.y), c += h.w + l;
    } else if (t === "vertical") {
      s.sort((h, d) => h.y - d.y);
      const o = s[0].y, r = s[s.length - 1].y + s[s.length - 1].h, a = s.reduce((h, d) => h + d.h, 0), l = (r - o - a) / (s.length - 1);
      let c = o;
      for (const h of s)
        h.n.position(h.x, c), c += h.h + l;
    } else
      return;
    this.broadcast("onNodesMove", {
      nodeOptions: n.map((o) => bt(o.options))
    });
  }
  // ─── Serialization API ──────────────────────────────────────────────
  /**
   * Export the slate to a JSON string in v1-compatible format.
   *
   * @param nodes - Optional subset of nodes to include
   * @param asPresentation - If true, includes presentation ordering
   * @returns JSON string
   */
  exportJSON(t, e) {
    const n = ze(this, t, e);
    return JSON.stringify(n);
  }
  /**
   * Load a v1-compatible JSON string or object into this slate.
   *
   * @param json - JSON string or SlateJSON object
   * @param preserve - If true, merge with existing nodes instead of replacing
   * @param skipZoom - If true, don't adjust zoom/pan after load
   * @param useMainCanvas - Reserved for future use
   */
  async loadJSON(t, e = !1, n = !1, s) {
    await Nn(t, this, e, n), this.undoRedo?.clear?.(), this.undoRedo?.snap?.(!0);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return ls(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return Dn(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return ps(this, t, e);
  }
  /**
   * Synchronous-style PNG export (returns a Promise).
   * Alias for png() for v1 compatibility.
   */
  pngSync(t) {
    return this.png(t);
  }
  // ─── Theme API ──────────────────────────────────────────────────
  /** Apply a theme to this slate */
  applyTheme(t, e, n) {
    ms(this, t, e, n);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  removeLayoutOverlaps(t, e) {
    bs(this, t, e);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, n) {
    ws(this, t, e, n);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return vs(this);
  }
  // ─── Lock display API ───────────────────────────────────────────
  /** Show lock icons on all locked nodes */
  displayLocks() {
    this.nodes.allNodes.forEach((t) => {
      t.options.isLocked && console.log("LOCK_DEBUG: Displaying lock for", t.id);
    });
  }
  /** Hide all lock icons */
  hideLocks() {
    console.log("LOCK_DEBUG: Hiding all locks");
  }
  // ─── Font loading ───────────────────────────────────────────────
  /** Load all fonts used by nodes in this slate */
  async loadAllFonts() {
    await Zi(this);
  }
};
Te.NON_UNDOABLE = /* @__PURE__ */ new Set([
  "onZoom",
  "onCanvasMove",
  "onFollowMeChanged",
  "onSlateFollowMeChanged",
  "onSlateHuddleChanged",
  "onCursorMoved",
  "onPresenceChanged",
  "onSlateChanged"
]);
let le = Te;
function rl(i, t) {
  return i.addNode({
    text: t.text,
    x: t.x || 100,
    y: t.y || 100,
    width: 150,
    height: 80,
    backgroundColor: "#fffde7",
    borderColor: "#ffd54f",
    borderWidth: 1,
    fontColor: "#333",
    fontSize: 12,
    isComment: !0,
    showDelete: !0,
    showAdd: !1,
    showResize: !0,
    showRotate: !1,
    showMenu: !1,
    allowResize: !0,
    // Author/timestamp must be part of the node at creation so they're carried
    // by the onNodeAdded broadcast + the save. Setting them AFTER addNode left
    // them out of the persisted state, so they were lost on reload.
    commentAuthor: t.author,
    commentTimestamp: t.timestamp || Date.now()
  });
}
function al(i, t) {
  const e = i.nodes.one(t);
  return !e || !e.options.isComment ? !1 : i.removeNode(t);
}
function ll(i) {
  return i.nodes.allNodes.filter(
    (t) => t.options.isComment === !0
  );
}
const cl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComment: rl,
  getComments: ll,
  removeComment: al
}, Symbol.toStringTag, { value: "Module" }));
class Ht {
  constructor(t = {}) {
    this.options = { id: Zt(), ...t }, this.resize = new hl(this), this.relationships = new dl(this);
  }
  /**
   * v1: `node.png(withNodes?, cb)` — export this node (or the given group of
   * node ids) as a transparent-background PNG blob.
   */
  png(t, e) {
    const n = typeof t == "function" ? t : e, s = Array.isArray(t) ? t : void 0, o = this.v2;
    if (!o || !n) return;
    const r = s && s.length > 0 ? s : [o.id];
    o.slate.png(
      { nodes: r, noBackground: !0, asBinary: !0 },
      (a) => n(a)
    );
  }
  /** v1: `node.svg(withNodes?, cb)` — same as png but returns the SVG string. */
  svg(t, e) {
    const n = typeof t == "function" ? t : e, s = Array.isArray(t) ? t : void 0, o = this.v2;
    if (!o || !n) return;
    const r = s && s.length > 0 ? s : [o.id];
    o.slate.svg(
      { nodes: r, noBackground: !0 },
      (a) => n(a)
    );
  }
  /**
   * v1 API: position the node. `position('center')` centers it in the current
   * viewport (used right after adding a node from the shape palette);
   * `position({x, y})` / `position(x, y)` sets an explicit position. Before the
   * node is added (no v2 yet) this just stashes coordinates on options.
   */
  position(t, e) {
    const n = this.v2, s = t && typeof t == "object" ? { x: t.x, y: t.y } : typeof t == "number" ? { x: t, y: e } : null;
    if (!n)
      return s && (this.options.x = s.x, this.options.y = s.y), this;
    if (s && s.x != null && s.y != null)
      return n.position(s.x, s.y), this;
    try {
      const r = n.slate?.canvas?.node?.getAttribute?.("viewBox");
      if (r) {
        const a = String(r).split(/[\s,]+/).map(Number);
        if (a.length === 4 && a.every((l) => !isNaN(l))) {
          const l = a[0] + a[2] / 2, c = a[1] + a[3] / 2, h = n.options.width || 0, d = n.options.height || 0;
          n.position(l - h / 2, c - d / 2);
        }
      }
    } catch {
    }
    return this;
  }
}
class hl {
  constructor(t) {
    this.owner = t;
  }
  set(t, e) {
    this.pending = { width: t, height: e }, this.owner.options.width = t, this.owner.options.height = e, this.owner.v2?.setSize(t, e);
  }
  send() {
    if (!this.pending || !this.owner.v2) return;
    const t = this.owner.v2;
    t.setSize(this.pending.width, this.pending.height), t.slate?.emitSlateChange?.("onNodeResized", {
      id: t.id,
      width: this.pending.width,
      height: this.pending.height,
      rotate: t.options.rotate,
      vectorPath: t.options.vectorPath,
      associations: (t.relationships?.getAssociations?.() ?? []).map((e) => ({
        parentId: e.parentId,
        childId: e.childId,
        linePath: ""
      }))
    }), this.pending = void 0;
  }
}
class dl {
  constructor(t) {
    this.owner = t;
  }
  /** v1: `node.relationships.addAssociation(childNode, data?)` */
  addAssociation(t, e) {
    if (!this.owner.v2)
      throw new Error(
        "SLATEBOX_COMPAT: add the node to a slate before creating associations"
      );
    const n = t instanceof Ht ? t.v2 : t;
    if (!n)
      throw new Error(
        "SLATEBOX_COMPAT: child node must be added to the slate first"
      );
    return this.owner.v2.relationships?.addAssociation(n, e);
  }
  /** v1: `.associations` — array with live parent/child wrapper references */
  get associations() {
    const t = this.owner.v2, e = this.owner.slate;
    return !t || !e ? [] : (t.relationships?.getAssociations?.() ?? []).map((s) => ({
      ...s,
      parent: e.nodes.one(s.parentId),
      child: e.nodes.one(s.childId)
    }));
  }
}
class ul {
  constructor(t) {
    this.wrappers = /* @__PURE__ */ new Map(), this.owner = t;
  }
  get v2Slate() {
    if (!this.owner.v2)
      throw new Error(
        "SLATEBOX_COMPAT: slate.init() must complete before using slate.nodes"
      );
    return this.owner.v2;
  }
  /** v1: `slate.nodes.add(nodeInstance)` — also accepts a plain options object. */
  add(t) {
    const e = t instanceof Ht ? t : new Ht(t), n = qt(e.options), s = this.v2Slate.addNode(n);
    return e.v2 = s, e.slate = this.owner, this.wrappers.set(s.id, e), e;
  }
  /** v1: `slate.nodes.addRange([...])` */
  addRange(t) {
    return (t || []).map((e) => this.add(e));
  }
  /** v1: `slate.nodes.one(id)` → node (or undefined) */
  one(t) {
    const e = this.v2Slate.nodes.one(t);
    if (e)
      return this.wrap(e);
  }
  /** v1: `slate.nodes.allNodes` → array property */
  get allNodes() {
    return this.v2Slate.nodes.allNodes.map((t) => this.wrap(t));
  }
  /**
   * v1: `slate.nodes.packageLayout()` — payload sent to the server-side
   * layout calculator: `{layoutType, associations, nodes, uniqueIds, subgraphs}`.
   */
  packageLayout() {
    const e = this.v2Slate.nodes.allNodes, n = [], s = {}, o = {};
    return e.forEach((r) => {
      const a = r.options || {}, l = bt(a);
      (r.relationships?.getAssociations?.() ?? []).forEach((h) => {
        n.push({
          parentId: h.parentId,
          childId: h.childId,
          lineWidth: h.lineWidth,
          lineType: h.lineType,
          lineCurveType: h.lineCurveType,
          lineCurviness: h.lineCurviness,
          lineOpacity: h.lineOpacity,
          showParentArrow: h.showParentArrow,
          showChildArrow: h.showChildArrow
        });
      }), s[r.id] || (s[r.id] = {
        width: +(a.width || 0),
        height: +(a.height || 0),
        shape: l.shapeHint || a.shape || "rect",
        color: a.backgroundColor,
        textColor: l.foregroundColor ?? a.fontColor,
        text: a.text,
        groupId: a.groupId ?? null
      });
      const c = String(a.groupId ?? "null");
      o[c] || (o[c] = []), o[c].push(r.id);
    }), {
      layoutType: this.owner.options.layoutType,
      associations: n,
      nodes: s,
      uniqueIds: Object.keys(s),
      subgraphs: o
    };
  }
  /**
   * v1: `slate.nodes.applyLayout(layout, cbOrOpts?)` — layout is the server
   * response `{exportNodes: {id: {x, y}}}` with stringly coordinates.
   */
  applyLayout(t, e) {
    const n = this.v2Slate, s = t?.exportNodes || {}, o = typeof e == "function" ? e : void 0, r = typeof e == "object" ? e : {}, a = Object.keys(s).filter((l) => n.nodes.one(l)).map((l) => ({
      id: l,
      x: parseFloat(s[l].x),
      y: parseFloat(s[l].y)
    }));
    n.applyLayout(a, o), r.skipCenter || n.centerContent();
  }
  /**
   * v1: `slate.nodes.nodeMovePackage({dur, moves: [{id, x: dx, y: dy}]})` —
   * moves are RELATIVE deltas; the returned package carries the resulting
   * ABSOLUTE positions in v1 shape, ready for `collab.exe({type:'onNodesMove'})`.
   */
  nodeMovePackage(t = {}) {
    const e = this.v2Slate, n = new Map(
      (t.moves || []).map((o) => [o.id, o])
    ), s = t.nodes ? t.nodes.map((o) => o instanceof Ht ? o.v2 : o).filter(Boolean) : t.moves ? t.moves.map((o) => e.nodes.one(o.id)).filter(Boolean) : e.nodes.allNodes;
    return {
      dur: t.dur ?? 300,
      easing: t.easing ?? ">",
      textPositions: s.map((o) => ({
        id: o.id,
        textPosition: { x: 0, y: 0, transform: "" }
      })),
      nodeOptions: s.map((o) => {
        const r = n.get(o.id), a = bt(o.options || {});
        return {
          id: o.id,
          vectorPath: a.vectorPath,
          xPos: (a.xPos ?? 0) + (r?.x ?? 0),
          yPos: (a.yPos ?? 0) + (r?.y ?? 0)
        };
      }),
      associations: s.flatMap(
        (o) => (o.relationships?.getAssociations?.() ?? []).map((r) => ({
          parentId: r.parentId,
          childId: r.childId,
          linePath: "",
          id: r.id
        }))
      )
    };
  }
  /**
   * Return the stable wrapper for a v2 node, creating one lazily for nodes
   * that came into existence outside this facade (e.g. loadJSON).
   */
  wrap(t) {
    let e = this.wrappers.get(t.id);
    return e || (e = new Ht({ ...t.options }), e.options.id = t.id, e.v2 = t, e.slate = this.owner, this.wrappers.set(t.id, e)), e;
  }
}
class fl {
  constructor(t = {}, e = {}) {
    this.savingTemplateImage = !1, this.options = {
      ...t,
      id: t.id || Zt()
    }, this.events = e || {}, this._shareId = this.options.shareId || Zt(), this.nodes = new ul(this), this.controller = {
      scaleToFitAndCenter: (n) => {
        this.assertReady(), this.v2.fitToContent(), n?.();
      }
    }, this.canvas = {
      hideBg: () => {
        this.assertReady();
        const n = this.v2.element;
        n && (n.style.backgroundColor = "transparent", n.style.backgroundImage = "none");
      }
    };
  }
  /**
   * v1: hosts assign `slate.shareId = X` AFTER init (createSlate.js does) and
   * expect it to persist through exportJSON. Route writes into the live v2
   * options (which serialization reads) once available.
   */
  get shareId() {
    return this.v2?.options?.shareId ?? this._shareId;
  }
  set shareId(t) {
    this._shareId = t, this.v2 && (this.v2.options.shareId = t);
  }
  /** The step-through presentation controller (start/next/previous/stop). */
  get presentation() {
    return this.v2?.presentation;
  }
  /** Resolve v1 `options.container` (id string or element) to an HTMLElement. */
  resolveContainer() {
    const t = this.options.container;
    if (t && typeof t != "string")
      return t;
    if (typeof t == "string" && t.length > 0) {
      const e = document.getElementById(t);
      if (e) return e;
      const n = document.querySelector(t);
      if (n) return n;
      throw new Error(
        `SLATEBOX_COMPAT: container "${t}" not found in document`
      );
    }
    throw new Error("SLATEBOX_COMPAT: options.container is required");
  }
  /** v1: async init resolving to the slate itself. */
  async init() {
    const t = this.resolveContainer(), e = kn(this.options);
    delete e.container, this.options.shareId === void 0 && (e.shareId = this._shareId), e.events = this.events, this.v2 = new le(t, e), await this.v2.getViewportAsync(), this.options.viewPort || (this.options.viewPort = {});
    const n = {
      ...this.options.viewPort.zoom || {}
    };
    if (Object.defineProperty(n, "r", {
      enumerable: !0,
      get: () => {
        try {
          return this.v2?.getZoom() || 1;
        } catch {
          return 1;
        }
      }
    }), this.options.viewPort.zoom = n, (this.options.allowCollaboration ?? !0) && this.events.onInitCollaboration) {
      const s = this.v2;
      s.deferEmits?.(), setTimeout(() => {
        (s?.collab?.init({ roomName: this.options.id }) ?? Promise.resolve()).catch(
          (r) => console.warn("SLATEBOX_COMPAT: collab init failed", r)
        ).finally(() => s?.flushEmits?.());
      }, 100);
    }
    return this;
  }
  /** v1: `slate.exportJSON()` → JSON string */
  exportJSON() {
    return this.assertReady(), this.v2.exportJSON();
  }
  /** v1: `slate.loadJSON(jsonString)` */
  async loadJSON(t) {
    this.assertReady(), await this.v2.loadJSON(t);
  }
  /**
   * v1: `slate.getOrientation()` → `{orientation, width, height, left, top}`
   * computed over the bounding box of all nodes (10px padding, like v1),
   * falling back to the viewport dimensions when the slate is empty.
   */
  getOrientation() {
    return this.assertReady(), this.v2.getOrientation();
  }
  /**
   * v1: `slate.collab.exe/invoke/send/updateUserData` — the live v2 Collab
   * instance exposes the same four methods.
   */
  get collab() {
    return this.assertReady(), this.v2.collab;
  }
  /** v1: `slate.keyboard.bindGlobal()/unbindGlobal()` (NodeDrawer uses it) */
  get keyboard() {
    return this.assertReady(), this.v2.keyboard;
  }
  /**
   * v1: `slate.filters.availableFilters` — an object keyed by filter name, each
   * with a `types` array. The node Effects pane iterates Object.keys(...) and
   * reads `[name].types` to decide which effects to show, so the shape matters.
   */
  get filters() {
    return {
      availableFilters: Wi()
    };
  }
  /** v1: `slate.undoRedo` / `slate.birdsEye` passthroughs */
  get undoRedo() {
    return this.assertReady(), this.v2.undoRedo;
  }
  get birdsEye() {
    return this.assertReady(), this.v2.birdsEye;
  }
  /**
   * v1: `slate.disable(exemptSlate?, exemptNodes?, full?)` — freeze
   * interactions (used when the app opens read-only/embedded views).
   */
  disable(t, e, n) {
    this.assertReady();
    const s = this.v2;
    e || s.nodes.allNodes.forEach((o) => o.lock?.()), t || (this.options.enabled = !1, this.options.allowDrag = !1, s.disablePanZoom?.(), n && (s.birdsEye?.disable?.(), s.zoomSlider?.disable?.()));
  }
  /** v1: `slate.enable(exemptSlate?, exemptNodes?)` — reverse of disable() */
  enable(t, e) {
    this.assertReady();
    const n = this.v2;
    e || n.nodes.allNodes.forEach((s) => {
      s.options?.isLocked || s.unlock?.();
    }), t || (this.options.enabled = !0, this.options.allowDrag = !0, n.enablePanZoom?.());
  }
  /** v1: `slate.png({base64: true}, cb)` — thumbnail export */
  png(t, e) {
    return this.assertReady(), this.v2.png(t, e);
  }
  assertReady() {
    if (!this.v2)
      throw new Error(
        "SLATEBOX_COMPAT: slate.init() must complete before use"
      );
  }
}
const Et = class Et {
  constructor(t) {
    this.registerPlugins(t);
  }
  registerPlugins(t) {
    const e = this.constructor.name, n = Et.availablePlugins[e];
    n && n.forEach(({ name: s, plugin: o }) => {
      this.plugins || (this.plugins = {}), this.plugins[s] = new o(t);
    });
  }
  static registerPlugin(t) {
    if (!t?.name || !t?.plugin)
      throw new Error(
        "Plugins must provide a name and a plugin (class definition)"
      );
    const e = Object.getPrototypeOf(t.plugin).name;
    Et.availablePlugins[e] || (Et.availablePlugins[e] = []), Et.availablePlugins[e] = [...Et.availablePlugins[e], t];
  }
};
Et.availablePlugins = {};
let cn = Et;
const pl = {
  slate: fl,
  node: Ht,
  base: cn,
  utils: ja
};
function gl(i, t = {}) {
  return new le(i, t);
}
typeof window < "u" && (window.SlateboxJS = gl, window.Slate = le, window.Node = Oe, window.PanZoom = ss, window.ResizeRotate = Hi, window.BirdsEye = os, window.Connector = Ie, window.Serialization = tl, window.ShapeRegistry = va, window.Relationship = fa, window.Relationships = Ui, window.FontLoader = ma, window.Images = Fi, window.Editor = Yi, window.UndoRedo = cs, window.MultiSelection = hs, window.Grid = ds, window.Menu = ji, window.Keyboard = us, window.ContextMenu = fs, window.Filters = $i, window.Links = Xi, window.Export = el, window.Collab = gs, window.Theme = sl, window.Layout = ol, window.ZoomSlider = xs, window.Comments = cl, window.Presentation = _s, window.Slatebox = Object.assign({}, pl, { compat: Ea }));
export {
  os as BirdsEye,
  gs as Collab,
  cl as Comments,
  Ie as Connector,
  fs as ContextMenu,
  Yi as Editor,
  el as ExportModule,
  $i as Filters,
  ma as FontLoader,
  ds as Grid,
  Fi as Images,
  Ka as Invoker,
  us as Keyboard,
  ol as Layout,
  Xi as Links,
  ji as Menu,
  hs as MultiSelection,
  Oe as Node,
  qa as NodesManager,
  ss as PanZoom,
  _s as Presentation,
  fa as Relationship,
  Ui as Relationships,
  Hi as ResizeRotate,
  tl as Serialization,
  va as ShapeRegistry,
  le as Slate,
  pl as Slatebox,
  gl as SlateboxJS,
  sl as Theme,
  cs as UndoRedo,
  xs as ZoomSlider,
  Ea as compat,
  gl as default,
  wl as getFilterNames,
  bl as registerFilter,
  ja as utils
};
//# sourceMappingURL=slateboxjs.es.js.map
