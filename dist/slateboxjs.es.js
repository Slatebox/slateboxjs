const Pt = {}, ge = [];
function p(n, t) {
  if (Array.isArray(n)) {
    for (const e of n)
      p(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n)
      p(e, n[e]);
    return;
  }
  ye(Object.getOwnPropertyNames(t)), Pt[n] = Object.assign(Pt[n] || {}, t);
}
function E(n) {
  return Pt[n] || {};
}
function Qe() {
  return [...new Set(ge)];
}
function ye(n) {
  ge.push(...n);
}
function Wt(n, t) {
  let e;
  const s = n.length, i = [];
  for (e = 0; e < s; e++)
    i.push(t(n[e]));
  return i;
}
function Je(n, t) {
  let e;
  const s = n.length, i = [];
  for (e = 0; e < s; e++)
    t(n[e]) && i.push(n[e]);
  return i;
}
function Et(n) {
  return n % 360 * Math.PI / 180;
}
function Ze(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function we(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function st(n, t, e, s) {
  return (t == null || e == null) && (s = s || n.bbox(), t == null ? t = s.width / s.height * e : e == null && (e = s.height / s.width * t)), {
    width: t,
    height: e
  };
}
function Lt(n, t) {
  const e = n.origin;
  let s = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", i = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([s, i] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const r = typeof s == "string", a = typeof i == "string";
  if (r || a) {
    const { height: o, width: h, x: u, y: l } = t.bbox();
    r && (s = s.includes("left") ? u : s.includes("right") ? u + h : u + h / 2), a && (i = i.includes("top") ? l : i.includes("bottom") ? l + o : l + o / 2);
  }
  return [s, i];
}
const Ke = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), Ft = (n) => Ke.has(n.nodeName), be = (n, t, e = {}) => {
  const s = { ...t };
  for (const i in s)
    s[i].valueOf() === e[i] && delete s[i];
  Object.keys(s).length ? n.node.setAttribute("data-svgjs", JSON.stringify(s)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, Vt = "http://www.w3.org/2000/svg", tn = "http://www.w3.org/1999/xhtml", It = "http://www.w3.org/2000/xmlns/", dt = "http://www.w3.org/1999/xlink", g = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function en() {
  return g.window;
}
class Qt {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}
const Q = {}, Jt = "___SYMBOL___ROOT___";
function ht(n, t = Vt) {
  return g.document.createElementNS(t, n);
}
function O(n, t = !1) {
  if (n instanceof Qt) return n;
  if (typeof n == "object")
    return zt(n);
  if (n == null)
    return new Q[Jt]();
  if (typeof n == "string" && n.charAt(0) !== "<")
    return zt(g.document.querySelector(n));
  const e = t ? g.document.createElement("div") : ht("svg");
  return e.innerHTML = n, n = zt(e.firstChild), e.removeChild(e.firstChild), n;
}
function S(n, t) {
  return t && (t instanceof g.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : ht(n);
}
function D(n) {
  if (!n) return null;
  if (n.instance instanceof Qt) return n.instance;
  if (n.nodeName === "#document-fragment")
    return new Q.Fragment(n);
  let t = we(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : Q[t] || (t = "Dom"), new Q[t](n);
}
let zt = D;
function y(n, t = n.name, e = !1) {
  return Q[t] = n, e && (Q[Jt] = n), ye(Object.getOwnPropertyNames(n.prototype)), n;
}
function nn(n) {
  return Q[n];
}
let sn = 1e3;
function xe(n) {
  return "Svgjs" + we(n) + sn++;
}
function _e(n) {
  for (let t = n.children.length - 1; t >= 0; t--)
    _e(n.children[t]);
  return n.id && (n.id = xe(n.nodeName)), n;
}
function m(n, t) {
  let e, s;
  for (n = Array.isArray(n) ? n : [n], s = n.length - 1; s >= 0; s--)
    for (e in t)
      n[s].prototype[e] = t[e];
}
function v(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function rn() {
  return this.parent().children();
}
function on() {
  return this.parent().index(this);
}
function an() {
  return this.siblings()[this.position() + 1];
}
function hn() {
  return this.siblings()[this.position() - 1];
}
function un() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function ln() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function cn() {
  return this.parent().add(this.remove()), this;
}
function fn() {
  return this.parent().add(this.remove(), 0), this;
}
function dn(n) {
  n = O(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function pn(n) {
  n = O(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function mn(n) {
  return n = O(n), n.before(this), this;
}
function gn(n) {
  return n = O(n), n.after(this), this;
}
p("Dom", {
  siblings: rn,
  position: on,
  next: an,
  prev: hn,
  forward: un,
  backward: ln,
  front: cn,
  back: fn,
  before: dn,
  after: pn,
  insertBefore: mn,
  insertAfter: gn
});
const ve = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, yn = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, wn = /rgb\((\d+),(\d+),(\d+)\)/, bn = /(#[a-z_][a-z0-9\-_]*)/i, xn = /\)\s*,?\s*/, _n = /\s/g, ue = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, le = /^rgb\(/, ce = /^(\s+)?$/, fe = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, vn = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, B = /[\s,]+/, Zt = /[MLHVCSQTAZ]/i;
function Sn() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(B);
}
function Tn(n) {
  return this.classes().indexOf(n) !== -1;
}
function Cn(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function Mn(n) {
  return this.hasClass(n) && this.attr(
    "class",
    this.classes().filter(function(t) {
      return t !== n;
    }).join(" ")
  ), this;
}
function An(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
p("Dom", {
  classes: Sn,
  hasClass: Tn,
  addClass: Cn,
  removeClass: Mn,
  toggleClass: An
});
function kn(n, t) {
  const e = {};
  if (arguments.length === 0)
    return this.node.style.cssText.split(/\s*;\s*/).filter(function(s) {
      return !!s.length;
    }).forEach(function(s) {
      const i = s.split(/\s*:\s*/);
      e[i[0]] = i[1];
    }), e;
  if (arguments.length < 2) {
    if (Array.isArray(n)) {
      for (const s of n) {
        const i = s;
        e[s] = this.node.style.getPropertyValue(i);
      }
      return e;
    }
    if (typeof n == "string")
      return this.node.style.getPropertyValue(n);
    if (typeof n == "object")
      for (const s in n)
        this.node.style.setProperty(
          s,
          n[s] == null || ce.test(n[s]) ? "" : n[s]
        );
  }
  return arguments.length === 2 && this.node.style.setProperty(
    n,
    t == null || ce.test(t) ? "" : t
  ), this;
}
function Nn() {
  return this.css("display", "");
}
function On() {
  return this.css("display", "none");
}
function En() {
  return this.css("display") !== "none";
}
p("Dom", {
  css: kn,
  show: Nn,
  hide: On,
  visible: En
});
function In(n, t, e) {
  if (n == null)
    return this.data(
      Wt(
        Je(
          this.node.attributes,
          (s) => s.nodeName.indexOf("data-") === 0
        ),
        (s) => s.nodeName.slice(5)
      )
    );
  if (n instanceof Array) {
    const s = {};
    for (const i of n)
      s[i] = this.data(i);
    return s;
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
p("Dom", { data: In });
function zn(n, t) {
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
function Rn() {
  if (arguments.length === 0)
    this._memory = {};
  else
    for (let n = arguments.length - 1; n >= 0; n--)
      delete this.memory()[arguments[n]];
  return this;
}
function Dn() {
  return this._memory = this._memory || {};
}
p("Dom", { remember: zn, forget: Rn, memory: Dn });
function jn(n) {
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
function Pn(n) {
  const t = Math.round(n), s = Math.max(0, Math.min(255, t)).toString(16);
  return s.length === 1 ? "0" + s : s;
}
function K(n, t) {
  for (let e = t.length; e--; )
    if (n[t[e]] == null)
      return !1;
  return !0;
}
function Ln(n, t) {
  const e = K(n, "rgb") ? { _a: n.r, _b: n.g, _c: n.b, _d: 0, space: "rgb" } : K(n, "xyz") ? { _a: n.x, _b: n.y, _c: n.z, _d: 0, space: "xyz" } : K(n, "hsl") ? { _a: n.h, _b: n.s, _c: n.l, _d: 0, space: "hsl" } : K(n, "lab") ? { _a: n.l, _b: n.a, _c: n.b, _d: 0, space: "lab" } : K(n, "lch") ? { _a: n.l, _b: n.c, _c: n.h, _d: 0, space: "lch" } : K(n, "cmyk") ? { _a: n.c, _b: n.m, _c: n.y, _d: n.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
  return e.space = t || e.space, e;
}
function Fn(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function Rt(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
}
class x {
  constructor(...t) {
    this.init(...t);
  }
  // Test if given value is a color
  static isColor(t) {
    return t && (t instanceof x || this.isRgb(t) || this.test(t));
  }
  // Test if given value is an rgb object
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  /*
  Generating random colors
  */
  static random(t = "vibrant", e) {
    const { random: s, round: i, sin: r, PI: a } = Math;
    if (t === "vibrant") {
      const o = 24 * s() + 57, h = 38 * s() + 45, u = 360 * s();
      return new x(o, h, u, "lch");
    } else if (t === "sine") {
      e = e ?? s();
      const o = i(80 * r(2 * a * e / 0.5 + 0.01) + 150), h = i(50 * r(2 * a * e / 0.5 + 4.6) + 200), u = i(100 * r(2 * a * e / 0.5 + 2.3) + 150);
      return new x(o, h, u);
    } else if (t === "pastel") {
      const o = 8 * s() + 86, h = 17 * s() + 9, u = 360 * s();
      return new x(o, h, u, "lch");
    } else if (t === "dark") {
      const o = 10 + 10 * s(), h = 50 * s() + 86, u = 360 * s();
      return new x(o, h, u, "lch");
    } else if (t === "rgb") {
      const o = 255 * s(), h = 255 * s(), u = 255 * s();
      return new x(o, h, u);
    } else if (t === "lab") {
      const o = 100 * s(), h = 256 * s() - 128, u = 256 * s() - 128;
      return new x(o, h, u, "lab");
    } else if (t === "grey") {
      const o = 255 * s();
      return new x(o, o, o);
    } else
      throw new Error("Unsupported random color mode");
  }
  // Test if given value is a color string
  static test(t) {
    return typeof t == "string" && (ue.test(t) || le.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, r, a] = [t, e, s].map((w) => w / 255), o = Math.min(1 - i, 1 - r, 1 - a);
    if (o === 1)
      return new x(0, 0, 0, 1, "cmyk");
    const h = (1 - i - o) / (1 - o), u = (1 - r - o) / (1 - o), l = (1 - a - o) / (1 - o);
    return new x(h, u, l, o, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, r, a] = [t, e, s].map((M) => M / 255), o = Math.max(i, r, a), h = Math.min(i, r, a), u = (o + h) / 2, l = o === h, c = o - h, w = l ? 0 : u > 0.5 ? c / (2 - o - h) : c / (o + h), _ = l ? 0 : o === i ? ((r - a) / c + (r < a ? 6 : 0)) / 6 : o === r ? ((a - i) / c + 2) / 6 : o === a ? ((i - r) / c + 4) / 6 : 0;
    return new x(360 * _, 100 * w, 100 * u, "hsl");
  }
  init(t = 0, e = 0, s = 0, i = 0, r = "rgb") {
    if (t = t || 0, this.space)
      for (const c in this.space)
        delete this[this.space[c]];
    if (typeof t == "number")
      r = typeof i == "string" ? i : r, i = typeof i == "string" ? 0 : i, Object.assign(this, { _a: t, _b: e, _c: s, _d: i, space: r });
    else if (t instanceof Array)
      this.space = e || (typeof t[3] == "string" ? t[3] : t[4]) || "rgb", Object.assign(this, { _a: t[0], _b: t[1], _c: t[2], _d: t[3] || 0 });
    else if (t instanceof Object) {
      const c = Ln(t, e);
      Object.assign(this, c);
    } else if (typeof t == "string")
      if (le.test(t)) {
        const c = t.replace(_n, ""), [w, _, C] = wn.exec(c).slice(1, 4).map((M) => parseInt(M));
        Object.assign(this, { _a: w, _b: _, _c: C, _d: 0, space: "rgb" });
      } else if (ue.test(t)) {
        const c = (M) => parseInt(M, 16), [, w, _, C] = yn.exec(jn(t)).map(c);
        Object.assign(this, { _a: w, _b: _, _c: C, _d: 0, space: "rgb" });
      } else throw Error("Unsupported string format, can't construct Color");
    const { _a: a, _b: o, _c: h, _d: u } = this, l = this.space === "rgb" ? { r: a, g: o, b: h } : this.space === "xyz" ? { x: a, y: o, z: h } : this.space === "hsl" ? { h: a, s: o, l: h } : this.space === "lab" ? { l: a, a: o, b: h } : this.space === "lch" ? { l: a, c: o, h } : this.space === "cmyk" ? { c: a, m: o, y: h, k: u } : {};
    Object.assign(this, l);
  }
  lab() {
    const { x: t, y: e, z: s } = this.xyz(), i = 116 * e - 16, r = 500 * (t - e), a = 200 * (e - s);
    return new x(i, r, a, "lab");
  }
  lch() {
    const { l: t, a: e, b: s } = this.lab(), i = Math.sqrt(e ** 2 + s ** 2);
    let r = 180 * Math.atan2(s, e) / Math.PI;
    return r < 0 && (r *= -1, r = 360 - r), new x(t, i, r, "lch");
  }
  /*
  Conversion Methods
  */
  rgb() {
    if (this.space === "rgb")
      return this;
    if (Fn(this.space)) {
      let { x: t, y: e, z: s } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: _, a: C, b: M } = this;
        if (this.space === "lch") {
          const { c: U, h: _t } = this, vt = Math.PI / 180;
          C = U * Math.cos(vt * _t), M = U * Math.sin(vt * _t);
        }
        const T = (_ + 16) / 116, k = C / 500 + T, j = T - M / 200, P = 16 / 116, G = 8856e-6, Y = 7.787;
        t = 0.95047 * (k ** 3 > G ? k ** 3 : (k - P) / Y), e = 1 * (T ** 3 > G ? T ** 3 : (T - P) / Y), s = 1.08883 * (j ** 3 > G ? j ** 3 : (j - P) / Y);
      }
      const i = t * 3.2406 + e * -1.5372 + s * -0.4986, r = t * -0.9689 + e * 1.8758 + s * 0.0415, a = t * 0.0557 + e * -0.204 + s * 1.057, o = Math.pow, h = 31308e-7, u = i > h ? 1.055 * o(i, 1 / 2.4) - 0.055 : 12.92 * i, l = r > h ? 1.055 * o(r, 1 / 2.4) - 0.055 : 12.92 * r, c = a > h ? 1.055 * o(a, 1 / 2.4) - 0.055 : 12.92 * a;
      return new x(255 * u, 255 * l, 255 * c);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: s } = this;
      if (t /= 360, e /= 100, s /= 100, e === 0)
        return s *= 255, new x(s, s, s);
      const i = s < 0.5 ? s * (1 + e) : s + e - s * e, r = 2 * s - i, a = 255 * Rt(r, i, t + 1 / 3), o = 255 * Rt(r, i, t), h = 255 * Rt(r, i, t - 1 / 3);
      return new x(a, o, h);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: s, k: i } = this, r = 255 * (1 - Math.min(1, t * (1 - i) + i)), a = 255 * (1 - Math.min(1, e * (1 - i) + i)), o = 255 * (1 - Math.min(1, s * (1 - i) + i));
      return new x(r, a, o);
    } else
      return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: s, _d: i, space: r } = this;
    return [t, e, s, i, r];
  }
  toHex() {
    const [t, e, s] = this._clamped().map(Pn);
    return `#${t}${e}${s}`;
  }
  toRgb() {
    const [t, e, s] = this._clamped();
    return `rgb(${t},${e},${s})`;
  }
  toString() {
    return this.toHex();
  }
  xyz() {
    const { _a: t, _b: e, _c: s } = this.rgb(), [i, r, a] = [t, e, s].map((k) => k / 255), o = i > 0.04045 ? Math.pow((i + 0.055) / 1.055, 2.4) : i / 12.92, h = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, u = a > 0.04045 ? Math.pow((a + 0.055) / 1.055, 2.4) : a / 12.92, l = (o * 0.4124 + h * 0.3576 + u * 0.1805) / 0.95047, c = (o * 0.2126 + h * 0.7152 + u * 0.0722) / 1, w = (o * 0.0193 + h * 0.1192 + u * 0.9505) / 1.08883, _ = l > 8856e-6 ? Math.pow(l, 1 / 3) : 7.787 * l + 16 / 116, C = c > 8856e-6 ? Math.pow(c, 1 / 3) : 7.787 * c + 16 / 116, M = w > 8856e-6 ? Math.pow(w, 1 / 3) : 7.787 * w + 16 / 116;
    return new x(_, C, M, "xyz");
  }
  /*
  Input and Output methods
  */
  _clamped() {
    const { _a: t, _b: e, _c: s } = this.rgb(), { max: i, min: r, round: a } = Math, o = (h) => i(0, r(a(h), 255));
    return [t, e, s].map(o);
  }
  /*
  Constructing colors
  */
}
class A {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  // Clone point
  clone() {
    return new A(this);
  }
  init(t, e) {
    const s = { x: 0, y: 0 }, i = Array.isArray(t) ? { x: t[0], y: t[1] } : typeof t == "object" ? { x: t.x, y: t.y } : { x: t, y: e };
    return this.x = i.x == null ? s.x : i.x, this.y = i.y == null ? s.y : i.y, this;
  }
  toArray() {
    return [this.x, this.y];
  }
  transform(t) {
    return this.clone().transformO(t);
  }
  // Transform point with matrix
  transformO(t) {
    f.isMatrixLike(t) || (t = new f(t));
    const { x: e, y: s } = this;
    return this.x = t.a * e + t.c * s + t.e, this.y = t.b * e + t.d * s + t.f, this;
  }
}
function qn(n, t) {
  return new A(n, t).transformO(this.screenCTM().inverseO());
}
function tt(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
class f {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, s = t.flip && (e || t.flip === "x") ? -1 : 1, i = t.flip && (e || t.flip === "y") ? -1 : 1, r = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, a = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, o = t.scale && t.scale.length ? t.scale[0] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleX) ? t.scaleX * s : s, h = t.scale && t.scale.length ? t.scale[1] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleY) ? t.scaleY * i : i, u = t.shear || 0, l = t.rotate || t.theta || 0, c = new A(
      t.origin || t.around || t.ox || t.originX,
      t.oy || t.originY
    ), w = c.x, _ = c.y, C = new A(
      t.position || t.px || t.positionX || NaN,
      t.py || t.positionY || NaN
    ), M = C.x, T = C.y, k = new A(
      t.translate || t.tx || t.translateX,
      t.ty || t.translateY
    ), j = k.x, P = k.y, G = new A(
      t.relative || t.rx || t.relativeX,
      t.ry || t.relativeY
    ), Y = G.x, U = G.y;
    return {
      scaleX: o,
      scaleY: h,
      skewX: r,
      skewY: a,
      shear: u,
      theta: l,
      rx: Y,
      ry: U,
      tx: j,
      ty: P,
      ox: w,
      oy: _,
      px: M,
      py: T
    };
  }
  static fromArray(t) {
    return { a: t[0], b: t[1], c: t[2], d: t[3], e: t[4], f: t[5] };
  }
  static isMatrixLike(t) {
    return t.a != null || t.b != null || t.c != null || t.d != null || t.e != null || t.f != null;
  }
  // left matrix, right matrix, target matrix which is overwritten
  static matrixMultiply(t, e, s) {
    const i = t.a * e.a + t.c * e.b, r = t.b * e.a + t.d * e.b, a = t.a * e.c + t.c * e.d, o = t.b * e.c + t.d * e.d, h = t.e + t.a * e.e + t.c * e.f, u = t.f + t.b * e.e + t.d * e.f;
    return s.a = i, s.b = r, s.c = a, s.d = o, s.e = h, s.f = u, s;
  }
  around(t, e, s) {
    return this.clone().aroundO(t, e, s);
  }
  // Transform around a center point
  aroundO(t, e, s) {
    const i = t || 0, r = e || 0;
    return this.translateO(-i, -r).lmultiplyO(s).translateO(i, r);
  }
  // Clones this matrix
  clone() {
    return new f(this);
  }
  // Decomposes this matrix into its affine parameters
  decompose(t = 0, e = 0) {
    const s = this.a, i = this.b, r = this.c, a = this.d, o = this.e, h = this.f, u = s * a - i * r, l = u > 0 ? 1 : -1, c = l * Math.sqrt(s * s + i * i), w = Math.atan2(l * i, l * s), _ = 180 / Math.PI * w, C = Math.cos(w), M = Math.sin(w), T = (s * r + i * a) / u, k = r * c / (T * s - i) || a * c / (T * i + s), j = o - t + t * C * c + e * (T * C * c - M * k), P = h - e + t * M * c + e * (T * M * c + C * k);
    return {
      // Return the affine parameters
      scaleX: c,
      scaleY: k,
      shear: T,
      rotate: _,
      translateX: j,
      translateY: P,
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
    const e = new f(t);
    return tt(this.a, e.a) && tt(this.b, e.b) && tt(this.c, e.c) && tt(this.d, e.d) && tt(this.e, e.e) && tt(this.f, e.f);
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
    const e = f.fromArray([1, 0, 0, 1, 0, 0]);
    return t = t instanceof F ? t.matrixify() : typeof t == "string" ? f.fromArray(t.split(B).map(parseFloat)) : Array.isArray(t) ? f.fromArray(t) : typeof t == "object" && f.isMatrixLike(t) ? t : typeof t == "object" ? new f().transform(t) : arguments.length === 6 ? f.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  // Inverses matrix
  inverseO() {
    const t = this.a, e = this.b, s = this.c, i = this.d, r = this.e, a = this.f, o = t * i - e * s;
    if (!o) throw new Error("Cannot invert " + this);
    const h = i / o, u = -e / o, l = -s / o, c = t / o, w = -(h * r + l * a), _ = -(u * r + c * a);
    return this.a = h, this.b = u, this.c = l, this.d = c, this.e = w, this.f = _, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, s = t instanceof f ? t : new f(t);
    return f.matrixMultiply(s, e, this);
  }
  // Left multiplies by the given matrix
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, s = t instanceof f ? t : new f(t);
    return f.matrixMultiply(e, s, this);
  }
  // Rotate matrix
  rotate(t, e, s) {
    return this.clone().rotateO(t, e, s);
  }
  rotateO(t, e = 0, s = 0) {
    t = Et(t);
    const i = Math.cos(t), r = Math.sin(t), { a, b: o, c: h, d: u, e: l, f: c } = this;
    return this.a = a * i - o * r, this.b = o * i + a * r, this.c = h * i - u * r, this.d = u * i + h * r, this.e = l * i - c * r + s * r - e * i + e, this.f = c * i + l * r - e * r - s * i + s, this;
  }
  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, s = 0, i = 0) {
    arguments.length === 3 && (i = s, s = e, e = t);
    const { a: r, b: a, c: o, d: h, e: u, f: l } = this;
    return this.a = r * t, this.b = a * e, this.c = o * t, this.d = h * e, this.e = u * t - s * t + s, this.f = l * e - i * e + i, this;
  }
  // Shear matrix
  shear(t, e, s) {
    return this.clone().shearO(t, e, s);
  }
  // eslint-disable-next-line no-unused-vars
  shearO(t, e = 0, s = 0) {
    const { a: i, b: r, c: a, d: o, e: h, f: u } = this;
    return this.a = i + r * t, this.c = a + o * t, this.e = h + u * t - s * t, this;
  }
  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, s = 0, i = 0) {
    arguments.length === 3 && (i = s, s = e, e = t), t = Et(t), e = Et(e);
    const r = Math.tan(t), a = Math.tan(e), { a: o, b: h, c: u, d: l, e: c, f: w } = this;
    return this.a = o + h * r, this.b = h + o * a, this.c = u + l * r, this.d = l + u * a, this.e = c + w * r - i * r, this.f = w + c * a - s * a, this;
  }
  // SkewX
  skewX(t, e, s) {
    return this.skew(t, 0, e, s);
  }
  // SkewY
  skewY(t, e, s) {
    return this.skew(0, t, e, s);
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
    if (f.isMatrixLike(t))
      return new f(t).multiplyO(this);
    const e = f.formatTransforms(t), s = this, { x: i, y: r } = new A(e.ox, e.oy).transform(s), a = new f().translateO(e.rx, e.ry).lmultiplyO(s).translateO(-i, -r).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(i, r);
    if (isFinite(e.px) || isFinite(e.py)) {
      const o = new A(i, r).transform(a), h = isFinite(e.px) ? e.px - o.x : 0, u = isFinite(e.py) ? e.py - o.y : 0;
      a.translateO(h, u);
    }
    return a.translateO(e.tx, e.ty), a;
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
}
function Bn() {
  return new f(this.node.getCTM());
}
function Gn() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new f(t);
    }
    return new f(this.node.getScreenCTM());
  } catch {
    return console.warn(
      `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
    ), new f();
  }
}
y(f, "Matrix");
function $() {
  if (!$.nodes) {
    const n = O().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true");
    const t = n.path().node;
    $.nodes = { svg: n, path: t };
  }
  if (!$.nodes.svg.node.parentNode) {
    const n = g.document.body || g.document.documentElement;
    $.nodes.svg.addTo(n);
  }
  return $.nodes;
}
function Se(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function Yn(n) {
  return n === g.document || (g.document.documentElement.contains || function(t) {
    for (; t.parentNode; )
      t = t.parentNode;
    return t === g.document;
  }).call(g.document.documentElement, n);
}
class N {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += g.window.pageXOffset, this.y += g.window.pageYOffset, new N(this);
  }
  init(t) {
    const e = [0, 0, 0, 0];
    return t = typeof t == "string" ? t.split(B).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
      t.left != null ? t.left : t.x,
      t.top != null ? t.top : t.y,
      t.width,
      t.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : e, this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
  }
  isNulled() {
    return Se(this);
  }
  // Merge rect box with another, return a new instance
  merge(t) {
    const e = Math.min(this.x, t.x), s = Math.min(this.y, t.y), i = Math.max(this.x + this.width, t.x + t.width) - e, r = Math.max(this.y + this.height, t.y + t.height) - s;
    return new N(e, s, i, r);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof f || (t = new f(t));
    let e = 1 / 0, s = -1 / 0, i = 1 / 0, r = -1 / 0;
    return [
      new A(this.x, this.y),
      new A(this.x2, this.y),
      new A(this.x, this.y2),
      new A(this.x2, this.y2)
    ].forEach(function(o) {
      o = o.transform(t), e = Math.min(e, o.x), s = Math.max(s, o.x), i = Math.min(i, o.y), r = Math.max(r, o.y);
    }), new N(e, i, s - e, r - i);
  }
}
function Te(n, t, e) {
  let s;
  try {
    if (s = t(n.node), Se(s) && !Yn(n.node))
      throw new Error("Element not in the dom");
  } catch {
    s = e(n);
  }
  return s;
}
function $n() {
  const e = Te(this, (i) => i.getBBox(), (i) => {
    try {
      const r = i.clone().addTo($().svg).show(), a = r.node.getBBox();
      return r.remove(), a;
    } catch (r) {
      throw new Error(
        `Getting bbox of element "${i.node.nodeName}" is not possible: ${r.toString()}`
      );
    }
  });
  return new N(e);
}
function Hn(n) {
  const s = Te(this, (r) => r.getBoundingClientRect(), (r) => {
    throw new Error(
      `Getting rbox of element "${r.node.nodeName}" is not possible`
    );
  }), i = new N(s);
  return n ? i.transform(n.screenCTM().inverseO()) : i.addOffset();
}
function Xn(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
p({
  viewbox: {
    viewbox(n, t, e, s) {
      return n == null ? new N(this.attr("viewBox")) : this.attr("viewBox", new N(n, t, e, s));
    },
    zoom(n, t) {
      let { width: e, height: s } = this.attr(["width", "height"]);
      if ((!e && !s || typeof e == "string" || typeof s == "string") && (e = this.node.clientWidth, s = this.node.clientHeight), !e || !s)
        throw new Error(
          "Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element"
        );
      const i = this.viewbox(), r = e / i.width, a = s / i.height, o = Math.min(r, a);
      if (n == null)
        return o;
      let h = o / n;
      h === 1 / 0 && (h = Number.MAX_SAFE_INTEGER / 100), t = t || new A(e / 2 / r + i.x, s / 2 / a + i.y);
      const u = new N(i).transform(
        new f({ scale: h, origin: t })
      );
      return this.viewbox(u);
    }
  }
});
y(N, "Box");
class J extends Array {
  constructor(t = [], ...e) {
    if (super(t, ...e), typeof t == "number") return this;
    this.length = 0, this.push(...t);
  }
}
m([J], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, s, i) => n.call(e, e, s, i)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const Un = ["toArray", "constructor", "each"];
J.extend = function(n) {
  n = n.reduce((t, e) => (Un.includes(e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...s) {
    return this.each(e, ...s);
  }), t), {}), m([J], n);
};
function it(n, t) {
  return new J(
    Wt((t || g.document).querySelectorAll(n), function(e) {
      return D(e);
    })
  );
}
function Wn(n) {
  return it(n, this.node);
}
function Vn(n) {
  return D(this.node.querySelector(n));
}
let Qn = 0;
const Ce = {};
function Me(n) {
  let t = n.getEventHolder();
  return t === g.window && (t = Ce), t.events || (t.events = {}), t.events;
}
function Kt(n) {
  return n.getEventTarget();
}
function Jn(n) {
  let t = n.getEventHolder();
  t === g.window && (t = Ce), t.events && (t.events = {});
}
function ut(n, t, e, s, i) {
  const r = e.bind(s || n), a = O(n), o = Me(a), h = Kt(a);
  t = Array.isArray(t) ? t : t.split(B), e._svgjsListenerId || (e._svgjsListenerId = ++Qn), t.forEach(function(u) {
    const l = u.split(".")[0], c = u.split(".")[1] || "*";
    o[l] = o[l] || {}, o[l][c] = o[l][c] || {}, o[l][c][e._svgjsListenerId] = r, h.addEventListener(l, r, i || !1);
  });
}
function q(n, t, e, s) {
  const i = O(n), r = Me(i), a = Kt(i);
  typeof e == "function" && (e = e._svgjsListenerId, !e) || (t = Array.isArray(t) ? t : (t || "").split(B), t.forEach(function(o) {
    const h = o && o.split(".")[0], u = o && o.split(".")[1];
    let l, c;
    if (e)
      r[h] && r[h][u || "*"] && (a.removeEventListener(
        h,
        r[h][u || "*"][e],
        s || !1
      ), delete r[h][u || "*"][e]);
    else if (h && u) {
      if (r[h] && r[h][u]) {
        for (c in r[h][u])
          q(a, [h, u].join("."), c);
        delete r[h][u];
      }
    } else if (u)
      for (o in r)
        for (l in r[o])
          u === l && q(a, [o, u].join("."));
    else if (h) {
      if (r[h]) {
        for (l in r[h])
          q(a, [h, l].join("."));
        delete r[h];
      }
    } else {
      for (o in r)
        q(a, o);
      Jn(i);
    }
  }));
}
function Zn(n, t, e, s) {
  const i = Kt(n);
  return t instanceof g.window.Event || (t = new g.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...s
  })), i.dispatchEvent(t), t;
}
class pt extends Qt {
  addEventListener() {
  }
  dispatch(t, e, s) {
    return Zn(this, t, e, s);
  }
  dispatchEvent(t) {
    const e = this.getEventHolder().events;
    if (!e) return !0;
    const s = e[t.type];
    for (const i in s)
      for (const r in s[i])
        s[i][r](t);
    return !t.defaultPrevented;
  }
  // Fire given event
  fire(t, e, s) {
    return this.dispatch(t, e, s), this;
  }
  getEventHolder() {
    return this;
  }
  getEventTarget() {
    return this;
  }
  // Unbind event from listener
  off(t, e, s) {
    return q(this, t, e, s), this;
  }
  // Bind given event to listener
  on(t, e, s, i) {
    return ut(this, t, e, s, i), this;
  }
  removeEventListener() {
  }
}
y(pt, "EventTarget");
function de() {
}
const at = {
  duration: 400,
  ease: ">",
  delay: 0
}, Kn = {
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
class nt extends Array {
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
    return t instanceof Array ? t : t.trim().split(B).map(parseFloat);
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
class d {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new d(this.value, t);
  }
  // Divide number
  divide(t) {
    return t = new d(t), new d(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(ve), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof d && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  // Subtract number
  minus(t) {
    return t = new d(t), new d(this - t, this.unit || t.unit);
  }
  // Add number
  plus(t) {
    return t = new d(t), new d(this + t, this.unit || t.unit);
  }
  // Multiply number
  times(t) {
    return t = new d(t), new d(this * t, this.unit || t.unit);
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
const ts = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), Ae = [];
function es(n) {
  Ae.push(n);
}
function ns(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const s of t)
      n[s.nodeName] = fe.test(s.nodeValue) ? parseFloat(s.nodeValue) : s.nodeValue;
    return n;
  } else {
    if (n instanceof Array)
      return n.reduce((s, i) => (s[i] = this.attr(i), s), {});
    if (typeof n == "object" && n.constructor === Object)
      for (t in n) this.attr(t, n[t]);
    else if (t === null)
      this.node.removeAttribute(n);
    else {
      if (t == null)
        return t = this.node.getAttribute(n), t == null ? Kn[n] : fe.test(t) ? parseFloat(t) : t;
      t = Ae.reduce((s, i) => i(n, s, this), t), typeof t == "number" ? t = new d(t) : ts.has(n) && x.isColor(t) ? t = new x(t) : t.constructor === Array && (t = new nt(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
class H extends pt {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  // Add given element at a position
  add(t, e) {
    return t = O(t), t.removeNamespace && this.node instanceof g.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  // Add element to given container and return self
  addTo(t, e) {
    return O(t).put(this, e);
  }
  // Returns all child elements
  children() {
    return new J(
      Wt(this.node.children, function(t) {
        return D(t);
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
    let s = this.node.cloneNode(t);
    return e && (s = _e(s)), new this.constructor(s);
  }
  // Iterates over all children and invokes a given block
  each(t, e) {
    const s = this.children();
    let i, r;
    for (i = 0, r = s.length; i < r; i++)
      t.apply(s[i], [i, s]), e && s[i].each(t, e);
    return this;
  }
  element(t, e) {
    return this.put(new H(ht(t), e));
  }
  // Get first child
  first() {
    return D(this.node.firstChild);
  }
  // Get a element at the given index
  get(t) {
    return D(this.node.childNodes[t]);
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
    return this.xml(t, e, tn);
  }
  // Get / set id
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = xe(this.type)), this.attr("id", t);
  }
  // Gets index of given element
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  // Get the last child
  last() {
    return D(this.node.lastChild);
  }
  // matches the element vs a css selector
  matches(t) {
    const e = this.node, s = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector || null;
    return s && s.call(e, t);
  }
  // Returns the parent element instance
  parent(t) {
    let e = this;
    if (!e.node.parentNode) return null;
    if (e = D(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t)
        return e;
    while (e = D(e.node.parentNode));
    return e;
  }
  // Basically does the same as `add()` but returns the added element instead
  put(t, e) {
    return t = O(t), this.add(t, e), t;
  }
  // Add element to given container and return container
  putIn(t, e) {
    return O(t).add(this, e);
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
    return t = O(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const s = 10 ** t, i = this.attr(e);
    for (const r in i)
      typeof i[r] == "number" && (i[r] = Math.round(i[r] * s) / s);
    return this.attr(i), this;
  }
  // Import / Export raw svg
  svg(t, e) {
    return this.xml(t, e, Vt);
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
    const s = e.index(this);
    return e.put(t, s).put(this);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return this.each(function() {
      this.writeDataToDom();
    }), this;
  }
  // Import / Export raw svg
  xml(t, e, s) {
    if (typeof t == "boolean" && (s = e, e = t, t = null), t == null || typeof t == "function") {
      e = e ?? !0, this.writeDataToDom();
      let o = this;
      if (t != null) {
        if (o = D(o.node.cloneNode(!0)), e) {
          const h = t(o);
          if (o = h || o, h === !1) return "";
        }
        o.each(function() {
          const h = t(this), u = h || this;
          h === !1 ? this.remove() : h && this !== u && this.replace(u);
        }, !0);
      }
      return e ? o.node.outerHTML : o.node.innerHTML;
    }
    e = e ?? !1;
    const i = ht("wrapper", s), r = g.document.createDocumentFragment();
    i.innerHTML = t;
    for (let o = i.children.length; o--; )
      r.appendChild(i.firstElementChild);
    const a = this.parent();
    return e ? this.replace(r) && a : this.add(r);
  }
}
m(H, { attr: ns, find: Wn, findOne: Vn });
y(H, "Dom");
class F extends H {
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
    return this.x(new d(t).plus(this.x()));
  }
  // Relative move over y axis
  dy(t = 0) {
    return this.y(new d(t).plus(this.y()));
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
    e || (t = O(t));
    const s = new J();
    let i = this;
    for (; (i = i.parent()) && i.node !== g.document && i.nodeName !== "#document-fragment" && (s.push(i), !(!e && i.node === t.node || e && i.matches(t))); )
      if (i.node === this.root().node)
        return null;
    return s;
  }
  // Get referenced element form attribute value
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = (t + "").match(bn);
    return e ? O(e[1]) : null;
  }
  // Get parent document
  root() {
    const t = this.parent(nn(Jt));
    return t && t.root();
  }
  // set given data to the elements data property
  setData(t) {
    return this.dom = t, this;
  }
  // Set element size to given width and height
  size(t, e) {
    const s = st(this, t, e);
    return this.width(new d(s.width)).height(new d(s.height));
  }
  // Set width of element
  width(t) {
    return this.attr("width", t);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return be(this, this.dom), super.writeDataToDom();
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
m(F, {
  bbox: $n,
  rbox: Hn,
  inside: Xn,
  point: qn,
  ctm: Bn,
  screenCTM: Gn
});
y(F, "Element");
const ot = {
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
  t[n] = function(s) {
    if (typeof s > "u")
      return this.attr(n);
    if (typeof s == "string" || s instanceof x || x.isRgb(s) || s instanceof F)
      this.attr(n, s);
    else
      for (e = ot[n].length - 1; e >= 0; e--)
        s[ot[n][e]] != null && this.attr(ot.prefix(n, ot[n][e]), s[ot[n][e]]);
    return this;
  }, p(["Element", "Runner"], t);
});
p(["Element", "Runner"], {
  // Let the user set the matrix directly
  matrix: function(n, t, e, s, i, r) {
    return n == null ? new f(this) : this.attr("transform", new f(n, t, e, s, i, r));
  },
  // Map rotation to transform
  rotate: function(n, t, e) {
    return this.transform({ rotate: n, ox: t, oy: e }, !0);
  },
  // Map skew to transform
  skew: function(n, t, e, s) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ skew: n, ox: t, oy: e }, !0) : this.transform({ skew: [n, t], ox: e, oy: s }, !0);
  },
  shear: function(n, t, e) {
    return this.transform({ shear: n, ox: t, oy: e }, !0);
  },
  // Map scale to transform
  scale: function(n, t, e, s) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ scale: n, ox: t, oy: e }, !0) : this.transform({ scale: [n, t], ox: e, oy: s }, !0);
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
p("radius", {
  // Add x and y radius
  radius: function(n, t = n) {
    return (this._element || this).type === "radialGradient" ? this.attr("r", new d(n)) : this.rx(n).ry(t);
  }
});
p("Path", {
  // Get path length
  length: function() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function(n) {
    return new A(this.node.getPointAtLength(n));
  }
});
p(["Element", "Runner"], {
  // Set font
  font: function(n, t) {
    if (typeof n == "object") {
      for (t in n) this.font(t, n[t]);
      return this;
    }
    return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
  }
});
const ss = [
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
  const e = function(s) {
    return s === null ? this.off(t) : this.on(t, s), this;
  };
  return n[t] = e, n;
}, {});
p("Element", ss);
function is() {
  return this.attr("transform", null);
}
function rs() {
  return (this.attr("transform") || "").split(xn).slice(0, -1).map(function(t) {
    const e = t.trim().split("(");
    return [
      e[0],
      e[1].split(B).map(function(s) {
        return parseFloat(s);
      })
    ];
  }).reverse().reduce(function(t, e) {
    return e[0] === "matrix" ? t.lmultiply(f.fromArray(e[1])) : t[e[0]].apply(t, e[1]);
  }, new f());
}
function os(n, t) {
  if (this === n) return this;
  if (Ft(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), s = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(s.multiply(e)), this;
}
function as(n) {
  return this.toParent(this.root(), n);
}
function hs(n, t) {
  if (n == null || typeof n == "string") {
    const i = new f(this).decompose();
    return n == null ? i : i[n];
  }
  f.isMatrixLike(n) || (n = { ...n, origin: Lt(n, this) });
  const e = t === !0 ? this : t || !1, s = new f(e).transform(n);
  return this.attr("transform", s);
}
p("Element", {
  untransform: is,
  matrixify: rs,
  toParent: os,
  toRoot: as,
  transform: hs
});
class I extends F {
  flatten() {
    return this.each(function() {
      if (this instanceof I)
        return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(s, i) {
      return i[i.length - s - 1].toParent(t, e);
    }), this.remove();
  }
}
y(I, "Container");
class te extends I {
  constructor(t, e = t) {
    super(S("defs", t), e);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
}
y(te, "Defs");
class R extends F {
}
y(R, "Shape");
function ee(n) {
  return this.attr("rx", n);
}
function ne(n) {
  return this.attr("ry", n);
}
function ke(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function Ne(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function Oe(n) {
  return this.attr("cx", n);
}
function Ee(n) {
  return this.attr("cy", n);
}
function Ie(n) {
  return n == null ? this.rx() * 2 : this.rx(new d(n).divide(2));
}
function ze(n) {
  return n == null ? this.ry() * 2 : this.ry(new d(n).divide(2));
}
const us = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cx: Oe,
  cy: Ee,
  height: ze,
  rx: ee,
  ry: ne,
  width: Ie,
  x: ke,
  y: Ne
}, Symbol.toStringTag, { value: "Module" }));
class mt extends R {
  constructor(t, e = t) {
    super(S("ellipse", t), e);
  }
  size(t, e) {
    const s = st(this, t, e);
    return this.rx(new d(s.width).divide(2)).ry(
      new d(s.height).divide(2)
    );
  }
}
m(mt, us);
p("Container", {
  // Create an ellipse
  ellipse: v(function(n = 0, t = n) {
    return this.put(new mt()).size(n, t).move(0, 0);
  })
});
y(mt, "Ellipse");
class Re extends H {
  constructor(t = g.document.createDocumentFragment()) {
    super(t);
  }
  // Import / Export raw xml
  xml(t, e, s) {
    if (typeof t == "boolean" && (s = e, e = t, t = null), t == null || typeof t == "function") {
      const i = new H(ht("wrapper", s));
      return i.add(this.node.cloneNode(!0)), i.xml(!1, s);
    }
    return super.xml(t, !1, s);
  }
}
y(Re, "Fragment");
function De(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ fx: new d(n), fy: new d(t) }) : this.attr({ x1: new d(n), y1: new d(t) });
}
function je(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ cx: new d(n), cy: new d(t) }) : this.attr({ x2: new d(n), y2: new d(t) });
}
const ls = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  from: De,
  to: je
}, Symbol.toStringTag, { value: "Module" }));
class gt extends I {
  constructor(t, e) {
    super(
      S(t + "Gradient", typeof t == "string" ? null : t),
      e
    );
  }
  // custom attr to handle transform
  attr(t, e, s) {
    return t === "transform" && (t = "gradientTransform"), super.attr(t, e, s);
  }
  bbox() {
    return new N();
  }
  targets() {
    return it("svg [fill*=" + this.id() + "]");
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
m(gt, ls);
p({
  Container: {
    // Create gradient element in defs
    gradient(...n) {
      return this.defs().gradient(...n);
    }
  },
  // define gradient
  Defs: {
    gradient: v(function(n, t) {
      return this.put(new gt(n)).update(t);
    })
  }
});
y(gt, "Gradient");
class lt extends I {
  // Initialize node
  constructor(t, e = t) {
    super(S("pattern", t), e);
  }
  // custom attr to handle transform
  attr(t, e, s) {
    return t === "transform" && (t = "patternTransform"), super.attr(t, e, s);
  }
  bbox() {
    return new N();
  }
  targets() {
    return it("svg [fill*=" + this.id() + "]");
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
p({
  Container: {
    // Create pattern element in defs
    pattern(...n) {
      return this.defs().pattern(...n);
    }
  },
  Defs: {
    pattern: v(function(n, t, e) {
      return this.put(new lt()).update(e).attr({
        x: 0,
        y: 0,
        width: n,
        height: t,
        patternUnits: "userSpaceOnUse"
      });
    })
  }
});
y(lt, "Pattern");
class At extends R {
  constructor(t, e = t) {
    super(S("image", t), e);
  }
  // (re)load image
  load(t, e) {
    if (!t) return this;
    const s = new g.window.Image();
    return ut(
      s,
      "load",
      function(i) {
        const r = this.parent(lt);
        this.width() === 0 && this.height() === 0 && this.size(s.width, s.height), r instanceof lt && r.width() === 0 && r.height() === 0 && r.size(this.width(), this.height()), typeof e == "function" && e.call(this, i);
      },
      this
    ), ut(s, "load error", function() {
      q(s);
    }), this.attr("href", s.src = t, dt);
  }
}
es(function(n, t, e) {
  return (n === "fill" || n === "stroke") && vn.test(t) && (t = e.root().defs().image(t)), t instanceof At && (t = e.root().defs().pattern(0, 0, (s) => {
    s.add(t);
  })), t;
});
p({
  Container: {
    // create image element, load image and set its size
    image: v(function(n, t) {
      return this.put(new At()).size(0, 0).load(n, t);
    })
  }
});
y(At, "Image");
class X extends nt {
  // Get bounding box of points
  bbox() {
    let t = -1 / 0, e = -1 / 0, s = 1 / 0, i = 1 / 0;
    return this.forEach(function(r) {
      t = Math.max(r[0], t), e = Math.max(r[1], e), s = Math.min(r[0], s), i = Math.min(r[1], i);
    }), new N(s, i, t - s, e - i);
  }
  // Move point string
  move(t, e) {
    const s = this.bbox();
    if (t -= s.x, e -= s.y, !isNaN(t) && !isNaN(e))
      for (let i = this.length - 1; i >= 0; i--)
        this[i] = [this[i][0] + t, this[i][1] + e];
    return this;
  }
  // Parse point string and flat array
  parse(t = [0, 0]) {
    const e = [];
    t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(B).map(parseFloat), t.length % 2 !== 0 && t.pop();
    for (let s = 0, i = t.length; s < i; s = s + 2)
      e.push([t[s], t[s + 1]]);
    return e;
  }
  // Resize poly string
  size(t, e) {
    let s;
    const i = this.bbox();
    for (s = this.length - 1; s >= 0; s--)
      i.width && (this[s][0] = (this[s][0] - i.x) * t / i.width + i.x), i.height && (this[s][1] = (this[s][1] - i.y) * e / i.height + i.y);
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
    for (let e = 0, s = this.length; e < s; e++)
      t.push(this[e].join(","));
    return t.join(" ");
  }
  transform(t) {
    return this.clone().transformO(t);
  }
  // transform points with matrix (similar to Point.transform)
  transformO(t) {
    f.isMatrixLike(t) || (t = new f(t));
    for (let e = this.length; e--; ) {
      const [s, i] = this[e];
      this[e][0] = t.a * s + t.c * i + t.e, this[e][1] = t.b * s + t.d * i + t.f;
    }
    return this;
  }
}
const cs = X;
function fs(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function ds(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function ps(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function ms(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
const se = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MorphArray: cs,
  height: ms,
  width: ps,
  x: fs,
  y: ds
}, Symbol.toStringTag, { value: "Module" }));
class ct extends R {
  // Initialize node
  constructor(t, e = t) {
    super(S("line", t), e);
  }
  // Get array
  array() {
    return new X([
      [this.attr("x1"), this.attr("y1")],
      [this.attr("x2"), this.attr("y2")]
    ]);
  }
  // Move by left top corner
  move(t, e) {
    return this.attr(this.array().move(t, e).toLine());
  }
  // Overwrite native plot() method
  plot(t, e, s, i) {
    return t == null ? this.array() : (typeof e < "u" ? t = { x1: t, y1: e, x2: s, y2: i } : t = new X(t).toLine(), this.attr(t));
  }
  // Set element size to given width and height
  size(t, e) {
    const s = st(this, t, e);
    return this.attr(this.array().size(s.width, s.height).toLine());
  }
}
m(ct, se);
p({
  Container: {
    // Create a line element
    line: v(function(...n) {
      return ct.prototype.plot.apply(
        this.put(new ct()),
        n[0] != null ? n : [0, 0, 0, 0]
      );
    })
  }
});
y(ct, "Line");
class St extends I {
  // Initialize node
  constructor(t, e = t) {
    super(S("marker", t), e);
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
p({
  Container: {
    marker(...n) {
      return this.defs().marker(...n);
    }
  },
  Defs: {
    // Create marker
    marker: v(function(n, t, e) {
      return this.put(new St()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
    })
  },
  marker: {
    // Create and attach markers
    marker(n, t, e, s) {
      let i = ["marker"];
      return n !== "all" && i.push(n), i = i.join("-"), n = arguments[1] instanceof St ? arguments[1] : this.defs().marker(t, e, s), this.attr(i, n);
    }
  }
});
y(St, "Marker");
function et(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const gs = {
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
  bezier: function(n, t, e, s) {
    return function(i) {
      return i < 0 ? n > 0 ? t / n * i : e > 0 ? s / e * i : 0 : i > 1 ? e < 1 ? (1 - s) / (1 - e) * i + (s - e) / (1 - e) : n < 1 ? (1 - t) / (1 - n) * i + (t - n) / (1 - n) : 1 : 3 * i * (1 - i) ** 2 * t + 3 * i ** 2 * (1 - i) * s + i ** 3;
    };
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function(n, t = "end") {
    t = t.split("-").reverse()[0];
    let e = n;
    return t === "none" ? --e : t === "both" && ++e, (s, i = !1) => {
      let r = Math.floor(s * n);
      const a = s * r % 1 === 0;
      return (t === "start" || t === "both") && ++r, i && a && --r, s >= 0 && r < 0 && (r = 0), s <= 1 && r > e && (r = e), r / e;
    };
  }
};
class ie {
  done() {
    return !1;
  }
}
class qt extends ie {
  constructor(t = at.ease) {
    super(), this.ease = gs[t] || t;
  }
  step(t, e, s) {
    return typeof t != "number" ? s < 1 ? t : e : t + (e - t) * this.ease(s);
  }
}
class Tt extends ie {
  constructor(t) {
    super(), this.stepper = t;
  }
  done(t) {
    return t.done;
  }
  step(t, e, s, i) {
    return this.stepper(t, e, s, i);
  }
}
function pe() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, s = Math.PI, i = Math.log(t / 100 + e), r = -i / Math.sqrt(s * s + i * i), a = 3.9 / (r * n);
  this.d = 2 * r * a, this.k = a * a;
}
class ys extends Tt {
  constructor(t = 500, e = 0) {
    super(), this.duration(t).overshoot(e);
  }
  step(t, e, s, i) {
    if (typeof t == "string") return t;
    if (i.done = s === 1 / 0, s === 1 / 0) return e;
    if (s === 0) return t;
    s > 100 && (s = 16), s /= 1e3;
    const r = i.velocity || 0, a = -this.d * r - this.k * (t - e), o = t + r * s + a * s * s / 2;
    return i.velocity = r + a * s, i.done = Math.abs(e - o) + Math.abs(r) < 2e-3, i.done ? e : o;
  }
}
m(ys, {
  duration: et("_duration", pe),
  overshoot: et("_overshoot", pe)
});
class ws extends Tt {
  constructor(t = 0.1, e = 0.01, s = 0, i = 1e3) {
    super(), this.p(t).i(e).d(s).windup(i);
  }
  step(t, e, s, i) {
    if (typeof t == "string") return t;
    if (i.done = s === 1 / 0, s === 1 / 0) return e;
    if (s === 0) return t;
    const r = e - t;
    let a = (i.integral || 0) + r * s;
    const o = (r - (i.error || 0)) / s, h = this._windup;
    return h !== !1 && (a = Math.max(-h, Math.min(a, h))), i.error = r, i.integral = a, i.done = Math.abs(r) < 1e-3, i.done ? e : t + (this.P * r + this.I * a + this.D * o);
  }
}
m(ws, {
  windup: et("_windup"),
  p: et("P"),
  i: et("I"),
  d: et("D")
});
const bs = {
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
}, Bt = {
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
}, Dt = "mlhvqtcsaz".split("");
for (let n = 0, t = Dt.length; n < t; ++n)
  Bt[Dt[n]] = /* @__PURE__ */ function(e) {
    return function(s, i, r) {
      if (e === "H") s[0] = s[0] + i.x;
      else if (e === "V") s[0] = s[0] + i.y;
      else if (e === "A")
        s[5] = s[5] + i.x, s[6] = s[6] + i.y;
      else
        for (let a = 0, o = s.length; a < o; ++a)
          s[a] = s[a] + (a % 2 ? i.y : i.x);
      return Bt[e](s, i, r);
    };
  }(Dt[n].toUpperCase());
function xs(n) {
  const t = n.segment[0];
  return Bt[t](n.segment.slice(1), n.p, n.p0);
}
function Gt(n) {
  return n.segment.length && n.segment.length - 1 === bs[n.segment[0].toUpperCase()];
}
function _s(n, t) {
  n.inNumber && W(n, !1);
  const e = Zt.test(t);
  if (e)
    n.segment = [t];
  else {
    const s = n.lastCommand, i = s.toLowerCase(), r = s === i;
    n.segment = [i === "m" ? r ? "l" : "L" : s];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function W(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, Gt(n) && Yt(n);
}
function Yt(n) {
  n.inSegment = !1, n.absolute && (n.segment = xs(n)), n.segments.push(n.segment);
}
function vs(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function Ss(n) {
  return n.lastToken.toUpperCase() === "E";
}
const Ts = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
function Cs(n, t = !0) {
  let e = 0, s = "";
  const i = {
    segment: [],
    inNumber: !1,
    number: "",
    lastToken: "",
    inSegment: !1,
    segments: [],
    pointSeen: !1,
    hasExponent: !1,
    absolute: t,
    p0: new A(),
    p: new A()
  };
  for (; i.lastToken = s, s = n.charAt(e++); )
    if (!(!i.inSegment && _s(i, s))) {
      if (s === ".") {
        if (i.pointSeen || i.hasExponent) {
          W(i, !1), --e;
          continue;
        }
        i.inNumber = !0, i.pointSeen = !0, i.number += s;
        continue;
      }
      if (!isNaN(parseInt(s))) {
        if (i.number === "0" || vs(i)) {
          i.inNumber = !0, i.number = s, W(i, !0);
          continue;
        }
        i.inNumber = !0, i.number += s;
        continue;
      }
      if (Ts.has(s)) {
        i.inNumber && W(i, !1);
        continue;
      }
      if (s === "-" || s === "+") {
        if (i.inNumber && !Ss(i)) {
          W(i, !1), --e;
          continue;
        }
        i.number += s, i.inNumber = !0;
        continue;
      }
      if (s.toUpperCase() === "E") {
        i.number += s, i.hasExponent = !0;
        continue;
      }
      if (Zt.test(s)) {
        if (i.inNumber)
          W(i, !1);
        else if (Gt(i))
          Yt(i);
        else
          throw new Error("parser Error");
        --e;
      }
    }
  return i.inNumber && W(i, !1), i.inSegment && Gt(i) && Yt(i), i.segments;
}
function Ms(n) {
  let t = "";
  for (let e = 0, s = n.length; e < s; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
class Z extends nt {
  // Get bounding box of path
  bbox() {
    return $().path.setAttribute("d", this.toString()), new N($.nodes.path.getBBox());
  }
  // Move path string
  move(t, e) {
    const s = this.bbox();
    if (t -= s.x, e -= s.y, !isNaN(t) && !isNaN(e))
      for (let i, r = this.length - 1; r >= 0; r--)
        i = this[r][0], i === "M" || i === "L" || i === "T" ? (this[r][1] += t, this[r][2] += e) : i === "H" ? this[r][1] += t : i === "V" ? this[r][1] += e : i === "C" || i === "S" || i === "Q" ? (this[r][1] += t, this[r][2] += e, this[r][3] += t, this[r][4] += e, i === "C" && (this[r][5] += t, this[r][6] += e)) : i === "A" && (this[r][6] += t, this[r][7] += e);
    return this;
  }
  // Absolutize and parse path to array
  parse(t = "M0 0") {
    return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), Cs(t);
  }
  // Resize path string
  size(t, e) {
    const s = this.bbox();
    let i, r;
    for (s.width = s.width === 0 ? 1 : s.width, s.height = s.height === 0 ? 1 : s.height, i = this.length - 1; i >= 0; i--)
      r = this[i][0], r === "M" || r === "L" || r === "T" ? (this[i][1] = (this[i][1] - s.x) * t / s.width + s.x, this[i][2] = (this[i][2] - s.y) * e / s.height + s.y) : r === "H" ? this[i][1] = (this[i][1] - s.x) * t / s.width + s.x : r === "V" ? this[i][1] = (this[i][1] - s.y) * e / s.height + s.y : r === "C" || r === "S" || r === "Q" ? (this[i][1] = (this[i][1] - s.x) * t / s.width + s.x, this[i][2] = (this[i][2] - s.y) * e / s.height + s.y, this[i][3] = (this[i][3] - s.x) * t / s.width + s.x, this[i][4] = (this[i][4] - s.y) * e / s.height + s.y, r === "C" && (this[i][5] = (this[i][5] - s.x) * t / s.width + s.x, this[i][6] = (this[i][6] - s.y) * e / s.height + s.y)) : r === "A" && (this[i][1] = this[i][1] * t / s.width, this[i][2] = this[i][2] * e / s.height, this[i][6] = (this[i][6] - s.x) * t / s.width + s.x, this[i][7] = (this[i][7] - s.y) * e / s.height + s.y);
    return this;
  }
  // Convert array to string
  toString() {
    return Ms(this);
  }
}
const Pe = (n) => {
  const t = typeof n;
  return t === "number" ? d : t === "string" ? x.isColor(n) ? x : B.test(n) ? Zt.test(n) ? Z : nt : ve.test(n) ? d : $t : re.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? nt : t === "object" ? ft : $t;
};
class V {
  constructor(t) {
    this._stepper = t || new qt("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    return this._context.map(this._stepper.done).reduce(function(e, s) {
      return e && s;
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
    this._type || this.type(Pe(t));
    let e = new this._type(t);
    return this._type === x && (e = this._to ? e[this._to[4]]() : this._from ? e[this._from[4]]() : e), this._type === ft && (e = this._to ? e.align(this._to) : this._from ? e.align(this._from) : e), e = e.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(e.length)).map(Object).map(function(s) {
      return s.done = !0, s;
    }), e;
  }
}
class $t {
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
class yt {
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
    }), Object.assign(this, yt.defaults, t), this;
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
yt.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const As = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
class ft {
  constructor(...t) {
    this.init(...t);
  }
  align(t) {
    const e = this.values;
    for (let s = 0, i = e.length; s < i; ++s) {
      if (e[s + 1] === t[s + 1]) {
        if (e[s + 1] === x && t[s + 7] !== e[s + 7]) {
          const o = t[s + 7], h = new x(this.values.splice(s + 3, 5))[o]().toArray();
          this.values.splice(s + 3, 0, ...h);
        }
        s += e[s + 2] + 2;
        continue;
      }
      if (!t[s + 1])
        return this;
      const r = new t[s + 1]().toArray(), a = e[s + 2] + 3;
      e.splice(
        s,
        a,
        t[s],
        t[s + 1],
        t[s + 2],
        ...r
      ), s += e[s + 2] + 2;
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
    for (const s in t) {
      const i = Pe(t[s]), r = new i(t[s]).toArray();
      e.push([s, i, r.length, ...r]);
    }
    return e.sort(As), this.values = e.reduce((s, i) => s.concat(i), []), this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const t = {}, e = this.values;
    for (; e.length; ) {
      const s = e.shift(), i = e.shift(), r = e.shift(), a = e.splice(0, r);
      t[s] = new i(a);
    }
    return t;
  }
}
const re = [$t, yt, ft];
function ks(n = []) {
  re.push(...[].concat(n));
}
function Ns() {
  m(re, {
    to(n) {
      return new V().type(this.constructor).from(this.toArray()).to(n);
    },
    fromArray(n) {
      return this.init(n), this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(n, t, e, s, i) {
      const r = function(a, o) {
        return s.step(a, t[o], e, i[o], i);
      };
      return this.fromArray(n.map(r));
    }
  });
}
class rt extends R {
  // Initialize node
  constructor(t, e = t) {
    super(S("path", t), e);
  }
  // Get array
  array() {
    return this._array || (this._array = new Z(this.attr("d")));
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
      typeof t == "string" ? t : this._array = new Z(t)
    );
  }
  // Set element size to given width and height
  size(t, e) {
    const s = st(this, t, e);
    return this.attr("d", this.array().size(s.width, s.height));
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
rt.prototype.MorphArray = Z;
p({
  Container: {
    // Create a wrapped path element
    path: v(function(n) {
      return this.put(new rt()).plot(n || new Z());
    })
  }
});
y(rt, "Path");
function Os() {
  return this._array || (this._array = new X(this.attr("points")));
}
function Es() {
  return delete this._array, this;
}
function Is(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function zs(n) {
  return n == null ? this.array() : this.clear().attr(
    "points",
    typeof n == "string" ? n : this._array = new X(n)
  );
}
function Rs(n, t) {
  const e = st(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
const Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array: Os,
  clear: Es,
  move: Is,
  plot: zs,
  size: Rs
}, Symbol.toStringTag, { value: "Module" }));
class wt extends R {
  // Initialize node
  constructor(t, e = t) {
    super(S("polygon", t), e);
  }
}
p({
  Container: {
    // Create a wrapped polygon element
    polygon: v(function(n) {
      return this.put(new wt()).plot(n || new X());
    })
  }
});
m(wt, se);
m(wt, Le);
y(wt, "Polygon");
class bt extends R {
  // Initialize node
  constructor(t, e = t) {
    super(S("polyline", t), e);
  }
}
p({
  Container: {
    // Create a wrapped polygon element
    polyline: v(function(n) {
      return this.put(new bt()).plot(n || new X());
    })
  }
});
m(bt, se);
m(bt, Le);
y(bt, "Polyline");
class xt extends R {
  // Initialize node
  constructor(t, e = t) {
    super(S("rect", t), e);
  }
}
m(xt, { rx: ee, ry: ne });
p({
  Container: {
    // Create a rect element
    rect: v(function(n, t) {
      return this.put(new xt()).size(n, t);
    })
  }
});
y(xt, "Rect");
class jt {
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
const b = {
  nextDraw: null,
  frames: new jt(),
  timeouts: new jt(),
  immediates: new jt(),
  timer: () => g.window.performance || g.window.Date,
  transforms: [],
  frame(n) {
    const t = b.frames.push({ run: n });
    return b.nextDraw === null && (b.nextDraw = g.window.requestAnimationFrame(b._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = b.timer().now() + t, s = b.timeouts.push({ run: n, time: e });
    return b.nextDraw === null && (b.nextDraw = g.window.requestAnimationFrame(b._draw)), s;
  },
  immediate(n) {
    const t = b.immediates.push(n);
    return b.nextDraw === null && (b.nextDraw = g.window.requestAnimationFrame(b._draw)), t;
  },
  cancelFrame(n) {
    n != null && b.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && b.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && b.immediates.remove(n);
  },
  _draw(n) {
    let t = null;
    const e = b.timeouts.last();
    for (; (t = b.timeouts.shift()) && (n >= t.time ? t.run() : b.timeouts.push(t), t !== e); )
      ;
    let s = null;
    const i = b.frames.last();
    for (; s !== i && (s = b.frames.shift()); )
      s.run(n);
    let r = null;
    for (; r = b.immediates.shift(); )
      r();
    b.nextDraw = b.timeouts.first() || b.frames.first() ? g.window.requestAnimationFrame(b._draw) : null;
  }
}, Ds = function(n) {
  const t = n.start, e = n.runner.duration(), s = t + e;
  return {
    start: t,
    duration: e,
    end: s,
    runner: n.runner
  };
}, js = function() {
  const n = g.window;
  return (n.performance || n.Date).now();
};
class Fe extends pt {
  // Construct a new timeline on the given element
  constructor(t = js) {
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
    const s = Math.abs(e);
    return this.speed(t ? -s : s);
  }
  // schedules a runner on the timeline
  schedule(t, e, s) {
    if (t == null)
      return this._runners.map(Ds);
    let i = 0;
    const r = this.getEndTime();
    if (e = e || 0, s == null || s === "last" || s === "after")
      i = r;
    else if (s === "absolute" || s === "start")
      i = e, e = 0;
    else if (s === "now")
      i = this._time;
    else if (s === "relative") {
      const h = this.getRunnerInfoById(t.id);
      h && (i = h.start + e, e = 0);
    } else if (s === "with-last") {
      const h = this.getLastRunnerInfo();
      i = h ? h.start : this._time;
    } else
      throw new Error('Invalid value for the "when" parameter');
    t.unschedule(), t.timeline(this);
    const a = t.persist(), o = {
      persist: a === null ? this._persist : a,
      start: i + e,
      runner: t
    };
    return this._lastRunnerId = t.id, this._runners.push(o), this._runners.sort((h, u) => h.start - u.start), this._runnerIds = this._runners.map((h) => h.runner.id), this.updateTime()._continue(), this;
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
    return b.cancelFrame(this._nextFrame), this._nextFrame = null, t ? this._stepImmediate() : this._paused ? this : (this._nextFrame = b.frame(this._step), this);
  }
  _stepFn(t = !1) {
    const e = this._timeSource();
    let s = e - this._lastSourceTime;
    t && (s = 0);
    const i = this._speed * s + (this._time - this._lastStepTime);
    this._lastSourceTime = e, t || (this._time += i, this._time = this._time < 0 ? 0 : this._time), this._lastStepTime = this._time, this.fire("time", this._time);
    for (let a = this._runners.length; a--; ) {
      const o = this._runners[a], h = o.runner;
      this._time - o.start <= 0 && h.reset();
    }
    let r = !1;
    for (let a = 0, o = this._runners.length; a < o; a++) {
      const h = this._runners[a], u = h.runner;
      let l = i;
      const c = this._time - h.start;
      if (c <= 0) {
        r = !0;
        continue;
      } else c < l && (l = c);
      if (!u.active()) continue;
      u.step(l).done ? h.persist !== !0 && u.duration() - u.time() + this._time + h.persist < this._time && (u.unschedule(), --a, --o) : r = !0;
    }
    return r && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this;
  }
  terminate() {
    this._startTime = 0, this._speed = 1, this._persist = 0, this._nextFrame = null, this._paused = !0, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
}
p({
  Element: {
    timeline: function(n) {
      return n == null ? (this._timeline = this._timeline || new Fe(), this._timeline) : (this._timeline = n, this);
    }
  }
});
class z extends pt {
  constructor(t) {
    super(), this.id = z.id++, t = t ?? at.duration, t = typeof t == "function" ? new Tt(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof Tt, this._stepper = this._isDeclarative ? t : new qt(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new f(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, s) {
    let i = 1, r = !1, a = 0;
    return t = t ?? at.duration, e = e ?? at.delay, s = s || "last", typeof t == "object" && !(t instanceof ie) && (e = t.delay ?? e, s = t.when ?? s, r = t.swing || r, i = t.times ?? i, a = t.wait ?? a, t = t.duration ?? at.duration), {
      duration: t,
      delay: e,
      swing: r,
      times: i,
      wait: a,
      when: s
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
  animate(t, e, s) {
    const i = z.sanitise(t, e, s), r = new z(i.duration);
    return this._timeline && r.timeline(this._timeline), this._element && r.element(this._element), r.loop(i).schedule(i.delay, i.when);
  }
  clearTransform() {
    return this.transforms = new f(), this;
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
    return this._stepper = new qt(t), this;
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
  loop(t, e, s) {
    return typeof t == "object" && (e = t.swing, s = t.wait, t = t.times), this._times = t || 1 / 0, this._swing = e || !1, this._wait = s || 0, this._times === !0 && (this._times = 1 / 0), this;
  }
  loops(t) {
    const e = this._duration + this._wait;
    if (t == null) {
      const a = Math.floor(this._time / e), h = (this._time - a * e) / this._duration;
      return Math.min(a + h, this._times);
    }
    const s = Math.floor(t), i = t % 1, r = e * s + this._duration * i;
    return this.time(r);
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  position(t) {
    const e = this._time, s = this._duration, i = this._wait, r = this._times, a = this._swing, o = this._reverse;
    let h;
    if (t == null) {
      const w = function(C) {
        const M = a * Math.floor(C % (2 * (i + s)) / (i + s)), T = M && !o || !M && o, k = Math.pow(-1, T) * (C % (i + s)) / s + T;
        return Math.max(Math.min(k, 1), 0);
      }, _ = r * (i + s) - i;
      return h = e <= 0 ? Math.round(w(1e-5)) : e < _ ? w(e) : Math.round(w(_ - 1e-5)), h;
    }
    const u = Math.floor(this.loops()), l = a && u % 2 === 0;
    return h = u + (l && !o || o && l ? t : 1 - t), this.loops(h);
  }
  progress(t) {
    return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
  }
  /*
  Basic Functionality
  ===================
  These methods allow us to attach basic functions to the runner directly
  */
  queue(t, e, s, i) {
    return this._queue.push({
      initialiser: t || de,
      runner: e || de,
      retarget: s,
      isTransform: i,
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
  schedule(t, e, s) {
    if (t instanceof Fe || (s = e, e = t, t = this.timeline()), !t)
      throw Error("Runner cannot be scheduled without timeline");
    return t.schedule(this, e, s), this;
  }
  step(t) {
    if (!this.enabled) return this;
    t = t ?? 16, this._time += t;
    const e = this.position(), s = this._lastPosition !== e && this._time >= 0;
    this._lastPosition = e;
    const i = this.duration(), r = this._lastTime <= 0 && this._time > 0, a = this._lastTime < i && this._time >= i;
    this._lastTime = this._time, r && this.fire("start", this);
    const o = this._isDeclarative;
    this.done = !o && !a && this._time >= i, this._reseted = !1;
    let h = !1;
    return (s || o) && (this._initialise(s), this.transforms = new f(), h = this._run(o ? t : e), this.fire("step", this)), this.done = this.done || h && o, a && this.fire("finished", this), this;
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
      for (let e = 0, s = this._queue.length; e < s; ++e) {
        const i = this._queue[e], r = this._isDeclarative || !i.initialised && t;
        t = !i.finished, r && t && (i.initialiser.call(this), i.initialised = !0);
      }
  }
  // Save a morpher to the morpher list so that we can retarget it later
  _rememberMorpher(t, e) {
    if (this._history[t] = {
      morpher: e,
      caller: this._queue[this._queue.length - 1]
    }, this._isDeclarative) {
      const s = this.timeline();
      s && s.play();
    }
  }
  // Try to set the target for a morpher if the morpher exists, otherwise
  // Run each run function for the position or dt given
  _run(t) {
    let e = !0;
    for (let s = 0, i = this._queue.length; s < i; ++s) {
      const r = this._queue[s], a = r.runner.call(this, t);
      r.finished = r.finished || a === !0, e = e && r.finished;
    }
    return e;
  }
  // do nothing and return false
  _tryRetarget(t, e, s) {
    if (this._history[t]) {
      if (!this._history[t].caller.initialised) {
        const r = this._queue.indexOf(this._history[t].caller);
        return this._queue.splice(r, 1), !1;
      }
      this._history[t].caller.retarget ? this._history[t].caller.retarget.call(this, e, s) : this._history[t].morpher.to(e), this._history[t].caller.finished = !1;
      const i = this.timeline();
      return i && i.play(), !0;
    }
    return !1;
  }
}
z.id = 0;
class Ct {
  constructor(t = new f(), e = -1, s = !0) {
    this.transforms = t, this.id = e, this.done = s;
  }
  clearTransformsFromQueue() {
  }
}
m([z, Ct], {
  mergeWith(n) {
    return new Ct(
      n.transforms.lmultiply(this.transforms),
      n.id
    );
  }
});
const qe = (n, t) => n.lmultiplyO(t), Be = (n) => n.transforms;
function Ps() {
  const t = this._transformationRunners.runners.map(Be).reduce(qe, new f());
  this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
class Ls {
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
    return this.ids.splice(0, e, 0), this.runners.splice(0, e, new Ct()).forEach((s) => s.clearTransformsFromQueue()), this;
  }
  edit(t, e) {
    const s = this.ids.indexOf(t + 1);
    return this.ids.splice(s, 1, t + 1), this.runners.splice(s, 1, e), this;
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
      const s = this.runners[e];
      if (t && s.done && t.done && // don't merge runner when persisted on timeline
      (!s._timeline || !s._timeline._runnerIds.includes(s.id)) && (!t._timeline || !t._timeline._runnerIds.includes(t.id))) {
        this.remove(s.id);
        const r = s.mergeWith(t);
        this.edit(t.id, r), t = r, --e;
      } else
        t = s;
    }
    return this;
  }
  remove(t) {
    const e = this.ids.indexOf(t + 1);
    return this.ids.splice(e, 1), this.runners.splice(e, 1), this;
  }
}
p({
  Element: {
    animate(n, t, e) {
      const s = z.sanitise(n, t, e), i = this.timeline();
      return new z(s.duration).loop(s).element(this).timeline(i.play()).schedule(s.delay, s.when);
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
      return this._transformationRunners.runners.filter((t) => t.id <= n.id).map(Be).reduce(qe, new f());
    },
    _addRunner(n) {
      this._transformationRunners.add(n), b.cancelImmediate(this._frameId), this._frameId = b.immediate(Ps.bind(this));
    },
    _prepareRunner() {
      this._frameId == null && (this._transformationRunners = new Ls().add(
        new Ct(new f(this))
      ));
    }
  }
});
const Fs = (n, t) => n.filter((e) => !t.includes(e));
m(z, {
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
    let s = t;
    if (this._tryRetarget(n, s)) return this;
    let i = new V(this._stepper).to(s), r = Object.keys(s);
    return this.queue(
      function() {
        i = i.from(this.element()[n](r));
      },
      function(a) {
        return this.element()[n](i.at(a).valueOf()), i.done();
      },
      function(a) {
        const o = Object.keys(a), h = Fs(o, r);
        if (h.length) {
          const l = this.element()[n](h), c = new ft(i.from()).valueOf();
          Object.assign(c, l), i.from(c);
        }
        const u = new ft(i.to()).valueOf();
        Object.assign(u, a), i.to(u), r = o, s = a;
      }
    ), this._rememberMorpher(n, i), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new V(this._stepper).to(new d(n));
    return this.queue(
      function() {
        e = e.from(this.element().zoom());
      },
      function(s) {
        return this.element().zoom(e.at(s), t), e.done();
      },
      function(s, i) {
        t = i, e.to(s);
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
    const s = f.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !s;
    const i = new V(this._stepper).type(
      e ? yt : f
    );
    let r, a, o, h, u;
    function l() {
      a = a || this.element(), r = r || Lt(n, a), u = new f(t ? void 0 : a), a._addRunner(this), t || a._clearTransformRunnersBefore(this);
    }
    function c(_) {
      t || this.clearTransform();
      const { x: C, y: M } = new A(r).transform(
        a._currentTransform(this)
      );
      let T = new f({ ...n, origin: [C, M] }), k = this._isDeclarative && o ? o : u;
      if (e) {
        T = T.decompose(C, M), k = k.decompose(C, M);
        const P = T.rotate, G = k.rotate, Y = [P - 360, P, P + 360], U = Y.map((Ve) => Math.abs(Ve - G)), _t = Math.min(...U), vt = U.indexOf(_t);
        T.rotate = Y[vt];
      }
      t && (s || (T.rotate = n.rotate || 0), this._isDeclarative && h && (k.rotate = h)), i.from(k), i.to(T);
      const j = i.at(_);
      return h = j.rotate, o = new f(j), this.addTransform(o), a._addRunner(this), i.done();
    }
    function w(_) {
      (_.origin || "center").toString() !== (n.origin || "center").toString() && (r = Lt(_, a)), n = { ..._, origin: r };
    }
    return this.queue(l, c, w, !0), this._isDeclarative && this._rememberMorpher("transform", i), this;
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
    if (t = new d(t), this._tryRetarget(n, t)) return this;
    const e = new V(this._stepper).to(t);
    let s = null;
    return this.queue(
      function() {
        s = this.element()[n](), e.from(s), e.to(s + t);
      },
      function(i) {
        return this.element()[n](e.at(i)), e.done();
      },
      function(i) {
        e.to(s + new d(i));
      }
    ), this._rememberMorpher(n, e), this;
  },
  _queueObject(n, t) {
    if (this._tryRetarget(n, t)) return this;
    const e = new V(this._stepper).to(t);
    return this.queue(
      function() {
        e.from(this.element()[n]());
      },
      function(s) {
        return this.element()[n](e.at(s)), e.done();
      }
    ), this._rememberMorpher(n, e), this;
  },
  _queueNumber(n, t) {
    return this._queueObject(n, new d(t));
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
  plot(n, t, e, s) {
    if (arguments.length === 4)
      return this.plot([n, t, e, s]);
    if (this._tryRetarget("plot", n)) return this;
    const i = new V(this._stepper).type(this._element.MorphArray).to(n);
    return this.queue(
      function() {
        i.from(this._element.array());
      },
      function(r) {
        return this._element.plot(i.at(r)), i.done();
      }
    ), this._rememberMorpher("plot", i), this;
  },
  // Add leading method
  leading(n) {
    return this._queueNumber("leading", n);
  },
  // Add animatable viewbox
  viewbox(n, t, e, s) {
    return this._queueObject("viewbox", new N(n, t, e, s));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
m(z, { rx: ee, ry: ne, from: De, to: je });
y(z, "Runner");
class oe extends I {
  constructor(t, e = t) {
    super(S("svg", t), e), this.namespace();
  }
  // Creates and returns defs element
  defs() {
    return this.isRoot() ? D(this.node.querySelector("defs")) || this.put(new te()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof g.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  // Add namespaces
  namespace() {
    return this.isRoot() ? this.attr({ xmlns: Vt, version: "1.1" }).attr(
      "xmlns:xlink",
      dt,
      It
    ) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, It).attr("xmlns:svgjs", null, It);
  }
  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    return this.isRoot() ? this : super.root();
  }
}
p({
  Container: {
    // Create nested svg document
    nested: v(function() {
      return this.put(new oe());
    })
  }
});
y(oe, "Svg", !0);
let ae = class extends I {
  // Initialize node
  constructor(t, e = t) {
    super(S("symbol", t), e);
  }
};
p({
  Container: {
    symbol: v(function() {
      return this.put(new ae());
    })
  }
});
y(ae, "Symbol");
function qs(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(g.document.createTextNode(n)), this;
}
function Bs() {
  return this.node.getComputedTextLength();
}
function Gs(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function Ys(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function $s(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function Hs(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function Xs(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function Us(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function Ws(n) {
  return this.attr("x", n);
}
function Vs(n) {
  return this.attr("y", n);
}
function Qs(n, t) {
  return this.ax(n).ay(t);
}
function Js(n) {
  return this._build = !!n, this;
}
const Ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amove: Qs,
  ax: Ws,
  ay: Vs,
  build: Js,
  center: Us,
  cx: Hs,
  cy: Xs,
  length: Bs,
  move: $s,
  plain: qs,
  x: Gs,
  y: Ys
}, Symbol.toStringTag, { value: "Module" }));
class L extends R {
  // Initialize node
  constructor(t, e = t) {
    super(S("text", t), e), this.dom.leading = this.dom.leading ?? new d(1.3), this._rebuild = !0, this._build = !1;
  }
  // Set / get leading
  leading(t) {
    return t == null ? this.dom.leading : (this.dom.leading = new d(t), this.rebuild());
  }
  // Rebuild appearance type
  rebuild(t) {
    if (typeof t == "boolean" && (this._rebuild = t), this._rebuild) {
      const e = this;
      let s = 0;
      const i = this.dom.leading;
      this.each(function(r) {
        if (Ft(this.node)) return;
        const a = g.window.getComputedStyle(this.node).getPropertyValue("font-size"), o = i * new d(a);
        this.dom.newLined && (this.attr("x", e.attr("x")), this.text() === `
` ? s += o : (this.attr("dy", r ? o + s : 0), s = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  // overwrite method from parent to set data properly
  setData(t) {
    return this.dom = t, this.dom.leading = new d(t.leading || 1.3), this;
  }
  writeDataToDom() {
    return be(this, this.dom, { leading: 1.3 }), this;
  }
  // Set the text content
  text(t) {
    if (t === void 0) {
      const e = this.node.childNodes;
      let s = 0;
      t = "";
      for (let i = 0, r = e.length; i < r; ++i) {
        if (e[i].nodeName === "textPath" || Ft(e[i])) {
          i === 0 && (s = i + 1);
          continue;
        }
        i !== s && e[i].nodeType !== 3 && D(e[i]).dom.newLined === !0 && (t += `
`), t += e[i].textContent;
      }
      return t;
    }
    if (this.clear().build(!0), typeof t == "function")
      t.call(this, this);
    else {
      t = (t + "").split(`
`);
      for (let e = 0, s = t.length; e < s; e++)
        this.newLine(t[e]);
    }
    return this.build(!1).rebuild();
  }
}
m(L, Ge);
p({
  Container: {
    // Create text element
    text: v(function(n = "") {
      return this.put(new L()).text(n);
    }),
    // Create plain text element
    plain: v(function(n = "") {
      return this.put(new L()).plain(n);
    })
  }
});
y(L, "Text");
class kt extends R {
  // Initialize node
  constructor(t, e = t) {
    super(S("tspan", t), e), this._build = !1;
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
    if (!(t instanceof L))
      return this;
    const e = t.index(this), s = g.window.getComputedStyle(this.node).getPropertyValue("font-size"), i = t.dom.leading * new d(s);
    return this.dy(e ? i : 0).attr("x", t.x());
  }
  // Set text content
  text(t) {
    return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
  }
}
m(kt, Ge);
p({
  Tspan: {
    tspan: v(function(n = "") {
      const t = new kt();
      return this._build || this.clear(), this.put(t).text(n);
    })
  },
  Text: {
    newLine: function(n = "") {
      return this.tspan(n).newLine();
    }
  }
});
y(kt, "Tspan");
class Nt extends R {
  constructor(t, e = t) {
    super(S("circle", t), e);
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
    return this.radius(new d(t).divide(2));
  }
}
m(Nt, { x: ke, y: Ne, cx: Oe, cy: Ee, width: Ie, height: ze });
p({
  Container: {
    // Create circle element
    circle: v(function(n = 0) {
      return this.put(new Nt()).size(n).move(0, 0);
    })
  }
});
y(Nt, "Circle");
class Ht extends I {
  constructor(t, e = t) {
    super(S("clipPath", t), e);
  }
  // Unclip all clipped elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unclip();
    }), super.remove();
  }
  targets() {
    return it("svg [clip-path*=" + this.id() + "]");
  }
}
p({
  Container: {
    // Create clipping element
    clip: v(function() {
      return this.defs().put(new Ht());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof Ht ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    // Unclip element
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
y(Ht, "ClipPath");
class Ye extends F {
  constructor(t, e = t) {
    super(S("foreignObject", t), e);
  }
}
p({
  Container: {
    foreignObject: v(function(n, t) {
      return this.put(new Ye()).size(n, t);
    })
  }
});
y(Ye, "ForeignObject");
function Zs(n, t) {
  return this.children().forEach((e) => {
    let s;
    try {
      s = e.node instanceof en().SVGSVGElement ? new N(e.attr(["x", "y", "width", "height"])) : e.bbox();
    } catch {
      return;
    }
    const i = new f(e), r = i.translate(n, t).transform(i.inverse()), a = new A(s.x, s.y).transform(r);
    e.move(a.x, a.y);
  }), this;
}
function Ks(n) {
  return this.dmove(n, 0);
}
function ti(n) {
  return this.dmove(0, n);
}
function ei(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function ni(n = 0, t = 0, e = this.bbox()) {
  const s = n - e.x, i = t - e.y;
  return this.dmove(s, i);
}
function si(n, t, e = this.bbox()) {
  const s = st(this, n, t, e), i = s.width / e.width, r = s.height / e.height;
  return this.children().forEach((a) => {
    const o = new A(e).transform(new f(a).inverse());
    a.scale(i, r, o.x, o.y);
  }), this;
}
function ii(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function ri(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function oi(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
const $e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dmove: Zs,
  dx: Ks,
  dy: ti,
  height: ei,
  move: ni,
  size: si,
  width: ii,
  x: ri,
  y: oi
}, Symbol.toStringTag, { value: "Module" }));
class Ot extends I {
  constructor(t, e = t) {
    super(S("g", t), e);
  }
}
m(Ot, $e);
p({
  Container: {
    // Create a group element
    group: v(function() {
      return this.put(new Ot());
    })
  }
});
y(Ot, "G");
class Mt extends I {
  constructor(t, e = t) {
    super(S("a", t), e);
  }
  // Link target attribute
  target(t) {
    return this.attr("target", t);
  }
  // Link url
  to(t) {
    return this.attr("href", t, dt);
  }
}
m(Mt, $e);
p({
  Container: {
    // Create a hyperlink element
    link: v(function(n) {
      return this.put(new Mt()).to(n);
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
      return t || (t = new Mt(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
y(Mt, "A");
class Xt extends I {
  // Initialize node
  constructor(t, e = t) {
    super(S("mask", t), e);
  }
  // Unmask all masked elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unmask();
    }), super.remove();
  }
  targets() {
    return it("svg [mask*=" + this.id() + "]");
  }
}
p({
  Container: {
    mask: v(function() {
      return this.defs().put(new Xt());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof Xt ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    // Unmask element
    unmask() {
      return this.attr("mask", null);
    }
  }
});
y(Xt, "Mask");
class He extends F {
  constructor(t, e = t) {
    super(S("stop", t), e);
  }
  // add color stops
  update(t) {
    return (typeof t == "number" || t instanceof d) && (t = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), t.opacity != null && this.attr("stop-opacity", t.opacity), t.color != null && this.attr("stop-color", t.color), t.offset != null && this.attr("offset", new d(t.offset)), this;
  }
}
p({
  Gradient: {
    // Add a color stop
    stop: function(n, t, e) {
      return this.put(new He()).update(n, t, e);
    }
  }
});
y(He, "Stop");
function ai(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const s in t)
    e += Ze(s) + ":" + t[s] + ";";
  return e += "}", e;
}
class Ut extends F {
  constructor(t, e = t) {
    super(S("style", t), e);
  }
  addText(t = "") {
    return this.node.textContent += t, this;
  }
  font(t, e, s = {}) {
    return this.rule("@font-face", {
      fontFamily: t,
      src: e,
      ...s
    });
  }
  rule(t, e) {
    return this.addText(ai(t, e));
  }
}
p("Dom", {
  style(n, t) {
    return this.put(new Ut()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new Ut()).font(n, t, e);
  }
});
y(Ut, "Style");
class he extends L {
  // Initialize node
  constructor(t, e = t) {
    super(S("textPath", t), e);
  }
  // return the array of the path track element
  array() {
    const t = this.track();
    return t ? t.array() : null;
  }
  // Plot path if any
  plot(t) {
    const e = this.track();
    let s = null;
    return e && (s = e.plot(t)), t == null ? s : this;
  }
  // Get the path element
  track() {
    return this.reference("href");
  }
}
p({
  Container: {
    textPath: v(function(n, t) {
      return n instanceof L || (n = this.text(n)), n.path(t);
    })
  },
  Text: {
    // Create path for text to run on
    path: v(function(n, t = !0) {
      const e = new he();
      n instanceof rt || (n = this.defs().path(n)), e.attr("href", "#" + n, dt);
      let s;
      if (t)
        for (; s = this.node.firstChild; )
          e.node.appendChild(s);
      return this.put(e);
    }),
    // Get the textPath children
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    // creates a textPath from this path
    text: v(function(n) {
      return n instanceof L || (n = new L().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return it("svg textPath").filter((n) => (n.attr("href") || "").includes(this.id()));
    }
  }
});
he.prototype.MorphArray = Z;
y(he, "TextPath");
class Xe extends R {
  constructor(t, e = t) {
    super(S("use", t), e);
  }
  // Use element as a reference
  use(t, e) {
    return this.attr("href", (e || "") + "#" + t, dt);
  }
}
p({
  Container: {
    // Create a use element
    use: v(function(n, t) {
      return this.put(new Xe()).use(n, t);
    })
  }
});
y(Xe, "Use");
const hi = O;
m([oe, ae, At, lt, St], E("viewbox"));
m([ct, bt, wt, rt], E("marker"));
m(L, E("Text"));
m(rt, E("Path"));
m(te, E("Defs"));
m([L, kt], E("Tspan"));
m([xt, mt, gt, z], E("radius"));
m(pt, E("EventTarget"));
m(H, E("Dom"));
m(F, E("Element"));
m(R, E("Shape"));
m([I, Re], E("Container"));
m(gt, E("Gradient"));
m(z, E("Runner"));
J.extend(Qe());
ks([
  d,
  x,
  N,
  f,
  nt,
  X,
  Z,
  A
]);
Ns();
const me = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY });
class ui {
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
    t.preventDefault(), t.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(me(t));
    const s = (e ? "mousemove" : "touchmove") + ".drag", i = (e ? "mouseup" : "touchend") + ".drag";
    ut(window, s, this.drag, this, { passive: !1 }), ut(window, i, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: t, handler: this, box: this.box });
  }
  // While dragging
  drag(t) {
    const { box: e, lastClick: s } = this, i = this.el.point(me(t)), r = i.x - s.x, a = i.y - s.y;
    if (!r && !a) return e;
    const o = e.x + r, h = e.y + a;
    this.box = new N(o, h, e.w, e.h), this.lastClick = i, !this.el.dispatch("dragmove", {
      event: t,
      handler: this,
      box: this.box,
      dx: r,
      dy: a
    }).defaultPrevented && this.move(o, h);
  }
  move(t, e) {
    this.el.type === "svg" ? Ot.prototype.move.call(this.el, t, e) : this.el.move(t, e);
  }
  endDrag(t) {
    this.drag(t), this.el.fire("dragend", { event: t, handler: this, box: this.box }), q(window, "mousemove.drag"), q(window, "touchmove.drag"), q(window, "mouseup.drag"), q(window, "touchend.drag"), this.init(!0);
  }
}
m(F, {
  draggable(n = !0) {
    return (this.remember("_draggable") || new ui(this)).init(n), this;
  }
});
class Ue {
  // Will be properly typed when Slate is available
  constructor(t, e) {
    this.id = t.id || this.generateId(), this.slate = e, this.options = {
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
      rotate: {
        rotationAngle: 0
      },
      textOffset: {
        x: 0,
        y: 0
      },
      ...t
    }, this.create();
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }
  create() {
    this.svgGroup = this.slate.canvas.group(), this.createBackground(), this.createText(), this.position(this.options.x, this.options.y), this.options.allowDrag && !this.options.isLocked && this.makeDraggable();
  }
  createBackground() {
    const { width: t, height: e, backgroundColor: s, borderColor: i, borderWidth: r, shape: a } = this.options;
    switch (a) {
      case "circle":
        const o = Math.min(t, e) / 2;
        this.backgroundRect = this.svgGroup.circle(o * 2).fill(s).stroke({ color: i, width: r });
        break;
      case "ellipse":
        this.backgroundRect = this.svgGroup.ellipse(t, e).fill(s).stroke({ color: i, width: r });
        break;
      default:
        this.backgroundRect = this.svgGroup.rect(t, e).fill(s).stroke({ color: i, width: r }).radius(4);
        break;
    }
  }
  createText() {
    const { text: t, fontSize: e, fontFamily: s, fontColor: i, textOpacity: r } = this.options;
    this.textElement = this.svgGroup.text(t).font({
      family: s,
      size: e,
      fill: i,
      opacity: r
    }), this.centerText();
  }
  centerText() {
    const { width: t, height: e, textXAlign: s, textYAlign: i, textOffset: r } = this.options, a = this.textElement.bbox();
    let o = r.x || 0, h = r.y || 0;
    switch (s) {
      case "left":
        o += 5;
        break;
      case "right":
        o += t - a.width - 5;
        break;
      default:
        o += (t - a.width) / 2;
        break;
    }
    switch (i) {
      case "top":
        h += 5;
        break;
      case "bottom":
        h += e - a.height - 5;
        break;
      default:
        h += (e - a.height) / 2;
        break;
    }
    this.textElement.move(o, h);
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("dragstart", (t) => {
      this.toFront();
    }), this.svgGroup.on("dragend", (t) => {
      const e = this.svgGroup.bbox();
      this.options.x = e.x, this.options.y = e.y;
    });
  }
  position(t, e, s, i, r) {
    this.options.x = t, this.options.y = e, r && r > 0 ? this.svgGroup.animate(r, i || "-").move(t, e).after(s || (() => {
    })) : (this.svgGroup.move(t, e), s && s());
  }
  toFront() {
    this.svgGroup.front();
  }
  toBack() {
    this.svgGroup.back();
  }
  remove() {
    this.svgGroup.remove();
  }
  hide() {
    this.svgGroup.hide();
  }
  show() {
    this.svgGroup.show();
  }
  setText(t) {
    this.options.text = t, this.textElement.text(t), this.centerText();
  }
  setSize(t, e) {
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof xt)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof Nt) {
      const s = Math.min(t, e) / 2;
      this.backgroundRect.radius(s);
    } else this.backgroundRect instanceof mt && this.backgroundRect.size(t, e);
    this.centerText();
  }
  setColors(t, e) {
    t && (this.options.backgroundColor = t, this.backgroundRect.fill(t)), e && (this.options.borderColor = e, this.backgroundRect.stroke({ color: e }));
  }
  lock() {
    this.options.isLocked = !0, this.options.allowDrag = !1, this.svgGroup.draggable && this.svgGroup.draggable(!1);
  }
  unlock() {
    this.options.isLocked = !1, this.options.allowDrag = !0, this.makeDraggable();
  }
}
class li {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Ue(t, this.slate);
    return this.nodes.set(e.id, e), e;
  }
  remove(t) {
    const e = this.nodes.get(t);
    return e ? (e.remove(), this.nodes.delete(t), !0) : !1;
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
  moveNodes(t, e = {}) {
    t.data && Array.isArray(t.data.nodes) && t.data.nodes.forEach((s) => {
      const i = this.one(s.id);
      if (i) {
        const r = e.animate ? t.data.dur || 500 : 0;
        i.position(s.x, s.y, void 0, void 0, r);
      }
    });
  }
  addRelationship(t) {
    console.log("Adding relationship:", t);
  }
  removeRelationship(t) {
    console.log("Removing relationship:", t);
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
class ci {
  constructor(t) {
    this.slate = t;
  }
  onZoom(t) {
    if (this.slate.options.followMe) {
      const e = this.slate.options.viewPort.originalWidth / t.data.zoomLevel * 100;
      console.log("Zoom to:", e + "%");
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
    const e = this.slate.nodes.one(t.data.id);
    e?.links && e.links.set(t, !1);
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
    e && t.data.behaviorChanges.forEach((s) => {
      typeof s.value == "object" ? (e.options[s.name] = s.value.val, Object.keys(s.value).forEach((i) => {
        i !== "val" && (e.options[i] = s.value[i]);
      })) : e.options[s.name] = s.value;
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
    e && (Object.assign(e.options, t.data), console.log("Shape changed for node:", t.data.id));
  }
  onNodeAdded(t) {
    if (t.data?.multiSelectCopy)
      console.log("Multi-select copy:", t.data);
    else if (t.data.id)
      this.slate.nodes.one(t.data.id) && this.slate.nodes.add({
        ...t.data.options,
        x: t.data.targetXPos || 100,
        y: t.data.targetYPos || 100
      });
    else {
      let e = t.data.nodeOptions;
      Array.isArray(e) || (e = [e]), e.forEach((s) => {
        this.slate.nodes.one(s.id) || this.slate.nodes.add(s);
      });
    }
  }
  onNodeImageChanged(t) {
    this.slate.nodes.one(t.data.id) && console.log("Image changed for node:", t.data.id);
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
    e && (e.options.textOffset = t.data.textOffset, Object.assign(e.options, t.data), console.log("Node rotated:", t.data.id));
  }
  onNodeColorChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && e.setColors(t.data.backgroundColor, t.data.borderColor);
  }
  onNodeTextChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (e.setText(t.data.text), e.options.fontSize = t.data.fontSize, e.options.fontFamily = t.data.fontFamily, e.options.fontColor = t.data.fontColor, e.options.textOpacity = t.data.textOpacity, e.options.textXAlign = t.data.textXAlign, e.options.textYAlign = t.data.textYAlign);
  }
  onNodeAITextChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (e.options.ai = { ...t.data.ai, ...e.options.ai });
  }
  addRelationship(t) {
    this.slate.nodes.addRelationship(t.data);
  }
  removeRelationship(t) {
    this.slate.nodes.removeRelationship(t.data);
  }
  onNodesMove(t) {
    this.slate.nodes.moveNodes(t, { animate: t.data.dur > 0 });
  }
  onNodeEffectChanged(t) {
    this.slate.nodes.one(t.data.id) && console.log("Effect changed for node:", t.data.id);
  }
  onNodeBorderPropertiesChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (e.options.borderColor = t.data.borderColor, e.options.borderWidth = t.data.borderWidth, e.setColors(void 0, t.data.borderColor));
  }
  onLinePropertiesChanged(t) {
    (Array.isArray(t.data) ? t.data : [t.data]).forEach((s) => {
      const i = this.slate.nodes.one(s.id);
      i && Object.assign(i.options, s.options);
    });
  }
  onFollowMeChanged(t) {
    this.slate.options.followMe = t.data?.followMe;
  }
  onCanvasMove(t) {
    this.slate.options.followMe && console.log("Canvas move:", t.data);
  }
  onSlateThemeChanged(t) {
    this.slate.options.themeId = t.data?.theme?._id, t.data?.theme && console.log("Theme changed:", t.data.theme);
  }
  onSlateLayoutTypeChanged(t) {
    t.data.layoutType != null && (this.slate.options.layoutType = t.data.layoutType), t.data.disableAutoLayoutOfManuallyPositionedNodes != null && (this.slate.options.disableAutoLayoutOfManuallyPositionedNodes = t.data.disableAutoLayoutOfManuallyPositionedNodes);
  }
  onSlateBackgroundEffectChanged(t) {
    this.slate.options.containerStyle.backgroundEffect = t.data.effect, console.log("Background effect changed:", t.data.effect);
  }
  onSlateBackgroundImageChanged(t) {
    if (t.data.bg)
      this.slate.options.containerStyle.backgroundImage = t.data.bg.url, this.slate.options.containerStyle.backgroundSize = t.data.bg.size;
    else {
      const e = this.slate.options.containerStyle.prevBackgroundColor || "#fff";
      this.slate.options.containerStyle.backgroundColor = e, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
    }
  }
  onSlateBackgroundColorChanged(t) {
    this.slate.options.containerStyle.backgroundColor = t.data.color, this.slate.options.containerStyle.backgroundColorAsGradient = t.data.asGradient, this.slate.options.containerStyle.backgroundGradientType = t.data.gradientType, this.slate.options.containerStyle.backgroundGradientColors = t.data.gradientColors, this.slate.options.containerStyle.backgroundGradientStrategy = t.data.gradientStrategy, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
  }
  onLineColorChanged(t) {
    this.slate.options.defaultLineColor = t.data.color, this.slate.nodes.allNodes.forEach((e) => {
      e.options.lineColor = t.data.color, e.relationships?.associations && (e.relationships.associations.forEach((s) => {
        s.lineColor = t.data.color;
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
class We {
  constructor(t, e = {}) {
    if (typeof t == "string") {
      const s = document.querySelector(t);
      if (!s)
        throw new Error(`Element with selector "${t}" not found`);
      this.element = s;
    } else
      this.element = t;
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
        snapToObjects: !1
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
      ...e
    }, this.init();
  }
  init() {
    this.canvas = hi().addTo(this.element);
    const t = this.options.viewPort?.originalWidth || 800, e = this.options.viewPort?.originalHeight || 600;
    this.canvas.size(t, e), this.canvas.rect(t, e).fill(this.options.containerStyle?.backgroundColor || "#ffffff").move(0, 0).back(), this.nodes = new li(this), this.invoker = new ci(this), this.makeResponsive();
  }
  makeResponsive() {
    const t = this.options.viewPort?.originalWidth || 800, e = this.options.viewPort?.originalHeight || 600;
    this.canvas.viewbox(0, 0, t, e);
  }
  addNode(t = {}) {
    return this.nodes.add(t);
  }
  removeNode(t) {
    return this.nodes.remove(t);
  }
  getNode(t) {
    return this.nodes.one(t);
  }
  getAllNodes() {
    return this.nodes.allNodes;
  }
}
function fi(n, t = {}) {
  return new We(n, t);
}
typeof window < "u" && (window.SlateboxJS = fi, window.Slate = We, window.Node = Ue);
export {
  ci as Invoker,
  Ue as Node,
  We as Slate,
  fi as SlateboxJS,
  fi as default
};
//# sourceMappingURL=slateboxjs.es.js.map
