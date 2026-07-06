const Xe = {}, Kn = [];
function A(n, t) {
  if (Array.isArray(n)) {
    for (const e of n)
      A(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n)
      A(e, n[e]);
    return;
  }
  Qn(Object.getOwnPropertyNames(t)), Xe[n] = Object.assign(Xe[n] || {}, t);
}
function st(n) {
  return Xe[n] || {};
}
function Ss() {
  return [...new Set(Kn)];
}
function Qn(n) {
  Kn.push(...n);
}
function cn(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    s.push(t(n[e]));
  return s;
}
function Ms(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    t(n[e]) && s.push(n[e]);
  return s;
}
function Le(n) {
  return n % 360 * Math.PI / 180;
}
function ks(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function Jn(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function Yt(n, t, e, i) {
  return (t == null || e == null) && (i = i || n.bbox(), t == null ? t = i.width / i.height * e : e == null && (e = i.height / i.width * t)), {
    width: t,
    height: e
  };
}
function $e(n, t) {
  const e = n.origin;
  let i = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", s = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([i, s] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof i == "string", r = typeof s == "string";
  if (o || r) {
    const { height: a, width: l, x: c, y: h } = t.bbox();
    o && (i = i.includes("left") ? c : i.includes("right") ? c + l : c + l / 2), r && (s = s.includes("top") ? h : s.includes("bottom") ? h + a : h + a / 2);
  }
  return [i, s];
}
const Ts = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), We = (n) => Ts.has(n.nodeName), ti = (n, t, e = {}) => {
  const i = { ...t };
  for (const s in i)
    i[s].valueOf() === e[s] && delete i[s];
  Object.keys(i).length ? n.node.setAttribute("data-svgjs", JSON.stringify(i)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, hn = "http://www.w3.org/2000/svg", As = "http://www.w3.org/1999/xhtml", Be = "http://www.w3.org/2000/xmlns/", ce = "http://www.w3.org/1999/xlink", D = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function dn() {
  return D.window;
}
class un {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}
const Nt = {}, fn = "___SYMBOL___ROOT___";
function se(n, t = hn) {
  return D.document.createElementNS(t, n);
}
function it(n, t = !1) {
  if (n instanceof un) return n;
  if (typeof n == "object")
    return Ge(n);
  if (n == null)
    return new Nt[fn]();
  if (typeof n == "string" && n.trim().charAt(0) !== "<")
    return Ge(D.document.querySelector(n));
  const e = t ? D.document.createElement("div") : se("svg");
  return e.innerHTML = n.trim(), n = Ge(e.firstElementChild), e.removeChild(e.firstElementChild), n;
}
function F(n, t) {
  return t && (t instanceof D.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : se(n);
}
function pt(n) {
  if (!n) return null;
  if (n.instance instanceof un) return n.instance;
  if (n.nodeName === "#document-fragment")
    return new Nt.Fragment(n);
  let t = Jn(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : Nt[t] || (t = "Dom"), new Nt[t](n);
}
let Ge = pt;
function P(n, t = n.name, e = !1) {
  return Nt[t] = n, e && (Nt[fn] = n), Qn(Object.getOwnPropertyNames(n.prototype)), n;
}
function Rs(n) {
  return Nt[n];
}
let Ns = 1e3;
function ei(n) {
  return "Svgjs" + Jn(n) + Ns++;
}
function ni(n) {
  for (let t = n.children.length - 1; t >= 0; t--)
    ni(n.children[t]);
  return n.id && (n.id = ei(n.nodeName)), n;
}
function T(n, t) {
  let e, i;
  for (n = Array.isArray(n) ? n : [n], i = n.length - 1; i >= 0; i--)
    for (e in t)
      n[i].prototype[e] = t[e];
}
function U(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function Ds() {
  return this.parent().children();
}
function Ps() {
  return this.parent().index(this);
}
function Is() {
  return this.siblings()[this.position() + 1];
}
function Os() {
  return this.siblings()[this.position() - 1];
}
function zs() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function Ls() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function Bs() {
  return this.parent().add(this.remove()), this;
}
function Gs() {
  return this.parent().add(this.remove(), 0), this;
}
function Hs(n) {
  n = it(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function Us(n) {
  n = it(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function Fs(n) {
  return n = it(n), n.before(this), this;
}
function Zs(n) {
  return n = it(n), n.after(this), this;
}
A("Dom", {
  siblings: Ds,
  position: Ps,
  next: Is,
  prev: Os,
  forward: zs,
  backward: Ls,
  front: Bs,
  back: Gs,
  before: Hs,
  after: Us,
  insertBefore: Fs,
  insertAfter: Zs
});
const ii = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, Ys = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, Xs = /rgb\((\d+),(\d+),(\d+)\)/, $s = /(#[a-z_][a-z0-9\-_]*)/i, Ws = /\)\s*,?\s*/, js = /\s/g, On = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, zn = /^rgb\(/, Ln = /^(\s+)?$/, Bn = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Vs = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, _t = /[\s,]+/, pn = /[MLHVCSQTAZ]/i;
function qs() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(_t);
}
function Ks(n) {
  return this.classes().indexOf(n) !== -1;
}
function Qs(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function Js(n) {
  return this.hasClass(n) && this.attr(
    "class",
    this.classes().filter(function(t) {
      return t !== n;
    }).join(" ")
  ), this;
}
function to(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
A("Dom", {
  classes: qs,
  hasClass: Ks,
  addClass: Qs,
  removeClass: Js,
  toggleClass: to
});
function eo(n, t) {
  const e = {};
  if (arguments.length === 0)
    return this.node.style.cssText.split(/\s*;\s*/).filter(function(i) {
      return !!i.length;
    }).forEach(function(i) {
      const s = i.split(/\s*:\s*/);
      e[s[0]] = s[1];
    }), e;
  if (arguments.length < 2) {
    if (Array.isArray(n)) {
      for (const i of n) {
        const s = i;
        e[i] = this.node.style.getPropertyValue(s);
      }
      return e;
    }
    if (typeof n == "string")
      return this.node.style.getPropertyValue(n);
    if (typeof n == "object")
      for (const i in n)
        this.node.style.setProperty(
          i,
          n[i] == null || Ln.test(n[i]) ? "" : n[i]
        );
  }
  return arguments.length === 2 && this.node.style.setProperty(
    n,
    t == null || Ln.test(t) ? "" : t
  ), this;
}
function no() {
  return this.css("display", "");
}
function io() {
  return this.css("display", "none");
}
function so() {
  return this.css("display") !== "none";
}
A("Dom", {
  css: eo,
  show: no,
  hide: io,
  visible: so
});
function oo(n, t, e) {
  if (n == null)
    return this.data(
      cn(
        Ms(
          this.node.attributes,
          (i) => i.nodeName.indexOf("data-") === 0
        ),
        (i) => i.nodeName.slice(5)
      )
    );
  if (n instanceof Array) {
    const i = {};
    for (const s of n)
      i[s] = this.data(s);
    return i;
  } else if (typeof n == "object")
    for (t in n)
      this.data(t, n[t]);
  else if (arguments.length < 2)
    try {
      return JSON.parse(this.attr("data-" + n));
    } catch {
      return this.attr("data-" + n);
    }
  else
    this.attr(
      "data-" + n,
      t === null ? null : e === !0 || typeof t == "string" || typeof t == "number" ? t : JSON.stringify(t)
    );
  return this;
}
A("Dom", { data: oo });
function ro(n, t) {
  if (typeof arguments[0] == "object")
    for (const e in n)
      this.remember(e, n[e]);
  else {
    if (arguments.length === 1)
      return this.memory()[n];
    this.memory()[n] = t;
  }
  return this;
}
function ao() {
  if (arguments.length === 0)
    this._memory = {};
  else
    for (let n = arguments.length - 1; n >= 0; n--)
      delete this.memory()[arguments[n]];
  return this;
}
function lo() {
  return this._memory = this._memory || {};
}
A("Dom", { remember: ro, forget: ao, memory: lo });
function co(n) {
  return n.length === 4 ? [
    "#",
    n.substring(1, 2),
    n.substring(1, 2),
    n.substring(2, 3),
    n.substring(2, 3),
    n.substring(3, 4),
    n.substring(3, 4)
  ].join("") : n;
}
function ho(n) {
  const t = Math.round(n), i = Math.max(0, Math.min(255, t)).toString(16);
  return i.length === 1 ? "0" + i : i;
}
function zt(n, t) {
  for (let e = t.length; e--; )
    if (n[t[e]] == null)
      return !1;
  return !0;
}
function uo(n, t) {
  const e = zt(n, "rgb") ? { _a: n.r, _b: n.g, _c: n.b, _d: 0, space: "rgb" } : zt(n, "xyz") ? { _a: n.x, _b: n.y, _c: n.z, _d: 0, space: "xyz" } : zt(n, "hsl") ? { _a: n.h, _b: n.s, _c: n.l, _d: 0, space: "hsl" } : zt(n, "lab") ? { _a: n.l, _b: n.a, _c: n.b, _d: 0, space: "lab" } : zt(n, "lch") ? { _a: n.l, _b: n.c, _c: n.h, _d: 0, space: "lch" } : zt(n, "cmyk") ? { _a: n.c, _b: n.m, _c: n.y, _d: n.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
  return e.space = t || e.space, e;
}
function fo(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function He(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
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
    const { random: i, round: s, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * i() + 57, l = 38 * i() + 45, c = 360 * i();
      return new L(a, l, c, "lch");
    } else if (t === "sine") {
      e = e ?? i();
      const a = s(80 * o(2 * r * e / 0.5 + 0.01) + 150), l = s(50 * o(2 * r * e / 0.5 + 4.6) + 200), c = s(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new L(a, l, c);
    } else if (t === "pastel") {
      const a = 8 * i() + 86, l = 17 * i() + 9, c = 360 * i();
      return new L(a, l, c, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * i(), l = 50 * i() + 86, c = 360 * i();
      return new L(a, l, c, "lch");
    } else if (t === "rgb") {
      const a = 255 * i(), l = 255 * i(), c = 255 * i();
      return new L(a, l, c);
    } else if (t === "lab") {
      const a = 100 * i(), l = 256 * i() - 128, c = 256 * i() - 128;
      return new L(a, l, c, "lab");
    } else if (t === "grey") {
      const a = 255 * i();
      return new L(a, a, a);
    } else
      throw new Error("Unsupported random color mode");
  }
  // Test if given value is a color string
  static test(t) {
    return typeof t == "string" && (On.test(t) || zn.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((u) => u / 255), a = Math.min(1 - s, 1 - o, 1 - r);
    if (a === 1)
      return new L(0, 0, 0, 1, "cmyk");
    const l = (1 - s - a) / (1 - a), c = (1 - o - a) / (1 - a), h = (1 - r - a) / (1 - a);
    return new L(l, c, h, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((p) => p / 255), a = Math.max(s, o, r), l = Math.min(s, o, r), c = (a + l) / 2, h = a === l, d = a - l, u = h ? 0 : c > 0.5 ? d / (2 - a - l) : d / (a + l), f = h ? 0 : a === s ? ((o - r) / d + (o < r ? 6 : 0)) / 6 : a === o ? ((r - s) / d + 2) / 6 : a === r ? ((s - o) / d + 4) / 6 : 0;
    return new L(360 * f, 100 * u, 100 * c, "hsl");
  }
  init(t = 0, e = 0, i = 0, s = 0, o = "rgb") {
    if (t = t || 0, this.space)
      for (const d in this.space)
        delete this[this.space[d]];
    if (typeof t == "number")
      o = typeof s == "string" ? s : o, s = typeof s == "string" ? 0 : s, Object.assign(this, { _a: t, _b: e, _c: i, _d: s, space: o });
    else if (t instanceof Array)
      this.space = e || (typeof t[3] == "string" ? t[3] : t[4]) || "rgb", Object.assign(this, { _a: t[0], _b: t[1], _c: t[2], _d: t[3] || 0 });
    else if (t instanceof Object) {
      const d = uo(t, e);
      Object.assign(this, d);
    } else if (typeof t == "string")
      if (zn.test(t)) {
        const d = t.replace(js, ""), [u, f, g] = Xs.exec(d).slice(1, 4).map((p) => parseInt(p));
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else if (On.test(t)) {
        const d = (p) => parseInt(p, 16), [, u, f, g] = Ys.exec(co(t)).map(d);
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: l, _d: c } = this, h = this.space === "rgb" ? { r, g: a, b: l } : this.space === "xyz" ? { x: r, y: a, z: l } : this.space === "hsl" ? { h: r, s: a, l } : this.space === "lab" ? { l: r, a, b: l } : this.space === "lch" ? { l: r, c: a, h: l } : this.space === "cmyk" ? { c: r, m: a, y: l, k: c } : {};
    Object.assign(this, h);
  }
  lab() {
    const { x: t, y: e, z: i } = this.xyz(), s = 116 * e - 16, o = 500 * (t - e), r = 200 * (e - i);
    return new L(s, o, r, "lab");
  }
  lch() {
    const { l: t, a: e, b: i } = this.lab(), s = Math.sqrt(e ** 2 + i ** 2);
    let o = 180 * Math.atan2(i, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new L(t, s, o, "lch");
  }
  /*
  Conversion Methods
  */
  rgb() {
    if (this.space === "rgb")
      return this;
    if (fo(this.space)) {
      let { x: t, y: e, z: i } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: f, a: g, b: p } = this;
        if (this.space === "lch") {
          const { c: x, h: C } = this, R = Math.PI / 180;
          g = x * Math.cos(R * C), p = x * Math.sin(R * C);
        }
        const y = (f + 16) / 116, m = g / 500 + y, b = y - p / 200, w = 16 / 116, v = 8856e-6, _ = 7.787;
        t = 0.95047 * (m ** 3 > v ? m ** 3 : (m - w) / _), e = 1 * (y ** 3 > v ? y ** 3 : (y - w) / _), i = 1.08883 * (b ** 3 > v ? b ** 3 : (b - w) / _);
      }
      const s = t * 3.2406 + e * -1.5372 + i * -0.4986, o = t * -0.9689 + e * 1.8758 + i * 0.0415, r = t * 0.0557 + e * -0.204 + i * 1.057, a = Math.pow, l = 31308e-7, c = s > l ? 1.055 * a(s, 1 / 2.4) - 0.055 : 12.92 * s, h = o > l ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, d = r > l ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new L(255 * c, 255 * h, 255 * d);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: i } = this;
      if (t /= 360, e /= 100, i /= 100, e === 0)
        return i *= 255, new L(i, i, i);
      const s = i < 0.5 ? i * (1 + e) : i + e - i * e, o = 2 * i - s, r = 255 * He(o, s, t + 1 / 3), a = 255 * He(o, s, t), l = 255 * He(o, s, t - 1 / 3);
      return new L(r, a, l);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: i, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), r = 255 * (1 - Math.min(1, e * (1 - s) + s)), a = 255 * (1 - Math.min(1, i * (1 - s) + s));
      return new L(o, r, a);
    } else
      return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: i, _d: s, space: o } = this;
    return [t, e, i, s, o];
  }
  toHex() {
    const [t, e, i] = this._clamped().map(ho);
    return `#${t}${e}${i}`;
  }
  toRgb() {
    const [t, e, i] = this._clamped();
    return `rgb(${t},${e},${i})`;
  }
  toString() {
    return this.toHex();
  }
  xyz() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((m) => m / 255), a = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, l = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, c = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, h = (a * 0.4124 + l * 0.3576 + c * 0.1805) / 0.95047, d = (a * 0.2126 + l * 0.7152 + c * 0.0722) / 1, u = (a * 0.0193 + l * 0.1192 + c * 0.9505) / 1.08883, f = h > 8856e-6 ? Math.pow(h, 1 / 3) : 7.787 * h + 16 / 116, g = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, p = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116;
    return new L(f, g, p, "xyz");
  }
  /*
  Input and Output methods
  */
  _clamped() {
    const { _a: t, _b: e, _c: i } = this.rgb(), { max: s, min: o, round: r } = Math, a = (l) => s(0, o(r(l), 255));
    return [t, e, i].map(a);
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
    const i = { x: 0, y: 0 }, s = Array.isArray(t) ? { x: t[0], y: t[1] } : typeof t == "object" ? { x: t.x, y: t.y } : { x: t, y: e };
    return this.x = s.x == null ? i.x : s.x, this.y = s.y == null ? i.y : s.y, this;
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
    const { x: e, y: i } = this;
    return this.x = t.a * e + t.c * i + t.e, this.y = t.b * e + t.d * i + t.f, this;
  }
}
function po(n, t) {
  return new X(n, t).transformO(this.screenCTM().inverseO());
}
function Lt(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
let N = class $ {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, i = t.flip && (e || t.flip === "x") ? -1 : 1, s = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleX) ? t.scaleX * i : i, l = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, c = t.shear || 0, h = t.rotate || t.theta || 0, d = new X(
      t.origin || t.around || t.ox || t.originX,
      t.oy || t.originY
    ), u = d.x, f = d.y, g = new X(
      t.position || t.px || t.positionX || NaN,
      t.py || t.positionY || NaN
    ), p = g.x, y = g.y, m = new X(
      t.translate || t.tx || t.translateX,
      t.ty || t.translateY
    ), b = m.x, w = m.y, v = new X(
      t.relative || t.rx || t.relativeX,
      t.ry || t.relativeY
    ), _ = v.x, x = v.y;
    return {
      scaleX: a,
      scaleY: l,
      skewX: o,
      skewY: r,
      shear: c,
      theta: h,
      rx: _,
      ry: x,
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
  static matrixMultiply(t, e, i) {
    const s = t.a * e.a + t.c * e.b, o = t.b * e.a + t.d * e.b, r = t.a * e.c + t.c * e.d, a = t.b * e.c + t.d * e.d, l = t.e + t.a * e.e + t.c * e.f, c = t.f + t.b * e.e + t.d * e.f;
    return i.a = s, i.b = o, i.c = r, i.d = a, i.e = l, i.f = c, i;
  }
  around(t, e, i) {
    return this.clone().aroundO(t, e, i);
  }
  // Transform around a center point
  aroundO(t, e, i) {
    const s = t || 0, o = e || 0;
    return this.translateO(-s, -o).lmultiplyO(i).translateO(s, o);
  }
  // Clones this matrix
  clone() {
    return new $(this);
  }
  // Decomposes this matrix into its affine parameters
  decompose(t = 0, e = 0) {
    const i = this.a, s = this.b, o = this.c, r = this.d, a = this.e, l = this.f, c = i * r - s * o, h = c > 0 ? 1 : -1, d = h * Math.sqrt(i * i + s * s), u = Math.atan2(h * s, h * i), f = 180 / Math.PI * u, g = Math.cos(u), p = Math.sin(u), y = (i * o + s * r) / c, m = o * d / (y * i - s) || r * d / (y * s + i), b = a - t + t * g * d + e * (y * g * d - p * m), w = l - e + t * p * d + e * (y * p * d + g * m);
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
    return Lt(this.a, e.a) && Lt(this.b, e.b) && Lt(this.c, e.c) && Lt(this.d, e.d) && Lt(this.e, e.e) && Lt(this.f, e.f);
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
    const t = this.a, e = this.b, i = this.c, s = this.d, o = this.e, r = this.f, a = t * s - e * i;
    if (!a) throw new Error("Cannot invert " + this);
    const l = s / a, c = -e / a, h = -i / a, d = t / a, u = -(l * o + h * r), f = -(c * o + d * r);
    return this.a = l, this.b = c, this.c = h, this.d = d, this.e = u, this.f = f, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, i = t instanceof $ ? t : new $(t);
    return $.matrixMultiply(i, e, this);
  }
  // Left multiplies by the given matrix
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, i = t instanceof $ ? t : new $(t);
    return $.matrixMultiply(e, i, this);
  }
  // Rotate matrix
  rotate(t, e, i) {
    return this.clone().rotateO(t, e, i);
  }
  rotateO(t, e = 0, i = 0) {
    t = Le(t);
    const s = Math.cos(t), o = Math.sin(t), { a: r, b: a, c: l, d: c, e: h, f: d } = this;
    return this.a = r * s - a * o, this.b = a * s + r * o, this.c = l * s - c * o, this.d = c * s + l * o, this.e = h * s - d * o + i * o - e * s + e, this.f = d * s + h * o - e * o - i * s + i, this;
  }
  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t);
    const { a: o, b: r, c: a, d: l, e: c, f: h } = this;
    return this.a = o * t, this.b = r * e, this.c = a * t, this.d = l * e, this.e = c * t - i * t + i, this.f = h * e - s * e + s, this;
  }
  // Shear matrix
  shear(t, e, i) {
    return this.clone().shearO(t, e, i);
  }
  // eslint-disable-next-line no-unused-vars
  shearO(t, e = 0, i = 0) {
    const { a: s, b: o, c: r, d: a, e: l, f: c } = this;
    return this.a = s + o * t, this.c = r + a * t, this.e = l + c * t - i * t, this;
  }
  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t), t = Le(t), e = Le(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: l, c, d: h, e: d, f: u } = this;
    return this.a = a + l * o, this.b = l + a * r, this.c = c + h * o, this.d = h + c * r, this.e = d + u * o - s * o, this.f = u + d * r - i * r, this;
  }
  // SkewX
  skewX(t, e, i) {
    return this.skew(t, 0, e, i);
  }
  // SkewY
  skewY(t, e, i) {
    return this.skew(0, t, e, i);
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
    const e = $.formatTransforms(t), i = this, { x: s, y: o } = new X(e.ox, e.oy).transform(i), r = new $().translateO(e.rx, e.ry).lmultiplyO(i).translateO(-s, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(s, o);
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
function go() {
  return new N(this.node.getCTM());
}
function mo() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new N(t);
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
    const n = it().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true");
    const t = n.path().node;
    St.nodes = { svg: n, path: t };
  }
  if (!St.nodes.svg.node.parentNode) {
    const n = D.document.body || D.document.documentElement;
    St.nodes.svg.addTo(n);
  }
  return St.nodes;
}
function si(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function yo(n) {
  return n === D.document || (D.document.documentElement.contains || function(t) {
    for (; t.parentNode; )
      t = t.parentNode;
    return t === D.document;
  }).call(D.document.documentElement, n);
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
    return si(this);
  }
  // Merge rect box with another, return a new instance
  merge(t) {
    const e = Math.min(this.x, t.x), i = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - i;
    return new Y(e, i, s, o);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof N || (t = new N(t));
    let e = 1 / 0, i = -1 / 0, s = 1 / 0, o = -1 / 0;
    return [
      new X(this.x, this.y),
      new X(this.x2, this.y),
      new X(this.x, this.y2),
      new X(this.x2, this.y2)
    ].forEach(function(a) {
      a = a.transform(t), e = Math.min(e, a.x), i = Math.max(i, a.x), s = Math.min(s, a.y), o = Math.max(o, a.y);
    }), new Y(e, s, i - e, o - s);
  }
}
function oi(n, t, e) {
  let i;
  try {
    if (i = t(n.node), si(i) && !yo(n.node))
      throw new Error("Element not in the dom");
  } catch {
    i = e(n);
  }
  return i;
}
function bo() {
  const e = oi(this, (s) => s.getBBox(), (s) => {
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
function wo(n) {
  const i = oi(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(
      `Getting rbox of element "${o.node.nodeName}" is not possible`
    );
  }), s = new Y(i);
  return n ? s.transform(n.screenCTM().inverseO()) : s.addOffset();
}
function vo(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
A({
  viewbox: {
    viewbox(n, t, e, i) {
      return n == null ? new Y(this.attr("viewBox")) : this.attr("viewBox", new Y(n, t, e, i));
    },
    zoom(n, t) {
      let { width: e, height: i } = this.attr(["width", "height"]);
      if ((!e && !i || typeof e == "string" || typeof i == "string") && (e = this.node.clientWidth, i = this.node.clientHeight), !e || !i)
        throw new Error(
          "Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element"
        );
      const s = this.viewbox(), o = e / s.width, r = i / s.height, a = Math.min(o, r);
      if (n == null)
        return a;
      let l = a / n;
      l === 1 / 0 && (l = Number.MAX_SAFE_INTEGER / 100), t = t || new X(e / 2 / o + s.x, i / 2 / r + s.y);
      const c = new Y(s).transform(
        new N({ scale: l, origin: t })
      );
      return this.viewbox(c);
    }
  }
});
P(Y, "Box");
class Dt extends Array {
  constructor(t = [], ...e) {
    if (super(t, ...e), typeof t == "number") return this;
    this.length = 0, this.push(...t);
  }
}
T([Dt], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, i, s) => n.call(e, e, i, s)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const xo = ["toArray", "constructor", "each"];
Dt.extend = function(n) {
  n = n.reduce((t, e) => (xo.includes(e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...i) {
    return this.each(e, ...i);
  }), t), {}), T([Dt], n);
};
function Xt(n, t) {
  return new Dt(
    cn((t || D.document).querySelectorAll(n), function(e) {
      return pt(e);
    })
  );
}
function _o(n) {
  return Xt(n, this.node);
}
function Co(n) {
  return pt(this.node.querySelector(n));
}
let Eo = 0;
const ri = {};
function ai(n) {
  let t = n.getEventHolder();
  return t === D.window && (t = ri), t.events || (t.events = {}), t.events;
}
function gn(n) {
  return n.getEventTarget();
}
function So(n) {
  let t = n.getEventHolder();
  t === D.window && (t = ri), t.events && (t.events = {});
}
function ct(n, t, e, i, s) {
  const o = e.bind(i || n), r = it(n), a = ai(r), l = gn(r);
  t = Array.isArray(t) ? t : t.split(_t), e._svgjsListenerId || (e._svgjsListenerId = ++Eo), t.forEach(function(c) {
    const h = c.split(".")[0], d = c.split(".")[1] || "*";
    a[h] = a[h] || {}, a[h][d] = a[h][d] || {}, a[h][d][e._svgjsListenerId] = o, l.addEventListener(h, o, s || !1);
  });
}
function J(n, t, e, i) {
  const s = it(n), o = ai(s), r = gn(s);
  typeof e == "function" && (e = e._svgjsListenerId, !e) || (t = Array.isArray(t) ? t : (t || "").split(_t), t.forEach(function(a) {
    const l = a && a.split(".")[0], c = a && a.split(".")[1];
    let h, d;
    if (e)
      o[l] && o[l][c || "*"] && (r.removeEventListener(
        l,
        o[l][c || "*"][e],
        i || !1
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
      So(s);
    }
  }));
}
function Mo(n, t, e, i) {
  const s = gn(n);
  return t instanceof D.window.Event || (t = new D.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...i
  })), s.dispatchEvent(t), t;
}
class he extends un {
  addEventListener() {
  }
  dispatch(t, e, i) {
    return Mo(this, t, e, i);
  }
  dispatchEvent(t) {
    const e = this.getEventHolder().events;
    if (!e) return !0;
    const i = e[t.type];
    for (const s in i)
      for (const o in i[s])
        i[s][o](t);
    return !t.defaultPrevented;
  }
  // Fire given event
  fire(t, e, i) {
    return this.dispatch(t, e, i), this;
  }
  getEventHolder() {
    return this;
  }
  getEventTarget() {
    return this;
  }
  // Unbind event from listener
  off(t, e, i) {
    return J(this, t, e, i), this;
  }
  // Bind given event to listener
  on(t, e, i, s) {
    return ct(this, t, e, i, s), this;
  }
  removeEventListener() {
  }
}
P(he, "EventTarget");
function Gn() {
}
const ie = {
  duration: 400,
  ease: ">",
  delay: 0
}, ko = {
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
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(ii), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof M && (this.value = t.valueOf(), this.unit = t.unit), this;
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
const To = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), li = [];
function Ao(n) {
  li.push(n);
}
function Ro(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const i of t)
      n[i.nodeName] = Bn.test(i.nodeValue) ? parseFloat(i.nodeValue) : i.nodeValue;
    return n;
  } else {
    if (n instanceof Array)
      return n.reduce((i, s) => (i[s] = this.attr(s), i), {});
    if (typeof n == "object" && n.constructor === Object)
      for (t in n) this.attr(t, n[t]);
    else if (t === null)
      this.node.removeAttribute(n);
    else {
      if (t == null)
        return t = this.node.getAttribute(n), t == null ? ko[n] : Bn.test(t) ? parseFloat(t) : t;
      t = li.reduce((i, s) => s(n, i, this), t), typeof t == "number" ? t = new M(t) : To.has(n) && L.isColor(t) ? t = new L(t) : t.constructor === Array && (t = new Ut(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
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
    return new Dt(
      cn(this.node.children, function(t) {
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
    let i = this.node.cloneNode(t);
    return e && (i = ni(i)), new this.constructor(i);
  }
  // Iterates over all children and invokes a given block
  each(t, e) {
    const i = this.children();
    let s, o;
    for (s = 0, o = i.length; s < o; s++)
      t.apply(i[s], [s, i]), e && i[s].each(t, e);
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
    return this.xml(t, e, As);
  }
  // Get / set id
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = ei(this.type)), this.attr("id", t);
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
    const e = this.node, i = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return i && i.call(e, t);
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
    const i = 10 ** t, s = this.attr(e);
    for (const o in s)
      typeof s[o] == "number" && (s[o] = Math.round(s[o] * i) / i);
    return this.attr(s), this;
  }
  // Import / Export raw svg
  svg(t, e) {
    return this.xml(t, e, hn);
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
    const i = e.index(this);
    return e.put(t, i).put(this);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return this.each(function() {
      this.writeDataToDom();
    }), this;
  }
  // Import / Export raw svg
  xml(t, e, i) {
    if (typeof t == "boolean" && (i = e, e = t, t = null), t == null || typeof t == "function") {
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
    const s = se("wrapper", i), o = D.document.createDocumentFragment();
    s.innerHTML = t;
    for (let a = s.children.length; a--; )
      o.appendChild(s.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
}
T(kt, { attr: Ro, find: _o, findOne: Co });
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
    const i = new Dt();
    let s = this;
    for (; (s = s.parent()) && s.node !== D.document && s.nodeName !== "#document-fragment" && (i.push(s), !(!e && s.node === t.node || e && s.matches(t))); )
      if (s.node === this.root().node)
        return null;
    return i;
  }
  // Get referenced element form attribute value
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = (t + "").match($s);
    return e ? it(e[1]) : null;
  }
  // Get parent document
  root() {
    const t = this.parent(Rs(fn));
    return t && t.root();
  }
  // set given data to the elements data property
  setData(t) {
    return this.dom = t, this;
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Yt(this, t, e);
    return this.width(new M(i.width)).height(new M(i.height));
  }
  // Set width of element
  width(t) {
    return this.attr("width", t);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return ti(this, this.dom), super.writeDataToDom();
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
T(ot, {
  bbox: bo,
  rbox: wo,
  inside: vo,
  point: po,
  ctm: go,
  screenCTM: mo
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
  prefix: function(n, t) {
    return t === "color" ? n : n + "-" + t;
  }
};
["fill", "stroke"].forEach(function(n) {
  const t = {};
  let e;
  t[n] = function(i) {
    if (typeof i > "u")
      return this.attr(n);
    if (typeof i == "string" || i instanceof L || L.isRgb(i) || i instanceof ot)
      this.attr(n, i);
    else
      for (e = Jt[n].length - 1; e >= 0; e--)
        i[Jt[n][e]] != null && this.attr(Jt.prefix(n, Jt[n][e]), i[Jt[n][e]]);
    return this;
  }, A(["Element", "Runner"], t);
});
A(["Element", "Runner"], {
  // Let the user set the matrix directly
  matrix: function(n, t, e, i, s, o) {
    return n == null ? new N(this) : this.attr("transform", new N(n, t, e, i, s, o));
  },
  // Map rotation to transform
  rotate: function(n, t, e) {
    return this.transform({ rotate: n, ox: t, oy: e }, !0);
  },
  // Map skew to transform
  skew: function(n, t, e, i) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ skew: n, ox: t, oy: e }, !0) : this.transform({ skew: [n, t], ox: e, oy: i }, !0);
  },
  shear: function(n, t, e) {
    return this.transform({ shear: n, ox: t, oy: e }, !0);
  },
  // Map scale to transform
  scale: function(n, t, e, i) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ scale: n, ox: t, oy: e }, !0) : this.transform({ scale: [n, t], ox: e, oy: i }, !0);
  },
  // Map translate to transform
  translate: function(n, t) {
    return this.transform({ translate: [n, t] }, !0);
  },
  // Map relative translations to transform
  relative: function(n, t) {
    return this.transform({ relative: [n, t] }, !0);
  },
  // Map flip to transform
  flip: function(n = "both", t = "center") {
    return "xybothtrue".indexOf(n) === -1 && (t = n, n = "both"), this.transform({ flip: n, origin: t }, !0);
  },
  // Opacity
  opacity: function(n) {
    return this.attr("opacity", n);
  }
});
A("radius", {
  // Add x and y radius
  radius: function(n, t = n) {
    return (this._element || this).type === "radialGradient" ? this.attr("r", new M(n)) : this.rx(n).ry(t);
  }
});
A("Path", {
  // Get path length
  length: function() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function(n) {
    return new X(this.node.getPointAtLength(n));
  }
});
A(["Element", "Runner"], {
  // Set font
  font: function(n, t) {
    if (typeof n == "object") {
      for (t in n) this.font(t, n[t]);
      return this;
    }
    return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
  }
});
const No = [
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
].reduce(function(n, t) {
  const e = function(i) {
    return i === null ? this.off(t) : this.on(t, i), this;
  };
  return n[t] = e, n;
}, {});
A("Element", No);
function Do() {
  return this.attr("transform", null);
}
function Po() {
  return (this.attr("transform") || "").split(Ws).slice(0, -1).map(function(t) {
    const e = t.trim().split("(");
    return [
      e[0],
      e[1].split(_t).map(function(i) {
        return parseFloat(i);
      })
    ];
  }).reverse().reduce(function(t, e) {
    return e[0] === "matrix" ? t.lmultiply(N.fromArray(e[1])) : t[e[0]].apply(t, e[1]);
  }, new N());
}
function Io(n, t) {
  if (this === n) return this;
  if (We(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), i = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(i.multiply(e)), this;
}
function Oo(n) {
  return this.toParent(this.root(), n);
}
function zo(n, t) {
  if (n == null || typeof n == "string") {
    const s = new N(this).decompose();
    return n == null ? s : s[n];
  }
  N.isMatrixLike(n) || (n = { ...n, origin: $e(n, this) });
  const e = t === !0 ? this : t || !1, i = new N(e).transform(n);
  return this.attr("transform", i);
}
A("Element", {
  untransform: Do,
  matrixify: Po,
  toParent: Io,
  toRoot: Oo,
  transform: zo
});
class rt extends ot {
  flatten() {
    return this.each(function() {
      if (this instanceof rt)
        return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(i, s) {
      return s[s.length - i - 1].toParent(t, e);
    }), this.remove();
  }
}
P(rt, "Container");
class mn extends rt {
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
P(mn, "Defs");
class dt extends ot {
}
P(dt, "Shape");
function yn(n) {
  return this.attr("rx", n);
}
function bn(n) {
  return this.attr("ry", n);
}
function ci(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function hi(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function di(n) {
  return this.attr("cx", n);
}
function ui(n) {
  return this.attr("cy", n);
}
function fi(n) {
  return n == null ? this.rx() * 2 : this.rx(new M(n).divide(2));
}
function pi(n) {
  return n == null ? this.ry() * 2 : this.ry(new M(n).divide(2));
}
const Lo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cx: di,
  cy: ui,
  height: pi,
  rx: yn,
  ry: bn,
  width: fi,
  x: ci,
  y: hi
}, Symbol.toStringTag, { value: "Module" }));
class de extends dt {
  constructor(t, e = t) {
    super(F("ellipse", t), e);
  }
  size(t, e) {
    const i = Yt(this, t, e);
    return this.rx(new M(i.width).divide(2)).ry(
      new M(i.height).divide(2)
    );
  }
}
T(de, Lo);
A("Container", {
  // Create an ellipse
  ellipse: U(function(n = 0, t = n) {
    return this.put(new de()).size(n, t).move(0, 0);
  })
});
P(de, "Ellipse");
class gi extends kt {
  constructor(t = D.document.createDocumentFragment()) {
    super(t);
  }
  // Import / Export raw xml
  xml(t, e, i) {
    if (typeof t == "boolean" && (i = e, e = t, t = null), t == null || typeof t == "function") {
      const s = new kt(se("wrapper", i));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, i);
    }
    return super.xml(t, !1, i);
  }
}
P(gi, "Fragment");
function mi(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ fx: new M(n), fy: new M(t) }) : this.attr({ x1: new M(n), y1: new M(t) });
}
function yi(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ cx: new M(n), cy: new M(t) }) : this.attr({ x2: new M(n), y2: new M(t) });
}
const Bo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  from: mi,
  to: yi
}, Symbol.toStringTag, { value: "Module" }));
class ue extends rt {
  constructor(t, e) {
    super(
      F(t + "Gradient", typeof t == "string" ? null : t),
      e
    );
  }
  // custom attr to handle transform
  attr(t, e, i) {
    return t === "transform" && (t = "gradientTransform"), super.attr(t, e, i);
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
T(ue, Bo);
A({
  Container: {
    // Create gradient element in defs
    gradient(...n) {
      return this.defs().gradient(...n);
    }
  },
  // define gradient
  Defs: {
    gradient: U(function(n, t) {
      return this.put(new ue(n)).update(t);
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
  attr(t, e, i) {
    return t === "transform" && (t = "patternTransform"), super.attr(t, e, i);
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
A({
  Container: {
    // Create pattern element in defs
    pattern(...n) {
      return this.defs().pattern(...n);
    }
  },
  Defs: {
    pattern: U(function(n, t, e) {
      return this.put(new oe()).update(e).attr({
        x: 0,
        y: 0,
        width: n,
        height: t,
        patternUnits: "userSpaceOnUse"
      });
    })
  }
});
P(oe, "Pattern");
let Te = class extends dt {
  constructor(t, e = t) {
    super(F("image", t), e);
  }
  // (re)load image
  load(t, e) {
    if (!t) return this;
    const i = new D.window.Image();
    return ct(
      i,
      "load",
      function(s) {
        const o = this.parent(oe);
        this.width() === 0 && this.height() === 0 && this.size(i.width, i.height), o instanceof oe && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, s);
      },
      this
    ), ct(i, "load error", function() {
      J(i);
    }), this.attr("href", i.src = t, ce);
  }
};
Ao(function(n, t, e) {
  return (n === "fill" || n === "stroke") && Vs.test(t) && (t = e.root().defs().image(t)), t instanceof Te && (t = e.root().defs().pattern(0, 0, (i) => {
    i.add(t);
  })), t;
});
A({
  Container: {
    // create image element, load image and set its size
    image: U(function(n, t) {
      return this.put(new Te()).size(0, 0).load(n, t);
    })
  }
});
P(Te, "Image");
class Tt extends Ut {
  // Get bounding box of points
  bbox() {
    let t = -1 / 0, e = -1 / 0, i = 1 / 0, s = 1 / 0;
    return this.forEach(function(o) {
      t = Math.max(o[0], t), e = Math.max(o[1], e), i = Math.min(o[0], i), s = Math.min(o[1], s);
    }), new Y(i, s, t - i, e - s);
  }
  // Move point string
  move(t, e) {
    const i = this.bbox();
    if (t -= i.x, e -= i.y, !isNaN(t) && !isNaN(e))
      for (let s = this.length - 1; s >= 0; s--)
        this[s] = [this[s][0] + t, this[s][1] + e];
    return this;
  }
  // Parse point string and flat array
  parse(t = [0, 0]) {
    const e = [];
    t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(_t).map(parseFloat), t.length % 2 !== 0 && t.pop();
    for (let i = 0, s = t.length; i < s; i = i + 2)
      e.push([t[i], t[i + 1]]);
    return e;
  }
  // Resize poly string
  size(t, e) {
    let i;
    const s = this.bbox();
    for (i = this.length - 1; i >= 0; i--)
      s.width && (this[i][0] = (this[i][0] - s.x) * t / s.width + s.x), s.height && (this[i][1] = (this[i][1] - s.y) * e / s.height + s.y);
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
    for (let e = 0, i = this.length; e < i; e++)
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
      const [i, s] = this[e];
      this[e][0] = t.a * i + t.c * s + t.e, this[e][1] = t.b * i + t.d * s + t.f;
    }
    return this;
  }
}
const Go = Tt;
function Ho(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function Uo(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function Fo(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function Zo(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
const wn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MorphArray: Go,
  height: Zo,
  width: Fo,
  x: Ho,
  y: Uo
}, Symbol.toStringTag, { value: "Module" }));
class Ft extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("line", t), e);
  }
  // Get array
  array() {
    return new Tt([
      [this.attr("x1"), this.attr("y1")],
      [this.attr("x2"), this.attr("y2")]
    ]);
  }
  // Move by left top corner
  move(t, e) {
    return this.attr(this.array().move(t, e).toLine());
  }
  // Overwrite native plot() method
  plot(t, e, i, s) {
    return t == null ? this.array() : (typeof e < "u" ? t = { x1: t, y1: e, x2: i, y2: s } : t = new Tt(t).toLine(), this.attr(t));
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Yt(this, t, e);
    return this.attr(this.array().size(i.width, i.height).toLine());
  }
}
T(Ft, wn);
A({
  Container: {
    // Create a line element
    line: U(function(...n) {
      return Ft.prototype.plot.apply(
        this.put(new Ft()),
        n[0] != null ? n : [0, 0, 0, 0]
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
A({
  Container: {
    marker(...n) {
      return this.defs().marker(...n);
    }
  },
  Defs: {
    // Create marker
    marker: U(function(n, t, e) {
      return this.put(new _e()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
    })
  },
  marker: {
    // Create and attach markers
    marker(n, t, e, i) {
      let s = ["marker"];
      return n !== "all" && s.push(n), s = s.join("-"), n = arguments[1] instanceof _e ? arguments[1] : this.defs().marker(t, e, i), this.attr(s, n);
    }
  }
});
P(_e, "Marker");
function Bt(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const Yo = {
  "-": function(n) {
    return n;
  },
  "<>": function(n) {
    return -Math.cos(n * Math.PI) / 2 + 0.5;
  },
  ">": function(n) {
    return Math.sin(n * Math.PI / 2);
  },
  "<": function(n) {
    return -Math.cos(n * Math.PI / 2) + 1;
  },
  bezier: function(n, t, e, i) {
    return function(s) {
      return s < 0 ? n > 0 ? t / n * s : e > 0 ? i / e * s : 0 : s > 1 ? e < 1 ? (1 - i) / (1 - e) * s + (i - e) / (1 - e) : n < 1 ? (1 - t) / (1 - n) * s + (t - n) / (1 - n) : 1 : 3 * s * (1 - s) ** 2 * t + 3 * s ** 2 * (1 - s) * i + s ** 3;
    };
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function(n, t = "end") {
    t = t.split("-").reverse()[0];
    let e = n;
    return t === "none" ? --e : t === "both" && ++e, (i, s = !1) => {
      let o = Math.floor(i * n);
      const r = i * o % 1 === 0;
      return (t === "start" || t === "both") && ++o, s && r && --o, i >= 0 && o < 0 && (o = 0), i <= 1 && o > e && (o = e), o / e;
    };
  }
};
class vn {
  done() {
    return !1;
  }
}
class je extends vn {
  constructor(t = ie.ease) {
    super(), this.ease = Yo[t] || t;
  }
  step(t, e, i) {
    return typeof t != "number" ? i < 1 ? t : e : t + (e - t) * this.ease(i);
  }
}
class Ce extends vn {
  constructor(t) {
    super(), this.stepper = t;
  }
  done(t) {
    return t.done;
  }
  step(t, e, i, s) {
    return this.stepper(t, e, i, s);
  }
}
function Hn() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, i = Math.PI, s = Math.log(t / 100 + e), o = -s / Math.sqrt(i * i + s * s), r = 3.9 / (o * n);
  this.d = 2 * o * r, this.k = r * r;
}
class Xo extends Ce {
  constructor(t = 500, e = 0) {
    super(), this.duration(t).overshoot(e);
  }
  step(t, e, i, s) {
    if (typeof t == "string") return t;
    if (s.done = i === 1 / 0, i === 1 / 0) return e;
    if (i === 0) return t;
    i > 100 && (i = 16), i /= 1e3;
    const o = s.velocity || 0, r = -this.d * o - this.k * (t - e), a = t + o * i + r * i * i / 2;
    return s.velocity = o + r * i, s.done = Math.abs(e - a) + Math.abs(o) < 2e-3, s.done ? e : a;
  }
}
T(Xo, {
  duration: Bt("_duration", Hn),
  overshoot: Bt("_overshoot", Hn)
});
class $o extends Ce {
  constructor(t = 0.1, e = 0.01, i = 0, s = 1e3) {
    super(), this.p(t).i(e).d(i).windup(s);
  }
  step(t, e, i, s) {
    if (typeof t == "string") return t;
    if (s.done = i === 1 / 0, i === 1 / 0) return e;
    if (i === 0) return t;
    const o = e - t;
    let r = (s.integral || 0) + o * i;
    const a = (o - (s.error || 0)) / i, l = this._windup;
    return l !== !1 && (r = Math.max(-l, Math.min(r, l))), s.error = o, s.integral = r, s.done = Math.abs(o) < 1e-3, s.done ? e : t + (this.P * o + this.I * r + this.D * a);
  }
}
T($o, {
  windup: Bt("_windup"),
  p: Bt("P"),
  i: Bt("I"),
  d: Bt("D")
});
const Wo = {
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
}, Ve = {
  M: function(n, t, e) {
    return t.x = e.x = n[0], t.y = e.y = n[1], ["M", t.x, t.y];
  },
  L: function(n, t) {
    return t.x = n[0], t.y = n[1], ["L", n[0], n[1]];
  },
  H: function(n, t) {
    return t.x = n[0], ["H", n[0]];
  },
  V: function(n, t) {
    return t.y = n[0], ["V", n[0]];
  },
  C: function(n, t) {
    return t.x = n[4], t.y = n[5], ["C", n[0], n[1], n[2], n[3], n[4], n[5]];
  },
  S: function(n, t) {
    return t.x = n[2], t.y = n[3], ["S", n[0], n[1], n[2], n[3]];
  },
  Q: function(n, t) {
    return t.x = n[2], t.y = n[3], ["Q", n[0], n[1], n[2], n[3]];
  },
  T: function(n, t) {
    return t.x = n[0], t.y = n[1], ["T", n[0], n[1]];
  },
  Z: function(n, t, e) {
    return t.x = e.x, t.y = e.y, ["Z"];
  },
  A: function(n, t) {
    return t.x = n[5], t.y = n[6], ["A", n[0], n[1], n[2], n[3], n[4], n[5], n[6]];
  }
}, Ue = "mlhvqtcsaz".split("");
for (let n = 0, t = Ue.length; n < t; ++n)
  Ve[Ue[n]] = /* @__PURE__ */ function(e) {
    return function(i, s, o) {
      if (e === "H") i[0] = i[0] + s.x;
      else if (e === "V") i[0] = i[0] + s.y;
      else if (e === "A")
        i[5] = i[5] + s.x, i[6] = i[6] + s.y;
      else
        for (let r = 0, a = i.length; r < a; ++r)
          i[r] = i[r] + (r % 2 ? s.y : s.x);
      return Ve[e](i, s, o);
    };
  }(Ue[n].toUpperCase());
function jo(n) {
  const t = n.segment[0];
  return Ve[t](n.segment.slice(1), n.p, n.p0);
}
function qe(n) {
  return n.segment.length && n.segment.length - 1 === Wo[n.segment[0].toUpperCase()];
}
function Vo(n, t) {
  n.inNumber && At(n, !1);
  const e = pn.test(t);
  if (e)
    n.segment = [t];
  else {
    const i = n.lastCommand, s = i.toLowerCase(), o = i === s;
    n.segment = [s === "m" ? o ? "l" : "L" : i];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function At(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, qe(n) && Ke(n);
}
function Ke(n) {
  n.inSegment = !1, n.absolute && (n.segment = jo(n)), n.segments.push(n.segment);
}
function qo(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function Ko(n) {
  return n.lastToken.toUpperCase() === "E";
}
const Qo = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
function Jo(n, t = !0) {
  let e = 0, i = "";
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
  for (; s.lastToken = i, i = n.charAt(e++); )
    if (!(!s.inSegment && Vo(s, i))) {
      if (i === ".") {
        if (s.pointSeen || s.hasExponent) {
          At(s, !1), --e;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += i;
        continue;
      }
      if (!isNaN(parseInt(i))) {
        if (s.number === "0" || qo(s)) {
          s.inNumber = !0, s.number = i, At(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += i;
        continue;
      }
      if (Qo.has(i)) {
        s.inNumber && At(s, !1);
        continue;
      }
      if (i === "-" || i === "+") {
        if (s.inNumber && !Ko(s)) {
          At(s, !1), --e;
          continue;
        }
        s.number += i, s.inNumber = !0;
        continue;
      }
      if (i.toUpperCase() === "E") {
        s.number += i, s.hasExponent = !0;
        continue;
      }
      if (pn.test(i)) {
        if (s.inNumber)
          At(s, !1);
        else if (qe(s))
          Ke(s);
        else
          throw new Error("parser Error");
        --e;
      }
    }
  return s.inNumber && At(s, !1), s.inSegment && qe(s) && Ke(s), s.segments;
}
function tr(n) {
  let t = "";
  for (let e = 0, i = n.length; e < i; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
class Pt extends Ut {
  // Get bounding box of path
  bbox() {
    return St().path.setAttribute("d", this.toString()), new Y(St.nodes.path.getBBox());
  }
  // Move path string
  move(t, e) {
    const i = this.bbox();
    if (t -= i.x, e -= i.y, !isNaN(t) && !isNaN(e))
      for (let s, o = this.length - 1; o >= 0; o--)
        s = this[o][0], s === "M" || s === "L" || s === "T" ? (this[o][1] += t, this[o][2] += e) : s === "H" ? this[o][1] += t : s === "V" ? this[o][1] += e : s === "C" || s === "S" || s === "Q" ? (this[o][1] += t, this[o][2] += e, this[o][3] += t, this[o][4] += e, s === "C" && (this[o][5] += t, this[o][6] += e)) : s === "A" && (this[o][6] += t, this[o][7] += e);
    return this;
  }
  // Absolutize and parse path to array
  parse(t = "M0 0") {
    return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), Jo(t);
  }
  // Resize path string
  size(t, e) {
    const i = this.bbox();
    let s, o;
    for (i.width = i.width === 0 ? 1 : i.width, i.height = i.height === 0 ? 1 : i.height, s = this.length - 1; s >= 0; s--)
      o = this[s][0], o === "M" || o === "L" || o === "T" ? (this[s][1] = (this[s][1] - i.x) * t / i.width + i.x, this[s][2] = (this[s][2] - i.y) * e / i.height + i.y) : o === "H" ? this[s][1] = (this[s][1] - i.x) * t / i.width + i.x : o === "V" ? this[s][1] = (this[s][1] - i.y) * e / i.height + i.y : o === "C" || o === "S" || o === "Q" ? (this[s][1] = (this[s][1] - i.x) * t / i.width + i.x, this[s][2] = (this[s][2] - i.y) * e / i.height + i.y, this[s][3] = (this[s][3] - i.x) * t / i.width + i.x, this[s][4] = (this[s][4] - i.y) * e / i.height + i.y, o === "C" && (this[s][5] = (this[s][5] - i.x) * t / i.width + i.x, this[s][6] = (this[s][6] - i.y) * e / i.height + i.y)) : o === "A" && (this[s][1] = this[s][1] * t / i.width, this[s][2] = this[s][2] * e / i.height, this[s][6] = (this[s][6] - i.x) * t / i.width + i.x, this[s][7] = (this[s][7] - i.y) * e / i.height + i.y);
    return this;
  }
  // Convert array to string
  toString() {
    return tr(this);
  }
}
const bi = (n) => {
  const t = typeof n;
  return t === "number" ? M : t === "string" ? L.isColor(n) ? L : _t.test(n) ? pn.test(n) ? Pt : Ut : ii.test(n) ? M : Qe : xn.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? Ut : t === "object" ? re : Qe;
};
class Rt {
  constructor(t) {
    this._stepper = t || new je("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    return this._context.map(this._stepper.done).reduce(function(e, i) {
      return e && i;
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
    this._type || this.type(bi(t));
    let e = new this._type(t);
    return this._type === L && (e = this._to ? e[this._to[4]]() : this._from ? e[this._from[4]]() : e), this._type === re && (e = this._to ? e.align(this._to) : this._from ? e.align(this._from) : e), e = e.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(e.length)).map(Object).map(function(i) {
      return i.done = !0, i;
    }), e;
  }
}
class Qe {
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
const er = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
class re {
  constructor(...t) {
    this.init(...t);
  }
  align(t) {
    const e = this.values;
    for (let i = 0, s = e.length; i < s; ++i) {
      if (e[i + 1] === t[i + 1]) {
        if (e[i + 1] === L && t[i + 7] !== e[i + 7]) {
          const a = t[i + 7], l = new L(this.values.splice(i + 3, 5))[a]().toArray();
          this.values.splice(i + 3, 0, ...l);
        }
        i += e[i + 2] + 2;
        continue;
      }
      if (!t[i + 1])
        return this;
      const o = new t[i + 1]().toArray(), r = e[i + 2] + 3;
      e.splice(
        i,
        r,
        t[i],
        t[i + 1],
        t[i + 2],
        ...o
      ), i += e[i + 2] + 2;
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
    for (const i in t) {
      const s = bi(t[i]), o = new s(t[i]).toArray();
      e.push([i, s, o.length, ...o]);
    }
    return e.sort(er), this.values = e.reduce((i, s) => i.concat(s), []), this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const t = {}, e = this.values;
    for (; e.length; ) {
      const i = e.shift(), s = e.shift(), o = e.shift(), r = e.splice(0, o);
      t[i] = new s(r);
    }
    return t;
  }
}
const xn = [Qe, fe, re];
function nr(n = []) {
  xn.push(...[].concat(n));
}
function ir() {
  T(xn, {
    to(n) {
      return new Rt().type(this.constructor).from(this.toArray()).to(n);
    },
    fromArray(n) {
      return this.init(n), this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(n, t, e, i, s) {
      const o = function(r, a) {
        return i.step(r, t[a], e, s[a], s);
      };
      return this.fromArray(n.map(o));
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
    return this._array || (this._array = new Pt(this.attr("d")));
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
      typeof t == "string" ? t : this._array = new Pt(t)
    );
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Yt(this, t, e);
    return this.attr("d", this.array().size(i.width, i.height));
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
$t.prototype.MorphArray = Pt;
A({
  Container: {
    // Create a wrapped path element
    path: U(function(n) {
      return this.put(new $t()).plot(n || new Pt());
    })
  }
});
P($t, "Path");
function sr() {
  return this._array || (this._array = new Tt(this.attr("points")));
}
function or() {
  return delete this._array, this;
}
function rr(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function ar(n) {
  return n == null ? this.array() : this.clear().attr(
    "points",
    typeof n == "string" ? n : this._array = new Tt(n)
  );
}
function lr(n, t) {
  const e = Yt(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
const wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array: sr,
  clear: or,
  move: rr,
  plot: ar,
  size: lr
}, Symbol.toStringTag, { value: "Module" }));
class Wt extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("polygon", t), e);
  }
}
A({
  Container: {
    // Create a wrapped polygon element
    polygon: U(function(n) {
      return this.put(new Wt()).plot(n || new Tt());
    })
  }
});
T(Wt, wn);
T(Wt, wi);
P(Wt, "Polygon");
class jt extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("polyline", t), e);
  }
}
A({
  Container: {
    // Create a wrapped polygon element
    polyline: U(function(n) {
      return this.put(new jt()).plot(n || new Tt());
    })
  }
});
T(jt, wn);
T(jt, wi);
P(jt, "Polyline");
class pe extends dt {
  // Initialize node
  constructor(t, e = t) {
    super(F("rect", t), e);
  }
}
T(pe, { rx: yn, ry: bn });
A({
  Container: {
    // Create a rect element
    rect: U(function(n, t) {
      return this.put(new pe()).size(n, t);
    })
  }
});
P(pe, "Rect");
class Fe {
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
  frames: new Fe(),
  timeouts: new Fe(),
  immediates: new Fe(),
  timer: () => D.window.performance || D.window.Date,
  transforms: [],
  frame(n) {
    const t = z.frames.push({ run: n });
    return z.nextDraw === null && (z.nextDraw = D.window.requestAnimationFrame(z._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = z.timer().now() + t, i = z.timeouts.push({ run: n, time: e });
    return z.nextDraw === null && (z.nextDraw = D.window.requestAnimationFrame(z._draw)), i;
  },
  immediate(n) {
    const t = z.immediates.push(n);
    return z.nextDraw === null && (z.nextDraw = D.window.requestAnimationFrame(z._draw)), t;
  },
  cancelFrame(n) {
    n != null && z.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && z.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && z.immediates.remove(n);
  },
  _draw(n) {
    let t = null;
    const e = z.timeouts.last();
    for (; (t = z.timeouts.shift()) && (n >= t.time ? t.run() : z.timeouts.push(t), t !== e); )
      ;
    let i = null;
    const s = z.frames.last();
    for (; i !== s && (i = z.frames.shift()); )
      i.run(n);
    let o = null;
    for (; o = z.immediates.shift(); )
      o();
    z.nextDraw = z.timeouts.first() || z.frames.first() ? D.window.requestAnimationFrame(z._draw) : null;
  }
}, cr = function(n) {
  const t = n.start, e = n.runner.duration(), i = t + e;
  return {
    start: t,
    duration: e,
    end: i,
    runner: n.runner
  };
}, hr = function() {
  const n = D.window;
  return (n.performance || n.Date).now();
};
class vi extends he {
  // Construct a new timeline on the given element
  constructor(t = hr) {
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
    const i = Math.abs(e);
    return this.speed(t ? -i : i);
  }
  // schedules a runner on the timeline
  schedule(t, e, i) {
    if (t == null)
      return this._runners.map(cr);
    let s = 0;
    const o = this.getEndTime();
    if (e = e || 0, i == null || i === "last" || i === "after")
      s = o;
    else if (i === "absolute" || i === "start")
      s = e, e = 0;
    else if (i === "now")
      s = this._time;
    else if (i === "relative") {
      const l = this.getRunnerInfoById(t.id);
      l && (s = l.start + e, e = 0);
    } else if (i === "with-last") {
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
    let i = e - this._lastSourceTime;
    t && (i = 0);
    const s = this._speed * i + (this._time - this._lastStepTime);
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
A({
  Element: {
    timeline: function(n) {
      return n == null ? (this._timeline = this._timeline || new vi(), this._timeline) : (this._timeline = n, this);
    }
  }
});
class ht extends he {
  constructor(t) {
    super(), this.id = ht.id++, t = t ?? ie.duration, t = typeof t == "function" ? new Ce(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof Ce, this._stepper = this._isDeclarative ? t : new je(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new N(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, i) {
    let s = 1, o = !1, r = 0;
    return t = t ?? ie.duration, e = e ?? ie.delay, i = i || "last", typeof t == "object" && !(t instanceof vn) && (e = t.delay ?? e, i = t.when ?? i, o = t.swing || o, s = t.times ?? s, r = t.wait ?? r, t = t.duration ?? ie.duration), {
      duration: t,
      delay: e,
      swing: o,
      times: s,
      wait: r,
      when: i
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
  animate(t, e, i) {
    const s = ht.sanitise(t, e, i), o = new ht(s.duration);
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
    return this._stepper = new je(t), this;
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
  loop(t, e, i) {
    return typeof t == "object" && (e = t.swing, i = t.wait, t = t.times), this._times = t || 1 / 0, this._swing = e || !1, this._wait = i || 0, this._times === !0 && (this._times = 1 / 0), this;
  }
  loops(t) {
    const e = this._duration + this._wait;
    if (t == null) {
      const r = Math.floor(this._time / e), l = (this._time - r * e) / this._duration;
      return Math.min(r + l, this._times);
    }
    const i = Math.floor(t), s = t % 1, o = e * i + this._duration * s;
    return this.time(o);
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  position(t) {
    const e = this._time, i = this._duration, s = this._wait, o = this._times, r = this._swing, a = this._reverse;
    let l;
    if (t == null) {
      const u = function(g) {
        const p = r * Math.floor(g % (2 * (s + i)) / (s + i)), y = p && !a || !p && a, m = Math.pow(-1, y) * (g % (s + i)) / i + y;
        return Math.max(Math.min(m, 1), 0);
      }, f = o * (s + i) - s;
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
  queue(t, e, i, s) {
    return this._queue.push({
      initialiser: t || Gn,
      runner: e || Gn,
      retarget: i,
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
  schedule(t, e, i) {
    if (t instanceof vi || (i = e, e = t, t = this.timeline()), !t)
      throw Error("Runner cannot be scheduled without timeline");
    return t.schedule(this, e, i), this;
  }
  step(t) {
    if (!this.enabled) return this;
    t = t ?? 16, this._time += t;
    const e = this.position(), i = this._lastPosition !== e && this._time >= 0;
    this._lastPosition = e;
    const s = this.duration(), o = this._lastTime <= 0 && this._time > 0, r = this._lastTime < s && this._time >= s;
    this._lastTime = this._time, o && this.fire("start", this);
    const a = this._isDeclarative;
    this.done = !a && !r && this._time >= s, this._reseted = !1;
    let l = !1;
    return (i || a) && (this._initialise(i), this.transforms = new N(), l = this._run(a ? t : e), this.fire("step", this)), this.done = this.done || l && a, r && this.fire("finished", this), this;
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
      for (let e = 0, i = this._queue.length; e < i; ++e) {
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
      const i = this.timeline();
      i && i.play();
    }
  }
  // Try to set the target for a morpher if the morpher exists, otherwise
  // Run each run function for the position or dt given
  _run(t) {
    let e = !0;
    for (let i = 0, s = this._queue.length; i < s; ++i) {
      const o = this._queue[i], r = o.runner.call(this, t);
      o.finished = o.finished || r === !0, e = e && o.finished;
    }
    return e;
  }
  // do nothing and return false
  _tryRetarget(t, e, i) {
    if (this._history[t]) {
      if (!this._history[t].caller.initialised) {
        const o = this._queue.indexOf(this._history[t].caller);
        return this._queue.splice(o, 1), !1;
      }
      this._history[t].caller.retarget ? this._history[t].caller.retarget.call(this, e, i) : this._history[t].morpher.to(e), this._history[t].caller.finished = !1;
      const s = this.timeline();
      return s && s.play(), !0;
    }
    return !1;
  }
}
ht.id = 0;
class Ee {
  constructor(t = new N(), e = -1, i = !0) {
    this.transforms = t, this.id = e, this.done = i;
  }
  clearTransformsFromQueue() {
  }
}
T([ht, Ee], {
  mergeWith(n) {
    return new Ee(
      n.transforms.lmultiply(this.transforms),
      n.id
    );
  }
});
const xi = (n, t) => n.lmultiplyO(t), _i = (n) => n.transforms;
function dr() {
  const t = this._transformationRunners.runners.map(_i).reduce(xi, new N());
  this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
class ur {
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
    return this.ids.splice(0, e, 0), this.runners.splice(0, e, new Ee()).forEach((i) => i.clearTransformsFromQueue()), this;
  }
  edit(t, e) {
    const i = this.ids.indexOf(t + 1);
    return this.ids.splice(i, 1, t + 1), this.runners.splice(i, 1, e), this;
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
      const i = this.runners[e];
      if (t && i.done && t.done && // don't merge runner when persisted on timeline
      (!i._timeline || !i._timeline._runnerIds.includes(i.id)) && (!t._timeline || !t._timeline._runnerIds.includes(t.id))) {
        this.remove(i.id);
        const o = i.mergeWith(t);
        this.edit(t.id, o), t = o, --e;
      } else
        t = i;
    }
    return this;
  }
  remove(t) {
    const e = this.ids.indexOf(t + 1);
    return this.ids.splice(e, 1), this.runners.splice(e, 1), this;
  }
}
A({
  Element: {
    animate(n, t, e) {
      const i = ht.sanitise(n, t, e), s = this.timeline();
      return new ht(i.duration).loop(i).element(this).timeline(s.play()).schedule(i.delay, i.when);
    },
    delay(n, t) {
      return this.animate(0, n, t);
    },
    // this function searches for all runners on the element and deletes the ones
    // which run before the current one. This is because absolute transformations
    // overwrite anything anyway so there is no need to waste time computing
    // other runners
    _clearTransformRunnersBefore(n) {
      this._transformationRunners.clearBefore(n.id);
    },
    _currentTransform(n) {
      return this._transformationRunners.runners.filter((t) => t.id <= n.id).map(_i).reduce(xi, new N());
    },
    _addRunner(n) {
      this._transformationRunners.add(n), z.cancelImmediate(this._frameId), this._frameId = z.immediate(dr.bind(this));
    },
    _prepareRunner() {
      this._frameId == null && (this._transformationRunners = new ur().add(
        new Ee(new N(this))
      ));
    }
  }
});
const fr = (n, t) => n.filter((e) => !t.includes(e));
T(ht, {
  attr(n, t) {
    return this.styleAttr("attr", n, t);
  },
  // Add animatable styles
  css(n, t) {
    return this.styleAttr("css", n, t);
  },
  styleAttr(n, t, e) {
    if (typeof t == "string")
      return this.styleAttr(n, { [t]: e });
    let i = t;
    if (this._tryRetarget(n, i)) return this;
    let s = new Rt(this._stepper).to(i), o = Object.keys(i);
    return this.queue(
      function() {
        s = s.from(this.element()[n](o));
      },
      function(r) {
        return this.element()[n](s.at(r).valueOf()), s.done();
      },
      function(r) {
        const a = Object.keys(r), l = fr(a, o);
        if (l.length) {
          const h = this.element()[n](l), d = new re(s.from()).valueOf();
          Object.assign(d, h), s.from(d);
        }
        const c = new re(s.to()).valueOf();
        Object.assign(c, r), s.to(c), o = a, i = r;
      }
    ), this._rememberMorpher(n, s), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new Rt(this._stepper).to(new M(n));
    return this.queue(
      function() {
        e = e.from(this.element().zoom());
      },
      function(i) {
        return this.element().zoom(e.at(i), t), e.done();
      },
      function(i, s) {
        t = s, e.to(i);
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
  transform(n, t, e) {
    if (t = n.relative || t, this._isDeclarative && !t && this._tryRetarget("transform", n))
      return this;
    const i = N.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !i;
    const s = new Rt(this._stepper).type(
      e ? fe : N
    );
    let o, r, a, l, c;
    function h() {
      r = r || this.element(), o = o || $e(n, r), c = new N(t ? void 0 : r), r._addRunner(this), t || r._clearTransformRunnersBefore(this);
    }
    function d(f) {
      t || this.clearTransform();
      const { x: g, y: p } = new X(o).transform(
        r._currentTransform(this)
      );
      let y = new N({ ...n, origin: [g, p] }), m = this._isDeclarative && a ? a : c;
      if (e) {
        y = y.decompose(g, p), m = m.decompose(g, p);
        const w = y.rotate, v = m.rotate, _ = [w - 360, w, w + 360], x = _.map((B) => Math.abs(B - v)), C = Math.min(...x), R = x.indexOf(C);
        y.rotate = _[R];
      }
      t && (i || (y.rotate = n.rotate || 0), this._isDeclarative && l && (m.rotate = l)), s.from(m), s.to(y);
      const b = s.at(f);
      return l = b.rotate, a = new N(b), this.addTransform(a), r._addRunner(this), s.done();
    }
    function u(f) {
      (f.origin || "center").toString() !== (n.origin || "center").toString() && (o = $e(f, r)), n = { ...f, origin: o };
    }
    return this.queue(h, d, u, !0), this._isDeclarative && this._rememberMorpher("transform", s), this;
  },
  // Animatable x-axis
  x(n) {
    return this._queueNumber("x", n);
  },
  // Animatable y-axis
  y(n) {
    return this._queueNumber("y", n);
  },
  ax(n) {
    return this._queueNumber("ax", n);
  },
  ay(n) {
    return this._queueNumber("ay", n);
  },
  dx(n = 0) {
    return this._queueNumberDelta("x", n);
  },
  dy(n = 0) {
    return this._queueNumberDelta("y", n);
  },
  dmove(n, t) {
    return this.dx(n).dy(t);
  },
  _queueNumberDelta(n, t) {
    if (t = new M(t), this._tryRetarget(n, t)) return this;
    const e = new Rt(this._stepper).to(t);
    let i = null;
    return this.queue(
      function() {
        i = this.element()[n](), e.from(i), e.to(i + t);
      },
      function(s) {
        return this.element()[n](e.at(s)), e.done();
      },
      function(s) {
        e.to(i + new M(s));
      }
    ), this._rememberMorpher(n, e), this;
  },
  _queueObject(n, t) {
    if (this._tryRetarget(n, t)) return this;
    const e = new Rt(this._stepper).to(t);
    return this.queue(
      function() {
        e.from(this.element()[n]());
      },
      function(i) {
        return this.element()[n](e.at(i)), e.done();
      }
    ), this._rememberMorpher(n, e), this;
  },
  _queueNumber(n, t) {
    return this._queueObject(n, new M(t));
  },
  // Animatable center x-axis
  cx(n) {
    return this._queueNumber("cx", n);
  },
  // Animatable center y-axis
  cy(n) {
    return this._queueNumber("cy", n);
  },
  // Add animatable move
  move(n, t) {
    return this.x(n).y(t);
  },
  amove(n, t) {
    return this.ax(n).ay(t);
  },
  // Add animatable center
  center(n, t) {
    return this.cx(n).cy(t);
  },
  // Add animatable size
  size(n, t) {
    let e;
    return (!n || !t) && (e = this._element.bbox()), n || (n = e.width / e.height * t), t || (t = e.height / e.width * n), this.width(n).height(t);
  },
  // Add animatable width
  width(n) {
    return this._queueNumber("width", n);
  },
  // Add animatable height
  height(n) {
    return this._queueNumber("height", n);
  },
  // Add animatable plot
  plot(n, t, e, i) {
    if (arguments.length === 4)
      return this.plot([n, t, e, i]);
    if (this._tryRetarget("plot", n)) return this;
    const s = new Rt(this._stepper).type(this._element.MorphArray).to(n);
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
  leading(n) {
    return this._queueNumber("leading", n);
  },
  // Add animatable viewbox
  viewbox(n, t, e, i) {
    return this._queueObject("viewbox", new Y(n, t, e, i));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
T(ht, { rx: yn, ry: bn, from: mi, to: yi });
P(ht, "Runner");
class Ae extends rt {
  constructor(t, e = t) {
    super(F("svg", t), e), this.namespace();
  }
  // Creates and returns defs element
  defs() {
    return this.isRoot() ? pt(this.node.querySelector("defs")) || this.put(new mn()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof D.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  // Add namespaces
  namespace() {
    return this.isRoot() ? this.attr({ xmlns: hn, version: "1.1" }).attr(
      "xmlns:xlink",
      ce,
      Be
    ) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, Be).attr("xmlns:svgjs", null, Be);
  }
  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    return this.isRoot() ? this : super.root();
  }
}
A({
  Container: {
    // Create nested svg document
    nested: U(function() {
      return this.put(new Ae());
    })
  }
});
P(Ae, "Svg", !0);
let _n = class extends rt {
  // Initialize node
  constructor(t, e = t) {
    super(F("symbol", t), e);
  }
};
A({
  Container: {
    symbol: U(function() {
      return this.put(new _n());
    })
  }
});
P(_n, "Symbol");
function pr(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(D.document.createTextNode(n)), this;
}
function gr() {
  return this.node.getComputedTextLength();
}
function mr(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function yr(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function br(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function wr(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function vr(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function xr(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function _r(n) {
  return this.attr("x", n);
}
function Cr(n) {
  return this.attr("y", n);
}
function Er(n, t) {
  return this.ax(n).ay(t);
}
function Sr(n) {
  return this._build = !!n, this;
}
const Ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amove: Er,
  ax: _r,
  ay: Cr,
  build: Sr,
  center: xr,
  cx: wr,
  cy: vr,
  length: gr,
  move: br,
  plain: pr,
  x: mr,
  y: yr
}, Symbol.toStringTag, { value: "Module" }));
class mt extends dt {
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
      let i = 0;
      const s = this.dom.leading;
      this.each(function(o) {
        if (We(this.node)) return;
        const r = D.window.getComputedStyle(this.node).getPropertyValue("font-size"), a = s * new M(r);
        this.dom.newLined && (this.attr("x", e.attr("x")), this.text() === `
` ? i += a : (this.attr("dy", o ? a + i : 0), i = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  // overwrite method from parent to set data properly
  setData(t) {
    return this.dom = t, this.dom.leading = new M(t.leading || 1.3), this;
  }
  writeDataToDom() {
    return ti(this, this.dom, { leading: 1.3 }), this;
  }
  // Set the text content
  text(t) {
    if (t === void 0) {
      const e = this.node.childNodes;
      let i = 0;
      t = "";
      for (let s = 0, o = e.length; s < o; ++s) {
        if (e[s].nodeName === "textPath" || We(e[s])) {
          s === 0 && (i = s + 1);
          continue;
        }
        s !== i && e[s].nodeType !== 3 && pt(e[s]).dom.newLined === !0 && (t += `
`), t += e[s].textContent;
      }
      return t;
    }
    if (this.clear().build(!0), typeof t == "function")
      t.call(this, this);
    else {
      t = (t + "").split(`
`);
      for (let e = 0, i = t.length; e < i; e++)
        this.newLine(t[e]);
    }
    return this.build(!1).rebuild();
  }
}
T(mt, Ci);
A({
  Container: {
    // Create text element
    text: U(function(n = "") {
      return this.put(new mt()).text(n);
    }),
    // Create plain text element
    plain: U(function(n = "") {
      return this.put(new mt()).plain(n);
    })
  }
});
P(mt, "Text");
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
    if (!(t instanceof mt))
      return this;
    const e = t.index(this), i = D.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = t.dom.leading * new M(i);
    return this.dy(e ? s : 0).attr("x", t.x());
  }
  // Set text content
  text(t) {
    return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
  }
}
T(Re, Ci);
A({
  Tspan: {
    tspan: U(function(n = "") {
      const t = new Re();
      return this._build || this.clear(), this.put(t).text(n);
    })
  },
  Text: {
    newLine: function(n = "") {
      return this.tspan(n).newLine();
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
T(Ne, { x: ci, y: hi, cx: di, cy: ui, width: fi, height: pi });
A({
  Container: {
    // Create circle element
    circle: U(function(n = 0) {
      return this.put(new Ne()).size(n).move(0, 0);
    })
  }
});
P(Ne, "Circle");
class Je extends rt {
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
A({
  Container: {
    // Create clipping element
    clip: U(function() {
      return this.defs().put(new Je());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof Je ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    // Unclip element
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
P(Je, "ClipPath");
class Ei extends ot {
  constructor(t, e = t) {
    super(F("foreignObject", t), e);
  }
}
A({
  Container: {
    foreignObject: U(function(n, t) {
      return this.put(new Ei()).size(n, t);
    })
  }
});
P(Ei, "ForeignObject");
function Mr(n, t) {
  return this.children().forEach((e) => {
    let i;
    try {
      i = e.node instanceof dn().SVGSVGElement ? new Y(e.attr(["x", "y", "width", "height"])) : e.bbox();
    } catch {
      return;
    }
    const s = new N(e), o = s.translate(n, t).transform(s.inverse()), r = new X(i.x, i.y).transform(o);
    e.move(r.x, r.y);
  }), this;
}
function kr(n) {
  return this.dmove(n, 0);
}
function Tr(n) {
  return this.dmove(0, n);
}
function Ar(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function Rr(n = 0, t = 0, e = this.bbox()) {
  const i = n - e.x, s = t - e.y;
  return this.dmove(i, s);
}
function Nr(n, t, e = this.bbox()) {
  const i = Yt(this, n, t, e), s = i.width / e.width, o = i.height / e.height;
  return this.children().forEach((r) => {
    const a = new X(e).transform(new N(r).inverse());
    r.scale(s, o, a.x, a.y);
  }), this;
}
function Dr(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function Pr(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function Ir(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
const Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dmove: Mr,
  dx: kr,
  dy: Tr,
  height: Ar,
  move: Rr,
  size: Nr,
  width: Dr,
  x: Pr,
  y: Ir
}, Symbol.toStringTag, { value: "Module" }));
class Vt extends rt {
  constructor(t, e = t) {
    super(F("g", t), e);
  }
}
T(Vt, Si);
A({
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
T(Se, Si);
A({
  Container: {
    // Create a hyperlink element
    link: U(function(n) {
      return this.put(new Se()).to(n);
    })
  },
  Element: {
    unlink() {
      const n = this.linker();
      if (!n) return this;
      const t = n.parent();
      if (!t)
        return this.remove();
      const e = t.index(n);
      return t.add(this, e), n.remove(), this;
    },
    linkTo(n) {
      let t = this.linker();
      return t || (t = new Se(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
P(Se, "A");
class tn extends rt {
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
A({
  Container: {
    mask: U(function() {
      return this.defs().put(new tn());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof tn ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    // Unmask element
    unmask() {
      return this.attr("mask", null);
    }
  }
});
P(tn, "Mask");
class Mi extends ot {
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
A({
  Gradient: {
    // Add a color stop
    stop: function(n, t, e) {
      return this.put(new Mi()).update(n, t, e);
    }
  }
});
P(Mi, "Stop");
function Or(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const i in t)
    e += ks(i) + ":" + t[i] + ";";
  return e += "}", e;
}
class en extends ot {
  constructor(t, e = t) {
    super(F("style", t), e);
  }
  addText(t = "") {
    return this.node.textContent += t, this;
  }
  font(t, e, i = {}) {
    return this.rule("@font-face", {
      fontFamily: t,
      src: e,
      ...i
    });
  }
  rule(t, e) {
    return this.addText(Or(t, e));
  }
}
A("Dom", {
  style(n, t) {
    return this.put(new en()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new en()).font(n, t, e);
  }
});
P(en, "Style");
class Cn extends mt {
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
    let i = null;
    return e && (i = e.plot(t)), t == null ? i : this;
  }
  // Get the path element
  track() {
    return this.reference("href");
  }
}
A({
  Container: {
    textPath: U(function(n, t) {
      return n instanceof mt || (n = this.text(n)), n.path(t);
    })
  },
  Text: {
    // Create path for text to run on
    path: U(function(n, t = !0) {
      const e = new Cn();
      n instanceof $t || (n = this.defs().path(n)), e.attr("href", "#" + n, ce);
      let i;
      if (t)
        for (; i = this.node.firstChild; )
          e.node.appendChild(i);
      return this.put(e);
    }),
    // Get the textPath children
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    // creates a textPath from this path
    text: U(function(n) {
      return n instanceof mt || (n = new mt().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Xt("svg textPath").filter((n) => (n.attr("href") || "").includes(this.id()));
    }
  }
});
Cn.prototype.MorphArray = Pt;
P(Cn, "TextPath");
class ki extends dt {
  constructor(t, e = t) {
    super(F("use", t), e);
  }
  // Use element as a reference
  use(t, e) {
    return this.attr("href", (e || "") + "#" + t, ce);
  }
}
A({
  Container: {
    // Create a use element
    use: U(function(n, t) {
      return this.put(new ki()).use(n, t);
    })
  }
});
P(ki, "Use");
const De = it;
T([Ae, _n, Te, oe, _e], st("viewbox"));
T([Ft, jt, Wt, $t], st("marker"));
T(mt, st("Text"));
T($t, st("Path"));
T(mn, st("Defs"));
T([mt, Re], st("Tspan"));
T([pe, de, ue, ht], st("radius"));
T(he, st("EventTarget"));
T(kt, st("Dom"));
T(ot, st("Element"));
T(dt, st("Shape"));
T([rt, gi], st("Container"));
T(ue, st("Gradient"));
T(ht, st("Runner"));
Dt.extend(Ss());
nr([
  M,
  L,
  Y,
  N,
  Ut,
  Tt,
  Pt,
  X
]);
ir();
const Un = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY });
class zr {
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
    t.preventDefault(), t.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Un(t));
    const i = (e ? "mousemove" : "touchmove") + ".drag", s = (e ? "mouseup" : "touchend") + ".drag";
    ct(window, i, this.drag, this, { passive: !1 }), ct(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: t, handler: this, box: this.box });
  }
  // While dragging
  drag(t) {
    const { box: e, lastClick: i } = this, s = this.el.point(Un(t)), o = s.x - i.x, r = s.y - i.y;
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
T(ot, {
  draggable(n = !0) {
    return (this.remember("_draggable") || new zr(this)).init(n), this;
  }
});
var te = function(t) {
  return t.touches || [{
    clientX: t.clientX,
    clientY: t.clientY
  }];
};
T(Ae, {
  panZoom: function(t) {
    var e, i, s, o, r, a, l, c, h, d, u, f, g = this;
    if (this.off(".panZoom"), t === !1) return this;
    t = (e = t) != null ? e : {};
    var p = (i = t.zoomFactor) != null ? i : 2, y = (s = t.zoomMin) != null ? s : Number.MIN_VALUE, m = (o = t.zoomMax) != null ? o : Number.MAX_VALUE, b = (r = t.wheelZoom) != null ? r : !0, w = (a = t.pinchZoom) != null ? a : !0, v = (l = t.panning) != null ? l : !0, _ = (c = t.panButton) != null ? c : 0, x = (h = t.oneFingerPan) != null ? h : !1, C = (d = t.margins) != null ? d : !1, R = (u = t.wheelZoomDeltaModeLinePixels) != null ? u : 17, B = (f = t.wheelZoomDeltaModeScreenPixels) != null ? f : 53, I, k, Z = !1, H = this.viewbox(), q = function(E) {
      if (!C) return E;
      var O = C.top, j = C.left, ut = C.bottom, ft = C.right, nt = g.attr(["width", "height"]), lt = nt.width, Ot = nt.height, S = g.node.preserveAspectRatio.baseVal, vt = 0, xt = 0, Kt = 0, Qt = 0;
      if (S.align !== S.SVG_PRESERVEASPECTRATIO_NONE) {
        var ge = lt / Ot, me = H.width / H.height;
        if (me !== ge) {
          var Dn = S.meetOrSlice !== S.SVG_MEETORSLICE_SLICE, ze = ge > me ? "width" : "height", Pn = ze === "width", In = Dn && Pn || !Dn && !Pn, vs = In ? ge / me : me / ge, Ct = E[ze] - E[ze] * vs;
          In ? S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (vt = Ct / 2, xt = -Ct / 2) : S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMAX ? xt = -Ct : (S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (vt = Ct) : S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMID || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (Kt = Ct / 2, Qt = -Ct / 2) : S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMIN || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? Qt = -Ct : (S.align === S.SVG_PRESERVEASPECTRATIO_XMINYMAX || S.align === S.SVG_PRESERVEASPECTRATIO_XMIDYMAX || S.align === S.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (Kt = Ct);
        }
      }
      var xs = H.width + H.x - j - vt, _s = H.x + ft - E.width - xt, Cs = H.height + H.y - O - Kt, Es = H.y + ut - E.height - Qt;
      return E.x = Math.min(xs, Math.max(_s, E.x)), E.y = Math.min(Cs, Math.max(Es, E.y)), E;
    }, G = function(E) {
      E.preventDefault();
      var O;
      switch (E.deltaMode) {
        case 1:
          O = E.deltaY * R;
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
      if (k = te(E), k.length < 2) {
        v && x && at.call(this, E);
        return;
      }
      v && x && bt.call(this, E), E.preventDefault(), !this.dispatch("pinchZoomStart", {
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
      }), J(document, "touchmove.panZoom", tt), J(document, "touchend.panZoom", et), this.on("touchstart.panZoom", W), O.length && v && x && at.call(this, E));
    }, tt = function(E) {
      E.preventDefault();
      var O = te(E), j = this.zoom(), ut = Math.sqrt(Math.pow(k[0].clientX - k[1].clientX, 2) + Math.pow(k[0].clientY - k[1].clientY, 2)), ft = Math.sqrt(Math.pow(O[0].clientX - O[1].clientX, 2) + Math.pow(O[0].clientY - O[1].clientY, 2)), nt = ut / ft;
      (j < y && nt > 1 || j > m && nt < 1) && (nt = 1);
      var lt = {
        x: O[0].clientX + 0.5 * (O[1].clientX - O[0].clientX),
        y: O[0].clientY + 0.5 * (O[1].clientY - O[0].clientY)
      }, Ot = {
        x: k[0].clientX + 0.5 * (k[1].clientX - k[0].clientX),
        y: k[0].clientY + 0.5 * (k[1].clientY - k[0].clientY)
      }, S = this.point(lt.x, lt.y), vt = this.point(2 * lt.x - Ot.x, 2 * lt.y - Ot.y), xt = new Y(this.viewbox()).transform(new N().translate(-vt.x, -vt.y).scale(nt, 0, 0).translate(S.x, S.y));
      q(xt), this.viewbox(xt), k = O, this.dispatch("zoom", {
        box: xt,
        focus: vt
      });
    }, at = function et(E) {
      var O = E.type.indexOf("mouse") > -1;
      O && E.button !== _ && E.which !== _ + 1 || (E.preventDefault(), this.off("mousedown.panZoom", et), k = te(E), !Z && (this.dispatch("panStart", {
        event: E
      }), I = {
        x: k[0].clientX,
        y: k[0].clientY
      }, ct(document, "touchmove.panZoom mousemove.panZoom", It, this, {
        passive: !1
      }), ct(document, "touchend.panZoom mouseup.panZoom", bt, this, {
        passive: !1
      })));
    }, bt = function et(E) {
      E.preventDefault(), J(document, "touchmove.panZoom mousemove.panZoom", It), J(document, "touchend.panZoom mouseup.panZoom", et), this.on("mousedown.panZoom", at), this.dispatch("panEnd", {
        event: E
      });
    }, It = function(E) {
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
    }), v && this.on("mousedown.panZoom", at, this, {
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
function nn(n, t, e, i = null) {
  return function(s) {
    s.preventDefault(), s.stopPropagation();
    var o = s.pageX || s.touches[0].pageX, r = s.pageY || s.touches[0].pageY;
    t.fire(n, { x: o, y: r, event: s, index: i, points: e });
  };
}
function sn([n, t], { a: e, b: i, c: s, d: o, e: r, f: a }) {
  return [n * e + t * s + r, n * i + t * o + a];
}
class Ti {
  constructor(t) {
    this.el = t, t.remember("_selectHandler", this), this.selection = new Vt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = dn();
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
    this.handlePoints.forEach((t, e, i) => {
      const s = this.order[e];
      this.createHandle.call(this, this.selection, t, e, i, s), this.selection.get(e + 1).addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection touchstart.selection", nn(s, this.el, this.handlePoints, e));
    });
  }
  createHandleFn(t) {
    t.polyline();
  }
  updateHandleFn(t, e, i, s) {
    const o = s.at(i - 1), r = s[(i + 1) % s.length], a = e, l = [a[0] - o[0], a[1] - o[1]], c = [a[0] - r[0], a[1] - r[1]], h = Math.sqrt(l[0] * l[0] + l[1] * l[1]), d = Math.sqrt(c[0] * c[0] + c[1] * c[1]), u = [l[0] / h, l[1] / h], f = [c[0] / d, c[1] / d], g = [a[0] - u[0] * 10, a[1] - u[1] * 10], p = [a[0] - f[0] * 10, a[1] - f[1] * 10];
    t.plot([g, a, p]);
  }
  updateResizeHandles() {
    this.handlePoints.forEach((t, e, i) => {
      const s = this.order[e];
      this.updateHandle.call(this, this.selection.get(e + 1), t, e, i, s);
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
    const i = this.getPoint("t");
    t.get(0).plot(i[0], i[1], e[0], e[1]), t.get(1).center(e[0], e[1]);
  }
  createRotationHandle() {
    const t = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection touchstart.selection", nn("rot", this.el, this.handlePoints));
    this.createRot.call(this, t);
  }
  updateRotationHandle() {
    const t = this.selection.findOne("g.svg_select_handle_rot");
    this.updateRot(t, this.rotationPoint, this.handlePoints);
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.bbox(), e = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(t).map((i) => sn(i, e)), this.rotationPoint = sn(this.getRotationPoint(t), e);
  }
  // A collection of all the points we need to draw our ui
  getHandlePoints({ x: t, x2: e, y: i, y2: s, cx: o, cy: r } = this.el.bbox()) {
    return [
      [t, i],
      [o, i],
      [e, i],
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
class Lr {
  constructor(t) {
    this.el = t, t.remember("_pointSelectHandler", this), this.selection = new Vt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = dn();
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
    this.points.forEach((t, e, i) => {
      this.createHandle.call(this, this.selection, t, e, i), this.selection.get(e + 1).addClass("svg_select_handle_point").on("mousedown.selection touchstart.selection", nn("point", this.el, this.points, e));
    });
  }
  createHandleFn(t) {
    t.circle(5);
  }
  updateHandleFn(t, e) {
    t.center(e[0], e[1]);
  }
  updatePointHandles() {
    this.points.forEach((t, e, i) => {
      this.updateHandle.call(this, this.selection.get(e + 1), t, e, i);
    });
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.points = this.el.array().map((e) => sn(e, t));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}
const Ai = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let i = this.remember("_" + n.name);
  return i || (t.prototype instanceof Ti ? (i = new t(this), t = !0) : i = new n(this), this.remember("_" + n.name, i)), i.active(t, e), this;
};
T(ot, {
  select: Ai(Ti)
});
T([Wt, jt, Ft], {
  pointSelect: Ai(Lr)
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
const ye = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY }), Ri = (n) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), i = Math.max(i, r[0]), s = Math.max(s, r[1]);
  }
  return new Y(t, e, i - t, s - e);
};
function Br(n, t, e) {
  const s = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([o, r]) => {
    const a = o - t[0], l = r - t[1], c = a * e, h = l * e;
    return [c + t[0], h + t[1]];
  });
  return Ri(s);
}
class Fn {
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
    const { event: e, index: i, points: s } = t.detail, o = !e.type.indexOf("mouse");
    if (o && (e.which || e.buttons) !== 1 || this.el.dispatch("beforeresize", { event: t, handler: this }).defaultPrevented)
      return;
    this.box = this.el.bbox(), this.startPoint = this.el.point(ye(e)), this.index = i, this.points = s.slice();
    const r = (o ? "mousemove" : "touchmove") + ".resize", a = (o ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    t.type === "point" ? ct(window, r, this.movePoint) : t.type === "rot" ? ct(window, r, this.rotate) : ct(window, r, this.resize), ct(window, a, this.endResize);
  }
  resize(t) {
    this.lastEvent = t;
    const e = this.snapToGrid(this.el.point(ye(t)));
    let i = e.x - this.startPoint.x, s = e.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (i *= 2, s *= 2);
    const o = this.box.x + i, r = this.box.y + s, a = this.box.x2 + i, l = this.box.y2 + s;
    let c = new Y(this.box);
    if (this.eventType.includes("l") && (c.x = Math.min(o, this.box.x2), c.x2 = Math.max(o, this.box.x2)), this.eventType.includes("r") && (c.x = Math.min(a, this.box.x), c.x2 = Math.max(a, this.box.x)), this.eventType.includes("t") && (c.y = Math.min(r, this.box.y2), c.y2 = Math.max(r, this.box.y2)), this.eventType.includes("b") && (c.y = Math.min(l, this.box.y), c.y2 = Math.max(l, this.box.y)), c.width = c.x2 - c.x, c.height = c.y2 - c.y, this.preserveAspectRatio) {
      const h = c.width / this.box.width, d = c.height / this.box.height, u = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], f = (u.indexOf(this.eventType) + 4) % u.length, g = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[f];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? d : h;
      p = this.eventType.length === 2 ? Math.max(h, d) : p, c = Br(this.box, g, p);
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
    const { x: e, y: i } = this.snapToGrid(this.el.point(ye(t))), s = this.el.array().slice();
    s[this.index] = [e, i], !this.el.dispatch("resize", {
      box: Ri(s),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(t) {
    this.lastEvent = t;
    const e = this.startPoint, i = this.el.point(ye(t)), { cx: s, cy: o } = this.box, r = e.x - s, a = e.y - o, l = i.x - s, c = i.y - o, h = Math.sqrt(r * r + a * a) * Math.sqrt(l * l + c * c);
    if (h === 0)
      return;
    let d = Math.acos((r * l + a * c) / h) / Math.PI * 180;
    if (!d) return;
    i.x < e.x && (d = -d);
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
T(ot, {
  // Resize element with mouse
  resize: function(n = !0, t = {}) {
    typeof n == "object" && (t = n, n = !0);
    let e = this.remember("_ResizeHandler");
    return e || (n.prototype instanceof Fn ? (e = new n(this), n = !0) : e = new Fn(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
  }
});
function Gt(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
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
function Ni(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
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
function ae(n) {
  const t = n.bbox();
  return Gt(n, t.cx, t.cy);
}
function Gr(n, t) {
  try {
    const e = n && n.node, i = e && e.querySelector && e.querySelector("path[data-shape-path]");
    if (!i || typeof i.getTotalLength != "function") return null;
    const s = i.getTotalLength();
    if (!s || !isFinite(s)) return null;
    const o = i.ownerSVGElement, r = i.getScreenCTM && i.getScreenCTM(), a = o && o.getScreenCTM && o.getScreenCTM();
    if (!o || !r || !a) return null;
    const l = a.inverse(), c = o.createSVGPoint(), h = (_, x) => {
      c.x = _, c.y = x;
      const C = c.matrixTransform(r).matrixTransform(l);
      return [C.x, C.y];
    }, [d, u] = ae(n), f = t[0] - d, g = t[1] - u, p = Math.sqrt(f * f + g * g) || 1, y = f / p, m = g / p;
    let b = null, w = -1 / 0;
    const v = 240;
    for (let _ = 0; _ < v; _++) {
      const x = i.getPointAtLength(_ / v * s), [C, R] = h(x.x, x.y);
      if (!isFinite(C) || !isFinite(R)) continue;
      const B = C - d, I = R - u, k = B * y + I * m, Z = Math.abs(B * m - I * y), H = k - Z * 1.5;
      H > w && (w = H, b = [C, R]);
    }
    return b;
  } catch {
    return null;
  }
}
function on(n, t) {
  const e = Gr(n, t);
  if (e && isFinite(e[0]) && isFinite(e[1])) {
    const y = n.bbox(), [m, b] = Gt(n, y.cx, y.cy), w = Math.max(y.width, y.height, 1) * 3;
    if (Math.hypot(e[0] - m, e[1] - b) <= w)
      return e;
  }
  const i = n.bbox(), [s, o] = Ni(n, t[0], t[1]), r = i.cx, a = i.cy, l = s - r, c = o - a, h = Math.sqrt(l * l + c * c);
  if (h === 0)
    return Gt(n, r, a);
  const d = l / h, u = c / h;
  let f;
  if (n.type === "circle") {
    const y = parseFloat(n.attr("r")) || 0;
    f = [r + y * d, a + y * u];
  } else if (n.type === "ellipse") {
    const y = parseFloat(n.attr("rx")) || 0, m = parseFloat(n.attr("ry")) || 0, b = Math.atan2(u, d);
    f = [
      r + y * Math.cos(b),
      a + m * Math.sin(b)
    ];
  } else {
    const y = i.x, m = i.x + i.width, b = i.y, w = i.y + i.height, v = [];
    if (d !== 0) {
      const _ = (y - r) / d, x = a + _ * u;
      x >= b && x <= w && _ > 0 && v.push([y, x, _]);
    }
    if (d !== 0) {
      const _ = (m - r) / d, x = a + _ * u;
      x >= b && x <= w && _ > 0 && v.push([m, x, _]);
    }
    if (u !== 0) {
      const _ = (b - a) / u, x = r + _ * d;
      x >= y && x <= m && _ > 0 && v.push([x, b, _]);
    }
    if (u !== 0) {
      const _ = (w - a) / u, x = r + _ * d;
      x >= y && x <= m && _ > 0 && v.push([x, w, _]);
    }
    v.length > 0 ? (v.sort(function(_, x) {
      return _[2] - x[2];
    }), f = [v[0][0], v[0][1]]) : f = [r, a];
  }
  const [g, p] = Gt(n, f[0], f[1]);
  return isNaN(g) || isNaN(p) || !isFinite(g) || !isFinite(p) ? Gt(n, r, a) : [g, p];
}
function Zn(n, t) {
  const e = n.bbox(), i = e.x + (t.x != null ? t.x : 0.5) * e.width, s = e.y + (t.y != null ? t.y : 0.5) * e.height, [o, r] = Gt(n, i, s);
  return isNaN(o) || isNaN(r) || !isFinite(o) || !isFinite(r) ? ae(n) : [o, r];
}
function En(n) {
  const t = {};
  if (!n.source || !n.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = ae(n.source), i = ae(n.target);
  n.sourceAnchor ? t.point1 = Zn(n.source, n.sourceAnchor) : n.sourceAttach === "center" ? t.point1 = e : t.point1 = on(n.source, i), n.targetAnchor ? t.point2 = Zn(n.target, n.targetAnchor) : n.targetAttach === "center" ? t.point2 = i : t.point2 = on(n.target, e);
  const s = t.point1, o = t.point2;
  let r;
  if (n.type === "curved") {
    const a = o[0] - s[0], l = o[1] - s[1], c = Math.sqrt(a * a + l * l);
    if (c < 1)
      return [["M", s[0], s[1]], ["L", o[0], o[1]]];
    const h = (m, b, w, v) => {
      const _ = Math.sqrt(m * m + b * b);
      if (_ > 1e-4) return [m / _, b / _];
      const x = Math.sqrt(w * w + v * v) || 1;
      return [w / x, v / x];
    }, d = h(s[0] - e[0], s[1] - e[1], a, l), u = h(o[0] - i[0], o[1] - i[1], -a, -l), f = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, g = Math.max(20, c * (0.12 + f * 0.55)), p = [s[0] + d[0] * g, s[1] + d[1] * g], y = [o[0] + u[0] * g, o[1] + u[1] * g];
    r = [
      ["M", s[0], s[1]],
      ["C", p[0], p[1], y[0], y[1], o[0], o[1]]
    ];
  } else if (n.type === "orthogonal") {
    const a = o[0] - s[0], l = o[1] - s[1], c = s[0] < e[0], h = s[1] < e[1], d = o[0] < i[0], u = o[1] < i[1];
    let f, g;
    if (Math.abs(a) > Math.abs(l))
      if (c && d || !c && !d) {
        const p = Math.max(n.curveRadius, Math.abs(l) / 2);
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
      const p = Math.max(n.curveRadius, Math.abs(a) / 2);
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
function Yn(n, t, e, i, s, o) {
  if (!n || n === "null") return null;
  const a = Math.max(12, i * 3 + 6), l = a, c = a * 0.8, h = (e ? "source-" : "target-") + "triangle-" + Math.random().toString(16).substr(2, 8), d = s.defs().marker(l, c);
  d.attr({
    id: h,
    viewBox: "0 0 " + l + " " + c,
    // Anchor the marker at its TIP so the arrow point sits exactly on the line's
    // endpoint (the node edge) instead of overshooting into the node. The target
    // arrow's tip is at x=arrowWidth; the source arrow's tip is at x=0.
    refX: e ? "0" : l,
    refY: c / 2,
    // Center vertically
    markerUnits: "strokeWidth",
    markerWidth: l / 2,
    // Scale down the rendered size
    markerHeight: c / 2,
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
function Me(n, t, e, i) {
  return i && (n.markers = i), n.markerSource && (n.markerSource.element.remove(), n.connector.attr("marker-start", null)), n.markerTarget && (n.markerTarget.element.remove(), n.connector.attr("marker-end", null)), t && t !== "null" ? (n.markerSource = Yn(
    t,
    0,
    !0,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-start", "url(#" + n.markerSource.id + ")")) : n.markerSource = null, e && e !== "null" ? (n.markerTarget = Yn(
    e,
    0,
    !1,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-end", "url(#" + n.markerTarget.id + ")")) : n.markerTarget = null, n;
}
function Hr(n, t, e) {
  return n.markerSourceType = t || "null", n.markerTargetType = e || "null", Me(n, n.markerSourceType, n.markerTargetType), n;
}
function Ur(n, t) {
  return n.strokeWidth = t || 2, n.connector.attr("stroke-width", n.strokeWidth), Me(n, n.markerSourceType, n.markerTargetType), n;
}
function Xn(n, t) {
  n.color = t, n.connector.stroke(t).attr("stroke-width", n.strokeWidth), n.markerSource && n.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), n.markerTarget && n.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
function Fr(n, t) {
  return n && typeof n[t] == "function";
}
function $n(n, t, e) {
  if (!n.showHandles) return null;
  const i = n.container.circle(n.handleRadius * 2).attr({
    cx: e[0],
    cy: e[1],
    fill: n.handleFill,
    stroke: n.handleStroke,
    "stroke-width": n.handleStrokeWidth,
    "pointer-events": "all"
  }).addClass("connector-handle").addClass(t ? "connector-handle-source" : "connector-handle-target");
  try {
    i.node.style.cursor = "grab";
  } catch {
    i.node.setAttribute("style", "cursor: grab");
  }
  const s = {
    element: i,
    isSource: t,
    position: e,
    isDetached: !1,
    originalTarget: t ? n.source : n.target
  };
  return Zr(n, s), s;
}
function Zr(n, t) {
  let e = null;
  if (!Fr(t.element, "draggable")) {
    console.warn(
      "svg.draggable.js plugin not available for connector handles. Install @svgdotjs/svg.draggable.js for proper drag functionality."
    );
    return;
  }
  t.element.draggable(), t.element.on("beforedrag", function(i) {
    t.element.cx(), t.element.cy();
    try {
      t.element.node.style.cursor = "grabbing";
    } catch {
      t.element.node.setAttribute("style", "cursor: grabbing");
    }
    t.element.front(), Yr(n, t);
  }).on("dragmove", function(i) {
    const s = [t.element.cx(), t.element.cy()];
    t.position = s, Xr(n, t, s);
    const o = i.detail.event;
    e = jr(n, o, t), Vr(e);
  }).on("dragend", function(i) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (n.debugMode && Di(n.container), e)
      Wn(n, t, e), Pi();
    else {
      const s = [t.element.cx(), t.element.cy()], o = qr(n, s);
      t.isSource ? n._sourcePhantomRect = o : n._targetPhantomRect = o, Wn(n, t, o);
    }
    e = null;
  });
}
function Yr(n, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? n.source : n.target), t.originalType || (t.originalType = n.type);
  const e = t.isSource ? n.source : n.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = null : n.target = null;
}
function Xr(n, t, e) {
  const i = t.originalType || n.type, s = {
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
  }, o = n.source, r = n.target, a = n.type;
  try {
    n.type = i, t.isSource ? (n.source = s, n.target || (n.target = {
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
    })) : (n.target = s, n.source || (n.source = {
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
    const l = En(n);
    n.connector.plot(l), n.hitArea.plot(l);
  } finally {
    n.source = o, n.target = r, n.type = a;
  }
}
function $r(n, t, e = !1) {
  try {
    const i = n.node.getCTM(), s = n.bbox();
    e && console.log("Hit test debug:", {
      element: n.type,
      point: t,
      bbox: s,
      ctm: i
    });
    const o = i.a * i.d - i.b * i.c;
    if (Math.abs(o) < 1e-10)
      return e && console.log("Using fallback bbox test due to singular matrix"), t[0] >= s.x && t[0] <= s.x + s.width && t[1] >= s.y && t[1] <= s.y + s.height;
    const r = i.d / o, a = -i.b / o, l = -i.c / o, c = i.a / o, h = (i.c * i.f - i.d * i.e) / o, d = (i.b * i.e - i.a * i.f) / o, u = r * t[0] + l * t[1] + h, f = a * t[0] + c * t[1] + d;
    e && console.log("Local coordinates:", { localX: u, localY: f });
    let g = !1;
    if (n.type === "circle") {
      const p = parseFloat(n.attr("cx")) || s.cx, y = parseFloat(n.attr("cy")) || s.cy, m = parseFloat(n.attr("r")) || 0, b = u - p, w = f - y;
      g = b * b + w * w <= m * m, e && console.log("Circle test:", {
        cx: p,
        cy: y,
        r: m,
        dx: b,
        dy: w,
        distance: Math.sqrt(b * b + w * w),
        result: g
      });
    } else if (n.type === "ellipse") {
      const p = parseFloat(n.attr("cx")) || s.cx, y = parseFloat(n.attr("cy")) || s.cy, m = parseFloat(n.attr("rx")) || 0, b = parseFloat(n.attr("ry")) || 0, w = u - p, v = f - y;
      g = w * w / (m * m) + v * v / (b * b) <= 1, e && console.log("Ellipse test:", { cx: p, cy: y, rx: m, ry: b, dx: w, dy: v, result: g });
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
  } catch (i) {
    e && console.log("Exception in hit test, using fallback:", i);
    const s = n.bbox();
    return t[0] >= s.x && t[0] <= s.x + s.width && t[1] >= s.y && t[1] <= s.y + s.height;
  }
}
function Wr(n, t) {
  try {
    const e = n.bbox(), i = n.node.getCTM(), s = t.group().addClass("debug-hit-zone"), o = s.rect(e.width, e.height).attr({
      x: e.x,
      y: e.y,
      fill: "none",
      stroke: "#ffcccc",
      "stroke-width": 1,
      "stroke-dasharray": "2,2"
    });
    if (i) {
      const h = [
        [e.x, e.y],
        [e.x + e.width, e.y],
        [e.x + e.width, e.y + e.height],
        [e.x, e.y + e.height]
      ].map((d) => [
        i.a * d[0] + i.c * d[1] + i.e,
        i.b * d[0] + i.d * d[1] + i.f
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
      r = i.a * e.cx + i.c * e.cy + i.e, a = i.b * e.cx + i.d * e.cy + i.f;
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
function Di(n) {
  try {
    n.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function jr(n, t, e) {
  const i = n.debugMode || !1;
  i && Di(n.container);
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
      const v = u.node.classList;
      if (v && (v.contains("svg_select_boundingRect") || v.contains("svg_select_points") || v.contains("svg_select_selector") || v.contains("svg_resize_rotationPoint") || v.contains("svg_resize_handle") || v.contains("svg_resize_point") || v.contains("svg_draggable_handle") || v.contains("plugin-ui") || v.contains("ui-element")))
        return !1;
    }
    const g = u.bbox();
    if (g.width < 10 || g.height < 10)
      return !1;
    try {
      const _ = window.getComputedStyle(u.node).cursor;
      if (_ === "move" || _ === "nw-resize" || _ === "ne-resize" || _ === "sw-resize" || _ === "se-resize" || _ === "ew-resize" || _ === "ns-resize" || _ === "crosshair")
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
      const v = y.attr("id");
      if (v && (v.includes("_select_") || v.includes("_resize_") || v.includes("plugin")))
        return !1;
      y = y.parent();
    }
    const m = u.attr("id");
    if (m && (m.includes("_select_") || m.includes("_resize_") || m.includes("_handle_") || m.includes("_rotation_") || m.includes("plugin") || m.startsWith("svg_")))
      return !1;
    const b = u.attr("fill"), w = u.attr("stroke");
    return !(!b && !w || (b === "transparent" || b === "none") && (!w || w === "none" || w === "transparent"));
  }
  const r = n.container.root(), a = r.node.getBoundingClientRect(), l = t.clientX - a.left, c = t.clientY - a.top;
  i && console.log("Drop target search at:", { svgX: l, svgY: c });
  const h = s(r);
  i && (console.log("Found target shapes:", h.length), h.forEach((u, f) => {
    console.log(`Target shape ${f}:`, {
      type: u.type,
      id: u.attr("id"),
      classes: u.node.classList ? Array.from(u.node.classList) : [],
      fill: u.attr("fill"),
      stroke: u.attr("stroke"),
      bbox: u.bbox(),
      isValid: Ze(n, u, e)
    });
  }), h.forEach((u) => {
    Ze(n, u, e) && Wr(u, n.container);
  }));
  const d = [];
  return h.forEach(function(u) {
    if (Ze(n, u, e))
      try {
        if ($r(u, [l, c], i)) {
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
          i && console.log("Found candidate:", {
            element: u.type,
            distance: y
          }), d.push({ element: u, distance: y });
        }
      } catch (f) {
        console.warn("Error checking element for drop target:", f);
      }
  }), d.length > 0 ? (d.sort(function(u, f) {
    return u.distance - f.distance;
  }), i && console.log("Selected closest candidate:", d[0]), d[0].element) : (i && console.log("No drop target found"), null);
}
function Ze(n, t, e) {
  const i = e.isSource ? n.source : n.target;
  if (t === i || t.attr("connectortype") || t.hasClass && t.hasClass("connector-handle") || t._isPhantomRect) return !1;
  const s = e.isSource ? n.target : n.source;
  return t !== s;
}
function Wn(n, t, e) {
  let i = null;
  try {
    i = { x: t.element.cx(), y: t.element.cy() };
  } catch {
  }
  const s = t.isSource ? n.source : n.target;
  if (s && s._isPhantomRect && (s.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = e : n.target = e, t.isDetached = !1, !s || s !== e) {
    let o;
    t.isSource ? o = function(l) {
      n.update();
    } : o = function(l) {
      n.update();
    };
    const r = t.isSource ? "_sourceUpdateFunction" : "_targetUpdateFunction", a = n[r];
    if (a && s && (s.off("dragmove", a), s.off("beforedrag", a), s.off("dragstart", a), s.off("dragend", a), s.off("resize", a), s.off("rotate", a), s.off("transform", a)), t.isSource) {
      if (s && s.cons) {
        const l = s.cons.indexOf(n);
        l > -1 && s.cons.splice(l, 1);
      }
      e.cons = e.cons || [], e.cons.indexOf(n) === -1 && e.cons.push(n);
    } else {
      if (s && s.targetCons) {
        const l = s.targetCons.indexOf(n);
        l > -1 && s.targetCons.splice(l, 1);
      }
      e.targetCons = e.targetCons || [], e.targetCons.indexOf(n) === -1 && e.targetCons.push(n);
    }
    n[r] = o, e.on("dragmove", o), e.on("beforedrag", o), e.on("dragstart", o), e.on("dragend", o), e.on("resize", o), e.on("rotate", o), e.on("transform", o);
  }
  if (n.update(), n.source && n.target) {
    const o = En(n);
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
  if (typeof n.onEndpointChange == "function") {
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
    let a = i;
    if (!a)
      try {
        a = { x: e.cx(), y: e.cy() };
      } catch {
      }
    n.onEndpointChange({
      which: t.isSource ? "source" : "target",
      targetNodeId: r,
      isPhantom: o,
      point: a
    });
  }
}
let Q = null;
function Vr(n) {
  if (n !== Q)
    if (Pi(), n) {
      Q = n, n._originalStroke = n.attr("stroke"), n._originalStrokeWidth = n.attr("stroke-width"), n._originalStrokeDasharray = n.attr("stroke-dasharray"), n._originalStrokeOpacity = n.attr("stroke-opacity"), n.attr({
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
        const t = n.node.style;
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
function Pi() {
  if (Q && Q._originalStroke !== void 0) {
    Q.attr({
      stroke: Q._originalStroke,
      "stroke-width": Q._originalStrokeWidth,
      "stroke-dasharray": Q._originalStrokeDasharray,
      "stroke-opacity": Q._originalStrokeOpacity
    });
    try {
      const n = Q.node.style;
      n.animation = "", n.strokeDashoffset = "";
    } catch {
    }
    delete Q._originalStroke, delete Q._originalStrokeWidth, delete Q._originalStrokeDasharray, delete Q._originalStrokeOpacity;
  }
  Q = null;
}
function jn(n, t) {
  if (!n.showHandles || !t || t.length < 2) {
    n.sourceHandle && (n.sourceHandle.element.remove(), n.sourceHandle = null), n.targetHandle && (n.targetHandle.element.remove(), n.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], i = t[t.length - 1], s = [i[i.length - 2], i[i.length - 1]];
  n.sourceHandle ? (n.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), n.sourceHandle.position = e) : n.sourceHandle = $n(n, !0, e), n.targetHandle ? (n.targetHandle.element.attr({
    cx: s[0],
    cy: s[1]
  }), n.targetHandle.position = s) : n.targetHandle = $n(n, !1, s);
}
function qr(n, t) {
  const e = n.container.rect(20, 20).attr({
    x: t[0] - 10,
    y: t[1] - 10,
    fill: "transparent",
    stroke: "none",
    "pointer-events": "none"
  }).addClass("connector-phantom-rect");
  return e._isPhantomRect = !0, e;
}
function gt(n, t) {
  return n && typeof n[t] == "function";
}
function Ii(n, t) {
  t.current && t.current !== n && Sn(t.current), t.current = n, n.isSelected = !0, n.showHandles = !0, n.update();
}
function Sn(n) {
  n.isSelected = !1, n.showHandles = !1, n.update();
}
function Kr(n, t) {
  n.isSelected ? (Sn(n), t.current === n && (t.current = null)) : Ii(n, t);
}
function Qr(n, t) {
  let e = null;
  const i = 5;
  function s(r) {
    e = { x: r.clientX, y: r.clientY };
  }
  function o(r) {
    if (!e) return;
    const a = r.clientX - e.x, l = r.clientY - e.y;
    Math.sqrt(a * a + l * l) < i && typeof n.onLineClick == "function" && n.onLineClick(r), e = null;
  }
  n.hitArea.on("mousedown", s), n.hitArea.on("mouseup", o), n.connector.on("mousedown", s), n.connector.on("mouseup", o);
}
function Jr(n, t, e) {
  n[t + "Attach"] = e, n.update();
}
function ta(n, t) {
  return n.showHandles = t, n.update(), n;
}
function ea(n) {
  return {
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle
  };
}
function na(n, t) {
  return n.clickAreaWidth = Math.max(6, t || 12), n.hitArea.attr("stroke-width", n.clickAreaWidth), n;
}
function ia(n, t) {
  t && (n.connector.remove(), t == "default" ? (n.connector = n.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), n.connector.stroke(n.color).attr("stroke-width", n.strokeWidth)) : n.connector = t, n.update());
}
function sa(n, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && n.type != t && (n.type = t, n.update());
}
function Oi(n, t) {
  return n.debugMode = t, n.hitArea.attr({
    stroke: n.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": n.debugMode ? 0.5 : 0.01
  }), n;
}
function oa(n) {
  return Oi(n, !n.debugMode);
}
function zi(n, t) {
  return t = t || {}, gt(n.source, "select") ? n.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), gt(n.target, "select") ? n.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), n;
}
function Li(n, t) {
  return gt(n.source, "draggable") ? n.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), gt(n.target, "draggable") ? n.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), n;
}
function Bi(n, t) {
  return t = t || {}, gt(n.source, "resize") ? n.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), gt(n.target, "resize") ? n.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), n;
}
function ra(n, t, e, i, s) {
  return t = t || {}, i = i || {}, gt(n.source, "draggable") && gt(n.target, "draggable"), gt(n.source, "select") && gt(n.target, "select"), gt(n.source, "resize") && gt(n.target, "resize"), Li(n), zi(n, t), Bi(n, i), n;
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
let ee = null, Ye = null;
const be = { current: null };
function aa(n, t) {
  const e = {};
  t === void 0 && (t = n, n = {}), ee = n.container || this.parent() || ee;
  const i = this;
  if (Ye = n.markers || this.parent() || Ye, e.container = ee, e.source = i, e.target = t, e.type = n.type || "straight", e.strokeWidth = n.strokeWidth || 2, e.color = n.color || "#000000", e.clickAreaWidth = n.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = n.debugMode || !1, n.connector) {
    const a = De.find(
      "#" + n.connector.node.getAttribute("href").slice(1)
    )[0];
    if (a && a.type == "path") {
      e.connector = n.connector;
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
  e.hitArea.back(), e.sourceAttach = n.sourceAttach || "perifery", e.targetAttach = n.targetAttach || "perifery", e.sourceAnchor = n.sourceAnchor || null, e.targetAnchor = n.targetAnchor || null, e.curveRadius = n.curveRadius || 20, e.lineCurviness = typeof n.lineCurviness == "number" ? n.lineCurviness : 0.3, e.markerSourceType = n.markerSource || "null", e.markerTargetType = n.markerTarget || n.marker || "default", e.showHandles = n.showHandles || !1, e.handleRadius = n.handleRadius || 6, e.handleStrokeWidth = n.handleStrokeWidth || 2, e.handleStroke = n.handleStroke || "#007cff", e.handleFill = n.handleFill || "none", e.isSelected = !1, e.computeConnectorCoordinates = function(a) {
    return En(a || e);
  }, i.cons = i.cons || [], i.cons.push(e), t.targetCons = t.targetCons || [], t.targetCons.push(e), e.update = function() {
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
      l ? (e.connector.plot(a), e.hitArea.plot(a), jn(e, a)) : console.error("Skipping plot due to invalid path data");
    }
  }, Me(e, e.markerSourceType, e.markerTargetType, Ye), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(a, l, c) {
    return Me(e, a, l, c);
  }, e.setMarkerSettings = function(a, l) {
    return Hr(e, a, l);
  }, e.setStrokeWidth = function(a) {
    return Ur(e, a);
  }, e.setConnectorColor = function(a) {
    return Xn(e, a), e;
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
      const h = ae(c), d = on(l, h), u = Ni(l, d[0], d[1]), f = l.bbox();
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
    jn(e, a);
  }, e.selectConnector = function() {
    Ii(e, be);
  }, e.deselectConnector = function() {
    Sn(e), be.current === e && (be.current = null);
  }, e.toggleSelection = function() {
    Kr(e, be);
  }, e.setConnectorAttachment = function(a, l) {
    Jr(e, a, l);
  }, e.setHandleVisibility = function(a) {
    return ta(e, a);
  }, e.getHandles = function() {
    return ea(e);
  }, e.setClickAreaWidth = function(a) {
    return na(e, a);
  }, e.setConnector = function(a) {
    ia(e, a);
  }, e.setType = function(a) {
    sa(e, a);
  }, e.setDebugMode = function(a) {
    return Oi(e, a);
  }, e.toggleDebugMode = function() {
    return oa(e);
  }, e.makeSelectable = function(a) {
    return zi(e, a);
  }, e.makeDraggable = function(a) {
    return Li(e);
  }, e.makeResizable = function(a) {
    return Bi(e, a);
  }, e.makeInteractive = function(a, l, c) {
    return ra(e, a, l, c);
  }, Qr(e), e.update();
  function s(a) {
    e.update();
  }
  function o(a) {
    e.update();
  }
  function r(a) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = r, i.on("dragmove", o), t.on("dragmove", r), i.on("beforedrag", o), i.on("dragstart", o), i.on("dragend", o), t.on("beforedrag", r), t.on("dragstart", r), t.on("dragend", r), i.on("resize", o), t.on("resize", r), i.on("rotate", o), t.on("rotate", r), i.on("transform", o), t.on("transform", r), e.updateConnector = s, Xn(e, e.color), e;
}
T(ot, {
  connectable: aa,
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
  makeConnectableAndInteractive: function(n, t, e, i) {
    const s = this.connectable(n, t);
    return s.makeInteractive(e, i), s;
  }
});
class Gi {
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
        typeof t.select == "function" && t.select({ rotationPoint: this.options.rotateEnabled }), this.options.resizeEnabled && typeof t.resize == "function" && t.resize({
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
          o.setAttribute("stroke-width", "8"), o.setAttribute("stroke", "#333"), o.style.pointerEvents = "all";
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
    for (const i of e)
      if (t.classList.contains(i))
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
      const i = this._preInteractionPos ?? {
        x: this.node.options.x ?? 0,
        y: this.node.options.y ?? 0
      };
      this.node.options.x = i.x + e.x, this.node.options.y = i.y + e.y, this.node.setSize(e.width, e.height), this.node.centerText();
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
class Pe {
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
      const i = `${this.node.id}->${t.id}`;
      if (this.connections.has(i))
        return console.warn(
          "CONNECTOR_DEBUG: Connection already exists:",
          i
        ), this.connections.get(i);
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
        id: i,
        source: this.node,
        target: t,
        connectable: c,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      h.lineColor && c.setLineColor && c.setLineColor(h.lineColor), this.connections.set(i, h);
      try {
        this.slate.markersContainer?.front?.();
      } catch {
      }
      if (c.onEndpointChange = (d) => this.handleEndpointChange(h, d), t.connector) {
        const d = `${t.id}<-${this.node.id}`;
        t.connector.connections.set(d, h);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", i), c.onLineClick = () => {
        this.node.slate?.isReadOnly?.() || this.showLineCog(h, c, t.id);
      }, this.options.onConnect?.(h), h;
    } catch (i) {
      return console.error("CONNECTOR_DEBUG: Failed to create connection:", i), console.error(
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
  connectToPoint(t, e, i = {}) {
    this.isActive || this.enable();
    const s = this.options.lineContainer || this.slate.canvas;
    if (!s) return null;
    const o = s.rect(1, 1).move(t.x - 0.5, t.y - 0.5).fill("none").opacity(0);
    o._isPhantomRect = !0;
    const r = { id: e, svgGroup: o, _isFloating: !0 }, a = this.connectTo(r, i);
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
        const i = `${e.target.id}<-${this.node.id}`;
        e.target.connector.connections.delete(i);
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
      const i = this.connections.get(t);
      if (!i)
        return console.warn(
          "CONNECTOR_DEBUG: Connection not found for update:",
          t
        ), !1;
      Object.assign(i, e);
      const s = i.connectable;
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
          const o = e.showParentArrow ?? i.showParentArrow ? "arrow" : "null", r = e.showChildArrow ?? i.showChildArrow ?? !0 ? "arrow" : "null";
          s.setMarker?.(o, r);
        }
        s.update?.();
      }
      return console.log("CONNECTOR_DEBUG: Updated connection", t), !0;
    } catch (i) {
      return console.error("CONNECTOR_DEBUG: Failed to update connection:", i), !1;
    }
  }
  /**
   * Edge-pin mode: pin (or unpin with null) a connection's endpoint to a
   * normalized local anchor {x,y} in 0..1 on the source or target node.
   * A pinned endpoint stays on that point and rotates with the node; null
   * restores auto-flow (nearest-edge). Re-solves immediately.
   */
  setConnectionAnchor(t, e, i) {
    const s = this.connections.get(`${this.node.id}->${t}`);
    return s ? (e === "source" ? s.sourceAnchor = i : s.targetAnchor = i, s.connectable?.setAttachmentAnchor?.(e, i), !0) : !1;
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
    const { which: i, targetNodeId: s, isPhantom: o, point: r } = e, a = {
      lineColor: t.lineColor,
      lineWidth: t.lineWidth,
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow
    }, l = (t.id.split("->")[1] || "").trim();
    setTimeout(() => {
      try {
        if (i === "target") {
          const c = t.source;
          if (!c?.relationships) return;
          if (o || !s) {
            if (!r) return;
            l && c.relationships.removeAssociation(l), c.relationships.addFloatingAssociation(r, a);
          } else {
            const h = this.slate.nodes.one(s);
            if (!h || h.id === l) return;
            l && c.relationships.removeAssociation(l), c.relationships.addAssociation(h, a), this.pinDropAnchor(c, h.id, h, "targetAnchor", r);
          }
        } else {
          if (o || !s) return;
          const c = t.source, h = t.target, d = this.slate.nodes.one(s);
          if (!d || !h || !c?.relationships || d.id === c.id)
            return;
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
  pinDropAnchor(t, e, i, s, o) {
    try {
      if (!o) return;
      const r = i?.options || {};
      if (!r.width || !r.height || r.rotate?.rotationAngle) return;
      const a = (b) => Math.max(0, Math.min(1, b));
      let l = a((o.x - (r.x || 0)) / r.width), c = a((o.y - (r.y || 0)) / r.height);
      const h = l, d = 1 - l, u = c, f = 1 - c, g = Math.min(h, d, u, f);
      g === h ? l = 0 : g === d ? l = 1 : g === u ? c = 0 : c = 1;
      const p = { x: l, y: c }, y = t?.relationships, m = y?.associations?.find((b) => b.childId === e);
      m?.id && y.applyLineProperty(m.id, s, p);
    } catch {
    }
  }
  /**
   * L5 per-endpoint locking. mode "absolute" freezes the endpoint at its
   * current spot on the node (a normalized local anchor that then moves/rotates
   * with the node); "relative" clears it back to auto-flow (nearest-edge).
   * Returns the anchor that was set (or null) so callers can persist it.
   */
  setEndpointLock(t, e, i) {
    const s = this.connections.get(t);
    if (!s) return null;
    const o = s.connectable;
    if (i === "absolute") {
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
  showLineCog(t, e, i) {
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
          this.node.relationships?.removeAssociation?.(i), s.clearLineCog?.();
        }
      },
      {
        key: "cog",
        color: "#5b6472",
        onClick: () => {
          this.openLinePane(t, e, i), this.showEndpointLockToggles(t, e, i);
        }
      }
    ], f = u.length, g = c * 2 + h, p = f * (c * 2) + (f - 1) * h, y = r - p / 2 + c, m = l.group().addClass("line-cog").addClass("line-toolbar");
    m.rect(p + 14, c * 2 + 10).radius((c * 2 + 10) / 2).center(r, a).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 });
    const b = this.node.constructor;
    u.forEach((w, v) => {
      const _ = y + v * g, x = m.group().addClass(`line-tool-${w.key}`);
      x.circle(c * 2).center(_, a).fill("#ffffff").attr("fill-opacity", 1e-3), b.drawToolIcon?.(x, w.key, _, a, w.color), x.attr("pointer-events", "all");
      try {
        x.node.style.cursor = "pointer";
      } catch {
      }
      x.on("mousedown", (C) => C.stopPropagation?.()), x.on("click", (C) => {
        C.stopPropagation?.(), w.onClick();
      });
    }), m.attr("pointer-events", "all"), s._activeLineCog = m;
    try {
      e.selectConnector?.(), s._activeLineConnectable = e;
    } catch {
    }
    try {
      s.markersContainer?.front?.();
    } catch {
    }
  }
  openLinePane(t, e, i) {
    const s = this.node.slate?.options?.events;
    if (!s?.onLineMenuRequested) return;
    const o = this.node.relationships, r = o?.associations?.find((a) => a.childId === i) ?? o?.getAssociation?.(i) ?? t;
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
  showEndpointLockToggles(t, e, i) {
    const s = this.slate;
    s._activeEndpointToggles && s._activeEndpointToggles.forEach((x) => {
      try {
        x.remove();
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
    const a = o.getPointAtLength(0), l = o.getPointAtLength(r), c = this.node.relationships, h = c?.associations?.find((x) => x.childId === i);
    if (!h) return;
    const d = (x) => {
      const C = x?.options || {};
      return { x: (C.x || 0) + (C.width || 0) / 2, y: (C.y || 0) + (C.height || 0) / 2 };
    }, u = (x, C) => Math.hypot(x.x - C.x, x.y - C.y), f = d(this.node), g = u(a, f) <= u(l, f), p = Math.min(34, r * 0.28), y = o.getPointAtLength(g ? p : r - p), m = o.getPointAtLength(g ? r - p : p), b = s.markersContainer || s.canvas, w = "#5b6472", v = "#4051B5", _ = (x, C) => {
      const R = C === "source" ? !!h.sourceAnchor : !!h.targetAnchor, B = R ? v : w, I = b.group().addClass("endpoint-lock").addClass(`endpoint-lock-${C}`).addClass(R ? "endpoint-lock-absolute" : "endpoint-lock-relative");
      I.circle(24).center(x.x, x.y).fill("#ffffff").stroke({ color: B, width: 1.5 }), Pe.drawLockIcon(I, x.x, x.y, B, R), I.circle(24).center(x.x, x.y).fill("#ffffff").attr("fill-opacity", 1e-3), I.attr("pointer-events", "all");
      try {
        I.node.style.cursor = "pointer";
      } catch {
      }
      I.on("mousedown", (k) => k.stopPropagation?.()), I.on("click", (k) => {
        k.stopPropagation?.();
        const Z = C === "source" ? "sourceLock" : "targetLock", H = R ? "relative" : "absolute";
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
        this.showEndpointLockToggles(t, e, i);
      }), s._activeEndpointToggles.push(I);
    };
    _(y, "source"), _(m, "target");
    try {
      s.markersContainer?.front?.();
    } catch {
    }
  }
  /** Draw a small padlock (closed = absolute/locked, open = relative). */
  static drawLockIcon(t, e, i, s, o) {
    const r = { color: s, width: 1.4, linecap: "round", linejoin: "round" };
    t.rect(11, 8).radius(1.5).move(e - 5.5, i - 0.5).fill("none").stroke(r), o ? t.path(
      `M ${e - 3.4} ${i - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 0 v 2.2`
    ).fill("none").stroke(r) : t.path(`M ${e - 3.4} ${i - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 -0.6`).fill("none").stroke(r), t.circle(1.6).center(e, i + 3).fill(s);
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
function rn(n, t, e) {
  return {
    id: `${n}->${t}`,
    parentId: n,
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
const la = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultAssociation: rn
}, Symbol.toStringTag, { value: "Module" }));
class Hi {
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
    const i = rn(this.node.id, t.id, e);
    return this.assocMap.set(i.id, i), this.renderAssociation(i, t), this.node.slate?.broadcast?.("addRelationship", { ...i }), console.log(
      "RELATIONSHIP_DEBUG: Added association",
      i.id,
      "from",
      this.node.id,
      "to",
      t.id
    ), i;
  }
  /**
   * Remove a specific association by child node ID.
   */
  removeAssociation(t) {
    const e = `${this.node.id}->${t}`, i = this.assocMap.get(e);
    if (!i)
      return console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        e
      ), !1;
    if (i.targetPoint && this.node.connector)
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
      const i = this.assocMap.get(e);
      this.removeAssociation(i.childId);
    }
  }
  /**
   * Apply a single line property (from the line-properties pane) to one
   * association: update the stored record (so it serializes/persists) AND
   * re-render the connector. Used by the onLinePropertiesChanged apply path
   * (local invoke + remote collab), which is why line edits now sync + persist.
   */
  applyLineProperty(t, e, i) {
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
        i === "absolute" ? "absolute" : "relative"
      );
      return s[r + "Anchor"] = a ?? null, !0;
    }
    if (s[e] = i, e === "sourceAnchor" || e === "targetAnchor") {
      const r = e === "sourceAnchor" ? "source" : "target";
      this.node.connector?.getConnections?.().find((l) => l.id === o)?.connectable?.setAttachmentAnchor?.(r, i);
    } else
      this.node.connector?.updateConnection(o, { [e]: i });
    return !0;
  }
  /**
   * Update all associations with new options (e.g., line color change).
   */
  updateAssociationsWith(t) {
    for (const [e, i] of this.assocMap)
      if (Object.assign(i, t), this.node.connector) {
        const s = `${this.node.id}->${i.childId}`;
        this.node.connector.updateConnection(s, {
          lineColor: i.lineColor,
          lineWidth: i.lineWidth
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
    const i = {
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
        i
      );
      return;
    }
    e && this.node.connector.connectTo(e, i);
  }
  /**
   * Add a free-floating association whose target is a bare world point rather
   * than a node (L1b). Backed by a phantom endpoint; broadcasts + persists like
   * a normal association (targetPoint travels in the record).
   */
  addFloatingAssociation(t, e) {
    const i = e?.childId || `__free_${Math.random().toString(36).slice(2, 10)}`, s = rn(this.node.id, i, {
      ...e,
      childId: i,
      targetPoint: t
    });
    return this.assocMap.set(s.id, s), this.renderAssociation(s, null), this.node.slate?.broadcast?.("addRelationship", { ...s }), s;
  }
}
class Ui {
  constructor(t) {
    this.patternElement = null, this.imageUrl = "", this.origWidth = 0, this.origHeight = 0, this.preserveAspectRatio = !0, this.node = t;
  }
  /**
   * Set an image fill on the node's background.
   *
   * Uses SVG pattern fills for proper scaling within the shape.
   */
  set(t, e, i, s = !0) {
    this.imageUrl = t, this.origWidth = e || this.node.options.width || 100, this.origHeight = i || this.node.options.height || 60, this.preserveAspectRatio = s, this.node.options.image = t, this.node.options.imageOrigWidth = this.origWidth, this.node.options.imageOrigHeight = this.origHeight, this.render();
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
        const t = this.node.options.width || 100, e = this.node.options.height || 60, i = this.node.svgGroup.root();
        if (!i) return;
        let s = i.defs();
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
const xe = /* @__PURE__ */ new Set(), ne = /* @__PURE__ */ new Map(), ca = /* @__PURE__ */ new Set([
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
function Mn(n) {
  const t = n.trim(), e = t.toLowerCase();
  if (ca.has(e) || xe.has(e))
    return Promise.resolve();
  if (ne.has(e))
    return ne.get(e);
  const i = new Promise((s, o) => {
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
  return ne.set(e, i), i;
}
async function Fi(n) {
  const t = /* @__PURE__ */ new Set(), e = n.nodes?.allNodes || [];
  for (const s of e)
    s.options?.fontFamily && t.add(s.options.fontFamily);
  const i = Array.from(t).map((s) => Mn(s));
  await Promise.all(i), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function ha(n) {
  return xe.has(n.toLowerCase().trim());
}
const da = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isFontLoaded: ha,
  loadAllFonts: Fi,
  loadFont: Mn
}, Symbol.toStringTag, { value: "Module" }));
class Zi {
  constructor(t) {
    this.node = t;
  }
  /** Destroy the editor, clearing all references */
  destroy() {
    this.node = null;
  }
  /**
   * Set text content and properties on the node.
   * This is the primary method used by collaboration events
   * and the text editing pane.
   */
  async set(t, e, i, s, o, r, a) {
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), s !== void 0 && (this.node.options.fontColor = s), o !== void 0 && (this.node.options.textOpacity = o), r !== void 0 && (this.node.options.textXAlign = r), a !== void 0 && (this.node.options.textYAlign = a), i !== void 0 && i !== this.node.options.fontFamily && (this.node.options.fontFamily = i, await Mn(i)), this.applyText();
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
      const t = this.node.textElement.bbox(), e = this.node.options.width || 100, i = this.node.options.height || 60;
      return {
        x: (e - t.width) / 2,
        y: (i - t.height) / 2
      };
    } catch {
      return { x: 0, y: 0 };
    }
  }
  // ─── Private ─────────────────────────────────────────────────────
  applyText() {
    if (!this.node.textElement) return;
    const { text: t, fontSize: e, fontFamily: i, fontColor: s, textOpacity: o } = this.node.options;
    this.node.textElement.text(t || ""), this.node.textElement.font({
      family: i || "Arial, sans-serif",
      size: e || 14,
      fill: s || "#000000",
      opacity: o ?? 1
    }), typeof this.node.centerText == "function" && this.node.centerText(), this.node.slate?.options?.autoResizeNodesBasedOnText && this.autoResize();
  }
  autoResize() {
    if (this.node.textElement)
      try {
        const t = this.node.textElement.bbox(), e = 20, i = t.width + e * 2, s = t.height + e * 2, o = this.node.options.width || 100, r = this.node.options.height || 60;
        if (i > o || s > r) {
          const a = Math.max(o, i), l = Math.max(r, s);
          this.node.setSize(a, l);
        }
      } catch {
      }
  }
}
class Yi {
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
const wt = /* @__PURE__ */ new Map();
wt.set("dropShadow", {
  name: "dropShadow",
  types: ["text", "vect", "image"],
  apply: (n) => {
    try {
      n.attr(
        "filter",
        "drop-shadow(3px 3px 4px rgba(0,0,0,0.3))"
      );
    } catch {
    }
  },
  remove: (n) => {
    try {
      n.attr("filter", null);
    } catch {
    }
  }
});
wt.set("blur", {
  name: "blur",
  types: ["text", "vect", "image"],
  apply: (n) => {
    try {
      n.attr("filter", "blur(2px)");
    } catch {
    }
  },
  remove: (n) => {
    try {
      n.attr("filter", null);
    } catch {
    }
  }
});
wt.set("outline", {
  name: "outline",
  types: ["text", "vect"],
  apply: (n) => {
    try {
      const t = n.attr("stroke"), e = n.attr("stroke-width");
      n.data("original-stroke", t || "#333"), n.data("original-stroke-width", e || 2), n.stroke({ color: "#ff0000", width: 3 });
    } catch {
    }
  },
  remove: (n) => {
    try {
      n.stroke({
        color: n.data("original-stroke") || "#333",
        width: n.data("original-stroke-width") || 2
      });
    } catch {
    }
  }
});
class Xi {
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
    const i = wt.get(t);
    if (!i) {
      console.warn("FILTERS_DEBUG: Unknown filter:", t);
      return;
    }
    (e === "vect" || e === "both") && this.node.backgroundRect && i.apply(this.node.backgroundRect), (e === "text" || e === "both") && this.node.textElement && i.apply(this.node.textElement), this.activeFilters.add(t), this.node.options.filters || (this.node.options.filters = {}), (e === "vect" || e === "both") && (this.node.options.filters.vect = t), (e === "text" || e === "both") && (this.node.options.filters.text = t), console.log(
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
    const e = wt.get(t);
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
        const i = wt.get(e);
        i && (this.node.backgroundRect && i.remove(this.node.backgroundRect), this.node.textElement && i.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const i = wt.get(e);
        i && (this.node.backgroundRect && i.apply(this.node.backgroundRect), this.node.textElement && i.apply(this.node.textElement));
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
function ul(n) {
  wt.set(n.name, n);
}
function fl() {
  return Array.from(wt.keys());
}
function $i() {
  const n = {};
  for (const [t, e] of wt)
    n[t] = { types: e.types || ["text", "vect"] };
  return n;
}
class Wi {
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
function an(n) {
  return V.get(n.toLowerCase());
}
function ua(n) {
  return V.has(n.toLowerCase());
}
function fa(n, t) {
  V.set(n.toLowerCase(), t);
}
function pa() {
  return Array.from(V.keys());
}
function ji(n) {
  return ["rectangle", "circle", "ellipse"].includes(n.toLowerCase());
}
function Vi(n, t) {
  if (t) {
    const e = an(t);
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
  if (n) {
    const e = an(n);
    if (e) return e;
    if (n.trim().startsWith("M") || n.trim().startsWith("m"))
      return {
        path: n,
        defaultWidth: 100,
        defaultHeight: 60,
        viewBox: "0 0 100 60"
        // caller recalculates from path bounds
      };
  }
}
const ga = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getShape: an,
  getShapeNames: pa,
  hasShape: ua,
  isNativeShape: ji,
  registerShape: fa,
  resolveShapePath: Vi
}, Symbol.toStringTag, { value: "Module" }));
function qt(n) {
  const t = { ...n };
  return n.xPos !== void 0 && t.x === void 0 && (t.x = n.xPos, delete t.xPos), n.yPos !== void 0 && t.y === void 0 && (t.y = n.yPos, delete t.yPos), n.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = n.foregroundColor, delete t.foregroundColor), n.shapeHint !== void 0 && t.shape === void 0 && (t.shape = ma(n.shapeHint), delete t.shapeHint), n.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = n.svgString, delete t.svgString), n.blnStraight !== void 0 && (t.isStraightLine = n.blnStraight, delete t.blnStraight), t;
}
function yt(n) {
  const t = { ...n };
  return t.xPos = n.x, t.yPos = n.y, t.foregroundColor = n.fontColor, n.shape && (t.shapeHint = n.shape), n.svgContent && (t.svgString = n.svgContent), t;
}
function kn(n) {
  const t = { ...n };
  return n.showbirdsEye !== void 0 && (t.birdsEye = {
    enabled: !!n.showbirdsEye,
    // Top-right by default so it doesn't collide with the host's bottom
    // chat/huddle panel (slatebox docks those bottom-right).
    position: "top-right",
    ...n.sizeOfbirdsEye ? { width: n.sizeOfbirdsEye, height: n.sizeOfbirdsEye } : {},
    ...n.birdsEye || {}
  }), t;
}
function qi(n) {
  return { ...n };
}
function Tn(n) {
  return {
    id: n.id || `${n.parentId}->${n.childId}`,
    childId: n.childId,
    parentId: n.parentId,
    isStraightLine: n.isStraightLine ?? n.blnStraight ?? !1,
    lineColor: n.lineColor || "#000",
    lineEffect: n.lineEffect || "",
    lineOpacity: n.lineOpacity ?? 1,
    lineType: n.lineType || "bezier",
    lineCurveType: n.lineCurveType || "cubic",
    lineCurviness: n.lineCurviness ?? 0.1,
    lineWidth: n.lineWidth ?? 6,
    showParentArrow: n.showParentArrow ?? !1,
    showChildArrow: n.showChildArrow ?? !0,
    sourcePoint: n.sourcePoint ?? null,
    targetPoint: n.targetPoint ?? null,
    sourceAnchor: n.sourceAnchor ?? null,
    targetAnchor: n.targetAnchor ?? null
  };
}
function An(n) {
  return {
    childId: n.childId,
    parentId: n.parentId,
    isStraightLine: n.isStraightLine,
    lineColor: n.lineColor,
    lineEffect: n.lineEffect,
    lineOpacity: n.lineOpacity,
    lineType: n.lineType,
    lineCurveType: n.lineCurveType,
    lineCurviness: n.lineCurviness,
    lineWidth: n.lineWidth,
    showParentArrow: n.showParentArrow,
    showChildArrow: n.showChildArrow,
    sourcePoint: n.sourcePoint ?? null,
    targetPoint: n.targetPoint ?? null,
    sourceAnchor: n.sourceAnchor ?? null,
    targetAnchor: n.targetAnchor ?? null
  };
}
function ma(n) {
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
  }[n.toLowerCase()] || n;
}
function ya(n) {
  const t = {
    options: kn(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = qt(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => Tn(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
function ba(n) {
  const t = {
    options: qi(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = yt(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => An(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
const wa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  convertV1JsonToV2: ya,
  convertV2JsonToV1: ba,
  v1AssociationToV2: Tn,
  v1NodeToV2: qt,
  v1SlateToV2: kn,
  v2AssociationToV1: An,
  v2NodeToV1: yt,
  v2SlateToV1: qi
}, Symbol.toStringTag, { value: "Module" }));
class Ie {
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
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this._groupDragSiblings = [], this._lastClickTime = 0, this._initFailed = !1, this._destroyed = !1, this._svgViewboxTimeoutId = null, this._dragEndTimeoutId = null, this._previewViewboxTimeoutId = null, this._connectTimeoutId = null, this.id = t.id || this.generateId(), this.slate = e, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: t }), this.options = {
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
    }, this.ready = new Promise((i, s) => {
      this._resolveReady = i, this._rejectReady = s;
    }), console.log("NODE_DEBUG: Calling createAsync for", this.id), this.createAsync();
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }
  async createAsync() {
    console.log("NODE_DEBUG: createAsync started for", this.id);
    try {
      const t = await this.slate.getViewportAsync();
      console.log("NODE_DEBUG: Got viewport for", this.id, t), this.svgGroup = t.group(), this.svgGroup.attr("data-node-id", this.id), this.svgGroup.node.setAttribute("tabindex", "0"), this.svgGroup.node.setAttribute("role", "button"), console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup), this.finishCreate();
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
      const i = this.options.width, s = this.options.height, o = this.backgroundRect.x?.() ?? 0, r = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(i, s).move(o, r), this.nestedSvg.svg(this.options.svgContent), this._svgViewboxTimeoutId = setTimeout(() => {
        if (this._destroyed || !this.nestedSvg) return;
        const a = this.nestedSvg.children()[0];
        if (a) {
          let l = a.bbox();
          console.log("NODE_DEBUG: Delayed bbox:", l, "Node size:", i, s), (l.width <= 0 || l.height <= 0) && (l = this.calculatePathBounds(this.options.svgContent, i, s), console.log("NODE_DEBUG: Calculated bounds:", l)), l.width > 0 && l.height > 0 ? (this.nestedSvg.viewbox(l.x, l.y, l.width, l.height), this.nestedSvg.node.setAttribute(
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
    this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new Gi(this, e), this.connector = new Pe(this, this.options.connector), this.relationships = new Hi(this), this.images = new Ui(this), this.editor = new Zi(this), this.links = new Yi(this), this.filters = new Xi(this), this.menu = new Wi(this), this.options.image && this.images.set(
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
      const e = this.options.width || 0, i = 11, s = e - i - 3, o = i + 3, r = this.svgGroup.group();
      r.node.setAttribute("class", "node-link-badge"), r.node.setAttribute("style", "cursor:pointer"), r.circle(i * 2).move(s - i, o - i).fill("#2d6cdf").stroke({ color: "#fff", width: 1.5 });
      const l = document.createElementNS("http://www.w3.org/2000/svg", "text");
      l.setAttribute("x", String(s)), l.setAttribute("y", String(o)), l.setAttribute("text-anchor", "middle"), l.setAttribute("dominant-baseline", "central"), l.setAttribute("font-family", "sans-serif"), l.setAttribute("font-size", "15"), l.setAttribute("font-weight", "bold"), l.setAttribute("fill", "#fff"), l.setAttribute("pointer-events", "none"), l.textContent = "↗", r.node.appendChild(l), r.on("click", (c) => {
        c.stopPropagation(), c.preventDefault?.(), this.links?.navigate();
      }), this._linkBadge = r;
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
      backgroundColor: i,
      borderColor: s,
      borderWidth: o,
      borderStyle: r,
      borderOpacity: a,
      shape: l,
      vectorPath: c,
      opacity: h
    } = this.options, d = { color: s, width: o }, u = this.borderDashArray();
    u !== "none" && (d.dasharray = u), a !== void 0 && (d.opacity = a);
    const f = Vi(l, c);
    if (f && !ji(l || "")) {
      const g = this.svgGroup.nested().size(t, e), p = g.path(f.path).fill(i).stroke(d);
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
          this.backgroundRect = this.svgGroup.circle(g * 2).fill(i).stroke(d);
          break;
        }
        case "ellipse":
          this.backgroundRect = this.svgGroup.ellipse(t, e).fill(i).stroke(d);
          break;
        default:
          this.backgroundRect = this.svgGroup.rect(t, e).fill(i).stroke(d).radius(4);
          break;
      }
      h !== void 0 && this.backgroundRect.opacity(h);
    }
    console.log(
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
    const i = !!this.resizeRotate && this.resizeRotate.isEnabled();
    try {
      i && this.resizeRotate.disable();
    } catch {
    }
    try {
      this.backgroundRect?.remove?.();
    } catch {
    }
    this.backgroundRect = void 0, this.options.shape = t, e !== void 0 && (this.options.vectorPath = e), this.createBackground();
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
      i && this.slate?.updateSelectionResizeRotate?.();
    } catch {
    }
  }
  createText() {
    console.log("NODE_DEBUG: createText called for", this.id);
    const { text: t, fontSize: e, fontFamily: i, fontColor: s, textOpacity: o } = this.options;
    this.textElement = this.svgGroup.text(t).font({
      family: i,
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
    ), this.centerText();
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
    const { fontSize: t, fontFamily: e, fontColor: i, textOpacity: s } = this.options;
    this.textElement.font({
      family: e,
      size: t,
      fill: i,
      opacity: s
    }), this.centerText();
  }
  /** Position the text element within the background shape based on alignment settings. */
  centerText() {
    if (!this.textElement) return;
    const { width: t, height: e, textXAlign: i, textYAlign: s, textOffset: o } = this.options, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0;
    let l = r + t / 2 + (o?.x || 0), c = a + e / 2 + (o?.y || 0);
    switch (i) {
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
    this.textElement.attr({ x: l, y: c });
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("dragstart.node", (t) => {
      console.log("DRAG_DEBUG: Drag started on", this.id), this.toFront();
      const e = this.slate.getSelectedNodes().includes(this), i = t.detail?.event || t, s = i?.ctrlKey || i?.metaKey;
      e ? console.log(
        "SELECTION_DEBUG: Drag started on already selected node",
        this.id
      ) : (console.log(
        "SELECTION_DEBUG: Drag started on unselected node",
        this.id,
        "- selecting it, addToSelection:",
        s
      ), this.slate.selectNodes([this], s)), this.isDragging = !0, this.wasSelectedBeforeDrag = !0;
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
        const s = this.slate.getZoom?.() || 1, o = (e.x - this._dragStartPointer.x) / s, r = (e.y - this._dragStartPointer.y) / s;
        this.options.x = this.preDragPosition.x + o, this.options.y = this.preDragPosition.y + r;
        for (const a of this._groupDragSiblings)
          a.node.options.x = a.x + o, a.node.options.y = a.y + r, a.node.applyPositionAndRotation();
      }
      const i = this._groupDragSiblings;
      this._groupDragSiblings = [], this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this.applyPositionAndRotation(), this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [
          yt(this.options),
          ...i.map((s) => yt(s.node.options))
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
        ), this.slate.selectNodes([this], !1)), this.slate.notifyNodeChanged(this);
      }, 10);
    }), this.svgGroup.on("dragmove.node", (t) => {
      this.isDragging = !0;
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        t.preventDefault?.();
        const i = this.slate.getZoom?.() || 1, s = (e.x - this._dragStartPointer.x) / i, o = (e.y - this._dragStartPointer.y) / i;
        this.options.x = this.preDragPosition.x + s, this.options.y = this.preDragPosition.y + o, this.applyPositionAndRotation();
        for (const r of this._groupDragSiblings)
          r.node.options.x = r.x + s, r.node.options.y = r.y + o, r.node.applyPositionAndRotation();
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
    const i = e.touches?.[0] ?? e.changedTouches?.[0] ?? e;
    return typeof i.clientX == "number" && typeof i.clientY == "number" ? { x: i.clientX, y: i.clientY } : null;
  }
  position(t, e, i, s, o) {
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
        this.options.x = r + (t - r) * u, this.options.y = a + (e - a) * u, this.applyPositionAndRotation(), d < 1 ? requestAnimationFrame(h) : (this.options.x = t, this.options.y = e, this.applyPositionAndRotation(), i && i());
      };
      requestAnimationFrame(h);
    } else
      this.applyPositionAndRotation(), i && i();
  }
  /** Bring the node to the front of the SVG z-order. */
  toFront() {
    this.svgGroup.front(), this.slate.broadcast?.("onNodeToFront", { id: this.id });
  }
  /** Send the node to the back of the SVG z-order. */
  toBack() {
    this.svgGroup.back(), this.slate.broadcast?.("onNodeToBack", { id: this.id });
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
    this.options.text = t, this.textElement.text(t), this.centerText(), this.svgGroup.node.setAttribute("aria-label", t || "Unnamed node"), e && this.slate.broadcast?.("onNodeTextChanged", { id: this.id, text: t });
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
      const i = Math.min(t, e);
      this.backgroundRect.size(i, i), this.options.width = i, this.options.height = i;
    } else if (this.backgroundRect instanceof de)
      this.backgroundRect.size(t, e);
    else
      try {
        this.backgroundRect.size?.(t, e);
      } catch (i) {
        console.warn("NODE_DEBUG: Failed to resize custom shape backgroundRect:", i);
      }
    if (this.nestedSvg) {
      const i = this.backgroundRect.x?.() ?? 0, s = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg.size(t, e).move(i, s);
    }
    this.centerText(), this._linkBadge && this.updateLinkIndicator();
  }
  /**
   * Change the node[s background and/or border colors.
   *
   * @param backgroundColor - New fill color (or undefined to keep current)
   * @param borderColor     - New stroke color (or undefined to keep current)
   */
  setColors(t, e) {
    const i = this.contentPath ?? this.backgroundRect;
    t && (this.options.backgroundColor = t, i.fill(t)), e && (this.options.borderColor = e, i.stroke({ color: e })), (t || e) && this.slate.broadcast?.("onNodeColorChanged", {
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
    const { borderColor: e, borderWidth: i, borderOpacity: s } = this.options, o = { dasharray: this.borderDashArray() };
    e && (o.color = e), i !== void 0 && (o.width = i), s !== void 0 && (o.opacity = s), t.stroke(o);
  }
  /**
   * SVG stroke-dasharray for the current borderStyle, scaled by border width.
   * Accepts the app's symbols ('-', '.', '--.') and words ('dashed', 'dotted').
   * Returns "none" for solid. Shared by createBackground (load path) and
   * applyBorder (edit path) so border style survives a reload.
   */
  borderDashArray() {
    const { borderStyle: t, borderWidth: e } = this.options, i = e || 1, s = {
      "-": [3, 1],
      dashed: [3, 1],
      ".": [1, 1],
      dotted: [1, 1],
      "--.": [8, 3, 1, 3],
      combo: [8, 3, 1, 3]
    };
    return t && s[t] ? s[t].map((o) => o * i).join(",") : "none";
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
    const i = this.options.rotate.rotationAngle || 0;
    if (!!e && e > 0 && typeof requestAnimationFrame < "u" && typeof performance < "u" && i !== t) {
      const o = t - i, r = performance.now(), a = () => {
        if (this._destroyed || !this.svgGroup || !this.options.rotate) return;
        const l = Math.min(1, (performance.now() - r) / e), c = l < 0.5 ? 2 * l * l : 1 - Math.pow(-2 * l + 2, 2) / 2;
        this.options.rotate.rotationAngle = i + o * c, this.applyPositionAndRotation(), l < 1 ? requestAnimationFrame(a) : (this.options.rotate.rotationAngle = t, this.applyPositionAndRotation());
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
    const t = this.options.x || 0, e = this.options.y || 0, i = this.options.width || 0, s = this.options.height || 0, o = this.options.rotate?.rotationAngle || 0;
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
    const r = o ? `translate(${t} ${e}) rotate(${o} ${i / 2} ${s / 2})` : `translate(${t} ${e})`;
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
          const i = e.connectable({}, e);
          i && typeof i.makeInteractive == "function" ? (console.log(
            "NODE_DEBUG: makeInteractive method available, enabling connection handles for",
            this.id
          ), this.enableConnectionHandles(), i.makeInteractive(), i.connector && i.connector.remove && i.connector.remove()) : console.log(
            "NODE_DEBUG: makeInteractive method not available for",
            this.id
          );
        } catch (i) {
          console.warn(
            "NODE_DEBUG: Error testing svg.connectable.js makeInteractive:",
            i
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
  calculatePathBounds(t, e, i) {
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
    this.svgGroup.on("dblclick", (i) => {
      this.isResizeRotateHandle(i.target) || this.requestTextPane();
    });
    let t = null;
    const e = 5;
    this.svgGroup.on("pointerdown", (i) => {
      if (this.isResizeRotateHandle(i.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        );
        return;
      }
      t = {
        x: i.clientX || i.detail?.x || 0,
        y: i.clientY || i.detail?.y || 0
      };
    }), this.svgGroup.on("pointerup", (i) => {
      if (this.isResizeRotateHandle(i.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        ), t = null;
        return;
      }
      if (t) {
        const s = {
          x: i.clientX || i.detail?.x || 0,
          y: i.clientY || i.detail?.y || 0
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
            const r = i.ctrlKey || i.metaKey;
            this.slate.selectNodes([this], r);
            const a = Date.now();
            a - this._lastClickTime < 400 ? (this._lastClickTime = 0, this.requestTextPane()) : this._lastClickTime = a;
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
    for (const i of e)
      if (t.classList.contains(i))
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
    let i, s;
    try {
      const p = this.svgGroup.rbox(t.canvas);
      i = p.x + p.width / 2, s = p.y;
    } catch {
      i = (this.options.x || 0) + (this.options.width || 0) / 2, s = this.options.y || 0;
    }
    const o = 15, r = 6, a = "#5b6472", l = [
      { key: "delete", color: "#e5484d", onClick: () => this.slate.removeNode(this.id) },
      // plug: press-drag-to-connect (G3) — starts on pointerdown, not click.
      { key: "plug", color: a, onPress: (p) => this.startConnectDrag(p) },
      { key: "cog", color: a, onClick: () => this.menu?.open?.() }
    ], c = l.length, h = o * 2 + r, d = c * (o * 2) + (c - 1) * r, u = i - d / 2 + o, f = s - (o + 18), g = e.group().addClass("node-cog").addClass("node-toolbar");
    g.rect(d + 14, o * 2 + 10).radius((o * 2 + 10) / 2).center(i, f).fill("#ffffff").stroke({ color: "#e3e5ea", width: 1 }), l.forEach((p, y) => {
      const m = u + y * h, b = g.group().addClass(`node-tool-${p.key}`);
      b.circle(o * 2).center(m, f).fill("#ffffff").attr("fill-opacity", 1e-3), Ie.drawToolIcon(b, p.key, m, f, p.color), b.attr("pointer-events", "all");
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
  static drawToolIcon(t, e, i, s, o) {
    const r = { color: o, width: 1.6, linecap: "round", linejoin: "round" };
    e === "delete" ? (t.line(i - 6, s - 5, i + 6, s - 5).stroke(r), t.line(i - 2.5, s - 5, i - 2, s - 7.5).stroke(r), t.line(i + 2.5, s - 5, i + 2, s - 7.5).stroke(r), t.line(i - 2, s - 7.5, i + 2, s - 7.5).stroke(r), t.path(`M ${i - 4.5} ${s - 4} L ${i - 3.8} ${s + 6.5} L ${i + 3.8} ${s + 6.5} L ${i + 4.5} ${s - 4}`).fill("none").stroke(r), t.line(i - 1.3, s - 2, i - 1.3, s + 4).stroke({ color: o, width: 1.1, linecap: "round" }), t.line(i + 1.3, s - 2, i + 1.3, s + 4).stroke({ color: o, width: 1.1, linecap: "round" })) : e === "plug" ? (t.line(i - 4, s + 4, i + 4, s - 4).stroke(r), t.circle(4.4).center(i - 4.5, s + 4.5).fill(o), t.circle(4.4).center(i + 4.5, s - 4.5).fill("#ffffff").stroke(r)) : t.text("⚙").font({ size: 17, anchor: "middle", family: "sans-serif" }).fill(o).center(i, s).attr("dy", "0.05em");
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
    const e = this.slate, i = e.canvas;
    if (!i || this._connectDragging) return;
    this._connectDragging = !0;
    const s = e.markersContainer || i;
    let o, r;
    try {
      const m = this.svgGroup.rbox(i);
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
    const c = (m, b, w, v) => {
      const _ = Math.hypot(m, b);
      if (_ > 1e-4) return [m / _, b / _];
      const x = Math.hypot(w, v) || 1;
      return [w / x, v / x];
    }, h = (m, b, w) => {
      const v = (m.x || 0) + (m.width || 0) / 2, _ = (m.y || 0) + (m.height || 0) / 2, x = b - v, C = w - _;
      if (Math.abs(x) < 1e-3 && Math.abs(C) < 1e-3) return { x: v, y: _ };
      const R = x !== 0 ? (m.width || 0) / 2 / Math.abs(x) : 1 / 0, B = C !== 0 ? (m.height || 0) / 2 / Math.abs(C) : 1 / 0, I = Math.min(R, B);
      return { x: v + x * I, y: _ + C * I };
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
        return i.point(m, b);
      } catch {
        return { x: o, y: r };
      }
    }, g = (m, b) => {
      let w;
      try {
        w = a.node.style.display, a.node.style.display = "none";
      } catch {
      }
      const v = document.elementFromPoint(m, b);
      try {
        w !== void 0 && (a.node.style.display = w);
      } catch {
      }
      const x = v?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
      return !x || x === this.id ? null : e.nodes?.one?.(x) || null;
    }, p = (m) => {
      const b = f(m.clientX, m.clientY), w = g(m.clientX, m.clientY);
      if (w && w.options) {
        const v = w.options, _ = (v.x || 0) + (v.width || 0) / 2, x = (v.y || 0) + (v.height || 0) / 2, C = h(v, o, r), R = h(this.options, _, x), B = C.x - R.x, I = C.y - R.y, k = Math.hypot(B, I) || 1, Z = c(R.x - o, R.y - r, B, I), H = c(C.x - _, C.y - x, -B, -I), q = Math.max(30, Math.min(k * 0.45, 90)), G = R.x + Z[0] * q, W = R.y + Z[1] * q, K = C.x + H[0] * q, tt = C.y + H[1] * q;
        a.plot(
          `M ${R.x} ${R.y} C ${G} ${W} ${K} ${tt} ${C.x} ${C.y}`
        );
      } else
        a.plot(`M ${o} ${r} L ${b.x} ${b.y}`);
      if (w !== (d?.node || null) && (u(), w && w.backgroundRect)) {
        const v = w.backgroundRect;
        d = { node: w, _preHiStroke: v.attr("stroke") };
        try {
          v.attr({ stroke: "#007cff", "stroke-dasharray": "8,4", "stroke-opacity": 0.9 });
        } catch {
        }
      }
    }, y = (m) => {
      window.removeEventListener("pointermove", p, !0), window.removeEventListener("pointerup", y, !0), this._connectDragging = !1;
      try {
        a.remove(), l?.remove?.(), i.node.querySelectorAll(
          ".connect-drag-line"
        ).forEach((v) => v.remove());
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
    ), this.connectionHandles.container = this.slate.canvas.group();
    const t = 8, e = "#007cff", i = "#ffffff", s = 2, o = {
      top: { x: 0, y: -t - 5 },
      right: { x: t + 5, y: 0 },
      bottom: { x: 0, y: t + 5 },
      left: { x: -t - 5, y: 0 }
    };
    Object.entries(o).forEach(([r, a]) => {
      if (!this.connectionHandles.container) return;
      const l = this.connectionHandles.container.circle(t * 2).fill(e).stroke({ color: i, width: s }).addClass(`connection-handle connection-handle-${r}`);
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
    const i = this.options.width, s = this.options.height, o = 75, r = this.getRotation(), a = this.backgroundRect.rbox(this.backgroundRect.root()), l = a.cx, c = a.cy, h = this.connectionHandles[t];
    if (!h) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const d = h.bbox(), u = {
      x: d.x + d.width / 2,
      y: d.y + d.height / 2
    }, f = u.x - l, g = u.y - c, p = Math.sqrt(f * f + g * g), y = f / p, m = g / p, b = this.backgroundRect.bbox(), w = b.x + b.width / 2, v = b.y + b.height / 2, _ = this.backgroundRect.screenCTM(), C = this.backgroundRect.root().screenCTM().inverseO().multiplyO(_), R = C.inverse(), B = y * R.a + m * R.c, I = y * R.b + m * R.d;
    let k, Z;
    const H = Math.abs(B);
    Math.abs(I) > H ? I < 0 ? (k = w, Z = b.y) : (k = w, Z = b.y + b.height) : B < 0 ? (k = b.x, Z = v) : (k = b.x + b.width, Z = v);
    const G = ([nt, lt], { a: Ot, b: S, c: vt, d: xt, e: Kt, f: Qt }) => [nt * Ot + lt * vt + Kt, nt * S + lt * xt + Qt], [W, K] = G([k, Z], C), tt = Math.sqrt(
      Math.pow(W - l, 2) + Math.pow(K - c, 2)
    ), at = tt, bt = tt + o + at, It = l + y * bt, et = c + m * bt, E = It - i / 2, O = et - s / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      E,
      O,
      i,
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
  createPreviewShape(t, e, i, s, o, r = 0) {
    let a;
    const l = this.options.backgroundColor || "#007cff", c = "#ffffff", h = 2, d = 0.6, u = e + s / 2, f = i + o / 2;
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
          a = t.rect(s, o).move(e, i).fill("none").stroke({ color: c, width: h }).opacity(d).radius(4);
          const p = t.nested().size(s, o).move(e, i);
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
          a = t.rect(s, o).move(e, i).fill(l).stroke({ color: c, width: h }).opacity(d).radius(4), r !== 0 && a.rotate(r, u, f);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, i) {
    const s = i.x - e.x, o = i.y - e.y, r = Math.sqrt(s * s + o * o);
    if (r === 0) return;
    const a = s / r, l = o / r, c = 12, h = 6, d = i.x, u = i.y, f = d - a * c, g = u - l * c, p = -l * h, y = a * h, m = [
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
    ), this.showConnectionHandles();
  }
  /** Hide connection handles on this node. */
  disableConnectionHandles() {
    console.log(
      "CONNECTION_HANDLES_DEBUG: disableConnectionHandles called for",
      this.id
    ), this.hideConnectionHandles();
  }
  isConnectionHandlesEnabled() {
    return this.connectionHandlesVisible;
  }
  getNodeEdgePoint(t, e) {
    const i = t.x + t.width / 2, s = t.y + t.height / 2;
    switch (e) {
      case "top":
        return { x: i, y: t.y };
      case "right":
        return { x: t.x + t.width, y: s };
      case "bottom":
        return { x: i, y: t.y + t.height };
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
      const e = this.options.width, i = this.options.height, s = 75, o = this.getRotation(), r = o * Math.PI / 180;
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
      const w = this.backgroundRect.screenCTM(), _ = this.backgroundRect.root().screenCTM().inverseO().multiplyO(w), x = ([tt, at], { a: bt, b: It, c: et, d: E, e: O, f: j }) => [tt * bt + at * et + O, tt * It + at * E + j], [C, R] = x([m, b], _), B = Math.sqrt(
        Math.pow(C - u, 2) + Math.pow(R - f, 2)
      ), I = B, k = B + s + I, Z = u + c * k, H = f + h * k, q = Z - e / 2, G = H - i / 2, W = this.cloneNodeOptions(q, G, o), K = this.slate.addNode(W);
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
  cloneNodeOptions(t, e, i) {
    const s = "node_" + Math.random().toString(36).substr(2, 9), o = {
      ...this.options,
      id: s,
      x: t,
      y: e,
      text: `Node ${s.split("_")[1]}`
      // Give it a different default text
      // Keep the same visual properties (shape, color, size, etc.)
    };
    return i !== void 0 && i !== 0 && (o.rotate = {
      ...o.rotate,
      rotationAngle: i
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
class va {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Ie(t, this.slate);
    return this.nodes.set(e.id, e), e;
  }
  remove(t) {
    const e = this.nodes.get(t);
    if (e) {
      try {
        e.relationships?.removeAll?.();
      } catch {
      }
      return this.allNodes.forEach((i) => {
        if (i.id !== t)
          try {
            i.relationships?.getAssociation?.(t) && i.relationships.removeAssociation(t);
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
    const i = t?.data ?? t ?? {}, s = e.animate === !1 || i.dur === 0 ? 0 : i.dur ?? 400, o = [];
    Array.isArray(i.nodes) && i.nodes.forEach((r) => o.push({ id: r.id, x: r.x, y: r.y })), Array.isArray(i.nodeOptions) && i.nodeOptions.forEach(
      (r) => o.push({ id: r.id, x: r.xPos ?? r.x, y: r.yPos ?? r.y })
    ), o.forEach((r) => {
      const a = this.one(r.id);
      a && typeof r.x == "number" && typeof r.y == "number" && a.position(r.x, r.y, void 0, void 0, s);
    });
  }
  /** Create an association from a collab package: `{parentId, childId, ...opts}` */
  addRelationship(t) {
    const { parentId: e, childId: i, targetPoint: s } = t || {}, o = e ? this.one(e) : void 0;
    if (!o) {
      console.warn("NODESMANAGER_DEBUG: addRelationship missing parent", e);
      return;
    }
    if (o.relationships?.getAssociation?.(i)) return;
    if (s) {
      o.relationships?.addFloatingAssociation(
        s,
        t
      );
      return;
    }
    const r = i ? this.one(i) : void 0;
    if (!r) {
      console.warn(
        "NODESMANAGER_DEBUG: addRelationship missing child",
        e,
        i
      );
      return;
    }
    o.relationships?.addAssociation(r, t);
  }
  /** Remove an association from a collab package: `{parentId, childId}` */
  removeRelationship(t) {
    const { parentId: e, childId: i } = t || {}, s = e ? this.one(e) : void 0;
    !s || !i || s.relationships?.removeAssociation(i);
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
class xa {
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
    const e = this.slate.nodes.one(t.data.id), i = t.data?.link;
    e?.links && i && e.links.set(i, !1);
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
    e && t.data.behaviorChanges.forEach((i) => {
      typeof i.value == "object" ? (e.options[i.name] = i.value.val, Object.keys(i.value).forEach((s) => {
        s !== "val" && (e.options[s] = i.value[s]);
      })) : e.options[i.name] = i.value;
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
    const i = t.data.shape ?? t.data.vectorPath;
    Object.assign(e.options, t.data), i && e.setShape(i, t.data.vectorPath);
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
      Array.isArray(e) || (e = [e]), e.filter(Boolean).forEach((i) => {
        this.slate.nodes.one(i.id) || this.slate.nodes.add(qt(i));
      });
    }
  }
  onNodeImageChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e?.images) return;
    const i = t.data.img ?? t.data.image;
    i ? e.images.set(i, t.data.w, t.data.h) : e.images.clear();
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
      const i = t.data.rotate?.rotationAngle ?? t.data.rotationAngle;
      typeof i == "number" && e.setRotation(i, 400), t.data.width && t.data.height && e.setSize(t.data.width, t.data.height);
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
    const i = t.data.filter;
    if (!i) return;
    const s = i.apply === "text" ? "text" : "vect", o = s === "text" ? "text" : "vect", r = e.options.filters?.[o];
    r && e.filters.remove(r), i.id ? e.filters.apply(i.id, s) : e.options.filters && (e.options.filters[o] = void 0);
  }
  onNodeBorderPropertiesChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    if (!e) return;
    const { prop: i, val: s } = t.data;
    i !== void 0 ? e.options[i] = s : (t.data.borderColor !== void 0 && (e.options.borderColor = t.data.borderColor), t.data.borderWidth !== void 0 && (e.options.borderWidth = t.data.borderWidth)), e.applyBorder();
  }
  onLinePropertiesChanged(t) {
    (Array.isArray(t.data) ? t.data : [t.data]).forEach((i) => {
      const s = this.slate.nodes.one(i.id);
      s && (i.associationId && i.prop !== void 0 && s.relationships ? s.relationships.applyLineProperty(i.associationId, i.prop, i.val) : i.options && Object.assign(s.options, i.options));
    });
  }
  onFollowMeChanged(t) {
    this.slate.options.followMe = t.data?.followMe;
  }
  onCanvasMove(t) {
    if (this.slate.options.followMe) {
      const { left: e, top: i } = t.data || {};
      typeof e == "number" && typeof i == "number" && this.slate.pan({ x: e, y: i });
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
      e.options.lineColor = t.data.color, e.relationships?.associations && (e.relationships.associations.forEach((i) => {
        i.lineColor = t.data.color;
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
    this.slate.options.viewPort.showGrid = t.data.showGrid, t.data.showGrid ? console.log("Show grid") : console.log("Hide grid");
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
  onSlateFollowMeChanged(t) {
    this.slate.options.followMe = t.data.followMe;
  }
  onSlateHuddleChanged(t) {
    t.data.huddleType != null && (this.slate.options.huddleType = t.data.huddleType), t.data.huddleEnabled != null && (this.slate.options.huddleEnabled = t.data.huddleEnabled);
  }
}
class Ki {
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
      const i = this.canvas.viewbox(), s = t.getBoundingClientRect(), o = s.width || i.width, r = i.width / o;
      if (e.ctrlKey || e.metaKey) {
        const a = Math.exp(-e.deltaY * 25e-4), l = this.options.zoomMin ?? 0.1, c = this.options.zoomMax ?? 10;
        let d = o / i.width * a;
        d = Math.max(l, Math.min(c, d));
        const u = o / d, f = i.height / i.width * u, g = e.clientX - s.left, p = e.clientY - s.top, y = i.x + g * r, m = i.y + p * (i.height / s.height || r), b = y - g / o * u, w = m - p / (s.height || o) * f;
        this.canvas.viewbox(b, w, u, f);
      } else
        this.canvas.viewbox(
          i.x + e.deltaX * r,
          i.y + e.deltaY * r,
          i.width,
          i.height
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
    const i = document.createElement("button");
    i.textContent = "−", i.title = "Zoom Out", i.addEventListener("click", () => this.zoomOut()), this.controlsContainer.appendChild(i);
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
    const t = this.containerPx(), e = this.canvas.viewbox() || { x: 0, y: 0, width: t.w, height: t.h }, i = (e.x || 0) + (e.width || t.w) / 2, s = (e.y || 0) + (e.height || t.h) / 2;
    this.canvas.viewbox(i - t.w / 2, s - t.h / 2, t.w, t.h), this.fit();
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
    let e = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
    for (const b of t) {
      const w = b.options.x ?? 0, v = b.options.y ?? 0, _ = b.options.width ?? 100, x = b.options.height ?? 60;
      e = Math.min(e, w), i = Math.min(i, v), s = Math.max(s, w + _), o = Math.max(o, v + x);
    }
    if (!isFinite(e)) return;
    const r = s - e, a = o - i, l = 50, c = r + l * 2, h = a + l * 2, d = this.containerPx(), u = d.w / d.h, f = c / h;
    let g = c, p = h;
    f > u ? p = g / u : g = p * u, g < d.w && (g = d.w, p = d.h);
    const y = e + r / 2, m = i + a / 2;
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
    let i = 1 / 0, s = 1 / 0, o = -1 / 0, r = -1 / 0;
    for (const c of t) {
      const h = c.options.x ?? 0, d = c.options.y ?? 0, u = c.options.width ?? 100, f = c.options.height ?? 60;
      i = Math.min(i, h), s = Math.min(s, d), o = Math.max(o, h + u), r = Math.max(r, d + f);
    }
    if (!isFinite(i)) return;
    const a = (i + o) / 2, l = (s + r) / 2;
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
class Qi {
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
    const e = t.getZoom() || 1, i = t.getPan() || { x: 0, y: 0 }, s = this.options.width || 200, o = this.options.height || 150, r = this.calculateContentBounds(), a = Math.max(r.maxX - r.minX, 1), l = Math.max(r.maxY - r.minY, 1), c = 100, h = a + c * 2, d = l + c * 2;
    this.scale = Math.min(
      s / h,
      o / d
    );
    const u = (this.slate.options.viewPort?.originalWidth || 800) / e, f = (this.slate.options.viewPort?.originalHeight || 600) / e, g = (i.x - r.minX + c) * this.scale, p = (i.y - r.minY + c) * this.scale, y = u * this.scale, m = f * this.scale;
    this.viewportIndicator.move(g, p), this.viewportIndicator.size(Math.max(y, 10), Math.max(m, 10));
  }
  updateNodePosition(t) {
    if (!this._enabled) return;
    const e = this.nodeShapes.get(t.id);
    if (!e) return;
    const i = this.calculateContentBounds(), s = 100, o = (t.options.x - i.minX + s) * this.scale, r = (t.options.y - i.minY + s) * this.scale;
    this.animateShapeMove(e, o, r);
    const a = (t.options.width || 100) * this.scale, l = (t.options.height || 60) * this.scale;
    this.applyShapeRotation(e, t, o, r, a, l);
  }
  /**
   * Rotate a minimap shape to match the node's rotation, about its center.
   * Absolute (transform, not the relative .rotate()) so repeated updates don't
   * accumulate. Position (x/y attrs from move) is unaffected.
   */
  applyShapeRotation(t, e, i, s, o, r) {
    const a = e.options.rotate?.rotationAngle || 0;
    try {
      t.transform({ rotate: a, origin: [i + o / 2, s + r / 2] });
    } catch {
    }
  }
  /**
   * Q4: tween a minimap shape to (x,y) with a short easeInOutQuad rAF animation,
   * cancelling any in-flight tween so it retargets smoothly (e.g. during a drag).
   */
  animateShapeMove(t, e, i, s = 220) {
    if (typeof requestAnimationFrame > "u") {
      try {
        t.move(e, i);
      } catch {
      }
      return;
    }
    let o = e, r = i;
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
        t.move(o + (e - o) * u, r + (i - r) * u);
      } catch {
      }
      d < 1 ? t._beRaf = requestAnimationFrame(c) : t._beRaf = null;
    };
    t._beRaf = requestAnimationFrame(c);
  }
  addNodeShape(t) {
    if (!this._enabled || !this.miniCanvas) return;
    const e = this.calculateContentBounds(), i = 100, s = (t.options.x - e.minX + i) * this.scale, o = (t.options.y - e.minY + i) * this.scale, r = (t.options.width || 100) * this.scale, a = (t.options.height || 60) * this.scale;
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
    const t = this.calculateContentBounds(), e = 100, i = Math.max(t.maxX - t.minX, 1), s = Math.max(t.maxY - t.minY, 1), o = i + e * 2, r = s + e * 2;
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
      const i = this.viewportIndicator.bbox();
      this.viewportStartX = i.x, this.viewportStartY = i.y, this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseUp = this.handleMouseUp.bind(this), document.addEventListener("mousemove", this.boundMouseMove), document.addEventListener("mouseup", this.boundMouseUp);
    }));
  }
  handleMouseMove(t) {
    if (!this.isDragging || !this.viewportIndicator) return;
    const e = t.clientX - this.dragStartX, i = t.clientY - this.dragStartY, s = this.viewportStartX + e, o = this.viewportStartY + i;
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
    const i = document.createElement("button");
    i.textContent = "+", i.title = "Zoom In", i.style.cssText = this.getZoomButtonStyle(), i.addEventListener("click", () => this.slate.panZoom?.zoomIn()), this.zoomControlsContainer.appendChild(i), this.container.appendChild(this.zoomControlsContainer), this.startZoomDisplayUpdates();
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
    let e = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
    return t.forEach((r) => {
      const a = r.options.x || 0, l = r.options.y || 0, c = r.options.width || 100, h = r.options.height || 60;
      e = Math.min(e, a), i = Math.min(i, l), s = Math.max(s, a + c), o = Math.max(o, l + h);
    }), { minX: e, minY: i, maxX: s, maxY: o };
  }
}
function Oe(n, t, e) {
  const s = (t || n.nodes.allNodes).map(
    (o) => Ji(o)
  );
  return e && s.forEach((o, r) => {
    o.options._presentationIndex = r;
  }), {
    options: Ca(n.options),
    nodes: s,
    shareId: n.options.shareId || ""
  };
}
async function Rn(n, t, e = !1, i = !1) {
  const s = typeof n == "string" ? JSON.parse(n) : n;
  t.beginRemoteApply?.();
  try {
    await _a(s, t, e, i);
  } finally {
    t.endRemoteApply?.();
  }
}
async function _a(n, t, e, i) {
  if (n.options) {
    const o = n.options;
    Object.assign(t.options, o), n.shareId && (t.options.shareId = n.shareId), t.applyContainerStyle?.();
  }
  e || t.nodes.clear();
  const s = /* @__PURE__ */ new Map();
  if (Array.isArray(n.nodes)) {
    for (const r of n.nodes) {
      const a = ts(r.options), l = t.nodes.one(a.id);
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
    for (const r of n.nodes) {
      const a = r.options.id || r.options.xPos !== void 0 ? qt(r.options).id : r.options.id;
      if (!a) continue;
      const l = s.get(a) || t.nodes.one(a);
      if (!l) continue;
      const c = r.relationships?.associations;
      if (!(!Array.isArray(c) || c.length === 0))
        for (const h of c) {
          const d = Tn(h);
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
  if (!i && t.panZoom) {
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
function Ji(n) {
  const t = yt(n.options);
  if (n.svgGroup)
    try {
      const i = n.svgGroup.bbox();
      t.xPos = n.options.x ?? i.x, t.yPos = n.options.y ?? i.y;
    } catch {
      t.xPos = n.options.x ?? 0, t.yPos = n.options.y ?? 0;
    }
  if (n.getRotation) {
    const i = n.getRotation();
    i !== 0 && (t.rotate = { rotationAngle: i });
  }
  const e = [];
  if (n.relationships && typeof n.relationships.serialize == "function") {
    const i = n.relationships.serialize();
    i?.associations && e.push(
      ...i.associations.map((s) => An(s))
    );
  } else if (n.connector) {
    const i = n.connector.getConnections();
    for (const s of i)
      (s.source === n || s.source?.id === n.id) && e.push({
        childId: s.target?.id || s.target,
        parentId: n.id,
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
function ts(n) {
  return qt(n);
}
function Ca(n) {
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
  for (const i of e)
    n[i] !== void 0 && (t[i] = n[i]);
  return n.viewPort && (t.viewPort = { ...n.viewPort }), n.containerStyle && (t.containerStyle = { ...n.containerStyle }), t;
}
function es(n) {
  return Oe(n);
}
const Ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deserialize: Rn,
  deserializeNodeOptions: ts,
  serialize: Oe,
  serializeNode: Ji,
  snapshot: es
}, Symbol.toStringTag, { value: "Module" }));
class ns {
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
      t = Oe(this.slate);
    } catch {
      return;
    }
    this.redoStack = [], this.undoStack.push(t), this.undoStack.length > this.options.maxHistory && this.undoStack.shift(), console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
  }
  restore(t) {
    this.isRestoring = !0, Rn(t, this.slate, !1, !0).catch((e) => console.error("UNDOREDO_DEBUG: Restore failed", e)).finally(() => {
      this.isRestoring = !1;
    });
  }
}
class is {
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
      const i = e.target;
      if (!(i === t.node || i?.tagName === "svg")) return;
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
    const i = Math.min(this.startPoint.x, e.x), s = Math.min(this.startPoint.y, e.y), o = Math.abs(e.x - this.startPoint.x), r = Math.abs(e.y - this.startPoint.y);
    this.selectionRect.move(i, s).size(o, r);
  }
  onSelectUp(t) {
    if (this.detachWindowHandlers(), !this.isSelecting || !this.startPoint) {
      this.cancelSelection();
      return;
    }
    const e = this.getSvgPoint(t);
    if (e) {
      const i = Math.min(this.startPoint.x, e.x), s = Math.min(this.startPoint.y, e.y), o = Math.abs(e.x - this.startPoint.x), r = Math.abs(e.y - this.startPoint.y);
      o > 5 && r > 5 && this.selectNodesInRect(i, s, o, r, t.shiftKey);
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
  selectNodesInRect(t, e, i, s, o) {
    const r = [], a = this.slate.nodes.allNodes;
    for (const l of a)
      try {
        const c = l.options, h = c.x ?? 0, d = c.y ?? 0, u = c.width ?? 0, f = c.height ?? 0;
        h < t + i && h + u > t && d < e + s && d + f > e && r.push(l);
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
      const i = this.slate.canvas.node, s = i.createSVGPoint();
      s.x = t.clientX, s.y = t.clientY;
      const o = s.matrixTransform(i.getScreenCTM().inverse());
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
    const i = this.slate.getSelectedNodes();
    for (const s of i) {
      const o = (s.options.x || 0) + t, r = (s.options.y || 0) + e;
      s.position(o, r);
    }
  }
}
class ss {
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
    const i = this.options.gridSize;
    return {
      x: Math.round(t / i) * i,
      y: Math.round(e / i) * i
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
    const t = this.slate.canvas, e = t.viewbox(), i = this.options.gridSize, s = this.options.gridColor, o = this.options.gridOpacity, r = Math.floor(e.x / i) * i - i * 5, a = Math.floor(e.y / i) * i - i * 5, l = e.x + e.width + i * 5, c = e.y + e.height + i * 5;
    this.gridGroup = t.group().attr("pointer-events", "none");
    for (let h = r; h <= l; h += i)
      this.gridGroup.line(h, a, h, c).stroke({ color: s, width: 0.5, opacity: o });
    for (let h = a; h <= c; h += i)
      this.gridGroup.line(r, h, l, h).stroke({ color: s, width: 0.5, opacity: o });
    this.gridGroup.back();
  }
}
const Mt = `	
\v\f\r   ᠎             　\u2028\u2029`, Sa = new RegExp(
  `([a-z])[${Mt},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${Mt}]*,?[${Mt}]*)+)`,
  "ig"
), os = new RegExp(
  `(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${Mt}]*,?[${Mt}]*`,
  "ig"
), Ma = new RegExp(
  `([rstm])[${Mt},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${Mt}]*,?[${Mt}]*)+)`,
  "ig"
);
function ka(n) {
  if (!n) return [];
  if (Array.isArray(n)) return n;
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
  return String(n).replace(
    Sa,
    (i, s, o) => {
      const r = [];
      let a = s.toLowerCase();
      if (o.replace(os, (l, c) => (c && r.push(+c), "")), a === "m" && r.length > 2 && (e.push([s, ...r.splice(0, 2)]), a = "l", s = s === "m" ? "l" : "L"), a === "r")
        e.push([s, ...r]);
      else
        for (; r.length >= t[a] && (e.push([s, ...r.splice(0, t[a])]), !!t[a]); )
          ;
      return "";
    }
  ), e;
}
function Ta(n) {
  const t = ka(n);
  if (!t.length) return [["M", 0, 0]];
  const e = [];
  let i = 0, s = 0, o = 0, r = 0, a = 0;
  t[0][0] === "M" && (i = +t[0][1], s = +t[0][2], o = i, r = s, a++, e[0] = ["M", i, s]);
  for (let l = a; l < t.length; l++) {
    const c = [""], h = t[l];
    if (e.push(c), h[0] !== h[0].toUpperCase())
      switch (c[0] = h[0].toUpperCase(), c[0]) {
        case "A":
          c[1] = h[1], c[2] = h[2], c[3] = h[3], c[4] = h[4], c[5] = h[5], c[6] = +h[6] + i, c[7] = +h[7] + s;
          break;
        case "V":
          c[1] = +h[1] + s;
          break;
        case "H":
          c[1] = +h[1] + i;
          break;
        case "M":
          o = +h[1] + i, r = +h[2] + s, c[1] = o, c[2] = r;
          break;
        default:
          for (let d = 1; d < h.length; d++)
            c[d] = +h[d] + (d % 2 ? i : s);
      }
    else
      for (let d = 0; d < h.length; d++) c[d] = h[d];
    switch (c[0]) {
      case "Z":
        i = o, s = r;
        break;
      case "H":
        i = c[1];
        break;
      case "V":
        s = c[1];
        break;
      case "M":
        o = c[c.length - 2], r = c[c.length - 1], i = c[c.length - 2], s = c[c.length - 1];
        break;
      default:
        i = c[c.length - 2], s = c[c.length - 1];
    }
  }
  return e;
}
function we(n, t, e, i) {
  return [n, t, e, i, e, i];
}
function Vn(n, t, e, i, s, o) {
  const r = 0.3333333333333333, a = 2 / 3;
  return [
    r * n + a * e,
    r * t + a * i,
    r * s + a * e,
    r * o + a * i,
    s,
    o
  ];
}
function ve(n, t, e) {
  return { x: n * Math.cos(e) - t * Math.sin(e), y: n * Math.sin(e) + t * Math.cos(e) };
}
function rs(n, t, e, i, s, o, r, a, l, c) {
  const h = Math.PI * 120 / 180, d = Math.PI / 180 * (+s || 0);
  let u = [], f, g = 0, p = 0, y = 0, m = 0;
  if (c)
    g = c[0], p = c[1], y = c[2], m = c[3];
  else {
    f = ve(n, t, -d), n = f.x, t = f.y, f = ve(a, l, -d), a = f.x, l = f.y;
    const G = (n - a) / 2, W = (t - l) / 2;
    let K = G * G / (e * e) + W * W / (i * i);
    K > 1 && (K = Math.sqrt(K), e = K * e, i = K * i);
    const tt = e * e, at = i * i, bt = (o === r ? -1 : 1) * Math.sqrt(Math.abs((tt * at - tt * W * W - at * G * G) / (tt * W * W + at * G * G)));
    y = bt * e * W / i + (n + a) / 2, m = bt * -i * G / e + (t + l) / 2, g = Math.asin(Number(((t - m) / i).toFixed(9))), p = Math.asin(Number(((l - m) / i).toFixed(9))), g = n < y ? Math.PI - g : g, p = a < y ? Math.PI - p : p, g < 0 && (g = Math.PI * 2 + g), p < 0 && (p = Math.PI * 2 + p), r && g > p && (g -= Math.PI * 2), !r && p > g && (p -= Math.PI * 2);
  }
  let b = p - g;
  if (Math.abs(b) > h) {
    const G = p, W = a, K = l;
    p = g + h * (r && p > g ? 1 : -1), a = y + e * Math.cos(p), l = m + i * Math.sin(p), u = rs(a, l, e, i, s, 0, r, W, K, [p, G, y, m]);
  }
  b = p - g;
  const w = Math.cos(g), v = Math.sin(g), _ = Math.cos(p), x = Math.sin(p), C = Math.tan(b / 4), R = 4 / 3 * e * C, B = 4 / 3 * i * C, I = [n, t], k = [n + R * v, t - B * w], Z = [a + R * x, l - B * _], H = [a, l];
  if (k[0] = 2 * I[0] - k[0], k[1] = 2 * I[1] - k[1], c)
    return [k[0], k[1], Z[0], Z[1], H[0], H[1]].concat(u);
  u = [k[0], k[1], Z[0], Z[1], H[0], H[1]].concat(u);
  const q = [];
  for (let G = 0; G < u.length; G++)
    q[G] = G % 2 ? ve(u[G - 1], u[G], d).y : ve(u[G], u[G + 1], d).x;
  return q;
}
function as(n) {
  const t = Ta(n), e = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }, i = (l, c, h) => {
    if (!l) return ["C", c.x, c.y, c.x, c.y, c.x, c.y];
    switch (l[0] !== "T" && l[0] !== "Q" && (c.qx = null, c.qy = null), l[0]) {
      case "M":
        c.X = l[1], c.Y = l[2];
        break;
      case "A":
        return ["C", ...rs(c.x, c.y, ...l.slice(1))];
      case "S": {
        let d, u;
        return h === "C" || h === "S" ? (d = c.x * 2 - c.bx, u = c.y * 2 - c.by) : (d = c.x, u = c.y), ["C", d, u, ...l.slice(1)];
      }
      case "T":
        return h === "Q" || h === "T" ? (c.qx = c.x * 2 - c.qx, c.qy = c.y * 2 - c.qy) : (c.qx = c.x, c.qy = c.y), ["C", ...Vn(c.x, c.y, c.qx, c.qy, l[1], l[2])];
      case "Q":
        return c.qx = l[1], c.qy = l[2], ["C", ...Vn(c.x, c.y, l[1], l[2], l[3], l[4])];
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
    r = "", t[l] && (r = t[l][0]), r !== "C" && (o[l] = r, l && (a = o[l - 1])), t[l] = i(t[l], e, a), o[l] !== "A" && r === "C" && (o[l] = "C"), s(t, l, o);
    const c = t[l], h = c.length;
    e.x = c[h - 2], e.y = c[h - 1], e.bx = parseFloat(c[h - 4]) || e.x, e.by = parseFloat(c[h - 3]) || e.y;
  }
  return t;
}
function Aa(n, t, e, i, s, o, r, a) {
  const l = (f, g, p, y, m) => {
    const b = 1 - f;
    return b * b * b * g + 3 * b * b * f * p + 3 * b * f * f * y + f * f * f * m;
  }, c = [n, r], h = [t, a], d = (f, g, p) => {
    const y = [];
    if (Math.abs(f) < 1e-12) {
      if (Math.abs(g) > 1e-12) {
        const m = -p / g;
        m > 0 && m < 1 && y.push(m);
      }
    } else {
      const m = g * g - 4 * f * p;
      if (m >= 0) {
        const b = Math.sqrt(m), w = (-g + b) / (2 * f), v = (-g - b) / (2 * f);
        w > 0 && w < 1 && y.push(w), v > 0 && v < 1 && y.push(v);
      }
    }
    return y;
  }, u = (f, g, p, y) => {
    const m = 3 * (y - 3 * p + 3 * g - f), b = 6 * (p - 2 * g + f), w = 3 * (g - f);
    return d(m, b, w);
  };
  return u(n, e, s, r).forEach((f) => c.push(l(f, n, e, s, r))), u(t, i, o, a).forEach((f) => h.push(l(f, t, i, o, a))), {
    min: { x: Math.min(...c), y: Math.min(...h) },
    max: { x: Math.max(...c), y: Math.max(...h) }
  };
}
function ls(n) {
  const t = as(n);
  if (!t.length)
    return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0, cx: 0, cy: 0 };
  let e = 0, i = 0;
  const s = [], o = [];
  for (const u of t)
    if (u[0] === "M")
      e = u[1], i = u[2], s.push(e), o.push(i);
    else {
      const f = Aa(e, i, ...u.slice(1));
      s.push(f.min.x, f.max.x), o.push(f.min.y, f.max.y), e = u[5], i = u[6];
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
class qn {
  constructor(t, e, i, s, o, r) {
    this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, t != null && (this.a = +t, this.b = +e, this.c = +i, this.d = +s, this.e = +o, this.f = +r);
  }
  add(t, e, i, s, o, r) {
    const a = [
      [this.a, this.c, this.e],
      [this.b, this.d, this.f],
      [0, 0, 1]
    ], l = [
      [t, i, o],
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
  scale(t, e, i, s) {
    e == null && (e = t), (i || s) && this.add(1, 0, 0, 1, i || 0, s || 0), this.add(t, 0, 0, e, 0, 0), (i || s) && this.add(1, 0, 0, 1, -(i || 0), -(s || 0));
  }
  rotate(t, e, i) {
    t = t * Math.PI / 180, e = e || 0, i = i || 0;
    const s = +Math.cos(t).toFixed(9), o = +Math.sin(t).toFixed(9);
    this.add(s, o, -o, s, e, i), this.add(1, 0, 0, 1, -e, -i);
  }
  x(t, e) {
    return t * this.a + e * this.c + this.e;
  }
  y(t, e) {
    return t * this.b + e * this.d + this.f;
  }
}
function Ra(n) {
  if (!n) return [];
  if (Array.isArray(n)) return n;
  const t = [];
  return String(n).replace(Ma, (e, i, s) => {
    const o = [];
    return s.replace(os, (r, a) => (a && o.push(+a), "")), t.push([i, ...o]), "";
  }), t;
}
function Na(n, t) {
  const e = Ra(n), i = new qn();
  for (const s of e) {
    const o = s.length, r = String(s[0]).toLowerCase(), a = s[0] !== r, l = a ? new qn() : null;
    if (r === "t" && o === 3)
      if (a) {
        const c = l.x(0, 0), h = l.y(0, 0);
        i.translate(s[1] - c, s[2] - h);
      } else
        i.translate(s[1], s[2]);
    else if (r === "r") {
      if (o === 2)
        i.rotate(s[1], t.x + t.width / 2, t.y + t.height / 2);
      else if (o === 4)
        if (a) {
          const c = l.x(s[2], s[3]), h = l.y(s[2], s[3]);
          i.rotate(s[1], c, h);
        } else
          i.rotate(s[1], s[2], s[3]);
    } else if (r === "s") {
      if (o === 2 || o === 3)
        i.scale(s[1], s[o - 1], t.x + t.width / 2, t.y + t.height / 2);
      else if (o === 4)
        if (a) {
          const c = l.x(s[2], s[3]), h = l.y(s[2], s[3]);
          i.scale(s[1], s[1], c, h);
        } else
          i.scale(s[1], s[1], s[2], s[3]);
      else if (o === 5)
        if (a) {
          const c = l.x(s[3], s[4]), h = l.y(s[3], s[4]);
          i.scale(s[1], s[2], c, h);
        } else
          i.scale(s[1], s[2], s[3], s[4]);
    } else r === "m" && o === 7 && i.add(s[1], s[2], s[3], s[4], s[5], s[6]);
  }
  return i;
}
function Da(n, t) {
  if (!t || !n) return n;
  const e = [];
  for (let i = 0; i < n.length; i++) {
    const s = n[i], o = [s[0]];
    for (let r = 1; r < s.length; r += 2) {
      const a = t.x(s[r], s[r + 1]), l = t.y(s[r], s[r + 1]);
      o[r] = a, o[r + 1] = l;
    }
    e.push(o);
  }
  return e;
}
function Pa(n, t) {
  const e = as(n), i = ls(e), s = Na(t, i);
  return Da(e, s).map((o) => o[0] + o.slice(1).join(",")).join("");
}
function Zt(n = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let i = 0; i < n; i++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function Ia(n) {
  function t(a) {
    return parseInt(a, 16) || 0;
  }
  function e(a) {
    const l = t(a) / 255;
    return l <= 0.03928 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4);
  }
  function i(a) {
    return 0.2126 * e(a.substr(1, 2)) + 0.7152 * e(a.substr(3, 2)) + 0.0722 * e(a.substr(-2));
  }
  function s(a, l) {
    const c = i(a), h = i(l);
    return (Math.max(c, h) + 0.05) / (Math.min(c, h) + 0.05);
  }
  const o = s(n || "#fff", "#ffffff"), r = s(n || "#fff", "#000000");
  return o > r ? "#ffffff" : "#000000";
}
function Oa(n, t = "normal 10pt Arial") {
  const e = String(n).split(`
`), i = t.split(" "), s = "normal", o = i?.[0]?.includes("pt") ? parseFloat(i?.[0]?.replace(/pt/gi, "")) : 10, r = i?.slice(1).join(" ").trim();
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
function za(n) {
  return n?.path ? ls(n.path) : { x: 0, y: 0, x2: 100, y2: 100, width: 100, height: 100, cx: 50, cy: 50 };
}
function La(n, t) {
  return Pa(n, t);
}
function Ba(n, t) {
  const e = String(n).split(/ /g), s = String(n).split("").length / t, o = [];
  let r = [], a = 0;
  return e.forEach((l) => {
    a += l.length, a < s || o.length === t - 1 ? r.push(l) : (o.push(r.join(" ")), a = l.length, r = [l]);
  }), r.length > 0 && o.push(r.join(" ")), o.join(`
`);
}
function Ga(n, t) {
  return Math.floor(Math.random() * (t - n + 1)) + n;
}
function Ha(n, t, e, i, s = !0) {
  if (!s)
    return { width: e, height: i };
  const o = Math.min(
    e / n,
    i / t
  );
  return {
    width: n * o,
    height: t * o
  };
}
function Ua(n) {
  const { buildNodeStyleFromTheme: t } = require("./core/Theme");
  return t(n.theme, n.childNumber);
}
function Fa(n) {
  return n.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
}
function Za(n) {
  return n instanceof HTMLElement || n instanceof SVGElement;
}
function Ya(n) {
  return typeof document > "u" ? null : document.getElementById(n);
}
function Xa() {
  return typeof navigator > "u" ? !1 : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function $a() {
  return typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function Wa(n) {
  n && (n.preventDefault(), n.stopPropagation());
}
function ja(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i += t)
    e.push(n.slice(i, i + t));
  return e;
}
const Va = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _transformPath: La,
  buildNodeStyleFromTheme: Ua,
  chunk: ja,
  createMultiLineText: Ba,
  el: Ya,
  getBBox: za,
  getTextWidth: Oa,
  guid: Zt,
  isElement: Za,
  isMobile: $a,
  isSafari: Xa,
  obtainProportionateWidthAndHeightForResizing: Ha,
  randomInt: Ga,
  safeForUrls: Fa,
  stopEvent: Wa,
  whiteOrBlack: Ia
}, Symbol.toStringTag, { value: "Module" }));
class cs {
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
    const i = t.ctrlKey || t.metaKey;
    switch (t.key) {
      case "Delete":
      case "Backspace":
        this.deleteSelected(t);
        break;
      case "z":
        i && t.shiftKey ? this.redo(t) : i && this.undo(t);
        break;
      case "y":
        i && this.redo(t);
        break;
      case "a":
        i && this.selectAll(t);
        break;
      case "c":
        i && this.copySelected(t);
        break;
      case "v":
        i && this.pasteClipboard(t);
        break;
      case "d":
        i && this.duplicateSelected(t);
        break;
      case "]":
        i && this.bringToFront(t);
        break;
      case "[":
        i && this.sendToBack(t);
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
      case "Enter":
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
      for (const i of [...e])
        i.options?.isComment && !this.slate.canRemoveComments?.() || this.slate.removeNode(i.id);
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
    e.length !== 0 && (t.preventDefault(), this.clipboard = e.map((i) => this.snapshotNode(i)), this.slate.announce?.(`Copied ${this.clipboard.length} node(s)`));
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
      for (const i of e) i.toFront?.();
    }
  }
  /** Ctrl/Cmd+[ — send the selected node(s) to the back of the z-order. */
  sendToBack(t) {
    const e = this.slate.getSelectedNodes?.() || [];
    if (e.length !== 0) {
      t.preventDefault();
      for (const i of e) i.toBack?.();
    }
  }
  /** Ctrl/Cmd+D — duplicate the current selection in place (offset). */
  duplicateSelected(t) {
    const e = this.slate.getSelectedNodes?.() || [];
    if (e.length === 0) return;
    t.preventDefault();
    const i = e.map((s) => this.snapshotNode(s));
    this.createCopies(i, 20);
  }
  /**
   * Create fresh nodes from option snapshots, offset by (offset,offset) and each
   * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
   * so copies persist + sync to collab peers like any other added node.
   */
  createCopies(t, e) {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const i = [];
    for (const s of t) {
      const o = { ...s };
      o.id = Zt(), o.x = (o.x || 0) + e, o.y = (o.y || 0) + e;
      try {
        const r = this.slate.addNode(o);
        r && i.push(r);
      } catch {
      }
    }
    if (i.length > 0) {
      const s = () => this.slate.selectNodes?.(i, !1), o = i.map((r) => r?.ready).filter(Boolean);
      o.length ? Promise.all(o).then(s).catch(s) : setTimeout(s, 120), this.slate.announce?.(`Pasted ${i.length} node(s)`);
    }
  }
  nudge(t, e, i) {
    const s = this.slate.getSelectedNodes();
    if (s.length !== 0) {
      i.preventDefault();
      for (const o of s) {
        const r = (o.options.x || 0) + t, a = (o.options.y || 0) + e;
        o.position(r, a);
      }
      this.nudgeTimer && clearTimeout(this.nudgeTimer), this.nudgeTimer = setTimeout(() => {
        this.nudgeTimer = null;
        const o = this.slate.getSelectedNodes?.() || [];
        o.length > 0 && this.slate.broadcast?.("onNodesMove", {
          nodeOptions: o.map((r) => yt(r.options))
        });
      }, 250);
    }
  }
  handleArrowKey(t) {
    if (this.slate.getSelectedNodes().length > 0) {
      const i = this.options.nudgeDistance;
      switch (t.key) {
        case "ArrowUp":
          this.nudge(0, -i, t);
          break;
        case "ArrowDown":
          this.nudge(0, i, t);
          break;
        case "ArrowLeft":
          this.nudge(-i, 0, t);
          break;
        case "ArrowRight":
          this.nudge(i, 0, t);
          break;
      }
    } else {
      const i = this.slate.getAllNodes();
      if (i.length === 0) return;
      const s = document.activeElement, o = i.findIndex((a) => a.svgGroup?.node === s);
      let r = o;
      t.key === "ArrowRight" || t.key === "ArrowDown" ? r = o < 0 ? 0 : Math.min(o + 1, i.length - 1) : r = o < 0 ? i.length - 1 : Math.max(o - 1, 0), r >= 0 && r < i.length && (t.preventDefault(), i[r].svgGroup?.node?.focus());
    }
  }
  selectFocused(t) {
    const e = document.activeElement, s = this.slate.getAllNodes().find((o) => o.svgGroup?.node === e);
    s && (t.preventDefault(), this.slate.selectNodes([s], !1));
  }
}
class hs {
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
    const i = document.createElement("div");
    i.className = "sb-context-menu", i.style.cssText = "position:fixed;z-index:100000;background:#fff;border:1px solid #e3e5ea;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,0.18);padding:4px 0;min-width:180px;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#222;user-select:none;", i.style.left = `${t}px`, i.style.top = `${e}px`, this.targetNodes = [...this.slate.getSelectedNodes?.() || []];
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
        c.style.cssText = "height:1px;background:#e3e5ea;margin:4px 0;", i.appendChild(c);
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
      }), i.appendChild(l);
    }
    document.body.appendChild(i), this.el = i;
    const r = i.getBoundingClientRect();
    r.right > window.innerWidth && (i.style.left = `${Math.max(4, window.innerWidth - r.width - 8)}px`), r.bottom > window.innerHeight && (i.style.top = `${Math.max(4, window.innerHeight - r.height - 8)}px`), this.boundDismiss = (a) => {
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
      let i;
      try {
        i = JSON.parse(JSON.stringify(e.options || {}));
      } catch {
        i = { ...e.options || {} };
      }
      i.id = Zt(), i.x = (i.x || 0) + 20, i.y = (i.y || 0) + 20, delete i.parentArrowForChildren, delete i.noChildArrowForChildren, delete i.associations;
      try {
        const s = this.slate.addNode?.(i);
        s && t.push(s);
      } catch {
      }
    }
    t.length > 0 && setTimeout(() => this.slate.selectNodes?.(t, !1), 100);
  }
}
function Nn(n, t = {}, e) {
  const i = n.canvas;
  if (!i) {
    const s = "";
    return e?.(s), s;
  }
  try {
    const s = i.node.cloneNode(!0), o = [
      ".svg_select_handle",
      ".svg_select_handle_rot",
      ".svg_select_boundingRect",
      ".connection-handle",
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
async function ds(n, t = {}, e) {
  const i = Nn(n, t);
  if (!i) {
    const o = t.asBinary ? new Blob() : "";
    return e?.(o), o;
  }
  const s = t.scale || 2;
  try {
    const r = n.canvas.viewbox(), a = r.width * s, l = r.height * s, c = document.createElement("canvas");
    c.width = a, c.height = l;
    const h = c.getContext("2d");
    t.alpha || (h.fillStyle = n.options.containerStyle?.backgroundColor || "#ffffff", h.fillRect(0, 0, a, l));
    const d = new Image(), u = new Blob([i], {
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
const qa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPNG: ds,
  exportSVG: Nn
}, Symbol.toStringTag, { value: "Module" }));
class us {
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
      ), i = this.options.WebsocketProvider || (await import(
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
      }), this.provider = new i(
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
      const i = e;
      i.code === "MODULE_NOT_FOUND" || i.message?.includes("Cannot find module") ? console.warn(
        "COLLAB_DEBUG: yjs/y-websocket not installed. Collaboration disabled.",
        "Install with: npm install yjs y-websocket"
      ) : console.error("COLLAB_DEBUG: Failed to initialize collaboration:", i);
    }
  }
  /**
   * Execute collab packages locally (from Invoker).
   */
  invoke(t) {
    const e = Array.isArray(t) ? t : [t];
    for (const i of e)
      this.exe(i);
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
      for (const i of e) {
        const s = `${i.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        if (i.type === "onLinePropertiesChanged" && this.pruneSupersededLineProperty(i.data), this.collabMap.set(s, {
          ...i,
          clientID: this.clientID,
          timestamp: Date.now()
        }), i.type === "onNodeDeleted") {
          const o = i.data?.id;
          o != null && this.pruneNodePackages(o);
        }
      }
    else
      console.log(
        "COLLAB_DEBUG: send() before collab init — emitting locally only"
      );
    for (const i of e)
      this.slate.emitSlateChange?.(i.type, i.data);
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
        this.collabMap.forEach((i, s) => {
          const o = i?.data;
          (o && !Array.isArray(o) ? o.id : void 0) === t && i?.type !== "onNodeDeleted" && e.push(s);
        });
        for (const i of e) this.collabMap.delete(i);
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
    const { id: e, associationId: i, prop: s } = t;
    if (s != null)
      try {
        const o = [];
        this.collabMap.forEach((r, a) => {
          if (r?.type !== "onLinePropertiesChanged") return;
          const l = r?.data;
          !l || Array.isArray(l) || l.id === e && l.associationId === i && l.prop === s && o.push(a);
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
    const i = t.type;
    if (typeof e[i] == "function") {
      this.slate.beginRemoteApply?.();
      try {
        e[i](t);
      } finally {
        this.slate.endRemoteApply?.();
      }
    } else
      console.warn("COLLAB_DEBUG: Unknown collab type:", i);
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
    this._cursorMoveHandler = (i) => {
      const s = typeof performance < "u" ? performance.now() : +/* @__PURE__ */ new Date();
      if (!(s - e < 40)) {
        e = s;
        try {
          const o = this.slate.canvas.point(i.clientX, i.clientY);
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
    const e = new Set(t.map((i) => i.clientID));
    for (const [i, s] of this.cursorElements)
      if (!e.has(i)) {
        try {
          s.remove();
        } catch {
        }
        this.cursorElements.delete(i);
      }
    for (const i of t)
      i.cursor && this.renderCursor(i);
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
      const i = e.group(), s = t.userName || "Anonymous", o = i.text(s).font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" }).fill(t.color);
      let r = 60, a = 16;
      try {
        const d = o.bbox();
        d && d.width && (r = d.width, a = d.height);
      } catch {
      }
      const l = 8, c = 4;
      i.rect(r + l * 2, a + c * 2).radius(6).fill("#fff").stroke({ color: t.color, width: 1 }).back(), o.move(l, c), i.transform({ translateX: 16, translateY: 6 }), e.attr("pointer-events", "none"), this.cursorElements.set(t.clientID, e);
    }
    e.transform({ translateX: t.cursor.x, translateY: t.cursor.y });
  }
  /**
   * Get all connected collaboration users.
   */
  getCollabUsers() {
    if (!this.awareness) return [];
    const t = [];
    return this.awareness.getStates().forEach((i, s) => {
      s !== this.clientID && t.push({
        clientID: s,
        userName: i.user?.name || "Anonymous",
        color: i.user?.color || "#999",
        cursor: i.cursor
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
function fs(n, t, e = !1, i = !1) {
  if (!t) return;
  t._id && (n.options.themeId = t._id), e && (n.options.syncWithTheme = !0), t.containerStyle?.backgroundColor && (n.options.containerStyle = n.options.containerStyle || {}, n.options.containerStyle.backgroundColor = t.containerStyle.backgroundColor, n.applyContainerStyle?.()), t.defaultLineColor && (n.options.defaultLineColor = t.defaultLineColor);
  const s = n.nodes.allNodes;
  !s || s.length === 0 || !t.styles || (s.forEach((o, r) => {
    const a = ps(t, r);
    a && Ka(o, a);
  }), console.log("THEME_DEBUG: Applied theme", t.name || t._id));
}
function ps(n, t) {
  if (!n.styles) return null;
  if (t === 0 && n.styles.parent)
    return n.styles.parent;
  const e = Object.keys(n.styles).filter(
    (o) => o.startsWith("child_")
  );
  if (e.length === 0)
    return n.styles.parent || null;
  const s = `child_${(t - 1) % e.length + 1}`;
  return n.styles[s] || n.styles.parent || null;
}
function Ka(n, t) {
  const e = t, i = t.backgroundColor ?? e.nodeColor, s = t.fontColor ?? e.foregroundColor;
  i && (n.options.backgroundColor = i), t.borderColor && (n.options.borderColor = t.borderColor), t.borderWidth !== void 0 && (n.options.borderWidth = t.borderWidth), s && (n.options.fontColor = s), t.fontFamily && (n.options.fontFamily = t.fontFamily), t.fontSize !== void 0 && (n.options.fontSize = t.fontSize), t.lineColor && (n.options.lineColor = t.lineColor), t.opacity !== void 0 && (n.options.opacity = t.opacity), n.setColors?.(i, t.borderColor), n.textElement && (s || t.fontSize || t.fontFamily) && n.textElement.font({
    fill: s || n.options.fontColor,
    size: t.fontSize || n.options.fontSize,
    family: t.fontFamily || n.options.fontFamily
  });
}
const Qa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTheme: fs,
  buildNodeStyleFromTheme: ps
}, Symbol.toStringTag, { value: "Module" }));
function gs(n, t = !1, e = 20) {
  const i = n.nodes.allNodes;
  if (i.length < 2) return;
  const s = 100;
  let o = !0, r = 0;
  for (; o && r < s; ) {
    o = !1, r++;
    for (let a = 0; a < i.length; a++)
      for (let l = a + 1; l < i.length; l++) {
        const c = i[a], h = i[l], d = c.options.x || 0, u = c.options.y || 0, f = c.options.width || 100, g = c.options.height || 60, p = h.options.x || 0, y = h.options.y || 0, m = h.options.width || 100, b = h.options.height || 60, w = d < p + m + e && d + f + e > p, v = u < y + b + e && u + g + e > y;
        if (w && v) {
          o = !0;
          const _ = d + f / 2 - (p + m / 2), x = u + g / 2 - (y + b / 2), C = Math.sqrt(_ * _ + x * x) || 1, R = _ / C * (e / 2), B = x / C * (e / 2);
          c.position(d + R, u + B), h.position(p - R, y - B);
        }
      }
  }
  if (t) {
    const a = i.reduce((c, h) => c + (h.options.x || 0), 0) / i.length, l = i.reduce((c, h) => c + (h.options.y || 0), 0) / i.length;
    for (const c of i) {
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
function ms(n, t, e, i = !1) {
  const s = i ? 0 : 500;
  let o = 0;
  for (const r of t) {
    const a = n.nodes.one(r.id);
    a ? a.position(r.x, r.y, () => {
      o++, o >= t.length && e && e();
    }, void 0, s) : o++;
  }
  t.length === 0 && e && e();
}
function ys(n) {
  return n.nodes.allNodes.map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
const Ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyLayout: ms,
  packageLayout: ys,
  removeLayoutOverlaps: gs
}, Symbol.toStringTag, { value: "Module" }));
class bs {
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
      const s = parseFloat(this.slider.value);
      this.slate.zoom?.(s), this.update();
    }, this.container.appendChild(this.slider);
    const i = document.createElement("button");
    i.textContent = "+", i.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;", i.onclick = () => this.slate.zoomIn?.(), this.container.appendChild(i), this.label = document.createElement("span"), this.label.textContent = "100%", this.label.style.cssText = "min-width: 40px; text-align: right;", this.container.appendChild(this.label), this.slate.element.appendChild(this.container), this._intervalId = setInterval(() => this.update(), 500);
  }
}
class ws {
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
      const i = new Set(t.nodeIds);
      e = e.filter((s) => i.has(s.id));
    }
    return e.sort((i, s) => {
      const o = i.options._presentationIndex, r = s.options._presentationIndex;
      if (o !== void 0 && r !== void 0) return o - r;
      const a = (i.options.y || 0) - (s.options.y || 0);
      return Math.abs(a) > 30 ? a : (i.options.x || 0) - (s.options.x || 0);
    }), this.steps = e.map((i, s) => ({
      nodeId: i.id,
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
    let i = 1 / 0, s = 1 / 0, o = -1 / 0, r = -1 / 0;
    e.forEach((g) => {
      const p = g.options || {};
      i = Math.min(i, p.x || 0), s = Math.min(s, p.y || 0), o = Math.max(o, (p.x || 0) + (p.width || 0)), r = Math.max(r, (p.y || 0) + (p.height || 0));
    }), isFinite(i) || (i = 0, s = 0, o = 0, r = 0);
    const a = { left: i, top: s, width: o - i, height: r - s }, l = new Map(e.map((g) => [g.id, g])), c = (g) => (g.relationships?.associations || []).map((p) => p.childId).filter((p) => l.has(p)), h = (g) => e.some(
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
    const e = this.slate.nodes?.allNodes || [], i = new Set(e.map((r) => r.id)), s = /* @__PURE__ */ new Set(), o = [];
    return (t || []).forEach((r) => {
      i.has(r) && !s.has(r) && (s.add(r), o.push(r));
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
    const i = this.steps[t], s = this.slate.nodes.one(i.nodeId);
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
  animateViewbox(t, e, i) {
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
    if (!i || i <= 0 || typeof requestAnimationFrame > "u") {
      o(e.x, e.y, e.width, e.height);
      return;
    }
    const r = (c) => c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
    let a = null;
    const l = (c) => {
      a === null && (a = c);
      const h = Math.min(1, (c - a) / i), d = r(h);
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
const ke = class ke {
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
      const i = document.querySelector(t);
      if (!i)
        throw new Error(`Element with selector "${t}" not found`);
      this.element = i;
    } else
      this.element = t;
    if (typeof window < "u") {
      const i = window;
      i.__slateboxInstances = i.__slateboxInstances || [], i.__slateboxInstances.push(this);
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
    return { availableFilters: $i() };
  }
  init() {
    this.canvas = De().addTo(this.element), this.canvas.node.setAttribute("role", "img"), this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas"), this.canvas.node.setAttribute("tabindex", "0"), this._liveRegion = document.createElement("div"), this._liveRegion.setAttribute("aria-live", "polite"), this._liveRegion.setAttribute("aria-atomic", "true"), this._liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;", this.element.appendChild(this._liveRegion), this.element.style.overflow = this.element.style.overflow || "hidden", getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative");
    const t = this.canvas.node;
    t?.style && (t.style.width = "100%", t.style.height = "100%", t.style.display = "block"), t?.removeAttribute?.("width"), t?.removeAttribute?.("height"), t?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");
    const e = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    const i = this.options.viewPort.originalWidth || Math.round(e.width) || 800, s = this.options.viewPort.originalHeight || Math.round(e.height) || 600;
    this.options.viewPort.originalWidth = i, this.options.viewPort.originalHeight = s;
    const o = this.options.viewPort.left ?? 0, r = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(o, r, i, s), this._setupResizeObserver(), this.nodes = new va(this), this.invoker = new xa(this), this.applyContainerStyle(), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new Ki(this, this.options.panZoom), this.birdsEye = new Qi(this, this.options.birdsEye), this.options.birdsEye?.enabled && (this._birdsEyeTimeoutId = setTimeout(() => {
      this._destroyed || this.birdsEye.enable();
    }, 200)), this.undoRedo = new ns(this, {
      enabled: this.options.showUndoRedo !== !1
    }), this.undoRedo.snap?.(!0), this.multiSelection = new is(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new ss(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20
    }), this.options.viewPort?.showGrid && this.grid.show(), this.keyboard = new cs(this), this.options.enabled !== !1 && this.keyboard.bindGlobal(), this.contextMenu = new hs(this), this.options.enabled !== !1 && this.contextMenu.enable(), this.collab = new us(this), this.zoomSlider = new bs(this, {
      enabled: this.options.showZoom || !1
    }), this.presentation = new ws(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && (this._coordDisplayTimeoutId = setTimeout(() => {
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
        (i) => i !== this
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
    const i = this.options.events?.onSlateChanged;
    if (!i) return;
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
      i(s, o)?.catch?.(
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
    this._applyingRemote || this._destroyed || (typeof this.collab?.send == "function" ? this.collab.send({ type: t, data: e }) : this.emitSlateChange(t, e), this.undoRedo && !ke.NON_UNDOABLE.has(t) && this.undoRedo.snap?.());
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
      const i = t.backgroundGradientColors.join(", ");
      e.style.backgroundImage = t.backgroundGradientType === "radial" ? `radial-gradient(circle, ${i})` : `linear-gradient(${i})`;
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
    const i = this.options.panZoom.onPanEnd;
    this.options.panZoom.onPanEnd = (s) => {
      i && i(s);
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
      let e = { x: 0, y: 0 }, i = 1;
      if (this.panZoom && this.panZoom.isInitialized())
        e = this.getPan(), i = this.getZoom(), console.log(
          "COORD_DEBUG: Got values from panZoom - pan:",
          e,
          "zoom:",
          i
        );
      else {
        const o = this.canvas.viewbox();
        e = { x: o.x, y: o.y }, i = (this.element.getBoundingClientRect().width || o.width) / o.width || 1, console.log(
          "COORD_DEBUG: Got fallback values from viewBox - pan:",
          e,
          "zoom:",
          i
        );
      }
      const s = `x: ${Math.round(e.x)}, y: ${Math.round(
        e.y
      )}, zoom: ${i.toFixed(2)}`;
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
      nodeOptions: yt(e.options)
    }), e;
  }
  /** Remove a node by ID. */
  removeNode(t) {
    const e = this.nodes.one(t), i = e?.options?.text || "(unnamed)", s = !!e?.options?.isComment, o = this.nodes.remove(t);
    return this.notifyNodeChanged(), this.announce(`Node removed: ${i}`), o && this.broadcast("onNodeDeleted", { id: t, isComment: s }), o;
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
      const i = this.element.getBoundingClientRect(), s = Math.max(1, Math.round(i.width)), o = Math.max(1, Math.round(i.height));
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
    let i = e.width ?? e.originalWidth ?? 800, s = e.height ?? e.originalHeight ?? 600, o = 0, r = 0, a = "landscape";
    if (t.length > 0) {
      let c = 1 / 0, h = 1 / 0, d = -1 / 0, u = -1 / 0;
      t.forEach((f) => {
        const g = f.options.x ?? 0, p = f.options.y ?? 0, y = f.options.width ?? 0, m = f.options.height ?? 0;
        c = Math.min(c, g - 10), h = Math.min(h, p - 10), d = Math.max(d, g + y + 10), u = Math.max(u, p + m + 10);
      }), o = Math.abs(c), r = Math.abs(h), i = d - c, s = u - h, s > i && (a = "portrait");
    }
    return { orientation: a, width: i, height: s, left: o, top: r };
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
    const i = this.selectedNodes.length;
    i === 0 ? this.announce("No nodes selected") : i === 1 ? this.announce(`Node selected: ${this.selectedNodes[0].options.text || "(unnamed)"}`) : this.announce(`${i} nodes selected`), i > 1 && (this._hadGroupSelection = !0, this.options.events?.onGroupSelection?.(this.selectedNodes.slice()));
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
    this.groupResizeRotate = this.canvas.group();
    const e = this.groupResizeRotate.rect(t.width, t.height).move(t.x, t.y).fill("transparent").stroke({ color: "#4a90e2", width: 2, dasharray: "5,5" });
    typeof e.select == "function" ? (e.select({
      createHandle: this.createGroupHandle.bind(this),
      updateHandle: this.updateGroupHandle.bind(this)
    }), e.on("resize", this.handleGroupResize.bind(this)), e.on("rotate", this.handleGroupRotate.bind(this))) : console.warn("svg.select.js not available for group resize/rotate");
  }
  calculateGroupBoundingBox() {
    if (this.selectedNodes.length === 0)
      return { x: 0, y: 0, width: 100, height: 100 };
    let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
    return this.selectedNodes.forEach((o) => {
      const r = o.svgGroup.bbox();
      t = Math.min(t, r.x), e = Math.min(e, r.y), i = Math.max(i, r.x + r.width), s = Math.max(s, r.y + r.height);
    }), {
      x: t,
      y: e,
      width: i - t,
      height: s - e
    };
  }
  createGroupHandle(t, e, i, s) {
    t.circle(8).fill("#4a90e2").stroke("#ffffff").attr("stroke-width", 2);
  }
  updateGroupHandle(t, e, i, s) {
    t.center(e[0], e[1]);
  }
  handleGroupResize(t) {
    console.log("SELECTION_DEBUG: Group resize event", t);
    const { box: e } = t.detail, i = this.calculateGroupBoundingBox(), s = e.width / i.width, o = e.height / i.height;
    this.selectedNodes.forEach((r) => {
      const a = r.svgGroup.bbox(), l = (a.x - i.x) * s, c = (a.y - i.y) * o, h = a.width * s, d = a.height * o;
      r.setSize(h, d), r.position(e.x + l, e.y + c);
    });
  }
  handleGroupRotate(t) {
    console.log("SELECTION_DEBUG: Group rotate event", t);
    const { angle: e } = t.detail, i = this.calculateGroupBoundingBox();
    i.x + i.width / 2, i.y + i.height / 2, this.selectedNodes.forEach((s) => {
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
        this._activeLineConnectable.deselectConnector?.();
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
    const i = e || this.getSelectedNodes();
    if (!i || i.length < 2) return;
    const s = i.map((d) => ({
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
      nodeOptions: i.map((d) => yt(d.options))
    });
  }
  /**
   * Evenly distribute the selected (or given) nodes along an axis so the gaps
   * between them are equal; the outermost two stay put. axis: horizontal |
   * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
   */
  distributeNodes(t, e) {
    const i = e || this.getSelectedNodes();
    if (!i || i.length < 3) return;
    const s = i.map((o) => ({
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
      nodeOptions: i.map((o) => yt(o.options))
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
    const i = Oe(this, t, e);
    return JSON.stringify(i);
  }
  /**
   * Load a v1-compatible JSON string or object into this slate.
   *
   * @param json - JSON string or SlateJSON object
   * @param preserve - If true, merge with existing nodes instead of replacing
   * @param skipZoom - If true, don't adjust zoom/pan after load
   * @param useMainCanvas - Reserved for future use
   */
  async loadJSON(t, e = !1, i = !1, s) {
    await Rn(t, this, e, i), this.undoRedo?.clear?.(), this.undoRedo?.snap?.(!0);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return es(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return Nn(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return ds(this, t, e);
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
  applyTheme(t, e, i) {
    fs(this, t, e, i);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  removeLayoutOverlaps(t, e) {
    gs(this, t, e);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, i) {
    ms(this, t, e, i);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return ys(this);
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
    await Fi(this);
  }
};
ke.NON_UNDOABLE = /* @__PURE__ */ new Set([
  "onZoom",
  "onCanvasMove",
  "onFollowMeChanged",
  "onSlateFollowMeChanged",
  "onSlateHuddleChanged",
  "onCursorMoved",
  "onPresenceChanged",
  "onSlateChanged"
]);
let le = ke;
function tl(n, t) {
  return n.addNode({
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
function el(n, t) {
  const e = n.nodes.one(t);
  return !e || !e.options.isComment ? !1 : n.removeNode(t);
}
function nl(n) {
  return n.nodes.allNodes.filter(
    (t) => t.options.isComment === !0
  );
}
const il = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComment: tl,
  getComments: nl,
  removeComment: el
}, Symbol.toStringTag, { value: "Module" }));
class Ht {
  constructor(t = {}) {
    this.options = { id: Zt(), ...t }, this.resize = new sl(this), this.relationships = new ol(this);
  }
  /**
   * v1: `node.png(withNodes?, cb)` — export this node (or the given group of
   * node ids) as a transparent-background PNG blob.
   */
  png(t, e) {
    const i = typeof t == "function" ? t : e, s = Array.isArray(t) ? t : void 0, o = this.v2;
    if (!o || !i) return;
    const r = s && s.length > 0 ? s : [o.id];
    o.slate.png(
      { nodes: r, noBackground: !0, asBinary: !0 },
      (a) => i(a)
    );
  }
  /** v1: `node.svg(withNodes?, cb)` — same as png but returns the SVG string. */
  svg(t, e) {
    const i = typeof t == "function" ? t : e, s = Array.isArray(t) ? t : void 0, o = this.v2;
    if (!o || !i) return;
    const r = s && s.length > 0 ? s : [o.id];
    o.slate.svg(
      { nodes: r, noBackground: !0 },
      (a) => i(a)
    );
  }
  /**
   * v1 API: position the node. `position('center')` centers it in the current
   * viewport (used right after adding a node from the shape palette);
   * `position({x, y})` / `position(x, y)` sets an explicit position. Before the
   * node is added (no v2 yet) this just stashes coordinates on options.
   */
  position(t, e) {
    const i = this.v2, s = t && typeof t == "object" ? { x: t.x, y: t.y } : typeof t == "number" ? { x: t, y: e } : null;
    if (!i)
      return s && (this.options.x = s.x, this.options.y = s.y), this;
    if (s && s.x != null && s.y != null)
      return i.position(s.x, s.y), this;
    try {
      const r = i.slate?.canvas?.node?.getAttribute?.("viewBox");
      if (r) {
        const a = String(r).split(/[\s,]+/).map(Number);
        if (a.length === 4 && a.every((l) => !isNaN(l))) {
          const l = a[0] + a[2] / 2, c = a[1] + a[3] / 2, h = i.options.width || 0, d = i.options.height || 0;
          i.position(l - h / 2, c - d / 2);
        }
      }
    } catch {
    }
    return this;
  }
}
class sl {
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
class ol {
  constructor(t) {
    this.owner = t;
  }
  /** v1: `node.relationships.addAssociation(childNode, data?)` */
  addAssociation(t, e) {
    if (!this.owner.v2)
      throw new Error(
        "SLATEBOX_COMPAT: add the node to a slate before creating associations"
      );
    const i = t instanceof Ht ? t.v2 : t;
    if (!i)
      throw new Error(
        "SLATEBOX_COMPAT: child node must be added to the slate first"
      );
    return this.owner.v2.relationships?.addAssociation(i, e);
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
class rl {
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
    const e = t instanceof Ht ? t : new Ht(t), i = qt(e.options), s = this.v2Slate.addNode(i);
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
    const e = this.v2Slate.nodes.allNodes, i = [], s = {}, o = {};
    return e.forEach((r) => {
      const a = r.options || {}, l = yt(a);
      (r.relationships?.getAssociations?.() ?? []).forEach((h) => {
        i.push({
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
      associations: i,
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
    const i = this.v2Slate, s = t?.exportNodes || {}, o = typeof e == "function" ? e : void 0, r = typeof e == "object" ? e : {}, a = Object.keys(s).filter((l) => i.nodes.one(l)).map((l) => ({
      id: l,
      x: parseFloat(s[l].x),
      y: parseFloat(s[l].y)
    }));
    i.applyLayout(a, o), r.skipCenter || i.centerContent();
  }
  /**
   * v1: `slate.nodes.nodeMovePackage({dur, moves: [{id, x: dx, y: dy}]})` —
   * moves are RELATIVE deltas; the returned package carries the resulting
   * ABSOLUTE positions in v1 shape, ready for `collab.exe({type:'onNodesMove'})`.
   */
  nodeMovePackage(t = {}) {
    const e = this.v2Slate, i = new Map(
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
        const r = i.get(o.id), a = yt(o.options || {});
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
class al {
  constructor(t = {}, e = {}) {
    this.savingTemplateImage = !1, this.options = {
      ...t,
      id: t.id || Zt()
    }, this.events = e || {}, this._shareId = this.options.shareId || Zt(), this.nodes = new rl(this), this.controller = {
      scaleToFitAndCenter: (i) => {
        this.assertReady(), this.v2.fitToContent(), i?.();
      }
    }, this.canvas = {
      hideBg: () => {
        this.assertReady();
        const i = this.v2.element;
        i && (i.style.backgroundColor = "transparent", i.style.backgroundImage = "none");
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
      const i = document.querySelector(t);
      if (i) return i;
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
    const i = {
      ...this.options.viewPort.zoom || {}
    };
    if (Object.defineProperty(i, "r", {
      enumerable: !0,
      get: () => {
        try {
          return this.v2?.getZoom() || 1;
        } catch {
          return 1;
        }
      }
    }), this.options.viewPort.zoom = i, (this.options.allowCollaboration ?? !0) && this.events.onInitCollaboration) {
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
      availableFilters: $i()
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
  disable(t, e, i) {
    this.assertReady();
    const s = this.v2;
    e || s.nodes.allNodes.forEach((o) => o.lock?.()), t || (this.options.enabled = !1, this.options.allowDrag = !1, s.disablePanZoom?.(), i && (s.birdsEye?.disable?.(), s.zoomSlider?.disable?.()));
  }
  /** v1: `slate.enable(exemptSlate?, exemptNodes?)` — reverse of disable() */
  enable(t, e) {
    this.assertReady();
    const i = this.v2;
    e || i.nodes.allNodes.forEach((s) => {
      s.options?.isLocked || s.unlock?.();
    }), t || (this.options.enabled = !0, this.options.allowDrag = !0, i.enablePanZoom?.());
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
    const e = this.constructor.name, i = Et.availablePlugins[e];
    i && i.forEach(({ name: s, plugin: o }) => {
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
let ln = Et;
const ll = {
  slate: al,
  node: Ht,
  base: ln,
  utils: Va
};
function cl(n, t = {}) {
  return new le(n, t);
}
typeof window < "u" && (window.SlateboxJS = cl, window.Slate = le, window.Node = Ie, window.PanZoom = Ki, window.ResizeRotate = Gi, window.BirdsEye = Qi, window.Connector = Pe, window.Serialization = Ea, window.ShapeRegistry = ga, window.Relationship = la, window.Relationships = Hi, window.FontLoader = da, window.Images = Ui, window.Editor = Zi, window.UndoRedo = ns, window.MultiSelection = is, window.Grid = ss, window.Menu = Wi, window.Keyboard = cs, window.ContextMenu = hs, window.Filters = Xi, window.Links = Yi, window.Export = qa, window.Collab = us, window.Theme = Qa, window.Layout = Ja, window.ZoomSlider = bs, window.Comments = il, window.Presentation = ws, window.Slatebox = Object.assign({}, ll, { compat: wa }));
export {
  Qi as BirdsEye,
  us as Collab,
  il as Comments,
  Pe as Connector,
  hs as ContextMenu,
  Zi as Editor,
  qa as ExportModule,
  Xi as Filters,
  da as FontLoader,
  ss as Grid,
  Ui as Images,
  xa as Invoker,
  cs as Keyboard,
  Ja as Layout,
  Yi as Links,
  Wi as Menu,
  is as MultiSelection,
  Ie as Node,
  va as NodesManager,
  Ki as PanZoom,
  ws as Presentation,
  la as Relationship,
  Hi as Relationships,
  Gi as ResizeRotate,
  Ea as Serialization,
  ga as ShapeRegistry,
  le as Slate,
  ll as Slatebox,
  cl as SlateboxJS,
  Qa as Theme,
  ns as UndoRedo,
  bs as ZoomSlider,
  wa as compat,
  cl as default,
  fl as getFilterNames,
  ul as registerFilter,
  Va as utils
};
//# sourceMappingURL=slateboxjs.es.js.map
