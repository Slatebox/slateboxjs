var Ps = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, x = {};
/*!
* @svgdotjs/svg.js - A lightweight library for manipulating and animating SVG.
* @version 3.2.4
* https://svgjs.dev/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Thu Jun 27 2024 12:00:16 GMT+0200 (Central European Summer Time)
*/
var Zn;
function Fn() {
  if (Zn) return x;
  Zn = 1;
  const N = {}, i = [];
  function r(e, t) {
    if (Array.isArray(e)) {
      for (const n of e)
        r(n, t);
      return;
    }
    if (typeof e == "object") {
      for (const n in e)
        r(n, e[n]);
      return;
    }
    g(Object.getOwnPropertyNames(t)), N[e] = Object.assign(N[e] || {}, t);
  }
  function h(e) {
    return N[e] || {};
  }
  function u() {
    return [...new Set(i)];
  }
  function g(e) {
    i.push(...e);
  }
  function f(e, t) {
    let n;
    const s = e.length, o = [];
    for (n = 0; n < s; n++)
      o.push(t(e[n]));
    return o;
  }
  function m(e, t) {
    let n;
    const s = e.length, o = [];
    for (n = 0; n < s; n++)
      t(e[n]) && o.push(e[n]);
    return o;
  }
  function y(e) {
    return e % 360 * Math.PI / 180;
  }
  function _(e) {
    return e * 180 / Math.PI % 360;
  }
  function z(e) {
    return e.replace(/([A-Z])/g, function(t, n) {
      return "-" + n.toLowerCase();
    });
  }
  function k(e) {
    return e.charAt(0).toUpperCase() + e.slice(1);
  }
  function O(e, t, n, s) {
    return (t == null || n == null) && (s = s || e.bbox(), t == null ? t = s.width / s.height * n : n == null && (n = s.height / s.width * t)), {
      width: t,
      height: n
    };
  }
  function p(e, t) {
    const n = e.origin;
    let s = e.ox != null ? e.ox : e.originX != null ? e.originX : "center", o = e.oy != null ? e.oy : e.originY != null ? e.originY : "center";
    n != null && ([s, o] = Array.isArray(n) ? n : typeof n == "object" ? [n.x, n.y] : [n, n]);
    const a = typeof s == "string", c = typeof o == "string";
    if (a || c) {
      const {
        height: l,
        width: d,
        x: v,
        y: S
      } = t.bbox();
      a && (s = s.includes("left") ? v : s.includes("right") ? v + d : v + d / 2), c && (o = o.includes("top") ? S : o.includes("bottom") ? S + l : S + l / 2);
    }
    return [s, o];
  }
  const b = /* @__PURE__ */ new Set(["desc", "metadata", "title"]), E = (e) => b.has(e.nodeName), B = (e, t, n = {}) => {
    const s = {
      ...t
    };
    for (const o in s)
      s[o].valueOf() === n[o] && delete s[o];
    Object.keys(s).length ? e.node.setAttribute("data-svgjs", JSON.stringify(s)) : (e.node.removeAttribute("data-svgjs"), e.node.removeAttribute("svgjs:data"));
  };
  var H = {
    __proto__: null,
    capitalize: k,
    degrees: _,
    filter: m,
    getOrigin: p,
    isDescriptive: E,
    map: f,
    proportionalSize: O,
    radians: y,
    unCamelCase: z,
    writeDataToDom: B
  };
  const q = "http://www.w3.org/2000/svg", ft = "http://www.w3.org/1999/xhtml", Q = "http://www.w3.org/2000/xmlns/", K = "http://www.w3.org/1999/xlink";
  var bt = {
    __proto__: null,
    html: ft,
    svg: q,
    xlink: K,
    xmlns: Q
  };
  const C = {
    window: typeof window > "u" ? null : window,
    document: typeof document > "u" ? null : document
  };
  function A(e = null, t = null) {
    C.window = e, C.document = t;
  }
  const nt = {};
  function ct() {
    nt.window = C.window, nt.document = C.document;
  }
  function L() {
    C.window = nt.window, C.document = nt.document;
  }
  function rt(e, t) {
    ct(), A(e, e.document), t(e, e.document), L();
  }
  function it() {
    return C.window;
  }
  class F {
    // constructor (node/*, {extensions = []} */) {
    //   // this.tags = []
    //   //
    //   // for (let extension of extensions) {
    //   //   extension.setup.call(this, node)
    //   //   this.tags.push(extension.name)
    //   // }
    // }
  }
  const V = {}, st = "___SYMBOL___ROOT___";
  function j(e, t = q) {
    return C.document.createElementNS(t, e);
  }
  function U(e, t = !1) {
    if (e instanceof F) return e;
    if (typeof e == "object")
      return tt(e);
    if (e == null)
      return new V[st]();
    if (typeof e == "string" && e.charAt(0) !== "<")
      return tt(C.document.querySelector(e));
    const n = t ? C.document.createElement("div") : j("svg");
    return n.innerHTML = e, e = tt(n.firstChild), n.removeChild(n.firstChild), e;
  }
  function X(e, t) {
    return t && (t instanceof C.window.Node || t.ownerDocument && t instanceof t.ownerDocument.defaultView.Node) ? t : j(e);
  }
  function at(e) {
    if (!e) return null;
    if (e.instance instanceof F) return e.instance;
    if (e.nodeName === "#document-fragment")
      return new V.Fragment(e);
    let t = k(e.nodeName || "Dom");
    return t === "LinearGradient" || t === "RadialGradient" ? t = "Gradient" : V[t] || (t = "Dom"), new V[t](e);
  }
  let tt = at;
  function Z(e = at) {
    tt = e;
  }
  function w(e, t = e.name, n = !1) {
    return V[t] = e, n && (V[st] = e), g(Object.getOwnPropertyNames(e.prototype)), e;
  }
  function Y(e) {
    return V[e];
  }
  let et = 1e3;
  function ht(e) {
    return "Svgjs" + k(e) + et++;
  }
  function pt(e) {
    for (let t = e.children.length - 1; t >= 0; t--)
      pt(e.children[t]);
    return e.id && (e.id = ht(e.nodeName)), e;
  }
  function T(e, t) {
    let n, s;
    for (e = Array.isArray(e) ? e : [e], s = e.length - 1; s >= 0; s--)
      for (n in t)
        e[s].prototype[n] = t[n];
  }
  function G(e) {
    return function(...t) {
      const n = t[t.length - 1];
      return n && n.constructor === Object && !(n instanceof Array) ? e.apply(this, t.slice(0, -1)).attr(n) : e.apply(this, t);
    };
  }
  function wt() {
    return this.parent().children();
  }
  function P() {
    return this.parent().index(this);
  }
  function xt() {
    return this.siblings()[this.position() + 1];
  }
  function Nt() {
    return this.siblings()[this.position() - 1];
  }
  function Ht() {
    const e = this.position();
    return this.parent().add(this.remove(), e + 1), this;
  }
  function Lt() {
    const e = this.position();
    return this.parent().add(this.remove(), e ? e - 1 : 0), this;
  }
  function Vt() {
    return this.parent().add(this.remove()), this;
  }
  function qt() {
    return this.parent().add(this.remove(), 0), this;
  }
  function be(e) {
    e = U(e), e.remove();
    const t = this.position();
    return this.parent().add(e, t), this;
  }
  function ae(e) {
    e = U(e), e.remove();
    const t = this.position();
    return this.parent().add(e, t + 1), this;
  }
  function we(e) {
    return e = U(e), e.before(this), this;
  }
  function ve(e) {
    return e = U(e), e.after(this), this;
  }
  r("Dom", {
    siblings: wt,
    position: P,
    next: xt,
    prev: Nt,
    forward: Ht,
    backward: Lt,
    front: Vt,
    back: qt,
    before: be,
    after: ae,
    insertBefore: we,
    insertAfter: ve
  });
  const he = /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i, St = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, xe = /rgb\((\d+),(\d+),(\d+)\)/, _e = /(#[a-z_][a-z0-9\-_]*)/i, Ee = /\)\s*,?\s*/, Ce = /\s/g, Xe = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i, Fe = /^rgb\(/, je = /^(\s+)?$/, Ve = /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, gn = /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i, Mt = /[\s,]+/, Ne = /[MLHVCSQTAZ]/i;
  var Kn = {
    __proto__: null,
    delimiter: Mt,
    hex: St,
    isBlank: je,
    isHex: Xe,
    isImage: gn,
    isNumber: Ve,
    isPathLetter: Ne,
    isRgb: Fe,
    numberAndUnit: he,
    reference: _e,
    rgb: xe,
    transforms: Ee,
    whitespace: Ce
  };
  function ti() {
    const e = this.attr("class");
    return e == null ? [] : e.trim().split(Mt);
  }
  function ei(e) {
    return this.classes().indexOf(e) !== -1;
  }
  function ni(e) {
    if (!this.hasClass(e)) {
      const t = this.classes();
      t.push(e), this.attr("class", t.join(" "));
    }
    return this;
  }
  function ii(e) {
    return this.hasClass(e) && this.attr("class", this.classes().filter(function(t) {
      return t !== e;
    }).join(" ")), this;
  }
  function si(e) {
    return this.hasClass(e) ? this.removeClass(e) : this.addClass(e);
  }
  r("Dom", {
    classes: ti,
    hasClass: ei,
    addClass: ni,
    removeClass: ii,
    toggleClass: si
  });
  function oi(e, t) {
    const n = {};
    if (arguments.length === 0)
      return this.node.style.cssText.split(/\s*;\s*/).filter(function(s) {
        return !!s.length;
      }).forEach(function(s) {
        const o = s.split(/\s*:\s*/);
        n[o[0]] = o[1];
      }), n;
    if (arguments.length < 2) {
      if (Array.isArray(e)) {
        for (const s of e) {
          const o = s;
          n[s] = this.node.style.getPropertyValue(o);
        }
        return n;
      }
      if (typeof e == "string")
        return this.node.style.getPropertyValue(e);
      if (typeof e == "object")
        for (const s in e)
          this.node.style.setProperty(s, e[s] == null || je.test(e[s]) ? "" : e[s]);
    }
    return arguments.length === 2 && this.node.style.setProperty(e, t == null || je.test(t) ? "" : t), this;
  }
  function ri() {
    return this.css("display", "");
  }
  function ai() {
    return this.css("display", "none");
  }
  function hi() {
    return this.css("display") !== "none";
  }
  r("Dom", {
    css: oi,
    show: ri,
    hide: ai,
    visible: hi
  });
  function li(e, t, n) {
    if (e == null)
      return this.data(f(m(this.node.attributes, (s) => s.nodeName.indexOf("data-") === 0), (s) => s.nodeName.slice(5)));
    if (e instanceof Array) {
      const s = {};
      for (const o of e)
        s[o] = this.data(o);
      return s;
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
      this.attr("data-" + e, t === null ? null : n === !0 || typeof t == "string" || typeof t == "number" ? t : JSON.stringify(t));
    return this;
  }
  r("Dom", {
    data: li
  });
  function ci(e, t) {
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
  function ui() {
    if (arguments.length === 0)
      this._memory = {};
    else
      for (let e = arguments.length - 1; e >= 0; e--)
        delete this.memory()[arguments[e]];
    return this;
  }
  function di() {
    return this._memory = this._memory || {};
  }
  r("Dom", {
    remember: ci,
    forget: ui,
    memory: di
  });
  function fi(e) {
    return e.length === 4 ? ["#", e.substring(1, 2), e.substring(1, 2), e.substring(2, 3), e.substring(2, 3), e.substring(3, 4), e.substring(3, 4)].join("") : e;
  }
  function pi(e) {
    const t = Math.round(e), s = Math.max(0, Math.min(255, t)).toString(16);
    return s.length === 1 ? "0" + s : s;
  }
  function $t(e, t) {
    for (let n = t.length; n--; )
      if (e[t[n]] == null)
        return !1;
    return !0;
  }
  function gi(e, t) {
    const n = $t(e, "rgb") ? {
      _a: e.r,
      _b: e.g,
      _c: e.b,
      _d: 0,
      space: "rgb"
    } : $t(e, "xyz") ? {
      _a: e.x,
      _b: e.y,
      _c: e.z,
      _d: 0,
      space: "xyz"
    } : $t(e, "hsl") ? {
      _a: e.h,
      _b: e.s,
      _c: e.l,
      _d: 0,
      space: "hsl"
    } : $t(e, "lab") ? {
      _a: e.l,
      _b: e.a,
      _c: e.b,
      _d: 0,
      space: "lab"
    } : $t(e, "lch") ? {
      _a: e.l,
      _b: e.c,
      _c: e.h,
      _d: 0,
      space: "lch"
    } : $t(e, "cmyk") ? {
      _a: e.c,
      _b: e.m,
      _c: e.y,
      _d: e.k,
      space: "cmyk"
    } : {
      _a: 0,
      _b: 0,
      _c: 0,
      space: "rgb"
    };
    return n.space = t || n.space, n;
  }
  function mi(e) {
    return e === "lab" || e === "xyz" || e === "lch";
  }
  function qe(e, t, n) {
    return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
  }
  class W {
    constructor(...t) {
      this.init(...t);
    }
    // Test if given value is a color
    static isColor(t) {
      return t && (t instanceof W || this.isRgb(t) || this.test(t));
    }
    // Test if given value is an rgb object
    static isRgb(t) {
      return t && typeof t.r == "number" && typeof t.g == "number" && typeof t.b == "number";
    }
    /*
    Generating random colors
    */
    static random(t = "vibrant", n) {
      const {
        random: s,
        round: o,
        sin: a,
        PI: c
      } = Math;
      if (t === "vibrant") {
        const l = 24 * s() + 57, d = 38 * s() + 45, v = 360 * s();
        return new W(l, d, v, "lch");
      } else if (t === "sine") {
        n = n ?? s();
        const l = o(80 * a(2 * c * n / 0.5 + 0.01) + 150), d = o(50 * a(2 * c * n / 0.5 + 4.6) + 200), v = o(100 * a(2 * c * n / 0.5 + 2.3) + 150);
        return new W(l, d, v);
      } else if (t === "pastel") {
        const l = 8 * s() + 86, d = 17 * s() + 9, v = 360 * s();
        return new W(l, d, v, "lch");
      } else if (t === "dark") {
        const l = 10 + 10 * s(), d = 50 * s() + 86, v = 360 * s();
        return new W(l, d, v, "lch");
      } else if (t === "rgb") {
        const l = 255 * s(), d = 255 * s(), v = 255 * s();
        return new W(l, d, v);
      } else if (t === "lab") {
        const l = 100 * s(), d = 256 * s() - 128, v = 256 * s() - 128;
        return new W(l, d, v, "lab");
      } else if (t === "grey") {
        const l = 255 * s();
        return new W(l, l, l);
      } else
        throw new Error("Unsupported random color mode");
    }
    // Test if given value is a color string
    static test(t) {
      return typeof t == "string" && (Xe.test(t) || Fe.test(t));
    }
    cmyk() {
      const {
        _a: t,
        _b: n,
        _c: s
      } = this.rgb(), [o, a, c] = [t, n, s].map((J) => J / 255), l = Math.min(1 - o, 1 - a, 1 - c);
      if (l === 1)
        return new W(0, 0, 0, 1, "cmyk");
      const d = (1 - o - l) / (1 - l), v = (1 - a - l) / (1 - l), S = (1 - c - l) / (1 - l);
      return new W(d, v, S, l, "cmyk");
    }
    hsl() {
      const {
        _a: t,
        _b: n,
        _c: s
      } = this.rgb(), [o, a, c] = [t, n, s].map((dt) => dt / 255), l = Math.max(o, a, c), d = Math.min(o, a, c), v = (l + d) / 2, S = l === d, R = l - d, J = S ? 0 : v > 0.5 ? R / (2 - l - d) : R / (l + d), ot = S ? 0 : l === o ? ((a - c) / R + (a < c ? 6 : 0)) / 6 : l === a ? ((c - o) / R + 2) / 6 : l === c ? ((o - a) / R + 4) / 6 : 0;
      return new W(360 * ot, 100 * J, 100 * v, "hsl");
    }
    init(t = 0, n = 0, s = 0, o = 0, a = "rgb") {
      if (t = t || 0, this.space)
        for (const R in this.space)
          delete this[this.space[R]];
      if (typeof t == "number")
        a = typeof o == "string" ? o : a, o = typeof o == "string" ? 0 : o, Object.assign(this, {
          _a: t,
          _b: n,
          _c: s,
          _d: o,
          space: a
        });
      else if (t instanceof Array)
        this.space = n || (typeof t[3] == "string" ? t[3] : t[4]) || "rgb", Object.assign(this, {
          _a: t[0],
          _b: t[1],
          _c: t[2],
          _d: t[3] || 0
        });
      else if (t instanceof Object) {
        const R = gi(t, n);
        Object.assign(this, R);
      } else if (typeof t == "string")
        if (Fe.test(t)) {
          const R = t.replace(Ce, ""), [J, ot, ut] = xe.exec(R).slice(1, 4).map((dt) => parseInt(dt));
          Object.assign(this, {
            _a: J,
            _b: ot,
            _c: ut,
            _d: 0,
            space: "rgb"
          });
        } else if (Xe.test(t)) {
          const R = (dt) => parseInt(dt, 16), [, J, ot, ut] = St.exec(fi(t)).map(R);
          Object.assign(this, {
            _a: J,
            _b: ot,
            _c: ut,
            _d: 0,
            space: "rgb"
          });
        } else throw Error("Unsupported string format, can't construct Color");
      const {
        _a: c,
        _b: l,
        _c: d,
        _d: v
      } = this, S = this.space === "rgb" ? {
        r: c,
        g: l,
        b: d
      } : this.space === "xyz" ? {
        x: c,
        y: l,
        z: d
      } : this.space === "hsl" ? {
        h: c,
        s: l,
        l: d
      } : this.space === "lab" ? {
        l: c,
        a: l,
        b: d
      } : this.space === "lch" ? {
        l: c,
        c: l,
        h: d
      } : this.space === "cmyk" ? {
        c,
        m: l,
        y: d,
        k: v
      } : {};
      Object.assign(this, S);
    }
    lab() {
      const {
        x: t,
        y: n,
        z: s
      } = this.xyz(), o = 116 * n - 16, a = 500 * (t - n), c = 200 * (n - s);
      return new W(o, a, c, "lab");
    }
    lch() {
      const {
        l: t,
        a: n,
        b: s
      } = this.lab(), o = Math.sqrt(n ** 2 + s ** 2);
      let a = 180 * Math.atan2(s, n) / Math.PI;
      return a < 0 && (a *= -1, a = 360 - a), new W(t, o, a, "lch");
    }
    /*
    Conversion Methods
    */
    rgb() {
      if (this.space === "rgb")
        return this;
      if (mi(this.space)) {
        let {
          x: t,
          y: n,
          z: s
        } = this;
        if (this.space === "lab" || this.space === "lch") {
          let {
            l: ot,
            a: ut,
            b: dt
          } = this;
          if (this.space === "lch") {
            const {
              c: jt,
              h: Ue
            } = this, Ze = Math.PI / 180;
            ut = jt * Math.cos(Ze * Ue), dt = jt * Math.sin(Ze * Ue);
          }
          const lt = (ot + 16) / 116, mt = ut / 500 + lt, Rt = lt - dt / 200, Ot = 16 / 116, It = 8856e-6, Bt = 7.787;
          t = 0.95047 * (mt ** 3 > It ? mt ** 3 : (mt - Ot) / Bt), n = 1 * (lt ** 3 > It ? lt ** 3 : (lt - Ot) / Bt), s = 1.08883 * (Rt ** 3 > It ? Rt ** 3 : (Rt - Ot) / Bt);
        }
        const o = t * 3.2406 + n * -1.5372 + s * -0.4986, a = t * -0.9689 + n * 1.8758 + s * 0.0415, c = t * 0.0557 + n * -0.204 + s * 1.057, l = Math.pow, d = 31308e-7, v = o > d ? 1.055 * l(o, 1 / 2.4) - 0.055 : 12.92 * o, S = a > d ? 1.055 * l(a, 1 / 2.4) - 0.055 : 12.92 * a, R = c > d ? 1.055 * l(c, 1 / 2.4) - 0.055 : 12.92 * c;
        return new W(255 * v, 255 * S, 255 * R);
      } else if (this.space === "hsl") {
        let {
          h: t,
          s: n,
          l: s
        } = this;
        if (t /= 360, n /= 100, s /= 100, n === 0)
          return s *= 255, new W(s, s, s);
        const o = s < 0.5 ? s * (1 + n) : s + n - s * n, a = 2 * s - o, c = 255 * qe(a, o, t + 1 / 3), l = 255 * qe(a, o, t), d = 255 * qe(a, o, t - 1 / 3);
        return new W(c, l, d);
      } else if (this.space === "cmyk") {
        const {
          c: t,
          m: n,
          y: s,
          k: o
        } = this, a = 255 * (1 - Math.min(1, t * (1 - o) + o)), c = 255 * (1 - Math.min(1, n * (1 - o) + o)), l = 255 * (1 - Math.min(1, s * (1 - o) + o));
        return new W(a, c, l);
      } else
        return this;
    }
    toArray() {
      const {
        _a: t,
        _b: n,
        _c: s,
        _d: o,
        space: a
      } = this;
      return [t, n, s, o, a];
    }
    toHex() {
      const [t, n, s] = this._clamped().map(pi);
      return `#${t}${n}${s}`;
    }
    toRgb() {
      const [t, n, s] = this._clamped();
      return `rgb(${t},${n},${s})`;
    }
    toString() {
      return this.toHex();
    }
    xyz() {
      const {
        _a: t,
        _b: n,
        _c: s
      } = this.rgb(), [o, a, c] = [t, n, s].map((mt) => mt / 255), l = o > 0.04045 ? Math.pow((o + 0.055) / 1.055, 2.4) : o / 12.92, d = a > 0.04045 ? Math.pow((a + 0.055) / 1.055, 2.4) : a / 12.92, v = c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92, S = (l * 0.4124 + d * 0.3576 + v * 0.1805) / 0.95047, R = (l * 0.2126 + d * 0.7152 + v * 0.0722) / 1, J = (l * 0.0193 + d * 0.1192 + v * 0.9505) / 1.08883, ot = S > 8856e-6 ? Math.pow(S, 1 / 3) : 7.787 * S + 16 / 116, ut = R > 8856e-6 ? Math.pow(R, 1 / 3) : 7.787 * R + 16 / 116, dt = J > 8856e-6 ? Math.pow(J, 1 / 3) : 7.787 * J + 16 / 116;
      return new W(ot, ut, dt, "xyz");
    }
    /*
    Input and Output methods
    */
    _clamped() {
      const {
        _a: t,
        _b: n,
        _c: s
      } = this.rgb(), {
        max: o,
        min: a,
        round: c
      } = Math, l = (d) => o(0, a(c(d), 255));
      return [t, n, s].map(l);
    }
    /*
    Constructing colors
    */
  }
  class gt {
    // Initialize
    constructor(...t) {
      this.init(...t);
    }
    // Clone point
    clone() {
      return new gt(this);
    }
    init(t, n) {
      const s = {
        x: 0,
        y: 0
      }, o = Array.isArray(t) ? {
        x: t[0],
        y: t[1]
      } : typeof t == "object" ? {
        x: t.x,
        y: t.y
      } : {
        x: t,
        y: n
      };
      return this.x = o.x == null ? s.x : o.x, this.y = o.y == null ? s.y : o.y, this;
    }
    toArray() {
      return [this.x, this.y];
    }
    transform(t) {
      return this.clone().transformO(t);
    }
    // Transform point with matrix
    transformO(t) {
      M.isMatrixLike(t) || (t = new M(t));
      const {
        x: n,
        y: s
      } = this;
      return this.x = t.a * n + t.c * s + t.e, this.y = t.b * n + t.d * s + t.f, this;
    }
  }
  function yi(e, t) {
    return new gt(e, t).transformO(this.screenCTM().inverseO());
  }
  function Wt(e, t, n) {
    return Math.abs(t - e) < 1e-6;
  }
  class M {
    constructor(...t) {
      this.init(...t);
    }
    static formatTransforms(t) {
      const n = t.flip === "both" || t.flip === !0, s = t.flip && (n || t.flip === "x") ? -1 : 1, o = t.flip && (n || t.flip === "y") ? -1 : 1, a = t.skew && t.skew.length ? t.skew[0] : isFinite(t.skew) ? t.skew : isFinite(t.skewX) ? t.skewX : 0, c = t.skew && t.skew.length ? t.skew[1] : isFinite(t.skew) ? t.skew : isFinite(t.skewY) ? t.skewY : 0, l = t.scale && t.scale.length ? t.scale[0] * s : isFinite(t.scale) ? t.scale * s : isFinite(t.scaleX) ? t.scaleX * s : s, d = t.scale && t.scale.length ? t.scale[1] * o : isFinite(t.scale) ? t.scale * o : isFinite(t.scaleY) ? t.scaleY * o : o, v = t.shear || 0, S = t.rotate || t.theta || 0, R = new gt(t.origin || t.around || t.ox || t.originX, t.oy || t.originY), J = R.x, ot = R.y, ut = new gt(t.position || t.px || t.positionX || NaN, t.py || t.positionY || NaN), dt = ut.x, lt = ut.y, mt = new gt(t.translate || t.tx || t.translateX, t.ty || t.translateY), Rt = mt.x, Ot = mt.y, It = new gt(t.relative || t.rx || t.relativeX, t.ry || t.relativeY), Bt = It.x, jt = It.y;
      return {
        scaleX: l,
        scaleY: d,
        skewX: a,
        skewY: c,
        shear: v,
        theta: S,
        rx: Bt,
        ry: jt,
        tx: Rt,
        ty: Ot,
        ox: J,
        oy: ot,
        px: dt,
        py: lt
      };
    }
    static fromArray(t) {
      return {
        a: t[0],
        b: t[1],
        c: t[2],
        d: t[3],
        e: t[4],
        f: t[5]
      };
    }
    static isMatrixLike(t) {
      return t.a != null || t.b != null || t.c != null || t.d != null || t.e != null || t.f != null;
    }
    // left matrix, right matrix, target matrix which is overwritten
    static matrixMultiply(t, n, s) {
      const o = t.a * n.a + t.c * n.b, a = t.b * n.a + t.d * n.b, c = t.a * n.c + t.c * n.d, l = t.b * n.c + t.d * n.d, d = t.e + t.a * n.e + t.c * n.f, v = t.f + t.b * n.e + t.d * n.f;
      return s.a = o, s.b = a, s.c = c, s.d = l, s.e = d, s.f = v, s;
    }
    around(t, n, s) {
      return this.clone().aroundO(t, n, s);
    }
    // Transform around a center point
    aroundO(t, n, s) {
      const o = t || 0, a = n || 0;
      return this.translateO(-o, -a).lmultiplyO(s).translateO(o, a);
    }
    // Clones this matrix
    clone() {
      return new M(this);
    }
    // Decomposes this matrix into its affine parameters
    decompose(t = 0, n = 0) {
      const s = this.a, o = this.b, a = this.c, c = this.d, l = this.e, d = this.f, v = s * c - o * a, S = v > 0 ? 1 : -1, R = S * Math.sqrt(s * s + o * o), J = Math.atan2(S * o, S * s), ot = 180 / Math.PI * J, ut = Math.cos(J), dt = Math.sin(J), lt = (s * a + o * c) / v, mt = a * R / (lt * s - o) || c * R / (lt * o + s), Rt = l - t + t * ut * R + n * (lt * ut * R - dt * mt), Ot = d - n + t * dt * R + n * (lt * dt * R + ut * mt);
      return {
        // Return the affine parameters
        scaleX: R,
        scaleY: mt,
        shear: lt,
        rotate: ot,
        translateX: Rt,
        translateY: Ot,
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
      const n = new M(t);
      return Wt(this.a, n.a) && Wt(this.b, n.b) && Wt(this.c, n.c) && Wt(this.d, n.d) && Wt(this.e, n.e) && Wt(this.f, n.f);
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
      const n = M.fromArray([1, 0, 0, 1, 0, 0]);
      return t = t instanceof Tt ? t.matrixify() : typeof t == "string" ? M.fromArray(t.split(Mt).map(parseFloat)) : Array.isArray(t) ? M.fromArray(t) : typeof t == "object" && M.isMatrixLike(t) ? t : typeof t == "object" ? new M().transform(t) : arguments.length === 6 ? M.fromArray([].slice.call(arguments)) : n, this.a = t.a != null ? t.a : n.a, this.b = t.b != null ? t.b : n.b, this.c = t.c != null ? t.c : n.c, this.d = t.d != null ? t.d : n.d, this.e = t.e != null ? t.e : n.e, this.f = t.f != null ? t.f : n.f, this;
    }
    inverse() {
      return this.clone().inverseO();
    }
    // Inverses matrix
    inverseO() {
      const t = this.a, n = this.b, s = this.c, o = this.d, a = this.e, c = this.f, l = t * o - n * s;
      if (!l) throw new Error("Cannot invert " + this);
      const d = o / l, v = -n / l, S = -s / l, R = t / l, J = -(d * a + S * c), ot = -(v * a + R * c);
      return this.a = d, this.b = v, this.c = S, this.d = R, this.e = J, this.f = ot, this;
    }
    lmultiply(t) {
      return this.clone().lmultiplyO(t);
    }
    lmultiplyO(t) {
      const n = this, s = t instanceof M ? t : new M(t);
      return M.matrixMultiply(s, n, this);
    }
    // Left multiplies by the given matrix
    multiply(t) {
      return this.clone().multiplyO(t);
    }
    multiplyO(t) {
      const n = this, s = t instanceof M ? t : new M(t);
      return M.matrixMultiply(n, s, this);
    }
    // Rotate matrix
    rotate(t, n, s) {
      return this.clone().rotateO(t, n, s);
    }
    rotateO(t, n = 0, s = 0) {
      t = y(t);
      const o = Math.cos(t), a = Math.sin(t), {
        a: c,
        b: l,
        c: d,
        d: v,
        e: S,
        f: R
      } = this;
      return this.a = c * o - l * a, this.b = l * o + c * a, this.c = d * o - v * a, this.d = v * o + d * a, this.e = S * o - R * a + s * a - n * o + n, this.f = R * o + S * a - n * a - s * o + s, this;
    }
    // Scale matrix
    scale() {
      return this.clone().scaleO(...arguments);
    }
    scaleO(t, n = t, s = 0, o = 0) {
      arguments.length === 3 && (o = s, s = n, n = t);
      const {
        a,
        b: c,
        c: l,
        d,
        e: v,
        f: S
      } = this;
      return this.a = a * t, this.b = c * n, this.c = l * t, this.d = d * n, this.e = v * t - s * t + s, this.f = S * n - o * n + o, this;
    }
    // Shear matrix
    shear(t, n, s) {
      return this.clone().shearO(t, n, s);
    }
    // eslint-disable-next-line no-unused-vars
    shearO(t, n = 0, s = 0) {
      const {
        a: o,
        b: a,
        c,
        d: l,
        e: d,
        f: v
      } = this;
      return this.a = o + a * t, this.c = c + l * t, this.e = d + v * t - s * t, this;
    }
    // Skew Matrix
    skew() {
      return this.clone().skewO(...arguments);
    }
    skewO(t, n = t, s = 0, o = 0) {
      arguments.length === 3 && (o = s, s = n, n = t), t = y(t), n = y(n);
      const a = Math.tan(t), c = Math.tan(n), {
        a: l,
        b: d,
        c: v,
        d: S,
        e: R,
        f: J
      } = this;
      return this.a = l + d * a, this.b = d + l * c, this.c = v + S * a, this.d = S + v * c, this.e = R + J * a - o * a, this.f = J + R * c - s * c, this;
    }
    // SkewX
    skewX(t, n, s) {
      return this.skew(t, 0, n, s);
    }
    // SkewY
    skewY(t, n, s) {
      return this.skew(0, t, n, s);
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
      if (M.isMatrixLike(t))
        return new M(t).multiplyO(this);
      const n = M.formatTransforms(t), s = this, {
        x: o,
        y: a
      } = new gt(n.ox, n.oy).transform(s), c = new M().translateO(n.rx, n.ry).lmultiplyO(s).translateO(-o, -a).scaleO(n.scaleX, n.scaleY).skewO(n.skewX, n.skewY).shearO(n.shear).rotateO(n.theta).translateO(o, a);
      if (isFinite(n.px) || isFinite(n.py)) {
        const l = new gt(o, a).transform(c), d = isFinite(n.px) ? n.px - l.x : 0, v = isFinite(n.py) ? n.py - l.y : 0;
        c.translateO(d, v);
      }
      return c.translateO(n.tx, n.ty), c;
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
  function bi() {
    return new M(this.node.getCTM());
  }
  function wi() {
    try {
      if (typeof this.isRoot == "function" && !this.isRoot()) {
        const e = this.rect(1, 1), t = e.node.getScreenCTM();
        return e.remove(), new M(t);
      }
      return new M(this.node.getScreenCTM());
    } catch {
      return console.warn(`Cannot get CTM from SVG node ${this.node.nodeName}. Is the element rendered?`), new M();
    }
  }
  w(M, "Matrix");
  function Dt() {
    if (!Dt.nodes) {
      const e = U().size(2, 0);
      e.node.style.cssText = ["opacity: 0", "position: absolute", "left: -100%", "top: -100%", "overflow: hidden"].join(";"), e.attr("focusable", "false"), e.attr("aria-hidden", "true");
      const t = e.path().node;
      Dt.nodes = {
        svg: e,
        path: t
      };
    }
    if (!Dt.nodes.svg.node.parentNode) {
      const e = C.document.body || C.document.documentElement;
      Dt.nodes.svg.addTo(e);
    }
    return Dt.nodes;
  }
  function mn(e) {
    return !e.width && !e.height && !e.x && !e.y;
  }
  function vi(e) {
    return e === C.document || (C.document.documentElement.contains || function(t) {
      for (; t.parentNode; )
        t = t.parentNode;
      return t === C.document;
    }).call(C.document.documentElement, e);
  }
  class yt {
    constructor(...t) {
      this.init(...t);
    }
    addOffset() {
      return this.x += C.window.pageXOffset, this.y += C.window.pageYOffset, new yt(this);
    }
    init(t) {
      const n = [0, 0, 0, 0];
      return t = typeof t == "string" ? t.split(Mt).map(parseFloat) : Array.isArray(t) ? t : typeof t == "object" ? [t.left != null ? t.left : t.x, t.top != null ? t.top : t.y, t.width, t.height] : arguments.length === 4 ? [].slice.call(arguments) : n, this.x = t[0] || 0, this.y = t[1] || 0, this.width = this.w = t[2] || 0, this.height = this.h = t[3] || 0, this.x2 = this.x + this.w, this.y2 = this.y + this.h, this.cx = this.x + this.w / 2, this.cy = this.y + this.h / 2, this;
    }
    isNulled() {
      return mn(this);
    }
    // Merge rect box with another, return a new instance
    merge(t) {
      const n = Math.min(this.x, t.x), s = Math.min(this.y, t.y), o = Math.max(this.x + this.width, t.x + t.width) - n, a = Math.max(this.y + this.height, t.y + t.height) - s;
      return new yt(n, s, o, a);
    }
    toArray() {
      return [this.x, this.y, this.width, this.height];
    }
    toString() {
      return this.x + " " + this.y + " " + this.width + " " + this.height;
    }
    transform(t) {
      t instanceof M || (t = new M(t));
      let n = 1 / 0, s = -1 / 0, o = 1 / 0, a = -1 / 0;
      return [new gt(this.x, this.y), new gt(this.x2, this.y), new gt(this.x, this.y2), new gt(this.x2, this.y2)].forEach(function(l) {
        l = l.transform(t), n = Math.min(n, l.x), s = Math.max(s, l.x), o = Math.min(o, l.y), a = Math.max(a, l.y);
      }), new yt(n, o, s - n, a - o);
    }
  }
  function yn(e, t, n) {
    let s;
    try {
      if (s = t(e.node), mn(s) && !vi(e.node))
        throw new Error("Element not in the dom");
    } catch {
      s = n(e);
    }
    return s;
  }
  function xi() {
    const n = yn(this, (o) => o.getBBox(), (o) => {
      try {
        const a = o.clone().addTo(Dt().svg).show(), c = a.node.getBBox();
        return a.remove(), c;
      } catch (a) {
        throw new Error(`Getting bbox of element "${o.node.nodeName}" is not possible: ${a.toString()}`);
      }
    });
    return new yt(n);
  }
  function _i(e) {
    const s = yn(this, (a) => a.getBoundingClientRect(), (a) => {
      throw new Error(`Getting rbox of element "${a.node.nodeName}" is not possible`);
    }), o = new yt(s);
    return e ? o.transform(e.screenCTM().inverseO()) : o.addOffset();
  }
  function Ei(e, t) {
    const n = this.bbox();
    return e > n.x && t > n.y && e < n.x + n.width && t < n.y + n.height;
  }
  r({
    viewbox: {
      viewbox(e, t, n, s) {
        return e == null ? new yt(this.attr("viewBox")) : this.attr("viewBox", new yt(e, t, n, s));
      },
      zoom(e, t) {
        let {
          width: n,
          height: s
        } = this.attr(["width", "height"]);
        if ((!n && !s || typeof n == "string" || typeof s == "string") && (n = this.node.clientWidth, s = this.node.clientHeight), !n || !s)
          throw new Error("Impossible to get absolute width and height. Please provide an absolute width and height attribute on the zooming element");
        const o = this.viewbox(), a = n / o.width, c = s / o.height, l = Math.min(a, c);
        if (e == null)
          return l;
        let d = l / e;
        d === 1 / 0 && (d = Number.MAX_SAFE_INTEGER / 100), t = t || new gt(n / 2 / a + o.x, s / 2 / c + o.y);
        const v = new yt(o).transform(new M({
          scale: d,
          origin: t
        }));
        return this.viewbox(v);
      }
    }
  }), w(yt, "Box");
  class Pt extends Array {
    constructor(t = [], ...n) {
      if (super(t, ...n), typeof t == "number") return this;
      this.length = 0, this.push(...t);
    }
  }
  T([Pt], {
    each(e, ...t) {
      return typeof e == "function" ? this.map((n, s, o) => e.call(n, n, s, o)) : this.map((n) => n[e](...t));
    },
    toArray() {
      return Array.prototype.concat.apply([], this);
    }
  });
  const Ci = ["toArray", "constructor", "each"];
  Pt.extend = function(e) {
    e = e.reduce((t, n) => (Ci.includes(n) || n[0] === "_" || (n in Array.prototype && (t["$" + n] = Array.prototype[n]), t[n] = function(...s) {
      return this.each(n, ...s);
    }), t), {}), T([Pt], e);
  };
  function Ut(e, t) {
    return new Pt(f((t || C.document).querySelectorAll(e), function(n) {
      return at(n);
    }));
  }
  function Ni(e) {
    return Ut(e, this.node);
  }
  function Si(e) {
    return at(this.node.querySelector(e));
  }
  let Ti = 0;
  const $e = {};
  function We(e) {
    let t = e.getEventHolder();
    return t === C.window && (t = $e), t.events || (t.events = {}), t.events;
  }
  function Se(e) {
    return e.getEventTarget();
  }
  function bn(e) {
    let t = e.getEventHolder();
    t === C.window && (t = $e), t.events && (t.events = {});
  }
  function Te(e, t, n, s, o) {
    const a = n.bind(s || e), c = U(e), l = We(c), d = Se(c);
    t = Array.isArray(t) ? t : t.split(Mt), n._svgjsListenerId || (n._svgjsListenerId = ++Ti), t.forEach(function(v) {
      const S = v.split(".")[0], R = v.split(".")[1] || "*";
      l[S] = l[S] || {}, l[S][R] = l[S][R] || {}, l[S][R][n._svgjsListenerId] = a, d.addEventListener(S, a, o || !1);
    });
  }
  function Zt(e, t, n, s) {
    const o = U(e), a = We(o), c = Se(o);
    typeof n == "function" && (n = n._svgjsListenerId, !n) || (t = Array.isArray(t) ? t : (t || "").split(Mt), t.forEach(function(l) {
      const d = l && l.split(".")[0], v = l && l.split(".")[1];
      let S, R;
      if (n)
        a[d] && a[d][v || "*"] && (c.removeEventListener(d, a[d][v || "*"][n], s || !1), delete a[d][v || "*"][n]);
      else if (d && v) {
        if (a[d] && a[d][v]) {
          for (R in a[d][v])
            Zt(c, [d, v].join("."), R);
          delete a[d][v];
        }
      } else if (v)
        for (l in a)
          for (S in a[l])
            v === S && Zt(c, [l, v].join("."));
      else if (d) {
        if (a[d]) {
          for (S in a[d])
            Zt(c, [d, S].join("."));
          delete a[d];
        }
      } else {
        for (l in a)
          Zt(c, l);
        bn(o);
      }
    }));
  }
  function wn(e, t, n, s) {
    const o = Se(e);
    return t instanceof C.window.Event || (t = new C.window.CustomEvent(t, {
      detail: n,
      cancelable: !0,
      ...s
    })), o.dispatchEvent(t), t;
  }
  class Jt extends F {
    addEventListener() {
    }
    dispatch(t, n, s) {
      return wn(this, t, n, s);
    }
    dispatchEvent(t) {
      const n = this.getEventHolder().events;
      if (!n) return !0;
      const s = n[t.type];
      for (const o in s)
        for (const a in s[o])
          s[o][a](t);
      return !t.defaultPrevented;
    }
    // Fire given event
    fire(t, n, s) {
      return this.dispatch(t, n, s), this;
    }
    getEventHolder() {
      return this;
    }
    getEventTarget() {
      return this;
    }
    // Unbind event from listener
    off(t, n, s) {
      return Zt(this, t, n, s), this;
    }
    // Bind given event to listener
    on(t, n, s, o) {
      return Te(this, t, n, s, o), this;
    }
    removeEventListener() {
    }
  }
  w(Jt, "EventTarget");
  function Je() {
  }
  const Qt = {
    duration: 400,
    ease: ">",
    delay: 0
  }, vn = {
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
  var Ri = {
    __proto__: null,
    attrs: vn,
    noop: Je,
    timeline: Qt
  };
  class Yt extends Array {
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
      return t instanceof Array ? t : t.trim().split(Mt).map(parseFloat);
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
  class I {
    // Initialize
    constructor(...t) {
      this.init(...t);
    }
    convert(t) {
      return new I(this.value, t);
    }
    // Divide number
    divide(t) {
      return t = new I(t), new I(this / t, this.unit || t.unit);
    }
    init(t, n) {
      return n = Array.isArray(t) ? t[1] : n, t = Array.isArray(t) ? t[0] : t, this.value = 0, this.unit = n || "", typeof t == "number" ? this.value = isNaN(t) ? 0 : isFinite(t) ? t : t < 0 ? -34e37 : 34e37 : typeof t == "string" ? (n = t.match(he), n && (this.value = parseFloat(n[1]), n[5] === "%" ? this.value /= 100 : n[5] === "s" && (this.value *= 1e3), this.unit = n[5])) : t instanceof I && (this.value = t.valueOf(), this.unit = t.unit), this;
    }
    // Subtract number
    minus(t) {
      return t = new I(t), new I(this - t, this.unit || t.unit);
    }
    // Add number
    plus(t) {
      return t = new I(t), new I(this + t, this.unit || t.unit);
    }
    // Multiply number
    times(t) {
      return t = new I(t), new I(this * t, this.unit || t.unit);
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
  const Oi = /* @__PURE__ */ new Set(["fill", "stroke", "color", "bgcolor", "stop-color", "flood-color", "lighting-color"]), xn = [];
  function Mi(e) {
    xn.push(e);
  }
  function Di(e, t, n) {
    if (e == null) {
      e = {}, t = this.node.attributes;
      for (const s of t)
        e[s.nodeName] = Ve.test(s.nodeValue) ? parseFloat(s.nodeValue) : s.nodeValue;
      return e;
    } else {
      if (e instanceof Array)
        return e.reduce((s, o) => (s[o] = this.attr(o), s), {});
      if (typeof e == "object" && e.constructor === Object)
        for (t in e) this.attr(t, e[t]);
      else if (t === null)
        this.node.removeAttribute(e);
      else {
        if (t == null)
          return t = this.node.getAttribute(e), t == null ? vn[e] : Ve.test(t) ? parseFloat(t) : t;
        t = xn.reduce((s, o) => o(e, s, this), t), typeof t == "number" ? t = new I(t) : Oi.has(e) && W.isColor(t) ? t = new W(t) : t.constructor === Array && (t = new Yt(t)), e === "leading" ? this.leading && this.leading(t) : typeof n == "string" ? this.node.setAttributeNS(n, e, t.toString()) : this.node.setAttribute(e, t.toString()), this.rebuild && (e === "font-size" || e === "x") && this.rebuild();
      }
    }
    return this;
  }
  class zt extends Jt {
    constructor(t, n) {
      super(), this.node = t, this.type = t.nodeName, n && t !== n && this.attr(n);
    }
    // Add given element at a position
    add(t, n) {
      return t = U(t), t.removeNamespace && this.node instanceof C.window.SVGElement && t.removeNamespace(), n == null ? this.node.appendChild(t.node) : t.node !== this.node.childNodes[n] && this.node.insertBefore(t.node, this.node.childNodes[n]), this;
    }
    // Add element to given container and return self
    addTo(t, n) {
      return U(t).put(this, n);
    }
    // Returns all child elements
    children() {
      return new Pt(f(this.node.children, function(t) {
        return at(t);
      }));
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
      let s = this.node.cloneNode(t);
      return n && (s = pt(s)), new this.constructor(s);
    }
    // Iterates over all children and invokes a given block
    each(t, n) {
      const s = this.children();
      let o, a;
      for (o = 0, a = s.length; o < a; o++)
        t.apply(s[o], [o, s]), n && s[o].each(t, n);
      return this;
    }
    element(t, n) {
      return this.put(new zt(j(t), n));
    }
    // Get first child
    first() {
      return at(this.node.firstChild);
    }
    // Get a element at the given index
    get(t) {
      return at(this.node.childNodes[t]);
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
      return this.xml(t, n, ft);
    }
    // Get / set id
    id(t) {
      return typeof t > "u" && !this.node.id && (this.node.id = ht(this.type)), this.attr("id", t);
    }
    // Gets index of given element
    index(t) {
      return [].slice.call(this.node.childNodes).indexOf(t.node);
    }
    // Get the last child
    last() {
      return at(this.node.lastChild);
    }
    // matches the element vs a css selector
    matches(t) {
      const n = this.node, s = n.matches || n.matchesSelector || n.msMatchesSelector || n.mozMatchesSelector || n.webkitMatchesSelector || n.oMatchesSelector || null;
      return s && s.call(n, t);
    }
    // Returns the parent element instance
    parent(t) {
      let n = this;
      if (!n.node.parentNode) return null;
      if (n = at(n.node.parentNode), !t) return n;
      do
        if (typeof t == "string" ? n.matches(t) : n instanceof t) return n;
      while (n = at(n.node.parentNode));
      return n;
    }
    // Basically does the same as `add()` but returns the added element instead
    put(t, n) {
      return t = U(t), this.add(t, n), t;
    }
    // Add element to given container and return container
    putIn(t, n) {
      return U(t).add(this, n);
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
      return t = U(t), this.node.parentNode && this.node.parentNode.replaceChild(t.node, this.node), t;
    }
    round(t = 2, n = null) {
      const s = 10 ** t, o = this.attr(n);
      for (const a in o)
        typeof o[a] == "number" && (o[a] = Math.round(o[a] * s) / s);
      return this.attr(o), this;
    }
    // Import / Export raw svg
    svg(t, n) {
      return this.xml(t, n, q);
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
      const s = n.index(this);
      return n.put(t, s).put(this);
    }
    // write svgjs data to the dom
    writeDataToDom() {
      return this.each(function() {
        this.writeDataToDom();
      }), this;
    }
    // Import / Export raw svg
    xml(t, n, s) {
      if (typeof t == "boolean" && (s = n, n = t, t = null), t == null || typeof t == "function") {
        n = n ?? !0, this.writeDataToDom();
        let l = this;
        if (t != null) {
          if (l = at(l.node.cloneNode(!0)), n) {
            const d = t(l);
            if (l = d || l, d === !1) return "";
          }
          l.each(function() {
            const d = t(this), v = d || this;
            d === !1 ? this.remove() : d && this !== v && this.replace(v);
          }, !0);
        }
        return n ? l.node.outerHTML : l.node.innerHTML;
      }
      n = n ?? !1;
      const o = j("wrapper", s), a = C.document.createDocumentFragment();
      o.innerHTML = t;
      for (let l = o.children.length; l--; )
        a.appendChild(o.firstElementChild);
      const c = this.parent();
      return n ? this.replace(a) && c : this.add(a);
    }
  }
  T(zt, {
    attr: Di,
    find: Ni,
    findOne: Si
  }), w(zt, "Dom");
  class Tt extends zt {
    constructor(t, n) {
      super(t, n), this.dom = {}, this.node.instance = this, (t.hasAttribute("data-svgjs") || t.hasAttribute("svgjs:data")) && this.setData(JSON.parse(t.getAttribute("data-svgjs")) ?? JSON.parse(t.getAttribute("svgjs:data")) ?? {});
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
      return this.x(new I(t).plus(this.x()));
    }
    // Relative move over y axis
    dy(t = 0) {
      return this.y(new I(t).plus(this.y()));
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
      n || (t = U(t));
      const s = new Pt();
      let o = this;
      for (; (o = o.parent()) && o.node !== C.document && o.nodeName !== "#document-fragment" && (s.push(o), !(!n && o.node === t.node || n && o.matches(t))); )
        if (o.node === this.root().node)
          return null;
      return s;
    }
    // Get referenced element form attribute value
    reference(t) {
      if (t = this.attr(t), !t) return null;
      const n = (t + "").match(_e);
      return n ? U(n[1]) : null;
    }
    // Get parent document
    root() {
      const t = this.parent(Y(st));
      return t && t.root();
    }
    // set given data to the elements data property
    setData(t) {
      return this.dom = t, this;
    }
    // Set element size to given width and height
    size(t, n) {
      const s = O(this, t, n);
      return this.width(new I(s.width)).height(new I(s.height));
    }
    // Set width of element
    width(t) {
      return this.attr("width", t);
    }
    // write svgjs data to the dom
    writeDataToDom() {
      return B(this, this.dom), super.writeDataToDom();
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
  T(Tt, {
    bbox: xi,
    rbox: _i,
    inside: Ei,
    point: yi,
    ctm: bi,
    screenCTM: wi
  }), w(Tt, "Element");
  const le = {
    stroke: ["color", "width", "opacity", "linecap", "linejoin", "miterlimit", "dasharray", "dashoffset"],
    fill: ["color", "opacity", "rule"],
    prefix: function(e, t) {
      return t === "color" ? e : e + "-" + t;
    }
  };
  ["fill", "stroke"].forEach(function(e) {
    const t = {};
    let n;
    t[e] = function(s) {
      if (typeof s > "u")
        return this.attr(e);
      if (typeof s == "string" || s instanceof W || W.isRgb(s) || s instanceof Tt)
        this.attr(e, s);
      else
        for (n = le[e].length - 1; n >= 0; n--)
          s[le[e][n]] != null && this.attr(le.prefix(e, le[e][n]), s[le[e][n]]);
      return this;
    }, r(["Element", "Runner"], t);
  }), r(["Element", "Runner"], {
    // Let the user set the matrix directly
    matrix: function(e, t, n, s, o, a) {
      return e == null ? new M(this) : this.attr("transform", new M(e, t, n, s, o, a));
    },
    // Map rotation to transform
    rotate: function(e, t, n) {
      return this.transform({
        rotate: e,
        ox: t,
        oy: n
      }, !0);
    },
    // Map skew to transform
    skew: function(e, t, n, s) {
      return arguments.length === 1 || arguments.length === 3 ? this.transform({
        skew: e,
        ox: t,
        oy: n
      }, !0) : this.transform({
        skew: [e, t],
        ox: n,
        oy: s
      }, !0);
    },
    shear: function(e, t, n) {
      return this.transform({
        shear: e,
        ox: t,
        oy: n
      }, !0);
    },
    // Map scale to transform
    scale: function(e, t, n, s) {
      return arguments.length === 1 || arguments.length === 3 ? this.transform({
        scale: e,
        ox: t,
        oy: n
      }, !0) : this.transform({
        scale: [e, t],
        ox: n,
        oy: s
      }, !0);
    },
    // Map translate to transform
    translate: function(e, t) {
      return this.transform({
        translate: [e, t]
      }, !0);
    },
    // Map relative translations to transform
    relative: function(e, t) {
      return this.transform({
        relative: [e, t]
      }, !0);
    },
    // Map flip to transform
    flip: function(e = "both", t = "center") {
      return "xybothtrue".indexOf(e) === -1 && (t = e, e = "both"), this.transform({
        flip: e,
        origin: t
      }, !0);
    },
    // Opacity
    opacity: function(e) {
      return this.attr("opacity", e);
    }
  }), r("radius", {
    // Add x and y radius
    radius: function(e, t = e) {
      return (this._element || this).type === "radialGradient" ? this.attr("r", new I(e)) : this.rx(e).ry(t);
    }
  }), r("Path", {
    // Get path length
    length: function() {
      return this.node.getTotalLength();
    },
    // Get point at length
    pointAt: function(e) {
      return new gt(this.node.getPointAtLength(e));
    }
  }), r(["Element", "Runner"], {
    // Set font
    font: function(e, t) {
      if (typeof e == "object") {
        for (t in e) this.font(t, e[t]);
        return this;
      }
      return e === "leading" ? this.leading(t) : e === "anchor" ? this.attr("text-anchor", t) : e === "size" || e === "family" || e === "weight" || e === "stretch" || e === "variant" || e === "style" ? this.attr("font-" + e, t) : this.attr(e, t);
    }
  });
  const zi = ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "mousemove", "mouseenter", "mouseleave", "touchstart", "touchmove", "touchleave", "touchend", "touchcancel", "contextmenu", "wheel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel"].reduce(function(e, t) {
    const n = function(s) {
      return s === null ? this.off(t) : this.on(t, s), this;
    };
    return e[t] = n, e;
  }, {});
  r("Element", zi);
  function Ai() {
    return this.attr("transform", null);
  }
  function Pi() {
    return (this.attr("transform") || "").split(Ee).slice(0, -1).map(function(t) {
      const n = t.trim().split("(");
      return [n[0], n[1].split(Mt).map(function(s) {
        return parseFloat(s);
      })];
    }).reverse().reduce(function(t, n) {
      return n[0] === "matrix" ? t.lmultiply(M.fromArray(n[1])) : t[n[0]].apply(t, n[1]);
    }, new M());
  }
  function ki(e, t) {
    if (this === e) return this;
    if (E(this.node)) return this.addTo(e, t);
    const n = this.screenCTM(), s = e.screenCTM().inverse();
    return this.addTo(e, t).untransform().transform(s.multiply(n)), this;
  }
  function Gi(e) {
    return this.toParent(this.root(), e);
  }
  function Ii(e, t) {
    if (e == null || typeof e == "string") {
      const o = new M(this).decompose();
      return e == null ? o : o[e];
    }
    M.isMatrixLike(e) || (e = {
      ...e,
      origin: p(e, this)
    });
    const n = t === !0 ? this : t || !1, s = new M(n).transform(e);
    return this.attr("transform", s);
  }
  r("Element", {
    untransform: Ai,
    matrixify: Pi,
    toParent: ki,
    toRoot: Gi,
    transform: Ii
  });
  class vt extends Tt {
    flatten() {
      return this.each(function() {
        if (this instanceof vt)
          return this.flatten().ungroup();
      }), this;
    }
    ungroup(t = this.parent(), n = t.index(this)) {
      return n = n === -1 ? t.children().length : n, this.each(function(s, o) {
        return o[o.length - s - 1].toParent(t, n);
      }), this.remove();
    }
  }
  w(vt, "Container");
  class Re extends vt {
    constructor(t, n = t) {
      super(X("defs", t), n);
    }
    flatten() {
      return this;
    }
    ungroup() {
      return this;
    }
  }
  w(Re, "Defs");
  class _t extends Tt {
  }
  w(_t, "Shape");
  function Qe(e) {
    return this.attr("rx", e);
  }
  function Ke(e) {
    return this.attr("ry", e);
  }
  function _n(e) {
    return e == null ? this.cx() - this.rx() : this.cx(e + this.rx());
  }
  function En(e) {
    return e == null ? this.cy() - this.ry() : this.cy(e + this.ry());
  }
  function Cn(e) {
    return this.attr("cx", e);
  }
  function Nn(e) {
    return this.attr("cy", e);
  }
  function Sn(e) {
    return e == null ? this.rx() * 2 : this.rx(new I(e).divide(2));
  }
  function Tn(e) {
    return e == null ? this.ry() * 2 : this.ry(new I(e).divide(2));
  }
  var Bi = {
    __proto__: null,
    cx: Cn,
    cy: Nn,
    height: Tn,
    rx: Qe,
    ry: Ke,
    width: Sn,
    x: _n,
    y: En
  };
  class ce extends _t {
    constructor(t, n = t) {
      super(X("ellipse", t), n);
    }
    size(t, n) {
      const s = O(this, t, n);
      return this.rx(new I(s.width).divide(2)).ry(new I(s.height).divide(2));
    }
  }
  T(ce, Bi), r("Container", {
    // Create an ellipse
    ellipse: G(function(e = 0, t = e) {
      return this.put(new ce()).size(e, t).move(0, 0);
    })
  }), w(ce, "Ellipse");
  class tn extends zt {
    constructor(t = C.document.createDocumentFragment()) {
      super(t);
    }
    // Import / Export raw xml
    xml(t, n, s) {
      if (typeof t == "boolean" && (s = n, n = t, t = null), t == null || typeof t == "function") {
        const o = new zt(j("wrapper", s));
        return o.add(this.node.cloneNode(!0)), o.xml(!1, s);
      }
      return super.xml(t, !1, s);
    }
  }
  w(tn, "Fragment");
  function Rn(e, t) {
    return (this._element || this).type === "radialGradient" ? this.attr({
      fx: new I(e),
      fy: new I(t)
    }) : this.attr({
      x1: new I(e),
      y1: new I(t)
    });
  }
  function On(e, t) {
    return (this._element || this).type === "radialGradient" ? this.attr({
      cx: new I(e),
      cy: new I(t)
    }) : this.attr({
      x2: new I(e),
      y2: new I(t)
    });
  }
  var Hi = {
    __proto__: null,
    from: Rn,
    to: On
  };
  class Kt extends vt {
    constructor(t, n) {
      super(X(t + "Gradient", typeof t == "string" ? null : t), n);
    }
    // custom attr to handle transform
    attr(t, n, s) {
      return t === "transform" && (t = "gradientTransform"), super.attr(t, n, s);
    }
    bbox() {
      return new yt();
    }
    targets() {
      return Ut("svg [fill*=" + this.id() + "]");
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
  T(Kt, Hi), r({
    Container: {
      // Create gradient element in defs
      gradient(...e) {
        return this.defs().gradient(...e);
      }
    },
    // define gradient
    Defs: {
      gradient: G(function(e, t) {
        return this.put(new Kt(e)).update(t);
      })
    }
  }), w(Kt, "Gradient");
  class te extends vt {
    // Initialize node
    constructor(t, n = t) {
      super(X("pattern", t), n);
    }
    // custom attr to handle transform
    attr(t, n, s) {
      return t === "transform" && (t = "patternTransform"), super.attr(t, n, s);
    }
    bbox() {
      return new yt();
    }
    targets() {
      return Ut("svg [fill*=" + this.id() + "]");
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
  r({
    Container: {
      // Create pattern element in defs
      pattern(...e) {
        return this.defs().pattern(...e);
      }
    },
    Defs: {
      pattern: G(function(e, t, n) {
        return this.put(new te()).update(n).attr({
          x: 0,
          y: 0,
          width: e,
          height: t,
          patternUnits: "userSpaceOnUse"
        });
      })
    }
  }), w(te, "Pattern");
  class ue extends _t {
    constructor(t, n = t) {
      super(X("image", t), n);
    }
    // (re)load image
    load(t, n) {
      if (!t) return this;
      const s = new C.window.Image();
      return Te(s, "load", function(o) {
        const a = this.parent(te);
        this.width() === 0 && this.height() === 0 && this.size(s.width, s.height), a instanceof te && a.width() === 0 && a.height() === 0 && a.size(this.width(), this.height()), typeof n == "function" && n.call(this, o);
      }, this), Te(s, "load error", function() {
        Zt(s);
      }), this.attr("href", s.src = t, K);
    }
  }
  Mi(function(e, t, n) {
    return (e === "fill" || e === "stroke") && gn.test(t) && (t = n.root().defs().image(t)), t instanceof ue && (t = n.root().defs().pattern(0, 0, (s) => {
      s.add(t);
    })), t;
  }), r({
    Container: {
      // create image element, load image and set its size
      image: G(function(e, t) {
        return this.put(new ue()).size(0, 0).load(e, t);
      })
    }
  }), w(ue, "Image");
  class At extends Yt {
    // Get bounding box of points
    bbox() {
      let t = -1 / 0, n = -1 / 0, s = 1 / 0, o = 1 / 0;
      return this.forEach(function(a) {
        t = Math.max(a[0], t), n = Math.max(a[1], n), s = Math.min(a[0], s), o = Math.min(a[1], o);
      }), new yt(s, o, t - s, n - o);
    }
    // Move point string
    move(t, n) {
      const s = this.bbox();
      if (t -= s.x, n -= s.y, !isNaN(t) && !isNaN(n))
        for (let o = this.length - 1; o >= 0; o--)
          this[o] = [this[o][0] + t, this[o][1] + n];
      return this;
    }
    // Parse point string and flat array
    parse(t = [0, 0]) {
      const n = [];
      t instanceof Array ? t = Array.prototype.concat.apply([], t) : t = t.trim().split(Mt).map(parseFloat), t.length % 2 !== 0 && t.pop();
      for (let s = 0, o = t.length; s < o; s = s + 2)
        n.push([t[s], t[s + 1]]);
      return n;
    }
    // Resize poly string
    size(t, n) {
      let s;
      const o = this.bbox();
      for (s = this.length - 1; s >= 0; s--)
        o.width && (this[s][0] = (this[s][0] - o.x) * t / o.width + o.x), o.height && (this[s][1] = (this[s][1] - o.y) * n / o.height + o.y);
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
      for (let n = 0, s = this.length; n < s; n++)
        t.push(this[n].join(","));
      return t.join(" ");
    }
    transform(t) {
      return this.clone().transformO(t);
    }
    // transform points with matrix (similar to Point.transform)
    transformO(t) {
      M.isMatrixLike(t) || (t = new M(t));
      for (let n = this.length; n--; ) {
        const [s, o] = this[n];
        this[n][0] = t.a * s + t.c * o + t.e, this[n][1] = t.b * s + t.d * o + t.f;
      }
      return this;
    }
  }
  const Li = At;
  function Ui(e) {
    return e == null ? this.bbox().x : this.move(e, this.bbox().y);
  }
  function Zi(e) {
    return e == null ? this.bbox().y : this.move(this.bbox().x, e);
  }
  function Yi(e) {
    const t = this.bbox();
    return e == null ? t.width : this.size(e, t.height);
  }
  function Xi(e) {
    const t = this.bbox();
    return e == null ? t.height : this.size(t.width, e);
  }
  var en = {
    __proto__: null,
    MorphArray: Li,
    height: Xi,
    width: Yi,
    x: Ui,
    y: Zi
  };
  class ee extends _t {
    // Initialize node
    constructor(t, n = t) {
      super(X("line", t), n);
    }
    // Get array
    array() {
      return new At([[this.attr("x1"), this.attr("y1")], [this.attr("x2"), this.attr("y2")]]);
    }
    // Move by left top corner
    move(t, n) {
      return this.attr(this.array().move(t, n).toLine());
    }
    // Overwrite native plot() method
    plot(t, n, s, o) {
      return t == null ? this.array() : (typeof n < "u" ? t = {
        x1: t,
        y1: n,
        x2: s,
        y2: o
      } : t = new At(t).toLine(), this.attr(t));
    }
    // Set element size to given width and height
    size(t, n) {
      const s = O(this, t, n);
      return this.attr(this.array().size(s.width, s.height).toLine());
    }
  }
  T(ee, en), r({
    Container: {
      // Create a line element
      line: G(function(...e) {
        return ee.prototype.plot.apply(this.put(new ee()), e[0] != null ? e : [0, 0, 0, 0]);
      })
    }
  }), w(ee, "Line");
  class de extends vt {
    // Initialize node
    constructor(t, n = t) {
      super(X("marker", t), n);
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
  r({
    Container: {
      marker(...e) {
        return this.defs().marker(...e);
      }
    },
    Defs: {
      // Create marker
      marker: G(function(e, t, n) {
        return this.put(new de()).size(e, t).ref(e / 2, t / 2).viewbox(0, 0, e, t).attr("orient", "auto").update(n);
      })
    },
    marker: {
      // Create and attach markers
      marker(e, t, n, s) {
        let o = ["marker"];
        return e !== "all" && o.push(e), o = o.join("-"), e = arguments[1] instanceof de ? arguments[1] : this.defs().marker(t, n, s), this.attr(o, e);
      }
    }
  }), w(de, "Marker");
  function ne(e, t) {
    return function(n) {
      return n == null ? this[e] : (this[e] = n, t && t.call(this), this);
    };
  }
  const Mn = {
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
    bezier: function(e, t, n, s) {
      return function(o) {
        return o < 0 ? e > 0 ? t / e * o : n > 0 ? s / n * o : 0 : o > 1 ? n < 1 ? (1 - s) / (1 - n) * o + (s - n) / (1 - n) : e < 1 ? (1 - t) / (1 - e) * o + (t - e) / (1 - e) : 1 : 3 * o * (1 - o) ** 2 * t + 3 * o ** 2 * (1 - o) * s + o ** 3;
      };
    },
    // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
    steps: function(e, t = "end") {
      t = t.split("-").reverse()[0];
      let n = e;
      return t === "none" ? --n : t === "both" && ++n, (s, o = !1) => {
        let a = Math.floor(s * e);
        const c = s * a % 1 === 0;
        return (t === "start" || t === "both") && ++a, o && c && --a, s >= 0 && a < 0 && (a = 0), s <= 1 && a > n && (a = n), a / n;
      };
    }
  };
  class nn {
    done() {
      return !1;
    }
  }
  class Oe extends nn {
    constructor(t = Qt.ease) {
      super(), this.ease = Mn[t] || t;
    }
    step(t, n, s) {
      return typeof t != "number" ? s < 1 ? t : n : t + (n - t) * this.ease(s);
    }
  }
  class fe extends nn {
    constructor(t) {
      super(), this.stepper = t;
    }
    done(t) {
      return t.done;
    }
    step(t, n, s, o) {
      return this.stepper(t, n, s, o);
    }
  }
  function Dn() {
    const e = (this._duration || 500) / 1e3, t = this._overshoot || 0, n = 1e-10, s = Math.PI, o = Math.log(t / 100 + n), a = -o / Math.sqrt(s * s + o * o), c = 3.9 / (a * e);
    this.d = 2 * a * c, this.k = c * c;
  }
  class zn extends fe {
    constructor(t = 500, n = 0) {
      super(), this.duration(t).overshoot(n);
    }
    step(t, n, s, o) {
      if (typeof t == "string") return t;
      if (o.done = s === 1 / 0, s === 1 / 0) return n;
      if (s === 0) return t;
      s > 100 && (s = 16), s /= 1e3;
      const a = o.velocity || 0, c = -this.d * a - this.k * (t - n), l = t + a * s + c * s * s / 2;
      return o.velocity = a + c * s, o.done = Math.abs(n - l) + Math.abs(a) < 2e-3, o.done ? n : l;
    }
  }
  T(zn, {
    duration: ne("_duration", Dn),
    overshoot: ne("_overshoot", Dn)
  });
  class An extends fe {
    constructor(t = 0.1, n = 0.01, s = 0, o = 1e3) {
      super(), this.p(t).i(n).d(s).windup(o);
    }
    step(t, n, s, o) {
      if (typeof t == "string") return t;
      if (o.done = s === 1 / 0, s === 1 / 0) return n;
      if (s === 0) return t;
      const a = n - t;
      let c = (o.integral || 0) + a * s;
      const l = (a - (o.error || 0)) / s, d = this._windup;
      return d !== !1 && (c = Math.max(-d, Math.min(c, d))), o.error = a, o.integral = c, o.done = Math.abs(a) < 1e-3, o.done ? n : t + (this.P * a + this.I * c + this.D * l);
    }
  }
  T(An, {
    windup: ne("_windup"),
    p: ne("P"),
    i: ne("I"),
    d: ne("D")
  });
  const Fi = {
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
  }, sn = {
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
  }, on = "mlhvqtcsaz".split("");
  for (let e = 0, t = on.length; e < t; ++e)
    sn[on[e]] = /* @__PURE__ */ function(n) {
      return function(s, o, a) {
        if (n === "H") s[0] = s[0] + o.x;
        else if (n === "V") s[0] = s[0] + o.y;
        else if (n === "A")
          s[5] = s[5] + o.x, s[6] = s[6] + o.y;
        else
          for (let c = 0, l = s.length; c < l; ++c)
            s[c] = s[c] + (c % 2 ? o.y : o.x);
        return sn[n](s, o, a);
      };
    }(on[e].toUpperCase());
  function ji(e) {
    const t = e.segment[0];
    return sn[t](e.segment.slice(1), e.p, e.p0);
  }
  function rn(e) {
    return e.segment.length && e.segment.length - 1 === Fi[e.segment[0].toUpperCase()];
  }
  function Vi(e, t) {
    e.inNumber && Xt(e, !1);
    const n = Ne.test(t);
    if (n)
      e.segment = [t];
    else {
      const s = e.lastCommand, o = s.toLowerCase(), a = s === o;
      e.segment = [o === "m" ? a ? "l" : "L" : s];
    }
    return e.inSegment = !0, e.lastCommand = e.segment[0], n;
  }
  function Xt(e, t) {
    if (!e.inNumber) throw new Error("Parser Error");
    e.number && e.segment.push(parseFloat(e.number)), e.inNumber = t, e.number = "", e.pointSeen = !1, e.hasExponent = !1, rn(e) && an(e);
  }
  function an(e) {
    e.inSegment = !1, e.absolute && (e.segment = ji(e)), e.segments.push(e.segment);
  }
  function qi(e) {
    if (!e.segment.length) return !1;
    const t = e.segment[0].toUpperCase() === "A", n = e.segment.length;
    return t && (n === 4 || n === 5);
  }
  function $i(e) {
    return e.lastToken.toUpperCase() === "E";
  }
  const Wi = /* @__PURE__ */ new Set([" ", ",", "	", `
`, "\r", "\f"]);
  function Ji(e, t = !0) {
    let n = 0, s = "";
    const o = {
      segment: [],
      inNumber: !1,
      number: "",
      lastToken: "",
      inSegment: !1,
      segments: [],
      pointSeen: !1,
      hasExponent: !1,
      absolute: t,
      p0: new gt(),
      p: new gt()
    };
    for (; o.lastToken = s, s = e.charAt(n++); )
      if (!(!o.inSegment && Vi(o, s))) {
        if (s === ".") {
          if (o.pointSeen || o.hasExponent) {
            Xt(o, !1), --n;
            continue;
          }
          o.inNumber = !0, o.pointSeen = !0, o.number += s;
          continue;
        }
        if (!isNaN(parseInt(s))) {
          if (o.number === "0" || qi(o)) {
            o.inNumber = !0, o.number = s, Xt(o, !0);
            continue;
          }
          o.inNumber = !0, o.number += s;
          continue;
        }
        if (Wi.has(s)) {
          o.inNumber && Xt(o, !1);
          continue;
        }
        if (s === "-" || s === "+") {
          if (o.inNumber && !$i(o)) {
            Xt(o, !1), --n;
            continue;
          }
          o.number += s, o.inNumber = !0;
          continue;
        }
        if (s.toUpperCase() === "E") {
          o.number += s, o.hasExponent = !0;
          continue;
        }
        if (Ne.test(s)) {
          if (o.inNumber)
            Xt(o, !1);
          else if (rn(o))
            an(o);
          else
            throw new Error("parser Error");
          --n;
        }
      }
    return o.inNumber && Xt(o, !1), o.inSegment && rn(o) && an(o), o.segments;
  }
  function Qi(e) {
    let t = "";
    for (let n = 0, s = e.length; n < s; n++)
      t += e[n][0], e[n][1] != null && (t += e[n][1], e[n][2] != null && (t += " ", t += e[n][2], e[n][3] != null && (t += " ", t += e[n][3], t += " ", t += e[n][4], e[n][5] != null && (t += " ", t += e[n][5], t += " ", t += e[n][6], e[n][7] != null && (t += " ", t += e[n][7])))));
    return t + " ";
  }
  class kt extends Yt {
    // Get bounding box of path
    bbox() {
      return Dt().path.setAttribute("d", this.toString()), new yt(Dt.nodes.path.getBBox());
    }
    // Move path string
    move(t, n) {
      const s = this.bbox();
      if (t -= s.x, n -= s.y, !isNaN(t) && !isNaN(n))
        for (let o, a = this.length - 1; a >= 0; a--)
          o = this[a][0], o === "M" || o === "L" || o === "T" ? (this[a][1] += t, this[a][2] += n) : o === "H" ? this[a][1] += t : o === "V" ? this[a][1] += n : o === "C" || o === "S" || o === "Q" ? (this[a][1] += t, this[a][2] += n, this[a][3] += t, this[a][4] += n, o === "C" && (this[a][5] += t, this[a][6] += n)) : o === "A" && (this[a][6] += t, this[a][7] += n);
      return this;
    }
    // Absolutize and parse path to array
    parse(t = "M0 0") {
      return Array.isArray(t) && (t = Array.prototype.concat.apply([], t).toString()), Ji(t);
    }
    // Resize path string
    size(t, n) {
      const s = this.bbox();
      let o, a;
      for (s.width = s.width === 0 ? 1 : s.width, s.height = s.height === 0 ? 1 : s.height, o = this.length - 1; o >= 0; o--)
        a = this[o][0], a === "M" || a === "L" || a === "T" ? (this[o][1] = (this[o][1] - s.x) * t / s.width + s.x, this[o][2] = (this[o][2] - s.y) * n / s.height + s.y) : a === "H" ? this[o][1] = (this[o][1] - s.x) * t / s.width + s.x : a === "V" ? this[o][1] = (this[o][1] - s.y) * n / s.height + s.y : a === "C" || a === "S" || a === "Q" ? (this[o][1] = (this[o][1] - s.x) * t / s.width + s.x, this[o][2] = (this[o][2] - s.y) * n / s.height + s.y, this[o][3] = (this[o][3] - s.x) * t / s.width + s.x, this[o][4] = (this[o][4] - s.y) * n / s.height + s.y, a === "C" && (this[o][5] = (this[o][5] - s.x) * t / s.width + s.x, this[o][6] = (this[o][6] - s.y) * n / s.height + s.y)) : a === "A" && (this[o][1] = this[o][1] * t / s.width, this[o][2] = this[o][2] * n / s.height, this[o][6] = (this[o][6] - s.x) * t / s.width + s.x, this[o][7] = (this[o][7] - s.y) * n / s.height + s.y);
      return this;
    }
    // Convert array to string
    toString() {
      return Qi(this);
    }
  }
  const Pn = (e) => {
    const t = typeof e;
    return t === "number" ? I : t === "string" ? W.isColor(e) ? W : Mt.test(e) ? Ne.test(e) ? kt : Yt : he.test(e) ? I : Me : hn.indexOf(e.constructor) > -1 ? e.constructor : Array.isArray(e) ? Yt : t === "object" ? se : Me;
  };
  class Gt {
    constructor(t) {
      this._stepper = t || new Oe("-"), this._from = null, this._to = null, this._type = null, this._context = null, this._morphObj = null;
    }
    at(t) {
      return this._morphObj.morph(this._from, this._to, t, this._stepper, this._context);
    }
    done() {
      return this._context.map(this._stepper.done).reduce(function(n, s) {
        return n && s;
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
      this._type || this.type(Pn(t));
      let n = new this._type(t);
      return this._type === W && (n = this._to ? n[this._to[4]]() : this._from ? n[this._from[4]]() : n), this._type === se && (n = this._to ? n.align(this._to) : this._from ? n.align(this._from) : n), n = n.toConsumable(), this._morphObj = this._morphObj || new this._type(), this._context = this._context || Array.apply(null, Array(n.length)).map(Object).map(function(s) {
        return s.done = !0, s;
      }), n;
    }
  }
  class Me {
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
  class ie {
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
      }), Object.assign(this, ie.defaults, t), this;
    }
    toArray() {
      const t = this;
      return [t.scaleX, t.scaleY, t.shear, t.rotate, t.translateX, t.translateY, t.originX, t.originY];
    }
  }
  ie.defaults = {
    scaleX: 1,
    scaleY: 1,
    shear: 0,
    rotate: 0,
    translateX: 0,
    translateY: 0,
    originX: 0,
    originY: 0
  };
  const Ki = (e, t) => e[0] < t[0] ? -1 : e[0] > t[0] ? 1 : 0;
  class se {
    constructor(...t) {
      this.init(...t);
    }
    align(t) {
      const n = this.values;
      for (let s = 0, o = n.length; s < o; ++s) {
        if (n[s + 1] === t[s + 1]) {
          if (n[s + 1] === W && t[s + 7] !== n[s + 7]) {
            const l = t[s + 7], d = new W(this.values.splice(s + 3, 5))[l]().toArray();
            this.values.splice(s + 3, 0, ...d);
          }
          s += n[s + 2] + 2;
          continue;
        }
        if (!t[s + 1])
          return this;
        const a = new t[s + 1]().toArray(), c = n[s + 2] + 3;
        n.splice(s, c, t[s], t[s + 1], t[s + 2], ...a), s += n[s + 2] + 2;
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
      for (const s in t) {
        const o = Pn(t[s]), a = new o(t[s]).toArray();
        n.push([s, o, a.length, ...a]);
      }
      return n.sort(Ki), this.values = n.reduce((s, o) => s.concat(o), []), this;
    }
    toArray() {
      return this.values;
    }
    valueOf() {
      const t = {}, n = this.values;
      for (; n.length; ) {
        const s = n.shift(), o = n.shift(), a = n.shift(), c = n.splice(0, a);
        t[s] = new o(c);
      }
      return t;
    }
  }
  const hn = [Me, ie, se];
  function kn(e = []) {
    hn.push(...[].concat(e));
  }
  function Gn() {
    T(hn, {
      to(e) {
        return new Gt().type(this.constructor).from(this.toArray()).to(e);
      },
      fromArray(e) {
        return this.init(e), this;
      },
      toConsumable() {
        return this.toArray();
      },
      morph(e, t, n, s, o) {
        const a = function(c, l) {
          return s.step(c, t[l], n, o[l], o);
        };
        return this.fromArray(e.map(a));
      }
    });
  }
  class Ft extends _t {
    // Initialize node
    constructor(t, n = t) {
      super(X("path", t), n);
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
    move(t, n) {
      return this.attr("d", this.array().move(t, n));
    }
    // Plot new path
    plot(t) {
      return t == null ? this.array() : this.clear().attr("d", typeof t == "string" ? t : this._array = new kt(t));
    }
    // Set element size to given width and height
    size(t, n) {
      const s = O(this, t, n);
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
  Ft.prototype.MorphArray = kt, r({
    Container: {
      // Create a wrapped path element
      path: G(function(e) {
        return this.put(new Ft()).plot(e || new kt());
      })
    }
  }), w(Ft, "Path");
  function ts() {
    return this._array || (this._array = new At(this.attr("points")));
  }
  function es() {
    return delete this._array, this;
  }
  function ns(e, t) {
    return this.attr("points", this.array().move(e, t));
  }
  function is(e) {
    return e == null ? this.array() : this.clear().attr("points", typeof e == "string" ? e : this._array = new At(e));
  }
  function ss(e, t) {
    const n = O(this, e, t);
    return this.attr("points", this.array().size(n.width, n.height));
  }
  var In = {
    __proto__: null,
    array: ts,
    clear: es,
    move: ns,
    plot: is,
    size: ss
  };
  class oe extends _t {
    // Initialize node
    constructor(t, n = t) {
      super(X("polygon", t), n);
    }
  }
  r({
    Container: {
      // Create a wrapped polygon element
      polygon: G(function(e) {
        return this.put(new oe()).plot(e || new At());
      })
    }
  }), T(oe, en), T(oe, In), w(oe, "Polygon");
  class re extends _t {
    // Initialize node
    constructor(t, n = t) {
      super(X("polyline", t), n);
    }
  }
  r({
    Container: {
      // Create a wrapped polygon element
      polyline: G(function(e) {
        return this.put(new re()).plot(e || new At());
      })
    }
  }), T(re, en), T(re, In), w(re, "Polyline");
  class pe extends _t {
    // Initialize node
    constructor(t, n = t) {
      super(X("rect", t), n);
    }
  }
  T(pe, {
    rx: Qe,
    ry: Ke
  }), r({
    Container: {
      // Create a rect element
      rect: G(function(e, t) {
        return this.put(new pe()).size(e, t);
      })
    }
  }), w(pe, "Rect");
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
      const n = typeof t.next < "u" ? t : {
        value: t,
        next: null,
        prev: null
      };
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
  const $ = {
    nextDraw: null,
    frames: new De(),
    timeouts: new De(),
    immediates: new De(),
    timer: () => C.window.performance || C.window.Date,
    transforms: [],
    frame(e) {
      const t = $.frames.push({
        run: e
      });
      return $.nextDraw === null && ($.nextDraw = C.window.requestAnimationFrame($._draw)), t;
    },
    timeout(e, t) {
      t = t || 0;
      const n = $.timer().now() + t, s = $.timeouts.push({
        run: e,
        time: n
      });
      return $.nextDraw === null && ($.nextDraw = C.window.requestAnimationFrame($._draw)), s;
    },
    immediate(e) {
      const t = $.immediates.push(e);
      return $.nextDraw === null && ($.nextDraw = C.window.requestAnimationFrame($._draw)), t;
    },
    cancelFrame(e) {
      e != null && $.frames.remove(e);
    },
    clearTimeout(e) {
      e != null && $.timeouts.remove(e);
    },
    cancelImmediate(e) {
      e != null && $.immediates.remove(e);
    },
    _draw(e) {
      let t = null;
      const n = $.timeouts.last();
      for (; (t = $.timeouts.shift()) && (e >= t.time ? t.run() : $.timeouts.push(t), t !== n); )
        ;
      let s = null;
      const o = $.frames.last();
      for (; s !== o && (s = $.frames.shift()); )
        s.run(e);
      let a = null;
      for (; a = $.immediates.shift(); )
        a();
      $.nextDraw = $.timeouts.first() || $.frames.first() ? C.window.requestAnimationFrame($._draw) : null;
    }
  }, os = function(e) {
    const t = e.start, n = e.runner.duration(), s = t + n;
    return {
      start: t,
      duration: n,
      end: s,
      runner: e.runner
    };
  }, rs = function() {
    const e = C.window;
    return (e.performance || e.Date).now();
  };
  class ln extends Jt {
    // Construct a new timeline on the given element
    constructor(t = rs) {
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
      const s = Math.abs(n);
      return this.speed(t ? -s : s);
    }
    // schedules a runner on the timeline
    schedule(t, n, s) {
      if (t == null)
        return this._runners.map(os);
      let o = 0;
      const a = this.getEndTime();
      if (n = n || 0, s == null || s === "last" || s === "after")
        o = a;
      else if (s === "absolute" || s === "start")
        o = n, n = 0;
      else if (s === "now")
        o = this._time;
      else if (s === "relative") {
        const d = this.getRunnerInfoById(t.id);
        d && (o = d.start + n, n = 0);
      } else if (s === "with-last") {
        const d = this.getLastRunnerInfo();
        o = d ? d.start : this._time;
      } else
        throw new Error('Invalid value for the "when" parameter');
      t.unschedule(), t.timeline(this);
      const c = t.persist(), l = {
        persist: c === null ? this._persist : c,
        start: o + n,
        runner: t
      };
      return this._lastRunnerId = t.id, this._runners.push(l), this._runners.sort((d, v) => d.start - v.start), this._runnerIds = this._runners.map((d) => d.runner.id), this.updateTime()._continue(), this;
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
      return $.cancelFrame(this._nextFrame), this._nextFrame = null, t ? this._stepImmediate() : this._paused ? this : (this._nextFrame = $.frame(this._step), this);
    }
    _stepFn(t = !1) {
      const n = this._timeSource();
      let s = n - this._lastSourceTime;
      t && (s = 0);
      const o = this._speed * s + (this._time - this._lastStepTime);
      this._lastSourceTime = n, t || (this._time += o, this._time = this._time < 0 ? 0 : this._time), this._lastStepTime = this._time, this.fire("time", this._time);
      for (let c = this._runners.length; c--; ) {
        const l = this._runners[c], d = l.runner;
        this._time - l.start <= 0 && d.reset();
      }
      let a = !1;
      for (let c = 0, l = this._runners.length; c < l; c++) {
        const d = this._runners[c], v = d.runner;
        let S = o;
        const R = this._time - d.start;
        if (R <= 0) {
          a = !0;
          continue;
        } else R < S && (S = R);
        if (!v.active()) continue;
        v.step(S).done ? d.persist !== !0 && v.duration() - v.time() + this._time + d.persist < this._time && (v.unschedule(), --c, --l) : a = !0;
      }
      return a && !(this._speed < 0 && this._time === 0) || this._runnerIds.length && this._speed < 0 && this._time > 0 ? this._continue() : (this.pause(), this.fire("finished")), this;
    }
    terminate() {
      this._startTime = 0, this._speed = 1, this._persist = 0, this._nextFrame = null, this._paused = !0, this._runners = [], this._runnerIds = [], this._lastRunnerId = -1, this._time = 0, this._lastSourceTime = 0, this._lastStepTime = 0, this._step = this._stepFn.bind(this, !1), this._stepImmediate = this._stepFn.bind(this, !0);
    }
  }
  r({
    Element: {
      timeline: function(e) {
        return e == null ? (this._timeline = this._timeline || new ln(), this._timeline) : (this._timeline = e, this);
      }
    }
  });
  class Et extends Jt {
    constructor(t) {
      super(), this.id = Et.id++, t = t ?? Qt.duration, t = typeof t == "function" ? new fe(t) : t, this._element = null, this._timeline = null, this.done = !1, this._queue = [], this._duration = typeof t == "number" && t, this._isDeclarative = t instanceof fe, this._stepper = this._isDeclarative ? t : new Oe(), this._history = {}, this.enabled = !0, this._time = 0, this._lastTime = 0, this._reseted = !0, this.transforms = new M(), this.transformId = 1, this._haveReversed = !1, this._reverse = !1, this._loopsDone = 0, this._swing = !1, this._wait = 0, this._times = 1, this._frameId = null, this._persist = this._isDeclarative ? !0 : null;
    }
    static sanitise(t, n, s) {
      let o = 1, a = !1, c = 0;
      return t = t ?? Qt.duration, n = n ?? Qt.delay, s = s || "last", typeof t == "object" && !(t instanceof nn) && (n = t.delay ?? n, s = t.when ?? s, a = t.swing || a, o = t.times ?? o, c = t.wait ?? c, t = t.duration ?? Qt.duration), {
        duration: t,
        delay: n,
        swing: a,
        times: o,
        wait: c,
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
    animate(t, n, s) {
      const o = Et.sanitise(t, n, s), a = new Et(o.duration);
      return this._timeline && a.timeline(this._timeline), this._element && a.element(this._element), a.loop(o).schedule(o.delay, o.when);
    }
    clearTransform() {
      return this.transforms = new M(), this;
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
      return this._stepper = new Oe(t), this;
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
    loop(t, n, s) {
      return typeof t == "object" && (n = t.swing, s = t.wait, t = t.times), this._times = t || 1 / 0, this._swing = n || !1, this._wait = s || 0, this._times === !0 && (this._times = 1 / 0), this;
    }
    loops(t) {
      const n = this._duration + this._wait;
      if (t == null) {
        const c = Math.floor(this._time / n), d = (this._time - c * n) / this._duration;
        return Math.min(c + d, this._times);
      }
      const s = Math.floor(t), o = t % 1, a = n * s + this._duration * o;
      return this.time(a);
    }
    persist(t) {
      return t == null ? this._persist : (this._persist = t, this);
    }
    position(t) {
      const n = this._time, s = this._duration, o = this._wait, a = this._times, c = this._swing, l = this._reverse;
      let d;
      if (t == null) {
        const J = function(ut) {
          const dt = c * Math.floor(ut % (2 * (o + s)) / (o + s)), lt = dt && !l || !dt && l, mt = Math.pow(-1, lt) * (ut % (o + s)) / s + lt;
          return Math.max(Math.min(mt, 1), 0);
        }, ot = a * (o + s) - o;
        return d = n <= 0 ? Math.round(J(1e-5)) : n < ot ? J(n) : Math.round(J(ot - 1e-5)), d;
      }
      const v = Math.floor(this.loops()), S = c && v % 2 === 0;
      return d = v + (S && !l || l && S ? t : 1 - t), this.loops(d);
    }
    progress(t) {
      return t == null ? Math.min(1, this._time / this.duration()) : this.time(t * this.duration());
    }
    /*
    Basic Functionality
    ===================
    These methods allow us to attach basic functions to the runner directly
    */
    queue(t, n, s, o) {
      return this._queue.push({
        initialiser: t || Je,
        runner: n || Je,
        retarget: s,
        isTransform: o,
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
    schedule(t, n, s) {
      if (t instanceof ln || (s = n, n = t, t = this.timeline()), !t)
        throw Error("Runner cannot be scheduled without timeline");
      return t.schedule(this, n, s), this;
    }
    step(t) {
      if (!this.enabled) return this;
      t = t ?? 16, this._time += t;
      const n = this.position(), s = this._lastPosition !== n && this._time >= 0;
      this._lastPosition = n;
      const o = this.duration(), a = this._lastTime <= 0 && this._time > 0, c = this._lastTime < o && this._time >= o;
      this._lastTime = this._time, a && this.fire("start", this);
      const l = this._isDeclarative;
      this.done = !l && !c && this._time >= o, this._reseted = !1;
      let d = !1;
      return (s || l) && (this._initialise(s), this.transforms = new M(), d = this._run(l ? t : n), this.fire("step", this)), this.done = this.done || d && l, c && this.fire("finished", this), this;
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
        for (let n = 0, s = this._queue.length; n < s; ++n) {
          const o = this._queue[n], a = this._isDeclarative || !o.initialised && t;
          t = !o.finished, a && t && (o.initialiser.call(this), o.initialised = !0);
        }
    }
    // Save a morpher to the morpher list so that we can retarget it later
    _rememberMorpher(t, n) {
      if (this._history[t] = {
        morpher: n,
        caller: this._queue[this._queue.length - 1]
      }, this._isDeclarative) {
        const s = this.timeline();
        s && s.play();
      }
    }
    // Try to set the target for a morpher if the morpher exists, otherwise
    // Run each run function for the position or dt given
    _run(t) {
      let n = !0;
      for (let s = 0, o = this._queue.length; s < o; ++s) {
        const a = this._queue[s], c = a.runner.call(this, t);
        a.finished = a.finished || c === !0, n = n && a.finished;
      }
      return n;
    }
    // do nothing and return false
    _tryRetarget(t, n, s) {
      if (this._history[t]) {
        if (!this._history[t].caller.initialised) {
          const a = this._queue.indexOf(this._history[t].caller);
          return this._queue.splice(a, 1), !1;
        }
        this._history[t].caller.retarget ? this._history[t].caller.retarget.call(this, n, s) : this._history[t].morpher.to(n), this._history[t].caller.finished = !1;
        const o = this.timeline();
        return o && o.play(), !0;
      }
      return !1;
    }
  }
  Et.id = 0;
  class ze {
    constructor(t = new M(), n = -1, s = !0) {
      this.transforms = t, this.id = n, this.done = s;
    }
    clearTransformsFromQueue() {
    }
  }
  T([Et, ze], {
    mergeWith(e) {
      return new ze(e.transforms.lmultiply(this.transforms), e.id);
    }
  });
  const Bn = (e, t) => e.lmultiplyO(t), Hn = (e) => e.transforms;
  function as() {
    const t = this._transformationRunners.runners.map(Hn).reduce(Bn, new M());
    this.transform(t), this._transformationRunners.merge(), this._transformationRunners.length() === 1 && (this._frameId = null);
  }
  class hs {
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
      return this.ids.splice(0, n, 0), this.runners.splice(0, n, new ze()).forEach((s) => s.clearTransformsFromQueue()), this;
    }
    edit(t, n) {
      const s = this.ids.indexOf(t + 1);
      return this.ids.splice(s, 1, t + 1), this.runners.splice(s, 1, n), this;
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
        const s = this.runners[n];
        if (t && s.done && t.done && // don't merge runner when persisted on timeline
        (!s._timeline || !s._timeline._runnerIds.includes(s.id)) && (!t._timeline || !t._timeline._runnerIds.includes(t.id))) {
          this.remove(s.id);
          const a = s.mergeWith(t);
          this.edit(t.id, a), t = a, --n;
        } else
          t = s;
      }
      return this;
    }
    remove(t) {
      const n = this.ids.indexOf(t + 1);
      return this.ids.splice(n, 1), this.runners.splice(n, 1), this;
    }
  }
  r({
    Element: {
      animate(e, t, n) {
        const s = Et.sanitise(e, t, n), o = this.timeline();
        return new Et(s.duration).loop(s).element(this).timeline(o.play()).schedule(s.delay, s.when);
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
        return this._transformationRunners.runners.filter((t) => t.id <= e.id).map(Hn).reduce(Bn, new M());
      },
      _addRunner(e) {
        this._transformationRunners.add(e), $.cancelImmediate(this._frameId), this._frameId = $.immediate(as.bind(this));
      },
      _prepareRunner() {
        this._frameId == null && (this._transformationRunners = new hs().add(new ze(new M(this))));
      }
    }
  });
  const ls = (e, t) => e.filter((n) => !t.includes(n));
  T(Et, {
    attr(e, t) {
      return this.styleAttr("attr", e, t);
    },
    // Add animatable styles
    css(e, t) {
      return this.styleAttr("css", e, t);
    },
    styleAttr(e, t, n) {
      if (typeof t == "string")
        return this.styleAttr(e, {
          [t]: n
        });
      let s = t;
      if (this._tryRetarget(e, s)) return this;
      let o = new Gt(this._stepper).to(s), a = Object.keys(s);
      return this.queue(function() {
        o = o.from(this.element()[e](a));
      }, function(c) {
        return this.element()[e](o.at(c).valueOf()), o.done();
      }, function(c) {
        const l = Object.keys(c), d = ls(l, a);
        if (d.length) {
          const S = this.element()[e](d), R = new se(o.from()).valueOf();
          Object.assign(R, S), o.from(R);
        }
        const v = new se(o.to()).valueOf();
        Object.assign(v, c), o.to(v), a = l, s = c;
      }), this._rememberMorpher(e, o), this;
    },
    zoom(e, t) {
      if (this._tryRetarget("zoom", e, t)) return this;
      let n = new Gt(this._stepper).to(new I(e));
      return this.queue(function() {
        n = n.from(this.element().zoom());
      }, function(s) {
        return this.element().zoom(n.at(s), t), n.done();
      }, function(s, o) {
        t = o, n.to(s);
      }), this._rememberMorpher("zoom", n), this;
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
      const s = M.isMatrixLike(e);
      n = e.affine != null ? e.affine : n ?? !s;
      const o = new Gt(this._stepper).type(n ? ie : M);
      let a, c, l, d, v;
      function S() {
        c = c || this.element(), a = a || p(e, c), v = new M(t ? void 0 : c), c._addRunner(this), t || c._clearTransformRunnersBefore(this);
      }
      function R(ot) {
        t || this.clearTransform();
        const {
          x: ut,
          y: dt
        } = new gt(a).transform(c._currentTransform(this));
        let lt = new M({
          ...e,
          origin: [ut, dt]
        }), mt = this._isDeclarative && l ? l : v;
        if (n) {
          lt = lt.decompose(ut, dt), mt = mt.decompose(ut, dt);
          const Ot = lt.rotate, It = mt.rotate, Bt = [Ot - 360, Ot, Ot + 360], jt = Bt.map((As) => Math.abs(As - It)), Ue = Math.min(...jt), Ze = jt.indexOf(Ue);
          lt.rotate = Bt[Ze];
        }
        t && (s || (lt.rotate = e.rotate || 0), this._isDeclarative && d && (mt.rotate = d)), o.from(mt), o.to(lt);
        const Rt = o.at(ot);
        return d = Rt.rotate, l = new M(Rt), this.addTransform(l), c._addRunner(this), o.done();
      }
      function J(ot) {
        (ot.origin || "center").toString() !== (e.origin || "center").toString() && (a = p(ot, c)), e = {
          ...ot,
          origin: a
        };
      }
      return this.queue(S, R, J, !0), this._isDeclarative && this._rememberMorpher("transform", o), this;
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
      if (t = new I(t), this._tryRetarget(e, t)) return this;
      const n = new Gt(this._stepper).to(t);
      let s = null;
      return this.queue(function() {
        s = this.element()[e](), n.from(s), n.to(s + t);
      }, function(o) {
        return this.element()[e](n.at(o)), n.done();
      }, function(o) {
        n.to(s + new I(o));
      }), this._rememberMorpher(e, n), this;
    },
    _queueObject(e, t) {
      if (this._tryRetarget(e, t)) return this;
      const n = new Gt(this._stepper).to(t);
      return this.queue(function() {
        n.from(this.element()[e]());
      }, function(s) {
        return this.element()[e](n.at(s)), n.done();
      }), this._rememberMorpher(e, n), this;
    },
    _queueNumber(e, t) {
      return this._queueObject(e, new I(t));
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
    plot(e, t, n, s) {
      if (arguments.length === 4)
        return this.plot([e, t, n, s]);
      if (this._tryRetarget("plot", e)) return this;
      const o = new Gt(this._stepper).type(this._element.MorphArray).to(e);
      return this.queue(function() {
        o.from(this._element.array());
      }, function(a) {
        return this._element.plot(o.at(a)), o.done();
      }), this._rememberMorpher("plot", o), this;
    },
    // Add leading method
    leading(e) {
      return this._queueNumber("leading", e);
    },
    // Add animatable viewbox
    viewbox(e, t, n, s) {
      return this._queueObject("viewbox", new yt(e, t, n, s));
    },
    update(e) {
      return typeof e != "object" ? this.update({
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      }) : (e.opacity != null && this.attr("stop-opacity", e.opacity), e.color != null && this.attr("stop-color", e.color), e.offset != null && this.attr("offset", e.offset), this);
    }
  }), T(Et, {
    rx: Qe,
    ry: Ke,
    from: Rn,
    to: On
  }), w(Et, "Runner");
  class Ae extends vt {
    constructor(t, n = t) {
      super(X("svg", t), n), this.namespace();
    }
    // Creates and returns defs element
    defs() {
      return this.isRoot() ? at(this.node.querySelector("defs")) || this.put(new Re()) : this.root().defs();
    }
    isRoot() {
      return !this.node.parentNode || !(this.node.parentNode instanceof C.window.SVGElement) && this.node.parentNode.nodeName !== "#document-fragment";
    }
    // Add namespaces
    namespace() {
      return this.isRoot() ? this.attr({
        xmlns: q,
        version: "1.1"
      }).attr("xmlns:xlink", K, Q) : this.root().namespace();
    }
    removeNamespace() {
      return this.attr({
        xmlns: null,
        version: null
      }).attr("xmlns:xlink", null, Q).attr("xmlns:svgjs", null, Q);
    }
    // Check if this is a root svg
    // If not, call root() from this element
    root() {
      return this.isRoot() ? this : super.root();
    }
  }
  r({
    Container: {
      // Create nested svg document
      nested: G(function() {
        return this.put(new Ae());
      })
    }
  }), w(Ae, "Svg", !0);
  class Pe extends vt {
    // Initialize node
    constructor(t, n = t) {
      super(X("symbol", t), n);
    }
  }
  r({
    Container: {
      symbol: G(function() {
        return this.put(new Pe());
      })
    }
  }), w(Pe, "Symbol");
  function cs(e) {
    return this._build === !1 && this.clear(), this.node.appendChild(C.document.createTextNode(e)), this;
  }
  function us() {
    return this.node.getComputedTextLength();
  }
  function ds(e, t = this.bbox()) {
    return e == null ? t.x : this.attr("x", this.attr("x") + e - t.x);
  }
  function fs(e, t = this.bbox()) {
    return e == null ? t.y : this.attr("y", this.attr("y") + e - t.y);
  }
  function ps(e, t, n = this.bbox()) {
    return this.x(e, n).y(t, n);
  }
  function gs(e, t = this.bbox()) {
    return e == null ? t.cx : this.attr("x", this.attr("x") + e - t.cx);
  }
  function ms(e, t = this.bbox()) {
    return e == null ? t.cy : this.attr("y", this.attr("y") + e - t.cy);
  }
  function ys(e, t, n = this.bbox()) {
    return this.cx(e, n).cy(t, n);
  }
  function bs(e) {
    return this.attr("x", e);
  }
  function ws(e) {
    return this.attr("y", e);
  }
  function vs(e, t) {
    return this.ax(e).ay(t);
  }
  function xs(e) {
    return this._build = !!e, this;
  }
  var Ln = {
    __proto__: null,
    amove: vs,
    ax: bs,
    ay: ws,
    build: xs,
    center: ys,
    cx: gs,
    cy: ms,
    length: us,
    move: ps,
    plain: cs,
    x: ds,
    y: fs
  };
  class Ct extends _t {
    // Initialize node
    constructor(t, n = t) {
      super(X("text", t), n), this.dom.leading = this.dom.leading ?? new I(1.3), this._rebuild = !0, this._build = !1;
    }
    // Set / get leading
    leading(t) {
      return t == null ? this.dom.leading : (this.dom.leading = new I(t), this.rebuild());
    }
    // Rebuild appearance type
    rebuild(t) {
      if (typeof t == "boolean" && (this._rebuild = t), this._rebuild) {
        const n = this;
        let s = 0;
        const o = this.dom.leading;
        this.each(function(a) {
          if (E(this.node)) return;
          const c = C.window.getComputedStyle(this.node).getPropertyValue("font-size"), l = o * new I(c);
          this.dom.newLined && (this.attr("x", n.attr("x")), this.text() === `
` ? s += l : (this.attr("dy", a ? l + s : 0), s = 0));
        }), this.fire("rebuild");
      }
      return this;
    }
    // overwrite method from parent to set data properly
    setData(t) {
      return this.dom = t, this.dom.leading = new I(t.leading || 1.3), this;
    }
    writeDataToDom() {
      return B(this, this.dom, {
        leading: 1.3
      }), this;
    }
    // Set the text content
    text(t) {
      if (t === void 0) {
        const n = this.node.childNodes;
        let s = 0;
        t = "";
        for (let o = 0, a = n.length; o < a; ++o) {
          if (n[o].nodeName === "textPath" || E(n[o])) {
            o === 0 && (s = o + 1);
            continue;
          }
          o !== s && n[o].nodeType !== 3 && at(n[o]).dom.newLined === !0 && (t += `
`), t += n[o].textContent;
        }
        return t;
      }
      if (this.clear().build(!0), typeof t == "function")
        t.call(this, this);
      else {
        t = (t + "").split(`
`);
        for (let n = 0, s = t.length; n < s; n++)
          this.newLine(t[n]);
      }
      return this.build(!1).rebuild();
    }
  }
  T(Ct, Ln), r({
    Container: {
      // Create text element
      text: G(function(e = "") {
        return this.put(new Ct()).text(e);
      }),
      // Create plain text element
      plain: G(function(e = "") {
        return this.put(new Ct()).plain(e);
      })
    }
  }), w(Ct, "Text");
  class ge extends _t {
    // Initialize node
    constructor(t, n = t) {
      super(X("tspan", t), n), this._build = !1;
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
      if (!(t instanceof Ct))
        return this;
      const n = t.index(this), s = C.window.getComputedStyle(this.node).getPropertyValue("font-size"), o = t.dom.leading * new I(s);
      return this.dy(n ? o : 0).attr("x", t.x());
    }
    // Set text content
    text(t) {
      return t == null ? this.node.textContent + (this.dom.newLined ? `
` : "") : (typeof t == "function" ? (this.clear().build(!0), t.call(this, this), this.build(!1)) : this.plain(t), this);
    }
  }
  T(ge, Ln), r({
    Tspan: {
      tspan: G(function(e = "") {
        const t = new ge();
        return this._build || this.clear(), this.put(t).text(e);
      })
    },
    Text: {
      newLine: function(e = "") {
        return this.tspan(e).newLine();
      }
    }
  }), w(ge, "Tspan");
  class ke extends _t {
    constructor(t, n = t) {
      super(X("circle", t), n);
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
      return this.radius(new I(t).divide(2));
    }
  }
  T(ke, {
    x: _n,
    y: En,
    cx: Cn,
    cy: Nn,
    width: Sn,
    height: Tn
  }), r({
    Container: {
      // Create circle element
      circle: G(function(e = 0) {
        return this.put(new ke()).size(e).move(0, 0);
      })
    }
  }), w(ke, "Circle");
  class Ge extends vt {
    constructor(t, n = t) {
      super(X("clipPath", t), n);
    }
    // Unclip all clipped elements and remove itself
    remove() {
      return this.targets().forEach(function(t) {
        t.unclip();
      }), super.remove();
    }
    targets() {
      return Ut("svg [clip-path*=" + this.id() + "]");
    }
  }
  r({
    Container: {
      // Create clipping element
      clip: G(function() {
        return this.defs().put(new Ge());
      })
    },
    Element: {
      // Distribute clipPath to svg element
      clipper() {
        return this.reference("clip-path");
      },
      clipWith(e) {
        const t = e instanceof Ge ? e : this.parent().clip().add(e);
        return this.attr("clip-path", "url(#" + t.id() + ")");
      },
      // Unclip element
      unclip() {
        return this.attr("clip-path", null);
      }
    }
  }), w(Ge, "ClipPath");
  class cn extends Tt {
    constructor(t, n = t) {
      super(X("foreignObject", t), n);
    }
  }
  r({
    Container: {
      foreignObject: G(function(e, t) {
        return this.put(new cn()).size(e, t);
      })
    }
  }), w(cn, "ForeignObject");
  function _s(e, t) {
    return this.children().forEach((n) => {
      let s;
      try {
        s = n.node instanceof it().SVGSVGElement ? new yt(n.attr(["x", "y", "width", "height"])) : n.bbox();
      } catch {
        return;
      }
      const o = new M(n), a = o.translate(e, t).transform(o.inverse()), c = new gt(s.x, s.y).transform(a);
      n.move(c.x, c.y);
    }), this;
  }
  function Es(e) {
    return this.dmove(e, 0);
  }
  function Cs(e) {
    return this.dmove(0, e);
  }
  function Ns(e, t = this.bbox()) {
    return e == null ? t.height : this.size(t.width, e, t);
  }
  function Ss(e = 0, t = 0, n = this.bbox()) {
    const s = e - n.x, o = t - n.y;
    return this.dmove(s, o);
  }
  function Ts(e, t, n = this.bbox()) {
    const s = O(this, e, t, n), o = s.width / n.width, a = s.height / n.height;
    return this.children().forEach((c) => {
      const l = new gt(n).transform(new M(c).inverse());
      c.scale(o, a, l.x, l.y);
    }), this;
  }
  function Rs(e, t = this.bbox()) {
    return e == null ? t.width : this.size(e, t.height, t);
  }
  function Os(e, t = this.bbox()) {
    return e == null ? t.x : this.move(e, t.y, t);
  }
  function Ms(e, t = this.bbox()) {
    return e == null ? t.y : this.move(t.x, e, t);
  }
  var Un = {
    __proto__: null,
    dmove: _s,
    dx: Es,
    dy: Cs,
    height: Ns,
    move: Ss,
    size: Ts,
    width: Rs,
    x: Os,
    y: Ms
  };
  class Ie extends vt {
    constructor(t, n = t) {
      super(X("g", t), n);
    }
  }
  T(Ie, Un), r({
    Container: {
      // Create a group element
      group: G(function() {
        return this.put(new Ie());
      })
    }
  }), w(Ie, "G");
  class me extends vt {
    constructor(t, n = t) {
      super(X("a", t), n);
    }
    // Link target attribute
    target(t) {
      return this.attr("target", t);
    }
    // Link url
    to(t) {
      return this.attr("href", t, K);
    }
  }
  T(me, Un), r({
    Container: {
      // Create a hyperlink element
      link: G(function(e) {
        return this.put(new me()).to(e);
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
        return t || (t = new me(), this.wrap(t)), typeof e == "function" ? e.call(t, t) : t.to(e), this;
      },
      linker() {
        const e = this.parent();
        return e && e.node.nodeName.toLowerCase() === "a" ? e : null;
      }
    }
  }), w(me, "A");
  class Be extends vt {
    // Initialize node
    constructor(t, n = t) {
      super(X("mask", t), n);
    }
    // Unmask all masked elements and remove itself
    remove() {
      return this.targets().forEach(function(t) {
        t.unmask();
      }), super.remove();
    }
    targets() {
      return Ut("svg [mask*=" + this.id() + "]");
    }
  }
  r({
    Container: {
      mask: G(function() {
        return this.defs().put(new Be());
      })
    },
    Element: {
      // Distribute mask to svg element
      masker() {
        return this.reference("mask");
      },
      maskWith(e) {
        const t = e instanceof Be ? e : this.parent().mask().add(e);
        return this.attr("mask", "url(#" + t.id() + ")");
      },
      // Unmask element
      unmask() {
        return this.attr("mask", null);
      }
    }
  }), w(Be, "Mask");
  class un extends Tt {
    constructor(t, n = t) {
      super(X("stop", t), n);
    }
    // add color stops
    update(t) {
      return (typeof t == "number" || t instanceof I) && (t = {
        offset: arguments[0],
        color: arguments[1],
        opacity: arguments[2]
      }), t.opacity != null && this.attr("stop-opacity", t.opacity), t.color != null && this.attr("stop-color", t.color), t.offset != null && this.attr("offset", new I(t.offset)), this;
    }
  }
  r({
    Gradient: {
      // Add a color stop
      stop: function(e, t, n) {
        return this.put(new un()).update(e, t, n);
      }
    }
  }), w(un, "Stop");
  function Ds(e, t) {
    if (!e) return "";
    if (!t) return e;
    let n = e + "{";
    for (const s in t)
      n += z(s) + ":" + t[s] + ";";
    return n += "}", n;
  }
  class He extends Tt {
    constructor(t, n = t) {
      super(X("style", t), n);
    }
    addText(t = "") {
      return this.node.textContent += t, this;
    }
    font(t, n, s = {}) {
      return this.rule("@font-face", {
        fontFamily: t,
        src: n,
        ...s
      });
    }
    rule(t, n) {
      return this.addText(Ds(t, n));
    }
  }
  r("Dom", {
    style(e, t) {
      return this.put(new He()).rule(e, t);
    },
    fontface(e, t, n) {
      return this.put(new He()).font(e, t, n);
    }
  }), w(He, "Style");
  class Le extends Ct {
    // Initialize node
    constructor(t, n = t) {
      super(X("textPath", t), n);
    }
    // return the array of the path track element
    array() {
      const t = this.track();
      return t ? t.array() : null;
    }
    // Plot path if any
    plot(t) {
      const n = this.track();
      let s = null;
      return n && (s = n.plot(t)), t == null ? s : this;
    }
    // Get the path element
    track() {
      return this.reference("href");
    }
  }
  r({
    Container: {
      textPath: G(function(e, t) {
        return e instanceof Ct || (e = this.text(e)), e.path(t);
      })
    },
    Text: {
      // Create path for text to run on
      path: G(function(e, t = !0) {
        const n = new Le();
        e instanceof Ft || (e = this.defs().path(e)), n.attr("href", "#" + e, K);
        let s;
        if (t)
          for (; s = this.node.firstChild; )
            n.node.appendChild(s);
        return this.put(n);
      }),
      // Get the textPath children
      textPath() {
        return this.findOne("textPath");
      }
    },
    Path: {
      // creates a textPath from this path
      text: G(function(e) {
        return e instanceof Ct || (e = new Ct().addTo(this.parent()).text(e)), e.path(this);
      }),
      targets() {
        return Ut("svg textPath").filter((e) => (e.attr("href") || "").includes(this.id()));
      }
    }
  }), Le.prototype.MorphArray = kt, w(Le, "TextPath");
  class dn extends _t {
    constructor(t, n = t) {
      super(X("use", t), n);
    }
    // Use element as a reference
    use(t, n) {
      return this.attr("href", (n || "") + "#" + t, K);
    }
  }
  r({
    Container: {
      // Create a use element
      use: G(function(e, t) {
        return this.put(new dn()).use(e, t);
      })
    }
  }), w(dn, "Use");
  const zs = U;
  return T([Ae, Pe, ue, te, de], h("viewbox")), T([ee, re, oe, Ft], h("marker")), T(Ct, h("Text")), T(Ft, h("Path")), T(Re, h("Defs")), T([Ct, ge], h("Tspan")), T([pe, ce, Kt, Et], h("radius")), T(Jt, h("EventTarget")), T(zt, h("Dom")), T(Tt, h("Element")), T(_t, h("Shape")), T([vt, tn], h("Container")), T(Kt, h("Gradient")), T(Et, h("Runner")), Pt.extend(u()), kn([I, W, yt, M, Yt, At, kt, gt]), Gn(), x.A = me, x.Animator = $, x.Array = Yt, x.Box = yt, x.Circle = ke, x.ClipPath = Ge, x.Color = W, x.Container = vt, x.Controller = fe, x.Defs = Re, x.Dom = zt, x.Ease = Oe, x.Element = Tt, x.Ellipse = ce, x.EventTarget = Jt, x.ForeignObject = cn, x.Fragment = tn, x.G = Ie, x.Gradient = Kt, x.Image = ue, x.Line = ee, x.List = Pt, x.Marker = de, x.Mask = Be, x.Matrix = M, x.Morphable = Gt, x.NonMorphable = Me, x.Number = I, x.ObjectBag = se, x.PID = An, x.Path = Ft, x.PathArray = kt, x.Pattern = te, x.Point = gt, x.PointArray = At, x.Polygon = oe, x.Polyline = re, x.Queue = De, x.Rect = pe, x.Runner = Et, x.SVG = zs, x.Shape = _t, x.Spring = zn, x.Stop = un, x.Style = He, x.Svg = Ae, x.Symbol = Pe, x.Text = Ct, x.TextPath = Le, x.Timeline = ln, x.TransformBag = ie, x.Tspan = ge, x.Use = dn, x.adopt = at, x.assignNewId = pt, x.clearEvents = bn, x.create = j, x.defaults = Ri, x.dispatch = wn, x.easing = Mn, x.eid = ht, x.extend = T, x.find = Ut, x.getClass = Y, x.getEventTarget = Se, x.getEvents = We, x.getWindow = it, x.makeInstance = U, x.makeMorphable = Gn, x.mockAdopt = Z, x.namespaces = bt, x.nodeOrNew = X, x.off = Zt, x.on = Te, x.parser = Dt, x.regex = Kn, x.register = w, x.registerMorphableType = kn, x.registerWindow = A, x.restoreWindow = L, x.root = st, x.saveWindow = ct, x.utils = H, x.windowEvents = $e, x.withWindow = rt, x.wrapWithAttrCheck = G, x;
}
var D = Fn();
const Yn = (N) => (N.changedTouches && (N = N.changedTouches[0]), { x: N.clientX, y: N.clientY });
class ks {
  constructor(i) {
    i.remember("_draggable", this), this.el = i, this.drag = this.drag.bind(this), this.startDrag = this.startDrag.bind(this), this.endDrag = this.endDrag.bind(this);
  }
  // Enables or disabled drag based on input
  init(i) {
    i ? (this.el.on("mousedown.drag", this.startDrag), this.el.on("touchstart.drag", this.startDrag, { passive: !1 })) : (this.el.off("mousedown.drag"), this.el.off("touchstart.drag"));
  }
  // Start dragging
  startDrag(i) {
    const r = !i.type.indexOf("mouse");
    if (r && i.which !== 1 && i.buttons !== 0 || this.el.dispatch("beforedrag", { event: i, handler: this }).defaultPrevented)
      return;
    i.preventDefault(), i.stopPropagation(), this.init(!1), this.box = this.el.bbox(), this.lastClick = this.el.point(Yn(i));
    const h = (r ? "mousemove" : "touchmove") + ".drag", u = (r ? "mouseup" : "touchend") + ".drag";
    D.on(window, h, this.drag, this, { passive: !1 }), D.on(window, u, this.endDrag, this, { passive: !1 }), this.el.fire("dragstart", { event: i, handler: this, box: this.box });
  }
  // While dragging
  drag(i) {
    const { box: r, lastClick: h } = this, u = this.el.point(Yn(i)), g = u.x - h.x, f = u.y - h.y;
    if (!g && !f) return r;
    const m = r.x + g, y = r.y + f;
    this.box = new D.Box(m, y, r.w, r.h), this.lastClick = u, !this.el.dispatch("dragmove", {
      event: i,
      handler: this,
      box: this.box,
      dx: g,
      dy: f
    }).defaultPrevented && this.move(m, y);
  }
  move(i, r) {
    this.el.type === "svg" ? D.G.prototype.move.call(this.el, i, r) : this.el.move(i, r);
  }
  endDrag(i) {
    this.drag(i), this.el.fire("dragend", { event: i, handler: this, box: this.box }), D.off(window, "mousemove.drag"), D.off(window, "touchmove.drag"), D.off(window, "mouseup.drag"), D.off(window, "touchend.drag"), this.init(!0);
  }
}
D.extend(D.Element, {
  draggable(N = !0) {
    return (this.remember("_draggable") || new ks(this)).init(N), this;
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
function fn(N, i, r, h = null) {
  return function(u) {
    u.preventDefault(), u.stopPropagation();
    var g = u.pageX || u.touches[0].pageX, f = u.pageY || u.touches[0].pageY;
    i.fire(N, { x: g, y: f, event: u, index: h, points: r });
  };
}
function pn([N, i], { a: r, b: h, c: u, d: g, e: f, f: m }) {
  return [N * r + i * u + f, N * h + i * g + m];
}
class jn {
  constructor(i) {
    this.el = i, i.remember("_selectHandler", this), this.selection = new D.G(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const r = D.getWindow();
    this.observer = new r.MutationObserver(this.mutationHandler);
  }
  init(i) {
    this.createHandle = i.createHandle || this.createHandleFn, this.createRot = i.createRot || this.createRotFn, this.updateHandle = i.updateHandle || this.updateHandleFn, this.updateRot = i.updateRot || this.updateRotFn, this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createResizeHandles(), this.updateResizeHandles(), this.createRotationHandle(), this.updateRotationHandle(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(i, r) {
    if (!i) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(r);
  }
  createSelection() {
    this.selection.polygon(this.handlePoints).addClass("svg_select_shape");
  }
  updateSelection() {
    this.selection.get(0).plot(this.handlePoints);
  }
  createResizeHandles() {
    this.handlePoints.forEach((i, r, h) => {
      const u = this.order[r];
      this.createHandle.call(this, this.selection, i, r, h, u), this.selection.get(r + 1).addClass("svg_select_handle svg_select_handle_" + u).on("mousedown.selection touchstart.selection", fn(u, this.el, this.handlePoints, r));
    });
  }
  createHandleFn(i) {
    i.polyline();
  }
  updateHandleFn(i, r, h, u) {
    const g = u.at(h - 1), f = u[(h + 1) % u.length], m = r, y = [m[0] - g[0], m[1] - g[1]], _ = [m[0] - f[0], m[1] - f[1]], z = Math.sqrt(y[0] * y[0] + y[1] * y[1]), k = Math.sqrt(_[0] * _[0] + _[1] * _[1]), O = [y[0] / z, y[1] / z], p = [_[0] / k, _[1] / k], b = [m[0] - O[0] * 10, m[1] - O[1] * 10], E = [m[0] - p[0] * 10, m[1] - p[1] * 10];
    i.plot([b, m, E]);
  }
  updateResizeHandles() {
    this.handlePoints.forEach((i, r, h) => {
      const u = this.order[r];
      this.updateHandle.call(this, this.selection.get(r + 1), i, r, h, u);
    });
  }
  createRotFn(i) {
    i.line(), i.circle(5);
  }
  getPoint(i) {
    return this.handlePoints[this.order.indexOf(i)];
  }
  getPointHandle(i) {
    return this.selection.get(this.order.indexOf(i) + 1);
  }
  updateRotFn(i, r) {
    const h = this.getPoint("t");
    i.get(0).plot(h[0], h[1], r[0], r[1]), i.get(1).center(r[0], r[1]);
  }
  createRotationHandle() {
    const i = this.selection.group().addClass("svg_select_handle_rot").on("mousedown.selection touchstart.selection", fn("rot", this.el, this.handlePoints));
    this.createRot.call(this, i);
  }
  updateRotationHandle() {
    const i = this.selection.findOne("g.svg_select_handle_rot");
    this.updateRot(i, this.rotationPoint, this.handlePoints);
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const i = this.el.bbox(), r = this.el.screenCTM(), u = this.el.root().screenCTM().inverseO().multiplyO(r);
    this.handlePoints = this.getHandlePoints(i).map((g) => pn(g, u)), this.rotationPoint = pn(this.getRotationPoint(i), u);
  }
  // A collection of all the points we need to draw our ui
  getHandlePoints({ x: i, x2: r, y: h, y2: u, cx: g, cy: f } = this.el.bbox()) {
    return [
      [i, h],
      [g, h],
      [r, h],
      [r, f],
      [r, u],
      [g, u],
      [i, u],
      [i, f]
    ];
  }
  // A collection of all the points we need to draw our ui
  getRotationPoint({ y: i, cx: r } = this.el.bbox()) {
    return [r, i - 20];
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updateResizeHandles(), this.updateRotationHandle();
  }
}
class Gs {
  constructor(i) {
    this.el = i, i.remember("_pointSelectHandler", this), this.selection = new D.G(), this.order = ["lt", "t", "rt", "r", "rb", "b", "lb", "l", "rot"], this.mutationHandler = this.mutationHandler.bind(this);
    const r = D.getWindow();
    this.observer = new r.MutationObserver(this.mutationHandler);
  }
  init(i) {
    this.createHandle = i.createHandle || this.createHandleFn, this.updateHandle = i.updateHandle || this.updateHandleFn, this.el.root().put(this.selection), this.updatePoints(), this.createSelection(), this.createPointHandles(), this.updatePointHandles(), this.observer.observe(this.el.node, { attributes: !0 });
  }
  active(i, r) {
    if (!i) {
      this.selection.clear().remove(), this.observer.disconnect();
      return;
    }
    this.init(r);
  }
  createSelection() {
    this.selection.polygon(this.points).addClass("svg_select_shape_pointSelect");
  }
  updateSelection() {
    this.selection.get(0).plot(this.points);
  }
  createPointHandles() {
    this.points.forEach((i, r, h) => {
      this.createHandle.call(this, this.selection, i, r, h), this.selection.get(r + 1).addClass("svg_select_handle_point").on("mousedown.selection touchstart.selection", fn("point", this.el, this.points, r));
    });
  }
  createHandleFn(i) {
    i.circle(5);
  }
  updateHandleFn(i, r) {
    i.center(r[0], r[1]);
  }
  updatePointHandles() {
    this.points.forEach((i, r, h) => {
      this.updateHandle.call(this, this.selection.get(r + 1), i, r, h);
    });
  }
  // gets new bounding box points and transform them into the elements space
  updatePoints() {
    const i = this.el.root().screenCTM().inverseO().multiplyO(this.el.screenCTM());
    this.points = this.el.array().map((r) => pn(r, i));
  }
  mutationHandler() {
    this.updatePoints(), this.updateSelection(), this.updatePointHandles();
  }
}
const Vn = (N) => function(i = !0, r = {}) {
  typeof i == "object" && (r = i, i = !0);
  let h = this.remember("_" + N.name);
  return h || (i.prototype instanceof jn ? (h = new i(this), i = !0) : h = new N(this), this.remember("_" + N.name, h)), h.active(i, r), this;
};
D.extend(D.Element, {
  select: Vn(jn)
});
D.extend([D.Polygon, D.Polyline, D.Line], {
  pointSelect: Vn(Gs)
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
const Ye = (N) => (N.changedTouches && (N = N.changedTouches[0]), { x: N.clientX, y: N.clientY }), qn = (N) => {
  let i = 1 / 0, r = 1 / 0, h = -1 / 0, u = -1 / 0;
  for (let g = 0; g < N.length; g++) {
    const f = N[g];
    i = Math.min(i, f[0]), r = Math.min(r, f[1]), h = Math.max(h, f[0]), u = Math.max(u, f[1]);
  }
  return new D.Box(i, r, h - i, u - r);
};
function Is(N, i, r) {
  const u = [
    [N.x, N.y],
    [N.x + N.width, N.y],
    [N.x + N.width, N.y + N.height],
    [N.x, N.y + N.height]
  ].map(([g, f]) => {
    const m = g - i[0], y = f - i[1], _ = m * r, z = y * r;
    return [_ + i[0], z + i[1]];
  });
  return qn(u);
}
class Xn {
  constructor(i) {
    this.el = i, i.remember("_ResizeHandler", this), this.lastCoordinates = null, this.eventType = "", this.lastEvent = null, this.handleResize = this.handleResize.bind(this), this.resize = this.resize.bind(this), this.endResize = this.endResize.bind(this), this.rotate = this.rotate.bind(this), this.movePoint = this.movePoint.bind(this);
  }
  active(i, r) {
    this.preserveAspectRatio = r.preserveAspectRatio ?? !1, this.aroundCenter = r.aroundCenter ?? !1, this.grid = r.grid ?? 0, this.degree = r.degree ?? 0, this.el.off(".resize"), i && (this.el.on(
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
  handleResize(i) {
    this.eventType = i.type;
    const { event: r, index: h, points: u } = i.detail, g = !r.type.indexOf("mouse");
    if (g && (r.which || r.buttons) !== 1 || this.el.dispatch("beforeresize", { event: i, handler: this }).defaultPrevented)
      return;
    this.box = this.el.bbox(), this.startPoint = this.el.point(Ye(r)), this.index = h, this.points = u.slice();
    const f = (g ? "mousemove" : "touchmove") + ".resize", m = (g ? "mouseup" : "touchcancel.resize touchend") + ".resize";
    i.type === "point" ? D.on(window, f, this.movePoint) : i.type === "rot" ? D.on(window, f, this.rotate) : D.on(window, f, this.resize), D.on(window, m, this.endResize);
  }
  resize(i) {
    this.lastEvent = i;
    const r = this.snapToGrid(this.el.point(Ye(i)));
    let h = r.x - this.startPoint.x, u = r.y - this.startPoint.y;
    this.preserveAspectRatio && this.aroundCenter && (h *= 2, u *= 2);
    const g = this.box.x + h, f = this.box.y + u, m = this.box.x2 + h, y = this.box.y2 + u;
    let _ = new D.Box(this.box);
    if (this.eventType.includes("l") && (_.x = Math.min(g, this.box.x2), _.x2 = Math.max(g, this.box.x2)), this.eventType.includes("r") && (_.x = Math.min(m, this.box.x), _.x2 = Math.max(m, this.box.x)), this.eventType.includes("t") && (_.y = Math.min(f, this.box.y2), _.y2 = Math.max(f, this.box.y2)), this.eventType.includes("b") && (_.y = Math.min(y, this.box.y), _.y2 = Math.max(y, this.box.y)), _.width = _.x2 - _.x, _.height = _.y2 - _.y, this.preserveAspectRatio) {
      const z = _.width / this.box.width, k = _.height / this.box.height, O = ["lt", "t", "rt", "r", "rb", "b", "lb", "l"], p = (O.indexOf(this.eventType) + 4) % O.length, b = this.aroundCenter ? [this.box.cx, this.box.cy] : this.points[p];
      let E = this.eventType.includes("t") || this.eventType.includes("b") ? k : z;
      E = this.eventType.length === 2 ? Math.max(z, k) : E, _ = Is(this.box, b, E);
    }
    this.el.dispatch("resize", {
      box: new D.Box(_),
      angle: 0,
      eventType: this.eventType,
      event: i,
      handler: this
    }).defaultPrevented || this.el.size(_.width, _.height).move(_.x, _.y);
  }
  movePoint(i) {
    this.lastEvent = i;
    const { x: r, y: h } = this.snapToGrid(this.el.point(Ye(i))), u = this.el.array().slice();
    u[this.index] = [r, h], !this.el.dispatch("resize", {
      box: qn(u),
      angle: 0,
      eventType: this.eventType,
      event: i,
      handler: this
    }).defaultPrevented && this.el.plot(u);
  }
  rotate(i) {
    this.lastEvent = i;
    const r = this.startPoint, h = this.el.point(Ye(i)), { cx: u, cy: g } = this.box, f = r.x - u, m = r.y - g, y = h.x - u, _ = h.y - g, z = Math.sqrt(f * f + m * m) * Math.sqrt(y * y + _ * _);
    if (z === 0)
      return;
    let k = Math.acos((f * y + m * _) / z) / Math.PI * 180;
    if (!k) return;
    h.x < r.x && (k = -k);
    const O = new D.Matrix(this.el), { x: p, y: b } = new D.Point(u, g).transformO(O), { rotate: E } = O.decompose(), B = this.snapToAngle(E + k) - E;
    this.el.dispatch("resize", {
      box: this.box,
      angle: B,
      eventType: this.eventType,
      event: i,
      handler: this
    }).defaultPrevented || this.el.transform(O.rotateO(B, p, b));
  }
  endResize(i) {
    this.eventType !== "rot" && this.eventType !== "point" && this.resize(i), this.lastEvent = null, this.eventType = "", D.off(window, "mousemove.resize touchmove.resize"), D.off(window, "mouseup.resize touchend.resize");
  }
  snapToGrid(i) {
    return this.grid && (i.x = Math.round(i.x / this.grid) * this.grid, i.y = Math.round(i.y / this.grid) * this.grid), i;
  }
  snapToAngle(i) {
    return this.degree && (i = Math.round(i / this.degree) * this.degree), i;
  }
}
D.extend(D.Element, {
  // Resize element with mouse
  resize: function(N = !0, i = {}) {
    typeof N == "object" && (i = N, N = !0);
    let r = this.remember("_ResizeHandler");
    return r || (N.prototype instanceof Xn ? (r = new N(this), N = !0) : r = new Xn(this), this.remember("_resizeHandler", r)), r.active(N, i), this;
  }
});
var Bs = { exports: {} };
/*!
 * SVG.js Connectable Plugin v2.0.0
 * =================================
 *
 * A JavaScript library for connecting SVG things - compatible with SVG.js 3.x
 *
 * svg.connectable.js 2.0.0
 * Licensed under the MIT license.
 * Copyright (c) 2014-15 jillix
 * Copyright (c) 2015-17 Loredana Cirstea
 * Copyright (c) 2015 Christian Tzurcanu - Algorithm for creating connector curves, connector paths.
 * Copyright (c) 2025 - Updated for SVG.js 3.x compatibility
 *
 * */
(function(N, i) {
  (function(r, h) {
    N.exports = h(Fn());
  })(typeof window < "u" ? window : Ps, function(r) {
    if (!r || !r.Element)
      throw new Error("SVG.js is required for the connectable plugin");
    var h = null, u = null;
    function g(f, m) {
      var y = {};
      m === void 0 && (m = f, f = {}), h = f.container || this.parent() || h;
      var _ = this;
      if (u = f.markers || this.parent() || u, y.source = _, y.target = m, y.type = f.type || "straight", f.connector) {
        var z = r.find("#" + f.connector.node.getAttribute("href").slice(1))[0];
        if (z && z.type == "path") {
          y.connector = f.connector;
          var k = z.array();
          if (!(k[1] && k[1][0] == "M") || !(k[2] && k[2][0] == "M")) {
            var O = z.bbox();
            k.splice(0, 0, ["M", O.x + O.width / 2, O.y], ["M", O.x + O.width / 2, O.y + O.height]), z.plot(k);
          }
          y.connector.target = z;
        }
      }
      return y.connector || (y.connector = h.path().attr("connectortype", "default").fill("none")), y.sourceAttach = f.sourceAttach || "center", y.targetAttach = f.targetAttach || "center", y.color = f.color || "#000000", y.setMarker = function(p, b, E) {
        if (E = E || this, b && (E.markers = b), !p || p == "null") {
          if (E.marker = null, E.connector.attr("marker-end")) {
            var B = E.connector.attr("marker-end"), H = r.find(B.slice(5, B.length - 1))[0];
            H && H.remove(), E.connector.attr("marker-end", null);
          }
        } else if (p == "default") {
          var H = E.markers.defs().marker(30, 30), q = "triangle-" + Math.random().toString(16).substr(2, 8);
          E.connector.attr("marker-end", "url(#" + q + ")"), H.attr({
            id: q,
            viewBox: "0 0 30 30",
            refX: "30",
            refY: "15",
            markerUnits: "strokeWidth",
            markerWidth: "12",
            markerHeight: "15"
          }), H.path().attr({
            d: "M 0 0 L 30 15 L 0 30 z"
          }), E.marker = H, E.marker.fill(E.color);
        } else
          E.marker = p;
        return E;
      }, y.setMarker(f.marker, u), y.computeConnectorCoordinates = function(p) {
        p = p || this;
        var b = {}, E = p.source.bbox(), B = p.target.bbox();
        if (p.sourceAttach == "center")
          b.point1 = [p.source.cx(), p.source.cy()];
        else if (p.source.type == "ellipse") {
          var H = parseFloat(p.source.attr("rx")), q = parseFloat(p.source.attr("ry")), ft = p.source.cx(), Q = p.source.cy(), K = p.target.cx(), bt = p.target.cy(), C = K - ft, A = bt - Q, nt = Math.sqrt(C * C + A * A), ct = C / nt, L = A / nt, rt = ft + H * ct, it = Q + q * L;
          b.point1 = [rt + H / 2, it + q / 2];
        } else if (p.source.type == "path") {
          var F = JSON.parse(JSON.stringify(p.source.array()));
          F[F.length - 1][0] == "Z" && F.splice(F.length - 1, 1);
          var V = F, st = "point2";
        } else
          var F = [
            ["M", p.source.cx(), p.source.y()],
            ["L", p.source.x() + E.width, p.source.cy()],
            ["L", p.source.cx(), p.source.y() + E.height],
            ["L", p.source.x(), p.source.cy()]
          ], V = F, st = "point2";
        if (p.targetAttach == "center")
          b.point2 = [p.target.cx(), p.target.cy()];
        else if (p.target.type == "ellipse") {
          var j = parseFloat(p.target.attr("rx")), U = parseFloat(p.target.attr("ry")), ft = p.source.cx(), Q = p.source.cy(), K = p.target.cx(), bt = p.target.cy(), C = K - ft, A = bt - Q, nt = Math.sqrt(C * C + A * A), ct = C / nt, L = A / nt, X = ft + (nt - j - 5) * ct, at = Q + (nt - U - 5) * L;
          b.point2 = [X + j / 2, at + U / 2];
        } else if (p.target.type == "path") {
          var tt = JSON.parse(JSON.stringify(p.target.array()));
          tt[tt.length - 1][0] == "Z" && tt.splice(tt.length - 1, 1);
          var V = tt, st = "point1";
        } else
          var tt = [
            ["M", p.target.cx(), p.target.y()],
            ["L", p.target.x() + B.width, p.target.cy()],
            ["L", p.target.cx(), p.target.y() + B.height],
            ["L", p.target.x(), p.target.cy()]
          ], V = tt, st = "point1";
        if (!b.point1 || !b.point2)
          if (b.min = Number.MAX_VALUE, !b.point1 && !b.point2)
            for (var Z = 0; Z < F.length; Z++)
              for (var w = 0; w < tt.length; w++) {
                var Y = Math.pow(tt[w][tt[w].length - 2] - F[Z][F[Z].length - 2], 2) + Math.pow(tt[w][tt[w].length - 1] - F[Z][F[Z].length - 1], 2);
                b.min > Y && (b.min = Y, b.point1 = [F[Z][F[Z].length - 2], F[Z][F[Z].length - 1]], b.point2 = [tt[w][tt[w].length - 2], tt[w][tt[w].length - 1]]);
              }
          else {
            st = b[st];
            for (var Z = 0; Z < V.length; Z++) {
              var Y = Math.pow(st[0] - V[Z][V[Z].length - 2], 2) + Math.pow(st[1] - V[Z][V[Z].length - 1], 2);
              b.min > Y && (b.min = Y, b.point = [V[Z][V[Z].length - 2], V[Z][V[Z].length - 1]]);
            }
            b.point1 ? b.point2 = b.point : b.point1 = b.point;
          }
        var et = b.point1, ht = b.point2;
        if (p.type == "curved") {
          var pt = (ht[1] - et[1]) / 4, T = pt < 0 ? -1 : 1;
          pt = Math.max(Math.abs(pt), 20);
          var G = { x: et[0], y: et[1] + T * pt }, wt = { x: ht[0], y: ht[1] - T * pt }, P = { x: G.x + (wt.x - G.x) / 2, y: G.y + (wt.y - G.y) / 2 }, xt = [
            ["M", et[0], et[1]],
            ["C", G.x, G.y, G.x, G.y, P.x, P.y],
            ["C", wt.x, wt.y, wt.x, wt.y, ht[0], ht[1]]
          ];
        } else
          var xt = [
            ["M", et[0], et[1]],
            ["L", ht[0], ht[1]]
          ];
        return xt;
      }, _.cons = _.cons || [], _.cons.push(y), y.update = function() {
        if (y.connector.attr("connectortype") == "default")
          y.connector.plot(y.computeConnectorCoordinates(y));
        else {
          var p = y.connector.target.array(), b = y.computeConnectorCoordinates(y), E = [b[0][1], b[0][2]], B = [b[b.length - 1][b[b.length - 1].length - 2], b[b.length - 1][b[b.length - 1].length - 1]], H = Math.sqrt(Math.pow(B[0] - E[0], 2) + Math.pow(B[1] - E[1], 2)), q = Math.sqrt(Math.pow(p[1][1] - p[0][1], 2) + Math.pow(p[1][2] - p[0][2], 2)), ft = H / q, Q = Math.atan((B[1] - E[1]) / (B[0] - E[0]));
          (Q > 0 && B[1] < E[1] || Q < 0 && B[1] > E[1] && B[0] < E[0]) && (Q = Math.PI + Q);
          var K = { x: E[0] + (B[0] - E[0]) / 2, y: E[1] + (B[1] - E[1]) / 2 }, bt = Math.atan((p[1][2] - p[0][2]) / (p[1][1] - p[0][1])), C = { x: y.connector.target.cx(), y: y.connector.target.cy() }, A = [1, 0, 0, 1, K.x - C.x, K.y - C.y], L = A[0], rt = A[1], it = A[2], F = A[3], V = A[4], st = A[5], nt = Math.sin(-Q + bt), ct = Math.cos(-Q + bt);
          V = -L * K.x - it * K.y + V, st = -rt * K.x - F * K.y + st, A[0] = L * ct + rt * nt, A[1] = -L * nt + rt * ct, A[2] = it * ct + F * nt, A[3] = -it * nt + ct * F, A[4] = ct * V + nt * st, A[5] = ct * st - nt * V, A[4] = L * K.x + it * K.y + A[4], A[5] = rt * K.x + F * K.y + A[5];
          var L = 1, rt = 0, it = 0, F = 1, V = (-L * C.x - it * C.y) * ft, st = (-rt * C.x - F * C.y) * ft, j = [];
          j[0] = L * ft, j[1] = rt * ft, j[2] = it * ft, j[3] = F * ft, j[4] = L * C.x + it * C.y + V, j[5] = rt * C.x + F * C.y + st;
          var U = [];
          U[0] = j[0] * A[0] + j[1] * A[2], U[1] = j[0] * A[1] + j[1] * A[3], U[2] = j[2] * A[0] + j[3] * A[2], U[3] = j[2] * A[1] + j[3] * A[3], U[4] = A[0] * j[4] + A[2] * j[5] + A[4], U[5] = A[1] * j[4] + A[3] * j[5] + A[5], U = new r.Matrix(U), y.connector.transform(U);
        }
      }, y.update(), _.on("dragmove", y.update), m.on("dragmove", y.update), y.setConnectorColor = function(p, b) {
        b = b || this, b.color = p, b.connector.stroke(p), b.marker && b.marker.fill(p);
      }, y.setConnectorColor(y.color), y.setConnectorAttachment = function(p, b, E) {
        E = E || this, E[p + "Attach"] = b, E.update();
      }, y.setConnector = function(p, b) {
        b = b || this, p && (b.connector.remove(), p == "default" ? (b.connector = h.path().attr("connectortype", "default").fill("none"), b.setConnectorColor(b.color)) : b.connector = p, b.update());
      }, y.setType = function(p, b) {
        b = b || this, ["straight", "curved"].indexOf(p) != -1 && b.type != p && (b.type = p, b.update());
      }, y;
    }
    return r.extend(r.Element, {
      connectable: g
    }), N.exports && (N.exports = r), r;
  });
})(Bs);
class $n {
  constructor(i, r = {}) {
    this.isActive = !1, this.node = i, this.target = i.backgroundRect, this.options = {
      resizeEnabled: !0,
      rotateEnabled: !0,
      preserveAspectRatio: !1,
      aroundCenter: !1,
      grid: 0,
      degree: 0,
      ...r
    };
  }
  enable() {
    if (!this.isActive)
      try {
        const i = this.target;
        typeof i.select == "function" && i.select({ rotationPoint: this.options.rotateEnabled }), this.options.resizeEnabled && typeof i.resize == "function" && i.resize({
          preserveAspectRatio: this.options.preserveAspectRatio,
          aroundCenter: this.options.aroundCenter,
          grid: this.options.grid ?? 1,
          degree: this.options.degree ?? 0.1
        }), this.addEventListeners(), this.isActive = !0;
      } catch (i) {
        console.warn("Failed to enable resize/rotate:", i);
      }
  }
  disable() {
    if (this.isActive)
      try {
        const i = this.target;
        typeof i.select == "function" && i.select(!1), typeof i.resize == "function" && i.resize(!1), this.removeEventListeners(), this.isActive = !1;
      } catch (i) {
        console.warn("Failed to disable resize/rotate:", i);
      }
  }
  addEventListeners() {
    this.target.on("mousedown.resizerotate touchstart.resizerotate", (i) => {
      this.isResizeRotateHandle(i.target) && (console.log("RESIZE_ROTATE_DEBUG: Handle interaction started, hiding connection handles"), this.node.isConnectionHandlesEnabled() && this.node.disableConnectionHandles());
    }), this.target.on("resize", (i) => {
      this.handleResize(i), this.options.onResize?.(i), console.log("RESIZE_ROTATE_DEBUG: Resize complete, re-enabling connection handles"), this.node.slate && this.node.slate.getSelectedNodes().includes(this.node) && setTimeout(() => {
        this.node.enableConnectionHandles();
      }, 50);
    });
  }
  isResizeRotateHandle(i) {
    if (!i || !i.classList) return !1;
    const r = [
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
    for (const h of r)
      if (i.classList.contains(h))
        return !0;
    return !1;
  }
  removeEventListeners() {
    this.target.off("resize");
  }
  handleResize(i) {
    if (i.detail && i.detail.box) {
      const r = i.detail.box;
      if (this.node.options.width = r.width, this.node.options.height = r.height, this.node.options.x = r.x, this.node.options.y = r.y, this.node.setSize(r.width, r.height), this.node.centerText(), i.detail && typeof i.detail.angle == "number") {
        const h = i.detail.angle;
        if (this.node.options.rotate && (this.node.options.rotate.rotationAngle = h), this.node.textElement && typeof this.node.textElement.rotate == "function") {
          const u = this.target.bbox();
          this.node.textElement.rotate(h, u.cx, u.cy);
        } else if (this.node.nestedSvg && typeof this.node.nestedSvg.rotate == "function") {
          const u = this.target.bbox();
          this.node.nestedSvg.rotate(h, u.cx, u.cy);
        }
      }
    }
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(i) {
    this.options = { ...this.options, ...i }, this.isActive && (this.disable(), this.enable());
  }
  refresh() {
    this.isActive && (console.log("RESIZE_ROTATE_DEBUG: Refreshing handles for", this.node.id), this.disable(), this.enable());
  }
}
typeof window < "u" && (window.SVG = D.SVG);
class Hs {
  constructor(i, r = {}) {
    this.connections = /* @__PURE__ */ new Map(), this.isActive = !1, this.node = i, this.slate = i.slate, this.options = {
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
      ...r
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
      } catch (i) {
        console.warn("CONNECTOR_DEBUG: Failed to enable connector:", i);
      }
  }
  disable() {
    if (this.isActive)
      try {
        console.log(
          "CONNECTOR_DEBUG: Disabling connector for node",
          this.node.id
        ), this.disconnectAll(), this.isActive = !1, console.log("CONNECTOR_DEBUG: Connector disabled for node", this.node.id);
      } catch (i) {
        console.warn("CONNECTOR_DEBUG: Failed to disable connector:", i);
      }
  }
  ensureContainers() {
    this.options.lineContainer || (this.slate.linesContainer || (this.slate.linesContainer = this.slate.canvas.group(), console.log("CONNECTOR_DEBUG: Created global lines container")), this.options.lineContainer = this.slate.linesContainer), this.options.markerContainer || (this.slate.markersContainer || (this.slate.markersContainer = this.slate.canvas.group(), console.log("CONNECTOR_DEBUG: Created global markers container")), this.options.markerContainer = this.slate.markersContainer);
  }
  connectTo(i, r = {}) {
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
        i.id
      );
      const h = `${this.node.id}->${i.id}`;
      if (this.connections.has(h))
        return console.warn(
          "CONNECTOR_DEBUG: Connection already exists:",
          h
        ), this.connections.get(h);
      if (!this.node.svgGroup.connectable)
        return console.error(
          "CONNECTOR_DEBUG: svg.connectable.js not properly loaded or incompatible with SVG.js 3+"
        ), null;
      const u = this.node.svgGroup.connectable(
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
        i.svgGroup
      );
      if (!u)
        return console.error("CONNECTOR_DEBUG: Failed to create connectable object"), null;
      const g = {
        id: h,
        source: this.node,
        target: i,
        connectable: u,
        lineColor: r.lineColor || this.options.defaultLineColor,
        lineWidth: r.lineWidth || this.options.defaultLineWidth,
        ...r
      };
      if (g.lineColor && u.setLineColor && u.setLineColor(g.lineColor), this.connections.set(h, g), i.connector) {
        const f = `${i.id}<-${this.node.id}`;
        i.connector.connections.set(f, g);
      }
      return console.log("CONNECTOR_DEBUG: Successfully connected", h), this.options.onConnect?.(g), g;
    } catch (h) {
      return console.error("CONNECTOR_DEBUG: Failed to create connection:", h), console.error(
        "CONNECTOR_DEBUG: This might be due to SVG.js 3+ compatibility issues with svg.connectable.js"
      ), null;
    }
  }
  disconnectFrom(i) {
    const r = `${this.node.id}->${i.id}`;
    return this.disconnectById(r);
  }
  disconnectById(i) {
    try {
      const r = this.connections.get(i);
      if (!r)
        return console.warn("CONNECTOR_DEBUG: Connection not found:", i), !1;
      if (console.log("CONNECTOR_DEBUG: Disconnecting", i), r.connectable && r.connectable.line && r.connectable.line.remove(), r.connectable && r.connectable.marker && r.connectable.marker.remove(), this.connections.delete(i), r.target && r.target.connector) {
        const h = `${r.target.id}<-${this.node.id}`;
        r.target.connector.connections.delete(h);
      }
      return console.log("CONNECTOR_DEBUG: Successfully disconnected", i), this.options.onDisconnect?.(r), !0;
    } catch (r) {
      return console.error("CONNECTOR_DEBUG: Failed to disconnect:", r), !1;
    }
  }
  disconnectAll() {
    console.log(
      "CONNECTOR_DEBUG: Disconnecting all connections for node",
      this.node.id
    );
    const i = Array.from(this.connections.keys());
    for (const r of i)
      this.disconnectById(r);
  }
  getConnections() {
    return Array.from(this.connections.values());
  }
  getConnection(i) {
    const r = `${this.node.id}->${i}`;
    return this.connections.get(r) || null;
  }
  updateConnection(i, r) {
    try {
      const h = this.connections.get(i);
      return h ? (Object.assign(h, r), r.lineColor && h.connectable && h.connectable.setLineColor(r.lineColor), console.log("CONNECTOR_DEBUG: Updated connection", i), !0) : (console.warn(
        "CONNECTOR_DEBUG: Connection not found for update:",
        i
      ), !1);
    } catch (h) {
      return console.error("CONNECTOR_DEBUG: Failed to update connection:", h), !1;
    }
  }
  isEnabled() {
    return this.isActive;
  }
  updateOptions(i) {
    this.options = { ...this.options, ...i }, console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
class Wn {
  constructor(i, r) {
    this.connectionHandles = {}, this.connectionHandlesVisible = !1, this.isDragging = !1, this.wasSelectedBeforeDrag = !1, this.id = i.id || this.generateId(), this.slate = r, console.log("NODE_DEBUG: Constructor called", { id: this.id, options: i }), this.options = {
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
      ...i
    }, console.log("NODE_DEBUG: Calling createAsync for", this.id), this.createAsync();
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }
  async createAsync() {
    console.log("NODE_DEBUG: createAsync started for", this.id);
    try {
      const i = await this.slate.getViewportAsync();
      console.log("NODE_DEBUG: Got viewport for", this.id, i), this.svgGroup = i.group(), console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup), this.finishCreate();
    } catch (i) {
      console.error("NODE_DEBUG: Error in createAsync for", this.id, i);
    }
  }
  finishCreate() {
    console.log("NODE_DEBUG: finishCreate started for", this.id);
    const i = !!this.options.svgContent;
    if (console.log("NODE_DEBUG: hasSvg =", i, "for", this.id), i && (this.options.backgroundColor = "none", this.options.borderWidth = 0, console.log("NODE_DEBUG: Updated options for SVG content", this.id)), console.log("NODE_DEBUG: About to call createBackground for", this.id), this.createBackground(), i ? console.log("NODE_DEBUG: Skipping createText (SVG content) for", this.id) : (console.log("NODE_DEBUG: About to call createText for", this.id), this.createText()), console.log(
      "NODE_DEBUG: About to position node",
      this.id,
      "at",
      this.options.x,
      this.options.y
    ), this.position(this.options.x, this.options.y), this.options.svgContent) {
      const r = this.options.width, h = this.options.height, u = this.backgroundRect.x?.() ?? 0, g = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg = this.svgGroup.nested().size(r, h).move(u, g), this.nestedSvg.svg(this.options.svgContent), setTimeout(() => {
        const f = this.nestedSvg.children()[0];
        if (f) {
          let m = f.bbox();
          console.log("Delayed bbox:", m, "Node size:", r, h), (m.width <= 0 || m.height <= 0) && (m = this.calculatePathBounds(this.options.svgContent, r, h), console.log("Calculated bounds:", m)), m.width > 0 && m.height > 0 ? (this.nestedSvg.viewbox(m.x, m.y, m.width, m.height), this.nestedSvg.node.setAttribute(
            "preserveAspectRatio",
            "xMidYMid meet"
          ), console.log(
            `Set viewbox(${m.x}, ${m.y}, ${m.width}, ${m.height}) with preserveAspectRatio="xMidYMid meet"`
          )) : (console.log("Invalid bounds, trying default viewbox approach"), this.nestedSvg.viewbox(0, 0, 24, 24), this.nestedSvg.node.setAttribute(
            "preserveAspectRatio",
            "xMidYMid meet"
          ));
        }
      }, 10);
    }
    this.resizeRotate = new $n(this, this.options.resizeRotate), this.connector = new Hs(this, this.options.connector), this.options.allowDrag && !this.options.isLocked && this.makeDraggable(), this.setupSelectionBehavior(), typeof this.options.customRender == "function" && this.options.customRender(this.svgGroup, this.options), i || this.centerTextInitial(), console.log("NODE_DEBUG: finishCreate continuing for", this.id);
  }
  createBackground() {
    console.log(
      "NODE_DEBUG: createBackground called for",
      this.id,
      "shape:",
      this.options.shape
    );
    const { width: i, height: r, backgroundColor: h, borderColor: u, borderWidth: g, shape: f } = this.options;
    switch (f) {
      case "circle":
        const m = Math.min(i, r) / 2;
        this.backgroundRect = this.svgGroup.circle(m * 2).fill(h).stroke({ color: u, width: g });
        break;
      case "ellipse":
        this.backgroundRect = this.svgGroup.ellipse(i, r).fill(h).stroke({ color: u, width: g });
        break;
      default:
        this.backgroundRect = this.svgGroup.rect(i, r).fill(h).stroke({ color: u, width: g }).radius(4);
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
    const { text: i, fontSize: r, fontFamily: h, fontColor: u, textOpacity: g } = this.options;
    this.textElement = this.svgGroup.text(i).font({
      family: h,
      size: r,
      fill: u,
      opacity: g
    }), console.log(
      "NODE_DEBUG: createText completed for",
      this.id,
      "textElement:",
      this.textElement
    ), this.centerText();
  }
  centerText() {
    if (!this.textElement) return;
    const { width: i, height: r, textXAlign: h, textYAlign: u, textOffset: g } = this.options, f = this.textElement.bbox(), m = this.backgroundRect.x?.() ?? 0, y = this.backgroundRect.y?.() ?? 0;
    let _ = m + (g.x || 0), z = y + (g.y || 0);
    switch (h) {
      case "left":
        _ += 5;
        break;
      case "right":
        _ += i - f.width - 5;
        break;
      default:
        _ += (i - f.width) / 2;
        break;
    }
    switch (u) {
      case "top":
        z += 5;
        break;
      case "bottom":
        z += r - f.height - 5;
        break;
      default:
        z += (r - f.height) / 2;
        break;
    }
    this.textElement.move(_, z);
  }
  makeDraggable() {
    this.svgGroup.draggable(), this.svgGroup.on("dragstart.node", (i) => {
      console.log("DRAG_DEBUG: Drag started on", this.id), this.toFront(), this.slate.getSelectedNodes().includes(this) ? console.log(
        "SELECTION_DEBUG: Drag started on already selected node",
        this.id
      ) : (console.log(
        "SELECTION_DEBUG: Drag started on unselected node",
        this.id,
        "- selecting it"
      ), this.slate.selectNodes([this], !1)), this.isDragging = !0, this.wasSelectedBeforeDrag = !0, this.slate.disableNodeResizeRotate(this);
    }), this.svgGroup.on("dragend.node", (i) => {
      console.log("DRAG_DEBUG: Drag ended on", this.id);
      const r = this.svgGroup.bbox();
      this.options.x = r.x, this.options.y = r.y, setTimeout(() => {
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
    }), this.svgGroup.on("dragmove.node", (i) => {
      this.isDragging = !0;
    });
  }
  position(i, r, h, u, g) {
    console.log(
      "NODE_DEBUG: position called for",
      this.id,
      "x:",
      i,
      "y:",
      r,
      "duration:",
      g
    ), this.options.x = i, this.options.y = r, g && g > 0 ? this.svgGroup.animate(g, u || "-").move(i, r).after(h || (() => {
    })) : this.svgGroup.move(i, r), console.log(
      "NODE_DEBUG: position completed for",
      this.id,
      "svgGroup bbox:",
      this.svgGroup ? this.svgGroup.bbox() : "no group"
    ), h && h();
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
  setText(i) {
    this.textElement && (this.options.text = i, this.textElement.text(i), this.centerText());
  }
  setSize(i, r) {
    if (this.options.width = i, this.options.height = r, this.backgroundRect instanceof D.Rect)
      this.backgroundRect.size(i, r);
    else if (this.backgroundRect instanceof D.Circle) {
      const h = Math.min(i, r) / 2;
      this.backgroundRect.radius(h);
    } else this.backgroundRect instanceof D.Ellipse && this.backgroundRect.size(i, r);
    if (this.nestedSvg) {
      const h = this.backgroundRect.x?.() ?? 0, u = this.backgroundRect.y?.() ?? 0;
      this.nestedSvg.size(i, r).move(h, u);
    }
    this.centerText();
  }
  setColors(i, r) {
    i && (this.options.backgroundColor = i, this.backgroundRect.fill(i)), r && (this.options.borderColor = r, this.backgroundRect.stroke({ color: r }));
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
  setRotation(i) {
    this.options.rotate.rotationAngle = i, this.svgGroup.rotate(i);
  }
  getRotation() {
    try {
      const i = this.backgroundRect.transform();
      if (i && typeof i.rotation < "u")
        return i.rotation;
      if (i && typeof i.rotate < "u")
        return i.rotate;
    } catch {
    }
    return this.options.rotate?.rotationAngle || 0;
  }
  // Connector functionality
  enableConnector() {
    this.connector.enable();
  }
  enableConnectorWithInteractive(i) {
    console.log(
      "NODE_DEBUG: enableConnectorWithInteractive called for",
      this.id
    ), this.connector.enable();
    const r = this.svgGroup;
    if (r && typeof r.connectable == "function") {
      if (console.log(
        "NODE_DEBUG: svg.connectable.js detected, setting up interactive features for",
        this.id
      ), i)
        try {
          const h = r.connectable({}, r);
          h && typeof h.makeInteractive == "function" ? (console.log(
            "NODE_DEBUG: makeInteractive method available, enabling connection handles for",
            this.id
          ), this.enableConnectionHandles(), h.makeInteractive(), h.connector && h.connector.remove && h.connector.remove()) : console.log(
            "NODE_DEBUG: makeInteractive method not available for",
            this.id
          );
        } catch (h) {
          console.warn(
            "NODE_DEBUG: Error testing svg.connectable.js makeInteractive:",
            h
          );
        }
    } else
      console.log("NODE_DEBUG: svg.connectable.js not available for", this.id);
  }
  disableConnector() {
    this.connector.disable();
  }
  connectTo(i, r) {
    return this.connector.connectTo(i, r);
  }
  disconnectFrom(i) {
    return this.connector.disconnectFrom(i);
  }
  disconnectAll() {
    this.connector.disconnectAll();
  }
  getConnections() {
    return this.connector.getConnections();
  }
  getConnection(i) {
    return this.connector.getConnection(i);
  }
  isConnectorEnabled() {
    return this.connector.isEnabled();
  }
  centerTextInitial() {
    if (!this.textElement) return;
    const { width: i, height: r, textXAlign: h, textYAlign: u, textOffset: g } = this.options, f = this.textElement.bbox(), m = this.backgroundRect.x?.() ?? 0, y = this.backgroundRect.y?.() ?? 0;
    let _ = m + (g.x || 0), z = y + (g.y || 0);
    switch (h) {
      case "left":
        _ += 5;
        break;
      case "right":
        _ += i - f.width - 5;
        break;
      default:
        _ += (i - f.width) / 2;
        break;
    }
    switch (u) {
      case "top":
        z += 5;
        break;
      case "bottom":
        z += r - f.height - 5;
        break;
      default:
        z += (r - f.height) / 2;
        break;
    }
    this.textElement.move(_, z);
  }
  calculatePathBounds(i, r, h) {
    const u = i.match(/viewBox=["']([^"']+)["']/);
    if (u) {
      const m = u[1].split(/\s+/).map(Number);
      if (m.length === 4)
        return {
          x: m[0],
          y: m[1],
          width: m[2],
          height: m[3]
        };
    }
    const g = i.match(/width=["']([^"']+)["']/), f = i.match(/height=["']([^"']+)["']/);
    if (g && f) {
      const m = parseInt(g[1]), y = parseInt(f[1]);
      if (!isNaN(m) && !isNaN(y))
        return { x: 0, y: 0, width: m, height: y };
    }
    return { x: 0, y: 0, width: 24, height: 24 };
  }
  // Selection Management
  setupSelectionBehavior() {
    let i = null;
    const r = 5;
    this.svgGroup.on("pointerdown", (h) => {
      if (this.isResizeRotateHandle(h.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        );
        return;
      }
      i = {
        x: h.clientX || h.detail?.x || 0,
        y: h.clientY || h.detail?.y || 0
      };
    }), this.svgGroup.on("pointerup", (h) => {
      if (this.isResizeRotateHandle(h.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        ), i = null;
        return;
      }
      if (i) {
        const u = {
          x: h.clientX || h.detail?.x || 0,
          y: h.clientY || h.detail?.y || 0
        };
        if (Math.sqrt(
          Math.pow(u.x - i.x, 2) + Math.pow(u.y - i.y, 2)
        ) <= r) {
          console.log(
            "SELECTION_DEBUG: Node clicked (position-based detection)",
            this.id
          );
          const f = h.ctrlKey || h.metaKey;
          this.slate.selectNodes([this], f);
        }
        i = null;
      }
    });
  }
  // Helper method to identify resize/rotate handles
  isResizeRotateHandle(i) {
    if (!i || !i.classList) return !1;
    const r = [
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
    for (const h of r)
      if (i.classList.contains(h))
        return !0;
    return !!(i.getAttribute && (i.getAttribute("data-handle") || i.getAttribute("data-resize") || i.getAttribute("data-rotate")));
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
    const i = 8, r = "#007cff", h = "#ffffff", u = 2, g = {
      top: { x: 0, y: -i - 5 },
      right: { x: i + 5, y: 0 },
      bottom: { x: 0, y: i + 5 },
      left: { x: -i - 5, y: 0 }
    };
    Object.entries(g).forEach(([f, m]) => {
      if (!this.connectionHandles.container) return;
      const y = this.connectionHandles.container.circle(i * 2).fill(r).stroke({ color: h, width: u }).addClass(`connection-handle connection-handle-${f}`);
      y.node.style.cursor = "pointer", this.connectionHandles[f] = y, y.on(
        "mouseenter",
        () => this.showConnectionPreview(
          f
        )
      ), y.on("mouseleave", () => this.hideConnectionPreview()), y.on("click", (_) => {
        _.stopPropagation(), console.log(
          `CONNECTION_HANDLES_DEBUG: ${f} handle clicked on`,
          this.id
        ), this.createConnectedNode(
          f
        );
      });
    }), this.connectionHandles.container && this.connectionHandles.container.hide(), this.updateConnectionHandlePositions();
  }
  updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;
    const i = this.backgroundRect.bbox(), r = this.backgroundRect.screenCTM(), u = this.backgroundRect.root().screenCTM().inverseO().multiplyO(r), g = ([k, O], { a: p, b, c: E, d: B, e: H, f: q }) => [k * p + O * E + H, k * b + O * B + q], f = i.x + i.width / 2, m = i.y + i.height / 2, y = 35, _ = 20, z = {
      top: [f, i.y - y],
      right: [i.x + i.width + _, m],
      bottom: [f, i.y + i.height + _],
      left: [i.x - _, m]
    };
    Object.entries(z).forEach(([k, O]) => {
      const p = this.connectionHandles[k];
      if (p) {
        const [b, E] = g(O, u);
        p.center(b, E);
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
  showConnectionPreview(i) {
    if (this.connectionPreview?.container)
      return;
    console.log(
      "CONNECTION_HANDLES_DEBUG: Showing preview for",
      i,
      "on",
      this.id
    ), this.hideConnectionPreview();
    const r = this.svgGroup.root();
    this.connectionPreview = {
      container: r.group().attr("pointer-events", "none")
    };
    const h = this.options.width, u = this.options.height, g = 75, f = this.getRotation(), m = this.backgroundRect.rbox(this.backgroundRect.root()), y = m.cx, _ = m.cy, z = this.connectionHandles[i];
    if (!z) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", i);
      return;
    }
    const k = z.bbox(), O = {
      x: k.x + k.width / 2,
      y: k.y + k.height / 2
    }, p = O.x - y, b = O.y - _, E = Math.sqrt(p * p + b * b), B = p / E, H = b / E, q = this.backgroundRect.bbox(), ft = q.x + q.width / 2, Q = q.y + q.height / 2, K = this.backgroundRect.screenCTM(), C = this.backgroundRect.root().screenCTM().inverseO().multiplyO(K), A = C.inverse(), nt = B * A.a + H * A.c, ct = B * A.b + H * A.d;
    let L, rt;
    const it = Math.abs(nt);
    Math.abs(ct) > it ? ct < 0 ? (L = ft, rt = q.y) : (L = ft, rt = q.y + q.height) : nt < 0 ? (L = q.x, rt = Q) : (L = q.x + q.width, rt = Q);
    const V = ([T, G], { a: wt, b: P, c: xt, d: Nt, e: Ht, f: Lt }) => [T * wt + G * xt + Ht, T * P + G * Nt + Lt], [st, j] = V([L, rt], C), U = Math.sqrt(
      Math.pow(st - y, 2) + Math.pow(j - _, 2)
    ), X = U, at = U + g + X, tt = y + B * at, Z = _ + H * at, w = tt - h / 2, Y = Z - u / 2;
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      w,
      Y,
      h,
      u,
      f
      // Pass rotation angle to preview
    );
    const ht = U + g - E, pt = {
      x: O.x + B * ht,
      y: O.y + H * ht
    };
    this.connectionPreview.connector = this.connectionPreview.container.line(O.x, O.y, pt.x, pt.y).stroke({ color: "#007cff", width: 2, opacity: 0.7 }).attr("pointer-events", "none"), this.addArrowheadToConnector(
      this.connectionPreview.container,
      O,
      pt
    );
  }
  createPreviewShape(i, r, h, u, g, f = 0) {
    let m;
    const y = this.options.backgroundColor || "#007cff", _ = "#ffffff", z = 2, k = 0.6, O = r + u / 2, p = h + g / 2;
    switch (this.options.shape) {
      case "circle":
        const b = Math.min(u, g) / 2;
        m = i.circle(b * 2).center(O, p).fill(y).stroke({ color: _, width: z }).opacity(k), f !== 0 && m.rotate(f, O, p);
        break;
      case "ellipse":
        m = i.ellipse(u, g).center(O, p).fill(y).stroke({ color: _, width: z }).opacity(k), f !== 0 && m.rotate(f, O, p);
        break;
      default:
        if (this.options.svgContent) {
          m = i.rect(u, g).move(r, h).fill("none").stroke({ color: _, width: z }).opacity(k).radius(4);
          const E = i.nested().size(u, g).move(r, h);
          E.svg(this.options.svgContent), setTimeout(() => {
            const B = E.children()[0];
            if (B) {
              let H = B.bbox();
              (H.width <= 0 || H.height <= 0) && (H = this.calculatePathBounds(
                this.options.svgContent,
                u,
                g
              )), H.width > 0 && H.height > 0 && (E.viewbox(H.x, H.y, H.width, H.height), E.node.setAttribute(
                "preserveAspectRatio",
                "xMidYMid meet"
              )), B.fill(y).opacity(k);
            }
          }, 1), E.attr("pointer-events", "none"), f !== 0 && (m.rotate(f, O, p), E.rotate(f, O, p));
        } else
          m = i.rect(u, g).move(r, h).fill(y).stroke({ color: _, width: z }).opacity(k).radius(4), f !== 0 && m.rotate(f, O, p);
        break;
    }
    return m.attr("pointer-events", "none");
  }
  addArrowheadToConnector(i, r, h) {
    const u = h.x - r.x, g = h.y - r.y, f = Math.sqrt(u * u + g * g);
    if (f === 0) return;
    const m = u / f, y = g / f, _ = 12, z = 6, k = h.x, O = h.y, p = k - m * _, b = O - y * _, E = -y * z, B = m * z, H = [
      [k, O],
      [p + E, b + B],
      [p - E, b - B],
      [k, O]
    ];
    i.polygon(H).fill("#007cff").opacity(0.8).attr("pointer-events", "none");
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
  getNodeEdgePoint(i, r) {
    const h = i.x + i.width / 2, u = i.y + i.height / 2;
    switch (r) {
      case "top":
        return { x: h, y: i.y };
      case "right":
        return { x: i.x + i.width, y: u };
      case "bottom":
        return { x: h, y: i.y + i.height };
      case "left":
        return { x: i.x, y: u };
    }
  }
  createConnectedNode(i) {
    console.log(
      "CONNECTION_HANDLES_DEBUG: Creating connected node in direction",
      i,
      "from",
      this.id
    );
    try {
      const r = this.options.width, h = this.options.height, u = 75, g = this.getRotation(), f = g * Math.PI / 180;
      let m = 0, y = 0;
      switch (i) {
        case "top":
          m = 0, y = -1;
          break;
        case "right":
          m = 1, y = 0;
          break;
        case "bottom":
          m = 0, y = 1;
          break;
        case "left":
          m = -1, y = 0;
          break;
      }
      const _ = m * Math.cos(f) - y * Math.sin(f), z = m * Math.sin(f) + y * Math.cos(f), k = this.backgroundRect.rbox(this.backgroundRect.root()), O = k.cx, p = k.cy, b = this.backgroundRect.bbox(), E = b.x + b.width / 2, B = b.y + b.height / 2;
      let H, q;
      switch (i) {
        case "top":
          H = E, q = b.y;
          break;
        case "right":
          H = b.x + b.width, q = B;
          break;
        case "bottom":
          H = E, q = b.y + b.height;
          break;
        case "left":
          H = b.x, q = B;
          break;
      }
      const ft = this.backgroundRect.screenCTM(), K = this.backgroundRect.root().screenCTM().inverseO().multiplyO(ft), bt = ([U, X], { a: at, b: tt, c: Z, d: w, e: Y, f: et }) => [U * at + X * Z + Y, U * tt + X * w + et], [C, A] = bt([H, q], K), nt = Math.sqrt(
        Math.pow(C - O, 2) + Math.pow(A - p, 2)
      ), ct = nt, L = nt + u + ct, rt = O + _ * L, it = p + z * L, F = rt - r / 2, V = it - h / 2, st = this.cloneNodeOptions(F, V, g), j = this.slate.addNode(st);
      if (!j) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }
      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        j.id,
        "at",
        F,
        V
      ), this.hideConnectionPreview(), setTimeout(() => {
        this.connectToNode(j);
      }, 100);
    } catch (r) {
      console.error(
        "CONNECTION_HANDLES_DEBUG: Error creating connected node:",
        r
      );
    }
  }
  cloneNodeOptions(i, r, h) {
    const u = "node_" + Math.random().toString(36).substr(2, 9), g = {
      ...this.options,
      id: u,
      x: i,
      y: r,
      text: `Node ${u.split("_")[1]}`
      // Give it a different default text
      // Keep the same visual properties (shape, color, size, etc.)
    };
    return h !== void 0 && h !== 0 && (g.rotate = {
      ...g.rotate,
      rotationAngle: h
    }), g;
  }
  connectToNode(i) {
    this.connector.isEnabled() || (console.log("CONNECTION_HANDLES_DEBUG: Enabling connector for", this.id), this.connector.enable()), console.log(
      "CONNECTION_HANDLES_DEBUG: Connecting",
      this.id,
      "to",
      i.id
    );
    const r = this.connector.connectTo(i);
    r ? console.log(
      "CONNECTION_HANDLES_DEBUG: Successfully created connection",
      r.id
    ) : console.error("CONNECTION_HANDLES_DEBUG: Failed to create connection");
  }
}
class Ls {
  constructor(i) {
    this.nodes = /* @__PURE__ */ new Map(), this.slate = i;
  }
  add(i = {}) {
    if (i.id || (i.id = this.generateId()), this.nodes.has(i.id))
      return console.warn(`Node with id "${i.id}" already exists`), this.nodes.get(i.id);
    const r = new Wn(i, this.slate);
    return this.nodes.set(r.id, r), r;
  }
  remove(i) {
    const r = this.nodes.get(i);
    return r ? (r.remove(), this.nodes.delete(i), !0) : !1;
  }
  one(i) {
    return this.nodes.get(i);
  }
  get allNodes() {
    return Array.from(this.nodes.values());
  }
  clear() {
    this.allNodes.forEach((i) => i.remove()), this.nodes.clear();
  }
  moveNodes(i, r = {}) {
    i.data && Array.isArray(i.data.nodes) && i.data.nodes.forEach((h) => {
      const u = this.one(h.id);
      if (u) {
        const g = r.animate ? i.data.dur || 500 : 0;
        u.position(h.x, h.y, void 0, void 0, g);
      }
    });
  }
  addRelationship(i) {
    console.log("Adding relationship:", i);
  }
  removeRelationship(i) {
    console.log("Removing relationship:", i);
  }
  generateId() {
    return "node_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
  }
  count() {
    return this.nodes.size;
  }
  forEach(i) {
    this.nodes.forEach(i);
  }
  filter(i) {
    return this.allNodes.filter(i);
  }
  find(i) {
    return this.allNodes.find(i);
  }
}
class Us {
  constructor(i) {
    this.slate = i;
  }
  onZoom(i) {
    if (this.slate.options.followMe) {
      const r = this.slate.options.viewPort.originalWidth / i.data.zoomLevel * 100;
      console.log("Zoom to:", r + "%");
    }
  }
  onNodePositioned(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && r.position(
      i.data.location.x,
      i.data.location.y,
      () => {
      },
      i.data.easing,
      i.data.duration || 500
    );
  }
  onNodeLinkRemoved(i) {
    const r = this.slate.nodes.one(i.data.id);
    r?.links && r.links.unset(!1);
  }
  onNodeLinkAdded(i) {
    const r = this.slate.nodes.one(i.data.id);
    r?.links && r.links.set(i, !1);
  }
  onNodeUnlocked(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && r.unlock();
  }
  onNodeLocked(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && r.lock();
  }
  onNodeBehaviorChanged(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && i.data.behaviorChanges.forEach((h) => {
      typeof h.value == "object" ? (r.options[h.name] = h.value.val, Object.keys(h.value).forEach((u) => {
        u !== "val" && (r.options[u] = h.value[u]);
      })) : r.options[h.name] = h.value;
    });
  }
  onNodeToBack(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && r.toBack();
  }
  onNodeToFront(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && r.toFront();
  }
  onNodeShapeChanged(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && (Object.assign(r.options, i.data), console.log("Shape changed for node:", i.data.id));
  }
  onNodeAdded(i) {
    if (i.data?.multiSelectCopy)
      console.log("Multi-select copy:", i.data);
    else if (i.data.id)
      this.slate.nodes.one(i.data.id) && this.slate.nodes.add({
        ...i.data.options,
        x: i.data.targetXPos || 100,
        y: i.data.targetYPos || 100
      });
    else {
      let r = i.data.nodeOptions;
      Array.isArray(r) || (r = [r]), r.forEach((h) => {
        this.slate.nodes.one(h.id) || this.slate.nodes.add(h);
      });
    }
  }
  onNodeImageChanged(i) {
    this.slate.nodes.one(i.data.id) && console.log("Image changed for node:", i.data.id);
  }
  onNodeDeleted(i) {
    this.slate.nodes.remove(i.data.id);
  }
  onNodeResized(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && (Object.assign(r.options, i.data), r.setSize(i.data.width, i.data.height));
  }
  onNodeRotated(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && (r.options.textOffset = i.data.textOffset, Object.assign(r.options, i.data), console.log("Node rotated:", i.data.id));
  }
  onNodeColorChanged(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && r.setColors(i.data.backgroundColor, i.data.borderColor);
  }
  onNodeTextChanged(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && (r.setText(i.data.text), r.options.fontSize = i.data.fontSize, r.options.fontFamily = i.data.fontFamily, r.options.fontColor = i.data.fontColor, r.options.textOpacity = i.data.textOpacity, r.options.textXAlign = i.data.textXAlign, r.options.textYAlign = i.data.textYAlign);
  }
  onNodeAITextChanged(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && (r.options.ai = { ...i.data.ai, ...r.options.ai });
  }
  addRelationship(i) {
    this.slate.nodes.addRelationship(i.data);
  }
  removeRelationship(i) {
    this.slate.nodes.removeRelationship(i.data);
  }
  onNodesMove(i) {
    this.slate.nodes.moveNodes(i, { animate: i.data.dur > 0 });
  }
  onNodeEffectChanged(i) {
    this.slate.nodes.one(i.data.id) && console.log("Effect changed for node:", i.data.id);
  }
  onNodeBorderPropertiesChanged(i) {
    const r = this.slate.nodes.one(i.data.id);
    r && (r.options.borderColor = i.data.borderColor, r.options.borderWidth = i.data.borderWidth, r.setColors(void 0, i.data.borderColor));
  }
  onLinePropertiesChanged(i) {
    (Array.isArray(i.data) ? i.data : [i.data]).forEach((h) => {
      const u = this.slate.nodes.one(h.id);
      u && Object.assign(u.options, h.options);
    });
  }
  onFollowMeChanged(i) {
    this.slate.options.followMe = i.data?.followMe;
  }
  onCanvasMove(i) {
    this.slate.options.followMe && console.log("Canvas move:", i.data);
  }
  onSlateThemeChanged(i) {
    this.slate.options.themeId = i.data?.theme?._id, i.data?.theme && console.log("Theme changed:", i.data.theme);
  }
  onSlateLayoutTypeChanged(i) {
    i.data.layoutType != null && (this.slate.options.layoutType = i.data.layoutType), i.data.disableAutoLayoutOfManuallyPositionedNodes != null && (this.slate.options.disableAutoLayoutOfManuallyPositionedNodes = i.data.disableAutoLayoutOfManuallyPositionedNodes);
  }
  onSlateBackgroundEffectChanged(i) {
    this.slate.options.containerStyle.backgroundEffect = i.data.effect, console.log("Background effect changed:", i.data.effect);
  }
  onSlateBackgroundImageChanged(i) {
    if (i.data.bg)
      this.slate.options.containerStyle.backgroundImage = i.data.bg.url, this.slate.options.containerStyle.backgroundSize = i.data.bg.size;
    else {
      const r = this.slate.options.containerStyle.prevBackgroundColor || "#fff";
      this.slate.options.containerStyle.backgroundColor = r, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
    }
  }
  onSlateBackgroundColorChanged(i) {
    this.slate.options.containerStyle.backgroundColor = i.data.color, this.slate.options.containerStyle.backgroundColorAsGradient = i.data.asGradient, this.slate.options.containerStyle.backgroundGradientType = i.data.gradientType, this.slate.options.containerStyle.backgroundGradientColors = i.data.gradientColors, this.slate.options.containerStyle.backgroundGradientStrategy = i.data.gradientStrategy, this.slate.options.containerStyle.backgroundImage = null, this.slate.options.containerStyle.backgroundEffect = null;
  }
  onLineColorChanged(i) {
    this.slate.options.defaultLineColor = i.data.color, this.slate.nodes.allNodes.forEach((r) => {
      r.options.lineColor = i.data.color, r.relationships?.associations && (r.relationships.associations.forEach((h) => {
        h.lineColor = i.data.color;
      }), r.relationships.refreshOwnRelationships());
    });
  }
  onSlateAISet(i) {
    this.slate.options.ai = {
      ...this.slate.options.ai || {},
      ...i.data
    };
  }
  onSlateNameChanged(i) {
    this.slate.options.name = i.data.name;
  }
  onSlateDescriptionChanged(i) {
    this.slate.options.description = i.data.description;
  }
  onSlateShowGridChanged(i) {
    this.slate.options.viewPort.showGrid = i.data.showGrid, i.data.showGrid ? console.log("Show grid") : console.log("Hide grid");
  }
  onSlateMindMapModeChanged(i) {
    this.slate.options.mindMapMode = i.data.mindMapMode;
  }
  onSlateAutoResizeNodesBasedOnTextChanged(i) {
    this.slate.options.autoResizeNodesBasedOnText = i.data.autoResizeNodesBasedOnText;
  }
  onSlateTagsAndTemplateMarkdownChanged(i) {
    this.slate.options.tags = i.data.tags, this.slate.options.templateMarkdown = i.data.templateMarkdown, this.slate.options.templatePrompt = i.data.templatePrompt;
  }
  onSlateTemplateChanged(i) {
    this.slate.options.isTemplate = i.data.isTemplate;
  }
  onSlateSnapToObjectsChanged(i) {
    this.slate.options.viewPort.snapToObjects = i.data.snapToObjects;
  }
  onSlateFollowMeChanged(i) {
    this.slate.options.followMe = i.data.followMe;
  }
  onSlateHuddleChanged(i) {
    i.data.huddleType != null && (this.slate.options.huddleType = i.data.huddleType), i.data.huddleEnabled != null && (this.slate.options.huddleEnabled = i.data.huddleEnabled);
  }
}
var ye = function(i) {
  return i.touches || [{
    clientX: i.clientX,
    clientY: i.clientY
  }];
};
D.extend(D.Svg, {
  panZoom: function(i) {
    var r, h, u, g, f, m, y, _, z, k, O, p, b = this;
    if (this.off(".panZoom"), i === !1) return this;
    i = (r = i) != null ? r : {};
    var E = (h = i.zoomFactor) != null ? h : 2, B = (u = i.zoomMin) != null ? u : Number.MIN_VALUE, H = (g = i.zoomMax) != null ? g : Number.MAX_VALUE, q = (f = i.wheelZoom) != null ? f : !0, ft = (m = i.pinchZoom) != null ? m : !0, Q = (y = i.panning) != null ? y : !0, K = (_ = i.panButton) != null ? _ : 0, bt = (z = i.oneFingerPan) != null ? z : !1, C = (k = i.margins) != null ? k : !1, A = (O = i.wheelZoomDeltaModeLinePixels) != null ? O : 17, nt = (p = i.wheelZoomDeltaModeScreenPixels) != null ? p : 53, ct, L, rt = !1, it = this.viewbox(), F = function(w) {
      if (!C) return w;
      var Y = C.top, et = C.left, ht = C.bottom, pt = C.right, T = b.attr(["width", "height"]), G = T.width, wt = T.height, P = b.node.preserveAspectRatio.baseVal, xt = 0, Nt = 0, Ht = 0, Lt = 0;
      if (P.align !== P.SVG_PRESERVEASPECTRATIO_NONE) {
        var Vt = G / wt, qt = it.width / it.height;
        if (qt !== Vt) {
          var be = P.meetOrSlice !== P.SVG_MEETORSLICE_SLICE, ae = Vt > qt ? "width" : "height", we = ae === "width", ve = be && we || !be && !we, he = ve ? Vt / qt : qt / Vt, St = w[ae] - w[ae] * he;
          ve ? P.align === P.SVG_PRESERVEASPECTRATIO_XMIDYMIN || P.align === P.SVG_PRESERVEASPECTRATIO_XMIDYMID || P.align === P.SVG_PRESERVEASPECTRATIO_XMIDYMAX ? (xt = St / 2, Nt = -St / 2) : P.align === P.SVG_PRESERVEASPECTRATIO_XMINYMIN || P.align === P.SVG_PRESERVEASPECTRATIO_XMINYMID || P.align === P.SVG_PRESERVEASPECTRATIO_XMINYMAX ? Nt = -St : (P.align === P.SVG_PRESERVEASPECTRATIO_XMAXYMIN || P.align === P.SVG_PRESERVEASPECTRATIO_XMAXYMID || P.align === P.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (xt = St) : P.align === P.SVG_PRESERVEASPECTRATIO_XMINYMID || P.align === P.SVG_PRESERVEASPECTRATIO_XMIDYMID || P.align === P.SVG_PRESERVEASPECTRATIO_XMAXYMID ? (Ht = St / 2, Lt = -St / 2) : P.align === P.SVG_PRESERVEASPECTRATIO_XMINYMIN || P.align === P.SVG_PRESERVEASPECTRATIO_XMIDYMIN || P.align === P.SVG_PRESERVEASPECTRATIO_XMAXYMIN ? Lt = -St : (P.align === P.SVG_PRESERVEASPECTRATIO_XMINYMAX || P.align === P.SVG_PRESERVEASPECTRATIO_XMIDYMAX || P.align === P.SVG_PRESERVEASPECTRATIO_XMAXYMAX) && (Ht = St);
        }
      }
      var xe = it.width + it.x - et - xt, _e = it.x + pt - w.width - Nt, Ee = it.height + it.y - Y - Ht, Ce = it.y + ht - w.height - Lt;
      return w.x = Math.min(xe, Math.max(_e, w.x)), w.y = Math.min(Ee, Math.max(Ce, w.y)), w;
    }, V = function(w) {
      w.preventDefault();
      var Y;
      switch (w.deltaMode) {
        case 1:
          Y = w.deltaY * A;
          break;
        case 2:
          Y = w.deltaY * nt;
          break;
        default:
          Y = w.deltaY;
          break;
      }
      var et = Math.pow(1 + E, -1 * Y / 100) * this.zoom(), ht = this.point(w.clientX, w.clientY);
      if (et > H && (et = H), et < B && (et = B), this.dispatch("zoom", {
        level: et,
        focus: ht
      }).defaultPrevented)
        return this;
      if (this.zoom(et, ht), C) {
        var pt = F(this.viewbox());
        this.viewbox(pt);
      }
    }, st = function Z(w) {
      if (L = ye(w), L.length < 2) {
        Q && bt && X.call(this, w);
        return;
      }
      Q && bt && at.call(this, w), w.preventDefault(), !this.dispatch("pinchZoomStart", {
        event: w
      }).defaultPrevented && (this.off("touchstart.panZoom", Z), rt = !0, D.on(document, "touchmove.panZoom", U, this, {
        passive: !1
      }), D.on(document, "touchend.panZoom", j, this, {
        passive: !1
      }));
    }, j = function Z(w) {
      w.preventDefault();
      var Y = ye(w);
      Y.length > 1 || (rt = !1, this.dispatch("pinchZoomEnd", {
        event: w
      }), D.off(document, "touchmove.panZoom", U), D.off(document, "touchend.panZoom", Z), this.on("touchstart.panZoom", st), Y.length && Q && bt && X.call(this, w));
    }, U = function(w) {
      w.preventDefault();
      var Y = ye(w), et = this.zoom(), ht = Math.sqrt(Math.pow(L[0].clientX - L[1].clientX, 2) + Math.pow(L[0].clientY - L[1].clientY, 2)), pt = Math.sqrt(Math.pow(Y[0].clientX - Y[1].clientX, 2) + Math.pow(Y[0].clientY - Y[1].clientY, 2)), T = ht / pt;
      (et < B && T > 1 || et > H && T < 1) && (T = 1);
      var G = {
        x: Y[0].clientX + 0.5 * (Y[1].clientX - Y[0].clientX),
        y: Y[0].clientY + 0.5 * (Y[1].clientY - Y[0].clientY)
      }, wt = {
        x: L[0].clientX + 0.5 * (L[1].clientX - L[0].clientX),
        y: L[0].clientY + 0.5 * (L[1].clientY - L[0].clientY)
      }, P = this.point(G.x, G.y), xt = this.point(2 * G.x - wt.x, 2 * G.y - wt.y), Nt = new D.Box(this.viewbox()).transform(new D.Matrix().translate(-xt.x, -xt.y).scale(T, 0, 0).translate(P.x, P.y));
      F(Nt), this.viewbox(Nt), L = Y, this.dispatch("zoom", {
        box: Nt,
        focus: xt
      });
    }, X = function Z(w) {
      var Y = w.type.indexOf("mouse") > -1;
      Y && w.button !== K && w.which !== K + 1 || (w.preventDefault(), this.off("mousedown.panZoom", Z), L = ye(w), !rt && (this.dispatch("panStart", {
        event: w
      }), ct = {
        x: L[0].clientX,
        y: L[0].clientY
      }, D.on(document, "touchmove.panZoom mousemove.panZoom", tt, this, {
        passive: !1
      }), D.on(document, "touchend.panZoom mouseup.panZoom", at, this, {
        passive: !1
      })));
    }, at = function Z(w) {
      w.preventDefault(), D.off(document, "touchmove.panZoom mousemove.panZoom", tt), D.off(document, "touchend.panZoom mouseup.panZoom", Z), this.on("mousedown.panZoom", X), this.dispatch("panEnd", {
        event: w
      });
    }, tt = function(w) {
      w.preventDefault();
      var Y = ye(w), et = {
        x: Y[0].clientX,
        y: Y[0].clientY
      }, ht = this.point(et.x, et.y), pt = this.point(ct.x, ct.y), T = [pt.x - ht.x, pt.y - ht.y];
      if (!(!T[0] && !T[1])) {
        var G = new D.Box(this.viewbox()).transform(new D.Matrix().translate(T[0], T[1]));
        ct = et, F(G), !this.dispatch("panning", {
          box: G,
          event: w
        }).defaultPrevented && this.viewbox(G);
      }
    };
    return q && this.on("wheel.panZoom", V, this, {
      passive: !1
    }), ft && this.on("touchstart.panZoom", st, this, {
      passive: !1
    }), Q && this.on("mousedown.panZoom", X, this, {
      passive: !1
    }), this;
  }
});
class Jn {
  constructor(i, r = {}) {
    this.isEnabled = !1, this.slate = i, this.canvas = i.canvas, this.options = {
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
      ...r
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
    } catch (i) {
      console.warn("Failed to initialize pan/zoom:", i);
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
  pan(i) {
    if (this.isEnabled) {
      const r = this.canvas.viewbox();
      this.canvas.viewbox(i.x, i.y, r.width, r.height);
    }
  }
  panBy(i) {
    if (this.isEnabled) {
      const r = this.canvas.viewbox();
      this.canvas.viewbox(r.x + i.x, r.y + i.y, r.width, r.height);
    }
  }
  zoom(i, r) {
    this.isEnabled && (r ? this.canvas.zoom(i, r) : this.canvas.zoom(i));
  }
  zoomBy(i) {
    if (this.isEnabled) {
      const r = this.getZoom();
      this.canvas.zoom(r * i);
    }
  }
  zoomIn() {
    if (this.isEnabled) {
      const i = this.getZoom();
      this.canvas.zoom(i * 1.25);
    }
  }
  zoomOut() {
    if (this.isEnabled) {
      const i = this.getZoom();
      this.canvas.zoom(i * 0.8);
    }
  }
  zoomAtPoint(i, r) {
    this.isEnabled && this.canvas.zoom(i, r);
  }
  reset() {
    this.isEnabled && (this.canvas.zoom(1), this.canvas.viewbox(0, 0, this.canvas.width(), this.canvas.height()));
  }
  resetZoom() {
    this.isEnabled && this.canvas.zoom(1);
  }
  resetPan() {
    if (this.isEnabled) {
      const i = this.canvas.viewbox();
      this.canvas.viewbox(0, 0, i.width, i.height);
    }
  }
  fit() {
    if (this.isEnabled) {
      const i = this.canvas.bbox(), r = 50, h = Math.min(
        (this.canvas.width() - r * 2) / i.width,
        (this.canvas.height() - r * 2) / i.height
      );
      this.canvas.zoom(h), this.canvas.viewbox(
        i.x - r / h,
        i.y - r / h,
        this.canvas.width() / h,
        this.canvas.height() / h
      );
    }
  }
  center() {
    if (this.isEnabled) {
      const i = this.canvas.bbox(), r = this.canvas.viewbox(), h = i.cx - r.width / 2, u = i.cy - r.height / 2;
      this.canvas.viewbox(h, u, r.width, r.height);
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
      const i = this.canvas.viewbox();
      return { x: i.x, y: i.y };
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
class Qn {
  // Will hold the group resize/rotate controller
  constructor(i, r = {}) {
    if (this.selectedNodes = [], this.groupResizeRotate = null, typeof i == "string") {
      const h = document.querySelector(i);
      if (!h)
        throw new Error(`Element with selector "${i}" not found`);
      this.element = h;
    } else
      this.element = i;
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
      ...r
    }, this.init();
  }
  init() {
    this.canvas = D.SVG().addTo(this.element);
    const i = this.options.viewPort?.originalWidth || 800, r = this.options.viewPort?.originalHeight || 600;
    this.canvas.size(i, r), this.nodes = new Ls(this), this.invoker = new Us(this), this.setupSelectionHandling(), this.options.viewPort?.showCoordinates && this.setupCoordinateCallbacks(), this.panZoom = new Jn(this, this.options.panZoom), this.makeResponsive(), this.options.viewPort?.showCoordinates && setTimeout(() => this.addCoordinateDisplay(), 150);
  }
  setupCoordinateCallbacks() {
    const i = this.options.panZoom?.onPan, r = this.options.panZoom?.onZoom;
    this.options.panZoom || (this.options.panZoom = {}), this.options.panZoom.onPan = (h) => {
      this.updateCoordinateDisplay(), i && i(h);
    }, this.options.panZoom.onZoom = (h) => {
      this.updateCoordinateDisplay(), r && r(h);
    };
  }
  addCoordinateDisplay() {
    console.log("COORD_DEBUG: Starting coordinate display creation");
    const i = document.createElement("div");
    i.id = "slate-coordinates", i.style.cssText = `
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
    `, this.element.style.position = this.element.style.position || "relative", this.element.appendChild(i), console.log(
      "COORD_DEBUG: Coordinate display element created and added to DOM"
    ), console.log("COORD_DEBUG: Element style:", i.style.cssText), console.log("COORD_DEBUG: Parent element:", this.element), i.textContent = "x: 0, y: 0, zoom: 1.00", this.updateCoordinateDisplay(), this.startCoordinatePolling();
  }
  startCoordinatePolling() {
    console.log("COORD_DEBUG: Starting coordinate polling"), setInterval(() => {
      this.updateCoordinateDisplay();
    }, 200);
  }
  updateCoordinateDisplay() {
    const i = this.element.querySelector(
      "#slate-coordinates"
    );
    if (!i) {
      console.log("COORD_DEBUG: No coordinate display element found in DOM");
      return;
    }
    try {
      let r = { x: 0, y: 0 }, h = 1;
      if (this.panZoom && this.panZoom.isInitialized())
        r = this.getPan(), h = this.getZoom(), console.log(
          "COORD_DEBUG: Got values from panZoom - pan:",
          r,
          "zoom:",
          h
        );
      else {
        const g = this.canvas.viewbox();
        r = { x: g.x, y: g.y }, h = this.canvas.attr("width") / g.width || 1, console.log(
          "COORD_DEBUG: Got fallback values from viewBox - pan:",
          r,
          "zoom:",
          h
        );
      }
      const u = `x: ${Math.round(r.x)}, y: ${Math.round(
        r.y
      )}, zoom: ${h.toFixed(2)}`;
      i.textContent = u, Math.random() < 0.1 && console.log("COORD_DEBUG: Updated coordinates to:", u);
    } catch (r) {
      console.error("COORD_DEBUG: Error updating coordinates:", r), i.textContent = "x: ?, y: ?, zoom: ?";
    }
  }
  makeResponsive() {
    const i = this.options.viewPort?.originalWidth || 800, r = this.options.viewPort?.originalHeight || 600;
    this.canvas.viewbox(0, 0, i, r);
  }
  addNode(i = {}) {
    return this.nodes.add(i);
  }
  removeNode(i) {
    return this.nodes.remove(i);
  }
  getNode(i) {
    return this.nodes.one(i);
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
  pan(i) {
    this.panZoom.pan(i);
  }
  panBy(i) {
    this.panZoom.panBy(i);
  }
  zoom(i) {
    this.panZoom.zoom(i);
  }
  zoomBy(i) {
    this.panZoom.zoomBy(i);
  }
  zoomIn() {
    this.panZoom.zoomIn();
  }
  zoomOut() {
    this.panZoom.zoomOut();
  }
  zoomAtPoint(i, r) {
    this.panZoom.zoomAtPoint(i, r);
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
    this.canvas.on("click", (i) => {
      console.log(
        "SELECTION_DEBUG: Canvas click detected",
        i.target,
        "vs",
        this.canvas.node
      ), i.target === this.canvas.node || i.target && i.target.tagName === "svg" ? (console.log("SELECTION_DEBUG: Canvas clicked - deselecting all"), this.clearSelection()) : console.log(
        "SELECTION_DEBUG: Click on non-canvas element, not deselecting"
      );
    });
  }
  // New multi-node selection method - SINGLE ORCHESTRATOR
  selectNodes(i, r = !1) {
    console.log(
      "SELECTION_DEBUG: Selecting nodes",
      i.map((h) => h.id),
      "addToSelection:",
      r
    ), r || this.clearSelection(), i.forEach((h) => {
      this.selectedNodes.includes(h) || (this.selectedNodes.push(h), h.onSelected());
    }), this.updateSelectionResizeRotate();
  }
  // SINGLE ORCHESTRATOR for resize/rotate management
  updateSelectionResizeRotate() {
    if (console.log(
      "SELECTION_DEBUG: Updating resize/rotate for",
      this.selectedNodes.length,
      "selected nodes"
    ), this.nodes.allNodes.forEach((i) => {
      i.resizeRotate.isEnabled() && (i.resizeRotate.disable(), console.log("SELECTION_DEBUG: Disabled resize/rotate on", i.id)), i.isConnectionHandlesEnabled() && (i.disableConnectionHandles(), console.log("SELECTION_DEBUG: Disabled connection handles on", i.id));
    }), this.disableGroupResizeRotate(), this.selectedNodes.length === 0) {
      console.log(
        "SELECTION_DEBUG: No nodes selected - all resize/rotate disabled"
      );
      return;
    }
    if (this.selectedNodes.length === 1) {
      const i = this.selectedNodes[0];
      i.resizeRotate.enable(), i.enableConnectionHandles(), console.log(
        "SELECTION_DEBUG: Enabled individual resize/rotate and connection handles on",
        i.id
      );
    } else
      console.log(
        "SELECTION_DEBUG: Creating group resize/rotate for",
        this.selectedNodes.length,
        "nodes (connection handles disabled for multi-selection)"
      ), this.createGroupResizeRotate();
  }
  // Node-level resize/rotate control (called by Node methods)
  enableNodeResizeRotate(i) {
    this.selectedNodes.includes(i) ? console.log(
      "SELECTION_DEBUG: Node",
      i.id,
      "requested resize/rotate enable - already selected"
    ) : (console.log(
      "SELECTION_DEBUG: Node",
      i.id,
      "requested resize/rotate enable - selecting it"
    ), this.selectNodes([i], !1));
  }
  disableNodeResizeRotate(i) {
    console.log(
      "SELECTION_DEBUG: Node",
      i.id,
      "requested resize/rotate disable"
    ), i.resizeRotate.isEnabled() && i.resizeRotate.disable(), i.isConnectionHandlesEnabled() && i.disableConnectionHandles();
  }
  disableGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Disabling group resize/rotate"), this.selectedNodes.forEach((i) => {
      i.disableResizeRotate();
    }), this.groupResizeRotate && (this.groupResizeRotate.remove(), this.groupResizeRotate = null);
  }
  createGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Creating group resize/rotate controller"), this.groupResizeRotate && this.groupResizeRotate.remove();
    const i = this.calculateGroupBoundingBox();
    this.groupResizeRotate = this.canvas.group();
    const r = this.groupResizeRotate.rect(i.width, i.height).move(i.x, i.y).fill("transparent").stroke({ color: "#4a90e2", width: 2, dasharray: "5,5" });
    typeof r.select == "function" ? (r.select({
      createHandle: this.createGroupHandle.bind(this),
      updateHandle: this.updateGroupHandle.bind(this)
    }), r.on("resize", this.handleGroupResize.bind(this)), r.on("rotate", this.handleGroupRotate.bind(this))) : console.warn("svg.select.js not available for group resize/rotate");
  }
  calculateGroupBoundingBox() {
    if (this.selectedNodes.length === 0)
      return { x: 0, y: 0, width: 100, height: 100 };
    let i = 1 / 0, r = 1 / 0, h = -1 / 0, u = -1 / 0;
    return this.selectedNodes.forEach((g) => {
      const f = g.svgGroup.bbox();
      i = Math.min(i, f.x), r = Math.min(r, f.y), h = Math.max(h, f.x + f.width), u = Math.max(u, f.y + f.height);
    }), {
      x: i,
      y: r,
      width: h - i,
      height: u - r
    };
  }
  createGroupHandle(i, r, h, u) {
    i.circle(8).fill("#4a90e2").stroke("#ffffff").attr("stroke-width", 2);
  }
  updateGroupHandle(i, r, h, u) {
    i.center(r[0], r[1]);
  }
  handleGroupResize(i) {
    console.log("SELECTION_DEBUG: Group resize event", i);
    const { box: r } = i.detail, h = this.calculateGroupBoundingBox(), u = r.width / h.width, g = r.height / h.height;
    this.selectedNodes.forEach((f) => {
      const m = f.svgGroup.bbox(), y = (m.x - h.x) * u, _ = (m.y - h.y) * g, z = m.width * u, k = m.height * g;
      f.setSize(z, k), f.position(r.x + y, r.y + _);
    });
  }
  handleGroupRotate(i) {
    console.log("SELECTION_DEBUG: Group rotate event", i);
    const { angle: r } = i.detail, h = this.calculateGroupBoundingBox();
    h.x + h.width / 2, h.y + h.height / 2, this.selectedNodes.forEach((u) => {
      const g = u.getRotation();
      u.setRotation(g + r);
    });
  }
  selectNode(i) {
    this.selectNodes([i], !1);
  }
  deselectNode(i) {
    this.selectedNodes.includes(i) && (console.log("SELECTION_DEBUG: Deselecting node", i.id), this.selectedNodes = this.selectedNodes.filter((r) => r !== i), i.onDeselected(), this.selectedNodes.length === 0 ? this.disableGroupResizeRotate() : this.updateSelectionResizeRotate());
  }
  clearSelection() {
    console.log("SELECTION_DEBUG: Clearing selection"), this.selectedNodes.forEach((i) => {
      i.onDeselected();
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
function Zs(N, i = {}) {
  return new Qn(N, i);
}
typeof window < "u" && (window.SlateboxJS = Zs, window.Slate = Qn, window.Node = Wn, window.PanZoom = Jn, window.ResizeRotate = $n);
export {
  Us as Invoker,
  Wn as Node,
  Jn as PanZoom,
  $n as ResizeRotate,
  Qn as Slate,
  Zs as SlateboxJS,
  Zs as default
};
//# sourceMappingURL=slateboxjs.es.js.map
