const Ue = {}, jn = [];
function M(n, t) {
  if (Array.isArray(n)) {
    for (const e of n)
      M(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n)
      M(e, n[e]);
    return;
  }
  Vn(Object.getOwnPropertyNames(t)), Ue[n] = Object.assign(Ue[n] || {}, t);
}
function et(n) {
  return Ue[n] || {};
}
function _s() {
  return [...new Set(jn)];
}
function Vn(n) {
  jn.push(...n);
}
function sn(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    s.push(t(n[e]));
  return s;
}
function Cs(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    t(n[e]) && s.push(n[e]);
  return s;
}
function ze(n) {
  return n % 360 * Math.PI / 180;
}
function Es(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function $n(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function Ft(n, t, e, i) {
  return (t == null || e == null) && (i = i || n.bbox(), t == null ? t = i.width / i.height * e : e == null && (e = i.height / i.width * t)), {
    width: t,
    height: e
  };
}
function Fe(n, t) {
  const e = n.origin;
  let i = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", s = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([i, s] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof i == "string", r = typeof s == "string";
  if (o || r) {
    const { height: a, width: l, x: h, y: c } = t.bbox();
    o && (i = i.includes("left") ? h : i.includes("right") ? h + l : h + l / 2), r && (s = s.includes("top") ? c : s.includes("bottom") ? c + a : c + a / 2);
  }
  return [i, s];
}
const Ss = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), Ze = (n) => Ss.has(n.nodeName), qn = (n, t, e = {}) => {
  const i = { ...t };
  for (const s in i)
    i[s].valueOf() === e[s] && delete i[s];
  Object.keys(i).length ? n.node.setAttribute("data-svgjs", JSON.stringify(i)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, on = "http://www.w3.org/2000/svg", Ms = "http://www.w3.org/1999/xhtml", Pe = "http://www.w3.org/2000/xmlns/", ae = "http://www.w3.org/1999/xlink", R = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function rn() {
  return R.window;
}
class an {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}
const At = {}, ln = "___SYMBOL___ROOT___";
function se(n, t = on) {
  return R.document.createElementNS(t, n);
}
function tt(n, t = !1) {
  if (n instanceof an) return n;
  if (typeof n == "object")
    return Ie(n);
  if (n == null)
    return new At[ln]();
  if (typeof n == "string" && n.trim().charAt(0) !== "<")
    return Ie(R.document.querySelector(n));
  const e = t ? R.document.createElement("div") : se("svg");
  return e.innerHTML = n.trim(), n = Ie(e.firstElementChild), e.removeChild(e.firstElementChild), n;
}
function O(n, t) {
  return t && (t instanceof R.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : se(n);
}
function ft(n) {
  if (!n) return null;
  if (n.instance instanceof an) return n.instance;
  if (n.nodeName === "#document-fragment")
    return new At.Fragment(n);
  let t = $n(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : At[t] || (t = "Dom"), new At[t](n);
}
let Ie = ft;
function A(n, t = n.name, e = !1) {
  return At[t] = n, e && (At[ln] = n), Vn(Object.getOwnPropertyNames(n.prototype)), n;
}
function Ts(n) {
  return At[n];
}
let ks = 1e3;
function Kn(n) {
  return "Svgjs" + $n(n) + ks++;
}
function Qn(n) {
  for (let t = n.children.length - 1; t >= 0; t--)
    Qn(n.children[t]);
  return n.id && (n.id = Kn(n.nodeName)), n;
}
function S(n, t) {
  let e, i;
  for (n = Array.isArray(n) ? n : [n], i = n.length - 1; i >= 0; i--)
    for (e in t)
      n[i].prototype[e] = t[e];
}
function I(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function Rs() {
  return this.parent().children();
}
function As() {
  return this.parent().index(this);
}
function Ns() {
  return this.siblings()[this.position() + 1];
}
function Ds() {
  return this.siblings()[this.position() - 1];
}
function zs() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function Ps() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function Is() {
  return this.parent().add(this.remove()), this;
}
function Os() {
  return this.parent().add(this.remove(), 0), this;
}
function Ls(n) {
  n = tt(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function Bs(n) {
  n = tt(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function Gs(n) {
  return n = tt(n), n.before(this), this;
}
function Hs(n) {
  return n = tt(n), n.after(this), this;
}
M("Dom", {
  siblings: Rs,
  position: As,
  next: Ns,
  prev: Ds,
  forward: zs,
  backward: Ps,
  front: Is,
  back: Os,
  before: Ls,
  after: Bs,
  insertBefore: Gs,
  insertAfter: Hs
});
const Jn = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, Us = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, Fs = /rgb\((\d+),(\d+),(\d+)\)/, Zs = /(#[a-z_][a-z0-9\-_]*)/i, Ys = /\)\s*,?\s*/, Xs = /\s/g, An = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, Nn = /^rgb\(/, Dn = /^(\s+)?$/, zn = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Ws = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, xt = /[\s,]+/, hn = /[MLHVCSQTAZ]/i;
function js() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(xt);
}
function Vs(n) {
  return this.classes().indexOf(n) !== -1;
}
function $s(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function qs(n) {
  return this.hasClass(n) && this.attr(
    "class",
    this.classes().filter(function(t) {
      return t !== n;
    }).join(" ")
  ), this;
}
function Ks(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
M("Dom", {
  classes: js,
  hasClass: Vs,
  addClass: $s,
  removeClass: qs,
  toggleClass: Ks
});
function Qs(n, t) {
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
          n[i] == null || Dn.test(n[i]) ? "" : n[i]
        );
  }
  return arguments.length === 2 && this.node.style.setProperty(
    n,
    t == null || Dn.test(t) ? "" : t
  ), this;
}
function Js() {
  return this.css("display", "");
}
function to() {
  return this.css("display", "none");
}
function eo() {
  return this.css("display") !== "none";
}
M("Dom", {
  css: Qs,
  show: Js,
  hide: to,
  visible: eo
});
function no(n, t, e) {
  if (n == null)
    return this.data(
      sn(
        Cs(
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
M("Dom", { data: no });
function io(n, t) {
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
function so() {
  if (arguments.length === 0)
    this._memory = {};
  else
    for (let n = arguments.length - 1; n >= 0; n--)
      delete this.memory()[arguments[n]];
  return this;
}
function oo() {
  return this._memory = this._memory || {};
}
M("Dom", { remember: io, forget: so, memory: oo });
function ro(n) {
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
function ao(n) {
  const t = Math.round(n), i = Math.max(0, Math.min(255, t)).toString(16);
  return i.length === 1 ? "0" + i : i;
}
function Ot(n, t) {
  for (let e = t.length; e--; )
    if (n[t[e]] == null)
      return !1;
  return !0;
}
function lo(n, t) {
  const e = Ot(n, "rgb") ? { _a: n.r, _b: n.g, _c: n.b, _d: 0, space: "rgb" } : Ot(n, "xyz") ? { _a: n.x, _b: n.y, _c: n.z, _d: 0, space: "xyz" } : Ot(n, "hsl") ? { _a: n.h, _b: n.s, _c: n.l, _d: 0, space: "hsl" } : Ot(n, "lab") ? { _a: n.l, _b: n.a, _c: n.b, _d: 0, space: "lab" } : Ot(n, "lch") ? { _a: n.l, _b: n.c, _c: n.h, _d: 0, space: "lch" } : Ot(n, "cmyk") ? { _a: n.c, _b: n.m, _c: n.y, _d: n.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
  return e.space = t || e.space, e;
}
function ho(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function Oe(n, t, e) {
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
    const { random: i, round: s, sin: o, PI: r } = Math;
    if (t === "vibrant") {
      const a = 24 * i() + 57, l = 38 * i() + 45, h = 360 * i();
      return new z(a, l, h, "lch");
    } else if (t === "sine") {
      e = e ?? i();
      const a = s(80 * o(2 * r * e / 0.5 + 0.01) + 150), l = s(50 * o(2 * r * e / 0.5 + 4.6) + 200), h = s(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new z(a, l, h);
    } else if (t === "pastel") {
      const a = 8 * i() + 86, l = 17 * i() + 9, h = 360 * i();
      return new z(a, l, h, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * i(), l = 50 * i() + 86, h = 360 * i();
      return new z(a, l, h, "lch");
    } else if (t === "rgb") {
      const a = 255 * i(), l = 255 * i(), h = 255 * i();
      return new z(a, l, h);
    } else if (t === "lab") {
      const a = 100 * i(), l = 256 * i() - 128, h = 256 * i() - 128;
      return new z(a, l, h, "lab");
    } else if (t === "grey") {
      const a = 255 * i();
      return new z(a, a, a);
    } else
      throw new Error("Unsupported random color mode");
  }
  // Test if given value is a color string
  static test(t) {
    return typeof t == "string" && (An.test(t) || Nn.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((u) => u / 255), a = Math.min(1 - s, 1 - o, 1 - r);
    if (a === 1)
      return new z(0, 0, 0, 1, "cmyk");
    const l = (1 - s - a) / (1 - a), h = (1 - o - a) / (1 - a), c = (1 - r - a) / (1 - a);
    return new z(l, h, c, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((p) => p / 255), a = Math.max(s, o, r), l = Math.min(s, o, r), h = (a + l) / 2, c = a === l, d = a - l, u = c ? 0 : h > 0.5 ? d / (2 - a - l) : d / (a + l), f = c ? 0 : a === s ? ((o - r) / d + (o < r ? 6 : 0)) / 6 : a === o ? ((r - s) / d + 2) / 6 : a === r ? ((s - o) / d + 4) / 6 : 0;
    return new z(360 * f, 100 * u, 100 * h, "hsl");
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
      const d = lo(t, e);
      Object.assign(this, d);
    } else if (typeof t == "string")
      if (Nn.test(t)) {
        const d = t.replace(Xs, ""), [u, f, g] = Fs.exec(d).slice(1, 4).map((p) => parseInt(p));
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else if (An.test(t)) {
        const d = (p) => parseInt(p, 16), [, u, f, g] = Us.exec(ro(t)).map(d);
        Object.assign(this, { _a: u, _b: f, _c: g, _d: 0, space: "rgb" });
      } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: l, _d: h } = this, c = this.space === "rgb" ? { r, g: a, b: l } : this.space === "xyz" ? { x: r, y: a, z: l } : this.space === "hsl" ? { h: r, s: a, l } : this.space === "lab" ? { l: r, a, b: l } : this.space === "lch" ? { l: r, c: a, h: l } : this.space === "cmyk" ? { c: r, m: a, y: l, k: h } : {};
    Object.assign(this, c);
  }
  lab() {
    const { x: t, y: e, z: i } = this.xyz(), s = 116 * e - 16, o = 500 * (t - e), r = 200 * (e - i);
    return new z(s, o, r, "lab");
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
    if (ho(this.space)) {
      let { x: t, y: e, z: i } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: f, a: g, b: p } = this;
        if (this.space === "lch") {
          const { c: B, h: G } = this, U = Math.PI / 180;
          g = B * Math.cos(U * G), p = B * Math.sin(U * G);
        }
        const y = (f + 16) / 116, m = g / 500 + y, b = y - p / 200, v = 16 / 116, w = 8856e-6, x = 7.787;
        t = 0.95047 * (m ** 3 > w ? m ** 3 : (m - v) / x), e = 1 * (y ** 3 > w ? y ** 3 : (y - v) / x), i = 1.08883 * (b ** 3 > w ? b ** 3 : (b - v) / x);
      }
      const s = t * 3.2406 + e * -1.5372 + i * -0.4986, o = t * -0.9689 + e * 1.8758 + i * 0.0415, r = t * 0.0557 + e * -0.204 + i * 1.057, a = Math.pow, l = 31308e-7, h = s > l ? 1.055 * a(s, 1 / 2.4) - 0.055 : 12.92 * s, c = o > l ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, d = r > l ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new z(255 * h, 255 * c, 255 * d);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: i } = this;
      if (t /= 360, e /= 100, i /= 100, e === 0)
        return i *= 255, new z(i, i, i);
      const s = i < 0.5 ? i * (1 + e) : i + e - i * e, o = 2 * i - s, r = 255 * Oe(o, s, t + 1 / 3), a = 255 * Oe(o, s, t), l = 255 * Oe(o, s, t - 1 / 3);
      return new z(r, a, l);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: i, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), r = 255 * (1 - Math.min(1, e * (1 - s) + s)), a = 255 * (1 - Math.min(1, i * (1 - s) + s));
      return new z(o, r, a);
    } else
      return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: i, _d: s, space: o } = this;
    return [t, e, i, s, o];
  }
  toHex() {
    const [t, e, i] = this._clamped().map(ao);
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
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((m) => m / 255), a = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, l = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, h = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, c = (a * 0.4124 + l * 0.3576 + h * 0.1805) / 0.95047, d = (a * 0.2126 + l * 0.7152 + h * 0.0722) / 1, u = (a * 0.0193 + l * 0.1192 + h * 0.9505) / 1.08883, f = c > 8856e-6 ? Math.pow(c, 1 / 3) : 7.787 * c + 16 / 116, g = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116, p = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116;
    return new z(f, g, p, "xyz");
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
class H {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  // Clone point
  clone() {
    return new H(this);
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
    T.isMatrixLike(t) || (t = new T(t));
    const { x: e, y: i } = this;
    return this.x = t.a * e + t.c * i + t.e, this.y = t.b * e + t.d * i + t.f, this;
  }
}
function co(n, t) {
  return new H(n, t).transformO(this.screenCTM().inverseO());
}
function Lt(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
let T = class F {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, i = t.flip && (e || t.flip === "x") ? -1 : 1, s = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleX) ? t.scaleX * i : i, l = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, h = t.shear || 0, c = t.rotate || t.theta || 0, d = new H(
      t.origin || t.around || t.ox || t.originX,
      t.oy || t.originY
    ), u = d.x, f = d.y, g = new H(
      t.position || t.px || t.positionX || NaN,
      t.py || t.positionY || NaN
    ), p = g.x, y = g.y, m = new H(
      t.translate || t.tx || t.translateX,
      t.ty || t.translateY
    ), b = m.x, v = m.y, w = new H(
      t.relative || t.rx || t.relativeX,
      t.ry || t.relativeY
    ), x = w.x, B = w.y;
    return {
      scaleX: a,
      scaleY: l,
      skewX: o,
      skewY: r,
      shear: h,
      theta: c,
      rx: x,
      ry: B,
      tx: b,
      ty: v,
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
    const s = t.a * e.a + t.c * e.b, o = t.b * e.a + t.d * e.b, r = t.a * e.c + t.c * e.d, a = t.b * e.c + t.d * e.d, l = t.e + t.a * e.e + t.c * e.f, h = t.f + t.b * e.e + t.d * e.f;
    return i.a = s, i.b = o, i.c = r, i.d = a, i.e = l, i.f = h, i;
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
    return new F(this);
  }
  // Decomposes this matrix into its affine parameters
  decompose(t = 0, e = 0) {
    const i = this.a, s = this.b, o = this.c, r = this.d, a = this.e, l = this.f, h = i * r - s * o, c = h > 0 ? 1 : -1, d = c * Math.sqrt(i * i + s * s), u = Math.atan2(c * s, c * i), f = 180 / Math.PI * u, g = Math.cos(u), p = Math.sin(u), y = (i * o + s * r) / h, m = o * d / (y * i - s) || r * d / (y * s + i), b = a - t + t * g * d + e * (y * g * d - p * m), v = l - e + t * p * d + e * (y * p * d + g * m);
    return {
      // Return the affine parameters
      scaleX: d,
      scaleY: m,
      shear: y,
      rotate: f,
      translateX: b,
      translateY: v,
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
    const e = new F(t);
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
    const e = F.fromArray([1, 0, 0, 1, 0, 0]);
    return t = t instanceof nt ? t.matrixify() : typeof t == "string" ? F.fromArray(t.split(xt).map(parseFloat)) : Array.isArray(t) ? F.fromArray(t) : typeof t == "object" && F.isMatrixLike(t) ? t : typeof t == "object" ? new F().transform(t) : arguments.length === 6 ? F.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  // Inverses matrix
  inverseO() {
    const t = this.a, e = this.b, i = this.c, s = this.d, o = this.e, r = this.f, a = t * s - e * i;
    if (!a) throw new Error("Cannot invert " + this);
    const l = s / a, h = -e / a, c = -i / a, d = t / a, u = -(l * o + c * r), f = -(h * o + d * r);
    return this.a = l, this.b = h, this.c = c, this.d = d, this.e = u, this.f = f, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, i = t instanceof F ? t : new F(t);
    return F.matrixMultiply(i, e, this);
  }
  // Left multiplies by the given matrix
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, i = t instanceof F ? t : new F(t);
    return F.matrixMultiply(e, i, this);
  }
  // Rotate matrix
  rotate(t, e, i) {
    return this.clone().rotateO(t, e, i);
  }
  rotateO(t, e = 0, i = 0) {
    t = ze(t);
    const s = Math.cos(t), o = Math.sin(t), { a: r, b: a, c: l, d: h, e: c, f: d } = this;
    return this.a = r * s - a * o, this.b = a * s + r * o, this.c = l * s - h * o, this.d = h * s + l * o, this.e = c * s - d * o + i * o - e * s + e, this.f = d * s + c * o - e * o - i * s + i, this;
  }
  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t);
    const { a: o, b: r, c: a, d: l, e: h, f: c } = this;
    return this.a = o * t, this.b = r * e, this.c = a * t, this.d = l * e, this.e = h * t - i * t + i, this.f = c * e - s * e + s, this;
  }
  // Shear matrix
  shear(t, e, i) {
    return this.clone().shearO(t, e, i);
  }
  // eslint-disable-next-line no-unused-vars
  shearO(t, e = 0, i = 0) {
    const { a: s, b: o, c: r, d: a, e: l, f: h } = this;
    return this.a = s + o * t, this.c = r + a * t, this.e = l + h * t - i * t, this;
  }
  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t), t = ze(t), e = ze(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: l, c: h, d: c, e: d, f: u } = this;
    return this.a = a + l * o, this.b = l + a * r, this.c = h + c * o, this.d = c + h * r, this.e = d + u * o - s * o, this.f = u + d * r - i * r, this;
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
    if (F.isMatrixLike(t))
      return new F(t).multiplyO(this);
    const e = F.formatTransforms(t), i = this, { x: s, y: o } = new H(e.ox, e.oy).transform(i), r = new F().translateO(e.rx, e.ry).lmultiplyO(i).translateO(-s, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(s, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const a = new H(s, o).transform(r), l = isFinite(e.px) ? e.px - a.x : 0, h = isFinite(e.py) ? e.py - a.y : 0;
      r.translateO(l, h);
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
function uo() {
  return new T(this.node.getCTM());
}
function fo() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new T(t);
    }
    return new T(this.node.getScreenCTM());
  } catch {
    return console.warn(
      `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
    ), new T();
  }
}
A(T, "Matrix");
function Et() {
  if (!Et.nodes) {
    const n = tt().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true");
    const t = n.path().node;
    Et.nodes = { svg: n, path: t };
  }
  if (!Et.nodes.svg.node.parentNode) {
    const n = R.document.body || R.document.documentElement;
    Et.nodes.svg.addTo(n);
  }
  return Et.nodes;
}
function ti(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function po(n) {
  return n === R.document || (R.document.documentElement.contains || function(t) {
    for (; t.parentNode; )
      t = t.parentNode;
    return t === R.document;
  }).call(R.document.documentElement, n);
}
class L {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += R.window.pageXOffset, this.y += R.window.pageYOffset, new L(this);
  }
  init(t) {
    const e = [0, 0, 0, 0];
    return t = typeof t == "string" ? t.split(xt).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
      t.left != null ? t.left : t.x,
      t.top != null ? t.top : t.y,
      t.width,
      t.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : e, this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
  }
  isNulled() {
    return ti(this);
  }
  // Merge rect box with another, return a new instance
  merge(t) {
    const e = Math.min(this.x, t.x), i = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - i;
    return new L(e, i, s, o);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof T || (t = new T(t));
    let e = 1 / 0, i = -1 / 0, s = 1 / 0, o = -1 / 0;
    return [
      new H(this.x, this.y),
      new H(this.x2, this.y),
      new H(this.x, this.y2),
      new H(this.x2, this.y2)
    ].forEach(function(a) {
      a = a.transform(t), e = Math.min(e, a.x), i = Math.max(i, a.x), s = Math.min(s, a.y), o = Math.max(o, a.y);
    }), new L(e, s, i - e, o - s);
  }
}
function ei(n, t, e) {
  let i;
  try {
    if (i = t(n.node), ti(i) && !po(n.node))
      throw new Error("Element not in the dom");
  } catch {
    i = e(n);
  }
  return i;
}
function go() {
  const e = ei(this, (s) => s.getBBox(), (s) => {
    try {
      const o = s.clone().addTo(Et().svg).show(), r = o.node.getBBox();
      return o.remove(), r;
    } catch (o) {
      throw new Error(
        `Getting bbox of element "${s.node.nodeName}" is not possible: ${o.toString()}`
      );
    }
  });
  return new L(e);
}
function mo(n) {
  const i = ei(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(
      `Getting rbox of element "${o.node.nodeName}" is not possible`
    );
  }), s = new L(i);
  return n ? s.transform(n.screenCTM().inverseO()) : s.addOffset();
}
function yo(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
M({
  viewbox: {
    viewbox(n, t, e, i) {
      return n == null ? new L(this.attr("viewBox")) : this.attr("viewBox", new L(n, t, e, i));
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
      l === 1 / 0 && (l = Number.MAX_SAFE_INTEGER / 100), t = t || new H(e / 2 / o + s.x, i / 2 / r + s.y);
      const h = new L(s).transform(
        new T({ scale: l, origin: t })
      );
      return this.viewbox(h);
    }
  }
});
A(L, "Box");
class Nt extends Array {
  constructor(t = [], ...e) {
    if (super(t, ...e), typeof t == "number") return this;
    this.length = 0, this.push(...t);
  }
}
S([Nt], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, i, s) => n.call(e, e, i, s)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const bo = ["toArray", "constructor", "each"];
Nt.extend = function(n) {
  n = n.reduce((t, e) => (bo.includes(e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...i) {
    return this.each(e, ...i);
  }), t), {}), S([Nt], n);
};
function Zt(n, t) {
  return new Nt(
    sn((t || R.document).querySelectorAll(n), function(e) {
      return ft(e);
    })
  );
}
function wo(n) {
  return Zt(n, this.node);
}
function vo(n) {
  return ft(this.node.querySelector(n));
}
let xo = 0;
const ni = {};
function ii(n) {
  let t = n.getEventHolder();
  return t === R.window && (t = ni), t.events || (t.events = {}), t.events;
}
function cn(n) {
  return n.getEventTarget();
}
function _o(n) {
  let t = n.getEventHolder();
  t === R.window && (t = ni), t.events && (t.events = {});
}
function at(n, t, e, i, s) {
  const o = e.bind(i || n), r = tt(n), a = ii(r), l = cn(r);
  t = Array.isArray(t) ? t : t.split(xt), e._svgjsListenerId || (e._svgjsListenerId = ++xo), t.forEach(function(h) {
    const c = h.split(".")[0], d = h.split(".")[1] || "*";
    a[c] = a[c] || {}, a[c][d] = a[c][d] || {}, a[c][d][e._svgjsListenerId] = o, l.addEventListener(c, o, s || !1);
  });
}
function $(n, t, e, i) {
  const s = tt(n), o = ii(s), r = cn(s);
  typeof e == "function" && (e = e._svgjsListenerId, !e) || (t = Array.isArray(t) ? t : (t || "").split(xt), t.forEach(function(a) {
    const l = a && a.split(".")[0], h = a && a.split(".")[1];
    let c, d;
    if (e)
      o[l] && o[l][h || "*"] && (r.removeEventListener(
        l,
        o[l][h || "*"][e],
        i || !1
      ), delete o[l][h || "*"][e]);
    else if (l && h) {
      if (o[l] && o[l][h]) {
        for (d in o[l][h])
          $(r, [l, h].join("."), d);
        delete o[l][h];
      }
    } else if (h)
      for (a in o)
        for (c in o[a])
          h === c && $(r, [a, h].join("."));
    else if (l) {
      if (o[l]) {
        for (c in o[l])
          $(r, [l, c].join("."));
        delete o[l];
      }
    } else {
      for (a in o)
        $(r, a);
      _o(s);
    }
  }));
}
function Co(n, t, e, i) {
  const s = cn(n);
  return t instanceof R.window.Event || (t = new R.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...i
  })), s.dispatchEvent(t), t;
}
class le extends an {
  addEventListener() {
  }
  dispatch(t, e, i) {
    return Co(this, t, e, i);
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
    return $(this, t, e, i), this;
  }
  // Bind given event to listener
  on(t, e, i, s) {
    return at(this, t, e, i, s), this;
  }
  removeEventListener() {
  }
}
A(le, "EventTarget");
function Pn() {
}
const ne = {
  duration: 400,
  ease: ">",
  delay: 0
}, Eo = {
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
class Ht extends Array {
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
    return t instanceof Array ? t : t.trim().split(xt).map(parseFloat);
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
class E {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new E(this.value, t);
  }
  // Divide number
  divide(t) {
    return t = new E(t), new E(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(Jn), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof E && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  // Subtract number
  minus(t) {
    return t = new E(t), new E(this - t, this.unit || t.unit);
  }
  // Add number
  plus(t) {
    return t = new E(t), new E(this + t, this.unit || t.unit);
  }
  // Multiply number
  times(t) {
    return t = new E(t), new E(this * t, this.unit || t.unit);
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
const So = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), si = [];
function Mo(n) {
  si.push(n);
}
function To(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const i of t)
      n[i.nodeName] = zn.test(i.nodeValue) ? parseFloat(i.nodeValue) : i.nodeValue;
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
        return t = this.node.getAttribute(n), t == null ? Eo[n] : zn.test(t) ? parseFloat(t) : t;
      t = si.reduce((i, s) => s(n, i, this), t), typeof t == "number" ? t = new E(t) : So.has(n) && z.isColor(t) ? t = new z(t) : t.constructor === Array && (t = new Ht(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
class Mt extends le {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  // Add given element at a position
  add(t, e) {
    return t = tt(t), t.removeNamespace && this.node instanceof R.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  // Add element to given container and return self
  addTo(t, e) {
    return tt(t).put(this, e);
  }
  // Returns all child elements
  children() {
    return new Nt(
      sn(this.node.children, function(t) {
        return ft(t);
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
    return e && (i = Qn(i)), new this.constructor(i);
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
    return this.put(new Mt(se(t), e));
  }
  // Get first child
  first() {
    return ft(this.node.firstChild);
  }
  // Get a element at the given index
  get(t) {
    return ft(this.node.childNodes[t]);
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
    return this.xml(t, e, Ms);
  }
  // Get / set id
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = Kn(this.type)), this.attr("id", t);
  }
  // Gets index of given element
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  // Get the last child
  last() {
    return ft(this.node.lastChild);
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
    if (e = ft(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t)
        return e;
    while (e = ft(e.node.parentNode));
    return e;
  }
  // Basically does the same as `add()` but returns the added element instead
  put(t, e) {
    return t = tt(t), this.add(t, e), t;
  }
  // Add element to given container and return container
  putIn(t, e) {
    return tt(t).add(this, e);
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
    return t = tt(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const i = 10 ** t, s = this.attr(e);
    for (const o in s)
      typeof s[o] == "number" && (s[o] = Math.round(s[o] * i) / i);
    return this.attr(s), this;
  }
  // Import / Export raw svg
  svg(t, e) {
    return this.xml(t, e, on);
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
        if (a = ft(a.node.cloneNode(!0)), e) {
          const l = t(a);
          if (a = l || a, l === !1) return "";
        }
        a.each(function() {
          const l = t(this), h = l || this;
          l === !1 ? this.remove() : l && this !== h && this.replace(h);
        }, !0);
      }
      return e ? a.node.outerHTML : a.node.innerHTML;
    }
    e = e ?? !1;
    const s = se("wrapper", i), o = R.document.createDocumentFragment();
    s.innerHTML = t;
    for (let a = s.children.length; a--; )
      o.appendChild(s.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
}
S(Mt, { attr: To, find: wo, findOne: vo });
A(Mt, "Dom");
class nt extends Mt {
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
    return this.x(new E(t).plus(this.x()));
  }
  // Relative move over y axis
  dy(t = 0) {
    return this.y(new E(t).plus(this.y()));
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
    e || (t = tt(t));
    const i = new Nt();
    let s = this;
    for (; (s = s.parent()) && s.node !== R.document && s.nodeName !== "#document-fragment" && (i.push(s), !(!e && s.node === t.node || e && s.matches(t))); )
      if (s.node === this.root().node)
        return null;
    return i;
  }
  // Get referenced element form attribute value
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = (t + "").match(Zs);
    return e ? tt(e[1]) : null;
  }
  // Get parent document
  root() {
    const t = this.parent(Ts(ln));
    return t && t.root();
  }
  // set given data to the elements data property
  setData(t) {
    return this.dom = t, this;
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Ft(this, t, e);
    return this.width(new E(i.width)).height(new E(i.height));
  }
  // Set width of element
  width(t) {
    return this.attr("width", t);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return qn(this, this.dom), super.writeDataToDom();
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
S(nt, {
  bbox: go,
  rbox: mo,
  inside: yo,
  point: co,
  ctm: uo,
  screenCTM: fo
});
A(nt, "Element");
const Kt = {
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
    if (typeof i == "string" || i instanceof z || z.isRgb(i) || i instanceof nt)
      this.attr(n, i);
    else
      for (e = Kt[n].length - 1; e >= 0; e--)
        i[Kt[n][e]] != null && this.attr(Kt.prefix(n, Kt[n][e]), i[Kt[n][e]]);
    return this;
  }, M(["Element", "Runner"], t);
});
M(["Element", "Runner"], {
  // Let the user set the matrix directly
  matrix: function(n, t, e, i, s, o) {
    return n == null ? new T(this) : this.attr("transform", new T(n, t, e, i, s, o));
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
M("radius", {
  // Add x and y radius
  radius: function(n, t = n) {
    return (this._element || this).type === "radialGradient" ? this.attr("r", new E(n)) : this.rx(n).ry(t);
  }
});
M("Path", {
  // Get path length
  length: function() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function(n) {
    return new H(this.node.getPointAtLength(n));
  }
});
M(["Element", "Runner"], {
  // Set font
  font: function(n, t) {
    if (typeof n == "object") {
      for (t in n) this.font(t, n[t]);
      return this;
    }
    return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
  }
});
const ko = [
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
M("Element", ko);
function Ro() {
  return this.attr("transform", null);
}
function Ao() {
  return (this.attr("transform") || "").split(Ys).slice(0, -1).map(function(t) {
    const e = t.trim().split("(");
    return [
      e[0],
      e[1].split(xt).map(function(i) {
        return parseFloat(i);
      })
    ];
  }).reverse().reduce(function(t, e) {
    return e[0] === "matrix" ? t.lmultiply(T.fromArray(e[1])) : t[e[0]].apply(t, e[1]);
  }, new T());
}
function No(n, t) {
  if (this === n) return this;
  if (Ze(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), i = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(i.multiply(e)), this;
}
function Do(n) {
  return this.toParent(this.root(), n);
}
function zo(n, t) {
  if (n == null || typeof n == "string") {
    const s = new T(this).decompose();
    return n == null ? s : s[n];
  }
  T.isMatrixLike(n) || (n = { ...n, origin: Fe(n, this) });
  const e = t === !0 ? this : t || !1, i = new T(e).transform(n);
  return this.attr("transform", i);
}
M("Element", {
  untransform: Ro,
  matrixify: Ao,
  toParent: No,
  toRoot: Do,
  transform: zo
});
class it extends nt {
  flatten() {
    return this.each(function() {
      if (this instanceof it)
        return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(i, s) {
      return s[s.length - i - 1].toParent(t, e);
    }), this.remove();
  }
}
A(it, "Container");
class dn extends it {
  constructor(t, e = t) {
    super(O("defs", t), e);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
}
A(dn, "Defs");
class ht extends nt {
}
A(ht, "Shape");
function un(n) {
  return this.attr("rx", n);
}
function fn(n) {
  return this.attr("ry", n);
}
function oi(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function ri(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function ai(n) {
  return this.attr("cx", n);
}
function li(n) {
  return this.attr("cy", n);
}
function hi(n) {
  return n == null ? this.rx() * 2 : this.rx(new E(n).divide(2));
}
function ci(n) {
  return n == null ? this.ry() * 2 : this.ry(new E(n).divide(2));
}
const Po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cx: ai,
  cy: li,
  height: ci,
  rx: un,
  ry: fn,
  width: hi,
  x: oi,
  y: ri
}, Symbol.toStringTag, { value: "Module" }));
class he extends ht {
  constructor(t, e = t) {
    super(O("ellipse", t), e);
  }
  size(t, e) {
    const i = Ft(this, t, e);
    return this.rx(new E(i.width).divide(2)).ry(
      new E(i.height).divide(2)
    );
  }
}
S(he, Po);
M("Container", {
  // Create an ellipse
  ellipse: I(function(n = 0, t = n) {
    return this.put(new he()).size(n, t).move(0, 0);
  })
});
A(he, "Ellipse");
class di extends Mt {
  constructor(t = R.document.createDocumentFragment()) {
    super(t);
  }
  // Import / Export raw xml
  xml(t, e, i) {
    if (typeof t == "boolean" && (i = e, e = t, t = null), t == null || typeof t == "function") {
      const s = new Mt(se("wrapper", i));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, i);
    }
    return super.xml(t, !1, i);
  }
}
A(di, "Fragment");
function ui(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ fx: new E(n), fy: new E(t) }) : this.attr({ x1: new E(n), y1: new E(t) });
}
function fi(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ cx: new E(n), cy: new E(t) }) : this.attr({ x2: new E(n), y2: new E(t) });
}
const Io = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  from: ui,
  to: fi
}, Symbol.toStringTag, { value: "Module" }));
class ce extends it {
  constructor(t, e) {
    super(
      O(t + "Gradient", typeof t == "string" ? null : t),
      e
    );
  }
  // custom attr to handle transform
  attr(t, e, i) {
    return t === "transform" && (t = "gradientTransform"), super.attr(t, e, i);
  }
  bbox() {
    return new L();
  }
  targets() {
    return Zt("svg [fill*=" + this.id() + "]");
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
S(ce, Io);
M({
  Container: {
    // Create gradient element in defs
    gradient(...n) {
      return this.defs().gradient(...n);
    }
  },
  // define gradient
  Defs: {
    gradient: I(function(n, t) {
      return this.put(new ce(n)).update(t);
    })
  }
});
A(ce, "Gradient");
class oe extends it {
  // Initialize node
  constructor(t, e = t) {
    super(O("pattern", t), e);
  }
  // custom attr to handle transform
  attr(t, e, i) {
    return t === "transform" && (t = "patternTransform"), super.attr(t, e, i);
  }
  bbox() {
    return new L();
  }
  targets() {
    return Zt("svg [fill*=" + this.id() + "]");
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
M({
  Container: {
    // Create pattern element in defs
    pattern(...n) {
      return this.defs().pattern(...n);
    }
  },
  Defs: {
    pattern: I(function(n, t, e) {
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
A(oe, "Pattern");
let Se = class extends ht {
  constructor(t, e = t) {
    super(O("image", t), e);
  }
  // (re)load image
  load(t, e) {
    if (!t) return this;
    const i = new R.window.Image();
    return at(
      i,
      "load",
      function(s) {
        const o = this.parent(oe);
        this.width() === 0 && this.height() === 0 && this.size(i.width, i.height), o instanceof oe && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, s);
      },
      this
    ), at(i, "load error", function() {
      $(i);
    }), this.attr("href", i.src = t, ae);
  }
};
Mo(function(n, t, e) {
  return (n === "fill" || n === "stroke") && Ws.test(t) && (t = e.root().defs().image(t)), t instanceof Se && (t = e.root().defs().pattern(0, 0, (i) => {
    i.add(t);
  })), t;
});
M({
  Container: {
    // create image element, load image and set its size
    image: I(function(n, t) {
      return this.put(new Se()).size(0, 0).load(n, t);
    })
  }
});
A(Se, "Image");
class Tt extends Ht {
  // Get bounding box of points
  bbox() {
    let t = -1 / 0, e = -1 / 0, i = 1 / 0, s = 1 / 0;
    return this.forEach(function(o) {
      t = Math.max(o[0], t), e = Math.max(o[1], e), i = Math.min(o[0], i), s = Math.min(o[1], s);
    }), new L(i, s, t - i, e - s);
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
    t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(xt).map(parseFloat), t.length % 2 !== 0 && t.pop();
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
    T.isMatrixLike(t) || (t = new T(t));
    for (let e = this.length; e--; ) {
      const [i, s] = this[e];
      this[e][0] = t.a * i + t.c * s + t.e, this[e][1] = t.b * i + t.d * s + t.f;
    }
    return this;
  }
}
const Oo = Tt;
function Lo(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function Bo(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function Go(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function Ho(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
const pn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MorphArray: Oo,
  height: Ho,
  width: Go,
  x: Lo,
  y: Bo
}, Symbol.toStringTag, { value: "Module" }));
class Ut extends ht {
  // Initialize node
  constructor(t, e = t) {
    super(O("line", t), e);
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
    const i = Ft(this, t, e);
    return this.attr(this.array().size(i.width, i.height).toLine());
  }
}
S(Ut, pn);
M({
  Container: {
    // Create a line element
    line: I(function(...n) {
      return Ut.prototype.plot.apply(
        this.put(new Ut()),
        n[0] != null ? n : [0, 0, 0, 0]
      );
    })
  }
});
A(Ut, "Line");
class we extends it {
  // Initialize node
  constructor(t, e = t) {
    super(O("marker", t), e);
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
M({
  Container: {
    marker(...n) {
      return this.defs().marker(...n);
    }
  },
  Defs: {
    // Create marker
    marker: I(function(n, t, e) {
      return this.put(new we()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
    })
  },
  marker: {
    // Create and attach markers
    marker(n, t, e, i) {
      let s = ["marker"];
      return n !== "all" && s.push(n), s = s.join("-"), n = arguments[1] instanceof we ? arguments[1] : this.defs().marker(t, e, i), this.attr(s, n);
    }
  }
});
A(we, "Marker");
function Bt(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const Uo = {
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
class gn {
  done() {
    return !1;
  }
}
class Ye extends gn {
  constructor(t = ne.ease) {
    super(), this.ease = Uo[t] || t;
  }
  step(t, e, i) {
    return typeof t != "number" ? i < 1 ? t : e : t + (e - t) * this.ease(i);
  }
}
class ve extends gn {
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
function In() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, i = Math.PI, s = Math.log(t / 100 + e), o = -s / Math.sqrt(i * i + s * s), r = 3.9 / (o * n);
  this.d = 2 * o * r, this.k = r * r;
}
class Fo extends ve {
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
S(Fo, {
  duration: Bt("_duration", In),
  overshoot: Bt("_overshoot", In)
});
class Zo extends ve {
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
S(Zo, {
  windup: Bt("_windup"),
  p: Bt("P"),
  i: Bt("I"),
  d: Bt("D")
});
const Yo = {
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
}, Xe = {
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
}, Le = "mlhvqtcsaz".split("");
for (let n = 0, t = Le.length; n < t; ++n)
  Xe[Le[n]] = /* @__PURE__ */ function(e) {
    return function(i, s, o) {
      if (e === "H") i[0] = i[0] + s.x;
      else if (e === "V") i[0] = i[0] + s.y;
      else if (e === "A")
        i[5] = i[5] + s.x, i[6] = i[6] + s.y;
      else
        for (let r = 0, a = i.length; r < a; ++r)
          i[r] = i[r] + (r % 2 ? s.y : s.x);
      return Xe[e](i, s, o);
    };
  }(Le[n].toUpperCase());
function Xo(n) {
  const t = n.segment[0];
  return Xe[t](n.segment.slice(1), n.p, n.p0);
}
function We(n) {
  return n.segment.length && n.segment.length - 1 === Yo[n.segment[0].toUpperCase()];
}
function Wo(n, t) {
  n.inNumber && kt(n, !1);
  const e = hn.test(t);
  if (e)
    n.segment = [t];
  else {
    const i = n.lastCommand, s = i.toLowerCase(), o = i === s;
    n.segment = [s === "m" ? o ? "l" : "L" : i];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function kt(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, We(n) && je(n);
}
function je(n) {
  n.inSegment = !1, n.absolute && (n.segment = Xo(n)), n.segments.push(n.segment);
}
function jo(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function Vo(n) {
  return n.lastToken.toUpperCase() === "E";
}
const $o = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
function qo(n, t = !0) {
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
    p0: new H(),
    p: new H()
  };
  for (; s.lastToken = i, i = n.charAt(e++); )
    if (!(!s.inSegment && Wo(s, i))) {
      if (i === ".") {
        if (s.pointSeen || s.hasExponent) {
          kt(s, !1), --e;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += i;
        continue;
      }
      if (!isNaN(parseInt(i))) {
        if (s.number === "0" || jo(s)) {
          s.inNumber = !0, s.number = i, kt(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += i;
        continue;
      }
      if ($o.has(i)) {
        s.inNumber && kt(s, !1);
        continue;
      }
      if (i === "-" || i === "+") {
        if (s.inNumber && !Vo(s)) {
          kt(s, !1), --e;
          continue;
        }
        s.number += i, s.inNumber = !0;
        continue;
      }
      if (i.toUpperCase() === "E") {
        s.number += i, s.hasExponent = !0;
        continue;
      }
      if (hn.test(i)) {
        if (s.inNumber)
          kt(s, !1);
        else if (We(s))
          je(s);
        else
          throw new Error("parser Error");
        --e;
      }
    }
  return s.inNumber && kt(s, !1), s.inSegment && We(s) && je(s), s.segments;
}
function Ko(n) {
  let t = "";
  for (let e = 0, i = n.length; e < i; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
class Dt extends Ht {
  // Get bounding box of path
  bbox() {
    return Et().path.setAttribute("d", this.toString()), new L(Et.nodes.path.getBBox());
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
    return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), qo(t);
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
    return Ko(this);
  }
}
const pi = (n) => {
  const t = typeof n;
  return t === "number" ? E : t === "string" ? z.isColor(n) ? z : xt.test(n) ? hn.test(n) ? Dt : Ht : Jn.test(n) ? E : Ve : mn.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? Ht : t === "object" ? re : Ve;
};
class Rt {
  constructor(t) {
    this._stepper = t || new Ye("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    this._type || this.type(pi(t));
    let e = new this._type(t);
    return this._type === z && (e = this._to ? e[this._to[4]]() : this._from ? e[this._from[4]]() : e), this._type === re && (e = this._to ? e.align(this._to) : this._from ? e.align(this._from) : e), e = e.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(e.length)).map(Object).map(function(i) {
      return i.done = !0, i;
    }), e;
  }
}
class Ve {
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
class de {
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
    }), Object.assign(this, de.defaults, t), this;
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
de.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const Qo = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
class re {
  constructor(...t) {
    this.init(...t);
  }
  align(t) {
    const e = this.values;
    for (let i = 0, s = e.length; i < s; ++i) {
      if (e[i + 1] === t[i + 1]) {
        if (e[i + 1] === z && t[i + 7] !== e[i + 7]) {
          const a = t[i + 7], l = new z(this.values.splice(i + 3, 5))[a]().toArray();
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
      const s = pi(t[i]), o = new s(t[i]).toArray();
      e.push([i, s, o.length, ...o]);
    }
    return e.sort(Qo), this.values = e.reduce((i, s) => i.concat(s), []), this;
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
const mn = [Ve, de, re];
function Jo(n = []) {
  mn.push(...[].concat(n));
}
function tr() {
  S(mn, {
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
class Yt extends ht {
  // Initialize node
  constructor(t, e = t) {
    super(O("path", t), e);
  }
  // Get array
  array() {
    return this._array || (this._array = new Dt(this.attr("d")));
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
      typeof t == "string" ? t : this._array = new Dt(t)
    );
  }
  // Set element size to given width and height
  size(t, e) {
    const i = Ft(this, t, e);
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
Yt.prototype.MorphArray = Dt;
M({
  Container: {
    // Create a wrapped path element
    path: I(function(n) {
      return this.put(new Yt()).plot(n || new Dt());
    })
  }
});
A(Yt, "Path");
function er() {
  return this._array || (this._array = new Tt(this.attr("points")));
}
function nr() {
  return delete this._array, this;
}
function ir(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function sr(n) {
  return n == null ? this.array() : this.clear().attr(
    "points",
    typeof n == "string" ? n : this._array = new Tt(n)
  );
}
function or(n, t) {
  const e = Ft(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
const gi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array: er,
  clear: nr,
  move: ir,
  plot: sr,
  size: or
}, Symbol.toStringTag, { value: "Module" }));
class Xt extends ht {
  // Initialize node
  constructor(t, e = t) {
    super(O("polygon", t), e);
  }
}
M({
  Container: {
    // Create a wrapped polygon element
    polygon: I(function(n) {
      return this.put(new Xt()).plot(n || new Tt());
    })
  }
});
S(Xt, pn);
S(Xt, gi);
A(Xt, "Polygon");
class Wt extends ht {
  // Initialize node
  constructor(t, e = t) {
    super(O("polyline", t), e);
  }
}
M({
  Container: {
    // Create a wrapped polygon element
    polyline: I(function(n) {
      return this.put(new Wt()).plot(n || new Tt());
    })
  }
});
S(Wt, pn);
S(Wt, gi);
A(Wt, "Polyline");
class ue extends ht {
  // Initialize node
  constructor(t, e = t) {
    super(O("rect", t), e);
  }
}
S(ue, { rx: un, ry: fn });
M({
  Container: {
    // Create a rect element
    rect: I(function(n, t) {
      return this.put(new ue()).size(n, t);
    })
  }
});
A(ue, "Rect");
class Be {
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
const D = {
  nextDraw: null,
  frames: new Be(),
  timeouts: new Be(),
  immediates: new Be(),
  timer: () => R.window.performance || R.window.Date,
  transforms: [],
  frame(n) {
    const t = D.frames.push({ run: n });
    return D.nextDraw === null && (D.nextDraw = R.window.requestAnimationFrame(D._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = D.timer().now() + t, i = D.timeouts.push({ run: n, time: e });
    return D.nextDraw === null && (D.nextDraw = R.window.requestAnimationFrame(D._draw)), i;
  },
  immediate(n) {
    const t = D.immediates.push(n);
    return D.nextDraw === null && (D.nextDraw = R.window.requestAnimationFrame(D._draw)), t;
  },
  cancelFrame(n) {
    n != null && D.frames.remove(n);
  },
  clearTimeout(n) {
    n != null && D.timeouts.remove(n);
  },
  cancelImmediate(n) {
    n != null && D.immediates.remove(n);
  },
  _draw(n) {
    let t = null;
    const e = D.timeouts.last();
    for (; (t = D.timeouts.shift()) && (n >= t.time ? t.run() : D.timeouts.push(t), t !== e); )
      ;
    let i = null;
    const s = D.frames.last();
    for (; i !== s && (i = D.frames.shift()); )
      i.run(n);
    let o = null;
    for (; o = D.immediates.shift(); )
      o();
    D.nextDraw = D.timeouts.first() || D.frames.first() ? R.window.requestAnimationFrame(D._draw) : null;
  }
}, rr = function(n) {
  const t = n.start, e = n.runner.duration(), i = t + e;
  return {
    start: t,
    duration: e,
    end: i,
    runner: n.runner
  };
}, ar = function() {
  const n = R.window;
  return (n.performance || n.Date).now();
};
class mi extends le {
  // Construct a new timeline on the given element
  constructor(t = ar) {
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
      return this._runners.map(rr);
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
    return this._lastRunnerId = t.id, this._runners.push(a), this._runners.sort((l, h) => l.start - h.start), this._runnerIds = this._runners.map((l) => l.runner.id), this.updateTime()._continue(), this;
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
    return D.cancelFrame(this._nextFrame), this._nextFrame = null, t ? this._stepImmediate() : this._paused ? this : (this._nextFrame = D.frame(this._step), this);
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
      const l = this._runners[r], h = l.runner;
      let c = s;
      const d = this._time - l.start;
      if (d <= 0) {
        o = !0;
        continue;
      } else d < c && (c = d);
      if (!h.active()) continue;
      h.step(c).done ? l.persist !== !0 && h.duration() - h.time() + this._time + l.persist < this._time && (h.unschedule(), --r, --a) : o = !0;
    }
    return o && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this;
  }
  terminate() {
    this._startTime = 0, this._speed = 1, this._persist = 0, this._nextFrame = null, this._paused = !0, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
}
M({
  Element: {
    timeline: function(n) {
      return n == null ? (this._timeline = this._timeline || new mi(), this._timeline) : (this._timeline = n, this);
    }
  }
});
class lt extends le {
  constructor(t) {
    super(), this.id = lt.id++, t = t ?? ne.duration, t = typeof t == "function" ? new ve(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof ve, this._stepper = this._isDeclarative ? t : new Ye(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new T(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, i) {
    let s = 1, o = !1, r = 0;
    return t = t ?? ne.duration, e = e ?? ne.delay, i = i || "last", typeof t == "object" && !(t instanceof gn) && (e = t.delay ?? e, i = t.when ?? i, o = t.swing || o, s = t.times ?? s, r = t.wait ?? r, t = t.duration ?? ne.duration), {
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
    const s = lt.sanitise(t, e, i), o = new lt(s.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(s).schedule(s.delay, s.when);
  }
  clearTransform() {
    return this.transforms = new T(), this;
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
    return this._stepper = new Ye(t), this;
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
    const h = Math.floor(this.loops()), c = r && h % 2 === 0;
    return l = h + (c && !a || a && c ? t : 1 - t), this.loops(l);
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
      initialiser: t || Pn,
      runner: e || Pn,
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
    if (t instanceof mi || (i = e, e = t, t = this.timeline()), !t)
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
    return (i || a) && (this._initialise(i), this.transforms = new T(), l = this._run(a ? t : e), this.fire("step", this)), this.done = this.done || l && a, r && this.fire("finished", this), this;
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
lt.id = 0;
class xe {
  constructor(t = new T(), e = -1, i = !0) {
    this.transforms = t, this.id = e, this.done = i;
  }
  clearTransformsFromQueue() {
  }
}
S([lt, xe], {
  mergeWith(n) {
    return new xe(
      n.transforms.lmultiply(this.transforms),
      n.id
    );
  }
});
const yi = (n, t) => n.lmultiplyO(t), bi = (n) => n.transforms;
function lr() {
  const t = this._transformationRunners.runners.map(bi).reduce(yi, new T());
  this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
class hr {
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
    return this.ids.splice(0, e, 0), this.runners.splice(0, e, new xe()).forEach((i) => i.clearTransformsFromQueue()), this;
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
M({
  Element: {
    animate(n, t, e) {
      const i = lt.sanitise(n, t, e), s = this.timeline();
      return new lt(i.duration).loop(i).element(this).timeline(s.play()).schedule(i.delay, i.when);
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
      return this._transformationRunners.runners.filter((t) => t.id <= n.id).map(bi).reduce(yi, new T());
    },
    _addRunner(n) {
      this._transformationRunners.add(n), D.cancelImmediate(this._frameId), this._frameId = D.immediate(lr.bind(this));
    },
    _prepareRunner() {
      this._frameId == null && (this._transformationRunners = new hr().add(
        new xe(new T(this))
      ));
    }
  }
});
const cr = (n, t) => n.filter((e) => !t.includes(e));
S(lt, {
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
        const a = Object.keys(r), l = cr(a, o);
        if (l.length) {
          const c = this.element()[n](l), d = new re(s.from()).valueOf();
          Object.assign(d, c), s.from(d);
        }
        const h = new re(s.to()).valueOf();
        Object.assign(h, r), s.to(h), o = a, i = r;
      }
    ), this._rememberMorpher(n, s), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new Rt(this._stepper).to(new E(n));
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
    const i = T.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !i;
    const s = new Rt(this._stepper).type(
      e ? de : T
    );
    let o, r, a, l, h;
    function c() {
      r = r || this.element(), o = o || Fe(n, r), h = new T(t ? void 0 : r), r._addRunner(this), t || r._clearTransformRunnersBefore(this);
    }
    function d(f) {
      t || this.clearTransform();
      const { x: g, y: p } = new H(o).transform(
        r._currentTransform(this)
      );
      let y = new T({ ...n, origin: [g, p] }), m = this._isDeclarative && a ? a : h;
      if (e) {
        y = y.decompose(g, p), m = m.decompose(g, p);
        const v = y.rotate, w = m.rotate, x = [v - 360, v, v + 360], B = x.map((q) => Math.abs(q - w)), G = Math.min(...B), U = B.indexOf(G);
        y.rotate = x[U];
      }
      t && (i || (y.rotate = n.rotate || 0), this._isDeclarative && l && (m.rotate = l)), s.from(m), s.to(y);
      const b = s.at(f);
      return l = b.rotate, a = new T(b), this.addTransform(a), r._addRunner(this), s.done();
    }
    function u(f) {
      (f.origin || "center").toString() !== (n.origin || "center").toString() && (o = Fe(f, r)), n = { ...f, origin: o };
    }
    return this.queue(c, d, u, !0), this._isDeclarative && this._rememberMorpher("transform", s), this;
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
    if (t = new E(t), this._tryRetarget(n, t)) return this;
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
        e.to(i + new E(s));
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
    return this._queueObject(n, new E(t));
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
    return this._queueObject("viewbox", new L(n, t, e, i));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
S(lt, { rx: un, ry: fn, from: ui, to: fi });
A(lt, "Runner");
class Me extends it {
  constructor(t, e = t) {
    super(O("svg", t), e), this.namespace();
  }
  // Creates and returns defs element
  defs() {
    return this.isRoot() ? ft(this.node.querySelector("defs")) || this.put(new dn()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof R.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  // Add namespaces
  namespace() {
    return this.isRoot() ? this.attr({ xmlns: on, version: "1.1" }).attr(
      "xmlns:xlink",
      ae,
      Pe
    ) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, Pe).attr("xmlns:svgjs", null, Pe);
  }
  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    return this.isRoot() ? this : super.root();
  }
}
M({
  Container: {
    // Create nested svg document
    nested: I(function() {
      return this.put(new Me());
    })
  }
});
A(Me, "Svg", !0);
let yn = class extends it {
  // Initialize node
  constructor(t, e = t) {
    super(O("symbol", t), e);
  }
};
M({
  Container: {
    symbol: I(function() {
      return this.put(new yn());
    })
  }
});
A(yn, "Symbol");
function dr(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(R.document.createTextNode(n)), this;
}
function ur() {
  return this.node.getComputedTextLength();
}
function fr(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function pr(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function gr(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function mr(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function yr(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function br(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function wr(n) {
  return this.attr("x", n);
}
function vr(n) {
  return this.attr("y", n);
}
function xr(n, t) {
  return this.ax(n).ay(t);
}
function _r(n) {
  return this._build = !!n, this;
}
const wi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amove: xr,
  ax: wr,
  ay: vr,
  build: _r,
  center: br,
  cx: mr,
  cy: yr,
  length: ur,
  move: gr,
  plain: dr,
  x: fr,
  y: pr
}, Symbol.toStringTag, { value: "Module" }));
class gt extends ht {
  // Initialize node
  constructor(t, e = t) {
    super(O("text", t), e), this.dom.leading = this.dom.leading ?? new E(1.3), this._rebuild = !0, this._build = !1;
  }
  // Set / get leading
  leading(t) {
    return t == null ? this.dom.leading : (this.dom.leading = new E(t), this.rebuild());
  }
  // Rebuild appearance type
  rebuild(t) {
    if (typeof t == "boolean" && (this._rebuild = t), this._rebuild) {
      const e = this;
      let i = 0;
      const s = this.dom.leading;
      this.each(function(o) {
        if (Ze(this.node)) return;
        const r = R.window.getComputedStyle(this.node).getPropertyValue("font-size"), a = s * new E(r);
        this.dom.newLined && (this.attr("x", e.attr("x")), this.text() === `
` ? i += a : (this.attr("dy", o ? a + i : 0), i = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  // overwrite method from parent to set data properly
  setData(t) {
    return this.dom = t, this.dom.leading = new E(t.leading || 1.3), this;
  }
  writeDataToDom() {
    return qn(this, this.dom, { leading: 1.3 }), this;
  }
  // Set the text content
  text(t) {
    if (t === void 0) {
      const e = this.node.childNodes;
      let i = 0;
      t = "";
      for (let s = 0, o = e.length; s < o; ++s) {
        if (e[s].nodeName === "textPath" || Ze(e[s])) {
          s === 0 && (i = s + 1);
          continue;
        }
        s !== i && e[s].nodeType !== 3 && ft(e[s]).dom.newLined === !0 && (t += `
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
S(gt, wi);
M({
  Container: {
    // Create text element
    text: I(function(n = "") {
      return this.put(new gt()).text(n);
    }),
    // Create plain text element
    plain: I(function(n = "") {
      return this.put(new gt()).plain(n);
    })
  }
});
A(gt, "Text");
class Te extends ht {
  // Initialize node
  constructor(t, e = t) {
    super(O("tspan", t), e), this._build = !1;
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
    if (!(t instanceof gt))
      return this;
    const e = t.index(this), i = R.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = t.dom.leading * new E(i);
    return this.dy(e ? s : 0).attr("x", t.x());
  }
  // Set text content
  text(t) {
    return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
  }
}
S(Te, wi);
M({
  Tspan: {
    tspan: I(function(n = "") {
      const t = new Te();
      return this._build || this.clear(), this.put(t).text(n);
    })
  },
  Text: {
    newLine: function(n = "") {
      return this.tspan(n).newLine();
    }
  }
});
A(Te, "Tspan");
class ke extends ht {
  constructor(t, e = t) {
    super(O("circle", t), e);
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
    return this.radius(new E(t).divide(2));
  }
}
S(ke, { x: oi, y: ri, cx: ai, cy: li, width: hi, height: ci });
M({
  Container: {
    // Create circle element
    circle: I(function(n = 0) {
      return this.put(new ke()).size(n).move(0, 0);
    })
  }
});
A(ke, "Circle");
class $e extends it {
  constructor(t, e = t) {
    super(O("clipPath", t), e);
  }
  // Unclip all clipped elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unclip();
    }), super.remove();
  }
  targets() {
    return Zt("svg [clip-path*=" + this.id() + "]");
  }
}
M({
  Container: {
    // Create clipping element
    clip: I(function() {
      return this.defs().put(new $e());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof $e ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    // Unclip element
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
A($e, "ClipPath");
class vi extends nt {
  constructor(t, e = t) {
    super(O("foreignObject", t), e);
  }
}
M({
  Container: {
    foreignObject: I(function(n, t) {
      return this.put(new vi()).size(n, t);
    })
  }
});
A(vi, "ForeignObject");
function Cr(n, t) {
  return this.children().forEach((e) => {
    let i;
    try {
      i = e.node instanceof rn().SVGSVGElement ? new L(e.attr(["x", "y", "width", "height"])) : e.bbox();
    } catch {
      return;
    }
    const s = new T(e), o = s.translate(n, t).transform(s.inverse()), r = new H(i.x, i.y).transform(o);
    e.move(r.x, r.y);
  }), this;
}
function Er(n) {
  return this.dmove(n, 0);
}
function Sr(n) {
  return this.dmove(0, n);
}
function Mr(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function Tr(n = 0, t = 0, e = this.bbox()) {
  const i = n - e.x, s = t - e.y;
  return this.dmove(i, s);
}
function kr(n, t, e = this.bbox()) {
  const i = Ft(this, n, t, e), s = i.width / e.width, o = i.height / e.height;
  return this.children().forEach((r) => {
    const a = new H(e).transform(new T(r).inverse());
    r.scale(s, o, a.x, a.y);
  }), this;
}
function Rr(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function Ar(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function Nr(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
const xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dmove: Cr,
  dx: Er,
  dy: Sr,
  height: Mr,
  move: Tr,
  size: kr,
  width: Rr,
  x: Ar,
  y: Nr
}, Symbol.toStringTag, { value: "Module" }));
class jt extends it {
  constructor(t, e = t) {
    super(O("g", t), e);
  }
}
S(jt, xi);
M({
  Container: {
    // Create a group element
    group: I(function() {
      return this.put(new jt());
    })
  }
});
A(jt, "G");
class _e extends it {
  constructor(t, e = t) {
    super(O("a", t), e);
  }
  // Link target attribute
  target(t) {
    return this.attr("target", t);
  }
  // Link url
  to(t) {
    return this.attr("href", t, ae);
  }
}
S(_e, xi);
M({
  Container: {
    // Create a hyperlink element
    link: I(function(n) {
      return this.put(new _e()).to(n);
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
      return t || (t = new _e(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
A(_e, "A");
class qe extends it {
  // Initialize node
  constructor(t, e = t) {
    super(O("mask", t), e);
  }
  // Unmask all masked elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unmask();
    }), super.remove();
  }
  targets() {
    return Zt("svg [mask*=" + this.id() + "]");
  }
}
M({
  Container: {
    mask: I(function() {
      return this.defs().put(new qe());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof qe ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    // Unmask element
    unmask() {
      return this.attr("mask", null);
    }
  }
});
A(qe, "Mask");
class _i extends nt {
  constructor(t, e = t) {
    super(O("stop", t), e);
  }
  // add color stops
  update(t) {
    return (typeof t == "number" || t instanceof E) && (t = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), t.opacity != null && this.attr("stop-opacity", t.opacity), t.color != null && this.attr("stop-color", t.color), t.offset != null && this.attr("offset", new E(t.offset)), this;
  }
}
M({
  Gradient: {
    // Add a color stop
    stop: function(n, t, e) {
      return this.put(new _i()).update(n, t, e);
    }
  }
});
A(_i, "Stop");
function Dr(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const i in t)
    e += Es(i) + ":" + t[i] + ";";
  return e += "}", e;
}
class Ke extends nt {
  constructor(t, e = t) {
    super(O("style", t), e);
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
    return this.addText(Dr(t, e));
  }
}
M("Dom", {
  style(n, t) {
    return this.put(new Ke()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new Ke()).font(n, t, e);
  }
});
A(Ke, "Style");
class bn extends gt {
  // Initialize node
  constructor(t, e = t) {
    super(O("textPath", t), e);
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
M({
  Container: {
    textPath: I(function(n, t) {
      return n instanceof gt || (n = this.text(n)), n.path(t);
    })
  },
  Text: {
    // Create path for text to run on
    path: I(function(n, t = !0) {
      const e = new bn();
      n instanceof Yt || (n = this.defs().path(n)), e.attr("href", "#" + n, ae);
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
    text: I(function(n) {
      return n instanceof gt || (n = new gt().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Zt("svg textPath").filter((n) => (n.attr("href") || "").includes(this.id()));
    }
  }
});
bn.prototype.MorphArray = Dt;
A(bn, "TextPath");
class Ci extends ht {
  constructor(t, e = t) {
    super(O("use", t), e);
  }
  // Use element as a reference
  use(t, e) {
    return this.attr("href", (e || "") + "#" + t, ae);
  }
}
M({
  Container: {
    // Create a use element
    use: I(function(n, t) {
      return this.put(new Ci()).use(n, t);
    })
  }
});
A(Ci, "Use");
const Re = tt;
S([Me, yn, Se, oe, we], et("viewbox"));
S([Ut, Wt, Xt, Yt], et("marker"));
S(gt, et("Text"));
S(Yt, et("Path"));
S(dn, et("Defs"));
S([gt, Te], et("Tspan"));
S([ue, he, ce, lt], et("radius"));
S(le, et("EventTarget"));
S(Mt, et("Dom"));
S(nt, et("Element"));
S(ht, et("Shape"));
S([it, di], et("Container"));
S(ce, et("Gradient"));
S(lt, et("Runner"));
Nt.extend(_s());
Jo([
  E,
  z,
  L,
  T,
  Ht,
  Tt,
  Dt,
  H
]);
tr();
const On = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY });
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
    t.preventDefault(), t.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(On(t));
    const i = (e ? "mousemove" : "touchmove") + ".drag", s = (e ? "mouseup" : "touchend") + ".drag";
    at(window, i, this.drag, this, { passive: !1 }), at(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: t, handler: this, box: this.box });
  }
  // While dragging
  drag(t) {
    const { box: e, lastClick: i } = this, s = this.el.point(On(t)), o = s.x - i.x, r = s.y - i.y;
    if (!o && !r) return e;
    const a = e.x + o, l = e.y + r;
    this.box = new L(a, l, e.w, e.h), this.lastClick = s, !this.el.dispatch("dragmove", {
      event: t,
      handler: this,
      box: this.box,
      dx: o,
      dy: r
    }).defaultPrevented && this.move(a, l);
  }
  move(t, e) {
    this.el.type === "svg" ? jt.prototype.move.call(this.el, t, e) : this.el.move(t, e);
  }
  endDrag(t) {
    this.drag(t), this.el.fire("dragend", { event: t, handler: this, box: this.box }), $(window, "mousemove.drag"), $(window, "touchmove.drag"), $(window, "mouseup.drag"), $(window, "touchend.drag"), this.init(!0);
  }
}
S(nt, {
  draggable(n = !0) {
    return (this.remember("_draggable") || new zr(this)).init(n), this;
  }
});
var Qt = function(t) {
  return t.touches || [{
    clientX: t.clientX,
    clientY: t.clientY
  }];
};
S(Me, {
  panZoom: function(t) {
    var e, i, s, o, r, a, l, h, c, d, u, f, g = this;
    if (this.off(".panZoom"), t === !1) return this;
    t = (e = t) != null ? e : {};
    var p = (i = t.zoomFactor) != null ? i : 2, y = (s = t.zoomMin) != null ? s : Number.MIN_VALUE, m = (o = t.zoomMax) != null ? o : Number.MAX_VALUE, b = (r = t.wheelZoom) != null ? r : !0, v = (a = t.pinchZoom) != null ? a : !0, w = (l = t.panning) != null ? l : !0, x = (h = t.panButton) != null ? h : 0, B = (c = t.oneFingerPan) != null ? c : !1, G = (d = t.margins) != null ? d : !1, U = (u = t.wheelZoomDeltaModeLinePixels) != null ? u : 17, q = (f = t.wheelZoomDeltaModeScreenPixels) != null ? f : 53, ct, k, W = !1, X = this.viewbox(), mt = function(_) {
      if (!G) return _;
      var N = G.top, Z = G.left, dt = G.bottom, ut = G.right, J = g.attr(["width", "height"]), rt = J.width, It = J.height, C = g.node.preserveAspectRatio.baseVal, bt = 0, wt = 0, $t = 0, qt = 0;
      if (C.align !== C.SVG_PRESERVEASPECTRATIO_NONE) {
        var fe = rt / It, pe = X.width / X.height;
        if (pe !== fe) {
          var Tn = C.meetOrSlice !== C.SVG_MEETORSLICE_SLICE, De = fe > pe ? "width" : "height", kn = De === "width", Rn = Tn && kn || !Tn && !kn, ys = Rn ? fe / pe : pe / fe, _t = _[De] - _[De] * ys;
          Rn ? C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (bt = _t / 2, wt = -_t / 2) : C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMAX ? wt = -_t : (C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (bt = _t) : C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMID || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMID ? ($t = _t / 2, qt = -_t / 2) : C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMIN || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? qt = -_t : (C.align === C.SVG_PRESERVEASPECTRATIO_XMINYMAX || C.align === C.SVG_PRESERVEASPECTRATIO_XMIDYMAX || C.align === C.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && ($t = _t);
        }
      }
      var bs = X.width + X.x - Z - bt, ws = X.x + ut - _.width - wt, vs = X.height + X.y - N - $t, xs = X.y + dt - _.height - qt;
      return _.x = Math.min(bs, Math.max(ws, _.x)), _.y = Math.min(vs, Math.max(xs, _.y)), _;
    }, P = function(_) {
      _.preventDefault();
      var N;
      switch (_.deltaMode) {
        case 1:
          N = _.deltaY * U;
          break;
        case 2:
          N = _.deltaY * q;
          break;
        default:
          N = _.deltaY;
          break;
      }
      var Z = Math.pow(1 + p, -1 * N / 100) * this.zoom(), dt = this.point(_.clientX, _.clientY);
      if (Z > m && (Z = m), Z < y && (Z = y), this.dispatch("zoom", {
        level: Z,
        focus: dt
      }).defaultPrevented)
        return this;
      if (this.zoom(Z, dt), G) {
        var ut = mt(this.viewbox());
        this.viewbox(ut);
      }
    }, j = function Q(_) {
      if (k = Qt(_), k.length < 2) {
        w && B && ot.call(this, _);
        return;
      }
      w && B && yt.call(this, _), _.preventDefault(), !this.dispatch("pinchZoomStart", {
        event: _
      }).defaultPrevented && (this.off("touchstart.panZoom", Q), W = !0, at(document, "touchmove.panZoom", st, this, {
        passive: !1
      }), at(document, "touchend.panZoom", K, this, {
        passive: !1
      }));
    }, K = function Q(_) {
      _.preventDefault();
      var N = Qt(_);
      N.length > 1 || (W = !1, this.dispatch("pinchZoomEnd", {
        event: _
      }), $(document, "touchmove.panZoom", st), $(document, "touchend.panZoom", Q), this.on("touchstart.panZoom", j), N.length && w && B && ot.call(this, _));
    }, st = function(_) {
      _.preventDefault();
      var N = Qt(_), Z = this.zoom(), dt = Math.sqrt(Math.pow(k[0].clientX - k[1].clientX, 2) + Math.pow(k[0].clientY - k[1].clientY, 2)), ut = Math.sqrt(Math.pow(N[0].clientX - N[1].clientX, 2) + Math.pow(N[0].clientY - N[1].clientY, 2)), J = dt / ut;
      (Z < y && J > 1 || Z > m && J < 1) && (J = 1);
      var rt = {
        x: N[0].clientX + 0.5 * (N[1].clientX - N[0].clientX),
        y: N[0].clientY + 0.5 * (N[1].clientY - N[0].clientY)
      }, It = {
        x: k[0].clientX + 0.5 * (k[1].clientX - k[0].clientX),
        y: k[0].clientY + 0.5 * (k[1].clientY - k[0].clientY)
      }, C = this.point(rt.x, rt.y), bt = this.point(2 * rt.x - It.x, 2 * rt.y - It.y), wt = new L(this.viewbox()).transform(new T().translate(-bt.x, -bt.y).scale(J, 0, 0).translate(C.x, C.y));
      mt(wt), this.viewbox(wt), k = N, this.dispatch("zoom", {
        box: wt,
        focus: bt
      });
    }, ot = function Q(_) {
      var N = _.type.indexOf("mouse") > -1;
      N && _.button !== x && _.which !== x + 1 || (_.preventDefault(), this.off("mousedown.panZoom", Q), k = Qt(_), !W && (this.dispatch("panStart", {
        event: _
      }), ct = {
        x: k[0].clientX,
        y: k[0].clientY
      }, at(document, "touchmove.panZoom mousemove.panZoom", Pt, this, {
        passive: !1
      }), at(document, "touchend.panZoom mouseup.panZoom", yt, this, {
        passive: !1
      })));
    }, yt = function Q(_) {
      _.preventDefault(), $(document, "touchmove.panZoom mousemove.panZoom", Pt), $(document, "touchend.panZoom mouseup.panZoom", Q), this.on("mousedown.panZoom", ot), this.dispatch("panEnd", {
        event: _
      });
    }, Pt = function(_) {
      _.preventDefault();
      var N = Qt(_), Z = {
        x: N[0].clientX,
        y: N[0].clientY
      }, dt = this.point(Z.x, Z.y), ut = this.point(ct.x, ct.y), J = [ut.x - dt.x, ut.y - dt.y];
      if (!(!J[0] && !J[1])) {
        var rt = new L(this.viewbox()).transform(new T().translate(J[0], J[1]));
        ct = Z, mt(rt), !this.dispatch("panning", {
          box: rt,
          event: _
        }).defaultPrevented && this.viewbox(rt);
      }
    };
    return b && this.on("wheel.panZoom", P, this, {
      passive: !1
    }), v && this.on("touchstart.panZoom", j, this, {
      passive: !1
    }), w && this.on("mousedown.panZoom", ot, this, {
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
function Qe(n, t, e, i = null) {
  return function(s) {
    s.preventDefault(), s.stopPropagation();
    var o = s.pageX || s.touches[0].pageX, r = s.pageY || s.touches[0].pageY;
    t.fire(n, { x: o, y: r, event: s, index: i, points: e });
  };
}
function Je([n, t], { a: e, b: i, c: s, d: o, e: r, f: a }) {
  return [n * e + t * s + r, n * i + t * o + a];
}
class Ei {
  constructor(t) {
    this.el = t, t.remember("_selectHandler", this), this.selection = new jt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = rn();
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
      this.createHandle.call(this, this.selection, t, e, i, s), this.selection.get(e + 1).addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection touchstart.selection", Qe(s, this.el, this.handlePoints, e));
    });
  }
  createHandleFn(t) {
    t.polyline();
  }
  updateHandleFn(t, e, i, s) {
    const o = s.at(i - 1), r = s[(i + 1) % s.length], a = e, l = [a[0] - o[0], a[1] - o[1]], h = [a[0] - r[0], a[1] - r[1]], c = Math.sqrt(l[0] * l[0] + l[1] * l[1]), d = Math.sqrt(h[0] * h[0] + h[1] * h[1]), u = [l[0] / c, l[1] / c], f = [h[0] / d, h[1] / d], g = [a[0] - u[0] * 10, a[1] - u[1] * 10], p = [a[0] - f[0] * 10, a[1] - f[1] * 10];
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
    const t = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection touchstart.selection", Qe("rot", this.el, this.handlePoints));
    this.createRot.call(this, t);
  }
  updateRotationHandle() {
    const t = this.selection.findOne("g.svg_select_handle_rot");
    this.updateRot(t, this.rotationPoint, this.handlePoints);
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.bbox(), e = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.handlePoints = this.getHandlePoints(t).map((i) => Je(i, e)), this.rotationPoint = Je(this.getRotationPoint(t), e);
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
class Pr {
  constructor(t) {
    this.el = t, t.remember("_pointSelectHandler", this), this.selection = new jt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = rn();
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
      this.createHandle.call(this, this.selection, t, e, i), this.selection.get(e + 1).addClass("svg_select_handle_point").on("mousedown.selection touchstart.selection", Qe("point", this.el, this.points, e));
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
    this.points = this.el.array().map((e) => Je(e, t));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}
const Si = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let i = this.remember("_" + n.name);
  return i || (t.prototype instanceof Ei ? (i = new t(this), t = !0) : i = new n(this), this.remember("_" + n.name, i)), i.active(t, e), this;
};
S(nt, {
  select: Si(Ei)
});
S([Xt, Wt, Ut], {
  pointSelect: Si(Pr)
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
const ge = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY }), Mi = (n) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), i = Math.max(i, r[0]), s = Math.max(s, r[1]);
  }
  return new L(t, e, i - t, s - e);
};
function Ir(n, t, e) {
  const s = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([o, r]) => {
    const a = o - t[0], l = r - t[1], h = a * e, c = l * e;
    return [h + t[0], c + t[1]];
  });
  return Mi(s);
}
class Ln {
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
    this.box = this.el.bbox(), this.startPoint = this.el.point(ge(e)), this.index = i, this.points = s.slice();
    const r = (o ? "mousemove" : "touchmove") + ".resize", a = (o ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    t.type === "point" ? at(window, r, this.movePoint) : t.type === "rot" ? at(window, r, this.rotate) : at(window, r, this.resize), at(window, a, this.endResize);
  }
  resize(t) {
    this.lastEvent = t;
    const e = this.snapToGrid(this.el.point(ge(t)));
    let i = e.x - this.startPoint.x, s = e.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (i *= 2, s *= 2);
    const o = this.box.x + i, r = this.box.y + s, a = this.box.x2 + i, l = this.box.y2 + s;
    let h = new L(this.box);
    if (this.eventType.includes("l") && (h.x = Math.min(o, this.box.x2), h.x2 = Math.max(o, this.box.x2)), this.eventType.includes("r") && (h.x = Math.min(a, this.box.x), h.x2 = Math.max(a, this.box.x)), this.eventType.includes("t") && (h.y = Math.min(r, this.box.y2), h.y2 = Math.max(r, this.box.y2)), this.eventType.includes("b") && (h.y = Math.min(l, this.box.y), h.y2 = Math.max(l, this.box.y)), h.width = h.x2 - h.x, h.height = h.y2 - h.y, this.preserveAspectRatio) {
      const c = h.width / this.box.width, d = h.height / this.box.height, u = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], f = (u.indexOf(this.eventType) + 4) % u.length, g = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[f];
      let p = this.eventType.includes("t") || this.eventType.includes("b") ? d : c;
      p = this.eventType.length === 2 ? Math.max(c, d) : p, h = Ir(this.box, g, p);
    }
    this.el.dispatch("resize", {
      box: new L(h),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.size(h.width, h.height).move(h.x, h.y);
  }
  movePoint(t) {
    this.lastEvent = t;
    const { x: e, y: i } = this.snapToGrid(this.el.point(ge(t))), s = this.el.array().slice();
    s[this.index] = [e, i], !this.el.dispatch("resize", {
      box: Mi(s),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(t) {
    this.lastEvent = t;
    const e = this.startPoint, i = this.el.point(ge(t)), { cx: s, cy: o } = this.box, r = e.x - s, a = e.y - o, l = i.x - s, h = i.y - o, c = Math.sqrt(r * r + a * a) * Math.sqrt(l * l + h * h);
    if (c === 0)
      return;
    let d = Math.acos((r * l + a * h) / c) / Math.PI * 180;
    if (!d) return;
    i.x < e.x && (d = -d);
    const u = new T(this.el), { x: f, y: g } = new H(s, o).transformO(u), { rotate: p } = u.decompose(), y = this.snapToAngle(p + d) - p;
    this.el.dispatch("resize", {
      box: this.box,
      angle: y,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.transform(u.rotateO(y, f, g));
  }
  endResize(t) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(t), this.lastEvent = null, this.eventType = "", $(window, "mousemove.resize touchmove.resize"), $(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(t) {
    return this.grid && (t.x = Math.round(t.x / this.grid) * this.grid, t.y = Math.round(t.y / this.grid) * this.grid), t;
  }
  snapToAngle(t) {
    return this.degree && (t = Math.round(t / this.degree) * this.degree), t;
  }
}
S(nt, {
  // Resize element with mouse
  resize: function(n = !0, t = {}) {
    typeof n == "object" && (t = n, n = !0);
    let e = this.remember("_ResizeHandler");
    return e || (n.prototype instanceof Ln ? (e = new n(this), n = !0) : e = new Ln(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
  }
});
function ie(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = s.a * t + s.c * e + s.e, a = s.b * t + s.d * e + s.f, l = o.a * o.d - o.b * o.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const h = o.d / l, c = -o.b / l, d = -o.c / l, u = o.a / l, f = (o.c * o.f - o.d * o.e) / l, g = (o.b * o.e - o.a * o.f) / l, p = h * r + d * a + f, y = c * r + u * a + g;
    return [p, y];
  } catch {
    return [t, e];
  }
}
function Or(n, t, e) {
  try {
    const i = n.node.ownerSVGElement || n.node, s = n.node.getScreenCTM(), o = i.getScreenCTM();
    if (!s || !o)
      return [t, e];
    const r = o.a * t + o.c * e + o.e, a = o.b * t + o.d * e + o.f, l = s.a * s.d - s.b * s.c;
    if (Math.abs(l) < 1e-10)
      return [t, e];
    const h = s.d / l, c = -s.b / l, d = -s.c / l, u = s.a / l, f = (s.c * s.f - s.d * s.e) / l, g = (s.b * s.e - s.a * s.f) / l, p = h * r + d * a + f, y = c * r + u * a + g;
    return [p, y];
  } catch {
    return [t, e];
  }
}
function tn(n) {
  const t = n.bbox();
  return ie(n, t.cx, t.cy);
}
function Bn(n, t) {
  const e = n.bbox(), [i, s] = Or(n, t[0], t[1]), o = e.cx, r = e.cy, a = i - o, l = s - r, h = Math.sqrt(a * a + l * l);
  if (h === 0)
    return ie(n, o, r);
  const c = a / h, d = l / h;
  let u;
  if (n.type === "circle") {
    const p = parseFloat(n.attr("r")) || 0;
    u = [o + p * c, r + p * d];
  } else if (n.type === "ellipse") {
    const p = parseFloat(n.attr("rx")) || 0, y = parseFloat(n.attr("ry")) || 0, m = Math.atan2(d, c);
    u = [
      o + p * Math.cos(m),
      r + y * Math.sin(m)
    ];
  } else {
    const p = e.x, y = e.x + e.width, m = e.y, b = e.y + e.height, v = [];
    if (c !== 0) {
      const w = (p - o) / c, x = r + w * d;
      x >= m && x <= b && w > 0 && v.push([p, x, w]);
    }
    if (c !== 0) {
      const w = (y - o) / c, x = r + w * d;
      x >= m && x <= b && w > 0 && v.push([y, x, w]);
    }
    if (d !== 0) {
      const w = (m - r) / d, x = o + w * c;
      x >= p && x <= y && w > 0 && v.push([x, m, w]);
    }
    if (d !== 0) {
      const w = (b - r) / d, x = o + w * c;
      x >= p && x <= y && w > 0 && v.push([x, b, w]);
    }
    v.length > 0 ? (v.sort(function(w, x) {
      return w[2] - x[2];
    }), u = [v[0][0], v[0][1]]) : u = [o, r];
  }
  const [f, g] = ie(n, u[0], u[1]);
  return isNaN(f) || isNaN(g) || !isFinite(f) || !isFinite(g) ? ie(n, o, r) : [f, g];
}
function Gn(n, t) {
  const e = n.bbox(), i = e.x + (t.x != null ? t.x : 0.5) * e.width, s = e.y + (t.y != null ? t.y : 0.5) * e.height, [o, r] = ie(n, i, s);
  return isNaN(o) || isNaN(r) || !isFinite(o) || !isFinite(r) ? tn(n) : [o, r];
}
function wn(n) {
  const t = {};
  if (!n.source || !n.target)
    return [
      ["M", 0, 0],
      ["L", 50, 50]
    ];
  const e = tn(n.source), i = tn(n.target);
  if (n.sourceAnchor)
    t.point1 = Gn(n.source, n.sourceAnchor);
  else if (n.sourceAttach === "center")
    t.point1 = e;
  else if (t.point1 = Bn(n.source, i), n.markerSourceType && n.markerSourceType !== "null") {
    const l = Math.max(12, n.strokeWidth * 3 + 6) * 0.8, h = t.point1[0] - e[0], c = t.point1[1] - e[1], d = Math.sqrt(h * h + c * c);
    d > 0 && (t.point1[0] += h / d * l, t.point1[1] += c / d * l);
  }
  if (n.targetAnchor)
    t.point2 = Gn(n.target, n.targetAnchor);
  else if (n.targetAttach === "center")
    t.point2 = i;
  else if (t.point2 = Bn(n.target, e), n.markerTargetType && n.markerTargetType !== "null") {
    const l = Math.max(12, n.strokeWidth * 3 + 6) * 0.8, h = t.point2[0] - i[0], c = t.point2[1] - i[1], d = Math.sqrt(h * h + c * c);
    d > 0 && (t.point2[0] += h / d * l, t.point2[1] += c / d * l);
  }
  const s = t.point1, o = t.point2;
  let r;
  if (n.type === "curved") {
    const a = o[0] - s[0], l = o[1] - s[1], h = Math.sqrt(a * a + l * l);
    if (h < 1)
      return [["M", s[0], s[1]], ["L", o[0], o[1]]];
    const c = Math.min(h / 3, n.curveRadius * 1.5), d = -l / h, u = a / h, f = [
      e[0] - s[0],
      e[1] - s[1]
    ], g = [
      i[0] - o[0],
      i[1] - o[1]
    ];
    let p = 1;
    const y = f[0] * u - f[1] * d, m = g[0] * u - g[1] * d;
    y * m < 0 ? p = m > 0 ? 1 : -1 : p = y > 0 ? -1 : 1;
    const b = [
      d * c * p,
      u * c * p
    ], v = [
      s[0] + a * 0.3 + b[0] * 0.7,
      s[1] + l * 0.3 + b[1] * 0.7
    ], w = [
      s[0] + a * 0.7 + b[0] * 0.7,
      s[1] + l * 0.7 + b[1] * 0.7
    ];
    r = [
      ["M", s[0], s[1]],
      ["C", v[0], v[1], w[0], w[1], o[0], o[1]]
    ];
  } else if (n.type === "orthogonal") {
    const a = o[0] - s[0], l = o[1] - s[1], h = s[0] < e[0], c = s[1] < e[1], d = o[0] < i[0], u = o[1] < i[1];
    let f, g;
    if (Math.abs(a) > Math.abs(l))
      if (h && d || !h && !d) {
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
    else if (c && u || !c && !u) {
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
function Hn(n, t, e, i, s, o) {
  if (!n || n === "null") return null;
  const a = Math.max(12, i * 3 + 6), l = a, h = a * 0.8, c = (e ? "source-" : "target-") + "triangle-" + Math.random().toString(16).substr(2, 8), d = s.defs().marker(l, h);
  d.attr({
    id: c,
    viewBox: "0 0 " + l + " " + h,
    refX: e ? l : "0",
    // Source arrow tip at right, target arrow tip at left
    refY: h / 2,
    // Center vertically
    markerUnits: "strokeWidth",
    markerWidth: l / 2,
    // Scale down the rendered size
    markerHeight: h / 2,
    orient: "auto"
  });
  const u = d.path(), f = h / 2;
  return e ? u.attr({
    d: "M 0 " + f + " L " + l + " 0 L " + l + " " + h + " z"
  }) : u.attr({
    d: "M 0 0 L 0 " + h + " L " + l + " " + f + " z"
  }), u.fill(o), {
    element: d,
    id: c,
    size: a
  };
}
function Ce(n, t, e, i) {
  return i && (n.markers = i), n.markerSource && (n.markerSource.element.remove(), n.connector.attr("marker-start", null)), n.markerTarget && (n.markerTarget.element.remove(), n.connector.attr("marker-end", null)), t && t !== "null" ? (n.markerSource = Hn(
    t,
    0,
    !0,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-start", "url(#" + n.markerSource.id + ")")) : n.markerSource = null, e && e !== "null" ? (n.markerTarget = Hn(
    e,
    0,
    !1,
    n.strokeWidth,
    n.markers || i,
    n.color
  ), n.connector.attr("marker-end", "url(#" + n.markerTarget.id + ")")) : n.markerTarget = null, n;
}
function Lr(n, t, e) {
  return n.markerSourceType = t || "null", n.markerTargetType = e || "null", Ce(n, n.markerSourceType, n.markerTargetType), n;
}
function Br(n, t) {
  return n.strokeWidth = t || 2, n.connector.attr("stroke-width", n.strokeWidth), Ce(n, n.markerSourceType, n.markerTargetType), n;
}
function Un(n, t) {
  n.color = t, n.connector.stroke(t).attr("stroke-width", n.strokeWidth), n.markerSource && n.markerSource.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  }), n.markerTarget && n.markerTarget.element.children().forEach(function(e) {
    e.type === "path" && e.fill(t);
  });
}
function Gr(n, t) {
  return n && typeof n[t] == "function";
}
function Fn(n, t, e) {
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
  return Hr(n, s), s;
}
function Hr(n, t) {
  let e = null;
  if (!Gr(t.element, "draggable")) {
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
    t.element.front(), Ur(n, t);
  }).on("dragmove", function(i) {
    const s = [t.element.cx(), t.element.cy()];
    t.position = s, Fr(n, t, s);
    const o = i.detail.event;
    e = Xr(n, o, t), Wr(e);
  }).on("dragend", function(i) {
    try {
      t.element.node.style.cursor = "grab";
    } catch {
      t.element.node.setAttribute("style", "cursor: grab");
    }
    if (n.debugMode && Ti(n.container), e)
      Zn(n, t, e), ki();
    else {
      const s = [t.element.cx(), t.element.cy()], o = jr(n, s);
      t.isSource ? n._sourcePhantomRect = o : n._targetPhantomRect = o, Zn(n, t, o);
    }
    e = null;
  });
}
function Ur(n, t) {
  t.isDetached = !0, t.originalTarget || (t.originalTarget = t.isSource ? n.source : n.target), t.originalType || (t.originalType = n.type);
  const e = t.isSource ? n.source : n.target;
  e && e._isPhantomRect && (e.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = null : n.target = null;
}
function Fr(n, t, e) {
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
    const l = wn(n);
    n.connector.plot(l), n.hitArea.plot(l);
  } finally {
    n.source = o, n.target = r, n.type = a;
  }
}
function Zr(n, t, e = !1) {
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
    const r = i.d / o, a = -i.b / o, l = -i.c / o, h = i.a / o, c = (i.c * i.f - i.d * i.e) / o, d = (i.b * i.e - i.a * i.f) / o, u = r * t[0] + l * t[1] + c, f = a * t[0] + h * t[1] + d;
    e && console.log("Local coordinates:", { localX: u, localY: f });
    let g = !1;
    if (n.type === "circle") {
      const p = parseFloat(n.attr("cx")) || s.cx, y = parseFloat(n.attr("cy")) || s.cy, m = parseFloat(n.attr("r")) || 0, b = u - p, v = f - y;
      g = b * b + v * v <= m * m, e && console.log("Circle test:", {
        cx: p,
        cy: y,
        r: m,
        dx: b,
        dy: v,
        distance: Math.sqrt(b * b + v * v),
        result: g
      });
    } else if (n.type === "ellipse") {
      const p = parseFloat(n.attr("cx")) || s.cx, y = parseFloat(n.attr("cy")) || s.cy, m = parseFloat(n.attr("rx")) || 0, b = parseFloat(n.attr("ry")) || 0, v = u - p, w = f - y;
      g = v * v / (m * m) + w * w / (b * b) <= 1, e && console.log("Ellipse test:", { cx: p, cy: y, rx: m, ry: b, dx: v, dy: w, result: g });
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
function Yr(n, t) {
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
      const c = [
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
      s.path(c).attr({
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
function Ti(n) {
  try {
    n.find(".debug-hit-zone").forEach((e) => e.remove());
  } catch (t) {
    console.warn("Error clearing hit zone visualizations:", t);
  }
}
function Xr(n, t, e) {
  const i = n.debugMode || !1;
  i && Ti(n.container);
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
    let y = u.parent();
    for (; y && y.type !== "svg"; ) {
      if (y.hasClass) {
        const x = y.node.classList;
        if (x && (x.contains("svg_select_group") || x.contains("svg_resize_group") || x.contains("plugin-ui-group")))
          return !1;
      }
      const w = y.attr("id");
      if (w && (w.includes("_select_") || w.includes("_resize_") || w.includes("plugin")))
        return !1;
      y = y.parent();
    }
    const m = u.attr("id");
    if (m && (m.includes("_select_") || m.includes("_resize_") || m.includes("_handle_") || m.includes("_rotation_") || m.includes("plugin") || m.startsWith("svg_")))
      return !1;
    const b = u.attr("fill"), v = u.attr("stroke");
    return !(!b && !v || (b === "transparent" || b === "none") && (!v || v === "none" || v === "transparent"));
  }
  const r = n.container.root(), a = r.node.getBoundingClientRect(), l = t.clientX - a.left, h = t.clientY - a.top;
  i && console.log("Drop target search at:", { svgX: l, svgY: h });
  const c = s(r);
  i && (console.log("Found target shapes:", c.length), c.forEach((u, f) => {
    console.log(`Target shape ${f}:`, {
      type: u.type,
      id: u.attr("id"),
      classes: u.node.classList ? Array.from(u.node.classList) : [],
      fill: u.attr("fill"),
      stroke: u.attr("stroke"),
      bbox: u.bbox(),
      isValid: Ge(n, u, e)
    });
  }), c.forEach((u) => {
    Ge(n, u, e) && Yr(u, n.container);
  }));
  const d = [];
  return c.forEach(function(u) {
    if (Ge(n, u, e))
      try {
        if (Zr(u, [l, h], i)) {
          let g, p;
          try {
            const m = u.bbox(), b = u.node.getCTM();
            g = b.a * m.cx + b.c * m.cy + b.e, p = b.b * m.cx + b.d * m.cy + b.f;
          } catch {
            const b = u.bbox();
            g = b.cx, p = b.cy;
          }
          const y = Math.sqrt(
            Math.pow(l - g, 2) + Math.pow(h - p, 2)
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
function Ge(n, t, e) {
  const i = e.isSource ? n.source : n.target;
  if (t === i || t.attr("connectortype") || t.hasClass && t.hasClass("connector-handle") || t._isPhantomRect) return !1;
  const s = e.isSource ? n.target : n.source;
  return t !== s;
}
function Zn(n, t, e) {
  const i = t.isSource ? n.source : n.target;
  if (i && i._isPhantomRect && (i.remove(), t.isSource ? n._sourcePhantomRect = null : n._targetPhantomRect = null), t.isSource ? n.source = e : n.target = e, t.isDetached = !1, !i || i !== e) {
    let s;
    t.isSource ? s = function(a) {
      n.update();
    } : s = function(a) {
      n.update();
    };
    const o = t.isSource ? "_sourceUpdateFunction" : "_targetUpdateFunction", r = n[o];
    if (r && i && (i.off("dragmove", r), i.off("beforedrag", r), i.off("dragstart", r), i.off("dragend", r), i.off("resize", r), i.off("rotate", r), i.off("transform", r)), t.isSource) {
      if (i && i.cons) {
        const a = i.cons.indexOf(n);
        a > -1 && i.cons.splice(a, 1);
      }
      e.cons = e.cons || [], e.cons.indexOf(n) === -1 && e.cons.push(n);
    } else {
      if (i && i.targetCons) {
        const a = i.targetCons.indexOf(n);
        a > -1 && i.targetCons.splice(a, 1);
      }
      e.targetCons = e.targetCons || [], e.targetCons.indexOf(n) === -1 && e.targetCons.push(n);
    }
    n[o] = s, e.on("dragmove", s), e.on("beforedrag", s), e.on("dragstart", s), e.on("dragend", s), e.on("resize", s), e.on("rotate", s), e.on("transform", s);
  }
  if (n.update(), n.source && n.target) {
    const s = wn(n);
    if (s && s.length >= 2) {
      let o;
      if (t.isSource)
        o = [s[0][1], s[0][2]];
      else {
        const r = s[s.length - 1];
        o = [
          r[r.length - 2],
          r[r.length - 1]
        ];
      }
      t.position = o, t.element.center(o[0], o[1]);
    }
  }
  if (typeof n.onEndpointChange == "function") {
    const s = !!e._isPhantomRect;
    let o = null;
    if (!s)
      try {
        o = e.node && e.node.getAttribute && e.node.getAttribute("data-node-id") || e.attr && e.attr("data-node-id") || null;
      } catch {
      }
    let r = null;
    try {
      r = { x: e.cx(), y: e.cy() };
    } catch {
    }
    n.onEndpointChange({
      which: t.isSource ? "source" : "target",
      targetNodeId: o,
      isPhantom: s,
      point: r
    });
  }
}
let V = null;
function Wr(n) {
  if (n !== V)
    if (ki(), n) {
      V = n, n._originalStroke = n.attr("stroke"), n._originalStrokeWidth = n.attr("stroke-width"), n._originalStrokeDasharray = n.attr("stroke-dasharray"), n._originalStrokeOpacity = n.attr("stroke-opacity"), n.attr({
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
      V = null;
}
function ki() {
  if (V && V._originalStroke !== void 0) {
    V.attr({
      stroke: V._originalStroke,
      "stroke-width": V._originalStrokeWidth,
      "stroke-dasharray": V._originalStrokeDasharray,
      "stroke-opacity": V._originalStrokeOpacity
    });
    try {
      const n = V.node.style;
      n.animation = "", n.strokeDashoffset = "";
    } catch {
    }
    delete V._originalStroke, delete V._originalStrokeWidth, delete V._originalStrokeDasharray, delete V._originalStrokeOpacity;
  }
  V = null;
}
function Yn(n, t) {
  if (!n.showHandles || !t || t.length < 2) {
    n.sourceHandle && (n.sourceHandle.element.remove(), n.sourceHandle = null), n.targetHandle && (n.targetHandle.element.remove(), n.targetHandle = null);
    return;
  }
  const e = [t[0][1], t[0][2]], i = t[t.length - 1], s = [i[i.length - 2], i[i.length - 1]];
  n.sourceHandle ? (n.sourceHandle.element.attr({
    cx: e[0],
    cy: e[1]
  }), n.sourceHandle.position = e) : n.sourceHandle = Fn(n, !0, e), n.targetHandle ? (n.targetHandle.element.attr({
    cx: s[0],
    cy: s[1]
  }), n.targetHandle.position = s) : n.targetHandle = Fn(n, !1, s);
}
function jr(n, t) {
  const e = n.container.rect(20, 20).attr({
    x: t[0] - 10,
    y: t[1] - 10,
    fill: "transparent",
    stroke: "none",
    "pointer-events": "none"
  }).addClass("connector-phantom-rect");
  return e._isPhantomRect = !0, e;
}
function pt(n, t) {
  return n && typeof n[t] == "function";
}
function Ri(n, t) {
  t.current && t.current !== n && Ae(t.current), t.current = n, n.isSelected = !0, n.showHandles = !0, n.update();
}
function Ae(n) {
  n.isSelected = !1, n.showHandles = !1, n.update();
}
function Ai(n, t) {
  n.isSelected ? (Ae(n), t.current === n && (t.current = null)) : Ri(n, t);
}
function Vr(n, t) {
  let e = null;
  const i = 5;
  function s(r) {
    e = { x: r.clientX, y: r.clientY };
  }
  function o(r) {
    if (!e) return;
    const a = r.clientX - e.x, l = r.clientY - e.y;
    Math.sqrt(a * a + l * l) < i && (r.stopPropagation(), Ai(n, t)), e = null;
  }
  n.hitArea.on("mousedown", s), n.hitArea.on("mouseup", o), n.connector.on("mousedown", s), n.connector.on("mouseup", o), n.container.data("connector-click-handler") || (n.container.data("connector-click-handler", !0), n.container.click(function(r) {
    r.target === n.container.node && t.current && (Ae(t.current), t.current = null);
  }));
}
function $r(n, t, e) {
  n[t + "Attach"] = e, n.update();
}
function qr(n, t) {
  return n.showHandles = t, n.update(), n;
}
function Kr(n) {
  return {
    sourceHandle: n.sourceHandle,
    targetHandle: n.targetHandle
  };
}
function Qr(n, t) {
  return n.clickAreaWidth = Math.max(6, t || 12), n.hitArea.attr("stroke-width", n.clickAreaWidth), n;
}
function Jr(n, t) {
  t && (n.connector.remove(), t == "default" ? (n.connector = n.container.path().attr("connectortype", "default").fill("none").stroke("#000000").attr("stroke-width", 2), n.connector.stroke(n.color).attr("stroke-width", n.strokeWidth)) : n.connector = t, n.update());
}
function ta(n, t) {
  ["straight", "curved", "orthogonal"].indexOf(t) != -1 && n.type != t && (n.type = t, n.update());
}
function Ni(n, t) {
  return n.debugMode = t, n.hitArea.attr({
    stroke: n.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": n.debugMode ? 0.5 : 0.01
  }), n;
}
function ea(n) {
  return Ni(n, !n.debugMode);
}
function Di(n, t) {
  return t = t || {}, pt(n.source, "select") ? n.source.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), pt(n.target, "select") ? n.target.select(t) : console.warn(
    "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
  ), n;
}
function zi(n, t) {
  return pt(n.source, "draggable") ? n.source.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), pt(n.target, "draggable") ? n.target.draggable() : console.warn(
    "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
  ), n;
}
function Pi(n, t) {
  return t = t || {}, pt(n.source, "resize") ? n.source.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), pt(n.target, "resize") ? n.target.resize(t) : console.warn(
    "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
  ), n;
}
function na(n, t, e, i, s) {
  return t = t || {}, i = i || {}, pt(n.source, "draggable") && pt(n.target, "draggable"), pt(n.source, "select") && pt(n.target, "select"), pt(n.source, "resize") && pt(n.target, "resize"), zi(n), Di(n, t), Pi(n, i), n;
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
let Jt = null, He = null;
const te = { current: null };
function ia(n, t) {
  const e = {};
  t === void 0 && (t = n, n = {}), Jt = n.container || this.parent() || Jt;
  const i = this;
  if (He = n.markers || this.parent() || He, e.container = Jt, e.source = i, e.target = t, e.type = n.type || "straight", e.strokeWidth = n.strokeWidth || 2, e.color = n.color || "#000000", e.clickAreaWidth = n.clickAreaWidth || Math.max(12, e.strokeWidth * 3), e.debugMode = n.debugMode || !1, n.connector) {
    const a = Re.find(
      "#" + n.connector.node.getAttribute("href").slice(1)
    )[0];
    if (a && a.type == "path") {
      e.connector = n.connector;
      const l = a.array();
      if (!(l[1] && l[1][0] == "M") || !(l[2] && l[2][0] == "M")) {
        const h = a.bbox();
        l.splice(
          0,
          0,
          ["M", h.x + h.width / 2, h.y],
          ["M", h.x + h.width / 2, h.y + h.height]
        ), a.plot(l);
      }
      e.connector.target = a;
    }
  }
  e.connector || (e.connector = Jt.path().attr("connectortype", "default").fill("none").stroke(e.color).attr("stroke-width", e.strokeWidth)), e.hitArea = Jt.path().attr({
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
  e.hitArea.back(), e.sourceAttach = n.sourceAttach || "perifery", e.targetAttach = n.targetAttach || "perifery", e.sourceAnchor = n.sourceAnchor || null, e.targetAnchor = n.targetAnchor || null, e.curveRadius = n.curveRadius || 20, e.markerSourceType = n.markerSource || "null", e.markerTargetType = n.markerTarget || n.marker || "default", e.showHandles = n.showHandles || !1, e.handleRadius = n.handleRadius || 6, e.handleStrokeWidth = n.handleStrokeWidth || 2, e.handleStroke = n.handleStroke || "#007cff", e.handleFill = n.handleFill || "none", e.isSelected = !1, e.computeConnectorCoordinates = function(a) {
    return wn(a || e);
  }, i.cons = i.cons || [], i.cons.push(e), t.targetCons = t.targetCons || [], t.targetCons.push(e), e.update = function() {
    if (e.connector.attr("connectortype") == "default") {
      const a = e.computeConnectorCoordinates(e);
      let l = !0;
      for (let h = 0; h < a.length; h++)
        for (let c = 1; c < a[h].length; c++)
          (isNaN(a[h][c]) || !isFinite(a[h][c])) && (console.error(
            "Invalid coordinate in path data:",
            a[h][c],
            "at",
            [h, c]
          ), l = !1);
      l ? (e.connector.plot(a), e.hitArea.plot(a), Yn(e, a)) : console.error("Skipping plot due to invalid path data");
    }
  }, Ce(e, e.markerSourceType, e.markerTargetType, He), e.sourceHandle = null, e.targetHandle = null, e.setMarker = function(a, l, h) {
    return Ce(e, a, l, h);
  }, e.setMarkerSettings = function(a, l) {
    return Lr(e, a, l);
  }, e.setStrokeWidth = function(a) {
    return Br(e, a);
  }, e.setConnectorColor = function(a) {
    return Un(e, a), e;
  }, e.setAttachmentAnchor = function(a, l) {
    return a === "source" ? e.sourceAnchor = l || null : a === "target" && (e.targetAnchor = l || null), e.update(), e;
  }, e.updateHandles = function(a) {
    Yn(e, a);
  }, e.selectConnector = function() {
    Ri(e, te);
  }, e.deselectConnector = function() {
    Ae(e), te.current === e && (te.current = null);
  }, e.toggleSelection = function() {
    Ai(e, te);
  }, e.setConnectorAttachment = function(a, l) {
    $r(e, a, l);
  }, e.setHandleVisibility = function(a) {
    return qr(e, a);
  }, e.getHandles = function() {
    return Kr(e);
  }, e.setClickAreaWidth = function(a) {
    return Qr(e, a);
  }, e.setConnector = function(a) {
    Jr(e, a);
  }, e.setType = function(a) {
    ta(e, a);
  }, e.setDebugMode = function(a) {
    return Ni(e, a);
  }, e.toggleDebugMode = function() {
    return ea(e);
  }, e.makeSelectable = function(a) {
    return Di(e, a);
  }, e.makeDraggable = function(a) {
    return zi(e);
  }, e.makeResizable = function(a) {
    return Pi(e, a);
  }, e.makeInteractive = function(a, l, h) {
    return na(e, a, l, h);
  }, Vr(e, te), e.update();
  function s(a) {
    e.update();
  }
  function o(a) {
    e.update();
  }
  function r(a) {
    e.update();
  }
  return e._sourceUpdateFunction = o, e._targetUpdateFunction = r, i.on("dragmove", o), t.on("dragmove", r), i.on("beforedrag", o), i.on("dragstart", o), i.on("dragend", o), t.on("beforedrag", r), t.on("dragstart", r), t.on("dragend", r), i.on("resize", o), t.on("resize", r), i.on("rotate", o), t.on("rotate", r), i.on("transform", o), t.on("transform", r), e.updateConnector = s, Un(e, e.color), e;
}
S(nt, {
  connectable: ia,
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
class Ii {
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
      if (this.node.options.x = i.x + e.x, this.node.options.y = i.y + e.y, this.node.setSize(e.width, e.height), this.node.centerText(), t.detail && typeof t.detail.angle == "number") {
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
typeof window < "u" && (window.SVG = Re);
class Oi {
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
      }, r = s.lineType ? o[s.lineType] || "curved" : this.options.type, a = s.showParentArrow != null ? s.showParentArrow ? this.options.markerSource || "arrow" : "null" : this.options.markerSource, l = s.showChildArrow != null ? s.showChildArrow ? this.options.markerTarget || "arrow" : "null" : this.options.markerTarget, h = this.node.svgGroup.connectable(
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
          curveRadius: s.lineCurviness ?? this.options.curveRadius,
          // Edge-pin mode (optional): normalized local anchors {x,y} 0..1
          sourceAnchor: e.sourceAnchor,
          targetAnchor: e.targetAnchor
        },
        t.svgGroup
      );
      if (!h)
        return console.error("CONNECTOR_DEBUG: Failed to create connectable object"), null;
      const c = {
        id: i,
        source: this.node,
        target: t,
        connectable: h,
        lineColor: e.lineColor || this.options.defaultLineColor,
        lineWidth: e.lineWidth || this.options.defaultLineWidth,
        ...e
      };
      if (c.lineColor && h.setLineColor && h.setLineColor(c.lineColor), this.connections.set(i, c), h.onEndpointChange = (u) => this.handleEndpointChange(c, u), t.connector) {
        const u = `${t.id}<-${this.node.id}`;
        t.connector.connections.set(u, c);
      }
      console.log("CONNECTOR_DEBUG: Successfully connected", i);
      const d = h.line;
      return d?.on && d.on("click", (u) => {
        const f = this.node.slate?.options?.events;
        if (!f?.onLineMenuRequested || this.node.slate?.isReadOnly?.()) return;
        u.stopPropagation?.();
        const g = this.node.relationships?.getAssociation?.(
          t.id
        ) ?? c;
        f.onLineMenuRequested(this.node, g, (p = {}) => {
          p.lineColor && h.setLineColor && (h.setLineColor(p.lineColor), c.lineColor = p.lineColor), p.lineWidth && d.attr && (d.attr({ "stroke-width": p.lineWidth }), c.lineWidth = p.lineWidth), g && g.id && Object.assign(g, p);
        });
      }), this.options.onConnect?.(c), c;
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
        if (e.lineCurviness != null && (s.curveRadius = e.lineCurviness), e.showParentArrow != null || e.showChildArrow != null) {
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
    const { which: i, targetNodeId: s, isPhantom: o } = e;
    if (o || !s) return;
    const r = this.slate.nodes.one(s);
    if (!r) return;
    const a = {
      lineColor: t.lineColor,
      lineWidth: t.lineWidth,
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow
    };
    setTimeout(() => {
      try {
        if (i === "target") {
          const l = t.source, h = t.target?.id;
          if (!l?.relationships || r.id === h) return;
          h && l.relationships.removeAssociation(h), l.relationships.addAssociation(r, a);
        } else {
          const l = t.source, h = t.target;
          if (!h || !l?.relationships || r.id === l.id)
            return;
          l.relationships.removeAssociation(h.id), r.relationships?.addAssociation(h, a);
        }
      } catch (l) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", l);
      }
    }, 0);
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
function Li(n, t, e) {
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
const sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createDefaultAssociation: Li
}, Symbol.toStringTag, { value: "Module" }));
class Bi {
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
    const i = Li(this.node.id, t.id, e);
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
    const e = `${this.node.id}->${t}`;
    if (!this.assocMap.get(e))
      return console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        e
      ), !1;
    const s = this.slate.nodes.one(t);
    return s && this.node.connector && this.node.connector.disconnectFrom(s), this.assocMap.delete(e), console.log("RELATIONSHIP_DEBUG: Removed association", e), this.node.slate?.broadcast?.("removeRelationship", {
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
    s[e] = i;
    const o = `${this.node.id}->${s.childId}`;
    return this.node.connector?.updateConnection(o, { [e]: i }), !0;
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
    this.node.connector && (this.node.connector.isEnabled() || this.node.connector.enable(), this.node.connector.connectTo(e, {
      lineColor: t.lineColor,
      lineWidth: t.lineWidth,
      lineType: t.lineType,
      lineCurviness: t.lineCurviness,
      showParentArrow: t.showParentArrow,
      showChildArrow: t.showChildArrow,
      sourceAnchor: t.sourceAnchor,
      targetAnchor: t.targetAnchor
    }));
  }
}
class Gi {
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
const be = /* @__PURE__ */ new Set(), ee = /* @__PURE__ */ new Map(), oa = /* @__PURE__ */ new Set([
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
function vn(n) {
  const t = n.trim(), e = t.toLowerCase();
  if (oa.has(e) || be.has(e))
    return Promise.resolve();
  if (ee.has(e))
    return ee.get(e);
  const i = new Promise((s, o) => {
    if (typeof document > "u") {
      s();
      return;
    }
    const r = t.split(",")[0].trim().replace(/['"]/g, "");
    try {
      if (document.fonts?.check?.(`12px "${r}"`)) {
        be.add(e), s();
        return;
      }
    } catch {
    }
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      r
    )}:wght@300;400;500;600;700&display=swap`, a.onload = () => {
      be.add(e), ee.delete(e), console.log("FONT_DEBUG: Loaded font:", r), s();
    }, a.onerror = () => {
      ee.delete(e), console.warn("FONT_DEBUG: Failed to load font:", r), s();
    }, document.head.appendChild(a);
  });
  return ee.set(e, i), i;
}
async function Hi(n) {
  const t = /* @__PURE__ */ new Set(), e = n.nodes?.allNodes || [];
  for (const s of e)
    s.options?.fontFamily && t.add(s.options.fontFamily);
  const i = Array.from(t).map((s) => vn(s));
  await Promise.all(i), console.log("FONT_DEBUG: All fonts loaded:", Array.from(t));
}
function ra(n) {
  return be.has(n.toLowerCase().trim());
}
const aa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  isFontLoaded: ra,
  loadAllFonts: Hi,
  loadFont: vn
}, Symbol.toStringTag, { value: "Module" }));
class Ui {
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
    t !== void 0 && (this.node.options.text = t), e !== void 0 && (this.node.options.fontSize = e), s !== void 0 && (this.node.options.fontColor = s), o !== void 0 && (this.node.options.textOpacity = o), r !== void 0 && (this.node.options.textXAlign = r), a !== void 0 && (this.node.options.textYAlign = a), i !== void 0 && i !== this.node.options.fontFamily && (this.node.options.fontFamily = i, await vn(i)), this.applyText();
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
class Fi {
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
  /** Destroy the links instance, unsetting any active link */
  destroy() {
    this.linkData && this.unset(!1), this.linkData = null, this.node = null;
  }
}
const vt = /* @__PURE__ */ new Map();
vt.set("dropShadow", {
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
vt.set("blur", {
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
vt.set("outline", {
  name: "outline",
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
class Zi {
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
    const i = vt.get(t);
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
    const e = vt.get(t);
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
        const i = vt.get(e);
        i && (this.node.backgroundRect && i.remove(this.node.backgroundRect), this.node.textElement && i.remove(this.node.textElement));
      }
    else
      for (const e of this.activeFilters) {
        const i = vt.get(e);
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
function hl(n) {
  vt.set(n.name, n);
}
function la() {
  return Array.from(vt.keys());
}
class Yi {
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
const Y = /* @__PURE__ */ new Map();
Y.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Y.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: !0,
  viewBox: "0 0 100 60"
});
Y.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Y.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
Y.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
Y.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
Y.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95"
});
Y.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87"
});
Y.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
Y.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Y.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Y.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Y.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60"
});
Y.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100"
});
function en(n) {
  return Y.get(n.toLowerCase());
}
function ha(n) {
  return Y.has(n.toLowerCase());
}
function ca(n, t) {
  Y.set(n.toLowerCase(), t);
}
function da() {
  return Array.from(Y.keys());
}
function Xi(n) {
  return ["rectangle", "circle", "ellipse"].includes(n.toLowerCase());
}
function Wi(n, t) {
  if (t) {
    const e = en(t);
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
    const e = en(n);
    if (e) return e;
  }
}
const ua = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getShape: en,
  getShapeNames: da,
  hasShape: ha,
  isNativeShape: Xi,
  registerShape: ca,
  resolveShapePath: Wi
}, Symbol.toStringTag, { value: "Module" }));
function Vt(n) {
  const t = { ...n };
  return n.xPos !== void 0 && t.x === void 0 && (t.x = n.xPos, delete t.xPos), n.yPos !== void 0 && t.y === void 0 && (t.y = n.yPos, delete t.yPos), n.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = n.foregroundColor, delete t.foregroundColor), n.shapeHint !== void 0 && t.shape === void 0 && (t.shape = fa(n.shapeHint), delete t.shapeHint), n.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = n.svgString, delete t.svgString), n.blnStraight !== void 0 && (t.isStraightLine = n.blnStraight, delete t.blnStraight), t;
}
function zt(n) {
  const t = { ...n };
  return t.xPos = n.x, t.yPos = n.y, t.foregroundColor = n.fontColor, n.shape && (t.shapeHint = n.shape), n.svgContent && (t.svgString = n.svgContent), t;
}
function xn(n) {
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
function ji(n) {
  return { ...n };
}
function _n(n) {
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
function Cn(n) {
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
function fa(n) {
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
function pa(n) {
  const t = {
    options: xn(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = Vt(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => _n(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
function ga(n) {
  const t = {
    options: ji(n.options || {}),
    nodes: [],
    shareId: n.shareId || ""
  };
  return Array.isArray(n.nodes) && (t.nodes = n.nodes.map((e) => {
    const i = zt(e.options || {}), s = { associations: [] };
    return e.relationships?.associations && (s.associations = e.relationships.associations.map(
      (o) => Cn(o)
    )), {
      options: i,
      relationships: s
    };
  })), t;
}
const ma = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  convertV1JsonToV2: pa,
  convertV2JsonToV1: ga,
  v1AssociationToV2: _n,
  v1NodeToV2: Vt,
  v1SlateToV2: xn,
  v2AssociationToV1: Cn,
  v2NodeToV1: zt,
  v2SlateToV1: ji
}, Symbol.toStringTag, { value: "Module" }));
class Vi {
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
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this._lastClickTime = 0, this._initFailed = !1, this._destroyed = !1, this._svgViewboxTimeoutId = null, this._dragEndTimeoutId = null, this._previewViewboxTimeoutId = null, this._connectTimeoutId = null, this.id = t.id || this.generateId(), this.slate = e, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: t }), this.options = {
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
    this.options.shape === "circle" && (e.preserveAspectRatio = !0), this.resizeRotate = new Ii(this, e), this.connector = new Oi(this, this.options.connector), this.relationships = new Bi(this), this.images = new Gi(this), this.editor = new Ui(this), this.links = new Fi(this), this.filters = new Zi(this), this.menu = new Yi(this), this.options.image && this.images.set(
      this.options.image,
      this.options.imageOrigWidth,
      this.options.imageOrigHeight
    ), this.options.filters?.vect && this.filters.apply(this.options.filters.vect, "vect"), this.options.filters?.text && this.filters.apply(this.options.filters.text, "text"), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), this.options.rotate?.rotationAngle && this.applyPositionAndRotation(), console.log("NODE_DEBUG: finishCreate continuing for", this.id), this.svgGroup.node.setAttribute("aria-label", this.options.text || "Unnamed node"), this._resolveReady();
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
      vectorPath: h,
      opacity: c
    } = this.options, d = { color: s, width: o };
    r === "dashed" ? d.dasharray = "8,4" : r === "dotted" && (d.dasharray = "2,4"), a !== void 0 && (d.opacity = a);
    const u = Wi(l, h);
    if (u && !Xi(l || "")) {
      const f = this.svgGroup.nested().size(t, e), g = f.path(u.path).fill(i).stroke(d);
      try {
        const p = g.bbox();
        p.width > 0 && p.height > 0 ? f.viewbox(p.x, p.y, p.width, p.height) : f.viewbox(u.viewBox);
      } catch {
        f.viewbox(u.viewBox);
      }
      c !== void 0 && g.opacity(c), this.backgroundRect = f;
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
      c !== void 0 && this.backgroundRect.opacity(c);
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
  /** Position the text element within the background shape based on alignment settings. */
  centerText() {
    if (!this.textElement) return;
    const { width: t, height: e, textXAlign: i, textYAlign: s, textOffset: o } = this.options, r = this.backgroundRect.x?.() ?? 0, a = this.backgroundRect.y?.() ?? 0;
    let l = r + t / 2 + (o?.x || 0), h = a + e / 2 + (o?.y || 0);
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
        h = a + 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "hanging");
        break;
      case "bottom":
        h = a + e - 5 + (o?.y || 0), this.textElement.attr("dominant-baseline", "auto");
        break;
      default:
        this.textElement.attr("dominant-baseline", "central");
        break;
    }
    this.textElement.attr({ x: l, y: h });
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
      }, this._dragStartPointer = this.pointerFromDragEvent(t), console.log("DRAG_DEBUG: Stored pre-drag transform:", this.preDragTransform, "position:", this.preDragPosition), this.slate.disableNodeResizeRotate(this);
    }), this.svgGroup.on("dragend.node", (t) => {
      console.log("DRAG_DEBUG: Drag ended on", this.id);
      const e = this.pointerFromDragEvent(t);
      if (e && this._dragStartPointer && this.preDragPosition) {
        const i = this.slate.getZoom?.() || 1;
        this.options.x = this.preDragPosition.x + (e.x - this._dragStartPointer.x) / i, this.options.y = this.preDragPosition.y + (e.y - this._dragStartPointer.y) / i;
      }
      this.preDragTransform = null, this.preDragPosition = null, this._dragStartPointer = null, this.applyPositionAndRotation(), this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [zt(this.options)]
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
      const h = performance.now(), c = () => {
        if (this._destroyed || !this.svgGroup) return;
        const d = Math.min(1, (performance.now() - h) / o), u = d < 0.5 ? 2 * d * d : 1 - Math.pow(-2 * d + 2, 2) / 2;
        this.options.x = r + (t - r) * u, this.options.y = a + (e - a) * u, this.applyPositionAndRotation(), d < 1 ? requestAnimationFrame(c) : (this.options.x = t, this.options.y = e, this.applyPositionAndRotation(), i && i());
      };
      requestAnimationFrame(c);
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
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof ue)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof ke) {
      const i = Math.min(t, e);
      this.backgroundRect.size(i, i), this.options.width = i, this.options.height = i;
    } else if (this.backgroundRect instanceof he)
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
  /**
   * Change the node[s background and/or border colors.
   *
   * @param backgroundColor - New fill color (or undefined to keep current)
   * @param borderColor     - New stroke color (or undefined to keep current)
   */
  setColors(t, e) {
    t && (this.options.backgroundColor = t, this.backgroundRect.fill(t)), e && (this.options.borderColor = e, this.backgroundRect.stroke({ color: e })), (t || e) && this.slate.broadcast?.("onNodeColorChanged", {
      id: this.id,
      color: this.options.backgroundColor,
      borderColor: this.options.borderColor
    });
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
        const l = Math.min(1, (performance.now() - r) / e), h = l < 0.5 ? 2 * l * l : 1 - Math.pow(-2 * l + 2, 2) / 2;
        this.options.rotate.rotationAngle = i + o * h, this.applyPositionAndRotation(), l < 1 ? requestAnimationFrame(a) : (this.options.rotate.rotationAngle = t, this.applyPositionAndRotation());
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
        ) <= e) {
          console.log(
            "SELECTION_DEBUG: Node clicked (position-based detection)",
            this.id
          );
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
      ), l.on("mouseleave", () => this.hideConnectionPreview()), l.on("click", (h) => {
        h.stopPropagation(), console.log(
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
    const t = this.backgroundRect.bbox(), e = this.backgroundRect.screenCTM(), s = this.backgroundRect.root().screenCTM().inverseO().multiplyO(e), o = ([d, u], { a: f, b: g, c: p, d: y, e: m, f: b }) => [d * f + u * p + m, d * g + u * y + b], r = t.x + t.width / 2, a = t.y + t.height / 2, l = 35, h = 20, c = {
      top: [r, t.y - l],
      right: [t.x + t.width + h, a],
      bottom: [r, t.y + t.height + h],
      left: [t.x - h, a]
    };
    Object.entries(c).forEach(([d, u]) => {
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
    const i = this.options.width, s = this.options.height, o = 75, r = this.getRotation(), a = this.backgroundRect.rbox(this.backgroundRect.root()), l = a.cx, h = a.cy, c = this.connectionHandles[t];
    if (!c) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const d = c.bbox(), u = {
      x: d.x + d.width / 2,
      y: d.y + d.height / 2
    }, f = u.x - l, g = u.y - h, p = Math.sqrt(f * f + g * g), y = f / p, m = g / p, b = this.backgroundRect.bbox(), v = b.x + b.width / 2, w = b.y + b.height / 2, x = this.backgroundRect.screenCTM(), G = this.backgroundRect.root().screenCTM().inverseO().multiplyO(x), U = G.inverse(), q = y * U.a + m * U.c, ct = y * U.b + m * U.d;
    let k, W;
    const X = Math.abs(q);
    Math.abs(ct) > X ? ct < 0 ? (k = v, W = b.y) : (k = v, W = b.y + b.height) : q < 0 ? (k = b.x, W = w) : (k = b.x + b.width, W = w);
    const P = ([J, rt], { a: It, b: C, c: bt, d: wt, e: $t, f: qt }) => [J * It + rt * bt + $t, J * C + rt * wt + qt], [j, K] = P([k, W], G), st = Math.sqrt(
      Math.pow(j - l, 2) + Math.pow(K - h, 2)
    ), ot = st, yt = st + o + ot, Pt = l + y * yt, Q = h + m * yt, _ = Pt - i / 2, N = Q - s / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      _,
      N,
      i,
      s,
      r
      // Pass rotation angle to preview
    );
    const dt = st + o - p, ut = {
      x: u.x + y * dt,
      y: u.y + m * dt
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(u.x, u.y, ut.x, ut.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      u,
      ut
    );
  }
  createPreviewShape(t, e, i, s, o, r = 0) {
    let a;
    const l = this.options.backgroundColor || "#007cff", h = "#ffffff", c = 2, d = 0.6, u = e + s / 2, f = i + o / 2;
    switch (this.options.shape) {
      case "circle":
        const g = Math.min(s, o) / 2;
        a = t.circle(g * 2).center(u, f).fill(l).stroke({ color: h, width: c }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      case "ellipse":
        a = t.ellipse(s, o).center(u, f).fill(l).stroke({ color: h, width: c }).opacity(d), r !== 0 && a.rotate(r, u, f);
        break;
      default:
        if (this.options.svgContent) {
          a = t.rect(s, o).move(e, i).fill("none").stroke({ color: h, width: c }).opacity(d).radius(4);
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
          a = t.rect(s, o).move(e, i).fill(l).stroke({ color: h, width: c }).opacity(d).radius(4), r !== 0 && a.rotate(r, u, f);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, i) {
    const s = i.x - e.x, o = i.y - e.y, r = Math.sqrt(s * s + o * o);
    if (r === 0) return;
    const a = s / r, l = o / r, h = 12, c = 6, d = i.x, u = i.y, f = d - a * h, g = u - l * h, p = -l * c, y = a * c, m = [
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
      const h = a * Math.cos(r) - l * Math.sin(r), c = a * Math.sin(r) + l * Math.cos(r), d = this.backgroundRect.rbox(this.backgroundRect.root()), u = d.cx, f = d.cy, g = this.backgroundRect.bbox(), p = g.x + g.width / 2, y = g.y + g.height / 2;
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
      const v = this.backgroundRect.screenCTM(), x = this.backgroundRect.root().screenCTM().inverseO().multiplyO(v), B = ([st, ot], { a: yt, b: Pt, c: Q, d: _, e: N, f: Z }) => [st * yt + ot * Q + N, st * Pt + ot * _ + Z], [G, U] = B([m, b], x), q = Math.sqrt(
        Math.pow(G - u, 2) + Math.pow(U - f, 2)
      ), ct = q, k = q + s + ct, W = u + h * k, X = f + c * k, mt = W - e / 2, P = X - i / 2, j = this.cloneNodeOptions(mt, P, o), K = this.slate.addNode(j);
      if (!K) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        K.id,
        "at",
        mt,
        P
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
class ya {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Vi(t, this.slate);
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
    const { parentId: e, childId: i } = t || {}, s = e ? this.one(e) : void 0, o = i ? this.one(i) : void 0;
    if (!s || !o) {
      console.warn(
        "NODESMANAGER_DEBUG: addRelationship missing nodes",
        e,
        i
      );
      return;
    }
    s.relationships?.getAssociation?.(i) || s.relationships?.addAssociation(o, t);
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
class ba {
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
    else if (t.data.id && t.data.options && !t.data.nodeOptions)
      this.slate.nodes.one(t.data.id) && this.slate.nodes.add({
        ...t.data.options,
        x: t.data.targetXPos || 100,
        y: t.data.targetYPos || 100
      });
    else {
      let e = t.data.nodeOptions;
      Array.isArray(e) || (e = [e]), e.filter(Boolean).forEach((i) => {
        this.slate.nodes.one(i.id) || this.slate.nodes.add(Vt(i));
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
    ), t.data.opacity !== void 0 && (e.options.opacity = t.data.opacity));
  }
  onNodeTextChanged(t) {
    const e = this.slate.nodes.one(t.data.id);
    e && (e.setText(t.data.text), t.data.fontSize !== void 0 && (e.options.fontSize = t.data.fontSize), t.data.fontFamily !== void 0 && (e.options.fontFamily = t.data.fontFamily), t.data.fontColor !== void 0 && (e.options.fontColor = t.data.fontColor), t.data.textOpacity !== void 0 && (e.options.textOpacity = t.data.textOpacity), t.data.textXAlign !== void 0 && (e.options.textXAlign = t.data.textXAlign), t.data.textYAlign !== void 0 && (e.options.textYAlign = t.data.textYAlign));
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
    this.slate.nodes.moveNodes(t);
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
      const e = this.slate.options.containerStyle?.prevBackgroundColor || "#fff";
      this.slate.options.containerStyle.backgroundColor = e, this.slate.options.containerStyle.backgroundImage = void 0, this.slate.options.containerStyle.backgroundEffect = void 0;
    }
  }
  onSlateBackgroundColorChanged(t) {
    const e = this.slate.options.containerStyle;
    e.backgroundColor = t.data.color, e.backgroundColorAsGradient = t.data.asGradient, e.backgroundGradientType = t.data.gradientType, e.backgroundGradientColors = t.data.gradientColors, e.backgroundGradientStrategy = t.data.gradientStrategy, e.backgroundImage = void 0, e.backgroundEffect = void 0;
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
class $i {
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
        const a = Math.exp(-e.deltaY * 25e-4), l = this.options.zoomMin ?? 0.1, h = this.options.zoomMax ?? 10;
        let d = o / i.width * a;
        d = Math.max(l, Math.min(h, d));
        const u = o / d, f = i.height / i.width * u, g = e.clientX - s.left, p = e.clientY - s.top, y = i.x + g * r, m = i.y + p * (i.height / s.height || r), b = y - g / o * u, v = m - p / (s.height || o) * f;
        this.canvas.viewbox(b, v, u, f);
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
      const v = b.options.x ?? 0, w = b.options.y ?? 0, x = b.options.width ?? 100, B = b.options.height ?? 60;
      e = Math.min(e, v), i = Math.min(i, w), s = Math.max(s, v + x), o = Math.max(o, w + B);
    }
    if (!isFinite(e)) return;
    const r = s - e, a = o - i, l = 50, h = r + l * 2, c = a + l * 2, d = this.containerPx(), u = d.w / d.h, f = h / c;
    let g = h, p = c;
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
    for (const h of t) {
      const c = h.options.x ?? 0, d = h.options.y ?? 0, u = h.options.width ?? 100, f = h.options.height ?? 60;
      i = Math.min(i, c), s = Math.min(s, d), o = Math.max(o, c + u), r = Math.max(r, d + f);
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
class qi {
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
    const e = t.getZoom() || 1, i = t.getPan() || { x: 0, y: 0 }, s = this.options.width || 200, o = this.options.height || 150, r = this.calculateContentBounds(), a = Math.max(r.maxX - r.minX, 1), l = Math.max(r.maxY - r.minY, 1), h = 100, c = a + h * 2, d = l + h * 2;
    this.scale = Math.min(
      s / c,
      o / d
    );
    const u = (this.slate.options.viewPort?.originalWidth || 800) / e, f = (this.slate.options.viewPort?.originalHeight || 600) / e, g = (i.x - r.minX + h) * this.scale, p = (i.y - r.minY + h) * this.scale, y = u * this.scale, m = f * this.scale;
    this.viewportIndicator.move(g, p), this.viewportIndicator.size(Math.max(y, 10), Math.max(m, 10));
  }
  updateNodePosition(t) {
    if (!this._enabled) return;
    const e = this.nodeShapes.get(t.id);
    if (!e) return;
    const i = this.calculateContentBounds(), s = 100, o = (t.options.x - i.minX + s) * this.scale, r = (t.options.y - i.minY + s) * this.scale;
    e.move(o, r);
  }
  addNodeShape(t) {
    if (!this._enabled || !this.miniCanvas) return;
    const e = this.calculateContentBounds(), i = 100, s = (t.options.x - e.minX + i) * this.scale, o = (t.options.y - e.minY + i) * this.scale, r = (t.options.width || 100) * this.scale, a = (t.options.height || 60) * this.scale;
    let l;
    if (t.options.shape === "circle") {
      const h = Math.min(r, a) / 2;
      l = this.miniCanvas.circle(h * 2).move(s, o);
    } else
      l = this.miniCanvas.rect(r, a).move(s, o);
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
    this.container && (this.miniCanvas = Re().addTo(this.container).size(this.options.width, this.options.height), this.miniCanvas.rect(this.options.width, this.options.height).fill("#f8f9fa"));
  }
  renderNodes() {
    if (!this.miniCanvas) return;
    this.nodeShapes.forEach((l) => l.remove()), this.nodeShapes.clear();
    const t = this.calculateContentBounds(), e = 100, i = Math.max(t.maxX - t.minX, 1), s = Math.max(t.maxY - t.minY, 1), o = i + e * 2, r = s + e * 2;
    this.scale = Math.min(
      this.options.width / o,
      this.options.height / r
    ), this.slate.getAllNodes().forEach((l) => {
      const h = (l.options.x - t.minX + e) * this.scale, c = (l.options.y - t.minY + e) * this.scale, d = Math.max((l.options.width || 100) * this.scale, 2), u = Math.max((l.options.height || 60) * this.scale, 2);
      let f;
      if (l.options.shape === "circle") {
        const p = Math.min(d, u) / 2;
        f = this.miniCanvas.circle(p * 2).move(h, c);
      } else
        f = this.miniCanvas.rect(d, u).move(h, c);
      f.fill(l.options.backgroundColor || this.options.nodeColor), f.stroke({ width: 0 });
      const g = l.options.rotate?.rotationAngle || 0;
      if (g !== 0) {
        const p = h + d / 2, y = c + u / 2;
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
    const r = this.calculateContentBounds(), a = 100, l = s / this.scale + r.minX - a, h = o / this.scale + r.minY - a;
    this.slate.panZoom?.pan({ x: l, y: h });
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
      const l = this.slate.options.viewPort?.originalWidth || 800, h = this.slate.options.viewPort?.originalHeight || 600;
      return { minX: 0, minY: 0, maxX: l, maxY: h };
    }
    let e = 1 / 0, i = 1 / 0, s = -1 / 0, o = -1 / 0;
    t.forEach((l) => {
      const h = l.options.x || 0, c = l.options.y || 0, d = l.options.width || 100, u = l.options.height || 60;
      e = Math.min(e, h), i = Math.min(i, c), s = Math.max(s, h + d), o = Math.max(o, c + u);
    });
    const r = this.slate.options.viewPort?.originalWidth || 800, a = this.slate.options.viewPort?.originalHeight || 600;
    return e = Math.min(e, 0), i = Math.min(i, 0), s = Math.max(s, r), o = Math.max(o, a), { minX: e, minY: i, maxX: s, maxY: o };
  }
}
function Ne(n, t, e) {
  const s = (t || n.nodes.allNodes).map(
    (o) => Ki(o)
  );
  return e && s.forEach((o, r) => {
    o.options._presentationIndex = r;
  }), {
    options: va(n.options),
    nodes: s,
    shareId: n.options.shareId || ""
  };
}
async function En(n, t, e = !1, i = !1) {
  const s = typeof n == "string" ? JSON.parse(n) : n;
  t.beginRemoteApply?.();
  try {
    await wa(s, t, e, i);
  } finally {
    t.endRemoteApply?.();
  }
}
async function wa(n, t, e, i) {
  if (n.options) {
    const o = n.options;
    Object.assign(t.options, o), n.shareId && (t.options.shareId = n.shareId), t.applyContainerStyle?.();
  }
  e || t.nodes.clear();
  const s = /* @__PURE__ */ new Map();
  if (Array.isArray(n.nodes)) {
    for (const r of n.nodes) {
      const a = Qi(r.options), l = t.nodes.one(a.id);
      if (l)
        Object.assign(l.options, a), a.x !== void 0 && a.y !== void 0 && l.position(a.x, a.y), s.set(a.id, l);
      else {
        const h = t.addNode(a);
        h && s.set(h.id, h);
      }
    }
    const o = [];
    for (const r of s.values())
      r.ready && o.push(r.ready);
    o.length > 0 && await Promise.all(o);
    for (const r of n.nodes) {
      const a = r.options.id || r.options.xPos !== void 0 ? Vt(r.options).id : r.options.id;
      if (!a) continue;
      const l = s.get(a) || t.nodes.one(a);
      if (!l) continue;
      const h = r.relationships?.associations;
      if (!(!Array.isArray(h) || h.length === 0))
        for (const c of h) {
          const d = _n(c), u = s.get(d.childId) || t.nodes.one(d.childId);
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
      let l = 1 / 0, h = -1 / 0;
      for (const c of a) {
        const d = c.options.x ?? 0, u = c.options.width ?? 100;
        l = Math.min(l, d), h = Math.max(h, d + u);
      }
      return (l + h) / 2;
    }, r = (a) => {
      if (t._destroyed) return;
      const l = t.element?.getBoundingClientRect?.(), h = !!l && l.width > 1 && l.height > 1, c = o();
      if (h && c !== null) {
        try {
          t.fitToContent();
        } catch {
        }
        const d = t.canvas?.viewbox?.();
        if (d && Math.abs(d.x + d.width / 2 - c) < d.width / 2) {
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
function Ki(n) {
  const t = zt(n.options);
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
      ...i.associations.map((s) => Cn(s))
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
function Qi(n) {
  return Vt(n);
}
function va(n) {
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
function Ji(n) {
  return Ne(n);
}
const xa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  deserialize: En,
  deserializeNodeOptions: Qi,
  serialize: Ne,
  serializeNode: Ki,
  snapshot: Ji
}, Symbol.toStringTag, { value: "Module" }));
class ts {
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
  /** Destroy the undo/redo system, clearing all history and references */
  destroy() {
    this.clear(), this.isRestoring = !1, this.slate = null;
  }
  // ─── Private ─────────────────────────────────────────────────────
  takeSnapshot() {
    const t = Ne(this.slate);
    this.redoStack = [], this.undoStack.push(t), this.undoStack.length > this.options.maxHistory && this.undoStack.shift(), console.log(
      "UNDOREDO_DEBUG: Snapshot taken. Stack size:",
      this.undoStack.length
    );
  }
  restore(t) {
    this.isRestoring = !0, En(t, this.slate, !1, !0).catch((e) => console.error("UNDOREDO_DEBUG: Restore failed", e)).finally(() => {
      this.isRestoring = !1;
    });
  }
}
class es {
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
      const s = Math.min(this.startPoint.x, i.x), o = Math.min(this.startPoint.y, i.y), r = Math.abs(i.x - this.startPoint.x), a = Math.abs(i.y - this.startPoint.y);
      this.selectionRect.move(s, o).size(r, a);
    }), t.on("pointerup.multiselect", (e) => {
      if (!this.isSelecting || !this.startPoint) return;
      const i = this.getSvgPoint(e);
      if (!i) return;
      const s = Math.min(this.startPoint.x, i.x), o = Math.min(this.startPoint.y, i.y), r = Math.abs(i.x - this.startPoint.x), a = Math.abs(i.y - this.startPoint.y);
      r > 5 && a > 5 && this.selectNodesInRect(s, o, r, a, e.shiftKey), this.cancelSelection();
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
    const r = [], a = this.slate.nodes.allNodes;
    for (const l of a)
      try {
        const h = l.svgGroup.bbox();
        h.x < t + i && h.x + h.width > t && h.y < e + s && h.y + h.height > e && r.push(l);
      } catch {
      }
    r.length > 0 && (this.slate.selectNodes(r, o), console.log(
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
class ns {
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
    const t = this.slate.canvas, e = t.viewbox(), i = this.options.gridSize, s = this.options.gridColor, o = this.options.gridOpacity, r = Math.floor(e.x / i) * i - i * 5, a = Math.floor(e.y / i) * i - i * 5, l = e.x + e.width + i * 5, h = e.y + e.height + i * 5;
    this.gridGroup = t.group().attr("pointer-events", "none");
    for (let c = r; c <= l; c += i)
      this.gridGroup.line(c, a, c, h).stroke({ color: s, width: 0.5, opacity: o });
    for (let c = a; c <= h; c += i)
      this.gridGroup.line(r, c, l, c).stroke({ color: s, width: 0.5, opacity: o });
    this.gridGroup.back();
  }
}
class is {
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
      case "?":
        console.log(
          `SlateboxJS Keyboard Shortcuts:
  Delete/Backspace — remove selected
  Ctrl+Z — undo
  Ctrl+Y — redo
  Ctrl+A — select all
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
  nudge(t, e, i) {
    const s = this.slate.getSelectedNodes();
    if (s.length !== 0) {
      i.preventDefault();
      for (const o of s) {
        const r = (o.options.x || 0) + t, a = (o.options.y || 0) + e;
        o.position(r, a);
      }
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
function Sn(n, t = {}, e) {
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
      s.querySelectorAll(l).forEach((c) => c.remove());
    if (t.noBackground) {
      const l = s.querySelector("rect[data-background]");
      l && l.remove();
    }
    if (t.backgroundOnly)
      s.querySelectorAll("[data-node-id]").forEach((h) => h.remove());
    else if (t.nodes) {
      const l = new Set(
        t.nodes.map((c) => typeof c == "string" ? c : c.id)
      );
      s.querySelectorAll("[data-node-id]").forEach((c) => {
        const d = c.getAttribute("data-node-id");
        d && !l.has(d) && c.remove();
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
async function ss(n, t = {}, e) {
  const i = Sn(n, t);
  if (!i) {
    const o = t.asBinary ? new Blob() : "";
    return e?.(o), o;
  }
  const s = t.scale || 2;
  try {
    const r = n.canvas.viewbox(), a = r.width * s, l = r.height * s, h = document.createElement("canvas");
    h.width = a, h.height = l;
    const c = h.getContext("2d");
    t.alpha || (c.fillStyle = n.options.containerStyle?.backgroundColor || "#ffffff", c.fillRect(0, 0, a, l));
    const d = new Image(), u = new Blob([i], {
      type: "image/svg+xml;charset=utf-8"
    }), f = URL.createObjectURL(u);
    return new Promise((g, p) => {
      d.onload = () => {
        if (c.drawImage(d, 0, 0, a, l), URL.revokeObjectURL(f), t.asBinary)
          h.toBlob(
            (y) => {
              const m = y || new Blob();
              e?.(m), g(m);
            },
            "image/png"
          );
        else {
          const y = h.toDataURL("image/png"), m = t.base64 ? y.split(",")[1] : y;
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
const _a = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPNG: ss,
  exportSVG: Sn
}, Symbol.toStringTag, { value: "Module" }));
class os {
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
        a.transaction.local || a.changes.keys.forEach((l, h) => {
          if (l.action === "add" || l.action === "update") {
            const c = this.collabMap.get(h);
            c && this.handleRemotePackage(c);
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
        this.collabMap.set(s, {
          ...i,
          clientID: this.clientID,
          timestamp: Date.now()
        });
      }
    else
      console.log(
        "COLLAB_DEBUG: send() before collab init — emitting locally only"
      );
    for (const i of e)
      this.slate.emitSlateChange?.(i.type, i.data);
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
      const l = 8, h = 4;
      i.rect(r + l * 2, a + h * 2).radius(6).fill("#fff").stroke({ color: t.color, width: 1 }).back(), o.move(l, h), i.transform({ translateX: 16, translateY: 6 }), e.attr("pointer-events", "none"), this.cursorElements.set(t.clientID, e);
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
function rs(n, t, e = !1, i = !1) {
  if (!t) return;
  t._id && (n.options.themeId = t._id), e && (n.options.syncWithTheme = !0), t.containerStyle?.backgroundColor && (n.options.containerStyle = n.options.containerStyle || {}, n.options.containerStyle.backgroundColor = t.containerStyle.backgroundColor), t.defaultLineColor && (n.options.defaultLineColor = t.defaultLineColor);
  const s = n.nodes.allNodes;
  !s || s.length === 0 || !t.styles || (s.forEach((o, r) => {
    const a = as(t, r);
    a && Ca(o, a);
  }), console.log("THEME_DEBUG: Applied theme", t.name || t._id));
}
function as(n, t) {
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
function Ca(n, t) {
  t.backgroundColor && (n.options.backgroundColor = t.backgroundColor), t.borderColor && (n.options.borderColor = t.borderColor), t.borderWidth !== void 0 && (n.options.borderWidth = t.borderWidth), t.fontColor && (n.options.fontColor = t.fontColor), t.fontFamily && (n.options.fontFamily = t.fontFamily), t.fontSize !== void 0 && (n.options.fontSize = t.fontSize), t.lineColor && (n.options.lineColor = t.lineColor), t.opacity !== void 0 && (n.options.opacity = t.opacity), n.setColors?.(t.backgroundColor, t.borderColor), n.textElement && (t.fontColor || t.fontSize || t.fontFamily) && n.textElement.font({
    fill: t.fontColor || n.options.fontColor,
    size: t.fontSize || n.options.fontSize,
    family: t.fontFamily || n.options.fontFamily
  });
}
const Ea = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyTheme: rs,
  buildNodeStyleFromTheme: as
}, Symbol.toStringTag, { value: "Module" }));
function ls(n, t = !1, e = 20) {
  const i = n.nodes.allNodes;
  if (i.length < 2) return;
  const s = 100;
  let o = !0, r = 0;
  for (; o && r < s; ) {
    o = !1, r++;
    for (let a = 0; a < i.length; a++)
      for (let l = a + 1; l < i.length; l++) {
        const h = i[a], c = i[l], d = h.options.x || 0, u = h.options.y || 0, f = h.options.width || 100, g = h.options.height || 60, p = c.options.x || 0, y = c.options.y || 0, m = c.options.width || 100, b = c.options.height || 60, v = d < p + m + e && d + f + e > p, w = u < y + b + e && u + g + e > y;
        if (v && w) {
          o = !0;
          const x = d + f / 2 - (p + m / 2), B = u + g / 2 - (y + b / 2), G = Math.sqrt(x * x + B * B) || 1, U = x / G * (e / 2), q = B / G * (e / 2);
          h.position(d + U, u + q), c.position(p - U, y - q);
        }
      }
  }
  if (t) {
    const a = i.reduce((h, c) => h + (c.options.x || 0), 0) / i.length, l = i.reduce((h, c) => h + (c.options.y || 0), 0) / i.length;
    for (const h of i) {
      const c = h.options.x || 0, d = h.options.y || 0, u = a - c, f = l - d;
      h.position(c + u * 0.05, d + f * 0.05);
    }
  }
  console.log(
    "LAYOUT_DEBUG: Overlap removal completed in",
    r,
    "iterations"
  );
}
function hs(n, t, e, i = !1) {
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
function cs(n) {
  return n.nodes.allNodes.map((t) => ({
    id: t.id,
    x: t.options.x || 0,
    y: t.options.y || 0
  }));
}
const Sa = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyLayout: hs,
  packageLayout: cs,
  removeLayoutOverlaps: ls
}, Symbol.toStringTag, { value: "Module" }));
class ds {
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
class us {
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
      const o = i.options._presentationIndex, r = s.options._presentationIndex;
      if (o !== void 0 && r !== void 0) return o - r;
      const a = (i.options.y || 0) - (s.options.y || 0);
      return Math.abs(a) > 30 ? a : (i.options.x || 0) - (s.options.x || 0);
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
        const s = i.svgGroup.bbox(), o = s.x + s.width / 2, r = s.y + s.height / 2;
        this.slate.pan({ x: -o + 400, y: -r + 300 }), this.slate.zoom(1.5);
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
  /** Destroy the presentation, stopping if active */
  destroy() {
    this.stop(), this.steps = [], this.currentStep = -1, this.slate = null;
  }
}
class Mn {
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
  init() {
    this.canvas = Re().addTo(this.element), this.canvas.node.setAttribute("role", "img"), this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas"), this.canvas.node.setAttribute("tabindex", "0"), this._liveRegion = document.createElement("div"), this._liveRegion.setAttribute("aria-live", "polite"), this._liveRegion.setAttribute("aria-atomic", "true"), this._liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;", this.element.appendChild(this._liveRegion), this.element.style.overflow = this.element.style.overflow || "hidden", getComputedStyle(this.element).position === "static" && (this.element.style.position = "relative");
    const t = this.canvas.node;
    t?.style && (t.style.width = "100%", t.style.height = "100%", t.style.display = "block"), t?.removeAttribute?.("width"), t?.removeAttribute?.("height"), t?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");
    const e = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    const i = this.options.viewPort.originalWidth || Math.round(e.width) || 800, s = this.options.viewPort.originalHeight || Math.round(e.height) || 600;
    this.options.viewPort.originalWidth = i, this.options.viewPort.originalHeight = s;
    const o = this.options.viewPort.left ?? 0, r = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(o, r, i, s), this._setupResizeObserver(), this.nodes = new ya(this), this.invoker = new ba(this), this.applyContainerStyle(), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new $i(this, this.options.panZoom), this.birdsEye = new qi(this, this.options.birdsEye), this.options.birdsEye?.enabled && (this._birdsEyeTimeoutId = setTimeout(() => {
      this._destroyed || this.birdsEye.enable();
    }, 200)), this.undoRedo = new ts(this, {
      enabled: this.options.showUndoRedo !== !1
    }), this.multiSelection = new es(this, {
      enabled: this.options.showMultiSelect !== !1
    }), this.grid = new ns(this, {
      enabled: this.options.viewPort?.showGrid || !1,
      gridSize: this.options.viewPort?.gridSize || 20
    }), this.options.viewPort?.showGrid && this.grid.show(), this.keyboard = new is(this), this.options.enabled !== !1 && this.keyboard.bindGlobal(), this.collab = new os(this), this.zoomSlider = new ds(this, {
      enabled: this.options.showZoom || !1
    }), this.presentation = new us(this), this.makeResponsive(), this.options.viewPort?.showCoordinates && (this._coordDisplayTimeoutId = setTimeout(() => {
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
    t && t.remove(), this.canvas.off("click"), this.panZoom && this.panZoom.destroy(), this.birdsEye && this.birdsEye.disable(), this.zoomSlider && this.zoomSlider.destroy(), this.keyboard && this.keyboard.unbindGlobal(), this.multiSelection && this.multiSelection.disable(), this.undoRedo && this.undoRedo.clear(), this.collab && this.collab.disconnect(), this.presentation && this.presentation.stop(), this.grid && this.grid.hide(), this.nodes && this.nodes.clear(), this.canvas && this.canvas.remove(), this._liveRegion && (this._liveRegion.remove(), this._liveRegion = null);
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
    this._applyingRemote || this._destroyed || (typeof this.collab?.send == "function" ? this.collab.send({ type: t, data: e }) : this.emitSlateChange(t, e));
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
      nodeOptions: zt(e.options)
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
      const l = r.x + r.width / 2, h = r.y + r.height / 2, c = s * a, d = o * a;
      this.canvas.viewbox(l - c / 2, h - d / 2, c, d), this.options.viewPort = this.options.viewPort || {}, this.options.viewPort.originalWidth = s, this.options.viewPort.originalHeight = o;
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
      let h = 1 / 0, c = 1 / 0, d = -1 / 0, u = -1 / 0;
      t.forEach((f) => {
        const g = f.options.x ?? 0, p = f.options.y ?? 0, y = f.options.width ?? 0, m = f.options.height ?? 0;
        h = Math.min(h, g - 10), c = Math.min(c, p - 10), d = Math.max(d, g + y + 10), u = Math.max(u, p + m + 10);
      }), o = Math.abs(h), r = Math.abs(c), i = d - h, s = u - c, s > i && (a = "portrait");
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
      ), t.target === this.canvas.node || t.target && t.target.tagName === "svg" ? (console.log("SELECTION_DEBUG: Canvas clicked - deselecting all"), this.clearSelection(), this.options.events?.onCanvasClicked?.(t)) : console.log(
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
    ), e || this.clearSelection(), t.forEach((s) => {
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
      const a = r.svgGroup.bbox(), l = (a.x - i.x) * s, h = (a.y - i.y) * o, c = a.width * s, d = a.height * o;
      r.setSize(c, d), r.position(e.x + l, e.y + h);
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
  // ─── Serialization API ──────────────────────────────────────────────
  /**
   * Export the slate to a JSON string in v1-compatible format.
   *
   * @param nodes - Optional subset of nodes to include
   * @param asPresentation - If true, includes presentation ordering
   * @returns JSON string
   */
  exportJSON(t, e) {
    const i = Ne(this, t, e);
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
    await En(t, this, e, i);
  }
  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  snapshot() {
    return Ji(this);
  }
  // ─── Export API ─────────────────────────────────────────────────
  /**
   * Export the slate as an SVG string.
   */
  svg(t, e) {
    return Sn(this, t, e);
  }
  /**
   * Export the slate as a PNG (async).
   */
  async png(t, e) {
    return ss(this, t, e);
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
    rs(this, t, e, i);
  }
  // ─── Layout API ─────────────────────────────────────────────────
  /** Remove overlapping nodes by pushing them apart */
  removeLayoutOverlaps(t, e) {
    ls(this, t, e);
  }
  /** Apply pre-computed layout moves */
  applyLayout(t, e, i) {
    hs(this, t, e, i);
  }
  /** Package current node positions for layout transfer */
  packageLayout() {
    return cs(this);
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
    await Hi(this);
  }
}
function Ma(n, t) {
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
function Ta(n, t) {
  const e = n.nodes.one(t);
  return !e || !e.options.isComment ? !1 : n.removeNode(t);
}
function ka(n) {
  return n.nodes.allNodes.filter(
    (t) => t.options.isComment === !0
  );
}
const Ra = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createComment: Ma,
  getComments: ka,
  removeComment: Ta
}, Symbol.toStringTag, { value: "Module" })), St = `	
\v\f\r   ᠎             　\u2028\u2029`, Aa = new RegExp(
  `([a-z])[${St},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${St}]*,?[${St}]*)+)`,
  "ig"
), fs = new RegExp(
  `(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${St}]*,?[${St}]*`,
  "ig"
), Na = new RegExp(
  `([rstm])[${St},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${St}]*,?[${St}]*)+)`,
  "ig"
);
function Da(n) {
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
    Aa,
    (i, s, o) => {
      const r = [];
      let a = s.toLowerCase();
      if (o.replace(fs, (l, h) => (h && r.push(+h), "")), a === "m" && r.length > 2 && (e.push([s, ...r.splice(0, 2)]), a = "l", s = s === "m" ? "l" : "L"), a === "r")
        e.push([s, ...r]);
      else
        for (; r.length >= t[a] && (e.push([s, ...r.splice(0, t[a])]), !!t[a]); )
          ;
      return "";
    }
  ), e;
}
function za(n) {
  const t = Da(n);
  if (!t.length) return [["M", 0, 0]];
  const e = [];
  let i = 0, s = 0, o = 0, r = 0, a = 0;
  t[0][0] === "M" && (i = +t[0][1], s = +t[0][2], o = i, r = s, a++, e[0] = ["M", i, s]);
  for (let l = a; l < t.length; l++) {
    const h = [""], c = t[l];
    if (e.push(h), c[0] !== c[0].toUpperCase())
      switch (h[0] = c[0].toUpperCase(), h[0]) {
        case "A":
          h[1] = c[1], h[2] = c[2], h[3] = c[3], h[4] = c[4], h[5] = c[5], h[6] = +c[6] + i, h[7] = +c[7] + s;
          break;
        case "V":
          h[1] = +c[1] + s;
          break;
        case "H":
          h[1] = +c[1] + i;
          break;
        case "M":
          o = +c[1] + i, r = +c[2] + s, h[1] = o, h[2] = r;
          break;
        default:
          for (let d = 1; d < c.length; d++)
            h[d] = +c[d] + (d % 2 ? i : s);
      }
    else
      for (let d = 0; d < c.length; d++) h[d] = c[d];
    switch (h[0]) {
      case "Z":
        i = o, s = r;
        break;
      case "H":
        i = h[1];
        break;
      case "V":
        s = h[1];
        break;
      case "M":
        o = h[h.length - 2], r = h[h.length - 1], i = h[h.length - 2], s = h[h.length - 1];
        break;
      default:
        i = h[h.length - 2], s = h[h.length - 1];
    }
  }
  return e;
}
function me(n, t, e, i) {
  return [n, t, e, i, e, i];
}
function Xn(n, t, e, i, s, o) {
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
function ye(n, t, e) {
  return { x: n * Math.cos(e) - t * Math.sin(e), y: n * Math.sin(e) + t * Math.cos(e) };
}
function ps(n, t, e, i, s, o, r, a, l, h) {
  const c = Math.PI * 120 / 180, d = Math.PI / 180 * (+s || 0);
  let u = [], f, g = 0, p = 0, y = 0, m = 0;
  if (h)
    g = h[0], p = h[1], y = h[2], m = h[3];
  else {
    f = ye(n, t, -d), n = f.x, t = f.y, f = ye(a, l, -d), a = f.x, l = f.y;
    const P = (n - a) / 2, j = (t - l) / 2;
    let K = P * P / (e * e) + j * j / (i * i);
    K > 1 && (K = Math.sqrt(K), e = K * e, i = K * i);
    const st = e * e, ot = i * i, yt = (o === r ? -1 : 1) * Math.sqrt(Math.abs((st * ot - st * j * j - ot * P * P) / (st * j * j + ot * P * P)));
    y = yt * e * j / i + (n + a) / 2, m = yt * -i * P / e + (t + l) / 2, g = Math.asin(Number(((t - m) / i).toFixed(9))), p = Math.asin(Number(((l - m) / i).toFixed(9))), g = n < y ? Math.PI - g : g, p = a < y ? Math.PI - p : p, g < 0 && (g = Math.PI * 2 + g), p < 0 && (p = Math.PI * 2 + p), r && g > p && (g -= Math.PI * 2), !r && p > g && (p -= Math.PI * 2);
  }
  let b = p - g;
  if (Math.abs(b) > c) {
    const P = p, j = a, K = l;
    p = g + c * (r && p > g ? 1 : -1), a = y + e * Math.cos(p), l = m + i * Math.sin(p), u = ps(a, l, e, i, s, 0, r, j, K, [p, P, y, m]);
  }
  b = p - g;
  const v = Math.cos(g), w = Math.sin(g), x = Math.cos(p), B = Math.sin(p), G = Math.tan(b / 4), U = 4 / 3 * e * G, q = 4 / 3 * i * G, ct = [n, t], k = [n + U * w, t - q * v], W = [a + U * B, l - q * x], X = [a, l];
  if (k[0] = 2 * ct[0] - k[0], k[1] = 2 * ct[1] - k[1], h)
    return [k[0], k[1], W[0], W[1], X[0], X[1]].concat(u);
  u = [k[0], k[1], W[0], W[1], X[0], X[1]].concat(u);
  const mt = [];
  for (let P = 0; P < u.length; P++)
    mt[P] = P % 2 ? ye(u[P - 1], u[P], d).y : ye(u[P], u[P + 1], d).x;
  return mt;
}
function gs(n) {
  const t = za(n), e = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null }, i = (l, h, c) => {
    if (!l) return ["C", h.x, h.y, h.x, h.y, h.x, h.y];
    switch (l[0] !== "T" && l[0] !== "Q" && (h.qx = null, h.qy = null), l[0]) {
      case "M":
        h.X = l[1], h.Y = l[2];
        break;
      case "A":
        return ["C", ...ps(h.x, h.y, ...l.slice(1))];
      case "S": {
        let d, u;
        return c === "C" || c === "S" ? (d = h.x * 2 - h.bx, u = h.y * 2 - h.by) : (d = h.x, u = h.y), ["C", d, u, ...l.slice(1)];
      }
      case "T":
        return c === "Q" || c === "T" ? (h.qx = h.x * 2 - h.qx, h.qy = h.y * 2 - h.qy) : (h.qx = h.x, h.qy = h.y), ["C", ...Xn(h.x, h.y, h.qx, h.qy, l[1], l[2])];
      case "Q":
        return h.qx = l[1], h.qy = l[2], ["C", ...Xn(h.x, h.y, l[1], l[2], l[3], l[4])];
      case "L":
        return ["C", ...me(h.x, h.y, l[1], l[2])];
      case "H":
        return ["C", ...me(h.x, h.y, l[1], h.y)];
      case "V":
        return ["C", ...me(h.x, h.y, h.x, l[1])];
      case "Z":
        return ["C", ...me(h.x, h.y, h.X, h.Y)];
    }
    return l;
  }, s = (l, h, c) => {
    if (l[h].length > 7) {
      l[h].shift();
      const d = l[h];
      for (; d.length; )
        c[h] = "A", l.splice(h++, 0, ["C", ...d.splice(0, 6)]);
      l.splice(h, 1);
    }
  }, o = [];
  let r = "", a = "";
  for (let l = 0; l < t.length; l++) {
    r = "", t[l] && (r = t[l][0]), r !== "C" && (o[l] = r, l && (a = o[l - 1])), t[l] = i(t[l], e, a), o[l] !== "A" && r === "C" && (o[l] = "C"), s(t, l, o);
    const h = t[l], c = h.length;
    e.x = h[c - 2], e.y = h[c - 1], e.bx = parseFloat(h[c - 4]) || e.x, e.by = parseFloat(h[c - 3]) || e.y;
  }
  return t;
}
function Pa(n, t, e, i, s, o, r, a) {
  const l = (f, g, p, y, m) => {
    const b = 1 - f;
    return b * b * b * g + 3 * b * b * f * p + 3 * b * f * f * y + f * f * f * m;
  }, h = [n, r], c = [t, a], d = (f, g, p) => {
    const y = [];
    if (Math.abs(f) < 1e-12) {
      if (Math.abs(g) > 1e-12) {
        const m = -p / g;
        m > 0 && m < 1 && y.push(m);
      }
    } else {
      const m = g * g - 4 * f * p;
      if (m >= 0) {
        const b = Math.sqrt(m), v = (-g + b) / (2 * f), w = (-g - b) / (2 * f);
        v > 0 && v < 1 && y.push(v), w > 0 && w < 1 && y.push(w);
      }
    }
    return y;
  }, u = (f, g, p, y) => {
    const m = 3 * (y - 3 * p + 3 * g - f), b = 6 * (p - 2 * g + f), v = 3 * (g - f);
    return d(m, b, v);
  };
  return u(n, e, s, r).forEach((f) => h.push(l(f, n, e, s, r))), u(t, i, o, a).forEach((f) => c.push(l(f, t, i, o, a))), {
    min: { x: Math.min(...h), y: Math.min(...c) },
    max: { x: Math.max(...h), y: Math.max(...c) }
  };
}
function ms(n) {
  const t = gs(n);
  if (!t.length)
    return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0, cx: 0, cy: 0 };
  let e = 0, i = 0;
  const s = [], o = [];
  for (const u of t)
    if (u[0] === "M")
      e = u[1], i = u[2], s.push(e), o.push(i);
    else {
      const f = Pa(e, i, ...u.slice(1));
      s.push(f.min.x, f.max.x), o.push(f.min.y, f.max.y), e = u[5], i = u[6];
    }
  const r = Math.min(...s), a = Math.min(...o), l = Math.max(...s), h = Math.max(...o), c = l - r, d = h - a;
  return {
    x: r,
    y: a,
    x2: l,
    y2: h,
    width: c,
    height: d,
    cx: r + c / 2,
    cy: a + d / 2
  };
}
class Wn {
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
    ], h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let c = 0; c < 3; c++)
      for (let d = 0; d < 3; d++) {
        let u = 0;
        for (let f = 0; f < 3; f++)
          u += a[c][f] * l[f][d];
        h[c][d] = u;
      }
    this.a = h[0][0], this.b = h[1][0], this.c = h[0][1], this.d = h[1][1], this.e = h[0][2], this.f = h[1][2];
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
function Ia(n) {
  if (!n) return [];
  if (Array.isArray(n)) return n;
  const t = [];
  return String(n).replace(Na, (e, i, s) => {
    const o = [];
    return s.replace(fs, (r, a) => (a && o.push(+a), "")), t.push([i, ...o]), "";
  }), t;
}
function Oa(n, t) {
  const e = Ia(n), i = new Wn();
  for (const s of e) {
    const o = s.length, r = String(s[0]).toLowerCase(), a = s[0] !== r, l = a ? new Wn() : null;
    if (r === "t" && o === 3)
      if (a) {
        const h = l.x(0, 0), c = l.y(0, 0);
        i.translate(s[1] - h, s[2] - c);
      } else
        i.translate(s[1], s[2]);
    else if (r === "r") {
      if (o === 2)
        i.rotate(s[1], t.x + t.width / 2, t.y + t.height / 2);
      else if (o === 4)
        if (a) {
          const h = l.x(s[2], s[3]), c = l.y(s[2], s[3]);
          i.rotate(s[1], h, c);
        } else
          i.rotate(s[1], s[2], s[3]);
    } else if (r === "s") {
      if (o === 2 || o === 3)
        i.scale(s[1], s[o - 1], t.x + t.width / 2, t.y + t.height / 2);
      else if (o === 4)
        if (a) {
          const h = l.x(s[2], s[3]), c = l.y(s[2], s[3]);
          i.scale(s[1], s[1], h, c);
        } else
          i.scale(s[1], s[1], s[2], s[3]);
      else if (o === 5)
        if (a) {
          const h = l.x(s[3], s[4]), c = l.y(s[3], s[4]);
          i.scale(s[1], s[2], h, c);
        } else
          i.scale(s[1], s[2], s[3], s[4]);
    } else r === "m" && o === 7 && i.add(s[1], s[2], s[3], s[4], s[5], s[6]);
  }
  return i;
}
function La(n, t) {
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
function Ba(n, t) {
  const e = gs(n), i = ms(e), s = Oa(t, i);
  return La(e, s).map((o) => o[0] + o.slice(1).join(",")).join("");
}
function Ee(n = 10) {
  const t = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let e = "";
  for (let i = 0; i < n; i++)
    e += t.charAt(Math.floor(Math.random() * t.length));
  return e;
}
function Ga(n) {
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
    const h = i(a), c = i(l);
    return (Math.max(h, c) + 0.05) / (Math.min(h, c) + 0.05);
  }
  const o = s(n || "#fff", "#ffffff"), r = s(n || "#fff", "#000000");
  return o > r ? "#ffffff" : "#000000";
}
function Ha(n, t = "normal 10pt Arial") {
  const e = String(n).split(`
`), i = t.split(" "), s = "normal", o = i?.[0]?.includes("pt") ? parseFloat(i?.[0]?.replace(/pt/gi, "")) : 10, r = i?.slice(1).join(" ").trim();
  if (typeof document > "u")
    return {
      width: Math.max(...e.map((d) => d.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  const a = document.createElement("canvas"), l = [], h = 0.98;
  if (e.forEach((d) => {
    const u = a.getContext("2d");
    if (!u) return;
    const f = o * h;
    u.font = `${s} ${f}pt ${r}`, l.push(u.measureText(d));
  }), a.remove(), l.length === 0)
    return {
      width: Math.max(...e.map((d) => d.length)) * o * 0.6,
      height: e.length * o * 1.4 + 10
    };
  let c = 0;
  return l.forEach((d) => {
    c += (d.actualBoundingBoxAscent || o) + (d.actualBoundingBoxDescent || o * 0.3) + 5;
  }), {
    width: Math.max(...l.map((d) => d.width)),
    height: c + 10
  };
}
function Ua(n) {
  return n?.path ? ms(n.path) : { x: 0, y: 0, x2: 100, y2: 100, width: 100, height: 100, cx: 50, cy: 50 };
}
function Fa(n, t) {
  return Ba(n, t);
}
function Za(n, t) {
  const e = String(n).split(/ /g), s = String(n).split("").length / t, o = [];
  let r = [], a = 0;
  return e.forEach((l) => {
    a += l.length, a < s || o.length === t - 1 ? r.push(l) : (o.push(r.join(" ")), a = l.length, r = [l]);
  }), r.length > 0 && o.push(r.join(" ")), o.join(`
`);
}
function Ya(n, t) {
  return Math.floor(Math.random() * (t - n + 1)) + n;
}
function Xa(n, t, e, i, s = !0) {
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
function Wa(n) {
  const { buildNodeStyleFromTheme: t } = require("./core/Theme");
  return t(n.theme, n.childNumber);
}
function ja(n) {
  return n.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
}
function Va(n) {
  return n instanceof HTMLElement || n instanceof SVGElement;
}
function $a(n) {
  return typeof document > "u" ? null : document.getElementById(n);
}
function qa() {
  return typeof navigator > "u" ? !1 : /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function Ka() {
  return typeof navigator > "u" ? !1 : /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function Qa(n) {
  n && (n.preventDefault(), n.stopPropagation());
}
function Ja(n, t) {
  const e = [];
  for (let i = 0; i < n.length; i += t)
    e.push(n.slice(i, i + t));
  return e;
}
const tl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  _transformPath: Fa,
  buildNodeStyleFromTheme: Wa,
  chunk: Ja,
  createMultiLineText: Za,
  el: $a,
  getBBox: Ua,
  getTextWidth: Ha,
  guid: Ee,
  isElement: Va,
  isMobile: Ka,
  isSafari: qa,
  obtainProportionateWidthAndHeightForResizing: Xa,
  randomInt: Ya,
  safeForUrls: ja,
  stopEvent: Qa,
  whiteOrBlack: Ga
}, Symbol.toStringTag, { value: "Module" }));
class Gt {
  constructor(t = {}) {
    this.options = { id: Ee(), ...t }, this.resize = new el(this), this.relationships = new nl(this);
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
}
class el {
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
class nl {
  constructor(t) {
    this.owner = t;
  }
  /** v1: `node.relationships.addAssociation(childNode, data?)` */
  addAssociation(t, e) {
    if (!this.owner.v2)
      throw new Error(
        "SLATEBOX_COMPAT: add the node to a slate before creating associations"
      );
    const i = t instanceof Gt ? t.v2 : t;
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
class il {
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
    const e = t instanceof Gt ? t : new Gt(t), i = Vt(e.options), s = this.v2Slate.addNode(i);
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
      const a = r.options || {}, l = zt(a);
      (r.relationships?.getAssociations?.() ?? []).forEach((c) => {
        i.push({
          parentId: c.parentId,
          childId: c.childId,
          lineWidth: c.lineWidth,
          lineType: c.lineType,
          lineCurveType: c.lineCurveType,
          lineCurviness: c.lineCurviness,
          lineOpacity: c.lineOpacity,
          showParentArrow: c.showParentArrow,
          showChildArrow: c.showChildArrow
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
      const h = String(a.groupId ?? "null");
      o[h] || (o[h] = []), o[h].push(r.id);
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
    ), s = t.nodes ? t.nodes.map((o) => o instanceof Gt ? o.v2 : o).filter(Boolean) : t.moves ? t.moves.map((o) => e.nodes.one(o.id)).filter(Boolean) : e.nodes.allNodes;
    return {
      dur: t.dur ?? 300,
      easing: t.easing ?? ">",
      textPositions: s.map((o) => ({
        id: o.id,
        textPosition: { x: 0, y: 0, transform: "" }
      })),
      nodeOptions: s.map((o) => {
        const r = i.get(o.id), a = zt(o.options || {});
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
    return e || (e = new Gt({ ...t.options }), e.options.id = t.id, e.v2 = t, e.slate = this.owner, this.wrappers.set(t.id, e)), e;
  }
}
class sl {
  constructor(t = {}, e = {}) {
    this.savingTemplateImage = !1, this.options = {
      ...t,
      id: t.id || Ee()
    }, this.events = e || {}, this._shareId = this.options.shareId || Ee(), this.nodes = new il(this), this.controller = {
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
    const t = this.resolveContainer(), e = xn(this.options);
    delete e.container, this.options.shareId === void 0 && (e.shareId = this._shareId), e.events = this.events, this.v2 = new Mn(t, e), await this.v2.getViewportAsync(), this.options.viewPort || (this.options.viewPort = {});
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
  /** v1: `slate.filters.availableFilters` — list of registered filter defs */
  get filters() {
    return {
      availableFilters: la().map((t) => ({ id: t }))
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
const Ct = class Ct {
  constructor(t) {
    this.registerPlugins(t);
  }
  registerPlugins(t) {
    const e = this.constructor.name, i = Ct.availablePlugins[e];
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
    Ct.availablePlugins[e] || (Ct.availablePlugins[e] = []), Ct.availablePlugins[e] = [...Ct.availablePlugins[e], t];
  }
};
Ct.availablePlugins = {};
let nn = Ct;
const ol = {
  slate: sl,
  node: Gt,
  base: nn,
  utils: tl
};
function rl(n, t = {}) {
  return new Mn(n, t);
}
typeof window < "u" && (window.SlateboxJS = rl, window.Slate = Mn, window.Node = Vi, window.PanZoom = $i, window.ResizeRotate = Ii, window.BirdsEye = qi, window.Connector = Oi, window.Serialization = xa, window.ShapeRegistry = ua, window.Relationship = sa, window.Relationships = Bi, window.FontLoader = aa, window.Images = Gi, window.Editor = Ui, window.UndoRedo = ts, window.MultiSelection = es, window.Grid = ns, window.Menu = Yi, window.Keyboard = is, window.Filters = Zi, window.Links = Fi, window.Export = _a, window.Collab = os, window.Theme = Ea, window.Layout = Sa, window.ZoomSlider = ds, window.Comments = Ra, window.Presentation = us, window.Slatebox = Object.assign({}, ol, { compat: ma }));
export {
  qi as BirdsEye,
  os as Collab,
  Ra as Comments,
  Oi as Connector,
  Ui as Editor,
  _a as ExportModule,
  Zi as Filters,
  aa as FontLoader,
  ns as Grid,
  Gi as Images,
  ba as Invoker,
  is as Keyboard,
  Sa as Layout,
  Fi as Links,
  Yi as Menu,
  es as MultiSelection,
  Vi as Node,
  ya as NodesManager,
  $i as PanZoom,
  us as Presentation,
  sa as Relationship,
  Bi as Relationships,
  Ii as ResizeRotate,
  xa as Serialization,
  ua as ShapeRegistry,
  Mn as Slate,
  ol as Slatebox,
  rl as SlateboxJS,
  Ea as Theme,
  ts as UndoRedo,
  ds as ZoomSlider,
  ma as compat,
  rl as default,
  la as getFilterNames,
  hl as registerFilter,
  tl as utils
};
//# sourceMappingURL=slateboxjs.es.js.map
