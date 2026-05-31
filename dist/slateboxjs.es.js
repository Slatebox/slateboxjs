const ze = {}, An = [];
function k(n, t) {
  if (Array.isArray(n)) {
    for (const e of n)
      k(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n)
      k(e, n[e]);
    return;
  }
  In(Object.getOwnPropertyNames(t)), ze[n] = Object.assign(ze[n] || {}, t);
}
function V(n) {
  return ze[n] || {};
}
function ls() {
  return [...new Set(An)];
}
function In(n) {
  An.push(...n);
}
function We(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    s.push(t(n[e]));
  return s;
}
function cs(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    t(n[e]) && s.push(n[e]);
  return s;
}
function Ce(n) {
  return n % 360 * Math.PI / 180;
}
function hs(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function Pn(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function Bt(n, t, e, i) {
  return (t == null || e == null) && (i = i || n.bbox(), t == null ? t = i.width / i.height * e : e == null && (e = i.height / i.width * t)), {
    width: t,
    height: e
  };
}
function Oe(n, t) {
  const e = n.origin;
  let i = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", s = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([i, s] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof i == "string", a = typeof s == "string";
  if (o || a) {
    const { height: r, width: l, x: c, y: h } = t.bbox();
    o && (i = i.includes("left") ? c : i.includes("right") ? c + l : c + l / 2), a && (s = s.includes("top") ? h : s.includes("bottom") ? h + r : h + r / 2);
  }
  return [i, s];
}
const ds = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), Ae = (n) => ds.has(n.nodeName), Bn = (n, t, e = {}) => {
  const i = { ...t };
  for (const s in i)
    i[s].valueOf() === e[s] && delete i[s];
  Object.keys(i).length ? n.node.setAttribute("data-svgjs", JSON.stringify(i)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, Ve = "http://www.w3.org/2000/svg", us = "http://www.w3.org/1999/xhtml", Se = "http://www.w3.org/2000/xmlns/", te = "http://www.w3.org/1999/xlink", M = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function $e() {
  return M.window;
}
class qe {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}
const St = {}, Ke = "___SYMBOL___ROOT___";
function Kt(n, t = Ve) {
  return M.document.createElementNS(t, n);
}
function W(n, t = !1) {
  if (n instanceof qe) return n;
  if (typeof n == "object")
    return Te(n);
  if (n == null)
    return new St[Ke]();
  if (typeof n == "string" && n.trim().charAt(0) !== "<")
    return Te(M.document.querySelector(n));
  const e = t ? M.document.createElement("div") : Kt("svg");
  return e.innerHTML = n.trim(), n = Te(e.firstElementChild), e.removeChild(e.firstElementChild), n;
}
function I(n, t) {
  return t && (t instanceof M.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : Kt(n);
}
function ot(n) {
  if (!n) return null;
  if (n.instance instanceof qe) return n.instance;
  if (n.nodeName === "#document-fragment")
    return new St.Fragment(n);
  let t = Pn(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : St[t] || (t = "Dom"), new St[t](n);
}
let Te = ot;
function D(n, t = n.name, e = !1) {
  return St[t] = n, e && (St[Ke] = n), In(Object.getOwnPropertyNames(n.prototype)), n;
}
function fs(n) {
  return St[n];
}
let ps = 1e3;
function Gn(n) {
  return "Svgjs" + Pn(n) + ps++;
}
function Ln(n) {
  for (let t = n.children.length - 1; t >= 0; t--)
    Ln(n.children[t]);
  return n.id && (n.id = Gn(n.nodeName)), n;
}
function T(n, t) {
  let e, i;
  for (n = Array.isArray(n) ? n : [n], i = n.length - 1; i >= 0; i--)
    for (e in t)
      n[i].prototype[e] = t[e];
}
function A(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function gs() {
  return this.parent().children();
}
function ms() {
  return this.parent().index(this);
}
function ys() {
  return this.siblings()[this.position() + 1];
}
function bs() {
  return this.siblings()[this.position() - 1];
}
function ws() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function vs() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function xs() {
  return this.parent().add(this.remove()), this;
}
function _s() {
  return this.parent().add(this.remove(), 0), this;
}
function Es(n) {
  n = W(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function Cs(n) {
  n = W(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function Ss(n) {
  return n = W(n), n.before(this), this;
}
function Ts(n) {
  return n = W(n), n.after(this), this;
}
k("Dom", {
  siblings: gs,
  position: ms,
  next: ys,
  prev: bs,
  forward: ws,
  backward: vs,
  front: xs,
  back: _s,
  before: Es,
  after: Cs,
  insertBefore: Ss,
  insertAfter: Ts
});
const Hn = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, ks = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, Ms = /rgb\((\d+),(\d+),(\d+)\)/, Ds = /(#[a-z_][a-z0-9\-_]*)/i, Ns = /\)\s*,?\s*/, Rs = /\s/g, wn = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, vn = /^rgb\(/, xn = /^(\s+)?$/, _n = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, zs = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, gt = /[\s,]+/, Qe = /[MLHVCSQTAZ]/i;
function Os() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(gt);
}
function As(n) {
  return this.classes().indexOf(n) !== -1;
}
function Is(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function Ps(n) {
  return this.hasClass(n) && this.attr(
    "class",
    this.classes().filter(function(t) {
      return t !== n;
    }).join(" ")
  ), this;
}
function Bs(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
k("Dom", {
  classes: Os,
  hasClass: As,
  addClass: Is,
  removeClass: Ps,
  toggleClass: Bs
});
function Gs(n, t) {
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
          n[i] == null || xn.test(n[i]) ? "" : n[i]
        );
  }
  return arguments.length === 2 && this.node.style.setProperty(
    n,
    t == null || xn.test(t) ? "" : t
  ), this;
}
function Ls() {
  return this.css("display", "");
}
function Hs() {
  return this.css("display", "none");
}
function Us() {
  return this.css("display") !== "none";
}
k("Dom", {
  css: Gs,
  show: Ls,
  hide: Hs,
  visible: Us
});
function Zs(n, t, e) {
  if (n == null)
    return this.data(
      We(
        cs(
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
k("Dom", { data: Zs });
function Fs(n, t) {
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
function Ys() {
  if (arguments.length === 0)
    this._memory = {};
  else
    for (let n = arguments.length - 1; n >= 0; n--)
      delete this.memory()[arguments[n]];
  return this;
}
function Xs() {
  return this._memory = this._memory || {};
}
k("Dom", { remember: Fs, forget: Ys, memory: Xs });
function js(n) {
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
function Ws(n) {
  const t = Math.round(n), i = Math.max(0, Math.min(255, t)).toString(16);
  return i.length === 1 ? "0" + i : i;
}
function zt(n, t) {
  for (let e = t.length; e--; )
    if (n[t[e]] == null)
      return !1;
  return !0;
}
function Vs(n, t) {
  const e = zt(n, "rgb") ? { _a: n.r, _b: n.g, _c: n.b, _d: 0, space: "rgb" } : zt(n, "xyz") ? { _a: n.x, _b: n.y, _c: n.z, _d: 0, space: "xyz" } : zt(n, "hsl") ? { _a: n.h, _b: n.s, _c: n.l, _d: 0, space: "hsl" } : zt(n, "lab") ? { _a: n.l, _b: n.a, _c: n.b, _d: 0, space: "lab" } : zt(n, "lch") ? { _a: n.l, _b: n.c, _c: n.h, _d: 0, space: "lch" } : zt(n, "cmyk") ? { _a: n.c, _b: n.m, _c: n.y, _d: n.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
  return e.space = t || e.space, e;
}
function $s(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function ke(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
}
class z {
  constructor(...t) {
    this.init(...t);
  }
  // Test if given value is a color
  static isColor(t) {
    return t && (t instanceof z || this.isRgb(t) || this.test(t));
  }
  // Test if given value is an rgb object
  static isRgb(t) {
    return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
  }
  /*
  Generating random colors
  */
  static random(t = "vibrant", e) {
    const { random: i, round: s, sin: o, PI: a } = Math;
    if (t === "vibrant") {
      const r = 24 * i() + 57, l = 38 * i() + 45, c = 360 * i();
      return new z(r, l, c, "lch");
    } else if (t === "sine") {
      e = e ?? i();
      const r = s(80 * o(2 * a * e / 0.5 + 0.01) + 150), l = s(50 * o(2 * a * e / 0.5 + 4.6) + 200), c = s(100 * o(2 * a * e / 0.5 + 2.3) + 150);
      return new z(r, l, c);
    } else if (t === "pastel") {
      const r = 8 * i() + 86, l = 17 * i() + 9, c = 360 * i();
      return new z(r, l, c, "lch");
    } else if (t === "dark") {
      const r = 10 + 10 * i(), l = 50 * i() + 86, c = 360 * i();
      return new z(r, l, c, "lch");
    } else if (t === "rgb") {
      const r = 255 * i(), l = 255 * i(), c = 255 * i();
      return new z(r, l, c);
    } else if (t === "lab") {
      const r = 100 * i(), l = 256 * i() - 128, c = 256 * i() - 128;
      return new z(r, l, c, "lab");
    } else if (t === "grey") {
      const r = 255 * i();
      return new z(r, r, r);
    } else
      throw new Error("Unsupported random color mode");
  }
  // Test if given value is a color string
  static test(t) {
    return typeof t == "string" && (wn.test(t) || vn.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, a] = [t, e, i].map((u) => u / 255), r = Math.min(1 - s, 1 - o, 1 - a);
    if (r === 1)
      return new z(0, 0, 0, 1, "cmyk");
    const l = (1 - s - r) / (1 - r), c = (1 - o - r) / (1 - r), h = (1 - a - r) / (1 - r);
    return new z(l, c, h, r, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, a] = [t, e, i].map((p) => p / 255), r = Math.max(s, o, a), l = Math.min(s, o, a), c = (r + l) / 2, h = r === l, d = r - l, u = h ? 0 : c > 0.5 ? d / (2 - r - l) : d / (r + l), f = h ? 0 : r === s ? ((o - a) / d + (o < a ? 6 : 0)) / 6 : r === o ? ((a - s) / d + 2) / 6 : r === a ? ((s - o) / d + 4) / 6 : 0;
    return new z(360 * f, 100 * u, 100 * c, "hsl");
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
      const d = Vs(t, e);
      Object.assign(this, d);
    } else if (typeof t == "string")
      if (vn.test(t)) {
        const d = t.replace(Rs, ""), [u, f, g] = Ms.exec(d).slice(1, 4).map((p) => parseInt(p));
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else if (wn.test(t)) {
        const d = (p) => parseInt(p, 16), [, u, f, g] = ks.exec(js(t)).map(d);
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else throw Error("Unsupported string format, can't construct Color");
    const { _a: a, _b: r, _c: l, _d: c } = this, h = this.space === "rgb" ? { r: a, g: r, b: l } : this.space === "xyz" ? { x: a, y: r, z: l } : this.space === "hsl" ? { h: a, s: r, l } : this.space === "lab" ? { l: a, a: r, b: l } : this.space === "lch" ? { l: a, c: r, h: l } : this.space === "cmyk" ? { c: a, m: r, y: l, k: c } : {};
    Object.assign(this, h);
  }
  lab() {
    const { x: t, y: e, z: i } = this.xyz(), s = 116 * e - 16, o = 500 * (t - e), a = 200 * (e - i);
    return new z(s, o, a, "lab");
  }
  lch() {
    const { l: t, a: e, b: i } = this.lab(), s = Math.sqrt(e ** 2 + i ** 2);
    let o = 180 * Math.atan2(i, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new z(t, s, o, "lch");
  }
  /*
  Conversion Methods
  */
  rgb() {
    if (this.space === "rgb")
      return this;
    if ($s(this.space)) {
      let { x: t, y: e, z: i } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: f, a: g, b: p } = this;
        if (this.space === "lch") {
          const { c: L, h: G } = this, Z = Math.PI / 180;
          g = L * Math.cos(Z * G), p = L * Math.sin(Z * G);
        }
        const m = (f + 16) / 116, y = g / 500 + m, b = m - p / 200, _ = 16 / 116, w = 8856e-6, x = 7.787;
        t = 0.95047 * (y ** 3 > w ? y ** 3 : (y - _) / x), e = 1 * (m ** 3 > w ? m ** 3 : (m - _) / x), i = 1.08883 * (b ** 3 > w ? b ** 3 : (b - _) / x);
      }
      const s = t * 3.2406 + e * -1.5372 + i * -0.4986, o = t * -0.9689 + e * 1.8758 + i * 0.0415, a = t * 0.0557 + e * -0.204 + i * 1.057, r = Math.pow, l = 31308e-7, c = s > l ? 1.055 * r(s, 1 / 2.4) - 0.055 : 12.92 * s, h = o > l ? 1.055 * r(o, 1 / 2.4) - 0.055 : 12.92 * o, d = a > l ? 1.055 * r(a, 1 / 2.4) - 0.055 : 12.92 * a;
      return new z(255 * c, 255 * h, 255 * d);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: i } = this;
      if (t /= 360, e /= 100, i /= 100, e === 0)
        return i *= 255, new z(i, i, i);
      const s = i < 0.5 ? i * (1 + e) : i + e - i * e, o = 2 * i - s, a = 255 * ke(o, s, t + 1 / 3), r = 255 * ke(o, s, t), l = 255 * ke(o, s, t - 1 / 3);
      return new z(a, r, l);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: i, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), a = 255 * (1 - Math.min(1, e * (1 - s) + s)), r = 255 * (1 - Math.min(1, i * (1 - s) + s));
      return new z(o, a, r);
    } else
      return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: i, _d: s, space: o } = this;
    return [t, e, i, s, o];
  }
  toHex() {
    const [t, e, i] = this._clamped().map(Ws);
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
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, a] = [t, e, i].map((y) => y / 255), r = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, l = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, c = a > 0.04045 ? Math.pow((a + 0.055) / 1.055, 2.4) : a / 12.92, h = (r * 0.4124 + l * 0.3576 + c * 0.1805) / 0.95047, d = (r * 0.2126 + l * 0.7152 + c * 0.0722) / 1, u = (r * 0.0193 + l * 0.1192 + c * 0.9505) / 1.08883, f = h > 8856e-6 ? Math.pow(h, 1 / 3) : 7.787 * h + 16 / 116, g = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, p = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116;
    return new z(f, g, p, "xyz");
  }
  /*
  Input and Output methods
  */
  _clamped() {
    const { _a: t, _b: e, _c: i } = this.rgb(), { max: s, min: o, round: a } = Math, r = (l) => s(0, o(a(l), 255));
    return [t, e, i].map(r);
  }
  /*
  Constructing colors
  */
}
class B {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  // Clone point
  clone() {
    return new B(this);
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
    v.isMatrixLike(t) || (t = new v(t));
    const { x: e, y: i } = this;
    return this.x = t.a * e + t.c * i + t.e, this.y = t.b * e + t.d * i + t.f, this;
  }
}
function qs(n, t) {
  return new B(n, t).transformO(this.screenCTM().inverseO());
}
function Ot(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
class v {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, i = t.flip && (e || t.flip === "x") ? -1 : 1, s = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, a = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, r = t.scale && t.scale.length ? t.scale[0] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleX) ? t.scaleX * i : i, l = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, c = t.shear || 0, h = t.rotate || t.theta || 0, d = new B(
      t.origin || t.around || t.ox || t.originX,
      t.oy || t.originY
    ), u = d.x, f = d.y, g = new B(
      t.position || t.px || t.positionX || NaN,
      t.py || t.positionY || NaN
    ), p = g.x, m = g.y, y = new B(
      t.translate || t.tx || t.translateX,
      t.ty || t.translateY
    ), b = y.x, _ = y.y, w = new B(
      t.relative || t.rx || t.relativeX,
      t.ry || t.relativeY
    ), x = w.x, L = w.y;
    return {
      scaleX: r,
      scaleY: l,
      skewX: o,
      skewY: a,
      shear: c,
      theta: h,
      rx: x,
      ry: L,
      tx: b,
      ty: _,
      ox: u,
      oy: f,
      px: p,
      py: m
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
    const s = t.a * e.a + t.c * e.b, o = t.b * e.a + t.d * e.b, a = t.a * e.c + t.c * e.d, r = t.b * e.c + t.d * e.d, l = t.e + t.a * e.e + t.c * e.f, c = t.f + t.b * e.e + t.d * e.f;
    return i.a = s, i.b = o, i.c = a, i.d = r, i.e = l, i.f = c, i;
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
    return new v(this);
  }
  // Decomposes this matrix into its affine parameters
  decompose(t = 0, e = 0) {
    const i = this.a, s = this.b, o = this.c, a = this.d, r = this.e, l = this.f, c = i * a - s * o, h = c > 0 ? 1 : -1, d = h * Math.sqrt(i * i + s * s), u = Math.atan2(h * s, h * i), f = 180 / Math.PI * u, g = Math.cos(u), p = Math.sin(u), m = (i * o + s * a) / c, y = o * d / (m * i - s) || a * d / (m * s + i), b = r - t + t * g * d + e * (m * g * d - p * y), _ = l - e + t * p * d + e * (m * p * d + g * y);
    return {
      // Return the affine parameters
      scaleX: d,
      scaleY: y,
      shear: m,
      rotate: f,
      translateX: b,
      translateY: _,
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
    const e = new v(t);
    return Ot(this.a, e.a) && Ot(this.b, e.b) && Ot(this.c, e.c) && Ot(this.d, e.d) && Ot(this.e, e.e) && Ot(this.f, e.f);
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
    const e = v.fromArray([1, 0, 0, 1, 0, 0]);
    return t = t instanceof $ ? t.matrixify() : typeof t == "string" ? v.fromArray(t.split(gt).map(parseFloat)) : Array.isArray(t) ? v.fromArray(t) : typeof t == "object" && v.isMatrixLike(t) ? t : typeof t == "object" ? new v().transform(t) : arguments.length === 6 ? v.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  // Inverses matrix
  inverseO() {
    const t = this.a, e = this.b, i = this.c, s = this.d, o = this.e, a = this.f, r = t * s - e * i;
    if (!r) throw new Error("Cannot invert " + this);
    const l = s / r, c = -e / r, h = -i / r, d = t / r, u = -(l * o + h * a), f = -(c * o + d * a);
    return this.a = l, this.b = c, this.c = h, this.d = d, this.e = u, this.f = f, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, i = t instanceof v ? t : new v(t);
    return v.matrixMultiply(i, e, this);
  }
  // Left multiplies by the given matrix
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, i = t instanceof v ? t : new v(t);
    return v.matrixMultiply(e, i, this);
  }
  // Rotate matrix
  rotate(t, e, i) {
    return this.clone().rotateO(t, e, i);
  }
  rotateO(t, e = 0, i = 0) {
    t = Ce(t);
    const s = Math.cos(t), o = Math.sin(t), { a, b: r, c: l, d: c, e: h, f: d } = this;
    return this.a = a * s - r * o, this.b = r * s + a * o, this.c = l * s - c * o, this.d = c * s + l * o, this.e = h * s - d * o + i * o - e * s + e, this.f = d * s + h * o - e * o - i * s + i, this;
  }
  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t);
    const { a: o, b: a, c: r, d: l, e: c, f: h } = this;
    return this.a = o * t, this.b = a * e, this.c = r * t, this.d = l * e, this.e = c * t - i * t + i, this.f = h * e - s * e + s, this;
  }
  // Shear matrix
  shear(t, e, i) {
    return this.clone().shearO(t, e, i);
  }
  // eslint-disable-next-line no-unused-vars
  shearO(t, e = 0, i = 0) {
    const { a: s, b: o, c: a, d: r, e: l, f: c } = this;
    return this.a = s + o * t, this.c = a + r * t, this.e = l + c * t - i * t, this;
  }
  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t), t = Ce(t), e = Ce(e);
    const o = Math.tan(t), a = Math.tan(e), { a: r, b: l, c, d: h, e: d, f: u } = this;
    return this.a = r + l * o, this.b = l + r * a, this.c = c + h * o, this.d = h + c * a, this.e = d + u * o - s * o, this.f = u + d * a - i * a, this;
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
    if (v.isMatrixLike(t))
      return new v(t).multiplyO(this);
    const e = v.formatTransforms(t), i = this, { x: s, y: o } = new B(e.ox, e.oy).transform(i), a = new v().translateO(e.rx, e.ry).lmultiplyO(i).translateO(-s, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(s, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const r = new B(s, o).transform(a), l = isFinite(e.px) ? e.px - r.x : 0, c = isFinite(e.py) ? e.py - r.y : 0;
      a.translateO(l, c);
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
function Ks() {
  return new v(this.node.getCTM());
}
function Qs() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new v(t);
    }
    return new v(this.node.getScreenCTM());
  } catch {
    return console.warn(
      `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
    ), new v();
  }
}
D(v, "Matrix");
function yt() {
  if (!yt.nodes) {
    const n = W().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true");
    const t = n.path().node;
    yt.nodes = { svg: n, path: t };
  }
  if (!yt.nodes.svg.node.parentNode) {
    const n = M.document.body || M.document.documentElement;
    yt.nodes.svg.addTo(n);
  }
  return yt.nodes;
}
function Un(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function Js(n) {
  return n === M.document || (M.document.documentElement.contains || function(t) {
    for (; t.parentNode; )
      t = t.parentNode;
    return t === M.document;
  }).call(M.document.documentElement, n);
}
class P {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += M.window.pageXOffset, this.y += M.window.pageYOffset, new P(this);
  }
  init(t) {
    const e = [0, 0, 0, 0];
    return t = typeof t == "string" ? t.split(gt).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
      t.left != null ? t.left : t.x,
      t.top != null ? t.top : t.y,
      t.width,
      t.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : e, this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
  }
  isNulled() {
    return Un(this);
  }
  // Merge rect box with another, return a new instance
  merge(t) {
    const e = Math.min(this.x, t.x), i = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - i;
    return new P(e, i, s, o);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof v || (t = new v(t));
    let e = 1 / 0, i = -1 / 0, s = 1 / 0, o = -1 / 0;
    return [
      new B(this.x, this.y),
      new B(this.x2, this.y),
      new B(this.x, this.y2),
      new B(this.x2, this.y2)
    ].forEach(function(r) {
      r = r.transform(t), e = Math.min(e, r.x), i = Math.max(i, r.x), s = Math.min(s, r.y), o = Math.max(o, r.y);
    }), new P(e, s, i - e, o - s);
  }
}
function Zn(n, t, e) {
  let i;
  try {
    if (i = t(n.node), Un(i) && !Js(n.node))
      throw new Error("Element not in the dom");
  } catch {
    i = e(n);
  }
  return i;
}
function to() {
  const e = Zn(this, (s) => s.getBBox(), (s) => {
    try {
      const o = s.clone().addTo(yt().svg).show(), a = o.node.getBBox();
      return o.remove(), a;
    } catch (o) {
      throw new Error(
        `Getting bbox of element "${s.node.nodeName}" is not possible: ${o.toString()}`
      );
    }
  });
  return new P(e);
}
function eo(n) {
  const i = Zn(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(
      `Getting rbox of element "${o.node.nodeName}" is not possible`
    );
  }), s = new P(i);
  return n ? s.transform(n.screenCTM().inverseO()) : s.addOffset();
}
function no(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
k({
  viewbox: {
    viewbox(n, t, e, i) {
      return n == null ? new P(this.attr("viewBox")) : this.attr("viewBox", new P(n, t, e, i));
    },
    zoom(n, t) {
      let { width: e, height: i } = this.attr(["width", "height"]);
      if ((!e && !i || typeof e == "string" || typeof i == "string") && (e = this.node.clientWidth, i = this.node.clientHeight), !e || !i)
        throw new Error(
          "Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element"
        );
      const s = this.viewbox(), o = e / s.width, a = i / s.height, r = Math.min(o, a);
      if (n == null)
        return r;
      let l = r / n;
      l === 1 / 0 && (l = Number.MAX_SAFE_INTEGER / 100), t = t || new B(e / 2 / o + s.x, i / 2 / a + s.y);
      const c = new P(s).transform(
        new v({ scale: l, origin: t })
      );
      return this.viewbox(c);
    }
  }
});
D(P, "Box");
class Tt extends Array {
  constructor(t = [], ...e) {
    if (super(t, ...e), typeof t == "number") return this;
    this.length = 0, this.push(...t);
  }
}
T([Tt], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, i, s) => n.call(e, e, i, s)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const io = ["toArray", "constructor", "each"];
Tt.extend = function(n) {
  n = n.reduce((t, e) => (io.includes(e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...i) {
    return this.each(e, ...i);
  }), t), {}), T([Tt], n);
};
function Gt(n, t) {
  return new Tt(
    We((t || M.document).querySelectorAll(n), function(e) {
      return ot(e);
    })
  );
}
function so(n) {
  return Gt(n, this.node);
}
function oo(n) {
  return ot(this.node.querySelector(n));
}
let ro = 0;
const Fn = {};
function Yn(n) {
  let t = n.getEventHolder();
  return t === M.window && (t = Fn), t.events || (t.events = {}), t.events;
}
function Je(n) {
  return n.getEventTarget();
}
function ao(n) {
  let t = n.getEventHolder();
  t === M.window && (t = Fn), t.events && (t.events = {});
}
function Q(n, t, e, i, s) {
  const o = e.bind(i || n), a = W(n), r = Yn(a), l = Je(a);
  t = Array.isArray(t) ? t : t.split(gt), e._svgjsListenerId || (e._svgjsListenerId = ++ro), t.forEach(function(c) {
    const h = c.split(".")[0], d = c.split(".")[1] || "*";
    r[h] = r[h] || {}, r[h][d] = r[h][d] || {}, r[h][d][e._svgjsListenerId] = o, l.addEventListener(h, o, s || !1);
  });
}
function Y(n, t, e, i) {
  const s = W(n), o = Yn(s), a = Je(s);
  typeof e == "function" && (e = e._svgjsListenerId, !e) || (t = Array.isArray(t) ? t : (t || "").split(gt), t.forEach(function(r) {
    const l = r && r.split(".")[0], c = r && r.split(".")[1];
    let h, d;
    if (e)
      o[l] && o[l][c || "*"] && (a.removeEventListener(
        l,
        o[l][c || "*"][e],
        i || !1
      ), delete o[l][c || "*"][e]);
    else if (l && c) {
      if (o[l] && o[l][c]) {
        for (d in o[l][c])
          Y(a, [l, c].join("."), d);
        delete o[l][c];
      }
    } else if (c)
      for (r in o)
        for (h in o[r])
          c === h && Y(a, [r, c].join("."));
    else if (l) {
      if (o[l]) {
        for (h in o[l])
          Y(a, [l, h].join("."));
        delete o[l];
      }
    } else {
      for (r in o)
        Y(a, r);
      ao(s);
    }
  }));
}
function lo(n, t, e, i) {
  const s = Je(n);
  return t instanceof M.window.Event || (t = new M.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...i
  })), s.dispatchEvent(t), t;
}
class ee extends qe {
  addEventListener() {
  }
  dispatch(t, e, i) {
    return lo(this, t, e, i);
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
    return Y(this, t, e, i), this;
  }
  // Bind given event to listener
  on(t, e, i, s) {
    return Q(this, t, e, i, s), this;
  }
  removeEventListener() {
  }
}
D(ee, "EventTarget");
function En() {
}
const qt = {
  duration: 400,
  ease: ">",
  delay: 0
}, co = {
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
class It extends Array {
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
    return t instanceof Array ? t : t.trim().split(gt).map(parseFloat);
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
class S {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new S(this.value, t);
  }
  // Divide number
  divide(t) {
    return t = new S(t), new S(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(Hn), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof S && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  // Subtract number
  minus(t) {
    return t = new S(t), new S(this - t, this.unit || t.unit);
  }
  // Add number
  plus(t) {
    return t = new S(t), new S(this + t, this.unit || t.unit);
  }
  // Multiply number
  times(t) {
    return t = new S(t), new S(this * t, this.unit || t.unit);
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
const ho = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), Xn = [];
function uo(n) {
  Xn.push(n);
}
function fo(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const i of t)
      n[i.nodeName] = _n.test(i.nodeValue) ? parseFloat(i.nodeValue) : i.nodeValue;
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
        return t = this.node.getAttribute(n), t == null ? co[n] : _n.test(t) ? parseFloat(t) : t;
      t = Xn.reduce((i, s) => s(n, i, this), t), typeof t == "number" ? t = new S(t) : ho.has(n) && z.isColor(t) ? t = new z(t) : t.constructor === Array && (t = new It(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
class bt extends ee {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  // Add given element at a position
  add(t, e) {
    return t = W(t), t.removeNamespace && this.node instanceof M.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  // Add element to given container and return self
  addTo(t, e) {
    return W(t).put(this, e);
  }
  // Returns all child elements
  children() {
    return new Tt(
      We(this.node.children, function(t) {
        return ot(t);
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
    return e && (i = Ln(i)), new this.constructor(i);
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
    return this.put(new bt(Kt(t), e));
  }
  // Get first child
  first() {
    return ot(this.node.firstChild);
  }
  // Get a element at the given index
  get(t) {
    return ot(this.node.childNodes[t]);
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
    return this.xml(t, e, us);
  }
  // Get / set id
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = Gn(this.type)), this.attr("id", t);
  }
  // Gets index of given element
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  // Get the last child
  last() {
    return ot(this.node.lastChild);
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
    if (e = ot(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t)
        return e;
    while (e = ot(e.node.parentNode));
    return e;
  }
  // Basically does the same as `add()` but returns the added element instead
  put(t, e) {
    return t = W(t), this.add(t, e), t;
  }
  // Add element to given container and return container
  putIn(t, e) {
    return W(t).add(this, e);
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
    return t = W(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const i = 10 ** t, s = this.attr(e);
    for (const o in s)
      typeof s[o] == "number" && (s[o] = Math.round(s[o] * i) / i);
    return this.attr(s), this;
  }
  // Import / Export raw svg
  svg(t, e) {
    return this.xml(t, e, Ve);
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
      let r = this;
      if (t != null) {
        if (r = ot(r.node.cloneNode(!0)), e) {
          const l = t(r);
          if (r = l || r, l === !1) return "";
        }
        r.each(function() {
          const l = t(this), c = l || this;
          l === !1 ? this.remove() : l && this !== c && this.replace(c);
        }, !0);
      }
      return e ? r.node.outerHTML : r.node.innerHTML;
    }
    e = e ?? !1;
    const s = Kt("wrapper", i), o = M.document.createDocumentFragment();
    s.innerHTML = t;
    for (let r = s.children.length; r--; )
      o.appendChild(s.firstElementChild);
    const a = this.parent();
    return e ? this.replace(o) && a : this.add(o);
  }
}
T(bt, { attr: fo, find: so, findOne: oo });
D(bt, "Dom");
class $ extends bt {
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
    return this.x(new S(t).plus(this.x()));
  }
  // Relative move over y axis
  dy(t = 0) {
    return this.y(new S(t).plus(this.y()));
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
    e || (t = W(t));
    const i = new Tt();
    let s = this;
    for (; (s = s.parent()) && s.node !== M.document && s.nodeName !== "#document-fragment" && (i.push(s), !(!e && s.node === t.node || e && s.matches(t))); )
      if (s.node === this.root().node)
        return null;
    return i;
  }
  // Get referenced element form attribute value
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = (t + "").match(Ds);
    return e ? W(e[1]) : null;
  }
  // Get parent document
  root() {
    const t = this.parent(fs(Ke));
    return t && t.root();
  }
  // set given data to the elements data property
  setData(t) {
    return this.dom = t, this;
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Bt(this, t, e);
    return this.width(new S(i.width)).height(new S(i.height));
  }
  // Set width of element
  width(t) {
    return this.attr("width", t);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return Bn(this, this.dom), super.writeDataToDom();
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
T($, {
  bbox: to,
  rbox: eo,
  inside: no,
  point: qs,
  ctm: Ks,
  screenCTM: Qs
});
D($, "Element");
const Xt = {
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
    if (typeof i == "string" || i instanceof z || z.isRgb(i) || i instanceof $)
      this.attr(n, i);
    else
      for (e = Xt[n].length - 1; e >= 0; e--)
        i[Xt[n][e]] != null && this.attr(Xt.prefix(n, Xt[n][e]), i[Xt[n][e]]);
    return this;
  }, k(["Element", "Runner"], t);
});
k(["Element", "Runner"], {
  // Let the user set the matrix directly
  matrix: function(n, t, e, i, s, o) {
    return n == null ? new v(this) : this.attr("transform", new v(n, t, e, i, s, o));
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
k("radius", {
  // Add x and y radius
  radius: function(n, t = n) {
    return (this._element || this).type === "radialGradient" ? this.attr("r", new S(n)) : this.rx(n).ry(t);
  }
});
k("Path", {
  // Get path length
  length: function() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function(n) {
    return new B(this.node.getPointAtLength(n));
  }
});
k(["Element", "Runner"], {
  // Set font
  font: function(n, t) {
    if (typeof n == "object") {
      for (t in n) this.font(t, n[t]);
      return this;
    }
    return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
  }
});
const po = [
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
k("Element", po);
function go() {
  return this.attr("transform", null);
}
function mo() {
  return (this.attr("transform") || "").split(Ns).slice(0, -1).map(function(t) {
    const e = t.trim().split("(");
    return [
      e[0],
      e[1].split(gt).map(function(i) {
        return parseFloat(i);
      })
    ];
  }).reverse().reduce(function(t, e) {
    return e[0] === "matrix" ? t.lmultiply(v.fromArray(e[1])) : t[e[0]].apply(t, e[1]);
  }, new v());
}
function yo(n, t) {
  if (this === n) return this;
  if (Ae(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), i = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(i.multiply(e)), this;
}
function bo(n) {
  return this.toParent(this.root(), n);
}
function wo(n, t) {
  if (n == null || typeof n == "string") {
    const s = new v(this).decompose();
    return n == null ? s : s[n];
  }
  v.isMatrixLike(n) || (n = { ...n, origin: Oe(n, this) });
  const e = t === !0 ? this : t || !1, i = new v(e).transform(n);
  return this.attr("transform", i);
}
k("Element", {
  untransform: go,
  matrixify: mo,
  toParent: yo,
  toRoot: bo,
  transform: wo
});
class q extends $ {
  flatten() {
    return this.each(function() {
      if (this instanceof q)
        return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(i, s) {
      return s[s.length - i - 1].toParent(t, e);
    }), this.remove();
  }
}
D(q, "Container");
class tn extends q {
  constructor(t, e = t) {
    super(I("defs", t), e);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
}
D(tn, "Defs");
class tt extends $ {
}
D(tt, "Shape");
function en(n) {
  return this.attr("rx", n);
}
function nn(n) {
  return this.attr("ry", n);
}
function jn(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function Wn(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function Vn(n) {
  return this.attr("cx", n);
}
function $n(n) {
  return this.attr("cy", n);
}
function qn(n) {
  return n == null ? this.rx() * 2 : this.rx(new S(n).divide(2));
}
function Kn(n) {
  return n == null ? this.ry() * 2 : this.ry(new S(n).divide(2));
}
const vo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cx: Vn,
  cy: $n,
  height: Kn,
  rx: en,
  ry: nn,
  width: qn,
  x: jn,
  y: Wn
}, Symbol.toStringTag, { value: "Module" }));
class ne extends tt {
  constructor(t, e = t) {
    super(I("ellipse", t), e);
  }
  size(t, e) {
    const i = Bt(this, t, e);
    return this.rx(new S(i.width).divide(2)).ry(
      new S(i.height).divide(2)
    );
  }
}
T(ne, vo);
k("Container", {
  // Create an ellipse
  ellipse: A(function(n = 0, t = n) {
    return this.put(new ne()).size(n, t).move(0, 0);
  })
});
D(ne, "Ellipse");
class Qn extends bt {
  constructor(t = M.document.createDocumentFragment()) {
    super(t);
  }
  // Import / Export raw xml
  xml(t, e, i) {
    if (typeof t == "boolean" && (i = e, e = t, t = null), t == null || typeof t == "function") {
      const s = new bt(Kt("wrapper", i));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, i);
    }
    return super.xml(t, !1, i);
  }
}
D(Qn, "Fragment");
function Jn(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ fx: new S(n), fy: new S(t) }) : this.attr({ x1: new S(n), y1: new S(t) });
}
function ti(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ cx: new S(n), cy: new S(t) }) : this.attr({ x2: new S(n), y2: new S(t) });
}
const xo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  from: Jn,
  to: ti
}, Symbol.toStringTag, { value: "Module" }));
class ie extends q {
  constructor(t, e) {
    super(
      I(t + "Gradient", typeof t == "string" ? null : t),
      e
    );
  }
  // custom attr to handle transform
  attr(t, e, i) {
    return t === "transform" && (t = "gradientTransform"), super.attr(t, e, i);
  }
  bbox() {
    return new P();
  }
  targets() {
    return Gt("svg [fill*=" + this.id() + "]");
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
T(ie, xo);
k({
  Container: {
    // Create gradient element in defs
    gradient(...n) {
      return this.defs().gradient(...n);
    }
  },
  // define gradient
  Defs: {
    gradient: A(function(n, t) {
      return this.put(new ie(n)).update(t);
    })
  }
});
D(ie, "Gradient");
class Qt extends q {
  // Initialize node
  constructor(t, e = t) {
    super(I("pattern", t), e);
  }
  // custom attr to handle transform
  attr(t, e, i) {
    return t === "transform" && (t = "patternTransform"), super.attr(t, e, i);
  }
  bbox() {
    return new P();
  }
  targets() {
    return Gt("svg [fill*=" + this.id() + "]");
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
k({
  Container: {
    // Create pattern element in defs
    pattern(...n) {
      return this.defs().pattern(...n);
    }
  },
  Defs: {
    pattern: A(function(n, t, e) {
      return this.put(new Qt()).update(e).attr({
        x: 0,
        y: 0,
        width: n,
        height: t,
        patternUnits: "userSpaceOnUse"
      });
    })
  }
});
D(Qt, "Pattern");
let ge = class extends tt {
  constructor(t, e = t) {
    super(I("image", t), e);
  }
  // (re)load image
  load(t, e) {
    if (!t) return this;
    const i = new M.window.Image();
    return Q(
      i,
      "load",
      function(s) {
        const o = this.parent(Qt);
        this.width() === 0 && this.height() === 0 && this.size(i.width, i.height), o instanceof Qt && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, s);
      },
      this
    ), Q(i, "load error", function() {
      Y(i);
    }), this.attr("href", i.src = t, te);
  }
};
uo(function(n, t, e) {
  return (n === "fill" || n === "stroke") && zs.test(t) && (t = e.root().defs().image(t)), t instanceof ge && (t = e.root().defs().pattern(0, 0, (i) => {
    i.add(t);
  })), t;
});
k({
  Container: {
    // create image element, load image and set its size
    image: A(function(n, t) {
      return this.put(new ge()).size(0, 0).load(n, t);
    })
  }
});
D(ge, "Image");
class wt extends It {
  // Get bounding box of points
  bbox() {
    let t = -1 / 0, e = -1 / 0, i = 1 / 0, s = 1 / 0;
    return this.forEach(function(o) {
      t = Math.max(o[0], t), e = Math.max(o[1], e), i = Math.min(o[0], i), s = Math.min(o[1], s);
    }), new P(i, s, t - i, e - s);
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
    t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(gt).map(parseFloat), t.length % 2 !== 0 && t.pop();
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
    v.isMatrixLike(t) || (t = new v(t));
    for (let e = this.length; e--; ) {
      const [i, s] = this[e];
      this[e][0] = t.a * i + t.c * s + t.e, this[e][1] = t.b * i + t.d * s + t.f;
    }
    return this;
  }
}
const _o = wt;
function Eo(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function Co(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function So(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function To(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
const sn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MorphArray: _o,
  height: To,
  width: So,
  x: Eo,
  y: Co
}, Symbol.toStringTag, { value: "Module" }));
class Pt extends tt {
  // Initialize node
  constructor(t, e = t) {
    super(I("line", t), e);
  }
  // Get array
  array() {
    return new wt([
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
    return t == null ? this.array() : (typeof e < "u" ? t = { x1: t, y1: e, x2: i, y2: s } : t = new wt(t).toLine(), this.attr(t));
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Bt(this, t, e);
    return this.attr(this.array().size(i.width, i.height).toLine());
  }
}
T(Pt, sn);
k({
  Container: {
    // Create a line element
    line: A(function(...n) {
      return Pt.prototype.plot.apply(
        this.put(new Pt()),
        n[0] != null ? n : [0, 0, 0, 0]
      );
    })
  }
});
D(Pt, "Line");
class he extends q {
  // Initialize node
  constructor(t, e = t) {
    super(I("marker", t), e);
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
k({
  Container: {
    marker(...n) {
      return this.defs().marker(...n);
    }
  },
  Defs: {
    // Create marker
    marker: A(function(n, t, e) {
      return this.put(new he()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
    })
  },
  marker: {
    // Create and attach markers
    marker(n, t, e, i) {
      let s = ["marker"];
      return n !== "all" && s.push(n), s = s.join("-"), n = arguments[1] instanceof he ? arguments[1] : this.defs().marker(t, e, i), this.attr(s, n);
    }
  }
});
D(he, "Marker");
function At(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const ko = {
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
      const a = i * o % 1 === 0;
      return (t === "start" || t === "both") && ++o, s && a && --o, i >= 0 && o < 0 && (o = 0), i <= 1 && o > e && (o = e), o / e;
    };
  }
};
class on {
  done() {
    return !1;
  }
}
class Ie extends on {
  constructor(t = qt.ease) {
    super(), this.ease = ko[t] || t;
  }
  step(t, e, i) {
    return typeof t != "number" ? i < 1 ? t : e : t + (e - t) * this.ease(i);
  }
}
class de extends on {
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
function Cn() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, i = Math.PI, s = Math.log(t / 100 + e), o = -s / Math.sqrt(i * i + s * s), a = 3.9 / (o * n);
  this.d = 2 * o * a, this.k = a * a;
}
class Mo extends de {
  constructor(t = 500, e = 0) {
    super(), this.duration(t).overshoot(e);
  }
  step(t, e, i, s) {
    if (typeof t == "string") return t;
    if (s.done = i === 1 / 0, i === 1 / 0) return e;
    if (i === 0) return t;
    i > 100 && (i = 16), i /= 1e3;
    const o = s.velocity || 0, a = -this.d * o - this.k * (t - e), r = t + o * i + a * i * i / 2;
    return s.velocity = o + a * i, s.done = Math.abs(e - r) + Math.abs(o) < 2e-3, s.done ? e : r;
  }
}
T(Mo, {
  duration: At("_duration", Cn),
  overshoot: At("_overshoot", Cn)
});
class Do extends de {
  constructor(t = 0.1, e = 0.01, i = 0, s = 1e3) {
    super(), this.p(t).i(e).d(i).windup(s);
  }
  step(t, e, i, s) {
    if (typeof t == "string") return t;
    if (s.done = i === 1 / 0, i === 1 / 0) return e;
    if (i === 0) return t;
    const o = e - t;
    let a = (s.integral || 0) + o * i;
    const r = (o - (s.error || 0)) / i, l = this._windup;
    return l !== !1 && (a = Math.max(-l, Math.min(a, l))), s.error = o, s.integral = a, s.done = Math.abs(o) < 1e-3, s.done ? e : t + (this.P * o + this.I * a + this.D * r);
  }
}
T(Do, {
  windup: At("_windup"),
  p: At("P"),
  i: At("I"),
  d: At("D")
});
const No = {
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
}, Pe = {
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
}, Me = "mlhvqtcsaz".split("");
for (let n = 0, t = Me.length; n < t; ++n)
  Pe[Me[n]] = /* @__PURE__ */ function(e) {
    return function(i, s, o) {
      if (e === "H") i[0] = i[0] + s.x;
      else if (e === "V") i[0] = i[0] + s.y;
      else if (e === "A")
        i[5] = i[5] + s.x, i[6] = i[6] + s.y;
      else
        for (let a = 0, r = i.length; a < r; ++a)
          i[a] = i[a] + (a % 2 ? s.y : s.x);
      return Pe[e](i, s, o);
    };
  }(Me[n].toUpperCase());
function Ro(n) {
  const t = n.segment[0];
  return Pe[t](n.segment.slice(1), n.p, n.p0);
}
function Be(n) {
  return n.segment.length && n.segment.length - 1 === No[n.segment[0].toUpperCase()];
}
function zo(n, t) {
  n.inNumber && Et(n, !1);
  const e = Qe.test(t);
  if (e)
    n.segment = [t];
  else {
    const i = n.lastCommand, s = i.toLowerCase(), o = i === s;
    n.segment = [s === "m" ? o ? "l" : "L" : i];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function Et(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, Be(n) && Ge(n);
}
function Ge(n) {
  n.inSegment = !1, n.absolute && (n.segment = Ro(n)), n.segments.push(n.segment);
}
function Oo(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function Ao(n) {
  return n.lastToken.toUpperCase() === "E";
}
const Io = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
function Po(n, t = !0) {
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
    p0: new B(),
    p: new B()
  };
  for (; s.lastToken = i, i = n.charAt(e++); )
    if (!(!s.inSegment && zo(s, i))) {
      if (i === ".") {
        if (s.pointSeen || s.hasExponent) {
          Et(s, !1), --e;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += i;
        continue;
      }
      if (!isNaN(parseInt(i))) {
        if (s.number === "0" || Oo(s)) {
          s.inNumber = !0, s.number = i, Et(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += i;
        continue;
      }
      if (Io.has(i)) {
        s.inNumber && Et(s, !1);
        continue;
      }
      if (i === "-" || i === "+") {
        if (s.inNumber && !Ao(s)) {
          Et(s, !1), --e;
          continue;
        }
        s.number += i, s.inNumber = !0;
        continue;
      }
      if (i.toUpperCase() === "E") {
        s.number += i, s.hasExponent = !0;
        continue;
      }
      if (Qe.test(i)) {
        if (s.inNumber)
          Et(s, !1);
        else if (Be(s))
          Ge(s);
        else
          throw new Error("parser Error");
        --e;
      }
    }
  return s.inNumber && Et(s, !1), s.inSegment && Be(s) && Ge(s), s.segments;
}
function Bo(n) {
  let t = "";
  for (let e = 0, i = n.length; e < i; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
class kt extends It {
  // Get bounding box of path
  bbox() {
    return yt().path.setAttribute("d", this.toString()), new P(yt.nodes.path.getBBox());
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
    return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), Po(t);
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
    return Bo(this);
  }
}
const ei = (n) => {
  const t = typeof n;
  return t === "number" ? S : t === "string" ? z.isColor(n) ? z : gt.test(n) ? Qe.test(n) ? kt : It : Hn.test(n) ? S : Le : rn.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? It : t === "object" ? Jt : Le;
};
class Ct {
  constructor(t) {
    this._stepper = t || new Ie("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    this._type || this.type(ei(t));
    let e = new this._type(t);
    return this._type === z && (e = this._to ? e[this._to[4]]() : this._from ? e[this._from[4]]() : e), this._type === Jt && (e = this._to ? e.align(this._to) : this._from ? e.align(this._from) : e), e = e.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(e.length)).map(Object).map(function(i) {
      return i.done = !0, i;
    }), e;
  }
}
class Le {
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
class se {
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
    }), Object.assign(this, se.defaults, t), this;
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
se.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const Go = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
class Jt {
  constructor(...t) {
    this.init(...t);
  }
  align(t) {
    const e = this.values;
    for (let i = 0, s = e.length; i < s; ++i) {
      if (e[i + 1] === t[i + 1]) {
        if (e[i + 1] === z && t[i + 7] !== e[i + 7]) {
          const r = t[i + 7], l = new z(this.values.splice(i + 3, 5))[r]().toArray();
          this.values.splice(i + 3, 0, ...l);
        }
        i += e[i + 2] + 2;
        continue;
      }
      if (!t[i + 1])
        return this;
      const o = new t[i + 1]().toArray(), a = e[i + 2] + 3;
      e.splice(
        i,
        a,
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
      const s = ei(t[i]), o = new s(t[i]).toArray();
      e.push([i, s, o.length, ...o]);
    }
    return e.sort(Go), this.values = e.reduce((i, s) => i.concat(s), []), this;
  }
  toArray() {
    return this.values;
  }
  valueOf() {
    const t = {}, e = this.values;
    for (; e.length; ) {
      const i = e.shift(), s = e.shift(), o = e.shift(), a = e.splice(0, o);
      t[i] = new s(a);
    }
    return t;
  }
}
const rn = [Le, se, Jt];
function Lo(n = []) {
  rn.push(...[].concat(n));
}
function Ho() {
  T(rn, {
    to(n) {
      return new Ct().type(this.constructor).from(this.toArray()).to(n);
    },
    fromArray(n) {
      return this.init(n), this;
    },
    toConsumable() {
      return this.toArray();
    },
    morph(n, t, e, i, s) {
      const o = function(a, r) {
        return i.step(a, t[r], e, s[r], s);
      };
      return this.fromArray(n.map(o));
    }
  });
}
class Lt extends tt {
  // Initialize node
  constructor(t, e = t) {
    super(I("path", t), e);
  }
  // Get array
  array() {
    return this._array || (this._array = new kt(this.attr("d")));
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
      typeof t == "string" ? t : this._array = new kt(t)
    );
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Bt(this, t, e);
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
Lt.prototype.MorphArray = kt;
k({
  Container: {
    // Create a wrapped path element
    path: A(function(n) {
      return this.put(new Lt()).plot(n || new kt());
    })
  }
});
D(Lt, "Path");
function Uo() {
  return this._array || (this._array = new wt(this.attr("points")));
}
function Zo() {
  return delete this._array, this;
}
function Fo(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function Yo(n) {
  return n == null ? this.array() : this.clear().attr(
    "points",
    typeof n == "string" ? n : this._array = new wt(n)
  );
}
function Xo(n, t) {
  const e = Bt(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
const ni = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array: Uo,
  clear: Zo,
  move: Fo,
  plot: Yo,
  size: Xo
}, Symbol.toStringTag, { value: "Module" }));
class Ht extends tt {
  // Initialize node
  constructor(t, e = t) {
    super(I("polygon", t), e);
  }
}
k({
  Container: {
    // Create a wrapped polygon element
    polygon: A(function(n) {
      return this.put(new Ht()).plot(n || new wt());
    })
  }
});
T(Ht, sn);
T(Ht, ni);
D(Ht, "Polygon");
class Ut extends tt {
  // Initialize node
  constructor(t, e = t) {
    super(I("polyline", t), e);
  }
}
k({
  Container: {
    // Create a wrapped polygon element
    polyline: A(function(n) {
      return this.put(new Ut()).plot(n || new wt());
    })
  }
});
T(Ut, sn);
T(Ut, ni);
D(Ut, "Polyline");
class oe extends tt {
  // Initialize node
  constructor(t, e = t) {
    super(I("rect", t), e);
  }
}
T(oe, { rx: en, ry: nn });
k({
  Container: {
    // Create a rect element
    rect: A(function(n, t) {
      return this.put(new oe()).size(n, t);
    })
  }
});
D(oe, "Rect");
class De {
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
const R = {
  nextDraw: null,
  frames: new De(),
  timeouts: new De(),
  immediates: new De(),
  timer: () => M.window.performance || M.window.Date,
  transforms: [],
  frame(n) {
    const t = R.frames.push({ run: n });
    return R.nextDraw === null && (R.nextDraw = M.window.requestAnimationFrame(R._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = R.timer().now() + t, i = R.timeouts.push({ run: n, time: e });
    return R.nextDraw === null && (R.nextDraw = M.window.requestAnimationFrame(R._draw)), i;
  },
  immediate(n) {
    const t = R.immediates.push(n);
    return R.nextDraw === null && (R.nextDraw = M.window.requestAnimationFrame(R._draw)), t;
  },
  cancelFrame(n) {
    n != null && R.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && R.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && R.immediates.remove(n);
  },
  _draw(n) {
    let t = null;
    const e = R.timeouts.last();
    for (; (t = R.timeouts.shift()) && (n >= t.time ? t.run() : R.timeouts.push(t), t !== e); )
      ;
    let i = null;
    const s = R.frames.last();
    for (; i !== s && (i = R.frames.shift()); )
      i.run(n);
    let o = null;
    for (; o = R.immediates.shift(); )
      o();
    R.nextDraw = R.timeouts.first() || R.frames.first() ? M.window.requestAnimationFrame(R._draw) : null;
  }
}, jo = function(n) {
  const t = n.start, e = n.runner.duration(), i = t + e;
  return {
    start: t,
    duration: e,
    end: i,
    runner: n.runner
  };
}, Wo = function() {
  const n = M.window;
  return (n.performance || n.Date).now();
};
class ii extends ee {
  // Construct a new timeline on the given element
  constructor(t = Wo) {
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
      return this._runners.map(jo);
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
    const a = t.persist(), r = {
      persist: a === null ? this._persist : a,
      start: s + e,
      runner: t
    };
    return this._lastRunnerId = t.id, this._runners.push(r), this._runners.sort((l, c) => l.start - c.start), this._runnerIds = this._runners.map((l) => l.runner.id), this.updateTime()._continue(), this;
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
    return R.cancelFrame(this._nextFrame), this._nextFrame = null, t ? this._stepImmediate() : this._paused ? this : (this._nextFrame = R.frame(this._step), this);
  }
  _stepFn(t = !1) {
    const e = this._timeSource();
    let i = e - this._lastSourceTime;
    t && (i = 0);
    const s = this._speed * i + (this._time - this._lastStepTime);
    this._lastSourceTime = e, t || (this._time += s, this._time = this._time < 0 ? 0 : this._time), this._lastStepTime = this._time, this.fire("time", this._time);
    for (let a = this._runners.length; a--; ) {
      const r = this._runners[a], l = r.runner;
      this._time - r.start <= 0 && l.reset();
    }
    let o = !1;
    for (let a = 0, r = this._runners.length; a < r; a++) {
      const l = this._runners[a], c = l.runner;
      let h = s;
      const d = this._time - l.start;
      if (d <= 0) {
        o = !0;
        continue;
      } else d < h && (h = d);
      if (!c.active()) continue;
      c.step(h).done ? l.persist !== !0 && c.duration() - c.time() + this._time + l.persist < this._time && (c.unschedule(), --a, --r) : o = !0;
    }
    return o && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this;
  }
  terminate() {
    this._startTime = 0, this._speed = 1, this._persist = 0, this._nextFrame = null, this._paused = !0, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
}
k({
  Element: {
    timeline: function(n) {
      return n == null ? (this._timeline = this._timeline || new ii(), this._timeline) : (this._timeline = n, this);
    }
  }
});
class J extends ee {
  constructor(t) {
    super(), this.id = J.id++, t = t ?? qt.duration, t = typeof t == "function" ? new de(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof de, this._stepper = this._isDeclarative ? t : new Ie(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new v(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, i) {
    let s = 1, o = !1, a = 0;
    return t = t ?? qt.duration, e = e ?? qt.delay, i = i || "last", typeof t == "object" && !(t instanceof on) && (e = t.delay ?? e, i = t.when ?? i, o = t.swing || o, s = t.times ?? s, a = t.wait ?? a, t = t.duration ?? qt.duration), {
      duration: t,
      delay: e,
      swing: o,
      times: s,
      wait: a,
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
    const s = J.sanitise(t, e, i), o = new J(s.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(s).schedule(s.delay, s.when);
  }
  clearTransform() {
    return this.transforms = new v(), this;
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
    return this._stepper = new Ie(t), this;
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
      const a = Math.floor(this._time / e), l = (this._time - a * e) / this._duration;
      return Math.min(a + l, this._times);
    }
    const i = Math.floor(t), s = t % 1, o = e * i + this._duration * s;
    return this.time(o);
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  position(t) {
    const e = this._time, i = this._duration, s = this._wait, o = this._times, a = this._swing, r = this._reverse;
    let l;
    if (t == null) {
      const u = function(g) {
        const p = a * Math.floor(g % (2 * (s + i)) / (s + i)), m = p && !r || !p && r, y = Math.pow(-1, m) * (g % (s + i)) / i + m;
        return Math.max(Math.min(y, 1), 0);
      }, f = o * (s + i) - s;
      return l = e <= 0 ? Math.round(u(1e-5)) : e < f ? u(e) : Math.round(u(f - 1e-5)), l;
    }
    const c = Math.floor(this.loops()), h = a && c % 2 === 0;
    return l = c + (h && !r || r && h ? t : 1 - t), this.loops(l);
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
      initialiser: t || En,
      runner: e || En,
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
    if (t instanceof ii || (i = e, e = t, t = this.timeline()), !t)
      throw Error("Runner cannot be scheduled without timeline");
    return t.schedule(this, e, i), this;
  }
  step(t) {
    if (!this.enabled) return this;
    t = t ?? 16, this._time += t;
    const e = this.position(), i = this._lastPosition !== e && this._time >= 0;
    this._lastPosition = e;
    const s = this.duration(), o = this._lastTime <= 0 && this._time > 0, a = this._lastTime < s && this._time >= s;
    this._lastTime = this._time, o && this.fire("start", this);
    const r = this._isDeclarative;
    this.done = !r && !a && this._time >= s, this._reseted = !1;
    let l = !1;
    return (i || r) && (this._initialise(i), this.transforms = new v(), l = this._run(r ? t : e), this.fire("step", this)), this.done = this.done || l && r, a && this.fire("finished", this), this;
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
      const o = this._queue[i], a = o.runner.call(this, t);
      o.finished = o.finished || a === !0, e = e && o.finished;
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
J.id = 0;
class ue {
  constructor(t = new v(), e = -1, i = !0) {
    this.transforms = t, this.id = e, this.done = i;
  }
  clearTransformsFromQueue() {
  }
}
T([J, ue], {
  mergeWith(n) {
    return new ue(
      n.transforms.lmultiply(this.transforms),
      n.id
    );
  }
});
const si = (n, t) => n.lmultiplyO(t), oi = (n) => n.transforms;
function Vo() {
  const t = this._transformationRunners.runners.map(oi).reduce(si, new v());
  this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
class $o {
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
    return this.ids.splice(0, e, 0), this.runners.splice(0, e, new ue()).forEach((i) => i.clearTransformsFromQueue()), this;
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
k({
  Element: {
    animate(n, t, e) {
      const i = J.sanitise(n, t, e), s = this.timeline();
      return new J(i.duration).loop(i).element(this).timeline(s.play()).schedule(i.delay, i.when);
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
      return this._transformationRunners.runners.filter((t) => t.id <= n.id).map(oi).reduce(si, new v());
    },
    _addRunner(n) {
      this._transformationRunners.add(n), R.cancelImmediate(this._frameId), this._frameId = R.immediate(Vo.bind(this));
    },
    _prepareRunner() {
      this._frameId == null && (this._transformationRunners = new $o().add(
        new ue(new v(this))
      ));
    }
  }
});
const qo = (n, t) => n.filter((e) => !t.includes(e));
T(J, {
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
    let s = new Ct(this._stepper).to(i), o = Object.keys(i);
    return this.queue(
      function() {
        s = s.from(this.element()[n](o));
      },
      function(a) {
        return this.element()[n](s.at(a).valueOf()), s.done();
      },
      function(a) {
        const r = Object.keys(a), l = qo(r, o);
        if (l.length) {
          const h = this.element()[n](l), d = new Jt(s.from()).valueOf();
          Object.assign(d, h), s.from(d);
        }
        const c = new Jt(s.to()).valueOf();
        Object.assign(c, a), s.to(c), o = r, i = a;
      }
    ), this._rememberMorpher(n, s), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new Ct(this._stepper).to(new S(n));
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
    const i = v.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !i;
    const s = new Ct(this._stepper).type(
      e ? se : v
    );
    let o, a, r, l, c;
    function h() {
      a = a || this.element(), o = o || Oe(n, a), c = new v(t ? void 0 : a), a._addRunner(this), t || a._clearTransformRunnersBefore(this);
    }
    function d(f) {
      t || this.clearTransform();
      const { x: g, y: p } = new B(o).transform(
        a._currentTransform(this)
      );
      let m = new v({ ...n, origin: [g, p] }), y = this._isDeclarative && r ? r : c;
      if (e) {
        m = m.decompose(g, p), y = y.decompose(g, p);
        const _ = m.rotate, w = y.rotate, x = [_ - 360, _, _ + 360], L = x.map((et) => Math.abs(et - w)), G = Math.min(...L), Z = L.indexOf(G);
        m.rotate = x[Z];
      }
      t && (i || (m.rotate = n.rotate || 0), this._isDeclarative && l && (y.rotate = l)), s.from(y), s.to(m);
      const b = s.at(f);
      return l = b.rotate, r = new v(b), this.addTransform(r), a._addRunner(this), s.done();
    }
    function u(f) {
      (f.origin || "center").toString() !== (n.origin || "center").toString() && (o = Oe(f, a)), n = { ...f, origin: o };
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
    if (t = new S(t), this._tryRetarget(n, t)) return this;
    const e = new Ct(this._stepper).to(t);
    let i = null;
    return this.queue(
      function() {
        i = this.element()[n](), e.from(i), e.to(i + t);
      },
      function(s) {
        return this.element()[n](e.at(s)), e.done();
      },
      function(s) {
        e.to(i + new S(s));
      }
    ), this._rememberMorpher(n, e), this;
  },
  _queueObject(n, t) {
    if (this._tryRetarget(n, t)) return this;
    const e = new Ct(this._stepper).to(t);
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
    return this._queueObject(n, new S(t));
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
    const s = new Ct(this._stepper).type(this._element.MorphArray).to(n);
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
    return this._queueObject("viewbox", new P(n, t, e, i));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
T(J, { rx: en, ry: nn, from: Jn, to: ti });
D(J, "Runner");
class me extends q {
  constructor(t, e = t) {
    super(I("svg", t), e), this.namespace();
  }
  // Creates and returns defs element
  defs() {
    return this.isRoot() ? ot(this.node.querySelector("defs")) || this.put(new tn()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof M.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  // Add namespaces
  namespace() {
    return this.isRoot() ? this.attr({ xmlns: Ve, version: "1.1" }).attr(
      "xmlns:xlink",
      te,
      Se
    ) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, Se).attr("xmlns:svgjs", null, Se);
  }
  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    return this.isRoot() ? this : super.root();
  }
}
k({
  Container: {
    // Create nested svg document
    nested: A(function() {
      return this.put(new me());
    })
  }
});
D(me, "Svg", !0);
let an = class extends q {
  // Initialize node
  constructor(t, e = t) {
    super(I("symbol", t), e);
  }
};
k({
  Container: {
    symbol: A(function() {
      return this.put(new an());
    })
  }
});
D(an, "Symbol");
function Ko(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(M.document.createTextNode(n)), this;
}
function Qo() {
  return this.node.getComputedTextLength();
}
function Jo(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function tr(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function er(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function nr(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function ir(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function sr(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function or(n) {
  return this.attr("x", n);
}
function rr(n) {
  return this.attr("y", n);
}
function ar(n, t) {
  return this.ax(n).ay(t);
}
function lr(n) {
  return this._build = !!n, this;
}
const ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amove: ar,
  ax: or,
  ay: rr,
  build: lr,
  center: sr,
  cx: nr,
  cy: ir,
  length: Qo,
  move: er,
  plain: Ko,
  x: Jo,
  y: tr
}, Symbol.toStringTag, { value: "Module" }));
class lt extends tt {
  // Initialize node
  constructor(t, e = t) {
    super(I("text", t), e), this.dom.leading = this.dom.leading ?? new S(1.3), this._rebuild = !0, this._build = !1;
  }
  // Set / get leading
  leading(t) {
    return t == null ? this.dom.leading : (this.dom.leading = new S(t), this.rebuild());
  }
  // Rebuild appearance type
  rebuild(t) {
    if (typeof t == "boolean" && (this._rebuild = t), this._rebuild) {
      const e = this;
      let i = 0;
      const s = this.dom.leading;
      this.each(function(o) {
        if (Ae(this.node)) return;
        const a = M.window.getComputedStyle(this.node).getPropertyValue("font-size"), r = s * new S(a);
        this.dom.newLined && (this.attr("x", e.attr("x")), this.text() === `
` ? i += r : (this.attr("dy", o ? r + i : 0), i = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  // overwrite method from parent to set data properly
  setData(t) {
    return this.dom = t, this.dom.leading = new S(t.leading || 1.3), this;
  }
  writeDataToDom() {
    return Bn(this, this.dom, { leading: 1.3 }), this;
  }
  // Set the text content
  text(t) {
    if (t === void 0) {
      const e = this.node.childNodes;
      let i = 0;
      t = "";
      for (let s = 0, o = e.length; s < o; ++s) {
        if (e[s].nodeName === "textPath" || Ae(e[s])) {
          s === 0 && (i = s + 1);
          continue;
        }
        s !== i && e[s].nodeType !== 3 && ot(e[s]).dom.newLined === !0 && (t += `
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
T(lt, ri);
k({
  Container: {
    // Create text element
    text: A(function(n = "") {
      return this.put(new lt()).text(n);
    }),
    // Create plain text element
    plain: A(function(n = "") {
      return this.put(new lt()).plain(n);
    })
  }
});
D(lt, "Text");
class ye extends tt {
  // Initialize node
  constructor(t, e = t) {
    super(I("tspan", t), e), this._build = !1;
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
    if (!(t instanceof lt))
      return this;
    const e = t.index(this), i = M.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = t.dom.leading * new S(i);
    return this.dy(e ? s : 0).attr("x", t.x());
  }
  // Set text content
  text(t) {
    return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
  }
}
T(ye, ri);
k({
  Tspan: {
    tspan: A(function(n = "") {
      const t = new ye();
      return this._build || this.clear(), this.put(t).text(n);
    })
  },
  Text: {
    newLine: function(n = "") {
      return this.tspan(n).newLine();
    }
  }
});
D(ye, "Tspan");
class be extends tt {
  constructor(t, e = t) {
    super(I("circle", t), e);
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
    return this.radius(new S(t).divide(2));
  }
}
T(be, { x: jn, y: Wn, cx: Vn, cy: $n, width: qn, height: Kn });
k({
  Container: {
    // Create circle element
    circle: A(function(n = 0) {
      return this.put(new be()).size(n).move(0, 0);
    })
  }
});
D(be, "Circle");
class He extends q {
  constructor(t, e = t) {
    super(I("clipPath", t), e);
  }
  // Unclip all clipped elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unclip();
    }), super.remove();
  }
  targets() {
    return Gt("svg [clip-path*=" + this.id() + "]");
  }
}
k({
  Container: {
    // Create clipping element
    clip: A(function() {
      return this.defs().put(new He());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof He ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    // Unclip element
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
D(He, "ClipPath");
class ai extends $ {
  constructor(t, e = t) {
    super(I("foreignObject", t), e);
  }
}
k({
  Container: {
    foreignObject: A(function(n, t) {
      return this.put(new ai()).size(n, t);
    })
  }
});
D(ai, "ForeignObject");
function cr(n, t) {
  return this.children().forEach((e) => {
    let i;
    try {
      i = e.node instanceof $e().SVGSVGElement ? new P(e.attr(["x", "y", "width", "height"])) : e.bbox();
    } catch {
      return;
    }
    const s = new v(e), o = s.translate(n, t).transform(s.inverse()), a = new B(i.x, i.y).transform(o);
    e.move(a.x, a.y);
  }), this;
}
function hr(n) {
  return this.dmove(n, 0);
}
function dr(n) {
  return this.dmove(0, n);
}
function ur(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function fr(n = 0, t = 0, e = this.bbox()) {
  const i = n - e.x, s = t - e.y;
  return this.dmove(i, s);
}
function pr(n, t, e = this.bbox()) {
  const i = Bt(this, n, t, e), s = i.width / e.width, o = i.height / e.height;
  return this.children().forEach((a) => {
    const r = new B(e).transform(new v(a).inverse());
    a.scale(s, o, r.x, r.y);
  }), this;
}
function gr(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function mr(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function yr(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
const li = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dmove: cr,
  dx: hr,
  dy: dr,
  height: ur,
  move: fr,
  size: pr,
  width: gr,
  x: mr,
  y: yr
}, Symbol.toStringTag, { value: "Module" }));
class Zt extends q {
  constructor(t, e = t) {
    super(I("g", t), e);
  }
}
T(Zt, li);
k({
  Container: {
    // Create a group element
    group: A(function() {
      return this.put(new Zt());
    })
  }
});
D(Zt, "G");
class fe extends q {
  constructor(t, e = t) {
    super(I("a", t), e);
  }
  // Link target attribute
  target(t) {
    return this.attr("target", t);
  }
  // Link url
  to(t) {
    return this.attr("href", t, te);
  }
}
T(fe, li);
k({
  Container: {
    // Create a hyperlink element
    link: A(function(n) {
      return this.put(new fe()).to(n);
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
      return t || (t = new fe(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
D(fe, "A");
class Ue extends q {
  // Initialize node
  constructor(t, e = t) {
    super(I("mask", t), e);
  }
  // Unmask all masked elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unmask();
    }), super.remove();
  }
  targets() {
    return Gt("svg [mask*=" + this.id() + "]");
  }
}
k({
  Container: {
    mask: A(function() {
      return this.defs().put(new Ue());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof Ue ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    // Unmask element
    unmask() {
      return this.attr("mask", null);
    }
  }
});
D(Ue, "Mask");
class ci extends $ {
  constructor(t, e = t) {
    super(I("stop", t), e);
  }
  // add color stops
  update(t) {
    return (typeof t == "number" || t instanceof S) && (t = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), t.opacity != null && this.attr("stop-opacity", t.opacity), t.color != null && this.attr("stop-color", t.color), t.offset != null && this.attr("offset", new S(t.offset)), this;
  }
}
k({
  Gradient: {
    // Add a color stop
    stop: function(n, t, e) {
      return this.put(new ci()).update(n, t, e);
    }
  }
});
D(ci, "Stop");
function br(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const i in t)
    e += hs(i) + ":" + t[i] + ";";
  return e += "}", e;
}
class Ze extends $ {
  constructor(t, e = t) {
    super(I("style", t), e);
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
    return this.addText(br(t, e));
  }
}
k("Dom", {
  style(n, t) {
    return this.put(new Ze()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new Ze()).font(n, t, e);
  }
});
D(Ze, "Style");
class ln extends lt {
  // Initialize node
  constructor(t, e = t) {
    super(I("textPath", t), e);
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
k({
  Container: {
    textPath: A(function(n, t) {
      return n instanceof lt || (n = this.text(n)), n.path(t);
    })
  },
  Text: {
    // Create path for text to run on
    path: A(function(n, t = !0) {
      const e = new ln();
      n instanceof Lt || (n = this.defs().path(n)), e.attr("href", "#" + n, te);
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
    text: A(function(n) {
      return n instanceof lt || (n = new lt().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Gt("svg textPath").filter((n) => (n.attr("href") || "").includes(this.id()));
    }
  }
});
ln.prototype.MorphArray = kt;
D(ln, "TextPath");
class hi extends tt {
  constructor(t, e = t) {
    super(I("use", t), e);
  }
  // Use element as a reference
  use(t, e) {
    return this.attr("href", (e || "") + "#" + t, te);
  }
}
k({
  Container: {
    // Create a use element
    use: A(function(n, t) {
      return this.put(new hi()).use(n, t);
    })
  }
});
D(hi, "Use");
const we = W;
T([me, an, ge, Qt, he], V("viewbox"));
T([Pt, Ut, Ht, Lt], V("marker"));
T(lt, V("Text"));
T(Lt, V("Path"));
T(tn, V("Defs"));
T([lt, ye], V("Tspan"));
T([oe, ne, ie, J], V("radius"));
T(ee, V("EventTarget"));
T(bt, V("Dom"));
T($, V("Element"));
T(tt, V("Shape"));
T([q, Qn], V("Container"));
T(ie, V("Gradient"));
T(J, V("Runner"));
Tt.extend(ls());
Lo([
  S,
  z,
  P,
  v,
  It,
  wt,
  kt,
  B
]);
Ho();
const Sn = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY });
class wr {
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
    t.preventDefault(), t.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Sn(t));
    const i = (e ? "mousemove" : "touchmove") + ".drag", s = (e ? "mouseup" : "touchend") + ".drag";
    Q(window, i, this.drag, this, { passive: !1 }), Q(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: t, handler: this, box: this.box });
  }
  // While dragging
  drag(t) {
    const { box: e, lastClick: i } = this, s = this.el.point(Sn(t)), o = s.x - i.x, a = s.y - i.y;
    if (!o && !a) return e;
    const r = e.x + o, l = e.y + a;
    this.box = new P(r, l, e.w, e.h), this.lastClick = s, !this.el.dispatch("dragmove", {
      event: t,
      handler: this,
      box: this.box,
      dx: o,
      dy: a
    }).defaultPrevented && this.move(r, l);
  }
  move(t, e) {
    this.el.type === "svg" ? Zt.prototype.move.call(this.el, t, e) : this.el.move(t, e);
  }
  endDrag(t) {
    this.drag(t), this.el.fire("dragend", { event: t, handler: this, box: this.box }), Y(window, "mousemove.drag"), Y(window, "touchmove.drag"), Y(window, "mouseup.drag"), Y(window, "touchend.drag"), this.init(!0);
  }
}
T($, {
  draggable(n = !0) {
    return (this.remember("_draggable") || new wr(this)).init(n), this;
  }
});
var jt = function(t) {
  return t.touches || [{
    clientX: t.clientX,
    clientY: t.clientY
  }];
};
T(me, {
  panZoom: function(t) {
    var e, i, s, o, a, r, l, c, h, d, u, f, g = this;
    if (this.off(".panZoom"), t === !1) return this;
    t = (e = t) != null ? e : {};
    var p = (i = t.zoomFactor) != null ? i : 2, m = (s = t.zoomMin) != null ? s : Number.MIN_VALUE, y = (o = t.zoomMax) != null ? o : Number.MAX_VALUE, b = (a = t.wheelZoom) != null ? a : !0, _ = (r = t.pinchZoom) != null ? r : !0, w = (l = t.panning) != null ? l : !0, x = (c = t.panButton) != null ? c : 0, L = (h = t.oneFingerPan) != null ? h : !1, G = (d = t.margins) != null ? d : !1, Z = (u = t.wheelZoomDeltaModeLinePixels) != null ? u : 17, et = (f = t.wheelZoomDeltaModeScreenPixels) != null ? f : 53, ct, O, at = !1, nt = this.viewbox(), vt = function(E) {
      if (!G) return E;
      var N = G.top, H = G.left, it = G.bottom, st = G.right, j = g.attr(["width", "height"]), K = j.width, Rt = j.height, C = g.node.preserveAspectRatio.baseVal, ut = 0, ft = 0, Ft = 0, Yt = 0;
      if (C.align !== C.SVG_PRESERVEASPECTRATIO_NONE) {
        var re = K / Rt, ae = nt.width / nt.height;
        if (ae !== re) {
          var mn = C.meetOrSlice !== C.SVG_MEETORSLICE_SLICE, Ee = re > ae ? "width" : "height", yn = Ee === "width", bn = mn && yn || !mn && !yn, is = bn ? re / ae : ae / re, mt = E[Ee] - E[Ee] * is;
          bn ? C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (ut = mt / 2, ft = -mt / 2) : C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMAX ? ft = -mt : (C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (ut = mt) : C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (Ft = mt / 2, Yt = -mt / 2) : C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? Yt = -mt : (C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMAX || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMAX || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (Ft = mt);
        }
      }
      var ss = nt.width + nt.x - H - ut, os = nt.x + st - E.width - ft, rs = nt.height + nt.y - N - Ft, as = nt.y + it - E.height - Yt;
      return E.x = Math.min(ss, Math.max(os, E.x)), E.y = Math.min(rs, Math.max(as, E.y)), E;
    }, Mt = function(E) {
      E.preventDefault();
      var N;
      switch (E.deltaMode) {
        case 1:
          N = E.deltaY * Z;
          break;
        case 2:
          N = E.deltaY * et;
          break;
        default:
          N = E.deltaY;
          break;
      }
      var H = Math.pow(1 + p, -1 * N / 100) * this.zoom(), it = this.point(E.clientX, E.clientY);
      if (H > y && (H = y), H < m && (H = m), this.dispatch("zoom", {
        level: H,
        focus: it
      }).defaultPrevented)
        return this;
      if (this.zoom(H, it), G) {
        var st = vt(this.viewbox());
        this.viewbox(st);
      }
    }, Dt = function X(E) {
      if (O = jt(E), O.length < 2) {
        w && L && dt.call(this, E);
        return;
      }
      w && L && _t.call(this, E), E.preventDefault(), !this.dispatch("pinchZoomStart", {
        event: E
      }).defaultPrevented && (this.off("touchstart.panZoom", X), at = !0, Q(document, "touchmove.panZoom", ht, this, {
        passive: !1
      }), Q(document, "touchend.panZoom", xt, this, {
        passive: !1
      }));
    }, xt = function X(E) {
      E.preventDefault();
      var N = jt(E);
      N.length > 1 || (at = !1, this.dispatch("pinchZoomEnd", {
        event: E
      }), Y(document, "touchmove.panZoom", ht), Y(document, "touchend.panZoom", X), this.on("touchstart.panZoom", Dt), N.length && w && L && dt.call(this, E));
    }, ht = function(E) {
      E.preventDefault();
      var N = jt(E), H = this.zoom(), it = Math.sqrt(Math.pow(O[0].clientX - O[1].clientX, 2) + Math.pow(O[0].clientY - O[1].clientY, 2)), st = Math.sqrt(Math.pow(N[0].clientX - N[1].clientX, 2) + Math.pow(N[0].clientY - N[1].clientY, 2)), j = it / st;
      (H < m && j > 1 || H > y && j < 1) && (j = 1);
      var K = {
        x: N[0].clientX + 0.5 * (N[1].clientX - N[0].clientX),
        y: N[0].clientY + 0.5 * (N[1].clientY - N[0].clientY)
      }, Rt = {
        x: O[0].clientX + 0.5 * (O[1].clientX - O[0].clientX),
        y: O[0].clientY + 0.5 * (O[1].clientY - O[0].clientY)
      }, C = this.point(K.x, K.y), ut = this.point(2 * K.x - Rt.x, 2 * K.y - Rt.y), ft = new P(this.viewbox()).transform(new v().translate(-ut.x, -ut.y).scale(j, 0, 0).translate(C.x, C.y));
      vt(ft), this.viewbox(ft), O = N, this.dispatch("zoom", {
        box: ft,
        focus: ut
      });
    }, dt = function X(E) {
      var N = E.type.indexOf("mouse") > -1;
      N && E.button !== x && E.which !== x + 1 || (E.preventDefault(), this.off("mousedown.panZoom", X), O = jt(E), !at && (this.dispatch("panStart", {
        event: E
      }), ct = {
        x: O[0].clientX,
        y: O[0].clientY
      }, Q(document, "touchmove.panZoom mousemove.panZoom", Nt, this, {
        passive: !1
      }), Q(document, "touchend.panZoom mouseup.panZoom", _t, this, {
        passive: !1
      })));
    }, _t = function X(E) {
      E.preventDefault(), Y(document, "touchmove.panZoom mousemove.panZoom", Nt), Y(document, "touchend.panZoom mouseup.panZoom", X), this.on("mousedown.panZoom", dt), this.dispatch("panEnd", {
        event: E
      });
    }, Nt = function(E) {
      E.preventDefault();
      var N = jt(E), H = {
        x: N[0].clientX,
        y: N[0].clientY
      }, it = this.point(H.x, H.y), st = this.point(ct.x, ct.y), j = [st.x - it.x, st.y - it.y];
      if (!(!j[0] && !j[1])) {
        var K = new P(this.viewbox()).transform(new v().translate(j[0], j[1]));
        ct = H, vt(K), !this.dispatch("panning", {
          box: K,
          event: E
        }).defaultPrevented && this.viewbox(K);
      }
    };
    return b && this.on("wheel.panZoom", Mt, this, {
      passive: !1
    }), _ && this.on("touchstart.panZoom", Dt, this, {
      passive: !1
    }), w && this.on("mousedown.panZoom", dt, this, {
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
function Fe(n, t, e, i = null) {
  return function(s) {
    s.preventDefault(), s.stopPropagation();
    var o = s.pageX || s.touches[0].pageX, a = s.pageY || s.touches[0].pageY;
    t.fire(n, { x: o, y: a, event: s, index: i, points: e });
  };
}
function Ye([n, t], { a: e, b: i, c: s, d: o, e: a, f: r }) {
  return [n * e + t * s + a, n * i + t * o + r];
}
class di {
  constructor(t) {
    this.el = t, t.remember("_selectHandler", this), this.selection = new Zt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = $e();
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
      this.createHandle.call(this, this.selection, t, e, i, s), this.selection.get(e + 1).addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection touchstart.selection", Fe(s, this.el, this.handlePoints, e));
    });
  }
  createHandleFn(t) {
    t.polyline();
  }
  updateHandleFn(t, e, i, s) {
    const o = s.at(i - 1), a = s[(i + 1) % s.length], r = e, l = [r[0] - o[0], r[1] - o[1]], c = [r[0] - a[0], r[1] - a[1]], h = Math.sqrt(l[0] * l[0] + l[1] * l[1]), d = Math.sqrt(c[0] * c[0] + c[1] * c[1]), u = [l[0] / h, l[1] / h], f = [c[0] / d, c[1] / d], g = [r[0] - u[0] * 10, r[1] - u[1] * 10], p = [r[0] - f[0] * 10, r[1] - f[1] * 10];
    t.plot([g, r, p]);
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
    const t = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection touchstart.selection", Fe("rot", this.el, this.handlePoints));
    this.createRot.call(this, t);
  }
  updateRotationHandle() {
    const t = this.selection.findOne("g.svg_select_handle_rot");
    this.updateRot(t, this.rotationPoint, this.handlePoints);
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.bbox(), e = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(t).map((i) => Ye(i, e)), this.rotationPoint = Ye(this.getRotationPoint(t), e);
  }
  // A collection of all the points we need to draw our ui
  getHandlePoints({ x: t, x2: e, y: i, y2: s, cx: o, cy: a } = this.el.bbox()) {
    return [
      [t, i],
      [o, i],
      [e, i],
      [e, a],
      [e, s],
      [o, s],
      [t, s],
      [t, a]
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
class vr {
  constructor(t) {
    this.el = t, t.remember("_pointSelectHandler", this), this.selection = new Zt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = $e();
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
      this.createHandle.call(this, this.selection, t, e, i), this.selection.get(e + 1).addClass("svg_select_handle_point").on("mousedown.selection touchstart.selection", Fe("point", this.el, this.points, e));
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
    this.points = this.el.array().map((e) => Ye(e, t));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}
const ui = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let i = this.remember("_" + n.name);
  return i || (t.prototype instanceof di ? (i = new t(this), t = !0) : i = new n(this), this.remember("_" + n.name, i)), i.active(t, e), this;
};
T($, {
  select: ui(di)
});
T([Ht, Ut, Pt], {
  pointSelect: ui(vr)
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
const le = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY }), fi = (n) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    t = Math.min(t, a[0]), e = Math.min(e, a[1]), i = Math.max(i, a[0]), s = Math.max(s, a[1]);
  }
  return new P(t, e, i - t, s - e);
};
function xr(n, t, e) {
  const s = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([o, a]) => {
    const r = o - t[0], l = a - t[1], c = r * e, h = l * e;
    return [c + t[0], h + t[1]];
  });
  return fi(s);
}
class Tn {
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
    this.box = this.el.bbox(), this.startPoint = this.el.point(le(e)), this.index = i, this.points = s.slice();
    const a = (o ? "mousemove" : "touchmove") + ".resize", r = (o ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    t.type === "point" ? Q(window, a, this.movePoint) : t.type === "rot" ? Q(window, a, this.rotate) : Q(window, a, this.resize), Q(window, r, this.endResize);
  }
  resize(t) {
    this.lastEvent = t;
    const e = this.snapToGrid(this.el.point(le(t)));
    let i = e.x - this.startPoint.x, s = e.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (i *= 2, s *= 2);
    const o = this.box.x + i, a = this.box.y + s, r = this.box.x2 + i, l = this.box.y2 + s;
    let c = new P(this.box);
    if (this.eventType.includes("l") && (c.x = Math.min(o, this.box.x2), c.x2 = Math.max(o, this.box.x2)), this.eventType.includes("r") && (c.x = Math.min(r, this.box.x), c.x2 = Math.max(r, this.box.x)), this.eventType.includes("t") && (c.y = Math.min(a, this.box.y2), c.y2 = Math.max(a, this.box.y2)), this.eventType.includes("b") && (c.y = Math.min(l, this.box.y), c.y2 = Math.max(l, this.box.y)), c.width = c.x2 - c.x, c.height = c.y2 - c.y, this.preserveAspectRatio) {
      const h = c.width / this.box.width, d = c.height / this.box.height, u = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], f = (u.indexOf(this.eventType) + 4) % u.length, g = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[f];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? d : h;
      p = this.eventType.length === 2 ? Math.max(h, d) : p, c = xr(this.box, g, p);
    }
    this.el.dispatch("resize", {
      box: new P(c),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.size(c.width, c.height).move(c.x, c.y);
  }
  movePoint(t) {
    this.lastEvent = t;
    const { x: e, y: i } = this.snapToGrid(this.el.point(le(t))), s = this.el.array().slice();
    s[this.index] = [e, i], !this.el.dispatch("resize", {
      box: fi(s),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(t) {
    this.lastEvent = t;
    const e = this.startPoint, i = this.el.point(le(t)), { cx: s, cy: o } = this.box, a = e.x - s, r = e.y - o, l = i.x - s, c = i.y - o, h = Math.sqrt(a * a + r * r) * Math.sqrt(l * l + c * c);
    if (h === 0)
      return;
    let d = Math.acos((a * l + r * c) / h) / Math.PI * 180;
    if (!d) return;
    i.x < e.x && (d = -d);
    const u = new v(this.el), { x: f, y: g } = new B(s, o).transformO(u), { rotate: p } = u.decompose(), m = this.snapToAngle(p + d) - p;
    this.el.dispatch("resize", {
      box: this.box,
      angle: m,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.transform(u.rotateO(m, f, g));
  }
  endResize(t) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(t), this.lastEvent = null, this.eventType = "", Y(window, "mousemove.resize touchmove.resize"), Y(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(t) {
    return this.grid && (t.x = Math.round(t.x / this.grid) * this.grid, t.y = Math.round(t.y / this.grid) * this.grid), t;
  }
  snapToAngle(t) {
    return this.degree && (t = Math.round(t / this.degree) * this.degree), t;
  }
}
T($, {
  // Resize element with mouse
  resize: function(n = !0, t = {}) {
    typeof n == "object" && (t = n, n = !0);
    let e = this.remember("_ResizeHandler");
    return e || (n.prototype instanceof Tn ? (e = new n(this), n = !0) : e = new Tn(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
  }
});
function ce(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const a = s.a * t + s.c * e + s.e, r = s.b * t + s.d * e + s.f, l = o.a * o.d - o.b * o.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = o.d / l, h = -o.b / l, d = -o.c / l, u = o.a / l, f = (o.c * o.f - o.d * o.e) / l, g = (o.b * o.e - o.a * o.f) / l, p = c * a + d * r + f, m = h * a + u * r + g;
    return [p, m];
  } catch {
    return [t, e];
  }
}
function _r(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const a = o.a * t + o.c * e + o.e, r = o.b * t + o.d * e + o.f, l = s.a * s.d - s.b * s.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const c = s.d / l, h = -s.b / l, d = -s.c / l, u = s.a / l, f = (s.c * s.f - s.d * s.e) / l, g = (s.b * s.e - s.a * s.f) / l, p = c * a + d * r + f, m = h * a + u * r + g;
    return [p, m];
  } catch {
    return [t, e];
  }
}
function kn(n) {
  const t = n.bbox();
  return ce(n, t.cx, t.cy);
}
function Mn(n, t) {
  const e = n.bbox(), [i, s] = _r(n, t[0], t[1]), o = e.cx, a = e.cy, r = i - o, l = s - a, c = Math.sqrt(r * r + l * l);
  if (c === 0)
    return ce(n, o, a);
  const h = r / c, d = l / c;
  let u;
  if (n.type === "circle") {
    const p = parseFloat(n.attr("r")) || 0;
    u = [o + p * h, a + p * d];
  } else if (n.type === "ellipse") {
    const p = parseFloat(n.attr("rx")) || 0, m = parseFloat(n.attr("ry")) || 0, y = Math.atan2(d, h);
    u = [
      o + p * Math.cos(y),
      a + m * Math.sin(y)
    ];
  } else {
    const p = e.x, m = e.x + e.width, y = e.y, b = e.y + e.height, _ = [];
    if (h !== 0) {
      const w = (p - o) / h, x = a + w * d;
      x >= y && x <= b && w > 0 && _.push([p, x, w]);
    }
    if (h !== 0) {
      const w = (m - o) / h, x = a + w * d;
      x >= y && x <= b && w > 0 && _.push([m, x, w]);
    }
    if (d !== 0) {
      const w = (y - a) / d, x = o + w * h;
      x >= p && x <= m && w > 0 && _.push([x, y, w]);
    }
    if (d !== 0) {
      const w = (b - a) / d, x = o + w * h;
      x >= p && x <= m && w > 0 && _.push([x, b, w]);
    }
    _.length > 0 ? (_.sort(function(w, x) {
      return w[2] - x[2];
    }), u = [_[0][0], _[0][1]]) : u = [o, a];
  }
  const [f, g] = ce(n, u[0], u[1]);
  return isNaN(f) || isNaN(g) || !isFinite(f) || !isFinite(g) ? ce(n, o, a) : [f, g];
}
function cn(n) {
  const t = {};
  if (!n.source || !n.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = kn(n.source), i = kn(n.target);
  if (n.sourceAttach === "center")
    t.point1 = e;
  else if (t.point1 = Mn(n.source, i), n.markerSourceType && n.markerSourceType !== "null") {
    const l = Math.max(12, n.strokeWidth * 3 + 6) * 0.8, c = t.point1[0] - e[0], h = t.point1[1] - e[1], d = Math.sqrt(c * c + h * h);
    d > 0 && (t.point1[0] += c / d * l, t.point1[1] += h / d * l);
  }
  if (n.targetAttach === "center")
    t.point2 = i;
  else if (t.point2 = Mn(n.target, e), n.markerTargetType && n.markerTargetType !== "null") {
    const l = Math.max(12, n.strokeWidth * 3 + 6) * 0.8, c = t.point2[0] - i[0], h = t.point2[1] - i[1], d = Math.sqrt(c * c + h * h);
    d > 0 && (t.point2[0] += c / d * l, t.point2[1] += h / d * l);
  }
  const s = t.point1, o = t.point2;
  let a;
  if (n.type === "curved") {
    const r = o[0] - s[0], l = o[1] - s[1], c = Math.sqrt(r * r + l * l);
    if (c < 1)
      return [["M", s[0], s[1]], ["L", o[0], o[1]]];
    const h = Math.min(c / 3, n.curveRadius * 1.5), d = -l / c, u = r / c, f = [
      e[0] - s[0],
      e[1] - s[1]
    ], g = [
      i[0] - o[0],
      i[1] - o[1]
    ];
    let p = 1;
    const m = f[0] * u - f[1] * d, y = g[0] * u - g[1] * d;
    m * y < 0 ? p = y > 0 ? 1 : -1 : p = m > 0 ? -1 : 1;
    const b = [
      d * h * p,
      u * h * p
    ], _ = [
      s[0] + r * 0.3 + b[0] * 0.7,
      s[1] + l * 0.3 + b[1] * 0.7
    ], w = [
      s[0] + r * 0.7 + b[0] * 0.7,
      s[1] + l * 0.7 + b[1] * 0.7
    ];
    a = [
      ["M", s[0], s[1]],
      ["C", _[0], _[1], w[0], w[1], o[0], o[1]]
    ];
  } else if (n.type === "orthogonal") {
    const r = o[0] - s[0], l = o[1] - s[1], c = s[0] < e[0], h = s[1] < e[1], d = o[0] < i[0], u = o[1] < i[1];
    let f, g;
    if (Math.abs(r) > Math.abs(l))
      if (c && d || !c && !d) {
        const p = Math.max(n.curveRadius, Math.abs(l) / 2);
        g = s[1] + (l > 0 ? -p : p), a = [
          ["M", s[0], s[1]],
          ["L", s[0], g],
          ["L", o[0], g],
          ["L", o[0], o[1]]
        ];
      } else
        f = s[0] + r / 2, a = [
          ["M", s[0], s[1]],
          ["L", f, s[1]],
          ["L", f, o[1]],
          ["L", o[0], o[1]]
        ];
    else if (h && u || !h && !u) {
      const p = Math.max(n.curveRadius, Math.abs(r) / 2);
      f = s[0] + (r > 0 ? -p : p), a = [
        ["M", s[0], s[1]],
        ["L", f, s[1]],
        ["L", f, o[1]],
        ["L", o[0], o[1]]
      ];
    } else
      g = s[1] + l / 2, a = [
        ["M", s[0], s[1]],
        ["L", s[0], g],
        ["L", o[0], g],
        ["L", o[0], o[1]]
      ];
  } else
    a = [
      ["M", s[0], s[1]],
      ["L", o[0], o[1]]
    ];
  return a;
}
function Dn(n, t, e, i, s, o) {
  if (!n || n === "null") return null;
  const r = Math.max(12, i * 3 + 6), l = r, c = r * 0.8, h = (e ? "source-" : "target-") + "triangle-" + Math.random().toString(16).substr(2, 8), d = s.defs().marker(l, c);
  d.attr({
    id: h,
    viewBox: "0 0 " + l + " " + c,
    refX: e ? l : "0",
    // Source arrow tip at right, target arrow tip at left
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
    size: r
  };
}
function pe(n, t, e, i) {
  return i && (n.markers = i), n.markerSource && (n.markerSource.element.remove(), n.connector.attr("marker-start", null)), n.markerTarget && (n.markerTarget.element.remove(), n.connector.attr("marker-end", null)), t && t !== "null" ? (n.markerSource = Dn(
    t,
    0,
    !0,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-start", "url(#" + n.markerSource.id + ")")) : n.markerSource = null, e && e !== "null" ? (n.markerTarget = Dn(
    e,
    0,
    !1,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-end", "url(#" + n.markerTarget.id + ")")) : n.markerTarget = null, n;
}
function Er(n, t, e) {
  return n.markerSourceType = t || "null", n.markerTargetType = e || "null", pe(n, n.markerSourceType, n.markerTargetType), n;
}
function Cr(n, t) {
  return n.strokeWidth = t || 2, n.connector.attr("stroke-width", n.strokeWidth), pe(n, n.markerSourceType, n.markerTargetType), n;
}
function Nn(n, t) {
  n.color = t, n.connector.stroke(t).attr("stroke-width", n.strokeWidth), n.markerSource && n.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), n.markerTarget && n.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
function Sr(n, t) {
  return n && typeof n[t] == "function";
}
function Rn(n, t, e) {
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
  return Tr(n, s), s;
}
function Tr(n, t) {
  let e = null;
  if (!Sr(t.element, "draggable")) {
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
    t.element.front(), kr(n, t);
  }).on("dragmove", function(i) {
    const s = [t.element.cx(), t.element.cy()];
    t.position = s, Mr(n, t, s);
    const o = i.detail.event;
    e = Rr(n, o, t), zr(e);
  }).on("dragend", function(i) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (n.debugMode && pi(n.container), e)
      zn(n, t, e), gi();
    else {
      const s = [t.element.cx(), t.element.cy()], o = Or(n, s);
      t.isSource ? n._sourcePhantomRect = o : n._targetPhantomRect = o, zn(n, t, o);
    }
    e = null;
  });
}
function kr(n, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? n.source : n.target), t.originalType || (t.originalType = n.type);
  const e = t.isSource ? n.source : n.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = null : n.target = null;
}
function Mr(n, t, e) {
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
  }, o = n.source, a = n.target, r = n.type;
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
    const l = cn(n);
    n.connector.plot(l), n.hitArea.plot(l);
  } finally {
    n.source = o, n.target = a, n.type = r;
  }
}
function Dr(n, t, e = !1) {
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
    const a = i.d / o, r = -i.b / o, l = -i.c / o, c = i.a / o, h = (i.c * i.f - i.d * i.e) / o, d = (i.b * i.e - i.a * i.f) / o, u = a * t[0] + l * t[1] + h, f = r * t[0] + c * t[1] + d;
    e && console.log("Local coordinates:", { localX: u, localY: f });
    let g = !1;
    if (n.type === "circle") {
      const p = parseFloat(n.attr("cx")) || s.cx, m = parseFloat(n.attr("cy")) || s.cy, y = parseFloat(n.attr("r")) || 0, b = u - p, _ = f - m;
      g = b * b + _ * _ <= y * y, e && console.log("Circle test:", {
        cx: p,
        cy: m,
        r: y,
        dx: b,
        dy: _,
        distance: Math.sqrt(b * b + _ * _),
        result: g
      });
    } else if (n.type === "ellipse") {
      const p = parseFloat(n.attr("cx")) || s.cx, m = parseFloat(n.attr("cy")) || s.cy, y = parseFloat(n.attr("rx")) || 0, b = parseFloat(n.attr("ry")) || 0, _ = u - p, w = f - m;
      g = _ * _ / (y * y) + w * w / (b * b) <= 1, e && console.log("Ellipse test:", { cx: p, cy: m, rx: y, ry: b, dx: _, dy: w, result: g });
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
function Nr(n, t) {
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
    let a, r;
    try {
      a = i.a * e.cx + i.c * e.cy + i.e, r = i.b * e.cx + i.d * e.cy + i.f;
    } catch {
      a = e.cx, r = e.cy;
    }
    return s.circle(4).attr({
      cx: a,
      cy: r,
      fill: "#ff0000"
    }), s;
  } catch (e) {
    return console.warn("Error creating hit zone visualization:", e), null;
  }
}
function pi(n) {
  try {
    n.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function Rr(n, t, e) {
  const i = n.debugMode || !1;
  i && pi(n.container);
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
      const w = u.node.classList;
      if (w && (w.contains("svg_select_boundingRect") || w.contains("svg_select_points") || w.contains("svg_select_selector") || w.contains("svg_resize_rotationPoint") || w.contains("svg_resize_handle") || w.contains("svg_resize_point") || w.contains("svg_draggable_handle") || w.contains("plugin-ui") || w.contains("ui-element")))
        return !1;
    }
    const g = u.bbox();
    if (g.width < 10 || g.height < 10)
      return !1;
    try {
      const x = window.getComputedStyle(u.node).cursor;
      if (x === "move" || x === "nw-resize" || x === "ne-resize" || x === "sw-resize" || x === "se-resize" || x === "ew-resize" || x === "ns-resize" || x === "crosshair")
        return !1;
    } catch {
    }
    const p = u.node.dataset;
    if (p && (p.svgjs || p.plugin || p.handle || p.ui))
      return !1;
    let m = u.parent();
    for (; m && m.type !== "svg"; ) {
      if (m.hasClass) {
        const x = m.node.classList;
        if (x && (x.contains("svg_select_group") || x.contains("svg_resize_group") || x.contains("plugin-ui-group")))
          return !1;
      }
      const w = m.attr("id");
      if (w && (w.includes("_select_") || w.includes("_resize_") || w.includes("plugin")))
        return !1;
      m = m.parent();
    }
    const y = u.attr("id");
    if (y && (y.includes("_select_") || y.includes("_resize_") || y.includes("_handle_") || y.includes("_rotation_") || y.includes("plugin") || y.startsWith("svg_")))
      return !1;
    const b = u.attr("fill"), _ = u.attr("stroke");
    return !(!b && !_ || (b === "transparent" || b === "none") && (!_ || _ === "none" || _ === "transparent"));
  }
  const a = n.container.root(), r = a.node.getBoundingClientRect(), l = t.clientX - r.left, c = t.clientY - r.top;
  i && console.log("Drop target search at:", { svgX: l, svgY: c });
  const h = s(a);
  i && (console.log("Found target shapes:", h.length), h.forEach((u, f) => {
    console.log(`Target shape ${f}:`, {
      type: u.type,
      id: u.attr("id"),
      classes: u.node.classList ? Array.from(u.node.classList) : [],
      fill: u.attr("fill"),
      stroke: u.attr("stroke"),
      bbox: u.bbox(),
      isValid: Ne(n, u, e)
    });
  }), h.forEach((u) => {
    Ne(n, u, e) && Nr(u, n.container);
  }));
  const d = [];
  return h.forEach(function(u) {
    if (Ne(n, u, e))
      try {
        if (Dr(u, [l, c], i)) {
          let g, p;
          try {
            const y = u.bbox(), b = u.node.getCTM();
            g = b.a * y.cx + b.c * y.cy + b.e, p = b.b * y.cx + b.d * y.cy + b.f;
          } catch {
            const b = u.bbox();
            g = b.cx, p = b.cy;
          }
          const m = Math.sqrt(
            Math.pow(l - g, 2) + Math.pow(c - p, 2)
          );
          i && console.log("Found candidate:", {
            element: u.type,
            distance: m
          }), d.push({ element: u, distance: m });
        }
      } catch (f) {
        console.warn("Error checking element for drop target:", f);
      }
  }), d.length > 0 ? (d.sort(function(u, f) {
    return u.distance - f.distance;
  }), i && console.log("Selected closest candidate:", d[0]), d[0].element) : (i && console.log("No drop target found"), null);
}
function Ne(n, t, e) {
  const i = e.isSource ? n.source : n.target;
  if (t === i || t.attr("connectortype") || t.hasClass && t.hasClass("connector-handle") || t._isPhantomRect) return !1;
  const s = e.isSource ? n.target : n.source;
  return t !== s;
}
function zn(n, t, e) {
  const i = t.isSource ? n.source : n.target;
  if (i && i._isPhantomRect && (i.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = e : n.target = e, t.isDetached = !1, !i || i !== e) {
    let s;
    t.isSource ? s = function(r) {
      n.update();
    } : s = function(r) {
      n.update();
    };
    const o = t.isSource ? "_sourceUpdateFunction" : "_targetUpdateFunction", a = n[o];
    if (a && i && (i.off("dragmove", a), i.off("beforedrag", a), i.off("dragstart", a), i.off("dragend", a), i.off("resize", a), i.off("rotate", a), i.off("transform", a)), t.isSource) {
      if (i && i.cons) {
        const r = i.cons.indexOf(n);
        r > -1 && i.cons.splice(r, 1);
      }
      e.cons = e.cons || [], e.cons.indexOf(n) === -1 && e.cons.push(n);
    } else {
      if (i && i.targetCons) {
        const r = i.targetCons.indexOf(n);
        r > -1 && i.targetCons.splice(r, 1);
      }
      e.targetCons = e.targetCons || [], e.targetCons.indexOf(n) === -1 && e.targetCons.push(n);
    }
    n[o] = s, e.on("dragmove", s), e.on("beforedrag", s), e.on("dragstart", s), e.on("dragend", s), e.on("resize", s), e.on("rotate", s), e.on("transform", s);
  }
  if (n.update(), n.source && n.target) {
    const s = cn(n);
    if (s && s.length >= 2) {
      let o;
      if (t.isSource)
        o = [s[0][1], s[0][2]];
      else {
        const a = s[s.length - 1];
        o = [
          a[a.length - 2],
          a[a.length - 1]
        ];
      }
      t.position = o, t.element.center(o[0], o[1]);
    }
  }
}
let F = null;
function zr(n) {
  if (n !== F)
    if (gi(), n) {
      F = n, n._originalStroke = n.attr("stroke"), n._originalStrokeWidth = n.attr("stroke-width"), n._originalStrokeDasharray = n.attr("stroke-dasharray"), n._originalStrokeOpacity = n.attr("stroke-opacity"), n.attr({
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
      F = null;
}
function gi() {
  if (F && F._originalStroke !== void 0) {
    F.attr({
      stroke: F._originalStroke,
      "stroke-width": F._originalStrokeWidth,
      "stroke-dasharray": F._originalStrokeDasharray,
      "stroke-opacity": F._originalStrokeOpacity
    });
    try {
      const n = F.node.style;
      n.animation = "", n.strokeDashoffset = "";
    } catch {
    }
    delete F._originalStroke, delete F._originalStrokeWidth, delete F._originalStrokeDasharray, delete F._originalStrokeOpacity;
  }
  F = null;
}
function On(n, t) {
  if (!n.showHandles || !t || t.length < 2) {
    n.sourceHandle && (n.sourceHandle.element.remove(), n.sourceHandle = null), n.targetHandle && (n.targetHandle.element.remove(), n.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], i = t[t.length - 1], s = [i[i.length - 2], i[i.length - 1]];
  n.sourceHandle ? (n.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), n.sourceHandle.position = e) : n.sourceHandle = Rn(n, !0, e), n.targetHandle ? (n.targetHandle.element.attr({
    cx: s[0],
    cy: s[1]
  }), n.targetHandle.position = s) : n.targetHandle = Rn(n, !1, s);
}
function Or(n, t) {
  const e = n.container.rect(20, 20).attr({
    x: t[0] - 10,
    y: t[1] - 10,
    fill: "transparent",
    stroke: "none",
    "pointer-events": "none"
  }).addClass("connector-phantom-rect");
  return e._isPhantomRect = !0, e;
}
function rt(n, t) {
  return n && typeof n[t] == "function";
}
function mi(n, t) {
  t.current && t.current !== n && ve(t.current), t.current = n, n.isSelected = !0, n.showHandles = !0, n.update();
}
function ve(n) {
  n.isSelected = !1, n.showHandles = !1, n.update();
}
function yi(n, t) {
  n.isSelected ? (ve(n), t.current === n && (t.current = null)) : mi(n, t);
}
function Ar(n, t) {
  let e = null;
  const i = 5;
  function s(a) {
    e = { x: a.clientX, y: a.clientY };
  }
  function o(a) {
    if (!e) return;
    const r = a.clientX - e.x, l = a.clientY - e.y;
    Math.sqrt(r * r + l * l) < i && (a.stopPropagation(), yi(n, t)), e = null;
  }
  n.hitArea.on("mousedown", s), n.hitArea.on("mouseup", o), n.connector.on("mousedown", s), n.connector.on("mouseup", o), n.container.data("connector-click-handler") || (n.container.data("connector-click-handler", !0), n.container.click(function(a) {
    a.target === n.container.node && t.current && (ve(t.current), t.current = null);
  }));
}
function Ir(n, t, e) {
  n[t + "Attach"] = e, n.update();
}
function Pr(n, t) {
  return n.showHandles = t, n.update(), n;
}
function Br(n) {
  return {
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle
  };
}
function Gr(n, t) {
  return n.clickAreaWidth = Math.max(6, t || 12), n.hitArea.attr("stroke-width", n.clickAreaWidth), n;
}
function Lr(n, t) {
  t && (n.connector.remove(), t == "default" ? (n.connector = n.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), n.connector.stroke(n.color).attr("stroke-width", n.strokeWidth)) : n.connector = t, n.update());
}
function Hr(n, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && n.type != t && (n.type = t, n.update());
}
function bi(n, t) {
  return n.debugMode = t, n.hitArea.attr({
    stroke: n.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": n.debugMode ? 0.5 : 0.01
  }), n;
}
function Ur(n) {
  return bi(n, !n.debugMode);
}
function wi(n, t) {
  return t = t || {}, rt(n.source, "select") ? n.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), rt(n.target, "select") ? n.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), n;
}
function vi(n, t) {
  return rt(n.source, "draggable") ? n.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), rt(n.target, "draggable") ? n.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), n;
}
function xi(n, t) {
  return t = t || {}, rt(n.source, "resize") ? n.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), rt(n.target, "resize") ? n.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), n;
}
function Zr(n, t, e, i, s) {
  return t = t || {}, i = i || {}, rt(n.source, "draggable") && rt(n.target, "draggable"), rt(n.source, "select") && rt(n.target, "select"), rt(n.source, "resize") && rt(n.target, "resize"), vi(n), wi(n, t), xi(n, i), n;
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
let Wt = null, Re = null;
const Vt = { current: null };
function Fr(n, t) {
  const e = {};
  t === void 0 && (t = n, n = {}), Wt = n.container || this.parent() || Wt;
  const i = this;
  if (Re = n.markers || this.parent() || Re, e.container = Wt, e.source = i, e.target = t, e.type = n.type || "straight", e.strokeWidth = n.strokeWidth || 2, e.color = n.color || "#000000", e.clickAreaWidth = n.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = n.debugMode || !1, n.connector) {
    const r = we.find(
      "#" + n.connector.node.getAttribute("href").slice(1)
    )[0];
    if (r && r.type == "path") {
      e.connector = n.connector;
      const l = r.array();
      if (!(l[1] && l[1][0] == "M") || !(l[2] && l[2][0] == "M")) {
        const c = r.bbox();
        l.splice(
          0,
          0,
          ["M", c.x + c.width / 2, c.y],
          ["M", c.x + c.width / 2, c.y + c.height]
        ), r.plot(l);
      }
      e.connector.target = r;
    }
  }
  e.connector || (e.connector = Wt.path().attr("connectortype", "default").fill("none").stroke(e.color).attr("stroke-width", e.strokeWidth)), e.hitArea = Wt.path().attr({
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
  e.hitArea.back(), e.sourceAttach = n.sourceAttach || "perifery", e.targetAttach = n.targetAttach || "perifery", e.curveRadius = n.curveRadius || 20, e.markerSourceType = n.markerSource || "null", e.markerTargetType = n.markerTarget || n.marker || "default", e.showHandles = n.showHandles || !1, e.handleRadius = n.handleRadius || 6, e.handleStrokeWidth = n.handleStrokeWidth || 2, e.handleStroke = n.handleStroke || "#007cff", e.handleFill = n.handleFill || "none", e.isSelected = !1, e.computeConnectorCoordinates = function(r) {
    return cn(r || e);
  }, i.cons = i.cons || [], i.cons.push(e), t.targetCons = t.targetCons || [], t.targetCons.push(e), e.update = function() {
    if (e.connector.attr("connectortype") == "default") {
      const r = e.computeConnectorCoordinates(e);
      let l = !0;
      for (let c = 0; c < r.length; c++)
        for (let h = 1; h < r[c].length; h++)
          (isNaN(r[c][h]) || !isFinite(r[c][h])) && (console.error(
            "Invalid coordinate in path data:",
            r[c][h],
            "at",
            [c, h]
          ), l = !1);
      l ? (e.connector.plot(r), e.hitArea.plot(r), On(e, r)) : console.error("Skipping plot due to invalid path data");
    }
  }, pe(e, e.markerSourceType, e.markerTargetType, Re), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(r, l, c) {
    return pe(e, r, l, c);
  }, e.setMarkerSettings = function(r, l) {
    return Er(e, r, l);
  }, e.setStrokeWidth = function(r) {
    return Cr(e, r);
  }, e.setConnectorColor = function(r) {
    return Nn(e, r), e;
  }, e.updateHandles = function(r) {
    On(e, r);
  }, e.selectConnector = function() {
    mi(e, Vt);
  }, e.deselectConnector = function() {
    ve(e), Vt.current === e && (Vt.current = null);
  }, e.toggleSelection = function() {
    yi(e, Vt);
  }, e.setConnectorAttachment = function(r, l) {
    Ir(e, r, l);
  }, e.setHandleVisibility = function(r) {
    return Pr(e, r);
  }, e.getHandles = function() {
    return Br(e);
  }, e.setClickAreaWidth = function(r) {
    return Gr(e, r);
  }, e.setConnector = function(r) {
    Lr(e, r);
  }, e.setType = function(r) {
    Hr(e, r);
  }, e.setDebugMode = function(r) {
    return bi(e, r);
  }, e.toggleDebugMode = function() {
    return Ur(e);
  }, e.makeSelectable = function(r) {
    return wi(e, r);
  }, e.makeDraggable = function(r) {
    return vi(e);
  }, e.makeResizable = function(r) {
    return xi(e, r);
  }, e.makeInteractive = function(r, l, c) {
    return Zr(e, r, l, c);
  }, Ar(e, Vt), e.update();
  function s(r) {
    e.update();
  }
  function o(r) {
    e.update();
  }
  function a(r) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = a, i.on("dragmove", o), t.on("dragmove", a), i.on("beforedrag", o), i.on("dragstart", o), i.on("dragend", o), t.on("beforedrag", a), t.on("dragstart", a), t.on("dragend", a), i.on("resize", o), t.on("resize", a), i.on("rotate", o), t.on("rotate", a), i.on("transform", o), t.on("transform", a), e.updateConnector = s, Nn(e, e.color), e;
}
T($, {
  connectable: Fr,
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
class _i {
  constructor(t, e = {}) {
    this.isActive = !1, this.node = t, this.target = t.backgroundRect, this.options = {
      resizeEnabled: !0,
      rotateEnabled: !0,
      preserveAspectRatio: !1,
      aroundCenter: !1,
      grid: 0,
      degree: 0,
      ...e
    };
  }
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
        }), this.widenHandleHitAreas(), this.addEventListeners(), this.isActive = !0;
      } catch (t) {
        console.warn("Failed to enable resize/rotate:", t);
      }
    }
  }
  /**
   * Make the L-shaped polyline handles easier to grab by setting a wider
   * stroke directly on the SVG elements (overrides CSS from svg.select.js).
   */
  widenHandleHitAreas() {
    requestAnimationFrame(() => {
      try {
        const t = this.target.node;
        (t.ownerSVGElement || t).querySelectorAll(".svg_select_handle").forEach((s) => {
          s.setAttribute("stroke-width", "8"), s.setAttribute("stroke", "#333"), s.style.pointerEvents = "all";
        });
      } catch (t) {
        console.warn("RESIZE_ROTATE_DEBUG: Failed to widen handle hit areas:", t);
      }
    });
  }
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
      this.isResizeRotateHandle(t.target) && this.node.isConnectionHandlesEnabled() && this.node.disableConnectionHandles();
    }), this.target.on("resize", (t) => {
      this.handleResize(t), this.options.onResize?.(t), this.node.slate && this.node.slate.getSelectedNodes().includes(this.node) && setTimeout(() => {
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
    this.target.off("resize"), this.target.off("mousedown.resizerotate touchstart.resizerotate");
  }
  handleResize(t) {
    if (t.detail && t.detail.box) {
      const e = t.detail.box;
      if (this.node.options.width = e.width, this.node.options.height = e.height, this.node.options.x = e.x, this.node.options.y = e.y, this.node.setSize(e.width, e.height), this.node.centerText(), t.detail && typeof t.detail.angle == "number") {
        const i = t.detail.angle;
        let s = 0;
        try {
          s = this.target.transform()?.rotate || 0;
        } catch (r) {
          console.warn("RESIZE_ROTATE_DEBUG: Failed to read backgroundRect rotation:", r);
        }
        let o = 0;
        try {
          o = this.node.svgGroup.transform()?.rotate || 0;
        } catch (r) {
          console.warn("RESIZE_ROTATE_DEBUG: Failed to read svgGroup rotation:", r);
        }
        const a = o + s;
        if (this.node.options.rotate || (this.node.options.rotate = { rotationAngle: 0 }), this.node.options.rotate.rotationAngle = a, this.node.textElement && typeof this.node.textElement.rotate == "function") {
          const r = this.target.bbox();
          this.node.textElement.rotate(i, r.cx, r.cy);
        } else if (this.node.nestedSvg && typeof this.node.nestedSvg.rotate == "function") {
          const r = this.target.bbox();
          this.node.nestedSvg.rotate(i, r.cx, r.cy);
        }
      }
    }
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, this.isActive && (this.disable(), this.enable());
  }
  refresh() {
    this.isActive && (this.disable(), this.enable());
  }
}
typeof window < "u" && (window.SVG = we);
class Ei {
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
      const s = this.node.svgGroup.connectable(
        {
          container: this.options.lineContainer,
          markers: this.options.markerContainer,
          type: this.options.type,
          color: this.options.color,
          strokeWidth: this.options.strokeWidth,
          sourceAttach: this.options.sourceAttach,
          targetAttach: this.options.targetAttach,
          markerSource: this.options.markerSource,
          markerTarget: this.options.markerTarget,
          showHandles: this.options.showHandles,
          curveRadius: this.options.curveRadius
        },
        t.svgGroup
      );
      if (!s)
        return console.error("CONNECTOR_DEBUG: Failed to create connectable object"), null;
      const o = {
        id: i,
        source: this.node,
        target: t,
        connectable: s,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      if (o.lineColor && s.setLineColor && s.setLineColor(o.lineColor), this.connections.set(i, o), t.connector) {
        const a = `${t.id}<-${this.node.id}`;
        t.connector.connections.set(a, o);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", i), this.options.onConnect?.(o), o;
    } catch (i) {
      return console.error("CONNECTOR_DEBUG: Failed to create connection:", i), console.error(
        "CONNECTOR_DEBUG: This might be due to SVG.js 3+ compatibility issues with svg.connectable.js"
      ), null;
    }
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
      if (console.log("CONNECTOR_DEBUG: Disconnecting", t), e.connectable && e.connectable.line && e.connectable.line.remove(), e.connectable && e.connectable.marker && e.connectable.marker.remove(), this.connections.delete(t), e.target && e.target.connector) {
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
      return i ? (Object.assign(i, e), e.lineColor && i.connectable && i.connectable.setLineColor(e.lineColor), console.log("CONNECTOR_DEBUG: Updated connection", t), !0) : (console.warn(
        "CONNECTOR_DEBUG: Connection not found for update:",
        t
      ), !1);
    } catch (i) {
      return console.error("CONNECTOR_DEBUG: Failed to update connection:", i), !1;
    }
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
function Ci(n, t, e) {
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
const Yr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultAssociation: Ci
}, Symbol.toStringTag, { value: "Module" }));
class Si {
  constructor(t, e = {}) {
    this.associations = /* @__PURE__ */ new Map(), this.isActive = !1, this.node = t, this.slate = t.slate, this.isActive = e.enabled ?? !0;
  }
  // ─── Association management ──────────────────────────────────────
  /**
   * Add an association from this node (parent) to a child node.
   * Creates the visual connection via the Connector system.
   */
  addAssociation(t, e) {
    const i = Ci(this.node.id, t.id, e);
    return this.associations.set(i.id, i), this.renderAssociation(i, t), console.log(
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
    const e = `${this.node.id}->${t}`;
    if (!this.associations.get(e))
      return console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        e
      ), !1;
    const s = this.slate.nodes.one(t);
    return s && this.node.connector && this.node.connector.disconnectFrom(s), this.associations.delete(e), console.log("RELATIONSHIP_DEBUG: Removed association", e), !0;
  }
  /**
   * Remove all associations from this node.
   */
  removeAll() {
    const t = Array.from(this.associations.keys());
    for (const e of t) {
      const i = this.associations.get(e);
      this.removeAssociation(i.childId);
    }
  }
  /**
   * Update all associations with new options (e.g., line color change).
   */
  updateAssociationsWith(t) {
    for (const [e, i] of this.associations)
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
    for (const [t, e] of this.associations)
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
    return Array.from(this.associations.values());
  }
  /** Get a specific association by child ID */
  getAssociation(t) {
    return this.associations.get(`${this.node.id}->${t}`);
  }
  /** Check if this node has any associations */
  hasAssociations() {
    return this.associations.size > 0;
  }
  /** Get count of associations */
  count() {
    return this.associations.size;
  }
  // ─── Serialization ───────────────────────────────────────────────
  /** Serialize all associations to JSON-compatible format */
  serialize() {
    return {
      associations: Array.from(this.associations.values())
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
  // ─── Private helpers ─────────────────────────────────────────────
  renderAssociation(t, e) {
    this.node.connector && (this.node.connector.isEnabled() || this.node.connector.enable(), this.node.connector.connectTo(e, {
      lineColor: t.lineColor,
      lineWidth: t.lineWidth
    }));
  }
}
class Ti {
  constructor(t) {
    this.patternElement = null, this.imageUrl = "", this.origWidth = 0, this.origHeight = 0, this.node = t;
  }
  /**
   * Set an image fill on the node's background.
   *
   * Uses SVG pattern fills for proper scaling within the shape.
   */
  set(t, e, i, s = !0) {
    this.imageUrl = t, this.origWidth = e || this.node.options.width || 100, this.origHeight = i || this.node.options.height || 60, this.node.options.image = t, this.node.options.imageOrigWidth = this.origWidth, this.node.options.imageOrigHeight = this.origHeight, this.render();
  }
  /**
   * Clear the image fill and restore the background color.
   */
  clear() {
    this.patternElement && (this.patternElement.remove(), this.patternElement = null), this.imageUrl = "", this.node.options.image = void 0, this.node.backgroundRect && this.node.backgroundRect.fill(
      this.node.options.backgroundColor || "#f0f0f0"
    );
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
          o.image(this.imageUrl).size(t, e).attr("preserveAspectRatio", "xMidYMid slice");
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
const Xe = /* @__PURE__ */ new Set(), $t = /* @__PURE__ */ new Map(), Xr = /* @__PURE__ */ new Set([
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
function hn(n) {
  const t = n.trim(), e = t.toLowerCase();
  if (Xr.has(e) || Xe.has(e))
    return Promise.resolve();
  if ($t.has(e))
    return $t.get(e);
  const i = new Promise((s, o) => {
    if (typeof document > "u") {
      s();
      return;
    }
    const a = t.split(",")[0].trim().replace(/['"]/g, ""), r = document.createElement("link");
    r.rel = "stylesheet", r.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      a
    )}:wght@300;400;500;600;700&display=swap`, r.onload = () => {
      Xe.add(e), $t.delete(e), console.log("FONT_DEBUG: Loaded font:", a), s();
    }, r.onerror = () => {
      $t.delete(e), console.warn("FONT_DEBUG: Failed to load font:", a), s();
    }, document.head.appendChild(r);
  });
  return $t.set(e, i), i;
}
async function ki(n) {
  const t = /* @__PURE__ */ new Set(), e = n.nodes?.allNodes || [];
  for (const s of e)
    s.options?.fontFamily && t.add(s.options.fontFamily);
  const i = Array.from(t).map((s) => hn(s));
  await Promise.all(i), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function jr(n) {
  return Xe.has(n.toLowerCase().trim());
}
const Wr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isFontLoaded: jr,
  loadAllFonts: ki,
  loadFont: hn
}, Symbol.toStringTag, { value: "Module" }));
class Mi {
  constructor(t) {
    this.node = t;
  }
  /**
   * Set text content and properties on the node.
   * This is the primary method used by collaboration events
   * and the text editing pane.
   */
  async set(t, e, i, s, o, a, r) {
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), s !== void 0 && (this.node.options.fontColor = s), o !== void 0 && (this.node.options.textOpacity = o), a !== void 0 && (this.node.options.textXAlign = a), r !== void 0 && (this.node.options.textYAlign = r), i !== void 0 && i !== this.node.options.fontFamily && (this.node.options.fontFamily = i, await hn(i)), this.applyText();
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
        const t = this.node.textElement.bbox(), e = 20, i = t.width + e * 2, s = t.height + e * 2, o = this.node.options.width || 100, a = this.node.options.height || 60;
        if (i > o || s > a) {
          const r = Math.max(o, i), l = Math.max(a, s);
          this.node.setSize(r, l);
        }
      } catch {
      }
  }
}
class Di {
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
    }, this.node.options.link = { ...this.linkData }, console.log("LINKS_DEBUG: Set link on", this.node.id, this.linkData), e && this.node.slate?.collab?.isCollabConnected() && this.node.slate.collab.send({
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
    this.linkData = null, this.node.options.link = void 0, console.log("LINKS_DEBUG: Removed link from", this.node.id), t && this.node.slate?.collab?.isCollabConnected() && this.node.slate.collab.send({
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
}
const pt = /* @__PURE__ */ new Map();
pt.set("dropShadow", {
  name: "dropShadow",
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
pt.set("blur", {
  name: "blur",
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
pt.set("outline", {
  name: "outline",
  apply: (n) => {
    try {
      n.stroke({ color: "#ff0000", width: 3 });
    } catch {
    }
  },
  remove: (n) => {
    try {
      n.stroke({ color: n.data("original-stroke") || "#ccc", width: 1 });
    } catch {
    }
  }
});
class Ni {
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
    const i = pt.get(t);
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
    const e = pt.get(t);
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
        const i = pt.get(e);
        i && (this.node.backgroundRect && i.remove(this.node.backgroundRect), this.node.textElement && i.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const i = pt.get(e);
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
}
function za(n) {
  pt.set(n.name, n);
}
function Oa() {
  return Array.from(pt.keys());
}
class Ri {
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
    this.isOpen = !0;
    const t = this.getVisibleTabs();
    this.slate.options.events?.onMenuRequested && this.slate.options.events.onMenuRequested(this.node, (e) => {
      this.isOpen = !1, console.log("MENU_DEBUG: Menu closed for", this.node.id);
    }), console.log(
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
}
const U = /* @__PURE__ */ new Map();
U.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
U.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
U.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
U.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
U.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
U.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
U.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
U.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
U.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
U.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
U.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
U.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
U.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
U.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
function je(n) {
  return U.get(n.toLowerCase());
}
function Vr(n) {
  return U.has(n.toLowerCase());
}
function $r(n, t) {
  U.set(n.toLowerCase(), t);
}
function qr() {
  return Array.from(U.keys());
}
function zi(n) {
  return ["rectangle", "circle", "ellipse"].includes(n.toLowerCase());
}
function Oi(n, t) {
  if (t) {
    const e = je(t);
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
    const e = je(n);
    if (e) return e;
  }
}
const Kr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getShape: je,
  getShapeNames: qr,
  hasShape: Vr,
  isNativeShape: zi,
  registerShape: $r,
  resolveShapePath: Oi
}, Symbol.toStringTag, { value: "Module" }));
class Ai {
  constructor(t, e) {
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.preDragTransform = null, this.preDragPosition = null, this._initFailed = !1, this.id = t.id || this.generateId(), this.slate = e, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: t }), this.options = {
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
      console.log("NODE_DEBUG: Got viewport for", this.id, t), this.svgGroup = t.group(), this.svgGroup.attr("data-node-id", this.id), console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup), this.finishCreate();
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
      const i = this.options.width, s = this.options.height, o = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(i, s).move(o, a), this.nestedSvg.svg(this.options.svgContent), setTimeout(() => {
        const r = this.nestedSvg.children()[0];
        if (r) {
          let l = r.bbox();
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
    if (this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new _i(this, e), this.connector = new Ei(this, this.options.connector), this.relationships = new Si(this), this.images = new Ti(this), this.editor = new Mi(this), this.links = new Di(this), this.filters = new Ni(this), this.menu = new Ri(this), this.options.image && this.images.set(
      this.options.image,
      this.options.imageOrigWidth,
      this.options.imageOrigHeight
    ), this.options.filters?.vect && this.filters.apply(this.options.filters.vect, "vect"), this.options.filters?.text && this.filters.apply(this.options.filters.text, "text"), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), this.options.rotate?.rotationAngle) {
      const i = this.options.rotate.rotationAngle;
      console.log(
        "NODE_DEBUG: Applying initial rotation",
        i,
        "to",
        this.id,
        "using transform with origin:center"
      ), this.svgGroup.transform({ rotate: i, origin: "center" });
    }
    console.log("NODE_DEBUG: finishCreate continuing for", this.id), this._resolveReady();
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
      borderStyle: a,
      borderOpacity: r,
      shape: l,
      vectorPath: c,
      opacity: h
    } = this.options, d = { color: s, width: o };
    a === "dashed" ? d.dasharray = "8,4" : a === "dotted" && (d.dasharray = "2,4"), r !== void 0 && (d.opacity = r);
    const u = Oi(l, c);
    if (u && !zi(l || "")) {
      const f = this.svgGroup.nested().size(t, e), g = f.path(u.path).fill(i).stroke(d);
      try {
        const p = g.bbox();
        p.width > 0 && p.height > 0 ? f.viewbox(p.x, p.y, p.width, p.height) : f.viewbox(u.viewBox);
      } catch {
        f.viewbox(u.viewBox);
      }
      h !== void 0 && g.opacity(h), this.backgroundRect = f;
    } else {
      switch (l) {
        case "circle": {
          const f = Math.min(t, e) / 2;
          this.backgroundRect = this.svgGroup.circle(f * 2).fill(i).stroke(d);
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
  centerText() {
    if (!this.textElement) return;
    const { width: t, height: e, textXAlign: i, textYAlign: s, textOffset: o } = this.options, a = this.backgroundRect.x?.() ?? 0, r = this.backgroundRect.y?.() ?? 0;
    let l = a + t / 2 + (o?.x || 0), c = r + e / 2 + (o?.y || 0);
    switch (i) {
      case "left":
        l = a + 5 + (o?.x || 0), this.textElement.attr("text-anchor", "start");
        break;
      case "right":
        l = a + t - 5 + (o?.x || 0), this.textElement.attr("text-anchor", "end");
        break;
      default:
        this.textElement.attr("text-anchor", "middle");
        break;
    }
    switch (s) {
      case "top":
        c = r + 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "hanging");
        break;
      case "bottom":
        c = r + e - 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "auto");
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
      }, console.log("DRAG_DEBUG: Stored pre-drag transform:", this.preDragTransform, "position:", this.preDragPosition), this.slate.disableNodeResizeRotate(this);
    }), this.svgGroup.on("dragend.node", (t) => {
      console.log("DRAG_DEBUG: Drag ended on", this.id);
      const e = t.detail?.box, i = e?.x ?? this.svgGroup.bbox().x, s = e?.y ?? this.svgGroup.bbox().y, a = this.svgGroup.transform().rotate || 0;
      console.log(
        "DRAG_DEBUG: Drag completed - new position from box:",
        i,
        s,
        "rotation:",
        a,
        "preDragPos:",
        this.preDragPosition
      ), this.preDragTransform = null, this.preDragPosition = null, this.options.x = i, this.options.y = s, setTimeout(() => {
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
    });
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
    ), this.options.x = t, this.options.y = e, o && o > 0 ? this.svgGroup.animate(o, s || "-").move(t, e).after(i || (() => {
    })) : this.svgGroup.move(t, e), console.log(
      "NODE_DEBUG: position completed for",
      this.id,
      "svgGroup bbox:",
      this.svgGroup ? this.svgGroup.bbox() : "no group"
    ), i && i();
  }
  toFront() {
    this.svgGroup.front();
  }
  toBack() {
    this.svgGroup.back();
  }
  remove() {
    this.connectionHandles.container && (this.connectionHandles.container.remove(), this.connectionHandles.container = void 0), this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview.container = void 0), this.svgGroup.remove();
  }
  hide() {
    this.svgGroup.hide();
  }
  show() {
    this.svgGroup.show();
  }
  setText(t) {
    this.textElement && (this.options.text = t, this.textElement.text(t), this.centerText());
  }
  setSize(t, e) {
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof oe)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof be) {
      const i = Math.min(t, e);
      this.backgroundRect.size(i, i), this.options.width = i, this.options.height = i;
    } else if (this.backgroundRect instanceof ne)
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
    this.centerText();
  }
  setColors(t, e) {
    t && (this.options.backgroundColor = t, this.backgroundRect.fill(t)), e && (this.options.borderColor = e, this.backgroundRect.stroke({ color: e }));
  }
  lock() {
    this.options.isLocked = !0, this.options.allowDrag = !1, this.svgGroup.draggable && this.svgGroup.draggable(!1), this.disableResizeRotate();
  }
  unlock() {
    this.options.isLocked = !1, this.options.allowDrag = !0, this.makeDraggable(), this.enableResizeRotate();
  }
  // Resize/Rotate functionality - managed by Slate
  enableResizeRotate() {
    console.log(
      "NODE_DEBUG: enableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    ), this.slate.enableNodeResizeRotate(this);
  }
  disableResizeRotate() {
    console.log(
      "NODE_DEBUG: disableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    ), this.slate.disableNodeResizeRotate(this);
  }
  enableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: !0 });
  }
  disableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: !1 });
  }
  enableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: !0 });
  }
  disableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: !1 });
  }
  isResizeRotateEnabled() {
    return this.resizeRotate.isEnabled();
  }
  setRotation(t) {
    this.options.rotate || (this.options.rotate = { rotationAngle: 0 }), this.options.rotate.rotationAngle = t;
    const e = this.svgGroup.transform();
    this.svgGroup.transform({
      rotate: t,
      origin: "center",
      // Preserve any existing translation
      translateX: e.translateX || 0,
      translateY: e.translateY || 0
    });
  }
  getRotation() {
    if (this.options.rotate?.rotationAngle !== void 0 && this.options.rotate.rotationAngle !== 0)
      return this.options.rotate.rotationAngle;
    try {
      const t = this.svgGroup.transform();
      if (t && typeof t.rotate < "u" && t.rotate !== 0)
        return t.rotate;
    } catch (t) {
      console.warn("NODE_DEBUG: Failed to read svgGroup transform for rotation:", t);
    }
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
  enableConnector() {
    this.connector.enable();
  }
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
  disableConnector() {
    this.connector.disable();
  }
  connectTo(t, e) {
    return this.connector.connectTo(t, e);
  }
  disconnectFrom(t) {
    return this.connector.disconnectFrom(t);
  }
  disconnectAll() {
    this.connector.disconnectAll();
  }
  getConnections() {
    return this.connector.getConnections();
  }
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
      const r = s[1].split(/\s+/).map(Number);
      if (r.length === 4)
        return {
          x: r[0],
          y: r[1],
          width: r[2],
          height: r[3]
        };
    }
    const o = t.match(/width=["']([^"']+)["']/), a = t.match(/height=["']([^"']+)["']/);
    if (o && a) {
      const r = parseInt(o[1]), l = parseInt(a[1]);
      if (!isNaN(r) && !isNaN(l))
        return { x: 0, y: 0, width: r, height: l };
    }
    return { x: 0, y: 0, width: 24, height: 24 };
  }
  // Selection Management
  setupSelectionBehavior() {
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
        ) <= e) {
          console.log(
            "SELECTION_DEBUG: Node clicked (position-based detection)",
            this.id
          );
          const a = i.ctrlKey || i.metaKey;
          this.slate.selectNodes([this], a);
        }
        t = null;
      }
    });
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
  onSelected() {
    console.log("SELECTION_DEBUG: Node selected", this.id);
  }
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
    Object.entries(o).forEach(([a, r]) => {
      if (!this.connectionHandles.container) return;
      const l = this.connectionHandles.container.circle(t * 2).fill(e).stroke({ color: i, width: s }).addClass(`connection-handle connection-handle-${a}`);
      l.node.style.cursor = "pointer", this.connectionHandles[a] = l, l.on(
        "mouseenter",
        () => this.showConnectionPreview(
          a
        )
      ), l.on("mouseleave", () => this.hideConnectionPreview()), l.on("click", (c) => {
        c.stopPropagation(), console.log(
          `CONNECTION_HANDLES_DEBUG: ${a} handle clicked on`,
          this.id
        ), this.createConnectedNode(
          a
        );
      });
    }), this.connectionHandles.container && this.connectionHandles.container.hide(), this.updateConnectionHandlePositions();
  }
  updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;
    const t = this.backgroundRect.bbox(), e = this.backgroundRect.screenCTM(), s = this.backgroundRect.root().screenCTM().inverseO().multiplyO(e), o = ([d, u], { a: f, b: g, c: p, d: m, e: y, f: b }) => [d * f + u * p + y, d * g + u * m + b], a = t.x + t.width / 2, r = t.y + t.height / 2, l = 35, c = 20, h = {
      top: [a, t.y - l],
      right: [t.x + t.width + c, r],
      bottom: [a, t.y + t.height + c],
      left: [t.x - c, r]
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
    const i = this.options.width, s = this.options.height, o = 75, a = this.getRotation(), r = this.backgroundRect.rbox(this.backgroundRect.root()), l = r.cx, c = r.cy, h = this.connectionHandles[t];
    if (!h) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const d = h.bbox(), u = {
      x: d.x + d.width / 2,
      y: d.y + d.height / 2
    }, f = u.x - l, g = u.y - c, p = Math.sqrt(f * f + g * g), m = f / p, y = g / p, b = this.backgroundRect.bbox(), _ = b.x + b.width / 2, w = b.y + b.height / 2, x = this.backgroundRect.screenCTM(), G = this.backgroundRect.root().screenCTM().inverseO().multiplyO(x), Z = G.inverse(), et = m * Z.a + y * Z.c, ct = m * Z.b + y * Z.d;
    let O, at;
    const nt = Math.abs(et);
    Math.abs(ct) > nt ? ct < 0 ? (O = _, at = b.y) : (O = _, at = b.y + b.height) : et < 0 ? (O = b.x, at = w) : (O = b.x + b.width, at = w);
    const Mt = ([j, K], { a: Rt, b: C, c: ut, d: ft, e: Ft, f: Yt }) => [j * Rt + K * ut + Ft, j * C + K * ft + Yt], [Dt, xt] = Mt([O, at], G), ht = Math.sqrt(
      Math.pow(Dt - l, 2) + Math.pow(xt - c, 2)
    ), dt = ht, _t = ht + o + dt, Nt = l + m * _t, X = c + y * _t, E = Nt - i / 2, N = X - s / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      E,
      N,
      i,
      s,
      a
      // Pass rotation angle to preview
    );
    const it = ht + o - p, st = {
      x: u.x + m * it,
      y: u.y + y * it
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(u.x, u.y, st.x, st.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      u,
      st
    );
  }
  createPreviewShape(t, e, i, s, o, a = 0) {
    let r;
    const l = this.options.backgroundColor || "#007cff", c = "#ffffff", h = 2, d = 0.6, u = e + s / 2, f = i + o / 2;
    switch (this.options.shape) {
      case "circle":
        const g = Math.min(s, o) / 2;
        r = t.circle(g * 2).center(u, f).fill(l).stroke({ color: c, width: h }).opacity(d), a !== 0 && r.rotate(a, u, f);
        break;
      case "ellipse":
        r = t.ellipse(s, o).center(u, f).fill(l).stroke({ color: c, width: h }).opacity(d), a !== 0 && r.rotate(a, u, f);
        break;
      default:
        if (this.options.svgContent) {
          r = t.rect(s, o).move(e, i).fill("none").stroke({ color: c, width: h }).opacity(d).radius(4);
          const p = t.nested().size(s, o).move(e, i);
          p.svg(this.options.svgContent), setTimeout(() => {
            const m = p.children()[0];
            if (m) {
              let y = m.bbox();
              (y.width <= 0 || y.height <= 0) && (y = this.calculatePathBounds(
                this.options.svgContent,
                s,
                o
              )), y.width > 0 && y.height > 0 && (p.viewbox(y.x, y.y, y.width, y.height), p.node.setAttribute(
                "preserveAspectRatio",
                "xMidYMid meet"
              )), m.fill(l).opacity(d);
            }
          }, 1), p.attr("pointer-events", "none"), a !== 0 && (r.rotate(a, u, f), p.rotate(a, u, f));
        } else
          r = t.rect(s, o).move(e, i).fill(l).stroke({ color: c, width: h }).opacity(d).radius(4), a !== 0 && r.rotate(a, u, f);
        break;
    }
    return r.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, i) {
    const s = i.x - e.x, o = i.y - e.y, a = Math.sqrt(s * s + o * o);
    if (a === 0) return;
    const r = s / a, l = o / a, c = 12, h = 6, d = i.x, u = i.y, f = d - r * c, g = u - l * c, p = -l * h, m = r * h, y = [
      [d, u],
      [f + p, g + m],
      [f - p, g - m],
      [d, u]
    ];
    t.polygon(y).fill("#007cff").opacity(0.8).attr("pointer-events", "none");
  }
  hideConnectionPreview() {
    this.connectionPreview?.container && (this.connectionPreview.container.remove(), this.connectionPreview = void 0);
  }
  enableConnectionHandles() {
    console.log(
      "CONNECTION_HANDLES_DEBUG: enableConnectionHandles called for",
      this.id
    ), this.showConnectionHandles();
  }
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
      const e = this.options.width, i = this.options.height, s = 75, o = this.getRotation(), a = o * Math.PI / 180;
      let r = 0, l = 0;
      switch (t) {
        case "top":
          r = 0, l = -1;
          break;
        case "right":
          r = 1, l = 0;
          break;
        case "bottom":
          r = 0, l = 1;
          break;
        case "left":
          r = -1, l = 0;
          break;
      }
      const c = r * Math.cos(a) - l * Math.sin(a), h = r * Math.sin(a) + l * Math.cos(a), d = this.backgroundRect.rbox(this.backgroundRect.root()), u = d.cx, f = d.cy, g = this.backgroundRect.bbox(), p = g.x + g.width / 2, m = g.y + g.height / 2;
      let y, b;
      switch (t) {
        case "top":
          y = p, b = g.y;
          break;
        case "right":
          y = g.x + g.width, b = m;
          break;
        case "bottom":
          y = p, b = g.y + g.height;
          break;
        case "left":
          y = g.x, b = m;
          break;
      }
      const _ = this.backgroundRect.screenCTM(), x = this.backgroundRect.root().screenCTM().inverseO().multiplyO(_), L = ([ht, dt], { a: _t, b: Nt, c: X, d: E, e: N, f: H }) => [ht * _t + dt * X + N, ht * Nt + dt * E + H], [G, Z] = L([y, b], x), et = Math.sqrt(
        Math.pow(G - u, 2) + Math.pow(Z - f, 2)
      ), ct = et, O = et + s + ct, at = u + c * O, nt = f + h * O, vt = at - e / 2, Mt = nt - i / 2, Dt = this.cloneNodeOptions(vt, Mt, o), xt = this.slate.addNode(Dt);
      if (!xt) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        xt.id,
        "at",
        vt,
        Mt
      ), this.hideConnectionPreview(), setTimeout(() => {
        this.connectToNode(xt);
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
    if (!this.connector) {
      console.warn("CONNECTION_HANDLES_DEBUG: Connector not initialized for", this.id);
      return;
    }
    this.connector.isEnabled() || (console.log("CONNECTION_HANDLES_DEBUG: Enabling connector for", this.id), this.connector.enable()), console.log(
      "CONNECTION_HANDLES_DEBUG: Connecting",
      this.id,
      "to",
      t.id
    );
    const e = this.connector.connectTo(t);
    e ? console.log(
      "CONNECTION_HANDLES_DEBUG: Successfully created connection",
      e.id
    ) : console.error("CONNECTION_HANDLES_DEBUG: Failed to create connection");
  }
}
class Qr {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Ai(t, this.slate);
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
    t.data && Array.isArray(t.data.nodes) && t.data.nodes.forEach((i) => {
      const s = this.one(i.id);
      if (s) {
        const o = e.animate ? t.data.dur || 500 : 0;
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
class Jr {
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
      Array.isArray(e) || (e = [e]), e.forEach((i) => {
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
      const e = this.slate.options.containerStyle.prevBackgroundColor || "#fff";
      this.slate.options.containerStyle.backgroundColor = e, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
    }
  }
  onSlateBackgroundColorChanged(t) {
    this.slate.options.containerStyle.backgroundColor = t.data.color, this.slate.options.containerStyle.backgroundColorAsGradient = t.data.asGradient, this.slate.options.containerStyle.backgroundGradientType = t.data.gradientType, this.slate.options.containerStyle.backgroundGradientColors = t.data.gradientColors, this.slate.options.containerStyle.backgroundGradientStrategy = t.data.gradientStrategy, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
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
class Ii {
  constructor(t, e = {}) {
    this.isEnabled = !1, this.controlsContainer = null, this.slate = t, this.canvas = t.canvas, this.options = {
      enabled: !0,
      panning: !0,
      pinchZoom: !0,
      wheelZoom: !0,
      // Enable wheel zoom for Ctrl+scroll
      panButton: 0,
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
      }), this.isEnabled = !0, this.options.onPanStart && this.canvas.on("panStart", this.options.onPanStart), this.options.onPan && this.canvas.on("panning", this.options.onPan), this.options.onPanEnd && this.canvas.on("panEnd", this.options.onPanEnd), this.options.onZoom && this.canvas.on("zoom", this.options.onZoom), this.options.showControls && this.createZoomControls(), console.log("PanZoom initialized successfully with svg.panzoom.js");
    } catch (t) {
      console.warn("Failed to initialize pan/zoom:", t);
    }
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
  zoomIn() {
    if (this.isEnabled) {
      const t = this.getZoom();
      this.canvas.zoom(t * 1.25);
    }
  }
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
    this.isEnabled && (this.canvas.zoom(1), this.canvas.viewbox(0, 0, this.canvas.width(), this.canvas.height()));
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
    for (const _ of t) {
      const w = _.options.x ?? 0, x = _.options.y ?? 0, L = _.options.width ?? 100, G = _.options.height ?? 60;
      e = Math.min(e, w), i = Math.min(i, x), s = Math.max(s, w + L), o = Math.max(o, x + G);
    }
    if (!isFinite(e)) return;
    const a = s - e, r = o - i, l = 50, c = a + l * 2, h = r + l * 2, d = this.canvas.node.clientWidth || this.canvas.width(), u = this.canvas.node.clientHeight || this.canvas.height(), f = d / u, g = c / h;
    let p = c, m = h;
    g > f ? m = p / f : p = m * f;
    const y = e + a / 2, b = i + r / 2;
    this.canvas.viewbox(
      y - p / 2,
      b - m / 2,
      p,
      m
    );
  }
  center() {
    if (this.isEnabled) {
      const t = this.canvas.bbox(), e = this.canvas.viewbox(), i = t.cx - e.width / 2, s = t.cy - e.height / 2;
      this.canvas.viewbox(i, s, e.width, e.height);
    }
  }
  getZoom() {
    if (!this.isEnabled) return 1;
    try {
      return this.canvas.zoom() || 1;
    } catch {
      return 1;
    }
  }
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
    this.isEnabled && (this.canvas.panZoom(!1), this.canvas.off("panStart"), this.canvas.off("panning"), this.canvas.off("panEnd"), this.canvas.off("zoom"), this.removeZoomControls(), this.isEnabled = !1);
  }
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
class Pi {
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
    const e = t.getZoom() || 1, i = t.getPan() || { x: 0, y: 0 }, s = this.options.width || 200, o = this.options.height || 150, a = this.calculateContentBounds(), r = Math.max(a.maxX - a.minX, 1), l = Math.max(a.maxY - a.minY, 1), c = 100, h = r + c * 2, d = l + c * 2;
    this.scale = Math.min(
      s / h,
      o / d
    );
    const u = (this.slate.options.viewPort?.originalWidth || 800) / e, f = (this.slate.options.viewPort?.originalHeight || 600) / e, g = (i.x - a.minX + c) * this.scale, p = (i.y - a.minY + c) * this.scale, m = u * this.scale, y = f * this.scale;
    this.viewportIndicator.move(g, p), this.viewportIndicator.size(Math.max(m, 10), Math.max(y, 10));
  }
  updateNodePosition(t) {
    if (!this._enabled) return;
    const e = this.nodeShapes.get(t.id);
    if (!e) return;
    const i = this.calculateContentBounds(), s = 100, o = (t.options.x - i.minX + s) * this.scale, a = (t.options.y - i.minY + s) * this.scale;
    e.move(o, a);
  }
  addNodeShape(t) {
    if (!this._enabled || !this.miniCanvas) return;
    const e = this.calculateContentBounds(), i = 100, s = (t.options.x - e.minX + i) * this.scale, o = (t.options.y - e.minY + i) * this.scale, a = (t.options.width || 100) * this.scale, r = (t.options.height || 60) * this.scale;
    let l;
    if (t.options.shape === "circle") {
      const c = Math.min(a, r) / 2;
      l = this.miniCanvas.circle(c * 2).move(s, o);
    } else
      l = this.miniCanvas.rect(a, r).move(s, o);
    l.fill(t.options.backgroundColor || this.options.nodeColor), l.stroke({ width: 0 }), this.nodeShapes.set(t.id, l), this.viewportIndicator && this.viewportIndicator.front();
  }
  removeNodeShape(t) {
    const e = this.nodeShapes.get(t);
    e && (e.remove(), this.nodeShapes.delete(t));
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
    this.container && (this.miniCanvas = we().addTo(this.container).size(this.options.width, this.options.height), this.miniCanvas.rect(this.options.width, this.options.height).fill("#f8f9fa"));
  }
  renderNodes() {
    if (!this.miniCanvas) return;
    this.nodeShapes.forEach((l) => l.remove()), this.nodeShapes.clear();
    const t = this.calculateContentBounds(), e = 100, i = Math.max(t.maxX - t.minX, 1), s = Math.max(t.maxY - t.minY, 1), o = i + e * 2, a = s + e * 2;
    this.scale = Math.min(
      this.options.width / o,
      this.options.height / a
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
        const p = c + d / 2, m = h + u / 2;
        f.rotate(g, p, m);
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
    const a = this.calculateContentBounds(), r = 100, l = s / this.scale + a.minX - r, c = o / this.scale + a.minY - r;
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
    this.slate.canvas && this.slate.canvas.off?.(".birdseye"), this.refreshTimeoutId !== null && (window.clearTimeout(this.refreshTimeoutId), this.refreshTimeoutId = null), this.stopPolling();
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
      const l = this.slate.options.viewPort?.originalWidth || 800, c = this.slate.options.viewPort?.originalHeight || 600;
      return { minX: 0, minY: 0, maxX: l, maxY: c };
    }
    let e = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
    t.forEach((l) => {
      const c = l.options.x || 0, h = l.options.y || 0, d = l.options.width || 100, u = l.options.height || 60;
      e = Math.min(e, c), i = Math.min(i, h), s = Math.max(s, c + d), o = Math.max(o, h + u);
    });
    const a = this.slate.options.viewPort?.originalWidth || 800, r = this.slate.options.viewPort?.originalHeight || 600;
    return e = Math.min(e, 0), i = Math.min(i, 0), s = Math.max(s, a), o = Math.max(o, r), { minX: e, minY: i, maxX: s, maxY: o };
  }
}
function xe(n) {
  const t = { ...n };
  return n.xPos !== void 0 && t.x === void 0 && (t.x = n.xPos, delete t.xPos), n.yPos !== void 0 && t.y === void 0 && (t.y = n.yPos, delete t.yPos), n.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = n.foregroundColor, delete t.foregroundColor), n.shapeHint !== void 0 && t.shape === void 0 && (t.shape = ta(n.shapeHint), delete t.shapeHint), n.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = n.svgString, delete t.svgString), n.blnStraight !== void 0 && (t.isStraightLine = n.blnStraight, delete t.blnStraight), t;
}
function dn(n) {
  const t = { ...n };
  return t.xPos = n.x, t.yPos = n.y, t.foregroundColor = n.fontColor, n.shape && (t.shapeHint = n.shape), n.svgContent && (t.svgString = n.svgContent), t;
}
function Bi(n) {
  return { ...n };
}
function Gi(n) {
  return { ...n };
}
function un(n) {
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
    showChildArrow: n.showChildArrow ?? !0
  };
}
function fn(n) {
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
    showChildArrow: n.showChildArrow
  };
}
function ta(n) {
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
function ea(n) {
  const t = {
    options: Bi(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = xe(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => un(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
function na(n) {
  const t = {
    options: Gi(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = dn(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => fn(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
const ia = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  convertV1JsonToV2: ea,
  convertV2JsonToV1: na,
  v1AssociationToV2: un,
  v1NodeToV2: xe,
  v1SlateToV2: Bi,
  v2AssociationToV1: fn,
  v2NodeToV1: dn,
  v2SlateToV1: Gi
}, Symbol.toStringTag, { value: "Module" }));
function _e(n, t, e) {
  const s = (t || n.nodes.allNodes).map(
    (o) => Li(o)
  );
  return e && s.forEach((o, a) => {
    o.options._presentationIndex = a;
  }), {
    options: sa(n.options),
    nodes: s,
    shareId: n.options.shareId || ""
  };
}
async function pn(n, t, e = !1, i = !1) {
  const s = typeof n == "string" ? JSON.parse(n) : n;
  if (s.options) {
    const a = s.options;
    Object.assign(t.options, a), s.shareId && (t.options.shareId = s.shareId);
  }
  e || t.nodes.clear();
  const o = /* @__PURE__ */ new Map();
  if (Array.isArray(s.nodes)) {
    for (const r of s.nodes) {
      const l = Hi(r.options), c = t.nodes.one(l.id);
      if (c)
        Object.assign(c.options, l), l.x !== void 0 && l.y !== void 0 && c.position(l.x, l.y), o.set(l.id, c);
      else {
        const h = t.addNode(l);
        h && o.set(h.id, h);
      }
    }
    const a = [];
    for (const r of o.values())
      r.ready && a.push(r.ready);
    a.length > 0 && await Promise.all(a);
    for (const r of s.nodes) {
      const l = r.options.id || r.options.xPos !== void 0 ? xe(r.options).id : r.options.id;
      if (!l) continue;
      const c = o.get(l) || t.nodes.one(l);
      if (!c) continue;
      const h = r.relationships?.associations;
      if (!(!Array.isArray(h) || h.length === 0))
        for (const d of h) {
          const u = un(d), f = o.get(u.childId) || t.nodes.one(u.childId);
          if (f && c)
            if (c.relationships)
              c.relationships.addAssociation(f, u);
            else
              try {
                c.connector.isEnabled() || c.connector.enable(), c.connector.connectTo(f, {
                  lineColor: u.lineColor,
                  lineWidth: u.lineWidth
                });
              } catch (g) {
                console.warn(
                  "SERIALIZATION_DEBUG: Failed to create connection",
                  u.parentId,
                  "->",
                  u.childId,
                  g
                );
              }
        }
    }
  }
  !i && t.panZoom && setTimeout(() => {
    try {
      t.fitToContent();
    } catch {
    }
  }, 200);
}
function Li(n) {
  const t = dn(n.options);
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
      ...i.associations.map((s) => fn(s))
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
function Hi(n) {
  return xe(n);
}
function sa(n) {
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
function Ui(n) {
  return _e(n);
}
const oa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deserialize: pn,
  deserializeNodeOptions: Hi,
  serialize: _e,
  serializeNode: Li,
  snapshot: Ui
}, Symbol.toStringTag, { value: "Module" }));
class Zi {
  constructor(t, e = {}) {
    this.undoStack = [], this.redoStack = [], this.debounceTimer = null, this.isRestoring = !1, this.slate = t, this.options = {
      enabled: !0,
      maxHistory: 50,
      debounceMs: 3e3,
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
        this.takeSnapshot();
      }, this.options.debounceMs);
    }
  }
  /**
   * Undo the last change. Restores the previous snapshot.
   */
  undo() {
    if (this.undoStack.length <= 1)
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
  // ─── Private ─────────────────────────────────────────────────────
  takeSnapshot() {
    const t = _e(this.slate);
    this.redoStack = [], this.undoStack.push(t), this.undoStack.length > this.options.maxHistory && this.undoStack.shift(), console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
  }
  restore(t) {
    this.isRestoring = !0, pn(t, this.slate, !1, !0).catch((e) => console.error("UNDOREDO_DEBUG: Restore failed", e)).finally(() => {
      this.isRestoring = !1;
    });
  }
}
class Fi {
  constructor(t, e = {}) {
    this.selectionRect = null, this.startPoint = null, this.isSelecting = !1, this.slate = t, this.options = {
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
    t && (t.on("pointerdown.multiselect", (e) => {
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
      }).attr("pointer-events", "none"));
    }), t.on("pointermove.multiselect", (e) => {
      if (!this.isSelecting || !this.startPoint || !this.selectionRect) return;
      const i = this.getSvgPoint(e);
      if (!i) return;
      const s = Math.min(this.startPoint.x, i.x), o = Math.min(this.startPoint.y, i.y), a = Math.abs(i.x - this.startPoint.x), r = Math.abs(i.y - this.startPoint.y);
      this.selectionRect.move(s, o).size(a, r);
    }), t.on("pointerup.multiselect", (e) => {
      if (!this.isSelecting || !this.startPoint) return;
      const i = this.getSvgPoint(e);
      if (!i) return;
      const s = Math.min(this.startPoint.x, i.x), o = Math.min(this.startPoint.y, i.y), a = Math.abs(i.x - this.startPoint.x), r = Math.abs(i.y - this.startPoint.y);
      a > 5 && r > 5 && this.selectNodesInRect(s, o, a, r, e.shiftKey), this.cancelSelection();
    }));
  }
  unbindEvents() {
    const t = this.slate.canvas;
    t && (t.off("pointerdown.multiselect"), t.off("pointermove.multiselect"), t.off("pointerup.multiselect"));
  }
  cancelSelection() {
    this.isSelecting = !1, this.startPoint = null, this.selectionRect && (this.selectionRect.remove(), this.selectionRect = null);
  }
  // ─── Node selection ──────────────────────────────────────────────
  selectNodesInRect(t, e, i, s, o) {
    const a = [], r = this.slate.nodes.allNodes;
    for (const l of r)
      try {
        const c = l.svgGroup.bbox();
        c.x < t + i && c.x + c.width > t && c.y < e + s && c.y + c.height > e && a.push(l);
      } catch {
      }
    a.length > 0 && (this.slate.selectNodes(a, o), console.log(
      "MULTISELECT_DEBUG: Selected",
      a.length,
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
      const o = (s.options.x || 0) + t, a = (s.options.y || 0) + e;
      s.position(o, a);
    }
  }
}
class Yi {
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
    const t = this.slate.canvas, e = t.viewbox(), i = this.options.gridSize, s = this.options.gridColor, o = this.options.gridOpacity, a = Math.floor(e.x / i) * i - i * 5, r = Math.floor(e.y / i) * i - i * 5, l = e.x + e.width + i * 5, c = e.y + e.height + i * 5;
    this.gridGroup = t.group().attr("pointer-events", "none");
    for (let h = a; h <= l; h += i)
      this.gridGroup.line(h, r, h, c).stroke({ color: s, width: 0.5, opacity: o });
    for (let h = r; h <= c; h += i)
      this.gridGroup.line(a, h, l, h).stroke({ color: s, width: 0.5, opacity: o });
    this.gridGroup.back();
  }
}
class Xi {
  constructor(t, e = {}) {
    this.boundHandler = null, this.slate = t, this.options = {
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
      case "Escape":
        this.deselect(t);
        break;
      case "ArrowUp":
        this.nudge(0, -this.options.nudgeDistance, t);
        break;
      case "ArrowDown":
        this.nudge(0, this.options.nudgeDistance, t);
        break;
      case "ArrowLeft":
        this.nudge(-this.options.nudgeDistance, 0, t);
        break;
      case "ArrowRight":
        this.nudge(this.options.nudgeDistance, 0, t);
        break;
    }
  }
  deleteSelected(t) {
    const e = this.slate.getSelectedNodes();
    if (e.length !== 0) {
      t.preventDefault();
      for (const i of [...e])
        this.slate.removeNode(i.id);
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
  nudge(t, e, i) {
    const s = this.slate.getSelectedNodes();
    if (s.length !== 0) {
      i.preventDefault();
      for (const o of s) {
        const a = (o.options.x || 0) + t, r = (o.options.y || 0) + e;
        o.position(a, r);
      }
    }
  }
}
function gn(n, t = {}, e) {
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
      const l = new Set(t.nodes.map((h) => h.id));
      s.querySelectorAll("[data-node-id]").forEach((h) => {
        const d = h.getAttribute("data-node-id");
        d && !l.has(d) && h.remove();
      });
    }
    let r = new XMLSerializer().serializeToString(s);
    return r = `<?xml version="1.0" encoding="UTF-8"?>
` + r, e?.(r), r;
  } catch (s) {
    console.error("EXPORT_DEBUG: SVG export failed:", s);
    const o = "";
    return e?.(o), o;
  }
}
async function ji(n, t = {}, e) {
  const i = gn(n, t);
  if (!i) {
    const o = t.asBinary ? new Blob() : "";
    return e?.(o), o;
  }
  const s = t.scale || 2;
  try {
    const a = n.canvas.viewbox(), r = a.width * s, l = a.height * s, c = document.createElement("canvas");
    c.width = r, c.height = l;
    const h = c.getContext("2d");
    t.alpha || (h.fillStyle = n.options.containerStyle?.backgroundColor || "#ffffff", h.fillRect(0, 0, r, l));
    const d = new Image(), u = new Blob([i], {
      type: "image/svg+xml;charset=utf-8"
    }), f = URL.createObjectURL(u);
    return new Promise((g, p) => {
      d.onload = () => {
        if (h.drawImage(d, 0, 0, r, l), URL.revokeObjectURL(f), t.asBinary)
          c.toBlob(
            (m) => {
              const y = m || new Blob();
              e?.(y), g(y);
            },
            "image/png"
          );
        else {
          const m = c.toDataURL("image/png"), y = t.base64 ? m.split(",")[1] : m;
          e?.(y), g(y);
        }
      }, d.onerror = (m) => {
        URL.revokeObjectURL(f), console.error("EXPORT_DEBUG: PNG rendering failed:", m);
        const y = t.asBinary ? new Blob() : "";
        e?.(y), g(y);
      }, d.src = f;
    });
  } catch (o) {
    console.error("EXPORT_DEBUG: PNG export failed:", o);
    const a = t.asBinary ? new Blob() : "";
    return e?.(a), a;
  }
}
const ra = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPNG: ji,
  exportSVG: gn
}, Symbol.toStringTag, { value: "Module" }));
class Wi {
  constructor(t, e = {}) {
    this.doc = null, this.provider = null, this.collabMap = null, this.awareness = null, this.isConnected = !1, this.clientID = 0, this.cursorElements = /* @__PURE__ */ new Map(), this.slate = t, this.options = {
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
      const e = await Function('return import("yjs")')(), { WebsocketProvider: i } = await Function('return import("y-websocket")')();
      this.doc = new e.Doc(), this.clientID = this.doc.clientID, this.collabMap = this.doc.getMap("collabPackages"), this.collabMap.observe((s) => {
        s.transaction.local || s.changes.keys.forEach((o, a) => {
          if (o.action === "add" || o.action === "update") {
            const r = this.collabMap.get(a);
            r && this.handleRemotePackage(r);
          }
        });
      }), this.provider = new i(
        this.options.wsUrl,
        this.options.roomName,
        this.doc
      ), this.awareness = this.provider.awareness, this.awareness.setLocalStateField("user", {
        name: this.options.userName,
        color: this.options.userColor
      }), this.awareness.on("change", () => {
        const s = this.getCollabUsers();
        this.options.onAwarenessChange?.(s), this.slate.options.events?.onCollaborationUsersChanged?.(s);
      }), this.provider.on("status", (s) => {
        this.isConnected = s.status === "connected", this.options.onStatusChange?.(s.status);
      }), this.isConnected = !0, this.slate.options.events?.onInitCollaboration?.(
        this.clientID.toString()
      ), console.log(
        "COLLAB_DEBUG: Initialized collaboration for room",
        this.options.roomName,
        "clientID:",
        this.clientID
      );
    } catch (e) {
      e.code === "MODULE_NOT_FOUND" || e.message?.includes("Cannot find module") ? console.warn(
        "COLLAB_DEBUG: yjs/y-websocket not installed. Collaboration disabled.",
        "Install with: npm install yjs y-websocket"
      ) : console.error("COLLAB_DEBUG: Failed to initialize collaboration:", e);
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
   */
  send(t) {
    if (!this.collabMap) {
      console.warn("COLLAB_DEBUG: Collaboration not initialized");
      return;
    }
    const e = Array.isArray(t) ? t : [t];
    for (const i of e) {
      const s = `${i.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      this.collabMap.set(s, {
        ...i,
        clientID: this.clientID,
        timestamp: Date.now()
      });
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
    typeof e[i] == "function" ? e[i](t) : console.warn("COLLAB_DEBUG: Unknown collab type:", i), this.slate.options.events?.onCollaboration?.(t);
  }
  /**
   * Update local cursor position and broadcast to peers.
   */
  updateCursor(t, e) {
    this.awareness && this.awareness.setLocalStateField("cursor", {
      x: t,
      y: e,
      zoom: this.slate.getZoom?.() || 1
    });
  }
  /**
   * Render a remote cursor on the canvas.
   */
  renderCursor(t) {
    if (!t.cursor || !this.slate.canvas) return;
    const e = this.cursorElements.get(t.clientID);
    e && e.remove();
    const i = this.slate.canvas.group();
    i.polygon("0,0 0,15 10,12").fill(t.color).stroke({ color: "#fff", width: 1 }), i.text(t.userName).font({ size: 10, fill: "#fff" }).move(12, 8).attr("paint-order", "stroke").attr("stroke", t.color).attr("stroke-width", 3), i.move(t.cursor.x, t.cursor.y), i.attr("pointer-events", "none"), this.cursorElements.set(t.clientID, i);
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
    for (const [, t] of this.cursorElements)
      t.remove();
    this.cursorElements.clear(), this.provider && (this.provider.disconnect(), this.provider = null), this.doc && (this.doc.destroy(), this.doc = null), this.collabMap = null, this.awareness = null, this.isConnected = !1, console.log("COLLAB_DEBUG: Disconnected");
  }
  /** Check if collaboration is connected */
  isCollabConnected() {
    return this.isConnected;
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
function Vi(n, t, e = !1, i = !1) {
  if (!t) return;
  t._id && (n.options.themeId = t._id), e && (n.options.syncWithTheme = !0), t.containerStyle?.backgroundColor && (n.options.containerStyle = n.options.containerStyle || {}, n.options.containerStyle.backgroundColor = t.containerStyle.backgroundColor), t.defaultLineColor && (n.options.defaultLineColor = t.defaultLineColor);
  const s = n.nodes.allNodes;
  !s || s.length === 0 || !t.styles || (s.forEach((o, a) => {
    const r = $i(t, a);
    r && aa(o, r);
  }), console.log("THEME_DEBUG: Applied theme", t.name || t._id));
}
function $i(n, t) {
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
function aa(n, t) {
  t.backgroundColor && (n.options.backgroundColor = t.backgroundColor), t.borderColor && (n.options.borderColor = t.borderColor), t.borderWidth !== void 0 && (n.options.borderWidth = t.borderWidth), t.fontColor && (n.options.fontColor = t.fontColor), t.fontFamily && (n.options.fontFamily = t.fontFamily), t.fontSize !== void 0 && (n.options.fontSize = t.fontSize), t.lineColor && (n.options.lineColor = t.lineColor), t.opacity !== void 0 && (n.options.opacity = t.opacity), n.setColors?.(t.backgroundColor, t.borderColor), n.textElement && (t.fontColor || t.fontSize || t.fontFamily) && n.textElement.font({
    fill: t.fontColor || n.options.fontColor,
    size: t.fontSize || n.options.fontSize,
    family: t.fontFamily || n.options.fontFamily
  });
}
const la = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTheme: Vi,
  buildNodeStyleFromTheme: $i
}, Symbol.toStringTag, { value: "Module" }));
function qi(n, t = !1, e = 20) {
  const i = n.nodes.allNodes;
  if (i.length < 2) return;
  const s = 100;
  let o = !0, a = 0;
  for (; o && a < s; ) {
    o = !1, a++;
    for (let r = 0; r < i.length; r++)
      for (let l = r + 1; l < i.length; l++) {
        const c = i[r], h = i[l], d = c.options.x || 0, u = c.options.y || 0, f = c.options.width || 100, g = c.options.height || 60, p = h.options.x || 0, m = h.options.y || 0, y = h.options.width || 100, b = h.options.height || 60, _ = d < p + y + e && d + f + e > p, w = u < m + b + e && u + g + e > m;
        if (_ && w) {
          o = !0;
          const x = d + f / 2 - (p + y / 2), L = u + g / 2 - (m + b / 2), G = Math.sqrt(x * x + L * L) || 1, Z = x / G * (e / 2), et = L / G * (e / 2);
          c.position(d + Z, u + et), h.position(p - Z, m - et);
        }
      }
  }
  if (t) {
    const r = i.reduce((c, h) => c + (h.options.x || 0), 0) / i.length, l = i.reduce((c, h) => c + (h.options.y || 0), 0) / i.length;
    for (const c of i) {
      const h = c.options.x || 0, d = c.options.y || 0, u = r - h, f = l - d;
      c.position(h + u * 0.05, d + f * 0.05);
    }
  }
  console.log(
    "LAYOUT_DEBUG: Overlap removal completed in",
    a,
    "iterations"
  );
}
function Ki(n, t, e, i = !1) {
  const s = i ? 0 : 500;
  let o = 0;
  for (const a of t) {
    const r = n.nodes.one(a.id);
    r ? r.position(a.x, a.y, () => {
      o++, o >= t.length && e && e();
    }, void 0, s) : o++;
  }
  t.length === 0 && e && e();
}
function Qi(n) {
  return n.nodes.allNodes.map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
const ca = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyLayout: Ki,
  packageLayout: Qi,
  removeLayoutOverlaps: qi
}, Symbol.toStringTag, { value: "Module" }));
class Ji {
  constructor(t, e = {}) {
    this.container = null, this.slider = null, this.label = null, this.slate = t, this.options = {
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
    this.container && (this.container.remove(), this.container = null, this.slider = null, this.label = null);
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
    i.textContent = "+", i.style.cssText = "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;", i.onclick = () => this.slate.zoomIn?.(), this.container.appendChild(i), this.label = document.createElement("span"), this.label.textContent = "100%", this.label.style.cssText = "min-width: 40px; text-align: right;", this.container.appendChild(this.label), this.slate.element.appendChild(this.container), setInterval(() => this.update(), 500);
  }
}
class ts {
  constructor(t) {
    this.steps = [], this.currentStep = -1, this.isActive = !1, this.slate = t;
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
      const o = i.options._presentationIndex, a = s.options._presentationIndex;
      if (o !== void 0 && a !== void 0) return o - a;
      const r = (i.options.y || 0) - (s.options.y || 0);
      return Math.abs(r) > 30 ? r : (i.options.x || 0) - (s.options.x || 0);
    }), this.steps = e.map((i, s) => ({
      nodeId: i.id,
      index: s
    })), this.steps;
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
  /** Go to a specific step */
  goToStep(t) {
    if (t < 0 || t >= this.steps.length) return;
    this.currentStep = t;
    const e = this.steps[t], i = this.slate.nodes.one(e.nodeId);
    if (i) {
      try {
        const s = i.svgGroup.bbox(), o = s.x + s.width / 2, a = s.y + s.height / 2;
        this.slate.pan({ x: -o + 400, y: -a + 300 }), this.slate.zoom(1.5);
      } catch {
      }
      this.slate.selectNodes([i], !1);
    }
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
}
class es {
  constructor(t, e = {}) {
    if (this.selectedNodes = [], this.groupResizeRotate = null, this._coordinateIntervalId = null, typeof t == "string") {
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
  init() {
    this.canvas = we().addTo(this.element);
    const t = this.options.viewPort?.originalWidth || 800, e = this.options.viewPort?.originalHeight || 600;
    this.canvas.size(t, e), this.nodes = new Qr(this), this.invoker = new Jr(this), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new Ii(this, this.options.panZoom), this.birdsEye = new Pi(this, this.options.birdsEye), this.options.birdsEye?.enabled && setTimeout(() => this.birdsEye.enable(), 200), this.undoRedo = new Zi(this, {
      enabled: this.options.showUndoRedo !== !1
    }), this.multiSelection = new Fi(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new Yi(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20
    }), this.options.viewPort?.showGrid && this.grid.show(), this.keyboard = new Xi(this), this.options.enabled !== !1 && this.keyboard.bindGlobal(), this.collab = new Wi(this), this.zoomSlider = new Ji(this, {
      enabled: this.options.showZoom || !1
    }), this.presentation = new ts(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && setTimeout(() => this.addCoordinateDisplay(), 150);
  }
  setupCoordinateCallbacks() {
    const t = this.options.panZoom?.onPan, e = this.options.panZoom?.onZoom;
    this.options.panZoom || (this.options.panZoom = {}), this.options.panZoom.onPan = (i) => {
      this.updateCoordinateDisplay(), t && t(i);
    }, this.options.panZoom.onZoom = (i) => {
      this.updateCoordinateDisplay(), e && e(i);
    };
  }
  addCoordinateDisplay() {
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
    console.log("COORD_DEBUG: Starting coordinate polling"), this._coordinateIntervalId = setInterval(() => {
      this.updateCoordinateDisplay();
    }, 200);
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
        e = { x: o.x, y: o.y }, i = this.canvas.attr("width") / o.width || 1, console.log(
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
    const t = this.options.viewPort?.originalWidth || 800, e = this.options.viewPort?.originalHeight || 600;
    this.canvas.viewbox(0, 0, t, e);
  }
  addNode(t = {}) {
    const e = this.nodes.add(t);
    return setTimeout(() => this.notifyNodeChanged(), 100), e;
  }
  removeNode(t) {
    const e = this.nodes.remove(t);
    return this.notifyNodeChanged(), e;
  }
  /**
   * Notify that a node has changed (position, rotation, added, removed)
   * This triggers BirdsEye refresh if enabled
   */
  notifyNodeChanged(t) {
    this.birdsEye?.isEnabled() && this.birdsEye.scheduleRefresh();
  }
  getNode(t) {
    return this.nodes.one(t);
  }
  getAllNodes() {
    return this.nodes.allNodes;
  }
  // Get the pan/zoom viewport for adding content that should pan/zoom
  getViewport() {
    return console.log("VIEWPORT_DEBUG: Using root canvas (SVG.js panzoom)"), this.canvas;
  }
  // Get viewport with retry logic for proper initialization
  getViewportAsync() {
    return console.log(
      "VIEWPORT_DEBUG: Returning root canvas immediately (SVG.js panzoom)"
    ), Promise.resolve(this.canvas);
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
  zoomAtPoint(t, e) {
    this.panZoom.zoomAtPoint(t, e);
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
  // Selection Management
  setupSelectionHandling() {
    this.canvas.on("click", (t) => {
      console.log(
        "SELECTION_DEBUG: Canvas click detected",
        t.target,
        "vs",
        this.canvas.node
      ), t.target === this.canvas.node || t.target && t.target.tagName === "svg" ? (console.log("SELECTION_DEBUG: Canvas clicked - deselecting all"), this.clearSelection()) : console.log(
        "SELECTION_DEBUG: Click on non-canvas element, not deselecting"
      );
    });
  }
  // New multi-node selection method - SINGLE ORCHESTRATOR
  selectNodes(t, e = !1) {
    console.log(
      "SELECTION_DEBUG: Selecting nodes",
      t.map((i) => i.id),
      "addToSelection:",
      e
    ), e || this.clearSelection(), t.forEach((i) => {
      this.selectedNodes.includes(i) || (this.selectedNodes.push(i), i.onSelected());
    }), this.updateSelectionResizeRotate();
  }
  // SINGLE ORCHESTRATOR for resize/rotate management
  updateSelectionResizeRotate() {
    if (console.log(
      "SELECTION_DEBUG: Updating resize/rotate for",
      this.selectedNodes.length,
      "selected nodes"
    ), this.nodes.allNodes.forEach((t) => {
      t.resizeRotate.isEnabled() && (t.resizeRotate.disable(), console.log("SELECTION_DEBUG: Disabled resize/rotate on", t.id)), t.isConnectionHandlesEnabled() && (t.disableConnectionHandles(), console.log("SELECTION_DEBUG: Disabled connection handles on", t.id));
    }), this.disableGroupResizeRotate(), this.selectedNodes.length === 0) {
      console.log(
        "SELECTION_DEBUG: No nodes selected - all resize/rotate disabled"
      );
      return;
    }
    if (this.selectedNodes.length === 1) {
      const t = this.selectedNodes[0];
      t.resizeRotate.enable(), t.enableConnectionHandles(), console.log(
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
      const a = o.svgGroup.bbox();
      t = Math.min(t, a.x), e = Math.min(e, a.y), i = Math.max(i, a.x + a.width), s = Math.max(s, a.y + a.height);
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
    this.selectedNodes.forEach((a) => {
      const r = a.svgGroup.bbox(), l = (r.x - i.x) * s, c = (r.y - i.y) * o, h = r.width * s, d = r.height * o;
      a.setSize(h, d), a.position(e.x + l, e.y + c);
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
  selectNode(t) {
    this.selectNodes([t], !1);
  }
  deselectNode(t) {
    this.selectedNodes.includes(t) && (console.log("SELECTION_DEBUG: Deselecting node", t.id), this.selectedNodes = this.selectedNodes.filter((e) => e !== t), t.onDeselected(), this.selectedNodes.length === 0 ? this.disableGroupResizeRotate() : this.updateSelectionResizeRotate());
  }
  clearSelection() {
    console.log("SELECTION_DEBUG: Clearing selection"), this.selectedNodes.forEach((t) => {
      t.onDeselected();
    }), this.selectedNodes = [], this.updateSelectionResizeRotate();
  }
  getSelectedNodes() {
    return this.selectedNodes;
  }
  // Backward compatibility
  getSelectedNode() {
    return this.selectedNodes.length > 0 ? this.selectedNodes[0] : null;
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
    const i = _e(this, t, e);
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
    await pn(t, this, e, i);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return Ui(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return gn(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return ji(this, t, e);
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
    Vi(this, t, e, i);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  removeLayoutOverlaps(t, e) {
    qi(this, t, e);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, i) {
    Ki(this, t, e, i);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return Qi(this);
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
    await ki(this);
  }
}
function ha(n, t) {
  const e = n.addNode({
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
    allowResize: !0
  });
  return e && (e.options.commentAuthor = t.author, e.options.commentTimestamp = t.timestamp || Date.now()), e;
}
function da(n, t) {
  const e = n.nodes.one(t);
  return !e || !e.options.isComment ? !1 : n.removeNode(t);
}
function ua(n) {
  return n.nodes.allNodes.filter(
    (t) => t.options.isComment === !0
  );
}
const fa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComment: ha,
  getComments: ua,
  removeComment: da
}, Symbol.toStringTag, { value: "Module" }));
function pa(n = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let i = 0; i < n; i++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function ga(n) {
  const t = n.replace("#", ""), e = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return (e * 299 + i * 587 + s * 114) / 1e3 >= 128 ? "#000000" : "#ffffff";
}
function ns(n, t = "14px Arial") {
  if (typeof document > "u") return n.length * 7;
  const i = document.createElement("canvas").getContext("2d");
  return i ? (i.font = t, i.measureText(n).width) : n.length * 7;
}
function ma(n) {
  const e = n.path.match(/-?\d+\.?\d*/g);
  if (!e || e.length < 2)
    return { x: 0, y: 0, width: 100, height: 100 };
  const i = e.map(Number);
  let s = 1 / 0, o = 1 / 0, a = -1 / 0, r = -1 / 0;
  for (let l = 0; l < i.length - 1; l += 2)
    s = Math.min(s, i[l]), a = Math.max(a, i[l]), o = Math.min(o, i[l + 1]), r = Math.max(r, i[l + 1]);
  return {
    x: s,
    y: o,
    width: a - s,
    height: r - o
  };
}
function ya(n, t, e = "14px Arial") {
  const i = n.split(/\s+/), s = [];
  let o = "";
  for (const a of i) {
    const r = o ? `${o} ${a}` : a;
    ns(r, e) > t && o ? (s.push(o), o = a) : o = r;
  }
  return o && s.push(o), s;
}
function ba(n, t) {
  return Math.floor(Math.random() * (t - n + 1)) + n;
}
function wa(n, t, e, i, s = !0) {
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
function va(n) {
  const { buildNodeStyleFromTheme: t } = require("./core/Theme");
  return t(n.theme, n.childNumber);
}
function xa(n) {
  return n.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
}
function _a(n) {
  return n instanceof HTMLElement || n instanceof SVGElement;
}
function Ea(n) {
  return typeof document > "u" ? null : document.getElementById(n);
}
function Ca() {
  return typeof navigator > "u" ? !1 : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function Sa() {
  return typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function Ta(n) {
  n && (n.preventDefault(), n.stopPropagation());
}
function ka(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i += t)
    e.push(n.slice(i, i + t));
  return e;
}
const Ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildNodeStyleFromTheme: va,
  chunk: ka,
  createMultiLineText: ya,
  el: Ea,
  getBBox: ma,
  getTextWidth: ns,
  guid: pa,
  isElement: _a,
  isMobile: Sa,
  isSafari: Ca,
  obtainProportionateWidthAndHeightForResizing: wa,
  randomInt: ba,
  safeForUrls: xa,
  stopEvent: Ta,
  whiteOrBlack: ga
}, Symbol.toStringTag, { value: "Module" }));
function Da(n, t = {}) {
  return new es(n, t);
}
typeof window < "u" && (window.SlateboxJS = Da, window.Slate = es, window.Node = Ai, window.PanZoom = Ii, window.ResizeRotate = _i, window.BirdsEye = Pi, window.Connector = Ei, window.Serialization = oa, window.ShapeRegistry = Kr, window.Relationship = Yr, window.Relationships = Si, window.FontLoader = Wr, window.Images = Ti, window.Editor = Mi, window.UndoRedo = Zi, window.MultiSelection = Fi, window.Grid = Yi, window.Menu = Ri, window.Keyboard = Xi, window.Filters = Ni, window.Links = Di, window.Export = ra, window.Collab = Wi, window.Theme = la, window.Layout = ca, window.ZoomSlider = Ji, window.Comments = fa, window.Presentation = ts, window.Slatebox = { utils: Ma, compat: ia });
export {
  Pi as BirdsEye,
  Wi as Collab,
  fa as Comments,
  Ei as Connector,
  Mi as Editor,
  ra as ExportModule,
  Ni as Filters,
  Wr as FontLoader,
  Yi as Grid,
  Ti as Images,
  Jr as Invoker,
  Xi as Keyboard,
  ca as Layout,
  Di as Links,
  Ri as Menu,
  Fi as MultiSelection,
  Ai as Node,
  Qr as NodesManager,
  Ii as PanZoom,
  ts as Presentation,
  Yr as Relationship,
  Si as Relationships,
  _i as ResizeRotate,
  oa as Serialization,
  Kr as ShapeRegistry,
  es as Slate,
  Da as SlateboxJS,
  la as Theme,
  Zi as UndoRedo,
  Ji as ZoomSlider,
  ia as compat,
  Da as default,
  Oa as getFilterNames,
  za as registerFilter,
  Ma as utils
};
//# sourceMappingURL=slateboxjs.es.js.map
