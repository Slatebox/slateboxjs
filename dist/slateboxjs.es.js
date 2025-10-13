const be = {}, nn = [];
function E(n, t) {
  if (Array.isArray(n)) {
    for (const e of n)
      E(e, t);
    return;
  }
  if (typeof n == "object") {
    for (const e in n)
      E(e, n[e]);
    return;
  }
  sn(Object.getOwnPropertyNames(t)), be[n] = Object.assign(be[n] || {}, t);
}
function j(n) {
  return be[n] || {};
}
function Vn() {
  return [...new Set(nn)];
}
function sn(n) {
  nn.push(...n);
}
function De(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    s.push(t(n[e]));
  return s;
}
function $n(n, t) {
  let e;
  const i = n.length, s = [];
  for (e = 0; e < i; e++)
    t(n[e]) && s.push(n[e]);
  return s;
}
function ue(n) {
  return n % 360 * Math.PI / 180;
}
function qn(n) {
  return n.replace(/([A-Z])/g, function(t, e) {
    return "-" + e.toLowerCase();
  });
}
function on(n) {
  return n.charAt(0).toUpperCase() + n.slice(1);
}
function At(n, t, e, i) {
  return (t == null || e == null) && (i = i || n.bbox(), t == null ? t = i.width / i.height * e : e == null && (e = i.height / i.width * t)), {
    width: t,
    height: e
  };
}
function ye(n, t) {
  const e = n.origin;
  let i = n.ox != null ? n.ox : n.originX != null ? n.originX : "center", s = n.oy != null ? n.oy : n.originY != null ? n.originY : "center";
  e != null && ([i, s] = Array.isArray(e) ? e : typeof e == "object" ? [e.x, e.y] : [e, e]);
  const o = typeof i == "string", r = typeof s == "string";
  if (o || r) {
    const { height: a, width: h, x: l, y: c } = t.bbox();
    o && (i = i.includes("left") ? l : i.includes("right") ? l + h : l + h / 2), r && (s = s.includes("top") ? c : s.includes("bottom") ? c + a : c + a / 2);
  }
  return [i, s];
}
const Wn = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), we = (n) => Wn.has(n.nodeName), rn = (n, t, e = {}) => {
  const i = { ...t };
  for (const s in i)
    i[s].valueOf() === e[s] && delete i[s];
  Object.keys(i).length ? n.node.setAttribute("data-svgjs", JSON.stringify(i)) : (n.node.removeAttribute("data-svgjs"), n.node.removeAttribute("svgjs:data"));
}, Me = "http://www.w3.org/2000/svg", Qn = "http://www.w3.org/1999/xhtml", de = "http://www.w3.org/2000/xmlns/", Vt = "http://www.w3.org/1999/xlink", C = {
  window: typeof window > "u" ? null : window,
  document: typeof document > "u" ? null : document
};
function ze() {
  return C.window;
}
class Ae {
  // constructor (node/*, {extensions = []} */) {
  //   // this.tags = []
  //   //
  //   // for (let extension of extensions) {
  //   //   extension.setup.call(this, node)
  //   //   this.tags.push(extension.name)
  //   // }
  // }
}
const _t = {}, Pe = "___SYMBOL___ROOT___";
function Xt(n, t = Me) {
  return C.document.createElementNS(t, n);
}
function Y(n, t = !1) {
  if (n instanceof Ae) return n;
  if (typeof n == "object")
    return fe(n);
  if (n == null)
    return new _t[Pe]();
  if (typeof n == "string" && n.charAt(0) !== "<")
    return fe(C.document.querySelector(n));
  const e = t ? C.document.createElement("div") : Xt("svg");
  return e.innerHTML = n, n = fe(e.firstChild), e.removeChild(e.firstChild), n;
}
function z(n, t) {
  return t && (t instanceof C.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : Xt(n);
}
function nt(n) {
  if (!n) return null;
  if (n.instance instanceof Ae) return n.instance;
  if (n.nodeName === "#document-fragment")
    return new _t.Fragment(n);
  let t = on(n.nodeName || "Dom");
  return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : _t[t] || (t = "Dom"), new _t[t](n);
}
let fe = nt;
function N(n, t = n.name, e = !1) {
  return _t[t] = n, e && (_t[Pe] = n), sn(Object.getOwnPropertyNames(n.prototype)), n;
}
function Jn(n) {
  return _t[n];
}
let Kn = 1e3;
function an(n) {
  return "Svgjs" + on(n) + Kn++;
}
function hn(n) {
  for (let t = n.children.length - 1; t >= 0; t--)
    hn(n.children[t]);
  return n.id && (n.id = an(n.nodeName)), n;
}
function v(n, t) {
  let e, i;
  for (n = Array.isArray(n) ? n : [n], i = n.length - 1; i >= 0; i--)
    for (e in t)
      n[i].prototype[e] = t[e];
}
function M(n) {
  return function(...t) {
    const e = t[t.length - 1];
    return e && e.constructor === Object && !(e instanceof Array) ? n.apply(this, t.slice(0, -1)).attr(e) : n.apply(this, t);
  };
}
function ti() {
  return this.parent().children();
}
function ei() {
  return this.parent().index(this);
}
function ni() {
  return this.siblings()[this.position() + 1];
}
function ii() {
  return this.siblings()[this.position() - 1];
}
function si() {
  const n = this.position();
  return this.parent().add(this.remove(), n + 1), this;
}
function oi() {
  const n = this.position();
  return this.parent().add(this.remove(), n ? n - 1 : 0), this;
}
function ri() {
  return this.parent().add(this.remove()), this;
}
function ai() {
  return this.parent().add(this.remove(), 0), this;
}
function hi(n) {
  n = Y(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t), this;
}
function li(n) {
  n = Y(n), n.remove();
  const t = this.position();
  return this.parent().add(n, t + 1), this;
}
function ci(n) {
  return n = Y(n), n.before(this), this;
}
function ui(n) {
  return n = Y(n), n.after(this), this;
}
E("Dom", {
  siblings: ti,
  position: ei,
  next: ni,
  prev: ii,
  forward: si,
  backward: oi,
  front: ri,
  back: ai,
  before: hi,
  after: li,
  insertBefore: ci,
  insertAfter: ui
});
const ln = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, di = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, fi = /rgb\((\d+),(\d+),(\d+)\)/, pi = /(#[a-z_][a-z0-9\-_]*)/i, mi = /\)\s*,?\s*/, gi = /\s/g, $e = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, qe = /^rgb\(/, We = /^(\s+)?$/, Qe = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, bi = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, ut = /[\s,]+/, ke = /[MLHVCSQTAZ]/i;
function yi() {
  const n = this.attr("class");
  return n == null ? [] : n.trim().split(ut);
}
function wi(n) {
  return this.classes().indexOf(n) !== -1;
}
function xi(n) {
  if (!this.hasClass(n)) {
    const t = this.classes();
    t.push(n), this.attr("class", t.join(" "));
  }
  return this;
}
function _i(n) {
  return this.hasClass(n) && this.attr(
    "class",
    this.classes().filter(function(t) {
      return t !== n;
    }).join(" ")
  ), this;
}
function vi(n) {
  return this.hasClass(n) ? this.removeClass(n) : this.addClass(n);
}
E("Dom", {
  classes: yi,
  hasClass: wi,
  addClass: xi,
  removeClass: _i,
  toggleClass: vi
});
function Ei(n, t) {
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
          n[i] == null || We.test(n[i]) ? "" : n[i]
        );
  }
  return arguments.length === 2 && this.node.style.setProperty(
    n,
    t == null || We.test(t) ? "" : t
  ), this;
}
function Ci() {
  return this.css("display", "");
}
function Ni() {
  return this.css("display", "none");
}
function Si() {
  return this.css("display") !== "none";
}
E("Dom", {
  css: Ei,
  show: Ci,
  hide: Ni,
  visible: Si
});
function Ti(n, t, e) {
  if (n == null)
    return this.data(
      De(
        $n(
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
E("Dom", { data: Ti });
function Ri(n, t) {
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
function Oi() {
  if (arguments.length === 0)
    this._memory = {};
  else
    for (let n = arguments.length - 1; n >= 0; n--)
      delete this.memory()[arguments[n]];
  return this;
}
function Di() {
  return this._memory = this._memory || {};
}
E("Dom", { remember: Ri, forget: Oi, memory: Di });
function Mi(n) {
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
function zi(n) {
  const t = Math.round(n), i = Math.max(0, Math.min(255, t)).toString(16);
  return i.length === 1 ? "0" + i : i;
}
function Rt(n, t) {
  for (let e = t.length; e--; )
    if (n[t[e]] == null)
      return !1;
  return !0;
}
function Ai(n, t) {
  const e = Rt(n, "rgb") ? { _a: n.r, _b: n.g, _c: n.b, _d: 0, space: "rgb" } : Rt(n, "xyz") ? { _a: n.x, _b: n.y, _c: n.z, _d: 0, space: "xyz" } : Rt(n, "hsl") ? { _a: n.h, _b: n.s, _c: n.l, _d: 0, space: "hsl" } : Rt(n, "lab") ? { _a: n.l, _b: n.a, _c: n.b, _d: 0, space: "lab" } : Rt(n, "lch") ? { _a: n.l, _b: n.c, _c: n.h, _d: 0, space: "lch" } : Rt(n, "cmyk") ? { _a: n.c, _b: n.m, _c: n.y, _d: n.k, space: "cmyk" } : { _a: 0, _b: 0, _c: 0, space: "rgb" };
  return e.space = t || e.space, e;
}
function Pi(n) {
  return n === "lab" || n === "xyz" || n === "lch";
}
function pe(n, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? n + (t - n) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? n + (t - n) * (2 / 3 - e) * 6 : n;
}
class O {
  constructor(...t) {
    this.init(...t);
  }
  // Test if given value is a color
  static isColor(t) {
    return t && (t instanceof O || this.isRgb(t) || this.test(t));
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
      const a = 24 * i() + 57, h = 38 * i() + 45, l = 360 * i();
      return new O(a, h, l, "lch");
    } else if (t === "sine") {
      e = e ?? i();
      const a = s(80 * o(2 * r * e / 0.5 + 0.01) + 150), h = s(50 * o(2 * r * e / 0.5 + 4.6) + 200), l = s(100 * o(2 * r * e / 0.5 + 2.3) + 150);
      return new O(a, h, l);
    } else if (t === "pastel") {
      const a = 8 * i() + 86, h = 17 * i() + 9, l = 360 * i();
      return new O(a, h, l, "lch");
    } else if (t === "dark") {
      const a = 10 + 10 * i(), h = 50 * i() + 86, l = 360 * i();
      return new O(a, h, l, "lch");
    } else if (t === "rgb") {
      const a = 255 * i(), h = 255 * i(), l = 255 * i();
      return new O(a, h, l);
    } else if (t === "lab") {
      const a = 100 * i(), h = 256 * i() - 128, l = 256 * i() - 128;
      return new O(a, h, l, "lab");
    } else if (t === "grey") {
      const a = 255 * i();
      return new O(a, a, a);
    } else
      throw new Error("Unsupported random color mode");
  }
  // Test if given value is a color string
  static test(t) {
    return typeof t == "string" && ($e.test(t) || qe.test(t));
  }
  cmyk() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((d) => d / 255), a = Math.min(1 - s, 1 - o, 1 - r);
    if (a === 1)
      return new O(0, 0, 0, 1, "cmyk");
    const h = (1 - s - a) / (1 - a), l = (1 - o - a) / (1 - a), c = (1 - r - a) / (1 - a);
    return new O(h, l, c, a, "cmyk");
  }
  hsl() {
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((g) => g / 255), a = Math.max(s, o, r), h = Math.min(s, o, r), l = (a + h) / 2, c = a === h, u = a - h, d = c ? 0 : l > 0.5 ? u / (2 - a - h) : u / (a + h), f = c ? 0 : a === s ? ((o - r) / u + (o < r ? 6 : 0)) / 6 : a === o ? ((r - s) / u + 2) / 6 : a === r ? ((s - o) / u + 4) / 6 : 0;
    return new O(360 * f, 100 * d, 100 * l, "hsl");
  }
  init(t = 0, e = 0, i = 0, s = 0, o = "rgb") {
    if (t = t || 0, this.space)
      for (const u in this.space)
        delete this[this.space[u]];
    if (typeof t == "number")
      o = typeof s == "string" ? s : o, s = typeof s == "string" ? 0 : s, Object.assign(this, { _a: t, _b: e, _c: i, _d: s, space: o });
    else if (t instanceof Array)
      this.space = e || (typeof t[3] == "string" ? t[3] : t[4]) || "rgb", Object.assign(this, { _a: t[0], _b: t[1], _c: t[2], _d: t[3] || 0 });
    else if (t instanceof Object) {
      const u = Ai(t, e);
      Object.assign(this, u);
    } else if (typeof t == "string")
      if (qe.test(t)) {
        const u = t.replace(gi, ""), [d, f, p] = fi.exec(u).slice(1, 4).map((g) => parseInt(g));
        Object.assign(this, { _a: d, _b: f, _c: p, _d: 0, space: "rgb" });
      } else if ($e.test(t)) {
        const u = (g) => parseInt(g, 16), [, d, f, p] = di.exec(Mi(t)).map(u);
        Object.assign(this, { _a: d, _b: f, _c: p, _d: 0, space: "rgb" });
      } else throw Error("Unsupported string format, can't construct Color");
    const { _a: r, _b: a, _c: h, _d: l } = this, c = this.space === "rgb" ? { r, g: a, b: h } : this.space === "xyz" ? { x: r, y: a, z: h } : this.space === "hsl" ? { h: r, s: a, l: h } : this.space === "lab" ? { l: r, a, b: h } : this.space === "lch" ? { l: r, c: a, h } : this.space === "cmyk" ? { c: r, m: a, y: h, k: l } : {};
    Object.assign(this, c);
  }
  lab() {
    const { x: t, y: e, z: i } = this.xyz(), s = 116 * e - 16, o = 500 * (t - e), r = 200 * (e - i);
    return new O(s, o, r, "lab");
  }
  lch() {
    const { l: t, a: e, b: i } = this.lab(), s = Math.sqrt(e ** 2 + i ** 2);
    let o = 180 * Math.atan2(i, e) / Math.PI;
    return o < 0 && (o *= -1, o = 360 - o), new O(t, s, o, "lch");
  }
  /*
  Conversion Methods
  */
  rgb() {
    if (this.space === "rgb")
      return this;
    if (Pi(this.space)) {
      let { x: t, y: e, z: i } = this;
      if (this.space === "lab" || this.space === "lch") {
        let { l: f, a: p, b: g } = this;
        if (this.space === "lch") {
          const { c: X, h: B } = this, V = Math.PI / 180;
          p = X * Math.cos(V * B), g = X * Math.sin(V * B);
        }
        const w = (f + 16) / 116, y = p / 500 + w, S = w - g / 200, k = 16 / 116, I = 8856e-6, Z = 7.787;
        t = 0.95047 * (y ** 3 > I ? y ** 3 : (y - k) / Z), e = 1 * (w ** 3 > I ? w ** 3 : (w - k) / Z), i = 1.08883 * (S ** 3 > I ? S ** 3 : (S - k) / Z);
      }
      const s = t * 3.2406 + e * -1.5372 + i * -0.4986, o = t * -0.9689 + e * 1.8758 + i * 0.0415, r = t * 0.0557 + e * -0.204 + i * 1.057, a = Math.pow, h = 31308e-7, l = s > h ? 1.055 * a(s, 1 / 2.4) - 0.055 : 12.92 * s, c = o > h ? 1.055 * a(o, 1 / 2.4) - 0.055 : 12.92 * o, u = r > h ? 1.055 * a(r, 1 / 2.4) - 0.055 : 12.92 * r;
      return new O(255 * l, 255 * c, 255 * u);
    } else if (this.space === "hsl") {
      let { h: t, s: e, l: i } = this;
      if (t /= 360, e /= 100, i /= 100, e === 0)
        return i *= 255, new O(i, i, i);
      const s = i < 0.5 ? i * (1 + e) : i + e - i * e, o = 2 * i - s, r = 255 * pe(o, s, t + 1 / 3), a = 255 * pe(o, s, t), h = 255 * pe(o, s, t - 1 / 3);
      return new O(r, a, h);
    } else if (this.space === "cmyk") {
      const { c: t, m: e, y: i, k: s } = this, o = 255 * (1 - Math.min(1, t * (1 - s) + s)), r = 255 * (1 - Math.min(1, e * (1 - s) + s)), a = 255 * (1 - Math.min(1, i * (1 - s) + s));
      return new O(o, r, a);
    } else
      return this;
  }
  toArray() {
    const { _a: t, _b: e, _c: i, _d: s, space: o } = this;
    return [t, e, i, s, o];
  }
  toHex() {
    const [t, e, i] = this._clamped().map(zi);
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
    const { _a: t, _b: e, _c: i } = this.rgb(), [s, o, r] = [t, e, i].map((y) => y / 255), a = s > 0.04045 ? Math.pow((s + 0.055) / 1.055, 2.4) : s / 12.92, h = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, l = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92, c = (a * 0.4124 + h * 0.3576 + l * 0.1805) / 0.95047, u = (a * 0.2126 + h * 0.7152 + l * 0.0722) / 1, d = (a * 0.0193 + h * 0.1192 + l * 0.9505) / 1.08883, f = c > 8856e-6 ? Math.pow(c, 1 / 3) : 7.787 * c + 16 / 116, p = u > 8856e-6 ? Math.pow(u, 1 / 3) : 7.787 * u + 16 / 116, g = d > 8856e-6 ? Math.pow(d, 1 / 3) : 7.787 * d + 16 / 116;
    return new O(f, p, g, "xyz");
  }
  /*
  Input and Output methods
  */
  _clamped() {
    const { _a: t, _b: e, _c: i } = this.rgb(), { max: s, min: o, round: r } = Math, a = (h) => s(0, o(r(h), 255));
    return [t, e, i].map(a);
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
    m.isMatrixLike(t) || (t = new m(t));
    const { x: e, y: i } = this;
    return this.x = t.a * e + t.c * i + t.e, this.y = t.b * e + t.d * i + t.f, this;
  }
}
function ki(n, t) {
  return new P(n, t).transformO(this.screenCTM().inverseO());
}
function Ot(n, t, e) {
  return Math.abs(t - n) < 1e-6;
}
class m {
  constructor(...t) {
    this.init(...t);
  }
  static formatTransforms(t) {
    const e = t.flip === "both" || t.flip === !0, i = t.flip && (e || t.flip === "x") ? -1 : 1, s = t.flip && (e || t.flip === "y") ? -1 : 1, o = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, r = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, a = t.scale && t.scale.length ? t.scale[0] * i : isFinite(t.scale) ? t.scale * i : isFinite(t.scaleX) ? t.scaleX * i : i, h = t.scale && t.scale.length ? t.scale[1] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleY) ? t.scaleY * s : s, l = t.shear || 0, c = t.rotate || t.theta || 0, u = new P(
      t.origin || t.around || t.ox || t.originX,
      t.oy || t.originY
    ), d = u.x, f = u.y, p = new P(
      t.position || t.px || t.positionX || NaN,
      t.py || t.positionY || NaN
    ), g = p.x, w = p.y, y = new P(
      t.translate || t.tx || t.translateX,
      t.ty || t.translateY
    ), S = y.x, k = y.y, I = new P(
      t.relative || t.rx || t.relativeX,
      t.ry || t.relativeY
    ), Z = I.x, X = I.y;
    return {
      scaleX: a,
      scaleY: h,
      skewX: o,
      skewY: r,
      shear: l,
      theta: c,
      rx: Z,
      ry: X,
      tx: S,
      ty: k,
      ox: d,
      oy: f,
      px: g,
      py: w
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
    const s = t.a * e.a + t.c * e.b, o = t.b * e.a + t.d * e.b, r = t.a * e.c + t.c * e.d, a = t.b * e.c + t.d * e.d, h = t.e + t.a * e.e + t.c * e.f, l = t.f + t.b * e.e + t.d * e.f;
    return i.a = s, i.b = o, i.c = r, i.d = a, i.e = h, i.f = l, i;
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
    return new m(this);
  }
  // Decomposes this matrix into its affine parameters
  decompose(t = 0, e = 0) {
    const i = this.a, s = this.b, o = this.c, r = this.d, a = this.e, h = this.f, l = i * r - s * o, c = l > 0 ? 1 : -1, u = c * Math.sqrt(i * i + s * s), d = Math.atan2(c * s, c * i), f = 180 / Math.PI * d, p = Math.cos(d), g = Math.sin(d), w = (i * o + s * r) / l, y = o * u / (w * i - s) || r * u / (w * s + i), S = a - t + t * p * u + e * (w * p * u - g * y), k = h - e + t * g * u + e * (w * g * u + p * y);
    return {
      // Return the affine parameters
      scaleX: u,
      scaleY: y,
      shear: w,
      rotate: f,
      translateX: S,
      translateY: k,
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
    const e = new m(t);
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
    const e = m.fromArray([1, 0, 0, 1, 0, 0]);
    return t = t instanceof Q ? t.matrixify() : typeof t == "string" ? m.fromArray(t.split(ut).map(parseFloat)) : Array.isArray(t) ? m.fromArray(t) : typeof t == "object" && m.isMatrixLike(t) ? t : typeof t == "object" ? new m().transform(t) : arguments.length === 6 ? m.fromArray([].slice.call(arguments)) : e, this.a = t.a != null ? t.a : e.a, this.b = t.b != null ? t.b : e.b, this.c = t.c != null ? t.c : e.c, this.d = t.d != null ? t.d : e.d, this.e = t.e != null ? t.e : e.e, this.f = t.f != null ? t.f : e.f, this;
  }
  inverse() {
    return this.clone().inverseO();
  }
  // Inverses matrix
  inverseO() {
    const t = this.a, e = this.b, i = this.c, s = this.d, o = this.e, r = this.f, a = t * s - e * i;
    if (!a) throw new Error("Cannot invert " + this);
    const h = s / a, l = -e / a, c = -i / a, u = t / a, d = -(h * o + c * r), f = -(l * o + u * r);
    return this.a = h, this.b = l, this.c = c, this.d = u, this.e = d, this.f = f, this;
  }
  lmultiply(t) {
    return this.clone().lmultiplyO(t);
  }
  lmultiplyO(t) {
    const e = this, i = t instanceof m ? t : new m(t);
    return m.matrixMultiply(i, e, this);
  }
  // Left multiplies by the given matrix
  multiply(t) {
    return this.clone().multiplyO(t);
  }
  multiplyO(t) {
    const e = this, i = t instanceof m ? t : new m(t);
    return m.matrixMultiply(e, i, this);
  }
  // Rotate matrix
  rotate(t, e, i) {
    return this.clone().rotateO(t, e, i);
  }
  rotateO(t, e = 0, i = 0) {
    t = ue(t);
    const s = Math.cos(t), o = Math.sin(t), { a: r, b: a, c: h, d: l, e: c, f: u } = this;
    return this.a = r * s - a * o, this.b = a * s + r * o, this.c = h * s - l * o, this.d = l * s + h * o, this.e = c * s - u * o + i * o - e * s + e, this.f = u * s + c * o - e * o - i * s + i, this;
  }
  // Scale matrix
  scale() {
    return this.clone().scaleO(...arguments);
  }
  scaleO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t);
    const { a: o, b: r, c: a, d: h, e: l, f: c } = this;
    return this.a = o * t, this.b = r * e, this.c = a * t, this.d = h * e, this.e = l * t - i * t + i, this.f = c * e - s * e + s, this;
  }
  // Shear matrix
  shear(t, e, i) {
    return this.clone().shearO(t, e, i);
  }
  // eslint-disable-next-line no-unused-vars
  shearO(t, e = 0, i = 0) {
    const { a: s, b: o, c: r, d: a, e: h, f: l } = this;
    return this.a = s + o * t, this.c = r + a * t, this.e = h + l * t - i * t, this;
  }
  // Skew Matrix
  skew() {
    return this.clone().skewO(...arguments);
  }
  skewO(t, e = t, i = 0, s = 0) {
    arguments.length === 3 && (s = i, i = e, e = t), t = ue(t), e = ue(e);
    const o = Math.tan(t), r = Math.tan(e), { a, b: h, c: l, d: c, e: u, f: d } = this;
    return this.a = a + h * o, this.b = h + a * r, this.c = l + c * o, this.d = c + l * r, this.e = u + d * o - s * o, this.f = d + u * r - i * r, this;
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
    if (m.isMatrixLike(t))
      return new m(t).multiplyO(this);
    const e = m.formatTransforms(t), i = this, { x: s, y: o } = new P(e.ox, e.oy).transform(i), r = new m().translateO(e.rx, e.ry).lmultiplyO(i).translateO(-s, -o).scaleO(e.scaleX, e.scaleY).skewO(e.skewX, e.skewY).shearO(e.shear).rotateO(e.theta).translateO(s, o);
    if (isFinite(e.px) || isFinite(e.py)) {
      const a = new P(s, o).transform(r), h = isFinite(e.px) ? e.px - a.x : 0, l = isFinite(e.py) ? e.py - a.y : 0;
      r.translateO(h, l);
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
}
function Gi() {
  return new m(this.node.getCTM());
}
function Ii() {
  try {
    if (typeof this.isRoot == "function" && !this.isRoot()) {
      const n = this.rect(1, 1), t = n.node.getScreenCTM();
      return n.remove(), new m(t);
    }
    return new m(this.node.getScreenCTM());
  } catch {
    return console.warn(
      `Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`
    ), new m();
  }
}
N(m, "Matrix");
function ft() {
  if (!ft.nodes) {
    const n = Y().size(2, 0);
    n.node.style.cssText = [
      "opacity: 0",
      "position: absolute",
      "left: -100%",
      "top: -100%",
      "overflow: hidden"
    ].join(";"), n.attr("focusable", "false"), n.attr("aria-hidden", "true");
    const t = n.path().node;
    ft.nodes = { svg: n, path: t };
  }
  if (!ft.nodes.svg.node.parentNode) {
    const n = C.document.body || C.document.documentElement;
    ft.nodes.svg.addTo(n);
  }
  return ft.nodes;
}
function cn(n) {
  return !n.width && !n.height && !n.x && !n.y;
}
function Bi(n) {
  return n === C.document || (C.document.documentElement.contains || function(t) {
    for (; t.parentNode; )
      t = t.parentNode;
    return t === C.document;
  }).call(C.document.documentElement, n);
}
class A {
  constructor(...t) {
    this.init(...t);
  }
  addOffset() {
    return this.x += C.window.pageXOffset, this.y += C.window.pageYOffset, new A(this);
  }
  init(t) {
    const e = [0, 0, 0, 0];
    return t = typeof t == "string" ? t.split(ut).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [
      t.left != null ? t.left : t.x,
      t.top != null ? t.top : t.y,
      t.width,
      t.height
    ] : arguments.length === 4 ? [].slice.call(arguments) : e, this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
  }
  isNulled() {
    return cn(this);
  }
  // Merge rect box with another, return a new instance
  merge(t) {
    const e = Math.min(this.x, t.x), i = Math.min(this.y, t.y), s = Math.max(this.x + this.width, t.x + t.width) - e, o = Math.max(this.y + this.height, t.y + t.height) - i;
    return new A(e, i, s, o);
  }
  toArray() {
    return [this.x, this.y, this.width, this.height];
  }
  toString() {
    return this.x + " " + this.y + " " + this.width + " " + this.height;
  }
  transform(t) {
    t instanceof m || (t = new m(t));
    let e = 1 / 0, i = -1 / 0, s = 1 / 0, o = -1 / 0;
    return [
      new P(this.x, this.y),
      new P(this.x2, this.y),
      new P(this.x, this.y2),
      new P(this.x2, this.y2)
    ].forEach(function(a) {
      a = a.transform(t), e = Math.min(e, a.x), i = Math.max(i, a.x), s = Math.min(s, a.y), o = Math.max(o, a.y);
    }), new A(e, s, i - e, o - s);
  }
}
function un(n, t, e) {
  let i;
  try {
    if (i = t(n.node), cn(i) && !Bi(n.node))
      throw new Error("Element not in the dom");
  } catch {
    i = e(n);
  }
  return i;
}
function Hi() {
  const e = un(this, (s) => s.getBBox(), (s) => {
    try {
      const o = s.clone().addTo(ft().svg).show(), r = o.node.getBBox();
      return o.remove(), r;
    } catch (o) {
      throw new Error(
        `Getting bbox of element "${s.node.nodeName}" is not possible: ${o.toString()}`
      );
    }
  });
  return new A(e);
}
function Zi(n) {
  const i = un(this, (o) => o.getBoundingClientRect(), (o) => {
    throw new Error(
      `Getting rbox of element "${o.node.nodeName}" is not possible`
    );
  }), s = new A(i);
  return n ? s.transform(n.screenCTM().inverseO()) : s.addOffset();
}
function Ui(n, t) {
  const e = this.bbox();
  return n > e.x && t > e.y && n < e.x + e.width && t < e.y + e.height;
}
E({
  viewbox: {
    viewbox(n, t, e, i) {
      return n == null ? new A(this.attr("viewBox")) : this.attr("viewBox", new A(n, t, e, i));
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
      let h = a / n;
      h === 1 / 0 && (h = Number.MAX_SAFE_INTEGER / 100), t = t || new P(e / 2 / o + s.x, i / 2 / r + s.y);
      const l = new A(s).transform(
        new m({ scale: h, origin: t })
      );
      return this.viewbox(l);
    }
  }
});
N(A, "Box");
class vt extends Array {
  constructor(t = [], ...e) {
    if (super(t, ...e), typeof t == "number") return this;
    this.length = 0, this.push(...t);
  }
}
v([vt], {
  each(n, ...t) {
    return typeof n == "function" ? this.map((e, i, s) => n.call(e, e, i, s)) : this.map((e) => e[n](...t));
  },
  toArray() {
    return Array.prototype.concat.apply([], this);
  }
});
const Li = ["toArray", "constructor", "each"];
vt.extend = function(n) {
  n = n.reduce((t, e) => (Li.includes(e) || e[0] === "_" || (e in Array.prototype && (t["$" + e] = Array.prototype[e]), t[e] = function(...i) {
    return this.each(e, ...i);
  }), t), {}), v([vt], n);
};
function Pt(n, t) {
  return new vt(
    De((t || C.document).querySelectorAll(n), function(e) {
      return nt(e);
    })
  );
}
function Yi(n) {
  return Pt(n, this.node);
}
function Xi(n) {
  return nt(this.node.querySelector(n));
}
let ji = 0;
const dn = {};
function fn(n) {
  let t = n.getEventHolder();
  return t === C.window && (t = dn), t.events || (t.events = {}), t.events;
}
function Ge(n) {
  return n.getEventTarget();
}
function Fi(n) {
  let t = n.getEventHolder();
  t === C.window && (t = dn), t.events && (t.events = {});
}
function q(n, t, e, i, s) {
  const o = e.bind(i || n), r = Y(n), a = fn(r), h = Ge(r);
  t = Array.isArray(t) ? t : t.split(ut), e._svgjsListenerId || (e._svgjsListenerId = ++ji), t.forEach(function(l) {
    const c = l.split(".")[0], u = l.split(".")[1] || "*";
    a[c] = a[c] || {}, a[c][u] = a[c][u] || {}, a[c][u][e._svgjsListenerId] = o, h.addEventListener(c, o, s || !1);
  });
}
function H(n, t, e, i) {
  const s = Y(n), o = fn(s), r = Ge(s);
  typeof e == "function" && (e = e._svgjsListenerId, !e) || (t = Array.isArray(t) ? t : (t || "").split(ut), t.forEach(function(a) {
    const h = a && a.split(".")[0], l = a && a.split(".")[1];
    let c, u;
    if (e)
      o[h] && o[h][l || "*"] && (r.removeEventListener(
        h,
        o[h][l || "*"][e],
        i || !1
      ), delete o[h][l || "*"][e]);
    else if (h && l) {
      if (o[h] && o[h][l]) {
        for (u in o[h][l])
          H(r, [h, l].join("."), u);
        delete o[h][l];
      }
    } else if (l)
      for (a in o)
        for (c in o[a])
          l === c && H(r, [a, l].join("."));
    else if (h) {
      if (o[h]) {
        for (c in o[h])
          H(r, [h, c].join("."));
        delete o[h];
      }
    } else {
      for (a in o)
        H(r, a);
      Fi(s);
    }
  }));
}
function Vi(n, t, e, i) {
  const s = Ge(n);
  return t instanceof C.window.Event || (t = new C.window.CustomEvent(t, {
    detail: e,
    cancelable: !0,
    ...i
  })), s.dispatchEvent(t), t;
}
class $t extends Ae {
  addEventListener() {
  }
  dispatch(t, e, i) {
    return Vi(this, t, e, i);
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
    return H(this, t, e, i), this;
  }
  // Bind given event to listener
  on(t, e, i, s) {
    return q(this, t, e, i, s), this;
  }
  removeEventListener() {
  }
}
N($t, "EventTarget");
function Je() {
}
const Yt = {
  duration: 400,
  ease: ">",
  delay: 0
}, $i = {
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
class Mt extends Array {
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
    return t instanceof Array ? t : t.trim().split(ut).map(parseFloat);
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
class _ {
  // Initialize
  constructor(...t) {
    this.init(...t);
  }
  convert(t) {
    return new _(this.value, t);
  }
  // Divide number
  divide(t) {
    return t = new _(t), new _(this / t, this.unit || t.unit);
  }
  init(t, e) {
    return e = Array.isArray(t) ? t[1] : e, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = e || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (e = t.match(ln), e && (this.value = parseFloat(e[1]), e[5] === "%" ? this.value /= 100 : e[5] === "s" && (this.value *= 1e3), this.unit = e[5])) : t instanceof _ && (this.value = t.valueOf(), this.unit = t.unit), this;
  }
  // Subtract number
  minus(t) {
    return t = new _(t), new _(this - t, this.unit || t.unit);
  }
  // Add number
  plus(t) {
    return t = new _(t), new _(this + t, this.unit || t.unit);
  }
  // Multiply number
  times(t) {
    return t = new _(t), new _(this * t, this.unit || t.unit);
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
const qi = /* @__PURE__ */ new Set([
  "fill",
  "stroke",
  "color",
  "bgcolor",
  "stop-color",
  "flood-color",
  "lighting-color"
]), pn = [];
function Wi(n) {
  pn.push(n);
}
function Qi(n, t, e) {
  if (n == null) {
    n = {}, t = this.node.attributes;
    for (const i of t)
      n[i.nodeName] = Qe.test(i.nodeValue) ? parseFloat(i.nodeValue) : i.nodeValue;
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
        return t = this.node.getAttribute(n), t == null ? $i[n] : Qe.test(t) ? parseFloat(t) : t;
      t = pn.reduce((i, s) => s(n, i, this), t), typeof t == "number" ? t = new _(t) : qi.has(n) && O.isColor(t) ? t = new O(t) : t.constructor === Array && (t = new Mt(t)), n === "leading" ? this.leading && this.leading(t) : typeof e == "string" ? this.node.setAttributeNS(e, n, t.toString()) : this.node.setAttribute(n, t.toString()), this.rebuild && (n === "font-size" || n === "x") && this.rebuild();
    }
  }
  return this;
}
class pt extends $t {
  constructor(t, e) {
    super(), this.node = t, this.type = t.nodeName, e && t !== e && this.attr(e);
  }
  // Add given element at a position
  add(t, e) {
    return t = Y(t), t.removeNamespace && this.node instanceof C.window.SVGElement && t.removeNamespace(), e == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[e] && this.node.insertBefore(t.node, this.node.childNodes[e]), this;
  }
  // Add element to given container and return self
  addTo(t, e) {
    return Y(t).put(this, e);
  }
  // Returns all child elements
  children() {
    return new vt(
      De(this.node.children, function(t) {
        return nt(t);
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
    return e && (i = hn(i)), new this.constructor(i);
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
    return this.put(new pt(Xt(t), e));
  }
  // Get first child
  first() {
    return nt(this.node.firstChild);
  }
  // Get a element at the given index
  get(t) {
    return nt(this.node.childNodes[t]);
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
    return this.xml(t, e, Qn);
  }
  // Get / set id
  id(t) {
    return typeof t > "u" && !this.node.id && (this.node.id = an(this.type)), this.attr("id", t);
  }
  // Gets index of given element
  index(t) {
    return [].slice.call(this.node.childNodes).indexOf(t.node);
  }
  // Get the last child
  last() {
    return nt(this.node.lastChild);
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
    if (e = nt(e.node.parentNode), !t) return e;
    do
      if (typeof t == "string" ? e.matches(t) : e instanceof t)
        return e;
    while (e = nt(e.node.parentNode));
    return e;
  }
  // Basically does the same as `add()` but returns the added element instead
  put(t, e) {
    return t = Y(t), this.add(t, e), t;
  }
  // Add element to given container and return container
  putIn(t, e) {
    return Y(t).add(this, e);
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
    return t = Y(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
  }
  round(t = 2, e = null) {
    const i = 10 ** t, s = this.attr(e);
    for (const o in s)
      typeof s[o] == "number" && (s[o] = Math.round(s[o] * i) / i);
    return this.attr(s), this;
  }
  // Import / Export raw svg
  svg(t, e) {
    return this.xml(t, e, Me);
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
        if (a = nt(a.node.cloneNode(!0)), e) {
          const h = t(a);
          if (a = h || a, h === !1) return "";
        }
        a.each(function() {
          const h = t(this), l = h || this;
          h === !1 ? this.remove() : h && this !== l && this.replace(l);
        }, !0);
      }
      return e ? a.node.outerHTML : a.node.innerHTML;
    }
    e = e ?? !1;
    const s = Xt("wrapper", i), o = C.document.createDocumentFragment();
    s.innerHTML = t;
    for (let a = s.children.length; a--; )
      o.appendChild(s.firstElementChild);
    const r = this.parent();
    return e ? this.replace(o) && r : this.add(o);
  }
}
v(pt, { attr: Qi, find: Yi, findOne: Xi });
N(pt, "Dom");
class Q extends pt {
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
    return this.x(new _(t).plus(this.x()));
  }
  // Relative move over y axis
  dy(t = 0) {
    return this.y(new _(t).plus(this.y()));
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
    e || (t = Y(t));
    const i = new vt();
    let s = this;
    for (; (s = s.parent()) && s.node !== C.document && s.nodeName !== "#document-fragment" && (i.push(s), !(!e && s.node === t.node || e && s.matches(t))); )
      if (s.node === this.root().node)
        return null;
    return i;
  }
  // Get referenced element form attribute value
  reference(t) {
    if (t = this.attr(t), !t) return null;
    const e = (t + "").match(pi);
    return e ? Y(e[1]) : null;
  }
  // Get parent document
  root() {
    const t = this.parent(Jn(Pe));
    return t && t.root();
  }
  // set given data to the elements data property
  setData(t) {
    return this.dom = t, this;
  }
  // Set element size to given width and height
  size(t, e) {
    const i = At(this, t, e);
    return this.width(new _(i.width)).height(new _(i.height));
  }
  // Set width of element
  width(t) {
    return this.attr("width", t);
  }
  // write svgjs data to the dom
  writeDataToDom() {
    return rn(this, this.dom), super.writeDataToDom();
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
v(Q, {
  bbox: Hi,
  rbox: Zi,
  inside: Ui,
  point: ki,
  ctm: Gi,
  screenCTM: Ii
});
N(Q, "Element");
const Ut = {
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
    if (typeof i == "string" || i instanceof O || O.isRgb(i) || i instanceof Q)
      this.attr(n, i);
    else
      for (e = Ut[n].length - 1; e >= 0; e--)
        i[Ut[n][e]] != null && this.attr(Ut.prefix(n, Ut[n][e]), i[Ut[n][e]]);
    return this;
  }, E(["Element", "Runner"], t);
});
E(["Element", "Runner"], {
  // Let the user set the matrix directly
  matrix: function(n, t, e, i, s, o) {
    return n == null ? new m(this) : this.attr("transform", new m(n, t, e, i, s, o));
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
E("radius", {
  // Add x and y radius
  radius: function(n, t = n) {
    return (this._element || this).type === "radialGradient" ? this.attr("r", new _(n)) : this.rx(n).ry(t);
  }
});
E("Path", {
  // Get path length
  length: function() {
    return this.node.getTotalLength();
  },
  // Get point at length
  pointAt: function(n) {
    return new P(this.node.getPointAtLength(n));
  }
});
E(["Element", "Runner"], {
  // Set font
  font: function(n, t) {
    if (typeof n == "object") {
      for (t in n) this.font(t, n[t]);
      return this;
    }
    return n === "leading" ? this.leading(t) : n === "anchor" ? this.attr("text-anchor", t) : n === "size" || n === "family" || n === "weight" || n === "stretch" || n === "variant" || n === "style" ? this.attr("font-" + n, t) : this.attr(n, t);
  }
});
const Ji = [
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
E("Element", Ji);
function Ki() {
  return this.attr("transform", null);
}
function ts() {
  return (this.attr("transform") || "").split(mi).slice(0, -1).map(function(t) {
    const e = t.trim().split("(");
    return [
      e[0],
      e[1].split(ut).map(function(i) {
        return parseFloat(i);
      })
    ];
  }).reverse().reduce(function(t, e) {
    return e[0] === "matrix" ? t.lmultiply(m.fromArray(e[1])) : t[e[0]].apply(t, e[1]);
  }, new m());
}
function es(n, t) {
  if (this === n) return this;
  if (we(this.node)) return this.addTo(n, t);
  const e = this.screenCTM(), i = n.screenCTM().inverse();
  return this.addTo(n, t).untransform().transform(i.multiply(e)), this;
}
function ns(n) {
  return this.toParent(this.root(), n);
}
function is(n, t) {
  if (n == null || typeof n == "string") {
    const s = new m(this).decompose();
    return n == null ? s : s[n];
  }
  m.isMatrixLike(n) || (n = { ...n, origin: ye(n, this) });
  const e = t === !0 ? this : t || !1, i = new m(e).transform(n);
  return this.attr("transform", i);
}
E("Element", {
  untransform: Ki,
  matrixify: ts,
  toParent: es,
  toRoot: ns,
  transform: is
});
class F extends Q {
  flatten() {
    return this.each(function() {
      if (this instanceof F)
        return this.flatten().ungroup();
    }), this;
  }
  ungroup(t = this.parent(), e = t.index(this)) {
    return e = e === -1 ? t.children().length : e, this.each(function(i, s) {
      return s[s.length - i - 1].toParent(t, e);
    }), this.remove();
  }
}
N(F, "Container");
class Ie extends F {
  constructor(t, e = t) {
    super(z("defs", t), e);
  }
  flatten() {
    return this;
  }
  ungroup() {
    return this;
  }
}
N(Ie, "Defs");
class J extends Q {
}
N(J, "Shape");
function Be(n) {
  return this.attr("rx", n);
}
function He(n) {
  return this.attr("ry", n);
}
function mn(n) {
  return n == null ? this.cx() - this.rx() : this.cx(n + this.rx());
}
function gn(n) {
  return n == null ? this.cy() - this.ry() : this.cy(n + this.ry());
}
function bn(n) {
  return this.attr("cx", n);
}
function yn(n) {
  return this.attr("cy", n);
}
function wn(n) {
  return n == null ? this.rx() * 2 : this.rx(new _(n).divide(2));
}
function xn(n) {
  return n == null ? this.ry() * 2 : this.ry(new _(n).divide(2));
}
const ss = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cx: bn,
  cy: yn,
  height: xn,
  rx: Be,
  ry: He,
  width: wn,
  x: mn,
  y: gn
}, Symbol.toStringTag, { value: "Module" }));
class qt extends J {
  constructor(t, e = t) {
    super(z("ellipse", t), e);
  }
  size(t, e) {
    const i = At(this, t, e);
    return this.rx(new _(i.width).divide(2)).ry(
      new _(i.height).divide(2)
    );
  }
}
v(qt, ss);
E("Container", {
  // Create an ellipse
  ellipse: M(function(n = 0, t = n) {
    return this.put(new qt()).size(n, t).move(0, 0);
  })
});
N(qt, "Ellipse");
class _n extends pt {
  constructor(t = C.document.createDocumentFragment()) {
    super(t);
  }
  // Import / Export raw xml
  xml(t, e, i) {
    if (typeof t == "boolean" && (i = e, e = t, t = null), t == null || typeof t == "function") {
      const s = new pt(Xt("wrapper", i));
      return s.add(this.node.cloneNode(!0)), s.xml(!1, i);
    }
    return super.xml(t, !1, i);
  }
}
N(_n, "Fragment");
function vn(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ fx: new _(n), fy: new _(t) }) : this.attr({ x1: new _(n), y1: new _(t) });
}
function En(n, t) {
  return (this._element || this).type === "radialGradient" ? this.attr({ cx: new _(n), cy: new _(t) }) : this.attr({ x2: new _(n), y2: new _(t) });
}
const os = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  from: vn,
  to: En
}, Symbol.toStringTag, { value: "Module" }));
class Wt extends F {
  constructor(t, e) {
    super(
      z(t + "Gradient", typeof t == "string" ? null : t),
      e
    );
  }
  // custom attr to handle transform
  attr(t, e, i) {
    return t === "transform" && (t = "gradientTransform"), super.attr(t, e, i);
  }
  bbox() {
    return new A();
  }
  targets() {
    return Pt("svg [fill*=" + this.id() + "]");
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
v(Wt, os);
E({
  Container: {
    // Create gradient element in defs
    gradient(...n) {
      return this.defs().gradient(...n);
    }
  },
  // define gradient
  Defs: {
    gradient: M(function(n, t) {
      return this.put(new Wt(n)).update(t);
    })
  }
});
N(Wt, "Gradient");
class jt extends F {
  // Initialize node
  constructor(t, e = t) {
    super(z("pattern", t), e);
  }
  // custom attr to handle transform
  attr(t, e, i) {
    return t === "transform" && (t = "patternTransform"), super.attr(t, e, i);
  }
  bbox() {
    return new A();
  }
  targets() {
    return Pt("svg [fill*=" + this.id() + "]");
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
E({
  Container: {
    // Create pattern element in defs
    pattern(...n) {
      return this.defs().pattern(...n);
    }
  },
  Defs: {
    pattern: M(function(n, t, e) {
      return this.put(new jt()).update(e).attr({
        x: 0,
        y: 0,
        width: n,
        height: t,
        patternUnits: "userSpaceOnUse"
      });
    })
  }
});
N(jt, "Pattern");
class re extends J {
  constructor(t, e = t) {
    super(z("image", t), e);
  }
  // (re)load image
  load(t, e) {
    if (!t) return this;
    const i = new C.window.Image();
    return q(
      i,
      "load",
      function(s) {
        const o = this.parent(jt);
        this.width() === 0 && this.height() === 0 && this.size(i.width, i.height), o instanceof jt && o.width() === 0 && o.height() === 0 && o.size(this.width(), this.height()), typeof e == "function" && e.call(this, s);
      },
      this
    ), q(i, "load error", function() {
      H(i);
    }), this.attr("href", i.src = t, Vt);
  }
}
Wi(function(n, t, e) {
  return (n === "fill" || n === "stroke") && bi.test(t) && (t = e.root().defs().image(t)), t instanceof re && (t = e.root().defs().pattern(0, 0, (i) => {
    i.add(t);
  })), t;
});
E({
  Container: {
    // create image element, load image and set its size
    image: M(function(n, t) {
      return this.put(new re()).size(0, 0).load(n, t);
    })
  }
});
N(re, "Image");
class mt extends Mt {
  // Get bounding box of points
  bbox() {
    let t = -1 / 0, e = -1 / 0, i = 1 / 0, s = 1 / 0;
    return this.forEach(function(o) {
      t = Math.max(o[0], t), e = Math.max(o[1], e), i = Math.min(o[0], i), s = Math.min(o[1], s);
    }), new A(i, s, t - i, e - s);
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
    t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(ut).map(parseFloat), t.length % 2 !== 0 && t.pop();
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
    m.isMatrixLike(t) || (t = new m(t));
    for (let e = this.length; e--; ) {
      const [i, s] = this[e];
      this[e][0] = t.a * i + t.c * s + t.e, this[e][1] = t.b * i + t.d * s + t.f;
    }
    return this;
  }
}
const rs = mt;
function as(n) {
  return n == null ? this.bbox().x : this.move(n, this.bbox().y);
}
function hs(n) {
  return n == null ? this.bbox().y : this.move(this.bbox().x, n);
}
function ls(n) {
  const t = this.bbox();
  return n == null ? t.width : this.size(n, t.height);
}
function cs(n) {
  const t = this.bbox();
  return n == null ? t.height : this.size(t.width, n);
}
const Ze = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MorphArray: rs,
  height: cs,
  width: ls,
  x: as,
  y: hs
}, Symbol.toStringTag, { value: "Module" }));
class zt extends J {
  // Initialize node
  constructor(t, e = t) {
    super(z("line", t), e);
  }
  // Get array
  array() {
    return new mt([
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
    return t == null ? this.array() : (typeof e < "u" ? t = { x1: t, y1: e, x2: i, y2: s } : t = new mt(t).toLine(), this.attr(t));
  }
  // Set element size to given width and height
  size(t, e) {
    const i = At(this, t, e);
    return this.attr(this.array().size(i.width, i.height).toLine());
  }
}
v(zt, Ze);
E({
  Container: {
    // Create a line element
    line: M(function(...n) {
      return zt.prototype.plot.apply(
        this.put(new zt()),
        n[0] != null ? n : [0, 0, 0, 0]
      );
    })
  }
});
N(zt, "Line");
class ne extends F {
  // Initialize node
  constructor(t, e = t) {
    super(z("marker", t), e);
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
E({
  Container: {
    marker(...n) {
      return this.defs().marker(...n);
    }
  },
  Defs: {
    // Create marker
    marker: M(function(n, t, e) {
      return this.put(new ne()).size(n, t).ref(n / 2, t / 2).viewbox(0, 0, n, t).attr("orient", "auto").update(e);
    })
  },
  marker: {
    // Create and attach markers
    marker(n, t, e, i) {
      let s = ["marker"];
      return n !== "all" && s.push(n), s = s.join("-"), n = arguments[1] instanceof ne ? arguments[1] : this.defs().marker(t, e, i), this.attr(s, n);
    }
  }
});
N(ne, "Marker");
function Dt(n, t) {
  return function(e) {
    return e == null ? this[n] : (this[n] = e, t && t.call(this), this);
  };
}
const us = {
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
class Ue {
  done() {
    return !1;
  }
}
class xe extends Ue {
  constructor(t = Yt.ease) {
    super(), this.ease = us[t] || t;
  }
  step(t, e, i) {
    return typeof t != "number" ? i < 1 ? t : e : t + (e - t) * this.ease(i);
  }
}
class ie extends Ue {
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
function Ke() {
  const n = (this._duration || 500) / 1e3, t = this._overshoot || 0, e = 1e-10, i = Math.PI, s = Math.log(t / 100 + e), o = -s / Math.sqrt(i * i + s * s), r = 3.9 / (o * n);
  this.d = 2 * o * r, this.k = r * r;
}
class ds extends ie {
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
v(ds, {
  duration: Dt("_duration", Ke),
  overshoot: Dt("_overshoot", Ke)
});
class fs extends ie {
  constructor(t = 0.1, e = 0.01, i = 0, s = 1e3) {
    super(), this.p(t).i(e).d(i).windup(s);
  }
  step(t, e, i, s) {
    if (typeof t == "string") return t;
    if (s.done = i === 1 / 0, i === 1 / 0) return e;
    if (i === 0) return t;
    const o = e - t;
    let r = (s.integral || 0) + o * i;
    const a = (o - (s.error || 0)) / i, h = this._windup;
    return h !== !1 && (r = Math.max(-h, Math.min(r, h))), s.error = o, s.integral = r, s.done = Math.abs(o) < 1e-3, s.done ? e : t + (this.P * o + this.I * r + this.D * a);
  }
}
v(fs, {
  windup: Dt("_windup"),
  p: Dt("P"),
  i: Dt("I"),
  d: Dt("D")
});
const ps = {
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
}, _e = {
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
}, me = "mlhvqtcsaz".split("");
for (let n = 0, t = me.length; n < t; ++n)
  _e[me[n]] = /* @__PURE__ */ function(e) {
    return function(i, s, o) {
      if (e === "H") i[0] = i[0] + s.x;
      else if (e === "V") i[0] = i[0] + s.y;
      else if (e === "A")
        i[5] = i[5] + s.x, i[6] = i[6] + s.y;
      else
        for (let r = 0, a = i.length; r < a; ++r)
          i[r] = i[r] + (r % 2 ? s.y : s.x);
      return _e[e](i, s, o);
    };
  }(me[n].toUpperCase());
function ms(n) {
  const t = n.segment[0];
  return _e[t](n.segment.slice(1), n.p, n.p0);
}
function ve(n) {
  return n.segment.length && n.segment.length - 1 === ps[n.segment[0].toUpperCase()];
}
function gs(n, t) {
  n.inNumber && wt(n, !1);
  const e = ke.test(t);
  if (e)
    n.segment = [t];
  else {
    const i = n.lastCommand, s = i.toLowerCase(), o = i === s;
    n.segment = [s === "m" ? o ? "l" : "L" : i];
  }
  return n.inSegment = !0, n.lastCommand = n.segment[0], e;
}
function wt(n, t) {
  if (!n.inNumber) throw new Error("Parser Error");
  n.number && n.segment.push(parseFloat(n.number)), n.inNumber = t, n.number = "", n.pointSeen = !1, n.hasExponent = !1, ve(n) && Ee(n);
}
function Ee(n) {
  n.inSegment = !1, n.absolute && (n.segment = ms(n)), n.segments.push(n.segment);
}
function bs(n) {
  if (!n.segment.length) return !1;
  const t = n.segment[0].toUpperCase() === "A", e = n.segment.length;
  return t && (e === 4 || e === 5);
}
function ys(n) {
  return n.lastToken.toUpperCase() === "E";
}
const ws = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
function xs(n, t = !0) {
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
    p0: new P(),
    p: new P()
  };
  for (; s.lastToken = i, i = n.charAt(e++); )
    if (!(!s.inSegment && gs(s, i))) {
      if (i === ".") {
        if (s.pointSeen || s.hasExponent) {
          wt(s, !1), --e;
          continue;
        }
        s.inNumber = !0, s.pointSeen = !0, s.number += i;
        continue;
      }
      if (!isNaN(parseInt(i))) {
        if (s.number === "0" || bs(s)) {
          s.inNumber = !0, s.number = i, wt(s, !0);
          continue;
        }
        s.inNumber = !0, s.number += i;
        continue;
      }
      if (ws.has(i)) {
        s.inNumber && wt(s, !1);
        continue;
      }
      if (i === "-" || i === "+") {
        if (s.inNumber && !ys(s)) {
          wt(s, !1), --e;
          continue;
        }
        s.number += i, s.inNumber = !0;
        continue;
      }
      if (i.toUpperCase() === "E") {
        s.number += i, s.hasExponent = !0;
        continue;
      }
      if (ke.test(i)) {
        if (s.inNumber)
          wt(s, !1);
        else if (ve(s))
          Ee(s);
        else
          throw new Error("parser Error");
        --e;
      }
    }
  return s.inNumber && wt(s, !1), s.inSegment && ve(s) && Ee(s), s.segments;
}
function _s(n) {
  let t = "";
  for (let e = 0, i = n.length; e < i; e++)
    t += n[e][0], n[e][1] != null && (t += n[e][1], n[e][2] != null && (t += " ", t += n[e][2], n[e][3] != null && (t += " ", t += n[e][3], t += " ", t += n[e][4], n[e][5] != null && (t += " ", t += n[e][5], t += " ", t += n[e][6], n[e][7] != null && (t += " ", t += n[e][7])))));
  return t + " ";
}
class Et extends Mt {
  // Get bounding box of path
  bbox() {
    return ft().path.setAttribute("d", this.toString()), new A(ft.nodes.path.getBBox());
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
    return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), xs(t);
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
    return _s(this);
  }
}
const Cn = (n) => {
  const t = typeof n;
  return t === "number" ? _ : t === "string" ? O.isColor(n) ? O : ut.test(n) ? ke.test(n) ? Et : Mt : ln.test(n) ? _ : Ce : Le.indexOf(n.constructor) > -1 ? n.constructor : Array.isArray(n) ? Mt : t === "object" ? Ft : Ce;
};
class xt {
  constructor(t) {
    this._stepper = t || new xe("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
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
    this._type || this.type(Cn(t));
    let e = new this._type(t);
    return this._type === O && (e = this._to ? e[this._to[4]]() : this._from ? e[this._from[4]]() : e), this._type === Ft && (e = this._to ? e.align(this._to) : this._from ? e.align(this._from) : e), e = e.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(e.length)).map(Object).map(function(i) {
      return i.done = !0, i;
    }), e;
  }
}
class Ce {
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
class Qt {
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
    }), Object.assign(this, Qt.defaults, t), this;
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
Qt.defaults = {
  scaleX: 1,
  scaleY: 1,
  shear: 0,
  rotate: 0,
  translateX: 0,
  translateY: 0,
  originX: 0,
  originY: 0
};
const vs = (n, t) => n[0] < t[0] ? -1 : n[0] > t[0] ? 1 : 0;
class Ft {
  constructor(...t) {
    this.init(...t);
  }
  align(t) {
    const e = this.values;
    for (let i = 0, s = e.length; i < s; ++i) {
      if (e[i + 1] === t[i + 1]) {
        if (e[i + 1] === O && t[i + 7] !== e[i + 7]) {
          const a = t[i + 7], h = new O(this.values.splice(i + 3, 5))[a]().toArray();
          this.values.splice(i + 3, 0, ...h);
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
      const s = Cn(t[i]), o = new s(t[i]).toArray();
      e.push([i, s, o.length, ...o]);
    }
    return e.sort(vs), this.values = e.reduce((i, s) => i.concat(s), []), this;
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
const Le = [Ce, Qt, Ft];
function Es(n = []) {
  Le.push(...[].concat(n));
}
function Cs() {
  v(Le, {
    to(n) {
      return new xt().type(this.constructor).from(this.toArray()).to(n);
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
class kt extends J {
  // Initialize node
  constructor(t, e = t) {
    super(z("path", t), e);
  }
  // Get array
  array() {
    return this._array || (this._array = new Et(this.attr("d")));
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
      typeof t == "string" ? t : this._array = new Et(t)
    );
  }
  // Set element size to given width and height
  size(t, e) {
    const i = At(this, t, e);
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
kt.prototype.MorphArray = Et;
E({
  Container: {
    // Create a wrapped path element
    path: M(function(n) {
      return this.put(new kt()).plot(n || new Et());
    })
  }
});
N(kt, "Path");
function Ns() {
  return this._array || (this._array = new mt(this.attr("points")));
}
function Ss() {
  return delete this._array, this;
}
function Ts(n, t) {
  return this.attr("points", this.array().move(n, t));
}
function Rs(n) {
  return n == null ? this.array() : this.clear().attr(
    "points",
    typeof n == "string" ? n : this._array = new mt(n)
  );
}
function Os(n, t) {
  const e = At(this, n, t);
  return this.attr("points", this.array().size(e.width, e.height));
}
const Nn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  array: Ns,
  clear: Ss,
  move: Ts,
  plot: Rs,
  size: Os
}, Symbol.toStringTag, { value: "Module" }));
class Gt extends J {
  // Initialize node
  constructor(t, e = t) {
    super(z("polygon", t), e);
  }
}
E({
  Container: {
    // Create a wrapped polygon element
    polygon: M(function(n) {
      return this.put(new Gt()).plot(n || new mt());
    })
  }
});
v(Gt, Ze);
v(Gt, Nn);
N(Gt, "Polygon");
class It extends J {
  // Initialize node
  constructor(t, e = t) {
    super(z("polyline", t), e);
  }
}
E({
  Container: {
    // Create a wrapped polygon element
    polyline: M(function(n) {
      return this.put(new It()).plot(n || new mt());
    })
  }
});
v(It, Ze);
v(It, Nn);
N(It, "Polyline");
class Jt extends J {
  // Initialize node
  constructor(t, e = t) {
    super(z("rect", t), e);
  }
}
v(Jt, { rx: Be, ry: He });
E({
  Container: {
    // Create a rect element
    rect: M(function(n, t) {
      return this.put(new Jt()).size(n, t);
    })
  }
});
N(Jt, "Rect");
class ge {
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
  frames: new ge(),
  timeouts: new ge(),
  immediates: new ge(),
  timer: () => C.window.performance || C.window.Date,
  transforms: [],
  frame(n) {
    const t = R.frames.push({ run: n });
    return R.nextDraw === null && (R.nextDraw = C.window.requestAnimationFrame(R._draw)), t;
  },
  timeout(n, t) {
    t = t || 0;
    const e = R.timer().now() + t, i = R.timeouts.push({ run: n, time: e });
    return R.nextDraw === null && (R.nextDraw = C.window.requestAnimationFrame(R._draw)), i;
  },
  immediate(n) {
    const t = R.immediates.push(n);
    return R.nextDraw === null && (R.nextDraw = C.window.requestAnimationFrame(R._draw)), t;
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
    R.nextDraw = R.timeouts.first() || R.frames.first() ? C.window.requestAnimationFrame(R._draw) : null;
  }
}, Ds = function(n) {
  const t = n.start, e = n.runner.duration(), i = t + e;
  return {
    start: t,
    duration: e,
    end: i,
    runner: n.runner
  };
}, Ms = function() {
  const n = C.window;
  return (n.performance || n.Date).now();
};
class Sn extends $t {
  // Construct a new timeline on the given element
  constructor(t = Ms) {
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
      return this._runners.map(Ds);
    let s = 0;
    const o = this.getEndTime();
    if (e = e || 0, i == null || i === "last" || i === "after")
      s = o;
    else if (i === "absolute" || i === "start")
      s = e, e = 0;
    else if (i === "now")
      s = this._time;
    else if (i === "relative") {
      const h = this.getRunnerInfoById(t.id);
      h && (s = h.start + e, e = 0);
    } else if (i === "with-last") {
      const h = this.getLastRunnerInfo();
      s = h ? h.start : this._time;
    } else
      throw new Error('Invalid value for the "when" parameter');
    t.unschedule(), t.timeline(this);
    const r = t.persist(), a = {
      persist: r === null ? this._persist : r,
      start: s + e,
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
    for (let r = this._runners.length; r--; ) {
      const a = this._runners[r], h = a.runner;
      this._time - a.start <= 0 && h.reset();
    }
    let o = !1;
    for (let r = 0, a = this._runners.length; r < a; r++) {
      const h = this._runners[r], l = h.runner;
      let c = s;
      const u = this._time - h.start;
      if (u <= 0) {
        o = !0;
        continue;
      } else u < c && (c = u);
      if (!l.active()) continue;
      l.step(c).done ? h.persist !== !0 && l.duration() - l.time() + this._time + h.persist < this._time && (l.unschedule(), --r, --a) : o = !0;
    }
    return o && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this;
  }
  terminate() {
    this._startTime = 0, this._speed = 1, this._persist = 0, this._nextFrame = null, this._paused = !0, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
  }
}
E({
  Element: {
    timeline: function(n) {
      return n == null ? (this._timeline = this._timeline || new Sn(), this._timeline) : (this._timeline = n, this);
    }
  }
});
class W extends $t {
  constructor(t) {
    super(), this.id = W.id++, t = t ?? Yt.duration, t = typeof t == "function" ? new ie(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof ie, this._stepper = this._isDeclarative ? t : new xe(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new m(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
  }
  static sanitise(t, e, i) {
    let s = 1, o = !1, r = 0;
    return t = t ?? Yt.duration, e = e ?? Yt.delay, i = i || "last", typeof t == "object" && !(t instanceof Ue) && (e = t.delay ?? e, i = t.when ?? i, o = t.swing || o, s = t.times ?? s, r = t.wait ?? r, t = t.duration ?? Yt.duration), {
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
    const s = W.sanitise(t, e, i), o = new W(s.duration);
    return this._timeline && o.timeline(this._timeline), this._element && o.element(this._element), o.loop(s).schedule(s.delay, s.when);
  }
  clearTransform() {
    return this.transforms = new m(), this;
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
    return this._stepper = new xe(t), this;
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
      const r = Math.floor(this._time / e), h = (this._time - r * e) / this._duration;
      return Math.min(r + h, this._times);
    }
    const i = Math.floor(t), s = t % 1, o = e * i + this._duration * s;
    return this.time(o);
  }
  persist(t) {
    return t == null ? this._persist : (this._persist = t, this);
  }
  position(t) {
    const e = this._time, i = this._duration, s = this._wait, o = this._times, r = this._swing, a = this._reverse;
    let h;
    if (t == null) {
      const d = function(p) {
        const g = r * Math.floor(p % (2 * (s + i)) / (s + i)), w = g && !a || !g && a, y = Math.pow(-1, w) * (p % (s + i)) / i + w;
        return Math.max(Math.min(y, 1), 0);
      }, f = o * (s + i) - s;
      return h = e <= 0 ? Math.round(d(1e-5)) : e < f ? d(e) : Math.round(d(f - 1e-5)), h;
    }
    const l = Math.floor(this.loops()), c = r && l % 2 === 0;
    return h = l + (c && !a || a && c ? t : 1 - t), this.loops(h);
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
      initialiser: t || Je,
      runner: e || Je,
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
    if (t instanceof Sn || (i = e, e = t, t = this.timeline()), !t)
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
    let h = !1;
    return (i || a) && (this._initialise(i), this.transforms = new m(), h = this._run(a ? t : e), this.fire("step", this)), this.done = this.done || h && a, r && this.fire("finished", this), this;
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
W.id = 0;
class se {
  constructor(t = new m(), e = -1, i = !0) {
    this.transforms = t, this.id = e, this.done = i;
  }
  clearTransformsFromQueue() {
  }
}
v([W, se], {
  mergeWith(n) {
    return new se(
      n.transforms.lmultiply(this.transforms),
      n.id
    );
  }
});
const Tn = (n, t) => n.lmultiplyO(t), Rn = (n) => n.transforms;
function zs() {
  const t = this._transformationRunners.runners.map(Rn).reduce(Tn, new m());
  this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
}
class As {
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
    return this.ids.splice(0, e, 0), this.runners.splice(0, e, new se()).forEach((i) => i.clearTransformsFromQueue()), this;
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
E({
  Element: {
    animate(n, t, e) {
      const i = W.sanitise(n, t, e), s = this.timeline();
      return new W(i.duration).loop(i).element(this).timeline(s.play()).schedule(i.delay, i.when);
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
      return this._transformationRunners.runners.filter((t) => t.id <= n.id).map(Rn).reduce(Tn, new m());
    },
    _addRunner(n) {
      this._transformationRunners.add(n), R.cancelImmediate(this._frameId), this._frameId = R.immediate(zs.bind(this));
    },
    _prepareRunner() {
      this._frameId == null && (this._transformationRunners = new As().add(
        new se(new m(this))
      ));
    }
  }
});
const Ps = (n, t) => n.filter((e) => !t.includes(e));
v(W, {
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
    let s = new xt(this._stepper).to(i), o = Object.keys(i);
    return this.queue(
      function() {
        s = s.from(this.element()[n](o));
      },
      function(r) {
        return this.element()[n](s.at(r).valueOf()), s.done();
      },
      function(r) {
        const a = Object.keys(r), h = Ps(a, o);
        if (h.length) {
          const c = this.element()[n](h), u = new Ft(s.from()).valueOf();
          Object.assign(u, c), s.from(u);
        }
        const l = new Ft(s.to()).valueOf();
        Object.assign(l, r), s.to(l), o = a, i = r;
      }
    ), this._rememberMorpher(n, s), this;
  },
  zoom(n, t) {
    if (this._tryRetarget("zoom", n, t)) return this;
    let e = new xt(this._stepper).to(new _(n));
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
    const i = m.isMatrixLike(n);
    e = n.affine != null ? n.affine : e ?? !i;
    const s = new xt(this._stepper).type(
      e ? Qt : m
    );
    let o, r, a, h, l;
    function c() {
      r = r || this.element(), o = o || ye(n, r), l = new m(t ? void 0 : r), r._addRunner(this), t || r._clearTransformRunnersBefore(this);
    }
    function u(f) {
      t || this.clearTransform();
      const { x: p, y: g } = new P(o).transform(
        r._currentTransform(this)
      );
      let w = new m({ ...n, origin: [p, g] }), y = this._isDeclarative && a ? a : l;
      if (e) {
        w = w.decompose(p, g), y = y.decompose(p, g);
        const k = w.rotate, I = y.rotate, Z = [k - 360, k, k + 360], X = Z.map((ot) => Math.abs(ot - I)), B = Math.min(...X), V = X.indexOf(B);
        w.rotate = Z[V];
      }
      t && (i || (w.rotate = n.rotate || 0), this._isDeclarative && h && (y.rotate = h)), s.from(y), s.to(w);
      const S = s.at(f);
      return h = S.rotate, a = new m(S), this.addTransform(a), r._addRunner(this), s.done();
    }
    function d(f) {
      (f.origin || "center").toString() !== (n.origin || "center").toString() && (o = ye(f, r)), n = { ...f, origin: o };
    }
    return this.queue(c, u, d, !0), this._isDeclarative && this._rememberMorpher("transform", s), this;
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
    if (t = new _(t), this._tryRetarget(n, t)) return this;
    const e = new xt(this._stepper).to(t);
    let i = null;
    return this.queue(
      function() {
        i = this.element()[n](), e.from(i), e.to(i + t);
      },
      function(s) {
        return this.element()[n](e.at(s)), e.done();
      },
      function(s) {
        e.to(i + new _(s));
      }
    ), this._rememberMorpher(n, e), this;
  },
  _queueObject(n, t) {
    if (this._tryRetarget(n, t)) return this;
    const e = new xt(this._stepper).to(t);
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
    return this._queueObject(n, new _(t));
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
    const s = new xt(this._stepper).type(this._element.MorphArray).to(n);
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
    return this._queueObject("viewbox", new A(n, t, e, i));
  },
  update(n) {
    return typeof n != "object" ? this.update({
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }) : (n.opacity != null && this.attr("stop-opacity", n.opacity), n.color != null && this.attr("stop-color", n.color), n.offset != null && this.attr("offset", n.offset), this);
  }
});
v(W, { rx: Be, ry: He, from: vn, to: En });
N(W, "Runner");
class ae extends F {
  constructor(t, e = t) {
    super(z("svg", t), e), this.namespace();
  }
  // Creates and returns defs element
  defs() {
    return this.isRoot() ? nt(this.node.querySelector("defs")) || this.put(new Ie()) : this.root().defs();
  }
  isRoot() {
    return !this.node.parentNode || !(this.node.parentNode instanceof C.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
  }
  // Add namespaces
  namespace() {
    return this.isRoot() ? this.attr({ xmlns: Me, version: "1.1" }).attr(
      "xmlns:xlink",
      Vt,
      de
    ) : this.root().namespace();
  }
  removeNamespace() {
    return this.attr({ xmlns: null, version: null }).attr("xmlns:xlink", null, de).attr("xmlns:svgjs", null, de);
  }
  // Check if this is a root svg
  // If not, call root() from this element
  root() {
    return this.isRoot() ? this : super.root();
  }
}
E({
  Container: {
    // Create nested svg document
    nested: M(function() {
      return this.put(new ae());
    })
  }
});
N(ae, "Svg", !0);
let Ye = class extends F {
  // Initialize node
  constructor(t, e = t) {
    super(z("symbol", t), e);
  }
};
E({
  Container: {
    symbol: M(function() {
      return this.put(new Ye());
    })
  }
});
N(Ye, "Symbol");
function ks(n) {
  return this._build === !1 && this.clear(), this.node.appendChild(C.document.createTextNode(n)), this;
}
function Gs() {
  return this.node.getComputedTextLength();
}
function Is(n, t = this.bbox()) {
  return n == null ? t.x : this.attr("x", this.attr("x") + n - t.x);
}
function Bs(n, t = this.bbox()) {
  return n == null ? t.y : this.attr("y", this.attr("y") + n - t.y);
}
function Hs(n, t, e = this.bbox()) {
  return this.x(n, e).y(t, e);
}
function Zs(n, t = this.bbox()) {
  return n == null ? t.cx : this.attr("x", this.attr("x") + n - t.cx);
}
function Us(n, t = this.bbox()) {
  return n == null ? t.cy : this.attr("y", this.attr("y") + n - t.cy);
}
function Ls(n, t, e = this.bbox()) {
  return this.cx(n, e).cy(t, e);
}
function Ys(n) {
  return this.attr("x", n);
}
function Xs(n) {
  return this.attr("y", n);
}
function js(n, t) {
  return this.ax(n).ay(t);
}
function Fs(n) {
  return this._build = !!n, this;
}
const On = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  amove: js,
  ax: Ys,
  ay: Xs,
  build: Fs,
  center: Ls,
  cx: Zs,
  cy: Us,
  length: Gs,
  move: Hs,
  plain: ks,
  x: Is,
  y: Bs
}, Symbol.toStringTag, { value: "Module" }));
class st extends J {
  // Initialize node
  constructor(t, e = t) {
    super(z("text", t), e), this.dom.leading = this.dom.leading ?? new _(1.3), this._rebuild = !0, this._build = !1;
  }
  // Set / get leading
  leading(t) {
    return t == null ? this.dom.leading : (this.dom.leading = new _(t), this.rebuild());
  }
  // Rebuild appearance type
  rebuild(t) {
    if (typeof t == "boolean" && (this._rebuild = t), this._rebuild) {
      const e = this;
      let i = 0;
      const s = this.dom.leading;
      this.each(function(o) {
        if (we(this.node)) return;
        const r = C.window.getComputedStyle(this.node).getPropertyValue("font-size"), a = s * new _(r);
        this.dom.newLined && (this.attr("x", e.attr("x")), this.text() === `
` ? i += a : (this.attr("dy", o ? a + i : 0), i = 0));
      }), this.fire("rebuild");
    }
    return this;
  }
  // overwrite method from parent to set data properly
  setData(t) {
    return this.dom = t, this.dom.leading = new _(t.leading || 1.3), this;
  }
  writeDataToDom() {
    return rn(this, this.dom, { leading: 1.3 }), this;
  }
  // Set the text content
  text(t) {
    if (t === void 0) {
      const e = this.node.childNodes;
      let i = 0;
      t = "";
      for (let s = 0, o = e.length; s < o; ++s) {
        if (e[s].nodeName === "textPath" || we(e[s])) {
          s === 0 && (i = s + 1);
          continue;
        }
        s !== i && e[s].nodeType !== 3 && nt(e[s]).dom.newLined === !0 && (t += `
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
v(st, On);
E({
  Container: {
    // Create text element
    text: M(function(n = "") {
      return this.put(new st()).text(n);
    }),
    // Create plain text element
    plain: M(function(n = "") {
      return this.put(new st()).plain(n);
    })
  }
});
N(st, "Text");
class he extends J {
  // Initialize node
  constructor(t, e = t) {
    super(z("tspan", t), e), this._build = !1;
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
    if (!(t instanceof st))
      return this;
    const e = t.index(this), i = C.window.getComputedStyle(this.node).getPropertyValue("font-size"), s = t.dom.leading * new _(i);
    return this.dy(e ? s : 0).attr("x", t.x());
  }
  // Set text content
  text(t) {
    return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
  }
}
v(he, On);
E({
  Tspan: {
    tspan: M(function(n = "") {
      const t = new he();
      return this._build || this.clear(), this.put(t).text(n);
    })
  },
  Text: {
    newLine: function(n = "") {
      return this.tspan(n).newLine();
    }
  }
});
N(he, "Tspan");
class le extends J {
  constructor(t, e = t) {
    super(z("circle", t), e);
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
    return this.radius(new _(t).divide(2));
  }
}
v(le, { x: mn, y: gn, cx: bn, cy: yn, width: wn, height: xn });
E({
  Container: {
    // Create circle element
    circle: M(function(n = 0) {
      return this.put(new le()).size(n).move(0, 0);
    })
  }
});
N(le, "Circle");
class Ne extends F {
  constructor(t, e = t) {
    super(z("clipPath", t), e);
  }
  // Unclip all clipped elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unclip();
    }), super.remove();
  }
  targets() {
    return Pt("svg [clip-path*=" + this.id() + "]");
  }
}
E({
  Container: {
    // Create clipping element
    clip: M(function() {
      return this.defs().put(new Ne());
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipper() {
      return this.reference("clip-path");
    },
    clipWith(n) {
      const t = n instanceof Ne ? n : this.parent().clip().add(n);
      return this.attr("clip-path", "url(#" + t.id() + ")");
    },
    // Unclip element
    unclip() {
      return this.attr("clip-path", null);
    }
  }
});
N(Ne, "ClipPath");
class Dn extends Q {
  constructor(t, e = t) {
    super(z("foreignObject", t), e);
  }
}
E({
  Container: {
    foreignObject: M(function(n, t) {
      return this.put(new Dn()).size(n, t);
    })
  }
});
N(Dn, "ForeignObject");
function Vs(n, t) {
  return this.children().forEach((e) => {
    let i;
    try {
      i = e.node instanceof ze().SVGSVGElement ? new A(e.attr(["x", "y", "width", "height"])) : e.bbox();
    } catch {
      return;
    }
    const s = new m(e), o = s.translate(n, t).transform(s.inverse()), r = new P(i.x, i.y).transform(o);
    e.move(r.x, r.y);
  }), this;
}
function $s(n) {
  return this.dmove(n, 0);
}
function qs(n) {
  return this.dmove(0, n);
}
function Ws(n, t = this.bbox()) {
  return n == null ? t.height : this.size(t.width, n, t);
}
function Qs(n = 0, t = 0, e = this.bbox()) {
  const i = n - e.x, s = t - e.y;
  return this.dmove(i, s);
}
function Js(n, t, e = this.bbox()) {
  const i = At(this, n, t, e), s = i.width / e.width, o = i.height / e.height;
  return this.children().forEach((r) => {
    const a = new P(e).transform(new m(r).inverse());
    r.scale(s, o, a.x, a.y);
  }), this;
}
function Ks(n, t = this.bbox()) {
  return n == null ? t.width : this.size(n, t.height, t);
}
function to(n, t = this.bbox()) {
  return n == null ? t.x : this.move(n, t.y, t);
}
function eo(n, t = this.bbox()) {
  return n == null ? t.y : this.move(t.x, n, t);
}
const Mn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dmove: Vs,
  dx: $s,
  dy: qs,
  height: Ws,
  move: Qs,
  size: Js,
  width: Ks,
  x: to,
  y: eo
}, Symbol.toStringTag, { value: "Module" }));
class Bt extends F {
  constructor(t, e = t) {
    super(z("g", t), e);
  }
}
v(Bt, Mn);
E({
  Container: {
    // Create a group element
    group: M(function() {
      return this.put(new Bt());
    })
  }
});
N(Bt, "G");
class oe extends F {
  constructor(t, e = t) {
    super(z("a", t), e);
  }
  // Link target attribute
  target(t) {
    return this.attr("target", t);
  }
  // Link url
  to(t) {
    return this.attr("href", t, Vt);
  }
}
v(oe, Mn);
E({
  Container: {
    // Create a hyperlink element
    link: M(function(n) {
      return this.put(new oe()).to(n);
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
      return t || (t = new oe(), this.wrap(t)), typeof n == "function" ? n.call(t, t) : t.to(n), this;
    },
    linker() {
      const n = this.parent();
      return n && n.node.nodeName.toLowerCase() === "a" ? n : null;
    }
  }
});
N(oe, "A");
class Se extends F {
  // Initialize node
  constructor(t, e = t) {
    super(z("mask", t), e);
  }
  // Unmask all masked elements and remove itself
  remove() {
    return this.targets().forEach(function(t) {
      t.unmask();
    }), super.remove();
  }
  targets() {
    return Pt("svg [mask*=" + this.id() + "]");
  }
}
E({
  Container: {
    mask: M(function() {
      return this.defs().put(new Se());
    })
  },
  Element: {
    // Distribute mask to svg element
    masker() {
      return this.reference("mask");
    },
    maskWith(n) {
      const t = n instanceof Se ? n : this.parent().mask().add(n);
      return this.attr("mask", "url(#" + t.id() + ")");
    },
    // Unmask element
    unmask() {
      return this.attr("mask", null);
    }
  }
});
N(Se, "Mask");
class zn extends Q {
  constructor(t, e = t) {
    super(z("stop", t), e);
  }
  // add color stops
  update(t) {
    return (typeof t == "number" || t instanceof _) && (t = {
      offset: arguments[0],
      color: arguments[1],
      opacity: arguments[2]
    }), t.opacity != null && this.attr("stop-opacity", t.opacity), t.color != null && this.attr("stop-color", t.color), t.offset != null && this.attr("offset", new _(t.offset)), this;
  }
}
E({
  Gradient: {
    // Add a color stop
    stop: function(n, t, e) {
      return this.put(new zn()).update(n, t, e);
    }
  }
});
N(zn, "Stop");
function no(n, t) {
  if (!n) return "";
  if (!t) return n;
  let e = n + "{";
  for (const i in t)
    e += qn(i) + ":" + t[i] + ";";
  return e += "}", e;
}
class Te extends Q {
  constructor(t, e = t) {
    super(z("style", t), e);
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
    return this.addText(no(t, e));
  }
}
E("Dom", {
  style(n, t) {
    return this.put(new Te()).rule(n, t);
  },
  fontface(n, t, e) {
    return this.put(new Te()).font(n, t, e);
  }
});
N(Te, "Style");
class Xe extends st {
  // Initialize node
  constructor(t, e = t) {
    super(z("textPath", t), e);
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
E({
  Container: {
    textPath: M(function(n, t) {
      return n instanceof st || (n = this.text(n)), n.path(t);
    })
  },
  Text: {
    // Create path for text to run on
    path: M(function(n, t = !0) {
      const e = new Xe();
      n instanceof kt || (n = this.defs().path(n)), e.attr("href", "#" + n, Vt);
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
    text: M(function(n) {
      return n instanceof st || (n = new st().addTo(this.parent()).text(n)), n.path(this);
    }),
    targets() {
      return Pt("svg textPath").filter((n) => (n.attr("href") || "").includes(this.id()));
    }
  }
});
Xe.prototype.MorphArray = Et;
N(Xe, "TextPath");
class An extends J {
  constructor(t, e = t) {
    super(z("use", t), e);
  }
  // Use element as a reference
  use(t, e) {
    return this.attr("href", (e || "") + "#" + t, Vt);
  }
}
E({
  Container: {
    // Create a use element
    use: M(function(n, t) {
      return this.put(new An()).use(n, t);
    })
  }
});
N(An, "Use");
const Pn = Y;
v([ae, Ye, re, jt, ne], j("viewbox"));
v([zt, It, Gt, kt], j("marker"));
v(st, j("Text"));
v(kt, j("Path"));
v(Ie, j("Defs"));
v([st, he], j("Tspan"));
v([Jt, qt, Wt, W], j("radius"));
v($t, j("EventTarget"));
v(pt, j("Dom"));
v(Q, j("Element"));
v(J, j("Shape"));
v([F, _n], j("Container"));
v(Wt, j("Gradient"));
v(W, j("Runner"));
vt.extend(Vn());
Es([
  _,
  O,
  A,
  m,
  Mt,
  mt,
  Et,
  P
]);
Cs();
const tn = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY });
class io {
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
    t.preventDefault(), t.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(tn(t));
    const i = (e ? "mousemove" : "touchmove") + ".drag", s = (e ? "mouseup" : "touchend") + ".drag";
    q(window, i, this.drag, this, { passive: !1 }), q(window, s, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: t, handler: this, box: this.box });
  }
  // While dragging
  drag(t) {
    const { box: e, lastClick: i } = this, s = this.el.point(tn(t)), o = s.x - i.x, r = s.y - i.y;
    if (!o && !r) return e;
    const a = e.x + o, h = e.y + r;
    this.box = new A(a, h, e.w, e.h), this.lastClick = s, !this.el.dispatch("dragmove", {
      event: t,
      handler: this,
      box: this.box,
      dx: o,
      dy: r
    }).defaultPrevented && this.move(a, h);
  }
  move(t, e) {
    this.el.type === "svg" ? Bt.prototype.move.call(this.el, t, e) : this.el.move(t, e);
  }
  endDrag(t) {
    this.drag(t), this.el.fire("dragend", { event: t, handler: this, box: this.box }), H(window, "mousemove.drag"), H(window, "touchmove.drag"), H(window, "mouseup.drag"), H(window, "touchend.drag"), this.init(!0);
  }
}
v(Q, {
  draggable(n = !0) {
    return (this.remember("_draggable") || new io(this)).init(n), this;
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
function Re(n, t, e, i = null) {
  return function(s) {
    s.preventDefault(), s.stopPropagation();
    var o = s.pageX || s.touches[0].pageX, r = s.pageY || s.touches[0].pageY;
    t.fire(n, { x: o, y: r, event: s, index: i, points: e });
  };
}
function Oe([n, t], { a: e, b: i, c: s, d: o, e: r, f: a }) {
  return [n * e + t * s + r, n * i + t * o + a];
}
class kn {
  constructor(t) {
    this.el = t, t.remember("_selectHandler", this), this.selection = new Bt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = ze();
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
      this.createHandle.call(this, this.selection, t, e, i, s), this.selection.get(e + 1).addClass("svg_select_handle svg_select_handle_" + s).on("mousedown.selection touchstart.selection", Re(s, this.el, this.handlePoints, e));
    });
  }
  createHandleFn(t) {
    t.polyline();
  }
  updateHandleFn(t, e, i, s) {
    const o = s.at(i - 1), r = s[(i + 1) % s.length], a = e, h = [a[0] - o[0], a[1] - o[1]], l = [a[0] - r[0], a[1] - r[1]], c = Math.sqrt(h[0] * h[0] + h[1] * h[1]), u = Math.sqrt(l[0] * l[0] + l[1] * l[1]), d = [h[0] / c, h[1] / c], f = [l[0] / u, l[1] / u], p = [a[0] - d[0] * 10, a[1] - d[1] * 10], g = [a[0] - f[0] * 10, a[1] - f[1] * 10];
    t.plot([p, a, g]);
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
    const t = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection touchstart.selection", Re("rot", this.el, this.handlePoints));
    this.createRot.call(this, t);
  }
  updateRotationHandle() {
    const t = this.selection.findOne("g.svg_select_handle_rot");
    this.updateRot(t, this.rotationPoint, this.handlePoints);
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const t = this.el.bbox(), e = this.el.screenCTM(), s = this.el.root().screenCTM().inverseO().multiplyO(e);
    this.handlePoints = this.getHandlePoints(t).map((o) => Oe(o, s)), this.rotationPoint = Oe(this.getRotationPoint(t), s);
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
class so {
  constructor(t) {
    this.el = t, t.remember("_pointSelectHandler", this), this.selection = new Bt(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const e = ze();
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
      this.createHandle.call(this, this.selection, t, e, i), this.selection.get(e + 1).addClass("svg_select_handle_point").on("mousedown.selection touchstart.selection", Re("point", this.el, this.points, e));
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
    this.points = this.el.array().map((e) => Oe(e, t));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}
const Gn = (n) => function(t = !0, e = {}) {
  typeof t == "object" && (e = t, t = !0);
  let i = this.remember("_" + n.name);
  return i || (t.prototype instanceof kn ? (i = new t(this), t = !0) : i = new n(this), this.remember("_" + n.name, i)), i.active(t, e), this;
};
v(Q, {
  select: Gn(kn)
});
v([Gt, It, zt], {
  pointSelect: Gn(so)
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
const ee = (n) => (n.changedTouches && (n = n.changedTouches[0]), { x: n.clientX, y: n.clientY }), In = (n) => {
  let t = 1 / 0, e = 1 / 0, i = -1 / 0, s = -1 / 0;
  for (let o = 0; o < n.length; o++) {
    const r = n[o];
    t = Math.min(t, r[0]), e = Math.min(e, r[1]), i = Math.max(i, r[0]), s = Math.max(s, r[1]);
  }
  return new A(t, e, i - t, s - e);
};
function oo(n, t, e) {
  const s = [
    [n.x, n.y],
    [n.x + n.width, n.y],
    [n.x + n.width, n.y + n.height],
    [n.x, n.y + n.height]
  ].map(([o, r]) => {
    const a = o - t[0], h = r - t[1], l = a * e, c = h * e;
    return [l + t[0], c + t[1]];
  });
  return In(s);
}
class en {
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
    this.box = this.el.bbox(), this.startPoint = this.el.point(ee(e)), this.index = i, this.points = s.slice();
    const r = (o ? "mousemove" : "touchmove") + ".resize", a = (o ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    t.type === "point" ? q(window, r, this.movePoint) : t.type === "rot" ? q(window, r, this.rotate) : q(window, r, this.resize), q(window, a, this.endResize);
  }
  resize(t) {
    this.lastEvent = t;
    const e = this.snapToGrid(this.el.point(ee(t)));
    let i = e.x - this.startPoint.x, s = e.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (i *= 2, s *= 2);
    const o = this.box.x + i, r = this.box.y + s, a = this.box.x2 + i, h = this.box.y2 + s;
    let l = new A(this.box);
    if (this.eventType.includes("l") && (l.x = Math.min(o, this.box.x2), l.x2 = Math.max(o, this.box.x2)), this.eventType.includes("r") && (l.x = Math.min(a, this.box.x), l.x2 = Math.max(a, this.box.x)), this.eventType.includes("t") && (l.y = Math.min(r, this.box.y2), l.y2 = Math.max(r, this.box.y2)), this.eventType.includes("b") && (l.y = Math.min(h, this.box.y), l.y2 = Math.max(h, this.box.y)), l.width = l.x2 - l.x, l.height = l.y2 - l.y, this.preserveAspectRatio) {
      const c = l.width / this.box.width, u = l.height / this.box.height, d = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], f = (d.indexOf(this.eventType) + 4) % d.length, p = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[f];
      let g = this.eventType.includes("t") || this.eventType.includes("b") ? u : c;
      g = this.eventType.length === 2 ? Math.max(c, u) : g, l = oo(this.box, p, g);
    }
    this.el.dispatch("resize", {
      box: new A(l),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.size(l.width, l.height).move(l.x, l.y);
  }
  movePoint(t) {
    this.lastEvent = t;
    const { x: e, y: i } = this.snapToGrid(this.el.point(ee(t))), s = this.el.array().slice();
    s[this.index] = [e, i], !this.el.dispatch("resize", {
      box: In(s),
      angle: 0,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented && this.el.plot(s);
  }
  rotate(t) {
    this.lastEvent = t;
    const e = this.startPoint, i = this.el.point(ee(t)), { cx: s, cy: o } = this.box, r = e.x - s, a = e.y - o, h = i.x - s, l = i.y - o, c = Math.sqrt(r * r + a * a) * Math.sqrt(h * h + l * l);
    if (c === 0)
      return;
    let u = Math.acos((r * h + a * l) / c) / Math.PI * 180;
    if (!u) return;
    i.x < e.x && (u = -u);
    const d = new m(this.el), { x: f, y: p } = new P(s, o).transformO(d), { rotate: g } = d.decompose(), w = this.snapToAngle(g + u) - g;
    this.el.dispatch("resize", {
      box: this.box,
      angle: w,
      eventType: this.eventType,
      event: t,
      handler: this
    }).defaultPrevented || this.el.transform(d.rotateO(w, f, p));
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
v(Q, {
  // Resize element with mouse
  resize: function(n = !0, t = {}) {
    typeof n == "object" && (t = n, n = !0);
    let e = this.remember("_ResizeHandler");
    return e || (n.prototype instanceof en ? (e = new n(this), n = !0) : e = new en(this), this.remember("_resizeHandler", e)), e.active(n, t), this;
  }
});
class Bn {
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
    if (!this.isActive)
      try {
        const t = this.target;
        typeof t.select == "function" && t.select({ rotationPoint: this.options.rotateEnabled }), this.options.resizeEnabled && typeof t.resize == "function" && t.resize({
          preserveAspectRatio: this.options.preserveAspectRatio,
          aroundCenter: this.options.aroundCenter,
          grid: this.options.grid ?? 1,
          degree: this.options.degree ?? 0.1
        }), this.addEventListeners(), this.isActive = !0;
      } catch (t) {
        console.warn("Failed to enable resize/rotate:", t);
      }
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
      this.isResizeRotateHandle(t.target) && (console.log("RESIZE_ROTATE_DEBUG: Handle interaction started, hiding connection handles"), this.node.isConnectionHandlesEnabled() && this.node.disableConnectionHandles());
    }), this.target.on("resize", (t) => {
      this.handleResize(t), this.options.onResize?.(t), console.log("RESIZE_ROTATE_DEBUG: Resize complete, re-enabling connection handles"), this.node.slate && this.node.slate.getSelectedNodes().includes(this.node) && setTimeout(() => {
        this.node.enableConnectionHandles();
      }, 50);
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
    this.target.off("resize");
  }
  handleResize(t) {
    if (t.detail && t.detail.box) {
      const e = t.detail.box;
      if (this.node.options.width = e.width, this.node.options.height = e.height, this.node.options.x = e.x, this.node.options.y = e.y, this.node.setSize(e.width, e.height), this.node.centerText(), t.detail && typeof t.detail.angle == "number") {
        const i = t.detail.angle;
        if (this.node.options.rotate && (this.node.options.rotate.rotationAngle = i), this.node.textElement && typeof this.node.textElement.rotate == "function") {
          const s = this.target.bbox();
          this.node.textElement.rotate(i, s.cx, s.cy);
        } else if (this.node.nestedSvg && typeof this.node.nestedSvg.rotate == "function") {
          const s = this.target.bbox();
          this.node.nestedSvg.rotate(i, s.cx, s.cy);
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
    this.isActive && (console.log("RESIZE_ROTATE_DEBUG: Refreshing handles for", this.node.id), this.disable(), this.enable());
  }
}
typeof window < "u" && (window.SVG = Pn);
class ro {
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
      sourceAttach: "center",
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
        const r = `${t.id}<-${this.node.id}`;
        t.connector.connections.set(r, o);
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
class Hn {
  constructor(t, e) {
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.id = t.id || this.generateId(), this.slate = e, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: t }), this.options = {
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
    }, console.log("NODE_DEBUG: Calling createAsync for", this.id), this.createAsync();
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }
  async createAsync() {
    console.log("NODE_DEBUG: createAsync started for", this.id);
    try {
      const t = await this.slate.getViewportAsync();
      console.log("NODE_DEBUG: Got viewport for", this.id, t), this.svgGroup = t.group(), console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup), this.finishCreate();
    } catch (t) {
      console.error("NODE_DEBUG: Error in createAsync for", this.id, t);
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
      const e = this.options.width, i = this.options.height, s = this.backgroundRect.x?.() ?? 0, o = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(e, i).move(s, o), this.nestedSvg.svg(this.options.svgContent), setTimeout(() => {
        const r = this.nestedSvg.children()[0];
        if (r) {
          let a = r.bbox();
          console.log("Delayed bbox:", a, "Node size:", e, i), (a.width <= 0 || a.height <= 0) && (a = this.calculatePathBounds(this.options.svgContent, e, i), console.log("Calculated bounds:", a)), a.width > 0 && a.height > 0 ? (this.nestedSvg.viewbox(a.x, a.y, a.width, a.height), this.nestedSvg.node.setAttribute(
            "preserveAspectRatio",
            "xMidYMid meet"
          ), console.log(
            `Set viewbox(${a.x}, ${a.y}, ${a.width}, ${a.height}) with preserveAspectRatio="xMidYMid meet"`
          )) : (console.log("Invalid bounds, trying default viewbox approach"), this.nestedSvg.viewbox(0, 0, 24, 24), this.nestedSvg.node.setAttribute(
            "preserveAspectRatio",
            "xMidYMid meet"
          ));
        }
      }, 10);
    }
    this.resizeRotate = new Bn(this, this.options.resizeRotate), this.connector = new ro(this, this.options.connector), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), t || this.centerTextInitial(), console.log("NODE_DEBUG: finishCreate continuing for", this.id);
  }
  createBackground() {
    console.log(
      "NODE_DEBUG: createBackground called for",
      this.id,
      "shape:",
      this.options.shape
    );
    const { width: t, height: e, backgroundColor: i, borderColor: s, borderWidth: o, shape: r } = this.options;
    switch (r) {
      case "circle":
        const a = Math.min(t, e) / 2;
        this.backgroundRect = this.svgGroup.circle(a * 2).fill(i).stroke({ color: s, width: o });
        break;
      case "ellipse":
        this.backgroundRect = this.svgGroup.ellipse(t, e).fill(i).stroke({ color: s, width: o });
        break;
      default:
        this.backgroundRect = this.svgGroup.rect(t, e).fill(i).stroke({ color: s, width: o }).radius(4);
        break;
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
    }), console.log(
      "NODE_DEBUG: createText completed for",
      this.id,
      "textElement:",
      this.textElement
    ), this.centerText();
  }
  centerText() {
    if (!this.textElement) return;
    const { width: t, height: e, textXAlign: i, textYAlign: s, textOffset: o } = this.options, r = this.textElement.bbox(), a = this.backgroundRect.x?.() ?? 0, h = this.backgroundRect.y?.() ?? 0;
    let l = a + (o.x || 0), c = h + (o.y || 0);
    switch (i) {
      case "left":
        l += 5;
        break;
      case "right":
        l += t - r.width - 5;
        break;
      default:
        l += (t - r.width) / 2;
        break;
    }
    switch (s) {
      case "top":
        c += 5;
        break;
      case "bottom":
        c += e - r.height - 5;
        break;
      default:
        c += (e - r.height) / 2;
        break;
    }
    this.textElement.move(l, c);
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("dragstart.node", (t) => {
      console.log("DRAG_DEBUG: Drag started on", this.id), this.toFront(), this.slate.getSelectedNodes().includes(this) ? console.log(
        "SELECTION_DEBUG: Drag started on already selected node",
        this.id
      ) : (console.log(
        "SELECTION_DEBUG: Drag started on unselected node",
        this.id,
        "- selecting it"
      ), this.slate.selectNodes([this], !1)), this.isDragging = !0, this.wasSelectedBeforeDrag = !0, this.slate.disableNodeResizeRotate(this);
    }), this.svgGroup.on("dragend.node", (t) => {
      console.log("DRAG_DEBUG: Drag ended on", this.id);
      const e = this.svgGroup.bbox();
      this.options.x = e.x, this.options.y = e.y, setTimeout(() => {
        this.isDragging = !1, this.slate.getSelectedNodes().includes(this) ? (console.log(
          "SELECTION_DEBUG: Drag ended on selected node",
          this.id,
          "- re-enabling resize/rotate"
        ), this.slate.updateSelectionResizeRotate()) : (console.log(
          "SELECTION_DEBUG: Drag ended on unselected node",
          this.id,
          "- selecting it"
        ), this.slate.selectNodes([this], !1));
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
    this.svgGroup.remove();
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
    if (this.options.width = t, this.options.height = e, this.backgroundRect instanceof Jt)
      this.backgroundRect.size(t, e);
    else if (this.backgroundRect instanceof le) {
      const i = Math.min(t, e) / 2;
      this.backgroundRect.radius(i);
    } else this.backgroundRect instanceof qt && this.backgroundRect.size(t, e);
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
    this.options.isLocked = !1, this.options.allowDrag = !0, this.makeDraggable();
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
    this.options.rotate.rotationAngle = t, this.svgGroup.rotate(t);
  }
  getRotation() {
    try {
      const t = this.backgroundRect.transform();
      if (t && typeof t.rotation < "u")
        return t.rotation;
      if (t && typeof t.rotate < "u")
        return t.rotate;
    } catch {
    }
    return this.options.rotate?.rotationAngle || 0;
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
    if (!this.textElement) return;
    const { width: t, height: e, textXAlign: i, textYAlign: s, textOffset: o } = this.options, r = this.textElement.bbox(), a = this.backgroundRect.x?.() ?? 0, h = this.backgroundRect.y?.() ?? 0;
    let l = a + (o.x || 0), c = h + (o.y || 0);
    switch (i) {
      case "left":
        l += 5;
        break;
      case "right":
        l += t - r.width - 5;
        break;
      default:
        l += (t - r.width) / 2;
        break;
    }
    switch (s) {
      case "top":
        c += 5;
        break;
      case "bottom":
        c += e - r.height - 5;
        break;
      default:
        c += (e - r.height) / 2;
        break;
    }
    this.textElement.move(l, c);
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
      const a = parseInt(o[1]), h = parseInt(r[1]);
      if (!isNaN(a) && !isNaN(h))
        return { x: 0, y: 0, width: a, height: h };
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
          const r = i.ctrlKey || i.metaKey;
          this.slate.selectNodes([this], r);
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
    ), this.connectionHandles.container = this.svgGroup.group();
    const t = 8, e = "#007cff", i = "#ffffff", s = 2, o = {
      top: { x: 0, y: -t - 5 },
      right: { x: t + 5, y: 0 },
      bottom: { x: 0, y: t + 5 },
      left: { x: -t - 5, y: 0 }
    };
    Object.entries(o).forEach(([r, a]) => {
      if (!this.connectionHandles.container) return;
      const h = this.connectionHandles.container.circle(t * 2).fill(e).stroke({ color: i, width: s }).addClass(`connection-handle connection-handle-${r}`);
      h.node.style.cursor = "pointer", this.connectionHandles[r] = h, h.on(
        "mouseenter",
        () => this.showConnectionPreview(
          r
        )
      ), h.on("mouseleave", () => this.hideConnectionPreview()), h.on("click", (l) => {
        l.stopPropagation(), console.log(
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
    const t = this.backgroundRect.bbox(), e = this.backgroundRect.screenCTM(), s = this.backgroundRect.root().screenCTM().inverseO().multiplyO(e), o = ([u, d], { a: f, b: p, c: g, d: w, e: y, f: S }) => [u * f + d * g + y, u * p + d * w + S], r = t.x + t.width / 2, a = t.y + t.height / 2, h = 35, l = 20, c = {
      top: [r, t.y - h],
      right: [t.x + t.width + l, a],
      bottom: [r, t.y + t.height + l],
      left: [t.x - l, a]
    };
    Object.entries(c).forEach(([u, d]) => {
      const f = this.connectionHandles[u];
      if (f) {
        const [p, g] = o(d, s);
        f.center(p, g);
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
    const i = this.options.width, s = this.options.height, o = 75, r = this.getRotation(), a = this.backgroundRect.rbox(this.backgroundRect.root()), h = a.cx, l = a.cy, c = this.connectionHandles[t];
    if (!c) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", t);
      return;
    }
    const u = c.bbox(), d = {
      x: u.x + u.width / 2,
      y: u.y + u.height / 2
    }, f = d.x - h, p = d.y - l, g = Math.sqrt(f * f + p * p), w = f / g, y = p / g, S = this.backgroundRect.bbox(), k = S.x + S.width / 2, I = S.y + S.height / 2, Z = this.backgroundRect.screenCTM(), B = this.backgroundRect.root().screenCTM().inverseO().multiplyO(Z), V = B.inverse(), ot = w * V.a + y * V.c, rt = w * V.b + y * V.d;
    let D, it;
    const K = Math.abs(ot);
    Math.abs(rt) > K ? rt < 0 ? (D = k, it = S.y) : (D = k, it = S.y + S.height) : ot < 0 ? (D = S.x, it = I) : (D = S.x + S.width, it = I);
    const Ct = ([L, $], { a: Tt, b: x, c: lt, d: ct, e: Ht, f: Zt }) => [L * Tt + $ * lt + Ht, L * x + $ * ct + Zt], [Nt, bt] = Ct([D, it], B), at = Math.sqrt(
      Math.pow(Nt - h, 2) + Math.pow(bt - l, 2)
    ), ht = at, yt = at + o + ht, St = h + w * yt, U = l + y * yt, b = St - i / 2, T = U - s / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      b,
      T,
      i,
      s,
      r
      // Pass rotation angle to preview
    );
    const tt = at + o - g, et = {
      x: d.x + w * tt,
      y: d.y + y * tt
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(d.x, d.y, et.x, et.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      d,
      et
    );
  }
  createPreviewShape(t, e, i, s, o, r = 0) {
    let a;
    const h = this.options.backgroundColor || "#007cff", l = "#ffffff", c = 2, u = 0.6, d = e + s / 2, f = i + o / 2;
    switch (this.options.shape) {
      case "circle":
        const p = Math.min(s, o) / 2;
        a = t.circle(p * 2).center(d, f).fill(h).stroke({ color: l, width: c }).opacity(u), r !== 0 && a.rotate(r, d, f);
        break;
      case "ellipse":
        a = t.ellipse(s, o).center(d, f).fill(h).stroke({ color: l, width: c }).opacity(u), r !== 0 && a.rotate(r, d, f);
        break;
      default:
        if (this.options.svgContent) {
          a = t.rect(s, o).move(e, i).fill("none").stroke({ color: l, width: c }).opacity(u).radius(4);
          const g = t.nested().size(s, o).move(e, i);
          g.svg(this.options.svgContent), setTimeout(() => {
            const w = g.children()[0];
            if (w) {
              let y = w.bbox();
              (y.width <= 0 || y.height <= 0) && (y = this.calculatePathBounds(
                this.options.svgContent,
                s,
                o
              )), y.width > 0 && y.height > 0 && (g.viewbox(y.x, y.y, y.width, y.height), g.node.setAttribute(
                "preserveAspectRatio",
                "xMidYMid meet"
              )), w.fill(h).opacity(u);
            }
          }, 1), g.attr("pointer-events", "none"), r !== 0 && (a.rotate(r, d, f), g.rotate(r, d, f));
        } else
          a = t.rect(s, o).move(e, i).fill(h).stroke({ color: l, width: c }).opacity(u).radius(4), r !== 0 && a.rotate(r, d, f);
        break;
    }
    return a.attr("pointer-events", "none");
  }
  addArrowheadToConnector(t, e, i) {
    const s = i.x - e.x, o = i.y - e.y, r = Math.sqrt(s * s + o * o);
    if (r === 0) return;
    const a = s / r, h = o / r, l = 12, c = 6, u = i.x, d = i.y, f = u - a * l, p = d - h * l, g = -h * c, w = a * c, y = [
      [u, d],
      [f + g, p + w],
      [f - g, p - w],
      [u, d]
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
      const e = this.options.width, i = this.options.height, s = 75, o = this.getRotation(), r = o * Math.PI / 180;
      let a = 0, h = 0;
      switch (t) {
        case "top":
          a = 0, h = -1;
          break;
        case "right":
          a = 1, h = 0;
          break;
        case "bottom":
          a = 0, h = 1;
          break;
        case "left":
          a = -1, h = 0;
          break;
      }
      const l = a * Math.cos(r) - h * Math.sin(r), c = a * Math.sin(r) + h * Math.cos(r), u = this.backgroundRect.rbox(this.backgroundRect.root()), d = u.cx, f = u.cy, p = this.backgroundRect.bbox(), g = p.x + p.width / 2, w = p.y + p.height / 2;
      let y, S;
      switch (t) {
        case "top":
          y = g, S = p.y;
          break;
        case "right":
          y = p.x + p.width, S = w;
          break;
        case "bottom":
          y = g, S = p.y + p.height;
          break;
        case "left":
          y = p.x, S = w;
          break;
      }
      const k = this.backgroundRect.screenCTM(), Z = this.backgroundRect.root().screenCTM().inverseO().multiplyO(k), X = ([at, ht], { a: yt, b: St, c: U, d: b, e: T, f: G }) => [at * yt + ht * U + T, at * St + ht * b + G], [B, V] = X([y, S], Z), ot = Math.sqrt(
        Math.pow(B - d, 2) + Math.pow(V - f, 2)
      ), rt = ot, D = ot + s + rt, it = d + l * D, K = f + c * D, gt = it - e / 2, Ct = K - i / 2, Nt = this.cloneNodeOptions(gt, Ct, o), bt = this.slate.addNode(Nt);
      if (!bt) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        bt.id,
        "at",
        gt,
        Ct
      ), this.hideConnectionPreview(), setTimeout(() => {
        this.connectToNode(bt);
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
class ao {
  constructor(t) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = t;
  }
  add(t = {}) {
    if (t.id || (t.id = this.generateId()), this.nodes.has(t.id))
      return console.warn(`Node with id "${t.id}" already exists`), this.nodes.get(t.id);
    const e = new Hn(t, this.slate);
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
class ho {
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
var Lt = function(t) {
  return t.touches || [{
    clientX: t.clientX,
    clientY: t.clientY
  }];
};
v(ae, {
  panZoom: function(t) {
    var e, i, s, o, r, a, h, l, c, u, d, f, p = this;
    if (this.off(".panZoom"), t === !1) return this;
    t = (e = t) != null ? e : {};
    var g = (i = t.zoomFactor) != null ? i : 2, w = (s = t.zoomMin) != null ? s : Number.MIN_VALUE, y = (o = t.zoomMax) != null ? o : Number.MAX_VALUE, S = (r = t.wheelZoom) != null ? r : !0, k = (a = t.pinchZoom) != null ? a : !0, I = (h = t.panning) != null ? h : !0, Z = (l = t.panButton) != null ? l : 0, X = (c = t.oneFingerPan) != null ? c : !1, B = (u = t.margins) != null ? u : !1, V = (d = t.wheelZoomDeltaModeLinePixels) != null ? d : 17, ot = (f = t.wheelZoomDeltaModeScreenPixels) != null ? f : 53, rt, D, it = !1, K = this.viewbox(), gt = function(b) {
      if (!B) return b;
      var T = B.top, G = B.left, tt = B.bottom, et = B.right, L = p.attr(["width", "height"]), $ = L.width, Tt = L.height, x = p.node.preserveAspectRatio.baseVal, lt = 0, ct = 0, Ht = 0, Zt = 0;
      if (x.align !== x.SVG_PRESERVEASPECTRATIO_NONE) {
        var Kt = $ / Tt, te = K.width / K.height;
        if (te !== Kt) {
          var je = x.meetOrSlice !== x.SVG_MEETORSLICE_SLICE, ce = Kt > te ? "width" : "height", Fe = ce === "width", Ve = je && Fe || !je && !Fe, Ln = Ve ? Kt / te : te / Kt, dt = b[ce] - b[ce] * Ln;
          Ve ? x.align === x.SVG_PRESERVEASPECTRATIO_XMIDYMIN || x.align === x.SVG_PRESERVEASPECTRATIO_XMIDYMID || x.align === x.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (lt = dt / 2, ct = -dt / 2) : x.align === x.SVG_PRESERVEASPECTRATIO_XMINYMIN || x.align === x.SVG_PRESERVEASPECTRATIO_XMINYMID || x.align === x.SVG_PRESERVEASPECTRATIO_XMINYMAX ? ct = -dt : (x.align === x.SVG_PRESERVEASPECTRATIO_XMAXYMIN || x.align === x.SVG_PRESERVEASPECTRATIO_XMAXYMID || x.align === x.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (lt = dt) : x.align === x.SVG_PRESERVEASPECTRATIO_XMINYMID || x.align === x.SVG_PRESERVEASPECTRATIO_XMIDYMID || x.align === x.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (Ht = dt / 2, Zt = -dt / 2) : x.align === x.SVG_PRESERVEASPECTRATIO_XMINYMIN || x.align === x.SVG_PRESERVEASPECTRATIO_XMIDYMIN || x.align === x.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? Zt = -dt : (x.align === x.SVG_PRESERVEASPECTRATIO_XMINYMAX || x.align === x.SVG_PRESERVEASPECTRATIO_XMIDYMAX || x.align === x.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (Ht = dt);
        }
      }
      var Yn = K.width + K.x - G - lt, Xn = K.x + et - b.width - ct, jn = K.height + K.y - T - Ht, Fn = K.y + tt - b.height - Zt;
      return b.x = Math.min(Yn, Math.max(Xn, b.x)), b.y = Math.min(jn, Math.max(Fn, b.y)), b;
    }, Ct = function(b) {
      b.preventDefault();
      var T;
      switch (b.deltaMode) {
        case 1:
          T = b.deltaY * V;
          break;
        case 2:
          T = b.deltaY * ot;
          break;
        default:
          T = b.deltaY;
          break;
      }
      var G = Math.pow(1 + g, -1 * T / 100) * this.zoom(), tt = this.point(b.clientX, b.clientY);
      if (G > y && (G = y), G < w && (G = w), this.dispatch("zoom", {
        level: G,
        focus: tt
      }).defaultPrevented)
        return this;
      if (this.zoom(G, tt), B) {
        var et = gt(this.viewbox());
        this.viewbox(et);
      }
    }, Nt = function U(b) {
      if (D = Lt(b), D.length < 2) {
        I && X && ht.call(this, b);
        return;
      }
      I && X && yt.call(this, b), b.preventDefault(), !this.dispatch("pinchZoomStart", {
        event: b
      }).defaultPrevented && (this.off("touchstart.panZoom", U), it = !0, q(document, "touchmove.panZoom", at, this, {
        passive: !1
      }), q(document, "touchend.panZoom", bt, this, {
        passive: !1
      }));
    }, bt = function U(b) {
      b.preventDefault();
      var T = Lt(b);
      T.length > 1 || (it = !1, this.dispatch("pinchZoomEnd", {
        event: b
      }), H(document, "touchmove.panZoom", at), H(document, "touchend.panZoom", U), this.on("touchstart.panZoom", Nt), T.length && I && X && ht.call(this, b));
    }, at = function(b) {
      b.preventDefault();
      var T = Lt(b), G = this.zoom(), tt = Math.sqrt(Math.pow(D[0].clientX - D[1].clientX, 2) + Math.pow(D[0].clientY - D[1].clientY, 2)), et = Math.sqrt(Math.pow(T[0].clientX - T[1].clientX, 2) + Math.pow(T[0].clientY - T[1].clientY, 2)), L = tt / et;
      (G < w && L > 1 || G > y && L < 1) && (L = 1);
      var $ = {
        x: T[0].clientX + 0.5 * (T[1].clientX - T[0].clientX),
        y: T[0].clientY + 0.5 * (T[1].clientY - T[0].clientY)
      }, Tt = {
        x: D[0].clientX + 0.5 * (D[1].clientX - D[0].clientX),
        y: D[0].clientY + 0.5 * (D[1].clientY - D[0].clientY)
      }, x = this.point($.x, $.y), lt = this.point(2 * $.x - Tt.x, 2 * $.y - Tt.y), ct = new A(this.viewbox()).transform(new m().translate(-lt.x, -lt.y).scale(L, 0, 0).translate(x.x, x.y));
      gt(ct), this.viewbox(ct), D = T, this.dispatch("zoom", {
        box: ct,
        focus: lt
      });
    }, ht = function U(b) {
      var T = b.type.indexOf("mouse") > -1;
      T && b.button !== Z && b.which !== Z + 1 || (b.preventDefault(), this.off("mousedown.panZoom", U), D = Lt(b), !it && (this.dispatch("panStart", {
        event: b
      }), rt = {
        x: D[0].clientX,
        y: D[0].clientY
      }, q(document, "touchmove.panZoom mousemove.panZoom", St, this, {
        passive: !1
      }), q(document, "touchend.panZoom mouseup.panZoom", yt, this, {
        passive: !1
      })));
    }, yt = function U(b) {
      b.preventDefault(), H(document, "touchmove.panZoom mousemove.panZoom", St), H(document, "touchend.panZoom mouseup.panZoom", U), this.on("mousedown.panZoom", ht), this.dispatch("panEnd", {
        event: b
      });
    }, St = function(b) {
      b.preventDefault();
      var T = Lt(b), G = {
        x: T[0].clientX,
        y: T[0].clientY
      }, tt = this.point(G.x, G.y), et = this.point(rt.x, rt.y), L = [et.x - tt.x, et.y - tt.y];
      if (!(!L[0] && !L[1])) {
        var $ = new A(this.viewbox()).transform(new m().translate(L[0], L[1]));
        rt = G, gt($), !this.dispatch("panning", {
          box: $,
          event: b
        }).defaultPrevented && this.viewbox($);
      }
    };
    return S && this.on("wheel.panZoom", Ct, this, {
      passive: !1
    }), k && this.on("touchstart.panZoom", Nt, this, {
      passive: !1
    }), I && this.on("mousedown.panZoom", ht, this, {
      passive: !1
    }), this;
  }
});
class Zn {
  constructor(t, e = {}) {
    this.isEnabled = !1, this.slate = t, this.canvas = t.canvas, this.options = {
      enabled: !0,
      panning: !0,
      pinchZoom: !0,
      wheelZoom: !1,
      // Disable wheel zoom so trackpad scroll only pans
      panButton: 0,
      oneFingerPan: !1,
      margins: !1,
      zoomFactor: 0.3,
      zoomMin: 0.1,
      zoomMax: 10,
      wheelZoomDeltaModeLinePixels: 17,
      wheelZoomDeltaModeScreenPixels: 53,
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
        wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels
      }), this.isEnabled = !0, this.options.onPanStart && this.canvas.on("panStart", this.options.onPanStart), this.options.onPan && this.canvas.on("panning", this.options.onPan), this.options.onPanEnd && this.canvas.on("panEnd", this.options.onPanEnd), this.options.onZoom && this.canvas.on("zoom", this.options.onZoom), console.log("PanZoom initialized successfully with svg.panzoom.js");
    } catch (t) {
      console.warn("Failed to initialize pan/zoom:", t);
    }
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
    if (this.isEnabled) {
      const t = this.canvas.bbox(), e = 50, i = Math.min(
        (this.canvas.width() - e * 2) / t.width,
        (this.canvas.height() - e * 2) / t.height
      );
      this.canvas.zoom(i), this.canvas.viewbox(
        t.x - e / i,
        t.y - e / i,
        this.canvas.width() / i,
        this.canvas.height() / i
      );
    }
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
    this.isEnabled && (this.canvas.panZoom(!1), this.canvas.off("panStart"), this.canvas.off("panning"), this.canvas.off("panEnd"), this.canvas.off("zoom"), this.isEnabled = !1);
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
      wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels
    };
  }
}
class Un {
  // Will hold the group resize/rotate controller
  constructor(t, e = {}) {
    if (this.selectedNodes = [], this.groupResizeRotate = null, typeof t == "string") {
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
    this.canvas = Pn().addTo(this.element);
    const t = this.options.viewPort?.originalWidth || 800, e = this.options.viewPort?.originalHeight || 600;
    this.canvas.size(t, e), this.nodes = new ao(this), this.invoker = new ho(this), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new Zn(this, this.options.panZoom), this.makeResponsive(), this.options.viewPort?.showCoordinates && setTimeout(() => this.addCoordinateDisplay(), 150);
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
    console.log("COORD_DEBUG: Starting coordinate polling"), setInterval(() => {
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
      const a = r.svgGroup.bbox(), h = (a.x - i.x) * s, l = (a.y - i.y) * o, c = a.width * s, u = a.height * o;
      r.setSize(c, u), r.position(e.x + h, e.y + l);
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
}
function lo(n, t = {}) {
  return new Un(n, t);
}
typeof window < "u" && (window.SlateboxJS = lo, window.Slate = Un, window.Node = Hn, window.PanZoom = Zn, window.ResizeRotate = Bn);
export {
  ho as Invoker,
  Hn as Node,
  Zn as PanZoom,
  Bn as ResizeRotate,
  Un as Slate,
  lo as SlateboxJS,
  lo as default
};
//# sourceMappingURL=slateboxjs.es.js.map
