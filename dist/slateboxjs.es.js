const Vt = {}, Re = [];
function b(e, t) {
  if (Array.isArray(e)) {
    for (const n of e)
      b(n, t);
    return;
  }
  if (typeof e == "object") {
    for (const n in e)
      b(n, e[n]);
    return;
  }
  ke(Object.getOwnPropertyNames(t)), Vt[e] = Object.assign(Vt[e] || {}, t);
}
function R(e) {
  return Vt[e] || {};
}
function Sn() {
  return [...new Set(Re)];
}
function ke(e) {
  Re.push(...e);
}
function re(e, t) {
  let n;
  const i = e.length, s = [];
  for (n = 0; n < i; n++)
    s.push(t(e[n]));
  return s;
}
function zn(e, t) {
  let n;
  const i = e.length, s = [];
  for (n = 0; n < i; n++)
    t(e[n]) && s.push(e[n]);
  return s;
}
function Lt(e) {
  return e % 360 * Math.PI / 180;
}
function Mn(e) {
  return e.replace(/([A-Z])/g, function(t, n) {
    return "-" + n.toLowerCase();
  });
}
function Oe(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function dt(e, t, n, i) {
  return (t == null || n == null) && (i = i || e.bbox(), t == null ? t = i.width / i.height * n : n == null && (n = i.height / i.width * t)), {
    width: t,
    height: n
  };
}
function Xt(e, t) {
  const n = e.origin;
  let i = e.ox != null ? e.ox : e.originX != null ? e.originX : "center", s = e.oy != null ? e.oy : e.originY != null ? e.originY : "center";
  n != null && ([i, s] = Array.isArray(n) ? n : typeof n == "object" ? [n.x, n.y] : [n, n]);
  const o = typeof i == "string", r = typeof s == "string";
  if (o || r) {
    const { height: a, width: h, x: l, y: u } = t.bbox();
    o && (i = i.includes("left") ? l : i.includes("right") ? l + h : l + h / 2), r && (s = s.includes("top") ? u : s.includes("bottom") ? u + a : u + a / 2);
  }
  return [i, s];
}
const Cn = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), Ut = (e) => Cn.has(e.nodeName), De = (e, t, n = {}) => {
  const i = { ...t };
  for (const s in i)
    i[s].valueOf() === n[s] && delete i[s];
  Object.keys(i).length ? e.node.setAttribute("data-svgjs", JSON.stringify(i)) : (e.node.removeAttribute("data-svgjs"), e.node.removeAttribute("svgjs:data"));
}, ae = "http://www.w3.org/2000/svg", En = "http://www.w3.org/1999/xhtml", jt = "http://www.w3.org/2000/xmlns/", St = "http://www.w3.org/1999/xlink", _ = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function he() {
  return _.window;
}
class le {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}
const st = {}, ue = "___SYMBOL___ROOT___";
function vt(e, t = ae) {
  return _.document.createElementNS(t, e);
}
function N(e, t = !1) {
  if (e instanceof le) return e;
  if (typeof e == "object")
    return Ht(e);
  if (e == null)
    return new st[ue]();
  if (typeof e == "string" && e.charAt(0) !== "<")
    return Ht(_.document.querySelector(e));
  const n = t ? _.document.createElement("div") : vt("svg");
  return n.innerHTML = e, e = Ht(n.firstChild), n.removeChild(n.firstChild), e;
}
function T(e, t) {
  return t && (t instanceof _.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : vt(e);
}
function j(e) {
  if (!e) return null;
  if (e.instance instanceof le) return e.instance;
  if (e.nodeName === "#document-fragment")
    return new st.Fragment(e);
  let t = Oe(e.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : st[t] || (t = "Dom"), new st[t](e);
}
let Ht = j;
function S(e, t = e.name, n = !1) {
  return st[t] = e, n && (st[ue] = e), ke(Object.getOwnPropertyNames(e.prototype)), e;
}
function Tn(e) {
  return st[e];
}
let An = 1e3;
function Be(e) {
  return "Svgjs" + Oe(e) + An++;
}
function Le(e) {
  for (let t = e.children.length - 1; t >= 0; t--)
    Le(e.children[t]);
  return e.id && (e.id = Be(e.nodeName)), e;
}
function w(e, t) {
  let n, i;
  for (e = Array.isArray(e) ? e : [e], i = e.length - 1; i >= 0; i--)
    for (n in t)
      e[i].prototype[n] = t[n];
}
function E(e) {
  return function(...t) {
    const n = t[t.length - 1];
    return n && n.constructor === Object && !(n instanceof Array) ? e.apply(this, t.slice(0, -1)).attr(n) : e.apply(this, t);
  };
}
function Pn() {
  return this.parent().children();
}
function Zn() {
  return this.parent().index(this);
}
function In() {
  return this.siblings()[this.position() + 1];
}
function Nn() {
  return this.siblings()[this.position() - 1];
}
function Rn() {
  const e = this.position();
  return this.parent().add(this.remove(), e + 1), this;
}
function kn() {
  const e = this.position();
  return this.parent().add(this.remove(), e ? e - 1 : 0), this;
}
function On() {
  return this.parent().add(this.remove()), this;
}
function Dn() {
  return this.parent().add(this.remove(), 0), this;
}
function Bn(e) {
  e = N(e), e.remove();
  const t = this.position();
  return this.parent().add(e, t), this;
}
function Ln(e) {
  e = N(e), e.remove();
  const t = this.position();
  return this.parent().add(e, t + 1), this;
}
function jn(e) {
  return e = N(e), e.before(this), this;
}
function Hn(e) {
  return e = N(e), e.after(this), this;
}
b("Dom", {
  siblings: Pn,
  position: Zn,
  next: In,
  prev: Nn,
  forward: Rn,
  backward: kn,
  front: On,
  back: Dn,
  before: Bn,
  after: Ln,
  insertBefore: jn,
  insertAfter: Hn
});
const je = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, Fn = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, qn = /rgb\((\d+),(\d+),(\d+)\)/, Gn = /(#[a-z_][a-z0-9\-_]*)/i, Yn = /\)\s*,?\s*/, Vn = /\s/g, ze = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, Me = /^rgb\(/, Ce = /^(\s+)?$/, Ee = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Xn = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, X = /[\s,]+/, ce = /[MLHVCSQTAZ]/i;
function Un() {
  const e = this.attr("class");
  return e == null ? [] : e.trim().split(X);
}
function Wn(e) {
  return this.classes().indexOf(e) !== -1;
}
function $n(e) {
  if (!this.hasClass(e)) {
    const t = this.classes();
    t.push(e), this.attr("class", t.join(" "));
  }
  return this;
}
function Qn(e) {
  return this.hasClass(e) && this.attr(
    "class",
    this.classes().filter(function(t) {
      return t !== e;
    }).join(" ")
  ), this;
}
function Jn(e) {
  return this.hasClass(e) ? this.removeClass(e) : this.addClass(e);
}
b("Dom", {
  classes: Un,
  hasClass: Wn,
  addClass: $n,
  removeClass: Qn,
  toggleClass: Jn
});
function Kn(e, t) {
  const n = {};
  if (arguments.length === 0)
    return this.node.style.cssText.split(/\s*;\s*/).filter(function(i) {
      return !!i.length;
    }).forEach(function(i) {
      const s = i.split(/\s*:\s*/);
      n[s[0]] = s[1];
    }), n;
  if (arguments.length < 2) {
    if (Array.isArray(e)) {
      for (const i of e) {
        const s = i;
        n[i] = this.node.style.getPropertyValue(s);
      }
      return n;
    }
    if (typeof e == "string")
      return this.node.style.getPropertyValue(e);
    if (typeof e == "object")
      for (const i in e)
        this.node.style.setProperty(
          i,
          e[i] == null || Ce.test(e[i]) ? "" : e[i]
        );
  }
  return arguments.length === 2 && this.node.style.setProperty(
    e,
    t == null || Ce.test(t) ? "" : t
  ), this;
}
function ti() {
  return this.css("display", "");
}
function ei() {
  return this.css("display", "none");
}
function ni() {
  return this.css("display") !== "none";
}
b("Dom", {
  css: Kn,
  show: ti,
  hide: ei,
  visible: ni
});
function ii(e, t, n) {
  if (e == null)
    return this.data(
      re(
        zn(
          this.node.attributes,
          (i) => i.nodeName.indexOf("data-") === 0
        ),
        (i) => i.nodeName.slice(5)
      )
    );
  if (e instanceof Array) {
    const i = {};
    for (const s of e)
      i[s] = this.data(s);
    return i;
  } else if (typeof e == "object")
    for (t in e)
      this.data(t, e[t]);
  else if (arguments.length < 2)
    try {
      return JSON.parse(this.attr("data-" + e));
    } catch {
      return this.attr("data-" + e);
    }
  else
    this.attr(
      "data-" + e,
      t === null ? null : n === !0 || typeof t == "string" || typeof t == "number" ? t : JSON.stringify(t)
    );
  return this;
}
b("Dom", { data: ii });
function si(e, t) {
  if (typeof arguments[0] == "object")
    for (const n in e)
      this.remember(n, e[n]);
  else {
    if (arguments.length === 1)
      return this.memory()[e];
    this.memory()[e] = t;
  }
  return this;
}
function oi() {
  if (arguments.length === 0)
    this._memory = {};
  else
    for (let e = arguments.length - 1; e >= 0; e--)
      delete this.memory()[arguments[e]];
  return this;
}
function ri() {
  return this._memory = this._memory || {};
}
b("Dom", { remember: si, forget: oi, memory: ri });
function ai(e) {
  return e.length === 4 ? [
    "#",
    e.substring(1, 2),
    e.substring(1, 2),
    e.substring(2, 3),
    e.substring(2, 3),
    e.substring(3, 4),
    e.substring(3, 4)
  ].join("") : e;
}
function hi(e) {
  const t = Math.round(e), i = Math.max(0, Math.min(255, t)).toString(16);
  return i.length === 1 ? "0" + i : i;
}
function at(e, t) {
  for (let n = t.length; n--; )
    if (e[t[n]] == null)
      return !1;
  return !0;
}
function li(e, t) {
  const n = at(e, "rgb") ? { _a: e.r, _b: e.g, _c: e.b, _d: 0, space: "rgb" } : at(e, "xyz") ? { _a: e.x, _b: e.y, _c: e.z, _d: 0, space: "xyz" } : at(e, "hsl") ? { _a: e.h, _b: e.s, _c: e.l, _d: 0, space: "hsl" } : at(e, "lab") ? { _a: e.l, _b: e.a, _c: e.b, _d: 0, space: "lab" } : at(e, "lch") ? { _a: e.l, _b: e.c, _c: e.h, _d: 0, space: "lch" } : at(e, "cmyk") ? { _a: e.c, _b: e.m, _c: e.y, _d: e.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
  return n.space = t || n.space, n;
}
function ui(e) {
  return e === "lab" || e === "xyz" || e === "lch";
}
function Ft(e, t, n) {
  return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
class C {
  constructor(...t) {
    this.init(...t);
  }
  // Test if given value is a color
  static isColor(t) {
    return t && (t instanceof C || this.isRgb(t) || this.test(t));
  }
  // Test if given value is an rgb object
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  /*
  Generating random colors
  */
  static random(t = "vibrant", n) {
    const { random: i, round: s, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * i() + 57, h = 38 * i() + 45, l = 360 * i();
      return new C(a, h, l, "lch");
    } else if (t === "sine") {
      n = n ?? i();
      const a = s(80 * o(2 * r * n / 0.5 + 0.01) + 150), h = s(50 * o(2 * r * n / 0.5 + 4.6) + 200), l = s(100 * o(2 * r * n / 0.5 + 2.3) + 150);
      return new C(a, h, l);
    } else if (t === "pastel") {
      const a = 8 * i() + 86, h = 17 * i() + 9, l = 360 * i();
      return new C(a, h, l, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * i(), h = 50 * i() + 86, l = 360 * i();
      return new C(a, h, l, "lch");
    } else if (t === "rgb") {
      const a = 255 * i(), h = 255 * i(), l = 255 * i();
      return new C(a, h, l);
    } else if (t === "lab") {
      const a = 100 * i(), h = 256 * i() - 128, l = 256 * i() - 128;
      return new C(a, h, l, "lab");
    } else if (t === "grey") {
      const a = 255 * i();
      return new C(a, a, a);
    } else
      throw new Error("Unsupported random color mode");
  }
  // Test if given value is a color string
  static test(t) {
    return typeof t == "string" && (ze.test(t) || Me.test(t));
  }
  cmyk() {
    const { _a: t, _b: n, _c: i } = this.rgb(), [s, o, r] = [t, n, i].map((g) => g / 255), a = Math.min(1 - s, 1 - o, 1 - r);
    if (a === 1)
      return new C(0, 0, 0, 1, "cmyk");
    const h = (1 - s - a) / (1 - a), l = (1 - o - a) / (1 - a), u = (1 - r - a) / (1 - a);
    return new C(h, l, u, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: n, _c: i } = this.rgb(), [s, o, r] = [t, n, i].map((d) => d / 255), a = Math.max(s, o, r), h = Math.min(s, o, r), l = (a + h) / 2, u = a === h, c = a - h, g = u ? 0 : l > 0.5 ? c / (2 - a - h) : c / (a + h), x = u ? 0 : a === s ? ((o - r) / c + (o < r ? 6 : 0)) / 6 : a === o ? ((r - s) / c + 2) / 6 : a === r ? ((s - o) / c + 4) / 6 : 0;
    return new C(360 * x, 100 * g, 100 * l, "hsl");
  }
  init(t = 0, n = 0, i = 0, s = 0, o = "rgb") {
    if (t = t || 0, this.space)
      for (const c in this.space)
        delete this[this.space[c]];
    if (typeof t == "number")
      o = typeof s == "string" ? s : o, s = typeof s == "string" ? 0 : s, Object.assign(this, { _a: t, _b: n, _c: i, _d: s, space: o });
    else if (t instanceof Array)
      this.space = n || (typeof t[3] == "string" ? t[3] : t[4]) || "rgb", Object.assign(this, { _a: t[0], _b: t[1], _c: t[2], _d: t[3] || 0 });
    else if (t instanceof Object) {
      const c = li(t, n);
      Object.assign(this, c);
    } else if (typeof t == "string")
      if (Me.test(t)) {
        const c = t.replace(Vn, ""), [g, x, p] = qn.exec(c).slice(1, 4).map((d) => parseInt(d));
        Object.assign(this, { _a: g, _b: x, _c: p, _d: 0, space: "rgb" });
      } else if (ze.test(t)) {
        const c = (d) => parseInt(d, 16), [, g, x, p] = Fn.exec(ai(t)).map(c);
        Object.assign(this, { _a: g, _b: x, _c: p, _d: 0, space: "rgb" });
      } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: h, _d: l } = this, u = this.space === "rgb" ? { r, g: a, b: h } : this.space === "xyz" ? { x: r, y: a, z: h } : this.space === "hsl" ? { h: r, s: a, l: h } : this.space === "lab" ? { l: r, a, b: h } : this.space === "lch" ? { l: r, c: a, h } : this.space === "cmyk" ? { c: r, m: a, y: h, k: l } : {};
    Object.assign(this, u);
  }
  lab() {
    const { x: t, y: n, z: i } = this.xyz(), s = 116 * n - 16, o = 500 * (t - n), r = 200 * (n - i);
    return new C(s, o, r, "lab");
  }
  lch() {
    const { l: t, a: n, b: i } = this.lab(), s = Math.sqrt(n ** 2 + i ** 2);
    let o = 180 * Math.atan2(i, n) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new C(t, s, o, "lch");
  }
  /*
  Conversion Methods
  */
  rgb() {
    if (this.space === "rgb")
      return this;
    if (ui(this.space)) {
      let { x: t, y: n, z: i } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: x, a: p, b: d } = this;
        if (this.space === "lch") {
          const { c: et, h: At } = this, Pt = Math.PI / 180;
          p = et * Math.cos(Pt * At), d = et * Math.sin(Pt * At);
        }
        const y = (x + 16) / 116, v = p / 500 + y, A = y - d / 200, F = 16 / 116, U = 8856e-6, W = 7.787;
        t = 0.95047 * (v ** 3 > U ? v ** 3 : (v - F) / W), n = 1 * (y ** 3 > U ? y ** 3 : (y - F) / W), i = 1.08883 * (A ** 3 > U ? A ** 3 : (A - F) / W);
      }
      const s = t * 3.2406 + n * -1.5372 + i * -0.4986, o = t * -0.9689 + n * 1.8758 + i * 0.0415, r = t * 0.0557 + n * -0.204 + i * 1.057, a = Math.pow, h = 31308e-7, l = s > h ? 1.055 * a(s, 1 / 2.4) - 0.055 : 12.92 * s, u = o > h ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, c = r > h ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new C(255 * l, 255 * u, 255 * c);
    } else if (this.space === "hsl") {
      let { h: t, s: n, l: i } = this;
      if (t /= 360, n /= 100, i /= 100, n === 0)
        return i *= 255, new C(i, i, i);
      const s = i < 0.5 ? i * (1 + n) : i + n - i * n, o = 2 * i - s, r = 255 * Ft(o, s, t + 1 / 3), a = 255 * Ft(o, s, t), h = 255 * Ft(o, s, t - 1 / 3);
      return new C(r, a, h);
    } else if (this.space === "cmyk") {
      const { c: t, m: n, y: i, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), r = 255 * (1 - Math.min(1, n * (1 - s) + s)), a = 255 * (1 - Math.min(1, i * (1 - s) + s));
      return new C(o, r, a);
    } else
      return this;
  }
  toArray() {
    const { _a: t, _b: n, _c: i, _d: s, space: o } = this;
    return [t, n, i, s, o];
  }
  toHex() {
    const [t, n, i] = this._clamped().map(hi);
    return `#${t}${n}${i}`;
  }
  toRgb() {
    const [t, n, i] = this._clamped();
    return `rgb(${t},${n},${i})`;
  }
  toString() {
    return this.toHex();
  }
  xyz() {
    const { _a: t, _b: n, _c: i } = this.rgb(), [s, o, r] = [t, n, i].map((v) => v / 255), a = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, h = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, l = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, u = (a * 0.4124 + h * 0.3576 + l * 0.1805) / 0.95047, c = (a * 0.2126 + h * 0.7152 + l * 0.0722) / 1, g = (a * 0.0193 + h * 0.1192 + l * 0.9505) / 1.08883, x = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116, p = c > 8856e-6 ? Math.pow(c, 1 / 3) : 7.787 * c + 16 / 116, d = g > 8856e-6 ? Math.pow(g, 1 / 3) : 7.787 * g + 16 / 116;
    return new C(x, p, d, "xyz");
  }
  /*
  Input and Output methods
  */
  _clamped() {
    const { _a: t, _b: n, _c: i } = this.rgb(), { max: s, min: o, round: r } = Math, a = (h) => s(0, o(r(h), 255));
    return [t, n, i].map(a);
  }
  /*
  Constructing colors
  */
}
class P {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  // Clone point
  clone() {
    return new P(this);
  }
  init(t, n) {
    const i = { x: 0, y: 0 }, s = Array.isArray(t) ? { x: t[0], y: t[1] } : typeof t == "object" ? { x: t.x, y: t.y } : { x: t, y: n };
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
    f.isMatrixLike(t) || (t = new f(t));
    const { x: n, y: i } = this;
    return this.x = t.a * n + t.c * i + t.e, this.y = t.b * n + t.d * i + t.f, this;
  }
}
function ci(e, t) {
  return new P(e, t).transformO(this.screenCTM().inverseO());
}
function ht(e, t, n) {
  return Math.abs(t - e) < 1e-6;
}
class f {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const n = t.flip === "both" || t.flip === !0, i = t.flip && (n || t.flip === "x") ? -1 : 1, s = t.flip && (n || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleX) ? t.scaleX * i : i, h = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, l = t.shear || 0, u = t.rotate || t.theta || 0, c = new P(
      t.origin || t.around || t.ox || t.originX,
      t.oy || t.originY
    ), g = c.x, x = c.y, p = new P(
      t.position || t.px || t.positionX || NaN,
      t.py || t.positionY || NaN
    ), d = p.x, y = p.y, v = new P(
      t.translate || t.tx || t.translateX,
      t.ty || t.translateY
    ), A = v.x, F = v.y, U = new P(
      t.relative || t.rx || t.relativeX,
      t.ry || t.relativeY
    ), W = U.x, et = U.y;
    return {
      scaleX: a,
      scaleY: h,
      skewX: o,
      skewY: r,
      shear: l,
      theta: u,
      rx: W,
      ry: et,
      tx: A,
      ty: F,
      ox: g,
      oy: x,
      px: d,
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
  static matrixMultiply(t, n, i) {
    const s = t.a * n.a + t.c * n.b, o = t.b * n.a + t.d * n.b, r = t.a * n.c + t.c * n.d, a = t.b * n.c + t.d * n.d, h = t.e + t.a * n.e + t.c * n.f, l = t.f + t.b * n.e + t.d * n.f;
    return i.a = s, i.b = o, i.c = r, i.d = a, i.e = h, i.f = l, i;
  }
  around(t, n, i) {
    return this.clone().aroundO(t, n, i);
  }
  // Transform around a center point
  aroundO(t, n, i) {
    const s = t || 0, o = n || 0;
    return this.translateO(-s, -o).lmultiplyO(i).translateO(s, o);
  }
  // Clones this matrix
  clone() {
    return new f(this);
  }
  // Decomposes this matrix into its affine parameters
  decompose(t = 0, n = 0) {
    const i = this.a, s = this.b, o = this.c, r = this.d, a = this.e, h = this.f, l = i * r - s * o, u = l > 0 ? 1 : -1, c = u * Math.sqrt(i * i + s * s), g = Math.atan2(u * s, u * i), x = 180 / Math.PI * g, p = Math.cos(g), d = Math.sin(g), y = (i * o + s * r) / l, v = o * c / (y * i - s) || r * c / (y * s + i), A = a - t + t * p * c + n * (y * p * c - d * v), F = h - n + t * d * c + n * (y * d * c + p * v);
    return {
      // Return the affine parameters
      scaleX: c,
      scaleY: v,
      shear: y,
      rotate: x,
      translateX: A,
      translateY: F,
      originX: t,
      originY: n,
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
    const n = new f(t);
    return ht(this.a, n.a) && ht(this.b, n.b) && ht(this.c, n.c) && ht(this.d, n.d) && ht(this.e, n.e) && ht(this.f, n.f);
  }
  // Flip matrix on x or y, at a given offset
  flip(t, n) {
    return this.clone().flipO(t, n);
  }
  flipO(t, n) {
    return t === "x" ? this.scaleO(-1, 1, n, 0) : t === "y" ? this.scaleO(1, -1, 0, n) : this.scaleO(-1, -1, t, n || t);
  }
  // Initialize
  init(t) {
    const n = f.fromArray([1, 0, 0, 1, 0, 0]);
    return t = t instanceof B ? t.matrixify() : typeof t == "string" ? f.fromArray(t.split(X).map(parseFloat)) : Array.isArray(t) ? f.fromArray(t) : typeof t == "object" && f.isMatrixLike(t) ? t : typeof t == "object" ? new f().transform(t) : arguments.length === 6 ? f.fromArray([].slice.call(arguments)) : n, this.a = t.a != null ? t.a : n.a, this.b = t.b != null ? t.b : n.b, this.c = t.c != null ? t.c : n.c, this.d = t.d != null ? t.d : n.d, this.e = t.e != null ? t.e : n.e, this.f = t.f != null ? t.f : n.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  // Inverses matrix
  inverseO() {
    const t = this.a, n = this.b, i = this.c, s = this.d, o = this.e, r = this.f, a = t * s - n * i;
    if (!a) throw new Error("Cannot invert " + this);
    const h = s / a, l = -n / a, u = -i / a, c = t / a, g = -(h * o + u * r), x = -(l * o + c * r);
    return this.a = h, this.b = l, this.c = u, this.d = c, this.e = g, this.f = x, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const n = this, i = t instanceof f ? t : new f(t);
    return f.matrixMultiply(i, n, this);
  }
  // Left multiplies by the given matrix
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const n = this, i = t instanceof f ? t : new f(t);
    return f.matrixMultiply(n, i, this);
  }
  // Rotate matrix
  rotate(t, n, i) {
    return this.clone().rotateO(t, n, i);
  }
  rotateO(t, n = 0, i = 0) {
    t = Lt(t);
    const s = Math.cos(t), o = Math.sin(t), { a: r, b: a, c: h, d: l, e: u, f: c } = this;
    return this.a = r * s - a * o, this.b = a * s + r * o, this.c = h * s - l * o, this.d = l * s + h * o, this.e = u * s - c * o + i * o - n * s + n, this.f = c * s + u * o - n * o - i * s + i, this;
  }
  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, n = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = n, n = t);
    const { a: o, b: r, c: a, d: h, e: l, f: u } = this;
    return this.a = o * t, this.b = r * n, this.c = a * t, this.d = h * n, this.e = l * t - i * t + i, this.f = u * n - s * n + s, this;
  }
  // Shear matrix
  shear(t, n, i) {
    return this.clone().shearO(t, n, i);
  }
  // eslint-disable-next-line no-unused-vars
  shearO(t, n = 0, i = 0) {
    const { a: s, b: o, c: r, d: a, e: h, f: l } = this;
    return this.a = s + o * t, this.c = r + a * t, this.e = h + l * t - i * t, this;
  }
  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, n = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = n, n = t), t = Lt(t), n = Lt(n);
    const o = Math.tan(t), r = Math.tan(n), { a, b: h, c: l, d: u, e: c, f: g } = this;
    return this.a = a + h * o, this.b = h + a * r, this.c = l + u * o, this.d = u + l * r, this.e = c + g * o - s * o, this.f = g + c * r - i * r, this;
  }
  // SkewX
  skewX(t, n, i) {
    return this.skew(t, 0, n, i);
  }
  // SkewY
  skewY(t, n, i) {
    return this.skew(0, t, n, i);
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
    const n = f.formatTransforms(t), i = this, { x: s, y: o } = new P(n.ox, n.oy).transform(i), r = new f().translateO(n.rx, n.ry).lmultiplyO(i).translateO(-s, -o).scaleO(n.scaleX, n.scaleY).skewO(n.skewX, n.skewY).shearO(n.shear).rotateO(n.theta).translateO(s, o);
    if (isFinite(n.px) || isFinite(n.py)) {
      const a = new P(s, o).transform(r), h = isFinite(n.px) ? n.px - a.x : 0, l = isFinite(n.py) ? n.py - a.y : 0;
      r.translateO(h, l);
    }
    return r.translateO(n.tx, n.ty), r;
  }
  // Translate matrix
  translate(t, n) {
    return this.clone().translateO(t, n);
  }
  translateO(t, n) {
    return this.e += t || 0, this.f += n || 0, this;
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
function di() {
  return new f(this.node.getCTM());
}
function fi() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const e = this.rect(1, 1), t = e.node.getScreenCTM();
      return e.remove(), new f(t);
    }
    return new f(this.node.getScreenCTM());
  } catch {
    return console.warn(
      `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
    ), new f();
  }
}
S(f, "Matrix");
function Q() {
  if (!Q.nodes) {
    const e = N().size(2, 0);
    e.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), e.attr("focusable", "false"), e.attr("aria-hidden", "true");
    const t = e.path().node;
    Q.nodes = { svg: e, path: t };
  }
  if (!Q.nodes.svg.node.parentNode) {
    const e = _.document.body || _.document.documentElement;
    Q.nodes.svg.addTo(e);
  }
  return Q.nodes;
}
function He(e) {
  return !e.width && !e.height && !e.x && !e.y;
}
function pi(e) {
  return e === _.document || (_.document.documentElement.contains || function(t) {
    for (; t.parentNode; )
      t = t.parentNode;
    return t === _.document;
  }).call(_.document.documentElement, e);
}
class Z {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += _.window.pageXOffset, this.y += _.window.pageYOffset, new Z(this);
  }
  init(t) {
    const n = [0, 0, 0, 0];
    return t = typeof t == "string" ? t.split(X).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
      t.left != null ? t.left : t.x,
      t.top != null ? t.top : t.y,
      t.width,
      t.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : n, this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
  }
  isNulled() {
    return He(this);
  }
  // Merge rect box with another, return a new instance
  merge(t) {
    const n = Math.min(this.x, t.x), i = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - n, o = Math.max(this.y + this.height, t.y + t.height) - i;
    return new Z(n, i, s, o);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof f || (t = new f(t));
    let n = 1 / 0, i = -1 / 0, s = 1 / 0, o = -1 / 0;
    return [
      new P(this.x, this.y),
      new P(this.x2, this.y),
      new P(this.x, this.y2),
      new P(this.x2, this.y2)
    ].forEach(function(a) {
      a = a.transform(t), n = Math.min(n, a.x), i = Math.max(i, a.x), s = Math.min(s, a.y), o = Math.max(o, a.y);
    }), new Z(n, s, i - n, o - s);
  }
}
function Fe(e, t, n) {
  let i;
  try {
    if (i = t(e.node), He(i) && !pi(e.node))
      throw new Error("Element not in the dom");
  } catch {
    i = n(e);
  }
  return i;
}
function mi() {
  const n = Fe(this, (s) => s.getBBox(), (s) => {
    try {
      const o = s.clone().addTo(Q().svg).show(), r = o.node.getBBox();
      return o.remove(), r;
    } catch (o) {
      throw new Error(
        `Getting bbox of element "${s.node.nodeName}" is not possible: ${o.toString()}`
      );
    }
  });
  return new Z(n);
}
function gi(e) {
  const i = Fe(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(
      `Getting rbox of element "${o.node.nodeName}" is not possible`
    );
  }), s = new Z(i);
  return e ? s.transform(e.screenCTM().inverseO()) : s.addOffset();
}
function yi(e, t) {
  const n = this.bbox();
  return e > n.x && t > n.y && e < n.x + n.width && t < n.y + n.height;
}
b({
  viewbox: {
    viewbox(e, t, n, i) {
      return e == null ? new Z(this.attr("viewBox")) : this.attr("viewBox", new Z(e, t, n, i));
    },
    zoom(e, t) {
      let { width: n, height: i } = this.attr(["width", "height"]);
      if ((!n && !i || typeof n == "string" || typeof i == "string") && (n = this.node.clientWidth, i = this.node.clientHeight), !n || !i)
        throw new Error(
          "Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element"
        );
      const s = this.viewbox(), o = n / s.width, r = i / s.height, a = Math.min(o, r);
      if (e == null)
        return a;
      let h = a / e;
      h === 1 / 0 && (h = Number.MAX_SAFE_INTEGER / 100), t = t || new P(n / 2 / o + s.x, i / 2 / r + s.y);
      const l = new Z(s).transform(
        new f({ scale: h, origin: t })
      );
      return this.viewbox(l);
    }
  }
});
S(Z, "Box");
class ot extends Array {
  constructor(t = [], ...n) {
    if (super(t, ...n), typeof t == "number") return this;
    this.length = 0, this.push(...t);
  }
}
w([ot], {
  each(e, ...t) {
    return typeof e == "function" ? this.map((n, i, s) => e.call(n, n, i, s)) : this.map((n) => n[e](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const bi = ["toArray", "constructor", "each"];
ot.extend = function(e) {
  e = e.reduce((t, n) => (bi.includes(n) || n[0] === "_" || (n in Array.prototype && (t["$" + n] = Array.prototype[n]), t[n] = function(...i) {
    return this.each(n, ...i);
  }), t), {}), w([ot], e);
};
function ft(e, t) {
  return new ot(
    re((t || _.document).querySelectorAll(e), function(n) {
      return j(n);
    })
  );
}
function wi(e) {
  return ft(e, this.node);
}
function vi(e) {
  return j(this.node.querySelector(e));
}
let xi = 0;
const qe = {};
function Ge(e) {
  let t = e.getEventHolder();
  return t === _.window && (t = qe), t.events || (t.events = {}), t.events;
}
function de(e) {
  return e.getEventTarget();
}
function _i(e) {
  let t = e.getEventHolder();
  t === _.window && (t = qe), t.events && (t.events = {});
}
function V(e, t, n, i, s) {
  const o = n.bind(i || e), r = N(e), a = Ge(r), h = de(r);
  t = Array.isArray(t) ? t : t.split(X), n._svgjsListenerId || (n._svgjsListenerId = ++xi), t.forEach(function(l) {
    const u = l.split(".")[0], c = l.split(".")[1] || "*";
    a[u] = a[u] || {}, a[u][c] = a[u][c] || {}, a[u][c][n._svgjsListenerId] = o, h.addEventListener(u, o, s || !1);
  });
}
function H(e, t, n, i) {
  const s = N(e), o = Ge(s), r = de(s);
  typeof n == "function" && (n = n._svgjsListenerId, !n) || (t = Array.isArray(t) ? t : (t || "").split(X), t.forEach(function(a) {
    const h = a && a.split(".")[0], l = a && a.split(".")[1];
    let u, c;
    if (n)
      o[h] && o[h][l || "*"] && (r.removeEventListener(
        h,
        o[h][l || "*"][n],
        i || !1
      ), delete o[h][l || "*"][n]);
    else if (h && l) {
      if (o[h] && o[h][l]) {
        for (c in o[h][l])
          H(r, [h, l].join("."), c);
        delete o[h][l];
      }
    } else if (l)
      for (a in o)
        for (u in o[a])
          l === u && H(r, [a, l].join("."));
    else if (h) {
      if (o[h]) {
        for (u in o[h])
          H(r, [h, u].join("."));
        delete o[h];
      }
    } else {
      for (a in o)
        H(r, a);
      _i(s);
    }
  }));
}
function Si(e, t, n, i) {
  const s = de(e);
  return t instanceof _.window.Event || (t = new _.window.CustomEvent(t, {
    detail: n,
    cancelable: !0,
    ...i
  })), s.dispatchEvent(t), t;
}
class zt extends le {
  addEventListener() {
  }
  dispatch(t, n, i) {
    return Si(this, t, n, i);
  }
  dispatchEvent(t) {
    const n = this.getEventHolder().events;
    if (!n) return !0;
    const i = n[t.type];
    for (const s in i)
      for (const o in i[s])
        i[s][o](t);
    return !t.defaultPrevented;
  }
  // Fire given event
  fire(t, n, i) {
    return this.dispatch(t, n, i), this;
  }
  getEventHolder() {
    return this;
  }
  getEventTarget() {
    return this;
  }
  // Unbind event from listener
  off(t, n, i) {
    return H(this, t, n, i), this;
  }
  // Bind given event to listener
  on(t, n, i, s) {
    return V(this, t, n, i, s), this;
  }
  removeEventListener() {
  }
}
S(zt, "EventTarget");
function Te() {
}
const wt = {
  duration: 400,
  ease: ">",
  delay: 0
}, zi = {
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
class ut extends Array {
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
    return t instanceof Array ? t : t.trim().split(X).map(parseFloat);
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
class m {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new m(this.value, t);
  }
  // Divide number
  divide(t) {
    return t = new m(t), new m(this / t, this.unit || t.unit);
  }
  init(t, n) {
    return n = Array.isArray(t) ? t[1] : n, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = n || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (n = t.match(je), n && (this.value = parseFloat(n[1]), n[5] === "%" ? this.value /= 100 : n[5] === "s" && (this.value *= 1e3), this.unit = n[5])) : t instanceof m && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  // Subtract number
  minus(t) {
    return t = new m(t), new m(this - t, this.unit || t.unit);
  }
  // Add number
  plus(t) {
    return t = new m(t), new m(this + t, this.unit || t.unit);
  }
  // Multiply number
  times(t) {
    return t = new m(t), new m(this * t, this.unit || t.unit);
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
const Mi = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), Ye = [];
function Ci(e) {
  Ye.push(e);
}
function Ei(e, t, n) {
  if (e == null) {
    e = {}, t = this.node.attributes;
    for (const i of t)
      e[i.nodeName] = Ee.test(i.nodeValue) ? parseFloat(i.nodeValue) : i.nodeValue;
    return e;
  } else {
    if (e instanceof Array)
      return e.reduce((i, s) => (i[s] = this.attr(s), i), {});
    if (typeof e == "object" && e.constructor === Object)
      for (t in e) this.attr(t, e[t]);
    else if (t === null)
      this.node.removeAttribute(e);
    else {
      if (t == null)
        return t = this.node.getAttribute(e), t == null ? zi[e] : Ee.test(t) ? parseFloat(t) : t;
      t = Ye.reduce((i, s) => s(e, i, this), t), typeof t == "number" ? t = new m(t) : Mi.has(e) && C.isColor(t) ? t = new C(t) : t.constructor === Array && (t = new ut(t)), e === "leading" ? this.leading && this.leading(t) : typeof n == "string" ? this.node.setAttributeNS(n, e, t.toString()) : this.node.setAttribute(e, t.toString()), this.rebuild && (e === "font-size" || e === "x") && this.rebuild();
    }
  }
  return this;
}
class K extends zt {
  constructor(t, n) {
    super(), this.node = t, this.type = t.nodeName, n && t !== n && this.attr(n);
  }
  // Add given element at a position
  add(t, n) {
    return t = N(t), t.removeNamespace && this.node instanceof _.window.SVGElement && t.removeNamespace(), n == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[n] && this.node.insertBefore(t.node, this.node.childNodes[n]), this;
  }
  // Add element to given container and return self
  addTo(t, n) {
    return N(t).put(this, n);
  }
  // Returns all child elements
  children() {
    return new ot(
      re(this.node.children, function(t) {
        return j(t);
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
  clone(t = !0, n = !0) {
    this.writeDataToDom();
    let i = this.node.cloneNode(t);
    return n && (i = Le(i)), new this.constructor(i);
  }
  // Iterates over all children and invokes a given block
  each(t, n) {
    const i = this.children();
    let s, o;
    for (s = 0, o = i.length; s < o; s++)
      t.apply(i[s], [s, i]), n && i[s].each(t, n);
    return this;
  }
  element(t, n) {
    return this.put(new K(vt(t), n));
  }
  // Get first child
  first() {
    return j(this.node.firstChild);
  }
  // Get a element at the given index
  get(t) {
    return j(this.node.childNodes[t]);
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
  html(t, n) {
    return this.xml(t, n, En);
  }
  // Get / set id
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = Be(this.type)), this.attr("id", t);
  }
  // Gets index of given element
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  // Get the last child
  last() {
    return j(this.node.lastChild);
  }
  // matches the element vs a css selector
  matches(t) {
    const n = this.node, i = n.matches || n.matchesSelector || n.msMatchesSelector || n.mozMatchesSelector || n.webkitMatchesSelector || n.oMatchesSelector || null;
    return i && i.call(n, t);
  }
  // Returns the parent element instance
  parent(t) {
    let n = this;
    if (!n.node.parentNode) return null;
    if (n = j(n.node.parentNode), !t) return n;
    do
      if (typeof t == "string" ? n.matches(t) : n instanceof t)
        return n;
    while (n = j(n.node.parentNode));
    return n;
  }
  // Basically does the same as `add()` but returns the added element instead
  put(t, n) {
    return t = N(t), this.add(t, n), t;
  }
  // Add element to given container and return container
  putIn(t, n) {
    return N(t).add(this, n);
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
    return t = N(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, n = null) {
    const i = 10 ** t, s = this.attr(n);
    for (const o in s)
      typeof s[o] == "number" && (s[o] = Math.round(s[o] * i) / i);
    return this.attr(s), this;
  }
  // Import / Export raw svg
  svg(t, n) {
    return this.xml(t, n, ae);
  }
  // Return id on string conversion
  toString() {
    return this.id();
  }
  words(t) {
    return this.node.textContent = t, this;
  }
  wrap(t) {
    const n = this.parent();
    if (!n)
      return this.addTo(t);
    const i = n.index(this);
    return n.put(t, i).put(this);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return this.each(function() {
      this.writeDataToDom();
    }), this;
  }
  // Import / Export raw svg
  xml(t, n, i) {
    if (typeof t == "boolean" && (i = n, n = t, t = null), t == null || typeof t == "function") {
      n = n ?? !0, this.writeDataToDom();
      let a = this;
      if (t != null) {
        if (a = j(a.node.cloneNode(!0)), n) {
          const h = t(a);
          if (a = h || a, h === !1) return "";
        }
        a.each(function() {
          const h = t(this), l = h || this;
          h === !1 ? this.remove() : h && this !== l && this.replace(l);
        }, !0);
      }
      return n ? a.node.outerHTML : a.node.innerHTML;
    }
    n = n ?? !1;
    const s = vt("wrapper", i), o = _.document.createDocumentFragment();
    s.innerHTML = t;
    for (let a = s.children.length; a--; )
      o.appendChild(s.firstElementChild);
    const r = this.parent();
    return n ? this.replace(o) && r : this.add(o);
  }
}
w(K, { attr: Ei, find: wi, findOne: vi });
S(K, "Dom");
class B extends K {
  constructor(t, n) {
    super(t, n), this.dom = {}, this.node.instance = this, (t.hasAttribute("data-svgjs") || t.hasAttribute("svgjs:data")) && this.setData(
      JSON.parse(t.getAttribute("data-svgjs")) ?? JSON.parse(t.getAttribute("svgjs:data")) ?? {}
    );
  }
  // Move element by its center
  center(t, n) {
    return this.cx(t).cy(n);
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
  dmove(t, n) {
    return this.dx(t).dy(n);
  }
  // Relative move over x axis
  dx(t = 0) {
    return this.x(new m(t).plus(this.x()));
  }
  // Relative move over y axis
  dy(t = 0) {
    return this.y(new m(t).plus(this.y()));
  }
  getEventHolder() {
    return this;
  }
  // Set height of element
  height(t) {
    return this.attr("height", t);
  }
  // Move element to given x and y values
  move(t, n) {
    return this.x(t).y(n);
  }
  // return array of all ancestors of given type up to the root svg
  parents(t = this.root()) {
    const n = typeof t == "string";
    n || (t = N(t));
    const i = new ot();
    let s = this;
    for (; (s = s.parent()) && s.node !== _.document && s.nodeName !== "#document-fragment" && (i.push(s), !(!n && s.node === t.node || n && s.matches(t))); )
      if (s.node === this.root().node)
        return null;
    return i;
  }
  // Get referenced element form attribute value
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const n = (t + "").match(Gn);
    return n ? N(n[1]) : null;
  }
  // Get parent document
  root() {
    const t = this.parent(Tn(ue));
    return t && t.root();
  }
  // set given data to the elements data property
  setData(t) {
    return this.dom = t, this;
  }
  // Set element size to given width and height
  size(t, n) {
    const i = dt(this, t, n);
    return this.width(new m(i.width)).height(new m(i.height));
  }
  // Set width of element
  width(t) {
    return this.attr("width", t);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return De(this, this.dom), super.writeDataToDom();
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
w(B, {
  bbox: mi,
  rbox: gi,
  inside: yi,
  point: ci,
  ctm: di,
  screenCTM: fi
});
S(B, "Element");
const bt = {
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
  prefix: function(e, t) {
    return t === "color" ? e : e + "-" + t;
  }
};
["fill", "stroke"].forEach(function(e) {
  const t = {};
  let n;
  t[e] = function(i) {
    if (typeof i > "u")
      return this.attr(e);
    if (typeof i == "string" || i instanceof C || C.isRgb(i) || i instanceof B)
      this.attr(e, i);
    else
      for (n = bt[e].length - 1; n >= 0; n--)
        i[bt[e][n]] != null && this.attr(bt.prefix(e, bt[e][n]), i[bt[e][n]]);
    return this;
  }, b(["Element", "Runner"], t);
});
b(["Element", "Runner"], {
  // Let the user set the matrix directly
  matrix: function(e, t, n, i, s, o) {
    return e == null ? new f(this) : this.attr("transform", new f(e, t, n, i, s, o));
  },
  // Map rotation to transform
  rotate: function(e, t, n) {
    return this.transform({ rotate: e, ox: t, oy: n }, !0);
  },
  // Map skew to transform
  skew: function(e, t, n, i) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ skew: e, ox: t, oy: n }, !0) : this.transform({ skew: [e, t], ox: n, oy: i }, !0);
  },
  shear: function(e, t, n) {
    return this.transform({ shear: e, ox: t, oy: n }, !0);
  },
  // Map scale to transform
  scale: function(e, t, n, i) {
    return arguments.length === 1 || arguments.length === 3 ? this.transform({ scale: e, ox: t, oy: n }, !0) : this.transform({ scale: [e, t], ox: n, oy: i }, !0);
  },
  // Map translate to transform
  translate: function(e, t) {
    return this.transform({ translate: [e, t] }, !0);
  },
  // Map relative translations to transform
  relative: function(e, t) {
    return this.transform({ relative: [e, t] }, !0);
  },
  // Map flip to transform
  flip: function(e = "both", t = "center") {
    return "xybothtrue".indexOf(e) === -1 && (t = e, e = "both"), this.transform({ flip: e, origin: t }, !0);
  },
  // Opacity
  opacity: function(e) {
    return this.attr("opacity", e);
  }
});
b("radius", {
  // Add x and y radius
  radius: function(e, t = e) {
    return (this._element || this).type === "radialGradient" ? this.attr("r", new m(e)) : this.rx(e).ry(t);
  }
});
b("Path", {
  // Get path length
  length: function() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function(e) {
    return new P(this.node.getPointAtLength(e));
  }
});
b(["Element", "Runner"], {
  // Set font
  font: function(e, t) {
    if (typeof e == "object") {
      for (t in e) this.font(t, e[t]);
      return this;
    }
    return e === "leading" ? this.leading(t) : e === "anchor" ? this.attr("text-anchor", t) : e === "size" || e === "family" || e === "weight" || e === "stretch" || e === "variant" || e === "style" ? this.attr("font-" + e, t) : this.attr(e, t);
  }
});
const Ti = [
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
].reduce(function(e, t) {
  const n = function(i) {
    return i === null ? this.off(t) : this.on(t, i), this;
  };
  return e[t] = n, e;
}, {});
b("Element", Ti);
function Ai() {
  return this.attr("transform", null);
}
function Pi() {
  return (this.attr("transform") || "").split(Yn).slice(0, -1).map(function(t) {
    const n = t.trim().split("(");
    return [
      n[0],
      n[1].split(X).map(function(i) {
        return parseFloat(i);
      })
    ];
  }).reverse().reduce(function(t, n) {
    return n[0] === "matrix" ? t.lmultiply(f.fromArray(n[1])) : t[n[0]].apply(t, n[1]);
  }, new f());
}
function Zi(e, t) {
  if (this === e) return this;
  if (Ut(this.node)) return this.addTo(e, t);
  const n = this.screenCTM(), i = e.screenCTM().inverse();
  return this.addTo(e, t).untransform().transform(i.multiply(n)), this;
}
function Ii(e) {
  return this.toParent(this.root(), e);
}
function Ni(e, t) {
  if (e == null || typeof e == "string") {
    const s = new f(this).decompose();
    return e == null ? s : s[e];
  }
  f.isMatrixLike(e) || (e = { ...e, origin: Xt(e, this) });
  const n = t === !0 ? this : t || !1, i = new f(n).transform(e);
  return this.attr("transform", i);
}
b("Element", {
  untransform: Ai,
  matrixify: Pi,
  toParent: Zi,
  toRoot: Ii,
  transform: Ni
});
class k extends B {
  flatten() {
    return this.each(function() {
      if (this instanceof k)
        return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), n = t.index(this)) {
    return n = n === -1 ? t.children().length : n, this.each(function(i, s) {
      return s[s.length - i - 1].toParent(t, n);
    }), this.remove();
  }
}
S(k, "Container");
class fe extends k {
  constructor(t, n = t) {
    super(T("defs", t), n);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
}
S(fe, "Defs");
class L extends B {
}
S(L, "Shape");
function pe(e) {
  return this.attr("rx", e);
}
function me(e) {
  return this.attr("ry", e);
}
function Ve(e) {
  return e == null ? this.cx() - this.rx() : this.cx(e + this.rx());
}
function Xe(e) {
  return e == null ? this.cy() - this.ry() : this.cy(e + this.ry());
}
function Ue(e) {
  return this.attr("cx", e);
}
function We(e) {
  return this.attr("cy", e);
}
function $e(e) {
  return e == null ? this.rx() * 2 : this.rx(new m(e).divide(2));
}
function Qe(e) {
  return e == null ? this.ry() * 2 : this.ry(new m(e).divide(2));
}
const Ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cx: Ue,
  cy: We,
  height: Qe,
  rx: pe,
  ry: me,
  width: $e,
  x: Ve,
  y: Xe
}, Symbol.toStringTag, { value: "Module" }));
class Mt extends L {
  constructor(t, n = t) {
    super(T("ellipse", t), n);
  }
  size(t, n) {
    const i = dt(this, t, n);
    return this.rx(new m(i.width).divide(2)).ry(
      new m(i.height).divide(2)
    );
  }
}
w(Mt, Ri);
b("Container", {
  // Create an ellipse
  ellipse: E(function(e = 0, t = e) {
    return this.put(new Mt()).size(e, t).move(0, 0);
  })
});
S(Mt, "Ellipse");
class Je extends K {
  constructor(t = _.document.createDocumentFragment()) {
    super(t);
  }
  // Import / Export raw xml
  xml(t, n, i) {
    if (typeof t == "boolean" && (i = n, n = t, t = null), t == null || typeof t == "function") {
      const s = new K(vt("wrapper", i));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, i);
    }
    return super.xml(t, !1, i);
  }
}
S(Je, "Fragment");
function Ke(e, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ fx: new m(e), fy: new m(t) }) : this.attr({ x1: new m(e), y1: new m(t) });
}
function tn(e, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ cx: new m(e), cy: new m(t) }) : this.attr({ x2: new m(e), y2: new m(t) });
}
const ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  from: Ke,
  to: tn
}, Symbol.toStringTag, { value: "Module" }));
class Ct extends k {
  constructor(t, n) {
    super(
      T(t + "Gradient", typeof t == "string" ? null : t),
      n
    );
  }
  // custom attr to handle transform
  attr(t, n, i) {
    return t === "transform" && (t = "gradientTransform"), super.attr(t, n, i);
  }
  bbox() {
    return new Z();
  }
  targets() {
    return ft("svg [fill*=" + this.id() + "]");
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
w(Ct, ki);
b({
  Container: {
    // Create gradient element in defs
    gradient(...e) {
      return this.defs().gradient(...e);
    }
  },
  // define gradient
  Defs: {
    gradient: E(function(e, t) {
      return this.put(new Ct(e)).update(t);
    })
  }
});
S(Ct, "Gradient");
class xt extends k {
  // Initialize node
  constructor(t, n = t) {
    super(T("pattern", t), n);
  }
  // custom attr to handle transform
  attr(t, n, i) {
    return t === "transform" && (t = "patternTransform"), super.attr(t, n, i);
  }
  bbox() {
    return new Z();
  }
  targets() {
    return ft("svg [fill*=" + this.id() + "]");
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
b({
  Container: {
    // Create pattern element in defs
    pattern(...e) {
      return this.defs().pattern(...e);
    }
  },
  Defs: {
    pattern: E(function(e, t, n) {
      return this.put(new xt()).update(n).attr({
        x: 0,
        y: 0,
        width: e,
        height: t,
        patternUnits: "userSpaceOnUse"
      });
    })
  }
});
S(xt, "Pattern");
class Ot extends L {
  constructor(t, n = t) {
    super(T("image", t), n);
  }
  // (re)load image
  load(t, n) {
    if (!t) return this;
    const i = new _.window.Image();
    return V(
      i,
      "load",
      function(s) {
        const o = this.parent(xt);
        this.width() === 0 && this.height() === 0 && this.size(i.width, i.height), o instanceof xt && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof n == "function" && n.call(this, s);
      },
      this
    ), V(i, "load error", function() {
      H(i);
    }), this.attr("href", i.src = t, St);
  }
}
Ci(function(e, t, n) {
  return (e === "fill" || e === "stroke") && Xn.test(t) && (t = n.root().defs().image(t)), t instanceof Ot && (t = n.root().defs().pattern(0, 0, (i) => {
    i.add(t);
  })), t;
});
b({
  Container: {
    // create image element, load image and set its size
    image: E(function(e, t) {
      return this.put(new Ot()).size(0, 0).load(e, t);
    })
  }
});
S(Ot, "Image");
class tt extends ut {
  // Get bounding box of points
  bbox() {
    let t = -1 / 0, n = -1 / 0, i = 1 / 0, s = 1 / 0;
    return this.forEach(function(o) {
      t = Math.max(o[0], t), n = Math.max(o[1], n), i = Math.min(o[0], i), s = Math.min(o[1], s);
    }), new Z(i, s, t - i, n - s);
  }
  // Move point string
  move(t, n) {
    const i = this.bbox();
    if (t -= i.x, n -= i.y, !isNaN(t) && !isNaN(n))
      for (let s = this.length - 1; s >= 0; s--)
        this[s] = [this[s][0] + t, this[s][1] + n];
    return this;
  }
  // Parse point string and flat array
  parse(t = [0, 0]) {
    const n = [];
    t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(X).map(parseFloat), t.length % 2 !== 0 && t.pop();
    for (let i = 0, s = t.length; i < s; i = i + 2)
      n.push([t[i], t[i + 1]]);
    return n;
  }
  // Resize poly string
  size(t, n) {
    let i;
    const s = this.bbox();
    for (i = this.length - 1; i >= 0; i--)
      s.width && (this[i][0] = (this[i][0] - s.x) * t / s.width + s.x), s.height && (this[i][1] = (this[i][1] - s.y) * n / s.height + s.y);
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
    for (let n = 0, i = this.length; n < i; n++)
      t.push(this[n].join(","));
    return t.join(" ");
  }
  transform(t) {
    return this.clone().transformO(t);
  }
  // transform points with matrix (similar to Point.transform)
  transformO(t) {
    f.isMatrixLike(t) || (t = new f(t));
    for (let n = this.length; n--; ) {
      const [i, s] = this[n];
      this[n][0] = t.a * i + t.c * s + t.e, this[n][1] = t.b * i + t.d * s + t.f;
    }
    return this;
  }
}
const Oi = tt;
function Di(e) {
  return e == null ? this.bbox().x : this.move(e, this.bbox().y);
}
function Bi(e) {
  return e == null ? this.bbox().y : this.move(this.bbox().x, e);
}
function Li(e) {
  const t = this.bbox();
  return e == null ? t.width : this.size(e, t.height);
}
function ji(e) {
  const t = this.bbox();
  return e == null ? t.height : this.size(t.width, e);
}
const ge = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MorphArray: Oi,
  height: ji,
  width: Li,
  x: Di,
  y: Bi
}, Symbol.toStringTag, { value: "Module" }));
class ct extends L {
  // Initialize node
  constructor(t, n = t) {
    super(T("line", t), n);
  }
  // Get array
  array() {
    return new tt([
      [this.attr("x1"), this.attr("y1")],
      [this.attr("x2"), this.attr("y2")]
    ]);
  }
  // Move by left top corner
  move(t, n) {
    return this.attr(this.array().move(t, n).toLine());
  }
  // Overwrite native plot() method
  plot(t, n, i, s) {
    return t == null ? this.array() : (typeof n < "u" ? t = { x1: t, y1: n, x2: i, y2: s } : t = new tt(t).toLine(), this.attr(t));
  }
  // Set element size to given width and height
  size(t, n) {
    const i = dt(this, t, n);
    return this.attr(this.array().size(i.width, i.height).toLine());
  }
}
w(ct, ge);
b({
  Container: {
    // Create a line element
    line: E(function(...e) {
      return ct.prototype.plot.apply(
        this.put(new ct()),
        e[0] != null ? e : [0, 0, 0, 0]
      );
    })
  }
});
S(ct, "Line");
class It extends k {
  // Initialize node
  constructor(t, n = t) {
    super(T("marker", t), n);
  }
  // Set height of element
  height(t) {
    return this.attr("markerHeight", t);
  }
  orient(t) {
    return this.attr("orient", t);
  }
  // Set marker refX and refY
  ref(t, n) {
    return this.attr("refX", t).attr("refY", n);
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
b({
  Container: {
    marker(...e) {
      return this.defs().marker(...e);
    }
  },
  Defs: {
    // Create marker
    marker: E(function(e, t, n) {
      return this.put(new It()).size(e, t).ref(e / 2, t / 2).viewbox(0, 0, e, t).attr("orient", "auto").update(n);
    })
  },
  marker: {
    // Create and attach markers
    marker(e, t, n, i) {
      let s = ["marker"];
      return e !== "all" && s.push(e), s = s.join("-"), e = arguments[1] instanceof It ? arguments[1] : this.defs().marker(t, n, i), this.attr(s, e);
    }
  }
});
S(It, "Marker");
function lt(e, t) {
  return function(n) {
    return n == null ? this[e] : (this[e] = n, t && t.call(this), this);
  };
}
const Hi = {
  "-": function(e) {
    return e;
  },
  "<>": function(e) {
    return -Math.cos(e * Math.PI) / 2 + 0.5;
  },
  ">": function(e) {
    return Math.sin(e * Math.PI / 2);
  },
  "<": function(e) {
    return -Math.cos(e * Math.PI / 2) + 1;
  },
  bezier: function(e, t, n, i) {
    return function(s) {
      return s < 0 ? e > 0 ? t / e * s : n > 0 ? i / n * s : 0 : s > 1 ? n < 1 ? (1 - i) / (1 - n) * s + (i - n) / (1 - n) : e < 1 ? (1 - t) / (1 - e) * s + (t - e) / (1 - e) : 1 : 3 * s * (1 - s) ** 2 * t + 3 * s ** 2 * (1 - s) * i + s ** 3;
    };
  },
  // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
  steps: function(e, t = "end") {
    t = t.split("-").reverse()[0];
    let n = e;
    return t === "none" ? --n : t === "both" && ++n, (i, s = !1) => {
      let o = Math.floor(i * e);
      const r = i * o % 1 === 0;
      return (t === "start" || t === "both") && ++o, s && r && --o, i >= 0 && o < 0 && (o = 0), i <= 1 && o > n && (o = n), o / n;
    };
  }
};
class ye {
  done() {
    return !1;
  }
}
class Wt extends ye {
  constructor(t = wt.ease) {
    super(), this.ease = Hi[t] || t;
  }
  step(t, n, i) {
    return typeof t != "number" ? i < 1 ? t : n : t + (n - t) * this.ease(i);
  }
}
class Nt extends ye {
  constructor(t) {
    super(), this.stepper = t;
  }
  done(t) {
    return t.done;
  }
  step(t, n, i, s) {
    return this.stepper(t, n, i, s);
  }
}
function Ae() {
  const e = (this._duration || 500) / 1e3, t = this._overshoot || 0, n = 1e-10, i = Math.PI, s = Math.log(t / 100 + n), o = -s / Math.sqrt(i * i + s * s), r = 3.9 / (o * e);
  this.d = 2 * o * r, this.k = r * r;
}
class Fi extends Nt {
  constructor(t = 500, n = 0) {
    super(), this.duration(t).overshoot(n);
  }
  step(t, n, i, s) {
    if (typeof t == "string") return t;
    if (s.done = i === 1 / 0, i === 1 / 0) return n;
    if (i === 0) return t;
    i > 100 && (i = 16), i /= 1e3;
    const o = s.velocity || 0, r = -this.d * o - this.k * (t - n), a = t + o * i + r * i * i / 2;
    return s.velocity = o + r * i, s.done = Math.abs(n - a) + Math.abs(o) < 2e-3, s.done ? n : a;
  }
}
w(Fi, {
  duration: lt("_duration", Ae),
  overshoot: lt("_overshoot", Ae)
});
class qi extends Nt {
  constructor(t = 0.1, n = 0.01, i = 0, s = 1e3) {
    super(), this.p(t).i(n).d(i).windup(s);
  }
  step(t, n, i, s) {
    if (typeof t == "string") return t;
    if (s.done = i === 1 / 0, i === 1 / 0) return n;
    if (i === 0) return t;
    const o = n - t;
    let r = (s.integral || 0) + o * i;
    const a = (o - (s.error || 0)) / i, h = this._windup;
    return h !== !1 && (r = Math.max(-h, Math.min(r, h))), s.error = o, s.integral = r, s.done = Math.abs(o) < 1e-3, s.done ? n : t + (this.P * o + this.I * r + this.D * a);
  }
}
w(qi, {
  windup: lt("_windup"),
  p: lt("P"),
  i: lt("I"),
  d: lt("D")
});
const Gi = {
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
}, $t = {
  M: function(e, t, n) {
    return t.x = n.x = e[0], t.y = n.y = e[1], ["M", t.x, t.y];
  },
  L: function(e, t) {
    return t.x = e[0], t.y = e[1], ["L", e[0], e[1]];
  },
  H: function(e, t) {
    return t.x = e[0], ["H", e[0]];
  },
  V: function(e, t) {
    return t.y = e[0], ["V", e[0]];
  },
  C: function(e, t) {
    return t.x = e[4], t.y = e[5], ["C", e[0], e[1], e[2], e[3], e[4], e[5]];
  },
  S: function(e, t) {
    return t.x = e[2], t.y = e[3], ["S", e[0], e[1], e[2], e[3]];
  },
  Q: function(e, t) {
    return t.x = e[2], t.y = e[3], ["Q", e[0], e[1], e[2], e[3]];
  },
  T: function(e, t) {
    return t.x = e[0], t.y = e[1], ["T", e[0], e[1]];
  },
  Z: function(e, t, n) {
    return t.x = n.x, t.y = n.y, ["Z"];
  },
  A: function(e, t) {
    return t.x = e[5], t.y = e[6], ["A", e[0], e[1], e[2], e[3], e[4], e[5], e[6]];
  }
}, qt = "mlhvqtcsaz".split("");
for (let e = 0, t = qt.length; e < t; ++e)
  $t[qt[e]] = /* @__PURE__ */ function(n) {
    return function(i, s, o) {
      if (n === "H") i[0] = i[0] + s.x;
      else if (n === "V") i[0] = i[0] + s.y;
      else if (n === "A")
        i[5] = i[5] + s.x, i[6] = i[6] + s.y;
      else
        for (let r = 0, a = i.length; r < a; ++r)
          i[r] = i[r] + (r % 2 ? s.y : s.x);
      return $t[n](i, s, o);
    };
  }(qt[e].toUpperCase());
function Yi(e) {
  const t = e.segment[0];
  return $t[t](e.segment.slice(1), e.p, e.p0);
}
function Qt(e) {
  return e.segment.length && e.segment.length - 1 === Gi[e.segment[0].toUpperCase()];
}
function Vi(e, t) {
  e.inNumber && nt(e, !1);
  const n = ce.test(t);
  if (n)
    e.segment = [t];
  else {
    const i = e.lastCommand, s = i.toLowerCase(), o = i === s;
    e.segment = [s === "m" ? o ? "l" : "L" : i];
  }
  return e.inSegment = !0, e.lastCommand = e.segment[0], n;
}
function nt(e, t) {
  if (!e.inNumber) throw new Error("Parser Error");
  e.number && e.segment.push(parseFloat(e.number)), e.inNumber = t, e.number = "", e.pointSeen = !1, e.hasExponent = !1, Qt(e) && Jt(e);
}
function Jt(e) {
  e.inSegment = !1, e.absolute && (e.segment = Yi(e)), e.segments.push(e.segment);
}
function Xi(e) {
  if (!e.segment.length) return !1;
  const t = e.segment[0].toUpperCase() === "A", n = e.segment.length;
  return t && (n === 4 || n === 5);
}
function Ui(e) {
  return e.lastToken.toUpperCase() === "E";
}
const Wi = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
function $i(e, t = !0) {
  let n = 0, i = "";
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
    p0: new P(),
    p: new P()
  };
  for (; s.lastToken = i, i = e.charAt(n++); )
    if (!(!s.inSegment && Vi(s, i))) {
      if (i === ".") {
        if (s.pointSeen || s.hasExponent) {
          nt(s, !1), --n;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += i;
        continue;
      }
      if (!isNaN(parseInt(i))) {
        if (s.number === "0" || Xi(s)) {
          s.inNumber = !0, s.number = i, nt(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += i;
        continue;
      }
      if (Wi.has(i)) {
        s.inNumber && nt(s, !1);
        continue;
      }
      if (i === "-" || i === "+") {
        if (s.inNumber && !Ui(s)) {
          nt(s, !1), --n;
          continue;
        }
        s.number += i, s.inNumber = !0;
        continue;
      }
      if (i.toUpperCase() === "E") {
        s.number += i, s.hasExponent = !0;
        continue;
      }
      if (ce.test(i)) {
        if (s.inNumber)
          nt(s, !1);
        else if (Qt(s))
          Jt(s);
        else
          throw new Error("parser Error");
        --n;
      }
    }
  return s.inNumber && nt(s, !1), s.inSegment && Qt(s) && Jt(s), s.segments;
}
function Qi(e) {
  let t = "";
  for (let n = 0, i = e.length; n < i; n++)
    t += e[n][0], e[n][1] != null && (t += e[n][1], e[n][2] != null && (t += " ", t += e[n][2], e[n][3] != null && (t += " ", t += e[n][3], t += " ", t += e[n][4], e[n][5] != null && (t += " ", t += e[n][5], t += " ", t += e[n][6], e[n][7] != null && (t += " ", t += e[n][7])))));
  return t + " ";
}
class rt extends ut {
  // Get bounding box of path
  bbox() {
    return Q().path.setAttribute("d", this.toString()), new Z(Q.nodes.path.getBBox());
  }
  // Move path string
  move(t, n) {
    const i = this.bbox();
    if (t -= i.x, n -= i.y, !isNaN(t) && !isNaN(n))
      for (let s, o = this.length - 1; o >= 0; o--)
        s = this[o][0], s === "M" || s === "L" || s === "T" ? (this[o][1] += t, this[o][2] += n) : s === "H" ? this[o][1] += t : s === "V" ? this[o][1] += n : s === "C" || s === "S" || s === "Q" ? (this[o][1] += t, this[o][2] += n, this[o][3] += t, this[o][4] += n, s === "C" && (this[o][5] += t, this[o][6] += n)) : s === "A" && (this[o][6] += t, this[o][7] += n);
    return this;
  }
  // Absolutize and parse path to array
  parse(t = "M0 0") {
    return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), $i(t);
  }
  // Resize path string
  size(t, n) {
    const i = this.bbox();
    let s, o;
    for (i.width = i.width === 0 ? 1 : i.width, i.height = i.height === 0 ? 1 : i.height, s = this.length - 1; s >= 0; s--)
      o = this[s][0], o === "M" || o === "L" || o === "T" ? (this[s][1] = (this[s][1] - i.x) * t / i.width + i.x, this[s][2] = (this[s][2] - i.y) * n / i.height + i.y) : o === "H" ? this[s][1] = (this[s][1] - i.x) * t / i.width + i.x : o === "V" ? this[s][1] = (this[s][1] - i.y) * n / i.height + i.y : o === "C" || o === "S" || o === "Q" ? (this[s][1] = (this[s][1] - i.x) * t / i.width + i.x, this[s][2] = (this[s][2] - i.y) * n / i.height + i.y, this[s][3] = (this[s][3] - i.x) * t / i.width + i.x, this[s][4] = (this[s][4] - i.y) * n / i.height + i.y, o === "C" && (this[s][5] = (this[s][5] - i.x) * t / i.width + i.x, this[s][6] = (this[s][6] - i.y) * n / i.height + i.y)) : o === "A" && (this[s][1] = this[s][1] * t / i.width, this[s][2] = this[s][2] * n / i.height, this[s][6] = (this[s][6] - i.x) * t / i.width + i.x, this[s][7] = (this[s][7] - i.y) * n / i.height + i.y);
    return this;
  }
  // Convert array to string
  toString() {
    return Qi(this);
  }
}
const en = (e) => {
  const t = typeof e;
  return t === "number" ? m : t === "string" ? C.isColor(e) ? C : X.test(e) ? ce.test(e) ? rt : ut : je.test(e) ? m : Kt : be.indexOf(e.constructor) > -1 ? e.constructor : Array.isArray(e) ? ut : t === "object" ? _t : Kt;
};
class it {
  constructor(t) {
    this._stepper = t || new Wt("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    return this._context.map(this._stepper.done).reduce(function(n, i) {
      return n && i;
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
    this._type || this.type(en(t));
    let n = new this._type(t);
    return this._type === C && (n = this._to ? n[this._to[4]]() : this._from ? n[this._from[4]]() : n), this._type === _t && (n = this._to ? n.align(this._to) : this._from ? n.align(this._from) : n), n = n.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(n.length)).map(Object).map(function(i) {
      return i.done = !0, i;
    }), n;
  }
}
class Kt {
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
class Et {
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
    }), Object.assign(this, Et.defaults, t), this;
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
Et.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const Ji = (e, t) => e[0] < t[0] ? -1 : e[0] > t[0] ? 1 : 0;
class _t {
  constructor(...t) {
    this.init(...t);
  }
  align(t) {
    const n = this.values;
    for (let i = 0, s = n.length; i < s; ++i) {
      if (n[i + 1] === t[i + 1]) {
        if (n[i + 1] === C && t[i + 7] !== n[i + 7]) {
          const a = t[i + 7], h = new C(this.values.splice(i + 3, 5))[a]().toArray();
          this.values.splice(i + 3, 0, ...h);
        }
        i += n[i + 2] + 2;
        continue;
      }
      if (!t[i + 1])
        return this;
      const o = new t[i + 1]().toArray(), r = n[i + 2] + 3;
      n.splice(
        i,
        r,
        t[i],
        t[i + 1],
        t[i + 2],
        ...o
      ), i += n[i + 2] + 2;
    }
    return this;
  }
  init(t) {
    if (this.values = [], Array.isArray(t)) {
      this.values = t.slice();
      return;
    }
    t = t || {};
    const n = [];
    for (const i in t) {
      const s = en(t[i]), o = new s(t[i]).toArray();
      n.push([i, s, o.length, ...o]);
    }
    return n.sort(Ji), this.values = n.reduce((i, s) => i.concat(s), []), this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const t = {}, n = this.values;
    for (; n.length; ) {
      const i = n.shift(), s = n.shift(), o = n.shift(), r = n.splice(0, o);
      t[i] = new s(r);
    }
    return t;
  }
}
const be = [Kt, Et, _t];
function Ki(e = []) {
  be.push(...[].concat(e));
}
function ts() {
  w(be, {
    to(e) {
      return new it().type(this.constructor).from(this.toArray()).to(e);
    },
    fromArray(e) {
      return this.init(e), this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(e, t, n, i, s) {
      const o = function(r, a) {
        return i.step(r, t[a], n, s[a], s);
      };
      return this.fromArray(e.map(o));
    }
  });
}
class pt extends L {
  // Initialize node
  constructor(t, n = t) {
    super(T("path", t), n);
  }
  // Get array
  array() {
    return this._array || (this._array = new rt(this.attr("d")));
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
  move(t, n) {
    return this.attr("d", this.array().move(t, n));
  }
  // Plot new path
  plot(t) {
    return t == null ? this.array() : this.clear().attr(
      "d",
      typeof t == "string" ? t : this._array = new rt(t)
    );
  }
  // Set element size to given width and height
  size(t, n) {
    const i = dt(this, t, n);
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
pt.prototype.MorphArray = rt;
b({
  Container: {
    // Create a wrapped path element
    path: E(function(e) {
      return this.put(new pt()).plot(e || new rt());
    })
  }
});
S(pt, "Path");
function es() {
  return this._array || (this._array = new tt(this.attr("points")));
}
function ns() {
  return delete this._array, this;
}
function is(e, t) {
  return this.attr("points", this.array().move(e, t));
}
function ss(e) {
  return e == null ? this.array() : this.clear().attr(
    "points",
    typeof e == "string" ? e : this._array = new tt(e)
  );
}
function os(e, t) {
  const n = dt(this, e, t);
  return this.attr("points", this.array().size(n.width, n.height));
}
const nn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array: es,
  clear: ns,
  move: is,
  plot: ss,
  size: os
}, Symbol.toStringTag, { value: "Module" }));
class mt extends L {
  // Initialize node
  constructor(t, n = t) {
    super(T("polygon", t), n);
  }
}
b({
  Container: {
    // Create a wrapped polygon element
    polygon: E(function(e) {
      return this.put(new mt()).plot(e || new tt());
    })
  }
});
w(mt, ge);
w(mt, nn);
S(mt, "Polygon");
class gt extends L {
  // Initialize node
  constructor(t, n = t) {
    super(T("polyline", t), n);
  }
}
b({
  Container: {
    // Create a wrapped polygon element
    polyline: E(function(e) {
      return this.put(new gt()).plot(e || new tt());
    })
  }
});
w(gt, ge);
w(gt, nn);
S(gt, "Polyline");
class Tt extends L {
  // Initialize node
  constructor(t, n = t) {
    super(T("rect", t), n);
  }
}
w(Tt, { rx: pe, ry: me });
b({
  Container: {
    // Create a rect element
    rect: E(function(e, t) {
      return this.put(new Tt()).size(e, t);
    })
  }
});
S(Tt, "Rect");
class Gt {
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
    const n = typeof t.next < "u" ? t : { value: t, next: null, prev: null };
    return this._last ? (n.prev = this._last, this._last.next = n, this._last = n) : (this._last = n, this._first = n), n;
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
  frames: new Gt(),
  timeouts: new Gt(),
  immediates: new Gt(),
  timer: () => _.window.performance || _.window.Date,
  transforms: [],
  frame(e) {
    const t = z.frames.push({ run: e });
    return z.nextDraw === null && (z.nextDraw = _.window.requestAnimationFrame(z._draw)), t;
  },
  timeout(e, t) {
    t = t || 0;
    const n = z.timer().now() + t, i = z.timeouts.push({ run: e, time: n });
    return z.nextDraw === null && (z.nextDraw = _.window.requestAnimationFrame(z._draw)), i;
  },
  immediate(e) {
    const t = z.immediates.push(e);
    return z.nextDraw === null && (z.nextDraw = _.window.requestAnimationFrame(z._draw)), t;
  },
  cancelFrame(e) {
    e != null && z.frames.remove(e);
  },
  clearTimeout(e) {
    e != null && z.timeouts.remove(e);
  },
  cancelImmediate(e) {
    e != null && z.immediates.remove(e);
  },
  _draw(e) {
    let t = null;
    const n = z.timeouts.last();
    for (; (t = z.timeouts.shift()) && (e >= t.time ? t.run() : z.timeouts.push(t), t !== n); )
      ;
    let i = null;
    const s = z.frames.last();
    for (; i !== s && (i = z.frames.shift()); )
      i.run(e);
    let o = null;
    for (; o = z.immediates.shift(); )
      o();
    z.nextDraw = z.timeouts.first() || z.frames.first() ? _.window.requestAnimationFrame(z._draw) : null;
  }
}, rs = function(e) {
  const t = e.start, n = e.runner.duration(), i = t + n;
  return {
    start: t,
    duration: n,
    end: i,
    runner: e.runner
  };
}, as = function() {
  const e = _.window;
  return (e.performance || e.Date).now();
};
class sn extends zt {
  // Construct a new timeline on the given element
  constructor(t = as) {
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
    const t = this.getLastRunnerInfo(), n = t ? t.runner.duration() : 0;
    return (t ? t.start : this._time) + n;
  }
  getEndTimeOfTimeline() {
    const t = this._runners.map((n) => n.start + n.runner.duration());
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
    const n = this.speed();
    if (t == null) return this.speed(-n);
    const i = Math.abs(n);
    return this.speed(t ? -i : i);
  }
  // schedules a runner on the timeline
  schedule(t, n, i) {
    if (t == null)
      return this._runners.map(rs);
    let s = 0;
    const o = this.getEndTime();
    if (n = n || 0, i == null || i === "last" || i === "after")
      s = o;
    else if (i === "absolute" || i === "start")
      s = n, n = 0;
    else if (i === "now")
      s = this._time;
    else if (i === "relative") {
      const h = this.getRunnerInfoById(t.id);
      h && (s = h.start + n, n = 0);
    } else if (i === "with-last") {
      const h = this.getLastRunnerInfo();
      s = h ? h.start : this._time;
    } else
      throw new Error('Invalid value for the "when" parameter');
    t.unschedule(), t.timeline(this);
    const r = t.persist(), a = {
      persist: r === null ? this._persist : r,
      start: s + n,
      runner: t
    };
    return this._lastRunnerId = t.id, this._runners.push(a), this._runners.sort((h, l) => h.start - l.start), this._runnerIds = this._runners.map((h) => h.runner.id), this.updateTime()._continue(), this;
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
    const n = this._runnerIds.indexOf(t.id);
    return n < 0 ? this : (this._runners.splice(n, 1), this._runnerIds.splice(n, 1), t.timeline(null), this);
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
    const n = this._timeSource();
    let i = n - this._lastSourceTime;
    t && (i = 0);
    const s = this._speed * i + (this._time - this._lastStepTime);
    this._lastSourceTime = n, t || (this._time += s, this._time = this._time < 0 ? 0 : this._time), this._lastStepTime = this._time, this.fire("time", this._time);
    for (let r = this._runners.length; r--; ) {
      const a = this._runners[r], h = a.runner;
      this._time - a.start <= 0 && h.reset();
    }
    let o = !1;
    for (let r = 0, a = this._runners.length; r < a; r++) {
      const h = this._runners[r], l = h.runner;
      let u = s;
      const c = this._time - h.start;
      if (c <= 0) {
        o = !0;
        continue;
      } else c < u && (u = c);
      if (!l.active()) continue;
      l.step(u).done ? h.persist !== !0 && l.duration() - l.time() + this._time + h.persist < this._time && (l.unschedule(), --r, --a) : o = !0;
    }
    return o && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this;
  }
  terminate() {
    this._startTime = 0, this._speed = 1, this._persist = 0, this._nextFrame = null, this._paused = !0, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
}
b({
  Element: {
    timeline: function(e) {
      return e == null ? (this._timeline = this._timeline || new sn(), this._timeline) : (this._timeline = e, this);
    }
  }
});
class D extends zt {
  constructor(t) {
    super(), this.id = D.id++, t = t ?? wt.duration, t = typeof t == "function" ? new Nt(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof Nt, this._stepper = this._isDeclarative ? t : new Wt(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new f(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, n, i) {
    let s = 1, o = !1, r = 0;
    return t = t ?? wt.duration, n = n ?? wt.delay, i = i || "last", typeof t == "object" && !(t instanceof ye) && (n = t.delay ?? n, i = t.when ?? i, o = t.swing || o, s = t.times ?? s, r = t.wait ?? r, t = t.duration ?? wt.duration), {
      duration: t,
      delay: n,
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
  animate(t, n, i) {
    const s = D.sanitise(t, n, i), o = new D(s.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(s).schedule(s.delay, s.when);
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
    return this._stepper = new Wt(t), this;
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
  loop(t, n, i) {
    return typeof t == "object" && (n = t.swing, i = t.wait, t = t.times), this._times = t || 1 / 0, this._swing = n || !1, this._wait = i || 0, this._times === !0 && (this._times = 1 / 0), this;
  }
  loops(t) {
    const n = this._duration + this._wait;
    if (t == null) {
      const r = Math.floor(this._time / n), h = (this._time - r * n) / this._duration;
      return Math.min(r + h, this._times);
    }
    const i = Math.floor(t), s = t % 1, o = n * i + this._duration * s;
    return this.time(o);
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  position(t) {
    const n = this._time, i = this._duration, s = this._wait, o = this._times, r = this._swing, a = this._reverse;
    let h;
    if (t == null) {
      const g = function(p) {
        const d = r * Math.floor(p % (2 * (s + i)) / (s + i)), y = d && !a || !d && a, v = Math.pow(-1, y) * (p % (s + i)) / i + y;
        return Math.max(Math.min(v, 1), 0);
      }, x = o * (s + i) - s;
      return h = n <= 0 ? Math.round(g(1e-5)) : n < x ? g(n) : Math.round(g(x - 1e-5)), h;
    }
    const l = Math.floor(this.loops()), u = r && l % 2 === 0;
    return h = l + (u && !a || a && u ? t : 1 - t), this.loops(h);
  }
  progress(t) {
    return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
  }
  /*
  Basic Functionality
  ===================
  These methods allow us to attach basic functions to the runner directly
  */
  queue(t, n, i, s) {
    return this._queue.push({
      initialiser: t || Te,
      runner: n || Te,
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
  schedule(t, n, i) {
    if (t instanceof sn || (i = n, n = t, t = this.timeline()), !t)
      throw Error("Runner cannot be scheduled without timeline");
    return t.schedule(this, n, i), this;
  }
  step(t) {
    if (!this.enabled) return this;
    t = t ?? 16, this._time += t;
    const n = this.position(), i = this._lastPosition !== n && this._time >= 0;
    this._lastPosition = n;
    const s = this.duration(), o = this._lastTime <= 0 && this._time > 0, r = this._lastTime < s && this._time >= s;
    this._lastTime = this._time, o && this.fire("start", this);
    const a = this._isDeclarative;
    this.done = !a && !r && this._time >= s, this._reseted = !1;
    let h = !1;
    return (i || a) && (this._initialise(i), this.transforms = new f(), h = this._run(a ? t : n), this.fire("step", this)), this.done = this.done || h && a, r && this.fire("finished", this), this;
  }
  /*
  Runner animation methods
  ========================
  Control how the animation plays
  */
  time(t) {
    if (t == null)
      return this._time;
    const n = t - this._time;
    return this.step(n), this;
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
      for (let n = 0, i = this._queue.length; n < i; ++n) {
        const s = this._queue[n], o = this._isDeclarative || !s.initialised && t;
        t = !s.finished, o && t && (s.initialiser.call(this), s.initialised = !0);
      }
  }
  // Save a morpher to the morpher list so that we can retarget it later
  _rememberMorpher(t, n) {
    if (this._history[t] = {
      morpher: n,
      caller: this._queue[this._queue.length - 1]
    }, this._isDeclarative) {
      const i = this.timeline();
      i && i.play();
    }
  }
  // Try to set the target for a morpher if the morpher exists, otherwise
  // Run each run function for the position or dt given
  _run(t) {
    let n = !0;
    for (let i = 0, s = this._queue.length; i < s; ++i) {
      const o = this._queue[i], r = o.runner.call(this, t);
      o.finished = o.finished || r === !0, n = n && o.finished;
    }
    return n;
  }
  // do nothing and return false
  _tryRetarget(t, n, i) {
    if (this._history[t]) {
      if (!this._history[t].caller.initialised) {
        const o = this._queue.indexOf(this._history[t].caller);
        return this._queue.splice(o, 1), !1;
      }
      this._history[t].caller.retarget ? this._history[t].caller.retarget.call(this, n, i) : this._history[t].morpher.to(n), this._history[t].caller.finished = !1;
      const s = this.timeline();
      return s && s.play(), !0;
    }
    return !1;
  }
}
D.id = 0;
class Rt {
  constructor(t = new f(), n = -1, i = !0) {
    this.transforms = t, this.id = n, this.done = i;
  }
  clearTransformsFromQueue() {
  }
}
w([D, Rt], {
  mergeWith(e) {
    return new Rt(
      e.transforms.lmultiply(this.transforms),
      e.id
    );
  }
});
const on = (e, t) => e.lmultiplyO(t), rn = (e) => e.transforms;
function hs() {
  const t = this._transformationRunners.runners.map(rn).reduce(on, new f());
  this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
class ls {
  constructor() {
    this.runners = [], this.ids = [];
  }
  add(t) {
    if (this.runners.includes(t)) return;
    const n = t.id + 1;
    return this.runners.push(t), this.ids.push(n), this;
  }
  clearBefore(t) {
    const n = this.ids.indexOf(t + 1) || 1;
    return this.ids.splice(0, n, 0), this.runners.splice(0, n, new Rt()).forEach((i) => i.clearTransformsFromQueue()), this;
  }
  edit(t, n) {
    const i = this.ids.indexOf(t + 1);
    return this.ids.splice(i, 1, t + 1), this.runners.splice(i, 1, n), this;
  }
  getByID(t) {
    return this.runners[this.ids.indexOf(t + 1)];
  }
  length() {
    return this.ids.length;
  }
  merge() {
    let t = null;
    for (let n = 0; n < this.runners.length; ++n) {
      const i = this.runners[n];
      if (t && i.done && t.done && // don't merge runner when persisted on timeline
      (!i._timeline || !i._timeline._runnerIds.includes(i.id)) && (!t._timeline || !t._timeline._runnerIds.includes(t.id))) {
        this.remove(i.id);
        const o = i.mergeWith(t);
        this.edit(t.id, o), t = o, --n;
      } else
        t = i;
    }
    return this;
  }
  remove(t) {
    const n = this.ids.indexOf(t + 1);
    return this.ids.splice(n, 1), this.runners.splice(n, 1), this;
  }
}
b({
  Element: {
    animate(e, t, n) {
      const i = D.sanitise(e, t, n), s = this.timeline();
      return new D(i.duration).loop(i).element(this).timeline(s.play()).schedule(i.delay, i.when);
    },
    delay(e, t) {
      return this.animate(0, e, t);
    },
    // this function searches for all runners on the element and deletes the ones
    // which run before the current one. This is because absolute transformations
    // overwrite anything anyway so there is no need to waste time computing
    // other runners
    _clearTransformRunnersBefore(e) {
      this._transformationRunners.clearBefore(e.id);
    },
    _currentTransform(e) {
      return this._transformationRunners.runners.filter((t) => t.id <= e.id).map(rn).reduce(on, new f());
    },
    _addRunner(e) {
      this._transformationRunners.add(e), z.cancelImmediate(this._frameId), this._frameId = z.immediate(hs.bind(this));
    },
    _prepareRunner() {
      this._frameId == null && (this._transformationRunners = new ls().add(
        new Rt(new f(this))
      ));
    }
  }
});
const us = (e, t) => e.filter((n) => !t.includes(n));
w(D, {
  attr(e, t) {
    return this.styleAttr("attr", e, t);
  },
  // Add animatable styles
  css(e, t) {
    return this.styleAttr("css", e, t);
  },
  styleAttr(e, t, n) {
    if (typeof t == "string")
      return this.styleAttr(e, { [t]: n });
    let i = t;
    if (this._tryRetarget(e, i)) return this;
    let s = new it(this._stepper).to(i), o = Object.keys(i);
    return this.queue(
      function() {
        s = s.from(this.element()[e](o));
      },
      function(r) {
        return this.element()[e](s.at(r).valueOf()), s.done();
      },
      function(r) {
        const a = Object.keys(r), h = us(a, o);
        if (h.length) {
          const u = this.element()[e](h), c = new _t(s.from()).valueOf();
          Object.assign(c, u), s.from(c);
        }
        const l = new _t(s.to()).valueOf();
        Object.assign(l, r), s.to(l), o = a, i = r;
      }
    ), this._rememberMorpher(e, s), this;
  },
  zoom(e, t) {
    if (this._tryRetarget("zoom", e, t)) return this;
    let n = new it(this._stepper).to(new m(e));
    return this.queue(
      function() {
        n = n.from(this.element().zoom());
      },
      function(i) {
        return this.element().zoom(n.at(i), t), n.done();
      },
      function(i, s) {
        t = s, n.to(i);
      }
    ), this._rememberMorpher("zoom", n), this;
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
  transform(e, t, n) {
    if (t = e.relative || t, this._isDeclarative && !t && this._tryRetarget("transform", e))
      return this;
    const i = f.isMatrixLike(e);
    n = e.affine != null ? e.affine : n ?? !i;
    const s = new it(this._stepper).type(
      n ? Et : f
    );
    let o, r, a, h, l;
    function u() {
      r = r || this.element(), o = o || Xt(e, r), l = new f(t ? void 0 : r), r._addRunner(this), t || r._clearTransformRunnersBefore(this);
    }
    function c(x) {
      t || this.clearTransform();
      const { x: p, y: d } = new P(o).transform(
        r._currentTransform(this)
      );
      let y = new f({ ...e, origin: [p, d] }), v = this._isDeclarative && a ? a : l;
      if (n) {
        y = y.decompose(p, d), v = v.decompose(p, d);
        const F = y.rotate, U = v.rotate, W = [F - 360, F, F + 360], et = W.map((_n) => Math.abs(_n - U)), At = Math.min(...et), Pt = et.indexOf(At);
        y.rotate = W[Pt];
      }
      t && (i || (y.rotate = e.rotate || 0), this._isDeclarative && h && (v.rotate = h)), s.from(v), s.to(y);
      const A = s.at(x);
      return h = A.rotate, a = new f(A), this.addTransform(a), r._addRunner(this), s.done();
    }
    function g(x) {
      (x.origin || "center").toString() !== (e.origin || "center").toString() && (o = Xt(x, r)), e = { ...x, origin: o };
    }
    return this.queue(u, c, g, !0), this._isDeclarative && this._rememberMorpher("transform", s), this;
  },
  // Animatable x-axis
  x(e) {
    return this._queueNumber("x", e);
  },
  // Animatable y-axis
  y(e) {
    return this._queueNumber("y", e);
  },
  ax(e) {
    return this._queueNumber("ax", e);
  },
  ay(e) {
    return this._queueNumber("ay", e);
  },
  dx(e = 0) {
    return this._queueNumberDelta("x", e);
  },
  dy(e = 0) {
    return this._queueNumberDelta("y", e);
  },
  dmove(e, t) {
    return this.dx(e).dy(t);
  },
  _queueNumberDelta(e, t) {
    if (t = new m(t), this._tryRetarget(e, t)) return this;
    const n = new it(this._stepper).to(t);
    let i = null;
    return this.queue(
      function() {
        i = this.element()[e](), n.from(i), n.to(i + t);
      },
      function(s) {
        return this.element()[e](n.at(s)), n.done();
      },
      function(s) {
        n.to(i + new m(s));
      }
    ), this._rememberMorpher(e, n), this;
  },
  _queueObject(e, t) {
    if (this._tryRetarget(e, t)) return this;
    const n = new it(this._stepper).to(t);
    return this.queue(
      function() {
        n.from(this.element()[e]());
      },
      function(i) {
        return this.element()[e](n.at(i)), n.done();
      }
    ), this._rememberMorpher(e, n), this;
  },
  _queueNumber(e, t) {
    return this._queueObject(e, new m(t));
  },
  // Animatable center x-axis
  cx(e) {
    return this._queueNumber("cx", e);
  },
  // Animatable center y-axis
  cy(e) {
    return this._queueNumber("cy", e);
  },
  // Add animatable move
  move(e, t) {
    return this.x(e).y(t);
  },
  amove(e, t) {
    return this.ax(e).ay(t);
  },
  // Add animatable center
  center(e, t) {
    return this.cx(e).cy(t);
  },
  // Add animatable size
  size(e, t) {
    let n;
    return (!e || !t) && (n = this._element.bbox()), e || (e = n.width / n.height * t), t || (t = n.height / n.width * e), this.width(e).height(t);
  },
  // Add animatable width
  width(e) {
    return this._queueNumber("width", e);
  },
  // Add animatable height
  height(e) {
    return this._queueNumber("height", e);
  },
  // Add animatable plot
  plot(e, t, n, i) {
    if (arguments.length === 4)
      return this.plot([e, t, n, i]);
    if (this._tryRetarget("plot", e)) return this;
    const s = new it(this._stepper).type(this._element.MorphArray).to(e);
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
  leading(e) {
    return this._queueNumber("leading", e);
  },
  // Add animatable viewbox
  viewbox(e, t, n, i) {
    return this._queueObject("viewbox", new Z(e, t, n, i));
  },
  update(e) {
    return typeof e != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (e.opacity != null && this.attr("stop-opacity", e.opacity), e.color != null && this.attr("stop-color", e.color), e.offset != null && this.attr("offset", e.offset), this);
  }
});
w(D, { rx: pe, ry: me, from: Ke, to: tn });
S(D, "Runner");
class we extends k {
  constructor(t, n = t) {
    super(T("svg", t), n), this.namespace();
  }
  // Creates and returns defs element
  defs() {
    return this.isRoot() ? j(this.node.querySelector("defs")) || this.put(new fe()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof _.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  // Add namespaces
  namespace() {
    return this.isRoot() ? this.attr({ xmlns: ae, version: "1.1" }).attr(
      "xmlns:xlink",
      St,
      jt
    ) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, jt).attr("xmlns:svgjs", null, jt);
  }
  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    return this.isRoot() ? this : super.root();
  }
}
b({
  Container: {
    // Create nested svg document
    nested: E(function() {
      return this.put(new we());
    })
  }
});
S(we, "Svg", !0);
let ve = class extends k {
  // Initialize node
  constructor(t, n = t) {
    super(T("symbol", t), n);
  }
};
b({
  Container: {
    symbol: E(function() {
      return this.put(new ve());
    })
  }
});
S(ve, "Symbol");
function cs(e) {
  return this._build === !1 && this.clear(), this.node.appendChild(_.document.createTextNode(e)), this;
}
function ds() {
  return this.node.getComputedTextLength();
}
function fs(e, t = this.bbox()) {
  return e == null ? t.x : this.attr("x", this.attr("x") + e - t.x);
}
function ps(e, t = this.bbox()) {
  return e == null ? t.y : this.attr("y", this.attr("y") + e - t.y);
}
function ms(e, t, n = this.bbox()) {
  return this.x(e, n).y(t, n);
}
function gs(e, t = this.bbox()) {
  return e == null ? t.cx : this.attr("x", this.attr("x") + e - t.cx);
}
function ys(e, t = this.bbox()) {
  return e == null ? t.cy : this.attr("y", this.attr("y") + e - t.cy);
}
function bs(e, t, n = this.bbox()) {
  return this.cx(e, n).cy(t, n);
}
function ws(e) {
  return this.attr("x", e);
}
function vs(e) {
  return this.attr("y", e);
}
function xs(e, t) {
  return this.ax(e).ay(t);
}
function _s(e) {
  return this._build = !!e, this;
}
const an = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amove: xs,
  ax: ws,
  ay: vs,
  build: _s,
  center: bs,
  cx: gs,
  cy: ys,
  length: ds,
  move: ms,
  plain: cs,
  x: fs,
  y: ps
}, Symbol.toStringTag, { value: "Module" }));
class G extends L {
  // Initialize node
  constructor(t, n = t) {
    super(T("text", t), n), this.dom.leading = this.dom.leading ?? new m(1.3), this._rebuild = !0, this._build = !1;
  }
  // Set / get leading
  leading(t) {
    return t == null ? this.dom.leading : (this.dom.leading = new m(t), this.rebuild());
  }
  // Rebuild appearance type
  rebuild(t) {
    if (typeof t == "boolean" && (this._rebuild = t), this._rebuild) {
      const n = this;
      let i = 0;
      const s = this.dom.leading;
      this.each(function(o) {
        if (Ut(this.node)) return;
        const r = _.window.getComputedStyle(this.node).getPropertyValue("font-size"), a = s * new m(r);
        this.dom.newLined && (this.attr("x", n.attr("x")), this.text() === `
` ? i += a : (this.attr("dy", o ? a + i : 0), i = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  // overwrite method from parent to set data properly
  setData(t) {
    return this.dom = t, this.dom.leading = new m(t.leading || 1.3), this;
  }
  writeDataToDom() {
    return De(this, this.dom, { leading: 1.3 }), this;
  }
  // Set the text content
  text(t) {
    if (t === void 0) {
      const n = this.node.childNodes;
      let i = 0;
      t = "";
      for (let s = 0, o = n.length; s < o; ++s) {
        if (n[s].nodeName === "textPath" || Ut(n[s])) {
          s === 0 && (i = s + 1);
          continue;
        }
        s !== i && n[s].nodeType !== 3 && j(n[s]).dom.newLined === !0 && (t += `
`), t += n[s].textContent;
      }
      return t;
    }
    if (this.clear().build(!0), typeof t == "function")
      t.call(this, this);
    else {
      t = (t + "").split(`
`);
      for (let n = 0, i = t.length; n < i; n++)
        this.newLine(t[n]);
    }
    return this.build(!1).rebuild();
  }
}
w(G, an);
b({
  Container: {
    // Create text element
    text: E(function(e = "") {
      return this.put(new G()).text(e);
    }),
    // Create plain text element
    plain: E(function(e = "") {
      return this.put(new G()).plain(e);
    })
  }
});
S(G, "Text");
class Dt extends L {
  // Initialize node
  constructor(t, n = t) {
    super(T("tspan", t), n), this._build = !1;
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
    if (!(t instanceof G))
      return this;
    const n = t.index(this), i = _.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = t.dom.leading * new m(i);
    return this.dy(n ? s : 0).attr("x", t.x());
  }
  // Set text content
  text(t) {
    return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
  }
}
w(Dt, an);
b({
  Tspan: {
    tspan: E(function(e = "") {
      const t = new Dt();
      return this._build || this.clear(), this.put(t).text(e);
    })
  },
  Text: {
    newLine: function(e = "") {
      return this.tspan(e).newLine();
    }
  }
});
S(Dt, "Tspan");
class Bt extends L {
  constructor(t, n = t) {
    super(T("circle", t), n);
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
    return this.radius(new m(t).divide(2));
  }
}
w(Bt, { x: Ve, y: Xe, cx: Ue, cy: We, width: $e, height: Qe });
b({
  Container: {
    // Create circle element
    circle: E(function(e = 0) {
      return this.put(new Bt()).size(e).move(0, 0);
    })
  }
});
S(Bt, "Circle");
class te extends k {
  constructor(t, n = t) {
    super(T("clipPath", t), n);
  }
  // Unclip all clipped elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unclip();
    }), super.remove();
  }
  targets() {
    return ft("svg [clip-path*=" + this.id() + "]");
  }
}
b({
  Container: {
    // Create clipping element
    clip: E(function() {
      return this.defs().put(new te());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(e) {
      const t = e instanceof te ? e : this.parent().clip().add(e);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    // Unclip element
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
S(te, "ClipPath");
class hn extends B {
  constructor(t, n = t) {
    super(T("foreignObject", t), n);
  }
}
b({
  Container: {
    foreignObject: E(function(e, t) {
      return this.put(new hn()).size(e, t);
    })
  }
});
S(hn, "ForeignObject");
function Ss(e, t) {
  return this.children().forEach((n) => {
    let i;
    try {
      i = n.node instanceof he().SVGSVGElement ? new Z(n.attr(["x", "y", "width", "height"])) : n.bbox();
    } catch {
      return;
    }
    const s = new f(n), o = s.translate(e, t).transform(s.inverse()), r = new P(i.x, i.y).transform(o);
    n.move(r.x, r.y);
  }), this;
}
function zs(e) {
  return this.dmove(e, 0);
}
function Ms(e) {
  return this.dmove(0, e);
}
function Cs(e, t = this.bbox()) {
  return e == null ? t.height : this.size(t.width, e, t);
}
function Es(e = 0, t = 0, n = this.bbox()) {
  const i = e - n.x, s = t - n.y;
  return this.dmove(i, s);
}
function Ts(e, t, n = this.bbox()) {
  const i = dt(this, e, t, n), s = i.width / n.width, o = i.height / n.height;
  return this.children().forEach((r) => {
    const a = new P(n).transform(new f(r).inverse());
    r.scale(s, o, a.x, a.y);
  }), this;
}
function As(e, t = this.bbox()) {
  return e == null ? t.width : this.size(e, t.height, t);
}
function Ps(e, t = this.bbox()) {
  return e == null ? t.x : this.move(e, t.y, t);
}
function Zs(e, t = this.bbox()) {
  return e == null ? t.y : this.move(t.x, e, t);
}
const ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dmove: Ss,
  dx: zs,
  dy: Ms,
  height: Cs,
  move: Es,
  size: Ts,
  width: As,
  x: Ps,
  y: Zs
}, Symbol.toStringTag, { value: "Module" }));
class yt extends k {
  constructor(t, n = t) {
    super(T("g", t), n);
  }
}
w(yt, ln);
b({
  Container: {
    // Create a group element
    group: E(function() {
      return this.put(new yt());
    })
  }
});
S(yt, "G");
class kt extends k {
  constructor(t, n = t) {
    super(T("a", t), n);
  }
  // Link target attribute
  target(t) {
    return this.attr("target", t);
  }
  // Link url
  to(t) {
    return this.attr("href", t, St);
  }
}
w(kt, ln);
b({
  Container: {
    // Create a hyperlink element
    link: E(function(e) {
      return this.put(new kt()).to(e);
    })
  },
  Element: {
    unlink() {
      const e = this.linker();
      if (!e) return this;
      const t = e.parent();
      if (!t)
        return this.remove();
      const n = t.index(e);
      return t.add(this, n), e.remove(), this;
    },
    linkTo(e) {
      let t = this.linker();
      return t || (t = new kt(), this.wrap(t)), typeof e == "function" ? e.call(t, t) : t.to(e), this;
    },
    linker() {
      const e = this.parent();
      return e && e.node.nodeName.toLowerCase() === "a" ? e : null;
    }
  }
});
S(kt, "A");
class ee extends k {
  // Initialize node
  constructor(t, n = t) {
    super(T("mask", t), n);
  }
  // Unmask all masked elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unmask();
    }), super.remove();
  }
  targets() {
    return ft("svg [mask*=" + this.id() + "]");
  }
}
b({
  Container: {
    mask: E(function() {
      return this.defs().put(new ee());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference("mask");
    },
    maskWith(e) {
      const t = e instanceof ee ? e : this.parent().mask().add(e);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    // Unmask element
    unmask() {
      return this.attr("mask", null);
    }
  }
});
S(ee, "Mask");
class un extends B {
  constructor(t, n = t) {
    super(T("stop", t), n);
  }
  // add color stops
  update(t) {
    return (typeof t == "number" || t instanceof m) && (t = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), t.opacity != null && this.attr("stop-opacity", t.opacity), t.color != null && this.attr("stop-color", t.color), t.offset != null && this.attr("offset", new m(t.offset)), this;
  }
}
b({
  Gradient: {
    // Add a color stop
    stop: function(e, t, n) {
      return this.put(new un()).update(e, t, n);
    }
  }
});
S(un, "Stop");
function Is(e, t) {
  if (!e) return "";
  if (!t) return e;
  let n = e + "{";
  for (const i in t)
    n += Mn(i) + ":" + t[i] + ";";
  return n += "}", n;
}
class ne extends B {
  constructor(t, n = t) {
    super(T("style", t), n);
  }
  addText(t = "") {
    return this.node.textContent += t, this;
  }
  font(t, n, i = {}) {
    return this.rule("@font-face", {
      fontFamily: t,
      src: n,
      ...i
    });
  }
  rule(t, n) {
    return this.addText(Is(t, n));
  }
}
b("Dom", {
  style(e, t) {
    return this.put(new ne()).rule(e, t);
  },
  fontface(e, t, n) {
    return this.put(new ne()).font(e, t, n);
  }
});
S(ne, "Style");
class xe extends G {
  // Initialize node
  constructor(t, n = t) {
    super(T("textPath", t), n);
  }
  // return the array of the path track element
  array() {
    const t = this.track();
    return t ? t.array() : null;
  }
  // Plot path if any
  plot(t) {
    const n = this.track();
    let i = null;
    return n && (i = n.plot(t)), t == null ? i : this;
  }
  // Get the path element
  track() {
    return this.reference("href");
  }
}
b({
  Container: {
    textPath: E(function(e, t) {
      return e instanceof G || (e = this.text(e)), e.path(t);
    })
  },
  Text: {
    // Create path for text to run on
    path: E(function(e, t = !0) {
      const n = new xe();
      e instanceof pt || (e = this.defs().path(e)), n.attr("href", "#" + e, St);
      let i;
      if (t)
        for (; i = this.node.firstChild; )
          n.node.appendChild(i);
      return this.put(n);
    }),
    // Get the textPath children
    textPath() {
      return this.findOne("textPath");
    }
  },
  Path: {
    // creates a textPath from this path
    text: E(function(e) {
      return e instanceof G || (e = new G().addTo(this.parent()).text(e)), e.path(this);
    }),
    targets() {
      return ft("svg textPath").filter((e) => (e.attr("href") || "").includes(this.id()));
    }
  }
});
xe.prototype.MorphArray = rt;
S(xe, "TextPath");
class cn extends L {
  constructor(t, n = t) {
    super(T("use", t), n);
  }
  // Use element as a reference
  use(t, n) {
    return this.attr("href", (n || "") + "#" + t, St);
  }
}
b({
  Container: {
    // Create a use element
    use: E(function(e, t) {
      return this.put(new cn()).use(e, t);
    })
  }
});
S(cn, "Use");
const Ns = N;
w([we, ve, Ot, xt, It], R("viewbox"));
w([ct, gt, mt, pt], R("marker"));
w(G, R("Text"));
w(pt, R("Path"));
w(fe, R("Defs"));
w([G, Dt], R("Tspan"));
w([Tt, Mt, Ct, D], R("radius"));
w(zt, R("EventTarget"));
w(K, R("Dom"));
w(B, R("Element"));
w(L, R("Shape"));
w([k, Je], R("Container"));
w(Ct, R("Gradient"));
w(D, R("Runner"));
ot.extend(Sn());
Ki([
  m,
  C,
  Z,
  f,
  ut,
  tt,
  rt,
  P
]);
ts();
const Pe = (e) => (e.changedTouches && (e = e.changedTouches[0]), { x: e.clientX, y: e.clientY });
class Rs {
  constructor(t) {
    t.remember("_draggable", this), this.el = t, this.drag = this.drag.bind(this), this.startDrag = this.startDrag.bind(this), this.endDrag = this.endDrag.bind(this);
  }
  // Enables or disabled drag based on input
  init(t) {
    t ? (this.el.on("mousedown.drag", this.startDrag), this.el.on("touchstart.drag", this.startDrag, { passive: !1 })) : (this.el.off("mousedown.drag"), this.el.off("touchstart.drag"));
  }
  // Start dragging
  startDrag(t) {
    const n = !t.type.indexOf("mouse");
    if (n && t.which !== 1 && t.buttons !== 0 || this.el.dispatch("beforedrag", { event: t, handler: this }).defaultPrevented)
      return;
    t.preventDefault(), t.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Pe(t));
    const i = (n ? "mousemove" : "touchmove") + ".drag", s = (n ? "mouseup" : "touchend") + ".drag";
    V(window, i, this.drag, this, { passive: !1 }), V(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: t, handler: this, box: this.box });
  }
  // While dragging
  drag(t) {
    const { box: n, lastClick: i } = this, s = this.el.point(Pe(t)), o = s.x - i.x, r = s.y - i.y;
    if (!o && !r) return n;
    const a = n.x + o, h = n.y + r;
    this.box = new Z(a, h, n.w, n.h), this.lastClick = s, !this.el.dispatch("dragmove", {
      event: t,
      handler: this,
      box: this.box,
      dx: o,
      dy: r
    }).defaultPrevented && this.move(a, h);
  }
  move(t, n) {
    this.el.type === "svg" ? yt.prototype.move.call(this.el, t, n) : this.el.move(t, n);
  }
  endDrag(t) {
    this.drag(t), this.el.fire("dragend", { event: t, handler: this, box: this.box }), H(window, "mousemove.drag"), H(window, "touchmove.drag"), H(window, "mouseup.drag"), H(window, "touchend.drag"), this.init(!0);
  }
}
w(B, {
  draggable(e = !0) {
    return (this.remember("_draggable") || new Rs(this)).init(e), this;
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
function ie(e, t, n, i = null) {
  return function(s) {
    s.preventDefault(), s.stopPropagation();
    var o = s.pageX || s.touches[0].pageX, r = s.pageY || s.touches[0].pageY;
    t.fire(e, { x: o, y: r, event: s, index: i, points: n });
  };
}
function se([e, t], { a: n, b: i, c: s, d: o, e: r, f: a }) {
  return [e * n + t * s + r, e * i + t * o + a];
}
class dn {
  constructor(t) {
    this.el = t, t.remember("_selectHandler", this), this.selection = new yt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const n = he();
    this.observer = new n.MutationObserver(this.mutationHandler);
  }
  init(t) {
    this.createHandle = t.createHandle || this.createHandleFn, this.createRot = t.createRot || this.createRotFn, this.updateHandle = t.updateHandle || this.updateHandleFn, this.updateRot = t.updateRot || this.updateRotFn, this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createResizeHandles(), this.updateResizeHandles(), this.createRotationHandle(), this.updateRotationHandle(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(t, n) {
    if (!t) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(n);
  }
  createSelection() {
    this.selection.polygon(this.handlePoints).addClass("svg_select_shape");
  }
  updateSelection() {
    this.selection.get(0).plot(this.handlePoints);
  }
  createResizeHandles() {
    this.handlePoints.forEach((t, n, i) => {
      const s = this.order[n];
      this.createHandle.call(this, this.selection, t, n, i, s), this.selection.get(n + 1).addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection touchstart.selection", ie(s, this.el, this.handlePoints, n));
    });
  }
  createHandleFn(t) {
    t.polyline();
  }
  updateHandleFn(t, n, i, s) {
    const o = s.at(i - 1), r = s[(i + 1) % s.length], a = n, h = [a[0] - o[0], a[1] - o[1]], l = [a[0] - r[0], a[1] - r[1]], u = Math.sqrt(h[0] * h[0] + h[1] * h[1]), c = Math.sqrt(l[0] * l[0] + l[1] * l[1]), g = [h[0] / u, h[1] / u], x = [l[0] / c, l[1] / c], p = [a[0] - g[0] * 10, a[1] - g[1] * 10], d = [a[0] - x[0] * 10, a[1] - x[1] * 10];
    t.plot([p, a, d]);
  }
  updateResizeHandles() {
    this.handlePoints.forEach((t, n, i) => {
      const s = this.order[n];
      this.updateHandle.call(this, this.selection.get(n + 1), t, n, i, s);
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
  updateRotFn(t, n) {
    const i = this.getPoint("t");
    t.get(0).plot(i[0], i[1], n[0], n[1]), t.get(1).center(n[0], n[1]);
  }
  createRotationHandle() {
    const t = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection touchstart.selection", ie("rot", this.el, this.handlePoints));
    this.createRot.call(this, t);
  }
  updateRotationHandle() {
    const t = this.selection.findOne("g.svg_select_handle_rot");
    this.updateRot(t, this.rotationPoint, this.handlePoints);
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.bbox(), n = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(t).map((i) => se(i, n)), this.rotationPoint = se(this.getRotationPoint(t), n);
  }
  // A collection of all the points we need to draw our ui
  getHandlePoints({ x: t, x2: n, y: i, y2: s, cx: o, cy: r } = this.el.bbox()) {
    return [
      [t, i],
      [o, i],
      [n, i],
      [n, r],
      [n, s],
      [o, s],
      [t, s],
      [t, r]
    ];
  }
  // A collection of all the points we need to draw our ui
  getRotationPoint({ y: t, cx: n } = this.el.bbox()) {
    return [n, t - 20];
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updateResizeHandles(), this.updateRotationHandle();
  }
}
class ks {
  constructor(t) {
    this.el = t, t.remember("_pointSelectHandler", this), this.selection = new yt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const n = he();
    this.observer = new n.MutationObserver(this.mutationHandler);
  }
  init(t) {
    this.createHandle = t.createHandle || this.createHandleFn, this.updateHandle = t.updateHandle || this.updateHandleFn, this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createPointHandles(), this.updatePointHandles(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(t, n) {
    if (!t) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(n);
  }
  createSelection() {
    this.selection.polygon(this.points).addClass("svg_select_shape_pointSelect");
  }
  updateSelection() {
    this.selection.get(0).plot(this.points);
  }
  createPointHandles() {
    this.points.forEach((t, n, i) => {
      this.createHandle.call(this, this.selection, t, n, i), this.selection.get(n + 1).addClass("svg_select_handle_point").on("mousedown.selection touchstart.selection", ie("point", this.el, this.points, n));
    });
  }
  createHandleFn(t) {
    t.circle(5);
  }
  updateHandleFn(t, n) {
    t.center(n[0], n[1]);
  }
  updatePointHandles() {
    this.points.forEach((t, n, i) => {
      this.updateHandle.call(this, this.selection.get(n + 1), t, n, i);
    });
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.points = this.el.array().map((n) => se(n, t));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}
const fn = (e) => function(t = !0, n = {}) {
  typeof t == "object" && (n = t, t = !0);
  let i = this.remember("_" + e.name);
  return i || (t.prototype instanceof dn ? (i = new t(this), t = !0) : i = new e(this), this.remember("_" + e.name, i)), i.active(t, n), this;
};
w(B, {
  select: fn(dn)
});
w([mt, gt, ct], {
  pointSelect: fn(ks)
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
const Zt = (e) => (e.changedTouches && (e = e.changedTouches[0]), { x: e.clientX, y: e.clientY }), pn = (e) => {
  let t = 1 / 0, n = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (let o = 0; o < e.length; o++) {
    const r = e[o];
    t = Math.min(t, r[0]), n = Math.min(n, r[1]), i = Math.max(i, r[0]), s = Math.max(s, r[1]);
  }
  return new Z(t, n, i - t, s - n);
};
function Os(e, t, n) {
  const s = [
    [e.x, e.y],
    [e.x + e.width, e.y],
    [e.x + e.width, e.y + e.height],
    [e.x, e.y + e.height]
  ].map(([o, r]) => {
    const a = o - t[0], h = r - t[1], l = a * n, u = h * n;
    return [l + t[0], u + t[1]];
  });
  return pn(s);
}
class Ze {
  constructor(t) {
    this.el = t, t.remember("_ResizeHandler", this), this.lastCoordinates = null, this.eventType = "", this.lastEvent = null, this.handleResize = this.handleResize.bind(this), this.resize = this.resize.bind(this), this.endResize = this.endResize.bind(this), this.rotate = this.rotate.bind(this), this.movePoint = this.movePoint.bind(this);
  }
  active(t, n) {
    this.preserveAspectRatio = n.preserveAspectRatio ?? !1, this.aroundCenter = n.aroundCenter ?? !1, this.grid = n.grid ?? 0, this.degree = n.degree ?? 0, this.el.off(".resize"), t && (this.el.on(
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
    const { event: n, index: i, points: s } = t.detail, o = !n.type.indexOf("mouse");
    if (o && (n.which || n.buttons) !== 1 || this.el.dispatch("beforeresize", { event: t, handler: this }).defaultPrevented)
      return;
    this.box = this.el.bbox(), this.startPoint = this.el.point(Zt(n)), this.index = i, this.points = s.slice();
    const r = (o ? "mousemove" : "touchmove") + ".resize", a = (o ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    t.type === "point" ? V(window, r, this.movePoint) : t.type === "rot" ? V(window, r, this.rotate) : V(window, r, this.resize), V(window, a, this.endResize);
  }
  resize(t) {
    this.lastEvent = t;
    const n = this.snapToGrid(this.el.point(Zt(t)));
    let i = n.x - this.startPoint.x, s = n.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (i *= 2, s *= 2);
    const o = this.box.x + i, r = this.box.y + s, a = this.box.x2 + i, h = this.box.y2 + s;
    let l = new Z(this.box);
    if (this.eventType.includes("l") && (l.x = Math.min(o, this.box.x2), l.x2 = Math.max(o, this.box.x2)), this.eventType.includes("r") && (l.x = Math.min(a, this.box.x), l.x2 = Math.max(a, this.box.x)), this.eventType.includes("t") && (l.y = Math.min(r, this.box.y2), l.y2 = Math.max(r, this.box.y2)), this.eventType.includes("b") && (l.y = Math.min(h, this.box.y), l.y2 = Math.max(h, this.box.y)), l.width = l.x2 - l.x, l.height = l.y2 - l.y, this.preserveAspectRatio) {
      const u = l.width / this.box.width, c = l.height / this.box.height, g = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], x = (g.indexOf(this.eventType) + 4) % g.length, p = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[x];
      let d = this.eventType.includes("t") || this.eventType.includes("b") ? c : u;
      d = this.eventType.length === 2 ? Math.max(u, c) : d, l = Os(this.box, p, d);
    }
    this.el.dispatch("resize", {
      box: new Z(l),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.size(l.width, l.height).move(l.x, l.y);
  }
  movePoint(t) {
    this.lastEvent = t;
    const { x: n, y: i } = this.snapToGrid(this.el.point(Zt(t))), s = this.el.array().slice();
    s[this.index] = [n, i], !this.el.dispatch("resize", {
      box: pn(s),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(t) {
    this.lastEvent = t;
    const n = this.startPoint, i = this.el.point(Zt(t)), { cx: s, cy: o } = this.box, r = n.x - s, a = n.y - o, h = i.x - s, l = i.y - o, u = Math.sqrt(r * r + a * a) * Math.sqrt(h * h + l * l);
    if (u === 0)
      return;
    let c = Math.acos((r * h + a * l) / u) / Math.PI * 180;
    if (!c) return;
    i.x < n.x && (c = -c);
    const g = new f(this.el), { x, y: p } = new P(s, o).transformO(g), { rotate: d } = g.decompose(), y = this.snapToAngle(d + c) - d;
    this.el.dispatch("resize", {
      box: this.box,
      angle: y,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.transform(g.rotateO(y, x, p));
  }
  endResize(t) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(t), this.lastEvent = null, this.eventType = "", H(window, "mousemove.resize touchmove.resize"), H(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(t) {
    return this.grid && (t.x = Math.round(t.x / this.grid) * this.grid, t.y = Math.round(t.y / this.grid) * this.grid), t;
  }
  snapToAngle(t) {
    return this.degree && (t = Math.round(t / this.degree) * this.degree), t;
  }
}
w(B, {
  // Resize element with mouse
  resize: function(e = !0, t = {}) {
    typeof e == "object" && (t = e, e = !0);
    let n = this.remember("_ResizeHandler");
    return n || (e.prototype instanceof Ze ? (n = new e(this), e = !0) : n = new Ze(this), this.remember("_resizeHandler", n)), n.active(e, t), this;
  }
});
class mn {
  constructor(t, n = {}) {
    this.isActive = !1, this.node = t, this.options = {
      resizeEnabled: !0,
      rotateEnabled: !0,
      preserveAspectRatio: !1,
      aroundCenter: !1,
      grid: 0,
      degree: 0,
      ...n
    };
  }
  enable() {
    if (!this.isActive)
      try {
        this.node.svgGroup.selectize({
          // points: this.options.rotateEnabled ? ['tl', 'tr', 'bl', 'br', 'lt', 'rt', 'lb', 'rb', 'r'] : ['tl', 'tr', 'bl', 'br'],
          // rotationPoint: this.options.rotateEnabled,
          // classRect: 'select-border',
          // classPoints: 'select-point',
          // classLine: 'select-line',
          // classRotationPoint: 'select-rotation-point'
        }), this.options.resizeEnabled && this.node.svgGroup.resize({
          preserveAspectRatio: this.options.preserveAspectRatio,
          aroundCenter: this.options.aroundCenter,
          grid: this.options.grid,
          degree: this.options.degree
        }), this.addEventListeners(), this.isActive = !0;
      } catch (t) {
        console.warn("Failed to enable resize/rotate:", t);
      }
  }
  disable() {
    if (this.isActive)
      try {
        this.node.svgGroup.selectize && this.node.svgGroup.selectize(!1), this.node.svgGroup.resize && this.node.svgGroup.resize(!1), this.removeEventListeners(), this.isActive = !1;
      } catch (t) {
        console.warn("Failed to disable resize/rotate:", t);
      }
  }
  addEventListeners() {
    this.node.svgGroup.on("resize", (t) => {
      this.handleResize(t), this.options.onResize && this.options.onResize(t);
    }), this.node.svgGroup.on("rotate", (t) => {
      this.handleRotate(t), this.options.onRotate && this.options.onRotate(t);
    });
  }
  removeEventListeners() {
    this.node.svgGroup.off("resize"), this.node.svgGroup.off("rotate");
  }
  handleResize(t) {
    if (t.detail && t.detail.box) {
      const n = t.detail.box;
      this.node.options.width = n.width, this.node.options.height = n.height, this.node.options.x = n.x, this.node.options.y = n.y, this.updateBackground(), this.node.centerText();
    }
  }
  handleRotate(t) {
    t.detail && t.detail.angle !== void 0 && (this.node.options.rotate.rotationAngle = t.detail.angle);
  }
  updateBackground() {
    const { width: t, height: n, shape: i, backgroundColor: s, borderColor: o, borderWidth: r } = this.node.options;
    switch (this.node.backgroundRect.remove(), i) {
      case "circle":
        const a = Math.min(t, n) / 2;
        this.node.backgroundRect = this.node.svgGroup.circle(a * 2).fill(s).stroke({ color: o, width: r });
        break;
      case "ellipse":
        this.node.backgroundRect = this.node.svgGroup.ellipse(t, n).fill(s).stroke({ color: o, width: r });
        break;
      default:
        this.node.backgroundRect = this.node.svgGroup.rect(t, n).fill(s).stroke({ color: o, width: r }).radius(4);
        break;
    }
    this.node.backgroundRect.back();
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, this.isActive && (this.disable(), this.enable());
  }
}
class gn {
  // Will be properly typed when Slate is available
  constructor(t, n) {
    this.id = t.id || this.generateId(), this.slate = n, this.options = {
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
      resizeRotate: {
        resizeEnabled: !1,
        rotateEnabled: !1,
        preserveAspectRatio: !1,
        aroundCenter: !1,
        grid: 0,
        degree: 0
      },
      ...t
    }, this.create();
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }
  create() {
    this.svgGroup = this.slate.canvas.group(), this.createBackground(), this.createText(), this.position(this.options.x, this.options.y), this.resizeRotate = new mn(this, this.options.resizeRotate), this.options.allowDrag && !this.options.isLocked && this.makeDraggable();
  }
  createBackground() {
    const { width: t, height: n, backgroundColor: i, borderColor: s, borderWidth: o, shape: r } = this.options;
    switch (r) {
      case "circle":
        const a = Math.min(t, n) / 2;
        this.backgroundRect = this.svgGroup.circle(a * 2).fill(i).stroke({ color: s, width: o });
        break;
      case "ellipse":
        this.backgroundRect = this.svgGroup.ellipse(t, n).fill(i).stroke({ color: s, width: o });
        break;
      default:
        this.backgroundRect = this.svgGroup.rect(t, n).fill(i).stroke({ color: s, width: o }).radius(4);
        break;
    }
  }
  createText() {
    const { text: t, fontSize: n, fontFamily: i, fontColor: s, textOpacity: o } = this.options;
    this.textElement = this.svgGroup.text(t).font({
      family: i,
      size: n,
      fill: s,
      opacity: o
    }), this.centerText();
  }
  centerText() {
    const { width: t, height: n, textXAlign: i, textYAlign: s, textOffset: o } = this.options, r = this.textElement.bbox();
    let a = o.x || 0, h = o.y || 0;
    switch (i) {
      case "left":
        a += 5;
        break;
      case "right":
        a += t - r.width - 5;
        break;
      default:
        a += (t - r.width) / 2;
        break;
    }
    switch (s) {
      case "top":
        h += 5;
        break;
      case "bottom":
        h += n - r.height - 5;
        break;
      default:
        h += (n - r.height) / 2;
        break;
    }
    this.textElement.move(a, h);
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("dragstart", (t) => {
      this.toFront();
    }), this.svgGroup.on("dragend", (t) => {
      const n = this.svgGroup.bbox();
      this.options.x = n.x, this.options.y = n.y;
    });
  }
  position(t, n, i, s, o) {
    this.options.x = t, this.options.y = n, o && o > 0 ? this.svgGroup.animate(o, s || "-").move(t, n).after(i || (() => {
    })) : (this.svgGroup.move(t, n), i && i());
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
  setSize(t, n) {
    if (this.options.width = t, this.options.height = n, this.backgroundRect instanceof Tt)
      this.backgroundRect.size(t, n);
    else if (this.backgroundRect instanceof Bt) {
      const i = Math.min(t, n) / 2;
      this.backgroundRect.radius(i);
    } else this.backgroundRect instanceof Mt && this.backgroundRect.size(t, n);
    this.centerText();
  }
  setColors(t, n) {
    t && (this.options.backgroundColor = t, this.backgroundRect.fill(t)), n && (this.options.borderColor = n, this.backgroundRect.stroke({ color: n }));
  }
  lock() {
    this.options.isLocked = !0, this.options.allowDrag = !1, this.svgGroup.draggable && this.svgGroup.draggable(!1), this.disableResizeRotate();
  }
  unlock() {
    this.options.isLocked = !1, this.options.allowDrag = !0, this.makeDraggable();
  }
  // Resize/Rotate functionality
  enableResizeRotate() {
    this.resizeRotate.enable();
  }
  disableResizeRotate() {
    this.resizeRotate.disable();
  }
  enableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: !0 }), this.resizeRotate.isEnabled() || this.resizeRotate.enable();
  }
  disableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: !1 });
  }
  enableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: !0 }), this.resizeRotate.isEnabled() || this.resizeRotate.enable();
  }
  disableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: !1 });
  }
  isResizeRotateEnabled() {
    return this.resizeRotate.isEnabled();
  }
  setRotation(t) {
    this.options.rotate.rotationAngle = t, this.svgGroup.rotate(t);
  }
  getRotation() {
    return this.options.rotate?.rotationAngle || 0;
  }
}
class Ds {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const n = new gn(t, this.slate);
    return this.nodes.set(n.id, n), n;
  }
  remove(t) {
    const n = this.nodes.get(t);
    return n ? (n.remove(), this.nodes.delete(t), !0) : !1;
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
  moveNodes(t, n = {}) {
    t.data && Array.isArray(t.data.nodes) && t.data.nodes.forEach((i) => {
      const s = this.one(i.id);
      if (s) {
        const o = n.animate ? t.data.dur || 500 : 0;
        s.position(i.x, i.y, void 0, void 0, o);
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
class Bs {
  constructor(t) {
    this.slate = t;
  }
  onZoom(t) {
    if (this.slate.options.followMe) {
      const n = this.slate.options.viewPort.originalWidth / t.data.zoomLevel * 100;
      console.log("Zoom to:", n + "%");
    }
  }
  onNodePositioned(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && n.position(
      t.data.location.x,
      t.data.location.y,
      () => {
      },
      t.data.easing,
      t.data.duration || 500
    );
  }
  onNodeLinkRemoved(t) {
    const n = this.slate.nodes.one(t.data.id);
    n?.links && n.links.unset(!1);
  }
  onNodeLinkAdded(t) {
    const n = this.slate.nodes.one(t.data.id);
    n?.links && n.links.set(t, !1);
  }
  onNodeUnlocked(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && n.unlock();
  }
  onNodeLocked(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && n.lock();
  }
  onNodeBehaviorChanged(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && t.data.behaviorChanges.forEach((i) => {
      typeof i.value == "object" ? (n.options[i.name] = i.value.val, Object.keys(i.value).forEach((s) => {
        s !== "val" && (n.options[s] = i.value[s]);
      })) : n.options[i.name] = i.value;
    });
  }
  onNodeToBack(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && n.toBack();
  }
  onNodeToFront(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && n.toFront();
  }
  onNodeShapeChanged(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && (Object.assign(n.options, t.data), console.log("Shape changed for node:", t.data.id));
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
      let n = t.data.nodeOptions;
      Array.isArray(n) || (n = [n]), n.forEach((i) => {
        this.slate.nodes.one(i.id) || this.slate.nodes.add(i);
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
    const n = this.slate.nodes.one(t.data.id);
    n && (Object.assign(n.options, t.data), n.setSize(t.data.width, t.data.height));
  }
  onNodeRotated(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && (n.options.textOffset = t.data.textOffset, Object.assign(n.options, t.data), console.log("Node rotated:", t.data.id));
  }
  onNodeColorChanged(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && n.setColors(t.data.backgroundColor, t.data.borderColor);
  }
  onNodeTextChanged(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && (n.setText(t.data.text), n.options.fontSize = t.data.fontSize, n.options.fontFamily = t.data.fontFamily, n.options.fontColor = t.data.fontColor, n.options.textOpacity = t.data.textOpacity, n.options.textXAlign = t.data.textXAlign, n.options.textYAlign = t.data.textYAlign);
  }
  onNodeAITextChanged(t) {
    const n = this.slate.nodes.one(t.data.id);
    n && (n.options.ai = { ...t.data.ai, ...n.options.ai });
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
    const n = this.slate.nodes.one(t.data.id);
    n && (n.options.borderColor = t.data.borderColor, n.options.borderWidth = t.data.borderWidth, n.setColors(void 0, t.data.borderColor));
  }
  onLinePropertiesChanged(t) {
    (Array.isArray(t.data) ? t.data : [t.data]).forEach((i) => {
      const s = this.slate.nodes.one(i.id);
      s && Object.assign(s.options, i.options);
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
      const n = this.slate.options.containerStyle.prevBackgroundColor || "#fff";
      this.slate.options.containerStyle.backgroundColor = n, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
    }
  }
  onSlateBackgroundColorChanged(t) {
    this.slate.options.containerStyle.backgroundColor = t.data.color, this.slate.options.containerStyle.backgroundColorAsGradient = t.data.asGradient, this.slate.options.containerStyle.backgroundGradientType = t.data.gradientType, this.slate.options.containerStyle.backgroundGradientColors = t.data.gradientColors, this.slate.options.containerStyle.backgroundGradientStrategy = t.data.gradientStrategy, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
  }
  onLineColorChanged(t) {
    this.slate.options.defaultLineColor = t.data.color, this.slate.nodes.allNodes.forEach((n) => {
      n.options.lineColor = t.data.color, n.relationships?.associations && (n.relationships.associations.forEach((i) => {
        i.lineColor = t.data.color;
      }), n.relationships.refreshOwnRelationships());
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
var Ie = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ls(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var js = function() {
  var e = "", t, n, i, s = [], o = { passive: !0 }, r = { passive: !1 };
  window.addEventListener ? (t = "addEventListener", n = "removeEventListener") : (t = "attachEvent", n = "detachEvent", e = "on"), i = "onwheel" in document.createElement("div") ? "wheel" : (
    // Modern browsers support "wheel"
    document.onmousewheel !== void 0 ? "mousewheel" : (
      // Webkit and IE support at least "mousewheel"
      "DOMMouseScroll"
    )
  );
  function a(p, d) {
    var y = function(v) {
      !v && (v = window.event);
      var A = {
        // keep a ref to the original event object
        originalEvent: v,
        target: v.target || v.srcElement,
        type: "wheel",
        deltaMode: v.type == "MozMousePixelScroll" ? 0 : 1,
        deltaX: 0,
        delatZ: 0,
        preventDefault: function() {
          v.preventDefault ? v.preventDefault() : v.returnValue = !1;
        }
      };
      return i == "mousewheel" ? (A.deltaY = -0.025 * v.wheelDelta, v.wheelDeltaX && (A.deltaX = -0.025 * v.wheelDeltaX)) : A.deltaY = v.detail, d(A);
    };
    return s.push({
      element: p,
      fn: y
    }), y;
  }
  function h(p) {
    for (var d = 0; d < s.length; d++)
      if (s[d].element === p)
        return s[d].fn;
    return function() {
    };
  }
  function l(p) {
    for (var d = 0; d < s.length; d++)
      if (s[d].element === p)
        return s.splice(d, 1);
  }
  function u(p, d, y, v) {
    var A;
    i === "wheel" ? A = y : A = a(p, y), p[t](
      e + d,
      A,
      v ? o : r
    );
  }
  function c(p, d, y, v) {
    var A;
    i === "wheel" ? A = y : A = h(p), p[n](
      e + d,
      A,
      v ? o : r
    ), l(p);
  }
  function g(p, d, y) {
    u(p, i, d, y), i == "DOMMouseScroll" && u(p, "MozMousePixelScroll", d, y);
  }
  function x(p, d, y) {
    c(p, i, d, y), i == "DOMMouseScroll" && c(p, "MozMousePixelScroll", d, y);
  }
  return {
    on: g,
    off: x
  };
}(), _e = {
  /**
   * Extends an object
   *
   * @param  {Object} target object to extend
   * @param  {Object} source object to take properties from
   * @return {Object}        extended object
   */
  extend: function(e, t) {
    e = e || {};
    for (var n in t)
      this.isObject(t[n]) ? e[n] = this.extend(e[n], t[n]) : e[n] = t[n];
    return e;
  },
  /**
   * Checks if an object is a DOM element
   *
   * @param  {Object}  o HTML element or String
   * @return {Boolean}   returns true if object is a DOM element
   */
  isElement: function(e) {
    return e instanceof HTMLElement || e instanceof SVGElement || e instanceof SVGSVGElement || //DOM2
    e && typeof e == "object" && e !== null && e.nodeType === 1 && typeof e.nodeName == "string";
  },
  /**
   * Checks if an object is an Object
   *
   * @param  {Object}  o Object
   * @return {Boolean}   returns true if object is an Object
   */
  isObject: function(e) {
    return Object.prototype.toString.call(e) === "[object Object]";
  },
  /**
   * Checks if variable is Number
   *
   * @param  {Integer|Float}  n
   * @return {Boolean}   returns true if variable is Number
   */
  isNumber: function(e) {
    return !isNaN(parseFloat(e)) && isFinite(e);
  },
  /**
   * Search for an SVG element
   *
   * @param  {Object|String} elementOrSelector DOM Element or selector String
   * @return {Object|Null}                   SVG or null
   */
  getSvg: function(e) {
    var t, n;
    if (this.isElement(e))
      t = e;
    else if (typeof e == "string" || e instanceof String) {
      if (t = document.querySelector(e), !t)
        throw new Error(
          "Provided selector did not find any elements. Selector: " + e
        );
    } else
      throw new Error("Provided selector is not an HTML object nor String");
    if (t.tagName.toLowerCase() === "svg")
      n = t;
    else if (t.tagName.toLowerCase() === "object")
      n = t.contentDocument.documentElement;
    else if (t.tagName.toLowerCase() === "embed")
      n = t.getSVGDocument().documentElement;
    else
      throw t.tagName.toLowerCase() === "img" ? new Error(
        'Cannot script an SVG in an "img" element. Please use an "object" element or an in-line SVG.'
      ) : new Error("Cannot get SVG.");
    return n;
  },
  /**
   * Attach a given context to a function
   * @param  {Function} fn      Function
   * @param  {Object}   context Context
   * @return {Function}           Function with certain context
   */
  proxy: function(e, t) {
    return function() {
      return e.apply(t, arguments);
    };
  },
  /**
   * Returns object type
   * Uses toString that returns [object SVGPoint]
   * And than parses object type from string
   *
   * @param  {Object} o Any object
   * @return {String}   Object type
   */
  getType: function(e) {
    return Object.prototype.toString.apply(e).replace(/^\[object\s/, "").replace(/\]$/, "");
  },
  /**
   * If it is a touch event than add clientX and clientY to event object
   *
   * @param  {Event} evt
   * @param  {SVGSVGElement} svg
   */
  mouseAndTouchNormalize: function(e, t) {
    if (e.clientX === void 0 || e.clientX === null)
      if (e.clientX = 0, e.clientY = 0, e.touches !== void 0 && e.touches.length) {
        if (e.touches[0].clientX !== void 0)
          e.clientX = e.touches[0].clientX, e.clientY = e.touches[0].clientY;
        else if (e.touches[0].pageX !== void 0) {
          var n = t.getBoundingClientRect();
          e.clientX = e.touches[0].pageX - n.left, e.clientY = e.touches[0].pageY - n.top;
        }
      } else e.originalEvent !== void 0 && e.originalEvent.clientX !== void 0 && (e.clientX = e.originalEvent.clientX, e.clientY = e.originalEvent.clientY);
  },
  /**
   * Check if an event is a double click/tap
   * TODO: For touch gestures use a library (hammer.js) that takes in account other events
   * (touchmove and touchend). It should take in account tap duration and traveled distance
   *
   * @param  {Event}  evt
   * @param  {Event}  prevEvt Previous Event
   * @return {Boolean}
   */
  isDblClick: function(e, t) {
    if (e.detail === 2)
      return !0;
    if (t != null) {
      var n = e.timeStamp - t.timeStamp, i = Math.sqrt(
        Math.pow(e.clientX - t.clientX, 2) + Math.pow(e.clientY - t.clientY, 2)
      );
      return n < 250 && i < 10;
    }
    return !1;
  },
  /**
   * Returns current timestamp as an integer
   *
   * @return {Number}
   */
  now: Date.now || function() {
    return (/* @__PURE__ */ new Date()).getTime();
  },
  // From underscore.
  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  throttle: function(e, t, n) {
    var i = this, s, o, r, a = null, h = 0;
    n || (n = {});
    var l = function() {
      h = n.leading === !1 ? 0 : i.now(), a = null, r = e.apply(s, o), a || (s = o = null);
    };
    return function() {
      var u = i.now();
      !h && n.leading === !1 && (h = u);
      var c = t - (u - h);
      return s = this, o = arguments, c <= 0 || c > t ? (clearTimeout(a), a = null, h = u, r = e.apply(s, o), a || (s = o = null)) : !a && n.trailing !== !1 && (a = setTimeout(l, c)), r;
    };
  },
  /**
   * Create a requestAnimationFrame simulation
   *
   * @param  {Number|String} refreshRate
   * @return {Function}
   */
  createRequestAnimationFrame: function(e) {
    var t = null;
    return e !== "auto" && e < 60 && e > 1 && (t = Math.floor(1e3 / e)), t === null ? window.requestAnimationFrame || Ne(33) : Ne(t);
  }
};
function Ne(e) {
  return function(t) {
    window.setTimeout(t, e);
  };
}
var Yt = _e, yn = "unknown";
document.documentMode && (yn = "ie");
var Se = {
  svgNS: "http://www.w3.org/2000/svg",
  xmlNS: "http://www.w3.org/XML/1998/namespace",
  xmlnsNS: "http://www.w3.org/2000/xmlns/",
  xlinkNS: "http://www.w3.org/1999/xlink",
  evNS: "http://www.w3.org/2001/xml-events",
  /**
   * Get svg dimensions: width and height
   *
   * @param  {SVGSVGElement} svg
   * @return {Object}     {width: 0, height: 0}
   */
  getBoundingClientRectNormalized: function(e) {
    if (e.clientWidth && e.clientHeight)
      return { width: e.clientWidth, height: e.clientHeight };
    if (e.getBoundingClientRect())
      return e.getBoundingClientRect();
    throw new Error("Cannot get BoundingClientRect for SVG.");
  },
  /**
   * Gets g element with class of "viewport" or creates it if it doesn't exist
   *
   * @param  {SVGSVGElement} svg
   * @return {SVGElement}     g (group) element
   */
  getOrCreateViewport: function(e, t) {
    var n = null;
    if (Yt.isElement(t) ? n = t : n = e.querySelector(t), !n) {
      var i = Array.prototype.slice.call(e.childNodes || e.children).filter(function(h) {
        return h.nodeName !== "defs" && h.nodeName !== "#text";
      });
      i.length === 1 && i[0].nodeName === "g" && i[0].getAttribute("transform") === null && (n = i[0]);
    }
    if (!n) {
      var s = "viewport-" + (/* @__PURE__ */ new Date()).toISOString().replace(/\D/g, "");
      n = document.createElementNS(this.svgNS, "g"), n.setAttribute("id", s);
      var o = e.childNodes || e.children;
      if (o && o.length > 0)
        for (var r = o.length; r > 0; r--)
          o[o.length - r].nodeName !== "defs" && n.appendChild(o[o.length - r]);
      e.appendChild(n);
    }
    var a = [];
    return n.getAttribute("class") && (a = n.getAttribute("class").split(" ")), ~a.indexOf("svg-pan-zoom_viewport") || (a.push("svg-pan-zoom_viewport"), n.setAttribute("class", a.join(" "))), n;
  },
  /**
   * Set SVG attributes
   *
   * @param  {SVGSVGElement} svg
   */
  setupSvgAttributes: function(e) {
    if (e.setAttribute("xmlns", this.svgNS), e.setAttributeNS(this.xmlnsNS, "xmlns:xlink", this.xlinkNS), e.setAttributeNS(this.xmlnsNS, "xmlns:ev", this.evNS), e.parentNode !== null) {
      var t = e.getAttribute("style") || "";
      t.toLowerCase().indexOf("overflow") === -1 && e.setAttribute("style", "overflow: hidden; " + t);
    }
  },
  /**
   * How long Internet Explorer takes to finish updating its display (ms).
   */
  internetExplorerRedisplayInterval: 300,
  /**
   * Forces the browser to redisplay all SVG elements that rely on an
   * element defined in a 'defs' section. It works globally, for every
   * available defs element on the page.
   * The throttling is intentionally global.
   *
   * This is only needed for IE. It is as a hack to make markers (and 'use' elements?)
   * visible after pan/zoom when there are multiple SVGs on the page.
   * See bug report: https://connect.microsoft.com/IE/feedback/details/781964/
   * also see svg-pan-zoom issue: https://github.com/bumbu/svg-pan-zoom/issues/62
   */
  refreshDefsGlobal: Yt.throttle(
    function() {
      for (var e = document.querySelectorAll("defs"), t = e.length, n = 0; n < t; n++) {
        var i = e[n];
        i.parentNode.insertBefore(i, i);
      }
    },
    Ie ? Ie.internetExplorerRedisplayInterval : null
  ),
  /**
   * Sets the current transform matrix of an element
   *
   * @param {SVGElement} element
   * @param {SVGMatrix} matrix  CTM
   * @param {SVGElement} defs
   */
  setCTM: function(e, t, n) {
    var i = this, s = "matrix(" + t.a + "," + t.b + "," + t.c + "," + t.d + "," + t.e + "," + t.f + ")";
    e.setAttributeNS(null, "transform", s), "transform" in e.style ? e.style.transform = s : "-ms-transform" in e.style ? e.style["-ms-transform"] = s : "-webkit-transform" in e.style && (e.style["-webkit-transform"] = s), yn === "ie" && n && (n.parentNode.insertBefore(n, n), window.setTimeout(function() {
      i.refreshDefsGlobal();
    }, i.internetExplorerRedisplayInterval));
  },
  /**
   * Instantiate an SVGPoint object with given event coordinates
   *
   * @param {Event} evt
   * @param  {SVGSVGElement} svg
   * @return {SVGPoint}     point
   */
  getEventPoint: function(e, t) {
    var n = t.createSVGPoint();
    return Yt.mouseAndTouchNormalize(e, t), n.x = e.clientX, n.y = e.clientY, n;
  },
  /**
   * Get SVG center point
   *
   * @param  {SVGSVGElement} svg
   * @return {SVGPoint}
   */
  getSvgCenterPoint: function(e, t, n) {
    return this.createSVGPoint(e, t / 2, n / 2);
  },
  /**
   * Create a SVGPoint with given x and y
   *
   * @param  {SVGSVGElement} svg
   * @param  {Number} x
   * @param  {Number} y
   * @return {SVGPoint}
   */
  createSVGPoint: function(e, t, n) {
    var i = e.createSVGPoint();
    return i.x = t, i.y = n, i;
  }
}, O = Se, Hs = {
  enable: function(e) {
    var t = e.svg.querySelector("defs");
    t || (t = document.createElementNS(O.svgNS, "defs"), e.svg.appendChild(t));
    var n = t.querySelector("style#svg-pan-zoom-controls-styles");
    if (!n) {
      var i = document.createElementNS(O.svgNS, "style");
      i.setAttribute("id", "svg-pan-zoom-controls-styles"), i.setAttribute("type", "text/css"), i.textContent = ".svg-pan-zoom-control { cursor: pointer; fill: black; fill-opacity: 0.333; } .svg-pan-zoom-control:hover { fill-opacity: 0.8; } .svg-pan-zoom-control-background { fill: white; fill-opacity: 0.5; } .svg-pan-zoom-control-background { fill-opacity: 0.8; }", t.appendChild(i);
    }
    var s = document.createElementNS(O.svgNS, "g");
    s.setAttribute("id", "svg-pan-zoom-controls"), s.setAttribute(
      "transform",
      "translate(" + (e.width - 70) + " " + (e.height - 76) + ") scale(0.75)"
    ), s.setAttribute("class", "svg-pan-zoom-control"), s.appendChild(this._createZoomIn(e)), s.appendChild(this._createZoomReset(e)), s.appendChild(this._createZoomOut(e)), e.svg.appendChild(s), e.controlIcons = s;
  },
  _createZoomIn: function(e) {
    var t = document.createElementNS(O.svgNS, "g");
    t.setAttribute("id", "svg-pan-zoom-zoom-in"), t.setAttribute("transform", "translate(30.5 5) scale(0.015)"), t.setAttribute("class", "svg-pan-zoom-control"), t.addEventListener(
      "click",
      function() {
        e.getPublicInstance().zoomIn();
      },
      !1
    ), t.addEventListener(
      "touchstart",
      function() {
        e.getPublicInstance().zoomIn();
      },
      !1
    );
    var n = document.createElementNS(O.svgNS, "rect");
    n.setAttribute("x", "0"), n.setAttribute("y", "0"), n.setAttribute("width", "1500"), n.setAttribute("height", "1400"), n.setAttribute("class", "svg-pan-zoom-control-background"), t.appendChild(n);
    var i = document.createElementNS(O.svgNS, "path");
    return i.setAttribute(
      "d",
      "M1280 576v128q0 26 -19 45t-45 19h-320v320q0 26 -19 45t-45 19h-128q-26 0 -45 -19t-19 -45v-320h-320q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h320v-320q0 -26 19 -45t45 -19h128q26 0 45 19t19 45v320h320q26 0 45 19t19 45zM1536 1120v-960 q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5t84.5 -203.5z"
    ), i.setAttribute("class", "svg-pan-zoom-control-element"), t.appendChild(i), t;
  },
  _createZoomReset: function(e) {
    var t = document.createElementNS(O.svgNS, "g");
    t.setAttribute("id", "svg-pan-zoom-reset-pan-zoom"), t.setAttribute("transform", "translate(5 35) scale(0.4)"), t.setAttribute("class", "svg-pan-zoom-control"), t.addEventListener(
      "click",
      function() {
        e.getPublicInstance().reset();
      },
      !1
    ), t.addEventListener(
      "touchstart",
      function() {
        e.getPublicInstance().reset();
      },
      !1
    );
    var n = document.createElementNS(
      O.svgNS,
      "rect"
    );
    n.setAttribute("x", "2"), n.setAttribute("y", "2"), n.setAttribute("width", "182"), n.setAttribute("height", "58"), n.setAttribute(
      "class",
      "svg-pan-zoom-control-background"
    ), t.appendChild(n);
    var i = document.createElementNS(
      O.svgNS,
      "path"
    );
    i.setAttribute(
      "d",
      "M33.051,20.632c-0.742-0.406-1.854-0.609-3.338-0.609h-7.969v9.281h7.769c1.543,0,2.701-0.188,3.473-0.562c1.365-0.656,2.048-1.953,2.048-3.891C35.032,22.757,34.372,21.351,33.051,20.632z"
    ), i.setAttribute(
      "class",
      "svg-pan-zoom-control-element"
    ), t.appendChild(i);
    var s = document.createElementNS(
      O.svgNS,
      "path"
    );
    return s.setAttribute(
      "d",
      "M170.231,0.5H15.847C7.102,0.5,0.5,5.708,0.5,11.84v38.861C0.5,56.833,7.102,61.5,15.847,61.5h154.384c8.745,0,15.269-4.667,15.269-10.798V11.84C185.5,5.708,178.976,0.5,170.231,0.5z M42.837,48.569h-7.969c-0.219-0.766-0.375-1.383-0.469-1.852c-0.188-0.969-0.289-1.961-0.305-2.977l-0.047-3.211c-0.03-2.203-0.41-3.672-1.142-4.406c-0.732-0.734-2.103-1.102-4.113-1.102h-7.05v13.547h-7.055V14.022h16.524c2.361,0.047,4.178,0.344,5.45,0.891c1.272,0.547,2.351,1.352,3.234,2.414c0.731,0.875,1.31,1.844,1.737,2.906s0.64,2.273,0.64,3.633c0,1.641-0.414,3.254-1.242,4.84s-2.195,2.707-4.102,3.363c1.594,0.641,2.723,1.551,3.387,2.73s0.996,2.98,0.996,5.402v2.32c0,1.578,0.063,2.648,0.19,3.211c0.19,0.891,0.635,1.547,1.333,1.969V48.569z M75.579,48.569h-26.18V14.022h25.336v6.117H56.454v7.336h16.781v6H56.454v8.883h19.125V48.569z M104.497,46.331c-2.44,2.086-5.887,3.129-10.34,3.129c-4.548,0-8.125-1.027-10.731-3.082s-3.909-4.879-3.909-8.473h6.891c0.224,1.578,0.662,2.758,1.316,3.539c1.196,1.422,3.246,2.133,6.15,2.133c1.739,0,3.151-0.188,4.236-0.562c2.058-0.719,3.087-2.055,3.087-4.008c0-1.141-0.504-2.023-1.512-2.648c-1.008-0.609-2.607-1.148-4.796-1.617l-3.74-0.82c-3.676-0.812-6.201-1.695-7.576-2.648c-2.328-1.594-3.492-4.086-3.492-7.477c0-3.094,1.139-5.664,3.417-7.711s5.623-3.07,10.036-3.07c3.685,0,6.829,0.965,9.431,2.895c2.602,1.93,3.966,4.73,4.093,8.402h-6.938c-0.128-2.078-1.057-3.555-2.787-4.43c-1.154-0.578-2.587-0.867-4.301-0.867c-1.907,0-3.428,0.375-4.565,1.125c-1.138,0.75-1.706,1.797-1.706,3.141c0,1.234,0.561,2.156,1.682,2.766c0.721,0.406,2.25,0.883,4.589,1.43l6.063,1.43c2.657,0.625,4.648,1.461,5.975,2.508c2.059,1.625,3.089,3.977,3.089,7.055C108.157,41.624,106.937,44.245,104.497,46.331z M139.61,48.569h-26.18V14.022h25.336v6.117h-18.281v7.336h16.781v6h-16.781v8.883h19.125V48.569z M170.337,20.14h-10.336v28.43h-7.266V20.14h-10.383v-6.117h27.984V20.14z"
    ), s.setAttribute(
      "class",
      "svg-pan-zoom-control-element"
    ), t.appendChild(s), t;
  },
  _createZoomOut: function(e) {
    var t = document.createElementNS(O.svgNS, "g");
    t.setAttribute("id", "svg-pan-zoom-zoom-out"), t.setAttribute("transform", "translate(30.5 70) scale(0.015)"), t.setAttribute("class", "svg-pan-zoom-control"), t.addEventListener(
      "click",
      function() {
        e.getPublicInstance().zoomOut();
      },
      !1
    ), t.addEventListener(
      "touchstart",
      function() {
        e.getPublicInstance().zoomOut();
      },
      !1
    );
    var n = document.createElementNS(O.svgNS, "rect");
    n.setAttribute("x", "0"), n.setAttribute("y", "0"), n.setAttribute("width", "1500"), n.setAttribute("height", "1400"), n.setAttribute("class", "svg-pan-zoom-control-background"), t.appendChild(n);
    var i = document.createElementNS(O.svgNS, "path");
    return i.setAttribute(
      "d",
      "M1280 576v128q0 26 -19 45t-45 19h-896q-26 0 -45 -19t-19 -45v-128q0 -26 19 -45t45 -19h896q26 0 45 19t19 45zM1536 1120v-960q0 -119 -84.5 -203.5t-203.5 -84.5h-960q-119 0 -203.5 84.5t-84.5 203.5v960q0 119 84.5 203.5t203.5 84.5h960q119 0 203.5 -84.5 t84.5 -203.5z"
    ), i.setAttribute("class", "svg-pan-zoom-control-element"), t.appendChild(i), t;
  },
  disable: function(e) {
    e.controlIcons && (e.controlIcons.parentNode.removeChild(e.controlIcons), e.controlIcons = null);
  }
}, Fs = Se, J = _e, I = function(e, t) {
  this.init(e, t);
};
I.prototype.init = function(e, t) {
  this.viewport = e, this.options = t, this.originalState = { zoom: 1, x: 0, y: 0 }, this.activeState = { zoom: 1, x: 0, y: 0 }, this.updateCTMCached = J.proxy(this.updateCTM, this), this.requestAnimationFrame = J.createRequestAnimationFrame(
    this.options.refreshRate
  ), this.viewBox = { x: 0, y: 0, width: 0, height: 0 }, this.cacheViewBox();
  var n = this.processCTM();
  this.setCTM(n), this.updateCTM();
};
I.prototype.cacheViewBox = function() {
  var e = this.options.svg.getAttribute("viewBox");
  if (e) {
    var t = e.split(/[\s\,]/).filter(function(i) {
      return i;
    }).map(parseFloat);
    this.viewBox.x = t[0], this.viewBox.y = t[1], this.viewBox.width = t[2], this.viewBox.height = t[3];
    var n = Math.min(
      this.options.width / this.viewBox.width,
      this.options.height / this.viewBox.height
    );
    this.activeState.zoom = n, this.activeState.x = (this.options.width - this.viewBox.width * n) / 2, this.activeState.y = (this.options.height - this.viewBox.height * n) / 2, this.updateCTMOnNextFrame(), this.options.svg.removeAttribute("viewBox");
  } else
    this.simpleViewBoxCache();
};
I.prototype.simpleViewBoxCache = function() {
  var e = this.viewport.getBBox();
  this.viewBox.x = e.x, this.viewBox.y = e.y, this.viewBox.width = e.width, this.viewBox.height = e.height;
};
I.prototype.getViewBox = function() {
  return J.extend({}, this.viewBox);
};
I.prototype.processCTM = function() {
  var e = this.getCTM();
  if (this.options.fit || this.options.contain) {
    var t;
    this.options.fit ? t = Math.min(
      this.options.width / this.viewBox.width,
      this.options.height / this.viewBox.height
    ) : t = Math.max(
      this.options.width / this.viewBox.width,
      this.options.height / this.viewBox.height
    ), e.a = t, e.d = t, e.e = -this.viewBox.x * t, e.f = -this.viewBox.y * t;
  }
  if (this.options.center) {
    var n = (this.options.width - (this.viewBox.width + this.viewBox.x * 2) * e.a) * 0.5, i = (this.options.height - (this.viewBox.height + this.viewBox.y * 2) * e.a) * 0.5;
    e.e = n, e.f = i;
  }
  return this.originalState.zoom = e.a, this.originalState.x = e.e, this.originalState.y = e.f, e;
};
I.prototype.getOriginalState = function() {
  return J.extend({}, this.originalState);
};
I.prototype.getState = function() {
  return J.extend({}, this.activeState);
};
I.prototype.getZoom = function() {
  return this.activeState.zoom;
};
I.prototype.getRelativeZoom = function() {
  return this.activeState.zoom / this.originalState.zoom;
};
I.prototype.computeRelativeZoom = function(e) {
  return e / this.originalState.zoom;
};
I.prototype.getPan = function() {
  return { x: this.activeState.x, y: this.activeState.y };
};
I.prototype.getCTM = function() {
  var e = this.options.svg.createSVGMatrix();
  return e.a = this.activeState.zoom, e.b = 0, e.c = 0, e.d = this.activeState.zoom, e.e = this.activeState.x, e.f = this.activeState.y, e;
};
I.prototype.setCTM = function(e) {
  var t = this.isZoomDifferent(e), n = this.isPanDifferent(e);
  if (t || n) {
    if (t && (this.options.beforeZoom(
      this.getRelativeZoom(),
      this.computeRelativeZoom(e.a)
    ) === !1 ? (e.a = e.d = this.activeState.zoom, t = !1) : (this.updateCache(e), this.options.onZoom(this.getRelativeZoom()))), n) {
      var i = this.options.beforePan(this.getPan(), {
        x: e.e,
        y: e.f
      }), s = !1, o = !1;
      i === !1 ? (e.e = this.getPan().x, e.f = this.getPan().y, s = o = !0) : J.isObject(i) && (i.x === !1 ? (e.e = this.getPan().x, s = !0) : J.isNumber(i.x) && (e.e = i.x), i.y === !1 ? (e.f = this.getPan().y, o = !0) : J.isNumber(i.y) && (e.f = i.y)), s && o || !this.isPanDifferent(e) ? n = !1 : (this.updateCache(e), this.options.onPan(this.getPan()));
    }
    (t || n) && this.updateCTMOnNextFrame();
  }
};
I.prototype.isZoomDifferent = function(e) {
  return this.activeState.zoom !== e.a;
};
I.prototype.isPanDifferent = function(e) {
  return this.activeState.x !== e.e || this.activeState.y !== e.f;
};
I.prototype.updateCache = function(e) {
  this.activeState.zoom = e.a, this.activeState.x = e.e, this.activeState.y = e.f;
};
I.prototype.pendingUpdate = !1;
I.prototype.updateCTMOnNextFrame = function() {
  this.pendingUpdate || (this.pendingUpdate = !0, this.requestAnimationFrame.call(window, this.updateCTMCached));
};
I.prototype.updateCTM = function() {
  var e = this.getCTM();
  Fs.setCTM(this.viewport, e, this.defs), this.pendingUpdate = !1, this.options.onUpdatedCTM && this.options.onUpdatedCTM(e);
};
var qs = function(e, t) {
  return new I(e, t);
}, bn = js, oe = Hs, q = _e, Y = Se, Gs = qs, M = function(e, t) {
  this.init(e, t);
}, Ys = {
  viewportSelector: ".svg-pan-zoom_viewport",
  // Viewport selector. Can be querySelector string or SVGElement
  panEnabled: !0,
  // enable or disable panning (default enabled)
  controlIconsEnabled: !1,
  // insert icons to give user an option in addition to mouse events to control pan/zoom (default disabled)
  zoomEnabled: !0,
  // enable or disable zooming (default enabled)
  dblClickZoomEnabled: !0,
  // enable or disable zooming by double clicking (default enabled)
  mouseWheelZoomEnabled: !0,
  // enable or disable zooming by mouse wheel (default enabled)
  preventMouseEventsDefault: !0,
  // enable or disable preventDefault for mouse events
  zoomScaleSensitivity: 0.1,
  // Zoom sensitivity
  minZoom: 0.5,
  // Minimum Zoom level
  maxZoom: 10,
  // Maximum Zoom level
  fit: !0,
  // enable or disable viewport fit in SVG (default true)
  contain: !1,
  // enable or disable viewport contain the svg (default false)
  center: !0,
  // enable or disable viewport centering in SVG (default true)
  refreshRate: "auto",
  // Maximum number of frames per second (altering SVG's viewport)
  beforeZoom: null,
  onZoom: null,
  beforePan: null,
  onPan: null,
  customEventsHandler: null,
  eventsListenerElement: null,
  onUpdatedCTM: null
}, wn = { passive: !0 };
M.prototype.init = function(e, t) {
  var n = this;
  this.svg = e, this.defs = e.querySelector("defs"), Y.setupSvgAttributes(this.svg), this.options = q.extend(q.extend({}, Ys), t), this.state = "none";
  var i = Y.getBoundingClientRectNormalized(
    e
  );
  this.width = i.width, this.height = i.height, this.viewport = Gs(
    Y.getOrCreateViewport(this.svg, this.options.viewportSelector),
    {
      svg: this.svg,
      width: this.width,
      height: this.height,
      fit: this.options.fit,
      contain: this.options.contain,
      center: this.options.center,
      refreshRate: this.options.refreshRate,
      // Put callbacks into functions as they can change through time
      beforeZoom: function(o, r) {
        if (n.viewport && n.options.beforeZoom)
          return n.options.beforeZoom(o, r);
      },
      onZoom: function(o) {
        if (n.viewport && n.options.onZoom)
          return n.options.onZoom(o);
      },
      beforePan: function(o, r) {
        if (n.viewport && n.options.beforePan)
          return n.options.beforePan(o, r);
      },
      onPan: function(o) {
        if (n.viewport && n.options.onPan)
          return n.options.onPan(o);
      },
      onUpdatedCTM: function(o) {
        if (n.viewport && n.options.onUpdatedCTM)
          return n.options.onUpdatedCTM(o);
      }
    }
  );
  var s = this.getPublicInstance();
  s.setBeforeZoom(this.options.beforeZoom), s.setOnZoom(this.options.onZoom), s.setBeforePan(this.options.beforePan), s.setOnPan(this.options.onPan), s.setOnUpdatedCTM(this.options.onUpdatedCTM), this.options.controlIconsEnabled && oe.enable(this), this.lastMouseWheelEventTime = Date.now(), this.setupHandlers();
};
M.prototype.setupHandlers = function() {
  var e = this, t = null;
  if (this.eventListeners = {
    // Mouse down group
    mousedown: function(o) {
      var r = e.handleMouseDown(o, t);
      return t = o, r;
    },
    touchstart: function(o) {
      var r = e.handleMouseDown(o, t);
      return t = o, r;
    },
    // Mouse up group
    mouseup: function(o) {
      return e.handleMouseUp(o);
    },
    touchend: function(o) {
      return e.handleMouseUp(o);
    },
    // Mouse move group
    mousemove: function(o) {
      return e.handleMouseMove(o);
    },
    touchmove: function(o) {
      return e.handleMouseMove(o);
    },
    // Mouse leave group
    mouseleave: function(o) {
      return e.handleMouseUp(o);
    },
    touchleave: function(o) {
      return e.handleMouseUp(o);
    },
    touchcancel: function(o) {
      return e.handleMouseUp(o);
    }
  }, this.options.customEventsHandler != null) {
    this.options.customEventsHandler.init({
      svgElement: this.svg,
      eventsListenerElement: this.options.eventsListenerElement,
      instance: this.getPublicInstance()
    });
    var n = this.options.customEventsHandler.haltEventListeners;
    if (n && n.length)
      for (var i = n.length - 1; i >= 0; i--)
        this.eventListeners.hasOwnProperty(n[i]) && delete this.eventListeners[n[i]];
  }
  for (var s in this.eventListeners)
    (this.options.eventsListenerElement || this.svg).addEventListener(
      s,
      this.eventListeners[s],
      this.options.preventMouseEventsDefault ? !1 : wn
    );
  this.options.mouseWheelZoomEnabled && (this.options.mouseWheelZoomEnabled = !1, this.enableMouseWheelZoom());
};
M.prototype.enableMouseWheelZoom = function() {
  if (!this.options.mouseWheelZoomEnabled) {
    var e = this;
    this.wheelListener = function(n) {
      return e.handleMouseWheel(n);
    };
    var t = !this.options.preventMouseEventsDefault;
    bn.on(
      this.options.eventsListenerElement || this.svg,
      this.wheelListener,
      t
    ), this.options.mouseWheelZoomEnabled = !0;
  }
};
M.prototype.disableMouseWheelZoom = function() {
  if (this.options.mouseWheelZoomEnabled) {
    var e = !this.options.preventMouseEventsDefault;
    bn.off(
      this.options.eventsListenerElement || this.svg,
      this.wheelListener,
      e
    ), this.options.mouseWheelZoomEnabled = !1;
  }
};
M.prototype.handleMouseWheel = function(e) {
  if (!(!this.options.zoomEnabled || this.state !== "none")) {
    this.options.preventMouseEventsDefault && (e.preventDefault ? e.preventDefault() : e.returnValue = !1);
    var t = e.deltaY || 1, n = Date.now() - this.lastMouseWheelEventTime, i = 3 + Math.max(0, 30 - n);
    this.lastMouseWheelEventTime = Date.now(), "deltaMode" in e && e.deltaMode === 0 && e.wheelDelta && (t = e.deltaY === 0 ? 0 : Math.abs(e.wheelDelta) / e.deltaY), t = -0.3 < t && t < 0.3 ? t : (t > 0 ? 1 : -1) * Math.log(Math.abs(t) + 10) / i;
    var s = this.svg.getScreenCTM().inverse(), o = Y.getEventPoint(e, this.svg).matrixTransform(
      s
    ), r = Math.pow(1 + this.options.zoomScaleSensitivity, -1 * t);
    this.zoomAtPoint(r, o);
  }
};
M.prototype.zoomAtPoint = function(e, t, n) {
  var i = this.viewport.getOriginalState();
  n ? (e = Math.max(
    this.options.minZoom * i.zoom,
    Math.min(this.options.maxZoom * i.zoom, e)
  ), e = e / this.getZoom()) : this.getZoom() * e < this.options.minZoom * i.zoom ? e = this.options.minZoom * i.zoom / this.getZoom() : this.getZoom() * e > this.options.maxZoom * i.zoom && (e = this.options.maxZoom * i.zoom / this.getZoom());
  var s = this.viewport.getCTM(), o = t.matrixTransform(s.inverse()), r = this.svg.createSVGMatrix().translate(o.x, o.y).scale(e).translate(-o.x, -o.y), a = s.multiply(r);
  a.a !== s.a && this.viewport.setCTM(a);
};
M.prototype.zoom = function(e, t) {
  this.zoomAtPoint(
    e,
    Y.getSvgCenterPoint(this.svg, this.width, this.height),
    t
  );
};
M.prototype.publicZoom = function(e, t) {
  t && (e = this.computeFromRelativeZoom(e)), this.zoom(e, t);
};
M.prototype.publicZoomAtPoint = function(e, t, n) {
  if (n && (e = this.computeFromRelativeZoom(e)), q.getType(t) !== "SVGPoint")
    if ("x" in t && "y" in t)
      t = Y.createSVGPoint(this.svg, t.x, t.y);
    else
      throw new Error("Given point is invalid");
  this.zoomAtPoint(e, t, n);
};
M.prototype.getZoom = function() {
  return this.viewport.getZoom();
};
M.prototype.getRelativeZoom = function() {
  return this.viewport.getRelativeZoom();
};
M.prototype.computeFromRelativeZoom = function(e) {
  return e * this.viewport.getOriginalState().zoom;
};
M.prototype.resetZoom = function() {
  var e = this.viewport.getOriginalState();
  this.zoom(e.zoom, !0);
};
M.prototype.resetPan = function() {
  this.pan(this.viewport.getOriginalState());
};
M.prototype.reset = function() {
  this.resetZoom(), this.resetPan();
};
M.prototype.handleDblClick = function(e) {
  if (this.options.preventMouseEventsDefault && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), this.options.controlIconsEnabled) {
    var t = e.target.getAttribute("class") || "";
    if (t.indexOf("svg-pan-zoom-control") > -1)
      return !1;
  }
  var n;
  e.shiftKey ? n = 1 / ((1 + this.options.zoomScaleSensitivity) * 2) : n = (1 + this.options.zoomScaleSensitivity) * 2;
  var i = Y.getEventPoint(e, this.svg).matrixTransform(
    this.svg.getScreenCTM().inverse()
  );
  this.zoomAtPoint(n, i);
};
M.prototype.handleMouseDown = function(e, t) {
  this.options.preventMouseEventsDefault && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), q.mouseAndTouchNormalize(e, this.svg), this.options.dblClickZoomEnabled && q.isDblClick(e, t) ? this.handleDblClick(e) : (this.state = "pan", this.firstEventCTM = this.viewport.getCTM(), this.stateOrigin = Y.getEventPoint(e, this.svg).matrixTransform(
    this.firstEventCTM.inverse()
  ));
};
M.prototype.handleMouseMove = function(e) {
  if (this.options.preventMouseEventsDefault && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), this.state === "pan" && this.options.panEnabled) {
    var t = Y.getEventPoint(e, this.svg).matrixTransform(
      this.firstEventCTM.inverse()
    ), n = this.firstEventCTM.translate(
      t.x - this.stateOrigin.x,
      t.y - this.stateOrigin.y
    );
    this.viewport.setCTM(n);
  }
};
M.prototype.handleMouseUp = function(e) {
  this.options.preventMouseEventsDefault && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), this.state === "pan" && (this.state = "none");
};
M.prototype.fit = function() {
  var e = this.viewport.getViewBox(), t = Math.min(
    this.width / e.width,
    this.height / e.height
  );
  this.zoom(t, !0);
};
M.prototype.contain = function() {
  var e = this.viewport.getViewBox(), t = Math.max(
    this.width / e.width,
    this.height / e.height
  );
  this.zoom(t, !0);
};
M.prototype.center = function() {
  var e = this.viewport.getViewBox(), t = (this.width - (e.width + e.x * 2) * this.getZoom()) * 0.5, n = (this.height - (e.height + e.y * 2) * this.getZoom()) * 0.5;
  this.getPublicInstance().pan({ x: t, y: n });
};
M.prototype.updateBBox = function() {
  this.viewport.simpleViewBoxCache();
};
M.prototype.pan = function(e) {
  var t = this.viewport.getCTM();
  t.e = e.x, t.f = e.y, this.viewport.setCTM(t);
};
M.prototype.panBy = function(e) {
  var t = this.viewport.getCTM();
  t.e += e.x, t.f += e.y, this.viewport.setCTM(t);
};
M.prototype.getPan = function() {
  var e = this.viewport.getState();
  return { x: e.x, y: e.y };
};
M.prototype.resize = function() {
  var e = Y.getBoundingClientRectNormalized(
    this.svg
  );
  this.width = e.width, this.height = e.height;
  var t = this.viewport;
  t.options.width = this.width, t.options.height = this.height, t.processCTM(), this.options.controlIconsEnabled && (this.getPublicInstance().disableControlIcons(), this.getPublicInstance().enableControlIcons());
};
M.prototype.destroy = function() {
  var e = this;
  this.beforeZoom = null, this.onZoom = null, this.beforePan = null, this.onPan = null, this.onUpdatedCTM = null, this.options.customEventsHandler != null && this.options.customEventsHandler.destroy({
    svgElement: this.svg,
    eventsListenerElement: this.options.eventsListenerElement,
    instance: this.getPublicInstance()
  });
  for (var t in this.eventListeners)
    (this.options.eventsListenerElement || this.svg).removeEventListener(
      t,
      this.eventListeners[t],
      this.options.preventMouseEventsDefault ? !1 : wn
    );
  this.disableMouseWheelZoom(), this.getPublicInstance().disableControlIcons(), this.reset(), $ = $.filter(function(n) {
    return n.svg !== e.svg;
  }), delete this.options, delete this.viewport, delete this.publicInstance, delete this.pi, this.getPublicInstance = function() {
    return null;
  };
};
M.prototype.getPublicInstance = function() {
  var e = this;
  return this.publicInstance || (this.publicInstance = this.pi = {
    // Pan
    enablePan: function() {
      return e.options.panEnabled = !0, e.pi;
    },
    disablePan: function() {
      return e.options.panEnabled = !1, e.pi;
    },
    isPanEnabled: function() {
      return !!e.options.panEnabled;
    },
    pan: function(t) {
      return e.pan(t), e.pi;
    },
    panBy: function(t) {
      return e.panBy(t), e.pi;
    },
    getPan: function() {
      return e.getPan();
    },
    // Pan event
    setBeforePan: function(t) {
      return e.options.beforePan = t === null ? null : q.proxy(t, e.publicInstance), e.pi;
    },
    setOnPan: function(t) {
      return e.options.onPan = t === null ? null : q.proxy(t, e.publicInstance), e.pi;
    },
    // Zoom and Control Icons
    enableZoom: function() {
      return e.options.zoomEnabled = !0, e.pi;
    },
    disableZoom: function() {
      return e.options.zoomEnabled = !1, e.pi;
    },
    isZoomEnabled: function() {
      return !!e.options.zoomEnabled;
    },
    enableControlIcons: function() {
      return e.options.controlIconsEnabled || (e.options.controlIconsEnabled = !0, oe.enable(e)), e.pi;
    },
    disableControlIcons: function() {
      return e.options.controlIconsEnabled && (e.options.controlIconsEnabled = !1, oe.disable(e)), e.pi;
    },
    isControlIconsEnabled: function() {
      return !!e.options.controlIconsEnabled;
    },
    // Double click zoom
    enableDblClickZoom: function() {
      return e.options.dblClickZoomEnabled = !0, e.pi;
    },
    disableDblClickZoom: function() {
      return e.options.dblClickZoomEnabled = !1, e.pi;
    },
    isDblClickZoomEnabled: function() {
      return !!e.options.dblClickZoomEnabled;
    },
    // Mouse wheel zoom
    enableMouseWheelZoom: function() {
      return e.enableMouseWheelZoom(), e.pi;
    },
    disableMouseWheelZoom: function() {
      return e.disableMouseWheelZoom(), e.pi;
    },
    isMouseWheelZoomEnabled: function() {
      return !!e.options.mouseWheelZoomEnabled;
    },
    // Zoom scale and bounds
    setZoomScaleSensitivity: function(t) {
      return e.options.zoomScaleSensitivity = t, e.pi;
    },
    setMinZoom: function(t) {
      return e.options.minZoom = t, e.pi;
    },
    setMaxZoom: function(t) {
      return e.options.maxZoom = t, e.pi;
    },
    // Zoom event
    setBeforeZoom: function(t) {
      return e.options.beforeZoom = t === null ? null : q.proxy(t, e.publicInstance), e.pi;
    },
    setOnZoom: function(t) {
      return e.options.onZoom = t === null ? null : q.proxy(t, e.publicInstance), e.pi;
    },
    // Zooming
    zoom: function(t) {
      return e.publicZoom(t, !0), e.pi;
    },
    zoomBy: function(t) {
      return e.publicZoom(t, !1), e.pi;
    },
    zoomAtPoint: function(t, n) {
      return e.publicZoomAtPoint(t, n, !0), e.pi;
    },
    zoomAtPointBy: function(t, n) {
      return e.publicZoomAtPoint(t, n, !1), e.pi;
    },
    zoomIn: function() {
      return this.zoomBy(1 + e.options.zoomScaleSensitivity), e.pi;
    },
    zoomOut: function() {
      return this.zoomBy(1 / (1 + e.options.zoomScaleSensitivity)), e.pi;
    },
    getZoom: function() {
      return e.getRelativeZoom();
    },
    // CTM update
    setOnUpdatedCTM: function(t) {
      return e.options.onUpdatedCTM = t === null ? null : q.proxy(t, e.publicInstance), e.pi;
    },
    // Reset
    resetZoom: function() {
      return e.resetZoom(), e.pi;
    },
    resetPan: function() {
      return e.resetPan(), e.pi;
    },
    reset: function() {
      return e.reset(), e.pi;
    },
    // Fit, Contain and Center
    fit: function() {
      return e.fit(), e.pi;
    },
    contain: function() {
      return e.contain(), e.pi;
    },
    center: function() {
      return e.center(), e.pi;
    },
    // Size and Resize
    updateBBox: function() {
      return e.updateBBox(), e.pi;
    },
    resize: function() {
      return e.resize(), e.pi;
    },
    getSizes: function() {
      return {
        width: e.width,
        height: e.height,
        realZoom: e.getZoom(),
        viewBox: e.viewport.getViewBox()
      };
    },
    // Destroy
    destroy: function() {
      return e.destroy(), e.pi;
    }
  }), this.publicInstance;
};
var $ = [], Vs = function(e, t) {
  var n = q.getSvg(e);
  if (n === null)
    return null;
  for (var i = $.length - 1; i >= 0; i--)
    if ($[i].svg === n)
      return $[i].instance.getPublicInstance();
  return $.push({
    svg: n,
    instance: new M(n, t)
  }), $[$.length - 1].instance.getPublicInstance();
}, Xs = Vs;
const Us = /* @__PURE__ */ Ls(Xs);
class vn {
  constructor(t, n = {}) {
    this.slate = t, this.options = {
      enabled: !0,
      panEnabled: !0,
      zoomEnabled: !0,
      controlIconsEnabled: !0,
      dblClickZoomEnabled: !0,
      mouseWheelZoomEnabled: !0,
      zoomScaleSensitivity: 0.2,
      minZoom: 0.1,
      maxZoom: 10,
      fit: !1,
      center: !1,
      ...n
    }, this.options.enabled && this.init();
  }
  init() {
    setTimeout(() => {
      try {
        this.panZoomInstance = Us(this.slate.canvas.node, {
          panEnabled: this.options.panEnabled,
          zoomEnabled: this.options.zoomEnabled,
          controlIconsEnabled: this.options.controlIconsEnabled,
          dblClickZoomEnabled: this.options.dblClickZoomEnabled,
          mouseWheelZoomEnabled: this.options.mouseWheelZoomEnabled,
          zoomScaleSensitivity: this.options.zoomScaleSensitivity,
          minZoom: this.options.minZoom,
          maxZoom: this.options.maxZoom,
          fit: this.options.fit,
          center: this.options.center,
          onPan: (t) => {
            this.options.onPan && this.options.onPan(t);
          },
          onZoom: (t) => {
            this.options.onZoom && this.options.onZoom(t);
          }
        });
      } catch (t) {
        console.warn("Failed to initialize pan/zoom:", t);
      }
    }, 100);
  }
  enable() {
    this.panZoomInstance && (this.panZoomInstance.enablePan(), this.panZoomInstance.enableZoom()), this.options.enabled = !0;
  }
  disable() {
    this.panZoomInstance && (this.panZoomInstance.disablePan(), this.panZoomInstance.disableZoom()), this.options.enabled = !1;
  }
  enablePan() {
    this.panZoomInstance && this.panZoomInstance.enablePan(), this.options.panEnabled = !0;
  }
  disablePan() {
    this.panZoomInstance && this.panZoomInstance.disablePan(), this.options.panEnabled = !1;
  }
  enableZoom() {
    this.panZoomInstance && this.panZoomInstance.enableZoom(), this.options.zoomEnabled = !0;
  }
  disableZoom() {
    this.panZoomInstance && this.panZoomInstance.disableZoom(), this.options.zoomEnabled = !1;
  }
  pan(t) {
    this.panZoomInstance && this.panZoomInstance.pan(t);
  }
  panBy(t) {
    this.panZoomInstance && this.panZoomInstance.panBy(t);
  }
  zoom(t) {
    this.panZoomInstance && this.panZoomInstance.zoom(t);
  }
  zoomBy(t) {
    this.panZoomInstance && this.panZoomInstance.zoomBy(t);
  }
  zoomIn() {
    this.panZoomInstance && this.panZoomInstance.zoomIn();
  }
  zoomOut() {
    this.panZoomInstance && this.panZoomInstance.zoomOut();
  }
  zoomAtPoint(t, n) {
    this.panZoomInstance && this.panZoomInstance.zoomAtPoint(t, n);
  }
  reset() {
    this.panZoomInstance && this.panZoomInstance.reset();
  }
  resetZoom() {
    this.panZoomInstance && this.panZoomInstance.resetZoom();
  }
  resetPan() {
    this.panZoomInstance && this.panZoomInstance.resetPan();
  }
  fit() {
    this.panZoomInstance && this.panZoomInstance.fit();
  }
  center() {
    this.panZoomInstance && this.panZoomInstance.center();
  }
  getZoom() {
    return this.panZoomInstance ? this.panZoomInstance.getZoom() : 1;
  }
  getPan() {
    return this.panZoomInstance ? this.panZoomInstance.getPan() : { x: 0, y: 0 };
  }
  resize() {
    this.panZoomInstance && this.panZoomInstance.resize();
  }
  destroy() {
    this.panZoomInstance && (this.panZoomInstance.destroy(), this.panZoomInstance = null);
  }
}
class xn {
  constructor(t, n = {}) {
    if (typeof t == "string") {
      const i = document.querySelector(t);
      if (!i)
        throw new Error(`Element with selector "${t}" not found`);
      this.element = i;
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
      panZoom: {
        enabled: !0,
        panEnabled: !0,
        zoomEnabled: !0,
        controlIconsEnabled: !0,
        dblClickZoomEnabled: !0,
        mouseWheelZoomEnabled: !0,
        zoomScaleSensitivity: 0.2,
        minZoom: 0.1,
        maxZoom: 10,
        fit: !1,
        center: !1
      },
      ...n
    }, this.init();
  }
  init() {
    this.canvas = Ns().addTo(this.element);
    const t = this.options.viewPort?.originalWidth || 800, n = this.options.viewPort?.originalHeight || 600;
    this.canvas.size(t, n), this.canvas.rect(t, n).fill(this.options.containerStyle?.backgroundColor || "#ffffff").move(0, 0).back(), this.nodes = new Ds(this), this.invoker = new Bs(this), this.panZoom = new vn(this, this.options.panZoom), this.makeResponsive();
  }
  makeResponsive() {
    const t = this.options.viewPort?.originalWidth || 800, n = this.options.viewPort?.originalHeight || 600;
    this.canvas.viewbox(0, 0, t, n);
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
  // Pan/Zoom API methods
  enablePanZoom() {
    this.panZoom.enable();
  }
  disablePanZoom() {
    this.panZoom.disable();
  }
  enablePan() {
    this.panZoom.enablePan();
  }
  disablePan() {
    this.panZoom.disablePan();
  }
  enableZoom() {
    this.panZoom.enableZoom();
  }
  disableZoom() {
    this.panZoom.disableZoom();
  }
  pan(t) {
    this.panZoom.pan(t);
  }
  panBy(t) {
    this.panZoom.panBy(t);
  }
  zoom(t) {
    this.panZoom.zoom(t);
  }
  zoomBy(t) {
    this.panZoom.zoomBy(t);
  }
  zoomIn() {
    this.panZoom.zoomIn();
  }
  zoomOut() {
    this.panZoom.zoomOut();
  }
  zoomAtPoint(t, n) {
    this.panZoom.zoomAtPoint(t, n);
  }
  resetPanZoom() {
    this.panZoom.reset();
  }
  resetZoom() {
    this.panZoom.resetZoom();
  }
  resetPan() {
    this.panZoom.resetPan();
  }
  fitToContent() {
    this.panZoom.fit();
  }
  centerContent() {
    this.panZoom.center();
  }
  getZoom() {
    return this.panZoom.getZoom();
  }
  getPan() {
    return this.panZoom.getPan();
  }
  resizePanZoom() {
    this.panZoom.resize();
  }
}
function Ws(e, t = {}) {
  return new xn(e, t);
}
typeof window < "u" && (window.SlateboxJS = Ws, window.Slate = xn, window.Node = gn, window.PanZoom = vn, window.ResizeRotate = mn);
export {
  Bs as Invoker,
  gn as Node,
  vn as PanZoom,
  mn as ResizeRotate,
  xn as Slate,
  Ws as SlateboxJS,
  Ws as default
};
//# sourceMappingURL=slateboxjs.es.js.map
